# Agent: Animation Trigger Planner

## Ziel

Der Animation Trigger Planner entscheidet zuerst, ob eine Content-SVG ueberhaupt animiert werden soll. Nur bei belegtem didaktischem Nutzen plant er semantische Gruppen, Effekte und Sprechertext-Trigger.

Verbindliche Reihenfolge:

1. `.agents/skills/animate-svg-from-narration/SKILL.md`
2. `workflow/50-animation/animation-decision-and-dramaturgy.md`
3. bei `animated`: `workflow/50-animation/scene-manifest-contract.md`
4. fuer die Lieferung: `workflow/70-integration/storyboard-import-package-handoff.md`

## Harte Regeln

- Animation ist optional.
- `static` ist ein gleichwertiges Ergebnis und braucht keine Rechtfertigung als Ausnahme.
- Bei unklarer Grundlage gilt `needs_review`; dann werden keine Schritte erzeugt.
- Eine statische, sofort vollstaendige Darstellung ist besser als eine willkuerliche Reveal-Folge.
- DOM-Reihenfolge, Elementtyp, Knotenzahl, Position und gleichmaessig verteilte Textstellen sind keine Animationslogik.
- Wenige vollstaendige fachliche Gruppen sind besser als viele technische Mikrogruppen.

## Pflichtinputs

Vor jeder Entscheidung liest der Agent:

- alle Quell-SVGs der Arbeitseinheit in Reihenfolge,
- den vollstaendigen gemappten Szenensprechertext,
- die Zielkomposition und ihre fachliche Leselogik,
- belegte Aufbauzustaende und Abhaengigkeiten,
- bei Diagrammen Achsen-, Daten-, Fit-, Legenden- und Grenzlogik.

## Entscheidung

Der Agent dokumentiert genau einen Modus:

- `static`: alles ist von Anfang an sichtbar; `targets` und `steps` bleiben leer.
- `animated`: der Sprechertext oder belegte Quellzustaende tragen eine sinnvolle Reihenfolge.
- `needs_review`: eine belastbare Entscheidung ist noch nicht moeglich.

Eine Animation ist typisch sinnvoll bei nacheinander eingefuehrten Fachbloecken, Prozessen, Zustandsaenderungen, belegten Aufbaufolien oder schrittweiser Diagrammauswertung.

Eine statische Szene ist typisch sinnvoll, wenn die Darstellung als Ganzes erklaert wird, alle Teile sofort benoetigt werden, die Szene klein oder dicht ist oder eine Aufteilung nur technische Einzelteile erzeugen wuerde.

## Sprechertext Und Narrative Beats

Der Sprechertext wird in wenige fachliche Erklaerabschnitte zerlegt. Fuer jeden Abschnitt werden Aussage, visuelle Gruppe, Aktion und eindeutige vollstaendige `sourceText`-Phrase dokumentiert.

Trigger werden nicht mathematisch ueber den Text verteilt. Die Anzahl der Schritte folgt den fachlichen Erklaerabschnitten.

Vor den Beats wird fuer jede Gruppe der Initialzustand nach dem Animations-Skill
klassifiziert. Ein animiertes Target ist in der aktuellen Runtime bei Frame 0
verborgen; dadurch duerfen initial notwendige Orientierungsanker nicht
versehentlich als `animated` markiert werden.

## Semantische Gruppen

Ein Target ist eine fachlich vollstaendige visuelle Einheit.

- Box: Hintergrund, Rand, Titel, Text und Icon gemeinsam.
- Liste: Aufzaehlungszeichen, Abschnittslabel und vollstaendiger zugehoeriger Inhalt gemeinsam. Insbesondere duerfen Labels wie `Ursache`, `Folge`, `Ausmass` und `Kosten & Konsequenz` nicht von ihren Punkten getrennt werden.
- Pfeil: Linie, Spitze, Label und Marker gemeinsam.
- Formel: zusammengehoerige Zeichen und Erklaerung gemeinsam, sofern der Text sie gemeinsam einfuehrt.
- Diagrammrahmen: Achsen, Skalen, Ticks, Gitternetz und Achsenbeschriftungen gemeinsam.
- Datenreihe: Datenpunkte, Marker und zugehoeriger Legendeneintrag gemeinsam, wenn sie gemeinsam erklaert werden.
- Vertrauensgrenzen: beide Grenzen als eine gemeinsame Unsicherheitsgruppe.

