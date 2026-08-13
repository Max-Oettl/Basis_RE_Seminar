# Extracted Source Text

- module_id: RE4
- source_docx: source-materials/basis-seminar/powerpoint-svg/RE4/Text/04_Modul_Systemzuverlaessigkeit.docx
- source_sha256: 15197ab5fa0ea3169070fb1191c5835f1012049dae2738023e271f025ed7f85a
- extraction_method: deterministic_ooxml_table_parser
- modul_nummer: 4
- modul_titel: Systemzuverlässigkeit
- abschnitt_nummer: 1
- abschnitt: 1

## Folie 1: Zuverlässigkeit eines Systems

- section_id: section_001
- source_local_slide_numbers: 1
- spoken_text_sha256: 9ad817136f2633222b0c72691f68eebed634642a138ea9e9f8561618746ecf21

### Gesprochener Text

In dieser Lektion beschäftigen wir uns mit der Frage: Wie lässt sich die Zuverlässigkeit eines Systems berechnen?

Dazu schauen wir uns zunächst an, was ein „System“ überhaupt ist.

Ein System besteht aus verschiedenen Teilsystemen, Baugruppen und Komponenten – die miteinander in Beziehung stehen und gemeinsam eine übergeordnete Funktion erfüllen.

Nehmen wir als Beispiel einen PKW:

Die Systemfunktion hier lautet ganz einfach – es soll fahren können.

Die entsprechende Fehlfunktion wäre: Das Fahrzeug lässt sich nicht mehr bewegen und das Fahren ist unmöglich.

Diese Systemfunktion wird aber nicht von einem einzelnen Bauteil getragen, sondern ist nur möglich, wenn mehrere Subsysteme gemeinsam funktionieren – zum Beispiel der Motor, das Getriebe oder das Fahrwerk.

Werfen wir exemplarisch einen genaueren Blick auf das Getriebe.

Seine Funktion ist es, das Drehmoment vom Motor auf die Räder zu übertragen.

Wenn diese Funktion ausfällt – also kein Drehmoment mehr übertragen wird – sprechen wir von einem Getriebeversagen.

Doch auch das Getriebe ist nicht einfach ein Bauteil, sondern besteht wiederum aus der Eingangswelle, Zahnrädern, der Ausgangswelle, dem Gehäuse und weiterer Komponenten.

All diese einzelnen Komponenten müssen funktionieren, damit das Getriebe als Ganzes zuverlässig arbeitet.

Schauen wir uns beispielhaft die Zahnräder an.

Für sie könnten Lebensdauerdaten aus Versuchen wie einem Wöhlertest vorliegen.

Dabei wird das Zahnrad unter wechselnder Last geprüft, bis es versagt – und wir erhalten Ausfallzeiten.

Diese Ausfallzeiten können wir auswerten, um eine Weibull-Verteilung zu bestimmen.

Mit dieser Verteilung können wir das Ausfallverhalten des Zahnrads mathematisch beschreiben.

Dabei dürfen wir aber nicht vergessen: Diese Ausfallzeiten stammen nur aus einer Stichprobe.

Wir möchten aber Aussagen über die Grundgesamtheit aller Zahnräder treffen.

Deshalb berücksichtigen wir zusätzlich einen Vertrauensbereich, um die statistische Unsicherheit abzudecken.

Erst dann können beispielsweise mit einer fünfundneunzig-prozentigen Aussagewahrscheinlichkeit die Zuverlässigkeit eines Zahnrads bis zu einem bestimmten Zeitpunkt bestimmen.

Wir erhalten zum Beispiel eine Zuverlässigkeit von neunundneunzig Prozent.

Dasselbe Vorgehen gilt natürlich auch für die anderen Komponenten – also die Eingangs- und Ausgangswelle sowie das Gehäuse, für die wir ebenfalls Zuverlässigkeiten ermitteln können.

Haben wir nun die Zuverlässigkeit aller Einzelteile bestimmt, können wir diese eine Hierarchieebene höher zusammenführen – zur Zuverlässigkeit des gesamten Getriebes.

Und dieses Prinzip lässt sich auch auf andere Teilsysteme anwenden – zum Beispiel auf den Motor oder das Fahrwerk.

Am Ende können wir alle Informationen nutzen, um die Zuverlässigkeit des gesamten Fahrzeugs abzuschätzen.

Wie genau diese Verknüpfung und Berechnung funktioniert – also wie man Komponenten- und Systemzuverlässigkeit mathematisch zusammensetzt – das schauen wir uns jetzt Schritt für Schritt in dieser Lektion an.

## Folie 2: Ablaufschema der quantitativen FTA

- section_id: section_002
- source_local_slide_numbers: 2
- spoken_text_sha256: 9dc767806341029241f1a5cf82c27465ad5ffb028a5cf04a7d3508d770cb649f

### Gesprochener Text

Zu Beginn geht es darum, sich systematisch Gedanken über den Aufbau und die Struktur des betrachteten Systems zu machen.Denn nur wenn wir wissen, wie ein System aufgebaut ist – welche Komponenten, Baugruppen und Funktionsketten beteiligt sind – können wir auch verstehen, wie die Zuverlässigkeit der einzelnen Komponenten und Baugruppen verknüpft werden muss, um die Systemzuverlässigkeit zu erhalten.

Hierfür eignet sich die quantitative Fehlerbaumanalyse hervorragend.Die qualitative FTA kennst du ja bereits aus dem vorherigen Modul zu den qualitativen Methoden in der Zuverlässigkeitstechnik.

Die ersten vier Schritte sind in beiden Methoden identisch – egal ob qualitativ oder quantitativ.

Der erste Schritt besteht darin, das System zu definieren, das analysiert werden soll – also zum Beispiel ein Getriebe.

Im nächsten Schritt legen wir das unerwünschte Ereignis fest, also das sogenannte Top-Ereignis bzw. der Systemausfall.

Im Fall des Getriebes lautet das Top-Ereignis: Getriebe defekt.

Anschließend zerlegen wir diesen Systemausfall schrittweise in seine unmittelbaren Ursachen.

Dazu nutzen wir logische Verknüpfungen wie das und- oder ODER-Gatter, um die Fehlerbeziehungen zwischen den verschiedenen Subsystemen darzustellen.

Das Getriebe ist beispielsweise ausgefallen, wenn kein Drehmoment mehr übertragen wird oder eine Undichtigkeit vorliegt.

So nähern wir uns stufenweise den Ursachen an – von der Systemebene über die Baugruppen bis hin zu den einzelnen Komponenten.Wir unterteilen die Ereignisse immer weiter, bis wir schließlich auf die sogenannten Basisereignisse stoßen – also die primären Ausfallmechanismen wie zum Beispiel Materialermüdung oder thermische Alterung.

Diese Basisereignisse bilden die Grundlage für die quantitative Bewertung im nächsten Schritt.

Denn sie lassen sich mit konkreten Zuverlässigkeitskennwerten beschreiben – und genau das ist das Ziel der quantitativen FTA:Nicht nur aufzeigen, was passieren kann, sondern auch wie wahrscheinlich es ist.

Wie wir für die einzelnen Basisereignisse diese Zuverlässigkeitskennwerte ermitteln, schauen wir uns im fünften Schritt der FTA einmal genauer an.

## Folie 3: 5. Schritt: Bestimmen der Zuverlässigkeitskenngrößen

- section_id: section_003
- source_local_slide_numbers: 3
- spoken_text_sha256: 486bd6a42cb3a3e484ac3f5555d762fa91ff6dd001917b548ec30bb131ff18aa

### Gesprochener Text

Im fünften Schritt der quantitativen Fehlerbaumanalyse geht es nun darum, für jedes Basisereignis – also jeden primären Ausfallmechanismus – eine quantitative Aussage zur Zuverlässigkeit zu treffen.

Unser Ziel ist es ja, später die Zuverlässigkeit des gesamten Systems bewerten zu können. Dafür brauchen wir als Grundlage Kennwerte zu den einzelnen Ursachen.

Das bedeutet: Für jedes der blau hinterlegten Basisereignisse im Fehlerbaum – also zum Beispiel Ermüdung, Materialfehler, Verschleiß oder thermische Alterung – benötigen wir einen entsprechenden Zuverlässigkeitskennwert.Typischerweise verwenden wir hier die Ausfallwahrscheinlichkeit zu einem bestimmten Zeitpunkt, beispielsweise nach fünftausend oder fünfzigtausend Betriebsstunden.

