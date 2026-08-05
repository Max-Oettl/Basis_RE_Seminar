# Extracted Source Text

- module_id: RE1
- source_docx: source-materials/basis-seminar/powerpoint-svg/RE1/Text/07_Modul_Einfuehrung_ZUV - Ausfallwahrscheinlichkeit und Zuverlässigkeit.docx
- source_sha256: e9cb5dfbefe19f0beab5fbd6c66a6403f47b96d5c3f300b6e6d179ba24e9214e
- extraction_method: deterministic_ooxml_table_parser
- modul_nummer: 1
- modul_titel: Einführung in die Zuverlässigkeit
- abschnitt_nummer: 7
- abschnitt: Ausfallwahrscheinlichkeit und Zuverlässigkeit

## Folie 1: Summenhäufigkeit und Verteilungsfunktion

- section_id: section_001
- source_local_slide_numbers: 1
- spoken_text_sha256: 245cd5104706822b0862b96b8a866220f1b63667daaa942a9414dd09e5a6c76c

### Gesprochener Text

Nachdem wir in der vorherigen Lektion das Histogramm und die Dichtefunktion kennengelernt haben, lernen wir nun zwei weitere Zuverlässigkeitsfunktionen kennen.

Beginnen werden wir mit der sogenannten Verteilungsfunktion, die auch Ausfallwahrscheinlichkeit genannt wird.

Das Histogramm bzw. die Dichtefunktion gibt einen Aufschluss über die Anzahl der ausgefallenen Einheiten zu einem spezifischen Zeitpunkt.

In der Praxis ist es aber meistens wichtiger zu wissen, wie viele Einheiten eines Produktes bis zu einem bestimmten Zeitpunkt insgesamt ausgefallen sind.Diese Information erhält man durch das Histogramm der Summenhäufigkeit.

Man summiert also einfach im Histogramm die Anzahl der Ausfälle in den jeweiligen Klassen über der Zeit kumulativ auf.

Die Verbindungslinie im Histogramm ergibt eine weitere Funktion, die wir empirische Verteilungsfunktion nennen und die Summe der Ausfälle über der Zeit beschreibt.

## Folie 2: Summenhäufigkeit und Verteilungsfunktion

- section_id: section_002
- source_local_slide_numbers: 2
- spoken_text_sha256: 2f3e90fdf82b7919c4d9db46c5731f0ffe9587cf5723a386d062b6954391557b

### Gesprochener Text

Wird nun wieder die Anzahl der Ausfälle gegen unendlich immer weiter erhöht, ergib sich wieder eine glatte Kurve, die man Verteilungsfunktion oder auch einfach Ausfallwahrscheinlichkeit groß F von t nennt.

Mathematisch kann die Ausfallwahrscheinlichkeit durch das Integral der Dichtefunktion berechnet werden, oder andersherum, die Dichtefunktion einfach durch die Ableitung der Ausfallwahrscheinlichkeit.

Die Ausfallwahrscheinlichkeit startet zu Beginn der Lebensdauer immer bei einem Wert von null Prozent, da bis hier noch keine Einheiten ausgefallen sind.

Anschließend steigt sie immer weiter an und erreicht zu einem bestimmten Zeitpunkt dann den Wert von einhundert Prozent, bai dem alle Einheiten eines Produktes ausgefallen sind.

Dabei ergibt sich typischerweise ein S-förmiger Verlauf.

Obwohl die Ausfallwahrscheinlichkeit weniger anschaulich als die Dichtefunktion ist, kann sie bei der Auswertung von Versuchen sehr vorteilhaft eingesetzt werden.

Die Ausfallwahrscheinlichkeit beschreibt statistisch, mit welcher Wahrscheinlichkeit ein Produkt zu einem gewissen Zeitpunkt ausfällt und ist daher eine der zentralen Kenngrößen in der Zuverlässigkeitstechnik.

## Folie 3: Ausfallwahrscheinlichkeit eines 6-Gang-NKW Getriebes

- section_id: section_003
- source_local_slide_numbers: 3
- spoken_text_sha256: 33da9838c7b01470678d5b1ad874021908499e6c9dc92434ee68a70ac5bbaaaf

