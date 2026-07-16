# SVG Animation Editor Handoff

Status: standalone porting specification for another repository

Snapshot: 2026-07-10

This file is intended to be copied on its own into a target repository. The target
agent should be able to reproduce the current SVG structure and animation editing
workflow without needing access to this source repository.

## Zielrepository-Audit: `Basis_RE_Seminar`

Stand dieses Audits: 2026-07-10

Dieser Abschnitt dokumentiert die lokale Einordnung des Portierungsvertrags. Er
ändert die fachlichen Regeln weiter unten nicht, macht aber sichtbar, was im
Zielrepository tatsächlich vorhanden ist, welche Annahmen für die Integration
gelten und welche Teile ohne weitere Quellen noch nicht produktionsverbindlich
umsetzbar sind.

### Festgelegte Zieloberfläche

- Ziel-App ist `tools/basis-rebuild-viewer/`. Sie ist laut Root-README der
  aktuelle Viewer für den Basis-Seminar-Rebuild.
- `tools/svg-browser/` ist eine vorhandene Implementierungsquelle. Dort gibt es
  bereits Inventar-, Struktur-, Trigger-, Matching-, Timeline- und
  Speicherlogik. Diese Logik soll schrittweise extrahiert beziehungsweise
  portiert werden; es soll kein dritter unabhängiger Editor entstehen.
- Der Animationseditor öffnet als eigener Vollbild-Arbeitsmodus derselben
  Web-App. Die schmale Review-Spalte bleibt deshalb frei von einer zweiten
  konkurrierenden Bearbeitungsoberfläche.
- Bearbeitet wird nur der aktuelle SVG-Vorschlag. Archivierte Versionen und
  Folien mit Reviewstatus `final` bleiben schreibgeschützt.

### Lokale Annahmen Für Die Portierung

1. Das lokale Review-Artefakt bleibt vorerst repo-konform
   `scene.animation.v1.json` neben dem SVG. Die im Portierungsvertrag
   beschriebene Ableitung `<svg-name>.animation.v1.json` wird erst bei echter
   Mehrfach-SVG-Unterstützung neu entschieden.
2. Der freigegebene Sprechertext bleibt gemäß `AGENT.md` unverändert. Er darf
   später im Animationstab angezeigt und zur Triggerauswahl markiert werden,
   wird in diesem Repo aber nicht `contenteditable` gespeichert.
3. Bestehende Manifest-Zusatzfelder werden beim ersten Einbau verlustfrei
   erhalten. Es findet keine stille Massenmigration beim Öffnen statt.
4. Der Legacy-Targetstatus `static_context` wird semantisch als
   `notAnimated`/`Immer sichtbar` gelesen. Erst wenn genau dieses Manifest
   fachlich bearbeitet und gespeichert wird, schreibt der Editor den
   kanonischen Wert; eine ungefragte Massenmigration findet nicht statt.
5. Mock-Timing bleibt reine Vorschau. 30 FPS ist nur Editorreferenz; es werden
   keine Mock-Sekunden, Wortindizes oder Frames in finale Authoring-Daten
   geraten.
6. Promotion, TTS-Auflösung und finales Frame-Rendering gehören zum externen
   System `elearning-video`. Dieses Repo implementiert dafür zunächst nur eine
   klar dokumentierte Integrationsgrenze.
7. Das vorhandene paketlose Node-/Vanilla-JavaScript-System bleibt für den
   ersten Portierungsschnitt bestehen. Domain-Tests verwenden das in Node 24
   enthaltene `node:test`; neue Laufzeitabhängigkeiten sind dafür nicht nötig.

### Bereits Vorhandene Portierungsquelle

Folgende Teile existieren vereinfacht bereits unter `tools/svg-browser/`:

- SVG-Attributparser, Inventar und Parent-Ermittlung in `server.js`;
- Manifest-Normalisierung, Synchronisierung und Issues in `server.js`;
- Lade- und Speicherendpunkte für `scene.animation.v1.json`;
- Struktur- und Animationstab in `index.html`;
- Unicode-Tokenmatching, `sourceText`, `occurrence` und Textauswahl;
- Mock-Timeline, Browser-Preview und vier Aktionen;
- eine teilweise SVG-Bereinigung.

Diese Implementierung ist noch nicht vollständig handoff-konform: Parent-
Abdeckung, strikte Validierung, atomisches Speichern, `transform`, vollständige
Sanitization und die Downstream-Produktionskette fehlen oder sind nur teilweise
vorhanden.

### Im Handoff Genannte, Aber Nicht Mitgelieferte Referenzdateien

Die folgenden Pfade aus dem Ursprungsrepository sind im Zielrepository nicht
enthalten:

```text
src/lib/storyboard/svg-animation-manifest.ts
scripts/storyboard-reviewer.ts
tools/storyboard-reviewer/app.js
tools/storyboard-reviewer/app.css
scripts/storyboard/promote-lesson.ts
src/lib/storyboard/authoring.ts
scripts/pipeline/02-resolve-storyboard.ts
src/components/svg/applySvgSteps.ts
src/components/svg/useSvgDom.ts
src/scenes/SvgDiagramScene.tsx
```

Damit fehlen die ausführbare Referenz für das strikte Schema, die genaue
Promotion, das finale Authoring, die Wortzeitauflösung und der finale
Frame-Renderer. Der vorliegende Vertrag ist für diese Teile die einzige Quelle.

### Weitere Fehlende Dokumente, Daten Und Fixtures

Im Zielrepository fehlen aktuell:

- `scene.storyboard.v1.json` als gemeinsamer editierbarer Szenendraft;
- reale `lesson.authoring.v1.json`-Dateien;
- `lesson.words.json` oder ein anderes TTS-/Alignment-Fixture;
- Remotion oder ein anderer lokaler Frame-Renderer;
- eine ausführbare Promotion in finale Lesson-Daten;
- ein maschinenlesbares finales Authoring-Schema;
- Screenshots oder ein Interaktionsvideo der Referenzoberfläche;
- Unit-, API- und Browser-Fixtures aus dem Ursprungsrepository;
- ein vorhandenes `package.json`-, Lint-, Build- oder E2E-Testsystem;
- eine verbindliche Mehrfach-SVG-Datenstruktur pro Folie;
- eine definierte Einbindung von Manifeständerungen in die vorhandene
  Review-/Versionshistorie.

### Fehlende Folienscharfe Sprechertext-Zuordnung

Die 13 aktuellen Analyse-JSONs enthalten `narration.text_ref`, aber jeweils
`narration.text: null`. Alle verweisen auf denselben Abschnitt
`Folie 1 / Aufbaufolge` in:

```text
source-materials/basis-seminar/narration/RE3_TEST_1/Modul_3_Test_1.md
```

Noch nicht entschieden ist, ob dieser gesamte Abschnitt:

- für jede Aufbaufolie gilt;
- genau eine gemeinsame Szene beschreibt; oder
- in verbindliche folienscharfe beziehungsweise szenenscharfe Ausschnitte
  aufgeteilt werden muss.

Der Editor darf den Abschnitt als Auswahl- und Diagnosehilfe anzeigen. Eine
positive oder negative `sourceText`-Validierung ist bis zur Zuordnungsentscheidung
aber noch nicht produktionsverbindlich.

### Konflikte Zwischen Portierungsvertrag Und Zielrepository

| Thema | Portierungsvertrag | Aktueller lokaler Stand / Entscheidung |
| --- | --- | --- |
| Manifestname | `<svg>.animation.v1.json` | vorerst `scene.animation.v1.json` |
| Aktionen | fünf Aktionen inklusive `transform` | lokale Downstream-Dokumentation kennt nur vier; `transform` braucht eine gemeinsame Vertragserweiterung |
| Sprechertext | editierbares `spokenTextDraft` und kombiniertes Speichern | freigegebener Sprechertext ist unveränderlich und wird nur gelesen/selektiert |
| Schema | unbekannte Felder blockieren | bekannte Repo-Legacyfelder werden vorerst explizit kompatibel gelesen und erhalten |
| Mehrere SVGs | Asset-Tabs pro Szene | Basis-Viewer modelliert aktuell einen aktiven Vorschlag beziehungsweise Alias pro Folie |
| Produktion | Promotion, Wortzeiten und Renderer sind Teil der Abnahme | diese Systeme liegen im externen `elearning-video`-Repo |
| Mehrfachmatch | explizites `occurrence` ist erforderlich | das beschriebene automatische `occurrence: 1` wird lokal nicht als sichere Annahme übernommen |

### Audit Der Vorhandenen Manifeste

Im gesamten Arbeitsbaum liegen 38 Dateien `scene.animation.v1.json`:

```text
11 aktuelle Manifeste unter rebuild-proposals/svg/
13 Vergleichsmanifeste unter rebuild-proposals/workflow-comparison/
14 archivierte Review-Versionen unter analysis/viewer-notes/versions/
```

Die 11 aktuellen Manifeste enthalten zusammen 175 Steps. Gegen ein ohne
Kompatibilität strikt ausgelegtes Handoff-Schema treten unter anderem auf:

- Rootfelder `sceneId`, `status` und `notes`;
- Defaultfelder `drawFrames` und `pauseMs`;
- Stepfelder `trigger` und einmal `afterInternalPlotDelayMs`;
- einmal der Targetstatus `static_context`.

Zusätzlich gilt für die aktuellen Daten:

- alle 175 Step- und Target-IDs sind in den jeweiligen SVGs vorhanden;
- 35 Steps haben noch keinen `sourceText`;
- 137 weitere `sourceText`-Phrasen matchen den derzeit nur gemeinsam
  vorliegenden Modulsprechertext nicht;
- nur drei Steps sind mit diesem vorläufigen Gesamttext direkt matchbar;
- keines der 23 untersuchten Proposal-SVGs verwendet aktuell
  `data-anim-target`.

Die ID-Seite ist damit eine gute Integrationsbasis. Die Triggertexte benötigen
vor jeder Promotion eine eigene redaktionelle Bereinigung.

### Noch Offene Produkt- Und Technikentscheidungen

- Wird `transform` neuer lokaler Standard und gleichzeitig in Promotion,
  Authoringschema und Zielrenderer ergänzt?
- Wann und wie werden die bekannten Legacyfelder endgültig migriert?
- Welcher Sprechertextausschnitt gehört zu welcher Folie oder Sequenz?
- Wie werden ungespeicherte Änderungen beim Folien- oder Assetwechsel behandelt?
- Soll `render: false` zusätzlich zur Bestätigung später einen Undo-Schritt
  erhalten?
- Soll ein Wechsel auf `notAnimated` vorhandene Steps löschen oder nur warnen?
- Wie werden verschachtelte Parent-/Child-Animationen und gleichzeitig
  startende Steps komponiert?
- Wie werden vorhandene SVG-Transforms mit temporären Show-/Hide-/Transform-
  Werten kombiniert?
- Wie fließen Manifeständerungen in die vorhandene Versionshistorie ein?
- Wann wird von einer Sidecar-Datei pro Ordner auf eine Sidecar-Datei pro SVG
  umgestellt?

### Sicherheitslücken Des Ausgangsstands

Vor der Portierung waren folgende Punkte gegenüber dem Sicherheitsvertrag offen:

- Der Basis-Viewer setzte SVGs ohne vollständige Sanitization inline ein.
- Der SVG-Browser entfernte nicht `foreignObject` und nicht alle gefährlichen
  externen Referenzen.
- Allgemeine `/files/`-Abrufe sind auf das Repo, nicht auf einen konkreten
  Szenenordner begrenzt.
- Manifestdateien wurden direkt statt über temporäre Datei plus Rename
  geschrieben.
- Serverseitiges `sourceText`-Matching und strikte Schemafehler fehlten.

### Bewusst Gewählter Erster Lauffähiger Portierungsschnitt

Der erste Schnitt umfasst:

1. gemeinsame, browser- und serverseitig nutzbare Domainlogik für Inventar,
   Parentabdeckung, Sync, bekannte Legacykompatibilität, strikte Feldprüfung,
   Unicode-Matching, Issues und Mock-Reihenfolge;
2. `node:test`-Regressionen für Inventar, Sync, Vererbung, Legacydaten,
   Wortmatching und Timeline;
3. einen serverseitig auf die ausgewählte Folie begrenzten Ladeendpunkt;
4. einen atomaren Manifest-Speicherendpunkt mit erneutem SVG-Scan,
   serverseitigem Sync und Schema-Prüfung;
5. einen sichtbaren Button `Animation bearbeiten` im Basis-Rebuild-Viewer;
6. einen Vollbild-Struktur-Editor mit sanitizter SVG-Vorschau, ID-Baum,
   Auswahl, Collapsezustand, getrennten Schaltern für `visibleInEditor` und
   `render` sowie den beschriebenen Sammelaktionen;
7. korrektes Entfernen von `render: false` auch aus der normalen
   Basis-Viewer-Vorschau.

Noch nicht Bestandteil dieses ersten Schnitts sind der eigentliche
Animationstab, Sprechertextauswahl, Timeline-Playback, `transform`, Promotion,
TTS-Wortauflösung und der finale Renderer. Diese Teile folgen in getrennten
vertikalen Schnitten, damit reale Manifestdaten nicht durch ungeklärte
Annahmen beschädigt werden.

## Ziel

Dieses Dokument beschreibt, wie in diesem Projekt SVGs im Review-Editor dargestellt, in steuerbare Elemente zerlegt, bearbeitet und mit Triggern aus gesprochenem Text verbunden werden.

Der andere Agent soll daraus einen vergleichbaren Editor bauen koennen:

- SVG anzeigen und Element-IDs sichtbar/auswaehlbar machen.
- SVG-Struktur von eigentlicher Animation trennen.
- Elemente als "animiert", "immer sichtbar" oder "noch offen" markieren.
- Einzelne Trigger ueber Textauswahl im gesprochenen Text setzen.
- Trigger als `sourceText` speichern, nicht als Sekunden oder Frames.
- Vor finalem Render die Trigger gegen den gesprochenen Text validieren.

## Grundprinzip

Finale Animation wird nicht ueber feste Zeiten gepflegt. Ein Trigger verweist auf eine Wortfolge im gesprochenen Text:

```text
sourceText -> Wortposition im spokenText -> Wortzeit aus TTS/words.json -> Frame
```

Im Review-Editor darf es eine Mock-Timeline geben. Diese Timeline dient nur der Vorschau und sortiert die Schritte anhand der Position von `sourceText` im gesprochenen Text. Die echten Zeiten entstehen spaeter aus TTS-Worttimings.

## Dateien Und Datenmodell

Im Review-Arbeitsbereich liegt das SVG neben einer optionalen Manifest-Datei:

```text
scene/
  scene.storyboard.v1.json
  assets/
    diagram.svg
    diagram.animation.v1.json
```

Das Manifest ist der Editor-Zustand:

```json
{
  "schemaVersion": "svgAnimationManifest/v1",
  "svgPath": "assets/diagram.svg",
  "defaults": {
    "enterFrames": 14,
    "exitFrames": 14,
    "highlightDurFrames": 24,
    "drawDurFrames": 36
  },
  "targets": [
    {
      "targetId": "option_failures_only",
      "label": "Nur Ausfaelle",
      "status": "animated",
      "confidence": "medium"
    },
    {
      "targetId": "background_grid",
      "label": "Hilfsraster",
      "status": "notAnimated",
      "render": false,
      "visibleInEditor": false,
      "confidence": "high"
    }
  ],
  "steps": [
    {
      "stepId": "01",
      "targetId": "option_failures_only",
      "action": "show",
      "sourceText": "nur die Ausfaelle",
      "enterFrames": 16,
      "fromY": 18,
      "confidence": "medium"
    }
  ]
}
```

