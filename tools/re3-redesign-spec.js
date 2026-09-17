"use strict";

const SOURCE_TITLES = Object.freeze({
  1: "Einführung in die Lebensdatenanalyse",
  2: "Allgemeines Vorgehen in der Lebensdatenanalyse",
  9: "Allgemeines Vorgehen in der Lebensdatenanalyse",
  11: "Allgemeines Vorgehen in der Lebensdatenanalyse",
  13: "Allgemeines Vorgehen in der Lebensdatenanalyse",
  14: "Allgemeines Vorgehen in der Lebensdatenanalyse",
  15: "Von der Stichprobe zur Grundgesamtheit",
  17: "Was bedeutet der Vertrauensbereich?",
  20: "Was bedeutet das für unsere Auswertung?",
  23: "Dichtefunktion der Ausfallwahrscheinlichkeiten",
  24: "Arten von Vertrauensbereichen",
  27: "Linksseitiger Vertrauensbereich",
  29: "Rechtsseitiger Vertrauensbereich",
  31: "Lebensdauerdaten aus Versuch und Feld",
  34: "Arten der Zensierung · Vollständige Daten",
  35: "Arten der Zensierung · Rechtszensierung",
  36: "Arten der Zensierung · Typ I und Typ II",
  38: "Arten der Zensierung · Multiple Zensierung",
  39: "Konkurrierende Ausfallmechanismen",
  42: "Arten der Zensierung · Intervallzensierung",
  43: "MLS vs. MLE",
  44: "Übung: Zahnrad-Grübchenversuch",
  45: "Lösung: Median Ranks",
  46: "Lösung: Weibull-Fit",
  47: "Übung 1: Probe",
  48: "Vertrauensgrenzen richtig einordnen",
  49: "Lösung: Konfidenzintervalle",
  50: "Übung 2: Wellentest (Vertrauensbereiche)",
  51: "Scope",
  52: "Zensierung Typ I und Typ II",
  53: "Beispiel: Zensierung Typ I oder Typ II",
  55: "Test Results · Censoring",
  56: "Übung: Suspensionen berücksichtigen",
  57: "Scope",
  58: "3-Parameter-Weibull",
  59: "Voraussetzungen für Anwendung",
  60: "Auswertung der Lebensdauerdaten",
  61: "Stichprobenumfang und Auswertung",
  62: "Ergebnis: Kein Nachweis für t₀",
  63: "Berücksichtigung von Vertrauensbereichen",
  64: "Negativer Schwellenwert",
  65: "Konfidenzgrenzen und Medianwerte",
  66: "Scope",
  67: "Multiple Failure Modes",
  68: "Übung: Zapfluftsystem eines US-Kampfjets",
  70: "Schlussfolgerungen",
  71: "Separate Datenanalyse",
  72: "Ergebnisse und Maßnahmen",
});

const STRUCTURE_STATUS = "mapped_from_user_source_svg_ranges";

// The user supplied the chapter/lesson boundaries using the legacy RE3 source
// SVG numbers. For chapter 5 the confirmed lesson content is intentionally
// narrower than the archived source-state run: lesson 1 uses source slides
// 58–59, lesson 2 uses source slide 67.
const SOURCE_STRUCTURE_SEGMENTS = Object.freeze([
  Object.freeze({ start: 1, end: 8, chapter: 1, lesson: 1, chapter_id: "chapter_001", lesson_id: "lesson_001", basis: "user_range_1_8" }),
  Object.freeze({ start: 9, end: 14, chapter: 1, lesson: 2, chapter_id: "chapter_001", lesson_id: "lesson_002", basis: "user_range_9_14" }),
  Object.freeze({ start: 15, end: 22, chapter: 1, lesson: 3, chapter_id: "chapter_001", lesson_id: "lesson_003", basis: "user_range_15_22" }),
  Object.freeze({ start: 23, end: 30, chapter: 1, lesson: 4, chapter_id: "chapter_001", lesson_id: "lesson_004", basis: "user_range_23_30" }),
  Object.freeze({ start: 31, end: 33, chapter: 2, lesson: 1, chapter_id: "chapter_002", lesson_id: "lesson_005", basis: "user_range_31_32_plus_shared_build_state_33" }),
  Object.freeze({ start: 34, end: 42, chapter: 2, lesson: 2, chapter_id: "chapter_002", lesson_id: "lesson_006", basis: "user_range_34_42" }),
  Object.freeze({ start: 43, end: 43, chapter: 3, lesson: 1, chapter_id: "chapter_003", lesson_id: "lesson_007", basis: "user_range_43" }),
  Object.freeze({ start: 44, end: 57, chapter: 4, lesson: 1, chapter_id: "chapter_004", lesson_id: "lesson_008", basis: "user_exercise_chapter_plus_source_exercise_sequence_44_57" }),
  Object.freeze({ start: 58, end: 59, chapter: 5, lesson: 1, chapter_id: "chapter_005", lesson_id: "lesson_009", basis: "user_confirmed_chapter_5_lesson_1_sources_58_59" }),
  Object.freeze({ start: 67, end: 67, chapter: 5, lesson: 2, chapter_id: "chapter_005", lesson_id: "lesson_010", basis: "user_confirmed_chapter_5_lesson_2_source_67" }),
]);

