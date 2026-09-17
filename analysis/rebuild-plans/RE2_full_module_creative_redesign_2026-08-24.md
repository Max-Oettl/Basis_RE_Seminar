# RE2 – kreativer Gesamtumbau mit Quellen- und Referenz-Lock

## Auftrag

Alle 51 kanonischen Viewer-Szenen werden gegen ihre 165 Quellfolien, den unveränderten Sprechertext und geeignete externe Darstellungsreferenzen geprüft. Ziel ist kein weiterer Karten-Skin, sondern eine didaktisch lesbare Folge eigenständiger Visualisierungen mit klarer Blickreihenfolge.

## Verbindlicher Inhalts-Lock

- Fachliche Aussagen, Begriffe, Titel, Aufzählungen und Reihenfolgen stammen ausschließlich aus den RE2-Quellfolien und dem Sprechertext in `analysis/rebuild-plans/RE2_scene-plan.json`.
- Inhalte dürfen räumlich neu geordnet und als Diagramm, Prozess, Matrix oder beschriftete Grafik visualisiert werden. Sie dürfen nicht still gekürzt, ergänzt oder umformuliert werden.
- Bestehende, fachlich korrigierte Szenen 4, 5, 9, 10, 11, 13, 19 und 23 bleiben inhaltlich bindend; der Gesamtumbau darf diese Korrekturen nicht zurückdrehen.
- Der Foliensatz ist eine Content-SVG-Produktion: sichtbare Mastertitel, Logo, Seitenzahl, Hintergrund und Footer werden nicht in das Content-SVG dupliziert.

## Externer Referenz-Lock

Die Webquellen dienen nur als Darstellungs- und Lernreferenzen, nicht als neue fachliche Quelle.

