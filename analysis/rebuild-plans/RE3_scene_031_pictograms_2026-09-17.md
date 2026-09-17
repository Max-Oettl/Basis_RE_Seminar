# RE3 Szene 31 – Datenquellen mit Linienpiktogrammen

Nutzerauftrag: Szene31 durch generierte minimalistische Linienpiktogramme
ergänzen. Modus `content_svg`, 1920×1080 transparent; stabile Scene_ID
`re3_src_031`, Quellen31/32/33, vorhandener vollständiger Sprechertext.

## Bestandsprüfung und Gestaltung

Aktueller Endzustand geprüft. Die vier Datenquellen sind gut gegliedert, aber
rein typografisch. Alle Quellinhalte und vorhandenen Sprecherphrasen bleiben
erhalten. Referenz: akzeptierte RE2/RE3-Navy-CI und bestehende vier Spalten.

Die Bibliothek wurde geprüft: generischer Kolben steht für chemisches Labor,
Fabrik nur für Produktion; beide grenzen die hier besprochenen technischen
Datenquellen ungünstig ein. Kein zusammenpassender PNG-Satz für die vier
spezifischen Kontexte vorhanden. Deshalb vier szenenbezogene, generierte PNGs
in monochromem Navy-Linienstil, keine im SVG konstruierten Icons.

Geplanter Einbau: gleiche Größe und optische Höhe in jeder Spalte, unmittelbar
über der zugehörigen Überschrift. Texte dafür behutsam vertikal komprimieren,
keinen Inhalt entfernen. Jedes Motiv bleibt mit der zugehörigen Überschrift in
deren bestehender Animationsgruppe; keine dekorativen Einzelanimationen.

## Semantik-Briefs vor Generierung

| reuseKey | concept / erstes Label | mustShowFeatures | mustNotImply / confusableWith |
| --- | --- | --- | --- |
| endurance-extreme-test | Stark beschleunigte Lebensdauerversuche | Prüfkammer, großes Prüfvolumen, Thermometer als Belastungshinweis | Kein Ausfall-/Warnstatus; keine reine Wettertemperatur |
| endurance-laboratory-test | Lebensdauerversuche im Labor | einfaches elektronisches Prüfgerät, Messanzeige | Kein chemisches Experiment; keine bloße Datenbank |
| endurance-test-drive | Versuchsfahrten | Pkw-Seitenansicht, zwei Räder | Kein Nutzfahrzeug; keine konkrete Automarke |
| endurance-customer-use | Felddaten / Feldversuche | Person, technisches Produkt als Zahnrad in den Händen | Kein Produktionswerk; kein Kundendienst-/Reparatursymbol |

Alle: `object_pictogram`, `concept-anchor`, Quelle Sprechertext section_009 und
expliziter Nutzerauftrag; erstes Label ist jeweils die sichtbare Spaltenüberschrift.
Monochrom #142452, höchstens ein semantischer Zusatz, orthografisch flach,
gleichmäßige kräftige Kontur, transparenter Hintergrund, >=8% Sicherheitsrand,
Mindestens 1024×1024 PNG. Keine Schatten, 3D, Beschriftung oder dekorativen Details.

## Prüfung und Reichweite

`local_fix`: vier Motive für diese Datenquellenübersicht. Keine allgemeine Pflicht,
jede Textfolie mit Icons zu versehen. Semantische Prüfung bei 48px und im
960×540-Szenenbild, technische PNG-Prüfung, statischer Pilot, dann bestehende
Animationen und Crosscheck erneut prüfen. Endergebnis und konkrete Befunde werden
nach dem Render dokumentiert.

## Ergebnis und Verifikation

Vier PNG-Master (je 1254×1254, echtes Alpha) mit der integrierten `image_gen`-
Bildgenerierung erstellt. Keine programmgesteuert konstruierten Icongeometrien.
Das Laborgerät erhielt eine zweite Bildbearbeitung, weil der erste Entwurf mit
7% transparentem Rand das 8%-Gate unterschritt. Finale Mindestränder: 11,1%,
14,4%, 11,2%, 11,9%. PNG-Prüfung aller vier Asset-Briefs: 0 Fehler/0 Warnungen.

Dateien unter `rebuild-proposals/svg/RE3/slide_031/media/`:

- `extreme-test.png` und `extreme-test.asset.json`
- `laboratory-test.png` und `laboratory-test.asset.json`
- `test-drive.png` und `test-drive.asset.json`
- `customer-use.png` und `customer-use.asset.json`
- `generation-prompts.json`: genaue Generierungs- und Bearbeitungsprompts,
  Modus sowie Herkunft der ausgewählten Bilder.
- `pictogram-spec.json`: szenenbezogene Semantik und stabile reuseKeys.

PNG-Inhalte sind im Szenen-SVG direkt eingebettet und somit portabel; jeder
Master bleibt zusätzlich separat zugänglich. Alle vier Motive sind in der
Piktogrammregistry mit lokalem Szenenbezug dokumentiert. Einbau mit 176×176px
pro Motiv, gleicher Mittelpunkt und Höhe; transparente Originalränder erhalten.

Statischer Endzustand vor neuer Manifestproduktion geprüft, einschließlich
960×540 und isolierter 48px-Icons. Inhalt und alle 27 Sprechertrigger erhalten;
Bild und Überschrift teilen jeweils dieselbe bestehende Animationsgruppe.
34 Zustandsbilder geprüft. Unabhängiger visueller Review: Motive verständlich,
CI konsistent, keine Überschneidungen, saubere gekoppelte Reveal-/Fokuszustände.

Strenge Design-/Layout-QA: 0 Fehler; 35 bestehende Modulhinweise beziehen sich
ausschließlich auf Seitenverhältnisse separater Plotassets, nicht auf Szene31.
Animationsplanvalidator: 0 Fehler, ein begründeter Hinweis zum Content-Start vor
dem ersten Trigger. Bestehende RE3-Content-Tests: 6/6 bestanden.

Content-Crosscheck: 3 Quellen, 39 Quellinhalte und 33 Zieltextteile, 0 Fehler,
keine unbelegten Zieltexte. Die 23 bereits bekannten Textabgleich-Hinweise sind
manuell aufgelöst: Player-Titel statt sichtbarem Mastertitel, deutsche
sprechergestützte Bezeichnungen für englische Quelllabels, `nimmt zu` statt
`Zunahme von`, `Unbeschleunigt` in der entsprechenden Laboruntergruppe. Beide
Trendrichtungen und die vier fachlichen Klassen bleiben erhalten.

Nachweise: `analysis/render-checks/RE3/feedback-31-pictograms-2026-09-17/`.
Prüfumfang sind statische und diskrete Chromium-Animationszustände;
keine Audiowiedergabe oder kontinuierliche Videoausgabe behauptet.
