# Extracted Source Text

- module_id: RE1
- source_docx: source-materials/basis-seminar/powerpoint-svg/RE1/Text/06_Modul_Einfuehrung_ZUV - Histogramm_Dichtefunktion.docx
- source_sha256: c88155bfda927ece3d273d0743ee3e66739413ec8ea967883a60d16bacbfa132
- extraction_method: deterministic_ooxml_table_parser
- modul_nummer: 1
- modul_titel: Einführung in die Zuverlässigkeit
- abschnitt_nummer: 6
- abschnitt: Histogramm und Dichtefunktion

## Folie 1: Zahnbruch Wöhlerversuch mit Streuung der Ausfallzeiten

- section_id: section_001
- source_local_slide_numbers: 1
- spoken_text_sha256: 35ac61e7a6bf0b9cf35c8d01370ad01046efec15b2fa697d5e4b4d583be566f3

### Gesprochener Text

Hallo und willkommen zum Kapitel mathematische Behandlung der Zuverlässigkeit!

Nachdem wir in den vorherigen Lektionen die Zuverlässigkeitsmethoden kennengelernt und uns auch die fünf Phasen des Zuverlässigkeitsprozesses näher angeschaut haben, steigen wir nun gemeinsam in die mathematische Beschreibung der Zuverlässigkeit ein.

Zur Einführung schauen wir uns zunächst einmal einen typischen Verlauf der Wöhlerkurve an. Die Wöhlerkurve beschreibt den Zusammenhang zwischen der erreichten Lebensdauer eines Produktes und der Belastung, die auf das Produkt einwirkt.

In unserem Beispiel ist die erreichte Lebensdauer für ein Zahnrad als Lastwechselzahl in Abhängigkeit der Zahnfußbiegespannung dargestellt. Dabei wurden mehrere Versuche auf unterschiedlichen Lastniveaus bis zum Zahnbruch durchgeführt.

Betrachten wir nun die erreichten Ausfallzeiten für die Stichproben auf dem Lastniveau Sechshundertvierzig Newton pro Quadratmillimeter. Dabei ist zu erkennen, dass die einzelnen Ausfälle nicht immer zu einem exakt gleichen Zeitpunkt vorliegen, sondern in einem gewissen Bereich streuen.

Die Aufgabe der Zuverlässigkeitstechnik ist es nun, trotz der Streuung dieser Ausfallzeiten, das produktspezifische Ausfallverhalten statistisch zu beschreiben.

Auf diese Weise lassen sich dann Aussagen bezüglich der Lebensdauer eines Produktes tätigen.

Wie wir das genau machen, schauen wir uns nun im Folgenden an.

## Folie 2/3: Histogramm und Dichtefunktion

- section_id: section_002
- source_local_slide_numbers: 2, 3
- spoken_text_sha256: 87968f6e08d3dad98a9c110d7111a52680607c951b0a7d3ae55a7b6b0166959d

### Gesprochener Text

Zunächst erstellen wir ein Histogramm für die Ausfallzeiten unserer Stichprobe auf dem Lastniveau Sechshundertvierzig Newton pro Quadratmillimeter.

Ein Histogramm ist eine grafische Darstellung der empirischen Daten und kann zur Visualisierung der Verteilung einer bestimmten Variablen verwendet werden.

In unserem Fall ist die Variable natürlich die Ausfallzeit.

Das Histogramm besteht aus einer Serie von Balken, wobei die Höhe jedes Balkens die Häufigkeit angibt, mit der die einzelnen Ausfallzeiten in den jeweiligen Intervallen des Balkens auftreten.

Die einzelnen Balken werden auch als Klassen bezeichnet.

Die Form eines Histogramms hängt maßgeblich von der Anzahl der Klassen und damit auch von der gewählten Klassenbreite ab.

In unserem Beispiel erkennen wir, dass die Ausfälle bai der Klasse um fünfundzwanzigtausend Lastwechsel beginnen und bai der um vierzigtausend enden.

Die meisten Ausfälle finden in der Klasse um dreißigtausend Lastwechsel statt.

Wir sehen also, dass wir bereits jetzt schon mit Hilfe des Histogramms unsere Stichprobe beschreiben können.

In der Zuverlässigkeitstechnik ist es aber erforderlich, nicht nur einzelne Stichproben eines Produktes zu betrachten, sondern auch Informationen über dessen gesamte Population, also allen Einheiten des Produktes zu erhalten.

Die gesamte Population wird auch als sogenannte Grundgesamtheit bezeichnet.

Würden wir nun die Stichprobengröße und auch die Klassenanzahl immer weiter erhöhen, nähert sich das Histogramm einer glatten Kurve an.

Diese glatte Kurve stellt die Dichtefunktion der Grundgesamtheit des Produktes dar und ist die erste Zuverlässigkeitsfunktion, die wir kennenlernen.

In der Realität können wir aber aufgrund von Kosten und Aufwänden die Stichprobengröße nicht beliebig erhöhen.

