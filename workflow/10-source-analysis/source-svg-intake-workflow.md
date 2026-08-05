# Source SVG Intake Workflow

Dieser Workflow ist die zweite Intake-Stufe fuer neue Basis-Seminar-Module. Er folgt zwingend auf die DOCX-Extraktion und das SVG-Text-Mapping nach `workflow/10-source-analysis/source-text-docx-intake-and-mapping.md` und ersetzt die parallele Analyse von PPTX, PDF und PNG.

## Ziel

Alle aus PowerPoint exportierten Quell-SVGs eines Moduls werden vollstaendig inventarisiert, technisch verstanden und in ihrer Reihenfolge verglichen. Die Analyse klaert insbesondere, welche Dateien eigenstaendige Inhalte und welche nur aufeinanderfolgende Aufbau-, Reveal-, Highlight- oder Morph-Zustaende sind.

In dieser Phase werden keine Quell-SVGs veraendert und noch keine Ziel-SVGs produziert. Sie beginnt erst, wenn jede Quell-SVG einen eindeutig gemappten Sprechertext besitzt.

## Eingang

```text
source-materials/basis-seminar/powerpoint-svg/<module_id>/SVG/*.svg
```

Pflichtvoraussetzung:

```text
source-materials/basis-seminar/powerpoint-svg/<module_id>/Text/*.docx
analysis/inventories/<module_id>_svg-text-map.json
```

Die Quell-SVG ist die einzige visuelle Referenz. Der bereits extrahierte und gemappte Sprechertext dient als fachliche, didaktische und sprachliche Triggerreferenz. Die fruehere Gliederung in mehrere PowerPoint-Dateien spielt keine Rolle.

## Pflichtartefakte

```text
analysis/inventories/<module_id>_source-svg-inventory.json
analysis/rebuild-plans/<module_id>_sequence_plan.md
analysis/rebuild-plans/<module_id>_source-reference-map.json
```

Das vorgelagerte Text-Mapping liegt unter `analysis/inventories/<module_id>_svg-text-map.json`. Das SVG-Inventar folgt `analysis/source-svg-inventory.schema.json`. Der Sequenzplan folgt `templates/module-sequence-plan-template.md`.

## Schritt 1: Modulaufnahme

1. Modulordner und Modul-ID `RE1` bis `RE5` bestimmen.
2. Das SVG-Text-Mapping laden und seine gespeicherten SVG-, DOCX- und Extraktionshashes mit dem aktuellen Eingang vergleichen.
3. Alle Quell-SVGs anhand der bestaetigten Mapping-Reihenfolge sortieren. Der interne stabile Schluessel bleibt `slide_###`, auch wenn die PowerPoint-Exportdatei anders benannt ist.
4. Doppelte, fehlende oder unklare Foliennummern dokumentieren.
5. Jede Datei als XML lesen und Root-Element, `viewBox`, Breite und Hoehe erfassen. Fehlt die `viewBox`, aber numerische Breite und Hoehe sind vorhanden, wird `0 0 <width> <height>` als abgeleitete Analysegeometrie dokumentiert und die Quelle bleibt unveraendert. Fehlen auch eindeutige Dimensionen, ist die Datei blockiert.
6. Relative und eingebettete Referenzen inventarisieren. Externe HTTP-/Dateisystemreferenzen als Risiko markieren.
7. Datei-Hash speichern, damit spaetere Aenderungen am unveraenderlichen Eingang erkannt werden.
8. Pro Quell-SVG `text_mapping_ref`, extrahierte Markdown-Quelle, wortgetreuen `spoken_text` und fachliche Zusatzinformationen aus dem Mapping uebernehmen.

## Schritt 2: Einzelfolienanalyse

Jede Quell-SVG wird einzeln und in Reihenfolge geprueft:

- sichtbarer Text, Formeln, Zahlen, Einheiten und Labels,
- Hauptvisual, Diagramm, Timeline, Tabelle, Prozess, Bild oder Piktogramm,
- vorhandene Gruppen, IDs, Klassen und Z-Reihenfolge,
- `defs`, Marker, Clip-Pfade, Masken, Filter, Symbole und Wiederverwendung,
- eingebettete oder lokale Bilder,
- Inline-Styles, praesentationsbezogene Attribute und verwendete Fonts,
- technische Risiken wie `foreignObject`, Scripts, externe Stylesheets, fehlende IDs oder nicht aufloesbare Referenzen,
- fachliche Kernaussage und vollstaendig zu erhaltende Inhalte,
- moegliche PowerPoint-Masterelemente, die im spaeteren Content-SVG entfallen sollen.

## Schritt 3: Nachbarvergleich

Nach jeder Einzelfolie wird sie mit dem vorherigen und folgenden Zustand verglichen:

- Welche Elemente sind identisch?
- Welche Elemente kommen hinzu oder verschwinden?
- Welche Elemente bewegen sich, wechseln Farbe, Groesse, Deckkraft oder Hervorhebung?
- Ist die spaetere Folie der vollstaendigere Zustand derselben Grafik?
- Bleibt die fachliche Aussage gleich und aendert sich nur die Erklaerreihenfolge?
- Kann die Zustandsaenderung als `reveal`, `fade`, `draw`, `move`, `highlight` oder `replace` modelliert werden?
- Sind scheinbar gleiche Elemente wirklich dieselben semantischen Objekte oder nur aehnlich gestaltet?

Die Antwort wird als `state_delta` im Inventar und spaeter als Sequenzgruppe im Modulplan gespeichert.

## Schritt 4: Sequenzentscheidung

Jede Quell-SVG erhaelt genau eine vorlaeufige Rolle:

- `standalone`: eigenstaendige Zielarbeitseinheit,
- `sequence_start`: erster Zustand einer zusammenzufuehrenden Folge,
- `sequence_state`: Zwischenzustand einer Folge,
- `sequence_final`: vollstaendigster Zustand einer Folge,
- `duplicate_state`: kein eigener fachlicher Zustand,
- `absorbed_source`: wird in einer anderen Zielarbeitseinheit mitgefuehrt,
- `new_content_anchor`: nur fuer spaeter im Viewer angelegte Zusatzfolien, nicht fuer gelieferte Quell-SVGs.

Die endgueltige Gruppierung erfolgt in `workflow/20-scene-planning/preflight-sequence-planning.md`.

## Schritt 5: Spezialelemente

Die Quell-SVG wird grundsaetzlich transformiert, nicht nachgebaut. Nur technisch oder didaktisch begruendete Spezialfaelle verlassen die direkte Uebernahme:

- echte Plots und technische Diagramme: `workflow/31-python-plots/python-plot-workflow.md`,
- Formeln mit unzureichender Exportqualitaet: `workflow/32-formulas/formula-workflow.md`,
- einfache Ausfallzeitachsen und Timelines: `workflow/33-timelines/timeline-workflow.md`,
- nicht portable Bilder oder Referenzen: `workflow/30-visual-decision/svg-asset-decision-gate.md`.

Das Inventar markiert nur den Bedarf. Die Erzeugung erfolgt spaeter im Ordner der Zielarbeitseinheit.

## Abbruchbedingungen

Noch keine Szenenplanung oder Produktion, wenn:

- das SVG-Text-Mapping fehlt, veraltet ist oder offene Zuordnungen enthaelt,
- eine erwartete Foliennummer fehlt und die Luecke nicht erklaert ist,
- eine Quell-SVG nicht parsebar ist,
- weder eine `viewBox` noch eindeutig numerische Werte fuer Breite und Hoehe vorliegen,
- sichtbarer Inhalt nur ueber eine nicht vorhandene externe Referenz kommt,
- die Modulreihenfolge unklar ist,
- nicht alle Quell-SVGs mindestens einmal einzeln bewertet wurden.

## Abschluss

Der Intake ist abgeschlossen, wenn das Inventar vollstaendig ist und jede Quell-SVG eine dokumentierte Rolle, Inhaltszusammenfassung, technische Bewertung, Nachbarzustandsanalyse und Referenz auf den gemappten Sprechertext besitzt. Erst danach beginnt der modulweite Sequenz-Preflight.
