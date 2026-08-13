# Portabler Funktionsvertrag für den RelTest-SVG-Editor

Stand: 13. August 2026

Dieses Dokument ist die kanonische, repo-unabhängige Spezifikation des
PowerPoint-nahen SVG-Bearbeitungsmodus. Ein anderes Repository soll den Editor
damit funktional gleichwertig aufbauen können. Neue Editorfunktionen müssen
künftig gleichzeitig in Implementierung, Tests und diesem Vertrag ergänzt
werden.

## 1. Ziel und Abgrenzung

Der Editor bearbeitet vorhandene SVG-Szenen direkt im Viewer. Er ist kein
allgemeiner Vektorzeichner: Er optimiert das Korrigieren von Seminarfolien –
Elemente auswählen, verschieben, skalieren, ausrichten, einfärben, Texte und
Formeln ändern sowie technische Verbinder bearbeiten.

Die gespeicherte SVG-Rohquelle ist maßgeblich. Auswahlrahmen, absolute
Vorschau-URLs, Zoom, Scrollposition und andere Editorhilfen dürfen nie
serialisiert werden. Animationen werden nicht in die Bearbeitungs-DOM
eingerechnet.

## 2. Oberflächenstruktur

- Kopf: Folienidentität, Speicherstatus, Rückkehr zum Viewer.
- Werkzeugleiste: Undo/Redo, übergeordnetes Element, Formelzugriff und Zoom.
- Linke Spalte: filterbarer Ebenenbaum und Revisionen.
- Mitte: scroll- und zoombare SVG-Arbeitsfläche.
- Rechte Spalte: automatische Reiter `Element`, `Text` und `Formel`.
- Statusleiste: Auswahl-, Dokument- und Tastaturstatus.
- Das HTML-Attribut `hidden` muss mit `[hidden]{display:none!important}` gegen
  versehentliche CSS-Übersteuerung abgesichert sein.

## 3. Auswahl

### Einzel- und Hierarchieauswahl

- Klick auf ein sichtbares SVG-Element wählt das tiefste sinnvolle Objekt.
- Wiederholter Klick an derselben Position zyklisiert durch verschachtelte
  Elternobjekte.
- `Esc` beziehungsweise „Übergeordnet“ wählt die nächste Elternstufe.
- Formeln sind atomar: interne Glyphenpfade dürfen nicht einzeln auswählbar sein.
- Ein `tspan` wird zur umgebenden `text`-Struktur hochgestuft.

### Gezielte Mehrfachauswahl

- `Shift` + Klick fügt ein Element zur bestehenden Auswahl hinzu oder entfernt
  es daraus. `Strg/Cmd` + Klick besitzt dieselbe Toggle-Semantik.
- Mehrere ausgewählte Elemente werden gemeinsam verschoben, dupliziert,
  gelöscht oder eingefärbt.
- Enthält eine Auswahl sowohl Eltern- als auch Kindknoten, bleibt nur der
  Elternknoten erhalten, damit Transformationen nicht doppelt wirken.

### Auswahlrahmen

- Ziehen auf freier Canvasfläche erzeugt einen Auswahlrahmen.
- Ein Element wird nur aufgenommen, wenn seine vollständige sichtbare Bounding
  Box im Rahmen liegt. Bloßes Anschneiden reicht in keiner Ziehrichtung.
- `Shift`, `Strg` oder `Cmd` beim Aufziehen ergänzt die bestehende Auswahl.
- Gruppen und Definitionsknoten werden nicht als zufällige Rahmenfunde
  aufgenommen; Formelobjekte werden atomar hochgestuft.

## 4. Verschieben, Skalieren und Ebenen

- Ziehen verschiebt ein oder mehrere ausgewählte Elemente.
- `Shift` während des Ziehens sperrt auf die dominante horizontale oder vertikale
  Achse.
- Pfeiltasten verschieben um eine SVG-Einheit; `Shift` oder `Alt` um zehn.
- Acht Ziehpunkte ändern Breite und Höhe eines Einzelobjekts.
- X, Y, Breite und Höhe sind zusätzlich numerisch editierbar.
- Z-Reihenfolge: ganz nach hinten, eine Ebene zurück, eine Ebene vor und ganz
  nach vorn. `defs`, Marker, Masken und Metadaten bleiben ausgeschlossen.
- Ein anderes Objekt kann als Referenz gewählt werden. Unterstützt werden
  horizontale, vertikale und beidachsige Zentrierung sowie das Andocken einer
  Boxkante an eine Referenzlinie.

## 5. Linien, Pfeile und Verbinder

- Gerade Linien besitzen getrennte Start- und Endgriffe.
- `Shift` beim Kürzen oder Verlängern hält den Endpunkt horizontal oder vertikal
  zum Gegenpunkt.
