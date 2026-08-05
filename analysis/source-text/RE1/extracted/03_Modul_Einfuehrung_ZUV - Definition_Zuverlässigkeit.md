# Extracted Source Text

- module_id: RE1
- source_docx: source-materials/basis-seminar/powerpoint-svg/RE1/Text/03_Modul_Einfuehrung_ZUV - Definition_Zuverlässigkeit.docx
- source_sha256: 11875b8506d6bef29eb1f9cba20c0006f163f70d2fa153f31a4171db9356b915
- extraction_method: deterministic_ooxml_table_parser
- modul_nummer: 1
- modul_titel: Einführung in die Zuverlässigkeit
- abschnitt_nummer: 3
- abschnitt: Definition Zuverlässigkeit

## Folie 1: Was ist Zuverlässigkeit?

- section_id: section_001
- source_local_slide_numbers: 1
- spoken_text_sha256: 7757d5a0a2c5ada2fa1546aeb20c899cb24ff8f577a52eca4fcb16ff0a4b23f5

### Gesprochener Text

In diesem Abschnitt befassen wir uns mit der Fragestellung, was die Zuverlässigkeit eigentlich ist.

Um dies zu erläutern, schauen wir uns zunächst einmal die System-Struktur eines P-K-Ws an. Der PKW besteht aus einzelnen Teilsystemen bzw. Baugruppen wie beispielsweise Motor, Getriebe und Fahrwerk. Der Motor wiederum kann weiter in Kolben, Pleuel, Kurbelgehäuse und Kurbelwelle unterteilt werden.

Aus Kundensicht würde man von einem zuverlässigen Produkt sprechen, wenn das Produkt einwandfrei funktioniert, das heißt wenn es seine Funktionsfähigkeit gewährleisten kann.

Im Falle eines PKWs ist die entsprechende Funktion einfach das Fahren. Um diese Funktion zu erfüllen, müssen auch die Elemente in der untergeordneten System-Struktur ihre Funktionsfähigkeit gewährleisten. Im Falle des Motors muss also eine Leistung erzeugt werden. Dies gilt analog auch für die tiefer liegenden Elemente.

Verliert nun beispielsweise der Kolben, aufgrund eines Ausfalls, seine Funktionsfähigkeit, hat dies immer auch einen Einfluss auf die Elemente der übergeordneten Systemstruktur. In dem Fall kann der Motor keine Leistung mehr erzeugen, was dazu führt, dass das Fahren des PKWs nicht mehr möglich ist.

Die Zuverlässigkeit bezieht sich demnach immer auf die Funktionsfähigkeit eines Elements in der Systemstruktur. Demnach kann sie für ein System definiert werden, aber auch für dessen Teilsysteme, Baugruppen und Komponenten.

Um die Zuverlässigkeit des Systems wieder herzustellen, müssen alle untergeordneten defekten Komponenten repariert werden. In unserem Beispiel also der Kolben.

## Folie 2: Stress Strength Interference

- section_id: section_002
- source_local_slide_numbers: 2
- spoken_text_sha256: 81b9caa84f83e82589a64270e2c42c5a062c697762ad0a85584efc3a0cc8a94d

### Gesprochener Text

Zuvor haben wir gelernt, welche Auswirkungen eine ausgefallene Komponente beispielsweise für das System PKW haben kann. Nun schauen wir uns an, wie es überhaupt zu einem Ausfall einer Komponente kommen kann.

Dazu gehen wir auf das Konzept der Stress Strength Interference ein.

Zunächst einmal wirkt auf ein Produkt oder auch eine Komponente immer eine gewisse Belastung. Diese kann im Betrieb je nach Nutzungsart des Kunden und den jeweiligen Umgebungsbedingungen variieren. Aus diesem Grund kann die Belastung nicht als deterministischer Wert, sondern vielmehr als statistische Größe aufgefasst werden und ist demnach als Verteilung, hier in hellblau, dargestellt.

