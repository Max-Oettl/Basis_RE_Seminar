# Preflight Sequence Planning

Diese Datei ist vor jeder SVG-Produktion fuer ein Modul verpflichtend.

Ziel: Erst das komplette alte Folienpaket verstehen, die Ergebnisse schriftlich sichern und daraus einen detaillierten SVG-Bauplan ableiten. Erst danach werden einzelne SVGs gebaut. Der Preflight verhindert, dass eine einzelne Folie isoliert umgesetzt wird, obwohl sie nur ein Animationszustand, ein Zwischenstand oder ein Aufbau einer spaeteren Grafik ist.

Der Preflight plant eine inhaltliche Uebersetzung der PowerPoint-Folien, keine Zusammenfassung. Fachlich relevante Inhalte bleiben erhalten; nur Verpackung, Gestaltung, Layerung und didaktische Fuehrung werden modernisiert.

## Pflichtzeitpunkt

Der Preflight wird ausgefuellt, bevor die erste SVG-Arbeitseinheit eines Moduls umgesetzt wird. In dieser Phase wird noch kein SVG-Code geschrieben und kein Plotasset erzeugt, ausser eine reine Machbarkeitspruefung ist ausdruecklich als Analyse dokumentiert.

Wenn waehrend der Umsetzung klar wird, dass eine Gruppe, ein Uebergang oder eine Abhaengigkeit falsch erkannt wurde, wird der Preflight aktualisiert, bevor weiterproduziert wird.

## Pflichtartefakt

Die Ergebnisse werden immer als Markdown-Datei gespeichert:

```text
analysis/rebuild-plans/<module_id>_sequence_plan.md
```

Zusaetzlich wird die spaetere Crosscheck-Zuordnung maschinenlesbar gespeichert:

```text
analysis/rebuild-plans/<module_id>_source-reference-map.json
```

Jede geplante SVG-Arbeitseinheit nennt dort alle alten Referenzfolien, die sie inhaltlich uebernimmt. Zusammengezogene Aufbauzustaende erhalten mehrere `source_slides`. Zusatzfolien erhalten `source_slides: []` und `mapping_type: new_content`. Eine nur entfernte Zwischenfolie muss als Referenz der aufnehmenden Arbeitseinheit erhalten bleiben, wenn ihr fachlicher Inhalt dort weiterlebt.

Diese Datei ist die verbindliche Arbeitsgrundlage fuer spaetere SVG-Worker. Sie enthaelt nicht nur die Quellfolienanalyse, sondern auch den geplanten Aufbau der spaeteren Content-SVGs. Ein Agent darf nicht mit SVG-Umsetzung beginnen, wenn dieser Plan fehlt, offensichtlich veraltet ist oder nur eine grobe Uebersicht ohne Bauplan enthaelt.

## Quellen Pro Modul

Alle verfuegbaren Quellen werden einmal durchlaufen:

- PNG-Folienbilder in Folienreihenfolge.
- PDF fuer final gerenderte Formeln, Diagramme und Textdetails.
- PPTX/OpenXML fuer Objektstruktur, Gruppen, Ebenen und Animationen.
- Sprechertext fuer didaktische Reihenfolge.
- vorhandene Analyse-JSONs fuer bekannte Muss-Inhalte und offene Fragen.

Die Sichtung erfolgt stueckweise: jede alte Folie bekommt eine eigene Zeile im Preflight-Plan. Ein Kontaktbogen allein reicht nicht.

## Leitfragen Pro Alter Folie

Fuer jede Quellfolie werden diese Fragen beantwortet:

- Was ist die fachliche Kernaussage dieser Folie?
- Ist die Folie ein eigenstaendiger Inhalt oder nur ein Reveal-, Morph-, Highlight- oder Zwischenzustand?
- Welche sichtbaren Elemente sind neu gegenueber der vorherigen Folie?
- Welche Elemente verschwinden, bewegen sich, werden umgefaerbt oder nur hervorgehoben?
- Baut die Folie auf einer vorherigen Grafik auf? Wenn ja: auf welcher Folie oder Sequenzgruppe?
- Wird ein spaeterer vollstaendiger Zustand vorbereitet?
- Welche Elemente muessen spaeter animierbar bleiben?
- Braucht der Uebergang einen harten Schnitt, ein Einblenden, Zeichnen, Verschieben, Hervorheben oder Ausblenden?
- Welche Diagramme, Timelines, Formeln, Tabellen, Piktogramme oder Bildassets kommen vor?
- Welche Elemente sind nur Sprecherunterstuetzung und duerfen in der neuen Grafik vereinfacht oder weggelassen werden?
- Welche Risiken sind schon vor dem SVG-Code sichtbar, zum Beispiel Textueberlauf, kleine Formeln, enge Achsenlabels, zu viele Marker oder unklare Layer?
- Welche spaetere SVG-Arbeitseinheit entsteht daraus: einzelnes Content-SVG, Master-SVG-Zustand, Preview-Datei oder nur Manifest-/Animationsschritt?
- Welche sichtbaren Elemente sollen als native SVG-Formen, Formel-SVG, Python-Plot, Bild-/Piktogrammasset oder bewusste Auslassung geplant werden?
- Welche Animationslayer und Trigger sind schon aus der alten Folie oder dem Sprechertext ableitbar?
- Welche fachlich relevanten Inhalte muessen in der neuen Grafik vollstaendig erhalten bleiben?
- Entspricht die geplante Informationsdichte der alten PowerPoint-Folie?
- Kann diese Folie mit benachbarten Folien zu einer gemeinsamen animierbaren Erklaergrafik zusammengezogen werden?

