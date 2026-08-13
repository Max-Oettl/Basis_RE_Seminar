"use strict";

const fs = require("fs");
const path = require("path");
const { findDownstreamOwnedSlideChrome } = require("../svg-downstream-chrome");
const { validatePictogramsInSvg } = require("../pictogram-qa");

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
const VALID_FULL_SLIDE_CONTENT_MODES = new Set(["full-slide"]);
const VALID_FULL_SLIDE_BACKGROUND_MODES = new Set(["brand-frame", "light", "dark"]);
const VALID_FULL_SLIDE_DENSITIES = new Set(["low", "balanced", "normal", "dense"]);
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

function parseCssClassFontFamilies(svgText) {
  const families = new Map();
  for (const styleMatch of svgText.matchAll(/<style\b[^>]*>([\s\S]*?)<\/style>/gi)) {
    const css = styleMatch[1] || "";
    for (const rule of css.matchAll(/\.([A-Za-z0-9_-]+)\s*\{([^}]+)\}/g)) {
      const declarations = parseStyleDeclarations(rule[2]);
      if (declarations["font-family"]) families.set(rule[1], declarations["font-family"]);
    }
  }
  return families;
}

function parseGlobalTextFontFamily(svgText) {
  for (const styleMatch of svgText.matchAll(/<style\b[^>]*>([\s\S]*?)<\/style>/gi)) {
    const css = styleMatch[1] || "";
    for (const rule of css.matchAll(/(?:^|})\s*text\s*\{([^}]+)\}/gim)) {
      const declarations = parseStyleDeclarations(rule[1]);
      if (declarations["font-family"]) return declarations["font-family"];
    }
  }
  return "";
}

function firstFontFamily(value) {
  return String(value || "")
    .split(",")[0]
    .replace(/["']/g, "")
    .trim()
    .toLowerCase();
}

function parseCssClassStrokeWidths(svgText) {
  const widths = new Map();
  for (const styleMatch of svgText.matchAll(/<style\b[^>]*>([\s\S]*?)<\/style>/gi)) {
    const css = styleMatch[1] || "";
    for (const rule of css.matchAll(/\.([A-Za-z0-9_-]+)\s*\{([^}]+)\}/g)) {
      const declarations = parseStyleDeclarations(rule[2]);
      const width = parseNumber(declarations["stroke-width"]);
      if (width !== null) widths.set(rule[1], width);
    }
  }
  return widths;
}

function parseCssClassFills(svgText) {
  const fills = new Map();
  for (const styleMatch of svgText.matchAll(/<style\b[^>]*>([\s\S]*?)<\/style>/gi)) {
    const css = styleMatch[1] || "";
    for (const rule of css.matchAll(/\.([A-Za-z0-9_-]+)\s*\{([^}]+)\}/g)) {
      const declarations = parseStyleDeclarations(rule[2]);
      const fill = normalizeColor(declarations.fill);
      if (fill) fills.set(rule[1], fill);
    }
  }
  return fills;
}

function parseGlobalTextFills(svgText) {
  const fills = new Set();
  for (const styleMatch of svgText.matchAll(/<style\b[^>]*>([\s\S]*?)<\/style>/gi)) {
    const css = styleMatch[1] || "";
    for (const rule of css.matchAll(/(?:^|})\s*text\s*\{([^}]+)\}/gim)) {
      const declarations = parseStyleDeclarations(rule[1]);
      const fill = normalizeColor(declarations.fill);
      if (fill) fills.add(fill);
    }
  }
  return fills;
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

