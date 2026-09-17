# Animation Decision And Dramaturgy

Diese Datei ist die kanonische Entscheidungsregel fuer Animationen in Content-SVGs. Sie wird vor `scene-manifest-contract.md` angewendet.

Bei Animationsplanung, -umsetzung, -korrektur oder Sprechertext-Synchronisierung
ist zusaetzlich `.agents/skills/animate-svg-from-narration/SKILL.md` anzuwenden.
Der Skill operationalisiert insbesondere Initialzustand, Abhaengigkeitsgraph,
Effekt-Machbarkeit und zustandsbasierte Review.

## Grundsatz

Seminarweite Nutzerpräferenz (17.09.2026): Die Inhalte werden gesprochen und
automatisch abgespielt. Längere Erklärabschnitte sollen durch ruhige,
fachlich begründete Aufbauten oder Fokuswechsel begleitet werden. Unbegründete
lange Stillstände vermeiden; keine dekorative Bewegung oder willkürliche
Mindestfrequenz einführen. Bei Tabelle und zugehörigem Plot den gerade
übertragenen Wert beziehungsweise das Wertepaar kurz hervorheben, wenn die
Punkte nacheinander eingeführt werden. Identität und Reihenfolge bleiben über
alle Darstellungen konsistent.

Animation ist kein Pflichtmerkmal und kein Qualitaetsbeweis. Eine statische, sofort vollstaendige Darstellung ist besser als eine willkuerliche oder technisch kleinteilige Animation.

Bei Redesigns wird keine Animation umgesetzt, bevor der vollstaendige statische
Endzustand gerendert und gegen Quelle sowie Referenzdesign freigegeben wurde. Eine
Animationsentscheidung darf im Plan bereits vorbereitet werden; Targets, Manifest
und Zwischenzustaende folgen aber erst nach dem statischen Freigabestatus
`passed`.

Jede Szene erhaelt vor der SVG-Bearbeitung genau eine ausdrueckliche Entscheidung:

- `static`: Der vollstaendige Inhalt ist von Anfang an sichtbar.
- `animated`: Der Sprechertext beschreibt eine fachlich sinnvolle Reihenfolge, einen Aufbau, eine Veraenderung oder einen Fokuswechsel, der visuell nachvollzogen werden soll.
- `needs_review`: Die Quellen reichen fuer eine belastbare Entscheidung noch nicht aus. In diesem Zustand werden keine Animationsschritte erzeugt.

Es gibt keinen Animationszwang und keine Mindestzahl an Targets oder Schritten.

## Verbindliche Inputs

Vor der Entscheidung muessen gemeinsam gelesen werden:

1. alle Quell-SVGs der Arbeitseinheit in ihrer Reihenfolge,
2. der vollstaendige gemappte Sprechertext der Zielszene,
3. die geplante Zielkomposition,
4. vorhandene Aufbauzustaende oder fachliche Abhaengigkeiten,
5. bei Diagrammen die Daten-, Achsen-, Legenden-, Fit- und Grenzlogik.
6. bei Redesigns den bestandenen statischen Quellen-Ziel-Referenzvergleich.

Eine Animation darf nicht allein aus DOM-Reihenfolge, Elementtyp, Position, Anzahl der SVG-Knoten oder gleichmaessig verteilten Textstellen abgeleitet werden.

Das bestehende `tools/enrich-svg-element-animations.ps1` bildet genau eine solche alte Heuristik ab und ist fuer neue Produktionslaeufe gesperrt. Es darf nur mit dem ausdruecklichen Schalter `-AllowHeuristicLegacy` verwendet werden, um einen alten Teststand reproduzierbar zu analysieren; seine Ausgabe ist nicht freigabefaehig und ersetzt keine semantische Planung.

## Entscheidungsgate

Animation ist in der Regel sinnvoll, wenn mindestens einer dieser Faelle belegt ist:

- Der Sprechertext fuehrt mehrere fachliche Bloecke nacheinander ein.
- Mehrere Quell-SVGs sind nachweislich Aufbauzustaende derselben Erklaergrafik.
- Ein Prozess, eine Ursache-Wirkung-Kette oder eine Zustandsaenderung wird erklaert.
- Ein Diagramm wird schrittweise gelesen: erst Orientierung, dann Daten, dann Auswertung.
- Ein bereits sichtbares Element soll zu einer bestimmten Aussage gezielt hervorgehoben werden.