Finale Renderdaten werden spaeter in die Lesson-/Authoring-Struktur geschrieben. Das Manifest bleibt ein Review- und Editor-Artefakt.

## SVG-Voraussetzungen

Der Editor arbeitet ID-basiert:

- Jedes animierbare Element braucht eine stabile `id`.
- IDs sollten semantisch, eindeutig und ASCII-only sein, zum Beispiel `sensor_block` oder `arrow_sensor_to_controller`.
- Komplexe Einheiten sollen als `<g id="...">` gruppiert werden.
- Ein logisches Editor-Element kann im SVG mit `data-anim-target="true"` markiert werden.
- Optional kann ein lesbarer Name ueber `data-anim-label`, `data-label` oder `aria-label` kommen.
- Kinder unter einem oeffentlichen Parent werden normalerweise durch den Parent abgedeckt und nicht als eigene Editor-Elemente gezeigt.
- `draw` funktioniert fuer messbare Geometrie wie `path`, `line`, `polyline`, `polygon`, `circle`, `ellipse`, `rect` oder Gruppen mit solchen Kindern.

Keine Skripte oder interaktives Verhalten im SVG zulassen.

## Inventar Aus Dem SVG Lesen

Beim Laden des SVG wird ein Inventar aller relevanten IDs erzeugt.

Erfasse nur Tags, die als visuelle Targets sinnvoll sind:

```text
g, path, rect, circle, ellipse, line, polyline, polygon, image, text
```

Pro gefundener ID speichert das Inventar:

```json
{
  "targetId": "option_failures_only",
  "tagName": "g",
  "label": "Option Failures Only",
  "parentTargetId": "diagram_root",
  "isExplicitTarget": true
}
```

`parentTargetId` ist wichtig, damit der Editor Baumstruktur und Vererbung kennt.

## Manifest Mit SVG Synchronisieren

Beim Oeffnen des Editors:

1. SVG lesen und Inventar bauen.
2. Manifest laden oder leer erzeugen.
3. Bestehende Entscheidungen erhalten.
4. Neue explizite Targets aus `data-anim-target="true"` als oeffentliche Targets aufnehmen.
5. Targets mit bestehenden Steps sichtbar halten.
6. Kinder ausblenden, wenn ein Parent bereits als sichtbares, verborgenes oder nicht gerendertes Target verwaltet wird.
7. IDs, die im Manifest stehen, aber nicht mehr im SVG existieren, als `orphaned` markieren.

Target-Status:

```text
needsReview  -> Noch offen
animated     -> Animiert
notAnimated  -> Immer sichtbar
ignored      -> Legacy, wie notAnimated anzeigen
orphaned     -> SVG-ID fehlt, Warnung anzeigen
```

Zusaetzliche Target-Felder:

```text
visibleInEditor: false
```

Das Element wird nicht in der normalen Animationsliste gezeigt, bleibt aber gerendert. Das ist fuer Kinder gedacht, die vom Parent geerbt werden.

```text
render: false
```

Das Element wird strukturell ausgeschlossen: nicht in der Animationsliste, nicht in der Preview, nicht im finalen Render. Bestehende Steps fuer dieses Target werden entfernt oder ignoriert.

## UI-Struktur

Der Editor sollte zwei Modi/Tabs haben.

### 1. SVG Struktur

Zweck: entscheiden, welche SVG-IDs steuerbare Elemente sind und welche IDs gar nicht gerendert werden.

Darstellung:

- Grosser SVG-Preview-Bereich.
- Rechts ein SVG-Baum aus dem Inventar.
- Jede Zeile zeigt Label, ID, Tag, Status/Step-Hinweis.
- Ein Toggle bestimmt, ob das Element im Animationseditor sichtbar ist.
- Ein separater Toggle bestimmt, ob das Element gerendert wird.
- Hover/Selection hebt das Element in der SVG-Preview hervor.

Regeln:

- Wenn `render: false`, ist `visibleInEditor` ebenfalls false.
- Wenn ein Target Steps hat, darf es nicht versehentlich aus dem Editor entfernt werden, ohne die Steps bewusst zu loeschen.
- Wenn ein Parent nicht gerendert wird, gelten alle Kinder als nicht gerendert.
- Sammelaktionen sind hilfreich: alle gerenderten IDs als Animationstargets markieren, alle anzeigen/ausblenden.

### 2. Animation

Zweck: nur die fachlich freigegebenen Steuerelemente animieren.

Darstellung:

- Links/gross: SVG-Preview.
- Rechts: Liste der sichtbaren Targets.
- Pro Target: Status, Label, Confidence, Anzahl/Badges der Steps.
- Aktiver Target-Editor: Trigger hinzufuegen/loeschen, Action waehlen, `sourceText` setzen, Parameter bearbeiten.
- Darunter oder daneben: gesprochener Text, aus dem Textbereiche markiert werden koennen.
- Unten: Mock-Timeline.

Unterstuetzte Actions:

```text
show       -> einblenden, optional fromY
hide       -> ausblenden, optional toY
highlight  -> kurz hervorheben, optional fill/stroke/strokeWidth
draw       -> zeichnen oder gefuellte Form reveal-en
```

Fuer `draw`:

```json
{
  "action": "draw",
  "durFrames": 36,
  "drawStyle": "reveal",
  "direction": "topToBottom"
}
```

`drawStyle: "stroke"` ist der Standard. `drawStyle: "reveal"` ist fuer gefuellte Flaechen wie Pfeile oft besser.

## Vorschau-Verhalten

Es gibt zwei Preview-Zustaende:

```text
inspect
```

Alle gerenderten SVG-Elemente bleiben sichtbar. Dieser Zustand ist fuer Auswahl, Strukturpruefung und Elementinspektion. Die Animation wird nicht abgespielt.

```text
timeline
```

Die Preview folgt der Mock-Timeline. `show`, `hide`, `draw` und `highlight` werden anhand der sortierten Trigger abgespielt.

Umschalten auf `timeline`, wenn der Nutzer:

- Play drueckt,
- die Timeline scrubbt,
- einen konkreten Trigger auswaehlt,
- direkt in der animierten Preview klickt.

Umschalten oder bleiben in `inspect`, wenn der Nutzer:

- im Strukturbaum ein Element auswaehlt,
- in der Targetliste nur ein Element inspiziert.

`render: false` gilt in beiden Modi. Solche IDs bleiben immer unsichtbar.

Farbsprache, falls UI-Farben genutzt werden:

```text
show       gruen
hide       orange
draw       blau
highlight  violett
```

Dieselbe Farbe fuer Badge, Trigger-Chip, Timeline-Marker, Textmarkierung und aktive SVG-Outline verwenden.

## Trigger Aus Gesprochenem Text Setzen

Der gesprochene Text muss im Animationsmodus sichtbar und selektierbar sein. Der Nutzer markiert eine Wortfolge und klickt beim aktiven Step auf `Textauswahl uebernehmen`.

Wichtig: Die Auswahl muss auf vollstaendige Wortgrenzen erweitert werden. Keine halben Woerter speichern.

Beispiel:

```text
Auswahl:       ten auch unterschiedlich v
Gespeichert:   enthalten auch unterschiedlich viel
```

Algorithmus:

1. Merke die aktuelle Selection im spoken-text Container.
2. Ermittele Start- und End-Offset relativ zum gesamten gesprochenen Text.
3. Erweitere Start nach links, bis vor dem Zeichen kein Buchstabe/keine Zahl mehr steht.
4. Erweitere Ende nach rechts, bis danach kein Buchstabe/keine Zahl mehr steht.
5. Trim whitespace.
6. Schreibe das Ergebnis in `steps[index].sourceText`.

Als Wortzeichen gelten Unicode-Buchstaben und Zahlen:

```regex
[\p{L}\p{N}]
```

Wenn keine Auswahl existiert: Fehlermeldung anzeigen und nichts schreiben.

## SourceText Matching

Validierung und Timeline-Sortierung sollten `sourceText` wortbasiert matchen, nicht als rohen String.

Normalisierung:

- Umlaute robust behandeln, zum Beispiel `ae`, `oe`, `ue`, `ss`.
- Diakritika entfernen.
- Kleinschreibung.
- Satzzeichen und Sonderzeichen als Trenner behandeln.
- Nur Buchstaben/Zahlen als Tokens verwenden.

Dann:

1. `spokenText` in Tokens zerlegen.
2. `sourceText` in Tokens zerlegen.
3. Die `sourceText`-Tokenfolge im `spokenText` suchen.
4. Kein Treffer: Warnung.
5. Mehrere Treffer und keine `occurrence`: Warnung.
6. Mehrere Treffer mit `occurrence`: die passende Vorkommensnummer verwenden.

Die Mock-Timeline sortiert alle Steps nach dem ersten passenden Wortindex. Nicht matchende Steps kommen ans Ende und werden als Warnung markiert.

## Mock-Timeline

Solange es keine finalen TTS-Wortzeiten gibt:

- Sortiere Steps nach `sourceText`-Position im gesprochenen Text.
- Weise jedem Step einen Mock-Zeitpunkt mit festem Abstand zu, zum Beispiel 0.5 Sekunden.
- Dauer aus Step-Feldern oder Defaults ableiten:
  - `show`: `enterFrames`
  - `hide`: `exitFrames`
  - `highlight`: `durFrames` oder `highlightDurFrames`
  - `draw`: `durFrames` oder `drawDurFrames`
- Die Mock-Timeline niemals als finale Zeitquelle speichern.

## Speichern

Der Editor arbeitet am Manifest-Entwurf und zeigt einen klaren Speicherzustand:

```text
Ungespeichert
Speichere...
Gespeichert
Fehler
```

Beim Speichern:

1. Manifest validieren.
2. Nur relative Pfade innerhalb der Szene zulassen.
3. JSON formatiert schreiben.
4. Danach SVG-Inventar erneut gegen Manifest synchronisieren.
5. Warnungen weiterhin anzeigen, aber nicht alle Warnungen als Speicherfehler behandeln.

## Validierung Im Editor

Warnungen/Infos anzeigen fuer:

- Target steht im Manifest, aber nicht im SVG.
- Target ist noch `needsReview`.
- Target oder Step hat `confidence: "low"`.
- Step verweist auf Target, das nicht in `targets[]` steht.
- Step verweist auf Target mit `notAnimated`, `ignored` oder `orphaned`.
- Step-Target fehlt im SVG.
- Step hat kein `sourceText`.
- `sourceText` kommt im gesprochenen Text nicht vor.
- `sourceText` ist mehrfach vorhanden und `occurrence` fehlt.

Diese Validierung ist Review-Hilfe. Die finale Pipeline muss spaeter erneut validieren.

## Promotion In Finale Renderdaten

Bei der Uebernahme in eine finale Lesson:

1. `targets[].render === false` wird zu `hiddenIds[]`.
2. Steps fuer `render: false`, `notAnimated`, `ignored` oder `orphaned` werden nicht uebernommen.
3. Steps ohne matchbares `sourceText` werden uebersprungen und als Warnung protokolliert.
4. `needsReview` und `confidence: "low"` duerfen Warnungen erzeugen.
5. Actions werden in finale Step-Form uebertragen.

Beispiel finaler Step:

```json
{
  "id": "option_failures_only",
  "action": "show",
  "sourceText": "nur die Ausfaelle",
  "enterFrames": 16,
  "fromY": 18
}
```

Final gehoeren die Steps in die renderbare Lesson-Struktur, nicht in abgeleitete Regie- oder Resolved-Dateien.

## Rendering Der SVG-Elemente

Beim Rendern:

1. SVG laden und in ein DOM parsen.
2. Basis-SVG klonen, damit das Original unveraendert bleibt.
3. Alle `hiddenIds` beziehungsweise Manifest-Targets mit `render: false` entfernen oder auf `display: none` setzen.
4. Fuer animierte Targets Style/Transform/Opacity nach aktuellem Frame anwenden.
5. Fuer Gruppen alle relevanten Kinder behandeln, besonders bei `draw`.
6. Text in animierten Gruppen nicht versehentlich mit Stroke/Fill-Highlight ueberschreiben; Paint-Aenderungen nur auf geeignete Shape-Elemente anwenden.

Sichtbarkeitslogik:

- Wenn ein Element einen ersten `show`-Step hat, ist es vor diesem Step unsichtbar.
- Wenn ein Element per `hide` ausgeblendet wird, bleibt es danach unsichtbar.
- `highlight` veraendert nur temporaer die Darstellung.
- `draw` kann als Sichtbarkeitsaufbau dienen. Bei `drawStyle: "reveal"` nicht direkt davor noch `show` fuer dasselbe Element setzen.

## Minimaler Implementierungsplan Fuer Einen Neuen Agenten

1. Manifest-Schema anlegen: `targets[]`, `steps[]`, `defaults`, `sourceText`, `occurrence`, `confidence`.
2. SVG-Inventar-Parser bauen: ID, Tag, Label, Parent, `data-anim-target`.
3. Sync-Funktion bauen: bestehende Entscheidungen erhalten, neue Targets ergaenzen, fehlende als `orphaned` markieren.
4. Editor mit zwei Tabs bauen: `SVG Struktur` und `Animation`.
5. SVG-Preview mit `inspect` und `timeline` Zustand bauen.
6. Gesprochenen Text selektierbar anzeigen und Auswahl auf Wortgrenzen erweitern.
7. `sourceText` wortbasiert matchen und Timeline daraus sortieren.
8. Manifest speichern und Validierungswarnungen anzeigen.
9. Promotion bauen: Manifest-Steps und `render: false` in finale Authoring-Steps und `hiddenIds` umwandeln.
10. Finale Pipeline/Render validiert noch einmal gegen SVG-IDs und `sourceText`.

## Nicht Vermischen

- Review-Manifest ist Editorzustand.
- Finale Authoring-/Lesson-Daten sind Rendervertrag.
- Regie-/Resolved-Dateien sind abgeleitet und werden nicht manuell editiert.
- Mock-Timeline ist nur Vorschau.
- Finale Trigger sind immer `sourceText` plus spaeteres Worttiming.

---

# Verbindlicher Portierungsvertrag

Die bisherige Kurzbeschreibung erklärt die fachliche Idee. Die folgenden
Abschnitte präzisieren den tatsächlich implementierten Stand. Bei
Mehrdeutigkeiten gelten die detaillierten Regeln in diesem Portierungsvertrag.

## 1. Zielbild Und Abnahme

Die Portierung ist vollständig, wenn ein Nutzer im Zielsystem:

1. eine Szene mit einem lokalen SVG öffnen kann;
2. alle relevanten SVG-IDs als Baum sieht;
3. pro ID getrennt entscheiden kann, ob sie
   - als eigenes Steuerelement im Animationseditor erscheint und
   - überhaupt in Preview und finalem Render sichtbar bleibt;
4. pro Steuerelement die Zustände `Noch offen`, `Animiert` und
   `Immer sichtbar` setzen kann;
5. beliebig viele Trigger mit den Aktionen `show`, `hide`, `highlight`,
   `draw` und `transform` bearbeiten kann;
6. einen Trigger durch Markieren einer vollständigen Wortfolge im gesprochenen
   Text setzen kann;
7. Trigger in einer nach Sprachreihenfolge sortierten Mock-Timeline prüfen kann;
8. zwischen einer vollständigen Inspektionsansicht und der zeitabhängigen
   Animationsansicht wechseln kann;
