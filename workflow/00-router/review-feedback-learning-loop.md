# Review Feedback Learning Loop

Diese Datei macht Nutzerfeedback zu dauerhaftem Projektwissen. Sie gilt fuer jede Korrektur an Analyse, Szene, SVG, Plot, Formel, Timeline, Asset, Animation, Viewer oder QA.

## Ziel

Eine Review-Anmerkung wird nicht nur lokal behoben. Nach der Korrektur wird entschieden, ob daraus eine wiederverwendbare Regel, eine Fachworkflow-Ergaenzung oder ein neuer deterministischer Check entsteht. Gleichzeitig darf eine einmalige Geschmacks- oder Geometrieentscheidung nicht ungeprueft zur Universalregel werden.

Viewer-Notizen sind allgemeine Aenderungsauftraege an die aktuelle Ziel-SVG. Sie koennen sich auf Inhalt, Gestaltung, Darstellung, Animation oder den Quellabgleich beziehen. Eine nichtleere Notiz ist deshalb kein neutraler Kommentar: Wird sie im Status `open` gespeichert, setzt der Viewer den Status automatisch auf `needs_revision` (`Korrektur`).

## Pflichtinputs

Vor einer Korrektur laden:

1. die konkrete Nutzeranmerkung oder Viewer-Notiz,
2. aktuelle Zielszene und alle zugeordneten Quell-SVGs,
3. wirksamen Sprechertext und Animationsmanifest,
4. vorhandenen Szenenbrief und Sequenzplan,
5. den neuesten modulbezogenen Audit unter `analysis/rebuild-plans/`, falls vorhanden,
6. den fuer den Befund zustaendigen Fachworkflow.

Bei einem Redesign zusaetzlich `.agents/skills/redesign-reltest-slides/references/review-derived-design-rules.md` laden.

## 1. Befund Reproduzieren

- Die beanstandete Szene im Endzustand rendern und neben der Quelle betrachten.
- Bei Animationen auch den Zustand direkt vor und nach dem betroffenen Trigger pruefen.
- Die Szene sowohl in Zielaufloesung als auch in einer realistischen verkleinerten Viewer-Ansicht beurteilen.
- Automatische QA nicht als Beweis fuer gestalterische Qualitaet behandeln. Ein Nutzerbefund kann trotz `0 errors` gueltig sein.
- Erst nach sichtbarer Reproduktion die Ursache benennen.

## 2. Befund Klassifizieren

Jeder Befund erhaelt genau eine Primaerkategorie und bei Bedarf Sekundaerkategorien:

| Kategorie | Zustaendige Schublade |
| --- | --- |
| Inhalt, Begriffe, Werte, Quellbezug | `10-source-analysis`, Szenenplan, Content-Crosscheck |
| Sequenz, Zusammenfassung, Sprecherlogik | `20-scene-planning` |
| Asset-Typ, Foto, Zeichnung, Piktogramm | `30-visual-decision` |
| Plot, Achse, Kurve, Marker, Pfeil | `31-python-plots` |
| Formel | `32-formulas` |
| Timeline oder Ausfallzeitachse | `33-timelines` |
| Layout, Typografie, Hierarchie, Redesign | `34-slide-redesign` |
| SVG-Struktur oder Einbettung | `40-svg-production` |
| Reveal, Reihenfolge, Gruppierung, Trigger | `50-animation` |
| nicht erkannter oder falsch bewerteter Defekt | `60-quality` und gegebenenfalls QA-Code |
| Viewer-Funktion oder Reviewhistorie | Viewer-Code und Viewer-Workflow |

## 3. Reichweite Entscheiden

Den Befund als eine dieser Reichweiten dokumentieren:

