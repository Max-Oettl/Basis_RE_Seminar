# Extracted Source Text

- module_id: RE1
- source_docx: source-materials/basis-seminar/powerpoint-svg/RE1/Text/13_Modul_Einfuehrung_ZUV - Weibullverteilung.docx
- source_sha256: 8ef0e26693f9cbe2b5dc5572977883e841743d6682d0915d4227b8ce6e7ae60b
- extraction_method: deterministic_ooxml_table_parser
- modul_nummer: 1
- modul_titel: Einführung in die Zuverlässigkeit
- abschnitt_nummer: 13
- abschnitt: Weibullverteilung

## Folie 1: Die Weibullverteilung

- section_id: section_001
- source_local_slide_numbers: 1
- spoken_text_sha256: 7a992ab8a6efcaf8f6798cbcc51c9ae4a61ac6af301904d1411c615e376d4e8c

### Gesprochener Text

In dieser Lektion lernen wir die Weibullverteilung kennen, die zur statistischen Beschreibung von Ausfällen verwendet wird.

Auf der rechten Seite sind hierzu unterschiedliche Verläufe von Dichtefunktionen dargestellt.

Die Weibullverteilung ist dabei generell durch zwei Parameter definiert.

Zum einen durch die charakteristische Lebensdauer groß T und zum anderen durch den Formparameter b.

Die charakteristische Lebensdauer ist eine Art Lageparameter und kann die Verteilungen nach links oder rechts, also entlang der zeitlichen Achse, verschieben.

Der Formparameter b bestimmt dabei die Form der Verteilung.

Aufgrund dieses Formparameters ist die Weibullverteilung sehr flexibel, wodurch sich unterschiedlichste Arten von Ausfallverhalten modellieren lassen.

Dies ist auch im Schaubild rechts anhand der einzelnen Kurven zu sehen.

Dabei sind die Dichtefunktionen für unterschiedliche Formparameter bai einer charakteristischen Lebensdauer von eins dargestellt.

Für b gleich eins ergibt sich beispielsweise genau die Exponentialverteilung.

Für b gleich dreikommafünf stellt sich eine Normalverteilung ein, was an der symmetrischen Glockenkurve zu erkennen ist.

Aufgrund der Flexibilität hat die Weibullverteilung ein sehr breites Anwendungsspektrum.

Die Verteilung wird beispielsweise in der Lebensdauerdatenanalyse, im Versicherungswesen oder auch in der Medizin angewendet.

## Folie 2: Ausfallraten der Weibullverteilung

- section_id: section_002
- source_local_slide_numbers: 2
- spoken_text_sha256: 38c7b91f2669913dbb8817c817b515700ff63f924ea2483757522de377561388

### Gesprochener Text

Schauen wir uns nun einmal die Ausfallraten der Weibullverteilung an.

Auch hier sind wieder die verschiedenen Kurven für unterschiedliche Formparameter bai der charakteristischen Lebensdauer von eins dargestellt.

Wir können sehen, dass der generelle Verlauf einer Kurve sehr stark von dem Formparameter abhängt.

Für b gleich eins ergibt sich eine konstante Ausfallrate und demnach eine waagerechte Linie.

Für b kleiner eins, sinkt die Ausfallrate über der Zeit, wodurch wir einen abfallenden Verlauf erhalten.

Und für b größer eins ist ein ansteigender Verlauf der Ausfallrate zu erkennen.

## Folie 3: Ausfallraten der Weibullverteilung

- section_id: section_003
- source_local_slide_numbers: 3
- spoken_text_sha256: 065b5efa1c8f9d914c2dd7e97ca576a84f4b801f42e0781ed4d5da8d95d93414

### Gesprochener Text

Halten wir uns dazu noch einmal die Badewannenkurve vor Augen.

Mit einem Formparameter von eins können wir den mittleren Bereich der Badewannenkurve beschreiben, also das zufällige Ausfallverhalten.

Für einen Formparameter kleiner eins befinden wir uns im ersten Bereich der Badewannenkurve, wodurch sich Frühausfälle modellieren lassen.

Und für b größer eins befinden wir uns im dritten Bereich der Badewannenkurve, wodurch sich Verschleißausfälle modellieren lassen.

Wir sehen, dass wir mit Hilfe der Weibullverteilung alle drei Bereiche der Badewannenkurve abdecken können.

