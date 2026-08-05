"use strict";

function decodeXmlText(value) {
  return String(value || "")
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

function readAttribute(tag, name) {
  const match = String(tag).match(new RegExp(`\\b${name}\\s*=\\s*["']([^"']+)["']`, "i"));
  return match ? match[1] : "";
}

function collectAnimationTargetText(svgText) {
  const records = [];
  const stack = [];
  let currentText = null;

  for (const token of String(svgText || "").match(/<!--[\s\S]*?-->|<[^>]+>|[^<]+/g) || []) {
    if (token.startsWith("<!--") || token.startsWith("<?") || token.startsWith("<!")) continue;
    if (!token.startsWith("<")) {
      if (currentText) currentText.parts.push(token);
      continue;
    }

    const closing = token.match(/^<\/\s*([A-Za-z][\w:.-]*)/);
    if (closing) {
      const name = closing[1].toLowerCase();
      if (name === "text" && currentText) {
        const value = decodeXmlText(currentText.parts.join(""));
        if (value) {
          for (const element of stack) {
            if (element.target) element.target.texts.push(value);
          }
        }
        currentText = null;
      }
      while (stack.length) {
        const element = stack.pop();
        if (element.name === name) break;
      }
      continue;
    }

    const opening = token.match(/^<\s*([A-Za-z][\w:.-]*)/);
    if (!opening) continue;
    const name = opening[1].toLowerCase();
    const isSelfClosing = /\/\s*>$/.test(token);
    let target = null;
    if (name === "g" && /^true$/i.test(readAttribute(token, "data-anim-target"))) {
      target = {
        targetId: readAttribute(token, "id"),
        label: readAttribute(token, "data-anim-label"),
        kind: readAttribute(token, "data-anim-kind"),
        semanticRole: readAttribute(token, "data-semantic-role"),
        texts: [],
      };
      records.push(target);
    }
    stack.push({ name, target });
    if (name === "text") currentText = { parts: [] };
    if (isSelfClosing) stack.pop();
  }

  return records;
}

function inspectSemanticAnimationBoundaries(svgText) {
  const findings = [];
  const bulletMarker = /^[•◦▪▫‣⁃]$/u;
  const sectionLabel = /^(?:(?:Ursache|Folge|Kosten(?:\s*&\s*Konsequenz)?|Konsequenzen?)\s*:|Ausmaß|Ausmass)$/iu;

  for (const target of collectAnimationTargetText(svgText)) {
    if (target.kind !== "semantic_group" && !target.semanticRole) continue;
    const terminalText = target.texts[target.texts.length - 1] || "";
    const detail = `${target.targetId || "target ohne ID"}: ${terminalText}`;
    if (bulletMarker.test(terminalText)) {
      findings.push({
        code: "orphan_list_marker",
        message: "Animation target ends with an orphan list marker.",
        detail,
      });
    } else if (sectionLabel.test(terminalText)) {
      findings.push({
        code: "detached_list_label",
        message: "Animation target ends with a section label detached from its content.",
        detail,
      });
    }
  }

  return findings;
}

module.exports = {
  collectAnimationTargetText,
  inspectSemanticAnimationBoundaries,
};
