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

Eine Korrektur gilt nicht als erledigt, wenn nach der letzten Aenderung kein erneuter QA-Lauf stattgefunden hat.

## Allgemein

- Quellen gegen Sprechertext pruefen.
- Offene Annahmen in `qa.assumptions`, `qa.open_questions` oder einem Szenenplan dokumentieren.
- Keine relevanten Inhalte, Begriffe, Parameter, Formeln oder methodischen Schritte verlieren.
- Alte Folie als Inhaltsanker behandeln, nicht als Layoutschablone.

## SVG-Technik

- SVG als XML parsen.
- Keine doppelten IDs.
- Manifest-Targets muessen im SVG existieren.
- Keine unerlaubten Inline-Animationen in Szenen-SVGs; Szenenlayer laufen ueber `scene.animation.v1.json`.
- Bildpfade muessen aufloesbar sein oder als Data-URI mit nachvollziehbarem `data-plot-asset` eingebettet werden.
- Keine Mojibake- oder Replacement-Zeichen.
- SVGs sind standardmaessig Content-SVGs fuer PowerPoint-Einbettung, keine vollstaendigen PowerPoint-Folien.
- Neue oder grundlegend ueberarbeitete SVGs enthalten Slide-Quality-Metadaten: `artifactScope`, `embeddingTarget`, `slideType`, `layoutIntent`, `takeaway`, `density`, `contentMode`, `backgroundMode`, `brandProfile`, `brandVariant`.
- Keine externen Fonts oder externen Stylesheets, sofern nicht ausdruecklich dokumentiert und durch QA akzeptiert.

## Visuell

- Text bleibt in Boxen und hat sichtbaren Innenabstand.
- Achsenlabels, Ticklabels, Legenden und Formeln sind in der Zielgroesse lesbar.
- Keine sichtbaren PowerPoint-Folientitel, keine neu gesetzten globalen Szenentitel, keine Modul-/Folien-Kicker, keine Workflow-Hinweise und keine Fokuszeilen im SVG, ausser der Nutzer verlangt sie ausdruecklich als Teil der Grafik.
- Keine PowerPoint-Masterelemente im Content-SVG: Foliennummer, Footer, globale Logo-Leiste, Praesentationsrahmen, Deck-Header oder Navigationsleiste bleiben ausserhalb des SVGs.
- Farben, Schriften, Abstaende, Radien und semantische Statusfarben folgen `brand/company-brand-tokens.json`; Abweichungen brauchen `data-qa-brand-exception="true"` und `data-qa-reason`.
- Ausfallmarker auf Zeitachsen wirken natuerlich unregelmaessig, sofern keine echten gleichmaessigen Zeitdaten oder abstrakten Prozessschritte dargestellt werden.
- Layout nutzt stabile Abstaende und klare Hierarchie.
- Diagramme, Timelines und Formeln muessen ihre spezifischen Detailgates bestehen.
- Jeder Text in einer Box bleibt sichtbar innerhalb der Box; ein Textueberlauf ist ein Fehler, nicht nur ein Hinweis fuer spaetere Optimierung.

## Zusatzfolien Aus Dem Viewer

- Wenn im Viewer eine zusaetzliche Folie benoetigt wird, wird sie ueber `Zusatzfolie hinzufuegen` als neuer Review-Datensatz angelegt.
- Zusatzfolien haben absichtlich keine alte PowerPoint-Folie und keine alte PNG-Quelle. Die Review-Notiz ist das Briefing fuer den spaeter zu erzeugenden SVG-Vorschlag.
- Die Zusatzfolienliste liegt zentral unter `analysis/viewer-notes/additional-slides.json`; die eigentliche Notiz liegt wie bei normalen Folien unter `analysis/viewer-notes/<module>_slide_<nummer>.json`.
- Zusatzfolien ohne SVG sind Ideenspeicher und duerfen den Viewer-QA-Check mit `--expect-all` nicht hart fehlschlagen lassen. Sobald ein SVG-Vorschlag erzeugt wurde, gelten die normalen SVG-, Animations- und QA-Regeln.
- Verschieben und Loeschen im Viewer sind Kuratierungsaktionen, keine Dateisystem-Aktionen. Reihenfolge und ausgeblendete Folien werden unter `analysis/viewer-notes/viewer-curation.json` gespeichert. Nach dem Loeschen wird fuer 5 Sekunden eine Undo-Meldung angeboten; danach koennen ausgeblendete Folien ueber `Ausgeblendete anzeigen` wieder sichtbar gemacht und wiederhergestellt werden.

## Pflichtcheck Fuer SVG-Module

Vor dem technischen SVG-QA fuer genau die aktive Folie den Content-Transfer-Crosscheck nach `workflow/60-quality/content-transfer-crosscheck.md` ausfuehren. Bei zusammengezogenen Folien muessen alle Referenzfolien einzeln geprueft werden. Konkrete Uebertragungsbefunde werden zuerst behoben und der Crosscheck wird wiederholt.

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

Zielbefehl fuer finale Freigabe, wenn Browser/Layout-QA verfuegbar ist:

```text
node tools/svg-rebuild-qa.js <module_id> --viewer --slides <range> --expect-all --strict-design --layout --layout-strict
```

Ein SVG-Arbeitspaket ist erst freigabefaehig, wenn der Report unter `analysis/render-checks/<module_id>/automated-svg-qa/` keine Errors enthaelt und Design-/Layout-Warnings entweder behoben oder mit nachvollziehbarer Begruendung dokumentiert sind.

Wenn Browser oder Renderer nicht verfuegbar sind, ehrlich melden, welche Checks nicht ausgefuehrt werden konnten.
