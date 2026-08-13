# RelTest-Education-Piktogrammworkflow

Dieser Workflow ist die kanonische Quelle fuer Auswahl, Erstellung, Freigabe und
Wiederverwendung von Piktogrammen in RelTest-Education-Lerninhalten.

**Verbindliche Projektregel:** Piktogramme werden als generierte PNG-Bildassets
produziert und in die Szene eingebettet. Aus SVG-Pfaden, Grundformen oder einer
SVG-Iconbibliothek konstruierte Piktogramme sind fuer neue oder geaenderte
Szenen nicht zulaessig. SVG bleibt nur der Szenencontainer fuer Platzierung,
Beschriftung, Gruppierung und Animation des PNG-Assets.

Verbindliche Quellen sind nach Rolle getrennt:

- visuelle Formensprache: `brand/reltest-education-pictogram-style-guide.md`,
- exakte Geometrie-, Farb-, Groessen- und QA-Werte:
  `brand/reltest-education-pictogram-tokens.json`,
- stabile Bedeutungszuordnung vorhandener Motive:
  `components/pictogram-library/pictogram-registry.json`,
- Prozess, Freigabereihenfolge und Assetentscheidung: dieses Dokument.

Bei abweichenden Zahlenwerten hat die Piktogramm-Tokenquelle Vorrang. Full-Slide-
und Content-SVG-Tokens verweisen nur auf diese Quelle und fuehren keine zweite
Piktogrammdefinition.
Die verbindliche technische Tokenquelle ist
`brand/reltest-education-pictogram-tokens.json`; die kurze visuelle
Zusammenfassung steht in
`brand/reltest-education-pictogram-style-guide.md`.

## Ziel

Piktogramme sollen einen Begriff, eine Handlung, ein Objekt oder einen Zustand
schneller erfassbar machen. Sie sind keine Dekoration und keine verkleinerte
Illustration. Ein gutes Piktogramm reduziert die Such- und Verstehenszeit, ohne
fachliche Praezision vorzutäuschen oder zusaetzliche visuelle Last zu erzeugen.

## Was E-Learning-Geeignet Bedeutet

Ein Piktogramm ist fuer E-Learning geeignet, wenn alle folgenden Bedingungen
erfuellt sind:

1. **Sofortige Zuordnung:** Das Motiv traegt genau einen dokumentierten Begriff
   oder Zustand. Es ist nicht mit einem naheliegenden anderen Begriff
   verwechselbar.
2. **Kognitive Sparsamkeit:** Nur identitaetstragende Merkmale bleiben erhalten.
   Textur, Perspektive, Materialglanz und dekorative Details werden entfernt.
3. **Kleinmassstab:** Die tragende Silhouette und der semantische Zusatz bleiben
   im kleinsten vorgesehenen Playerzustand erkennbar. Der Standardcheck erfolgt
   im 960x540-Render und als isolierte 48-px-Vorschau; universelle kompakte Icons
   muessen zusaetzlich bei 32 px bestehen.
4. **Redundante Bedeutung:** Farbe ist nie der einzige Informationstraeger.
   Status wird zusaetzlich durch Form, Kontur, Haken, Kreuz oder eindeutige
   Beschriftung vermittelt.
5. **Zugaenglichkeit:** Bedeutungsrelevante Teile erreichen mindestens 3:1
   Kontrast gegen angrenzende Farben. Ein mit sichtbarem Text redundantes Icon
   ist im Markup dekorativ; ein allein bedeutungstragendes Icon erhaelt einen
   zugaenglichen Namen.
6. **Lernkonsistenz:** Derselbe Begriff verwendet innerhalb eines Moduls und
   nach Moeglichkeit im gesamten Seminar dasselbe freigegebene Piktogramm.
   Dasselbe Piktogramm darf nicht fuer verschiedene Begriffe umgedeutet werden.
7. **Narrationsbezug:** Das Piktogramm erscheint erst, wenn sein Begriff oder
   seine Funktion im Sprechertext relevant wird. Icon, Label und zugehoerige
   Karte bilden normalerweise eine atomare Animationsgruppe.

Diese Regeln operationalisieren insbesondere WCAG 2.2 zu Nicht-Text-Kontrast
und Farbe sowie die UDL-Forderung, Symbole zu klaeren und Information ueber
mehrere abgestimmte Darstellungsformen zugaenglich zu machen:

- https://www.w3.org/WAI/WCAG22/Understanding/non-text-contrast.html
- https://www.w3.org/WAI/WCAG22/Understanding/use-of-color.html
- https://udlguidelines.cast.org/representation/language-symbols

## Abgrenzung

Vor der Erstellung genau eine Klasse waehlen:

| Klasse | Zweck | Standardstrategie |
| --- | --- | --- |
| `universal_pictogram` | bekannter einfacher Begriff wie Suche, Zeit oder Ziel | `generated_png` oder freigegebenes PNG-Library-Asset |
| `object_pictogram` | konkretes, aber reduzierbares Objekt wie Batterie, Strommast oder Waschmaschine | `generated_png` oder freigegebenes PNG-Library-Asset |
| `status_pictogram` | Zustand wie intakt, ausgefallen oder freigegeben | generiertes PNG mit kanonischem Statusmarker |
| `technical_illustration` | Bauart, Anschluesse oder technische Identitaet sind Lerninhalt | hochwertiges Bildasset oder technische Illustration; nicht als Piktogramm deklarieren |
| `photo_or_rendering` | reales Fallbeispiel, Material oder Produkt ist selbst die Evidenz | Foto-/Medienworkflow |
| `diagram` | Beziehungen, Mengen, Fluesse oder Messwerte sind Lerninhalt | Diagramm-/Plotworkflow |

Eine technische Illustration, ein Foto oder ein Diagramm darf nicht als
Piktogramm bezeichnet werden, nur um die strengeren Fach- oder Assetpruefungen
zu umgehen.

## Verbindliche Education-Formensprache

### Grundform

- flach, minimalistisch und zweidimensional,
- frontale oder orthografische Ansicht; keine dramatische Perspektive,
- eine dominante Silhouette und hoechstens ein semantischer Zusatz,
- runde Linienenden und Linienverbindungen,
- ruhige, geometrisch kontrollierte Konturen,
- grosszuegiger Negativraum und klare Innenoeffnungen,
- keine eingebrannten Texte, Zahlen, Buchstaben, Logos oder Wasserzeichen.

### PNG-Pflicht

- produktives Endformat ist immer PNG,
- keine im Szenen-SVG gezeichneten Iconpfade, Grundformen oder Symbolgruppen,
- keine Konvertierung einer selbst konstruierten SVG-Icongeometrie in PNG als
  Umgehung der Generierungsregel,
- Wiederverwendung nur ueber freigegebene PNG-Masterassets mit Asset-Brief,
- das SVG darf das PNG nur platzieren, beschriften, gruppieren und animieren.

### Rastergrammatik

- quadratische Masterdatei mit mindestens `1024 x 1024` px,
- echter Alphakanal und vollstaendig transparenter Hintergrund,
- mindestens 8 Prozent transparenter Sicherheitsrand um das Motiv,
- dieselbe flache Education-Formensprache innerhalb der PNG-Familie,
- harte, saubere Silhouette mit kontrolliertem Antialiasing,
- keine Schatten, Lichtsaeume, Texturen oder freigestellten Reste,
- keine Chromakey-Flaeche im freigegebenen Ergebnis.

### Verbotene Stile

Keine Freigabe fuer:

- 3D-, isometrische, fotorealistische oder gerenderte Optik,
- Verlaeufe, Glanz, Spiegelungen, Schatten, Glow oder Neon,
- Comic-, Clipart-, Emoji- oder Stickeroptik,
- detaillierte Szenen, Hintergruende oder mehrere konkurrierende Objekte,
- zufaellige Perspektiven innerhalb derselben Familie,
- KI-typische Mikrodetails, falsche Anschluesse oder unplausible Geometrie.

## Corporate-Identity-Regeln

- Marineblau `#142452` ist die Standardfarbe des Grundmotivs.
- Signalgruen `#00A653` ist der Education-Submarkenakzent und wird nur fuer
  aktive, positive oder fokussierte Bedeutung eingesetzt.
- Koralle `#EC6244` kennzeichnet Fehler, Ausfall oder negative Abweichung.
- Goldgelb `#E9B400` kennzeichnet Warnung oder Aufmerksamkeit.
- Stahlcyan `#0C84B4` ist keine allgemeine Piktogramm-Akzentfarbe; es bleibt
  technischen Vergleichs- und Diagrammrollen vorbehalten.
- Pro Piktogramm maximal zwei Markenfarben plus Transparenz beziehungsweise
  neutraler Hintergrund. Mehr Farben brauchen eine dokumentierte fachliche
  Notwendigkeit.
- Status niemals allein durch den Farbwechsel des Grundmotivs darstellen.
- Erlaubte Farbpaare und ihre kleinste Kontraststelle im Asset-Brief
  dokumentieren; erforderlicher Mindestwert ist `3:1`.

## Groessen Und Einsatz

Die Platzierung wird vom kleinsten vorgesehenen Playerzustand rueckwaerts
geplant:

| Rolle | Richtwert im 1920x1080-SVG | Kleinmassstab-Gate |
| --- | ---: | --- |
| kompaktes universelles Icon | mindestens 64 px | bei 32 px eindeutig |
| Standardpiktogramm neben Label | 80 bis 112 px | bei 48 px eindeutig |
| konkretes Objektpiktogramm | 96 bis 160 px | bei 48 px eindeutig |
| zentrales Lehrmotiv | 140 bis 240 px | im 960x540-Szenenrender eindeutig |

