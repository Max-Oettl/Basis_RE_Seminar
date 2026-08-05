# RE2 Modulmasterplan

## Status und Umfang

- Modul: `RE2`
- Quellumfang: Folien 1 bis 165
- Kapitel: 4
- Lektionen: 20
- Geplante Zielszenen: 51
- Produktionsstatus: Kapitel 1 vorhanden; Kapitel 2 vollständig zurückgesetzt; Kapitel 2 bis 4 nicht zur Produktion freigegeben
- Planungsstatus: modulweite Dramaturgie und Szenenarchitektur vorbereitet; nächste Freigabestufe ist der neue Kapitel-2-Redesign-Brief
- Zielmodus: `full_slide`
- Zielformat: `1920 × 1080`
- Sprechertext-Mapping: `analysis/inventories/RE2_svg-text-map.json`
- Quellinventar: `analysis/inventories/RE2_source-svg-inventory.json`
- Quellenreferenzen: `analysis/rebuild-plans/RE2_source-reference-map.json`
- Visueller Quellcheck: `analysis/reports/RE2-full-module-contact-sheets/`

Dieser Plan startet keine Folienproduktion. Er legt fest, wie das gesamte Modul fachlich, visuell und dramaturgisch zusammenhängt, bevor Kapitel 2 neu gestaltet wird.

## Modulgedanke

RE2 folgt einer durchgehenden fachlichen Kette:

1. **Einordnen:** Qualitative Methoden reduzieren Risiken in frühen Lebensphasen.
2. **System verstehen:** Systemgrenzen, Ebenen, Einflüsse, Komponenten, Funktionen und Kritikalität werden beschrieben.
3. **Fehler logisch herleiten:** Die FTA führt von einem unerwünschten Ereignis über Ursachenpfade bis zu kritischen Ausfallschnitten.
4. **Risiken systematisch bearbeiten:** Die FMEA überführt Systemstruktur, Funktionen und Fehlerzusammenhänge in Bewertung, Optimierung und Dokumentation.

Damit ist Kapitel 2 keine isolierte Methodensammlung. Es liefert die Systemmodelle und Begriffe, die in Kapitel 3 für den Fehlerbaum und in Kapitel 4 für Struktur-, Funktions- und Fehleranalyse erneut gebraucht werden.

## Kapitelarchitektur

| Kapitel | Quellfolien | Lektionen | Geplante Szenen | Fachliche Aufgabe | Anschluss |
|---|---:|---:|---:|---|---|
| 1 – Qualitative Methoden einordnen | 1–3 | 1 | 2 | qualitative Methoden und Einsatz im Lebenszyklus verorten | begründet, warum vor der Risikoanalyse eine Systemanalyse nötig ist |
| 2 – Systemanalyse vorbereiten | 4–19 | 6 | 9 | Systemgrenze, Einflüsse, Komponenten, Funktionen und Kritikalität am Wechselrichter aufbauen | liefert Objekte, Funktionen und Ausfallmechanismen für FTA und FMEA |
| 3 – Fehlerbaumanalyse | 20–62 | 4 | 10 | unerwünschte Ereignisse deduktiv in Ursachenpfade zerlegen und qualitativ bewerten | zeigt die Logik einzelner Fehlerpfade; FMEA erweitert zur systematischen Gesamtbewertung |
| 4 – FMEA | 63–165 | 9 | 30 | Struktur, Funktionen, Fehler, Risiken, Maßnahmen und Dokumentation in sieben Schritten bearbeiten | schließt den qualitativen Analyseprozess und kontrastiert Design- und Prozess-FMEA |

## Verbindungen zwischen den Kapiteln

### Kapitel 1 → Kapitel 2

Die Badewannenkurve endet mit der Aussage, dass qualitative Methoden vor allem frühe Risiken durch Systemanalyse reduzieren. Kapitel 2 greift exakt dieses Wort auf und beantwortet: Was gehört zum System, welche Einflüsse wirken darauf und welche Elemente und Funktionen müssen untersucht werden?

### Kapitel 2 → Kapitel 3

Kapitel 2 endet mit Bauteilen, Ausfallarten, Ausfallmechanismen und ABC-Kritikalität. Kapitel 3 verwendet diese Ergebnisse als Eingang für die FTA: Ein unerwünschtes Top-Ereignis wird mit den zuvor identifizierten Komponenten und Ausfallarten logisch verknüpft.

