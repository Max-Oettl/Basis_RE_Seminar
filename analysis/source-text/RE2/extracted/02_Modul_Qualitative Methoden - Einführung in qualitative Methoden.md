# Extracted Source Text

- module_id: RE2
- source_docx: source-materials/basis-seminar/powerpoint-svg/RE2/Text/02_Modul_Qualitative Methoden - Einführung in qualitative Methoden.docx
- source_sha256: 01f85cd2a11af9fe4aaae4be6d6eaa80e9aab11fbb221343a78a177b2de6aa79
- extraction_method: deterministic_ooxml_table_parser
- modul_nummer: 2
- modul_titel: Qualitative Zuverlässigkeitsmethoden
- abschnitt_nummer: 2
- abschnitt: Einführung in die Qualitative Zuverlässigkeitsmethoden

## Folie 1: Einteilung der Zuverlässigkeitsmethoden

- section_id: section_001
- source_local_slide_numbers: 1
- spoken_text_sha256: eaf4947f538ee9d6656a56e0efc54edb0c470ce539b34e9a0600f487f8c2953e

### Gesprochener Text

Wir haben bereits im Modul Einführung in die Zuverlässigkeitstechnik kennengelernt, dass die Zuverlässigkeitsmethoden in zwei Kategorien eingeteilt werden können:

Nämlich in die qualitativen und in die quantitativen Zuverlässigkeitsmethoden.

In diesem Modul werden wir ausschließlich die qualitativen Methoden betrachten.

Mit Hilfe dieser werden vor allem die kritischen Ausfallmechanismen eines Produktes identifiziert.

Im Anschluss werden geeignete Abstellmaßnahmen festgelegt, um das Ausfallrisiko zu reduzieren und die Zuverlässigkeit zu verbessern.

Wir werden noch im weiteren Verlauf dieses Moduls die typischen Werkzeuge kennenlernen, die hierfür eingesetzt werden.

Dazu schauen wir uns hauptsächlich die Fehlerbaumanalyse an, die hier einfach nur mit FTA abgekürzt wird.Im Anschluss daran gehen wir auch auf die Fehlermöglichkeits- und Einflussanalyse ein, die man umgangssprachlich einfach nur FMEA nennt.

Um zu schauen, wann die Methoden genau eingesetzt werden, werfen wir nochmals einen Blick auf die Badewannen-Kurve, welche den typischen Verlauf von Ausfällen über der Lebensdauer eines Produktes beschreibt.

## Folie 2: Einteilung der Zuverlässigkeitsmethoden

- section_id: section_002
- source_local_slide_numbers: 2
- spoken_text_sha256: 92d7785866cb73d8da304e0e57335056056223b7f217708bdfeee87cb8d71359

### Gesprochener Text

Die Badewannenkurve kann in die drei Bereiche Frühausfälle, Zufallsausfälle und Ermüdungsausfälle eingeteilt werden.

Der erste Bereich der Frühausfälle ist durch eine abfallende Anzahl an Ausfällen charakterisiert. Im zweiten Bereich der Zufallsausfälle ist die Anzahl der Ausfälle konstant. Und im dritten Bereich der Ermüdungsausfälle steigt die Anzahl der Ausfälle wieder an.Die qualitativen und quantitativen Zuverlässigkeitsmethoden werden für unterschiedliche Ausfallarten und damit auch für die verschiedenen Lebensphasen des Produktes eingesetzt.

Wie hier schön zu sehen ist, werden die qualitativen Methoden vor allem dazu genutzt, die Ausfälle zu Beginn der Lebensdauer zu reduzieren.

Wir befinden uns also im Bereich eins und zwei der Badewannenkurve, in dem vor allem eine Risikoreduktion durch eine Systemanalyse im Vordergrund steht.Die Systemanalyse bildet immer die Grundlage für eine saubere qualitative Zuverlässigkeitsanalyse.

Was man dabei genau macht und welche Punkte besonders wichtig sind, schauen wir uns nun im Folgenden genauer an.

## Folie 3: Beispiel-System PV-Anlage

- section_id: section_003
- source_local_slide_numbers: 3
- spoken_text_sha256: 1eb2d7d65416621895c4f2648c3b943ed31cf1c3c95b0aa6f9ac688187a8fe00

### Gesprochener Text

Der erste Schritt der Systemanalyse ist immer eine genaue Abgrenzung des zu untersuchenden Systems.

Dies geschieht durch die Festlegung einer geeigneten Systemgrenze.

