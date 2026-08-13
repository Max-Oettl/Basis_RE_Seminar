# RE1 Kapitel 5 - Lektion 1 und 2: E-Learning-Audit

## Umfang

- Kapitel: 5 - Lebensdauerverteilungen
- Lektion 1: Szenen 50 bis 52 - Normalverteilung
- Lektion 2: Szenen 53 bis 55 - Exponentialverteilung
- Ausgabemodus: `full_slide`
- Produktionsformat: 1920 x 1080 SVG mit RelTest-Academy-BrandFrame
- Planungsgrundlage: `analysis/rebuild-plans/RE1_chapter_05_lessons_01-02_redesign_plan.md`

## Szenenentscheidungen

### Szene 50 - Die Normalverteilung

- Quelle: PowerPoint-SVG 55 und zugehöriger Sprechertext.
- Lernziel: Lage- und Streuparameter an einer dominanten Dichtefunktion unterscheiden.
- Übertragen: Dichtefunktion, Erwartungswert, Standardabweichung, Glockenform, Symmetrie, 50-Prozent-Lage sowie die drei Anwendungsfelder.
- Gestaltung: Großer Python-Plot mit konsistenter Kurvenfamilie; kompakte Parameteranker und eine zurückhaltende Anwendungsliste.
- Animation: Kurven zeichnen, Lageparameter markieren, Parameterbedeutungen zeigen, Symmetrie erklären, Anwendungen gemeinsam einblenden.
- Visueller Endcheck: bestanden; keine Überlappung oder abgeschnittener Text.

### Szene 51 - Normalverteilung in der Zuverlässigkeitstechnik

- Quellen: PowerPoint-SVGs 56 bis 61 als zusammengeführte Aufbaufolge.
- Lernziel: Die fachliche Eignungsgrenze der Normalverteilung aus Ausfallrate und Ausfallwahrscheinlichkeit herleiten.
- Übertragen: Steigende Ausfallrate, Zuordnung zu Bereich 3, Verschleiß- und Ermüdungsausfälle, fehlende Früh- und Zufallsausfälle, Ausfallwahrscheinlichkeit, negative Ausfallzeiten und Problem bei `t = 0`.
- Gestaltung: Zwei gleichrangige Python-Plots; darunter Badewannenbereich und Eignungsgrenze als Schlussfolgerungen.
- Animation: Ausfallrate, Bereich 3, Ausfallwahrscheinlichkeit, Nullzeitproblem und Eignungsgrenze in Sprechertextreihenfolge.
- Visueller Endcheck: bestanden; Plot und Schlussfolgerungszonen bleiben getrennt.

### Szene 52 - Formeln der Normalverteilung

- Quelle: PowerPoint-SVG 62 und zugehöriger Sprechertext.
- Lernziel: Abhängigkeit aller Zuverlässigkeitsfunktionen von der komplexen Normaldichte erkennen.
- Übertragen: Parameterband sowie Formeln für `f(t)`, `F(t)`, `R(t)` und `λ(t)`.
- Gestaltung: Ruhige vierzeilige Formelmatrix; Formeln als separat erzeugte Mathtext-SVGs.
- Animation: Parameter und anschließend jede Formelzeile in fachlicher Ableitungsreihenfolge; Schlussfolgerung zuletzt.
- Visueller Endcheck: bestanden; Formeln sind groß, ausgerichtet und frei von fragiler Unicode-Ersatznotation.

### Szene 53 - Die Exponentialverteilung

- Quelle: PowerPoint-SVG 63 und zugehöriger Sprechertext.
- Lernziel: Rechtsschiefe Verteilungsform und Wirkung des einzigen Parameters `λ` verstehen.
- Übertragen: Dichtefunktion, Rechtsschiefe, Parameterwirkung, zufällige Ereignisse und Anwendungsfelder.
- Gestaltung: Dominanter Python-Plot parallel zu Szene 50; kompakte Parameter- und Anwendungselemente.
- Animation: Kurven zeichnen, Form erklären, Parameterwirkung zeigen, Zufallsereignisse und Anwendungen einblenden.
- Visueller Endcheck: bestanden; zweizeiliger Zuverlässigkeitstext bleibt vollständig in seiner Box.

### Szene 54 - Exponentialverteilung in der Zuverlässigkeitstechnik

- Quellen: PowerPoint-SVGs 64 bis 69 als zusammengeführte Aufbaufolge.
- Lernziel: Konstante Ausfallrate als Modell für Zufallsausfälle und positive Lebensdauer einordnen.
- Übertragen: Konstante Ausfallrate, Bereich 2, Zufallsausfälle, Ausschluss von Früh- und Ermüdungsausfällen, Verlauf von `F(t)`, Nullstart und Wirkung von `λ`.
- Gestaltung: Zwei gleichrangige Python-Plots mit derselben Farbsemantik wie Szene 53; darunter Badewannenbereich und Eignung.
- Animation: Ausfallrate, Bereich 2, Ausfallwahrscheinlichkeit, Nullstart und Parameterwirkung in Sprechertextreihenfolge.
- Visueller Endcheck: bestanden; direkte Kurvenlabels ersetzen eine kollisionsanfällige Legende.

### Szene 55 - Formeln der Exponentialverteilung

