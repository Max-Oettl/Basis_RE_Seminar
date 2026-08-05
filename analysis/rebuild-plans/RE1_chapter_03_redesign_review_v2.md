# RE1 Kapitel 3 - Redesign-Review V2

## Auftrag und Modus

- Umfang: Kapitel 3, Zielszenen 27 bis 39.
- Quellen: PowerPoint-SVGs 28 bis 41 und der vollständig gemappte Sprechertext.
- Modus: `module_redesign`; jede Zielszene bleibt eine `full_slide` im RelTest-Academy-BrandFrame.
- Vorgehen: Quelle, Sprechertext und bisheriger Entwurf werden je Szene verglichen. Produktion und QA erfolgen danach weiterhin Szene für Szene.

## Befunde am bisherigen Kapitelentwurf

- Die vier Zuverlässigkeitsfunktionen wurden zwar konsistent markiert, der große Navigationsreiter dominiert aber viele Folien stärker als die eigentliche Lernhandlung.
- Zu viele Folien folgen demselben Muster aus Plot links und Erklärungskarten rechts. Dadurch gehen unterschiedliche Lernfunktionen wie Transformation, Ablesung, Diagnose und Gegenbeispiel visuell ineinander über.
- Mehrere Aussagen werden nur als Textkarten wiederholt, obwohl sie direkt am Diagramm verankert werden können.
- Szene 34 enthält einen fachlichen Übertragungsfehler: Die dargestellte Kurve liefert nicht die Quellwerte `F(1) ≈ 63 %` und `F(t_10%) = 10 %`.
- Die Formeln in Szenen 33, 36 und 37 sind noch als normaler SVG-Text gesetzt und erfüllen den Formelworkflow nicht.
- Die Ausfallraten-Szenen 37 und 38 sind zu dicht beziehungsweise in zu viele gleichwertige Karten zerlegt. Ursachen und Maßnahmen müssen räumlich mit den zugehörigen Kurvenbereichen verbunden werden.

## Gemeinsame V2-Entscheidungen

- Die Funktionsnavigation bleibt als kompakter Lernpfad erhalten, nimmt aber weniger Höhe und Aufmerksamkeit ein.
- Plot und didaktische Operation bilden den Hauptinhalt. Begleittext wird direkt an Kurven, Flächen, Ablesewege oder Zustände gekoppelt.
- Karten werden nur noch für echte fachliche Einheiten verwendet. Reine Wiederholungen des Diagramminhalts werden durch Labels, Klammern, Pfeile, Vergleichsbänder oder Ergebnisleisten ersetzt.
- Nicht triviale Formeln werden als lokale Mathtext-SVG-Assets erzeugt.
- Animationen folgen wenigen fachlichen Beats. Dauerhafte Orientierung, Achsen und die kompakte Funktionsnavigation bleiben statisch.

## Szene 27 - Wöhlerversuch und Streuung

- Quelle: Folie 28.
- Must preserve: Wöhlerbeziehung, Zahnfußbiegespannung, Lastwechsel, vier Lastniveaus, Fokus auf 640 N/mm², Streuung der Ausfallzeiten und statistische Aufgabe.
- Schwäche V1: Die beiden rechten Karten konkurrieren mit dem Diagramm; der Zusammenhang `gleiches Lastniveau -> unterschiedliche Ausfallzeiten` ist nicht als Lernhandlung geführt.
- V2-Archetyp: Datenplot mit geführtem Fokus.
- V2-Komposition: großer Wöhlerplot; direkt am 640-N/mm²-Niveau eine Fokusklammer mit Spannweite der Ausfallzeiten; darunter eine Ergebnisleiste `Streuung -> statistisch beschreiben -> Lebensdauer bewerten`.
- Animation: Versuchsdaten und Wöhlerlinie; Fokus 640 N/mm²; Ergebnisleiste.

## Szene 28 - Vom Histogramm zur Dichtefunktion

