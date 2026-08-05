# Extracted Source Text

- module_id: RE1
- source_docx: source-materials/basis-seminar/powerpoint-svg/RE1/Text/02_Modul_Qualitative Methoden - Einführung in qualitative Methoden.docx
- source_sha256: 677fbde6aa080b7b2eb6a4515c0c72b43b781e66a706a07dcec150a37ec249ac
- extraction_method: deterministic_ooxml_table_parser
- modul_nummer: 2
- modul_titel: Qualitative Zuverlässigkeitsmethoden
- abschnitt_nummer: 2
- abschnitt: Einführung in die Qualitative Zuverlässigkeitsmethoden

## Folie 1: Einteilung der Zuverlässigkeitsmethoden

- section_id: section_001
- source_local_slide_numbers: 1
- spoken_text_sha256: de409ade5b17cf56c7459c0ce0b20d2e169463f4bef8cca5a2858c46a2d14ff5

### Gesprochener Text

Wir haben bereits im Modul Einführung in die Zuverlässigkeitstechnik kennengelernt, dass die Zuverlässigkeitsmethoden in zwei Kategorien eingeteilt werden können:

Nämlich in die qualitativen und in die quantitativen Zuverlässigkeitsmethoden.

In diesem Modul betrachten wir ausschließlich die qualitativen Methoden.

Mit Hilfe dieser werden vor allem die kritischen Ausfallmechanismen eines Produktes identifiziert und im Anschluss geeignete Abstellmaßnahmen festgelegt, um das Ausfallrisiko zu reduzieren und die Zuverlässigkeit zu verbessern.

Wir werden noch im weiteren Verlauf dieses Moduls die typischen Werkzeuge kennenlernen, die hierfür eingesetzt werden.

Dazu schauen wir uns hauptsächlich die Fehlerbaumanalyse an, die hier abgekürzt als FTA, dargestellt ist.Im Anschluss gehen wir auch auf die Fehlermöglichkeits- und Einflussanalyse ein, die man umgangssprachlich einfach nur F-M-E-A nennt.

Um zu schauen, wann die Methoden genau eingesetzt werden, werfen wir nochmals einen Blick auf die Badewannen-Kurve, welche den typischen Verlauf von Ausfällen über der Lebensdauer eines Produktes beschreibt.

## Folie 2: Einteilung der Zuverlässigkeitsmethoden

- section_id: section_002
- source_local_slide_numbers: 2
- spoken_text_sha256: 9017a3204c30e0a8ae4575a100caa1e69acbc208f576480075b5d55d3a5c61cd

### Gesprochener Text

Die Badewannenkurve kann in die drei Bereiche Frühausfälle, Zufallsausfälle und Ermüdungsausfälle eingeteilt werden.

Der erste Bereich der Frühausfälle ist durch eine abfallende Anzahl an Ausfällen charakterisiert. Im zweiten Bereich der Zufallsausfälle ist die Anzahl an Ausfälle konstant. Und im dritten Bereich der Ermüdungsausfälle steigt die Anzahl an Ausfällen wieder an.

Wie hier schön zu sehen ist, werden die qualitativen Methoden vor allem dazu genutzt, die Ausfälle zu Beginn der Lebensdauer zu reduzieren.

Wir befinden uns also im Bereich eins und zwei der Badewannenkurve, bei welchem vor allem eine Risikoreduktion durch eine Systemanalyse im Vordergrund steht.Die Systemanalyse bildet immer die Grundlage für eine saubere qualitative Zuverlässigkeitsanalyse.

Was man dabei genau macht und welche Punkte besonders wichtig sind, schauen wir uns nun im Folgenden genauer an.

## Folie 3: Beispiel-System PV-Anlage

- section_id: section_003
- source_local_slide_numbers: 3
- spoken_text_sha256: ae6e6735045279da2c4d4dce91810067d3092d8ad629c821f608f8440738308c

### Gesprochener Text

Der erste Schritt der Systemanalyse ist immer eine genaue Abgrenzung des zu untersuchenden Systems.

Dies geschieht durch die Festlegung einer geeigneten Systemgrenze.

