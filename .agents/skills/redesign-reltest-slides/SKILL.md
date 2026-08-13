---
name: redesign-reltest-slides
description: Redesign single technical learning slides, slide sequences, or complete modules in the RelTest Education visual system while preserving source content and speaker-text compatibility. Use when Codex must modernize an existing slide, apply the Education full-slide brand design, restructure content into a suitable slide archetype, redesign a Content-SVG without duplicating master elements, or harmonize an entire module.
---

# Redesign RelTest Slides

## Ziel

Bestehende Lerninhalte in das RelTest-Education-Design ueberfuehren, ohne fachliche Aussage, Sprechertextbezug oder notwendige Details zu verlieren. Redesign als neue visuelle Verpackung behandeln, nicht als automatische Zusammenfassung.

## Modus Zuerst Festlegen

Vor jeder Gestaltung genau einen Ausgabemodus dokumentieren:

- `full_slide`: Vollstaendiger 1920x1080-Inhaltscanvas mit Brandhintergrund und sicheren Titel-/Footerzonen. Sichtbarer Titel, Footer, Logo und Szenenkennung werden im aktuellen Basis-RE-Seminar vom Downstream-Repository erzeugt und duerfen nicht im SVG dupliziert werden.
- `content_svg`: Eigenstaendiges Inhaltsmodul fuer spaetere Einbettung. Keine Titelzone, kein Footer, kein Logo, kein globaler Hintergrund und keine Foliennummer einbauen.
- `module_redesign`: Erst Sequenz und gemeinsame Komponenten planen; danach jede Zielszene einzeln als `full_slide` oder `content_svg` produzieren und pruefen.

Bei einer einzelnen, nicht weiter spezifizierten Einbettungsgrafik im Basis-RE-Seminar
`content_svg` verwenden. Ein Auftrag zur Umsetzung eines Kapitels, einer Lektion
oder einer Folienfolge verwendet dagegen `module_redesign` als Planungsmodus.
Nennt der Nutzer ein bestehendes Modul als Designreferenz, dessen tatsaechlichen
Artefaktmodus uebernehmen: Referenz-Vollfolien fuehren zu `full_slide`, sofern der
Nutzer nicht ausdruecklich nur ein Content-SVG beauftragt.

## Pflichtkontext Laden

Im Basis-RE-Seminar zuerst lesen:

1. `AGENT.md`
2. `workflow/34-slide-redesign/slide-redesign-workflow.md`
3. `workflow/34-slide-redesign/chapter-implementation-quality-contract.md`, bei Kapiteln, Lektionen oder Folienfolgen
4. `brand/reltest-education-style-guide.md`
5. `brand/reltest-education-slide-design-tokens.json`
6. `agents/brand-guardian.md`
7. `workflow/50-animation/animation-decision-and-dramaturgy.md`, falls Animation relevant ist
8. `workflow/60-quality/rebuild-quality-gate.md`
9. `workflow/00-router/review-feedback-learning-loop.md`, sobald Nutzerfeedback, Review-Notizen oder ein bestehender Modul-Audit vorliegen

Sobald ein Piktogramm neu erstellt, ersetzt oder semantisch umgedeutet wird,
zusaetzlich `workflow/30-visual-decision/pictogram-creation-workflow.md`,
`brand/reltest-education-pictogram-style-guide.md`,
`brand/reltest-education-pictogram-tokens.json` und
`components/pictogram-library/pictogram-registry.json` lesen.

Fuer die Archetypwahl `references/redesign-decision-guide.md` lesen. Vor neuen oder korrigierten Seminarfolien `references/review-derived-design-rules.md` und den neuesten passenden Modul-Audit gezielt laden. Fuer exakte Education-Brandwerte und Typografie `references/reltest-education-brand-handoff.md` verwenden. `references/external-slide-brand-design-handoff.md` beschreibt nur den alten Academy-Stand und ist keine aktive Designquelle.

## Arbeitsablauf

