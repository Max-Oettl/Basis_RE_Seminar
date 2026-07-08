const http = require("http");
const fs = require("fs");
const path = require("path");
const { spawn } = require("child_process");

const repoRoot = path.resolve(__dirname, "..", "..");
const indexPath = path.join(__dirname, "index.html");
const sourceRoot = path.join(repoRoot, "source-materials", "basis-seminar");
const pngRoot = path.join(sourceRoot, "png");
const analysisRoot = path.join(repoRoot, "analysis");
const slideAnalysisRoot = path.join(analysisRoot, "slides");
const moduleAnalysisRoot = path.join(analysisRoot, "modules");
const reviewRoot = path.join(analysisRoot, "viewer-notes");
const proposalRoots = [
  path.join(repoRoot, "rebuild-proposals", "svg"),
  path.join(analysisRoot, "svg-proposals"),
  path.join(repoRoot, "svg-proposals"),
];

const portArgument = process.argv.slice(2).find((argument) => /^\d+$/.test(argument));
const requestedPort = Number(process.env.BASIS_REBUILD_VIEWER_PORT || portArgument || 4174);

const imageExtensions = new Set([".png", ".jpg", ".jpeg", ".webp"]);
const svgExtensions = new Set([".svg"]);

function naturalCompare(left, right) {
  return String(left).localeCompare(String(right), "de", {
    numeric: true,
    sensitivity: "base",
  });
}

function isInsideRepo(absolutePath) {
  const relativePath = path.relative(repoRoot, absolutePath);
  return !relativePath.startsWith("..") && !path.isAbsolute(relativePath);
}

function toWebPath(filePath) {
  return path.relative(repoRoot, filePath).split(path.sep).join("/");
}

function fileUrl(filePath) {
  return `/files/${toWebPath(filePath).split("/").map(encodeURIComponent).join("/")}`;
}

function animationManifestPathFor(svgPath) {
  return path.join(path.dirname(svgPath), "scene.animation.v1.json");
}

function animationInfoFor(svgPath) {
  const manifestPath = animationManifestPathFor(svgPath);
  if (!fs.existsSync(manifestPath)) {
    return {
      available: false,
      url: "",
      stepCount: 0,
      defaultPauseMs: null,
    };
  }

  try {
    const manifest = readJsonFile(manifestPath);
    return {
      available: Array.isArray(manifest.steps) && manifest.steps.length > 0,
      url: fileUrl(manifestPath),
      stepCount: Array.isArray(manifest.steps) ? manifest.steps.length : 0,
      defaultPauseMs: Number(manifest.defaults?.pauseMs) || null,
    };
  } catch {
    return {
      available: false,
      url: "",
      stepCount: 0,
      defaultPauseMs: null,
      readError: "Animationsmanifest ist kein gueltiges JSON.",
    };
  }
}

function readJsonFile(filePath) {
  return JSON.parse(fs.readFileSync(filePath, "utf8").replace(/^\uFEFF/, ""));
}

function writeJsonFile(filePath, value) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, `${JSON.stringify(value, null, 2)}\n`, "utf8");
}

function collectFiles(directory, extensions, results = []) {
  if (!fs.existsSync(directory)) return results;

  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    if (entry.name === ".git" || entry.name === "node_modules") continue;
    const absolutePath = path.join(directory, entry.name);
    if (entry.isDirectory()) {
      collectFiles(absolutePath, extensions, results);
    } else if (entry.isFile() && extensions.has(path.extname(entry.name).toLowerCase())) {
      results.push(absolutePath);
    }
  }

  return results;
}

function cleanModuleId(value) {
  return String(value || "")
    .trim()
    .replace(/\s+/g, "_")
    .replace(/[^\w.-]+/g, "_") || "unassigned";
}

function padSlideNumber(value) {
  return String(value).padStart(3, "0");
}

function extractModuleFromName(fileName) {
  const value = String(fileName);
  const reMatch = value.match(/(?:^|[^A-Za-z0-9])(RE\d+)(?=$|[^A-Za-z0-9])/i) ||
    value.match(/(RE\d+)/i);
  if (!reMatch) return "";

  const testMatch = value.match(/(?:^|[^A-Za-z0-9])Test[_\-\s]*(\d+)(?=$|[^A-Za-z0-9])/i) ||
    value.match(/Test[_\-\s]*(\d+)/i);
  if (testMatch) {
    return `${reMatch[1].toUpperCase()}_TEST_${testMatch[1]}`;
  }

  return reMatch[1].toUpperCase();
}