const TRAINING_STRUCTURE = Object.freeze([
  Object.freeze({ id: "chapter_001", title: "Kapitel 1", lessons: Object.freeze([
    Object.freeze({ id: "lesson_001", title: "Lektion 1" }),
    Object.freeze({ id: "lesson_002", title: "Lektion 2" }),
    Object.freeze({ id: "lesson_003", title: "Lektion 3" }),
    Object.freeze({ id: "lesson_004", title: "Lektion 4" }),
  ]) }),
  Object.freeze({ id: "chapter_002", title: "Kapitel 2", lessons: Object.freeze([
    Object.freeze({ id: "lesson_005", title: "Lektion 1" }),
    Object.freeze({ id: "lesson_006", title: "Lektion 2" }),
  ]) }),
  Object.freeze({ id: "chapter_003", title: "Kapitel 3", lessons: Object.freeze([
    Object.freeze({ id: "lesson_007", title: "Lektion 1" }),
  ]) }),
  Object.freeze({ id: "chapter_004", title: "Kapitel 4", lessons: Object.freeze([
    Object.freeze({ id: "lesson_008", title: "Übung" }),
  ]) }),
  Object.freeze({ id: "chapter_005", title: "Kapitel 5", lessons: Object.freeze([
    Object.freeze({ id: "lesson_009", title: "Lektion 1" }),
    Object.freeze({ id: "lesson_010", title: "Lektion 2" }),
  ]) }),
]);

function structureForSource(sourceSlideNumber) {
  const placement = SOURCE_STRUCTURE_SEGMENTS.find(({ start, end }) => sourceSlideNumber >= start && sourceSlideNumber <= end);
  if (!placement) throw new Error(`Keine RE3-Strukturzuordnung für Quellfolie ${sourceSlideNumber}.`);
  return placement;
}

function scene(output, sources, section, title, takeaway, archetype, builder, options = {}) {
  const structuralSource = options.structure_source || options.primary || sources.at(-1);
  const placement = structureForSource(structuralSource);
  return Object.freeze({
    output_slide_number: output,
    work_unit: `slide_${String(output).padStart(3, "0")}`,
    scene_id: `re3_src_${String(output).padStart(3, "0")}`,
    source_slides: Object.freeze([...sources]),
    primary_source_slide: options.primary || sources.at(-1) || null,
    render_source_slide: options.render_source || options.primary || sources.at(-1) || null,
    narration_source_slide: options.narration_source || options.primary || sources.at(-1) || null,
    structure_source_slide: structuralSource,
    chapter: placement.chapter,
    lesson: placement.lesson,
    chapter_id: placement.chapter_id,
    lesson_id: placement.lesson_id,
    source_text_section_id: section,
    title: options.title_override || SOURCE_TITLES[output] || title,
    takeaway,
    archetype,
    builder,
    animation_decision: options.static ? "static" : "animated",
    narration_paragraphs: options.narration_paragraphs ? Object.freeze([...options.narration_paragraphs]) : undefined,
    narration_mode: options.narration_mode || "source",
    notes: options.notes || "",
  });
}

