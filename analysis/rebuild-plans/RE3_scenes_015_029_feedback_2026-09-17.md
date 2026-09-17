# RE3 – Feedbackrevision Szenen 15 bis 29

## Auftrag und Referenz-Lock

Planungsmodus `module_redesign`, Ausgabe weiterhin transparente `content_svg`,
1920×1080. Stabiler Umfang: slide_015, 017, 020, 023, 024, 027, 029.
Sprechertexte, Quellen, IDs und die zuvor akzeptierten Szenen bleiben erhalten.
Referenz-Lock: RE2 slide_016, slide_023, slide_047 und die vom Nutzer akzeptierte
RE3-Revision 001–014. Marineblau trägt die Ordnung, sparsame grüne Education-
Akzente markieren Lernfokus. Lokale Begriffsflächen mit CI-Eckenform und Oxanium-
Auszeichnungen machen die Zugehörigkeit sichtbarer. Keine Masterelemente.

## Quelleninventar und Sequenz-Preflight

Alle folgenden Quellen wurden einzeln gerendert, gesichtet und mit den exakt
zugeordneten Sprechertexten gelesen. Mappingprüfung: 72 Zuordnungen, 0 Fehler.

| Quelle | Fachlicher Zustand / Erhalt |
|---|---|
|15|Grundgesamtheit → Stichprobe → Median-/Weibullgerade|
|16|Zusätzlich Vertrauensgrenzen, Rückschluss auf Lebensdauer der Grundgesamtheit|
|17|Weibullgerade im hochformatigen Netz, Lebensdauer in 10⁶ LC|
|18|Beide Grenzen, 90-%-Bereich, Erklärung des Schätzens|
|19|Weitere mögliche Geraden und Begriff Aussagewahrscheinlichkeit/Aussagesicherheit|
|20|Vorbereiteter leerer Diagrammrahmen|
|21|Weibullgerade plus 5-/95-%-Grenzen, 90-%-Bereich|
|22|Engerer 80-%-Bereich mit 10-/90-%-Grenzen; Stichprobenumfang, Präzision, Fehleinschätzung|
|23|Bestehende 3D-Dichtefunktionen, Medianverbindung, 50/50-Lage; Achsen vollständig sichtbar|
|24|Dichtefunktion der Ausfallwahrscheinlichkeit als Frontansicht|
|25|Zweiseitige Fläche zwischen unterer und oberer Grenze|
|26|P_A=90 %, Grenzen 5/95 %|
|27|Zweiseitiger Vergleich plus linksseitige Fläche bis zur oberen Grenze|
|28|Linksseitig 90 % benötigt nur die obere 90-%-Grenze|
|29|Rechtsseitige Fläche ab unterer 10-%-Grenze; zweiseitiger Vergleich bleibt|
|30|Wechsel von Dichte f(F) zu f(R), untere Zuverlässigkeitsgrenze|

Nur Titel, Footer/Logo und Sprechericon sind `decorative_remove`.
Alle anderen Beziehungen, Prozentangaben und Fachbegriffe bleiben erhalten.
Bezeichnungen werden knapp aus dem Sprechertext paraphrasiert; keine neue
Fachbehauptung und keine erfundene Messreihe. Numerische Beispieldaten werden
als illustrative Modell-/Plotdaten lokal dokumentiert.

## Szenenplanung vor Produktion

| Szene | Gestaltung / Assets | Sprechergeführter Aufbau |
|---|---|---|
|15|Prozess der statistischen Schlussfolgerung: Population mit markierter Stichprobe, kleiner Medianplot, kleiner Plot mit Grenzen; ruhige CI-Begriffsflächen|Grundgesamtheit → begrenzte Stichprobe → Analyse → eingeschränkte Gültigkeit → Unsicherheit → Rückschluss|
|17|Schmaler hoher Weibullplot rechts; links gestaffelte Erklärung und 90-%-Auszeichnung|Fit → beide Grenzen → Aussagewahrscheinlichkeit → alternative Stichproben → Begriffssicherung|
|20|Zwei echte Diagrammvergleiche, gleiche Basisschätzung/Skalen: 90 gegen 80 %; kleinere gegen größere Stichprobe|Ergebnis aus Fit/Grenzen → 90 % → 80 % → enger/weiter → Stichprobenumfang → Konsequenz für Genauigkeit|
|23|Bestehendes akzeptiertes Diagramm weiterverwenden; gebündelte CI-Erklärzone rechts; keine überlagernde untere Merksatzleiste|3D-Kontext → Verteilung je Zeitpunkt → Mediane → 50/50-Lage → Frontansicht als Übergang|
|24|Tatsächliche Dichtekurve mit mathematisch berechneter Fläche, zwei Grenzen und 90-%-Anteil; kurze Erklärung rechts|Dichte → beide Grenzen und Fläche → 5/95 % → Unsicherheit in beide Richtungen|
|27|Gleiche Dichte/Skala; zweiseitige Referenz neben linksseitigem Bereich|Bekannter Vergleich → obere Grenze/linksseitige Fläche → maximale Ausfallwahrscheinlichkeit → 90-%-Vergleich|
|29|Drei Spalten: zweiseitiger F-Bereich als Referenz, rechtsseitiger F-Bereich, gespiegelte R-Dichte|Untere Grenze/rechte Fläche → 10 % → begrenzter Nutzen bei F → untere Grenze bei R → Wahl nach Fragestellung|

Alle Szenen sind `animated`. Initial bleibt der Inhalt bis zur ersten relevanten
Originalphrase verborgen; der Titel kommt vom Player. Atomare Gruppen umfassen
jeweils die gesamte fachliche Einheit. Vertrauensgrenzen im Weibullnetz werden
gemeinsam sichtbar. Bei Dichtefunktionen dürfen die mathematisch definierten
Flächen gezeigt werden; das Verbot gefüllter Weibullbänder gilt hier nicht.

Python verwendet die vorhandene Median-Rang-/Weibull-/Bootstrap-Bibliothek und
`reltest_plot_style`. Quantile der beispielhaften Dichte werden berechnet;
Prozentwerte benennen das Konfidenzquantil und werden nicht als beobachtete
Ausfallwahrscheinlichkeit missverstanden. Neue Piktogramme sind nicht nötig.

Produktion strikt je Szene: statischer Render → Quellen-/CI-Vergleich →
Korrektur → Manifest → Zustandsbilder → Content-Crosscheck → Strict-QA.
Renderwurzel: `analysis/render-checks/RE3/feedback-15-29-2026-09-17/`.

## Feedback-Lernen

- `project_rule`: CI durch Typografie, marineblaue Inhaltsflächen und einen
  bewussten grünen Lernfokus erkennbar machen, ruhig und ohne zusätzliche Dekoration.
- `domain_rule`: Plotgröße nach Erklärfunktion wählen. Veranschaulichungen nicht
  künstlich zur Hauptfläche aufblasen; Quellseitenverhältnis bewusst erhalten.
- `module_pattern`: Zweiseitige/einseitige Bereiche anhand derselben Dichte und
  Skalierung als echte Flächen erklären; bekannte Varianten zum Vergleich erhalten.
- `qa_gap`: Ergebnisleisten gegen den vollständigen Plot einschließlich Achsen-
  und Ticklabels prüfen, nicht nur gegen den inneren Datenraum.

## Verifikation

Abgeschlossen am 17.09.2026. Alle sieben Endzustände und 83 diskrete
Animationszustände einschließlich Hervorhebungen wurden gerendert und unabhängig
durch `/root/visual_review` geprüft. Zusätzlich Lesbarkeit bei 960×540 geprüft.
Kein verbleibender visueller Befund. Übersicht: `overview.png` in der Renderwurzel.

| Szene | Schritte | Zustandsbilder | Geprüfte Verbesserung |
|---|---:|---:|---|
|15|13|13|Grundgesamtheit, Auswahl und Rückschluss nachvollziehbar; kleine Plots; beide Grenzen direkt beschriftet; Rückpfeil ohne Kollision|
|17|10|8|Hoher schmaler Plot, geordnete Erklärung links, alternative Fits erst beim Bezug auf andere Stichproben|
|20|17|16|Vollständiger Neuaufbau: 90/80-%-Vergleich und Stichprobenvergleich auf jeweils gleichen Achsen; getrennte Hervorhebungen|
|23|8|11|Akzeptiertes Plotasset unverändert; Erklärung rechts; Achsenbeschriftung vollständig frei; 50/50-Aussage auf den jeweiligen Zeitpunkt bezogen|
|24|6|5|Dichte → beide Grenzen und Fläche → 90 % mit 5/95-%-Grenzen → Unsicherheit in beide Richtungen|
|27|10|11|Zweiseitige Referenz bleibt; linksseitige Fläche bis zur oberen Grenze; 90/10-Aufteilung beim passenden Sprecherabschnitt|
|29|18|19|Rechtsseitige Fläche ab unterer Grenze; F und R klar getrennt; echte Spiegelung für R=1−F; Anwendung und Übergang erst zum gesprochenen Bezug|

### Technische und mathematische Prüfungen

- `qa-final/svg-qa-report.md`: 0 Fehler; strenge Design- und Layoutprüfung
  über 18 SVGs und 81 automatisch geprüfte Layoutzustände ohne Befund.
  Der umfassendere Modulscan umfasst 74 SVGs und 48 Manifeste. Seine 22 Warnungen
  betreffen ausschließlich bewusst nicht im Format 16:9 angelegte Plotassets
  (elf davon aus dieser Revision); alle sieben Inhaltsfolien bleiben 1920×1080.
