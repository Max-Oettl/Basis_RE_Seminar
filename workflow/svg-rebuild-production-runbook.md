# SVG Rebuild Production Runbook

Dieses Runbook gilt, sobald aus Basis-Seminar-Quellen echte SVG-Vorschlaege gebaut werden sollen.

Es ersetzt nicht die Analyse aus `workflow/basis-seminar-slide-rebuild-runbook.md`, sondern setzt danach an. Ziel ist keine 1:1-Kopie der alten PowerPoint-Folie, sondern eine didaktisch gleichwertige, sauber gestaltete E-Learning-Grafik im neuen Design.

Dieses Repo produziert fuer ein Basis-Seminar. Es darf kein Vorwissen in Zuverlaessigkeitstechnik vorausgesetzt werden. SVG-Vorschlaege muessen Begriffe, Diagramme, Formeln und Methoden so einfuehren, dass Einsteiger die Kernaussage nachvollziehen koennen.

## Grundsatz

Die alte PowerPoint ist Quelle fuer Inhalt, Reihenfolge und fachliche Aussage. Sie ist keine Layout-Schablone.

Echte technische Diagramme werden Python-first erstellt. Vor jeder Diagrammkomposition wird zuerst `components/python-plot-library/` geprueft. Wenn ein passender Generator existiert, wird er mit konkreten Daten, Achsenlabels und Einheiten genutzt. Wenn kein Generator passt, wird vor der SVG-Komposition ein neuer Python-Generator in dieser Library angelegt und im Registry dokumentiert. Python-Plotgeneratoren exportieren ausschliesslich SVG. Animierbare Plot-SVGs folgen vorlaeufig `components/python-plot-library/svg-animation-structure.provisional.md`. Handgezeichnete SVG-Diagrammvorlagen sind nicht mehr der Standard.

Python-Plots tragen keinen sichtbaren Titel. Folien- und Szenentitel werden ausserhalb des Plotassets gesetzt. Generische Timelines, Aufbauachsen und Ausfall-Zeitstrahlen sind keine Python-Plots; sie werden als didaktische SVG-Komposition mit Animationsebenen geplant.

SVG-Bausteine aus `components/svg-library/` sind Konstruktionshilfen fuer nicht-diagrammatische Formen wie Merkboxen oder Layoutbausteine. Sie duerfen nie blind als fertiges Design uebernommen werden. Jede Vorlage muss an Inhalt, Platzbedarf, Animation, Abstaende und Zielaussage angepasst werden.

## Arbeitsmodus: Eine Einheit Nach Der Anderen

Es wird immer nur eine Arbeitseinheit aktiv bearbeitet:

- entweder eine einzelne echte Inhaltsfolie,
- oder eine Sequenzgruppe, wenn mehrere PowerPoint-Folien nur Animation, Reveal, Morph oder Aufbau derselben Grafik darstellen.

Batch-Erstellung mehrerer SVGs in einem Lauf ist fuer Produktionsarbeit verboten. Erst wenn eine Arbeitseinheit Szenenplanung, Asset-Entscheidung, Umsetzung, Render und visuellen Fehlercheck durchlaufen hat, darf die naechste Arbeitseinheit begonnen werden.

Pflichtschleife pro Arbeitseinheit:

1. Szenenplanung: didaktisches Zielbild, Inhalt, Neuinterpretation, visuelle Dramaturgie, Layout, Komponenten, Assets, Animation und erkennbare Risikostellen sauber ausarbeiten.
2. Asset-Entscheidung: jedes relevante visuelle Element nach `workflow/svg-asset-decision-gate.md` klassifizieren.
3. Plot-Erzeugung: fuer Diagramme den passenden Python-Generator nutzen oder neu anlegen und Plotassets erzeugen.
4. Umsetzung: genau dieses eine SVG beziehungsweise Master-SVG als Layout-, Callout- und Animationscontainer bauen.
5. Render: SVG als Bild oder im Viewer sichtbar pruefen.
6. Fehlercheck: Ueberlappungen, Achsen, Labels, Abstaende, Pfeile, Ausfallpunkte, Textfluss, Textbox-Ueberlauf, Asset-Erkennbarkeit und Gesamteindruck suchen.
7. Korrektur: gefundene Fehler beheben, dabei betroffene Gates erneut durchlaufen, und erneut rendern.
8. Freigabe fuer die naechste Einheit erst nach dokumentiertem Check.

