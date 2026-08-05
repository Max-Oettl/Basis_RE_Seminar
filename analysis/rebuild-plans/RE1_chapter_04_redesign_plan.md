# RE1 Kapitel 4 - Redesign-Plan

## Geltungsbereich

- Kapitel: 4 - Statistische Maßzahlen & Zuverlässigkeitskennzahlen
- Lektion 1: Zielszenen 40-44
- Lektion 2: Zielszenen 45-49
- Darstellungsmodus: vollständige 1920-x-1080-Lernszene im bestehenden RelTest-Academy-Design
- Quellen: PowerPoint-SVGs 42-54 und die zugeordneten Sprechertexte
- Grundsatz: Der vollständige fachliche Inhalt bleibt erhalten. Doppelte Quellzustände werden als textgeführte Animation einer gemeinsamen Szene zusammengeführt.

## Kapitelbogen

Lektion 1 führt drei Lageparameter mit einer konsistenten visuellen Grammatik ein: Formel, fachliche Bedeutung und Verhalten gegenüber Ausreißern beziehungsweise Lage in einer Dichtefunktion. Szene 44 führt die zuvor einzeln erklärten Maßzahlen auf derselben rechtsschiefen Verteilung zusammen.

Lektion 2 trennt Mittelwertkennzahlen von belastbaren Zuverlässigkeitsanforderungen. MTTF und MTBF beschreiben mittlere Zeitabstände; ppm und Bq verknüpfen eine zulässige Ausfallwahrscheinlichkeit mit einer konkreten Lebensdauer.

## Szene 40 - Drei Lageparameter

- Quell-SVG: Folie 42
- Lernziel: Mittelwert, Median und Modalwert als drei unterschiedliche Antworten auf die Frage nach der Lage einer Verteilung ankündigen.
- Aufbau: eine gemeinsame Dichtekurve als Bezug; drei klar getrennte Marker mit den Bedeutungen Schwerpunkt, Halbierung und Maximum; keine drei generischen Textkarten.
- Visuelle Elemente: stilisierte Dichtekurve, kurze Markerbegriffe, dezente Piktogramme für Schwerpunkt, Teilung und Maximum.
- Animation: Die drei Maßzahlen erscheinen als eine zusammengehörige Gruppe bei der Sprecherphrase „den Mittelwert, den Median und den Modalwert“. Keine Einzelwort-Reveals.
- QA: alle drei Begriffe gleichrangig; keine vorweggenommene Detailerklärung aus den Folgeszenen.

## Szene 41 - Mittelwert

- Quell-SVGs: Folien 43 und 44
- Lernziel: Berechnung, Schwerpunktinterpretation und Ausreißerempfindlichkeit zusammenführen.
- Aufbau: Formelzone links; dominantes Python-Diagramm mit Massenpunkten rechts; kompakte Ausreißerwarnung unterhalb.
- Formelasset: arithmetischer Mittelwert mit Summenschreibweise.
- Python-Plot: `location_measure_plots.py --plot mean_balance`; gemeinsame Achse mit Massenpunkten, Mittelwertmarker und separat animierbarem Ausreißereffekt.
- Animation: Formel bei „Summe aller Ausfallzeiten“; Massenpunkte bei „als Massenpunkte“; Mittelwertmarker bei „entspricht dann genau dem Schwerpunkt“; Ausreißereffekt bei „sehr empfindlich auf Ausreißer“.
- QA: Formel und Definition bleiben gekoppelt; Ausreißer und verschobener Mittelwert werden gemeinsam gezeigt; keine Mikroanimation einzelner Formelzeichen.

## Szene 42 - Median

- Quell-SVGs: Folien 45 und 46
- Lernziel: Median als 50-Prozent-Zeitpunkt, Flächenteiler und robuste Lagekennzahl erklären.
- Aufbau: kompakte Definitions- und Formelzone links; dominantes Dichtediagramm rechts; Robustheitsnotiz als eigener semantischer Block.
- Formelasset: `F(t_Median) = 0,5`.
- Python-Plot: `location_measure_plots.py --plot median_split`; Dichtekurve und zwei gleich große Flächenhälften mit gemeinsamem Medianmarker.
- Animation: Formel bei „entspricht dem Zeitpunkt, zu dem fünfzig Prozent“; Kurve und beide Flächenhälften gemeinsam bei „teilt die Fläche ... in zwei exakt gleiche Hälften“; Robustheitsblock bei „Robustheit gegenüber Ausreißern“.
- QA: Medianlinie und Beschriftung erscheinen gemeinsam; die beiden Flächen sind optisch gleichwertig; keine getrennte Animation von Fläche und zugehörigem Label.