Die Szene bleibt in der Regel statisch, wenn einer dieser Faelle zutrifft:

- Der Sprechertext behandelt die Darstellung als ein zusammenhaengendes Ganzes.
- Es gibt keinen fachlich begruendbaren Zeitpunkt fuer getrennte Einblendungen.
- Eine Aufteilung wuerde nur technische Einzelteile statt inhaltlicher Einheiten erzeugen.
- Die Darstellung ist klein, dicht oder nur kurz sichtbar und wird durch Aufbau unruhiger.
- Alle Elemente werden fuer das unmittelbare Verstaendnis gleichzeitig benoetigt.
- Die Animation wuerde nur das gesamte SVG einmal einblenden, ohne didaktischen Mehrwert.

Bei Unsicherheit gilt `static` oder `needs_review`, niemals eine automatisch erfundene Reveal-Folge.

## Sprechertext Zuerst Segmentieren

Der Sprechertext wird vor der Targetplanung in wenige fachliche Erklaerabschnitte zerlegt. Ein Abschnitt ist eine inhaltliche Aussage, kein willkuerliches Wortfenster.

Pausenmarker nach `narration-pause-markers.md` strukturieren den Sprechfluss,
bilden aber keinen eigenen Erklaerabschnitt. Sie werden bei Wortzaehlung und
`sourceText`-Matching maskiert. Ein Trigger verwendet immer echte Woerter vor
oder nach einer Pause, niemals den Marker selbst.

Fuer jeden Abschnitt wird dokumentiert:

- welche Aussage jetzt erklaert wird,
- welches bereits sichtbare Vorwissen benoetigt wird,
- welche visuelle Gruppe diese Aussage traegt,
- ob sie neu erscheint, bestehen bleibt, hervorgehoben oder wirklich veraendert wird,
- welche eindeutige vollstaendige `sourceText`-Phrase den Schritt ausloest.

Die Anzahl der Animationsgruppen folgt diesen Erklaerabschnitten. Sie wird nicht aus der Anzahl von SVG-Knoten abgeleitet.

Die Segmentierung beginnt mit dem ersten gesprochenen Satz und umfasst auch
Erklaerabschnitte ohne sichtbare Aenderung. Die Beat-Liste darf nicht erst beim
ersten Reveal beginnen. Andernfalls fehlen genau die allgemeinen Einleitungen,
gegen die der Anfangszustand geprueft werden muss.

## Initialzustand Vor Triggern

Vor der Segmentierung in technische Schritte wird fuer jede semantische Gruppe
dokumentiert, ob sie bei Frame 0:

- als notwendiger Orientierungsrahmen sichtbar ist,
- bis zu ihrem fachlichen Trigger verborgen bleibt,
- als ruhige Dekoration statisch sichtbar bleibt,
- sichtbar beginnt und spaeter veraendert werden soll,
- oder aus der Szene ausgeschlossen ist.

Der Initialzustand ist der kleinste ausreichende Lernzustand fuer den ersten
Sprecherabschnitt. Eine vollstaendig leere Szene ist keine Standardeinstellung.
Pfeile, Verbinder, Fuehrungslinien, Labels, Ergebnisse und Schlussfolgerungen
duerfen spaetere Inhalte nicht vorwegnehmen.

Fuer jede inhaltstragende Gruppe wird zusaetzlich der erste fachlich relevante
Sprecherbeat dokumentiert. Fotos, Produktrenderings, Fallbeispiele und
Quellenzeilen sind Inhalt, nicht Dekoration. Liegt ihre Erstrelevanz nach dem
ersten Beat, bleiben sie bis zum passenden Trigger verborgen. Wenn die
Downstream-Masterebene Orientierung bietet, ist ein voruebergehend leerer
Content-Bereich einer semantisch verfruehten Bebilderung vorzuziehen.

Die aktuelle `svgAnimationManifest/v1`-Runtime verbirgt jedes Target mit Status
`animated` am Anfang. Ein Orientierungsanker, der bei Frame 0 sichtbar sein muss,
darf daher nicht als `animated` markiert werden. Ein sichtbares Target, das spaeter
direkt hervorgehoben, verschoben oder ausgeblendet werden soll, benoetigt vor der
Umsetzung eine Runtime, die initial sichtbare animierte Targets explizit
unterstuetzt; andernfalls gilt `needs_review`.

## Semantische Gruppierung

