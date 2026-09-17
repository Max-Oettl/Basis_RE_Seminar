# Extracted Source Text

- module_id: RE5
- source_docx: source-materials/basis-seminar/powerpoint-svg/RE5/Text/05_Modul_Testplanung.docx
- source_sha256: 5ebacd9260e6a732d1236a0b5c4aa0871619855ace336c0334dff9691e58099e
- extraction_method: deterministic_ooxml_table_parser
- modul_nummer: 5
- modul_titel: Lebensdauertestplanung und Zuverlässigkeitsnachweis
- abschnitt_nummer: 1
- abschnitt: 1

## Folie 1: Zuverlässigkeitsmanagement

- section_id: section_001
- source_local_slide_numbers: 1
- spoken_text_sha256: 8eab561483a56a36a716785c5c523d1f8bd274574452d85b6ea8367d595f370f

### Gesprochener Text

In diesem Modul beschäftigen wir uns mit der Lebensdauertestplanung und dem Zuverlässigkeitsnachweis.Um dieses Thema einzuordnen, schauen wir uns zuerst an, wie Tests im Gesamtprozess des Zuverlässigkeitsmanagements verankert sind.

Du erinnerst dich: Das Zuverlässigkeitsmanagement besteht aus mehreren Phasen. Wir befinden uns nun in Phase drei: der Zuverlässigkeitserprobung und dem Nachweis. Genau hier spielen Lebensdauertests eine zentrale Rolle.Aber auch in Phase zwei, also in der Schwachstellenanalyse und Zuverlässigkeitsbewertung, werden bereits Tests eingesetzt.

Vielleicht hast du schon von verschiedenen Zuverlässigkeitstests gehört.Zum Beispiel vom Halt-Test – das steht für Highly Accelerated Life Test. Es ist ein hochbeschleunigter Lebensdauertest, mit dem Schwachstellen im Produkt frühzeitig aufgedeckt werden. Er zählt also zu den qualitativen Testmethoden.

Daneben gibt es die sogenannten End-of-Life Tests. Sie dienen dazu, die tatsächliche Zuverlässigkeit zu ermitteln. Diese Tests können ebenfalls beschleunigt durchgeführt werden.Ein weiteres Beispiel ist der Success Run Test. Er wird genutzt, um die Zuverlässigkeit formell nachzuweisen – etwa für eine Produktfreigabe.

Falls dir diese Begriffe noch nicht geläufig sind, ist das kein Problem. Im Laufe des Moduls wirst du die Methoden im Detail noch kennenlernen. Wichtig ist an dieser Stelle nur: Tests lassen sich grundsätzlich in drei Zielsetzungen einteilen.

Erstens die Identifizierung von Risiken – also die Schwachstellenanalyse.

Zweitens die Zuverlässigkeitsmessung. Hierbei wird ermittelt, wie zuverlässig das Produkt tatsächlich ist.

Und drittens der Zuverlässigkeitsnachweis. Dieser ist notwendig, um eine formale Produktfreigabe zu ermöglichen.

Schauen wir uns nun an, wann diese Testmethoden entlang des Produktentwicklungsprozesses eingesetzt werden. Hierzu siehst du zunächst die einzelnen Prozessschritte, angefangen von der Planung über Konzeption, bis hin zum Entwurf, Design und Produktion.

Zusätzlich sind die Prozessschritte des Zuverlässigkeitsmanagements dargestellt.

Qualitative Methoden wie der Halt-Test kommen möglichst früh in der Entwicklung zum Einsatz. Sie dienen dazu, Fehlerursachen und Risiken aufzudecken, damit die Zuverlässigkeit verbessert werden kann – meist durch Designanpassungen.

Quantitative Methoden wie der End-of-Life Tests oder Degradationstests folgen später. Sie werden genutzt, wenn das Produktdesign schon gereift ist, um die tatsächliche Lebensdauer und Zuverlässigkeit zu bestimmen. Man weiß danach also, wie gut das Produkt wirklich ist.

Für den formalen Nachweis können sowohl Success Run Tests als auch quantitative Lebensdauertests eingesetzt werden. Beide Testarten eignen sich, um eine Produktfreigabe abzusichern.

## Folie 2: Planung von Lebensdauerversuchen

- section_id: section_002
- source_local_slide_numbers: 2
- spoken_text_sha256: 1c994bdc7f1a14539a6f13313c1a38c9d936e61c70eb41e43377812939db3e11

### Gesprochener Text

Schauen wir uns in diesem Abschnitt einmal die Planung von Lebensdauerversuchen an.

Die Planung lässt sich grundsätzlich in zwei Bereiche aufteilen: in eine versuchstechnisch-messtechnische Planung und in eine statistische Planung.

Beginnen wir mit der versuchstechnisch-messtechnischen Planung.Hier geht es darum, die praktischen Rahmenbedingungen für den Versuch festzulegen. Dazu gehören die Auswahl geeigneter Prüfstände und Messmittel, die Definition der Belastungen, die Festlegung von Umgebungsbedingungen wie Temperatur oder Feuchtigkeit sowie die Entscheidung über das Prüfobjekt, also welche Bauteile oder Systeme konkret getestet werden sollen.

Ziel dieser Planung ist es, sicherzustellen, dass die Tests unter reproduzierbaren und kontrollierten Bedingungen ablaufen, sodass die Ergebnisse später aussagekräftig sind.

Kommen wir nun zur statistischen Planung.Zuerst muss eine geeignete Teststrategie ausgewählt werden, die zum Ziel des Tests passt.Anschließend stellt sich die Frage, wie viele Prüflinge benötigt werden, wie lange die Prüfdauer sein muss und welche Lastniveaus getestet werden sollen.Ebenfalls wird festgelegt, wie die Stichproben entnommen werden – in der Regel geschieht dies über eine Zufallsstichprobe.

Das Ziel dieser Planung ist es, den Test so aufzubauen, dass Aufwand, Dauer und Kosten zuverlässig abgeschätzt werden können. Dazu müssen alle zuvor genannten statistischen Größen – wie die Anzahl der Prüflinge, die Prüfdauer oder die Lastniveaus – sinnvoll geplant werden. Sie bilden die Grundlage, um Aufwand und Kosten realistisch zu bestimmen.

Für die Auswahl der Teststrategie müssen drei Punkte betrachtet werden.

Erstens die Testart: Dazu zählen Tests bis zum Ausfall, die sogenannten End-of-Life Tests. Tests mit fester Laufzeit ohne Ausfall, die Success Run Tests. Und Tests, die gezielt Verschleißmechanismen berücksichtigen, die sogenannten Degradationstests.

