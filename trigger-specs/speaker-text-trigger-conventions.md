# Sprechertext-Trigger-Konvention

Diese Datei ist die verbindliche Arbeitsgrundlage für SVG-Dateien und Animation-Drafts in diesem Repo.

Ziel ist Kompatibilität mit der späteren Video-Pipeline: Animationen werden nicht über geschätzte Sekunden, Frames oder Wort-Indizes ausgelöst, sondern über eindeutig erkennbare Stellen im gesprochenen Sprechertext.

## Grundprinzip

Der SVG-Creator erstellt zwei getrennte Ergebnisse:

1. Eine SVG-Datei mit stabilen IDs und sauber gruppierten Elementen.
2. Eine externe Animation-Manifest-Datei mit bewerteten SVG-Zielen und Trigger-Vorschlägen.

Die SVG-Datei enthält keine finale Trigger-Logik.

Die spätere Video-Pipeline berechnet exakte Zeitpunkte aus dem TTS-Ergebnis und der Wort-Timing-Datei, zum Beispiel aus `lesson.words.json`.

## Was Der Creator Nicht Tun Darf

Der SVG-Creator darf nicht:

- finale Sekundenwerte erzeugen
- finale Frame-Werte erzeugen
- finale Wort-Indizes erzeugen
- Animationstimings schätzen
- Trigger-Logik direkt ins SVG einbauen
- produktive Animationen nur über feste Zeitpunkte modellieren

Zeitbasierte SVG-Animationen wie `<animate begin="1.2s">` oder `data-time-trigger="1.2s"` sind nicht Teil des Standards.

## SVG-Konventionen

Jedes animierbare Element braucht eine stabile, eindeutige und sprechende ID.

Gute IDs:

- `card_complete_data`
- `method_row_suspensions`
- `arrow_process_flow`
- `highlight_interval_window`
- `data_type_takeaway`

Schlechte IDs:

- `box-left`
- `trigger-01`
- `satz-3`
- `element1`
- IDs, die nur die Position beschreiben

## Gruppen Als Animationsziele

Wenn mehrere SVG-Elemente gemeinsam erscheinen sollen, ist immer die gemeinsame `<g id="...">` das Animationsziel.

Beispiel:

```xml
<g id="bullet_01">
  <rect id="bullet_01_bg" />
  <text id="bullet_01_text">Erster Punkt</text>
</g>
```

Wenn ein Stichpunkt aus Text, Icon und Hintergrundfläche besteht und alles gemeinsam erscheinen soll, ist `bullet_01` das Ziel, nicht `bullet_01_text`.

Für Karten gilt dasselbe:

```xml
<g id="card_right_censored_data">
  <rect id="card_right_censored_panel" />
  <text id="right_censored_title">Rechtszensiert</text>
  <g id="right_censored_data_timeline">...</g>
</g>
```

Wenn die gesamte Karte eingeblendet wird, ist `card_right_censored_data` das Ziel.

## Zulässige Aktionen

Der Creator darf nur Aktionen vorschlagen, die die spätere Pipeline verarbeiten kann:

- `show`: Element einblenden
- `hide`: Element ausblenden
- `highlight`: Element visuell hervorheben
- `draw`: Linie oder Pfad animiert zeichnen

Andere Aktionen sind nicht Teil des Standards.

## Trigger-Regeln

Trigger müssen auf dem Sprechertext basieren.

Ein guter Trigger ist ein Wort oder eine kurze Phrase, die im Sprechertext klar vorkommt und möglichst eindeutig ist.

Gute Trigger-Phrasen:

- `Der erste Schritt`
- `ein zweites Problem`
- `am Ende entsteht`
- `die Verbindung zwischen`
- `vollständige Ausfallzeiten`
- `rechtszensiert`

Schlechte Trigger-Phrasen:

- `und`
- `das`
- `wichtig`
- `hier`
- einzelne Wörter, die mehrfach vorkommen
- frei erfundene Formulierungen, die nicht im Sprechertext stehen

Wenn kein zuverlässiger Text-Trigger gefunden werden kann, darf kein Zeitpunkt geraten werden. Der Trigger muss als unsicher markiert werden.

## Confidence-Werte

Jeder Trigger-Vorschlag erhält genau einen Confidence-Wert:

- `high`: Die Trigger-Phrase kommt eindeutig im Sprechertext vor und passt semantisch klar zur Animation.
- `medium`: Die Trigger-Phrase ist wahrscheinlich richtig, sollte aber gegen den finalen Sprechertext geprüft werden.
- `low`: Der Trigger ist unsicher und muss vor der finalen Nutzung manuell geprüft werden.

