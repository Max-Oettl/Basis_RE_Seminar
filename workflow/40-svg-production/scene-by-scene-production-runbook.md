# Szene-Für-Szene-Produktionsrunbook

Dieses Runbook ist bei Aufträgen mit einer oder mehreren Szenen verbindlich. Es wird zu Beginn jeder Szene neu geöffnet und von oben nach unten abgearbeitet.

Ziel ist, dass immer genau eine Szene aktiv produziert wird, ihr Kontext vollständig in Dateien steht und die nächste Szene erst nach Abschluss der aktuellen Szene beginnt.

## Betriebsmodell

- Der `production-orchestrator.md` hält den Gesamtauftrag, die Szenenreihenfolge und die Freigaben zusammen.
- Pro Szene wird ein frischer Scene-Worker verwendet. Er bearbeitet nur eine `scene_id` und liefert einen Review-Kandidaten.
- Innerhalb einer Szene werden die Fachrollen in der festgelegten Reihenfolge angewendet.
- Mehrere Szenen werden nicht parallel gestaltet oder generiert.
- Einzelne PNG-Assets derselben Szene bleiben im selben Scene-Worker, damit Stil und Komposition zusammenpassen.
- Reviewer dürfen als separate frische Agents arbeiten, erhalten aber ausschließlich das dokumentierte Szenenpaket.
- Chat-Kontext ist keine verlässliche Produktionsquelle. Verbindlich sind Production Run, Storyboard, `manifest.json`, `prompts.json`, `handoff.md`, `review.json`, SVG und Animation-Manifest.

## Verantwortungsgrenze Des Scene-Workers

Der Scene-Worker führt genau die Schritte 1 bis 8 aus und darf zusätzlich einen Entwurf für Schritt 11 erstellen.

Sein Ergebnis ist:

```text
status: in_progress
workflow_phase: review
current_step: 9
last_completed_step: 8
```

Der Scene-Worker:

- erstellt Kontextpaket, Didaktik, Fachnotizen und Art Direction
- erzeugt und prüft benötigte PNG-Assets
- komponiert `composed/scene.svg`
- darf `composed/scene.animation.v1.json` als Entwurf vorbereiten
- dokumentiert bekannte Risiken und offene Punkte

Der Scene-Worker darf nicht:

- die eigene visuelle Arbeit final freigeben
- Branding, Animation und Technik selbst auf `accepted` setzen
- die Szene auf `completed` setzen
- das Production-Run-Register ändern

Der Production Orchestrator übernimmt danach Schritte 9 bis 13. Er rendert die SVG für die visuelle Kontrolle und kann für unabhängige Reviews kurze, klar begrenzte Reviewer-Agents einsetzen.

Wenn ein Worker nach einem angemessenen Zeitfenster keinen Status oder Review-Kandidaten liefert:

1. Worker einmal mit einer kurzen Abschlussaufforderung kontaktieren.
2. Bei weiterem Stillstand Worker schließen.
3. Im Handoff den abgebrochenen Versuch notieren.
4. Einen neuen Worker mit engerem Auftrag starten oder die aktive Szene im isolierten Szenenkontext lokal fertigstellen.

Der Szenen-Lock bleibt währenddessen auf derselben Scene-ID.

## Produktionsauftrag Initialisieren

Vor der ersten Szene legt der Production Orchestrator aus `templates/production-run-template.md` eine Datei an:

```text
production-runs/<run_id>.md
```

Das Run-Register enthält:

- die ausdrücklich beauftragten Scene-IDs in verbindlicher Reihenfolge
- die exakte Storyboard-Datei, das Storyboard-Format und die verwendete Szene oder den strukturierten Legacy-Auszug
- pro Szene Status, Handoff-Pfad und offene Punkte
- genau eine `active_scene` oder `none`
- serienweite Entscheidungen und den Status des abschließenden Serienreviews