- Gerade und orthogonale `path`-Verbinder werden verlustarm zu editierbaren
  `polyline`-Punkten konvertiert; Kurven bleiben als Pfad erhalten.
- Segmentgriffe fügen eine neue Ecke ein; innere Ecken können entfernt werden.
- Verbinder können horizontal oder vertikal begradigt werden.
- Start oder Ende kann an linke, obere, rechte oder untere Seitenmitte einer
  Referenzbox angedockt werden.
- Marker, Strichstil, IDs, Animationseigenschaften und semantische Attribute
  müssen bei einer Konvertierung erhalten bleiben.

## 6. Textbearbeitung

- Klick auf `text` oder `tspan` schaltet automatisch auf den Textreiter und setzt
  den Fokus in das Textfeld. Ein manueller Reiterwechsel ist nicht erforderlich.
- Enter im Textfeld erzeugt eine neue SVG-Zeile. Jede Zeile wird als eigener
  äußerer `tspan` mit `x` und `dy` gespeichert.
- Editierbar sind Schriftart, Schriftgrad, Zeilenhöhe, Schriftstärke, Farbe und
  Ausrichtung.
- Verbindliche Schriften: Archivo für Inhalt und Oxanium für Überschriften;
  Arial, Helvetica, Georgia und Times New Roman stehen als bewusste Alternativen
  zur Verfügung. Eigene bestehende Fontstacks bleiben als „Aktuell“-Wert
  erhalten.
- Die gewählte Schriftfamilie wird als Präsentationsattribut und Inline-Style
  geschrieben, damit eine vorhandene SVG-Klassenregel die Benutzerentscheidung
  nicht überschreibt.

### Stichpunkte

- Stile: keine, Spiegelstrich `–`, rund `●`, eckig `■`, Pfeil `→`.
- Jede nicht leere Textzeile erhält die gewählte Markierung.
- Markierung und Text bleiben in derselben äußeren Zeile, die Markierung liegt in
  einem inneren `tspan data-editor-bullet="true"`.
- Stichpunktfarbe ist unabhängig von der Textfarbe und verwendet dieselbe
  Corporate-Design-Palette.
- Beim erneuten Bearbeiten werden editorerzeugte Markierungen aus dem Textfeld
  ausgeblendet, damit sie nicht doppelt gespeichert werden.

## 7. Farben und Corporate Design

- Füllung, Kontur, Text und Stichpunkte können aus der aktiven
  RelTest-Corporate-Design-Tokenquelle gewählt werden.
- Die Palette zeigt zuerst Marineblau und seine 80/60/40/20/10-%-Abstufungen,
  danach neutrale Flächen und erst anschließend Education-Grün sowie
  Diagrammfarben.
- „Keine Farbe“ setzt bei Füllung oder Kontur `none`.
- Eigene Hex-, CSS- oder Referenzwerte bleiben über das Freitextfeld möglich.
- Die Tokenquelle wird zur Laufzeit geladen; eine identische Offline-Palette ist
  Pflicht, damit der Editor nicht von einem Netz- oder API-Zugriff abhängt.

## 8. Formeln

- Klick auf ein markiertes Formelobjekt schaltet automatisch zum Formelreiter.
- Formeln werden als atomare Objekte verschoben und skaliert.
- TeX-/Mathtext-Quelle, Schriftgrad und Farbe sind editierbar.
- Vorschau und gespeichertes Ergebnis verwenden denselben MathJax-SVG-Pfadexport;
  Unicode- oder normaler Text ist kein gleichwertiger Formelersatz.
- Externe Formel-SVGs und eingebettete Formeln werden gemeinsam mit dem
  Elternelement versioniert. Formellokale Metadaten bewahren die Quelle.
- Eine Schnellbibliothek bietet mindestens Bruch, Index, Exponent, Wurzeln,
  Akzente, Vektor, skalierende Klammern, Betrag, Norm, 2×2-Matrix,
  Fallunterscheidung, Summe, Produkt, Integral, Grenzwert, Ableitungen,
  Logarithmen, häufige griechische Buchstaben sowie Vergleichs- und
  Mengensymbole.
- Bibliotheksknöpfe fügen gültiges TeX mit genau einem Befehls-Backslash ein.
  Markierter Quelltext wird nach Möglichkeit in den ersten Inhaltsplatzhalter
  `{}` eingesetzt; ohne Markierung landet der Cursor im ersten Platzhalter.
- Auch Vorlagen aus der Schnellbibliothek werden über den MathJax-Pfadexport
  gerendert. Matrizen und Fallunterscheidungen bewahren ihre Zeilen- und
  Spaltentrenner und dürfen nicht in normalen SVG-Text zurückfallen.

## 9. Navigation und Zoom

- Beim Öffnen wird die vollständige SVG-Szene maximal groß in den verfügbaren
  Arbeitsbereich eingepasst. Es gibt keine künstliche Obergrenze von 115 %.
