# RE1 Kapitel 5 - Redesignplan Lektion 3 und 4

## Umfang und Modus

- Kapitel: 5 - Lebensdauerverteilungen
- Lektion 3: Ziel-Szenen 56 bis 67 - Weibullverteilung
- Lektion 4: Ziel-Szenen 68 bis 70 - Lognormalverteilung
- Ausgabemodus: `full_slide`, 1920 x 1080
- Grundlage: PowerPoint-SVGs 71 bis 89 und die zugeordneten Sprechertexte
- Ziel: Inhalt vollständig erhalten, Quelllogik modernisieren und Aufbauzustände sprechertextgeführt zusammenführen.

## Kapitelweite Gestaltungslogik

- Diagramme werden als lokale Python-SVGs im jeweiligen Szenenordner erzeugt.
- Formeln werden als lokale Mathtext-SVGs im jeweiligen Szenenordner erzeugt.
- Weibull-Kurven verwenden durchgängig dieselbe Semantik:
  - Grün: `b < 1`, sinkende Ausfallrate, Frühausfälle
  - Cyan: `b = 1`, konstante Ausfallrate, Zufallsausfälle
  - Rot: `b > 1`, steigende Ausfallrate, Verschleiß- und Ermüdungsausfälle
- Die charakteristische Lebensdauer `T` wird durchgehend mit `F(T) = 63,2 %` und `R(T) = 36,8 %` gekoppelt.
- Kurve, Marker, Hilfslinie und Label bilden jeweils eine gemeinsame Animationsgruppe.
- Formelfolien verwenden dieselbe ruhige Matrix wie die vorausgehenden Verteilungslektionen.

## Szenenplan Lektion 3

### Szene 56 - Die Weibullverteilung

- Quelle: 71
- Archetyp: Dominanter Dichteplot mit zwei Parameterankern
- Sichtbar: `T`, `b`, flexible Kurvenformen, `b = 1` als Exponentialverteilung, `b ≈ 3,5` als normalähnliche Form sowie Anwendungen
- Animation: Kurvenfamilie, `T`, `b`, Spezialfälle, Anwendungen

### Szene 57 - Der Formparameter steuert die Ausfallrate

- Quelle: 72
- Archetyp: Dominanter Ausfallratenplot mit drei klaren Fallklassen
- Sichtbar: `b < 1` sinkend, `b = 1` konstant, `b > 1` steigend
- Animation: Achsen und anschließend jede vollständige Kurve mit Label

### Szene 58 - Ein Modell für alle drei Lebenszyklusbereiche

- Quelle: 73
- Archetyp: Plot-Badewannenkurven-Mapping
- Sichtbar: identische drei Fallklassen aus Szene 57 und eindeutige Zuordnung zu Früh-, Zufalls- und Verschleißausfällen
- Animation: Badewannenkurve, anschließend die drei Zuordnungen in Leserichtung, Schlussfolgerung

### Szene 59 - Die charakteristische Lebensdauer

- Quelle: 74
- Archetyp: Dominanter CDF-Plot mit gemeinsamem Schnittpunkt
- Sichtbar: mehrere `b`-Kurven, `T`, `63,2 %`, Lageparameterwirkung
- Animation: Kurven, gemeinsamer Schnittpunkt, Hilfslinien und Bedeutung

### Szene 60 - Formeln der zweiparametrigen Weibullverteilung

- Quelle: 75
- Archetyp: Formelmatrix
- Sichtbar: Parameter `t`, `T`, `b` sowie `f(t)`, `F(t)`, `R(t)`, `λ(t)`
- Animation: Parameter und Formelzeilen in Sprechertextreihenfolge

### Szene 61 - Warum bei T genau 63,2 Prozent ausfallen

- Quelle: 76
- Archetyp: Schrittweise Herleitung
- Sichtbar: Einsetzen von `t = T`, Vereinfachung bis `F(T) ≈ 0,632`, Gegenwahrscheinlichkeit `R(T) ≈ 0,368`
- Animation: Rechenschritte nacheinander, Ergebnis zuletzt

### Szene 62 - Von zwei zu drei Parametern

