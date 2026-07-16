const test = require("node:test");
const assert = require("node:assert/strict");

const domain = require("./svg-animation-domain");

test("Inventar bewahrt Dokumentreihenfolge, Parent und explizite Targets", () => {
  const source = `
    <svg viewBox="0 0 100 100">
      <defs><path id="helper_path" d="M0 0L1 1" /></defs>
      <g id="card" data-anim-target="yes" data-anim-label="Karte">
        <rect id="card_panel" />
        <g><text id="card_label">Text</text></g>
      </g>
      <rect id="card_panel" />
    </svg>`;
  const result = domain.extractSvgInventory(source);

  assert.deepEqual(
    result.inventory.map((item) => item.targetId),
    ["card", "card_panel", "card_label"],
  );
  assert.equal(result.inventory[0].isExplicitTarget, true);
  assert.equal(result.inventory[0].label, "Karte");
  assert.equal(result.inventory[1].parentTargetId, "card");
  assert.equal(result.inventory[2].parentTargetId, "card");
  assert.equal(result.warnings.some((warning) => warning.code === "duplicate-id"), true);
});

test("Sync deckt Kinder eines verwalteten Parents ab und erhält Orphans", () => {
  const inventory = [
    { targetId: "card", tagName: "g", label: "Card", isExplicitTarget: true },
    { targetId: "card_panel", tagName: "rect", label: "Panel", parentTargetId: "card" },
    { targetId: "loose", tagName: "rect", label: "Loose" },
  ];
  const manifest = domain.syncManifest(
    {
      schemaVersion: domain.SCHEMA_VERSION,
      svgPath: "slide.svg",
      targets: [
        { targetId: "card", status: "animated", label: "Bestehende Karte" },
        { targetId: "gone", status: "animated" },
      ],
      steps: [{ targetId: "card", action: "show", sourceText: "Karte" }],
    },
    inventory,
    "slide.svg",
  );

  assert.deepEqual(
    manifest.targets.map((target) => target.targetId),
    ["card", "loose", "gone"],
  );
  assert.equal(manifest.targets[0].label, "Bestehende Karte");
  assert.equal(manifest.targets.find((target) => target.targetId === "loose").status, "needsReview");
  assert.equal(manifest.targets.find((target) => target.targetId === "gone").status, "orphaned");
});

test("Render-Ausschluss entfernt Steps des Targets und aller Nachfahren", () => {
  const inventory = [
    { targetId: "parent", tagName: "g" },
    { targetId: "child", tagName: "rect", parentTargetId: "parent" },
    { targetId: "other", tagName: "rect" },
  ];
  const manifest = domain.syncManifest(
    {
      schemaVersion: domain.SCHEMA_VERSION,
      svgPath: "slide.svg",
      targets: [
        { targetId: "parent", status: "animated" },
        { targetId: "child", status: "animated" },
        { targetId: "other", status: "animated" },
      ],
      steps: [
        { targetId: "parent", action: "show", sourceText: "Parent" },
        { targetId: "child", action: "show", sourceText: "Child" },
        { targetId: "other", action: "show", sourceText: "Other" },
      ],
    },
    inventory,
    "slide.svg",
  );
  const next = domain.setRenderVisibility(manifest, inventory, "parent", false);

  assert.equal(next.targets.find((target) => target.targetId === "parent").render, false);
  assert.equal(next.targets.find((target) => target.targetId === "parent").visibleInEditor, false);
  assert.deepEqual(next.steps.map((step) => step.targetId), ["other"]);
  assert.equal(domain.isEffectivelyRendered(next, inventory, "child"), false);
});

test("Ein Target mit Step kann nicht still aus dem Editor entfernt werden", () => {
  const inventory = [{ targetId: "target", tagName: "g" }];
  const manifest = domain.syncManifest(
    {
      schemaVersion: domain.SCHEMA_VERSION,
      svgPath: "slide.svg",
      targets: [{ targetId: "target", status: "animated" }],
      steps: [{ targetId: "target", action: "show", sourceText: "Ziel" }],
    },
    inventory,
    "slide.svg",
  );
  const next = domain.setEditorVisibility(manifest, inventory, "target", false);
  assert.notEqual(next.targets[0].visibleInEditor, false);
});

test("Legacy-Felder bleiben erhalten und static_context wird bewusst migriert", () => {
  const normalized = domain.normalizeManifest(
    {
      schemaVersion: domain.SCHEMA_VERSION,
      sceneId: "scene-1",
      status: "draft",
      notes: ["Legacy"],
      svgPath: "slide.svg",
      defaults: { enterFrames: 16, drawFrames: 24, pauseMs: 500 },
      targets: [{ targetId: "static", status: "static_context" }],
      steps: [
        {
          targetId: "static",
          action: "show",
          trigger: "time_or_user",
          afterInternalPlotDelayMs: 120,
        },
      ],
    },
    "slide.svg",
  );

  assert.equal(normalized.sceneId, "scene-1");
  assert.equal(normalized.targets[0].status, "notAnimated");
  assert.equal(normalized.steps[0].trigger, "time_or_user");
  assert.deepEqual(domain.validateManifest(normalized), []);
});

test("Strikte Validierung lehnt unbekannte Felder ab", () => {
  const manifest = domain.defaultManifest("slide.svg");
  manifest.targets.push({ targetId: "a", status: "animated", surprise: true });
  const errors = domain.validateManifest(manifest);
  assert.equal(errors.some((error) => error.path === "$.targets[0].surprise"), true);
});

test("Unicode-Matching, occurrence und Wortgrenzen sind deterministisch", () => {
  const spoken = "Die Äpfel sind gut. Später sind Aepfel erneut gut.";
  const matches = domain.findSourceMatches(spoken, "aepfel");
  assert.deepEqual(matches.map((match) => match.wordIndex), [1, 6]);
  assert.equal(domain.matchSourceText(spoken, "Äpfel", undefined).ambiguous, true);
  assert.equal(domain.matchSourceText(spoken, "Äpfel", 2).selected.wordIndex, 6);

  const text = "Sie enthalten auch unterschiedlich viel Information.";
  assert.equal(domain.expandToWordBoundaries(text, 8, 31), "enthalten auch unterschiedlich");
});

test("Mock-Timeline folgt Sprach- statt Manifestreihenfolge", () => {
  const inventory = [
    { targetId: "a", tagName: "g" },
    { targetId: "b", tagName: "g" },
  ];
  const manifest = domain.syncManifest(
    {
      schemaVersion: domain.SCHEMA_VERSION,
      svgPath: "slide.svg",
      targets: [
        { targetId: "a", status: "animated" },
        { targetId: "b", status: "animated" },
      ],
      steps: [
        { targetId: "a", action: "show", sourceText: "Block A" },
        { targetId: "b", action: "show", sourceText: "Block B" },
      ],
    },
    inventory,
    "slide.svg",
  );
  const timeline = domain.buildMockTimeline(
    manifest,
    inventory,
    "Zuerst erscheint Block B. Danach folgt Block A.",
  );
  assert.deepEqual(timeline.map((entry) => entry.step.targetId), ["b", "a"]);
  assert.deepEqual(timeline.map((entry) => entry.mockSec), [0, 0.5]);
});