function extractSlideNumber(fileName) {
  const name = String(fileName);
  const labeled =
    name.match(/(?:slide|folie|seite|page)[_\-\s]*(\d+)/i) ||
    name.match(/\bS[_\-\s]*(\d+)\b/i);
  if (labeled) return Number(labeled[1]);

  const numericParts = [...name.matchAll(/(\d+)/g)].map((match) => Number(match[1]));
  if (!numericParts.length) return null;
  return numericParts[numericParts.length - 1];
}

function inferModuleAndSlide(filePath, root, fallbackIndex = 0) {
  const relativeParts = path.relative(root, filePath).split(path.sep);
  const fileName = path.basename(filePath);
  const folderModule = relativeParts.length > 1 ? extractModuleFromName(relativeParts[0]) || relativeParts[0] : "";
  const nameModule = extractModuleFromName(fileName);
  const moduleId = cleanModuleId(folderModule || nameModule || "unassigned");
  const slideNumber = extractSlideNumber(fileName) || fallbackIndex + 1;
  return { moduleId, slideNumber };
}

function slideKey(moduleId, slideNumber) {
  return `${cleanModuleId(moduleId)}::${Number(slideNumber)}`;
}

function reviewFilePath(moduleId, slideNumber) {
  const safeModule = cleanModuleId(moduleId);
  return path.join(reviewRoot, `${safeModule}_slide_${padSlideNumber(slideNumber)}.json`);
}

function defaultReview(moduleId, slideNumber) {
  return {
    schema_version: "basisRebuildViewerNote/v1",
    module_id: cleanModuleId(moduleId),
    source_slide_number: Number(slideNumber),
    status: "open",
    notes: "",
    updated_at: null,
  };
}

function readReview(moduleId, slideNumber) {
  const fallback = defaultReview(moduleId, slideNumber);
  const filePath = reviewFilePath(moduleId, slideNumber);
  if (!fs.existsSync(filePath)) return fallback;

  try {
    const parsed = readJsonFile(filePath);
    return {
      ...fallback,
      ...parsed,
      module_id: fallback.module_id,
      source_slide_number: fallback.source_slide_number,
      status: ["open", "needs_revision", "accepted", "final"].includes(parsed.status)
        ? parsed.status
        : "open",
      notes: typeof parsed.notes === "string" ? parsed.notes : "",
    };
  } catch {
    return {
      ...fallback,
      read_error: "Viewer-Notiz ist kein gueltiges JSON.",
    };
  }
}

function saveReview(id, status, notes) {
  const match = String(id || "").match(/^(.+)::(\d+)$/);
  if (!match) return null;
  const moduleId = cleanModuleId(match[1]);
  const slideNumber = Number(match[2]);
  const review = {
    ...defaultReview(moduleId, slideNumber),
    status: ["open", "needs_revision", "accepted", "final"].includes(status) ? status : "open",
    notes: String(notes || "").replace(/\r\n/g, "\n").trim(),
    updated_at: new Date().toISOString(),
  };
  writeJsonFile(reviewFilePath(moduleId, slideNumber), review);
  return review;
}

function collectOldSlides() {
  const files = collectFiles(pngRoot, imageExtensions).sort(naturalCompare);
  const groups = new Map();

  for (const filePath of files) {
    const relativeParts = path.relative(pngRoot, filePath).split(path.sep);
    const rawModule =
      relativeParts.length > 1
        ? extractModuleFromName(relativeParts[0]) || relativeParts[0]
        : extractModuleFromName(path.basename(filePath)) || "unassigned";
    const moduleId = cleanModuleId(rawModule);
    if (!groups.has(moduleId)) groups.set(moduleId, []);
    groups.get(moduleId).push(filePath);
  }

  const results = [];
  for (const [moduleId, moduleFiles] of groups.entries()) {
    moduleFiles.sort(naturalCompare);
    moduleFiles.forEach((filePath, index) => {
      const inferred = inferModuleAndSlide(filePath, pngRoot, index);
      results.push({
        moduleId,
        slideNumber: inferred.slideNumber,
        path: toWebPath(filePath),
        url: fileUrl(filePath),
        fileName: path.basename(filePath),
      });
    });
  }

  return results;
}

