# Produktionsauftrag: <run_id>

## Auftragsstatus

```text
run_id: <run_id>
status: planned
active_scene: none
series_review: not_started
```

Erlaubte Statuswerte für den Auftrag:

- `planned`
- `in_progress`
- `series_review`
- `completed`
- `blocked`

## Quelle

- Auftrag:
- Storyboard-Datei:
- Storyboard-Format: `storyboard_json` oder `legacy_rows_json`
- JSON-Szene, Tabellenblatt oder strukturierter Auszug:
- Datum der Auswahl:

Die Szenenliste wird aus dem ausdrücklichen Auftrag übernommen. Der Orchestrator ergänzt oder errät keine weiteren Szenen.

## Szenenreihenfolge

| Position | Scene-ID | Storyboard-Referenz | Titel | Status | Viewer-Review | Handoff | Offene Punkte |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | `scene_XXX` |  |  | `pending` | `not_final/empty` | `assets/scenes/scene_XXX/handoff.md` |  |

Erlaubte Szenenstatus:

- `pending`
- `in_progress`
- `needs_revision`
- `completed`
- `blocked`

## Aktuelle Übergabe

- Aktive Scene-ID: `none`
- Letzte abgeschlossene Scene-ID:
- Nächste Scene-ID:
- Aktueller Worker:
- Letzte Statusänderung:

## Serienweite Entscheidungen

Hier stehen nur Entscheidungen, die für mehrere beauftragte Szenen gelten, zum Beispiel:

- verbindliche Referenzszenen
- wiederverwendete Komponenten
- gemeinsame Farb- oder Diagrammlogik
- ausdrücklich erlaubte Abweichungen

Szenenspezifische Entscheidungen gehören ausschließlich in das jeweilige `handoff.md`.

## Serienreview

Status: `not_started`

Geprüft werden nach Abschluss aller Szenen:

- konsistente Farbrollen, Typografie und Abstände
- einheitlicher Einsatz wiederkehrender Komponenten
- vergleichbare Diagramm-, Formel- und Pfeilgestaltung
- konsistente Diagrammgeometrie nach `workflow/diagram-guidelines.md`
- keine unbegründeten Stilwechsel
- keine widersprüchlichen Bezeichnungen oder Kernaussagen
- vollständige Handoffs und abgeschlossene Manifeste

Feststellungen:

Freigabe:
