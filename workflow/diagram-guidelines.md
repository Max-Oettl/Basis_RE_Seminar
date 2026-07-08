# Richtlinie Für Diagramme Und Verteilungen

Diese Richtlinie ist für alle Szenen verbindlich, die Verteilungen, Funktionsgraphen, Regressionslinien, Zuverlässigkeitskurven, Wahrscheinlichkeitsnetze oder andere Darstellungen mit Koordinatenachsen enthalten.

Sie gilt für Art Direction, fachliche Prüfung, SVG-Komposition, visuelles Review und technische Validierung.

## 0. Python-First Fuer Technische Diagramme

Echte technische Diagramme werden zuerst ueber `components/python-plot-library/` erzeugt. Das gilt fuer Achsendiagramme, Verteilungen, Regressionslinien, Weibull-Wahrscheinlichkeitsnetze, Konfidenzbaender und vergleichbare technische Plots.

Generische Timelines, Aufbauachsen und Ausfall-Zeitstrahlen sind keine Python-Plots. Sie werden als didaktische SVG-Komposition geplant, weil Animation, Hervorhebung und Folienlayout dort wichtiger sind als ein wissenschaftlicher Plot.

Pflichtablauf:

1. `components/python-plot-library/diagram-registry.json` pruefen.
2. Vorhandenen Generator mit konkreten Daten, Achsenlabels und Einheiten nutzen.
3. Wenn kein Generator passt, einen neuen Python-Generator in `components/python-plot-library/` erstellen und im Registry dokumentieren.
4. `reltest_plot_style.py` verwenden, damit Achsen, Schriften, Gridlines, Farben und Exporte einheitlich bleiben.
5. Erzeugten Plot als SVG-Asset rendern und im Szenen-SVG verwenden oder mit SVG-nativen Callouts ergaenzen.

Python-Plots tragen keinen sichtbaren Titel. Folien- oder Szenentitel werden ausserhalb des Plotassets gesetzt, wenn sie gebraucht werden.

Sichtbare deutsche Plotlabels verwenden echte Umlaute und `ß`; Ersatzschreibungen wie `ae`, `oe`, `ue` oder `ss` sind fuer deutsche Woerter in Plotlabels nicht zulaessig.

Python-Plotgeneratoren exportieren ausschliesslich SVG. Falls fuer Review oder QA ein PNG benoetigt wird, wird es ausserhalb des Plotgenerators aus dem SVG erzeugt. Animierbare Plot-SVGs folgen vorlaeufig `components/python-plot-library/svg-animation-structure.provisional.md`: gewuenschte Plot-Elemente werden als stabile SVG-Targets vorbereitet und koennen ueber Zeittrigger, zum Beispiel nach 3 Sekunden, eingeblendet werden. Ob ein Element animiert werden soll, wird direkt beim Erstellen oder nachtraeglich in den Verbesserungsnotizen festgelegt.

Da Python-Plots im Seminar oft kleiner skaliert und als Erklaervisualisierung genutzt werden, muessen Achsenbeschriftungen, Ticklabels und Legenden auch bei reduzierter Darstellungsbreite lesbar bleiben. Der zentrale Stil `reltest_plot_style.py` setzt diese Elemente bewusst groesser als klassische Paper-Abbildungen. Neue Generatoren duerfen diese Schriftgroessen nicht lokal verkleinern, ausser der Szenenbrief begruendet es.

Bei Vertrauensgrenzen in Weibull- oder vergleichbaren Wahrscheinlichkeitsnetzen werden typischerweise die 5 %- und 95 %-Grenzkurven als klare Linien gezeichnet. Gefuellte Vertrauensbaender oder zufaellig wirkende Flaechen sind fuer diese Darstellung nicht zulaessig, wenn explizit Vertrauensgrenzen gefragt sind. Bootstrap-basierte Grenzen muessen ueber festen Seed und dokumentierte Samplezahl reproduzierbar erzeugt werden. Fuer Weibull-Vertrauensgrenzen gilt `components/python-plot-library/weibull_confidence_plot.py` als kanonische Darstellung: blauer Fit, offene rote Ausfallpunkte und zwei graue, gestrichelte, nicht-parallele 5 %- und 95 %-Bootstrap-Grenzkurven. Klassische lineare Regressions-Vertrauenslinien ersetzen diese Darstellung nicht.

Handgezeichnete SVG-Diagramme sind nur noch fuer bewusst einfache Erklaerskizzen zulaessig. Diese Ausnahme muss im Szenenbrief begruendet werden.

