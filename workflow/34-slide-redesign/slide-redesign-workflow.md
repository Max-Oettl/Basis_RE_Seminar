# Slide Redesign Workflow

Dieser Workflow gilt fuer das gezielte Redesign einzelner Folien, zusammenhaengender Foliensequenzen oder ganzer Module im neuen RelTest-Education-Foliendesign.

## 1. Auftrag Und Scope

Vor jeder Bearbeitung dokumentieren:

- Modul und betroffene Quell-/Zielszenen,
- gewuenschter Umfang: einzelne Folie, Sequenz oder ganzes Modul,
- Ausgabemodus: `full_slide`, `content_svg` oder `module_redesign`,
- vorhandene Quell-SVGs und Sprechertexte,
- explizite Nutzerwuensche zu Inhalt, Layout, Assets oder Animation,
- Zielsystem und Zielaufloesung.

Bei einem Kapitel, einer Lektion oder einer Folienfolge ist
`workflow/34-slide-redesign/chapter-implementation-quality-contract.md`
verpflichtend. Der Planungsmodus lautet `module_redesign`; der Zielmodus wird pro
Szene aus der konkreten Designreferenz abgeleitet.

Ohne expliziten Vollfolienauftrag bleibt eine einzelne Einbettungsgrafik im Modus
`content_svg`. Nennt der Nutzer jedoch ein bestehendes Modul als Stilreferenz,
werden dessen tatsaechliche Zielartefakte geprueft. Sind dies Vollfolien, ist auch
die neue Sequenz `full_slide`, sofern nicht ausdruecklich nur Content-SVGs
beauftragt wurden.

### Referenz-Lock

Vor jeder Kapitelproduktion dokumentieren:

- benanntes Referenzmodul und mindestens drei konkrete freigegebene Ziel-SVGs,
- deren Artefaktmodus, BrandFrame, Titel, Footer, Logo und Szenenkennzeichnung,
- Typostufen, Karten-, Linien-, Pfeil- und Bildsprache,
- wiederzuverwendende Komponenten und Tokenquelle,
- bewusst notwendige Abweichungen.

Ohne Referenz-Lock kein SVG-Code.

## 2. Quellen Vollstaendig Sichten

Vor Designentscheidungen alle Referenzfolien und den vollstaendigen Sprechertext lesen. Bei Sequenzen zusaetzlich klaeren:

- welche Folien denselben Sachverhalt oder Aufbauzustand zeigen,
- welche Inhalte gemeinsam animiert werden koennen,
- welche Information nur Dekoration ist,
- welcher Zustand den vollstaendigsten fachlichen Endzustand zeigt.

Bei Zusammenfassungskapiteln zusätzlich jede Zielszene gegen bereits freigegebene Szenen prüfen. Fachlich identische Darstellungen werden als bestehende Renderer- oder Assetkomponenten wiederverwendet; neu erzeugt wird nur eine bislang fehlende Kombination oder Übersicht. Die Wiederverwendungsentscheidung wird vor Produktion im Redesignplan dokumentiert.

Quellen nicht direkt veraendern. Neue Ergebnisse unter den vorhandenen Rebuild-/Redesign-Zielpfaden speichern.

Vor neuen oder korrigierten Seminarfolien zusaetzlich den neuesten Modul-Audit und `.agents/skills/redesign-reltest-slides/references/review-derived-design-rules.md` laden. Vergleichbare fruehere Befunde werden als QA-Schwerpunkte in den Redesign-Brief uebernommen. Nutzerfeedback wird nach `workflow/00-router/review-feedback-learning-loop.md` verarbeitet.

## 3. Inhaltsinventar Erstellen

Jeden relevanten Bestandteil klassifizieren:

- `must_preserve`: fachlich und fuer Sprechertext/Lernziel notwendig,
- `reframe`: inhaltlich erhalten, visuell neu gruppieren,
- `visual_replace`: durch gleichwertige Grafik, Plot, Formel oder Icon tragen,
- `decorative_remove`: ohne Informationsverlust entfernen,
- `target_addition`: nicht direkt aus der Quelle uebernommen; braucht Beleg aus
  Sprechertext, Nutzerauftrag oder rein orientierender BrandFrame-Funktion,
- `needs_decision`: vor Entfernung oder Zusammenfassung klaeren.

Bei Diagrammen und schematischen Grafiken zusaetzlich ein visuelles Beziehungsinventar erfassen. Dazu gehoeren insbesondere:

- Anzahl und Bedeutung aller Kurven, Zustaende oder Varianten,
- Richtung und Aussage von Pfeilen, Verschiebungen und Reduktionen,
- nummerierte Bereiche, Phasen und Zuordnungen,
- Ergebnisboxen, Fokusbereiche und Vorher-/Nachher-Beziehungen.

Ein Redesign gilt nicht als inhaltlich vollstaendig, wenn zwar alle Textbegriffe vorkommen, aber eine solche fachliche Beziehung oder ein dargestellter Zustand verloren geht.

Der Crosscheck erfolgt auch in Gegenrichtung. Neue Fachbegriffe, Kategorien,
Pfeile, Systemgrenzen, Hierarchien oder Ursache-Wirkungs-Beziehungen ohne
dokumentierten Beleg sind ebenso Fehler wie verlorener Quellinhalt.

Redesign darf Inhalte neu verpacken, aber ohne Nutzerauftrag nicht zusammenfassen oder den Sprechertext entkoppeln.

## 4. Lernbotschaft Und Archetyp Waehlen

Eine dominante Lernbotschaft in einem Satz formulieren. Danach genau einen primaeren Archetyp waehlen:

- Titelfolie,
- Agenda,
- Lernziele,
- Bullet/Kernaussagen,
- Definition,
- Key Takeaway,
- Workflow/Prozess,
- Media Aside,
- SVG-Diagramm,
- Vergleich/Do-Don't,
- Formel/Rechenweg,
- Daten-/Diagrammfolie.

Sekundaere Muster nur einsetzen, wenn sie die primaere Lernfunktion unterstuetzen. Die genaue Auswahlhilfe liegt in `.agents/skills/redesign-reltest-slides/references/redesign-decision-guide.md`.

## 5. Redesign-Brief Speichern

Vor Produktion `templates/slide-redesign-brief-template.md` ausfuellen und szenen- oder modulbezogen unter `analysis/rebuild-plans/` speichern.

Der Brief muss mindestens enthalten:

- Referenzen und Sprechertextbezug,
- Ausgabemodus,
- Inhaltsinventar,
- dominante Lernbotschaft,
- Archetyp und Begruendung,
- Layout- und Hierarchieplan,
- Komponenten-, Asset-, Plot- und Formelstrategie,
- Animationsentscheidung und semantische Gruppen,
- statisches Freigabekriterium vor Animationsbeginn,
- Zielpfade fuer Quellen-, Ziel- und Referenzpreviews,
- QA-Schwerpunkte und offene Fragen.

## 6. Brand-System Anwenden

Vor jeder neuen oder grundlegend ueberarbeiteten Szene
`brand/reltest-education-style-guide.md` und `agents/brand-guardian.md` laden.
Die aktive Submarke lautet `RelTest Education`; `Academy` ist nur noch ein
historischer Altbestand.

### Full Slide

Bei `full_slide` ist `brand/reltest-education-slide-design-tokens.json` die technische Quelle. Verwenden:

- `brandProfile=reltest-education` und `brandVariant=education-production`,
- Signalgruen `#00A754` als primaeren Education-Akzent,
- Archivo fuer alle sichtbaren Inhaltstexte und Oxanium nur fuer echte
  Headlines, Slogans oder Auszeichnungen,
- 1920x1080 Inhaltscanvas,
- hellen technischen Verlauf und dezentes Raster,
- freie Titel- und Footer-Safe-Areas fuer das Downstream-Repository,
- nicht sichtbaren zugänglichen `<title>` und `contentTitle`-Metadaten.

Node-basierte Foliengeneratoren laden Farben, Brandprofil, Hintergrund und
Schriftketten ausschliesslich ueber `tools/reltest-education-theme.js`.
Markenwerte werden nicht erneut als lokale Konstanten gepflegt.

Sichtbaren Folientitel, Titelakzent, Titeltrennlinie, Footertrennlinie,
Trainingsfooter, Logo und Modul-/Szenenkennung nicht in das SVG schreiben. Diese
Masterelemente werden vom empfangenden Repository erzeugt. Die projektlokalen
OFL-Fontdateien liegen unter `brand/fonts/`; der Zielrenderer muss sie
registrieren oder installiert haben.

### Content SVG

Bei `content_svg` weiterhin `brand/company-brand-tokens.json` und den Content-SVG-Vertrag anwenden. Nicht einbauen:

- globalen Hintergrund,
- Folientitel oder Titelregel,
- Footer,
- Logo,
- Foliennummer oder Praesentationsrahmen.

