"use strict";

const crypto = require("crypto");

const SUBSCRIPT_MAP = Object.freeze({
  "₀": "0",
  "₁": "1",
  "₂": "2",
  "₃": "3",
  "₄": "4",
  "₅": "5",
  "₆": "6",
  "₇": "7",
  "₈": "8",
  "₉": "9",
  "ᵢ": "i",
  "ₙ": "n",
});

const XML_ENTITIES = Object.freeze({
  amp: "&",
  apos: "'",
  gt: ">",
  lt: "<",
  quot: '"',
});

function decodeXmlEntities(value) {
  return String(value || "").replace(
    /&(?:#(x[0-9a-f]+|\d+)|([a-z]+));/gi,
    (match, numeric, named) => {
      if (numeric) {
        const radix = numeric[0].toLowerCase() === "x" ? 16 : 10;
        const parsed = Number.parseInt(radix === 16 ? numeric.slice(1) : numeric, radix);
        return Number.isFinite(parsed) ? String.fromCodePoint(parsed) : match;
      }
      return XML_ENTITIES[String(named || "").toLowerCase()] ?? match;
    },
  );
}

function normalizeText(value) {
  return decodeXmlEntities(value)
    .normalize("NFKC")
    .replace(/[\u2080-\u2089\u1d62\u2099]/g, (character) => SUBSCRIPT_MAP[character] || character)
    .replace(/ß/g, "ss")
    .toLocaleLowerCase("de")
    .replace(/<[^>]*>/g, " ")
    .replace(/[^\p{L}\p{N}]+/gu, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function extractSvgText(svgSource) {
  const nodes = [];
  const source = String(svgSource || "");
  for (const match of source.matchAll(/<text\b([^>]*)>([\s\S]*?)<\/text>/gi)) {
    const correctedFragment = decodeXmlEntities(match[2].replace(/<[^>]*>/g, " "))
      .replace(/\s+/g, " ")
      .trim();
    if (correctedFragment) {
      nodes.push({
        attrs: match[1] || "",
        text: correctedFragment,
      });
    }
  }
  const fragments = nodes.map((node) => node.text);
  return {
    nodes,
    fragments,
    text: fragments.join(" "),
    normalized: normalizeText(fragments.join(" ")),
  };
}

function attributeValue(attrs, name) {
  const escaped = String(name || "").replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const match = String(attrs || "").match(new RegExp(`\\b${escaped}\\s*=\\s*["']([^"']+)["']`, "i"));
  return match ? decodeXmlEntities(match[1]).trim() : "";
}

function isDocumentedTargetAddition(node) {
  const evidence = attributeValue(node.attrs, "data-source-evidence");
  const reference = attributeValue(node.attrs, "data-source-reference");
  return /^(?:source_svg|spoken_text|user_request|brand_frame|orientation)$/i.test(evidence) && Boolean(reference);
}

function isBrandFrameText(value) {
  const text = String(value || "").trim();
  return (
    text === "Professional Reliability Training | Reliability Engineer" ||
    /^RE\d+\s*(?:Â·|·|\||-)\s*Szene\s*\d+$/i.test(text)
  );
}

function significantTokens(value) {
  return normalizeText(value)
    .split(" ")
    .filter((token) => token.length > 1 || /\d/.test(token));
}

function textCoverage(expected, svgText) {
  const normalizedExpected = normalizeText(expected);
  const normalizedActual = normalizeText(svgText);
  if (!normalizedExpected) return { matched: true, score: 1, evidence: "empty_expected" };
  if (normalizedActual.includes(normalizedExpected)) {
    return { matched: true, score: 1, evidence: "normalized_phrase" };
  }

  const tokens = significantTokens(expected);
  if (!tokens.length) return { matched: true, score: 1, evidence: "no_significant_tokens" };
  const actualTokens = new Set(significantTokens(svgText));
  const matchedTokens = tokens.filter((token) => actualTokens.has(token));
  const score = matchedTokens.length / tokens.length;
  return {
    matched: score >= 0.8,
    score,
    evidence: matchedTokens.length ? `tokens:${matchedTokens.join(",")}` : "no_token_match",
  };
}

function suspiciousEncodingFragments(value) {
  const source = String(value || "");
  const patterns = [
    /Ã./g,
    /Â(?=\s|[\u00a0-\u00ff]|$)/g,
    /â(?:€|™|œ|ž|“|”|‘|’|€¦)/g,
    /áµ./g,
    /�/g,
  ];
  const fragments = new Set();
  for (const pattern of patterns) {
    for (const match of source.matchAll(pattern)) fragments.add(match[0]);
  }
  return [...fragments];
}

function finding(severity, code, message, detail = {}) {
  return {
    severity,
    code,
    message,
    ...detail,
  };
}

function sourceSlideLabel(slideNumber) {
  return `Quellfolie ${String(Number(slideNumber) || 0).padStart(3, "0")}`;
}

function contentChecksForSource(source, svgText) {
  const checks = [];
  const findings = [];
  const analyzedVisibleText = Array.isArray(source.analysis?.visibleText)
    ? source.analysis.visibleText
    : [];
  const sourceSvgText = extractSvgText(source.sourceSvgSource || "");
  const visibleText = analyzedVisibleText.length
    ? analyzedVisibleText
    : sourceSvgText.fragments.map((text, index) => ({
        id: `source-svg-text-${index + 1}`,
        text,
        role: "source_svg_text",
      }));

  for (const item of visibleText) {
    const expected = String(item?.text || "").trim();
    if (!expected) continue;
    if (item?.role === "source_title_not_rendered") {
      checks.push({
        source_slide_number: source.slideNumber,
        source_item_id: item.id || "",
        expected,
        result: "expected_omission",
        reason: "PowerPoint-Folientitel gehoeren nicht in das Content-SVG.",
      });
      continue;
    }

    const coverage = textCoverage(expected, svgText);
    checks.push({
      source_slide_number: source.slideNumber,
      source_item_id: item.id || "",
      expected,
      source_kind: analyzedVisibleText.length ? "analysis" : "source_svg",
      result: coverage.matched ? "textually_supported" : "manual_visual_check",
      score: Number(coverage.score.toFixed(3)),
      evidence: coverage.evidence,
    });
    if (!coverage.matched) {
      findings.push(finding(
        "warning",
        "source-content-not-textually-verifiable",
        `${sourceSlideLabel(source.slideNumber)}: "${expected}" ist im SVG-Text nicht eindeutig nachweisbar. Visuell pruefen, ob die Aussage durch Grafik, Formel oder Animation erhalten bleibt.`,
        {
          source_slide_number: source.slideNumber,
          source_item_id: item.id || "",
          expected,
        },
      ));
    }
  }

  return { checks, findings };
}

function buildContentCrosscheck(input) {
  const checkedAt = input.checkedAt || new Date().toISOString();
  const mapping = input.referenceMapping || {};
  const sources = Array.isArray(input.sources) ? input.sources : [];
  const findings = [];
  const contentChecks = [];
  const targetTextChecks = [];
  const manualReviewFocus = [];
  const targetSupportText = [];
  const isAdditionalSlide = input.isAdditionalSlide === true;
  const hasProposal = Boolean(input.proposal?.path && input.svgSource);

  if (mapping.mapping_type === "absorbed_source") {
    findings.push(finding(
      "info",
      "source-absorbed-into-output",
      `Diese Quellfolie besitzt bewusst kein eigenes SVG und wird in ${
        (mapping.output_slide_numbers || []).map((number) => `Folie ${String(number).padStart(3, "0")}`).join(", ") || "einer anderen Arbeitseinheit"
      } mitgeprueft.`,
    ));
  } else if (isAdditionalSlide) {
    if (sources.length) {
      findings.push(finding(
        "error",
        "additional-slide-has-source-reference",
        "Eine Zusatzfolie darf nicht stillschweigend einer Quell-SVG zugeordnet werden.",
      ));
    }
    if (!String(input.reviewNotes || "").trim()) {
      findings.push(finding(
        "warning",
        "additional-slide-brief-missing",
        "Fuer die Zusatzfolie fehlt ein Review-Briefing als inhaltliche Referenz.",
      ));
    }
    manualReviewFocus.push("Zusatzfolie gegen Review-Briefing und Nachbarfolien pruefen.");
  } else if (!sources.length) {
    findings.push(finding(
      "error",
      "source-reference-missing",
      "Fuer diese neue Folie ist keine Quellfolien-Referenz dokumentiert.",
    ));
  }

  if (mapping.mapping_source === "same_slide_fallback") {
    findings.push(finding(
      "warning",
      "reference-mapping-fallback",
      "Die Quellreferenz wurde nur aus der gleichen Foliennummer abgeleitet. Sie muss im Sequenzplan explizit bestaetigt werden.",
    ));
  }

  if (mapping.read_error) {
    findings.push(finding(
      "error",
      "reference-map-invalid",
      `Das Referenz-Mapping konnte nicht sauber gelesen werden: ${mapping.read_error}`,
    ));
  }

  if (!hasProposal && mapping.mapping_type !== "absorbed_source") {
    findings.push(finding(
      "error",
      "svg-proposal-missing",
      "Es gibt noch keinen aktuellen SVG-Vorschlag fuer den Crosscheck.",
    ));
  }

  for (const source of sources) {
    if (!source.oldSlide?.path) {
      findings.push(finding(
        "error",
        "source-render-missing",
        `${sourceSlideLabel(source.slideNumber)} besitzt keine aufloesbare Quell-SVG.`,
        { source_slide_number: source.slideNumber },
      ));
    }
    const sourceIsSvg = source.oldSlide?.sourceKind === "powerpoint_svg" ||
      /\.svg$/i.test(String(source.oldSlide?.path || ""));
    const sourceSvgText = extractSvgText(source.sourceSvgSource || "");
    targetSupportText.push(sourceSvgText.text);
    if (Array.isArray(source.analysis?.visibleText)) {
      targetSupportText.push(...source.analysis.visibleText.map((item) => String(item?.text || "")));
    }
    if (sourceIsSvg && !source.sourceSvgSource) {
      findings.push(finding(
        "error",
        "source-svg-unreadable",
        `${sourceSlideLabel(source.slideNumber)} konnte nicht als SVG gelesen werden.`,
        { source_slide_number: source.slideNumber },
      ));
    } else if (sourceIsSvg && !sourceSvgText.fragments.length) {
      findings.push(finding(
        "warning",
        "source-svg-text-not-extractable",
        `${sourceSlideLabel(source.slideNumber)} enthaelt keine direkt auslesbaren Textknoten. Inhalte koennen als Pfade vorliegen und muessen visuell geprueft werden.`,
        { source_slide_number: source.slideNumber },
      ));
    } else if (!sourceIsSvg && !source.analysis) {
      findings.push(finding(
        "warning",
        "source-analysis-missing",
        `${sourceSlideLabel(source.slideNumber)} nutzt nur den Legacy-Bildfallback und besitzt keine strukturierte Rebuild-Analyse.`,
        { source_slide_number: source.slideNumber },
      ));
      continue;
    }

    if (hasProposal) {
      const result = contentChecksForSource(source, input.svgText || "");
      contentChecks.push(...result.checks);
      findings.push(...result.findings);
    }

    const visualElements = Array.isArray(source.analysis?.visualElements)
      ? source.analysis.visualElements
      : [];
    for (const element of visualElements) {
      const role = String(element?.semantic_role || "").trim();
      if (role) {
        manualReviewFocus.push(`${sourceSlideLabel(source.slideNumber)}: ${role}`);
      }
    }
  }

  if (hasProposal) {
    const encodingFragments = suspiciousEncodingFragments(input.svgSource);
    if (encodingFragments.length) {
      findings.push(finding(
        "error",
        "suspicious-text-encoding",
        `Das SVG enthaelt verdaechtige Zeichenfolgen (${encodingFragments.join(", ")}). Umlaute, Sonderzeichen oder Indizes koennten fehlerhaft uebertragen sein.`,
        { fragments: encodingFragments },
      ));
    }
  }

  if (hasProposal && !isAdditionalSlide) {
    targetSupportText.push(String(input.spokenText || ""));
    const supportText = targetSupportText.filter(Boolean).join(" ");
    if (normalizeText(supportText)) {
      const targetNodes = extractSvgText(input.svgSource).nodes;
      for (const node of targetNodes) {
        if (isBrandFrameText(node.text)) {
          targetTextChecks.push({
            target_text: node.text,
            result: "brand_frame",
          });
          continue;
        }
        if (isDocumentedTargetAddition(node)) {
          targetTextChecks.push({
            target_text: node.text,
            result: "documented_addition",
            evidence_type: attributeValue(node.attrs, "data-source-evidence"),
            evidence_reference: attributeValue(node.attrs, "data-source-reference"),
          });
          continue;
        }
        const coverage = textCoverage(node.text, supportText);
        targetTextChecks.push({
          target_text: node.text,
          result: coverage.matched ? "source_or_spoken_supported" : "unsupported_target_text",
          score: Number(coverage.score.toFixed(3)),
          evidence: coverage.evidence,
        });
        if (!coverage.matched) {
          findings.push(finding(
            "warning",
            "target-text-not-source-supported",
            `Der sichtbare Zieltext "${node.text}" ist weder in den Quell-SVGs noch im zugeordneten Sprechertext eindeutig belegt.`,
            {
              target_text: node.text,
              recommendation: "Entfernen oder mit data-source-evidence und data-source-reference als belegte Zielergaenzung dokumentieren.",
            },
          ));
        }
      }
    }
  }

  const sourceCount = sources.length;
  const animationStepCount = Number(input.animationStepCount) || 0;
  const animationDecision = String(input.animationDecision || "needs_review");
  if (hasProposal && sourceCount > 1 && animationDecision === "animated" && animationStepCount === 0) {
    findings.push(finding(
      "warning",
      "merged-source-without-animation",
      "Mehrere Quellfolien wurden zusammengefuehrt, aber das SVG besitzt keine Animationsschritte fuer den Aufbau.",
    ));
  }

  if (hasProposal) {
    manualReviewFocus.push("Visuelle Aussage, Mengen, Positionen und Hervorhebungen gegen alle Referenzfolien pruefen.");
    if (animationDecision === "animated") {
      manualReviewFocus.push("Sprechertext-Reihenfolge gegen die semantisch geplanten Animationsschritte pruefen.");
    } else if (animationDecision === "static") {
      manualReviewFocus.push("Bestaetigen, dass die vollstaendige statische Darstellung klarer als ein schrittweiser Aufbau ist.");
    } else {
      manualReviewFocus.push("Animationsentscheidung vor der Freigabe semantisch auf static oder animated setzen.");
    }
  }

  const uniqueManualFocus = [...new Set(manualReviewFocus)];
  const errorCount = findings.filter((item) => item.severity === "error").length;
  const warningCount = findings.filter((item) => item.severity === "warning").length;
  const infoCount = findings.filter((item) => item.severity === "info").length;
  const status = mapping.mapping_type === "absorbed_source"
    ? "not_applicable"
    : errorCount
      ? "issues_found"
      : warningCount
        ? "review_required"
        : "precheck_passed";

  return {
    schema_version: "basisRebuildContentCrosscheck/v2",
    module_id: input.moduleId || "",
    output_slide_number: Number(input.outputSlideNumber) || null,
    checked_at: checkedAt,
    status,
    manual_review_required: hasProposal,
    reference_mapping: mapping,
    references: sources.map((source) => ({
      source_slide_number: source.slideNumber,
      source_svg_path: source.oldSlide?.sourceKind === "powerpoint_svg" ? source.oldSlide.path : "",
      source_svg_sha256: source.sourceSvgSource ? crypto.createHash("sha256").update(source.sourceSvgSource, "utf8").digest("hex") : "",
      old_slide_path: source.oldSlide?.path || "",
      analysis_path: source.analysisPath || "",
    })),
    proposal: input.proposal || null,
    summary: {
      source_count: sourceCount,
      checked_content_items: contentChecks.length,
      checked_target_text_items: targetTextChecks.length,
      errors: errorCount,
      warnings: warningCount,
      infos: infoCount,
      animation_steps: animationStepCount,
    },
    findings,
    content_checks: contentChecks,
    target_text_checks: targetTextChecks,
    manual_review_focus: uniqueManualFocus,
  };
}

module.exports = {
  buildContentCrosscheck,
  decodeXmlEntities,
  extractSvgText,
  normalizeText,
  suspiciousEncodingFragments,
  textCoverage,
};
