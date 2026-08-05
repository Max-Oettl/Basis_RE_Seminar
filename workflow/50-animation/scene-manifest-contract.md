# Scene Manifest Contract

`assets/scenes/<scene_id>/manifest.json` ist die strukturierte Statusquelle einer Szene.

Neue Szenen beginnen mit `assets/scenes/_template/manifest.json`.

## Abgrenzung Zum Animationsmanifest

Vor diesem Vertrag ist zwingend `workflow/50-animation/animation-decision-and-dramaturgy.md` anzuwenden. Dieser Manifestvertrag darf erst Animationsschritte definieren, wenn die Szene dort mit `animated` entschieden und semantisch geplant wurde. Bei `static` bleiben Animationsziele und Schritte leer; bei `needs_review` wird kein freigabefaehiges Manifest erzeugt.

Dieses Dokument beschreibt das Produktions- und Statusmanifest `assets/scenes/<scene_id>/manifest.json`.

Davon getrennt ist das Animationsmanifest:

```text
scene.animation.v1.json
```

Das Animationsmanifest beschreibt SVG-Targets, Trigger-Schritte und Review-Animationen. Es liegt bei Content-SVG-Rebuilds typischerweise neben der jeweiligen SVG, zum Beispiel:

```text
rebuild-proposals/svg/<module_id>/slide_001/scene.animation.v1.json
```

oder im spaeteren Szenenprozess unter:

```text
assets/scenes/<scene_id>/composed/scene.animation.v1.json
```

Die beiden Manifesttypen werden nicht vermischt:

- `manifest.json`: Produktionsstatus, Assetstatus, Reviewstatus, Abschlussbedingungen.
- `scene.animation.v1.json`: Animationsziele, Schritte, Trigger, Layer-IDs.

## Interne Reviewer-Datei Und Externe Lieferung

`scene.animation.v1.json` ist die interne Reviewer-Datei. Bestehende Viewer-Erweiterungen duerfen dort verlustfrei erhalten bleiben.

Die finale externe Lieferung ist davon getrennt und liegt unter:

```text
delivery-packages/storyboard-import/<external-module-id>/assets/<Scene_ID>/
  <svg-name>.svg
  <svg-name>.animation.v1.json
```

Fuer dieses externe Manifest gelten strikt nur die Felder aus `svgAnimationManifest/v1`, wie in `workflow/70-integration/storyboard-import-package-handoff.md` beschrieben. Interne Felder wie `sceneId`, `status`, `trigger`, `pauseMs`, `stepDelayMs` oder `afterInternalPlotDelayMs` werden nicht exportiert.

Jeder finale Schritt besitzt eine vollstaendige `sourceText`-Phrase aus dem freigegebenen `Gesprochener Text` derselben `Scene_ID`. Wiederholte Phrasen verwenden `occurrence`. Sekunden, Wortindizes, TTS-Zeitpunkte und absolute Produktionsframes werden nicht erzeugt.

Pausenmarker folgen `narration-pause-markers.md`. Sie bleiben im gesprochenen
Text erhalten, sind aber kein zulaessiger Bestandteil von `sourceText`. Der
Viewer maskiert sie bei der Worttokenisierung und addiert ihre Dauer nur zur
lokalen Zeitvorschau. Ein Manifest mit einem Pausenmarker als Trigger ist nicht
freigabefaehig.

Im Viewer werden alle erfolgreich aufgeloesten `sourceText`-Phrasen direkt im gesprochenen Text markiert. Die Markierung wird aus dem aktuellen Animationsmanifest berechnet und darf nicht als getrennte manuelle Liste gepflegt werden. Der Viewer zeigt auch an, wie viele eindeutige Triggerphrasen gefunden wurden; fehlende Treffer bleiben sichtbar und muessen vor der Freigabe korrigiert werden.

