# Basis Seminar Rebuild Rules

Diese Datei definiert den verpflichtenden Standardprozess fuer Codex in diesem Repo.

## Primaerer Auftrag

Dieses Repo dient ab jetzt der Rebuild-Analyse des bestehenden Basis-Seminars `Reliability Engineer`.

Ziel ist keine freie Neugestaltung, keine fachliche Neutextung und keine direkte SVG-Produktion. Ziel ist eine praezise, quellenbelegte Spezifikation, mit der jede bestehende Folie spaeter im neuen Corporate Design neu aufgebaut werden kann.

Das Zielpublikum ist das Basis-Seminar. Es darf kein Vorwissen in Zuverlaessigkeitstechnik vorausgesetzt werden. Fachbegriffe, Diagramme, Formeln und Methoden muessen so geplant werden, dass Einsteiger die Kernaussage schrittweise verstehen koennen.

Der Sprechertext bleibt unveraendert. Er wird aus den vorhandenen Referenzdateien verknuepft und nicht umgeschrieben.

## Vorrang Bei Konflikten

Wenn alte Dateien im Repo noch Storyboard-, Expertentraining- oder SVG-Produktion beschreiben, gilt fuer neue Auftraege:

1. ausdruecklicher Nutzerauftrag
2. diese Datei `AGENT.md`
3. `workflow/basis-seminar-slide-rebuild-runbook.md`
4. `workflow/source-slide-and-spoken-text-alignment.md`
5. bei SVG-Vorschlaegen: `workflow/svg-rebuild-production-runbook.md`
6. bei SVG-Vorschlaegen: `workflow/svg-asset-decision-gate.md`
7. `workflow/slide-rebuild-json-contract.md`
8. optionale nachgelagerte Workflowdateien nur bei ausdruecklichem Auftrag fuer Visual- oder Exportproduktion

## Quellenrangfolge

Jede Folie wird aus mehreren Quellen analysiert:

- PowerPoint `.pptx`
- PDF `.pdf`
- PNG pro Folie `.png`
- Sprechertext `.md`

Wenn Quellen voneinander abweichen, gilt:

1. Sprechertext-Datei gewinnt fuer gesprochenen Text.
2. PNG gewinnt fuer sichtbaren Zustand und visuelle Gewichtung.
3. PDF gewinnt fuer final gerenderten Text, Formeln und Seitenreihenfolge.
4. PPTX gewinnt fuer Objektstruktur, Koordinaten, Ebenen, Gruppen und Animationen.

Abweichungen werden in `qa.issues` dokumentiert.

## Pflichtlektuere Vor Rebuild-Arbeit

Vor einer Folienanalyse liest Codex:

1. `AGENT.md`
2. `workflow/basis-seminar-slide-rebuild-runbook.md`
3. `workflow/slide-rebuild-json-contract.md`
4. `analysis/slide-rebuild.schema.json`
5. `source-materials/README.md`
6. passende Modulquellen unter `source-materials/basis-seminar/`

Vor einem SVG-Rebuild oder einer SVG-Korrektur liest Codex zusaetzlich:

1. `workflow/svg-rebuild-production-runbook.md`
2. `workflow/svg-asset-decision-gate.md`
3. `workflow/graphic-creation-quality-gate.md`
4. `templates/svg-scene-brief-template.md`
5. bei Diagrammen: `workflow/diagram-guidelines.md` und `components/python-plot-library/README.md`

## Standardoutput

Pro Folie entsteht eine JSON-Datei:

```text
analysis/slides/slide_001_rebuild.json
```

Alternativ kann ein Modul eine Sammeldatei enthalten:

```text
analysis/modules/re1_module_01_rebuild.json
```

Auch in Sammeldateien muss jede Folie dem Folienvertrag folgen.

Pro Modul entsteht zusaetzlich ein Report:

```text
analysis/reports/re1_module_01_report.md
```

## Koordinatenregel

Alle raeumlichen Angaben werden normalisiert gespeichert:

```json
{
  "coordinate_system": "normalized_1000",
  "origin": "top_left",
  "width": 1000,
  "height": 562.5,
  "aspect_ratio": "16:9"
}
```

Bounding Boxes verwenden `x`, `y`, `w`, `h` in diesem Koordinatensystem.

## Arbeitsregeln

