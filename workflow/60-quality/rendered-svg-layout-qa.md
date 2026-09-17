
Bestehender Zustand

# Deterministische Rendered-SVG-Layout-QA

Diese Datei beschreibt die gewünschte Erweiterung des bestehenden SVG-Rebuild-QA-Gates. Sie ist eine Spezifikation für Codex. Die Umsetzung soll minimal-invasiv erfolgen. Der zentrale Entry Point bleibt `tools/svg-rebuild-qa.js`.

Es gibt bereits ein technisches QA-Gate unter:

```text
tools/svg-rebuild-qa.js
```

Aktuelle Ausführung:

```bash
node tools\svg-rebuild-qa.js <module_id> --viewer --slides <range> --expect-all
```

Dieses Gate prüft aktuell bereits unter anderem:

* SVG ist XML-valide
* `viewBox` existiert und ist ungefähr 16:9
* keine doppelten IDs
* interne `href="#id"`-Verweise zeigen auf existierende IDs
* eingebundene Bildpfade existieren oder sind erlaubte Data-URIs
* keine Inline-`<animate>`-Elemente, Animationen müssen über `scene.animation.v1.json` laufen
* keine Mojibake-/Replacement-Zeichen
* keine sichtbaren PowerPoint-Titel
* keine sichtbaren Modul-/Folien-Kicker wie `RE3_TEST_1 · Folie 03`
* keine sichtbaren Workflow-/Quelle-/Fokus-Metazeilen
* Warnung bei möglichen ASCII-Ersatzschreibungen wie `fuer`, `koennen`, `Ausfaelle`
* Manifest ist JSON-valide
* Manifest-`svgPath` existiert
* Animation-Targets existieren wirklich im SVG
* Animation-Steps referenzieren bekannte Targets
* Viewer-Mapping: jede erwartete Folie hat SVG und Animation

Der letzte Testlauf hatte:

```text
13 SVGs, 13 Manifeste, 0 Errors, 0 Warnings
```

## Bestehende fachliche Gates

Zusätzlich gibt es prozessuale und fachliche Gates:

```text
workflow/60-quality/rebuild-quality-gate.md
workflow/31-python-plots/diagram-guidelines.md
workflow/32-formulas/formula-workflow.md
workflow/33-timelines/timeline-workflow.md
```

Dort ist fachlich bereits gefordert:

* Text muss in Boxen bleiben
* Achsenlabels, Legenden und Formeln müssen lesbar sein
* keine sichtbaren Folientitel oder neuen globalen Szenentitel
* Ausfallmarker auf Zeitachsen müssen natürlich unregelmäßig sein
* Diagramme, Timelines und Formeln müssen ihre Spezialgates bestehen
* Marker dürfen Pfeilspitzen nicht berühren
* Labels dürfen nicht kollidieren
* Formeln müssen korrekt als LaTeX/Mathtext-SVG erzeugt werden
* Diagramme müssen Plot-/Diagrammregeln erfüllen

## Fehlender Punkt

Der große fehlende Punkt ist ein starker automatisierter Layout- und Render-Geometrie-Check.

Aktuell wird noch nicht hart genug automatisch erkannt, ob:

* Text tatsächlich aus Boxen läuft
* Text unter oder hinter seiner Hintergrundbox liegt
* Text zwar geometrisch in der Box liegt, aber verdeckt wird
* Elemente optisch kollidieren
* Achsen, Marker, Kreuze, Pfeile und Pfeilspitzen korrekt geschichtet sind
* Pfeilspitzen sauber mit Linien abschließen
* Labels, Legenden, Achsenbeschriftungen oder Formeln verdeckt werden
* Elemente im gerenderten SVG außerhalb der Slide-Fläche liegen
* Animationen Zwischenzustände erzeugen, in denen Layout oder Layering kaputt ist

## Ziel der Änderung

Bitte erweitere das bestehende QA-Gate `tools/svg-rebuild-qa.js` minimal-invasiv um eine zusätzliche deterministische Layout-QA-Schicht.

Wichtig:

* Das bestehende Gate nicht ersetzen.
* Bestehende Checks beibehalten.
* Die neue Layout-Prüfung soll sich in die bestehende CLI integrieren.
* Keine PNGs erzeugen.
* Keine Screenshots erzeugen.
* Keine KI-/Vision-Auswertung einbauen.
* Keine probabilistische Bewertung.
* Die Pass/Fail-Entscheidung soll über technische Regeln erfolgen:

  * SVG/XML
  * SVG-DOM
  * berechnete Bounding-Boxes
  * berechnete Styles
  * DOM-Reihenfolge
  * browserbasierte Hit-Tests
  * Referenzen
  * ViewBox-/Viewport-Grenzen
  * externe Animationszustände aus `scene.animation.v1.json` beziehungsweise dem bestehenden Viewer-/Animation-System

