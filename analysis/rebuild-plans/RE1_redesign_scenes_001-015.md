# RE1 Redesign-Plan: Szenen 001-015

## Auftrag

- Umfang: erste 15 Ziel-Szenen von RE1
- Modus: `module_redesign` mit Ausgabe `full_slide`
- Canvas: 1920 x 1080
- Quellen: PowerPoint-SVGs `Folie1.SVG` bis `Folie16.SVG` und gemappte Sprechertexte
- Besonderheit: Szene 015 konsolidiert die Quellfolien 15 und 16.
- Inhaltsregel: fachliche Inhalte vollständig erhalten, aber visuell neu strukturieren.
- Medienregel: Quellmedien verlustfrei extrahieren; den 64-x-64-PowerPoint-Lautsprecher immer ausschließen.
- Logoregel: kein Logo rekonstruieren. Bis ein offizielles Logo vorliegt, bleibt dessen Footerzone frei.

## Sequenzdramaturgie

1. Szenen 001-004: konkrete Rückruf-Fallstudien und wirtschaftliche Folgen.
2. Szenen 005-008: Konsequenzen, Einflussgrößen, Kundenerwartungen und Motivation.
3. Szenen 009-013: Zuverlässigkeit fachlich herleiten und definieren.
4. Szenen 014-015: Zuverlässigkeitsmethoden einordnen und als Werkzeugkästen konkretisieren.

## Gemeinsame Gestaltung

- Vollständiger BrandFrame mit hellem technischem Hintergrund, 80-px-Raster, Titelzone und Footer.
- Titel linksbündig, ohne zusätzliche Titelkarte.
- Keine Karte um den gesamten Inhalt; Karten nur für echte fachliche Einheiten.
- Fallstudien verwenden dieselbe Medien-/Faktenlogik, aber unterschiedliche semantische Kennzahlen.
- Echte Diagramme werden mit Python erzeugt und ohne sichtbaren Diagrammtitel DOM-adressierbar eingebettet.
- Primärtext bleibt mindestens 22 px groß; Quellen dürfen als 16-px-Metadaten erscheinen.
- Animationen folgen ausschließlich den fachlichen Abschnitten des Sprechertexts. Zusammengehörige Karten, Labels und Inhalte bleiben atomar.

## Szenenplan