Dies wollen wir nun anhand dem dargestellten Beispiel genauer erläutern. Das Bild zeigt eine schematische Darstellung einer Photovoltaik-Anlage oder auch kurz nur P-V-Anlage.

Innerhalb der Systemgrenze der PV-Anlage befinden sich die P-V-Module, der Wechselrichter, der Stromzähler, ein Batteriesystem und mehrere Hausverbraucher.

Jedes dieser Elemente kann wiederum als eigenes Subsystem betrachtet werden.

So hat der Wechselrichter beispielsweise eine eigene Systemgrenze.

Die Definition von System- und Subsystemgrenzen ermöglicht es uns, komplexe Systeme zu strukturieren, zu vereinfachen und in handhabbare Einheiten zu zerlegen.

Durch die Unterteilung und klare Abgrenzung können wir spezifische Analysen für einzelne Subsysteme oder Komponenten durchführen und somit gezielt potenzielle Ausfallrisiken identifizieren, um letztendlich die Zuverlässigkeit zu verbessern.

## Folie 4: System-, Subsystem- und Komponentenebene

- section_id: section_004
- source_local_slide_numbers: 4
- spoken_text_sha256: 97b236e2f3bad5a46c11122f44a6c14dac553a38095d3a403ce00d27d1d2dd66

### Gesprochener Text

Im nächsten Schritt müssen wir alle Schnittstellen zwischen dem System und seiner Umgebung identifizieren.

Dabei kann uns gedanklich folgendes Schema helfen, das die unterschiedlichen Systemebenen darstellt.

Da jedes technische System in einer Umwelt existiert, ist dies immer die oberste Ebene.

Im Falle der PV-Anlage umfasst die Umwelt den Standort, Umwelteinflüsse, Umgebungseinflüsse und auch gesetzliche Regularien.

Anschließend betrachten wir das technische System selbst.

Bei der PV-Anlage spielt der Anlagentyp, die elektrische Verschaltung, die Betriebsstrategie und auch die Nennleistung eine zentrale Rolle.

Diese Faktoren definieren das Gesamtsystem und dessen Hauptfunktionen.

Das System kann weiter in Subsysteme unterteilt werden. Diese Ebene beinhaltet spezifische Baugruppen und Komponenten wie den Wechselrichter, das PV-Modul oder auch das Batteriesystem.

Jedes Subsystem besitzt dabei ganz bestimmte Eigenschaften und typische Ausfallrisiken.

Schließlich gelangen wir zur Komponentenebene.

Hier finden wir einzelne Elemente wie Mikrocontroller und andere Bauteile.

Nehmen wir an wir wollen im weiteren Verlauf nun den Wechselrichter näher analysieren.

Das heißt die Systemgrenze umschließt nun die Subsystem- und auch Komponentenebene.

Die Systemgrenze definiert nicht nur den Bereich, in dem wir unsere Analyse durchführen, sondern markiert auch die Schnittstellen, an denen es Wechselwirkungen zur Umgebung gibt.

Im nächsten Schritt wollen wir genau diese Schnittstellen zur Umgebung identifizieren.

Auf diese Weise können wir die Einflussfaktoren auf das System besser verstehen und gezielt Maßnahmen zur Verbesserung der Zuverlässigkeit entwickeln.

## Folie 5: Faktorklassifikation mit dem P-Diagramm (Parameter-Diagramm)

- section_id: section_005
- source_local_slide_numbers: 5
- spoken_text_sha256: de9af3c83d408ef96efff30eb29ae657dcd4e40d3801c493147cade48cde9d38

### Gesprochener Text

Die Wechselbeziehungen zwischen System und Umgebung können durch das sogenannte P-Diagramm dargestellt werden.Das P-Diagramm hilft uns die Ein- und Ausgangsgrößen des Systems in Kategorien zu unterteilen.

Ganz links gibt es die Eingangsgrößen oder auch Stellgrößen, welche in das System eingebracht werden. Sie können von Benutzern oder anderen Systemen stammen und beeinflussen direkt die Funktionsweise unseres Systems.