Der Orchestrator errät keine zusätzlichen Szenen. Bei einem Einzelauftrag enthält das Register genau eine Szene.

Start-Gate:

- Jede beauftragte Szene steht genau einmal im Register.
- Reihenfolge, Storyboard-Quelle und Scene-IDs sind eindeutig.
- Alle Szenen stehen auf `pending`.
- `active_scene` ist `none`.

## Pflichtlektüre Vor Jeder Szene

Der Scene-Worker liest vor dem ersten Entwurf:

1. `AGENT.md`
2. diese Datei
3. `workflow/two-phase-scene-production.md`
4. `workflow/graphic-creation-quality-gate.md`
5. `workflow/scene-manifest-contract.md`
6. `brand/design-quality-bar.md`
7. `brand/reltest-academy-style-guide.md`
8. die Storyboard-Quelle und vorhandene Metadaten der aktuellen Szene
9. `production-runs/<run_id>.md`
10. `assets/scenes/<scene_id>/manifest.json`, `prompts.json`, `handoff.md` und `review.json`, falls vorhanden

Bei neuen Storyboards ist zusätzlich `workflow/storyboard-json-contract.md` Pflichtlektüre. Aus der Storyboard-JSON werden mindestens `narration.text`, `slide.visible_text`, `visual.composition`, `visual.svg_plan`, `visual.generated_assets`, `animation_triggers`, `assumptions` und `open_questions` in das Handoff übernommen.

Zusätzliche Regeln werden genau an den unten genannten Arbeitsschritten gelesen.

Enthält die Szene ein Diagramm, eine Verteilung, einen Funktionsgraphen oder Koordinatenachsen, ist zusätzlich `workflow/diagram-guidelines.md` verbindliche Pflichtlektüre.

## Viewer-Reviewstatus Und Änderungsnotizen

Der SVG-Browser speichert den nutzerseitigen Reviewstatus einer Szene in:

```text
assets/scenes/<scene_id>/review.json
```

Die Vorlage ist `assets/scenes/_template/review.json`. Die Datei ergänzt Manifest und Handoff, ersetzt sie aber nicht.

Der Viewer kann außerdem `composed/scene.animation.v1.json` als zeitbasierte
Review-Vorschau abspielen. Dabei werden die Manifest-Schritte in ihrer
festgelegten Reihenfolge ausgeführt und nur für die Vorschau durch eine
wählbare Dummy-Pause getrennt. Diese Viewer-Zeiten sind keine produktiven
Trigger und dürfen weder in das SVG noch in das Animation-Manifest
zurückgeschrieben werden. Verbindlich bleiben `sourceText`, Reihenfolge,
Aktion und `targetId` des Manifests.

Der Basis-Rebuild-Viewer legt beim Speichern einer offenen Review-Notiz noch
keine sichtbare Version an. Er haelt nur einen internen Vorherstand des aktuell
angezeigten Content-SVGs inklusive vorhandenem `scene.animation.v1.json` bereit.
Erst wenn diese Notiz nach der Korrektur geschlossen wird, wird der Vorherstand
mit dem Notiztext als Verlaufsversion archiviert. Fuer nicht szenengebundene
Rebuilds liegen diese sichtbaren Verlaufsversionen unter:

```text
analysis/viewer-notes/versions/<module_id>_slide_<nnn>/<version_id>/
```

Im Viewer muss unter dem Notizfeld auswaehlbar sein, ob die aktuelle SVG-Version
oder ein abgeschlossener Verlaufstand angezeigt wird. Bei archivierten Staenden
werden SVG und damalige Notiz nur lesend angezeigt. Offene Notizen bleiben aktive
Arbeit und erscheinen erst nach Behebung im Verlauf.

Verbindliche Regeln:

- `final: true` ist eine nutzerseitige Bearbeitungssperre. Codex, Orchestrator, Scene-Worker und Reviewer dürfen keine Dateien dieser Szene verändern oder den Szenenordner nach `bin` verschieben.
- Eine finale Szene wird nur wieder bearbeitet, wenn der Nutzer den Finalstatus im Viewer selbst aufhebt oder ausdrücklich das Wiederöffnen genau dieser Szene beauftragt.
- `notes_status: open` kennzeichnet gespeicherte Änderungsnotizen, die noch nicht umgesetzt wurden.
- Eine Szene darf nicht finalisiert werden, solange offene Änderungsnotizen bestehen.
- Nach vollständiger Umsetzung und Prüfung archiviert Codex zusätzlich den resultierenden Grafikstand unter `assets/scenes/<scene_id>/versions/<version_id>/` und verknüpft ihn mit der Notizhistorie.
- Nach vollständiger Umsetzung und Prüfung verschiebt Codex die offene Notiz nach `notes_history[]`, trägt dort `applied_at`, `version_id` und optional `version_label` ein und leert das aktive Notizfeld wieder.
- Das Feld `notes` enthält immer nur die aktuell offene Änderungsnotiz; eingearbeitete Notizen stehen ausschließlich im Verlauf.
- Änderungen an `review.json` werden im Handoff unter Review-Ergebnissen nachvollziehbar gespiegelt.

Bei einem Auftrag wie „Arbeite die notierten Änderungen ein“:

1. Der Orchestrator sucht unter `assets/scenes/**/review.json` und in Sidecars `**/*.svg.review.json` nach `notes_status: open`.
2. Ausdrücklich genannte Scene-IDs begrenzen den Auftrag; ohne solche Begrenzung bilden alle offenen Notizen den Arbeitsumfang.
3. Finale Szenen werden nicht automatisch entsperrt, sondern als blockiert gemeldet.
4. Die gefundenen Szenen werden in eindeutiger Reihenfolge in ein Production-Run-Register übernommen; nicht szenengebundene SVGs stehen in einer separaten geordneten Arbeitsliste.
5. Jede Szene wird einzeln nach diesem Runbook korrigiert und vollständig geprüft. Nicht szenengebundene SVGs werden ebenfalls nacheinander nach ihren einschlägigen Qualitätsregeln bearbeitet.
6. Wenn eine Notiz einen wiederkehrenden Fehler oder eine neue Entscheidungsregel beschreibt, wird diese Erkenntnis vor dem Schließen der Notiz in die passende Schublade geschrieben: Agent-Datei, Skill-/Workflow-Datei, Komponentenrichtlinie, Diagrammregel, Formelregel, Timeline-Regel oder QA-Regel.
7. Erst nach bestandenen Reviews wird die jeweilige offene Notiz in `notes_history[]` archiviert, mit dem erzeugten Versionsstand verknüpft und aus `notes` entfernt.

## Korrekturworkflow Für Bestehende Szenen

Für Korrekturaufträge gilt dieselbe Ein-Szenen-Disziplin wie für die Neuerstellung.

Verbindlich:

- Es darf immer nur eine Szene gleichzeitig auf `in_progress` stehen.
- Offene Notizen werden nie szenenübergreifend parallel abgearbeitet.
- Pro Korrekturszene werden Run-Register, `handoff.md`, `review.json`, SVG und Animation-Manifest gemeinsam geprüft.
- Nach jeder Änderung an SVG, Plotasset, Formelasset, PNG-Asset, Animation-Manifest, Szenenbrief oder Reviewstatus muss der Quality Check erneut laufen. Eine Szene darf nicht als korrigiert gelten, wenn seit der letzten Dateiänderung kein neuer QA-Lauf dokumentiert wurde.
- Erst wenn die aktive Szene visuell, fachlich, markenseitig und technisch wieder freigegeben ist, wird die nächste Szene geöffnet.

Ablauf pro Szene:

