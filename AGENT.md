# Basis Seminar Rebuild Agent

Diese Datei ist der verpflichtende Router fuer Codex in diesem Repo. Sie haelt nur Kernregeln und Kontext-Ladeentscheidungen. Detailregeln liegen in `workflow/`.

Die fruehere Langfassung ist verlustfrei gesichert unter:

```text
workflow/00-router/agent-rules-legacy-before-router.md
```

## Primaerer Auftrag

Dieses Repo dient dem Rebuild des bestehenden Basis-Seminars `Reliability Engineer`.

Ziel ist die nachvollziehbare Transformation exportierter PowerPoint-Folien-SVGs in strukturierte, animierbare Content-SVGs. Die Quell-SVG ist Inhalts- und Geometrieanker. Sie wird nicht erneut aus Rasterbildern oder PowerPoint-Objekten nachgebaut, sondern analysiert, bei Bedarf mit benachbarten Quell-SVGs zusammengefuehrt und in die vereinbarte Zielstruktur ueberfuehrt.

Die inhaltliche Gleichwertigkeit ist Vorrangziel: Der gesamte fachlich relevante Inhalt der Quell-SVGs wird uebernommen. Er darf anders gruppiert, visuell neu geordnet und animierbar gemacht werden, aber die neue Grafik darf Aussage, Begriffe, Schritte, Parameter, Beispiele und Diagrammlogik nicht ausduennen. Der Sprechertext muss weiterhin zu den neuen Folien passen.

Das Zielpublikum ist das Basis-Seminar. Kein Vorwissen in Zuverlaessigkeitstechnik voraussetzen. Fachbegriffe, Diagramme, Formeln und Methoden muessen einsteigerfreundlich geplant werden.

Der extrahierte Quell-Sprechertext bleibt unveraendert. Er wird aus den modul-lokalen Word-Dokumenten extrahiert und verknuepft, nicht still neu formuliert. Eine ausdrueckliche Bearbeitung im Viewer wird als szenenbezogener Override gespeichert und muss alle `sourceText`-Trigger erneut validieren. Der wirksame Szenensprechertext ist bereits vor der semantischen Quell-SVG-Analyse eindeutig zu mappen und bleibt fuer animierte Szenen Pflicht. Sprecherpausen folgen `workflow/50-animation/narration-pause-markers.md`: Marker wie `{{pause:medium}}` bleiben verlustfrei im Text, zaehlen nicht als Woerter und duerfen nie als Animationstrigger verwendet werden.

SVG-Ergebnisse sind standardmaessig Content-SVGs fuer eine spaetere PowerPoint-Einbettung, keine vollstaendigen PowerPoint-Folien. Globale Masterelemente wie Foliennummer, Footer, Logo-Leiste, Praesentationsrahmen, Deck-Header oder automatisch gesetzte PowerPoint-Titel gehoeren nicht in das Content-SVG.

## Vorrang Bei Konflikten

1. ausdruecklicher Nutzerauftrag
2. diese Datei `AGENT.md`
3. `workflow/README.md`
4. `workflow/00-router/context-loading-map.md`
5. die fuer den aktuellen Arbeitsschritt geladenen Detailregeln
6. Legacy-Regeln und alte Pfade nur, wenn sie nicht widersprechen

## Aktiver Inputvertrag

Der neue Kursinput besteht aus genau fuenf Modulordnern `RE1` bis `RE5`. Der einzige aktive visuelle Eingang sind einzelne, aus PowerPoint exportierte SVGs; der zugehoerige Sprechertext liegt pro Modul als Word-Dokument vor:

```text
source-materials/basis-seminar/powerpoint-svg/<module_id>/SVG/*.svg
source-materials/basis-seminar/powerpoint-svg/<module_id>/Text/*.docx
```

Vor jeder weiteren Modulbearbeitung werden die DOCX-Inhalte verlustfrei nach `analysis/source-text/<module_id>/` extrahiert und in `analysis/inventories/<module_id>_svg-text-map.json` genau den einzelnen Quell-SVGs zugeordnet. Die fruehere Gliederung in mehrere PowerPoint-Dateien ist kein Teil des neuen Inputs und wird nicht rekonstruiert. Fuer sichtbaren Inhalt, Formeln, Geometrie, Reihenfolge und Ausgangszustand gilt die jeweilige Quell-SVG; der gemappte Sprechertext ist die didaktische und sprachliche Triggerreferenz. PPTX-, PDF-, PNG- oder separate Narration-Bestaende werden fuer neue Module nicht verlangt oder parallel ausgewertet.

