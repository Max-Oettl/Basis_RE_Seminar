# Python Plot SVG Animation Structure

Status: `external-svg-asset-package-handoff/v1`

Python-Plots bleiben eigenstaendige SVG-Assets, ihre didaktisch relevanten Bestandteile muessen aber im finalen Szenen-DOM adressierbar sein.

## Zielgruppen

Achsen, Ticklabels und Grid koennen als statischer Kontext sichtbar bleiben. Typische animierbare Ziele sind:

- `plot_data_points`,
- `plot_failure_t1`,
- `plot_helper_horizontal_t1`,
- `plot_helper_vertical_t1`,
- `plot_fit_line`,
- `plot_parameter_t`,
- `plot_confidence_limits`,
- `plot_confidence_5`,
- `plot_confidence_95`.

Alle oeffentlichen Targets:

- besitzen stabile semantische ASCII-`snake_case`-IDs,
- tragen `data-anim-target="true"`,
- tragen nach Moeglichkeit `data-anim-label`,
- bleiben ueber Plotrevisionen stabil, solange dasselbe fachliche Element gemeint ist.

## Einbindung

Plot-SVGs mit internen Targets werden inline oder als DOM-adressierbare Gruppen in die Szenen-SVG uebernommen. Eine `<image>`- oder Data-URI-Einbettung ist nur zulaessig, wenn der Plot bewusst monolithisch und statisch bleibt.

## Manifest

Die Plotziele stehen im Animationsmanifest der Szene. Fuer die externe Lieferung gilt `workflow/70-integration/storyboard-import-package-handoff.md`:

- erlaubte Aktionen: `show`, `hide`, `highlight`, `draw`, `transform`,
- jeder Schritt verwendet eine eindeutige `sourceText`-Phrase aus dem freigegebenen Szenensprechertext,
- Wiederholungen verwenden `occurrence`,
- keine Sekunden, Wortindizes, TTS-Zeitpunkte oder absoluten Triggerframes,
- Framewerte beschreiben nur die Dauer einer Aktion.

## Didaktische Reihenfolge

Wenn der Sprechertext den Plot schrittweise erklaert, ist die bevorzugte Reihenfolge:

1. Achsen und Orientierungskontext,
2. Datenpunkte oder Ausfallmarker,
3. Hilfs- und Ableselinien,
4. Fit oder Kurve,
5. Parameter und Labels,
6. Vertrauensgrenzen oder weitere Unsicherheitsinformation.

Die konkrete Reihenfolge folgt dem Sprechertext; diese Liste ist kein starres Timing.

## Generatorregel

Neue oder angepasste Generatoren gruppieren die fachlichen Plotbestandteile bereits beim Export. Nach dem Export werden SVG-XML, IDs, `data-anim-target`, lokale Referenzen, Manifest-Targets und `sourceText`-Treffer durch das zentrale QA-Gate geprueft.
