# RelTest Education Design Quality Bar

Diese Datei definiert die Mindestqualität für produktive SVG-Grafiken.

## Zielbild

RelTest Education Grafiken sollen wirken wie hochwertige technische Weiterbildung für Ingenieure:

- präzise
- ruhig
- klar
- professionell
- didaktisch fokussiert
- visuell konsistent

Sie sollen nicht wirken wie schnell zusammengesetzte Platzhaltergrafiken.

## Nicht Akzeptabel

Eine SVG ist nicht freigabefähig, wenn einer dieser Punkte zutrifft:

- Text überschneidet sich ungewollt mit Symbolen, Linien, Markern, Flächen oder Achsen.
- Beschriftungen sind so klein, dass sie im Video gequetscht oder nebensächlich wirken.
- Icons wirken aus primitiven Einzelteilen improvisiert, obwohl sie ein zentrales Motiv sind.
- Pfeile sind unsauber konstruiert, z. B. wenn Linien sichtbar durch Pfeilspitzen laufen.
- Vordergrund- und Hintergrundelemente verdecken sich unbeabsichtigt.
- Highlight-Flächen liegen über Texten oder wichtigen Markern und verdecken diese durch ihre Füllung.
- Achsenbeschriftungen stehen so weit von der Achse entfernt, dass sie nicht mehr eindeutig zugeordnet wirken.
- Eine sichtbare Achse besitzt keine Pfeilspitze oder die Pfeilspitze endet nicht exakt am Achsenende.
- Ein fachliches Diagramm besitzt unbeschriftete x- oder y-Achsen, ohne als begründete Skizze dokumentiert zu sein.
- Ein Achsentitel ist nicht auf der Mitte des zugehörigen Achsenstrichs ausgerichtet.
- Datenpunkte liegen neben einer Linie, obwohl sie diese Linie erklären sollen.
- Eine Markerlinie im Modus `curve_intersection` ragt über die Kurve hinaus oder endet vor ihr.
- Vertikale Markerlinien beginnen nicht exakt an der x-Achse oder verwenden uneinheitliche Endhöhen.
- Eine Karte oder ein Bereich enthält zu viele Texte und wirkt vollgestellt.
- Die Grafik übersetzt das Storyboard nur mechanisch, ohne klare visuelle Idee.
- Verschiedene Szenen wirken wie unterschiedliche Designsysteme.
- Neue SVGs verwenden noch die Altbezeichnung `RelTest Academy`, das Profil
  `reltest-academy` oder eine Solutions-dominante Cyan-Signatur.
- Inhaltstext verwendet nicht Archivo oder Headlines/Auszeichnungen verwenden
  nicht Oxanium.
- Die Grafik wirkt wie eine PowerPoint-Folie mit großer Überschrift statt wie ein eigenständiges Bild- oder Diagrammelement.
- Ein SVG-Vorschlag enthaelt einen automatisch gesetzten sichtbaren Folientitel, obwohl der Titel spaeter im Folien-/Videolayout ergaenzt wird.
- Fazit-, Merksatz- oder Zusammenfassungsboxen werden ohne didaktische Notwendigkeit eingefuegt.
- Datenpunkte, Ausfallkreuze oder Marker liegen auf Pfeilspitzen oder Pfeilkoepfen.
- Achsentitel oder Labels ragen aus ihrer Box oder dem vorgesehenen Layoutbereich heraus.

## Icon-Qualität

Zentrale Icons und Motive müssen entweder:

- als saubere SVG-Pfade gestaltet sein,
- aus einer wiederverwendbaren Komponentenbibliothek stammen,
- als hochwertige projektlokale Raster-Piktogramme eingebettet werden,
- oder bewusst abstrakt und hochwertig visualisiert werden.

Grobe Ersatzkonstruktionen aus Kreisen, Rechtecken und Strichen sind nur erlaubt, wenn das Ergebnis trotzdem professionell wirkt und das Motiv nicht im Fokus steht.

Wenn ein Motiv als SVG-Pfad nicht hochwertig genug gelingt und nicht einzeln animiert werden muss, ist ein eingebettetes Raster-Piktogramm oft die bessere Lösung.

Neue Piktogramme muessen ausserdem das Stilprofil
`reltest-education-minimal-v1` und
`workflow/30-visual-decision/pictogram-creation-workflow.md` erfuellen. Nicht
akzeptabel sind insbesondere kleine 3D-Renderings, isometrische Perspektiven,
Verlaeufe, Glanz, Schatten, Glow, Texturen, Sticker-/Emoji-Optik, eingebrannter
Text oder ein nicht transparenter Rasterhintergrund.

E-Learning-Freigabe verlangt eine eindeutige Begriffszuordnung, erkennbare
Silhouette bei 48 px, pruefbaren Szenenrender bei 960x540, mindestens 3:1
Kontrast fuer bedeutungsrelevante Teile und eine nicht allein farbcodierte
Bedeutung.

## Textqualität

