# RE1 – Kapitel 2 – Folien- und Animationsreview

Prüfumfang: Szenen 14 bis 26, jeweils Endzustand und jeder Animationszustand.

| Szene | Grafik | Animation | Ergebnis |
|---|---|---|---|
| 14 | Badewannenkurve mit quellnaher Bereichszuordnung: qualitative Methoden und Risikoreduktion spannen über Bereich 1 und 2, quantitative Methoden und Nachweis nur über Bereich 3 | Kurve und beide vollständigen Methodenschwerpunkte erscheinen erst mit ihrer fachlichen Nennung | bestanden |
| 15 | Zwei klar getrennte Methodenkarten | redundantes Zwischenbanner entfernt; qualitative und quantitative Karte einzeln in Sprecherreihenfolge | bestanden |
| 16 | Kooperationsmodell mit zwei gleichwertigen Beiträgen | Verbindungen werden erst beim abschließenden Zusammenspiel gezeichnet | bestanden |
| 17 | Lebenszyklus und fünf Managementphasen als kompakte Übersicht | vollständige Phasenzeilen erscheinen nacheinander | bestanden |
| 18 | Zieltreiber, Zielkaskade und Lastkollektiv klar getrennt | jede fachliche Einheit wird als geschlossene Gruppe eingeblendet | bestanden |
| 19 | Vierstufiger Analyseprozess mit Education-PNG-Piktogrammen | jeder Verbindungspfeil erscheint erst gemeinsam mit seinem Zielschritt | bestanden |
| 20 | Methodenmatrix in Leserichtung 1–2 / 3–4 neu geordnet | P-Diagramm, Blockschaltbild, Fehlerbaum und FMEA folgen Sprechertext und räumlicher Leserichtung | bestanden |
| 21 | Testkern mit zwei deutlich getrennten Pfaden | jeweiliger Pfeil erscheint mit dem zugehörigen Zielpfad | bestanden |
| 22 | Testmethoden als stabiler Kontext, drei Zielklassen als Fokus | Zielklassen erscheinen einzeln in Sprecherreihenfolge | bestanden |
| 23 | Produktionspipeline mit drei Stufen und Ergebnisband | Pfeile erscheinen mit der jeweils nachfolgenden Stufe | bestanden |
| 24 | funktionale, qualitative und quantitative Absicherung | Stufen erscheinen vollständig und ohne vorauseilende Verbindung | bestanden |
| 25 | Produkt- und Produktionsabsicherung über Stichprobe verbunden | zuerst die im Sprechertext genannte Serien-Stichprobe, danach Produktionsplanung | bestanden |
| 26 | Feldbeobachtung, Auswertung und Lernschleife | Verbindungen und Rückkopplung erscheinen erst mit Zielkarte beziehungsweise Lessons Learned | bestanden |

## Technische Nachweise

- Strenge SVG-, Design- und Layout-QA: 0 Fehler, 0 Warnungen.
- 13/13 Content-Crosschecks bestanden.
- Piktogramm-PNG-Policy: 0 Fehler in 13 Szenen.
- Viewer-Mapping und Animationsmanifeste für Szenen 14–26 vollständig.
- QA-Korrektur: Unsichtbare, absichtlich noch nicht ausgelöste Animationsziele können explizit mit `data-qc-allow-hidden="true"` gekennzeichnet werden; dadurch werden echte Sichtbarkeitsfehler weiterhin erkannt, geplante Anfangszustände aber nicht fälschlich beanstandet.

## Verwendete Piktogramme

Die Kapitelgrafiken verwenden eingebettete, freigestellte Education-PNGs. Symbol, sichtbare Beschriftung und zugehörige Karte bilden jeweils eine gemeinsame semantische Animationsgruppe.

## Feedback-Lernprotokoll – Szene 14 – 2026-08-01

