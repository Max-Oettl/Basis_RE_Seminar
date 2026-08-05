# Extracted Source Text

- module_id: RE1
- source_docx: source-materials/basis-seminar/powerpoint-svg/RE1/Text/02_Modul_Qualitative Methoden - Fehlerbaumanalyse.docx
- source_sha256: 14dd151d8e63984beb95e65dda56de89d58cf24b01d6a8e034efe2fb6302e3ab
- extraction_method: deterministic_ooxml_table_parser
- modul_nummer: 2
- modul_titel: Qualitative Zuverlässigkeitsmethoden
- abschnitt_nummer: 2
- abschnitt: Fehlerbaumanalyse

## Folie 1: Was ist eine FTA?

- section_id: section_001
- source_local_slide_numbers: 1
- spoken_text_sha256: 33cfb2f13b48f411e665eeef0a6d1ffcae7e12160e9779b7a34065683650cdb8

### Gesprochener Text

In diesem Abschnitt befassen wir uns mit der Fehlerbaumanalyse, die häufig auch einfach als F-T-A abgekürzt wird.

Aber wofür steht diese Abkürzung eigentlich?

F-T-A steht für den englischen Begriff Fault Tree Analysis.

Im Deutschen findet man manchmal auch die Abkürzung F-B-A für Fehlerbaumanalyse oder Fehlzustandsbaumanalyse.

Die Fehlerbaumanalyse ist eine strukturierte Top-Down-Methode.

Das heißt, zuerst wird auf der obersten Ebene, meist der Systemebene, ein unerwünschtes Ereignis definiert, beispielsweise ein Systemausfall.

Anschließend werden systematisch alle Ausfälle bzw. Ausfallarten und deren Ausfallfolgen auf den nächsttieferen Ebenen ermittelt.

Das bedeutet, wir betrachten zunächst die Ebene der unterschiedlichen Teilsysteme, dann die Baugruppen und schließlich die einzelnen Bauteile selbst.

Auf der untersten Ebene gelangen wir dann zu den Basisereignissen bzw. den Schadensursachen.

In der Zuverlässigkeitstechnik verwenden wir hierfür auch oft den Begriff Ausfallmechanismus.

Die einzelnen Ausfälle und ihre Beziehungen können in einem Diagramm dargestellt werden, das als Fehlerbaum bezeichnet wird.

Es zeigt die logischen Verknüpfungen von Komponenten oder Teilsystemen und deren Ausfälle, Ausfallkombinationen und Ausfallursachen.

Auf diese Weise können kritische Ereignisse, wie beispielsweise Komponentenausfälle, identifiziert werden, die zu einem unerwünschten Top-Ereignis, wie dem Systemausfall, führen.

Die Fehlerbaumanalyse ermöglicht es uns also, die Fehlerpfade innerhalb eines Systems zu visualisieren und zu verstehen.

Durch die Identifikation dieser Pfade können wir gezielte Maßnahmen ergreifen, um die Zuverlässigkeit des Systems zu erhöhen und potenzielle Risiken zu minimieren.

## Folie 2: Welche Arten einer FTA gibt es?

- section_id: section_002
- source_local_slide_numbers: 2
- spoken_text_sha256: 9cc0f58da15fd679afc99ed8dc21229f658d6b7864aa1d678c42827233306d47

### Gesprochener Text

Nachdem wir die Grundlagen der Fehlerbaumanalyse besprochen haben, möchten wir nun auf die beiden Arten dieser Methode eingehen: die qualitative und die quantitative Fehlerbaumanalyse.

Die qualitative Fehlerbaumanalyse hat das Ziel, sämtliche Ausfälle, Ausfallkombinationen, Ursachen und deren logische Abhängigkeiten zu identifizieren.

Dabei werden alle möglichen Fehlfunktionen systematisch erfasst, ohne dabei Zahlenwerte oder Wahrscheinlichkeiten zu berücksichtigen.

