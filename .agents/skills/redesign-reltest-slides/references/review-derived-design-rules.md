# Review-Derived Design Rules

Diese Referenz buendelt bestaetigte, wiederverwendbare Learnings aus dem Review des Basis-RE-Seminars. Sie ist vor neuen Folien oder Korrekturen zu laden, wenn derselbe Archetyp oder dieselbe Fehlerklasse betroffen ist.

## Inhalt Und Quelle

- Fachlich relevanten Inhalt vollstaendig erhalten. Neu verpacken ist erlaubt, still kuerzen nicht.
- Den Quellabgleich in beide Richtungen ausfuehren: Fehlender Quellinhalt und
  unbelegte Zielergaenzungen sind Fehler. Neue Fachbegriffe, Systemgrenzen,
  Kategorien oder Beziehungen brauchen einen Beleg aus Quelle, Sprechertext oder
  ausdruecklichem Nutzerauftrag.
- Nicht nur Textbegriffe, sondern Beziehungen, Pfeilrichtungen, Kurvenformen, Phasen, Nummern und Vorher-/Nachher-Zustaende aus der Quelle erhalten.
- Wenn die Quelle eine funktionierende Darstellungslogik besitzt, diese modernisieren statt ohne Lerngewinn neu zu interpretieren.
- Reine Aufzaehlungen und Vorschauen bleiben Aufzaehlungen. Keine Prozesspfeile, Abhaengigkeiten oder Kategorien erfinden, wenn Quelle und Sprechertext nur gleichrangige kommende Themen nennen.
- Sprechertext muss auch nach Zusammenlegung oder Redesign zur sichtbaren Reihenfolge passen.
- Direkte Zitate bleiben wortgetreu, einschließlich einer formellen Ansprache oder Pointe. Die projektweite Du-Regel gilt für redaktionelle Formulierungen, nicht für gekennzeichneten Quelltext. Mehrere Sätze desselben Zitats dürfen nacheinander animiert werden, müssen aber räumlich und typografisch derselben Zitatgruppe angehören.

## Zusammenfassungskapitel Und Wiederverwendung

- Vor einem Zusammenfassungskapitel eine Wiederverwendungsmatrix erstellen: Jede Zusammenfassungsfolie wird gegen bereits freigegebene Szenen, Komponenten, Plots, Formeln und Bildassets geprüft.
- Ist der fachliche Inhalt einschließlich Beziehungstopologie identisch, denselben Renderer beziehungsweise dieselben lokalen Assets wiederverwenden. Nur Titel, Szenenmetadaten und Sprechertexttrigger werden an die Zusammenfassung angepasst.
- Wiederkehrende Prozessmodelle, Phasenfarben, Parametersemantik und Diagrammskalierung dürfen in einer Zusammenfassung nicht neu interpretiert werden.
- Eine neue Darstellung nur erzeugen, wenn keine fachlich identische Übersicht existiert oder der Zusammenfassungstext eine neue Kombination bereits bekannter Inhalte verlangt.
- Wiederverwendete Plot-, Formel- und Datendateien zusätzlich lokal im neuen Szenenordner ablegen und ihre Herkunft maschinenlesbar dokumentieren.

## Hierarchie Und Typografie

- Keine automatische Unterueberschrift, Fokuszeile oder Zusammenfassungsbox erfinden. Jede sichtbare Ebene braucht eine Lernfunktion.
- Wenige stabile Typostufen verwenden. Kein wechselndes Muster aus sehr grossen, kleinen und wieder grossen Texten.
- Reduktion vor Verkleinerung: erklaerende Absatztexte entfernen, wenn Grafik und Sprechertext dieselbe Aussage bereits tragen.
- Textboxen mit sichtbarem Innenabstand planen. Der laengste Begriff muss auch in der verkleinerten Viewer-Ansicht Luft zum Rand besitzen.
- Karten nur fuer echte fachliche Einheiten, Prozessstufen oder Vergleichsklassen einsetzen.
- Seminarweite Nutzerentscheidung: Marineblau traegt die visuelle Grundordnung.
  Gleichrangige Infoboxen verwenden dieselbe blaue Farbfamilie mit abgestuften
  Tonwerten oder Deckkraeften; keine dekorative Rotation durch Gelb, Blau, Gruen
  oder weitere Akzentfarben.
