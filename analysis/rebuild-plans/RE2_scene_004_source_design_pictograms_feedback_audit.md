# RE2 – Szene 4: altes Design mit neuen Piktogrammen

Stand: 28.08.2026

## Nutzerbeobachtung

Die Viewer-Szene 4 war zu weit vom alten Folienaufbau entfernt. Gewünscht war keine neue Kreis-/Listenkomposition, sondern das alte Design der Quellfolien 6–7 mit den bereits erzeugten Piktogrammen.

## Reproduzierte Ursache

`slide_006` war als neue konzentrische Kreisgrafik mit einer separaten Merkmalliste rechts aufgebaut worden. Dadurch gingen die charakteristische vierzeilige Ebenenmatrix, die links angeschnittenen konzentrischen Ebenen und die direkt angeschlossene Systemgrenze der alten Folie als Gestalt verloren.

## Lokale Korrektur

- Die alte Topologie wurde wiederhergestellt: vier horizontale Ebenenzeilen, links die konzentrische Hierarchie, rechts die an Subsystem- und Komponentenebene angeschlossene Systemgrenze.
- Überschriften, Stichpunkte, Systemgrenze, Schnittstellenhinweis und Leserichtung bleiben quellnah erhalten.
- Ausschließlich die vier alten Bildmotive wurden ersetzt:
  - Umwelt → `re2-level-environment.png`
  - Systemebene → `re2-level-pv-system.png`
  - Subsystemebene → `re2-level-inverter.png`
  - Komponentenebene → `re2-level-microcontroller.png`
- Die Piktogramme stehen wie in der alten Folie innerhalb der jeweiligen Zeile und sind keine neue Karten- oder Kreislogik.
- Die fünf Sprechertext-Reveals bleiben erhalten; das alte Raster ist der statische Orientierungsrahmen.
- Der Generator `tools/generate-re2-chapter2-full-slide-redesign.js` wurde mitkorrigiert, damit die Szene reproduzierbar bleibt.

## Reichweite

`local_fix`

Die Entscheidung ist ein ausdrücklicher Referenz-Lock für diese Szene. Sie wird nicht als generelle Pflicht übernommen, alte Folien ungeprüft zu kopieren.

## Übertragbare Regel

Wenn der Nutzer ausdrücklich die Wiederverwendung eines konkreten alten Designs verlangt, muss dessen Beziehungstopologie technisch übernommen werden. Piktogrammersatz allein autorisiert keine neue Layoutinterpretation.

## Verifikation

- Direkter Quellenvergleich mit `Folie6.SVG` und `Folie7.SVG`
- 6 Animationszustände gerendert und visuell geprüft
- 4 Piktogramm-Releasechecks: jeweils 0 Fehler, 0 Warnungen
- strenge Szene-QA: 0 Fehler, 0 Warnungen
- Viewer-QA für Szene 4 / `slide_006`: 0 Fehler; eine unveränderte modulweite Warnung betrifft ausschließlich den Badewannenkurven-Plot in `slide_003`

## Prüfartefakte

- Zielpreview: `analysis/render-checks/RE2/scene-004-source-design-2026-08-28/static-v2/slide_006.png`
- Animationszustände: `analysis/render-checks/RE2/scene-004-source-design-2026-08-28/animation-states-v1/slide_006/`
- Szenen-QA: `analysis/reports/qa/RE2-scene-004-source-design-pictograms-2026-08-28/svg-qa-report.md`
- Viewer-QA: `analysis/reports/qa/RE2-scene-004-viewer-source-design-pictograms-2026-08-28/svg-qa-report.md`
