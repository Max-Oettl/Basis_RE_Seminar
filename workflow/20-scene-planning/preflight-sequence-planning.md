# Preflight Sequence Planning

Diese Datei ist vor jeder SVG-Produktion fuer ein Modul verpflichtend.

Ziel: Erst alle Quell-SVGs des Moduls verstehen, die Ergebnisse schriftlich sichern und daraus einen detaillierten Transformations- und Animationsplan ableiten. Erst danach werden Ziel-SVGs erzeugt. Der Preflight verhindert, dass eine einzelne exportierte SVG isoliert umgesetzt wird, obwohl sie nur ein Animationszustand, ein Zwischenstand oder ein Aufbau einer spaeteren Grafik ist.

Der Preflight plant eine inhaltlich gleichwertige Strukturtransformation der Quell-SVGs, keine Zusammenfassung und keinen erneuten Nachbau. Fachlich relevante Inhalte bleiben erhalten; Struktur, Gestaltung, Layerung und didaktische Fuehrung duerfen angepasst werden.

## Pflichtzeitpunkt

Der Preflight wird ausgefuellt, bevor die erste SVG-Arbeitseinheit eines Moduls umgesetzt wird. In dieser Phase wird noch kein SVG-Code geschrieben und kein Plotasset erzeugt, ausser eine reine Machbarkeitspruefung ist ausdruecklich als Analyse dokumentiert.

Voraussetzungen sind das vollstaendige Mapping `analysis/inventories/<module_id>_svg-text-map.json` und das vollstaendige Inventar `analysis/inventories/<module_id>_source-svg-inventory.json`. Wenn waehrend der Umsetzung klar wird, dass eine Textzuordnung, eine Gruppe, ein Uebergang oder eine Abhaengigkeit falsch erkannt wurde, werden Mapping, Inventar und Preflight aktualisiert, bevor weiterproduziert wird.

## Pflichtartefakt

Die Ergebnisse werden immer als Markdown-Datei gespeichert:

```text
analysis/rebuild-plans/<module_id>_sequence_plan.md
```

Zusaetzlich wird die spaetere Crosscheck-Zuordnung maschinenlesbar gespeichert:

```text
analysis/rebuild-plans/<module_id>_source-reference-map.json
```

Jede geplante SVG-Arbeitseinheit nennt dort alle Quell-SVGs, die sie inhaltlich uebernimmt. Zusammengezogene Aufbauzustaende erhalten mehrere `source_slides`. Zusatzfolien erhalten `source_slides: []` und `mapping_type: new_content`. Eine absorbierte Zwischen-SVG muss als Referenz der aufnehmenden Arbeitseinheit erhalten bleiben, wenn ihr Zustand oder fachlicher Inhalt dort weiterlebt.

Diese Datei ist die verbindliche Arbeitsgrundlage fuer spaetere SVG-Worker. Sie enthaelt nicht nur die Quell-SVG-Analyse, sondern auch den geplanten Aufbau der spaeteren Content-SVGs. Ein Agent darf nicht mit SVG-Umsetzung beginnen, wenn dieser Plan fehlt, offensichtlich veraltet ist oder nur eine grobe Uebersicht ohne Bauplan enthaelt.

## Eingang Pro Modul

Alle Quell-SVGs unter `source-materials/basis-seminar/powerpoint-svg/<module_id>/SVG/` werden in der bestaetigten Mapping-Reihenfolge durchlaufen. Das Quell-SVG-Inventar liefert technische Merkmale, sichtbaren Text, Referenzen und vorlaeufige Zustandsdeltas. Das SVG-Text-Mapping liefert fuer jede Quelle den wortgetreuen Sprechertext und fachliche Zusatzinformationen. Fuer jede spaetere Zielszene wird festgehalten, welche Mapping-Eintraege und Originalabschnitte ihren `Gesprochener Text` bilden.

PPTX, PDF, PNG und separate Narration-Ablagen sind fuer neue Module keine parallelen Inputs. Die alte PowerPoint-Dateigliederung wird nicht rekonstruiert. Die Sichtung erfolgt stueckweise: Jede Quell-SVG bekommt eine eigene Zeile im Preflight-Plan. Ein Kontaktbogen oder eine reine Dateiliste reicht nicht.

## Leitfragen Pro Quell-SVG

Fuer jede Quell-SVG werden diese Fragen beantwortet:

- Was ist die fachliche Kernaussage dieser Folie?
- Ist die Folie ein eigenstaendiger Inhalt oder nur ein Reveal-, Morph-, Highlight- oder Zwischenzustand?
- Welche sichtbaren oder strukturellen Elemente sind neu gegenueber der vorherigen Quell-SVG?
- Welche Elemente verschwinden, bewegen sich, werden umgefaerbt oder nur hervorgehoben?
- Baut die Folie auf einer vorherigen Grafik auf? Wenn ja: auf welcher Folie oder Sequenzgruppe?
- Wird ein spaeterer vollstaendiger Zustand vorbereitet, und welche Quell-SVG zeigt ihn?
- Welche Elemente muessen spaeter animierbar bleiben?
- Braucht der Uebergang einen harten Schnitt, ein Einblenden, Zeichnen, Verschieben, Hervorheben oder Ausblenden?
- Welche Diagramme, Timelines, Formeln, Tabellen, Piktogramme oder Bildassets kommen vor?
- Welche Elemente sind nur Sprecherunterstuetzung und duerfen in der neuen Grafik vereinfacht oder weggelassen werden?
- Welche Risiken sind schon vor dem SVG-Code sichtbar, zum Beispiel Textueberlauf, kleine Formeln, enge Achsenlabels, zu viele Marker oder unklare Layer?
- Welche spaetere SVG-Arbeitseinheit entsteht daraus: einzelnes Content-SVG, gemeinsames Master-SVG, Preview-Datei oder nur Manifest-/Animationsschritt?
- Welche vorhandenen Quellknoten koennen direkt uebernommen und neu gruppiert werden?
- Welche IDs, Referenzen, Styles oder `defs` muessen beim Zusammenfuehren kollisionsfrei umgeschrieben werden?
- Welche Elemente sind in mehreren Quell-SVGs semantisch identisch und duerfen im Master nur einmal existieren?
- Welche sichtbaren Elemente sollen als native SVG-Formen, Formel-SVG, Python-Plot, Bild-/Piktogrammasset oder bewusste Auslassung geplant werden?
- Welche Animationslayer und Trigger sind schon aus der alten Folie oder dem Sprechertext ableitbar?
- Welche fachlich relevanten Inhalte muessen in der neuen Grafik vollstaendig erhalten bleiben?
- Entspricht die geplante Informationsdichte der alten PowerPoint-Folie?
- Kann diese Folie mit benachbarten Folien zu einer gemeinsamen animierbaren Erklaergrafik zusammengezogen werden?
- Welche stabile `Scene_ID` erhaelt die spaetere Zielszene?
- Welche exakten Sprechertextabschnitte gehoeren zu dieser Szene, und in welcher Reihenfolge werden sie ohne freie Neutextung verbunden?
- Welche drei- bis achtwortigen Originalphrasen eignen sich als eindeutige `sourceText`-Trigger?

## Sequenzgruppen

Nach der Einzelfoliensichtung werden Gruppen gebildet:

- `standalone`: echte einzelne Inhaltsfolie.
- `build_sequence`: mehrere Folien bauen dieselbe Grafik Schritt fuer Schritt auf.
- `morph_sequence`: mehrere Folien zeigen Bewegung, Zustandswechsel oder Umordnung.
- `detail_reveal`: eine Folie fuegt Detail, Formel, Label oder Messwert zu einer bestehenden Grafik hinzu.
- `duplicate_state`: inhaltlich identischer oder fast identischer Zustand.
- `skip_preview`: alter Zwischenzustand wird nicht als eigenes Ziel-SVG benoetigt, sondern nur als Animationsschritt dokumentiert.

Fuer jede Gruppe wird festgelegt:

- primaere Quell-SVG als vollstaendigster Zielzustand,
- enthaltene Quell-SVGs,
- geplanter Output: gemeinsame Layerstruktur mit Master-/Preview-SVGs, einzelne SVGs oder bewusst kein eigenes SVG,
- welche Elemente initial sichtbar sind,
- welche Elemente spaeter per Trigger erscheinen,
- welche Uebergaenge zwischen den Quell-SVG-Zustaenden im Manifest abgebildet werden muessen,
- welche Knoten zwischen Zustaenden wiederverwendet, ersetzt, verschoben oder nur umgestaltet werden,
- welche ID-Kollisionen und Referenzumschreibungen beim Merge zu erwarten sind,
- welche Abhaengigkeiten zu vorherigen oder folgenden Gruppen bestehen.
- welche Quellinhalte trotz Zusammenzug sichtbar erhalten bleiben muessen.
- welche stabile `Scene_ID` die gemeinsame Zielszene erhaelt.
- welcher freigegebene Szenensprechertext aus den Quellabschnitten entsteht und welche eindeutigen Phrasen die Animation ausloesen.

## Modulweiter Produktionsplan

Der Preflight endet mit einer Produktionsreihenfolge:

1. Welche Gruppe oder Folie wird zuerst gebaut?
2. Welche Gruppen muessen als zusammenhaengender Master geplant werden?
3. Wo darf trotzdem eine einzelne Preview-Folie entstehen?
4. Welche Python-Plotassets werden voraussichtlich benoetigt und in welchem Folienordner werden sie abgelegt?
5. Welche Plotdaten, Konfigurationsdateien oder sonstigen Datensnapshots werden pro Folie benoetigt?
6. Welche Formelassets werden voraussichtlich benoetigt und in welchem Folienordner werden sie abgelegt?
7. Welche komplexen Bild- oder Piktogrammassets sind vorab zu beschaffen oder zu generieren und gehoeren in welchen Folienordner?
8. Wo sind QA-Schwerpunkte zu erwarten?
9. Welche Zielstrukturregeln aus `workflow/40-svg-production/target-svg-structure-contract.md` sind anzuwenden oder noch offen?

Erst nach diesem Plan beginnt die arbeitseinheitsweise Produktion nach `workflow/40-svg-production/svg-rebuild-production-runbook.md`.

## SVG-Bauplan Im Preflight

Der Preflight muss zusaetzlich einen konkreten SVG-Bauplan enthalten. Fuer jede geplante Arbeitseinheit oder Sequenzgruppe wird vor der Umsetzung festgelegt:

- geplanter Zielpfad der SVG-Datei und des Animationsmanifests,
- exakte Crosscheck-Referenzen: alle Quell-SVG-Nummern, primaere Referenz, Mapping-Typ und Begruendung,
- geplanter Folienordner, der alle folienspezifischen Render-Artefakte der Arbeitseinheit enthaelt,
- ob ein einzelnes Content-SVG, ein Master-SVG mit States, ein Preview-SVG oder kein eigenes SVG entsteht,
- sichtbarer Aufbau: Hauptvisual, Nebenvisuals, Labels, Formeln, Diagramme, Timelines, Piktogramme und bewusst weggelassene PowerPoint-Masterelemente,
- Transformationsweise: direkte Knotenuebernahme, Gruppierung, ID-/Referenzumschreibung, native SVG-Anpassung, Python-Plot, Formel-SVG, eingebettetes Bildasset oder vorhandenes Asset,
- fuer echte Plots und technische Diagramme: vorhandener Python-Plotgenerator oder neu zu erstellender Generator, erwarteter Plottyp, Daten-/Achsenlogik, Ausgabe-SVG und Animierbarkeit,
- fuer jeden Plot: lokaler Zielpfad unter `rebuild-proposals/svg/<module_id>/slide_###/plots/` und lokaler Daten-/Konfigurationspfad unter `data/`,
- fuer Formeln: erwartetes Formelasset, sichtbare Schreibweise und Einblendlogik,
- fuer jede nicht-triviale Formel: lokaler Zielpfad unter `rebuild-proposals/svg/<module_id>/slide_###/formulas/`,
- fuer Timelines: Positionierungsmodus, insbesondere quellenbasiert oder illustrativ unregelmaessig; einfache Ausfall-Timelines mit `X`-/Zensurmarkern bleiben die Standardausnahme vom Python-Plot-Zwang,
- fuer Piktogramme: immer ein generiertes transparentes PNG planen; fuer andere komplexe Bilder darf extrahiert, ein vorhandenes Asset genutzt oder ein Nutzerasset angefordert werden,
- fuer jedes generierte oder extrahierte Bildasset: lokaler Zielpfad unter `rebuild-proposals/svg/<module_id>/slide_###/images/`,
- Layerstruktur: fachlich vollstaendige Gruppen und ihre stabilen IDs; technische Einzelknoten werden nicht allein wegen ihres Typs zu Targets,
- Animationsentscheidung: fuer jede Szene `static`, `animated` oder `needs_review` mit didaktischer Begruendung nach `workflow/50-animation/animation-decision-and-dramaturgy.md`,
- Animationsplanung nur bei `animated`: fachliche Sprechertextabschnitte, Triggerreihenfolge, Effekt, Zielgruppe und Bezug zu belegten Quell-SVG-Zustaenden; bei `static` bleiben Targets und Schritte leer,
- Risiken und QA-Schwerpunkte, die spaeter pro Arbeitseinheit gezielt geprueft werden.
- finale Paketzuordnung: externe Modul-ID, stabile `Scene_ID`, Szenenordner, SVG-Basename und namensgleiches externes Animationsmanifest.

Dieser Bauplan bleibt bewusst auf Planungsniveau. Er darf konkrete Zielpfade und IDs vorsehen, aber die eigentliche SVG-Komposition beginnt erst nach Abschluss und Plausibilisierung des Plans.

Nutze `templates/module-sequence-plan-template.md` als Ausgangspunkt.
