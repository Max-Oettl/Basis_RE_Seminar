"use strict";

const fs = require("node:fs");
const path = require("node:path");
const zlib = require("node:zlib");

const defaultRepoRoot = path.resolve(__dirname, "..");
const tokenPath = path.join(defaultRepoRoot, "brand", "reltest-education-pictogram-tokens.json");
const rawPictogramTokens = JSON.parse(fs.readFileSync(tokenPath, "utf8"));
const defaultTokens = Object.freeze({
  styleProfile: rawPictogramTokens.style,
  maximumSemanticLayers: rawPictogramTokens.geometry.maximumSemanticLayers,
  maximumBrandColors: rawPictogramTokens.geometry.maximumForegroundColors,
  generatedRasterMasterMinPx: rawPictogramTokens.rasterVariant.masterMinimumPx,
  generatedRasterSafeMarginRatio: rawPictogramTokens.rasterVariant.safeMarginRatio,
  minimumPlacementPx: rawPictogramTokens.displaySizes.minimumPlacementPx,
  minimumNonTextContrast: rawPictogramTokens.elearning.contrastRatioMinimum,
  semanticRoles: rawPictogramTokens.elearning.semanticRoles,
  allowedBrandColors: new Set([
    ...rawPictogramTokens.colors.allowedForegroundOnLight,
    ...rawPictogramTokens.colors.allowedForegroundOnDark,
  ].map((color) => color.toUpperCase())),
});

function requiredString(value, field, errors) {
  if (typeof value !== "string" || !value.trim()) errors.push(`${field} muss ein nichtleerer String sein.`);
}