Quell-SVGs werden niemals direkt veraendert. Alle Transformationen entstehen unter `rebuild-proposals/svg/`.

## Kontext-Laderegel

Immer lesen:

1. `AGENT.md`
2. `workflow/README.md`
3. `workflow/00-router/context-loading-map.md`

Danach nur die passenden Detailregeln laden:

- DOCX-Extraktion und SVG-Text-Mapping: `workflow/10-source-analysis/source-text-docx-intake-and-mapping.md`
- Quell-SVG-Inventar und Transformationsanalyse: `workflow/10-source-analysis/source-svg-intake-workflow.md`
- Sequenz-Preflight und Szenenplanung: `workflow/20-scene-planning/`
- Asset- und Visualentscheidung: `workflow/30-visual-decision/`
- echte Diagramme und Python-Plots: `workflow/31-python-plots/`
- Formeln: `workflow/32-formulas/`
- Timelines und Ausfall-Zeitachsen: `workflow/33-timelines/`
- gezieltes Folien- oder Modul-Redesign: `.agents/skills/redesign-reltest-slides/SKILL.md` und `workflow/34-slide-redesign/`
- Piktogrammauswahl, -erstellung und -freigabe: `workflow/30-visual-decision/pictogram-creation-workflow.md`
- SVG-Produktion: `workflow/40-svg-production/`
- Animation/Manifest: `.agents/skills/animate-svg-from-narration/SKILL.md` und `workflow/50-animation/`
- QA/Freigabe: `workflow/60-quality/`
- externe Storyboard-Uebergabe und Downstream-Video: `workflow/70-integration/`
- alte Storyboard-Arbeit: `workflow/80-storyboard-legacy/`

Alte Pfade direkt unter `workflow/` sind Compatibility Redirects. Neue Verweise sollen die kanonischen Unterordnerpfade verwenden.

## Harte Arbeitsregeln

