# SVG Rebuild Production Runbook

Dieses Runbook gilt, sobald aus Basis-Seminar-Quellen echte SVG-Vorschlaege gebaut werden sollen.

Es ersetzt nicht die Analyse aus `workflow/basis-seminar-slide-rebuild-runbook.md`, sondern setzt danach an. Ziel ist keine 1:1-Kopie der alten PowerPoint-Folie, sondern eine didaktisch gleichwertige, sauber gestaltete E-Learning-Grafik im neuen Design.

Dieses Repo produziert fuer ein Basis-Seminar. Es darf kein Vorwissen in Zuverlaessigkeitstechnik vorausgesetzt werden. SVG-Vorschlaege muessen Begriffe, Diagramme, Formeln und Methoden so einfuehren, dass Einsteiger die Kernaussage nachvollziehen koennen.

## Grundsatz

Die alte PowerPoint ist Quelle fuer Inhalt, Reihenfolge und fachliche Aussage. Sie ist keine Layout-Schablone.

Die neue SVG ist eine Uebersetzung der Folie, keine Zusammenfassung. Fachlich relevante Inhalte, Begriffe, Formeln, Parameter, Beispiele, Diagrammlogik und methodische Schritte bleiben erhalten. Layout, visuelle Verpackung und Animation duerfen neu sein; die inhaltliche Aussage bleibt gleichwertig zur PowerPoint-Quelle und kompatibel mit dem bestehenden Sprechertext.

Die erzeugten Dateien sind standardmaessig Content-SVGs fuer spaetere PowerPoint-Einbettung. Sie sind eigenstaendige Inhaltsmodule, aber keine vollstaendigen PowerPoint-Folien. Deshalb werden keine PowerPoint-Masterelemente eingebaut: keine Foliennummern, Footer, globale Logo-Leisten, Praesentationsrahmen, Deck-Header oder wiederkehrende Navigationsleisten. Ein fachlicher Content-Titel oder Takeaway ist nur erlaubt, wenn er Teil des Inhaltsmoduls ist; der eigentliche PowerPoint-Folientitel kann ausserhalb des SVGs liegen.

Designentscheidungen folgen den zentralen Brand-/Design-Tokens in `brand/company-brand-tokens.json` und den vorhandenen Brand-Regeln unter `brand/`. Wenn echte Firmenfarben, Logos oder Praesentationsvorgaben nachgereicht werden, werden sie dort zentral ersetzt, nicht verstreut in einzelnen SVGs.

Echte Plots und technische Diagramme werden aus Python erstellt. Vor jeder Diagrammkomposition wird zuerst `components/python-plot-library/` geprueft. Wenn ein passender Generator existiert, wird er mit konkreten Daten, Achsenlabels und Einheiten genutzt. Wenn kein Generator passt, wird vor der SVG-Komposition ein neuer Python-Generator in dieser Library angelegt und im Registry dokumentiert. Python-Plotgeneratoren exportieren ausschliesslich SVG. Animierbare Plot-SVGs folgen vorlaeufig `components/python-plot-library/svg-animation-structure.provisional.md`. Handgezeichnete SVG-Diagrammvorlagen sind nicht mehr der Standard. Die Standardausnahme sind generische Timelines, Ausfall-Zeitstrahlen und einfache Objekt-Zeitachsen, auf denen Ausfaelle nur didaktisch mit `X`/Kreuzen oder Zensierungen markiert werden.

Python-Plots tragen keinen sichtbaren Titel. Das gleiche gilt fuer die Szenen-SVGs selbst: keine sichtbaren Foliennummern, Modul-Kicker, Workflow-Hinweise, Szenentitel oder Fokuszeilen oben links. Die SVG ist ein Bild-/Diagrammasset, nicht die komplette PowerPoint-Folie. Semantische Titel duerfen nur in `<title>`, `<desc>`, Dateinamen, Manifesten oder Review-Dokumentation stehen. Generische Timelines, Aufbauachsen, Ausfall-Zeitstrahlen und einfache Objekt-Zeitachsen sind keine Python-Plots; sie werden als didaktische SVG-Komposition mit Animationsebenen geplant.

SVG-Bausteine aus `components/svg-library/` sind Konstruktionshilfen fuer nicht-diagrammatische Formen wie Merkboxen oder Layoutbausteine. Sie duerfen nie blind als fertiges Design uebernommen werden. Jede Vorlage muss an Inhalt, Platzbedarf, Animation, Abstaende und Zielaussage angepasst werden.

