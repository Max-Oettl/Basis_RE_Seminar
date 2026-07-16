# Provisorische SVG-Animationsstruktur Fuer Python-Plots

Status: provisorisch. Diese Datei gilt, bis die projektweite einheitliche
Animationsstruktur fuer SVGs vorliegt. Sobald diese Struktur definiert ist,
wird dieses Dokument darauf gemappt oder ersetzt.

## Grundsatz

Python-Plotgeneratoren exportieren Plotassets nur als SVG. PNG-Exports gehoeren
nicht zum Output der Python Plot Library. Falls fuer Review oder QA ein Rasterbild
benoetigt wird, wird es ausserhalb des Plotgenerators aus dem SVG erzeugt.

Die erzeugten SVGs muessen so vorbereitet sein, dass einzelne Plotbestandteile
spaeter animiert oder zeitweise eingeblendet werden koennen. Die Datengeometrie
bleibt im Plot-SVG; Animation, Callouts und Szenenlogik werden im uebergeordneten
Szenenworkflow entschieden.

## Animationseinheiten

Animierbare Einheiten sind sinnvolle SVG-Gruppen oder Einzelelemente. Fuer
erklaerende Seminarplots werden alle didaktischen Plotinhalte standardmaessig
als Animationseinheiten vorbereitet. Achsen, Ticklabels und Grid koennen als
Orientierungsbasis sofort sichtbar bleiben; die eigentliche Aussage des Plots
wird schrittweise sichtbar.

Typische Animationseinheiten sind zum Beispiel:

- Achsen und Raster
- Datenpunkte oder einzelne Datenpunkt-Gruppen
- Ausfallzeitpunkte, Ausfallkreuze und Zensurmarker
- Fit-Linie oder Kurve
- Vertrauensgrenzen
- Hilfs-, Ablese- und Markerlinien
- Parameterlabels und Werte
- Legende, sofern sie an noch nicht sichtbare Inhalte gekoppelt ist
- einzelne Hervorhebungen oder Annotationen

Jede potenziell animierbare Einheit braucht eine stabile, sprechende ID. Die ID
muss fachlich lesbar sein, zum Beispiel `plot-data-points`,
`plot-weibull-fit`, `plot-confidence-limits` oder `plot-legend`.

Empfohlene ID-Muster:

```text
plot-data-points
plot-failure-marker-t1
plot-helper-horizontal-t1
plot-helper-vertical-t1
plot-fit-line
plot-parameter-t
plot-parameter-b
plot-confidence-5
plot-confidence-95
plot-confidence-limits
```

Wenn mehrere Folien dieselbe Plotsequenz aufbauen, bleiben die IDs fuer gleiche
fachliche Elemente zwischen den Folien gleich. Das erleichtert Review,
Animation und spaetere Korrekturen.

## Provisorisches Trigger-Modell

Gewuenschte Animationen werden als Zeittrigger gedacht. Ein Trigger beschreibt,
wann ein bestimmtes SVG-Element oder eine SVG-Gruppe eingeblendet oder aktiviert
werden soll, zum Beispiel nach 3 Sekunden.

Provisorisches Minimalmodell:

```yaml
animation_trigger:
  target_id: "plot-confidence-limits"
  trigger_type: "time"
  trigger_at_seconds: 3.0
  action: "show"
  note: "Vertrauensgrenzen nach dem Weibull-Fit einblenden."
```

Fuer schrittweise Erklaerplots ist die Standardreihenfolge:

1. Achsen, Grid und Achsenlabels als Basis zeigen.
2. Datenpunkte oder Ausfallmarker einblenden.
3. Hilfslinien, Ableselinien oder Zuordnungslinien einblenden.
4. Fit-Linie, Kurve oder Verteilung einblenden.
5. Parameterwerte, Legende oder Labels einblenden.
6. Vertrauensgrenzen oder Unsicherheitsinformationen einblenden.

Dieses Modell ist bewusst klein gehalten. Es legt nur fest, dass gewuenschte
Elemente ueber einen Zeittrigger ausgeloest werden. Die finale Syntax, Ablage
und technische Umsetzung werden spaeter durch die projektweite Struktur ersetzt.

## Entscheidungspunkt

Ob bestimmte Plot-Elemente animierbar vorbereitet oder mit einem Trigger
versehen werden sollen, wird entweder direkt beim Erstellen des Plotassets
entschieden oder nachtraeglich in den Verbesserungsnotizen festgehalten.

Wenn die Entscheidung erst nachtraeglich faellt, muessen die Verbesserungsnotizen
mindestens enthalten:

- Ziel-Element oder Ziel-Gruppe
- gewuenschter Zeitpunkt, zum Beispiel `3.0s`
- Aktion, zum Beispiel `show`, `hide`, `highlight`
- kurzer fachlicher Zweck der Animation

## Vorlaeufige Produktionsregel

Neue Python-Plotgeneratoren sollen fachliche Plotbestandteile so gruppieren, dass
eine spaetere Animation ohne Neuzeichnen der Datengeometrie moeglich ist. Wenn ein
bestehender Plotgenerator noch keine ausreichend stabilen IDs oder Gruppen erzeugt,
wird das als Verbesserungsnotiz dokumentiert und bei der naechsten Anpassung des
Generators nachgezogen.

Wenn ein Plot in ein Szenen-SVG eingebunden wird und plotinterne Elemente
animiert werden sollen, muss das Plot-SVG inline oder anderweitig DOM-adressierbar
eingebunden werden. Eine reine `image`-Einbettung per Data-URI ist nur ein
statischer Fallback und fuer didaktisch schrittweise Plotinhalte nicht ausreichend.