Das Ergebnis dieser Analyse sind die minimalen Ausfallschnitte. Das sind die kritischsten Ereignisse oder Ereigniskombinationen, die zum Ausfall des Systems führen können.

Die qualitative Fehlerbaumanalyse wird hauptsächlich für die Schwachstellenanalyse eingesetzt, um potenzielle Schwachstellen im System zu erkennen.

Hierbei erfolgt keine Quantifizierung von Wahrscheinlichkeiten.

Im Gegensatz dazu steht die quantitative Fehlerbaumanalyse, deren Ziel die Berechnung der Ausfallwahrscheinlichkeit eines Systems ist.

Durch die Zuweisung numerischer Wahrscheinlichkeiten zu den Basisereignissen kann die Gesamtwahrscheinlichkeit für den Systemausfall berechnet werden.

Das Ergebnis sind somit numerische Wahrscheinlichkeiten für Systemausfälle, die eine genaue Bewertung des Risikos ermöglichen.

Die quantitative Fehlerbaumanalyse wird zur Risikobewertung eingesetzt, hilft bei Entscheidungen über Risikominderungsmaßnahmen und dient zum Nachweis von Zuverlässigkeitsforderungen.

Während die qualitative Analyse sich auf die Identifizierung von Ausfallursachen und deren logische Verknüpfungen konzentriert, ermöglicht die quantitative Analyse eine numerische Bewertung der Ausfallwahrscheinlichkeit.

Beide Ansätze ergänzen sich und bieten gemeinsam ein umfassendes Verständnis über die Zuverlässigkeit des Systems.

In diesem Modul befassen wir uns allerdings nur mit der qualitativen Fehlerbaumanalyse. Schauen wir uns hierzu einmal den Ablauf etwas genauer an.

## Folie 3: Ablauf der qualitativen FTA & 1. Schritt: Systemanalyse

- section_id: section_003
- source_local_slide_numbers: 3
- spoken_text_sha256: 676602ba9a197ea18a246543a59ebf9c2e627813f00c510fc4caf9400bb1ffdd

### Gesprochener Text

Die qualitative Fehlerbaumanalyse besteht aus insgesamt fünf Schritten.

Der erste Schritt ist die Systemanalyse.

Wie der Name schon sagt, führen wir hier eine umfassende Systemanalyse durch.

Dabei sammeln wir alle relevanten Informationen über das System, seine Komponenten und deren Wechselwirkungen und nutzen sämtliche Methoden, die wir bereits im ersten Teil dieses Moduls kennengelernt haben.Wir definieren unsere Systemgrenze und ermitteln unsere Einflussgrößen mit Hilfe des P-Diagramms Dabei können wir wiederrum auf das Ishikawa-Diagramm zurückgreifen.

Zum Schluss erstellen wir unsere Bauteilblockschaltbilder und ermitteln die Systemfunktionen sowie die Systemanforderungen.Das Ziel ist es, ein tiefgreifendes Verständnis für das System und seiner Wirkungsweise zu entwickeln.

## Folie 4: 2. Schritt: Definition der unerwünschten Ereignisse

- section_id: section_004
- source_local_slide_numbers: 4
- spoken_text_sha256: 95c42f984091dab7fb2a8de706454ea0ab696299235a0a89323036c5c367e730

### Gesprochener Text

Im zweiten Schritt definieren wir das unerwünschte Ereignis, das wir vermeiden möchten.Das könnte beispielsweise ganz einfach ein Systemausfall sein.Außerdem legen wir in diesem Schritt auch die Ausfallkriterien fest, also die Bedingungen, unter denen das System dann als ausgefallen gilt.

Das unerwünschte Ereignis ist das Top- Ereignis im Fehlerbaum und kann auf zwei unterschiedliche Arten definiert werden.Zum einen durch den präventiven Ansatz. Dabei kann das unerwünschte Ereignisse aus der Nicht-Erfüllung von Funktionen und Anforderungen definiert werden.

