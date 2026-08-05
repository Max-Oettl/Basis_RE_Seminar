# RE2 Source Refresh Audit

## Anlass

- Nutzerhinweis: Der vollständige RE2-SVG-Satz wurde wegen zahlreicher Dopplungen ausgetauscht; die Sprechertexte sollen von vorne neu verknüpft werden.
- Aktiver Eingang: `source-materials/basis-seminar/powerpoint-svg/RE2/SVG/Folie1.SVG` bis `Folie165.SVG`
- Frühere RE2-Zuordnungen und Dubletten-Audits sind historische Referenzen und keine gültige Nummerierungsgrundlage für den neuen Eingang.

## Neuaufbau

- Alle 165 SVGs wurden neu inventarisiert; die Nummerierung ist lückenlos von 1 bis 165.
- Alle vier RE2-DOCX-Dateien wurden erneut verlustfrei extrahiert.
- Die Zuordnung wurde anhand sichtbarer SVG-Titel, fachlicher Inhalte und der aktiven Folienfolge neu aufgebaut:
  - Einführung in qualitative Methoden: Folien 1 bis 19
  - Fehlerbaumanalyse: Folien 20 bis 62
  - FMEA: Folien 63 bis 165
- Der aktive SVG-Satz enthält keine unmittelbar wiederholten SHA-256-identischen Einzelzustände oder Sequenzblöcke.
- Alle 165 aktiven SVGs besitzen genau einen gemappten, nicht leeren Sprechertext.

## Viewer-Anbindung

- Ursache des fehlenden Sprechertexts im Viewer: Der Viewer las bisher nur Szenenpläne beziehungsweise Folienanalysen, nicht das kanonische `RE2_svg-text-map.json`.
- Korrektur: Das SVG-Text-Mapping ist nun eine schreibgeschützte Sprechertextquelle des Viewers, sofern kein freigegebener Szenenplan den Text übersteuert.
- Gemeinsame Aufbaufolgen behalten ihre `shared_text_group`; der Viewer liefert dafür die vollständige aktive Foliengruppe.
- Die Abschnittstitel aus dem Mapping werden als Viewer-Titel verwendet, wenn noch kein Szenen- oder Analysetitel existiert.

## Kapitel- und Lektionsstruktur

Die vom Nutzer gelieferte Gliederung ist verbindlich in `analysis/viewer-notes/training-structure.json` hinterlegt:

- Kapitel 1: 1 Lektion, Folien 1 bis 3
- Kapitel 2: 6 Lektionen, Folien 4 bis 19
- Kapitel 3: 4 Lektionen, Folien 20 bis 62
- Kapitel 4: 9 Lektionen, Folien 63 bis 165

Alle 165 Folien sind genau einmal zugeordnet. Ein deterministischer Test prüft die 20 angegebenen Bereichsgrenzen sowie die vollständige und überschneidungsfreie Abdeckung.

## Lernprotokoll

- Szene(n): gesamtes Modul RE2, Folien 1 bis 165
- Nutzerbeobachtung: Der Quell-SVG-Satz wurde vollständig ersetzt; bestehende Sprechertextverknüpfungen waren deshalb nicht mehr vertrauenswürdig.
- Reproduzierte Ursache: Die frühere Zuordnung enthielt Nummernlücken aus archivierten Dubletten, während der neue Satz flach und lückenlos neu nummeriert ist. Außerdem verwendete die Viewer-API das SVG-Text-Mapping bisher nicht als Sprechertextquelle.
- Lokale Korrektur: DOCX-Extraktion, Alignment-Plan und Mapping wurden neu erzeugt; anschließend wurde das Mapping direkt an den Viewer angebunden.
- Reichweite: `module_pattern`
- Übertragbare Regel: Nach einem vollständigen Austausch nummerierter Quell-SVGs müssen Inventar, Hashes und Alignment neu erzeugt werden. Ein bestehendes Mapping darf nicht allein anhand gleicher Foliennummern weiterverwendet werden.
- Aktualisierte Schubladen: `analysis/source-text/RE2/`, `analysis/inventories/RE2_svg-text-map.json`, `tools/basis-rebuild-viewer/server.js`
- Verifikation: 165/165 SVGs gemappt; 165/165 RE2-Folien liefern in der Viewer-API Sprechertext; 9/9 relevante automatisierte Tests bestanden.

## Offener Quellenbefund

Der bearbeitete FMEA-Sprechertext enthält weiterhin den zusätzlichen Abschnitt `section_025` „Zusammenfassung der Design- und Prozess-FMEA“. Der neue SVG-Satz endet mit Schritt 7 auf Folie 165 und enthält keine entsprechende Zusammenfassungsfolie. Dieser Textabschnitt ist im Alignment-Plan ausdrücklich auf die Bearbeitung von Kapitel 4 verschoben und nicht gelöscht. Dadurch ist die strikte Zuordnungsprüfung für die 165 vorhandenen SVGs wieder erfolgreich; die spätere Entscheidung über eine zusätzliche Zusammenfassungsszene bleibt nachvollziehbar offen.

## Restrisiko

Eine visuelle Viewer-Prüfung war am 2026-07-24 nicht möglich, weil kein Browser-Backend verfügbar war. Die API-, Mapping- und Unit-Prüfungen waren erfolgreich.
