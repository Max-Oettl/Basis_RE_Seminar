param(
  [Parameter(Mandatory = $true)]
  [string]$InputPath,

  [Parameter(Mandatory = $true)]
  [string]$OutputPath,

  [int]$CanvasSize = 1024,

  [double]$SafeMarginRatio = 0.10,

  [string]$NavyHex = "#031334",

  [string]$GreenHex = "#00A754",

  [string]$AccentHex = ""
)

$ErrorActionPreference = "Stop"
Add-Type -AssemblyName System.Drawing

$resolvedInput = [System.IO.Path]::GetFullPath($InputPath)
$resolvedOutput = [System.IO.Path]::GetFullPath($OutputPath)
[System.IO.Directory]::CreateDirectory([System.IO.Path]::GetDirectoryName($resolvedOutput)) | Out-Null

if (-not ("RelTest.EducationPictogramFlattener" -as [type])) {
  Add-Type -ReferencedAssemblies "System.Drawing.dll" -TypeDefinition @"
using System;
using System.Drawing;
using System.Drawing.Imaging;

namespace RelTest {
  public static class EducationPictogramFlattener {
    public static void Process(string inputPath, string outputPath, int canvasSize, double safeMarginRatio, string navyHex, string accentHex) {
      using (var source = new Bitmap(inputPath))
      using (var flat = new Bitmap(source.Width, source.Height, PixelFormat.Format32bppArgb)) {
        var navy = ColorTranslator.FromHtml(navyHex);
        var accent = ColorTranslator.FromHtml(accentHex);
        bool accentRedDominant = accent.R > accent.G * 1.15 && accent.R > accent.B * 1.10;
        bool accentGreenDominant = accent.G > accent.R * 1.18 && accent.G > accent.B * 1.08;
        bool accentCyanDominant = accent.B > accent.R * 1.20 && accent.G > accent.R * 1.20;
        for (int y = 0; y < source.Height; y++) {
          for (int x = 0; x < source.Width; x++) {
            var pixel = source.GetPixel(x, y);
            if (pixel.A == 0) {
              flat.SetPixel(x, y, Color.Transparent);
              continue;
            }
            bool isAccent = false;
            if (accentRedDominant) {
              isAccent = pixel.R > pixel.G * 1.15 && pixel.R > pixel.B * 1.10;
            } else if (accentGreenDominant) {
              isAccent = pixel.G > pixel.R * 1.18 && pixel.G > pixel.B * 1.08;
            } else if (accentCyanDominant) {
              isAccent = pixel.B > pixel.R * 1.20 && pixel.G > pixel.R * 1.20 && pixel.G > pixel.B * 0.55;
            }
            var target = isAccent ? accent : navy;
            flat.SetPixel(x, y, Color.FromArgb(pixel.A, target.R, target.G, target.B));
          }
        }
        int size = Math.Max(1024, canvasSize);
        double margin = Math.Max(0.08, Math.Min(0.30, safeMarginRatio));
        int available = (int)Math.Floor(size * (1.0 - 2.0 * margin));
        double scale = Math.Min(available / (double)flat.Width, available / (double)flat.Height);
        int targetWidth = Math.Max(1, (int)Math.Round(flat.Width * scale));
        int targetHeight = Math.Max(1, (int)Math.Round(flat.Height * scale));
        int targetX = (size - targetWidth) / 2;
        int targetY = (size - targetHeight) / 2;

        using (var output = new Bitmap(size, size, PixelFormat.Format32bppArgb)) {
          using (var graphics = Graphics.FromImage(output)) {
            graphics.Clear(Color.Transparent);
            graphics.CompositingMode = System.Drawing.Drawing2D.CompositingMode.SourceCopy;
            graphics.CompositingQuality = System.Drawing.Drawing2D.CompositingQuality.HighQuality;
            graphics.InterpolationMode = System.Drawing.Drawing2D.InterpolationMode.HighQualityBicubic;
            graphics.PixelOffsetMode = System.Drawing.Drawing2D.PixelOffsetMode.HighQuality;
            graphics.DrawImage(flat, new Rectangle(targetX, targetY, targetWidth, targetHeight));
          }
          output.Save(outputPath, ImageFormat.Png);
        }
      }
    }
  }
}
"@
}

$resolvedAccentHex = if ([string]::IsNullOrWhiteSpace($AccentHex)) { $GreenHex } else { $AccentHex }
[RelTest.EducationPictogramFlattener]::Process($resolvedInput, $resolvedOutput, $CanvasSize, $SafeMarginRatio, $NavyHex, $resolvedAccentHex)
Get-Item -LiteralPath $resolvedOutput | Select-Object Name, Length