Demgegenüber steht der korrektive Ansatz. Hier wird die Definition eines aufgetretenen Ausfalls bzw. einer Fehlfunktion des Systems als unerwünschtes Ereignis festgelegt.Aber wie genau unterscheiden sich diese beiden Ansätze?Beim präventiven Ansatz erfolgt die frühzeitige Identifizierung von Fehlerquellen oder Risiken bevor sie auftreten.

Das heißt hier wird die Systemzuverlässigkeit und -sicherheit verbessert, indem potenzielle Risiken beseitigt werden.

Auf diese Weise werden ebenfalls spätere Korrekturmaßnahmen und Reparaturen reduziert.Dieser Ansatz ist proaktiv. Es werden Fehlern und Risiken schon während der Design- und Entwicklungsphase vermieden.

Beim korrektiven Ansatz werden die aufgetretenen Fehler und dessen Ursachen erst nach einem Vorfall oder Systemausfall analysiert.

Hierbei erfolgt eine Verbesserung der Systemwartung und Reparatur durch gezieltere Korrekturmaßnahmen.

Auf diese Weise können auch ähnliche Probleme in der Zukunft vermieden werden.

Dieser Ansatz ist jedoch reaktiv, da die Fehler erst nach dem Auftreten behoben werden.

## Folie 5: 3. Schritt: Bestimmen der Ausfallarten der Komponenten

- section_id: section_005
- source_local_slide_numbers: 5
- spoken_text_sha256: 6cb1247be62d73543c133aec9cc896ebf1bea9c3886327bb0bc0593094f39291

### Gesprochener Text

Kommen wir nun zum dritten Schritt in der Fehlerbaumanalyse. Hier werden die Ausfallarten der einzelnen Komponenten im System ermittelt.

Das bedeutet, wir überlegen uns, auf welche Weise jede Komponente ausfallen kann und welche Auswirkungen das auf das Gesamtsystem hat.

Dazu werden die Systemkomponenten im Fehlerbaum üblicherweise in drei Fehlerkategorien bzw. Ausfallarten unterteilt.

Bei einem Primärausfall erfolgt der Ausfall der Systemkomponente durch technisches Versagen bei sonst zulässigen Einsatzbedingungen, beispielsweise durch Materialversagen der Systemkomponente.

Bei einem Sekundärausfall entsteht der Ausfall der Systemkomponente durch unzulässige Einsatz- oder Umgebungsbedingungen, beispielsweise durch den Betrieb bei unzulässiger Umgebungstemperatur.

Und bei einem Kommandierten Ausfall wird eine funktionsfähige Systemkomponente zu einem falschen Zeitpunkt oder am falschen Ort aktiviert oder deaktiviert, beispielsweise durch den Ausfall einer Hilfsenergieversorgung oder einer falschen bzw. fehlerhaften Ansteuerung.

Schauen wir uns hierzu ein Beispiel einer Schaltung zur Steuerung eines Motors an.

Zur Ansteuerung des Motors wird ein Steuergerät, zwei Schalter und eine Stromquelle genutzt.

Das unerwünschte Ereignis können wir einfach als „Motor läuft nicht an“ definieren.

Nun kann der Fehlerbaum in die drei Pfade entsprechend der ebene beschriebenen Ausfallarten aufgeteilt werden.

Beispielsweise kann eine durchgebrannte Wicklung oder ein Lagerschaden zu einem Primärausfall des Motors führen.Das Blockieren des Motors aufgrund Verschmutzung oder der Motorgehäusebruch, verursacht durch eine zu hohe Temperatur oder Vibration, resultiert in einem Sekundärausfall.Ist hingegen die Stromquelle, einer der Schalter oder das Steuergerät ausgefallen, führt dies zu einem Kommandierten Ausfall des Motors.

Diese drei Pfade helfen bei der Identifizierung möglicher Fehlerquellen, müssen aber nicht immer so im Fehlerbaum definiert werden.

