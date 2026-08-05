"use strict";

const fs = require("fs");
const path = require("path");
const narrationPauseDomain = require("../../../../tools/basis-rebuild-viewer/narration-pause-domain");
const svgAnimationDomain = require("../../../../tools/basis-rebuild-viewer/svg-animation-domain");

const DECISIONS = new Set(["static", "animated", "needs_review"]);
const INITIAL_STATES = new Set([
  "visible_context",
  "hidden_until_trigger",
  "static_decorative",
  "visible_then_changes",
  "excluded",
]);
const ACTIONS = new Set(["show", "hide", "highlight", "draw", "transform"]);
const INTRO_ACTIONS = new Set(["show", "draw", "transform"]);

function wordCount(value) {
  return narrationPauseDomain.wordCount(value);
}

function validatePlan(plan) {
  const errors = [];
  const warnings = [];
  const addError = (location, message) => errors.push({ location, message });
  const addWarning = (location, message) => warnings.push({ location, message });

  if (!plan || typeof plan !== "object" || Array.isArray(plan)) {
    return { errors: [{ location: "$", message: "Plan must be a JSON object." }], warnings };
  }

  if (plan.schemaVersion !== "svgAnimationDramaturgyPlan/v1") {
    addError("$.schemaVersion", "Expected svgAnimationDramaturgyPlan/v1.");
  }
  for (const field of ["sceneId", "svgPath", "spokenText", "animationRationale", "initialStateRationale"]) {
    if (typeof plan[field] !== "string" || !plan[field].trim()) {
      addError(`$.${field}`, "Non-empty string required.");
    }
  }
  if (typeof plan.spokenText === "string") {
    const pauseValidation = narrationPauseDomain.validateNarration(plan.spokenText);
    pauseValidation.errors.forEach((issue) => {
      addError("$.spokenText", issue.message);
    });
  }
  if (!DECISIONS.has(plan.animationDecision)) {
    addError("$.animationDecision", "Expected static, animated, or needs_review.");
  }

  const runtime = plan.runtimeProfile && typeof plan.runtimeProfile === "object"
    ? plan.runtimeProfile
    : {};
  const supportedActions = new Set(Array.isArray(runtime.supportedActions) ? runtime.supportedActions : []);
  if (!Array.isArray(runtime.supportedActions)) {
    addError("$.runtimeProfile.supportedActions", "Array required.");
  }

  const groups = Array.isArray(plan.semanticGroups) ? plan.semanticGroups : [];
  if (!Array.isArray(plan.semanticGroups)) addError("$.semanticGroups", "Array required.");
  const groupById = new Map();
  groups.forEach((group, index) => {
    const location = `$.semanticGroups[${index}]`;
    const id = String(group?.groupId || "").trim();
    if (!id) addError(`${location}.groupId`, "Non-empty groupId required.");
    else if (groupById.has(id)) addError(`${location}.groupId`, `Duplicate groupId ${id}.`);
    else groupById.set(id, group);
    if (!/^[a-z][a-z0-9_]*$/.test(id)) {
      addError(`${location}.groupId`, "Use semantic ASCII snake_case.");
    }
    if (!INITIAL_STATES.has(group?.initialState)) {
      addError(`${location}.initialState`, "Unknown initial-state class.");
    }
    if (!String(group?.firstRelevantBeatId || "").trim()) {
      addWarning(
        `${location}.firstRelevantBeatId`,
        "Legacy plan: document the first narration beat that makes this group relevant.",
      );
    }
    if (!String(group?.initialVisibilityEvidence || "").trim()) {
      addWarning(
        `${location}.initialVisibilityEvidence`,
        "Legacy plan: document why this group is visible or hidden at frame 0.",
      );
    }
    if (!Array.isArray(group?.members) || !group.members.length) {
      addError(`${location}.members`, "At least one complete semantic member is required.");
    }
    if (!Array.isArray(group?.dependsOn)) {
      addError(`${location}.dependsOn`, "Array required.");
    }
    if (group?.initialState === "visible_then_changes" &&
        runtime.initialVisibleAnimatedTargetsSupported !== true) {
      addError(
        `${location}.initialState`,
        "Runtime cannot animate a target that must already be visible at frame 0.",
      );
    }
  });

  groups.forEach((group, index) => {
    const location = `$.semanticGroups[${index}]`;
    for (const dependency of group?.dependsOn || []) {
      if (!groupById.has(dependency)) {
        addError(`${location}.dependsOn`, `Unknown dependency ${dependency}.`);
      }
      if (dependency === group.groupId) {
        addError(`${location}.dependsOn`, "A group cannot depend on itself.");
      }
    }
    if (["connector", "relationship"].includes(group?.role) &&
        (group?.dependsOn || []).length < 2) {
      addError(`${location}.dependsOn`, "A relationship needs at least two endpoint dependencies.");
    }
  });

  const beats = Array.isArray(plan.narrativeBeats) ? plan.narrativeBeats : [];
  if (!Array.isArray(plan.narrativeBeats)) addError("$.narrativeBeats", "Array required.");
  const beatById = new Map();
  beats.forEach((beat, index) => {
    const location = `$.narrativeBeats[${index}]`;
    const id = String(beat?.beatId || "").trim();
    if (!id) addError(`${location}.beatId`, "Non-empty beatId required.");
    else if (beatById.has(id)) addError(`${location}.beatId`, `Duplicate beatId ${id}.`);
    else beatById.set(id, beat);
    if (!String(beat?.claim || "").trim()) addError(`${location}.claim`, "Claim required.");
    const phrase = String(beat?.sourceText || "");
    if (/\{\{pause:/i.test(phrase)) {
      addError(
        `${location}.sourceText`,
        "A pause marker is timing metadata and cannot be used as an animation trigger.",
      );
    }
    const words = wordCount(phrase);
    if (words < 3 || words > 8) {
      addError(`${location}.sourceText`, "Use an exact phrase of three to eight words.");
    }
    const occurrences = svgAnimationDomain.findSourceMatches(plan.spokenText, phrase).length;
    if (!occurrences) {
      addError(`${location}.sourceText`, "Phrase is not an exact substring of spokenText.");
    } else if (occurrences > 1 && !Number.isInteger(beat?.occurrence)) {
      addError(`${location}.occurrence`, "Repeated phrase requires a 1-based occurrence.");
    } else if (Number.isInteger(beat?.occurrence) &&
               (beat.occurrence < 1 || beat.occurrence > occurrences)) {
      addError(`${location}.occurrence`, "Occurrence is outside the available phrase matches.");
    }
    for (const field of ["requiredContext", "revealTogether"]) {
      if (!Array.isArray(beat?.[field])) {
        addError(`${location}.${field}`, "Array required.");
        continue;
      }
      for (const groupId of beat[field]) {
        if (!groupById.has(groupId)) {
          addError(`${location}.${field}`, `Unknown group ${groupId}.`);
        }
      }
    }
  });

  const firstBeatId = beats[0]?.beatId || null;
  groups.forEach((group, index) => {
    const location = `$.semanticGroups[${index}]`;
    const firstRelevantBeatId = String(group?.firstRelevantBeatId || "").trim();
    if (!firstRelevantBeatId) return;
    if (firstRelevantBeatId !== "pre_narration" && !beatById.has(firstRelevantBeatId)) {
      addError(
        `${location}.firstRelevantBeatId`,
        `Unknown firstRelevantBeatId ${firstRelevantBeatId}.`,
      );
      return;
    }
    if (["visible_context", "visible_then_changes"].includes(group.initialState) &&
        firstRelevantBeatId !== "pre_narration" &&
        firstRelevantBeatId !== firstBeatId) {
      addError(
        `${location}.initialState`,
        `Group is visible at frame 0 but first becomes relevant at ${firstRelevantBeatId}.`,
      );
    }
    if (group.initialState === "static_decorative" && firstRelevantBeatId !== "pre_narration") {
      addError(
        `${location}.initialState`,
        "Static decoration must be relevant before narration; content-bearing groups need a trigger.",
      );
    }
    if (group.initialState === "hidden_until_trigger" &&
        firstRelevantBeatId !== "pre_narration" &&
        !beatById.get(firstRelevantBeatId)?.revealTogether?.includes(group.groupId)) {
      addError(
        `${location}.firstRelevantBeatId`,
        "The first relevant beat must reveal this hidden group.",
      );
    }
  });

  const steps = Array.isArray(plan.steps) ? plan.steps : [];
  if (!Array.isArray(plan.steps)) addError("$.steps", "Array required.");
  const stepIds = new Set();
  const stepsByTarget = new Map();
  steps.forEach((step, index) => {
    const location = `$.steps[${index}]`;
    const id = String(step?.stepId || "").trim();
    if (!id) addError(`${location}.stepId`, "Non-empty stepId required.");
    else if (stepIds.has(id)) addError(`${location}.stepId`, `Duplicate stepId ${id}.`);
    else stepIds.add(id);
    if (!beatById.has(step?.beatId)) addError(`${location}.beatId`, "Unknown beatId.");
    if (!groupById.has(step?.targetId)) addError(`${location}.targetId`, "Unknown targetId.");
    if (!ACTIONS.has(step?.action)) addError(`${location}.action`, "Unknown manifest action.");
    if (!supportedActions.has(step?.action)) {
      addError(`${location}.action`, `Action ${step?.action} is not supported by the runtime profile.`);
    }
    if (!String(step?.rationale || "").trim()) {
      addError(`${location}.rationale`, "Effect rationale required.");
    }
    if (!stepsByTarget.has(step?.targetId)) stepsByTarget.set(step?.targetId, []);
    stepsByTarget.get(step?.targetId).push({ ...step, index });
  });

  if (plan.animationDecision === "static" && steps.length) {
    addError("$.steps", "Static scenes must not contain animation steps.");
  }
  if (plan.animationDecision === "animated" && !steps.length) {
    addError("$.steps", "Animated scenes require at least one step.");
  }

  for (const [targetId, targetSteps] of stepsByTarget) {
    const group = groupById.get(targetId);
    const first = targetSteps[0];
    if (group?.initialState === "hidden_until_trigger" && !INTRO_ACTIONS.has(first.action)) {
      addError(
        `$.steps[${first.index}].action`,
        "A hidden target must be introduced before highlight or hide.",
      );
    }
    if (group?.initialState === "visible_context" ||
        group?.initialState === "static_decorative") {
      addError(
        `$.steps[${first.index}].targetId`,
        "A frame-0 visible group cannot be an animated target in this plan.",
      );
    }
  }

  const firstRevealIndex = new Map();
  groups.forEach((group) => {
    if (["visible_context", "static_decorative"].includes(group.initialState)) {
      firstRevealIndex.set(group.groupId, -1);
    }
  });
  steps.forEach((step, index) => {
    if (!firstRevealIndex.has(step.targetId) && INTRO_ACTIONS.has(step.action)) {
      firstRevealIndex.set(step.targetId, index);
    }
  });
  groups.forEach((group, groupIndex) => {
    const revealIndex = firstRevealIndex.get(group.groupId);
    for (const dependency of group.dependsOn || []) {
      const dependencyIndex = firstRevealIndex.get(dependency);
      if (Number.isInteger(revealIndex) && Number.isInteger(dependencyIndex) &&
          dependencyIndex > revealIndex) {
        addError(
          `$.semanticGroups[${groupIndex}].dependsOn`,
          `${dependency} becomes visible after dependent group ${group.groupId}.`,
        );
      }
    }
  });

  if (!String(plan.initialStateRationale || "").trim()) {
    addError("$.initialStateRationale", "Initial-state rationale required.");
  }
  const initiallyVisible = groups.filter((group) =>
    ["visible_context", "static_decorative", "visible_then_changes"].includes(group.initialState)
  );
  if (!initiallyVisible.length && plan.animationDecision === "animated") {
    addWarning(
      "$.semanticGroups",
      "Animated scene starts empty; document why the build-up from nothing is intentional.",
    );
  }

  const reviews = Array.isArray(plan.stateReview) ? plan.stateReview : [];
  if (!Array.isArray(plan.stateReview)) addError("$.stateReview", "Array required.");
  const reviewIds = new Set(reviews.map((review) => review?.stateId));
  if (!reviewIds.has("initial")) addError("$.stateReview", "Initial state review is required.");
  if (!reviewIds.has("end")) addError("$.stateReview", "End state review is required.");
  reviews.forEach((review, index) => {
    for (const groupId of review?.visibleGroups || []) {
      if (!groupById.has(groupId)) {
        addError(`$.stateReview[${index}].visibleGroups`, `Unknown group ${groupId}.`);
      }
    }
  });

  for (const [index, request] of (plan.unsupportedEffectRequests || []).entries()) {
    if (!String(request?.effect || "").trim() || !String(request?.reason || "").trim()) {
      addError(
        `$.unsupportedEffectRequests[${index}]`,
        "Unsupported effect requests need effect and reason.",
      );
    }
    addWarning(
      `$.unsupportedEffectRequests[${index}]`,
      "Effect stays outside the production manifest until the runtime is extended.",
    );
  }

  return { errors, warnings };
}

function main(argv) {
  const input = argv[2];
  if (!input) {
    process.stderr.write("Usage: node validate-animation-plan.js <plan.json>\n");
    process.exitCode = 2;
    return;
  }
  const absolutePath = path.resolve(input);
  let plan;
  try {
    plan = JSON.parse(fs.readFileSync(absolutePath, "utf8"));
  } catch (error) {
    process.stderr.write(`Cannot read plan: ${error.message}\n`);
    process.exitCode = 2;
    return;
  }
  const result = validatePlan(plan);
  for (const issue of result.errors) {
    process.stderr.write(`ERROR ${issue.location}: ${issue.message}\n`);
  }
  for (const issue of result.warnings) {
    process.stdout.write(`WARN  ${issue.location}: ${issue.message}\n`);
  }
  process.stdout.write(
    `Animation plan: ${result.errors.length} error(s), ${result.warnings.length} warning(s).\n`,
  );
  if (result.errors.length) process.exitCode = 1;
}

if (require.main === module) main(process.argv);

module.exports = { validatePlan };
