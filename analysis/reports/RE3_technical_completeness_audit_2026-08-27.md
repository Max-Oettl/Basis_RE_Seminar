# RE3 – Audit der technischen Vollständigkeit vor der Reparatur

Stand: 27.08.2026  
Prüfmodus: vollständiger Quellen-/Ziel-/Sprechertext-Abgleich vor Umsetzung  
Ausgangsstand: 72 Quell-SVGs, 35 aktive Zielszenen, Quelle 44 fälschlich entfernt

## Kurzurteil

Der aktuelle RE3-Stand ist technisch nicht vollständig. Die frühe Modulprüfung hat zwar alle 35 Ziel-SVGs technisch freigegeben, aber mehrere inhaltliche Verdichtungen nicht als Verlust erkannt. Besonders betroffen sind:

- die einseitigen Vertrauensbereiche: In Szene 24 sind Mindest- und Maximalabsicherung vertauscht; die 90-%-/10-%-Grenzlogik sowie die unterschiedliche Aussage für `F(t)` und `R(t)` fehlen,
- die multiple Zensierung: Die Quellen 39–41 zeigen die wechselseitige Behandlung der jeweils anderen Ausfallart als Zensierung; Szene 38 reduziert diese Topologie auf einen Erklärungssatz,
- die Übungsfolge 44–50: Versuchskontext, Rohdaten, Median-Rank-Tabelle, konkrete Aufgaben und numerische Parameterschätzungen wurden teilweise entfernt,
- die Zensierungsübung 55–56: Der Datensatz mit acht Ausfällen und zwölf Suspensionen sowie der Vier-Schritt-Arbeitsauftrag fehlen,
- das 3-Parameter-Beispiel 60–65: Fallkontext, Auswertungsstufen, Vergleich 2-/3-Parameter, negativer Schwellenwert und Vertrauensbereich wurden in zwei dichte Szenen zusammengedrückt,
- die Ergebnisfolge 70–72: gemeinsamer Fit, getrennte Fits und technische Schlussfolgerung stehen in einer einzigen überladenen Szene,
- die Sprecherlogik: Die vollständigen Abschnitte 003, 018 und 019 werden derzeit in mehreren Ziel­szenen wiederholt, statt verlustfrei entlang der Lernbeats aufgeteilt zu werden.

## Szenenweiser Befund

