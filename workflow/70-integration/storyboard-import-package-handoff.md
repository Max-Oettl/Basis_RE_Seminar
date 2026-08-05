# Storyboard Import Package Handoff

Status: `storyboardImportPackage/v1`

Diese Datei ist der kanonische Uebergabevertrag dieses Repositories. Sie extrahiert die Anforderungen aus `external-svg-asset-package-handoff.md`, Stand 16.07.2026, SHA-256 `87C1FA6545977C7934ECE93AB7E8B76010E785E2B5A440041859DBD07AC37E15`.

## Zweck Und Abgrenzung

Die finale Lieferung enthaelt genau ein Modul und wird in den Storyboard Review Viewer des empfangenden Repositories importiert. Dieses Repository liefert Fachvisual, Szenenkontext und sprachbasierte Animationstrigger. Es erzeugt keine finalen Produktionsframes, Wortindizes, TTS-Zeitpunkte oder aufgeloesten Autorendateien.

Verbotene Lieferartefakte sind insbesondere:

- `lesson.words.json`,
- `wordRange`, `atWordIndex`, `atFrame` oder `atSec`,
- TTS-Snapshots oder angenommene Wortzeiten,
- fertig promotete `lesson.authoring.v1.json`,
- gerenderte Video- oder Preview-Artefakte.

## Verbindliche Paketstruktur

```text
delivery-packages/storyboard-import/<external-module-id>/
  import.package.v1.json
  storyboard.rows.json
  assets/
    <Scene_ID>/
      <svg-name>.svg
      <svg-name>.animation.v1.json
```

- Das Paket enthaelt genau ein Modul.
- Direkt unter `assets/` liegen nur Szenenordner.
- Jeder Szenenordner heisst exakt wie die zugehoerige `Scene_ID`.
- Jede automatisch zuzuordnende Szene enthaelt genau eine SVG.
- Ein vorhandenes Animationsmanifest hat denselben Basename wie die SVG.
- Szenenordner werden flach gehalten; folienspezifische Arbeitsdateien bleiben in `rebuild-proposals/` und werden nicht mitgeliefert.

Eine szenenlokale Lieferung nur aus `<svg-name>.svg` und `<svg-name>.animation.v1.json` ist laut Upstream-Vertrag fuer manuelle Zuordnung moeglich, aber nicht der Standard dieses Repositories. Fuer neue oder vollstaendige Module wird immer das importierbare Gesamtpaket erzeugt.

## `import.package.v1.json`

Erlaubte Felder:

| Feld | Pflicht | Regel |
|---|---|---|
| `schemaVersion` | ja | exakt `storyboardImportPackage/v1` |
| `rows` | ja | sicherer relativer Pfad zur UTF-8-JSON-Datei |
| `moduleId` | ja | stabile Ziel-ID, empfohlen: Kleinbuchstaben, Ziffern, Bindestriche, maximal 80 Zeichen |
| `moduleTitle` | empfohlen | lesbarer Modultitel |
| `assetMode` | ja | exakt `bySceneId` |
| `assetsDir` | nein | relativer Assetordner, Standard `assets` |
| `selection` | nein | optionale Teilmengenauswahl; bei normalen Lieferungen weglassen |

Absolute Pfade, `..` und Pfade ausserhalb des Pakets sind unzulaessig.

## `storyboard.rows.json`

Empfohlen ist ein Objekt mit `rows`:

```json
{
  "rows": []
}
```

Pflicht je Szene:

- `Scene_ID`: innerhalb des Pakets eindeutig und ueber Revisionen stabil,
- `Modul`: bei allen Zeilen identisch,
- `Kapitel` oder `System.Xml.XmlElement`,
- `Lektion`.

Fuer dieses Repository ist `Gesprochener Text` vor finaler Uebergabe ebenfalls Pflicht, sobald eine Szene animiert werden soll. Er ist die einzige Quelle fuer `sourceText`-Trigger. Weitere unterstuetzte Felder wie `Reihenfolge`, `Themen_ID`, `Status`, `Titel`, `Hauptinhalt`, `Aufbau`, `Grafikelemente (Auflistung)`, `Links auf Grafikelemente` und `Notizen` koennen aus dem Szenenplan uebernommen werden.

## Szenenidentitaet Und Zusammengezogene Folien

- Der Sequenz-Preflight legt eine stabile `Scene_ID` fuer jede Zielarbeitseinheit fest.
- Mehrere PowerPoint-SVGs, die zu einer Animation zusammengezogen werden, ergeben genau eine Storyboard-Zeile und genau einen Szenenordner.
- Alle Ursprungs-SVGs bleiben im Source-Reference-Mapping dieser Szene dokumentiert.
- Der Sprechertext der Szene setzt sich in fachlich korrekter Reihenfolge aus den zugeordneten, freigegebenen Sprechertextabschnitten zusammen. Er wird nicht frei umgeschrieben.
- Gueltige Pausenmarker nach `workflow/50-animation/narration-pause-markers.md` bleiben im Feld `Gesprochener Text` wortgetreu erhalten. Sie werden erst im Produktionsrepo fuer den konkreten TTS-Dienst uebersetzt und duerfen nicht in `sourceText` stehen.
- Eine neue, nicht aus PowerPoint abgeleitete Szene erhaelt eine neue stabile `Scene_ID`, leere Quellreferenzen und einen ausdruecklich freigegebenen Sprechertext.
- Einmal vergebene `Scene_ID`-Werte werden beim Verschieben oder Ueberarbeiten nicht umnummeriert.