1. Szene aus dem Korrektur-Run-Register als einzige `active_scene` aktivieren.
2. Offene Notiz vollständig in `handoff.md` übernehmen.
3. Betroffene Regeln und Rollen wie bei einer Neuerstellung lesen; Rücksprung erfolgt zum frühesten tatsächlich betroffenen Schritt.
4. Korrektur umsetzen, SVG und gegebenenfalls Animation-Manifest anpassen.
5. Visuelles Review, Branding-Review und technische Validierung vollständig wiederholen.
6. Den automatisierten Quality Check nach `workflow/60-quality/rebuild-quality-gate.md` erneut ausführen. Bei Findings zurück zu Schritt 4 und danach Schritt 5 und 6 wiederholen.
7. Den bestandenen QA-Befehl, Report-Pfad und verbleibende begründete Warnings im Handoff oder Szenenbrief dokumentieren.
8. Resultierenden Szenenstand unter `versions/<version_id>/` archivieren.
9. Offene Notiz in `notes_history[]` verschieben, `notes` leeren, `notes_status` auf `empty` setzen und das Ergebnis im Handoff spiegeln.
10. Szene im Run-Register auf `completed` setzen, `active_scene` auf `none` zurücksetzen und erst dann die nächste Szene starten.

## Szenen-Lock

Vor Beginn wird `assets/scenes/<scene_id>/handoff.md` aus `assets/scenes/_template/handoff.md` angelegt oder geöffnet. Im Handoff und im Run-Register wird konsistent festgehalten:

```text
active_scene: scene_XXX
allowed_scope: assets/scenes/scene_XXX/**
status: in_progress
```

Während `status: in_progress` gilt:

- `review.json` wurde geprüft und enthält nicht `final: true`.
- Keine andere Szene wird gestaltet, generiert, komponiert oder korrigiert.
- Im Run-Register steht dieselbe Szene als `active_scene` und `in_progress`.
- Gemeinsame Komponenten dürfen nur geändert werden, wenn die aktuelle Szene sie wirklich benötigt.
- Erkenntnisse für spätere Szenen werden nur notiert, nicht sofort umgesetzt.

## Schritt 1: Kontextpaket Anlegen Oder Aktualisieren

Verantwortlich: `agents/production-orchestrator.md`

Datei: `assets/scenes/<scene_id>/handoff.md`

Das Handoff enthält mindestens:

- Run-ID
- Scene-ID, Storyboard-Quelle, Storyboard-Format, JSON-Pfad oder Legacy-Zeile und Titel
- Sprechertext oder verbindliche Stichpunkte
- sichtbare Textanker aus dem Storyboard
- Visual-Brief aus `visual.composition` und `visual.svg_plan`
- Storyboard-Trigger aus `animation_triggers`
- Lernziel und genau eine zentrale Aussage
- aktueller Workflow-Schritt und letzter abgeschlossener Schritt
- visuelle Leitidee
- benötigte PNG-Assets oder begründete Entscheidung für SVG-native Gestaltung
- SVG-native Elemente
- geplante Animationsgruppen
- offene Entscheidungen und bekannte Risiken
- Liste der vorhandenen Dateien mit Status
- Review-Ergebnisse und noch offene Korrekturen
- Finalstatus und gegebenenfalls der vollständige Text offener Viewer-Notizen
- bei Diagrammen: Diagrammtyp, Achsenbedeutung, graphgebundene Punkte, Marker-Endmodus und Status der Geometrieprüfung

Stop-Gate:

- Run-Register, Manifest und Handoff nennen dieselbe Scene-ID und Quelle.
- Die Scene-ID und Quelle sind eindeutig.
- Es gibt genau eine zentrale Aussage.
- Offene Informationen sind ausdrücklich als offen markiert und nicht stillschweigend erfunden.

## Schritt 2: Didaktik Festlegen

Verantwortlich: `agents/instructional-designer.md`

Zu lesen:

- `agents/instructional-designer.md`
- passende Metadaten unter `metadata/`

Im `handoff.md` dokumentieren:

- Lernziel
- zentrale Aussage
- didaktische Reduktion
- visuelle Lernsequenz
- Elemente, die schrittweise erscheinen oder hervorgehoben werden