- Quellen: Folien 29 und 30 als zwei Aufbauzustände.
- Must preserve: Histogramm, Klassen und Klassenbreite, relative Häufigkeit, Stichprobe, Annäherung an glatte Dichte bei wachsender Stichprobe/Klassenzahl, Grundgesamtheit, empirische Schätzung, Ausfallbeginn circa 23.000 und vollständiger Ausfall circa 45.000 Lastwechsel.
- Schwäche V1: Histogramm und Dichte liegen ohne klare Zustandsgrenze übereinander; Stichprobe, Grenzübergang und Schätzung werden überwiegend in Karten erklärt.
- V2-Archetyp: Vorher-Nachher-Transformation.
- V2-Komposition: zwei gleichwertige Diagrammzustände mit identischer Zeitachse: links `Stichprobe / Histogramm`, rechts `Grundgesamtheit / Dichte`; dazwischen ein Transformationspfeil `n und Klassenanzahl steigen`. Darunter ein gemeinsames Ableseband von 23.000 bis 45.000 Lastwechsel und ein kurzer Realitätsanker `endliche Stichprobe -> empirische Schätzung`.
- Animation: Histogramm; Transformation; Dichte; Ableseband und Schätzhinweis.

## Szene 29 - Dreidimensionale Wöhlerdarstellung

- Quelle: Folie 31.
- Must preserve: Dichte je Lastniveau, zusätzliche Spannungsdimension und Wöhlerlinie durch die Dichtemaxima.
- Schwäche V1: Der Achsenschlüssel rechts wiederholt nur Beschriftungen und verkleinert die eigentliche 3D-Struktur.
- V2-Archetyp: großformatiges 3D-Diagramm.
- V2-Komposition: 3D-Plot nahezu über die gesamte Inhaltsbreite; drei kompakte Achsenanker direkt am Plot; rote Wöhlerlinie mit eindeutiger Annotation `verbindet Dichtemaxima`.
- Animation: Dichteprofile je Lastniveau; Spannungsdimension; Wöhlerlinie.

## Szene 30 - Ausfalldichte des NKW-Getriebes

- Quelle: Folie 32.
- Must preserve: 2.115 Schadensereignisse, 82 Klassen, normierte Lebensdauer, rechtsschiefe/linkssteile Verteilung, Ausfälle ab t=0, breite Streuung, Kundenunzufriedenheit, Garantie- und Imageschäden sowie gewünschter flacher und nach rechts verschobener Verlauf.
- Schwäche V1: Ist- und Zielkurve liegen als fertige Antwort übereinander; die im Sprechertext angelegte Denkpause ist nicht erkennbar.
- V2-Archetyp: Frage, Diagnose und Zielvergleich.
- V2-Komposition: beobachtete Dichte als dominanter Plot; zunächst sichtbare Frageleiste `Was fällt auf? Wünschenswert?`; im Endzustand zwei klar getrennte Mini-Zustände `Ist` und `Ziel` mit Bewegungsrichtung nach rechts sowie eine gemeinsame Folgenleiste.
- Animation: beobachtete Kurve; Frage; Diagnose; Folgen; Zielbild.

## Szene 31 - Dichtefunktion menschlicher Sterbefälle

- Quelle: Folie 33.
- Must preserve: Männer- und Frauenkurve, deutlicher Anstieg ab circa 40 beziehungsweise 50 Jahren, Maxima bei circa 78 und 87 Jahren sowie Transfer als allgemeine statistische Beschreibung.
- Schwäche V1: Drei große Karten wiederholen Kurvenwerte und nehmen dem Plot Raum.
- V2-Archetyp: direkt beschrifteter Vergleichsplot.
- V2-Komposition: großer Plot mit Peak-Markern und direkt angeschlossenen Wertlabels; Start des deutlichen Anstiegs wird als dezente Bereichsmarkierung gezeigt; unten eine einzige Transferzeile.
- Animation: beide Kurven; Anstiegsbereiche; Peaks; Transferzeile.

## Szene 32 - Von Einzelhäufigkeit zur Summenhäufigkeit

- Quelle: Folie 34.
- Must preserve: Histogramm je Klasse, kumulative Addition, Histogramm der Summenhäufigkeit, empirische Verteilungsfunktion `F*(t)` und Bedeutung `Summe aller Ausfälle bis t`.
- Schwäche V1: Die Rechenoperation ist in einer kleinen Karte versteckt und die Entstehung der Summenwerte ist nicht sichtbar.
- V2-Archetyp: Rechenweg als Diagrammtransformation.
- V2-Komposition: links Balken mit Einzelwerten, mittig sichtbare kumulative Additionskette, rechts kumulierte Balken mit Verbindungslinie. Klassen und Zeitachse bleiben identisch.
- Animation: Einzelhäufigkeiten; Addition; kumulierte Balken; empirische Verbindungslinie und Definition.

