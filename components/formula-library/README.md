# Formula Library

Diese Library erzeugt technische Formeln als saubere SVG-Assets. Sie ist fuer alle nicht-trivialen Formeln der Standardpfad in der Folienableitung.

## Einsatzregel

- Einfache Einzelzeichen und kurze Achsenlabels duerfen weiterhin als normales SVG-Textlabel gesetzt werden.
- Formeln mit Bruechen, Exponenten, Indizes, Wurzeln, griechischen Zeichen, Funktionen, Klammertermen oder Beispielrechnungen werden als LaTeX/Mathtext-SVG gerendert.
- Formelassets werden transparent exportiert und anschliessend als SVG in die Szenen eingebettet.
- Mathematische Glyphen werden als STIX-Pfade exportiert. Damit bleibt das Schriftbild in Browser, Viewer und Downstream-Rendering identisch.
- Die Einbettung skaliert nach der nominalen Grundschrift, nicht nach der individuellen Bounding-Box-Hoehe. So bleiben einfache Formeln, Brueche und Integrale optisch gleich gross.
- Keine Formel als PNG/JPG exportieren, ausser der Nutzer verlangt explizit ein Rasterbild.

## Struktur

- `render_formula_svg.py` rendert eine einzelne Formel als SVG.
- `tools/generate-re1-formula-assets.py` ist der kanonische Modul-1-Lauf: Er liest die
  Notation aus den szenenlokalen Datendateien, rendert alle Formelassets neu und
  bricht ab, wenn ein vorhandenes Asset nicht in der Generatorspezifikation erfasst ist.
- `formula-registry.json` dokumentiert wiederverwendbare Formeltypen und Ausgabeparameter.
- Folienspezifisch verwendete Formelassets liegen im Ordner der jeweiligen Folie,
  z.B. `rebuild-proposals/svg/<module_id>/slide_###/formulas/<formula_id>.svg`.
- Die Registry und der Renderer bleiben zentrale Quellen fuer Formeltyp, Stil und
  Renderparameter; die konkret erzeugte Formeldatei gehoert zur Folie, die sie nutzt.

## Beispiel

```powershell
py components\formula-library\render_formula_svg.py `
  --formula "$F(t)=1-\exp\left[-\left(\frac{t}{8}\right)^3\right]$" `
  --output rebuild-proposals\svg\RE3_TEST_1\slide_007\formulas\weibull_function.svg `
  --fontsize 34
```

## QA

Nach dem Rendern pruefen:

- Bruchstriche, Exponenten und Indizes sind optisch gesetzt, nicht per ASCII-Ersatz geschrieben.
- Dezimaltrennzeichen folgen dem deutschen Seminarkontext.
- Die Formel ist in der geplanten Foliengroesse noch lesbar.
- Die SVG enthaelt keinen sichtbaren Hintergrund.
