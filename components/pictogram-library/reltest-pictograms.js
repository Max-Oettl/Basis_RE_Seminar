"use strict";

const pictogramTokens = require("../../brand/reltest-education-pictogram-tokens.json");
const pictogramRegistry = require("./pictogram-registry.json");

const ICONS = {
  percent: '<circle cx="7" cy="7" r="2.4"/><circle cx="17" cy="17" r="2.4"/><path d="M5 19L19 5"/>',
  package: '<path d="M4 7.5L12 3l8 4.5v9L12 21l-8-4.5z"/><path d="M4 7.5l8 4.5 8-4.5M12 12v9"/>',
  clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3.5 2"/>',
  settings: '<circle cx="12" cy="12" r="3"/><path d="M12 2v3M12 19v3M2 12h3M19 12h3M4.9 4.9L7 7M17 17l2.1 2.1M19.1 4.9L17 7M7 17l-2.1 2.1"/>',
  cloud: '<path d="M6.5 17.5h10a4.5 4.5 0 0 0 .6-9A6 6 0 0 0 5.7 10 3.8 3.8 0 0 0 6.5 17.5z"/><path d="M8 20v1M12 20v1M16 20v1"/>',
  shieldCheck: '<path d="M12 3l7 3v5c0 4.6-2.9 8.1-7 10-4.1-1.9-7-5.4-7-10V6z"/><path d="M8.5 12l2.2 2.2 4.8-5"/>',
  shield: '<path d="M12 3l7 3v5c0 4.6-2.9 8.1-7 10-4.1-1.9-7-5.4-7-10V6z"/><path d="M12 7v7M12 17h.01"/>',
  calendarCheck: '<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M7 3v4M17 3v4M3 9h18M8 15l2.2 2.2L16 12"/>',
  machineAlert: '<circle cx="10" cy="12" r="4"/><path d="M10 2v3M10 19v3M0 12h3M17 12h3M3 5l2 2M15 17l2 2M17 5l-2 2M5 17l-2 2M21 8v6M21 17h.01"/>',
  bolt: '<path d="M13.5 2.5L5.5 13h5L9 21.5 18.5 10h-5z"/>',
  car: '<path d="M5 17h14l-1-6-2-4H8l-2 4z"/><path d="M5 17v2M19 17v2M4 12h16M7.5 14.5h.01M16.5 14.5h.01"/>',
  wrenchAlert: '<path d="M14.5 6.5a4.5 4.5 0 0 1-5.8 5.8L4 17l3 3 4.7-4.7a4.5 4.5 0 0 1 5.8-5.8l-3 3-3-3z"/><path d="M20 3v4M20 10h.01"/>',
  target: '<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1.5"/><path d="M15.5 8.5L21 3M17 3h4v4"/>',
  layers: '<path d="M12 3l9 5-9 5-9-5z"/><path d="M4 12l8 4 8-4M4 16l8 4 8-4"/>',
  search: '<circle cx="10.5" cy="10.5" r="6.5"/><path d="M15.5 15.5L21 21M8 10.5l1.8 1.8 3.6-4"/>',
  flask: '<path d="M9 3h6M10 3v6l-5 9a2 2 0 0 0 1.8 3h10.4A2 2 0 0 0 19 18l-5-9V3"/><path d="M7.5 16h9M9 13h6"/>',
  factory: '<path d="M3 21V9l6 3V8l6 4V5h6v16z"/><path d="M7 17h2M12 17h2M17 17h2M17 9h4"/>',
  eye: '<path d="M2 12s3.5-6 10-6 10 6 10 6-3.5 6-10 6S2 12 2 12z"/><circle cx="12" cy="12" r="3"/>',
  database: '<ellipse cx="12" cy="5" rx="8" ry="3"/><path d="M4 5v7c0 1.7 3.6 3 8 3s8-1.3 8-3V5M4 12v7c0 1.7 3.6 3 8 3s8-1.3 8-3v-7"/>',
  loop: '<path d="M18 7a8 8 0 0 0-13 2M5 9H2V6M6 17a8 8 0 0 0 13-2M19 15h3v3"/>',
  listCheck: '<path d="M9 6h11M9 12h11M9 18h11M3 6l1.5 1.5L7 4.5M3 12l1.5 1.5L7 10.5M3 18l1.5 1.5L7 16.5"/>',
};