## Szene 43 - Modalwert

- Quell-SVGs: Folien 47 und 48
- Lernziel: Modalwert als häufigste Ausfallzeit und Maximum der Dichtefunktion erkennen.
- Aufbau: kurze Definition links; Formelasset; dominantes Dichtediagramm mit eindeutigem Maximum rechts.
- Formelasset: `f'(t_modal) = 0`.
- Python-Plot: `location_measure_plots.py --plot mode_peak`; Dichtekurve und Peakmarker als getrennte semantische Ziele.
- Animation: Formel bei „erste Ableitung der Dichtefunktion auf Null“; Dichtekurve und Peakmarker gemeinsam bei „Punkt, an dem die Dichtefunktion ihr Maximum erreicht“.
- QA: keine unnötigen Zusatzinformationen; Marker, Linie und Beschriftung des Modalwerts sind gekoppelt.

## Szene 44 - Lageparameter im direkten Vergleich

- Quell-SVG: Folie 49
- Lernziel: Reihenfolge von Modalwert, Median und Mittelwert in einer rechtsschiefen Verteilung verstehen und die Eignung des Medians für Ausfalldaten einordnen.
- Aufbau: großformatiger Python-Plot links; rechts eine kompakte fachliche Einordnung zu Ausreißereinfluss, Normalverteilung und bevorzugtem Median.
- Python-Plot: `location_measure_plots.py --plot right_skew_compare`; rechtsschiefe Dichtekurve sowie einzeln adressierbare, vollständig beschriftete Marker.
- Animation: Kurve bei „rechtsschiefen Verteilung“; Modalwert, Median und Mittelwert jeweils mit ihrem vollständigen Marker bei den drei folgenden Sprecherpassagen; Schlussfolgerung bei „Da Ausfalldaten in der Regel nicht normalverteilt sind“.
- QA: Reihenfolge `t_modal < t_median < t_m` visuell eindeutig; Mittelwert nicht als 50-Prozent-Punkt darstellen; Titel verwendet die korrekte Schreibweise „Modalwert“.

## Szene 45 - Zuverlässigkeitskennzahlen im Überblick

- Quell-SVG: Folie 50
- Lernziel: MTTF/MTBF von ppm/Bq als zwei unterschiedliche Kennzahlengruppen unterscheiden.
- Aufbau: ein durchgehender Lernpfad von mittleren Zeitkennzahlen zu definierten Zuverlässigkeitsanforderungen; keine Sammlung gleichförmiger Karten.
- Visuelle Elemente: Zeit-/Takt-Piktogramm für MTTF/MTBF, Prozent-/Ziel-Piktogramme für ppm/Bq und ein klarer Übergang „Mittelwert -> definierte Wahrscheinlichkeit bei Lebensdauer“.
- Animation: MTTF/MTBF gemeinsam bei „Zunächst betrachten wir“; ppm/Bq gemeinsam bei „Anschließend werden wir“.
- QA: alle vier Kennzahlen sichtbar; die Gruppierung darf ppm und Bq nicht als Mittelwerte erscheinen lassen.

## Szene 46 - MTTF

- Quell-SVG: Folie 51
- Lernziel: MTTF als mittlere Lebensdauer nicht reparierbarer Einheiten und Erwartungswert der Lebensdauer verstehen.
- Aufbau: Definition und Formel oben; darunter ein dominantes Python-Diagramm aus mehreren Ausfallzeitpunkten, Dichtekurve und MTTF-Marker.
- Formelasset: Erwartungswert-/Integralform der MTTF über Dichte- und Zuverlässigkeitsfunktion.
- Python-Plot: `reliability_metric_plots.py --plot mttf`; Ausfallbeobachtungen, Dichtekurve, MTTF-Linie und 50-Prozent-Hinweis als semantische Gruppen.
- Animation: Ausfallbeobachtungen bei „Produkten, die nicht repariert werden können“; Dichtekurve und Formel bei „Erwartungswert der Lebensdauer“; MTTF-Marker bei „repräsentiert somit die mittlere Lebensdauer“; 50-Prozent-Hinweis bei „fünfzig Prozent Überlebens- beziehungsweise Ausfallwahrscheinlichkeit“.
- QA: MTTF ist nicht mit MTBF vermischt; Formel ist als gerendertes SVG-Asset eingebettet; Achsen und Beschriftungen bleiben bei verkleinerter Viewer-Darstellung lesbar.