Wir haben für gewöhnlich also immer nur Ausfalldaten zu einem Teil der Grundgesamtheit vorliegen, weshalb wir am Ende auch immer nur die empirische Dichtefunktion ermitteln können, die sich von der idealen Funktion unterscheiden kann.

Dabei wird, ausgehend von der Stichprobe und durch den Einsatz von statistischen Schätzverfahren, die wahrscheinlichste Dichtefunktion für das reale Ausfallverhalten bestimmt.

Diese einzelnen Schätzverfahren, die hierfür verwendet werden, lernen wir noch in der Lektion Datenanalyse näher kennen.

Wichtig zu merken an dieser Stelle ist, dass wir nun mit Hilfe der ermittelten Dichtefunktion die Gesamtpopulation beschreiben können.

So könnte man in unserem Schaubild direkt interpretieren, dass die Ausfälle erst mit circa dreiundzwanzigtausend Lastwechsel beginnen und das alle Einheiten bis ungefähr fünfundvierzigtausend Lastwechsel ausgefallen sind.

## Folie 4: Dreidimensionale Wöhlerkurve für Zahnbruchversuch

- section_id: section_003
- source_local_slide_numbers: 4
- spoken_text_sha256: 9f33665d88e8b5df720333b42b5501839db3ea0838702207b701a4c3d67277b7

### Gesprochener Text

Die Dichtefunktion beschreibt das Ausfallverhalten über der Zeit für ein spezifisches Lastniveau.

Erweitert man nun die Darstellung um die Dimension der Spannung des jeweiligen Lastniveaus, lässt sich die Wöhlerkurve auch in einem dreidimensionalen Schaubild darstellen.

## Folie 5: Ausfalldichte eines 6-Gang-NKW Getriebes

- section_id: section_004
- source_local_slide_numbers: 5
- spoken_text_sha256: f87f7f4d04203243149f1fb4c22e1d599fb6ce0fbcdc610f0ee0cba55c801df5

### Gesprochener Text

Kommen wir nun zu einem weiteren technischen Beispiel.

Im Schaubild ist die Dichtefunktion der Ausfälle eines Sechsgang-Nutzfahrzeuggetriebes zu sehen.

Die Beschreibung der Dichtefunktion erfolgte dabei auf Grundlage von zweitausendeinhundertfünfzehn Schadensereignissen am Getriebe.

Da hierfür reale Kundendaten verwendet worden sind, wurde die x-Achse normiert.

Es ist also nur der qualitative Verlauf der Dichtefunktion dargestellt.

Nun zu zwei Fragen. Was fällt dir generell am Verlauf dieser Dichtefunktion auf?

Und wäre eine solche Verteilung für ein Produkt wünschenswert?

Pausiere dazu kurz das Video und versuche die Fragen zu beantworten.

Was dir als erstes auffallen sollte, ist, dass die Verteilung auf der rechten Seite deutlich flacher abfällt als auf der linken.

Man spricht hierbei von einer rechtsschiefen oder auch linkssteilen Verteilung.

Bezogen auf die Ausfallzeiten bedeutet dies, dass viele Ausfälle eher zu frühen Lebenszeiten des Getriebes auftreten und deren Streuung über einen breiten Zeitbereich reicht.

Es fällt auch auf, dass die Ausfalldichte direkt an der Ypsilon-Achse beginnt und somit Ausfälle auch direkt zu Beginn der Lebenszeit zu erwarten sind.

Wäre eine solche Verteilung wünschenswert? Nein.

Für die Kunden wäre ein solches Ausfallverhalten aufgrund der hohen Anzahl an Ausfällen direkt zu Beginn der Lebenszeit sicher nicht akzeptabel.

Auch der Hersteller müsste hier mit hohen Garantiekosten und Imageschäden rechnen.

Es wäre also wünschenswert, dass die Verteilung mit einem flachen Anstieg beginnt und eher weiter nach rechts verschoben wird.

## Folie 6: Dichtefunktion f(t) der menschlichen Sterbefälle

- section_id: section_005
- source_local_slide_numbers: 6
- spoken_text_sha256: ac2dab92622d83f3ca207b2f41d987ad5dd636030491a13be7712dd21f13b409

### Gesprochener Text

Ein weiteres Beispiel zur Dichtefunktion findet sich Abseits von technischen Produkten bai uns Menschen.

Hierbei kann die Sterblichkeit von Männern und Frauen auch mithilfe der Dichtefunktion beschrieben werden.

Es ist zu erkennen, wie die Sterbefälle von Männern ab einem Alter von vierzig Jahren und die von Frauen ab etwa fünfzig Jahren deutlich ansteigen.

Die meisten Männer sterben demnach bai einem Alter von circa achtundsiebzig Jahren.

Bei den Frauen treten die häufigsten Todesfälle bai circa siebenundachtzig Jahren auf.

Dieses Beispiel zeigt auf, dass die Dichtefunktion eine allgemeine statistische Beschreibung ist und keinesfalls in der Anwendung auf die Zuverlässigkeitstechnik beschränkt ist.

