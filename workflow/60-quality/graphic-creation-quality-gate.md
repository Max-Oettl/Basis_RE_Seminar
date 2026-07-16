# Grafik-Erstellungsworkflow Und Qualitätsgate

Dieses Dokument beschreibt, wie eine einzelne Reltest-Academy-Grafik erstellt und vor der Freigabe geprüft wird.

Ziel ist keine PowerPoint-Folie, sondern ein sauberes Content-SVG, Bild- oder Diagrammelement fuer E-Learning und spaetere PowerPoint-Einbettung. Titel, Kapitelueberschriften und lange erklaerende Texte gehoeren nur dann in die Grafik, wenn sie ausdruecklich Teil des gewuenschten Inhaltsmoduls sind.

Das SVG darf keine globalen PowerPoint-Masterelemente enthalten: keine Foliennummer, keinen Footer, keine Logo-Leiste, keinen Praesentationsrahmen, keinen Deck-Header und keine wiederkehrende Navigation. Diese Elemente werden spaeter durch PowerPoint oder einen separaten Layoutschritt ergaenzt.

## 1. Auftrag Klären

Vor der Gestaltung müssen diese Punkte klar sein:

- Welche einzelne Aussage soll die Grafik zeigen?
- Welche Elemente sollen später animiert werden?
- Gibt es isolierte PNG-Piktogramme oder wird die Szene SVG-nativ als Diagramm gebaut?
- Welche Gruppen sollen stabile IDs für `scene.animation.v1.json` bekommen?
- Welche Content-SVG-Metadaten gelten: `artifactScope`, `embeddingTarget`, `slideType`, `layoutIntent`, `takeaway`, `density`, `contentMode`, `backgroundMode`, `brandProfile`, `brandVariant`?
- Welche Brand-/Design-Tokens aus `brand/company-brand-tokens.json` werden verwendet?

Wichtig: Die Grafik ist nicht die ganze Folie. Sie darf keine automatische PowerPoint-Überschrift bekommen und auch keine neu erfundene sichtbare Meta-Zeile wie Modulnummer, Foliennummer, Workflow-Variante oder Szenenfokus.

## 1a. Asset-Entscheidungs-Gate

Vor dem ersten SVG-Code gilt `workflow/svg-asset-decision-gate.md`.

Jedes visuelle Element wird klassifiziert:

- Echtes technisches Diagramm, Kurve, Verteilung, Weibull-Netz oder Datenplot: zuerst Python Plot Library unter `components/python-plot-library/` nutzen; falls kein Generator passt, neuen Generator erstellen.
- Generische Timeline, Aufbauachse oder Ausfall-Zeitstrahl: als didaktische SVG-Komposition planen, nicht als Python-Plot erzeugen.
- Formel, Tabelle, Prozesspfeil oder einfacher Marker: normalerweise SVG-nativ.
- Library-Element: nur als angepasste Vorlage, nicht als blind kopierte Komponente.
- Piktogramm, Werkzeug-/Methodensymbol, source-spezifisches Icon, realistisches Objekt oder Illustration: PNG-Asset erzeugen, extrahieren oder vom Nutzer anfordern.
- Alte PowerPoint-Dekoration ohne fachliche Funktion: weglassen oder begruendet als `omit_with_reason` dokumentieren.

Ein komplexes Piktogramm darf nicht als improvisierte Linien-/Pfad-SVG umgesetzt werden. Wenn die konkrete Form fuer die Bedeutung wichtig ist, ist ein PNG-Asset Pflicht.

Bei Nutzerfeedback wird dieses Gate erneut angewendet, bevor gepatcht wird.

## 2. Visuelle Struktur Entwerfen

Die Gestaltung folgt diesem Prinzip:

- Erst die Kernvisualisierung bauen.
- Danach nur die nötigsten Labels ergänzen.
- Merksätze nur als standardisiertes Takeaway-Band unten setzen.
- Text nie verwenden, um ein unklar gestaltetes Bild zu retten.

