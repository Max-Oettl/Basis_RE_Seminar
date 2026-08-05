# Extracted Source Text

- module_id: RE2
- source_docx: source-materials/basis-seminar/powerpoint-svg/RE2/Text/02_Modul_Qualitative Methoden - Fehlerbaumanalyse.docx
- source_sha256: 2bc80d7455ed7f125ef817ef8c22aaf4c96e5e091185f2c1fb7ce7de1f9c6c3e
- extraction_method: deterministic_ooxml_table_parser
- modul_nummer: 2
- modul_titel: Qualitative Zuverlässigkeitsmethoden
- abschnitt_nummer: 2
- abschnitt: Fehlerbaumanalyse

## Folie 1: Was ist eine FTA?

- section_id: section_001
- source_local_slide_numbers: 1
- spoken_text_sha256: a399d9ef6c618c3703151bf627df97a81d8766c0d51d6dd6fde82e689414e178

### Gesprochener Text

In diesem Abschnitt befassen wir uns mit der Fehlerbaumanalyse, die häufig auch einfach als F-T-A abgekürzt wird.

Aber wofür steht diese Abkürzung eigentlich?

F-T-A steht für den englischen Begriff Fault Tree Analysis.

Im Deutschen findet man manchmal auch die Abkürzung F-B-A für Fehlerbaumanalyse oder Fehlzustandsbaumanalyse.

Schauen wir uns einmal den Ablauf der Fehlerbaumanalyse an.

Die Fehlerbaumanalyse ist eine strukturierte Top-Down-Methode.

Das heißt, zuerst wird auf der obersten Ebene ein unerwünschtes Ereignis, das sogenannte Top-Ereignis, definiert.

Da diese Ebene meist die Systemebene darstellt, können wir als unerwünschtes Top-Ereignis beispielsweise den Systemausfall definieren.

Anschließend werden systematisch alle Ausfälle bzw. Ausfallarten und deren Ausfallfolgen auf den nächsttieferen Ebenen ermittelt.

Das bedeutet, wir betrachten zunächst die Ebene der unterschiedlichen Teilsysteme, im Anschluss dann die Baugruppen und schließlich gelangen wir zu den einzelnen Bauteilen und ihren spezifischen Ausfallarten.

Auf der untersten Ebene befindet sich immer das Basisereignis bzw. die Schadensursache.

In der Zuverlässigkeitstechnik verwenden wir hierfür auch oft den Begriff Ausfallmechanismus.

Die einzelnen Ausfälle und ihre Beziehungen können wir auch in einem Diagramm darstellen.Dieses Diagramm wird Fehlerbaum genannt und zeigt die logischen Verknüpfungen von Ausfällen, Ausfallkombinationen und Ausfallursachen der einzelnen Teilsysteme, Baugruppen oder Komponenten.

Auf diese Weise können kritische Ereignisse identifiziert werden, die zu einem unerwünschten Top-Ereignis, wie dem Systemausfall, führen können.

Durch die Fehlerbaumanalyse sehen wir nicht nur die Auswirkungen einzelner Komponentenausfälle, sondern auch wie sich deren Ausfall-Kombinationen auf das System auswirken können.

Damit können wir also die Fehlerpfade innerhalb eines Systems visualisieren und besser verstehen.

Durch die Identifikation dieser Pfade, verstehen wir die Schwachstellen des Systems besser und können gezielt Maßnahmen ergreifen, um diese potenziellen Risiken zu minimieren.

## Folie 2: Welche Arten einer FTA gibt es?

- section_id: section_002
- source_local_slide_numbers: 2
- spoken_text_sha256: 4eb0d66af614e00d3c19412c0f97c0255d99cc38d19f6d9c07087efff71c37f7

### Gesprochener Text

Nachdem wir die Grundlagen der Fehlerbaumanalyse besprochen haben, möchten wir nun auf die beiden Arten dieser Methode eingehen.Zum einen gibt es die qualitative und zum anderen die quantitative Fehlerbaumanalyse.

