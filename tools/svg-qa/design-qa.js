"use strict";

const fs = require("fs");
const path = require("path");

const REQUIRED_METADATA = [
  "artifactScope",
  "embeddingTarget",
  "slideType",
  "layoutIntent",
  "takeaway",
  "density",
  "contentMode",
  "backgroundMode",
  "brandProfile",
  "brandVariant",
];

const VALID_CONTENT_MODES = new Set(["transparent-content", "contained-card", "full-content-area"]);
const VALID_BACKGROUND_MODES = new Set(["transparent", "light", "dark"]);
const VALID_DENSITIES = new Set(["low", "normal", "dense"]);
const MASTER_TEXT_PATTERNS = [
  /\b(?:Titel hier eingeben|Presenter Notes|Slide number|Foliennummer|Footer|PowerPoint)\b/i,
  /\b(?:Workflow-Variante|neuer Workflow|Workflow-Hinweis|Quelle:\s*Folie|Fokus:)\b/i,
  /\bRE\d+(?:_TEST_\d+)?\s*[|.\-·]\s*(?:Folie|Slide)\s*\d+/i,
];
const PLACEHOLDER_PATTERNS = [/\b(?:Lorem ipsum|TODO|TBD|Platzhalter|dummy text)\b/i];
const TITLE_MARKER_PATTERN = /\b(?:data-role|data-qc-role)\s*=\s*["'](?:content-title|slide-title|takeaway)["']|\bid\s*=\s*["'](?:content-title|slide-title|takeaway)["']/i;

function toPosixPath(repoRoot, filePath) {
  return path.relative(repoRoot, filePath).split(path.sep).join("/");
}

function readUtf8(filePath) {
  return fs.readFileSync(filePath, "utf8").replace(/^\uFEFF/, "");
}

function decodeXmlText(value) {
  return String(value || "")
    .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, "$1")
    .replace(/<[^>]+>/g, "")
    .replace(/&#(\d+);/g, (_, code) => String.fromCodePoint(Number(code)))
    .replace(/&#x([0-9a-fA-F]+);/g, (_, code) => String.fromCodePoint(parseInt(code, 16)))
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'")
    .replace(/\s+/g, " ")
    .trim();
}

function attrValue(attrs, name) {
  const match = String(attrs || "").match(new RegExp(`\\b${name}\\s*=\\s*["']([^"']+)["']`, "i"));
  return match ? match[1] : "";
}

function parseNumber(value) {
  const raw = String(value ?? "").trim();
  if (!raw) return null;
  const number = Number(raw.replace(",", ".").replace(/px$/i, ""));
  return Number.isFinite(number) ? number : null;
}

function parseViewBox(svgText) {
  const match = svgText.match(/\bviewBox\s*=\s*["']([^"']+)["']/i);
  if (!match) return null;
  const parts = match[1].trim().split(/[\s,]+/).map(Number);
  if (parts.length !== 4 || parts.some((part) => !Number.isFinite(part))) return null;
  return { x: parts[0], y: parts[1], width: parts[2], height: parts[3] };
}

function parseStyleDeclarations(styleText) {
  const result = {};
  for (const declaration of String(styleText || "").split(";")) {
    const index = declaration.indexOf(":");
    if (index === -1) continue;
    result[declaration.slice(0, index).trim().toLowerCase()] = declaration.slice(index + 1).trim();
  }
  return result;
}

function parseCssClassFontSizes(svgText) {
  const sizes = new Map();
  for (const styleMatch of svgText.matchAll(/<style\b[^>]*>([\s\S]*?)<\/style>/gi)) {
    const css = styleMatch[1] || "";
    for (const rule of css.matchAll(/\.([A-Za-z0-9_-]+)\s*\{([^}]+)\}/g)) {
      const declarations = parseStyleDeclarations(rule[2]);
      const size = parseNumber(declarations["font-size"]);
      if (size !== null) sizes.set(rule[1], size);
    }
  }
  return sizes;
}

function extractVisibleText(svgText) {
  return [...svgText.matchAll(/<text\b[^>]*>([\s\S]*?)<\/text>/gi)]
    .map((match) => decodeXmlText(match[1]))
    .filter(Boolean);
}

function parseMetadataJson(rawText) {
  const cleaned = String(rawText || "")
    .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, "$1")
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'")
    .replace(/&amp;/g, "&")
    .trim();
  if (!cleaned) return null;
  try {
    return JSON.parse(cleaned);
  } catch {
    return null;
  }
}