| Aktuelle Szene | Quellen | Urteil | Befund / notwendige Maßnahme |
|---|---:|---|---|
| 1 | 1 | vollständig | Wirkpfad, Weibullformel, `T` und `b` bleiben erhalten. |
| 2 | 2–8 | vollständig, dicht | Aufbauzustände dürfen als eine animierte Workflow-Szene bleiben; Formel, Ranglogik, Auftragung, Fit und Parameterablesung sind vorhanden. |
| 9 | 9–10 | ergänzen | Getrennte Mechanismen sind sichtbar; die anschließende Verrechnung zur Gesamtzuverlässigkeit aus dem Sprechertext fehlt als Ergebnisbezug. |
| 11 | 11–12 | vollständig | Zensierte Laufzeit, unbekannter Ausfallzeitpunkt und typische Beobachtungsenden sind vorhanden. |
| 13 | 13 | ergänzen | MLS/MLE sind vorhanden; Einfachheit/Komplexität und Softwarebezug sollen als untergeordnete Methodeneigenschaften sichtbar werden. |
| 14 | 14 | vollständig | Punktschätzung und beide Vertrauensgrenzen sind vorhanden. |
| 15 | 15–16 | vollständig | Stichprobe, Grundgesamtheit und statistischer Schluss bleiben erhalten. |
| 17 | 17–19 | vollständig | 90-%-Bereich, 5-%-/95-%-Grenzen und Aussagesicherheit sind sichtbar. |
| 20 | 20–22 | ergänzen | Stichprobenumfang und Konfidenzniveau sind vorhanden; die konkreten Paare 80 % = 10/90 und 90 % = 5/95 sowie das Fehleinschätzungsrisiko fehlen. |
| 23 | 23 | vollständig | Dichtefunktionen, Mediane und 50/50-Lage sind erhalten. |
| 24 | 24–30 | fachlich falsch / aufteilen | Linksseitig und rechtsseitig sind semantisch vertauscht; Prozentgrenzen und Anwendung auf `F(t)` versus `R(t)` fehlen. In drei Szenen 24, 27 und 29 aufteilen. |
| 31 | 31–33 | ergänzen | Drei Datenquellen sind vorhanden; „Unsicherheit nimmt zu“ und „Repräsentativität nimmt zu“ müssen explizit an derselben Entwicklungsachse lesbar sein. |
| 34 | 34 | vollständig | Vollständige Daten, exakte Ausfälle und Versuchsende sind erhalten. |
| 35 | 35 | ergänzen | Rechtszensierung ist korrekt; die Beziehung `t_zens ≥ letzter beobachteter Ausfall` soll als knappe Prüfregel sichtbar werden. |
| 36 | 36–37 | vollständig | Feste Zeit versus feste Ausfallzahl und jeweilige Zufallsgröße sind erhalten. |
| 38 | 38–41 | unvollständig / aufteilen | Zufällige Zensierungszeitpunkte bleiben in Szene 38; die Quellen 39–41 werden als neue Szene 39 mit Ausgangsmischung sowie separater Sicht für Mechanismus A und B wiederhergestellt. |
| 42 | 42 | ergänzen | Intervallgrenzen sind korrekt; zusätzlich muss sichtbar werden, dass Intervallzensierung die Beobachtungsauflösung und nicht den Versuchsaufbau beschreibt. |
| 43 | 43 | ergänzen | Informationsnutzung ist korrekt; einfache MLS-Anwendung und höhere MLE-Komplexität/Softwarebedarf ergänzen. |
| 45 | 45–46; Quelle 44 entfernt | unvollständig / aufteilen | Quelle 44 enthält trotz Produktionsnotizen den fachlichen Versuchsfall. Neue Szenen 44, 45 und 46: Aufgabe/Rohdaten, Median Ranks, Fit/Parameter. Produktionsnotizen werden entfernt, Fachinhalt bleibt. |
| 47 | 47 | unvollständig | Alle 20 Lastwechselzahlen, Belastung 380 N/mm², `n = 20`, Aufgaben zu `B10`, `B5` und Zuverlässigkeit bei 50.000 LW wieder sichtbar machen. |
| 48 | 48–49 | unvollständig / aufteilen | Quelle 48 erklärt die konservative einseitige Vorhersage; Quelle 49 enthält konkrete Fit- und 90-%-KI-Werte. In Szenen 48 und 49 trennen. |
| 50 | 50 | unvollständig | Die acht konkreten Kilometerwerte fehlen; sie werden zusammen mit den vier Originalaufgaben ergänzt. |
| 51 | 51 | vollständig | Neutraler Scope ohne erfundene Kapitelnummern ist zulässig. |
| 52 | 52 | vollständig | Typ-I-/Typ-II-Versuchsaufbau, Formel und Statuscodierung sind im Quellasset vorhanden. |
| 53 | 53–54 | vollständig, dicht | `n = 6`, `r = 4`, vier Ausfallzeiten, Rang-/Wahrscheinlichkeitstabelle und Extrapolation sind im großen Quellasset erhalten. |
| 55 | 55–56 | unvollständig / aufteilen | Extrapolationsproblem und Übungsdatensatz sind verschiedene Lernfunktionen. Szene 55 bleibt Diagnose; Szene 56 zeigt 8 Ausfälle, 12 Suspensionen bei 40.000 LC und vier Originalaufgaben. |
| 57 | 57 | vollständig | Übergang zu Sonderfällen ist fachlich passend. |
| 58 | 58 | vollständig | Gekrümmter Verlauf und Schwellenwert `t₀` sind vorhanden. |
| 59 | 59 | vollständig | Voraussetzungen und konservative 2-Parameter-Regel sind erhalten. |
| 60 | 60–62 | unvollständig / aufteilen | In Szenen 60–62 aufteilen: sicherheitskritischer Bremsfall plus 30 Werte, Auswertung 2-/3-Parameter, Ergebnis „kein Nachweis trotz n = 30“. |
| 63 | 63–65 | unvollständig / aufteilen | In Szenen 63–65 aufteilen: 2-/3-Parameter-Vergleich ohne eindeutige Differenzierung, negativer/physikalisch unsinniger Schwellenwert, Vertrauensbereich und Medianwarnung. |
| 66 | 66 | ergänzen | Übergang bleibt, erhält aber nur den passenden ersten Sprecherbeat; keine Wiederholung des gesamten Abschnitts. |
| 67 | 67 | fachlich widersprüchlich | Text erklärt den schlechten gemeinsamen Fit, das Plot zeigt bereits getrennte Geraden. Der Plot muss wieder den gemeinsamen schlechten Fit/Knick zeigen. |
| 68 | 68–69 | vollständig | Datengrundlage und vier Aufgaben sind sichtbar; Szene bleibt statisch, da kein eigener gesprochener Übungstext geliefert wurde. |
| 70 | 70–72 | vollständig, aber überladen / aufteilen | In Szenen 70, 71 und 72 aufteilen: gemeinsamer Fit, getrennte Fits, numerische Schlussfolgerung mit Ursachen/Maßnahmen. |