### Kapitel 3 → Kapitel 4

Die FTA macht kritische Ursachenpfade und minimale Ausfallschnitte sichtbar. Die FMEA übernimmt dieselbe Ursache-Wirkungs-Denkweise, erweitert sie aber um Systemstruktur, Funktionen, Fehlerfolgen, Auftreten, Entdeckung, Maßnahmen und Ergebnisdokumentation.

### Kapitel 4 als Rückbindung

Die sieben FMEA-Schritte wiederholen bewusst die Logik des gesamten Moduls: planen → strukturieren → Funktionen verstehen → Fehler ableiten → Risiken bewerten → optimieren → dokumentieren. Die Abschlusslektion Design- versus Prozess-FMEA zeigt diese Kette noch einmal in zwei parallelen Anwendungspfaden.

## Verriegeltes Referenzdesign aus RE1

RE2 übernimmt nicht nur Farben, sondern die vollständige Folienarchitektur von RE1.

| RE1-Referenz | Übernommene Eigenschaft | Einsatz in RE2 |
|---|---|---|
| `RE1/slide_001` | vollständige Markenfolie, starkes reales Motiv, Faktenkarten, großzügige Hierarchie | PV-Anlage, Flugzeugfahrwerk, Krankenhaus, Anpassungsgetriebe |
| `RE1/slide_005` | ruhige Vergleichskarten mit klaren Zuständen | qualitative/quantitative FTA, Design-/Prozess-FMEA, ABC-Klassen |
| `RE1/slide_006` | Zentrum mit sauber geführten Einflüssen | P-Diagramm, Ishikawa, FMEA-Grundprinzipien |
| `RE1/slide_009` | technische Hierarchie und Funktionszusammenhang | Systemebenen, Bauteilblockdiagramme, Struktur- und Funktionsbäume |
| `RE1/slide_013` | gestufte Definition mit farblich markierten Kernbegriffen | Definition FTA/FMEA, Ziele, Einsatz |
| `RE1/slide_022` | kompakte, aber lesbare Prozess- und Methodenstruktur | FTA-Schritte, FMEA-Schritte, Planung und Vorbereitung |
| `RE1/slide_037` | komplexes Diagramm mit stabiler Orientierung und Phasenbändern | FTA-Aufbaufolgen, Risikobewertung, sieben FMEA-Schritte |
| `RE1/slide_045` | klare Kennzahlen- und Tabellenzeilen | ABC-Analyse, B/A/E-Bewertung, RPZ/AP, Formblatt |

### Globale Vollfolienregeln

- Jede Zielszenen-SVG enthält Hintergrund, sichtbaren Titel, Academy-Akzent, Inhaltsfläche und Footer.
- Titelposition, Footertext, Seitennummerierung, Grundraster und Weißraum folgen RE1.
- Navy `#062D46` ist primäre Strukturfarbe; Academy Blue `#139CCB` markiert Fokus und Fortschritt.
- Dunkle Flächen erhalten explizit weißen Text. Textfarbe wird nie nur vererbt.
- Fließtext bleibt dunkel auf hellen Flächen. Light Blue, Soft Gray und dezente Statusfarben strukturieren, ohne die Folie zu überladen.
- Standardlinien und Verbinder bleiben fein. Pfeile sind fachliche Beziehungen und keine dekorativen Großformen.
- Tabellen werden nicht verkleinert, bis sie technisch unlesbar sind. Sie werden auf Spaltenlogik, Fokusfelder und progressive Zustände reduziert.
- Inhaltliche Quelle bleibt vollständig erhalten; umformuliert wird nur für lesbare Labels, nicht fachlich.

## Lektions- und Szenenplan

### Kapitel 1 – Qualitative Methoden einordnen

| Work Unit | Quellen | Szene | Behandlung | Zielarchetyp und Verbindung |
|---|---:|---|---|---|
| `slide_001` | 1–2 | `re2_ch1_methods` | belegte Aufbaufolge | Zwei Methodenpfade; FTA und FMEA bereiten die späteren Kapitel vor |
| `slide_003` | 3 | `re2_ch1_lifecycle` | eigenständig | Lebenszyklusdiagramm; endet auf „Systemanalyse“ als Übergang zu Kapitel 2 |