Die qualitative Fehlerbaumanalyse hat das Ziel, sämtliche Ausfälle, Ausfallkombinationen, Ursachen und deren logische Abhängigkeiten zu identifizieren.

Dabei werden alle möglichen Fehlfunktionen des Systems systematisch erfasst, ohne dabei Zahlenwerte oder Wahrscheinlichkeiten zu berücksichtigen.

Das Ergebnis dieser Analyse sind die kritischsten Ereignisse oder Ereigniskombinationen, die zum Ausfall des Systems führen können.

Die qualitative Fehlerbaumanalyse wird hauptsächlich für die Schwachstellenanalyse eingesetzt, um potenzielle Schwachstellen im System zu erkennen und Gegenmaßnahmen zu entwickeln.

Hierbei erfolgt keine Quantifizierung von Wahrscheinlichkeiten.

Das Ziel der quantitativen Fehlerbaumanalyse hingegen ist die Berechnung der Ausfallwahrscheinlichkeit eines Systems.

Durch die Zuweisung numerischer Wahrscheinlichkeiten zu den Basisereignissen kann die Wahrscheinlichkeit für ein Systemausfall entsprechend der logischen Verknüpfung berechnet werden.

Das Ergebnis sind somit numerische Wahrscheinlichkeiten für Systemausfälle, die eine genaue Bewertung des Risikos ermöglichen.

Die quantitative Fehlerbaumanalyse wird also zur Risikobewertung eingesetzt, unterstützt Entscheidungen über Risikominderungsmaßnahmen und dient auch dem Nachweis von Zuverlässigkeitsforderungen.

Während die qualitative Fehlerbaumanalyse sich nur auf die Identifizierung von Ausfallursachen und deren logische Verknüpfungen konzentriert, ermöglicht die quantitative Analyse darüber hinaus auch eine numerische Bewertung der Ausfallwahrscheinlichkeit.

Beide Ansätze ergänzen sich und bieten gemeinsam ein umfassendes Verständnis über die Zuverlässigkeit eines Systems.

In diesem Modul befassen wir uns allerdings nur mit der qualitativen Fehlerbaumanalyse. Hierzu wollen wir uns einmal den Ablauf etwas näher anschauen.

## Folie 3: Ablauf der qualitativen FTA & 1. Schritt: Systemanalyse

- section_id: section_003
- source_local_slide_numbers: 3
- spoken_text_sha256: 0e57d2de93811431e35ee688a399ded15fd8eb61b7be92c85245b1b698d9c98b

### Gesprochener Text

Die qualitative Fehlerbaumanalyse besteht aus insgesamt fünf Schritten.

Der erste Schritt ist die System-Analyse.

Wie der Name schon sagt, wird in diesem Schritt eine umfassende System-Analyse durchgeführt.

Dazu nutzen wir sämtliche Methoden, die wir bereits im ersten Teil dieses Moduls kennengelernt haben.Im ersten Schritt definieren wir unsere Systemgrenze, um das zu untersuchende System abzugrenzen.

Im Anschluss können wir dann die Einflussgrößen mit Hilfe des P-Diagramms ermitteln.

Dazu können wir auch auf das Ishikawa-Diagramm zurückgreifen.

Zusätzlich können wir auch Bauteilblockschaltbilder erstellen, um die Komponenten im inneren des Systems und deren Wechselwirkungen zu untersuchen.

Eine Funktionsanalyse hilft uns sämtliche Funktionen des Systems und der Komponenten besser zu verstehen und damit auch die System-Anforderungen zu ermitteln.Das Ziel im ersten Schritt ist es, ein tiefgreifendes Verständnis über das System und seine Wirkungsweise zu entwickeln.

## Folie 4: 2. Schritt: Definition der unerwünschten Ereignisse

- section_id: section_004
- source_local_slide_numbers: 4
- spoken_text_sha256: 7d2cdeb392f00f3462fc2d972af79cc2e543d340bd08481dae762d466fc447cd

### Gesprochener Text

