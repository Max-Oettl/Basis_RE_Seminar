# RE1 Kapitel 3 - Redesign- und Produktionsplan

## Identitaet

- Modul: RE1
- Kapitel: Kapitel 3 - Zuverlaessigkeitsfunktionen
- Zielumfang: Szenen 27 bis 39
- Lektion 1: Szenen 27 bis 31
- Lektion 2: Szenen 32 bis 36
- Lektion 3: Szenen 37 bis 39
- Ausgabemodus: `module_redesign` mit `full_slide`-Szenen
- Zielaufloesung: 1920 x 1080, RelTest-Academy-BrandFrame
- Quellzuordnung: Ziel 27 = Quelle 28; Ziel 28 = Quellen 29 und 30; Ziel 29 bis 39 = Quellen 31 bis 41

## Kapitelweite Lernlogik

Das Kapitel baut vier Zuverlaessigkeitsfunktionen schrittweise auf und verbindet sie mathematisch:

1. Dichtefunktion `f(t)`: Ausfaelle zu einem Zeitpunkt.
2. Ausfallwahrscheinlichkeit `F(t)`: kumulierte Ausfaelle bis zu einem Zeitpunkt.
3. Zuverlaessigkeit `R(t)`: noch intakte Einheiten nach einem Zeitpunkt.
4. Ausfallrate `lambda(t)`: bedingtes momentanes Ausfallrisiko der bis dahin intakten Einheiten.

Das Kapitel verwendet ein kanonisches Funktionssystem mit fester Reihenfolge, Kurzzeichen, Bezeichnung und Farbzuordnung. Eine breite Funktionsleiste wird nur eingesetzt, wenn sie einen Zustandswechsel oder eine echte Orientierung zwischen Funktionen traegt. In Lektion 1 bleibt `f(t)` durch eine kompakte lokale Kennzeichnung sichtbar; die vierteilige Leiste wird dort nicht auf jeder Szene wiederholt.

## Plot- und Datenvertrag

- Alle echten Diagramme werden als SVG aus Python erzeugt.
- Gemeinsamer Generator: `components/python-plot-library/reliability_function_plots.py`.
- Jede Szene speichert Generator-Kopie, Plotdaten und exportiertes Plot-SVG in ihrem eigenen `plots/`- beziehungsweise `data/`-Ordner.
- Alle Plot-SVGs verwenden grosse Achsenbeschriftungen, deutsche Umlaute, keine sichtbaren Plot-Titel und semantische Animationsziele.
- Woehler-, Histogramm- und Funktionsdaten bleiben innerhalb ihrer Aufbaufolge identisch; Achsbereiche und Einheiten wechseln nicht unbegruendet.
- Diagrammrahmen ist eine Gruppe. Daten, Kurven, Ablesehilfen, Flaechen und Interpretationsmarker sind getrennte fachliche Gruppen.

## Szenenplan

### Szene 27 - Woehlerkurve und Streuung

- Referenz: Quelle 28.
- Must preserve: Woehlerlinie, Zahnfussbiegespannung, Lastwechselzahl, mehrere Lastniveaus, Streuung der Ausfallzeiten und hervorgehobenes Niveau 640 N/mm2.
- Archetyp: Aufgabenkarte mit dominantem Datenplot.
- Komposition: vollstaendiger Quellblock zur Aufgabe links; Woehlerplot rechts; alle Messpunkte eines Lastniveaus liegen exakt horizontal.
- Animation: Woehlerdaten und Linie; 640-N/mm2-Stichprobe; statistische Beschreibungsaufgabe.
- Trigger: `Zur Einfuehrung schauen wir uns zunaechst einmal einen typischen Verlauf der Woehlerkurve an`, `Betrachten wir nun die erreichten Ausfallzeiten fuer die Stichproben auf dem Lastniveau`, `Die Aufgabe der Zuverlaessigkeitstechnik ist es nun`.

### Szene 28 - Vom Histogramm zur Dichtefunktion

- Referenzen: Quellen 29 und 30 als belegte Aufbauzustaende.
- Must preserve: Klassen, Klassenbreite, Haeufigkeit, Bereich etwa 25.000 bis 40.000 Lastwechsel, Maximum um 30.000, Stichprobe, Grundgesamtheit, glatte Dichtefunktion und empirische Schaetzung.
- Archetyp: reduzierter Zustandsvergleich.
- Komposition: gemeinsamer Zweifach-Plot mit direkten Paneltiteln fuer Stichprobe und Grundgesamtheit; keine zusaetzlichen Begriffs- oder Interpretationsbaender.
- Animation: Histogrammklassen samt Paneltitel; danach Dichtekurve samt Paneltitel.
- Trigger: `Zunaechst erstellen wir ein Histogramm`, `Wuerden wir nun die Stichprobengroesse und auch die Klassenanzahl immer weiter erhoehen`, `Wichtig zu merken an dieser Stelle ist`, `So koennte man in unserem Schaubild direkt interpretieren`.

