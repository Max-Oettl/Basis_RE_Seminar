# Decision 0005: Zweiphasiger Asset- und SVG-Workflow

## Status

Akzeptiert

## Kontext

Der bisherige Prozess erzeugte SVGs direkt aus Storyboard-Zeilen. Das führte dazu, dass komplexe Piktogramme in SVG aus einfachen Grundformen nachgebaut wurden und die visuelle Qualität nicht zuverlässig erreicht wurde.

Außerdem müssen nicht alle Bilddetails einzeln animierbar sein. In vielen Szenen reicht es, ganze Karten, Gruppen oder Bilder nacheinander einzublenden.

## Entscheidung

Der Standardworkflow wird in zwei Phasen getrennt:

1. Pro Szene werden transparente PNG-Piktogramme als isolierte Basiselemente erzeugt.
2. Nach manueller Freigabe dieser PNGs wird ein SVG als Layout- und Animationscontainer gebaut.

PNGs werden im SVG per `<image>` eingebunden. Texte, Boxen, Pfeile, Achsen, Hintergründe und Triggergruppen bleiben SVG-nativ.

## Konsequenzen

- Der Standard ist nicht mehr reines SVG.
- SVGs müssen nicht mehr komplexe Piktogramme aus Grundformen rekonstruieren.
- PNG-Assets können vor der Komposition geprüft werden.
- Animationen laufen standardmäßig auf Karten-, Gruppen- oder Bildebene.
- Wichtige Icons können später optional vektorisiert werden, aber nicht automatisch.

## Neue Standardstruktur

```text
assets/scenes/<scene_id>/
  pictograms/
  manifest.json
  prompts.json
  preview/
  composed/
```

