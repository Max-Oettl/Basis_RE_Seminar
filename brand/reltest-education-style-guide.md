# RelTest Education Style Guide

## Verbindliche Quelle

Dieser Style Guide operationalisiert
`source-materials/brand/Corporate_Design_RELTEST_19.pdf` fuer Lernfolien,
Content-SVGs, Diagramme und Downstream-Videoausgaben.

Die Submarke heisst `RelTest Education`. `RelTest Academy` ist eine Altbezeichnung
und darf in neuen sichtbaren Texten, Metadaten, Logos oder Dateivorlagen nicht
mehr verwendet werden.

## Markenwirkung

RelTest Education wirkt:

- modern, reduziert und international,
- technisch und professionell,
- klar, praezise und vertrauenswuerdig,
- digital-affin und fuer eine juengere Zielgruppe anschlussfaehig,
- hochwertig, ohne klassische Ingenieurs-Schwere.

Die Gestaltung vermeidet dekorative Effekte, beliebige Farbrotation,
Solutions-dominantes Cyan und generische Business- oder KI-Aesthetik.

## Logosystem

Fuer Lernplattform, Schulungen, Kursuebersichten, Zertifikate und
Education-spezifische Kommunikation wird die Submarke `RelTest Education`
verwendet.

- Icon, Wortmarke und Unterzeile bilden eine feste Einheit.
- Aufbau und Abstaende werden nicht veraendert.
- Logo nicht verzerren, drehen, spiegeln, anschneiden, umfaerben oder mit
  Schatten, Verlaeufen oder Konturen versehen.
- Schutzraum: mindestens eine RELTEST-Wortmarkenhoehe auf jeder Seite.
- Im Schutzraum nur neutraler Hintergrund ohne Muster.
- Horizontal mit Unterzeile: mindestens 190 px Breite.
- Wort-Bild-Marke ohne Unterzeile: mindestens 170 px.
- Reine Wortmarke: mindestens 90 px.
- Icon: mindestens 35 px.

Im Basis-RE-Seminar rendert das Downstream-Repository Titel, Footer und Logo.
Diese Elemente werden nicht in die Content-SVGs dupliziert.

## Education-Farbsystem

### Primaerfarben

- Marineblau / Dachmarke: `#031334`
- Signalgruen / Education: `#00A754`
- Stahlcyan / Solutions: `#0C84B4`

Signalgruen ist der primaere Education-Akzent. Stahlcyan ist in
Education-Folien keine fuehrende Markenfarbe, sondern eine definierte
Diagrammfarbe.

### Education-Diagrammfarben

- Goldgelb: `#E9B400`
- Koralle: `#EC6244`
- Stahlcyan: `#0C84B4`
- Graphitblau: `#25495F`

Marineblau und Signalgruen duerfen in den Tokens definierten
80-/60-/40-/20-/10-Prozent-Abstufungen verwendet werden.

### Rollen

- Marineblau: Text, Hierarchie, Linien, dunkle Flaechen.
- Signalgruen: primaerer Education-Akzent, aktive Schritte, positive
  Hervorhebung und Markenanker.
- Goldgelb: Warnung oder zweite Diagrammreihe.
- Koralle: Fehler, Risiko oder negative Abweichung.
- Stahlcyan: zusaetzliche Datenreihe oder technische Vergleichsebene.
- Graphitblau: Sekundaertext, Achsen oder ruhige Datenreihe.

Farbe nie als einziges Unterscheidungsmerkmal verwenden.

## Typografie

### Oxanium

Primaerschrift fuer Headlines, Slogans und Auszeichnungen. Nicht fuer
Fliesstext.

- H1: Oxanium Bold/ExtraBold, 115 % Zeilenabstand.
- H2: Oxanium Medium/SemiBold, 115 % Zeilenabstand. In Seminarfolien ist
  SemiBold der Standard; Medium bleibt fuer dichte untergeordnete H2 zulaessig.
- Kurze H1 mit maximal 3 bis 4 Woertern beziehungsweise etwa 25 Zeichen duerfen
  in Versalien stehen.
- Versalien-H1 erhalten `0.03em` Laufweite.
- Laengere oder mehrzeilige Titel stehen in normaler Gross-/Kleinschreibung.

### Archivo

Sekundaerschrift fuer Fliesstext und inhaltliche Beschriftungen.

- H3 und Tabellenkoepfe: Archivo SemiBold, 115 % Zeilenabstand.
- Fliesstext: Archivo Regular, 135 % Zeilenabstand.
- Hervorhebung: Archivo SemiBold/Bold.
- Caption/Quelle: Archivo Regular Italic.

Fallback nur, wenn Einbettung technisch nicht moeglich ist:
`Archivo, Arial, Helvetica, sans-serif`.

Die projektlokalen Fontdateien und OFL-Lizenzen liegen unter:

```text
brand/fonts/oxanium/
brand/fonts/archivo/
```

## Satzregeln

- Standardmaessig linksbuendig.
- Blocksatz nur mit aktiver Silbentrennung.
- Zentrierung nur in begruendeten Sonderfaellen wie Zertifikaten.
- Standard-Laufweite fuer alle Texte ausser kurzer Versalien-H1.
- Als Aufzaehlungszeichen den Halbgeviertstrich verwenden.

## Layout Und Bildsprache

Die bestehenden RelTest-Lernregeln zu 16:9, grosszuegigen Raendern, klarer
Hierarchie, hochwertigen Piktogrammen, kontrollierten Pfeilen und
sprechertextgefuehrter Animation bleiben bestehen.

Neue und grundlegend ueberarbeitete Piktogramme verwenden das minimalistische
Profil `reltest-education-minimal-v1`. Verbindlich sind
`brand/reltest-education-pictogram-style-guide.md`,
`brand/reltest-education-pictogram-tokens.json` und
`workflow/30-visual-decision/pictogram-creation-workflow.md`. E-Learning-Eignung
bedeutet dabei insbesondere eindeutige Semantik, geringe Detail- und
Entschluesselungslast, Erkennbarkeit im 960x540-Playerzustand, mindestens 3:1
Nicht-Text-Kontrast, stabile Bedeutungszuordnung und atomare Animation mit dem
zugehoerigen Label oder Container.

Das Rebranding aendert Markenfarbe, Typografie und Benennung, nicht die
Downstream-Trennung: sichtbarer Folientitel, Footer, Logo und Szenenkennung
bleiben ausserhalb der Seminar-SVGs.

Die vorliegende 17-seitige Quelldatei enthaelt belastbare Detailseiten zu
Logosystem, Farbe und Typografie. Die im Inhaltsverzeichnis genannten Kapitel zu
Gestaltungselementen, Bildsprache und Layout sind in dieser PDF nicht enthalten.
Darum bleiben die bestehenden, bereits freigegebenen Seminarregeln fuer
Safe-Areas, Karten, Piktogramme, Pfeile und Animationsdramaturgie bestehen, bis
hierfuer eine weitere Corporate-Design-Quelle vorliegt.

## Technische Quellen

- Content-SVGs: `brand/company-brand-tokens.json`
- Vollfolien: `brand/reltest-education-slide-design-tokens.json`
- Qualitaetsregeln: `brand/design-quality-bar.md`
- Piktogramme: `brand/reltest-education-pictogram-tokens.json`
