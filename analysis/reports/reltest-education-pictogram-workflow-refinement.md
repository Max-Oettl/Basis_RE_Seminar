# RelTest-Education-Piktogrammworkflow · Lernprotokoll

## Nutzerbeobachtung

Piktogramme sollen nicht nur technisch vorhanden, sondern minimalistisch,
Corporate-Identity-konform und nachweislich fuer ein E-Learning-Programm
geeignet sein. Der bisherige Workflow beschrieb diese Qualitaet nur allgemein.

## Reproduzierte Ursache

- Keine kanonische Formensprache fuer SVG- und Rasterpiktogramme.
- Keine stabile seminarweite Bedeutungsregistry.
- Generierte Rasterassets konnten als detaillierte 3D-Illustration oder mit
  Chromakey-/Hintergrundresten durch den allgemeinen PNG-Check gelangen.
- Die Beurteilung `bei kleiner Darstellung lesbar` besass keinen definierten
  Zielmassstab.
- Semantik, CI, Kleinmassstab und Zugaenglichkeit waren nicht als getrennte
  Stop-Gates dokumentiert.

## Reichweite

- Primaer: `project_rule`
- Sekundaer: `domain_rule` fuer Piktogrammerstellung
- Zusaetzlich: `qa_gap` fuer Rastertransparenz, Sicherheitsrand, Kontrast und
  dokumentierte Kleinmassstabtests

## Uebertragbare Regel

Neue oder grundlegend ueberarbeitete Piktogramme werden ausschliesslich als
generierte transparente PNG-Bildassets produziert und verwenden
`reltest-education-minimal-v1`: flache frontale beziehungsweise orthografische
2D-Geometrie, Marineblau als Grundmotiv, hoechstens eine weitere semantische
Markenfarbe, keine 3D-, Isometrie-, Verlaufs-, Schatten-, Glow-, Textur-, Emoji-
oder Stickeroptik.

E-Learning-Eignung verlangt:

- genau eine stabile primaere Bedeutung,
- Beschriftung oder eindeutigen Kontext bei der Einfuehrung,
- 48-px- und 960x540-Erkennbarkeit; 32 px fuer kompakte Universalicons,
- mindestens 3:1 Nicht-Text-Kontrast,
- Bedeutung nicht allein ueber Farbe,
- seminarweite Wiederverwendung derselben Motivzuordnung,
- atomare Animation mit Label beziehungsweise Container zum ersten relevanten
  Sprechertextbeat.

## Aktualisierte Schubladen

- `workflow/30-visual-decision/pictogram-creation-workflow.md`
- `brand/reltest-education-pictogram-style-guide.md`
- `brand/reltest-education-pictogram-tokens.json`
- `components/pictogram-library/pictogram-registry.json`
- `.agents/skills/redesign-reltest-slides/SKILL.md`
- Brand Guardian, PNG-Prompt-/Review-, SVG- und Produktionsagenten
- Asset-, Redesign-, Produktions- und Quality-Workflows
- `templates/pictogram-asset-brief-template.json`
- `tools/pictogram-qa.js`
- `tools/validate-pictogram-asset.js`

## Verifikation

- JSON-Token- und Registry-Parsing: bestanden.
- Library-/Registry-/Markup-/Kontrasttests: bestanden.
- Rasterbrief-/Alphakanal-/Sicherheitsrand-/Stiltests: bestanden.
- Education-Theme- und Design-QA-Regressionstests: bestanden.
- Gemeinsamer Node-Testlauf: 24 von 24 Tests bestanden.

Der allgemeine Python-`quick_validate` des Skill Creators war in dieser
Windows-Sitzung wegen einer nicht verfuegbaren Python-Anmeldesitzung nicht
ausfuehrbar. Frontmatter und Skill-Metadaten blieben strukturell unveraendert;
die projektspezifischen Node- und JSON-Pruefungen liefen vollstaendig.

Aeltere generierte Piktogramme werden nicht automatisch veraendert. Sie gelten
fuer neue Verwendungen als Legacy und muessen das neue Gate erneut bestehen.

## PNG-Pflicht aus Nutzerreview

Der erste Korrekturlauf fuer RE1 Szene 10 und Szene 12 setzte die vier Motive
faelschlich als native SVG-Piktogramme um. Nach dem Nutzerreview wurde diese
Formatentscheidung verworfen: `re1_costs`, `re1_product_liability`,
`re1_customer_dissatisfaction` und `re1_reliability_cost_balance` liegen nun als
eigenstaendig generierte, transparente PNG-Bildassets vor. Die Workflow-, Skill-,
Agenten- und QA-Regeln sperren SVG-konstruierte Piktogramme fuer alle neuen oder
veraenderten Szenen. Der reale Szenenkontext wurde in 1920 x 1080 und 960 x 540
geprueft.
