"use strict";

const VISIBLE_TITLE_PATTERN = /<text\b[^>]*\bclass\s*=\s*["'][^"']*\bslide-title\b[^"']*["'][^>]*>/i;
const TRAINING_FOOTER = "Professional Reliability Training | Reliability Engineer";
const SCENE_LABEL_PATTERN = /\bRE\d+\s*[·•]\s*Szene\s+\d+\b/i;
const OFFICIAL_LOGO_PATTERN = /\bid\s*=\s*["']official_logo_reserved["']/i;

function stripDownstreamOwnedSlideChrome(svgText) {
  let result = String(svgText);

  result = result.replace(
    /(?:\r?\n)?[ \t]*<text\b([^>]*)>([\s\S]*?)<\/text>/gi,
    (markup, attributes, content) => {
      const className = attributes.match(/\bclass\s*=\s*["']([^"']*)["']/i)?.[1] || "";
      const plainText = content.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
      const isVisibleSlideTitle = className.split(/\s+/).includes("slide-title");
      const isTrainingFooter = plainText === TRAINING_FOOTER;
      const isSceneLabel = SCENE_LABEL_PATTERN.test(plainText);
      return isVisibleSlideTitle || isTrainingFooter || isSceneLabel ? "" : markup;
    },
  );

  return result
    .replace(/(?:\r?\n)?[ \t]*\.slide-title\s*\{[^}]*\}/gi, "")
    .replace(/(?:\r?\n)?[ \t]*<rect\b(?=[^>]*\bx\s*=\s*["']74["'])(?=[^>]*\by\s*=\s*["']36["'])(?=[^>]*\bwidth\s*=\s*["']118["'])(?=[^>]*\bheight\s*=\s*["']5["'])[^>]*\/>/gi, "")
    .replace(/(?:\r?\n)?[ \t]*<line\b(?=[^>]*\bx1\s*=\s*["']78["'])(?=[^>]*\by1\s*=\s*["']148["'])(?=[^>]*\bx2\s*=\s*["']1842["'])(?=[^>]*\by2\s*=\s*["']148["'])[^>]*\/>/gi, "")
    .replace(/(?:\r?\n)?[ \t]*<line\b(?=[^>]*\bx1\s*=\s*["']78["'])(?=[^>]*\by1\s*=\s*["']982["'])(?=[^>]*\bx2\s*=\s*["']1842["'])(?=[^>]*\by2\s*=\s*["']982["'])[^>]*\/>/gi, "")
    .replace(/(?:\r?\n)?[ \t]*<g\b(?=[^>]*\bid\s*=\s*["']official_logo_reserved["'])[^>]*\/>/gi, "");
}

function findDownstreamOwnedSlideChrome(svgText) {
  const value = String(svgText);
  const findings = [];
  if (VISIBLE_TITLE_PATTERN.test(value)) findings.push("visible_slide_title");
  if (value.includes(TRAINING_FOOTER)) findings.push("training_footer");
  if (SCENE_LABEL_PATTERN.test(value)) findings.push("scene_label");
  if (/<rect\b(?=[^>]*\bx\s*=\s*["']74["'])(?=[^>]*\by\s*=\s*["']36["'])(?=[^>]*\bwidth\s*=\s*["']118["'])(?=[^>]*\bheight\s*=\s*["']5["'])/i.test(value)) findings.push("title_accent");
  if (/<line\b(?=[^>]*\bx1\s*=\s*["']78["'])(?=[^>]*\by1\s*=\s*["']148["'])(?=[^>]*\bx2\s*=\s*["']1842["'])(?=[^>]*\by2\s*=\s*["']148["'])/i.test(value)) findings.push("title_rule");
  if (/<line\b(?=[^>]*\bx1\s*=\s*["']78["'])(?=[^>]*\by1\s*=\s*["']982["'])(?=[^>]*\bx2\s*=\s*["']1842["'])(?=[^>]*\by2\s*=\s*["']982["'])/i.test(value)) findings.push("footer_rule");
  if (OFFICIAL_LOGO_PATTERN.test(value)) findings.push("logo_placeholder");
  return findings;
}

module.exports = {
  findDownstreamOwnedSlideChrome,
  stripDownstreamOwnedSlideChrome,
};
