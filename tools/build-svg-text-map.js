const crypto = require("crypto");
const fs = require("fs");
const path = require("path");

const repoRoot = path.resolve(__dirname, "..");

function parseArguments(argv) {
  const values = {};
  for (let index = 0; index < argv.length; index += 1) {
    const key = argv[index];
    if (!key.startsWith("--")) continue;
    values[key.slice(2)] = argv[index + 1];
    index += 1;
  }
  return values;
}

function requireArgument(args, name) {
  const value = args[name];
  if (!value) throw new Error(`Fehlendes Argument --${name}`);
  return value;
}

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, "utf8").replace(/^\uFEFF/, ""));
}

function sha256File(filePath) {
  return crypto.createHash("sha256").update(fs.readFileSync(filePath)).digest("hex");
}

function relativePath(filePath) {
  return path.relative(repoRoot, filePath).split(path.sep).join("/");
}

function fileNameFromRepoPath(repoPath) {
  return path.basename(repoPath.replaceAll("/", path.sep));
}

function slideNumberFromName(fileName) {
  const match = fileName.match(/(?:folie|slide|seite|page)[_\-\s]*(\d+)/i);
  return match ? Number(match[1]) : null;
}

function sourceSlideKey(slideNumber) {
  return `slide_${String(slideNumber).padStart(3, "0")}`;
}

function emptyQa() {
  return { issues: [], warnings: [], open_questions: [] };
}

function unique(values) {
  return [...new Set(values)];
}

function collectSvgFiles(directory) {
  const results = [];
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    const absolutePath = path.join(directory, entry.name);
    if (entry.isDirectory()) {
      results.push(...collectSvgFiles(absolutePath));
    } else if (entry.isFile() && path.extname(entry.name).toLowerCase() === ".svg") {
      results.push({
        name: entry.name,
        absolutePath,
        slideNumber: slideNumberFromName(entry.name),
      });
    }
  }
  return results;
}

function alignmentSectionRef(entry) {
  if (typeof entry === "string") return entry;
  return `${entry?.source_docx_name || ""}#${entry?.section_id || ""}`;
}

