"use strict";

const fs = require("node:fs");
const path = require("node:path");

const repoRoot = path.resolve(__dirname, "..");
const tokenPath = path.join(repoRoot, "brand", "reltest-education-slide-design-tokens.json");
const tokens = JSON.parse(fs.readFileSync(tokenPath, "utf8"));
const pictogramTokens = JSON.parse(fs.readFileSync(
  path.join(repoRoot, "brand", "reltest-education-pictogram-tokens.json"),
  "utf8",
));
const colors = tokens.colors;

module.exports = Object.freeze({
  brandProfile: tokens.brand.profile,
  brandVariant: "education-production",
  bodyFontFamily: tokens.typography.bodyFontFamily,
  displayFontFamily: tokens.typography.displayFontFamily,
  pictograms: Object.freeze({
    styleProfile: pictogramTokens.style,
    defaultForeground: pictogramTokens.colors.defaultStroke,
    primaryAccent: pictogramTokens.colors.educationAccent,
    minimumNonTextContrast: pictogramTokens.elearning.contrastRatioMinimum,
    minimumPlacementPx: Object.freeze({ ...pictogramTokens.displaySizes.minimumPlacementPx }),
  }),
  background: Object.freeze({
    start: colors.backgroundStart,
    mid: colors.backgroundMid,
    end: colors.backgroundEnd,
  }),
  colors: Object.freeze({
    accent: colors.educationGreen,
    accentSoft: colors.educationGreen10,
    secondary: colors.educationGold,
    secondarySoft: colors.warningTint,
    success: colors.educationGreen,
    successSoft: colors.educationGreen10,
    failure: colors.educationCoral,
    failureSoft: colors.failureTint,
    deep: colors.navy,
    deepSoft: colors.educationGraphiteBlue,
    text: colors.text,
    muted: colors.textSoft,
    soft: colors.navy40,
    border: colors.mediaBorder,
    surface: colors.surface,
    surfaceSoft: colors.surfaceSoft,
    cyan: colors.educationSteelCyan,
    cyanSoft: colors.surfaceSoft,
  }),
});