### Kapitel 2 – Systemanalyse vorbereiten

| Lektion | Work Unit | Quellen | Szene | Behandlung | Zielarchetyp und Verbindung |
|---:|---|---:|---|---|---|
| 1 | `slide_004` | 4–5 | `re2_ch2_pv_system_boundaries` | Aufbaufolge | Technische PV-Landschaft; Umwelt, PV-Systemgrenze und Wechselrichtergrenze werden nacheinander präzisiert |
| 2 | `slide_006` | 6–7 | `re2_ch2_system_levels` | Aufbaufolge | Verschachtelte Systemebenen mit Wechselrichter-Fokus; leitet vom Gesamtsystem zum Analyseobjekt |
| 2 | `slide_008` | 8 | `re2_ch2_p_diagram_principle` | eigenständig | Generisches P-Diagramm; Eingänge, Steuerung, Störungen und Zielgrößen um ein sichtbares Produkt/Prozess-Zentrum |
| 2 | `slide_009` | 9 | `re2_ch2_p_diagram_inverter` | eigenständig | Gleiche visuelle Grammatik am Wechselrichter; Übertragung vom Prinzip auf das Beispiel |
| 3 | `slide_010` | 10 | `re2_ch2_ishikawa` | eigenständig | Ursache-Wirkungs-Diagramm; Kategorien zuerst, Beispiele danach, Wirkung dauerhaft sichtbar |
| 4 | `slide_011` | 11–12 | `re2_ch2_component_block_principle` | Aufbaufolge | Systemgrenze → Komponenten → externe und interne Energie-, Stoff- und Informationsflüsse |
| 4 | `slide_013` | 13 | `re2_ch2_component_block_inverter` | eigenständig | Übertragung des Prinzips auf reale Wechselrichterkomponenten und Signalarten |
| 5 | `slide_014` | 14–16 | `re2_ch2_function_structure` | gemeinsame Erklärsequenz | Black Box → Teilfunktionen → konkrete Wechselrichter-Funktionskette |
| 6 | `slide_017` | 17–19 | `re2_ch2_abc_analysis` | gemeinsame Bewertungssequenz | Bauteile/Ausfälle → ABC-Regeln → bewertetes Ergebnis; Übergang zu kritischen Ursachen in der FTA |

### Kapitel 3 – Fehlerbaumanalyse

| Lektion | Work Unit | Quellen | Szene | Behandlung | Zielarchetyp und Verbindung |
|---:|---|---:|---|---|---|
| 1 | `slide_020` | 20–22 | `re2_ch3_fta_intro` | Aufbaufolge | Begriff, Top-down-Logik und Beispielbaum |
| 2 | `slide_023` | 23 | `re2_ch3_fta_types` | eigenständig | Qualitative und quantitative FTA als Vergleich; Fokus bleibt auf der qualitativen FTA |
| 3 | `slide_024` | 24–27 | `re2_ch3_fta_step1_system_analysis` | Aufbaufolge | Fünf-Schritte-Navigation plus Vorgehen der Systemanalyse |
| 3 | `slide_028` | 28–31 | `re2_ch3_fta_step2_top_event` | Aufbaufolge | unerwünschtes Ereignis, primärer und korrektiver Ansatz |
| 3 | `slide_032` | 32–35 | `re2_ch3_fta_step3_failure_modes` | Aufbaufolge | Primär-, Sekundär- und kommandierter Ausfall am Motorschaltungsbeispiel |
| 3 | `slide_036` | 36–48 | `re2_ch3_fta_step4_fault_tree` | komplexe Ersatz-/Aufbaufolge | Gatterprinzipien, schrittweiser Fehlerbaum, Basisereignis und Vereinfachung in einer stabilen Szenengeometrie |
| 3 | `slide_049` | 49–51 | `re2_ch3_fta_step5_evaluation` | Aufbaufolge | kritische Pfade und minimale Ausfallschnitte |
| 4 | `slide_052` | 52–56 | `re2_ch3_aircraft_landing_gear` | Aufbaufolge | reales Flugzeugmotiv plus wachsender Fehlerbaum des Fahrwerks |
| 4 | `slide_057` | 57 | `re2_ch3_tire_common_cause` | eigenständig | Ausfall eines Reifens; Common-Cause-Effekt als Vertiefung |
| 4 | `slide_058` | 58–62 | `re2_ch3_hospital_power` | Aufbaufolge | Krankenhausversorgung, Redundanz, gemeinsamer Ausfall und identische Tankursache |