Fuer kleine Zuordnungen in Formeln, Legenden und Callouts werden keine primitiven ASCII-Pfeile wie `->`, `=>` oder `-->` als sichtbarer Text verwendet. Stattdessen wird der wiederverwendbare Baustein `components/svg-library/definition-arrow.svg` genutzt oder bewusst an das Ziel-SVG angepasst.

## Arbeitsmodus: Eine Einheit Nach Der Anderen

Bevor eine einzelne Arbeitseinheit umgesetzt wird, muss fuer das gesamte beauftragte Modul der Sequenz-Preflight nach `workflow/20-scene-planning/preflight-sequence-planning.md` abgeschlossen sein. Dabei werden alle alten Folien stueckweise gesichtet und in `analysis/rebuild-plans/<module_id>_sequence_plan.md` dokumentiert.

Der Sequenz-Preflight muss bereits einen detaillierten SVG-Bauplan enthalten. Er beschreibt fuer jede geplante Arbeitseinheit Ziel-SVG, Manifest, Output-Art, Layoutidee, Darstellungsweise, Assets, Python-Plots, Formelassets, Timeline-Logik, Layerstruktur, Animationstrigger und QA-Schwerpunkte. Fehlt dieser Plan oder ist er nur eine grobe Folienuebersicht, wird die Produktion gestoppt und zuerst der Markdown-Plan ergaenzt.

Fuer jede geplante Folie gilt: der Folienordner ist das lokale Paket der Arbeitseinheit. Neben `slide_###.svg` und `scene.animation.v1.json` liegen dort auch alle fuer diese Folie erzeugten Plot-SVGs, Datenspezifikationen, Formel-SVGs, generierten oder extrahierten Bildassets und optionalen Asset-Manifeste. Globale Komponentenordner enthalten Generatoren, Bibliotheken und wiederverwendbare Quellen, aber keine alleinige Ablage fuer folienspezifische Render-Artefakte.

Es wird immer nur eine Arbeitseinheit aktiv bearbeitet:

- entweder eine einzelne echte Inhaltsfolie,
- oder eine Sequenzgruppe, wenn mehrere PowerPoint-Folien nur Animation, Reveal, Morph oder Aufbau derselben Grafik darstellen.

Mehrere PowerPoint-Folien, die durch Einblenden, Ausblenden, Verschieben, Zeichnen oder Hervorheben zu einer gemeinsamen Erklaergrafik werden koennen, werden zusammengezogen. Das Ergebnis ist ein gemeinsames Zielbild mit Layern; einzelne SVG-Dateien fuer alte Folien sind nur Preview-/Review-Zustaende, wenn sie gebraucht werden.

Batch-Erstellung mehrerer SVGs in einem Lauf ist fuer Produktionsarbeit verboten. Erst wenn eine Arbeitseinheit Szenenplanung, Asset-Entscheidung, Umsetzung, Render und visuellen Fehlercheck durchlaufen hat, darf die naechste Arbeitseinheit begonnen werden.

Pflichtschleife pro Arbeitseinheit:

1. Szenenplanung: didaktisches Zielbild, Inhalt, Neuinterpretation, visuelle Dramaturgie, Layout, Komponenten, Assets, Animation und erkennbare Risikostellen sauber ausarbeiten.
2. Asset-Entscheidung: jedes relevante visuelle Element nach `workflow/svg-asset-decision-gate.md` klassifizieren.
3. Plot-Erzeugung: fuer echte Plots und technische Diagramme den passenden Python-Generator nutzen oder neu anlegen und Plotassets erzeugen.
4. Umsetzung: genau dieses eine SVG beziehungsweise Master-SVG als Layout-, Callout- und Animationscontainer bauen.
5. Render: SVG als Bild oder im Viewer sichtbar pruefen.
6. Fehlercheck: Ueberlappungen, Achsen, Labels, Abstaende, Pfeile, Ausfallpunkte, Textfluss, Textbox-Ueberlauf, Asset-Erkennbarkeit und Gesamteindruck suchen.
7. Korrektur: gefundene Fehler beheben, dabei betroffene Gates erneut durchlaufen, und erneut rendern.
8. Freigabe fuer die naechste Einheit erst nach dokumentiertem Check.

Neuinterpretation ist ausdruecklich erlaubt: Wenn eine neue eLearning-Grafik denselben fachlichen Inhalt klarer vermittelt, ist sie dem 1:1-Nachbau vorzuziehen. Neuinterpretation darf aber keinen fachlich relevanten Inhalt entfernen.

## Verbotene Arbeitsweisen

