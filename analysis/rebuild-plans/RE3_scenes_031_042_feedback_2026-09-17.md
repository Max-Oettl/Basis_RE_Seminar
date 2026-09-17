# RE3 – Datenherkunft und Zensierung, Feedback 17.09.2026

## Referenz-Lock und Umfang

`module_redesign`, sieben transparente Content-SVGs 1920×1080 mit unveränderten
Scene_IDs und Originalsprechertexten. RE2 slide_016, slide_023, slide_047 sowie
die akzeptierten RE3 slide_015, slide_017, slide_027 bestimmen CI und Typografie.
Wiederverwendung von `heading`, `plate`, `label` aus dem aktuellen CI-Builder;
keine globale Kopfzeile, kein Footer, keine neuen Piktogramme.

Mapping: 72 Quellen, 0 Fehler/0 Warnungen. Quellen und bisherige Ziele einzeln
unter `analysis/render-checks/RE3/feedback-31-42-2026-09-17/` gerendert und gelesen.

## Quelleninventar und didaktische Entscheidungen

| Quelle | Erhalt und Neuaufbau |
|---|---|
|31|Vier Datenquellen entlang der Produktentwicklung; beide Zunahmepfeile nach rechts|
|32|Gleiche vier Klassen und Pfeilrichtungen; Belastungsarten als Textbeispiele statt wiederholter Symbolbilder|
|33|Prüfstand → Fahrversuch → Feld als übergeordnete Einordnung; Fotos/Piktogramme illustrieren dieselben Kategorien und werden durch präzise Begriffe ersetzt|
|34|Sechs Objekte, 1 unten/6 oben, sechs unregelmäßig verteilte rote Ausfälle, Ende nach letztem Ausfall|
|35|Gleiche Zeilen, Objekte 3/4 rechtszensiert, vier Ausfälle; Nutzerergänzung „Typ 1“ beim Beispiel|
|36|Typ 1: feste Zeit, zufällige Ausfallzahl; identische Geometrie wie 35|
|37|Typ 2: feste Ausfallzahl; Objekt 6 fällt genau am Stopp aus, übrige zwei Objekte zensiert|
|38|Sechs gleichzeitig gestartete Objekte, Zensierung von 1/3/4 zu unterschiedlichen Zeitpunkten; kein erfundener gestaffelter Eintritt|
|39|Gemeinsame Ausgangsbeobachtung: A an 2/5/6, B an 1/3/4, originale Zuordnung und Reihenfolge|
|40|Analyse A: B-Ereignisse am selben Zeitpunkt als Zensierung darstellen|
|41|Analyse B: A-Ereignisse am selben Zeitpunkt als Zensierung darstellen|
|42|Sechs Objektzeilen mit Beobachtungsintervallen; unbekannten Zeitpunkt nicht als exakt beobachtetes Kreuz ausgeben; Bezug zur Beobachtungsauflösung erhalten|

Quell-SVGs und Texte bleiben unverändert. Leisten, die nur die Legende wiederholen,
entfallen auf ausdrücklichen Wunsch. Echte Legenden stehen klein direkt am Plot.
Die Diagramme nutzen einen gemeinsamen Python-Renderer und dieselben Achsen,
Nummern, Marker und Strichstärken. Positionen sind `illustrative_irregular_timeline`,
keine Messdaten; exakte Quellenreihenfolge und Objektzuordnung bleiben erhalten.

## Planung vor Produktion

Szenen 31, 39 und 42 verwenden `density=dense`: vier fachlich verschiedene
Datenquellen, drei Vergleichsansichten beziehungsweise sechs Intervallzeilen plus
Kontrolldetail müssen vollständig erhalten bleiben. Große Schrift und schrittweiser
Aufbau sichern die Lesbarkeit.

| Szene | Statische Komposition | Narrativer Aufbau |
|---|---|---|
|31|Vier offene Spalten mit navy Kategorien, kurze Merkmale, Definitionen von Unsicherheit/Repräsentativität, gemeinsame Entwicklungsrichtung|Begriffe → stark beschleunigt → Laborvarianten/Abwägung → Fahrversuch → Feld → beide zunehmenden Trends|
|34|Kompaktes Sechs-Objekt-Diagramm links, zwei klare Aussagen rechts, integrierte Legende|Objekte → Ausfälle → vollständige Daten → Ende nach letztem Ausfall → Praxisbezug|
|35|Gleicher Diagrammplatz, vier Ausfälle und zwei Zensierungen; „Rechtszensierung · Typ 1“ als Beispielkategorie|Bekannte Beobachtungsdauer → unbekannter späterer Ausfall → Datenaufnahme → Pfeile → gemeinsames Ende|
|36|Zwei gleich große Plots aus demselben Renderer, Typ 1 und Typ 2; Stopplinien und feste/zufällige Größe direkt zugeordnet|Typ 1 und Zeitgrenze → Ausfallzahl zufällig → Typ 2 und Ereignisgrenze → Dauer zufällig → Gemeinsamkeit|
|38|Gleiche Größe/Position wie34/35; zeitlich verschiedene Zensierungspfeile, kompakte Gründe rechts|Ausfälle → verschiedene Beobachtungsenden → zufällige Zensierung → Herausnahmegründe|
|39|Drei kompakte, gleich skalierte Ansichten: Beobachtung, Analyse A, Analyse B; unveränderte Objekt- und Zeitzuordnung|Gemeinsame rote/grüne Ausfälle → B wird in A zensiert → Funktionsfähigkeit bis dahin → umgekehrte Analyse|
|42|Sechs-Objekt-Diagramm links, rechts Vergrößerung eines Intervalls mit zwei Kontrollen; Definition der Beobachtungsauflösung|Unbekannter Zeitpunkt → Intervallgrenzen → Kontrollen → begrenzte zeitliche Auflösung|

