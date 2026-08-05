# Chapter Implementation Quality Contract

Dieser Vertrag gilt, sobald ein Nutzer die Umsetzung eines Kapitels, einer Lektion
oder einer zusammenhaengenden Folienfolge beauftragt. Er ergaenzt den allgemeinen
Slide-Redesign-Workflow um verbindliche Freigabestufen. Eine technisch valide SVG
ist noch keine freigegebene Seminarfolie.

## 1. Referenzdesign Verriegeln

Vor Planung oder SVG-Code wird eine konkrete Designreferenz dokumentiert:

- exaktes Referenzmodul und mindestens drei repraesentative freigegebene Ziel-SVGs,
- `artifactScope`, `embeddingTarget`, Brandhintergrund sowie Downstream-Eigentum an Titel- und Footerzone,
- Typostufen, Kartenradien, Strichstaerken, Pfeilkoepfe und Bildsprache,
- verwendete Tokenquelle und wiederzuverwendende Komponenten,
- bewusst erlaubte Abweichungen mit didaktischer Begruendung.

Nennt der Nutzer ein bestehendes Modul als Stilreferenz, sind dessen tatsaechliche
Ziel-SVGs massgeblich. Eine gleichnamige Kapitelnummer, ein alter Content-SVG-Stand
oder eine allgemeine Brandpalette darf diese Referenz nicht ersetzen.

Bei einem Kapitelauftrag ist `module_redesign` der Planungsmodus. Der Zielmodus
jeder Szene wird daraus explizit als `full_slide` oder `content_svg` abgeleitet.
Zeigt die benannte Referenz fertige Vollfolien, wird ohne gegenteiligen
Nutzerauftrag ebenfalls `full_slide` verwendet.

Ohne ausgefuellten Referenz-Lock darf die Kapitelproduktion nicht starten.

## 2. Kapitel Zuerst Vollstaendig Planen

Vor der ersten Ziel-SVG werden alle Quellfolien des beauftragten Kapitels und ihre
Sprechertexte gemeinsam gesichtet. Der Sequenzplan dokumentiert:

- Kapitel-, Lektions- und Foliengrenzen,
- echte Einzelfolien, Aufbauzustaende, Dubletten und zusammenzufuehrende Sequenzen,
- vollstaendigsten fachlichen Endzustand jeder Sequenz,
- wiederkehrende Komponenten, Motive, Diagramme und Fallbeispiele,
- Informationsfluss zwischen aufeinanderfolgenden Szenen,
- geplante statische oder animierte Zielszene,
- erforderliche Bild-, Piktogramm-, Plot-, Formel- und Timeline-Assets,
- Produktionsreihenfolge nach Abhaengigkeiten statt nur nach Dateinummer.

Jede Quellfolie bekommt eine eigene Sichtungszeile. Eine Dateiliste, ein
Kontaktbogen oder eine pauschale Kapitelbeschreibung reicht nicht.

## 3. Quelleninhalt Gegen Freie Erfindungen Sichern

Das Inhaltsinventar kennt neben `must_preserve`, `reframe`, `visual_replace` und
`decorative_remove` auch `target_addition`.

Jedes sichtbare Zielobjekt ohne direktes Quellelement braucht genau einen Beleg:

- Sprechertext,
- ausdruecklichen Nutzerauftrag,
- notwendige, rein orientierende BrandFrame-Funktion,
- dokumentierte didaktische Ergaenzung ohne neue fachliche Aussage.

Neue Fachbegriffe, Kategorien, Beziehungen, Pfeile, Systemgrenzen,
Ursache-Wirkungs-Beziehungen oder Hierarchien ohne solchen Beleg sind Fehler.
Belegte sichtbare Zielergaenzungen werden am betroffenen Textknoten mit
`data-source-evidence="spoken_text|user_request|brand_frame|orientation"` und
einer konkreten `data-source-reference` dokumentiert.
Ein Text-Crosscheck prueft deshalb in beide Richtungen:

1. Fehlt etwas aus Quelle oder Sprechertext?
2. Wurde etwas hinzugefuegt, das dort nicht belegt ist?

## 4. Assetstrategie Pro Sichtbarem Motiv

Vor dem Layout wird fuer jedes fachlich tragende Motiv die Assetentscheidung
ausgefuehrt. Insbesondere gelten als konkrete Motive:

- reale oder schematische Produkte und Maschinen,
- Strommast, Batterie, Wechselrichter, Messgeraet und Haushaltsgeraete,
- Werkzeuge, Personen, Fahrzeuge und anlagenbezogene Bauteile,
- source-spezifische Icons, deren Form die Bedeutung traegt.

Solche Motive duerfen nicht aus wenigen Rechtecken, Kreisen und Linien improvisiert
werden. Sie verwenden ein freigegebenes Library-SVG, ein extrahiertes oder
generiertes Rasterasset oder ein ausdruecklich angefordertes Nutzerasset.

Vor Freigabe wird jedes Motiv im tatsaechlichen Zielmassstab ohne Beschriftung
betrachtet. Ist es dann nicht eindeutig erkennbar oder stilistisch nicht mit der
Sequenz konsistent, gilt die Assetentscheidung als fehlgeschlagen.

## 5. Statischen Endzustand Vor Animation Freigeben

Animation beginnt erst, wenn der vollstaendige statische Endzustand freigegeben ist.
Die Reihenfolge ist verbindlich:

1. statische Komposition erstellen,
2. Ziel-SVG in 1920x1080 rendern,
3. Quelle, Ziel und Referenzdesign direkt vergleichen,
4. Inhalt, Hierarchie, Assets, Kontrast, Strichstaerken und Lesbarkeit korrigieren,
5. statischen Endzustand erneut rendern und freigeben,
6. erst danach semantische Animationsgruppen und Manifest umsetzen.

Animation darf kein unfertiges Layout verdecken und keine falsche Komposition
nachtraeglich legitimieren.

## 6. Text Und Kontrast

- Keine globale `text { fill: ... }`-Regel verwenden, wenn Textobjekte
  unterschiedliche Vordergrundfarben benoetigen. Textfarben ueber eindeutige
  Klassen oder Inline-Styles mit kontrollierter Kaskade setzen.
- Helle Texte auf dunklen Flaechen und dunkle Texte auf hellen Flaechen werden mit
  dem tatsaechlich berechneten Renderstil geprueft, nicht nur anhand des
  `fill`-Attributs im Quelltext.
- Box, Text, Icon und Hintergrund werden gemeinsam im End- und Animationszustand
  gerendert. Ein vorhandener DOM-Text gilt nicht als sichtbar, solange der
  Kontrastcheck nicht bestanden ist.
- Jeder Primaertext muss auch in der verkleinerten Viewer-Ansicht lesbar bleiben.
- Sichtbarer Folientitel, Titelakzent, Titel-/Footertrenner, Trainingsfooter, Logo
  und Modul-/Szenenkennung duerfen in Ziel-SVGs nicht vorkommen. Titel bleiben nur
  als zugänglicher `<title>`, `contentTitle` und Storyboard-Feld erhalten.

## 7. Pfeile, Linien Und Verbinder

RelTest-Verbindungen bleiben technisch und ruhig:

- bevorzugt 1,5 bis 2,5 px fuer Hilfs- und Standardlinien,
- 4 px fuer fachliche Betonung,
- 6 px als harte Obergrenze fuer normale Folienverbinder,
- groessere Werte nur fuer nachweislich notwendige Spezialgeometrie mit
  `data-qa-heavy-stroke="allowed"` und `data-qa-reason`.

Zusaetzlich gilt:

- Pfeile nur einsetzen, wenn sie Richtung, Fluss, Abhaengigkeit oder Transformation
  transportieren; keine dekorativen Pfeile.
- Pfeilkoepfe optisch zur Strichstaerke skalieren und nie als dominantes Element
  erscheinen lassen.
- Verbinder hinter Knoten und Text legen, freie Korridore verwenden und vor der
  Pfeilspitze sauber enden.
- Ein Pfeil wird erst sichtbar, wenn beide fachlich benoetigten Endpunkte sichtbar
  sind.
- Bei dichtem Layout weniger, dafuer eindeutige Verbindungen verwenden.

Die automatische Strict-Design-QA stoppt nicht begruendete Strichstaerken oberhalb
der Token-Obergrenze.

## 8. Animationsdramaturgie

Die Animationsplanung folgt Sprechertext und Leserichtung, nicht DOM-Reihenfolge.

Fuer jede Szene wird eine Tabelle aus `narrative_beat`, `required_context`,
`semantic_group`, `action` und exakter Triggerphrase erstellt. Dabei gelten:

- Box, Text, Rand und Icon erscheinen atomar.
- Inhalte erscheinen vor Beziehungen; Pfeile und Leitlinien niemals vor den
  Elementen, die sie erklaeren.
