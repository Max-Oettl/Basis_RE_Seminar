# RE3_TEST_1 Rejected Prototype Review

Datum: 2026-06-19

Status: `rejected_by_user`

## Grund

Die zuletzt generierten SVG-Vorschlaege wurden vom Nutzer abgelehnt. Die Ablehnung betrifft nicht einzelne Tippfehler, sondern den Arbeitsmodus.

## Festgestellte Prozessfehler

- Ausfallpunkte auf Zeitstrahlen wurden zu gleichmaessig gesetzt.
- Komponenten aus `components/svg-library/` wurden zu sehr als fertige Bausteine behandelt, statt sie an die konkrete Folie anzupassen.
- Die PowerPoint-Folien wurden zu stark als Nachbauvorlage verstanden, statt als Quelle fuer Inhalt und didaktische Aussage.
- Aufbaufolien wurden nicht konsequent zuerst zu Zielzustandsgruppen zusammengefasst.
- Zwischenfolien wurden teilweise gebaut, obwohl sie nur Animationszustaende darstellen.
- Cross-Check gegen gerenderte Folien hat Designfehler nicht frueh genug gestoppt.
- Es wurden zu viele SVGs auf einmal erzeugt, wodurch Kontext und Qualitaetspruefung verwischt sind.
- Vor der Umsetzung fehlte pro Arbeitseinheit ein explizites Konzept.
- Die Moeglichkeit, Folien didaktisch neu zu interpretieren statt sie nachzubauen, wurde nicht konsequent genutzt.

## Konsequenz

Vor einem neuen SVG-Bau muss `workflow/svg-rebuild-production-runbook.md` angewendet werden. Es muss zuerst ein Rebuild-Plan unter `analysis/rebuild-plans/` entstehen. Ohne Sequenzkarte, Zielzustand, Konzept, Design-Brief und Cross-Check darf kein neuer Generatorlauf als Ergebnis gemeldet werden.

Fuer die naechste Runde gilt:

- immer nur eine Folie oder Sequenzgruppe aktiv bearbeiten,
- vor SVG-Code ein Konzept formulieren,
- danach genau diese Einheit umsetzen,
- das Ergebnis rendern und sichtbar auf Fehler pruefen,
- gefundene Fehler an derselben Einheit beheben,
- erst danach die naechste Einheit beginnen.
