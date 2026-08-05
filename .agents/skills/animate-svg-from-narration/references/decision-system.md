# Animations-Entscheidungssystem

## Drei Ebenen Getrennt Planen

### Semantische Gruppe

Die kleinste wahrgenommene fachliche Einheit, die nicht in Fragmente zerfallen
darf. Beispiel: Karte aus Flaeche, Icon, Titel und Text.

### Triggergruppe

Eine oder mehrere semantische Gruppen, die durch dieselbe Sprechertextphrase
gleichzeitig reagieren. Beispiel: zwei Vergleichskarten, die im selben Satz
gemeinsam eingefuehrt werden.

### Zustand

Das vollstaendige sichtbare Bild vor oder nach einer Triggergruppe. Die Qualitaet
einer Animation wird an diesen Zustaenden beurteilt, nicht nur an einzelnen
Effekten.

## Initialzustand

| Klasse | Bedeutung | Technische Folge |
|---|---|---|
| `visible_context` | Fuer Orientierung oder ersten Beat notwendig | Im SVG sichtbar; nicht als `animated` markieren |
| `hidden_until_trigger` | Wuerde eine spaetere Aussage vorwegnehmen | Als animiertes Target vorbereiten |
| `static_decorative` | Ruhiger Hintergrund ohne Lerninformation | Sichtbar, kein Target |
| `visible_then_changes` | Beginnt sichtbar und reagiert spaeter | Nur bei expliziter Runtime-Unterstuetzung |
| `excluded` | Nicht fachlich erforderlich oder Downstream-Masterelement | Nicht in den Content aufnehmen |

## Erstrelevanz-Gate

Jede inhaltstragende Gruppe erhaelt vor der Initialzustandsentscheidung einen
`firstRelevantBeatId`. Der Wert bezeichnet den ersten vollstaendigen
Sprechertext-Beat, fuer den die Gruppe fachlich erforderlich ist. Nur ruhige
Markenflaechen oder tatsaechlich vor der Narration benoetigte Orientierung duerfen
`pre_narration` verwenden.

Verbindliche Regeln:

- `visible_context` darf nur `pre_narration` oder den ersten Sprecherbeat als
  Erstrelevanz besitzen.
- Ein konkretes Foto ist inhaltstragend. Es darf nicht als Dekoration oder
  allgemeine Orientierung gelten, wenn sein Motiv erst spaeter eingefuehrt wird.
- Quellenzeile, Bildunterschrift und Falllabel erscheinen fruehestens mit ihrem
  Bezugsobjekt.
- Allgemeine Einleitungssaetze werden als Beats ohne Reveal dokumentiert.
- Ein leerer Content-Bereich ist erlaubt, wenn die Downstream-Masterebene bereits
  Orientierung gibt und jedes vorhandene Fachmotiv spaetere Aussagen vorwegnehmen
  wuerde.

Prueffrage: "Koennte ein Lernender aus diesem sichtbaren Element bereits erraten,
welches konkrete Beispiel spaeter kommt?" Wenn ja, ist es vor seiner Einfuehrung
verborgen.

### Gute Initialzustaende

- Prozess: dauerhafter Rahmen und Startpunkt sichtbar; spaetere Schritte verborgen.
- Diagramm: Achsen und Skalen sichtbar, wenn die erste Aussage Daten einordnet.
- Radialmodell: fachliches Bezugszentrum sichtbar; Einfluesse verborgen.
- Vorher/Nachher: Ausgangszustand sichtbar, falls die Runtime seine spaetere
  Transformation wirklich unterstuetzt.

### Schlechte Initialzustaende

- Vollstaendig leer, obwohl der erste Satz auf ein sichtbares Bezugsobjekt verweist.
- Alle Pfeile sichtbar, waehrend zugehoerige Boxen noch verborgen sind.
- Endergebnis sichtbar, bevor Herleitung oder Vergleich erklaert wurde.
- Nur Rahmen einer Karte sichtbar, waehrend Text und Icon spaeter einzeln folgen.
- Ein konkretes Produkt- oder Fallfoto ist sichtbar, waehrend der Sprecher noch
  allgemein ueber das Thema spricht.

## Abhaengigkeitsregeln

| Rolle | Muss vorher oder gleichzeitig sichtbar sein |
|---|---|
| Connector oder Pfeil | alle fachlichen Endpunkte |
| Pfeillabel | Pfeil und Bezugsobjekte |
| Annotation | annotiertes Objekt |
| Wertlabel | Datenpunkt, Balken oder Kurve |
| Fit-/Regressionslinie | zugrunde liegende Daten |
| Konfidenzgrenzen | Fit und erklaerte Unsicherheit |
| Ergebnis | notwendige Herleitung oder Beobachtung |
| Highlight | das bereits eingefuehrte Ziel |
| Hide | das zuvor sichtbare Ziel |
| Transform | der fachliche Ausgangszustand oder ein expliziter Eintrittszustand |