Stop-Gate:

- Die Grafik ist in wenigen Sekunden erfassbar.
- Der Sprechertext trägt die Erklärung; die Grafik trägt Struktur und Kernidee.
- Die Szene versucht nicht, mehrere unabhängige Aussagen gleichzeitig zu erklären.

## Schritt 3: Fachliche Vorprüfung

Der Instructional Designer dokumentiert zuerst im Handoff, ob eine fachliche Prüfung erforderlich ist.

Verantwortlich bei Formeln, Verteilungen, Zuverlässigkeitskennwerten, fachlichen Diagrammen oder methodischen Aussagen: `agents/reliability-engineering-reviewer.md`

Prüfen:

- Begriffe, Formeln, Einheiten, Achsen und Kurvenverläufe
- bei Diagrammen alle fachlichen und geometrischen Regeln aus `workflow/diagram-guidelines.md`
- fachliche Plausibilität der didaktischen Vereinfachung
- Risiken für Fehlinterpretationen

Stop-Gate:

- Die Entscheidung `required` oder `not_applicable` ist dokumentiert.
- Fachliche Korrekturen sind vor Art Direction und Bildgenerierung eingearbeitet.
- Offene Fachfragen stehen im `handoff.md`.
- Diagrammtyp, Achsenbedeutung und Marker-Endmodus sind im Handoff dokumentiert oder als `not_applicable` markiert.

## Schritt 4: Art Direction Und Asset-Entscheidung

Verantwortlich: `agents/art-director.md`

Zu lesen:

- `agents/art-director.md`
- `brand/reltest-academy-style-guide.md`
- `components/README.md`
- bei Merksatz oder Fazit: `components/takeaway-band.md`
- bei Diagrammen: `workflow/diagram-guidelines.md`
- visuell verwandte, bereits freigegebene Szenen

Festlegen:

- visuelle Leitidee und Blickführung
- welche Elemente PNG-Piktogramme werden
- welche Elemente SVG-nativ bleiben
- welche Elemente gemeinsam animiert werden
- Qualitätsrisiken und Referenzszenen
- bei Diagrammen: Achsenlabels, Achsenpfeile, graphgebundene Punkte und Marker-Endmodus

Stop-Gate:

- Keine vollständige Szene wird als PNG geplant.
- Text, Formeln, Achsen, Pfeile und Highlights bleiben grundsätzlich SVG-nativ.
- Eine vollständig SVG-native Diagramm- oder Erklärszene ist erlaubt, wenn sie sich hochwertig aus Diagrammen, Formen, Text und vorhandenen Komponenten bauen lässt.
- Komplexe illustrative Hauptmotive werden nicht aus primitiven SVG-Grundformen improvisiert; dafür werden geprüfte PNG-Assets oder hochwertige wiederverwendbare Komponenten verwendet.
- Wenn keine PNGs nötig sind, ist die SVG-native Entscheidung im Manifest begründet.

## Schritt 5: PNG-Prompts Vorbereiten

Nur ausführen, wenn PNG-Assets benötigt werden.

Verantwortlich: `agents/png-asset-prompt-designer.md`

Datei: `assets/scenes/<scene_id>/prompts.json`

Für jedes Asset festhalten:

- eindeutige Asset-ID und Dateiname
- isoliertes Motiv und Rolle in der Szene
- Stil, Perspektive, Farbwelt und gewünschte Freistellung
- transparenter Hintergrund
- Ausschlüsse: kein Text, keine Zahlen, kein Logo, kein Wasserzeichen, keine vollständige Szene

Stop-Gate:

- Jeder Prompt erzeugt genau ein separat prüfbares Basiselement.
- Alle geplanten Assets stehen im `manifest.json` zunächst auf `planned`.

## Schritt 6: PNGs Nacheinander Generieren

Für jedes Asset einzeln:

1. Aktuellen Eintrag aus `prompts.json` lesen.
2. Nur dieses eine Asset generieren.
3. Unter `assets/scenes/<scene_id>/pictograms/` speichern.
4. Den Status im `manifest.json` auf `generated` setzen.
5. Ergebnis sofort prüfen, bevor das nächste Asset generiert wird.

Kein paralleles Erzeugen mehrerer Szenen oder mehrerer stilistisch voneinander abhängiger Assets.

## Schritt 7: PNG-Review Und Freigabe

Verantwortlich: `agents/png-asset-reviewer.md`

Zu lesen:

- `agents/png-asset-reviewer.md`
- `brand/design-quality-bar.md`

Jedes Asset erhält im `manifest.json`:

- `accepted`, `needs_revision` oder `rejected`
- kurze Begründung
- konkrete Promptänderung bei `needs_revision`

Bei `needs_revision` zurück zu Schritt 5 und nur das betroffene Asset erneut erzeugen.

Stop-Gate:

- Kein SVG wird komponiert, solange ein benötigtes Asset nicht `accepted` ist.
- Transparenz, Zuschnitt, Textfreiheit, Stil und Skalierbarkeit sind geprüft.

## Schritt 8: SVG Komponieren

Verantwortlich: `agents/svg-compositor.md`

Zu lesen:

- `agents/svg-compositor.md`
- `workflow/graphic-creation-quality-gate.md`
- `brand/design-quality-bar.md`
- `brand/reltest-academy-style-guide.md`
- bei Diagrammen: `workflow/diagram-guidelines.md`
- benötigte Dateien unter `components/`

Output:

- `assets/scenes/<scene_id>/composed/scene.svg`

Verbindlich:

- Standard-ViewBox `0 0 1920 1080`, sofern nicht begründet anders
- akzeptierte PNGs per lokalem `<image>` einbinden
- semantische Gruppen-IDs in `lowercase_words_with_underscores`
- bewusste Layer-Reihenfolge
- Texte, Formeln, Pfeile, Achsen und Highlights nach den Repo-Regeln
- bei Diagrammen: Achsenpfeile schließen exakt am Achsenende ab, Achsen sind grundsätzlich beschriftet, graphgebundene Punkte liegen exakt auf dem Graphen und vertikale Marker folgen dem dokumentierten Endmodus
- keine nicht angeforderte PowerPoint-artige Überschrift
- keine produktiven Zeittrigger im SVG

Stop-Gate:

- Die Szene ist vollständig, aber noch nicht freigegeben.
- Alle beabsichtigten Animationseinheiten haben stabile Gruppen-IDs.

## Schritt 9: Visuelles Review Und Korrekturschleife

Verantwortlich: Production Orchestrator, bei Bedarf mit `agents/visual-composition-reviewer.md`

Zu lesen:

- `agents/visual-composition-reviewer.md`
- `workflow/graphic-creation-quality-gate.md`
- `brand/design-quality-bar.md`
- bei Diagrammen: `workflow/diagram-guidelines.md`

Prüfen:

- Kollisionen, Lesbarkeit, Abstände und Blickführung
- Layer-Reihenfolge und verdeckte Elemente
- Pfeilspitzen und Linienabschlüsse
- Achsenlabels, Datenpunkte, Kurven und Marker
- Achsenpfeile am exakten Achsenende ohne Lücke oder Linienüberstand
- vertikale Marker beginnen exakt an der x-Achse und enden einheitlich an der Kurve oder auf gemeinsamer Höhe
- Formelsatz und Encoding
- konsistente Komponenten und Markenwirkung

Jeder Fund wird im `handoff.md` mit Status dokumentiert. Bei einem Fund zurück zu Schritt 8. Das Review wird nach der Korrektur vollständig wiederholt.

Stop-Gate:

- Keine offenen visuellen Fehler.
- Die Qualitätsmesslatte ist ausdrücklich bestanden.