Beim Hover oder Tastaturfokus auf eine markierte Triggerphrase hebt der Viewer jedes dadurch angesprochene `targetId` im Ziel-SVG temporaer hervor. Gleichzeitig ausgeloeste Targets werden gemeinsam markiert. Diese Vorschau ist rein visuell, veraendert weder SVG noch Manifest und wird beim Verlassen der Phrase vollstaendig entfernt.

Eine ausdrueckliche Sprechertext-Bearbeitung im Viewer wird als szenenbezogener Override unter `analysis/viewer-notes/spoken-text-overrides.json` gespeichert. Die extrahierten DOCX-/Markdown-Quellen bleiben unveraendert und bilden den Ruecksetzpunkt. Nach jedem Speichern oder Zuruecksetzen werden alle `sourceText`-Trigger erneut gegen den wirksamen Szenentext geprueft. Ein Text-Override darf deshalb keine bestehende Triggerphrase still ungueltig machen.

Oeffentliche Animationsziele im SVG tragen `data-anim-target="true"`; `data-anim-label` ist empfohlen. Alle `targetId`-Werte verwenden stabile semantische ASCII-`snake_case`-IDs und muessen im SVG existieren. Ein Target ist eine fachlich vollstaendige Gruppe. Hintergrund, Rand, Text und Icon einer Box werden nicht getrennt; Achsen, Skalen, Ticks, Gitternetz und Achsenbeschriftungen bilden normalerweise gemeinsam den Diagrammrahmen.

Bei einer begruendet animierten nichttrivialen Szene ist ein einzelnes Target fuer das komplette SVG, `scene_content`, `main_content` oder einen vollstaendigen `source_state_*`-Container nicht ausreichend. Das Manifest bildet die fachlich erklaerte Reihenfolge auf wenige semantische Gruppen ab. Typische Gruppierung:

- Diagrammrahmen mit Achsen, Skalen, Ticks, Gitternetz und Achsenbeschriftungen als eine Kontextgruppe,
- fachlich gemeinsam erklaerte Balken, Datenpunkte oder Marker als Datenreihe,
- Fit- oder Referenzlinie erst nach der Datenebene und nur bei entsprechender Sprechertextpassage,
- beide Vertrauensgrenzen als eine gemeinsame Unsicherheitsgruppe,
- Formel, Erlaeuterung und Ergebnis nur dann getrennt, wenn der Sprechertext sie tatsaechlich nacheinander erklaert,
- hervorgehobener Zusammenhang als `highlight`-Schritt,
- sichtbare Zustandsaenderung als `transform` oder gezieltes `hide` plus `show`.

DOM-Elementart, PowerPoint-Exportreihenfolge und gleichmaessig verteilte Textstellen sind keine zulaessige Planungsgrundlage. Wenn keine fachliche Gruppierung und kein sinnvoller Trigger belegbar sind, bleibt die Szene statisch.

Mehrere Schritte duerfen dieselbe eindeutige `sourceText`-Phrase verwenden, wenn sie fachlich gleichzeitig ausgeloest werden sollen. Viewer und Zielsystem behandeln direkt aufeinanderfolgende Schritte mit identischer Phrase und `occurrence` als gemeinsame Triggergruppe, nicht als kuenstlich nacheinander abgespielte Einzeltrigger.

Jede neue Content-SVG braucht eine dokumentierte Animationsentscheidung, aber nicht zwingend Animationsschritte. Wenn das externe Paket ein namensgleiches Manifest verlangt, verwendet eine statische Szene ein valides Manifest mit leeren `targets` und `steps`. Ein kuenstlicher Ganzfolien-`show`-Schritt ist nicht zulaessig. Ein Produktionsmanifest ist nur erforderlich, wenn die Arbeit im spaeteren `assets/scenes/`-Produktionsprozess laeuft.

## Schema

Verbindliche Kennung:

```json
{
  "schema_version": "sceneManifest/v1"
}
```

## Szenenstatus

Das Feld `status` verwendet genau einen dieser Werte:

- `pending`: Szene ist beauftragt, aber noch nicht aktiv.
- `in_progress`: Szene ist die aktuell aktive Szene des Production Runs.
- `needs_revision`: Ein Review hat eine Korrektur verlangt.
- `completed`: Alle Pflichtartefakte und Reviews sind abgeschlossen.
- `blocked`: Ein ausdrücklich dokumentiertes Hindernis verhindert die Fortsetzung.

In einem Production Run darf höchstens eine Szene `in_progress` sein.

## Nutzerreview Und Final-Sperre

`assets/scenes/<scene_id>/review.json` ist die separate Statusquelle für Nutzerfreigabe und Änderungsnotizen. Neue Szenen verwenden `assets/scenes/_template/review.json`.

- `final: true` sperrt sämtliche Änderungen an der Szene, unabhängig vom Manifeststatus.
- Nur der Nutzer darf die Sperre im Viewer oder durch einen ausdrücklichen Auftrag für genau diese Szene aufheben.
- `notes_status` verwendet produktiv `empty` oder `open`; ältere Dateien mit `applied` sind als Legacy zulässig und werden in die Historie überführt.
- `notes_status: open` erfordert einen nicht leeren Notiztext und verhindert die Finalisierung.
- Eingearbeitete Notizen werden nach `notes_history[]` verschoben und aus dem aktiven Notizfeld entfernt.
- Jeder Historieneintrag enthält mindestens `note`, `noted_at` und `applied_at`; für archivierte Grafikstände zusätzlich nach Möglichkeit `version_id` und `version_label`.
- `completed` und `final` sind verschieden: `completed` bestätigt die Produktionsprüfungen, `final` friert die Szene auf Nutzerwunsch ein.

## Schrittfelder

- `current_step`: aktuell bearbeiteter Runbook-Schritt
- `last_completed_step`: letzter vollständig bestandener Runbook-Schritt
- `workflow_phase`: kurze technische Phase wie `context`, `assets`, `composition`, `review` oder `completed`

Bei `status: completed` gilt:

```json
{
  "current_step": 13,
  "last_completed_step": 13,
  "workflow_phase": "completed"
}
```

## Assetstrategie

`asset_policy.png_assets_required` entscheidet, ob die PNG-Schritte ausgeführt werden.

Wenn der Wert `false` ist:

- `asset_policy.decision_reason` ist nicht leer
- `reviews.asset` ist `not_applicable`
- `svg_composition.uses_png_images` ist `false`

Wenn der Wert `true` ist:

- `manual_review_required` ist `true`
- jedes benötigte Asset steht in `assets[]`
- jedes benötigte Asset hat vor der Komposition den Status `accepted`
- `reviews.asset` ist vor Szenenabschluss `accepted`

## Reviewstatus

Reviewfelder verwenden:

- `not_started`
- `in_progress`
- `accepted`
- `needs_revision`
- `not_applicable`

Für `status: completed` müssen gelten:

- `reviews.instructional`: `accepted`
- `reviews.technical_content`: `accepted` oder `not_applicable`
- `reviews.asset`: `accepted` oder `not_applicable`
- `reviews.visual`: `accepted`
- `reviews.brand`: `accepted`
- `reviews.animation`: `accepted`
- `reviews.technical`: `accepted`

## Abschlussbedingungen

Eine Szene darf nur `completed` werden, wenn:

- `open_issues` leer ist
- `review.json` existiert und keine offenen Notizen des aktuellen Auftrags enthält
- `composed/scene.svg` existiert und `svg_composition.status` `completed` ist
- `composed/scene.animation.v1.json` existiert und `animation_manifest.status` `accepted` ist
- `handoff.md` denselben Abschlussstatus dokumentiert
- das zugehörige Run-Register die Szene ebenfalls als `completed` führt

Bestehende ältere Manifeste dürfen während einer gezielten Überarbeitung auf `sceneManifest/v1` migriert werden. Eine bloße Workflow-Änderung erzwingt keine rückwirkende Änderung bereits vorhandener Szenen.
