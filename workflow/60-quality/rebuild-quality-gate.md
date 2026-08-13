# Rebuild Quality Gate

Dieses Gate gilt vor jeder Rueckmeldung, dass eine Analyse, Szene oder SVG-Arbeitseinheit fertig ist.

## Verbindliche Re-QA Nach Anpassungen

Nach jeder inhaltlichen, visuellen, technischen oder animativen Anpassung an einer bestehenden Folie/Szene muss der Quality Check erneut ausgefuehrt werden. Das gilt auch fuer scheinbar kleine Korrekturen wie verschobene Labels, entfernte Rahmen, geaenderte Plotassets, geaenderte Animation-Targets oder angepasste Review-Notizen.

Verbindlicher Ablauf:

1. Genau eine Folie/Szene korrigieren.
2. Betroffene Dateien speichern oder generieren.
3. `tools/svg-rebuild-qa.js` fuer diese Folie/Szene oder den betroffenen Slide-Range ausfuehren.
4. Gefundene Errors und echte Layout-/Design-Warnings beheben.
5. Den Quality Check erneut ausfuehren, bis der Report sauber ist oder verbleibende Warnings begruendet dokumentiert sind.
6. Erst danach die Viewer-Notiz schliessen, Verlaufsversion anlegen oder mit der naechsten Folie/Szene beginnen.
7. Vor dem Schliessen die Feedback-Lernschleife abschliessen: Audit aktualisieren, Reichweite entscheiden und eine uebertragbare Regel beziehungsweise QA-Luecke in der kanonischen Schublade verankern.

Eine Korrektur gilt nicht als erledigt, wenn nach der letzten Aenderung kein erneuter QA-Lauf stattgefunden hat.
Eine Review-Korrektur gilt ebenfalls nicht als erledigt, wenn sie nur lokal gepatcht wurde, obwohl der Befund als `module_pattern`, `project_rule`, `domain_rule` oder `qa_gap` eingestuft wurde.

## Allgemein

- SVG-, DOCX- und Extraktionshashes gegen `analysis/inventories/<module_id>_svg-text-map.json` pruefen.
- Sicherstellen, dass jede Quell-SVG genau einen gemappten Sprechertext besitzt und keine Zuordnung `needs_review` oder `blocked` ist.
- Quellen gegen Sprechertext pruefen.
- Offene Annahmen in `qa.assumptions`, `qa.open_questions` oder einem Szenenplan dokumentieren.
- Keine relevanten Inhalte, Begriffe, Parameter, Formeln oder methodischen Schritte verlieren.
- Alle zugeordneten Quell-SVGs als Inhalts- und Geometrieanker behandeln.
- Direkt uebernommene, umgruppierte, konsolidierte, ersetzte und entfernte Quellknoten nachvollziehbar dokumentieren.
- Sichtbaren Zieltext auch in Gegenrichtung gegen Quell-SVGs und zugeordneten
  Sprechertext pruefen. Belegte Ergaenzungen tragen `data-source-evidence` und
  eine konkrete `data-source-reference`; unbelegte Zieltexte bleiben
  Freigabebefunde.
- Bei zusammengefuehrten Quell-SVGs ID-, `defs`- und Referenzkollisionen vollstaendig aufloesen.
- Zielstruktur gegen `workflow/40-svg-production/target-svg-structure-contract.md` pruefen.
- Bei Kapitel-, Lektions- oder Sequenz-Redesigns den Referenz-Lock und alle Gates
  aus `workflow/34-slide-redesign/chapter-implementation-quality-contract.md`
  pruefen.

## SVG-Technik

- SVG als XML parsen.
- Keine doppelten IDs.
- Manifest-Targets muessen im SVG existieren.
- Keine unerlaubten Inline-Animationen in Szenen-SVGs; Szenenlayer laufen ueber `scene.animation.v1.json`.
- Bildpfade muessen aufloesbar sein oder als Data-URI mit nachvollziehbarem `data-plot-asset` eingebettet werden.
- Keine Mojibake- oder Replacement-Zeichen.
- SVGs sind standardmaessig Content-SVGs fuer PowerPoint-Einbettung, keine vollstaendigen PowerPoint-Folien.
- Neue oder grundlegend ueberarbeitete SVGs enthalten Slide-Quality-Metadaten: `artifactScope`, `embeddingTarget`, `slideType`, `layoutIntent`, `takeaway`, `density`, `contentMode`, `backgroundMode`, `brandProfile`, `brandVariant`.
- Neue oder grundlegend ueberarbeitete SVGs verwenden
  `brandProfile=reltest-education`, Archivo fuer Inhaltstext und Oxanium fuer
  Headlines/Auszeichnungen.
