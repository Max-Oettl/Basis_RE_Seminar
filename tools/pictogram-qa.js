"use strict";

const pictogramTokens = require("../brand/reltest-education-pictogram-tokens.json");

function attrValue(markup, name) {
  const match = String(markup).match(
    new RegExp(`(?:^|\\s)${name}\\s*=\\s*(?:"([^"]*)"|'([^']*)')`, "i"),
  );
  return match ? (match[1] ?? match[2] ?? "") : "";
}

function parseHexColor(value) {
  const match = String(value || "").trim().match(/^#([0-9a-f]{6})$/i);
  if (!match) return null;
  return [0, 2, 4].map((offset) => Number.parseInt(match[1].slice(offset, offset + 2), 16));
}

function relativeLuminance(hex) {
  const rgb = parseHexColor(hex);
  if (!rgb) return null;
  const linear = rgb.map((value) => {
    const channel = value / 255;
    return channel <= 0.04045
      ? channel / 12.92
      : ((channel + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * linear[0] + 0.7152 * linear[1] + 0.0722 * linear[2];
}

function contrastRatio(foreground, background) {
  const foregroundLuminance = relativeLuminance(foreground);
  const backgroundLuminance = relativeLuminance(background);
  if (foregroundLuminance === null || backgroundLuminance === null) return null;
  const lighter = Math.max(foregroundLuminance, backgroundLuminance);
  const darker = Math.min(foregroundLuminance, backgroundLuminance);
  return (lighter + 0.05) / (darker + 0.05);
}

function issue(severity, rule, message, detail = "") {
  return { severity, rule, message, detail };
}

function allowedPalette() {
  return new Set(
    Object.values(pictogramTokens.colors)
      .flatMap((value) => (Array.isArray(value) ? value : [value]))
      .filter((value) => typeof value === "string" && /^#[0-9A-F]{6}$/i.test(value))
      .map((value) => value.toUpperCase()),
  );
}

function validatePictogramMarkup(markup, options = {}) {
  const findings = [];
  const source = String(markup || "");
  const openingTag = source.match(/<g\b[^>]*data-component\s*=\s*["']reltest-pictogram["'][^>]*>/i)?.[0] || "";

  if (!openingTag) {
    findings.push(issue("error", "pictogram-component", "Missing RelTest pictogram component marker."));
    return findings;
  }

  const style = attrValue(openingTag, "data-pictogram-style");
  if (style !== pictogramTokens.qa.requiredDataStyle) {
    findings.push(issue("error", "pictogram-style", "Pictogram uses the wrong style profile.", style));
  }

  const kind = attrValue(openingTag, "data-pictogram-kind");
  if (!kind) {
    findings.push(issue("error", "pictogram-kind", "Pictogram kind is missing."));
  }

  const semanticRole = attrValue(openingTag, "data-pictogram-semantic-role");
  if (!pictogramTokens.elearning.semanticRoles.includes(semanticRole)) {
    findings.push(issue("error", "pictogram-semantic-role", "Pictogram semantic role is missing or unknown.", semanticRole));
  }

  const size = Number(attrValue(openingTag, "data-pictogram-size"));
  if (!Number.isFinite(size) || size < pictogramTokens.displaySizes.hardMinimumSourcePx) {
    findings.push(issue("error", "pictogram-size", "Pictogram is below the hard minimum size.", String(size)));
  } else if (size < pictogramTokens.displaySizes.preferredMinimumSourcePx) {
    findings.push(issue("warning", "pictogram-small-scale-review", "Pictogram requires an explicit small-scale context review.", `${size}px`));
  }

  const ariaHidden = attrValue(openingTag, "aria-hidden") === "true";
  const role = attrValue(openingTag, "role");
  const ariaLabel = attrValue(openingTag, "aria-label").trim();
  if (!ariaHidden && !(role === "img" && ariaLabel)) {
    findings.push(issue("error", "pictogram-accessibility", "Pictogram must be redundant-hidden or have role=img with a non-empty aria-label."));
  }
  if (ariaHidden && (role === "img" || ariaLabel)) {
    findings.push(issue("error", "pictogram-accessibility", "Pictogram mixes decorative and semantic accessibility modes."));
  }

  for (const elementName of pictogramTokens.qa.forbiddenElements) {
    if (new RegExp(`<${elementName}\\b`, "i").test(source)) {
      findings.push(issue("error", "pictogram-forbidden-element", `Pictogram contains forbidden <${elementName}> content.`));
    }
  }

  const strokeWidths = [...source.matchAll(/\bstroke-width\s*=\s*["']([^"']+)["']/gi)]
    .map((match) => Number(match[1]))
    .filter(Number.isFinite);
  if (!strokeWidths.includes(pictogramTokens.geometry.strokeWidth)) {
    findings.push(issue("error", "pictogram-stroke", "Canonical pictogram stroke width is missing."));
  }
  if (!new RegExp(`stroke-linecap=["']${pictogramTokens.geometry.strokeLinecap}["']`, "i").test(source)
    || !new RegExp(`stroke-linejoin=["']${pictogramTokens.geometry.strokeLinejoin}["']`, "i").test(source)) {
    findings.push(issue("error", "pictogram-stroke", "Pictogram must use the canonical round cap and join."));
  }

  const palette = allowedPalette();
  const strokes = [...source.matchAll(/\bstroke\s*=\s*["'](#[0-9a-f]{6})["']/gi)]
    .map((match) => match[1].toUpperCase());
  for (const color of new Set(strokes)) {
    if (!palette.has(color)) {
      findings.push(issue("error", "pictogram-color", "Pictogram uses a color outside the Education palette.", color));
    }
  }
  if (new Set(strokes).size > pictogramTokens.geometry.maximumForegroundColors) {
    findings.push(issue("error", "pictogram-color-count", "Pictogram uses too many foreground colors.", String(new Set(strokes).size)));
  }

  const decorativeBackground = source.match(/<circle\b[^>]*data-role\s*=\s*["']decorative["'][^>]*>/i)?.[0];
  const directBackground = decorativeBackground
    ? attrValue(decorativeBackground, "fill")
    : (options.backgroundColor || pictogramTokens.colors.inverse);
  for (const color of new Set(strokes)) {
    const ratio = contrastRatio(color, directBackground);
    if (ratio !== null && ratio < pictogramTokens.elearning.contrastRatioMinimum) {
      findings.push(issue("error", "pictogram-contrast", "Pictogram foreground does not reach the minimum non-text contrast.", `${color} on ${directBackground}: ${ratio.toFixed(2)}:1`));
    }
  }

  return findings;
}

function extractPictogramSnippets(svgText) {
  return [...String(svgText || "").matchAll(
    /<g\b(?=[^>]*data-component\s*=\s*["']reltest-pictogram["'])[^>]*>[\s\S]*?<\/g><\/g>/gi,
  )].map((match) => match[0]);
}

function validatePictogramsInSvg(svgText, options = {}) {
  return extractPictogramSnippets(svgText).flatMap((markup, index) =>
    validatePictogramMarkup(markup, options).map((finding) => ({
      ...finding,
      pictogramIndex: index + 1,
    })),
  );
}

function validatePictogramProductionPolicy(svgText, options = {}) {
  const findings = [];
  const source = String(svgText || "");
  const allowLegacySvg = options.allowLegacySvg === true;
  const legacyComponents = source.match(/<g\b[^>]*data-component\s*=\s*["']reltest-pictogram["'][^>]*>/gi) || [];

  if (!allowLegacySvg && legacyComponents.length > 0) {
    findings.push(issue(
      "error",
      "pictogram-png-only",
      "New or changed scenes must not construct pictograms from SVG geometry.",
      `${legacyComponents.length} legacy SVG pictogram component(s)`,
    ));
  }

  const markedImages = source.match(/<image\b[^>]*data-pictogram-asset-type\s*=\s*["'][^"']+["'][^>]*>/gi) || [];
  for (const imageTag of markedImages) {
    const assetType = attrValue(imageTag, "data-pictogram-asset-type");
    const href = attrValue(imageTag, "href") || attrValue(imageTag, "xlink:href");
    if (assetType !== "generated_png") {
      findings.push(issue(
        "error",
        "pictogram-png-only",
        "Pictogram assets must use the generated_png production type.",
        assetType,
      ));
    }
    if (!/\.png(?:$|[?#])/i.test(href) && !/^data:image\/png[;,]/i.test(href)) {
      findings.push(issue(
        "error",
        "pictogram-png-format",
        "Generated pictograms must be embedded from a PNG asset.",
        href,
      ));
    }
  }

  return findings;
}

function validateRegistry(registry, kinds) {
  const findings = [];
  const ids = registry.items.map((item) => item.id);
  const duplicateIds = ids.filter((id, index) => ids.indexOf(id) !== index);
  for (const id of new Set(duplicateIds)) {
    findings.push(issue("error", "pictogram-registry-duplicate", "Duplicate registry id.", id));
  }

  for (const kind of kinds) {
    const item = registry.items.find((candidate) => candidate.id === kind);
    if (!item) {
      findings.push(issue("error", "pictogram-registry-missing", "Library pictogram is missing from the registry.", kind));
      continue;
    }
    if (!String(item.meaning || "").trim()
      || !Array.isArray(item.preferredLabels) || item.preferredLabels.length === 0
      || !Array.isArray(item.avoidFor) || item.avoidFor.length === 0) {
      findings.push(issue("error", "pictogram-registry-semantics", "Registry item lacks meaning, preferredLabels, or avoidFor.", kind));
    }
    if (!Array.isArray(item.semanticRoles)
      || item.semanticRoles.some((role) => !pictogramTokens.elearning.semanticRoles.includes(role))) {
      findings.push(issue("error", "pictogram-registry-role", "Registry item uses an unknown semantic role.", kind));
    }
  }

  for (const item of registry.items) {
    if (["generated_png", "extracted_png"].includes(item.assetType)) {
      if (!String(item.assetPath || "").trim()) {
        findings.push(issue("error", "pictogram-registry-asset", "Raster pictogram has no registered asset path.", item.id));
      }
      continue;
    }
    if (!kinds.includes(item.id)) {
      findings.push(issue("error", "pictogram-library-missing", "Legacy registry item has no geometry in the library.", item.id));
    }
  }
  return findings;
}

module.exports = {
  contrastRatio,
  extractPictogramSnippets,
  validatePictogramMarkup,
  validatePictogramProductionPolicy,
  validatePictogramsInSvg,
  validateRegistry,
};

if (require.main === module) {
  const {
    pictogram,
    pictogramKinds,
    pictogramRegistry,
  } = require("../components/pictogram-library/reltest-pictograms");
  const findings = [
    ...validateRegistry(pictogramRegistry, [...pictogramKinds]),
    ...pictogramKinds.flatMap((kind) =>
      validatePictogramMarkup(pictogram(kind, { size: 64 })).map((finding) => ({
        ...finding,
        kind,
      })),
    ),
  ];
  for (const finding of findings) {
    process.stdout.write(`${finding.severity.toUpperCase()} ${finding.kind || "registry"} ${finding.rule}: ${finding.message}${finding.detail ? ` (${finding.detail})` : ""}\n`);
  }
  const errors = findings.filter((finding) => finding.severity === "error").length;
  process.stdout.write(`Pictogram QA: ${errors} error(s), ${findings.length - errors} warning(s).\n`);
  process.exitCode = errors ? 1 : 0;
}