Mit ihr lässt sich also das Ausfallverhalten eines Produktes über dessen gesamten Lebenszyklus beschreiben.

Diese Flexibilität macht die Weibullverteilung zu einem perfekten Werkzeug und ist unter anderem auch der Grund, dass sie eine der am häufigsten verwendeten Verteilung zur Beschreibung von Lebensdauerdaten ist.

## Folie 4: Ausfallwahrscheinlichkeit der Weibullverteilung

- section_id: section_004
- source_local_slide_numbers: 4
- spoken_text_sha256: 905b709a914f813d9ba08e227357b8b23f37243bd0a53da105fc0d6119fcb2c1

### Gesprochener Text

Zuvor haben wir uns angeschaut welchen Einfluss der Formparameter b auf die Weibullverteilung besitzt.

Nun schauen wir uns einmal genauer die charakteristische Lebensdauer an.

Hierzu sind die Verläufe der Ausfallwahrscheinlichkeit wieder für unterschiedliche Formparameter bai der charakteristischen Lebensdauer von eins dargestellt.

Was direkt auffällt, ist, dass alle Kurven zum Zeitpunkt der charakteristischen Lebensdauer durch einen gemeinsamen Punkt verlaufen.

Dieser Punkt entspricht exakt einer Ausfallwahrscheinlichkeit von dreiundsechzigkommazwei Prozent.

Den Grund hierfür lernen wir gleich noch kennen, wenn wir uns gemeinsam den mathematischen Gleichungen widmen.

An dieser Stelle ist es aber wichtig zu verstehen, dass der charakteristischen Lebensdauer immer eine Ausfallwahrscheinlichkeit von dreiundsechzigkommazwei Prozent zugeordnet ist.

Demnach kann sie auch als eine Art Lageparameter verstanden werden.

## Folie 5: Formeln der 2-parametrigen Weibullverteilung

- section_id: section_005
- source_local_slide_numbers: 5
- spoken_text_sha256: 70c85e7404fd2b0f30db09205649b012c63d3fbc96ff61533321db9176f9c542

### Gesprochener Text

Die Weibullverteilung kann mathematisch über die charakteristische Lebensdauer und den Formparameter beschrieben werden.

Entsprechend lässt sich die Dichtefunktion einfach mit Hilfe dieser beiden Parameter berechnen.

Über das Integral der Dichtefunktion erhält man die Ausfallwahrscheinlichkeit groß F von t.

Diese ergibt sich zu eins minus e, hoch minus t, geteilt durch groß T, hoch b.

Die Überlebenswahrscheinlichkeit R von t berechnet sich dann einfach zu eins minus der Ausfallwahrscheinlichkeit, was e hoch minus t, geteilt durch groß T, hoch b ergibt.

Und zum Schluss noch die Ausfallrate, welche sich durch den Quotienten aus Dichtefunktion und Zuverlässigkeitsfunktion berechnen lässt.

Zuvor habe ich erwähnt, dass der charakteristischen Lebensdauer immer eine Ausfallwahrscheinlichkeit von dreiundsechzigkommazwei Prozent zugeordnet ist.

Schauen wir uns einmal genauer an warum das so ist.

## Folie 6: Formeln der 2-parametrigen Weibullverteilung

- section_id: section_006
- source_local_slide_numbers: 6
- spoken_text_sha256: 30dd402e33f2d79e48e5384e09ade5977c1b4c6fcbe7dfae7f73433985165b94

### Gesprochener Text

Setzt man für die gewünschte Zeit nun die charakteristische Lebensdauer ein, erhält man F von groß T ist gleich eins minus e, hoch minus groß T, geteilt durch groß T, hoch b.

Da sich die Klammer zu eins ergibt, lässt sich die Gleichung weiter vereinfachen zu eins minus e, hoch minus eins, hoch b, was sich wiederrum einfach zu eins minus e, hoch minus eins, umschreiben lässt.

e, hoch minus eins ergibt null-komma-drei-sechs-acht, wodurch man am Ende für die Ausfallwahrscheinlichkeit ungefähr null-komma-sechs-drei-zwei erhält.

Demnach verlaufen alle Kurven bai der Zeit der charakteristischen Lebensdauer immer durch eine Ausfallwahrscheinlichkeit von dreiundsechzigkommazwei Prozent.

