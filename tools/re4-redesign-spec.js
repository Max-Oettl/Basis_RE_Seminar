"use strict";

function scene(output, sources, section, title, takeaway, archetype, builder, options = {}) {
  return Object.freeze({
    output_slide_number: output,
    work_unit: `slide_${String(output).padStart(3, "0")}`,
    scene_id: `re4_src_${String(output).padStart(3, "0")}`,
    source_slides: Object.freeze([...sources]),
    primary_source_slide: options.primary || sources.at(-1),
    render_source_slide: options.primary || sources.at(-1),
    source_text_section_id: section,
    title,
    takeaway,
    archetype,
    builder,
    animation_decision: options.static ? "static" : "animated",
    notes: options.notes || "",
  });
}

const SCENES = Object.freeze([
  scene(1, [1, 2, 3, 4], "section_001", "Vom Fahrzeug zur Komponente", "Systemzuverlässigkeit entsteht aus Funktionen, Teilsystemen und den zugehörigen Ausfallursachen.", "system-hierarchy", "system_hierarchy"),
  scene(5, [5, 6], "section_001", "Vom Wöhlertest zur Zahnradzuverlässigkeit", "Versuchsdaten werden als Weibull-Modell ausgewertet und mit einem Vertrauensbereich abgesichert.", "evidence-pipeline", "gear_weibull"),
  scene(7, [7, 8, 9, 10, 11, 12], "section_001", "Zuverlässigkeit über Systemebenen verknüpfen", "Komponentenzuverlässigkeiten werden zu Getriebe-, Teilsystem- und Fahrzeugzuverlässigkeit verknüpft.", "aggregation-hierarchy", "reliability_aggregation"),
  scene(13, [13, 14, 15, 16], "section_002", "Quantitative FTA systematisch aufbauen", "Die quantitative FTA führt in sechs Schritten vom Systemverständnis zur Gesamtbewertung.", "workflow-tree", "fta_workflow"),
  scene(17, [17, 18, 19, 20], "section_003", "Basisereignisse quantitativ bewerten", "Für jedes Basisereignis wird eine Ausfallwahrscheinlichkeit aus belastbaren Datenquellen bestimmt.", "tree-evidence", "basis_probabilities"),
  scene(21, [21, 22], "section_004", "Vom Fehlerbaum zur Gesamtwahrscheinlichkeit", "Die quantitative Bewertung verknüpft die Basisereignisse entlang der Fehlerlogik zum Top-Ereignis.", "tree-calculation", "quantitative_tree"),
  scene(23, [23, 24], "section_004", "Fehlerlogik in Funktionslogik umkehren", "Beim Wechsel vom Fehler- zum Funktionsbaum werden Ereignisse und Gatter systematisch invertiert.", "logic-comparison", "logic_inversion"),
  scene(25, [25, 26, 27, 28, 29, 30], "section_004", "Vom Funktionsbaum zum Blockdiagramm", "Der Funktionsbaum wird in ein boolesches Zuverlässigkeitsblockdiagramm übersetzt.", "logic-to-rbd", "tree_to_rbd"),
  scene(31, [31, 32], "section_005", "Das Zuverlässigkeitsblockdiagramm lesen", "Blöcke repräsentieren Komponenten; Verbindungen bilden die für die Systemfunktion nötigen Pfade ab.", "rbd-introduction", "rbd_intro"),
  scene(33, [33, 34, 35, 36, 37, 38], "section_005", "Serie und Parallelität unterscheiden", "In Serie müssen alle Komponenten funktionieren; parallel genügt mindestens ein funktionsfähiger Pfad.", "rbd-comparison", "series_parallel_behavior"),
  scene(39, [39, 40], "section_005", "Systemzuverlässigkeit berechnen", "Die Serien- und Parallelformeln führen bei gleichen Komponenten zu sehr unterschiedlichen Systemwerten.", "formula-comparison", "series_parallel_math"),
  scene(41, [41, 42, 43], "section_005", "Gemischte Strukturen schrittweise reduzieren", "Gemischte Systeme werden zuerst in Teilstrukturen reduziert und anschließend insgesamt berechnet.", "worked-reduction", "mixed_reduction"),
  scene(44, [44, 45, 46, 47], "section_005", "FTA, Funktionsbaum und RBD zusammenführen", "Fehlerbaum, Funktionsbaum und Blockdiagramm sind drei konsistente Sichten derselben Systemlogik.", "cross-model-map", "fta_function_rbd"),
  scene(48, [48, 49, 50, 51, 52], "section_006", "Voraussetzungen des booleschen Modells", "Boolesche Blockdiagramme setzen binäre Zustände, nicht reparierbare und unabhängige Komponenten voraus.", "assumption-checklist", "boolean_prerequisites", { notes: "Review-Korrektur: Die Fünf-Komponenten-Brücke bleibt groß und quellengetreu; Komponente 5 liegt vertikal zwischen den mittleren Knoten." }),
  scene(54, [54], "section_006", "Boolesche Zustände eindeutig codieren", "Die positive Logik codiert funktionsfähig mit 1 und ausgefallen mit 0.", "definition", "boolean_states", { static: true, notes: "Die Definition ist in der Quelle vorhanden, wird aber im gelieferten Sprechertext nicht als eigener Aufbau erklärt." }),
  scene(55, [55, 56, 57, 58, 59, 60], "section_007", "Brückenschaltung durch Separation lösen", "Die Separation zerlegt die Brücke nach dem Zustand einer ausgewählten Komponente in zwei berechenbare Fälle.", "worked-method", "bridge_separation", { notes: "Review-Korrektur: Originalbrücke und beide separierten Ersatzstrukturen verwenden eine einheitliche, bei 960x540 lesbare RBD-Geometrie." }),
  scene(61, [61], "section_007", "Methoden zur Systemzuverlässigkeit einordnen", "Einfache boolesche Systeme, reparierbare Systeme und komplexe Modelle benötigen unterschiedliche Berechnungsmethoden.", "method-map", "method_overview", { static: true, notes: "Methodenübersicht ohne eigenen belastbaren Sprechertext-Trigger." }),
  scene(62, [62], "section_007", "Boolesche Modellannahmen im Überblick", "Die drei Kernannahmen bilden den Prüfrahmen vor jeder booleschen Berechnung.", "assumption-summary", "boolean_summary", { static: true, notes: "Wiederholung als statische Referenzszene ohne erfundene Trigger." }),
  scene(63, [63, 64], "section_007", "Grundstrukturen sicher anwenden", "Serien-, Parallel- und Mischstrukturen lassen sich mit einem einheitlichen Formelbaukasten auswerten.", "formula-reference", "structure_reference", { static: true, notes: "Formelreferenz und Zahlenbeispiel sind nicht eigenständig eingesprochen." }),
  scene(65, [65], "section_007", "Viele Komponenten senken die Systemzuverlässigkeit", "Bei einer Serienstruktur fällt die Systemzuverlässigkeit mit jeder zusätzlichen Komponente – besonders bei geringerer Einzelzuverlässigkeit.", "technical-plot", "component_count_plot", { static: true, notes: "Das technische Diagramm wird als statische Referenz gezeigt; kein separater Sprechertext-Trigger." }),
  scene(66, [66, 67], "section_007", "Vom technischen System zum RBD", "Konstruktion und Funktionsstruktur werden schrittweise in ein Zuverlässigkeitsblockdiagramm überführt.", "application-transfer", "freewheel_transfer", { static: true, notes: "Beispiel und Arbeitsauftrag sind nicht im gelieferten Sprechertext ausformuliert." }),
  scene(68, [68], "section_007", "Übung · Systemfunktionen aus Blockdiagrammen", "Fünf Netzwerke werden in Systemzuverlässigkeitsfunktionen übersetzt und bei R_K(t)=0,9 bewertet.", "exercise", "network_exercise", { static: true, notes: "Statischer Arbeitsauftrag; keine Animationszeitpunkte erfinden." }),
]);

module.exports = Object.freeze({
  SCENES,
  REMOVED_SOURCE_SLIDES: Object.freeze([53]),
  SOURCE_STATE_COUNT: 68,
});