### Kapitel 4 – FMEA

| Lektion | Work Unit | Quellen | Szene | Behandlung | Zielarchetyp und Verbindung |
|---:|---|---:|---|---|---|
| 1 | `slide_063` | 63–65 | `re2_ch4_fmea_intro` | Aufbaufolge | Begriff, Charakter und Kernaussage der FMEA |
| 1 | `slide_066` | 66 | `re2_ch4_fmea_goals` | eigenständig | Ziele als priorisierte Wirkungskette |
| 1 | `slide_067` | 67 | `re2_ch4_fmea_principles` | eigenständig | Kontinuität, Systematik, Proaktivität, Dokumentation und Teamarbeit |
| 1 | `slide_068` | 68–70 | `re2_ch4_fmea_types` | Aufbaufolge | Design- und Prozess-FMEA: Zielsetzung, Schwerpunkte, Anwendung und Ergebnis |
| 1 | `slide_071` | 71 | `re2_ch4_fmea_use` | eigenständig | Einsatzzeitpunkt, Standards und Zielbild |
| 2 | `slide_072` | 72–77 | `re2_ch4_step1_planning` | Aufbaufolge | Sieben-Schritte-Navigation, Analyseumfang, Informationsquellen und Team |
| 3 | `slide_078` | 78 | `re2_ch4_step2_bridge` | Lektionsbrücke | ruhiger Fortschrittswechsel von Schritt 1 zu Schritt 2; nicht mit Lektion 2 zusammenführen |
| 3 | `slide_079` | 79–82 | `re2_ch4_structural_method` | Aufbaufolge | Abgrenzen, Systemelemente aufteilen, Struktur erstellen und Ziel festhalten |
| 3 | `slide_083` | 83–85 | `re2_ch4_structural_tree` | Aufbaufolge | Systemstruktur über drei Ebenen mit Fokuswechsel |
| 3 | `slide_086` | 86–89 | `re2_ch4_gearbox_structure` | Aufbaufolge | Anpassungsgetriebe vom technischen Motiv zur Struktur |
| 3 | `slide_090` | 90 | `re2_ch4_step3_bridge` | Lektionsbrücke | Vorschau auf Schritt 3 |
| 4 | `slide_091` | 91–95 | `re2_ch4_function_analysis` | Aufbaufolge | Funktionen ermitteln, zuordnen und am Getriebe verknüpfen |
| 4 | `slide_096` | 96 | `re2_ch4_step4_bridge` | Lektionsbrücke | Vorschau auf Schritt 4 |
| 5 | `slide_097` | 97–103 | `re2_ch4_failure_analysis` | Aufbaufolge | Funktion negieren, Fehlfunktionen ableiten und in die Systemstruktur übertragen |
| 5 | `slide_104` | 104–109 | `re2_ch4_failure_links` | Aufbaufolge | Fehlerfolge, Fehler, Fehlerursache und Fehlernetz |
| 5 | `slide_110` | 110 | `re2_ch4_gearbox_failure_modes` | eigenständig | physikalische Ausfallarten auf Bauteilebene |
| 5 | `slide_111` | 111 | `re2_ch4_step5_bridge` | Lektionsbrücke | Vorschau auf Schritt 5 |
| 6 | `slide_112` | 112–118 | `re2_ch4_risk_analysis` | Aufbaufolge | Bedeutung, Auftreten und Entdeckung mit Bewertungslogik |
| 6 | `slide_119` | 119–126 | `re2_ch4_risk_priority` | Aufbaufolge | RPZ, Aufgabenpriorität und Bewertungsmatrix |
| 6 | `slide_127` | 127 | `re2_ch4_step6_bridge` | Lektionsbrücke | Vorschau auf Schritt 6 |
| 7 | `slide_128` | 128–130 | `re2_ch4_optimization` | Aufbaufolge | Maßnahmen gegen Ursache, Bedeutung und mangelnde Entdeckung |
| 7 | `slide_131` | 131 | `re2_ch4_step7_bridge` | Lektionsbrücke | Vorschau auf Schritt 7 |
| 8 | `slide_132` | 132–138 | `re2_ch4_documentation` | Aufbaufolge | FMEA-Formblatt schrittweise erschließen und Ergebnisanforderungen bündeln |
| 9 | `slide_139` | 139–142 | `re2_ch4_design_process_step1` | parallele Vergleichsfolge | Planung: Produktumfang versus Prozessumfang |
| 9 | `slide_143` | 143–146 | `re2_ch4_design_process_step2` | parallele Vergleichsfolge | Produktstruktur versus Prozessstruktur |
| 9 | `slide_147` | 147–152 | `re2_ch4_design_process_step3` | parallele Vergleichsfolge | Produktfunktionen versus Prozessfunktionen |
| 9 | `slide_153` | 153–155 | `re2_ch4_design_process_step4` | parallele Vergleichsfolge | Produktfehler versus Prozessfehler |
| 9 | `slide_156` | 156–159 | `re2_ch4_design_process_step5` | parallele Vergleichsfolge | Bewertung aus Produkt- und Prozesssicht |
| 9 | `slide_160` | 160–162 | `re2_ch4_design_process_step6` | parallele Vergleichsfolge | Konstruktions- versus Fertigungsmaßnahmen |
| 9 | `slide_163` | 163–165 | `re2_ch4_design_process_step7` | parallele Vergleichsfolge | technische versus prozessbezogene Ergebnisdokumentation |