## 1. Diagrammtyp Dokumentieren

Vor der Komposition wird im `handoff.md` festgelegt:

- `diagram_type: technical` für fachliche Diagramme mit ablesbarer Bedeutung
- `diagram_type: sketch` nur für bewusst schematische Darstellungen ohne Anspruch auf ablesbare Werte
- Bezeichnungen und gegebenenfalls Einheiten von x- und y-Achse
- welche Punkte auf einem Graphen liegen müssen
- welcher Endmodus für vertikale Markerlinien verwendet wird

`sketch` ist eine begründete Ausnahme, kein Standard. Die Begründung muss im Handoff stehen.

## 2. Achsen Und Pfeilspitzen

Diese Regeln gelten fuer SVG-native Erklaerskizzen. Python-Plots folgen dem einheitlichen Engineering-Plot-Stil aus `reltest_plot_style.py`; dort sind klassische Matplotlib-Achsen ohne Pfeilspitzen zulaessig und ausdruecklich bevorzugt, wenn sie wissenschaftlicher wirken.

- Jede sichtbare Koordinatenachse besitzt am Richtungsende eine Pfeilspitze.
- Die Spitze des Pfeils liegt exakt am vorgesehenen Ende der Achse.
- Die Achsenlinie endet an der Basis der Pfeilspitze. Zwischen Linie und Spitze gibt es weder eine sichtbare Lücke noch einen Linienüberstand.
- Die Pfeilspitze darf nicht nachträglich neben eine bereits abgeschlossene Achsenlinie gesetzt werden.
- Bei einer Achse mit zwei dargestellten Richtungen werden beide Richtungsenden mit Pfeilspitzen versehen.
- Tickmarks, Rasterlinien und Labels dürfen die Pfeilspitze nicht berühren oder verdecken.

Bevorzugte SVG-Konstruktion:

```xml
<g id="x_axis">
  <line class="axis-line" x1="220" y1="690" x2="1130" y2="690" />
  <polygon class="axis-head" points="1155,690 1130,678 1130,702" />
</g>
```

In diesem Beispiel ist `1155,690` das tatsächliche Ende der Achse. Die Linie endet an der Basis der Pfeilspitze bei `x=1130`.

## 3. Achsenbeschriftungen

- Fachliche Diagramme beschriften grundsätzlich jede dargestellte x- und y-Achse.
- Die Beschriftung nennt die dargestellte Größe und, wenn relevant, die Einheit.
- Bei Verteilungen muss eindeutig sein, ob die y-Achse Dichte, Wahrscheinlichkeit, kumulierte Wahrscheinlichkeit oder eine andere Größe zeigt.
- Der Achsentitel wird geometrisch in der Mitte des geraden Achsenstrichs ausgerichtet. Die Pfeilspitze gehört nicht zur für die Zentrierung verwendeten Länge.
- Der Titel der x-Achse steht horizontal mittig unter dem Achsenstrich.
- Der Titel der y-Achse steht vertikal mittig neben dem Achsenstrich und wird standardmäßig um `-90°` gedreht.
- Falls eine Drehung bei einer ausdrücklich schematischen Darstellung die Lesbarkeit deutlich verschlechtert, darf der y-Achsentitel horizontal gesetzt werden. Er bleibt dennoch auf die Mitte des y-Achsenstrichs ausgerichtet und die Ausnahme wird im Handoff dokumentiert.
- Achsentitel stehen nah genug an der Achse, um eindeutig zugeordnet zu sein, kollidieren aber nicht mit Tickmarks, Tick-Labels oder Pfeilspitzen.
- Ein fehlendes Achsenlabel ist nur bei `diagram_type: sketch` zulässig und muss im Handoff begründet werden.
- Auch bei Skizzen bleiben Achsenpfeile verpflichtend.

Für einen Achsenstrich von `(x1, y1)` bis `(x2, y2)` wird die Mitte aus den Linienendpunkten berechnet:

```text
label_x = (x1 + x2) / 2
label_y = (y1 + y2) / 2
```

Die Position wird nicht nach Augenmaß und nicht anhand der gesamten Diagrammkarte bestimmt.

## 4. Graphen Und Punkte

