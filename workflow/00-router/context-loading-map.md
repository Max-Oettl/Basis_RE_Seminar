# Context Loading Map

Diese Datei ist die kompakte Entscheidungshilfe dafuer, welche Detailregeln Codex fuer einen Auftrag laden soll.

## DOCX-Text-Intake Eines Moduls

Pflicht und immer zuerst:

- `workflow/10-source-analysis/source-text-docx-intake-and-mapping.md`
- `analysis/svg-text-map.schema.json`
- `templates/svg-text-map-template.json`
- Quell-SVGs unter `source-materials/basis-seminar/powerpoint-svg/<module_id>/SVG/`
- Word-Sprechertexte unter `source-materials/basis-seminar/powerpoint-svg/<module_id>/Text/`

Ausgabe:

- `analysis/source-text/<module_id>/extracted/*.md`
- `analysis/inventories/<module_id>_svg-text-map.json`

Solange dieses Mapping fehlt, veraltet ist oder offene Zuordnungen enthaelt, werden weder semantische Quell-SVG-Analyse noch Sequenzplanung oder Produktion gestartet.

## Quell-SVG-Intake Eines Moduls

Pflicht:

- `workflow/10-source-analysis/source-svg-intake-workflow.md`
- `workflow/10-source-analysis/source-svg-transformation-contract.md`
- `analysis/source-svg-inventory.schema.json`
- passende Quell-SVGs unter `source-materials/basis-seminar/powerpoint-svg/<module_id>/SVG/`
- das abgeschlossene Mapping `analysis/inventories/<module_id>_svg-text-map.json`
- `workflow/10-source-analysis/source-slide-and-spoken-text-alignment.md` und die daraus referenzierten extrahierten Texte

Nicht laden, solange keine SVG-Produktion beauftragt ist:

- Python-Plot-Details
- SVG-Kompositionsdetails
- E-Learning-Video-Vertrag
- Storyboard-Legacy-Workflow

## Folien- Oder Modul-Redesign

Pflicht:

- `.agents/skills/redesign-reltest-slides/SKILL.md`
- `workflow/34-slide-redesign/slide-redesign-workflow.md`
- `.agents/skills/redesign-reltest-slides/references/redesign-decision-guide.md`
- `templates/slide-redesign-brief-template.md`
- alle betroffenen Quell-SVGs und der vollstaendige zugeordnete Sprechertext

Zuerst den Ausgabemodus festlegen:

- `full_slide`: `brand/reltest-education-slide-design-tokens.json`,
  `brand/reltest-education-style-guide.md` und bei Detailfragen
  `.agents/skills/redesign-reltest-slides/references/reltest-education-brand-handoff.md`
  laden.
- `content_svg`: `brand/company-brand-tokens.json` und den bestehenden Content-SVG-Vertrag laden; keine Masterelemente einbauen.
- `module_redesign`: zusaetzlich
  `workflow/34-slide-redesign/chapter-implementation-quality-contract.md` und den
  Sequenz-Preflight aus `workflow/20-scene-planning/` laden. Vor Produktion
  Referenz-Lock, modulweite Archetyp-/Komponentenplanung und den Pilot fuer den
  ersten neuen Archetyp abschliessen.

Vor jeder Umsetzung einen Redesign-Brief unter `analysis/rebuild-plans/` speichern.
Bei Kapiteln wird der statische Endzustand jeder Szene vor Animation gegen Quelle
und Referenzdesign gerendert. Ohne Zielrender keine Freigabe. Bei Spezialinhalten
die bestehenden Plot-, Formel-, Timeline- und Animationsworkflows zusaetzlich
laden.

Sobald Piktogramme neu erzeugt, ersetzt, bewertet oder als Lernanker eingesetzt
werden, zusaetzlich laden:

- `workflow/30-visual-decision/pictogram-creation-workflow.md`
- `brand/reltest-education-pictogram-style-guide.md`
- `brand/reltest-education-pictogram-tokens.json`
- `components/pictogram-library/README.md`
- `components/pictogram-library/pictogram-registry.json`
- `agents/png-asset-prompt-designer.md` und `agents/png-asset-reviewer.md` bei
  generierten Rasterpiktogrammen

## SVG-Neuaufbau Oder SVG-Korrektur

Pflicht:

- `workflow/20-scene-planning/preflight-sequence-planning.md`
- `workflow/20-scene-planning/scene-planning-workflow.md`
- `workflow/40-svg-production/svg-rebuild-production-runbook.md`
- `workflow/30-visual-decision/svg-asset-decision-gate.md`
- `workflow/30-visual-decision/pictogram-creation-workflow.md`, sobald ein
  Piktogramm betroffen ist
- `brand/reltest-education-pictogram-tokens.json`, sobald ein Piktogramm
  erzeugt oder grundlegend ueberarbeitet wird
- `workflow/60-quality/graphic-creation-quality-gate.md`
- `workflow/60-quality/rebuild-quality-gate.md`
- `workflow/60-quality/content-transfer-crosscheck.md`
- `templates/module-sequence-plan-template.md`
- `templates/svg-scene-brief-template.md`
- `brand/company-brand-tokens.json`
- `brand/reltest-education-style-guide.md`
- `brand/design-quality-bar.md`