- Folie fuer Folie nachbauen, ohne vorher Sequenzen zu gruppieren.
- Eine neue SVG inhaltlich deutlich leerer bauen als die PowerPoint-Quelle, ohne zu dokumentieren, wie der Inhalt anderweitig durch Grafik, Formel, Plot oder Animation getragen wird.
- Die erste SVG-Datei eines Moduls erstellen, bevor jede alte Quellfolie im Sequenz-Preflight einmal einzeln bewertet wurde.
- Einen Folien-Agenten direkt auf eine einzelne Folie ansetzen, wenn die modulweite Sequenzlandkarte noch fehlt oder offensichtlich veraltet ist.
- Animationsfolien als eigenstaendige Zielgrafiken behandeln.
- Standardbausteine unveraendert in Folien kopieren.
- Technische Diagramme als handgezeichnete SVG-Vorlagen beginnen, ohne zuerst die Python Plot Library zu pruefen.
- Echte Plots oder technische Diagrammgeometrie SVG-nativ improvisieren; SVG-native Erklaerskizzen sind nur fuer achsenlose didaktische Hilfsgrafiken ohne Datenpunkte, Kurven, Fits, Wahrscheinlichkeitsnetz oder Plotanspruch erlaubt. Einfache `X`-/Zensur-Timelines folgen dem Timeline-Workflow.
- Bei fehlendem Diagrammtyp ein einmaliges SVG zu improvisieren, statt einen neuen Python-Generator anzulegen.
- Ausfallzeiten auf Timelines gleichmaessig verteilen, ausser die Quelle zeigt eindeutig gleichmaessige Zeiten oder es handelt sich um eine abstrakte Prozessachse.
- Sichtbare Meta-Header in SVGs setzen, z.B. `RE3_TEST_1 · Folie 03`, `neuer Workflow`, Folientitel, Szenentitel oder Fokus-/Kontextzeilen oben links.
- PowerPoint-Masterelemente in Content-SVGs einbauen, z.B. Footer, Foliennummer, globale Logo-Leiste, Praesentationsrahmen oder Deck-Header.
- Farben, Schatten, Verlaeufe oder Card-Stile pro Folie frei erfinden, statt die Brand-/Design-Tokens zu nutzen oder eine begruendete Designausnahme zu dokumentieren.
- Eine PowerPoint-Folie 1:1 dekorativ nachzeichnen, obwohl eine klarere E-Learning-Grafik moeglich ist.
- Nach dem Rendern nur technisch validieren und keinen visuellen Cross-Check machen.
- Mehrere SVGs parallel oder in einem Generatorlauf erstellen, bevor die vorherige Einheit visuell freigegeben ist.
- Direkt mit SVG-Code beginnen, ohne vorher eine saubere Szenenplanung fuer diese Arbeitseinheit auszuarbeiten.
- Nutzerfeedback als schnellen lokalen Patch behandeln, ohne zu pruefen, ob dadurch Asset-Typ, Semantik, Animation oder Layout neu entschieden werden muessen.
- Komplexe Piktogramme, Werkzeugicons oder source-spezifische Bildsymbole als improvisierte SVG-Liniengrafik bauen.

## Phase 1: Modulweiter Sequenz-Preflight

Vor dem ersten SVG-Bau wird das gesamte relevante Folienpaket betrachtet:

- PPTX/OpenXML: Texte, Medien, Reihenfolge, Gruppen, Animationen.
- PNG-Kontaktbogen: sichtbare Zustaende und optische Entwicklung.
- PDF: gerenderter Endzustand und Formeln.
- Sprechertext: didaktische Reihenfolge.
- Analyse-JSONs: bekannte Muss-Inhalte, Quellanker, Annahmen und offene Fragen.

Die Sichtung erfolgt in Folienreihenfolge und stueckweise. Jede alte Folie wird im Sequenzplan einzeln bewertet, bevor Gruppen gebildet werden. Danach wird im gleichen Markdown-Artefakt geplant, welche SVG-Arbeitseinheiten daraus entstehen und wie diese spaeter gebaut werden sollen. In Phase 1 werden noch keine SVGs umgesetzt.

Output:

```text
analysis/rebuild-plans/<module_id>_sequence_plan.md
```

Pflichtfragen und der verbindliche SVG-Bauplan stehen in `workflow/20-scene-planning/preflight-sequence-planning.md`; das Standardformular ist `templates/module-sequence-plan-template.md`.

## Phase 2: Sequenzkarte

Aus der Einzelfoliensichtung werden alle Folien zuerst in Gruppen eingeteilt:

- `standalone`: echte einzelne Inhaltsfolie.
- `build_sequence`: mehrere Folien bauen dieselbe Grafik schrittweise auf.
- `morph_sequence`: mehrere Folien simulieren Bewegung oder Veraenderung.
- `detail_reveal`: eine Folie fuegt Detail, Formel, Label oder Messwert zu einer bestehenden Grafik hinzu.
- `duplicate_state`: Folie ist inhaltlich identisch oder nur minimaler Animationszustand.
- `skip_preview`: Zwischenzustand muss nicht separat als SVG gebaut werden.

Fuer jede Gruppe wird festgelegt:

- Welche Quellfolie zeigt den vollstaendigen Zielzustand?
- Welche Elemente sind in frueheren Zustaenden nur Animation?
- Welche Zwischenzustaende muessen als Preview entstehen?
- Welche Zwischenzustaende koennen leer bleiben oder auf den finalen SVG-Zustand zeigen?
- Welche Uebergaenge muessen im Manifest abgebildet werden?
- Welche Gruppen bauen visuell, fachlich oder datenseitig aufeinander auf?
- Welche Assets, Diagramme oder Formeldateien muessen gruppenuebergreifend konsistent bleiben?
- Welche SVG-Dateien, Master-SVG-Zustaende oder Manifest-only-Schritte spaeter entstehen sollen?
- Welche Darstellungstechnik fuer jedes Hauptvisual vorgesehen ist: native SVG, Python-Plot, Formel-SVG, eingebettetes Bildasset oder bewusste Auslassung?
- Welche Animationsebenen spaeter initial sichtbar, eingezeichnet, eingeblendet, bewegt, hervorgehoben oder ausgeblendet werden?

Regel:

Wenn PowerPoint mehrere Folien nur fuer Animation verwendet, ist die letzte vollstaendige Folie der primaere Inhaltsanker. Fruehere Folien beschreiben Animationen, nicht neue Designs.

Wenn mehrere Folien zusammengezogen werden, muss der Plan trotzdem zeigen, wo alle fachlich relevanten Quellinhalte sichtbar oder animiert erhalten bleiben.

## Phase 3: Quellen- Und Sprechertext-Abgleich

Vor dem kreativen Zielbild wird `workflow/source-slide-and-spoken-text-alignment.md` angewendet.

Fuer jede Arbeitseinheit wird eine Alignment-Notiz erstellt:

- Welche vorhandenen Folienelemente sind Inhalts- und Strukturanker?
- Welche Punkte kommen im relevanten Sprechertext vor?
- Welche dieser Punkte muessen im SVG sichtbar unterstuetzt werden?
- Welche Elemente duerfen neu interpretiert werden?
- Welche alten Elemente werden bewusst weggelassen und warum?

Die vorhandene Folie wird nicht blind kopiert, aber die neue Grafik muss erkennbar aus Quelle und Sprechertext abgeleitet sein. Der Sprechertext bleibt unveraendert; die SVG muss deshalb zum bestehenden Sprechertext passen.

## Phase 4: Didaktisches Zielbild

Vor dem Zeichnen wird fuer jede Gruppe ein Zielbild formuliert:

- Was soll der Lernende verstehen?
- Welches Vorwissen darf nicht vorausgesetzt werden?
- Welche Fachbegriffe oder Diagrammkonzepte muessen visuell eingefuehrt werden?
- Welche grafische Erzaehlung transportiert das am klarsten?
- Welche Inhalte muessen fachlich erhalten bleiben?
- Welche alten Layoutdetails duerfen wegfallen?
- Welche Elemente werden animiert eingeblendet, gezeichnet oder ausgeblendet?
- Wie bleibt die Informationsdichte der PowerPoint-Quelle erhalten?

Das Zielbild darf vom alten Layout abweichen, solange Inhalt, Sprechertext und fachliche Aussage erhalten bleiben.

Bei abstrakten oder fachlich anspruchsvollen Inhalten wird vor der Szenenplanung der `creative-scene-concept-designer` genutzt. Er entwickelt 2 bis 3 basisgerechte Szenenansaetze und empfiehlt eine Variante. Diese Empfehlung wird als Ausgangspunkt fuer den Design-Brief verwendet.

## Phase 5: Szenenplanung und Design-Brief

Pro Gruppe entsteht eine sorgfaeltige Szenenplanung. Das dokumentierte Artefakt darf kompakt sein, aber die Planung selbst muss gruendlich sein:

- didaktische Kernaussage und Lernmoment.
- Content-SVG-Metadaten: `artifactScope=content-svg`, `embeddingTarget=powerpoint-slide`, `slideType`, `layoutIntent`, `takeaway`, `density`, `contentMode`, `backgroundMode`, `brandProfile`, `brandVariant`.
- Brand-/Design-Token-Nutzung: verwendete Farbrollen, Typografieebenen, Abstandslogik und eventuelle Designausnahmen.
- Alignment zu vorhandenen Folien und Sprechertext: Muss-Inhalte, Quellanker und bewusste Auslassungen.
- Content-Equivalence: dokumentieren, wie der fachlich relevante Quellinhalt vollstaendig erhalten bleibt.
- Basis-Seminar-Annahme: welche Begriffe, Formeln oder Diagramme nicht vorausgesetzt werden duerfen.
- Ergebnis der kreativen Konzeptphase, wenn sie genutzt wurde: Optionen, bevorzugte Variante und Begruendung.
- visuelle Neuinterpretation oder bewusste Naehe zur Quelle.
- visuelle Dramaturgie: Was sieht der Lernende zuerst, was kommt spaeter hinzu, was wird bewusst weggelassen?
- Animationsdramaturgie: Welche Elemente erscheinen, verschwinden, bewegen sich oder werden hervorgehoben, wenn sie im Sprechertext erklaert werden?
- Hauptvisual, Nebenvisuals, Formeln, Labels.
- Plot-Plan fuer jedes echte technische Diagramm und jeden Plot: vorhandener Python-Generator oder neu anzulegender Generator, Datenquelle, Achsenlabels, Einheiten, Skalierung, Ausgabeformat und Zielpfad.
- Folienspezifische Artefaktablage: alle Plotassets, Formelassets, Datendateien und Bildassets bekommen Zielpfade innerhalb des jeweiligen Folienordners, z.B. `rebuild-proposals/svg/<module_id>/slide_###/plots/`, `data/`, `formulas/` oder `images/`.
- Layout-Raster und grobe Anordnung.
- Komponenten aus `components/python-plot-library/` und `components/svg-library/`, die angepasst oder erzeugt werden.
- PNG-Assets, die uebernommen, gecroppt oder neu erzeugt werden.
- Asset-Entscheidungstabelle nach `workflow/svg-asset-decision-gate.md`: fuer jedes relevante visuelle Element Strategie, Begruendung, Zielpfad und offene Frage.
- Animationsebenen und Triggergruppen.
- Was bewusst nicht nachgebaut wird.
- Warum eine bewusste Auslassung keine fachliche Inhaltsreduktion ist.
- Risikostellen fuer den spaeteren Cross-Check: enge Labels, komplexe Achsen, Formeln, kleine Marker, Pfeile, Ueberlappungsgefahr.
- Textboxen, Karten und Merkboxen mit konkretem Textbudget: geplanter Innenabstand, maximale Zeilenanzahl, Umbruchpunkte und Mindestreserve muessen vor dem SVG-Code feststehen.
- Sichtbare Titelregel: Das Zielbild enthaelt keine globale Ueberschrift. Wenn ein Bereich eine Beschriftung braucht, muss sie direkt an ein Objekt, Diagramm, Prozessschritt oder eine Box gebunden sein. Meta-Informationen wie Modul, Foliennummer, Workflow-Variante und Szenenfokus gehoeren nicht sichtbar ins SVG.
- Timeline-Plan: Bei jeder Ausfall-Zeitachse wird vor dem Zeichnen entschieden, ob die Positionen quellengetreu oder illustrativ sind. Illustrative Ausfallpositionen muessen unregelmaessig wirken und als solche im Plan stehen.

Erst danach darf ein SVG erstellt werden.

Der Design-Brief muss auch festhalten, ob die Quelle neu interpretiert wird. Wenn ja, wird nachvollziehbar begruendet, warum die neue Darstellung fuer eLearning klarer ist.

Als Standardformular wird `templates/svg-scene-brief-template.md` verwendet. Es ist kurz genug fuer eine einzelne Arbeitseinheit, erzwingt aber die Punkte, die im bisherigen Prozess leicht verloren gingen: Sprechertext-Abgleich, kreative Optionen, Textbudget, Animationsebenen und QA-Risikostellen.

## Phase 5a: Asset-Entscheidungs-Gate

Vor dem ersten SVG-Code wird `workflow/svg-asset-decision-gate.md` angewendet.

Pflicht:

- Alle sichtbaren oder semantisch wichtigen Quell-Elemente werden klassifiziert.
- Echte Plots und technische Diagramme werden als Python-Plot-SVG erzeugt.
- Formeln, Tabellen, Prozesspfeile und einfache didaktische Markierungen bleiben in der Regel SVG-nativ beziehungsweise Formel-SVG.
- Einfache Ausfall-Timelines und Objekt-Zeitachsen mit `X`-/Zensurmarkern bleiben SVG-native Timelines.
- Library-Komponenten werden nur als angepasste Ausgangsbasis genutzt.
- Komplexe Piktogramme, Werkzeug-/Methodensymbole, realistische Objekte und illustrative Einzelelemente werden als PNG-Assets erzeugt, extrahiert oder als Nutzerbedarf markiert.
- Wenn Nutzerfeedback ein Element benennt, wird diese Benennung als Semantik in die Asset-Entscheidung uebernommen.

Die Entscheidung wird im Szenenbrief oder Rebuild-Plan als Tabelle dokumentiert. Ohne diese Tabelle darf keine neue SVG-Arbeitseinheit als fertig gemeldet werden.

## Phase 6: Plot- Und Komponenten-Erzeugung

Python-Plot-Generatoren sind fuer Diagramme die Quelle der Datengeometrie:

- Zuerst `components/python-plot-library/diagram-registry.json` pruefen.
- Passenden Generator mit konkreten Daten, Achsenlabels und Einheiten ausfuehren.
- Wenn kein Generator passt, neuen Generator in `components/python-plot-library/` anlegen, `reltest_plot_style.py` verwenden und den Generator im Registry dokumentieren.
- Plotassets unter dem jeweiligen Folienordner ablegen, z.B. `rebuild-proposals/svg/<module_id>/slide_###/plots/<plot_id>.svg`.
- Plotdaten und Renderkonfigurationen, die fuer diese Folie gelten, daneben unter `data/` speichern, z.B. `rebuild-proposals/svg/<module_id>/slide_###/data/<plot_id>.json`.
- Gemeinsame Generatoren und wiederverwendbare Datenmodule duerfen in `components/python-plot-library/` bleiben; die konkrete gerenderte Ausgabe und der verwendete Datensnapshot gehoeren trotzdem in den Folienordner.
- Der Plot enthaelt keinen sichtbaren Titel. Falls ein Folien- oder Szenentitel noetig ist, wird er ausserhalb des Plotassets gesetzt.
- Sichtbare deutsche Plotlabels verwenden echte Umlaute und `ß`; Ersatzschreibungen wie `ae`, `oe`, `ue` oder `ss` sind fuer deutsche Woerter in Plotlabels nicht zulaessig.
- Generische Timelines, Aufbauachsen und Ausfall-Zeitstrahlen werden hier nicht erzeugt. Sie gehoeren in die SVG-Komposition, weil Animation, didaktische Gruppierung und Folienlayout dort fuehrend sind.
- Die erzeugten Plotassets werden im Szenen-SVG eingebunden oder mit SVG-nativen Callouts ergaenzt; die Plotgeometrie wird nicht im Szenen-SVG nachgezeichnet.

Nicht-diagrammatische SVG-Vorlagen werden nur als Ausgangspunkt genutzt:

- Merkbox: nur verwenden, wenn sie didaktisch noetig ist.

Jede uebernommene Vorlage und jeder erzeugte Plot muss im Ziel-SVG sichtbar an den Inhalt angepasst sein.

## Textbox-Und Box-Fit-Regeln

Graue, weisse oder farbige Boxen mit Text sind ein Risiko fuer Ueberlauf. Deshalb gilt:

- Boxen werden nicht als Standardlayout verwendet. Sie werden nur genutzt, wenn sie didaktisch oder strukturell helfen.
- Jede Box bekommt ein Textbudget: Innenabstand mindestens 24 px, bei kleinen Labels mindestens 16 px; unten und rechts bleibt eine sichtbare Reserve.
- Fuer jede Box wird vor dem Code ein grober Text-Bounding-Check gemacht: geplante Textbreite, Anzahl Zeilen, Zeilenhoehe und Innenabstand muessen kleiner als die Boxmasse sein. Wenn das nicht aufgeht, wird das Layout geaendert, nicht der Text spaeter herausragen gelassen.
- Lange Saetze werden vor dem Zeichnen gekuerzt, umbrochen oder aus der Box herausgenommen. Sprechertext traegt Erklaerung, die Grafik traegt nur knappe Labels.
- Fuer mehrzeiligen SVG-Text werden explizite `tspan`-Zeilen gesetzt. Es wird nicht darauf vertraut, dass SVG Text automatisch innerhalb einer Box umbricht.
- Wenn ein Text mehr als drei Zeilen in einer Karte braucht, muss zuerst die Gestaltung geaendert werden: Box vergroessern, Text aufteilen, als Randlabel setzen oder die Box weglassen.
- Schrift wird nicht beliebig verkleinert, um Ueberlauf zu kaschieren. Unter 20 px fuer normalen E-Learning-Text ist eine Ausnahme und muss begruendet werden.
- Formeln und Achsenlabels zaehlen ebenfalls als Textbox-Risiko, wenn sie in Panels oder Karten stehen.
- Vor dem Rendercheck wird fuer jede Box mental geprueft: passt der laengste Text plus Innenabstand sichtbar in die Box?

