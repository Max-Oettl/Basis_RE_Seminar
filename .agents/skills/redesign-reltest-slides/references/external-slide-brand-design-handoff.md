# Veralteter RelTest-Academy-Handoff

> Dieser Handoff beschreibt den Markenstand vor dem Education-Rebranding und ist
> keine aktive Designquelle mehr. Neue Arbeiten verwenden
> `references/reltest-education-brand-handoff.md`,
> `brand/reltest-education-style-guide.md` und
> `brand/reltest-education-slide-design-tokens.json`.

# RelTest Academy – Brand- und Foliendesign-Handoff

Status: v1, abgestimmt auf den aktiven Renderer-Stand vom 16.07.2026

## Zweck

Dieses Dokument kann unverändert an ein anderes Repository oder an einen dort arbeitenden Agenten übergeben werden. Es beschreibt, wie neue RelTest-Academy-Folien gestaltet werden müssen, damit sie visuell mit den Folien dieses Video-Repositories übereinstimmen.

Es ist als eigenständiger Designvertrag gedacht und enthält:

- Markencharakter
- verbindliche Produktionsfarben
- kompatible SVG-Asset-Farben
- Format, Raster und Safe Areas
- Hintergrund, Header und Footer
- Logo-Verwendung
- Typografie und Textdichte
- Karten, Badges und Oberflächen
- Diagramm-, Icon-, Pfeil- und Medienstil
- Animationsprinzipien
- wiederverwendbare Folienarchetypen
- kopierbare Design-Tokens und CSS-Referenz
- Qualitätskontrolle und Definition of Done

## Geltungsbereich

Dieser Vertrag gilt für:

- E-Learning-Videofolien im Format 16:9
- Remotion-, HTML-, Canvas-, SVG- oder vergleichbare Frame-basierte Renderer
- statische Folienbilder
- Folienvorschauen
- Folieninterne Diagramme und Medien
- wiederverwendbare Template-Komponenten

Er beschreibt den visuellen Zielzustand. Er schreibt dem Ziel-Repository kein bestimmtes Framework vor.

## Verbindlichkeit der Begriffe

- **MUSS** oder **DARF NICHT** bezeichnet eine verbindliche Design- oder Produktionsanforderung.
- **SOLLTE** bezeichnet eine starke Empfehlung für visuelle Konsistenz und Robustheit.
- **KANN** bezeichnet eine optionale Erweiterung.

## Quellenhierarchie und Auflösung bestehender Farbvarianten

Im bestehenden Projekt gibt es zwei eng verwandte Farbpaletten:

1. Die aktive Produktionspalette der gerenderten Folientemplates.
2. Eine ältere beziehungsweise assetspezifische Navy/Cyan-Palette für SVG-Diagramme.

Für neue vollständige Folien ist die aktive Produktionspalette in diesem Dokument verbindlich. Die SVG-Palette ist kompatibel und darf für bestehende oder eigenständige Diagrammassets weiterverwendet werden, darf aber nicht innerhalb derselben neuen Grafik wahllos mit der Produktionspalette vermischt werden.

Priorität für neue Arbeiten:

```text
vollständige Folie
  -> aktive Produktionspalette

eingebettetes bestehendes SVG-Asset
  -> bestehende Asset-Palette beibehalten oder bewusst vollständig migrieren

neues SVG-Asset für eine neue Folie
  -> möglichst aktive Produktionsfarben verwenden
```

## Markencharakter

RelTest Academy wirkt:

- technisch
- präzise
- seriös
- akademisch
- modern
- ruhig
- vertrauenswürdig
- didaktisch fokussiert
- hochwertig, aber nicht dekorativ luxuriös

Die Folien sollen an professionelle Weiterbildung für Ingenieurinnen, Ingenieure und technische Fachrollen erinnern.

Sie sollen nicht wirken wie:

- generische Stock-Business-Präsentationen
- verspielte Comic- oder Gamification-Oberflächen
- überladene PowerPoint-Folien
- Marketing-Landingpages
- Neon-Dashboards
- schnell zusammengesetzte Platzhaltergrafiken
- eine Sammlung unverbundener Einzelstile

## Grundprinzipien

### Eine Aussage pro Folie

Jede Folie besitzt eine dominante Lernbotschaft. Zusätzliche Bereiche dürfen diese Aussage strukturieren, aber nicht mit ihr um Aufmerksamkeit konkurrieren.

### Sprechertext erklärt, Folie strukturiert

Der Sprechertext trägt die ausführliche Erklärung. Die Folie zeigt:

- Begriffe
- Struktur
- Beziehungen
- Unterschiede
- Reihenfolgen
- Kennzahlen
- eine zentrale Schlussfolgerung

Lange Absätze und vollständige Sprechertextpassagen gehören nicht auf die Folie.

### Reduktion vor Verkleinerung

Wenn Text oder Elemente nicht passen:

1. Text kürzen.
2. Redundante Elemente entfernen.
3. Struktur vereinfachen.
4. Spalten oder Reihen neu ordnen.
5. Erst danach innerhalb der erlaubten Typostufen verkleinern.

Schrift darf nicht beliebig klein gesetzt werden, um ein überfülltes Layout zu retten.

### Jede Form braucht eine Funktion

Eine Form, Kontur, Linie, Farbe, Fläche oder ein Schatten bleibt nur bestehen, wenn sie mindestens eine dieser Funktionen erfüllt:

- Bedeutung codieren
- Gruppierung zeigen
- Orientierung geben
- Hierarchie erzeugen
- Animation ermöglichen

Dekoration ohne Informationsgewinn wird entfernt.

## Produktionsformat

### Referenzauflösung

```text
Breite:  1920 px
Höhe:    1080 px
Format:  16:9
```

Alle Maße in diesem Dokument beziehen sich auf 1920×1080.

Für andere Auflösungen wird proportional skaliert:

```text
scale = targetWidth / 1920
scaledValue = referenceValue * scale
```

Bei einem 1280×720-Render beträgt der Skalierungsfaktor beispielsweise `0.6667`.

### Verbindliche Safe Areas