9. Szene und Animationsmanifest gemeinsam und fehlersicher speichern kann;
10. das Review-Manifest in finale Authoring-Daten überführen kann;
11. die finalen Trigger nach TTS anhand echter Wortzeiten in Frames auflösen
    kann; und
12. im finalen Renderer dieselben strukturellen Ausschlüsse und Aktionen
    anwenden kann.

Eine reine Nachbildung der sichtbaren Oberfläche reicht nicht aus. Die
Daten-, Validierungs-, Promotions- und Renderverträge gehören zur Funktion.

## 2. Nicht Verhandelbare Invarianten

- SVG-Elemente werden über stabile `id`-Attribute adressiert.
- `visibleInEditor: false` bedeutet nur: nicht als eigenes Steuerelement im
  Animationseditor zeigen.
- `render: false` bedeutet: ID beziehungsweise Gruppe strukturell aus Preview
  und finalem Render entfernen.
- Ein nicht gerenderter Parent macht auch seine Nachfahren unsichtbar.
- Ein Target mit vorhandenen Triggern darf nicht still aus der
  Animationsliste entfernt werden.
- Das Ausblenden eines Targets aus dem Render entfernt dessen Trigger und die
  Trigger aller Nachfahren.
- Review-Timing ist nur Mock-Timing. Es wird nicht als finale Zeit gespeichert.
- Finale Trigger speichern `sourceText` und optional `occurrence`, niemals
  manuell erfundene Wort-, Sekunden- oder Framepositionen.
- Das finale Authoring-Dokument ist nach Promotion die fachliche Quelle.
- Regie- und Resolved-Dateien sind abgeleitet und werden nicht manuell editiert.
- Manifest, SVG-Inventar und gesprochener Text werden serverseitig erneut
  validiert; Clientvalidierung ist nur unmittelbares Feedback.
- Fehlende IDs oder nicht matchende Trigger werden sichtbar gemeldet und nicht
  still geraten.

## 3. Gesamtarchitektur

```text
Szenen-JSON
  + lokales SVG
  + optionales Review-Manifest
        |
        v
SVG Discovery und Inventar
        |
        v
Manifest-Synchronisierung
        |
        +-----------------------+
        |                       |
        v                       v
SVG Struktur                Animation
Editor-/Render-Freigabe     Targets, Trigger, sourceText
        |                       |
        +-----------+-----------+
                    v
            Mock-Preview im Browser
                    |
                    v
           Manifest serverseitig speichern
                    |
                    v
                 Promotion
                    |
                    v
         lesson.authoring.v1.json
                    |
                    v
 sourceText -> atWordIndex -> atFrame/atSec
                    |
                    v
              finaler Renderer
```

Empfohlene Modulgrenzen im Zielrepository:

| Modul | Verantwortung |
| --- | --- |
| `svgManifestDomain` | Schema, Typen, Defaults, Sync, Issues, Matching |
| `svgInventory` | SVG lesen, IDs/Labels/Parents extrahieren |
| `svgEditorState` | Drafts, Auswahl, Tabs, Previewmodus, Playhead |
| `svgStructureEditor` | Baum und beide Sichtbarkeitsentscheidungen |
| `svgAnimationEditor` | Targets, Trigger, Aktionsparameter, Textauswahl |
| `svgMockPreview` | Browser-Preview mit Inspektions- und Timelinemodus |
| `svgManifestApi` | Asset laden, Manifest laden/speichern, Pfadsicherheit |
| `svgPromotion` | Review-Manifest in finale Authoring-Schritte umwandeln |
| `svgTimingResolver` | `sourceText` über Worttimings in Frames auflösen |
| `svgFrameRenderer` | SVG pro Frame klonen, mutieren und serialisieren |

Die aktuelle Referenzimplementierung verteilt diese Aufgaben auf:

| Referenzdatei | Aktuelle Aufgabe |
| --- | --- |
| `src/lib/storyboard/svg-animation-manifest.ts` | Zod-Schema, Inventarparser, Sync, Matching, Issues |
| `scripts/storyboard-reviewer.ts` | Discovery, Asset-URL, Laden und Speichern |
| `tools/storyboard-reviewer/app.js` | Editorzustand, HTML, Events, Mock-Preview |
| `tools/storyboard-reviewer/app.css` | Vollbildlayout, Baum, Timeline, Aktionsfarben |
| `scripts/storyboard/promote-lesson.ts` | Promotion in finale Authoring-Daten |
| `src/lib/storyboard/authoring.ts` | finales Schema und `sourceText`-Validierung |
| `scripts/pipeline/02-resolve-storyboard.ts` | Wortzeit in relativen Frame umrechnen |
| `src/components/svg/applySvgSteps.ts` | finale SVG-Mutation pro Frame |
| `src/components/svg/useSvgDom.ts` | SVG laden und als DOM normalisieren |
| `src/scenes/SvgDiagramScene.tsx` | Remotion-Szene und finaler SVG-Einsatz |

Diese Pfade sind Referenzhinweise. Im Zielrepository dürfen die Dateien anders
heißen, solange die Verantwortlichkeiten und Verträge erhalten bleiben.

## 4. Minimale Technische Voraussetzungen

Das Zielsystem braucht:

- einen Browser mit `DOMParser`, `XMLSerializer`, Unicode-Property-RegEx und
  DOM-Selection-Unterstützung;
- eine Schema-Validierung, zum Beispiel Zod, JSON Schema, Valibot oder eine
  äquivalente strikte Validierung;
- einen Server-Endpunkt zum sicheren Lesen lokaler SVGs;
- einen Server-Endpunkt zum atomaren Speichern formatierter JSON-Manifeste;
- einen gemeinsamen Szenen-Draft mit `spokenTextDraft`;
- einen finalen Authoring-/Lesson-Datenträger;
- Worttimings aus TTS oder einem äquivalenten Alignment;
- einen framebasierten Renderer; in der Referenz ist das Remotion;
- Tests für Domainlogik, UI-Invarianten, Promotion und finales Rendering.

Die Referenz verwendet:

- TypeScript/Node.js;
- Zod für strikte Schemas;
- Vanilla-Browser-JavaScript für den Reviewer;
- React und Remotion für den finalen Renderer;
- 30 FPS als Reviewer-/Mock-Referenz.

## 5. Dateisystemvertrag

Empfohlene Review-Struktur:

```text
review-root/
  modules/
    <module-id>/
      scenes/
        <scene-id>/
          scene.storyboard.v1.json
          assets/
            diagram.svg
            diagram.animation.v1.json
```

Der Manifestpfad wird standardmäßig aus dem SVG-Pfad abgeleitet:

```text
assets/diagram.svg
-> assets/diagram.animation.v1.json
```

Ableitungsregel:

```ts
function defaultManifestPath(svgPath: string): string {
  return svgPath.replace(/\.svg(?:$|[?#].*$)/i, ".animation.v1.json");
}
```

Ein Szenen-SVG wird aktuell aus folgenden möglichen Feldern entdeckt:

```text
slide.content.svgPath
slide.content.media.path
slide.content.media.src
slide.content.media.assetPath
slide.content.image.src
slide.content.image.path
scene.visuals[].assetPath
```

Nur lokale Pfade mit der Endung `.svg` gelten für das Review-Manifest.
`http:`, `https:`, `data:` und `blob:` werden für lokale Manifest- und
ID-Prüfung ausgeschlossen.

Wenn mehrere SVGs in einer Szene entdeckt werden, zeigt die Oberfläche
Asset-Tabs. Der ausgewählte Wert wird pro Szene gespeichert. Ohne Auswahl ist
das erste SVG aktiv.

## 6. Datenvertrag: Geladenes SVG-Editorobjekt

Der Server liefert pro entdecktem SVG mindestens:

```ts
type StoryboardSvgAnimation = {
  svgPath: string;
  manifestPath: string;
  assetUrl?: string;
  manifest: SvgAnimationManifest;
  inventory: SvgInventoryTarget[];
  issues: SvgManifestIssue[];
  exists: boolean;
};
```

Semantik:

- `svgPath` ist relativ zum Szenenordner.
- `manifestPath` ist relativ zum Szenenordner.
- `assetUrl` ist eine sichere Server-URL zum SVG.
- `manifest` ist bereits validiert und mit dem Inventar synchronisiert.
- `inventory` enthält den vollständigen relevanten ID-Baum.
- `issues` enthält nicht blockierende Review-Hinweise.
- `exists` sagt, ob eine Manifestdatei physisch existiert. Ein leeres,
  synthetisches Manifest kann trotzdem bearbeitet werden.

## 7. Datenvertrag: Manifest

### 7.1 Vollständige TypeScript-Form

```ts
type Confidence = "high" | "medium" | "low";

type TargetStatus =
  | "animated"
  | "notAnimated"
  | "ignored"
  | "needsReview"
  | "orphaned";

type SvgTarget = {
  targetId: string;
  label?: string;
  status: TargetStatus;
  visibleInEditor?: boolean;
  render?: boolean;
  confidence?: Confidence;
  ignoreReason?: string;
};

type StepBase = {
  stepId?: string;
  targetId: string;
  sourceText?: string;
  occurrence?: number;
  confidence?: Confidence;
  notes?: string;
};

type ShowStep = StepBase & {
  action: "show";
  enterFrames?: number;
  fromY?: number;
};

type HideStep = StepBase & {
  action: "hide";
  exitFrames?: number;
  toY?: number;
};

type HighlightStep = StepBase & {
  action: "highlight";
  durFrames?: number;
  fill?: string;
  stroke?: string;
  strokeWidth?: number;
};

type DrawDirection =
  | "leftToRight"
  | "rightToLeft"
  | "topToBottom"
  | "bottomToTop";

type DrawStep = StepBase & {
  action: "draw";
  durFrames?: number;
  drawStyle?: "stroke" | "reveal";
  direction?: DrawDirection;
};

type TransformStep = StepBase & {
  action: "transform";
  durFrames?: number;
  fromTranslateX?: number;
  fromTranslateY?: number;
  fromScale?: number;
  translateX?: number;
  translateY?: number;
  scale?: number;
  transformOrigin?: string;
};

type SvgStep =
  | ShowStep
  | HideStep
  | HighlightStep
  | DrawStep
  | TransformStep;

type SvgManifest = {
  schemaVersion: "svgAnimationManifest/v1";
  svgPath: string;
  defaults?: {
    enterFrames?: number;
    exitFrames?: number;
    highlightDurFrames?: number;
    drawDurFrames?: number;
    transformDurFrames?: number;
  };
  targets: SvgTarget[];
  steps: SvgStep[];
};
```

### 7.2 Strikte Validierungsregeln

- Das Rootobjekt und alle Unterobjekte sind strikt: unbekannte Felder sollen
  als Fehler gelten, nicht still verschwinden.
- Alle IDs und Pfade sind nicht leere Strings.
- Framewerte sind positive Ganzzahlen.
- `occurrence` ist eine positive Ganzzahl und 1-basiert.
- `strokeWidth` ist größer oder gleich null.
- `fromScale` und `scale` sind strikt größer als null.
- Fehlende `targets` und `steps` werden beim Parsen als leere Arrays
  initialisiert.
- Fehlender Targetstatus wird als `needsReview` interpretiert.
- Beim Transform sind folgende Schema-Defaults gültig:
  - `fromTranslateX: 0`
  - `fromTranslateY: 0`
  - `fromScale: 1`
  - `translateX: 0`
  - `translateY: 0`
  - `scale: 1`
  - `transformOrigin: "center"`
- Alte Richtungswerte mit Bindestrich werden beim Parsen normalisiert:
  - `left-to-right -> leftToRight`
  - `right-to-left -> rightToLeft`
  - `top-to-bottom -> topToBottom`
  - `bottom-to-top -> bottomToTop`

### 7.3 Vollständiges Beispiel

```json
{
  "schemaVersion": "svgAnimationManifest/v1",
  "svgPath": "assets/diagram.svg",
  "defaults": {
    "enterFrames": 14,
    "exitFrames": 14,
    "highlightDurFrames": 24,
    "drawDurFrames": 36,
    "transformDurFrames": 30
  },
  "targets": [
    {
      "targetId": "diagram_root",
      "label": "Diagramm",
      "status": "animated",
      "confidence": "high"
    },
    {
      "targetId": "diagram_label",
      "label": "Beschriftung",
      "status": "notAnimated",
      "confidence": "high"
    },
    {
      "targetId": "diagram_child_shape",
      "label": "Unterelement",
      "status": "needsReview",
      "visibleInEditor": false
    },
    {
      "targetId": "export_helper_grid",
      "label": "Export-Hilfsraster",
      "status": "needsReview",
      "visibleInEditor": false,
      "render": false
    }
  ],
  "steps": [
    {
      "stepId": "show-diagram",
      "targetId": "diagram_root",
      "action": "show",
      "sourceText": "Das Diagramm erscheint",
      "enterFrames": 14,
      "fromY": 18,
      "confidence": "high"
    },
    {
      "stepId": "highlight-diagram",
      "targetId": "diagram_root",
      "action": "highlight",
      "sourceText": "besonders wichtig",
      "durFrames": 24,
      "fill": "#e3f3f8",
      "stroke": "#007ea7",
      "strokeWidth": 4,
      "confidence": "medium"
    }
  ]
}
```

## 8. SVG-Vertrag

### 8.1 Zulässige Inventar-Tags

Nur IDs auf folgenden Tags werden als steuerbare visuelle Targets inventarisiert:

```text
g
path
rect
circle
ellipse
line
polyline
polygon
image
text
```

IDs in `title`, `defs`, `filter`, `clipPath` und anderen Tags werden nicht als
Editorziele inventarisiert. Sie können trotzdem intern vom SVG verwendet werden.

### 8.2 ID- und Gruppierungsregeln

- Jede animierbare Einheit hat eine eindeutige, stabile ID.
- IDs sollen semantisch und ASCII-sicher sein.
- Empfohlen: Kleinbuchstaben und Unterstriche, zum Beispiel
  `arrow_sensor_to_controller`.
- Eine fachliche Einheit aus mehreren Shapes wird in ein
  `<g id="...">...</g>` gelegt.
- Mit `data-anim-target="true"` wird ein logischer Parent als öffentliches
  Editorziel markiert.
- Ein lesbares Label wird in dieser Reihenfolge ermittelt:
  1. `data-anim-label`
  2. `data-label`
  3. `aria-label`
  4. aus der ID abgeleitet
- Die ID-Ableitung ersetzt Bindestriche und Unterstriche durch Leerzeichen,
  normalisiert Whitespace und schreibt Wortanfänge groß.
- Folgende Werte gelten für `data-anim-target` als falsch:
  leerer Wert, `0`, `false` und `no`. Jeder andere vorhandene Wert gilt als
  wahr.
- Doppelte IDs sind unzulässig. Der aktuelle Inventarparser behält bei
  Duplikaten nur das erste Vorkommen; die Zielportierung sollte zusätzlich
  einen Fehler melden.
- Keine Skripte oder interaktive Logik in SVG-Dateien.

### 8.3 Draw-fähige Geometrie

`draw` arbeitet mit:

```text
path, rect, circle, ellipse, line, polyline, polygon
```

Ein `g` ist draw-fähig, wenn es mindestens einen solchen messbaren Nachfahren
enthält. `text` wird nicht als Pfadgeometrie gezeichnet.

## 9. Inventar Extrahieren

### 9.1 Ergebnisform

```ts
type SvgInventoryTarget = {
  targetId: string;
  tagName: string;
  label?: string;
  parentTargetId?: string;
  isExplicitTarget?: boolean;
};
```

