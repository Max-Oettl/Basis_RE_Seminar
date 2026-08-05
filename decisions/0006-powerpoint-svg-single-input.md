# 0006: PowerPoint SVG As Single Visual Input

Status: superseded by `decisions/0008-module-local-svg-docx-input.md`

Date: 2026-07-16

## Decision

New Basis Seminar modules use one SVG export per original PowerPoint slide as the only visual input.

Approved spoken text accompanies the SVG module as a non-visual input. It is the authoritative source for teaching order and animation `sourceText` phrases.

Canonical path:

```text
source-materials/basis-seminar/powerpoint-svg/<module_id>/slide_###.svg
```

PPTX, PDF and PNG are no longer required parallel inputs. Existing files remain available as legacy evidence and are not deleted.

## Consequences

- Source slides no longer need to be reconstructed from multiple render and object sources.
- Source SVG files are immutable and are transformed into separate target SVGs.
- Adjacent source SVGs are still compared because PowerPoint may encode animation as multiple slide states.
- Several source SVGs may map to one animated target SVG.
- The module inventory records SVG structure, text, references, hashes and state deltas.
- The source reference map remains the machine-readable link between source slide states and target work units.
- The Viewer and Crosscheck prefer source SVGs and keep PNG only as a legacy fallback.
- The exact target DOM structure is versioned separately in `workflow/40-svg-production/target-svg-structure-contract.md`.
- Final delivery uses one `storyboardImportPackage/v1` per module, stable `Scene_ID` values and same-basename SVG animation manifests.
