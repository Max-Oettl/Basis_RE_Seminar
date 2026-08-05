# RE1 Kapitel 2 - Redesignplan

## Identitaet Und Scope

- Modul: RE1
- Kapitel: Kapitel 2 - Einfuehrung in Zuverlaessigkeitsmanagement
- Zielszene: Folien 14 bis 26
- Lektion 1: Folien 14 bis 16
- Lektion 2: Folien 17 bis 26
- Umfang: `module_redesign`
- Ausgabemodus je Szene: `full_slide`
- Zielsystem: Basis Rebuild Viewer und Praesentationsmodus
- Zielaufloesung: 1920 x 1080
- Quellen: PowerPoint-SVGs Folie 14 bis 27 und gemappter Sprechertext aus `RE1_scene-plan.json`

## Quellabbildung

| Zielszene | Quell-SVG | Funktion in der Sequenz |
| --- | --- | --- |
| 14 | 14 | Badewannenkurve ordnet qualitative und quantitative Methoden ein. |
| 15 | 15, 16 | Zwei Aufbauzustaende werden zu zwei vollstaendigen Werkzeugkaesten zusammengezogen. |
| 16 | 17 | Konstruktive Auslegung und Zuverlaessigkeitsabsicherung wirken gemeinsam. |
| 17 | 18 | Gesamtueberblick ueber die fuenf Phasen des Zuverlaessigkeitsmanagements. |
| 18 | 19 | Phase 1: Ziele, Zielkaskade und repraesentative Lastkollektive. |
| 19 | 20 | Phase 2: Systemverstaendnis, kritische Mechanismen und Designverbesserung. |
| 20 | 21 | Methodenfolge P-Diagramm, Blockschaltbild, Fehlerbaum und FMEA. |
| 21 | 22 | Phase 3: Erprobung zur Verbesserung und zum quantitativen Nachweis. |
| 22 | 23 | Zielsetzungen von Zuverlaessigkeitstests. |
| 23 | 24 | Phase 4: Produktionsqualitaet mit P-FMEA, DOE und Screening. |
| 24 | 25 | Bausteine der produktbezogenen systematischen Erprobung. |
| 25 | 26 | Produktionsabsicherung liefert die repraesentative Stichprobe fuer die Erprobung. |
| 26 | 27 | Phase 5: Feldbeobachtung, Zielerreichung und Lessons Learned. |

## Sequenzlogik

### Lektion 1 - Methodenrahmen

1. Folie 14 verankert die Methodenkategorien in den Ausfallbereichen der Badewannenkurve.
2. Folie 15 konkretisiert beide Kategorien als komplementaere Werkzeugkaesten.
3. Folie 16 zeigt, dass Methoden allein nicht genuegen: Auslegung und Absicherung muessen zusammenarbeiten.

### Lektion 2 - Zuverlaessigkeitsmanagement

1. Folie 17 zeigt den vollstaendigen Fuenf-Phasen-Prozess.
2. Folien 18 bis 23 vertiefen Planung, qualitative Analyse, Erprobung und Produktion.
3. Folien 24 und 25 integrieren Produkt- und Produktionsabsicherung zu einer systematischen Erprobungslogik.
4. Folie 26 schliesst den Prozess mit Felddaten und dem Rueckfluss in die naechste Produktgeneration.

## Gemeinsame Gestaltung

- BrandFrame und Typografie entsprechen `reltest-academy-slide-design-tokens.json`.
- Detailfolien des Managementprozesses verwenden eine kompakte Phasenleiste mit fuenf nummerierten Stationen. Die aktive Phase wird cyan hervorgehoben; die uebrigen Phasen bleiben als ruhiger Kontext sichtbar.
- Phasen werden nicht durch eine dekorative Regenbogenpalette codiert. Semantische Farben bleiben ihrer Bedeutung vorbehalten: Gruen fuer Verbesserung/Nachweis, Amber fuer Zielkonflikte oder Planung, Rot fuer Risiken und Fehler.
- Piktogramme kommen aus `components/pictogram-library/` und dienen als fachliche Anker fuer Ziel, System, Test, Produktion, Feldbeobachtung und Rueckkopplung.
- Echte Datenplots kommen aus Python. In Kapitel 2 ist nur die Badewannenkurve auf Folie 14 ein Python-Plot. Prozess-, Block- und Fehlerbaumdarstellungen bleiben kontrollierte SVG-Kompositionen.
- Der PowerPoint-Lautsprecher wird in keiner Zielszene uebernommen.