function collectSvgProposals() {
  const results = [];
  for (const root of proposalRoots) {
    const files = collectFiles(root, svgExtensions).sort(naturalCompare);
    files.forEach((filePath, index) => {
      const inferred = inferModuleAndSlide(filePath, root, index);
      results.push({
        moduleId: inferred.moduleId,
        slideNumber: inferred.slideNumber,
        path: toWebPath(filePath),
        url: fileUrl(filePath),
        fileName: path.basename(filePath),
        animation: animationInfoFor(filePath),
      });
    });
  }
  return results;
}

function normalizeStringArray(value) {
  return Array.isArray(value)
    ? value.filter((item) => typeof item === "string" && item.trim()).map((item) => item.trim())
    : [];
}

function analysisSummary(slide) {
  return {
    schemaVersion: slide?.schema_version || "",
    seminarId: slide?.seminar_id || "",
    moduleId: slide?.module_id || "",
    slideId: slide?.slide_id || "",
    sourceSlideNumber: Number(slide?.source_slide_number) || null,
    status: slide?.status || "",
    sourceFiles: slide?.source_files || {},
    sourceSlideGroup: slide?.source_slide_group || null,
    narration: slide?.narration || null,
    slideSummary: slide?.slide_summary || null,
    visibleText: Array.isArray(slide?.visible_text) ? slide.visible_text : [],
    visualElements: Array.isArray(slide?.visual_elements) ? slide.visual_elements : [],
    layoutRebuild: slide?.layout_rebuild || null,
    animationPlan: Array.isArray(slide?.animation_plan) ? slide.animation_plan : [],
    generatedAssets: Array.isArray(slide?.generated_assets) ? slide.generated_assets : [],
    qa: slide?.qa || null,
  };
}

function collectAnalysisSlides() {
  const records = [];
  const files = [
    ...collectFiles(slideAnalysisRoot, new Set([".json"])),
    ...collectFiles(moduleAnalysisRoot, new Set([".json"])),
  ].sort(naturalCompare);

  for (const filePath of files) {
    try {
      const parsed = readJsonFile(filePath);
      const slides = Array.isArray(parsed)
        ? parsed
        : Array.isArray(parsed?.slides)
          ? parsed.slides
          : parsed?.slide_id
            ? [parsed]
            : [];

      for (const slide of slides) {
        const moduleId = cleanModuleId(slide.module_id || extractModuleFromName(slide.slide_id));
        const slideNumber = Number(slide.source_slide_number) || extractSlideNumber(slide.slide_id);
        if (!moduleId || !slideNumber) continue;
        records.push({
          moduleId,
          slideNumber,
          path: toWebPath(filePath),
          url: fileUrl(filePath),
          summary: analysisSummary(slide),
        });
      }
    } catch (error) {
      records.push({
        moduleId: "analysis_errors",
        slideNumber: records.length + 1,
        path: toWebPath(filePath),
        url: fileUrl(filePath),
        readError: error.message,
      });
    }
  }

  return records;
}

function mergeRecord(map, moduleId, slideNumber) {
  const key = slideKey(moduleId, slideNumber);
  if (!map.has(key)) {
    map.set(key, {
      id: key,
      moduleId: cleanModuleId(moduleId),
      slideNumber: Number(slideNumber),
      slideId: `${cleanModuleId(moduleId)}_${padSlideNumber(slideNumber)}`,
      title: "",
      oldSlide: null,
      svgProposal: null,
      analysis: null,
      review: null,
    });
  }
  return map.get(key);
}