| Bereich | Referenzwert |
| --- | ---: |
| äußerer Studio-Sicherheitsrand X | 78 px |
| äußerer Studio-Sicherheitsrand Y | 48 px |
| Inhaltsrand links/rechts | 74 px |
| Inhaltsrand oben | 56 px |
| reservierter Inhaltsrand unten | 118 px |
| Footer-Unterkante | 24 px vom unteren Rand |

Der normale Inhaltsbereich reicht damit ungefähr von:

```text
x = 74 bis 1846
y = 56 bis 962
```

Der Footer nutzt den unteren reservierten Bereich. Wichtige Inhalte dürfen nicht hinter Logo oder Footertext reichen.

Für Full-Frame-SVGs mit eigenem 1920×1080-Canvas SOLLTE der fachlich wichtige Inhalt konservativer innerhalb folgender Zone liegen:

```text
x = 96 bis 1824
y = 170 bis 930
```

Dadurch bleiben Template-Headline und Footer sicher frei.

## Anatomie einer Standardfolie

```text
┌──────────────────────────────────────────────────────────────┐
│  cyanfarbene Akzentlinie                                     │
│                                                              │
│  Folientitel                                                 │
│  ───────────────── dezente Trennlinie ────────────────────   │
│                                                              │
│  Inhalt / Karten / Diagramm / Medien                         │
│                                                              │
│                                                              │
│  Professional Reliability Training ...       Academy-Logo    │
└──────────────────────────────────────────────────────────────┘
```

### Oberer Akzent

Auf Standardfolien befindet sich eine kurze horizontale Akzentlinie:

```text
x:      74 px
y:      36 px
Breite: 118 px
Höhe:   5 px
Radius: 4 px
Farbe:  #007EA7
```

Diese Linie ist ein wiederkehrendes Markensignal. Sie ist kein Fortschrittsbalken.

### Titelzone

- Titel linksbündig
- Schriftgröße standardmäßig 54 px
- Gewicht 800 beziehungsweise sehr kräftig
- Zeilenhöhe ungefähr 1.05
- Farbe `#102A43`
- maximale Breite ungefähr 1460 px
- nach Möglichkeit einzeilig, höchstens zwei kontrollierte Zeilen
- keine zusätzliche farbige Titelkarte

Unterhalb der Titelzone verläuft bei ungefähr `y=148 px` eine dezente horizontale Trennlinie über den Inhaltsbereich.

### Inhaltszone

- beginnt nach einer bewussten Titel-Inhalts-Lücke
- Standardabstand Titel zu Inhalt: 44 px
- maximale normale Inhaltsbreite: 1520 px
- größere Medien dürfen den verfügbaren Frame breiter nutzen, solange Safe Areas frei bleiben
- Layouts basieren bevorzugt auf Grid oder Flex, nicht auf zufälligen Einzelpositionen

### Footer

Der Footer ist Bestandteil des Folientemplates und darf nicht in Medienassets dupliziert werden.

Linke Seite:

```text
Professional Reliability Training | Reliability Engineer
```

Aktuelle Darstellung:

- X-Position am Inhaltsrand: 74 px
- Schriftgröße: 20 px
- Farbe: `#627D98`
- keine Versalienpflicht
- ruhige, unaufdringliche Gewichtung

Rechte Seite:

- offizielles RelTest-Academy-Logo
- Höhe: 80 px
- Breite proportional
- rechter Rand am Inhaltsrand
- Unterkante ungefähr 24 px über Frame-Unterkante

Das Ziel-Repository MUSS die offiziellen Logo-Dateien separat erhalten. Empfohlene Assets:

```text
reltest-academy.svg
reltest-academy-long.svg     # optional für andere Brand-Flächen
```

Das Logo darf nicht aus dem Screenshot nachgebaut, nachgezeichnet oder durch Text ersetzt werden.

## Folienhintergrund

Der Standardhintergrund ist ein sehr heller, technisch wirkender Verlauf:

```css
background:
  linear-gradient(
    135deg,
    #f9fbfc 0%,
    #f1f5f8 56%,
    #e9f0f4 100%
  );
```

Darüber liegt ein äußerst dezentes technisches Raster:

```css
background-image:
  repeating-linear-gradient(
    90deg,
    rgba(16, 42, 67, 0.035) 0,
    rgba(16, 42, 67, 0.035) 1px,
    transparent 1px,
    transparent 80px
  ),
  repeating-linear-gradient(
    0deg,
    rgba(16, 42, 67, 0.03) 0,
    rgba(16, 42, 67, 0.03) 1px,
    transparent 1px,
    transparent 80px
  );
opacity: 0.34;
```

Das Raster muss im Normalbild beinahe unauffällig sein. Es darf keine Tabellen- oder Millimeterpapierwirkung erzeugen.

Nicht verwenden:

- dunkle Vollflächen als Standardhintergrund
- kräftige Farbverläufe
- großflächige cyanfarbene Glows
- Fotohintergründe ohne fachlichen Grund
- dekorative Wellen, Punktewolken oder Partikel

## Aktive Produktionspalette

Diese Farbwerte bilden den aktuellen Stil der vollständigen Folientemplates.

### Primäre Rollen

| Rolle | Wert | Verwendung |
| --- | --- | --- |
| `accent` | `#007EA7` | Hauptakzent, Informationsfluss, aktive Elemente, kleine Marker |
| `deep` | `#102A43` | Haupttitel, starke Konturen, technische Primärfarbe |
| `deepSoft` | `#243B53` | sekundäre dunkle Flächen und Linien |
| `deepAlt` | `#334E68` | alternative dunkle Abstufung |
| `text` | `#1F2933` | normaler Haupttext |
| `textMuted` | `#52606D` | erklärender Sekundärtext |
| `textSoft` | `#627D98` | Footer und zurückhaltende Metadaten |

### Semantische Akzente

| Rolle | Wert | Verwendung |
| --- | --- | --- |
| `secondary` | `#B7791F` | warmer Kontrast, Titelakzent, zentrale Schlussfolgerung |
| `success` | `#2F6F55` | Lernziele, bestätigte oder positive Zustände |
| Fehler/Abgrenzung | `#D1495B` oder projektnahes Rot | Fehler, Ausfall, klare Abgrenzung; sparsam |

