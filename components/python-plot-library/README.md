# Python Plot Library

Kanonischer Projektworkflow: `workflow/31-python-plots/python-plot-workflow.md`.

Diese Library ist die fuehrende Quelle fuer wiederkehrende echte technische Diagramme und Plots.
Plots werden nicht mehr als handgezeichnete SVG-Vorlagen begonnen, sondern
aus Python-Code erzeugt. Das macht Achsen, Ticks, Datenpunkte, Kurven und
Fits reproduzierbar.

## Grundregel

Vor jeder neuen echten Plot- oder Diagramm-Grafik:

1. Prüfen, ob ein passender Generator in dieser Library vorhanden ist.
2. Falls ja: vorhandenen Generator mit konkreten Daten, Achsenlabels und Einheiten nutzen.
3. Falls nein: neuen Python-Generator in diesem Ordner anlegen und im
   `diagram-registry.json` dokumentieren.
4. Den erzeugten SVG-Plot als Asset in das Szenen-SVG einbinden oder dort mit
   SVG-nativen Callouts und Animationsebenen ergänzen.

Didaktische Plotinhalte werden fuer Seminarfolien standardmaessig einzeln oder
in fachlich sinnvollen Kleingruppen animierbar vorbereitet. Achsen, Ticklabels
und Grid duerfen als Orientierung sichtbar sein; Datenpunkte, Ausfallmarker,
Hilfslinien, Fit-Linien, Parameterablesungen, Vertrauensgrenzen, Markierungen
und daran gekoppelte Labels/Legenden erscheinen in der Szenenanimation
schrittweise. Dafuer muessen die Plot-SVGs stabile fachliche IDs tragen, z.B.
`plot-data-points`, `plot-failure-marker-t1`, `plot-helper-horizontal-t1`,
`plot-fit-line` oder `plot-confidence-limits`.

Python-Plots tragen keinen sichtbaren Titel. Der Folien- oder Szenentitel wird
außerhalb des Plotassets gesetzt, wenn er gebraucht wird.

Generische Timelines, Aufbauachsen, Ausfall-Zeitstrahlen oder einfache Objekt-Zeitachsen sind keine Python-Plots, solange sie nur Ereignisse, Ausfaelle mit `X`/Kreuzen oder Zensierungen markieren. Sie werden als didaktische SVG-Komposition geplant, weil dort Animation, Hervorhebung und Folienlayout wichtiger sind als ein wissenschaftlicher Plot.

Sobald Achsenskalierung, Datenpunkte, Kurven, Fit-Linien, Wahrscheinlichkeitsnetze, Verteilungen oder Vertrauensgrenzen fachlich dargestellt werden, gilt der Python-Plot-Workflow.

Deutschsprachige Plotlabels verwenden echte Umlaute und `ß`, zum Beispiel
`Prüfzeit`, `Größe`, `Ausfälle` und `Zuverlässigkeit`. Ersatzschreibungen wie
`Pruefzeit`, `Groesse`, `Ausfaelle` oder `Zuverlaessigkeit` sind in sichtbaren
Labels nicht zulässig.

## Einheitlicher Plot-Stil

Alle Generatoren importieren `reltest_plot_style.py`. Darin liegen:

- 16:9-Figurformat für E-Learning-Grafiken
- einheitliche Schriftfamilie und Schriftgrößen
- ruhige Gridlines
- konsistente Achsen-, Daten- und Akzentfarben
- SVG-Export mit editierbarem Text (`svg.fonttype = none`)
- kein PNG-Export aus den Python-Generatoren

Neue Generatoren dürfen diese Regeln nur begründet überschreiben.

## Gemeinsame Daten Fuer Plot-Sequenzen

Plot-Sequenzen, die ueber mehrere Folien schrittweise aufgebaut werden, duerfen Datenpunkte und Achsen nicht neu interpretieren. Sortierung, Median-Rank-Auftragung, Fit, Parameterablesung und Vertrauensgrenzen verwenden denselben Daten- und Achsenvertrag.

Fuer `RE3_TEST_1` ist `basis_seminar_plot_data.py` die gemeinsame Quelle fuer die wiederkehrende Weibull-/Median-Rank-Sequenz. Neue Generatoren oder Slide-spezifische Renderaufrufe sollen diese Quelle importieren, statt eigene Default-Ausfallzeiten oder eigene x-Achsenlimits zu definieren.

