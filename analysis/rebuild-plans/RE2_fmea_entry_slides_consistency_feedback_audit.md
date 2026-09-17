# RE2 – Feedback-Audit FMEA-Eingangsfolien

Stand: 27.08.2026

## Beobachtung

Die Eingangsfolien der sieben FMEA-Schritte waren nicht als geschlossene Serie erkennbar. Die Schritte 3 bis 7 verwendeten den Archetyp `step-transition-preview` mit kompakter Schrittübersicht, großem Nummernanker, Schrittbezeichnung und fachlicher Vorschau. Schritt 1 war beim Zusammenfassen der Quellzustände 72–74 als eigene Eingangsfolie entfallen. Schritt 2 verwendete in `slide_078` noch eine ältere, großformatige Pfeildarstellung.

## Ursache

- Die Quellzustände 72–74 waren als eine einzige fachliche Szene zusammengezogen worden. Dadurch blieb zwar der Fachinhalt erhalten, die für den roten Faden relevante Eingangsszene zu Schritt 1 jedoch nicht.
- Für Schritt 2 wurde eine individuelle Prozesspfeil-Variante statt der zentralen Übergangskomponente verwendet.
- Die Sequenzprüfung kontrollierte die Vollständigkeit der Fachinhalte, aber nicht zusätzlich die vollständige Besetzung jedes wiederkehrenden Übergangsarchetyps.

## Korrektur

- `slide_072` ist nun die einheitliche Eingangsfolie zu **1. Schritt – Planung und Vorbereitung**.
- Der bisherige Fachinhalt zu Analyseumfang, Unterlagen und Teamvorbereitung wurde verlustfrei in die neue Folgeszene `slide_074` verschoben.
- `slide_078` verwendet nun dieselbe Eingangsfolien-Komponente für **2. Schritt – Strukturanalyse**.
- Die Schritte 1 bis 7 verwenden damit durchgehend:
  - denselben kompakten siebenstufigen Navigationsrahmen,
  - den aktuellen Schritt in Signalgrün `#00A653`,
  - `ALS NÄCHSTES`, zweistellige Nummer und `VON 07`,
  - dieselbe Zweispaltenhierarchie mit fachlicher Vorschau rechts,
  - den statischen Modus ohne künstlichen Ganzfolien-Reveal.
- Der bestehende Sprechertext wurde ohne Neutextung auf Eingang Schritt 1, Analyseumfang, Team und Übergang zu Schritt 2 verteilt. Die Quellfolien 1–165 bleiben genau einmal abgedeckt.
- Die Viewer-Kuration wurde auf 69 sichtbare, inhaltlich vollständige Arbeitseinheiten aktualisiert.

## Reichweite

`module_pattern` für wiederkehrende Eingangs- und Brückenszenen mehrstufiger Vorgehensmodelle.

## Übertragbare Regel

Ein wiederkehrender Übergangsarchetyp muss für jede Stufe vollständig und in identischer Hierarchie vorhanden sein. Zusammenfassungen dürfen den fachlichen Inhalt neu gruppieren, aber keine für Orientierung und roten Faden notwendige Eingangsszene entfernen.

## Verifikation

- Alle sieben Eingangsfolien `slide_072`, `slide_078`, `slide_090`, `slide_096`, `slide_111`, `slide_127` und `slide_131` besitzen `slideType=step-transition-preview` und leere statische Animationsmanifeste.
- `slide_074` und `slide_075` wurden mit ihren vollständigen Sprechertext-Reveals zustandsweise gerendert; kein Fragment und kein vorgezogener Verbinder bleibt sichtbar.
- Szenenplan: 69 Szenen, 165 Quellfolien genau einmal abgedeckt, 0 Fehler und 0 Warnungen.
- Viewer-Tests: 4 von 4 bestanden.
- Strenge SVG-, Design- und Layout-QA: 0 Fehler, 0 Designwarnungen.
- Verbleibende globale Warnung: bestehendes nicht-16:9-ViewBox-Format des eingebetteten Badewannenkurven-Plots in `slide_003`; nicht Teil dieser Änderung.

Prüfartefakte: `analysis/render-checks/RE2/fmea-entry-consistency-2026-08-27/`