function applyAnimationGroupSvgAliases(map) {
  const records = [...map.values()];
  const groups = new Map();

  for (const record of records) {
    const group = record.analysis?.summary?.sourceSlideGroup;
    const groupId = typeof group?.group_id === "string" ? group.group_id.trim() : "";
    const groupSlides = Array.isArray(group?.source_slide_numbers)
      ? group.source_slide_numbers.map(Number).filter(Boolean)
      : [];

    if (!groupId || !groupSlides.includes(record.slideNumber)) continue;

    const key = `${record.moduleId}::${groupId}`;
    if (!groups.has(key)) {
      groups.set(key, {
        moduleId: record.moduleId,
        groupId,
        slideNumbers: new Set(),
      });
    }

    const entry = groups.get(key);
    groupSlides.forEach((slideNumber) => entry.slideNumbers.add(slideNumber));
  }

  for (const group of groups.values()) {
    const groupRecords = [...group.slideNumbers]
      .map((slideNumber) => map.get(slideKey(group.moduleId, slideNumber)))
      .filter(Boolean)
      .sort((left, right) => left.slideNumber - right.slideNumber);

    const sourceRecord = groupRecords.find((record) => record.svgProposal);
    if (!sourceRecord?.svgProposal) continue;

    for (const record of groupRecords) {
      if (record.svgProposal) continue;
      record.svgProposal = {
        ...sourceRecord.svgProposal,
        slideNumber: record.slideNumber,
        aliasForSlideNumber: sourceRecord.slideNumber,
        aliasGroupId: group.groupId,
      };
    }
  }
}

function listSlides() {
  const map = new Map();

  for (const oldSlide of collectOldSlides()) {
    const record = mergeRecord(map, oldSlide.moduleId, oldSlide.slideNumber);
    record.oldSlide = oldSlide;
  }

  for (const proposal of collectSvgProposals()) {
    const record = mergeRecord(map, proposal.moduleId, proposal.slideNumber);
    record.svgProposal = proposal;
  }

  for (const analysis of collectAnalysisSlides()) {
    const record = mergeRecord(map, analysis.moduleId, analysis.slideNumber);
    record.analysis = analysis;
    if (analysis.summary) {
      record.slideId = analysis.summary.slideId || record.slideId;
      record.title = analysis.summary.slideSummary?.title || record.title;
    }
  }

  applyAnimationGroupSvgAliases(map);

  const slides = [...map.values()]
    .map((record) => {
      const review = readReview(record.moduleId, record.slideNumber);
      const qa = record.analysis?.summary?.qa || null;
      const completeness = qa?.completeness || "missing";
      return {
        ...record,
        title: record.title || record.oldSlide?.fileName || record.svgProposal?.fileName || record.slideId,
        review,
        status: {
          hasOldSlide: Boolean(record.oldSlide),
          hasSvgProposal: Boolean(record.svgProposal),
          hasAnimation: Boolean(record.svgProposal?.animation?.available),
          hasAnalysis: Boolean(record.analysis?.summary),
          analysisError: record.analysis?.readError || "",
          qaCompleteness: completeness,
          reviewStatus: review.status,
        },
      };
    })
    .sort((left, right) =>
      naturalCompare(left.moduleId, right.moduleId) ||
      left.slideNumber - right.slideNumber ||
      naturalCompare(left.slideId, right.slideId)
    );

  const modules = [...new Set(slides.map((slide) => slide.moduleId))].sort(naturalCompare);
  return { repoRoot, modules, slides };
}

function contentTypeFor(filePath) {
  const extension = path.extname(filePath).toLowerCase();
  return {
    ".html": "text/html; charset=utf-8",
    ".js": "text/javascript; charset=utf-8",
    ".css": "text/css; charset=utf-8",
    ".json": "application/json; charset=utf-8",
    ".svg": "image/svg+xml; charset=utf-8",
    ".png": "image/png",
    ".jpg": "image/jpeg",
    ".jpeg": "image/jpeg",
    ".webp": "image/webp",
  }[extension] || "application/octet-stream";
}

function send(response, statusCode, body, contentType) {
  response.writeHead(statusCode, {
    "Content-Type": contentType,
    "Cache-Control": "no-store",
  });
  response.end(body);
}

function sendJson(response, statusCode, value) {
  send(response, statusCode, JSON.stringify(value), "application/json; charset=utf-8");
}

