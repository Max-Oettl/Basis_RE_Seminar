# Extracted Source Text

- module_id: RE3
- source_docx: source-materials/basis-seminar/powerpoint-svg/RE3/Text/03_Modul_Lebensdauerdatenanalyse.docx
- source_sha256: cc717e76c24551f9e37ec6b9db97d8310e4644baa4bee1ec4b807440421a3526
- extraction_method: deterministic_ooxml_table_parser
- modul_nummer: 3
- modul_titel: Lebensdauerdatenanalyse
- abschnitt_nummer: 1
- abschnitt: 1

## Folie 1: Einführung in die Lebensdatenanalyse Video 1

- section_id: section_001
- source_local_slide_numbers: 1
- spoken_text_sha256: 5e243f774997b01d973142750e4c76c9c129804b2f5eadb8feb068ded74a7b5d

### Gesprochener Text

In diesem Abschnitt lernen wir die Lebensdauerdatenanalyse kennen.

Der Name verrät bereits, was wir dazu benötigen: Lebensdauerdaten. Diese können beispielsweise als Ausfallzeiten einer einzelnen Komponente oder eines gesamten Systems vorliegen.

Sobald wir die Lebensdauerdaten gesammelt haben, können wir sie auswerten. Das Ziel ist es, das Ausfallverhalten der Komponente oder des Systems abzuschätzen.

Dafür wenden wir geeignete statistische Methoden an, um die Parameter der zugrundeliegenden Lebensdauerverteilung zu bestimmen. In diesem Fall nutzen wir die Weibullverteilung.

Erinnern wir uns zurück: Mit der Weibullverteilung können wir die Ausfallwahrscheinlichkeit in Abhängigkeit der Zeit mithilfe einer mathematischen Formel beschreiben.

Die charakteristische Lebensdauer gibt dabei eine Art Lageparameter an, während der Formparameter die Gestalt der Verteilung beeinflusst und damit die Steigung der Geraden im Weibull-Papier bestimmt.

Sobald wir die Weibullverteilung basierend auf den Lebensdauerdaten ermittelt haben, können wir Vergleiche anstellen, Berechnungen durchführen und Prognosen erstellen.

Zunächst konzentrieren wir uns jedoch auf das grundlegende Vorgehen für die Analyse von Lebensdauerdaten. Dafür nutzen wir die grafische Methode.

## Folie 2: Allgemeines Vorgehen in der Lebensdatenanalyse Video 1

- section_id: section_002
- source_local_slide_numbers: 2
- spoken_text_sha256: c4ff130d20a2426e00f9cd92aed1ec6f6eb00802eb54b9c41b8503e653a690c8

### Gesprochener Text

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

Allerdings gibt es einige wichtige Aspekte und Sonderfälle, die beachtet werden müssen.Auf diese gehen wir nun im Folgenden ein.

## Folie 3: Allgemeines Vorgehen in der Lebensdatenanalyse Video 2

- section_id: section_003
- source_local_slide_numbers: 3
- spoken_text_sha256: 68628ee8e41e141314b7be52a7a54d4d45080f9768db4d623ba899f7337197b0

### Gesprochener Text

Als erstes müssen uns Lebensdauerdaten nicht immer nur als reine Ausfallzeiten einer einzelnen Komponente mit nur einem Ausfallmechanismus vorliegen. Es können auch Ausfallzeiten verschiedener Komponenten oder auch mehrere Ausfallmechanismen einer Komponente verfügbar sein. Für jeden Ausfallmechanismus muss dann die Auswertung immer getrennt voneinander erfolgen.

Das bedeutet, wenn zwei Ausfallmechanismen A und B vorliegen, wie in dem Beispiel hier, dann erhalten wir natürlich auch immer zwei ermittelte Weibull-Geraden. Eine für den Ausfallmechanismus A und eine für den Ausfallmechanismus B.

Diese können dann wieder miteinander verrechnet werden, um die Gesamtzuverlässigkeit der Komponente zu erhalten.

Außerdem müssen Lebensdauerdaten nicht zwingend ausschließlich als Ausfallzeiten vorliegen.Es kann natürlich sein, dass wir den Test vorzeitig abbrechen, wenn manche Objekte noch nicht ausgefallen sind.

Wir wissen also, dass eine Komponente eine bestimmte Lebensdauer überlebt hat und noch funktioniert. Hierbei spricht man von Zensierung. Diese zensierten Informationen sind für uns ebenfalls relevant. Und nicht nur das – wir sollten sie sogar unbedingt in der Auswertung mitberücksichtigen.In diesem Modul wirst du auch noch lernen, welche Arten von Zensierung es gibt, wie solche Daten entstehen und wie man sie auswertet.

Bisher haben wir die grafische Methode zur Auswertung der Lebensdauerdaten genutzt, genauer gesagt das Median-Rang-Verfahren. Es gibt jedoch auch Berechnungs-Methoden, die analytisch oder teils numerisch gelöst werden müssen und eine höhere Genauigkeit bieten.

