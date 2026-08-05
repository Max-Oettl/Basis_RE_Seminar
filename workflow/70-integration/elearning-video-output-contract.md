# Output-Vertrag Für `elearning-video`

Diese Datei beschreibt, welchen Output dieses SVG-Creator-Repo liefern muss, damit eine Szene im Repo `elearning-video` korrekt in ein E-Learning-Video eingebunden werden kann.

Grundlage der Analyse:

- `elearning-video/AGENTS.md`
- `elearning-video/docs/svg-animation-workflow.md`
- `elearning-video/docs/lesson-authoring-v1.md`
- `elearning-video/docs/visual-draft-workflow.md`
- `elearning-video/src/lib/storyboard/authoring.ts`

## Wichtigste Erkenntnis

`elearning-video` liest produktiv keine verpflichtende SVG-Sidecar-Datei.

Die finale Render-Pipeline erwartet:

1. die SVG-Datei als Asset im finalen Lesson-Ordner
2. SVG-Animationsschritte direkt in `lesson.authoring.v1.json`
3. `sourceText`-Trigger, die im `spokenText` der Szene eindeutig vorkommen

Unsere `composed/scene.animation.v1.json` ist daher die Reviewer- und Draft-Arbeitsdatei, aber nicht allein ausreichend für den finalen Render.

## Zielstruktur Im `elearning-video`-Repo

Für eine finale Lesson muss die SVG unter dem Lesson-Ordner liegen:

```text
pipeline/<chapter>/<lesson>/
  lesson.config.json
  lesson.authoring.v1.json
  assets/
    <scene-id>/
      scene.svg
```

Der Pfad in `lesson.authoring.v1.json` ist relativ zum Lesson-Ordner:

```json
"svgPath": "assets/<scene-id>/scene.svg"
```

## Minimaler Output Aus Dem SVG-Creator

Dieses Repo sollte pro produktiver SVG-Szene mindestens liefern:

```text
assets/scenes/<scene_id>/
  composed/
    scene.svg
    scene.animation.v1.json
  handoff.md
```

Die finale Integration in `elearning-video` entsteht durch Promotion: Der Reviewer übernimmt die geprüften `steps[]` aus `scene.animation.v1.json` in die passende `lesson.authoring.v1.json`.

## SVG-Anforderungen

Die SVG muss:

- eine echte `.svg` Datei sein
- einen `viewBox` haben, idealerweise `0 0 1920 1080`
- stabile, eindeutige IDs für alle animierbaren Elemente enthalten
- zusammengehörige Elemente über `<g id="...">` gruppieren
- keine Script-Tags enthalten
- keine interaktive Logik enthalten
- keine produktiven Zeittrigger enthalten
- keine `<animate begin="...s">`-Blöcke für finale Animation enthalten

`elearning-video` empfiehlt IDs im Format:

```text
lowercase_words_with_underscores
```

Beispiele:

- `case_failures_only`
- `case_failures_plus_intact`
- `case_interval_censored`
- `data_situation_method_conclusion`

Technisch validiert das aktuelle System vor allem, ob die ID existiert. Für neue Szenen sollten wir trotzdem die Unterstrich-Konvention übernehmen.

## Animation-Manifest Aus Dem SVG-Creator

Unsere primäre Reviewer-Datei liegt direkt neben der SVG:

```json
{
  "schemaVersion": "svgAnimationManifest/v1",
  "svgPath": "scene.svg",
  "defaults": {
    "enterFrames": 16,
    "highlightDurFrames": 24,
    "drawDurFrames": 24
  },
  "targets": [
    {
      "targetId": "case_failures_only",
      "label": "Fall 1: Nur Ausfälle",
      "status": "animated",
      "confidence": "high"
    },
    {
      "targetId": "background",
      "label": "Hintergrund",
      "status": "ignored",
      "ignoreReason": "static-background",
      "confidence": "high"
    }
  ],
  "steps": [
    {
      "stepId": "02",
      "targetId": "case_failures_only",
      "action": "show",
      "sourceText": "Manchmal kennen wir nur die Ausfälle",
      "enterFrames": 16,
      "fromY": 16,
      "confidence": "high"
    }
  ]
}
```