Zweitens der Zensierungstyp – das bedeutet, ob ein Test vollständig unzensiert durchgeführt wird oder ob er zeitlich oder stückzahlmäßig begrenzt ist.

Erinnerst du dich? Von einer Zensierung sprechen wir dann, wenn ein Prüfling den Test zwar verlässt, aber noch funktionsfähig ist. Das heißt: Er ist nicht ausgefallen, sondern wurde nur aus dem Versuch genommen – zum Beispiel, weil die vorgesehene Testzeit abgelaufen ist.

Und drittens die Beschleunigungsart – also die Entscheidung, ob es sich um unbeschleunigte oder beschleunigte Tests handelt.

Zu Auswahl der Teststrategie kann folgendes Schema helfen.

Wir starten mit der Testart. In diesem Modul betrachten wir nur zwei Varianten: den End-of-Life Test und den Success Run Test.Wenn du mehr über Degradationstests – also Tests mit Verschleißausfällen – erfahren möchtest, dann findest du diese im Experten-Training zum Thema Testplanung.

Im nächsten Schritt unterscheiden wir nach dem Testtyp.Ein End-of-Life Test kann vollständig durchgeführt werden, also bis alle Prüflinge ausgefallen sind. Oder er kann zensiert sein – das bedeutet, der Test wird vorzeitig beendet, obwohl noch nicht alle Prüflinge ausgefallen sind.

Beim Success Run Test gilt die Definition, dass kein Prüfling ausfallen darf.Hier macht die Unterscheidung zwischen vollständigen und zensierten Tests keinen Sinn, weil es im Prinzip immer nur eine Form der Zensierung gibt: Der Test endet nach einer festgelegten Laufzeit, solange kein Prüfling ausgefallen ist.

Im Anschluss betrachten wir die Beschleunigungsart.Ein Test kann unbeschleunigt durchgeführt werden, also unter normalen Einsatzbedingungen.Oder er wird beschleunigt, zum Beispiel durch höhere Belastungen wie Temperatur, Spannung oder durch eine erhöhte Anzahl von Lastzyklen. Je nach Testart kommen hier unterschiedliche Beschleunigungsarten zum Einsatz. Diese wirst du noch im Laufe dieses Moduls kennenlernen.

Aus diesen Kombinationen ergeben sich verschiedene Teststrategien – vom klassischen End-of-Life Test über beschleunigte Varianten bis hin zum Success Run Test.

Ganz unten in der Grafik siehst du die Testkonfiguration.Damit sind die konkreten Testrandbedingungen gemeint, die für die Durchführung festgelegt werden. Dies hast du ja schon bereits zuvor gelernt.Dazu gehören zum Beispiel die Prüflingsanzahl, die gewählten Lastniveaus, die Prüfdauer und auch der genaue Ablauf des Tests.Diese Rahmenbedingungen sorgen dafür, dass ein Test reproduzierbar, aussagekräftig und statistisch korrekt durchgeführt werden kann.

Damit haben wir gesehen: die Planung von Lebensdauerversuchen umfasst sowohl praktische als auch statistische Aspekte. Nur durch das Zusammenspiel beider Bereiche lassen sich Tests aufbauen, die einerseits realistisch sind und andererseits zuverlässige, statistisch abgesicherte Ergebnisse liefern.

## Folie 3: Zuverlässigkeitsnachweis

- section_id: section_003
- source_local_slide_numbers: 3
- spoken_text_sha256: ffbcccdc0414be12d9611d7d13fdc9112534197fdf265060f0f65b5d2c2c5263

### Gesprochener Text

Schauen wir uns nun genauer an, was wir eigentlich unter einem Zuverlässigkeitsnachweis verstehen.Im Grunde ist es ganz einfach: Wir müssen zeigen, dass die Zuverlässigkeit unseres Produktes höher ist als die geforderte. Doch wie gelingt uns das?Am besten lässt sich das mit Hilfe des Weibull-Diagramms erklären. Zuvor schauen wir uns aber noch einmal eine Wiederholung zu den Vertrauensbereichen an.

Wenn wir Lebensdauerdaten auswerten, erhalten wir eine Weibull-Verteilung. Da diese Daten nur eine Stichprobe darstellen, brauchen wir zusätzlich den Vertrauensbereich, um Aussagen über die Grundgesamtheit treffen zu können. Das haben wir ja bereits im Modul Lebensdauerdatenanalyse gelernt.

Der Vertrauensbereich wird durch zwei Vertrauensgrenzen definiert. Sie geben den Bereich an, in dem sich die wahre Weibull-Verteilung mit einer bestimmten Wahrscheinlichkeit befindet.Ein neunzig-Prozent-Vertrauensbereich bedeutet, dass die wahre Verteilung mit einer Wahrscheinlichkeit von neunzig Prozent innerhalb dieser Grenzen liegt.

Eine fünfundneunzig-Prozent-Vertrauensgrenze bedeutet, dass die wahre Weibullverteilung mit einer Wahrscheinlichkeit von fünfundneunzig Prozent rechts von dieser Grenze liegt – also im Bereich höherer Lebensdauern.

Diese Information ist wichtig, um zu verstehen, wie wir eine Zuverlässigkeitsanforderung definieren und diese auch anschließend nachweisen können.Eine typische Anforderung besteht dabei aus drei Parametern: einer Zeit, einer geforderten Zuverlässigkeit beziehungsweise einer Ausfallwahrscheinlichkeit und einer Aussagesicherheit.Ein Beispiel: Wir wollen nachweisen, dass unser Produkt für eine Lebensdauer von zehn hoch sechs Lastwechseln eine Zuverlässigkeit von neunzig Prozent erreicht – also eine Ausfallwahrscheinlichkeit von zehn Prozent – und das mit einer Aussagesicherheit von fünfundneunzig Prozent.

Diesen Punkt können wir als Anforderung in das Weibull-Diagramm eintragen.Unabhängig davon, wie gut unser Produkt tatsächlich ist, bleibt dieser Punkt zunächst als Ziel definiert.Haben wir Lebensdauerdaten, zum Beispiel aus einem Test, vorliegen, können wir eine Weibull-Analyse durchführen. Auf diese Weise erhalten wir die Weibullgerade und den gewünschten Vertrauensbereich entsprechend der geforderten Aussagesicherheit. Die Lage dieser Beiden hängt von den ermittelten Weibullparametern und von der Stichprobengröße ab.

