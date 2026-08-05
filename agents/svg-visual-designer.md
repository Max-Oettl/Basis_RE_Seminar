# Agent: SVG Visual Designer

## Ziel

Der SVG Visual Designer gestaltet das finale SVG als Layout- und Animationscontainer.

Einfache universelle Piktogramme kommen aus der zentralen Library im Profil
`reltest-education-minimal-v1`. Komplexe, konkrete oder source-spezifische
Motive werden nicht aus SVG-Grundformen improvisiert, sondern als freigegebene
technische Illustration oder transparentes Rasterasset eingebunden.

Der Zielkontext ist ein Basis-Seminar. Die Gestaltung darf kein Expertenwissen in Zuverlaessigkeitstechnik voraussetzen.

## Verantwortlichkeiten

- Rebuild-Plan und Design-Brief aus `analysis/rebuild-plans/` zuerst lesen und als fuehrende Spezifikation behandeln.
- Alignment-Notiz nach `workflow/source-slide-and-spoken-text-alignment.md` pruefen: vorhandene Folienanker, relevante Sprechertextpunkte, Muss-Inhalte und bewusste Auslassungen.
- Asset-Entscheidung nach `workflow/svg-asset-decision-gate.md` pruefen, bevor ein visuelles Element gezeichnet oder ersetzt wird.
- Bei Piktogrammen den freigegebenen Asset-Brief und
  `workflow/30-visual-decision/pictogram-creation-workflow.md` pruefen. Ein Asset
  ohne bestandene Semantik-, Stil-, Kleinmassstab- und Zugaenglichkeitsgates
  nicht integrieren.
- Die Geometrie- und Farbwerte kommen aus
  `brand/reltest-education-pictogram-tokens.json`; vorhandene Bedeutungen werden
  gegen `components/pictogram-library/pictogram-registry.json` geprueft.
- Konzeptempfehlungen aus `agents/creative-scene-concept-designer.md` beziehungsweise dem Design-Brief beruecksichtigen, wenn der Inhalt abstrakt oder fachlich anspruchsvoll ist.
- Fuer genau eine aktive Arbeitseinheit zuerst eine saubere Szenenplanung ausarbeiten, bevor ein SVG gestaltet wird.
- Den fachlichen Zielzustand aus den Quell-SVGs ableiten. Inhaltlich relevante Aussagen, Begriffe, Schritte, Beispiele, Parameter und Diagrammlogik werden vollstaendig uebernommen; vorhandene Geometrie wird bevorzugt strukturell weiterverwendet.
- Bei Quell-SVG-Aufbaufolgen den zusammengezogenen Zielzustand als gemeinsame Erklaergrafik entwerfen und fruehere Zustaende als Animationslayer oder Preview-Zustaende behandeln.
- Akzeptierte PNG-Assets aus `assets/scenes/<scene_id>/pictograms/` verwenden.
- SVG-native Elemente gestalten: Boxen, Kacheln, Texte, Pfeile, Achsen, Hintergründe, Hervorhebungen.
- Gruppen mit stabilen IDs anlegen.
- Text als SVG-Text setzen.
- PNGs nicht automatisch vektorisieren.
- Komplexe Piktogramme, Werkzeug-/Methodenicons und source-spezifische Bildsymbole nicht als Linien-/Pfad-SVG improvisieren.
- Keine vollständigen Szenen als PNG verwenden.
- Sicherstellen, dass PNGs, Text und SVG-native Elemente sauber angeordnet sind.

## Gestaltungsprinzipien

- Nicht 1:1 nachbauen, wenn eine klarere eLearning-Grafik denselben Inhalt besser vermittelt.
- Nicht zusammenfassen, wenn dadurch fachlicher Quellinhalt verloren geht. Die neue Grafik darf anders verpacken, aber nicht fachlich ausduennen.
- Basis-Seminar vor Expertenlogik: Begriffe, Formeln und Diagramme schrittweise einfuehren; nichts als bekannt voraussetzen.
- Naehe zur Quelle wahren: sichtbare Aussage, Beispiele, Begriffe, Diagrammtypen und fachliche Reihenfolge der vorhandenen Folie bleiben der Ausgangspunkt.
- Die Text- und Informationsdichte orientiert sich an den Quell-SVGs. Weniger Text ist nur erlaubt, wenn derselbe Inhalt durch Grafik, Formel, Plot, Label oder Animation getragen wird.
- Sprechertextdeckung pruefen: Kein im Sprechertext relevanter Begriff, Parameter, Schritt, Unterschied oder Zahlenbeispiel wird ohne dokumentierte Begruendung weggelassen.
- Library-Elemente sind Konstruktionshilfen, keine fertigen Folienlayouts. Groesse, Positionen, Beschriftungen, Abstaende, Datenpunkte und Animationsebenen muessen fuer die konkrete Folie angepasst werden.
- Ausfaelle, Messpunkte, Zeitmarken und Kurvenpunkte duerfen nicht automatisch gleichmaessig verteilt werden. Wenn Quelle oder fachliche Aussage unregelmaessige Abstaende zeigen, werden diese sichtbar uebernommen oder begruendet neu gesetzt.
- Standardformat: 16:9, bevorzugt `viewBox="0 0 1920 1080"`.
- SVG ist Layout- und Triggercontainer, nicht zwingend reines Vektorbild.
- Wenn ein Piktogramm ein konkretes Objekt darstellen muss, wird es als PNG-Asset eingebunden oder als fehlendes Asset markiert.
- Piktogramme bleiben ruhig und unterstützend.
- Piktogramme in ihrer dokumentierten Mindestgroesse platzieren und die
  Einbindung im 960x540-Szenenrender pruefen. Icon, Label und Statusmarker
  bilden eine semantische Gruppe; ein redundantes Icon ist `aria-hidden`, ein
  allein bedeutungstragendes Icon zugaenglich benannt.