- Signalgruen und weitere Akzentfarben nur fuer einen belegten Status, eine
  Diagrammrolle, die Education-Kennung oder einen einzelnen wichtigen Fokus
  verwenden. Ausserhalb echter Diagramme standardmaessig hoechstens eine
  Buntakzentfarbe pro Folie.
- Gleichrangige Formeln verwenden dieselbe nominale mathematische Grundschrift. Einfache Formeln, Brueche und Integrale niemals einzeln auf dieselbe Boxhoehe skalieren; Formelglyphen als Pfade exportieren, damit Viewer-Fonts und CSS weder Fettung noch Abstaende veraendern.

## Diagramme Und Technische Grafiken

- Echte Plots aus Python erzeugen und die Quelle als fachlichen Geometrieanker behandeln.
- Die kanonische Fünf-Komponenten-Brückenschaltung zeigt die Komponenten 1 und 3 im oberen Pfad, 2 und 4 im unteren Pfad und Komponente 5 als vertikale Kopplung zwischen den beiden mittleren Knoten. Vorschau, Ausgangsdiagramm und separierte Ersatzstrukturen verwenden dieselbe Topologie- und Komponentensprache; die Schaltung darf in der 960×540-Vieweransicht nicht zu einer unlesbaren Miniatur schrumpfen.
- Brückenschaltungen nicht horizontal auf die verfügbare Kartenbreite strecken. Die Schaltung bleibt als kompakte technische Einheit mit ausgewogenem Verhältnis von Pfadlänge und Pfadabstand erkennbar; zusätzlicher Platz wird als Weißraum genutzt und nicht durch längere Leitungen gefüllt.
- Wenn die Quelle Methodenboxen, Wirkungen oder Ergebnisbänder über gemeinsame Achsen und Phasengrenzen zuordnet, diese als eine integrierte Diagrammkomposition erhalten. Plot und Zuordnung nicht in unabhängige Karten- oder Inhaltszonen zerlegen.
- Methoden- oder Ergebnisbänder, die mehreren Diagrammbereichen zugeordnet sind, durch ihre exakte horizontale Spannweite und semantische Farbe abbilden. Redundante Zusätze wie `Fall 1 und 2` entfallen, wenn die Geometrie die Zuordnung eindeutig trägt. Fokusbänder brauchen einen sichtbaren Abstand zu Bereichsnummern, Kurvenlabels und Phasengrenzen.
- Kurvenlabel, Marker, Wert und Fuehrungslinie gemeinsam mit ihrer Geometrie zeigen; Beschriftungen nie vor der Kurve einblenden.
- Reduktions- oder Verschiebungspfeile nur dort setzen, wo Schaft und Spitze vollstaendig lesbar sind. Weniger klare Pfeile sind besser als mehrere kopflastige Fragmente.
- Durchgestrichene Referenzformen zuerst fachlich korrekt zeichnen und erst danach negieren.
- Mehrere grafisch definierte Methoden bevorzugt in einer ruhigen, quellnahen Matrix zeigen. Lange Erklaertexte entfallen, wenn die Methodengrafik und der Sprechertext die Bedeutung tragen.
- Achsen, Daten, Fit, Grenzen und Interpretation als nachvollziehbare Lesefolge planen; nicht alles allein wegen vorhandener DOM-IDs animieren.
- Vorher-/Nachher-Vergleiche wie Ausreissereinfluss verwenden denselben Datensatz, dieselbe Achse und dieselbe Skalierung. Nur die fachlich veraenderte Groesse darf zwischen den Zustaenden wechseln.
- Wiederkehrende Ausfallereignisse innerhalb einer Sequenz verwenden dasselbe freigegebene Ausfallsystem-Piktogramm. Bei Zeitintervallen markieren Ereignislinien zugleich die exakten Grenzen der darueberliegenden Zeitraeume.
- Plotlabels und Ergebniswerte duerfen keine Kurven, Marker oder Hilfslinien verdecken. Falls eine konfliktfreie Position im Datenraum nicht stabil moeglich ist, eine eigene Ergebniszone ausserhalb der Achsen verwenden.
- Schematische oder transformierte Achsenskalierungen aus der Quelle nur bewusst uebernehmen. Stuetzstellen, Ticklabels und Geradengeometrie werden aus einem gemeinsamen Koordinatenmodell erzeugt und die nicht lineare beziehungsweise schematische Darstellung im Szenenbrief dokumentiert.