## Sequenzgruppen

Nach der Einzelfoliensichtung werden Gruppen gebildet:

- `standalone`: echte einzelne Inhaltsfolie.
- `build_sequence`: mehrere Folien bauen dieselbe Grafik Schritt fuer Schritt auf.
- `morph_sequence`: mehrere Folien zeigen Bewegung, Zustandswechsel oder Umordnung.
- `detail_reveal`: eine Folie fuegt Detail, Formel, Label oder Messwert zu einer bestehenden Grafik hinzu.
- `duplicate_state`: inhaltlich identischer oder fast identischer Zustand.
- `skip_preview`: alter Zwischenzustand wird nicht als eigenes Ziel-SVG benoetigt, sondern nur als Animationsschritt dokumentiert.

Fuer jede Gruppe wird festgelegt:

- finale Quellfolie als vollstaendiger Zielzustand,
- enthaltene Quellfolien,
- geplanter Output: gemeinsame Layerstruktur mit Master-/Preview-SVGs, einzelne SVGs oder bewusst kein eigenes SVG,
- welche Elemente initial sichtbar sind,
- welche Elemente spaeter per Trigger erscheinen,
- welche Uebergaenge zwischen den alten Folien im Manifest abgebildet werden muessen,
- welche Abhaengigkeiten zu vorherigen oder folgenden Gruppen bestehen.
- welche Quellinhalte trotz Zusammenzug sichtbar erhalten bleiben muessen.

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

Erst nach diesem Plan beginnt die arbeitseinheitsweise Produktion nach `workflow/40-svg-production/svg-rebuild-production-runbook.md`.

## SVG-Bauplan Im Preflight

Der Preflight muss zusaetzlich einen konkreten SVG-Bauplan enthalten. Fuer jede geplante Arbeitseinheit oder Sequenzgruppe wird vor der Umsetzung festgelegt:

- geplanter Zielpfad der SVG-Datei und des Animationsmanifests,
- exakte Crosscheck-Referenzen: alle Quellfoliennummern, primaere Referenz, Mapping-Typ und Begruendung,
- geplanter Folienordner, der alle folienspezifischen Render-Artefakte der Arbeitseinheit enthaelt,
- ob ein einzelnes Content-SVG, ein Master-SVG mit States, ein Preview-SVG oder kein eigenes SVG entsteht,
- sichtbarer Aufbau: Hauptvisual, Nebenvisuals, Labels, Formeln, Diagramme, Timelines, Piktogramme und bewusst weggelassene Masterelemente,
- Darstellungsweise: native SVG-Komposition, Python-Plot, Formel-SVG, eingebettetes Bildasset, generiertes PNG oder vorhandenes Asset,
- fuer echte Plots und technische Diagramme: vorhandener Python-Plotgenerator oder neu zu erstellender Generator, erwarteter Plottyp, Daten-/Achsenlogik, Ausgabe-SVG und Animierbarkeit,
- fuer jeden Plot: lokaler Zielpfad unter `rebuild-proposals/svg/<module_id>/slide_###/plots/` und lokaler Daten-/Konfigurationspfad unter `data/`,
- fuer Formeln: erwartetes Formelasset, sichtbare Schreibweise und Einblendlogik,
- fuer jede nicht-triviale Formel: lokaler Zielpfad unter `rebuild-proposals/svg/<module_id>/slide_###/formulas/`,
- fuer Timelines: Positionierungsmodus, insbesondere quellenbasiert oder illustrativ unregelmaessig; einfache Ausfall-Timelines mit `X`-/Zensurmarkern bleiben die Standardausnahme vom Python-Plot-Zwang,
- fuer komplexe Bilder oder Piktogramme: extrahieren, generieren, vorhandenes Asset nutzen oder Nutzerasset anfordern,
- fuer jedes generierte oder extrahierte Bildasset: lokaler Zielpfad unter `rebuild-proposals/svg/<module_id>/slide_###/images/`,
- Layerstruktur: IDs der geplanten Gruppen, was initial sichtbar ist und was spaeter erscheint,
- Animationsplanung: Triggerreihenfolge, Triggerart, Effekt, Timing, Ziel-Layer und Bezug zu alten Folien oder Sprechertext,
- Animationsabdeckung: fuer jede geplante Content-SVG mindestens sinnvolle Layer/Targets dokumentieren oder begruenden, warum sie statisch bleiben darf,
- Risiken und QA-Schwerpunkte, die spaeter pro Arbeitseinheit gezielt geprueft werden.

Dieser Bauplan bleibt bewusst auf Planungsniveau. Er darf konkrete Zielpfade und IDs vorsehen, aber die eigentliche SVG-Komposition beginnt erst nach Abschluss und Plausibilisierung des Plans.

Nutze `templates/module-sequence-plan-template.md` als Ausgangspunkt.