### Szene 29 - Dreidimensionale Woehlerdarstellung

- Referenz: Quelle 31.
- Must preserve: Dichte ueber Laufzeit fuer einzelne Spannungsniveaus, dritte Dimension Spannung und Woehlerlinie.
- Archetyp: 3D-Datenplot.
- Komposition: grossformatiger 3D-Dichteplot in quellnaher Dreiviertelansicht mit direkt beschrifteter Woehlerlinie; keine Erklaerbaender.
- Animation: Dichteverteilungen; Woehlerlinie als Verbindung der Maxima.
- Trigger: `Die Dichtefunktion beschreibt das Ausfallverhalten ueber der Zeit fuer ein spezifisches Lastniveau`, `Erweitert man nun die Darstellung um die Dimension der Spannung`.

### Szene 30 - Ausfalldichte eines NKW-Getriebes

- Referenz: Quelle 32.
- Must preserve: 6-Gang-NKW-Getriebe, 2.115 Schadensereignisse, 82 Klassen, normierte Lebensdauer, rechtsschiefe beziehungsweise linkssteile Verteilung, Ausfaelle ab t=0, nicht wuenschenswerter Verlauf und gewuenschte Rechtsverschiebung. Garantie- und Imagefolgen bleiben im Sprechertext und werden nicht als zusaetzliche sichtbare Ebene wiederholt.
- Archetyp: Analyseplot mit Diagnose und Zielzustand.
- Komposition: Dichteplot links; genau ein gebuendeltes Seitenpanel rechts fuer Prueffrage, Diagnose und Ziel. Keine semantisch unbegruendete Flaechenfuellung unter der IST-Kurve.
- Animation: reale Dichtekurve; Prueffrage; Diagnose der Schiefe und fruehen Ausfaelle; gewuenschte Rechtsverschiebung.

### Szene 31 - Dichtefunktion menschlicher Sterbefaelle

- Referenz: Quelle 33.
- Must preserve: Maenner- und Frauenkurve sowie Maximum bei etwa 78 beziehungsweise 87 Jahren. Die Anstiegsbereiche und allgemeine statistische Anwendbarkeit werden durch Sprechertext und Kurvenverlauf getragen.
- Archetyp: Vergleichsplot.
- Komposition: grosser Zwei-Kurven-Plot mit zwei getrennten Peaklabels; keine Anstiegsmarker und kein Transferstreifen.
- Animation: beide Dichtekurven; Peak Maenner; Peak Frauen.

### Szene 32 - Summenhaeufigkeit und empirische Verteilungsfunktion

- Referenz: Quelle 34.
- Must preserve: normales Histogramm, kumuliertes Histogramm, Aufsummieren der Klassen und empirische Verteilungsfunktion `F*(t)`.
- Archetyp: Vorher-Nachher-Diagramm.
- Komposition: Haeufigkeit links; kumulierte Haeufigkeit mit `F*(t)` rechts; gerichtete Verbindung.
- Animation: Einzelhaeufigkeiten; kumulierte Balken; empirische Verbindungslinie.

### Szene 33 - Verteilungsfunktion F(t)

- Referenz: Quelle 35.
- Must preserve: glatte S-Kurve von 0 bis 100 Prozent, `F(t)` als Ausfallwahrscheinlichkeit, Integralbeziehung `F(t) = Integral f(tau) dtau` und Ableitung `f(t) = dF(t)/dt`.
- Archetyp: Formel und Funktionsplot.
- Komposition: S-Kurve links; mathematische Beziehung und Interpretation rechts.
- Animation: S-Kurve; Integralbeziehung; Ableitungsbeziehung; statistische Bedeutung.

### Szene 34 - Ausfallwahrscheinlichkeit eines NKW-Getriebes

- Referenz: Quelle 36.
- Must preserve: 2.115 Schadensereignisse, 82 Klassen, normierte Lebensdauer, Ablesen des Zeitpunkts bei 10 Prozent und Ablesen der Ausfallwahrscheinlichkeit bei t=1.
- Archetyp: interaktiver Ableseplot.
- Komposition: grosser CDF-Plot; zwei farblich getrennte Lesewege mit Ergebnisfeldern.
- Animation: Kurve; Leseweg 10 Prozent zu Zeitpunkt; Leseweg t=1 zu Prozentwert.

### Szene 35 - Ausfallwahrscheinlichkeit des Menschen