- Quellen: 77 und 78
- Archetyp: Transformationsvergleich
- Sichtbar: `T, b` → Ersetzungen `T - t₀`, `t - t₀` → `T, b, t₀`; aktualisierte Funktionsgleichungen
- Animation: Zweiparameter-Ausgang, `t₀` und Beispiel Bremsenverschleiß, Ersetzungsregel, angepasste Formeln

### Szene 63 - Die ausfallfreie Zeit verschiebt die Verteilung

- Quellen: 79 und 80
- Archetyp: Vorher-/Nachher-Plot auf derselben Achse
- Sichtbar: identische Kurve vor und nach Verschiebung, `t₀`, `T`, Flächenanteile 63,2 % und 36,8 %
- Animation: Ausgangskurve, sichtbare Rechtsverschiebung, `t₀`, unveränderte Wahrscheinlichkeitsanteile

### Szene 64 - Weibull-Wahrscheinlichkeitspapier

- Quellen: 81 und 82
- Archetyp: Technischer Arbeitsplot mit Parameterablesung
- Sichtbar: transformierte Achsen, Weibull-Gerade, Polverschiebung und Formparameterablesung
- Animation: Achsensystem, Gerade, Parallelverschiebung, Schnittpunkt und `b`

### Szene 65 - Getriebebeispiel auf normalen Achsen

- Quelle: 83
- Archetyp: Dominanter CDF-Plot mit Produktanker
- Sichtbar: 6-Gang-NKW-Getriebe, `b = 1,4`, normierte Lebensdauer und S-förmige Ausfallwahrscheinlichkeit
- Animation: Getriebe, Kurve und Parameter gemeinsam, normale Skalierung

### Szene 66 - Dieselben Daten im Weibullnetz

- Quelle: 84
- Archetyp: Transformierter Gerade-Plot
- Sichtbar: gleicher Datensatz, gleiche Punkte, transformierte Achsen und Gerade
- Animation: Achsensystem, Datenpunkte, Fit-Gerade, Vergleich zur S-Kurve

### Szene 67 - Ausfallmechanismen im Weibullnetz trennen

- Quelle: 85
- Archetyp: Mechanismenvergleich im technischen Plot
- Sichtbar: drei Steigungsbereiche, Zuordnung zu Badewannenkurve, schematischer Charakter und Pflicht zur getrennten Auswertung
- Animation: drei Mechanismen einzeln, Knick als Warnsignal, Trennung in separate Weibullverteilungen

## Szenenplan Lektion 4

### Szene 68 - Die Lognormalverteilung

- Quelle: 86
- Archetyp: Dominanter Dichteplot mit Transformationsanker
- Sichtbar: `Y = ln(X)` normalverteilt, `μ`, `σ`, Rechtsschiefe, multiplikative Zufallsprozesse und Anwendungen
- Animation: Transformation, Kurvenfamilie, Parameter, Anwendungen

### Szene 69 - Eignungsgrenze der Lognormalverteilung

- Quellen: 87 und 88
- Archetyp: Dominanter Ausfallratenplot mit ergänzenden Funktionsverläufen
- Sichtbar: flexible Funktionen, Hazard-Maximum und anschließender Abfall, unvollständige Beschreibung von Verschleiß- und Ermüdungsausfällen
- Animation: Funktionsfamilie, relevante Hazard-Kurve, Maximum und Eignungsgrenze

### Szene 70 - Formeln der Lognormalverteilung

- Quelle: 89
- Archetyp: Formelmatrix
- Sichtbar: Parameter, `f(t)`, `F(t)`, `R(t)`, `λ(t)` und `t_median = e^μ`
- Animation: Parameter, vier Formelzeilen und Medianunterschied

## Qualitätsfolge

Für jede Szene gilt: erzeugen, statisch rendern, visuell gegen jede Referenz prüfen, Inhalts-Crosscheck ausführen, browserbasiertes Layout-QA ausführen, Befunde beheben und erst dann die nächste Szene freigeben. Nach Abschluss werden die lokalen Animationsmanifeste in den zentralen Szenenplan synchronisiert.
