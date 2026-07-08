# SVG Components

Dieses Verzeichnis ist fuer wiederverwendbare hochwertige SVG-Komponenten gedacht.

## Zweck

Wiederkehrende Motive sollen nicht jedes Mal improvisiert werden. Stattdessen sollen sie als saubere Komponenten entstehen und wiederverwendet werden.

Typische Komponenten:

- Datenkarten
- Pfeile und Verbindungslinien
- Zensierungsmarker
- Ausfallmarker
- Merksatz- und Fazitbaender
- technische Piktogramme
- Dokument- und Datenquellen-Symbole
- nicht-diagrammatische Layout-Grundformen

Echte technische Diagramme, Datenplots und Wahrscheinlichkeitsnetze liegen nicht mehr als SVG-Vorlagen hier, sondern werden ueber Python erzeugt. Generische Timelines und Ausfall-Zeitstrahlen bleiben SVG-Kompositionen.

## Verbindliche Komponenten

- `python-plot-library/`: Standard-Python-Generatoren fuer echte technische Diagramme und Weibull-Plots. Vor jedem echten Diagramm zuerst diese Library pruefen; bei fehlendem Diagrammtyp einen neuen Generator dort anlegen. Python-Plots werden ausschliesslich als SVG exportiert und koennen nach `python-plot-library/svg-animation-structure.provisional.md` fuer zeitgetriggerte Animation vorbereitet werden.
- `svg-library/`: Standard-SVG-Bausteine fuer Merkboxen und andere nicht-diagrammatische Layoutformen. Vor eigenen Grundformen zuerst diese Vorlagen pruefen und bei passender Struktur wiederverwenden.
- `takeaway-band.md`: Standard fuer Merksaetze und Fazitbaender am unteren Bildrand. Neue Szenen sollen diesen Aufbau verwenden, damit die E-Learning-Grafiken zusammenhaengend wirken.

## Qualitaetsregel

Komponenten muessen besser aussehen als schnell zusammengesetzte Platzhalter. Wenn ein Motiv zentral ist, soll es als saubere Form, Pfadgrafik oder bewusst reduziertes Piktogramm umgesetzt werden.
