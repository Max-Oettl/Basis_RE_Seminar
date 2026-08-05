# Redesign Decision Guide

## Modusmatrix

| Auftrag | Modus | BrandFrame | Titel/Footer/Logo im Ergebnis |
| --- | --- | --- | --- |
| Vollstaendige Folie neu gestalten | `full_slide` | ja | ja, Logo nur als Originalasset |
| Grafik fuer PowerPoint oder Video-Template | `content_svg` | nein | nein |
| Mehrere Folien oder ganzes Modul | `module_redesign` | pro Zielszene festlegen | pro Zielszene |

## Archetypen

| Archetyp | Einsetzen fuer | Kerngestalt |
| --- | --- | --- |
| Titelfolie | Kapitel- oder Modulstart | zentrierter Display-Titel, warme Akzentlinie, optionale Unterzeile |
| Agenda | 3-6 Themen | bis 3 Punkte einspaltig, ab 4 zweispaltige nummerierte Karten |
| Lernziele | 3-5 beobachtbare Ziele | vertikale Liste, gruene Akzentkante, Nummernbadge |
| Bullet/Kernaussagen | 3-6 kurze Aussagen | `cards` bei echten Einheiten, sonst ruhige `plain`-Liste |
| Definition | Begriff plus Erklaerung | eine dominante Definitionskarte, maximal 3 Detailrollen |
| Key Takeaway | genau eine Kernaussage | zentrierte starke Karte mit warmer linker Kante |
| Workflow/Prozess | echte Reihenfolge | nummerierte Knoten, konsistente Verbinder hinter Karten |
| Media Aside | Bild/SVG plus kurze Einordnung | grosse Medienspalte, schmale Textspalte mit signalgruener Linie |
| SVG-Diagramm | eigenstaendiges Diagrammasset | gross und rahmenlos; Template liefert Frame |
| Vergleich/Do-Don't | symmetrischer Vergleich | 2 gleichgewichtige Spalten, Farbe nur als Zusatzcode |
| Formel/Rechenweg | Formel, Eingaben, Ergebnis | grosser Weissraum, kontrollierter Formelsatz, klare Stufen |
| Daten/Diagramm | fachlicher Plot | marineblaue Achsen, signalgruene Hauptreihe, dezentes Raster |

## Auswahlregeln

- Einen Archetyp nach Lernfunktion waehlen, nicht nach vorhandener PowerPoint-Geometrie.
- Keine offensichtlich sichtbare Gruppenueberschrift wiederholen, wenn die Gruppen bereits eindeutig benannt sind.
- Dichte Inhalte auf mehrere Szenen verteilen, bevor Schrift oder Abstaende unlesbar werden.
- Bei mehreren sinnvollen Archetypen denjenigen waehlen, der die wenigsten konkurrierenden Ebenen benoetigt.
- Ein vorhandenes Diagramm nicht in Karten zerlegen, nur um den neuen Stil sichtbar zu machen.

## Inhaltsinventar

Vor dem Layout jeden Quellbestandteil genau einer Kategorie zuweisen:

- `must_preserve`: fachliche Aussage, Begriff, Wert, Formel, Datenreihe oder Beispiel bleibt erhalten.
- `reframe`: Inhalt bleibt, wird aber neu gruppiert oder visuell anders dargestellt.
- `visual_replace`: Text wird durch gleichwertige Grafik, Plot, Formel oder Icon getragen.
- `decorative_remove`: reine PowerPoint-Dekoration ohne Informationswert darf entfallen.
- `needs_decision`: Entfernung oder Zusammenfassung erst nach ausdruecklicher Klaerung.

## Brand-Kurzreferenz Fuer Full Slides

- Canvas: 1920x1080.
- Inhaltsrand: 74 px links/rechts, 56 px oben, 118 px unten reserviert.
- Hauptfarben: Marineblau `#031334`, Signalgruen `#00A754`, Weiss `#FFFFFF`.
- Education-Diagrammfarben: Goldgelb `#E9B400`, Koralle `#EC6244`,
  Stahlcyan `#0C84B4`, Graphitblau `#25495F`.
- Standardtitel: 54 px, Oxanium Bold/SemiBold, Marineblau.
- H3, Fliesstext, Labels und Captions: Archivo.
- Primaerinhalt: moeglichst mindestens 22 px.
- Kartenradius: 8 px.
- Medien/Text-Gap: 42 px.
- Footertext: 20 px; Logohoehe: 80 px.

Fuer exakte Werte, CSS und Sonderregeln
`reltest-education-brand-handoff.md` lesen.