## Szene 33 - Verteilungsfunktion F(t)

- Quelle: Folie 35.
- Must preserve: glatte S-Kurve für große Stichprobe, Start bei 0 %, Ende bei 100 %, Integralbeziehung zu `f(t)`, Ableitungsbeziehung zurück und statistische Bedeutung.
- Schwäche V1: Drei gleichwertige Karten lassen Formel, Grenzwerte und Bedeutung miteinander konkurrieren.
- V2-Archetyp: Funktionsplot mit mathematischer Brücke.
- V2-Komposition: große S-Kurve mit festen Ankern `0 %: noch kein Ausfall` und `100 %: alle ausgefallen`; darunter eine bidirektionale Formelbrücke zwischen `f(t)` und `F(t)`; eine kurze Definitionszeile bleibt als Abschluss.
- Animation: S-Kurve; 0/100-Anker; Integral; Ableitung; Definitionszeile.

## Szene 34 - Ausfallwahrscheinlichkeit des NKW-Getriebes

- Quelle: Folie 36.
- Must preserve: 2.115 Ereignisse, 82 Klassen, normierte Lebensdauer, `10 % -> t_10%`, `t = 1 -> F(t) ≈ 63 %` und beide Ableserichtungen.
- Schwäche V1: Die Plotparameter erzeugen falsche Werte und die beiden Leserichtungen sind nur textlich erklärt.
- V2-Archetyp: interaktiver Ableseplot.
- V2-Komposition: quellentreue Kurve; zwei farbige, beschriftete Lesewege direkt im Diagramm: horizontal-vertikal für 10 % und vertikal-horizontal für t=1. Die Ergebnisse stehen am jeweiligen Achsenschnittpunkt.
- Animation: Kurve; 10-%-Leseweg; t=1-Leseweg.

## Szene 35 - Ausfallwahrscheinlichkeit des Menschen

- Quelle: Folie 37.
- Must preserve: Männerkurve steigt früher/steiler, gemeinsamer Ablesepunkt 80 Jahre, 62 % Männer und 36 % Frauen.
- Schwäche V1: Die Werte sind korrekt, erscheinen aber erneut als zwei große externe Karten.
- V2-Archetyp: Vergleich mit gemeinsamem Ablesepunkt.
- V2-Komposition: großer Plot; vertikale 80-Jahre-Linie; farbige horizontale Ableselinien enden direkt in zwei kompakten Prozentmarken am Rand. Eine Differenzklammer `26 Prozentpunkte` unterstützt den Vergleich, ohne neue fachliche Aussage zu erfinden.
- Animation: beide Kurven; gemeinsamer Ablesepunkt; Prozentmarken und Differenz.

## Szene 36 - Zuverlässigkeit R(t)

- Quelle: Folie 38.
- Must preserve: Reliability-Begriff, ausgefallene plus intakte Einheiten gleich 100 %, `R(t)=1-F(t)`, Dichtefläche von 0 bis t_x für F und von t_x bis unendlich für R.
- Schwäche V1: Formeln sind fragil als Text gesetzt; zwei Formelkarten trennen mathematische Aussage und zugehörige Fläche.
- V2-Archetyp: komplementäre Flächenzerlegung.
- V2-Komposition: oben ein 100-%-Band, das sichtbar in `F(t)` und `R(t)` geteilt wird; darunter eine große Dichtekurve mit direkt in den beiden Flächen liegenden Mathtext-Formeln und einer deutlichen Trennlinie bei t_x.
- Animation: Grundbeziehung; Dichtekurve; F-Fläche mit Formel; R-Fläche mit Formel.

## Szene 37 - Ausfallrate und Badewannenkurve

