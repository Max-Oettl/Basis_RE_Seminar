# Slide Redesign Brief – RE2 Szene 60 / FMEA-Formblatt

## Identität

- Modul: RE2
- Zielszene / Scene_ID: `slide_132` / `re2_ch4_documentation`
- Quellfolien: 132–136, primärer Endzustand 136
- Sprechertextquelle: `analysis/source-text/RE2/extracted/02_Modul_Qualitative Methoden - FMEA.md`, Abschnitt `Ergebnisdokumentation`
- Umfang: `module_pattern` (konkreter Zielzustand `slide_132`; Generatorregel übertragbar auf die Formblattsequenz)
- Ausgabemodus: `content_svg`
- Zielsystem: Basis-Rebuild-Viewer und Downstream-PowerPoint-/Video-Master
- Zielauflösung: 1920×1080, zusätzliche Sichtprüfung bei 960×540

## Nutzerfeedback und Befund

- Nutzerbeobachtung: Das eingebettete FMEA-Blatt wirkt alt beziehungsweise zu niedrig aufgelöst.
- Reproduzierte Ursache: Der Zielzustand verwendet ein eingebettetes PNG mit 1100×485 px, das im SVG auf 1672×500 px vergrößert wird. Dadurch bleiben Tabellenlinien und Beschriftungen im Viewer rasterig.
- Primärkategorie: Asset-Typ / Lesbarkeit; Sekundärkategorie: Redesign einer technischen Tabelle.
- Reichweite: `module_pattern`, weil die vierstufige FMEA-Formblattsequenz aus derselben Generator-Komponente stammt.

## Referenz-Lock

- Aktive Brandreferenz: RelTest Education, `brand/company-brand-tokens.json`
- Vergleichbare Szenen: RE2 FMEA-Schrittübersicht und die vorhandenen Formblatt-Aufbaustufen 133–135
- BrandFrame / Titel / Footer / Logo: Downstream-Eigentum; im Content-SVG nicht enthalten
- Typografie: Archivo für Tabellen- und Inhaltstext
- Linien: 1,5 px Hairline, höchstens 2,5 px für Hauptkonturen
- Akzentlogik: Marineblau trägt die Tabelle; Signalgrün markiert ausschließlich den aktiven Optimierungs-/Dokumentationsfokus
- Bewusste Abweichung: Die bisherige Rasterreproduktion wird durch eine schematische Vektoransicht ersetzt. Sie ist keine wortgetreue Kopie eines urheberrechtlich geschützten Handbuch-Formblatts.

## Inhaltsinventar

| Quellelement oder Zielergänzung | Klassifikation | Zielbehandlung | Beleg |
| --- | --- | --- | --- |
| Sieben FMEA-Schritte mit aktivem Schritt 7 | `must_preserve` | bestehende Schrittleiste unverändert beibehalten | Quellfolien 132–136 und Sprechertext |
| FMEA-Formblatt als zusammenhängende Tabelle | `visual_replace` | eingebettetes PNG durch SVG-native Tabellengeometrie ersetzen | Nutzerauftrag und Quellfolie 136 |
| Struktur- und Funktionsanalyse | `must_preserve` | je drei Ebenen-/Funktionsspalten sichtbar | Quellfolge 133–136 und Sprechertext |
| Fehlerfolge, Bedeutung, Fehlerart, Fehlerursache | `must_preserve` | als Fehleranalyse-Spalten sichtbar | Quellfolie 136 und Sprechertext |
| Vermeidung, Auftreten, Entdeckung, AP | `must_preserve` | als aktuelle Risikoanalyse sichtbar | Quellfolie 136; RE2-Risikobewertungssequenz |
| Maßnahmen, Verantwortliche, Termine und Neubewertung | `must_preserve` | ausgebauter Optimierungsbereich | Sprechertext und Quellfolie 136 |
| AIAG-&-VDA-Logik / Aufgabenpriorität | `target_addition` | kleine, fachlich belegte Methodenkennzeichnung | ausdrücklicher Nutzerwunsch nach neuerer Darstellung; AIAG-&-VDA-FMEA-Handbuch, 1. Auflage/2. Druck 2022 |
| Rasterbild und Crop-Definition | `decorative_remove` | vollständig entfernen | technische Ursache des Nutzerbefunds |

