# RE4 Review-Audit · Brückenschaltungen

## Szene(n)

- `slide_048` · Voraussetzungen des booleschen Modells
- `slide_055` · Brückenschaltung durch Separation lösen

## Nutzerbeobachtung

Die Brückenschaltungen sind fachlich und visuell nicht ausreichend umgesetzt. In
der Vorschau ist die Schaltung zu klein; die wiederverwendete Geometrie bildet die
Brückentopologie nicht sauber ab.

## Reproduzierte Ursache

Die gemeinsame Funktion `bridgeDiagram()` setzte Komponente 5 als horizontalen
Block mit diagonalen Anschlüssen ein. Dadurch fehlte die kanonische vertikale
Kopplung zwischen dem oberen und unteren mittleren Knoten. Dieselbe Komponente
wurde in `slide_048` und `slide_055` verwendet. Zusätzlich wurde sie in
`slide_048` auf 72 Prozent skaliert und war in der 960×540-Vieweransicht nur noch
eine Miniatur. Die beiden separierten Ersatzstrukturen in `slide_055` waren zwar
rechnerisch gemeint, aber zu klein und geometrisch nicht konsistent zum
Ausgangsdiagramm.

## Lokale Korrektur

- Gemeinsame Fünf-Komponenten-Brücke vollständig neu aufgebaut:
  Komponenten 1/3 oben, 2/4 unten und Komponente 5 vertikal zwischen den beiden
  mittleren Knoten.
- `slide_048`: unteren Bereich zu einer großen, eigenständigen Brückenzone
  umgebaut; keine transformierte Miniatur mehr.
- `slide_055`: Ausgangsbrücke vergrößert; Schlüsselkomponente 5 als eigener
  Sprechertext-Fokus umgesetzt.
- Fall I als zwei Parallelsysteme in Reihe und Fall II als zwei Serienpfade
  parallel neu gezeichnet und vergrößert.
- Animationsfolge korrigiert: Ausgangsbrücke vor Methodenwahl und Fokus,
  anschließend Falltrennung, Fall I, Fall II und Gesamtergebnis.

## Reichweite

- Primär: `module_pattern`
- Sekundär: `domain_rule`

Die Geometrie betrifft alle Wiederverwendungen der kanonischen Brückenschaltung in
RE4. Die Topologieregel ist auch für spätere Module wiederverwendbar. Eine rein
deterministische SVG-QA kann fachlich falsche, aber syntaktisch valide
Schaltungstopologie nicht zuverlässig erkennen; deshalb bleibt der direkte
Quellen-Ziel-Vergleich verpflichtend.

## Übertragbare Regel

Die kanonische Fünf-Komponenten-Brücke darf nicht frei stilisiert werden:
Komponente 5 verbindet vertikal die beiden mittleren Knoten. Vorschau,
Ausgangsdiagramm und separierte Ersatzstrukturen verwenden dieselbe
Komponentensprache und müssen in der 960×540-Ansicht lesbar bleiben.

## Aktualisierte Schubladen

- `tools/generate-re4-full-slide-redesign.js`
- `tools/re4-redesign-spec.js`
- `.agents/skills/redesign-reltest-slides/references/review-derived-design-rules.md`
- Szenenbriefs, Animationsmanifeste und kritische Challenge-Berichte der beiden
  Szenen

## Verifikation

- Statische Zielrenders für `slide_048` und `slide_055` in 1920×1080 geprüft.
- Alle Animationszustände beider Szenen neu gerendert und in Kontaktbögen bei
  realistischer Viewergröße geprüft.
- Strict-Design-, Manifest- und gerenderte Layout-QA nach der letzten Änderung
  erneut ausgeführt.

## Folgefeedback · Proportionen

Die fachlich korrigierte Brücke war in beiden Hauptdarstellungen anschließend zu
breit aufgezogen. Die Leitungswege füllten nahezu die gesamte freie Kartenbreite
und ließen die Schaltung unnatürlich flach wirken.

Korrektur: Die wiederverwendete Brücke erhält eine kompakte Standardbreite. In
`slide_048` und `slide_055` wird sie schmaler zentriert; Blockgrößen,
Vertikalabstand und Lesbarkeit bleiben erhalten. Freier Kartenraum bleibt bewusst
als Weißraum stehen. Diese Proportionsregel gilt für weitere
Brückendarstellungen im Seminar.
