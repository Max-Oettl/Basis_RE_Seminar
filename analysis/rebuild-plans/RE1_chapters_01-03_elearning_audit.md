# E-Learning-Audit RE1 - Kapitel 1 bis 3

Stand: 2026-07-17  
Umfang: Szenen 1 bis 39  
Pruefgrundlage: aktuelle Full-Slide-SVGs, Sprechertext-Trigger, Animationsmanifeste, Redesign-Briefs, Inhalts-Crosschecks und gerenderte Endzustaende.

## Bewertungslogik

- `beibehalten`: Lernbotschaft, Endzustand und Animation sind schluessig.
- `angepasst`: Im Rahmen dieses Audits wurde eine klar begrenzte Verbesserung umgesetzt.
- `beobachten`: Kein akuter Fehler, aber ein sinnvoller Kandidat fuer eine spaetere Iteration.
- `final - nur Erkenntnis`: Szene ist im Viewer final markiert und wurde nicht veraendert.

Bei der Animationsbewertung zaehlt die Zahl der **Sprechertext-Triggergruppen**, nicht die Zahl der technischen Manifest-Schritte. Direkt aufeinanderfolgende Schritte mit identischer `sourceText`-Phrase werden im Viewer gleichzeitig ausgeloest und bilden didaktisch eine gemeinsame Gruppe.

## Uebergreifendes Ergebnis

### Was gut funktioniert

- Die meisten Szenen besitzen eine klar erkennbare Hauptaussage und verwenden Animationen fuer fachliche Gruppen statt fuer einzelne Textfragmente.
- Die wiederkehrende Phasenleiste in Kapitel 2 schafft Orientierung und behaelt Bezeichnungen, Reihenfolge und Farben konsistent bei.
- Die technischen Szenen in Kapitel 3 werden ueberwiegend vom Plot getragen. Achsen, Daten, Kurven, Ablesungen und Formeln erscheinen in fachlich sinnvoller Reihenfolge.
- Statische Szenen sind moeglich: Szene 7 profitiert vom sofortigen Gesamtvergleich und braucht keine kuenstliche Animation.
- Piktogramme werden meist semantisch und nicht rein dekorativ eingesetzt.
- Die Inhalts-Crosschecks fuer die drei Kapitelbereiche sind bestanden; es gibt keinen systematischen Verlust von Pflichtinhalten.

### Wiederkehrende Schwachstellen

- Eine zusaetzliche Unterzeile, ein Banner oder eine Karte ist nur dann sinnvoll, wenn sie eine echte Hierarchie oder einen Prozesszustand traegt. Reine Wiederholung des Titels wirkt generisch.
- Eine statisch sichtbare Erklaerbox darf keine Schlussfolgerung vorwegnehmen, die erst spaeter im Sprechertext und im Plot erscheint. Das war bei Szene 11 der Fall und wurde korrigiert.
- Uebersichtsfolien mit vielen gleichartigen Karten bleiben trotz Animation im Endzustand dicht. Hier muss zwischen notwendiger Vergleichsstruktur und dekorativem Kartenraster unterschieden werden.
- Kleine technische Beschriftungen unter etwa 20 px sind bei verkleinerter Darstellung kritisch. Szene 37 wurde deshalb lesbarer gesetzt.
- Die Funktionsleiste in Kapitel 3 ist ab Szene 32 als wechselnde Abschnittsnavigation sinnvoll. Der einzelne `f(t)`-Chip auf den Szenen 27 bis 31 ist weniger informationsstark und bleibt ein Kandidat fuer eine spaetere Vereinfachung.

## Kapitel 1 - Einleitung

### Szene 1 - Rückruf A320neo-Triebwerke

- Status: `angepasst`
- Lernwirkung: Technischer Auslöser, Folge und wirtschaftliches Ausmaß sind schnell erfassbar; das reale Foto verankert den Fall.
- Animation: Zwei Triggergruppen - zuerst Ursache und Folge, danach Kennzahlen und Herstellerwirkung. Die Reihenfolge entspricht dem Erklärfluss.
- Challenge: Die Abstände zwischen den Bezeichnungen `Ursache` und `Folge` und ihren Texten waren uneinheitlich; die drei Kennzahlenfelder waren höher als ihr Inhalt erforderte.
- Änderung: Ursache und Folge auf ein gemeinsames vertikales Raster gesetzt und die Kennzahlenfelder deutlich flacher ausgeführt.

### Szene 2 - Rueckrufe auf dem Hoechststand

- Status: `beibehalten`
- Lernwirkung: Ein dominanter Plot mit drei gebuendelten Kennzahlen vermittelt den Trend ohne Umwege.
- Animation: Eine atomare Triggergruppe fuer Diagramm und Kennzahlen ist sinnvoll, weil alle Werte denselben Vergleich bilden.
- Challenge: Eine schrittweise Balkenanimation wuerde den Mehrjahresvergleich eher verlangsamen als verbessern.
- Entscheidung: Keine Aenderung.

### Szene 3 - Takata-Airbags

- Status: `angepasst`
- Lernwirkung: Die Fallstruktur ist passend; Ursache, Verletzungsfolge und Ausmaß sind jetzt klar getrennt.
- Animation: Zwei Triggergruppen - Kontext, danach Ausmaß und Konsequenzen. Das Wort `Ausmaß` erscheint nicht vor seiner vollständigen Gruppe.
- Challenge: `Mrd. EUR` bleibt fachlich unscharf, entspricht aber dem verfügbaren Quellinhalt und darf nicht erfunden konkretisiert werden. Das zeitweise sichtbare Wöhlerbild war kein Folieninhalt, sondern eine falsche Viewer-Zuordnung einer verschachtelten Plotdatei.
- Änderung: Ursache und Folge auf dasselbe vertikale Raster gesetzt, Kennzahlenfelder verkleinert und die Viewer-Zuordnung verschachtelter SVG-Assets korrigiert.