Wichtig ist: Das bedeutet nicht, dass wir für jeden Mechanismus zwingend genaue Werte berechnen müssen.Wenn wir etwa sicher wissen, dass ein Ausfallmechanismus in der Praxis nicht relevant ist, können wir ihn als risikoneutral bewerten – und ihm zum Beispiel eine Ausfallwahrscheinlichkeit von null Prozent zuweisen.Das sollte aber immer gut begründet sein, etwa durch technische Absicherung, Redundanzen oder Praxiserfahrung.

Um diese Ausfallwahrscheinlichkeiten zu bestimmen, gibt es unterschiedliche Datenquellen wie Labortests beziehungsweise Lebensdauerversuche oder auch Felddaten aus dem Betrieb.

Wie man aus Lebensdauerdaten einen Zuverlässigkeitswert erhält, hast du ja bereits im Modul Lebensdauerdatenanalyse gelernt.

Zusätzlich können Zuverlässigkeitswerte auch mithilfe von Berechnungen oder Simulationen quantitativ bestimmt werden.

Darüber hinaus sind auch Expertenschätzungen, historische Daten ähnlicher Systeme oder statistische Modelle ebenfalls denkbare Quellen.

Auf diese Weise können wir jedem Basisereignis im Fehlerbaum einen Wahrscheinlichkeitswert zuordnen – passend zum Zeitpunkt, für den wir eine Aussage über das System treffen wollen.

Aber wie berechnen wir nun aus all diesen Einzelwahrscheinlichkeiten die Gesamtausfallwahrscheinlichkeit des Systems?

Genau damit befassen wir uns im nächsten Schritt der Fehlerbaumanalyse: der quantitativen Bewertung.

## Folie 4: 6. Schritt: Quantitative Bewertung

- section_id: section_004
- source_local_slide_numbers: 4
- spoken_text_sha256: 5b6f566cfd14514d1f4c0356a5aeea48a4fc6895a294923260e9450c581eccdd

### Gesprochener Text

Im sechsten Schritt der Fehlerbaumanalyse geht es nun darum, aus den einzelnen Ausfallwahrscheinlichkeiten der Basisereignisse die Gesamtausfallwahrscheinlichkeit des Systems zu berechnen.

Dabei greifen wir auf die logische Struktur des Fehlerbaums zurück, wie wir sie zuvor aufgebaut haben. Doch in der Praxis ist es üblich, statt mit Ausfallwahrscheinlichkeiten mit deren Gegenstück – den Zuverlässigkeitswerten – zu arbeiten. Wir sprechen dann nicht mehr von einem Fehlerbaum, sondern von einem sogenannten Funktionsbaum.

Diese Transformation vom Fehler- zum Funktionsbaum erfolgt ganz einfach: Wir kehren die Logik der verwendeten Gatter um. Ein ODER-Gatter, das im Fehlerbaum beschreibt, dass das System ausfällt, wenn eine der Ursachen eintritt, wird im Funktionsbaum zu einem und-Gatter. Das System funktioniert also nur, wenn alle Teilfunktionen erfüllt sind. Umgekehrt wird ein und-Gatter im Fehlerbaum zu einem ODER-Gatter im Funktionsbaum.

Das klingt zunächst abstrakt, ist aber logisch nachvollziehbar. Wenn wir zum Beispiel im Fehlerbaum sagen: „Das Getriebe fällt aus, wenn kein Drehmoment mehr übertragen wird oder eine Leckage vorliegt“, dann bedeutet das im Umkehrschluss: „Das Getriebe funktioniert nur dann, wenn beides – die Drehmomentübertragung und die Dichtheit – gegeben ist.“

Diese Umkehrung der Logik erlaubt es uns, mit Zuverlässigkeiten zu arbeiten, die häufig auch intuitiver zu interpretieren sind. Anstelle von Aussagen wie „Ausfallwahrscheinlichkeit von zehn Prozent“ sprechen wir dann von „Zuverlässigkeit von neunzig Prozent“.

Auf dieser Grundlage wandeln wir also unseren Fehlerbaum systematisch in einen Funktionsbaum um:

Wir ersetzen die Ausfallwahrscheinlichkeiten durch Zuverlässigkeitswerte und die ODER-Gatter durch und-Gatter.

Auf diese Weise erhalten wir den vollständigen Funktionsbaum des Getriebes.

Durch die Umwandlung von Fehlerbaum zu Funktionsbaum lässt sich die Systemzuverlässigkeit einfach berechnen.