Im zweiten Schritt legen wir das unerwünschte Ereignis fest, das wir vermeiden möchten.

Dieses wird im Fehlerbaum an oberster Stelle als Top-Ereignis dargestellt.

Das Top-Ereignis könnte beispielsweise ganz einfach, als Systemausfall definiert werden.Um überhaupt zu entscheiden, ab wann das System als ausgefallen gilt, müssen in diesem Schritt auch immer die Ausfallkriterien festgelegt werden.

Dies sind die Bedingungen, unter denen das System als ausgefallen gilt.

Die Definition des Top-Ereignisses und der Kriterien kann durch zwei verschiedene Ansätze erfolgen.

Zum einen gibt es den präventiven Ansatz.

Dabei kann das unerwünschte Ereignis aus der Nicht-Erfüllung von Funktionen oder Anforderungen definiert werden.

Demgegenüber steht der korrektive Ansatz.

Hier wird die Definition eines aufgetretenen Ausfalls bzw. einer Fehlfunktion des Systems als unerwünschtes Ereignis festgelegt.

Aber wie genau unterscheiden sich diese beiden Ansätze?Beim präventiven Ansatz erfolgt die frühzeitige Identifizierung von Fehlerquellen oder Risiken bevor sie auftreten.

Dies führt zu einer Verbesserung der Systemzuverlässigkeit und -sicherheit, indem potenzielle Risiken beseitigt werden.

Auf diese Weise werden ebenfalls spätere Korrekturmaßnahmen und Reparaturen reduziert.

Dieser Ansatz ist folglich proaktiv, das heißt, es werden Fehler und Risiken schon während der Design- und Entwicklungsphase vermieden.

Beim korrektiven Ansatz dagegen werden die aufgetretenen Fehler und dessen Ursachen erst nach einem Vorfall oder nach einem Systemausfall analysiert.

Durch die Ergebnisse der Analyse kann dann eine effizientere Verbesserung der Systemwartung und Reparatur erfolgen, vor allem durch gezieltere Korrekturmaßnahmen.

Auf diese Weise können auch ähnliche Probleme in der Zukunft vermieden werden.

Dieser Ansatz ist also reaktiv, da die Fehler erst nach dem Auftreten analysiert und behoben werden.

## Folie 5: 3. Schritt: Bestimmen der Ausfallarten der Komponenten

- section_id: section_005
- source_local_slide_numbers: 5
- spoken_text_sha256: 9be86f39c815a7fcf02798739c0af22e568a55a07577de3891997e1c183cd150

### Gesprochener Text

Kommen wir nun zum dritten Schritt in der Fehlerbaumanalyse.

Hier werden die Ausfallarten der einzelnen Komponenten im System ermittelt.

Das bedeutet, wir überlegen uns, auf welche Weise jede Komponente ausfallen kann und welche Auswirkungen dies für das Gesamtsystem hat.

Dazu werden die Systemkomponenten im Fehlerbaum üblicherweise in drei Fehlerkategorien bzw. Ausfallarten unterteilt.

Bei einem Primärausfall erfolgt der Ausfall der Systemkomponente durch technisches Versagen unter sonst zulässigen Einsatzbedingungen.

Ein Beispiel hierfür könnte das Materialversagen einer Systemkomponente sein.

Ein Sekundärausfall entsteht, wenn die Systemkomponente aufgrund unzulässiger Einsatz- oder Umgebungsbedingungen ausfällt.

Dies kann beispielsweise durch den Betrieb unter unzulässigen Umgebungstemperaturen, aber auch aufgrund der Verwendung unzulässiger Betriebsmittel geschehen.

Bei einem kommandierten Ausfall wird eine funktionsfähige Systemkomponente zu einem falschen Zeitpunkt oder am falschen Ort aktiviert oder deaktiviert.

Dies kann infolge des Ausfalls einer Energieversorgung oder durch eine fehlerhafte bzw. falsche Ansteuerung verursacht werden.

Schauen wir uns hierzu ein Beispiel einer Schaltung zur Steuerung eines Motors an.