Wenn die Grafik ohne Sprechertext nicht sofort sauber wirkt, muss die Struktur verbessert werden, nicht die Schrift verkleinert werden.

## 3. Layer-Reihenfolge

Die SVG-Reihenfolge muss bewusst aufgebaut sein:

1. Hintergrund
2. statische Flächen und Panels
3. Raster, Achsen und Verbindungslinien
4. Datenpunkte, Marker, Icons und primäre Diagrammelemente
5. Highlight-Flächen mit niedriger Deckkraft
6. Konturen von Highlight-Flächen
7. Texte, Labels und Formeln
8. Merksatzband, wenn es unten als eigene Schlussaussage erscheinen soll

Highlight-Flächen dürfen Text nicht überdecken. Wenn ein Highlight hinter einem Text liegen soll, wird zuerst die Highlight-Fläche gezeichnet und danach der Text. Wenn ein Highlight eine Fläche überlagert, muss `fill-opacity` niedrig genug sein, damit darunterliegende Information sichtbar bleibt.

## 4. Pfeile Und Linien

Pfeile müssen professionell konstruiert sein:

- Die Linie endet vor der Pfeilspitze.
- Die Pfeilspitze wird als eigenes Polygon oder sauber kontrollierter Marker gesetzt.
- Die Linie darf nicht sichtbar durch die Pfeilspitze hinausragen.
- Verbindungspfeile liegen hinter Textboxen.
- Pfeile verbinden eine konkrete Bedeutung und sind keine Dekoration.

Bevorzugtes Muster für SVG-native Pfeile:

```xml
<line class="arrow-line" x1="100" y1="200" x2="300" y2="200" />
<polygon class="arrow-head" points="330,200 300,184 300,216" />
```

Bei Achsen gilt dasselbe Prinzip: Achsenlinie endet vor der Spitze, Pfeilspitze ist separat.

## 5. Achsen, Marker Und Diagrammgeometrie

Für Diagramme und Verteilungen gilt vollständig `workflow/diagram-guidelines.md`.

Technische Diagramme sind Python-first. Achsen, Datenpunkte, Fit-Linien, Wahrscheinlichkeitsnetze, Verteilungen und Vertrauensgrenzen werden ueber `components/python-plot-library/` erzeugt. SVG-native Hilfsgrafiken sind nur fuer einfache `X`-/Zensur-Timelines oder achsenlose Erklaerskizzen ohne Plotgeometrie zulaessig.

Achsenbeschriftungen und Datenmarker müssen geometrisch plausibel sitzen:

- Jede sichtbare Achse hat eine Pfeilspitze am exakten Achsenende.
- Fachliche x- und y-Achsen sind beschriftet; Ausnahmen sind nur als dokumentierte Skizze zulässig.
- Achsentitel sind geometrisch auf der Mitte des jeweiligen geraden Achsenstrichs ausgerichtet; die Pfeilspitze zählt nicht zur Achsenlänge.
- Der x-Achsentitel steht mittig unter dem Strich, der y-Achsentitel mittig neben dem Strich und standardmäßig um `-90°` gedreht.
- Achsenlabels stehen nah an der jeweiligen Achse, typischerweise 18 bis 28 px Abstand.
- Labels dürfen Tickmarks oder Pfeilspitzen nicht berühren, aber sie dürfen auch nicht lose weit entfernt wirken.
- Datenpunkte in Regressions- oder Weibull-Diagrammen liegen auf der dargestellten Linie, wenn sie eine Position auf dieser Linie erklären sollen.
- Wenn Punkte bewusst leicht daneben liegen, muss das didaktisch beabsichtigt sein und sichtbar als Abweichung markiert werden.
- Vertikale Markerlinien für Modalwert, Mittelwert oder Median folgen exakt dem dokumentierten Modus: Schnittpunkt mit der Kurve oder gemeinsame Höhe oberhalb des Graphen.
- Vertikale Markerlinien beginnen exakt an der x-Achse und verwenden pro Diagramm einheitlich den Modus `curve_intersection` oder `common_height`.
- Highlight-Boxen in Tabellen werden vor Zelltexten gezeichnet, damit Zahlen und Begriffe lesbar bleiben.

