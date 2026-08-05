# Scene Planning Workflow

Nutze diesen Workflow vor jeder SVG-Komposition oder groesseren SVG-Korrektur.

Vor diesem Szenenbrief muss fuer das Modul der Sequenz-Preflight aus `workflow/20-scene-planning/preflight-sequence-planning.md` vorliegen. Der Szenenbrief fuer eine einzelne Arbeitseinheit darf nicht isoliert aus einer Folie entstehen, sondern muss sich auf die dort dokumentierte Sequenzgruppe, Abhaengigkeiten, Animationen und Uebergaenge beziehen.

## Ziel

Eine Szene wird aus vorhandenen Quell-SVGs abgeleitet, nicht frei erfunden. Die Quell-SVGs sind Inhalts- und Geometrieanker; die neue SVG-Szene darf strukturell sauberer, didaktisch klarer und animierbar sein.

Didaktisch klarer bedeutet nicht kuerzer im fachlichen Sinn. Die neue Szene uebernimmt den gesamten fachlich relevanten Quellinhalt und strukturiert ihn besser. Die Informationsdichte orientiert sich an den Quell-SVGs; Abweichungen muessen erklaeren, wie derselbe Inhalt grafisch oder animiert getragen wird.

## Mindestschritte

1. Modul-Sequenzplan laden oder erstellen: `analysis/rebuild-plans/<module_id>_sequence_plan.md`.
2. Quellpaket bestimmen: Modulordner mit Quell-SVGs, Source-SVG-Inventar, optionaler Sprechertext und vorhandene Rebuild-Plaene.
3. Arbeitseinheit aus dem Sequenzplan ableiten: einzelne Folie, zusammengezogene Sequenzgruppe, Preview-Zustand oder bewusst uebersprungener Zwischenzustand.
4. Finalen Zielzustand festlegen. Bei mehreren Quell-SVGs fuer Reveal/Morph/Aufbau die vollstaendigste SVG als primaeren Inhaltsanker nehmen.
5. Crosscheck-Referenzen aus `analysis/rebuild-plans/<module_id>_source-reference-map.json` uebernehmen und bestaetigen. Alle zusammengezogenen Quell-SVGs muessen genannt bleiben; Zusatzfolien werden als `new_content` ohne Quell-SVG-Referenz markiert.
6. Quellinhalt und optionalen Sprechertext abgleichen: Muss-Inhalte, Muss-Begriffe, Muss-Parameter, vollstaendig zu erhaltende Elemente und bewusst entfernte Masterelemente.
7. Uebergaenge und Abhaengigkeiten aus dem Sequenzplan uebernehmen: Was baut aufeinander auf, was muss animierbar bleiben, welcher Zustand kommt davor/danach?
8. Visuelle Elemente klassifizieren: Diagramm, Timeline, Formel, Piktogramm, Bild, Textblock, Legende, Prozesslogik.
9. Pro visuellem Element die passende Detailregel laden:
   - Diagramm: `workflow/31-python-plots/python-plot-workflow.md`
   - Timeline: `workflow/33-timelines/timeline-workflow.md`
   - Formel: `workflow/32-formulas/formula-workflow.md`
   - Piktogramm/Bild: `workflow/30-visual-decision/svg-asset-decision-gate.md`
10. Animationsentscheidung nach `workflow/50-animation/animation-decision-and-dramaturgy.md` treffen. Zuerst `static`, `animated` oder `needs_review` begruenden. Nur bei `animated` fachliche Sprechertextabschnitte, vollstaendige semantische Gruppen, stabile Gruppen-IDs, Trigger und Effekte planen. Keine technische Zerlegung nach SVG-Elementarten und keine unnoetigen Zwischen-SVGs.
11. Sichtbare Titel explizit ausschliessen: keine Modul-/Folien-Kicker, keine Workflow-Hinweise, keine globalen Szenentitel und keine Fokuszeilen im SVG. Nur direkt am Inhalt gebundene Labels sind erlaubt.
12. Bei Ausfall-Zeitachsen die Positionslogik festlegen: `source_timed`, `calculated`, `illustrative_irregular` oder `abstract_process`. Illustrative Ausfallzeiten muessen unregelmaessig verteilt werden.
13. Zielstruktur aus `workflow/40-svg-production/target-svg-structure-contract.md` laden und noch offene Strukturvorgaben markieren.
14. Risiken notieren: kleine Schrift, Textueberlauf, Diagrammlesbarkeit, fehlende Assets, externe SVG-Referenzen, ID-Kollisionen, unklare Daten oder fehlender Sprechertext.

## Szenenbrief

Ein Szenenbrief enthaelt mindestens:

- Modul, Folie(n), Zielzustand.
- Crosscheck-Referenzfolien, primaere Referenz, Mapping-Typ und Begruendung.
- Verweis auf Sequenzplan-Gruppe und vorherige/folgende Arbeitseinheit.
- Didaktische Kernaussage.
- Sprechertextanker.
- Muss-Inhalte und erlaubte Neuinterpretation.
- Content-Equivalence: wie der fachlich relevante Quellinhalt vollstaendig erhalten bleibt.
- Informationsdichte im Vergleich zu den Quell-SVGs.
- Uebernahmeplan fuer Quellknoten, Gruppen, IDs, `defs`, Styles und Referenzen.
- Layoutidee mit grober Gewichtung.
- Uebergaenge, Aufbauabhaengigkeiten und Animationsentscheidung aus dem Sequenzplan.
- Titelentscheidung: bestaetigen, dass das SVG keinen sichtbaren globalen Titel/Kicker enthaelt.
- Timeline-Positionslogik fuer jede Ausfallachse.
- Asset-Entscheidungstabelle.
- Geplante Layer-IDs.
- Explizite Animationsentscheidung mit didaktischer Begruendung. Bei `animated`: wenige vollstaendige semantische Gruppen und Sprechertextbezug je Schritt. Bei `static`: leere Schrittfolge ohne kuenstlichen Ganzfolien-Trigger.
- QA-Plan.

`templates/svg-scene-brief-template.md` kann direkt verwendet oder inhaltlich in einen Modul-Szenenplan uebertragen werden.
