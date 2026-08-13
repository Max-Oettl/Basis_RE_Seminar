# Projektweites Brand-Feedback - 2026-08-12

## Quelle

- Neue CI: `source-materials/brand/Reltest_Corporate_Design_zwischenstand_2026-08-02.pdf`
- SHA-256: `5DFB735BBAAA918ADA4D289F9C70FD157B268D3FC13DAC8FB2B185311B241988`
- Nutzerfeedback: Folien wirken durch den parallelen Einsatz von Gelb, Blau und
  Gruen zu unruhig. Marineblau soll fuehren; Abstufungen sollen bevorzugt ueber
  Transparenz erfolgen. Andere Farben nur sparsam und bewusst einsetzen.

## Lernprotokoll

Szene(n): projektweit, alle neuen und grundlegend ueberarbeiteten Seminarfolien

Nutzerbeobachtung: Gleichrangige Infoboxen wurden teilweise in verschiedenen
Buntfarben gestaltet. Das erzeugt zu viele konkurrierende Signale.

Reproduzierte Ursache: Die bisherigen Regeln bezeichneten Signalgruen als
primaeren Education-Akzent, trennten Submarkenkennung und fuehrende
Inhaltsfarbe jedoch nicht deutlich genug. Generatoren mappten die generische
Rolle `accent` direkt auf Gruen; Diagrammfarben standen auch fuer normale
Infoboxen zu leicht zur Verfuegung.

Lokale Korrektur: Keine einzelne Szene in diesem Auftrag geaendert. Die
kanonischen Marken-, Token-, Generator-, Brief- und QA-Quellen wurden fuer alle
kommenden Produktionen aktualisiert.

Reichweite: `project_rule`

Uebertragbare Regel: Marineblau `#142452` traegt die visuelle Grundordnung.
Gleichrangige Infoboxen nutzen dieselbe marineblaue Farbfamilie mit Tonwert- oder
Deckkraftstufen. Signalgruen `#00A653` bleibt Education-/Semantikakzent. Gold,
Koralle und Stahlcyan werden nur mit konkreter Diagramm- oder Statusbedeutung
eingesetzt. Ausserhalb echter Diagramme gilt standardmaessig hoechstens eine
satte Akzentfarbfamilie pro Folie.

Aktualisierte Schubladen:

- `AGENT.md`
- `brand/reltest-education-style-guide.md`
- `brand/company-brand-tokens.json`
- `brand/reltest-education-slide-design-tokens.json`
- `brand/reltest-education-pictogram-*`
- `.agents/skills/redesign-reltest-slides/`
- `workflow/34-slide-redesign/slide-redesign-workflow.md`
- `workflow/60-quality/rebuild-quality-gate.md`
- zentrale Templates, Theme-Aufloesung und Brand-QA-Tests

Verifikation:

- aktive JSON-Token- und Template-Dateien erfolgreich geparst
- Theme-Aufloesung bestaetigt: `accent=#142452`,
  `educationAccent=#00A653`, `deep=#031334`
- 28 relevante Node-Tests bestanden
- gezielter `git diff --check` ohne Whitespace-Befund

## Weitere CI-Aktualisierungen

- Primaeres Marineblau: `#142452`; tiefes Marineblau fuer dunkle Flaechen:
  `#031334`; dunkles Verlaufsende: `#0D173D`.
- Education-Gruen laut neuem Zwischenstand: `#00A653`.
- Solutions-Stahlcyan als Submarkenfarbe: `#2EA1CF`; das bestehende
  Diagramm-Stahlcyan `#0C84B4` bleibt eine eigene Diagrammrolle.
- Gestaltungsformen koennen die 45-Grad-Schraege sowie die Kombination aus
  gerundeter Ecke oben links und abgeschraegter Ecke unten rechts aufnehmen.
- Keine Schatten oder dekorativen Effekte.
- Bildsprache: reale Arbeitssituationen, kuehl, gedeckt, dokumentarisch und
  unaufgeregt; optional sanfter marineblauer Verlauf von unten links nach oben
  rechts.

## Transparente Content-SVGs (Feedback vom 13. August 2026)

Szene(n): gesamtes Modul RE2

Nutzerbeobachtung: Die Szenen enthielten ungewollt vollflaechige helle
Brandhintergruende. Gewuenscht sind ausschliesslich die fachlichen Elemente.

Reproduzierte Ursache: Die RE2-Generatoren deklarierten die Ergebnisse als
`full-slide` und schrieben einen Verlauf sowie ein technisches Raster direkt in
jedes SVG.

Lokale Korrektur: Die vollflaechigen Hintergrundrechtecke und ihre ungenutzten
Definitionen wurden aus allen RE2-Szenen entfernt. Artefakt- und
Einbettungsmetadaten wurden auf transparentes `content-svg` umgestellt; die
RE2-Generatoren erzeugen den Hintergrund nicht mehr.

Reichweite: `project_rule | qa_gap`

Uebertragbare Regel: Content-SVGs enthalten niemals einen globalen
Folienhintergrund. Das gilt auch fuer weisse oder nahezu weisse Verlaeufe,
technische Raster und eine Gruppe `brand_background`. Der Folienmaster besitzt
den Hintergrund; das SVG enthaelt nur die fachlichen Elemente.

Aktualisierte Schubladen: RE2-SVGs, RE2-Generatoren,
`review-derived-design-rules.md`, deterministischer RE2-Transparenztest.

Verifikation: 160/160 RE2-Szenen sind XML-valide und als transparentes
`content-svg` deklariert; 0 Vorkommen von `brand_background`,
`backgroundGradient` oder `technicalGrid`; 2/2 Transparenztests bestanden;
regulaere Modul-QA: 0 Fehler. Die strengere Design-QA meldet weiterhin 232
bereits bestehende, von dieser Hintergrundkorrektur unabhaengige Designbefunde.
