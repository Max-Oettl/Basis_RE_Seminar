# RE2 – Feedback-Audit kompakte Schrittübersichten

Stand: 27.08.2026

## Beobachtung

Die wiederkehrenden FTA- und FMEA-Schrittübersichten waren auf Detail- und Fortsetzungsszenen zu groß und visuell zu prägnant. Der eigentliche Szeneninhalt verlor dadurch an Hierarchie. In der siebenstufigen FMEA-Navigation war der aktuelle Schritt zudem nicht überall eindeutig in der Education-Fokusfarbe erkennbar.

## Ursache

Beide zentralen Prozesskomponenten verwendeten große, vollflächig dunkle Karten. Ihre Geometrie war eher für eine dominante Prozessfolie als für eine dauerhafte Navigationshilfe ausgelegt. Die FMEA-Komponente verwendete für den aktiven Schritt außerdem einen älteren Sekundärfarbwert statt des kanonischen Signalgrüns.

## Korrektur

- Die fünfstufige FTA- und die siebenstufige FMEA-Komponente wurden zentral verkleinert.
- Alle Schrittbezeichnungen, Nummern und Reihenfolgen bleiben vollständig erhalten.
- Inaktive Schritte erscheinen als ruhige helle Flächen mit marineblauer Kontur und Beschriftung.
- Der aktuelle Schritt verwendet in beiden Komponenten konsequent Signalgrün `#00A653` mit weißer Schrift.
- Verbinder, Radien und Strichstärken wurden proportional reduziert.
- Bestehende Animationsziele und Sprechertexttrigger bleiben unverändert; statische Navigationsleisten erhalten keine neuen Trigger.

## Reichweite

`module_pattern` für alle wiederkehrenden Schrittübersichten in RE2.

## Übertragbare Regel

Eine wiederkehrende Schrittübersicht ist auf Detail- und Fortsetzungsszenen ein untergeordneter Orientierungsrahmen. Sie bleibt vollständig lesbar, darf aber die dominante Lernbotschaft nicht überstimmen. Der aktuelle Schritt wird konsistent signalgrün markiert.

## Aktualisierte Schubladen

- Zentrale FTA-Komponente in `tools/generate-re2-chapter3-full-slide-redesign.js`
- Zentrale FMEA-Komponente in `tools/generate-re2-chapter4-full-slide-redesign.js`
- Projektregel in `.agents/skills/redesign-reltest-slides/references/review-derived-design-rules.md`

## Verifikation

- 39 statische Endzustände und 141 Animationszustände wurden neu gerendert.
- Je ein FTA- und FMEA-Pilot wurde zusätzlich in 960×540 geprüft; alle Schrittbezeichnungen bleiben lesbar.
- Drei Kontaktbögen wurden auf konsistente Größe, Farbrolle, aktuellen Schritt und Kollisionen geprüft.
- Der lange FTA-Schritt `Unerwünschtes Ereignis und Ausfallkriterien` wurde im Initialzustand gezielt kontrolliert und besitzt ausreichenden Innenabstand.
- Strenge SVG-, Design-, Handoff- und Animations-Layout-QA für alle 39 Szenen: 0 Fehler.
- Verbleibende globale Warnung: bestehendes nicht-16:9-ViewBox-Format des eingebetteten Badewannenkurven-Plots in `slide_003`; nicht Teil dieser Änderung.

Prüfartefakte: `analysis/render-checks/RE2/compact-step-overviews-2026-08-27/`