Zur Ansteuerung des Motors wird ein Steuergerät, zwei Schalter und eine Stromquelle genutzt.

Das unerwünschte Ereignis können wir einfach als „Motor läuft nicht an“ definieren.

Nun kann der Fehlerbaum in drei Pfade entsprechend der eben beschriebenen Ausfallarten Primärausfall, Sekundärausfall und Kommandierter Ausfall aufgeteilt werden.

Der Primärausfall des Motors kann beispielsweise aufgrund einer durchgebrannten Wicklung oder aufgrund eines Lagerschadens verursacht werden.Das Blockieren des Motors aufgrund von Verschmutzung oder der Motorgehäusebruch, verursacht durch eine zu hohe Temperatur oder Vibration, führt zu einem Sekundärausfall.Ist hingegen die Stromquelle. einer der beiden Schalter oder auch das Steuergerät ausgefallen, kann der Motor nicht mehr richtig angesteuert werden.Dies führt demnach zu einem Kommandierten Ausfall des Motors.

Die drei verschiedenen Ausfallarten lassen sich im Normalfall immer durch unterschiedliche Pfade im Fehlerbaum darstellen.

Dieses Vorgehen unterstützt die Identifizierung möglicher Fehlerquellen.

Es ist jedoch wichtig zu betonen, dass diese Aufteilung im Fehlerbaum, also die Darstellung der unterschiedlichen Ausfallarten als separate Pfade, nicht zwingend angewendet werden muss.

## Folie 6: 4. Schritt: Erstellen des Fehlerbaums

- section_id: section_006
- source_local_slide_numbers: 6
- spoken_text_sha256: d147f185ff5b31fe669e5470b0e965184864c7616d2dde9c83f0e73371a2905c

### Gesprochener Text

Kommen wir nun zum vierten Schritt: der Erstellung des Fehlerbaums.

In diesem Schritt wird der Fehlerbaum systematisch aufgebaut, wobei die logischen Verknüpfungen zwischen den einzelnen Elementen sorgfältig berücksichtigt werden.

Diese Verknüpfungen werden im Fehlerbaum durch logische Gatter dargestellt.

Die logischen Gatter verdeutlichen, wie die untergeordneten Sub-Ereignisse zusammenwirken, um zum übergeordneten Ereignis zu führen.

Abhängig von der Beziehung und Logik zwischen den Ereignissen im jeweiligen Anwendungsfall können dabei verschiedene logische Gatter zum Einsatz kommen.

Wir schauen uns hierzu die drei wichtigsten logischen Gatter genauer an.

Beim UND-Gatter tritt das nachfolgende Ereignis Ypsilon nur ein, wenn alle Sub-Ereignisse, also in dem Beispiel x eins und x zwei, eintreten.

Beim Oder Gatter tritt das nachfolgende Ereignis immer dann ein, wenn mindestens eines der Sub-Ereignisse eintritt.

Und beim NICHT-Gatter wird das Sub-Ereignis einfach invertiert. Das heißt das nachfolgende Ereignis Ypsilon tritt nur ein, wenn das Sub-Ereignis nicht eintritt.

Schauen wir uns hierzu nochmals das vorherige Beispiel an.

Wir wissen ja bereits, dass das Top-Fehler-Ereignis an die Spitze des Baumes platziert wird.

Im nächsten Schritt identifizieren wir die unmittelbar möglichen Ursachen des Top-Ereignisses und stellen sie als Sub-Ereignisse dar. In diesem Fall waren es die drei unterschiedlichen Ausfallarten.

Da wir wissen, dass jeder dieser drei Ausfallarten zu einem Ausfall des Motors führt, verknüpfen wir diese mit einem Oder Gatter.

Im Anschluss werden die Sub-Ereignisse weiter in ihre zugrunde liegenden Ursachen unterteilt und analog in Abhängigkeit der Beziehungen zwischen den einzelnen Ereignissen verknüpft.