- Keine Daten, Sprechertextstellen, Parameter, Formeln, Beispiele oder Muss-Inhalte verlieren.
- Vor jeder Quell-SVG-Analyse zuerst alle Word-Dokumente des Moduls verlustfrei extrahieren und jede Quell-SVG eindeutig mit ihrem Sprechertext in `analysis/inventories/<module_id>_svg-text-map.json` verbinden.
- Kein Mapping allein anhand der Dateireihenfolge freigeben. Fehlende, doppelte oder mehrdeutige SVG-Text-Zuordnungen stoppen die Sequenzplanung und Produktion.
- Die einzige aktive Kursgliederung sind `RE1` bis `RE5`; eine fruehere Aufteilung in PowerPoint-Dateien wird nicht rekonstruiert.
- Inhaltliche Gleichwertigkeit ist Pflicht: Eine neue Content-SVG darf weniger PowerPoint-Dekoration enthalten, aber nicht weniger fachliche Information als die zugeordneten Quell-SVGs, sofern der Inhalt fuer Sprechertext oder Lernziel relevant ist.
- Keine freie fachliche Neutextung ohne Nutzerauftrag.
- Jede relevante Unsicherheit in `qa.open_questions`, `qa.assumptions`, `qa.issues` oder im Szenenplan dokumentieren.
- Nach abgeschlossenem SVG-Text-Mapping und vor SVG-Arbeit alle Quell-SVGs des beauftragten Moduls stueckweise sichten und eine Sequenzlandkarte erstellen. Diese muss klaeren, welche SVGs zusammengehoeren, wo Animationen oder Uebergaenge liegen, welche Zustaende aufeinander aufbauen und welche Quell-SVG den vollstaendigsten Zielzustand zeigt.
- Ohne dokumentierten Sequenz-Preflight nach `workflow/20-scene-planning/preflight-sequence-planning.md` darf keine SVG-Produktion starten.
- Vor SVG-Arbeit fuer die aktive Einheit zusaetzlich Szenenplanung und Asset-Entscheidung erstellen.
- SVG-Produktion strikt arbeitseinheitsweise: eine Folie oder eine Sequenzgruppe, keine parallele Batch-Produktion.
- Verbindliche Produktionsschleife pro Arbeitseinheit: erst nach allen geladenen Richtlinien und Vorgehen erstellen, dann genau diese Folie beziehungsweise Sequenzgruppe rendern und per QA pruefen, danach alle gefundenen Befunde an derselben Arbeitseinheit verbessern und erneut pruefen. Erst wenn diese Schleife abgeschlossen ist, darf die naechste Folie oder Sequenzgruppe begonnen werden.
- Fuer jede neue SVG-Arbeitseinheit muss der Sequenzplan die exakten Quell-SVG-Referenzen maschinenlesbar in `analysis/rebuild-plans/<module_id>_source-reference-map.json` festhalten. Zusammengezogene Folien erhalten mehrere Referenzen; Zusatzfolien erhalten keine erfundene Quellreferenz.
- Der Sequenzplan vergibt fuer jede spaetere Zielszene eine stabile `Scene_ID`. Zusammengezogene Quell-SVGs ergeben eine gemeinsame Szene; Verschieben oder Ueberarbeiten darf eine bestehende `Scene_ID` nicht aendern.
- Der Sequenzplan ordnet jeder Zielszene den freigegebenen Sprechertext zu. Bei zusammengezogenen Folien werden die zugeordneten Sprechertextabschnitte in fachlich korrekter Reihenfolge verbunden, nicht frei gekuerzt oder umgeschrieben.
- Vor dem technischen SVG-QA wird der folienweise Content-Transfer-Crosscheck nach `workflow/60-quality/content-transfer-crosscheck.md` ausgefuehrt. Seine Befunde werden an derselben Folie behoben; erst danach folgt die technische Re-QA.
- Check-Befunde werden nicht als spaetere Sammelliste behandelt. Layout-, Text-, Diagramm-, Formel-, Timeline-, Asset- oder Animationsprobleme muessen unmittelbar fuer die aktuell aktive Arbeitseinheit korrigiert werden.
- Nutzerfeedback folgt verbindlich `workflow/00-router/review-feedback-learning-loop.md`: lokale Korrektur, Reichweitenentscheidung, Re-QA und Rueckfuehrung uebertragbarer Erkenntnisse in Audit, Skill, Fachworkflow oder QA. Eine Review-Notiz ist nicht abgeschlossen, solange diese Lernschleife offen ist.
- Mehrere Quell-SVGs, die Reveal, Morph oder Aufbau simulieren, zuerst als Sequenzgruppe analysieren.
- Mehrere Quell-SVGs, die durch Einblenden, Ausblenden, Verschieben, Hervorheben oder andere Animationen zu einer gemeinsamen Erklaergrafik werden koennen, werden zusammengezogen und als ein gemeinsames Ziel-SVG mit Layern geplant. Einzelne Preview-SVGs sind nur Review-/Pipeline-Zustaende, keine unabhaengigen Designs.
- Bestehende Quellgeometrie und Texte werden bevorzugt uebernommen und strukturell bereinigt. Ein Neuaufbau einzelner Elemente ist nur erforderlich, wenn die Quell-SVG technisch ungeeignet ist, die Zielstruktur dies verlangt oder ein Spezialworkflow fuer Plot, Formel, Timeline oder Asset greift.
- Die verbindliche Zielstruktur wird in `workflow/40-svg-production/target-svg-structure-contract.md` gepflegt und folgt `external-svg-asset-package-handoff/v1`.
- Sichtbare PowerPoint-Folientitel nicht automatisch in SVGs uebernehmen. Zusaetzlich keine neuen sichtbaren Meta-Header setzen: keine Modul-/Folien-Kicker, keine Workflow-Hinweise, keine globalen Szenentitel und keine Fokuszeilen im SVG, ausser der Nutzer verlangt sie ausdruecklich als Teil der Grafik.
- Fuer das aktuelle Downstream-Video-Repository gilt diese Trennung auch fuer als `full_slide` komponierte Ziel-SVGs: sichtbarer Folientitel, Titelakzent, Titeltrennlinie, Footertrennlinie, Trainingsfooter, Logo und Modul-/Szenenkennung werden ausschliesslich downstream gerendert. In `rebuild-proposals/svg/` bleiben nur Brandhintergrund, Fachinhalt, zugänglicher `<title>` und Metadaten.
- Die Text- und Informationsdichte orientiert sich an den Quell-SVGs. Eine neue Grafik darf klarer strukturiert sein, aber nicht deutlich leerer oder kuenstlich mit Zusatztext aufgefuellt werden.
- Boxtexte, Formeln, Legenden und Labels muessen gerendert lesbar sein und duerfen nicht ueberlaufen.
- Jedes neue oder grundlegend ueberarbeitete Content-SVG erhaelt Slide-Quality-Metadaten: `artifactScope`, `embeddingTarget`, `slideType`, `layoutIntent`, `takeaway`, `density`, `contentMode`, `backgroundMode`, `brandProfile`, `brandVariant`.
- Farben, Typografie, Abstaende, Radien und semantische Statusfarben kommen aus `brand/company-brand-tokens.json`. Die aktive Submarke ist `RelTest Education`; `RelTest Academy` ist eine Altbezeichnung. Die Education-Regeln in `brand/reltest-education-style-guide.md` und `agents/brand-guardian.md` haben Vorrang vor freien Designentscheidungen.
- Neue oder grundlegend ueberarbeitete SVGs verwenden `brandProfile=reltest-education`, Marineblau `#142452` als visuell fuehrende Inhaltsfarbe, Oxanium fuer Headlines/Auszeichnungen und Archivo fuer Fliesstext, Labels und Captions. Signalgruen `#00A653` kennzeichnet Education oder einen bewussten semantischen Fokus; weitere Buntfarben bleiben Diagramm-/Statusrollen vorbehalten. Gleichrangige Infoboxen verwenden dieselbe blaue Farbfamilie mit Tonwert- oder Transparenzabstufungen statt einer dekorativen Farbrotation.
- Neue oder grundlegend ueberarbeitete Piktogramme folgen
  `brand/reltest-education-pictogram-style-guide.md`,
  `brand/reltest-education-pictogram-tokens.json` und
  `workflow/30-visual-decision/pictogram-creation-workflow.md`. Sie muessen im
  Zielmassstab und bei 50-Prozent-Vieweransicht semantisch eindeutig bleiben.
