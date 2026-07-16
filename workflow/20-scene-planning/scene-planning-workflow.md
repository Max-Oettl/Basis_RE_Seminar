# Scene Planning Workflow

Nutze diesen Workflow vor jeder SVG-Komposition oder groesseren SVG-Korrektur.

Vor diesem Szenenbrief muss fuer das Modul der Sequenz-Preflight aus `workflow/20-scene-planning/preflight-sequence-planning.md` vorliegen. Der Szenenbrief fuer eine einzelne Arbeitseinheit darf nicht isoliert aus einer Folie entstehen, sondern muss sich auf die dort dokumentierte Sequenzgruppe, Abhaengigkeiten, Animationen und Uebergaenge beziehen.

## Ziel

Eine Szene wird aus vorhandenen Folien abgeleitet, nicht frei erfunden. Die alte Folie ist Inhaltsanker; die neue SVG-Szene darf didaktisch klarer und visuell sauberer sein.

Didaktisch klarer bedeutet nicht kuerzer im fachlichen Sinn. Die neue Szene uebernimmt den gesamten fachlich relevanten Quellinhalt und verpackt ihn besser. Die Informationsdichte orientiert sich an der PowerPoint-Folie; Abweichungen muessen erklaeren, wie derselbe Inhalt grafisch oder animiert getragen wird.

## Mindestschritte

1. Modul-Sequenzplan laden oder erstellen: `analysis/rebuild-plans/<module_id>_sequence_plan.md`.
2. Quellenpaket bestimmen: PPTX, PDF, PNG, Sprechertext, vorhandene Analyse-JSON, vorhandene Rebuild-Plaene.
3. Arbeitseinheit aus dem Sequenzplan ableiten: einzelne Folie, zusammengezogene Sequenzgruppe, Preview-Zustand oder bewusst uebersprungener Zwischenzustand.
4. Finalen Zielzustand festlegen. Bei mehreren PowerPoint-Folien fuer Reveal/Morph/Aufbau den letzten vollstaendigen Zustand als primaeren Inhaltsanker nehmen.
5. Crosscheck-Referenzen aus `analysis/rebuild-plans/<module_id>_source-reference-map.json` uebernehmen und bestaetigen. Alle zusammengezogenen Quellfolien muessen genannt bleiben; Zusatzfolien werden als `new_content` ohne Altfolienreferenz markiert.
6. Sprechertext-Abgleich dokumentieren: Muss-Inhalte, Muss-Begriffe, Muss-Parameter, vollstaendig zu erhaltende Quellinhalte, bewusst weggelassene Alt-Elemente.
7. Uebergaenge und Abhaengigkeiten aus dem Sequenzplan uebernehmen: Was baut aufeinander auf, was muss animierbar bleiben, welcher Zustand kommt davor/danach?
8. Visuelle Elemente klassifizieren: Diagramm, Timeline, Formel, Piktogramm, Bild, Textblock, Legende, Prozesslogik.
9. Pro visuellem Element die passende Detailregel laden:
   - Diagramm: `workflow/31-python-plots/python-plot-workflow.md`
   - Timeline: `workflow/33-timelines/timeline-workflow.md`
   - Formel: `workflow/32-formulas/formula-workflow.md`
   - Piktogramm/Bild: `workflow/30-visual-decision/svg-asset-decision-gate.md`
10. Animationsebenen planen: stabile Gruppen-IDs, sinnvolle Einblendfolge, Ein-/Ausblenden, Zeichnen, Verschieben oder Highlighten nach Sprechertextlogik, keine unnoetigen Zwischen-SVGs.
11. Sichtbare Titel explizit ausschliessen: keine Modul-/Folien-Kicker, keine Workflow-Hinweise, keine globalen Szenentitel und keine Fokuszeilen im SVG. Nur direkt am Inhalt gebundene Labels sind erlaubt.
12. Bei Ausfall-Zeitachsen die Positionslogik festlegen: `source_timed`, `calculated`, `illustrative_irregular` oder `abstract_process`. Illustrative Ausfallzeiten muessen unregelmaessig verteilt werden.
13. Risiken notieren: kleine Schrift, Textueberlauf, Diagrammlesbarkeit, fehlende Assets, unklare Daten, fehlender Sprechertext.

## Szenenbrief

Ein Szenenbrief enthaelt mindestens:

- Modul, Folie(n), Zielzustand.
- Crosscheck-Referenzfolien, primaere Referenz, Mapping-Typ und Begruendung.
- Verweis auf Sequenzplan-Gruppe und vorherige/folgende Arbeitseinheit.
- Didaktische Kernaussage.
- Sprechertextanker.
- Muss-Inhalte und erlaubte Neuinterpretation.
- Content-Equivalence: wie der fachlich relevante Quellinhalt vollstaendig erhalten bleibt.
- Informationsdichte im Vergleich zur PowerPoint-Quelle.
- Layoutidee mit grober Gewichtung.
- Uebergaenge, Aufbauabhaengigkeiten und Animationsentscheidung aus dem Sequenzplan.
- Titelentscheidung: bestaetigen, dass das SVG keinen sichtbaren globalen Titel/Kicker enthaelt.
- Timeline-Positionslogik fuer jede Ausfallachse.
- Asset-Entscheidungstabelle.
- Geplante Layer-IDs.
- Animationsabdeckung fuer jede wesentliche Aussage; statische Elemente nur mit Begruendung.
- QA-Plan.

`templates/svg-scene-brief-template.md` kann direkt verwendet oder inhaltlich in einen Modul-Szenenplan uebertragen werden.