Um die resultierende Zuverlässigkeit des Systems anschaulich darzustellen, nutzt man in der Praxis häufig sogenannte Zuverlässigkeitsblockdiagramme. Diese lassen sich direkt aus dem Funktionsbaum ableiten und visualisieren, welche Komponenten in Serie oder parallel wirken müssen, damit das Gesamtsystem zuverlässig funktioniert.

Für die eigentliche Berechnung greifen wir auf Regeln der Wahrscheinlichkeitsrechnung zurück. Die Grundlage hierfür bildet das sogenannte boolesche Modell – also eine logische Verknüpfung der Einzelwahrscheinlichkeiten, aus der sich dann die Systemzuverlässigkeit ergibt.

Wie genau das funktioniert – und wie wir die Zuverlässigkeitsblockdiagramme konkret einsetzen – schauen wir uns im nächsten Abschnitt im Detail an.

## Folie 5: Zuverlässigkeitsblockdiagramm

- section_id: section_005
- source_local_slide_numbers: 5
- spoken_text_sha256: c943b82576e694c234f49ff6d74b6a1e50d0886801e590b782d76c6b4153fc8f

### Gesprochener Text

Das Zuverlässigkeitsblockdiagramm wird im Englischen als “Reliability Block Diagram” oder kurz nur mit R-B-D bezeichnet.

Es ist ein grafisches Hilfsmittel zur Modellierung der Systemzuverlässigkeit. Es zeigt, wie die Komponenten eines Systems miteinander verbunden sind und welche Wirkung deren Zuverlässigkeit auf das Gesamtsystem hat.

Das Diagramm besteht im Wesentlichen aus zwei Elementen: den Blöcken, meist in Form von Rechtecken, die einzelne Systemkomponenten repräsentieren, und den Verbindungen, oder auch Linien, die die funktionalen Abhängigkeiten zwischen den Komponenten beschreiben.

Jede Komponente, also jeder Block, kann dabei zwei Zustände einnehmen: „funktionsfähig“ oder „ausgefallen“.

Solange es eine ununterbrochene Verbindung vom Eingang E zum Ausgang A gibt – das heißt, es existiert ein durchgängiger Pfad durch funktionsfähige Komponenten –, gilt das Gesamtsystem als funktionsfähig. Das Zuverlässigkeitsblockdiagramm visualisiert also, wie der Ausfall oder die Funktionsfähigkeit einzelner Komponenten die Systemfunktion beeinflusst.

Grundsätzlich unterscheiden wir zwei Basisstrukturen: die Serienstruktur und die Parallelstruktur.

In der Serienstruktur sind alle Komponenten hintereinandergeschaltet. Das bedeutet: Das System funktioniert nur dann, wenn alle Komponenten funktionsfähig sind. Fällt auch nur eine Komponente aus, ist die Verbindung unterbrochen – das gesamte System fällt aus. Es genügt also ein einziger Ausfall, um die Systemfunktion zu verlieren.

In der Parallelstruktur hingegen gibt es Redundanz: Mehrere Komponenten übernehmen die gleiche Funktion, sind also parallel geschaltet.

Das bedeutet: Fällt eine Komponente aus, übernehmen die übrigen ihre Funktion. Das System bleibt also weiterhin funktionsfähig.

Dadurch bleibt das System funktionsfähig, solange mindestens eine der Komponenten funktioniert. Erst wenn alle parallelen Komponenten gleichzeitig ausfallen, gilt das System als ausgefallen. Durch diese Redundanz erhöht sich die Ausfallsicherheit des Systems deutlich.

Hat man das Zuverlässigkeitsblockdiagramm eines Systems erstellt, lässt sich daraus sehr einfach die Systemzuverlässigkeit berechnen – also die Wahrscheinlichkeit, dass das System zu einem bestimmten Zeitpunkt funktionsfähig ist.

Für die Serienstruktur ergibt sich die Systemzuverlässigkeit einfach durch Multiplikation der Einzelzuverlässigkeiten ​der Komponenten.

In der Parallelstruktur ist die Berechnung etwas anders: Hier berechnet man zunächst die Ausfallwahrscheinlichkeit jeder Komponente, welche einfach als eins minus seiner Zuverlässigkeit berechnet werden kann. Diese multipliziert man dann über alle Komponenten und zieht das Ergebnis von eins ab.