Dieses Format ist für Review und Trigger-Bearbeitung hilfreich.

Für `elearning-video` muss es aber in `lesson.authoring.v1.json` übersetzt werden:

| SVG-Creator | `elearning-video` Authoring |
| --- | --- |
| `steps[].sourceText` | `sourceText` |
| `steps[].targetId` | `id` |
| `steps[].action` | `action` |
| `steps[].confidence` | nicht Teil des Render-Schemas |
| `targets[]` | Reviewer-Kontext, nicht Teil des Render-Schemas |

Zusätzlich braucht `elearning-video` je nach Aktion Pflichtfelder für Animationsdauer.

## Unterstützte Aktionen

`elearning-video` unterstützt diese SVG-Aktionen:

- `show`
- `hide`
- `highlight`
- `draw`

Pflichtfelder im finalen Authoring:

```json
{
  "id": "case_failures_only",
  "action": "show",
  "sourceText": "Manchmal kennen wir nur die Ausfälle",
  "enterFrames": 16,
  "fromY": 16
}
```

Für `show`:

- `id`
- `action`
- `sourceText`
- `enterFrames`
- optional `fromY`
- optional `occurrence`

Für `hide`:

- `id`
- `action`
- `sourceText`
- `exitFrames`
- optional `toY`
- optional `occurrence`

Für `highlight`:

- `id`
- `action`
- `sourceText`
- `durFrames`
- optional `fill`
- optional `stroke`
- optional `strokeWidth`
- optional `occurrence`

Für `draw`:

- `id`
- `action`
- `sourceText`
- `durFrames`
- optional `drawStyle`: `stroke` oder `reveal`
- optional `direction`: `leftToRight`, `rightToLeft`, `topToBottom`, `bottomToTop`
- optional `occurrence`

## Finales Authoring-Format Für SVG-Szenen

Für eine reine SVG-Grafik ist `type: "svgDiagram"` der direkte Weg.

Beispiel für Szene 04:

```json
{
  "sceneId": "scene-004-datenlage-zur-methode",
  "dirName": "04_datenlage_zur_methode",
  "type": "svgDiagram",
  "spokenText": "Bevor wir in diesem Expertentraining über konkrete Auswertemethoden sprechen, müssen wir zuerst eine andere Frage klären: Welche Daten liegen überhaupt vor? Genau das ist in der Praxis oft der entscheidende Punkt. Denn nicht jede Lebensdauerauswertung startet mit einer sauberen Liste vollständiger Ausfallzeiten. Manchmal kennen wir nur die Ausfälle. Manchmal kennen wir zusätzlich auch intakte Einheiten und ihre Laufzeiten. Und manchmal wissen wir nur, dass ein Ausfall irgendwann innerhalb eines bestimmten Intervalls passiert ist. Das klingt erstmal nach einem kleinen Unterschied. Für die Auswertung macht es aber einen großen Unterschied. Denn die Datenlage entscheidet darüber, welche Information überhaupt in den Daten steckt. Und genau daraus ergibt sich später auch, welche Methode sinnvoll ist.",
  "transitionToNext": {
    "kind": "crossfade",
    "durationFrames": 24,
    "gapFrames": 42,
    "gapVisualPolicy": "split",
    "splitRatio": 0.5
  },
  "content": {
    "title": "",
    "svgPath": "assets/scene_004/scene.svg",
    "placement": {
      "x": 0,
      "y": 0,
      "width": 1920,
      "height": 1080,
      "fit": "contain",
      "anchor": "topLeft"
    },
    "defaultEnterFrames": 16,
    "defaultHighlightDurFrames": 24,
    "defaultDrawDurFrames": 24,
    "steps": [
      {
        "id": "case_failures_only",
        "action": "show",
        "sourceText": "Manchmal kennen wir nur die Ausfälle",
        "enterFrames": 16,
        "fromY": 16
      },
      {
        "id": "case_failures_plus_intact",
        "action": "show",
        "sourceText": "intakte Einheiten und ihre Laufzeiten",
        "enterFrames": 16,
        "fromY": 16
      },
      {
        "id": "case_interval_censored",
        "action": "show",
        "sourceText": "innerhalb eines bestimmten Intervalls",
        "enterFrames": 16,
        "fromY": 16
      },
      {
        "id": "data_situation_method_conclusion",
        "action": "show",
        "sourceText": "welche Methode sinnvoll ist",
        "enterFrames": 16,
        "fromY": 16
      }
    ]
  }
}
```