1. Quellen, Sprechertext, Redesign-Umfang sowie vorhandene Review-Learnings erfassen.
2. Vollstaendiges Inhaltsinventar mit `beibehalten`, `neu gruppieren`, `visuell ersetzen` und `nur Dekoration entfernen` anlegen.
3. Dominante Lernbotschaft in einem Satz formulieren, ohne den sichtbaren Inhalt vorzeitig zu kuerzen.
4. Ausgabemodus und passenden Folienarchetyp begruendet waehlen.
5. Bei Kapitel-/Lektionsauftraegen Referenz-Lock und vollstaendigen Sequenzplan nach dem Chapter Implementation Quality Contract abschliessen.
6. Einen Redesign-Brief nach `templates/slide-redesign-brief-template.md` speichern.
7. Erst danach Layout, Komponenten, Assets, Diagramme und Formeln produzieren.
8. Den statischen Endzustand rendern, mit Quelle und Referenzdesign vergleichen und freigeben.
9. Erst nach statischer Freigabe Animationen produzieren und jeden fachlich relevanten Zustand rendern.
10. Inhalt in beide Richtungen crosschecken: fehlender Quellinhalt und unbelegte Zielergaenzungen.
11. Zielaufloesung, verkleinerte Viewer-Ansicht, Safe Areas, berechneten Kontrast, Brand-Tokens, Geometrie und Animationszustaende pruefen.
12. Befunde an derselben Szene beheben und erneut pruefen, bevor die naechste Szene beginnt.
13. Nach der Einzelfolienpruefung einen kapitelweiten Konsistenz-Sweep gegen das Referenzmodul ausfuehren.
14. Nutzerfeedback nach Reichweite klassifizieren und uebertragbare Erkenntnisse gemaess Feedback-Lernschleife in Audit, Fachworkflow, Skill oder QA zurueckfuehren.

## Lernen Aus Reviews

- Feedback nicht als isolierten Patch behandeln.
- Ausdrueckliche seminarweite Nutzerpraeferenzen sofort als Projektregel uebernehmen.
- Wiederkehrende Fehlerklassen spaetestens beim zweiten Auftreten in die passende kanonische Regel ueberfuehren.
- Einmalige Geometrie- oder Geschmacksentscheidungen lokal dokumentieren und nicht blind verallgemeinern.
- Den Skill kompakt halten: Kernentscheidungen hier, Detailwissen in `references/` oder den Fachworkflows.
- Vor der naechsten Folie den neuesten Audit nach vergleichbaren Archetypen, Komponenten und Fehlerklassen durchsuchen.

## Harte Designregeln

- Eine dominante Lernbotschaft pro Folie herstellen.
- Keine Downstream-Masterelemente in Seminar-SVGs erzeugen: sichtbarer Folientitel, Titelakzent, Titeltrennlinie, Footertrennlinie, Trainingsfooter, Logo und Modul-/Szenenkennung bleiben ausserhalb des SVGs. Den Titel nur in Metadaten und Storyboard-Daten erhalten.
- Alle selbst formulierten Seminartexte, Sprechertexte und Animationstrigger konsequent in der Du-Form halten. Slogans fuer das Seminar ebenfalls in die Du-Form ueberfuehren, sofern sie nicht ausdruecklich als unveraendertes woertliches Zitat erhalten bleiben muessen.
- Sprechertext erklaeren lassen; auf der Folie Begriffe, Struktur, Beziehungen, Reihenfolgen, Kennzahlen und Schlussfolgerungen zeigen.
- Reduktion vor Verkleinerung anwenden: erst kuerzen, ordnen und aufteilen, dann innerhalb erlaubter Typostufen verkleinern.
- Nur Formen einsetzen, die Bedeutung, Gruppierung, Orientierung, Hierarchie oder Animation tragen.
- Produktionspalette und SVG-Asset-Palette nicht zufaellig mischen.
- Karten nur fuer echte fachliche Einheiten verwenden; keine Karten in Karten und keine Vollflaechenkarte um den gesamten Inhalt.
- Medien gross und rahmenlos zeigen; transparente SVGs nicht dekorativ einrahmen.
- Semantische Farben nur semantisch einsetzen und Bedeutung nie allein ueber Farbe vermitteln.
- Zentrale Icons professionell und stilistisch konsistent ausfuehren; keine improvisierten Primitivformen oder Emoji verwenden.
- Piktogramme sind ausdruecklich erlaubt und sollen eingesetzt werden, wenn sie einen Begriff, eine Funktion, eine Handlung, eine Hierarchiestufe oder einen Zustandswechsel schneller erfassbar machen. Sie sind kein dekoratives Pflichtprogramm.
- Pro Folie eine konsistente Piktogrammsprache verwenden: gleiche Strichstaerke, optische Groesse, Eckenlogik und Farbsemantik. Piktogramme immer mit eindeutigem Text oder eindeutigem Kontext koppeln.
- Piktogramme ausschliesslich als generierte PNG-Bildassets oder bereits
  freigegebene PNG-Library-Assets einsetzen. Keine Piktogramme aus SVG-Pfaden,
  SVG-Grundformen, Symbolfonts oder einer SVG-Iconbibliothek konstruieren. Das
  Szenen-SVG darf das PNG nur platzieren, beschriften, gruppieren und animieren.
