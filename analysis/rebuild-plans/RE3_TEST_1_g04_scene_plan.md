# RE3_TEST_1 g04 Scene Plan - Restart

## Work Unit

- Work unit: `g04_censored_observations`
- Source slides: 10-11
- Final source state: slide 11
- Output: one master SVG with animation layers
- Viewer aliases: slide 11 should show the same master SVG as slide 10

## Alignment Note

### Source Slide Anchors

- Slide 10 introduces an object-time diagram with red failure crosses.
- Slide 11 adds blue censored observations both on the time axis and in the object-time diagram.
- Source labels to retain: `Objekt Nr.`, `t`, `Zensierte Beobachtungen`, `Ausfallwahrscheinlichkeit`, `Lebensdauer`.
- The PowerPoint title is omitted.

### Spoken Text Points

- The available narration is not split by slides 10-11.
- The scene supports the "special cases" transition by clarifying that not every observation must end in a failure.

### Must Show In SVG

- A sorted time axis with red failures and a blue censoring marker.
- A Weibull plot as context.
- An object-time diagram with six objects.
- Red failure crosses on some object lines.
- Blue arrows for censored observations.
- A beginner-friendly legend that distinguishes failure from censored observation.

## Creative Scene Concept

Use an "observation lanes" scene. Each object has its own horizontal lane. Red crosses end in failure; blue arrows mean the object was still running or only observed up to that point.

## Design Brief

- Canvas: 1920 x 1080.
- Left side: source-style time axis and compact Weibull plot.
- Middle: conversion arrow.
- Right side: large object-time chart with six lanes.
- Bottom/right: compact legend, not a dense paragraph.
- Animation layers:
  1. failure and censoring time axis
  2. Weibull context plot
  3. object-time frame
  4. red failures
  5. blue censored observations
  6. legend note

## Review Focus

- Are blue censoring arrows clearly different from red failure crosses?
- Does the object chart keep labels close to axes?
- Does all legend text fit in its box?
- Does slide 11 work as an animation continuation of slide 10?
