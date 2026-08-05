const crypto = require("crypto");
const fs = require("fs");
const path = require("path");

const repoRoot = path.resolve(__dirname, "..");
const args = process.argv.slice(2);
const mapArgument = args.find((argument) => !argument.startsWith("--"));
const warnUnmapped = args.includes("--warn-unmapped");

if (require.main === module && !mapArgument) {
  console.error("Usage: node tools/validate-svg-text-map.js <map.json> [--warn-unmapped]");
  process.exit(1);
}

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, "utf8").replace(/^\uFEFF/, ""));
}

function absoluteRepoPath(repoPath) {
  return path.resolve(repoRoot, repoPath.replaceAll("/", path.sep));
}

function sha256File(filePath) {
  return crypto.createHash("sha256").update(fs.readFileSync(filePath)).digest("hex");
}

function sha256Text(text) {
  return crypto.createHash("sha256").update(text, "utf8").digest("hex");
}

function findAdjacentDuplicateSvgSequences(mappings, minimumLength = 1) {
  const ordered = [...mappings].sort(
    (left, right) => left.source_slide_number - right.source_slide_number,
  );
  const results = [];

  for (let start = 0; start < ordered.length; start += 1) {
    let longest = null;
    const maximumLength = Math.floor((ordered.length - start) / 2);
    for (let length = minimumLength; length <= maximumLength; length += 1) {
      const first = ordered.slice(start, start + length);
      const second = ordered.slice(start + length, start + (2 * length));
      const identical = first.every(
        (entry, index) => entry.source_svg_sha256 === second[index].source_svg_sha256,
      );
      if (identical) longest = { first, second };
    }
    if (!longest) continue;
    results.push(longest);
    start += (2 * longest.first.length) - 1;
  }

  return results;
}