Auch hier verwenden wir für die einzelnen Ausfallursachen Oder Gatter, da jeder Ausfall zu einem Ausfall des Motors führt.

Auf diese Weise wird der Fehlerbaum nach unten hin immer weiter verästelt und bildet die gesamte Fehlerhierarchie ab.

Gehen wir die Fehlerhierarchie von oben nach unten immer weiter durch, treffen wir irgendwann auf die primären Fehlerursachen bzw. Ausfallmechanismen.

Diese nennen wir auch Basisereignisse.Die Basisereignisse stellen immer das Ende des Fehlerbaumes dar und können einfach durch ein Kreissymbol gekennzeichnet werden.

Das heißt ab hier gibt es keine weiteren untergeordneten Hierarchieebenen und wir sind am Ende des Pfades angekommen.

Der Fehlerbaum muss aber nicht immer bis zum Ende durchgeführt werden. Prinzipiell kann an jedem Ast beliebig abgebrochen werden.

Hierzu können wir neben den Basisereignissen noch weitere Symbole im Fehlerbaum verwenden.

Es kann beispielsweise immer entschieden werden, dass ein Ereignis ab einer gewissen Stelle nicht mehr weiter untersucht werden soll.

Hierzu können wir einfach ein Rauten-Symbol verwenden.

In diesem Fall wollen wir den Primärausfall des Motors nicht weiter untersuchen.

Hierbei ist es sinnvoll, in einem kleinen Kommentarfeld daneben immer die entsprechenden Gründe zu notieren, um auch zu einem späteren Zeitpunkt nachvollziehen zu können, warum diese Entscheidung getroffen worden ist.

Wird der Fehlerbaum dagegen zu lang, kann er mit Hilfe eines Verweisungsgatters an einer anderen Stelle fortgeführt werden.

Die Verweisungen sollten dabei auch durchnummeriert werden, um die entsprechende Stelle der Fortführung wieder zu finden.

Durch das schrittweise Unterteilen der Ereignisse im Fehlerbaum, erhalten wir ein detailliertes Diagramm, das die logischen Verknüpfungen zwischen den verschiedenen Ausfällen und ihren Ursachen visualisiert.

## Folie 8: 5. Schritt: Qualitative Bewertung

- section_id: section_007
- source_local_slide_numbers: 8
- spoken_text_sha256: 3f2ef4b77313a0da854d2c925a10ad8cd53527090c71bc70754f80508e0fe75a

### Gesprochener Text

Kommen wir nun zum fünften und damit auch letzten Schritt, der qualitativen Bewertung des Fehlerbaums.

In diesem Schritt analysieren wir die Struktur des Fehlerbaums.

Durch die Visualisierung der logischen Verknüpfungen zwischen den verschiedenen Ausfällen und ihren Ursachen, können wir genau sehen, welche Ausfälle oder Ausfallkombinationen zum Ausfall des übergeordneten Elements und letztendlich zum Systemausfall führen.

Dies ermöglicht es uns, die kritischen Pfade zu identifizieren, also der direkte und minimale Weg, der zu einem unerwünschten Top-Ereignis führt.

In unserem Beispiel von vorher sind alle Ereignisse im Fehlerbaum mit einem Oder Gatter verbunden.

Aus diesem Grund führt jeder Ausfall direkt zum Ausfall des Motors.

Demnach ist jeder Pfad im Fehlerbaum auch ein kritischer Pfad.

Nehmen wir mal an, wir hätten in der Schaltung zur Steuerung des Motors eine zweite Stromversorgung installiert.

Diese kann die Stromversorgung übernehmen, wenn die erste ausgefallen ist.

Da die gesamte Stromversorgung erst ausgefallen ist, wenn beide Stromquellen ausgefallen sind, können die Ereignisse im Fehlerbaum mit einem Und-Gatter verbunden werden.

Erst wenn beide Ausfall-Ereignisse eingetreten sind, führt dies zum Ausfall des übergeordneten Elements.

Die beiden Ausfall-Ereignisse können wir als minimale Ausfallschnitte verstehen.