Nun prüfen wir, ob die obere Vertrauensgrenze rechts von unserem Ziel, also dem nachzuweisenden Punkt liegt.Ist das der Fall, dann haben wir die Anforderung erfüllt.Liegt die obere Vertrauensgrenze hingegen links vom Zielpunkt, dann können wir die Anforderung nicht erfüllen.

In diesem Fall können wir nur Folgendes nachweisen:

Erstens – eine geringere Zuverlässigkeit beziehungsweise eine höhere Ausfallwahrscheinlichkeit unter gleicher Lebensdauer. Wir können zum Beispiel nur dreiundachtzig Prozent Zuverlässigkeit beziehungsweise siebzehn Prozent Ausfallwahrscheinlichkeit nachweisen.

Zweitens – eine geringere Lebensdauer unter gleicher Zuverlässigkeit. Wir können hier bei einer Zuverlässigkeit von neunzig Prozent nur eine Lebensdauer von sechs mal zehn hoch fünf Lastwechseln nachweisen.

Oder drittens – wir können das Ziel nur mit einer geringeren Aussagesicherheit bestätigen. In diesem Fall zum Beispiel nur mit einer Aussagesicherheit von siebzig Prozent.

Zum Schluss noch ein wichtiger Hinweis: Die Breite des Vertrauensbereiches hängt stark von der Stichprobengröße ab. Je mehr Prüflinge wir also testen, desto schmaler wird der Vertrauensbereich. Dadurch steigen die Chancen, das Ziel auch wirklich nachweisen zu können.

Dies gelingt aber natürlich nur dann, wenn die Zuverlässigkeit unseres Produktes ohnehin besser ist als die geforderte.

## Folie 4: Herleitung Success Run

- section_id: section_004
- source_local_slide_numbers: 4
- spoken_text_sha256: c11725f55b372fbab4444fdc666b6c8bf889083ad842d91859216e2f9bc81fad

### Gesprochener Text

Das Ziel eines Success Run Tests ist es, nachzuweisen, dass die geforderte Zuverlässigkeit erfüllt ist.

Die Anforderung kann zum Beispiel so aussehen: Eine Mindestzuverlässigkeit von neunzig Prozent bei einer Lebensdauer von zweihunderttausend Kilometern. Das entspricht einer B-zehn Lebensdauer von zweihunderttausend Kilometern.

Zusätzlich wird ein Vertrauensniveau festgelegt – etwa fünfundneunzig Prozent – mit dem die Anforderung nachgewiesen werden soll.

Wenn wir die Weibullverteilung samt Vertrauensbereich unseres Produktes kennen, können wir direkt prüfen, ob wir das Ziel erfüllt haben. Wir schauen also, ob der nachzuweisende Punkt links von der jeweiligen Vertrauensgrenze liegt. Das hast du ja bereits zuvor schon gelernt.

Beim Success Run Test gibt es jedoch eine Besonderheit. Hier wird nur bis zur geforderten Lebensdauer getestet. Und während des Testlaufs darf kein einziger Prüfling ausfallen.

Darum spricht man auch von einem Erfolgslauf oder Success Run.

Die Problematik liegt auf der Hand: Wenn kein Ausfall auftritt, können wir keine Weibullgerade berechnen und auch keinen Vertrauensbereich ableiten. Wir wissen also nicht, wie unsere Anforderung zur wahren Zuverlässigkeit des Produktes liegt.

Wie können wir aber trotzdem einen Nachweis führen?

Die Lösung liegt in der Statistik, genauer in der Binomialverteilung.

Stellen wir uns n identische Prüflinge mit der Zuverlässigkeit R von t vor.

Die Wahrscheinlichkeit, dass alle n Prüflinge bis zur Zeit t überleben, ergibt sich nach dem Produktgesetz der Wahrscheinlichkeiten zu R von t hoch n.

Und genau das ist die zentrale Idee hinter dem Success Run Test:

Die Überlebenswahrscheinlichkeit der gesamten Prüflingsgruppe ergibt sich als Produkt der Überlebenswahrscheinlichkeiten der einzelnen Prüflinge.

Du fragst dich bestimmt, wie wir nun diese Information für den Nachweis nutzen können?

Um das zu beantworten, betrachten wir die Irrtumswahrscheinlichkeit Alpha.

Alpha beschreibt die Wahrscheinlichkeit, dass die geforderte Zuverlässigkeit in Wirklichkeit nicht erfüllt ist, wir den Test aber zufällig trotzdem ohne Ausfälle bestehen.

Die Irrtumswahrscheinlichkeit Alpha ist daher gleich der Überlebenswahrscheinlichkeit der Prüflingsgruppe – also R von t hoch n.

Aber warum ist das so?

Ganz einfach: Weil Alpha genau den Fall beschreibt, dass das Produkt schlechter ist als gefordert, wir aber durch Zufall eine Stichprobe erwischt haben, bei der alle Prüflinge die Testzeit überstehen.

Damit gilt: Alpha gleich R von t hoch n.

Die Aussagesicherheit ist das Gegenstück zur Irrtumswahrscheinlichkeit.

Sie gibt an, mit welcher Wahrscheinlichkeit wir mit unserem Test wirklich korrekt nachweisen, dass die geforderte Zuverlässigkeit erfüllt ist.

Sie berechnet sich demnach zu eins minus Alpha.

Setzen wir nun für Alpha R von t hoch n ein, erhalten wir die Success Run Gleichung.

Diese zeigt uns, wie viele Prüflinge n wir ohne Ausfall testen müssen, um mit einer bestimmten Aussagesicherheit P A eine geforderte Zuverlässigkeit R zum Zeitpunkt t nachweisen zu können.

Damit hast du das Grundprinzip der Success Run Gleichung verstanden: Auch ohne Ausfälle können wir ihrer Hilfe einen formalen Zuverlässigkeitsnachweis führen.

Falls dir die Herleitung etwas abstrakt vorkam, mach dir keine Sorgen. Wichtig ist vor allem, dass du die Gleichung anwenden kannst – und das ist wirklich einfach.

Außerdem lässt sich die Gleichung je nach Fragestellung umstellen. Man kann damit zum Beispiel den erforderlichen Stichprobenumfang berechnen.Dies schauen wir uns im Folgenden anhand eines Beispiels einmal genauer an.

## Folie 5: Beispiel Success Run Gleichung