## Szenenbriefe

### Folie 14 - Einteilung der Zuverlaessigkeitsmethoden

- Must preserve: Frueh-, Zufalls- und Ermuedungsausfaelle; qualitative und quantitative Methoden; Systemanalyse. Lebensdauerversuche, Berechnungen und Simulationen bleiben bewusst im Sprechertext und werden auf Wunsch nicht zusätzlich in der unteren Nachweisbox wiederholt.
- Archetyp: Daten-/Diagrammfolie.
- Komposition: grosse Badewannenkurve, darunter zwei Methodenfokusse.
- Animation: Kurvenueberblick, qualitativer Fokus, quantitativer Fokus.
- Bestehendes Redesign wird in die Kapitelsequenz uebernommen und erneut geprueft.

### Folie 15 - Zwei Werkzeugkaesten

- Must preserve: qualitative und quantitative Methoden, ihre Aufgaben und alle genannten Beispielmethoden.
- Archetyp: symmetrischer Vergleich.
- Komposition: zwei gleichgewichtige Werkzeugkaesten ohne Richtungspfeile als Dekoration.
- Animation: Orientierung, qualitativer Werkzeugkasten, quantitativer Werkzeugkasten.
- Quellfolien 15 und 16 werden als ein Endzustand zusammengefasst.

### Folie 16 - Auslegung und Absicherung

- Must preserve: bewaehrte Konstruktionsrichtlinien, repraesentatives Lastkollektiv, abgesicherte Berechnungsrichtlinien, qualitative und quantitative Absicherungsmethoden.
- Lernbotschaft: Hohe Produktzuverlaessigkeit entsteht nur im Zusammenspiel von Entwicklung und Zuverlaessigkeitsteam.
- Archetyp: Kooperationsmodell.
- Komposition: Produktzuverlaessigkeit als gemeinsames Ziel ueber zwei tragenden Saeulen.
- Animation: konstruktive Auslegung, Erprobung und Absicherung, gemeinsames Ziel.
- Trigger: `Bei der konstruktiven Auslegung`, `Eine Zusammenarbeit zwischen Design und Zuverlaessigkeit-Team`, `Ein zuverlaessiges Produkt resultiert also immer nur aus Zusammenspiel`.

### Folie 17 - Fuenf Phasen des Zuverlaessigkeitsmanagements

- Must preserve: Produktlebenszyklus von Planung bis Recycling; alle fuenf Zuverlaessigkeitsphasen und ihre Methodenbeispiele.
- Lernbotschaft: Zuverlaessigkeit begleitet den gesamten Produktlebenszyklus in fuenf klaren Phasen.
- Archetyp: Prozessueberblick.
- Komposition: Lebenszyklusleiste plus fuenf horizontale Phasenbaender mit kompakten Methodenlisten.
- Animation: die fuenf Phasen erscheinen in Sprecherreihenfolge als vollstaendige Baender.
- Trigger: `In Phase eins der Zuverlaessigkeitsplanung`, `In Phase zwei, also waehrend der Konzeptions- und Entwurfsphase`, `Kommen wir nun zur dritten Phase`, `In Phase vier wird die Produktion`, `Und in der letzten Phase, waehrend des Feldeinsatzes`.

### Folie 18 - Phase 1: Zuverlaessigkeitsplanung

- Must preserve: gesetzliche Vorgaben, Kundenanforderungen, Firmenstrategie, technische Gegebenheiten, Zielkaskade System-Subsystem-Komponente und repraesentative Lastkollektive.
- Archetyp: Zielsystem und Kaskade.
- Komposition: Einflussfaktoren fuehren zum Systemziel; darunter Kaskade und daneben Betriebs-/Umgebungsbedingungen.
- Animation: Zieltreiber und Systemziel, Zielkaskade, Lastkollektiv.
- Trigger: `unter der Beruecksichtigung der gesetzlichen Vorgaben`, `Dieses Ziel wird auf der obersten Systemebene festgelegt`, `Ein zweiter wichtiger Punkt neben der Zuverlaessigkeitsplanung`.

