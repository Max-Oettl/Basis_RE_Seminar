# RE2 Kapitel 02 - Quality Failure Audit

Status: Workflow-Korrektur abgeschlossen, Folienkorrektur bewusst noch nicht
begonnen.

## Betroffene Szenen

RE2 Kapitel 2, Quellfolien 4 bis 19 beziehungsweise die daraus gebildeten
Zielszenen 4, 6, 8, 9, 10, 11, 13, 14, 16, 17, 18 und 19.

## Nutzerbeobachtung

- Kapitel 2 wirkt nicht wie das freigegebene Modul 1.
- Pfeile und Linien sind auf vielen Folien ueberdimensioniert.
- Heller Text in dunkelblauen Boxen ist nicht sichtbar.
- Konkrete Motive der PV-Anlage wurden durch generische Boxen oder primitive
  Linien ersetzt; benoetigte Bildassets fehlen.
- Folie 8 verdeckt beziehungsweise verliert zentrale Beschriftungen und fuegt mit
  `SYSTEMGRENZE` einen nicht belegten Begriff hinzu.
- Das Gesamtpaket ist visuell nicht arbeitsfaehig.

## Reproduzierte Ursachen

1. Falscher Referenzmodus:
   Der Produktionsplan verwendete die transparente Content-SVG-Familie aus RE2
   Kapitel 1 statt der vom Nutzer gemeinten fertigen RE1-Vollfolien.
2. CSS-Kaskadenfehler:
   Alle zwoelf Kapitel-2-Ziel-SVGs verwenden eine globale
   `text { fill: #062D46 }`-Regel. Sie ueberschreibt abweichende helle
   Presentation-Attribute; 60 als hell deklarierte Textknoten sind gefaehrdet.
3. Falsches Asset-Gate:
   Konkrete Motive wurden pauschal als `native_svg` eingestuft. In den
   Kapitel-2-Ziel-SVGs existiert kein `<image>` und in den Szenenordnern kein
   PNG-, JPG- oder WebP-Asset.
4. Unbelegte Zielergaenzung:
   Die Quelle von Folie 8 enthaelt kein `Systemgrenze`; der Neubau fuegt
   `SYSTEMGRENZE` dennoch als dominante Ebene ein.
5. Uebergewichtige Grafiksprache:
   Kapitel 2 verwendet Strichstaerken bis 9 px. 18 Deklarationen liegen bei
   mindestens 7 px; Modul 1 enthaelt in der Vergleichsmessung keine
   Strichstaerke oberhalb 6 px.
6. Fehlendes visuelles Zielgate:
   Es wurden 16 Quellenpreviews, aber keine Kapitel-2-Zielpreviews erzeugt.
   Automatische Strukturpruefungen mit `0 errors` wurden faelschlich als
   visuelle Freigabe behandelt.
7. Zu fruehe Serienproduktion:
   CSS-, Asset-, Linien- und Animationsmuster wurden auf mehrere Szenen
   uebertragen, bevor ein einzelner Archetyp als gerenderter statischer Pilot
   bestanden hatte.

## Reichweite

- `project_rule`: Designreferenz, statische Pilotfreigabe, Assetqualitaet,
  Quellen-Ziel-Referenzvergleich und maximale Verbinderstaerke.
- `domain_rule`: Animation erst nach statischer Freigabe; Beziehungen nie vor
  ihren Endpunkten.
- `qa_gap`: konflikttraechtige globale Textfuellung und Strichstaerken oberhalb
  der Brand-Obergrenze wurden nicht erkannt.

## Uebertragbare Regeln

- Ein Kapitelauftrag verwendet `module_redesign` und einen konkreten
  Referenz-Lock auf freigegebene Ziel-SVGs.
- Ein vom Nutzer benanntes Modul bestimmt den Artefaktmodus; Vollfolien werden
  nicht durch Content-SVGs ersetzt.
- Der statische Endzustand wird vor jeder Animation gerendert und freigegeben.
- Neue Fachbegriffe und Beziehungen brauchen einen Beleg.
- Konkrete Motive brauchen eine einzelne Assetentscheidung und eine
  Erkennbarkeitspruefung im Zielmassstab.
- Standardlinien verwenden 1,5 bis 4 px; 6 px ist ohne dokumentierte Ausnahme
  die Obergrenze.
- Ohne Zielpreview und Dreifachvergleich keine Fertigmeldung.

## Aktualisierte Schubladen

- `.agents/skills/redesign-reltest-slides/SKILL.md`
- `.agents/skills/redesign-reltest-slides/references/review-derived-design-rules.md`
- `AGENT.md`
- `workflow/00-router/context-loading-map.md`
- `workflow/30-visual-decision/svg-asset-decision-gate.md`
- `workflow/34-slide-redesign/slide-redesign-workflow.md`
- `workflow/34-slide-redesign/chapter-implementation-quality-contract.md`
- `workflow/50-animation/animation-decision-and-dramaturgy.md`
- `workflow/60-quality/rebuild-quality-gate.md`
- `templates/module-sequence-plan-template.md`
- `templates/slide-redesign-brief-template.md`
- `brand/company-brand-tokens.json`
- `brand/reltest-academy-slide-design-tokens.json`
- `tools/svg-qa/design-qa.js`
- `tools/svg-qa/design-qa.test.js`
- `tools/basis-rebuild-viewer/content-crosscheck-domain.js`
- `tools/basis-rebuild-viewer/content-crosscheck-domain.test.js`
- `tools/basis-rebuild-viewer/server.js`

## Verifikation

- Neue Unit-Tests erkennen globale Text-Fill-Kaskaden.
- Neue Unit-Tests erkennen Strichstaerken oberhalb 6 px.
- Neue Unit-Tests bestaetigen tokenkonforme 4-px-Verbinder ohne Fehlalarm.
- Neue Unit-Tests bestaetigen den separaten Full-Slide-Metadaten- und
  BrandFrame-Pfad.
- Der Content-Crosscheck prueft sichtbaren Zieltext nun auch gegen Quelle und
  zugeordneten Sprechertext. Dokumentierte Zielergaenzungen brauchen
  `data-source-evidence` und `data-source-reference`.
- Die Rueckpruefung auf der bestehenden Folie 8 erkennt `SYSTEMGRENZE` jetzt
  explizit als `target-text-not-source-supported`.
- Rueckpruefung gegen die bestehenden Kapitel-2-Dateien:
  12 `text-fill-cascade`-Fehler und 10 `stroke-weight`-Fehler werden nun als
  harte Strict-Design-Befunde erkannt.

## Noch Nicht Ausgefuehrt

Die beanstandeten Kapitel-2-Folien wurden in diesem Schritt nicht korrigiert,
ersetzt oder neu animiert. Das entspricht dem ausdruecklichen Auftrag, zuerst den
Workflow und die Qualitaetssicherung zu schaerfen.
