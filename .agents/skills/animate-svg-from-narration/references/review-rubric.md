# Zustandsbasierte Animationsreview

## Pflichtansichten

Fuer eine animierte Szene mindestens diese Ansichten erzeugen:

1. `initial`: bevor eine Sprechertextphrase ausloest,
2. `before_<beat>`: direkt vor jeder Triggergruppe,
3. `after_<beat>`: nach Abschluss jeder Triggergruppe,
4. `end`: vollstaendiger Zielzustand.

Wenn eine Gruppe gleichzeitig mehrere Aktionen ausfuehrt, auch einen
Zwischenframe pruefen.

## Rubrik Pro Zustand

Jede Frage mit `pass`, `fail` oder `not_applicable` bewerten.

### Verstaendnis

- Der sichtbare Inhalt passt zu dem, was bis hierhin gesprochen wurde.
- Die naechste Aussage kann auf dem sichtbaren Kontext aufbauen.
- Kein Ergebnis oder Begriff wird vorweggenommen.
- Der Zustand ist ohne Kenntnis des DOMs als fachliche Einheit lesbar.

### Gruppenintegritaet

- Keine Karte erscheint ohne Text oder Icon.
- Kein Listenmarker oder Abschnittslabel steht allein.
- Kein Pfeil erscheint ohne alle benoetigten Endpunkte.
- Keine Fuehrungslinie erscheint ohne Marker und Label.
- Keine Datenreihe erscheint ohne direkt zugehoerige Legendenlogik.

### Fokus

- Es gibt hoechstens einen primaeren visuellen Fokus.
- Bereits erklaerter Kontext bleibt ruhig und ausreichend sichtbar.
- Ein Highlight betont nur bereits eingefuehrten Inhalt.
- Ein Hide entfernt keinen weiterhin benoetigten Kontext.

### Bewegung

- Richtung und Dauer passen zur fachlichen Aussage.
- Ein Draw folgt dem Verlauf oder der Leserichtung.
- Ein Transform zeigt eine echte Zustandsaenderung desselben Objekts.
- Die Bewegung endet exakt im freigegebenen statischen Layout.
- Kein Effekt wirkt dekorativ, verspielt oder hektisch.

### Technik

- Sichtbare Targets entsprechen dem Plan.
- Verborgene Targets besitzen keine Restdeckkraft oder sichtbare Fragmente.
- Gleichzeitig geplante Gruppen starten im selben Triggerfenster.
- Reviewer und Zielruntime zeigen dieselbe beabsichtigte Wirkung.
- Keine unbekannten Aktionen oder Parameter sind im Manifest.

## Szenenweite Abschlussfragen

- Ist Frame 0 bewusst gestaltet und nicht nur ein technischer Nebeneffekt?
- Ist die Zahl der Schritte geringer als die Zahl technischer SVG-Bauteile?
- Folgt die Abfolge der fachlichen Logik und dem Sprechertext?
- Sind alle Abhaengigkeiten vor oder gleichzeitig mit ihrem Verbraucher sichtbar?
- Waere eine statische Darstellung klarer?
- Ist der Endzustand ohne abgespielte Animation vollstaendig verstaendlich?

Jedes `fail` blockiert die Freigabe oder braucht eine ausdruecklich dokumentierte
Ausnahme.
