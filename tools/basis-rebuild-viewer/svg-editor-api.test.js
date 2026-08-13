const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");

const domain = require("./svg-editor-server-domain");
const { server, writeTextFilesAtomic } = require("./server");

test("atomare Texttransaktion ersetzt mehrere Temp-Dateien ohne Artefakte", () => {
  const directory = fs.mkdtempSync(path.join(os.tmpdir(), "basis-svg-editor-files-"));
  const first = path.join(directory, "slide.svg");
  const second = path.join(directory, "formula.svg");
  try {
    fs.writeFileSync(first, "before-main", "utf8");
    fs.writeFileSync(second, "before-formula", "utf8");
    writeTextFilesAtomic([
      { path: first, source: "after-main" },
      { path: second, source: "after-formula" },
    ]);
    assert.equal(fs.readFileSync(first, "utf8"), "after-main");
    assert.equal(fs.readFileSync(second, "utf8"), "after-formula");
    assert.deepEqual(fs.readdirSync(directory).sort(), ["formula.svg", "slide.svg"]);
  } finally {
    fs.rmSync(directory, { recursive: true, force: true });
  }
});

test("SVG-Editor-API liefert Rohquelle und blockiert unsichere oder veraltete Writes", async () => {
  await new Promise((resolve, reject) => {
    server.once("error", reject);
    server.listen(0, "127.0.0.1", resolve);
  });
  const address = server.address();
  const baseUrl = `http://127.0.0.1:${address.port}`;
  try {
    const slidesResponse = await fetch(`${baseUrl}/api/slides`);
    assert.equal(slidesResponse.status, 200);
    const slides = (await slidesResponse.json()).slides;
    const candidate = slides.find((slide) => slide.svgProposal?.path && slide.review?.status !== "final");
    assert.ok(candidate, "Es wird mindestens ein nicht finales Proposal fuer den Read-only API-Test benoetigt.");

    const getResponse = await fetch(
      `${baseUrl}/api/svg-editor?id=${encodeURIComponent(candidate.id)}`,
    );
    assert.equal(getResponse.status, 200);
    const payload = await getResponse.json();
    const editor = payload.svgEditor;
    assert.equal(editor.slide.id, candidate.id);
    assert.equal(editor.svg.source, fs.readFileSync(path.resolve(__dirname, "..", "..", candidate.svgProposal.path), "utf8"));
    assert.equal(editor.svg.sha256, domain.sha256(editor.svg.source));
    assert.equal(
      editor.svg.documentSha256,
      domain.documentSha256(editor.svg.source, editor.formulaAssets),
    );
    assert.match(editor.svg.documentSha256, /^[a-f0-9]{64}$/);

    const staleResponse = await fetch(`${baseUrl}/api/svg-editor/save`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id: candidate.id,
        source: editor.svg.source,
        expectedSha256: "0".repeat(64),
        formulaAssets: [],
      }),
    });
    assert.equal(staleResponse.status, 409);

    const unsafeResponse = await fetch(`${baseUrl}/api/svg-editor/save`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id: candidate.id,
        source: `<svg xmlns="http://www.w3.org/2000/svg"><script>alert(1)</script></svg>`,
        expectedSha256: editor.svg.documentSha256,
        formulaAssets: [],
      }),
    });
    assert.equal(unsafeResponse.status, 422);
    const unsafePayload = await unsafeResponse.json();
    assert.match(unsafePayload.error, /nicht sicher/i);

    const traversalResponse = await fetch(`${baseUrl}/api/svg-editor/restore`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id: candidate.id,
        versionId: "../escape",
        expectedSha256: editor.svg.documentSha256,
      }),
    });
    assert.equal(traversalResponse.status, 400);

    const formulaResponse = await fetch(`${baseUrl}/api/svg-editor/formula-preview`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        formula: "Rₛ(t) = ∏ᵢ₌₁ⁿ Rᵢ(t)",
        fontSize: 36,
        color: "#031334",
        width: 620,
        height: 82,
      }),
    });
    assert.equal(formulaResponse.status, 200);
    const formulaPayload = await formulaResponse.json();
    assert.equal(formulaPayload.formula.renderer, "mathjax-svg-paths");
    assert.match(formulaPayload.formula.source, /<path\b/);
    assert.doesNotMatch(formulaPayload.formula.source, /<text\b/);
  } finally {
    await new Promise((resolve) => server.close(resolve));
  }
});

test("SVG-Editor-API akzeptiert keine unbekannten Folien-IDs", async () => {
  await new Promise((resolve, reject) => {
    server.once("error", reject);
    server.listen(0, "127.0.0.1", resolve);
  });
  const address = server.address();
  try {
    const response = await fetch(
      `http://127.0.0.1:${address.port}/api/svg-editor?id=${encodeURIComponent("NOT_A_SLIDE::999")}`,
    );
    assert.equal(response.status, 404);
  } finally {
    await new Promise((resolve) => server.close(resolve));
  }
});
