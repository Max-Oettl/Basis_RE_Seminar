# RE2 Feedback Audit: doppelte Flugzeugfahrwerk-Sequenz

> Historischer Audit des vorherigen SVG-Eingangs. Der aktive RE2-SVG-Satz wurde am 2026-07-24 vollständig ausgetauscht und wird in `RE2_source_refresh_audit.md` dokumentiert.

## Lernprotokoll

- Szene(n): Quell-SVGs 52 bis 63, FTA-Beispiel Flugzeugfahrwerk
- Nutzerbeobachtung: Das Beispiel mit dem Flugzeugfahrwerk ist zweimal im Modul enthalten.
- Reproduzierte Ursache: `Folie52.SVG` bis `Folie57.SVG` sind jeweils SHA-256-identisch zu `Folie58.SVG` bis `Folie63.SVG`. Es handelt sich um einen vollständig wiederholten Exportblock und nicht nur um wiederkehrende Navigationszustände.
- Lokale Korrektur: Die aktive Sequenz 52 bis 57 bleibt erhalten. Die bestätigte zweite Kopie 58 bis 63 wurde recoverbar nach `source-materials/basis-seminar/powerpoint-svg-duplicates/RE2/` verschoben, aus dem Alignment entfernt und das SVG-Text-Mapping neu erzeugt.
- Reichweite: `qa_gap`
- Übertragbare Regel: Ein unmittelbar wiederholter Block aus mindestens zwei SHA-256-identischen SVG-Zuständen wird beim Text-Mapping als möglicher doppelter Export gemeldet und nicht automatisch als zweite Lernsequenz akzeptiert. Einzelne identische Navigations- oder Schrittzustände sind kein ausreichender Löschgrund.
- Aktualisierte Schubladen: `workflow/10-source-analysis/source-text-docx-intake-and-mapping.md`, `tools/validate-svg-text-map.js`, `tools/svg-text-map-duplicate-sequence.test.js`
- Verifikation: 166 aktive RE2-SVGs, 166 SVG-Text-Mappings, Folien 52 bis 57 vorhanden, 58 bis 63 nicht aktiv, im Viewer/API folgt nach 57 die Folie 64. Der neue QA-Test erkennt wiederholte Mehrfolienblöcke und ignoriert isolierte gleiche Zustände.

## Restrisiken

- Die strikte Freigabe des gesamten RE2-Text-Mappings bleibt unabhängig von dieser Korrektur wegen des zusätzlichen FMEA-Zusammenfassungstexts `section_025` ohne Quell-SVG gesperrt.
- Eine visuelle Viewer-Prüfung war am 2026-07-24 nicht möglich, weil kein Browser-Backend verfügbar war; die Viewer-API wurde erfolgreich geprüft.

## Folgeaudit: doppelte Folien 102 und 103

- Szene(n): Quell-SVGs 102 und 103, FMEA-Schrittfolge
- Nutzerbeobachtung: Folie 102 und 103 sind doppelt.
- Reproduzierte Ursache: Beide SVG-Dateien besitzen denselben SHA-256-Hash `62aa1e6f564a4e1750e8eb6b8c3d1861c3aa2095aad2f9558c913a6f4794d925`.
- Lokale Korrektur: Folie 102 bleibt aktiv. Folie 103 wurde recoverbar in das bestehende RE2-Dublettenarchiv verschoben und aus der Sprechertext-Zuordnung entfernt.
- Reichweite: `qa_gap`
- Übertragbare Regel: Auch ein einzelner unmittelbar wiederholter, SHA-256-identischer SVG-Zustand wird als möglicher Doppelexport gemeldet. Der Treffer wird fachlich geprüft und nicht automatisch gelöscht. Nicht benachbarte identische Zustände bleiben davon unberührt.
- Regel-Promotion: Da derselbe Fehlermechanismus im Modul erneut auftrat, ist die Prüfung nun als projektweite Intake-QA-Regel dokumentiert.
- Aktualisierte Schubladen: `workflow/10-source-analysis/source-text-docx-intake-and-mapping.md`, `tools/validate-svg-text-map.js`, `tools/svg-text-map-duplicate-sequence.test.js`
- Verifikation: 165 aktive RE2-SVGs und 165 SVG-Text-Mappings; im Viewer/API folgt nach Folie 102 direkt Folie 104. Die Dubletten- und Discovery-Tests bestehen mit 6/6 Tests. Eine visuelle Viewer-Prüfung war nicht möglich, weil weiterhin kein Browser-Backend verfügbar ist.