Neuinterpretation ist ausdruecklich erlaubt: Wenn eine neue eLearning-Grafik denselben fachlichen Inhalt klarer vermittelt, ist sie dem 1:1-Nachbau vorzuziehen.

## Verbotene Arbeitsweisen

- Folie fuer Folie nachbauen, ohne vorher Sequenzen zu gruppieren.
- Animationsfolien als eigenstaendige Zielgrafiken behandeln.
- Standardbausteine unveraendert in Folien kopieren.
- Technische Diagramme als handgezeichnete SVG-Vorlagen beginnen, ohne zuerst die Python Plot Library zu pruefen.
- Bei fehlendem Diagrammtyp ein einmaliges SVG zu improvisieren, statt einen neuen Python-Generator anzulegen.
- Ausfallzeiten, Datenpunkte oder Marker gleichmaessig verteilen, wenn die Quelle unregelmaessige Werte zeigt oder die Aussage Unregelmaessigkeit verlangt.
- Eine PowerPoint-Folie 1:1 dekorativ nachzeichnen, obwohl eine klarere E-Learning-Grafik moeglich ist.
- Nach dem Rendern nur technisch validieren und keinen visuellen Cross-Check machen.
- Mehrere SVGs parallel oder in einem Generatorlauf erstellen, bevor die vorherige Einheit visuell freigegeben ist.
- Direkt mit SVG-Code beginnen, ohne vorher eine saubere Szenenplanung fuer diese Arbeitseinheit auszuarbeiten.
- Nutzerfeedback als schnellen lokalen Patch behandeln, ohne zu pruefen, ob dadurch Asset-Typ, Semantik, Animation oder Layout neu entschieden werden muessen.
- Komplexe Piktogramme, Werkzeugicons oder source-spezifische Bildsymbole als improvisierte SVG-Liniengrafik bauen.

## Phase 1: Vollstaendige Quellenansicht

Vor jedem SVG-Bau wird das gesamte relevante Folienpaket betrachtet:

- PPTX/OpenXML: Texte, Medien, Reihenfolge, Gruppen, Animationen.
- PNG-Kontaktbogen: sichtbare Zustaende und optische Entwicklung.
- PDF: gerenderter Endzustand und Formeln.
- Sprechertext: didaktische Reihenfolge.

Output:

```text
analysis/rebuild-plans/<module_id>_svg_rebuild_plan.json
```

## Phase 2: Sequenzkarte

Alle Folien werden zuerst in Gruppen eingeteilt:

- `standalone`: echte einzelne Inhaltsfolie.
- `build_sequence`: mehrere Folien bauen dieselbe Grafik schrittweise auf.
- `morph_sequence`: mehrere Folien simulieren Bewegung oder Veraenderung.
- `duplicate_state`: Folie ist inhaltlich identisch oder nur minimaler Animationszustand.
- `skip_preview`: Zwischenzustand muss nicht separat als SVG gebaut werden.

Fuer jede Gruppe wird festgelegt:

- Welche Quellfolie zeigt den vollstaendigen Zielzustand?
- Welche Elemente sind in frueheren Zustaenden nur Animation?
- Welche Zwischenzustaende muessen als Preview entstehen?
- Welche Zwischenzustaende koennen leer bleiben oder auf den finalen SVG-Zustand zeigen?

Regel:

Wenn PowerPoint mehrere Folien nur fuer Animation verwendet, ist die letzte vollstaendige Folie der primaere Inhaltsanker. Fruehere Folien beschreiben Animationen, nicht neue Designs.

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

