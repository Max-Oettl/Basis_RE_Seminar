const test = require("node:test");
const assert = require("node:assert/strict");

const { reviewStatusAfterNoteSave } = require("./server");

test("eine neue Review-Notiz wechselt automatisch von offen zu Korrektur", () => {
  assert.equal(
    reviewStatusAfterNoteSave("open", "Diagrammaufbau an den Sprechertext anpassen."),
    "needs_revision",
  );
});

test("eine leere Notiz laesst den Status offen", () => {
  assert.equal(reviewStatusAfterNoteSave("open", "   "), "open");
});

test("explizite weiterfuehrende Status bleiben erhalten", () => {
  assert.equal(reviewStatusAfterNoteSave("needs_revision", "Noch offen"), "needs_revision");
  assert.equal(reviewStatusAfterNoteSave("accepted", "Dokumentierter Hinweis"), "accepted");
  assert.equal(reviewStatusAfterNoteSave("final", "Dokumentierter Hinweis"), "final");
});
