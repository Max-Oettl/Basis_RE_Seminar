# Basis Seminar Rebuild Agent

Diese Datei ist der verpflichtende Router fuer Codex in diesem Repo. Sie haelt nur Kernregeln und Kontext-Ladeentscheidungen. Detailregeln liegen in `workflow/`.

Die fruehere Langfassung ist verlustfrei gesichert unter:

```text
workflow/00-router/agent-rules-legacy-before-router.md
```

## Primaerer Auftrag

Dieses Repo dient dem Rebuild des bestehenden Basis-Seminars `Reliability Engineer`.

Ziel ist eine quellenbelegte Ableitung vorhandener Folien in Analyse-JSON, Szenenplaene und bei ausdruecklichem Auftrag SVG-Grafiken im neuen Design. Die alte PowerPoint-Folie ist Inhaltsanker, aber keine Layoutschablone.

Die inhaltliche Uebersetzung ist Vorrangziel: Der gesamte fachlich relevante Inhalt der alten Folien wird uebernommen. Er darf anders verpackt, visuell neu geordnet und moderner gestaltet werden, aber die neue Grafik darf die Aussage, Begriffe, Schritte, Parameter, Beispiele und Diagrammlogik nicht ausduennen. Der Sprechertext muss weiterhin zu den neuen Folien passen.

Das Zielpublikum ist das Basis-Seminar. Kein Vorwissen in Zuverlaessigkeitstechnik voraussetzen. Fachbegriffe, Diagramme, Formeln und Methoden muessen einsteigerfreundlich geplant werden.

Der freigegebene Sprechertext bleibt unveraendert. Er wird verknuepft, nicht frei neu formuliert.

SVG-Ergebnisse sind standardmaessig Content-SVGs fuer eine spaetere PowerPoint-Einbettung, keine vollstaendigen PowerPoint-Folien. Globale Masterelemente wie Foliennummer, Footer, Logo-Leiste, Praesentationsrahmen, Deck-Header oder automatisch gesetzte PowerPoint-Titel gehoeren nicht in das Content-SVG.

## Vorrang Bei Konflikten

1. ausdruecklicher Nutzerauftrag
2. diese Datei `AGENT.md`
3. `workflow/README.md`
4. `workflow/00-router/context-loading-map.md`
5. die fuer den aktuellen Arbeitsschritt geladenen Detailregeln
6. Legacy-Regeln und alte Pfade nur, wenn sie nicht widersprechen

## Quellenrangfolge

Wenn Quellen voneinander abweichen:

1. Sprechertext-Datei gewinnt fuer gesprochenen Text.
2. PNG gewinnt fuer sichtbaren Zustand und visuelle Gewichtung.
3. PDF gewinnt fuer final gerenderten Text, Formeln und Seitenreihenfolge.
4. PPTX gewinnt fuer Objektstruktur, Koordinaten, Ebenen, Gruppen und Animationen.

Abweichungen dokumentieren, nicht stillschweigend glaetten.

## Kontext-Laderegel

Immer lesen:

1. `AGENT.md`
2. `workflow/README.md`
3. `workflow/00-router/context-loading-map.md`

Danach nur die passenden Detailregeln laden:

- Folienanalyse/Rebuild-JSON: `workflow/10-source-analysis/`
- Sequenz-Preflight und Szenenplanung: `workflow/20-scene-planning/`
- Asset- und Visualentscheidung: `workflow/30-visual-decision/`
- echte Diagramme und Python-Plots: `workflow/31-python-plots/`
- Formeln: `workflow/32-formulas/`
- Timelines und Ausfall-Zeitachsen: `workflow/33-timelines/`
- SVG-Produktion: `workflow/40-svg-production/`
- Animation/Manifest: `workflow/50-animation/`
- QA/Freigabe: `workflow/60-quality/`
- Downstream-Video: `workflow/70-integration/`
- alte Storyboard-Arbeit: `workflow/80-storyboard-legacy/`

Alte Pfade direkt unter `workflow/` sind Compatibility Redirects. Neue Verweise sollen die kanonischen Unterordnerpfade verwenden.

## Harte Arbeitsregeln

