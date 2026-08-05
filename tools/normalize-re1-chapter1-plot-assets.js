"use strict";

const fs = require("node:fs");
const path = require("node:path");

const repoRoot = path.resolve(__dirname, "..");
const plotSpecs = {
  2: {
    file: "rebuild-proposals/svg/RE1/slide_002/plots/recall_statistics.svg",
    title: "Rückrufstatistik 2009 bis 2019",
    takeaway: "Rückrufaktionen und betroffene Fahrzeuge werden über elf Jahre verglichen.",
  },
  7: {
    file: "rebuild-proposals/svg/RE1/slide_007/plots/purchase_criteria.svg",
    expandViewBoxLeft: 24,
    title: "Kriterien beim PKW-Neuwagenkauf",
    takeaway: "Elf Kaufkriterien werden über vier Befragungsjahre verglichen.",
  },
  10: {
    file: "rebuild-proposals/svg/RE1/slide_010/plots/stress_strength.svg",
    title: "Stress-Strength-Interference",
    takeaway: "Belastung und Belastbarkeit überlappen im Ausfallbereich.",
  },
  11: {
    file: "rebuild-proposals/svg/RE1/slide_011/plots/stress_strength.svg",
    removeInitialStrengthTarget: true,
    title: "Verschiebung der Belastbarkeit",
    takeaway: "Eine höhere Belastbarkeit verschiebt die Verteilung nach rechts.",
  },
  12: {
    file: "rebuild-proposals/svg/RE1/slide_012/plots/stress_strength.svg",
    title: "Stress-Strength-Zielkonflikt",
    takeaway: "Höhere Belastbarkeit reduziert den Ausfallbereich.",
  },
};

const colorMap = new Map([
  ["#062D46", "#031334"],
  ["#102A43", "#031334"],
  ["#139CCB", "#00A754"],
  ["#6A7A86", "#25495F"],
  ["#79C7E3", "#CCEDDD"],
  ["#8E2E3C", "#EC6244"],
  ["#D1495B", "#EC6244"],
  ["#E2E8F0", "#CDD0D6"],
  ["#D9F0F7", "#E6F6EE"],
  ["#007EA7", "#00A754"],
  ["#2798B8", "#0C84B4"],
  ["#6FB8D1", "#E9B400"],
  ["#ACD7E4", "#25495F"],
]);

function parseSlides(argv) {
  const index = argv.indexOf("--slides");
  if (index < 0) return new Set(Object.keys(plotSpecs).map(Number));
  const raw = argv[index + 1];
  if (!raw) throw new Error("--slides requires a slide number or range.");
  const slides = new Set();
  for (const token of raw.split(",")) {
    const match = token.trim().match(/^(\d+)(?:-(\d+))?$/);
    if (!match) throw new Error(`Invalid slide selection: ${token}`);
    const start = Number(match[1]);
    const end = Number(match[2] || match[1]);
    for (let slide = Math.min(start, end); slide <= Math.max(start, end); slide += 1) slides.add(slide);
  }
  return slides;
}

function normalizePlot(spec) {
  const filePath = path.resolve(repoRoot, spec.file);
  let svg = fs.readFileSync(filePath, "utf8");

  for (const [from, to] of colorMap) {
    svg = svg.replaceAll(from, to).replaceAll(from.toLowerCase(), to);
  }
  if (spec.expandViewBoxLeft) {
    svg = svg.replace(
      /viewBox=["']0 0 ([0-9.]+) ([0-9.]+)["']/i,
      (match, width, height) => `viewBox="-${spec.expandViewBoxLeft} 0 ${Number(width) + spec.expandViewBoxLeft} ${height}"`,
    );
  }
  if (spec.removeInitialStrengthTarget) {
    const initialStart = svg.indexOf('<g id="initial_strength_distribution"');
    const followingTarget = svg.indexOf('<g id="failure_overlap"', initialStart);
    if (initialStart >= 0 && followingTarget > initialStart) {
      svg = `${svg.slice(0, initialStart)}${svg.slice(followingTarget)}`;
    }
  }
  svg = svg
    .replace(
      /<(path|rect|line|circle|ellipse|polygon|polyline)\b([^>]*?)\sdata-qc-role=["'](?:data|decorative)["'](?:\sdata-qa-reason=["'][^"']*["'])?(?:\sdata-qc-layer=["'][^"']*["'])?(?:\sdata-qc-allow-overlap=["'][^"']*["'])?([^>]*)>/gi,
      '<$1$2 data-role="decorative" data-qa-reason="Matplotlib plot geometry"$3>',
    )
    .replaceAll("font-family: 'DejaVu Sans'", "font-family: Archivo, Arial, Helvetica, sans-serif")
    .replaceAll('font-family: "DejaVu Sans"', "font-family: Archivo, Arial, Helvetica, sans-serif")
    .replaceAll("font-family: 'Archivo', Arial, Helvetica, sans-serif", "font-family: Archivo, Arial, Helvetica, sans-serif")
    .replaceAll("font-family: 'Archivo'", "font-family: Archivo, Arial, Helvetica, sans-serif")
    .replace(/font-size:\s*(?:1[0-7](?:\.\d+)?)px/gi, "font-size: 18px")
    .replace(/<metadata\b[\s\S]*?<\/metadata>\s*/i, "")
    .replace(
      /<svg\b([^>]*)>/i,
      (match, attrs) => {
        const cleaned = attrs
          .replace(/\sdata-qc-group=["'][^"']*["']/gi, "")
          .replace(/\sdata-qc-layer=["'][^"']*["']/gi, "");
        return `<svg${cleaned} data-qc-group="plot_asset" data-qc-layer="data">`;
      },
    )
    .replace(
      /<g\b([^>]*\bid=["']legend_1["'][^>]*)>/i,
      (match, attrs) => /data-qc-allow-overlap=/i.test(attrs)
        ? match
        : `<g${attrs} data-qc-allow-overlap="true">`,
    )
    .replace(
      /<text\b(?![^>]*\bdata-qc-role=)([^>]*)>/gi,
      '<text data-qc-role="text" data-qc-layer="text" data-qc-allow-overlap="true"$1>',
    )
    .replace(
      /<(path|rect|line|circle|ellipse|polygon|polyline)\b(?![^>]*\bdata-(?:qc-)?role=)([^>]*)>/gi,
      '<$1 data-role="decorative" data-qa-reason="Matplotlib plot geometry"$2>',
    );

  const metadata = {
    artifactScope: "content-svg",
    embeddingTarget: "powerpoint-slide",
    slideType: "technical-plot-asset",
    contentTitle: spec.title,
    layoutIntent: "module-local-python-plot",
    takeaway: spec.takeaway,
    density: "dense",
    contentMode: "full-content-area",
    backgroundMode: "transparent",
    brandProfile: "reltest-education",
    brandVariant: "education-plot-asset",
  };
  svg = svg.replace(
    /(<svg\b[^>]*>)/i,
    `$1\n <metadata id="slide_quality_metadata" type="application/json"><![CDATA[${JSON.stringify(metadata)}]]></metadata>`,
  );

  fs.writeFileSync(filePath, svg, "utf8");
  process.stdout.write(`Normalized ${path.relative(repoRoot, filePath)}\n`);
}

function main() {
  for (const slide of [...parseSlides(process.argv)].sort((left, right) => left - right)) {
    const spec = plotSpecs[slide];
    if (!spec) throw new Error(`No chapter-one plot asset for slide ${slide}.`);
    normalizePlot(spec);
  }
}

main();
