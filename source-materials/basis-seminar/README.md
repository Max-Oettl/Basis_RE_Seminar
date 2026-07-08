# Basis Seminar Source Materials

Dieser Ordner ist die neue kanonische Ablage fuer Basis-Seminar-Quellen.

## Erwartete Struktur

```text
source-materials/basis-seminar/
  pptx/
    RE1.pptx
  pdf/
    RE1.pdf
  png/
    RE1/
      slide_001.png
      slide_002.png
  narration/
    RE1/
      01_Modul.md
  extracted-assets/
    RE1/
      slide_012_image_01.png
```

## Pflichtquellen

- PowerPoint-Datei `.pptx`
- PDF-Export `.pdf`
- PNG-Export pro Folie `.png`
- freigegebener Sprechertext `.md`

## Optionale Bildassets

Komplexe Bilder, Screenshots oder aus Folien gecroppte Darstellungen gehoeren nach:

```text
source-materials/basis-seminar/extracted-assets/<module_id>/
```

Codex dokumentiert im Rebuild-JSON, ob ein Bild uebernommen, als Screenshot/Crop extrahiert, vom Nutzer nachgereicht oder als SVG/Text neu aufgebaut werden soll.

## Regel

Neue oder bereinigte Sprechertextablagen sollen hier unter `source-materials/basis-seminar/narration/` landen.