- Keine Daten, Sprechertextstellen, Parameter, Formeln, Beispiele oder Muss-Inhalte verlieren.
- Inhaltliche Gleichwertigkeit ist Pflicht: Eine neue Content-SVG darf weniger PowerPoint-Dekoration enthalten, aber nicht weniger fachliche Information als die Quelle, sofern der Inhalt fuer Sprechertext oder Lernziel relevant ist.
- Keine freie fachliche Neutextung ohne Nutzerauftrag.
- Jede relevante Unsicherheit in `qa.open_questions`, `qa.assumptions`, `qa.issues` oder im Szenenplan dokumentieren.
- Vor SVG-Arbeit zuerst alle alten Folien des beauftragten Moduls stueckweise sichten und eine Sequenzlandkarte erstellen. Diese muss klaeren, welche Folien zusammengehoeren, wo Animationen oder Uebergaenge liegen, welche Folien aufeinander aufbauen und welche Quelle der vollstaendige Zielzustand ist.
- Ohne dokumentierten Sequenz-Preflight nach `workflow/20-scene-planning/preflight-sequence-planning.md` darf keine SVG-Produktion starten.
- Vor SVG-Arbeit fuer die aktive Einheit zusaetzlich Szenenplanung und Asset-Entscheidung erstellen.
- SVG-Produktion strikt arbeitseinheitsweise: eine Folie oder eine Sequenzgruppe, keine parallele Batch-Produktion.
- Verbindliche Produktionsschleife pro Arbeitseinheit: erst nach allen geladenen Richtlinien und Vorgehen erstellen, dann genau diese Folie beziehungsweise Sequenzgruppe rendern und per QA pruefen, danach alle gefundenen Befunde an derselben Arbeitseinheit verbessern und erneut pruefen. Erst wenn diese Schleife abgeschlossen ist, darf die naechste Folie oder Sequenzgruppe begonnen werden.
- Fuer jede neue SVG-Arbeitseinheit muss der Sequenzplan die exakten alten Referenzfolien maschinenlesbar in `analysis/rebuild-plans/<module_id>_source-reference-map.json` festhalten. Zusammengezogene Folien erhalten mehrere Referenzen; Zusatzfolien erhalten keine erfundene Altfolienreferenz.
- Vor dem technischen SVG-QA wird der folienweise Content-Transfer-Crosscheck nach `workflow/60-quality/content-transfer-crosscheck.md` ausgefuehrt. Seine Befunde werden an derselben Folie behoben; erst danach folgt die technische Re-QA.
- Check-Befunde werden nicht als spaetere Sammelliste behandelt. Layout-, Text-, Diagramm-, Formel-, Timeline-, Asset- oder Animationsprobleme muessen unmittelbar fuer die aktuell aktive Arbeitseinheit korrigiert werden.
- Mehrere PPTX-Folien, die Reveal/Morph/Aufbau simulieren, zuerst als Sequenzgruppe analysieren.
- Mehrere PPTX-Folien, die durch Einblenden, Ausblenden, Verschieben, Hervorheben oder andere Animationen zu einer gemeinsamen Erklaergrafik werden koennen, werden zusammengezogen und als ein gemeinsames Zielbild mit Layern geplant. Einzelne Preview-SVGs sind nur Review-/Pipeline-Zustaende, keine unabhaengigen Designs.
- Sichtbare PowerPoint-Folientitel nicht automatisch in SVGs uebernehmen. Zusaetzlich keine neuen sichtbaren Meta-Header setzen: keine Modul-/Folien-Kicker, keine Workflow-Hinweise, keine globalen Szenentitel und keine Fokuszeilen im SVG, ausser der Nutzer verlangt sie ausdruecklich als Teil der Grafik.
- Die Text- und Informationsdichte orientiert sich an den Quellfolien. Eine neue Grafik darf klarer strukturiert sein, aber nicht deutlich leerer oder kuenstlich mit Zusatztext aufgefuellt werden.
- Boxtexte, Formeln, Legenden und Labels muessen gerendert lesbar sein und duerfen nicht ueberlaufen.
- Jedes neue oder grundlegend ueberarbeitete Content-SVG erhaelt Slide-Quality-Metadaten: `artifactScope`, `embeddingTarget`, `slideType`, `layoutIntent`, `takeaway`, `density`, `contentMode`, `backgroundMode`, `brandProfile`, `brandVariant`.
- Farben, Typografie, Abstaende, Radien und semantische Statusfarben kommen aus `brand/company-brand-tokens.json`. Vorhandene Reltest-Academy-Brand-Regeln in `brand/` haben Vorrang vor freien Designentscheidungen.

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

Animation ist Standardbestandteil jeder neuen Content-SVG. Elemente, die im Sprechertext nacheinander beschrieben werden, sollen als eigene Layer vorbereitet und im Normalfall erst passend eingeblendet, gezeichnet, verschoben, ausgeblendet oder hervorgehoben werden. Die genaue Dramaturgie bleibt szenenabhaengig, aber eine Folie ohne sinnvolle Animationslayer ist eine begruendete Ausnahme.

Szenenlayer laufen ueber stabile Gruppen-IDs und `scene.animation.v1.json`.

Manifesttypen sind getrennt: `scene.animation.v1.json` beschreibt Animationsziele und Schritte fuer SVG/PowerPoint-/Video-Integration. `assets/scenes/<scene_id>/manifest.json` ist ein Produktions-/Statusmanifest aus dem spaeteren Szenenprozess und wird nicht mit dem Animationsmanifest vermischt.

Plotinterne Animationen koennen vorlaeufig nach `components/python-plot-library/svg-animation-structure.provisional.md` vorbereitet werden. Gewuenschte Plot-Elemente koennen per Zeittrigger erscheinen, zum Beispiel nach 3 Sekunden.

## Qualitaet Vor Rueckmeldung

Vor einer Fertigmeldung:

- passende Detailgates aus `workflow/60-quality/` anwenden
- Content-Transfer-Crosscheck gegen alle im Referenz-Mapping zugeordneten Quellfolien ausfuehren
- SVG XML-parsen
- Manifest-Targets gegen SVG-IDs pruefen
- bei Diagrammen Generator, Plot-Daten und Plot-SVG pruefen
- bei SVG-Modulen ausfuehren:

```text
node tools/svg-rebuild-qa.js <module_id> --viewer --slides <range> --expect-all
```

Fuer neu erzeugte oder grundlegend ueberarbeitete SVGs gilt als Ziel-Freigabe zusaetzlich `--strict-design` und, sofern ein Browser verfuegbar ist, `--layout --layout-strict`. Wenn Browser/Layout-QA nicht verfuegbar ist, muss das explizit gemeldet und als Restrisiko dokumentiert werden.

Wenn Browser, Renderer oder externe Pruefung nicht verfuegbar sind, das klar melden.

## Nicht Standard

Nicht mehr Standard fuer neue Basis-Rebuild-Auftraege:

- neue freie Expertentraining-Storyboards schreiben
- Sprechertexte neu formulieren
- direkt aus einer Storyboard-Zeile ein SVG bauen
- komplette Szenen als generiertes Bild erzeugen
- alte `Life Data Expert`-Quellen als fuehrenden Kurskontext behandeln
