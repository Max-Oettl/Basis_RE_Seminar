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
    accent: colors.navy,
    accentSoft: colors.navy10,
    educationAccent: colors.educationGreen,
    educationAccentSoft: colors.educationGreen10,
    // Equal-rank content is intentionally kept in a quiet navy tonal scale.
    // Green, gold and coral are reserved for an explicit focus or semantic state.
    secondary: colors.navy80,
    secondarySoft: colors.navy10,
    success: colors.navy60,
    successSoft: colors.surfaceSoft,
    failure: colors.educationCoral,
    failureSoft: colors.surfaceSoft,
    semanticSuccess: colors.educationGreen,
    semanticSuccessSoft: colors.surfaceSoft,
    semanticWarning: colors.educationGold,
    semanticWarningSoft: colors.surfaceSoft,
    deep: colors.navyDeep,
    deepSoft: colors.navy80,
    text: colors.text,
    muted: colors.navy80,
    soft: colors.navy60,
    border: colors.mediaBorder,
    surface: colors.surface,
    surfaceSoft: colors.surfaceSoft,
    cyan: colors.navy80,
    cyanSoft: colors.navy10,
  }),
});
