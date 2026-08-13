"use strict";

function scene(output, sources, section, title, takeaway, archetype, builder, options = {}) {
  return Object.freeze({
    output_slide_number: output,
    work_unit: `slide_${String(output).padStart(3, "0")}`,
    scene_id: `re3_src_${String(output).padStart(3, "0")}`,
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
  scene(1, [1], "section_001", "Lebensdauerdaten in belastbare Aussagen übersetzen", "Die Lebensdauerdatenanalyse verbindet beobachtete Ausfälle mit statistischen Modellen und Prognosen.", "module-introduction", "intro"),
  scene(2, [2, 3, 4, 5, 6, 7, 8], "section_002", "Von Ausfallzeiten zur Weibull-Prognose", "Sortieren, Median Ranks, Auftragung und Fit führen zu T, b und einer auswertbaren Ausfallwahrscheinlichkeit.", "workflow", "workflow"),
  scene(9, [9, 10], "section_003", "Wenn eine Gerade nicht genügt", "Mehrere Geraden im Weibullnetz weisen auf unterschiedliche Ausfallmechanismen hin.", "diagnostic-comparison", "mechanisms_overview"),
  scene(11, [11, 12], "section_003", "Zensierte Beobachtungen richtig einordnen", "Nicht jedes Bauteil fällt während der Beobachtungszeit aus; zensierte Laufzeiten bleiben dennoch wertvolle Information.", "object-time-diagram", "censored_overview"),
  scene(13, [13], "section_003", "Schätzmethode passend zu den Daten wählen", "Vollständige und zensierte Datensätze stellen unterschiedliche Anforderungen an MLS und MLE.", "method-comparison", "method_choice"),
  scene(14, [14], "section_003", "Punktschätzung plus statistische Sicherheit", "Vertrauensgrenzen zeigen, wie unsicher die aus der Stichprobe abgeleitete Verteilung ist.", "confidence-introduction", "confidence_intro"),
  scene(15, [15, 16], "section_004", "Von der Stichprobe zur Grundgesamtheit", "Eine Stichprobe liefert eine Schätzung; ein Vertrauensbereich beschreibt die plausible Unsicherheit der Grundgesamtheit.", "sample-to-population", "sample_population"),
  scene(17, [17, 18, 19], "section_005", "Was Vertrauensgrenzen bedeuten", "Ein Konfidenzniveau von 95 Prozent bedeutet nicht, dass ein einzelner berechneter Bereich mit 95 Prozent Wahrscheinlichkeit richtig ist.", "confidence-meaning", "confidence_meaning"),
  scene(20, [20, 21, 22], "section_006", "Breite des Vertrauensbereichs verstehen", "Mehr Daten verengen den Bereich; ein höheres Konfidenzniveau verbreitert ihn.", "confidence-drivers", "confidence_drivers"),
  scene(23, [23], "section_007", "Ausfallwahrscheinlichkeit als Verteilung verstehen", "Für jeden Zeitpunkt beschreibt eine Dichteverteilung die Unsicherheit; ihre Mediane bilden gemeinsam die Weibullgerade.", "probability-surface", "probability_surface"),
  scene(24, [24, 25, 26, 27, 28, 29, 30], "section_008", "Zweiseitig, linksseitig oder rechtsseitig", "Die Richtung des Vertrauensintervalls richtet sich nach der fachlichen Fragestellung.", "confidence-types", "confidence_types"),
  scene(31, [31, 32, 33], "section_009", "Lebensdauerdaten entstehen über den Produktlebenszyklus", "Simulation, Versuch und Feld liefern unterschiedliche, aber gemeinsam auswertbare Lebensdauerinformationen.", "lifecycle-sources", "life_data_sources"),
  scene(34, [34], "section_010", "Vollständige Lebensdauerdaten", "Bei vollständigen Daten endet jede Beobachtung mit einem Ausfall.", "object-time-diagram", "complete_data"),
  scene(35, [35], "section_011", "Rechtszensierte Lebensdauerdaten", "Bei rechtszensierten Daten bleibt ein Teil der Objekte bis zum Beobachtungsende funktionsfähig.", "object-time-diagram", "right_censored"),
  scene(36, [36, 37], "section_012", "Typ I und Typ II der Rechtszensierung", "Typ I endet nach einer festen Zeit, Typ II nach einer festgelegten Zahl von Ausfällen.", "censoring-comparison", "censoring_types"),
  scene(38, [38, 39, 40, 41], "section_013", "Multiple Zensierung und konkurrierende Risiken", "Unterschiedliche Eintritts- und Austrittszeitpunkte sowie konkurrierende Mechanismen müssen explizit dokumentiert werden.", "multi-censoring", "multiple_censoring"),
  scene(42, [42], "section_014", "Intervallzensierung", "Der genaue Ausfallzeitpunkt ist unbekannt, liegt aber zwischen zwei Beobachtungen.", "interval-censoring", "interval_censoring"),
  scene(43, [43], "section_015", "MLS und MLE im direkten Vergleich", "MLS ist anschaulich für vollständige Daten; MLE nutzt zensierte Informationen systematisch mit.", "method-comparison", "mls_mle"),
  scene(45, [45, 46], "section_016", "Lösung · Zahnrad-Grübchenversuch", "Sortierte Ausfallzeiten, Median Ranks und Weibull-Fit führen zu einer nachvollziehbaren Parameterschätzung.", "exercise-solution", "exercise_bike_solution", { static: true, notes: "Gelieferter Sprechertext enthält nur 'Text Separat!'; keine Trigger erfinden." }),
  scene(47, [47], "section_016", "Übung 1 · Weibull-Analyse durchführen", "Ausfallzeiten werden in Minitab ausgewertet und anhand der Modellparameter interpretiert.", "exercise", "exercise_one", { static: true, notes: "Gelieferter Sprechertext enthält nur 'Text Separat!'; statischer Arbeitsauftrag." }),
  scene(48, [48, 49], "section_016", "Vertrauensgrenzen im Ergebnis lesen", "Neben der Fit-Gerade sind die Grenzen und ihre fachliche Aussage zu interpretieren.", "exercise-solution", "exercise_confidence", { static: true, notes: "Gelieferter Sprechertext enthält nur 'Text Separat!'; statischer Ergebniszustand." }),
  scene(50, [50], "section_016", "Übung 2 · Wellentest mit Vertrauensbereichen", "Aus acht vollständigen Ausfällen werden b, T, deren Vertrauensbereiche und abgesicherte Lebensdaueraussagen bestimmt.", "exercise", "exercise_two", { static: true, notes: "Gelieferter Sprechertext enthält nur 'Text Separat!'; statischer Arbeitsauftrag." }),
  scene(51, [51], "section_016", "Überblick · Datensätze, Auswertung und Sonderfälle", "Der Themenraum reicht von der Klassifikation der Lebensdauerdaten bis zur kritischen Prüfung besonderer Modellsituationen.", "transition", "exercise_transition", { static: true, notes: "Neutraler Themenüberblick ohne vorweggenommene Kapitel-/Lektionsnummerierung." }),
  scene(52, [52], "section_016", "Typ I und Typ II im Versuch vergleichen", "Feste Prüfzeit und feste Ausfallzahl führen zu unterschiedlichen rechtszensierten Datensätzen.", "exercise-comparison", "exercise_censoring_compare", { static: true }),
  scene(53, [53, 54], "section_016", "Zensierungsart am Versuch erkennen", "Zeitgrenze, Ausfallzahl und Statusspalte entscheiden über die korrekte Datencodierung.", "exercise-solution", "exercise_censoring_example", { static: true }),
  scene(55, [55, 56], "section_016", "Übung 3 · Datensatz und Ergebnis prüfen", "Die Übung führt von der Datencodierung zur kritischen Beurteilung des Weibull-Ergebnisses.", "exercise-solution", "exercise_three", { static: true }),
  scene(57, [57], "section_017", "Von den Übungen zu Sonderfällen", "Nach vollständigen und rechtszensierten Daten folgen typische Stolpersteine der praktischen Auswertung.", "transition", "special_cases_transition"),
  scene(58, [58], "section_018", "Wann ein dritter Weibull-Parameter naheliegt", "Eine deutlich gekrümmte Gerade im Zweiparameter-Weibullnetz kann auf eine ausfallfreie Zeit t₀ hindeuten.", "three-parameter-introduction", "three_parameter_intro"),
  scene(59, [59], "section_018", "Voraussetzungen für die 3-Parameter-Weibullverteilung", "t₀ muss physikalisch begründbar sein; bei Unsicherheit bleibt die Zweiparameter-Verteilung die konservative Wahl.", "decision-checklist", "three_parameter_rules"),
  scene(60, [60, 61, 62], "section_018", "Beispiel · Ausfallfreie Zeit einer Bremsanlage", "Trotz 30 Prüflingen kann der Nachweis einer ausfallfreien Zeit statistisch unsicher bleiben.", "worked-example", "brake_example"),
  scene(63, [63, 64, 65], "section_018", "3-Parameter-Ergebnis kritisch prüfen", "Ein rechnerisch besserer Fit ist wertlos, wenn t₀ negativ, physikalisch unsinnig oder extrem unsicher ist.", "result-challenge", "three_parameter_challenge"),
  scene(66, [66], "section_019", "Zweiter Sonderfall · mehrere Ausfallmechanismen", "Ein sichtbarer Knick im Weibullnetz ist ein Signal, die Mechanismen getrennt zu untersuchen.", "transition", "multiple_modes_transition"),
  scene(67, [67], "section_019", "Mehrere Mechanismen nicht gemeinsam fitten", "Eine gemeinsame Gerade erzeugt ungenaue Parameter und Prognosen, wenn verschiedene Mechanismen vorliegen.", "mechanism-separation", "multiple_modes"),
  scene(68, [68, 69], "section_019", "Übung 4 · Ausfallmechanismen erkennen", "Die Ausfalldaten des Fahrwerks werden auf mehrere plausible Mechanismen und getrennte Fits geprüft.", "exercise", "exercise_four", { static: true, notes: "Der gelieferte Sprechertext leitet nur allgemein zum Beispiel über; für die konkreten Arbeitsschritte werden keine Trigger erfunden." }),
  scene(70, [70, 71, 72], "section_019", "Ausfallmechanismen getrennt auswerten", "Getrennte Weibull-Geraden beschreiben die Mechanismen präziser als ein gemeinsamer Fit.", "mechanism-result", "multiple_modes_result"),
]);

module.exports = Object.freeze({ SCENES, REMOVED_SOURCE_SLIDES: Object.freeze([44]), SOURCE_STATE_COUNT: 72 });