### Szene 4 - Galaxy Note 7

- Status: `angepasst`
- Lernwirkung: Ursache, Brandfolge und Geschäftswirkung sind als Fallstudie gut getrennt.
- Animation: Zwei Triggergruppen bilden Ursache und spätere Konsequenz sauber ab.
- Challenge: Das Layout ähnelt Szene 1 und 3 bewusst; deshalb müssen auch Abstände und Kennzahlenhöhen innerhalb dieses Musters identisch sein.
- Änderung: Ursache-Folge-Raster und kompakte Kennzahlenfelder an Szene 1 und 3 angeglichen.

### Szene 5 - Konsequenzen von Unzuverlaessigkeit

- Status: `final - nur Erkenntnis`
- Lernwirkung: Die Baumstruktur macht die drei Konsequenzklassen und ihre gemeinsame Ursache sichtbar.
- Animation: Wurzel, nicht-rechtliche, zivilrechtliche und strafrechtliche Folgen erscheinen in vier eindeutigen Gruppen.
- Challenge: Karten sind hier semantische Aeste und damit gerechtfertigt.
- Erkenntnis: Gute Referenz fuer animierte Hierarchien mit einem gemeinsamen Ursprung.

### Szene 6 - Einflüsse auf die Zuverlässigkeit

- Status: `angepasst`
- Lernwirkung: Das zentrale Zuverlässigkeitsziel und alle sieben einwirkenden Faktoren sind wie in der Quelle als gemeinsames Wirkungsfeld erfassbar.
- Animation: Kern, Entwicklungsdruck, Komplexität und weitere Einflüsse ergeben vier ruhige Etappen; innerhalb jeder Etappe erscheinen zusammengehörige Faktoren gemeinsam.
- Challenge: Die vorherige Links-Rechts-Trennung und Rot-Grün-Codierung erfand eine positive beziehungsweise negative Gegenüberstellung, die in der Quelle nicht enthalten war.
- Änderung: Folie als moderne radiale Einflusskarte neu aufgebaut; einheitliche blaue Richtungspfeile erhalten die Beziehungstopologie der Ursprungsfolie.

### Szene 7 - Kriterien beim PKW-Neuwagenkauf

- Status: `beibehalten`
- Lernwirkung: Der sofortige Mehrjahresvergleich ist die eigentliche Aufgabe; die hervorgehobenen Kriterien geben den Leseschluessel.
- Animation: Bewusst statisch. Das ist fuer diese Vergleichsfolie besser als ein Balken-fuer-Balken-Aufbau.
- Challenge: Keine Legenden- oder Textueberlagerung mehr sichtbar; der Endzustand bleibt auch verkleinert lesbar.
- Entscheidung: Keine Aenderung.

### Szene 8 - Maschinenausfälle planbar machen

- Status: `angepasst nach Viewer-Feedback 2026-07-31`
- Lernwirkung: Das vollständige SKF-Zitat bleibt als eine gemeinsame visuelle Aussage erkennbar; die Interpretation wird erst darunter als eigener Lernschluss formuliert.
- Animation: Die Content-Ebene bleibt während der allgemeinen Lebensdauereinleitung leer. Anlagenbild, Zitatkörper, originale Schlusszeile und praktische Bedeutung erscheinen in vier fachlich begründeten Triggergruppen.
- Challenge: `Machen Sie zwei daraus.` war fälschlich aus dem direkten Zitat herausgelöst und zusammen mit der Interpretation in eine separate Nutzenkarte verschoben worden. Dadurch wurde die Quellenstruktur verändert.
- Änderung: Die Originalzeile wieder in die Zitatkarte aufgenommen und als Schlusszeile desselben Zitats typografisch angebunden. Die Ergebnisbox enthält nur noch die aus dem Sprechertext abgeleitete praktische Bedeutung. Das konkrete Anlagenbild erscheint erst bei der SKF-Nennung.

### Szene 9 - Was ist Zuverlaessigkeit?

- Status: `angepasst` (Viewerstatus offen)
- Lernwirkung: Die Baumstruktur zeigt den Weg vom Gesamtsystem zur Komponente und benennt an jedem Knoten dessen Funktion; die Wirkungskette macht danach unmittelbar sichtbar, wie ein Kolbenausfall die Funktionen von Motor und PKW unterbricht.
- Animation: Drei Triggergruppen: zuerst die reine Systemhierarchie, dann die Funktionszeilen an allen Knoten zusammen mit dem Funktionszusammenhang `Kolben -> Motor -> PKW`, erst beim gesprochenen Kolbenausfall Blitzsymbol und Fehlerfortpflanzung.
- Challenge: Redundante Hierarchieuntertitel wie `System`, `Teilsystem` und `Komponente` erklaerten die funktionale Abhaengigkeit nicht. Im rechten Zusammenhang kollidierten die Pfeile zudem mit mehrzeiligen Fehlertexten.
- Aenderung: Untertitel durch kurze technische Funktionen ersetzt, die rechte Zone auf die Objektnamen `Kolben`, `Motor` und `PKW` reduziert und beide Pfeilketten in freie Korridore zwischen den Textspalten gelegt.

### Szene 10 - Stress-Strength-Interference

