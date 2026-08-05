# Content Transfer Crosscheck

Dieser Crosscheck prueft pro neuer Content-SVG, ob die fachlichen und sichtbaren Inhalte der zugeordneten PowerPoint-Quell-SVG oder Quell-SVG-Gruppe nachvollziehbar uebertragen wurden. Er ist ein eigener Qualitaetsschritt vor dem technischen SVG-QA-Gate.

## Grundsatz

- Der Crosscheck wird immer folienweise fuer genau eine neue SVG-Arbeitseinheit ausgefuehrt.
- Eine neue Folie kann eine, mehrere oder keine Quell-SVG-Referenzen besitzen.
- Zusammengezogene Reveal-, Morph- oder Aufbaufolien werden gemeinsam gegen alle zugeordneten Quellfolien geprueft.
- Zusatzfolien besitzen keine erfundene Quell-SVG-Referenz. Fuer sie sind Review-Briefing, Nachbarfolien und Sprechertext der Inhaltsanker.
- Quellfolien, die nur als Zwischenzustand in einer anderen neuen Folie aufgehen, erhalten kein eigenes Crosscheck-Ergebnis gegen ein nicht vorhandenes SVG. Ihr Inhalt wird im Crosscheck der aufnehmenden Folie geprueft.

## Verbindliches Referenz-Mapping

Der Sequenz-Preflight erzeugt neben dem Markdown-Plan eine maschinenlesbare Datei:

```text
analysis/rebuild-plans/<module_id>_source-reference-map.json
```

Schema: `basisRebuildSourceReferenceMap/v1`.

Jede geplante SVG-Arbeitseinheit enthaelt mindestens:

- `work_unit`
- `output_slide_number`
- `source_slides`
- `primary_source_slide`
- `mapping_type`: `direct`, `merged` oder `new_content`
- `rationale`

`source_slides` bezeichnet im aktiven Workflow die stabilen Nummern der Quell-SVGs unter `powerpoint-svg/<module_id>/SVG/`. Bei einer Zusammenfuehrung enthaelt die Liste alle aufgenommenen Ursprungszustaende. `primary_source_slide` ist normalerweise die vollstaendigste Quell-SVG.

Fuer jede Referenz muss zusaetzlich der Eintrag in `analysis/inventories/<module_id>_svg-text-map.json` existieren. Der Crosscheck vergleicht damit nicht nur Quell- und Ziel-SVG, sondern auch den wortgetreuen Sprechertext und dokumentierte Zusatzinformationen der aufgenommenen Ursprungsfolien.

Das Mapping wird aktualisiert, bevor eine Quellfolie entfernt, mit einer anderen Folie zusammengezogen oder als Zusatzfolie neu eingeordnet wird. Gleiche Foliennummern duerfen nur als Fallback dienen und gelten bis zur Bestaetigung im Plan als Warnung.

## Globale Viewer-Bedienung

Der Crosscheck ist keine folienspezifische Funktion in der rechten Detailleiste. Er liegt global in der oberen Werkzeugleiste des Viewers.

Direkt neben dem Button wird der Pruefbereich gewaehlt:

- `Alle Module`: alle pruefbaren SVG-Folien aller geladenen Module,
- `Modul: <module_id>`: alle pruefbaren SVG-Folien genau dieses Moduls,
- `Einzelne Folie`: nur die aktuell in der linken Folienliste ausgewaehlte Folie.

Auch bei Modul- oder Gesamtauswahl arbeitet der Viewer intern strikt Folie fuer Folie. Er startet erst den naechsten Crosscheck, wenn der vorherige Bericht gespeichert wurde. Fortschritt und Befunde erscheinen in einer globalen Ergebnisuebersicht; von dort kann zur betroffenen Folie gesprungen werden.

## Deterministische Pruefung Pro Folie

Fuer jede Folie im ausgewaehlten Bereich wird geprueft:

1. Existiert ein explizites Referenz-Mapping?
2. Sind alle zugeordneten Quell-SVGs vorhanden und parsebar?
3. Existieren die passenden SVG-Text-Mapping-Eintraege und stimmen ihre Hashes?
4. Existiert der aktuelle SVG-Vorschlag?
5. Sind relevante sichtbare Texte aus den Quell-SVGs im Ziel-SVG nachweisbar oder als bewusste visuelle Transformation dokumentiert?
6. Sind alle im gemappten Sprechertext grafisch zu tragenden Begriffe, Schritte, Parameter, Formeln und Unterschiede im Ziel nachweisbar oder bewusst dokumentiert?
7. Gibt es verdaechtige Zeichenfolgen, die auf fehlerhaft uebertragene Umlaute, Sonderzeichen oder Indizes hindeuten?
8. Besitzt eine zusammengezogene Mehrfolien-Szene Animationsschritte fuer ihren Aufbau?
9. Welche nicht textuell pruefbaren Pfade, Bilder, Diagrammgeometrien, Mengen, Positionen und Hervorhebungen muessen weiterhin manuell gegen die Quell-SVGs und den Sprechertext geprueft werden?

Die Referenzauswahl im Viewer schaltet bei Mehrfachzuordnungen zwischen den Quell-SVGs um. Der Bericht wird gespeichert unter:

```text
analysis/viewer-notes/crosschecks/<module_id>_slide_<nummer>.json
```

Ein Bericht wird als veraltet markiert, sobald sich der SVG-Inhalt oder das Referenz-Mapping geaendert hat.
Er wird ebenfalls veraltet, wenn sich ein Quell-SVG-, DOCX-, Extraktions- oder Sprechertexthash im SVG-Text-Mapping aendert.

## Statuswerte

- `precheck_passed`: deterministische Pruefung ohne konkreten Befund; manueller visueller Abgleich bleibt erforderlich.
- `review_required`: nicht textuell nachweisbare oder anderweitig zu pruefende Uebertragung.
- `issues_found`: konkreter Fehler, fehlende Referenz, fehlende Quelle oder verdaechtige Zeichenuebertragung.
- `not_applicable`: Quellfolie besitzt bewusst kein eigenes SVG und wird in einer anderen Arbeitseinheit mitgeprueft.

`precheck_passed` ist keine automatische fachliche Endfreigabe. Positionen, Mengen, Diagrammlogik, Bildaussagen und Sprechertextpassung koennen nicht vollstaendig aus Textknoten abgeleitet werden.

## Folienweise Korrekturschleife

1. Neue SVG nach Plan und Detailrichtlinien erstellen oder korrigieren.
2. Crosscheck fuer genau diese Folie ausfuehren.
3. Quell-SVGs einzeln durchschalten und alle Befunde sowie manuellen Pruefpunkte bearbeiten.
4. Crosscheck erneut ausfuehren, bis keine konkreten Uebertragungsfehler verbleiben.
5. Danach das technische und gerenderte QA-Gate fuer dieselbe Folie ausfuehren.
6. Erst nach Crosscheck und Re-QA zur naechsten Arbeitseinheit wechseln.
