# RE3 · Szene 2 · Feedback-Audit

Datum: 28.08.2026  
Reichweite: `module_pattern`

## Befund

Die bisherige Neufassung verdichtete die sieben Quellzustände 2–8 zu einer abstrakten Fünf-Schritt-Liste und einem bereits fertigen Weibullnetz. Dadurch waren drei fachlich notwendige Zwischenzustände nicht mehr sichtbar:

- die sortierten Ausfallzeiten `t₁` bis `t₇` auf einer reinen Zeitachse,
- die Erweiterung um die y-Achse der Ausfallwahrscheinlichkeit,
- die explizite Zuordnung jedes Wertepaares `(tᵢ, F(tᵢ))`.

Zusätzlich war die Median-Rank-Gleichung nur als Textzeile statt als gesetzte mathematische Formel ausgeführt.

## Quellenabgleich

- Quellfolie 2: sortierte Ausfallzeiten auf der Zeitachse.
- Quellfolie 3: y-Achse, Median-Rank-Formel sowie Definition von `i` und `n`.
- Quellfolien 4–5: sieben Zuordnungen und Punkte `F(t₁)` bis `F(t₇)`.
- Quellfolie 6: Übertragung in das Weibull-Wahrscheinlichkeitspapier und Ausgleichsgerade.
- Quellfolie 7: Ablesen von `T` und `b`.
- Quellfolie 8: Weibull-Funktion und Zahlenbeispiel `T = 8`, `b = 3`, `F(10) ≈ 85,8 %`.

## Umsetzung

- Schritt 1 zeigt das Sortierprinzip mit einem bewusst gekürzten Zeitachsenausschnitt `t₁ ≤ t₂ ≤ … ≤ tₙ`.
- Schritt 2 zeigt die Median-Rank-Formel als kontrolliertes, kompakt skaliertes Formel-SVG und erklärt `i` und `n` direkt daneben.
- Schritt 3 zeigt für `n = 7` alle sieben berechneten Wertepaare in einer achsenfreien Zuordnungsliste. Dadurch entsteht noch kein zweites, vereinfachtes Weibullnetz.
- Die Wahrscheinlichkeiten werden dort fachlich eindeutig als `F(t₁)` bis `F(t₇)` bezeichnet; `tᵢ` allein bleibt die Bezeichnung des Ausfallzeitpunkts.
- Schritt 4 überträgt dieselben Wertepaare in das einzige und deutlich größere Weibullnetz der Szene. Die sieben x-Achsenpositionen sind direkt mit `t₁` bis `t₇` beschriftet.
- Das Weibullnetz verwendet eine schmalere Plotfläche und eine ausgedünnte y-Achse. Die didaktisch relevanten Stützwerte inklusive `63,2 %` bleiben erhalten; die im oberen Skalenbereich kollidierenden Zusatzwerte entfallen.
- Die Ausgleichsgerade wird erst mit ihrer Sprechertextpassage eingezeichnet.
- Schritt 5 ergänzt erst danach die Parameterinterpretation.
- Der Ergebniszustand enthält die allgemeine Weibull-Funktion und das Zahlenbeispiel der Quelle in einer ruhigen Auswertungsspalte statt in einem dominanten Ergebnisbalken.

## Übertragbare Regel

Wenn mehrere Quellfolien eine technische Herleitung aufbauen, darf die Zusammenführung die Zwischenzustände nicht in eine reine Prozessliste umwandeln. Ausgangsachse, Achsenerweiterung, Formel, Wertepaarbildung, Plot, Fit und Parameterablesung bleiben als eigene semantische Animationsgruppen erhalten, sofern sie im Sprechertext einzeln erklärt werden.

## Nachweis

- Ziel-SVG: `rebuild-proposals/svg/RE3/slide_002/slide_002.svg`
- Animationsmanifest: `rebuild-proposals/svg/RE3/slide_002/scene.animation.v1.json`
- Dramaturgieplan: `rebuild-proposals/svg/RE3/slide_002/animation-dramaturgy-plan.json`
- Formelassets: `rebuild-proposals/svg/RE3/slide_002/formulas/`
- Plotassets: `rebuild-proposals/svg/RE3/slide_002/plots/`
- Rendervergleich: `analysis/render-checks/RE3/scene-002-feedback/`
