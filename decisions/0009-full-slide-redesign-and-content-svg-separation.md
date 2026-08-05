# 0009 - Full-Slide Redesign And Content-SVG Separation

## Status

Accepted.

## Context

Der externe Brand- und Foliendesign-Handoff vom 16.07.2026 definiert ein vollstaendiges RelTest-Academy-Foliensystem mit Hintergrund, Titelzone, Footer und Logo. Der bestehende Basis-RE-Workflow erzeugt dagegen standardmaessig eigenstaendige Content-SVGs fuer eine spaetere Einbettung und verbietet genau diese globalen Masterelemente innerhalb des Assets.

## Decision

Jeder Redesign-Auftrag dokumentiert vor der Gestaltung einen Modus:

- `full_slide`: vollstaendiger BrandFrame nach `brand/reltest-academy-slide-design-tokens.json`.
- `content_svg`: rahmenloses Inhaltsmodul nach `brand/company-brand-tokens.json` ohne globale Masterelemente.
- `module_redesign`: modulweite Planung; jede Zielszene erhaelt danach einen der beiden Ausgabemodi.

Der repo-lokale Skill `.agents/skills/redesign-reltest-slides/` und `workflow/34-slide-redesign/slide-redesign-workflow.md` sind fuer ausdrueckliche Redesign-Auftraege kanonisch.

## Consequences

- Das neue Foliendesign kann vollstaendig reproduziert werden, ohne bestehende Content-SVG-Vertraege zu brechen.
- Titel, Footer, Logo und Hintergrund werden nicht versehentlich doppelt eingebaut.
- Produktions- und kompatible SVG-Asset-Palette bleiben getrennte, bewusst waehlbare Systeme.
- Full-Slide-Produktion benoetigt ein offizielles Logoasset und eine dokumentierte Fontentscheidung.