Alle Szenen `animated`; exakte Sprecherphrasen lösen semantische Gruppen aus.
Diagrammrahmen mit Achsen/Ticks als Einheit, Ereignisgruppen mit zugehöriger
Legende. Erste fachliche Gruppe erscheint am ersten passenden Satz; Player-Titel
liefert initial Orientierung. Kein Verbinder vor seinen Endpunkten. Keine
erfundenen Sekunden; diskrete Zustandsprüfung im lokalen Chromium.

Produktion je Szene: statischer Render und Pilotfreigabe → Animation →
Content-Crosscheck → strenge SVG/Layout-QA → unabhängige visuelle Prüfung.
Der erste Sechs-Objekt-Plot in 34 ist Pilot für alle folgenden Diagramme.

## Feedback-Lernen

- `module_pattern`: Vergleichsfolge mit stabilem Objekt-/Zeitachsenvertrag.
- `project_rule`: Legenden nicht als zusätzliche Merksatzbox wiederholen.
- `domain_rule`: Quelle entscheidet Ereigniszuordnung, gemeinsame Starts und
  Zensierungsgrenzen; verschiedene Enden begründen keine verschiedenen Starts.
- `local_fix`: Typ 1 schon im Beispiel35 sichtbar; Intervallgraph42 wiederherstellen.
- `qa_gap`: Richtungslogik von Trendpfeilen gegen Wortlaut und Quelle prüfen.

## Verifikation

Abgeschlossen am 17.09.2026. Unabhängige Prüfung durch `/root/visual_review`:
alle sieben Endbilder bei 1920×1080 und 960×540, alle fachlichen Zwischenzustände
einschließlich Fokusbildern. Keine verbleibenden konkreten Darstellungsfehler.
Die Endbilder und 960er-Vorschau stehen in `after/` und `preview/` der Renderwurzel;
`overview.png` zeigt die komplette Folge.

| Szene | Schritte | aktuelle Zustandsbilder | Nachweis |
|---|---:|---:|---|
|31|27|34|`states-v2/slide_031` – früher Quellenüberblick; vier Klassen, beide Trendrichtungen richtig|
|34|11|13|`states/slide_034` – geprüfter Diagrammpilot; Reihenfolge 2→5→1→6→3→4|
|35|15|19|`states-v2/slide_035` – Typ 1, gemeinsamer Stopp; Pfeile und Beobachtungslinien atomar|
|36|18|18|`states-v2/slide_036` – Typ 2 endet genau am vierten Ausfall (Objekt 6)|
|38|9|8|`states-v2/slide_038` – gemeinsame Starts, unterschiedliche Endzeiten für 1/3/4|
|39|21|14|`states/slide_039` – A=2/5/6, B=1/3/4; dieselben Ereignispositionen in allen drei Ansichten|
|42|14|18|`states-v2/slide_042` – sechs Intervalle und Kontrolldetail, kein erfundener exakter Ausfallzeitpunkt|

Insgesamt 124 aktuelle Zustandsbilder. Historische Korrekturrenders bleiben
als Reviewspur erhalten; die oben genannten Ordner sind maßgeblich.

### Behebung der Reviewbefunde

- 31: Anfangs zu lange fast leere Szene. Vier Quellenüberschriften erscheinen
  jetzt bereits beim Überblick „Lebensdauerdaten können auf verschiedene Weise“;
  Merkmale bleiben bis zur jeweiligen Erklärung verborgen. Unbelegtes
  „Simulation/gemeinsam auswertbar“-Takeaway aus Spec und Szenenplan entfernt.
