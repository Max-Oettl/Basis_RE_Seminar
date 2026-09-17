# Redesign-Brief – RE2 Szene 7 / Quellfolie 10

## Identität

- Modul: RE2
- Zielszene / Scene_ID: `re2_ch2_ishikawa`
- Viewer-Szenennummer: 7
- Technische Arbeitseinheit: `slide_010`
- Quellfolien: `source-materials/basis-seminar/powerpoint-svg/RE2/SVG/Folie10.SVG`
- Sprechertext: `section_007` aus der Einführung in qualitative Methoden
- Umfang: `single_slide`
- Ausgabemodus: `content_svg`
- Zielsystem: Basis-Rebuild-Viewer / Downstream-Seminarfolie
- Zielauflösung: 1920×1080

## Inhalts- und Beziehungsinventar

| Quellelement | Klassifikation | Zielbehandlung |
| --- | --- | --- |
| Fischgräten-Hauptachse mit Wirkung rechts | `must_preserve` | als dominante zusammenhängende Ursache-Wirkungs-Geometrie erhalten |
| Fischkopf `Leistungsverlust der PV-Anlage` | `must_preserve` | wieder als Kopf bzw. Pfeilspitze der Fischgräte, nicht als unabhängige Karte |
| Materialien mit zwei Beispielen | `must_preserve` | obere Gräte mit `Qualität elektrischer Bauteile` und `Verkabelung` |
| Maschinen (Ausrüstung) mit zwei Beispielen | `must_preserve` | obere Gräte mit `Montagestruktur` und `Überwachungssysteme` |
| Mensch mit zwei Beispielen | `must_preserve` | obere Gräte mit `Fehler bei der Installation` und `Wartungsfehler` |
| Methoden mit zwei Beispielen | `must_preserve` | untere Gräte mit `Standards bei Installation` und `Wartungsintervalle und -protokolle` |
| Milieu (Umwelt) mit zwei Beispielen | `must_preserve` | untere Gräte mit `Wetterbedingungen` und `Schattenwurf durch Objekte` |
| horizontale Beispielpfeile in die Hauptgräten | `reframe` | ruhige, eindeutige Zuführungen mit kleinen proportionalen Pfeilspitzen |
| alte PowerPoint-Titel-, Logo- und Lautsprecherelemente | `decorative_remove` | downstream bzw. vollständig entfernt |
| Leserichtung rechts nach links | `target_addition` | als dezente, vom Sprechertext belegte Richtungsannotation am Ende einblendbar |

## Lernbotschaft und Archetyp

- Dominante Aussage: Das Ishikawa-Diagramm ordnet konkrete Ursachen eines PV-Leistungsverlusts in fünf M-Kategorien und führt sie sichtbar auf eine gemeinsame Wirkung zurück.
- Erkenntnis nach 3–5 Sekunden: Die Darstellung ist sofort als Fischgräten-Diagramm mit fünf Kategorien und einer Wirkung erkennbar.
- Primärer Archetyp: `SVG-Diagramm`
- Verworfen: freie Karten- oder Textmatrix; sie zerstört die fachliche Beziehungstopologie der Quelle.

## Komposition

- Transparenter Content-SVG-Canvas ohne sichtbaren Mastertitel, Footer, Logo oder Hintergrund.
- Eine große horizontale Fischgräte in der Inhaltsmitte.
- Drei obere Gräten: Materialien, Maschinen, Mensch.
- Zwei untere Gräten: Methoden, Milieu (Umwelt).
- Jede Kategorie bleibt eine atomare Einheit aus Kategorienband, Hauptgräte, zwei Beispielzuführungen und vollständigen Labels.
- Die Wirkung bildet den geometrischen Fischkopf am rechten Ende.
- Marineblau trägt die Diagrammstruktur; Koralle markiert ausschließlich die negative Wirkung.

## Animation

- Entscheidung: `animated`
- Statisches Gate: `passed`; vollständiger Endzustand wurde direkt gegen die Quelle in 1920×1080 und verkleinerter Ansicht geprüft.
- `ishi_framework`: Hauptachse, Schwanz und Wirkung erscheinen gemeinsam bei der erstmaligen Nennung des Leistungsverlusts.
- Die fünf Kategorien erscheinen danach in Sprechertextreihenfolge als vollständige Gruppen.
- `ishi_reading_direction`: erscheint erst bei der ausdrücklichen Erklärung der Leserichtung.
- Keine Verbindung ist vor ihren fachlichen Endpunkten sichtbar.

## QA-Schwerpunkte

- Quellennahe Fischgräten-Topologie und exakte Verteilung 3 oben / 2 unten.
- Alle fünf Kategorien und alle zehn sichtbaren Beispiele vorhanden.
- Keine verdichtenden Punktketten als Ersatz für getrennte Quellbeispiele.
- Fischkopf und Hauptachse als zusammenhängende Wirkungskette lesbar.
- Kategorie- und Beispieltexte bei 960×540 lesbar und kollisionsfrei.
- Linien 1,5–4 px; maximal 6 px, proportionale Pfeilspitzen.
- Content-Crosscheck in beide Richtungen sowie strenge Design-/Layout-QA.
- Ergebnis: 0 Fehler; die fünf lexikalischen Hinweise betreffen den downstream erzeugten Quelltitel sowie die in der Quelle falsch geschriebene Form `Mileu`, die anhand des Sprechertexts korrekt als `Milieu` gesetzt wurde.
