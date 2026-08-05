# Richtlinie Für Diagramme Und Verteilungen

Diese Richtlinie ist für alle Szenen verbindlich, die Verteilungen, Funktionsgraphen, Regressionslinien, Zuverlässigkeitskurven, Wahrscheinlichkeitsnetze oder andere Darstellungen mit Koordinatenachsen enthalten.

Sie gilt für Art Direction, fachliche Prüfung, SVG-Komposition, visuelles Review und technische Validierung.

## 0. Python-First Fuer Technische Diagramme

Echte technische Diagramme und Plots werden ueber `components/python-plot-library/` erzeugt. Das gilt fuer Achsendiagramme, Verteilungen, Regressionslinien, Weibull-Wahrscheinlichkeitsnetze, Konfidenzbaender und vergleichbare technische Plots.

Generische Timelines, Aufbauachsen und Ausfall-Zeitstrahlen sind nur dann keine Python-Plots, wenn sie eindimensional bleiben: eine Zeitachse, Ereignisse, Ausfaelle mit `X`/Kreuzen oder Zensierungen, aber keine zweite Achse und keine ablesbare Diagrammlogik. Sie werden als didaktische SVG-Komposition geplant, weil Animation, Hervorhebung und Folienlayout dort wichtiger sind als ein wissenschaftlicher Plot.

Sobald eine Darstellung eine y-Achse, Objektzeilen mit Achsenbezug, Achsenskalierung, Datenpunkte, Fit-Linien, Kurven, Verteilungen, Wahrscheinlichkeitsnetze oder Vertrauensgrenzen fachlich abbildet, endet die Timeline-Ausnahme und der Python-Plot-Workflow gilt. Das gilt ausdruecklich auch fuer Objekt-Zeit-Diagramme, in denen Ausfaelle oder Zensierungen je Objektzeile gegen eine Zeitachse gezeigt werden.

Pflichtablauf:

1. `components/python-plot-library/diagram-registry.json` pruefen.
2. Vorhandenen Generator mit konkreten Daten, Achsenlabels und Einheiten nutzen.
3. Wenn kein Generator passt, einen neuen Python-Generator in `components/python-plot-library/` erstellen und im Registry dokumentieren.
4. `reltest_plot_style.py` verwenden, damit Achsen, Schriften, Gridlines, Farben und Exporte einheitlich bleiben.
5. Erzeugten Plot als SVG-Asset im Ordner der jeweiligen Folie rendern, z.B. `rebuild-proposals/svg/<module_id>/slide_###/plots/`, und im Szenen-SVG verwenden oder mit SVG-nativen Callouts ergaenzen.
6. Folienspezifische Plotdaten oder Renderkonfigurationen daneben unter `data/` speichern.

Python-Plotassets werden ohne dekorativen Aussenrahmen in das Content-SVG eingebettet. Wenn die Einbettung optisch gefasst werden muss, geschieht das ueber Luft, Position und gegebenenfalls sehr zurueckhaltende Callouts, nicht ueber eine graue Box um den Plot.

Python-Plots tragen keinen sichtbaren Titel. Auch das umgebende Szenen-SVG bekommt keinen sichtbaren globalen Titel, Modul-/Folien-Kicker, Workflow-Hinweis oder Fokusheader. Solche Informationen gehoeren in Metadaten, Manifest oder Reviewtext, nicht in die Grafik.

Sichtbare deutsche Plotlabels verwenden echte Umlaute und `ß`; Ersatzschreibungen wie `ae`, `oe`, `ue` oder `ss` sind fuer deutsche Woerter in Plotlabels nicht zulaessig.

Python-Plotgeneratoren exportieren ausschliesslich SVG. Falls fuer Review oder QA ein PNG benoetigt wird, wird es ausserhalb des Plotgenerators aus dem SVG erzeugt. Animierbare Plot-SVGs folgen `components/python-plot-library/svg-animation-structure.md`: gewuenschte Plot-Elemente werden als stabile semantische `snake_case`-Targets mit `data-anim-target="true"` vorbereitet und ueber `sourceText`-Phrasen aus dem Szenensprechertext ausgeloest. Ob ein Element animiert wird, wird direkt beim Erstellen oder nachtraeglich in den Verbesserungsnotizen festgelegt.

