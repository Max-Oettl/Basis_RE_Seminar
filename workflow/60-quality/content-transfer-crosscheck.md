# Content Transfer Crosscheck

Dieser Crosscheck prueft pro neuer Content-SVG, ob die fachlichen Inhalte der zugeordneten alten PowerPoint-Folie oder Foliengruppe nachvollziehbar uebertragen wurden. Er ist ein eigener Qualitaetsschritt vor dem technischen SVG-QA-Gate.

## Grundsatz

- Der Crosscheck wird immer folienweise fuer genau eine neue SVG-Arbeitseinheit ausgefuehrt.
- Eine neue Folie kann eine, mehrere oder keine alten Referenzfolien besitzen.
- Zusammengezogene Reveal-, Morph- oder Aufbaufolien werden gemeinsam gegen alle zugeordneten Quellfolien geprueft.
- Zusatzfolien besitzen keine erfundene Altfolienreferenz. Fuer sie sind Review-Briefing, Nachbarfolien und Sprechertext der Inhaltsanker.
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
2. Sind alle zugeordneten gerenderten Quellfolien und Analyse-JSONs vorhanden?
3. Existiert der aktuelle SVG-Vorschlag?
4. Sind relevante sichtbare Quelltexte und Formelinhalte im SVG-Text nachweisbar oder als visueller Pruefpunkt markiert?
5. Gibt es verdaechtige Zeichenfolgen, die auf fehlerhaft uebertragene Umlaute, Sonderzeichen oder Indizes hindeuten?
6. Besitzt eine zusammengezogene Mehrfolien-Szene Animationsschritte fuer ihren Aufbau?
7. Welche fachlichen und visuellen Aussagen muessen weiterhin manuell gegen die Referenzbilder und den Sprechertext geprueft werden?

Die Referenzauswahl im Viewer schaltet bei Mehrfachzuordnungen zwischen den alten Folien um. Der Bericht wird gespeichert unter:

```text
analysis/viewer-notes/crosschecks/<module_id>_slide_<nummer>.json
```

Ein Bericht wird als veraltet markiert, sobald sich der SVG-Inhalt oder das Referenz-Mapping geaendert hat.

## Statuswerte

- `precheck_passed`: deterministische Pruefung ohne konkreten Befund; manueller visueller Abgleich bleibt erforderlich.
- `review_required`: nicht textuell nachweisbare oder anderweitig zu pruefende Uebertragung.
- `issues_found`: konkreter Fehler, fehlende Referenz, fehlende Quelle oder verdaechtige Zeichenuebertragung.
- `not_applicable`: Quellfolie besitzt bewusst kein eigenes SVG und wird in einer anderen Arbeitseinheit mitgeprueft.

`precheck_passed` ist keine automatische fachliche Endfreigabe. Positionen, Mengen, Diagrammlogik, Bildaussagen und Sprechertextpassung koennen nicht vollstaendig aus Textknoten abgeleitet werden.

## Folienweise Korrekturschleife

1. Neue SVG nach Plan und Detailrichtlinien erstellen oder korrigieren.
2. Crosscheck fuer genau diese Folie ausfuehren.
3. Referenzfolien einzeln durchschalten und alle Befunde sowie manuellen Pruefpunkte bearbeiten.
4. Crosscheck erneut ausfuehren, bis keine konkreten Uebertragungsfehler verbleiben.
5. Danach das technische und gerenderte QA-Gate fuer dieselbe Folie ausfuehren.
6. Erst nach Crosscheck und Re-QA zur naechsten Arbeitseinheit wechseln.
