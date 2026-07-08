# Trigger-Spezifikation

Dieses Verzeichnis sammelt die verbindlichen Regeln für Sprechertext-basierte Animationstrigger.

Die Hauptkonvention steht in:

- `trigger-specs/speaker-text-trigger-conventions.md`

## Verbindlicher Standard

Animationen werden produktiv nicht über feste Sekunden, Frames oder Wort-Indizes definiert.

Stattdessen gilt:

1. Die SVG-Datei enthält stabile IDs und sinnvolle `<g id="...">`-Gruppen.
2. Die Animation-Draft-Struktur steht extern in `assets/scenes/<scene_id>/composed/scene.animation.v1.json`.
3. `scene.animation.v1.json` trennt `targets[]` für bewertete SVG-Ziele und `steps[]` für Animationen.
4. Die spätere Video-Pipeline berechnet finale Zeitpunkte aus dem TTS-Ergebnis, z. B. aus `lesson.words.json`.

## Standarddatei Pro Szene

```text
assets/
  scenes/
    scene_005/
      composed/
        scene.svg
        scene.animation.v1.json
```

## Erlaubte Aktionen

Nur diese Aktionen dürfen vorgeschlagen werden:

- `show`
- `hide`
- `highlight`
- `draw`

## Mindeststruktur

```json
{
  "schemaVersion": "svgAnimationManifest/v1",
  "svgPath": "scene.svg",
  "targets": [
    {
      "targetId": "card_complete_data",
      "label": "Karte vollständige Daten",
      "status": "animated",
      "confidence": "high"
    }
  ],
  "steps": [
    {
      "stepId": "02",
      "targetId": "card_complete_data",
      "action": "show",
      "sourceText": "vollständige Ausfallzeiten",
      "enterFrames": 14,
      "confidence": "high"
    }
  ]
}
```

## SVG-Regel

Das Animationsziel ist die passende Gruppe, wenn mehrere Elemente gemeinsam erscheinen sollen.

Beispiel:

```xml
<g id="card_complete_data">
  <rect id="card_complete_data_panel" />
  <text id="complete_title">Vollständig</text>
  <g id="complete_data_timeline">...</g>
</g>
```

Wenn die gesamte Karte erscheinen soll, ist `card_complete_data` das `targetId`.

## Preview-Timings

Lokale Time-Trigger wie `data-time-trigger="1.3s"` oder SVG-SMIL-Animationen sind nicht Teil des Standards.

Die Animation wird ausschließlich über `composed/scene.animation.v1.json` beschrieben.

## Freigabeprüfung

Vor Freigabe prüfen:

- Jedes `targetId` existiert in der SVG.
- Jedes `steps[].targetId` ist in `targets[]` als `animated` bewertet.
- Jede `sourceText`-Phrase basiert auf dem Sprechertext.
- Jeder Step nutzt nur `show`, `hide`, `highlight` oder `draw`.
- Jeder Step und jedes Target hat `confidence` als `high`, `medium` oder `low`.
- Es gibt keine finalen Sekunden-, Frame- oder Wort-Index-Werte.