- `animation-plan-validation.json`: sieben gültige Pläne, 0 Fehler.
  Je eine dokumentierte Warnung zum anfangs unsichtbaren Inhalt: der Player stellt
  den Szenentitel, erste Inhalte erscheinen mit der ersten fachlichen Phrase.
  Cue-Occurrences sind explizit; die Phrase „Umgekehrt gilt: Je größer“ enthält
  einen hinreichend langen eindeutigen Bezug. Keine Wirkung vor Einführung.
- Bestehender Test `node --test tools/re3-transparent-content.test.js`: 6/6
  bestanden; transparente Inhalte, Quellabdeckung, Sprechertextaufteilung und
  kritische fachliche Inhalte erhalten. Erwartungen der drei neu gestalteten
  Bereichsfolien auf ihre gleichbedeutenden sichtbaren Beschriftungen aktualisiert.
- Originales SVG-/Sprechertextmapping: 72 Zuordnungen, ein Dokument, 0 Fehler,
  0 Warnungen. Originaltexte und Original-SVGs wurden nicht geändert.
- `density-math-check.json`: zehn berechnete Quantile kontrolliert;
  sechs Dichteflächen numerisch integriert, jeweils 0,9 innerhalb 10⁻⁷;
  Spiegelbeziehung F/R geprüft. Beta(3,7) für F und Beta(7,3) für R sind
  illustrative Modelle, keine behaupteten Messreihen. Daten und Seeds liegen lokal.
- Browserprüfung mit lokalem Chromium. Geprüft wurden diskrete Zustände und
  wortgetreue Triggerzuordnungen; keine durchgehende Wiedergabe mit Audio.

### Inhaltlicher Crosscheck und manuelle Auflösung

Alle sieben aktuellen Crosschecks: 0 Fehler, keine unbelegten Zieltexte.
Die Rohberichte behalten ihren automatischen Status `review_required`.
Die folgenden Textvergleichswarnungen wurden anhand der Originalbilder, der
Sprecherabschnitte und der End-/Zwischenzustände manuell aufgelöst; dokumentiert
in `content-review.json` in der Renderwurzel.

- 15 (6 Warnungen): globaler Titel gehört zum Player; „Kumulierter Ausfall“ ist
  als Ausfallwahrscheinlichkeit F(t) beschriftet; die beiden Vertrauensgrenzen
  sind mit 5/95 % unmittelbar an den Kurven und zusätzlich in der Legende benannt.
- 17 (77): wiederholte Titel, feine Achsen-Zwischenwerte und längere Quellsätze.
  Die illustrativen Achsen bleiben logarithmisch/Weibull-transformiert, die Einheit
  10⁶ LC bleibt erhalten. Weniger Ticks ändern keine Messwerte. Aussagewahrscheinlichkeit,
  zwei Grenzen und Stichprobenschätzung sind sichtbar; der gesprochene Originaltext
  bleibt vollständig. Die Visualisierung vermeidet eine zusätzliche Behauptung,
  dass exakt 90 % beliebig gezeichneter Ersatzgeraden vollständig im Band lägen.
- 20 (62): ebenfalls Titel und überzählige Achsen-Zwischenwerte; Quellabsätze werden
  durch die beiden konkreten Vergleiche und knappe Merksätze vermittelt. 90 % mit
  5/95 %, 80 % mit 10/90 %, beide Grenzen, Basisfit, Stichprobenumfang und
  Fehlentscheidungsrisiko sind enthalten.
- 23 (21): Text im extern eingebetteten akzeptierten Plot wird nicht vollständig
  extrahiert. Das Plotasset ist unverändert, seine Herkunft und sein SHA-256 stehen
  in den lokalen Daten. Mediane und 50/50-Lage werden rechts erklärt. Die
  50/50-Aussage ist visuell auf einen Zeitpunkt begrenzt, nicht auf die gemeinsame
  Lage einer gesamten zufälligen Kurve; der Sprechertext wurde nicht umgeschrieben.
- 24 (3): ausschließlich der wiederholte globale Titel der Quellen 24–26.
- 27 (9): Titel und lange Quellsätze zum Prozentvergleich. Die tatsächlichen
  Flächen, P_A=90 %, obere 90-%-Grenze sowie zweiseitige 5/95-%-Grenzen tragen
  denselben Vergleich im Bild.
- 29 (14): Titel, grammatische Varianten von „zweiseitig/rechtsseitig“ sowie
  „90“ innerhalb mathematischer Glyphenpfade. Die P_A-Formeln sind korrekt sichtbar;
  drei beschriftete Dichteplots zeigen Grenzen und Anwendungsunterschied.

### Übernommenes Feedbackwissen

Plotgröße nach Erklärfunktion, ruhige sichtbare CI und Schutz vollständiger
Achsenbeschriftungen sind in `workflow/34-slide-redesign/slide-redesign-workflow.md`
ergänzt. Die Behandlung von Dichteflächen, Quantilen und F/R-Spiegelung steht in
`workflow/31-python-plots/diagram-guidelines.md`. Der reproduzierbare Generator
ist in der Python-Plotbibliothek registriert. Keine Nutzerfreigabe oder finale
Sperre vorweggenommen.
