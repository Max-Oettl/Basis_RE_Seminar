"use strict";

const assert = require("node:assert/strict");
const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");
const test = require("node:test");
const zlib = require("node:zlib");
const { validatePictogramBrief } = require("./validate-pictogram-asset");

function crc32(buffer) {
  let crc = 0xffffffff;
  for (const byte of buffer) {
    crc ^= byte;
    for (let bit = 0; bit < 8; bit += 1) crc = (crc >>> 1) ^ (crc & 1 ? 0xedb88320 : 0);
  }
  return (crc ^ 0xffffffff) >>> 0;
}

function pngChunk(type, data) {
  const name = Buffer.from(type, "ascii");
  const length = Buffer.alloc(4);
  length.writeUInt32BE(data.length);
  const checksum = Buffer.alloc(4);
  checksum.writeUInt32BE(crc32(Buffer.concat([name, data])));
  return Buffer.concat([length, name, data, checksum]);
}

function writeRgbaPng(filePath, width, height, pixel) {
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr[8] = 8;
  ihdr[9] = 6;
  const raw = Buffer.alloc(height * (1 + width * 4));
  let offset = 0;
  for (let y = 0; y < height; y += 1) {
    raw[offset++] = 0;
    for (let x = 0; x < width; x += 1) {
      const [r, g, b, a] = pixel(x, y);
      raw[offset++] = r;
      raw[offset++] = g;
      raw[offset++] = b;
      raw[offset++] = a;
    }
  }
  const signature = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);
  fs.writeFileSync(filePath, Buffer.concat([
    signature,
    pngChunk("IHDR", ihdr),
    pngChunk("IDAT", zlib.deflateSync(raw)),
    pngChunk("IEND", Buffer.alloc(0)),
  ]));
}

function acceptedBrief(file) {
  return {
    schemaVersion: "reltestEducationPictogramAsset/v1",
    assetId: "test_motor",
    file,
    assetType: "generated_png",
    status: "accepted",
    styleProfile: "reltest-education-minimal-v1",
    source: { evidenceType: "speaker_text", reference: "Test", license: "project_internal" },
    semantics: {
      concept: "Elektromotor",
      learningFunction: "concept-anchor",
      mustShowFeatures: ["Gehaeuse", "Welle"],
      mustNotImply: ["Generator"],
      confusableWith: ["Generator"],
      firstUseLabel: "Elektromotor",
      reuseKey: "electric_motor",
    },
    visualStyle: {
      flat2d: true,
      perspective: "front",
      dominantSilhouette: true,
      semanticLayers: 1,
      brandColors: ["#142452"],
      gradients: false,
      shadows: false,
      threeDimensional: false,
      isometric: false,
      photorealistic: false,
      glow: false,
      texture: false,
      embeddedText: false,
      logo: false,
      watermark: false,
    },
    raster: {
      widthPx: 1024,
      heightPx: 1024,
      transparentBackground: true,
      safeMarginRatio: 0.08,
    },
    learningUse: {
      targetPlacementPx: 96,
      requiresTextLabelOnFirstUse: true,
      colorIndependentMeaning: true,
      smallScaleTests: { at32px: "not_required", at48px: "passed", scene960x540: "passed" },
    },
    accessibility: {
      redundantWithVisibleLabel: true,
      accessibleName: "",
      contrastPairs: [{ foreground: "#142452", background: "#FFFFFF", minimumRatio: 3 }],
    },
    review: {
      semantic: "passed",
      style: "passed",
      eLearning: "passed",
      accessibilityTechnical: "passed",
      notes: [],
    },
  };
}

function withTempRoot(fn) {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), "pictogram-check-"));
  try {
    return fn(root);
  } finally {
    fs.rmSync(root, { recursive: true, force: true });
  }
}

test("accepts a minimal transparent Education pictogram", () => withTempRoot((root) => {
  const pngPath = path.join(root, "valid.png");
  writeRgbaPng(pngPath, 1024, 1024, (x, y) => {
    const visible = x >= 112 && x < 912 && y >= 112 && y < 912;
    return visible ? [20, 36, 82, 255] : [0, 0, 0, 0];
  });
  const brief = acceptedBrief("valid.png");
  const briefPath = path.join(root, "valid.asset.json");
  fs.writeFileSync(briefPath, JSON.stringify(brief));
  const result = validatePictogramBrief(briefPath, { release: true, repoRoot: root });
  assert.deepEqual(result.errors, []);
  assert.ok(result.png.safeMarginPassed);
}));

test("rejects an opaque chromakey-style background", () => withTempRoot((root) => {
  const pngPath = path.join(root, "opaque.png");
  writeRgbaPng(pngPath, 1024, 1024, () => [0, 255, 0, 255]);
  const brief = acceptedBrief("opaque.png");
  const briefPath = path.join(root, "opaque.asset.json");
  fs.writeFileSync(briefPath, JSON.stringify(brief));
  const result = validatePictogramBrief(briefPath, { release: true, repoRoot: root });
  assert.ok(result.errors.some((message) => message.includes("transparenten Hintergrund")));
  assert.ok(result.errors.some((message) => message.includes("Sicherheitsrand")));
}));

test("rejects forbidden 3D and gradient style flags", () => withTempRoot((root) => {
  const pngPath = path.join(root, "style.png");
  writeRgbaPng(pngPath, 1024, 1024, (x, y) => {
    const visible = x >= 112 && x < 912 && y >= 112 && y < 912;
    return visible ? [3, 19, 52, 255] : [0, 0, 0, 0];
  });
  const brief = acceptedBrief("style.png");
  brief.visualStyle.gradients = true;
  brief.visualStyle.threeDimensional = true;
  const briefPath = path.join(root, "style.asset.json");
  fs.writeFileSync(briefPath, JSON.stringify(brief));
  const result = validatePictogramBrief(briefPath, { release: true, repoRoot: root });
  assert.ok(result.errors.some((message) => message.includes("visualStyle.gradients")));
  assert.ok(result.errors.some((message) => message.includes("visualStyle.threeDimensional")));
}));

test("rejects noncanonical semantics, colors, and undersized object placement", () => withTempRoot((root) => {
  const pngPath = path.join(root, "semantics.png");
  writeRgbaPng(pngPath, 1024, 1024, (x, y) => {
    const visible = x >= 112 && x < 912 && y >= 112 && y < 912;
    return visible ? [3, 19, 52, 255] : [0, 0, 0, 0];
  });
  const brief = acceptedBrief("semantics.png");
  brief.semantics.learningFunction = "concept_anchor";
  brief.visualStyle.brandColors = ["#123456"];
  brief.learningUse.targetPlacementPx = 80;
  const briefPath = path.join(root, "semantics.asset.json");
  fs.writeFileSync(briefPath, JSON.stringify(brief));
  const result = validatePictogramBrief(briefPath, { release: true, repoRoot: root });
  assert.ok(result.errors.some((message) => message.includes("kanonische semantische Rolle")));
  assert.ok(result.errors.some((message) => message.includes("Education-Piktogrammpalette")));
  assert.ok(result.errors.some((message) => message.includes("mindestens 96")));
}));