- Szene: RE1 Szene 14.
- Nutzerbeobachtung: Die Ergebnisboxen erklärten ihre Zuordnung redundant mit `Fälle 1 und 2` beziehungsweise `Fall 3`; die Fokusboxen überlappten außerdem die Bereichsnummern.
- Reproduzierte Ursache: Die Boxbreiten waren unabhängig von den drei Plotbereichen gewählt und die oberen Boxen zu tief positioniert.
- Lokale Korrektur: Grüne Fokus- und Ergebnisbänder exakt über Bereich 1 und 2 gespannt, goldene Bänder auf Bereich 3 begrenzt, Falltexte entfernt und obere Bänder mit sicherem Abstand oberhalb der Nummern angeordnet. Nach dem erneuten Nutzerfeedback bleiben `Lebensdauerversuche`, `Berechnungen` und `Simulationen` bewusst nur im Sprechertext; die sichtbare Ergebnisbox lautet ausschließlich `Nachweis der Zuverlässigkeit`.
- Reichweite: `module_pattern` und `domain_rule` für bereichsbezogene Diagrammbänder.
- Übertragbare Regel: Horizontale Zuordnung primär durch exakte Spannweite und Farbe vermitteln; Nummern nicht redundant wiederholen und Fokusbänder nicht mit Bereichsmarkern kollidieren lassen.
- Aktualisierte Schubladen: Generator für RE1 Szene 14 sowie `review-derived-design-rules.md`.
- Verifikation: Quellenvergleich und vier Animationszustände visuell bestanden; statische Design-QA 0/0, gerenderte Layout-QA 0/0, Content-Crosscheck 13/13.

## Feedback-Lernprotokoll – Kapitel 2 – Viewer-Notizen 2026-08-01

- Szene(n): RE1 Szenen 14–18, 20, 22, 24–26; Szenen 19, 21 und 23 wurden ohne Änderungsnotiz erneut geprüft.
- Nutzerbeobachtung: Einzelne Darstellungen waren trotz grundsätzlich guter Kapitelstruktur noch zu weit von der Quelle entfernt oder in der verkleinerten Ansicht nicht eindeutig genug. Betroffen waren Kurvenhöhe und Beschriftung, fehlende PNG-Lernanker, Piktogramm-/Titel-Ausrichtung, die fehlende explizite Lebenszykluszuordnung, zu kleine Diagrammpfeile, eine ausgelassene offene Quellkategorie, uneinheitliche Überschriftengrößen, ein unnötiges Piktogramm und fehlende Bullets.
- Reproduzierte Ursache: Mehrere lokale Komponenten waren vor dem Nutzerreview primär auf Vollbildwirkung optimiert. Beziehungen aus der Quelle wurden teilweise nur durch räumliche Nähe angedeutet; einige gleichrangige Inhalte waren als Textzeilen statt als Liste gesetzt; die Inhaltsprüfung behandelte Beispiele teilweise wie Ersatz für eine offene Quellkategorie.
- Lokale Korrektur: Szene 14 quellnäher aufgebaut; zwei neue freigestellte Education-PNG-Piktogramme für Szene 15 erzeugt und registriert; Szene 16 ausgerichtet; Szene 17 mit expliziter Zuordnung jeder Zuverlässigkeitsphase zum Produktlebenszyklus versehen; Phasenbezeichnung in Szene 18 präzisiert; Mini-Diagramme und Abstände in Szene 20 korrigiert; `Other …` in Szene 22 wiederhergestellt; Szenen 24–26 typografisch und strukturell bereinigt.
- Reichweite: `module_pattern` für die fünf Zuverlässigkeitsphasen; `project_rule` für Quell-Auffangkategorien und echte Aufzählungen; `domain_rule` für kompakte Methodendiagramme und Lebenszykluszuordnungen; lokale Geometriekorrekturen für Szenen 14, 16, 24 und 25.
- Übertragbare Regel: Eine Zuordnung muss als Zuordnung sichtbar sein; offene Quellkategorien dürfen nicht durch Beispiele ersetzt werden; kompakte Pfeile müssen im Viewer-Maßstab vollständig lesbar bleiben; unabhängige Prüfpunkte brauchen echte Bullets; bewusst nur gesprochene Inhalte werden in den Anforderungen als `spoken_only_terms` dokumentiert.
- Aktualisierte Schubladen: RE1-Generator, Kapitel-2-Anforderungen und Redesignplan, Piktogramm-Registry samt Assetdokumentation, `review-derived-design-rules.md` sowie Viewer-Reviewhistorie.
- Verifikation: 13/13 Content-Crosschecks bestanden; scoped strenge SVG-/Design-/Layout-QA 0 Fehler und 0 Warnungen; Piktogramm-PNG-Policy 0 Fehler in 13 Szenen; 53 Animationszustände visuell geprüft; Kapitelkontakt in 1920×1080 und verkleinerter Ansicht geprüft. Zehn offene Viewer-Notizen wurden nach Archivierung des jeweiligen Vorherstands auf `final` gesetzt; Szene 21 war bereits final.
