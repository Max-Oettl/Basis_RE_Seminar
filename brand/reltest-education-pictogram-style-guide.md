# RelTest Education Piktogrammstil

## Zweck

Piktogramme sind im RelTest-Education-System kurze visuelle Lernanker. Sie
helfen, einen Begriff, eine Handlung, eine Ebene oder einen Zustand schneller zu
erkennen. Sie sind weder Dekoration noch Ersatz fuer fachlich notwendigen Text.

Die technische Quelle ist
`brand/reltest-education-pictogram-tokens.json`. Die Produktionsschritte stehen
in `workflow/30-visual-decision/pictogram-creation-workflow.md`.

## Minimalistische Formensprache

- Ausgabe ausschliesslich als generiertes PNG-Bildasset,
- quadratisches Masterbild mit mindestens 1024 x 1024 px und echtem Alphakanal,
- optisch zentriert und mit mindestens 8 Prozent transparentem Sicherheitsrand,
- ruhige, kontrollierte Silhouette mit konsistenter Konturwirkung,
- flache, orthogonale Ansicht ohne perspektivische Mischformen,
- eine klare Silhouette und nur bedeutungstragende Details,
- keine Schatten, Verlaeufe, Texturen, 3D-Effekte oder dekorativen Binnenlinien,
- kein Text, keine Buchstaben und keine eingebauten Beschriftungen,
- standardmaessig monochrom; hoechstens eine zweite semantische Farbe.

Das Piktogramm darf nicht im Szenen-SVG aus Pfaden, Grundformen oder einer
SVG-Iconbibliothek rekonstruiert werden. Das SVG platziert und animiert nur das
fertige PNG-Asset.

Ein optionaler flacher Kreis darf als ruhiges Hintergrundfeld dienen. Er darf
keine eigene Bedeutung tragen und ersetzt keine erkennbare Silhouette.

## Education-Farbrollen

- Marineblau `#031334`: Standardkontur und neutrale Bedeutung.
- Signalgruen `#00A754`: primaerer Education-Akzent, positiver oder aktiver Fokus.
- Koralle `#EC6244`: Fehler, Risiko oder negative Abweichung.
- Goldgelb `#E9B400`: Warnung; auf hellem Grund nicht allein als Kontur einsetzen.
- Stahlcyan `#0C84B4`: technische oder vergleichende Nebenrolle, nicht Leitfarbe.
- Graphitblau `#25495F`: ruhige sekundaere Kontur.

Informationsrelevante Konturen erreichen mindestens 3:1 Kontrast zum direkten
Hintergrund. Farbe darf nie die einzige Bedeutungszuordnung sein.

## Was E-Learning-Eignung Bedeutet

Ein Piktogramm ist fuer das E-Learning geeignet, wenn es die kognitive Arbeit
verringert und nicht zusaetzliche Entschluesselung verlangt:

1. Es traegt genau eine primaere Bedeutung.
2. Es wird im typischen Viewer-Massstab innerhalb etwa einer Sekunde erkannt.
3. Es bleibt bei 50 Prozent der Produktionsgroesse unterscheidbar.
4. Es steht mit einer kurzen Beschriftung oder in eindeutigem Kontext.
5. Es funktioniert auch ohne Farbe und ohne Hover-Zustand.
6. Es ist kulturarm, sachlich und fuer Einsteiger ohne Fachvorwissen lesbar.
7. Es bleibt innerhalb eines Moduls semantisch stabil: dasselbe Motiv bedeutet
   immer dasselbe.
8. Es kann als atomare Einheit mit seinem Label beziehungsweise seiner Karte
   eingeblendet werden.
9. Es ersetzt weder Zahlen, Formeln, Prozessreihenfolgen noch notwendige
   Fachbegriffe.
10. Es ist zugaenglich: redundant zu sichtbarem Text wird es fuer Screenreader
    verborgen; alleinstehend erhaelt es eine klare Alternativbezeichnung.

## Groessen

- fokales Lernmotiv: ab 140 px,
- konkretes Objektpiktogramm: ab 96 px,
- regulaerer Karten- oder Abschnittsanker: ab 80 px,
- kompaktes universelles Piktogramm: ab 64 px,
- sekundaerer Statusmarker: ab 48 px und nur direkt neben eindeutigem Text,
- unter 32 px keine produktive Verwendung; 32 px dient nur dem Härtetest.

Freigegeben wird die PNG-Masterdatei samt Asset-Brief und die gerenderte
Darstellung bei 64, 48 und 32 px sowie im realen Folienkontext bei typischer
Viewer-Verkleinerung.

## Abgrenzung Zu Illustrationen

Auch einfache universelle Motive werden als generierte PNGs oder bereits
freigegebene PNG-Library-Assets umgesetzt. Ein konkretes Produkt, Werkzeug,
Geraet, eine Maschine oder eine identitaetstragende technische Form ist keine
minimalistische Piktogramm-Aufgabe, wenn wesentliche Merkmale im Kleinmassstab
verloren gehen. Dann greift das Asset-Entscheidungsgate: technische
Illustration, Quellenextraktion oder Nutzerasset.

## Animation

- Piktogramm, Label und zugehoeriger Container bilden standardmaessig eine
  semantische Animationsgruppe.
- Ruhiges `show` ist der Standard.
- Einzelne Striche werden nicht nacheinander gezeichnet, ausser der Aufbau des
  Symbols selbst ist Lerninhalt.
- Kein Bounce, Spin, Dauerpuls oder dekorativer Zoom.
- Ein Statuswechsel verwendet zwei klar benannte Zustaende oder einen
  semantischen Farb-/Formwechsel, nie eine beliebige Effektanimation.

## Freigabesperren

Keine Freigabe bei unklarer Bedeutung, zu kleinen Details, uneinheitlicher
Strichsprache, fehlendem Kontext, Solutions-dominantem Cyan, unzureichendem
Kontrast, dekorativer Animation oder einem konkreten Objekt, das durch ein
generisches Symbol ersetzt wurde. Ebenfalls keine Freigabe fuer Piktogramme,
die im Szenen-SVG aus Pfaden oder Grundformen gezeichnet wurden.
