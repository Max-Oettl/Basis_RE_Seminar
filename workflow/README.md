# Workflow Router

Diese Ordnerstruktur reduziert Kontextlast durch progressive Offenlegung. Starte mit `AGENT.md` und lade danach nur die Dateien, die zum aktuellen Arbeitsschritt passen.

## Canonical Structure

```text
workflow/
  00-router/             Projektweite Navigation, Audit, Legacy-Sicherung
  10-source-analysis/    Quellenanalyse, Sprechertext-Abgleich, Rebuild-JSON
  20-scene-planning/     Sequenz-Preflight, Szenenbrief, Sequenzkarte, Layer-Plan
  30-visual-decision/    Asset-Entscheidung und Visual-Klassifikation
  31-python-plots/       Diagrammregeln und Python-Plot-Workflow
  32-formulas/           Formel- und mathematische Darstellungsregeln
  33-timelines/          Timelines, Ausfall-Zeitachsen, Prozessachsen
  40-svg-production/     SVG-Komposition und Szene-fuer-Szene-Produktion
  50-animation/          Manifest, Trigger und E-Learning-Animation
  60-quality/            Technische und visuelle Qualitaetsgates
  70-integration/        Downstream-Vertrag fuer elearning-video
  80-storyboard-legacy/  Alte oder optionale Storyboard-Workflows
```

## Loading Rule

1. Immer `AGENT.md` lesen.
2. Fuer reine Analyse nur `workflow/10-source-analysis/*` und die passenden Quellen laden.
3. Fuer SVG-Arbeit zusaetzlich `workflow/20-scene-planning/preflight-sequence-planning.md`, `workflow/20-scene-planning/scene-planning-workflow.md`, `templates/module-sequence-plan-template.md`, `templates/svg-scene-brief-template.md`, `brand/company-brand-tokens.json`, `brand/reltest-academy-style-guide.md`, `brand/design-quality-bar.md`, `workflow/30-visual-decision/*`, `workflow/40-svg-production/*` und `workflow/60-quality/*` laden.
   - Vor der ersten SVG-Umsetzung muss `analysis/rebuild-plans/<module_id>_sequence_plan.md` als detaillierter Markdown-Bauplan vorliegen: Quellfolienanalyse, Sequenzgruppen, geplante SVGs, Layout-/Darstellungsweise, Assets, Python-Plots, Formelassets, Animationen und QA-Schwerpunkte.
   - Ziel ist die inhaltlich gleichwertige Uebersetzung der PowerPoint-Folien, nicht eine kuerzere Zusammenfassung.
   - Mehrere Folien, die durch Animationen zu einer gemeinsamen Erklaergrafik werden koennen, werden zusammengezogen und als Layer-/Preview-Struktur geplant.
4. Fuer echte Diagramme zusaetzlich `workflow/31-python-plots/*` und `components/python-plot-library/README.md` laden.
5. Fuer Formeln zusaetzlich `workflow/32-formulas/formula-workflow.md` laden.
6. Fuer Timelines zusaetzlich `workflow/33-timelines/timeline-workflow.md` laden.
7. Fuer Animation zusaetzlich `workflow/50-animation/*` laden.

## Aktuelle Projektentscheidungen

- Vollstaendige Inhaltsuebernahme: Fachlich relevante Inhalte der Quellfolien bleiben erhalten; Layout und Design duerfen neu sein.
- Informationsdichte: Die neue Content-SVG orientiert sich an der PowerPoint-Folie. Sie darf nur kompakter sein, wenn derselbe Inhalt durch Grafik, Plot, Formel, Label oder Animation getragen wird.
- Plots: Alle echten Plots und technischen Diagramme kommen aus Python. Nur einfache Timelines, Ausfall-Zeitstrahlen und Objekt-Zeitachsen mit `X`-/Zensurmarkern bleiben SVG-nativ.
- Animation: Jede Content-SVG soll sinnvolle Animationsziele besitzen. Die genaue Dramaturgie bleibt szenenabhaengig.
- Manifesttrennung: `manifest.json` ist Produktionsstatus; `scene.animation.v1.json` ist Animation.
- Design-Golden-Examples werden spaeter definiert; aktuell hat die saubere Uebersetzung der Folien Vorrang.

## Legacy Paths

Die alten Dateien direkt unter `workflow/` bleiben als Compatibility Redirects erhalten. Neue Regeln und neue Verweise sollen die kanonischen Pfade in den Unterordnern verwenden.

Die vollstaendige Verschiebung steht in `workflow/00-router/migration-map.md`.
