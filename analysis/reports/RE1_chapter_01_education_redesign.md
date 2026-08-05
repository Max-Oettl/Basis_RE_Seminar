# RE1 · Kapitel 1 · Education-Redesign

## Ergebnis

Die Szenen `slide_001` bis `slide_013` wurden als zusammenhängendes Kapitel im RelTest-Education-System neu gestaltet und erneut mit dem Sprechertext verknüpft.

- Lektion 1: Szenen 1–8
- Lektion 2: Szenen 9–13
- Content-SVGs enthalten keine sichtbaren Titel-, Footer-, Logo- oder Szenenlabel-Elemente des nachgelagerten Video-Masters.
- Oxanium wird nur für Display-Zahlen eingesetzt; Archivo ist die Schrift für Text, Labels und Diagramme.
- Primärfarbe ist Education Green `#00A754`; Navy `#031334`, Gold, Coral und Steel Cyan dienen funktionalen Rollen.
- Pfeile und Verbinder bleiben zurückhaltend und erscheinen nicht vor den zugehörigen Zielobjekten.

## Animationsdramaturgie

Für jede Szene liegt ein eigener `animation-dramaturgy-plan.json` vor. Die Pläne definieren:

- den sinnvollen Frame-0-Kontext,
- semantische Gruppen,
- exakte Sprechertext-Trigger,
- Abhängigkeiten zwischen Gruppen,
- zurückhaltende Effekte,
- Vorher-/Nachher- und Endzustandsprüfungen.

Wesentliche Entscheidungen:

- Fallstudien: Bildkontext bleibt sichtbar; Ursache und Auswirkung werden sprechertextgeführt ergänzt.
- Haftungsbaum: Jede Verbindung erscheint atomar mit ihrer Zielkarte.
- Systemhierarchie: PKW als Ausgangskontext, danach Struktur, Funktionen und Fehlerfortpflanzung.
- Stress-Strength-Folgen: Achsen und Vergleichskontext bleiben stabil; Kurven, Überlappung und Konsequenzen erscheinen in fachlicher Reihenfolge.
- Definition: Die fünf Bestandteile der Zuverlässigkeitsdefinition erscheinen als eine semantische Aussage.

## Technische Umsetzung

- Produktionsgenerator: `tools/generate-re1-full-slide-redesign.js`
- Dramaturgie-Generator: `tools/build-re1-chapter1-animation-dramaturgy.js`
- Diagramm-Normalisierung: `tools/normalize-re1-chapter1-plot-assets.js`
- Kapitelplan: `analysis/rebuild-plans/RE1_chapter_01_education_redesign_plan.md`
- Szenenplan: `analysis/rebuild-plans/RE1_scene-plan.json`

Die Python-Quellen der Diagramme wurden auf die Education-Tokens und die neue Typografie vorbereitet. Für die Feedbackkorrektur 2026-07-31 wurden die Stress-Strength-Plots mit dem lokalen headless Matplotlib-Backend neu berechnet, anschließend deterministisch auf Education-Farben, Archivo und QA-Metadaten normalisiert und erneut in die Szenen eingebettet.

## Qualitätssicherung

- Kapitel-QA für Szenen 1–13: **0 Fehler**
- Strenge Markenprüfung: **0 Fehler, 0 Warnungen**
- Layoutprüfung in vier Zuständen (`0`, `0.5`, `1`, `end`): **0 Fehler**
- Inhalts-/Sprechertext-Crosscheck des vorhandenen Batches 1–15: **15/15 bestanden**
- Modul-Szenenplan: **0 Fehler**; die 21 Warnungen betreffen ausschließlich spätere, noch offene Szenen außerhalb von Kapitel 1
- Education- und Animationsregressionstests: **9/9 bestanden**

Die im globalen RE1-QA-Bericht verbleibenden Hinweise sind nicht blockierende Seitenverhältnis-Hinweise für eingebettete Diagramm-Assets sowie bereits vorhandene Assets außerhalb dieses Kapitels.

## Sichtprüfung

- Einzelrenderings: `analysis/render-checks/RE1/chapter-01-education/final-previews`
- Kontaktbogen: `analysis/render-checks/RE1/chapter-01-education/contact-sheets/contact_slide_001_slide_013.png`
- QA-Bericht: `analysis/render-checks/RE1/chapter-01-education/chapter-qa/svg-qa-report.md`

Der Kontaktbogen zeigt eine konsistente Kapitelserie ohne sichtbare Master-Chrome, mit einheitlicher Typografie, Farbdramaturgie und Diagrammsprache.

## Feedback-Lernprotokoll · Piktogramme in Szenen 10 und 12

