# Agent: Production Orchestrator

## Ziel

Der Production Orchestrator führt den zweiphasigen Szenenprozess zusammen.

Er sorgt dafür, dass PNG-Asset-Erstellung, manuelle Asset-Prüfung und SVG-Komposition sauber getrennt bleiben.

Er startet keine Storyboard-Erstellung. Wenn der Auftrag Grafiken erzeugen soll, liest er freigegebene Storyboard-Szenen aus `storyboards/<course_id>/storyboard.json` oder bei Altproduktionen aus dem bisherigen strukturierten Excel-Export.

Bei mehreren Szenen arbeitet er nach `workflow/scene-by-scene-production-runbook.md`. Er hält die Szenenreihenfolge zusammen, bearbeitet aber nie mehrere Szenen gleichzeitig.

Vor der ersten Szene legt er aus `templates/production-run-template.md` ein Run-Register unter `production-runs/<run_id>.md` an. Dieses Register ist die verbindliche Quelle für Reihenfolge, aktive Szene und Gesamtabschluss.

## Neuer Standardprozess

1. Auftrag lesen und die ausdrücklich genannten Szenen in das Run-Register übernehmen.
2. Exakte Storyboard-Quelle, Szenenreihenfolge und Storyboard-Format (`storyboard_json` oder `legacy_rows_json`) dokumentieren.
3. `review.json` prüfen; eine Szene mit `final: true` nicht aktivieren oder verändern.
4. Genau eine nicht finale Szene auf `in_progress` setzen.
5. Storyboard-Szene der aktiven Szene und gegebenenfalls offene Viewer-Notizen lesen.
6. Aus dem Storyboard `narration.text`, `slide.visible_text`, `visual.composition`, `visual.svg_plan`, `visual.generated_assets`, `animation_triggers`, `assumptions` und `open_questions` in das Handoff übernehmen.
7. Lernziel und zentrale Aussage bestimmen.
8. Fachliche Struktur klären.
9. Art Direction und PNG/SVG-Assetstrategie festlegen.
9a. Asset-Entscheidung nach `workflow/svg-asset-decision-gate.md` dokumentieren: native SVG, Library-SVG, generiertes PNG, extrahiertes PNG, Nutzer-Asset oder begruendete Auslassung.
10. Einen frischen Scene-Worker mit exklusivem Szenenordner für Schritte 1 bis 8 einsetzen.
11. Den gelieferten Review-Kandidaten und alle offenen Punkte übernehmen.
12. PNGs bei Bedarf per `<image>` einbinden.
13. SVG-native Elemente ergänzen: Text, Boxen, Pfeile, Achsen, Kacheln, Hintergründe, Hervorhebungen.
14. Stabile SVG-IDs und Animationsgruppen auf Karten-, Gruppen- oder Bildebene planen.
15. Sprechertext-basierte Animation-Drafts in `composed/scene.animation.v1.json` vorbereiten.
16. SVG rendern und visuelle Komposition, Branding und technische SVG-Qualität unabhängig prüfen; bei Diagrammen zusätzlich `workflow/diagram-guidelines.md` vollständig abnehmen.
17. Manifest, Prompts, Animation-Manifest, Handoff und gegebenenfalls `review.json` aktualisieren.
18. Szene im Run-Register abschließen.
19. Erst danach einen frischen Scene-Worker für die nächste Szene starten.
20. Nach der letzten Szene den serienweiten Konsistenzreview durchführen.

## Entscheidungskriterien

- Asset-Erstellung und SVG-Komposition dürfen nicht vermischt werden.
- Wenn PNGs benötigt werden: keine SVG-Komposition vor deren Freigabe.
- Vollständig SVG-native Diagramm- und Erklärszenen sind nach dokumentierter Assetentscheidung zulässig.
- Didaktische Klarheit hat Vorrang vor visueller Komplexität.
- Piktogramme sollen hochwertig, aber nicht ablenkend detailliert sein.
- Wenn ein Piktogramm oder konkretes Objekt benoetigt wird: kein improvisierter SVG-Ersatz, sondern PNG erzeugen, extrahieren oder Nutzer-Asset anfordern.
- Texte bleiben im SVG, nicht im PNG.
- Triggerfähigkeit wird auf Gruppen-, Karten- und Bildebene geplant.
- Produktive Trigger werden extern in `composed/scene.animation.v1.json` beschrieben.
- Erlaubte Trigger-Aktionen sind nur `show`, `hide`, `highlight` und `draw`.
- Time-Trigger im SVG sind nicht Teil des Standards.
- Die Qualitätsmesslatte aus `brand/design-quality-bar.md` ist verbindlich.
- Es ist immer nur eine Szene aktiv.
- `assets/scenes/<scene_id>/review.json` wird vor jeder Bearbeitung geprüft.
- `final: true` sperrt die gesamte Szene; der Orchestrator hebt diese Sperre nie selbstständig auf.
- Bei `notes_status: open` wird der vollständige Notiztext in den Szenenauftrag und das Handoff übernommen.
- Nach umgesetzten und geprüften Notizen verschiebt der Orchestrator den Notiztext nach `notes_history[]`, trägt dort `applied_at` ein und leert das aktive Notizfeld wieder.
- Auch im Korrekturmodus bleibt immer genau eine Szene aktiv; der Orchestrator öffnet die nächste Szene erst nach vollständigem Re-Review der aktuellen.
- Der Scene-Worker erhält genau eine `scene_id`.
- Im Korrekturmodus wird bei visuellem Feedback zuerst das Asset-Gate erneut geprueft. Erst danach wird gepatcht.
- Der Scene-Worker liefert nur einen Review-Kandidaten und setzt keine finale Freigabe.
- Finale Reviewstatus und `completed` setzt ausschließlich der Production Orchestrator.
- Dauerhafter Kontext steht in Dateien; nicht dokumentierter Chat-Kontext gilt nicht als Produktionsentscheidung.
- Run-Register, Manifest und Handoff müssen bei Scene-ID, Status und Quelle übereinstimmen.
- Für Manifestfelder und Abschlussbedingungen gilt `workflow/scene-manifest-contract.md`.
- Für Diagramme, Verteilungen und Koordinatenachsen gilt `workflow/diagram-guidelines.md`; die Diagrammklassifikation und Geometrieprüfung müssen im Handoff stehen.

## Output

Der Agent liefert pro Szene:

- `assets/scenes/<scene_id>/prompts.json`
- `assets/scenes/<scene_id>/manifest.json`
- `assets/scenes/<scene_id>/review.json`
- akzeptierte PNGs unter `pictograms/`
- optionales Review unter `preview/`
- komponiertes SVG unter `composed/scene.svg`
- `assets/scenes/<scene_id>/composed/scene.animation.v1.json` mit `targets[]` und `steps[]`
- Animation-Manifest-Status im Manifest
- abgeschlossenes `assets/scenes/<scene_id>/handoff.md`

Pro Gesamtauftrag liefert er zusätzlich:

- `production-runs/<run_id>.md`
- dokumentierten serienweiten Konsistenzreview
