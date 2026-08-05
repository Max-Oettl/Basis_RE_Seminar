# RE1 Kapitel 1 – Education-Redesign und Animationsdramaturgie

## Identität und Scope

- Modul: `RE1`
- Kapitel: `Kapitel 1 – Einleitung`
- Lektion 1: Ziel-Szenen `slide_001` bis `slide_008`
- Lektion 2: Ziel-Szenen `slide_009` bis `slide_013`
- Umfang: `module_redesign`
- Ausgabemodus je Szene: `full_slide`
- Zielauflösung: `1920 x 1080`
- Fachquellen: Quell-SVGs `Folie1.SVG` bis `Folie13.SVG`
- Sprachquelle: wortgetreue Zuordnung in `analysis/inventories/RE1_svg-text-map.json`
- Zielmarke: `RelTest Education`

## Referenz-Lock

- Benanntes Referenzmodul: `RE1`
- Konkrete Ziel-SVGs:
  - `rebuild-proposals/svg/RE1/slide_001/slide_001.svg` für die Medien-/Fallstudienlogik
  - `rebuild-proposals/svg/RE1/slide_005/slide_005.svg` für hierarchische Fachstrukturen
  - `rebuild-proposals/svg/RE1/slide_010/slide_010.svg` für Diagramm und flankierenden Kontext
- Der Referenz-Lock gilt nur für Kompositionsprinzip, Dichte, Abstände und
  fachliche Hierarchie. Alte Academy-Farben, alte Fontstacks und alte
  Animationsentscheidungen werden ausdrücklich nicht übernommen.
- Visuelle Autorität sind
  `brand/reltest-education-slide-design-tokens.json`,
  `brand/reltest-education-style-guide.md` und `agents/brand-guardian.md`.
- Signalgrün führt die Education-Akzente. Stahlcyan bleibt eine
  Diagrammfarbe.
- Oxanium wird ausschließlich für echte Display-Auszeichnungen und
  Schlüsselzahlen eingesetzt; Archivo trägt Inhalt, Labels und Quellen.
- Sichtbarer Folientitel, Titelakzent, Footer, Logo und Szenenkennung bleiben
  vollständig beim Downstream-Repository.
- Karten verwenden Radius `8`, Konturen `1.5–2.5 px`, keine Schatten.
- Verbinder liegen hinter ihren Endpunkten, sind höchstens `4 px` stark und
  erscheinen nie vor den zugehörigen Boxen.

## Kapitelweite Lern- und Designlogik

1. `slide_001` bis `slide_004` etablieren konkrete Rückruf-Fallstudien.
2. `slide_005` bis `slide_008` verdichten Folgen, Einflüsse, Kundensicht und
   Motivation.
3. `slide_009` bis `slide_013` leiten vom Systembegriff über
   Stress-Strength-Interference zur Definition der Zuverlässigkeit.

Die drei Fallstudien verwenden dieselbe visuelle Grammatik: dominantes
Quellmedium, technische Ursache/Folge und eine klar getrennte Wirkungsgruppe.
Die Diagrammfolge `slide_010` bis `slide_012` verwendet denselben Achsen-,
Kurven- und Farbvertrag.

## Folie-für-Folie-Plan

