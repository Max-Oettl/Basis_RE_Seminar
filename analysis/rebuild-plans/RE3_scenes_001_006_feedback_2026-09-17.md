# RE3 – Überarbeitung der sichtbaren Szenen 1–6

## Auftrag und Referenz-Lock

Planungsmodus: `module_redesign`; Zielmodus: `content_svg`, transparent,
1920 × 1080, wie die aktuellen RE2-Referenzen `slide_016`, `slide_023` und
`slide_047`. Titel, Footer und Hintergrund gehören zum nachgelagerten Player.
Referenzrenders: `analysis/render-checks/RE3/feedback-2026-09-17/reference/`.
Offene Hierarchien, marineblaue Typografie, Archivo, wenige semantische Akzente,
großzügige Abstände und leichte technische Linien verbinden die Module.
Die Quelltopologie bleibt erhalten, ohne die Quellgestaltung zu kopieren.

## Sequenz und vollständiges Inhaltsinventar

| Sichtbare Szene / stabile Datei | Gesichtet: Quellen | Beibehalten / neu gruppieren | Umsetzung und Animation |
|---|---|---|---|
| 1 / slide_001 | 1: Daten, Auswertung, Methoden, Parameter, Ziel, hochformatiges Weibullnetz, Formel und Parameterdefinitionen | Alle Fachinhalte; nur Quellmaster und Sprechericon entfernen | Quellnahes Flussbild links, breiter Pfeilkörper mit sicherem Textinnenraum, hoher Plot rechts; mathematisch gesetzte Formel; Daten → Ziel → Methoden/Parameter → Weibullmodell → T/b → Anwendung |
| 2 / slide_002 | 2: Zeitachse; 3: Median-Rank-Formel; 4: Zuordnung; 5: Punkte; 6: Fit; 7: T/b; 8: Funktion und Zahlenbeispiel | Vorhandene fünf Bereiche und alle sieben Wertepaare erhalten | Jeden Plotpunkt einzeln zeigen und zugehöriges Wertepaar gleichzeitig kurz hervorheben; Fit danach, Parameter und Beispiel zuletzt |
| 3 / slide_009 | 9: Ausgangsachse/Auswertung; 10: gemischte A/B-Ausfälle, Auftrennung, zwei Geraden | Exakt A: t1,t3,t6; B: t2,t4,t5; getrennte Fits und Gesamtzuverlässigkeit | Gemeinsame Zeitachse → getrennte Achsen → beide Reihen im gemeinsamen Netz; Zuordnungslabels bleiben konsistent |
| 4 / slide_011 | 11: gemeinsame Ausfallachse, Objektzuordnung, Auswertung; 12: Abbruch/Zensierungen | Vier beobachtete Ausfälle und zwei überlebende Objekte; Überlebensinformation; Auswertung | Zeitachse zuerst, Abbruch sichtbar; kleines Objekt-Zeit-Diagramm als erklärende Zuordnung; passender Auswertungshinweis statt übergroßer Objektgrafik |
| 5 / slide_013 | 13: Daten → grafische Methode oder Berechnung, MLS/MLE | Grafischer Weg, höhere Genauigkeit/Komplexität, Software und fachliche Methodenwahl aus Sprechertext | Vollständig neuer offener Vergleich, keine improvisierte Minigrafik; Methoden nacheinander, dann Software und bewusste Anwendung |
| 6 / slide_014 | 14: Ausfalldaten, Weibullgerade, zwei Vertrauensgrenzen | Schätzung und zusätzlicher Vertrauensbereich; Überleitung zur nächsten Lektion | Ein dominanter Plot: Daten/Fit zuerst, beide Grenzen zusammen bei ihrer Einführung; kurze Erklärung rechts |

Alle wirksamen Sprechertexte wurden aus dem vorhandenen SVG-Text-Mapping und
der aktuellen Szenenaufteilung gelesen. Für diese sechs Szenen liegen keine
Sprechertext-Overrides vor. Texte und stabile Szenen-IDs bleiben erhalten.
Alle 14 Quellzustände wurden einzeln gerendert und gesichtet; Vorher- und
Quellrenders liegen unter `analysis/render-checks/RE3/feedback-2026-09-17/`.

## Assets, Laufzeit und Produktion

Echte Plots aus Python mit `reltest_plot_style.py`; vorhandene Fit-, Median-Rank-
und Bootstrap-Funktionen wiederverwenden. Formel als Mathtext-SVG mit Pfadglyphen.
Reine Zeitachsen bleiben SVG-Geometrie. Keine neuen Piktogramme erforderlich.
Illustrative Zeitpositionen werden ausdrücklich als solche dokumentiert;
Zeitpunkt-Identitäten und Zugehörigkeiten aus den Quellen bleiben verbindlich.

