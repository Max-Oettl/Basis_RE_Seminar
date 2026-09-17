"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");
const vm = require("node:vm");
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

test("a highlighted visible value stays opaque and returns to its normal style", () => {
  const animation=buildAnimationStates({
    targets:[{targetId:"value",status:"animated"}],
    steps:[{targetId:"value",action:"show",sourceText:"the known value"},{targetId:"value",action:"highlight",sourceText:"the matching point",stroke:"#00A653",strokeWidth:2}],
  });
  const element={style:{},setAttribute(){},removeAttribute(name){if(name==="style")this.style={};}};
  const context={document:{querySelector:()=>({}),getElementById:()=>element},window:{__svgQaOriginalStyles:{value:null}}};
  const pulse=animation.timeline[1];
  vm.runInNewContext(buildApplyAnimationStateExpression(animation.manifest,animation.timeline,{timeMs:(pulse.start+pulse.end)/2}),context);
  assert.equal(element.style.opacity,"1");
  assert.match(element.style.filter,/#00A653/);
  vm.runInNewContext(buildApplyAnimationStateExpression(animation.manifest,animation.timeline,{timeMs:pulse.end}),context);
  assert.equal(element.style.opacity,"1");
  assert.equal(element.style.filter,undefined);
});