- Piktogramme werden ausschliesslich als generierte PNG-Bildassets oder bereits
  freigegebene PNG-Library-Assets umgesetzt. Aus SVG-Pfaden, Grundformen,
  Symbolfonts oder einer SVG-Iconbibliothek konstruierte Piktogramme sind fuer
  neue und geaenderte Szenen nicht zulaessig.
- Bei einem ausdruecklichen Redesign-Auftrag zuerst den Modus `full_slide`, `content_svg` oder `module_redesign` festlegen. `full_slide` verwendet `brand/reltest-education-slide-design-tokens.json`; `content_svg` bleibt beim Content-SVG-Tokensystem und enthaelt weiterhin keine globalen Titel-, Footer-, Logo- oder Hintergrundelements.
- Ein Auftrag zur Umsetzung eines Kapitels, einer Lektion oder einer Folienfolge
  verwendet `module_redesign` als Planungsmodus und zusaetzlich
  `workflow/34-slide-redesign/chapter-implementation-quality-contract.md`.
  Nennt der Nutzer ein bestehendes Modul als Stilreferenz, werden dessen
  tatsaechliche freigegebene Ziel-SVGs als Referenz-Lock verwendet. Vollfolien als
  Referenz fuehren zu `full_slide`, sofern der Nutzer nicht ausdruecklich nur ein
  Content-SVG verlangt.
- Ein Redesign veraendert Struktur, Hierarchie und Darstellung, aber kuerzt ohne Nutzerauftrag keine fachlich relevanten Inhalte und entkoppelt den Sprechertext nicht.
- Vor Animation muss der statische Endzustand einer Szene gerendert und gegen
  Quelle sowie Referenzdesign freigegeben sein. Keine Serienproduktion eines neuen
  Archetyps, bevor dessen erste Szene diesen Pilot-Gate bestanden hat.