Dem gegenüber steht die Belastbarkeit, die jedes Produkt besitzt. Auch hier handelt es sich um eine statistische Größe, da beispielsweise Produktionsprozesse und Materialeigenschaften streuen können. Sie ist also ebenfalls als Verteilung, hier in dunkelblau, dargestellt.

Zwischen den Verteilungen von Belastung und Belastbarkeit gibt es nun einen Überlappungsbereich, bai denen das Produkt bzw. die Komponente, einer eher hohen Belastung ausgesetzt ist, bai einer gleichzeitig niedrigen Belastbarkeit. Übersteigt nun die Belastung die Belastbarkeit, kommt es zu Ausfällen.

Diese Ausfälle wiederum führen zu Kundenunzufriedenheit, zu Kosten für die Hersteller, bis hin auch zur Produkthaftung.

## Folie 3: Stress Strength Interference 2

- section_id: section_003
- source_local_slide_numbers: 3
- spoken_text_sha256: 55ff49232431a10dfcffdb3771fa66d92bcac0bb833e42c066212b04060bc06c

### Gesprochener Text

Nun kann man versuchen, die Belastbarkeit zu erhöhen, also die Qualität zu verbessern, wodurch dessen Kurve nach rechts verschoben wird. Die Folge ist ein kleinerer Überlappungsbereich und dementsprechend auch weniger Ausfälle.

## Folie 4: Stress Strength Interference 3

- section_id: section_004
- source_local_slide_numbers: 4
- spoken_text_sha256: 38e260d2da0f17fc9d7553c8a18dd3482b57fded887c6860c1aa155333e60ccb

### Gesprochener Text

Erhöht man nun immer weiter die Belastbarkeit, schiebt also die Kurve immer weiter nach rechts, entstehen immer weniger Ausfälle. Durch die Qualitätserhöhung entstehen aber auch deutliche Mehrkosten gegenüber der Ausgangslage.Die Aufgabe der Zuverlässigkeitstechnik ist es dafür zu sorgen, dass der Überlappungsbereich und damit auch die Anzahl der Ausfälle minimiert werden, die Produkte also zuverlässiger werden. Gleichzeitig müssen aber unnötige und vor allem teure Überdimensionierungen der Produkte vermieden werden.

Aus unseren bisherigen Betrachtungen wissen wir, dass Zuverlässigkeit aus der Wechselwirkung zwischen den statistischen Verteilungen von Belastung und Belastbarkeit resultiert und immer für ein Produkt sowie dessen Funktionserhalt definiert wird. Fassen wir dies alles nun in der Definition der Zuverlässigkeit zusammen.

## Folie 5: Definition Zuverlässigkeit

- section_id: section_005
- source_local_slide_numbers: 5
- spoken_text_sha256: 3ebb18a540ecf7e5bc148b67f7ed4987d8b88a73991bee5ec01b367dd4c6af3d

### Gesprochener Text

Die Zuverlässigkeit ist die Wahrscheinlichkeit dafür, dass ein Produkt während einer definierten Zeitdauer unter gegebenen Funktions- und Umgebungsbedingungen nicht ausfällt.

Somit beschreibt die Zuverlässigkeit statistisch die Lebenserwartung von Produkten und berücksichtigt, dass Ausfälle aufgrund zufälliger und statistisch verteilter Ursachen auftreten können. Aufgrund des zufälligen Ausfallverhaltens lässt sich die Zuverlässigkeit immer nur als Wahrscheinlichkeit und nicht als ein diskreter Wert ausdrücken.

Diese Wahrscheinlichkeitsberechnung ist essenziell, da sie die unvermeidbare Unsicherheit von Ausfallursachen erfasst. Die Zuverlässigkeit eines Produkts hängt von den vorherrschenden Funktions- und Umgebungsbedingungen ab, da diese sich maßgeblich auf die Produktlebensdauer auswirken.Die hierfür notwendigen Methoden werden im nächsten Abschnitt eingeführt.

