# RE2 Szene 6 – P-Diagramm Feedback-Audit

## Ergebnis

Szene 6 im Viewer entspricht der Work Unit `slide_009` und der Quellfolie `Folie9.SVG`. Die Szene wurde vollständig neu komponiert; die Quellfolie selbst blieb unverändert.

## Behobene Inhaltsverluste

| Quellinhalt | Vorheriger Befund | Neuer Endzustand |
| --- | --- | --- |
| Gleichstrom (DC) | einziger sichtbarer linker Eingang | eigener Eingangspfeil in den Wechselrichter |
| Betätigungsenergie | in eine Sammelzeile der Kontrollgrößen verschoben | eigener linker Pfeil zum SOS-/Notausschalter-Knoten |
| Signal | mit SOS-Signal und Betätigungsenergie zusammengezogen | eigener kontrollierbarer Einfluss von unten zur Steuerung |
| Vibration | mit Schmutz zusammengezogen | eigenes Piktogramm, Label und eigener Pfeil |
| Schmutz | mit Vibration zusammengezogen | eigenes Piktogramm, Label und eigener Pfeil |
| Wärme | mit Feuchtigkeit zusammengezogen | eigenes Piktogramm, Label und eigener Pfeil |
| Feuchtigkeit | mit Wärme zusammengezogen | eigenes Piktogramm, Label und eigener Pfeil |
| Wechselstrom (AC) | als Ausgang vorhanden, aber visuell eng | eigener Ausgangspfeil, Label und AC-Piktogramm |
| SOS-/Steuerbeziehung | nur textlich angedeutet | sichtbare interne Knoten und Signalverbindung innerhalb der Systemgrenze |

## Neue Piktogrammserie

Acht neue transparente PNGs wurden im Stil `reltest-education-minimal-v1` erzeugt, auf feste RelTest-Farben reduziert und szenenlokal eingebettet:

- Gleichstrom-Eingang
- Betätigungsenergie / Notausschalter
- kontrollierbares Signal
- Vibration
- Schmutz
- Wärme
- Feuchtigkeit
- Wechselstrom-Ausgang

Die Assets liegen wiederverwendbar unter `components/image-library/generated-pictograms/re2-p-diagram-v2/` und lokal im Szenenpaket unter `rebuild-proposals/svg/RE2/slide_009/media/p-diagram-v2/`. Alle acht Release-Validierungen sowie die PNG-Policy-QA melden jeweils `0 Fehler, 0 Warnungen`.

## Inhalts- und Beziehungs-Crosscheck

- Alle in Quelle und Sprechertext genannten Größen sind im Endzustand einzeln sichtbar.
- Gleichstrom und Betätigungsenergie besitzen zwei getrennte linke Wirkungspfade.
- Betätigungsenergie endet am SOS-/Notausschalter-Knoten; das Signal endet an der Steuerung.
- Vibration und Schmutz wirken von oben, Wärme und Feuchtigkeit von unten in die Systemgrenze.
- Wechselstrom verlässt die Systemgrenze und wird anschließend an Stromnetz beziehungsweise Verbraucher weitergeleitet.
- Die Sprecherreihenfolge bleibt erhalten: System → Gleichstrom → Betätigungsenergie und Signal → vier Störgrößen → Wechselstrom → Weiterleitung.

## Visuelle und technische Freigabe

- Quellpreview, alter Zielzustand und finaler Zielzustand wurden direkt verglichen.
- Finaler statischer Render: `analysis/render-checks/RE2/scene-006-redesign-2026-08-28/final/slide_009.png`
- Finale Animationszustände: `analysis/render-checks/RE2/scene-006-redesign-2026-08-28/animation-states-final/slide_009/`
- Strenges SVG-, Design- und Layout-QA: `analysis/qa/RE2/scene-006-redesign-2026-08-28-final/svg-qa-report.md`
- Ergebnis: `0 Fehler, 0 Warnungen`

## Feedback-Reichweite

`local_fix` mit Anwendung bereits bestehender Projektregeln: Quellbegriffe, Pfeilrichtungen, Mengen und Beziehungen dürfen beim Redesign nicht zu Sammelzeilen verdichtet werden, wenn dadurch eigenständige Einflusskanäle verloren gehen. Ein zusätzlicher Workflow-Patch ist nicht erforderlich, weil diese Regel bereits in der Redesign-Referenz und im Content-Transfer-Crosscheck verankert ist.

## Nachkorrektur: sichtbare Textdichte

- Szene(n): Viewer-Szene 6 / Work Unit `slide_009` / Quelle 009
- Nutzerbeobachtung: Das fachlich vollständige P-Diagramm war durch Herkunfts-, Ziel- und Funktionszusätze unnötig textlastig.
- Reproduzierte Ursache: Grafik und unveränderter Sprechertext erklärten dieselben Beziehungen parallel; insbesondere `aus den PV-Modulen`, `für den Notausschalter`, `netzkonforme Energie`, `an Stromnetz / Verbraucher` und interne Zweitzeilen wiederholten bereits gesprochene Inhalte.
- Lokale Korrektur: Sichtbar bleiben nur Kategorien und technische Größen: `Eingangssignale`, `Gleichstrom (DC)`, `Betätigungsenergie`, `Störgrößen` mit vier Einzelbegriffen, `kontrollierbare Größe` mit `Signal` sowie `Ausgangsgröße` mit `Wechselstrom (AC)`. Intern bleiben ausschließlich `SOS-Signal` und `Steuerung`. Die Pfeile, Piktogramme und alle fachlichen Einflusskanäle bleiben erhalten.
- Reichweite: `local_fix`
- Übertragbare Regel: Bei diesem P-Diagramm tragen Grafik und Sprechertext gemeinsam die Erklärung; sichtbare Labels benennen Kategorien und Größen, während Herkunft, Ziel und Funktionsbeschreibung im Sprechertext verbleiben.
- Aktualisierte Schubladen: Ziel-SVG, Redesign-Brief und dieser Szenen-Audit; keine seminarweite Workflow-Erweiterung notwendig.
- Verifikation: finaler Render unter `analysis/render-checks/RE2/scene-006-text-reduction-2026-08-28/final-static/slide_009.png`; sieben Animationszustände unter `analysis/render-checks/RE2/scene-006-text-reduction-2026-08-28/final-animation-states/slide_009/`; direktes strenges QA `0 Fehler, 0 Warnungen`; Viewer-QA für `slide 9` `0 Fehler` und nur ein bereits bestehender, szenenfremder Hinweis zu `slide_003/plots/bathtub_curve.svg`.
