"use strict";

const assert = require("node:assert/strict");
const test = require("node:test");
const { validateSpokenTextOverride } = require("./server");

test("server accepts and preserves valid narration pause markers", () => {
  const text = "  Vorher. {{pause:medium}} Nachher.\r\n  ";
  assert.equal(
    validateSpokenTextOverride(text),
    "Vorher. {{pause:medium}} Nachher.",
  );
});

test("server rejects invalid narration pause markers with details", () => {
  assert.throws(
    () => validateSpokenTextOverride("Vorher {{pause:4s}} nachher"),
    (error) => error.status === 422
      && Array.isArray(error.details)
      && error.details[0].raw === "{{pause:4s}}",
  );
});