## Gewünschte Architektur

Bitte erweitere die bestehende Struktur ungefähr so:

```text
tools/
├─ svg-rebuild-qa.js
└─ svg-qa/
   ├─ browser-layout-qa.js
   ├─ collect-svg-layout.js
   ├─ layout-rules.js
   ├─ layer-rules.js
   ├─ arrow-rules.js
   ├─ axis-rules.js
   ├─ animation-layout-rules.js
   └─ layout-report.js
```

Falls die bestehende Projektstruktur eine andere Aufteilung nahelegt, wähle die passendere Struktur. Wichtig ist aber:

* `svg-rebuild-qa.js` bleibt der zentrale Entry Point.
* Die neue Logik wird modular ausgelagert.
* Die bestehenden Checks bleiben unverändert oder werden nur sauber angebunden.
* Die neue Layout-Prüfung kann später erweitert werden.

## CLI-Integration

Bitte ergänze die bestehende CLI um Layout-Optionen, z. B.:

```bash
node tools\svg-rebuild-qa.js <module_id> --viewer --slides <range> --expect-all --layout
```

Optional zusätzlich:

```bash
--layout-strict
--layout-warn-only
--layout-times 0,0.5,1,end
```

Gewünschtes Verhalten:

* Ohne `--layout` soll das bisherige Verhalten möglichst erhalten bleiben.
* Mit `--layout` werden zusätzlich die neuen Layout-Regeln ausgeführt.
* Mit `--expect-all` darf `--layout` gerne automatisch aktiviert werden, wenn das sinnvoll zur bestehenden Logik passt.
* Mit `--layout-warn-only` sollen Layout-Verstöße zunächst nur als Warnungen ausgegeben werden.
* Mit `--layout-strict` sollen Layout-Verstöße als Errors zählen.
* Bei fehlerhaften SVGs darf der Prüflauf nicht unkontrolliert abbrechen. Fehler sollen gesammelt und sauber im Report ausgegeben werden.

## Technische Umsetzung der Layout-Prüfung

Bitte verwende einen echten Headless-Browser-Kontext, z. B. Playwright oder eine bereits im Projekt vorhandene Browser-/Viewer-Infrastruktur.

Die SVG soll im Browser gerendert werden, aber es sollen keine Screenshots erzeugt werden.

Im Browser sollen echte gerenderte Werte gesammelt werden:

* `getBBox()`
* `getBoundingClientRect()`
* `getComputedStyle()`
* SVG-Transformationsmatrizen
* ViewBox-/Viewport-Mapping
* DOM-Reihenfolge
* `document.elementsFromPoint(x, y)` für Hit-Tests
* sichtbare Bounding-Boxes
* reale Positionen nach Transformationen

Für jedes relevante Element sollen nach Möglichkeit gesammelt werden:

```json
{
  "id": "title_text_01",
  "tag": "text",
  "role": "text",
  "group": "textbox_01",
  "bbox": {
    "left": 120,
    "top": 80,
    "right": 640,
    "bottom": 130,
    "width": 520,
    "height": 50
  },
  "computedStyle": {
    "display": "block",
    "visibility": "visible",
    "opacity": 1,
    "fill": "rgb(...)",
    "stroke": "none",
    "fontFamily": "..."
  }
}
```

## Neue `data-qc-*`-Metadaten

Bitte prüfe zuerst, ob der bestehende SVG-Generator bereits geeignete IDs oder Metadaten erzeugt.

Falls nicht, erweitere die SVG-Erzeugung minimal-invasiv so, dass relevante Elemente eindeutige IDs und `data-qc-*`-Attribute erhalten.

Bitte nicht versuchen, alles nur über Heuristik zu raten. Die SVGs sollen die relevanten Beziehungen möglichst explizit mitgeben.

Beispiele für Rollen:

```xml
data-qc-role="text"
data-qc-role="background-box"
data-qc-role="textbox"
data-qc-role="axis-line"
data-qc-role="axis-arrow"
data-qc-role="axis-arrow-head"
data-qc-role="arrow"
data-qc-role="arrow-shaft"
data-qc-role="arrow-head"
data-qc-role="cross-marker"
data-qc-role="data-point"
data-qc-role="grid-line"
data-qc-role="tick"
data-qc-role="axis-label"
data-qc-role="plot-label"
data-qc-role="legend"
data-qc-role="legend-background"
data-qc-role="legend-text"
data-qc-role="formula"
data-qc-role="timeline-marker"
data-qc-role="timeline-label"
data-qc-role="callout"
data-qc-role="callout-box"
data-qc-role="callout-text"
```

Beispiele für Beziehungen:

```xml
data-qc-group="textbox_01"
data-qc-box="box_01"
data-qc-padding="12"
data-qc-layer="foreground"
data-qc-important="true"
data-qc-above="axis_x"
data-qc-below="title_text_01"
data-qc-allow-overlap="false"
data-qc-expected-top="true"
data-qc-plot="plot_01"
data-qc-axis="x"
```

Ziel:

Der Qualitätscheck soll möglichst deterministisch prüfen können, welche Elemente zusammengehören und welche visuelle Reihenfolge erwartet wird.

## Zu implementierende Layout-Regeln

Bitte implementiere mindestens folgende neue Regeln.

### 1. `text_inside_box`

Prüfen, ob Text vollständig innerhalb seiner zugehörigen Hintergrundbox liegt.

Logik:

```text
text.left   >= box.left + padding - tolerance
text.right  <= box.right - padding + tolerance
text.top    >= box.top + padding - tolerance
text.bottom <= box.bottom - padding + tolerance
```

Fehlerfälle:

* Text läuft rechts aus der Box.
* Text läuft links aus der Box.
* Text läuft oben oder unten aus der Box.
* Text ist höher als die Box.
* Text hat zu wenig Padding.
* Textbox wurde nicht korrekt an mehrzeiligen Text angepasst.

### 2. `text_above_background`

Prüfen, ob Text wirklich über seiner Hintergrundbox liegt.

Nicht nur DOM-Reihenfolge prüfen, sondern bei Überlappung auch browserbasierte Hit-Tests nutzen:

* relevante Prüfpunkte im Textbereich bestimmen
* `document.elementsFromPoint(x, y)` auswerten
* prüfen, ob der Text beziehungsweise ein zugehöriges Text-Child oberhalb der Box liegt

Fehlerfälle:

* Text liegt hinter der Box.
* Text wird teilweise von der Box verdeckt.
* Text liegt geometrisch korrekt, ist aber visuell nicht oben.

### 3. `slide_bounds`

Prüfen, ob wichtige sichtbare Elemente innerhalb der Slide-Fläche liegen.

Grundlage:

* `viewBox`
* erwartetes Seitenverhältnis
* erwartete Slide-Größe
* gerenderte Bounding-Boxes

Fehlerfälle:

* Text liegt außerhalb der Folie.
* Pfeile, Achsen, Labels, Legenden oder Formeln ragen aus dem sichtbaren Bereich.
* Elemente sind nur teilweise sichtbar.

### 4. `unexpected_overlap`

Prüfen, ob wichtige Elemente unerwartet kollidieren.

Wichtige Elemente:

* Text
* Titel
* Formeln
* Achsenlabels
* Ticklabels
* Legenden
* Callouts
* Datenpunkte
* Timeline-Marker
* Pfeilspitzen

Fehlerfälle:

* Text überdeckt Text.
* Legende überdeckt wichtige Datenpunkte.
* Achsenlabel kollidiert mit Ticklabel.
* Formel kollidiert mit Box oder Diagramm.
* Timeline-Label kollidiert mit anderem Label.
* Pfeil verdeckt Text, sofern nicht explizit erlaubt.

Bitte konfigurierbare Ausnahmen ermöglichen, z. B. über:

```xml
data-qc-allow-overlap="true"
```

oder über eine Regelkonfiguration.

### 5. `z_order_expected`

Prüfen, ob erwartete Ebenenreihenfolgen eingehalten werden.

Beispiele:

```text
text > background_box
callout_text > callout_box
legend_text > legend_background
axis_label > axis_line
data_point > grid_line
data_point > axis_line
cross_marker > axis_line
timeline_marker > timeline_axis
arrow_head > arrow_shaft
```

Technische Umsetzung:

* Bounding-Box-Schnittmengen finden.
* Relevante Prüfpunkte in der Schnittmenge bestimmen.
* `document.elementsFromPoint(x, y)` verwenden.
* tatsächliche Top-Reihenfolge mit erwarteter Reihenfolge vergleichen.
* transformierte Gruppen korrekt berücksichtigen.

