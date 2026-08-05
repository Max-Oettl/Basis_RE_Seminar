---
name: animate-svg-from-narration
description: Plan, implement, and review narration-synchronized animation for SVG learning scenes. Use when Codex must decide the initial visual state, map spoken text to reveal moments, form semantic animation groups, choose restrained effects, build or repair an SVG animation manifest, or diagnose illogical animation order such as connectors appearing before their endpoints.
---

# Animate SVG From Narration

## Ziel

Aus einem vollstaendigen SVG-Endzustand und dem wirksamen Sprechertext eine ruhige,
logische und technisch ausfuehrbare Animationsdramaturgie entwickeln. Der Skill
entscheidet bewusst:

1. was bei Szenenbeginn sichtbar ist,
2. wann neue Information erscheint,
3. welche SVG-Bestandteile gemeinsam eine wahrgenommene Einheit bilden,
4. welcher Effekt die fachliche Aussage am besten unterstuetzt.

Animation ist optional. `static` ist ein vollwertiges Ergebnis.

## Pflichtinputs

Vor jeder Animationsentscheidung gemeinsam lesen oder anzeigen:

- den vollstaendigen Sprechertext der Szene,
- das Ziel-SVG im vollstaendigen statischen Endzustand,
- alle Quell-SVGs oder belegten Aufbauzustaende der Szene,
- die Zielruntime und ihren Manifestvertrag,
- vorhandene Review-Notizen zur Animationsreihenfolge.

Fehlt der vollstaendige Sprechertext oder ist die SVG-Text-Zuordnung unsicher,
`needs_review` setzen und keine Trigger erfinden.

Im Basis-RE-Seminar zusaetzlich lesen:

1. `AGENT.md`
2. `workflow/50-animation/animation-decision-and-dramaturgy.md`
3. `workflow/50-animation/scene-manifest-contract.md`
4. `workflow/70-integration/storyboard-import-package-handoff.md`, falls exportiert wird

## Verbindlicher Ablauf

### 1. Statischen Endzustand Freigeben

Animation erst umsetzen, nachdem der vollstaendige Endzustand fachlich, visuell
und technisch bestanden hat. Animation darf keine fehlende Hierarchie oder
schwaches Layout kaschieren.

### 2. Runtime-Profil Festhalten

Vor der Effektwahl dokumentieren:

- unterstuetzte Aktionen und Parameter,
- wie animierte Targets im ersten Frame behandelt werden,
- ob der Reviewer dieselben Effekte wie das Zielsystem rendert,
- welche gewuenschten Effekte eine Runtime-Erweiterung brauchen.

Fuer die aktuelle Basis-RE-Runtime gilt:

- Aktionen: `show`, `hide`, `highlight`, `draw`, `transform`.
- Jedes Target mit Status `animated` ist am Anfang unsichtbar.
- `show` und `hide` werden im internen Reviewer als reine Deckkraftanimation gezeigt.
- `draw` wird im internen Reviewer als gerichtete Clip-Enthuellung gezeigt.
- `highlight` wird im internen Reviewer als kurzer Puls mit Schlagschatten gezeigt.
- `transform` unterstuetzt Verschiebung und Skalierung.
- Ein echtes Verschwimmen oder Weichzeichnen ist nicht unterstuetzt.
- Ein bei Frame 0 sichtbares Target kann in der aktuellen Runtime nicht spaeter
  direkt `highlight` oder `transform` erhalten, ohne zuvor als animiertes Target
  verborgen gewesen zu sein.

Nicht unterstuetzte Effekte nie durch unbekannte Manifestfelder oder CSS-Tricks
vortaeuschen. Als `runtime_extension_required` dokumentieren.

### 3. Animationsentscheidung Treffen

Genau einen Modus waehlen:

- `static`: kein fachlich sinnvoller Informationsaufbau.
- `animated`: Sprechertext oder belegte Quellzustaende tragen eine klare Abfolge.
- `needs_review`: Grundlage oder technische Machbarkeit ist offen.

Fuer `static` bleiben `targets` und `steps` leer. Kein Ganzfolien-Reveal erzeugen.

### 4. Initialzustand Planen

Noch vor den Triggern jede semantische Gruppe klassifizieren:

- `visible_context`: fuer Orientierung oder ersten Satz sofort erforderlich.
- `hidden_until_trigger`: enthaelt Information, die erst spaeter eingefuehrt wird.
- `static_decorative`: ruhiger Hintergrund ohne eigenen Trigger.
- `visible_then_changes`: soll sichtbar beginnen und spaeter transformiert,
  hervorgehoben oder ausgeblendet werden.
- `excluded`: gehoert nicht in die Zielszene.

Der Initialzustand zeigt den kleinsten ausreichenden Orientierungsrahmen, nicht
automatisch gar nichts und nicht automatisch das fertige Ergebnis.

