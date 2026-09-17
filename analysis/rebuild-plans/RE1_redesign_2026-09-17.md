# RE1 · Darstellung und Design · 17.09.2026

Auftrag: Alle 77 aktiven Szenen gestalterisch überarbeiten. Der Nutzer bestätigt
die fachlichen Inhalte, beanstandet aber ausdrücklich auch die Darstellung und
die visuelle Lösung. Deshalb über reine Farb- und Schriftangleichung hinaus
Komposition, Hierarchie, Diagrammproportionen und Erklärflächen verbessern.

## Referenz-Lock

Planungsmodus `module_redesign`, Zielmodus pro Szene `content_svg`, 1920×1080,
transparent. Titel, Footer, Logo und Hintergrund gehören dem Downstream-Master.
Aktuelle Referenzen: `RE4/slide_039` (offener Vergleich), `RE4/slide_061`
(Zuordnung), `RE4/slide_062` (drei klare Erklärbereiche), ergänzend die gerade
freigegebene RE2-Harmonisierung. Referenzbilder liegen unter
`analysis/render-checks/RE1/redesign-2026-09-17/references/`.

Marineblau #142452, Archivo für Inhalte, Oxanium für echte Bereichsüberschriften,
wenige schmale grüne Akzente, offene Hinweise, kleine Fase an Abschnittsköpfen.
Keine Hintergrundverläufe, dekorative Farbrotation oder verschachtelten Karten.
Technische Farbrollen bleiben dort erhalten, wo sie Datenreihen, Zustände oder
Risiken unterscheiden. Bestehende PNGs, Fotos und fachliche Zeichnungen bleiben.

## Inhalt und Sequenz

Kanonische Zuordnung: `RE1_scene-plan.json` und `RE1_source-reference-map.json`.
77 aktive Szenen aus 96 Quell-SVGs. Mapping geprüft: keine Fehler, ausschließlich
bereits zurückgestellte historische Textabschnitte als Warnungen.
Keine Szenen zusammenlegen, entfernen oder umnummerieren. Sprechertexte bleiben
unverändert. Quell-SVGs werden nicht verändert.

Vollständiges Inventar je Szene einschließlich aller Texte, Bilder, Gruppen und
Sprechertexte: `analysis/render-checks/RE1/redesign-2026-09-17/content-inventory.json`.
Gesicherte Ausgangsdateien und Hashes: `baseline/`, `baseline.json` und
`scene-plan-baseline.json` im selben Verzeichnis.

- `must_preserve`: Fachbegriffe, Werte, Formeln, Datenreihen, Bilder, Beziehungen,
  Beispiele, Aufgaben, vollständige Sprechertexte und stabile Scene_IDs.
- `reframe`: räumliche Anordnung, Textumbruch, Hierarchie, Diagrammplatzierung,
  Gruppierung und Beschriftungspositionen bei unveränderter fachlicher Zuordnung.
- `decorative_remove`: Vollfolienhintergründe, unnötige Container, mehrfach
  verschachtelte Flächen, dekorative Linien und unbegründete Buntflächen.
- Keine neuen fachlichen Aussagen. Bestehende Labels werden weiterverwendet.
- Plotkurven und Formeln werden aus den geprüften Python-/Formelassets übernommen;
  keine freie Nachzeichnung oder Änderung von Werten und Skalen.

## Sequenz- und Komponentenplan

Die szenenweise Tabelle mit Ausgangsbefund, Lernbotschaft, Kompositionsentscheidung,
Assets und Animationsgruppen wird in `RE1_redesign_2026-09-17.scenes.json` geführt.
Sie ergänzt die bestehenden vollständigen Quell- und Sprechertextzuordnungen.

