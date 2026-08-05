param(
  [string]$WorkspaceRoot = (Split-Path -Parent $PSScriptRoot)
)

$ErrorActionPreference = "Stop"
Add-Type -AssemblyName System.Drawing

$sourceRoot = Join-Path $WorkspaceRoot "analysis\redesign-assets\RE2-ch4-source-media"
$previewRoot = Join-Path $WorkspaceRoot "analysis\reports\RE2-full-module-source-previews"
$targetRoot = Join-Path $WorkspaceRoot "components\image-library\re2-ch4-fmea"
[System.IO.Directory]::CreateDirectory($targetRoot) | Out-Null

$copies = @{
  "source_086\img3.png" = "gear-section.png"
  "source_086\img4.png" = "gear-schematic.png"
  "source_087\img3.png" = "parts-antrieb.png"
  "source_087\img4.png" = "parts-housing.png"
  "source_092\img4.png" = "function-assignment-principle.png"
  "source_103\img4.png" = "generic-function-error-tree.png"
  "source_104\img3.png" = "error-network-tree.png"
  "source_118\img3.png" = "risk-criteria-table.png"
  "source_119\img4.png" = "risk-table-full.png"
  "source_121\img4.png" = "task-priority-compact.png"
  "source_122\img4.png" = "task-priority-matrix.png"
  "source_142\img4.png" = "step1-scope-diagram.png"
  "source_145\img4.png" = "design-structure.png"
  "source_146\img4.png" = "process-structure.png"
  "source_149\img4.png" = "design-function-tree.png"
  "source_150\img4.png" = "process-function-tree.png"
  "source_153\img4.png" = "design-error-tree.png"
  "source_154\img4.png" = "process-error-tree.png"
  "source_159\img4.png" = "task-priority-combined.png"
}

foreach ($entry in $copies.GetEnumerator()) {
  Copy-Item -LiteralPath (Join-Path $sourceRoot $entry.Key) -Destination (Join-Path $targetRoot $entry.Value) -Force
}

foreach ($slide in 133..136) {
  $sourcePath = Join-Path $previewRoot ("source_{0}.png" -f $slide.ToString("000"))
  $outputPath = Join-Path $targetRoot ("fmea-form-{0}.png" -f $slide)
  $sourceImage = [System.Drawing.Image]::FromFile($sourcePath)
  try {
    $crop = New-Object System.Drawing.Bitmap 1100, 485
    try {
      $graphics = [System.Drawing.Graphics]::FromImage($crop)
      try {
        $graphics.Clear([System.Drawing.Color]::White)
        $graphics.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
        $graphics.DrawImage(
          $sourceImage,
          (New-Object System.Drawing.Rectangle 0, 0, 1100, 485),
          (New-Object System.Drawing.Rectangle 90, 160, 1100, 485),
          [System.Drawing.GraphicsUnit]::Pixel
        )
        $repairColor = if ($slide -eq 136) {
          [System.Drawing.Color]::FromArgb(255, 255, 146)
        } else {
          [System.Drawing.Color]::White
        }
        $repairBrush = New-Object System.Drawing.SolidBrush $repairColor
        $repairPen = New-Object System.Drawing.Pen ([System.Drawing.Color]::FromArgb(31, 41, 51), 1)
        try {
          $graphics.FillRectangle($repairBrush, 1038, 407, 62, 78)
          $graphics.DrawLine($repairPen, 1053, 407, 1053, 485)
          $graphics.DrawLine($repairPen, 1092, 407, 1092, 485)
          $graphics.DrawLine($repairPen, 1038, 418, 1100, 418)
          $graphics.DrawLine($repairPen, 1038, 472, 1100, 472)
        } finally {
          $repairBrush.Dispose()
          $repairPen.Dispose()
        }
      } finally {
        $graphics.Dispose()
      }
      $crop.Save($outputPath, [System.Drawing.Imaging.ImageFormat]::Png)
    } finally {
      $crop.Dispose()
    }
  } finally {
    $sourceImage.Dispose()
  }
}

Get-ChildItem -LiteralPath $targetRoot | Sort-Object Name | Select-Object Name, Length