Rot, Grün und Amber sind semantische Farben. Sie dürfen nicht nur zur Dekoration rotieren.

### Oberflächen

| Rolle | Wert |
| --- | --- |
| `surface` | `#FFFFFF` |
| `surfaceSoft` | `#F7FAFC` |
| `surfaceAlt` | `#E6EEF5` |
| `surfaceElevated` | `#FBFDFF` |
| `panel` | `rgba(255,255,255,0.86)` |
| `panelStrong` | `rgba(255,255,255,0.96)` |
| `border` | `rgba(16,42,67,0.14)` |
| `borderStrong` | `rgba(16,42,67,0.22)` |

### Weiche Akzentflächen

| Rolle | Wert |
| --- | --- |
| `accentSoft` | `rgba(0,126,167,0.12)` |
| `accentGlow` | `rgba(0,126,167,0.20)` |
| `secondarySoft` | `rgba(183,121,31,0.13)` |
| `successSoft` | `rgba(47,111,85,0.12)` |

### Diagrammserie

Bevorzugte Reihenfolge:

```json
[
  "#007EA7",
  "#B7791F",
  "#2F6F55",
  "#102A43",
  "#7B8794"
]
```

Eine einzelne Folie SOLLTE möglichst mit Hauptakzent plus höchstens einer zusätzlichen semantischen Farbe auskommen.

## Kompatible SVG-Asset-Palette

Bestehende RelTest-Academy-SVGs können folgende Palette verwenden:

| Rolle | Wert |
| --- | --- |
| Primary Navy | `#062D46` |
| Deep Navy | `#021D31` |
| Academy Blue | `#139CCB` |
| Light Blue | `#E7F6FB` |
| Soft Gray | `#EEF3F6` |
| Medium Gray | `#6A7A86` |
| Signal Green | `#2AA876` |
| Warning Amber | `#F2A93B` |
| Failure Red | `#D1495B` |

Regel für neue Assets:

- entweder vollständig die aktive Produktionspalette verwenden,
- oder innerhalb eines bewusst bestehenden Asset-Systems vollständig die kompatible SVG-Palette verwenden.

Nicht `#007EA7` und `#139CCB` zufällig für gleichrangige Elemente mischen.

## Logo-Farben

Das aktuelle Logo enthält unter anderem:

```text
#0D96CA
#0F4B6C
#032741
```

Das Logo wird in seinen Originalfarben verwendet. Keine automatische Umfärbung, kein Glow, keine Schattenplatte und keine zusätzliche Kartenfläche hinter dem Logo.

## Typografie

### Font-Stack der Folientemplates

```css
font-family: "Sora", "Avenir Next", "Segoe UI", sans-serif;
```

Wichtiger Reproduktionshinweis: Das aktuelle Quellprojekt deklariert `Sora`, lädt aber keine projektlokale Sora-Fontdatei. Die tatsächlich gerenderte Schrift hängt daher von der Umgebung ab.

Das Ziel-Repository MUSS eine bewusste Entscheidung treffen:

1. Sora mit geklärter Lizenz projektlokal bündeln und deterministisch laden, oder
2. `Segoe UI` beziehungsweise einen getesteten Ersatz als verbindlichen Produktionsfont festlegen.

Eine stillschweigend unterschiedliche Systemschrift ist für pixelgenaue Reproduktion nicht ausreichend.

### Font-Stack für eigenständige SVG-Assets

```css
font-family: Inter, "Segoe UI", Arial, sans-serif;
```

Auch hier gilt: Für deterministische Darstellung muss die gewählte Schrift verfügbar oder Text bewusst in Pfade umgewandelt sein. Text in Pfade nur verwenden, wenn Barrierefreiheit, Übersetzbarkeit und nachträgliche Bearbeitung nicht benötigt werden.

### Typografische Skala bei 1920×1080

| Token | Größe | Gewicht | Zeilenhöhe | Verwendung |
| --- | ---: | ---: | ---: | --- |
| `display` | 82 px | 800 | 1.04 | zentrale Titelfolie |
| `h1` | 64 px | 800 | 1.05 | sehr starke Inhaltsüberschrift |
| `h2` | 54 px | 760–800 | 1.05–1.08 | normaler Folientitel |
| `h3` | 44 px | 700–760 | ca. 1.08 | Bereichs- oder Kartentitel |
| `bodyLg` | 36 px | ca. 640 | 1.25 | starke Kernaussage |
| `body` | 30 px | ca. 560 | 1.28 | normaler sichtbarer Inhalt |
| `bodySm` | 26 px | ca. 540 | 1.30 | kompakter Nebeninhalt |
| `caption` | 22 px | variabel | ca. 1.28 | Beschriftungen und Details |
| `label` | 16 px | 700 | kompakt | Metadaten, Eyebrow, Tabellenspalten |
| Footer | 20 px | ca. 700 | kompakt | Trainingsbezeichnung |

### Typoregeln

- Kein künstliches Letter-Spacing für normale Titel und Texte.
- Versalien nur für sehr kurze Labels, Eyebrows oder Metadaten.
- Fließtext linksbündig; keine Blocksatzspalten.
- Titel dürfen automatisch zwischen definierten Stufen schrumpfen, aber nicht unter eine vorher definierte Mindestgröße fallen.
- Primäre Lerninhalte SOLLTEN bei 1920×1080 nicht kleiner als 22 px gesetzt werden.
- `16 px` ist ausschließlich für kurze Labels und Metadaten vorgesehen.
- Deutsche Texte verwenden echte Umlaute und `ß`.
- Keine fehlerhafte Zeichenkodierung oder ausgeschriebenen Ersatzformen wie `ae`, wenn `ä` gemeint ist.
- Zahlen, Einheiten und Formeln müssen typografisch eindeutig getrennt sein.

## Abstände und Raster

### Basistokens

| Token | Wert |
| --- | ---: |
| `stackGap` | 16 px |
| `blockGap` | 22 px |
| `titleContentGap` | 44 px |
| normaler Karteninnenabstand | 20–30 px |
| große Kernaussagenkarte | 38–46 px |
| Spaltenabstand Standard | 20–28 px |
| großer Medien-/Textabstand | 42 px |
| Kartenradius | 8 px |