## Tabellen Und Skalenvergleiche

- Vergleichszeilen verwenden feste Spalten und eine gemeinsame vertikale Grundlinie fuer Kennzahl, Bezugsmenge, Beispiel und Ergebnis.
- Fuer rein numerische Groessenordnungen keine beliebigen Gegenstands-Piktogramme erfinden. Skalen-Badges nur verwenden, wenn sie eine andere Angabe ersetzen; sie duerfen Nenner, Beispiel und Ergebnis nicht als vierte mathematisch gleichwertige Darstellung wiederholen.
- Pro Vergleichszeile nur die Angaben zeigen, die zum Verstehen oder Umrechnen benoetigt werden. Bei Prozent, Promille und ppm reichen beispielsweise `Kennzahl`, `Angabe` und `entspricht`.
- Spaltentitel ersetzen wiederholte Textfragmente in jeder Zeile. Trennlinien strukturieren Zeilen, verbinden aber keine Inhalte als Prozess.
- Wenn Prozessphasen einem übergeordneten Produktlebenszyklus zugeordnet sind, muss die Zuordnung pro Phase explizit lesbar sein. Zwei unverbundene Reihen mit ähnlichen Phasenbegriffen reichen nicht; Phasenband, Spannweite oder eindeutiges Zuordnungslabel müssen den Zusammenhang sichtbar machen.
- Auffangkategorien der Quelle wie `Other …` oder `Weitere Ziele` bleiben als Kategorie sichtbar. Ein einzelnes Beispiel darf die offene Quellkategorie nur erläutern, aber nicht ersetzen.
- Gleichrangige Beobachtungs- oder Prüfpunkte werden als echte Aufzählung mit konsistenten Bullets gesetzt. Reine Zeilenumbrüche dürfen keine Liste vortäuschen.

## Animation

- Animation ist optional. Eine statische klare Szene ist besser als willkuerliche Reveals.
- Box, Text, Rand, Icon und zugehoeriger Aufzaehlungspunkt bilden eine atomare Gruppe.
- Abschnittslabel wie `Ursache`, `Folge` oder `Ausmass` niemals vor dem zugehoerigen Inhalt zeigen.
- Ein beschriebener Zustandswechsel wird als sichtbare Bewegung oder Transformation desselben Elements umgesetzt. Die Konsequenz erscheint erst danach.
- Die Reihenfolge folgt dem Sprechertext und der raeumlichen Leserichtung. Spruenge zwischen weit entfernten Bereichen brauchen eine fachliche Begruendung.
- Animation erst nach Freigabe des vollstaendigen statischen Endzustands umsetzen.
  Beziehungen folgen ihren Inhalten: Pfeile und Fuehrungslinien erscheinen
  fruehestens gemeinsam mit allen benoetigten Endpunkten.

## Piktogramme Und Bilder

- Piktogramme nur mit eindeutiger Semantik einsetzen. `identifizieren` oder `untersuchen` wird beispielsweise durch eine Lupe getragen, nicht durch ein allgemeines Warnsymbol.
- Seminarweite Nutzerentscheidung: Neue Piktogramme verwenden den
  minimalistischen Stil `reltest-education-minimal-v1` aus
  `workflow/30-visual-decision/pictogram-creation-workflow.md`. Flat 2D,
  frontal oder orthografisch, Marineblau als Grundmotiv, hoechstens eine
  semantische Akzentfarbe; keine Verlaeufe, Schatten, 3D-, Isometrie-, Glow-,
  Textur-, Emoji- oder Stickeroptik.
- E-Learning-Eignung bedeutet: ein stabiler Begriff pro Motiv, Erkennbarkeit bei
  48 px und im 960x540-Szenenrender, mindestens 3:1 Nicht-Text-Kontrast,
  Bedeutung nicht allein ueber Farbe, Beschriftung bei der Einfuehrung und
  seminarweite Wiederverwendung derselben Motivzuordnung.
