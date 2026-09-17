# Feedback-Audit — RE2 Szene 19

## Einordnung

- Beobachtung: In Szene 19 waren die kritischen Pfade und die minimalen Ausfallschnitte nicht konkret dargestellt.
- Ursache: Der Generator hatte den Abschlusszustand der Quellfolie 56 auf eine allgemeine Textbox zu Minimalschnitten reduziert. Die Pfadgeometrie, die Zuordnung der Reifenpaare und ein eigener Sprechertext-Beat für die kritischen Pfade fehlten.
- Korrekturumfang: `local_fix` für die zusammengeführte Fahrwerksszene `slide_052`; keine Änderung einer projektweiten Designregel.

## Korrektur

- Drei kritische Pfade in Stahlcyan ergänzt. Jeder Pfad beginnt bei den beiden Basisereignissen einer Fahrwerksgruppe, führt über das UND-Gatter und die Fahrwerksgruppe zum ODER-Gatter und endet am Top-Ereignis.
- Drei minimale Ausfallschnitte direkt unter den zugehörigen Reifenpaaren ergänzt:
  - `M1 = {HL1, HL2}`
  - `M2 = {B1, B2}`
  - `M3 = {HR1, HR2}`
- Die bisherige generische Textbox durch Klammern, M1–M3-Kennzeichnungen und eine kompakte Mengendarstellung ersetzt.
- Generator, Ziel-SVG, internes Manifest, Elementplan, Dramaturgieplan und zentraler RE2-Szenenplan gemeinsam aktualisiert.

## Inhalts-Crosscheck

| Quelle | Übernommener Inhalt | Ergebnis |
|---|---|---|
| Folie 52 | Flugzeug, drei Fahrwerksgruppen, je zwei Reifen | bestanden |
| Folie 53 | Bugrad-Ausfall über beide B-Reifen und UND-Gatter | bestanden |
| Folie 54 | Linkes Hauptfahrwerk über HL1 und HL2 | bestanden |
| Folie 55 | Rechtes Hauptfahrwerk über HR1 und HR2 | bestanden |
| Folie 56 | Drei kritische Pfade und drei minimale Ausfallschnitte | bestanden |
| Sprechertext Abschnitt 008 | Pfadidentifikation und Definition des minimalen Ausfallschnitts | bestanden |

Es wurden keine neuen fachlichen Aussagen ergänzt. Die Bezeichner `M1` bis `M3` machen lediglich die drei in Quelle und Sprechertext bereits enthaltenen Kombinationen explizit.

## Animation

1. Flugzeug und Fahrwerksgruppen erscheinen beim ersten Beispielbezug.
2. Ereignisse und Gatter erscheinen beim gemeinsamen Aufbau des Fehlerbaums.
3. Grundverbindungen werden nach ihren Knoten gezeichnet.
4. Die drei kritischen Pfade werden bei ihrer Nennung gezeichnet.
5. M1–M3 erscheinen mit der Definition der minimalen Ausfallschnitte.

## Verifikation

- Statischer Render: `analysis/render-checks/RE2/scene-019-critical-paths/after-static/slide_052.png`
- Animationszustände: `analysis/render-checks/RE2/scene-019-critical-paths/animation-states/slide_052/`
- Animationsplan-Validator: 0 Fehler, 0 Warnungen
- Finale strikte SVG-, Design- und Layout-QA: 0 Fehler; 0 Designwarnungen; 0 Layoutbefunde
- Verbleibende globale Warnung: Das eingebettete Diagramm `slide_003/plots/bathtub_curve.svg` besitzt bewusst kein folienförmiges ViewBox-Verhältnis und liegt außerhalb des Korrekturumfangs.

