param(
    [Parameter(Mandatory = $true)]
    [string]$ScenePlan,

    [int]$StartAt = 1,

    [int]$EndAt = 0
)

$ErrorActionPreference = "Stop"
$repoRoot = (Resolve-Path (Join-Path $PSScriptRoot "..")).Path
$scenePlanPath = (Resolve-Path $ScenePlan).Path
$plan = Get-Content -LiteralPath $scenePlanPath -Raw -Encoding UTF8 | ConvertFrom-Json
$orderedScenes = @($plan.scenes | Sort-Object output_slide_number)
if ($EndAt -le 0) { $EndAt = $orderedScenes.Count }
$selected = @($orderedScenes | Where-Object { $_.output_slide_number -ge $StartAt -and $_.output_slide_number -le $EndAt })
if ($selected.Count -eq 0) { throw "Keine Szenen im angeforderten Bereich." }

foreach ($scene in $selected) {
    $number = [int]$scene.output_slide_number
    $workUnit = [string]$scene.work_unit
    $animationDecision = [string]$scene.animation_plan.decision
    if ($animationDecision -eq "needs_review" -or [string]::IsNullOrWhiteSpace($animationDecision)) {
        throw "$workUnit besitzt noch keine semantische Animationsentscheidung. Entscheide zuerst static/animated nach workflow/50-animation/animation-decision-and-dramaturgy.md."
    }
    if ($animationDecision -eq "animated") {
        throw "$workUnit ist als animated geplant. Die alte automatische DOM-Heuristik ist gesperrt; setze die geplanten semantischen Gruppen und Trigger szenenweise um, bevor der Batchlauf fortgesetzt wird."
    }
    if ($animationDecision -ne "static") {
        throw "$workUnit besitzt eine unbekannte Animationsentscheidung: $animationDecision"
    }
    Write-Host "[$number/$($orderedScenes.Count)] Transformiere $workUnit ..."
    & powershell -NoProfile -ExecutionPolicy Bypass -File (Join-Path $PSScriptRoot "transform-source-svg-scene.ps1") -ScenePlan $scenePlanPath -WorkUnit $workUnit
    if ($LASTEXITCODE -ne 0) { throw "Transformation fehlgeschlagen: $workUnit" }

    $workDirectory = Join-Path $repoRoot ($scene.target_svg -replace "/", "\")
    $workDirectory = [IO.Path]::GetDirectoryName($workDirectory)
    $elementPlanPath = Join-Path $workDirectory "element-animation-plan.json"
    if (Test-Path -LiteralPath $elementPlanPath) {
        Remove-Item -LiteralPath $elementPlanPath -Force
    }

    $crosscheckPath = Join-Path $repoRoot "analysis\reports\crosschecks\$($plan.module_id)\$workUnit.json"
    & node (Join-Path $PSScriptRoot "crosscheck-transformed-scene.js") --scene-plan $scenePlanPath --work-unit $workUnit --output $crosscheckPath
    if ($LASTEXITCODE -ne 0) { throw "Content-Crosscheck fehlgeschlagen: $workUnit" }

    $qaDirectory = Join-Path $repoRoot "analysis\reports\qa\$($plan.module_id)\$workUnit"
    & node (Join-Path $PSScriptRoot "svg-rebuild-qa.js") $workDirectory --strict-design --report-dir $qaDirectory
    if ($LASTEXITCODE -ne 0) { throw "Strikte SVG-QA fehlgeschlagen: $workUnit" }

    $reportPath = Join-Path $workDirectory "transformation-report.json"
    $report = Get-Content -LiteralPath $reportPath -Raw -Encoding UTF8 | ConvertFrom-Json
    if ($report.PSObject.Properties.Name -contains "element_animation_plan") {
        $report.PSObject.Properties.Remove("element_animation_plan")
    }
    $report.qa = [ordered]@{
        status = "passed"
        content_crosscheck = $crosscheckPath.Substring($repoRoot.Length + 1).Replace("\", "/")
        svg_qa_report = (Join-Path $qaDirectory "svg-qa-report.json").Substring($repoRoot.Length + 1).Replace("\", "/")
        issues = @()
        warnings = @()
        open_questions = @()
    }
    [IO.File]::WriteAllText($reportPath, ($report | ConvertTo-Json -Depth 40) + [Environment]::NewLine, [Text.UTF8Encoding]::new($false))
}

Write-Host "Freigegebene Szenen in diesem Lauf: $($selected.Count)"