### Folie 19 - Phase 2: Schwachstellenanalyse

- Must preserve: Systemgrenze, Einflussgroessen, Systemverstaendnis, kritische Fehlermechanismen und Komponenten, Design-Schwachstellen, Reduktion von Fruehausfaellen.
- Archetyp: Analyseprozess.
- Komposition: vier fachliche Schritte von Systemkontext bis Designverbesserung.
- Animation: Kontext, innere Analyse, Schwachstellen und Verbesserung.
- Trigger: `Ziel hier ist es ein tiefes Systemverstaendnis aufzubauen`, `Das System wird Innerhalb dieser Grenze nun genauer untersucht`, `Im Anschluss daran werden Design Schwachstellen abgeleitet`.

### Folie 20 - Methoden der Schwachstellenanalyse

- Must preserve: P-Diagramm, Bauteil-Blockschaltbild, Fehlerbaum und FMEA sowie ihre jeweilige Aufgabe.
- Archetyp: Methodenworkflow.
- Komposition: vier nummerierte Stationen mit eigenen Mini-Fachgrafiken und eindeutiger Ergebniszeile.
- Animation: jede Methode als vollstaendige Station in Sprecherreihenfolge.
- Trigger: `Ueber das P-Diagramm`, `Dafuer werden Bauteil-Blockschaltbilder verwendet`, `Hierfuer wird auf die Methode des Fehlerbaums zurueckgegriffen`, `Der Fehlerbaum ist auch eine sehr gute Vorarbeit fuer unsere naechste Methode`.

### Folie 21 - Phase 3: Zuverlaessigkeitserprobung

- Must preserve: HALT zur Schwachstellenidentifikation; ALT und Success Run Test zum quantitativen Nachweis; Verbesserung und Nachweis der Zuverlaessigkeit.
- Archetyp: Zwei Testpfade.
- Komposition: gemeinsame Testbasis teilt sich in Verbesserungs- und Nachweispfad.
- Animation: qualitativer Verbesserungsweg, quantitativer Nachweisweg.
- Trigger: `Die Erprobung kann dabei ebenfalls eingesetzt werden, um Schwachstellen zu identifizieren`, `Zusaetzlich koennen mit der Erprobung aber auch die Zuverlaessigkeitsziele quantitativ nachgewiesen werden`.

### Folie 22 - Zielsetzungen von Zuverlaessigkeitstests

- Must preserve: HALT, Degradation Test, Burn-In Test, End of Life Test, ALT, HASS; Ziele Verbesserung, Messung und weitere Vergleiche.
- Archetyp: Zielzuordnung.
- Komposition: Testmethoden links, drei Zielklassen rechts; die zwei Hauptziele sind visuell dominant.
- Animation: Verbesserung, Messung, weitere Fragestellungen.
- Trigger: `um die Zuverlaessigkeit zu verbessern`, `Es kann aber auch beispielsweise der Degradationsverlauf`, `Darueber hinaus sind aber auch andere Ziele denkbar`.

### Folie 23 - Phase 4: Produktionsabsicherung

- Must preserve: gleichbleibende Produktionsqualitaet, Prozess-FMEA, DOE, HASS/ESS, Burn-In, Run-In, HASA und Verbesserung der Zuverlaessigkeit.
- Archetyp: Produktionsqualitaets-Pipeline.
- Komposition: Risiko vermeiden, Prozess robust auslegen, Serie screenen und ueberwachen.
- Animation: Prozess-FMEA, DOE, Screening und Monitoring als drei Gruppen.
- Trigger: `Hierbei kann wieder auf die f m e a zurueckgegriffen werden`, `Auch die statistische Versuchsplanung kurz D-O-E findet Einsatz`, `Sicherstellung der Produktionsqualitaet`.

### Folie 24 - Systematische Produkterprobung

- Must preserve: funktionale Erprobung, qualitative Zuverlaessigkeitsanalyse, analytische Absicherung, Erprobung kritischer Komponenten, quantitative Absicherung sowie ALT, Degradation, End of Life und Success Run.
- Archetyp: gestufter Absicherungsprozess.
- Komposition: obere Funktionspruefung, darunter qualitative/analytische Absicherung und als notwendige Fortsetzung quantitative Erprobung.
- Animation: Funktion, qualitative Absicherung, quantitative Absicherung.
- Trigger: `Wir sprechen hierbei auch von der funktionalen Erprobung`, `mit Hilfe von qualitativen Zuverlaessigkeitsanalysen`, `quantitativen Zuverlaessigkeitsabsicherung`.