- Status: `angepasst nach Viewer-Feedback 2026-07-31`
- Lernwirkung: Belastung, Belastbarkeit und die eigenständige Ausfallverteilung sind als zentrales Modell klar; Beginn und Ende der sichtbaren Überlappung lassen sich unmittelbar ablesen.
- Animation: Vier Triggergruppen. Kurve, Flaeche, direkte Beschriftung und zugehoerige Einflusskarte werden fuer Belastung beziehungsweise Belastbarkeit gemeinsam ausgeloest; `Ausfaelle` erscheint erst mit dem Ueberlappungsbereich.
- Challenge: Die Ausfälle waren nur als mathematische Minimum-Hülle in der Mitte eingefärbt; außerdem besaßen Belastung und Belastbarkeit unterschiedliche Spitzenhöhen. Beides wich von der Quellfolie ab.
- Aenderung: Beide Hauptverteilungen auf identische Streuung und damit exakt gleiche Spitzenhöhe gesetzt. Die Hauptkurven laufen ohne künstliches Abschneiden sauber in die Grundlinie aus. Die Ausfälle werden als eigene, glatt begrenzte und konturierte Verteilung über das gesamte sichtbare Überlappungsintervall erzeugt; das ausgelagerte Label ist über eine Führungslinie eindeutig zugeordnet. Banknote, Richterhammer und Kundenbedenken bleiben als Raster-Piktogrammsatz erhalten; Boxtexte lauten `Kosten`, `Produkthaftung` und `Kundenzufriedenheit`.

### Szene 11 - Belastbarkeit erhoehen

- Status: `angepasst nach Viewer-Feedback 2026-07-31`
- Lernwirkung: Gestrichelter Vorher-Zustand, sichtbare Verschiebung der gleich hohen Belastbarkeitsverteilung und die schmalere sowie niedrigere Ausfallverteilung bilden drei nachvollziehbare Lernschritte; ein zusätzliches Innenlabel `Ausgangslage` ist dafür nicht erforderlich.
- Animation: Drei Triggergruppen. Zuerst wird die Belastbarkeitskurve deckungsgleich zur gestrichelten Ausgangslage gezeichnet. Danach bewegt sich dieselbe Kurve sichtbar nach rechts. Erst nach der Bewegung erscheinen Ueberlappungsflaeche und Ergebnis.
- Challenge: Eine nur neu eingezeichnete Zielkurve zeigt den Unterschied, aber nicht den vom Sprechertext beschriebenen Veraenderungsvorgang.
- Aenderung: Temporären Ausgangszustand und echte `transform`-Bewegung ergänzt; die Folge bleibt bis zum dritten Trigger verborgen. Das Stress-Strength-Modell verwendet denselben korrigierten Verteilungsvertrag wie Szene 10. Das Innenlabel `Ausgangslage` wurde entfernt, die Hauptkurven und die begrenzte Ausfallkurve erhalten glatte Einstiege, und `Ausfälle` wird außerhalb der engen Datenzone mit Führungslinie beschriftet.

### Szene 12 - Zuverlaessigkeit ist ein Zielkonflikt

- Status: `angepasst nach Viewer-Feedback 2026-07-31`
- Lernwirkung: Plot und eindeutig erkennbare Balancewaage machen den Zielkonflikt aus Ausfallreduktion und Ueberdimensionierung verstaendlich.
- Animation: Eine gemeinsame Triggergruppe fuer den Trade-off ist ruhig und passend.
- Challenge: Die fruehere Waage bestand nur aus einem Balken, Kreis und zwei Schraegstrichen und war ohne Kontext nicht als Waage erkennbar.
- Aenderung: Generierte technische Balancewaage als lokales Rasterasset eingesetzt; die Boxen `Ausfaelle` und `Kosten` den beiden Waagschalen zugeordnet und den Zielhinweis darunter gebuendelt. Der Plot übernimmt die gleich hohen, natürlich auslaufenden Hauptverteilungen und die glatt begrenzte reduzierte Ausfallverteilung aus dem korrigierten Sequenzvertrag. Das Innenlabel `Ausgangslage` entfällt; das ausgelagerte Ausfalllabel ist über eine Führungslinie zugeordnet.

### Szene 13 - Definition Zuverlaessigkeit

- Status: `final - nur Erkenntnis`
- Lernwirkung: Die Definition wird in fuenf Bestandteile zerlegt, bleibt aber als ein Satz erkennbar.
- Animation: Eine atomare Gruppe verhindert, dass Satzteile ohne grammatischen Zusammenhang einzeln erscheinen.
- Challenge: Zeilenweises Einblenden waere hier keine Verbesserung; die Definition soll als zusammenhaengende Einheit gelesen werden.
- Erkenntnis: Gute Referenz fuer ruhige Definitionsfolien.

## Kapitel 2 - Einfuehrung in das Zuverlaessigkeitsmanagement

### Szene 14 - Einteilung der Zuverlaessigkeitsmethoden

- Status: `angepasst`
- Lernwirkung: Die breite Badewannenkurve liefert wieder den dominanten Bezugsrahmen; Fokusfelder und Ergebnisfelder folgen der Struktur der Ursprungsfolie.
- Animation: Drei Triggergruppen - Ausgangskurve, qualitative Wirkung mit Erklaerung, quantitative Wirkung mit Erklaerung.
- Challenge: Der fruehere Plot besass zu wenig oberen Sicherheitsraum. Danach waren die Reduktionspfeile zwar nicht mehr abgeschnitten, erschienen an kleinen Kurvenabstaenden aber nur noch als Pfeilspitzen ohne lesbaren Schaft. Ausserdem ordnete das linke Ergebnisfeld die Systemanalyse nur Fall 1 statt den Faellen 1 und 2 zu.
- Aenderung: Python-Plot deutlich breiter exportiert und die obere Achsenreserve vergroessert. Die Reduktion wird nur noch an repraesentativen Stellen mit vollstaendigen gefuellten Pfeilen gezeigt. Fokusfelder wieder ueber der Kurve, kompakte Ergebnisfelder darunter; qualitative Methoden und Risikoreduktion explizit den Faellen 1 und 2, quantitative Methoden dem Fall 3 zugeordnet.

### Szene 15 - Zuverlaessigkeitsmethoden als Werkzeugkaesten

