# RE2 Szene 6 – P-Diagramm des Wechselrichters

## Identität

- Modul: RE2
- Zielszene / Scene_ID: Szene 006 / `re2_ch2_p_diagram_inverter`
- Work Unit: `slide_009`
- Quellfolie: `Folie9.SVG`
- Sprechertextquelle: RE2 SVG-Text-Mapping für Quelle 009
- Ausgabemodus: `content_svg`
- Zielauflösung: 1920 × 1080

## Nutzerfeedback und Fehlerbild

- Die aktuelle Szene wirkt gestalterisch nicht hochwertig genug.
- Die bisherigen generischen Rollen-Piktogramme werden ersetzt.
- Gleichstrom und Betätigungsenergie wurden fälschlich zu einem einzigen linken Eingang reduziert.
- Kontrollierbare Größen und Störgrößen wurden zu Sammelzeilen verdichtet; dadurch gingen die einzelnen Einflusskanäle und ihre Richtungen verloren.

## Inhaltsinventar

| Quellelement | Klassifikation | Zielbehandlung | Beleg |
| --- | --- | --- | --- |
| Wechselrichter innerhalb der Systemgrenze | `must_preserve` | zentrales Systemmotiv | Quellfolie 009 |
| Gleichstrom (DC) | `must_preserve` | eigener linker Eingangskanal | Quelle, Sprechertext, Nutzerfeedback |
| Betätigungsenergie | `must_preserve` | eigener linker Eingangskanal zur SOS-/Steuereinheit | Quelle, Sprechertext, Nutzerfeedback |
| Signal | `must_preserve` | eigener kontrollierbarer Einfluss von unten | Quelle, Sprechertext |
| Wechselstrom (AC) | `must_preserve` | eigener rechter Ausgangskanal | Quelle, Sprechertext |
| Vibration | `must_preserve` | eigene Störgröße von oben | Quelle, Sprechertext |
| Schmutz | `must_preserve` | eigene Störgröße von oben | Quelle, Sprechertext |
| Wärme | `must_preserve` | eigene Störgröße von unten | Quelle, Sprechertext |
| Feuchtigkeit | `must_preserve` | eigene Störgröße von unten | Quelle, Sprechertext |
| SOS-Komponente und interne Signalbeziehung | `reframe` | kompakter technischer Innenknoten mit sichtbarer Beziehung zum Wechselrichter | Quellfolie 009 |
| PowerPoint-Titel und Masterelemente | `decorative_remove` | verbleiben im Downstream-Master | Ziel-SVG-Vertrag |

## Lernbotschaft

Der Wechselrichter steht im Zentrum eines P-Diagramms. Unterschiedliche Größen wirken über klar getrennte Kanäle auf das System ein; Wechselstrom verlässt es als Zielgröße.

## Komposition

- Offene technische Kreuzlogik statt Rollen-Karten.
- Systemgrenze zentral und dominant.
- Links zwei getrennte Einflüsse: Gleichstrom und Betätigungsenergie.
- Oben zwei einzelne Störgrößen: Vibration und Schmutz.
- Unten zwei einzelne Störgrößen sowie das getrennte Signal: Wärme, Feuchtigkeit und Signal.
- Rechts Wechselstrom als Ziel-/Ausgangsgröße und anschließende Weiterleitung.
- Marineblau trägt die Grundordnung. Stahlcyan markiert Energie, Signalgrün steuerbare Einflüsse und Koralle Störgrößen; die Akzentflächen bleiben klein.

## Assets

Alle neuen Piktogramme werden als transparente PNGs im Profil `reltest-education-minimal-v1` erzeugt. Es entstehen acht einzelne Motive: Gleichstrom, Betätigungsenergie, Signal, Vibration, Schmutz, Wärme, Feuchtigkeit und Wechselstrom. Der vorhandene, bereits freigegebene Wechselrichter bleibt als konkretes Produktmotiv erhalten.

## Animation

- `pi_system`: Systemgrenze, Wechselrichter und technische Innenknoten.
- `pi_inputs`: Gleichstrom mit lokalem Eingangspfeil.
- `pi_controls`: Betätigungsenergie und Signal als getrennte steuerbare Einflüsse.
- `pi_disturbances`: vier einzeln lesbare Störgrößen mit ihren lokalen Pfeilen.
- `pi_outputs`: Wechselstrom mit lokalem Ausgangspfeil.
- `pi_relations`: Weiterleitung zu Stromnetz und Verbrauchern.

Die bestehenden Sprechertrigger bleiben erhalten. Jeder fachliche Verbinder erscheint atomar mit seinen Endpunkten; die finale Weiterleitung wird erst nach der Ausgangsgröße gezeichnet.

## QA-Schwerpunkte

- Alle neun Quellgrößen beziehungsweise -rollen sind im Endzustand einzeln lesbar.
- Gleichstrom und Betätigungsenergie besitzen zwei getrennte linke Einflusspfeile.
- Vibration, Schmutz, Wärme und Feuchtigkeit sind weder textlich noch grafisch zusammengezogen.
- Pfeile bleiben auch in der 960×540-Ansicht als Schaft plus Spitze erkennbar.
- Piktogramme bestehen den 48-px- und Szenenrender-Test.
- Keine sichtbare globale Überschrift im Content-SVG.

