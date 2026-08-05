# RE2 Kapitel 2 – Redesign-Brief

## Identität

- Modul: `RE2`
- Kapitel: 2
- Quellfolien: 4 bis 19
- Zielumfang: 9 Szenen
- Planungsmodus: `module_redesign`
- Zielmodus je Szene: `full_slide`
- Zielsystem: eigenständige RelTest-Academy-Folien-SVGs
- Zielauflösung: `1920 × 1080`
- Sprechertext: `analysis/inventories/RE2_svg-text-map.json`, Abschnitte `section_003` bis `section_011`
- Quellenreferenzen: `analysis/rebuild-plans/RE2_source-reference-map.json`

## Referenz-Lock

- Benanntes Referenzmodul: `RE1`
- Referenz-SVGs:
  - `rebuild-proposals/svg/RE1/slide_001/slide_001.svg`
  - `rebuild-proposals/svg/RE1/slide_005/slide_005.svg`
  - `rebuild-proposals/svg/RE1/slide_006/slide_006.svg`
  - `rebuild-proposals/svg/RE1/slide_009/slide_009.svg`
  - `rebuild-proposals/svg/RE1/slide_013/slide_013.svg`
  - `rebuild-proposals/svg/RE1/slide_022/slide_022.svg`
  - `rebuild-proposals/svg/RE1/slide_037/slide_037.svg`
  - `rebuild-proposals/svg/RE1/slide_045/slide_045.svg`
- Artefaktmodus der Referenz: `full-slide`
- BrandFrame: heller technischer Verlauf, 80-px-Raster, Cyan-Akzent, Titelzone, Footer und Szenenkennung
- Tokenquelle: `brand/reltest-academy-slide-design-tokens.json`
- Typografie: Segoe UI als getesteter Produktions-Fallback; Titel 50–56 px, Primärtext möglichst mindestens 22 px
- Karten: Radius 8 px, 1,5-px-Kontur, ruhige Schatten
- Verbinder: 1,5 bis 2,5 px normal, 4 px betont, keine Strichstärke über 6 px
- Bildsprache: reale beziehungsweise semi-realistische technische Motive groß und eindeutig, Diagramme als präzise native SVG-Strukturen
- Bewusste Abweichung: Für die PV-Anlage wird eine neue konsistente technische PNG-Familie eingesetzt, weil RE1 kein passendes PV-Beispiel enthält und der Nutzer konkrete Motive ausdrücklich verlangt hat.

## Review-Learnings

- Geladener Audit: `analysis/rebuild-plans/RE2_chapter_02_quality_failure_audit.md`
- Verbindliche Korrekturen:
  - keine transparente Content-SVG-Familie,
  - keine globale Textfüllung bei hellen und dunklen Texten,
  - keine generischen Ersatzboxen für konkrete Motive,
  - kein unbelegtes `Systemgrenze`-Label auf Folie 8,
  - keine übergewichtigen Linien oder Pfeilköpfe,
  - Zielrender und Dreifachvergleich vor Freigabe,
  - statischer Endzustand vor Animation,
  - eine Szene vollständig prüfen, bevor die nächste beginnt.

## Gemeinsame Lernkette

Kapitel 2 führt vom sichtbaren technischen Gesamtsystem über Systemgrenzen, Schnittstellen, Einflussgrößen, Komponenten und Funktionen bis zur Kritikalitätsbewertung. Jede Szene beantwortet genau eine aufeinander aufbauende Frage:

1. Was gehört zum betrachteten System?
2. Auf welcher Ebene und an welchen Schnittstellen analysieren wir?
3. Welche Größen wirken auf das System?
4. Wie suchen wir Ursachen systematisch?
5. Welche Komponenten und Ströme liegen innerhalb der Grenze?
6. Wie sieht das konkrete Bauteilnetz des Wechselrichters aus?
7. Welche Funktionen erfüllt das System?
8. Welche Ausfallarten und -mechanismen sind kritisch?

## Inhaltsinventar und Szenenarchitektur

