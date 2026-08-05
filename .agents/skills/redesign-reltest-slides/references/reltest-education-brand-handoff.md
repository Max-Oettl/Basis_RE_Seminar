# RelTest Education Brand Handoff

## Quelle Und Vorrang

Verbindliche Quelle ist
`source-materials/brand/Corporate_Design_RELTEST_19.pdf`.

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

## Farben

| Rolle | Farbe |
|---|---|
| Dachmarke, Text, Hierarchie | `#031334` |
| Primaerer Education-Akzent | `#00A754` |
| Diagramm Goldgelb | `#E9B400` |
| Diagramm Koralle | `#EC6244` |
| Diagramm Stahlcyan | `#0C84B4` |
| Diagramm Graphitblau | `#25495F` |

Stahlcyan ist nicht der primaere Education-Akzent.

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

## Grenzen Der Vorliegenden Quelle

Die gelieferte PDF umfasst 17 Seiten und endet nach den Typografie- und
Satzregeln. Die im Inhaltsverzeichnis angekuendigten Detailkapitel zu
Gestaltungselementen, Bildsprache und Layoutraster sind darin nicht enthalten.
Die bereits freigegebenen Seminarregeln fuer Safe-Areas, Karten, Piktogramme,
Pfeile und Animation bleiben deshalb bestehen und werden mit Education-Farbe und
-Typografie umgesetzt.
