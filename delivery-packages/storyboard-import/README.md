# Storyboard Import Delivery Packages

Finale externe Moduluebergaben werden hier abgelegt:

```text
delivery-packages/storyboard-import/<external-module-id>/
  import.package.v1.json
  storyboard.rows.json
  assets/<Scene_ID>/
    <svg-name>.svg
    <svg-name>.animation.v1.json
```

Arbeitsdateien, Python-Quellen, Plotdaten, Formelquellen und interne `scene.animation.v1.json`-Dateien bleiben unter `rebuild-proposals/` und werden nicht ungeprueft in ein Lieferpaket kopiert.

Verbindlicher Vertrag: `workflow/70-integration/storyboard-import-package-handoff.md`.