function metadataFromSvg(svgText) {
  for (const match of svgText.matchAll(/<metadata\b([^>]*)>([\s\S]*?)<\/metadata>/gi)) {
    const attrs = match[1] || "";
    const id = attrValue(attrs, "id");
    const type = attrValue(attrs, "type");
    const role = attrValue(attrs, "data-role");
    if (
      id === "slide-quality-metadata" ||
      role === "slide-quality-metadata" ||
      /application\/json/i.test(type) ||
      /^\s*\{/.test(match[2] || "")
    ) {
      const parsed = parseMetadataJson(match[2]);
      if (parsed && typeof parsed === "object") return parsed;
    }
  }

  const rootMatch = svgText.match(/<svg\b([^>]*)>/i);
  if (!rootMatch) return null;
  const attrs = rootMatch[1] || "";
  const result = {};
  const mapping = {
    artifactScope: "data-artifact-scope",
    embeddingTarget: "data-embedding-target",
    slideType: "data-slide-type",
    contentTitle: "data-content-title",
    layoutIntent: "data-layout-intent",
    takeaway: "data-takeaway",
    density: "data-density",
    contentMode: "data-content-mode",
    backgroundMode: "data-background-mode",
    brandProfile: "data-brand-profile",
    brandVariant: "data-brand-variant",
  };
  for (const [key, attr] of Object.entries(mapping)) {
    const value = attrValue(attrs, attr);
    if (value) result[key] = value;
  }
  return Object.keys(result).length ? result : null;
}

function metadataFromManifests(svgPath, manifestFiles, repoRoot) {
  const resolvedSvgPath = path.resolve(svgPath);
  for (const manifestPath of manifestFiles || []) {
    let manifest = null;
    try {
      manifest = JSON.parse(readUtf8(manifestPath));
    } catch {
      continue;
    }
    if (!manifest || !manifest.svgPath) continue;
    const targetSvg = path.resolve(path.dirname(manifestPath), manifest.svgPath);
    if (path.resolve(targetSvg) !== resolvedSvgPath) continue;

    const candidates = [
      manifest.slideQuality,
      manifest.qualityMetadata,
      manifest.contentSvg,
      manifest.metadata && manifest.metadata.slideQuality,
      manifest.metadata && manifest.metadata.contentSvg,
    ];
    for (const candidate of candidates) {
      if (candidate && typeof candidate === "object") {
        return {
          metadata: candidate,
          source: toPosixPath(repoRoot, manifestPath),
        };
      }
    }
  }
  return { metadata: null, source: "" };
}

function flattenColorValues(value, colors = new Set()) {
  if (!value || typeof value !== "object") return colors;
  for (const item of Object.values(value)) {
    if (typeof item === "string" && normalizeColor(item)) {
      colors.add(normalizeColor(item));
    } else if (item && typeof item === "object") {
      flattenColorValues(item, colors);
    }
  }
  return colors;
}

function loadBrandTokens(repoRoot) {
  const tokenPath = path.join(repoRoot, "brand", "company-brand-tokens.json");
  const fallback = {
    brand: { profile: "company-default" },
    canvas: { artifactScope: "content-svg", embeddingTarget: "powerpoint-slide" },
    typography: { minReadable: 18, minCaption: 14 },
    qa: {
      metadataRequiredFields: REQUIRED_METADATA,
      contentModes: [...VALID_CONTENT_MODES],
      backgroundModes: [...VALID_BACKGROUND_MODES],
      densities: [...VALID_DENSITIES],
      maxVisibleColors: { low: 6, normal: 8, dense: 12 },
    },
    colors: {
      textPrimary: "#111827",
      panelLight: "#FFFFFF",
      brandPrimary: "#0B1220",
      accentPrimary: "#2563EB",
    },
  };

  try {
    const parsed = JSON.parse(readUtf8(tokenPath));
    return {
      tokens: parsed,
      path: tokenPath,
      loaded: true,
    };
  } catch {
    return {
      tokens: fallback,
      path: tokenPath,
      loaded: false,
    };
  }
}

function normalizeColor(value) {
  const raw = String(value || "").trim();
  if (!raw || /^(none|transparent|currentColor|inherit|initial|unset)$/i.test(raw)) return "";
  if (/^url\(/i.test(raw)) return "";
  const hex = raw.match(/^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/);
  if (hex) {
    const body = hex[1].length === 3
      ? hex[1].split("").map((char) => `${char}${char}`).join("")
      : hex[1];
    return `#${body.toUpperCase()}`;
  }
  const rgb = raw.match(/^rgba?\(([^)]+)\)$/i);
  if (rgb) {
    const parts = rgb[1].split(",").slice(0, 3).map((part) => Number(part.trim()));
    if (parts.length === 3 && parts.every((part) => Number.isFinite(part))) {
      return `#${parts.map((part) => Math.max(0, Math.min(255, Math.round(part))).toString(16).padStart(2, "0")).join("").toUpperCase()}`;
    }
  }
  return "";
}

function extractColors(svgText) {
  const colors = new Set();
  for (const tag of svgText.matchAll(/<[^!?][^>]*>/g)) {
    const rawTag = tag[0];
    if (/data-qa-brand-exception\s*=\s*["']true["']/i.test(rawTag) && /\bdata-qa-reason\s*=\s*["'][^"']+["']/i.test(rawTag)) {
      continue;
    }
    for (const attr of ["fill", "stroke", "stop-color"]) {
      const color = normalizeColor(attrValue(rawTag, attr));
      if (color) colors.add(color);
    }
    const style = attrValue(rawTag, "style");
    if (style) {
      const declarations = parseStyleDeclarations(style);
      for (const attr of ["fill", "stroke", "stop-color", "color", "background-color"]) {
        const color = normalizeColor(declarations[attr]);
        if (color) colors.add(color);
      }
    }
  }

  for (const styleMatch of svgText.matchAll(/<style\b[^>]*>([\s\S]*?)<\/style>/gi)) {
    const css = styleMatch[1] || "";
    for (const colorMatch of css.matchAll(/(?:fill|stroke|stop-color|color|background-color)\s*:\s*([^;}\s]+)/gi)) {
      const color = normalizeColor(colorMatch[1]);
      if (color) colors.add(color);
    }
  }
  return [...colors];
}

function colorDistance(left, right) {
  const a = left.slice(1).match(/.{2}/g).map((part) => parseInt(part, 16));
  const b = right.slice(1).match(/.{2}/g).map((part) => parseInt(part, 16));
  return Math.sqrt((a[0] - b[0]) ** 2 + (a[1] - b[1]) ** 2 + (a[2] - b[2]) ** 2);
}

function hasFullBackgroundRect(svgText, viewBox) {
  if (!viewBox) return false;
  const firstRect = svgText.match(/<rect\b([^>]*)>/i);
  if (!firstRect) return false;
  const attrs = firstRect[1] || "";
  const x = parseNumber(attrValue(attrs, "x")) ?? 0;
  const y = parseNumber(attrValue(attrs, "y")) ?? 0;
  const widthRaw = attrValue(attrs, "width");
  const heightRaw = attrValue(attrs, "height");
  const width = widthRaw === "100%" ? viewBox.width : parseNumber(widthRaw);
  const height = heightRaw === "100%" ? viewBox.height : parseNumber(heightRaw);
  const fill = attrValue(attrs, "fill") || parseStyleDeclarations(attrValue(attrs, "style")).fill || "";
  return (
    width !== null &&
    height !== null &&
    Math.abs(x - viewBox.x) < 2 &&
    Math.abs(y - viewBox.y) < 2 &&
    Math.abs(width - viewBox.width) < 2 &&
    Math.abs(height - viewBox.height) < 2 &&
    !/^(none|transparent)$/i.test(fill)
  );
}

function pushIssue(context, issues, rule, message, detail = "", extra = {}) {
  issues.push({
    rule,
    severity: context.strictDesign ? "error" : "warning",
    file: context.file,
    slide: context.slide,
    time_seconds: null,
    state: "",
    element_id: extra.element_id || "",
    related_element_id: "",
    message,
    detail,
    expected: extra.expected ?? null,
    actual: extra.actual ?? null,
    bbox: extra.bbox ?? null,
    recommendation: extra.recommendation || "",
  });
}

function checkMetadata(context, svgText, metadata, metadataSource, issues) {
  if (!metadata) {
    pushIssue(context, issues, "design-metadata", "Missing Content-SVG quality metadata.", "Add slide-quality metadata in SVG metadata or scene manifest.");
    return;
  }

  const required = context.tokens.qa?.metadataRequiredFields || REQUIRED_METADATA;
  const missing = required.filter((field) => !String(metadata[field] || "").trim());
  if (missing.length) {
    pushIssue(context, issues, "design-metadata", "Content-SVG metadata is incomplete.", `Missing: ${missing.join(", ")}${metadataSource ? ` (source: ${metadataSource})` : ""}`);
  }

  if (metadata.artifactScope && metadata.artifactScope !== "content-svg") {
    pushIssue(context, issues, "content-svg-scope", "artifactScope should be content-svg for generated content modules.", `artifactScope=${metadata.artifactScope}`);
  }
  if (metadata.embeddingTarget && metadata.embeddingTarget !== "powerpoint-slide") {
    pushIssue(context, issues, "powerpoint-embedding", "embeddingTarget should identify PowerPoint embedding.", `embeddingTarget=${metadata.embeddingTarget}`);
  }
  if (metadata.contentMode && !VALID_CONTENT_MODES.has(metadata.contentMode)) {
    pushIssue(context, issues, "content-svg-mode", "contentMode is not one of the supported Content-SVG modes.", metadata.contentMode);
  }
  if (metadata.backgroundMode && !VALID_BACKGROUND_MODES.has(metadata.backgroundMode)) {
    pushIssue(context, issues, "background-mode", "backgroundMode must be transparent, light, or dark.", metadata.backgroundMode);
  }
  if (metadata.density && !VALID_DENSITIES.has(metadata.density)) {
    pushIssue(context, issues, "design-density", "density must be low, normal, or dense.", metadata.density);
  }

  const hasTitleMarker = TITLE_MARKER_PATTERN.test(svgText);
  const contentTitle = String(metadata.contentTitle || "").trim();
  const takeaway = String(metadata.takeaway || "").trim();
  if (!takeaway) {
    pushIssue(context, issues, "main-message", "Missing metadata takeaway for the Content-SVG.", "A single main message is required even when no visible slide title is used.");
  }
  if (!contentTitle && !hasTitleMarker) {
    pushIssue(context, issues, "content-title", "No contentTitle or semantic content-title marker found.", "For Content-SVGs, metadata contentTitle is enough when the visible PowerPoint title lives outside the SVG.");
  }
}

function checkText(context, svgText, metadata, issues) {
  const textNodes = extractVisibleText(svgText);
  for (const text of textNodes) {
    for (const pattern of MASTER_TEXT_PATTERNS) {
      if (pattern.test(text)) {
        pushIssue(context, issues, "powerpoint-master-element", "Visible PowerPoint/master/generator metadata found in Content-SVG text.", text);
      }
    }
    for (const pattern of PLACEHOLDER_PATTERNS) {
      if (pattern.test(text)) {
        pushIssue(context, issues, "text-placeholder", "Placeholder text found in Content-SVG.", text);
      }
    }
    if (text.length > 120) {
      pushIssue(context, issues, "text-volume", "Very long SVG text line found.", text.slice(0, 160));
    }
  }

  if (textNodes.length > 32 && (metadata?.density || "normal") !== "dense") {
    pushIssue(context, issues, "text-volume", "Many text nodes for a non-dense Content-SVG.", `${textNodes.length} text nodes; set density=\"dense\" only with a documented reason.`);
  }

  const classFontSizes = parseCssClassFontSizes(svgText);
  for (const match of svgText.matchAll(/<text\b([^>]*)>/gi)) {
    const attrs = match[1] || "";
    if (/data-qa-small-text\s*=\s*["']allowed["']/i.test(attrs) && /\bdata-qa-reason\s*=\s*["'][^"']+["']/i.test(attrs)) {
      continue;
    }

    let size = parseNumber(attrValue(attrs, "font-size"));
    const styleSize = parseNumber(parseStyleDeclarations(attrValue(attrs, "style"))["font-size"]);
    if (styleSize !== null) size = styleSize;
    if (size === null) {
      const classes = attrValue(attrs, "class").split(/\s+/).filter(Boolean);
      for (const className of classes) {
        if (classFontSizes.has(className)) {
          size = classFontSizes.get(className);
          break;
        }
      }
    }

    const role = attrValue(attrs, "data-role") || attrValue(attrs, "data-qc-role") || "";
    const minSize = /caption|source|footnote/i.test(role) ? 14 : (context.tokens.typography?.minReadable || 18);
    if (size === null) {
      pushIssue(context, issues, "min-font-size", "Text element has no determinable font-size.", match[0], { element_id: attrValue(attrs, "id") });
    } else if (size < minSize) {
      pushIssue(context, issues, "min-font-size", "Text is smaller than the Content-SVG readability minimum.", `${size}px < ${minSize}px`, { element_id: attrValue(attrs, "id") });
    }
  }
}

function checkBounds(context, svgText, viewBox, issues) {
  if (!viewBox) return;
  const tolerance = 4;
  const outside = (x, y) => (
    x < viewBox.x - tolerance ||
    y < viewBox.y - tolerance ||
    x > viewBox.x + viewBox.width + tolerance ||
    y > viewBox.y + viewBox.height + tolerance
  );
  const reportPoint = (attrs, x, y, label) => {
    if (x !== null && y !== null && outside(x, y)) {
      pushIssue(context, issues, "viewbox-bounds", "Element coordinate is outside the SVG viewBox.", `${label}: ${x},${y}`, { element_id: attrValue(attrs, "id") });
    }
  };

  for (const match of svgText.matchAll(/<(rect|image|text)\b([^>]*)>/gi)) {
    const attrs = match[2] || "";
    const x = parseNumber(attrValue(attrs, "x")) ?? 0;
    const y = parseNumber(attrValue(attrs, "y")) ?? 0;
    reportPoint(attrs, x, y, match[1]);
    const width = parseNumber(attrValue(attrs, "width"));
    const height = parseNumber(attrValue(attrs, "height"));
    if (width !== null && height !== null) reportPoint(attrs, x + width, y + height, `${match[1]} end`);
  }

  for (const match of svgText.matchAll(/<circle\b([^>]*)>/gi)) {
    const attrs = match[1] || "";
    const cx = parseNumber(attrValue(attrs, "cx"));
    const cy = parseNumber(attrValue(attrs, "cy"));
    const r = parseNumber(attrValue(attrs, "r")) || 0;
    reportPoint(attrs, cx - r, cy - r, "circle min");
    reportPoint(attrs, cx + r, cy + r, "circle max");
  }

  for (const match of svgText.matchAll(/<line\b([^>]*)>/gi)) {
    const attrs = match[1] || "";
    reportPoint(attrs, parseNumber(attrValue(attrs, "x1")), parseNumber(attrValue(attrs, "y1")), "line start");
    reportPoint(attrs, parseNumber(attrValue(attrs, "x2")), parseNumber(attrValue(attrs, "y2")), "line end");
  }

  for (const match of svgText.matchAll(/<(polygon|polyline)\b([^>]*)>/gi)) {
    const attrs = match[2] || "";
    const points = attrValue(attrs, "points").trim().split(/\s+/);
    for (const point of points) {
      const [x, y] = point.split(",").map(parseNumber);
      reportPoint(attrs, x, y, match[1]);
    }
  }
}

function checkColors(context, svgText, metadata, issues) {
  const colors = extractColors(svgText);
  const allowed = flattenColorValues(context.tokens.colors || {});
  allowed.add("#FFFFFF");
  allowed.add("#000000");

  const density = metadata?.density || "normal";
  const limit = context.tokens.qa?.maxVisibleColors?.[density] || (density === "dense" ? 12 : 8);
  if (colors.length > limit) {
    pushIssue(context, issues, "color-count", "Many visible colors found for the declared density.", `${colors.length} colors: ${colors.slice(0, 16).join(", ")}`);
  }

  const adHocColors = colors.filter((color) => !allowed.has(color));
  if (adHocColors.length) {
    pushIssue(context, issues, "brand-token-color", "Colors outside brand/design tokens found.", adHocColors.slice(0, 12).join(", "), {
      recommendation: "Use brand/company-brand-tokens.json or add data-qa-brand-exception with data-qa-reason for temporary imported colors.",
    });
  }

  const nearDuplicates = [];
  for (let index = 0; index < colors.length; index += 1) {
    for (let other = index + 1; other < colors.length; other += 1) {
      const distance = colorDistance(colors[index], colors[other]);
      if (distance > 0 && distance < 12) nearDuplicates.push(`${colors[index]} ~ ${colors[other]}`);
    }
  }
  if (nearDuplicates.length) {
    pushIssue(context, issues, "brand-token-near-duplicate", "Very similar but non-identical colors found.", nearDuplicates.slice(0, 8).join(", "));
  }
}

function checkDensityAndDecoration(context, svgText, metadata, issues) {
  const elementCount = (svgText.match(/<(?:g|path|rect|circle|ellipse|line|polyline|polygon|text|image)\b/gi) || []).length;
  const pathCount = (svgText.match(/<path\b/gi) || []).length;
  const unroledSmallShapes = [...svgText.matchAll(/<(circle|line|path|rect)\b([^>]*)>/gi)]
    .filter((match) => !/\b(?:data-role|data-qc-role)\s*=/i.test(match[2] || ""))
    .length;
  const density = metadata?.density || "normal";
  const elementLimit = density === "dense" ? 520 : density === "low" ? 180 : 320;

  if (elementCount > elementLimit) {
    pushIssue(context, issues, "design-density", "High SVG element count for declared density.", `${elementCount} elements with density=${density}`);
  }
  if (pathCount > 90 && density !== "dense") {
    pushIssue(context, issues, "design-density", "Many path elements in a non-dense Content-SVG.", `${pathCount} paths`);
  }
  if (unroledSmallShapes > 45) {
    pushIssue(context, issues, "decorative-noise", "Many visible shapes do not have semantic role markers.", `${unroledSmallShapes} unmarked simple shapes`, {
      recommendation: "Mark functional elements with data-role/data-qc-role; mark intentional decoration with data-role=\"decorative\" and data-qa-reason.",
    });
  }
  if (/<(?:linearGradient|radialGradient|filter)\b/i.test(svgText) && context.tokens.shadow?.allowed === false) {
    pushIssue(context, issues, "brand-effects", "Gradients or SVG filters are present; verify they are semantic and PowerPoint-safe.", "Brand tokens currently mark shadows as disallowed.");
  }
}

function checkEmbedding(context, svgText, metadata, viewBox, issues) {
  if (/xml-stylesheet|<link\b|@import\b|@font-face[\s\S]*?url\(/i.test(svgText)) {
    pushIssue(context, issues, "powerpoint-embedding", "External stylesheets or external font references may not embed reliably in PowerPoint.", "");
  }
  if (/\b(?:footer|slide[-_ ]?number|foliennummer|logo[-_ ]?bar|master[-_ ]?logo|deck[-_ ]?header)\b/i.test(svgText)) {
    pushIssue(context, issues, "powerpoint-master-element", "SVG contains IDs/classes/text that look like PowerPoint master elements.", "");
  }
  if (metadata?.backgroundMode === "transparent" && hasFullBackgroundRect(svgText, viewBox)) {
    pushIssue(context, issues, "background-mode", "backgroundMode is transparent, but a full-size filled background rect is present.", "Use light/dark backgroundMode or remove the full background fill for transparent-content.");
  }
  if (metadata?.backgroundMode && metadata.backgroundMode !== "transparent" && metadata?.contentMode === "transparent-content") {
    pushIssue(context, issues, "background-mode", "transparent-content should normally use backgroundMode=\"transparent\".", `backgroundMode=${metadata.backgroundMode}`);
  }
}

function runStaticDesignQa({ svgFiles, manifestFiles = [], repoRoot, strictDesign = false }) {
  const brand = loadBrandTokens(repoRoot);
  const issues = [];
  const files = [];

  for (const svgPath of svgFiles) {
    const svgText = readUtf8(svgPath);
    const file = toPosixPath(repoRoot, svgPath);
    const viewBox = parseViewBox(svgText);
    const manifestMetadata = metadataFromManifests(svgPath, manifestFiles, repoRoot);
    const metadata = metadataFromSvg(svgText) || manifestMetadata.metadata;
    const context = {
      file,
      slide: "",
      strictDesign,
      tokens: brand.tokens,
    };

    checkMetadata(context, svgText, metadata, manifestMetadata.metadata ? manifestMetadata.source : "", issues);
    checkText(context, svgText, metadata, issues);
    checkBounds(context, svgText, viewBox, issues);
    checkColors(context, svgText, metadata, issues);
    checkDensityAndDecoration(context, svgText, metadata, issues);
    checkEmbedding(context, svgText, metadata, viewBox, issues);

    files.push({
      path: file,
      metadata: Boolean(metadata),
      metadataSource: metadata ? (manifestMetadata.metadata ? manifestMetadata.source : "svg") : "",
      colorCount: extractColors(svgText).length,
      textCount: extractVisibleText(svgText).length,
    });
  }

  return {
    checked: true,
    strict: strictDesign,
    warnOnly: !strictDesign,
    brandTokens: {
      loaded: brand.loaded,
      path: toPosixPath(repoRoot, brand.path),
      profile: brand.tokens.brand?.profile || "",
      companyName: brand.tokens.brand?.companyName || "",
    },
    files,
    issues,
    summary: {
      files_checked: files.length,
      errors: issues.filter((issue) => issue.severity === "error").length,
      warnings: issues.filter((issue) => issue.severity === "warning").length,
    },
  };
}

module.exports = {
  runStaticDesignQa,
  loadBrandTokens,
};
