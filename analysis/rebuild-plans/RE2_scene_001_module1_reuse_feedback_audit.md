# Feedback-Audit: RE2 Szene 001 – Wiederverwendung aus Modul 1

## Beobachtung

Die erste RE2-Fassung war nur inhaltlich an die Methodeneinteilung aus Modul 1
angelehnt. Trotz der zugesagten Wiederverwendung blieb sie ein eigenstaendiger
Neuaufbau. Dadurch wich die Szene visuell und strukturell von der genannten
Referenz ab.

## Ursache

Die Modul-1-Szene wurde bei der ersten Umsetzung als thematische Orientierung,
nicht als verbindliches Ausgangsartefakt behandelt. Es fehlten sowohl eine
technische Ableitung als auch eine dokumentierte Referenz im Artefakt.

## Korrektur

- Ausgangsartefakt: `rebuild-proposals/svg/RE1/slide_015/slide_015.svg`
- RE2 Szene 001 wird per Generator direkt aus dieser Szene erzeugt.
- Der qualitative Pfad bleibt aktiv und wird als Modulfokus markiert.
- Der quantitative Pfad wird neutral ausgegraut.
- Im qualitativen Werkzeugbereich bleiben nur FTA und FMEA erhalten.
- Die Animation zeigt zuerst beide Pfade, danach den Modulfokus und zuletzt
  FTA/FMEA passend zum Sprechertext.
- `referenceArtifact` ist in den SVG-Metadaten dokumentiert.

## Geltungsbereich

`module_pattern` und `project_rule`

## Uebertragbare Regel

Eine zugesagte Szenenwiederverwendung ist erst erfuellt, wenn das Ziel technisch
von der benannten Quelle abgeleitet ist. Visuelle Aehnlichkeit allein reicht
nicht. Referenzquelle, erlaubte Anpassungen und Animationsdelta werden vor der
Umsetzung im Redesign-Brief festgehalten.
