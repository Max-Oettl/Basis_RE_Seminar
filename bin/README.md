# Papierkorb

Der SVG-Browser verschiebt gelöschte Szenenordner nach `bin/scenes/`.

Die Ordner werden nicht endgültig gelöscht. Jeder verschobene Szenenordner enthält eine `bin-entry.json` mit ursprünglichem Pfad und Zeitpunkt der Verschiebung.

Inhalte unter `bin/` werden vom SVG-Browser und vom Produktionsworkflow ignoriert.