- Quelle: PowerPoint-SVG 70 und zugehöriger Sprechertext.
- Lernziel: Die einfache mathematische Struktur der Exponentialverteilung erkennen.
- Übertragen: `f(t)`, `F(t)`, `R(t)`, `λ(t)`, Quotientenbeziehung und Kehrwert des Mittelwertes.
- Gestaltung: Formelmatrix parallel zu Szene 52; vier separat erzeugte Mathtext-SVGs.
- Animation: Parameter und Formeln zeilenweise; abschließende Eignung für zufälliges Ausfallverhalten zuletzt.
- Visueller Endcheck: bestanden; alle Formeln und Exponenten sind sauber lesbar.

## Sequenzqualität

- Die beiden Lektionen verwenden bewusst denselben Dreischritt: Verteilung kennenlernen, Zuverlässigkeitseignung bewerten, Formeln ordnen.
- Normal- und Exponentialverteilung besitzen dadurch vergleichbare Layouts, Farbzuordnungen und Animationslogik.
- Dichte, Ausfallrate und Ausfallwahrscheinlichkeit stammen vollständig aus Python.
- Formeln stammen vollständig aus dem gemeinsamen Formelrenderer.
- Mehrere PowerPoint-Zwischenstände wurden nur dort zusammengeführt, wo sie eine echte Aufbaufolge derselben fachlichen Darstellung bilden.

## Crosscheck und QA

- Pflichtinhalts-Crosscheck:
  - Befehl: `node tools/crosscheck-full-slide-redesign.js --requirements analysis/rebuild-plans/RE1_redesign_content_requirements_050-055.json --scene-plan analysis/rebuild-plans/RE1_scene-plan.json --output-root rebuild-proposals/svg/RE1 --output analysis/reports/crosschecks/RE1_chapter_05_lessons_01-02_full_slide_redesign.json`
  - Ergebnis: bestanden, 6 von 6 Szenen.
- Folienweises SVG- und Browser-Layout-QA:
  - Szenen 50 bis 55 jeweils separat mit `--viewer --slides <n> --expect-all --no-design --layout`.
  - Ergebnis je Szene: 0 Fehler und kein Befund am vollständigen Szenen-SVG.
- Der Content-SVG-spezifische `--strict-design`-Modus ist für diese ausdrücklich als `full_slide` produzierten Folien nicht anwendbar. Er beanstandet BrandFrame, Titel und Footer erwartungsgemäß als Content-SVG-Verstöße.
- Verbleibende Warnungen stammen aus der heuristischen Einzelprüfung zugeschnittener Plot- und Formelassets oder aus älteren Moduldateien. Die eingebetteten vollständigen Szenen sind davon nicht betroffen.
- Die Animationspläne der Szenen 50 bis 55 wurden in den zentralen `RE1_scene-plan.json` synchronisiert. Die Planvalidierung endet mit 0 Fehlern; ihre 43 Warnungen betreffen ausschließlich noch nicht bearbeitete Szenen außerhalb dieses Umfangs.
- JavaScript-, JSON- und Python-Syntaxprüfungen: bestanden.

## Feedbackrunde 2026-08-04

- Szenen 50, 53 und 56: dekorative Anwendungsicons entfernt und durch ruhige Textzeilen ersetzt; in Szene 50 Mittelwertlabel und Achsenbeschriftung bereinigt.
- Szenen 52, 54 und 55: Formelausrichtung vereinheitlicht, Integralgrenzen korrekt gesetzt und Kurven-/Parameterlabels aus den Plotflächen herausgeschoben.
- Verifikation: Laufzeit-/Manifest-QA und strenge Layout-QA der vollständigen Szenen ohne Fehler.

## Feedbackrunde 2026-08-06: konsistenter Formelsatz

- Szenen: 52 und 55; übertragbar auf alle Formelmatrizen.
- Nutzerbeobachtung: Die Ausfallwahrscheinlichkeit erschien fett, Integralgrenzen standen zu weit vom Integral entfernt, und gleichrangige Formeln wirkten durch stark unterschiedliche Abstände und Größen uneinheitlich.
- Reproduzierte Ursache: Szene 52 setzte das Integral manuell aus mehreren SVG-Textobjekten zusammen. Die übrigen Mathtext-Assets blieben fontabhängige `<text>/<tspan>`-Elemente und wurden jeweils auf dieselbe Boxhöhe skaliert; einfache Formeln wurden dadurch stärker vergrößert als hohe Bruch- oder Integralformeln.
- Lokale Korrektur: `F(t)` in Szene 52 verwendet nun dasselbe zusammenhängende Formelasset wie die anderen Zeilen. Die Formelassets wurden mit STIX als Pfadgeometrie neu erzeugt und anhand ihrer nominalen Grundschrift statt ihrer individuellen Bounding-Box-Höhe eingebettet.
- Reichweite: `domain_rule` und `qa_gap`.
- Übertragbare Regel: Gleichrangige Formeln besitzen eine gemeinsame nominale Grundschrift; komplexe Notation bleibt ein einzelnes Pfad-SVG und wird nicht aus Textobjekten gebaut oder boxbezogen gestreckt.
- Aktualisierte Schubladen: `components/formula-library`, `workflow/32-formulas/formula-workflow.md`, Redesign-Reviewregeln und statisches SVG-QA.
- Verifikation: neue 1920x1080-Previews unter `analysis/render-checks/RE1/feedback-2026-08-06-formula-v2/`; Szenen 52 und 55 visuell ohne abweichende Fettung oder lose Integralgrenzen. Viewer-/Layout-QA: 0 Fehler; verbleibende Warnungen betreffen unter anderem die erwartungsgemäß nicht-16:9 zugeschnittenen Einzelassets.