Didaktische Plotinhalte werden nicht als sofort vollstaendige Gesamtgrafik gezeigt, wenn der Sprechertext einzelne Plotbestandteile nacheinander erklaert. Achsen, Ticklabels und Grid duerfen als Orientierungsbasis sichtbar bleiben; Datenpunkte, Ausfallkreuze, Hilfs- und Ableselinien, Fit-Linien, Parameterablesungen, Vertrauensgrenzen, Markierungen und daran gekoppelte Legenden/Annotationen muessen als stabile SVG-Targets vorbereitet und in der Szenenanimation einzeln oder in fachlich sinnvollen Kleingruppen eingeblendet werden. Reine Data-URI-`image`-Einbettungen sind fuer solche Plotinhalte nicht ausreichend, solange die plotinternen Targets dadurch nicht im DOM adressierbar sind.

Beschreibt eine Erklaersequenz mehrere Zustaende derselben Variablen mit identischer x-Achse, wird bevorzugt ein gemeinsames Koordinatensystem verwendet. Histogramm, Fit, Dichtekurve, Grenzwerte und Interpretation werden dort nacheinander animiert, statt fuer jeden Zustand einen eigenen Plot oder externe Erklaerboxen anzulegen. Mehrere Panels sind nur gerechtfertigt, wenn unterschiedliche Skalen, Variablen oder ein dauerhafter Direktvergleich fachlich notwendig sind.

Da Python-Plots im Seminar oft kleiner skaliert und als Erklaervisualisierung genutzt werden, muessen Achsenbeschriftungen, Ticklabels und Legenden auch bei reduzierter Darstellungsbreite lesbar bleiben. Der zentrale Stil `reltest_plot_style.py` setzt diese Elemente bewusst groesser als klassische Paper-Abbildungen. Neue Generatoren duerfen diese Schriftgroessen nicht lokal verkleinern, ausser der Szenenbrief begruendet es.

Bei kompakten Mehrfachplots stehen Funktionsnamen bevorzugt als Achsenbeschriftung oder in einem reservierten Bereich ausserhalb der Datenflaeche. Erklaerende Unterzeilen wie Bedeutungsparaphrasen werden entfernt, sobald sie Kurven, Marker oder Raster ueberdecken. Lange Bezeichnungen benachbarter Panels duerfen auf gegenueberliegende y-Achsenseiten verteilt werden, wenn dadurch ein freier Mittelsteg und eine eindeutige Zuordnung entstehen.

Bei Vertrauensgrenzen in Weibull- oder vergleichbaren Wahrscheinlichkeitsnetzen werden typischerweise die 5 %- und 95 %-Grenzkurven als klare Linien gezeichnet. Gefuellte Vertrauensbaender oder zufaellig wirkende Flaechen sind fuer diese Darstellung nicht zulaessig, wenn explizit Vertrauensgrenzen gefragt sind. Bootstrap-basierte Grenzen muessen ueber festen Seed und dokumentierte Samplezahl reproduzierbar erzeugt werden. Fuer Weibull-Vertrauensgrenzen gilt `components/python-plot-library/weibull_confidence_plot.py` als kanonische Darstellung: blauer Fit, offene rote Ausfallpunkte und zwei graue, gestrichelte, nicht-parallele 5 %- und 95 %-Bootstrap-Grenzkurven. Klassische lineare Regressions-Vertrauenslinien ersetzen diese Darstellung nicht.

Wiederkehrende Plot-Sequenzen duerfen ihre Datenpunkte und Achsen nicht von Stufe zu Stufe wechseln. Wenn Ausfaelle sortiert, Wahrscheinlichkeiten eingetragen, eine Ausgleichsgerade gezogen und anschliessend Vertrauensgrenzen ergaenzt werden, muessen alle Stufen denselben Datensatz, dieselben daraus berechneten Median-Ranks, dieselben x-Achsenlimits und dieselbe visuelle Codierung verwenden. Fuer `RE3_TEST_1` liegt diese gemeinsame Datenbasis in `components/python-plot-library/basis_seminar_plot_data.py`.

Bei verglichenen relativen Dichten duerfen Reihen nicht automatisch jeweils separat auf dieselbe Maximalhoehe normiert werden. Zeigt die Quelle ein fachlich relevantes Peakverhaeltnis, muss dieses Verhaeltnis in Daten oder Renderkonfiguration dokumentiert und im Plot erhalten bleiben. Eine unabhaengige Normierung ist nur zulaessig, wenn ausdruecklich ausschliesslich die Kurvenform verglichen wird.

