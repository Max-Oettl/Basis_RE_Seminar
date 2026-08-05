param(
  [Parameter(Mandatory = $true)]
  [string]$InputPath,

  [Parameter(Mandatory = $true)]
  [string]$OutputPath,

  [int]$Padding = 18,

  [switch]$KeepCanvas
)

$ErrorActionPreference = "Stop"
Add-Type -AssemblyName System.Drawing

$resolvedInput = [System.IO.Path]::GetFullPath($InputPath)
$resolvedOutput = [System.IO.Path]::GetFullPath($OutputPath)

if (-not (Test-Path -LiteralPath $resolvedInput -PathType Leaf)) {
  throw "Input image does not exist: $resolvedInput"
}

[System.IO.Directory]::CreateDirectory([System.IO.Path]::GetDirectoryName($resolvedOutput)) | Out-Null

if (-not ("RelTest.MagentaChromaProcessor" -as [type])) {
  Add-Type -ReferencedAssemblies "System.Drawing.dll" -TypeDefinition @"
using System;
using System.Drawing;
using System.Drawing.Imaging;
using System.Runtime.InteropServices;

namespace RelTest {
  public static class MagentaChromaProcessor {
    public static void Process(string inputPath, string outputPath, int padding, bool keepCanvas) {
      using (var loaded = new Bitmap(inputPath))
      using (var source = new Bitmap(loaded.Width, loaded.Height, PixelFormat.Format32bppArgb)) {
        using (var graphics = Graphics.FromImage(source)) {
          graphics.DrawImageUnscaled(loaded, 0, 0);
        }

        RemoveKey(source);
        if (keepCanvas) {
          source.Save(outputPath, ImageFormat.Png);
        } else {
          using (var output = Trim(source, Math.Max(0, padding))) {
            output.Save(outputPath, ImageFormat.Png);
          }
        }
      }
    }

    private static void RemoveKey(Bitmap bitmap) {
      var rectangle = new Rectangle(0, 0, bitmap.Width, bitmap.Height);
      var data = bitmap.LockBits(rectangle, ImageLockMode.ReadWrite, PixelFormat.Format32bppArgb);
      int stride = Math.Abs(data.Stride);
      int byteCount = stride * bitmap.Height;
      byte[] pixels = new byte[byteCount];
      Marshal.Copy(data.Scan0, pixels, 0, byteCount);

      for (int y = 0; y < bitmap.Height; y++) {
        int rowOffset = y * stride;
        for (int x = 0; x < bitmap.Width; x++) {
          int offset = rowOffset + (x * 4);
          int blue = pixels[offset];
          int green = pixels[offset + 1];
          int red = pixels[offset + 2];
          int alpha = pixels[offset + 3];

          int magentaBase = Math.Min(red, blue);
          int magentaExcess = magentaBase - green;
          double removal = 0.0;
          if (red > 135 && blue > 135 && magentaExcess > 24) {
            removal = Math.Min(1.0, (magentaExcess - 24) / 96.0);
          }

          if (removal > 0.0) {
            pixels[offset + 3] = (byte)Math.Round(alpha * (1.0 - removal));
            int neutral = Math.Max(green, Math.Min(red, blue) - 10);
            pixels[offset] = (byte)Math.Round(blue + ((neutral - blue) * removal));
            pixels[offset + 2] = (byte)Math.Round(red + ((neutral - red) * removal));
          }

          // Fully transparent RGB data is invisible but inflates embedded PNGs
          // dramatically. Normalize it so scene SVGs stay browser-renderable.
          if (pixels[offset + 3] == 0) {
            pixels[offset] = 0;
            pixels[offset + 1] = 0;
            pixels[offset + 2] = 0;
          }
        }
      }

      Marshal.Copy(pixels, 0, data.Scan0, byteCount);
      bitmap.UnlockBits(data);
    }

    private static Bitmap Trim(Bitmap source, int padding) {
      int minX = source.Width;
      int minY = source.Height;
      int maxX = -1;
      int maxY = -1;

      for (int y = 0; y < source.Height; y++) {
        for (int x = 0; x < source.Width; x++) {
          if (source.GetPixel(x, y).A <= 14) continue;
          minX = Math.Min(minX, x);
          minY = Math.Min(minY, y);
          maxX = Math.Max(maxX, x);
          maxY = Math.Max(maxY, y);
        }
      }

      if (maxX < minX || maxY < minY) {
        throw new InvalidOperationException("No opaque subject found after chroma-key removal.");
      }

      minX = Math.Max(0, minX - padding);
      minY = Math.Max(0, minY - padding);
      maxX = Math.Min(source.Width - 1, maxX + padding);
      maxY = Math.Min(source.Height - 1, maxY + padding);
      var bounds = Rectangle.FromLTRB(minX, minY, maxX + 1, maxY + 1);
      var output = new Bitmap(bounds.Width, bounds.Height, PixelFormat.Format32bppArgb);
      using (var graphics = Graphics.FromImage(output)) {
        graphics.DrawImage(
          source,
          new Rectangle(0, 0, output.Width, output.Height),
          bounds,
          GraphicsUnit.Pixel
        );
      }
      return output;
    }
  }
}
"@
}

[RelTest.MagentaChromaProcessor]::Process($resolvedInput, $resolvedOutput, $Padding, $KeepCanvas.IsPresent)
Get-Item -LiteralPath $resolvedOutput | Select-Object Name, Length
