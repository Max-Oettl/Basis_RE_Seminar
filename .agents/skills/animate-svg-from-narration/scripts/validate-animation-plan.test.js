"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");
const { validatePlan } = require("./validate-animation-plan.js");

function planWithPhoto(initialState) {
  return {
    schemaVersion: "svgAnimationDramaturgyPlan/v1",
    sceneId: "example_scene",
    svgPath: "example.svg",
    spokenText: "Zuerst sprechen wir allgemein über Rückrufaktionen. Ein konkretes Beispiel ist das Triebwerk.",
    animationDecision: "animated",
    animationRationale: "Das konkrete Beispiel erscheint erst bei seiner Einführung.",
    runtimeProfile: {
      supportedActions: ["show", "hide", "highlight", "draw", "transform"],
      initialVisibleAnimatedTargetsSupported: false,
    },
    initialStateRationale: "Der Content bleibt während der allgemeinen Einleitung leer.",
    semanticGroups: [
      {
        groupId: "brand_background",
        label: "Hintergrund",
        role: "background",
        members: ["Markenfläche"],
        initialState: "static_decorative",
        firstRelevantBeatId: "pre_narration",
        initialVisibilityEvidence: "Ruhiger Markenrahmen ohne Fachinformation.",
        dependsOn: [],
        groupingRationale: "Statischer Rahmen.",
      },
      {
        groupId: "specific_engine_example",
        label: "Konkretes Triebwerkbeispiel",
        role: "case_context",
        members: ["Triebwerksfoto", "Fallkarte", "Quellenzeile"],
        initialState,
        firstRelevantBeatId: "introduce_example",
        initialVisibilityEvidence: "Das Motiv wird erst im zweiten Beat genannt.",
        dependsOn: [],
        groupingRationale: "Foto und Fallinformation bilden eine Einheit.",
      },
    ],
    narrativeBeats: [
      {
        beatId: "general_intro",
        claim: "Allgemeine Einordnung von Rückrufaktionen.",
        sourceText: "Zuerst sprechen wir allgemein über Rückrufaktionen",
        occurrence: 1,
        requiredContext: [],
        revealTogether: [],
      },
      {
        beatId: "introduce_example",
        claim: "Das konkrete Triebwerk wird eingeführt.",
        sourceText: "Ein konkretes Beispiel ist das Triebwerk",
        occurrence: 1,
        requiredContext: [],
        revealTogether: ["specific_engine_example"],
      },
    ],
    steps: [
      {
        stepId: "show_specific_engine_example",
        beatId: "introduce_example",
        targetId: "specific_engine_example",
        action: "show",
        rationale: "Das konkrete Bild erscheint mit seiner ersten Nennung.",
      },
    ],
    unsupportedEffectRequests: [],
    stateReview: [
      { stateId: "initial", afterBeatId: null, visibleGroups: ["brand_background"] },
      { stateId: "end", afterBeatId: "introduce_example", visibleGroups: ["brand_background", "specific_engine_example"] },
    ],
  };
}

test("rejects a specific photo that is visible before its first relevant beat", () => {
  const result = validatePlan(planWithPhoto("visible_context"));
  assert.ok(result.errors.some((issue) =>
    issue.message.includes("first becomes relevant at introduce_example")
  ));
});

test("accepts a specific photo hidden until its first relevant beat", () => {
  const result = validatePlan(planWithPhoto("hidden_until_trigger"));
  assert.deepEqual(result.errors, []);
});

test("accepts narration pauses and matches a trigger across a pause", () => {
  const plan = planWithPhoto("hidden_until_trigger");
  plan.spokenText = "Zuerst sprechen wir allgemein über Rückrufaktionen. Ein konkretes {{pause:medium}} Beispiel ist das Triebwerk.";
  const result = validatePlan(plan);
  assert.deepEqual(result.errors, []);
});

test("rejects a pause marker used as an animation trigger", () => {
  const plan = planWithPhoto("hidden_until_trigger");
  plan.spokenText = "Zuerst sprechen wir allgemein über Rückrufaktionen. Ein konkretes {{pause:medium}} Beispiel ist das Triebwerk.";
  plan.narrativeBeats[1].sourceText = "konkretes {{pause:medium}} Beispiel ist das";
  const result = validatePlan(plan);
  assert.ok(result.errors.some((issue) =>
    issue.message.includes("cannot be used as an animation trigger")
  ));
});

test("rejects an invalid narration pause", () => {
  const plan = planWithPhoto("hidden_until_trigger");
  plan.spokenText += " {{pause:4s}}";
  const result = validatePlan(plan);
  assert.ok(result.errors.some((issue) => issue.location === "$.spokenText"));
});
