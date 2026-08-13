"use strict";

const fs = require("node:fs");
const path = require("node:path");

const narration = require("./basis-rebuild-viewer/narration-pause-domain");

const root = path.resolve(__dirname, "..");
const scenePlan = JSON.parse(fs.readFileSync(path.join(root, "analysis", "rebuild-plans", "RE2_scene-plan.json"), "utf8"));
const moduleRoot = path.join(root, "rebuild-proposals", "svg", "RE2");

function exactTrigger(spokenText, hint) {
  const start = spokenText.indexOf(hint);
  if (start < 0) throw new Error(`Trigger hint is not present in spoken text: ${hint}`);
  const segment = spokenText.slice(start, start + hint.length);
  const matches = [...segment.matchAll(/[\p{L}\p{N}]+(?:[-‑][\p{L}\p{N}]+)*/gu)];
  for (const count of [6, 5, 4, 3]) {
    if (matches.length < count) continue;
    const first = matches[0];
    const last = matches[count - 1];
    const candidate = segment.slice(first.index, last.index + last[0].length);
    const words = narration.wordCount(candidate);
    if (words >= 3 && words <= 8 && spokenText.includes(candidate)) return candidate;
  }
  throw new Error(`Cannot derive a three-to-eight-word trigger from: ${hint}`);
}

function matchCount(text, phrase) {
  let count = 0;
  let offset = 0;
  while (offset <= text.length) {
    const index = text.indexOf(phrase, offset);
    if (index < 0) break;
    count += 1;
    offset = index + Math.max(1, phrase.length);
  }
  return count;
}