function pictogram(kind, options = {}) {
  const content = ICONS[kind];
  if (!content) throw new Error(`Unknown RelTest pictogram: ${kind}`);
  const registryItem = pictogramRegistry.items.find((item) => item.id === kind);
  if (!registryItem || registryItem.status !== "active") {
    throw new Error(`RelTest pictogram is not active in the registry: ${kind}`);
  }
  const cx = Number(options.cx) || 0;
  const cy = Number(options.cy) || 0;
  const size = Number(options.size)
    || pictogramTokens.displaySizes.minimumPlacementPx.compactUniversal;
  if (size < pictogramTokens.displaySizes.hardMinimumSourcePx) {
    throw new Error(
      `RelTest pictogram '${kind}' is ${size}px; minimum is ${pictogramTokens.displaySizes.hardMinimumSourcePx}px.`,
    );
  }
  const color = String(options.color || pictogramTokens.colors.defaultStroke).toUpperCase();
  const background = String(options.background || "").toUpperCase();
  const radius = Number(options.radius) || size * 0.72;
  const scale = size / 24;
  const allowedColors = new Set(
    Object.values(pictogramTokens.colors)
      .flatMap((value) => (Array.isArray(value) ? value : [value]))
      .filter((value) => typeof value === "string" && /^#[0-9A-F]{6}$/i.test(value))
      .map((value) => value.toUpperCase()),
  );
  if (!allowedColors.has(color)) {
    throw new Error(`Color '${color}' is not part of the RelTest Education pictogram palette.`);
  }
  if (background && !allowedColors.has(background)) {
    throw new Error(`Background '${background}' is not part of the RelTest Education pictogram palette.`);
  }
  const semanticRole = options.semanticRole || registryItem.semanticRoles[0];
  if (!pictogramTokens.elearning.semanticRoles.includes(semanticRole)) {
    throw new Error(`Unknown pictogram semantic role: ${semanticRole}`);
  }
  const backgroundMarkup = background
    ? `<circle cx="${cx}" cy="${cy}" r="${radius}" fill="${background}" data-role="decorative"/>`
    : "";
  const ariaLabel = String(options.ariaLabel || options.label || "").trim();
  const ariaMarkup = ariaLabel
    ? `role="img" aria-label="${escapeAttribute(ariaLabel)}"`
    : 'aria-hidden="true"';
  const scaleReview = size < pictogramTokens.displaySizes.preferredMinimumSourcePx
    ? ' data-pictogram-scale-review="required"'
    : "";
  const contrastReview = color === pictogramTokens.colors.warning.toUpperCase()
    ? ' data-pictogram-contrast-review="dark-field-or-high-contrast-outline-required"'
    : "";
  return `<g data-component="${pictogramTokens.qa.requiredDataComponent}" data-pictogram-kind="${kind}" data-pictogram-style="${pictogramTokens.qa.requiredDataStyle}" data-pictogram-size="${size}" data-pictogram-semantic-role="${semanticRole}" ${ariaMarkup} focusable="false"${scaleReview}${contrastReview}>${backgroundMarkup}<g transform="translate(${cx - size / 2} ${cy - size / 2}) scale(${scale})" fill="none" stroke="${color}" stroke-width="${pictogramTokens.geometry.strokeWidth}" stroke-linecap="${pictogramTokens.geometry.strokeLinecap}" stroke-linejoin="${pictogramTokens.geometry.strokeLinejoin}">${content}</g></g>`;
}

function escapeAttribute(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll('"', "&quot;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");
}

module.exports = {
  pictogram,
  pictogramKinds: Object.freeze(Object.keys(ICONS)),
  pictogramRegistry,
  pictogramTokens,
};