## Wichtige Matching-Regeln

`sourceText` muss innerhalb von `spokenText` eindeutig vorkommen.

`spokenText` darf Pausenmarker wie `{{pause:short}}`, `{{pause:medium}}`,
`{{pause:long}}`, `{{pause:1.2s}}` oder `{{pause:1200ms}}` enthalten. Diese Marker
sind Timing-Metadaten:

- Sie zählen nicht als Wörter.
- Sie dürfen niemals Bestandteil von `sourceText` sein.
- Der Produktionsadapter muss sie erst an der TTS-Grenze in das jeweilige
  Syntheseformat, zum Beispiel SSML-`<break>`, übersetzen.
- Alle nachfolgenden Wort- und Animationszeitpunkte werden um die bis dahin
  aufgelaufene Pausendauer verschoben.
- Unbekannte, unvollständige oder länger als drei Sekunden dauernde Marker
  blockieren die Übergabe.

Wenn dieselbe Phrase mehrfach vorkommt, muss `occurrence` gesetzt werden:

```json
{
  "id": "example",
  "action": "show",
  "sourceText": "Datenlage",
  "occurrence": 2,
  "enterFrames": 16
}
```

Die Pipeline normalisiert beim Matching:

- Groß- und Kleinschreibung
- Satzzeichen
- Umlaute und Umschreibungen wie `ä` / `ae`
- `ß` / `ss`

Trotzdem sollte `sourceText` möglichst genau zum finalen `spokenText` passen.

## Was Die Pipeline Später Erzeugt

Der SVG-Creator darf diese Werte nicht liefern:

- finale Sekunden
- finale Frames
- finale Wort-Indizes

`elearning-video` erzeugt diese Werte selbst:

```text
sourceText -> atWordIndex -> atSec / atFrame
```

Die Ableitung passiert aus:

- `lesson.authoring.v1.json`
- `01_input/lesson.words.json`

## Validierung Im `elearning-video`-Repo

Nach Integration muss im `elearning-video`-Repo laufen:

```bash
npm run pipeline:00:validate-authoring -- --lesson pipeline/<chapter>/<lesson>
```

Die Validierung prüft:

- `sourceText` gegen `spokenText`
- lokale SVG-Datei vorhanden
- jedes `steps[].id` existiert in der SVG
- keine mehrdeutigen Trigger ohne `occurrence`

## Konsequenz Für Unser Repo

Damit unsere Dateien direkt anschlussfähig sind, sollten wir pro Szene künftig zwei Ebenen erzeugen:

1. `composed/scene.animation.v1.json` als Reviewer-Arbeitsdatei mit `targets[]` und `steps[]`.
2. Nach Prüfung: Promotion in die finale `lesson.authoring.v1.json`.

`scene.animation.v1.json` allein reicht für das aktuelle `elearning-video`-Programm nicht aus, weil:

- es nicht automatisch gelesen wird
- `confidence` nicht Teil des Render-Schemas ist
- `targets[]` nur Reviewer-Kontext ist
- die Felder `targetId` und `sourceText` in Authoring in `content.steps[]` übernommen werden müssen