function loadBrandTokens(repoRoot, artifactScope = "content-svg") {
  const fullSlide = artifactScope === "full-slide";
  const tokenPath = path.join(
    repoRoot,
    "brand",
    fullSlide ? "reltest-education-slide-design-tokens.json" : "company-brand-tokens.json",
  );
  const contentFallback = {
    brand: { profile: "reltest-education", companyName: "RelTest Education" },
    canvas: { artifactScope: "content-svg", embeddingTarget: "powerpoint-slide" },
    typography: {
      minReadable: 18,
      minCaption: 14,
      displayFontFamily: "\"Oxanium\", \"Archivo\", Arial, sans-serif",
      bodyFontFamily: "\"Archivo\", Arial, Helvetica, sans-serif",
    },
    stroke: { hairline: 1.5, normal: 2.5, emphasis: 4, maximum: 6 },
    shadow: { allowed: false },
    qa: {
      requiredBrandProfile: "reltest-education",
      requiredBodyFont: "Archivo",
      allowedDisplayFont: "Oxanium",
      legacyBrandNamesForbidden: ["Reltest Academy", "RelTest Academy"],
      metadataRequiredFields: REQUIRED_METADATA,
      contentModes: [...VALID_CONTENT_MODES],
      backgroundModes: [...VALID_BACKGROUND_MODES],
      densities: [...VALID_DENSITIES],
      maxVisibleColors: { low: 5, normal: 7, dense: 10 },
      equalRankCardsMustShareHueFamily: true,
    },
    colors: {
      textPrimary: "#142452",
      textSecondary: "#25495F",
      panelLight: "#FFFFFF",
      panelSoft: "#E8E9EE",
      brandPrimary: "#142452",
      brandPrimaryDeep: "#031334",
      accentPrimary: "#00A653",
      educationGold: "#E9B400",
      educationCoral: "#EC6244",
      educationSteelCyan: "#0C84B4",
      educationGraphiteBlue: "#25495F",
    },
  };
  const fullSlideFallback = {
    brand: { profile: "reltest-education", companyName: "RelTest Education" },
    canvas: { artifactScope: "full-slide", embeddingTarget: "standalone-slide" },
    typography: {
      minReadable: 18,
      preferredMinimumPrimary: 22,
      displayFontFamily: "\"Oxanium\", \"Archivo\", Arial, sans-serif",
      bodyFontFamily: "\"Archivo\", Arial, Helvetica, sans-serif",
    },
    stroke: { hairline: 1.5, normal: 2.5, emphasis: 4, maximum: 6 },
    shadow: { allowed: false },
    qa: {
      requiredBrandProfile: "reltest-education",
      requiredBodyFont: "Archivo",
      allowedDisplayFont: "Oxanium",
      legacyBrandNamesForbidden: ["Reltest Academy", "RelTest Academy"],
      metadataRequiredFields: REQUIRED_METADATA,
      contentModes: [...VALID_FULL_SLIDE_CONTENT_MODES],
      backgroundModes: [...VALID_FULL_SLIDE_BACKGROUND_MODES],
      densities: [...VALID_FULL_SLIDE_DENSITIES],
      maxVisibleColors: { low: 6, balanced: 8, normal: 10, dense: 12 },
      maxSaturatedAccentFamiliesOutsideCharts: 1,
      equalRankCardsMustShareHueFamily: true,
    },
    brandFrame: {
      chromeOwner: "downstream-repository",
      footerLabel: "RelTest Education | Reliability Engineer",
    },
    colors: {
      educationGreen: "#00A653",
      educationGold: "#E9B400",
      educationCoral: "#EC6244",
      educationSteelCyan: "#0C84B4",
      educationGraphiteBlue: "#25495F",
      navy: "#142452",
      navyDeep: "#031334",
      text: "#142452",
      textMuted: "#25495F",
      textSoft: "#687185",
      surface: "#FFFFFF",
    },
  };
  const fallback = fullSlide ? fullSlideFallback : contentFallback;

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
  const visibleSvgText = svgText.replace(/<defs\b[^>]*>[\s\S]*?<\/defs>/gi, "");
  const firstRect = visibleSvgText.match(/<rect\b([^>]*)>/i);
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
    pushIssue(context, issues, "design-metadata", "Missing slide quality metadata.", "Add slide-quality metadata in SVG metadata or scene manifest.");
    return;
  }

  const required = context.tokens.qa?.metadataRequiredFields || REQUIRED_METADATA;
  const missing = required.filter((field) => !String(metadata[field] || "").trim());
  if (missing.length) {
    pushIssue(context, issues, "design-metadata", "Slide quality metadata is incomplete.", `Missing: ${missing.join(", ")}${metadataSource ? ` (source: ${metadataSource})` : ""}`);
  }

  const requiredBrandProfile =
    context.tokens.qa?.requiredBrandProfile ||
    context.tokens.brand?.profile ||
    "";
  if (requiredBrandProfile && metadata.brandProfile !== requiredBrandProfile) {
    pushIssue(
      context,
      issues,
      "brand-profile",
      "SVG does not use the active RelTest Education brand profile.",
      `brandProfile=${metadata.brandProfile || "missing"}`,
      {
        expected: requiredBrandProfile,
        actual: metadata.brandProfile || "",
        recommendation: "Use brandProfile=reltest-education for new or fundamentally redesigned SVGs.",
      },
    );
  }

  if (context.isFullSlide) {
    if (metadata.embeddingTarget && metadata.embeddingTarget !== "standalone-slide") {
      pushIssue(context, issues, "full-slide-embedding", "Full-slide embeddingTarget must be standalone-slide.", `embeddingTarget=${metadata.embeddingTarget}`);
    }
    if (metadata.contentMode && !VALID_FULL_SLIDE_CONTENT_MODES.has(metadata.contentMode)) {
      pushIssue(context, issues, "full-slide-mode", "Full-slide contentMode must be full-slide.", metadata.contentMode);
    }
    if (metadata.backgroundMode && !VALID_FULL_SLIDE_BACKGROUND_MODES.has(metadata.backgroundMode)) {
      pushIssue(context, issues, "background-mode", "Full-slide backgroundMode must use the BrandFrame or a documented slide background.", metadata.backgroundMode);
    }
    if (metadata.density && !VALID_FULL_SLIDE_DENSITIES.has(metadata.density)) {
      pushIssue(context, issues, "design-density", "Full-slide density must be low, balanced, normal, or dense.", metadata.density);
    }
  } else {
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
  }

  const hasTitleMarker = TITLE_MARKER_PATTERN.test(svgText);
  const contentTitle = String(metadata.contentTitle || "").trim();
  const takeaway = String(metadata.takeaway || "").trim();
  if (!takeaway) {
    pushIssue(context, issues, "main-message", "Missing metadata takeaway for the slide.", "A single main message is required even when no visible content title is used.");
  }
  if (!contentTitle && !hasTitleMarker) {
    pushIssue(context, issues, "content-title", "No contentTitle or semantic content-title marker found.", context.isFullSlide
      ? "Full slides require a visible title and matching metadata."
      : "For Content-SVGs, metadata contentTitle is enough when the visible PowerPoint title lives outside the SVG.");
  }
}