Bei `low` muss zusätzlich eine kurze Begründung angegeben werden.

## Animation-Manifest-Struktur

Pro Szene wird eine externe Datei `scene.animation.v1.json` direkt neben der SVG erzeugt.

Pfad:

```text
assets/scenes/<scene_id>/composed/scene.animation.v1.json
```

Grundstruktur:

```json
{
  "schemaVersion": "svgAnimationManifest/v1",
  "svgPath": "scene.svg",
  "defaults": {
    "enterFrames": 14,
    "highlightDurFrames": 24,
    "drawDurFrames": 36
  },
  "targets": [
    {
      "targetId": "bullet_01",
      "label": "Erster Stichpunkt",
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
      "targetId": "bullet_01",
      "action": "show",
      "sourceText": "Der erste Schritt",
      "enterFrames": 14,
      "fromY": 18,
      "confidence": "high"
    }
  ]
}
```

`targets[]` beschreibt, welche SVG-Ziele der Reviewer kennt und wie sie bewertet sind.

`steps[]` beschreibt, welches Ziel bei welchem Sprechertext-Anker welche Aktion ausführt.

## Verhältnis Zu `lesson.authoring.v1.json`

Das Animation-Manifest ist eine Review- und Draft-Datei.

Nach der manuellen Prüfung wird daraus das finale Authoring geschrieben:

- `scene.animation.v1.json` -> Reviewer-Arbeitsdatei
- `lesson.authoring.v1.json` -> finale Produktionsquelle
- `lesson.words.json` -> Worttimings aus TTS
- Pipeline: `sourceText` -> Wortindex -> Frame/Sekunde

Die finale Videopipeline soll nicht direkt aus dem Animation-Manifest rendern, sondern nach der Promotion aus `lesson.authoring.v1.json`.

## Pflichtfelder Pro Target

Jeder Eintrag in `targets[]` braucht:

- `targetId`
- `label`
- `status`
- `confidence`

Erlaubte `status`-Werte:

- `animated`: Das Ziel wird in `steps[]` animiert.
- `ignored`: Das Ziel ist bewusst nicht animiert.

Bei `ignored` soll zusätzlich `ignoreReason` gesetzt werden, zum Beispiel:

- `static-background`
- `root-container`
- `child-of-animated-target`
- `decorative-detail`

## Pflichtfelder Pro Step

Jeder Eintrag in `steps[]` braucht:

- `stepId`
- `targetId`
- `action`
- `sourceText`
- `confidence`

Je nach Aktion gelten zusätzliche Felder:

- `show`: `enterFrames`, optional `fromY`
- `hide`: `exitFrames`, optional `toY`
- `highlight`: `durFrames`, optional `fill`, `stroke`, `strokeWidth`
- `draw`: `durFrames`, optional `drawStyle`, `direction`

Empfohlen sind zusätzlich:

- `label`
- `reason`
- `notes`

`targetId` muss exakt einer ID in der SVG entsprechen und zusätzlich in `targets[]` mit `status: "animated"` enthalten sein.

## Verhältnis Zu SVG-Attributen

Die spätere Pipeline soll sich nicht auf zusätzliche SVG-Attribute verlassen.

Maßgeblich sind:

- stabile SVG-IDs
- `scene.animation.v1.json`
- `targets[].targetId`
- `steps[].targetId`

Die eigentliche Beziehung lautet:

Wenn diese Sprechertext-Phrase gesprochen wird, soll dieses SVG-Element diese Aktion ausführen.

Beispiel:

Wenn der Sprecher sagt `Der erste Schritt`, dann soll `bullet_01` mit der Aktion `show` eingeblendet werden.

## Qualitätsprüfung

Vor Freigabe einer Szene muss geprüft werden:

- Existiert jedes `targets[].targetId` und jedes `steps[].targetId` in der SVG?
- Ist jedes `steps[].targetId` in `targets[]` als `animated` aufgeführt?
- Ist jede `sourceText`-Phrase im Sprechertext vorhanden oder klar als unsicher markiert?
- Verwendet jeder Step nur `show`, `hide`, `highlight` oder `draw`?
- Sind alle Confidence-Werte `high`, `medium` oder `low`?
- Werden keine finalen Sekunden, Frames oder Wort-Indizes angegeben?
- Sind Gruppen so gewählt, dass zusammengehörige Elemente gemeinsam animiert werden?