Plots werden im Seminar haeufig kleiner in eine Szene eingebunden und dienen
oft der Visualisierung grundlegender Zusammenhaenge, nicht dem Ablesen vieler
Detailwerte. Achsenbeschriftungen, Ticklabels und Legenden werden deshalb
bewusst groesser gesetzt als in klassischen Paper-Abbildungen. Neue Generatoren
duerfen diese Lesbarkeitsgroessen nicht lokal verkleinern, ausser ein konkreter
Szenenbrief begruendet es.

Python-Plots sind SVG-only. Falls fuer Viewer, Video oder QA ein PNG benoetigt
wird, wird es ausserhalb des Plotgenerators aus dem SVG erzeugt.

Die provisorische Struktur fuer animierbare Plot-SVGs steht in
`svg-animation-structure.provisional.md`. Bis die projektweite Struktur vorliegt,
gilt dort: gewuenschte Plot-Elemente werden als stabile SVG-Targets vorbereitet
und koennen ueber Zeittrigger, zum Beispiel nach 3 Sekunden, eingeblendet werden.
Wenn plotinterne Elemente im Viewer oder Praesentationsmodus animiert werden,
muss das Plot-SVG im Szenen-SVG DOM-adressierbar eingebunden werden. Eine reine
Data-URI-`image`-Einbettung ist fuer schrittweise Plotinhalte nur als statischer
Fallback zulaessig.
Der Weibull-Confidence-Generator kann die Vertrauensgrenzen testweise mit
`--confidence-trigger-at-seconds <sekunden>` als zeitgetriggerte SVG-Gruppe
`plot-confidence-limits` ausgeben.

Vertrauensgrenzen in Weibull- oder vergleichbaren Wahrscheinlichkeitsnetzen
werden als zwei klare Grenzkurven gezeichnet, typischerweise 5 % und 95 %.
Gefüllte Vertrauensbereiche oder zufällig wirkende Bänder sind nicht zulässig,
wenn explizit Vertrauensgrenzen gefragt sind. Bootstrap-basierte Grenzen müssen
über festen Seed und dokumentierte Samplezahl reproduzierbar erzeugt werden.
Fuer Weibull-Vertrauensgrenzen ist `weibull_confidence_plot.py` die kanonische
Darstellung: blauer Weibull-Fit, offene rote Ausfallpunkte und zwei graue,
gestrichelte, nicht-parallele 5 %- und 95 %-Bootstrap-Grenzkurven. Klassische
lineare Regressions-Vertrauenslinien ersetzen diese Darstellung nicht.

## Setup

Die Generatoren verwenden Matplotlib:

```powershell
py -m pip install -r components\python-plot-library\requirements.txt
```

## Vorhandene Generatoren

| diagram_type | Python file | Zweck |
|---|---|---|
| `axis_diagram` | `axis_diagram.py` | Generisches x/y-Diagramm mit optionalen Datenpunkten und Linie |
| `failure_probability_construction_plot` | `failure_probability_construction_plot.py` | Median-Rank-Konstruktionsdiagramm mit F(t_i)-Hilfslinien |
| `weibull_probability_plot` | `weibull_probability_plot.py` | Weibull-Wahrscheinlichkeitsnetz mit berechneter Transformation |
| `weibull_parameter_plot` | `weibull_parameter_plot.py` | Weibull-Wahrscheinlichkeitsnetz mit T- und b-Ablesehilfen |
| `weibull_mechanism_split_plot` | `weibull_mechanism_split_plot.py` | Weibull-Wahrscheinlichkeitsnetz mit zwei Ausfallmechanismen |
| `weibull_confidence_plot` | `weibull_confidence_plot.py` | Weibull-Wahrscheinlichkeitsnetz mit reproduzierbaren 5 %- und 95 %-Vertrauensgrenzen |

## Beispiele

### X/Y-Linienplot

```powershell
python components\python-plot-library\axis_diagram.py `
  --xlabel "Prüfzeit [h]" `
  --ylabel "Messgröße" `
  --x "0,120,240,480,720,960" `
  --y "1.2,1.9,2.5,3.7,4.2,5.4" `
  --output rebuild-proposals\svg\RE3_TEST_1\slide_004\plots\axis_diagram_line.svg