Ein Asset, das erst durch Vergroesserung oder seine Beschriftung erkennbar wird,
ist entweder zu komplex, falsch klassifiziert oder fuer diese Platzierung
ungeeignet. Dann Motiv reduzieren, Platzierung vergroessern oder eine technische
Illustration statt eines Piktogramms waehlen.

## Produktionsablauf

### 1. Semantik-Brief

Vor dem Bildgenerierungs-Prompt dokumentieren:

Vorlage: `templates/pictogram-brief-template.md`.

Dieser Markdown-Brief plant Bedeutung, Einsatz und Animation fuer jedes
Piktogramm. Jedes generierte PNG-Piktogramm erhaelt vor der
technischen Freigabe zusaetzlich den maschinenpruefbaren Asset-Brief aus
`templates/pictogram-asset-brief-template.json`; beide Artefakte verwenden
denselben `reuseKey`.

- `concept`: exakt ein Begriff, Objekt, eine Handlung oder ein Zustand,
- `sourceEvidence`: Quellfolie, Sprechertext oder Nutzerauftrag,
- `learningFunction`: Orientierung, Begriffsanker, Prozessschritt, Status oder
  Zustandswechsel,
- `mustShowFeatures`: hoechstens drei identitaetstragende Merkmale,
- `mustNotImply`: naheliegende Fehlinterpretationen,
- `confusableWith`: aehnliche Piktogramme oder Begriffe,
- `firstUseLabel`: eindeutige sichtbare Beschriftung bei der Einfuehrung,
- `reuseKey`: stabiler seminarweiter Begriffsname.

Fehlt eine eindeutige Lernfunktion, Strategie `omit_with_reason` verwenden.

### 2. Bibliothek Vor Neuerzeugung

Zuerst `components/pictogram-library/pictogram-registry.json` und die
freigegebenen PNG-Bildassets pruefen.
Vorhandenes Asset verwenden, wenn Semantik, Identitaetsmerkmale und Stil passen.
Nicht durch lokale Farb-, Perspektiv- oder Detailvarianten eine zweite Sprache
erzeugen.

### 3. Assetstrategie

- Einfache universelle Form: `generated_png` oder bereits freigegebenes PNG.
- Komplexeres, aber reduzierbares reales Objekt: `generated_png`.
- In der Quelle bereits hochwertig und lizenzierbar: `extracted_png`.
- Technische Identitaet muss exakt stimmen: Originalbildasset,
  technische Illustration oder `user_asset_required`.
- Fachbeziehung statt Objekt: kein Piktogramm, sondern Diagramm oder
  SVG-Komposition.

`native_svg` und `library_svg_adapted` sind keine zulaessigen
Piktogrammstrategien mehr.

### 4. Prompt Fuer Generierte Piktogramme

Jeder Prompt enthaelt in dieser Reihenfolge:

1. genau ein isoliertes Motiv,
2. die maximal drei identitaetstragenden Merkmale,
3. flache frontale Education-Formensprache,
4. Marineblau als Grundmotiv und hoechstens eine semantische Akzentfarbe,
5. transparenten Hintergrund und 8 Prozent Sicherheitsrand,
6. Ziel: eindeutige Erkennbarkeit bei 48 px,
7. die vollstaendige Ausschlussliste.

Standardformulierung:

```text
Ein einzelnes isoliertes, minimalistisches 2D-Piktogramm von [MOTIV].
Erkennungsmerkmale: [MAXIMAL DREI MERKMALE]. Frontale oder orthografische
Ansicht, flache geometrische Silhouette, hauptsaechlich eckige und ausreichend
kraeftige Konturen, RelTest-Education-Marineblau #142452, optional Signalgruen
#00A653 nur fuer
[SEMANTISCHE ROLLE]. Vollstaendig transparenter Hintergrund, mittig, 8 Prozent
transparenter Sicherheitsrand, bei 48 px eindeutig erkennbar. Kein Text, keine
Zahl, kein Logo, kein Wasserzeichen, keine Szene, kein 3D, keine Isometrie, kein
Fotorealismus, kein Verlauf, kein Schatten, kein Glow, keine Textur, kein Neon.
```

Neue zentrale oder wiederverwendbare Motive erhalten zwei kontrollierte
Varianten. Ausgewaehlt wird die semantisch eindeutigere, nicht die dekorativere.

### 5. Technische Bereinigung

- Ergebnis auf echten Alphakanal und transparenten Rand pruefen.
- Chromakey- oder Hintergrundreste entfernen; bei sichtbaren Saeumen neu
  generieren statt aggressiv weichzuzeichnen.