### 6. `unexpected_covering`

Prüfen, ob wichtige Elemente durch andere Elemente verdeckt werden.

Fehlerfälle:

* Text wird durch Box, Shape, Diagrammfläche oder Bild verdeckt.
* Datenpunkt wird durch Achse oder Fläche verdeckt.
* Pfeilspitze wird durch Linie oder Shape verdeckt.
* Formel wird durch Hintergrundelemente verdeckt.
* Timeline-Marker wird durch Achsenlinie verdeckt.

Report soll enthalten:

* verdecktes Element
* verdeckendes Element
* erwartete Reihenfolge
* tatsächliche Reihenfolge
* geprüfter Punkt oder Bereich
* konkrete Empfehlung

### 7. `visibility_and_opacity`

Prüfen, ob wichtige Elemente tatsächlich sichtbar sind.

Fehlerfälle:

* `display: none`
* `visibility: hidden`
* `opacity: 0`
* Opacity unter konfigurierbarem Mindestwert
* `stroke-width: 0` bei Linien
* fehlender Stroke bei Linien
* fehlender Fill bei Flächen, die sichtbar sein müssten
* Farbe entspricht dem Hintergrund oder ist nahezu identisch
* Element wird durch `clip-path` oder `mask` vollständig abgeschnitten

### 8. `arrow_integrity`

Prüfen, ob Pfeile und Pfeilspitzen sauber aufgebaut sind.

Unterstütze nach Möglichkeit beide Varianten:

#### Variante A: Pfeil mit SVG-Marker

```xml
<line id="arrow_01" data-qc-role="arrow" marker-end="url(#arrow_head_01)" />
<marker id="arrow_head_01" data-qc-role="arrow-head-def">...</marker>
```

Prüfen:

* `marker-start`, `marker-mid`, `marker-end` referenzieren existierende IDs.
* Marker-Definition ist nicht leer.
* Marker hat sinnvolle Geometrie.
* Marker ist sichtbar.
* Marker ist passend ausgerichtet.
* `orient` ist sinnvoll gesetzt, z. B. `auto` oder ein erwarteter Wert.
* `refX`, `refY`, `markerWidth`, `markerHeight`, `viewBox` sind plausibel.

#### Variante B: Pfeil als Gruppe

```xml
<g id="arrow_01" data-qc-role="arrow">
  <line id="arrow_01_shaft" data-qc-role="arrow-shaft" />
  <path id="arrow_01_head" data-qc-role="arrow-head" />
</g>
```

Prüfen:

* Gruppe enthält Shaft und Head.
* Pfeilspitze liegt am Ende der Linie.
* Pfeilspitze liegt über der Linie.
* Pfeilspitze ist sichtbar.
* Linie ragt nicht über die Pfeilspitze hinaus.
* Farben, Stroke und Opacity sind plausibel konsistent.

### 9. `axis_layering`

Prüfen, ob Achsen, Rasterlinien, Ticks, Marker und Labels korrekt geschichtet sind.

Erwartung:

```text
grid_line < axis_line < tick < data_point/cross_marker < label
```

Fehlerfälle:

* Gridline liegt über Datenpunkt.
* Achsenlinie liegt über Kreuzmarker.
* Achsenlinie verdeckt Marker.
* Ticklabel wird von Achse oder Datenpunkt verdeckt.
* Achsenlabel liegt außerhalb oder wird verdeckt.
* Achsenpfeilspitze sitzt nicht korrekt am Achsenende.

### 10. `group_integrity`

Prüfen, ob logisch zusammengehörige Gruppen vollständig sind.

Beispiele:

* Textbox = Hintergrundbox + Text
* Callout = Box + Text + optional Pfeil
* Pfeil = Linie + Pfeilspitze
* Achse = Linie + Pfeilspitze + Ticks + Labels
* Kreuzmarker = zwei Linien
* Legende = Symbol + Text
* Timeline-Event = Marker + Label
* Formelblock = Formel-SVG + optional Label/Box

Fehlerfälle:

* Teil fehlt.
* Teil ist unsichtbar.
* Teil liegt auf falscher Ebene.
* Teil ist außerhalb der Gruppe.
* Gruppe ist durch Animation zeitweise unvollständig sichtbar.

### 11. `font_loaded`

Prüfen, ob die erwartete Schriftart geladen und tatsächlich verwendet wird.