| Szene | Dominante Aussage | Komposition und Assetstrategie | Bewusster Initialzustand | Sprechertextgeführter Aufbau |
| --- | --- | --- | --- | --- |
| 001 | Ein Materialmangel trifft Haltbarkeit und Geschäftsergebnis. | Quellfoto rechts; Ursache/Folge links; Umfang und Kosten als drei Kennzahlkarten. | Das Triebwerksfoto gibt sofort Orientierung; Text und Kennzahlen bleiben verborgen. | Ursache/Folge bei „Ein Fall aus der jüngsten Vergangenheit“, Wirkung bei „Die Auswirkungen erstrecken sich auf die Hersteller“. |
| 002 | Sicherheitskritische Rückrufe haben sich mehr als verdreifacht. | Education-Python-Plot mit Achsenrahmen, Balken, Fahrzeuglinie und Schlusskennzahlen. | Achsen, Skalen und Legende sind sichtbar; Datenserien und Schlusskennzahlen fehlen noch. | Beide Datenserien gemeinsam bei der KBA-Datenquelle; Kennzahlen bei der Zehnjahresentwicklung. |
| 003 | Der Takata-Defekt verband Verletzungsgefahr und enormes Rückrufausmaß. | Quellfoto rechts; Ursache/Folge links; Umfang und Konsequenzen darunter. | Das Airbagfoto ist sichtbar; spätere Aussagen werden nicht vorweggenommen. | Ursache/Folge und danach Ausmaß/Konsequenzen. |
| 004 | Ein Akkudesignfehler führte zu Brandrisiko und massiver Geschäftswirkung. | Quellfoto rechts; identische Fallstudienlogik zu 001/003. | Das Produktfoto ist sichtbar. | Rückruffall/Auslöser und danach Konsequenzen. |
| 005 | Unzuverlässigkeit erzeugt wirtschaftliche, zivil- und strafrechtliche Folgen. | Gemeinsame Wurzel; drei gleichwertige Äste. Jeder Ast enthält seinen eigenen Verbinder, Karte und vollständigen Text. | Nur die gemeinsame Wurzel ist sichtbar. | Nicht-rechtlicher, zivilrechtlicher und strafrechtlicher Ast in Sprecherreihenfolge. |
| 006 | Sieben Faktoren wirken auf die Zuverlässigkeit. | Zuverlässigkeit im Zentrum; drei semantische Einflussfamilien mit ihren vollständigen Pfeil-/Label-Bündeln. | Das Bezugszentrum ist sichtbar; kein Pfeil steht ohne Ausgangslabel. | Entwicklungsdruck, Komplexität/Funktionalität, gegenläufige Anforderungen. |
| 007 | Zuverlässigkeit und Sicherheit führen den Mehrjahresvergleich an. | Vollständig sichtbarer Education-Python-Plot; Top-2 als ruhige Orientierung. | Vollständige statische Vergleichsgrafik. | Keine Animation, weil der Sprechertext den Gesamtvergleich liest. |
| 008 | Vorhersagbare Lebensdauer macht Stillstand planbar. | Quellfoto links; rechts eine zusammenhängende Zitatkarte mit originaler Schlusszeile; praktische Bedeutung in einer davon getrennten Ergebnisbox. | Die Content-Ebene bleibt bis zur SKF-Nennung leer; auch das konkrete Anlagenmotiv wird nicht vorweggenommen. | Anlagenkontext bei der SKF-Nennung, Zitatkörper, Schlusszeile `Machen Sie zwei daraus.` innerhalb derselben Zitatkarte und erst danach die praktische Bedeutung. |
| 009 | Funktionsverlust einer Komponente wirkt bis zur Systemfunktion. | PKW-Wurzel, Systembaum, Funktionsbeziehungen und Fehlerfortpflanzung. | Nur der PKW als Bezugsobjekt ist sichtbar. | Hierarchie, Funktionen und Fehlerwirkung. Verbinder erscheinen jeweils mit ihren Endpunkten. |
| 010 | Ausfälle entstehen im Überlappungsbereich von Belastung und Belastbarkeit. | Education-Python-Plot mit gleich hohen Hauptverteilungen; eigenständige korallfarbene Ausfallverteilung mit Kontur vom sichtbaren Beginn bis zum Ende der Überlappung; Kontextkarten links/rechts und Folgen darunter. | Achsen und Diagrammrahmen sind sichtbar. | Belastung plus Einflusskarte, Belastbarkeit plus Einflusskarte, Ausfallverteilung, Folgen. Gleich getriggerte Elemente starten gemeinsam. |
| 011 | Eine rechtsverschobene Belastbarkeit reduziert den Ausfallbereich. | Ausgangslage als ruhige gestrichelte Referenz; dieselbe gleich hohe Zielkurve bewegt sich fachlich nach rechts. Die Ausfallverteilung wird entsprechend schmaler und niedriger. | Belastung, Achsen und gestrichelte Ausgangslage sind sichtbar. | Kurvenverschiebung und Erklärung gemeinsam; danach reduzierte Ausfallverteilung und Ergebnis gemeinsam. |
| 012 | Weniger Ausfälle stehen Mehrkosten durch Überdimensionierung gegenüber. | Bekannter Plot links mit gleich hohen Hauptverteilungen und klar begrenzter kleiner Ausfallverteilung; fachlich erkennbare Waage und Zielkorridor rechts. | Der bekannte Stress-Strength-Kontext bleibt sichtbar. | Gesamter Zielkonflikt erscheint bei der gesprochenen Mehrkosten-Aussage. |
| 013 | Zuverlässigkeit verbindet Wahrscheinlichkeit, Produkt, Zeit und Bedingungen. | Definition als ruhige, typografisch gegliederte Satzstruktur. | Bewusst leerer Inhaltsframe: Die Definition beginnt unmittelbar mit dem ersten Satz. | Gesamte Definition als eine unteilbare fachliche Einheit. |

