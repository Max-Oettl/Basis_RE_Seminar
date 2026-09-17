# RE2 Technical-Completeness Repair Plan

Stand: 2026-08-27

## Ziel

Die verdichtete RE2-Fassung wird fachlich gegen die 165 Quellzustände und den zugeordneten Sprechertext zurückgeprüft. Informationen werden in vorhandenen Szenen ergänzt, solange eine klare visuelle Hierarchie erhalten bleibt. Wenn Definition, Methode, Beispiel oder Bewertung im Endzustand um Aufmerksamkeit konkurrieren, wird die Folge in eigenständige, aufeinander aufbauende Szenen getrennt.

## Referenz-Lock

- `RE2/slide_052`: technische Baumtopologie mit ruhigem Kontext und gezielter Pfadmarkierung
- `RE2/slide_067`: offene FMEA-Prinzipienkomposition ohne flächendeckendes Kartenraster
- `RE2/slide_139`: gleichrangiger Design-/Prozessvergleich mit einheitlicher Farbgewichtung
- Corporate-Farben: Marineblau als Grundfarbe, Stahlcyan und Signalgrün semantisch und sparsam, Koralle/Goldgelb nur als Fokus- oder Statussignal

## Reparaturentscheidungen

| Bisherige Szene | Reparatur | Fachlicher Zweck |
|---|---|---|
| 10 / Quellen 14–16 | zwei Szenen | abstraktes Funktionsprinzip vor Wechselrichterbeispiel |
| 11 / Quellen 17–19 | zwei Szenen | ABC-Kriterien vor Ergebnisübersicht |
| 17 / Quellen 36–48 | drei Szenen | Gatter, Baumaufbau und Ereignissymbole getrennt erklären |
| 18 / Quellen 49–51 | zwei Szenen | kritische Pfade und minimale Ausfallschnitte eigenständig sichern |
| 21 / Quellen 58–62 | drei Szenen | Systemarchitektur, Common Mode und Common Cause trennen |
| 27 / Quellen 72–77 | zwei Szenen | Analyseumfang/Unterlagen vor Teamzusammensetzung |
| 31 / Quellen 86–89 | zwei Szenen | Zeichnung/Stückliste vor korrekter Systemhierarchie |
| 33 / Quellen 91–95 | zwei Szenen | Funktionsmethoden vor Getriebebeispiel |
| 35 / Quellen 97–103 | zwei Szenen | Fehlerdefinition vor vollständigem Fehlerbaum |
| 36 / Quellen 104–109 | drei Szenen | Reifenbeispiel, Ebenenlogik und Ausfallkatalog trennen |
| 39 / Quellen 112–118 | zwei Szenen | B/A/E-Definitionen vor Bewertungskriterien |
| 40 / Quellen 119–126 | zwei Szenen | RPZ und Aufgabenpriorität getrennt bewerten |
| 44 / Quellen 132–138 | zwei Szenen | Formblatt vor Zielen und iterativer Dokumentation |
| 46–48 / Quellen 143–155 | Paarvergleiche plus Zusatzszene | Design- und Prozess-FMEA vollständig und gleichrangig darstellen |

## Sprechertext-Schnitt

- Es werden ausschließlich zusammenhängende Passagen aus dem vorhandenen Sprechertext verwendet.
- Schnittstellen liegen an fachlichen Übergängen; kein Satz wird doppelt verwendet oder ausgelassen.
- Definition oder Regel steht vor Beispiel und Anwendung.
- Jede neue Szene besitzt eigene semantische Animationsgruppen; Verbinder erscheinen nach ihren Endpunkten.

## Qualitätsgates

- Alle Quellen 1–165 sind genau einer Szene zugeordnet.
- Der zusammengefügte Sprechertext jeder getrennten Ausgangspassage entspricht wieder exakt dem Original.
- Fachbegriffe, Regeln, Formeln, Hierarchien und Beispiele sind im statischen Endzustand sichtbar.
- Kein Abschnitt wird allein durch abgerundete Boxen strukturiert; Leserichtung und Ebenenhierarchie sind ohne Animation verständlich.
- Statischer Render, Trigger-Prüfung, Viewer-Test, Transparenztest und SVG-QA sind erfolgreich.

## Abschluss

- [x] 68 aktive Szenen aus 165 eindeutig zugeordneten Quellzuständen erzeugt
- [x] Sprechertext an 14 fachlichen Übergängen verlustfrei geteilt
- [x] fehlende Regeln, Methoden, Beispiele, Hierarchien und Bewertungsrichtungen ergänzt
- [x] 68 Dramaturgiepläne aufgebaut; 62 Szenen animiert, 6 statisch
- [x] Viewer auf die neue Szenenreihenfolge umgestellt
- [x] strikte Design- und Layout-QA mit 0 Fehlern abgeschlossen
