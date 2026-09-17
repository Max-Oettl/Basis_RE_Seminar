# Visuelle Designvorprüfung – RE2, 69 aktive Szenen

Datum: 17.09.2026. Unabhängige Sichtprüfung; keine Produktionsdateien verändert. Dies ist eine Vorprüfung des bestehenden Designs, keine Freigabe von Nachherbildern.

## Prüfumfang und Referenz

Alle sechs Kontaktbögen mit den 69 aktiven UI-Szenen wurden gesichtet. Einzelprüfung der Dateien `slide_001`, `slide_013`, `slide_019`, `slide_036`, `slide_066`, `slide_095`, `slide_132` und `slide_153`; die vier dichten Beispiele 019/095/132/153 zusätzlich bei 960 × 540. Zuordnung von UI-Szene zu Datei nach `baseline.json`. Referenz sind die geprüften neuen RE4-Szenen 39, 61, 62 und 63: offene weiße Flächen, Marineblau, klare Abschnittsköpfe, zurückhaltende Konturen und funktionale Akzente.

RE2 verwendet bereits die passenden Grundfarben und Archivo. Der Unterschied zur neuen Serie liegt vor allem in den teilweise fast schwarzen Blöcken, wechselnden Schriftgewichten, stark umrandeten Karten und uneinheitlichen Abschnittsköpfen. Der Aufbau kann deshalb bestehen bleiben. Ein pauschales Übernehmen der größeren RE4-Schriftmaße oder zusätzlicher Kopfzeilen wäre bei vielen RE2-Szenen ungeeignet.

## Konkrete gemeinsame Stiländerungen

1. **Marineblau als gemeinsame Hauptfarbe.** Nicht semantisch unterschiedene native Texte, dunkle Inhaltsköpfe und neutrale Diagrammblöcke von `#031334` auf `#142452` vereinheitlichen. Weißen Text auf dunklen Flächen beibehalten. Bereits passende Marineblauwerte benötigen keine Änderung. Semantische Farbcodes und eingebettete Bilder ausnehmen.
2. **Abschnittsköpfe an die Referenz angleichen.** Vorhandene breite dunkle Überschriftsflächen erhalten die ruhige RE4-Silhouette mit kleiner Fase rechts unten, innerhalb ihrer bisherigen Außenmaße. Die Kopftexte behalten Position, Schriftgröße, Umbruch und Wortlaut. Keine Fase an technischen Ereignisblöcken, Gattern, Tabellenzellen oder Prozessschritten. Frei stehende Überschriften nicht automatisch mit einem neuen breiten Band hinterlegen: dafür fehlt auf einigen Folien der Innenabstand oder eine passende Animationsgruppe.
3. **Große neutrale Karten leichter darstellen.** Bei reinen Inhaltscontainern Konturen von dunklem Marineblau zu einer dezenten Border-Farbe reduzieren und gegebenenfalls die neutrale Füllung zu `#F7F9FC` aufhellen. Die bestehende Gruppierung muss sichtbar bleiben. Technische Blöcke, Systemgrenzen, Tabellenraster und fachlich relevante Hinterlegungen sind keine dekorativen Container und behalten ihre Erkennbarkeit. Besonders geeignet ist UI-Szene 30 (`slide_066`).
4. **Typografie beruhigen, ohne sie umzubauen.** Archivo, vorhandene Schriftgrößen, Zeilenpositionen und Letterspacing erhalten. Für große frei stehende Abschnittsüberschriften ist eine begrenzte Vereinheitlichung sehr schwerer Gewichte 800–860 auf 700/750 möglich. Kein globaler Schriftfamilienwechsel und keine globale Gewichtssenkung für kleine Baum-, Tabellen- oder Prozesslabels: diese sind schon kompakt und benötigen den bisherigen Kontrast. Oxanium nur dort übernehmen, wo ein einzelner vorhandener Header nachweislich ohne neue Umbrüche passt.
5. **Neutrale Trennlinien vereinheitlichen.** Freie horizontale Inhaltslinien können den dezenten RE4-Border-Ton erhalten. Beziehungspfeile, Leitungen und Systemgrenzen behalten Geometrie, Strichmuster, fachlichen Farbcode und vorhandene Stärke. Eine globale Stroke-Regel wäre ungeeignet.
6. **Vorhandene Schlussaussagen optisch öffnen.** Bestehende breite Merksatz-/Ergebnisflächen können rein grafisch an die offene RE4-Darstellung angenähert werden, wenn die Gruppierung und Animation erhalten bleiben: dunkler Text auf heller Fläche statt schwerem dunklem Balken, eventuell ein zurückhaltender grüner Randakzent. Text und Aussage bleiben vollständig erhalten. Kein Entfernen der bisher akzeptierten Hinweise oder doppelten Informationen im Rahmen dieses Auftrags.

## Besondere Risikoszenen