- Neue Piktogramme folgen dem minimalistischen Profil
  `reltest-education-minimal-v1` und muessen den 960x540-Szenencheck sowie die
  vorgesehenen 48-/32-px-Kleinmassstabchecks bestehen. Ein Icon, das im
  Player nur ueber seine Beschriftung verstanden wird, ist zu komplex oder
  falsch klassifiziert. Es ist flach, frontal oder orthografisch, verwendet
  Marineblau als Grundmotiv und hoechstens eine semantische Akzentfarbe; keine
  Verlaeufe, Schatten, 3D-, Isometrie-, Textur-, Glow-, Emoji- oder
  Stickeroptik. Bedeutungsrelevante Teile erreichen mindestens 3:1 Kontrast,
  und Farbe ist nie der einzige Informationstraeger.
- Wiederverwendbare Piktogramme aus der zentralen PNG-Bildbibliothek oder
  vorhandenen Brand-Bildassets verwenden. Komplexe oder markenspezifische
  Motive als hochwertiges Asset erzeugen beziehungsweise extrahieren; keine
  hastig konstruierten SVG-Ersatzsymbole verwenden.
- Pfeillinien vor der Spitze enden lassen und Verbinder hinter Text platzieren.
- Standardverbinder aus den Brand-Tokens verwenden: 1,5 bis 2,5 px normal,
  4 px betont und hoechstens 6 px ohne dokumentierte Spezialausnahme. Pfeilkoepfe
  duerfen die verbundenen Inhalte optisch nicht dominieren.
- Keine globale `text { fill: ... }`-Regel verwenden, wenn die Folie mehrere
  Textfarben benoetigt. Kontrast anhand des berechneten Renderstils pruefen.
- Diagramme geometrisch korrekt und nach dem Python-Plot-Workflow erzeugen, sofern es echte Plots sind.
- Bei diagrammgetragenen Folien den Plot als dominante Erklaerflaeche behandeln. Maximal eine gebuendelte Erklaerzone ergaenzen und keine statische Funktions- oder Themenleiste wiederholen, wenn sie in der Sequenz keinen Zustand wechselt.
- Bei der Uebertragung bestehender Diagramme nicht nur Beschriftungen, sondern auch alle fachlichen Zustaende, Kurven, Pfeilrichtungen, Bereichsnummern und Vorher-/Nachher-Beziehungen erhalten. Visuelle Beziehungen duerfen nur entfernt werden, wenn sie nachweislich dekorativ sind.
- Formeln kontrolliert setzen; keine fragile Unicode-Ersatznotation verwenden.
- Animation ruhig, optional und sprechertextgefuehrt planen. Zusammengehoerige Elemente gemeinsam animieren.
- Jede Folie muss im vollstaendigen Endzustand auch ohne Animation verstaendlich sein.

## Full-Slide-Regeln

Bei `full_slide`:

- 1920x1080 und 16:9 verwenden.
- Aktive Produktionspalette aus `brand/reltest-education-slide-design-tokens.json` verwenden.
- Marineblau `#142452` als visuell fuehrende Inhaltsfarbe verwenden.
  Signalgruen `#00A653` bleibt der Education-Submarkenakzent und wird ebenso wie
  Stahlcyan `#0C84B4` nur sparsam und semantisch eingesetzt. Gleichrangige
  Infoboxen verwenden blaue Tonwert- oder Transparenzabstufungen statt
  unterschiedlicher Buntfarben.
- Oxanium fuer Headlines/Auszeichnungen und Archivo fuer Inhaltstexte verwenden.
- Neue Metadaten verwenden `brandProfile=reltest-education`; die Altbezeichnung
  `Academy` nicht in neue sichtbare Texte oder Brandhinweise schreiben.