Für Ausfall-Zeitachsen gilt zusätzlich:

- Ausfallmarker werden nicht in gleichen Abständen platziert, solange keine echten gleichmäßigen Zeiten vorliegen.
- Illustrative Ausfallfolgen bekommen natürliche Abstände mit kleineren Clustern und größeren Lücken.
- Gleichmäßige Abstände sind nur für abstrakte Prozessschritte zulässig, nicht für Lebensdauer-/Ausfallzeitdaten.

## 6. Texte Und Überschriften

Neue Grafiken bekommen standardmäßig keine große Folienüberschrift.

Harte Titelregel:

- Kein sichtbarer globaler Titel im SVG.
- Keine sichtbaren Kicker wie `RE3_TEST_1 · Folie 03`.
- Keine sichtbaren Workflow-Hinweise wie `neuer Workflow`, `Variante`, `Quelle` oder `Fokus`.
- Keine erklärende Fokuszeile oben links, wenn sie nicht direkt Teil der Grafik ist.
- Erlaubt sind `<title>` und `<desc>` im SVG-Markup sowie Titel in Manifesten, Reports oder Viewer-Metadaten.

Erlaubt sind:

- kurze Labels direkt an Diagrammen
- kleine Bereichstitel innerhalb einer Karte oder Achse
- knappe Formeln
- ein Takeaway-Band unten, wenn ein Merksatz ausdrücklich gebraucht wird

Nicht erlaubt sind:

- automatisch gesetzte Szenentitel oben links
- große PowerPoint-artige Überschriften, die nur den Szenentitel wiederholen
- kleine Meta-Header, die wie ein technischer Dateikopf wirken
- Textblöcke, die eigentlich vom Sprechertext getragen werden sollen

## 6a. Textboxen Und Text-Fit

Boxen mit Text duerfen erst gebaut werden, wenn der Text sichtbar hineinpasst. Das ist ein Pflichtpunkt, kein kosmetisches Detail.

Planungsregeln:

- Jede Textbox, Karte, Merkbox und Legende bekommt vor dem SVG-Code eine geplante Innenreserve.
- Standardreserve: mindestens 24 px links/rechts/oben/unten; bei kleinen Diagramm-Labels mindestens 16 px.
- Der laengste Text wird vorab in Zeilen aufgeteilt. SVG-Text bekommt explizite `tspan`-Zeilen statt erwarteten Auto-Umbruch.
- Eine Box darf nur so viel Text enthalten, wie in maximal drei ruhigen Zeilen lesbar bleibt. Bei mehr Text wird die Aussage gesplittet, die Box vergroessert oder die Box entfernt.
- Text darf nicht durch extremes Verkleinern gerettet werden. Wenn die Schrift unruhig klein wird, ist das Layout falsch.
- Wenn die Box nur eine Folie "zusammenfasst", wird sie weggelassen, sofern der Sprechertext die Aussage tragen kann.

Review-Regeln:

- Im gerenderten SVG wird jede Box einzeln betrachtet.
- Text darf weder rechts, links, oben noch unten ueber die Box hinausragen.
- Text darf den Boxrand nicht beruehren; optisch muessen Innenraum und Zeilenabstand erkennbar sein.
- Lange Woerter, Formeln, Prozentwerte und Achsenlabels werden besonders geprueft.
- Ein einziger Boxtext-Ueberlauf ist ein Freigabefehler und fuehrt zur Korrektur und zum erneuten Render.

## 7. Formeln

Formeln werden strukturiert gesetzt:

- eigene Formelgruppe mit ID
- Indizes und Exponenten als `tspan`
- Spezialzeichen als XML-Entity oder robuster SVG-Textbaustein
- genug Weißraum um die Formel

Keine fragile Unicode-Formel als einzelner Textstring.

## 8. Encoding-Prüfung

Nach jeder Erstellung wird geprüft:

- echte Umlaute: `ä`, `ö`, `ü`, `Ä`, `Ö`, `Ü`, `ß`
- keine ausgeschriebenen Ersatzformen wie `ae`, `oe`, `ue`, wenn ein Umlaut gemeint ist
- keine Mojibake-Codepoints wie `U+00C3`, `U+00C2`, `U+00CE`, `U+00E2` oder falsch zerlegte Diakritik

Wenn ein Generator per Windows PowerShell läuft, muss er entweder BOM-sicher sein oder die erzeugten Dateien werden direkt danach geprüft.

## 9. Endprüfung Vor Freigabe

Eine Grafik ist erst fertig, wenn alle Punkte erfüllt sind:

- SVG ist XML-valide.
- Alle Animation-Targets aus `scene.animation.v1.json` existieren im SVG.
- Keine alten Zeittrigger oder `<animate>`-Zeitblöcke sind enthalten.
- Kein Text überschneidet Achsen, Linien, Marker, Icons oder Highlight-Flächen.
- Kein Text laeuft aus einer Box, Karte, Legende, Merkbox oder einem Panel heraus.
- Kein Boxtext beruehrt den Rand; Innenabstand und Zeilenabstand sind im Render sichtbar ausreichend.
- Alle mehrzeiligen Boxtexte haben explizite Umbrueche und wurden im gerenderten SVG geprueft.
- Achsenlabels sind nah genug an der Achse und nicht lose im Raum.
- Jede Achse besitzt eine Pfeilspitze, die exakt am Achsenende abschließt.
- Fachliche Achsen sind beschriftet oder die Skizzenausnahme ist dokumentiert.
- Achsentitel sitzen einheitlich auf der geometrischen Mitte des jeweiligen Achsenstrichs.
- Datenpunkte, die eine Linie repräsentieren, liegen tatsächlich auf dieser Linie.
- Markerlinien beginnen exakt an der x-Achse und enden gemäß dokumentiertem Endmodus.
- Pfeilspitzen sitzen korrekt am Linienende.
- Keine Linie ragt sichtbar über eine Pfeilspitze hinaus.
- Highlight-Flächen verdecken keine Texte oder zentralen Marker.
- Layer-Reihenfolge ist bewusst und nachvollziehbar.
- Das Merksatzband entspricht `components/takeaway-band.md`.
- Die Grafik enthält keine PowerPoint-artige Folienüberschrift, außer sie wurde ausdrücklich angefordert.
- Umlaute, `ß` und Formeln sind korrekt gerendert.

- Komplexe Piktogramme oder source-spezifische Icons sind als PNG/image eingebunden, nicht als improvisierte Linien-/Pfad-SVG.
- Alle eingebundenen PNG/image-Assets existieren lokal, sind im Render sichtbar erkennbar und im Asset-Manifest oder Szenenbrief dokumentiert.

## 10. Automatisches SVG-QA-Gate

Nach der manuellen Endpruefung wird das automatische QA-Gate ausgefuehrt:

```powershell
node tools\svg-rebuild-qa.js <module_id> --viewer --slides <range> --expect-all
```

Der Report wird standardmaessig hier abgelegt:

```text
analysis/render-checks/<module_id>/automated-svg-qa/svg-qa-report.md
```

Freigabe-Regel:

- `0 errors` ist Pflicht.
- Warnings werden behoben oder im Reviewbericht bewusst akzeptiert.
- Der automatische Check ersetzt nicht den visuellen Rendercheck; er faengt wiederkehrende technische und organisatorische Fehler ab.