| Code | Referenz | Übernommenes Prinzip |
|---|---|---|
| B1 | [Signaling in multimedia learning – Meta-Analyse](https://www.sciencedirect.com/science/article/pii/S1747938X15000664) | Blickführung durch wenige bedeutungstragende Signale, besonders bei visueller Suche |
| B2 | [Systematic review zu Signaling und Segmentierung](https://doi.org/10.1186/s40561-022-00200-2) | Inhalte in nachvollziehbare Lernschritte gliedern |
| B3 | [Articulate: Step Graphics](https://community.articulate.com/articles/step-graphics-in-elearning/) | Prozessfolien als Route, Achse oder Aufbau statt als Kartensammlung |
| B4 | [Articulate: Labeled Graphics](https://community.articulate.com/articles/labeled-graphics//) | Ein dominantes Objekt mit lokal verankerten Beschriftungen |
| B5 | [Articulate: Compare and Contrast](https://community.articulate.com/blog/articles/6-rise-360-block-types-to-use-to-compare-and-contrast-concepts/1141853) | Vergleich über gemeinsame Zeilen, Achsen und Kriterien |
| B6 | [GOV.UK Brand: typographic hierarchy](https://brand.design-system.service.gov.uk/typography/social/) | Hierarchie zuerst über Größe, Gewicht und Position |
| T1 | [ASQ: Fishbone Diagram](https://asq.org/quality-resources/fishbone) | Ursache-Wirkungs-Topologie erhalten |
| T2 | [NASA Fault Tree Handbook](https://extapps.ksc.nasa.gov/reliability/Documents/Fault_Tree_Handbook_with_Aerospace_Applications_August_2002.pdf) | Fehlerbäume als gerichtete logische Hierarchie, nicht als lose Karten |
| T3 | [AIAG/VDA FMEA Handbook](https://www.aiag.org/training-and-resources/manuals/details/FMEAAV-1) | sieben Schritte als durchgehender roter Faden |
| T4 | [NIST: Reliability Models](https://www.itl.nist.gov/div898/handbook/apr/section2/apr21.htm) | technische Kurven und Modelle als zentrale Beweisgrafik |

Abgelehntes Anti-Muster: generische Template-Galerien mit einem Symbol in der Mitte und vier austauschbaren farbigen Rundkarten. Dieses Muster erzeugt keine fachliche Relation und wird in RE2 nicht als Standardlayout verwendet.

## Modulgrammatik

1. Jede Szene besitzt einen eindeutigen ersten, zweiten und dritten Blickpunkt.
2. Marineblau `#142452` trägt Struktur und Kapitelkohärenz. Signalgrün, Stahlcyan, Gold und Koralle bleiben kleine semantische Akzente.
3. Karten sind nur zulässig, wenn fachlich wirklich eigenständige, gleichartige Einheiten vorliegen. Listen bleiben Listen, Bäume bleiben Bäume, Prozesse bleiben Prozesse und Vergleiche erhalten gemeinsame Achsen.
4. Stichpunkte werden aus den Quellen übernommen und räumlich gestaffelt. Fließtext wird nicht künstlich aus Quellstichpunkten erzeugt.
5. Die sieben FMEA-Schritte bilden in Kapitel 4 eine konstante Navigationslinie. Brückenszenen vergrößern den aktuellen Schritt und zeigen eine visuelle Vorschau auf die folgende Denkoperation.
6. Technische Pfeile haben eine Richtung und eine eindeutige Semantik. Animationen zeigen Endpunkte vor Verbindern und folgen dem fachlichen Lesepfad.
7. Piktogramme sind nur freigegebene, einheitliche PNG-Grafiken; es werden keine neuen Piktogramme aus SVG-Grundformen gebaut.

## 51-Szenen-Matrix

| Viewer | Work unit | Quellfolien | Lernfunktion / Quelltopologie | Verbindlicher Zielarchetyp | Blickfolge | Kartenregel | Referenz |
|---:|---|---|---|---|---|---|---|
| 1 | `slide_001` | 1–2 | Methoden einteilen; qualitative Methode fokussieren | offene Zweiteilung mit gemeinsamem Oberbegriff und qualitativer Werkzeugspur | Oberbegriff → qualitative Spur → FTA/FMEA | keine zwei Großkarten | B1, B5 |
| 2 | `slide_003` | 3 | Einsatz über Lebensdauer | dominante Badewannenkurve mit Phasen, Methodenfenstern und zwei Wirkzielen | Kurve → Phasen → Methodenfenster | keine Karten | B1, T4 |
| 3 | `slide_004` | 4–5 | PV-System und Grenzen lokalisieren | beschriftete Systemlandschaft mit fokussierter Wechselrichtergrenze | Gesamtanlage → Systemgrenze → Schnittstellen | nur lokale Labels | B4 |
| 4 | `slide_006` | 6–7 | System, Subsystem und Komponente staffeln | räumliche Zoom-/Ebenenhierarchie mit korrekter Systemgrenze | Umwelt → System → Subsystem → Komponente | keine austauschbaren Karten | B1, B2 |
| 5 | `slide_008` | 8 | P-Diagramm erklären | zentrale Systemkonstellation mit vier gerichteten Größenrollen und PNG-Piktogrammen | System → Eingaben/Steuerung → Störung/Ziel | Satelliten nur als echte Rollen | B4 |
| 6 | `slide_009` | 9 | P-Diagramm am Wechselrichter anwenden | konkretes, beschriftetes P-Diagramm mit Wechselrichter als Objektanker | Wechselrichter → Ein-/Ausgänge → Stör-/Steuergrößen | nur lokale Rollenflächen | B4 |
| 7 | `slide_010` | 10 | Ursachen strukturieren | echtes Ishikawa-Diagramm mit großer Wirkungsspitze und lesbaren Hauptgräten | Wirkung → Hauptursachen → Unterursachen | keine Karten | T1 |
| 8 | `slide_011` | 11–12 | Komponentenblock-Prinzip | offene Komponentenfolge in zwei Flussspuren innerhalb einer Systemgrenze | Grenze → Komponenten → Energie-/Informationsflüsse | Knoten nur als technische Blöcke | B1 |
| 9 | `slide_013` | 13 | Wechselrichter detaillieren | orthogonales Blockdiagramm mit fachlich korrekter Systemgrenze und getrennten Spuren | Grenze → Hauptenergie → Kommunikation/Regelung | technische Blöcke, keine Infokarten | B4 |
| 10 | `slide_014` | 14–16 | Funktion in Teilfunktionen zerlegen | marineblaue Funktionskaskade mit sichtbarer Aufteilung | Hauptfunktion → Teilfunktionen → Detailfunktionen | nur Funktionsknoten | B2 |
| 11 | `slide_017` | 17–19 | Ausfallmechanismen priorisieren | Scan-Tabelle mit Ergebnisstreifen und kleinen A/B/C-Markern | Bauteil → Mechanismus → Priorität → Konsequenz | Tabelle statt Karten | B1, B5 |
| 12 | `slide_020` | 20–22 | FTA-Begriff und Logik einführen | typografische Akronym-Auflösung plus vertikale Top-down-/Bottom-up-Achse | FTA → Langform → Denkrichtung | keine Definitionkarten | B6, T2 |
| 13 | `slide_023` | 23 | FTA-Arten aufteilen | Oberbegriff mit offener Bifurkation in qualitative und quantitative FTA | Oberbegriff → beide Äste → Modulfokus | Zweige statt Karten | B5, T2 |
| 14 | `slide_024` | 24–27 | fünf FTA-Schritte überblicken | durchgehende Route mit fünf Haltepunkten und Zielmarke | 1 → 2 → 3 → 4 → 5 | keine vier Methodenboxen | B2, B3 |
| 15 | `slide_028` | 28–31 | unerwünschtes Ereignis definieren | Präventiv/Korrektiv-Polachse mit unerwünschtem Ereignis als Drehpunkt | Ereignis → präventiv → korrektiv | höchstens zwei echte Pole | B5, T2 |
| 16 | `slide_032` | 32–35 | Ausfallarten bestimmen | Systemkomponente als Stamm, drei Ausfallarten als gerichtete Äste | Komponente → Primär/Sekundär/Kommandiert | keine Kartenreihe | T2 |
| 17 | `slide_036` | 36–48 | Fehlerbaum erstellen | wachsender Fehlerbaum mit Gattern, Basis- und Zwischenereignissen | Top-Ereignis → Gatter → Ereignisse | nur normnahe Ereignisknoten | T2 |
| 18 | `slide_049` | 49–51 | qualitativ bewerten | Fehlerbaum bleibt dominant; kritischer Pfad und minimaler Schnitt werden herausgelöst | Baum → Pfad → Schnitt | keine Zusatzkarten | B1, T2 |
| 19 | `slide_052` | 52–56 | Fahrwerkbeispiel | Flugzeug/Fahrwerk als Objektanker plus vollständiger Fehlerbaum mit kritischen Pfaden und minimalen Ausfallschnitten | Objekt → Top-Ereignis → Pfade/Schnitte | nur Fehlerbaumknoten | B4, T2 |
| 20 | `slide_057` | 57 | Common Mode erklären | drei parallele Pfade mit gemeinsamem Ursachenband | Pfade → gemeinsame Ursache → Konsequenz | keine Karten | B1, T2 |
| 21 | `slide_058` | 58–62 | Krankenhaus-Stromversorgung | gespiegelter Redundanzbaum; gemeinsame Ursache quert beide Äste sichtbar | Versorgung → redundante Äste → gemeinsame Ursache | nur technische Ereignisknoten | T2 |
| 22 | `slide_063` | 63–65 | FMEA definieren | große Akronym-Auflösung plus offene, nummerierte Route mit allen fünf originalen Quellstichpunkten | FMEA → Methode/Team → Identifizieren → Bewerten → Optimieren | keine Rollenkarten | B6, T3 |
| 23 | `slide_066` | 66 | vier Ziele der FMEA | vier gleichwertige, einfarbige Themenboxen mit originalen Titeln und Stichpunkten | Mitte/Leitfrage → vier gleichrangige Ziele | vier Boxen ausdrücklich fachlich legitim | B1, T3 |
| 24 | `slide_067` | 67 | fünf Grundprinzipien | zentrale Prinzipien-Konstellation nach Altfolie; Teamarbeit als verbindendes Zentrum | Zentrum → vier Prinzipien → Teamarbeit | keine isolierte Kartenwand | B4, T3 |
| 25 | `slide_068` | 68–70 | Design- und Prozess-FMEA vergleichen | offene Vergleichsmatrix mit gemeinsamen Kriterien und Quellstichpunkten | gemeinsamer Oberbegriff → Kriterien → beide Spalten | keine zwei Großkarten | B5, T3 |
| 26 | `slide_071` | 71 | Einsatz und Ziel der FMEA | offene, nummerierte Inhaltsabschnitte plus ein gemeinsames Zielband | Einsatz → Standards → Ziel | nur Zielband | B6, T3 |
| 27 | `slide_072` | 72–77 | Schritt 1 planen und Team bilden | Sieben-Schritt-Navigation plus offene Arbeitsfläche mit Analyseumfang, Unterlagen und Teamhierarchie | Schritt 1 → Arbeitsauftrag → Team | Rollen nur als echte Teamebenen | B2, B3, T3 |
| 28 | `slide_078` | 78 | zu Schritt 2 überleiten | aktueller Schritt wird aus der 7er-Route herausgezoomt; Vorschau eines Strukturbaums | Route → Schritt 2 → Baumvorschau | keine Inhaltskarten | B2, B3 |
| 29 | `slide_079` | 79–82 | Strukturanalyse methodisch erklären | nummerierter Dreischritt als offene horizontale Arbeitsroute; Originalregeln zu Ebenen, Eindeutigkeit und Dummy-SE bleiben sichtbar | Abgrenzen → Aufteilen → Strukturieren | keine drei Karten | B3, T3 |
| 30 | `slide_083` | 83–85 | Systemstruktur bilden | großzügiger offener Systembaum mit Ebenenbändern | System → Systemelemente → Unterelemente | nur Baumknoten | T3 |
| 31 | `slide_086` | 86–89 | Getriebe strukturieren | objektzentrierte Getriebedarstellung mit angebundenem Produktbaum und Positionsnummern | Getriebe → Baugruppen → Einzelteile | nur Baumknoten/Labels | B4, T3 |
| 32 | `slide_090` | 90 | zu Schritt 3 überleiten | Schritt 3 aus Route herauszoomen; Baumknoten erhalten Funktionszeilen als Vorschau | Route → Schritt 3 → Funktionszuordnung | keine Inhaltskarten | B2, B3 |
| 33 | `slide_091` | 91–95 | Funktionen zuordnen | Objektstruktur links, Funktionsstruktur rechts, verbindende Zuordnungslinien | Objekt → Funktion → vollständige Hierarchie | nur Strukturknoten | B4, T3 |
| 34 | `slide_096` | 96 | zu Schritt 4 überleiten | Schritt 4 aus Route herauszoomen; Funktion kippt sichtbar in Fehlfunktion | Route → Schritt 4 → Transformation | keine Inhaltskarten | B2, B3 |
| 35 | `slide_097` | 97–103 | Fehlfunktionen identifizieren | große Funktion-zu-Fehler-Transformation und anschließend Fehlerstruktur | Funktion → Fehlfunktion → Fehlerbaum | nur Fachknoten | B1, T3 |
| 36 | `slide_104` | 104–109 | Fehlerfolgen verknüpfen | drei offene Ebenen für Fehlerursache, Fehlerart und Fehlerfolge mit durchgehender Kette | Ursache → Art → Folge → Systemwirkung | keine Ebenenkarten | B2, T3 |
| 37 | `slide_110` | 110 | Getriebefehler anwenden | quellengetreue Drei-Ebenen-Hierarchie mit beiden Getriebefunktionen, Antrieb/Abtrieb/Gehäuse sowie allen sechs Antriebsbauteilen | System → Baugruppe → Bauteil; jeweils Funktion → Fehlfunktion | nur Baumknoten | B1, T3 |
| 38 | `slide_111` | 111 | zu Schritt 5 überleiten | Schritt 5 aus Route herauszoomen; B/A/E-Linse erscheint als Vorschau | Route → Schritt 5 → Bewertungsdreieck | keine Inhaltskarten | B2, B3 |
| 39 | `slide_112` | 112–118 | Risiko mit B, A und E bewerten | integriertes Bewertungsdreieck mit drei Skalen und sichtbarer Fehlerfolge als Bezug | Fehlerfolge → B/A/E → Bewertung | keine zwei Großkarten | B1, T3 |
| 40 | `slide_119` | 119–126 | RPZ und Aufgabenpriorität | Formel führt in Entscheidungsmatrix; semantische Farben nur innerhalb der Matrix | Formel → Matrix → Prioritätsentscheidung | keine Dashboard-Karten | B5, T3 |
| 41 | `slide_127` | 127 | zu Schritt 6 überleiten | Schritt 6 aus Route herauszoomen; drei Optimierungshebel werden als Vorschau geöffnet | Route → Schritt 6 → Hebel | keine Inhaltskarten | B2, B3 |
| 42 | `slide_128` | 128–130 | Optimierungsmaßnahmen ableiten | drei gerichtete Hebel greifen an B, A und E an; gemeinsames Risikoziel unten | Risiko → Hebel → reduziertes Risiko | keine drei Karten | B1, T3 |
| 43 | `slide_131` | 131 | zu Schritt 7 überleiten | Schritt 7 aus Route herauszoomen; FMEA-Formblatt rollt sich als Vorschau auf | Route → Schritt 7 → Dokument | keine Inhaltskarten | B2, B3 |
| 44 | `slide_132` | 132–138 | Ergebnisse dokumentieren | großes annotiertes FMEA-Formblatt mit fünf farblich sehr zurückhaltenden Zonen | Formblatt → Zonen → Ziel/Ergebnis | keine fünf Karten | B4, T3 |
| 45 | `slide_139` | 139–142 | Schritt 1 Design/Prozess vergleichen | gemeinsame Schrittachse, darunter zwei offene Arbeitswege mit identischen Vergleichszeilen | gemeinsamer Schritt → Design → Prozess | keine drei Karten | B5, T3 |
| 46 | `slide_143` | 143–146 | Schritt 2 Design/Prozess | zwei große reale Strukturen: Produktbaum und Prozessfluss; gemeinsame Ebene ausgerichtet | Schritt → Produktstruktur ↔ Prozessstruktur | nur Strukturknoten | B5, T3 |
| 47 | `slide_147` | 147–152 | Schritt 3 Design/Prozess | Funktionsbaum und Prozessfunktionsfluss auf gemeinsamer Grundlinie | Schritt → Designfunktion ↔ Prozessfunktion | nur Funktionsknoten | B5, T3 |
| 48 | `slide_153` | 153–155 | Schritt 4 Design/Prozess | zwei Fehlerstrukturen mit gemeinsamem Ursache-Art-Folge-Leseschlüssel | Leseschlüssel → Designfehler ↔ Prozessfehler | keine zwei Großkarten | B5, T3 |
| 49 | `slide_156` | 156–159 | Schritt 5 Design/Prozess | gemeinsame B/A/E-Linse; unterschiedliche Bewertungsnachweise offen darunter | B/A/E → Designnachweis ↔ Prozessnachweis | keine zwei Großkarten | B5, T3 |
| 50 | `slide_160` | 160–162 | Schritt 6 Design/Prozess | zwei offene Maßnahmenpfade, die auf dasselbe Risikoziel zulaufen | Risiko → Maßnahmenpfade → Ziel | keine zwei Großkarten | B3, B5, T3 |
| 51 | `slide_163` | 163–165 | Schritt 7 Design/Prozess | zwei Dokumentationsausgänge an einem gemeinsamen Abschlussknoten | Schritt 7 → Ergebnisse → gemeinsamer Abschluss | keine zwei Großkarten | B5, T3 |

## Pilot-Archetypen vor dem Vollumbau

Die Generatoren werden nicht blind in einem Durchlauf umgeschrieben. Zuerst werden sechs Pilottypen mit statischem Rendervergleich validiert:

1. offene Zweiteilung: Szene 1;
2. Kurven-/Beweisgrafik: Szene 2;
3. Prozessroute: Szene 14;
4. Definition mit typografischem Anker: Szene 22;
5. Brückenszene mit Fokuszoom: Szene 28;
6. Vergleich auf gemeinsamer Achse: Szene 45.

Erst nach bestandener Lesbarkeits-, Inhalts- und Hierarchieprüfung werden die jeweiligen Muster auf fachlich verwandte Szenen übertragen. Die Muster sind Layoutgrammatiken, keine kopierten Folien.

## Abnahme pro Szene

- Quelltitel und alle Quellstichpunkte gegen die gemappten Quellfolien geprüft.
- Ohne Sprechertext ist erkennbar, wo der Blick beginnt und wie er weitergeführt wird.
- Keine Karte ohne eigenständige fachliche Einheit.
- Keine unmotivierte Umformulierung in Fließtext.
- Technische Topologie und Systemgrenzen stimmen mit Quelle und Sprechertext überein.
- 50-%-Viewerprüfung: Text, Pfeile, Achsen und semantische Marker bleiben lesbar.
- Animationszustände folgen der inhaltlichen Blickfolge; kein Verbinder erscheint vor seinen Endpunkten.
- Strenge SVG-, Branding-, Layout- und Manifest-QA ohne Fehler.