Das Template oder PowerPoint setzt diese Elemente spaeter.

Auch Content-SVGs verwenden `brandProfile=reltest-education`, Archivo fuer
Inhaltstext und Signalgruen als primaeren Education-Akzent. Stahlcyan bleibt eine
sekundaere Diagrammfarbe.

## 7. Komposition

- Alle selbst formulierten sichtbaren Seminartexte, Sprechertexte, Handlungsimpulse und Animationstrigger verwenden konsequent die Du-Form. Innerhalb einer Szene oder Sequenz niemals zwischen `Du` und `Sie` wechseln.
- Fuehrende Textstile verwenden `"Archivo", Arial, Helvetica, sans-serif`;
  echte Headlines oder Auszeichnungen verwenden
  `"Oxanium", "Archivo", Arial, sans-serif`.
- H1-Versalien nur bei kurzen Titeln bis etwa 3 bis 4 Woertern oder 25 Zeichen;
  laengere Titel in Gross-/Kleinschreibung. Standard ist linksbuendiger Satz.
- Als Aufzaehlungszeichen den Halbgeviertstrich verwenden.
- Neue sichtbare Texte, Metadaten und Brandhinweise duerfen nicht mehr
  `RelTest Academy` nennen.
- Uebernommene Slogans oder Claims werden fuer das Seminar ebenfalls in die Du-Form ueberfuehrt, sofern sie nicht ausdruecklich als unveraendertes woertliches Zitat gekennzeichnet und beizubehalten sind. Die gewaehlte Form muss in Folie, Sprechertext und Triggerphrase identisch sein.
- Eine klare Blickfuehrung und eine dominante Hierarchie herstellen.
- Downstream-eigene Masterelemente niemals als Teil des Fachvisuals erzeugen oder in eine Animationsgruppe aufnehmen.
- Grid, Flex-Logik oder stabile SVG-Geometrie statt zufaelliger Einzelpositionen verwenden.
- Reduktion vor Verkleinerung anwenden.
- Karten nur fuer echte fachliche Einheiten einsetzen.
- Keine Karten verschachteln und keine Vollflaechenkarte um den gesamten Inhalt legen.
- Medien die groessere Flaeche geben, wenn sie die Aussage tragen.
- Semantische Farben sparsam und nicht dekorativ rotierend verwenden.
- Professionelle Icons, saubere Pfeile und kontrollierte Layerreihenfolge sicherstellen.
- Keine globale `text { fill: ... }`-Regel verwenden, wenn Texte unterschiedliche
  Vordergrundfarben benoetigen. Vorgesehene Textfarben im berechneten Renderstil
  pruefen; ein im DOM vorhandener Text ist nicht automatisch sichtbar.
- Fuer normale Linien und Verbinder die Brand-Tokens verwenden: 1,5 px Hairline,
  2,5 px Standard und 4 px Betonung. 6 px ist die harte Obergrenze ohne
  dokumentierte Spezialausnahme. Pfeilkoepfe muessen dazu proportional und
  gegenueber Knoten und Text optisch untergeordnet bleiben.
- Pfeile, die eine fachliche Reduktion oder Verschiebung zwischen zwei Kurven zeigen, muessen als vollstaendige Richtungssymbole mit sichtbar zusammenhaengendem Schaft und Spitze lesbar sein. An Positionen mit zu geringem Kurvenabstand keinen kopflastigen Restpfeil erzwingen; stattdessen weniger, dafuer eindeutig lesbare Pfeile an repraesentativen Stellen setzen.
- Bei funktionsorientierten Systembaeumen steht unter jedem Objekt seine fachliche Funktion statt einer aus der Baumposition bereits offensichtlichen Hierarchieklasse wie `System`, `Teilsystem` oder `Komponente`. Hierarchieklassen nur zeigen, wenn ihre Benennung selbst Lerninhalt ist.
- Eine ergaenzende Funktions- oder Fehlerkette wiederholt nur die betroffenen Objektnamen und ihre Funktion beziehungsweise Fehlerwirkung. Verbinder erhalten eigene freie Korridore zwischen den Textspalten und duerfen weder Text noch Knoten beruehren.
- Piktogramme gezielt als visuelle Anker einsetzen, wenn sie Begriffe, Funktionen, Handlungen, Ebenen oder Zustandswechsel schneller erfassbar machen. Es besteht keine Pflicht, jede Aussage zu bebildern.
- Vor jeder Neuerstellung, Ersetzung oder Freigabe eines Piktogramms
  `workflow/30-visual-decision/pictogram-creation-workflow.md` anwenden. Dieser
  Workflow ist fuer Semantik, Education-Formensprache, Kleinmassstab,
  Zugaenglichkeit und Wiederverwendung verbindlich.