- Status: `beobachten`
- Lernwirkung: Die Gegenueberstellung von Aufgabe und typischen Werkzeugen ist klar und vollstaendig.
- Animation: Einfuehrung des Werkzeugkastenbildes, danach qualitative und quantitative Seite.
- Challenge: `Zwei Werkzeugkaesten - ein gemeinsames Ziel` wiederholt einen Teil des Titels und ist der staerkste Kandidat fuer ein entbehrliches Zwischenbanner.
- Empfehlung: Banner nur behalten, wenn die Sprecherpause vor der Gegenueberstellung didaktisch genutzt wird; sonst direkt mit den beiden Werkzeugkaesten starten.

### Szene 16 - Auslegung und Absicherung

- Status: `angepasst`
- Lernwirkung: Die gemeinsame Zielwurzel verbindet konstruktive Auslegung mit Erprobung und Absicherung.
- Animation: Absicherungsbeitrag, Zusammenarbeit und Designbeitrag folgen dem Sprechertext.
- Challenge: Das zusaetzliche Checklisten-Piktogramm schwebte ohne eigene fachliche Funktion im linken Verantwortungsbereich. Rechts waren qualitative und quantitative Unterpunkte unterschiedlich klein gesetzt und der quantitative Block zu dicht am Kartenrand.
- Aenderung: Freischwebendes Piktogramm entfernt, Unterpunkte beider Verantwortungsbereiche auf eine gemeinsame Schriftstufe gesetzt und dem quantitativen Block mehr Innenabstand gegeben.

### Szene 17 - Fuenf Phasen des Zuverlaessigkeitsmanagements

- Status: `beobachten`
- Lernwirkung: Als Uebersicht enthaelt die Szene viele Begriffe, zeigt aber die gesamte spaetere Navigationslogik.
- Animation: Eine Triggergruppe je Phase ist richtig. Die Szene darf langsam aufgebaut werden.
- Challenge: Der Endzustand ist dicht; die sieben Produktlebenszyklusfelder oben und die fuenf Managementphasen unten koennen ohne Erklaerung wie zwei konkurrierende Modelle wirken.
- Empfehlung: Im Sprechertext explizit sagen, dass die beiden Ebenen einander zugeordnet werden; alternativ spaeter eine sichtbare Zuordnungsachse ergaenzen.

### Szene 18 - Phase 1: Zuverlaessigkeitsplanung

- Status: `beibehalten`
- Lernwirkung: Treiber, Zielkaskade und repraesentatives Lastkollektiv bilden drei klar getrennte Aufgaben.
- Animation: Die drei Gruppen folgen der fachlichen Ableitung vom Ziel zur Belastungsbeschreibung.
- Challenge: Die Phasenleiste ist hier Orientierung und keine unnoetige Unterueberschrift.
- Entscheidung: Keine Aenderung.

### Szene 19 - Phase 2: Schwachstellenanalyse und Zuverlaessigkeitsbewertung

- Status: `beibehalten`
- Lernwirkung: Die vier Prozessschritte sind als gerichtete Kette erkennbar.
- Animation: Drei Triggergruppen; Systemgrenze und internes Verstehen werden sinnvoll zusammen eingefuehrt, danach kritische Stellen und Verbesserung.
- Challenge: Vier Karten sind hier Prozessstationen und deshalb gerechtfertigt.
- Entscheidung: Keine Aenderung.

### Szene 20 - Methoden der Schwachstellenanalyse

- Status: `angepasst`
- Lernwirkung: Die vier Methoden werden in einer quellnahen 2x2-Matrix durch grosse fachliche Skizzen unterscheidbar, nicht durch wiederholende Erklaerabschnitte.
- Animation: Eine Gruppe je Methode in der Reihenfolge P-Diagramm, Blockschaltbild, Fehlerbaum, FMEA.
- Challenge: Die fruehere Vier-Spalten-Darstellung war trotz verbessertem P-Diagramm insgesamt gequetscht und entfernte sich durch lange Absatztexte von der grafisch getragenen Ursprungsfolie.
- Aenderung: Vier breite Felder in zwei Reihen aufgebaut. P-Diagramm, Fehlerbaum, Blockschaltbild und FMEA erhalten jeweils eine grosse charakteristische Grafik und nur ihre notwendige Bezeichnung; die Erklaerung bleibt im Sprechertext.

### Szene 21 - Phase 3: Zuverlaessigkeitserprobung und Nachweis

- Status: `angepasst`
- Lernwirkung: Verbesserung und Nachweis werden als zwei unterschiedliche Testpfade sichtbar.
- Animation: Zuerst Schwachstellenidentifikation, danach quantitativer Nachweis.
- Challenge: Das allgemeine Warn-/Maschinenpiktogramm visualisierte das gezielte Identifizieren von Schwachstellen nicht eindeutig.
- Aenderung: Im Verbesserungspfad eine Lupe als direktes Such- und Identifikationssymbol eingesetzt; die zentrale Erprobungsbox bleibt als gemeinsame Prozesswurzel erhalten.

### Szene 22 - Zielsetzungen von Zuverlaessigkeitstests

- Status: `angepasst`
- Lernwirkung: Die drei Zielklassen koennen direkt mit den links gelisteten Testarten verbunden werden.
- Animation: Verbessern, messen und vergleichen erscheinen nacheinander passend zum Sprechertext.
- Challenge: `Weitere Fragestellungen` war generisch und versteckte die konkrete Aussage.
- Aenderung: Dritte Zielkarte auf `Produktgenerationen vergleichen` praezisiert; Erlaeuterung entsprechend konkretisiert.

### Szene 23 - Phase 4: Produktionsabsicherung

- Status: `beibehalten`
- Lernwirkung: P-FMEA, DOE und Screening bilden eine nachvollziehbare Produktionspipeline.
- Animation: Drei Prozessgruppen in derselben Richtung wie die sichtbaren Pfeile.
- Challenge: Die Ergebnisleiste erscheint mit dem letzten Schritt und ist dadurch keine vorweggenommene Zusammenfassung.
- Entscheidung: Keine Aenderung.

### Szene 24 - Bausteine einer systematischen Produkterprobung