Zu den bekanntesten zählen die Methode der kleinsten Quadrate, abgekürzt als M-L-S, sowie die Maximum-Likelihood-Schätzung, abgekürzt als M-L-E. Der Nachteil dieser Methoden ist ihre mathematische Komplexität im Vergleich zur grafischen Methode.

Das ist jedoch kein Problem, denn wir müssen diese Methoden nicht manuell anwenden – dafür gibt es Software. Dennoch ist es wichtig, die Hintergründe zu verstehen. Nur so können wir sicherstellen, dass die richtige Methode angewendet wurde. Andernfalls können fehlerhafte oder ungenaue Ergebnisse entstehen, die schwerwiegende Konsequenzen haben können.

Sei dir also immer bewusst, was du tust, wenn du solche Auswertungen durchführst.

Aber keine Sorge – im Laufe dieses Trainings erhältst du weitere Einblicke und lernst die Methoden genauer kennen. Am Ende des Trainings zeigen wir dir zudem typische Fallstricke, die vermieden werden sollten.

Zum Schluss solltest du wissen, dass die Weibullverteilung nur einen Teil des Ergebnisses darstellt. Immer wenn wir Lebensdauerdaten auswerten, benötigen wir zusätzlich einen sogenannten Vertrauensbereich.

Warum dieser notwendig ist und welche Aussagekraft er besitzt, erfährst du in der nächsten Lektion.

## Folie 4: Von der Stichprobe zur Grundgesamtheit Video 3

- section_id: section_004
- source_local_slide_numbers: 4
- spoken_text_sha256: e94c89cf1237d6ba6574d8c05742d1170b247d862190dc43005cc3c5fb1a3849

### Gesprochener Text

Bisher haben wir uns mit der Analyse von Lebensdauerdaten auf Basis einer Stichprobe beschäftigt. Doch was bedeutet das genau, und warum brauchen wir einen Vertrauensbereich?

Stellen wir uns die gesamte Population, also die Grundgesamtheit, vor. Sie umfasst alle möglichen Einheiten, die jemals betrachtet werden könnten. Innerhalb dieser Grundgesamtheit ziehen wir eine begrenzte Anzahl von Datenpunkten – das ist unsere Stichprobe.

Auf Basis dieser Stichprobe führen wir eine Weibull-Analyse durch. Das Ergebnis ist eine Weibullverteilung, die das Ausfallverhalten unserer Stichprobe beschreibt. Doch Vorsicht: Diese Verteilung gilt zunächst nur für die Stichprobe selbst und nicht zwangsläufig für die gesamte Population.

Wenn wir jedoch Aussagen über die Grundgesamtheit treffen möchten, müssen wir die Unsicherheit berücksichtigen, die durch die begrenzte Anzahl an Stichprobendaten entsteht. Genau hier kommt der Vertrauensbereich ins Spiel.

Doch was genau bedeutet ein Vertrauensbereich eigentlich?

## Folie 5: Was bedeutet der Vertrauensbereich? Video 3

- section_id: section_005
- source_local_slide_numbers: 5
- spoken_text_sha256: dd57d9ef8ab9e875c05b17874b1de222c766921f359aeae23769055e599d04cc

### Gesprochener Text

Nehmen wir an, wir haben aus unseren Ausfalldaten eine Weibullgerade ermittelt.

Da diese Daten jedoch nur auf einer Stichprobe der Grundgesamtheit basieren, ergibt sich daraus auch ein Vertrauensbereich.

Dieser wird durch zwei Vertrauensgrenzen definiert.

Die Vertrauensgrenzen geben den Bereich an, in dem sich die wahre Weibullverteilung der Grundgesamtheit mit einer bestimmten Wahrscheinlichkeit befindet.

Ein neunzigprozentiger Vertrauensbereich bedeutet beispielsweise, dass die tatsächliche Weibullverteilung der Grundgesamtheit mit einer Wahrscheinlichkeit von neunzig Prozent innerhalb dieser Grenzen liegt.

Würden wir eine andere Stichprobe aus derselben Grundgesamtheit analysieren, würde die berechnete Weibullgerade in neunzig Prozent der Fälle innerhalb der Vertrauensgrenzen liegen.

Man spricht in diesem Zusammenhang auch manchmal von der Aussagewahrscheinlichkeit oder auch Aussagesicherheit.

## Folie 6: Was bedeutet das für unsere Auswertung? Video 3

- section_id: section_006
- source_local_slide_numbers: 6
- spoken_text_sha256: 354726a4324ed90b72cefe581ecbd2e1c984abc893b6a8f8ed79a6239a6f713e

### Gesprochener Text

Aber was bedeutet das für unsere Auswertung?

Wenn wir Lebensdauerdaten auswerten, können wir immer einen Vertrauensbereich angeben, den wir berücksichtigen möchten. Unsere Analyse liefert also nicht nur die Weibullverteilung, sondern auch den entsprechenden Vertrauensbereich.

