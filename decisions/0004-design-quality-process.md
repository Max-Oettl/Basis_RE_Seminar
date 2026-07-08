# Decision 0004: Qualitätsorientierter SVG-Prozess

## Status

Akzeptiert

## Kontext

Die ersten produktiven SVGs waren fachlich und strukturell nutzbar, erreichten aber nicht die gewünschte visuelle Qualität für ein professionelles E-Learning-Programm.

Konkret problematisch waren:

- zu schematische Umsetzung von Storyboard-Punkten
- zentrale Icons aus primitiven Formen
- gequetschte Texte
- ungewollte Überlappungen
- unsaubere Pfeile
- zu wenig Art Direction vor der eigentlichen SVG-Erstellung

## Entscheidung

Vor jeder SVG-Erstellung wird eine Art-Direction-Stufe eingeführt.

Zusätzlich gilt `brand/design-quality-bar.md` als verbindliche Qualitätsmesslatte. Eine Grafik darf nicht freigegeben werden, wenn sie sichtbar wie eine schnell zusammengesetzte Platzhaltergrafik wirkt.

## Konsequenzen

- SVGs werden nicht mehr direkt aus Storyboard-Zeilen mechanisch aufgebaut.
- Zentrale Motive müssen hochwertiger gestaltet werden.
- Textmenge wird stärker reduziert.
- Visuelle Kollisionen, schlechte Layer-Reihenfolge und unsaubere Pfeile blockieren die Freigabe.
- Wiederverwendbare Komponenten werden in `components/` gesammelt.

## Nächster Pilot

Szene 06 `Datenquellen und Aussagekraft` soll als erstes nach dem neuen Qualitätsprozess neu gestaltet werden.

