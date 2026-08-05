# Agentenrollen

Diese Rollen dienen als interne Arbeitsanweisungen. Der Default dieses Repos ist die Transformation exportierter PowerPoint-Quell-SVGs.

Die verpflichtenden Mindestregeln stehen in `AGENT.md`. Die Detailregeln werden ueber `workflow/README.md` und `workflow/00-router/context-loading-map.md` geladen.

## Primaerprozess: Quell-SVG-Analyse

1. `source-text-intake-mapper.md`
2. `source-svg-transformation-planner.md`

Der Source Text Intake Mapper extrahiert zuerst die Word-Sprechertexte und ordnet sie den einzelnen Quell-SVGs zu. Erst danach fuehrt der Source SVG Transformation Planner Modul-Inventar, Zustandsvergleich, Sequenzgruppierung, stabile `Scene_ID`-Vergabe, Sprechertextzuordnung, Quellreferenz-Mapping und Transformationsplanung aus.

Er erzeugt keine SVGs, keine PNGs und keine neuen Sprechertexte, ausser der Nutzer beauftragt ausdruecklich einen SVG-Vorschlag oder eine Testumsetzung.

## Primaerprozess: Rebuild-SVG-Vorschlaege

Wenn ein SVG-Vorschlag aus vorhandenen Basis-Seminar-Folien erstellt wird, gelten diese Rollen verpflichtend:

1. `source-text-intake-mapper.md`
2. `source-svg-transformation-planner.md`
3. Sequenzkarte und Design-Brief nach `workflow/40-svg-production/svg-rebuild-production-runbook.md`
4. `creative-scene-concept-designer.md`
5. `svg-visual-designer.md`
6. `svg-compositor.md`
7. `visual-composition-reviewer.md`
8. `svg-technical-validator.md`
9. `brand-guardian.md`

Der SVG-Vorschlag ist eine neue Grafikkomponente fuer die spaetere Folienerstellung. Er ist nicht automatisch eine komplette PowerPoint-Folie.

Der Zielkontext ist ein Basis-Seminar. Die Agenten duerfen kein Vorwissen in Zuverlaessigkeitstechnik voraussetzen. Der neue Kreativ-Agent entwickelt vor dem visuellen Design einsteigerfreundliche Szenenansaetze und empfiehlt eine didaktisch klare Variante.

Die neue Grafik ist eine Strukturtransformation, keine Zusammenfassung und kein erneuter Nachbau. Der fachlich relevante Inhalt der Quell-SVGs wird vollstaendig uebernommen, neu gruppiert und animierbar gemacht. Die Informationsdichte orientiert sich an den Quell-SVGs; der Sprechertext muss weiterhin passen.

Es wird immer nur eine Arbeitseinheit bearbeitet: eine echte Inhaltsfolie oder eine Sequenzgruppe. Die naechste Einheit beginnt erst, wenn Szenenplanung, Umsetzung, Render, visueller Fehlercheck und Korrektur der aktuellen Einheit abgeschlossen sind.

Pflichtpruefung vor Freigabe:

- das gesamte Quell-SVG-Paket wurde vor dem Bauen betrachtet und inventarisiert
- alle Word-Dokumente wurden verlustfrei extrahiert und jede Quell-SVG besitzt ein eindeutiges, hashgesichertes Text-Mapping
- Aufbau-, Morph- und Duplikatfolien wurden gruppiert
- pro Gruppe ist die vollstaendige Zielzustandsfolie bestimmt
- mehrere Folien, die durch Animationen zu einer gemeinsamen Erklaergrafik werden koennen, wurden zusammengezogen und als Layer-/Preview-Struktur geplant
- vorhandene Folien und Sprechertext wurden nach `workflow/10-source-analysis/source-slide-and-spoken-text-alignment.md` abgeglichen
- die neue Grafik laesst keine im Sprechertext grafisch relevante Aussage aus
- die neue Grafik laesst keinen fachlich relevanten Quellinhalt aus, auch wenn Layout und Verpackung modernisiert werden
- es gibt einen Design-Brief und einen Quellknoten-Transformationsplan
- fuer abstrakte oder fachlich anspruchsvolle Inhalte gibt es eine kreative, einsteigerfreundliche Konzeptphase vor dem SVG-Design
- fuer die aktuelle Arbeitseinheit liegt vor dem Bau eine saubere Szenenplanung vor
- es wurde nur diese eine Arbeitseinheit gebaut und geprueft, nicht mehrere gleichzeitig
- eine begruendete Neuinterpretation ist erlaubt, wenn sie die Lernwirkung verbessert, aber nicht wenn sie Inhalt reduziert
- keine sichtbare Hauptueberschrift oder automatisch uebernommener Folientitel, wenn der Nutzer den Titel spaeter ergaenzt
- keine Fazit-, Merksatz- oder Zusammenfassungsbox, wenn sie fuer den Inhalt nicht didaktisch noetig ist
- Library-Komponenten wurden angepasst und nicht blind verwendet
- Ausfallzeiten oder Datenmarker sind nicht kuenstlich gleichmaessig gesetzt, wenn sie unregelmaessig sein muessen
- Pfeile, Achsen, Marker und Labels sind proportional, kollisionsfrei und bleiben innerhalb der vorgesehenen Layoutflaechen
- bei Build-/Animationsfolien wird dokumentiert, ob mehrere Quell-SVGs eine gemeinsame Animation oder Morph-Sequenz bilden
- bei Build-/Animationsfolien wird ein gemeinsames Zielbild mit Layern geplant; einzelne Folien-SVGs sind nur Preview-Zustaende, wenn sie fuer Review oder Pipeline gebraucht werden
- jede Content-SVG enthaelt sinnvolle Animationsziele; fehlende Animationen brauchen eine Begruendung
- echte Plots und technische Diagramme werden aus Python erzeugt; einfache Ausfall-Timelines mit `X`-Markern bleiben SVG-native Timelines
- komplexere Piktogramme werden als freigegebene PNG-Assets eingebunden, nicht im SVG improvisiert
- ein gerenderter Cross-Check gegen alle zugeordneten Quell-SVGs und den Design-Brief wurde durchgefuehrt
- gefundene visuelle Fehler wurden an derselben Einheit behoben und erneut geprueft
- oeffentliche SVG-Ziele verwenden semantische ASCII-`snake_case`-IDs und `data-anim-target="true"`
- jeder finale Animationsschritt besitzt eine eindeutige `sourceText`-Phrase aus dem freigegebenen Szenensprechertext
- das finale `storyboardImportPackage/v1` wurde ueber `tools/svg-rebuild-qa.js --handoff-package ... --strict-handoff` geprueft

## Legacy-Prozess: Storyboard

Diese Rollen stammen aus dem alten Expertentraining-Workflow und werden nur bei ausdruecklichem Storyboard-Auftrag genutzt:

1. `storyboard-orchestrator.md`
2. `storyboard-writer.md`

## Legacy-/Downstream-Prozess: Grafikproduktion

Diese Rollen werden nur genutzt, wenn spaeter explizit SVG-, Asset- oder Videoproduktion beauftragt wird:

1. `instructional-designer.md`
2. `art-director.md`
3. `svg-compositor.md`
4. `visual-composition-reviewer.md`
5. `brand-guardian.md`
6. `animation-trigger-planner.md`
7. `svg-technical-validator.md`

Wenn PNG-Assets benoetigt werden, kommen hinzu:

- `png-asset-prompt-designer.md`
- `png-asset-reviewer.md`

Bei fachlich anspruchsvollen Inhalten kann `reliability-engineering-reviewer.md` hinzugezogen werden.

## Rollenlogik

- `source-text-intake-mapper.md`: extrahiert Word-Dokumente und erstellt das eindeutige SVG-Text-Mapping.
- `source-svg-transformation-planner.md`: inventarisiert Quell-SVGs und plant Zusammenfuehrung, Zielstruktur und Animation.
- `rebuild-analysis-orchestrator.md`: Legacy-Rolle fuer bestehende PPTX/PDF/PNG-Mehrquellenanalysen.
- `creative-scene-concept-designer.md`: entwickelt kreative, basisgerechte Szenenkonzepte ohne vorausgesetztes Expertenwissen.
- `storyboard-orchestrator.md`: fuehrt alte oder spaetere Storyboard-Erstellungen.
- `storyboard-writer.md`: schreibt freigegebene Storyboard-JSON.
- `production-orchestrator.md`: fuehrt spaetere Grafikproduktionslaeufe.
- `art-director.md`, `svg-compositor.md` und Reviewer-Rollen: gelten nur fuer nachgelagerte Visualproduktion.

## Regel

Ohne ausdrueckliche Nutzeraufforderung fuer Storyboard oder SVG bleibt die Arbeit bei Analyseartefakten unter `analysis/`. Wenn ein SVG-Vorschlag beauftragt ist, muss er vor der Rueckmeldung gegen die Pflichtpruefung dieses Dokuments laufen.