In diesem Fall betrachten wir einen neunzigprozentigen Vertrauensbereich, der durch die fünf-Prozent- und die fünfundneunzig-Prozent-Vertrauensgrenze definiert ist. Alternativ könnten wir auch einen achtzigprozentigen Vertrauensbereich anzeigen lassen, der zwischen der zehn-Prozent- und der neunzig-Prozent-Vertrauensgrenze liegt.

Je kleiner der Vertrauensbereich gewählt wird, desto enger rücken die Vertrauensgrenzen zusammen. Umgekehrt gilt: Je größer der Vertrauensbereich, desto weiter liegen die Grenzen von der Weibullverteilung entfernt.

Auch die Größe unserer Stichprobe hat einen starken Einfluss auf die Breite des Vertrauensbereichs. Dabei gilt: Je größer die Stichprobe, desto präziser ist die Schätzung und desto schmaler wird der Vertrauensbereich. Eine kleine Stichprobe hingegen führt zu einer höheren Unsicherheit, wodurch der Vertrauensbereich breiter wird.

Doch warum ist der Vertrauensbereich so wichtig?

Ohne ihn könnten wir zu falschen oder ungenauen Schlussfolgerungen gelangen. Eine berechnete Weibullverteilung könnte beispielsweise suggerieren, dass eine Komponente eine bestimmte Lebensdauer hat, obwohl sie in Wirklichkeit – wenn wir alle Daten der Grundgesamtheit hätten – deutlich kürzer oder länger sein könnte.

Der Vertrauensbereich ist daher essenziell, um die Genauigkeit unserer Schätzung zu bewerten und das Risiko von Fehleinschätzungen zu minimieren.

## Folie 7: Dichtefunktion der Ausfallwahrscheinlichkeiten? Video 4

- section_id: section_007
- source_local_slide_numbers: 7
- spoken_text_sha256: c725eb885b64594385426ea5204feeb501022c6a0c15109ed3b0b4882ca1f690

### Gesprochener Text

Um das Konzept des Vertrauensbereiches besser zu verstehen, betrachten wir die Ausfallwahrscheinlichkeit in Abhängigkeit von der Zeit in einer dreidimensionalen Visualisierung.

Aufgrund der Unsicherheit in unserer Stichprobe haben wir für einen bestimmten Zeitpunkt keine exakt festgelegte Ausfallwahrscheinlichkeit. Stattdessen liegt sie als Verteilung vor.

Diese Verteilung der Ausfallwahrscheinlichkeit können wir als Dichtefunktion auf der Z-Achse darstellen. In der Abbildung ist dies exemplarisch für verschiedene Zeitpunkte gezeigt.

Der Median jeder dieser Verteilungen liegt genau in der Mitte. Verbindet man die Mediane über die verschiedenen Zeitpunkte hinweg, entsteht die Weibullgerade.

Diese Weibullgerade ist unsere beste Schätzung für das Ausfallverhalten. Es ist jedoch wichtig zu verstehen, dass sie lediglich auf den Stichprobendaten basiert.

In fünfzig Prozent der Fälle liegt die tatsächliche Weibullgerade der Grundgesamtheit oberhalb unserer berechneten Linie, und in fünfzig Prozent der Fälle liegt sie darunter.

Das bedeutet, dass unsere Schätzung genau in der Mitte der möglichen Ausfallverteilungen liegt, jedoch individuelle Schwankungen auftreten können.

Nachdem wir nun verstanden haben, was ein Vertrauensbereich ist, werfen wir einen Blick auf die verschiedenen Arten.

Wenn wir die Verteilung der Ausfallwahrscheinlichkeit für einen bestimmten Zeitpunkt von vorne betrachten, sehen wir die Dichtefunktion der Ausfallwahrscheinlichkeit.

## Folie 8: Arten von Vertrauensbereichen Video 4

- section_id: section_008
- source_local_slide_numbers: 8
- spoken_text_sha256: 0ae74d8c45f6db4ee11a3ddc40af98ae3db723c47f369840c342df5b7b63c86e

### Gesprochener Text

Bereits kennengelernt haben wir den zweiseitigen Vertrauensbereich. Dabei sind sowohl die untere als auch die obere Grenze der Ausfallwahrscheinlichkeit enthalten. Die Aussagewahrscheinlichkeit von neunzig Prozent wird durch eine fünf-Prozent- und eine fünfundneunzig-Prozent-Vertrauensgrenze definiert. Diese Art des Vertrauensbereichs wird häufig verwendet, da sie Unsicherheiten in beide Richtungen berücksichtigt.

Zusätzlich gibt es auch einseitige Vertrauensbereiche. Beim linksseitigen Vertrauensbereich wird nur eine obere Grenze betrachtet, die sicherstellt, dass der wahre Wert mit einer bestimmten Wahrscheinlichkeit unterhalb dieser Grenze liegt. Dies kann beispielsweise nützlich sein, wenn wir eine maximale Ausfallwahrscheinlichkeit garantieren möchten.

Wichtig ist, dass die Definition der Grenzen die Aussagewahrscheinlichkeit beeinflusst.