- 35/36: Matplotlib zeichnete Annotation-Pfeile außerhalb des benannten Artist-
  Gruppenlayers. Echte `FancyArrowPatch`-Artists erhalten eigene IDs innerhalb
  der vollständigen Zensierungsgruppe. Erneut alle betroffenen Zustände geprüft.
  Ein zusätzlicher Fokus auf die unbekannte Ausfallzeit schließt die lange
  statische Strecke in 35. Keine Szene hat mehr als 50 gesprochene Wörter
  zwischen den geplanten Aktionen; tatsächliche Audiodauern wurden nicht behauptet.
- 42: Fragezeichen über statt auf der Intervallfläche, konsistent zum Diagramm;
  damit ausreichender Abstand und kein unnötiger Text-/Boxkontakt im Fokuszustand.

### Technische Nachweise

- `qa-final/svg-qa-report.md`: 0 Fehler; Design- und strenge Layoutprüfung über
  16 SVGs und 105 automatische Layoutzustände ohne Befund. Der umfassendere
  Modulscan prüft 83 SVGs und 48 Manifeste. Alle 31 Warnungen betreffen allein
  absichtlich nicht im Format 16:9 erzeugte Plotassets (neun neue in dieser Runde).
  Die sieben Inhaltsfolien selbst sind transparent und 1920×1080.
- Dramaturgievalidator: sieben gültige Pläne, 0 Fehler. Je eine dokumentierte
  Initialzustandswarnung: Player-Titel liefert die Orientierung, erste Inhalte
  erscheinen zur jeweils ersten passenden Originalphrase.
- `node --test tools/re3-transparent-content.test.js tools/re3-censoring-sequence.test.js`:
  8/8 bestanden. Der neue Regressionstest prüft unabhängig die Quellzuordnung,
  gemeinsamen Achsen, Stoppregeln und dass blaue Zensierungspfeile nicht aus ihren
  Animationsgruppen herausfallen.
- Mapping unverändert: 72 Zuordnungen, ein Originaldokument, 0 Fehler/0 Warnungen.
  Kein Originalsprechertext und keine Original-SVG verändert.
- Browserprüfung mit lokalem Chromium: diskrete Zustände, exakte Triggerzuordnung
  und Lesbarkeit. Keine durchgehende Audiowiedergabe geprüft.

### Quellen-Crosscheck

Aktuelle Crosschecks aller sieben Szenen: 0 Fehler und keine unbelegten Zieltexte.
Die automatischen Rohberichte behalten `review_required`; die nicht wörtlich
vergleichbaren Inhalte wurden zusätzlich manuell anhand aller Quellen geprüft.

- 31 (23 Textwarnungen): globale Titel, englische Quelllabels und grammatische
  Varianten. Vier Datenquellen sind vollständig deutsch abgebildet; beide Zunahmen
  und Entwicklungsrichtung bleiben erhalten. Die Ausgangsbilder transportierten
  dieselben Kategorien, die jetzt unmittelbar beschriftet sind.
- 34 (3): globaler Titel, verkürzte Aussage zu vollständigen Ausfällen und
  „Zeit (Lebensdauermerkmal)“ → „Beobachtungszeit t“. Alle sechs Ausfälle sichtbar.
- 35 (6): Titel, fragmentierte Quellsätze und umformulierte Legende. Vier rote
  Ausfälle, zwei blaue Zensierungen und unbekannte weitere Lebensdauer erhalten.
  Die Typ-1-Ergänzung ist direkt als Nutzerauftrag annotiert.
- 36 (28): Quellabsätze und romanische Typnummern wurden in zwei knappe,
  unmittelbar zugeordnete Vergleiche überführt. Fest/zufällig, beide Stoppregeln,
  sechs Objekte und verbleibende intakte Objekte sind vollständig erhalten.
- 38 (11): Titel, Satzfragmente und Legendenwortlaut. Gemeinsamer Beginn,
  drei verschiedene Zensierungsenden und Herausnahmegründe sind im Bild enthalten.
- 39 (17): längere Überschriften, Mechanismusnamen und Legendenfragmente.
  Gemeinsame Beobachtung sowie beide Auswertungen mit A/B-Zuordnung sind sichtbar.
- 42 (7): Titel, Legendenfragmente und „genaue Beobachtungszeit ... nicht bekannt“
  werden durch bekannte Kontrollgrenzen und eindeutig unbekannte Ausfallzeit
  gezeigt. Die sechs Objektzeilen und die Beobachtungsauflösung sind erhalten.

### Rückführung

Einheitlicher Renderer, lokale Daten und Bibliotheksregistrierung umgesetzt.
Legende statt redundanter Merksatzbox und Richtungskontrolle in
`workflow/34-slide-redesign/slide-redesign-workflow.md` ergänzt. Quellidentitäten,
Start-/Endzeitlogik, Intervallunsicherheit und atomare Pfeilgruppen in
`workflow/33-timelines/timeline-workflow.md` festgehalten. Nutzerfreigabe bleibt
offen; keine finale Sperre gesetzt.
