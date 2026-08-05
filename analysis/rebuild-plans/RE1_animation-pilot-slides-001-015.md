# RE1 Animation Pilot: Slides 001-015

## Zweck

Dieser Pilot ersetzt die alte DOM-Heuristik der ersten 15 Zielszenen durch ausdrueckliche didaktische Entscheidungen. Jede Entscheidung basiert auf dem vollstaendigen Sprechertext, dem Quell-SVG und der fachlichen Funktion der Darstellung.

Verbindliche Regeln fuer diesen Pilot:

- Keine Animation wird allein aus SVG-Elementtypen oder DOM-Reihenfolge abgeleitet.
- Fachlich zusammengehoerige Texte, Formen, Bilder und Beschriftungen erscheinen gemeinsam.
- Dauerhafte Orientierung, Titel und rein dekorative Elemente bleiben sichtbar.
- Quellenhinweise erscheinen gemeinsam mit dem zugehoerigen Fallbeispiel.
- Dichte Vergleichsdarstellungen duerfen bewusst statisch bleiben.
- Der Endzustand entspricht weiterhin dem vollstaendigen Quellinhalt.

## Szenenentscheidungen

### slide_001 - A320neo-Rueckruf

- Entscheidung: `animated`
- Erzaehllogik: allgemeine Motivation, konkreter Triebwerksfall, wirtschaftliches Ausmass.
- Gruppe `a320_case_context`: Bild, Quelle, Materialmangel, Ursache und Folge als ein Fallmodul.
- Gruppe `a320_business_impact`: Hersteller, Stueckzahl und Kosten als ein Wirkungsmodul.
- Begruendung: Der Sprechertext wechselt klar vom technischen Fall zu dessen wirtschaftlichen Auswirkungen.

### slide_002 - Rueckrufe auf dem Hoechststand

- Entscheidung: `animated`
- Erzaehllogik: Zurueckhaltung der Hersteller, danach offizielle KBA-Daten.
- Gruppe `recall_statistics_chart`: die dichte Statistik wird als unteilbare Vergleichsgrafik eingeblendet.
- Begruendung: Eine interne Zerlegung des eingebetteten Diagramms waere technisch statt fachlich motiviert.

### slide_003 - Takata-Airbags

- Entscheidung: `animated`
- Gruppe `takata_case_context`: Bild, Quelle, Fehlerursache und Verletzungsfolge.
- Gruppe `takata_scope_and_consequences`: 34 Millionen Fahrzeuge, Kosten, Recht und Image.
- Begruendung: Ursache/Folge und Ausmass/Konsequenzen sind zwei getrennte Sprecherabschnitte.

### slide_004 - Galaxy Note 7

- Entscheidung: `animated`
- Gruppe `note7_case_context`: Bild, Quellen, Designfehler, Akkubraende und betroffenes Volumen.
- Gruppe `note7_business_impact`: Rueckrufgroesse, Verlust und Imageschaden.
- Begruendung: Der Sprechertext leitet die Konsequenzen ausdruecklich als zweiten Block ein.

### slide_005 - Konsequenzen von Unzuverlaessigkeit

- Entscheidung: `animated`
- Gruppe `consequence_structure`: gemeinsame Gliederung in rechtlich und nicht rechtlich.
- Gruppe `nonlegal_consequences`: wirtschaftliche Verluste und Image.
- Gruppe `civil_consequences`: Gewaehrleistung und Produkthaftung.
- Gruppe `criminal_consequences`: strafrechtliche Produktverantwortung und Sanktionen.
- Begruendung: Die vier Gruppen entsprechen exakt der Reihenfolge der Erklaerung.

### slide_006 - Einfluesse auf die Zuverlaessigkeit

- Entscheidung: `animated`
- Gruppe `reliability_core`: Zuverlaessigkeit als gemeinsames Bezugszentrum.
- Gruppe `development_pressure`: Entwicklungszeit und Entwicklungskosten.
- Gruppe `complexity_pressure`: Funktionalitaet und Komplexitaet.
- Gruppe `counteracting_demands`: Produkthaftung, Fehlerkosten und Kundenanforderungen.
- Begruendung: Der Sprechertext fuehrt diese Einflussfamilien nacheinander ein.

### slide_007 - Kriterien beim PKW-Neuwagenkauf

- Entscheidung: `static`
- Begruendung: Die Aussage entsteht aus dem direkten Gesamtvergleich der Kriterien und Jahre. Ein Aufbau einzelner Achsen, Jahre oder Balken wuerde die Vergleichbarkeit verschlechtern und wird vom Sprechertext nicht einzeln gefuehrt.

### slide_008 - Motivation

