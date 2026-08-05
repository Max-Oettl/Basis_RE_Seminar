param(
  [Parameter(Mandatory = $true)]
  [string]$InputDirectory,

  [Parameter(Mandatory = $true)]
  [string]$OutputDirectory,

  [string]$Pattern = "slide_*.png",
  [int]$Columns = 4,
  [int]$Rows = 4
)

$ErrorActionPreference = "Stop"
Add-Type -AssemblyName System.Drawing

$resolvedInput = [System.IO.Path]::GetFullPath($InputDirectory)
$resolvedOutput = [System.IO.Path]::GetFullPath($OutputDirectory)
[System.IO.Directory]::CreateDirectory($resolvedOutput) | Out-Null

$files = @(Get-ChildItem -LiteralPath $resolvedInput -Filter $Pattern | Sort-Object Name)
if ($files.Count -eq 0) {
  throw "No preview files found in $resolvedInput with pattern $Pattern"
}

$thumbWidth = 480
$thumbHeight = 270
$labelHeight = 34
$cellHeight = $thumbHeight + $labelHeight
$pageSize = $Columns * $Rows
$pageCount = [Math]::Ceiling($files.Count / [double]$pageSize)

for ($page = 0; $page -lt $pageCount; $page++) {
  $start = $page * $pageSize
  $end = [Math]::Min($files.Count, $start + $pageSize)
  $pageFiles = $files[$start..($end - 1)]

  $canvas = New-Object System.Drawing.Bitmap ($Columns * $thumbWidth), ($Rows * $cellHeight)
  try {
    $graphics = [System.Drawing.Graphics]::FromImage($canvas)
    try {
      $graphics.Clear([System.Drawing.Color]::White)
      $graphics.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
      $font = New-Object System.Drawing.Font "Segoe UI", 13, ([System.Drawing.FontStyle]::Bold)
      $brush = New-Object System.Drawing.SolidBrush ([System.Drawing.Color]::FromArgb(16, 42, 67))
      try {
        for ($index = 0; $index -lt $pageFiles.Count; $index++) {
          $column = $index % $Columns
          $row = [Math]::Floor($index / $Columns)
          $x = $column * $thumbWidth
          $y = $row * $cellHeight
          $image = [System.Drawing.Image]::FromFile($pageFiles[$index].FullName)
          try {
            $graphics.DrawImage($image, $x, $y, $thumbWidth, $thumbHeight)
          } finally {
            $image.Dispose()
          }
          $graphics.DrawString($pageFiles[$index].BaseName, $font, $brush, $x + 10, $y + $thumbHeight + 5)
        }
      } finally {
        $font.Dispose()
        $brush.Dispose()
      }
    } finally {
      $graphics.Dispose()
    }

    $firstName = $pageFiles[0].BaseName
    $lastName = $pageFiles[$pageFiles.Count - 1].BaseName
    $outputPath = Join-Path $resolvedOutput ("contact_{0}_{1}.png" -f $firstName, $lastName)
    $canvas.Save($outputPath, [System.Drawing.Imaging.ImageFormat]::Png)
  } finally {
    $canvas.Dispose()
  }
}

Get-ChildItem -LiteralPath $resolvedOutput -Filter "contact_*.png" | Sort-Object Name | Select-Object Name, Length