- Marineblau `#142452` ist die visuell fuehrende Inhaltsfarbe. Signalgruen
  `#00A653` kennzeichnet Education oder einen belegten semantischen Fokus;
  Stahlcyan `#0C84B4` bleibt eine definierte Diagrammfarbe.
- Keine externen Fonts oder externen Stylesheets, sofern nicht ausdruecklich dokumentiert und durch QA akzeptiert.
- Keine konflikttraechtige globale `text { fill: ... }`-Regel, wenn einzelne
  Textknoten andere Vordergrundfarben deklarieren. Die Strict-Design-QA behandelt
  eine solche CSS-Kaskade als Fehler.
- Nicht begruendete Strichstaerken oberhalb der Brand-Obergrenze von 6 px sind in
  neuen oder grundlegend ueberarbeiteten SVGs Fehler. Spezialgeometrie braucht
  `data-qa-heavy-stroke="allowed"` und eine nichtleere `data-qa-reason`.
- Keine `<script>`-Elemente, Eventhandler, `javascript:`-URLs, Remote-Referenzen oder absoluten lokalen Dateipfade im finalen SVG.
- Jede Szene besitzt vor der Manifestpruefung eine dokumentierte Entscheidung `static`, `animated` oder `needs_review` nach `workflow/50-animation/animation-decision-and-dramaturgy.md`.
- `static` ist ein gueltiges Ergebnis. Ein statisches Paketmanifest darf leere `targets` und `steps` besitzen und darf keinen kuenstlichen Ganzfolien-`show`-Schritt enthalten.
- Bei `animated` verwenden oeffentliche Ziele stabile semantische ASCII-`snake_case`-IDs und `data-anim-target="true"`.
- Begruendet animierte nichttriviale Szenen duerfen nicht ausschliesslich das gesamte SVG, `scene_content`, `main_content` oder komplette `source_state_*`-Container animieren.
- Der Animationscheck bestaetigt vollstaendige fachliche Gruppen und die im Sprechertext beschriebene Reihenfolge; technische Mikrogruppen nach Elementart sind ein Fehler.
- Der Animationscheck liest Listen als atomare Inhaltsstruktur: Kein Target darf mit einem verwaisten Aufzaehlungszeichen oder einem vom Inhalt getrennten Label wie `Ursache`, `Folge`, `Ausmass` oder `Kosten & Konsequenz` enden. `tools/svg-rebuild-qa.js` prueft diese Grenzfehler deterministisch.
- Diagramme mit sichtbaren Linien, Kurven oder Verlaeufen pruefen explizit, ob mindestens ein geeignetes Geometrieziel mit `draw` aufgebaut wird.
- `highlight` und `transform` werden dort eingesetzt, wo der Sprechertext einen Fokus- beziehungsweise Zustandswechsel beschreibt. Unbegruendete dekorative Effekte sind ebenso unzulaessig wie das vollstaendige Fehlen fachlich erforderlicher Effekte.
- Direkt aufeinanderfolgende Schritte mit identischem `sourceText` und `occurrence` bilden eine gemeinsame Triggergruppe und muessen im Viewer gleichzeitig wiedergegeben werden.

## Visuell

- Text bleibt in Boxen und hat sichtbaren Innenabstand.
- Achsenlabels, Ticklabels, Legenden und Formeln sind in der Zielgroesse lesbar.
- Keine sichtbaren PowerPoint-Folientitel, keine neu gesetzten globalen Szenentitel, keine Modul-/Folien-Kicker, keine Workflow-Hinweise und keine Fokuszeilen im SVG, ausser der Nutzer verlangt sie ausdruecklich als Teil der Grafik.
- Keine PowerPoint-Masterelemente im Content-SVG: Foliennummer, Footer, globale Logo-Leiste, Praesentationsrahmen, Deck-Header oder Navigationsleiste bleiben ausserhalb des SVGs.
- Dieselbe Mastertrennung gilt projektweit fuer die 1920x1080-Ziel-SVGs unter
  `rebuild-proposals/svg/`: sichtbarer Folientitel, Titelakzent, Titeltrennlinie,
  Footertrennlinie, Trainingsfooter, Logo und Modul-/Szenenkennung werden vom
  Downstream-Repository gerendert und muessen im SVG fehlen. Zugänglicher
  `<title>`, `contentTitle` und Storyboard-Titel bleiben erhalten.