- Solange der Benutzer nicht manuell zoomt, wird bei Fenstergrößenänderung erneut
  automatisch eingepasst.
- Klick auf die Zoomanzeige stellt „Einpassen“ wieder her.
- `Strg/Cmd` + Mausrad zoomt am Mauszeiger.
- Normales Mausrad scrollt vertikal; ein horizontales Mausrad scrollt horizontal.
- `Shift` + vertikales Mausrad dient als horizontaler Fallback.
- Zoomgrenzen: 20 bis 400 Prozent.

## 10. Verlauf, Speichern und Sicherheit

- Ein Drag, Resize oder zusammenhängender Texteingriff ist genau eine
  Undo/Redo-Transaktion.
- Tastatur: `Strg/Cmd+Z`, `Strg/Cmd+Y`, `Strg/Cmd+Shift+Z`, `Strg/Cmd+S`,
  `Strg/Cmd+D`, `Entf`, Pfeiltasten und `Esc`.
- Speichern verwendet einen erwarteten SHA-256-Hash und antwortet bei einem
  konkurrierenden Schreibvorgang mit Konflikt statt Überschreiben.
- Vor dem Schreiben wird eine wiederherstellbare Revision von SVG und lokalen
  Formelassets angelegt. Multi-Datei-Schreiben erfolgt atomar mit Rollback.
- Finale und archivierte Fassungen sind schreibgeschützt.
- Backend validiert Zielpfad, XML, doppelte IDs, Skripte, `foreignObject`, externe
  URLs, Formelpfade und Größenlimits.
- Navigation mit ungespeicherten Änderungen löst eine Warnung aus.

## 11. API-Vertrag

- `GET /api/svg-editor?id=<slideId>` liefert Rohquelle, SHA, Dateipfad,
  Formelassets, Revisionen, Read-only-Status und Aliaswarnungen.
- `POST /api/svg-editor/save` erhält `id`, `source`, `expectedSha256`, `label` und
  `formulaAssets`.
- `POST /api/svg-editor/restore` erhält `id`, `versionId` und
  `expectedSha256`.
- Die Route `/svg-editor?id=<slideId>` ist der eigenständige Arbeitsmodus; der
  Viewer verlinkt aus der aktuellen Vorschau dorthin.

## 12. Portierungs- und QA-Checkliste

- Roh-DOM und sanitizte Anzeige-DOM strikt trennen.
- Pointerkoordinaten über `getScreenCTM().inverse()` in SVG-Koordinaten wandeln.
- Relative Asset-URLs nur für die Anzeige auflösen; gespeichert bleiben sie
  relativ.
- IDs und `url(#id)`-/`href`-Beziehungen nicht umbenennen.
- Tests mindestens für Auswahl-Toggle, vollständige Rahmenselektion,
  Achsensperre, Linienpunkte, Referenzausrichtung, Textzeilen, Stichpunkte,
  Schriftfamilien, Corporate-Design-Palette, Zoom/Pan, Hashkonflikt, Read-only,
  Speichern und Wiederherstellen vorsehen.
- Browser-QA: 1920×1080, 1440×900 und 1280×800; Reiter dürfen sich nicht mit
  Inspector-Inhalten überlagern. Console ohne relevante Fehler.

## 13. Pflege zukünftiger Funktionen

Jede neue Funktion ergänzt in demselben Änderungssatz:

1. die sichtbare Bedienung und Tastatursemantik,
2. den Serialisierungs- und Sicherheitsvertrag,
3. deterministische Domain- oder Quelltests,
4. einen Browser-Interaktionstest,
5. den passenden Abschnitt dieses Dokuments,
6. den folgenden Änderungsverlauf.

### Änderungsverlauf

- 2026-08-12: Basiseditor, Ebenen, Drag/Resize, Text, Formeln, Undo/Redo,
  Revisionen und optimistisches Speichern.
- 2026-08-12: Z-Reihenfolge, Shift-Achsensperre, Linienendpunkte,
  Referenzzentrierung und Linien-Andocken.
- 2026-08-12: editierbare Pfeile/Polylinien mit Ecken und Box-Docking.
- 2026-08-12: Auswahlrahmen, gemeinsames Verschieben, Zoom per
  Strg/Cmd+Mausrad und zweidimensionales Scrollen.
- 2026-08-13: produktionsgleiche MathJax-Pfadformeln und CI-Farbpalette.
- 2026-08-13: Shift-Klick-Mehrfachauswahl, vollständige Rahmenselektion,
  automatische Text-/Formelreiter, maximales Einpassen, Schriftfamilien,
  farbige Stichpunkte und sichere `hidden`-Darstellung.
- 2026-08-13: Formel-Schnellbibliothek mit griechischen Zeichen, Beziehungen,
  Operatoren, Klammern, Matrizen und Fallunterscheidungen sowie
  platzhalterbewusstem Einfügen.