Die minimalen Ausfallschnitte, auch Minimalschnitte, kritische Mengen oder Cut Sets genannt, sind die kleinsten Kombinationen von Basisereignissen, deren gemeinsames Eintreten zu einem unerwünschten Top-Ereignis führt.

Allein durch Betrachtung des Fehlerbaums erhalten wir wertvolle Erkenntnisse über das Ursachen-Wirkungsgefüge innerhalb des Systems.

Dabei können wir kritische Pfade und minimale Ausfallschnitte identifizieren.

Diese helfen uns qualitative Aussagen über die schwächsten Äste des Systems zu treffen und zu erkennen, ob Einzel- oder Mehrfachausfälle, zu kritischen Zuständen führen.

Mit Hilfe dieser Analysen können wir erste Näherungen über das momentane Risiko möglicher Systemschwachstellen ableiten und sehen welche Basisereignisse den größten Einfluss auf das Eintreten des Top-Ereignisses haben.

## Folie 9: Beispiel: Fahrwerk eines Flugzeugs

- section_id: section_008
- source_local_slide_numbers: 9
- spoken_text_sha256: a425cf9ca9b11996bc387f2534349db21fa3cb72c8c109ccaaa48cd4b5e2d8e4

### Gesprochener Text

Schauen wir uns zum Schluss noch ein paar Beispiele und Besonderheiten im Fehlerbaum an.

Hierzu betrachten wir das Bugradfahrwerk eines Flugzeuges, welches für den Start- und Landevorgang sowie für die Beweglichkeit am Boden eingesetzt wird.

Das Bugradfahrwerk besteht aus drei Fahrwerksgruppen.

Dem Bugrad und dem linken und rechten Hauptfahrwerk.

Jede Fahrwerksgruppe besitzt jeweils zwei Reifen.

Eine Fahrwerksgruppe fällt aus, wenn keines ihrer Reifen zur Verfügung steht, das heißt, wenn beide Reifen einer jeweiligen Gruppe ausgefallen sind.

Der Ausfall einer Fahrwerksgruppe führt direkt zum Komplettausfall des Bugradfahrwerks.

Um dieses Szenario zu analysieren, erstellen wir nun einen Fehlerbaum.

An dieser Stelle könnt ihr das Video auch kurz pausieren und versuchen den Fehlerbaum selbst zu erstellen.

Fangen wir nun an den Fehlerbaum gemeinsam zu erstellen.

Das Top-Ereignis kann als der Ausfall des Bugradfahrwerks definiert werden.

Nun identifizieren wir die unmittelbaren Ursachen, die dazu führen können.

Zunächst Betrachten wir die Ausfälle unserer Fahrwerksgruppen. Also der Ausfall des Bugrades sowie des linken und rechten Hauptfahrwerks.

Diese Ereignisse sind mit einem Oder-Gatter verbunden, da der Ausfall einer der Fahrwerksgruppen direkt zu einem Ausfall des gesamten Bugradfahrwerks führt.

Jede Fahrwerksgruppe fällt aus, wenn beide ihrer Reifen ausgefallen sind.

Daher verbinden wir die Ausfälle der Reifen innerhalb jeder Fahrwerksgruppe mit einem Und-Gatter.

Das Bugrad ist beispielsweise ausgefallen, wenn die beiden Reifen eins und zwei ausgefallen sind.

Das gleiche Prinzip gilt für das linke und rechte Hauptfahrwerk.

Auch hier sind die Ausfälle der Reifen jeweils mit einem Und-Gatter verbunden.

Nun können wir die kritischen Pfade identifizieren, die zum Top-Ereignis, also zum Ausfall des Bugradfahrwerks, führen.

Wir erkennen, dass der gleichzeitige Ausfall beider Reifen einer Fahrwerksgruppe zum Ausfall dieser Fahrwerksgruppe führt.

Jede Kombination von zwei ausgefallenen Reifen stellt demnach einen minimalen Ausfallschnitt dar.

