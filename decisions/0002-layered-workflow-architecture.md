# Decision 0002: Layered Workflow Architecture

## Status

Akzeptiert

## Kontext

Die Projektregeln waren in `AGENT.md` und mehreren grossen Workflowdateien verdichtet. Dadurch musste Codex fuer kleine Arbeitsschritte zu viel Kontext laden. Gleichzeitig duerfen keine bestehenden Regeln, Vorgehen oder bisher geklaerten Spezialfaelle verloren gehen.

## Entscheidung

Die Workflow-Regeln werden nach Progressive Disclosure strukturiert:

- `AGENT.md` bleibt der verpflichtende, kompakte Router.
- `workflow/README.md` beschreibt die Ebenen.
- `workflow/00-router/context-loading-map.md` entscheidet, welche Detailregeln fuer einen Auftrag geladen werden.
- Bestehende Workflowdateien wurden in thematische Unterordner verschoben.
- Alte Pfade direkt unter `workflow/` bleiben als Compatibility Redirects erhalten.
- Die alte vollstaendige Agent-Datei wurde unter `workflow/00-router/agent-rules-legacy-before-router.md` gesichert.
- Neue Detailregeln fuer Python-Plots, Timelines, Formeln, Szenenplanung und QA wurden als eigene Dateien angelegt.

## Konsequenzen

- Codex kann fuer Analyse, Plot, Timeline, Formel, SVG-Produktion und QA gezielter Kontext laden.
- Alte Berichte, Templates und Agentenverweise brechen nicht, weil Compatibility Redirects existieren.
- Neue Richtlinien koennen erweiterbar in passenden Unterordnern ergaenzt werden.
- Projektwissen bleibt nachvollziehbar: Router fuer Entscheidung, Detaildateien fuer Regeln, Legacy-Datei fuer vollstaendige Historie.