Ein Target ist eine fachlich vollstaendige visuelle Einheit. Zusammengehoerige Bestandteile erscheinen immer gemeinsam.

Verbindliche Beispiele:

- Box, Hintergrund, Rand, Ueberschrift, Text und zugehoeriges Icon bilden eine Gruppe.
- Aufzaehlungszeichen, Abschnittslabel und der vollstaendige zugehoerige Listeneintrag bilden eine atomare Einheit. Ein Aufzaehlungszeichen darf nie in einem frueheren Schritt erscheinen als sein Text; Labels wie `Ursache`, `Folge`, `Ausmass` oder `Kosten & Konsequenz` bleiben bei ihren direkt zugehoerigen Unterpunkten.
- Pfeil, Pfeilbeschriftung und Endmarker bilden eine Gruppe.
- Ein Verbinder darf nicht als statischer Kontext sichtbar sein, wenn mindestens eine verbundene fachliche Box erst in einem spaeteren Animationsschritt erscheint. Er wird zusammen mit der neu eingefuehrten vollstaendigen Beziehung eingeblendet oder entfaellt, wenn der Sprechertext keine gerichtete Beziehung erklaert.
- Formelzeichen, Bruchstrich, Indizes und direkt zugehoerige Erklaerung bilden eine Gruppe, sofern der Text sie gemeinsam einfuehrt.
- Diagrammachsen, Skalen, Ticks, Gitternetz und Achsenbeschriftungen bilden normalerweise den gemeinsamen Diagrammrahmen.
- Datenreihe, zugehoerige Marker und ihr Legendeneintrag bilden eine Gruppe, wenn sie gemeinsam erklaert werden.
- Konfidenzgrenzen gehoeren zusammen und werden nicht als zwei unabhaengige Linien animiert.
- Marker, Wertlabel, Fuehrungs- oder Bezugslinie und direkt zugehoerige Beschriftung bilden eine Gruppe. Eine Fuehrungslinie darf nie vor ihrem Label sichtbar sein.
- Randwerte, Prozentangaben und Kurvenlabels erscheinen nicht vor der Geometrie, die sie beschreiben. Sie werden mit der Geometrie oder spaeter an der passenden Sprechertextstelle eingeblendet.

Nicht zulaessig:

- einzelne Buchstaben, Textzeilen oder PowerPoint-Exportpfade separat animieren,
- eine PowerPoint-Exportgruppe ungeprueft uebernehmen, wenn sie einen Listenpunkt, sein Label oder seinen Inhalt an einer Animationsgrenze trennt,
- eine Animationsgruppe mit einem alleinstehenden Aufzaehlungszeichen oder Abschnittslabel beenden,
- Hintergrund und Text derselben Box zeitlich trennen,
- Gruppen nur nach `text`, `path`, `rect` oder DOM-Nachbarschaft bilden,
- eine fachliche Einheit in viele Mikro-Reveals zerlegen,
- gleichmaessig ueber den Sprechertext verteilte Triggerphrasen erzeugen.
- unbeschriftete Hilfs-, Grenz- oder Referenzlinien einbauen, die weder vom Sprechertext erklaert noch fuer eine konkrete Ablesung benoetigt werden.
- Pfeile oder Verbinder vor den Boxen, Karten oder Diagrammelementen zeigen, deren Beziehung sie erklaeren.

Im Zweifel wird groesser gruppiert. Wenige klare Schritte sind besser als viele kleine Schritte.

## Effektwahl

Der Effekt folgt der fachlichen Aussage:

| Aussage | Bevorzugte Aktion | Regel |
|---|---|---|
| Ein neuer Block wird eingefuehrt | `show` | Ganze semantische Gruppe gleichzeitig einblenden. |
| Ein Verlauf, eine Kurve oder ein gerichteter Pfad entsteht | `draw` | Nur fuer echte Linien-/Pfadgeometrie, nicht fuer Text oder Flaechen. |
| Ein bereits sichtbarer Zusammenhang wird betont | `highlight` | Nicht als Ersatz fuer eine Einblendung verwenden. |
| Ein Zustand veraendert sichtbar Position oder Form | `transform` | Nur bei fachlich echter Bewegung oder Transformation. |
| Ein alter Zustand wird fuer einen belegten Wechsel ersetzt | `hide` plus `show` | Sparsam; Kontext nicht grundlos entfernen. |