### Gesprochener Text

Betrachten wir nun am bekannten Beispiel des Sechsgang-Nutzfahrzeuggetriebes die Ausfallwahrscheinlichkeit.

Wir können nun direkt aus dem Diagramm ablesen, wie viel Prozent der Getriebe zu einem spezifischen Zeitpunkt ausgefallen sind.

Ist diese Kurve repräsentativ für das Produkt, kann man natürlich auch dann die Ausfallwahrscheinlichkeit zu einem spezifischen Zeitpunkt für ein neu in betrieb genommenes Produkt prognostizieren.

Interessiert uns beispielsweise, wann zehn Prozent der Getriebe ausgefallen sind, gehen wir an der Ypsilon-Achse bai einem Wert von zehn Prozent horizontal in das Schaubild bis wir die Kurve schneiden.

Von da an gehen wir dann vertikal herunter bis zur x-Achse und können den gewünschten Zeitpunkt ablesen.

Interessiert uns aber wie viele Einheiten zum Zeitpunkt eins ausgefallen sind, gehen wir den gleichen Weg rückwärts.

Wir starten also beim gewünschten Zeitpunkt eins, gehen dann vertikal hoch, bis wir die Kurve schneiden und gehen dann von dort aus wieder horizontal nach links.

Am Schnittpunkt mit der Ypsilon-Achse können wir dann ablesen wie viele Prozent der Getriebe zu diesem Zeitpunkt bereits ausgefallen sind.

## Folie 4: Ausfallwahrscheinlichkeit des Menschen

- section_id: section_004
- source_local_slide_numbers: 4
- spoken_text_sha256: bc4647d9ca4cc047367f918c89d129c1f953f12af878bc9e62a6a91b84616fb0

### Gesprochener Text

Schauen wir uns nun die Verteilungsfunktion am Beispiel des Menschen an, ergeben sich ähnliche Erkenntnisse wie bai der Betrachtung der Dichtefunktion.

Die Ausfallwahrscheinlichkeit, also die Wahrscheinlichkeit zu sterben, steigt bei Männern im Vergleich zu den Frauen deutlich steiler an.

Demnach sind auch bei einem Lebensalter von achtzig Jahren, gerade einmal sechsunddreißig Prozent der Frauen und dagegen zweiundsechzig Prozent der Männer verstorben.

## Folie 5: Überlebenswahrscheinlichkeit

- section_id: section_005
- source_local_slide_numbers: 5
- spoken_text_sha256: f86b2d5e2a7e17029bbe456df2f51eeb9b77c1e32c2cb4e0b009d785b3deebe1

### Gesprochener Text

Als Zuverlässigkeitsingenieure sind wir insbesondere an der Überlebenswahrscheinlichkeit bzw. Zuverlässigkeit unserer Produkte interessiert.

Diese ist eine weitere Funktion, die wir nun kennenlernen und wird entsprechend dem englischen Begriff reliability durch ein großes R abgekürzt.

Die Überlebenswahrscheinlichkeit lässt sich direkt aus der Ausfallwahrscheinlichkeit ableiten.

Grundlage hierfür ist, dass die ausgefallenen Einheiten zusammen mit den noch intakten Einheiten immer hundert Prozent ergeben müssen.

Demnach berechnet sich die Überlebenswahrscheinlichkeit bzw. Zuverlässigkeit also einfach zu eins minus der Ausfallwahrscheinlichkeit.

Grafisch kann die Abhängigkeit auch mit Hilfe der Dichtefunktion visualisiert werden.

Für einen spezifischen Zeitpunkt t-x kann die Ausfallwahrscheinlichkeit über das Flächenintegral der Dichtefunktion von null bis t-x berechnet werden.Damit weiß man also, wie viele Einheiten bis zu diesem Zeitpunkt ausgefallen sind.

Umgekehrt kann die Zuverlässigkeit über das Flächenintegral von t-x bis unendlich berechnet werden.Dies gibt einem einen Aufschluss, wie viele Einheiten insgesamt noch intakt sind.

