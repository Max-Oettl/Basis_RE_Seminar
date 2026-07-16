# Python Plot Workflow

Diese Regeln gelten fuer alle echten Plots und technischen Diagramme: Achsendiagramme, Datenplots, Kurven, Verteilungen, Weibull-Wahrscheinlichkeitsnetze, Fit-Linien und Vertrauensgrenzen.

## Harte Regeln

- Zuerst `components/python-plot-library/diagram-registry.json` pruefen.
- Wenn ein passender Generator existiert, diesen nutzen und nur Daten, Achsenlabels, Einheiten und optionale Animationen parametrieren.
- Wenn kein Generator passt, einen neuen Generator in `components/python-plot-library/` erstellen.
- Neue Generatoren in `diagram-registry.json` und `components/python-plot-library/README.md` dokumentieren.
- Python-Plotgeneratoren exportieren ausschliesslich SVG.
- Python-Plots haben keinen sichtbaren Titel.
- Deutsche Plotlabels verwenden echte Umlaute, nicht `ae`, `oe`, `ue` oder `ss` als Ersatz fuer deutsche Woerter.
- Generische Timelines, Ausfall-Zeitstrahlen, einfache Objekt-Zeitachsen und Prozessachsen sind keine Python-Plots, solange sie nur Ereignisse, Ausfaelle mit `X`/Kreuzen oder Zensierungen didaktisch markieren.
- Sobald eine Darstellung Achsenskalierung, Datenpunkte, Fit-Linien, Kurven, Verteilungen, Wahrscheinlichkeitsnetze oder Vertrauensgrenzen fachlich abbildet, ist sie ein Python-Plot.
- Alle Plotgeneratoren verwenden `reltest_plot_style.py`.
- Achsenlabels, Ticklabels und Legenden bleiben bewusst gross, weil Plots in Seminar-Szenen oft klein skaliert werden.
- Wiederkehrende Plot-Aufbauten ueber mehrere Folien verwenden einen gemeinsamen Daten- und Achsenvertrag: gleiche Ausfallzeiten, gleiche daraus berechnete Wahrscheinlichkeiten, gleiche x-Achsenlimits, gleiche Marker- und Linienlogik. Aenderungen zwischen den Stufen muessen im Szenenplan ausdruecklich begruendet sein.
- Erzeugte Plot-SVGs, Plot-Konfigurationen und folienspezifische Daten werden im Ordner der jeweiligen Folie gespeichert, nicht lose in einem globalen Asset-Ordner.
- Didaktische Plotinhalte werden standardmaessig schrittweise eingeblendet. Achsen, Ticklabels und Grid duerfen als Orientierung sichtbar bleiben; Datenpunkte, Ausfallkreuze, Hilfslinien, Fit-Linien, Parameterablesungen, Vertrauensgrenzen, Markierungen und inhaltlich daran gekoppelte Legenden/Annotationen muessen als einzelne stabile SVG-Targets vorbereitet und in der Szenenanimation sequenziell gezeigt werden.
- Ein Python-Plot darf in einer erklaerenden Folie nicht als monolithische, sofort vollstaendige Grafik erscheinen, wenn der Sprechertext einzelne Plotbestandteile nacheinander aufbaut.

## Erstellung

1. Fachlichen Plottyp bestimmen. Im Zweifel gilt: Plot aus Python, nur reine Ausfall-Timeline als SVG.
2. Registry auf vorhandenen Generator pruefen.
3. Daten aus Quelle, Szenenplan oder didaktischer Vorgabe ableiten.
4. Generator ausfuehren und SVG im jeweiligen Folienordner speichern, z.B. `rebuild-proposals/svg/<module_id>/slide_###/plots/<plot_id>.svg`.
5. Folienspezifische Plotdaten oder Renderkonfigurationen daneben speichern, z.B. `rebuild-proposals/svg/<module_id>/slide_###/data/<plot_id>.json` oder `.csv`.
6. SVG-Asset in Szene einbinden. Wenn plotinterne Elemente animiert werden sollen, muss das Plot-SVG inline bzw. DOM-adressierbar eingebunden werden; eine reine Data-URI-`image`-Einbettung ist nur zulaessig, wenn keine plotinternen Targets benoetigt werden oder eine externe Animationsstruktur die Targets trotzdem sicher adressierbar macht.
7. Generator kompilieren oder importieren, SVG XML-parsen und bei Szenenarbeit das Projekt-QA laufen lassen.

## Plot-Sequenzen

Wenn ein Diagramm in mehreren Szenen schrittweise aufgebaut wird, wird vor dem ersten Rendern ein kanonischer Daten- und Achsenvertrag festgelegt.

