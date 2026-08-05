# Sprechertext-Pausenmarker

Pausen bleiben als maschinenlesbare Marker direkt im wirksamen Sprechertext
gespeichert. Sie sind keine eigenen Szenenobjekte und werden erst unmittelbar vor
einem TTS-Request in das Format des verwendeten Sprachdienstes uebersetzt.

## Erlaubte Marker

| Bedeutung | Marker | Dauer |
|---|---|---:|
| kurz | `{{pause:short}}` | 400 ms |
| mittel | `{{pause:medium}}` | 800 ms |
| lang | `{{pause:long}}` | 1400 ms |
| benutzerdefiniert | `{{pause:1.2s}}` oder `{{pause:1200ms}}` | groesser 0 bis maximal 3000 ms |

Neue benutzerdefinierte Marker verwenden Sekunden und einen Punkt als
Dezimaltrennzeichen. Der Viewer darf Marker beim Laden, Anzeigen, Bearbeiten und
Speichern nicht still entfernen oder umschreiben.

## Viewer-Vertrag

- In Review- und Leseansicht Marker als fokussierbare Pause-Pille mit Preset und
  Dauer anzeigen; der Rohmarker steht im Tooltip.
- Im Bearbeitungsmodus Pausen an der Cursorposition einfuegen. Markierter Text
  bleibt erhalten; die Pause wird davor eingefuegt.
- Vorhandene Marker koennen geaendert oder geloescht werden.
- Ungueltige Marker bleiben sichtbar und werden als Fehler markiert. Speichern
  wird blockiert, bis der Marker korrigiert ist.
- Wortzaehlung ignoriert Pausenmarker. Gesamtpausendauer wird getrennt ermittelt.
- Kopieren beziehungsweise externe Uebergabe bewahrt standardmaessig den
  Rohmarker.

Die kanonische Parser-, Validierungs- und SSML-Hilfslogik liegt in
`tools/basis-rebuild-viewer/narration-pause-domain.js`.

## Animation

- Pausen sind keine narrativen Beats und keine gesprochenen Woerter.
- Ein `sourceText` darf keinen Pausenmarker enthalten und nie auf einen Marker
  zeigen. Als Trigger echte Woerter unmittelbar davor oder danach verwenden.
- Wortindizes und Textbereiche werden auf dem Rohtext berechnet, waehrend Marker
  fuer die Worttokenisierung maskiert werden. Dadurch bleiben Zeichenpositionen
  stabil.
- Geschaetzte Zeitpunkte nach einer Pause werden um deren Dauer verschoben. Das
  ist nur eine Viewer-Vorschau; finale TTS-Zeitpunkte entstehen downstream.

## TTS-Grenze

Interne Marker werden niemals ungefiltert als Sprechtext an einen TTS-Dienst
gesendet. Ein Exportadapter validiert zuerst alle Marker und bildet sie dann auf
die Syntax des konkret eingesetzten Modells ab, beispielsweise:

```text
{{pause:medium}} -> <break time="800ms"/>
{{pause:1.2s}}   -> <break time="1200ms"/>
```

Ob SSML oder eine anbieterspezifische Syntax verwendet wird, entscheidet das
Produktionsrepo. Der gespeicherte interne Marker bleibt unveraendert.

## Freigabesperren

Nicht freigeben, wenn ein Marker ungueltig ist, laenger als drei Sekunden ist,
als normales Wort gezaehlt wird, als Animationstrigger verwendet wird oder beim
Handoff beziehungsweise TTS-Export verloren geht.
