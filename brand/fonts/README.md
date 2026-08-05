# RelTest Education Fonts

Verbindliche Corporate-Design-Schriften:

- `Oxanium`: Headlines, Slogans und Auszeichnungen
- `Archivo`: Fliesstext, Labels, Tabellen und Captions

Die Dateien stammen aus dem offiziellen `google/fonts`-Repository und stehen
unter der SIL Open Font License 1.1. Die jeweilige Lizenz liegt im
Familienordner.

## Dateien

```text
oxanium/Oxanium-wght.ttf
archivo/Archivo-wdth-wght.ttf
archivo/Archivo-Italic-wdth-wght.ttf
```

Generatoren sollen die lokalen Fontdateien registrieren oder sicherstellen, dass
sie im Zielrenderer installiert sind. SVG-Ausgaben verwenden:

```css
.display { font-family: "Oxanium", "Archivo", Arial, sans-serif; }
.body { font-family: "Archivo", Arial, Helvetica, sans-serif; }
```
