# Redesign-Brief — RE2 Szene 19: kritische Pfade und minimale Ausfallschnitte

## Scope

- Zielszene: Szene 19 / Work-Unit `slide_052`
- Szene-ID: `re2_ch3_fta_aircraft_landing_gear`
- Quellfolge: Folien 52–56; Primär- und Renderzustand: Folie 56
- Ausgabe: transparentes Content-SVG im 1920×1080-Koordinatensystem
- Änderungstyp: lokale fachliche Vervollständigung der bestehenden Fahrwerksszene

## Inhaltsinventar und Lernziel

- Das Flugzeugmotiv, die drei Fahrwerksgruppen und der vollständige Fehlerbaum bleiben erhalten.
- Drei kritische Pfade müssen von den UND-Gattern über die jeweilige Fahrwerksgruppe und das ODER-Gatter bis zum Top-Ereignis eindeutig verfolgbar sein.
- Die drei kleinsten auslösenden Kombinationen werden direkt den Reifenpaaren zugeordnet: `M1 = {HL1, HL2}`, `M2 = {B1, B2}`, `M3 = {HR1, HR2}`.
- Die bisherige abstrakte Textbox zu Minimalschnitten wird durch konkrete Klammern, Kennzeichnungen und die Mengendarstellung ersetzt.
- Lernbotschaft: Der gleichzeitige Ausfall beider Reifen genau einer Fahrwerksgruppe genügt für den Ausfall des gesamten Bugradfahrwerks.

## Visuelle Entscheidung

- Marineblau bleibt Grundfarbe des Fehlerbaums; Koralle kennzeichnet weiterhin das unerwünschte Top-Ereignis.
- Stahlcyan wird als sparsame technische Hervorhebungsfarbe für Pfade, Ringe, Klammern und Mengenkennzeichnungen verwendet.
- Die Hervorhebung folgt der bestehenden Topologie und überdeckt keine Ereignisbeschriftungen.
- Native SVG-Geometrie ist für Pfade, Klammern und Labels geeigneter als ein zusätzliches Bild-Asset; es werden keine neuen Piktogramme benötigt.

## Animationsdramaturgie

| Reihenfolge | Semantische Gruppe | Aktion | Sprechertextanker |
|---:|---|---|---|
| 1 | Flugzeug und Fahrwerksgruppen | Einblenden | „Hierzu betrachten wir das Bugradfahrwerk eines Flugzeuges …“ |
| 2 | Ereignisse und Gatter | Einblenden | „Fangen wir nun an den Fehlerbaum gemeinsam zu erstellen.“ |
| 3 | Grundbeziehungen | Zeichnen | „Daher verbinden wir die Ausfälle der Reifen … mit einem Und-Gatter.“ |
| 4 | Drei kritische Pfade | Zeichnen | „Nun können wir die kritischen Pfade identifizieren …“ |
| 5 | Drei minimale Ausfallschnitte | Einblenden | „Jede Kombination von zwei ausgefallenen Reifen stellt demnach einen minimalen Ausfallschnitt dar.“ |

Die Animation wird erst nach der statischen Layoutfreigabe erzeugt. Verbindungen erscheinen nicht vor ihren Knoten.

## Prüfschwerpunkte

- Pfadtopologie gegen Quellfolie 56 prüfen.
- Eindeutige Zuordnung der Klammern zu HL-, B- und HR-Reifenpaaren prüfen.
- Lesbarkeit der Mengenbezeichnungen bei 1920×1080 und reduziertem Maßstab prüfen.
- Anfangszustand, Zwischenzustände und Endzustand der Animation prüfen.
- Keine Masterelemente, keine unzulässige Vollfläche und keine Überlagerung von Text durch Konnektoren.

## Evidenz

- Vorher-Render Zielszene: `analysis/render-checks/RE2/scene-019-critical-paths/before-target/slide_052.png`
- Quellen 52–56: `analysis/render-checks/RE2/scene-019-critical-paths/before-source/`
- Nachher-Render: `analysis/render-checks/RE2/scene-019-critical-paths/after-static/slide_052.png`

## Status

- Brief: abgeschlossen
- Statische Freigabe: bestanden; strikte Layout- und Designprüfung ohne Befund
- Animationsfreigabe: bestanden; fünf semantische Zustände, Manifestvalidierung 0 Fehler / 0 Warnungen