## Folie 6: 4. Schritt: Erstellen des Fehlerbaums

- section_id: section_006
- source_local_slide_numbers: 6
- spoken_text_sha256: d0673e878983eb21f4dc89cb5f4237d1d67ff7cb5aaee2ab53d15a62570fa093

### Gesprochener Text

Kommen wir nun zum vierten Schritt, der Erstellung des Fehlerbaums.

Bei diesem Schritt wird der Fehlerbaum systematisch und strukturiert erstellt.

Schauen wir uns hierzu nochmals das vorherige Beispiel an.

Wir wissen ja bereits, dass das Hauptfehlereignis bzw. das Top-Ereignis an die Spitze des Baumes platziert wird.

Im nächsten Schritt identifizieren wir die unmittelbar möglichen Ursachen des Top-Ereignisses und stellen sie als Sub-Ereignisse dar.

Ihr habt euch bestimmt schon über die einzelnen Elemente gewundert, mit denen die Sub-Ereignisse verknüpft werden.

Dies sind logische Gatter, die aufzeigen, wie die verschiedenen Sub-Ereignisse zusammenwirken, um zum Top-Ereignis zu führen.

Um die Beziehungen zwischen den Ereignissen darzustellen, verwenden wir hautsächlich die drei logischen Gatter UND, ODER und NICHT.

Beim UND-Gatter tritt das nachfolgende Ereignis nur ein, wenn alle Eingangselemente, das heißt alle Sub-Ereignisse, eintreten.

Beim ODER-Gatter tritt das nachfolgende Ereignis immer dann ein, wenn mindestens eines der Eingangselemente, also eines der Sub-Ereignisse, eintritt.

Und beim NICHT-Gatter wird das das Eingangssignal einfach invertiert.

Im Anschluss werden die Sub-Ereignisse weiter in ihre zugrunde liegenden Ursachen unterteilt, bis wir auf die primären Fehlerursachen stoßen, die sogenannten Basisereignisse.

Auf diese Weise wird der Fehlerbaum nach unten hin immer weiter verästelt und bildet die gesamte Fehlerhierarchie ab.

Der Fehlerbaum muss aber nicht immer bis zum Ende durchgeführt werden. Prinzipiell kann an jedem Ast beliebig abgebrochen werden.

Hierzu können wir dann die dargestellten Symbole verwenden, welche die Ein- und Ausgänge im Fehlerbaum beschreiben.

Das Basisereignis haben wir bereits kennengelernt und stellt immer die primäre Fehlerursache bzw. den Ausfallmechanismus dar. An dieser Stelle sind wir bereits am Ende des Fehlerbaums, wodurch sich keine weitere untergeordnete Hierarchieebene ergibt.Es kann aber auch immer entschieden werden, das Ereignis ab einer gewissen Stelle nicht weiter zu untersuchen. Sollte das der Fall sein, lohnt es sich in einem kleinen Kommentarfeld daneben die entsprechenden Gründe zu notieren.

Wird der Fehlerbaum dagegen zu lang, kann er mit Hilfe der Verweisungsgatter an einer anderen Stelle fortgeführt werden.

Durch das schrittweise Unterteilen der Ereignisse erhalten wir ein detailliertes Diagramm, das die logischen Verknüpfungen zwischen den verschiedenen Ausfällen und ihren Ursachen visualisiert. Dies ermöglicht es uns, die kritischen Pfade zu identifizieren, die zum Top-Ereignis führen.

## Folie 8: 5. Schritt: Qualitative Bewertung

- section_id: section_007
- source_local_slide_numbers: 8
- spoken_text_sha256: 18edf9e48640e3ddb1f4cd685bc5b862cbaee332a640761aa3019d5583988b48

### Gesprochener Text

Kommen wir nun zum fünften und damit auch letzten Schritt, der qualitativen Bewertung des Fehlerbaums.

In diesem Schritt analysieren wir die Struktur des Fehlerbaums, identifizieren die minimalen Ausfallschnitte und bestimmen die kritischsten Ausfallkombinationen.

Die minimalen Ausfallschnitte, auch Minimalschnitte, kritische Mengen oder Cut Sets genannt, sind die kleinsten Kombinationen von Basisereignissen, deren gemeinsames Eintreten zu einem unerwünschten Top-Ereignis führt.

Durch die Untersuchung dieser minimalen Ausfallschnitte erhalten wir qualitative Aussagen über die schwächsten Äste des Systems und können erkennen, ob Einzel- oder Mehrfachausfälle zu kritischen Zuständen führen.

Ein kritischer Pfad ist der direkte und minimale Weg, der zu einem unerwünschten Top-Ereignis führt.

Die Analyse dieser Pfade liefert wertvolle Erkenntnisse über das Ursachen-Wirkungsgefüge innerhalb des Systems.

Mit Hilfe dieser Analysen können wir erste Näherungen über das momentane Risiko möglicher Systemschwachstellen ableiten und sehen welche Basisereignisse den größten Einfluss auf das Eintreten des Top-Ereignisses haben.

## Folie 9: Beispiel: Fahrwerk eines Flugzeugs

- section_id: section_008
- source_local_slide_numbers: 9
- spoken_text_sha256: b3ac52685f07f8d6d099172e1584e2f4924734de532cd4d82f4c6126737f0a49

### Gesprochener Text

Schauen wir uns zum Schluss noch ein paar Beispiele und Besonderheiten im Fehlerbaum an.

Als praktisches Beispiel zur Erstellung eines Fehlerbaums betrachten wir das Bugradfahrwerk eines Flugzeuges, welches für den Start- und Landevorgang sowie für die Beweglichkeit am Boden eingesetzt wird.

Das Bugradfahrwerk besteht aus den drei Fahrwerksgruppen Bugrad sowie linkes und rechtes Hauptfahrwerk.

Jede Fahrwerksgruppe besitzt jeweils zwei Reifen.

Eine Fahrwerksgruppe fällt aus, wenn keines ihrer Räder zur Verfügung steht, das heißt, wenn beide Reifen einer jeweiligen Gruppe ausgefallen sind.

Der Ausfall einer Fahrwerksgruppe ist gleichbedeutend mit dem Komplettausfall des Bugradfahrwerks.

Um dieses Szenario zu analysieren, erstellen wir nun einen Fehlerbaum.

Das Top-Ereignis kann als der Ausfall des Bugradfahrwerks definiert werden.

Nun identifizieren wir die unmittelbaren Ursachen die hierzu führen.

Zunächst Betrachten wir die Ausfälle unserer Fahrwerksgruppen. Also der Ausfall des Bugrades sowie des linken und rechten Hauptfahrwerks.

Diese Ereignisse sind mit einem ODER-Gatter verbunden, da der Ausfall einer der Fahrwerksgruppen zum Ausfall des gesamten Bugradfahrwerks führt.

Jede Fahrwerksgruppe fällt aus, wenn beide ihrer Reifen ausfallen. Daher verbinden wir die Ausfälle der Reifen innerhalb jeder Fahrwerksgruppe mit einem UND-Gatter.

Das Bugrad ist beispielsweise ausgefallen, wenn die beiden Reifen eins und zwei ausgefallen sind.

Das gleiche Prinzip gilt für das linke und rechte Hauptfahrwerk.

Auch hier sind die Ausfälle der Reifen jeweils mit einem UND-Gatter verbunden.

Durch die Strukturierung des Fehlerbaums bis zu den Basisereignissen können wir die kritischen Pfade identifizieren, die zum Top-Ereignis führen. Wir erkennen, dass der gleichzeitige Ausfall beider Reifen einer Fahrwerksgruppe zum Ausfall des Bugradfahrwerks führt.

