# Component: RelTest Education Takeaway Band

Dieses Fazitband ist die verbindliche Referenz für Merksätze und zentrale Einsichten am unteren Bildrand. Es basiert auf den Szenen 004 bis 007 und soll in neuen Szenen konsistent wiederverwendet werden.

## Standardgeometrie

- Position: unten, zentriert
- Standard: `x="300" y="910" width="1320" height="116" rx="28"`
- Alternative bei sehr hohen Hauptgrafiken: `y="918" height="112"`
- Innenkontur: `x + 9`, `y + 9`, `width - 18`, `height - 18`, `rx="22"`
- Akzentleiste links: `x`, `y`, `width="18"`, volle Bandhöhe, `rx="9"`

## Standardklassen

```xml
.takeaway-band { fill: #031334; }
.takeaway-outline { fill: none; stroke: #00a754; stroke-width: 3; opacity: 0.65; }
.takeaway-accent { fill: #00a754; }
.takeaway-text { fill: #ffffff; font-family: "Archivo", Arial, Helvetica, sans-serif; font-size: 34px; font-weight: 700; text-anchor: middle; }
.takeaway-sub { fill: #cceddd; font-family: "Archivo", Arial, Helvetica, sans-serif; font-size: 22px; font-weight: 400; text-anchor: middle; }
```

## Standardmarkup

```xml
<g id="scene_takeaway">
  <rect id="takeaway_band" class="takeaway-band" x="300" y="910" width="1320" height="116" rx="28" filter="url(#soft_shadow)" />
  <rect id="takeaway_outline" class="takeaway-outline" x="309" y="919" width="1302" height="98" rx="22" />
  <rect id="takeaway_accent" class="takeaway-accent" x="300" y="910" width="18" height="116" rx="9" />
  <text id="takeaway_text" class="takeaway-text" x="960" y="962">Kurzer Merksatz</text>
  <text id="takeaway_sub" class="takeaway-sub" x="960" y="998">Präzisierende zweite Zeile.</text>
</g>
```

## Textregeln

- Erste Zeile: maximal eine klare Kernaussage, keine lange Erklaerung.
- Zweite Zeile: kurze Präzisierung oder Konsequenz.
- Wenn die erste Zeile nicht in `34px` passt, zuerst Text kürzen, nicht sofort Schrift verkleinern.
- Keine anderen Fazitbox-Stile ohne ausdrückliche Entscheidung.
