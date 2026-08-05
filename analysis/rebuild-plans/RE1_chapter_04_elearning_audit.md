# RE1 Kapitel 4 - E-Learning-Audit

## Umfang und Ergebnis

- Kapitel: Statistische Maßzahlen & Zuverlässigkeitskennzahlen
- Lektion 1: Szenen 40 bis 44
- Lektion 2: Szenen 45 bis 49
- Referenzen: Quellfolien 42 bis 54 sowie die jeweils zugeordneten Sprechertexte
- Ergebnis: zehn vollständige 1920-x-1080-Lernszenen, davon drei zusammengeführte Quellsequenzen
- Inhalts-Crosscheck: 10 von 10 Szenen bestanden
- Browserbasierte Layout-QA: 0 Fehler; keine Warnung an den zehn vollständigen Szenen-SVGs

## Kapitelweite Erkenntnisse

### Was gut funktioniert

- Die Kapitelhandlung ist klar: erst Lageparameter verstehen und vergleichen, anschließend mittlere Zeitkennzahlen von probabilistischen Zuverlässigkeitsanforderungen trennen.
- Zusammengehörige Quellfolien wurden nicht als Wiederholungen reproduziert, sondern als sprechertextgeführte Zustände derselben Szene zusammengeführt.
- Echte Diagramme stammen aus Python und verwenden eine einheitliche Achsen-, Schrift- und Farbgestaltung.
- Formeln sind als lokale SVG-Assets eingebettet und bleiben bei Skalierung scharf.
- Jede Animation adressiert eine vollständige semantische Gruppe. Beschriftung und zugehörige Geometrie erscheinen gemeinsam.
- Der vollständige Endzustand jeder Szene ist auch ohne Animation verständlich.

### Behobene Schwächen im Produktionslauf

- Plotbeschriftungen der Vergleichsszene 44 wurden mit festen Abständen und Verbindungslinien vom Kurvenverlauf getrennt.
- Der MTTF-Plot wurde breiter angelegt, damit Ereignisse, Dichtekurve und MTTF-Marker bei kleiner Viewer-Darstellung lesbar bleiben.
- Die Formel zum Modalwert wurde erneut gerendert, damit das Ableitungszeichen korrekt und nicht als Ziffer erscheint.
- Der Robustheitsblock in Szene 42 wurde vergrößert, damit Text und Innenabstände vollständig innerhalb der Box liegen.
- Die Animationsreihenfolge in Szene 47 wurde an den tatsächlichen Sprechertext angepasst: zuerst MTBF, anschließend MTTFF.
- Der zentrale Szenenplan wurde aus den finalen Manifesten synchronisiert. Damit stimmen Trigger, Ziele und Reihenfolge mit der tatsächlichen Umsetzung überein.

## Szenenprüfung

### Szene 40 - Drei Lageparameter

- Quelle: Folie 42
- Stärke: Die drei Begriffe sind gleichrangig und in wenigen Sekunden erfassbar. Piktogramme unterstützen die Bedeutungen Schwerpunkt, Halbierung und Maximum, ohne Details der Folgeszenen vorwegzunehmen.
- Animation: Alle drei Lageparameter erscheinen als gemeinsame Gruppe zur entsprechenden Sprecherpassage.
- Prüfung: Keine Überladung, keine unnötige Unterüberschrift, keine Layoutbefunde.

### Szene 41 - Mittelwert

- Quellen: Folien 43 und 44
- Stärke: Formel, Massenpunktmodell, Schwerpunkt und Ausreißerverschiebung bilden eine durchgängige Erklärung auf einer gemeinsamen Achse.
- Animation: Formel, Datenpunkte, Schwerpunkt sowie Ausreißerwirkung folgen einzeln dem Sprechertext. Der Ausreißer erscheint zusammen mit dem verschobenen Mittelwert.
- Prüfung: Fachinhalt vollständig; Plot bleibt die dominante Erklärfläche.

### Szene 42 - Median

- Quellen: Folien 45 und 46
- Stärke: 50-Prozent-Zeitpunkt, zwei gleich große Flächenhälften und Robustheit werden als drei miteinander verbundene Aussagen erklärt.
- Animation: Formel zuerst, anschließend beide Flächenhälften gemeinsam mit Medianmarker, danach der Robustheitshinweis.
- Prüfung: Keine Trennung von Marker und Beschriftung; Boxabstände nach Korrektur sauber.

### Szene 43 - Modalwert

