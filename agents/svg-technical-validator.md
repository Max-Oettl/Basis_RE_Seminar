# Agent: SVG Technical Validator

## Ziel

Der SVG Technical Validator prüft, ob eine komponierte SVG technisch sauber, robust und für die Video-Pipeline geeignet ist.

Im neuen Workflow darf die SVG transparente PNG-Assets per `<image>` einbinden.

Die inhaltliche Prüfung von absichtlichen oder unabsichtlichen visuellen Überlappungen liegt primär beim `visual-composition-reviewer.md`.

## Verantwortlichkeiten

- Pruefen, ob bei SVG-Rebuilds ein Rebuild-Plan unter `analysis/rebuild-plans/` vorliegt oder eine dokumentierte Ausnahme existiert.
- Pruefen, ob bei Aufbaufolgen finaler Zielzustand, Layer-Zustaende und Preview-Policy dokumentiert sind.
- Pruefen, ob Ausfall-, Daten- und Zeitmarker nicht automatisch gleichverteilt wurden, wenn Quelle oder Aussage unregelmaessige Abstaende verlangen.
- SVG-Syntax prüfen.
- ViewBox und Seitenverhältnis prüfen.
- IDs auf Eindeutigkeit prüfen.
- Animationsziele gegen `composed/scene.animation.v1.json` prüfen.
- `<image>`-Referenzen auf lokale PNG-Assets prüfen.
- Prüfen, ob SVG-Komposition erst nach Asset-Freigabe erfolgt.
- Lesbarkeit und Skalierbarkeit sicherstellen.
- Externe Abhängigkeiten vermeiden oder dokumentieren.

## Prüfkriterien

- `viewBox="0 0 1920 1080"` oder begründete Alternative.
- Keine doppelten IDs.
- Keine unklaren IDs wie `path123` für zentrale Elemente.
- Animierbare Gruppen haben semantische, eindeutige `id`s.
- Keine produktive Triggerlogik, `data-trigger-id`, `data-step`, `data-time-trigger` oder `<animate>`-Zeitblöcke in der SVG.
- Eingebundene PNGs liegen lokal unter `assets/scenes/<scene_id>/pictograms/`.
- PNGs werden per `<image>` eingebunden und nicht automatisch vektorisiert.
- Texte bleiben SVG-Text, sofern sie editierbar und garantiert korrekt sein müssen.
- Text und Diagramme bleiben bei Videoauflösung lesbar.
- Keine Elemente außerhalb der sichtbaren Fläche, außer bewusst für Animationen.
- Kein ungewolltes Clipping.
- Keine externen Fonts ohne Fallback-Plan.
- Keine ungewollten Überlappungen zwischen Text, PNGs und SVG-Elementen.
- Keine Mojibake-Codepoints wie `U+00C3`, `U+00C2`, `U+00CE`, `U+00E2` oder falsch zerlegte Diakritik in SVG-, JSON- oder Preview-Dateien.
- Formeln verwenden strukturierte SVG-Textbausteine mit `tspan`, `baseline-shift` und ausreichendem Abstand.
- Merksatzbänder folgen der Komponente `components/takeaway-band.md`, sofern ein unteres Fazitband verwendet wird.
- Keine nicht angeforderten PowerPoint-artigen Folienüberschriften in der SVG.
- Pfeile müssen technisch so gebaut sein, dass die Linie nicht sichtbar über die Spitze hinausragt.
- Pfeilspitzen müssen proportional zur Achse oder Verbindung sein; keine übergroßen Pfeilköpfe bei kurzen oder kompakten Achsen.
- Marker, Kreuze, Punkte und Labels dürfen nicht auf Pfeilspitzen oder Achsenenden liegen, außer dies ist fachlich explizit beabsichtigt und dokumentiert.
- Achsen- und Zeitachsenbeschriftungen müssen vollständig innerhalb der vorgesehenen Layoutzone liegen; Text darf nicht aus Boxen oder grauen Flächen herauslaufen.
- Sichtbare Folientitel, automatisch übernommene Hauptüberschriften und unnötige Zusammenfassungsboxen sind technische Freigabefehler, wenn der SVG-Vorschlag nur die Grafikkomponente liefern soll.
- Bei Build-/Reveal-Sequenzen muss es ein Master-SVG oder eine dokumentierte Layer-Struktur geben; mehrere isolierte Nachbauten derselben Animation sind ein Freigabefehler.
- Eingebundene PNG-Piktogramme müssen projektlokal referenziert sein und dürfen keinen eingebrannten Fachtext enthalten.
- Für Diagramm-SVGs reicht XML-Validität nicht aus; mindestens ein Render-/Viewer-Check muss dokumentiert sein.
- Highlight-Flächen dürfen in der SVG-Reihenfolge nicht nach den Texten liegen, wenn sie diese überdecken könnten.
- Diagramme erfüllen die dokumentierten Struktur- und Geometriebedingungen aus `workflow/diagram-guidelines.md`.
- Jede sichtbare Achse besitzt eine Pfeilspitze am Achsenende; Schaft und Spitze haben keinen sichtbaren Spalt oder Überstand.
- Fachliche Achsen besitzen Labels oder eine dokumentierte Skizzenausnahme.
- Achsentitel verwenden die geometrische Mitte des geraden Achsenstrichs als Ausrichtungspunkt; Pfeilspitzen werden nicht mitgerechnet.
- Vertikale Marker starten an der x-Achse; ihr Endmodus ist innerhalb des Diagramms konsistent.

## SVG-Rebuild-Zusatzpruefung

- SVG-Rebuilds aus PowerPoint-Quellen referenzieren ihren Rebuild-Plan, Zielzustand und ihre Preview-Policy.
- Aufbaufolgen besitzen einen dokumentierten finalen Zielzustand; reine Zwischenstaende duerfen als `skip_preview` markiert sein.
- Ausfall-, Daten- und Zeitmarker sind fachlich positioniert und nicht versehentlich per Equal-Spacing verteilt.

## Output

Der Agent liefert:

- technische Freigabe oder Fehlerliste
- Hinweise zur Pipeline-Kompatibilität
- Liste aller wichtigen IDs und Bildreferenzen