- Entscheidung: `animated`
- Gruppe `forecast_quote_setup`: Aussage ueber Leben, Tod und Maschinenausfall.
- Gruppe `forecast_quote_resolution`: Pointe "Machen Sie zwei daraus."
- Begruendung: Die Pointe soll erst an ihrer gesprochenen Stelle sichtbar werden; Hintergrund und Bildmotive bleiben als Orientierung stehen.

### slide_009 - Was ist Zuverlaessigkeit?

- Entscheidung: `animated`
- Gruppe `vehicle_system_hierarchy`: PKW, Baugruppen, Motorbauteile und Verbindungslinien.
- Gruppe `function_examples`: Funktions- und Fehlfunktionsbeispiele fuer PKW und Motor.
- Begruendung: Erst wird die Systemstruktur aufgebaut, danach wird Zuverlaessigkeit ueber die Funktion erklaert.

### slide_010 - Stress Strength Interference

- Entscheidung: `animated`
- Gruppe `ssi_diagram_frame`: Diagrammrahmen und statistische Verteilungen als gemeinsames Modell.
- Gruppe `ssi_stress_context`: Belastung und ihre nutzungsseitigen Einfluesse.
- Gruppe `ssi_strength_context`: Belastbarkeit und ihre produktseitigen Einfluesse.
- Gruppe `ssi_failure_consequences`: Ueberlappung, Ausfaelle und Konsequenzen.
- Begruendung: Die vier Gruppen folgen der fachlichen Leselogik des Sprechertexts; technische Pfade werden nicht einzeln animiert.

### slide_011 - Belastbarkeit verschieben

- Entscheidung: `animated`
- Dauerhafter Kontext: Ausgangsdiagramm und Einflussfaktoren sind sofort sichtbar.
- Gruppe `shifted_strength_curve`: verschobene Belastbarkeitskurve wird gezeichnet.
- Gruppe `reduced_failure_overlap`: kleinerer Ueberlappungsbereich wird eingeblendet.
- Begruendung: Nur die erklaerte Zustandsaenderung wird animiert; der bekannte Kontext bleibt stabil.

### slide_012 - Kosten der Ueberdimensionierung

- Entscheidung: `animated`
- Dauerhafter Kontext: Stress-Strength-Modell und reduzierte Ausfaelle sind sofort sichtbar.
- Gruppe `quality_cost_tradeoff`: Kostenhinweis und zugehoerige Grafik erscheinen gemeinsam.
- Begruendung: Die einzige neue visuelle Aussage dieser Szene ist der Zielkonflikt aus weniger Ausfaellen und Mehrkosten.

### slide_013 - Definition Zuverlaessigkeit

- Entscheidung: `animated`
- Gruppe `reliability_definition`: Definition, Prozentbezug und alle unmittelbar zugehoerigen visuellen Markierungen.
- Begruendung: Die Definition ist eine unteilbare fachliche Einheit; einzelne Woerter oder Formelbestandteile werden nicht separat animiert.

### slide_014 - Einteilung der Zuverlaessigkeitsmethoden

- Entscheidung: `animated`
- Gruppe `bathtub_curve_overview`: Achsen, Badewannenkurve und drei Ausfallbereiche.
- Gruppe `qualitative_method_focus`: Systemanalyse und Fokus auf Fruehausfaelle.
- Gruppe `quantitative_method_focus`: Nachweis und Fokus auf Ermuedungsausfaelle.
- Begruendung: Erst wird die gemeinsame Ausfalllogik orientiert, danach werden die beiden Methodenkategorien zugeordnet.

### slide_015 - Methoden als Werkzeugkaesten

- Entscheidung: `animated`
- Referenzen: Quellfolien 15 und 16 bilden zusammen eine Zielszene.
- Gruppe `method_toolboxes`: beide Kategorien und ihre gemeinsame Struktur.
- Gruppe `qualitative_toolbox`: Zweck und Beispiele der qualitativen Methoden.
- Gruppe `quantitative_toolbox`: Zweck und Beispiele der quantitativen Methoden.
- Begruendung: Die zusammengefuehrten Quellzustaende werden nicht als Folienwechsel, sondern als fachliche Werkzeugkaesten aufgebaut.

## QA-Fokus

Fuer jede Szene werden nach der Umsetzung geprueft:

- jede Triggerphrase kommt im vollstaendigen Sprechertext vor,
- jede Manifest-ID existiert genau einmal im SVG,
- keine alte Heuristikgruppe bleibt als Animationstarget aktiv,
- zusammengehoerige Inhalte erscheinen gleichzeitig,
- Aufzaehlungszeichen, Abschnittslabel und zugehoerige Unterpunkte liegen in derselben Animationsgruppe; insbesondere werden `Ausmass`-Grenzen auf slide_001 und slide_003 nicht aus PowerPoint-Exportgruppen uebernommen,
- der vollstaendige Endzustand bleibt fachlich und visuell erhalten,
- Crosscheck und SVG-QA werden szenenweise ausgefuehrt.