Vor dem ersten Ziel-SVG eines Moduls muessen `analysis/inventories/<module_id>_svg-text-map.json`, `analysis/inventories/<module_id>_source-svg-inventory.json` und `analysis/rebuild-plans/<module_id>_sequence_plan.md` existieren. Darin wird jede Quell-SVG zusammen mit ihrem gemappten Sprechertext einzeln gesichtet, bevor Arbeitseinheiten produziert werden.

Der Plan muss als detaillierter Markdown-Bauplan vorliegen, nicht nur als grobe Folienuebersicht. Er enthaelt pro geplanter SVG-Arbeitseinheit mindestens Zielpfade, Output-Art, Layout-/Darstellungsplan, Asset-/Plot-/Formelstrategie, Timeline-Logik, geplante Animationsebenen, Trigger und QA-Schwerpunkte. Wenn dieser Plan fehlt oder offensichtlich veraltet ist, wird zuerst Analyse/Planung fortgesetzt und noch keine SVG umgesetzt.

Fuer SVG-Neuaufbau gilt zusaetzlich:

- Fachlich relevante Inhalte werden vollstaendig uebernommen; die neue SVG ist keine Zusammenfassung.
- Die Informationsdichte orientiert sich an den Quell-SVGs.
- Aufbau-/Reveal-/Morph-Zustaende aus mehreren Quell-SVGs werden zusammengezogen, wenn sie eine gemeinsame Erklaergrafik bilden koennen.
- Die Quell-SVG wird strukturell transformiert, nicht erneut aus PPTX/PDF/PNG nachgebaut.
- `workflow/40-svg-production/target-svg-structure-contract.md` ist fuer die Ziel-DOM-Struktur verpflichtend.
- Alle echten Plots und technischen Diagramme werden aus Python erzeugt; einfache `X`-/Zensur-Timelines bleiben SVG-nativ.
- Jede neue Content-SVG braucht eine ausdrueckliche Animationsentscheidung. `static` und `animated` sind gleichwertige Ergebnisse; bei unklarer Grundlage gilt `needs_review` und es werden keine Schritte erfunden.
- `manifest.json` und `scene.animation.v1.json` sind unterschiedliche Artefakte.

Zusaetzlich nach Bedarf:

- echte Diagramme: `workflow/31-python-plots/python-plot-workflow.md`
- Diagrammgeometrie: `workflow/31-python-plots/diagram-guidelines.md`
- Formeln: `workflow/32-formulas/formula-workflow.md`
- Timelines: `workflow/33-timelines/timeline-workflow.md`
- Animation/Layer: zuerst `.agents/skills/animate-svg-from-narration/SKILL.md`
  und `workflow/50-animation/animation-decision-and-dramaturgy.md`; bei
  Sprechertexten mit Pausenmarkern zusaetzlich
  `workflow/50-animation/narration-pause-markers.md`, danach bei
  `animated` `workflow/50-animation/scene-manifest-contract.md`
- Downstream-Video: `workflow/70-integration/elearning-video-output-contract.md`
- finale externe SVG-/Storyboard-Uebergabe: `workflow/70-integration/storyboard-import-package-handoff.md`

## Finale Storyboard-Import-Uebergabe

Pflicht:

- `workflow/40-svg-production/target-svg-structure-contract.md`
- `workflow/50-animation/scene-manifest-contract.md`
- `workflow/60-quality/rebuild-quality-gate.md`
- `workflow/70-integration/storyboard-import-package-handoff.md`
- `templates/storyboard-import-package/`
- freigegebener Sprechertext fuer jede animierte Zielszene

Vor der Paketbildung muessen alle Arbeitseinheiten einzeln produziert, gecrosscheckt, korrigiert und erneut geprueft sein. Danach wird genau ein `storyboardImportPackage/v1` erzeugt und ueber `tools/svg-rebuild-qa.js --handoff-package ... --strict-handoff` validiert.

## Nutzerfeedback Auf Eine Szene

Pflicht:

- `workflow/00-router/review-feedback-learning-loop.md`
- aktuelle Zielszene, Quellreferenzen, Sprechertext und Animationsmanifest
- neuester passender Modul-Audit unter `analysis/rebuild-plans/`
- bei Redesign `.agents/skills/redesign-reltest-slides/references/review-derived-design-rules.md`

Pruefe zuerst, welche Ebene betroffen ist:

- Inhalt, Quellgeometrie oder Sprechertext: zum Quell-SVG-Inventar beziehungsweise zur Sequenzanalyse zurueck.
- Diagramm: Python-Plot-Workflow erneut anwenden.
- Timeline: Timeline-Workflow erneut anwenden.
- Formel: Formel-Workflow erneut anwenden.
- Asset-Typ: Asset-Decision-Gate erneut anwenden.
- Animation: Manifest/Trigger-Regeln erneut anwenden.
- Layout oder Lesbarkeit: Qualitaetsgate erneut anwenden.

Danach erst Dateien patchen oder neu generieren.

Nach der Korrektur zuerst den Content-Transfer-Crosscheck gegen alle geplanten Quell-SVGs wiederholen und danach das technische SVG-QA-Gate ausfuehren. Anschliessend den Audit aktualisieren, die Reichweite `local_fix`, `module_pattern`, `project_rule`, `domain_rule` oder `qa_gap` dokumentieren und uebertragbare Erkenntnisse in die kanonische Schublade uebernehmen.