function parseHexColor(value) {
  if (typeof value !== "string") return null;
  const match = value.trim().match(/^#([0-9a-f]{6})$/i);
  if (!match) return null;
  const n = Number.parseInt(match[1], 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}

function relativeLuminance(color) {
  const rgb = parseHexColor(color);
  if (!rgb) return null;
  const linear = rgb.map((channel) => {
    const value = channel / 255;
    return value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * linear[0] + 0.7152 * linear[1] + 0.0722 * linear[2];
}

function contrastRatio(foreground, background) {
  const a = relativeLuminance(foreground);
  const b = relativeLuminance(background);
  if (a == null || b == null) return null;
  return (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05);
}

function paethPredictor(a, b, c) {
  const p = a + b - c;
  const pa = Math.abs(p - a);
  const pb = Math.abs(p - b);
  const pc = Math.abs(p - c);
  if (pa <= pb && pa <= pc) return a;
  if (pb <= pc) return b;
  return c;
}

function inspectPng(filePath, safeMarginRatio) {
  const buffer = fs.readFileSync(filePath);
  const signature = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);
  if (buffer.length < 33 || !buffer.subarray(0, 8).equals(signature)) {
    throw new Error("Datei ist kein gueltiges PNG.");
  }

  let offset = 8;
  let ihdr = null;
  let transparency = null;
  const idat = [];
  while (offset + 12 <= buffer.length) {
    const length = buffer.readUInt32BE(offset);
    const type = buffer.toString("ascii", offset + 4, offset + 8);
    const start = offset + 8;
    const end = start + length;
    if (end + 4 > buffer.length) throw new Error("PNG-Chunk ist abgeschnitten.");
    const data = buffer.subarray(start, end);
    if (type === "IHDR") {
      ihdr = {
        width: data.readUInt32BE(0),
        height: data.readUInt32BE(4),
        bitDepth: data[8],
        colorType: data[9],
        interlace: data[12],
      };
    } else if (type === "IDAT") {
      idat.push(data);
    } else if (type === "tRNS") {
      transparency = data;
    } else if (type === "IEND") {
      break;
    }
    offset = end + 4;
  }

  if (!ihdr || !idat.length) throw new Error("PNG besitzt kein vollstaendiges IHDR/IDAT.");
  if (ihdr.bitDepth !== 8) throw new Error(`Nur 8-Bit-PNGs sind pruefbar, erhalten: ${ihdr.bitDepth}.`);
  if (ihdr.interlace !== 0) throw new Error("Interlaced PNGs sind fuer den Piktogrammcheck nicht zugelassen.");

  const channelCount = { 0: 1, 2: 3, 3: 1, 4: 2, 6: 4 }[ihdr.colorType];
  if (!channelCount) throw new Error(`Nicht unterstuetzter PNG-Farbtyp: ${ihdr.colorType}.`);
  const rowBytes = ihdr.width * channelCount;
  const raw = zlib.inflateSync(Buffer.concat(idat));
  if (raw.length !== ihdr.height * (rowBytes + 1)) {
    throw new Error("PNG-Scandaten passen nicht zu Breite, Hoehe und Farbtyp.");
  }

  const rows = [];
  let rawOffset = 0;
  for (let y = 0; y < ihdr.height; y += 1) {
    const filter = raw[rawOffset];
    rawOffset += 1;
    const source = raw.subarray(rawOffset, rawOffset + rowBytes);
    rawOffset += rowBytes;
    const row = Buffer.allocUnsafe(rowBytes);
    const previous = rows[y - 1];
    for (let x = 0; x < rowBytes; x += 1) {
      const left = x >= channelCount ? row[x - channelCount] : 0;
      const up = previous ? previous[x] : 0;
      const upLeft = previous && x >= channelCount ? previous[x - channelCount] : 0;
      let value;
      if (filter === 0) value = source[x];
      else if (filter === 1) value = (source[x] + left) & 255;
      else if (filter === 2) value = (source[x] + up) & 255;
      else if (filter === 3) value = (source[x] + Math.floor((left + up) / 2)) & 255;
      else if (filter === 4) value = (source[x] + paethPredictor(left, up, upLeft)) & 255;
      else throw new Error(`Unbekannter PNG-Filter: ${filter}.`);
      row[x] = value;
    }
    rows.push(row);
  }

  function alphaAt(x, y) {
    const row = rows[y];
    if (ihdr.colorType === 6) return row[x * 4 + 3];
    if (ihdr.colorType === 4) return row[x * 2 + 1];
    if (ihdr.colorType === 3) {
      const index = row[x];
      return transparency && index < transparency.length ? transparency[index] : 255;
    }
    if (ihdr.colorType === 0 && transparency && transparency.length >= 2) {
      return row[x] === transparency.readUInt16BE(0) ? 0 : 255;
    }
    if (ihdr.colorType === 2 && transparency && transparency.length >= 6) {
      const base = x * 3;
      const transparent = row[base] === transparency.readUInt16BE(0)
        && row[base + 1] === transparency.readUInt16BE(2)
        && row[base + 2] === transparency.readUInt16BE(4);
      return transparent ? 0 : 255;
    }
    return 255;
  }

  const alphaCapable = [4, 6].includes(ihdr.colorType) || Boolean(transparency);
  let transparentPixels = 0;
  let visiblePixels = 0;
  let minX = ihdr.width;
  let minY = ihdr.height;
  let maxX = -1;
  let maxY = -1;
  for (let y = 0; y < ihdr.height; y += 1) {
    for (let x = 0; x < ihdr.width; x += 1) {
      const alpha = alphaAt(x, y);
      if (alpha < 250) transparentPixels += 1;
      if (alpha > 12) {
        visiblePixels += 1;
        minX = Math.min(minX, x);
        minY = Math.min(minY, y);
        maxX = Math.max(maxX, x);
        maxY = Math.max(maxY, y);
      }
    }
  }

  const margins = visiblePixels
    ? {
        left: minX / ihdr.width,
        right: (ihdr.width - 1 - maxX) / ihdr.width,
        top: minY / ihdr.height,
        bottom: (ihdr.height - 1 - maxY) / ihdr.height,
      }
    : { left: 0, right: 0, top: 0, bottom: 0 };
  const minMargin = Math.min(margins.left, margins.right, margins.top, margins.bottom);

  return {
    ...ihdr,
    alphaCapable,
    transparentPixelRatio: transparentPixels / (ihdr.width * ihdr.height),
    visiblePixelRatio: visiblePixels / (ihdr.width * ihdr.height),
    margins,
    minMargin,
    safeMarginPassed: minMargin + 0.002 >= safeMarginRatio,
  };
}

function validatePictogramBrief(briefPath, options = {}) {
  const errors = [];
  const warnings = [];
  const release = Boolean(options.release);
  const repoRoot = path.resolve(options.repoRoot || defaultRepoRoot);
  const tokens = options.tokens || defaultTokens;
  let brief;
  try {
    brief = JSON.parse(fs.readFileSync(briefPath, "utf8"));
  } catch (error) {
    return { errors: [`Asset-Brief kann nicht gelesen werden: ${error.message}`], warnings, brief: null, png: null };
  }

  if (brief.schemaVersion !== "reltestEducationPictogramAsset/v1") errors.push("schemaVersion muss reltestEducationPictogramAsset/v1 sein.");
  requiredString(brief.assetId, "assetId", errors);
  requiredString(brief.file, "file", errors);
  requiredString(brief.assetType, "assetType", errors);
  const allowedAssetTypes = [
    "generated_png",
    "extracted_png",
    "user_asset_required",
  ];
  if (!allowedAssetTypes.includes(brief.assetType)) errors.push("assetType ist ungueltig.");
  if (release && brief.assetType === "user_asset_required") errors.push("user_asset_required kann nicht freigegeben werden.");
  if (brief.styleProfile !== tokens.styleProfile) errors.push(`styleProfile muss ${tokens.styleProfile} sein.`);
  if (release && brief.status !== "accepted") errors.push("Release-Pruefung verlangt status=accepted.");

  const semantics = brief.semantics || {};
  requiredString(semantics.concept, "semantics.concept", errors);
  requiredString(semantics.learningFunction, "semantics.learningFunction", errors);
  requiredString(semantics.reuseKey, "semantics.reuseKey", errors);
  if (!tokens.semanticRoles.includes(semantics.learningFunction)) {
    errors.push(`semantics.learningFunction muss eine kanonische semantische Rolle sein: ${tokens.semanticRoles.join(", ")}.`);
  }
  if (!Array.isArray(semantics.mustShowFeatures) || semantics.mustShowFeatures.length > 3) errors.push("semantics.mustShowFeatures muss ein Array mit hoechstens drei Eintraegen sein.");
  for (const field of ["mustNotImply", "confusableWith"]) {
    if (!Array.isArray(semantics[field])) errors.push(`semantics.${field} muss ein Array sein.`);
  }

  const style = brief.visualStyle || {};
  const maximumBrandColors = semantics.learningFunction === "comparison-marker"
    ? Math.max(tokens.maximumBrandColors, 3)
    : tokens.maximumBrandColors;
  if (style.flat2d !== true) errors.push("visualStyle.flat2d muss true sein.");
  if (!['front', 'orthographic'].includes(style.perspective)) errors.push("visualStyle.perspective muss front oder orthographic sein.");
  if (style.dominantSilhouette !== true) errors.push("visualStyle.dominantSilhouette muss true sein.");
  if (!Number.isInteger(style.semanticLayers) || style.semanticLayers < 1 || style.semanticLayers > tokens.maximumSemanticLayers) {
    errors.push(`visualStyle.semanticLayers muss zwischen 1 und ${tokens.maximumSemanticLayers} liegen.`);
  }
  if (!Array.isArray(style.brandColors) || style.brandColors.length < 1 || style.brandColors.length > maximumBrandColors) {
    errors.push(`visualStyle.brandColors muss 1 bis ${maximumBrandColors} Farben enthalten.`);
  } else {
    for (const color of style.brandColors) {
      if (!parseHexColor(color)) errors.push(`Ungueltige Markenfarbe: ${color}.`);
      else if (!tokens.allowedBrandColors.has(color.toUpperCase())) errors.push(`Farbe liegt ausserhalb der Education-Piktogrammpalette: ${color}.`);
    }
  }
  const forbiddenFlags = ["gradients", "shadows", "threeDimensional", "isometric", "photorealistic", "glow", "texture", "embeddedText", "logo", "watermark"];
  for (const field of forbiddenFlags) if (style[field] !== false) errors.push(`visualStyle.${field} muss false sein.`);

  const learning = brief.learningUse || {};
  const minimumTargetPlacement = ["generated_png", "extracted_png"].includes(brief.assetType)
    ? tokens.minimumPlacementPx.objectPictogram
    : tokens.minimumPlacementPx.compactUniversal;
  if (!Number.isFinite(learning.targetPlacementPx) || learning.targetPlacementPx < minimumTargetPlacement) {
    errors.push(`learningUse.targetPlacementPx muss fuer ${brief.assetType} mindestens ${minimumTargetPlacement} sein.`);
  }
  if (learning.requiresTextLabelOnFirstUse === true) requiredString(semantics.firstUseLabel, "semantics.firstUseLabel", errors);
  if (learning.colorIndependentMeaning !== true) errors.push("learningUse.colorIndependentMeaning muss true sein.");
  const scaleTests = learning.smallScaleTests || {};
  if (release) {
    if (scaleTests.at48px !== "passed") errors.push("Release-Pruefung verlangt smallScaleTests.at48px=passed.");
    if (scaleTests.scene960x540 !== "passed") errors.push("Release-Pruefung verlangt smallScaleTests.scene960x540=passed.");
    if (!['passed', 'not_required'].includes(scaleTests.at32px)) errors.push("smallScaleTests.at32px muss passed oder not_required sein.");
  }

  const accessibility = brief.accessibility || {};
  if (accessibility.redundantWithVisibleLabel === false) requiredString(accessibility.accessibleName, "accessibility.accessibleName", errors);
  if (!Array.isArray(accessibility.contrastPairs) || accessibility.contrastPairs.length === 0) {
    errors.push("accessibility.contrastPairs muss mindestens ein Farbpaar enthalten.");
  } else {
    for (const [index, pair] of accessibility.contrastPairs.entries()) {
      const ratio = contrastRatio(pair.foreground, pair.background);
      const minimum = Math.max(tokens.minimumNonTextContrast, Number(pair.minimumRatio) || 0);
      if (ratio == null) errors.push(`contrastPairs[${index}] enthaelt ungueltige Hexfarben.`);
      else if (ratio < minimum) errors.push(`contrastPairs[${index}] erreicht nur ${ratio.toFixed(2)}:1 statt ${minimum}:1.`);
    }
  }

  const review = brief.review || {};
  if (release) {
    for (const field of ["semantic", "style", "eLearning", "accessibilityTechnical"]) {
      if (review[field] !== "passed") errors.push(`Release-Pruefung verlangt review.${field}=passed.`);
    }
  }

  let png = null;
  if (brief.assetType === "generated_png" || brief.assetType === "extracted_png") {
    if (!brief.file || path.isAbsolute(brief.file)) {
      errors.push("file muss ein relativer lokaler Pfad sein.");
    } else {
      const assetPath = path.resolve(repoRoot, brief.file);
      if (!assetPath.startsWith(`${repoRoot}${path.sep}`) && assetPath !== repoRoot) {
        errors.push("file verlaesst den erlaubten Projektpfad.");
      } else if (!fs.existsSync(assetPath)) {
        errors.push(`PNG-Asset fehlt: ${brief.file}.`);
      } else {
        const raster = brief.raster || {};
        const safeMarginRatio = Number(raster.safeMarginRatio);
        if (!Number.isFinite(safeMarginRatio) || safeMarginRatio < tokens.generatedRasterSafeMarginRatio) {
          errors.push(`raster.safeMarginRatio muss mindestens ${tokens.generatedRasterSafeMarginRatio} sein.`);
        }
        try {
          png = inspectPng(assetPath, Number.isFinite(safeMarginRatio) ? safeMarginRatio : tokens.generatedRasterSafeMarginRatio);
          if (raster.widthPx !== png.width || raster.heightPx !== png.height) errors.push("Dokumentierte Rasterabmessungen stimmen nicht mit dem PNG ueberein.");
          if (brief.assetType === "generated_png" && Math.min(png.width, png.height) < tokens.generatedRasterMasterMinPx) {
            errors.push(`Generiertes Master-PNG muss mindestens ${tokens.generatedRasterMasterMinPx} px gross sein.`);
          }
          if (Math.max(png.width, png.height) / Math.min(png.width, png.height) > 1.1) errors.push("Piktogramm-Master muss quadratisch sein.");
          if (!png.alphaCapable || png.transparentPixelRatio < 0.01) errors.push("PNG besitzt keinen wirksamen transparenten Hintergrund.");
          if (png.visiblePixelRatio < 0.01) errors.push("PNG enthaelt kein ausreichend sichtbares Motiv.");
          if (!png.safeMarginPassed) errors.push(`PNG unterschreitet den transparenten Sicherheitsrand; kleinster Rand ${(png.minMargin * 100).toFixed(1)} %.`);
          if (raster.transparentBackground !== true) errors.push("raster.transparentBackground muss true sein.");
        } catch (error) {
          errors.push(`PNG-Pruefung fehlgeschlagen: ${error.message}`);
        }
      }
    }
  }

  return { errors, warnings, brief, png };
}

function parseArgs(argv) {
  const args = { release: false, json: false, briefPath: "" };
  for (let index = 0; index < argv.length; index += 1) {
    const value = argv[index];
    if (value === "--release") args.release = true;
    else if (value === "--json") args.json = true;
    else if (value === "--brief") args.briefPath = argv[++index] || "";
    else if (!args.briefPath) args.briefPath = value;
  }
  return args;
}

if (require.main === module) {
  const args = parseArgs(process.argv.slice(2));
  if (!args.briefPath) {
    process.stderr.write("Usage: node tools/validate-pictogram-asset.js --brief <asset-brief.json> [--release] [--json]\n");
    process.exitCode = 2;
  } else {
    const briefPath = path.resolve(args.briefPath);
    const result = validatePictogramBrief(briefPath, { release: args.release });
    if (args.json) process.stdout.write(`${JSON.stringify(result, null, 2)}\n`);
    else {
      process.stdout.write(`Piktogramm-Check: ${path.relative(defaultRepoRoot, briefPath)}\n`);
      for (const warning of result.warnings) process.stdout.write(`WARN: ${warning}\n`);
      for (const error of result.errors) process.stdout.write(`ERROR: ${error}\n`);
      process.stdout.write(`${result.errors.length} Fehler, ${result.warnings.length} Warnungen\n`);
    }
    if (result.errors.length) process.exitCode = 1;
  }
}

module.exports = {
  contrastRatio,
  inspectPng,
  validatePictogramBrief,
};
