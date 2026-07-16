# Basis Seminar Slide Rebuild Runbook

Dieses Runbook beschreibt den Standardablauf fuer die Analyse bestehender Basis-Seminar-Folien.

## Ziel

Aus vorhandenen PowerPoint-, PDF-, PNG- und Sprechertextquellen entsteht eine Rebuild-Spezifikation pro Folie.

Die Spezifikation soll spaeter eine einheitliche Neuerzeugung im neuen Corporate Design ermoeglichen. Sie ersetzt keine fachliche Freigabe und erzeugt noch keine finalen SVGs.

Die Analyse bewertet nicht, welche Inhalte gekuerzt werden koennen. Standard ist inhaltliche Gleichwertigkeit: Fachlich relevante Inhalte der Quellfolien werden vollstaendig fuer den Rebuild erfasst, damit sie spaeter anders gestaltet, aber nicht ausgeduennt werden.

## Nicht-Ziele

- keine freie Neugestaltung
- keine inhaltliche Erweiterung
- keine Sprechertext-Umschreibung
- keine direkte Grafikproduktion
- keine stillschweigende Korrektur widerspruechlicher Quellen

## Eingangsdaten

Pflichtquellen pro Modul:

- PowerPoint-Datei `.pptx`
- PDF-Export `.pdf`
- PNG-Export pro Folie `.png`
- freigegebene Sprechertexte als `.md`

Stark empfohlen:

- Corporate-Design-Regeln
- Logo, Icons und wiederverwendbare Assets
- Farb- und Typografie-Tokens
- erlaubte Fonts oder Fontnamen

## Standardpfade

```text
source-materials/basis-seminar/
  pptx/
  pdf/
  png/
  narration/
  extracted-assets/

analysis/
  inventories/
  slides/
  modules/
  reports/
```

## Ablauf Pro Modul

1. Quelleninventar erstellen.
2. Folienanzahl in PPTX, PDF und PNG-Export vergleichen.
3. Pruefen, ob einzelne PPTX-Folien echte Inhaltsfolien sind oder nur Animationsschritte einer Foliengruppe.
4. Slide-IDs und bei Bedarf Animation-/Morph-Gruppen vergeben.
5. Sprechertext-Referenzen zuordnen.
6. PPTX technisch auslesen: Textboxen, Shapes, Gruppen, Tabellen, Bilder, Ebenen und Animationen.
7. PDF gegenpruefen: Text, Formeln, Seitenreihenfolge und gerenderter Endzustand.
8. PNG visuell analysieren: Komposition, Gewichtung, Ueberlagerungen und sichtbare Details.
9. Visuelle Elemente klassifizieren: Diagramm/Formel/Text/Prozess versus Piktogramm/Bildmotiv/realistisches Objekt.
10. Komplexe Bilder und Piktogramme als wiederverwendbar, neu zu erzeugen, zu extrahieren oder vom Nutzer anzufordern bewerten.
11. Semantische Folienbeschreibung formulieren.
12. Rebuild-Entscheidungen fuer Text, SVG und optionale PNG-Assets dokumentieren; dabei festhalten, wie die Informationsdichte der PowerPoint-Folie erhalten bleibt.
13. Animationsplan aus PPTX, PPTX-Folienfolgen oder Sprechertext ableiten und Unsicherheit markieren.
14. QA pro Folie abschliessen.
15. Modulreport schreiben.

Wenn der Nutzer aus der Analyse heraus SVG-Vorschlaege beauftragt, beginnt danach nicht direkt die SVG-Produktion. Zuerst wird ein schriftlicher, modulweiter Analyse- und SVG-Bauplan als Markdown-Datei erstellt:

```text
analysis/rebuild-plans/<module_id>_sequence_plan.md
```