Das Zielbild darf vom alten Layout abweichen, solange Inhalt, Sprechertext und fachliche Aussage erhalten bleiben.

Bei abstrakten oder fachlich anspruchsvollen Inhalten wird vor der Szenenplanung der `creative-scene-concept-designer` genutzt. Er entwickelt 2 bis 3 basisgerechte Szenenansaetze und empfiehlt eine Variante. Diese Empfehlung wird als Ausgangspunkt fuer den Design-Brief verwendet.

## Phase 5: Szenenplanung und Design-Brief

Pro Gruppe entsteht eine sorgfaeltige Szenenplanung. Das dokumentierte Artefakt darf kompakt sein, aber die Planung selbst muss gruendlich sein:

- didaktische Kernaussage und Lernmoment.
- Alignment zu vorhandenen Folien und Sprechertext: Muss-Inhalte, Quellanker und bewusste Auslassungen.
- Basis-Seminar-Annahme: welche Begriffe, Formeln oder Diagramme nicht vorausgesetzt werden duerfen.
- Ergebnis der kreativen Konzeptphase, wenn sie genutzt wurde: Optionen, bevorzugte Variante und Begruendung.
- visuelle Neuinterpretation oder bewusste Naehe zur Quelle.
- visuelle Dramaturgie: Was sieht der Lernende zuerst, was kommt spaeter hinzu, was wird bewusst weggelassen?
- Hauptvisual, Nebenvisuals, Formeln, Labels.
- Plot-Plan fuer jedes echte technische Diagramm: vorhandener Python-Generator oder neu anzulegender Generator, Datenquelle, Achsenlabels, Einheiten, Skalierung, Ausgabeformat und Zielpfad.
- Layout-Raster und grobe Anordnung.
- Komponenten aus `components/python-plot-library/` und `components/svg-library/`, die angepasst oder erzeugt werden.
- PNG-Assets, die uebernommen, gecroppt oder neu erzeugt werden.
- Asset-Entscheidungstabelle nach `workflow/svg-asset-decision-gate.md`: fuer jedes relevante visuelle Element Strategie, Begruendung, Zielpfad und offene Frage.
- Animationsebenen und Triggergruppen.
- Was bewusst nicht nachgebaut wird.
- Risikostellen fuer den spaeteren Cross-Check: enge Labels, komplexe Achsen, Formeln, kleine Marker, Pfeile, Ueberlappungsgefahr.
- Textboxen, Karten und Merkboxen mit konkretem Textbudget: geplanter Innenabstand, maximale Zeilenanzahl, Umbruchpunkte und Mindestreserve muessen vor dem SVG-Code feststehen.

Erst danach darf ein SVG erstellt werden.

Der Design-Brief muss auch festhalten, ob die Quelle neu interpretiert wird. Wenn ja, wird nachvollziehbar begruendet, warum die neue Darstellung fuer eLearning klarer ist.

Als Standardformular wird `templates/svg-scene-brief-template.md` verwendet. Es ist kurz genug fuer eine einzelne Arbeitseinheit, erzwingt aber die Punkte, die im bisherigen Prozess leicht verloren gingen: Sprechertext-Abgleich, kreative Optionen, Textbudget, Animationsebenen und QA-Risikostellen.

## Phase 5a: Asset-Entscheidungs-Gate

Vor dem ersten SVG-Code wird `workflow/svg-asset-decision-gate.md` angewendet.

Pflicht:

- Alle sichtbaren oder semantisch wichtigen Quell-Elemente werden klassifiziert.
- Diagramme, Achsen, Formeln, Tabellen und Prozesspfeile bleiben in der Regel SVG-nativ.
- Library-Komponenten werden nur als angepasste Ausgangsbasis genutzt.
- Komplexe Piktogramme, Werkzeug-/Methodensymbole, realistische Objekte und illustrative Einzelelemente werden als PNG-Assets erzeugt, extrahiert oder als Nutzerbedarf markiert.
- Wenn Nutzerfeedback ein Element benennt, wird diese Benennung als Semantik in die Asset-Entscheidung uebernommen.