`parentTargetId` bezeichnet den nächsten inventarisierten Vorfahren mit ID,
nicht zwingend das direkte DOM-Elternelement.

### 9.2 Referenzalgorithmus

Die aktuelle Implementierung scannt den SVG-Text in Dokumentreihenfolge und
führt einen Stack offener Tags:

```text
targets = []
seenIds = Set()
stack = []

für jeden öffnenden oder schließenden XML-Tag:
  wenn schließend:
    entferne den passenden offenen Tag und alle tieferen Stackeinträge
    weiter

  parse Attribute mit doppelten oder einfachen Anführungszeichen
  tagName = lowercase
  targetId = Attribut "id"
  parentTargetId = letzter Stackeintrag mit targetId

  wenn tagName zulässig und targetId nicht leer und noch nicht gesehen:
    füge InventoryTarget hinzu
    merke targetId in seenIds

  wenn nicht selbstschließend:
    lege Tag auf Stack
```

XML-Entities in Attributen werden für `&quot;`, `&apos;`, `&amp;`,
`&lt;` und `&gt;` dekodiert.

Für eine Neuentwicklung ist ein echter XML-Parser robuster. Das resultierende
Inventar und seine Reihenfolge müssen jedoch gleich bleiben.

## 10. Manifest Mit Inventar Synchronisieren

Die Synchronisierung läuft:

- beim Laden;
- nach dem Speichern;
- vor Promotion; und
- idealerweise nach jeder externen SVG-Änderung.

### 10.1 Vorberechnungen

Erzeuge:

- `inventoryById`;
- `stepsByTarget` als Anzahl pro Target;
- `existingTargets`;
- `hiddenTargetIds` für `visibleInEditor === false`;
- `nonRenderedTargetIds` für `render === false`;
- `publicTargetIds`.

`publicTargetIds` enthält:

1. alle `data-anim-target`-IDs, außer sie sind explizit editorverborgen oder
   nicht gerendert;
2. alle im Manifest vorhandenen IDs, die im SVG existieren und weder
   `visibleInEditor: false` noch `render: false` tragen;
3. alle IDs mit mindestens einem Step, sofern sie im SVG existieren.

### 10.2 Parent-Abdeckung

Eine Inventar-ID gilt als durch einen verwalteten Parent abgedeckt, wenn in
ihrer Vorfahrenkette mindestens eine ID in einer dieser Mengen liegt:

- `publicTargetIds`;
- `hiddenTargetIds`;
- `nonRenderedTargetIds`.

Dadurch erscheint bei einem öffentlichen Gruppen-Target nicht automatisch
jeder Shape-Nachfahre zusätzlich im Manifest.

### 10.3 Synchronisierungsalgorithmus

Für jede Inventar-ID in Dokumentreihenfolge:

1. Suche einen bestehenden Manifest-Target.
2. Wenn kein bestehender Target vorliegt, die ID nicht öffentlich ist und ein
   verwalteter Parent sie abdeckt, überspringe sie.
3. Sonst erzeuge den synchronisierten Target mit:
   - bestehendem Label oder Inventarlabel;
   - bestehendem Status, sofern dieser nicht `orphaned` ist;
   - andernfalls `animated`, wenn Steps existieren;
   - andernfalls `needsReview`;
   - vorhandener Confidence;
   - vorhandenen expliziten `visibleInEditor: false`-,
     `render: false`- und `ignoreReason`-Werten.
4. Bestehende Manifest-Targets, die nicht mehr im Inventar vorkommen, werden
   am Ende mit `status: "orphaned"` ergänzt.
5. Step-Targets, die weder Inventar- noch synchronisierte Manifest-ID sind,
   werden ebenfalls als `orphaned` ergänzt.

Die Synchronisierung:

- löscht keine Steps allein wegen einer fehlenden SVG-ID;
- überschreibt keine bestehenden Labels oder Confidence-Werte;
- hebt einen alten `orphaned`-Status auf, sobald die ID wieder existiert;
- schreibt nicht automatisch jeden Kind-Shape in `targets[]`.

### 10.4 Wichtige Beispiele

Öffentlicher Parent:

```xml
<g id="card" data-anim-target="true">
  <rect id="card_panel" />
  <text id="card_label">Text</text>
</g>
```

Ergebnis bei leerem Manifest:

```json
{
  "targets": [
    { "targetId": "card", "status": "needsReview" }
  ]
}
```

Nicht markierte Gruppe:

```xml
<g id="loose_group">
  <rect id="loose_group_panel" />
</g>
```

Ohne bestehenden verwalteten Parent können sowohl `loose_group` als auch
`loose_group_panel` als offene Targets erscheinen. Deshalb sollten fachliche
Gruppen im SVG explizit markiert werden.

### 10.5 Einstieg Aus Dem Normalen Szeneneditor

Außerhalb des Vollbildmodus ist der Bereich `SVG-Animation` bewusst
schreibgeschützt und kompakt. Dort werden keine Target- oder Stepfelder
gerendert.

Er zeigt:

- den SVG-Pfad, nicht den Manifestpfad;
- bei mehreren SVGs Asset-Tabs;
- Anzahl der Editor-Elemente;
- Anzahl `animated`;
- Anzahl Timeline-Trigger;
- Anzahl `needsReview`;
- Anzahl unterschiedlicher Targets mit Trigger;
- Anzahl Trigger ohne Textmatch;
- Anzahl strukturell ausgeblendeter IDs;
- Gesamtzahl der Issues;
- höchstens drei konkrete Issues plus Restzähler;
- den Button `Animation bearbeiten`.

Alle eigentlichen Änderungen passieren erst im Vollbildmodus. So bleibt die
normale Template-Werkbank übersichtlich und es gibt nicht zwei konkurrierende
Bearbeitungsoberflächen.

## 11. Vollbild-Editor: Aufbau Und Darstellung

Der Animationsmodus ersetzt die normale Storyboardansicht vollständig. Er ist
kein kleines Modal.

### 11.1 Desktop-Wireframe

```text
+----------------------------------------------------------------------------------+
| Animationsmodus | Szenentitel | assets/diagram.svg | 5 Trigger | 2 Hinweise      |
|                         [ohne Textmatch] [Speicherstatus] [Speichern] [Zurück]   |
+--------------------------------------+-------------------------------------------+
| SVG Preview                           | [Animation] [SVG Struktur]                |
|                                      |                                           |
|                                      | rechter Arbeitsbereich                    |
|                                      | abhängig vom aktiven Tab                  |
|                                      |                                           |
|                                      |                                           |
+--------------------------------------+-------------------------------------------+
| Scrubber und Timeline-Marker          |                                           |
| [Play] [Reset]  0,50s / 2,50s        |                                           |
+--------------------------------------+-------------------------------------------+
```

Im Tab `Animation` besteht die rechte Seite aus:

```text
+-----------------------------------------------------------------------+
| horizontal scrollbare Elementkarten                                  |
+-------------------+-------------------+-------------------------------+
| Inhalt            | Trigger           | aktiver Trigger               |
| Name              | Step-Liste        | Name / Aktion / Sicherheit    |
| Status            | + Trigger         | sourceText                    |
| Sicherheit        |                   | Aktionsparameter / occurrence |
+-----------------------------------------------------------------------+
| Gesprochener Text mit farbigen Trigger-Markierungen                   |
+-----------------------------------------------------------------------+
```

Im Tab `SVG Struktur` besteht die rechte Seite aus:

```text
+-----------------------------------------------------------------------+
| SVG Struktur | n Animation · m IDs                                    |
| [Alles ein-/aufklappen] [Alle/Keine animieren] [Alle anzeigen/ausbl.] |
+------+----------------+------------+----------------------------------+
| Baum | Animation      | Sichtbar   | ID und abgeleiteter Status       |
+------+----------------+------------+----------------------------------+
| scrollbarer SVG-ID-Baum                                               |
+-----------------------------------------------------------------------+
| Auswahl: ID, Status und kurze Erklärung                               |
+-----------------------------------------------------------------------+
```

### 11.2 Exakte Layoutwerte Der Referenz

Globale Stilwerte:

```css
:root {
  --bg: #eef3f5;
  --panel: #fbfdff;
  --panel-soft: #f5f8fa;
  --line: #d9e3e8;
  --line-strong: #bdd0da;
  --ink: #132b38;
  --muted: #607583;
  --accent: #007ea7;
  --accent-soft: #e3f3f8;
  --green: #2f6f55;
  --green-soft: #e7f3ee;
  --amber: #b7791f;
  --amber-soft: #fff3dc;
  --red: #9f2f2f;
  --red-soft: #f8e8e8;
  --shadow: 0 18px 42px rgba(19, 43, 56, 0.12);
  --radius: 8px;
}
```

Wesentliche Maße:

- Vollbild-Shell: `min-height: 100vh`, `padding: 18px`, `gap: 14px`.
- Header: Flex-Zeile, weiß, 1-Pixel-Rand, 8-Pixel-Radius, 14-Pixel-Padding.
- Hauptbereich Desktop:
  `grid-template-columns: minmax(380px, 40%) minmax(720px, 1fr)`.
- Stage:
  `height: min(72vh, 780px)` und
  `grid-template-rows: auto minmax(0, 1fr) auto`.
- Rechte Animationsseite:
  `minmax(145px, 0.45fr) minmax(145px, 0.45fr) minmax(380px, 1.3fr)`.
- Maximale rechte Höhe:
  `calc(100vh - 176px)`.
- Elementkarten: horizontal scrollbar, Breite
  `clamp(150px, 22vw, 210px)`.
- Gesprochener Text: mindestens 176, höchstens 260 Pixel hoch,
  `font-size: 14px` und `line-height: 1.85`.
- Timeline-Marker: absolut bei `top: 5px`, 58 bis 92 Pixel breit.
- Strukturbaum-Spalten:
  `18px minmax(76px, 0.72fr) 42px minmax(0, 1fr)`.
- Strukturzeile: mindestens 26 Pixel hoch; Einrückung pro Tiefe 14 Pixel.
- Baum scrollt immer vertikal und reserviert mit `scrollbar-gutter: stable`
  Platz, damit Header und Zeilen nicht springen.

Responsive:

- Unter 1280 Pixel wird die Aufteilung zu
  `minmax(320px, 34%) minmax(700px, 1fr)`.
- Unter 760 Pixel wird alles einspaltig.
- Die Stage ist mobil 520 Pixel hoch.
- Die rechte Seite hat mobil keine maximale Höhe; ihre Unterspalten scrollen
  nicht mehr separat.

### 11.3 Header

Der Header zeigt:

- `Animationsmodus` als Eyebrow;
- Szenentitel;
- gekürzten SVG-Pfad mit Ellipsis;
- `<n> Trigger | <m> Hinweis(e)`;
- entweder `Trigger sortiert` oder `<n> ohne Textmatch`;
- kombinierten Speicherstatus;
- `Speichern`;
- `Zurück`.

`Speichern` speichert zuerst den Szenendraft und danach das Manifest. `Zurück`
stoppt Playback und verlässt den Vollbildmodus.

## 12. Editorzustand

Der Zustand muss mindestens diese Werte pro Szene beziehungsweise pro
SVG-Manifest halten:

```ts
type SvgEditorState = {
  animationModeSceneId: string | null;
  animationModePlayheadByScene: Record<string, number>;
  animationModePlayingSceneId: string | null;
  animationModeTabByScene: Record<string, "animation" | "structure">;
  animationPreviewModeByScene: Record<string, "inspect" | "timeline">;
  svgStructureCollapsedByScene: Record<string, boolean>;
  selectedSvgStepByScene: Record<string, number>;
  selectedSvgAnimationByScene: Record<string, string>;
  selectedSvgTargetByScene: Record<string, string>;
  lastSpokenTextSelection:
    | { sceneId: string; text: string }
    | null;
  svgManifestDraftByScene: Record<string, SvgManifest>;
  svgManifestMessageByScene: Record<string, string>;
  svgManifestToneByScene: Record<string, "muted" | "ok" | "error">;
};
```

Der stabile Schlüssel lautet:

```text
<sceneId>:<manifestPath oder svgPath>
```

Beispiel:

```text
scene-04:assets/diagram.animation.v1.json
```

Der Collapse-Schlüssel hängt zusätzlich die Target-ID an:

```text
<sceneId>:<manifestPath>:<targetId>
```

Manifeständerungen werden zunächst nur als Client-Draft gespeichert. Jede
Änderung setzt den Status auf `Ungespeichert` und stößt bei aktivierter
Live-Vorschau ein debounced Studio-Update an.

## 13. Tab „SVG Struktur“

### 13.1 Zweck

Dieser Tab beantwortet zwei voneinander unabhängige Fragen:

1. Soll die ID ein eigenes Steuerelement im Tab `Animation` sein?
2. Soll die ID überhaupt gerendert werden?

Diese Fragen dürfen nicht über einen einzigen Schalter vermischt werden.

### 13.2 Baum

Der Baum wird ausschließlich aus `inventory[]` aufgebaut:

1. Erzeuge für jede Inventar-ID einen Node mit `children: []`.
2. Verknüpfe Nodes über `parentTargetId`.
3. IDs ohne gefundenen Parent sind Wurzeln.
4. Die Dokumentreihenfolge bleibt erhalten.

`orphaned`-Targets können in der Animationsliste sichtbar sein, erscheinen
aber nicht im SVG-Baum, weil sie kein Inventarobjekt mehr besitzen.

### 13.3 Spalten Und Zeilen

Jede Zeile enthält:

- Plus/Minus für Gruppen oder einen gleich breiten Spacer;
- Checkbox `Animation`;
- pillenförmigen Sichtbarkeits-/Augenschalter;
- die technische ID in Monospace;
- einen abgeleiteten Statuschip.

Das Manifestlabel wird im Baum bewusst nicht als Hauptname verwendet. Der Baum
zeigt die technische ID, weil genau diese für Targeting und Fehlersuche zählt.

### 13.4 Abgeleiteter Zeilenstatus

Priorität:

1. Durch eigenes oder geerbtes `render: false` unsichtbar:
   `Ausgeblendet`.
2. Eigene Steps vorhanden:
   `<n> Trigger`.
3. Als Editorziel sichtbar:
   `Animation`.
4. Nächster sichtbarer Parent vorhanden:
   `Erbt: <parentId>`.
5. Sonst:
   `Nicht in Animation`.

### 13.5 Schalter „Animation“

Der Schalter ist angehakt, wenn:

- das Target gerendert wird; und
- es als eigenes Editorziel sichtbar ist oder eigene Steps besitzt.

Er ist deaktiviert, wenn:

- das Target selbst oder über einen Parent nicht gerendert wird; oder
- eigene Steps vorhanden sind.

Beim Aktivieren:

- Target bei Bedarf in `targets[]` anlegen;
- `visibleInEditor` löschen;
- `render` löschen;
- `orphaned` auf `needsReview` zurücksetzen.

Beim Deaktivieren:

- wenn Steps existieren: keine Änderung zulassen;
- sonst `visibleInEditor: false` setzen;
- Status, Label und Confidence erhalten.

Pseudocode:

```ts
function setEditorVisibility(
  manifest: SvgManifest,
  inventory: SvgInventoryTarget[],
  targetId: string,
  visible: boolean
): SvgManifest {
  if (!targetId) return manifest;
  if (!visible && hasStep(manifest, targetId)) return manifest;

  const target = ensureTarget(manifest, inventory, targetId);
  if (visible) {
    delete target.render;
    delete target.visibleInEditor;
    if (target.status === "orphaned") target.status = "needsReview";
  } else {
    target.visibleInEditor = false;
  }
  return nextManifest;
}
```

