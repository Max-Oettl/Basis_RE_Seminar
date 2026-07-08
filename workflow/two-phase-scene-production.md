# Two-Phase Scene Production Workflow

Dieses Repo verwendet ab jetzt einen zweiphasigen Workflow.

Bei einer Serie aus mehreren Szenen wird dieser Workflow strikt Szene für Szene nach `workflow/scene-by-scene-production-runbook.md` ausgeführt. Die nächste Szene beginnt erst nach vollständiger Freigabe und dokumentiertem Handoff der aktuellen Szene.

## Phase 1: Asset-Entscheidung Und Optionale PNG-Erstellung

Ziel dieser Phase ist eine dokumentierte Assetstrategie. Wenn PNG-Piktogramme benötigt werden, entsteht ein Set geprüfter Einzelassets. Wenn Diagramme, Formen, Text und vorhandene Komponenten ausreichen, darf die Szene vollständig SVG-nativ gebaut werden.

Für benötigte PNG-Assets gilt:

- einfache isolierte Basiselemente
- keine komplette Folie
- kein vollständiges Szenenlayout
- kein Text im Bild
- transparenter Hintergrund
- visuell prüfbar vor der SVG-Komposition

Beispiel:

Für `Aufnahme von Felddaten` entstehen einzelne Assets wie:

- `car.png`
- `tablet.png`
- `measurement_device.png`
- `field_worker.png`

Diese Dateien werden unter `assets/scenes/<scene_id>/pictograms/` gespeichert.

## Phase 2: SVG-Komposition Nach Manueller Prüfung

Erst nach Freigabe der PNG-Assets wird ein SVG gebaut.

Das SVG dient als:

- Layoutcontainer
- Preview-Animationscontainer
- strukturell vorbereiteter Triggercontainer

Im SVG werden die PNGs per `<image>` eingebunden. Zusätzlich können SVG-native Elemente ergänzt werden:

- Boxen
- Kacheln
- Texte
- Pfeile
- Achsen
- Hintergründe
- Hervorhebungen

Produktive Animationen werden nicht über feste Sekunden im SVG definiert.

Die SVG stellt stabile IDs und sinnvolle Gruppen bereit. Die eigentlichen Sprechertext-Trigger werden extern in `composed/scene.animation.v1.json` dokumentiert.

Trigger erfolgen standardmäßig auf Gruppen-, Karten- oder Bildebene.

Vor Freigabe der SVG muss das Qualitätsgate aus `workflow/graphic-creation-quality-gate.md` bestanden werden. Besonders zu prüfen sind:

- keine automatisch gesetzten Folienüberschriften
- Pfeilspitzen ohne sichtbare Linienüberstände
- bewusste Layer-Reihenfolge
- Highlight-Flächen hinter Texten und wichtigen Markern
- keine ungewollten Überlappungen
- korrekte Umlaute, Formeln und Encoding

## Standard-Dateien Pro Szene

```text
assets/
  scenes/
    scene_006/
      pictograms/
      manifest.json
      prompts.json
      handoff.md
      preview/
        overview.html
      composed/
        scene.svg
        scene.animation.v1.json
```

## Sprechertext-Trigger

Für jede produktive Szene gilt:

- Keine finalen Sekundenwerte erzeugen.
- Keine finalen Frame-Werte erzeugen.
- Keine finalen Wort-Indizes erzeugen.
- Keine produktive Trigger-Logik direkt in die SVG einbauen.
- `composed/scene.animation.v1.json` mit `targets[]` und `steps[]` vorbereiten.
- Nur die Aktionen `show`, `hide`, `highlight` und `draw` vorschlagen.

Die verbindliche Detailkonvention steht in:

- `trigger-specs/speaker-text-trigger-conventions.md`

## Manuelles Freigabe-Gate

Eine Szene darf erst komponiert werden, wenn im `manifest.json` alle benötigten Assets den Status `accepted` haben.

Mögliche Asset-Status:

- `planned`
- `generated`
- `needs_revision`
- `accepted`
- `rejected`

## Kein Standard-Vectorizing

PNG-Piktogramme werden nicht automatisch in SVG-Pfade umgewandelt.

Wichtige Icons können später optional vektorisiert werden, wenn:

- sie sehr häufig wiederverwendet werden,
- sie einzeln animiert werden müssen,
- oder sie farblich stark editierbar sein sollen.

Das ist aber nicht Teil des Standardworkflows.