Um beim zweiseitigen Vertrauensbereich eine Aussagewahrscheinlichkeit von neunzig Prozent zu erhalten, wird eine fünf Prozent und eine fünfundneunzig Prozent Vertrauensgrenze benötigt.

Um beim linksseitigen Vertrauensbereich eine Aussagewahrscheinlichkeit von neunzig Prozent zu erhalten, wird dagegen nur eine einzige neunzig Prozent Vertrauensgrenze benötigt.

Analog dazu gibt es auch den rechtsseitigen Vertrauensbereich. In diesem Fall betrachten wir nur eine untere Grenze, was bedeutet, dass der wahre Wert mit einer bestimmten Wahrscheinlichkeit oberhalb dieser Grenze liegt. Um eine Aussagewahrscheinlichkeit von neunzig Prozent zu erhalten, wird nun eine zehn-Prozent-Vertrauensgrenze verwendet.

Betrachten wir die Dichtefunktion der Ausfallwahrscheinlichkeit, ist ein rechtsseitiger Vertrauensbereich allerdings wenig sinnvoll, da er lediglich eine minimale Ausfallwahrscheinlichkeit nachweisen würde. Das bedeutet, dass die tatsächliche Ausfallwahrscheinlichkeit oft deutlich höher sein könnte.

Betrachten wir jedoch statt der Ausfallwahrscheinlichkeit die Zuverlässigkeit, macht eine untere Vertrauensgrenze wieder Sinn. In diesem Fall können wir eine minimale Zuverlässigkeit nachweisen.

Die Wahl des passenden Vertrauensbereichs hängt immer von der konkreten Fragestellung ab. Während der zweiseitige Vertrauensbereich Unsicherheiten in beide Richtungen berücksichtigt, ermöglichen einseitige Vertrauensbereiche gezielte Aussagen für spezifische Anforderungen.

Damit haben wir das Thema Vertrauensbereiche nun abgeschlossen. Später in der Analyse werden wir diese Konzepte in der Praxis noch anwenden.

In der nächsten Lektion schauen wir uns aber zunächst einmal noch genauer an, welche verschiedenen Arten von Lebensdauerdaten es gibt und was diese für Besonderheiten aufweisen.

## Folie 9: Lebensdauerdaten aus Tests und aus dem Feld Video 5

- section_id: section_009
- source_local_slide_numbers: 9
- spoken_text_sha256: 241a7dfb416fb3685f07bb208afd06d5f56d1e32d5a0e4ee39a991c3bd3d4012

### Gesprochener Text

Bevor wir mit einer Lebensdauerdatenanalyse beginnen können, müssen wir uns die Grundlage der gesamten Auswertung anschauen – nämlich die Herkunft unserer Daten.

Lebensdauerdaten können auf verschiedene Weise erhoben werden.

Wir können die verschiedenen Arten von Datenquellen in eine typische Reihenfolge bringen, die sich entlang des Entwicklungsprozesses eines Produkts einordnen lässt.

Je nach Quelle unterscheiden sich die Daten dabei in ihrer Unsicherheit und Repräsentativität.

Die Unsicherheit bezieht sich hierbei auf die statistische Streuung und die Kontrollierbarkeit der Einflussgrößen – also darauf, wie exakt und zuverlässig die erfassten Daten das wahre Ausfallverhalten der Grundgesamtheit widerspiegeln.

Repräsentativität bedeutet, wie gut die erhobenen Daten das tatsächliche Einsatzverhalten des Produkts im Feld widerspiegeln – also wie „realitätsnah“ die Daten in Bezug auf den späteren Gebrauch durch den Kunden sind.

An erster Stelle stehen stark beschleunigte Lebensdauerversuche. Dabei werden Komponenten gezielt extremen Belastungen ausgesetzt – etwa durch hohe Temperaturen, starke Vibrationen oder überhöhte elektrische Spannungen. Ziel ist es, in kürzester Zeit möglichst viele Ausfälle zu provozieren, um frühe Schwachstellen zu erkennen. Diese Tests laufen kontrolliert ab und liefern schnelle Ergebnisse, bergen aber eine hohe Unsicherheit hinsichtlich ihrer Übertragbarkeit auf reale Einsatzbedingungen.

Es folgen beschleunigte oder unbeschleunigte Lebensdauerversuche unter realitätsnahen Bedingungen im Labor.

Bei unbeschleunigten Tests werden Produkte unter normalen Einsatzbedingungen betrieben – entsprechend lange dauert es, bis Ausfälle auftreten.

Deshalb werden in der Praxis häufig beschleunigte Lebensdauerversuche eingesetzt. Dabei werden Einflussgrößen wie Temperatur, Belastung oder Schaltzyklen gezielt erhöht, um die Lebensdauer künstlich zu verkürzen und schneller an aussagekräftige Daten zu gelangen.

Je stärker die Beschleunigung, desto schneller ist das Testergebnis verfügbar – gleichzeitig sinken aber auch die Repräsentativität und die Übertragbarkeit auf reale Einsatzbedingungen.

