# Scene Manifest Contract

`assets/scenes/<scene_id>/manifest.json` ist die strukturierte Statusquelle einer Szene.

Neue Szenen beginnen mit `assets/scenes/_template/manifest.json`.

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