const SCENES = Object.freeze([
  scene(1, [1], "section_001", "Lebensdauerdaten in belastbare Aussagen übersetzen", "Die Lebensdauerdatenanalyse verbindet beobachtete Ausfälle mit statistischen Modellen und Prognosen.", "module-introduction", "intro"),
  scene(2, [2, 3, 4, 5, 6, 7, 8], "section_002", "Von Ausfallzeiten zur Weibull-Prognose", "Sortieren, Median Ranks, Auftragung und Fit führen zu T, b und einer auswertbaren Ausfallwahrscheinlichkeit.", "workflow", "workflow"),
  scene(9, [9, 10], "section_003", "Wenn eine Gerade nicht genügt", "Mechanismen werden getrennt ausgewertet und anschließend zur Gesamtzuverlässigkeit zusammengeführt.", "diagnostic-comparison", "mechanisms_overview", { narration_paragraphs: [0, 1, 2] }),
  scene(11, [11, 12], "section_003", "Zensierte Beobachtungen richtig einordnen", "Nicht jedes Bauteil fällt während der Beobachtungszeit aus; zensierte Laufzeiten bleiben dennoch wertvolle Information.", "object-time-diagram", "censored_overview", { narration_paragraphs: [3, 4] }),
  scene(13, [13], "section_003", "Schätzmethode passend zu den Daten wählen", "Die grafische Methode ist anschaulich; MLS und MLE liefern genauere Berechnungen, verlangen aber eine bewusste Methodenwahl.", "method-comparison", "method_choice", { narration_paragraphs: [5, 6, 7, 8] }),
  scene(14, [14], "section_003", "Punktschätzung plus statistische Sicherheit", "Vertrauensgrenzen zeigen, wie unsicher die aus der Stichprobe abgeleitete Verteilung ist.", "confidence-introduction", "confidence_intro", { narration_paragraphs: [9, 10, 11] }),
  scene(15, [15, 16], "section_004", "Von der Stichprobe zur Grundgesamtheit", "Eine Stichprobe liefert eine Schätzung; ein Vertrauensbereich beschreibt die plausible Unsicherheit der Grundgesamtheit.", "sample-to-population", "sample_population"),
  scene(17, [17, 18, 19], "section_005", "Was Vertrauensgrenzen bedeuten", "Ein Konfidenzniveau von 95 Prozent bedeutet nicht, dass ein einzelner berechneter Bereich mit 95 Prozent Wahrscheinlichkeit richtig ist.", "confidence-meaning", "confidence_meaning"),
  scene(20, [20, 21, 22], "section_006", "Breite des Vertrauensbereichs verstehen", "Mehr Daten verengen den Bereich; ein höheres Konfidenzniveau verbreitert ihn.", "confidence-drivers", "confidence_drivers"),
  scene(23, [23], "section_007", "Ausfallwahrscheinlichkeit als Verteilung verstehen", "Für jeden Zeitpunkt beschreibt eine Dichteverteilung die Unsicherheit; ihre Mediane bilden gemeinsam die Weibullgerade.", "probability-surface", "probability_surface"),
  scene(24, [24, 25, 26], "section_008", "Zweiseitiger Vertrauensbereich", "Ein zweiseitiger 90-%-Vertrauensbereich wird durch die 5-%- und 95-%-Grenze eingeschlossen.", "confidence-type", "confidence_two_sided", { narration_paragraphs: [0] }),
  scene(27, [27, 28], "section_008", "Linksseitiger Vertrauensbereich", "Die obere 90-%-Grenze sichert eine maximale Ausfallwahrscheinlichkeit ab; zum Vergleich bleibt die zweiseitige 5-%-/95-%-Logik sichtbar.", "confidence-type", "confidence_left_sided", { narration_paragraphs: [1, 2, 3, 4] }),
  scene(29, [29, 30], "section_008", "Rechtsseitiger Vertrauensbereich", "Die untere 10-%-Grenze weist eine minimale Ausfallwahrscheinlichkeit nach; fachlich nützlicher ist oft die untere Zuverlässigkeitsgrenze.", "confidence-type", "confidence_right_sided", { narration_paragraphs: [5, 6, 7, 8, 9, 10] }),
  scene(31, [31, 32, 33], "section_009", "Lebensdauerdaten entstehen über den Produktlebenszyklus", "Die Datenherkunft bestimmt Unsicherheit, Repräsentativität und Übertragbarkeit der Auswertung.", "lifecycle-sources", "life_data_sources"),
  scene(34, [34], "section_010", "Vollständige Lebensdauerdaten", "Bei vollständigen Daten endet jede Beobachtung mit einem Ausfall.", "object-time-diagram", "complete_data"),
  scene(35, [35], "section_011", "Rechtszensierte Lebensdauerdaten", "Bei rechtszensierten Daten bleibt ein Teil der Objekte bis zum Beobachtungsende funktionsfähig.", "object-time-diagram", "right_censored"),
  scene(36, [36, 37], "section_012", "Typ I und Typ II der Rechtszensierung", "Typ I endet nach einer festen Zeit, Typ II nach einer festgelegten Zahl von Ausfällen.", "censoring-comparison", "censoring_types"),
  scene(38, [38], "section_013", "Multiple Zensierung", "Bei multipler Zensierung endet die Beobachtung intakter Objekte zu unterschiedlichen, zufälligen Zeitpunkten.", "multi-censoring", "multiple_censoring", { narration_paragraphs: [0] }),
  scene(39, [39, 40, 41], "section_013", "Konkurrierende Ausfallmechanismen auswerten", "Für die Analyse eines Mechanismus werden Ausfälle durch den jeweils anderen Mechanismus als Zensierungen behandelt.", "competing-risks", "competing_risks", { narration_paragraphs: [1] }),
  scene(42, [42], "section_014", "Intervallzensierung", "Der genaue Ausfallzeitpunkt ist unbekannt, liegt aber zwischen zwei Beobachtungen.", "interval-censoring", "interval_censoring"),
  scene(43, [43], "section_015", "MLS und MLE im direkten Vergleich", "MLS ist anschaulich für vollständige Daten; MLE nutzt zensierte Informationen systematisch mit.", "method-comparison", "mls_mle"),
  scene(44, [44], "section_016", "Übung · Zahnrad-Grübchenversuch", "Aus zehn beobachteten Grübchenausfällen ist eine Weibullverteilung zu bestimmen.", "exercise", "gear_case", { static: true, notes: "Fachliche Aufgabe der Quellfolie wiederhergestellt; gelbe Produktionsnotizen entfallen." }),
  scene(45, [45], "section_016", "Lösung · Median Ranks", "Sortierte Ausfallzeiten und ihre Median Ranks bilden die vollständige Grundlage für den Fit.", "exercise-solution", "gear_median_ranks", { static: true }),
  scene(46, [46], "section_016", "Lösung · Weibull-Fit", "Die Median-Rank-Punkte werden gefittet und liefern Formparameter sowie charakteristische Lebensdauer.", "exercise-solution", "gear_fit", { static: true }),
  scene(47, [47], "section_016", "Übung 1 · Probe", "Aus 20 Wellen-Ausfällen werden b, T, B₁₀, B₅ und die Zuverlässigkeit bei 50.000 Lastwechseln bestimmt.", "exercise", "exercise_one", { static: true, notes: "Vollständige Datenreihe und alle Arbeitsaufträge der Quellfolie wiederhergestellt." }),
  scene(48, [48], "section_016", "Konfidenz statt nur Median-Fit", "Ein Median-Fit allein sichert die Aussage nicht ab; konservative Grenzen müssen mitgelesen werden.", "confidence-repetition", "confidence_repetition", { static: true }),
  scene(49, [49], "section_016", "Lösung · Konfidenzintervalle", "Form- und Skalenparameter werden mit Schätzwert, Standardfehler und 90-%-Intervall berichtet.", "exercise-solution", "gear_confidence_result", { static: true }),
  scene(50, [50], "section_016", "Übung 2 · Wellentest mit Vertrauensbereichen", "Aus acht vollständigen Ausfällen werden b, T, deren Vertrauensbereiche und abgesicherte Lebensdaueraussagen bestimmt.", "exercise", "exercise_two", { static: true, notes: "Gelieferter Sprechertext enthält nur 'Text Separat!'; statischer Arbeitsauftrag." }),
  scene(51, [51], "section_016", "Überblick · Datensätze, Auswertung und Sonderfälle", "Der Themenraum reicht von der Klassifikation der Lebensdauerdaten bis zur kritischen Prüfung besonderer Modellsituationen.", "transition", "exercise_transition", { static: true, notes: "Neutraler Themenüberblick ohne vorweggenommene Kapitel-/Lektionsnummerierung." }),
  scene(52, [52], "section_016", "Typ I und Typ II im Versuch vergleichen", "Feste Prüfzeit und feste Ausfallzahl führen zu unterschiedlichen rechtszensierten Datensätzen.", "exercise-comparison", "exercise_censoring_compare", { static: true }),
  scene(53, [53, 54], "section_016", "Zensierungsart am Versuch erkennen", "Zeitgrenze, Ausfallzahl und Statusspalte entscheiden über die korrekte Datencodierung.", "exercise-solution", "exercise_censoring_example", { static: true }),
  scene(55, [55], "section_016", "Extrapolation kritisch erkennen", "Wenige frühe Ausfälle und viele späte Suspensionen erzeugen einen großen Extrapolationsbereich.", "diagnostic", "exercise_extrapolation", { static: true }),
  scene(56, [56], "section_016", "Übung 3 · Suspensionen berücksichtigen", "Die Auswertung nur der Ausfälle wird mit der korrekten Auswertung inklusive zwölf Suspensionen verglichen.", "exercise", "exercise_three_dataset", { static: true }),
  scene(57, [57], "section_017", "Von den Übungen zu Sonderfällen", "Nach vollständigen und rechtszensierten Daten folgen typische Stolpersteine der praktischen Auswertung.", "transition", "special_cases_transition"),
  scene(58, [58], "section_018", "3-Parameter-Weibull erkennen und auswählen", "Ein gekrümmter Verlauf im Zweiparameter-Weibullnetz ist ein Hinweis, das Drei-Parameter-Modell gezielt zu prüfen.", "three-parameter-selection", "three_parameter_select", { narration_paragraphs: [0, 1, 2], title_override: "3-Parameter-Weibull erkennen und auswählen" }),
  scene(59, [], "section_018", "Schwellenwert interpretieren und plausibilisieren", "Der Schwellenwert beschreibt eine ausfallfreie Zeit; ein negativer Wert ist physikalisch nicht sinnvoll und verlangt eine Stichprobenprüfung.", "parameter-interpretation", "three_parameter_interpret", { narration_source: 58, render_source: 58, structure_source: 58, narration_paragraphs: [3, 4, 5, 6, 7], title_override: "Schwellenwert interpretieren und plausibilisieren", notes: "Zusätzliche Zielszene zur lesbaren Trennung der bestätigten Inhalte aus Quellfolie 58." }),
  scene(60, [59], "section_018", "Voraussetzungen für die Anwendung", "Die Drei-Parameter-Weibullverteilung setzt eine begründbare ausfallfreie Zeit, einen konkaven Verlauf und eine große Stichprobe voraus.", "decision-checklist", "three_parameter_rules", { narration_paragraphs: [8, 9, 10, 11, 12, 13], title_override: "Voraussetzungen für die Anwendung" }),
  scene(67, [67], "section_019", "Mehrere Ausfallmechanismen", "Unterschiedliche Ausfallmechanismen müssen getrennt ausgewertet werden; ein eigener Weibull-Fit je Mechanismus verbessert die Prognose.", "mechanism-separation", "multiple_modes", { narration_paragraphs: [0, 1, 2, 3, 4, 5, 6, 7], title_override: "Mehrere Ausfallmechanismen" }),
]);

module.exports = Object.freeze({
  SCENES,
  REMOVED_SOURCE_SLIDES: Object.freeze([60, 61, 62, 63, 64, 65, 66, 68, 69, 70, 71, 72]),
  SOURCE_STATE_COUNT: 72,
  SOURCE_STRUCTURE_SEGMENTS,
  STRUCTURE_STATUS,
  TRAINING_STRUCTURE,
  structureForSource,
});