Dies wollen wir nun anhand eines Beispiels genauer erläutern. Zu sehen ist hier eine schematische Darstellung einer Photovoltaik-Anlage oder auch kurz nur PV-Anlage.

Um die Wechselwirkungen der PV-Anlage mit der Umgebung zu betrachten sind zusätzlich auch das öffentliche Stromnetz, mehrere Hausverbraucher und ein Stromzähler dargestellt.

Es sollte also nicht nur das technische System selbst, sondern eben auch immer die Umgebung mitberücksichtigt werden.

Um zu beschreiben, welche Komponenten zu der PV-Anlage gehören, können wir nun eine Systemgrenze definieren.

Diese Systemgrenze schließt alle zur PV-Anlage gehörenden Komponenten mit ein.

Dazu zählen die PV-Module, der Wechselrichter und das Batteriesystem.

Jedes dieser Elemente kann wiederum als eigenes Subsystem betrachtet werden.

So hat der Wechselrichter beispielsweise wieder eine eigene Systemgrenze.

Steht also in der Untersuchung nur der Wechselrichter im Fokus, würde man nur die Komponenten innerhalb dessen Systemgrenze und die Wechselwirkungen zur Umgebung betrachten.

Die Definition von System- und Subsystemgrenzen ermöglicht es uns, komplexe Systeme zu strukturieren, zu vereinfachen und in handhabbare Einheiten zu zerlegen.

Durch diese Unterteilung und klare Abgrenzung können wir spezifische Analysen für einzelne Subsysteme oder Komponenten durchführen und somit gezielt potenzielle Ausfallrisiken identifizieren, um letztendlich die Zuverlässigkeit des gewünschten Systems zu verbessern.

## Folie 4: System-, Subsystem- und Komponentenebene

- section_id: section_004
- source_local_slide_numbers: 4
- spoken_text_sha256: b83ca7bb4c81e46f71820bebb2d74ced27349ca9b3591c52fee16a33225eb162

### Gesprochener Text

Haben wir die Systemgrenze festgelegt, müssen wir im nächsten Schritt alle Schnittstellen zwischen dem System und seiner Umgebung identifizieren.

Dabei kann uns gedanklich folgendes Schema helfen, das die unterschiedlichen Systemebenen darstellt.

Da jedes technische System in einer Umwelt existiert, ist dies immer die oberste Ebene.

Im Falle der PV-Anlage umfasst die Umwelt den Standort, Umwelteinflüsse, Umgebungseinflüsse, aber auch gesetzliche Regularien und Anforderungen.

Anschließend betrachten wir das technische System selbst.

Für die PV-Anlage sind beispielsweise der Anlagentyp, die elektrische Verschaltung, die Betriebsstrategie und auch die Nennleistung von zentraler Bedeutung.Wir betrachten also nicht nur die physischen Komponenten, sondern eben auch Anforderungen und Vorgaben, die das Verhalten der PV-Anlage beeinflussen.

Diese Faktoren definieren letztendlich das Gesamtsystem und dessen Hauptfunktionen.

Das System kann dann weiter in Subsysteme unterteilt werden. Diese Ebene beinhaltet spezifische Baugruppen und Komponenten wie den Wechselrichter, das PV-Modul oder auch das Batteriesystem.

Jedes Subsystem besitzt dabei ganz bestimmte Eigenschaften und typische Ausfallrisiken.

Schließlich gelangen wir zur Komponentenebene.

Hier finden wir einzelne Elemente wie Mikrocontroller und andere Baugruppen oder Bauteile.

Nehmen wir an wir wollen im weiteren Verlauf nun den Wechselrichter näher analysieren.

Das heißt die Systemgrenze umschließt die Subsystem- und auch Komponentenebene.

Die Systemgrenze definiert nicht nur den Bereich, innerhalb dessen wir unsere Analyse durchführen, sondern markiert auch die Schnittstellen, an denen es Wechselwirkungen zur Umgebung gibt.

Im nächsten Schritt wollen wir genau diese Schnittstellen zur Umgebung identifizieren.

Auf diese Weise können wir die Einflussfaktoren auf den Wechselrichter besser verstehen und gezielt Maßnahmen zur Verbesserung der Zuverlässigkeit entwickeln.

## Folie 5: Faktorklassifikation mit dem P-Diagramm (Parameter-Diagramm)

- section_id: section_005
- source_local_slide_numbers: 5
- spoken_text_sha256: dfe1fb5ee30e3924a6af1a8dc6ceb84457ba0007e9dae8cd130754bae891308c

### Gesprochener Text

