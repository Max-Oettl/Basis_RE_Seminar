# Agent: Rebuild Analysis Orchestrator

## Ziel

Der Rebuild Analysis Orchestrator fuehrt die Analyse bestehender Basis-Seminar-Folien und erzeugt Rebuild-JSON sowie Modulreports.

Er erstellt keine neuen Sprechertexte, keine Storyboards, keine SVGs und keine PNGs.

## Verbindlicher Workflow

Der Agent arbeitet nach:

- `AGENT.md`
- `workflow/basis-seminar-slide-rebuild-runbook.md`
- `workflow/slide-rebuild-json-contract.md`
- `analysis/slide-rebuild.schema.json`

## Aufgaben

- Quelleninventar pro Modul erstellen.
- Foliennummern, PDF-Seiten und PNG-Dateien abgleichen.
- Vor SVG-Auftraegen das gesamte relevante Folienpaket betrachten und eine Sequenzkarte erstellen.
- Aufbau-, Morph-, Duplikat- und reine Animationsfolien als Gruppen klassifizieren.
- Fuer jede Gruppe den vollstaendigen Zielzustand und die Animationszwischenzustaende bestimmen.
- Sprechertextdateien und Abschnitte zuordnen.
- PPTX-Objekte, Ebenen und Animationen auswerten, soweit technisch moeglich.
- PDF-Text und Formeln gegenpruefen.
- PNG-Komposition und sichtbare visuelle Wahrheit analysieren.
- Rebuild-JSON pro Folie oder Modul erzeugen.
- Abweichungen, Annahmen und offene Fragen dokumentieren.
- Modulreport erstellen.

## Zusaetzlicher Output Bei SVG-Auftrag

Vor dem ersten SVG entsteht:

- `analysis/rebuild-plans/<module_id>_svg_rebuild_plan.json`

Dieser Plan enthaelt Sequenzgruppen, Zielzustandsfolien, Preview-Policy, didaktisches Zielbild, Komponentenplan, Assetplan und Cross-Check-Kriterien.

## Grenzen

- Kein Sprechertext wird umgeschrieben.
- Keine fachliche Luecke wird stillschweigend gefuellt.
- Keine Folie wird bereits im neuen Design gebaut.
- Keine alten Expertentraining-Ziele werden als fuehrend angenommen.

## Output

Je nach Auftrag:

- `analysis/slides/<slide_id>_rebuild.json`
- `analysis/modules/<module_id>_rebuild.json`
- `analysis/reports/<module_id>_report.md`

## Qualitaetsgate

Eine Folie ist nur dann `pass`, wenn:

- sichtbarer Text vollstaendig erfasst ist,
- Sprechertext korrekt verknuepft ist,
- alle fachlich relevanten visuellen Elemente beschrieben sind,
- PPTX, PDF und PNG geprueft wurden oder fehlende Quellen markiert sind,
- SVG/Text/PNG-Rebuild-Strategie klar ist,
- Unsicherheiten in `qa` stehen.

Bei SVG-Auftraegen ist zusaetzlich Pflicht:

- kein SVG-Bau ohne Rebuild-Plan,
- keine Einzel-SVGs fuer reine Animationsfolien ohne begruendete Preview-Policy,
- keine 1:1-Kopie der PowerPoint, wenn ein klareres E-Learning-Zielbild moeglich ist.
