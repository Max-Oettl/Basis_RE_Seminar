# Context Loading Map

Diese Datei ist die kompakte Entscheidungshilfe dafuer, welche Detailregeln Codex fuer einen Auftrag laden soll.

## Rebuild-Analyse Einer Bestehenden Folie

Pflicht:

- `workflow/10-source-analysis/basis-seminar-slide-rebuild-runbook.md`
- `workflow/10-source-analysis/source-slide-and-spoken-text-alignment.md`
- `workflow/10-source-analysis/slide-rebuild-json-contract.md`
- `analysis/slide-rebuild.schema.json`
- passende Quellen unter `source-materials/basis-seminar/`

Nicht laden, solange keine SVG-Produktion beauftragt ist:

- Python-Plot-Details
- SVG-Kompositionsdetails
- E-Learning-Video-Vertrag
- Storyboard-Legacy-Workflow

## SVG-Neuaufbau Oder SVG-Korrektur

Pflicht:

- `workflow/20-scene-planning/preflight-sequence-planning.md`
- `workflow/20-scene-planning/scene-planning-workflow.md`
- `workflow/40-svg-production/svg-rebuild-production-runbook.md`
- `workflow/30-visual-decision/svg-asset-decision-gate.md`
- `workflow/60-quality/graphic-creation-quality-gate.md`
- `workflow/60-quality/rebuild-quality-gate.md`
- `workflow/60-quality/content-transfer-crosscheck.md`
- `templates/module-sequence-plan-template.md`
- `templates/svg-scene-brief-template.md`
- `brand/company-brand-tokens.json`
- `brand/reltest-academy-style-guide.md`
- `brand/design-quality-bar.md`

Vor dem ersten SVG eines Moduls muss `analysis/rebuild-plans/<module_id>_sequence_plan.md` existieren oder in diesem Schritt erstellt werden. Darin wird jede alte Folie einzeln gesichtet, bevor Arbeitseinheiten produziert werden.

Der Plan muss als detaillierter Markdown-Bauplan vorliegen, nicht nur als grobe Folienuebersicht. Er enthaelt pro geplanter SVG-Arbeitseinheit mindestens Zielpfade, Output-Art, Layout-/Darstellungsplan, Asset-/Plot-/Formelstrategie, Timeline-Logik, geplante Animationsebenen, Trigger und QA-Schwerpunkte. Wenn dieser Plan fehlt oder offensichtlich veraltet ist, wird zuerst Analyse/Planung fortgesetzt und noch keine SVG umgesetzt.

Fuer SVG-Neuaufbau gilt zusaetzlich:

- Fachlich relevante Inhalte werden vollstaendig uebernommen; die neue SVG ist keine Zusammenfassung.
- Die Informationsdichte orientiert sich an der PowerPoint-Quelle.
- Aufbau-/Reveal-/Morph-Folien werden zusammengezogen, wenn sie eine gemeinsame Erklaergrafik bilden koennen.
- Alle echten Plots und technischen Diagramme werden aus Python erzeugt; einfache `X`-/Zensur-Timelines bleiben SVG-nativ.
- Jede neue Content-SVG soll Animationsziele haben; eine statische SVG braucht Begruendung.
- `manifest.json` und `scene.animation.v1.json` sind unterschiedliche Artefakte.

Zusaetzlich nach Bedarf:

- echte Diagramme: `workflow/31-python-plots/python-plot-workflow.md`
- Diagrammgeometrie: `workflow/31-python-plots/diagram-guidelines.md`
- Formeln: `workflow/32-formulas/formula-workflow.md`
- Timelines: `workflow/33-timelines/timeline-workflow.md`
- Animation/Layer: `workflow/50-animation/scene-manifest-contract.md`
- Downstream-Video: `workflow/70-integration/elearning-video-output-contract.md`

## Nutzerfeedback Auf Eine Szene

Pruefe zuerst, welche Ebene betroffen ist:

- Inhalt oder Sprechertext: zur Quellenanalyse zurueck.
- Diagramm: Python-Plot-Workflow erneut anwenden.
- Timeline: Timeline-Workflow erneut anwenden.
- Formel: Formel-Workflow erneut anwenden.
- Asset-Typ: Asset-Decision-Gate erneut anwenden.
- Animation: Manifest/Trigger-Regeln erneut anwenden.
- Layout oder Lesbarkeit: Qualitaetsgate erneut anwenden.

Danach erst Dateien patchen oder neu generieren.

Nach der Korrektur zuerst den Content-Transfer-Crosscheck gegen alle geplanten Quellfolien wiederholen und danach das technische SVG-QA-Gate ausfuehren.
