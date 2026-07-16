# Formula Workflow

Diese Regeln gelten fuer mathematische Formeln, Parameterdefinitionen und Berechnungsschritte in SVG-Szenen.

## Grundsatz

Formeln werden didaktisch gesetzt, nicht dekorativ. Sie muessen zur Quelle und zum Sprechertext passen und fuer Basis-Seminar-Lernende schrittweise lesbar bleiben.

Nicht-triviale Formeln werden als kontrollierte LaTeX/Mathtext-SVG-Assets erzeugt. Sie werden nicht mehr von Hand aus einzelnen SVG-Text- oder Tspan-Elementen zusammengesetzt.

## Entscheidung

LaTeX/Mathtext-SVG verwenden, wenn eine Formel mindestens eines dieser Elemente enthaelt:

- Brueche, Wurzeln, Summen, Integrale oder komplexe Klammerterme,
- Exponenten oder Indizes mit mehr als einem Einzelzeichen,
- griechische Zeichen, Operatoren oder Funktionsschreibweisen wie `exp`, `ln`, `log`,
- Beispielrechnungen mit Naeherungszeichen, Einheiten oder Prozentwerten,
- jede Darstellung, die als normaler SVG-Text nach ASCII-Ersatz aussieht.

Native SVG-Textlabels sind erlaubt fuer:

- Achsenlabels wie `F(t)` oder `t`,
- einzelne Parameterlabels wie `T` oder `b`,
- kurze didaktische Beschriftungen, die keine gesetzte Formel sind.

Parameterdefinitionen werden nicht mit ASCII-Pfeilen wie `i -> Rangnummer...` gesetzt. Fuer solche Zuordnungen wird der wiederverwendbare Baustein `components/svg-library/definition-arrow.svg` als Inline-Pfeil verwendet.

## Vorgehen

1. Formel aus PDF/PNG/Sprechertext abgleichen.
2. Bedeutung klaeren: Was ist Ergebnis, was sind Parameter, was ist Zwischenschritt?
3. Sichtbare Schreibweise festlegen: exakt uebernehmen, vereinfachen oder didaktisch in mehrere Zeilen zerlegen.
4. Formel mit `components/formula-library/render_formula_svg.py` als transparentes SVG rendern.
5. Folienspezifisches Formelasset im Ordner der jeweiligen Folie ablegen, z.B. `rebuild-proposals/svg/<module_id>/slide_###/formulas/<formula_id>.svg`, und sprechend benennen.
6. Formel in die Szenen-SVG per `<image>` einbetten und mit `data-formula-asset` auf die Quelle verweisen.
7. Parameter direkt in der Naehe der Formel erklaeren, wenn sie fuer Einsteiger nicht offensichtlich sind.
8. Nach Rendern pruefen: Bruchstriche, Exponenten, Indizes, Klammern, Minuszeichen, Dezimaltrennzeichen.

## Darstellung

- Keine sichtbaren Folientitel, globalen Szenentitel, Modul-/Folien-Kicker, Workflow-Hinweise oder Fokuszeilen in die SVG-Grafik uebernehmen, ausser der Nutzer verlangt sie ausdruecklich als Teil der Grafik.
- Dezimaltrennzeichen und Einheiten wie in der Quelle oder im deutschen Seminarkontext verwenden.
- In LaTeX/Mathtext deutsche Dezimalkommas als `{,}` schreiben, zum Beispiel `85{,}8`.
- Exponentialfunktionen als gesetztes `e^{...}` oder `\exp(...)` schreiben, nicht als ASCII-Text wie `e^(-(t/8)^3)`.
- Parametererklaerungen mit Zuordnungslogik nutzen `components/svg-library/definition-arrow.svg`; primitive Textpfeile wie `->`, `=>` oder `-->` sind in sichtbarem SVG-Text nicht zulaessig.
- Lange Formeln lieber aufteilen als in kleine Schrift pressen.
- Wenn eine Formel als Transformationsschritt erklaert wird, muss die visuelle Reihenfolge der gesprochenen Reihenfolge folgen.
- Formel-SVGs bleiben transparent und werden nicht als PNG/JPG gerendert.
- Keine duennen dekorativen Aussenrahmen nur um die Formel selbst setzen. Wenn ein Berechnungsbereich didaktisch gruppiert werden muss, dann ueber klare Naehe, grosszuegige Abstaende oder eine ruhige Inhaltsflaeche; die Formel darf nicht wie ein kaputtes eingebettetes Bild oder ein Formularfeld wirken.

## Animation

Wenn Formelelemente zeitlich eingeblendet werden sollen, wird die Animation an der eingebetteten Formelgruppe oder am `<image data-formula-asset="...">` angebracht. Die Formel selbst bleibt ein eigenstaendiges SVG-Asset.

## QA

Eine Formel ist nicht fertig, wenn:

- Parameter im Sprechertext fehlen,
- ein Vorzeichen, Exponent, Index oder Dezimaltrennzeichen falsch ist,
- die Formel optisch ueberladen oder zu klein ist,
- Text oder Formelzeichen aus Boxen laufen,
- dekorative Formelrahmen die Lesbarkeit oder wissenschaftliche Wirkung verschlechtern,
- ein Rechenschritt sichtbar eine andere Aussage erzeugt als die Quelle,
- eine nicht-triviale Formel per normalem SVG-Text/Tspan nachgebaut wurde,
- eine Formel als Rasterbild exportiert wurde, obwohl ein SVG-Asset moeglich ist.