- Keine globale `text { fill: ... }`-Regel bei mehreren benoetigten Textfarben.
  Berechneten Textkontrast im Render pruefen. Normale RelTest-Verbinder bleiben bei
  1,5 bis 4 px; oberhalb von 6 px ist eine dokumentierte Spezialausnahme Pflicht.

## Diagramme Und Python-Plots

Alle echten Plots und technischen Diagramme mit Achsen, Datenpunkten, Kurven, Verteilungen, Wahrscheinlichkeitsnetzen, Fits oder Vertrauensgrenzen werden aus Python erzeugt. Die einzige Standardausnahme sind generische Timelines, Ausfall-Zeitstrahlen und Objekt-Zeitachsen, auf denen Ausfaelle nur didaktisch mit `X`/Kreuzen oder Zensierungen markiert werden.

Pflicht:

- zuerst `components/python-plot-library/diagram-registry.json` pruefen
- vorhandenen Generator nutzen, wenn passend
- sonst neuen Generator in `components/python-plot-library/` erstellen
- Generator in Registry und README dokumentieren
- SVG-only exportieren
- `reltest_plot_style.py` verwenden
- keine sichtbaren Plot-Titel
- Ausfallmarker auf Zeitachsen standardmaessig natuerlich unregelmaessig verteilen; gleichmaessige Abstaende nur bei belegten gleichmaessigen Zeitdaten oder abstrakten Prozessachsen.
- deutsche Plotlabels mit echten Umlauten setzen
- Achsenlabels, Ticklabels und Legenden gross genug fuer kleine Seminar-Szenen halten

Generische Timelines, Aufbauachsen, Ausfall-Zeitstrahlen und einfache Objekt-Zeitachsen sind keine Python-Plots. Dafuer gilt `workflow/33-timelines/timeline-workflow.md`.

Weibull-Vertrauensgrenzen:

- als 5 %- und 95 %-Grenzkurven darstellen
- keine gefuellten Baender, wenn Grenzen gefragt sind
- keine fast parallelen Regressions-Hilfslinien als Ersatz
- reproduzierbar per Seed und dokumentierter Bootstrap-Samplezahl
- kanonisch: `components/python-plot-library/weibull_confidence_plot.py`

## Formeln Und Timelines

Formeln folgen `workflow/32-formulas/formula-workflow.md`. Sie muessen mathematisch korrekt, einsteigerfreundlich und im SVG lesbar gesetzt werden.

Timelines folgen `workflow/33-timelines/timeline-workflow.md`. Marker duerfen nicht auf Pfeilspitzen liegen; Ausfaelle, Zensierungen und Beobachtungsenden muessen eindeutig unterscheidbar sein.

## Animation

Bei Auftraegen zur Animationsplanung, -umsetzung, -korrektur oder
Sprechertext-Synchronisierung ist
`.agents/skills/animate-svg-from-narration/SKILL.md` verbindlich.

Animation ist optional. Jede Szene erhaelt vor der SVG-Bearbeitung eine ausdrueckliche Entscheidung `static`, `animated` oder `needs_review` nach `workflow/50-animation/animation-decision-and-dramaturgy.md`. Eine statische, sofort vollstaendige Darstellung ist besser als eine willkuerliche oder technisch kleinteilige Animation. Es gibt keine Mindestzahl an Targets oder Schritten.

Animationsschritte werden aus fachlichen Erklaerabschnitten des vollstaendigen Sprechertexts und belegten Quellzustaenden abgeleitet, niemals aus DOM-Reihenfolge, Elementtyp, Knotenzahl oder gleichmaessig verteilten Textstellen. Zusammengehoerige Bestandteile werden als eine semantische Einheit animiert: Box mit Hintergrund, Rand, Text und Icon; Pfeil mit Label und Marker; Diagrammrahmen mit Achsen, Skalen, Ticks, Gitternetz und Achsenbeschriftungen. Im Zweifel wird groesser gruppiert oder statisch dargestellt.

Bei Diagrammen wird die Leselogik geplant: normalerweise zuerst der Diagrammrahmen, danach Daten, danach Fit-/Referenzlinien und zuletzt gemeinsam dargestellte Vertrauensgrenzen oder gezielte Highlights. Diese Reihenfolge gilt nur, wenn der Sprechertext sie traegt; ein als Ganzes erklaertes Diagramm bleibt statisch.

