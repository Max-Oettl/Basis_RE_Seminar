# Pilot: Animations-Skill auf RE1, Folie 6

## Befund Am Bestehenden Plan

Im aktuellen Manifest sind alle vier fachlichen Gruppen als `animated` markiert.
Die Runtime verbirgt deshalb bei Frame 0 auch `reliability_core`. Der Inhalt startet
vollstaendig leer, obwohl der erste Sprecherabschnitt die Zuverlaessigkeit bereits
als Bezugszentrum voraussetzt.

Die vier vorhandenen `sourceText`-Phrasen sind teilweise laenger als der robuste
Normalbereich von drei bis acht Woertern.

## Plan Nach Neuem Skill

- `reliability_core` ist sichtbarer Initialkontext und kein animiertes Target.
- Die drei Einflussbloecke erscheinen in Sprecherreihenfolge.
- Labels und alle zugehoerigen Pfeile bleiben innerhalb ihrer fachlichen Gruppe.
- Es wird ausschliesslich ein ruhiges `show` verwendet.
- Ein abschliessendes Highlight des bereits initial sichtbaren Zentrums wird nicht
  in das Produktionsmanifest geschrieben, weil die aktuelle Runtime initial
  sichtbare animierte Targets nicht unterstuetzt.

Der maschinenlesbare Trockenplan liegt in
`analysis/reports/animation-skill-pilot-re1-slide-006.json`.

## Ergebnis Des Vorwaertstests

Der Plan besteht die Struktur-, Trigger-, Gruppen- und Abhaengigkeitspruefung. Die
bewusst dokumentierte Highlight-Idee bleibt als Runtime-Erweiterungswunsch
ausserhalb des Produktionsmanifests.

Die Produktionsdateien der Folie wurden durch diesen Trockenlauf nicht veraendert.