Schauen wir uns dazu ein kleines Beispiel mit jeweils drei Komponenten an. Nehmen wir an, dass jede Komponente zu einem bestimmten Zeitpunkt eine Zuverlässigkeit von neunzig Prozent besitzt.

Bei einer Serienstruktur der drei Komponenten ergibt sich die Zuverlässigkeit des Systems einfach durch Multiplikation der drei Einzelzuverlässigkeiten.

Das ergibt für das System ein Zuverlässigkeitswert von Zweiundsiebzigkomma neun Prozent.

Bei der Parallelstruktur der drei Komponenten liegt der Wert entsprechend bei neunundneunzigkomma neun Prozent.

Wir sehen also, die Serienstruktur von Komponenten reduziert die Systemzuverlässigkeit wohingegen die Parallelschaltung die Zuverlässigkeit des Systems erhöht.Als Faustregel gilt dabei: In einer Serienstruktur ist die Systemzuverlässigkeit immer kleiner als die kleinste Einzelzuverlässigkeit, wohingegen in einer Parallelstruktur die Systemzuverlässigkeit immer größer ist als die größte Einzelzuverlässigkeit.

In der Praxis bestehen Systeme oft nicht nur aus Reihen- oder Parallelschaltungen, sondern aus einer Kombination beider Strukturen. Auch diese sogenannten gemischten Strukturen lassen sich mit Hilfe der bekannten Rechenregeln behandeln. Dabei wird das System schrittweise vereinfacht, indem zunächst Teilsysteme in Serien- oder Parallelstruktur berechnet und anschließend weiter kombiniert werden.

Schauen wir uns hierzu wieder ein Beispiel an. In einem System ist die Komponente eins in Serie mit einem Parallelsystem aus Komponente zwei und drei geschaltet.

Zuerst berechnet man die Zuverlässigkeit des Parallelsystems aus Komponente zwei und drei mithilfe der bekannten Formel.

Da die Parallelstruktur mit Komponente eins in Serie geschaltet ist, multiplizieren wir einfach nun den Zuverlässigkeitswert mit dem der Komponente eins.

Auf diese Weise erhalten wir die Systemzuverlässigkeit.

Somit können wir auch für komplexere Systeme die Systemzuverlässigkeit in Abhängigkeit der Komponentenzuverlässigkeiten berechnen.

Wir benötigen hierfür also nur das Zuverlässigkeitsblockdiagramm.

Die Grundlage für ein solches Blockdiagramm bildet der Funktionsbaum, der die logische Abfolge der Systemfunktionen darstellt.

Eine und-Verknüpfung im Funktionsbaum entspricht dabei einer Reihenschaltung im Zuverlässigkeitsblockdiagramm – alle Komponenten müssen funktionieren, damit die Funktion erfüllt ist. Eine ODER-Verknüpfung entspricht einer Parallelschaltung – es reicht, wenn mindestens eine Komponente funktioniert.

Man muss jedoch nicht zwingend immer den Umweg über Funktions- oder Fehlerbaum gehen – für einfache Systeme lassen sich Zuverlässigkeitsblockdiagramme oft auch direkt aufstellen.

Allerdings müssen während der Erstellung solcher Diagramme einige Voraussetzungen und Annahmen beachtet werden. Diese betrachten wir in der nächsten Lektion.

## Folie 6: Voraussetzungen für die Anwendung

- section_id: section_006
- source_local_slide_numbers: 6
- spoken_text_sha256: 0d25fe27774d5c285319654e1d1429c54ce44f49079bd9b77cac07a1648e1855

### Gesprochener Text

Damit man ein Zuverlässigkeitsblockdiagramm sinnvoll anwenden kann, müssen bestimmte Voraussetzungen erfüllt sein.

Erstens: Jede Komponente kann nur zwei Zustände einnehmen – sie ist entweder funktionsfähig oder ausgefallen. Es gibt also keine Zwischenstufen wie "eingeschränkt funktionsfähig" oder "in Wartung". Nur wenn alle benötigten Komponenten intakt sind, gilt das System als funktionstüchtig.

Zweitens: Die Komponenten sind nicht reparierbar. Das bedeutet: Sobald eine Komponente einmal ausgefallen ist, bleibt sie es auch – eine Reparatur findet nicht statt. Diese Annahme vereinfacht die Modellierung erheblich und ist gerade für viele technische Systeme mit begrenzter Lebensdauer durchaus realistisch.