Vor der Klassifikation fuer jede inhaltstragende Gruppe den fruehesten fachlichen
Beat als `firstRelevantBeatId` festhalten. Das gilt auch fuer Fotos, Renderings,
Quellenzeilen und andere vermeintliche Kontextbilder. `visible_context` ist nur
zulaessig, wenn die Gruppe bereits fuer den ersten Sprecherbeat erforderlich ist.
Ein konkretes Produkt-, Personen-, Schadens- oder Fallbeispielbild ist keine
neutrale Dekoration und bleibt bis zu seiner ersten expliziten oder eindeutig
implizierten Einfuehrung verborgen.

Wenn die ersten Sprecherbeats allgemein bleiben und die Downstream-Masterebene
bereits Orientierung liefert, ist ein leerer Content-Bereich fachlich besser als
ein vorweggenommenes spezifisches Bild. Leere nicht durch spaetere Beispiele,
Kennzahlen oder Ergebnisse fuellen.

Verbindliche Abhaengigkeiten:

- Kein Verbinder ist sichtbar, wenn ein benoetigter Endpunkt noch verborgen ist.
- Keine Beschriftung ist sichtbar, bevor ihr Bezugsobjekt sichtbar ist.
- Kein Ergebnis oder Fazit nimmt eine spaetere Schlussfolgerung vorweg.
- Diagrammrahmen duerfen initial sichtbar sein, wenn der erste Sprecherabschnitt
  sonst keine Orientierung hat.
- Eine leere Szene ist nur zulaessig, wenn der Sprechertext den Aufbau aus dem
  Nichts fachlich traegt und die Downstream-Masterebene bereits Orientierung gibt.

`visible_then_changes` nur verwenden, wenn das Runtime-Profil dies wirklich
unterstuetzt. Andernfalls Plan oder Runtime zuerst aendern.

### 5. Sprechertext In Narrative Beats Zerlegen

Den Text nach fachlichen Aussagen segmentieren, nicht mechanisch nach Saetzen,
Pausen oder gleich langen Wortfenstern.

Maschinenlesbare Sprecherpausen wie `{{pause:short}}`, `{{pause:medium}}`,
`{{pause:long}}` oder `{{pause:1.2s}}` nach
`workflow/50-animation/narration-pause-markers.md` behandeln. Sie sind weder
gesprochene Woerter noch eigene narrative Beats. `sourceText` enthaelt niemals
einen Pausenmarker; als Trigger echte Woerter unmittelbar davor oder danach
verwenden. Bei einer Viewer-Zeitvorschau verschieben Pausen alle nachfolgenden
Zeitpunkte um ihre validierte Dauer.

Den vollstaendigen Sprechertext ab dem ersten Satz abbilden. Beats ohne Reveal
sind ausdruecklich zulaessig und erforderlich, wenn dort nur allgemein gesprochen
wird. Die Beat-Liste darf nicht erst mit dem ersten Animationsschritt beginnen;
sonst werden spaetere Fachbilder faelschlich als Anfangskontext bewertet.

Fuer jeden Beat festhalten:

- aktuelle fachliche Aussage,
- benoetigter sichtbarer Kontext,
- neu entstehende oder fokussierte Information,
- Lernzustand vor und nach dem Beat,
- exakte `sourceText`-Phrase aus dem wirksamen Sprechertext.

`sourceText` verwendet im Normalfall drei bis acht vollstaendige Woerter. Bei
mehreren Fundstellen `occurrence` angeben.

### 6. Semantische Gruppen Bilden

Ein Animationsziel entspricht einer wahrgenommenen fachlichen Einheit, nicht
einem SVG-Elementtyp.

Immer atomar gruppieren:

- Box, Flaeche, Rand, Titel, Text und Icon,
- Listenmarker, Abschnittslabel und vollstaendiger Listenpunkt,
- Pfeil, Linie, Spitze, Marker und zugehoeriges Label,
- Marker, Fuehrungslinie, Wert und Beschriftung,
- Diagrammrahmen mit Achsen, Ticks, Skalen, Gitternetz und Achsenlabels,
- Datenreihe mit Markern und direkt zugehoerigem Legendeneintrag,
- beide Konfidenzgrenzen,
- Formelbestandteile, die gemeinsam gesprochen werden.

Gruppen nur dann trennen, wenn sie zu unterschiedlichen Zeiten eingefuehrt oder
spaeter separat fokussiert werden muessen.

Mehrere eigenstaendige Targets duerfen mit derselben Triggerphrase gleichzeitig
starten. Direkt aufeinanderfolgende Schritte mit gleicher `sourceText`-Phrase und
gleicher `occurrence` bilden eine Triggergruppe.

Details stehen in `references/decision-system.md`.

### 7. Abhaengigkeitsgraph Und Reihenfolge Festlegen

Vor der Effektwahl fuer jede Gruppe `depends_on` bestimmen. Die Reihenfolge folgt
sowohl dem Sprechertext als auch diesen Mindestregeln:

1. Orientierung vor Detail,
2. Endpunkte vor Beziehung,
3. Ursache vor Wirkung,
4. Objekt vor Annotation,
5. Diagrammrahmen vor Daten,
6. Daten vor Fit, Referenz oder Unsicherheit,
7. Ausgangszustand vor Veraenderung,
8. Beobachtung vor Schlussfolgerung.

Ein Connector darf gemeinsam mit dem spaeteren Endpunkt erscheinen, wenn dadurch
erst die vollstaendige Beziehung entsteht. Er darf nie vorher erscheinen.

### 8. Effekt Nach Aussage Waehlen

Den unauffaelligsten Effekt verwenden, der die Aussage erkennbar macht:

- `show`: Standard fuer neue vollstaendige Information; ruhiges Fade bevorzugen.
- `draw`: nur fuer fachlich entstehende Verlaeufe, Kurven oder gerichtete Beziehungen.
- `highlight`: bereits sichtbare und zuvor eingefuehrte Information kurz fokussieren.
- `transform`: echte Bewegung, Verschiebung oder Skalenaenderung desselben Objekts.
- `hide`: nur wenn alter Inhalt fuer einen belegten Zustandswechsel weichen muss.

Keine Rotation, Spruenge, Bounce-, Spin- oder dekorativen Zoom-Effekte. Kleine
Eintrittsbewegungen nur verwenden, wenn Reviewer und Zielruntime sie identisch
unterstuetzen. Im aktuellen Basis-RE-Reviewer daher `show` als reines Fade planen.

Verschwimmen ist ein Fokusmittel, keine alternative Einblendung. Es ist nur
zulaessig, wenn die Runtime dafuer einen dokumentierten Effekt mit sauberer
Rueckkehr in den scharfen Zustand besitzt.

### 9. Plan Vor Der SVG-Bearbeitung Validieren

Den Plan nach `assets/animation-dramaturgy-plan.template.json` anlegen und pruefen:

```powershell
node .agents/skills/animate-svg-from-narration/scripts/validate-animation-plan.js <plan.json>
```

Ein Plan mit Fehlern wird nicht in SVG und Manifest ueberfuehrt.

### 10. SVG Und Manifest Umsetzen

- Stabile semantische ASCII-`snake_case`-IDs verwenden.
- Animierte Gruppen mit `data-anim-target="true"` markieren.
- Nach Moeglichkeit `data-anim-label` setzen.
- Nur Aktionen und Felder aus dem aktiven Manifestvertrag verwenden.
- Gruppen mit `visible_context` oder `static_decorative` nicht als `animated`
  markieren.
- Jedes spaeter verborgene Target zuerst mit `show`, `draw` oder technisch
  passendem `transform` einfuehren, bevor `highlight` oder `hide` darauf wirkt.

### 11. Zustandsweise Reviewen

Mindestens rendern und visuell vergleichen:

- Frame 0,
- unmittelbar vor jedem Trigger,
- Ende jeder Triggergruppe,
- vollstaendiger Endzustand.

Bei jeder Ansicht pruefen:

- Ist die naechste Aussage ohne Vorwissen lesbar?
- Ist jedes sichtbare inhaltstragende Element bis zu diesem Zeitpunkt bereits
  gesprochen, eindeutig impliziert oder fuer das Verstaendnis zwingend notwendig?
- Sieht man keine fachlichen Fragmente?
- Sind Beziehungen erst mit ihren Endpunkten sichtbar?
- Gibt es genau einen klaren Fokus?
- Bleibt bereits benoetigter Kontext erhalten?
- Ist der Endzustand vollstaendig und statisch verstaendlich?

Die vollstaendige Rubrik steht in `references/review-rubric.md`.

## Output

Pro Szene entstehen:

1. ein validierter Dramaturgieplan,
2. bei `animated` semantische SVG-Targets,
3. ein technisch valides Animationsmanifest,
4. gerenderte Review-Zustaende oder ein dokumentierter Review-Nachweis,
5. eine Liste bewusst nicht umgesetzter Effekte mit Runtime-Begruendung.

## Freigabesperren

Nicht freigeben, wenn:

- der Anfangszustand nicht bewusst begruendet wurde,
- ein konkretes Bild, Beispiel, Quellenhinweis oder Ergebnis vor seinem
  `firstRelevantBeatId` sichtbar ist,
- ein Pfeil oder Label vor seinem Bezugsobjekt erscheint,
- eine Box in Hintergrund und Text zerfaellt,
- ein Trigger nicht exakt im Sprechertext vorkommt,
- ein Pausenmarker als `sourceText` verwendet oder als gesprochenes Wort gezaehlt wird,
- ein Effekt von Reviewer oder Zielruntime nicht unterstuetzt wird,
- ein initial sichtbares Target durch den Status `animated` unbeabsichtigt verschwindet,
- eine Zwischenansicht fachlich unvollstaendig oder visuell missverstaendlich ist,
- die statische Szene klarer waere.
