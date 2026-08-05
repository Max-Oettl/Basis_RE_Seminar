# RE1 Kapitel 5 - E-Learning-Audit Lektion 3 und 4

## Prüfrahmen

- Ziel-Szenen: 56 bis 70
- Themen: Weibullverteilung und Lognormalverteilung
- Quellen: PowerPoint-SVGs 71 bis 89 mit zugeordnetem Sprechertext
- Prüffolge: Quellenabgleich, Sprechertextabgleich, Informationshierarchie, Animationslogik, statisches Rendering, Inhalts-Crosscheck und browserbasierte SVG-Layout-QA
- Ergebnis: 15 von 15 Szenen bestehen den Inhalts-Crosscheck; alle Ziel-SVGs bestehen die technische QA ohne Fehler.

## Einzelaudit

| Szene | E-Learning-Bewertung | Animationsprüfung | Ergebnis |
| --- | --- | --- | --- |
| 56 | Die Kurvenfamilie ist das dominante Lernobjekt. `T`, `b`, Spezialfälle und Anwendungen sind als kompakte Deutungsebenen angeordnet. | Erst Kurvenfamilie, dann Parameteranker und Anwendungen. Keine isolierten Textfragmente. | Freigegeben |
| 57 | Ein einziger Ausfallratenplot vermittelt die drei Fälle deutlich ruhiger als mehrere konkurrierende Diagramme. | Jede Kurve erscheint gemeinsam mit ihrem Label; Achsen bleiben als Orientierung stabil. | Freigegeben |
| 58 | Die drei Weibull-Fälle werden eindeutig den Bereichen der Badewannenkurve zugeordnet. Wiederholte Mini-Badewannen wurden vermieden. | Badewannenkurve zuerst, danach die drei vollständigen Zuordnungskarten in Leserichtung. | Freigegeben |
| 59 | Der gemeinsame Punkt bei `F(T) = 63,2 %` ist der visuelle Fokus; Lage- und Formwirkung bleiben unterscheidbar. | Kurven, Schnittpunkt, Hilfslinien und Bedeutung werden als sinnvolle Gruppen aufgebaut. | Freigegeben |
| 60 | Die vier Zuverlässigkeitsfunktionen stehen in einer ruhigen, vergleichbaren Formelmatrix. | Parameter vor Formeln; jede Formel erscheint als vollständige Zeile mit Bezeichnung. | Freigegeben |
| 61 | Die Herleitung reduziert die Rechnung auf die didaktisch notwendigen Schritte und koppelt `F(T)` direkt an `R(T)`. | Rechenschritte nacheinander, Ergebnis und Gegenwahrscheinlichkeit zuletzt. | Freigegeben |
| 62 | Die Quellen 77 und 78 sind zu einer nachvollziehbaren Transformation von zwei auf drei Parameter zusammengeführt. | Ausgangsmodell, `t₀`, Ersetzungsregel und neue Formeln erscheinen nacheinander. | Freigegeben |
| 63 | Vorher- und Nachherzustand liegen auf demselben Koordinatensystem; die Rechtsverschiebung ist dadurch unmittelbar erkennbar. | Die Kurve bewegt sich sichtbar nach rechts; `t₀` und unveränderte Wahrscheinlichkeitsanteile folgen danach. | Freigegeben |
| 64 | Das Weibull-Wahrscheinlichkeitspapier bleibt technischer Arbeitsplot und wird nicht durch dekorative Erklärboxen überlagert. | Achsen, Gerade, Parallelverschiebung und `b`-Ablesung folgen dem gesprochenen Vorgehen. | Freigegeben |
| 65 | Das Getriebe dient als stabiler Produktanker; der CDF-Plot bleibt dominant und zeigt den S-Verlauf auf normalen Achsen. | Produktkontext, Daten/Parameter, Kurve und Skalierung werden in dieser Reihenfolge erklärt. | Freigegeben |
| 66 | Derselbe Datensatz wird im Weibullnetz als Gerade gezeigt. Bildanker und Plot bleiben klar getrennt. | Datenpunkte vor Fit-Gerade; die Vergleichsnotiz erscheint erst nach der Transformation. | Freigegeben |
| 67 | Die drei Ausfallmechanismen sind als ein zusammenhängender Verlauf mit Steigungswechseln dargestellt. Der Knick wird korrekt als Warnsignal interpretiert. | Mechanismen erscheinen abschnittsweise; Trennempfehlung und Warnung folgen erst nach dem vollständigen Verlauf. | Freigegeben |
| 68 | Die Transformation `Y = ln(X)` erklärt die Rechtsschiefe, ohne die Folie in Theorieblöcke zu zerlegen. | Transformation, Kurvenfamilie, Parameter und Anwendungen werden kontextgebunden aufgebaut. | Freigegeben |
| 69 | Die Eignungsgrenze wird über den Hazard-Verlauf erklärt; Maximum und anschließender Abfall sind der visuelle Beweis. | Funktionsfamilie zuerst, dann Hazard-Maximum und abschließende Eignungsgrenze. | Freigegeben |
| 70 | Die Formelmatrix schließt die Lektion konsistent ab; der Median ist als eigener Erkenntnisanker hervorgehoben. | Bewusst nur drei Gruppen: Parameter, vollständiges Formelsystem, Median. Eine stärkere Zerstückelung wäre didaktisch unruhig. | Freigegeben |