- Quellen: Folien 47 und 48
- Stärke: Die Szene reduziert auf die fachlich notwendige Verbindung aus Ableitungsbedingung und Maximum der Dichtefunktion.
- Animation: Formel und vollständiger Peakmarker sind zwei sprechertextgeführte Gruppen.
- Prüfung: Ableitungszeichen korrekt; keine zusätzlichen Karten oder konkurrierenden Aussagen.

### Szene 44 - Lageparameter im Vergleich

- Quelle: Folie 49
- Stärke: Alle drei Kennzahlen liegen auf derselben rechtsschiefen Verteilung. Dadurch ist die Reihenfolge unmittelbar vergleichbar.
- Animation: Kurve wird zuerst gezeichnet, danach erscheinen Modalwert, Median und Mittelwert jeweils mit Linie, Punkt und Label. Die Schlussfolgerung zum Median folgt zuletzt.
- Prüfung: Labels überdecken die Kurve nicht; `t_modal < t_Median < t_m` ist eindeutig.

### Szene 45 - Kennzahlenüberblick

- Quelle: Folie 50
- Stärke: Die Szene trennt mittlere Zeitkennzahlen klar von Anforderungen aus Wahrscheinlichkeit und Lebensdauer.
- Animation: MTTF/MTBF und ppm/Bq erscheinen in zwei fachlich geschlossenen Gruppen.
- Prüfung: Alle vier Kennzahlen sind enthalten; Bq und ppm werden nicht als Mittelwerte dargestellt.

### Szene 46 - MTTF

- Quelle: Folie 51
- Stärke: Definition, Erwartungswertformel, reale Ausfallbeobachtungen, Dichtefunktion und Mittelwertmarker stehen in einer gemeinsamen visuellen Erklärung.
- Animation: Beobachtungen, Formel, Dichtekurve, MTTF-Marker und 50-Prozent-Einordnung folgen der Sprecherreihenfolge.
- Prüfung: MTTF bleibt klar auf nicht reparierbare Einheiten begrenzt; Formel und Plot sind bei Viewer-Skalierung lesbar.

### Szene 47 - MTTFF und MTBF

- Quelle: Folie 52
- Stärke: Eine einzige Zeitachse erklärt beide Kennzahlen. Natürlich ungleiche Ausfallabstände vermeiden eine künstliche Regelmäßigkeit.
- Animation: MTBF-Intervalle erscheinen entsprechend der ersten Sprecherpassage vor dem MTTFF-Intervall; Einschränkung und bessere Alternative folgen danach.
- Prüfung: Reine Ereigniszeitachse ist bewusst SVG-nativ; Intervalle und Labels sind gekoppelt und überschneiden sich nicht.

### Szene 48 - Parts per Million

- Quelle: Folie 53
- Stärke: Prozent, Promille und ppm werden als dieselbe Anteilslogik mit unterschiedlichen Skalen dargestellt. Die notwendige Kopplung an eine Lebensdauer ist deutlich abgesetzt.
- Animation: Vergleichsskala, Lebensdauerbezug und Übergang zu Bq bilden drei semantische Schritte.
- Prüfung: Zeichen und Größenordnungen sind korrekt; keine dichte Tabelle erforderlich.

### Szene 49 - Bq-Lebensdauer

- Quelle: Folie 54
- Stärke: B5, B10, B20 und B50 werden an einer gemeinsamen Verteilung abgelesen. Das Beispiel `B5 = 100.000 km` wird direkt mit 5 Prozent ausgefallen und 95 Prozent intakt verbunden.
- Animation: Kurve, q-Definition, B5-Beispiel, weitere Marker und Anforderungsnutzen folgen der gesprochenen Erklärung.
- Prüfung: q bezeichnet die Ausfallwahrscheinlichkeit und nicht die Zuverlässigkeit; alle Marker erscheinen mit Hilfslinien und Labels.

## QA-Nachweis

- `node tools/svg-rebuild-qa.js RE1 --viewer --slides 40-49 --expect-all --no-design --layout --report-dir analysis/qa-reports/RE1/chapter-04/final`
  - Ergebnis: 0 Fehler
  - Die vollständigen Szenen 40 bis 49 haben keine Layoutwarnungen.
  - Warnungen zu lokalen Plot- und Formelassets betreffen deren absichtlich zugeschnittene ViewBox sowie heuristische Erkennung mathematischer Glyphen. Im eingebetteten Szenenrender sind diese Befunde visuell unauffällig.