Vor der Triggerplanung wird der Initialzustand jeder semantischen Gruppe
ausdruecklich als sofort sichtbar, bis zum Trigger verborgen, statische Dekoration,
spaeter zu veraendern oder ausgeschlossen klassifiziert. Abhaengigkeiten wie
Endpunkt vor Verbinder, Objekt vor Label und Daten vor Fit sind verbindlich.

Szenenlayer laufen ueber stabile semantische Gruppen-IDs und `scene.animation.v1.json`. Oeffentliche Reviewer-Ziele tragen `data-anim-target="true"` und nach Moeglichkeit `data-anim-label`.

Manifesttypen sind getrennt: `scene.animation.v1.json` beschreibt Animationsziele und Schritte fuer SVG/PowerPoint-/Video-Integration. `assets/scenes/<scene_id>/manifest.json` ist ein Produktions-/Statusmanifest aus dem spaeteren Szenenprozess und wird nicht mit dem Animationsmanifest vermischt.

Fuer die externe Lieferung wird das interne Manifest in ein striktes, zum SVG namensgleiches `<svg-name>.animation.v1.json` ueberfuehrt. Es darf nur Felder aus `svgAnimationManifest/v1` enthalten. Jeder finale Schritt besitzt eine eindeutige `sourceText`-Phrase aus dem freigegebenen Sprechertext; Sekunden, Wortindizes, TTS-Zeitpunkte und finale Produktionsframes werden nicht erfunden.

Plotinterne Animationen folgen `components/python-plot-library/svg-animation-structure.md`. Gewuenschte Plot-Elemente werden als semantische DOM-Targets vorbereitet und ueber eindeutige `sourceText`-Phrasen aus dem Szenensprechertext ausgeloest, nicht ueber erfundene Sekundenwerte.

## Qualitaet Vor Rueckmeldung

Vor einer Fertigmeldung:

- passende Detailgates aus `workflow/60-quality/` anwenden
- Content-Transfer-Crosscheck gegen alle im Referenz-Mapping zugeordneten Quell-SVGs ausfuehren
- bei Redesigns auch unbelegte Zielergaenzungen gegen Quelle, Sprechertext und
  Nutzerauftrag pruefen
- bei Kapitelauftraegen fuer jede Szene Quellen-, Ziel- und Referenzpreview in
  Zielgroesse und verkleinert vergleichen; ohne Zielrender keine Fertigmeldung
- Animation erst nach dokumentierter statischer Freigabe pruefen und alle fachlich
  relevanten Zwischenzustaende rendern
- SVG XML-parsen
- Manifest-Targets gegen SVG-IDs pruefen
- bei Diagrammen Generator, Plot-Daten und Plot-SVG pruefen
- bei SVG-Modulen ausfuehren:

```text
node tools/svg-rebuild-qa.js <module_id> --viewer --slides <range> --expect-all
```

- fuer eine finale externe Lieferung zusaetzlich ausfuehren:

```text
node tools/svg-rebuild-qa.js --handoff-package delivery-packages/storyboard-import/<external-module-id> --strict-handoff --strict-design
```

Fuer neu erzeugte oder grundlegend ueberarbeitete SVGs gilt als Ziel-Freigabe zusaetzlich `--strict-design` und `--layout --layout-strict`. Wenn Browser oder
Renderer bei einem Kapitel-Redesign nicht verfuegbar sind, ist die visuelle
Freigabe blockiert; dieser Zustand darf nicht als fertige Umsetzung gemeldet
werden.

Wenn Browser, Renderer oder externe Pruefung nicht verfuegbar sind, das klar melden.

## Nicht Standard

Nicht mehr Standard fuer neue Basis-Rebuild-Auftraege:

- neue freie Expertentraining-Storyboards schreiben
- Sprechertexte neu formulieren
- direkt aus einer Storyboard-Zeile ein SVG bauen
- komplette Szenen als generiertes Bild erzeugen
- alte `Life Data Expert`-Quellen als fuehrenden Kurskontext behandeln
