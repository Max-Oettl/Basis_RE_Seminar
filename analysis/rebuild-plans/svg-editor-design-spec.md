# SVG-Editor im Basis-Rebuild-Viewer

Der vollständige, repo-unabhängige Funktions-, API-, Sicherheits- und
Portierungsvertrag liegt kanonisch in
`docs/svg-editor-portability-contract.md`. Jede zukünftige Editorfunktion muss
dort im selben Änderungssatz dokumentiert werden.

## Ziel

Der Viewer erhält einen eigenständigen Arbeitsmodus, in dem ein vorhandener
SVG-Vorschlag ohne Prompt direkt wie eine technische PowerPoint-Folie bearbeitet
werden kann. Der Canvas bleibt die visuell dominante Fläche. Navigation,
Eigenschaften und Werkzeuge bilden ruhige, kompakte Arbeitsleisten.

## Designreferenz

- `analysis/design-references/svg-editor-concept-2026-08-12.png`
- Zielgröße der Referenz: 1920×1080
- Die Referenz ist eine Gestaltungs- und Interaktionsvorgabe. Die im Screenshot
  gezeigte Beispielschaltung ist kein neuer Seminarinhalt.

## Informationsarchitektur

1. Kopfzeile: Rückkehr zum Viewer, Folienidentität, Speichern.
2. Werkzeugleiste: Auswahl, Rückgängig/Wiederholen, Formel, Zoom.
3. Linke Leiste: Ebenen und Auswahlhierarchie.
4. Mitte: grauer Arbeitsbereich mit weißem 16:9-SVG-Canvas.
5. Rechte Leiste: `Element`, `Text`, `Formel` und numerische Eigenschaften.
6. Statuszeile: Speicherzustand, Zoom, Elementtyp und Tastaturhinweise.

## Designsystem

- Grundfläche: echtes Weiß `#FFFFFF`.
- Arbeitsfläche: kühles Hellgrau `#E8EDF2`.
- Führungsfarbe: Marineblau `#142452`.
- Dunkle UI-Fläche: `#031334`.
- Aktiver Fokus und Auswahl: Signalgrün `#00A653`.
- Kontur: `rgba(20,36,82,0.18)`.
- Warnung: Koralle `#EC6244`, nur semantisch.
- UI-Typografie: Archivo beziehungsweise systemischer Sans-Serif-Fallback.
- Keine Farbrotation, keine Verläufe und keine dekorativen Schatten. Nur die
  Folie erhält eine geringe räumliche Abhebung vom Arbeitsbereich.
- Kontrollen besitzen 6–8 px Radius, klare Fokuszustände und mindestens 32 px
  Bedienhöhe.

## Verbindliche Interaktionen

- Jedes sichtbare SVG-Element ist anklickbar; Formeln bleiben atomare Objekte.
- Ausgewählte Elemente erhalten einen grünen Rahmen und acht Ziehpunkte.
- Ziehen verschiebt; Ziehpunkte ändern Breite beziehungsweise Höhe.
- Numerische Felder ändern Position und Größe präzise.
- Text kann mehrzeilig eingegeben werden; Zeilenumbrüche werden als `tspan`
  gespeichert.
- Pfeiltasten verschieben; `Shift` erhöht die Schrittweite.
- Beim freien Ziehen sperrt `Shift` die Bewegung auf die dominante X- oder
  Y-Achse. Linien besitzen eigene Endpunktgriffe; `Shift` rastet den bewegten
  Endpunkt horizontal oder vertikal zum gegenüberliegenden Endpunkt ein.
- Die SVG-Zeichenreihenfolge ist direkt editierbar: eine Ebene vor/zurück sowie
  ganz nach vorn/hinten. Nicht sichtbare Definitionsknoten bleiben davon
  unberührt.
- Ein zweites Element kann als Referenz markiert werden. Das aktive Element kann
  horizontal, vertikal oder beidachsig an dessen Mittelpunkt ausgerichtet
  werden. Bei einer horizontalen oder vertikalen Referenzlinie kann die
  nächstgelegene Boxkante zusätzlich an die Linie angedockt werden.
- `Strg+Z`, `Strg+Y`, `Strg+S`, `Entf` und Duplizieren sind unterstützt.
- Undo/Redo arbeitet transaktionsweise: ein Ziehvorgang entspricht einem Schritt.
- Speichern legt vorher eine wiederherstellbare Revision an und verwendet einen
  Hash gegen konkurrierende Änderungen.
- Final freigegebene oder archivierte Folien bleiben schreibgeschützt.

## Formeleditor

- Formelquelle in TeX-/Mathtext-Schreibweise bearbeiten.
- Schnelleinfügen für Bruch, Index, Exponent, Wurzel, Summe und Integral.
- Live-Vorschau als transparentes SVG.
- Schriftgrad, Farbe und Einpassung steuern.
- Externe Formelassets werden gemeinsam mit der Folie gespeichert und
  versioniert.