- Sichtbarer Text wird exakt erfasst.
- Sprechertext wird nicht korrigiert, ergaenzt oder stilistisch geglaettet.
- Fachliche Aussage, didaktische Reihenfolge und funktionale Folienstruktur bleiben erhalten.
- Inhalte werden fuer Basis-Seminar-Lernende geplant. Expertensprache, Fachabkuerzungen und mathematische Kurzschluesse duerfen nicht als bekannt vorausgesetzt werden.
- Die vorhandenen Folien bleiben Inhalts- und Strukturanker. Neue SVGs duerfen didaktisch neu gestaltet werden, muessen sich aber an sichtbarer Aussage, Reihenfolge, Beispielen, Begriffen, Diagrammen und Hervorhebungen der Quelle orientieren.
- Der Sprechertext bleibt bestehen. Vor dem SVG-Bau und vor der Freigabe wird geprueft, dass keine im Sprechertext relevante Aussage, kein Begriff, kein Parameter, keine Formel und kein methodischer Schritt fehlt.
- Corporate Design wird als semantisches Mapping beschrieben, nicht als Kopie alter Farben.
- Text, Tabellen, Diagramme, Formeln und Prozesslogik werden fuer SVG/Text-Rebuild vorgesehen.
- Vor jedem SVG-Bau muss das gesamte relevante Folienpaket betrachtet und in `analysis/rebuild-plans/<module_id>_svg_rebuild_plan.json` als Sequenzkarte dokumentiert werden.
- Vor jedem SVG-Bau muss eine Alignment-Notiz nach `workflow/source-slide-and-spoken-text-alignment.md` vorliegen: Quellfolienanker, Sprechertextpunkte, Muss-Inhalte, erlaubte Neuinterpretation und bewusst weggelassene Elemente.
- Vor jedem SVG-Bau und vor jeder SVG-Korrektur muss `workflow/svg-asset-decision-gate.md` angewendet werden. Jedes relevante visuelle Element bekommt eine dokumentierte Strategie: `python_plot_library`, `new_python_plot_generator`, `native_svg`, `library_svg_adapted`, `generated_png`, `extracted_png`, `user_asset_required` oder `omit_with_reason`.
- Echte technische Diagramme mit Achsen, Datenpunkten, Kurven, Verteilungen oder Wahrscheinlichkeitsnetzen werden zuerst aus der Python Plot Library unter `components/python-plot-library/` erzeugt. Wenn kein passender Generator existiert, wird vor der SVG-Komposition ein neuer Python-Generator in dieser Library angelegt und dokumentiert. Generische Timelines, Aufbauachsen und Ausfall-Zeitstrahlen sind keine Python-Plots; sie werden als didaktische SVG-Komposition geplant.
- Python-Plotgeneratoren exportieren ausschliesslich SVG. Falls fuer Review oder QA ein PNG benoetigt wird, wird es ausserhalb des Plotgenerators aus dem SVG erzeugt. Animierbare Plot-SVGs folgen vorlaeufig `components/python-plot-library/svg-animation-structure.provisional.md`: gewuenschte Plot-Elemente werden als stabile SVG-Targets vorbereitet und koennen ueber Zeittrigger, zum Beispiel nach 3 Sekunden, eingeblendet werden. Ob ein Element animiert werden soll, wird direkt beim Erstellen oder nachtraeglich in den Verbesserungsnotizen festgelegt.
- Python-Plots werden im Seminar oft kleiner skaliert und als Erklaervisualisierung genutzt. Achsenbeschriftungen, Ticklabels und Legenden muessen deshalb auch bei reduzierter Darstellungsbreite lesbar bleiben. Der zentrale Stil `reltest_plot_style.py` setzt diese Elemente bewusst groesser als klassische Paper-Abbildungen; neue Generatoren duerfen diese Schriftgroessen nicht lokal verkleinern, ausser der Szenenbrief begruendet es.
- SVG-Produktion laeuft immer strikt einzeln: genau eine Inhaltsfolie oder genau eine Sequenzgruppe ist aktiv. Keine Batch-Erstellung und kein paralleles Bauen mehrerer SVGs.
- Vor dem ersten SVG-Code muss fuer diese eine Arbeitseinheit eine saubere Szenenplanung vorliegen: didaktisches Ziel, Neuinterpretation oder Erhalt der Altlogik, visuelle Dramaturgie, Layout, Komponenten, Assets, geplante Animationsebenen und erkennbare Risikostellen.
- Vor dem visuellen Design soll der `creative-scene-concept-designer` fuer anspruchsvolle oder abstrakte Inhalte mindestens zwei einsteigerfreundliche Szenenansaetze entwickeln und eine bevorzugte Variante begruenden.
- Mehrere PPTX-Folien, die nur Animation, Reveal, Morph oder Aufbau simulieren, werden zuerst als Gruppe analysiert. Der letzte vollstaendige Zustand ist der primaere Inhaltsanker; Zwischenfolien sind Animationshinweise, keine automatischen Einzel-SVG-Auftraege.
- Der alte PowerPoint-Stand ist Inhaltsquelle, nicht Layoutschablone. SVG-Vorschlaege duerfen den Inhalt didaktisch gleichwertig neu darstellen, statt die alte Folie 1:1 nachzubauen.
- Neuinterpretation ist erlaubt und bei besserer Lernwirkung gewuenscht, solange Sprechertext, fachliche Aussage und notwendige Inhalte erhalten bleiben.
- SVG-Vorschlaege sind keine vollstaendigen PowerPoint-Folien. Sichtbare Hauptueberschriften, Folientitel und automatisch gesetzte Kapiteltexte werden nicht ins SVG geschrieben, ausser der Nutzer fordert sie explizit als Teil der Grafik.
- Fazit-, Merksatz- oder Zusammenfassungsboxen werden nur eingebaut, wenn sie didaktisch notwendig sind. Bei einfachen Aufbauzustaenden oder sehr wenig Inhalt bleiben sie weg.
- Textboxen, Karten, Merkboxen und Legenden duerfen nur verwendet werden, wenn ihr Textbudget vor dem SVG-Code geplant ist. Text muss im gerenderten SVG mit sichtbarem Innenabstand in der Box bleiben; jeder Boxtext-Ueberlauf ist ein Freigabefehler und wird vor Rueckmeldung korrigiert.
- Wiederkehrende echte technische Diagramme werden aus `components/python-plot-library/` erzeugt, bevor SVG-native Diagrammgeometrie gebaut wird. Wiederkehrende nicht-diagrammatische SVG-Grundformen werden aus `components/svg-library/` abgeleitet. Beide Libraries sind Konstruktionshilfen, keine fertigen Folienlayouts; jede Verwendung muss an Inhalt, Geometrie, Abstaende, Beschriftungen und Animation angepasst werden.
- Python-Plots tragen keinen sichtbaren Titel. Folien- oder Szenentitel werden ausserhalb des Plotassets gesetzt, wenn sie gebraucht werden.
- Sichtbare deutsche Plotlabels verwenden echte Umlaute und `ß`; Ersatzschreibungen wie `ae`, `oe`, `ue` oder `ss` sind fuer deutsche Woerter in Plotlabels nicht zulaessig.
- Vertrauensgrenzen in Weibull- oder vergleichbaren Wahrscheinlichkeitsnetzen werden als klare 5 %- und 95 %-Grenzkurven dargestellt. Gefuellte Vertrauensbaender oder zufaellig wirkende Flaechen sind dafuer nicht zulaessig, wenn explizit Vertrauensgrenzen gefragt sind. Bootstrap-basierte Grenzen muessen ueber festen Seed und dokumentierte Samplezahl reproduzierbar erzeugt werden. Fuer Weibull-Vertrauensgrenzen gilt `components/python-plot-library/weibull_confidence_plot.py` als kanonische Darstellung: blauer Fit, offene rote Ausfallpunkte und zwei graue, gestrichelte, nicht-parallele 5 %- und 95 %-Bootstrap-Grenzkurven. Klassische lineare Regressions-Vertrauenslinien ersetzen diese Darstellung nicht.
- Ausfallzeiten, Datenpunkte und Marker werden nicht gleichmaessig verteilt, wenn die Quelle oder fachliche Aussage unregelmaessige Werte verlangt.
- Achsenpfeile muessen proportional sein; Marker duerfen nicht auf Pfeilspitzen oder Pfeilkoepfen liegen. Achsentitel und Labels muessen innerhalb ihres vorgesehenen Layoutbereichs bleiben.
- Wenn mehrere PowerPoint-Folien nur Aufbau-, Reveal- oder Morph-Zustaende derselben Grafik sind, wird zuerst ein Master-SVG mit ein-/ausblendbaren Layern erstellt. Einzelne `slide_*.svg`-Dateien sind dann nur Preview-Zustaende dieses Masters, keine unabhaengigen Nachbauten.
- Fuer reine Animationszwischenstaende muessen nicht automatisch einzelne SVGs gebaut werden. Sie duerfen auf den finalen Zielzustand zeigen, leer bleiben oder als `skip_preview` dokumentiert werden, wenn das fuer Review und Pipeline sinnvoller ist.
- Komplexere Piktogramme, Werkzeug-/Methodensymbole oder illustrative Einzelelemente werden als lokale PNG-Assets geplant, geprueft und per `<image>` eingebunden, statt sie innerhalb der Folien-SVG improvisiert aus Linien und Grundformen zu bauen.
- Review-Gate fuer Piktogramme: Wenn die Quelle ein komplexes Piktogramm zeigt und der SVG-Vorschlag stattdessen ein handgebautes Linien-/Pfad-Symbol enthaelt, ist die Folie nicht fertig. Dann muss ein PNG-Asset erzeugt, extrahiert oder vom Nutzer angefordert und die SVG-Improvisation entfernt werden.
- Korrekturmodus: Nutzerfeedback wird nicht nur als lokaler Patch verstanden. Bei jedem visuellen Feedback wird zuerst geprueft, ob Inhalt, Asset-Typ, Animation, Layout oder Text betroffen ist; danach wird die passende Workflow-Stufe erneut durchlaufen.
- SVG-Vorschlaege mit Diagrammen, Achsen oder mehreren Layern muessen vor Rueckmeldung gerendert und visuell gegen die Zielzustandsfolie, den Rebuild-Plan, den Python-Plot-Quellcode beziehungsweise die Plot-Daten und den Sprechertext geprueft werden; reine XML-Pruefung reicht dafuer nicht.
- Nach dem visuellen SVG-Cross-Check wird `node tools\svg-rebuild-qa.js <module_id> --viewer --slides <range> --expect-all` ausgefuehrt. Ein SVG-Arbeitspaket ist erst freigabefaehig, wenn der Report unter `analysis/render-checks/<module_id>/automated-svg-qa/` keine Errors enthaelt.
- Fuer jede neue SVG-Arbeitseinheit wird `templates/svg-scene-brief-template.md` als kompakter Szenenbrief genutzt oder inhaltlich vollstaendig im Szenenplan abgebildet.
- Wenn ein Cross-Check grobe Designfehler findet, wird nicht weiter skaliert. Erst wird dieselbe Arbeitseinheit korrigiert, erneut gerendert und erneut geprueft, dann wird die naechste Folie oder Sequenzgruppe gebaut.
- Vorhandene komplexe Bilder oder realistische Darstellungen werden als moegliche wiederverwendbare Assets bewertet.
- PNG-Assets werden nur vorgeschlagen oder uebernommen, wenn SVG/Text fachlich nicht ausreicht oder das vorhandene Bild didaktisch wertvoll ist.
- Wenn ein gutes wiederverwendbares Bild nur in der Folie sichtbar ist, darf Codex einen Screenshot-/Crop-Bedarf dokumentieren oder den Nutzer bitten, das Originalbild unter `source-materials/basis-seminar/extracted-assets/` abzulegen.
- Unsicherheiten werden in `qa.open_questions`, `qa.assumptions` oder `qa.issues` dokumentiert.
- Eine Folie ist erst fertig analysiert, wenn PPTX, PDF, PNG und Sprechertext gegeneinander geprueft wurden oder fehlende Quellen klar markiert sind.

## Nicht Mehr Standard

Diese alten Arbeitsweisen sind fuer neue Basis-Rebuild-Auftraege nicht mehr Standard:

- neue Storyboards fuer ein Expertentraining schreiben
- Sprechertexte frei neu formulieren
- direkt aus einer Storyboard-Zeile ein SVG bauen
- komplette Szenen als generiertes Bild erzeugen
- alte `Life Data Expert`-Quellen als fuehrenden Kurskontext behandeln

## Downstream-Produktion

Wenn der Nutzer spaeter ausdruecklich eine Visualisierung, SVG-Komposition oder E-Learning-Videoausgabe beauftragt, muss dafuer ein separater Downstream-Workflow definiert oder bewusst reaktiviert werden.

Ohne eine solche ausdrueckliche Aufforderung endet der neue Standardprozess bei Rebuild-JSON und Modulreport.

Bei ausdruecklichem SVG-Rebuild-Auftrag gilt zusaetzlich `workflow/svg-rebuild-production-runbook.md`. Ohne Sequenzkarte, Zielzustandsanalyse, Design-Brief und Render-Cross-Check darf kein SVG-Ergebnis als fertig gemeldet werden.