Dieser Plan ist mehr als eine Folienliste. Er haelt die Analyseergebnisse der alten Folien fest und plant bereits, welche Content-SVGs spaeter wie aufgebaut werden sollen: Sequenzgruppen, Zielzustaende, Layoutidee, Darstellungsweise, zu erzeugende oder wiederzuverwendende visuelle Elemente, Python-Plots, Formelassets, Bild-/Piktogrammassets, Layerstruktur und Animationen. In dieser Analysephase wird noch kein SVG umgesetzt. Erst wenn dieser MD-Plan vollstaendig ist, gilt `workflow/40-svg-production/svg-rebuild-production-runbook.md`.

## Ablauf Pro Folie

### 1. Inventar

Erfasse:

- Seminar
- Modul
- Quelldatei
- Foliennummer
- PNG-Datei
- PDF-Seite
- Sprechertext-Referenz
- Status

Wenn die Sprechertext-Zuordnung nicht eindeutig ist, setze `narration.confidence` auf `low` und dokumentiere die Frage in `qa.open_questions`.

### Animationsfolien Und Morph-Sequenzen

Manche sichtbaren Animationen sind keine PowerPoint-Animation innerhalb einer Folie, sondern entstehen durch mehrere aufeinanderfolgende PPTX-Folien. Beispiele:

- Morph-Uebergang zwischen zwei fast gleichen Folien
- pro Folie wird eine weitere Linie, Box oder Markierung sichtbar
- eine statische Endfolie ist eigentlich der letzte Schritt einer Aufbaufolge

Solche Sequenzen werden nicht als voneinander unabhaengige Inhaltsfolien behandelt. Wenn mehrere Folien durch Einblenden, Ausblenden, Verschieben, Hervorheben oder Zeichnen zu einer gemeinsamen Erklaergrafik werden koennen, werden sie zusammengezogen und als eine Arbeitseinheit mit Layern geplant. Im Inventar werden sie als Gruppe markiert:

```json
{
  "source_slide_numbers": [12, 13, 14],
  "sequence_role": "morph_sequence",
  "animation_group_id": "RE1_012_build"
}
```

In der Rebuild-JSON wird der Zusammenhang unter `source_slide_group` und `animation_plan` dokumentiert. Wenn unklar ist, ob eine Folie eigenstaendig ist oder nur ein Animationsschritt, wird das in `qa.open_questions` markiert.

Vor einem SVG-Rebuild wird fuer jede Sequenz zusaetzlich bestimmt:

- welche Folie den vollstaendigen Zielzustand zeigt,
- welche frueheren Folien nur Einblend-, Ausblend-, Zeichen- oder Morphschritte sind,
- welche Zwischenzustaende wirklich als Preview gebraucht werden,
- welche Zwischenzustaende auf den finalen SVG-Zustand zeigen oder als `skip_preview` dokumentiert werden duerfen.
- welche spaeteren SVG-Dateien oder Master-SVG-Zustaende daraus entstehen sollen,
- welche Elemente als eigene Animationsebene geplant werden,
- welche Assets, Formeln, Python-Plots oder Bilddateien vor der SVG-Komposition erzeugt oder beschafft werden muessen.
- welche Quellinhalte in der zusammengezogenen Grafik sichtbar erhalten bleiben muessen, damit der Sprechertext weiterhin passt.

Die letzte vollstaendige Folie einer Aufbaufolge ist der primaere Inhaltsanker. Fruehere Folien sind Animationshinweise, nicht automatisch separate Designauftraege.

### 2. PPTX-Analyse

Extrahiere alle strukturierten Objekte, soweit technisch verfuegbar:

- Titel und Textboxen
- Formen, Linien, Pfeile und Gruppen
- Tabellen, Diagramme und Formeln
- Bilder und eingebettete Medien
- Ebenenreihenfolge
- Positionen und Groessen
- Animationen

PPTX-Objekte gelten nicht automatisch als sichtbar. Sichtbarkeit wird gegen PNG und PDF geprueft.

### 3. PDF-Kontrolle

Nutze das PDF fuer:

- final gerenderten Text
- Seitenreihenfolge
- Formelkontrolle
- Tabellen- und Diagramm-Beschriftungen
- Abweichungen zwischen PPTX und Endzustand

### 4. PNG-Kontrolle

Das PNG ist die visuelle Wahrheit fuer:

- Gesamtkomposition
- dominante Elemente
- Ueberlagerungen
- Ausschnitte und Crops
- visuelle Bedeutung von Farben, Pfeilen und Markierungen
- Elemente, die technisch schwer extrahierbar sind

Die PNG-Analyse muss in `layout_rebuild.composition`, `visual_elements`, `visible_text` und `extraction_evidence.png` sichtbar werden.

### 5. Elementklassifizierung, Bildassets Und Wiederverwendung

Viele Folien enthalten komplexe Bilder, Piktogramme oder Darstellungen, die nicht sinnvoll als einfache SVG-Grafik nachgebaut werden muessen.

Zuerst wird jedes relevante visuelle Element klassifiziert:

- `diagram_logic`: Achsen, Kurven, Datenpunkte, Tabellen, Formeln, Berechnungslogik.
- `process_shape`: Pfeile, einfache Marker, Hervorhebungen, Ablaufboxen.
- `simple_symbol`: Haken, Kreuz, Plus, Minus, Kreis, Warnmarkierung.
- `pictogram`: Werkzeug-, Methoden-, Objekt-, Maschinen- oder Personenicon.
- `realistic_image`: Foto, Screenshot, Material- oder Bauteildarstellung.
- `decorative_or_legacy`: alte PowerPoint-Dekoration ohne fachliche Funktion.

Grundregel:

- `diagram_logic`, `process_shape` und `simple_symbol` koennen SVG-nativ geplant werden.
- `pictogram` und `realistic_image` werden als PNG-Asset geplant: extrahieren, neu generieren oder vom Nutzer anfordern.
- `decorative_or_legacy` darf weggelassen werden, wenn Quelle und Sprechertext dadurch fachlich erhalten bleiben.

Codex bewertet fuer jedes Bildmotiv oder Piktogramm:

- Ist es fachlich korrekt und didaktisch wertvoll?
- Ist es ausreichend scharf und rechtefrei nutzbar?
- Ist es besser als Crop/Screenshot aus der Folie wiederzuverwenden?
- Sollte der Nutzer das Originalbild separat bereitstellen?
- Muss die dahinterliegende fachliche Logik stattdessen als SVG-Diagramm oder Tabelle rekonstruiert werden?
- Waere ein neu generiertes Bild fachlich sicherer oder gestalterisch passender?

Ein Piktogramm wird nicht als handgebautes Linien-/Pfad-SVG geplant. Wenn es als konkretes Objekt erkennbar sein soll, wird es als PNG-Asset behandelt.

Wenn ein Bild uebernommen werden soll, wird in `visual_elements[*].png_asset` oder `generated_assets[]` dokumentiert:

- Zielpfad unter `source-materials/basis-seminar/extracted-assets/<module_id>/`
- ob ein Screenshot/Crop aus PNG oder PDF ausreicht
- ob der Nutzer das Originalbild nachreichen soll
- wofuer das Bild spaeter genutzt wird

Wenn Codex ein Bild nicht selbst sauber extrahieren kann, wird eine konkrete Rueckfrage in `qa.open_questions` formuliert, z. B.:

```text
Bitte Originalbild der Schnittdarstellung aus RE1 Folie 12 unter source-materials/basis-seminar/extracted-assets/RE1/slide_012_cutaway.png ablegen.
```

### 6. Semantik

Beschreibe nicht nur, was auf der Folie liegt, sondern warum es dort liegt.

Gut:

```text
Drei Prozesskarten zeigen die Schritte Planung, Test und Auswertung. Ein Pfeil verbindet die Karten von links nach rechts. Die untere Hervorhebung fasst die Kernaussage zusammen.
```

