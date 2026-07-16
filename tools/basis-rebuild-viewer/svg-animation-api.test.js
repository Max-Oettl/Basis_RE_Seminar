const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");

const { server, writeJsonFileAtomic } = require("./server");

test("atomarer JSON-Writer ersetzt bestehende Dateien ohne Temp-Artefakt", () => {
  const directory = fs.mkdtempSync(path.join(os.tmpdir(), "basis-svg-editor-"));
  const filePath = path.join(directory, "scene.animation.v1.json");
  try {
    writeJsonFileAtomic(filePath, { version: 1 });
    writeJsonFileAtomic(filePath, { version: 2, ok: true });
    assert.deepEqual(JSON.parse(fs.readFileSync(filePath, "utf8")), { version: 2, ok: true });
    assert.deepEqual(fs.readdirSync(directory), ["scene.animation.v1.json"]);
  } finally {
    fs.rmSync(directory, { recursive: true, force: true });
  }
});

test("Editor-API liefert den aktuellen SVG-Kontext und blockiert unbekannte Felder", async () => {
  await new Promise((resolve, reject) => {
    server.once("error", reject);
    server.listen(0, "127.0.0.1", resolve);
  });
  const address = server.address();
  const baseUrl = `http://127.0.0.1:${address.port}`;
  try {
    const response = await fetch(
      `${baseUrl}/api/svg-animation-editor?id=${encodeURIComponent("RE3_TEST_1::1")}`,
    );
    assert.equal(response.status, 200);
    const payload = await response.json();
    assert.equal(payload.svgAnimation.slide.id, "RE3_TEST_1::1");
    assert.ok(payload.svgAnimation.inventory.length > 0);
    assert.equal(payload.svgAnimation.manifest.schemaVersion, "svgAnimationManifest/v1");

    const invalidManifest = structuredClone(payload.svgAnimation.manifest);
    invalidManifest.targets[0].unknownEditorField = true;
    const invalidResponse = await fetch(`${baseUrl}/api/svg-animation-manifest`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: "RE3_TEST_1::1", manifest: invalidManifest }),
    });
    assert.equal(invalidResponse.status, 400);
    const invalidPayload = await invalidResponse.json();
    assert.match(invalidPayload.error, /nicht gültig/i);
  } finally {
    await new Promise((resolve) => server.close(resolve));
  }
});