function inlineSvgImages(svgPath) {
  const imageTypes = {
    ".png": "image/png",
    ".jpg": "image/jpeg",
    ".jpeg": "image/jpeg",
    ".webp": "image/webp",
    ".gif": "image/gif",
  };

  const source = fs.readFileSync(svgPath, "utf8");
  return source.replace(
    /(<image\b[^>]*?\s(?:href|xlink:href)=["'])([^"']+)(["'])/gi,
    (match, prefix, reference, suffix) => {
      if (
        reference.startsWith("data:") ||
        reference.startsWith("http://") ||
        reference.startsWith("https://") ||
        reference.startsWith("#")
      ) {
        return match;
      }

      const cleanReference = reference.split(/[?#]/, 1)[0];
      let decodedReference;
      try {
        decodedReference = decodeURIComponent(cleanReference);
      } catch {
        return match;
      }

      const assetPath = path.resolve(path.dirname(svgPath), decodedReference);
      const mimeType = imageTypes[path.extname(assetPath).toLowerCase()];
      if (
        !mimeType ||
        !isInsideRepo(assetPath) ||
        !fs.existsSync(assetPath) ||
        !fs.statSync(assetPath).isFile()
      ) {
        return match;
      }

      const dataUrl = `data:${mimeType};base64,${fs.readFileSync(assetPath).toString("base64")}`;
      return `${prefix}${dataUrl}${suffix}`;
    },
  );
}

function serveFile(response, relativePath) {
  let decodedPath;
  try {
    decodedPath = decodeURIComponent(relativePath);
  } catch {
    send(response, 400, "Ungueltiger Pfad", "text/plain; charset=utf-8");
    return;
  }

  const absolutePath = path.resolve(repoRoot, decodedPath);
  if (!isInsideRepo(absolutePath) || !fs.existsSync(absolutePath) || !fs.statSync(absolutePath).isFile()) {
    send(response, 404, "Datei nicht gefunden", "text/plain; charset=utf-8");
    return;
  }

  if (path.extname(absolutePath).toLowerCase() === ".svg") {
    send(response, 200, inlineSvgImages(absolutePath), "image/svg+xml; charset=utf-8");
    return;
  }

  response.writeHead(200, {
    "Content-Type": contentTypeFor(absolutePath),
    "Cache-Control": "no-store",
  });
  fs.createReadStream(absolutePath).pipe(response);
}

function readJsonBody(request) {
  return new Promise((resolve, reject) => {
    let body = "";
    request.setEncoding("utf8");
    request.on("data", (chunk) => {
      body += chunk;
      if (body.length > 1024 * 1024) {
        reject(new Error("Anfrage ist zu gross."));
        request.destroy();
      }
    });
    request.on("end", () => {
      try {
        resolve(JSON.parse(body || "{}"));
      } catch {
        reject(new Error("Ungueltiges JSON."));
      }
    });
    request.on("error", reject);
  });
}

const server = http.createServer((request, response) => {
  const requestUrl = new URL(request.url, "http://localhost");

  if (request.method === "GET" && requestUrl.pathname === "/") {
    send(response, 200, fs.readFileSync(indexPath), "text/html; charset=utf-8");
    return;
  }

  if (request.method === "GET" && requestUrl.pathname === "/api/slides") {
    sendJson(response, 200, listSlides());
    return;
  }

  if (request.method === "POST" && requestUrl.pathname === "/api/review") {
    readJsonBody(request)
      .then((body) => {
        const review = saveReview(body.id, body.status, body.notes);
        if (!review) {
          sendJson(response, 400, { error: "Ungueltige Slide-ID." });
          return;
        }
        sendJson(response, 200, { review });
      })
      .catch((error) => sendJson(response, 400, { error: error.message }));
    return;
  }

  if (request.method === "GET" && requestUrl.pathname.startsWith("/files/")) {
    serveFile(response, requestUrl.pathname.slice("/files/".length));
    return;
  }

  send(response, 404, "Nicht gefunden", "text/plain; charset=utf-8");
});

server.on("error", (error) => {
  if (error.code === "EADDRINUSE") {
    console.error(`Port ${requestedPort} ist bereits belegt.`);
  } else {
    console.error(error);
  }
  process.exitCode = 1;
});

server.listen(requestedPort, "127.0.0.1", () => {
  const url = `http://127.0.0.1:${requestedPort}`;
  console.log(`Basis-Rebuild-Viewer laeuft unter ${url}`);
  console.log("Beenden mit Strg+C.");

  if (!process.argv.includes("--no-open")) {
    const opener =
      process.platform === "win32"
        ? { command: "cmd", args: ["/c", "start", "", url] }
        : process.platform === "darwin"
          ? { command: "open", args: [url] }
          : { command: "xdg-open", args: [url] };
    const child = spawn(opener.command, opener.args, {
      detached: true,
      stdio: "ignore",
      windowsHide: true,
    });
    child.unref();
  }
});
