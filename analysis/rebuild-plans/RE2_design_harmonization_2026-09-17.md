# RE2 · Reine Designangleichung · 17.09.2026

Nutzerauftrag: Alle bisherigen Inhalte und bewährten Strukturen sind gutgeheißen;
nur das Design an die neuen RE3-/RE4-Szenen angleichen.

Planungsmodus `module_redesign`, Artefakte transparente `content_svg` 1920×1080.
Referenz-Lock: RE4::39 (Diagrammvergleich), RE4::61 (offene Hierarchie), RE4::62
(Spalten), ergänzend RE4::63/66 für technische Strukturen. Master unverändert extern.

## Umfang und Inhaltsschutz

69 aktive Szenen gemäß `RE2_scene-plan.json`; die 160 vorhandenen Dateien enthalten
zusätzlich ausgeblendete historische Aufbauzustände. Nur die 69 aktiven Work Units
werden bearbeitet. UI-Nummer und Dateinummer ausdrücklich unterscheiden.

Vollständiges Szeneninventar, Quellzuordnungen, IDs, Dateihashes und gesicherte
Ausgangsartefakte: `analysis/render-checks/RE2/design-harmonization-2026-09-17/baseline.json`
und `baseline/`. Alle 69 Zielbilder wurden als sechs Übersichten gesichtet.
Quelltextmapping geprüft: 165 Zuordnungen, keine Fehler; bestehende zurückgestellte
Textabschnitte werden bei diesem reinen Designauftrag nicht verändert.

Für jede Szene gilt dieselbe vollständige Inhaltsklassifikation:
- `must_preserve`: sämtliche sichtbaren Texte, Werte, Formeln, Bildassets, Gruppen,
  Prozessnavigation, Diagrammgeometrie, Beziehungstopologie, IDs und Manifestschritte.
- `reframe`: Typografie und Textgewicht, marineblaue Abschnittsflächen,
  bestehende Flächenecken, kleine Callout-Akzente, neutrale Farbtöne.
- `decorative_remove`: nur ersetzte Überschriftenlinien und rein dekorative
  Vollflächen hinter unverändert weiter sichtbaren Merksätzen.
- Keine fachlichen Ergänzungen, Umformulierungen oder neuen Assets.

## Gestaltung und Umsetzung

Archivo für Inhalt, Oxanium für echte Überschriften; geringeres Schriftgewicht,
Marineblau #142452, schmale semantische grüne Akzente. Gleichrangige Flächen folgen
derselben blauen Familie. Bestehende Risikofarben, FMEA-Prozessschritte und technische
Symbolformen bleiben erhalten. Relevante Diagrammkurven werden nicht neu berechnet.

Pilot: ABC-Vergleich (Datei017/UI12), danach jeder bestehende Archetyp einzeln.
Die Umsetzung liest jede freigegebene Ausgangs-SVG und ändert gezielt ihre
Darstellung; alte Kapitelgeneratoren werden wegen zwischenzeitlicher manueller
Korrekturen nicht zur Rekonstruktion verwendet. Manifestdateien bleiben bytegleich.

Pro Szene: Änderung → statisches Render → visueller Vergleich und Inhaltsschutz →
technische QA und bestehende Animationszustände → Korrektur vor nächster Szene.
Unabhängige visuelle QA gemäß PPTX-Skill; abschließend Konsistenzprüfung mit den
konkreten Referenzfolien. Nachweise unter dem oben genannten Reviewverzeichnis.

## Umsetzung und Einzelkorrekturen

Alle 69 aktiven Work Units wurden aus dem gesicherten Ausgangsstand gestaltet,
einzeln gerendert und mit ihren bestehenden Animationszuständen geprüft.
Die neue Gestaltung verwendet ruhigere Textgewichte, marineblaue Abschnittsköpfe
mit der bestehenden Education-Fase, dezente Rahmen und offene Hinweise mit
schmalem grünem Akzent. Technische Symbole und semantische Risikofarben bleiben
erhalten. Mehrzeilige Fachtexte und dichte Tabellen wurden nicht verkleinert.

Gezielte Abstands- und Kontrastkorrekturen, jeweils ohne Inhaltsänderung:

- Datei060: mehr seitlicher Innenabstand für „NOTSTROMAGGREGAT“ bei unveränderter
  Schriftgröße und unveränderten Verbindern.
- Datei071 und097: Ziel-/Regelhinweise geöffnet; Text und Einblendungsgruppe bleiben
  vollständig erhalten.
- Datei075: Moderator und Basisteam erhalten getrennte Navy-Abstufungen. Die
  unabhängige Sichtprüfung erkannte eine zunächst verschmolzene Farbgrenze;
  korrigiert und erneut freigegeben.
- Datei088: Ebenenbeschriftung über den unteren Knoten gesetzt, damit sie vollständig
  sichtbar ist. Datei095: untere Funktionsflächen mit zusätzlichem Innenabstand.
- Datei109 und119: einheitliche Vergleichsköpfe und helle Inhaltsflächen.
- Datei143/147/153: ausreichender Abstand zwischen Methodenlabel und Abschnittskopf.
- Datei009: fehlendes technisches Einbettungsattribut am SVG ergänzt; keine sichtbare
  Änderung. Damit besteht auch der vorhandene Transparenz-/Einbettungstest.

Im abschließenden Konsistenzdurchlauf wurden die finalen Schriftgewichte auf
Datei006/008/010/011/017/019/024/057/058 angewendet und die betroffenen Endbilder
und Animationszustände erneut gerendert und geprüft.

## Prüfergebnis

- Inhaltsschutz gegen den gesicherten, vom Nutzer akzeptierten Ausgangsstand:
  69 Szenen, 1.699 Textknoten und 52 Bildeinbindungen ohne Abweichung.
  Alle vorhandenen technischen Pfade, Linien, Kreisgeometrien, IDs und
  Gruppentransformationen erhalten. Alle gesicherten Animationsdateien bytegleich.
- Sprechertext-/Cueprüfung: 69 Szenen und 258 Schritte, keine Fehler.
- Vier vorhandene RE2-Tests bestanden: aktive Szenen im Viewer, Kapitelzuordnung,
  transparente Inhalts-SVGs und Generatorvertrag.
- 69 statische Endbilder und 296 Zustandsbilder erzeugt. Unabhängige visuelle QA
  bei Originalgröße und 960 × 540; Berichte im Reviewverzeichnis.
- Gesamt-QA mit Viewer: 161 SVG-Dateien und 160 Manifeste inventarisiert;
  Layoutprüfung von 70 Dateien einschließlich eingebettetem Plot in 301 Zuständen,
  keine Layoutfehler oder Layoutwarnungen. Alle aktiven Szenen verfügbar, keine
  unaufgelösten lokalen Bildeinbindungen.

Die Gesamt-QA enthält zwei begründete Bestandsmeldungen für Datei071: Die statische
Bounds-Regel ignoriert den unverändert vorhandenen Transform eines dekorativen
Kreises und meldet dessen rohe negative X-Koordinaten. Der identische Ausgangskreis
liegt gerendert innerhalb der Folie; Browserlayout und Sichtprüfung bestehen.
Der Befund bleibt im Rohreport sichtbar und ist unter
`qa-071/accepted-baseline-finding.json` dokumentiert. Eine weitere Bestandswarnung
betrifft das absichtlich breite Seitenverhältnis des eingebetteten Badewannenplots.
Keine neu eingeführten oder ungeklärten QA-Befunde.

Nachweise: `preservation.json`, `final-qa/svg-qa-report.json`,
`pilot-visual-review.md`, `review-scenes-01-19.md`, `review-scenes-20-40.md`,
`review-scenes-41-57.md`, `review-scenes-58-69.md`, `final-consistency-review.md`,
sowie `before/`, `after/`, `states/` und die sechs `after-sheet-*.png`.

## Übertragbare Erkenntnis

Bei einem ausdrücklich reinen Designauftrag gilt der akzeptierte aktuelle
Szenenstand als Inhaltsvertrag. Keine erneute Ableitung aus alten Generatoren,
keine gekürzten Merksätze und keine neue Animationsdramaturgie. Farbangleichungen
müssen vorhandene semantische Abstufungen erhalten; insbesondere dürfen angrenzende
Hierarchiestufen nicht durch identische Flächenfarben verschmelzen.