Nicht ausreichend:

```text
Drei Boxen und ein Pfeil.
```

### 7. Sprechertext

Der Sprechertext bleibt unveraendert.

Pflicht:

- Datei referenzieren
- Abschnitt, Szene oder Textanker angeben
- keine Textkorrekturen vornehmen
- keine neuen Pausenmarker ergaenzen
- keine Inhalte aus dem Folienlayout in den Sprechertext uebernehmen

### 8. Rebuild-Spezifikation

Fuer jedes relevante Element wird festgelegt:

- fachliche Funktion
- sichtbarer Inhalt
- Position
- Beziehungen zu anderen Elementen
- SVG/Text/PNG-Strategie
- Corporate-Design-Rolle
- was erhalten bleiben muss
- was modernisiert werden darf
- wie die Informationsdichte gegenueber der PowerPoint-Folie erhalten bleibt

Standard:

- Text als echter Text
- Echte Plots und technische Diagramme als Python-Plot-SVG aus `components/python-plot-library/`
- Tabellen, Prozesspfeile, einfache Marker und Formeln als SVG/Text beziehungsweise Formel-SVG
- Einfache Ausfall-Timelines und Objekt-Zeitachsen mit `X`-/Zensurmarkern als SVG-native Timelines
- PNG fuer Piktogramme, realistische Objekte, Materialkontext, source-spezifische Icons oder illustrative Motive
- Nutzer-Asset-Anfrage, wenn ein wichtiges Bildmotiv nicht sauber extrahiert oder generiert werden kann

Fuer spaetere SVG-Vorschlaege wird zusaetzlich festgelegt:

- welche alte Layoutentscheidung nur PowerPoint-Historie ist und nicht uebernommen wird,
- welches didaktische Zielbild im neuen Design gebaut werden soll,
- welche Library-Komponenten nur als Ausgangspunkt dienen,
- welche Anpassungen an Abstaenden, Datenpositionen, Achsen, Labels und Animationen zwingend sind.
- welche Asset-Entscheidungen im spaeteren SVG-Brief erneut geprueft werden muessen.

### 9. Animation

Wenn Animationen aus der PPTX auslesbar sind, dokumentiere sie mit `source: "pptx"`.

Wenn die Animation durch mehrere PPTX-Folien entsteht, dokumentiere sie mit `source: "pptx_sequence"` oder bei Morph-Uebergaengen mit `source: "morph_sequence"`.

Wenn Animationen nur aus Sprechertext und visueller Logik abgeleitet werden, nutze:

```json
{
  "source": "inferred_from_narration",
  "confidence": "medium"
}
```

Keine Animation darf die fachliche Reihenfolge veraendern.

### 10. QA

Eine Folie ist erst analysiert, wenn beantwortet ist:

- Sind alle sichtbaren Textanker erfasst?
- Sind alle fachlich relevanten visuellen Elemente beschrieben?
- Sind Position und Funktion der Hauptelemente klar?
- Ist der Sprechertext korrekt verknuepft?
- Sind Annahmen und Unsicherheiten markiert?
- Ist klar, was als SVG/Text und was als PNG gebaut werden soll?
- Ist kein konkretes Piktogramm faelschlich als SVG-nativer Nachbau geplant?
- Wurden PPTX, PDF und PNG gegeneinander geprueft?
- Sind Abweichungen dokumentiert?

## Ausgabe

Einzelfolien:

```text
analysis/slides/slide_001_rebuild.json
```

Modulsammlung:

```text
analysis/modules/re1_module_01_rebuild.json
```

Report:

```text
analysis/reports/re1_module_01_report.md
```

Der JSON-Vertrag steht in `workflow/slide-rebuild-json-contract.md`; das Starttemplate liegt in `templates/slide-rebuild-template.json`.

Fuer das erste Modul-Inventar kann `templates/slide-inventory-template.json` verwendet werden.