- Referenz: Quelle 37.
- Must preserve: Maenner- und Frauenkurve sowie Werte bei 80 Jahren: 62 Prozent Maenner und 36 Prozent Frauen.
- Archetyp: Vergleichsplot mit gemeinsamem Ablesepunkt.
- Komposition: CDF-Vergleich; vertikale 80-Jahre-Linie; zwei Ergebnislabels.
- Animation: beide Kurven; gemeinsamer 80-Jahre-Ablesepunkt und Werte.

### Szene 36 - Ueberlebenswahrscheinlichkeit R(t)

- Referenz: Quelle 38.
- Must preserve: Reliability-Begriff, ausgefallene plus intakte Teile gleich 100 Prozent, `R(t)=1-F(t)`, Flaechenintegral von 0 bis tx fuer `F(tx)` und von tx bis unendlich fuer `R(tx)`.
- Archetyp: Formel mit Flaechenzerlegung.
- Komposition: zentrale Grundgleichung; darunter Dichtekurve mit zwei komplementaeren Flaechen und zugehoerigen Integralen.
- Animation: Grundgleichung; Ausfallflaeche; Zuverlaessigkeitsflaeche.

### Szene 37 - Ausfallrate und Badewannenkurve

- Referenz: Quelle 39.
- Must preserve: `lambda(t)=f(t)/R(t)`, bedingtes Ausfallrisiko, drei Bereiche der Badewannenkurve, Ursachen und Massnahmen je Bereich sowie Bedeutung fuer die maximale Lebensdauer.
- Archetyp: Funktionsplot mit drei fachlichen Zonen.
- Komposition: Formel und Definition oben; Badewannenplot; darunter drei zonengleiche Ursache-Massnahmen-Bloecke.
- Animation: Formel und Definition; Kurve; Fruehausfaelle; Zufallsausfaelle; Ermuedungsausfaelle.

### Szene 38 - Ausfallrate des Menschen

- Referenz: Quelle 40.
- Must preserve: Kurven fuer Frauen und Maenner, Kindersterblichkeit, laengere nahezu konstante Phase mit ploetzlichen Ereignissen und starker altersbedingter Anstieg.
- Archetyp: Vergleichsplot mit drei Lebensphasen.
- Komposition: Hazard-Plot links; rechts drei Phasen mit Ursachen.
- Animation: beide Kurven; fruehe Phase; konstante Phase; Altersanstieg.

### Szene 39 - Ausfallrate eines NKW-Getriebes

- Referenz: Quelle 41.
- Must preserve: kontinuierlich steigende Ausfallrate, Verschleiss- und Ermuedungsausfaelle, kein typischer Badewannenverlauf und Aussage, dass nicht jedes Produkt alle drei Bereiche besitzt.
- Archetyp: Datenplot mit Gegenbeispiel.
- Komposition: grosser steigender Hazard-Plot; rechts Einordnung als Gegenbeispiel und Schlussfolgerung.
- Animation: steigende Kurve; Mechanismus Verschleiss/Ermuedung; Abgrenzung von der Badewannenkurve.

## QA-Schwerpunkte

- Inhalts-Crosscheck gegen jede zugeordnete Quell-SVG und den vollstaendigen Sprechertext.
- Funktionsleiste in allen Szenen identisch; nur aktive Funktion aendert Hervorhebung.
- Plotdaten, Einheiten, Achsen und Kurvenbeziehungen innerhalb zusammenhaengender Sequenzen konsistent.
- Alle mathematischen Formeln kontrolliert gesetzt und fachlich korrekt.
- Plotrahmen, Daten, Kurven, Flaechen und Hilfslinien als vollstaendige semantische Animationsgruppen.
- Keine Legende oder Achsenbeschriftung unter der fuer kleine Seminaransichten erforderlichen Lesegroesse.
- Kein Lautsprecher, keine externen Bildpfade und keine verlorenen Kurven-, Flaechen- oder Richtungsaussagen.
- Jede Szene nach der Produktion einzeln crosschecken und browserbasiert pruefen; erst danach die naechste freigeben.

## Produktionsstatus

- Umgesetzt: 13 von 13 Szenen (`slide_027` bis `slide_039`).
- Quellen: PowerPoint-SVGs 28 bis 41; Quellen 29 und 30 wurden in Szene 28 zusammengefuehrt.
- Animation: 64 sprechertextgefuehrte Schritte; SVG-Manifeste und Element-Animationsplaene sind synchron.
- Inhalts-Crosscheck: 13 von 13 Szenen bestanden.
- Strikte gerenderte Layout-QA: 13 SVGs, 13 Manifeste und 52 gepruefte Animationszustaende; 0 Fehler, 0 Warnungen.
- Viewer-Pruefung fuer Szenen 27 bis 39: 0 Fehler. Die 13 Kapitelwarnungen betreffen ausschliesslich das erwartete Nicht-16:9-Seitenverhaeltnis der eingebetteten Python-Plot-Assets.