Runtime: show/hide/highlight/draw/transform. Animierte Targets sind initial
unsichtbar. Exakte Sprecherphrasen steuern die Abfolge; keine erfundenen TTS-Zeiten.
Punkte in Szene 2 werden auf aufeinanderfolgenden Originalphrasen des
Eintragungsabschnitts sichtbar. Eine Hervorhebung folgt erst nach dem Reveal
des zugehörigen Wertepaares. Jeder Zwischenzustand erhält einen Rendercheck.

Strikt pro Szene: statische Komposition → Render/Quelle/RE2-Vergleich →
Korrektur → Manifest → Zwischenzustände → Content-Crosscheck und Strict-QA.
Schwerpunkte: Formelsatz, Textinnenabstände, Zuordnung der Punkte, A/B-Identität,
Zensierung vor Ergebnis, keine vorzeitig sichtbaren Fit-/Grenzlinien.

## Feedback-Lernen

- `project_rule`: Automatisch abgespielte Lerninhalte begleiten längere
  Erklärungen durch fachlich begründete Aufbauten oder Fokuswechsel. Lange
  unbegründete Stillstände vermeiden; keine dekorative Dauerbewegung.
- `module_pattern`: RE3 übernimmt die visuelle Sprache von RE2; die
  funktionierende Herleitung der Quelle bestimmt die Grafikstruktur.
- `domain_rule`: Bei Wertetabelle und Plot muss die Herkunft jedes
  eingeblendeten Punktes durch konsistente Kennzeichnung und Fokus erkennbar sein.
- `local_fix`: hoher Plot in Szene 1; kleinere Objektgrafik in Szene 4.

## Abschlussaudit 17.09.2026

Die Nutzerkorrektur der Nummerierung ist umgesetzt: Gemeint sind die stabilen
Dateien 001, 002, 009, 011, 013 und 014. Die sichtbaren ersten sechs Szenen
bleiben in ihrer bestehenden Reihenfolge; keine Szenen wurden umnummeriert.

### Umsetzung und visuelle Prüfung

- **001:** Quellnahes Flussbild, Text vollständig im Pfeilkörper, hoher Plot
  mit ursprünglicher LC-Einheit und Weibullgeraden-Beschriftung. Formel korrekt
  als `F(t) = 1 − exp(−(t/T)^b)` gesetzt. Der erste Aufbau beginnt mit der
  Eröffnung des Sprechertexts. Unpassende zusätzliche Pfeilspitzen entfernt.
- **002:** Sieben nummerierte Wertepaare und sieben gleich nummerierte Punkte.
  Jeder Punkt erscheint zusammen mit einem kurzen Fokus auf seine Tabellenzeile.
  Alle sieben Übertragungen liegen innerhalb des gesprochenen Eintragungssatzes,
  vor der Aussage, dass dieser Schritt abgeschlossen sei. Fit, Parameter und
  Quellenbeispiel `T=8, b=3, F(10)≈85,8 %` folgen anschließend.
- **009:** Gemeinsame Ausfälle zuerst, dann getrennte Zeitachsen, dann A/B im
  selben Wahrscheinlichkeitspapier. Identitäten exakt A={t1,t3,t6}, B={t2,t4,t5}.
  Geraden und Legenden werden mit der jeweiligen gesprochenen Einführung gezeigt.
- **011:** Ausgangszeitachse und Testabbruch vor der kompakteren Objektzuordnung.
  Ausfallreihenfolge Objekte 2,5,1,6; Zensierungen Objekte 3,4 wie in der Quelle.
  Die kleine Auswertungsgerade ist das schematische Auswertungssymbol der Quelle,
  kein behaupteter numerischer Fit unter Zensierung; Datenprovenienz dokumentiert.
- **013:** Vollständig neue Gegenüberstellung grafische Methode / Berechnung.
  MLS, MLE, Komplexität und Software erscheinen im gesprochenen Ablauf.
  Sechs illustrative Ausfälle entsprechen der Quellanzahl und dem folgenden
  Vertrauensbereichsbeispiel. Zusätzliche Fokussierung während der Erklärung,
  weshalb die fachliche Methodenwahl trotz Software verstanden werden muss.
- **014:** Datenzeitachse → Weibull-Schätzung → beide Vertrauensgrenzen → Ausblick.
  Die 95-%-Grenze oben und 5-%-Grenze unten sind direkt und kollisionsfrei
  beschriftet. Bounds und Beschriftungen bilden ein gemeinsames Animationsziel.

