# RE1 Formel-Systemmigration – Audit 2026-08-06

## Ergebnis

- 39 eigenstaendige Formelassets in 16 Szenen migriert: 33, 36, 37, 41, 42, 43, 46, 52, 55, 60, 61, 62, 65, 68, 70 und 75.
- Alle mathematischen Glyphen liegen als STIX-Pfade vor; es gibt keine `<text>`- oder `<tspan>`-Elemente in den Formelassets.
- Alle Assets besitzen nominale Schriftgroessen- und Formel-QA-Metadaten.
- Formeln werden proportional nach nominaler Grundschrift eingebettet. Integrale, Brueche und einfache Relationen behalten dadurch dieselbe optische Groesse.
- Integralgrenzen, Exponenten, Indizes, Wurzeln und Bruchstriche werden als zusammenhaengender mathematischer Satz gerendert.
- Differentiale sind modulweit aufrecht gesetzt, einschliesslich `\mathrm{d}\tau` in der Lognormalverteilung.
- Die native Median-Schreibweise in Szene 70 wurde durch das kanonische Formelasset ersetzt.

## Ursache und dauerhafte Korrektur

- Beobachtung: Gemischte Browser-/Systemfonts, handgesetzte Integralteile und boxbezogene Skalierung erzeugten unterschiedliche Fettung, Abstaende und abgesetzte Integralgrenzen.
- Lokale Korrektur: alle betroffenen Formelassets neu erzeugt und alle 16 Szenen neu gerendert.
- Projektregel: `render_formula_svg.py` exportiert STIX-Glyphen als Pfade und hinterlegt die nominale Formelgroesse.
- Domainregel: `formulaAsset` skaliert nach nominaler Grundschrift statt nach der individuellen Bounding-Box-Hoehe.
- QA-Luecke geschlossen: `tools/generate-re1-formula-assets.py` deckt den kompletten RE1-Formelbestand ab und validiert die Inventarvollstaendigkeit.
- Reproduzierbarkeit: Die kanonischen Formeln fuer die Szenen 41–43 und 46 werden nun direkt vom Vollfoliengenerator in die Datendateien geschrieben; ein erneuter Modulaufbau kann sie nicht mehr zuruecksetzen.

## Verifikation

- Formelbestand: 39.
- Live-Text in Formelassets: 0.
- Fehlende nominale Formelmetadaten: 0.
- Fehlende Formel-QA-Metadaten: 0.
- SVG-/Layout-QA der 16 Formel-Szenen: 0 Fehler.
- Automatisierte SVG-QA-Tests: 24/24 bestanden.
- Content-Crosscheck der formelrelevanten Kapitel 40–77: 38/38 Szenen bestanden.
- Sichtpruefung: alle 16 Szenen bei 1920x1080 sowie als 480x270-Kontaktbogen kontrolliert.

## Artefakte

- Finale Einzelrender: `analysis/render-checks/RE1/formula-system-migration-2026-08-06/final/`
- Kontaktboegen: `analysis/render-checks/RE1/formula-system-migration-2026-08-06/final-contacts/`
- Automatischer SVG-Bericht: `analysis/render-checks/RE1/automated-svg-qa/svg-qa-report.md`

## Bekannte, nicht formelbezogene Bestandsbefunde

- Der vollstaendige Inhalts-Crosscheck meldet bereits bestehende Pflichttextabweichungen auf Szene 14 und Szene 30.
- Der strenge Designmodus bewertet eigenstaendige Plot- und Formelteilassets wie komplette 16:9-Folien und erzeugt dadurch erwartbare Metadaten-, Font- und ViewBox-Befunde. Die zusammengesetzten Ziel-SVGs wurden deshalb zusaetzlich separat mit Layout-QA und Sichtpruefung validiert.