function checkText(context, svgText, metadata, issues) {
  const textNodes = extractVisibleText(svgText);
  for (const text of textNodes) {
    for (const legacyName of context.tokens.qa?.legacyBrandNamesForbidden || []) {
      if (text.includes(legacyName)) {
        pushIssue(
          context,
          issues,
          "legacy-brand-name",
          "Visible text uses the retired RelTest Academy name.",
          text,
          { recommendation: "Replace the brand reference with RelTest Education." },
        );
      }
    }
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

function checkBrandTypography(context, svgText, issues) {
  if (!/<text\b/i.test(svgText)) return;
  const requiredBody = String(context.tokens.qa?.requiredBodyFont || "").trim();
  const allowedDisplay = String(context.tokens.qa?.allowedDisplayFont || "").trim();
  if (!requiredBody) return;

  const classFamilies = parseCssClassFontFamilies(svgText);
  const globalFamily = parseGlobalTextFontFamily(svgText);
  let hasRequiredBody = false;

  for (const match of svgText.matchAll(/<text\b([^>]*)>/gi)) {
    const attrs = match[1] || "";
    if (
      /data-qa-font-exception\s*=\s*["']allowed["']/i.test(attrs) &&
      /\bdata-qa-reason\s*=\s*["'][^"']+["']/i.test(attrs)
    ) {
      continue;
    }

    let family =
      parseStyleDeclarations(attrValue(attrs, "style"))["font-family"] ||
      "";
    if (!family) {
      const classes = attrValue(attrs, "class").split(/\s+/).filter(Boolean);
      for (const className of classes) {
        if (classFamilies.has(className)) {
          family = classFamilies.get(className);
          break;
        }
      }
    }
    if (!family) family = globalFamily;
    if (!family) family = attrValue(attrs, "font-family");

    const first = firstFontFamily(family);
    if (first === requiredBody.toLowerCase()) hasRequiredBody = true;
    const allowed = new Set(
      [requiredBody, allowedDisplay]
        .filter(Boolean)
        .map((item) => item.toLowerCase()),
    );
    if (!family) {
      pushIssue(
        context,
        issues,
        "brand-font-family",
        "Text has no determinable RelTest Education font family.",
        match[0],
        { element_id: attrValue(attrs, "id") },
      );
    } else if (!allowed.has(first)) {
      pushIssue(
        context,
        issues,
        "brand-font-family",
        "Text uses a non-Education leading font family.",
        family,
        {
          element_id: attrValue(attrs, "id"),
          expected: `${requiredBody} or ${allowedDisplay}`,
          actual: family,
          recommendation: `Lead body text with ${requiredBody}; use ${allowedDisplay} only for headlines or display text.`,
        },
      );
    }
  }

  if (!hasRequiredBody) {
    pushIssue(
      context,
      issues,
      "brand-font-family",
      `SVG contains no text led by the required ${requiredBody} body font.`,
      "",
      { recommendation: `Use font-family="${requiredBody}, Arial, Helvetica, sans-serif" for content text.` },
    );
  }
}

function checkTextPaintCascade(context, svgText, issues) {
  const globalFills = parseGlobalTextFills(svgText);
  if (!globalFills.size) return;
  const classFills = parseCssClassFills(svgText);

  const conflicts = [];
  for (const match of svgText.matchAll(/<text\b([^>]*)>/gi)) {
    const attrs = match[1] || "";
    if (
      /data-qa-text-fill-cascade\s*=\s*["']allowed["']/i.test(attrs) &&
      /\bdata-qa-reason\s*=\s*["'][^"']+["']/i.test(attrs)
    ) {
      continue;
    }
    const explicitFill = normalizeColor(attrValue(attrs, "fill"));
    if (!explicitFill) continue;
    const inlineFill = normalizeColor(parseStyleDeclarations(attrValue(attrs, "style")).fill);
    if (inlineFill) continue;
    const classes = attrValue(attrs, "class").split(/\s+/).filter(Boolean);
    if (classes.some((className) => classFills.has(className))) continue;
    if (![...globalFills].includes(explicitFill)) {
      conflicts.push({
        id: attrValue(attrs, "id"),
        explicitFill,
      });
    }
  }

  if (conflicts.length) {
    pushIssue(
      context,
      issues,
      "text-fill-cascade",
      "A global text fill overrides different presentation-attribute text colors.",
      `${conflicts.length} text node(s) declare ${[...new Set(conflicts.map((item) => item.explicitFill))].join(", ")} while global text fill is ${[...globalFills].join(", ")}.`,
      {
        element_id: conflicts[0].id,
        recommendation: "Remove the global text fill or assign text colors through explicit classes/inline styles, then verify computed contrast in the renderer.",
      },
    );
  }
}

function checkStrokeWeights(context, svgText, issues) {
  const maxStroke = Number(context.tokens.stroke?.maximum ?? 6);
  const classWidths = parseCssClassStrokeWidths(svgText);
  const heavy = [];

  for (const match of svgText.matchAll(/<(g|path|rect|circle|ellipse|line|polyline|polygon|use)\b([^>]*)>/gi)) {
    const attrs = match[2] || "";
    if (
      /data-qa-heavy-stroke\s*=\s*["']allowed["']/i.test(attrs) &&
      /\bdata-qa-reason\s*=\s*["'][^"']+["']/i.test(attrs)
    ) {
      continue;
    }

    let width = parseNumber(attrValue(attrs, "stroke-width"));
    const inlineWidth = parseNumber(parseStyleDeclarations(attrValue(attrs, "style"))["stroke-width"]);
    if (inlineWidth !== null) width = inlineWidth;
    if (width === null) {
      const classes = attrValue(attrs, "class").split(/\s+/).filter(Boolean);
      for (const className of classes) {
        if (classWidths.has(className)) {
          width = classWidths.get(className);
          break;
        }
      }
    }

    if (width !== null && width > maxStroke) {
      heavy.push({
        id: attrValue(attrs, "id"),
        tag: match[1].toLowerCase(),
        width,
      });
    }
  }

  if (heavy.length) {
    pushIssue(
      context,
      issues,
      "stroke-weight",
      "Stroke width exceeds the RelTest connector/line maximum.",
      `${heavy.length} element(s) exceed ${maxStroke}px; maximum found: ${Math.max(...heavy.map((item) => item.width))}px.`,
      {
        element_id: heavy[0].id,
        expected: `<= ${maxStroke}`,
        actual: Math.max(...heavy.map((item) => item.width)),
        recommendation: "Use token strokes (1.5/2.5/4px). Values above 6px require data-qa-heavy-stroke=\"allowed\" and data-qa-reason on the affected element.",
      },
    );
  }
}

function checkBounds(context, svgText, viewBox, issues) {
  if (!viewBox) return;
  const rootBodyStart = svgText.indexOf(">");
  const rootBodyEnd = svgText.lastIndexOf("</svg>");
  const rootBody = rootBodyStart >= 0 && rootBodyEnd > rootBodyStart
    ? svgText.slice(rootBodyStart + 1, rootBodyEnd)
    : svgText;
  const geometryText = rootBody
    .replace(/<defs\b[^>]*>[\s\S]*?<\/defs>/gi, "")
    // Nested SVG assets use their own viewBox coordinate system. Their internal
    // coordinates must not be compared with the outer slide viewBox.
    .replace(/<svg\b[^>]*>[\s\S]*?<\/svg>/gi, "");
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

  for (const match of geometryText.matchAll(/<(rect|image|text)\b([^>]*)>/gi)) {
    const attrs = match[2] || "";
    const x = parseNumber(attrValue(attrs, "x")) ?? 0;
    const y = parseNumber(attrValue(attrs, "y")) ?? 0;
    reportPoint(attrs, x, y, match[1]);
    const width = parseNumber(attrValue(attrs, "width"));
    const height = parseNumber(attrValue(attrs, "height"));
    if (width !== null && height !== null) reportPoint(attrs, x + width, y + height, `${match[1]} end`);
  }

  for (const match of geometryText.matchAll(/<circle\b([^>]*)>/gi)) {
    const attrs = match[1] || "";
    const cx = parseNumber(attrValue(attrs, "cx"));
    const cy = parseNumber(attrValue(attrs, "cy"));
    const r = parseNumber(attrValue(attrs, "r")) || 0;
    reportPoint(attrs, cx - r, cy - r, "circle min");
    reportPoint(attrs, cx + r, cy + r, "circle max");
  }

  for (const match of geometryText.matchAll(/<line\b([^>]*)>/gi)) {
    const attrs = match[1] || "";
    reportPoint(attrs, parseNumber(attrValue(attrs, "x1")), parseNumber(attrValue(attrs, "y1")), "line start");
    reportPoint(attrs, parseNumber(attrValue(attrs, "x2")), parseNumber(attrValue(attrs, "y2")), "line end");
  }

  for (const match of geometryText.matchAll(/<(polygon|polyline)\b([^>]*)>/gi)) {
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
      if (allowed.has(colors[index]) && allowed.has(colors[other])) continue;
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
  if (/<(?:filter|feDropShadow)\b/i.test(svgText) && context.tokens.shadow?.allowed === false) {
    pushIssue(context, issues, "brand-effects", "SVG filters are present although the active brand profile disallows shadows.", "Remove drop shadows and other filter-based depth effects.");
  }
}

function checkEmbedding(context, svgText, metadata, viewBox, issues) {
  if (/xml-stylesheet|<link\b|@import\b|@font-face[\s\S]*?url\(/i.test(svgText)) {
    pushIssue(context, issues, "powerpoint-embedding", "External stylesheets or external font references may not embed reliably in PowerPoint.", "");
  }
  const smallImageIds = [...svgText.matchAll(/<image\b([^>]*)>/gi)]
    .filter((match) => parseNumber(attrValue(match[1], "width")) === 64 && parseNumber(attrValue(match[1], "height")) === 64)
    .map((match) => attrValue(match[1], "id"))
    .filter(Boolean);
  const hasPowerPointSpeaker = smallImageIds.some((id) => {
    const escaped = id.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    return new RegExp(`(?:href|xlink:href)\\s*=\\s*["']#${escaped}["']`, "i").test(svgText);
  });
  if (hasPowerPointSpeaker || /data-role\s*=\s*["']powerpoint-speaker-control["']/i.test(svgText)) {
    pushIssue(context, issues, "powerpoint-speaker-control", "PowerPoint speaker control is present in the Content-SVG.", "Remove the bottom-right speaker graphic and its unused image/clip/use definitions.");
  }

  if (context.isFullSlide) {
    const downstreamOwnsChrome = context.tokens.brandFrame?.chromeOwner === "downstream-repository";
    const footerLabel = context.tokens.brandFrame?.footerLabel || "Professional Reliability Training | Reliability Engineer";
    if (downstreamOwnsChrome) {
      for (const finding of findDownstreamOwnedSlideChrome(svgText)) {
        pushIssue(
          context,
          issues,
          "downstream-master-element",
          "SVG contains slide chrome that must be rendered by the downstream repository.",
          finding,
        );
      }
    } else {
      if (!svgText.includes(footerLabel)) {
        pushIssue(context, issues, "full-slide-brand-frame", "Full slide is missing the required RelTest training footer.", footerLabel);
      }
      if (!/(?:class|data-role|data-qc-role|id)\s*=\s*["'][^"']*slide-title[^"']*["']/i.test(svgText)) {
        pushIssue(context, issues, "full-slide-brand-frame", "Full slide has no semantic slide-title element.", "Use the approved BrandFrame title zone.");
      }
      const hasOfficialLogo = /(?:data-role|data-qc-role)\s*=\s*["']official-logo["']|data-logo-status\s*=\s*["']approved-original-asset["']/i.test(svgText);
      if (!hasOfficialLogo) {
        pushIssue(context, issues, "full-slide-logo", "Full slide has no approved original RelTest logo asset.", `officialLogoStatus=${metadata?.officialLogoStatus || "missing"}`);
      }
    }
    if (!hasFullBackgroundRect(svgText, viewBox)) {
      pushIssue(context, issues, "full-slide-brand-frame", "Full slide has no complete BrandFrame background.", "Render a complete 1920x1080 background using the full-slide token source.");
    }
    return;
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

function checkPictograms(context, svgText, issues) {
  for (const finding of validatePictogramsInSvg(svgText)) {
    pushIssue(
      context,
      issues,
      finding.rule,
      finding.message,
      `Pictogram ${finding.pictogramIndex}${finding.detail ? `: ${finding.detail}` : ""}`,
    );
  }
}

function runStaticDesignQa({ svgFiles, manifestFiles = [], repoRoot, strictDesign = false }) {
  const issues = [];
  const files = [];
  const usedBrands = new Map();

  for (const svgPath of svgFiles) {
    const svgText = readUtf8(svgPath);
    const file = toPosixPath(repoRoot, svgPath);
    const viewBox = parseViewBox(svgText);
    const manifestMetadata = metadataFromManifests(svgPath, manifestFiles, repoRoot);
    const metadata = metadataFromSvg(svgText) || manifestMetadata.metadata;
    const artifactScope = metadata?.artifactScope === "full-slide" ? "full-slide" : "content-svg";
    const brand = loadBrandTokens(repoRoot, artifactScope);
    usedBrands.set(brand.path, brand);
    const context = {
      file,
      slide: "",
      strictDesign,
      tokens: brand.tokens,
      isFullSlide: artifactScope === "full-slide",
    };

    checkMetadata(context, svgText, metadata, manifestMetadata.metadata ? manifestMetadata.source : "", issues);
    checkText(context, svgText, metadata, issues);
    checkBrandTypography(context, svgText, issues);
    checkTextPaintCascade(context, svgText, issues);
    checkStrokeWeights(context, svgText, issues);
    checkBounds(context, svgText, viewBox, issues);
    checkColors(context, svgText, metadata, issues);
    checkDensityAndDecoration(context, svgText, metadata, issues);
    checkEmbedding(context, svgText, metadata, viewBox, issues);
    checkPictograms(context, svgText, issues);

    files.push({
      path: file,
      metadata: Boolean(metadata),
      metadataSource: metadata ? (manifestMetadata.metadata ? manifestMetadata.source : "svg") : "",
      artifactScope,
      tokenSource: toPosixPath(repoRoot, brand.path),
      colorCount: extractColors(svgText).length,
      textCount: extractVisibleText(svgText).length,
    });
  }

  const primaryBrand = [...usedBrands.values()][0] || loadBrandTokens(repoRoot);
  return {
    checked: true,
    strict: strictDesign,
    warnOnly: !strictDesign,
    brandTokens: {
      loaded: primaryBrand.loaded,
      path: toPosixPath(repoRoot, primaryBrand.path),
      profile: primaryBrand.tokens.brand?.profile || primaryBrand.tokens.brandProfile || "",
      companyName: primaryBrand.tokens.brand?.companyName || "",
    },
    tokenSources: [...usedBrands.values()].map((brand) => ({
      loaded: brand.loaded,
      path: toPosixPath(repoRoot, brand.path),
      profile: brand.tokens.brand?.profile || brand.tokens.brandProfile || "",
    })),
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