Abstände sollen in wiederkehrenden Stufen verwendet werden. Einzelwerte sind nur erlaubt, wenn ein konkreter geometrischer Grund besteht.

## Oberflächen und Karten

### Standardkarte

```css
border-radius: 8px;
border: 1px solid rgba(16, 42, 67, 0.22);
background: rgba(255, 255, 255, 0.94);
box-shadow: 0 14px 28px rgba(16, 42, 67, 0.09);
```

### Starke Karte

```css
border-radius: 8px;
border: 1px solid rgba(16, 42, 67, 0.22);
background: rgba(255, 255, 255, 0.97);
box-shadow: 0 24px 54px rgba(16, 42, 67, 0.12);
```

### Weiche Karte

```css
border-radius: 8px;
border: 1px solid rgba(16, 42, 67, 0.14);
background: rgba(255, 255, 255, 0.90);
box-shadow: 0 6px 14px rgba(16, 42, 67, 0.07);
```

Regeln:

- Karten strukturieren fachliche Einheiten, nicht jeden einzelnen Satz.
- Nicht jede Karte benötigt einen Schatten.
- Keine mehrfach verschachtelten Karten ohne neue semantische Ebene.
- Keine großen runden SaaS-Karten mit 24–32 px Radius als Standard.
- Keine Glas-/Blur-Effekte, wenn sie nicht technisch erforderlich sind.
- Farbige Seiten- oder Oberkanten sind schmal und semantisch.

## Nummern-Badges und kleine Marker

Standardnummer:

```text
Breite/Höhe: 58 px
Radius:       8 px
Schrift:      22 px, 800
Text:         weiß
Format:       01, 02, 03 ...
```

Die Badges verwenden abhängig von der Bedeutung:

- `#007EA7` für normale Schritte
- `#B7791F` für sekundäre Kontraste
- `#2F6F55` für Lernziele oder positive Zustände

Nummern dienen der Reihenfolge. Sie dürfen nicht nur als Schmuck vor beliebigen Karten stehen.

## Wiederverwendbare Folienarchetypen

### 1. Titelfolie

Aufbau:

- Standardframe mit Footer
- Inhalt vertikal und horizontal zentriert
- kurze warme Akzentlinie oberhalb des Titels
- großer Display-Titel
- optionale Unterzeile mit cyanfarbener linker Linie

Referenzwerte:

```text
Akzentlinie: 128 × 6 px, Farbe #B7791F
Display-Titel: maximal 82 px, Mindestgröße ungefähr 54 px
Titelbreite: maximal 1420 px
Untertitel: 30 px, maximal 1060 px
Untertitel-Akzent: 6 px links in #007EA7
```

Nicht verwenden:

- vollflächige Titelkarte
- Logo in der Mitte zusätzlich zum Footerlogo
- mehrere Untertitelblöcke
- dekorative Hero-Illustration ohne Lernbezug

### 2. Agenda oder Inhaltsübersicht

Empfohlener Aufbau:

- bis drei Punkte: eine Spalte
- ab vier Punkten: zwei Spalten
- nummerierte Karten
- schmale farbige linke Kante
- pro Karte ein kurzer, scanbarer Titel

Referenzwerte:

```text
Grid-Gap:          18 px
Kartenpadding:     24 × 26 px
linke Farbkante:   7 px
Nummernspalte:     58 px
Textgröße:         26–30 px
```

Farben dürfen in der Sequenz Accent, Secondary und Success wechseln, wenn die Karten gleichrangig bleiben. Bei semantisch unterschiedlichen Zuständen hat die Semantik Vorrang vor Rotation.

### 3. Lernziele

Empfohlener Aufbau:

- eine klare vertikale Liste
- grüne semantische Akzentkante
- Nummernbadge
- kleines Label `Lernziel N`
- eine aktive Aussage pro Lernziel

Text beginnt bevorzugt mit einem beobachtbaren Verb. Ziel sind normalerweise drei bis fünf Lernziele.

### 4. Bullet- oder Kernaussagenfolie

Varianten:

- `cards`: nummerierte Karten mit schmaler Akzentkante
- `plain`: ruhige Liste mit kleinen cyanfarbenen quadratischen Markern und Trennlinien

Regeln:

- pro Punkt eine Aussage
- vier oder mehr Karten können auf zwei Spalten verteilt werden
- bei langen Inhalten lieber weniger Punkte als kleinere Schrift
- Nummerierung nur, wenn Reihenfolge oder Referenzierung sinnvoll ist

### 5. Definition

Aufbau:

- große starke Hauptkarte für Begriff und Definition
- Begriff deutlich größer als Definition
- optional darunter ein bis drei Detailkarten
- Detailrollen beispielsweise `Warum wichtig`, `Beispiel`, `Abgrenzung`
- Detailkarten unterscheiden sich durch eine schmale Oberkante, nicht durch vollständig bunte Flächen

Die Definition soll nicht von fünf gleichgewichtigen Zusatzboxen umgeben werden.

### 6. Key Takeaway

Aufbau:

- eine zentrierte starke Karte
- eine einzige Kernaussage
- breite Innenabstände
- linke warme Akzentkante in `#B7791F`
- Text in Deep Navy

Referenzwerte:

```text
maximale Breite: 1480 px
Padding:         ca. 38 px 46 px 42 px
Akzentkante:     12 px
Text:            30–54 px, abhängig von Länge
```

Keine zweite konkurrierende Merksatzbox auf derselben Folie.

### 7. Workflow oder Prozess

Aufbau:

- Schritte in klarer Reihenfolge
- vertikale oder horizontale Verbindung nur, wenn sie den Prozess tatsächlich erklärt
- jeder Schritt besitzt eigenes Animationsziel
- nummerierte Badge- oder Knotenform
- Titel und maximal kurze Zusammenfassung
- Detailvarianten nur, wenn Input, Output oder Hinweis wirklich benötigt werden

Pfeile und Verbinder liegen hinter den Karten. Alle Verbinder desselben Prozesses verwenden identische Geometrie und Farbe.

### 8. Medienfolie mit Seiteninhalt