Die Wechselbeziehungen zwischen System und Umgebung können durch das sogenannte Parameter Diagramm, oder auch kurz nur P-Diagramm, dargestellt werden.

Das Parameter Diagramm stellt den Zusammenhang zwischen Systemparametern in Form eines Blockdiagramms dar.

Dabei können die Ein- und Ausgangsgrößen des Systems in unterschiedliche Kategorien unterteilt werden.

Ganz links gibt es die Eingangsgrößen oder auch Stellgrößen, welche in das System eingebracht werden. Sie können von Benutzern oder anderen Systemen stammen und beeinflussen direkt die Funktionsweise unseres Systems.

Zusätzlich gehen in das System kontrollierbare Größen oder Steuergrößen ein. Diese Faktoren können wir direkt beeinflussen, um die Leistung oder das Verhalten des Systems zu steuern. Durch Anpassung dieser Größen können wir gezielt also auf das System einwirken.

Unerwünschte Einflüsse, die wir nicht direkt kontrollieren können, die aber dennoch Auswirkungen auf das System haben, werden als Störgrößen bezeichnet. Beispiele hierfür sind Umwelteinflüsse wie Temperatur oder Feuchtigkeit, aber auch Fertigungstoleranzen.

Aus dem System heraus gehen die Zielgrößen. Dies sind die gewünschten Ausgaben oder Leistungen, die wir vom System erwarten. Sie definieren die Qualitätsmerkmale und Leistungsparameter, die unser Produkt oder Prozess erfüllen soll.

Die Klassifizierung dieser Größen innerhalb des P-Diagramms hilft uns die Schnittstellen und Wechselwirkungen innerhalb des Systems systematisch zu analysieren und besser zu verstehen.

Das P-Diagramm bildet somit eine wertvolle Grundlage für die weitere qualitative Zuverlässigkeitsanalyse.

Wenden wir nun das P-Diagramm auf unseren Wechselrichter an.

## Folie 6: P-Diagramm eines Wechselrichters

- section_id: section_006
- source_local_slide_numbers: 6
- spoken_text_sha256: 7ea75f91bd571ff4b6dfaec2231f51c4230d957fc0861f0026e19a0358c8e529

### Gesprochener Text

Die verschiedenen Systemparameter des Wechselrichters können wie folgt klassifiziert werden.

Als Eingangsgröße oder Stellgröße wird der elektrische Gleichstrom definiert, der von den PV-Modulen erzeugt und in den Wechselrichter eingespeist wird.

Zusätzlich können sämtliche Signale, aber auch die Betätigungsenergie für den Notausschalter als kontrollierbare Größen bzw. Steuergrößen aufgefasst werden. Daneben gibt es noch eine ganze Reihe an Störgrößen. Hierzu zählen beispielsweise Vibration, Schmutz, Wärme und Feuchtigkeit. Diese Umgebungsbedingungen können wir nicht direkt kontrollieren, sie beeinflussen jedoch die Funktion und Zuverlässigkeit des Wechselrichters.

Die Zielgröße und damit die Ausgangsgröße des Wechselrichters ist der Wechselstrom. Dieser ist die vom Wechselrichter erzeugte elektrische Energie, die in das Stromnetz oder zu den Verbrauchern weitergeleitet wird.

## Folie 7: Ursache-Wirkungs-Diagramm (Ishikawa-Diagramm)

- section_id: section_007
- source_local_slide_numbers: 7
- spoken_text_sha256: 7bfd1a738fdac7339c7c996206936854fd6bee9a8012d49175785869df5eb653

### Gesprochener Text

Um die Suche nach einzelnen Einflussgrößen des Wechselrichters zu unterstützen, kann das sogenannte Ursache-Wirkungs-Diagramm, auch bekannt als Ishikawa-Diagramm oder Fischgräten-Diagramm angewendet werden.

Dieses Werkzeug hilft uns dabei, die möglichen Ursachen für ein bestimmtes Problem bzw. eine unerwünschte Wirkung systematisch zu identifizieren und zu analysieren.

In unserem Fall ist die unerwünschte Wirkung der Leistungsverlust der PV-Anlage. Das Diagramm stellt diese Wirkung am Kopf des Fisches dar.

Die möglichen Ursachen werden mittels der Fischgräten in Hauptkategorien eingeteilt, die man oft als die fünf Ems bezeichnet. Dazu zählen Materialien, Maschinen, Mensch, Methoden und auch Milieu bzw. Umwelt.Zunächst werden alle Materialien bzw. Bauteile betrachtet, die in der PV-Anlage verwendet werden, wie zum Beispiel die Qualität elektrischer Bauteile oder auch die Verkabelung. Mögliche Fragen sind beispielsweise:Sind die Materialien von guter Qualität und können Materialfehler auftreten?

