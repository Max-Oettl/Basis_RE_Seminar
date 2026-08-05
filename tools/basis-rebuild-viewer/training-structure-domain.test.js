"use strict";

const assert = require("node:assert/strict");
const test = require("node:test");
const { applyAction, defaultStore, normalizeStore } = require("./training-structure-domain");

test("Kapitel, Lektion und Szenenzuordnung bleiben stabil", () => {
  let store = defaultStore();
  let output = applyAction(store, { action: "create_chapter", moduleId: "RE1", title: "Grundlagen" });
  store = output.store;
  const chapterId = output.result.chapter.id;

  output = applyAction(store, {
    action: "create_lesson",
    moduleId: "RE1",
    chapterId,
    title: "Zuverlaessigkeit verstehen",
  });
  store = output.store;
  const lessonId = output.result.lesson.id;

  output = applyAction(store, {
    action: "assign_scene",
    moduleId: "RE1",
    slideId: "RE1::1",
    chapterId,
    lessonId,
  }, "2026-07-16T12:00:00.000Z");

  assert.deepEqual(output.store.modules.RE1.scene_assignments["RE1::1"], {
    chapter_id: chapterId,
    lesson_id: lessonId,
    updated_at: "2026-07-16T12:00:00.000Z",
  });
});

test("Unzuordnen entfernt nur die Szenenzuordnung", () => {
  let store = defaultStore();
  let output = applyAction(store, { action: "create_chapter", moduleId: "RE1", title: "Kapitel" });
  store = output.store;
  const chapterId = output.result.chapter.id;
  output = applyAction(store, { action: "create_lesson", moduleId: "RE1", chapterId, title: "Lektion" });
  store = output.store;
  const lessonId = output.result.lesson.id;
  store = applyAction(store, {
    action: "assign_scene", moduleId: "RE1", slideId: "RE1::2", chapterId, lessonId,
  }).store;

  const result = applyAction(store, {
    action: "assign_scene", moduleId: "RE1", slideId: "RE1::2", chapterId: "", lessonId: "",
  }).store;
  assert.equal(result.modules.RE1.scene_assignments["RE1::2"], undefined);
  assert.equal(result.modules.RE1.chapters.length, 1);
});

test("Belegte Lektionen koennen nicht versehentlich geloescht werden", () => {
  const store = normalizeStore({
    modules: {
      RE1: {
        chapters: [{ id: "chapter_001", title: "Kapitel", lessons: [{ id: "lesson_001", title: "Lektion" }] }],
        scene_assignments: {
          "RE1::1": { chapter_id: "chapter_001", lesson_id: "lesson_001" },
        },
      },
    },
  });

  assert.throws(() => applyAction(store, {
    action: "delete_lesson",
    moduleId: "RE1",
    chapterId: "chapter_001",
    lessonId: "lesson_001",
  }), /zugeordnete Szenen/);
});

test("Kapitel und Lektionen lassen sich in ihrer Reihenfolge verschieben", () => {
  const store = normalizeStore({
    modules: {
      RE1: {
        chapters: [
          { id: "chapter_001", title: "A", lessons: [] },
          { id: "chapter_002", title: "B", lessons: [] },
        ],
      },
    },
  });
  const result = applyAction(store, {
    action: "move_chapter", moduleId: "RE1", chapterId: "chapter_002", direction: "up",
  }).store;
  assert.deepEqual(result.modules.RE1.chapters.map((chapter) => chapter.id), ["chapter_002", "chapter_001"]);
});