- section_id: section_005
- source_local_slide_numbers: 5
- spoken_text_sha256: 9457bafb88a3568908f0c76ecfbd03d99ad989547820a0fa712e9e67a758f199

### Gesprochener Text

In diesem Beispiel geht es darum, wie wir den erforderlichen Stichprobenumfang für einen Nachweis mit Hilfe des Success Run Tests bestimmen können.

Im Lastenheft für ein Fahrzeuggetriebe ist folgende Forderung festgelegt:Die B-zehn Lebensdauer soll mindestens zweihundertfünfzigtausend Kilometer betragen.Zusätzlich ist eine Aussagesicherheit von fünfundneunzig Prozent gefordert.

Gesucht ist also die erforderliche Anzahl an Prüflingen, in diesem Fall also die Anzahl an Getrieben, die ohne Ausfall getestet werden müssen.

Die Berechnung erfolgt mit Hilfe der Success Run Gleichung.Hierbei gilt: Die Aussagesicherheit P A ist gleich eins minus der Zuverlässigkeit R von t hoch n.Nun stellen wir die Gleichung nach der Stichprobengröße n um.

Damit ergibt sich:n ist gleich dem natürlichen Logarithmus von eins minus P A, geteilt durch den natürlichen Logarithmus der Zuverlässigkeit R.

Setzen wir die geforderten Werte ein, erhalten wir:n ist gleich dem Logarithmus von eins minus null Komma neun fünf, geteilt durch den Logarithmus von null Komma neun.Das ergibt rund achtundzwanzig Komma vier drei.

Da die Anzahl der Prüflinge eine ganze Zahl sein muss, und wir auf der sicheren Seite sein wollen, runden wir auf.Das bedeutet: Um den Nachweis zu erfüllen, benötigen wir neunundzwanzig Prüflinge, die ohne Ausfall bis zur geforderten Lebensdauer getestet werden müssen.

Haben wir dies erreicht, können wir das Zuverlässigkeitsziel von neunzig Prozent bei zweihundertfünfzigtausend Kilometern mit einer Aussagesicherheit von fünfundneunzig Prozent nachweisen.

Schauen wir uns nun einige Beispiele für erforderliche Stichprobengrößen in Abhängigkeit von der geforderten Aussagesicherheit P A und der Zuverlässigkeit R an.

Die Tabelle zeigt verschiedene Kombinationen.Nehmen wir zum Beispiel eine geforderte Aussagesicherheit von neunzig Prozent und eine Zuverlässigkeit von neunzig Prozent. In diesem Fall benötigen wir zweiundzwanzig Prüflinge.Steigern wir die Zuverlässigkeit auf fünfundneunzig Prozent bei gleicher Aussagesicherheit. Nun steigt die erforderliche Stichprobengröße bereits auf fünfundvierzig Prüflinge.

Noch deutlicher wird der Effekt bei sehr hohen Anforderungen.Wenn wir eine Aussagesicherheit von fünfundneunzig Prozent und eine Zuverlässigkeit von ebenfalls fünfundneunzig Prozent fordern, benötigen wir schon neunundfünfzig Prüflinge.

Erhöhen wir nun noch die geforderte Zuverlässigkeit auf neunundneunzig Prozent, steigt die Zahl sogar auf zweihundertneunundneunzig Prüflinge.

Diese Beispiele zeigen klar: Je höher die geforderte Zuverlässigkeit und je höher die Aussagesicherheit, desto mehr Prüflinge werden benötigt.In der Praxis ist das oft eine große Herausforderung, da so viele Prüflinge je nach Produkt nicht immer zur Verfügung stehen oder die Kosten dafür zu hoch wären.

Darum ist es wichtig, schon früh im Projekt die Anforderungen realistisch zu definieren und die Teststrategie darauf abzustimmen.

Nun schauen wir uns das Zusammenspiel der einzelnen Parameter in der Success Run Gleichung noch einmal grafisch an.Dieses Diagramm zeigt die Mindestzuverlässigkeit in Abhängigkeit vom Stichprobenumfang, jeweils für verschiedene Aussagesicherheiten.

Wichtig dabei: Bis zum Zeitpunkt t darf kein einziger Ausfall auftreten.

Wir sehen die Kurven für Aussagesicherheiten von achtzig, neunzig und fünfundneunzig Prozent.Mit zunehmender Stichprobengröße steigt die Zuverlässigkeit, die wir nachweisen können.

Ein Beispiel: Angenommen, wir möchten eine Mindestzuverlässigkeit von neunzig Prozent nachweisen.Bei einer Aussagesicherheit von fünfundneunzig Prozent benötigen wir dafür rund neunundzwanzig Prüflinge.Bei einer Aussagesicherheit von neunzig Prozent reichen hingegen bereits etwa zweiundzwanzig Prüflinge aus.

Diese Werte findest du exakt so auch in der vorherigen Tabelle wieder.Das Diagramm macht den Zusammenhang zwischen Prüflingsanzahl, geforderter Mindestzuverlässigkeit und gewünschter Aussagesicherheit noch einmal anschaulich sichtbar.

## Folie 6: Berücksichtigung unterschiedlicher Prüfzeiten

- section_id: section_006
- source_local_slide_numbers: 6
- spoken_text_sha256: 6842ae1237c041f911c3eff71291bc2c73910b2738bdc9c9f79f7a3058643a47

### Gesprochener Text

Im nächsten Schritt betrachten wir den Einfluss unterschiedlicher Prüfzeiten auf den Success Run Test.Die zentrale Frage lautet: Wie wirkt sich eine Verlängerung oder Verkürzung der Testzeit auf den erforderlichen Stichprobenumfang aus?

Hierzu definieren wir zunächst die Prüfdauer t p und die geforderte Lebensdauer t.Wenn wir genau bis zur geforderten Lebensdauer t prüfen, also wenn te p gleich t ist, dann gilt die Success Run Gleichung so, wie wir sie bisher hergeleitet haben.

In der Praxis ist das aber selten der Fall. Oft weicht die Prüfdauer von der geforderten Lebensdauer ab – wir prüfen also entweder kürzer oder länger.Aber können wir dann einfach dieselbe Gleichung benutzen? Nein. Die ursprüngliche Gleichung gilt nur dann, wenn Prüfzeit und geforderte Lebensdauer identisch sind. Sobald sich die Prüfzeit ändert, verändert sich auch die Überlebenswahrscheinlichkeit.