Oder unterliegen einzelne Bauteile einem Verschleiß?

In der zweiten Gräte können die eingesetzten Maschinen und Ausrüstungen erfasst werden. Hierzu zählt beispielsweise die Montage-Struktur oder auch Überwachungssysteme. Hier wird untersucht, ob die Ausrüstung korrekt funktioniert oder ob es technische Probleme geben kann.

Der Mensch spielt natürlich auch in technischen Systemen meist eine relevante Rolle. Unter dieser Kategorie wird das Personal, das an der Installation, Wartung und Bedienung der PV-Anlage beteiligt ist, erfasst. Dabei muss also berücksichtigt werden, welche Einflüsse menschliche Fehler während der Installations- und Wartungsvorgängen haben können. Aspekte wie unzureichende Qualifikationen, Erfahrung und Sorgfalt spielen hier eine wichtige Rolle.

Unter Methoden verstehen wir die Prozesse und Verfahren, die während der Planung, Installation und Wartung angewendet werden. Wichtig hierbei ist zu prüfen, ob die Verfahren effizient und korrekt ausgeführt werden. Hierzu zählt beispielsweise die Einhaltung von Standards während der Installation, aber auch korrekt durchgeführte Wartungsintervalle und -protokolle.

Zum Schluss gibt es noch die Umweltfaktoren, die sich auf äußere Einflüsse wie Wetterbedingungen, Verschmutzung oder geografische Lage beziehen. Hierbei muss geklärt werden, wie sich Temperatur, Feuchtigkeit oder auch Schattenwurf auf die Leistung der Anlage auswirken.

Das Ishikawa-Diagramm wird von rechts nach links gelesen, wobei die Wirkung am rechten Ende steht und die Ursachen sich entlang der Gräten nach links verzweigen.

Durch diese visuelle Darstellung können wir die möglichen Ursachen für den Leistungsverlust der PV-Anlage strukturiert erfassen und analysieren.

Die fünf Ems helfen uns dabei, alle relevanten Bereiche zu berücksichtigen und keine potenziellen Ursachen zu übersehen. Dieses Diagramm ist ein effektives Werkzeug, um in der Zuverlässigkeitsanalyse die Wurzel von Problemen zu finden.

## Folie 8: Bauteilblockdiagramm

- section_id: section_008
- source_local_slide_numbers: 8
- spoken_text_sha256: 045d12e27494476ae9bdbf67fe54ecd270708da69cf7aea068fc3b49289dea2a

### Gesprochener Text

Nachdem wir die Systemgrenze definiert und die Wechselwirkungen mit der Umgebung analysiert haben, können wir nun das Innere des Systems betrachten.

Dazu wird das Bauteilblockdiagramm des Systems aufgestellt. Hierzu werden sämtliche Baugruppen und Komponenten innerhalb des Systems erfasst.

Dabei werden alle Wechselwirkungen zwischen den Komponenten und ihrer Umgebung betrachtet.

Zusätzlich werden jetzt auch die Wechselwirkungen zwischen den Komponenten selbst analysiert.

Als Hilfe können die Wechselwirkungen in drei Kategorien eingeteilt werden: Energieströme, Stoffströme und Informationsströme.

Der Energiestrom repräsentiert dabei den Austausch von Energie.

Der Stoffstrom steht für den Transfer von Materialien oder Substanzen.

Und der Informationsstrom zeigt die Kommunikation oder den Datenaustausch an.

Durch diese Visualisierung der Ströme im Bauteilblockdiagramm können wir die Schnittstellen und Wechselwirkungen innerhalb des Systems sowie mit seiner Umgebung visualisieren und besser verstehen.

## Folie 9: Bauteilblockdiagramm WR

- section_id: section_009
- source_local_slide_numbers: 9
- spoken_text_sha256: 501222f82268869313e55077d09023a70847878e50f0289359010b2527161dde

### Gesprochener Text

Als Beispiel betrachten wir das Bauteilblockdiagramm eines Wechselrichters. Darin sind alle elektronischen Baugruppen und Komponenten dargestellt.

Der Energiestrom im Leistungspfad des Wechselrichters kann eingezeichnet werden, um die Energieflüsse zu visualisieren.

Sämtliche Bauteile zur Kommunikation werden ebenfalls erfasst, ebenso alle Informationsströme und Messsignale innerhalb des Wechselrichters.