## Übergreifende Erkenntnisse

- Technische Verteilungen werden am klarsten über einen dominanten Plot und wenige, sprechertextgebundene Deutungsanker vermittelt.
- Kurve, Marker, Hilfslinie und Beschriftung müssen dieselbe Animationsgruppe bilden.
- Zusammengeführte Quellfolien brauchen eine sichtbare Transformationslogik; bloßes Nebeneinanderstellen reicht nicht.
- Wiederkehrende Produktbilder sind nützlich, wenn sie Kontext geben, aber der Plot visuell dominant bleibt.
- Für kleine Bildfelder werden verlustarme Anzeigeableitungen verwendet, damit eigenständige Content-SVGs browser- und PowerPoint-tauglich bleiben.
- Formelfolien dürfen weniger Animationsschritte haben, wenn der Sprechertext ein Formelsystem als zusammenhängenden Block behandelt.

## QA-Nachweis

- Inhalts-Crosscheck: `15/15 scenes passed`
- Szenenplan: `0 Errors`; bestehende Warnungen betreffen offene Animationsentscheidungen außerhalb der Szenen 56 bis 70
- SVG-QA: alle Szenen 56 bis 70 mit `0 error(s)`
- Folie 66: isolierter browserbasierter Layout-Check nach Bildoptimierung ohne `layout_browser_render`-Befund
- Statische Renderings: `analysis/render-checks/RE1/chapter-05/lessons-03-04-round-01` bis `lessons-03-04-round-05`

## Feedbackrunde 2026-08-04

- Szenen 59 bis 62: Icons reduziert, Fließtextgrößen und Formelhöhen vereinheitlicht sowie Gleichungen in konsistente Zeilen und Spalten ausgerichtet.
- Szene 63: Drei-Parameter-Weibullkurve beginnt erst bei `t₀`; die Animation zeichnet die Kurve ohne unlogisches Hereinschieben. Alle fünf Zustände wurden separat gerendert und geprüft.
- Szene 64: Folie auf einen dominanten Wahrscheinlichkeitsplot und eine kompakte dreistufige Leselogik reduziert.
- Szenen 67 bis 69: Mechanismen mit Doppelpunkten bezeichnet, Knick als Warnsignal visualisiert, Anwendungsicons entfernt und die Lognormal-Eignung wieder um Dichte- und Funktionskontext ergänzt.
- Szene 70: vollständige Formelmatrix neu vereinheitlicht; Median als ruhiger Ergebnisanker `Median = e^μ` gesetzt.
- Verifikation: Laufzeit-/Manifest-QA für das Gesamtmodul `0` Fehler; strenge Layout-QA der betroffenen vollständigen Szenen `0` Fehler/`0` Warnungen.
