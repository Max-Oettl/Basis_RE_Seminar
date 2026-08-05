# RelTest Pictogram Library (Legacy SVG)

Diese Bibliothek enthaelt bestehende SVG-Piktogramme aus frueheren
Produktionsstaenden. Sie darf fuer neue oder geaenderte Szenen nicht mehr als
Piktogrammquelle verwendet werden. Neue Piktogramme werden als generierte PNGs
unter `components/image-library/generated-pictograms/` produziert.

- Verbindlicher Stil und Produktionsablauf:
  `workflow/30-visual-decision/pictogram-creation-workflow.md`.
- Aktives Stilprofil: `reltest-education-minimal-v1` aus
  `brand/reltest-education-pictogram-tokens.json`.
- `pictogram-registry.json` ist die verbindliche Bedeutungs- und
  Wiederverwendungsregistrierung. Kein neues Motiv ohne `meaning`,
  `preferredLabels` und `avoidFor`.
- Kanonisches Raster: 24 x 24, Strichstaerke 1.8, runde Linienenden und
  Linienverbindungen, flache frontale beziehungsweise orthografische Ansicht.
- Marineblau ist die Grundfarbe. Signalgruen und Statusfarben werden nur
  semantisch eingesetzt; Stahlcyan ist kein allgemeiner Icon-Akzent.
- Piktogramme nur als fachliche visuelle Anker verwenden.
- Innerhalb einer Folie dieselbe Strich-, Groessen- und Farbsemantik beibehalten.
- Textliche Eindeutigkeit erhalten; Piktogramme ersetzen keine notwendige Fachinformation.
- Komplexe, realistische oder markenspezifische Motive nicht in dieser Bibliothek improvisieren, sondern ueber den Asset-Workflow behandeln.
- Keine Verlaeufe, Schatten, 3D-, Isometrie-, Textur-, Glow-, Emoji- oder
  Stickeroptik verwenden.
- Universelle kompakte Icons bei 32 px, konkrete Standardpiktogramme bei 48 px
  und jede Einbindung im 960x540-Szenenrender pruefen.

Bestehende Fachanker bleiben nur fuer unveraenderte Legacy-Szenen erhalten.

Automatische Bibliothekspruefung:

```powershell
node components/pictogram-library/reltest-pictograms.test.js
node tools/pictogram-qa.test.js
```