```

### X/Y-Punkteplot

```powershell
python components\python-plot-library\axis_diagram.py `
  --xlabel "Temperatur [°C]" `
  --ylabel "Zuverlässigkeit [%]" `
  --x "40,55,70,85,100,115" `
  --y "99.2,98.7,97.1,94.8,91.3,86.6" `
  --no-connect `
  --output rebuild-proposals\svg\RE3_TEST_1\slide_004\plots\axis_diagram_points.svg
```

### Weibull-Wahrscheinlichkeitsnetz

```powershell
python components\python-plot-library\weibull_probability_plot.py `
  --xlabel "Lebensdauer t" `
  --ylabel "Ausfallwahrscheinlichkeit F(t) [%]" `
  --times "12,18,27,44,68,105,160" `
  --output rebuild-proposals\svg\RE3_TEST_1\slide_005\plots\weibull_probability_plot.svg
```

### Weibull-Wahrscheinlichkeitsnetz Mit T Und b

```powershell
python components\python-plot-library\weibull_parameter_plot.py `
  --xlabel "Lebensdauer t" `
  --ylabel "Ausfallwahrscheinlichkeit F(t) [%]" `
  --times "12,18,27,44,68,105,160" `
  --output rebuild-proposals\svg\RE3_TEST_1\slide_006\plots\weibull_parameter_plot.svg
```

### Weibull-Wahrscheinlichkeitsnetz Mit Zwei Mechanismen

```powershell
python components\python-plot-library\weibull_mechanism_split_plot.py `
  --xlabel "Lebensdauer t" `
  --ylabel "Ausfallwahrscheinlichkeit F(t) [%]" `
  --times-a "12,18,27,44" `
  --times-b "38,65,105,170" `
  --output rebuild-proposals\svg\RE3_TEST_1\slide_009\plots\weibull_mechanism_split_plot.svg
```

### Weibull-Wahrscheinlichkeitsnetz Mit Vertrauensgrenzen

```powershell
python components\python-plot-library\weibull_confidence_plot.py `
  --xlabel "Lebensdauer t" `
  --ylabel "Ausfallwahrscheinlichkeit F(t) [%]" `
  --times "12,18,27,44,68,105,160" `
  --lower-bound 0.05 `
  --upper-bound 0.95 `
  --bootstrap-samples 5000 `
  --seed 42 `
  --output rebuild-proposals\svg\RE3_TEST_1\slide_013\plots\weibull_confidence_plot.svg
```

### Animierter Weibull-Testplot

```powershell
python components\python-plot-library\weibull_confidence_plot.py `
  --xlabel "Lebensdauer t" `
  --ylabel "Ausfallwahrscheinlichkeit F(t) [%]" `
  --times "12,18,27,44,68,105,160" `
  --lower-bound 0.05 `
  --upper-bound 0.95 `
  --bootstrap-samples 5000 `
  --seed 42 `
  --confidence-trigger-at-seconds 3 `
  --output rebuild-proposals\svg\RE3_TEST_1\slide_013\plots\weibull_confidence_plot_animated.svg
```

## Output-Regeln

- Folienspezifische Plot-Assets gehoeren in den Ordner der jeweiligen Folie,
  z.B. `rebuild-proposals/svg/<module_id>/slide_###/plots/<plot_id>.svg`.
- Folienspezifische Plotdaten und Renderkonfigurationen liegen daneben unter
  `rebuild-proposals/svg/<module_id>/slide_###/data/`.
- Zentrale Generatoren, Styles und wiederverwendbare Datenmodule bleiben in
  `components/python-plot-library/`; die konkrete gerenderte Ausgabe der Folie
  muss trotzdem im Folienordner liegen.
- SVG-Plotassets bleiben erzeugte Artefakte aus Python, keine manuell
  gepflegten Diagrammvorlagen.
- Python-Plotgeneratoren exportieren ausschliesslich SVG.
- Didaktische Plotinhalte muessen stabile IDs/Gruppen fuer sequenzielles
  Einblenden besitzen; neue Generatoren duerfen keine rein monolithischen
  Plotbilder fuer Erklaerfolien erzeugen.
- Wenn ein Plot später angepasst werden muss, wird der Python-Code oder die
  Daten-Spezifikation angepasst und der Plot neu erzeugt.
- Callouts, didaktische Hervorhebungen und Animationen dürfen im Szenen-SVG
  um den Plot herum entstehen, aber die Datengeometrie bleibt im Python-Plot.