function main() {
  const args = parseArguments(process.argv.slice(2));
  const moduleId = requireArgument(args, "module");
  const svgDirectory = path.resolve(requireArgument(args, "svg-dir"));
  const extractionIndexPath = path.resolve(requireArgument(args, "extraction-index"));
  const alignmentPlanPath = path.resolve(requireArgument(args, "alignment-plan"));
  const outputPath = path.resolve(requireArgument(args, "output"));

  const extractionIndex = readJson(extractionIndexPath);
  const alignmentPlan = readJson(alignmentPlanPath);
  if (extractionIndex.module_id !== moduleId || alignmentPlan.module_id !== moduleId) {
    throw new Error("Modul-ID stimmt zwischen Argumenten, Extraktion und Alignment-Plan nicht ueberein.");
  }

  const svgFiles = collectSvgFiles(svgDirectory)
    .sort((left, right) => (left.slideNumber || 0) - (right.slideNumber || 0));

  const svgBySlide = new Map();
  for (const svg of svgFiles) {
    if (!svg.slideNumber) throw new Error(`Keine Foliennummer in SVG-Datei: ${svg.name}`);
    if (svgBySlide.has(svg.slideNumber)) throw new Error(`Doppelte SVG-Foliennummer: ${svg.slideNumber}`);
    svgBySlide.set(svg.slideNumber, svg);
  }
  const activeSlideOrder = new Map(
    svgFiles.map((svg, index) => [svg.slideNumber, index]),
  );

  const documentByName = new Map(
    extractionIndex.documents.map((document) => [fileNameFromRepoPath(document.source_docx), document]),
  );
  const mappings = [];
  const mappedSlides = new Set();
  const mappedSections = new Set();
  const usedDocuments = new Set();
  const deferredDocumentNames = new Set(
    (alignmentPlan.deferred_documents || []).map((entry) =>
      typeof entry === "string" ? entry : entry.source_docx_name,
    ),
  );
  const deferredSectionRefs = new Set(
    (alignmentPlan.deferred_text_sections || []).map(alignmentSectionRef),
  );
  const knownSectionRefs = new Set();
  for (const document of extractionIndex.documents) {
    const documentName = fileNameFromRepoPath(document.source_docx);
    for (const section of document.sections) {
      knownSectionRefs.add(`${documentName}#${section.section_id}`);
    }
  }
  for (const sectionRef of deferredSectionRefs) {
    if (!knownSectionRefs.has(sectionRef)) {
      throw new Error(`Zurueckgestellter Textabschnitt fehlt im Extraktionsindex: ${sectionRef}`);
    }
  }

  for (const plannedDocument of alignmentPlan.documents) {
    const document = documentByName.get(plannedDocument.source_docx_name);
    if (!document) throw new Error(`DOCX fehlt im Extraktionsindex: ${plannedDocument.source_docx_name}`);
    usedDocuments.add(plannedDocument.source_docx_name);
    const sectionById = new Map(document.sections.map((section) => [section.section_id, section]));

    for (const plannedSection of plannedDocument.sections) {
      const section = sectionById.get(plannedSection.section_id);
      if (!section) {
        throw new Error(`Abschnitt fehlt: ${plannedDocument.source_docx_name}#${plannedSection.section_id}`);
      }
      const targetSlides = plannedSection.target_source_slides.map(Number);
      if (targetSlides.length === 0) throw new Error(`Leere Zielzuordnung: ${plannedSection.section_id}`);
      const sortedTargets = [...targetSlides].sort((left, right) => left - right);
      for (const slideNumber of sortedTargets) {
        if (!activeSlideOrder.has(slideNumber)) {
          throw new Error(`Quell-SVG fuer Folie ${slideNumber} fehlt.`);
        }
      }
      for (let index = 1; index < sortedTargets.length; index += 1) {
        const previousOrder = activeSlideOrder.get(sortedTargets[index - 1]);
        const currentOrder = activeSlideOrder.get(sortedTargets[index]);
        if (currentOrder !== previousOrder + 1) {
          throw new Error(
            `Geteiltes Textsegment ist in der aktiven SVG-Reihenfolge nicht zusammenhaengend: ${plannedSection.section_id}`,
          );
        }
      }

      const sectionRef = `${plannedDocument.source_docx_name}#${plannedSection.section_id}`;
      mappedSections.add(sectionRef);
      const sharedTextGroup = targetSlides.length > 1
        ? `shared_text_${String(sortedTargets[0]).padStart(3, "0")}_${String(sortedTargets.at(-1)).padStart(3, "0")}`
        : null;

      for (const slideNumber of targetSlides) {
        if (mappedSlides.has(slideNumber)) throw new Error(`Folie ${slideNumber} ist mehrfach gemappt.`);
        const svg = svgBySlide.get(slideNumber);
        if (!svg) throw new Error(`Quell-SVG fuer Folie ${slideNumber} fehlt.`);
        mappedSlides.add(slideNumber);
        const notes = [
          "Zuordnung durch Titel-, Inhalts- und lueckenlosen Sequenzabgleich.",
          ...(plannedSection.notes || []),
        ];
        if (sharedTextGroup) {
          notes.push(`Gemeinsamer Sprechertext fuer SVG-Zustaende ${sortedTargets.join(", ")}.`);
        }
        const supplementaryInformation = [];
        if (document.metadata?.Abschnitt) supplementaryInformation.push(`Abschnitt: ${document.metadata.Abschnitt}`);
        if (document.metadata?.["Abschnitt Nummer"]) {
          supplementaryInformation.push(`Abschnitt Nummer: ${document.metadata["Abschnitt Nummer"]}`);
        }

        mappings.push({
          source_slide_key: sourceSlideKey(slideNumber),
          source_slide_number: slideNumber,
          source_svg: relativePath(svg.absolutePath),
          source_svg_sha256: sha256File(svg.absolutePath),
          source_docx: document.source_docx,
          extracted_markdown: document.extracted_markdown,
          source_text_section_id: section.section_id,
          source_text_local_slide_numbers: section.source_local_slide_numbers,
          source_text_title: section.title,
          shared_text_group: sharedTextGroup,
          mapping_method: alignmentPlan.mapping_method,
          mapping_confidence: "high",
          mapping_status: "mapped",
          spoken_text: section.spoken_text,
          spoken_text_sha256: section.spoken_text_sha256,
          supplementary_information: supplementaryInformation,
          notes,
          qa: emptyQa(),
        });
      }
    }
  }

  mappings.sort((left, right) => left.source_slide_number - right.source_slide_number);
  const unmappedSvgs = svgFiles
    .filter((svg) => !mappedSlides.has(svg.slideNumber))
    .map((svg) => relativePath(svg.absolutePath));
  const unmappedDocuments = extractionIndex.documents
    .filter((document) => {
      const documentName = fileNameFromRepoPath(document.source_docx);
      return !usedDocuments.has(documentName) && !deferredDocumentNames.has(documentName);
    })
    .map((document) => document.source_docx);
  const deferredDocuments = extractionIndex.documents
    .filter((document) => deferredDocumentNames.has(fileNameFromRepoPath(document.source_docx)))
    .map((document) => document.source_docx);
  const unmappedTextSections = [];
  const deferredTextSections = [];
  for (const document of extractionIndex.documents) {
    const documentName = fileNameFromRepoPath(document.source_docx);
    for (const section of document.sections) {
      const sectionRef = `${documentName}#${section.section_id}`;
      if (!mappedSections.has(sectionRef)) {
        const target = deferredDocumentNames.has(documentName) || deferredSectionRefs.has(sectionRef)
          ? deferredTextSections
          : unmappedTextSections;
        target.push(`${document.source_docx}#${section.section_id}`);
      }
    }
  }

  const issues = [...(alignmentPlan.qa?.issues || [])];
  if (unmappedSvgs.length) issues.push(`${unmappedSvgs.length} Quell-SVGs sind nicht gemappt.`);
  if (unmappedDocuments.length) issues.push(`${unmappedDocuments.length} Word-Dokumente sind nicht gemappt.`);
  if (unmappedTextSections.length) issues.push(`${unmappedTextSections.length} Sprechertextabschnitte sind nicht gemappt.`);
  const warnings = [...(alignmentPlan.qa?.warnings || [])];
  if (deferredDocuments.length) {
    warnings.push(`${deferredDocuments.length} Word-Dokumente sind fuer diesen Testlauf ausdruecklich zurueckgestellt.`);
  }
  if (deferredTextSections.length) {
    warnings.push(`${deferredTextSections.length} Sprechertextabschnitte werden nach spaeterem Input erneut eingelesen.`);
  }

  const documents = extractionIndex.documents.map((document) => ({
    source_docx: document.source_docx,
    source_sha256: document.source_sha256,
    extracted_markdown: document.extracted_markdown,
    extracted_sha256: document.extracted_sha256,
    extraction_status: document.extraction_status,
    paragraph_count: document.paragraph_count,
    table_count: document.table_count,
    notes: document.notes || [],
  }));

  const textRoot = extractionIndex.documents.length
    ? path.posix.dirname(extractionIndex.documents[0].source_docx) + "/"
    : relativePath(path.join(path.dirname(svgDirectory), "Text")) + "/";
  const result = {
    schema_version: "basisReSvgTextMap/v1",
    module_id: moduleId,
    module_root: relativePath(path.dirname(svgDirectory)) + "/",
    svg_root: relativePath(svgDirectory) + "/",
    text_root: textRoot,
    mapping_status: issues.length ? "blocked" : "mapped",
    created_at: null,
    documents,
    mappings,
    unmapped_svgs: unmappedSvgs,
    unmapped_documents: unmappedDocuments,
    unmapped_text_sections: unmappedTextSections,
    deferred_documents: deferredDocuments,
    deferred_text_sections: deferredTextSections,
    qa: {
      issues: unique(issues),
      warnings: unique(warnings),
      open_questions: unique(alignmentPlan.qa?.open_questions || []),
    },
  };

  fs.mkdirSync(path.dirname(outputPath), { recursive: true });
  fs.writeFileSync(outputPath, `${JSON.stringify(result, null, 2)}\n`, "utf8");
  console.log(`Mapped SVGs: ${mappings.length}/${svgFiles.length}`);
  console.log(`Unmapped documents: ${unmappedDocuments.length}`);
  console.log(`Unmapped text sections: ${unmappedTextSections.length}`);
  console.log(`Deferred documents: ${deferredDocuments.length}`);
  console.log(`Deferred text sections: ${deferredTextSections.length}`);
  console.log(`Output: ${outputPath}`);
}

try {
  main();
} catch (error) {
  console.error(error.message);
  process.exitCode = 1;
}