## Szene 47 - MTTFF und MTBF

- Quell-SVG: Folie 52
- Lernziel: Zeit bis zum ersten Ausfall von mittleren Abständen zwischen Ausfällen in reparierbaren Systemen unterscheiden.
- Aufbau: eine einzige SVG-native Zeitachse mit drei Ausfällen und Reparatursymbolen; darüber gekoppelte Intervallklammern für MTTFF und MTBF; darunter die Einschränkung als Anforderungskennzahl.
- Ausnahme vom Python-Workflow: reine eindimensionale Ereigniszeitachse ohne y-Achse.
- Animation: Ausfälle, Reparaturen und MTBF-Intervalle gemeinsam bei „mittleren Zeitraum zwischen zwei aufeinanderfolgenden Ausfällen“; danach MTTFF bis zum ersten Ausfall bei „mittlere Lebensdauer bis zum ersten Ausfall“; Einschränkung bei „nicht als Zuverlässigkeitsanforderungen geeignet“; Übergang zu niedriger definierter Ausfallwahrscheinlichkeit bei „für eine definierte niedrige Ausfallwahrscheinlichkeit“.
- QA: Labels erscheinen nie vor den zugehörigen Intervallen; Ausfälle bleiben natürlich beziehungsweise fachlich begründet verteilt; Pfeile und Text dürfen sich nicht überschneiden.

## Szene 48 - Parts per Million

- Quell-SVG: Folie 53
- Lernziel: Prozent, Promille und ppm als Skalen derselben Anteilslogik verstehen und ppm immer an einen Bezugszeitpunkt koppeln.
- Aufbau: eine gemeinsame dreistufige Skala `1 von 100`, `1 von 1.000`, `1 von 1.000.000`; klare visuelle Vergrößerung statt dichter Tabelle; darunter die Pflichtkopplung aus Ausfallwahrscheinlichkeit und Lebensdauer.
- Animation: alle drei Skalen gemeinsam bei „Prozent, Promille oder Parts Per Million“; Kopplung mit Lebensdauer bei „nur sinnvoll, wenn sie für eine Lebensdauer ... definiert wird“; Übergang zu Bq bei „Genau hierfür ist die B-Q-Lebensdauer geeignet“.
- QA: `1 %`, `1 ‰` und `1 ppm` korrekt; kein Prozent-Promille-Zeichenfehler; Bezugszeit beziehungsweise Laufleistung bleibt sichtbar.

## Szene 49 - Bq-Lebensdauer

- Quell-SVG: Folie 54
- Lernziel: Eine definierte Ausfallwahrscheinlichkeit einer konkreten Lebensdauer zuordnen und das Beispiel `B5 = 100.000 km` lesen.
- Aufbau: dominanter Python-CDF-Plot mit B5, B10, B20 und B50; rechts eine klare 5-/95-Prozent-Aufteilung und die Definition von q.
- Python-Plot: `reliability_metric_plots.py --plot bq_life`; Verteilungskurve, B5-Beispiel und weitere Bq-Marker als semantische Ziele.
- Animation: Kurve bei „ordnet einer bestimmten Lebensdauer eine definierte Ausfallwahrscheinlichkeit zu“; q-Erklärung bei „Q für die Ausfallwahrscheinlichkeit in Prozent“; B5-Marker und 5-/95-Aufteilung gemeinsam beim Beispiel; weitere Marker bei „flexibel für verschiedene Lebensdauern“; Nutzen bei „präzise Methode zur Festlegung und Überprüfung“.
- QA: B5 bedeutet fünf Prozent ausgefallen und 95 Prozent intakt; q wird nicht als Zuverlässigkeit interpretiert; alle Plotlabels erscheinen mit ihrer Geometrie.

## Abnahmefolge

1. Szene erzeugen und Assets lokal in ihrem Szenenordner speichern.
2. Szene im Endzustand und in allen Animationszuständen rendern.
3. Inhalt gegen Quell-SVG und Sprechertext crosschecken.
4. Browserbasierte Layout-QA im Warn-Modus ausführen.
5. Befunde beheben und dieselbe Szene erneut prüfen.
6. Erst nach bestandener Re-QA mit der nächsten Szene fortfahren.
7. Nach Szene 49 einen Kapitel-Crosscheck für alle zehn Zielszenen durchführen.