Um diesen Effekt korrekt zu berücksichtigen, führen wir das sogenannte Lebensdauerverhältnis ein.Es beschreibt das Verhältnis zwischen der tatsächlichen Prüfdauer und der geforderten Lebensdauer:L v ist gleich t p geteilt durch t.

Aber warum brauchen wir dieses Verhältnis?

Die Überlebenswahrscheinlichkeit einer Komponente steigt nicht gleichmäßig mit der Zeit, sondern hängt vom Verlauf der Lebensdauerverteilung ab.

Hier kommt die Weibullverteilung ins Spiel. Sie beschreibt, wie stark die Wahrscheinlichkeit eines Ausfalls mit der Zeit zunimmt.

Der entscheidende Parameter ist der Formparameter b. Er bestimmt die Steigung der Kurve:Ist b größer als eins, steigen die Ausfallraten mit der Zeit überproportional an. Ist b gleich eins, liegt ein konstanter Ausfallprozess vor, ähnlich wie bei der Exponentialverteilung.

Das bedeutet: Wenn wir wissen wollen, wie sich die Überlebenswahrscheinlichkeit zwischen zwei verschiedenen Zeiten verändert, müssen wir die beiden Werte ins Verhältnis setzen.Genauer gesagt betrachten wir das Verhältnis der logarithmierten Überlebenswahrscheinlichkeiten zum Zeitpunkt der Prüfdauer und der geforderten Lebensdauer.Mathematisch lässt sich zeigen, dass dieses Verhältnis über L v hoch b beschrieben wird.

Es hängt also genau vom Lebensdauerverhältnis ab.

Damit haben wir die Brücke geschlagen:Das Lebensdauerverhältnis korrigiert die Success Run Gleichung, wenn die Prüfzeit nicht exakt der geforderten Lebensdauer entspricht.Statt R von t gleich eins minus P A hoch eins geteilt durch n gilt nun:R von t gleich eins minus P A hoch eins geteilt durch L v hoch b mal n.

Was heißt das praktisch?Wenn wir länger prüfen, also wenn t p größer als t ist, dann ist das Lebensdauerverhältnis größer als eins.Schauen wir in die Gleichung, sehen wir sofort: Wir brauchen weniger Prüflinge, um dieselbe Zuverlässigkeit nachzuweisen.Das ist auch logisch – die Prüflinge müssen länger durchhalten, die Bedingung ist strenger, und damit steigt die Aussagekraft jedes einzelnen Prüflings.

Prüfen wir kürzer, also t p kleiner als t, dann ist das Lebensdauerverhältnis kleiner als eins.Die Bedingung ist schwächer, und um dieselbe Aussagesicherheit zu erreichen, brauchen wir nun mehr Prüflinge.

Das Fazit ist einfach: Mit Hilfe des Lebensdauerverhältnisses können wir die Success Run Gleichung so erweitern, dass sie auch für Prüfzeiten gilt, die länger oder kürzer als die geforderte Lebensdauer sind.

Ein Nachteil bleibt jedoch: In die Berechnung geht der Formparameter b der Weibullverteilung ein.Und da wir im Success Run Test keine Lebensdauerverteilung bestimmen können – weil keine Ausfälle auftreten – müssen wir den Formparameter anderweitig abschätzen.Das kann zum Beispiel durch Erfahrungen mit Vorgängerprodukten oder durch Vorversuche erfolgen.Auch das ist logisch: Wenn wir die Steigung der Weibullgeraden nicht kennen, können wir auch nicht beurteilen, wie stark sich eine Änderung der Prüfzeit auf die Zuverlässigkeit beziehungsweise Ausfallwahrscheinlichkeit auswirkt.

## Folie 8: Planung des End-of-Life Tests

- section_id: section_007
- source_local_slide_numbers: 8
- spoken_text_sha256: c86f6d379e61e942fbaa30562e15302ec39861b74fc4891e89d8cadf41ab2b12

### Gesprochener Text

Kommen wir nun zum End-of-Life-Test. Wie der Name sagt, prüfen wir bis zum Ausfall, also bis zum Ende der Lebensdauer. Die dabei entstehenden Lebensdauerdaten werten wir aus und bestimmen die Weibullverteilung. Anschließend prüfen wir, ob die geforderte Zuverlässigkeit mit der gewünschten Aussagesicherheit erreicht wird. Dieses Vorgehen kennst du ja bereits: Zeit und Zielzuverlässigkeit festlegen, Daten erfassen, die Weibullgerade mit Vertrauensbereich ermitteln und den Nachweispunkt bewerten.

In der Realität sind Tests bis zum Ausfall oft sehr langwierig. Denke an einen Wechselrichter für Solaranlagen: Solche Geräte sind auf Lebensdauern von deutlich über zwanzig Jahren ausgelegt. So lange können wir nicht warten, um die Zuverlässigkeit in der Entwicklung nachzuweisen. Weil reale Einsatzzeiten häufig sehr lang sind, ist eine Erprobung unter Feldbelastung kaum praktikabel. Genau hier kommt die beschleunigte Erprobung ins Spiel.

Das Grundprinzip basiert darauf, dass die Schädigung pro Zeiteinheit im Versuch höher ist als im Feldeinsatz. Dadurch verkürzt sich die beobachtete Lebensdauer. Beschleunigte Tests sparen so Zeit und Kosten, erlauben frühere Aussagen im Entwicklungsprozess und machen den Zusammenhang zwischen Belastung und Lebensdauer sichtbar. Zusätzlich helfen sie, die Streuung durch unterschiedliche Nutzungsprofile besser zu verstehen und gezielt abzusichern.

Schauen wir uns einmal die unterschiedlichen Arten der Beschleunigung von Lebensdauertests an.

Als Erstes sollte immer eine zeitliche Raffung in Betracht gezogen werden: Wir beschleunigen, indem wir Belastungen schneller aufbringen, Drehzahlen oder Schaltfrequenzen erhöhen und Standzeiten reduzieren.

Zweitens kann über ein höheres Belastungsniveau beschleunigt werden – zum Beispiel durch erhöhte Temperaturen, elektrische oder mechanische Spannungen, stärkere Temperaturwechsel, Feuchte oder Vibration. Hierbei ist es wichtig, den maßgeblichen Schädigungsparameter zu kennen. Auf typische Stolpersteine gehen wir später noch ein.

Drittens gibt es zensierte Tests. Das ist streng genommen keine physikalische Beschleunigung: Die Prüfung endet vor Erreichen aller Ausfälle nach einer vorgegebenen Zeit oder Stückzahl und spart dadurch Testzeit.

