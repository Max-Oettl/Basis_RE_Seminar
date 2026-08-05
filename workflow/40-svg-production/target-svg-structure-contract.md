# Target SVG Structure Contract

Status: `external-svg-asset-package-handoff/v1`

Diese Datei ist der verbindliche Ziel-DOM-Vertrag fuer transformierte Content-SVGs. Sie basiert auf der externen Spezifikation `external-svg-asset-package-handoff.md`, Stand 16.07.2026, SHA-256 `87C1FA6545977C7934ECE93AB7E8B76010E785E2B5A440041859DBD07AC37E15`.

Der vollstaendige Paket- und Animationsvertrag steht in `workflow/70-integration/storyboard-import-package-handoff.md`.

## Artefaktgrenze

- Das Ergebnis ist ein eigenstaendiges Fachvisual als Content-SVG.
- Folientitel, Kapitelrahmen, Foliennummer, Footer, globale Logo-Leiste, Navigation, Video-Dekoration und andere PowerPoint-Masterelemente gehoeren nicht in das SVG.
- Das gilt auch fuer 1920x1080-Kompositionen mit Brandhintergrund: sichtbarer
  Folientitel, Titelakzent, Titeltrennlinie, Footertrennlinie, Trainingsfooter,
  Logo und Modul-/Szenenkennung werden vom Downstream-Repository erzeugt. Nur der
  zugängliche `<title>` und fachliche Titelmetadaten bleiben im SVG.
- Das SVG muss auch ohne Animation fachlich sinnvoll und lesbar sein.
- Quell-SVGs bleiben unveraendert. Ziel-SVGs entstehen zunaechst unter `rebuild-proposals/svg/` und werden erst nach Freigabe in ein externes Uebergabepaket kopiert.
- Brandwerte kommen aus `brand/company-brand-tokens.json`.

## Root Und Portabilitaet

Jedes finale SVG muss:

- gueltiges UTF-8-XML sein,
- ein Root-Element `<svg xmlns="http://www.w3.org/2000/svg">` besitzen,
- eine gueltige `viewBox` besitzen,
- ohne externe Stylesheets, Webfonts oder Scripts rendern,
- nur lokale oder kontrolliert eingebettete Referenzen verwenden,
- alle wichtigen Inhalte innerhalb der `viewBox` halten.

Verboten sind:

- `<script>`, Eventhandler wie `onclick` und `javascript:`-URLs,
- externe HTTP-/HTTPS-/Dateisystem-Referenzen,
- unbekannte lokale Absolutpfade oder geheimnisbehaftete Metadaten,
- Inline-SVG-Animationen als Ersatz fuer das Manifest,
- doppelte IDs oder nicht aufloesbare lokale Referenzen.

`foreignObject`, externe Rasterbilder und Data-URLs sind nicht der Normalfall. Sie muessen technisch begruendet, kontrolliert und durch QA akzeptiert werden.

## ID-Konvention

- Jede ID ist innerhalb des SVG eindeutig.
- Jede animierbare fachliche Einheit hat eine stabile, semantische ID.
- Oeffentliche Animationsziele und Manifest-Targets verwenden ASCII-`snake_case`: Kleinbuchstaben, Ziffern und Unterstriche.
- Gute IDs: `sensor_block`, `failure_points`, `confidence_limits_95`.
- Schlechte IDs: `Gruppe 17`, `Pfad-3849`, `id5`, zufaellige Export-IDs.
- Eine ID bleibt ueber Korrekturen stabil, solange dasselbe fachliche Objekt gemeint ist.

Beim Zusammenfuehren mehrerer PowerPoint-SVGs werden Export-IDs und alle lokalen Referenzen atomar umgeschrieben. Gemeinsame semantische Objekte existieren im Ziel nur einmal.

## Fachliche Gruppen Und Oeffentliche Ziele

Zusammengehoerende Objekte werden als funktionale Gruppe modelliert:

```svg
<g id="sensor_block" data-anim-target="true" data-anim-label="Sensor">
  <rect id="sensor_panel" ... />
  <text id="sensor_label" ...>Sensor</text>
</g>
```

- `data-anim-target="true"` markiert ein oeffentliches Steuerungsziel fuer den Storyboard Reviewer.
- `data-anim-label` liefert einen verstaendlichen Anzeigenamen und ist fuer oeffentliche Ziele empfohlen.
- Untergeordnete IDs bleiben fuer Referenzen und gezielte Schritte erhalten, werden aber nicht automatisch zu oeffentlichen Zielen.
- Composite-Objekte erhalten ein gemeinsames `<g>`-Target, damit Form, Label und Marker gemeinsam animiert werden.
- Verschachtelte oeffentliche Targets werden nur verwendet, wenn Eltern- und Kindanimationen bewusst getrennt geplant und im Manifest eindeutig gesteuert werden.

## Geometrie Fuer `draw`

Direkt zeichnbar sind:

- `path`, `line`, `polyline`, `polygon`, `circle`, `ellipse`, `rect`,
- eine Gruppe, die mindestens eine solche messbare Geometrie enthaelt.

`drawStyle: "stroke"` zeichnet Konturen. `drawStyle: "reveal"` deckt eine gefuellte Form gerichtet auf. Ein `reveal` darf nicht durch ein unmittelbar vorhergehendes `show` desselben Ziels optisch neutralisiert werden.

## Sichtbarkeit Und Statischer Zustand

- Statische Kontextobjekte sind im SVG sichtbar und erhalten im Manifest `status: "notAnimated"`.
- Elemente mit einem ersten `show`-Schritt duerfen im statischen SVG vorhanden sein; die Runtime leitet den initial verborgenen Zustand aus dem Manifest ab.
- `visibleInEditor: false` versteckt nur das Ziel in der Editorliste.
- `render: false` entfernt das Ziel aus Vorschau und Finalrender; die ID muss trotzdem im SVG existieren.
- Das SVG darf nicht erst durch die Animation fachlich repariert werden. Der vollstaendige Endzustand muss statisch verstaendlich sein.

## Interne Und Externe Ablage

Interne Arbeitsablage:

```text
rebuild-proposals/svg/<module_id>/<work_unit>/<svg-name>.svg
rebuild-proposals/svg/<module_id>/<work_unit>/scene.animation.v1.json
```

Finale externe Ablage:

```text
delivery-packages/storyboard-import/<external-module-id>/
  import.package.v1.json
  storyboard.rows.json
  assets/<Scene_ID>/
    <svg-name>.svg
    <svg-name>.animation.v1.json
```

Das interne `scene.animation.v1.json` darf Viewer-Erweiterungen enthalten. Das finale gleichnamige Manifest darf ausschliesslich Felder aus `svgAnimationManifest/v1` enthalten. Ein internes Manifest wird deshalb nicht ungeprueft in die Lieferung kopiert.

## Freigabe

Eine SVG ist strukturell erst final, wenn:

- Root, `viewBox`, Portabilitaet, IDs und Referenzen geprueft sind,
- alle Manifest-Targets im SVG existieren,
- `draw`-Targets messbare Geometrie besitzen,
- der statische Endzustand verstaendlich ist,
- das szenenlokale Manifest exakt denselben Basename wie die SVG hat,
- der Paketcheck ueber den zentralen Entry Point erfolgreich war.

```powershell
node tools/svg-rebuild-qa.js --handoff-package delivery-packages/storyboard-import/<external-module-id> --strict-handoff --strict-design
```