Empfohlener Aufbau:

```text
Textspalte:  minmax(360px, 0.72fr)
Medienspalte: minmax(0, 1.12fr)
Spaltengap: 42 px
```

Die Medienseite kann links oder rechts stehen. Die Textspalte besitzt eine cyanfarbene vertikale Linie von 5 px.

Textspalte:

- optionaler kurzer Introtext
- kurze Eyebrow-Überschriften
- maximal ungefähr fünf Bulletpoints
- Bulletpunkte mit kleinen cyanfarbenen Punkten
- keine zweite Kartenfläche um die gesamte Textspalte

Medien:

- `contain` als Standard
- Seitenverhältnis bewahren
- keine unnötige äußere Karte um transparente SVGs
- Bild oder SVG soll die größere visuelle Fläche erhalten

### 9. SVG-Diagrammfolie

Aufbau:

- Template liefert Hintergrund, Titel und Footer
- SVG wird groß, rahmenlos und ohne zusätzliche Kartenhülle eingesetzt
- wichtige Inhalte bleiben in Safe Areas
- SVG selbst enthält normalerweise keinen doppelten Folientitel, Footer oder Logo

Für SVG-Struktur und Animation gilt zusätzlich der separate SVG-Übergabevertrag.

### 10. Vergleich und Do/Don’t

- zwei gleichgewichtige Spalten
- identische Innenabstände und Geometrie
- semantische Farbe sparsam an Kante, Icon oder Label
- nicht eine komplette Spalte grün und die andere komplett rot füllen
- Unterschiede müssen über Inhalt und Struktur verständlich sein, nicht nur über Farbe
- pro Seite vergleichbare Textmengen

### 11. Formeln und Rechenwege

- Formel erhält mehr Weißraum als normaler Text
- Variablen, Indizes und Exponenten typografisch korrekt setzen
- Eingaben, Rechenschritte und Ergebnis klar trennen
- Ergebnis darf eine leicht akzentuierte Fläche erhalten
- keine fragile, ungeprüfte Unicode-Formel als Ersatz für sauberen Formelsatz
- bei Überfüllung Formel in nachvollziehbare Schritte aufteilen

### 12. Daten- und Diagrammfolie

- Achsen in Deep Navy oder Grau
- Hauptkurve in Accent Blue
- sekundäre Reihe in Amber oder Grün
- Fehler/Ausfall sparsam in Rot
- Rasterlinien sehr dezent
- keine 3D-Diagramme
- keine dekorativen Chart-Container innerhalb weiterer Kartencontainer
- Legenden nur, wenn direkte Beschriftung nicht möglich ist

## Diagrammregeln

Fachliche Diagramme müssen geometrisch korrekt sein.

### Achsen

- jede sichtbare Achse besitzt eine saubere Pfeilspitze am Richtungsende
- die Achsenlinie endet an der Basis der Spitze
- keine Linie ragt durch die Pfeilspitze
- x- und y-Achse sind beschriftet, sofern es keine ausdrücklich dokumentierte Skizze ist
- x-Achsentitel liegt mittig unter dem geraden Achsenstrich
- y-Achsentitel liegt mittig neben dem Achsenstrich und wird normalerweise um `-90°` gedreht
- Achsentitel stehen ungefähr 18–28 px von der Achse entfernt
- keine dekorative Pillen- oder Kartenfläche nur für ein Achsenlabel

### Daten und Marker

- Punkte, die eine Kurve erklären, liegen geometrisch auf der Kurve
- Marker beginnen exakt an der Achse
- Tick, Marker und Label verwenden dieselbe Koordinate
- ein Diagramm verwendet einen konsistenten Marker-Endmodus
- Referenzachsen müssen sich sichtbar von Datenlinien unterscheiden
- gemeinsame Zeitvergleiche verwenden eine gemeinsame Zeitachse statt vieler Mini-Achsen

### Layer-Reihenfolge

Empfohlene Zeichenreihenfolge:

1. transparente Root-Ebene oder fachlich notwendiger Hintergrund
2. statische fachliche Flächen
3. Raster und Achsen
4. Verbindungen
5. Daten, Marker und Icons
6. Highlight-Flächen mit geringer Deckkraft
7. Konturen von Highlights
8. Texte, Labels und Formeln

Text und zentrale Marker dürfen nicht von Highlights verdeckt werden.

## Icon- und Motivstil

Zentrale Icons müssen professionell wirken.

Bevorzugt:

- saubere SVG-Pfade
- konsistente projektlokale Icon-Komponenten
- bewusst abstrahierte technische Symbole
- hochwertige freigestellte Rastermotive, wenn SVG nicht sinnvoll ist

Nicht akzeptabel:

- improvisierte Autos, Maschinen oder Dokumente aus zufälligen Kreisen und Rechtecken
- wechselnde Strichstärken
- verschiedene Perspektiven innerhalb derselben Iconfamilie
- Emoji oder Betriebssystem-Symbole
- dekorative Icons ohne zusätzliche Aussage

Wenn ein realistisches Motiv nicht hochwertig darstellbar ist, ist eine klare abstrakte Darstellung besser.

## Pfeile und Verbindungen

Pfeile transportieren Bedeutung und sind keine Dekoration.

Regeln:

- Linie endet vor der Pfeilspitze
- Spitze als sauber kontrolliertes Polygon oder verlässlicher Marker
- keine Linie ragt durch die Spitze
- Pfeile liegen hinter Textknoten
- gleiche Prozesskette verwendet gleiche Schaftlänge, Strichstärke, Spitzenmaße und Farbe
- gleiche freie Abstände zwischen Quelle, Pfeil und Ziel
- Pfeile berühren oder überdecken keine Knoten
- zeitlich getrennte Übergänge sind getrennte Gruppen und Animationsziele

## Medien- und SVG-Assets

Ein Medienasset ist normalerweise nicht die ganze Folie.

Das Asset SOLLTE:

- einen transparenten, rahmenlosen Canvas besitzen
- im gemeinsamen 16:9-Format angelegt sein
- keine Template-Headline enthalten
- kein Footer oder Logo enthalten
- keine vollflächige generische Hintergrundkarte enthalten
- nur fachlich notwendige interne Panels besitzen
- als statisches Bild bereits verständlich sein
- genug Rand für Template-Layout und Animation lassen

