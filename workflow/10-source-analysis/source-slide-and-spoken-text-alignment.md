# Source Slide And Spoken Text Alignment

Dieses Dokument ist verbindlich fuer SVG-Rebuilds im Basis-Seminar.

Die exportierten Folien-SVGs werden strukturell transformiert, aber der Kursinhalt bleibt derselbe. Der Sprechertext bleibt bestehen und wird nicht neu geschrieben. Deshalb muss jede neue SVG-Grafik sowohl an den zugeordneten Quell-SVGs als auch am gesprochenen Text ausgerichtet werden.

Fuer neue Module kommt der Text ausschliesslich aus dem vorgelagerten, geprueften Mapping `analysis/inventories/<module_id>_svg-text-map.json`. Eine lose Word-Datei, ein Dateiname oder eine angenommene Reihenfolge ersetzt dieses Mapping nicht.

## Grundsatz

Die Quell-SVG ist Inhalts-, Geometrie- und Zustandsanker. Sie wird nicht neu nachgebaut, sondern uebernommen, bereinigt, neu gruppiert und animierbar gemacht.

Das bedeutet:

- Nicht neu aus Rasterbildern oder PowerPoint-Objekten nachbauen.
- Quellknoten bevorzugt direkt uebernehmen und ihre strukturellen Aenderungen dokumentieren.
- Nicht frei neu erfinden.
- Nicht zusammenfassen, wenn dadurch fachlich relevanter Inhalt verloren geht.
- Die sichtbare Aussage, Reihenfolge, Beispiele, Begriffe, Diagramme und Hervorhebungen der vorhandenen Folien ernst nehmen.
- Den Sprechertext als verbindliche Inhaltsliste behandeln.
- Keine Information weglassen, die im Sprechertext vorkommt und durch die Grafik sichtbar unterstuetzt werden muss.
- Den gesamten fachlich relevanten Quellinhalt uebernehmen. Er darf anders verpackt, anders angeordnet und besser gestaltet werden, aber die neue Grafik bleibt inhaltlich gleichwertig zur Quelle.
- Die Informationsdichte orientiert sich an den Quell-SVGs. Wenn weniger sichtbarer Text verwendet wird, muss derselbe Inhalt durch Grafik, Formel, Plot, Label oder Animation getragen werden.

## Verbindliche Reihenfolge

Vor dem SVG-Bau einer Arbeitseinheit:

1. Quell-SVGs der Sequenz anschauen und mit dem Source-SVG-Inventar abgleichen.
2. Zugehoerige Eintraege im SVG-Text-Mapping und deren Extraktionshashes pruefen.
3. Letzten vollstaendigen Zielzustand bestimmen.
4. Sprechertextabschnitt und fachliche Zusatzinformationen lesen.
5. Eine Alignment-Notiz erstellen.
6. Erst danach Szenenkonzept, Design-Brief und SVG-Bau starten.

## Alignment-Notiz

Fuer jede Arbeitseinheit muss vor dem SVG-Bau dokumentiert sein:

```text
source_slides:
source_svg_paths:
final_source_state:
spoken_text_source:
text_mapping_refs:
spoken_text_points:
  - Aussage oder Begriff, der im Sprechertext vorkommt
must_show_in_svg:
  - visuelles Element, Diagramm, Beispiel, Formel oder Beziehung
source_slide_anchors:
  - vorhandenes SVG-Element, das direkt uebernommen oder umgruppiert wird
source_structure_changes:
  - uebernommene, umgruppierte, konsolidierte, ersetzte oder entfernte Knoten
allowed_reinterpretation:
  - was anders geloest werden darf
explicit_omissions:
  - was weggelassen wird und warum es nicht fuer den Sprechertext gebraucht wird
content_equivalence:
  - wie der fachlich relevante Quellinhalt vollstaendig in der neuen Grafik erhalten bleibt
information_density:
  - ob die neue Grafik gegenueber den Quell-SVGs gleich dicht, kompakter oder dichter ist und warum
review_questions:
  - woran nach dem Render geprueft wird, ob nichts fehlt
```

Diese Notiz kann Teil des Szenenplans unter `analysis/rebuild-plans/` sein. Sie muss nicht lang sein, aber sie muss konkret sein.

## Sprechertext-Abgleich

Der Sprechertext ist nicht dekorativer Kontext, sondern eine Pflichtquelle.

Beim Abgleich gilt:

- Jeder Fachbegriff im relevanten Sprechertext muss entweder visuell eingefuehrt, sichtbar unterstuetzt oder bewusst als rein gesprochene Erklaerung dokumentiert werden.
- Jede Formel, jeder Parameter, jede Datenart und jeder methodische Schritt, der im Sprechertext erklaert wird, muss im SVG vorkommen, wenn die Folie diese Aussage tragen soll.
- Wenn der Sprechertext eine Entwicklung beschreibt, muss die Animation oder Layerfolge diese Entwicklung nachvollziehbar machen.
- Wenn der Sprechertext einen Unterschied betont, muss die Grafik diesen Unterschied sichtbar machen.
- Wenn der Sprechertext eine Folienaussage nicht braucht, darf ein altes Folienelement weggelassen werden, aber die Auslassung wird dokumentiert.

## Orientierung An Vorhandenen Folien

Die Quell-SVGs liefern:

- fachliche Reihenfolge
- zentrale Begriffe
- Beispiele und Zahlen
- Diagrammtypen und Beziehungen
- Hervorhebungen und visuelle Schwerpunkte
- Hinweise auf Animationen oder Aufbaufolgen

Die neue Grafik darf verbessern:

- Layout und Luftigkeit
- Lesbarkeit
- Einsteigerfreundlichkeit
- Animation und Layerlogik
- Achsen, Labels und Datenpunktplatzierung
- Design im neuen Corporate Look

Die neue Grafik darf nicht ohne Begruendung entfernen:

- fachlich relevante Quellinhalte, auch wenn sie nicht wortgleich im Sprechertext vorkommen
- im Sprechertext genannte Schritte
- im Sprechertext genannte Begriffe oder Parameter
- zentrale Diagramme oder Formeln
- Beispiele, Zahlen oder Datenarten, die fuer die Erklaerung gebraucht werden
- Unterschiede, die in der alten Folie sichtbar gemacht wurden

## Kreative Szenen

Der `creative-scene-concept-designer` darf neue Darstellungsformen vorschlagen, bleibt aber an Quelle und Sprechertext gebunden.

Kreativ bedeutet:

- klarer erklaeren
- einsteigerfreundlicher strukturieren
- visuell besser fuehren
- Animation sinnvoll nutzen

Kreativ bedeutet nicht:

- Inhalte austauschen
- Inhalte ausduennen
- Textaussagen ignorieren
- fachliche Begriffe weglassen, die erklaert werden
- eine Szene bauen, die zwar schoen aussieht, aber nicht mehr zum Sprechertext passt

## Review-Pflicht

Ein SVG ist nicht pruefbar fertig, bis diese Fragen beantwortet sind:

- Passt die neue Grafik zum vorhandenen Folieninhalt?
- Passt die neue Grafik zum Sprechertext, ohne dass der Sprechertext geaendert werden muss?
- Fehlt eine Aussage, ein Begriff, eine Formel, ein Diagramm oder ein Beispiel aus dem Sprechertext?
- Wurde jede Abweichung von den Quell-SVGs bewusst entschieden und strukturell dokumentiert?
- Ist die Neugestaltung fuer Basis-Seminar-Lernende verstaendlicher als die alte Darstellung?

Wenn eine dieser Fragen unklar ist, geht die Arbeitseinheit zur Szenenplanung zurueck.