### Folie 25 - Produkterprobung und Produktion

- Must preserve: Planung und Optimierung der Serienfertigung, P-FMEA, DOE, Prozessfaehigkeit, Qualitaet, Screening/Qualitaetsueberwachung und repraesentative Stichprobe.
- Archetyp: integrierter Prozess.
- Komposition: Produktabsicherung bleibt als linker Kontext; rechts Produktionspfad; die repraesentative Stichprobe verbindet beide.
- Animation: Produktionsplanung/-optimierung, Serienqualitaet, repraesentative Stichprobe.
- Trigger: `Diese repraesentative Stichprobe kommt natuerlich aus der Produktion`, `unterstuetzt die Zuverlaessigkeitstechnik mit den statistischen Methoden wie Design of Experiments`, `So wird sichergestellt, dass die Serienfertigung ein qualitativ akzeptables Niveau erreicht`.

### Folie 26 - Phase 5: Feldprognosen

- Must preserve: Feldbeobachtung, Fruehwarnindikatoren, Felddatenermittlung/-auswertung, reale Produktzuverlaessigkeit, reale Belastung, kritische Ausfallmechanismen, Zielerreichung, Recall-Entscheidung und Lessons Learned.
- Archetyp: Rueckkopplungsschleife.
- Komposition: Feldprodukt fuehrt zu Beobachtung und Bewertung; Ergebnisse fliessen als Lernschleife in die naechste Generation zurueck.
- Animation: Beobachtung, Bewertung, Rueckkopplung.
- Trigger: `Sobald unser Produkt im Feld ist`, `nur mit Hilfe der Daten aus dem Feld final feststellen`, `wichtiger Input fuer die Weiterentwicklung der naechsten Produktgeneration`.

## QA-Schwerpunkte

- Inhalts-Crosscheck gegen alle Quell-SVGs 14 bis 27 und den vollstaendigen Sprechertext.
- Alle Phasen- und Methodennamen muessen woertlich sichtbar bleiben.
- Keine Lautsprecher-, PowerPoint- oder externen Bildreferenzen.
- Keine Textgroesse unter 18 px; primaere Aussagen mindestens 22 px.
- Phasenleiste, Karten, Mini-Diagramme und Verbinder duerfen sich in keinem Animationszustand ueberschneiden.
- Animationsgruppen enthalten jeweils Hintergrund, Icon, Label und vollstaendigen Text.
- Endzustand jeder Szene bleibt ohne abgespielte Animation verstaendlich.

## Eingearbeitetes Review-Feedback

### Folie 14 - fachliche Beziehungen vollstaendig erhalten

- Die Ursprungsgrafik wird nicht nur ueber ihre Begriffe, sondern ueber alle sichtbaren Beziehungen inventarisiert.
- Zu erhalten sind beide Badewannenkurven, die Reduktion in den Bereichen 1 und 3, alle Richtungspfeile, die drei Ausfallbereiche sowie die Zuordnung qualitativer und quantitativer Methoden.
- Die Ergebnisbeziehungen `Risikoreduktion durch Systemanalyse` und `Nachweis der Zuverlaessigkeit` muessen sichtbar und den richtigen Kurvenbereichen zugeordnet sein.
- Animationen duerfen diese Logik schrittweise erklaeren, aber keinen Zustand oder Zusammenhang unterschlagen.

### Folien 17 bis 26 - verbindliches Fuenf-Phasen-System

- Phasennummer, Kurzbezeichnung, Reihenfolge und Farbe werden zentral definiert und in Uebersichts- und Detailfolien unveraendert wiederverwendet.
- Verbindliche Reihenfolge: Planung, Schwachstellenanalyse, Erprobung & Nachweis, Produktionsabsicherung, Feldprognosen.
- Jede Detailfolie zeigt dieselbe Phasenleiste; nur die aktive Phase wird staerker hervorgehoben.
- Abweichende Synonyme, wechselnde Farben oder fehlende Phasenleisten sind nicht zulaessig.
