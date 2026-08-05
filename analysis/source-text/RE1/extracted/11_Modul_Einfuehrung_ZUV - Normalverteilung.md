# Extracted Source Text

- module_id: RE1
- source_docx: source-materials/basis-seminar/powerpoint-svg/RE1/Text/11_Modul_Einfuehrung_ZUV - Normalverteilung.docx
- source_sha256: fa888d062c6b972e8d2b8c87ea555829e92ea2786e111fa6c5f9aa9192b3a8e3
- extraction_method: deterministic_ooxml_table_parser
- modul_nummer: 1
- modul_titel: Einführung in die Zuverlässigkeit
- abschnitt_nummer: 11
- abschnitt: Normalverteilung

## Folie 1: Die Normalverteilung

- section_id: section_001
- source_local_slide_numbers: 1
- spoken_text_sha256: 0d0ad404fb8701fcfa72fdf150a4f881c4f271ac4ca793dd038ff808b8d9f0a9

### Gesprochener Text

In diesem Kapitel schauen wir uns unterschiedliche Wahrscheinlichkeitsverteilungen an, die zur Beschreibung von Lebensdauerdaten verwendet werden können.

Wir starten mit der hier abgebildeten Normalverteilung, welche als Dichtefunktion dargestellt ist.

Die Verteilung ist durch zwei Parameter definiert.

Zum einen durch den Erwartungswert mü, welcher die Lage der Verteilung beschreibt.

Und zum anderen durch die Standardabweichung, welche ein Maß für die Streuung der Verteilung um den Erwartungswert darstellt.

Dabei gilt, je kleiner die Streuung, desto schmaler und höher ist die Kurve.

Aufgrund der Streuung um den Erwartungswert kann sich die Verteilung theoretisch unendlich in beide Richtungen der x-Achse ausdehnen.

Charakteristisch für die Normalverteilung ist die symmetrische Glockenform, was dazu führt, dass der Erwartungswert, der Median und der Modalwert alle zum gleichen Zeitpunkt, bai einer Wahrscheinlichkeit von fünfzig Prozent, liegen.

Die Normalverteilung besitzt eher außerhalb der Zuverlässigkeitstechnik eine große Bedeutung.

Typische Anwendungsgebiete sind beispielsweise das Finanzwesen, die Medizin, aber auch Naturwissenschaften.

Warum die Normalverteilung jedoch weniger in der Zuverlässigkeitstechnik verwendet wird, diskutieren wir im Folgenden.

## Folie 2: Ausfallfunktion der Normalverteilung

- section_id: section_002
- source_local_slide_numbers: 2
- spoken_text_sha256: 1a80062865694b5df8eb3abe751659a6a1d5a414b6e0c86a6ff055cc6f5e267c

### Gesprochener Text

Wir haben eben einen ersten Überblick über die Dichtefunktion der Normalverteilung erhalten und zudem auch gesehen, wie sie sich für unterschiedliche Standardabweichungen verhält.

Neben der Dichtefunktion kann die Normalverteilung natürlich auch als Ausfallrate Lambda sowie Ausfallwahrscheinlichkeit und Überlebenswahrscheinlichkeit dargestellt werden.

Betrachten wir zunächst nur den Verlauf der Ausfallrate.

Wir können erkennen, dass die Ausfallrate für unterschiedliche Größen der Standardabweichung immer kontinuierlich zunimmt.

Aber was bedeutet das genau?Schauen wir uns hierzu nochmals die Badewannenkurve an.

Hier können wir sehen, dass steigende Ausfallraten nur im Bereich drei enthalten sind.

Das heißt also, dass sich die Normalverteilung aufgrund ihrer steigenden Ausfallrate, nur zur Beschreibung des dritten Bereichs der Badewannenkurve eignet.

Damit können ausschließlich Verschleiß- und Ermüdungsausfälle dargestellt werden.

Dies stellt einen offensichtlichen Nachteil dar, denn sollten bai unserem Produkt Früh- oder Zufallsausfälle auftreten, können wir diese nicht mit Hilfe der Normalverteilung beschreiben.

Betrachten wir nun das Schaubild der Ausfallwahrscheinlichkeit.

Bei Betrachtung der gelben Kurve mit einer Standardabweichung von zwei, wird deutlich, warum die Normalverteilung zur Beschreibung von Lebensdauerdaten eher weniger geeignet ist.

Zum Zeitpunkt t gleich null sind bereits zehn Prozent der Produkte ausgefallen.

Die Streuung wirkt vom Erwartungswert aus in beide Richtungen der x-Achse, wodurch die Normalverteilung auch negative Ausfallzeiten beschreiben kann.

Da die Ausfallzeiten in Realität natürlich nicht im negativen Zeitbereich sein können, ist die Normalverteilung in der Regel für Lebensdauerprognosen nicht geeignet.

Werfen wir trotzdem einmal einen Blick auf die Formeln für die einzelnen Zuverlässigkeitsfunktionen der Normalverteilung.

## Folie 3: Formeln der Normalverteilung

- section_id: section_003
- source_local_slide_numbers: 3
- spoken_text_sha256: 708fab8574e277d525fb44df676f67fc007a3ebe9514cb174098ec0d1f7a46e6

### Gesprochener Text

Wie bereits beschrieben, wird die Normalverteilung durch den Erwartungswert und die Standardabweichung definiert.

Allein durch Betrachtung der Dichtefunktion fällt ein weiterer negativer Aspekt der Normalverteilung auf.

Die mathematische Beziehung ist relativ komplex.

Die Ausfallwahrscheinlichkeit zum Zeitpunkt t berechnet sich aus dem Integral von null bis t über der Dichtefunktion.

Die Überlebenswahrscheinlichkeit dagegen kann dann wiederrum einfach zu eins minus der Ausfallwahrscheinlichkeit berechnet werden.Das ist auch der Grund, warum hierbei das Integral einfach vom Zeitpunkt t bis unendlich berechnet wird.

Die Ausfallrate kann wiederrum berechnet werden, indem die Dichtefunktion durch die Zuverlässigkeitsfunktion geteilt wird.

Da die Berechnung aller Funktionen mathematisch auf der Dichtefunktion basiert, setzt sich die Komplexität auch damit in den weiteren Gleichungen fort, was die Normalverteilung in der Anwendung erschwert.

Im Computer-Zeitalter sollte dies allerdings keinen großen Nachteil darstellen.

Wir haben nun die Normalverteilung sowie die mathematischen Gleichungen der einzelnen Zuverlässigkeitsfunktionen kennengelernt.

Wir haben auch gesehen, dass man mit Hilfe der Normalverteilung nur den dritten Bereich der Badewannenkurve beschreiben kann und dass die Verteilung aufgrund der negativen Ausfallzeiten eher nicht zur Anwendung in der Zuverlässigkeitstechnik geeignet ist.

Wir werden aber im Laufe dieses Kapitels noch weitere, deutlich besser geeignete Verteilungen zur Beschreibung von Lebensdauerdaten kennenlernen.

