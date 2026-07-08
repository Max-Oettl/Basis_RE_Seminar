# Decision 0002: Standardformat fuer SVG-Dateien

## Status

Akzeptiert

## Entscheidung

Alle Standard-SVGs werden fuer 16:9-Videos erstellt.

Standardmaessig enthalten sie nur die eigentliche Bildgrafik und nicht die komplette Folienkomposition.

Der bevorzugte SVG-ViewBox-Standard ist:

```xml
viewBox="0 0 1920 1080"
```

## Begruendung

1920x1080 ist ein gaengiges Full-HD-Videoformat und eignet sich gut fuer E-Learning-Folien, Diagramme und Erklaergrafiken.

## Konsequenzen

- Layouts koennen konsistent geplant werden.
- Textgroessen und Abstaende lassen sich wiederverwendbar definieren.
- Die Video-Pipeline bekommt stabile Seitenverhaeltnisse.
