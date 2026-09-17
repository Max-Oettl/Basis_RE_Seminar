# Feedback-Audit: RE2 Szene 7 – Ishikawa-Diagramm

## Lernprotokoll

- Szene(n): Viewer-Szene 7, technische Arbeitseinheit `slide_010`, Scene_ID `re2_ch2_ishikawa`
- Nutzerbeobachtung: Das bisherige Redesign war mit dem Ursprungsbild nicht mehr vergleichbar.
- Reproduzierte Ursache: Der erste Neuaufbau behandelte die Quelle nur als Begriffsliste. Die charakteristische Fischgräten-Topologie, die Verteilung von drei oberen und zwei unteren Kategorien, die getrennten Beispielzuführungen und der Wirkungskopf wurden in eine freie Linien-/Kartenanordnung umgedeutet. Dadurch gingen visuelle Identität und Beziehungstopologie verloren, obwohl die meisten Wörter noch vorhanden waren.
- Lokale Korrektur: Die Szene wurde aus dem Generator neu aufgebaut. Hauptachse, Fischschwanz, Wirkungskopf, fünf Gräten und alle zehn sichtbaren Beispiele entsprechen wieder der Quelllogik; Gestaltung, Typografie, Linien und Farben folgen der aktuellen RelTest-Education-CI.
- Reichweite: `project_rule`
- Übertragbare Regel: Bei einer fachlich etablierten Diagrammform ist nicht nur der Text, sondern auch ihre kanonische Silhouette und Beziehungstopologie Inhaltsanker. Ein Ishikawa-Diagramm bleibt eine eindeutig erkennbare Fischgräte; ein freies Karten- oder Linienlayout ist kein gleichwertiger Ersatz.
- Aktualisierte Schubladen: `tools/generate-re2-chapter2-full-slide-redesign.js`, `analysis/rebuild-plans/RE2_scene_007_ishikawa_redesign_brief.md`, `rebuild-proposals/svg/RE2/slide_010/`, `analysis/rebuild-plans/RE2_scene-plan.json`
- Kanonische Regel: bereits in `.agents/skills/redesign-reltest-slides/references/review-derived-design-rules.md` verankert: funktionierende Darstellungslogik modernisieren statt ohne Lerngewinn neu interpretieren; Beziehungen und Pfeilrichtungen erhalten.
- Verifikation: direkter Quellen-/Zielvergleich, statischer Pilot, acht gerenderte Animationszustände, Animationsplan 0 Fehler/0 Warnungen, strenge SVG-/Design-/Layout-QA 0 Fehler. Der Content-Crosscheck enthält keine Fehler und keine unbelegte Zielergänzung; verbleibende Hinweise betreffen den downstream erzeugten Titel und die korrigierte Quellschreibweise `Mileu` → `Milieu`.

## Animationskorrektur

- Wirkung und Hauptachse erscheinen gemeinsam, sobald der Sprecher den Leistungsverlust einführt.
- Materialien, Maschinen, Mensch, Methoden und Milieu erscheinen danach als vollständige atomare Fischgräten in Sprecherreihenfolge.
- Der Rückwärtspfeil zur Leserichtung erscheint erst bei der ausdrücklichen Erklärung `von rechts nach links`.
- Keine Verbindung erscheint vor ihren benötigten Endpunkten.