## Animationsregeln

- Effektfamilie: `show` als ruhiges Fade mit `16 Frames`.
- `draw` nur für entstehende Datenserien oder Kurven, `36–42 Frames`.
- `transform` nur für die fachliche Kurvenverschiebung auf `slide_011`.
- Kein Blur und keine dekorative Bewegung.
- Triggerphrasen sind exakte, eindeutige Ausschnitte mit drei bis acht Wörtern.
- Gleiche Triggerphrase bedeutet gleichzeitiger Start im Reviewer.
- Ein Connector ist Bestandteil derselben semantischen Gruppe wie der neu
  erscheinende Endpunkt.
- Bereits bei Frame 0 sichtbarer Kontext ist kein Animationstarget.

## Assets und Spezialpfade

| Motiv | Strategie | Ziel |
| --- | --- | --- |
| A320neo-Triebwerk, Takata-Airbag, Galaxy Note 7, Industrieanlage | extrahiertes Quellmedium | lokale `media/`-Datei der Szene |
| Rückrufstatistik und Kaufkriterien | Python-Plot | lokale `plots/*.svg` plus `data/*.json` |
| Stress-Strength-Diagramme | Python-Plot | identischer Education-Plotvertrag in 010–012: gleiche Spitzenhöhe von Belastung und Belastbarkeit; eigenständige, konturierte Ausfallverteilung exakt innerhalb des sichtbaren Überlappungsintervalls |
| Kosten, Haftung, Kundenzufriedenheit | vorhandene freigegebene Rasterpiktogramme | lokale `media/`-Dateien in 010 |
| Zielkonflikt-Waage | vorhandenes freigegebenes Rasterasset | lokale `media/`-Datei in 012 |
| Systembaum, Einflusskarte, Definition | native SVG-Komposition | semantische Gruppen im Szenen-SVG |

## Verbindliche QA

- Jede Szene wird einzeln generiert, gerendert und geprüft.
- Pro Szene: Source-Target-Abgleich, Sprechertext-Crosscheck, XML-/ID-/Target-QA,
  Strict-Design-QA und – soweit verfügbar – Layout-QA.
- Für animierte Szenen werden Initialzustand, jeder Zustand vor/nach einer
  Triggergruppe und der Endzustand geprüft.
- Kapitelweiter Abschlusscheck: Fallstudienraster, Typografie, Farbrollen,
  Achsenvertrag 010–012, Pfeilstärken und Dichte.
- Keine sichtbare Altbezeichnung `RelTest Academy`, kein Profil
  `reltest-academy`, keine führende Cyan-Signatur.
- Keine sichtbaren Downstream-Titel, Footer, Logos oder Szenenkennungen.
