# Modul 3 Test 1 - Sprechertext

Quelle: `source-materials/basis-seminar/narration/Modul_3_Test_1.docx`

## Folie 1 / Aufbaufolge

Allgemeines Vorgehen in der Lebensdatenanalyse

Wie bereits erwähnt, ist der erste Schritt das Sammeln von Lebensdauerdaten. In diesem Fall liegen uns ausschließlich Ausfalldaten in Form unterschiedlicher Zeitwerte vor.

Diese müssen zunächst der Größe nach sortiert werden. Wir können dies einfach entlang der Zeitachse visualisieren.

Im nächsten Schritt bestimmen wir für jeden Zeitpunkt die zugehörige Ausfallwahrscheinlichkeit. Aus den Grundlagen wissen wir bereits, dass die Ausfallwahrscheinlichkeit der Summe der ausgefallenen Einheiten entspricht.

Da uns jedoch nur Zeitwerte vorliegen, können wir die Ausfallwahrscheinlichkeit nicht direkt berechnen. Stattdessen nutzen wir eine Näherungsformel des Median-Rang-Verfahrens. Dabei berechnet sich die Ausfallwahrscheinlichkeit für den i-ten Ausfall als i minus null Komma drei, geteilt durch die Stichprobengröße plus null Komma vier.

Auf diese Weise erhalten wir für jeden Ausfallzeitpunkt einen Wert für die Ausfallwahrscheinlichkeit.

Im Anschluss können wir unsere Ausfallzeiten zusammen mit den entsprechenden Ausfallwahrscheinlichkeiten als Punkte in das Weibull-Wahrscheinlichkeits-Papier mit doppellogarithmischer Darstellung eintragen.

Damit haben wir unser erstes Ziel erreicht: Jedem Ausfallzeitpunkt wurde eine Ausfallwahrscheinlichkeit zugewiesen.

Im nächsten Schritt legen wir eine Ausgleichsgerade durch die Punkte. Dies kann entweder visuell erfolgen oder durch eine Regressionsmethode bestimmt werden.

Sobald die Gerade festgelegt ist, lassen sich die gesuchten Parameter für die Weibullverteilung ableiten. Die charakteristische Lebensdauer lässt sich aus der Ausfallwahrscheinlichkeit von dreiundsechzig Komma zwei ablesen, während der Formparameter durch die Steigung der Geraden bestimmt wird.

Damit haben wir die Weibullverteilung bestimmt, die das Ausfallverhalten am besten beschreibt.

Wenn du bis hierhin folgen konntest, hast du das grundlegende Vorgehen der Lebensdauerdatenanalyse verstanden.

Du hast gelernt, wie man aus Ausfallzeiten eine Weibullverteilung ermittelt. Damit können wir das Ausfallverhalten mathematisch beschreiben und Prognosen für zukünftige Ausfälle erstellen. Und ja, das grundlegende Vorgehen ist tatsächlich so einfach.

Allerdings gibt es einige wichtige Aspekte und Sonderfälle, die beachtet werden müssen. Auf diese gehen wir nun im Folgenden ein.