Das Template setzt:

- Folienhintergrund
- Titel
- obere Akzentlinie
- Footer
- Logo
- allgemeine Brand-Hierarchie

## Takeaway-Band innerhalb eines SVG-Assets

Wenn ein Merksatz ausdrücklich Bestandteil einer eigenständigen SVG-Grafik sein muss, gilt als kompatible Asset-Referenz:

```text
x:      300
y:      910
Breite: 1320
Höhe:   116
Radius: 28
```

Stil:

```css
.takeaway-band {
  fill: #062d46;
}

.takeaway-outline {
  fill: none;
  stroke: #139ccb;
  stroke-width: 3;
  opacity: 0.65;
}

.takeaway-accent {
  fill: #139ccb;
}

.takeaway-text {
  fill: #ffffff;
  font-family: Inter, "Segoe UI", Arial, sans-serif;
  font-size: 34px;
  font-weight: 800;
  text-anchor: middle;
}
```

Diese Asset-Komponente ist nicht identisch mit der normalen `keyTakeaway`-Folienkarte. Pro Kontext wird nur eine der beiden Varianten verwendet.

## Animation und Bewegung

Animation ist ruhig, funktional und sprechertextgeführt.

### Standardbewegung

Typisches Einblenden:

```text
Dauer:        12–14 Frames
Startversatz: 16–18 px nach unten
Opacity:      0 -> 1
Translation:  +Y -> 0
```

Titelfolie:

```text
Dauer:        20 Frames
Startversatz: 20 px nach unten
```

### Stagger-Richtwerte

| Folientyp | typischer Fallback-Abstand |
| --- | ---: |
| Bullet-Karten | ca. 0,45 s |
| Lernziele | ca. 0,55 s |
| Prozessschritte | ca. 0,70 s |
| Agenda | ca. 0,90 s |

Diese Werte sind Design-Fallbacks. In der Produktionspipeline werden relevante Animationen möglichst über Sprechertext beziehungsweise Wortzeitpunkte synchronisiert.

### Bewegungsregeln

- keine dauernden schwebenden oder pulsierenden Dekorationen
- keine Bounce-Animationen
- keine starken Zooms ohne didaktischen Grund
- keine gleichzeitig einfliegenden Elemente aus verschiedenen Richtungen
- Reihenfolge folgt Sprechertext und Blickführung
- Animationen enden in einem stabilen, lesbaren Zustand
- Übergänge dürfen die Aufnahme neuer Information nicht behindern

## Barrierefreiheit und Lesbarkeit

- Text benötigt klaren Kontrast zu seiner Fläche.
- Deep Navy auf hellen Flächen ist der Standard.
- Weißer Text ist nur auf ausreichend dunklen Akzentflächen zulässig.
- Bedeutung darf nicht ausschließlich über Rot, Grün oder Amber vermittelt werden; Label, Form oder Position ergänzen die Farbe.
- Primärtext bei 1920×1080 möglichst mindestens 22 px.
- Linien müssen nach Skalierung sichtbar bleiben.
- Keine flackernden Animationen.
- Wichtige Information bleibt lange genug sichtbar, um gelesen zu werden.
- Untertitel oder Captions dürfen das Footerlogo und den Folieninhalt nicht verdecken.
- Ziel ist mindestens WCAG-AA-Kontrast für normalen Text, soweit der verwendete Renderer dies unterstützt.

## Inhaltsdichte

Richtwerte, keine starren Schemagrenzen:

| Inhalt | Empfehlung |
| --- | --- |
| Titelfolie | ein Titel, optional eine Unterzeile |
| Agenda | 3–6 Punkte |
| Lernziele | 3–5 Ziele |
| Bulletfolie | 3–6 kurze Aussagen |
| Definition | Begriff, Definition, maximal 3 Detailrollen |
| Media Aside | 1 Medienmotiv und maximal ungefähr 5 kurze Punkte |
| Key Takeaway | genau eine Kernaussage |
| Vergleich | 2–3 Spalten mit symmetrischer Informationsmenge |
| Prozess | so wenige Schritte wie möglich; bei hoher Anzahl auf mehrere Szenen verteilen |

Eine dichte Folie wird in mehrere Szenen geteilt, bevor Schrift und Zwischenräume unlesbar werden.

## Kopierbare Design-Tokens

Das folgende JSON kann als Ausgangspunkt für ein Designsystem im Ziel-Repository verwendet werden:

```json
{
  "schemaVersion": "reltestAcademySlideDesign/v1",
  "canvas": {
    "width": 1920,
    "height": 1080,
    "aspectRatio": "16:9"
  },
  "safeArea": {
    "outerX": 78,
    "outerY": 48,
    "contentX": 74,
    "contentTop": 56,
    "contentBottom": 118,
    "footerBottom": 30
  },
  "colors": {
    "accent": "#007EA7",
    "accentSoft": "rgba(0,126,167,0.12)",
    "accentGlow": "rgba(0,126,167,0.20)",
    "secondary": "#B7791F",
    "secondarySoft": "rgba(183,121,31,0.13)",
    "success": "#2F6F55",
    "successSoft": "rgba(47,111,85,0.12)",
    "deep": "#102A43",
    "deepSoft": "#243B53",
    "deepAlt": "#334E68",
    "text": "#1F2933",
    "textMuted": "#52606D",
    "textSoft": "#627D98",
    "surface": "#FFFFFF",
    "surfaceSoft": "#F7FAFC",
    "surfaceAlt": "#E6EEF5",
    "surfaceElevated": "#FBFDFF",
    "border": "rgba(16,42,67,0.14)",
    "borderStrong": "rgba(16,42,67,0.22)"
  },
  "typography": {
    "fontFamily": "Sora, Avenir Next, Segoe UI, sans-serif",
    "display": 82,
    "h1": 64,
    "h2": 54,
    "h3": 44,
    "bodyLg": 36,
    "body": 30,
    "bodySm": 26,
    "caption": 22,
    "label": 16,
    "footer": 20
  },
  "layout": {
    "contentMaxWidth": 1520,
    "stackGap": 16,
    "blockGap": 22,
    "titleContentGap": 44,
    "cardRadius": 8,
    "mediaAsideGap": 42
  },
  "shadows": {
    "small": "0 6px 14px rgba(16,42,67,0.07)",
    "medium": "0 14px 28px rgba(16,42,67,0.09)",
    "large": "0 24px 54px rgba(16,42,67,0.12)",
    "extraLarge": "0 34px 80px rgba(16,42,67,0.16)"
  },
  "chartPalette": [
    "#007EA7",
    "#B7791F",
    "#2F6F55",
    "#102A43",
    "#7B8794"
  ],
  "footer": {
    "label": "Professional Reliability Training | Reliability Engineer",
    "logoHeight": 80
  }
}
```