Moderat beschleunigte Tests stellen daher oft einen sinnvollen Kompromiss dar: Sie verkürzen die Testdauer, bleiben aber noch ausreichend realitätsnah, um belastbare Aussagen für den späteren Praxiseinsatz zu ermöglichen.

Danach folgen Versuchsfahrten – beispielsweise im Fahrzeugbereich. Dabei wird das Produkt bereits im realen Umfeld, aber noch unter definierten und überwachten Bedingungen getestet. Diese Daten liegen näher an der Realität, sind aber auch von mehr Störfaktoren beeinflusst und dadurch ungenauer als Labordaten.

Abschließend betrachten wir Felddaten oder sogenannte Feldversuche. Diese entstehen während des echten Einsatzes beim Kunden oder im Serienbetrieb. Die Repräsentativität dieser Daten ist sehr hoch, da sie den tatsächlichen Anwendungsfall widerspiegeln. Gleichzeitig sind sie jedoch mit der größten Unsicherheit behaftet, da viele Einflussgrößen nicht kontrolliert werden können.

Zusammenfassend lässt sich sagen: Je weiter wir uns im Entwicklungsprozess befinden, desto repräsentativer werden die Daten – gleichzeitig nimmt jedoch auch die Unsicherheit zu. Deshalb ist es besonders wichtig, die Herkunft der Daten zu kennen, um die Ergebnisse der Analyse richtig einordnen zu können.

## Folie 10: Keine Zensierung (vollständige Daten) Video 6

- section_id: section_010
- source_local_slide_numbers: 10
- spoken_text_sha256: a23c221f9c5615f471dd6350b05f5e5597841a7086f3c193aa74871cb7fa716b

### Gesprochener Text

Ein weiterer wichtiger Punkt ist die Art der Daten.

Stellen wir uns dazu vor, wir führen einen Lebensdauerversuch mit sechs identischen Objekten durch. Jedes dieser Objekte wird so lange betrieben, bis es ausfällt.

Das bedeutet: Wir kennen für jedes einzelne Objekt den genauen Ausfallzeitpunkt. In der Abbildung sehen wir dies anhand der roten Kreuze, die jeweils den Ausfall eines Objekts markieren.

Da alle sechs Objekte ausgefallen sind, sprechen wir von vollständigen Daten.

Es liegt also keine Zensierung vor. Deshalb werden diese Daten auch manchmal unzensierte Daten genannt. Es ist leicht vorstellbar, dass wir diese Art von Daten nur dann erhalten, wenn der Lebensdauerversuch erst nach dem letzten Ausfall beendet wird.

Solche vollständigen Lebensdauerdaten sind besonders einfach auszuwerten, da keinerlei Unsicherheiten durch unvollständige Beobachtungen bestehen. In der Praxis kommen sie jedoch nur selten vor. Denn viele Versuche werden aus zeitlichen oder wirtschaftlichen Gründen vorzeitig beendet – noch bevor alle Objekte ausgefallen sind.

## Folie 11: Rechtszensierung Video 6

- section_id: section_011
- source_local_slide_numbers: 11
- spoken_text_sha256: b42cf249de1c705a28c1eb572bf514092c75177bc13d2af922239abe501487e2

### Gesprochener Text

In der Statistik spricht man von zensierten Daten, wenn das interessierende Ereignis bis zum Ende der Beobachtungszeit nicht eingetreten ist. In unserem Fall ist dieses Ereignis der Ausfall eines Objekts. Das bedeutet: Wir wissen nur, dass das Objekt bis zu einem bestimmten Zeitpunkt funktioniert hat – aber nicht, wann es tatsächlich ausfallen wird. Man sagt auch: Der wahre Ausfallzeitpunkt liegt jenseits der bekannten Beobachtungsdauer. Für die Auswertung ist es wichtig, jeden dieser Zensierungszeitpunkte korrekt zu erfassen, da sie die statistische Analyse beeinflussen. Die Unvollständigkeit der Daten erfordert besondere Methoden – auf diese gehen wir im weiteren Verlauf noch ein. Schauen wir uns aber zunächst erst einmal an, welche konkreten Formen der Zensierung es gibt.

Liegen alle unbekannten Ausfallzeiten zeitlich gesehen rechts – also später – als die letzten beobachteten Ausfälle, sprechen wir von einer Rechtszensierung. In der Abbildung sehen wir dies an den blauen Pfeilen. Sie zeigen, dass nicht alle Objekte ausgefallen sind. Am Ende des Versuchs befinden sich also noch Objekte im Betrieb. Wir wissen nur, dass sie irgendwann nach dem Versuchsende ausfallen werden, dieser Zeitpunkt ist aber unbekannt. Die Zensierungszeit ist daher immer größer oder gleich der letzten beobachteten Ausfallzeit. Generell lässt sich die Rechtszensierung in zwei typische Varianten aufteilen, welche während Lebensdauerversuchen auftreten können.

## Folie 12: Rechtszensierung Typ I und II Video 6

- section_id: section_012
- source_local_slide_numbers: 12
- spoken_text_sha256: c8969c2a867ba733246335c68b783b17b456e3174e13305a8c12dc98c798825e