| Work Unit | Quellen | Dominante Lernbotschaft | Must preserve | Reframe / visual replace | Primärer Archetyp |
|---|---:|---|---|---|---|
| `slide_004` | 4–5 | Die gewählte Systemgrenze bestimmt, welche PV-Komponenten und Wechselwirkungen untersucht werden. | PV-Module, Wechselrichter, Batterie, Zähler, öffentliches Netz, Hausverbrauch, DC/AC-Fluss, PV-Systemgrenze, Wechselrichtergrenze | konkrete Motive als PNG; Grenzen als präzise SVG-Flächen; Energiefluss ruhig horizontal | Media Aside / technisches Systemdiagramm |
| `slide_006` | 6–7 | Umwelt, System, Subsystem und Komponente bilden verschachtelte Analyseebenen; die Grenze erzeugt Schnittstellen. | alle vier Ebenen, Quellbeispiele, Wechselrichterfokus, Systemgrenze, Schnittstellen | konzentrische Ebenen in klare horizontale Tiefenstaffel überführen | Hierarchie-/Ebenendiagramm |
| `slide_008` | 8 | Das P-Diagramm ordnet Eingangs-, Steuer-, Stör- und Zielgrößen um Produkt oder Prozess. | genau vier Größenklassen und Zentrum `System: Produkt / Prozess` | ruhiges Kreuzlayout; keine zusätzliche Systemgrenze | SVG-Diagramm |
| `slide_009` | 9 | Beim Wechselrichter werden Gleichstrom, Signale, Betätigungsenergie und Störungen in Wechselstrom überführt. | Gleichstrom, Signal, SOS/Betätigungsenergie, Vibration, Schmutz, Wärme, Feuchtigkeit, Wechselstrom; Wechselrichter | dieselbe P-Diagramm-Grammatik wie Folie 8; Wechselrichter-PNG als Zentrum | SVG-Diagramm / Anwendung |
| `slide_010` | 10 | Das Ishikawa-Diagramm strukturiert Ursachen eines PV-Leistungsverlusts in fünf M-Kategorien. | Wirkung, Leserichtung rechts nach links, Materialien, Maschinen, Mensch, Methoden, Milieu und alle sichtbaren Beispiele | Fischgräten-Geometrie vereinfachen, Kategorien und Beispiele vollständig erhalten | Ursache-Wirkungs-Diagramm |
| `slide_011` | 11–12 | Ein Bauteilblockdiagramm macht Komponenten sowie Energie-, Stoff- und Informationsströme sichtbar. | Systemgrenze, zwei Komponenten, externe und interne Ströme in drei Kategorien | klare 2-Komponenten-Grundstruktur mit farbcodierten Flusskorridoren | Technisches Blockdiagramm |
| `slide_013` | 13 | Das reale Wechselrichter-Blockdiagramm verbindet Leistungspfad, Steuerung, Kommunikation und Umwelteinflüsse. | alle Quellbaugruppen, Energie-/Informations-/Stoffströme, globale Einflüsse, Systemgrenze | dichtes Diagramm in vier lesbare Ebenen ordnen; keine Baugruppe entfernen | Dichtes technisches Blockdiagramm |
| `slide_014` | 14–16 | Die Hauptfunktion wird von der Black Box über Teilfunktionen zur konkreten Wechselrichter-Funktionskette zerlegt. | Ein-/Ausgangsgrößen, lösungsneutrale Funktion, Teilfunktionen, Hauptfunktion DC→AC, acht nummerierte Wechselrichterfunktionen und Signalbeziehungen | drei Quellzustände als eine stabile Aufbaukomposition | Workflow / Funktionsstruktur |
| `slide_017` | 17–19 | Die ABC-Analyse verbindet Bauteile, Ausfallarten und -mechanismen mit einer nachvollziehbaren Kritikalitätsklasse. | fünf Bauteile, alle Ausfallarten/-mechanismen, A/B/C-Regeln, sämtliche Bewertungen, Übergang zur FTA | Tabellen als lesbare Fokusmatrix; Regeln in drei Klassenbändern; Ergebnis spaltenstabil | Tabelle / Bewertungssequenz |

## Zielerweiterungen und Evidenz

| Zielobjekt | Klassifikation | Beleg | Evidenzattribute |
|---|---|---|---|
| vollständiger RE1-BrandFrame | `target_addition` | notwendige Marken- und Orientierungsfunktion | `data-source-evidence="brand_frame"` |
| technische PNG-Motive der PV-Anlage | `visual_replace` | Quell-SVG plus ausdrücklicher Nutzerauftrag | `data-source-evidence="user_request"` und konkrete Referenz |
| Fokusnummern oder kleine Methodenlabels | `target_addition` | rein orientierende Funktion ohne neue Fachbeziehung | `data-source-evidence="orientation"` |

Neue Fachbegriffe, Systemgrenzen, Kategorien oder Pfeilbeziehungen ohne Beleg sind nicht erlaubt.

## Assetstrategie

### Gemeinsame PV-Assetfamilie

- Quelle: integriertes Bildgenerierungs-Asset-Sheet, Built-in-Modus
- Stil: semi-realistische technische Produktillustration, einheitlicher Blickwinkel, Navy/Cyan/Neutral
- Gemeinsamer Pfad: `components/image-library/re2-ch2-pv/`
- Einzelassets:
  - `pv-panels.png`
  - `inverter.png`
  - `battery-storage.png`
  - `electricity-meter.png`
  - `public-grid-pylon.png`
  - `household-consumers.png`
- Erkennbarkeitsstatus: offen bis zur Prüfung im Zielrender von `slide_004`

### Native Komponenten

- BrandFrame und Titel-/Footerstruktur
- Systemgrenzen
- P-Diagramm-Knoten und Verbinder
- Ishikawa-Hauptachse und fünf Gräten
- Bauteil- und Funktionsblöcke
- ABC-Klassifikationschips und Tabellenraster