## Assetstrategie

### Kapitel 2

Die sichtbaren Realobjekte werden nicht durch beschriftete Platzhalterboxen ersetzt.

| Motiv | Geplante Strategie | Qualitätsziel |
|---|---|---|
| PV-Module | freigestelltes PNG oder hochwertiges vorhandenes Quellasset | als reale Energiequelle sofort erkennbar |
| Wechselrichter | freigestelltes technisches PNG | zentrales Analyseobjekt in mehreren Szenen wiederverwendbar |
| Batteriespeicher | freigestelltes technisches PNG | visuell eigenständig, nicht als generische Batteriebox |
| Stromzähler | freigestelltes technisches PNG | klare Schnittstelle zwischen System, Haus und Netz |
| öffentliches Netz | freigestellter Strommast als PNG | öffentliches Netz ohne Interpretationsspielraum sichtbar |
| Hausverbrauch | gemeinsame PNG-Vignette mit Lampe, Fernseher und Waschmaschine | die drei Quellmotive bleiben sichtbar |
| Diagrammstrukturen | native SVG | präzise Systemgrenzen, Blöcke, Tabellen und Verbinder |

Die PNG-Familie wird in einem einheitlichen Blickwinkel, Licht und Detailgrad erzeugt oder aus geeigneten vorhandenen Assets kuratiert. Erst nach einem gemeinsamen Asset-Sheet werden die Kapitel-2-Folien gebaut.

### Kapitel 3

- FTA-Gatter, Ereignisse, Knoten und Pfade: einheitliche native SVG-Komponentenbibliothek.
- Flugzeug und Fahrwerk: vorhandenes Quellmotiv nur bei ausreichender Auflösung; sonst neues freigestelltes technisches PNG.
- Krankenhaus, Netzversorgung, Generator und Tank: konsistente technische PNG-/SVG-Familie.
- Kritische Pfade und minimale Ausfallschnitte: Fokusfarben auf unveränderter Baumtopologie.

### Kapitel 4

- Anpassungsgetriebe: technisches Quellmotiv erhalten oder hochwertig neu aufbereiten.
- Struktur-, Funktions- und Fehlerbäume: gemeinsame Knoten- und Verbinderbibliothek.
- Sieben-Schritte-Navigation: ein einziges wiederverwendbares Vollfolien-Komponentensystem.
- Bewertung B/A/E, RPZ und Aufgabenpriorität: standardisierte Bewertungs-Chips, Skalen und Matrix.
- FMEA-Formblatt: lesbarer modularer Neuaufbau statt verkleinerter Tabellenabbildung.
- Design-/Prozess-Vergleich: dauerhaftes Zweispaltenraster mit identischen Ebenen, nicht neun unabhängig erfundene Layouts.

## Animationsdramaturgie

### Allgemeine Reihenfolge