- Status: `angepasst`
- Lernwirkung: Funktionale Erprobung wird von qualitativer Analyse ueber kritische Komponenten zum quantitativen Nachweis gefuehrt.
- Animation: Drei Gruppen bauen die Logik von oben und anschliessend von links nach rechts auf.
- Challenge: Nach der zuvor abgeschlossenen Phase 4 markierte die Phasenleiste wieder Phase 3. Obwohl die Szene inhaltlich eine Zusammenfuehrung ist, wirkte das wie ein unbegruendeter Prozessruecksprung.
- Aenderung: Phasenleiste vollstaendig entfernt und die Prozessdarstellung als phasenuebergreifende Zusammenfuehrung neu verteilt. Die mittlere Komponentenzone bleibt als fachlich notwendige Bruecke erhalten.

### Szene 25 - Produkterprobung und Serienfertigung

- Status: `beobachten`
- Lernwirkung: Die Rueckkopplung zwischen Produktabsicherung und repraesentativer Serien-Stichprobe wird sichtbar.
- Animation: Produktionsvorbereitung, danach die repraesentative Stichprobe aus der Serie.
- Challenge: Der Leser muss die Pfeilrichtung an der Stichprobe genau verfolgen; ohne Animation ist die Beziehung nicht sofort eindeutig.
- Empfehlung: In einer spaeteren Iteration die Pfeilbeschriftung `liefert Stichprobe` direkt an den Rueckpfeil setzen.

### Szene 26 - Phase 5: Feldprognosen

- Status: `angepasst`
- Lernwirkung: Beobachten, auswerten und in die naechste Generation zurueckfuehren bilden einen geschlossenen Lernkreis.
- Animation: Drei Triggergruppen folgen dem Prozess und enden mit der Rueckkopplung.
- Challenge: `Lessons Learned` stand zu dicht am rechten Kartenrand; der letzte Buchstabe besass keine ausreichende Sicherheitszone.
- Aenderung: Rechte Prozesskarte verbreitert, Piktogramm und Titel nach links gesetzt und die Titelstufe leicht reduziert. Der Begriff bleibt erhalten, ist nun aber mit stabilem Innenabstand lesbar.

## Kapitel 3 - Zuverlaessigkeitsfunktionen

### Szene 27 - Streuung von Ausfallzeiten im Woehlerversuch

- Status: `beibehalten` (Viewerstatus offen)
- Lernwirkung: Der Plot bleibt dominant; die Aufgabe der Zuverlaessigkeitstechnik und das ausgewaehlte Lastniveau sind eindeutig zugeordnet.
- Animation: Woehlerkurve, Datenpunkte, Lastniveau mit Kontext und anschliessend statistische Aufgabe. Vier Triggergruppen sind passend.
- Challenge: Der einzelne `f(t)`-Chip ist eher Abschnittsmarke als echte Navigation. Er stoert nicht, liefert aber weniger Nutzen als die spaetere vierteilige Funktionsleiste.
- Entscheidung: Keine Aenderung, damit die Kapitelsequenz konsistent bleibt.

### Szene 28 - Vom Histogramm zur Dichtefunktion

- Status: `beobachten` (Viewerstatus offen)
- Lernwirkung: Der Wechsel von Stichprobe zu Grundgesamtheit wird jetzt in einem einzigen Koordinatensystem erklaert.
- Animation: Histogramm, Klassenbegriff, glatte Dichtefunktion und Interpretation folgen in vier klaren Gruppen.
- Challenge: Der vollstaendige Endzustand ist beschriftungsreich; die Ablesetexte bei etwa 23.000 und 45.000 Lastwechseln liegen nahe an der Kurve.
- Empfehlung: Falls die Folie im Zielsystem stark verkleinert wird, die beiden Endpunktbeschriftungen als kurze Marker statt als lange Saetze setzen.

### Szene 29 - Dreidimensionale Woehlerkurve im Zahnbruchversuch

- Status: `beibehalten` (Viewerstatus offen)
- Lernwirkung: Die 3D-Perspektive zeigt Ausfalldichten ueber Spannung und Laufzeit; die abnehmende Peakhöhe bei kleineren Spannungen ist sichtbar.
- Animation: Zuerst Dichteprofile, danach Woehlerlinie samt Beschriftung. Die Beschriftung erscheint nicht vor der Linie.
- Challenge: Kleine Achsenticks sind bei verkleinerter Darstellung grenzwertig, die Kurvenbeziehung bleibt aber erkennbar.
- Entscheidung: Keine Aenderung.

### Szene 30 - Ausfalldichte eines 6-Gang-NKW-Getriebes

- Status: `final - nur Erkenntnis`
- Lernwirkung: Datenplot, Getriebeillustration, Prueffrage, Diagnose und Zielzustand bilden eine vollstaendige Lerninteraktion.
- Animation: Vier Triggergruppen trotz sechs Manifest-Schritten. Plot und Bild erscheinen gemeinsam; Frage, Diagnose und Zielzustand folgen getrennt.
- Challenge: Die rechte Erklaerzone ist dicht, wird aber durch die Pausefrage didaktisch gerechtfertigt.
- Erkenntnis: Gute Referenz fuer `erst beobachten, dann deuten, dann Zielbild zeigen`.

### Szene 31 - Dichtefunktion menschlicher Sterbefaelle

- Status: `final - nur Erkenntnis`
- Lernwirkung: Zwei direkt beschriftete Kurven erlauben den Vergleich ohne Legende.
- Animation: Beide Kurven erscheinen gemeinsam, danach die beiden Maxima in eigener Sprecherreihenfolge.
- Challenge: Eine getrennte Kurvenanimation waere unguenstiger, weil der Vergleich erst mit beiden Kurven moeglich ist.
- Erkenntnis: Gute Referenz fuer Vergleichskurven als gemeinsame Triggergruppe.