| Szene | Quellen | Archetyp | Dominante Lernbotschaft | Neuaufbau | Animation |
|---|---|---|---|---|---|
| 001 | 1 | Media Aside / Fallstudie | Ein Materialfehler kann technische Haltbarkeit und Geschäftsergebnis gleichzeitig treffen. | Triebwerksfoto rechts; links Ursache/Folge und darunter Kennzahlen zu Umfang/Kosten. | Ursache und Folge gemeinsam; Umfang und Kosten später gemeinsam. |
| 002 | 2 | Datenfolie | Sicherheitskritische PKW-Rückrufe haben sich 2009-2019 mehr als verdreifacht. | Python-Kombinationsdiagramm mit Rückrufaktionen und betroffenen Fahrzeugen; Kennzahlen 125 und 390 als Fokus. | Diagrammrahmen, Balkenreihe, Fahrzeuglinie, Schlussfolgerung. |
| 003 | 3 | Media Aside / Fallstudie | Der Takata-Defekt verband akute Verletzungsgefahr mit globalem Rückrufausmaß. | Airbagfoto rechts; links Ursache/Folge; unten 34 Mio. Fahrzeuge und Konsequenzen. | Ursache/Folge gemeinsam; Ausmaß/Konsequenzen gemeinsam. |
| 004 | 4 | Media Aside / Fallstudie | Ein Akkudesignfehler führte zu Brandrisiko, 2,5 Mio. Geräten und 5,3 Mrd. US-Dollar Verlust. | Gerätefoto rechts; links Defekt/Folge; unten Umfang und Geschäftswirkung. | Defekt/Folge gemeinsam; Umfang und Geschäftswirkung gemeinsam. |
| 005 | 5 | Vergleich / Folgenstruktur | Unzuverlässigkeit erzeugt nicht-rechtliche, zivilrechtliche und strafrechtliche Folgen. | Dreispaltige Konsequenzstruktur mit gemeinsamer Wurzel; Inhalte vollständig aus der Quelle. | Orientierung, nicht-rechtlich, Zivilrecht, Strafrecht. |
| 006 | 6 | Kräftefeld | Zuverlässigkeit steht zwischen Entwicklungsdruck, wachsender Komplexität und gegenläufigen Anforderungen. | Zuverlässigkeit im Zentrum; linke Druckfaktoren, rechte Gegenkräfte; gerichtete Verbinder. | Zentrum, Entwicklungsdruck, Komplexität, Gegenkräfte. |
| 007 | 7 | Datenfolie | Zuverlässigkeit und Sicherheit sind beim Neuwagenkauf die wichtigsten Kriterien. | Python-Horizontalbalken für elf Kriterien und vier Jahre; Top-2 visuell fokussiert. | Statisch, weil der Sprechertext den Gesamtvergleich erklärt. |
| 008 | 8 | Key Takeaway / Zitat | Maschinenausfälle sollen vom Unvorhersehbaren zum planbaren Ereignis werden. | Großes Zitat mit reduzierter Industrieaufnahme; Pointe als separates Takeaway-Band. | Zitat-Aufbau und Pointe; kein Mikro-Reveal einzelner Wörter. |
| 009 | 9 | Systemhierarchie | Zuverlässigkeit bezieht sich auf den Funktionserhalt jedes Elements in der Systemstruktur. | PKW -> Teilsysteme -> Motorkomponenten; daneben Funktion und Fehlfunktion auf zwei Ebenen. | Systemhierarchie; danach Funktions-/Fehlfunktionsbeispiele. |
| 010 | 10 | Technisches Diagramm | Ausfälle entstehen dort, wo Belastung die Belastbarkeit übersteigt. | Python-Verteilungsplot mit Überlappung; seitliche Einflusslisten und Folgechips. | Rahmen, Belastung, Belastbarkeit, Überlappung/Folgen. |
| 011 | 11 | Technisches Diagramm / Zustandsänderung | Höhere Belastbarkeit verschiebt die Verteilung und verkleinert den Ausfallbereich. | Gleicher Achsen- und Datenvertrag wie 010; Ausgangs- und neue Belastbarkeit mit Verschiebungspfeil. | Verschobene Kurve zeichnen; reduzierten Überlappungsbereich hervorheben. |
| 012 | 12 | Trade-off | Ausfallreduktion durch höhere Belastbarkeit steht zusätzlichen Kosten gegenüber. | Gleicher Stress-Strength-Plot; daneben Balance aus Ausfällen und Kosten mit Zielkorridor. | Qualitäts-/Kosten-Trade-off als zusammenhängende Gruppe. |
| 013 | 13 | Definition | Zuverlässigkeit ist eine Wahrscheinlichkeit für ausfallfreien Funktionserhalt unter Zeit- und Bedingungsbezug. | Definition als klare Satzstruktur; vier Schlüsselbegriffe visuell verankert. | Definition als eine unteilbare fachliche Einheit. |
| 014 | 14 | Diagramm + Methodenfokus | Qualitative Methoden adressieren primär Frühausfälle, quantitative Methoden primär Ermüdungsausfälle. | Python-Badewannenkurve mit drei Bereichen; zwei Methodenkarten sind den relevanten Bereichen zugeordnet. | Kurvenübersicht, qualitativer Fokus, quantitativer Fokus. |
| 015 | 15, 16 | Vergleich / Werkzeugkästen | Qualitative und quantitative Methoden ergänzen sich und erfüllen unterschiedliche Aufgaben. | Zwei gleichwertige Werkzeugkästen mit Ziel, typischen Methoden und gemeinsamer Schlussfolgerung. | Orientierung, qualitativer Werkzeugkasten, quantitativer Werkzeugkasten. |

## Plot- und Datenvertrag

- Szene 002: Balken = Anzahl Rückrufaktionen, Linie = betroffene Fahrzeuge in Mio.; Daten aus der eingebetteten Quellgrafik digitalisiert und lokal dokumentiert.
- Szene 007: Balkenlängen werden aus der Vektorgeometrie der Quellfolie abgeleitet; Reihenfolge und vier Jahresreihen bleiben erhalten.
- Szenen 010-012: identische x-Achse, identische Belastungsverteilung und konsistente Belastbarkeitsparameter; nur die fachlich erklärte Verschiebung ändert sich.
- Szene 014: schematische Badewannenkurve, drei beschriftete Lebensdauerbereiche, keine vorgetäuschten Messwerte.

## Freigabeschwerpunkte

- Vollständiger Inhaltsabgleich gegen jede referenzierte Quellfolie.
- Triggerphrase muss wortgetreu im gemappten Sprechertext vorkommen.
- Keine getrennten Bullet-/Label-Fragmente innerhalb einer Animationsgruppe.
- Alle plotinternen Ziele im Haupt-SVG-DOM erreichbar.
- Keine externen Ressourcen, Skripte, Inline-Animationen oder PowerPoint-Lautsprecher.
- Statischer Endzustand jeder Szene bleibt vollständig verständlich.