Bei Stress-Strength-Darstellungen wird die Ausfallverteilung nicht automatisch mit der mathematischen Minimum-Huelle beider Dichten gleichgesetzt. Zeigt die Quelle eine eigene Ausfallverteilung innerhalb des sichtbaren Ueberlappungsintervalls, muss diese als begrenzte, zusammenhaengende Verteilung mit klarer Kontur vom Beginn bis zum Ende der Ueberlappung erzeugt werden. Ihre Breite und bei einer Rechtsverschiebung auch ihre sichtbare Auspraegung muessen konsistent mit dem Ueberlappungsintervall abnehmen. Sind Belastung und Belastbarkeit in der Quelle gleich hoch, werden identische Spitzenhoehen explizit in der Plotkonfiguration abgesichert und im Render geprueft.

Verteilungskurven duerfen am sichtbaren Beginn oder Ende keine durch hartes Abschneiden erzeugten Ecken besitzen. Unbegrenzte Dichten werden mit ihren natuerlich auslaufenden Tails gerendert. Fuer eine im Quellbild glockenfoermige Ausfallverteilung wird eine vollstaendige, weich auslaufende Dichte verwendet; eine Kompaktstuetze ist nur zulaessig, wenn die Quelle tatsaechlich eine sichtbar begrenzte Form verlangt. Eine ausgelagerte Kurvenbeschriftung steht in einer freien Diagrammzone und wird mit einer dezenten Fuehrungslinie an die Kurve gebunden; Kurve, Linie und Label bilden dieselbe semantische Animationsgruppe.

Kumulative Histogramme oder empirische Verteilungsfunktionen stellen die Addition moeglichst direkt an den kumulierten Balken dar. Wenn der Sprechertext den Aufbau erklaert, erhalten die Klassen stabile semantische Gruppen aus Balken und Rechenschritt und werden von links nach rechts aufgebaut. Eine zweite, raeumlich getrennte Rechenleiste ist nur zulaessig, wenn sie einen eigenen fachlichen Zweck erfuellt.

Plotannotation, Marker und zugehoerige Fuehrungslinie werden als gemeinsame semantische SVG-Gruppe exportiert. Prozentwerte, Endpunkte und Kurvenlabels duerfen in der Animation nicht vor der referenzierten Kurve oder Markierung erscheinen. Unbegruendete gestrichelte Hilfslinien werden nicht allein zur optischen Rahmung erzeugt.

Uebergangspfeile zwischen zwei Plotpanels benoetigen einen nach dem finalen Rendering kontrollierten freien Korridor. Pfeil, Spitze und Beschriftung duerfen weder Datenflaechen noch Achsen, Achsentitel, Ticklabels oder Paneltitel beruehren. Der Abstand wird am eingebetteten Endformat geprueft, nicht nur in den normierten Koordinaten des Python-Figures.

Pfeile, die eine Reduktion oder Verschiebung zwischen zwei Kurven zeigen, werden als vollstaendige gefuellte Richtungssymbole aus Schaft und Spitze erzeugt. Sie werden nur an repraesentativen Positionen mit ausreichendem Kurvenabstand gesetzt. Wenn bei kleinem Abstand nur die Spitze sichtbar bliebe, wird der Pfeil versetzt oder weggelassen; mehrere kopflastige Fragmente sind kein gueltiger Ersatz. Alle Pfeile derselben fachlichen Wirkung bilden gemeinsam mit der zugehoerigen Zielkurve ein semantisches Animationsziel.

Handgezeichnete SVG-Erklaerskizzen sind nur noch fuer bewusst einfache, achsenlose Hilfsgrafiken ohne Datenpunkte, Kurven, Fit, Wahrscheinlichkeitsnetz oder Plotanspruch zulaessig. Echte Plots und technische Diagrammgeometrie gehen immer ueber Python; die Standardausnahme bleiben einfache `X`-/Zensur-Timelines nach `workflow/33-timelines/timeline-workflow.md`.

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