- Szenen: `slide_010` und `slide_012`
- Nutzerauftrag: Die Piktogramme nach der Verschärfung des Education-Piktogrammworkflows neu erstellen.
- Reproduzierte Ursache: Nach der ersten Stilkorrektur wurden Piktogramme fälschlich als native SVG-Geometrie umgesetzt. Das widersprach der gewünschten Produktionsweise und erzeugte erneut eine sichtbar technische, zu schwache Icon-Anmutung.
- Lokale Korrektur: Kosten, Produkthaftung, Kundenunzufriedenheit und Zielkonflikt wurden als vier eigenständig generierte, freigestellte PNG-Piktogramme im Education-Stil neu erstellt. Szene 10 bindet drei PNGs in die Konsequenzkarten ein; Szene 12 verwendet eine generierte PNG-Waage. Das Szenen-SVG enthält für diese Motive keine nachgebauten Piktogramm-Pfade.
- Reichweite: `module_rule` und `project_rule`
- Übertragbare Regel: Jedes neue oder veränderte Piktogramm wird ausnahmslos als generiertes transparentes PNG produziert. Das gilt auch für universelle Motive. SVG-Geometrie und SVG-Iconbibliotheken sind dafür gesperrt.
- Aktualisierte Schubladen: PNG-Piktogrammbibliothek, Rasterregistry, Assetvalidator, PNG-Policy-QA, RE1-Produktionsgenerator und szenenspezifische Piktogramm-Briefs.
- Verifikation: Vier Assetfreigaben ohne Fehler oder Warnungen, PNG-Policy-QA, 1920-x-1080-Render, 960-x-540-Viewerprüfung sowie strenges Layout- und Design-QA.

## Feedback-Lernprotokoll · Szene 1

- Szene: `slide_001`
- Nutzerbeobachtung: Das konkrete Triebwerksfoto war bereits sichtbar, obwohl der Sprecher zunächst allgemein über unzuverlässige Produkte und Rückrufaktionen spricht.
- Reproduzierte Ursache: Das Foto wurde fälschlich als neutraler `visible_context` klassifiziert; die Beat-Liste begann außerdem erst beim ersten Reveal und ließ die allgemeinen Einleitungsbeats aus.
- Lokale Korrektur: Der Anfangszustand enthält nur noch den ruhigen Marken-/Downstream-Rahmen. Foto, Quellenzeile und technische Fallkarte erscheinen gemeinsam bei „Ein Fall aus der jüngsten Vergangenheit“.
- Reichweite: `project_rule` und `qa_gap`
- Übertragbare Regel: Jedes inhaltstragende Element erhält einen `firstRelevantBeatId`. Konkrete Bilder sind keine Dekoration und dürfen nicht vor ihrer ersten fachlichen Relevanz erscheinen. Beats ohne Reveal bleiben Teil der vollständigen Narrationsanalyse.
- Aktualisierte Schubladen: Animationsskill, Entscheidungsreferenz, kanonischer Animationsworkflow, Planvorlage und Planvalidator.
- Verifikation: Skill-Test, Planvalidator, Szenen-QA und Zustandsprüfung.

## Feedback-Lernprotokoll · Szene 8

- Szene: `slide_008`
- Nutzerbeobachtung: `Machen Sie zwei daraus.` gehört in der Quelle noch zum SKF-Zitat und darf nicht als separate Interpretation dargestellt werden.
- Reproduzierte Ursache: Die Schlusszeile wurde wegen der allgemeinen Du-Sprachregel fälschlich umformuliert und zusammen mit der praktischen Bedeutung in eine Ergebnisbox verschoben. Dabei wurde übersehen, dass direkt zitierter Quelltext seine originale Form behält.
- Lokale Korrektur: Zitatkarte um die Originalzeile ergänzt; Zitatkörper und Schlusszeile bleiben räumlich verbunden, werden aber passend zum Sprechertext nacheinander eingeblendet. Die praktische Bedeutung besitzt eine eigene Ergebnisbox. Das Anlagenmotiv erscheint erst bei der SKF-Nennung.
- Reichweite: `domain_rule` und `animation_grouping`
- Übertragbare Regel: Direkte Zitate werden in Inhalt und visueller Zugehörigkeit quellgetreu erhalten. Sprachliche Projektregeln überschreiben keine bewusst zitierte Originalformulierung. Eine zitierte Pointe darf animiert später erscheinen, bleibt aber Bestandteil der Zitatgruppe.
- Verifikation: Animationsplan `0` Fehler/`0` Warnungen; Strict-Design- und Layout-QA `0` Fehler/`0` Warnungen.

## Feedback-Lernprotokoll · Szenen 10–12