## SVG-Vertrag

Der SVG-DOM folgt `workflow/40-svg-production/target-svg-structure-contract.md`.

Pflicht:

- parsebares UTF-8-SVG mit Namespace und `viewBox`,
- eigenstaendiges, statisch verstaendliches Fachvisual,
- eindeutige IDs und aufloesbare lokale Referenzen,
- stabile semantische ASCII-IDs fuer oeffentliche Targets,
- fachliche Gruppen als `<g>`,
- oeffentliche Editorziele mit `data-anim-target="true"` oder expliziter Manifestaufnahme,
- keine aktiven Inhalte, Remote-Referenzen oder PowerPoint-Masterelemente.
- kein sichtbarer Folientitel, Titelakzent, Titel-/Footertrenner, Trainingsfooter,
  Logo oder Modul-/Szenenlabel; diese Elemente erzeugt das empfangende Repository
  aus Storyboard- und Template-Daten.

### Typografie Im Zielrenderer

- SVG-Inhalt fuehrt `Archivo`; echte Display-Headlines oder Auszeichnungen
  fuehren `Oxanium`.
- Die Produktionsdateien liegen unter `brand/fonts/` und stehen unter OFL 1.1.
- Das strikte Importpaket bleibt auf Szenenassets begrenzt und dupliziert die
  Fontdateien nicht in jedem Modul.
- Vor dem Rendern muss das empfangende Repository die gebuendelten
  Oxanium-/Archivo-Dateien als zentrale Brand-Assets registrieren oder identische
  installierte Fonts bereitstellen.
- Arial und Helvetica sind nur technische Fallbacks. Ein Render, der sichtbar
  auf den Fallback faellt, ist keine visuelle Freigabe.

## Externes Animationsmanifest

Das finale Manifest heisst `<svg-name>.animation.v1.json` und verwendet exakt:

```json
{
  "schemaVersion": "svgAnimationManifest/v1",
  "svgPath": "assets/<svg-name>.svg",
  "defaults": {},
  "targets": [],
  "steps": []
}
```

Bei einer nach `workflow/50-animation/animation-decision-and-dramaturgy.md` als `static` entschiedenen Szene bleiben `targets` und `steps` leer. Es wird kein kuenstlicher `main_content`- oder Ganzfolien-Schritt erzeugt. Bei `animated` gelten die folgenden Target- und Schrittregeln vollstaendig.

Erlaubte Rootfelder sind nur `schemaVersion`, `svgPath`, `defaults`, `targets` und `steps`.

### Defaults

Alle Werte sind positive ganze Framezahlen:

- `enterFrames`: Fallback 16,
- `exitFrames`: Fallback 16,
- `highlightDurFrames`: Fallback 30,
- `drawDurFrames`: Fallback 36,
- `transformDurFrames`: Fallback 30.

### Targets

Erlaubte Felder:

- `targetId`, `label`, `status`, `visibleInEditor`, `render`, `confidence`, `ignoreReason`.
- Status: `animated`, `notAnimated`, `ignored`, `needsReview`, `orphaned`.
- Neue statische Ziele verwenden `notAnimated`; `ignored` ist nur Legacy.
- Finale Lieferungen duerfen keine tatsaechlich verwaisten Ziele enthalten.
- `confidence` ist `high`, `medium` oder `low`.
- `render: false` entfernt das Ziel und unterdrueckt seine Schritte.

### Schritte

Gemeinsame Felder:

- `stepId`, `targetId`, `action`, `sourceText`, `occurrence`, `confidence`, `notes`.
- Aktion: `show`, `hide`, `highlight`, `draw` oder `transform`.

Aktionsfelder:

| Aktion | zusaetzliche Felder |
|---|---|
| `show` | `enterFrames`, `fromY` |
| `hide` | `exitFrames`, `toY` |
| `highlight` | `durFrames`, `fill`, `stroke`, `strokeWidth` |
| `draw` | `durFrames`, `drawStyle`, `direction` |
| `transform` | `durFrames`, `fromTranslateX`, `fromTranslateY`, `fromScale`, `translateX`, `translateY`, `scale`, `transformOrigin` |

`drawStyle` ist `stroke` oder `reveal`. Neue Richtungswerte verwenden ausschliesslich `leftToRight`, `rightToLeft`, `topToBottom` oder `bottomToTop`.

## Sprechertexttrigger