### Gesprochener Text

Beginnen wir mit der Rechtszensierung vom Typ eins. Dabei wird der Versuch nach einer vorher festgelegten Zeit beendet – unabhängig davon, wie viele Ausfälle bis dahin eingetreten sind. Alle Objekte, die zu diesem Zeitpunkt noch funktionieren, gelten als rechtszensiert. Ihre tatsächlichen Ausfallzeiten liegen also jenseits des Versuchsstopps und bleiben unbekannt. Die Anzahl der Ausfälle, die während des Versuchs auftreten, ist dabei eine Zufallsgröße. Typ eins ist in der Praxis besonders häufig, da viele Versuche aus organisatorischen oder wirtschaftlichen Gründen zu einem festen Zeitpunkt abgeschlossen werden müssen. Mindestens ein Testobjekt bleibt auch nach der Testdauer noch funktionsfähig.

Im Gegensatz dazu steht die Rechtszensierung vom Typ zwei. Hier ist nicht die Zeit, sondern die Anzahl an Ausfällen vorgegeben. Der Versuch endet, sobald eine bestimmte Anzahl an Objekten ausgefallen ist – unabhängig davon, wie lange das dauert. In diesem Fall ist die Versuchszeit eine Zufallsgröße. Alle Objekte, die zu diesem Zeitpunkt noch intakt sind, gelten ebenfalls als rechtszensiert. Diese Variante wird oft verwendet, wenn eine genau definierte Anzahl an Ausfallereignissen betrachtet werden soll.

Beide Varianten haben gemeinsam, dass nicht alle Ausfallzeiten bekannt sind. Und genau das ist das Wesentliche bei der Rechtszensierung: Wir wissen, dass einige Objekte länger durchhalten – aber wir wissen nicht, wie lange genau.

## Folie 13: Multiple Zensierung Video 6

- section_id: section_013
- source_local_slide_numbers: 13
- spoken_text_sha256: 97c014fd32c760df711667ef341522024d536b1963840f442ac7c7bce7f8aaa6

### Gesprochener Text

Bei der sogenannten Multiplen Zensierung handelt es sich ebenfalls um eine Form der Rechtszensierung – allerdings mit einer Besonderheit. Auch hier sind nicht alle Objekte ausgefallen. Doch im Unterschied zu den bisherigen Fällen werden die intakten Objekte nicht gleichzeitig aus dem Versuch genommen. Stattdessen endet ihre Beobachtung zu unterschiedlichen Zeitpunkten. Diese Zeitpunkte sind nicht vorher festgelegt, sondern ergeben sich zufällig im Verlauf des Versuchs. Deshalb spricht man auch von zufälligen Zensierungszeitpunkten. In der Abbildung ist gut zu erkennen, dass diese Zensierungen zwischen verschiedenen Ausfällen liegen können. Diese Form der Zensierung tritt häufig auf, wenn einzelne Testobjekte aus organisatorischen, technischen oder wirtschaftlichen Gründen vorzeitig aus dem Versuch entfernt werden müssen.

Ein praktisches Beispiel ergibt sich, wenn mehrere Ausfallmechanismen gleichzeitig betrachtet werden. In der Abbildung sehen wir sechs Objekte. Einige sind durch Ausfallmechanismus A ausgefallen – gekennzeichnet durch rote Kreuze. Andere durch Ausfallmechanismus B – dargestellt durch grüne Kreuze. Wenn wir nun gezielt den Mechanismus A analysieren möchten, können wir die Ausfälle durch Mechanismus B als Zensierungszeitpunkte nutzen. Denn wir wissen: Bis zu diesem Zeitpunkt war das jeweilige Objekt in Bezug auf Mechanismus A noch funktionsfähig. Wann es tatsächlich durch Mechanismus A ausgefallen wäre, bleibt unbekannt. Das gleiche gilt natürlich auch umgekehrt. Wenn wir Mechanismus B untersuchen, können die Ausfälle durch Mechanismus A als Zensurzeitpunkte betrachtet werden. So entstehen multiple, zufällige Zensierungen – abhängig davon, welcher Ausfallmechanismus gerade analysiert wird.

## Folie 14: Intervallzensierung Video 6

- section_id: section_014
- source_local_slide_numbers: 14
- spoken_text_sha256: bc54fd7aa9b1bcd77e56382c7a9949902b2e27652f4332bfdfcee410467324c6

### Gesprochener Text

Eine weitere Form der Zensierung ist die sogenannte Intervallzensierung. In der Statistik spricht man von Intervallzensierung, wenn der genaue Zeitpunkt eines Ereignisses – in unserem Fall der Ausfall – nicht bekannt ist.

Stattdessen wissen wir nur, dass der Ausfall innerhalb eines bestimmten Zeitintervalls stattgefunden hat. Das bedeutet: Wir kennen zwei Zeitpunkte, zwischen denen der Ausfall liegen muss – aber nicht, wann genau er eingetreten ist.

