# 0007: Storyboard Import Package Handoff

Status: accepted

Date: 2026-07-16

## Decision

Final module delivery uses exactly one `storyboardImportPackage/v1` below:

```text
delivery-packages/storyboard-import/<external-module-id>/
```

Every target scene receives a stable `Scene_ID`. Multiple PowerPoint SVG states may be merged into one scene. Each automatically assignable scene contains exactly one standalone SVG and, when animated, a same-basename strict `svgAnimationManifest/v1`.

Approved spoken text is mandatory for animated final scenes. Every animation step uses an exact `sourceText` phrase from the spoken text of the same `Scene_ID`; repeated phrases use `occurrence`.

## Consequences

- Internal `scene.animation.v1.json` files remain compatible with the existing viewer.
- Internal extension fields are removed before external delivery.
- Final SVG targets use stable semantic ASCII `snake_case` IDs and public targets use `data-anim-target="true"`.
- No seconds, word indices, TTS timestamps or downstream authoring files are invented in this repository.
- `tools/svg-rebuild-qa.js` remains the central QA entry point and validates packages through `--handoff-package`.
- The canonical contract is `workflow/70-integration/storyboard-import-package-handoff.md`.