Verlangt die Quelle, der Szenenbrief oder ein Review ausdruecklich Achsenpfeile, werden sie auch im Python-Generator als Teil der statisch sichtbaren Orientierungsbasis erzeugt. Sie duerfen nicht nachtraeglich im umgebenden Szenen-SVG ueber den Plot gelegt werden.

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
- Messpunkte auf einem fachlich festen Last-, Spannungs- oder Pruefniveau verwenden exakt denselben Achsenwert und liegen deshalb auf einer horizontalen bzw. vertikalen Niveaulinie. Kuenstliches Jitter ist nur erlaubt, wenn es eine reale Messunsicherheit oder bewusst erklaerte Punktueberdeckung abbildet.

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
- Bei aufeinander aufbauenden Weibull-Folgen bleiben Datensatz, Median-Ranks, x-Achsenlimits und Markerpositionen ueber Sortierung, Auftragung, Fit, Parameterablesung und Vertrauensgrenzen konsistent.
- Schraffierte oder gefuellte Kurvenbereiche werden nur eingesetzt, wenn die Flaeche eine fachlich definierte Menge, Wahrscheinlichkeit oder Integralaussage repraesentiert. Reine Fokusflaechen unter einer Kurve sind unzulaessig, wenn die Flaechenbedeutung nicht erklaert wird.
- Bei 3D-Diagrammen wird die Kameraperspektive bewusst nach der fachlichen Beziehung gewaehlt. Zentrale Kurven oder Verbindungslinien duerfen nicht durch eine nahezu frontale Ansicht verkuerzt oder verdeckt werden und werden direkt im Plot beschriftet.
- Bei Reihen von Dichtefunktionen oder 3D-Dichteflaechen werden fachlich relevante Unterschiede der Maximalhoehen aus Quelle oder Daten erhalten. Einzelne Spannungsschnitte duerfen nicht unabhaengig auf dieselbe Hoehe normiert werden, wenn die Maximalhoehe mit dem Lastniveau variiert.
- Direkte Kurvenlabels und Peak-Beschriftungen muessen im gerenderten Zielzustand frei von Kurven, Markern, Achsen und anderen Labels stehen.
- Eine direkte Kurvenbeschriftung gehoert zur semantischen Animationsgruppe ihrer Kurve. Text, Fuehrungslinie und Kurvenpfad werden gemeinsam oder in dieser Reihenfolge eingeblendet; die Beschriftung darf nie vor der zugehoerigen Kurve sichtbar sein.
- Vorher-/Nachher-Plots verwenden dieselben Achsenlimits, Ticks und Ausgangsdaten. Ein Ausreisser oder eine Verschiebung wird als Veraenderung desselben Koordinatensystems gezeigt, nicht als unabhaengig skalierter zweiter Plot.
- Ergebnislabels, die den Datenraum ueberdecken wuerden, werden in einem reservierten Bereich ausserhalb der Achsen gesetzt. Marker, Hilfslinien und Ergebnistext bleiben dabei eine gemeinsame Animationsgruppe und muessen im exportierten SVG denselben gruppierbaren Elternknoten besitzen.
- Wenn eine source-nahe Wahrscheinlichkeits- oder Quantildarstellung transformierte beziehungsweise schematische Stuetzstellen nutzt, werden Kurve oder Gerade, Punkte und Ticklabels aus demselben transformierten Koordinatenmodell erzeugt. Rohwertachsen und transformierte Positionen duerfen nicht unbemerkt gemischt werden.

## 7. Verbindliche Review-Prüfung

Vor der Freigabe muss das Review ausdrücklich bestätigen:

- Bei technischen Diagrammen wurde zuerst die Python Plot Library geprueft.
- Bei neuen Diagrammtypen wurde ein neuer Python-Generator mit Registry-Eintrag angelegt.
- Achsenlabels, Einheiten und Datenquelle sind im Szenenbrief oder Rebuild-Plan dokumentiert.
- Das erzeugte Plotasset wurde gerendert und visuell geprueft.
- Didaktische Plotinhalte sind als einzelne oder fachlich sinnvolle animierbare SVG-Targets vorhanden und werden nicht nur als fertiges Gesamtbild gezeigt.
- Plotassets mit interner Animation sind im Szenen-SVG DOM-adressierbar eingebunden oder ihre interne Animationsstruktur ist im Manifest eindeutig referenziert.
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
