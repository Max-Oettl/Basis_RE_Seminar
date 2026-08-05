"use strict";

const schemaVersion = "basisReliabilityTrainingStructure/v1";

function cleanText(value, fallback = "") {
  const text = String(value || "").trim().replace(/\s+/g, " ");
  return (text || fallback).slice(0, 160);
}

function cleanModuleId(value) {
  return String(value || "").trim().replace(/\s+/g, "_").replace(/[^\w.-]+/g, "_");
}

function defaultStore() {
  return { schema_version: schemaVersion, modules: {} };
}

function normalizeLesson(value, fallbackIndex) {
  return {
    id: cleanText(value?.id, `lesson_${String(fallbackIndex + 1).padStart(3, "0")}`),
    title: cleanText(value?.title, `Lektion ${fallbackIndex + 1}`),
  };
}

function normalizeChapter(value, fallbackIndex) {
  const lessons = Array.isArray(value?.lessons)
    ? value.lessons.map(normalizeLesson)
    : [];
  return {
    id: cleanText(value?.id, `chapter_${String(fallbackIndex + 1).padStart(3, "0")}`),
    title: cleanText(value?.title, `Kapitel ${fallbackIndex + 1}`),
    lessons,
  };
}

function normalizeAssignment(value) {
  const chapterId = cleanText(value?.chapter_id);
  const lessonId = cleanText(value?.lesson_id);
  if (!chapterId || !lessonId) return null;
  return {
    chapter_id: chapterId,
    lesson_id: lessonId,
    updated_at: value?.updated_at || null,
  };
}

function normalizeStore(value) {
  const store = defaultStore();
  const modules = value?.modules && typeof value.modules === "object" && !Array.isArray(value.modules)
    ? value.modules
    : {};

  for (const [rawModuleId, rawModule] of Object.entries(modules)) {
    const moduleId = cleanModuleId(rawModuleId);
    if (!moduleId) continue;
    const chapters = Array.isArray(rawModule?.chapters)
      ? rawModule.chapters.map(normalizeChapter)
      : [];
    const assignments = {};
    const rawAssignments = rawModule?.scene_assignments;
    if (rawAssignments && typeof rawAssignments === "object" && !Array.isArray(rawAssignments)) {
      for (const [slideId, rawAssignment] of Object.entries(rawAssignments)) {
        const assignment = normalizeAssignment(rawAssignment);
        if (assignment) assignments[String(slideId)] = assignment;
      }
    }
    store.modules[moduleId] = { chapters, scene_assignments: assignments };
  }
  return store;
}

function ensureModule(store, moduleId) {
  if (!store.modules[moduleId]) {
    store.modules[moduleId] = { chapters: [], scene_assignments: {} };
  }
  return store.modules[moduleId];
}

function nextId(prefix, ids) {
  const used = new Set(ids);
  let index = 1;
  while (used.has(`${prefix}_${String(index).padStart(3, "0")}`)) index += 1;
  return `${prefix}_${String(index).padStart(3, "0")}`;
}

function findChapter(module, chapterId) {
  return module.chapters.find((chapter) => chapter.id === chapterId) || null;
}

function findLesson(chapter, lessonId) {
  return chapter?.lessons.find((lesson) => lesson.id === lessonId) || null;
}

function moveEntry(entries, id, direction) {
  const index = entries.findIndex((entry) => entry.id === id);
  const offset = direction === "down" ? 1 : -1;
  const targetIndex = index + offset;
  if (index < 0 || targetIndex < 0 || targetIndex >= entries.length) return false;
  const [entry] = entries.splice(index, 1);
  entries.splice(targetIndex, 0, entry);
  return true;
}

function domainError(message) {
  const error = new Error(message);
  error.status = 400;
  return error;
}

