"use strict";

const assert = require("node:assert/strict");
const test = require("node:test");
const pauses = require("./narration-pause-domain");

test("parses presets and custom pause durations losslessly", () => {
  const text = "A {{pause:short}} B {{pause:1.2s}} C {{pause:1200ms}} D";
  const segments = pauses.pauseSegments(text);
  assert.deepEqual(segments.map((segment) => segment.durationMs), [400, 1200, 1200]);
  assert.equal(pauses.validateNarration(text).durationMs, 2800);
  assert.equal(segments.map((segment) => segment.raw).join("|"), "{{pause:short}}|{{pause:1.2s}}|{{pause:1200ms}}");
});

test("rejects unknown, zero, comma, overlong, and unclosed markers", () => {
  for (const marker of [
    "{{pause:brief}}",
    "{{pause:0s}}",
    "{{pause:4s}}",
    "{{pause:1,2s}}",
    "{{pause:medium",
    "{{ pause:medium}}",
  ]) {
    assert.equal(pauses.validateNarration(`Text ${marker}`).valid, false, marker);
  }
});

test("inserts before a selection without replacing selected text", () => {
  const result = pauses.insertPause("Alpha Beta", 6, 10, "medium");
  assert.equal(result.text, "Alpha {{pause:medium}} Beta");
  assert.equal(result.text.slice(result.selectionStart), "Beta");
  assert.equal(result.selectionEnd, result.selectionStart);
});

test("normalizes decimal commas and supports replacing and deleting markers", () => {
  assert.equal(pauses.markerFor("1,2"), "{{pause:1.2s}}");
  const text = "A {{pause:short}} B";
  const pause = pauses.pauseSegments(text)[0];
  assert.equal(pauses.replacePause(text, pause.start, pause.end, "long").text, "A {{pause:long}} B");
  assert.equal(pauses.replacePause(text, pause.start, pause.end, null).text, "A B");
});

test("word count excludes markers and SSML conversion preserves narration", () => {
  const text = "Was sagt uns das? {{pause:medium}} Genau darum geht es.";
  assert.equal(pauses.wordCount(text), 8);
  assert.equal(
    pauses.toSsmlBreaks(text),
    'Was sagt uns das? <break time="800ms"/> Genau darum geht es.',
  );
  assert.equal(pauses.durationBefore(text, text.indexOf("Genau")), 800);
});
