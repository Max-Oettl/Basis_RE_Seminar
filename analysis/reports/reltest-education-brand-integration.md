# RelTest Education Brand Integration

Status: technisch verankert und automatisiert geprueft  
Quelle: `source-materials/brand/Corporate_Design_RELTEST_19.pdf`  
SHA-256: `1D426A32DE50B44E856A1F0F2713DC2C2588B5B0EB2025032FB4CC15D414FC0B`

## Uebernommene Identitaet

- Aktive Submarke: `RelTest Education`
- Aktives Metadatenprofil: `reltest-education`
- Primaerfarbe Dachmarke: Marineblau `#031334`
- Primaerer Education-Akzent: Signalgruen `#00A754`
- Education-Diagrammfarben:
  - Goldgelb `#E9B400`
  - Koralle `#EC6244`
  - Stahlcyan `#0C84B4`
  - Graphitblau `#25495F`
- Displaytypografie: Oxanium
- Inhaltstypografie: Archivo
- Altbezeichnung: `RelTest Academy`

## Verbindliche Produktionsquellen

- `agents/brand-guardian.md`
- `brand/reltest-education-style-guide.md`
- `brand/company-brand-tokens.json`
- `brand/reltest-education-slide-design-tokens.json`
- `.agents/skills/redesign-reltest-slides/references/reltest-education-brand-handoff.md`
- `tools/reltest-education-theme.js`

Der alte Academy-Style-Guide und die alten Full-Slide-Tokens bleiben nur als
explizit veraltete Kompatibilitaetsweiterleitung bestehen.

## Fonts

Projektlokal gebuendelt:

- `brand/fonts/oxanium/Oxanium-wght.ttf`
- `brand/fonts/archivo/Archivo-wdth-wght.ttf`
- `brand/fonts/archivo/Archivo-Italic-wdth-wght.ttf`

Die OFL-1.1-Lizenzen liegen in den jeweiligen Familienordnern. Python-Plots
registrieren die lokalen Fonts. SVG-Generatoren schreiben Oxanium/Archivo als
fuehrende Fontfamilie; der Zielrenderer muss die gebuendelten Dateien
registrieren oder installiert haben.

## Workflow-Sperren

Neue oder grundlegend ueberarbeitete Szenen werden nicht freigegeben bei:

- `reltest-academy` statt `reltest-education`,
- sichtbarem `RelTest Academy`,
- Solutions-Cyan als primaerem Education-Akzent,
- Sora, Inter, Segoe UI oder Arial als fuehrender Markenschrift,
- fehlendem Archivo-Stack fuer Inhaltstext,
- frei rekonstruiertem, umgefaerbtem oder verzerrtem Logo,
- dupliziertem Downstream-Chrome in Seminar-SVGs.

Bewusste Sonderfonts, zum Beispiel fuer mathematische Notation, benoetigen
`data-qa-font-exception="allowed"` und einen konkreten `data-qa-reason`.

## Technische Validierung

Ausgefuehrt:

```text
node --test tools/svg-qa/education-brand-assets.test.js
            tools/svg-qa/design-qa.test.js
            tools/svg-qa/handoff-package-qa.test.js
```

Ergebnis: 17 Tests bestanden, 0 fehlgeschlagen.

Zusaetzlich:

- Node-Syntaxpruefung der aktiven Education-Theme- und RE1/RE2-Generatoren:
  bestanden.
- Python-AST-Syntaxpruefung des aktualisierten RE3-Generators und Plot-Styles:
  bestanden.
- Strikter Check des Storyboard-Importpaket-Templates:
  0 Fehler, 0 Warnungen.
- TTF-Signaturen und Dateigroessen:
  gueltig.

## Migrationsgrenze

Die Aenderung migriert nicht automatisch alle bereits freigegebenen RE1-/RE2-
SVGs. Bestehende Artefakte bleiben reproduzierbare Altstaende, bis sie bewusst
neu gerendert oder rebrandet werden. Jede neue beziehungsweise grundlegend
ueberarbeitete Ausgabe durchlaeuft dagegen sofort die Education-Regeln.

Ein freigegebenes eigenstaendiges Original-Asset des `RelTest Education`-Logos
liegt noch nicht im Repository. Das Logo wird deshalb weder aus der PDF
rekonstruiert noch in Seminar-SVGs eingebaut; im aktuellen Handoff ist das
Downstream-Repository weiterhin der Chrome-Eigentuemer.
