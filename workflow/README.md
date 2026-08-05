# Workflow Router

Diese Ordnerstruktur reduziert Kontextlast durch progressive Offenlegung. Starte mit `AGENT.md` und lade danach nur die Dateien, die zum aktuellen Arbeitsschritt passen.

## Canonical Structure

```text
workflow/
  00-router/             Projektweite Navigation, Audit, Feedback-Lernschleife, Legacy-Sicherung
  10-source-analysis/    Quell-SVG-Intake, Inventar und Transformationsanalyse
  20-scene-planning/     Sequenz-Preflight, Szenenbrief, Sequenzkarte, Layer-Plan
  30-visual-decision/    Asset-Entscheidung, Visual-Klassifikation und Piktogrammsystem
  31-python-plots/       Diagrammregeln und Python-Plot-Workflow
  32-formulas/           Formel- und mathematische Darstellungsregeln
  33-timelines/          Timelines, Ausfall-Zeitachsen, Prozessachsen
  34-slide-redesign/     Einzel- und Modul-Redesign im RelTest-Education-System
  40-svg-production/     SVG-Komposition und Szene-fuer-Szene-Produktion
  50-animation/          Manifest, Trigger und E-Learning-Animation
  60-quality/            Technische und visuelle Qualitaetsgates
  70-integration/        Externe Storyboard-Pakete und Downstream-Video
  80-storyboard-legacy/  Alte oder optionale Storyboard-Workflows
```

## Loading Rule

1. Immer `AGENT.md` lesen.
2. Fuer den Input zuerst `workflow/10-source-analysis/source-text-docx-intake-and-mapping.md`, `analysis/svg-text-map.schema.json`, die Quell-SVGs unter `<module_id>/SVG/` und die Word-Dokumente unter `<module_id>/Text/` laden. Erst nach einem vollstaendigen SVG-Text-Mapping `workflow/10-source-analysis/source-svg-intake-workflow.md` und `workflow/10-source-analysis/source-svg-transformation-contract.md` laden.
3. Fuer SVG-Arbeit zusaetzlich `workflow/20-scene-planning/preflight-sequence-planning.md`, `workflow/20-scene-planning/scene-planning-workflow.md`, `templates/module-sequence-plan-template.md`, `templates/svg-scene-brief-template.md`, `brand/company-brand-tokens.json`, `brand/reltest-education-style-guide.md`, `agents/brand-guardian.md`, `brand/design-quality-bar.md`, `workflow/30-visual-decision/*`, `workflow/40-svg-production/*` und `workflow/60-quality/*` laden.
   - Vor der ersten Ziel-SVG-Umsetzung muessen `analysis/inventories/<module_id>_svg-text-map.json`, `analysis/inventories/<module_id>_source-svg-inventory.json` und `analysis/rebuild-plans/<module_id>_sequence_plan.md` vorliegen.
   - Ziel ist die inhaltlich gleichwertige Strukturtransformation der Quell-SVGs, kein erneuter Nachbau und keine kuerzere Zusammenfassung.
   - Mehrere Quell-SVGs, die durch Animationen zu einer gemeinsamen Erklaergrafik werden koennen, werden zusammengezogen und als gemeinsame Layerstruktur geplant.
   - Die genaue Zielstruktur kommt aus `workflow/40-svg-production/target-svg-structure-contract.md`.
4. Fuer echte Diagramme zusaetzlich `workflow/31-python-plots/*` und `components/python-plot-library/README.md` laden.
5. Fuer Formeln zusaetzlich `workflow/32-formulas/formula-workflow.md` laden.
6. Fuer Timelines zusaetzlich `workflow/33-timelines/timeline-workflow.md` laden.
7. Fuer ein ausdrueckliches Folien- oder Modul-Redesign `.agents/skills/redesign-reltest-slides/SKILL.md`, `workflow/34-slide-redesign/slide-redesign-workflow.md` und die passende Full-Slide- oder Content-SVG-Tokenquelle laden. Bei Kapiteln, Lektionen und Folienfolgen zusaetzlich `workflow/34-slide-redesign/chapter-implementation-quality-contract.md`; Referenz-Lock und statische Renderfreigabe sind Pflicht, bevor Animation oder Serienproduktion beginnt.
   Sobald Piktogramme neu erstellt, ersetzt oder semantisch umgedeutet werden,
   zusaetzlich `workflow/30-visual-decision/pictogram-creation-workflow.md` und
   `brand/reltest-education-pictogram-tokens.json` laden.