- Derselbe Datensatz muss in allen Stufen verwendet werden: Sortierung, Wahrscheinlichkeitsauftragung, Fit-Linie, Parameterablesung und Vertrauensgrenzen.
- x-Achse, Tick-Strategie, Plotbereich, Markerform, Markerfarbe und Fit-Stil bleiben zwischen den Stufen gleich.
- Die Datenquelle wird in einem gemeinsamen Python-Modul oder in einer expliziten Szenen-Datenspezifikation abgelegt, nicht mehrfach in einzelnen Generatoraufrufen dupliziert.
- Fuer `RE3_TEST_1` ist `components/python-plot-library/basis_seminar_plot_data.py` die gemeinsame Quelle fuer die wiederkehrende Weibull-/Median-Rank-Sequenz.
- Wenn ein Plotasset neu erzeugt wird, muessen alle betroffenen Inline- und Data-URI-Einbettungen ebenfalls aktualisiert werden.
- Auch bei gemeinsamen Sequenzdaten speichert jede Folie einen lokalen Render- und Datensnapshot in ihrem Folienordner. Zentrale Module duerfen die fachliche Quelle bleiben, aber die konkrete Ausgabe der Folie muss aus ihrem Ordner nachvollziehbar sein.

## Animation-Ready SVG

Animierbare Plot-SVGs folgen bis zur finalen Gesamtstruktur `components/python-plot-library/svg-animation-structure.provisional.md`.

- Animierbare Elemente bekommen stabile IDs oder stabile Gruppen.
- Didaktische Plotinhalte bekommen standardmaessig stabile Einzel- oder Gruppenziele: `plot-data-points`, `plot-failure-marker-t1`, `plot-helper-horizontal-t1`, `plot-helper-vertical-t1`, `plot-fit-line`, `plot-parameter-t`, `plot-confidence-limits`, `plot-confidence-5`, `plot-confidence-95`.
- Gewuenschte Elemente koennen per Zeittrigger sichtbar werden, z.B. nach 3 Sekunden.
- Bei schrittweisen Erklaerplots ist die bevorzugte Reihenfolge: Basisplot mit Achsen/Grid, dann Datenpunkte oder Ausfallmarker, dann Hilfslinien/Ableselinien, dann Fit/Kurve, dann Parameter/Labels, dann Vertrauensgrenzen oder weitere Unsicherheitsinformationen.
- Ob ein Plot-Element animiert wird, wird beim Erstellen oder spaeter in Verbesserungsnotizen festgelegt.
- Szenen-SVGs sollen die groben Layer im Manifest behalten; plotinterne Animation darf im Plot-Asset liegen, wenn das fuer den Prototyp noetig ist. Fuer den Viewer und den Praesentationsmodus muessen plotinterne Targets aber im DOM erreichbar oder im Manifest eindeutig dokumentiert sein.

## Vertrauensgrenzen

Wenn Vertrauensgrenzen in Weibull- oder vergleichbaren Wahrscheinlichkeitsnetzen gefragt sind:

- Typisch als 5 %- und 95 %-Grenzkurven darstellen.
- Keine gefuellten Vertrauensbaender verwenden, wenn explizit Grenzen gefragt sind.
- Keine zwei fast parallelen Regressions-Hilfslinien als Ersatz verwenden.
- Grenzen reproduzierbar erzeugen: fester Seed und dokumentierte Bootstrap-Samplezahl.
- Kanonischer Generator: `components/python-plot-library/weibull_confidence_plot.py`.
- Erwartetes Erscheinungsbild: blauer Fit, offene rote Ausfallpunkte, zwei graue gestrichelte nicht-parallele Bootstrap-Grenzkurven.

## Abbruchkriterien

Ein Plot ist nicht fertig, wenn:

- sichtbare Titel im Plot stehen,
- Labels mit Ersatzschreibungen statt Umlauten gerendert werden,
- Achsen- oder Legendentext im kleinen Szenenformat nicht lesbar ist,
- didaktische Plotinhalte nur als fertige Gesamtgrafik sichtbar sind, obwohl der Sprechertext einen schrittweisen Aufbau beschreibt,
- Plot-SVGs nur als nicht adressierbares `image` eingebettet sind, obwohl einzelne Plotbestandteile animiert werden sollen,
- Vertrauensgrenzen fachlich wie parallele Linien wirken,
- der Generator nicht in Registry und README dokumentiert ist,
- ein echter Plot direkt im Szenen-SVG improvisiert wurde.