### Szene 32 - Von der Haeufigkeit zur Summenhaeufigkeit

- Status: `final - nur Erkenntnis`
- Lernwirkung: Histogramm und Summenhaeufigkeit stehen direkt nebeneinander; die Kumulation wird nachvollziehbar.
- Animation: Drei Sprechertext-Triggergruppen. Die sechs technischen Kumulationsziele werden innerhalb derselben Phrase gemeinsam ausgeloest.
- Challenge: Fuer besonders langsames Selbstlernen koennte eine intern gezeichnete Treppenfolge noch anschaulicher sein als das gleichzeitige Erscheinen aller Summenstufen.
- Erkenntnis: Gleiche Sprecherphrase bedeutet zu Recht eine Triggergruppe; eine fachlich sinnvolle Binnenanimation kann trotzdem als eigener Effekt innerhalb dieser Gruppe geplant werden.

### Szene 33 - Verteilungsfunktion und Ausfallwahrscheinlichkeit

- Status: `final - nur Erkenntnis`
- Lernwirkung: S-Kurve, Integral, Ableitung, Randwerte und statistische Bedeutung bilden einen vollstaendigen mathematischen Aufbau.
- Animation: Sieben fachlich getrennte Triggergruppen folgen dem Sprechertext exakt.
- Challenge: Der Endzustand ist dicht, aber jede Formelkarte traegt eine andere Beziehung. Eine pauschale Reduktion waere fachlich schaedlich.
- Erkenntnis: Gute Referenz fuer Formelaufbau mit lokalen Bedeutungsankern.

### Szene 34 - Ausfallwahrscheinlichkeit eines 6-Gang-NKW-Getriebes

- Status: `beibehalten` (Viewerstatus offen)
- Lernwirkung: Zwei typische Leserichtungen der Verteilungsfunktion werden am selben Plot geuebt.
- Animation: Plot und Bild gemeinsam; danach jeweils Hilfslinien plus zugehoeriger Ergebnissatz. Drei Triggergruppen sind optimal.
- Challenge: Die unteren Ergebnisfelder wiederholen die Ablesung bewusst, funktionieren hier aber als Merksatz und nicht als dekorative Karten.
- Entscheidung: Keine Aenderung.

### Szene 35 - Ausfallwahrscheinlichkeit des Menschen

- Status: `beibehalten`
- Lernwirkung: Kurvenvergleich und Ablesung bei 80 Jahren fuehren zu einer eindeutigen Differenz von 26 Prozentpunkten.
- Animation: Beide Kurven gemeinsam, danach Ableselinien und Ergebniszone gemeinsam.
- Challenge: Die Ergebnisleiste ist knapp und fachlich konkret; keine unnoetige Unterueberschrift.
- Entscheidung: Keine Aenderung.

### Szene 36 - Ueberlebenswahrscheinlichkeit und Zuverlaessigkeit

- Status: `beibehalten`
- Lernwirkung: Grundgleichung, Dichtekurve, Bezugszeitpunkt und zwei komplementaere Flaechen bauen den Zusammenhang systematisch auf.
- Animation: Fuenf Triggergruppen. Flaeche und zugehoerige Formel werden jeweils gemeinsam gezeigt.
- Challenge: Die Szene ist mathematisch dicht, aber nicht beliebig; jedes Element beantwortet einen eigenen Schritt der Herleitung.
- Entscheidung: Keine Aenderung.

### Szene 37 - Ausfallrate und Badewannenkurve

- Status: `angepasst`
- Lernwirkung: Definition, bedingtes Risiko, Kurve und drei Lebenszyklusbereiche sind fachlich vollstaendig.
- Animation: Sechs Triggergruppen - Definition, Risikobedeutung, Kurve und danach je eine vollstaendige Bereichsgruppe.
- Challenge: Die drei unteren Informationszonen waren im Endzustand zu klein gesetzt, obwohl sie Ursachen und Gegenmassnahmen enthalten.
- Aenderung: Typografie vergroessert, lange Gegenmassnahme im mittleren Bereich sauber umbrochen und Schlussaussagen lesbarer gesetzt.

### Szene 38 - Ausfallrate des Menschen

- Status: `beibehalten`
- Lernwirkung: Die menschlichen Kurven werden direkt mit den drei badewannenaehnlichen Lebensphasen verbunden.
- Animation: Beide Kurven gemeinsam, danach fruehe, mittlere und altersbedingte Phase.
- Challenge: Die Phasenbaender sind keine dekorativen Karten, sondern an der Zeitachse ausgerichtete Erklaerzonen.
- Entscheidung: Keine Aenderung.

### Szene 39 - Ausfallrate eines 6-Gang-NKW-Getriebes

- Status: `angepasst`
- Lernwirkung: Die Szene funktioniert als bewusstes Gegenbeispiel zur Badewannenkurve.
- Animation: Steigende Kurve plus Getriebe, danach Verschleissmechanismus und abschliessend das durchgestrichene Badewannenmodell.
- Challenge: Das durchgestrichene Referenzsymbol zeigte eine umgedrehte Badewannenkurve und negierte damit keine fachlich korrekte Ausgangsform.
- Aenderung: Referenzsymbol auf den korrekten U-foermigen Badewannenverlauf gedreht; erst darueber liegt die rote Durchstreichung.

## Kandidaten fuer den Workflow

Diese Punkte sind aus mehreren Szenen ableitbar und sollten nach Review dieses Audits in die zentralen Regeln uebernommen werden:

1. Animations-QA muss Sprechertext-Triggergruppen statt roher Manifest-Schrittzahlen bewerten.
2. Alle statisch sichtbaren Inhalte muessen darauf geprueft werden, ob sie eine spaetere Schlussfolgerung vorwegnehmen.
3. Ein generischer Titel wie `Motivation`, `Uebersicht` oder `Weitere Fragestellungen` ist durch eine fachliche Aussage zu ersetzen, sofern keine echte Navigationsfunktion besteht.
4. Karten sind nur fuer Prozessstufen, Vergleichsklassen, Verantwortungsbereiche oder echte Ergebnisgruppen erlaubt; eine rein dekorative Kartenanzahl ist kein Layoutprinzip.
5. Statische Funktions- und Phasenleisten sind nur zulaessig, wenn ihr aktiver Zustand innerhalb der Sequenz wechselt und sie dem Lernenden Orientierung geben.
6. Bei Diagrammen erscheinen Vergleichskurven gemeinsam, wenn der Sprecher sie im selben Satz vergleicht; Hilfslinien, Ergebnis und Beschriftung bilden eine gemeinsame Triggergruppe.
7. Eine Szene darf bewusst statisch bleiben, wenn ihr Lernziel der sofortige Gesamtvergleich ist.
8. Der vollstaendige Endzustand bleibt ein eigener QA-Zustand: Animation darf keine unlesbare Endkomposition entschuldigen.
9. Fuer kleine Zielansichten sollten Primaertexte moeglichst mindestens 22 px und dichte technische Sekundaertexte mindestens etwa 18 bis 20 px besitzen.
10. Finale Szenen duerfen in Audits bewertet, aber ohne ausdrueckliche Freigabe nicht veraendert werden.
11. Wiederkehrende Fallstudienmuster brauchen ein gemeinsames vertikales Raster: Bezeichner, Textabstand und Kennzahlenhöhe dürfen nicht je Folie neu entstehen.
12. Ein Redesign muss die Beziehungstopologie der Quelle erhalten. Eine radiale Einflussstruktur darf nicht ohne fachlichen Beleg in positive und negative Seiten umgedeutet werden.
13. Bei einer einzelnen Pointe ist eine konkrete Handlungszeile stärker als mehrere abgeleitete Nutzenzeilen; Zusatznutzen gehört in den Sprechertext, sofern er nicht selbst Lernziel ist.
14. Der Viewer muss das eigentliche Szenen-SVG gegenüber verschachtelten Plot-, Formel- und Medien-SVGs eindeutig priorisieren.
15. Fehlfunktionen brauchen ein eindeutiges Ereignissignal und eine sichtbare Wirkungskette. Kennzeichnungsfarbe allein reicht nicht; Ausfallsymbol und Fehlerfolgen erscheinen erst mit der zugehörigen Sprechertextpassage.
16. Direkte Plotbeschriftungen muessen technisch innerhalb desselben SVG-Targets wie Kurve, Flaeche oder Markierung liegen. Eine nur zeitlich aehnliche, aber separat sichtbare Beschriftung ist nicht ausreichend.

## Umgesetzte Aenderungen in diesem Audit

- Szene 3: Textueberlagerung zwischen Ursache und Folge beseitigt.
- Szene 8: generischen Titel durch eine fachliche Aussage ersetzt.
- Szene 11: Belastbarkeitskurve als dreistufige Sequenz aus Ausgangslage, sichtbarer Rechtsbewegung und anschließendem Ausfallbereich umgesetzt.
- Szene 22: vage dritte Zielkarte konkretisiert.
- Szene 37: Lesbarkeit der drei Phasenbereiche verbessert.
- Szenen 1, 3 und 4: Ursache-Folge-Raster vereinheitlicht und Kennzahlenfelder verkleinert.
- Szene 6: Quelltopologie als moderne radiale Einflusskarte wiederhergestellt.
- Szene 8: uneindeutiges Piktogramm entfernt und Pointe auf einen Stichpunkt reduziert.
- Szene 9: Blitzsymbol sowie sprechertextgeführte Fehlerfortpflanzung über Komponente, Teilsystem und System ergänzt.
- Szene 10: Plotlabels mit ihren Kurven-Targets gruppiert und Achsenpfeile im Python-Generator ergänzt.

Die final markierten Szenen 5, 13, 16 und 30 bis 33 wurden nicht veraendert.

## Verifikation

- Inhalts-Crosscheck Szenen 1 bis 15: `15/15` bestanden.
- Inhalts-Crosscheck Szenen 14 bis 26: `13/13` bestanden.
- Inhalts-Crosscheck Szenen 27 bis 39: `13/13` bestanden.
- Browserbasierte SVG-QA fuer Szenen 1 bis 39: `0` Fehler bei 207 geprueften Animationszustaenden.
- Die verbleibenden Warnungen stammen ueberwiegend aus dem auf modulare Content-SVGs zugeschnittenen Designprofil sowie aus absichtlichen Ueberlagerungen innerhalb von Python-Plots und LaTeX-Glyphen. Sie wurden nicht als visuelle Freigabeersatz behandelt; alle 39 Endzustaende wurden zusaetzlich einzeln gerendert und visuell geprueft.
- Ein Viewer-Zuordnungsfehler wurde behoben: Plotdateien wie `woehler_3d.svg` werden nicht mehr aufgrund der Zeichenfolge `3d` als Folie 3 interpretiert.
- Der statische XML-Check laedt bei LaTeX-SVGs keine externen DTD-Ressourcen mehr und funktioniert dadurch deterministisch sowie offline.
- Feedbackrunde Szenen 1, 3, 4, 6 und 8: Inhalts-Crosscheck `15/15` bestanden; gezielte Browser-QA ohne Fehler, Viewerzuordnung jeweils auf das eigentliche `slide_XXX.svg` bestaetigt.
- Feedbackrunde Szene 9: Inhalts-Crosscheck `15/15` bestanden; gezielte Browser-QA ohne Fehler; Viewer erkennt drei semantische Animationsschritte.
- Feedbackrunde Szene 9, Funktionsdarstellung: Inhalts-Crosscheck `15/15` bestanden; gezielte Browser-QA mit `0` Fehlern; Baumfunktionen und rechter Funktionszusammenhang bilden gemeinsam den zweiten Animationsschritt, die Fehlerwirkung bleibt der dritte Schritt.
- Feedbackrunde Szenen 14, 20, 21, 26 und 39: Inhalts-Crosschecks Kapitel 2 und 3 jeweils `13/13` bestanden; Browser- und Layout-QA mit `0` Fehlern bei 25 geprueften Animationszustaenden. Verbleibende Warnungen betreffen nur absichtlich nicht 16:9-formatige Plot-/Formelassets und fehlende optionale `data-qc-*`-Hinweise innerhalb zweier Python-Plot-SVGs, nicht Textueberlauf, Kollisionen oder abgeschnittene Geometrie.

