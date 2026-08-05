# RE1 Kapitel 3, Lektion 1 - Redesign-Challenge V3

## Scope

- Zielszene 27: Quelle 28
- Zielszene 28: Quellen 29 und 30
- Zielszene 29: Quelle 31
- Zielszene 30: Quelle 32
- Zielszene 31: Quelle 33
- Sprechertext: `analysis/rebuild-plans/RE1_scene-plan.json`

## Lektionsweite Entscheidung

Die vierteilige Funktionsleiste wird in dieser Lektion nicht als breite, statische Navigation wiederholt. Alle fuenf Szenen behandeln die Dichtefunktion; die unveraenderte Leiste bindet deshalb Flaeche, ohne einen neuen Zustand zu erklaeren. Sie wird durch eine kleine lokale Kennzeichnung `1 - f(t) - Dichtefunktion` ersetzt.

Diagramme tragen die Erklaerung primaer selbst. Pro Szene ist hoechstens eine gebuendelte Erklaerzone zulaessig. Wiederholungen zwischen Plot, Kopfbereich und Ergebnisband werden entfernt.

## Szene 27

- Der Quellblock `Aufgabe der Zuverlaessigkeitstechnik` ist `must_preserve` und wird wieder vollstaendig sichtbar aufgenommen.
- Messpunkte eines Lastniveaus liegen exakt horizontal. Es wird kein kuenstliches Spannungs-Jitter verwendet.
- Der Plot bleibt dominant; links steht eine einzige Aufgabenkarte mit dem Quellgedanken und dem markierten Lastniveau 640 N/mm2.
- Animation: Versuchsdaten und Woehlerkurve, markiertes Lastniveau, danach Aufgabenblock.

## Szene 28

- Die beiden Quellen werden in einem einzigen Python-Plotasset mit genau einem gemeinsamen Koordinatensystem gefuehrt.
- Eigene Plotpanels und externe Erklaerboxen entfallen. Histogramm, Klassenhinweis, Dichtefunktion und Ausfallbereich werden im selben Graphen aufgebaut.
- Achsen, Ticklabels und Grid bleiben als Orientierung sichtbar; alle erklaerenden Inhalte erscheinen passend zum Sprechertext als semantische Animationsgruppen.
- Animation: Histogramm, Klassen und Klassenbreite, Dichtekurve der Grundgesamtheit, danach die Ablesung bei etwa 23.000 und 45.000 Lastwechseln.

## Szene 29

- Der 3D-Plot orientiert sich an der Dreiviertelansicht der Quelle und verwendet eine zusammenhaengende Wireframe-Dichteflaeche mit logarithmischer Ausfalldichte. Die Hoehe der Dichtemaxima nimmt mit sinkender Spannung ab und darf nicht je Spannungsschnitt auf eine konstante Hoehe normiert werden. Die Woehlerlinie verbindet die charakteristischen Lebensdauern als Projektion auf der Basisebene; sie darf nicht perspektivisch verkuerzt oder verdeckt werden.
- `Woehlerlinie` wird direkt im Plot beschriftet.
- Zusaetzliche Erklaerbaender entfallen.
- Animation: Wireframe-Dichteflaeche, danach Woehlerlinie, Fuehrungslinie und Beschriftung als eine gemeinsame Animationsgruppe auf der Basisebene.

## Szene 30

- Die rote Flaeche unter der IST-Kurve entfaellt, weil sie keine definierte Flaechenbedeutung besitzt.
- Ein dominanter Plot steht neben genau einem, an der Quelle orientierten Diagnosepanel.
- Das Panel buendelt Prueffrage, Beobachtung und Ziel; keine verteilten Kopf- und Ergebnisboxen.
- Garantie- und Imagefolgen bleiben im Sprechertext, werden aber nicht als zusaetzliche visuelle Ebene wiederholt.
- Animation: IST-Kurve, Prueffrage, Diagnose, ZIEL-Kurve und Zieltext.

## Szene 31

- Der Endzustand wird auf zwei Kurven und zwei Peakwerte reduziert.
- Anstiegslinien bei 40/50 Jahren und der zusaetzliche Transferstreifen entfallen; diese Aussagen werden durch Sprechertext und Kurvenverlauf getragen.
- Peaklabels werden raeumlich getrennt und nach dem Rendern auf Ueberlagerung geprueft.
- Animation: Maennerkurve, Frauenkurve, Peak 78, Peak 87.

## QA-Schwerpunkte

- Szene 27: horizontale Lastniveaus und vollstaendiger Aufgabenblock.
- Szene 28: genau ein Graph; keine externen Erklaerboxen; vollstaendige und sprechertextgefuehrte Aufbauanimation.
- Szene 29: Perspektive, abnehmende Dichtemaxima bei sinkender Spannung sowie gemeinsame Einblendung von Woehlerlinie und Beschriftung.
- Szene 30: keine semantisch unbegruendete Flaechenfuellung; nur eine Erklaerzone.
- Szene 31: keine Label-Kurven- oder Label-Label-Ueberlagerung.
- Alle Szenen: Crosscheck gegen zugeordnete Quelle und Sprechertext sowie Re-QA nach jeder Korrektur.

## Korrekturrunde 17.07.2026

Die Viewer-Notizen fuer Szenen 27 bis 34 wurden als verbindliche Revisionsanforderungen umgesetzt:

- Szene 27: Dramaturgie auf Woehlerkurve, Versuchsdaten, vollstaendiges Lastniveau 640 und Aufgabenblock korrigiert.
- Szene 28: auf einen einzigen Graphen umgestellt. Histogramm, Klassenhinweis, Dichtefunktion und Ausfallbereich werden nacheinander im gemeinsamen Koordinatensystem animiert; der fruehere Panel-Uebergangspfeil entfaellt.
- Szene 29: 3D-Plot innerhalb der sicheren Inhaltszone vergroessert; Dichtehoehen, Woehlerlinie, Fuehrung und Beschriftung bleiben fachlich gekoppelt.
- Szene 30: das reale Getriebebild durch eine generierte technische Illustration ersetzt. Der schwere NKW-Getriebeaufbau und sechs Vorwaertsgangstufen sind sichtbar; Bild und reale Dichte erscheinen gemeinsam.
- Szene 31: relative Peakhoehe der Maennerkurve mit 0,76 gegenueber der Frauenkurve erhalten; Marker, Fuehrung und Peaklabel jeweils atomar gruppiert.
- Szene 32: kumulierte Balken mit lokaler Rechnung klassenweise von links nach rechts aufgebaut; verstreute Rechenleiste entfernt; Definition auf einen kompakten Abschlussstreifen reduziert.
- Szene 33: 0-Prozent- und 100-Prozent-Endpunkte aus dem statischen Plot geloest und erst nach der Kurve an ihren Sprechertextstellen eingeblendet.
- Szene 34: dieselbe generierte Illustration des 6-Gang-NKW-Getriebes wie in Szene 30 wiederverwendet und mit der Ausfallwahrscheinlichkeitskurve gekoppelt.
- Szene 39: auch in der spaeteren Ausfallratenansicht wird dieselbe generierte Illustration verwendet, damit das NKW-Beispiel visuell konsistent bleibt.

Jede korrigierte Szene wurde einzeln gerendert, visuell geprueft und mit `--layout --layout-strict --layout-times 0,1,end --no-design` ohne Fehler und Warnungen validiert.