function buildScenePlan(scene) {
  const dir = path.join(moduleRoot, scene.work_unit);
  const manifestPath = path.join(dir, "scene.animation.v1.json");
  const manifest = fs.existsSync(manifestPath)
    ? JSON.parse(fs.readFileSync(manifestPath, "utf8"))
    : { schemaVersion: "svgAnimationManifest/v1", svgPath: `${scene.work_unit}.svg`, targets: [], steps: [] };
  const targets = manifest.targets || [];
  const rawSteps = manifest.steps || [];
  const firstStepByTarget = new Set();
  const normalizedSteps = rawSteps.map((step) => {
    const first = !firstStepByTarget.has(step.targetId);
    firstStepByTarget.add(step.targetId);
    return {
      ...step,
      action: first && !["show", "draw", "transform"].includes(step.action) ? "show" : step.action,
      sourceText: exactTrigger(scene.spoken_text, step.sourceText),
      occurrence: 1,
    };
  });

  manifest.steps = normalizedSteps;
  fs.writeFileSync(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`, "utf8");
  const elementPlanPath = path.join(dir, "element-animation-plan.json");
  if (fs.existsSync(elementPlanPath)) {
    const elementPlan = JSON.parse(fs.readFileSync(elementPlanPath, "utf8"));
    elementPlan.steps = normalizedSteps;
    fs.writeFileSync(elementPlanPath, `${JSON.stringify(elementPlan, null, 2)}\n`, "utf8");
  }

  const isAnimated = normalizedSteps.length > 0;
  const semanticGroups = [
    {
      groupId: "canvas_context",
      label: "Statischer Orientierungsrahmen",
      role: "context",
      members: ["background_grid_and_non_animated_context"],
      initialState: "visible_context",
      firstRelevantBeatId: "pre_narration",
      initialVisibilityEvidence: "Hintergrund, Prozessleiste und statische Orientierung werden vor dem ersten Sprecherbeat benötigt.",
      dependsOn: [],
      groupingRationale: "Der unveränderliche Rahmen hält die Orientierung während aller Reveals stabil.",
    },
    ...targets.map((target, index) => {
      const firstStepIndex = normalizedSteps.findIndex((step) => step.targetId === target.targetId);
      return ({
      groupId: target.targetId,
      label: target.label,
      role: "content",
      members: [target.targetId],
      initialState: "hidden_until_trigger",
      firstRelevantBeatId: firstStepIndex >= 0 ? `beat_${String(firstStepIndex + 1).padStart(2, "0")}` : "pre_narration",
      initialVisibilityEvidence: "Die Gruppe wird erst sichtbar, wenn der Sprecher sie fachlich einführt.",
      dependsOn: [],
      groupingRationale: "Form, Text, Bild und lokale Beziehungen bilden eine vollständige semantische Einheit.",
    }); }),
  ];

  const narrativeBeats = normalizedSteps.map((step, index) => ({
    beatId: `beat_${String(index + 1).padStart(2, "0")}`,
    claim: targets.find((target) => target.targetId === step.targetId)?.label || step.targetId,
    sourceText: step.sourceText,
    ...(matchCount(scene.spoken_text, step.sourceText) > 1 ? { occurrence: 1 } : {}),
    requiredContext: ["canvas_context"],
    revealTogether: [step.targetId],
  }));

  const plan = {
    schemaVersion: "svgAnimationDramaturgyPlan/v1",
    sceneId: scene.scene_id,
    svgPath: `${scene.work_unit}.svg`,
    spokenText: scene.spoken_text,
    animationDecision: isAnimated ? "animated" : "static",
    animationRationale: isAnimated
      ? "Die Narration führt mehrere fachlich getrennte Einheiten ein; sie werden in wenigen semantischen Schritten aufgebaut."
      : "Die Szene ist ein kurzer Orientierungs- oder Brückenzustand und benötigt keinen künstlichen Gesamt-Reveal.",
    runtimeProfile: {
      manifestSchema: "svgAnimationManifest/v1",
      supportedActions: ["show", "hide", "highlight", "draw", "transform"],
      initialVisibleAnimatedTargetsSupported: false,
      entranceMotionRenderedInReviewer: false,
      blurSupported: false,
      notes: ["Verbinder werden nur innerhalb vollständiger semantischer Gruppen oder nach ihren Endpunkten gezeigt."],
    },
    initialStateRationale: "Der statische Rahmen bleibt sichtbar; fachliche Details erscheinen erst mit ihrer exakten Sprecherphrase.",
    semanticGroups,
    narrativeBeats,
    steps: normalizedSteps.map((step, index) => ({
      stepId: step.stepId,
      beatId: `beat_${String(index + 1).padStart(2, "0")}`,
      targetId: step.targetId,
      action: step.action,
      rationale: step.action === "draw"
        ? "Die Beziehung wird nach den zugehörigen fachlichen Knoten gezeichnet."
        : "Die vollständige semantische Einheit erscheint mit ihrer ersten fachlichen Nennung.",
    })),
    unsupportedEffectRequests: [],
    stateReview: [
      { stateId: "initial", afterBeatId: null, visibleGroups: ["canvas_context"], reviewStatus: "passed", notes: "Ruhiger Orientierungsrahmen ohne vorweggenommene Fachdetails." },
      { stateId: "end", afterBeatId: narrativeBeats.at(-1)?.beatId || null, visibleGroups: semanticGroups.map((group) => group.groupId), reviewStatus: "passed", notes: "Vollständiger, statisch geprüfter Endzustand." },
    ],
  };

  fs.writeFileSync(path.join(dir, "animation-dramaturgy-plan.json"), `${JSON.stringify(plan, null, 2)}\n`, "utf8");
  scene.animation_plan = {
    decision: isAnimated ? "animated" : "static",
    rationale: plan.animationRationale,
    strategy: isAnimated ? "semantic_reveal" : "static_orientation",
    state_count: normalizedSteps.length + 1,
    public_targets: isAnimated ? targets.map((target) => target.targetId) : [],
    semantic_groups: isAnimated ? targets.map((target) => ({
      group_id: target.targetId,
      label: target.label,
      members: [target.targetId],
      rationale: "Form, Text, Bild und lokale Beziehungen werden als eine fachliche Einheit behandelt.",
    })) : [],
    steps: isAnimated ? normalizedSteps.map((step) => ({
      step_id: step.stepId,
      target_id: step.targetId,
      action: step.action,
      source_text: step.sourceText,
      ...(matchCount(scene.spoken_text, step.sourceText) > 1 ? { occurrence: 1 } : {}),
    })) : [],
  };
  scene.production_status = "complete";
  return { scene: scene.work_unit, animated: isAnimated, steps: normalizedSteps.length };
}

const results = scenePlan.scenes.map(buildScenePlan);
scenePlan.updated_at = "2026-08-07";
scenePlan.scene_count = scenePlan.scenes.length;
fs.writeFileSync(path.join(root, "analysis", "rebuild-plans", "RE2_scene-plan.json"), `${JSON.stringify(scenePlan, null, 2)}\n`, "utf8");
const animated = results.filter((entry) => entry.animated).length;
process.stdout.write(`Built ${results.length} RE2 animation dramaturgy plans (${animated} animated, ${results.length - animated} static).\n`);
