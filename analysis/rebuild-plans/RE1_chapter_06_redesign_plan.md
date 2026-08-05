# RE1 Kapitel 6 - Redesignplan

## Umfang und Modus

- Kapitel: 6 - Zusammenfassung
- Lektion 1: Ziel-Szenen 71 bis 77
- Quell-SVGs: Folien 90 bis 96
- Sprechertext: Abschnitte 1 bis 7 aus `15_Modul_Einfuehrung_ZUV - Zusammenfassung.docx`
- Ausgabemodus: `module_redesign` mit sieben `full_slide`-Szenen in 1920 x 1080
- Ziel: Die bereits vermittelten Kernaussagen wiederholen, ohne neue Erklärmodelle einzuführen. Bereits freigegebene Komponenten und Plots werden wiederverwendet, wenn Inhalt und Beziehungstopologie übereinstimmen.

## Wiederverwendungsgate

| Zielszene | Inhalt | Wiederverwendung | Begründung |
| --- | --- | --- | --- |
| 71 | Definition der Zuverlässigkeit | Szene 13: Definition mit fünf Piktogrammzeilen | Definition und Begriffsbestandteile sind identisch. |
| 72 | Qualitative und quantitative Methoden | Szene 15: zwei Werkzeugkästen | Aufgaben und typische Methoden stimmen mit dem Zusammenfassungstext überein. |
| 73 | Fünf Phasen des Zuverlässigkeitsmanagements | Szene 17: kanonische Phasenübersicht | Reihenfolge, Bezeichnungen und Methodenbezug müssen modulweit identisch bleiben. |
| 74 | Vier Zuverlässigkeitsfunktionen | neue kompakte Python-Zusammenfassung | Eine identische Vier-Funktionen-Übersicht existiert noch nicht. Bestehende Funktionsdefinitionen und Plotstil werden wiederverwendet. |
| 75 | Ausfallrate und Badewannenkurve | Szene 37: Formel, Plot und Dreizonenlogik | Definition, bedingtes Risiko und drei Bereiche werden inhaltlich wiederholt. |
| 76 | Weibullparameter | Szene 56: Dichteplot, T- und b-Logik | Plot und zwei Hauptparameter sind identisch; `t₀` wird als dritter Parameter aus Szene 62 ergänzt. |
| 77 | Weibull und Badewannenkurve | Szenen 37 und 67: Badewannenkurve plus segmentiertes Weibullnetz | Die Quelle zeigt nicht nur drei Hazard-Kurven, sondern die gekoppelte Lebenszyklus- und Weibullnetz-Zuordnung einschließlich Mechanismenwechsel. |

## Szenenplan

### Szene 71 - Definition der Zuverlässigkeit

- Quelle: 90
- Archetyp: Definition mit Piktogrammspur
- Muss-Inhalt: Wahrscheinlichkeit, Produkt, definierte Zeitdauer, Funktions- und Umgebungsbedingungen, kein Ausfall
- Animation: Die Definition erscheint als vollständige Einheit. Eine Zeilenzerlegung würde den Satz künstlich fragmentieren.

### Szene 72 - Zwei Arten von Zuverlässigkeitsmethoden

- Quelle: 91
- Archetyp: Vergleich zweier Werkzeugkästen
- Muss-Inhalt qualitativ: kritische Ausfallmechanismen identifizieren, Zuverlässigkeit verbessern, FMEA, HALT
- Muss-Inhalt quantitativ: Lebensdauermodelle bestimmen, Zuverlässigkeit nachweisen, End-of-Life-Test, ALT
- Animation: qualitative und quantitative Seite jeweils als vollständige Gruppe.

### Szene 73 - Fünf Phasen des Zuverlässigkeitsmanagements

- Quelle: 92
- Archetyp: kanonische Prozessübersicht
- Muss-Inhalt: Planung, Schwachstellenanalyse, Erprobung/Nachweis, Produktionsabsicherung, Feldeinsatz
- Animation: fünf vollständige Phasenbänder in Sprecherreihenfolge.

### Szene 74 - Vier Zuverlässigkeitsfunktionen

- Quelle: 93
- Archetyp: ruhige 2x2-Plotmatrix
- Muss-Inhalt: Dichte `f(t)`, Ausfallwahrscheinlichkeit `F(t)`, Überlebenswahrscheinlichkeit `R(t)`, Ausfallrate `λ(t)`
- Layout: ein gemeinsames Zeitmodell und gleiche Achsenbreite; die vier Funktionsnamen stehen mit ihrem Symbol an der jeweiligen y-Achse. Keine erklärenden Textzeilen im Plotbereich und keine redundante Legende.
- Animation: Dichte zuerst, Ausfall- und Überlebenswahrscheinlichkeit als gemeinsame Sprechergruppe, Ausfallrate zuletzt.

### Szene 75 - Ausfallrate und Badewannenkurve

- Quelle: 94
- Archetyp: Dreizonen-Funktionsplot
- Muss-Inhalt: Verhältnis von Ausfällen zu intakten Einheiten, bedingtes Risiko, Badewannenkurve, drei Bereiche, unterschiedliche Ursachen und Maßnahmen
- Animation: Definition, Risikobedeutung, Kurve, danach die drei vollständigen Bereiche.

### Szene 76 - Die Weibullverteilung

- Quelle: 95
- Archetyp: dominanter Dichteplot mit Parameterankern
- Muss-Inhalt: charakteristische Lebensdauer `T`, Formparameter `b`, flexible Modellierung, breites Anwendungsspektrum, ausfallfreie Zeit `t₀`
- Animation: Kurvenfamilie, `T`, `b`, Flexibilität/Anwendung, `t₀`.

### Szene 77 - Badewannenkurve und Weibullparameter

- Quelle: 96
- Archetyp: gekoppelte Badewannenkurve und Weibullnetz-Zuordnung
- Muss-Inhalt: Badewannenkurve mit Bereich 1 bis 3; darunter das zeitlich ausgerichtete Weibullnetz; `b < 1` sinkend/Frühausfälle, `b = 1` konstant/Zufallsausfälle, `b > 1` steigend/Ermüdungs- und Verschleißausfälle; sichtbarer Hinweis auf schematische Darstellung und getrennte Analyse unterschiedlicher Ausfallmechanismen
- Animation: zunächst Badewannenkurve und Lebenszyklusbereiche, danach drei vollständige Weibullnetz-Segmente in der Reihenfolge des Sprechertexts. Der Auswertungshinweis bleibt als statische Referenz sichtbar.

## QA-Schwerpunkte

- Wiederverwendete Elemente müssen dieselben Bezeichnungen, Farben und Bedeutungen wie in den Ursprungsszenen behalten.
- Keine neue Zusammenfassungsbox oder Unterüberschrift ergänzen, wenn sie keine Lernfunktion besitzt.
- Kurve, Label, Marker und Hilfslinie bleiben gemeinsame Animationsgruppen.
- Die vier Funktionsplots verwenden ein gemeinsames Datenmodell und identische Zeitachse.
- Jede Szene wird einzeln gerendert, gegen ihre Quelle geprüft, inhaltlich gecrosscheckt und browserbasiert geprüft, bevor die nächste Szene freigegeben wird.
