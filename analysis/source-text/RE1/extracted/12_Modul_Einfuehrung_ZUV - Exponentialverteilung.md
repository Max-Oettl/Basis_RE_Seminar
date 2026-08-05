# Extracted Source Text

- module_id: RE1
- source_docx: source-materials/basis-seminar/powerpoint-svg/RE1/Text/12_Modul_Einfuehrung_ZUV - Exponentialverteilung.docx
- source_sha256: 21960caf5be8db3369e5cb14a219fafbc207d652d28bd48eec653211892096ec
- extraction_method: deterministic_ooxml_table_parser
- modul_nummer: 1
- modul_titel: Einführung in die Zuverlässigkeit
- abschnitt_nummer: 12
- abschnitt: Exponentialverteilung

## Folie 1: Die Exponentialverteilung

- section_id: section_001
- source_local_slide_numbers: 1
- spoken_text_sha256: 6cfffcc360e60a191631db6aefc1176b80e2eea91f8727600b21ce273be19276

### Gesprochener Text

Kommen wir nun zu unserer zweiten Wahrscheinlichkeitsverteilung, die sogenannte Exponentialverteilung, welche hier als Dichtefunktion dargestellt ist.

Im Vergleich zur Normalverteilung ist die Exponentialverteilung nicht symmetrisch, sondern eine rechtsschiefe Verteilung.

Das bedeutet, dass der Großteil der Datenwerte nahe am Anfang des Wertebereichs liegen und die Kurve dann auf der rechten Seite flach abfällt.

Die Verteilung ist durch einen einzigen Parameter definiert.

Dieser wird Lambda genannt, den wir bereits schon als Ausfallrate kennengelernt haben.

Je größer die Ausfallrate ist, desto höher ist der initiale Startwert der Kurve bai einer Lebensdauer von null und desto steiler ist danach dessen Abfall.

Die Exponentialverteilung hat ein breites Anwendungsspektrum in Naturwissenschaften wie auch im Finanzwesen oder der Zuverlässigkeitstechnik.

Sie wird immer dann angewendet, wenn zufällige Ereignisse modelliert werden müssen.

## Folie 2: Ausfallfunktion der Exponentialverteilung

- section_id: section_002
- source_local_slide_numbers: 2
- spoken_text_sha256: a40b33bb6950e15c31428b53030bed90e14ac51e913fce22e13cae0100ecfd76

### Gesprochener Text

Schauen wir uns nun auch für die Exponentialverteilung neben der Dichtefunktion die Verläufe der Ausfallrate Lambda, sowie der Ausfallwahrscheinlichkeit und Überlebenswahrscheinlichkeit an.

Links unten ist die Ausfallrate dargestellt.

Wir können erkennen, dass die Ausfallrate über der Lebensdauer immer konstant ist.

Wenn wir uns hierzu nochmals die Badewannenkurve anschauen, sehen wir, dass wir mit einer konstanten Ausfallrate nur den zweiten Bereich, also die Zufallsausfälle, beschreiben können.

Wir haben ja auch bereits schon zuvor gelernt, dass die Exponentialverteilung für die Beschreibung zufälliger Ereignisse angewendet wird.

Leider schränkt dieses Verhalten auch die Anwendung im Sinne der Zuverlässigkeitstechnik deutlich ein.

Wir können weder Früh- noch Ermüdungsausfälle mit Hilfe der Exponentialverteilung beschreiben.

Gehen wir nun zurück zu unserer Übersicht und schauen uns die Verläufe der Ausfallwahrscheinlichkeit mal etwas näher an.

Im Gegensatz zur Normalverteilung fällt auf, dass die Exponentialverteilung Ausfallwahrscheinlichkeiten von null bis hundert Prozent ausschließlich im positiven Zeitbereich beschreiben kann.

Demnach beginnen auch alle Kurven bei einer Lebensdauer von t gleich null mit einer Ausfallwahrscheinlichkeit von null Prozent und steigen bis zum Grenzwert von einhundert Prozent an.

Dabei ist charakteristisch, dass die Steigung der Kurven und damit auch die Ausfallhäufigkeit zu Beginn am größten ist und über der Zeit abnimmt.

Je größer die Ausfallrate ist, desto steiler ist hier der Anstieg und desto früher wird der Grenzwert von einhundert Prozent erreicht.

Werfen wir nun einen Blick auf die Formeln für die einzelnen Zuverlässigkeitsfunktionen der Exponentialverteilung.

## Folie 3: Formeln der Exponentialverteilung

- section_id: section_003
- source_local_slide_numbers: 3
- spoken_text_sha256: 7a674736f86f623fece2efa628cabe161254eeea60cd5f7d6ac36a2942daf527

### Gesprochener Text

Wie bereits beschrieben, wird die Exponentialverteilung nur über die Ausfallrate Lamda definiert.

Die Dichtefunktion ergibt sich dabei einfach, als f von t ist gleich Lamda mal e hoch minus Lamda mal t.

Wir sehen also die mathematische Beziehung ist hier relativ einfach.

Die Ausfallwahrscheinlichkeit groß F von t berechnet sich aus dem Integral von null bis t über der Dichtefunktion.

Aufgelöst ergibt das einfach eins minus e hoch minus Lamda mal t.

Die Überlebenswahrscheinlichkeit berechnet sich wiederum zu eins minus der Ausfallwahrscheinlichkeit, was einfach e hoch minus Lamda mal t ist.

Wenn wir uns zurückerinnern, berechnet sich die Ausfallrate, indem die Dichtefunktion durch die Zuverlässigkeitsfunktion geteilt wird.

Tut man dies, erhält man für die Ausfallrate einfach nur den Parameter Lambda.

Dieser kann ebenso aus dem Kehrwert des Mittelwertes berechnet werden.

Wir haben nun die Exponentialverteilung sowie die mathematischen Gleichungen der einzelnen Zuverlässigkeitsfunktionen kennengelernt.

Wir haben auch gesehen, dass man mit Hilfe der Exponentialverteilung nur den zweiten Bereich der Badewannenkurve, also nur die Zufallsausfälle, beschreiben kann.

Wir haben auch gesehen, dass die Formeln für die einzelnen Zuverlässigkeitsfunktionen recht überschaubar sind.

Dies ist unter anderem auch mit ein Grund, warum die Exponentialverteilung in der Zuverlässigkeitstechnik zur Beschreibung von zufälligem Ausfallverhalten sehr beliebt ist.

Als nächstes lernen wir allerdings die in der Zuverlässigkeitstechnik am weitesten verbreitete Wahrscheinlichkeitsverteilung kennen und auch die Gründe dafür, warum diese so bedeutend ist.