- Komplexe oder konkret geforderte Motive als hochwertiges Asset erzeugen; keine kindlich wirkenden Ersatzformen aus wenigen SVG-Primitiven.
- Wiederkehrende Produkte und Fallbeispiele mit demselben freigegebenen Asset zeigen.
- Nutzerentscheidungen wie `Zeichnung statt Foto`, `generiertes Bild` oder identitaetsbestimmende Merkmale gelten verbindlich fuer die ganze Sequenz.
- Konkrete Motive wie Strommast, Batterie, Wechselrichter, Messgeraet oder
  Haushaltsgeraete nicht durch generische Boxen oder wenige primitive Linien
  ersetzen. Im Zielmassstab muss das Motiv auch ohne Label eindeutig erkennbar
  sein.

## Designreferenz Und Serienproduktion

- Seminarweite Nutzerentscheidung: Content-SVGs enthalten niemals einen
  vollflaechigen Folienhintergrund, auch keinen weissen oder nahezu weissen
  Verlauf, kein technisches Raster und keine Gruppe `brand_background`. Der
  Folienmaster beziehungsweise das Downstream-System liefert den Hintergrund;
  im SVG verbleiben ausschliesslich die fachlichen Elemente.

- Nennt der Nutzer ein bestehendes Modul als Stilreferenz, dessen tatsaechliche
  freigegebene Ziel-SVGs untersuchen. Nicht mit einem gleichnamigen Kapitel oder
  einer allgemeinen Palette verwechseln.
- Verlangt der Nutzer die Wiederverwendung einer konkreten Szene, muss das
  Zielartefakt technisch aus genau dieser Referenz abgeleitet werden. Eine nur
  aehnliche Neugestaltung gilt nicht als Wiederverwendung; die Referenz wird in
  Metadaten und Redesign-Brief dokumentiert.
- Vollfolien als Referenz bedeuten Vollfolien als Ziel, sofern der Nutzer nicht
  ausdruecklich nur ein Content-SVG verlangt.
- Die erste Szene jedes neuen Archetyps statisch als Pilot freigeben. Ungepruefte
  CSS-, Asset-, Linien- oder Animationsmuster nicht auf mehrere Folien uebertragen.

## Textkontrast Und Verbinder

- Keine globale `text { fill: ... }`-Regel einsetzen, wenn unterschiedliche
  Textfarben benoetigt werden. Kontrast mit dem berechneten Renderstil pruefen,
  nicht nur anhand der SVG-Attribute.
- RelTest-Verbinder verwenden bevorzugt 1,5 bis 2,5 px, 4 px fuer Betonung und
  hoechstens 6 px ohne begruendete Spezialausnahme. Pfeilkoepfe bleiben optisch
  untergeordnet und skalieren proportional zur Linie.
- In kompakten Methodendiagrammen müssen Pfeilschaft und Pfeilspitze auch in der verkleinerten Viewer-Ansicht eindeutig erkennbar bleiben. Sehr kurze Markerfragmente werden durch ausreichend lange, gerichtete Verbinder ersetzt.
- Lange Kartenüberschriften erhalten vor vertikalen Teilern einen optisch sicheren Abstand. Schriftgröße, Titelumbruch und Teilerposition werden gemeinsam geplant.

## Sprache

- Sichtbare Seminartexte, Handlungsimpulse und bearbeitete Sprechertexte konsequent in der Du-Form halten.
- Deutsche Umlaute ausschreiben und keine Ersatzschreibungen in sichtbaren Texten verwenden.
- Kurze Labels und konkrete Handlungen bevorzugen; erklaerende Saetze gehoeren primaer in den Sprechertext.

## Visuelle Freigabe

- Quelle, Ziel und eine vergleichbare freigegebene Folie des Referenzmoduls im
  Endzustand direkt nebeneinander vergleichen.
- Endzustand und jeden fachlich relevanten Animationszustand pruefen.
- In 1920x1080 und in realistischer verkleinerter Viewer-Ansicht kontrollieren.
- Gezielt nach Text-Randkontakt, Pfeilfragmenten, Kollisionen, unklarer Blickfuehrung, unnoetigen Karten und generisch wirkenden KI-Mustern suchen.
- `0 errors` in der automatischen QA ersetzt diese visuelle Pruefung nicht.
- Ohne gerendertes Zielpreview keine Freigabe und keine Fertigmeldung.
