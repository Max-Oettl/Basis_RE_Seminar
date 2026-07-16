# Timeline Workflow

Diese Regeln gelten fuer generische Timelines, Ausfall-Zeitachsen, Beobachtungsfenster, Prozessachsen und Reveal-Achsen. Sie sind keine Python-Plots.

## Abgrenzung Zu Python-Plots

Eine Timeline bleibt SVG-Komposition, wenn sie:

- Ereignisse entlang einer Zeitachse erklaert,
- Ausfaelle oder Zensierungen didaktisch markiert,
- Ausfaelle nur als `X`/Kreuzmarker und Zensierungen nur als Marker/Pfeile zeigt,
- Prozessschritte oder Aufbauzustaende zeigt,
- keine zweite Achse, keine echte statistische Achsenskalierung und keine Fit-Kurve braucht.

Sobald eine Darstellung eine y-Achse, Objektzeilen mit Achsenbezug, Achsenskalierung, Datenpunkte, Fit-Linien, Kurven, Wahrscheinlichkeitsnetz, Verteilung oder Vertrauensgrenzen fachlich berechnet oder ablesbar darstellt, gilt `workflow/31-python-plots/python-plot-workflow.md`.

## Gestaltung

- Achsenpfeile proportional zeichnen.
- Marker nicht auf Pfeilspitzen oder Pfeilkoepfe setzen.
- Ausfaelle auf Zeitachsen werden standardmaessig unregelmaessig verteilt, weil reale Ausfallzeiten selten aequidistant auftreten.
- Gleichmaessige Abstaende sind nur erlaubt, wenn die Quelle exakt gleichmaessige Ereignisse zeigt oder die Szene ausdruecklich eine abstrakte Prozessfolge statt Zeitdaten meint.
- Wenn keine exakten Zeiten vorliegen, eine natuerliche illustrative Verteilung verwenden: kleine Cluster, groessere Luecken und klar erkennbare Reihenfolge. Beispiel fuer sieben Ausfaelle auf 100 % Achsenlaenge: `8 %, 19 %, 31 %, 46 %, 61 %, 79 %, 91 %`, nicht `14 %, 28 %, 42 %, ...`.
- Wenn Ausfaelle bewusst didaktisch statt datengetreu platziert werden, dies im Szenenbrief als `illustrative_irregular_timeline` dokumentieren.
- Ausfaelle, Zensierungen und Beobachtungsende visuell eindeutig unterscheiden.
- Labels mit genug Abstand setzen; bei kleinen Szenen lieber wenige Labels als unlesbare Vollbeschriftung.
- Zeitachsen nur dann mit Zahlen versehen, wenn Zahlen fachlich relevant sind.

## Animation

- Aufbauzustand als Gruppen-Layer planen, z.B. Achse, Ausfaelle, Zensierungen, Legende.
- Wenn mehrere PowerPoint-Folien nur eine Timeline aufbauen, ein Master-SVG mit Layern erzeugen.
- Zwischenfolien duerfen Preview-Zustaende sein, muessen aber nicht als eigenstaendige Nachbauten entstehen.
- Wenn eine Quellfolie inhaltlich nur der Fade-/Reveal-Uebergang zwischen zwei Nachbarfolien ist, wird sie im Analyseplan als `transition_only` oder `skip_preview` markiert. Dann wird kein neues inhaltliches Content-SVG erfunden; die Information wird ueber das Animation-Manifest der zusammengehoerigen Szene getragen.

## QA

Eine Timeline ist nicht fertig, wenn:

- Marker Pfeilspitzen beruehren,
- Ausfallmarker ohne fachlichen Grund gleichmaessig gerastert wirken,
- Labels kollidieren,
- Ausfaelle und zensierte Beobachtungen verwechselt werden koennen,
- die Timeline als Python-Plot erzeugt wurde, obwohl sie nur didaktischer Aufbau ist,
- ein Sprechertext-Ereignis fehlt.