Die Entscheidung wird im Szenenbrief oder Rebuild-Plan als Tabelle dokumentiert. Ohne diese Tabelle darf keine neue SVG-Arbeitseinheit als fertig gemeldet werden.

## Phase 6: Plot- Und Komponenten-Erzeugung

Python-Plot-Generatoren sind fuer Diagramme die Quelle der Datengeometrie:

- Zuerst `components/python-plot-library/diagram-registry.json` pruefen.
- Passenden Generator mit konkreten Daten, Achsenlabels und Einheiten ausfuehren.
- Wenn kein Generator passt, neuen Generator in `components/python-plot-library/` anlegen, `reltest_plot_style.py` verwenden und den Generator im Registry dokumentieren.
- Plotassets unter `assets/plots/<module_id>/` oder einem im Szenenbrief dokumentierten Pfad ablegen.
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
- Lange Saetze werden vor dem Zeichnen gekuerzt, umbrochen oder aus der Box herausgenommen. Sprechertext traegt Erklaerung, die Grafik traegt nur knappe Labels.
- Fuer mehrzeiligen SVG-Text werden explizite `tspan`-Zeilen gesetzt. Es wird nicht darauf vertraut, dass SVG Text automatisch innerhalb einer Box umbricht.
- Wenn ein Text mehr als drei Zeilen in einer Karte braucht, muss zuerst die Gestaltung geaendert werden: Box vergroessern, Text aufteilen, als Randlabel setzen oder die Box weglassen.
- Schrift wird nicht beliebig verkleinert, um Ueberlauf zu kaschieren. Unter 20 px fuer normalen E-Learning-Text ist eine Ausnahme und muss begruendet werden.
- Formeln und Achsenlabels zaehlen ebenfalls als Textbox-Risiko, wenn sie in Panels oder Karten stehen.
- Vor dem Rendercheck wird fuer jede Box mental geprueft: passt der laengste Text plus Innenabstand sichtbar in die Box?

## Phase 7: SVG-Erstellung

Fuer Sequenzen gilt:

- Ein Master-SVG pro Gruppe.
- Semantische Layer fuer Animationen.
- Preview-Dateien nur dort, wo sie fuer Review oder spaetere Animation sinnvoll sind.
- Animations-Zwischenfolien duerfen auf denselben finalen Zustand zeigen oder als `skip_preview` dokumentiert werden.

Fuer einzelne Inhaltsfolien gilt:

- Ein SVG pro Zielbild.
- Keine sichtbare PowerPoint-Hauptueberschrift, wenn der Titel spaeter ausserhalb des SVG gesetzt wird.
- Text, Formeln und Achsen bleiben SVG-nativ.
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
- Viewer-Zuordnung: alte Folie, SVG-Vorschlag, Animation und Alias-Status.

Der Report wird standardmaessig hier geschrieben:

```text
analysis/render-checks/<module_id>/automated-svg-qa/
```

Freigabe-Regel:

- `0 errors` ist Pflicht.
- Warnings werden bewertet und entweder behoben oder im Reviewbericht bewusst akzeptiert.
- Ein bestandener automatischer QA-Lauf ersetzt nicht den visuellen Rendercheck, sondern verhindert wiederkehrende technische und organisatorische Fehler.

## Mindestartefakte

```text
analysis/rebuild-plans/<module_id>_svg_rebuild_plan.json
rebuild-proposals/svg/<module_id>/<group_or_slide>.svg
analysis/animations/<module_id>_sequences.json
analysis/render-checks/<module_id>/
analysis/reports/<module_id>_svg_rebuild_review.md
analysis/render-checks/<module_id>/automated-svg-qa/svg-qa-report.md
```