## Phase 7: SVG-Erstellung

Fuer Sequenzen gilt:

- Eine gemeinsame Layerstruktur pro Gruppe.
- Ein Master-SVG entsteht, wenn es fuer Review, Wiederverwendung oder Pipeline sinnvoll ist; sonst werden per-slide Preview-SVGs aus derselben geplanten Layerlogik erzeugt.
- Semantische Layer fuer Animationen.
- Preview-Dateien nur dort, wo sie fuer Review oder spaetere Animation sinnvoll sind.
- Animations-Zwischenfolien duerfen auf denselben finalen Zustand zeigen oder als `skip_preview` dokumentiert werden.

Fuer einzelne Inhaltsfolien gilt:

- Ein SVG pro Zielbild.
- Keine sichtbare PowerPoint-Hauptueberschrift und auch keine neu erfundene globale SVG-Ueberschrift. Nicht sichtbar erlaubt sind `<title>` und `<desc>` fuer Barrierefreiheit.
- Slide-Quality-Metadaten muessen im SVG-`<metadata id="slide-quality-metadata" type="application/json">` oder im zugehoerigen Manifest stehen.
- Das SVG funktioniert als skalierbares Content-Modul fuer PowerPoint: wichtige Inhalte liegen innerhalb der `viewBox`, externe Fonts und Stylesheets werden vermieden, Hintergrundmodus und Content-Modus sind dokumentiert.
- Text, Formeln, Timelines und einfache Achsen bleiben SVG-nativ; echte Plots und technische Diagramme werden als Python-SVG-Assets eingebunden.
- PNG nur fuer Piktogramme, komplexe Bilder oder illustrative Elemente ohne Fachtext.

Waehrend Phase 7 bleibt nur diese eine Arbeitseinheit im Fokus. Es werden keine weiteren Gruppen vorbereitet, gebaut oder gerendert, solange der Check dieser Einheit offen ist.

## Phase 8: Cross-Check

Jeder erzeugte SVG-Vorschlag wird gegen diese Referenzen geprueft:

- vollstaendige Zielzustandsfolie der Gruppe
- bei Bedarf fruehere Animationsfolien
- Sprechertextabschnitt
- Rebuild-Plan
- Python-Plot-Generator, Plot-Daten und erzeugtes Plotasset, falls die Szene ein Diagramm enthaelt
- gerenderte SVG-PNG

Pflichtfragen:

- Ist der Inhalt vergleichbar, aber nicht blind kopiert?
- Sind die vorhandenen Folien als Inhalts- und Strukturanker erkennbar beruecksichtigt?
- Wurde der relevante Sprechertext Punkt fuer Punkt gegen das SVG geprueft?
- Fehlt kein Begriff, Parameter, Beispiel, Diagramm, methodischer Schritt oder Unterschied, der im Sprechertext vorkommt und grafisch getragen werden muss?
- Sind Animationen als Layer geplant?
- Sind Ausfallzeiten und Datenpunkte aus dem Python-Plot-Generator plausibel unregelmaessig oder korrekt berechnet?
- Wirkt jede didaktische Ausfall-Zeitachse natuerlich unregelmaessig, sofern keine echten gleichmaessigen Zeiten vorliegen?
- Enthält die SVG irgendeinen sichtbaren globalen Titel, Modul-/Folien-Kicker, Workflow-Hinweis oder Fokuszeile, die nicht direkt Teil der Grafik ist?
- Sieht die Grafik nach E-Learning aus und nicht nach schnell platziertem Baukasten?
- Gibt es Ueberlappungen, abgeschnittene Texte, zu grosse Pfeile, falsche Achsenlabels oder lose Labels?
- Stimmen alle Asset-Entscheidungen sichtbar mit Quelle und Sprechertext ueberein?
- Wurden komplexe Piktogramme oder source-spezifische Icons als PNG eingebunden statt als improvisierte SVG-Liniengrafik?
- Sind lokale `<image>`-Assets vorhanden, erkennbar, richtig zugeschnitten und im Manifest dokumentiert?
- Endet irgendein Text sichtbar ausserhalb seiner grauen, weissen oder farbigen Box?
- Beruehrt Text den Boxrand oder wirkt er nur durch zu kleine Schrift hineingequetscht?
- Haben alle mehrzeiligen Boxtexte explizite Umbrueche und ausreichenden Zeilenabstand?
- Wurden alle sichtbaren Diagramme aus Python gerendert und angeschaut?
- Wurde wirklich nur diese eine Arbeitseinheit bewertet, ohne Befunde aus anderen Folien zu vermischen?

