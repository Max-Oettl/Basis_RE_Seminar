param(
  [ValidateRange(1, 65535)]
  [int]$Port = 4174,

  [switch]$NoOpen
)

$ErrorActionPreference = "Stop"
$repoRoot = (Resolve-Path (Join-Path $PSScriptRoot "..\..")).Path
$serverPath = Join-Path $PSScriptRoot "server.js"

function Test-ViewerPortAvailable {
  param([int]$PortNumber)

  $probe = [System.Net.Sockets.TcpListener]::new(
    [System.Net.IPAddress]::Loopback,
    $PortNumber
  )
  try {
    $probe.Start()
    return $true
  } catch [System.Net.Sockets.SocketException] {
    return $false
  } finally {
    try { $probe.Stop() } catch { }
  }
}

function Get-ViewerPortProcessIds {
  param([int]$PortNumber)

  $endpointPattern = "^(?:127\.0\.0\.1|0\.0\.0\.0|\[::1\]|\[::\]):$PortNumber$"
  $processIds = foreach ($line in (& netstat.exe -ano -p TCP)) {
    $parts = @($line -split "\s+" | Where-Object { $_ })
    if ($parts.Count -lt 5 -or $parts[0] -ne "TCP") { continue }
    if ($parts[1] -notmatch $endpointPattern) { continue }
    $candidate = $parts[$parts.Count - 1]
    if ($candidate -notmatch "^\d+$" -or [int]$candidate -le 0) { continue }
    [int]$candidate
  }
  return @($processIds | Sort-Object -Unique)
}

if (-not (Test-ViewerPortAvailable -PortNumber $Port)) {
  $occupyingProcessIds = @(Get-ViewerPortProcessIds -PortNumber $Port)
  if (-not $occupyingProcessIds.Count) {
    throw "Port $Port ist belegt, aber der belegende Prozess konnte nicht ermittelt werden."
  }

  foreach ($occupyingProcessId in $occupyingProcessIds) {
    $occupyingProcess = Get-Process -Id $occupyingProcessId -ErrorAction Stop
    Write-Host "Port $Port ist durch $($occupyingProcess.ProcessName) (PID $occupyingProcessId) belegt. Prozess wird beendet."
    Stop-Process -Id $occupyingProcessId -Force -ErrorAction Stop
  }

  $deadline = [DateTime]::UtcNow.AddSeconds(5)
  while (-not (Test-ViewerPortAvailable -PortNumber $Port)) {
    if ([DateTime]::UtcNow -ge $deadline) {
      throw "Port $Port wurde nach dem Beenden des Prozesses nicht rechtzeitig frei."
    }
    Start-Sleep -Milliseconds 100
  }
}

$nodeCommand = Get-Command node -ErrorAction Stop
$serverArguments = @($serverPath, [string]$Port)
if ($NoOpen) { $serverArguments += "--no-open" }

Write-Host "Basis Rebuild Viewer startet unter http://127.0.0.1:$Port"
Push-Location $repoRoot
try {
  & $nodeCommand.Source @serverArguments
  exit $LASTEXITCODE
} finally {
  Pop-Location
}