Und Drittens: Die Komponenten sind unabhängig voneinander. Das heißt, der Ausfall einer Komponente beeinflusst nicht die Wahrscheinlichkeit, mit der eine andere Komponente ausfällt. Es gibt also keine gemeinsamen Ursachen, Koppelungen oder Wechselwirkungen zwischen den Komponenten.

In der Praxis lassen sich viele Systeme mit diesen Voraussetzungen gut modellieren. Doch es gibt auch Fälle, in denen das Zuverlässigkeitsblockdiagramm komplexer wird – zum Beispiel dann, wenn sich das System nicht direkt als reine Reihen- oder Parallelschaltung beschreiben lässt.

Ein typisches Beispiel dafür ist die sogenannte Brückenschaltung, in der der Signalfluss durch mehrere mögliche Pfade führen kann. Diese Strukturen erfordern eine genauere Betrachtung und lassen sich nicht mehr mit den einfachen Rechenregeln lösen.

Wie du in solchen Fällen vorgehst, lernst du in der nächsten Lektion.

## Folie 7: Zuverlässigkeitsblockdiagramm – Separation

- section_id: section_007
- source_local_slide_numbers: 7
- spoken_text_sha256: bcb94b3bf7b8425eb0782edb56744f47f412599efd743f2a08d1e64823f6bef3

### Gesprochener Text

Bei einer Brückenschaltung lässt sich die Zuverlässigkeit nicht mit den einfachen Formeln für Reihen- oder Parallelschaltungen berechnen.Aber keine Sorge – es gibt zwei Methoden, mit denen wir trotzdem zu einer exakten Lösung kommen können.

Erstens: die Methode der Separation.Und Zweitens: die Methode der Multilinearform.

In diesem Modul schauen wir uns die Methode der Separation an.

Wie der Name schon andeutet, betrachten wir dabei eine bestimmte Komponente isoliert, also „separiert“.Wenn wir uns das Blockdiagramm ansehen, fällt auf:Komponente fünf nimmt eine Schlüsselrolle ein.Genau sie macht aus einer einfachen Struktur eine Brückenschaltung.

Deshalb betrachten wir zwei Fälle.

Erstens, Komponente fünf ist ständig funktionsfähig.

Und zweitens, Komponente fünf ist ständig ausgefallen.

Für jeden dieser Fälle zeichnen wir das daraus resultierende Zuverlässigkeitsblockdiagramm.

Und das hilft uns – denn jetzt lassen sich beide neuen Diagramme mit den bekannten Regeln für Serien- und Parallelsysteme berechnen:

Ist die Komponente fünf ständig funktionsfähig, entsteht eine Reihenschaltung aus zwei Parallelschaltungen.

Und ist die Komponente fünf ständig ausgefallen, ergibt sich eine Parallelschaltung, in der jeweils eine Reihenschaltung in jedem Pfad vorliegt. Diese können wir also ganz klassisch mit unseren bekannten Formeln berechnen.

Wichtig dabei:

Im ersten Fall, also wenn die Komponente fünf funktionsfähig ist, wird die Zuverlässigkeit von Komponente fünf einfach mit der restlichen Systemzuverlässigkeit multipliziert.

Im zweiten Fall, also wenn die Komponente fünf ausgefallen ist, verwenden wir stattdessen die Ausfallwahrscheinlichkeit. Diese ergibt sich einfach zu eins minus der Zuverlässigkeit von Komponente fünf. Wir multiplizieren also dann auch diesen Wert mit der entsprechenden Gleichung des restlichen Systems.

Am Ende addieren wir beide Teilergebnisse, um die gesamte Systemzuverlässigkeit zu berechnen.Das ist nach dem Satz der totalen Wahrscheinlichkeit auch völlig korrekt – denn wir haben zwei sich gegenseitig ausschließende Fälle betrachtet.

Und das ist auch der große Vorteil der Methode:Man kann sie immer anwenden und erhält so eine exakte Berechnung der Systemzuverlässigkeit, auch wenn eine Brückenschaltung vorliegt.

Mit diesem Wissen bist du jetzt in der Lage, für jede Struktur ein passendes Zuverlässigkeitsblockdiagramm zu erstellen und damit auch die Systemzuverlässigkeit korrekt zu bestimmen.

