# RE4 Review-Audit · Titelhierarchie und Merkleiste

## Szene(n)

- modulweit: alle 22 kanonischen RE4-Szenen
- besonders sichtbar: `slide_013`
- positive Referenz für Unterteilungen: `slide_021`

## Nutzerbeobachtung

Die untere Merkleiste weicht sichtbar von der freigegebenen RE3-Komponente ab.
Außerdem werden einzelne Kicker wie `Quantitative Fehlerbaumanalyse` als zweite
Szenentitel gelesen, obwohl der eigentliche Titel downstream ergänzt wird.

## Reproduzierte Ursache

RE4 verwendete eine lokale `bottomBand()`-Variante bei `y=932` ohne den grünen
Corporate-Faden und mit abweichender Typografie. Gleichzeitig wurde
`sectionLabel()` teilweise für den eigentlichen Themenbegriff statt für eine
Unterteilung genutzt. Dadurch entstand insbesondere in Szene 13 eine doppelte
Titelhierarchie.

## Lokale Korrektur

- `bottomBand()` geometrisch und typografisch an RE3 angeglichen:
  `x=92`, `y=858`, `1736×84`, 25 px Text und 8 px signalgrüner Corporate-Faden.
- Dichte Inhalte oberhalb der Leiste neu ausgerichtet, ohne Inhalte zu entfernen.
- Szene 13: sichtbaren Themenkicker entfernt; der beschreibende Lernweg bleibt.
- Szene 31: Kopfzeile zu `Grundidee · RBD` präzisiert.
- Szene 61: Kopfzeile zu `Methodenspektrum` präzisiert.
- Szene 62: Kopfzeile zu `Drei Prüffragen` präzisiert.
- Szene 21 bleibt als positive Referenz unverändert, weil `Eingang`, `Logik` und
  `Ergebnis` echte Kategorien der Szene darstellen.

## Reichweite

- Primär: `project_rule`
- Sekundär: `module_pattern`

## Übertragbare Regel

Ein sichtbarer Kicker darf den downstream gerenderten Szenentitel nicht
wiederholen. Er muss eine echte Unterteilung, Kategorie, Bedingung oder
Leserichtung benennen. Wiederkehrende Merk- und Takeaway-Leisten werden aus dem
Referenzmodul technisch identisch übernommen statt lokal neu gestaltet.

## Aktualisierte Schubladen

- `tools/re4-creative-builders.js`
- `tools/re4-transparent-content.test.js`
- `.agents/skills/redesign-reltest-slides/references/review-derived-design-rules.md`

## Verifikation

- alle 22 Endzustände in 1920×1080 neu gerendert und als zwei Kontaktbögen geprüft
- `slide_013`, `slide_021` und `slide_055` zusätzlich in 19 Animationszuständen geprüft
- direkter visueller Vergleich der Merkleiste mit RE3 `slide_001`
- Strict-Design-, Manifest- und gerenderte Layout-QA: 0 Fehler, 0 Warnungen
- Regressionstests für Content-SVG-Vertrag, Kartenfreiheit, RE3-Merkleiste und
  Titeltrennung: 4 von 4 bestanden