## Schritt 10: Branding Prüfen

Verantwortlich: Production Orchestrator, bei Bedarf mit `agents/brand-guardian.md`

Zu lesen:

- `agents/brand-guardian.md`
- `brand/reltest-academy-style-guide.md`
- `brand/design-quality-bar.md`

Stop-Gate:

- Farbrollen, Typografie, Ruhe und Konsistenz mit vorherigen Szenen sind freigegeben.

Bei Branding-Fehlern:

- reine Farb-, Typografie- oder Abstandsfehler: zurück zu Schritt 8
- falsche visuelle Leitidee oder inkonsistente Assetwahl: zurück zu Schritt 4
- danach Schritt 9 und 10 vollständig wiederholen

## Schritt 11: Animation-Manifest Planen

Verantwortlich: Production Orchestrator oder ein kurzer, ausschließlich auf das Animation-Manifest begrenzter `agents/animation-trigger-planner.md`

Zu lesen:

- `agents/animation-trigger-planner.md`
- `trigger-specs/speaker-text-trigger-conventions.md`
- `workflow/elearning-video-output-contract.md`

Output:

- `assets/scenes/<scene_id>/composed/scene.animation.v1.json`

Stop-Gate:

- Jedes `targetId` existiert im SVG.
- Jeder Step verwendet nur `show`, `hide`, `highlight` oder `draw`.
- `sourceText` stammt aus dem Sprechertext oder ist mit niedriger Confidence begründet.
- Keine finalen Sekunden, Wort-Indizes oder produktiven Zeittrigger wurden erzeugt.

Wenn Gruppen oder IDs ungeeignet sind, zurück zu Schritt 8 und danach Schritt 9 bis 11 wiederholen. Wenn nur `sourceText`, Reihenfolge oder Aktionsparameter betroffen sind, bleibt die Korrektur in Schritt 11.

## Schritt 12: Technische Validierung

Verantwortlich: Production Orchestrator, bei Bedarf mit einem ausschließlich auf Validierung begrenzten `agents/svg-technical-validator.md`

Zu lesen:

- `agents/svg-technical-validator.md`
- `workflow/graphic-creation-quality-gate.md`

Prüfen:

- XML- und JSON-Validität
- eindeutige IDs
- lokale Bildreferenzen
- alle Animation-Targets vorhanden
- keine verbotenen Triggerattribute oder `<animate>`-Zeitblöcke
- keine Mojibake-Fragmente
- kein unbeabsichtigtes Clipping oder Elemente außerhalb der ViewBox
- bei Diagrammen: dokumentierte Achsen-, Punkt- und Marker-Geometrie gegen `workflow/diagram-guidelines.md`

Bei einem Fehler zurück zum verantwortlichen Schritt und danach Schritt 9 bis 12 erneut ausführen.

Rücksprungregeln:

- fachlicher Fehler: Schritt 3, danach Art Direction und alle betroffenen Folgeschritte erneut prüfen
- ungeeignetes oder fehlerhaftes PNG: Schritt 5 bis 7, danach Schritt 8 bis 12
- Layout-, Komponenten- oder SVG-Fehler: Schritt 8, danach Schritt 9 bis 12
- Branding-Fehler: gemäß Schritt 10
- Triggertext- oder Manifestfehler ohne SVG-Änderung: Schritt 11 und 12
- ID- oder Gruppierungsfehler: Schritt 8, danach Schritt 9 bis 12

## Schritt 13: Szene Abschließen

Verantwortlich: `agents/production-orchestrator.md`

Im `manifest.json` und `handoff.md` dokumentieren:

```text
status: completed
current_step: 13
last_completed_step: 13
visual_review: accepted
brand_review: accepted
animation_review: accepted
technical_review: accepted
open_issues: none
```

Für die exakten Manifestfelder und erlaubten Statuswerte gilt `workflow/scene-manifest-contract.md`.

Das finale `handoff.md` enthält:

- Zweck und zentrale Aussage
- primäre Dateien
- verwendete Assets
- wichtige Animationsziele
- technische und visuelle Freigaben
- bewusst getroffene Sonderentscheidungen

Stop-Gate:

- `manifest.json`, `prompts.json`, `handoff.md`, `review.json`, `composed/scene.svg` und `composed/scene.animation.v1.json` existieren.
- `review.json` enthält keine offenen Änderungsnotizen aus dem aktuellen Auftrag.
- Nicht benötigte PNGs sind im Manifest ausdrücklich als `png_assets_required: false` dokumentiert.
- Alle Reviewstatus im Manifest sind `accepted` oder begründet `not_applicable`.
- Bei Diagrammen steht die Geometrieprüfung im Handoff auf `accepted`.
- Es gibt keine offenen Review-Punkte.
- Die Szene kann ohne Chatverlauf von einem neuen Agent nachvollzogen werden.

## Schritt 14: Kontext Zurücksetzen Und Nächste Szene Starten

Erst jetzt:

1. Die aktuelle Szene im Run-Register auf `completed` setzen.
2. `active_scene` im Handoff und Run-Register auf `none` setzen.
3. Die nächste `pending` Scene-ID aus dem Run-Register wählen.
4. Einen frischen Scene-Worker starten.
5. Dieses Runbook erneut ab der Pflichtlektüre durchgehen.
6. Als Startpaket nur Run-Register, Scene-ID, Storyboard-Quelle, Regeldateien und vorhandene Szenendateien übergeben.

Keine gestalterischen Annahmen aus der vorherigen Szene übernehmen, wenn sie nicht in einer Regel, Komponente, Referenzszene oder im neuen `handoff.md` dokumentiert sind.

Wenn keine Szene mehr `pending` ist, folgt Schritt 15.

## Schritt 15: Serienweiten Konsistenzreview Durchführen

Verantwortlich: Production Orchestrator mit `agents/visual-composition-reviewer.md` und `agents/brand-guardian.md`

Vor Beginn setzt der Orchestrator im Run-Register:

```text
status: series_review
active_scene: none
series_review: in_progress
```

Alle im Run-Register beauftragten Szenen gemeinsam prüfen:

- konsistente Farbrollen, Typografie und Abstände
- einheitliche Komponenten, Pfeile, Formeln und Diagrammlogik
- konsistente Anwendung von Achsenpfeilen, Achsenlabels, Graphbindung und Marker-Endmodi
- vergleichbare Dichte und visuelle Qualität
- konsistente Fachbegriffe und Bezeichnungen
- keine unbegründeten Stilwechsel
- alle Manifeste und Handoffs vollständig abgeschlossen

Bei einem Fund:

1. Die betroffene Szene im Run-Register auf `needs_revision` setzen.
2. Nur diese Szene wieder als `active_scene` öffnen.
3. Zum verantwortlichen Schritt zurückspringen.
4. Mindestens Schritt 9 bis 13 erneut ausführen.
5. Danach den vollständigen Serienreview wiederholen.

Der Production Run wird erst auf `completed` gesetzt, wenn:

- alle Szenen `completed` sind
- `active_scene` `none` ist
- der Serienreview `accepted` ist
- keine offenen serienweiten Punkte bestehen

## Empfohlene Agentenaufteilung

Der sinnvolle Standard ist nicht ein neuer Agent für jedes einzelne PNG, sondern:

- ein beständiger Production Orchestrator für den gesamten Auftrag
- ein frischer Scene-Worker pro Szene
- bei Bedarf separate frische Reviewer für Fachlichkeit, PNG-Qualität, visuelle Komposition und technische Validierung

So bleibt jede Szene intern konsistent, während alte Chatdetails nicht unkontrolliert in die nächste Szene hineinwirken. Die dauerhafte Kontinuität entsteht durch Dateien und Freigaben, nicht durch das Gedächtnis eines langen Agentenverlaufs.