- Szenen: `slide_010`, `slide_011`, `slide_012`
- Nutzerbeobachtung: Die Ausfälle sollen als Verteilung über den gesamten sichtbaren Überlappungsbereich erscheinen; Belastung und Belastbarkeit sollen gleich hoch sein.
- Reproduzierte Ursache: Der Plotgenerator verwendete eine mathematische Minimum-Hülle zweier ungleich breiter Normaldichten. Dadurch wirkten die Ausfälle wie eine mittige Schnittfläche und die Hauptkurven besaßen unterschiedliche Spitzenhöhen.
- Lokale Korrektur: Identische Streuung für beide Hauptverteilungen, explizit begrenzte sichtbare Trägerintervalle und eine eigenständige korallfarbene Ausfallverteilung mit Kontur. Bei der Rechtsverschiebung werden Breite und Höhe der Ausfallverteilung konsistent reduziert.
- Reichweite: `domain_rule` und `plot_qa`
- Übertragbare Regel: Eine in der Quelle dargestellte Ausfallverteilung ist nicht automatisch mit der Minimum-Hülle zweier Dichten gleichzusetzen. Spitzenhöhen, Trägerintervalle und Veränderungsrichtung sind als fachliche Beziehungen zu prüfen und explizit zu konfigurieren.
- Verifikation: Inhalts-Crosscheck `15/15`; Animationspläne aller vier Feedbackszenen `0` Fehler/`0` Warnungen; Strict-Design- und Layout-QA für Szenen 8, 10, 11 und 12 jeweils `0` Fehler. Die einzigen verbleibenden Hinweise sind erwartete Seitenverhältniswarnungen der eingebetteten Plotassets in 10–12.

### Zweite Graphenverfeinerung 2026-07-31

- Nutzerbeobachtung: Belastungs- und Belastbarkeitskurven zeigten an den künstlichen Trägergrenzen eckige Einstiege; das direkte Label `Ausfälle` stand zu eng an der Ausfallkurve. In Szenen 11 und 12 war das Innenlabel `Ausgangslage` nicht gewünscht.
- Reproduzierte Ursache: Die Hauptdichten wurden trotz ihrer mathematisch unbegrenzten Tails hart auf ein sichtbares Intervall beschränkt und nur über einen sehr kurzen Cosinus-Taper ausgeblendet.
- Korrektur: Beide Hauptdichten werden vollständig und damit natürlich auslaufend gezeichnet. Die begrenzte Ausfallverteilung verwendet eine analytisch glatte Kompaktstütze. Ihr Label steht in einer freien Diagrammzone und wird durch eine dezente Führungslinie mit der Kurve verbunden; Linie, Label, Füllung und Kontur bleiben eine gemeinsame Animationsgruppe. Das Textlabel `Ausgangslage` wurde aus Szenen 11 und 12 entfernt, die gestrichelte Vergleichskurve bleibt erhalten.
- Übertragbare Regel: Unbegrenzte Dichten werden nicht für einen optisch endlichen Kurvenfuß abgeschnitten. Kurvenlabels dürfen aus einer dichten Datenzone ausgelagert werden, benötigen dann aber eine eindeutige Führungslinie und dieselbe semantische Animationszugehörigkeit wie die beschriftete Reihe.
- Verifikation: Visuelle Kontrolle aller drei finalen Renderings; Inhalts-Crosscheck `15/15`; Animationsplanvalidierung für Szenen 10–12 jeweils `0` Fehler/`0` Warnungen; Strict-Design- und Layout-QA für alle drei Szenen jeweils `0` Fehler. Die einzelne Warnung pro Szene betrifft weiterhin ausschließlich das absichtlich nicht 16:9-formatige eingebettete Plotasset.

### Formkorrektur der Ausfallverteilung 2026-07-31

- Nutzerbeobachtung: Die zuletzt verwendete kompakt gestützte Ausfallverteilung war an den Schultern zu flach und entsprach nicht mehr der zuvor passenden Glockenform.
- Reproduzierte Ursache: Für den glatten Kurvenfuß war eine mathematische Bump-Funktion eingesetzt worden. Sie beseitigte zwar harte Enden, veränderte aber die gewünschte Quell-Silhouette.
- Korrektur: Die Ausfallverteilung verwendet wieder eine vollständige gaußförmige Glockenkurve mit weich auslaufenden Tails. Hauptkurven, Labelpositionen, Führungslinien und Animationsgruppen bleiben unverändert.
- Reichweite: `domain_rule`
- Übertragbare Regel: Eine technisch glatte Ersatzfunktion darf die fachlich beziehungsweise visuell vorgegebene Kurvenform nicht verändern. Zeigt die Quelle eine Glockenkurve, bleibt die Verteilung gaußförmig und wird nicht nur zur Erzeugung endlicher Trägergrenzen in eine Bump-Funktion umgeformt.
- Verifikation: Alle drei Endzustände in 1920×1080 visuell geprüft; Inhalts-Crosscheck `15/15`; Animationsplanvalidierung für Szenen 10–12 jeweils `0` Fehler/`0` Warnungen; Strict-Design- und Layout-QA jeweils `0` Fehler. Die einzelne bekannte Warnung je Szene betrifft ausschließlich das absichtlich nicht 16:9-formatige Plotasset.