Viertens sind Degradationstests möglich: Wir messen den Verlauf eines Degradationsmerkmals, zum Beispiel die Dicke eines Bremsbelags, beschreiben diesen Verlauf mit einem Modell und extrapolieren ihn in die Zukunft. Über einen festgelegten Grenzwert – das sogenannte End-of-Life-Kriterium – bestimmen wir daraus einen Ausfallzeitpunkt mit ausgewiesener Unsicherheit. Wiederholen wir dieses Vorgehen für mehrere Prüflinge, erhalten wir eine Menge geschätzter Ausfallzeitpunkte, aus denen sich die Lebensdauerverteilung und damit die Lebensdauer ableiten lässt. Wenn du hierzu mehr erfahren möchtest, besuche gern unser Experten-Training zur Testplanung.

Wichtig ist, dass nicht jede Beschleunigungsart immer für jedes Produkt geeignet ist. Entscheidend ist immer der Ausfallmechanismus. Bei Bedarf lassen sich aber auch mehrere Ansätze kombinieren.

Bei der Beschleunigung über ein höheres Belastungsniveau ist die Schädigung pro Zeiteinheit im Versuch höher als im Feldeinsatz. Entsprechend fällt die beobachtete Lebensdauer im Versuch kürzer aus. Um beide Ergebnisse miteinander vergleichen zu können, benötigen wir den sogenannten Raffungsfaktor. Er wird formal als Verhältnis von Feldlebensdauer zu Versuchslebensdauer definiert und beschreibt, wie stark die Zeit im Versuch gegenüber dem Feldeinsatz ‚zusammengedrückt‘ wird.

Anschaulich verschiebt dieser Faktor die Weibullverteilung im Diagramm nach links: Ausfälle treten früher auf, wir sparen Prüfzeit und können bei bekanntem Raffungsfaktor dennoch auf das Feld schließen. Wichtig: Die Übertragbarkeit ist nur gegeben, wenn der Ausfallmechanismus gleichbleibt und der Formparameter – also die Steigung im Weibull-Diagramm – in Versuch und Feld identisch ist.

Aber woher kommt der Raffungsfaktor eigentlich? Die Grundlage jeder belastungsbeschleunigten Erprobung ist die Last-Lebensdauer-Korrelation. Wir beschreiben, wie die Lebensdauer mit der Belastung zusammenhängt – physikalisch begründet oder datengetrieben. Typische Modelle sind das Wöhler-Modell für strukturmechanischen Ermüdungsschaden, Arrhenius für temperaturgetriebene Prozesse oder inverse Potenzgesetze für elektro-mechanische Spannungen. Aus solchen Zusammenhängen leiten wir den Faktor ab, der Versuchsdauer und Feldbedingungen verknüpft, und validieren ihn an realen Daten. Dafür müssen wir die relevante Schädigungsgröße kennen und mit einem geeigneten Modell abbilden. Gibt es kein tragfähiges Modell oder keinen belastbaren Raffungsfaktor, ergibt eine beschleunigte Erprobung keinen Sinn, weil die Ergebnisse nicht sicher auf das Feld übertragen werden können.

Zum Schluss noch einmal kurz zusammengefasst:

End-of-Life-Tests liefern die Basis über die Weibullanalyse. Beschleunigte Erprobung macht Nachweise zeit- und kosteneffizient, setzt aber zwingend voraus, dass der Ausfallmechanismus erhalten bleibt und der Raffungsfaktor belastbar bekannt ist. Nur dann ist die Übertragung auf den Feldeinsatz zuverlässig.

## Folie 9: Herausforderungen bei beschleunigter Erprobung (ALT)

- section_id: section_008
- source_local_slide_numbers: 9
- spoken_text_sha256: 01bcd2169486406d9bd70489411d6046523daa849051bf94a8b49f69ed05ac86

### Gesprochener Text

Nachdem wir die Grundlagen zur beschleunigten Erprobung und den Raffungsfaktor kennengelernt haben, schauen wir uns nun an, wie man in der Praxis eine beschleunigte Lebensdauerprüfung plant. Die Basis dafür ist wieder die Last-Lebensdauer-Korrelation. Sie beschreibt, wie sich die Lebensdauer in Abhängigkeit von der Belastung verändert. Dabei gilt: Je stärker die Belastung, desto schneller schreitet der Schädigungsprozess voran – und desto kürzer ist die Lebensdauer. Genau diesen Zusammenhang müssen wir durch geeignete Modelle oder Daten erfassen.

Damit verbunden stellen sich bei einer beschleunigten Erprobung mehrere praktische Fragen:

Zum einen möchten wir wissen, wie viele Versuchsniveaus wir überhaupt anfahren müssen.

Dazu ist auch entscheidend, welche Lage diese Niveaus haben sollen – also wie hoch oder niedrig müssen die Belastungen gewählt werden.

Außerdem ist auch noch relevant, wie viele Prüflinge pro Niveau und insgesamt getestet werden müssen.

Diese Fragen entscheiden maßgeblich über Aufwand, Kosten und Aussagekraft eines beschleunigten Tests.

Schauen wir uns zunächst die Frage nach der Anzahl der Versuchsniveaus an. Wenn wir nur zwei Niveaus prüfen, können wir nur einen linearen Zusammenhang zwischen Belastung und Lebensdauer abbilden. Bestehen Zweifel daran, dass die Beziehung wirklich linear ist, empfiehlt es sich, ein drittes Niveau hinzuzunehmen. Damit lässt sich die Krümmung des Zusammenhangs erfassen und die Prognose für das Feld zuverlässiger machen.

Als nächstes schauen wir uns die Lage der Versuchsniveaus an. Für das obere Versuchsniveau gilt: Wir wählen es so hoch wie möglich, um eine maximale Raffung zu erzielen – allerdings ohne dabei den Ausfallmechanismus zu verändern. Das ist entscheidend, denn sonst wäre das Ergebnis nicht mehr auf das Feld übertragbar. In der Regel braucht man dazu Vorversuche, um die maximal mögliche Beschleunigung abzuschätzen. Das untere Versuchsniveau ist dagegen ein Kompromiss: Es sollte möglichst nah am Feldniveau liegen, um eine hohe Prognosegüte zu erreichen. Gleichzeitig darf die Laufzeit aber nicht so lang sein, dass der Test praktisch nicht mehr durchführbar ist. Je nachdem, ob man den Schwerpunkt stärker auf Kosten oder Genauigkeit legt, kann das untere Niveau näher am Feld oder näher am oberen Niveau gewählt werden. In der Praxis haben sich Raffungsfaktoren im Bereich von zwei bis drei bewährt – höhere Werte führen häufig zu einer zu großen Streuung.