- Hellen technischen Hintergrund und dezentes 80-px-Raster verwenden; die reservierten Titel- und Footerzonen fuer das Downstream-Rendering freihalten.
- Keinen sichtbaren Folientitel, Titelakzent, Titel-/Footertrenner, Trainingsfooter, kein Logo und keine Modul-/Szenenkennung in das SVG schreiben.
- Den fachlichen Titel als nicht sichtbaren zugänglichen `<title>`, als `contentTitle` und im Storyboard erhalten.

## Content-SVG-Regeln

Bei `content_svg`:

- Transparenten, rahmenlosen Canvas verwenden.
- Keine Headline, keinen Footer, kein Logo und keinen Folienhintergrund duplizieren.
- Sichere Inhaltszone fuer spaetere Titel- und Footerbereiche freihalten.
- Entweder die bestehende kompatible SVG-Palette vollstaendig beibehalten oder das Asset bewusst vollstaendig auf Produktionsfarben migrieren.
- Bestehenden Content-SVG-Vertrag und `brand/company-brand-tokens.json` weiterhin anwenden.

## Modul-Redesign

Bei `module_redesign`:

- Vor Produktion alle Quellfolien und Sprechertexte sichten.
- Das konkrete Referenzmodul mit mindestens drei freigegebenen Ziel-SVGs als
  Referenz-Lock dokumentieren; ein gleichnamiges Kapitel ist kein Ersatz.
- Zusammengehoerige Folien, Aufbauzustaende, Wiederholungen und moegliche Animationen bestimmen.
- Gemeinsame Komponenten und Archetypen festlegen, bevor Einzelfolien gestaltet werden.
- Wiederkehrende Phasen- und Prozessmodelle als eine zentrale Komponente mit kanonischen Bezeichnungen, Nummern, Reihenfolge und Farbzuordnung definieren und auf Uebersichts- wie Detailfolien unveraendert wiederverwenden.
- Variationen nur aus Inhalt und Didaktik ableiten, nicht aus dem Wunsch nach optischer Abwechslung.
- Die erste Szene jedes neuen Archetyps als Pilot statisch rendern und freigeben,
  bevor das Muster auf weitere Szenen uebertragen wird.
- Anschliessend streng Folie fuer Folie produzieren, statisch freigeben, erst dann
  animieren, crosschecken, rendern, pruefen und korrigieren.
- Nach allen Einzelfreigaben den kapitelweiten Konsistenz-Sweep aus
  `workflow/34-slide-redesign/chapter-implementation-quality-contract.md`
  durchfuehren.

## Freigabe

Nur freigeben, wenn:

- der gesamte relevante Quellinhalt nachweisbar uebertragen wurde,
- die Folie neben bestehenden RelTest-Education-Folien wie Teil derselben Reihe wirkt,
- zentrale Aussage in wenigen Sekunden erfassbar ist,
- Primärtext bei 1920x1080 moeglichst mindestens 22 px besitzt,
- Safe Areas, Kontrast, Umlaute, Layer und Geometrie sauber sind,
- berechnete Textfarben geprueft sind und keine CSS-Kaskade vorgesehenen
  Hell-Dunkel-Kontrast aufhebt,
- keine unbegruendeten Verbinder ueber 6 px oder optisch ueberdimensionierten
  Pfeilkoepfe vorhanden sind,
- keine unnoetigen Karten, Farben, Schatten oder Dekorationen vorhanden sind,
- eingesetzte Piktogramme fachlich eindeutig, stilistisch konsistent und bei kleiner Darstellung lesbar bleiben,
- jedes neue oder geaenderte Piktogramm den Semantik-, Stil-, Kleinmassstab- und
  Zugaenglichkeitscheck aus dem Piktogrammworkflow bestanden hat,
- jedes Piktogramm als geprueftes PNG-Asset eingebettet ist und keine
  ersetzende SVG-Icongeometrie enthaelt,
- Animationen fachlich begruendet und ihre Gruppen vollstaendig sind,
- sichtbarer Text, Sprechertext und Triggerphrase dieselbe Du-Ansprache verwenden,
- die passende statische und browserbasierte QA ohne unbegruendete Befunde abgeschlossen ist.
- Quellen-, Ziel- und Referenzpreview bei 1920x1080 sowie verkleinert direkt
  verglichen wurden; ohne Zielrender keine Freigabe erfolgt.
- Review-Learnings dokumentiert und bei uebertragbarer Reichweite in der richtigen Schublade verankert sind.
