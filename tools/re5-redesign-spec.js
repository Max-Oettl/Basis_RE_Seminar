"use strict";

function scene(output, sources, section, paragraphs, title, takeaway, archetype, builder, options = {}) {
  return Object.freeze({
    output_slide_number: output,
    work_unit: `slide_${String(output).padStart(3, "0")}`,
    scene_id: `re5_src_${String(output).padStart(3, "0")}`,
    source_slides: Object.freeze([...sources]),
    primary_source_slide: options.primary || sources.at(-1),
    render_source_slide: options.primary || sources.at(-1),
    source_text_section_id: section,
    narration: Object.freeze({
      paragraphs: paragraphs ? Object.freeze([...paragraphs]) : null,
      start_phrase: options.startPhrase || "",
      end_phrase: options.endPhrase || "",
    }),
    title,
    takeaway,
    archetype,
    builder,
    animation_decision: options.static ? "static" : "animated",
    plot_strategy: options.plot || "none",
    formula_strategy: Object.freeze([...(options.formulas || [])]),
    chapter: options.chapter,
    lesson: options.lesson,
    notes: options.notes || "",
  });
}

const SCENES = Object.freeze([
  scene(1, [1], "section_001", [1, 4], "Tests im Zuverlässigkeitsmanagement", "Lebensdauertests sind in Schwachstellenanalyse, Erprobung und formalen Nachweis eingebettet.", "lifecycle-map", "reliability_management", { chapter: 1, lesson: 1 }),
  scene(2, [2], "section_001", [5, 8], "Drei Ziele von Zuverlässigkeitstests", "Tests identifizieren Risiken, messen Zuverlässigkeit oder sichern einen formalen Nachweis ab.", "three-goals", "test_objectives", { chapter: 1, lesson: 1 }),
  scene(3, [3], "section_001", [9, 13], "Testmethoden im Entwicklungsprozess", "Qualitative Tests starten früh; quantitative Messung und Nachweis folgen mit zunehmender Produktreife.", "phase-timeline", "development_timeline", { chapter: 1, lesson: 1 }),

  scene(4, [4], "section_002", [1, 6], "Lebensdauerversuche zweigleisig planen", "Reproduzierbare Versuche verbinden praktische Prüfplanung mit statistischer Auslegung.", "dual-planning", "dual_planning", { chapter: 1, lesson: 2 }),
  scene(5, [5], "section_002", [7, 11], "Teststrategien über drei Entscheidungen wählen", "Testart, Zensierung und Beschleunigung bestimmen gemeinsam die Teststrategie.", "decision-dimensions", "strategy_dimensions", { chapter: 1, lesson: 2 }),
  scene(6, [6], "section_002", [12, 19], "Vom Testziel zur Testkonfiguration", "Die gewählte Strategie wird erst durch Prüflingszahl, Lastniveaus, Prüfdauer und Ablauf ausführbar.", "decision-tree", "strategy_tree", { chapter: 1, lesson: 2 }),

  scene(7, [7], "section_003", [1, 1], "Zuverlässigkeit nachweisen", "Ein Nachweis zeigt, dass die Produktzuverlässigkeit oberhalb der geforderten Grenze liegt.", "definition", "proof_definition", { chapter: 1, lesson: 3, static: true }),
  scene(8, [8, 9], "section_003", [2, 4], "Stichprobe, Weibullgerade und Vertrauensgrenzen", "Erst der Vertrauensbereich überträgt Stichprobenergebnisse belastbar auf die Grundgesamtheit.", "weibull-confidence", "confidence_recap", { chapter: 1, lesson: 3, plot: "weibull_confidence" }),
  scene(10, [10, 11, 12, 13, 14], "section_003", [5, 7], "Den Nachweispunkt im Weibulldiagramm prüfen", "Die Anforderung ist erfüllt, wenn die maßgebliche Vertrauensgrenze rechts vom Zielpunkt liegt.", "proof-plot", "proof_acceptance", { chapter: 1, lesson: 3, plot: "weibull_confidence" }),
  scene(15, [15, 16, 17, 18], "section_003", [8, 13], "Wenn die Anforderung nicht erfüllt ist", "Dann sind nur geringere Zuverlässigkeit, kürzere Lebensdauer oder geringere Aussagesicherheit nachweisbar.", "proof-alternatives", "proof_alternatives", { chapter: 1, lesson: 3, plot: "weibull_confidence" }),

  scene(19, [19, 20], "section_004", [1, 8], "Success Run: Nachweis ohne Ausfall", "Ohne Ausfälle entstehen weder Weibullgerade noch Vertrauensbereich – der Nachweis braucht einen anderen statistischen Weg.", "problem-framing", "success_run_problem", { chapter: 2, lesson: 1, plot: "weibull_confidence" }),
  scene(21, [21], "section_004", [9, 28], "Die Success-Run-Gleichung herleiten", "Die Binomiallogik verknüpft Gruppenüberleben, Irrtumswahrscheinlichkeit und Aussagesicherheit.", "formula-derivation", "success_run_derivation", { chapter: 2, lesson: 1, formulas: ["group_survival", "alpha_relation", "success_run"] }),

  scene(22, [22], "section_005", [1, 8], "Stichprobenumfang berechnen", "Für R(t)=90 % und P_A=95 % werden 29 ausfallfreie Prüflinge benötigt.", "worked-formula", "sample_size_example", { chapter: 2, lesson: 2, formulas: ["sample_size", "sample_size_example"] }),
  scene(23, [23, 24, 25, 26, 27, 28], "section_005", [9, 14], "Anforderungen treiben den Stichprobenumfang", "Schon kleine Steigerungen von Zuverlässigkeit oder Aussagesicherheit erhöhen n deutlich.", "lookup-matrix", "sample_size_table", { chapter: 2, lesson: 2 }),
  scene(29, [29, 30, 31, 32, 33], "section_005", [15, 19], "Stichprobengröße und Mindestzuverlässigkeit", "Mehr Prüflinge erhöhen den möglichen Nachweis; höhere Aussagesicherheit verschiebt die Kurve nach rechts.", "technical-plot", "success_run_curves", { chapter: 2, lesson: 2, plot: "success_run_curves" }),

  scene(34, [34, 35], "section_006", [1, 5], "Prüfzeit und geforderte Lebensdauer unterscheiden", "Weicht die Prüfzeit von der Zielzeit ab, muss die Success-Run-Gleichung korrigiert werden.", "formula-framing", "duration_ratio_intro", { chapter: 2, lesson: 3, static: true, formulas: ["duration_ratio"] }),
  scene(36, [36], "section_006", [6, 10], "Warum der Formparameter b zählt", "Die Weibullform bestimmt, wie sich Überlebenswahrscheinlichkeiten zwischen zwei Zeiten verändern.", "weibull-relation", "duration_weibull_relation", { chapter: 2, lesson: 3, plot: "weibull_probability", formulas: ["survival_ratio"] }),
  scene(37, [37, 38, 39, 40], "section_006", [11, 15], "Success Run für abweichende Prüfzeiten", "Längere Prüfzeiten senken n, kürzere erhöhen n; dafür muss b belastbar geschätzt werden.", "formula-comparison", "duration_adjusted_success_run", { chapter: 2, lesson: 3, formulas: ["duration_adjusted_success_run"] }),

  scene(41, [41, 42, 43], "section_007", [1, 2], "End-of-Life-Test bis zum Ausfall", "Echte Ausfalldaten ermöglichen die Weibullanalyse, können bei langlebigen Produkten aber unpraktisch lange dauern.", "evidence-loop", "end_of_life", { chapter: 3, lesson: 1, plot: "weibull_confidence" }),
  scene(44, [44, 45], "section_007", [3, 3], "Beschleunigte Erprobung verkürzt Lebensdauer", "Höhere Schädigung pro Zeiteinheit spart Prüfzeit und macht frühere Aussagen möglich.", "cause-effect", "acceleration_principle", { chapter: 3, lesson: 1 }),
  scene(46, [46, 47, 48], "section_007", [4, 7], "Drei Wege zur kürzeren Prüfzeit", "Zeitliche Raffung, höheres Lastniveau und Zensierung verkürzen Tests auf unterschiedliche Weise.", "method-matrix", "acceleration_methods", { chapter: 3, lesson: 1 }),
  scene(49, [49, 50], "section_007", [8, 9], "Degradation bis zum End-of-Life-Kriterium", "Messbare Degradationspfade liefern geschätzte Ausfallzeiten und daraus eine Lebensdauerverteilung.", "degradation-plot", "degradation_paths", { chapter: 3, lesson: 1, plot: "degradation_paths" }),
  scene(51, [51, 52, 53], "section_007", [10, 11], "Raffungsfaktor: Versuch auf Feld übertragen", "Übertragbar ist die Raffung nur bei gleichem Ausfallmechanismus und gleichem Formparameter.", "acceleration-factor", "acceleration_factor", { chapter: 3, lesson: 1, plot: "acceleration_factor", formulas: ["acceleration_factor"] }),
  scene(54, [54], "section_007", [12, 14], "Raffungsfaktor aus Last und Lebensdauer", "Nur ein belastbares Last-Lebensdauer-Modell erlaubt die sichere Extrapolation auf das Feld.", "model-map", "load_life_models", { chapter: 3, lesson: 1, plot: "load_life_correlation" }),

  scene(55, [55, 56, 57, 58, 59, 60, 61], "section_008", [1, 6], "Vier Fragen der beschleunigten Erprobung", "Niveauanzahl, Niveaulage, Verteilung und Gesamtzahl bestimmen Aufwand und Aussagekraft.", "question-framework", "alt_questions", { chapter: 3, lesson: 2, plot: "test_level_overview" }),
  scene(62, [62], "section_008", [7, 7], "Zwei oder drei Versuchsniveaus?", "Zwei Niveaus prüfen Linearität; ein drittes Niveau macht Krümmung sichtbar.", "technical-plot", "number_of_levels", { chapter: 3, lesson: 2, plot: "number_of_levels" }),
  scene(63, [63, 64], "section_008", null, "Das obere Versuchsniveau festlegen", "So hoch wie möglich – aber unterhalb der Grenze, an der sich der Ausfallmechanismus ändert.", "technical-plot", "upper_test_level", {
    chapter: 3,
    lesson: 2,
    plot: "upper_test_level",
    startPhrase: "Als nächstes schauen wir uns die Lage der Versuchsniveaus an.",
    endPhrase: "In der Regel braucht man dazu Vorversuche, um die maximal mögliche Beschleunigung abzuschätzen.",
  }),
  scene(65, [65, 66, 67], "section_008", null, "Das untere Versuchsniveau abwägen", "Nähe zum Feld erhöht Prognosegüte; Nähe zum oberen Niveau verkürzt die Laufzeit.", "tradeoff-plot", "lower_test_level", {
    chapter: 3,
    lesson: 2,
    plot: "lower_test_level",
    startPhrase: "Das untere Versuchsniveau ist dagegen ein Kompromiss:",
    endPhrase: "In der Praxis haben sich Raffungsfaktoren im Bereich von zwei bis drei bewährt – höhere Werte führen häufig zu einer zu großen Streuung.",
  }),
  scene(68, [68, 69, 70], "section_008", [9, 15], "Prüflinge auf Versuchsniveaus verteilen", "Das untere Niveau erhält mehr Prüflinge, damit die Extrapolation zum Feld präziser wird.", "allocation-formula", "sample_allocation", { chapter: 3, lesson: 2, plot: "sample_allocation", formulas: ["extrapolation_factor", "allocation_share"] }),
  scene(71, [71], "section_008", [16, 20], "Beispiel: 20 Prüflinge aufteilen", "Bei 180 °C, 220 °C und 260 °C gehen 14 Prüflinge auf das untere und 6 auf das obere Niveau.", "worked-allocation", "allocation_example", { chapter: 3, lesson: 2, plot: "sample_allocation", formulas: ["extrapolation_example", "allocation_example"] }),
  scene(72, [72, 73], "section_008", [21, 25], "Gesamtzahl per Monte-Carlo-Simulation festlegen", "Simulationen balancieren Prognosegenauigkeit und Versuchsaufwand.", "simulation-plot", "total_sample_size", { chapter: 3, lesson: 2, plot: "monte_carlo_precision" }),

  scene(74, [74], "section_009", [1, 12], "Vier Teststrategien im Vergleich", "Teststrategie, Testebene, Lasten, Ergebnis und Planungsaufwand müssen zusammenpassen.", "comparison-matrix", "strategy_comparison", { chapter: 3, lesson: 3 }),
  scene(75, [75], "section_009", [13, 16], "Guideline zur Testauswahl", "Dimensionierung, messbarer Verschleiß und mögliche Raffung führen zur passenden Teststrategie.", "decision-tree", "strategy_guideline", { chapter: 3, lesson: 3 }),
]);

module.exports = Object.freeze({
  SCENES,
  SOURCE_STATE_COUNT: 75,
  REFERENCE_LOCK: Object.freeze([
    "RE4::1",
    "RE4::13",
    "RE4::48",
    "RE4::65",
  ]),
});