Alle sechs Endzustände wurden mit Quellen und den festgelegten RE2-Referenzen
verglichen, zusätzlich verkleinert auf 960×540. Die unabhängige visuelle
Zweitprüfung meldet nach den Korrekturen keine verbleibenden konkreten Fehler.
Die finale Übersicht liegt unter
`analysis/render-checks/RE3/feedback-2026-09-17/re3-revised-overview.jpg`.

### Prüfergebnisse und Grenzen

- Strict-SVG-/Design-/Layout-QA: **0 Fehler**, 0 Designwarnungen, 0 Layoutbefunde.
  Der Lauf erfasst 63 SVGs und 48 Manifeste; die gezielte gerenderte Prüfung
  umfasst 17 SVGs einschließlich eingebetteter Assets und 80 Zustände.
  Bericht: `analysis/render-checks/RE3/feedback-2026-09-17/qa-final/`.
- Die 11 allgemeinen Seitenverhältnis-Warnungen betreffen ausschließlich
  einzelne Plotassets: sieben neue und vier bereits vorhandene außerhalb des
  Feedbackumfangs. Plotassets müssen nicht 16:9 sein; die sechs Folien sind es.
- 78 finale Zustandsbilder einschließlich laufender Hervorhebungen liegen unter
  `analysis/render-checks/RE3/feedback-2026-09-17/states-final/`.
  Die Highlight-Simulation des QA-Renderers wurde an die Viewer-Laufzeit
  angepasst: sichtbare Werte bleiben deckend, der Fokus pulsiert kurz und endet
  im Ausgangsstil. Drei zugehörige Regressionstests bestanden.
- Alle sechs Dramaturgiepläne: **0 Fehler**. Jeweils ein bewusster Hinweis zum
  zunächst leeren Inhaltsbereich; der Player liefert den Titel, der erste
  fachliche Inhalt folgt bei seiner ursprünglichen Sprecherphrase. Die
  Zustandsprüfungen sind mit konkreten Rendernachweisen als bestanden markiert.
- Sprechertext-Mapping: **72 Zuordnungen, 1 Dokument, 0 Fehler, 0 Warnungen**.
  Keine Änderungen an Quell-SVGs, gesprochenen Texten oder Szene-IDs durch
  diese Feedbackrevision. Die verwendeten sourceText-Phrasen sind exakt,
  eindeutig und in der gesprochenen Reihenfolge.
- Content-Crosschecks: **0 Fehler**, keine unbelegten Zieltext-Ergänzungen.
  Verbleibende mechanische Textwarnungen: 2/56/2/2/5/3 für die sechs Szenen.
  Sie bleiben im Rohbericht sichtbar und sind unten manuell eingeordnet.
- Die interaktive Browserverbindung war nicht verfügbar. Geprüft wurde mit
  lokalem Chromium, realen SVGs und Manifesten; ein vollständiger Audio-Durchlauf
  mit erzeugten TTS-Zeitmarken wurde nicht behauptet. Die genaue Sprachsynchronität
  bleibt durch die bestehenden phrasebasierten Laufzeit-Trigger bestimmt.

### Manuelle Einordnung der Inhaltswarnungen

Die wiederholten Quelltitel sind Masterelemente und werden im Content-SVG
absichtlich nicht dupliziert. Szene 001 formuliert das unveränderte Ziel als
„Ausfallverhalten von Komponenten und Systemen abschätzen“. In Szene 002 sind
die wiederholten Prozessüberschriften über fünf neue Bereiche zusammengefasst;
Rangnummer und Stichprobengröße stehen bei der Formel, Regressionsgerade,
Steigungsparameter, 63,2-%-Definition und Zahlenbeispiel sind sichtbar erhalten.
Der Textvergleich erkennt Formelpfade, geteilte Zahlenglyphen und sprachliche
Umformulierung nicht vollständig. Szene 013 ersetzt die Quellzeitachse durch
die sechs entsprechenden Datenpunkte; die isolierten Indexglyphen 2,3,4,6 sind
keine zusätzlichen Sachinhalte. Szene 014 verwendet die direkten Beschriftungen
„5-%-Grenze“ und „95-%-Grenze“ zusammen mit „Vertrauensbereich“; die in der Quelle
separat extrahierten Wortfragmente „Vertrauensgrenze“ bleiben daher Textwarnungen.
Die automatischen Rohberichte werden nicht künstlich auf fehlerfreie
Textübereinstimmung umgeschrieben. Nutzerreview bleibt offen.