## Referenz-CSS für einen Standardframe

```css
:root {
  --academy-accent: #007ea7;
  --academy-secondary: #b7791f;
  --academy-success: #2f6f55;
  --academy-deep: #102a43;
  --academy-text: #1f2933;
  --academy-text-muted: #52606d;
  --academy-text-soft: #627d98;
  --academy-border: rgba(16, 42, 67, 0.14);
  --academy-border-strong: rgba(16, 42, 67, 0.22);
  --academy-font: "Sora", "Avenir Next", "Segoe UI", sans-serif;
}

.academy-slide {
  position: relative;
  width: 1920px;
  height: 1080px;
  overflow: hidden;
  color: var(--academy-text);
  font-family: var(--academy-font);
  background: linear-gradient(
    135deg,
    #f9fbfc 0%,
    #f1f5f8 56%,
    #e9f0f4 100%
  );
}

.academy-grid {
  position: absolute;
  inset: 0;
  opacity: 0.34;
  background:
    repeating-linear-gradient(
      90deg,
      rgba(16, 42, 67, 0.035) 0,
      rgba(16, 42, 67, 0.035) 1px,
      transparent 1px,
      transparent 80px
    ),
    repeating-linear-gradient(
      0deg,
      rgba(16, 42, 67, 0.03) 0,
      rgba(16, 42, 67, 0.03) 1px,
      transparent 1px,
      transparent 80px
    );
}

.academy-accent-line {
  position: absolute;
  left: 74px;
  top: 36px;
  width: 118px;
  height: 5px;
  border-radius: 4px;
  background: var(--academy-accent);
}

.academy-content {
  position: relative;
  z-index: 2;
  height: 100%;
  box-sizing: border-box;
  padding: 56px 74px 118px;
  display: flex;
  flex-direction: column;
}

.academy-title {
  max-width: 1460px;
  margin: 0 0 28px;
  color: var(--academy-deep);
  font-size: 54px;
  font-weight: 800;
  line-height: 1.05;
}

.academy-title-rule {
  position: absolute;
  left: 74px;
  right: 74px;
  top: 148px;
  height: 1px;
  background: linear-gradient(
    90deg,
    rgba(16, 42, 67, 0.08),
    rgba(16, 42, 67, 0.14) 48%,
    rgba(16, 42, 67, 0.04)
  );
}

.academy-body {
  position: relative;
  flex: 1;
  min-height: 0;
  padding-top: 44px;
}

.academy-card {
  border: 1px solid var(--academy-border-strong);
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.94);
  box-shadow: 0 14px 28px rgba(16, 42, 67, 0.09);
}

.academy-footer {
  position: absolute;
  z-index: 3;
  left: 74px;
  right: 74px;
  bottom: 24px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: var(--academy-text-soft);
  font-size: 20px;
  font-weight: 700;
}

.academy-footer img {
  display: block;
  width: auto;
  height: 80px;
  object-fit: contain;
}
```

## Referenz-Markup

```html
<section class="academy-slide" aria-label="Lernfolie">
  <div class="academy-grid" aria-hidden="true"></div>
  <div class="academy-accent-line" aria-hidden="true"></div>
  <div class="academy-title-rule" aria-hidden="true"></div>

  <main class="academy-content">
    <h1 class="academy-title">Signalfluss im System</h1>

    <div class="academy-body">
      <!-- Template-spezifischer Inhalt -->
    </div>
  </main>

  <footer class="academy-footer">
    <span>Professional Reliability Training | Reliability Engineer</span>
    <img src="reltest-academy.svg" alt="RelTest Academy" />
  </footer>
</section>
```

## Empfohlene Komponenten im Ziel-Repository

Das Ziel-Repository SOLLTE mindestens folgende wiederverwendbare Bausteine besitzen:

```text
BrandFrame
SlideTitle
SlideFooter
SurfaceCard
NumberBadge
KickerLabel
BulletList
KeyTakeawayCard
MediaAsideLayout
SvgDiagramSlot
ComparisonColumns
WorkflowStep
ChartFrame
```

Farben, Abstände und Typografie dürfen nicht in jeder Folie neu als freie Werte erfunden werden. Sie müssen aus gemeinsamen Tokens kommen.

## Do

- viel Weißraum lassen
- klare Deep-Navy-Typografie verwenden
- Cyan als gezielten Hauptakzent einsetzen
- eine dominante visuelle Hierarchie schaffen
- ähnliche Szenen mit denselben Komponenten bauen
- Medien groß und rahmenlos zeigen
- kurze sichtbare Texte verwenden
- Karten nur für echte Gruppierung nutzen
- semantische Farben sparsam einsetzen
- Diagrammgeometrie präzise konstruieren
- alle Folien bei Zielauflösung visuell prüfen

## Don’t

- keine überfüllten PowerPoint-Layouts
- keine Mischung vieler Akzentfarben
- keine 3D-Charts
- keine doppelten äußeren Rahmen
- keine generische weiße Großkarte um den kompletten Inhalt
- keine Schatten auf jeder verschachtelten Ebene
- keine kleinen Texte als Notlösung
- keine improvisierten Fokus-Icons
- keine Pfeile, deren Linie durch die Spitze läuft
- keine Headline, Footer oder Logo-Duplikate in SVG-Assets
- keine unterschiedlichen Kartenradien ohne System
- keine rein dekorativen Pillen und Badges
- keine offensichtlichen Gruppenüberschriften wie `Drei Ergebnisse`, wenn die drei Gruppen bereits klar sichtbar sind
- keine Formeln ohne kontrollierten Satz
- keine Farbe als einzige Bedeutungscodierung