Dieses Phänomen tritt in der Praxis häufig auf. Zum Beispiel dann, wenn Objekte nicht kontinuierlich überwacht werden, sondern nur in regelmäßigen Abständen – etwa einmal täglich oder wöchentlich. Wird während einer Kontrolle ein Defekt festgestellt, wissen wir nur, dass der Ausfall irgendwann zwischen der letzten erfolgreichen Prüfung und der aktuellen Kontrolle passiert sein muss. Der tatsächliche Ausfallzeitpunkt bleibt also innerhalb eines Intervalls verborgen.

Wichtig ist: Intervallzensierung bezieht sich auf die Genauigkeit unserer Beobachtung des Ausfalls und ist prinzipiell unabhängig von den bisher betrachteten Zensierungsarten. Das heißt, sie kann sowohl in Fällen vollständigen Daten als auch in Fällen rechtszensierten oder multipel zensierten Daten auftreten. Strenggenommen liegt Intervallzensierung in vielen Fällen sogar automatisch vor – nämlich immer dann, wenn unsere zeitliche Auflösung nicht unendlich klein ist. Selbst kleinste Intervalle führen dazu, dass der Ausfallzeitpunkt nur geschätzt, aber nicht exakt bestimmt werden kann.

Deshalb ist es wichtig zu verstehen: Intervallzensierung beschreibt nicht, wie der Versuch aufgebaut ist – sondern, wie genau wir über den Zeitpunkt des Ereignisses Bescheid wissen. Und dieses Wissen ist in der Praxis fast immer begrenzt.

## Folie 15: MLS vs. MLE Video 7

- section_id: section_015
- source_local_slide_numbers: 15
- spoken_text_sha256: fd64ff6273d9098b150ff23006b40e01519418c74f885af5198aac3876b094ea

### Gesprochener Text

In den bisherigen Abschnitten haben wir die grafische Auswertung von Lebensdauerdaten kennengelernt.

Es gibt jedoch auch rechnerische Verfahren, mit denen sich die Parameter einer Lebensdauerverteilung bestimmen lassen.

Zwei dieser Verfahren möchten wir an dieser Stelle ganz kurz vorstellen: Die Methode der kleinsten Quadrate – abgekürzt als M-L-S – und die Maximum-Likelihood-Methode, abgekürzt als M-L-E.

Die M-L-S-Methode basiert auf dem Prinzip der Regressionsanalyse. Sie versucht, eine möglichst gute Gerade durch die Datenpunkte im Weibull-Papier zu legen. Diese Gerade kann entweder rechnerisch oder sogar grafisch geschätzt werden. Ziel ist es, die Abweichungen der Punkte zur Geraden möglichst gering zu halten – genauer gesagt, die Summe der Abweichungen im Quadrat zu minimieren. Die Methode ist einfach anzuwenden und gut nachvollziehbar. Ein großer Nachteil besteht jedoch darin, dass sie keine Zensierungsinformationen berücksichtigen kann. Sie ist daher nur für vollständig beobachtete Daten geeignet.

Anders verhält es sich mit der Maximum-Likelihood-Methode. Hier werden die Parameter so bestimmt, dass die beobachteten Daten mit maximaler Wahrscheinlichkeit unter einer angenommenen Verteilung auftreten. Das Besondere an dieser Methode: Sie kann sowohl vollständige als auch zensierte Daten verarbeiten. Genau deshalb wird sie in der Lebensdauerdatenanalyse besonders häufig eingesetzt. Die M-L-E liefert präzise Ergebnisse, ist aber mathematisch komplexer und in der Regel nur mithilfe geeigneter Software durchführbar.

Für die Praxis gilt: Beide Verfahren lassen sich heute bequem mit Statistiksoftware anwenden. Dennoch ist es wichtig, die Unterschiede zu kennen, um die Ergebnisse richtig zu interpretieren.

Wenn du tiefer in diese Methoden einsteigen möchtest, empfehlen wir dir unser Experten-Seminar zur Lebensdauerdatenanalyse. Dort zeigen wir dir, wie beide Verfahren im Detail funktionieren – mit konkreten Beispielen, Berechnungen und Anwendungstipps.

## Folie 16: Übung 1-3 Video 8-10

- section_id: section_016
- source_local_slide_numbers: 16
- spoken_text_sha256: 83cc76e050c1285eae203eb16267354726567b01cb55445d9f4488614d6e5633

### Gesprochener Text

Text Separat!

## Folie 17: Abschluss Übung Video 11

- section_id: section_017
- source_local_slide_numbers: 17
- spoken_text_sha256: 7c732ea8bd525f4851143a6ad585e0115c82ecd3fae7d7aa58371c99ee30a3b4

### Gesprochener Text

Damit haben wir die ersten drei Übungen zur Analyse von Lebensdauerdaten erfolgreich abgeschlossen.Du hast gelernt, wie sich mit Hilfe von Ausfalldaten eine Weibull-Verteilung in Minitab schätzen lässt – und wie du damit das Ausfallverhalten von Produkten beschreiben und Prognosen ableiten kannst.