function applyAction(inputStore, input, now = new Date().toISOString()) {
  const store = normalizeStore(inputStore);
  const action = String(input?.action || "");
  const moduleId = cleanModuleId(input?.moduleId);
  if (!moduleId) throw domainError("Ein Modul ist erforderlich.");
  const module = ensureModule(store, moduleId);
  let result = { action, moduleId };

  if (action === "create_chapter") {
    const id = nextId("chapter", module.chapters.map((chapter) => chapter.id));
    const chapter = {
      id,
      title: cleanText(input?.title, `Kapitel ${module.chapters.length + 1}`),
      lessons: [],
    };
    module.chapters.push(chapter);
    result = { ...result, chapter };
  } else if (action === "rename_chapter") {
    const chapter = findChapter(module, cleanText(input?.chapterId));
    if (!chapter) throw domainError("Kapitel wurde nicht gefunden.");
    chapter.title = cleanText(input?.title, chapter.title);
    result = { ...result, chapter };
  } else if (action === "move_chapter") {
    result = {
      ...result,
      changed: moveEntry(module.chapters, cleanText(input?.chapterId), input?.direction),
    };
  } else if (action === "delete_chapter") {
    const chapterId = cleanText(input?.chapterId);
    const assigned = Object.values(module.scene_assignments)
      .some((assignment) => assignment.chapter_id === chapterId);
    if (assigned) throw domainError("Kapitel enthaelt noch zugeordnete Szenen.");
    const index = module.chapters.findIndex((chapter) => chapter.id === chapterId);
    if (index < 0) throw domainError("Kapitel wurde nicht gefunden.");
    module.chapters.splice(index, 1);
  } else if (action === "create_lesson") {
    const chapter = findChapter(module, cleanText(input?.chapterId));
    if (!chapter) throw domainError("Kapitel wurde nicht gefunden.");
    const allLessonIds = module.chapters.flatMap((entry) => entry.lessons.map((lesson) => lesson.id));
    const lesson = {
      id: nextId("lesson", allLessonIds),
      title: cleanText(input?.title, `Lektion ${chapter.lessons.length + 1}`),
    };
    chapter.lessons.push(lesson);
    result = { ...result, chapterId: chapter.id, lesson };
  } else if (action === "rename_lesson") {
    const chapter = findChapter(module, cleanText(input?.chapterId));
    const lesson = findLesson(chapter, cleanText(input?.lessonId));
    if (!lesson) throw domainError("Lektion wurde nicht gefunden.");
    lesson.title = cleanText(input?.title, lesson.title);
    result = { ...result, chapterId: chapter.id, lesson };
  } else if (action === "move_lesson") {
    const chapter = findChapter(module, cleanText(input?.chapterId));
    if (!chapter) throw domainError("Kapitel wurde nicht gefunden.");
    result = {
      ...result,
      chapterId: chapter.id,
      changed: moveEntry(chapter.lessons, cleanText(input?.lessonId), input?.direction),
    };
  } else if (action === "delete_lesson") {
    const chapter = findChapter(module, cleanText(input?.chapterId));
    const lessonId = cleanText(input?.lessonId);
    if (!chapter) throw domainError("Kapitel wurde nicht gefunden.");
    const assigned = Object.values(module.scene_assignments)
      .some((assignment) => assignment.lesson_id === lessonId);
    if (assigned) throw domainError("Lektion enthaelt noch zugeordnete Szenen.");
    const index = chapter.lessons.findIndex((lesson) => lesson.id === lessonId);
    if (index < 0) throw domainError("Lektion wurde nicht gefunden.");
    chapter.lessons.splice(index, 1);
  } else if (action === "assign_scene") {
    const slideId = String(input?.slideId || "");
    if (!slideId.startsWith(`${moduleId}::`)) {
      throw domainError("Szene gehoert nicht zum ausgewaehlten Modul.");
    }
    const chapterId = cleanText(input?.chapterId);
    const lessonId = cleanText(input?.lessonId);
    if (!chapterId && !lessonId) {
      delete module.scene_assignments[slideId];
      result = { ...result, slideId, assignment: null };
    } else {
      const chapter = findChapter(module, chapterId);
      const lesson = findLesson(chapter, lessonId);
      if (!chapter || !lesson) throw domainError("Kapitel oder Lektion wurde nicht gefunden.");
      const assignment = { chapter_id: chapter.id, lesson_id: lesson.id, updated_at: now };
      module.scene_assignments[slideId] = assignment;
      result = { ...result, slideId, assignment };
    }
  } else {
    throw domainError("Unbekannte Trainingsstruktur-Aktion.");
  }

  return { store, result };
}

module.exports = {
  applyAction,
  defaultStore,
  normalizeStore,
  schemaVersion,
};