function validate() {
  const mapPath = path.resolve(mapArgument);
  const data = readJson(mapPath);
  const errors = [];
  const warnings = [];
  const slideNumbers = new Set();
  const slideKeys = new Set();

  if (data.schema_version !== "basisReSvgTextMap/v1") errors.push("Ungueltige schema_version.");
  if (!/^RE[1-5]$/.test(data.module_id || "")) errors.push("Ungueltige module_id.");
  if (!Array.isArray(data.documents) || data.documents.length === 0) errors.push("documents fehlt oder ist leer.");
  if (!Array.isArray(data.mappings) || data.mappings.length === 0) errors.push("mappings fehlt oder ist leer.");

  for (const document of data.documents || []) {
    for (const [field, expectedHash] of [
      ["source_docx", document.source_sha256],
      ["extracted_markdown", document.extracted_sha256],
    ]) {
      const repoPath = document[field];
      const absolutePath = absoluteRepoPath(repoPath);
      if (!fs.existsSync(absolutePath)) {
        errors.push(`Datei fehlt: ${repoPath}`);
      } else if (sha256File(absolutePath) !== expectedHash) {
        errors.push(`Hash stimmt nicht: ${repoPath}`);
      }
    }
  }

  const sharedGroups = new Map();
  for (const mapping of data.mappings || []) {
    if (slideNumbers.has(mapping.source_slide_number)) {
      errors.push(`Doppelte source_slide_number: ${mapping.source_slide_number}`);
    }
    if (slideKeys.has(mapping.source_slide_key)) {
      errors.push(`Doppelter source_slide_key: ${mapping.source_slide_key}`);
    }
    slideNumbers.add(mapping.source_slide_number);
    slideKeys.add(mapping.source_slide_key);

    const svgPath = absoluteRepoPath(mapping.source_svg);
    if (!fs.existsSync(svgPath)) {
      errors.push(`Quell-SVG fehlt: ${mapping.source_svg}`);
    } else if (sha256File(svgPath) !== mapping.source_svg_sha256) {
      errors.push(`SVG-Hash stimmt nicht: ${mapping.source_svg}`);
    }
    if (sha256Text(mapping.spoken_text || "") !== mapping.spoken_text_sha256) {
      errors.push(`Sprechertexthash stimmt nicht: ${mapping.source_slide_key}`);
    }
    if (mapping.mapping_status !== "mapped") {
      errors.push(`Mapping ist nicht freigegeben: ${mapping.source_slide_key}`);
    }

    if (mapping.shared_text_group) {
      if (!sharedGroups.has(mapping.shared_text_group)) sharedGroups.set(mapping.shared_text_group, []);
      sharedGroups.get(mapping.shared_text_group).push(mapping);
    }
  }

  const orderedMappings = [...(data.mappings || [])].sort(
    (left, right) => left.source_slide_number - right.source_slide_number,
  );
  const activeMappingOrder = new Map(
    orderedMappings.map((mapping, index) => [mapping.source_slide_number, index]),
  );

  for (const [groupId, group] of sharedGroups.entries()) {
    const ordered = group.sort((left, right) => left.source_slide_number - right.source_slide_number);
    const reference = ordered[0];
    for (let index = 0; index < ordered.length; index += 1) {
      if (
        activeMappingOrder.get(ordered[index].source_slide_number) !==
        activeMappingOrder.get(ordered[0].source_slide_number) + index
      ) {
        errors.push(`Geteilte Textgruppe ist in der aktiven SVG-Reihenfolge nicht lueckenlos: ${groupId}`);
      }
      if (
        ordered[index].source_docx !== reference.source_docx ||
        ordered[index].source_text_section_id !== reference.source_text_section_id ||
        ordered[index].spoken_text_sha256 !== reference.spoken_text_sha256
      ) {
        errors.push(`Geteilte Textgruppe ist inhaltlich inkonsistent: ${groupId}`);
      }
    }
  }

  for (const duplicate of findAdjacentDuplicateSvgSequences(data.mappings || [])) {
    const firstRange = `${duplicate.first[0].source_slide_number}-${duplicate.first.at(-1).source_slide_number}`;
    const secondRange = `${duplicate.second[0].source_slide_number}-${duplicate.second.at(-1).source_slide_number}`;
    errors.push(
      `Exakt wiederholter benachbarter SVG-Block: Folien ${firstRange} und ${secondRange}.`,
    );
  }

  const unresolved = [
    ...(data.unmapped_svgs || []).map((value) => `Ungemappte SVG: ${value}`),
    ...(data.unmapped_documents || []).map((value) => `Ungemapptes DOCX: ${value}`),
    ...(data.unmapped_text_sections || []).map((value) => `Ungemappter Textabschnitt: ${value}`),
    ...(data.qa?.issues || []).map((value) => `QA: ${value}`),
  ];
  (warnUnmapped ? warnings : errors).push(...unresolved);

  warnings.push(
    ...(data.deferred_documents || []).map((value) => `Zurueckgestelltes DOCX: ${value}`),
    ...(data.deferred_text_sections || []).map((value) => `Zurueckgestellter Textabschnitt: ${value}`),
  );

  const expectedStatus = unresolved.length ? "blocked" : "mapped";
  if (data.mapping_status !== expectedStatus) {
    errors.push(`mapping_status muss ${expectedStatus} sein.`);
  }

  console.log(`SVG mappings: ${data.mappings?.length || 0}`);
  console.log(`Documents: ${data.documents?.length || 0}`);
  console.log(`Shared text groups: ${sharedGroups.size}`);
  console.log(`Errors: ${errors.length}`);
  console.log(`Warnings: ${warnings.length}`);
  for (const error of errors) console.log(`ERROR: ${error}`);
  for (const warning of warnings) console.log(`WARNING: ${warning}`);
  return errors.length === 0;
}

if (require.main === module) {
  try {
    if (!validate()) process.exitCode = 1;
  } catch (error) {
    console.error(error.stack || error.message);
    process.exitCode = 1;
  }
}

module.exports = { findAdjacentDuplicateSvgSequences };