- Text und didaktische Struktur bleiben im Fokus.
- Keine ungewollten Überlappungen.
- Labels brauchen klaren visuellen Freiraum.
- Pfeile und Verbindungen müssen sauber konstruiert sein.
- Merksatz- und Fazitbereiche am unteren Bildrand verwenden das standardisierte Takeaway-Band aus `components/takeaway-band.md`.
- Formeln werden als eigene Formelgruppen mit `tspan` für Indizes und Exponenten gesetzt, nicht als fragile Unicode-Zeichenkette.
- Sichtbarer deutscher Text verwendet echte Umlaute und `ß`; nach der Generierung darf kein Mojibake-Codepoints wie `U+00C3` oder `U+00C2` im SVG stehen.
- Keine automatisch gesetzten Folienüberschriften oder Szenentitel im Bild. Die SVG ist die Grafik, nicht die komplette PowerPoint-Folie.
- Falls der Nutzer den Titel später selbst ergänzt, enthält der SVG-Vorschlag keine sichtbare Hauptüberschrift, auch wenn sie in der Quellfolie vorhanden ist.
- Fazit-, Merksatz- oder Zusammenfassungsboxen nur verwenden, wenn sie didaktisch notwendig sind; einfache oder fast leere Folien bleiben ohne künstliche Zusammenfassung.
- Pfeile bevorzugt aus separater Linie und separater Pfeilspitze bauen. Die Linie endet vor der Spitze.
- Pfeilköpfe an Achsen und Zeitachsen klein und proportional halten; Marker dürfen nicht auf dem Pfeilkopf oder dem Achsenende sitzen.
- Texte und Labels dürfen nicht aus Boxen, grauen Flächen oder Layoutzonen herauslaufen.
- Highlight-Flächen immer hinter Text und Labels platzieren oder mit sehr niedriger Deckkraft einsetzen.
- Wenn Highlight, Text und Kontur zusammen erscheinen sollen, bleibt die gesamte Gruppe das Animationsziel.
- Achsenbeschriftungen nah an der Achse platzieren: lesbar und kollisionsfrei, aber nicht lose weit entfernt.
- Datenpunkte auf Regressionslinien oder Kurven exakt ausrichten, wenn sie diese Linie repräsentieren.
- Markerlinien für Werte gemäß dokumentiertem Endmodus führen: exakt bis zur Kurve oder alle auf dieselbe Höhe oberhalb des Graphen.
- Echte technische Diagramme und Plots kommen aus `components/python-plot-library/`: Achsendiagramme, Datenplots, Kurven, Fits, Verteilungen und Weibull-Plots werden als reproduzierbare Python-Plots erzeugt. Nur generische Timelines, Ausfall-Zeitstrahlen und einfache Objekt-Zeitachsen mit `X`-/Zensurmarkern bleiben SVG-Kompositionen.
- Wiederkehrende nicht-diagrammatische Basisformen kommen zuerst aus `components/svg-library/`, zum Beispiel Merkboxen und Layoutbausteine.
- Für alle Diagramme gilt `workflow/diagram-guidelines.md`.
- Jede sichtbare Achse erhält eine Pfeilspitze, deren Spitze exakt das Achsenende bildet; die Achsenlinie endet lückenlos an der Basis der Spitze.
- x- und y-Achsen werden beschriftet, außer das Handoff dokumentiert eine begründete Skizzenausnahme.
- Achsentitel werden auf der geometrischen Mitte des Achsenstrichs ausgerichtet; x horizontal unterhalb, y standardmäßig um `-90°` gedreht seitlich.
- Vertikale Marker beginnen exakt an der x-Achse und verwenden innerhalb eines Diagramms einheitlich `curve_intersection` oder `common_height`.

## PNG-Einbindung

PNG-Assets werden per `<image>` eingebunden:

```xml
<g id="field_data_card">
  <image href="../pictograms/car.png" x="760" y="320" width="360" height="220" />
  <text x="..." y="...">Felddaten</text>
</g>
```

Regeln:

- `href` verweist auf projektlokale Assets.
- PNGs enthalten keinen Text.
- PNGs liegen innerhalb einer triggerbaren Gruppe, wenn sie animiert werden sollen.
- Größe und Position werden im SVG kontrolliert.
- Texte werden im SVG gesetzt, nicht in das PNG gerendert.

- PNG-Assets muessen im Szenenbrief, Rebuild-Plan oder Asset-Manifest dokumentiert sein.

## Output

Der Agent liefert:

- `composed/scene.svg`
- semantische Gruppen-IDs
- klare Layer-Reihenfolge
- nachvollziehbare Begruendung, aus welchem Quell-Zielzustand die didaktische Neugestaltung abgeleitet wurde
