# Redesign-Brief: RE2 Viewer-Szene 10 – Funktionsstruktur des Wechselrichters

## Zuordnung und Modus

- Viewer-Szene: 10
- Scene_ID: `re2_ch2_function_structure`
- Technische Arbeitseinheit: `slide_014`
- Quellzustände: Folien 14, 15 und 16
- Primärer Endzustand: Folie 16
- Ausgabemodus: `content_svg`, 1920 × 1080, transparenter Hintergrund
- Downstream-Master: sichtbarer Folientitel, Footer, Logo und Szenenkennung bleiben außerhalb des SVGs

## Dominante Lernbotschaft

Die detaillierte Funktionsstruktur des Wechselrichters ist die aufgeklappte Zerlegung seiner Hauptfunktion: Gleichstrom in Wechselstrom umzuwandeln.

## Quelleninventar

| Quellinhalt | Entscheidung |
| --- | --- |
| Eingangsgröße → Funktion → Ausgangsgröße | beibehalten und am Wechselrichter konkretisieren |
| Hauptfunktion `Umwandlung DC-Strom in AC-Strom` | als obere Übersichtsebene dominant darstellen |
| Zwei Aufklapplinien von der Hauptfunktion zur Detailstruktur | als zentrale Hierarchiebeziehung beibehalten |
| Gestrichelte Begrenzung der Detailstruktur | beibehalten |
| Teilfunktionen (1), (2), (4), (5), (8) im Energiepfad | vollständig und in Quellreihenfolge beibehalten |
| Teilfunktionen (3), (7), (6) unterhalb des Energiepfads | vollständig und mit ihren Signalbeziehungen beibehalten |
| DC-/AC-Stromlabels an den Schnittstellen | beibehalten |
| PowerPoint-Titel, Lautsprecher und altes Logo | entfernen; downstream beziehungsweise nicht fachlich |
| bisheriges Label `SYSTEMGRENZE WECHSELRICHTER` | entfernen; in der Quelle nicht sichtbar belegt |
| bisheriger Merksatz | entfernen; in der konkreten Quellfolie nicht sichtbar belegt |

## Layout und Hierarchie

1. Oben mittig steht die kompakte Hauptfunktionskette mit klaren DC- und AC-Schnittstellen.
2. Zwei diagonale Linien spannen von der Hauptfunktionsbox zur gestrichelten Detailbegrenzung auf.
3. Innerhalb der Detailbegrenzung liegt oben der durchgehende Energiepfad aus fünf nummerierten Teilfunktionen.
4. Darunter liegen MPPT, Netz-Synchronisierung und Netzüberwachung mit ihren gerichteten elektrischen Signalen.
5. Marineblau führt die Grafik; Signalgrün markiert nur die Umwandlungsrichtung beziehungsweise den funktionalen Fokus.

## Animation

- Entscheidung: `animated`
- Schritt 1: Die komplette obere Hauptfunktion erscheint bei der expliziten Wechselrichter-Hauptfunktion.
- Schritt 2: Aufklapplinien, Detailbegrenzung, alle acht Teilfunktionen und sämtliche Beziehungen erscheinen gemeinsam bei der Erklärung der weiteren Aufteilung.
- Keine Verbindung erscheint ohne ihre Endpunkte; der Endzustand bleibt ohne Animation vollständig verständlich.

## QA-Plan

- Quelle 14, 15 und 16 gegen den finalen Zielrender vergleichen.
- Bei 1920 × 1080 und 960 × 540 prüfen, ob obere Übersicht und untere Detailstruktur unmittelbar als Ebenenpaar erkennbar sind.
- Alle acht Nummern, Funktionsnamen, DC-/AC-Stromlabels und Pfeilrichtungen crosschecken.
- Statischen Pilot vor Animation freigeben.
- Danach alle Animationszustände rendern und Manifest sowie Layout streng validieren.

## Statisches Pilot-Gate

- Status: bestanden.
- Nachweis: `analysis/render-checks/RE2/scene-010-redesign/static-pilot/slide_014.png`
- Befund: Obere Hauptfunktion, Aufklapplinien und untere Detailstruktur sind als zusammengehörige Hierarchie eindeutig erkennbar; alle acht Teilfunktionen und Schnittstellen sind lesbar erhalten.