Die minimalen Ausfallschnitte sind also die Paarungen der Reifen innerhalb jeder Fahrwerksgruppe. Jede Kombination von zwei ausgefallenen Reifen innerhalb einer Gruppe stellt einen minimalen Ausfallschnitt dar.

Durch diese Analyse können wir die Zuverlässigkeit des Bugradfahrwerks bewerten und gezielte Maßnahmen ergreifen, um die Ausfallwahrscheinlichkeit zu reduzieren. Zum Beispiel können wir regelmäßige Wartungen der Reifen durchführen oder zusätzliche Sicherheitsmechanismen einführen.

## Folie 10: Beispiel: Ausfall eines Reifens im Flugzeugfahrwerk

- section_id: section_009
- source_local_slide_numbers: 10
- spoken_text_sha256: a6ca8c3c78dbd696a38d485bfac3b796d07544dda0bab7dee3b470cd1f07b2c9

### Gesprochener Text

Nachdem wir gelernt haben wie man die einzelnen Ausfallpfade analysiert, möchten wir nun noch auf das Konzept des Common-Mode-Ausfalls eingehen.

Ein Common-Mode-Ausfall bezieht sich auf den Ausfall von mehreren Komponenten verursacht durch die gleiche Ausfallart.

Das heißt der Ausfall einer Komponente bedingt direkt den Ausfall einer anderen Komponente.

Dabei können die beiden Ausfälle gleichzeitig oder kurz nacheinander entstehen, wodurch das Risiko für das Gesamtsystem erhöht wird.

Ein Beispiel hierfür wäre wenn ein Feuer zum Ausfall eines Reifens führt und dann auf einen zweiten Reifen übergreift.

Damit sind dann beide Reifen aufgrund der gleichen Ausfallart, nämlich aufgrund des Brandes, ausgefallen.

Zusätzlich kann es auch passieren, dass das Platzen eines Reifens direkt zu einer Beschädigung des anderen Reifens führt. Dies kann zum Beispiel durch Trümmerteile geschehen.

Das Platzen des Reifens kann aber auch dazu führen, dass der andere Reifen plötzlich einer erhöhten Belastung ausgesetzt ist.

Diese Überbeanspruchung kann dann dazu führen, dass der Reifen ebenfalls platzt.

Das Konzept des Common-Mode-Ausfalls ist wichtig, um zu verstehen, wie mehrere Komponenten durch die gleiche Ausfallart betroffen sein können.

Solche Ausfälle erhöhen die Wahrscheinlichkeit eines Systemausfalls, da sie vermeintlich redundante oder parallele Systeme gleichzeitig beeinträchtigen können, wodurch die Zuverlässigkeit des Gesamtsystems erheblich beeinträchtigt wird.

Durch die Identifizierung von Common-Mode-Ausfällen in der Fehlerbaumanalyse können wir Maßnahmen entwickeln, um solche Ausfallarten zu verhindern oder ihre Auswirkungen zu minimieren.

## Folie 11: Beispiel: Stromversorgung in einem Krankenhaus

- section_id: section_010
- source_local_slide_numbers: 11
- spoken_text_sha256: 5268738315566fb782ae57df23d9fae2da0d8d658e1a457550cc21c8263a6cf5

### Gesprochener Text

Als weiteres Beispiel betrachten wir die Stromversorgung eines Operationssaals im Krankenhaus.

Der Operationssaal wird über ein eigenes Stromnetzwerk betrieben, das aus einem Stromgenerator, einem Energiepuffer, einem Steuergerät und einem Notstromaggregat besteht.

Im Standardbetrieb versorgt der Stromgenerator über den Energiepuffer den Operationssaal mit Energie.

Der Energiepuffer dient dabei als Zwischenspeicher, um eine konstante Energieversorgung sicherzustellen und eventuelle Schwankungen auszugleichen.

Fällt der Stromgenerator jedoch aus, wird dies durch das Steuergerät erkannt.