Wirkt eine Eingangsgröße generell auf alle Baugruppen oder Komponenten innerhalb des Systems, kann der Pfeil direkt an die Systemgrenze angesetzt werden.

Ein solcher Fall tritt beispielsweise durch thermische Energie, Verschmutzung, Feuchtigkeit und Störsignale auf

## Folie 10: Funktionsstruktur

- section_id: section_010
- source_local_slide_numbers: 10
- spoken_text_sha256: 3229c8de7aaa6c7c7c9987f2d3c6a234866bf648c35d11c92b35f3608538a28d

### Gesprochener Text

Als nächstes befassen wir uns mit der Funktionsstruktur eines Systems.

Jedes technische Gebilde oder System besitzt eine eindeutige Funktion, die sich aus dem Zusammenhang zwischen den Ein- und Ausgangsgrößen ergibt.

Dabei kann das System zunächst als Black-Box aufgefasst werden: Eingangsgrößen treten ein und Ausgangsgrößen treten aus.

Die Funktion selbst ist die Aufgabenbeschreibung in neutraler Form, also eine Aufgabenformulierung auf abstrakter und lösungsneutraler Ebene.

Auf System-Ebene kann eine Funktion meist in untergeordnete Teilfunktionen aufgeteilt werden, wodurch sich eine Art Funktionsstruktur ergibt.

Wird die Summe dieser Teilfunktionen erfüllt, so ist auch die übergeordnete Funktion des Systems erfüllt.

Da die Teilfunktionen oftmals direkt an physische Baugruppen oder Komponenten geknüpft sind, sind Systemstruktur und Funktionsstruktur häufig sehr ähnlich.

Im Falle des Wechselrichters ist die Hauptfunktion die Umwandlung von Gleichstrom in Wechselstrom.Dies kann dann wieder weiter aufgeteilt werden in alle für den Wechselrichter relevanten Teilfunktionen. Jeder dieser Teilfunktionen hat natürlich wieder seine eigene Aufgabenbeschreibung und individuelle Ein- und Ausgangsgrößen.

## Folie 11: ABC-Analyse − Wechselrichter

- section_id: section_011
- source_local_slide_numbers: 11
- spoken_text_sha256: 56d33c73569b4db17c6ff6bbd285063cf0fdbd234dea11dffc6102db69cf775a

### Gesprochener Text

Sobald wir innerhalb der System-Analyse ein ausreichendes Verständnis über die einzelnen Komponenten und deren Wechselwirkungen erlangt haben, kann im nächsten Schritt die Kritikalitätsbewertung erfolgen.

Hierzu werden zunächst alle kritischen Bauteile des Systems identifiziert und aufgelistet.

Anschließend werden alle möglichen Ausfallarten ermittelt, also die verschiedenen Weisen, wie die Bauteile ausfallen können.

Beispielsweise kann die D-C-Klemme ausfallen, indem die elektrischen Anschlüsse unterbrochen werden.

Diesen Ausfallarten liegen wiederum spezifische Ausfallmechanismen bzw. Ausfallursachen, zugrunde.Eine Unterbrechung der elektrischen Anschlüsse kann zum Beispiel aufgrund von Korrosion oder einer zu hohen mechanischen Belastung erfolgen.

Für jeden Ausfallmechanismus wird nun eine eigene Kritikalitätsbewertung in Form einer ABC-Analyse durchgeführt.

Dabei wird jeder Ausfallmechanismus als A-Teil, B-Teil oder C-Teil klassifiziert.

A-Teile und B-Teile gelten als risikoreich.

Der Unterschied zwischen ihnen besteht darin, dass die Belastung für A-Teile definierbar oder berechenbar ist.

Das heißt also, dass hierfür eine Lebensdauerberechnung durchgeführt werden kann.

Für B-Teile ist eine Lebensdauerberechnung nicht möglich, weshalb hier zur Absicherung weitgehend auf Lebensdauertests zurückgegriffen werden muss.

C-Teile dagegen sind risikoneutral und müssen nicht weiterverfolgt werden.

Auf diese Weise erhält man eine Übersicht über alle relevanten Bauteile, samt Ausfallarten und Ausfallmechanismen sowie der Kritikalitätsbewertung.

Als ergänzende Methode zur ABC-Klassifizierung eignet sich die Fehlerbaumanalyse.

Dabei werden die Zusammenhänge zwischen möglichen Fehlfunktionen und ihren Ursachen systematisch analysiert und in Form eines Baumdiagramms visualisiert.

Diese Methode lernen wir nun im Folgenden kennen.