## Abbruchregel

Wenn der erste Cross-Check grobe Designfehler findet, wird nicht weiter skaliert. Erst wird genau diese Arbeitseinheit korrigiert, neu gerendert und erneut geprueft. Danach erst darf die naechste Folie oder Sequenzgruppe gebaut werden.

## Phase 8a: Automatisiertes SVG-QA-Gate

Nach dem visuellen Cross-Check wird zusaetzlich das automatische QA-Script ausgefuehrt:

```powershell
node tools\svg-rebuild-qa.js <module_id> --viewer --slides <range> --expect-all
```

Fuer neu erzeugte oder grundlegend ueberarbeitete SVGs ist die Ziel-Freigabe strenger:

```powershell
node tools\svg-rebuild-qa.js <module_id> --viewer --slides <range> --expect-all --strict-design
```

Wenn die browserbasierte Layout-QA verfuegbar ist, wird zusaetzlich hart geprueft:

```powershell
node tools\svg-rebuild-qa.js <module_id> --viewer --slides <range> --expect-all --layout --layout-strict
```

Wenn Browser/CDP/Layout-QA nicht verfuegbar ist, wird das nicht stillschweigend akzeptiert, sondern als Restrisiko im Szenenbrief oder Reviewbericht dokumentiert.

Beispiel:

```powershell
node tools\svg-rebuild-qa.js RE3_TEST_1 --viewer --slides 1-13 --expect-all
```

Das Script prueft:

- SVG-Dateien auf XML-Validitaet.
- `viewBox` und grobe Canvas-Plausibilitaet.
- doppelte SVG-IDs.
- fehlende interne `href`-Ziele.
- fehlende lokale `<image>`-Assets.
- verbotene inline `<animate>`-Elemente.
- Mojibake- und Replacement-Zeichen.
- sichtbare alte PowerPoint-Haupttitel.
- Animationsmanifeste auf existierende `svgPath`, `targets` und `steps`.
- Content-SVG-Metadaten fuer PowerPoint-Einbettung.
- unerwuenschte PowerPoint-Masterelemente, Generator-/Workflow-Metatexte und Placeholder.
- Mindestschriftgroessen, Textvolumen, Elementdichte und grobe Bounds.
- sichtbare Farben gegen `brand/company-brand-tokens.json`.
- Viewer-Zuordnung: alte Folie, SVG-Vorschlag, Animation und Alias-Status.

Neue Content-SVG-/Design-/Brand-Regeln laufen initial als Warnings. Fuer harte Designfreigaben wird der Strict-Modus genutzt:

```powershell
node tools\svg-rebuild-qa.js <module_id> --viewer --slides <range> --expect-all --strict-design
```

Der Report wird standardmaessig hier geschrieben:

```text
analysis/render-checks/<module_id>/automated-svg-qa/
```

Freigabe-Regel:

- `0 errors` ist Pflicht.
- Warnings werden bewertet und entweder behoben oder im Reviewbericht bewusst akzeptiert.
- Design-Warnings muessen bei neu erzeugten oder grundlegend ueberarbeiteten SVGs begruendet, behoben oder im Review dokumentiert werden.
- Ein bestandener automatischer QA-Lauf ersetzt nicht den visuellen Rendercheck, sondern verhindert wiederkehrende technische und organisatorische Fehler.

## Mindestartefakte

```text
analysis/rebuild-plans/<module_id>_sequence_plan.md
analysis/rebuild-plans/<module_id>_svg_rebuild_plan.json
rebuild-proposals/svg/<module_id>/<group_or_slide>.svg
analysis/animations/<module_id>_sequences.json
analysis/render-checks/<module_id>/
analysis/reports/<module_id>_svg_rebuild_review.md
analysis/render-checks/<module_id>/automated-svg-qa/svg-qa-report.md
```