- Piktogramme duerfen Text nicht ersetzen, wenn dadurch fachliche Praezision verloren geht. Sie stehen mit einer kurzen Beschriftung oder in einem unmissverstaendlichen Satzkontext.
- Innerhalb einer Folie und Sequenz nur eine konsistente Piktogrammsprache verwenden. Strichstaerke, optische Groesse, Ecken, Flaechenanteil und semantische Farbe muessen zusammenpassen.
- Auswahl, Neuerstellung als PNG, Kleinmassstabtests und
  Animation von Piktogrammen folgen verbindlich
  `workflow/30-visual-decision/pictogram-creation-workflow.md` und
  `brand/reltest-education-pictogram-tokens.json`.
- Alle Piktogramme, auch einfache universelle Motive, werden als eigenstaendig generierte transparente PNG-Bildassets erstellt. `components/pictogram-library/` enthaelt nur noch Legacy-SVGs und darf fuer neue oder veraenderte Szenen nicht verwendet werden.
- Traegt die Quelle bereits fachlich eindeutige Piktogramme, ihre Bedeutungszuordnung im Redesign erhalten und in die gemeinsame Piktogrammsprache ueberfuehren. Solche Bildanker nicht durch laengere Erklaertexte ersetzen; die sichtbare Beschriftung auf den notwendigen Fachbegriff begrenzen.
- Das Piktogramm muss die konkrete Handlung oder Aussage treffen: Suchen beziehungsweise Identifizieren wird beispielsweise mit einer Lupe visualisiert, nicht mit einem allgemeinen Warn- oder Maschinensymbol.
- Piktogramme immer als hochwertige Rasterassets ueber den Bildgenerierungs-Workflow erzeugen und lokal im Medienordner der Szene ablegen. Keine aus SVG-Pfaden konstruierten Ersatzsymbole verwenden.
- Generierte Rasterpiktogramme muessen trotz Rasterformat wie dieselbe
  minimalistische Education-Familie wirken: flat 2D, frontal oder orthografisch,
  Marineblau plus hoechstens eine semantische Akzentfarbe, transparenter Grund,
  keine Verlaeufe, Schatten, 3D-, Isometrie-, Glow- oder Texturoptik.
