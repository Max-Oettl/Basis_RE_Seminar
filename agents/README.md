# Agentenrollen

Diese Rollen dienen als interne Arbeitsanweisungen. Der Default dieses Repos ist jetzt die Basis-Seminar-Rebuild-Analyse.

Die verpflichtenden Mindestregeln stehen in `AGENT.md`.

## Primaerprozess: Rebuild-Analyse

1. `rebuild-analysis-orchestrator.md`

Der Rebuild Analysis Orchestrator fuehrt Quelleninventar, Folienanalyse, Sprechertext-Verknuepfung, Rebuild-JSON und Modulreport.

Er erzeugt keine SVGs, keine PNGs und keine neuen Sprechertexte, ausser der Nutzer beauftragt ausdruecklich einen SVG-Vorschlag oder eine Testumsetzung.

## Primaerprozess: Rebuild-SVG-Vorschlaege

Wenn ein SVG-Vorschlag aus vorhandenen Basis-Seminar-Folien erstellt wird, gelten diese Rollen verpflichtend:

1. `rebuild-analysis-orchestrator.md`
2. Sequenzkarte und Design-Brief nach `workflow/svg-rebuild-production-runbook.md`
3. `creative-scene-concept-designer.md`
4. `svg-visual-designer.md`
5. `svg-compositor.md`
6. `visual-composition-reviewer.md`
7. `svg-technical-validator.md`
8. `brand-guardian.md`

Der SVG-Vorschlag ist eine neue Grafikkomponente fuer die spaetere Folienerstellung. Er ist nicht automatisch eine komplette PowerPoint-Folie.

Der Zielkontext ist ein Basis-Seminar. Die Agenten duerfen kein Vorwissen in Zuverlaessigkeitstechnik voraussetzen. Der neue Kreativ-Agent entwickelt vor dem visuellen Design einsteigerfreundliche Szenenansaetze und empfiehlt eine didaktisch klare Variante.

Es wird immer nur eine Arbeitseinheit bearbeitet: eine echte Inhaltsfolie oder eine Sequenzgruppe. Die naechste Einheit beginnt erst, wenn Szenenplanung, Umsetzung, Render, visueller Fehlercheck und Korrektur der aktuellen Einheit abgeschlossen sind.

Pflichtpruefung vor Freigabe:

- das gesamte relevante Folienpaket wurde vor dem Bauen betrachtet
- Aufbau-, Morph- und Duplikatfolien wurden gruppiert
- pro Gruppe ist die vollstaendige Zielzustandsfolie bestimmt
- vorhandene Folien und Sprechertext wurden nach `workflow/source-slide-and-spoken-text-alignment.md` abgeglichen
- die neue Grafik laesst keine im Sprechertext grafisch relevante Aussage aus
- es gibt einen Design-Brief; die alte PowerPoint ist Inhaltsquelle, nicht Layoutschablone
- fuer abstrakte oder fachlich anspruchsvolle Inhalte gibt es eine kreative, einsteigerfreundliche Konzeptphase vor dem SVG-Design
- fuer die aktuelle Arbeitseinheit liegt vor dem Bau eine saubere Szenenplanung vor
- es wurde nur diese eine Arbeitseinheit gebaut und geprueft, nicht mehrere gleichzeitig
- eine begruendete Neuinterpretation ist erlaubt, wenn sie die Lernwirkung verbessert
- keine sichtbare Hauptueberschrift oder automatisch uebernommener Folientitel, wenn der Nutzer den Titel spaeter ergaenzt
- keine Fazit-, Merksatz- oder Zusammenfassungsbox, wenn sie fuer den Inhalt nicht didaktisch noetig ist
- Library-Komponenten wurden angepasst und nicht blind verwendet
- Ausfallzeiten oder Datenmarker sind nicht kuenstlich gleichmaessig gesetzt, wenn sie unregelmaessig sein muessen
- Pfeile, Achsen, Marker und Labels sind proportional, kollisionsfrei und bleiben innerhalb der vorgesehenen Layoutflaechen
- bei Build-/Animationsfolien wird dokumentiert, ob mehrere PowerPoint-Folien eine gemeinsame Animation oder Morph-Sequenz bilden
- bei Build-/Animationsfolien wird zuerst ein Master-SVG mit Layern erzeugt; einzelne Folien-SVGs sind nur Preview-Zustaende
- komplexere Piktogramme werden als freigegebene PNG-Assets eingebunden, nicht im SVG improvisiert
- ein gerenderter Cross-Check gegen Zielzustandsfolie und Design-Brief wurde durchgefuehrt
- gefundene visuelle Fehler wurden an derselben Einheit behoben und erneut geprueft

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

- `rebuild-analysis-orchestrator.md`: erstellt quellenbelegte Rebuild-Spezifikationen fuer bestehende Folien.
- `creative-scene-concept-designer.md`: entwickelt kreative, basisgerechte Szenenkonzepte ohne vorausgesetztes Expertenwissen.
- `storyboard-orchestrator.md`: fuehrt alte oder spaetere Storyboard-Erstellungen.
- `storyboard-writer.md`: schreibt freigegebene Storyboard-JSON.
- `production-orchestrator.md`: fuehrt spaetere Grafikproduktionslaeufe.
- `art-director.md`, `svg-compositor.md` und Reviewer-Rollen: gelten nur fuer nachgelagerte Visualproduktion.

## Regel

Ohne ausdrueckliche Nutzeraufforderung fuer Storyboard oder SVG bleibt die Arbeit bei Analyseartefakten unter `analysis/`. Wenn ein SVG-Vorschlag beauftragt ist, muss er vor der Rueckmeldung gegen die Pflichtpruefung dieses Dokuments laufen.