Wichtig, weil falsche Font-Fallbacks Textbreiten verändern und dadurch Textboxen sprengen können.

Bitte prüfen:

* erwartete Fonts aus CSS/SVG
* tatsächlich berechnete Font-Familie
* optional Browser Font Loading API, falls sinnvoll verfügbar

### 12. `animation_layout_states`

Da Inline-`<animate>` im Projekt verboten ist und Animationen über `scene.animation.v1.json` laufen, soll die Layout-Prüfung nach Möglichkeit die bestehende Viewer-/Animation-Logik verwenden.

Fuer finale `storyboardImportPackage/v1`-Lieferungen muss dieselbe Layout-Pruefung zusaetzlich das zum SVG namensgleiche `<svg-name>.animation.v1.json` aufloesen. Die interne Reviewer-Datei `scene.animation.v1.json` hat in Arbeitsordnern Vorrang; fehlt sie, wird das externe Basename-Manifest verwendet.

Bitte prüfen:

* Initialzustand
* definierte Zwischenzustände
* Endzustand
* alle relevanten Animation-Steps aus `scene.animation.v1.json`

Wichtig:

* Animation-Targets werden aktuell bereits auf Existenz geprüft.
* Neu soll zusätzlich geprüft werden, ob die Zielzustände geometrisch/layoutseitig gültig bleiben.
* Wenn der bestehende Viewer deterministisch Animationen abspielen oder Zustände setzen kann, bitte genau diesen Codepfad wiederverwenden.
* Keine zweite, abweichende Animationslogik bauen, wenn die bestehende Viewer-Logik genutzt werden kann.

## Report-Erweiterung

Bitte erweitere den bestehenden QA-Output um Layout-Fehler.

Jeder Layout-Fehler soll möglichst enthalten:

```json
{
  "rule": "text_inside_box",
  "severity": "error",
  "slide": "03",
  "file": "slide_003.svg",
  "time_seconds": 0.5,
  "element_id": "body_text_01",
  "related_element_id": "body_box_01",
  "message": "Text läuft rechts aus der Hintergrundbox.",
  "expected": {
    "text_right_max": 760
  },
  "actual": {
    "text_right": 812
  },
  "bbox": {
    "text": {
      "left": 120,
      "top": 220,
      "right": 812,
      "bottom": 302
    },
    "box": {
      "left": 100,
      "top": 200,
      "right": 780,
      "bottom": 330
    }
  },
  "recommendation": "Textbox verbreitern, Text umbrechen oder Schriftgröße reduzieren."
}
```

Bei Layering-Fehlern:

```json
{
  "rule": "z_order_expected",
  "severity": "error",
  "slide": "04",
  "file": "slide_004.svg",
  "element_id": "cross_marker_03",
  "related_element_id": "x_axis_line",
  "message": "Kreuzmarker liegt hinter der Achsenlinie.",
  "expected": "cross_marker_03 above x_axis_line",
  "actual": "x_axis_line above cross_marker_03",
  "recommendation": "Marker nach der Achse rendern oder data-qc-layer/DOM-Reihenfolge korrigieren."
}
```

Bei Pfeil-Fehlern:

```json
{
  "rule": "arrow_integrity",
  "severity": "error",
  "slide": "05",
  "file": "slide_005.svg",
  "element_id": "arrow_02",
  "message": "Pfeilspitze fehlt oder marker-end verweist auf eine nicht vorhandene Marker-ID.",
  "expected": "marker-end references existing marker definition",
  "actual": "marker-end=url(#arrow_head_missing)",
  "recommendation": "Marker-Definition ergänzen oder marker-end-ID korrigieren."
}
```

## Optionale annotierte SVG-Kopie

Bitte keine PNGs und keine Screenshots erzeugen.

Falls eine visuelle Hilfe für den HTML-Report sinnvoll ist, darf optional eine annotierte SVG-Kopie erzeugt werden, z. B.:

```text
qc_reports/annotated/slide_003.qa.svg
```

Diese SVG-Kopie kann z. B. enthalten:

* rote Rechtecke um fehlerhafte Bounding-Boxes
* kurze Fehlerlabels
* Markierungen für verdeckte Elemente

Aber:

* keine PNG-Erzeugung
* keine Screenshot-Erzeugung
* keine KI-Bildanalyse

## Empfohlene Konfiguration

Bitte ergänze oder erstelle eine Konfiguration, z. B.:

```yaml
layoutQa:
  enabled: true
  strict: false

  tolerances:
    geometryPx: 1.0
    paddingPx: 8.0
    overlapPx: 1.0
    opacityMin: 0.05

  slide:
    expectedAspectRatio: 1.7777777778
    aspectRatioTolerance: 0.02

  checks:
    textInsideBox: true
    textAboveBackground: true
    slideBounds: true
    unexpectedOverlap: true
    zOrderExpected: true
    unexpectedCovering: true
    visibilityAndOpacity: true
    arrowIntegrity: true
    axisLayering: true
    groupIntegrity: true
    fontLoaded: true
    animationLayoutStates: true

  animation:
    timesSeconds: [0, 0.5, 1.0]
    includeEndState: true

  layers:
    background: 0
    grid: 10
    axis: 20
    data: 40
    marker: 50
    arrow: 60
    box: 70
    text: 100
    label: 110
    critical: 200
```

Falls das Projekt bisher keine YAML-Konfiguration nutzt, bitte eine passende JS-/JSON-Konfiguration verwenden.

## Wichtig: Einführung in zwei Stufen

Bitte setze die neue Layout-QA so um, dass sie in zwei Stufen eingeführt werden kann:

### Stufe 1: Warn-Modus

* Layout-Checks laufen mit.
* Fehlende `data-qc-*`-Attribute erzeugen Warnungen.
* Layout-Probleme werden gesammelt.
* Der Build bricht noch nicht hart ab.

### Stufe 2: Strict-Modus

* Layout-Fehler zählen als Errors.
* Fehlende notwendige `data-qc-*`-Beziehungen bei Textboxen, Pfeilen, Achsen und Diagrammelementen zählen als Fehler.
* Der QA-Exit-Code wird entsprechend gesetzt.

## Anforderungen an die Umsetzung

* Bestehenden Code zuerst analysieren.
* Minimal-invasiv arbeiten.
* Bestehende Checks in `svg-rebuild-qa.js` nicht verschlechtern.
* Keine komplette Neuarchitektur.
* Neue Layout-Prüfung modular ergänzen.
* Bestehende CLI beibehalten.
* Bestehende Ausgabeformate möglichst beibehalten und nur erweitern.
* Fehler pro SVG sammeln.
* Einzelne fehlerhafte SVGs dürfen den gesamten Lauf nicht unkontrolliert abbrechen.
* Sinnvolle Fehlermeldungen schreiben.
* Konkrete Empfehlungen im Report ausgeben.
* Keine Screenshots.
* Keine PNGs.
* Keine KI-/Vision-Bewertung.
* Möglichst deterministische Regeln.
* Annahmen klar dokumentieren.

## Akzeptanzkriterien

Die Erweiterung gilt als erfolgreich, wenn:

* Der bisherige Befehl weiterhin funktioniert.
* Die neue Layout-QA optional über CLI aktivierbar ist.
* SVGs weiterhin auf XML, IDs, Referenzen, Manifest und Animation-Targets geprüft werden.
* Zusätzlich werden Text-in-Box-Probleme erkannt.
* Text, der hinter oder unter seiner Hintergrundbox liegt, wird erkannt.
* Unerwartete Elementüberlappungen werden erkannt.
* Wichtige verdeckte Elemente werden erkannt.
* Achsen-, Marker- und Plot-Layering wird geprüft.
* Pfeilspitzen und Marker-Referenzen werden genauer geprüft.
* Animation-Zustände werden nach Möglichkeit layoutseitig geprüft.
* Fehler enthalten Element-ID, Regelname, erwartete/tatsächliche Werte und Empfehlung.
* Es werden keine Screenshots oder PNGs erzeugt.
* Es wird keine KI-/Vision-Auswertung eingebaut.
* Der Check kann später als hartes Quality Gate verwendet werden.

## Laufende Hervorhebungen prüfen

Bei `highlight` muss die Zustandsberechnung die tatsächliche Viewer-Laufzeit
abbilden: Ein bereits sichtbares Ziel bleibt während des Fokus vollständig
deckend. Kurzer Schatten-/Skalierungsimpuls und Rückkehr zum Ausgangsstil werden
wie im Player berechnet; Highlight ist kein erneutes Einblenden. Zur Prüfung
von Wertezuordnungen zusätzlich die Mitte des Impulses abfragen. Die separate
visuelle Zustandsvorschau unterstützt dafür `--sample-highlights true`; der
automatische Layout-Check selbst erzeugt weiterhin keine Bilddateien.