- Muss eine Metapher wie Waage, Trichter, Bruecke oder Schutzschild sofort erkannt werden, die Erkennbarkeit im Zielmassstab pruefen. Eine nur aus Linien und Grundformen angedeutete Metapher ersetzen, wenn sie ohne Erklaertext nicht eindeutig lesbar ist; bei ausdruecklichem Nutzerwunsch ein generiertes Bildasset verwenden und die Fachboxen kontrolliert darueberlegen.
- Wiederkehrende Prozess- oder Phasenmodelle einmal zentral mit kanonischen Bezeichnungen, Reihenfolge, Nummern, Farben und Kurzlabels definieren. Jede Uebersichts- und Detailfolie muss dieselbe Komponente verwenden; lokale Neubenennungen oder wechselnde Farblogiken sind nicht erlaubt.
- Wiederkehrende reale Produkte, Maschinen oder Fallbeispiele innerhalb einer Sequenz mit demselben freigegebenen Bildasset zeigen, solange der Sprechertext keinen bewussten Perspektivwechsel verlangt. Das Asset wird lokal im jeweiligen Folienordner mit Quellen- und Lizenzmetadaten gespeichert; zufaellige Bildwechsel zwischen Dichte-, Verteilungs- oder Ausfallratenansicht sind nicht zulaessig.
- Verlangt der Nutzer fuer ein technisches Produkt ausdruecklich eine Zeichnung, wird kein Foto eingesetzt. Stattdessen eine hochwertige, wiederverwendbare technische SVG-Illustration erstellen oder aus der Komponentenbibliothek verwenden und in allen Folien desselben Beispiels konsistent wiederholen.
- Verlangt der Nutzer ausdruecklich ein generiertes Bild, wird ein generiertes Rasterasset verwendet und nicht stillschweigend durch eine SVG-Eigenzeichnung oder ein reales Foto ersetzt. Bereits festgelegte Stilvorgaben wie technischer Illustrationsstil statt Fotolook bleiben dabei verbindlich.
- Identitaetsbestimmende Merkmale einer technischen Zeichnung vor der Freigabe explizit gegen Quelle, Sprechertext und Nutzerfeedback pruefen. Dazu gehoeren beispielsweise Fahrzeugklasse, Bauart, Anzahl der Gaenge, Achsen, Stufen oder Anschluesse. Ein generisches oder fachlich aehnliches Objekt ist kein ausreichender Ersatz.
- Wiederkehrende Themen- oder Funktionsleisten nur zeigen, wenn sich ihr Zustand innerhalb der Sequenz sichtbar aendert oder die Leiste fuer eine echte Auswahl bzw. Navigation gebraucht wird. Bleibt dieselbe Kategorie ueber mehrere Folien aktiv, reicht eine kleine lokale Kennzeichnung; bei eindeutigem Titel darf sie ganz entfallen.
- Daten- und Diagrammfolien erhalten einen dominanten Plot und hoechstens eine gebuendelte Erklaerzone. Begriffe, Werte oder Aussagen nicht zugleich in Plot, Kopfbereich und Ergebnisband wiederholen.
- Eine Quellenfolie mit einem dominanten Diagramm nicht durch zusaetzliche Transfer-, Zusammenfassungs- oder Folgenboxen verdichten, wenn der Sprechertext diese Aussagen bereits traegt und die Quelle sie nicht sichtbar benoetigt.
- Zeigt die Quelle mehrere Methoden primaer ueber charakteristische Grafiken, diese Darstellungslogik erhalten. Eine ruhige 2x2-Matrix mit grossen Methodenbildern und knappen Bezeichnungen ist dann besser als vier schmale Erklaerkarten mit wiederholenden Absatztexten.
- Kuendigt eine Quelle mehrere gleichrangige Kennzahlen oder Themen nur an, eine ruhige Liste oder Tabelle verwenden. Ohne fachliche Grundlage keine Prozesspfeile, Abhaengigkeiten oder kuenstliche Oberkategorien hinzufuegen.
- Vergleichstabellen vor dem Rendern als festes Spaltenraster definieren. Alle Inhalte einer Zeile erhalten dieselbe vertikale Grundlinie; mathematisch gleichwertige Angaben nicht in mehreren Spalten wiederholen. Zahlen-, Einheiten- oder Groessenordnungs-Badges nur einsetzen, wenn sie eine Information ersetzen und nicht zusaetzlich duplizieren.
- Wiederkehrende Ereignisse oder Systeme innerhalb einer Sequenz als gemeinsame Komponente definieren. Ereignislinien, Piktogramm, Statusmarker und Label muessen an jeder Verwendung dieselbe Bedeutung und Geometriesprache behalten.
- Auch durchgestrichene oder als Gegenbeispiel markierte Referenzsymbole muessen fachlich korrekt gezeichnet sein. Erst die kanonische Form und Orientierung pruefen, danach die Negation darueberlegen.

## 8. Spezialpfade

- Echte Diagramme und Plots: `workflow/31-python-plots/`.
- Formeln: `workflow/32-formulas/formula-workflow.md`.
- Timelines: `workflow/33-timelines/timeline-workflow.md`.
- Animation: `workflow/50-animation/animation-decision-and-dramaturgy.md`.
- Piktogramme: `workflow/30-visual-decision/pictogram-creation-workflow.md`.
- Content-SVG-Zielstruktur: `workflow/40-svg-production/target-svg-structure-contract.md`.

## 9. Animation

Animation nicht als Designpflicht behandeln. Vor der SVG-Bearbeitung `static`, `animated` oder `needs_review` entscheiden.

Bei `animated`:

- zuerst den vollstaendigen statischen Endzustand rendern, gegen Quelle und
  Referenzdesign freigeben und erst danach Manifest und Animation umsetzen,
- Sprechertext in fachliche Beats segmentieren,
- vollstaendige semantische Gruppen bilden,
- ruhige Einblendungen oder fachlich echte Draw-/Transform-Schritte verwenden,
- keine Bounce-, Dauerpuls-, starken Zoom- oder Richtungs-Mischanimationen einsetzen,
- Endzustand stabil und ohne Animation verstaendlich halten.

Jeder fachlich relevante Zwischenzustand wird zusaetzlich gerendert. Pfeile,
Fuehrungslinien und Beschriftungen duerfen erst erscheinen, wenn alle fuer ihre
Aussage benoetigten Endpunkte beziehungsweise Geometrien sichtbar sind.

## 10. Folienweise Produktionsschleife

