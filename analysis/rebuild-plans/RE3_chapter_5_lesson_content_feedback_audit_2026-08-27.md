# RE3 – Kapitel 5: fachlicher Inhaltsabgleich und Umsetzung

Stand: 27.08.2026  
Reichweite: Kapitel 5, Lektion 1 und 2  
Ausgabemodus: `module_redesign` / transparentes `content_svg`

## Bestätigte Quellenbasis

- Lektion 1: alte SVG-Folien 58–59 sowie der zugehörige Sprechertext `section_018`
- Lektion 2: alte SVG-Folie 67 sowie der zugehörige Sprechertext `section_019`
- Nutzerreferenzen: fünf Screenshots zur 3-Parameter-Weibullverteilung und zwei Screenshots zu mehreren Ausfallmechanismen

Die zuvor angenommenen Anschlusszustände 60–66 und 68–72 gehören nach dem Nutzerabgleich nicht zu diesen beiden Lektionen. Sie wurden nicht gelöscht, sondern nur aus der aktiven Lernsequenz ausgeblendet.

## Lektion 1 – 3-Parameter-Weibull

| Zielszene | Lernfunktion | Vollständig umgesetzter Inhalt |
|---|---|---|
| `slide_058` | erkennen und auswählen | gekrümmter Verlauf im Zweiparameter-Weibullnetz; Prüffrage zum Drei-Parameter-Modell; Minitab-Auswahl „Weibull mit 3 Parametern“ |
| `slide_059` | interpretieren und plausibilisieren | Form-, Skalen- und Schwellenwert einschließlich Standardfehlern und 95-%-Intervallen; Bedeutung von `t₀`; negativer Schwellenwert `−1374` als physikalisch nicht sinnvolles Warnsignal; Stichprobenprüfung |
| `slide_060` | Anwendung entscheiden | physikalisch und statistisch begründbare ausfallfreie Zeit; deutlich konkaver Verlauf; ausreichend große Stichprobe; bei Unsicherheit konservative 2-Parameter-Weibull ab `t = 0` |

Die Verteilung auf drei Szenen verhindert, dass Diagramm, Parameterschätzung, Plausibilitätsprüfung und Einsatzregeln auf einer überladenen Folie konkurrieren. Die Sprechertextabsätze 0–13 werden lückenlos und ohne Wiederholung aufgeteilt.

## Lektion 2 – mehrere Ausfallmechanismen

`slide_067` bleibt eine zusammenhängende animierte Szene:

1. Das Bauteilbeispiel wird eingeführt.
2. Alle Ausfälle erscheinen gemeinsam mit einer einzigen gestrichelten Weibull-Geraden.
3. Schlechter Fit und ungenaue Prognose werden diagnostiziert.
4. Auf identischen Achsen erscheint die getrennte Auswertung mit Mechanismus A und B.
5. Die Konsequenz „trennen und separat analysieren“ wird ergänzt.
6. Ein eigener Weibull-Fit je Mechanismus und die bessere Prognose werden abgeleitet.
7. Der Merksatz schließt die Szene ab.

Die beiden Diagrammzustände verwenden dieselbe Skalierung und dieselben Datenpunkte. Damit wird die Trennung als fachliche Veränderung verständlich und nicht als Wechsel zu einer anderen Grafik.

## Technische Umsetzung

- Reproduzierbare Diagramme mit `components/python-plot-library/re3_special_case_plots.py`
- Eingabedaten je Szene unter `data/`, gerenderte Diagramme unter `plots/`
- Sprechertextgeführte Manifeste und Dramaturgiepläne für alle vier Szenen
- Viewer-Curation auf 38 aktive RE3-Szenen aktualisiert
- Quellenreferenzkarte und Szenenplan auf die bestätigte Kapitel-5-Struktur aktualisiert

## Verifikation

- Inhalts- und Strukturtests: 9/9 bestanden
- Szenenplan-Validierung: 38 Szenen, 60 aktive Quellzustände, 0 Fehler, 0 Warnungen
- strenge Designprüfung der vier geänderten Content-SVGs: 0 Fehler, 0 Warnungen
- strenge Browser-Layoutprüfung: 4 SVGs, 16 Animationszustände, 0 Fehler, 0 Warnungen
- visuelle Endzustände und 21 gerenderte Animationszustände geprüft