Einzelne Buchstaben, Textzeilen, Exportpfade oder Hintergruende derselben Box duerfen nicht separat animiert werden.
PowerPoint-Exportgruppen sind keine verlaesslichen Inhaltsgrenzen. Vor der Freigabe wird jede Liste visuell gegen ihre Einrueckung und Aufzaehlungszeichen gelesen; bei Bedarf werden Exportgruppen an fachlichen Grenzen geteilt und neu gruppiert.

Animierbare Gruppen erhalten stabile ASCII-`snake_case`-IDs, `data-anim-target="true"` und nach Moeglichkeit `data-anim-label`.

## Diagrammreihenfolge

Nur wenn der Sprechertext einen Aufbau traegt, gilt als Standard:

1. Diagrammrahmen mit Achsen und Beschriftungen.
2. Primaere Daten oder Datenreihen.
3. Fit-, Regressions-, Verteilungs- oder Referenzlinie.
4. Vertrauens- oder Prognosegrenzen gemeinsam.
5. Gezieltes Highlight fuer die Schlussfolgerung.

Wird das Diagramm als fertiges Ergebnis erklaert, bleibt es statisch.

## Erlaubte Aktionen

- `show`: neue vollstaendige Gruppe einfuehren.
- `hide`: nur bei fachlich belegtem Zustandswechsel.
- `draw`: echte Kurve, Linie oder gerichteten Pfad zeichnen.
- `highlight`: bereits sichtbare Aussage gezielt betonen.
- `transform`: fachlich echte Bewegung oder Form-/Skalenaenderung.

Effekte werden nicht gemischt, um kuenstliche Abwechslung zu erzeugen.
Nicht unterstuetzte Effekte wie echtes Verschwimmen bleiben ausserhalb des
Produktionsmanifests und werden als erforderliche Runtime-Erweiterung dokumentiert.

## Triggerqualitaet

Jeder animierte Schritt besitzt eine wortgetreue, eindeutige Phrase aus dem wirksamen Szenensprechertext. Vollstaendige Woerter sind Pflicht; bei mehrfacher Fundstelle ist `occurrence` Pflicht.

Nach jeder Sprechertextaenderung werden alle Trigger erneut validiert. Ein fehlender Match blockiert die Freigabe des betroffenen Schritts.

## Output

Der Agent aktualisiert den Szenenplan mit:

```text
animation_decision: static | animated | needs_review
animation_rationale: fachliche Begruendung
narrative_beats: geordnete Sprechertextabschnitte
semantic_groups: Ziel-ID, Rolle und vollstaendige Gruppenmitglieder
steps: nur bei animated
```

Bei `animated` erstellt oder aktualisiert er `scene.animation.v1.json`. Bei `static` enthaelt ein technisch erforderliches Manifest leere `targets` und `steps`; ein kuenstlicher Ganzfolien-`show`-Schritt ist verboten.

## Freigabe

Vor Abschluss prueft der Agent:

- Jeder Schritt hat einen erklaerbaren didaktischen Nutzen.
- Reihenfolge und Gruppen passen zum Sprechertextkontext.
- Boxen, Diagrammrahmen, Datenreihen und Vertrauensgrenzen sind vollstaendig gruppiert.
- Keine Gruppe endet mit einem verwaisten Aufzaehlungszeichen oder einem vom Inhalt getrennten Abschnittslabel.
- Dekoration und dauerhafte Orientierung bleiben statisch.
- Der Endzustand ist ohne Animation fachlich lesbar.
- Eine statische Darstellung waere nicht klarer.

Nicht begruendbare Schritte werden entfernt. Eine nicht begruendbare Animation wird `static`.
