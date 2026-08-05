param(
  [Parameter(Mandatory = $true)]
  [string]$InputPath,

  [Parameter(Mandatory = $true)]
  [string]$OutputDirectory,

  [string[]]$AssetNames = @(
    "pv-panels",
    "inverter",
    "battery-storage",
    "electricity-meter",
    "public-grid-pylon",
    "household-consumers"
  )
)

$ErrorActionPreference = "Stop"
Add-Type -AssemblyName System.Drawing

if ($AssetNames.Count -ne 6) {
  throw "Exactly six asset names are required for the 3-by-2 source sheet."
}

$resolvedInput = [System.IO.Path]::GetFullPath($InputPath)
$resolvedOutput = [System.IO.Path]::GetFullPath($OutputDirectory)

if (-not (Test-Path -LiteralPath $resolvedInput -PathType Leaf)) {
  throw "Input image does not exist: $resolvedInput"
}

[System.IO.Directory]::CreateDirectory($resolvedOutput) | Out-Null

if (-not ("RelTest.ChromaAssetProcessor" -as [type])) {
  Add-Type -ReferencedAssemblies "System.Drawing.dll" -TypeDefinition @"
using System;
using System.Drawing;
using System.Drawing.Imaging;
using System.IO;
using System.Runtime.InteropServices;

namespace RelTest {
  public static class ChromaAssetProcessor {
    public static void Process(string inputPath, string outputDirectory, string[] assetNames) {
      using (var loaded = new Bitmap(inputPath))
      using (var sheet = new Bitmap(loaded.Width, loaded.Height, PixelFormat.Format32bppArgb)) {
        using (var graphics = Graphics.FromImage(sheet)) {
          graphics.DrawImageUnscaled(loaded, 0, 0);
        }

        RemoveGreenKey(sheet);
        sheet.Save(Path.Combine(outputDirectory, "pv-system-asset-sheet.png"), ImageFormat.Png);

        int cellWidth = sheet.Width / 3;
        int rowSplit = Math.Max(1, (sheet.Height / 2) - 32);
        for (int index = 0; index < 6; index++) {
          int column = index % 3;
          int row = index / 3;
          var cell = row == 0
            ? new Rectangle(column * cellWidth, 0, cellWidth, rowSplit)
            : new Rectangle(column * cellWidth, rowSplit, cellWidth, sheet.Height - rowSplit);
          using (var cropped = CropAndTrim(sheet, cell, 20)) {
            cropped.Save(Path.Combine(outputDirectory, assetNames[index] + ".png"), ImageFormat.Png);
          }
        }
      }
    }

    private static void RemoveGreenKey(Bitmap bitmap) {
      var rectangle = new Rectangle(0, 0, bitmap.Width, bitmap.Height);
      var data = bitmap.LockBits(rectangle, ImageLockMode.ReadWrite, PixelFormat.Format32bppArgb);
      int byteCount = Math.Abs(data.Stride) * bitmap.Height;
      byte[] pixels = new byte[byteCount];
      Marshal.Copy(data.Scan0, pixels, 0, byteCount);

      for (int y = 0; y < bitmap.Height; y++) {
        int rowOffset = y * Math.Abs(data.Stride);
        for (int x = 0; x < bitmap.Width; x++) {
          int offset = rowOffset + (x * 4);
          byte blue = pixels[offset];
          byte green = pixels[offset + 1];
          byte red = pixels[offset + 2];
          byte alpha = pixels[offset + 3];

          int maxRedBlue = Math.Max(red, blue);
          int greenExcess = green - maxRedBlue;
          double removal = 0.0;
          if (green > 135 && greenExcess > 28) {
            removal = Math.Min(1.0, (greenExcess - 28) / 82.0);
          }

          if (removal > 0.0) {
            pixels[offset + 3] = (byte)Math.Round(alpha * (1.0 - removal));
            pixels[offset + 1] = (byte)Math.Min(green, maxRedBlue + 8);
          }
        }
      }

      Marshal.Copy(pixels, 0, data.Scan0, byteCount);
      bitmap.UnlockBits(data);
    }

    private static Bitmap CropAndTrim(Bitmap sheet, Rectangle cell, int padding) {
      int minX = cell.Right;
      int minY = cell.Bottom;
      int maxX = cell.Left;
      int maxY = cell.Top;

      for (int y = cell.Top; y < cell.Bottom; y++) {
        for (int x = cell.Left; x < cell.Right; x++) {
          if (sheet.GetPixel(x, y).A <= 12) continue;
          if (x < minX) minX = x;
          if (y < minY) minY = y;
          if (x > maxX) maxX = x;
          if (y > maxY) maxY = y;
        }
      }

      if (maxX < minX || maxY < minY) {
        throw new InvalidOperationException("No opaque subject found inside cell.");
      }

      minX = Math.Max(cell.Left, minX - padding);
      minY = Math.Max(cell.Top, minY - padding);
      maxX = Math.Min(cell.Right - 1, maxX + padding);
      maxY = Math.Min(cell.Bottom - 1, maxY + padding);

      var bounds = Rectangle.FromLTRB(minX, minY, maxX + 1, maxY + 1);
      var output = new Bitmap(bounds.Width, bounds.Height, PixelFormat.Format32bppArgb);
      using (var graphics = Graphics.FromImage(output)) {
        graphics.DrawImage(
          sheet,
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

[RelTest.ChromaAssetProcessor]::Process(
  $resolvedInput,
  $resolvedOutput,
  $AssetNames
)

Get-ChildItem -LiteralPath $resolvedOutput -Filter "*.png" |
  Sort-Object Name |
  Select-Object Name, Length
