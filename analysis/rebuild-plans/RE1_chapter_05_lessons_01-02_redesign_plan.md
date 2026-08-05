# RE1 Kapitel 5 - Redesignplan Lektion 1 und 2

## Umfang

- Ausgabemodus: `module_redesign` mit sechs `full_slide`-Zielszenen
- Ziel: `slide_050` bis `slide_055`
- Lektion 1: Normalverteilung, Zielszenen 50 bis 52
- Lektion 2: Exponentialverteilung, Zielszenen 53 bis 55
- Quellen: PowerPoint-SVGs 55 bis 70 und die gemappten Sprechertexte aus den Dokumenten 11 und 12
- Zusammengezogene Zustände: Zielszene 51 aus Quellen 56 bis 61; Zielszene 54 aus Quellen 64 bis 69

## Sequenzentscheidung

Die beiden Lektionen verwenden dieselbe didaktische Dreierstruktur:

1. Form, Parameter und typische Anwendung der Verteilung
2. Zuverlässigkeitstechnische Eignung anhand von Ausfallrate und Ausfallwahrscheinlichkeit
3. Mathematische Beziehungen der vier Zuverlässigkeitsfunktionen

Normal- und Exponentialverteilung werden bewusst parallel aufgebaut. Dadurch kann der Lernende die Modelle vergleichen, ohne auf jeder Folie eine zusätzliche Vergleichstabelle lesen zu müssen.

## Szene 50 - Die Normalverteilung

- Referenz: Quell-SVG 55
- Muss erhalten bleiben: Dichtefunktion; Parameter `mu` und `sigma`; kleine Streuung ergibt schmale, hohe Kurve; symmetrische Glockenform; theoretisch unbegrenzte Ausdehnung; Erwartungswert, Median und Modalwert fallen zusammen; typische Anwendungen außerhalb der Zuverlässigkeitstechnik.
- Lernbotschaft: `mu` legt die Lage fest, `sigma` die Streuung der symmetrischen Glockenkurve.
- Archetyp: dominanter Python-Dichteplot mit kompakten Parameter- und Anwendungshinweisen.
- Animation: Kurvenfamilie; Lageparameter; Streuungsparameter; Symmetrieeigenschaften; Anwendungsfelder. Kurven und ihre Legende erscheinen gemeinsam.

## Szene 51 - Eignung der Normalverteilung

- Referenzen: Quell-SVGs 56 bis 61
- Muss erhalten bleiben: Dichte-, Ausfallraten-, Ausfallwahrscheinlichkeits- und Überlebenssicht als gemeinsame Funktionsfamilie; kontinuierlich steigende Ausfallrate; Zuordnung zu Bereich 3 der Badewannenkurve; nur Verschleiß- und Ermüdungsausfälle; bei großer Streuung bereits `F(0) > 0`; mögliche negative Ausfallzeiten; eingeschränkte Eignung für Lebensdauerdaten.
- Lernbotschaft: Die Normalverteilung beschreibt Verschleiß, kann aber wegen negativer Ausfallzeiten für Lebensdauerprognosen ungeeignet sein.
- Archetyp: zwei große Python-Plots statt dauerhaft sichtbarer Vierfachmatrix: Ausfallrate mit Bereich-3-Zuordnung und Ausfallwahrscheinlichkeit mit `t = 0`-Grenze.
- Animation: steigende Ausfallrate; Bereich 3; Ausfallwahrscheinlichkeit; Problemstelle bei `t = 0`; Schlussfolgerung. Die Dichtefunktion ist aus Szene 50 bekannt, `R(t)` bleibt als Gegenfunktion in der späteren Formelübersicht vollständig erhalten.

## Szene 52 - Formeln der Normalverteilung

- Referenz: Quell-SVG 62
- Muss erhalten bleiben: Dichtefunktion; Ausfallwahrscheinlichkeit als Integral; Überlebenswahrscheinlichkeit als Gegenwahrscheinlichkeit beziehungsweise Integral; Ausfallrate als Quotient; Parameterdefinitionen für `t`, `mu` und `sigma`; mathematische Komplexität.
- Lernbotschaft: Alle Zuverlässigkeitsfunktionen bauen auf der vergleichsweise komplexen Normaldichte auf.
- Archetyp: ruhige Formelmatrix mit kontrolliert gerenderten Mathtext-SVGs.
- Animation: Parameter; Dichtefunktion; Ausfallwahrscheinlichkeit; Überlebenswahrscheinlichkeit; Ausfallrate; Schlussfolgerung.

## Szene 53 - Die Exponentialverteilung

- Referenz: Quell-SVG 63
- Muss erhalten bleiben: rechtsschiefe Dichte; nur ein Parameter `lambda`; größerer Parameter ergibt höheren Startwert und steileren Abfall; Modellierung zufälliger Ereignisse; typische Anwendungen einschließlich Zuverlässigkeitstechnik.
- Lernbotschaft: `lambda` steuert allein Startwert und Abfall der rechtsschiefen Dichte.
- Archetyp: dominanter Python-Dichteplot mit einem Parameterblock und wenigen Anwendungsankern.
- Animation: Kurvenfamilie; Parameterwirkung; Zufallsereignisse und Anwendungen.

## Szene 54 - Eignung der Exponentialverteilung

- Referenzen: Quell-SVGs 64 bis 69
- Muss erhalten bleiben: konstante Ausfallrate; Zuordnung zu Bereich 2 der Badewannenkurve; nur Zufallsausfälle; weder Früh- noch Ermüdungsausfälle; Ausfallwahrscheinlichkeit ausschließlich im positiven Zeitbereich; `F(0) = 0`; Grenzwert 100 Prozent; größerer Parameter ergibt steileren Anstieg.
- Lernbotschaft: Die Exponentialverteilung ist das Modell für eine konstante Ausfallrate und damit für Zufallsausfälle.
- Archetyp: zwei große Python-Plots mit paralleler Geometrie zur Normalverteilungsfolie.
- Animation: konstante Ausfallrate; Bereich 2; Ausfallwahrscheinlichkeit; Startwert und Parameterwirkung; Schlussfolgerung.

## Szene 55 - Formeln der Exponentialverteilung

- Referenz: Quell-SVG 70
- Muss erhalten bleiben: Dichtefunktion; Ausfallwahrscheinlichkeit; Überlebenswahrscheinlichkeit; konstante Ausfallrate; `lambda = 1 / t_m`; Parameterdefinitionen; einfache mathematische Beziehungen; Eignung für Zufallsausfälle.
- Lernbotschaft: Mit nur einem Parameter bleiben alle Zuverlässigkeitsfunktionen der Exponentialverteilung überschaubar.
- Archetyp: Formelmatrix im gleichen Raster wie Szene 52.
- Animation: Parameter; Dichtefunktion; Ausfallwahrscheinlichkeit; Überlebenswahrscheinlichkeit; Ausfallrate; Anwendungsfolgerung.

## Produktions- Und QA-Schwerpunkte

- Alle echten Plots werden als folienlokale SVGs aus einem registrierten Python-Generator erzeugt.
- Normal- und Exponentialplots verwenden konsistente Farben für die drei Parameterwerte und ausreichend große Achsen- und Legendentexte.
- Nicht-triviale Formeln werden als folienlokale Mathtext-SVGs erzeugt und nicht mit `tspan` nachgebaut.
- Kein PowerPoint-Lautsprecher, kein Fremdlogo und keine Quell-Masterelemente werden übernommen.
- Jede Szene wird einzeln gerendert, gegen alle zugeordneten Quellen crossgecheckt und danach mit Strict-Design- und Layout-QA geprüft.
