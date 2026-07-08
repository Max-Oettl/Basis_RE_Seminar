# Basis Seminar Rebuild Analyse

Dieses Repo ist jetzt das Arbeitsrepo fuer eine neue Version des bestehenden Basis-Seminars `Reliability Engineer`.

Der Primaerworkflow ist nicht mehr die freie Erstellung eines Expertentrainings. Codex soll vorhandene Basis-Seminar-Folien aus mehreren Quellen auswerten und daraus praezise Rebuild-Spezifikationen erzeugen.

## Fuehrender Workflow

Verbindlich ist der Basis-Seminar-Rebuild:

1. Originalquellen pro Folie sammeln: PowerPoint, PDF, PNG-Export und freigegebener Sprechertext.
2. Quellen gegeneinander pruefen.
3. Sichtbaren Inhalt, Layout, Objektstruktur, Animationen und Sprechertext-Verknuepfung dokumentieren.
4. Pro Folie eine Rebuild-JSON-Datei nach `workflow/slide-rebuild-json-contract.md` erzeugen.
5. Pro Modul einen kurzen QA-/Modulreport erstellen.

Die wichtigste Regel: Der Sprechertext bleibt unveraendert. Er wird verknuepft, nicht neu geschrieben.

## Quellenrangfolge

Wenn Quellen voneinander abweichen, gilt:

1. Sprechertext-Datei gewinnt fuer gesprochenen Text.
2. PNG gewinnt fuer sichtbaren Zustand, Layoutgewichtung und visuelle Wahrheit.
3. PDF gewinnt fuer final gerenderten Text, Formeln und Seitenreihenfolge.
4. PPTX gewinnt fuer Objektstruktur, Koordinaten, Ebenen, Gruppen und Animationen.

Abweichungen werden in `qa.issues` dokumentiert, nicht stillschweigend geglaettet.

## Neue Standardablage

```text
source-materials/
  basis-seminar/
    pptx/
    pdf/
    png/
    narration/
    extracted-assets/

analysis/
  inventories/
  slides/
  modules/
  reports/
  slide-rebuild.schema.json

rebuild-proposals/
  svg/
    RE1/
      slide_001.svg
```

Neue oder neu sortierte Basis-Seminar-Quellen sollen unter `source-materials/basis-seminar/` abgelegt werden.

## Wichtige Dateien

- `AGENT.md`: verpflichtende Arbeitsregeln fuer Codex in diesem Repo.
- `workflow/basis-seminar-slide-rebuild-runbook.md`: Ablauf fuer die Folienanalyse.
- `workflow/slide-rebuild-json-contract.md`: JSON-Vertrag pro Folie.
- `analysis/slide-rebuild.schema.json`: maschinenlesbares Schema fuer Rebuild-JSON.
- `templates/slide-inventory-template.json`: Starttemplate fuer ein Modul-/Folieninventar.
- `templates/slide-rebuild-template.json`: Starttemplate fuer eine Folienanalyse.
- `templates/module-rebuild-report-template.md`: Template fuer Modulreports.
- `source-materials/basis-seminar/README.md`: erwartete Quellenstruktur.
- `tools/basis-rebuild-viewer/`: lokaler Viewer fuer Abgleich alte Folie gegen neuen SVG-Vorschlag.
- `rebuild-proposals/svg/`: Ablage fuer neue SVG-Vorschlaege.

## Basis Rebuild Viewer

Der neue Viewer startet unter Windows mit:

```text
start-basis-rebuild-viewer.cmd
```

Standardadresse:

```text
http://127.0.0.1:4174
```

Der Viewer zeigt pro Folie:

- alte Foliengrafik aus `source-materials/basis-seminar/png/<module_id>/`
- neuen SVG-Vorschlag aus `rebuild-proposals/svg/<module_id>/`
- Analyse-JSON aus `analysis/slides/` oder `analysis/modules/`
- QA-Issues, offene Fragen, Bildasset-Hinweise und sichtbaren Text
- Review-Notizen unter `analysis/viewer-notes/`

Fuer den visuellen Abgleich gibt es eine Nebenansicht und eine Overlay-Ansicht mit Deckkraftregler.

## Aktueller Migrationsstand

Der erste Repo-Umzug stellt die Leitplanken vom alten `Life Data Expert`-Storyboard-/SVG-Workflow auf Basis-Seminar-Rebuild-Analyse um.

Noch offen fuer echte Folienanalyse:

- PowerPoint-Dateien je Modul
- PDF-Exporte je Modul
- PNG-Exporte pro Folie
- freigegebene Sprechertextdateien je Modul
- eindeutige Zuordnung der Sprechertextdateien zu Folien/Szenen
- optionale wiederverwendbare Bildassets oder markierte Screenshots komplexer Darstellungen

Sobald diese Quellen im Repo liegen, kann pro Modul das Slide-Inventar und danach die erste Rebuild-JSON-Serie entstehen.