Zusätzlich gehen in das System kontrollierbare Größen oder Steuergrößen ein. Diese Faktoren können wir direkt beeinflussen, um die Leistung oder das Verhalten des Systems zu steuern. Durch Anpassung dieser Größen können wir gezielt auf das System einwirken.

Unerwünschte Einflüsse, die wir nicht direkt kontrollieren können, die aber dennoch Auswirkungen auf das System haben, werden als Störgrößen bezeichnet. Beispiele hierfür sind Umwelteinflüsse wie Temperatur oder Feuchtigkeit, aber auch Fertigungstoleranzen.

Aus dem System heraus gehen die Zielgrößen. Dies sind die gewünschten Ausgaben oder Leistungen, die wir vom System erwarten. Sie definieren die Qualitätsmerkmale und Leistungsparameter, die unser Produkt oder Prozess erfüllen soll.

Die Klassifizierung dieser Größen innerhalb des P-Diagramm hilft uns die Schnittstellen und Wechselwirkungen innerhalb des Systems systematisch zu analysieren und besser zu verstehen.

Das P-Diagramm bildet somit eine wertvolle Grundlage für die weitere qualitative Zuverlässigkeitsanalyse.

## Folie 6: P-Diagramm eines Wechselrichters

- section_id: section_006
- source_local_slide_numbers: 6
- spoken_text_sha256: 4a214ee4052b3efe503275b20d22460dcf979b2fad9e0b21eec4a4530e079b01

### Gesprochener Text

Wir wenden das P-Diagramm nun auf unseren Wechselrichter an.

Dabei können die verschiedenen Größen des Wechselrichters wie folgt klassifiziert werden:

Als Eingangsgröße oder Stellgröße wird der elektrische Gleichstrom definiert, der von den PV-Modulen erzeugt und in den Wechselrichter eingespeist wird.

Zusätzlich können sämtliche Signale, aber auch die Betätigungsenergie für den Notausschalter als kontrollierbare Größen bzw. Steuergrößen aufgefasst werden. Daneben gibt es noch eine ganze Reihe an Störgrößen. Hierzu zählen beispielsweise Vibration, Schmutz, Wärme und Feuchtigkeit. Diese Umgebungsbedingungen können wir nicht direkt kontrollieren, sie beeinflussen jedoch die Funktion und Zuverlässigkeit des Wechselrichters.

Die Zielgröße und damit die Ausgangsgröße des Wechselrichters ist der elektrische Wechselstrom. Dies ist die vom Wechselrichter erzeugte Ausgangsleistung, die in das Stromnetz oder zu den Verbrauchern weitergeleitet wird.

## Folie 7: Ursache-Wirkungs-Diagramm (Ishikawa-Diagramm)

- section_id: section_007
- source_local_slide_numbers: 7
- spoken_text_sha256: 5275d2420d940a8a9060fa65c4a2c34f85b6e23f7c2c931c883eda3b01886c6b

### Gesprochener Text

Um bei der Suche nach einzelnen Einflussgrößen zu unterstützen, kann das sogenannte Ursache-Wirkungs-Diagramm, auch bekannt als Ishikawa-Diagramm oder Fischgräten-Diagramm angewendet werden.

Dieses Werkzeug hilft uns dabei, die möglichen Ursachen für ein bestimmtes Problem bzw. eine Wirkung systematisch zu identifizieren und zu analysieren.

In unserem Fall ist die Wirkung der Leistungsverlust der PV-Anlage. Das Diagramm stellt diese Wirkung am Kopf des Fisches dar.

Die möglichen Ursachen werden mittels der Fischgräten in Hauptkategorien eingeteilt, die man oft als die fünf M's bezeichnet. Dazu zählen Materialien, Maschinen, Mensch, Methoden und auch Milieu bzw. Umwelt.Zunächst werden alle Materialien betrachtet, die in der PV-Anlage verwendet werden, wie zum Beispiel die Qualität der Solarmodule oder der Verkabelung. Mögliche Fragen sind beispielsweise:Sind die Materialien von guter Qualität? Gibt es Materialfehler oder Verschleiß?

In der zweiten Gräte können die eingesetzten Maschinen und Ausrüstungen erfasst werden. Hierzu zählt beispielsweise die Montagestruktur oder auch Überwachungssysteme. Hier wird untersucht, ob die Ausrüstung korrekt funktioniert oder ob es technische Probleme geben kann.

