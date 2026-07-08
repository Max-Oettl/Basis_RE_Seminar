# Reltest Academy Style Guide

## Ziel

Dieser Style Guide definiert die visuelle Richtung für SVG-Dateien im Reltest Academy E-Learning-Programm.

## Markenwirkung

Die Visualisierungen sollen wirken wie:

- technische Weiterbildung für Ingenieure
- seriöse Academy-Inhalte
- klare Erklärgrafiken
- hochwertige, ruhige Video-Grafiken

Sie sollen nicht wirken wie:

- generische Business-Stockgrafiken
- spielerische Comic-Illustrationen
- überladene PowerPoint-Folien
- wechselnde Einzelgrafiken ohne System
- schnell zusammengesetzte Platzhaltergrafiken

## Farbrollen

Die exakten Farbwerte können später aus dem Logo finalisiert werden. Bis dahin gilt diese Arbeits-Palette:

- Primary Navy: `#062D46`
- Deep Navy: `#021D31`
- Academy Blue: `#139CCB`
- Light Blue: `#E7F6FB`
- White: `#FFFFFF`
- Soft Gray: `#EEF3F6`
- Medium Gray: `#6A7A86`
- Signal Green, sparsam: `#2AA876`
- Warning Amber, sparsam: `#F2A93B`
- Failure Red, sparsam: `#D1495B`

## Typografie

- Bevorzugt klare serifenlose Schriften.
- SVGs sollen robuste Fallbacks verwenden: `Inter`, `Segoe UI`, `Arial`, `sans-serif`.
- Text muss groß genug für Video sein.
- Labels und Achsenbeschriftungen sparsam halten.
- Deutsche Texte sollen in normaler Schreibweise gesetzt werden, also mit echten Umlauten und `ß` statt ausgeschriebenen Ersatzformen.
- Text nicht kleiner setzen, nur um ein überfülltes Layout zu retten; stattdessen Text reduzieren oder Layout neu ordnen.

## Layout

- Standardformat: 16:9.
- Standard-ViewBox: `0 0 1920 1080`.
- Großzügige Ränder.
- Zentrale Aussage im visuellen Fokus.
- Standardmäßig nur die Kernvisualisierung gestalten, nicht die gesamte Folie.
- Titel, Leitfragen oder Fazittexte nur einbauen, wenn sie ausdrücklich Teil der Grafik sein sollen.
- Text, Labels und Annotationen dürfen keine Linien, Marker oder Flächen ungewollt überlagern.
- Lesbarkeit und Abstand haben Vorrang vor maximaler Flächennutzung.
- Vordergrund und Hintergrund müssen sichtbar bewusst angeordnet sein.

## Diagrammstil

- Achsen und Linien in Navy oder Grau.
- Hauptkurven in Academy Blue.
- Ausfallmarker sparsam in Failure Red.
- Zensierung und Beobachtungsdauer in Academy Blue.
- Intervallflächen in neutralem Grau.
- Hervorhebungen gezielt in Cyan, Grün oder Amber.
- Rasterlinien nur dezent verwenden.
- Keine unnötigen 3D-Effekte.

## Icon- Und Motivstil

- Zentrale Piktogramme und Motive müssen hochwertig gestaltet sein.
- Keine grob improvisierten Autos, Prüfstände, Dokumente oder Maschinen aus einzelnen Kreisen und Rechtecken, wenn sie im Fokus stehen.
- Saubere Pfade, gut komponierte Piktogramme oder bewusst abstrakte Visualisierungen bevorzugen.
- Wiederkehrende Motive sollen als Komponenten in `components/` gedacht werden.
- Wenn ein realistisches Motiv nicht sauber gelingt, ist eine klare abstrakte Darstellung besser als ein schwaches Icon.

## Pfeile Und Verbindungen

- Pfeile müssen sauber konstruiert sein.
- Linien dürfen nicht sichtbar durch Pfeilspitzen laufen.
- Verbindungslinien liegen hinter Textknoten.
- Pfeile sollen Bedeutung transportieren, nicht dekorieren.

## Logo-Nutzung

Das Logo muss nicht auf jeder SVG sichtbar sein, wenn die Grafik in einem gebrandeten Video-Kontext erscheint. Wenn es verwendet wird:

- klein und ruhig platzieren
- nicht mit dem Lerninhalt konkurrieren
- ausreichend Abstand zum Rand

