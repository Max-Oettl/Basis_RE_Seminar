# 0008: Module-Local SVG And DOCX Input

Status: accepted

Date: 2026-07-16

## Decision

The complete Basis Seminar input is organized in exactly five module folders, `RE1` through `RE5`. Each module contains its PowerPoint slide SVG exports under `SVG/` and the corresponding per-slide Word narration under `Text/`.

```text
source-materials/basis-seminar/powerpoint-svg/<RE1-RE5>/SVG/
source-materials/basis-seminar/powerpoint-svg/<RE1-RE5>/Text/
```

The former split across several PowerPoint files is no longer part of the source model and must not be reconstructed.

Before source SVG sequence analysis, all DOCX files are extracted without paraphrasing and mapped to individual source SVGs. The canonical machine-readable result is:

```text
analysis/inventories/<module_id>_svg-text-map.json
```

## Consequences

- The separate `source-materials/basis-seminar/narration/` path is no longer active for new modules.
- Every source SVG must have exactly one resolved spoken-text mapping before sequence planning or production.
- Mapping by file order alone requires review and blocks production.
- Original SVG and DOCX files remain immutable.
- Merging multiple source slides happens only after the per-source SVG/text mapping is complete.
- Existing analyses and old source folders remain legacy-readable but do not define the new intake.