Der Mensch spielt natürlich auch in technischen Systemen meist eine relevante Rolle. Unter dieser Kategorie wird das Personal, das an der Installation, Wartung und Bedienung der P-V-Anlage beteiligt ist, erfasst. Aspekte wie Schulung, Erfahrung und Sorgfalt spielen hier eine Rolle. Dabei muss also beachtet werden, welchen Einfluss menschliche Fehler oder auch unzureichende Qualifikationen haben.

Unter Methoden verstehen wir die Prozesse und Verfahren, die bei der Planung, Installation und Wartung angewendet werden. Wichtig hierbei ist zu prüfen, ob die Verfahren effizient und korrekt ausgeführt sowie Wartungsintervalle und -protokolle eingehalten werden.

Zum Schluss gibt es noch die Umweltfaktoren, die sich auf äußere Einflüsse wie Wetterbedingungen, Verschmutzung oder geografische Lage beziehen. Hierbei muss geklärt werden, wie sich Temperatur, Feuchtigkeit oder Schattenwurf auf die Leistung der Anlage auswirken.

Das Ishikawa-Diagramm wird von rechts nach links gelesen, wobei die Wirkung am rechten Ende steht und die Ursachen sich entlang der "Gräten" nach links verzweigen.

Durch diese visuelle Darstellung können wir die möglichen Ursachen für den Leistungsverlust der P-V-Anlage strukturiert erfassen und analysieren.

Die fünf M's helfen uns dabei, alle relevanten Bereiche zu berücksichtigen und keine potenziellen Ursachen zu übersehen. Dieses Diagramm ist ein effektives Werkzeug, um in der Zuverlässigkeitsanalyse die Wurzel von Problemen zu finden.

## Folie 8: Bauteilblockdiagramm

- section_id: section_008
- source_local_slide_numbers: 8
- spoken_text_sha256: 8e9c77ed2509d902d60da119a5119ea1df8024bc9e03cc86f65ae084d1a0f8ac

### Gesprochener Text

Nachdem die Wechselwirkungen des Systems mit der Umgebung analysiert wurden, können wir nun das Innere des Systems betrachten.

Dazu wird das Bauteilblockdiagramm des Systems aufgestellt. Hierzu werden sämtliche Baugruppen und Komponenten innerhalb des Systems erfasst.

Zusätzlich werden alle Wechselwirkungen zwischen den Komponenten und ihrer Umgebung sowie zwischen den Komponenten selbst betrachtet.

Als Hilfe können diese Wechselwirkungen in drei Kategorien eingeteilt werden: Energieströme, Stoffströme und Informationsströme.

Der Energieström repräsentiert dabei den Austausch von Energie.

Der Stoffstrom steht für den Transfer von Materialien oder Substanzen.

Und der Informationsstrom zeigt die Kommunikation oder den Datenaustausch an.

Durch diese Visualisierung der Ströme im Bauteilblockdiagramm können wir die Schnittstellen und Wechselwirkungen innerhalb des Systems sowie mit seiner Umgebung visualisieren und besser verstehen.

## Folie 9: Bauteilblockdiagramm WR

- section_id: section_009
- source_local_slide_numbers: 9
- spoken_text_sha256: 206abbfd3fe13317c626c9074de7a0fcb6754a6d780bd9cb9169b0c158d74240

### Gesprochener Text

Als Beispiel betrachten wir das Bauteilblockdiagramm eines Wechselrichters. Darin sind alle elektronischen Baugruppen und Komponenten dargestellt.

Der Energieström im Leistungspfad des Wechselrichters kann eingezeichnet werden, um die Energieflüsse zu visualisieren.

Sämtliche Bauteile zur Kommunikation werden ebenfalls erfasst, ebenso alle Informationsströme und Messsignale innerhalb des Wechselrichters.

Wirkt eine Eingangsgröße generell auf alle Baugruppen oder Komponenten innerhalb des Systems, kann der Pfeil direkt an die Systemgrenze angesetzt werden.

