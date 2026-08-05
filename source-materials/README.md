# Source Materials

Dieser Ordner enthaelt Eingangsquellen.

## Neuer Standard Fuer Das Basis-Seminar

Neue Quellen fuer die Basis-Seminar-Rebuild-Analyse gehoeren nach:

```text
source-materials/basis-seminar/
  powerpoint-svg/
    RE1/
      SVG/
        <PowerPoint-Export>.svg
      Text/
        <Sprechertext>.docx
    RE2/
    RE3/
    RE4/
    RE5/
```

## Regeln

- Quell-SVGs werden nicht beilaufig veraendert.
- Word-Quellen werden nicht veraendert; Extraktionen liegen unter `analysis/source-text/`.
- Vor der SVG-Analyse muss `analysis/inventories/<module_id>_svg-text-map.json` vollstaendig sein.
- Dateipfade in Rebuild-JSON muessen nachvollziehbar und repo-relativ sein.
- Wenn eine Quelle fehlt, wird das in `qa.issues` dokumentiert.
- `pptx/`, `pdf/`, `png/` und separate `narration/`-Ablagen sind kein Eingang fuer neue Module.