Entlang der kritischen Pfade sehen wir dann, dass die Ausfälle einer Fahrwerksgruppe zum Ausfall des Bugradfahrwerks führen.

Durch diese Analyse können wir die Zuverlässigkeit des Bugradfahrwerks bewerten und gezielte Maßnahmen ergreifen, um die Ausfallwahrscheinlichkeit zu reduzieren.

Zum Beispiel können wir regelmäßige Wartungen der Reifen durchführen oder zusätzliche Sicherheitsmechanismen einführen.

## Folie 10: Beispiel: Ausfall eines Reifens im Flugzeugfahrwerk

- section_id: section_009
- source_local_slide_numbers: 10
- spoken_text_sha256: d182e86127312da182dde2a250c1ed1154012e53e28f3bef78549ba400748114

### Gesprochener Text

Nachdem wir gelernt haben, wie man die einzelnen Ausfallpfade und Ausfall-Kombinationen analysiert, möchten wir nun noch auf das Konzept des Common-Mode-Ausfalls eingehen.

Ein Common-Mode-Ausfall bezieht sich auf den Ausfall von mehreren Komponenten, welche durch die gleiche Ausfallart verursacht werden.

Das heißt der Ausfall einer Komponente bedingt direkt den Ausfall einer anderen Komponente.

Dabei können die beiden Ausfälle gleichzeitig oder kurz nacheinander entstehen, wodurch das Risiko für das Gesamtsystem erhöht wird.

Ein Beispiel hierfür wäre, wenn ein Feuer zum Ausfall eines Reifens führt und dann auf einen zweiten Reifen übergreift.

Damit sind dann beide Reifen aufgrund der gleichen Ausfallart, nämlich aufgrund des Brandes, ausgefallen.

Zusätzlich kann es auch passieren, dass das Platzen eines Reifens direkt zu einer Beschädigung des anderen Reifens führt. Dies kann zum Beispiel durch Trümmerteile geschehen.

Das Platzen des Reifens kann aber auch dazu führen, dass der andere Reifen plötzlich einer erhöhten Belastung ausgesetzt ist.

Diese Überbeanspruchung kann dann dazu führen, dass der Reifen ebenfalls platzt.

Das Konzept des Common-Mode-Ausfalls ist wichtig, um zu verstehen, wie mehrere Komponenten durch die gleiche Ausfallart betroffen sein können.

Solche Ausfälle erhöhen die Wahrscheinlichkeit eines Systemausfalls, da sie vermeintlich redundante oder parallele Systeme gleichzeitig beeinträchtigen können.

Die Folge ist eine erhebliche Reduzierung der Zuverlässigkeit des Gesamtsystems.

Durch die Identifizierung von Common-Mode-Ausfällen können wir Maßnahmen entwickeln, um solche Ausfallarten zu verhindern oder ihre Auswirkungen zu minimieren.

## Folie 11: Beispiel: Stromversorgung in einem Krankenhaus

- section_id: section_010
- source_local_slide_numbers: 11
- spoken_text_sha256: 0b7b83a3c38ad4628543301995e8da25376c57c52c98c71ff02165477df3b31e

### Gesprochener Text

Als weiteres Beispiel betrachten wir die Stromversorgung eines Operationssaals im Krankenhaus.

Der Operationssaal wird über ein eigenes Stromnetzwerk betrieben, das aus einem Stromgenerator, einem Energiepuffer, einem Steuergerät und einem Notstromaggregat besteht.

Im Standardbetrieb versorgt der Stromgenerator über den Energiepuffer den Operationssaal mit Energie.

Der Energiepuffer dient dabei als Zwischenspeicher, um eine konstante Energieversorgung sicherzustellen und eventuelle Schwankungen auszugleichen.

Fällt der Stromgenerator jedoch aus, wird dies durch das Steuergerät erkannt.

Im Anschluss wird das Notstromaggregat aktiviert, um die Energieversorgung des Operationssaals aufrechtzuerhalten.