Entsprechend umgekehrt kann man auch die Zuverlässigkeit berechnen und kommt zum Entschluss, dass die Kurven durch eine Zuverlässigkeit von sechsunddreißigkomma-acht Prozent verlaufen.

## Folie 7/8: Formeln der 3-parametrigen Weibullverteilung

- section_id: section_007
- source_local_slide_numbers: 7, 8
- spoken_text_sha256: a56e42af8eb9ecadb6a40a226d9a277cdb87221a2fbced4502a84d44e6e29850

### Gesprochener Text

Wir haben nun die Weibullverteilung mit ihren zwei Parametern der charakteristischen Lebensdauer groß T und dem Formparameter b kennengelernt.

Da die Verteilung nur mit Hilfe von zwei Parametern definiert wird, wird sie auch zwei-parametrige Weibullverteilung genannt.

Es gibt aber auch die Möglichkeit einen dritten Parameter einzuführen und damit die Weibullverteilung in eine drei-parametrige Verteilung zu überführen.

Der dritte Parameter ist die sogenannte ausfallfreie Zeit t null.

Mit ihr kann die Weibullverteilung so angepasst werden, damit Ausfallmechanismen beschrieben werden, bai denen bis zu einem bestimmten Zeitpunkt keine Ausfälle auftreten können.

Ein Beispiel hierfür wäre der Bremsenverschleiß, der erst nach einer bestimmten Anzahl von Bremsungen kritisch werden kann.

In die Gleichungen wird t null eingeführt, indem groß T durch groß T minus t null ersetzt wird.

Dasselbe erfolgt für die Zeitvariable t.

Demnach ergeben sich die hier in Rot angepassten Veränderungen im Vergleich zu der zwei-parametrigen Weibullverteilung.

Schauen wir uns einmal grafisch an, was die ausfallfreie Zeit bai der Weibullverteilung bewirkt.

## Folie 9/10: Charakteristische Lebensdauer als „Mittelwert“

- section_id: section_008
- source_local_slide_numbers: 9, 10
- spoken_text_sha256: 3a5d66932194a4adb25c42d2491638b785ae7b2ab12f48b93e56fb06931a676c

### Gesprochener Text

Zu sehen ist hier die zwei-parametrige Weibullverteilung mit Ihrem Ursprung im Koordinatensystem.

Durch das Einführen der ausfallfreien Zeit erfolgt nun eine Verschiebung der Verteilung nach rechts entlang der Zeitachse.

Anstatt im Ursprung zu beginnen, startet die drei-parametrige Weibullverteilung bai der ausfallfreien Zeit t null.

Die charakteristische Lebensdauer entspricht aber weiterhin einer Ausfallwahrscheinlichkeit von dreiundsechzig-komma-zwei Prozent beziehungsweise einer Zuverlässigkeit von sechsunddreißig-komma-acht Prozent.

## Folie 11/12: Weibullwahrscheinlichkeitspapier

- section_id: section_009
- source_local_slide_numbers: 11, 12
- spoken_text_sha256: e7ab974b29bf6068d8aab02537f3fea6e1491cd6d51063420c29a753105fe166

### Gesprochener Text

Der typische S-förmige Verlauf der Ausfallwahrscheinlichkeit lässt sich wie hier abgebildet auch als Gerade darstellen.

Dafür wird die Ypsilon-Achse doppellogarithmiert und die x-Achse logarithmiert.

Dies ist auch die übliche Darstellung in gewöhnlicher Statistik-Software.

Hier könnt ihr ein sogenanntes Weibull-Wahrscheinlichkeits-Papier sehen, dessen Achsen entsprechend skaliert sind.

Auf dieses Papier kann man händisch eine Weibullverteilung aufzeichnen.

Angenommen wir haben mit Hilfe der Ausfallzeiten die rot dargestellte Weibull-Gerade erhalten.Wie diese Gerade aus den einzelnen Ausfallzeiten genau ermittelt werden kann, ist im Modul Life Data Analysis bzw. zu Deutsch Lebensdauerdatenanalyse beschrieben.

Im Anschluss kann man dann die Gerade parallel in den Pol verschieben.

Auf der rechten Ypsilon-Achse kann dann mit Hilfe des Schnittpunktes der Formparameter der Weibullverteilung bestimmt werden.