Bei mehreren Folien immer nur eine Arbeitseinheit gleichzeitig bearbeiten:

1. Brief und Quellen der aktiven Szene laden.
2. Statischen Endzustand gestalten.
3. Quellen-, Ziel- und Referenzpreview in 1920x1080 und verkleinert vergleichen.
4. Content-Transfer-Crosscheck in beide Richtungen durchfuehren.
5. Statische technische und visuelle QA durchfuehren.
6. Befunde an derselben Szene beheben und den statischen Zustand erneut rendern.
7. Erst nach statischer Freigabe Animation umsetzen.
8. Relevante Animationszustaende rendern und gegen Sprechertextreihenfolge pruefen.
9. Re-QA ausfuehren.
10. Erst danach zur naechsten Szene wechseln.

Die erste Szene jedes neuen Archetyps ist ein Pilot. Dessen CSS-, Asset-, Linien-,
Pfeil- und Animationsmuster duerfen erst nach bestandener statischer Freigabe
wiederverwendet werden.

## 11. QA Und Definition Of Done

Pruefen:

- 16:9 und Zielaufloesung,
- Safe Areas und Footer-/Titelabstand,
- vollstaendigen Inhaltstransfer,
- eine dominante Lernbotschaft,
- Typografiestufen und Mindestlesbarkeit,
- Farben ausschliesslich aus dem passenden Tokensystem,
- aktives Brandprofil `reltest-education`,
- Signalgruen als primaeren Education-Akzent und Stahlcyan nur in seiner
  definierten Diagrammrolle,
- Oxanium/Archivo gemaess Typorolle und keine Legacy-Schrift als fuehrende
  Schrift,
- Kartenradius, Kontur, Schatten und Padding,
- Kontrast und Bedeutung nicht nur ueber Farbe,
- berechnete Textfarbe statt nur deklarierte `fill`-Attribute,
- professionelle Icons, Pfeile und Diagrammgeometrie,
- keine unbegruendete Strichstaerke ueber 6 px und keine ueberdimensionierten
  Pfeilkoepfe,
- eindeutige, konsistente und auch bei verkleinerter Darstellung lesbare Piktogramme,
- bestandene 48-px- und 960x540-Piktogrammtests, mindestens 3:1
  Nicht-Text-Kontrast und keine allein farbcodierte Bedeutung,
- keine sichtbaren Downstream-Masterelemente bei `full_slide`,
- keine Masterelemente bei `content_svg`,
- ruhige und fachlich begruendete Animation,
- stabilen statischen Endzustand,
- keine Kollisionen, Ueberlaeufe oder Zeichenkodierungsfehler,
- Quellen-, Ziel- und Referenzpreview im Endzustand sowie alle fachlich relevanten
  Animationszustaende,
- konsistente Du-Ansprache in redaktionellem sichtbarem Text, Sprechertext und Animationstriggern; keine verbleibenden formellen Imperative wie `Machen Sie`, `Schauen Sie` oder `Beachten Sie`. Direkte, als Zitat gekennzeichnete Quellformulierungen sind davon ausgenommen: Sie bleiben wortgetreu und dürfen weder sprachlich umgeschrieben noch aus ihrer visuellen Zitatgruppe herausgelöst werden.

Fuer `content_svg` und `full_slide` die zentrale artefaktbewusste QA mit
`--strict-design --layout --layout-strict` verwenden. Der Designcheck waehlt anhand
von `artifactScope` die Content-SVG- oder Full-Slide-Tokenquelle. Bei `full_slide`
prueft er zusaetzlich den Brandhintergrund, freie Master-Safe-Areas und die
Abwesenheit von Titel-, Footer-, Logo- und Szenenkennzeichnungs-Dubletten; der
Zielrenderer bleibt fuer den sichtbaren 1920x1080-Vergleich verpflichtend.

Bei Kapitelauftraegen folgt nach allen Einzelfolien ein separater Konsistenz-Sweep
gegen das Referenzmodul. Ohne vorhandene Zielrenders oder bei nicht verfuegbarem
Renderer darf das Kapitel nicht als fertig bezeichnet werden.

Bei einer Review-Korrektur ist die Freigabe zusaetzlich erst erreicht, wenn der modulbezogene Audit Beobachtung, Ursache, Korrektur, Reichweite und Verifikation enthaelt. Uebertragbare Regeln muessen in Skill, Fachworkflow oder QA verankert sein; rein lokale Entscheidungen werden als solche dokumentiert.
