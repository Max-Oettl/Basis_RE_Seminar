"use strict";

const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const test = require("node:test");

const viewerSource = fs.readFileSync(path.join(__dirname, "index.html"), "utf8");

test("Viewer laedt die zentrale Pausenlogik vor der Animationslogik", () => {
  const pauseDomainIndex = viewerSource.indexOf('/viewer-assets/narration-pause-domain.js');
  const animationDomainIndex = viewerSource.indexOf('/viewer-assets/svg-animation-domain.js');
  assert.ok(pauseDomainIndex >= 0);
  assert.ok(animationDomainIndex > pauseDomainIndex);
});

test("Viewer verdrahtet Einfuegen, Bearbeiten, Loeschen und Rohtextkopie", () => {
  for (const requiredFragment of [
    'id="spokenTextPauseInsert"',
    'id="spokenTextPauseApply"',
    'id="spokenTextPauseDelete"',
    'id="spokenTextCopyRaw"',
    'elements.spokenTextPauseInsert.addEventListener("change", insertSpokenPause)',
    'elements.spokenTextPauseApply.addEventListener("click"',
    'elements.spokenTextPauseDelete.addEventListener("click"',
    'elements.spokenTextCopyRaw.addEventListener("click", copyRawSpokenText)',
  ]) {
    assert.ok(viewerSource.includes(requiredFragment), requiredFragment);
  }
});

test("Viewer zeigt fokussierbare Pills und blockiert ungueltiges Speichern", () => {
  assert.ok(viewerSource.includes('pill.className = `spoken-text-pause${pause.valid ? "" : " invalid"}`'));
  assert.ok(viewerSource.includes('pill.type = "button"'));
  assert.ok(viewerSource.includes('pill.setAttribute("aria-disabled", archived ? "true" : "false")'));
  assert.ok(viewerSource.includes('pill.title = pause.valid ? pause.raw'));
  assert.ok(viewerSource.includes('if (event.key !== "Escape") return'));
  assert.ok(viewerSource.includes('elements.spokenTextPauseStatus.setAttribute("aria-live", "polite")')
    || viewerSource.includes('id="spokenTextPauseStatus" class="spoken-text-pause-status" aria-live="polite"'));
  assert.ok(viewerSource.includes('elements.spokenTextSave.disabled = state.spokenTextSaving || !validation.valid'));
});