Effekte werden nicht gemischt, nur damit eine Szene abwechslungsreich wirkt.

Vor der Wahl wird die tatsaechliche Reviewer- und Zielruntime geprueft. In der
aktuellen internen Basis-RE-Vorschau werden `show` und `hide` als reine
Deckkraftanimation, `draw` als gerichtete Clip-Enthuellung, `highlight` als kurzer
Puls und `transform` als Verschiebung/Skalierung gerendert. Ein echtes
Verschwimmen ist nicht Bestandteil des Manifestvertrags und darf bis zu einer
separaten Runtime-Erweiterung nicht als Produktionsschritt erzeugt werden.

## Diagramme Und Python-Plots

Fuer Diagramme wird zuerst die Leselogik geplant. Die Standardreihenfolge ist nur ein Ausgangspunkt und muss zum Sprechertext passen:

1. Diagrammrahmen: Achsen, Skalen, Ticks, Gitternetz und Achsenbeschriftungen gemeinsam.
2. Primaere Daten: Datenpunkte, Balken, Marker oder Messreihe in der Reihenfolge ihrer Erklaerung.
3. Auswertung: Fit-, Regressions-, Verteilungs- oder Referenzlinie erst nachdem die zugrunde liegenden Daten sichtbar sind.
4. Unsicherheit: Vertrauens- oder Prognosegrenzen gemeinsam und erst dann, wenn der Text Unsicherheit oder Grenzen erklaert.
5. Fokus: ein gezieltes Highlight erst bei der entsprechenden Schlussfolgerung.

Abweichungen sind erlaubt, wenn der Sprechertext eine andere Lesereihenfolge vorgibt. Wird das Diagramm als fertiges Ergebnis vorgestellt, darf es vollstaendig statisch erscheinen.

Weitere verbindliche Beispiele:

- Weibull-Plot: Diagrammrahmen, Ausfalldaten, Weibull-Fit, beide Vertrauensgrenzen als eine gemeinsame Gruppe.
- Balkendiagramm: Diagrammrahmen, dann fachlich zusammengehoerige Balkengruppe; nicht jeden Balken einzeln, sofern der Text sie nicht einzeln bespricht.
- Kumulatives Balkendiagramm: Wenn der Sprechertext die Addition erklaert, duerfen die kumulierten Balken ausnahmsweise klassenweise von links nach rechts erscheinen. Jeder Schritt gruppiert Balken und direkt zugehoerige Rechnung; eine getrennte, weit entfernte Rechenleiste ist zu vermeiden.
- Prozesskurve: Diagrammrahmen zuerst, Kurve als `draw`, Marker oder Grenzwerte erst bei ihrer Erklaerung.
- Vorher-/Nachher-Kurve: Zuerst den fachlichen Ausgangszustand an seiner urspruenglichen Position zeigen. Wenn der Sprechertext eine Verschiebung oder Veraenderung beschreibt, dasselbe sichtbare Element mit `transform` in den Zielzustand bewegen; nicht lediglich eine zweite Zielkurve einblenden. Konsequenzen wie Ueberlappungs-, Risiko- oder Ausfallbereiche erscheinen erst nach abgeschlossener Bewegung.
- Reines Vergleichsdiagramm: alle Reihen statisch, wenn die Aussage nur der direkte Gesamtvergleich ist.

Python-Plot-SVGs stellen dafuer semantische Gruppen-IDs bereit. Die Animation wird trotzdem erst nach dieser didaktischen Entscheidung geplant; vorhandene IDs sind kein Auftrag, alles zu animieren.

## Beispiele Fuer Andere Darstellungen

### Informationsbox Mit Text

Wenn der Sprechertext die Box als eine Aussage einfuehrt, erscheinen Hintergrund, Text und Icon gemeinsam. Es gibt keinen separaten Schritt fuer Rahmen, Hintergrund oder einzelne Textzeilen.

### Drei Fachliche Bloecke

Wenn der Sprechertext die drei Bloecke nacheinander erklaert, sind drei Gruppen sinnvoll. Wenn er zuerst den Gesamtueberblick beschreibt und danach nur verbal vertieft, bleiben alle drei Bloecke statisch sichtbar.

### Formel Mit Ergebnis

Formel und Parameter duerfen gemeinsam erscheinen. Ein Ergebnis wird erst spaeter eingeblendet, wenn der Sprechertext tatsaechlich zuerst die Berechnung und danach das Resultat erklaert. Andernfalls bleibt die gesamte Formelgruppe statisch.

