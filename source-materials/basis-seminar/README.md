# Basis Seminar Source Materials

Dieser Ordner ist die neue kanonische Ablage fuer Basis-Seminar-Quellen.

## Aktive Struktur

```text
source-materials/basis-seminar/
  powerpoint-svg/
    RE1/
      SVG/
        <PowerPoint-Export>.svg
      Text/
        <Sprechertext>.docx
    RE2/
      SVG/
      Text/
    RE3/
      SVG/
      Text/
    RE4/
      SVG/
      Text/
    RE5/
      SVG/
      Text/
```

## Pflichtquellen Pro Modul

- eine aus PowerPoint exportierte `.svg` pro Ursprungsfolie
- ein eindeutig zuordenbares `.docx` mit dem gesprochenen Text pro Ursprungsfolie

Der Sprechertext wird vor jeder SVG-Sequenzanalyse nach `analysis/source-text/<module_id>/` extrahiert und in `analysis/inventories/<module_id>_svg-text-map.json` eindeutig mit den Quell-SVGs verbunden. Die Originale bleiben unveraendert.

## Legacy-Ablagen

Ordner wie `pptx/`, `pdf/`, `png/` oder eine separate `narration/`-Ablage sind kein Bestandteil des neuen Inputs. Falls sie in einem Altbestand noch vorhanden sind, werden sie fuer neue Transformationsauftraege ignoriert.

## Optionale Bildassets

Komplexe Bilder, Screenshots oder andere lokale Referenzen sollen nach Moeglichkeit bereits in der Quell-SVG eingebettet sein. Falls ein PowerPoint-Export lokale Dateien benoetigt, liegen sie im Modulordner unter:

```text
source-materials/basis-seminar/powerpoint-svg/<module_id>/SVG/assets/
```

Codex dokumentiert im Transformationsplan, ob ein Bild direkt aus der Quell-SVG uebernommen, lokal aufgeloest, vom Nutzer nachgereicht oder technisch ersetzt werden muss.

## Regeln

- Die einzige aktive Kursgliederung sind die Modulordner `RE1` bis `RE5`.
- Eine alte Aufteilung in PowerPoint-Dateien wird nicht rekonstruiert.
- `SVG/` und `Text/` sind Pflichtunterordner.
- Fehlende oder mehrdeutige SVG-Text-Zuordnungen blockieren Sequenzplanung und Produktion.