- Fehlt der produktive Python-/STIX-Pfadrenderer, verwendet der Editor einen klar
  gekennzeichneten kontrollierten SVG-Text-Fallback und bewahrt die Formelquelle
  in Metadaten. Er gibt keinen vermeintlichen Pfadexport vor.

## Sichtbare Texte oberhalb des Canvas

Erlaubt sind ausschließlich funktionale Bezeichnungen: `Viewer`,
`Rückgängig`, `Wiederholen`, `Formel`, `Speichern`, `Auswahl`, Zoomwert sowie die
aktuelle Folienidentität. Zusätzliche Marketingtexte, Kennzahlen oder Badges sind
nicht vorgesehen.

## Technischer Vertrag

- Bearbeitet wird die unveränderte Rohquelle, niemals die für Animation oder
  Vorschau mutierte DOM-Fassung.
- Temporäre Auswahlrahmen, Session-IDs und absolute Vorschau-URLs werden nicht
  serialisiert.
- Relative Medien- und Formelpfade bleiben relativ.
- Animations-IDs, `defs`, Marker, Clip-Pfade, Metadaten und Namespaces bleiben
  erhalten.
- Generatorläufe können manuelle Bearbeitungen weiterhin überschreiben; deshalb
  ist die automatische Vorher-Revision Pflicht.

## QA

- Desktop: 1920×1080 und 1440×900.
- Schmaler Laptop: 1280×800 ohne abgeschnittenen Canvas oder Inspector.
- Kernpfad: öffnen → Element wählen → verschieben → skalieren → Text umbrechen →
  rückgängig → Formel ändern → speichern → neu laden.
- PowerPoint-naher Geometriepfad: Box auswählen → Ebene zurück → Linie auswählen
  → Endpunkt mit `Shift` kürzen → Box erneut auswählen → Linie als Referenz
  setzen → `Mitte X` beziehungsweise `An Linie` → Undo/Redo.
- Sicherheitsfälle: veralteter Hash, finale Folie, unsicheres SVG, ungültiger
  Formelpfad und Versionswiederherstellung.

## Feedback-Lernprotokoll 2026-08-13

- Nutzerbeobachtung: Ebenenreihenfolge, achsengebundene Linienbearbeitung und
  referenzbezogenes Zentrieren fehlten für eine PowerPoint-nahe Bearbeitung.
- Reproduzierte Ursache: Der erste Editorstand kannte nur Einzelwahl,
  Bounding-Box-Skalierung und absolute Geometriefelder.
- Lokale Korrektur: Zeichenreihenfolge, Linienendpunkte mit Shift-Rastung sowie
  Referenzauswahl, Zentrierung und Linien-Andocken ergänzt.
- Reichweite: `project_rule` für den SVG-Editor.
- Übertragbare Regel: Ein visueller Folieneditor braucht neben freier Geometrie
  immer Z-Reihenfolge, Achsensperre und explizite Referenzausrichtung; automatische
  Kopplungen werden nicht geraten.
- Aktualisierte Schubladen: Editor-Designvertrag und deterministische
  Client-Domain-Tests.

## Bedienungsfeedback 2026-08-13 · Auswahl, Text und Canvas

- Nutzerbeobachtung: Shift-Klick fehlte für eine gezielte Mehrfachauswahl;
  angeschnittene Elemente wurden vom Auswahlrahmen zu früh erfasst; Text und
  Formeln öffneten nicht zuverlässig den passenden Reiter; die Szene startete
  zu klein und ausgeblendete Inspector-Inhalte konnten die Reiter überlagern.
- Reproduzierte Ursache: Mehrfach-Toggle war nur an Strg/Cmd gebunden, die
  Rahmenlogik wechselte je nach Ziehrichtung zwischen Berührung und vollständiger
  Umschließung, der Zoom war bei 115 Prozent gedeckelt und die Autor-CSS-Regel
  für Inspector-Inhalte überstimmte das HTML-Attribut `hidden`.
- Korrektur: Shift-Toggle, ausschließlich vollständige Rahmenselektion,
  typabhängige Reiterautomatik, maximales responsives Einpassen und globale
  `[hidden]`-Absicherung. Ergänzt wurden Schriftfamilien, Enter-Zeilenumbrüche
  und farbige Listenmarker.
- Reichweite: `project_rule | qa_gap`.
- Übertragbare Regel: Ein PowerPoint-naher Editor muss Auswahl-, Reiter- und
  Zoomzustand aus der direkten Benutzerhandlung ableiten und ausgeblendete
  Inspectorbereiche technisch sicher aus dem Layout entfernen.