### Dekorative Oder Rein Orientierende Elemente

Dekoration, Hintergrund, Rahmen und dauerhafte Orientierungselemente bleiben statisch. Sie erhalten keine eigenen Trigger.

## Planungsartefakt

Der Szenenplan dokumentiert vor der SVG-Produktion:

```text
animation_decision: static | animated | needs_review
animation_rationale: fachliche Begruendung
narrative_beats: geordnete Erklaerabschnitte des Sprechertexts
semantic_groups: fachliche Gruppen mit stabiler Ziel-ID und enthaltenen Elementen
steps: nur bei animated; je Schritt Gruppe, Aktion und exakte sourceText-Phrase
```

Bei `static` bleiben `steps` leer. Falls das externe Paket ein namensgleiches Manifest erwartet, wird ein valides statisches Manifest mit leeren `targets` und `steps` geliefert. Es wird kein kuenstlicher `main_content`-Schritt erzeugt.

## Freigabecheck

Vor der Umsetzung und erneut vor der Freigabe:

- Ist der didaktische Nutzen jedes einzelnen Schritts in einem Satz erklaerbar?
- Ist der statische Endzustand bereits sichtbar freigegeben, bevor Manifest oder
  Animationslayer umgesetzt wurden?
- Entspricht die Reihenfolge der Reihenfolge im Sprechertext?
- Folgt die Reihenfolge zugleich einer nachvollziehbaren raeumlichen Leserichtung, oder ist jeder notwendige Sprung zwischen entfernten Bereichen fachlich begruendet?
- Sind Boxen, Beschriftungen, Icons und Marker als vollstaendige Einheiten gruppiert?
- Erscheint jeder Pfeil oder Verbinder fruehestens gemeinsam mit allen fuer seine Aussage benoetigten Endpunkten?
- Bleiben verbundene Diagrammteile auch am Maximum eines Highlight-Pulses geometrisch geschlossen? Die aktuelle Runtime skaliert die Zielgruppe kurz um bis zu 1,8 Prozent. Einzelne Verbinder nicht getrennt von ihren Knoten pulsen lassen; bei einer Teilfokussierung stattdessen die zugehoerige Beschriftung hervorheben oder die gesamte geschlossene Struktur gemeinsam gruppieren. Nachweis: RE4-Szene 31, Feedbackrevision 17.09.2026.
- Wurde jede Listenstruktur visuell gelesen und bleiben Aufzaehlungszeichen, Label und zugehoeriger Inhalt im selben Schritt?
- Endet keine Animationsgruppe mit einem alleinstehenden Aufzaehlungszeichen oder einem Label wie `Ursache`, `Folge`, `Ausmass` oder `Kosten`?
- Werden Diagrammrahmen und Daten logisch aufgebaut?
- Erscheinen Fit und Unsicherheitsgrenzen erst nach den Daten, sofern der Text nichts anderes vorgibt?
- Erscheinen Labels, Prozentwerte und Fuehrungslinien gemeinsam und niemals vor der zugehoerigen Kurve, Markierung oder Ablesung?
- Sind alle sichtbaren Hilfs- und Referenzlinien fachlich erklaert oder fuer eine konkrete Ablesung erforderlich?
- Bleiben dekorative und dauerhafte Kontextelemente statisch?
- Gibt es weniger und groessere Gruppen statt vieler technischer Mikrogruppen?
- Waere die Szene ohne Animation klarer? Falls ja, wird sie statisch.
- Sind alle Triggerphrasen eindeutig und im wirksamen Sprechertext vorhanden?
- Ist der vollstaendige Endzustand auch ohne abgespielte Animation fachlich verstaendlich?
- Bleiben Endzustand und Zwischenzustaende auch in der realistischen verkleinerten Viewer-Ansicht lesbar und frei von Text-, Pfeil- oder Kartenfragmenten?
- Ist vor dem ersten Trigger jedes erst spaeter einzublendende Target vollstaendig unsichtbar, ohne Vorschau-Deckkraft?
- Ist kein konkretes Bild, Beispiel oder Quellenlabel vor seinem ersten fachlich
  relevanten Sprecherbeat sichtbar?

Ein nicht begruendbarer Schritt wird entfernt. Eine nicht begruendbare Animation wird durch eine statische Darstellung ersetzt.