1. Orientierungsobjekt oder Gesamtsystem erscheint.
2. Die fachlichen Endpunkte einer Beziehung werden sichtbar.
3. Der zugehörige Verbinder erscheint mit dem neu eingeführten Zielobjekt oder danach.
4. Labels und Fokusmarkierungen erscheinen gemeinsam mit dem Objekt, das sie erklären.
5. Bereits erklärte Grundstrukturen bleiben als ruhiger Kontext sichtbar.

### Verbindliche Regeln

- Kein Pfeil erscheint vor den zugehörigen Boxen oder Motiven.
- Kein Verbinder zeigt auf ein noch unsichtbares Ziel.
- Übergangsfolien animieren höchstens den Fortschrittswechsel; sie eröffnen keine parallele Nebenhandlung.
- Aufbauzustände werden nicht als doppelte Zielszenen exportiert, sondern als semantische Gruppen einer Szene.
- Komplexe Quellenfolgen mit Zoom oder Ersetzung behalten eine stabile Grundgeometrie; nur die fachlich geänderte Ebene wird ersetzt oder hervorgehoben.
- Sprechertext-Trigger werden erst im Kapitelbrief exakt festgelegt. Es werden keine Sekunden, Wortindizes oder TTS-Zeitpunkte erfunden.
- Jede animierte Szene benötigt vor dem Manifest einen freigegebenen statischen Endzustand.

## Produktionsreihenfolge

1. Kapitel 2: Asset-Sheet für PV-Anlage und Wechselrichterfamilie erstellen.
2. Kapitel 2: drei statische Archetyp-Piloten bauen:
   - PV-Systemlandschaft, Folien 4–5
   - P-Diagramm, Folie 8
   - ABC-Analyse, Folien 17–19
3. Piloten im Dreifachvergleich prüfen: Quelle, Sprechertext, RE1-Referenz.
4. Kapitel 2 lektionsweise vollständig gestalten; erst danach Animationen ergänzen.
5. Kapitelweite Konsistenzprüfung und Viewer-Crosscheck.
6. Kapitel 3 mit FTA-Komponentenbibliothek umsetzen.
7. Kapitel 4 mit wiederverwendbarer Sieben-Schritte-, Baum-, Bewertungs- und Vergleichsarchitektur umsetzen.
8. Modulweiter Übergangs-, Sprach- und Designcheck.

## Freigabegates je Kapitel

- Referenzfolien aus RE1 sind vor Produktionsstart benannt.
- Jede Quellfolie des Kapitels gehört genau einer geplanten Szene.
- Sichtbare Motive besitzen vor dem Layout eine konkrete Assetentscheidung.
- Statischer Endzustand ist vollständig, lesbar und kontrastgeprüft.
- Dunkle Boxen zeigen weißen Text; helle Boxen dunklen Text.
- Verbinder sind fein, zielgerichtet und erscheinen in logischer Reihenfolge.
- Keine fachfremden Labels oder frei erfundenen Systemgrenzen.
- Keine Quellinformation wird durch eine dekorative Vereinfachung verloren.
- Sprechertext und semantische Gruppen stimmen überein.
- Quelle, Ziel und RE1-Referenz wurden visuell nebeneinander geprüft.
- Kapitelweite Titel-, Raster-, Footer-, Linien-, Tabellen- und Assetkonsistenz ist bestätigt.

## Definition of Done für diesen Planungsschritt

- [x] Alle 165 Quell-SVGs erneut inventarisch und visuell geprüft.
- [x] Alle Sprechertext-Zuordnungen und Aufbaugruppen berücksichtigt.
- [x] Die vorgegebene Kapitel- und Lektionsstruktur vollständig übernommen.
- [x] Alle Quellfolien genau einer der 51 geplanten Szenen zugeordnet.
- [x] Aufbauzustände innerhalb von Lektionen gebündelt.
- [x] Lektionsgrenzen trotz gemeinsamem Sprechertext nicht unkontrolliert zusammengezogen.
- [x] RE1 als vollständiges Referenzdesign verriegelt.
- [x] Modulweite Kapitelübergänge und wiederverwendbare Systeme definiert.
- [x] Asset- und Animationsstrategie vor der nächsten Folienproduktion festgelegt.
- [x] Kapitel 2 zurückgesetzt; keine neue Kapitel-2-Zielfolie produziert.