Außerdem hast du erfahren, wie Vertrauensbereiche funktionieren, was sie aussagen und wie du sie in Minitab korrekt einstellst, um statistisch abgesicherte Aussagen über die Grundgesamtheit zu treffen.

Als Datengrundlage haben wir in diesen Übungen vollständige sowie rechtszensierte Lebensdauerdaten verwendet.

Doch du weißt ja bereits, es gibt auch weitere Zensierungsarten, etwa die Multiple Zensierung oder die Intervallzensierung, die in der Praxis ebenfalls eine wichtige Rolle spielen.Wenn du tiefer in diese Themen einsteigen möchtest, empfehlen wir dir unser Expertenseminar zur Lebensdauerdatenanalyse.

Im nächsten Schritt werfen wir noch einen Blick auf einige Sonderfälle in der Auswertung, die dir in der Praxis begegnen können.

## Folie 18: Sonderfälle Video 12

- section_id: section_018
- source_local_slide_numbers: 18
- spoken_text_sha256: d09de85d6d12f1b7f9d3df272b4b49097c2e39e228d84b3e0fda0109078ca479

### Gesprochener Text

Wenn du eine Auswertung in Minitab durchführst und dich für die Weibull-Verteilung entscheidest, kann es vorkommen, dass du im Ergebnisverlauf eine deutlich gekrümmte Kurve erkennst, anstelle des typischen linearen Verlaufs in der Weibull-Darstellung.

Das ist ein Hinweis darauf, dass eine dreiparametrige Weibull-Verteilung besser zu deinen Daten passen könnte.

In Minitab kannst du dafür einfach statt der „Weibull-Verteilung“ die Option „Dreiparametrige Weibull-Verteilung“ auswählen.

Du wirst sehen, dass nun zusätzlich zum Form- und Lageparameter ein dritter Wert erscheint – der sogenannte Schwellenwert.

Dieser Schwellenwert beschreibt eine ausfallfreie Zeit: Also einen Zeitraum, in dem keine Ausfälle auftreten.

Damit liefert dir die dreiparametrige Weibullverteilung ein Modell, das auch dieses Verhalten erfassen kann.

Allerdings solltest du vorsichtig sein, wenn du die Interpretation vornimmst.

Wenn Minitab beispielsweise einen negativen Schwellenwert berechnet, ist das physikalisch nicht sinnvoll, auch wenn die Daten dadurch rechnerisch besser beschrieben werden.Ein solches Ergebnis deutet häufig auf eine zu kleine Stichprobe hin.

Für die Anwendung der dreiparametrigen Weibull-Verteilung gelten deshalb immer die folgenden Voraussetzungen:

Es gibt eine physikalisch begründbare und statistisch nachvollziehbare ausfallfreie Zeit.

Der Kurvenverlauf in der zweiparametrigen-Weibull-Darstellung ist deutlich konkav.

Und du hast einen ausreichend großen Stichprobenumfang.

Wenn du dir unsicher bist, ob all das zutrifft, gilt folgende Faustregel.Greife lieber zur klassischen zweiparametrigen Weibullverteilung.

Sie ist der konservativere Ansatz – und berücksichtigt Ausfälle bereits ab dem Zeitpunkt t gleich null.

## Folie 19: Sonderfälle Video 13

- section_id: section_019
- source_local_slide_numbers: 19
- spoken_text_sha256: ca371dd7baa7c6bbdd4483e6837efa2eebbc244d9ddbdee75d0afc63b2949be9

### Gesprochener Text

Ein weiterer wichtiger Fall wird deutlich, wenn wir uns folgendes Beispiel anschauen:

Angenommen, wir haben eine Liste von Ausfallzeiten und führen damit direkt eine Weibull-Analyse durch.Für alle Ausfälle werden die zugehörigen Ausfallwahrscheinlichkeiten ermittelt und die Daten werden gemeinsam in einer Weibull-Grafik dargestellt.

Dabei erkennen wir schnell:Eine einzige Weibull-Gerade passt nur schlecht zu den vorhandenen Daten.Der Fit ist schlecht und auch die daraus abgeleiteten Prognosen sind ungenau.

Was bedeutet das?Wenn sich die Daten besser durch mehrere Geraden beschreiben lassen, ist das ein deutliches Anzeichen dafür, dass mehrere unterschiedliche Ausfallmechanismen vorliegen.

In solchen Fällen ist es nicht sinnvoll, alle Daten gemeinsam auszuwerten.Stattdessen sollten die Daten nach Ausfallmechanismen getrennt und jeweils separat analysiert werden.

So erhält man für jeden Mechanismus eine eigene Weibull-Verteilung, die eine deutlich präzisere Beschreibung und bessere Prognose ermöglicht.

Also Merke dir:Lassen sich die Daten besser durch mehrere Geraden beschreiben, ist dies ein Anzeichen für unterschiedliche Ausfallmechanismen, die immer getrennt ausgewertet werden müssen.

Zum Abschluss schauen wir uns dazu noch ein konkretes Beispiel an.