- Labels, Marker und Fuehrungslinien erscheinen mit oder nach ihrer Geometrie.
- Keine Mikro-Reveals fuer einzelne Pfade, Zeilen oder dekorative Bestandteile.
- Jeder Schritt muss einen benennbaren didaktischen Nutzen haben.
- Ist die statische Szene klarer, bleibt sie statisch.

Jeder fachlich relevante Zwischenzustand wird gerendert und in realistischer
Viewer-Groesse auf Reihenfolge, Fragmente, Kontrast und Kollisionen geprueft.

## 9. Verbindlicher Dreifachvergleich

Fuer jede Zielszene entstehen mindestens:

- Quellenpreview,
- Zielpreview im vollstaendigen Endzustand,
- Referenzpreview einer vergleichbaren freigegebenen Folie.

Der Vergleich erfolgt in 1920x1080 und in einer verkleinerten Ansicht von
ungefaehr 960x540. Geprueft werden:

- gleiche visuelle Familie und BrandFrame,
- Blickfuehrung und dominante Lernbotschaft,
- Quelltreue und Beziehungstopologie,
- Lesbarkeit und Kontrast,
- Bild- und Piktogrammqualitaet,
- Pfeil-, Linien- und Kartenproportionen,
- Dichte und Weissraum,
- fachlich relevante Animationszustaende.

Fehlt ein Zielrender, eine Referenz oder der verkleinerte Vergleich, ist die Szene
nicht freigabefaehig. Automatische `0 errors` ersetzen diesen Vergleich nicht.
Ist der notwendige Renderer nicht verfuegbar, wird der Zustand als Blocker gemeldet
und nicht als fertig bezeichnet.

## 10. Archetyp-Pilot Vor Serienproduktion

Die erste Szene jedes neuen Folienarchetyps ist ein interner Pilot. Erst wenn sie
alle statischen Gates bestanden hat, duerfen weitere Szenen desselben Archetyps
produziert werden. Wiederverwendet werden danach nur:

- freigegebene BrandFrame- und Layoutkomponenten,
- freigegebene Typo-, Linien- und Pfeiltokens,
- freigegebene Assetstile,
- freigegebene semantische Animationsmuster.

Eine noch ungepruefte CSS-Regel, Assetkonstruktion oder Pfeilsprache darf nicht in
einem Batch auf mehrere Szenen uebertragen werden.

## 11. Kapitelweite Konsistenzpruefung

Nach allen folienweisen Freigaben folgt ein separater Kapiteldurchlauf. Er prueft:

- Abwesenheit duplizierter Titel-, Footer-, Logo- und Szenenkennzeichnungen sowie
  freie Safe Areas fuer die Downstream-Masterzone,
- Typostufen, Kartenradien, Konturen und Abstaende,
- maximale und typische Strichstaerken sowie Pfeilkopfproportionen,
- Farbrollen und Kontrast,
- wiederkehrende Begriffe, Komponenten und Bildassets,
- Informationsdichte und visuellen Rhythmus,
- Animationslogik ueber Szenengrenzen,
- Ausreisser gegen das Referenzmodul.

Mindestens eine Referenzfolie des benannten Moduls bleibt waehrend dieses Sweeps
sichtbar. Ein Kapitel ist erst danach als Gesamtpaket freigabefaehig.

## 12. Definition Of Done

Ein Kapitel darf nur als umgesetzt gemeldet werden, wenn:

- Referenz-Lock und Sequenzplan vollstaendig sind,
- jede Quelle und jeder Sprechertext eindeutig zugeordnet ist,
- jedes sichtbare Motiv eine bestandene Assetentscheidung besitzt,
- keine unbelegten fachlichen Ergaenzungen vorhanden sind,
- keine Downstream-Masterelemente im SVG vorhanden sind,
- jede Szene ihren statischen Rendervergleich bestanden hat,
- Kontrast mit berechnetem Stil geprueft wurde,
- keine unbegruendete Strichstaerke ueber 6 px verbleibt,
- jede Animation erst nach statischer Freigabe erstellt und zustandsweise geprueft
  wurde,
- automatische Strict-QA und visueller Dreifachvergleich bestanden sind,
- die kapitelweite Konsistenzpruefung abgeschlossen ist,
- verbleibende Einschraenkungen offen genannt und nicht als Qualitaetserfolg
  umgedeutet werden.