### 13.6 Schalter „Sichtbar“

Ein Target gilt als gerendert, wenn weder es selbst noch ein Inventar-Vorfahre
`render: false` trägt.

Beim Ausschalten:

- Target bei Bedarf anlegen;
- `render: false` setzen;
- `visibleInEditor: false` setzen;
- alle Steps des Targets und sämtlicher Inventar-Nachfahren entfernen.

Beim Einschalten:

- am konkreten Target `render` löschen;
- `visibleInEditor` löschen;
- `orphaned` auf `needsReview` setzen.

Wichtig: Wenn ein Parent weiterhin `render: false` trägt, kann ein Kind nicht
allein wieder sichtbar werden. Der Nutzer muss den blockierenden Parent
einschalten.

Nachfahren werden per Breadth-First Search oder äquivalent ermittelt:

```text
result = Set(targetId)
queue = direkte Kinder
solange queue nicht leer:
  child = queue.shift()
  result.add(child)
  queue.push(...Kinder von child)
```

### 13.7 Sammelaktionen

`Alles einklappen / Alles aufklappen`:

- wirkt auf alle Inventar-Nodes mit Kindern;
- verändert nur UI-Zustand, niemals Manifestdaten.

`Alle animieren`:

- geht über alle aktuell gerenderten Inventar-IDs;
- aktiviert sie als eigene Editorziele;
- nicht gerenderte IDs bleiben unberührt.

`Keine animieren`:

- versucht, alle gerenderten IDs als eigene Editorziele zu entfernen;
- IDs mit eigenen Steps bleiben sichtbar, weil der Einzelschalter diese
  Änderung ebenfalls verbietet.

`Alle ausblenden`:

- setzt alle Inventar-IDs auf nicht gerendert;
- entfernt dadurch alle Steps.

`Alle anzeigen`:

- entfernt die strukturellen Ausschlüsse wieder von allen Inventar-IDs.

Sammelaktionen arbeiten auf einem Manifest-Draft und führen erst am Ende einen
Renderzyklus aus.

### 13.8 Auswahlverhalten

- Klick auf eine Baumzeile selektiert die ID.
- Playback stoppt.
- Previewmodus wird `inspect`.
- Falls das Target eigene Trigger hat, wird sein erster Trigger selektiert.
- Die Detailbox zeigt ID, abgeleiteten Status und die Bedeutung der beiden
  Schalter.
- Die selektierte ID und alle ID-Nachfahren erhalten in der SVG-Preview einen
  orangefarbenen Glow.

## 14. Tab „Animation“

### 14.1 Welche Targets Sichtbar Sind

Ein Target erscheint im Animationstab, wenn:

```text
Target existiert
AND nicht durch eigenes/geerbtes render:false ausgeblendet
AND (
  visibleInEditor ist nicht false
  OR Target besitzt Steps
  OR Status ist orphaned
)
```

Damit bleiben Targets mit Triggern sichtbar, selbst wenn ein veraltetes
Manifest `visibleInEditor: false` enthält.

### 14.2 Standardauswahl

Wenn die gespeicherte Target-ID nicht mehr in der Kandidatenliste liegt:

1. erstes `needsReview`-Target;
2. sonst erstes `animated`-Target;
3. sonst erstes Target;
4. sonst leere Auswahl.

Beim Öffnen des Animationsmodus wird:

- der bisherige Playhead auf die aktuelle Timelinedauer geklemmt;
- der am Playhead letzte gestartete Step gewählt;
- dessen Target gewählt;
- der Previewmodus auf `inspect` gesetzt.

### 14.3 Elementleiste

Pro Target zeigt eine horizontal scrollbare Karte:

- Label;
- technische ID;
- Aktionsbadges für alle unterschiedlichen Aktionen dieses Targets;
- Statuschip;
- optionale Confidence;
- Anzahl Trigger;
- `Hinweis`, wenn mindestens eine der folgenden Bedingungen gilt:
  - `needsReview`;
  - `orphaned`;
  - Target-Confidence `low`;
  - mindestens ein Trigger ohne Textmatch.

Aktionsbadges:

| Aktion | Glyph | Farbe |
| --- | --- | --- |
| `show` | `+` | Grün `#2f6f55` |
| `hide` | `-` | Amber `#b7791f` |
| `draw` | `/` | Blau `#007ea7` |
| `highlight` | `*` | Violett `#7c3aed` |
| `transform` | `T` | Cyan `#0e7490` |

Dieselbe Aktionsfarbe wird für Badge, Triggerchip, Timeline-Marker,
Textmarkierung und aktiven Preview-Glow verwendet.

### 14.4 Targetformular

Das ausgewählte Target bietet:

- `Name` -> `target.label`;
- `Status` -> `needsReview`, `animated` oder `notAnimated`;
- `Sicherheit` -> leer, `high`, `medium` oder `low`.

Legacy-Status `ignored` wird im UI als `notAnimated` beziehungsweise
`Immer sichtbar` normalisiert. Beim Speichern einer anderen Statusentscheidung
wird `ignoreReason` entfernt, sofern der neue Status nicht `notAnimated` ist.

Eine Statusänderung zu `notAnimated` löscht vorhandene Steps aktuell nicht.
Sie erzeugt einen Warnhinweis; die Promotion überspringt diese Steps. Eine
Zielportierung darf optional einen Bestätigungsdialog anbieten, muss aber den
Zustand eindeutig behandeln.

### 14.5 Triggerliste

Die Liste enthält nur Steps des ausgewählten Targets, aber in globaler
Timeline-Reihenfolge.

Jeder Chip zeigt:

- Mock-Zeit;
- `stepId`, sonst `sourceText`, sonst `Trigger <n>`;
- Aktionsname;
- Aktionsfarbe.

Daneben liegt ein kleiner roter Löschknopf. Der aktive Trigger wird nicht
zusätzlich im Formular gelöscht; Löschen erfolgt ausschließlich in der Liste.

### 14.6 Trigger Anlegen

`+ Trigger`:

1. übernimmt die aktuelle oder zuletzt gemerkte Textauswahl derselben Szene;
2. erzeugt `stepId: "step-" + (steps.length + 1)`;
3. erzeugt standardmäßig einen `show`-Step;
4. setzt Step-Confidence auf `medium`;
5. setzt das Target auf `animated`;
6. setzt Target-Confidence auf `medium`, falls sie fehlt;
7. entfernt `visibleInEditor`, `render` und `ignoreReason` am Target;
8. hängt den Step ans Ende von `steps[]`.

Hinweis: Die Referenz erzwingt keine Eindeutigkeit von `stepId`. Für eine
robustere Portierung sollte beim Erzeugen die nächste freie ID gewählt werden.

### 14.7 Aktion Wechseln

Ein Aktionswechsel bewahrt nur:

- `stepId`;
- `targetId`;
- `sourceText`;
- `occurrence`;
- `confidence`.

Alle aktionsspezifischen Felder der alten Aktion werden verworfen. Danach
werden die Defaults der neuen Aktion gesetzt.

### 14.8 Trigger Löschen

Ein gerade neu angelegter, inhaltlich unveränderter Standardtrigger wird ohne
Rückfrage gelöscht. Eine Bestätigung ist nötig, wenn mindestens ein
bedeutungsvolles Feld vom Standard abweicht, insbesondere:

- eigener Stepname;
- `sourceText`;
- `occurrence`;
- andere Confidence oder Aktion;
- Dauer, Offset, Farben, Draw- oder Transformparameter.

Nach dem Löschen wird der Targetstatus nicht automatisch von `animated`
zurückgesetzt. Die Validierung meldet dann `als animiert markiert, aber ohne
Step`.

## 15. Aktionen Und Editor-Defaults

### 15.1 Gemeinsame Felder

Jeder aktive Trigger zeigt:

- `Name` / `stepId`;
- `Aktion`;
- `Sicherheit`;
- `Text` / `sourceText`;
- `Textauswahl übernehmen`;
- aktionsspezifische Parameter;
- `Text-Fundstelle` / `occurrence`.

### 15.2 `show`

UI-Felder:

- `Einblenddauer`;
- `Startversatz Y`.

Defaultreihenfolge:

```text
enterFrames aus manifest.defaults, wenn positiv
sonst 12 Frames im Editor
```

`fromY > 0` bedeutet Start von unten, `fromY < 0` Start von oben.

Finale Promotion verwendet ohne Stepwert:

```text
manifest.defaults.enterFrames
sonst 16
```

### 15.3 `hide`

UI-Felder:

- `Ausblenddauer`;
- `Endversatz Y`.

Editor-Default:

```text
manifest.defaults.exitFrames
sonst 12
```

Promotion:

```text
manifest.defaults.exitFrames
sonst 16
```

`toY > 0` bedeutet nach unten, `toY < 0` nach oben.

### 15.4 `highlight`

UI-Felder:

- `Highlight-Dauer`;
- `Fill`;
- `Stroke`;
- `Stroke W.`.

Editor-Default:

```text
manifest.defaults.highlightDurFrames
sonst 24
```

Promotion:

```text
manifest.defaults.highlightDurFrames
sonst 30
```

Die finale Animation pulsiert die Stroke-Breite über sechs Sinus-Halbwellen
mit maximal acht Prozent zusätzlicher Skalierung.

### 15.5 `draw`

UI-Felder:

- `Zeichendauer`;
- `Style`: `stroke` oder `reveal`;
- `Richtung`.

Editor-Default:

```text
manifest.defaults.drawDurFrames
sonst 30
drawStyle = stroke
direction = leftToRight
```

Promotion:

```text
manifest.defaults.drawDurFrames
sonst 36
```

`direction` wird nur für `reveal` ausgewertet.

### 15.6 `transform`

UI-Felder:

- `Transform-Dauer`;
- `Start X`;
- `Start Y`;
- `Start-Skalierung`;
- `Ziel X`;
- `Ziel Y`;
- `Ziel-Skalierung`;
- `Ursprung`.

Beim Anlegen oder Aktionswechsel setzt der aktuelle Editor:

```json
{
  "durFrames": 30,
  "fromTranslateX": 0,
  "fromTranslateY": 0,
  "fromScale": 1,
  "translateX": 0,
  "translateY": 0,
  "scale": 1,
  "transformOrigin": "center"
}
```

Promotion verwendet `manifest.defaults.transformDurFrames`, falls
`durFrames` fehlt, sonst 30.

### 15.7 Numerische Eingaben

- Leeres Feld entfernt den optionalen Wert.
- `strokeWidth` wird auf mindestens null geklemmt.
- Translationen, Y-Offsets und Skalierungen dürfen Dezimalzahlen im Client
  annehmen.
- Dauer und `occurrence` werden auf positive Ganzzahlen gerundet.
- Das Serverschema lehnt `scale <= 0` und `fromScale <= 0` beim Speichern ab.
- Die UI zeigt Dauer zusätzlich als Sekunden bei 30 FPS:
  `seconds = frames / 30` mit zwei Dezimalstellen.

## 16. Gesprochener Text Und Auswahl

### 16.1 Darstellung

Der gesprochene Text ist im Vollbildmodus ein `contenteditable`-Bereich mit
der ID `draftSpokenText`. Matchende Triggerphrasen werden als Markup-Spans in
den Text eingebettet.

Die Szene bleibt während der Bearbeitung die Quelle für `spokenTextDraft`.
Der Editor rekonstruiert beim Speichern reinen Text aus Textnodes und `br`.
Spezielle Pause-Chips werden über ihr `data-pause-marker` wieder in
Textmarker zurückübersetzt.

### 16.2 Auswahl Merken

Die aktuelle Auswahl wird bei `select`, `mouseup`, `keyup` und `input`
gespeichert. Weil ein Klick auf `Textauswahl übernehmen` die Browserselection
oft zusammenklappt, wird die letzte nicht leere Auswahl pro Szene behalten.

Eine gemerkte Auswahl darf nie in eine andere Szene übertragen werden.

### 16.3 Auf Ganze Wörter Erweitern

Wortzeichen sind Unicode-Buchstaben und Ziffern:

```regex
[\p{L}\p{N}]
```

Referenzalgorithmus:

```ts
function expandToWordBoundaries(
  text: string,
  rawStart: number,
  rawEnd: number
): string {
  let start = clamp(Math.min(rawStart, rawEnd), 0, text.length);
  let end = clamp(Math.max(rawStart, rawEnd), 0, text.length);

  while (start < end && /\s/u.test(text[start])) start++;
  while (end > start && /\s/u.test(text[end - 1])) end--;
  if (end <= start) return "";

  while (start > 0 && /[\p{L}\p{N}]/u.test(text[start - 1])) start--;
  while (end < text.length && /[\p{L}\p{N}]/u.test(text[end])) end++;

  return text.slice(start, end).trim();
}
```

Beispiel:

```text
Text:      Sie enthalten auch unterschiedlich viel Information.
Roh:             halten auch unterschied
Gespeichert: enthalten auch unterschiedlich
```

Bei einem normalen `textarea` werden `selectionStart` und `selectionEnd`
verwendet. Beim `contenteditable`-Text wird der Selection-String im
rekonstruierten Gesamttext gesucht und anschließend erweitert.

### 16.4 Textauswahl Übernehmen

Wenn keine Auswahl existiert:

- Manifest unverändert lassen;
- Fehlermeldung `Keine Textauswahl im gesprochenen Text.` zeigen.

Bei Auswahl:

- vollständige Phrase in `steps[index].sourceText` schreiben;
- Manifest als ungespeichert markieren;
- Timeline neu sortieren;
- Preview und Trigger-Markierungen neu rendern.

## 17. SourceText-Normalisierung Und Matching

### 17.1 Normalisierung

Jedes Wort wird separat normalisiert:

1. `Ä -> Ae`, `Ö -> Oe`, `Ü -> Ue`;
2. `ä -> ae`, `ö -> oe`, `ü -> ue`, `ß -> ss`;
3. Unicode `NFKD`;
4. kombinierende Diakritika entfernen;
5. Kleinschreibung;
6. alles außer Unicode-Buchstaben und Ziffern als Trenner behandeln.

Tokenisierung:

```ts
const tokens = Array.from(text.matchAll(/[\p{L}\p{N}]+/gu))
  .map(match => normalize(match[0]))
  .filter(Boolean);
```

Damit matchen zum Beispiel `Äpfel` und `Aepfel`.

### 17.2 Sequenzsuche

```text
spokenTokens = tokenize(spokenText)
sourceTokens = tokenize(sourceText)

für start von 0 bis spokenTokens.length - sourceTokens.length:
  wenn alle sourceTokens an start + offset gleich sind:
    matches.push(start)
```

Das Ergebnis enthält 0-basierte Wortstartindizes.

### 17.3 Occurrence

`occurrence` ist 1-basiert:

- fehlt es bei genau einem Match, wird dieser Match verwendet;
- fehlt es bei mehreren Matches, ist der Trigger mehrdeutig;
- ist es gesetzt, wird der entsprechende Match verwendet.

Editor und Promotion müssen mindestens warnen beziehungsweise fehlschlagen,
wenn `occurrence` größer als die Trefferzahl ist. Die finale
Authoring-Validierung der Referenz tut dies zwingend.

### 17.4 Textmarkierungen

Für die sichtbaren Markierungen werden zu jedem Match zusätzlich Zeichenbereiche
ermittelt. Bei mehreren Treffern wird `occurrence - 1` verwendet, sonst der
erste Treffer.

Markierungen werden nach:

1. Startposition aufsteigend;
2. Endposition absteigend;
3. Timelineindex

