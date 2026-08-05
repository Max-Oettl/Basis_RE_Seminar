# RE2 Kapitel 1 – Umsetzungsbericht

## Ergebnis

Kapitel 1, Lektion 1 ist für die Quellfolien 1 bis 3 als zwei Content-SVG-Szenen umgesetzt:

- `re2_ch1_methods`: Folien 1 und 2 als gemeinsame Aufbaufolge
- `re2_ch1_lifecycle`: Folie 3 als eigenständige Badewannenkurven-Szene

Folie 2 wird im Viewer als Alias des gemeinsamen Master-SVGs von Folie 1 angezeigt. Dadurch bleibt der belegte Aufbauzustand erhalten, ohne eine doppelte Zieldatei zu erzeugen.

## Sprechertext

- Folien 1 und 2 verwenden unverändert `section_001`.
- Folie 3 verwendet unverändert `section_002`.
- Szene 1 besitzt sieben Animationsschritte in sechs Sprechertext-Triggergruppen.
- Szene 2 besitzt sechs Animationsschritte in fünf Sprechertext-Triggergruppen.
- Alle elf eindeutigen Triggerphrasen wurden gegen die aktuelle Sprechertextzuordnung gefunden.

## Gestaltung

- Content-SVG-Modus mit transparentem Außenbereich
- keine Folientitel, Logos, Lautsprecher oder PowerPoint-Masterelemente im SVG
- semantische, stabile Animationsgruppen
- FTA und FMEA als finaler Aufbauzustand der Methodenszene
- Badewannenkurve aus dem kanonischen Python-Plotgenerator
- identische Farbsemantik für qualitative und quantitative Methoden in beiden Szenen

## QA

- Strenge SVG-, Design- und Browser-Layout-QA: `0 Fehler`
- Verbleibender Hinweis: Das szenenlokale Plotasset ist absichtlich breiter als 16:9; es wird innerhalb der 16:9-Szene eingebettet.
- Viewer: Folien 1 bis 3 besitzen alle eine SVG- und Animationsansicht; Folie 2 ist korrekt Alias von Folie 1.
- Inhalts-Crosscheck: keine technischen Fehler oder Warnungen; Status bleibt bis zur visuellen Nutzerprüfung `review_required`.
- Relevante automatisierte Viewer-Tests: `31/31 bestanden`

## Viewer-Korrektur für lokale Plotassets

- Befund: Beim Inline-Einbetten einer SVG löste der Viewer relative `href`-/`src`-Pfade gegen die Viewer-Startseite statt gegen den Speicherort der SVG auf. Dadurch wurde `plots/bathtub_curve.svg` in Szene 3 nicht geladen.
- Korrektur: Sichere lokale Assetpfade werden beim Einlesen nun gegen die URL der jeweiligen Quell-SVG aufgelöst; externe Ursprünge bleiben blockiert.
- Browsernachweis: Das Plotasset wird unter `/files/rebuild-proposals/svg/RE2/slide_003/plots/bathtub_curve.svg` mit Inhalt geladen und besitzt im Viewer eine sichtbare Renderfläche.
- Interaktion: Nach `Zuruecksetzen` ist die Plotgruppe erwartungsgemäß abgeblendet; nach `Abspielen` wird sie vollständig sichtbar.
- Konsole: keine Fehler oder unbehandelten Promise-Rejections.
- Regression: alle Viewer-Tests `31/31 bestanden`; strenge RE2-SVG-QA weiterhin `0 Fehler`.

## Korrektur der Animationsreihenfolge

- Nutzerbefund: Pfeile waren vor ihren Zielboxen sichtbar; außerdem war ein noch nicht eingeführtes Thema im Reset-Zustand bereits schwach zu sehen.
- Ursache: Einzelne Verbinder waren statischer SVG-Kontext. Zusätzlich erzwang der Viewer für das erste aktive `show`-/`draw`-Target eine Mindestdeckkraft von 15 Prozent.
- Szene 1: Kategorien und zugehöriger quantitativer Pfad erscheinen gemeinsam. Danach folgen qualitativer Fokus, qualitative Aufgaben, Maßnahmenpfad, FTA und FMEA. Sämtliche Verbinder liegen nun innerhalb des fachlich zugehörigen Animationstargets.
- Szene 3: Der Plot erscheint zuerst, danach beide Methodenfoki gemeinsam und zuletzt die Systemanalyse. Die zuvor rein dekorativen Verbinder zwischen den unteren Karten wurden entfernt.
- Viewer: Ein `show`-/`draw`-Target beginnt bei Fortschritt null vollständig transparent.
- Browsernachweis: Reset und alle fachlich relevanten Zwischenzustände beider Szenen wurden einzeln geprüft; kein statischer Verbinder und kein vorweggenommener Inhalt bleiben sichtbar.
- Regression: alle Viewer-Tests `31/31 bestanden`; strenge RE2-SVG-, Design- und Browser-Layout-QA weiterhin `0 Fehler`.

## Quellnähere Übersetzung von Szene 3

- Nutzerbeobachtung: Die visuelle Übersetzung der Quellfolie war zu frei und sollte sich stärker an deren Darstellungslogik orientieren.
- Reproduzierte Ursache: Die erste Zielversion trennte die gemeinsame Quellgrafik in eine Plotkarte oben und drei unabhängige Karten unten. Dadurch gingen die direkte Ausrichtung an den Phasengrenzen sowie die zusammenhängende Beziehung zwischen Kurve, Methodenfokus und Ergebnisbändern verloren.
- Lokale Korrektur: Szene 3 ist wieder eine integrierte Diagrammkomposition. Bereichsnamen, Nummern und Grenzen liegen auf derselben Lebensdauerachse; qualitative Methoden und Systemanalyse spannen die Bereiche 1 und 2, quantitative Methoden und Nachweis bleiben dem Bereich 3 zugeordnet.
- Texttreue: Die sichtbaren Quellformulierungen `Fokus qualitative ZUV-Methoden`, `Fokus quantitative ZUV-Methoden`, `Risikoreduktion durch Systemanalyse` und `Nachweis Zuverlässigkeit` wurden ohne zusätzliche Erklärkarte übernommen.
- Reichweite: `project_rule` – fachlich wirksame Achsen-, Phasen- und Bandzuordnungen einer Quelle bleiben als integrierte Komposition erhalten und werden nicht in konkurrierende Kartenbereiche zerlegt.
- Aktualisierte Schubladen: Redesign-Brief, Szenenbrief, Sequenzplan und `review-derived-design-rules.md`.
- Verifikation: direkter visueller Quelle-Ziel-Vergleich, aktualisierter Content-Crosscheck sowie strenge SVG-, Design- und Browser-Layout-QA mit `0 Fehlern`. Der einzige Hinweis betrifft weiterhin das absichtlich breite szenenlokale Plotasset.

## Artefakte

- Plan: `analysis/rebuild-plans/RE2_sequence_plan.md`
- Quellenreferenzen: `analysis/rebuild-plans/RE2_source-reference-map.json`
- Szene 1: `rebuild-proposals/svg/RE2/slide_001/`
- Szene 2: `rebuild-proposals/svg/RE2/slide_003/`
- QA-Bericht: `analysis/render-checks/RE2/automated-svg-qa/svg-qa-report.md`
- finale Vorschauen: `analysis/reports/RE2-chapter1-target-previews-final/`