## Visual-QA bei Zielauflösung

Jede Folie MUSS als 1920×1080-Standbild oder in der tatsächlichen Zielauflösung geprüft werden.

Prüffragen:

- Ist die zentrale Aussage in drei bis fünf Sekunden erfassbar?
- Ist die Folie auch ohne Animation verständlich?
- Bleiben Titel, Footer und Logo vollständig sichtbar?
- Liegt wichtiger Inhalt innerhalb der Safe Areas?
- Gibt es Textüberläufe oder abgeschnittene Wörter?
- Ist Primärtext groß genug?
- Sind Zeilenabstände und Kartenpadding konsistent?
- Gibt es unnötige Karten, Konturen oder Schatten?
- Werden Akzentfarben semantisch und sparsam verwendet?
- Wirken Icons und Pfeile professionell?
- Überdecken Highlights keine Texte oder Marker?
- Sind Diagrammpunkte, Kurven und Achsen geometrisch korrekt?
- Ist das Logo unverzerrt und in Originalfarben?
- Ist die Schrift in der Renderumgebung tatsächlich die erwartete Schrift?
- Enthält die Folie echte Umlaute und keine Zeichencodierungsfehler?
- Wirkt die Folie neben bestehenden RelTest-Academy-Folien wie Teil derselben Reihe?

## Automatisierbare Prüfungen

Das Ziel-Repository SOLLTE automatisieren:

- Canvas ist 1920×1080 oder proportional 16:9.
- Design-Tokens werden statt freier Farbwerte verwendet.
- Logo besitzt unverändertes Seitenverhältnis.
- Primärtext unterschreitet die definierte Mindestgröße nicht.
- Inhalte verlassen die Safe Areas nicht unbeabsichtigt.
- Medienassets duplizieren Footer oder Logo nicht.
- SVGs enthalten keine aktiven Skripte.
- Screenshots der Kernfolientypen werden als visuelle Regression verglichen.
- Fontdateien oder Font-Fallbacks sind in CI und Renderumgebung identisch.

## Definition of Done

Eine neue Folie oder Templatefamilie ist bereit, wenn:

- [ ] sie im Format 16:9 und in der Zielauflösung geprüft wurde,
- [ ] der Standardhintergrund und das dezente Raster korrekt sind,
- [ ] Inhalts- und Footer-Safe-Areas eingehalten werden,
- [ ] obere Akzentlinie, Titelhierarchie und Footer dem BrandFrame entsprechen,
- [ ] das offizielle Logo unverzerrt und in Originalfarben verwendet wird,
- [ ] die verwendete Schrift deterministisch verfügbar oder bewusst als Fallback festgelegt ist,
- [ ] Farben aus der aktiven Produktionspalette stammen,
- [ ] SVG-Altbestände nicht unkontrolliert mit neuen Akzentfarben gemischt werden,
- [ ] Karten Radius, Kontur, Schatten und Padding konsistent verwenden,
- [ ] sichtbarer Text kurz, scanbar und groß genug ist,
- [ ] die Folie eine dominante Lernbotschaft besitzt,
- [ ] semantische Farben nicht nur dekorativ eingesetzt werden,
- [ ] Medienassets Titel, Footer und Logo nicht duplizieren,
- [ ] Pfeile, Achsen, Datenpunkte und Marker geometrisch sauber sind,
- [ ] Animationen ruhig und inhaltlich begründet sind,
- [ ] die Folie als statisches Standbild funktioniert,
- [ ] keine Kollisionen, Überläufe oder Zeichenkodierungsfehler sichtbar sind,
- [ ] visuelle Regressionen für den betroffenen Archetyp vorhanden sind.

## Mindestlieferumfang für das andere Repository

Für eine wirklich konsistente Umsetzung sollte die Übergabe neben diesem Markdown enthalten:

```text
docs/external-slide-brand-design-handoff.md
assets/reltest-academy.svg
assets/reltest-academy-long.svg       # optional
fonts/<freigegebene-fontdateien>      # falls Sora verbindlich gebündelt wird
```

Logo- und Fontdateien dürfen nur mit geklärten Nutzungsrechten weitergegeben werden.

## Kurzauftrag für einen Agenten im anderen Repository

> Implementiere das RelTest-Academy-Foliendesign gemäß diesem Dokument als wiederverwendbares Designsystem. Lege zentrale Tokens für Farbe, Typografie, Abstände, Safe Areas, Karten und Schatten an. Baue einen 1920×1080-BrandFrame mit hellem technischem Verlauf, sehr dezentem 80-px-Raster, kurzer cyanfarbener Akzentlinie, linksbündiger Titelzone und festem Footer mit Trainingsbezeichnung und offiziellem Logo. Verwende Deep Navy für Hierarchie, Cyan als primären Akzent sowie Amber, Grün und Rot ausschließlich semantisch. Implementiere die beschriebenen Folienarchetypen aus gemeinsamen Komponenten, halte Medienassets rahmenlos und frei von doppeltem Titel/Footer/Logo, reduziere sichtbaren Text auf scanbare Kernaussagen und prüfe alle Varianten als Zielauflösungs-Screenshots. Bündele Sora nur mit geklärter Lizenz; andernfalls lege einen getesteten deterministischen Font-Fallback fest.

## Weiterführende Referenzen im Ursprungs-Repository

Diese Datei ist als eigenständiger Vertrag gedacht. Falls das Ursprungs-Repository verfügbar ist, sind zusätzlich relevant:

- `src/components/Theme.ts`
- `src/components/Typography.tsx`
- `src/components/BrandFrame.tsx`
- `src/components/StandardTemplate.tsx`
- `storyboard-producer/playbook/brand/reltest-academy-style-guide.md`
- `storyboard-producer/playbook/brand/design-quality-bar.md`
- `storyboard-producer/playbook/workflows/diagram-guidelines.md`
- `docs/external-svg-asset-package-handoff.md`