Damit sind wir bei der nächsten Frage angelangt: Wie viele Prüflinge pro Niveau werden benötigt? Auch hier gilt: Je mehr Prüflinge, desto genauer die Schätzung – aber desto höher auch die Kosten. Die Kunst liegt darin, eine ausreichende Anzahl an Prüflingen zu wählen, die statistisch belastbare Ergebnisse liefert, ohne das Testbudget zu sprengen. Die Idee dahinter: Ein Teil der Prüflinge läuft auf dem oberen Niveau, ein anderer Teil auf dem unteren Niveau.

Um diese Verteilung zu bestimmen, hilft der sogenannte Extrapolationsfaktor. Mit ihm kann berechnet werden, welcher Anteil der Prüflinge auf welchem Lastniveau getestet werden sollte. Die Berechnung erfolgt in zwei Schritten:

Zunächst bestimmen wir den Extrapolationsfaktor aus den Abständen der Niveaus mithilfe der folgenden Gleichung.

Dabei stellt x eins das obere und x zwei das untere Versuchsniveau sowie x null das Feldniveau dar.

Anschließend wird der Anteil p der Prüflinge auf dem unteren Versuchsniveau x zwei berechnet. Hierzu kann diese Formel genutzt werden.

Mit diesem Anteil wissen wir nun, wie viele Prüflinge vom Gesamtbudget auf dem unteren Niveau getestet werden sollten.

Generell gilt: Auf dem unteren Versuchsniveau müssen immer mehr Prüflinge getestet werden als auf dem höheren. Der Grund ist, dass durch die höhere Anzahl an Prüflingen die Streuung beim unteren Niveau reduziert wird. Diese bessere statistische Basis ist nötig, um eine genauere Extrapolation auf das Feldniveau zu ermöglichen.

Schauen wir uns hierzu noch kurz ein Beispiel an:

Eine Isolierung soll auf Lebensdauer geprüft werden. Wir haben ein Testbudget von zwanzig Prüflingen.

Die Temperatur auf Feldniveau beträgt einhundertachtzig Grad Celsius. Für das obere Versuchsniveau ergibt sich zweihundertsechzig Grad und beim unteren Niveau zweihundertzwanzig Grad Celsius. Zuerst berechnen wir den Extrapolationsfaktor nach der vorherigen Gleichung zu: zweihundertsechzig minus einhundertachtzig, geteilt durch zweihundertsechzig minus zweihundertzwanzig. Es ergibt sich ein Wert von zwei.

Setzen wir diesen nun in die zweite Gleichung ein, ergibt sich p zu zwei, geteilt durch zwei mal zwei minus eins, was rund siebenundsechzig Prozent ergibt.

Das bedeutet: rund zwei Drittel der Prüflinge müssen auf dem unteren Versuchsniveau getestet werden. Bei einem Gesamtbudget von zwanzig Prüflingen sind das vierzehn Prüflinge, während die restlichen sechs Prüflinge auf dem oberen Niveau getestet werden.

Nachdem wir nun geklärt haben, wie viele Versuchsniveaus sinnvoll sind, wo diese liegen sollten und wie die Prüflingsverteilung pro Niveau berechnet wird, bleibt noch die letzte Frage: Wie viele Prüflinge werden insgesamt benötigt?

Entscheidend ist, dass wir eine ausreichende statistische Basis schaffen, um die Lebensdauer mit der gewünschten Genauigkeit prognostizieren zu können. Zu wenige Prüflinge führen zu großen Unsicherheiten, zu viele treiben die Kosten unnötig in die Höhe.

Um hier die richtige Balance zu finden, nutzen wir die Monte-Carlo-Simulation. Mit ihr können wir durch viele zufällige Simulationsdurchläufe den Einfluss der Prüflingsanzahl auf die Genauigkeit der Ergebnisse bewerten. So lässt sich ableiten, wie stark die Prognose des Feldniveaus von der Stichprobengröße abhängt.

Am Ende können wir damit die Gesamtzahl der Prüflinge festlegen – genauso viele, dass die Prognosequalität ausreichend hoch ist das Ziel zu erreichen, jedoch ohne Ressourcen zu verschwenden. Da dieser Schritt etwas komplexer ist, behandeln wir ihn ebenfalls erst im Experten Training zum Thema Testplanung.

Du hast nun gelernt, wie sich die gesamte Planung eines beschleunigten Lebensdauertests – von der Anzahl der Versuchsniveaus über deren Lage bis hin zur Verteilung und Gesamtzahl der Prüflinge – zielgerichtet und effizient gestalten lässt.

## Folie 10: Vergleich der Teststrategien

- section_id: section_009
- source_local_slide_numbers: 10
- spoken_text_sha256: ca7a506eb65a37ed86a521d54de53496e987018e7680da68936c6612e47ed5cd

### Gesprochener Text

Schauen wir uns zum Abschluss noch einmal die unterschiedlichen Teststrategien im Vergleich genauer an.

Der Success-Run Test ist eine ausfallfreie Teststrategie. Wir prüfen bis zu einer vorgegebenen Zeit, Ausfälle sind nicht erlaubt.

Das macht diese Strategie besonders effizient auf Systemebene, wenn schnelle Freigabeentscheidungen gefragt sind. Dieser Test wird unter repräsentativen Betriebsbelastungen durchgeführt. Wir testen also genau die Einsatzbedingungen, für die wir freigeben wollen. Das Ergebnis ist ein formaler Nachweis der Mindestzuverlässigkeit bei einer definierten Aussagesicherheit. Wichtig: Wir erhalten keine Informationen zum Ausfallverhalten oder zur Verteilungsform. Das Resultat lautet schlicht „bestanden ohne Ausfall“ oder nicht.

Der End-of-Life Test ist ausfallbasiert: Wir testen bis zum Ausfall und gewinnen echte Lebensdauerdaten. Er lässt sich sowohl auf Komponenten- als auch auf Systemebene einsetzen. Auch hier arbeiten wir mit repräsentativen Betriebsbelastungen, damit die Ergebnisse direkt für den Feldbetrieb gelten. Ausgewertet wird per Weibull-Analyse. Wir erhalten die Parameter der Verteilung samt Vertrauensbereichen und können daraus belastbare Lebensdauerkennwerte wie die B-zehn-Lebensdauer und die Zuverlässigkeit über der Zeit ableiten.

