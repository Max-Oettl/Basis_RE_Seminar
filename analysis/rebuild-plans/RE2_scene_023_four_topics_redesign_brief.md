# Redesign-Brief — RE2 Szene 23: Ziele der FMEA

## Scope

- Zielszene: Szene 23 / Work-Unit `slide_066`
- Szene-ID: `re2_ch4_fmea_goals`
- Quellfolie: 66
- Ausgabe: transparentes Content-SVG im 1920×1080-Koordinatensystem
- Änderungstyp: quellnahe Neugruppierung in vier gleichrangige Themenboxen

## Inhaltsinventar

### Beibehalten

- Titel und Stichpunkte der vier Themen werden wortgetreu übernommen.
- Die Anordnung der alten Folie bleibt erhalten: Ausfälle und Kosten links, Produktqualität und Dokumentation rechts.
- Jede Box bleibt eine eigenständige fachliche Einheit.

### Neu gruppieren

- Jedes Thema erhält genau eine Box, die Überschrift und beide Stichpunkte gemeinsam umfasst.
- Alle vier Boxen verwenden dieselbe Fläche, Kontur, Typografie und Bulletlogik, da keine Box fachlich wichtiger ist.

### Entfernen

- Die bisherige Umformulierung der Stichpunkte in erklärende Sätze entfällt.
- Dekorative Farbunterschiede zwischen gleichrangigen Boxen entfallen.
- Die Ergebnisfolge am unteren Rand der alten Folie wird nicht als zusätzliche Ebene nachgebaut, weil der Nutzer ausdrücklich nur je eine Box um die vier Themen wünscht und der Sprechertext die Zusammenfassung verbal trägt.

## Sichtbarer Quellinhalt

1. **Minimierung oder Vermeidung von Ausfällen**
   - Frühzeitige Erkennung potenzieller Fehler
   - Problemfreie Produkteinführung
2. **Reduktion der Kosten**
   - Vermeidung von Nachbesserungen
   - Effiziente Nutzung von Ressourcen
3. **Steigerung der Produktqualität**
   - Aufdeckung von Schwachstellen
   - Maßnahmen zur Verbesserung
4. **Dokumentation**
   - Wissensaustausch im Team
   - Einhaltung regulatorischer Anforderungen

## Visuelle Entscheidung

- Vier identische marineblaue Boxkonturen auf derselben hellen Fläche.
- Marineblau trägt Titel, Text und Grundordnung; Stahlcyan wird ausschließlich und einheitlich für die Pfeil-Bullets eingesetzt.
- Keine Piktogramme, Prozesspfeile oder zusätzliche Hierarchieebene.
- Primärtext bleibt mindestens 22 px groß und auch in der verkleinerten Vieweransicht lesbar.

## Animation

- Entscheidung: `animated`, da der Sprechertext die vier Ziele nacheinander erklärt.
- Jede Box ist eine atomare Gruppe aus Fläche, Rand, Titel und beiden Stichpunkten.
- Reihenfolge: Ausfälle → Kosten → Produktqualität → Dokumentation.
- Animation erst nach bestandenem statischem Quellen-Ziel-Vergleich.

## Prüfschwerpunkte

- Wortgetreuer Abgleich aller vier Titel und acht Stichpunkte mit Quellfolie 66.
- Identische Farb- und Formbehandlung aller vier Boxen.
- Kein Textüberlauf bei 1920×1080 und in reduzierter Ansicht.
- Keine Boxbestandteile in getrennten Animationsschritten.

## Status

- Brief: abgeschlossen
- Statische Freigabe: bestanden; Quellen-Ziel-Vergleich sowie strikte Layout- und Designprüfung ohne Befund
- Animationsfreigabe: bestanden; vier atomare Box-Reveals, Manifestvalidierung 0 Fehler / 0 Warnungen
