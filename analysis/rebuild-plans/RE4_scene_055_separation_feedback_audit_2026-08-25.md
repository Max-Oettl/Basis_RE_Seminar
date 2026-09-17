# RE4 Review-Audit · Separation

## Szene(n)

- `slide_055`: Quellfolien 55 bis 57, Methodeneinführung
- `slide_058`: Quellfolien 58 bis 60, Fallvergleich und Berechnung
- Sprechertext: `section_007`, verlustfrei auf beide Szenen segmentiert

## Nutzerbeobachtung

Die Separation war zunächst zum großen Teil verloren gegangen. Nach der
inhaltlichen Wiederherstellung war die einzelne Szene jedoch extrem überladen.
Methodeneinordnung, Ausgangsbrücke, beide Ersatzstrukturen, Fallgewichte und
Formeln konkurrierten gleichzeitig. Die Einordnung verwendete außerdem zu viele
wechselnde Schriftgrößen und war dadurch schwer zusammenhängend lesbar.

## Reproduzierte Ursache

Sechs Quellzustände wurden auf eine einzige gleichzeitig sichtbare Komposition
verdichtet. Die nachträgliche Wiederaufnahme aller fehlenden Inhalte löste zwar
den Inhaltstransfer, aber nicht die kognitive Last. Vollständigkeit wurde durch
Miniaturisierung statt durch eine passende Szenengrenze hergestellt; die
automatische QA erkannte diesen visuellen Dichtefehler nicht.

## Lokale Korrektur

- Die Herleitung ist in zwei eigenständige Szenen mit je einer dominanten
  Lernbotschaft geteilt.
- `slide_055` zeigt nur Ausgangsbrücke, fehlende Direktreduktion, die zwei
  gleichrangigen exakten Verfahren und Komponente 5 als Schlüsselkomponente.
- Die frühere Überschrift `Einordnung` entfällt. Labels, Kernaussagen und
  Erläuterungen verwenden drei stabile Typostufen statt zeilenweise wechselnder
  Größen.
- `slide_058` zeigt die zwei disjunkten Zustände von Komponente 5, ihre großen
  Ersatzstrukturen, Fallgewichte, Teilzuverlässigkeiten und das Gesamtergebnis.
- Fall I bleibt als zwei Parallelschaltungen in Serie, Fall II als zwei
  Serienpfade parallel quellengetreu erhalten.
- Alle fünf mathematischen Darstellungen sind als kontrollierte SVG-Pfadassets
  gerendert. Die lange Vollformel ist in zwei gleich große Zeilen gegliedert.
- Der Originalsprechertext ist ohne Umformulierung fachlich zwischen beiden
  Szenen getrennt; die Viewer-Reihenfolge führt `slide_058` direkt nach
  `slide_055`.
- Die Animation baut erst Problem, Methoden und Fokus auf und anschließend in
  der Rechenszene Falltrennung, beide Ersatzstrukturen, beide Teilformeln und
  das Ergebnis.

## Reichweite

- Primär: `project_rule`
- Sekundär: `qa_gap`

## Übertragbare Regel

Bei zusammengezogenen Fallunterscheidungs- oder Separationsfolgen müssen alle
fachlichen Zustände sichtbar erhalten bleiben. Reicht der Raum dafür nur mit
Kleinschrift oder konkurrierenden Hierarchien, wird die Herleitung verlustfrei
geteilt. Vollständigkeit ist kein Grund, alle Inhalte gleichzeitig auf einer
Szene zu zeigen.

## Aktualisierte Schubladen

- `tools/re4-creative-builders.js`
- `tools/re4-redesign-spec.js`
- `tools/generate-re4-full-slide-redesign.js`
- `tools/generate-re4-separation-formulas.py`
- `tools/re4-transparent-content.test.js`
- `tools/svg-rebuild-qa.js`
- `.agents/skills/redesign-reltest-slides/references/review-derived-design-rules.md`
- `rebuild-proposals/svg/RE4/slide_055/`
- `rebuild-proposals/svg/RE4/slide_058/`
- `analysis/viewer-notes/viewer-curation.json`
- `analysis/viewer-notes/spoken-text-overrides.json`

## Verifikation

- beide Endzustände in 1920×1080 und verkleinerter Vieweransicht visuell geprüft
- elf gerenderte Animationszustände auf kumulative, sprechertexttreue
  Leserichtung geprüft
- strenge SVG-, Design- und Layout-QA: 0 Fehler, 0 Warnungen
- RE4-Regressionstests: 5 von 5 bestanden
