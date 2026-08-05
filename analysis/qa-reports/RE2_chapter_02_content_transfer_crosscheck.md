# Content-Transfer-Crosscheck — RE2 Kapitel 2

Status: **bestanden**

Prüfgrundlage:

- Quell-SVGs `Folie4.SVG` bis `Folie19.SVG`
- extrahierter Sprechertext `analysis/source-text/RE2/extracted/02_Modul_Qualitative Methoden - Einführung in qualitative Methoden.md`
- Ziel-SVGs unter `rebuild-proposals/svg/RE2/`
- Referenzmapping `analysis/rebuild-plans/RE2_source-reference-map.json`

| Zielszene | Quellen | Source → Target | Target → Source | Befund |
|---|---:|---|---|---|
| `slide_004` | 4–5 | PV-Komponenten, DC/AC-Pfade sowie beide Systemgrenzen vorhanden | Alle Komponenten und Grenzen sind fachlich belegt | bestanden |
| `slide_006` | 6–7 | Umwelt, System, Subsystem, Komponente und Wechselrichter-Fokus vorhanden | Keine zusätzliche Systemebene | bestanden |
| `slide_008` | 8 | Alle Parametergruppen und `System: Produkt / Prozess` vorhanden | Keine unbelegte Systemgrenze ergänzt | bestanden |
| `slide_009` | 9 | Wechselrichter, Ein-, Steuer-, Stör- und Zielgrößen vollständig | Keine zusätzliche Parameterklasse | bestanden |
| `slide_010` | 10 | Wirkung, fünf Ishikawa-Kategorien und alle Beispiele vorhanden | Keine unbelegte Ursache | bestanden |
| `slide_011` | 11–12 | Systemgrenze, Komponenten sowie Energie-, Stoff- und Informationsstrom vorhanden | Keine zusätzliche Flussart | bestanden |
| `slide_013` | 13 | Energiepfad, Steuerung, Überwachung, Nebenfunktionen, Kommunikation und Schnittstellen übertragen | Zonierung und Farben dienen nur der Strukturierung | bestanden |
| `slide_014` | 14–15 | Black Box, abstrakte Aufgabenbeschreibung und generische Funktionszerlegung vorhanden | Keine Wechselrichter-Teilfunktion vorweggenommen | bestanden |
| `slide_016` | 16 | Alle acht nummerierten Wechselrichter-Teilfunktionen und Beziehungen vorhanden | Keine zusätzliche Teilfunktion | bestanden |
| `slide_017` | 17 | Bauteile, Fehlermöglichkeiten und Ausfallmechanismen vollständig vorhanden | Noch keine ABC-Regel oder Bewertung vorweggenommen | bestanden |
| `slide_018` | 18 | Regeln für A-, B- und C-Teile einschließlich Berechenbarkeit und Ausfallverhalten vorhanden | Keine konkrete Komponentenbewertung ergänzt | bestanden |
| `slide_019` | 19 | Vollständige ABC-Einstufung aller gezeigten Ausfallmechanismen vorhanden | FTA-Überleitung ist durch den Sprechertext belegt | bestanden |

Bewusste Transformationen:

- Die PV-Szene verwendet konkrete, lokal eingebettete technische PNG-Motive.
- Die vormals zusammengezogenen Inhalte 14–16 und 17–19 wurden getrennt. Folie 16, 18 und 19 sind nun eigenständige Ziel-Szenen; fachliche Dopplungen wurden entfernt.
- Der gemeinsame RelTest-Academy-Rahmen ersetzt die unterschiedlichen Quell-Masterelemente, ohne Fachinhalt hinzuzufügen.
