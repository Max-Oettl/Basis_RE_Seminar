# Agent: Animation Trigger Planner

## Ziel

Der Animation Trigger Planner bereitet SVGs so vor, dass die spätere Video-Pipeline Animationen über Sprechertext-Trigger auslösen kann.

Die verbindliche technische Grundlage ist:

- `trigger-specs/speaker-text-trigger-conventions.md`

## Verantwortlichkeiten

- Potenzielle Triggerpunkte aus Sprechertext oder Storyboard ableiten.
- Sichtbare Elemente in didaktisch sinnvolle Animationsziele aufteilen.
- Stabile SVG-IDs und Gruppenziele prüfen.
- Für jede Animation einen Vorschlag in `composed/scene.animation.v1.json` vorbereiten.
- Alle relevanten SVG-Ziele in `targets[]` als `animated` oder `ignored` bewerten.
- Trigger-Phrasen aus dem Sprechertext wählen.
- Confidence-Werte vergeben.
- Unsichere Trigger klar markieren.
- Keine finalen Sekunden, Frames oder Wort-Indizes erzeugen.
- Keine produktive Trigger-Logik direkt ins SVG schreiben.

## SVG-Regeln

Animierbare Elemente brauchen stabile, eindeutige und sprechende IDs.

Wenn mehrere Elemente gemeinsam erscheinen sollen, ist die gemeinsame Gruppe das Animationsziel.

Beispiel:

```xml
<g id="bullet_01">
  <rect id="bullet_01_bg" />
  <text id="bullet_01_text">Erster Punkt</text>
</g>
```

Dann wird `bullet_01` getriggert, nicht `bullet_01_text`.

Bei eingebundenen PNGs liegt der Trigger normalerweise auf der umgebenden Gruppe:

```xml
<g id="source_field_data_card">
  <image id="source_field_data_image" href="../pictograms/field_vehicle.png" />
  <text id="source_field_data_title">Felddaten</text>
</g>
```

## Erlaubte Aktionen

Der Agent darf nur diese Aktionen vorschlagen:

- `show`
- `hide`
- `highlight`
- `draw`

## Trigger-Qualität

Ein guter Trigger ist eine kurze Phrase, die im Sprechertext vorkommt und eindeutig zum visuellen Moment passt.

Gute Trigger:

- `Der erste Schritt`
- `vollständige Ausfallzeiten`
- `rechtszensiert`
- `die Verbindung`

Schlechte Trigger:

- `und`
- `das`
- `hier`
- mehrfach vorkommende Einzelwörter
- frei erfundene Formulierungen

## Confidence

- `high`: Trigger-Phrase ist eindeutig und fachlich passend.
- `medium`: Trigger ist plausibel, aber mit finalem Sprechertext zu prüfen.
- `low`: Trigger ist unsicher und braucht manuelle Freigabe.

Bei `low` muss eine Begründung stehen.

## Output

Der Agent erstellt oder aktualisiert pro Szene:

```text
assets/scenes/<scene_id>/composed/scene.animation.v1.json
```

`scene.animation.v1.json` ist die primäre Reviewer-Datei:

```json
{
  "schemaVersion": "svgAnimationManifest/v1",
  "svgPath": "scene.svg",
  "defaults": {
    "enterFrames": 14,
    "highlightDurFrames": 24,
    "drawDurFrames": 36
  },
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
      "fromY": 18,
      "confidence": "high"
    }
  ]
}
```

## Preview-Timings

Zeitbasierte SVG-Animationen sind nicht Teil des Standards.

Die Reviewer-Datei ist immer `scene.animation.v1.json`.
