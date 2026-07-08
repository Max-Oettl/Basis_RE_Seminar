# Decision 0001: Repo-Struktur fuer SVG-Produktion

## Status

Akzeptiert

## Kontext

Das Repo soll zur Erstellung konsistenter SVG-Dateien fuer Reltest Academy Schulungsvideos genutzt werden. Die SVGs dienen als visuelle Folien fuer ein E-Learning-Programm zur Zuverlaessigkeitstechnik fuer Ingenieure.

Die SVGs werden spaeter mit KI-gesprochenem Text zu Videos kombiniert. Zukuenftig sollen Satz-Triggerpunkte im Sprechertext bestimmte SVG-Elemente aktivieren.

## Entscheidung

Das Repo wird in folgende Bereiche gegliedert:

- `agents/` fuer Rollen und Arbeitsanweisungen
- `brand/` fuer Design- und Markenregeln
- `templates/` fuer wiederverwendbare Vorlagen
- `trigger-specs/` fuer Triggerregeln und offene technische Fragen
- `decisions/` fuer wichtige Projektentscheidungen
- `svg/` fuer finale SVG-Dateien
- `metadata/` fuer begleitende Lern- und Triggerinformationen
- `examples/` fuer Beispielauftraege und Beispieloutputs

## Konsequenzen

- Neue SVGs koennen konsistent produziert werden.
- Rollenbasierte Pruefung hilft bei Didaktik, Fachlichkeit, Design und Technik.
- Die spaetere Trigger-Pipeline kann integriert werden, ohne bestehende SVGs komplett neu aufzubauen.

