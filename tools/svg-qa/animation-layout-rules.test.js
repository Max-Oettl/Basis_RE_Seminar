"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");
const {
  buildAnimationStates,
  buildApplyAnimationStateExpression,
} = require("./animation-layout-rules");

test("steps with the same narration trigger run concurrently", () => {
  const manifest = {
    defaults: { pauseMs: 500 },
    targets: ["initial", "shifted", "explanation", "overlap"].map((targetId) => ({
      targetId,
      status: "animated",
      render: true,
    })),
    steps: [
      { targetId: "initial", action: "draw", sourceText: "Ausgangslage", drawDurFrames: 30 },
      { targetId: "initial", action: "hide", sourceText: "Verschiebung", exitFrames: 15 },
      { targetId: "shifted", action: "transform", sourceText: "Verschiebung", durFrames: 60 },
      { targetId: "explanation", action: "show", sourceText: "Verschiebung", enterFrames: 15 },
      { targetId: "overlap", action: "show", sourceText: "Folge", enterFrames: 15 },
    ],
  };

  const { timeline, durationMs } = buildAnimationStates(manifest);

  assert.deepEqual(timeline.map((segment) => segment.start), [0, 1500, 1500, 1500, 4000]);
  assert.equal(timeline[2].end, 3500);
  assert.equal(durationMs, 4500);
});

test("initial QA render has no preview opacity for animated targets", () => {
  const manifest = {
    targets: [{ targetId: "later_content", status: "animated", render: true }],
    steps: [{ targetId: "later_content", action: "show", sourceText: "Später" }],
  };
  const animation = buildAnimationStates(manifest);
  const expression = buildApplyAnimationStateExpression(
    animation.manifest,
    animation.timeline,
    animation.states[0],
  );

  assert.match(expression, /element\.style\.opacity = String\(value\);/);
  assert.doesNotMatch(expression, /Math\.max\(0\.15, value\)/);
});