- PowerPoint-Bedienelemente aus dem Export, insbesondere der Lautsprecher unten rechts, sind vollstaendig entfernt. Zugehoerige ungenutzte `image`-, `clipPath`- und `use`-Knoten verbleiben ebenfalls nicht im Ziel-SVG.
- Farben, Schriften, Abstaende, Radien und semantische Statusfarben folgen `brand/company-brand-tokens.json`; Abweichungen brauchen `data-qa-brand-exception="true"` und `data-qa-reason`.
- Gleichrangige Karten oder Infoboxen verwenden dieselbe marineblaue
  Farbfamilie. Unterschiede werden bevorzugt ueber Tonwert, Deckkraft, Kontur,
  Typografie oder Position getragen; eine dekorative Rotation durch Gelb, Blau,
  Gruen oder weitere Akzentfarben ist ein Designbefund.
- Ausserhalb echter Diagramme wird standardmaessig hoechstens eine satte
  Akzentfarbfamilie pro Folie eingesetzt. Weitere Akzentfarben brauchen eine
  konkrete fachliche Semantik und bleiben flaechenmaessig untergeordnet.
- Ausfallmarker auf Zeitachsen wirken natuerlich unregelmaessig, sofern keine echten gleichmaessigen Zeitdaten oder abstrakten Prozessschritte dargestellt werden.
- Layout nutzt stabile Abstaende und klare Hierarchie.
- Endzustand und fachlich relevante Animationszustaende werden sowohl in Zielaufloesung als auch in realistischer verkleinerter Viewer-Ansicht visuell geprueft. Automatische Fehlerfreiheit ersetzt diese Pruefung nicht.
- Bei Redesigns werden Quelle, gerendertes Ziel und eine vergleichbare
  freigegebene Folie des benannten Referenzmoduls als Dreifachvergleich
  beurteilt. Fehlt ein Zielrender, ist die Szene nicht freigabefaehig.
- Textkontrast wird anhand des berechneten Renderstils beurteilt. Ein vorhandenes
  `fill`-Attribut oder DOM-Textknoten beweist keine Sichtbarkeit.
- Der Reset-/Startzustand zeigt keine spaeteren Targets mit Vorschau-Deckkraft. Pfeile und Verbinder erscheinen nie vor den Boxen, Karten oder Diagrammelementen, deren Beziehung sie erklaeren.
- Quelle und Ziel werden bei Redesigns direkt nebeneinander verglichen; geprueft werden auch Beziehungstopologie, Pfeilrichtung, kanonische Symbolform, Text-Randabstand und unnoetige gestalterische Ebenen.
- Diagramme, Timelines und Formeln muessen ihre spezifischen Detailgates bestehen.
- Jeder Text in einer Box bleibt sichtbar innerhalb der Box; ein Textueberlauf ist ein Fehler, nicht nur ein Hinweis fuer spaetere Optimierung.
- Konkrete identitaetstragende Motive muessen im Zielmassstab erkennbar sein.
  Generische Boxen oder improvisierte Primitive sind kein Ersatz fuer benoetigte
  Produkt-, Maschinen-, Werkzeug- oder Geraeteassets.
- Neue oder grundlegend ueberarbeitete Piktogramme folgen dem Profil
  `reltest-education-minimal-v1`, sind in der Registry semantisch dokumentiert
  und bestehen 960x540-, 48-px- sowie bei kompakten Universalicons den
  32-px-Check.
- Piktogrammstatus wird nicht allein durch Farbe vermittelt. Bedeutungsrelevante
  Konturen erreichen mindestens 3:1 Kontrast; Stahlcyan ist kein allgemeiner
  Education-Piktogrammakzent.

## Zusatzfolien Aus Dem Viewer

- Wenn im Viewer eine zusaetzliche Folie benoetigt wird, wird sie ueber `Zusatzfolie hinzufuegen` als neuer Review-Datensatz angelegt.
- Zusatzfolien haben absichtlich keine Quell-SVG. Die Review-Notiz ist das Briefing fuer den spaeter zu erzeugenden SVG-Vorschlag.
- Die Zusatzfolienliste liegt zentral unter `analysis/viewer-notes/additional-slides.json`; die eigentliche Notiz liegt wie bei normalen Folien unter `analysis/viewer-notes/<module>_slide_<nummer>.json`.
- Zusatzfolien ohne SVG sind Ideenspeicher und duerfen den Viewer-QA-Check mit `--expect-all` nicht hart fehlschlagen lassen. Sobald ein SVG-Vorschlag erzeugt wurde, gelten die normalen SVG-, Animations- und QA-Regeln.
- Verschieben und Loeschen im Viewer sind Kuratierungsaktionen, keine Dateisystem-Aktionen. Reihenfolge und ausgeblendete Folien werden unter `analysis/viewer-notes/viewer-curation.json` gespeichert. Nach dem Loeschen wird fuer 5 Sekunden eine Undo-Meldung angeboten; danach koennen ausgeblendete Folien ueber `Ausgeblendete anzeigen` wieder sichtbar gemacht und wiederhergestellt werden.
- Die Trainingsgliederung wird getrennt von SVG-, Review- und Kuratierungsdaten unter `analysis/viewer-notes/training-structure.json` gespeichert. Der Viewer zeigt immer genau ein Modul und darin die Hierarchie `Kapitel -> Lektion -> Szene`. Kapitel und Lektionen werden manuell gepflegt und koennen ein- oder ausgeklappt werden. Noch nicht zugeordnete Szenen muessen sichtbar bleiben und duerfen durch eine unvollstaendige Gliederung nicht aus Review, Navigation oder Praesentationsauswahl verschwinden.

