# RelTest Education Brand Handoff

## Quelle Und Vorrang

Verbindliche Quelle ist
`source-materials/brand/Reltest_Corporate_Design_zwischenstand_2026-08-02.pdf`.
`Corporate_Design_RELTEST_19.pdf` ist nur noch ein historischer Stand.

Bei Widerspruch gewinnt:

1. ausdruecklicher Nutzerauftrag,
2. Corporate-Design-PDF,
3. `brand/reltest-education-style-guide.md`,
4. Education-Tokenquelle,
5. alte Academy-Artefakte nur als Layoutreferenz ohne Markenautoritaet.

## Identitaet

- Aktive Submarke: `RelTest Education`
- Metadatenprofil: `reltest-education`
- Produktionsvariante: `education-production`
- Altbezeichnung: `RelTest Academy`

## Strategie Und Claim

- Werte: fundiert und faktenbasiert, praxisorientiert, befaehigend,
  verantwortungsbewusst, qualitaetsorientiert, unabhaengig und ehrlich.
- Persoenlichkeit: praezise, praxisorientiert, souveraen, partnerschaftlich und
  zukunftsweisend.
- Deutscher Education-Claim: `Wissen aufbauen, das Zuverlässigkeit verankert.`
- Englischer Education-Claim: `Building knowledge that anchors reliability.`
- Claim nie kuerzen, umformulieren oder ohne das zugehoerige Logo verwenden;
  deutsche Medien verwenden die deutsche Fassung.

## Farben

| Rolle | Farbe |
|---|---|
| Dachmarke, Text, Hierarchie | `#142452` |
| Dunkle Flaechen / Verlauf | `#031334` bis `#0D173D` |
| Education-Submarkenakzent | `#00A653` |
| Solutions-Submarkenakzent | `#2EA1CF` |
| Diagramm Goldgelb | `#E9B400` |
| Diagramm Koralle | `#EC6244` |
| Diagramm Stahlcyan | `#0C84B4` |
| Diagramm Graphitblau | `#25495F` |

In Education-Medien kennzeichnet Signalgruen die Submarke. Fuer Lerninhalte
dominiert Marineblau; Signalgruen und die Diagrammfarben werden sparsam und
semantisch eingesetzt. Gleichrangige Karten rotieren nicht durch mehrere Farben,
sondern nutzen Marineblau in unterschiedlichen Tonwerten oder Deckkraftstufen.

## Typografie

| Rolle | Schrift | Schnitt | Zeilenabstand |
|---|---|---|---|
| H1 | Oxanium | Bold/ExtraBold | 115 % |
| H2 | Oxanium | Medium/SemiBold | 115 % |
| H3 | Archivo | SemiBold | 115 % |
| Fliesstext | Archivo | Regular | 135 % |
| Hervorhebung | Archivo | SemiBold/Bold | passend zum Absatz |
| Caption/Quelle | Archivo | Regular Italic | passend zur Caption |

Kurze H1 bis etwa 3 bis 4 Woertern oder 25 Zeichen duerfen in Versalien mit
`0.03em` Laufweite stehen. Laengere Titel verwenden Gross-/Kleinschreibung.

Fontstacks:

```css
.display { font-family: "Oxanium", "Archivo", Arial, sans-serif; }
.body { font-family: "Archivo", Arial, Helvetica, sans-serif; }
```

In Seminarfolien ist SemiBold der H2-Standard; Medium bleibt fuer dichte
untergeordnete H2 zulaessig.

## Logo

Education-spezifische Anwendungen verwenden das offizielle
`RelTest Education`-Logo. Nicht rekonstruieren, umfaerben, verzerren, drehen,
anschneiden oder mit Effekten versehen. Schutzraum von einer
RELTEST-Wortmarkenhoehe einhalten.

Im Basis-RE-Seminar rendert das Downstream-Repository Logo, Titel, Footer und
Szenenkennung. Diese Elemente bleiben ausserhalb der SVGs.

## Technische Quellen

- Content-SVG: `brand/company-brand-tokens.json`
- Vollfolie: `brand/reltest-education-slide-design-tokens.json`
- Fonts: `brand/fonts/`
- Brand Guardian: `agents/brand-guardian.md`

## Gestaltungsformen Und Bildsprache

- 45-Grad-Schraegen greifen die Geometrie des Logo-Icons auf.
- Karten, Buttons, Nummern und Icons verwenden bei Bedarf eine gerundete Ecke
  oben links und eine abgeschraegte Ecke unten rechts.
- Keine Schatten oder dekorativen Effekte.
- Grossformatige dunkle Flaechen mit wenig Text duerfen ein dezentes
  Logo-Icon-Pattern bei 10 Prozent Deckkraft tragen.
- Fotos zeigen reale Arbeit in Labor, Entwicklung und Projekt; kuehl, gedeckt,
  dokumentarisch und unaufgeregt statt gelblich oder gestellt.
- Ein Foto-Overlay ist sanft marineblau und verlaeuft von unten links nach oben
  rechts.

## Seminar-Spezifizierung

Die CI zeigt farbige Textkaesten als moegliches Gliederungsmittel. Fuer das
Basis-RE-Seminar gilt dazu die ausdrueckliche Nutzerpraeferenz vom 12. August
2026: Marineblau ist die ruhige Grundfarbe. Gleichrangige Infoboxen werden nicht
gelb, blau und gruen rotiert. Akzentfarben markieren nur belegte Semantik oder
einen einzelnen wichtigen Fokus und bleiben flaechenmaessig untergeordnet.

Die bereits freigegebenen Seminarregeln fuer Safe-Areas, Karten, Piktogramme,
Pfeile, Animation und Downstream-Mastertrennung bleiben bestehen.