Dieses Vorgehen wurde so in der Vergangenheit tatsächlich händisch durchgeführt.

Heutzutage nimmt uns aber diese Arbeit natürlich Statistik-Software komplett ab.

Sehen wir uns am Beispiel eines Sechs-Gang-Nutzfahrzeuggetriebes diese Transformation dennoch an.

## Folie 13: Ausfallwahrscheinlichkeit eines 6-Gang NKW Getriebes

- section_id: section_010
- source_local_slide_numbers: 13
- spoken_text_sha256: b0a30461b39cee86f0fdb8b5b00b7260dfc23d85ed6deff71e0c1bca4d004d9f

### Gesprochener Text

Für die ermittelten Ausfallzeiten des Getriebes ist hier der Verlauf der Ausfallwahrscheinlichkeit über der normierten Lebensdauer dargestellt.

Der Formparameter wurde dabei zu eins-komma-vier ermittelt.

Die Achsen sind dabei normal skaliert und ohne Logarithmierung dargestellt.

Demnach erhält man einen typischen S-förmigen Verlauf der Ausfallwahrscheinlichkeit.

## Folie 14: Ausfallwahrscheinlichkeit eines 6-Gang NKW Getriebes

- section_id: section_011
- source_local_slide_numbers: 14
- spoken_text_sha256: 68864b1a6034c2f4f4d50d66bfe3b71f9b71dcec5f837ce0d1a8e08aead86695

### Gesprochener Text

Nach der Transformation der Achsen in eine einfach bzw. doppel-logarithmierte Skalierung, ergibt sich für dieselbe Verteilung eine geradenförmige Darstellung der Ausfallwahrscheinlichkeit.

Wie bereits erwähnt ist diese Darstellungsform üblich weshalb wir in der Statistik zumeist mit transformierten Achsen und damit Verteilungsfunktionen in Form von Geraden arbeiten.

## Folie 15: Badewannenkurve im Weibullnetz

- section_id: section_012
- source_local_slide_numbers: 15
- spoken_text_sha256: 44fce4f2b2aae7108938a4e980118d31088bf10d0594a176cee25157a0280c07

### Gesprochener Text

Als letztes blicken wir noch einmal auf den Zusammenhang von Weibullverteilung und Badewannenkurve.

Für b gleich eins ist die Ausfallrate Lambda konstant.

Wir befinden uns im Bereich zwei der Zufallsausfälle und können damit folglich zufälliges Ausfallverhalten beschreiben.

Für b kleiner eins sinkt die Ausfallrate über der Zeit, wodurch wir im Bereich eins der Badewannenkurve die Frühausfälle modellieren können.

Und für b größer eins ist im Bereich drei eine ansteigende Ausfallrate zu erkennen.

Wir können also hiermit Ermüdungs- und Verschleißausfälle modellieren.

Es ist wichtig zu betonen, dass die hier gewählte Darstellungsweise rein schematisch zu betrachten ist.

Für einen Datensatz wird immer eine Weibullgerade ermittelt, die die Datenpunkte der einzelnen Ausfälle am besten beschreibt.

In Realität kann dadurch auch ein abknickender Verlauf der Weibull-Gerade entstehen.

Dies ist aber ein Anzeichen dafür, dass die Datenpunkte unterschiedlichen Ausfallmechanismen zu Grunde liegen.

In der Weibull-Schätzung führen dann diese unterschiedlichen Ausfallmechanismen zu anderen Formparametern.

In unserem Beispiel handelt es sich also um drei verschiedene Ausfallmechanismen mit drei unterschiedlichen Formparametern, die am Ende zu diesem abknickenden Verlauf führen.

Unser Ziel ist es aber, immer nur einen einzigen Ausfallmechanismus mit einer Weibullverteilung zu beschreiben.

Treten in Realität also mehrere Ausfallmechanismen im System auf, müssen wir in der Auswertung darauf achten, die einzelnen Datenpunkte getrennt nach den unterschiedlichen Ausfallmechanismen zu analysieren und durch separate Weibullverteilungen zu beschreiben.

Im Anschluss kann daraus dann die Systemzuverlässigkeit, also die Zuverlässigkeit, die aus den einzelnen separaten Weibullverteilungen resultiert, berechnet werden.

Wie das dann genau funktioniert, erfahren wir im weiteren Verlauf des Schulungsprogramms.

