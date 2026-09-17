# RE2 – Feedback-Audit Schrittübersicht in Szenen 20 und 21

Stand: 27.08.2026

## Beobachtung

In den Viewer-Szenen 20 (`slide_038`) und 21 (`slide_044`) fehlte die bereits eingeführte fünfstufige FTA-Schrittübersicht. Beide Szenen gehören weiterhin zum vierten Schritt „Fehlerbaum erstellen“.

## Ursache

Beim Zusammenfassen der Quellfolgen wurden die fachlichen Endzustände übernommen, die wiederkehrende Prozessnavigation jedoch nicht als verbindlicher Orientierungsrahmen behandelt.

## Korrektur

- Beide Szenen erhalten dieselbe kompakte FTA-Schrittübersicht wie die angrenzenden Szenen.
- Schritt 4 ist in beiden Szenen mit Signalgrün als aktueller Schritt markiert.
- Die Übersicht ist von Beginn an sichtbar und wird nicht als neuer Fachinhalt animiert, da der Sprechertext Schritt 4 hier nicht erneut ankündigt.
- In Szene 20 wurden Motorschaltung und Fehlerbaum gemeinsam nach unten verschoben, damit Prozessnavigation und technische Grafik klar getrennt bleiben.
- Die bestehenden Sprechertexttrigger und die Reihenfolge der fachlichen Animationen bleiben unverändert.

## Reichweite und übertragbare Regel

Reichweite: `project_rule`

In mehrszenigen Vorgehenssequenzen bleibt die kanonische Schrittübersicht auch auf Detail- und Fortsetzungsszenen sichtbar. Eine fehlende erneute Schrittansage im Sprechertext macht sie zu statischem Kontext und rechtfertigt keinen erfundenen Trigger.

## Aktualisierte Regelablage

Die Regel wurde in `.agents/skills/redesign-reltest-slides/references/review-derived-design-rules.md` ergänzt.

## Verifikation

- Zwei statische Endzustände und neun Animationszustände wurden gerendert und visuell geprüft.
- Beide Initialzustände zeigen die Schrittübersicht mit aktivem Schritt 4; die fachlichen Animationsgruppen bleiben bis zu ihren Sprechertexttriggern ausgeblendet.
- Beide Animationsdramaturgiepläne wurden mit jeweils 0 Fehlern und 0 Warnungen validiert.
- Strenge SVG-, Design-, Handoff- und Animations-Layout-QA: 0 Fehler.
- Verbleibende globale Warnung: bestehendes nicht-16:9-ViewBox-Format des eingebetteten Badewannenkurven-Plots in `slide_003`; nicht Teil dieser Änderung.

Prüfartefakte: `analysis/render-checks/RE2/scenes-020-021-step-overview-2026-08-27/`