Die Startzeit des Notstromaggregats wird dabei mit Hilfe des Energiepuffers überbrückt.

Auf diese Weise wird sichergestellt, dass der Operationssaal auch im Falle eines Ausfalls des Stromgenerators ohne Unterbrechung mit Energie versorgt bleibt.Schauen wir hierfür mal den Fehlerbaum an.

Auch hier könnt ihr das Video wieder pausieren und es selbst versuchen.

Wir beginnen zunächst mit dem Top-Ereignis, der Unterbrechung der Energieversorgung.

Dieses Top-Ereignis tritt nur ein, wenn sowohl die erste als auch die zweite Energieversorgung ausfallen. Daher sind diese beiden Ereignisse mit einem Und-Gatter verbunden.

Der Ausfall der ersten Energieversorgung tritt ein, wenn entweder der Stromgenerator ausfällt oder der Energiepuffer versagt. Da nur eins der beiden Ereignisse ausreicht, die erste Energieversorgung zu unterbrechen, sind beide mit einem Oder-Gatter verbunden.

Der Ausfall der zweiten Energieversorgung tritt ein, wenn entweder das Steuergerät, das Notstromaggregat oder der Energiepuffer ausfallen.

Auch hier sind die Ereignisse mit einem Oder Gatter verbunden.

Auf den ersten Blick wirkt das System redundant, da sowohl ein Stromgenerator als auch ein Notstromaggregat vorhanden ist.

Beide sollen im Falle eines Ausfalls des einen Systems das andere ersetzen.

Aber allein durch Betrachtung des Fehlerbaums fällt hier eine große Schwäche im Aufbau der Stromversorgung auf.

Wie zu erkennen ist, spielt der Energiepuffer in beiden Energieversorgungspfaden eine zentrale Rolle.

Sein Ausfall beeinflusst sowohl die erste als auch die zweite Energieversorgung.

Dadurch entsteht eine gemeinsame Schwachstelle im System, die zu einem Common-Mode-Ausfall führen kann.

Aus diesem Grund ist hier nicht wirklich eine echte Redundanz vorhanden, was die Zuverlässigkeit des Systems negativ beeinflusst.

Zusätzlich können wir den Fehlerbaum unseres Stromnetzwerks im Operationssaal auch um die möglichen Ausfallursachen erweitern.

Betrachten wir nun die Ursachen für den Ausfall des Stromgenerators und ebenso für den Ausfall des Notstromaggregats.Beide Systeme können sowohl durch eine defekte Einspritzung oder einen leeren Kraftstofftank ausfallen.

Nun ist die Frage: sind die Kraftstofftanks unabhängig?

Wenn beide Systeme beispielsweise den gleichen Kraftstofftank verwenden, besitzen beide Ereignisse damit eine gemeinsame Ausfallursache.

Das bedeutet, dass ein leerer Kraftstofftank sowohl den Stromgenerator als auch das Notstromaggregat gleichzeitig lahmlegen kann.

Dieses Phänomen wird Common Cause genannt und führt ebenfalls dazu, dass eine vermeintliche Redundanz nicht mehr vorhanden ist.

Um die Zuverlässigkeit des Systems zu erhöhen und echte Redundanz zu gewährleisten, müssen solche Common Cause-Ausfälle ebenfalls identifiziert und vermieden werden.

Mögliche Maßnahmen sind beispielsweise die Verwendung separater Kraftstofftanks für den Stromgenerator und das Notstromaggregat, um das Risiko eines gemeinsamen Ausfalls durch einen leeren Tank zu eliminieren.

Diese Beispiele verdeutlichen die Bedeutung der Analyse gemeinsamer Ausfallarten und Ausfallursachen während der Planung redundanter Systeme. Nur durch das Berücksichtigen und Eliminieren von Common Mode und Common Cause-Ausfällen können wir eine effektive Redundanz sicherstellen und die Sicherheit sowie den kontinuierlichen Betrieb in kritischen Anwendungen wie beispielsweise in einem Operationssaal gewährleisten.