- Motiv optisch zentrieren, nicht nur nach Pixel-Bounding-Box.
- Masterdatei nicht auf die Einbauabmessung herunterskalieren.
- Asset-Brief und lokale Quellen-/Lizenzmetadaten neben dem Asset speichern.

### 6. Vierfaches Freigabegate

1. **Semantik:** Deckt die Silhouette den dokumentierten Begriff und alle
   `mustShowFeatures`? Vermeidet sie `mustNotImply`?
2. **Stil:** Flat, maximal zwei Markenfarben, keine verbotenen Effekte, gleiche
   Perspektive, Ecken- und Konturlogik wie die Familie?
3. **E-Learning:** Erkennbar bei 48 px und im 960x540-Szenenrender? Beim ersten
   Auftreten eindeutig beschriftet? Kein rein dekorativer Einsatz?
4. **Zugaenglichkeit/Technik:** Transparenz, 3:1-Kontrast, Bedeutung nicht nur
   ueber Farbe, keine eingebrannten Texte, lokaler stabiler Pfad?

Ein einzelnes nicht bestandenes Gate ergibt `needs_revision`. Kein SVG darf ein
benoetigtes Asset mit diesem Status integrieren.

Vor `accepted` die passenden deterministischen Checks ausfuehren:

```powershell
# jedes generierte oder extrahierte Piktogramm samt Asset-Brief
node tools/validate-pictogram-asset.js --brief <asset-brief.json> --release
```

Der Rastercheck prueft unter anderem realen Alphakanal, transparenten
Sicherheitsrand, Masterabmessung, Stilflags, Kleinmassstab-Freigaben und
Kontrastpaare. Der Asset-Brief beginnt mit
`templates/pictogram-asset-brief-template.json`.

### 7. Wiederverwendung

Freigegebene seminarweite PNG-Motive in die zentrale Bildbibliothek uebernehmen.
In `pictogram-registry.json` entspricht die `id` dem stabilen `reuseKey`; mindestens
`meaning`, `semanticRoles`, `preferredLabels`, `avoidFor` und `status`
dokumentieren. Varianten fuer denselben Begriff nur anlegen, wenn ein fachlich
anderer Zustand dies erfordert.

## Einbindung Und Animation

- Bildtext bleibt SVG-Text; niemals in das Piktogramm einbrennen.
- Icon, Label, Statusmarker und zugehoerige Karte als eine semantische Gruppe
  strukturieren.
- Redundantes Icon mit `aria-hidden="true"` kennzeichnen.
- Allein bedeutungstragende Gruppe mit `role="img"` und eindeutigem
  `aria-label` beziehungsweise `<title>` versehen.
- Piktogramme normalerweise als Gruppe ruhig einblenden. Keine interne
  Einzelteilanimation, kein Drehen, Pulsieren, Bounce oder dekoratives Morphing.
- Ein echter Zustandswechsel darf Grundobjekt und Statusmarker transformieren,
  wenn Ausgangs- und Zielzustand fachlich belegt sind.
- Der erste sichtbare Zustand folgt dem Animationsworkflow und der ersten
  Sprechertextrelevanz; ein spaeteres Beispielpiktogramm ist kein neutraler
  Startschmuck.

## Harte Freigabesperren

Keine Freigabe, wenn:

- das Motiv ohne Label nicht von einem naheliegenden anderen Motiv
  unterscheidbar ist,
- das Piktogramm im Szenen-SVG aus Pfaden, Grundformen oder einer
  SVG-Iconbibliothek aufgebaut ist,
- ein konkretes Objekt durch eine generische Box oder ein unpassendes Symbol
  ersetzt wurde,
- das Asset wie eine kleine 3D-Illustration statt wie ein Piktogramm wirkt,
- mehrere Objekte oder eine komplette Szene im Asset stecken,
- Hintergrund oder Chromakey-Reste sichtbar sind,
- Text, Logo oder Wasserzeichen eingebrannt sind,
- dieselbe Sequenz unterschiedliche Perspektiven, Strichstaerken oder
  Farbsemantiken mischt,
- Status nur durch Farbe erkennbar ist,
- der 48-px- oder 960x540-Test nicht bestanden wurde,
- erforderlicher Nicht-Text-Kontrast unter 3:1 liegt,
- das Asset vor seinem ersten relevanten Sprechertextbeat sichtbar ist.

## Automatische Pruefung

Nach Aenderungen an Tokens, Registry oder PNG-Library ausfuehren:

Jedes neue Asset mit `tools/validate-pictogram-asset.js --release` pruefen.
Zusaetzlich im Szenen-SVG sicherstellen, dass das Motiv als `<image>` eingebettet
ist und innerhalb des Piktogrammbereichs keine ersetzende Pfadgeometrie liegt.
Automatische Fehlerfreiheit ersetzt nicht den 48-/32-px- und
960x540-Sichtcheck.