Der Accelerated Life Test ist ebenfalls ausfallbasiert, aber mit beschleunigenden Lasten. Dadurch ist dieser Test besonders effizient auf Komponentenebene, wo sich Temperatur, Spannung, Frequenz oder Zyklen kontrolliert erhöhen lassen. Da die Lasten gezielt über dem Feldniveau gewählt werden, haben wir eine Raffung durch Lasterhöhung. Das Ziel ist es dadurch schneller zu belastbaren Ausfällen zu kommen.

Wie im End-of-Life Test ist das Resultat ein vollständiges Lebensdauermodell, was unser Ausfallverhalten sowie die Zuverlässigkeit über der Zeit abbildet. Darüber hinaus erhalten wir auch ein Alterungsmodell, das die Beziehung zwischen Last und Lebensdauer beschreibt. Mit diesem lassen sich die Ergebnisse nachvollziehbar auf Feldbedingungen extrapolieren.

Degradationstests sind die richtige Wahl, wenn ein messbarer Verschleißmechanismus vorliegt, etwa Dicken- oder Leistungsverlust oder eine Risslänge. Sie funktionieren auf Komponenten- oder Systemebene und kommen ohne „harten“ Ausfall aus. Dieser Test wird unter repräsentativen Betriebsbelastungen durchgeführt. Ist eine stärkere Raffung gewünscht, können zusätzlich auch Lasten erhöht werden, um Laufzeit zu sparen.

Das Ergebnis ist ein Verschleiß- bzw. Degradationsmodell. Über ein festgelegtes End-of-Life-Kriterium leiten wir daraus Ausfallzeitpunkte ab und erhalten analog zum End of Life Test ein vollständiges Lebensdauermodell, was unser Ausfallverhalten sowie die Zuverlässigkeit über der Zeit beschreibt.

In der Planung ist der Success-Run Test vergleichsweise einfach. Aufwand und Stichprobengröße lassen sich direkt über die Success-Run-Gleichung abschätzen. Abweichungen in der Prüfdauer können über das Lebensdauerverhältnis L “V” berücksichtigt werden. Für typische Nachweise, etwa eine Zuverlässigkeit und Aussagesicherheit von jeweils neunzig Prozent, sind zwar größere Stichproben erforderlich, dafür bleiben die Laufzeiten aber kurz und die Kosten gering. In der Anwendung ist der Success-Run Test nur sinnvoll, wenn eine ausreichende Überdimensionierung vorliegt. Kritische Ziele oder Ausfallmechanismen lassen sich damit nicht nachweisen.

Die Planung des End-of-Life Tests ist deutlich aufwendiger. Es müssen zensierte und unzensierte Varianten berücksichtigt und Ausfallmechanismen klar voneinander getrennt werden. Da die Laufzeit bis zum Ausfall geht, ist der Test zeitintensiver und damit meistens teurer. In der Anwendung ist er universell für alle Dimensionierungen einsetzbar, wird jedoch bei sehr großen Produktlebensdauern unpraktisch.

Der Accelerated Life Test erfordert eine anspruchsvolle Planung, da zusätzlich ein belastbares Alterungs- bzw. Last-Lebensdauer-Modell notwendig ist. Auch hier sind zensierte und unzensierte Varianten möglich, und die Trennung der Ausfallmechanismen bleibt zwingend erforderlich. Durch die Beschleunigung verkürzen sich jedoch die Laufzeiten deutlich, sodass der Test insgesamt oft günstiger ist als ein reiner End-of-Life Test. In der Anwendung ist der Accelerated Life Test für alle Dimensionierungen geeignet und besonders vorteilhaft bei Produkten mit sehr großen Lebensdauern.

Der Degradationstest stellt ebenfalls hohe Anforderungen an die Planung. Neben dem Degradationsmodell muss ein End-of-Life-Kriterium definiert werden. Der Messaufwand ist hoch, da Verschleißmerkmale kontinuierlich überwacht werden müssen. Gleichzeitig erlauben Beschleunigung und Extrapolation kürzere Laufzeiten und dadurch oftmals auch geringere Kosten. In der Anwendung ist der Ansatz ausschließlich nur dort sinnvoll, wo ein relevanter Verschleißmechanismus messbar ist.

Zum Abschluss schauen wir uns noch eine einfache Guideline zur Auswahl des passenden Zuverlässigkeitstests an. Zunächst prüfen wir, wie das Produktdesign im Verhältnis zur Anforderung ausgelegt ist. Ist es deutlich überdimensioniert, eignet sich der Success-Run Test. Er läuft ausfallfrei bis zur Zielzeit und ist besonders auf Systemebene nützlich, wenn schnelle Freigabeentscheidungen benötigt werden.

Liegt das Design „on target“, prüfen wir als Nächstes, ob ein messbarer Verschleiß vorhanden ist. Wenn es keinen messbaren Verschleiß gibt, prüfen wir, ob eine Beschleunigung durch Lasterhöhung möglich ist. Wenn nicht, wählen wir den End-of-Life Test – je nach Fragestellung auf Komponenten- oder Systemebene. Wenn ja, kommt der Accelerated Life Test zum Einsatz, vorzugsweise auf Komponentenebene, da sich dort Lasten gezielt erhöhen und gut kontrollieren lassen.

Ist ein messbarer Verschleiß vorhanden, prüfen wir auch hier, ob eine Raffung durch Lasterhöhung möglich ist. Ist diese nicht sinnvoll, nutzen wir den Degradationstest mit End-of-Life-Kriterium, entweder auf Komponenten- oder Systemebene. Ist eine Beschleunigung möglich, wird der Accelerated Degradation Test angewandt, typischerweise auf Komponentenebene, um die Prüfzeit weiter zu reduzieren.

Noch ein wichtiger Hinweis gilt unabhängig von der gewählten Strategie: Eine zeitliche Raffung – etwa durch höhere Taktfrequenzen oder reduzierte Standzeiten – sollte immer geprüft werden. Für beschleunigte Tests ist zudem ein belastbares Last-Lebensdauer-Modell notwendig. Für Degradationstests wird neben dem Degradationsmodell zusätzlich ein klar definiertes End-of-Life-Kriterium benötigt. Und in allen Fällen gilt: Der Ausfallmechanismus muss unverändert bleiben, damit die Ergebnisse repräsentativ sind und zuverlässig auf den Feldeinsatz übertragen werden können.