## Pflichtcheck Fuer SVG-Module

Vor dem technischen SVG-QA fuer genau die aktive Folie den Content-Transfer-Crosscheck nach `workflow/60-quality/content-transfer-crosscheck.md` ausfuehren. Bei zusammengezogenen Folien muessen alle Referenzfolien und ihre Text-Mapping-Eintraege einzeln geprueft werden. Konkrete Uebertragungsbefunde werden zuerst behoben und der Crosscheck wird wiederholt.

Danach ausfuehren:

```text
node tools/svg-rebuild-qa.js <module_id> --viewer --slides <range> --expect-all
```

Bei Layout- oder Layering-Risiko zusaetzlich die deterministische Rendered-SVG-Layout-QA aktivieren:

```text
node tools/svg-rebuild-qa.js <module_id> --viewer --slides <range> --expect-all --layout
```

Die Layout-QA kann im Warn-Modus fuer Zwischenstaende laufen. Fuer neu erzeugte oder grundlegend ueberarbeitete SVGs ist `--layout-strict` die Ziel-Freigabe, sofern der Browser/CDP-Renderer verfuegbar ist.

Die Content-SVG-/Design-/Brand-QA kann im Warn-Modus fuer Zwischenstaende laufen. Fuer neu erzeugte oder grundlegend ueberarbeitete SVGs ist der Strict-Modus die Ziel-Freigabe:

```text
node tools/svg-rebuild-qa.js <module_id> --viewer --slides <range> --expect-all --strict-design
```

Zielbefehl fuer finale Freigabe:

```text
node tools/svg-rebuild-qa.js <module_id> --viewer --slides <range> --expect-all --strict-design --layout --layout-strict
```

Ein SVG-Arbeitspaket ist erst freigabefaehig, wenn der Report unter `analysis/render-checks/<module_id>/automated-svg-qa/` keine Errors enthaelt und Design-/Layout-Warnings entweder behoben oder mit nachvollziehbarer Begruendung dokumentiert sind.

Wenn Browser oder Renderer bei einem Kapitel-Redesign nicht verfuegbar sind, ist
die visuelle Freigabe blockiert. Ehrlich melden, welche Checks nicht ausgefuehrt
werden konnten, und die Umsetzung nicht als fertig bezeichnen.

## Pflichtcheck Fuer Finale Uebergabepakete

Nach der folienweisen Produktion und Re-QA wird das externe Paket separat geprueft:

```text
node tools/svg-rebuild-qa.js --handoff-package delivery-packages/storyboard-import/<external-module-id> --strict-handoff --strict-design
```

Der Check muss mindestens bestaetigen:

- exakt `storyboardImportPackage/v1`, sichere relative Pfade und genau ein Modul,
- eindeutige `Scene_ID`-Werte und exakt passende Szenenordner,
- genau eine SVG pro automatisch zuzuordnender Szene,
- gueltige, sichere, eigenstaendige SVGs mit `viewBox`, eindeutigen IDs und ohne aktive oder externe Inhalte,
- namensgleiches `<svg-name>.animation.v1.json`, wenn Animation vorgesehen ist,
- ausschliesslich bekannte `svgAnimationManifest/v1`-Felder und Werte,
- existierende Targets und messbare `draw`-Geometrie,
- mindestens ein Schritt je `animated`-Target,
- wortgetreue, eindeutige `sourceText`-Treffer im `Gesprochener Text` derselben Szene,
- keine finalen Sekunden, Wortindizes, TTS-Zeitpunkte oder absoluten Triggerframes.

Der Paketcheck ersetzt nicht die vorherige folienweise Schleife. Er ist das zusaetzliche Abschlussgate fuer die externe Lieferung.