- `node tools/crosscheck-full-slide-redesign.js --requirements analysis/rebuild-plans/RE1_redesign_content_requirements_040-049.json --scene-plan analysis/rebuild-plans/RE1_scene-plan.json --output-root rebuild-proposals/svg/RE1 --output analysis/qa-reports/RE1/chapter-04/content-crosscheck.json`
  - Ergebnis: bestanden, 10 von 10 Szenen
- Syntaxprüfung der Generator-, Render- und Synchronisationswerkzeuge: bestanden
- Python-Kompilierung der neuen Plotgeneratoren und des Formelrenderers: bestanden

## Review-Runde 01

### Vorgehen

- Jede Szene wurde einzeln neu geladen, gegen Quell-SVG, Sprechertext und Review-Notiz geprüft, korrigiert, gerendert und erst nach eigenem Layout-QA abgeschlossen.
- Die vorherige Fassung und die zugehörige Notiz wurden beim Abschluss im Viewer-Verlauf archiviert.
- Szenen 43 und 44 waren als final markiert und wurden ohne Inhaltsänderung separat visuell und technisch verifiziert.

### Eingearbeitete Korrekturen

- Szene 40: Wiederholenden Abschlusssatz entfernt und die drei Lageparameter als ruhig ausbalancierte Einheit gesetzt.
- Szene 41: Mittelwertdarstellung vollständig als Vorher-/Nachher-Vergleich auf derselben Achse neu aufgebaut; Ausreißer und verschobener Schwerpunkt sind unmittelbar vergleichbar.
- Szene 42: Redundante Formelbeschreibung entfernt, Medianlabel konfliktfrei von der Markerlinie abgesetzt und die rechte `50 %`-Beschriftung mit mehr Abstand zum Plotrand weiter nach links gerückt.
- Szene 45: Erfundenen Prozesscharakter entfernt; MTTF, MTBF, ppm und Bq-Lebensdauer stehen als gleichrangige Vorschau in einer quellenahen Liste.
- Szene 46: Den redundanten Text unter der Erwartungswertformel entfernt. Die Ausfallzeitpunkte verwenden ein eigens generiertes transparentes PNG eines sichtbar beschädigten technischen Systems; die Dichtefunktion bleibt die dominante Python-Grafik.
- Szene 47: Dasselbe generierte PNG-Piktogramm wiederverwendet; senkrechte Ereignislinien bilden weiterhin die exakten Grenzen der MTTFF- und MTBF-Zeiträume.
- Szene 48: Vergleich als festes Drei-Spalten-Raster reduziert. Jede Zeile zeigt nur noch Kennzahl, konkrete Angabe und das entsprechende Verhältnis; redundante Potenz-Badges und separate Nennerangaben entfallen.
- Szene 49: Bq-Stützstellen source-nah auf einer Geraden dargestellt. `B5 = 100.000 km`, `5 % ausgefallen` und `95 % intakt` liegen gemeinsam in einer Ergebniszone unterhalb der Achse.

### Verifikation

- Pflichtinhalts-Crosscheck nach der Review-Runde: 10 von 10 Szenen bestanden.
- Einzel-QA für jede geänderte Szene: 0 Fehler; keine Befunde am jeweiligen vollständigen Szenen-SVG.
- Offene Review-Notizen für Szenen 40 bis 42 und 45 bis 49 wurden nach erfolgreicher Prüfung auf `open` ohne Notiz zurückgesetzt; die Vorversionen sind archiviert.

## Offene Beobachtung

Die Asset-Warnungen des Layout-Gates sind für eingebettete mathematische und wissenschaftliche Teil-SVGs aktuell zu grob. Eine spätere QA-Verbesserung kann zwischen vollständigen Szenen und absichtlich zugeschnittenen Teilassets unterscheiden. Für die visuelle Freigabe dieses Kapitels entsteht daraus kein offener Folienbefund.

## Feedbackrunde 2026-08-04

- Szenen 41 bis 44: Lageparameterdarstellungen entzerrt, Median-/Modalwert-Beschriftungen konfliktfrei gesetzt, Dichtekurve bis auf null geführt und mathematische Achsenlabels gegen gesperrt wirkende Buchstaben ersetzt.
- Szene 46: Integralgrenzen typografisch ober- und unterhalb des Integralzeichens gesetzt; MTTF/TTF-Markierung im Plot nach links versetzt.
- Szene 49: `5 % ausgefallen` und `95 % intakt` tiefer und mit sicherem Abstand zur Achse platziert.
- Verifikation: vollständige Szenen im Laufzeit- und strengen Layout-Gate ohne Fehler; visuelle Endzustände separat geprüft.