sortiert. Überlappende spätere Markierungen werden aktuell übersprungen, damit
kein ungültig verschachteltes Markup entsteht.

Die aktive Markierung erhält zusätzlich einen orangefarbenen Fokus-Ring.

## 18. Mock-Timeline

### 18.1 Zweck

Die Mock-Timeline beantwortet vor TTS nur:

- In welcher sprachlichen Reihenfolge liegen die Trigger?
- Welche Aktion ist am gewählten Vorschaupunkt aktiv?
- Ist ein Triggertext auffindbar?

Sie ist keine Schätzung der späteren Sprechgeschwindigkeit.

### 18.2 Aufbau

Für jeden Manifest-Step:

1. Steps auf durch `render: false` ausgeschlossenen Targets überspringen.
2. `sourceText` gegen den aktuellen `spokenTextDraft` matchen.
3. Bei `occurrence` den entsprechenden Treffer wählen.
4. Wenn kein passender Treffer existiert:
   `wordIndex = Infinity` und `matched = false`.
5. Sonst:
   `wordIndex = gefundener Wortindex` und `matched = true`.
6. Nach `wordIndex` und bei Gleichstand nach ursprünglichem Stepindex sortieren.
7. Jedem sortierten Step zuweisen:

```text
mockSec = timelineIndex * 0.5
```

Nicht matchende Steps stehen dadurch am Ende, bleiben aber sichtbar und
abspielbar.

### 18.3 Dauer

```ts
duration = Math.max(
  0.5,
  timeline.length > 0
    ? timeline[timeline.length - 1].mockSec + 0.5
    : 0.5
);
```

### 18.4 Aktiver Step

- Eine explizit gespeicherte Stepauswahl hat Vorrang, wenn sie noch existiert.
- Sonst gilt der letzte Step mit `mockSec <= playhead`.
- Sonst der erste Timeline-Step.
- Beim Klicken eines Markers wird dessen Step aktiv und der Playhead direkt
  auf `mockSec` gesetzt.
- Beim Scrubben wird der zum Playhead passende Step aktiv.

### 18.5 Dauer Pro Aktion In Der Browser-Preview

Bei 30 Mock-FPS:

| Aktion | Dauerquelle | Fallback |
| --- | --- | --- |
| `show` | `step.enterFrames` oder `defaults.enterFrames` | 0,4 s |
| `hide` | `step.exitFrames`, `defaults.exitFrames` oder `defaults.enterFrames` | 0,4 s |
| `highlight` | `step.durFrames` oder `defaults.highlightDurFrames` | 0,8 s |
| `draw` | `step.durFrames` oder `defaults.drawDurFrames` | 0,8 s |
| `transform` | `step.durFrames` | 1,0 s |

Positive Framewerte werden durch 30 geteilt.

### 18.6 Playback

Die aktuelle Referenz:

- erhöht den Playhead alle 160 Millisekunden um 0,1 Mock-Sekunden;
- stoppt am Timelineende;
- stoppt beim Tabwechsel, Targetklick, Feldfokus, Scrubben und Schließen;
- wechselt beim Start in `timeline`;
- zeigt `Play` beziehungsweise `Pause`;
- setzt `Reset` auf 0.

Das ergibt bewusst kein Echtzeitverhältnis von 1:1. Eine Portierung darf die
Playbackrate auf reale Zeit umstellen, sofern die 0,5-Sekunden-Triggerpositionen
und alle Zustandswechsel gleich bleiben. Für pixel- und verhaltensgleiche
Portierung ist der 160-ms/0,1-s-Takt zu übernehmen.

### 18.7 Timeline-Darstellung

- Unsichtbarer Range-Input über einer 4-Pixel-Schiene.
- Playhead: 14-Pixel-Kreis in Accent-Blau.
- Marker absolut entlang der Timelinedauer positioniert.
- Aktiver Marker mit Accent-Rand und Outline.
- Nicht matchender Marker mit Amber-Hintergrund.
- Niedrige Confidence mit Amber-Text.
- Marker zeigt Mock-Sekunde und gekürztes Step-Label.
- Unter der Markerleiste liegen Play, Reset und
  `<playhead> / <duration>`.

## 19. Zwei Previewmodi

### 19.1 `inspect`

Ziel: Strukturauswahl und Elementbearbeitung.

- Alle gerenderten SVG-Elemente bleiben sichtbar.
- Show/Hide/Draw-Timing wird nicht angewendet.
- Das gewählte Element und seine ID-Nachfahren erhalten den Auswahl-Glow.
- Der Toolbar-Chip lautet `Elemente sichtbar`.

### 19.2 `timeline`

Ziel: tatsächliche Mock-Animationsreihenfolge.

- Strukturelle Ausschlüsse bleiben entfernt.
- Show, Hide, Highlight, Draw und Transform werden am Playhead angewendet.
- Der Toolbar-Chip lautet `Timeline`.

### 19.3 Zustandswechsel

| Interaktion | Ergebnis |
| --- | --- |
| Animationsmodus öffnen | `inspect` |
| Elementkarte wählen | `inspect` |
| Strukturbaum-ID wählen | `inspect` |
| Triggerchip wählen | `timeline` |
| Timeline-Marker wählen | `timeline` |
| Scrubber bewegen | `timeline` |
| Play drücken | `timeline` |
| Reset drücken | `timeline` bei Playhead 0 |
| direkt auf eine SVG-ID klicken | `timeline` |

Direkter SVG-Klick selektiert exakt die geklickte ID. Bei einer Kind-ID, die
kein eigenes Animationstarget ist, kann die Preview daher das Kind markieren,
während die Animationsformularauswahl weiterhin auf das nächste gültige
Editorziel zurückfällt. Im Struktur-Tab ist eine Kind-ID dagegen eine gültige
Inspektionsauswahl.

## 20. SVG Im Browser Laden Und Hydrieren

### 20.1 Assetabruf

Das SVG wird als Text über eine vom Server erzeugte Asset-URL geladen. Der
Text kann pro URL im Browser gecacht werden.

### 20.2 Parsing Und Bereinigung

Beim Einsetzen in die Preview:

1. mit `DOMParser(..., "image/svg+xml")` parsen;
2. Root-`svg` prüfen;
3. alle `script`- und `foreignObject`-Nodes entfernen;
4. `width` und `height` vom Root entfernen;
5. Klasse `svg-inspector-inline` setzen;
6. fehlendes `preserveAspectRatio` auf `xMidYMid meet` setzen;
7. alle `hiddenIds`-Elemente vor weiterer Verarbeitung aus dem DOM entfernen;
8. als importierten DOM-Node in den aktuellen Dokumentkontext einsetzen.

Der finale Remotion-Lader entfernt aktuell `script`, aber nicht
`foreignObject`. Für eine neue Portierung wird empfohlen, beide Pfade auf
dieselbe strengere Sanitization zu bringen.

### 20.3 Race-Schutz

Ein asynchron geladenes SVG darf nur eingesetzt werden, wenn der Container
noch verbunden ist und seine folgenden Datenattribute unverändert sind:

- SVG-URL;
- selektiertes Target;
- Hidden-ID-Liste;
- Show-all-Modus;
- im Timelinemodus zusätzlich Playhead und Step-JSON.

So überschreibt ein alter Fetch keine neuere Auswahl.

### 20.4 Auswahlmarkierung

Für das gewählte Target:

- Target-ID selbst markieren;
- alle ID-tragenden Nachfahren markieren;
- alle ID-tragenden Vorfahren als aktiv behandeln;
- alle SVG-Nodes mit ID klickbar machen.

Die sichtbare Auswahl verwendet:

```css
.svg-inspector-target.selected {
  filter:
    drop-shadow(0 0 7px rgba(249, 115, 22, 0.95))
    drop-shadow(0 0 16px rgba(249, 115, 22, 0.46));
}
```

Die Auswahl darf die Opacity des Elements nicht verändern.

## 21. Browser-Mock-Rendering Der Aktionen

Für jeden Renderzyklus wird ein frisch geparstes beziehungsweise importiertes
SVG benutzt. Dadurch müssen temporäre Highlightfarben nach Ende nicht manuell
zurückgesetzt werden.

### 21.1 Vorinitialisierung

Sortiere Steps nach `mockSec`. Für jedes Target:

- ist seine erste Sichtbarkeitsaktion `show` oder `draw`, setze es initial auf
  Opacity 0.

### 21.2 Progress

```ts
progress = clamp(
  (playhead - startSec) / Math.max(0.001, durSec),
  0,
  1
);
```

### 21.3 Show

Vor Start keine weitere Mutation. Ab Start:

```text
opacity = progress
translateY = (1 - progress) * fromY
```

Ein vorhandenes SVG-`transform`-Attribut wird hinter das temporäre
`translate(0 y)` gesetzt und nach Ende wieder unverändert verwendet.

### 21.4 Hide

Vor Start keine Mutation. Ab Start:

```text
opacity = 1 - progress
translateY = progress * toY
```

### 21.5 Highlight

Nur im Intervall `start <= playhead <= start + duration`:

- Klasse `svg-preview-highlight` setzen;
- `fill`, `stroke` und `stroke-width` auf Target und relevante Nachfahren
  anwenden, falls Werte vorhanden sind.

Da das SVG pro Render frisch aufgebaut wird, ist außerhalb des Intervalls
automatisch wieder der Originalzustand sichtbar.

### 21.6 Draw

Browser-Mock:

- Target bei Progress 0 unsichtbar, danach sichtbar;
- Geometrien des Targets und seiner Nachfahren suchen;
- `getTotalLength()` verwenden;
- `strokeDasharray = length`;
- `strokeDashoffset = length * (1 - progress)`;
- ohne messbare Länge Opacity als Fallback verwenden.

Wichtige aktuelle Abweichung: Die einfache In-App-Browserpreview verwendet
für `drawStyle: "reveal"` ebenfalls diese Stroke-Näherung. Die temporäre
Remotion-Studio-Preview und der finale Renderer verwenden dagegen die echte
Clip-Path-Reveal-Logik. Wer absolute Previewtreue benötigt, sollte die
Clip-Path-Implementierung auch in die In-App-Preview übernehmen.

### 21.7 Transform

```text
x = lerp(fromTranslateX, translateX, progress)
y = lerp(fromTranslateY, translateY, progress)
scale = lerp(fromScale, scale, progress)
```

Danach:

```css
transform-box: fill-box;
transform-origin: <transformOrigin oder center>;
transform: translate(<x>px, <y>px) scale(<scale>);
```

Das Target bleibt nach Ende in der Zieltransformation.

### 21.8 Aktiver Aktions-Glow

Während eines laufenden Aktionsintervalls erhält das Target:

| Aktion | Glow |
| --- | --- |
| `show` | Grün |
| `hide` | Amber |
| `draw` | Blau |
| `highlight` | Violett |
| `transform` | Cyan |

## 22. Speichern Und API

### 22.1 Kombinierter Speicherablauf

Der Vollbildbutton `Speichern` führt genau diese Reihenfolge aus:

1. aktuellen Szenendraft inklusive bearbeitetem `spokenTextDraft` speichern;
2. bei Fehler abbrechen;
3. neuesten Szenenzustand aus dem Clientstate lesen;
4. aktives SVG-Manifest speichern.

Diese Reihenfolge verhindert, dass ein Manifest erfolgreich gespeichert wird,
obwohl sein `sourceText` nur gegen einen noch nicht persistierten
Sprechertext matcht.

### 22.2 Speicherzustände

Szenendraft und Manifest haben intern getrennte Meldungen. Der Header bildet
sie so zusammen:

1. irgendein Fehler -> Fehlermeldung und `error`;
2. irgendein `Speichere...` -> `Speichere...`;
3. irgendein `Ungespeichert` -> `Ungespeichert`;
4. irgendein erfolgreicher Zustand -> `Gespeichert`;
5. sonst leer.

### 22.3 Asset-Endpunkt

```http
GET /api/asset?path=<url-encoded-relative-path>
```

Serverregeln:

- Pfad gegen Review-Root auflösen;
- Traversal außerhalb des Roots ablehnen;
- fehlende Datei mit 404 beantworten;
- korrekten MIME-Type senden;
- Datei binär ausliefern.

### 22.4 Manifest-Endpunkt

```http
POST /api/svg-animation-manifest
Content-Type: application/json
```

Request:

```json
{
  "sceneFilePath": "modul/scenes/scene-04/scene.storyboard.v1.json",
  "svgPath": "assets/diagram.svg",
  "manifestPath": "assets/diagram.animation.v1.json",
  "manifest": {
    "schemaVersion": "svgAnimationManifest/v1",
    "svgPath": "assets/diagram.svg",
    "targets": [],
    "steps": []
  }
}
```

Erfolgsresponse:

```json
{
  "ok": true,
  "svgAnimation": {
    "svgPath": "assets/diagram.svg",
    "manifestPath": "assets/diagram.animation.v1.json",
    "assetUrl": "/api/asset?path=...",
    "manifest": {},
    "inventory": [],
    "issues": [],
    "exists": true
  }
}
```

### 22.5 Serverseitiger Ablauf

1. Payloadform prüfen.
2. `sceneFilePath` gegen Review-Root auflösen.
3. Szene muss existieren und im Root liegen.
4. `svgPath` normalisieren und lokale `.svg`-Datei verlangen.
5. SVG muss existieren und im Review-Root liegen.
6. `manifestPath` verwenden oder aus `svgPath` ableiten.
7. Manifestpfad gegen erlaubten Bereich prüfen.
8. SVG erneut lesen.
9. Inventar erneut extrahieren.
10. Payloadmanifest strikt validieren und `svgPath` serverseitig überschreiben.
11. Manifest erneut synchronisieren.
12. Verzeichnis anlegen.
13. formatiertes JSON mit zwei Leerzeichen und abschließendem Newline schreiben.
14. SVG-Editorobjekt neu laden und zurückgeben.

Die aktuelle Referenz begrenzt Requestbodies auf 2.000.000 Zeichen.

Die aktuelle Implementierung erlaubt Manifestpfade innerhalb des gesamten
Review-Roots. Für eine neue Portierung ist die sicherere Regel:

```text
Manifest und SVG müssen innerhalb des konkreten Szenenordners liegen.
```

Idealerweise wird atomar über temporäre Datei plus Rename geschrieben. Die
Referenz schreibt aktuell synchron direkt in die Zieldatei.

### 22.6 Client Nach Erfolgreichem Speichern

- das zurückgelieferte SVG-Editorobjekt in die Szene einsetzen;
- passenden Eintrag über `svgPath` oder `manifestPath` ersetzen;
- lokalen Manifestdraft löschen;
- aktives SVG auf die gespeicherte `svgPath` setzen;
- `Manifest gespeichert.` mit Tone `ok` anzeigen;
- neu rendern.

Bei Fehler bleibt der Draft erhalten.

## 23. Temporäre Remotion-Studio-Preview

Für `svgDiagram`, `imageSlide` und `mediaAsideSlide` erzeugt der Reviewer eine
temporäre Kopie des Slide-Objekts.

Nur wenn der aktive SVG-Pfad zum Medienpfad des Slides passt:

1. Mock-Timeline berechnen;
2. Steps in Remotion-Draftsteps umwandeln;
3. `targetId -> id`;
4. `mockSec -> atSec`;
5. Aktionsparameter und Manifestdefaults übernehmen;
6. strukturelle Ausschlüsse als `content.hiddenIds` schreiben;
7. Steps als `content.draftAnimationSteps` schreiben.

Beispiel:

```json
{
  "draftAnimationSteps": [
    {
      "id": "block_b",
      "action": "show",
      "atSec": 0,
      "enterFrames": 12
    },
    {
      "id": "block_a",
      "action": "show",
      "atSec": 0.5,
      "enterFrames": 12
    }
  ],
  "hiddenIds": ["export_helper_grid"]
}
```

Diese Felder werden ausschließlich in den Preview-Payload geschrieben. Sie
ändern weder Szenen-JSON noch Manifest.

## 24. Promotion In Finale Authoring-Daten

### 24.1 Grundregel

Das Review-Manifest darf nach Promotion nicht zur heimlichen zweiten
Produktionsquelle werden. Promotion liest es einmal, erzeugt finale
Authoring-Schritte und schreibt diese in das finale Lesson-Dokument.

Spätere Änderungen an der Sidecar-Datei dürfen ein bereits finalisiertes
Authoring-Dokument nicht still überschreiben.

### 24.2 Manifest Laden

Promotion verarbeitet nur:

- lokale SVG-Pfade;
- vorhandene Manifestdateien;
- Dateien innerhalb des Szenenordners;
- valide `svgAnimationManifest/v1`-Daten.

Ablauf:

1. Manifestpfad aus explizitem Feld oder SVG-Pfad ableiten.
2. Pfad gegen Szenenordner prüfen.
3. SVG und Manifest müssen existieren.
4. Manifest strikt validieren.
5. SVG-Inventar neu extrahieren.
6. Manifest mit Inventar synchronisieren.
7. alle Issues als Promotion-Warnungen protokollieren.

Ein fehlendes Manifest ist zulässig. Dann kann ein älterer
`draftAnimationSteps`-Fallback verarbeitet werden. Für die gewünschte
Portierung ist das Manifest der bevorzugte Weg.

### 24.3 Targetfilter

`hiddenIds` entstehen aus:

```ts
manifest.targets
  .filter(target => target.render === false)
  .map(target => target.targetId);
```

Ein Step wird übersprungen, wenn:

- sein Target `render: false` ist;
- sein Target `ignored` oder `notAnimated` ist;
- sein Target `orphaned` ist;
- `sourceText` fehlt oder nicht im gesprochenen Text matcht.

Ein Target mit `needsReview` wird aktuell mit Warnung übernommen.

Target- oder Step-Confidence `low` erzeugt eine Warnung, blockiert die
Promotion aber nicht.

Wenn ein Step-Target nicht in `targets[]` steht, erzeugt die Vorprüfung eine
Warnung. Die aktuelle Promotion kann den Step trotzdem übernehmen, sofern ID
und `sourceText` anderweitig gültig sind. Eine strengere Zielportierung darf
solche Steps blockieren; dann muss die Abweichung bewusst dokumentiert werden.

### 24.4 SourceText Bei Promotion

Promotion tokenisiert wie der Editor.

- Kein Treffer: Step überspringen.
- Genau ein Treffer: `sourceText` übernehmen.
- Mehrere Treffer ohne `occurrence`:
  - Warnung aus der Issue-Prüfung;
  - aktuelle Referenz schreibt `occurrence: 1`.
- Positive `occurrence` wird übernommen.
- Die finale Authoring-Validierung prüft, ob `occurrence` tatsächlich innerhalb
  der Trefferzahl liegt.

### 24.5 Feldmapping

Review-Metadaten werden nicht in die finalen Steps geschrieben:

```text
stepId
confidence
notes
Target-Label
Target-Status
```

Finales `show`:

```json
{
  "id": "diagram_root",
  "action": "show",
  "sourceText": "Das Diagramm erscheint",
  "enterFrames": 14,
  "fromY": 18
}
```

Finales `hide`:

```json
{
  "id": "diagram_root",
  "action": "hide",
  "sourceText": "Das Diagramm verschwindet",
  "exitFrames": 14,
  "toY": -18
}
```

Finales `highlight`:

```json
{
  "id": "diagram_root",
  "action": "highlight",
  "sourceText": "besonders wichtig",
  "durFrames": 24,
  "fill": "#e3f3f8",
  "stroke": "#007ea7",
  "strokeWidth": 4
}
```

Finales `draw`:

```json
{
  "id": "connector",
  "action": "draw",
  "sourceText": "die Verbindung",
  "durFrames": 36,
  "drawStyle": "reveal",
  "direction": "leftToRight"
}
```

Finales `transform`:

```json
{
  "id": "diagram_root",
  "action": "transform",
  "sourceText": "rückt das Diagramm zur Seite",
  "durFrames": 30,
  "fromTranslateX": 0,
  "fromTranslateY": 0,
  "fromScale": 1,
  "translateX": -116,
  "translateY": -18,
  "scale": 0.76,
  "transformOrigin": "center"
}
```

### 24.6 Promotionsdefaults

| Wert | Reihenfolge |
| --- | --- |
| Show | Step, `defaults.enterFrames`, 16 |
| Hide | Step, `defaults.exitFrames`, 16 |
| Highlight | Step, `defaults.highlightDurFrames`, 30 |
| Draw | Step, `defaults.drawDurFrames`, 36 |
| Transform | Step, `defaults.transformDurFrames`, 30 |

Auf dem finalen SVG-Block werden zusätzlich gespeichert:

```json
{
  "defaultEnterFrames": 16,
  "defaultHighlightDurFrames": 30,
  "defaultDrawDurFrames": 36
}
```

### 24.7 Template-Mapping

`svgDiagram`:

- SVG wird in den finalen Lesson-Assetordner kopiert.
- Mit mindestens einem finalen Step bleibt die Szene `svgDiagram`.
- `hiddenIds` werden auf `content.hiddenIds` geschrieben.
- Ohne finalen Step fällt die Referenz auf einen Bildblock zurück, weil das
  finale `svgDiagram`-Schema mindestens einen Step verlangt.

`imageSlide` und `mediaAsideSlide`:

- SVG-Animation liegt im finalen Imageblock unter `image.svg` oder `media.svg`.
- Ein Imageblock darf nur `hiddenIds` ohne Steps enthalten.

Top-Level-`visuals[]`:

- gleiches Manifestmapping in den SVG-Unterblock des Visuals.

## 25. Finaler Authoring-Vertrag

### 25.1 Beispiel `svgDiagram`

```json
{
  "sceneId": "scene-04",
  "type": "svgDiagram",
  "spokenText": "Zuerst erscheint der Sensor. Danach zeichnen wir die Verbindung.",
  "content": {
    "title": "Signalfluss",
    "svgPath": "assets/scene-04/diagram.svg",
    "hiddenIds": ["export_helper_grid"],
    "defaultEnterFrames": 16,
    "defaultHighlightDurFrames": 30,
    "defaultDrawDurFrames": 36,
    "steps": [
      {
        "id": "sensor",
        "action": "show",
        "sourceText": "erscheint der Sensor",
        "enterFrames": 14
      },
      {
        "id": "connector",
        "action": "draw",
        "sourceText": "zeichnen wir die Verbindung",
        "durFrames": 36,
        "drawStyle": "stroke"
      }
    ]
  }
}
```

### 25.2 Finale Pflichtregeln

- Jeder finale Step hat `id`, `action` und `sourceText`.
- Aktionsdauer ist im finalen Authoring explizit positiv.
- Mehrdeutige Trigger benötigen `occurrence`.
- `hiddenIds` enthält nur nicht leere IDs.
- `svgDiagram.content.steps` enthält mindestens einen Step.
- Ein Image-SVG-Unterblock benötigt mindestens Steps oder `hiddenIds`.
- SVG-Unterblöcke sind nur bei SVG-Medien zulässig.

## 26. Deterministische Timingkette

### 26.1 Authoringvalidierung

Vor TTS beziehungsweise Compile:

1. `spokenText` in normalisierte Tokens zerlegen.
2. jeden `sourceText`-Anker innerhalb derselben Szene suchen;
3. keinen Treffer als Fehler melden;
4. mehrere Treffer ohne `occurrence` als Fehler melden;
5. `occurrence > Trefferzahl` als Fehler melden;
6. lokale SVG-Datei auflösen;
7. alle Step-IDs und `hiddenIds` gegen die SVG-ID-Menge prüfen.

SVG-ID-Validierung gilt für:

- `svgDiagram`;
- SVGs in Image-/Media-Blöcken;
- SVGs in Contentblöcken;
- Top-Level-`visuals[]`.

Externe URLs sowie `data:` und `blob:` werden bei lokaler ID-Prüfung
übersprungen.

### 26.2 Compile Zu Regie

Der Compiler:

1. findet den Wortbereich der Szene in `lesson.words.json`;
2. sucht `sourceText` nur innerhalb dieses Szenenwortbereichs;
3. wählt bei `occurrence` den 1-basierten Treffer;
4. schreibt den Startwortindex als `atWordIndex`;
5. entfernt `sourceText` aus der abgeleiteten Regieform.

Beispiel:

```json
{
  "id": "sensor",
  "action": "show",
  "atWordIndex": 143,
  "enterFrames": 14
}
```

### 26.3 Resolve Zu Framewerten

Für den Szenenausschnitt:

```text
clipStartFrame = round(startWord.startSeconds * fps)
absoluteFrame  = round(triggerWord.startSeconds * fps)
relativeFrame  = absoluteFrame - clipStartFrame
atFrame        = audioOffsetFrames + relativeFrame
atSec          = roundTo3Decimals(atFrame / fps)
```

Ein Trigger außerhalb der Szenendauer ist ein Fehler.

Resolved-Beispiel:

```json
{
  "id": "sensor",
  "action": "show",
  "atFrame": 87,
  "atSec": 2.9,
  "enterFrames": 14,
  "enterSec": 0.467
}
```

Erst diese Werte sind die Produktionszeit. Änderungen an TTS-Länge dürfen
`atFrame` verändern, ohne den fachlichen `sourceText`-Anker zu verändern.

## 27. Finales SVG-Rendering Pro Frame

### 27.1 Laden

Der Referenzrenderer:

- löst lokale Pfade über die statische Remotion-Assetfunktion auf;
- erlaubt alternativ `http(s)`, `data:` und `blob:`;
- lädt den SVG-Text;
- parst mit `DOMParser`;
- lehnt Parserfehler und Nicht-SVG-Roots ab;
- setzt Rootbreite und -höhe auf 100 Prozent;
- setzt fehlendes `preserveAspectRatio` auf `xMidYMid meet`;
- entfernt `script`.

### 27.2 Pro Frame Klonen

`applySvgSteps` klont das Basis-SVG bei jedem Frame. Das Original bleibt
unverändert. Danach:

1. Root auf volle Größe setzen;
2. optionales `preserveAspectRatio` setzen;
3. alle eindeutigen `hiddenIds` aus dem Klon entfernen;
4. Steps nach Startframe und ursprünglicher Reihenfolge sortieren;
5. Default-Paints vorbereiten;
6. Sichtbarkeitsstart setzen;
7. alle Steps bis zum aktuellen Frame anwenden;
8. DOM mit `XMLSerializer` serialisieren.

### 27.3 Paintziele

Default-Fill, Default-Stroke und Highlight-Paints werden nur auf diese Tags
angewendet:

```text
path, rect, circle, ellipse, line, polyline, polygon
```

`text`, `tspan` und `textPath` werden ausdrücklich nicht übermalt. Bei einem
Gruppentarget werden nur passende Shape-Nachfahren verändert.

### 27.4 Initiale Sichtbarkeit

Für jede in Steps adressierte ID:

- ist die erste `show`/`hide`-Sichtbarkeitsaktion ein `show`, startet das
  Element mit Opacity 0;
- bei erster `hide`-Aktion bleibt es initial sichtbar;
- `draw` berechnet auch vor Start Progress 0 und versteckt dadurch seine
  Geometrie beziehungsweise Reveal-Fläche.

### 27.5 Finale Show-/Hide-Formeln

`show`:

```text
progress = clamp((frame - start) / enterFrames)
opacity = progress
translateY = (1 - progress) * fromY
```

`hide`:

```text
progress = clamp((frame - start) / exitFrames)
opacity = 1 - progress
translateY = progress * toY
```

Vor dem jeweiligen Start wird keine Stepmutation angewendet.

### 27.6 Finales Highlight

Nur zwischen Start und Ende:

```text
progress = clamp((frame - start) / durFrames)
pulse = 1 + 0.08 * sin(progress * PI * 6)
```

- optionale Fill-/Stroke-Werte werden gesetzt;
- explizite `strokeWidth` wird mit dem Puls multipliziert;
- ohne explizite Breite wird eine vorhandene positive Stroke-Breite gepulst.

Da jedes Frame aus einem frischen Klon entsteht, endet das Highlight ohne
separate Restorelogik.

### 27.7 Finales Stroke-Draw

Für Target und messbare Shape-Nachfahren:

1. `getTotalLength()` ermitteln;
2. wenn Stroke fehlt:
   - bei sichtbarem Fill diesen als Fallback-Stroke verwenden;
   - sonst `defaultStroke` verwenden;
3. fehlende Stroke-Breite auf `defaultStrokeWidth` setzen;
4. `stroke-dasharray = length`;
5. `stroke-dashoffset = length * (1 - progress)`;
6. bei gefüllten Shapes Fill erst in den letzten 18 Prozent einblenden:

```text
fillProgress = clamp((progress - 0.82) / 0.18)
fillOpacity = originalFillOpacity * fillProgress
```

### 27.8 Finales Reveal-Draw

Für `drawStyle: "reveal"`:

- dynamischen `clipPath` in `defs` erzeugen;
- `clipPathUnits="objectBoundingBox"`;
- Rechteck abhängig von Richtung und Progress dimensionieren;
- Clip auf Target setzen;
- bei Progress 0 Opacity 0, danach 1.

Richtungsformeln:

| Richtung | Rechteck |
| --- | --- |
| `leftToRight` | `x=0, width=progress` |
| `rightToLeft` | `x=1-progress, width=progress` |
| `topToBottom` | `y=0, height=progress` |
| `bottomToTop` | `y=1-progress, height=progress` |

### 27.9 Finales Transform

Linear interpolieren und über CSS auf dem Target setzen:

```text
translateX = fromX + (toX - fromX) * progress
translateY = fromY + (toY - fromY) * progress
scale      = fromScale + (toScale - fromScale) * progress
```

Nach Ende bleibt Progress 1 und damit der Zielzustand erhalten.

### 27.10 Fehlende IDs

- Eine fehlende Step-ID erzeugt eine Warnung.
- Pro SVG-/Stepzustand soll dieselbe ID nur einmal geloggt werden.
- Der Render läuft weiter, sofern die vorgelagerte Authoringvalidierung nicht
  bereits blockiert hat.

## 28. Validierungs- Und Issuekatalog

### 28.1 Blockierende Schemafehler

- falsche `schemaVersion`;
- unbekannte Root-/Target-/Stepfelder bei striktem Schema;
- leerer `svgPath` oder `targetId`;
- unbekannter Status, Confidencewert oder Aktion;
- nicht positive Dauer;
- negative Stroke-Breite;
- nicht positive Skalierung;
- ungültige `occurrence`;
- falsche Drawrichtung;
- externer oder nicht auflösbarer lokaler SVG-Pfad beim Speichern;
- Pfad außerhalb des erlaubten Roots.

### 28.2 Nicht Blockierende Review-Issues

Targetebene:

- Manifesttarget fehlt im SVG;
- sichtbares Target ist `needsReview`;
- sichtbares Target hat Confidence `low`;
- Client zusätzlich: Target ist `animated`, hat aber keinen Step.

Stepebene:

- Target fehlt in `targets[]`;
- Target ist `notAnimated` oder `ignored`;
- Target ist `orphaned`;
- Target-ID fehlt im SVG;
- `sourceText` fehlt;
- `sourceText` hat keinen Treffer;
- `sourceText` ist ohne `occurrence` mehrdeutig;
- Step-Confidence ist `low`.

Steps auf strukturell nicht gerenderten Targets werden bei der Issueprüfung
ignoriert, weil sie nicht in Produktion gelangen.

### 28.3 Severity

- `error`: technisch nicht speicher- oder verarbeitbar;
- `warning`: Promotion oder fachliches Timing gefährdet;
- `info`: Reviewentscheidung oder Confidence offen.

Der kompakte normale Szeneneditor zeigt höchstens drei Issues plus
`<n> weitere Hinweise im Animationsmodus`. Der Vollbildmodus zeigt die
vollständigen Zähler und problembezogenen Chips.

## 29. Sicherheitsvertrag

Mindestens umzusetzen:

- Pfade immer serverseitig normalisieren und gegen einen festen Root prüfen.
- Keine vom Client gelieferten absoluten Pfade akzeptieren.
- SVG- und Manifestpfad innerhalb des Szenenordners halten.
- Requestgröße begrenzen.
- MIME-Type korrekt setzen.
- SVG vor Inline-Einsatz sanitizen.
- Mindestens `script`, `foreignObject`, Eventhandlerattribute wie `onload` und
  gefährliche externe Referenzen prüfen beziehungsweise entfernen.
- Keine Skripte aus SVG ausführen.
- Kein `innerHTML` mit ungeprüftem Manifesttext.
- Alle UI-Texte und IDs beim HTML-Rendering escapen.
- CSS-Selektoren für IDs mit `CSS.escape` oder sicherem Attributselektor
  erzeugen.
- Manifest serverseitig erneut validieren; nie Clientvalidierung vertrauen.
- Schreiben möglichst atomar durchführen.

Die Referenz entfernt im Browser `script` und `foreignObject`, im finalen
Lader `script`. Eine neue Portierung sollte einen gemeinsamen Sanitizer
verwenden und die strengere Variante auf beide Pfade anwenden.

## 30. Empfohlener Implementierungsplan Im Zielrepository

### Phase A: Domain Und Persistenz

1. Manifesttypen und striktes Schema implementieren.
2. Inventarparser implementieren.
3. Sync-Funktion implementieren.
4. Issue-Sammlung und `sourceText`-Matching implementieren.
5. sicheren Asset-GET-Endpunkt implementieren.
6. sicheren Manifest-POST-Endpunkt implementieren.

Abnahme: Domain-Unit-Tests sind grün, bevor UI gebaut wird.

### Phase B: Struktur-Editor

1. Vollbild-Shell und SVG-Stage bauen.
2. SVG laden, sanitizen und inline anzeigen.
3. Inventarbaum rendern.
4. Auswahl und Collapsezustand bauen.
5. `Animation`-Schalter bauen.
6. `Sichtbar`-Schalter und Parentvererbung bauen.
7. Sammelaktionen bauen.
8. strukturelle Ausschlüsse in Preview anwenden.

Abnahme: Parent-/Child-Vererbung und Step-Löschung bei `render: false` sind
durch Tests abgesichert.

### Phase C: Animation-Editor

1. Targetleiste und Statusformular bauen.
2. Triggerliste und aktives Triggerformular bauen.
3. alle fünf Aktionen und Felddefaults bauen.
4. Add, Actionwechsel und Delete bauen.
5. Contenteditable-Sprechertext und Auswahlübernahme bauen.
6. Matching, Markierungen und Issues bauen.

### Phase D: Mock-Preview

1. Timeline sortieren.
2. Marker und Scrubber bauen.
3. `inspect` und `timeline` trennen.
4. Browseraktionen implementieren.
5. Play, Pause und Reset bauen.
6. optional Remotion-/Renderer-Livepreview anbinden.

### Phase E: Produktion

1. Promotion implementieren.
2. finales Authoringschema erweitern.
3. `sourceText -> atWordIndex` kompilieren.
4. Wortzeit -> Frame auflösen.
5. finalen SVG-Frame-Renderer implementieren.
6. lokale SVG-ID-Validierung implementieren.
7. End-to-End-Tests mit einer echten Szene schreiben.

## 31. Empfohlene Ziel-Dateistruktur

Frameworkneutral:

```text
src/
  svg-animation/
    manifest-schema.ts
    inventory.ts
    sync.ts
    matching.ts
    issues.ts
    preview.ts
    promotion.ts
    renderer.ts
  ui/
    SvgAnimationMode.*
    SvgStructureTab.*
    SvgAnimationTab.*
    SvgTimeline.*
server/
  svg-assets.*
  svg-manifests.*
tests/
  svg-manifest.*
  svg-structure-ui.*
  svg-animation-ui.*
  svg-promotion.*
  svg-renderer.*
```

Bei React sollte der Domaincode unabhängig von Komponenten bleiben. Bei
Next.js dürfen Serverpfade und Dateizugriffe nicht in Clientcomponents landen.

## 32. Regressionstest-Matrix

### 32.1 Inventar

- relevante Tags werden gefunden;
- `title`- und `defs`-IDs werden nicht als Targets aufgenommen;
- Labelpriorität stimmt;
- `parentTargetId` stimmt über verschachtelte Gruppen;
- `data-anim-target` wird erkannt;
- XML-Entities werden dekodiert;
- doppelte IDs werden gemeldet.

### 32.2 Sync

- öffentlicher Parent deckt Kinder ab;
- unmarkierte freie Gruppe bleibt inventarisierbar;
- bestehende Entscheidungen bleiben erhalten;
- neue IDs werden `needsReview`;
- entfernte IDs werden `orphaned`;
- versteckter Editor-Parent deckt Kinder ab;
- nicht gerenderter Parent deckt Kinder ab;
- Step-Target bleibt öffentlich;
- Step auf vollständig fehlender ID erzeugt `orphaned`.

### 32.3 Struktur

- Baum zeigt technische IDs und Hierarchie;
- Collapse pro Gruppe und Sammelcollapse funktionieren;
- Step-Target kann nicht aus Animation entfernt werden;
- `visibleInEditor: false` entfernt Target aus der Animationsliste;
- `render: false` entfernt Target aus Preview und Animationsliste;
- Parentausschluss blendet Kinder aus;
- Ausschluss löscht Steps von Target und Nachfahren;
- Wiedereinblenden entfernt `render`;
- `Alle animieren` ignoriert strukturell versteckte IDs;
- `Keine animieren` bewahrt IDs mit Steps;
- `Alle anzeigen/ausblenden` funktioniert.

### 32.4 Textmatching

- Teilwortauswahl wird auf ganze Wörter erweitert;
- Umlaute und Umschriften matchen;
- Diakritika werden robust behandelt;
- Satzzeichen stören nicht;
- kein Match erzeugt Warnung;
- Mehrfachmatch ohne `occurrence` erzeugt Warnung;
- gültige `occurrence` wählt richtigen Bereich;
- zu große `occurrence` wird final blockiert;
- letzte Auswahl gilt nur für dieselbe Szene.

### 32.5 Timeline

- Sprachreihenfolge schlägt Manifestreihenfolge;
- gleicher Wortindex bewahrt Stepreihenfolge;
- nicht matchende Steps stehen am Ende;
- Abstand ist 0,5 Sekunden;
- leere Timeline dauert 0,5 Sekunden;
- Marker setzt Step und Playhead;
- Scrubber wechselt in `timeline`;
- Targetauswahl wechselt in `inspect`;
- Play stoppt am Ende.

### 32.6 Aktionen

- Show startet unsichtbar und hält sichtbar;
- Hide startet sichtbar und hält unsichtbar;
- Highlight endet ohne dauerhafte Paintänderung;
- Stroke-Draw behandelt Einzelshape und Gruppe;
- gefülltes Stroke-Draw blendet Fill erst am Ende ein;
- Reveal funktioniert in vier Richtungen;
- Transform interpoliert und hält Zielzustand;
- Paintänderungen überschreiben keinen Text in Gruppen;
- fehlende ID warnt nur einmal.

### 32.7 Speichern

- Szene wird vor Manifest gespeichert;
- Szenenfehler verhindert Manifestrequest;
- Server überschreibt Manifest-`svgPath` mit Request-`svgPath`;
- Server scannt SVG erneut;
- Server synchronisiert erneut;
- Pfadtraversal wird abgelehnt;
- ungültiges Schema wird abgelehnt;
- Draft bleibt bei Fehler erhalten;
- erfolgreicher Response ersetzt den Szeneneintrag.

### 32.8 Promotion

- `render: false` wird `hiddenIds`;
- `notAnimated`-/`ignored`-Steps werden übersprungen;
- `orphaned`-Steps werden übersprungen;
- nicht matchende Steps werden übersprungen;
- `needsReview` und `low` erzeugen Warnungen;
- alle fünf Aktionen werden korrekt gemappt;
- Defaults stimmen;
- Reviewmetadaten erscheinen nicht im finalen Step;
- finale Steps enthalten kein `atSec`;
- Asset wird kopiert;
- SVG-ID- und `sourceText`-Validierung bestehen.

### 32.9 End-To-End

Fixture:

```text
spokenText:
"Zuerst erscheint Block B. Danach folgt Block A."

Manifestreihenfolge:
1. Block A -> "Block A"
2. Block B -> "Block B"

Erwartete Mock-Timeline:
1. Block B bei 0,0 s
2. Block A bei 0,5 s
```

Danach Promotion, künstliche Wortzeiten, Resolve und Render prüfen.

## 33. Definition Of Done Für Die Portierung

- [ ] Der Editor öffnet nur für Szenen mit erkanntem SVG.
- [ ] Mehrere SVGs können getrennt gewählt werden.
- [ ] Das Manifest kann fehlen und wird als leerer Draft erzeugt.
- [ ] Inventar, Sync und Issues sind server- und clientseitig konsistent.
- [ ] Der Strukturbaum trennt Editor- von Rendersichtbarkeit.
- [ ] Parent-/Child-Vererbung funktioniert.
- [ ] Alle fünf Aktionen sind editierbar.
- [ ] SourceText-Auswahl arbeitet mit vollständigen Unicode-Wörtern.
- [ ] Die Timeline folgt der Sprechertextreihenfolge.
- [ ] `inspect` und `timeline` sind sichtbar unterscheidbar.
- [ ] Strukturell ausgeblendete IDs fehlen in beiden Previewmodi.
- [ ] Szene und Manifest werden in richtiger Reihenfolge gespeichert.
- [ ] Promotion schreibt finale Steps und `hiddenIds`.
- [ ] Finale Validierung prüft Textanker und SVG-IDs.
- [ ] Worttimings werden erst nach TTS in Frames aufgelöst.
- [ ] Der finale Renderer setzt alle Aktionen framegenau um.
- [ ] Domain-, UI-, Promotions- und Renderregressionen sind grün.

## 34. Bewusste Grenzen Des Aktuellen Stands

- V1 bearbeitet nur SVG-interne IDs. Template-Bullets, Textblöcke oder andere
  Nicht-SVG-Elemente brauchen später eigene Targetadapter.
- Die In-App-Timeline hat vor TTS keine echte Sprechzeit.
- Die In-App-Draw-Preview approximiert `reveal` als Stroke-Draw.
- Die In-App-Highlight-Preview kann Paint breiter auf Nachfahren anwenden als
  der finale Renderer; der finale Renderer schützt Texte explizit.
- Der aktuelle Inventarparser ist regex-/stackbasiert und keine vollständige
  XML-Schemavalidierung.
- Externe SVG-URLs werden nicht lokal auf IDs geprüft.
- `ignored` bleibt nur als Legacywert erhalten.
- Status und Steps dürfen vorübergehend widersprüchlich sein; Issues machen
  dies sichtbar.
- `stepId` ist aktuell nicht schemaweit eindeutig.
- Trigger können nicht manuell per Drag-and-drop umsortiert werden; ihre
  Reihenfolge folgt `sourceText`.
- Es gibt keinen Undo-Stack im Manifesteditor.
- Die Sidecar-Datei ist nach Promotion nicht die finale Zeitquelle.

## 35. Häufige Fehler Bei Einer Portierung

### Fehler: `visibleInEditor` und `render` als dasselbe behandeln

Folge: statische Kinder verschwinden aus dem Video, obwohl sie nur vom
Parent-Target erben sollten.

### Fehler: Mock-Sekunden in finale Daten schreiben

Folge: Animation driftet bei neuem TTS.

### Fehler: Kinder eines öffentlichen Parents automatisch einzeln zeigen

Folge: unbedienbare Listen mit Hunderten Shape-IDs.

### Fehler: Steps beim SVG-Rescan verlieren

Folge: externe SVG-Änderung zerstört redaktionelle Entscheidungen.

### Fehler: `render: false` nur in der Browserpreview anwenden

Folge: Hilfslinien tauchen im finalen Video wieder auf.

### Fehler: `sourceText` als einfachen Substring matchen

Folge: Satzzeichen, Umlaute und Wortgrenzen führen zu falschem Timing.

### Fehler: Szene und Manifest unabhängig speichern

Folge: Manifestvalidierung läuft gegen alten Sprechertext.

### Fehler: SVG direkt ungeprüft mit `innerHTML` einsetzen

Folge: Sicherheitsrisiko durch aktive SVG-Inhalte.

## 36. Fertiger Auftrag Für Einen Codex-Agenten Im Zielrepository

Der folgende Prompt kann zusammen mit ausschließlich dieser Datei verwendet
werden:

```text
Implementiere im aktuellen Repository die SVG-Struktur- und
Animationsbearbeitung gemäß "svg-animation-editor-handoff.md".

Behandle das vorhandene Repository als Zielsystem und passe Framework,
Dateipfade und Namenskonventionen daran an. Bewahre aber alle im Dokument
genannten Verhaltensinvarianten:

- getrennte SVG-Struktur- und Animationstabs,
- getrennte visibleInEditor- und render-Entscheidungen,
- sourceText-basierte Trigger,
- inspect-/timeline-Preview,
- fünf Aktionen,
- sichere Manifestpersistenz,
- Promotion in finale Authoring-Daten,
- Worttiming- und Frameauflösung,
- finaler SVG-Renderer.

Arbeite in dieser Reihenfolge:
1. bestehende Zielarchitektur und Projektregeln lesen;
2. Integrationsplan und betroffene Dateien nennen;
3. Domainmodell, Parser, Sync und Tests implementieren;
4. Backend/API implementieren;
5. Struktur-UI implementieren;
6. Animations-UI und Preview implementieren;
7. Promotion und finalen Renderer anbinden;
8. alle im Handoff geforderten Tests ausführen.

Erfinde keine finalen Zeitwerte. Wenn das Zielrepository noch keine
TTS-Worttimings oder keinen Frame-Renderer besitzt, implementiere eine klar
abgegrenzte Schnittstelle und melde diesen Teil als expliziten Integrationspunkt,
nicht als stillen Mock.
```

## 37. Kurzreferenz

```text
Review:
SVG + Manifest + spokenTextDraft

Struktur:
visibleInEditor=false -> erbt / kein eigenes Steuerelement
render=false          -> aus Preview und Produktion entfernen

Animation:
needsReview | animated | notAnimated
show | hide | highlight | draw | transform

Timing:
sourceText + occurrence
-> atWordIndex
-> Wortzeit
-> atFrame / atSec

Produktion:
finale Steps und hiddenIds im Authoring-Dokument
Manifest bleibt Review-Artefakt
```