## Reparaturentscheidung

Der Zielstand umfasst 48 aktive Szenen. Alle 72 Quellfolien werden genau einmal abgedeckt; Quelle 44 wird nicht länger entfernt. Zusammengezogen bleiben nur echte Aufbauzustände. Eigenständige Definitionen, Datensätze, Rechen-/Auswertungsstufen und Ergebnisinterpretationen werden getrennt.

Sprechertexte werden für die Abschnitte 003, 008, 013, 018 und 019 entlang vollständiger Absatzgrenzen partitioniert. Die normalisierte Verkettung der Teiltexte muss exakt dem jeweiligen DOCX-Abschnitt entsprechen. Übungsfolien aus Abschnitt 016 behalten den gelieferten Platzhalter `Text Separat!`; es wird kein neuer Fachsprechertext erfunden. Für die quellenbasierten Beispiele 60–65 und 68–72 ohne eigenen gesprochenen Abschnitt werden statische Szenen ohne erfundene Trigger verwendet.

## Freigabekriterien nach Umsetzung

- 72 von 72 Quellfolien genau einmal referenziert, keine entfernte Fachfolie,
- 48 aktive Ziel­szenen in korrekter Reihenfolge,
- verlustfreie Sprechertextpartitionen ohne Wiederholung der vollständigen Abschnitte,
- alle Formeln, Parameter, Rohdaten, Fallunterscheidungen und Ergebniswerte sichtbar oder als freigegebenes Quellasset eingebunden,
- statischer Endzustand und relevante Animationszustände gerendert,
- striktes Design-/Layout-QA ohne Fehler,
- Viewer-Kuration und Modulplan auf denselben aktiven Szenenstand synchronisiert.

## Umsetzungsergebnis

Stand nach Reparatur: 27.08.2026  
Urteil: vollständig umgesetzt und technisch freigegeben

- 48 aktive Zielszenen aus 72 Quellzuständen erzeugt,
- 72 von 72 Quellfolien genau einmal referenziert; keine Fachfolie entfernt,
- Quelle 44 als eigene Zahnrad-Aufgabe mit Versuchskontext und zehn Ausfallzeiten wiederhergestellt,
- Vertrauensbereichsfolge auf Szenen 24, 27 und 29 aufgeteilt und fachlich korrigiert,
- konkurrierende Ausfallmechanismen als reziproke Zensierungslogik in Szene 39 visualisiert,
- Übungs- und Ergebnisfolgen 44–50, 55–56, 60–65 und 70–72 entdichtet,
- Rohdaten, Median Ranks, Parameterschätzungen, Konfidenzintervalle, Suspensionen und Ergebniswerte sichtbar ergänzt,
- Sprechertexte der Abschnitte 003, 008, 013, 018 und 019 vollständig, in Originalreihenfolge und ohne Wiederholung partitioniert,
- 48 SVGs und 48 Manifeste im Viewer synchronisiert,
- striktes Design-/Layout-QA über 123 gerenderte Zustände: 0 Fehler, 0 Warnungen,
- fünf automatisierte RE3-Tests einschließlich Inhalts- und Sprechertextprüfung bestanden.

Technische Nachweise:

- [RE3-Szenenplan](../rebuild-plans/RE3_scene-plan.json)
- [QA-Bericht](../qa-reports/RE3/technical-completeness-2026-08-27/svg-qa-report.md)
- [Gerenderte Vorschauen](../render-checks/RE3/technical-completeness-2026-08-27)