`sourceText` ist eine Wortfolge, kein Zeitpunkt.

- Jeder finale Schritt besitzt `sourceText`.
- Die Phrase kommt im `Gesprochener Text` derselben Szene in derselben Wortreihenfolge vor.
- Nur vollstaendige Woerter verwenden.
- Drei bis acht Woerter sind der robuste Normalfall.
- Die Phrase wird direkt aus dem aktuellen Sprechertext kopiert.
- Pausenmarker sind keine Phrase und werden bei der Worttokenisierung uebersprungen.
- Kommt sie mehrfach vor, ist `occurrence` als positive, 1-basierte Fundstelle Pflicht.
- Nach jeder Sprechertextaenderung werden alle Trigger erneut validiert.
- Sekunden, Frames, Wortindizes oder TTS-Zeitmarken duerfen nicht erfunden werden.

## Interne Und Externe Manifeste

Das interne `scene.animation.v1.json` bleibt fuer Viewer, Review und bestehende Repo-Erweiterungen zulaessig. Vor der Uebergabe wird daraus ein separates externes Manifest erzeugt:

- Dateiname auf den SVG-Basename umstellen,
- `svgPath` auf den gelieferten SVG-Dateinamen setzen,
- interne Rootfelder wie `sceneId`, `status` und `notes` entfernen,
- interne Defaults wie `pauseMs`, `stepDelayMs` oder `drawFrames` entfernen,
- interne Schrittfelder wie `trigger` oder `afterInternalPlotDelayMs` entfernen,
- nur v1-Aktionen und v1-Felder behalten,
- `sourceText` gegen den finalen Szenensprechertext pruefen.

Ein internes Manifest wird niemals unveraendert als externe Lieferung deklariert.

## Produktions- Und QA-Reihenfolge

1. Word-Sprechertexte extrahieren und eindeutig den einzelnen Quell-SVGs zuordnen.
2. SVG-Text-Mapping und alle Eingangs-Hashes pruefen.
3. Alle Quell-SVGs mit ihren gemappten Sprechertexten inventarisieren.
4. Sequenzen, Zusammenziehungen, stabile `Scene_ID`-Werte und Sprechertextzuordnung planen.
5. Eine Arbeitseinheit nach den Fach-, Design-, SVG- und Animationsregeln erzeugen.
6. Content-Crosscheck und internes SVG-QA fuer genau diese Einheit ausfuehren.
7. Befunde korrigieren und dieselbe Einheit erneut pruefen.
8. Erst danach mit der naechsten Einheit fortfahren.
9. Nach Freigabe aller Einheiten das finale Importpaket erzeugen.
10. Den strikten Paketcheck ausfuehren und alle Befunde beheben.

Verbindlicher finaler Befehl:

```powershell
node tools/svg-rebuild-qa.js --handoff-package delivery-packages/storyboard-import/<external-module-id> --strict-handoff --strict-design
```

Wenn die browserbasierte Layout-QA verfuegbar ist:

```powershell
node tools/svg-rebuild-qa.js --handoff-package delivery-packages/storyboard-import/<external-module-id> --strict-handoff --strict-design --layout --layout-strict
```

## Definition Of Done

- [ ] Paket enthaelt genau ein Modul.
- [ ] Das SVG-Text-Mapping ist vollstaendig, hashaktuell und enthaelt keine offenen Zuordnungen.
- [ ] Jede Szene besitzt eine eindeutige, stabile `Scene_ID`.
- [ ] Zusammengezogene PowerPoint-SVGs sind vollstaendig referenziert.
- [ ] Jede Szene besitzt den zugehoerigen freigegebenen Sprechertext.
- [ ] Jeder Szenenordner heisst exakt wie die `Scene_ID` und enthaelt genau eine SVG.
- [ ] SVG und Manifest haben denselben Basename.
- [ ] Die Animationsentscheidung ist dokumentiert; statische Szenen besitzen leere Schritte, animierte Szenen eine fachlich begruendete Dramaturgie.
- [ ] SVG ist eigenstaendig, sicher, statisch lesbar und besitzt eine `viewBox`.
- [ ] Der Zielrenderer hat Oxanium und Archivo registriert; ein Test-Render zeigt
      keinen sichtbaren Fallback.
- [ ] IDs sind eindeutig; oeffentliche Targets sind semantisch benannt.
- [ ] Alle `targetId`- und `render:false`-IDs existieren im SVG.
- [ ] `draw` verweist auf messbare Geometrie.
- [ ] Jedes animierte Ziel besitzt einen sinnvollen Schritt.
- [ ] Jeder Schritt besitzt einen eindeutigen `sourceText` aus dem Szenensprechertext.
- [ ] Wiederholte Trigger verwenden `occurrence`.
- [ ] Keine unbekannten Manifestfelder oder finalen Timingartefakte wurden geliefert.
- [ ] Zentraler QA-Lauf endet mit `0 errors`; verbleibende Warnings sind bewusst bewertet.