## Workflow-Transfer 2026-07-19

- Reichweite: `project_rule` und mehrere `domain_rule`-Ergaenzungen.
- Erkenntnis: Review-Befunde duerfen nicht nur im Szenen-Audit oder lokalen Generator verbleiben. Vor neuen Folien muessen bestaetigte Learnings aktiv geladen und als QA-Schwerpunkte in den Redesign-Brief uebernommen werden.
- Umsetzung: Zentrale Feedback-Lernschleife unter `workflow/00-router/review-feedback-learning-loop.md`, destillierte Redesign-Regeln im Skill-Referenzordner sowie verbindliche Rueckfuehrung in Redesign-, Plot-, Animations- und QA-Workflow.
- Verifikation: Skill-Struktur mit `quick_validate.py` erfolgreich validiert; alle neuen Router- und Referenzpfade existieren und sind aus Skill beziehungsweise Kontext-Ladekarte erreichbar.
- Feedbackrunde Szene 10: Inhalts-Crosscheck `15/15` bestanden; gezielte Browser-QA mit `0` Fehlern; Kurven, Flächen und direkte Beschriftungen werden als gemeinsame semantische Targets animiert, die Achsenpfeile sind Bestandteil des Python-Plots.
- Feedbackrunde 2026-07-31, Szenen 8 und 10–12: Zitatzugehörigkeit in Szene 8 quellgetreu korrigiert; Stress-Strength-Hauptverteilungen in 10–12 auf gleiche Spitzenhöhe gebracht und eine eigenständige, klar begrenzte Ausfallverteilung eingeführt. Inhalts-Crosscheck `15/15`, Animationsplanvalidierung aller vier Szenen jeweils `0` Fehler/`0` Warnungen, Strict-Design- und Layout-QA jeweils `0` Fehler. Verbleibende Hinweise betreffen ausschließlich das absichtlich nicht 16:9-formatige Plotasset.
- Zweite Graphenverfeinerung 2026-07-31, Szenen 10–12: künstlich gekappte Hauptkurven durch vollständig auslaufende Dichten ersetzt; Ausfallverteilung auf eine glatt begrenzte Kompaktstütze umgestellt; Ausfalllabel in freie Zonen verlegt und mit Führungslinien angebunden; `Ausgangslage` in Szenen 11 und 12 entfernt. Verifikation: Inhalts-Crosscheck `15/15`, Animationsplanvalidierung jeweils `0` Fehler/`0` Warnungen, Strict-Design- und Layout-QA jeweils `0` Fehler; die einzelne Warnung pro Szene betrifft nur das bewusst abweichende Seitenverhältnis des eingebetteten Plotassets.
- Formkorrektur 2026-07-31, Szenen 10–12: Die kompakt gestützte Ausfallkurve wurde wieder durch die quellnahe gaußförmige Glockenkurve mit weich auslaufenden Tails ersetzt. Die zuvor korrigierten Hauptkurven, ausgelagerten Labels, Führungslinien und Animationsgruppen bleiben erhalten. Verifikation: Inhalts-Crosscheck `15/15`, Animationsplanvalidierung jeweils `0` Fehler/`0` Warnungen und Strict-Design-/Layout-QA jeweils `0` Fehler; die bekannte Einzelwarnung betrifft nur das Plotseitenverhältnis.
- Textkorrektur Szene 11, 2026-07-31: Die sichtbare Erklärung `Belastbarkeit nach rechts` wurde auf Nutzerwunsch durch die fachlich zielorientierte Formulierung `Belastbarkeit erhöhen` ersetzt. Die Rechtsverschiebung bleibt als grafische Wirkung und interne Bewegungsbeschreibung erhalten. Reichweite: `local_fix`. Verifikation: Zielrender visuell geprüft; Inhalts-Crosscheck `15/15`; Animationsplan `0` Fehler/`0` Warnungen; Strict-Design-/Layout-QA `0` Fehler. Die bekannte Einzelwarnung betrifft nur das Plotseitenverhältnis.

## Feedbackrunde 2026-08-04

- Szenen 11 und 14: Stress-Strength-Überlappung verkleinert, Abstände vergrößert und die Reduktionsrichtung mit zwei eindeutigen Pfeilen geklärt.
- Szenen 16 bis 20: qualitative und quantitative Analyse sichtbar verzweigt, Lebenszyklusbezug grafisch statt als Textwiederholung umgesetzt, Phasenmarker vereinfacht sowie P-Diagramm, Blockdiagramm und FMEA-Raster bereinigt.
- Szene 22: Ziele vollständig auf Deutsch formuliert.
- Szenen 27 bis 31: durchgängige Funktionsleiste für `f(t)`, `F(t)`, `R(t)` und `λ(t)` eingeführt; Metatext in Szene 30 wegen Kollision entfernt.
- Szenen 28 und 34 bis 38: Plotlabels neu positioniert, Geschlechterseiten korrigiert, Prozentangaben entzerrt, Phasenlabels unter die Kennzahlen gesetzt und die qualitative Kernaussage in Szene 38 blau hervorgehoben.
- Verifikation: Laufzeit-/Manifest-QA für alle 77 vorhandenen Szenen `0` Fehler; strenge Layout-QA der 48 betroffenen vollständigen Szenen `0` Fehler/`0` Warnungen.