- `local_fix`: einmalige Geometrie-, Daten- oder Szenenentscheidung.
- `module_pattern`: fuer dieselbe Sequenz oder dasselbe wiederkehrende Komponentenmodell relevant.
- `project_rule`: ausdrueckliche seminarweite Nutzerpraeferenz oder allgemein wiederkehrender Fehler.
- `domain_rule`: fachlich spezifische Regel fuer Plot, Formel, Timeline, Animation oder Asset.
- `qa_gap`: ein objektiv pruefbarer Fehler wurde von der vorhandenen QA nicht erkannt.

Promotionsregeln:

- Eine ausdruecklich seminarweite Nutzerentscheidung wird sofort `project_rule`.
- Eine wiederholte Fehlerklasse wird spaetestens beim zweiten Auftreten als `project_rule` oder `domain_rule` festgehalten.
- Ein einmaliger Geschmackshinweis bleibt `local_fix`, solange keine uebertragbare Begruendung vorliegt.
- Eine fachliche Spezialregel gehoert in den Fachworkflow und nicht als lange Ausnahme in den Redesign-Skill.
- Ein maschinell eindeutig feststellbarer Fehler soll nach Moeglichkeit einen QA-Check erhalten; subjektive Gestaltqualitaet bleibt visueller Reviewpunkt.

## 4. Korrigieren

Strikt eine Szene oder Sequenzgruppe gleichzeitig bearbeiten:

1. lokale Ursache beheben,
2. Generator beziehungsweise zentrale Komponente statt nur das erzeugte SVG korrigieren,
3. Zielszene neu erzeugen,
4. Endzustand und betroffene Animationszustaende rendern,
5. Content-Crosscheck und passende technische QA erneut ausfuehren,
6. echte Befunde derselben Szene beheben und erneut pruefen.

## 5. Wissen Rueckfuehren

Nach erfolgreicher Korrektur:

1. Im modulbezogenen Audit festhalten: Beobachtung, Ursache, Korrektur, Reichweite und Verifikation.
2. Bei `module_pattern` die gemeinsame Komponente oder den Sequenzplan aktualisieren.
3. Bei `project_rule` den kanonischen Workflow aktualisieren und im Skill nur einen kompakten Lade- oder Entscheidungsverweis ergaenzen.
4. Bei `domain_rule` den zustaendigen Fachworkflow aktualisieren.
5. Bei `qa_gap` den Quality-Workflow und, wenn deterministisch moeglich, den QA-Code samt Testfall erweitern.
6. Widersprechende oder ueberholte Regeln entfernen oder klar einschraenken; keine zweite konkurrierende Wahrheit anlegen.

## Lernprotokoll

Der Audit-Eintrag enthaelt mindestens:

```text
Szene(n):
Nutzerbeobachtung:
Reproduzierte Ursache:
Lokale Korrektur:
Reichweite: local_fix | module_pattern | project_rule | domain_rule | qa_gap
Uebertragbare Regel:
Aktualisierte Schubladen:
Verifikation:
```

## Preflight Fuer Neue Inhalte

Vor dem naechsten Redesign oder Neuaufbau:

1. aktuellen Skill und Fachworkflow laden,
2. neuesten Modul-Audit gezielt nach den betroffenen Archetypen und Fehlerklassen durchsuchen,
3. offene und frueher geloeste Viewer-Notizen der aktiven Szenen pruefen,
4. uebertragbare Regeln in Szenenbrief und QA-Schwerpunkte aufnehmen,
5. erst danach gestalten.

Alte Folien werden nicht blind kopiert. Wiederverwendet werden die belegten Regeln, Komponenten und fachlich erfolgreichen Muster.

## Abschlussgate

Feedback ist erst abgeschlossen, wenn:

- die lokale Szene sichtbar korrigiert ist,
- Quelle, Sprechertext und Animation weiterhin zusammenpassen,
- Re-QA nach der letzten Aenderung gelaufen ist,
- der Audit aktualisiert wurde,
- die Reichweite entschieden wurde,
- eine uebertragbare Erkenntnis in der richtigen Schublade liegt oder bewusst als lokal dokumentiert ist.