- Punkte, die laut Aussage auf einem Graphen, einer Kurve oder einer Geraden liegen, müssen geometrisch exakt auf diesem Graphen liegen.
- Punktkoordinaten werden aus derselben Geometrie wie der Graph abgeleitet. Eine rein visuelle Platzierung nach Augenmaß reicht nicht aus.
- Bei einer Geraden wird der y-Wert des Punktes aus derselben Geradengleichung oder denselben Endpunkten berechnet.
- Bei einer Kurve wird der Punkt aus dem Kurvenpfad oder der zugrunde liegenden Funktion abgeleitet.
- Ein Punkt darf neben dem Graphen liegen, wenn er ausdrücklich einen Messwert, ein Residuum oder eine Abweichung darstellt. Diese Abweichung muss didaktisch erkennbar sein.
- Punkte, die nur Teil einer Punktewolke sind, werden nicht fälschlich als Punkte auf der Regressionslinie bezeichnet.

Stop-Gate:

- Kein Punkt, der den Graphen repräsentiert, schwebt sichtbar darüber oder darunter.
- Die Prüfung erfolgt im gerenderten SVG bei Zielauflösung, nicht nur im Quelltext.

## 5. Vertikale Markerlinien

Vertikale Markerlinien kennzeichnen einen konkreten x-Achsen-Wert, beispielsweise Median, Mittelwert, Modalwert, Quantil oder Schwellenwert.

Für jede Markerlinie gilt:

- Die x-Koordinate der Linie stimmt exakt mit dem gekennzeichneten Punkt auf der x-Achse überein.
- Die Linie beginnt exakt an der x-Achse. Sie startet weder oberhalb mit einer Lücke noch ragt sie unter die Achse.
- Tickmark, Markerlinie und zugehöriges x-Label verwenden dieselbe x-Koordinate.

Pro Diagramm wird genau einer dieser Endmodi verwendet:

1. `curve_intersection`: Jede Markerlinie endet exakt an der zugehörigen Graphen- oder Kurvenlinie.
2. `common_height`: Alle Markerlinien enden auf exakt derselben Höhe oberhalb des gesamten relevanten Graphenverlaufs.

Zusätzliche Regeln:

- Die beiden Endmodi werden innerhalb desselben Diagramms nicht gemischt, außer die fachliche Aussage erfordert es ausdrücklich und die Ausnahme ist im Handoff dokumentiert.
- Bei `curve_intersection` darf keine Markerlinie über die Kurve hinausragen oder kurz davor enden.
- Bei `common_height` müssen alle oberen Endpunkte dieselbe y-Koordinate besitzen.
- Labels stehen eindeutig am Marker oder am zugehörigen x-Achsen-Wert und kollidieren nicht mit Kurve, Achse oder anderen Labels.

## 6. Fachliche Plausibilität

- Achsenskalierung, Einheiten und Kurvenverlauf müssen zur fachlichen Aussage passen.
- Schematische Verteilungen dürfen vereinfacht sein, dürfen aber keine falsche Bedeutung nahelegen.
- Dichte und Wahrscheinlichkeit werden nicht gleichgesetzt.
- Bei kumulierten Verteilungen muss der monotone Verlauf erkennbar bleiben.
- Vereinfachungen und nicht maßstäbliche Darstellungen werden im Handoff dokumentiert.
- Bei Weibull-Diagrammen werden Rasterlinien und Datenpunkte aus der passenden Transformation berechnet: x mit `log10(t)`, y mit `ln(-ln(1-F))`. Gleichmäßige y-Abstände sind für Weibull-Wahrscheinlichkeitsnetze falsch.

## 7. Verbindliche Review-Prüfung

Vor der Freigabe muss das Review ausdrücklich bestätigen:

- Bei technischen Diagrammen wurde zuerst die Python Plot Library geprueft.
- Bei neuen Diagrammtypen wurde ein neuer Python-Generator mit Registry-Eintrag angelegt.
- Achsenlabels, Einheiten und Datenquelle sind im Szenenbrief oder Rebuild-Plan dokumentiert.
- Das erzeugte Plotasset wurde gerendert und visuell geprueft.
- Achsenpfeile vorhanden und exakt am Achsenende
- Achsenlinien ohne Lücke oder Überstand an den Pfeilspitzen
- x- und y-Achse beschriftet oder Skizzenausnahme dokumentiert
- Achsentitel geometrisch auf der Mitte des jeweiligen Achsenstrichs ausgerichtet
- Punkte auf Graphen geometrisch korrekt
- vertikale Marker exakt an der x-Achse beginnend
- Marker-Endmodus einheitlich und korrekt umgesetzt
- Labels, Einheiten und fachliche Bedeutung eindeutig
- Geometrie im gerenderten SVG bei Zielauflösung geprüft

Ein Verstoß ist ein Freigabefehler und führt zurück zur SVG-Komposition.