Dies ist zum Beispiel bei thermischer Energie, Verschmutzung, Feuchtigkeit und Störsignalen der Fall.

## Folie 10: Funktionsstruktur

- section_id: section_010
- source_local_slide_numbers: 10
- spoken_text_sha256: 3dc698e6a5583dd3ad9bbbf9235f9d62090d9fb3d447dde573d2b6778a35a023

### Gesprochener Text

Hinweis an Kevin: Hier bin ich mir nicht ganz sicher, ob wir das mit der Funktionsstruktur überhaupt brauchen. Auch wie tief ich dann auf die des Wechselrichters eingehen soll oder anderes Beispiel?

Als nächstes befassen wir uns mit der Funktionsstruktur eines Systems.

Jedes technische Gebilde oder System besitzt eine eindeutige Funktion, die sich aus dem Zusammenhang zwischen den Ein- und Ausgangsgrößen ergibt.

Dabei kann das System zunächst als Black-Box aufgefasst werden: Eingangsgrößen treten ein und Ausgangsgrößen treten aus.

Die Funktion selbst ist die Aufgabenbeschreibung in neutraler Form, also eine Aufgabenformulierung auf abstrakter und lösungsneutraler Ebene.

Auf Systemebene kann eine Funktion meist in untergeordnete Teilfunktionen aufgeteilt werden, wodurch sich eine Art Funktionsstruktur ergibt.

Wird die Summe dieser Teilfunktionen erfüllt, so ist auch die übergeordnete Funktion des Systems erfüllt.

Da die Teilfunktionen oftmals direkt an physische Baugruppen oder Komponenten geknüpft sind, sind Systemstruktur und Funktionsstruktur häufig sehr ähnlich.

Im Falle des Wechselrichters ist die Hauptfunktion die Umwandlung von Gleichstrom in Wechselstrom.Dies kann dann wieder weiter aufgeteilt werden in alle für den Wechselrichter relevanten Teilfunktionen.

## Folie 11: ABC-Analyse − Wechselrichter

- section_id: section_011
- source_local_slide_numbers: 11
- spoken_text_sha256: 0aefd6067784709cb38178c53e073c9b76d272d4dd2c851cc75fafd9b5f50661

### Gesprochener Text

Sobald wir innerhalb der Systemanalyse ein ausreichendes Verständnis über die einzelnen Komponenten und deren Wechselwirkungen erlangt haben, kann im nächsten Schritt die Kritikalitätsbewertung erfolgen.

Hierzu werden zunächst alle kritischen Bauteile des Systems identifiziert und aufgelistet.

Anschließend werden alle möglichen Ausfallarten ermittelt, also die verschiedenen Weisen, wie die Bauteile ausfallen können.

Diesen Ausfallarten liegen wiederum spezifische Ausfallmechanismen, also Ausfallursachen, zugrunde, die ebenfalls ermittelt werden.

Nun erfolgt für jeden Ausfallmechanismus eine Kritikalitätsbewertung in Form einer A-B-C-Analyse. Dabei wird jeder Ausfallmechanismus als A-Teil, B-Teil oder C-Teil klassifiziert.

A-Teile und B-Teile gelten als risikoreich. Der Unterschied zwischen ihnen besteht darin, dass bei A-Teilen die Belastung definierbar oder berechenbar ist, wodurch dann eine Lebensdauerberechnung durchgeführt werden kann.

Für B-Teile ist eine Lebensdauerberechnung nicht möglich, weshalb hier zur Absicherung weitgehend auf Tests zurückgegriffen werden muss.

C-Teile dagegen sind risikoneutral und müssen nicht weiterverfolgt werden.

Auf diese Weise erhält man eine Übersicht über alle relevanten Bauteile, samt Ausfallarten und Ausfallmechanismen sowie der Kritikalitätsbewertung.

Als ergänzende Methode zur A-B-C-Klassifizierung eignet sich die Fehlerbaumanalyse. Dabei werden die Zusammenhänge zwischen möglichen Fehlfunktionen und ihren Ursachen systematisch analysiert und in Form eines Baumdiagramms visualisiert.

Diese Methode lernen wir nun im Folgenden kennen.