Abhaengigkeiten duerfen in derselben Triggergruppe erfuellt werden. Ein Connector
kann also gleichzeitig mit dem zweiten Endpunkt erscheinen, aber nicht davor.

## Gruppierungsheuristik

Die Frage lautet: "Was erkennt der Lernende als ein Ding?"

### Zusammenlassen

- eine dunkle Karte und ihr heller Text,
- ein Icon und sein Begriff,
- ein Pfeil mit Spitze und Beschriftung,
- ein Bullet mit Label und Erklaertext,
- eine Datenserie mit Markern und Legende,
- ein Messpunkt mit Fuehrungslinie und Wert.
- alle Saetze eines direkt gekennzeichneten Zitats innerhalb derselben visuellen
  Zitatflaeche. Eine spaeter gesprochene Pointe darf ein eigenes Target sein,
  bleibt aber raeumlich und typografisch Teil der Zitatgruppe; die Interpretation
  folgt als getrennte Ergebnisgruppe.

### Trennen

Nur wenn mindestens eine Bedingung zutrifft:

- Der Sprechertext fuehrt die Teile in unterschiedlichen fachlichen Beats ein.
- Ein Teil bleibt dauerhaft sichtbar, waehrend ein anderer spaeter verschwindet.
- Ein Teil wird spaeter separat hervorgehoben.
- Die Teile besitzen unterschiedliche Abhaengigkeiten.

Keine Gruppe allein wegen DOM-Nachbarschaft, Farbe, Formtyp oder Exportstruktur
bilden.

## Effektmatrix

| Lernabsicht | Aktion | Gute Anwendung | Nicht verwenden fuer |
|---|---|---|---|
| Neue Information | `show` | Karte, Begriff, Ergebnisblock | dekorative Abwechslung |
| Entstehender Verlauf | `draw` | Kurve, Prozesspfad, gerichtete Beziehung | Text, Flaechen, fertige Diagramme |
| Fokus | `highlight` | bereits sichtbarer Schluesselwert | erste Einfuehrung eines Targets |
| Echte Zustandsaenderung | `transform` | messbare Verschiebung oder Skalierung | Eintrittsanimation ohne Fachbedeutung |
| Ersetzter Zustand | `hide` | Vorher-Zustand weicht belegtem Nachher-Zustand | Platz schaffen ohne inhaltlichen Grund |
| Sekundaeren Kontext beruhigen | `soft_focus`/Blur | nur mit Runtime-Unterstuetzung | Ersatz fuer Gruppierung oder Hide |

## Effektparameter Fuer Ruhige Lernanimation

Die Zielruntime ist massgeblich. Fuer 30 fps gelten als Ausgangswerte:

- `show`: 14 bis 18 Frames, reine Deckkraft.
- `hide`: 12 bis 16 Frames, reine Deckkraft.
- `draw`: 30 bis 48 Frames; Richtung folgt der Geometrie und Leserichtung.
- `highlight`: 24 bis 36 Frames; einmalig, nicht dauerhaft pulsierend.
- `transform`: 24 bis 45 Frames; Weg und Skalierung fachlich begruenden.

Keine zufaellige Varianz zwischen aehnlichen Szenen. Gleiche Funktion verwendet
innerhalb eines Moduls dieselbe Effektfamilie.

## Laufzeitprofil Der Aktuellen Basis-RE-Umgebung

Der Manifestvertrag akzeptiert:

```text
show: enterFrames, fromY
hide: exitFrames, toY
highlight: durFrames, fill, stroke, strokeWidth
draw: durFrames, drawStyle, direction
transform: durFrames, fromTranslateX, fromTranslateY, fromScale,
           translateX, translateY, scale, transformOrigin
```

Der interne Reviewer bildet derzeit nicht alle akzeptierten Parameter sichtbar ab:

- `fromY` und `toY` werden akzeptiert, aber nicht als Bewegung gerendert.
- `fill` bei `highlight` wird nicht als Fuellfarbwechsel gerendert.
- `drawStyle` wird nicht differenziert; die Vorschau nutzt eine gerichtete
  Clip-Enthuellung.
- Alle `animated` Targets sind bei Frame 0 verborgen.

Deshalb fuer produktionssichere Plaene die gemeinsam sichtbare Teilmenge nutzen
oder eine Runtime-Erweiterung vor der Umsetzung einplanen.

## Verschwimmen Als Spaetere Erweiterung

Ein belastbarer Blur-Effekt benoetigt mindestens:

- eine explizite Manifestaktion oder einen Fokuszustand,
- Staerke und Dauer,
- definierte Rueckkehr in den scharfen Zustand,
- klares Verhalten fuer Text und Vektorgeometrie,
- SVG-/Browser-/Video-Paritaet,
- State-QA fuer den unscharfen und wieder scharfen Zustand.

Bis dahin Blur nur unter `unsupportedEffectRequests` dokumentieren.