## Animation

Alle neun Szenen sind aufgrund von Sprechertext und belegten Quellzuständen als `animated` vorgesehen. Die Animation wird jedoch erst nach bestandenem statischen Endzustand je Szene umgesetzt.

| Work Unit | Narrative Reihenfolge | Semantische Hauptgruppen |
|---|---|---|
| `slide_004` | Umgebung → PV-Komponenten → PV-Grenze → Wechselrichtergrenze | `environment`, `pv_components`, `pv_boundary`, `inverter_boundary` |
| `slide_006` | Umwelt → System → Subsystem → Komponente → Wechselrichterfokus → Schnittstellen | `environment_level`, `system_level`, `subsystem_level`, `component_level`, `focus_boundary`, `interfaces` |
| `slide_008` | Zentrum → Eingänge → Steuergrößen → Störgrößen → Zielgrößen | `system_center`, `inputs`, `controls`, `noise`, `outputs` |
| `slide_009` | Wechselrichter → DC-Eingang → Steuergrößen → Störgrößen → AC-Ausgang | `inverter_center`, `dc_input`, `control_inputs`, `noise_inputs`, `ac_output` |
| `slide_010` | Wirkung → fünf Kategorien → Beispiele je Kategorie | `effect`, `cause_categories`, `cause_examples` |
| `slide_011` | Systemgrenze → Komponenten → externe Ströme → interne Ströme → Legende | `boundary`, `components`, `external_flows`, `internal_flows`, `flow_legend` |
| `slide_013` | Systemgrenze/Architektur → Leistungspfad → Steuerung/Überwachung → Kommunikation → globale Einflüsse | `architecture`, `power_path`, `control_monitoring`, `communication`, `global_influences` |
| `slide_014` | Black Box → Teilfunktionen → Hauptfunktion → acht Teilfunktionen | `black_box`, `generic_decomposition`, `inverter_main_function`, `inverter_subfunctions` |
| `slide_017` | Bauteile → Ausfallarten/-mechanismen → ABC-Regeln → Ergebnis → FTA-Übergang | `inventory`, `failure_details`, `classification_rules`, `classification_result`, `fta_bridge` |

Verbindlich: Inhalte erscheinen vor Beziehungen. Ein Pfeil oder Verbinder wird frühestens gemeinsam mit allen für seine Aussage benötigten Endpunkten sichtbar.

## Statische Freigabe vor Animation

Für jede Szene werden erzeugt:

- Zielpreview 1920×1080,
- Zielpreview ungefähr 960×540,
- Quellenpreview,
- vergleichbare RE1-Referenzpreview,
- kombinierter Dreifachvergleich.

Geprüft werden:

- Inhalt und Beziehungstopologie,
- berechneter Textkontrast,
- Text-Randabstand,
- typische und maximale Strichstärke,
- Pfeilkopfproportionen,
- Asset-Erkennbarkeit,
- Safe Areas und Footerabstand,
- Dichte und Weißraum.

Der Status startet je Szene mit `open`. Animation ist erst bei `passed` zulässig.

## Produktionsreihenfolge und Piloten

1. `slide_004`: Pilot für Media/technisches Systemdiagramm und PNG-Familie.
2. `slide_006`: Pilot für Ebenen-/Hierarchiediagramm.
3. `slide_008`: Pilot für P-Diagramm.
4. `slide_009`: geprüfte Übertragung des P-Diagramms.
5. `slide_010`: Pilot für Ursache-Wirkungs-Diagramm.
6. `slide_011`: Pilot für technisches Blockdiagramm.
7. `slide_013`: dichte Ausprägung des Blockdiagramms.
8. `slide_014`: Pilot für Funktionsstruktur.
9. `slide_017`: Pilot für Tabellen-/Bewertungssequenz.

Jede Arbeitseinheit wird statisch gebaut, gerendert, crossgecheckt, korrigiert und erst danach animiert. Erst nach abgeschlossener Re-QA beginnt die nächste Arbeitseinheit.

## QA-Schwerpunkte

- keine globale `text { fill: ... }`-Kaskade,
- keine Strichstärke über 6 px,
- keine überdimensionierten Pfeilköpfe,
- keine unbelegten Zieltexte,
- kein `Systemgrenze`-Label in `slide_008`,
- sichtbarer weißer Text auf Navy,
- keine generischen Boxen anstelle der geforderten PV-/Netz-/Haushaltsmotive,
- keine Textüberläufe oder zu kleinen Tabellenlabels,
- vollständige Sprechertext- und Quellenabdeckung,
- jeder Animationszustand fragmentfrei,
- kapitelweit gleiche Titel-, Footer-, Karten-, Linien-, Asset- und Farbgrammatik.

## Offene Produktionsfragen

- Das offizielle Logo liegt im vorhandenen RE1-Referenzstand weiterhin nicht als freigegebenes Originalasset vor. Der reservierte Logozustand wird wie in RE1 unverändert übernommen und nicht nachgezeichnet.