Im Anschluss wird das Notstromaggregat aktiviert, um die Energieversorgung des Operationssaals aufrechtzuerhalten.

Die Startzeit des Notstromaggregats wird dabei mit Hilfe des Energiepuffers überbrückt.

Auf diese Weise wird sichergestellt, dass der Operationssaal auch bei einem Ausfall des Stromgenerators ohne Unterbrechung mit Energie versorgt wird.Schauen wir hierfür mal den Fehlerbaum an.Wir beginnen zunächst mit dem Top-Ereignis, der Unterbrechung der Energieversorgung.

Dieses Top-Ereignis tritt nur ein, wenn sowohl die erste als auch die zweite Energieversorgung ausfallen. Daher sind diese beiden Ereignisse mit einem UND-Gatter verbunden.

Der Ausfall der ersten Energieversorgung tritt ein, wenn entweder der Stromgenerator ausfällt oder der Energiepuffer versagt. Da nur eins der beiden Ereignisse ausreicht, die erste Energieversorgung zu unterbrechen, sind beide mit einem ODER-Gatter verbunden.

Der Ausfall der zweiten Energieversorgung tritt ein, wenn entweder das Steuergerät, das Notstromaggregat oder der Energiepuffer ausfallen. Auch hier sind die Ereignisse mit einem ODER-Gatter verbunden.

Auf den ersten Blick scheint das System redundant zu sein, da sowohl ein Stromgenerator als auch ein Notstromaggregat vorhanden sind. Beide sollen bei einem Ausfall des einen Systems das andere ersetzen.

Aber allein durch Betrachtung des Fehlerbaums fällt hier eine große Schwäche im Aufbau der Stromversorgung auf.

Wie zu erkennen ist, spielt der Energiepuffer in beiden Energieversorgungspfaden eine zentrale Rolle.

Sein Ausfall beeinflusst sowohl die erste als auch die zweite Energieversorgung.

Dadurch entsteht eine gemeinsame Schwachstelle im System, die zu einem Common-Mode-Ausfall führen kann.

Aus diesem Grund ist hier nicht wirklich eine Redundanz vorhanden.

Zusätzlich können wir den Fehlerbaum unseres Stromnetzwerks im Operationssaal auch um die möglichen Ausfallursachen erweitern.

Betrachten wir nun die Ursachen für den Ausfall des Stromgenerators und ebenso für den Ausfall des Notstromaggregats.Beide Systeme können sowohl durch eine defekte Einspritzung oder einen leeren Kraftstofftank ausfallen.

Wenn beide Systeme beispielsweise den gleichen Kraftstofftank verwenden, besitzen beide Ereignisse eine gemeinsame Ausfallursache.

Das bedeutet, dass ein leerer Kraftstofftank sowohl den Stromgenerator als auch das Notstromaggregat gleichzeitig lahmlegen kann.

Dieses Phänomen wird Common Cause genannt und führt ebenfalls dazu, dass eine vermeintliche Redundanz nicht mehr vorhanden ist.

Um die Zuverlässigkeit des Systems zu erhöhen und echte Redundanz zu gewährleisten, müssen solche Common Cause-Ausfälle identifiziert und ebenfalls vermieden werden.

Mögliche Maßnahmen sind beispielsweise separate Kraftstofftanks für den Stromgenerator und das Notstromaggregat, um das Risiko eines gemeinsamen Ausfalls durch einen leeren Tank zu eliminieren.

Diese Beispiele verdeutlichen die Bedeutung der Analyse gemeinsamer Ausfallarten und Ausfallursachen bei der Planung redundanter Systeme. Nur durch das Berücksichtigen und Eliminieren von Common Mode und Common Cause-Ausfällen können wir eine effektive Redundanz sicherstellen und die Sicherheit sowie den kontinuierlichen Betrieb in kritischen Anwendungen wie beispielsweise in einem Operationssaal gewährleisten.