| Szenen | Darstellung und Produktionsabsicht |
| --- | --- |
| 1, 3, 4 | Fallbeispiele: Bild und technische Ursache klar trennen, Auswirkungen in einer offenen Kennzahlenzeile; identische wiederkehrende Struktur. |
| 2, 7 | Datengrafik mit ruhiger, direkt zugeordneter Interpretation; keine bunten Kennzahlenkästen. |
| 5 | Konsequenzen als drei gleichrangige, klar betitelte Bereiche mit sichtbarer gemeinsamer Herkunft. |
| 6 | Einflüsse um ein klar erkennbares Zentrum, lesbare Gruppen und zurückhaltende gerichtete Verbindungen. |
| 8 | Bild und zusammenhängendes Zitat; Pointe und Intention typografisch ordnen. |
| 9 | Systemhierarchie und Funktions-/Fehlerwirkung räumlich trennen, Bezugsobjekte erhalten. |
| 10–12 | Gemeinsame Plotproportionen und stabile Lage der Verteilungen; Erklärungen offen anordnen, Konsequenzen unterordnen. |
| 13, 71 | Zusammenhängende Definition mit klaren semantischen Betonungen und einer einheitlichen Bildsprache. |
| 14 | Integrierte Zuordnung von Methoden zu Phasen erhalten, Überschriften und Ergebnisbänder beruhigen. |
| 15, 72 | Gleichrangiger Methodenvergleich mit marineblauen Abschnittsköpfen, offenen Werkzeuglisten. |
| 16 | Zwei Strategien als zusammenhängender Vergleich; qualitative/quantitative Absicherung im selben Bereich. |
| 17, 73 | Fünf Phasen als lesbare offene Matrix; Lebenszykluszuordnung bleibt explizit. |
| 18–26 | Ruhige Phasenorientierung und erkennbare fachliche Hauptgrafik, weniger umschließende Kästen. |
| 27–39 | Zusammenhängende Statistikfolge mit kompaktem Funktionsnavigator, größeren Erklärgrafiken und geordneten Interpretationen. |
| 40–49 | Kennzahlen über Vergleich, Achse oder Rechenweg erschließen; Formeln und Ergebnisse klar trennen. |
| 50–63, 68–70 | Einheitliche Verteilungsfamilie: Plot, Parameter und Anwendung; Formelübersichten als offene Zeilen statt große Tabellenkarte. |
| 64–67 | Weibullnetz mit ausgewogenen, möglichst höheren Plotproportionen und lesbaren Skalen; Schritte bzw. Mechanismen direkt zuordnen. |
| 74–77 | Wiederverwendung der überarbeiteten Stammkomponenten; gleiche Parameter-, Phasen- und Diagrammlogik im Rückblick. |

## Produktions- und Prüfablauf

Strikt eine Szene bzw. fachlich zusammenhängende Sequenzgruppe zur Zeit.
Pilot je Archetyp: 1 (Fallbeispiel), 5 (Vergleich), 6 (Zentralgrafik), 15
(Methodenvergleich), 17 (Phasenmatrix), 27 (Plot und Erklärung), 52 (Formeln).
Jede Szene: Ausgangsbild und Sprechertext → statische Gestaltung → Render und
Quell-/Referenzvergleich → Inhaltsschutz → Zustandsrender → technische QA →
Befunde beheben, bevor die nächste Szene beginnt.

Bestehende semantische Animationen und Trigger werden bevorzugt erhalten.
Umplatzierte Elemente bleiben in ihrer fachlichen Animationsgruppe. Neue Flächen
erscheinen atomar mit den Inhalten. Bei notwendiger Änderung erst nach statischer
Freigabe einen belegten Beat-/Triggerplan erstellen; keine erfundenen Zeitpunkte.
Endpunkte vor Verbindern und keine vorweggenommenen Ergebnisse.

Unabhängige visuelle Prüfung durch den Reviewer gemäß PPTX-Skill, in 1920×1080
und 960×540, einschließlich aller relevanten Zustände. Abschließend modulweiter
Konsistenzvergleich und vollständige Viewer-QA.

## Feedback-Learning

Reichweite `module_pattern`: Eine gewünschte bessere Darstellung erfordert eine
Entscheidung über Informationshierarchie und visuelle Beziehungen je Szene.
Eine bloße Tokenmigration genügt diesem Auftrag nicht. Erfolgreiche bestehende
Grafiklogik bleibt erhalten; neue Container ersetzen keine Erklärung.

## Abschluss

In Bearbeitung. Szenenfreigaben, Korrekturen und Prüfungsergebnisse werden im
Reviewverzeichnis dokumentiert; keine Fertigmeldung vor Abschluss aller 77.