## Lernbotschaft und Archetyp

- Dominante Aussage: Das Formblatt führt Analyse, Bewertung, Maßnahmen, Verantwortung, Termine und Neubewertung in einer durchgängigen Dokumentationslogik zusammen.
- Erkenntnis nach 3–5 Sekunden: Die rechte Optimierungszone schließt den Fehlerzusammenhang mit Umsetzung und Neubewertung ab.
- Primärer Archetyp: `SVG-Diagramm`, Spezialisierung `documentation-form`
- Verworfenes Alternativmuster: neues hochaufgelöstes PNG; es bliebe bei Zoom und Export weiterhin auflösungsabhängig.

## Komposition und Asset-Entscheidung

- Blickführung: Schrittleiste → Formkopf → Analysegruppen von links nach rechts → hervorgehobener Maßnahmen- und Neubewertungsbereich darunter.
- Layout: Metadatenkopf; breite Analysezeile; getrennte, gleich breite Optimierungs-/Neubewertungszeile; je eine exemplarisch leere Datenzeile. Die Zweiteilung verhindert unlesbare Kleinstspalten bei 16:9-Präsentationsgröße.
- Semantische Farben: Marineblau für Grundordnung, helle Marineflächen für Felder, Signalgrün für Optimierung und Schritt 7.

| Sichtbares Motiv | Semantische Rolle | Komplexität | Strategie | Zielpfad | Begründung |
| --- | --- | --- | --- | --- | --- |
| FMEA-Formblatt | technische Dokumentationsstruktur | medium | `native_svg` | `rebuild-proposals/svg/RE2/slide_132/slide_132.svg` | Tabellen, Linien und Text sind klar geometrisch und müssen verlustfrei skalieren |
| bisheriges PNG | Quellreferenz | medium | `omit_with_reason` | entfällt aus Ziel-SVG | zu geringe effektive Auflösung; kein fachlicher Mehrwert gegenüber Vektoraufbau |

## Animation

- Entscheidung: `animated`
- Bestehende semantische Gruppe: `s136_form`
- Bestehende Triggerphrase: `Einen beispielhaften Aufbau eines solchen Formblatts könnt ihr hier sehen.`
- Änderung: keine neue Animationslogik; nur der statische Inhalt innerhalb der bestehenden atomaren Formblattgruppe wird ersetzt.

## Statische Freigabe und QA

- Zielpreview: `analysis/render-checks/RE2/fmea-form-vector-refresh-2026-08-30/slide_132.png`
- Quellenpreview: `analysis/render-checks/RE2/fmea-form-vector-refresh-2026-08-30/source_136.png`
- Inhaltstransfer: Struktur, Funktion, Fehler, Bewertung, Maßnahmen, Verantwortlichkeit, Termine und Neubewertung müssen sichtbar bleiben.
- Unbelegte Zielergänzungen: nur die aktuelle Methodenkennzeichnung; durch Nutzerauftrag und offizielle AIAG-Referenz belegt.
- Text-/Kontrastrisiko: dichte Feldköpfe; Mindestschrift 18 px, explizite Zeilenumbrüche und 960×540-Sichtprüfung.
- Geometrie-/Layer-Risiko: doppelte Tabellenkonturen und unruhige Kleinstspalten vermeiden.
- Statischer Status: `passed` — 1920×1080 und 960×540 visuell geprüft; keine Überläufe oder Kollisionen.
- Technischer Status: `passed` — strenge Design- und Layout-QA für `slide_132` mit 0 Fehlern; die einzige Modulwarnung betrifft das unveränderte Hilfsdiagramm `slide_003/plots/bathtub_curve.svg`.
- Animationsstatus: `passed` — Zielgruppe `s136_form` und vorhandener Sprechertext-Trigger unverändert erhalten.
