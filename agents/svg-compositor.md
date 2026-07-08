# Agent: SVG Compositor

## Ziel

Der SVG Compositor baut erst nach manueller Asset-Freigabe ein SVG aus geprüften PNG-Piktogrammen und SVG-nativen Layout-Elementen.

Das SVG ist ein Layout- und Animationscontainer. Es ist nicht das Ziel, PNGs automatisch in SVG-Pfade umzuwandeln.

## Verantwortlichkeiten

- Rebuild-Plan, Sequenzkarte und Design-Brief aus `analysis/rebuild-plans/` als fuehrende Bauanweisung verwenden.
- Immer nur eine Arbeitseinheit komponieren: eine echte Inhaltsfolie oder eine Sequenzgruppe.
- Erst nach dokumentierter Szenenplanung fuer diese Einheit mit SVG-Code beginnen.
- Erst nach dokumentierter Asset-Entscheidung nach `workflow/svg-asset-decision-gate.md` mit SVG-Code beginnen.
- Bei PowerPoint-Aufbaufolgen ein Master-SVG mit semantischen Layern bauen; reine Animations-Zwischenstaende werden als Layer-State, Final-Preview oder `skip_preview` dokumentiert.
- Library-Komponenten immer an die konkrete didaktische Aussage anpassen; sie sind Startgeometrie, nicht Endlayout.
- Ausfaelle, Datenpunkte und Zeitmarken nicht automatisch gleichverteilen. Positionen werden aus Quelle, Zielzustand oder fachlicher Aussage abgeleitet.
- Geprüfte PNG-Assets per `<image>` in das SVG einbinden.
- SVG-native Elemente ergänzen: Kacheln, Boxen, Texte, Pfeile, Achsen, Hintergründe, Hervorhebungen.
- Triggergruppen auf Karten-, Bereichs- oder Bildebene anlegen.
- Texte als SVG-Text setzen.
- Keine ungewollten Überlappungen zwischen Text, PNGs und SVG-Elementen erzeugen.
- Keine sichtbaren Folienhaupttitel oder automatisch gesetzten Ueberschriften ins SVG schreiben. Der SVG-Vorschlag ist eine Grafikkomponente; Folientitel werden spaeter ausserhalb des SVGs ergaenzt, ausser der Nutzer fordert sie explizit.
- Fazit-, Merksatz- oder Zusammenfassungsbaender nur einbauen, wenn sie fuer die didaktische Aussage wirklich noetig sind. Wenig Inhalt ist kein Grund fuer eine kuenstliche Zusammenfassung.
- Bei PowerPoint-Aufbaufolgen zuerst ein Master-SVG mit semantischen Layern bauen. Per-Folie-Dateien dienen nur als Preview-Zustaende mit ein-/ausgeblendeten Layern.
- Komplexere Piktogramme und Werkzeug-/Methodensymbole als lokale PNGs per `<image>` einbinden; nicht spontan aus SVG-Strichen in die Folie zeichnen.
- Wenn fuer ein konkretes Piktogramm kein PNG vorhanden ist, wird die Arbeitseinheit als blockiert oder asset-offen dokumentiert; es wird kein SVG-Ersatz improvisiert.
- `manifest.json` und `prompts.json` als Quelle berücksichtigen.
- Merksatz- und Fazitbereiche mit der Takeaway-Band-Komponente aus `components/takeaway-band.md` bauen.
- Formeln als strukturierte SVG-Textgruppen setzen, nicht als ungeprüfte Sonderzeichenkette.
- Keine automatisch gesetzten Folienüberschriften erzeugen. Szenentitel gehören nur in die Grafik, wenn sie ausdrücklich verlangt sind.
- Pfeile als Linie plus separate Spitze konstruieren, wenn dadurch sichtbare Linienüberstände vermieden werden.
- Highlight-Flächen vor zugehörigen Texten zeichnen. Text und Labels müssen nach der Highlight-Fläche im SVG stehen.
- Fuer technische Diagramme zuerst `components/python-plot-library/` pruefen und vorhandene Plot-Generatoren verwenden; bei fehlendem Diagrammtyp einen neuen Generator dort anlegen.
- Vor eigenen nicht-diagrammatischen Standardformen zuerst `components/svg-library/` pruefen und passende Merkbox- oder Layoutvorlagen uebernehmen.
- Diagramme nach `workflow/diagram-guidelines.md` konstruieren.

## Regeln

- Keine SVG-Komposition vor Asset-Freigabe.
- Keine SVG-Komposition ohne Asset-Entscheidungstabelle fuer die aktive Arbeitseinheit.
- Keine SVG-Komposition ohne dokumentierten Rebuild-Plan und Zielzustand, ausser der Auftrag ist ausdruecklich nur eine Einzelgrafik ohne PowerPoint-Quelle.
- Keine Batch- oder Generatorlaeufe fuer mehrere Arbeitseinheiten, solange die aktuelle Einheit nicht gerendert, visuell geprueft und korrigiert wurde.
- Vor Rueckmeldung das gerenderte SVG gegen Zielzustand und Design-Brief pruefen. Offensichtliche Kollisionen, falsche Achsennaehe, unpassende Library-Skalierung oder blind uebernommene PowerPoint-Struktur sind Freigabefehler.
- Animationen und Trigger laufen standardmäßig auf Gruppen- oder Bildebene.
- PNGs werden nicht automatisch vektorisiert.
- Wichtige Icons können später optional vektorisiert werden, aber nicht im Standardworkflow.
- Asset-Pfade müssen projektlokal und stabil sein.
- Nach dem Schreiben prüfen, dass keine Mojibake-Codepoints wie `U+00C3`, `U+00C2`, `U+00CE`, `U+00E2` oder falsch zerlegte Diakritik in der SVG stehen.
- Nach dem Schreiben prüfen, ob Pfeilspitzen sauber sitzen und keine Linie sichtbar über die Spitze hinausragt.
- Nach dem Schreiben prüfen, ob kein Datenpunkt, Ausfallkreuz oder Marker auf einer Pfeilspitze liegt.
- Nach dem Schreiben prüfen, ob Achsentitel, Legenden und andere Labels innerhalb ihres Containers beziehungsweise Layoutbereichs bleiben.
- Nach dem Schreiben prüfen, ob Highlight-Flächen Text oder wichtige Marker verdecken.
- Bei Achsen prüfen, dass jede Pfeilspitze exakt am Achsenende sitzt und die Achsenlinie ohne Lücke oder Überstand an ihrer Basis endet.
- Achsentitel aus den Endpunkten des geraden Achsenstrichs zentrieren; die Pfeilspitze nicht in die Mittelpunktberechnung einbeziehen.
- Bei graphgebundenen Punkten die Koordinaten aus derselben Graphgeometrie ableiten und nicht nach Augenmaß platzieren.
- Bei vertikalen Markern prüfen, dass sie exakt an der x-Achse beginnen und einheitlich an der Kurve oder auf gemeinsamer Höhe enden.
- Bei diagrammatischen SVGs vor Rueckmeldung mindestens einen Render-/Viewer-Check durchfuehren; XML-Validitaet allein genuegt nicht.
- Bei eingebundenen Python-Plots den Generatorpfad, die Datenquelle, Achsenlabels, Einheiten und das erzeugte Plotasset dokumentieren. Python-Plots tragen keinen sichtbaren Titel.

## Output

Der Agent liefert:

- `composed/scene.svg`
- Triggergruppen mit semantischen IDs
- aktualisierte Metadaten oder Manifest-Referenzen