| UI-Szene | Datei | Zu schützender Zusammenhang / Grenze der Stilanpassung |
|---|---|---|
| 1 | `slide_001` | Graue quantitative Seite ist bewusst zurückgenommen. Diese Abstufung nicht durch ein globales Textfarben-Mapping aufheben. |
| 3, 4, 6 | `slide_004`, `slide_006`, `slide_009` | Systemgrenzen, Ebenenflächen, Funktionspfeile und vorhandene Bildmotive tragen Bedeutung; keine pauschale Aufhellung oder neue Rahmen. |
| 7, 9 | `slide_010`, `slide_013` | Fischgrätenform bzw. dichtes Leitungsdiagramm. Szene 9 besitzt unterschiedliche Energie-, Informations-, Mess-, Bordnetz- und Stoffstromfarben; ihre Unterscheidung und die Legende müssen erhalten bleiben. |
| 13 | `slide_019` | Dichte ABC-Tabelle. Kopf, erste Spalte, Zeilenraster und A/B/C-Farbcodes müssen getrennt gestylt werden; Schriftgrößen und Umbrüche erhalten. |
| 16–24 | `slide_024` bis `slide_052` laut Mapping | FTA-Prozessleiste sowie Gatter-/Ereignissymbole. Aktiver grüner Schritt, UND/ODER/NICHT-Zeichen, Negationskreis, Endsymbole und markierte Schnitte sind fachliche Elemente. |
| 25, 27, 28 | `slide_057`, `slide_060`, `slide_061` | Coral markiert gemeinsame Ausfälle/Ursachen und wiederholte Elemente. Diese Farben nicht als dekorative Warnflächen entfernen. |
| 34–69 mit Prozessleiste | jeweils laut `baseline.json` | Kleine mehrzeilige Schritte; keine größeren Fonts, neuen Textabstände oder breiteren Konturen. Der jeweils aktive Schritt muss auf allen Folien identisch behandelt werden. |
| 39, 41, 44, 47, 51 | `slide_083`, `slide_088`, `slide_095`, `slide_101`, `slide_110` | Dichte Hierarchiebäume und angehängte Funktions-/Fehlerzeilen. Keine neuen Innenabstände, Blockgrößen oder Headerfasen an Baumknoten. Besonders 095 besitzt sehr eng gesetzte zweizeilige Funktionsfelder. |
| 40, 54 | `slide_086`, `slide_118` | Technische Zeichnung/Stückliste bzw. Bewertungstabelle sind eingebettete Bilder. Asset und Ausschnitt schützen; Stilangleichung nur über die native Umgebung. |
| 55, 56, 67 | `slide_119`, `slide_122`, `slide_156` | RPZ-/AP-Darstellung mit eingebetteter farbiger Matrix. Rot/Gelb/Grün haben Bedeutung; weder entsättigen noch auf CI-Navy abbilden. |
| 60 | `slide_132` | FMEA-Formblatt mit sehr schmalen Zellen. Weiße Kopftexte, mehrzeilige Spaltentitel, obere blaue und untere grüne Abschnittslogik erhalten. Keine Fasen in Tabellenzellen. |
| 63–65 | `slide_143`, `slide_147`, `slide_153` | Je zwei eingebettete Vergleichsdiagramme. Bildinterne Farben, Labelpositionen und Schärfe lassen sich durch XML-Stile nicht ändern. Assets unverändert lassen; native Überschriften und Trennlinien vereinheitlichen. |

## Umsetzungsempfehlung und spätere Prüfung

Ein rollenbezogener XML-Pass ist geeignet; die Farbe allein reicht nicht als Selektor. Derselbe Farbwert kommt als normaler Text, Container, semantischer Liniencode und Deemphasis vor. Stile deshalb über geprüfte Elemente/IDs und ihre Funktion zuweisen. Keine globale `text { fill: … }`-Regel verwenden.

Vor der breiten Anwendung drei kleine Muster prüfen: UI 30 (`slide_066`) für Inhaltskarten/Abschnittsköpfe, UI 13 (`slide_019`) für eine dichte Tabelle und UI 44 (`slide_095`) für Baumblöcke. Szene 9 (`slide_013`) dient zusätzlich als Farbsemantik-Kontrolle. Die Änderung muss neben der passenden RE4-Referenz erkennbar sein, ohne neue Textumbrüche oder verschobene Beziehungen zu erzeugen.

Textknoten, IDs, Gruppenhierarchie, Transformationswerte, Pfaddaten der fachlichen Diagramme, Bildreferenzen/-maße/-ausschnitte sowie sämtliche Manifestdateien schützen. Neue dekorative Elemente dürfen nicht außerhalb der bestehenden semantischen Animationsgruppe sichtbar bleiben. Nach dem Stilpass alle Endbilder prüfen; bei veränderten animierten Containern und Textfarben zusätzlich Anfangs-, Reveal- und Highlightzustände kontrollieren. Unveränderte Manifestbytes allein garantieren noch keinen unveränderten visuellen Aufbau.