- Inhaltstext verwendet Archivo; Headlines und Auszeichnungen verwenden Oxanium.
- Sora, Inter, Segoe UI und Arial sind keine fuehrenden Markenschriften mehr.
  Arial/Helvetica sind nur technische Fallbacks hinter Archivo.
- Text in Grafiken ist sparsam einzusetzen.
- Der Sprechertext trägt die Erklärung; die Grafik zeigt Struktur, Beziehung und Kernidee.
- Labels müssen groß genug und klar lesbar sein.
- Deutsche Texte verwenden echte Umlaute und `ß`.
- Produktive Dateien dürfen keine Mojibake-Fragmente enthalten, z. B. `Ã`, `Â`, `Î`, `â` oder `áµ`.
- Text braucht sichtbaren Freiraum zu allen grafischen Elementen.

## Layoutqualität

- Jedes wichtige Element braucht ausreichend Raum.
- Eine Grafik darf nicht dadurch gelöst werden, dass immer mehr kleine Texte eingefügt werden.
- Abstände müssen bewusst wirken, nicht zufällig.
- Layer-Reihenfolge muss fachlich und visuell stimmen.
- Hintergrundelemente dürfen keine primären Informationen stören.
- Neue Grafiken bekommen keine automatisch gesetzten Folienüberschriften. Titel werden nur eingebaut, wenn sie ausdrücklich Teil der Grafik sind.
- Highlight-Flächen werden vor Text und Labels gezeichnet, damit die Schrift lesbar bleibt.
- Wenn eine Highlight-Fläche über bestehenden Elementen liegen muss, braucht sie niedrige Deckkraft und darf keine Aussage verdecken.
- Achsenlabels stehen nah an der Achse, mit genug Abstand zu Ticks und Pfeilspitzen, aber ohne lose im Raum zu stehen.
- Achsentitel werden folienübergreifend einheitlich auf der geometrischen Mitte des jeweiligen Achsenstrichs ausgerichtet.
- Diagrammpunkte und Kurven müssen geometrisch zusammenpassen.
- Für Diagramme ist `workflow/diagram-guidelines.md` verbindlich.

## Pfeile Und Verbindungen

- Pfeilspitzen müssen sauber an Linien anschließen.
- Linien dürfen nicht sichtbar über die Pfeilspitze hinausragen.
- Die bevorzugte Konstruktion ist eine Linie, die vor der Spitze endet, plus separate Pfeilspitze als Polygon.
- Bei Markern muss explizit geprüft werden, ob der Linienabschluss sichtbar in oder über die Spitze läuft.
- Verbindungslinien müssen hinter Textknoten liegen.
- Pfeile sollen Bedeutungen klar verbinden und nicht dekorativ verstreut wirken.

## Merksatzband

- Merksätze am unteren Bildrand verwenden das Takeaway-Band aus `components/takeaway-band.md`.
- Das Band ist marineblau, hat links eine signalgruene Akzentleiste und eine
  dezente signalgruene Innenkontur.
- Die erste Zeile enthält die Kernaussage, die zweite Zeile nur eine kurze Präzisierung.
- Unterschiedliche Fazitbox-Stile zwischen Szenen sind nicht akzeptabel, wenn kein bewusster didaktischer Grund dokumentiert ist.

## Formeln

- Formeln müssen typografisch sauber wirken und dürfen nicht wie defekte Zeichencodierung aussehen.
- Keine Formeln als ungeprüfte Unicode-Zeichenkette einfügen.
- Indizes und Exponenten werden mit `tspan`, `baseline-shift`, eigener Schriftgröße und ausreichendem Zeilenabstand gesetzt.
- Formelboxen brauchen mehr Weißraum als normale Textboxen.
- Wenn die Formel nicht sauber lesbar gesetzt werden kann, wird sie vereinfacht oder in mehrere strukturierte Zeilen aufgeteilt.

## Freigabe

Vor Freigabe muss eine Grafik mindestens diese Fragen bestehen:

- Wirkt die Grafik ohne Erklärung professionell?
- Ist die zentrale Aussage in wenigen Sekunden erfassbar?
- Gibt es irgendwo sichtbare Kollisionen?
- Sind die wichtigsten Symbole hochwertig genug?
- Sind Texte, Abstände und Layer sichtbar kontrolliert?
- Sind Umlaute, `ß` und Formelzeichen korrekt codiert und gerendert?
- Sitzen alle Pfeilspitzen sauber?
- Verdeckt keine Highlight-Fläche Text oder wichtige Marker?
- Ist die Grafik frei von nicht angeforderten PowerPoint-artigen Überschriften?
- Sind Achsenlabels eindeutig der Achse zugeordnet?
- Liegen Punkte und Marker wirklich an den Kurven oder Linien, die sie erklären?
- Besitzt jede Achse einen sauber abschließenden Pfeil und eine eindeutige Beschriftung?
- Sitzt jeder Achsentitel mittig am zugehörigen Achsenstrich?
- Beginnen vertikale Marker exakt an der x-Achse und enden sie nach einem einheitlichen Modus?
