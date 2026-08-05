# PowerPoint SVG Input

Dieser Ordner ist der kanonische visuelle Eingang fuer neue Basis-Seminar-Module.

## Ablage

```text
powerpoint-svg/
  RE1/
    SVG/
      <PowerPoint-Export>.svg
      assets/
        <optional lokale Quelldateien>
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

Beispiel:

```text
source-materials/basis-seminar/powerpoint-svg/RE3/SVG/Folie 001.svg
source-materials/basis-seminar/powerpoint-svg/RE3/Text/Folie 001.docx
```

## Pflichtregeln

- Eine aus PowerPoint exportierte SVG entspricht genau einer Ursprungsfolie.
- Modulordner verwenden genau die stabilen Modul-IDs `RE1` bis `RE5`.
- Jede Quell-SVG liegt unter `SVG/`; der zugehoerige Word-Sprechertext liegt unter `Text/`.
- Gleiche Dateistaemme fuer SVG und DOCX werden empfohlen. Abweichende Namen muessen eindeutig gemappt werden koennen.
- Foliennummern entsprechen der Reihenfolge im PowerPoint-Ursprung.
- Die SVG muss als XML lesbar sein. Eine vorhandene `viewBox` ist bevorzugt. Fehlt sie, sind eindeutige numerische Werte fuer `width` und `height` Pflicht; der Intake dokumentiert dann eine abgeleitete `viewBox` `0 0 <width> <height>` als Warnung, ohne die Quelle zu veraendern.
- Quell-SVGs werden nicht manuell korrigiert oder ueberschrieben.
- Word-Dokumente werden nicht manuell bereinigt oder ueberschrieben.
- Externe Referenzen muessen relativ und innerhalb desselben Modulordners aufloesbar sein. Eingebettete Bilder sind bevorzugt.
- Mehrere Quell-SVGs duerfen spaeter zu einem animierten Ziel-SVG zusammengefuehrt werden. Die Originaldateien bleiben trotzdem einzeln erhalten.

## Nicht Mehr Erforderlich

Fuer neue Module werden weder PPTX-, PDF- noch PNG-Dateien oder ein separater Narration-Ordner ausgewertet. Die fruehere Gliederung in mehrere PowerPoint-Dateien wird nicht wiederhergestellt.

## Naechster Verarbeitungsschritt

Nach dem Ablegen werden zuerst die Word-Dokumente extrahiert und mit den einzelnen SVGs gemappt. Fuehrend ist `workflow/10-source-analysis/source-text-docx-intake-and-mapping.md`. Erst bei vollstaendigem Mapping folgen Quell-SVG-Inventar und Sequenzplan.