- Quelle: Folie 39.
- Must preserve: Definition und `λ(t)=f(t)/R(t)`, bedingtes Risiko, drei Kurvenbereiche, Ursachen, Risikoverlauf und Maßnahmen je Bereich sowie Bedeutung der Ermüdungsmechanismen für die maximale Lebensdauer.
- Schwäche V1: Plot und Texte sind zu klein; die drei Karten sind nur lose unter dem Plot angeordnet und enthalten nicht alle Beziehungen des Sprechertexts.
- V2-Archetyp: dreizonige Erklärgrafik.
- V2-Komposition: kompakte Formel und Risikodefinition oben; große Badewannenkurve mit drei farbigen Zonen; je Zone direkt darunter ein ursachen- und maßnahmenbezogenes Band. Die Zufallszone benennt das niedrige konstante Risiko, die Ermüdungszone die Begrenzung der maximalen Lebensdauer.
- Animation: Definition; Kurve; Frühzone; Zufallszone; Ermüdungszone.

## Szene 38 - Ausfallrate des Menschen

- Quelle: Folie 40.
- Must preserve: Männer- und Frauenkurve, leichter früher Rückgang durch Kindersterblichkeit, lange nahezu konstante Phase mit plötzlichen Ereignissen/Unfällen und starker altersbedingter Anstieg durch Erkrankungen, Verschleiß und nachlassende physiologische Systeme.
- Schwäche V1: Die drei Erklärungen stehen als separate Karten neben dem Plot und sind nicht mit den Lebensphasen verankert.
- V2-Archetyp: phasenannotierter Vergleichsplot.
- V2-Komposition: Plot über die volle Breite; drei vertikale Lebensphasen mit direkten Labels und darunter jeweils eine kurze Ursachenzeile samt Piktogramm.
- Animation: Kurven; frühe Phase; mittlere Phase; Altersphase.

## Szene 39 - Ausfallrate des NKW-Getriebes

- Quelle: Folie 41.
- Must preserve: kontinuierlich steigende Ausfallrate, Verschleiß- und Ermüdungsausfälle, kein typischer Badewannenverlauf sowie Aussage, dass nicht jedes Produkt alle drei Bereiche besitzt.
- Schwäche V1: Die Schlussfolgerung steht in Karten neben einem generischen Plot; der Gegenbeispielcharakter wird nicht visuell gezeigt.
- V2-Archetyp: Gegenbeispiel mit technischer Referenz.
- V2-Komposition: große steigende Kurve mit kleinem originalen Getriebeausschnitt; daneben eine dezente gestrichelte Badewannenkurve als Referenz mit eindeutiger Abgrenzung `nicht dieser Verlauf`; Abschlussband `Produktmechanismus bestimmt den Verlauf`.
- Animation: NKW-Kurve; Verschleiß-/Ermüdungsmechanismus; Vergleich zur Badewannenkurve und Schlussfolgerung.

## Freigabekriterien

- Jede Szene wird einzeln gegen ihre Quell-SVG und den vollständigen Sprechertext geprüft.
- Numerische Werte und Leserichtungen stimmen mit der Quelle überein.
- Formelassets sind lokale transparente SVGs aus dem Mathtext-Renderer.
- Plotachsen und zentrale Beschriftungen bleiben bei verkleinerter Seminaransicht lesbar.
- Animationsgruppen sind fachlich vollständig und werden nicht in technische Mikroelemente zerlegt.
- Nach jeder Szene erfolgen Crosscheck, gerenderte Layout-QA, visuelle Kontrolle und Re-QA vor der nächsten Szene.

## Umsetzungsabschluss

- Status: Szenen 27 bis 39 vollständig als V2 umgesetzt.
- Einzelprüfung: jede Szene separat gerendert, visuell geprüft und nach Korrekturen erneut geprüft.
- Kapitel-Layout-QA: 13 SVGs und 13 Animationsmanifeste, 0 Fehler, 0 Warnungen.
- Inhalts-Crosscheck: 13 von 13 Szenen bestanden.
- Fachliche Korrektur Szene 34: `F(1)=63 %` und `F(t)=10 %` bei `t≈0,25` quellgetreu kalibriert.
- Formelassets: zwei lokale Mathtext-SVGs in Szene 33, drei in Szene 36 und eines in Szene 37.
- Final-Previews: `analysis/render-checks/RE1/chapter-03-v2-final-previews/`.
- QA-Bericht: `analysis/render-checks/chapter-03-v2-input/automated-svg-qa/svg-qa-report.md`.
- Crosscheck-Bericht: `analysis/reports/crosschecks/RE1_chapter03_redesign_v2.json`.