8. Fuer Animationsplanung, -umsetzung oder -korrektur zuerst
   `.agents/skills/animate-svg-from-narration/SKILL.md` und danach
   `workflow/50-animation/animation-decision-and-dramaturgy.md` laden. Nur bei der
   Entscheidung `animated` den Manifestvertrag anwenden; statische Szenen erhalten
   keine erfundenen Schritte.
9. Fuer eine finale externe Lieferung zusaetzlich `workflow/70-integration/storyboard-import-package-handoff.md` und die Vorlagen unter `templates/storyboard-import-package/` laden.
10. Bei Nutzerfeedback oder Korrekturen immer `workflow/00-router/review-feedback-learning-loop.md` laden, die Reichweite des Befunds entscheiden und uebertragbare Learnings vor der naechsten Produktion in die passende Schublade rueckfuehren.

## Aktuelle Projektentscheidungen

- Aktiver Input: genau `RE1` bis `RE5`, jeweils mit PowerPoint-Exporten unter `SVG/` und zugehoerigen Word-Sprechertexten unter `Text/`.
- Intake-Reihenfolge: zuerst DOCX verlustfrei extrahieren und pro Quell-SVG mappen; erst danach Quell-SVG-Inventar, Sequenzanalyse und Transformation.
- Alte PowerPoint-Gliederung: Die fruehere Aufteilung in mehrere PPT-Dateien wird nicht rekonstruiert.
- Vollstaendige Inhaltsuebernahme: Fachlich relevante Inhalte der Quell-SVGs bleiben erhalten; Struktur, Layerung und Design duerfen angepasst werden.
- Informationsdichte: Die neue Content-SVG orientiert sich an den Quell-SVGs. Sie darf nur kompakter sein, wenn derselbe Inhalt durch Grafik, Plot, Formel, Label oder Animation getragen wird.
- Plots: Alle echten Plots und technischen Diagramme kommen aus Python. Nur einfache Timelines, Ausfall-Zeitstrahlen und Objekt-Zeitachsen mit `X`-/Zensurmarkern bleiben SVG-nativ.
- Animation: Jede Content-SVG erhaelt eine belegte Entscheidung `static`, `animated` oder `needs_review`. Animationen entstehen nur aus Sprechertextkontext, fachlichen Gruppen und nachvollziehbarer Lesereihenfolge; eine statische Szene ist keine Ausnahme und kein Qualitaetsmangel.
- Manifesttrennung: `manifest.json` ist Produktionsstatus; `scene.animation.v1.json` ist Animation.
- Externe Lieferung: genau ein `storyboardImportPackage/v1` pro Modul mit stabilen `Scene_ID`-Ordnern, genau einer SVG je automatisch zuzuordnender Szene und einem namensgleichen strikten `svgAnimationManifest/v1`.
- Sprechertexttrigger: Der gelieferte Sprechertext ist fuer animierte Szenen Pflicht; `sourceText` wird wortgetreu daraus kopiert und nie durch Sekunden- oder Wortindexannahmen ersetzt.
- Sprecherpausen: Pausenmarker nach `workflow/50-animation/narration-pause-markers.md` bleiben im Sprechertext erhalten, werden getrennt validiert und weder als Wort noch als `sourceText`-Trigger behandelt.
- Das neue Full-Slide-Design ist in `.agents/skills/redesign-reltest-slides/`, `workflow/34-slide-redesign/` und `brand/reltest-education-slide-design-tokens.json` definiert. Es wird nur bei einem Redesign-Auftrag angewendet; normale Content-SVG-Transformationen duplizieren weiterhin keine Masterelemente.
- Bei einem Kapitel-Redesign wird der tatsaechliche Artefaktmodus des vom Nutzer
  benannten Referenzmoduls uebernommen. Ein Kapitel gilt erst nach
  Quellen-Ziel-Referenzvergleich jeder Szene und kapitelweitem Konsistenz-Sweep als
  freigabefaehig. Automatische Fehlerfreiheit ohne Zielrender ist keine Freigabe.

## Legacy Paths

Die alten Dateien direkt unter `workflow/` bleiben als Compatibility Redirects erhalten. Neue Regeln und neue Verweise sollen die kanonischen Pfade in den Unterordnern verwenden.

Die vollstaendige Verschiebung steht in `workflow/00-router/migration-map.md`.
