# Unabhängige visuelle QA – RE4 Szene 48 und Nachprüfung 39

Datum: 17.09.2026. Prüfung durch den separaten Review-Agenten. Keine Produktionsdateien geändert; keinen Browserprozess gestartet.

## Szene 48 – bestanden

Geprüft: `after/slide_048.png` und alle 21 PNGs in `states/slide_048`, jeweils in 1920 × 1080 und auf 960 × 540 reduziert. Quellen 48–52 und Narrationsplan wurden abgeglichen. Abschließend wurde die neuere Fassung `states-reviewed/slide_048` nachgeprüft: Frame 17 in beiden Größen, Frame 18 in voller Größe; alle übrigen 20 Frames einschließlich 18 sind per SHA-256 identisch zur zuvor geprüften Fassung.

- Die drei Annahmen sind vollständig und in der gesprochenen Reihenfolge aufgebaut: zwei Zustände, keine Reparatur im Modell, unabhängige Komponenten.
- Rechts erscheint zuerst die intakte Serie. Der Ausfall von Komponente 2 wird danach eindeutig mit Kreuz und passender Beschriftung dargestellt. Der ausgefallene Zustand wird nicht als repariert zurückgenommen.
- Die Annahmen bleiben beim Wechsel zur Brückenschaltung sichtbar. Die verschiedenen rechten Diagrammansichten überlagern sich nicht.
- Die Brückentopologie entspricht Quelle 52: oben 1–3, unten 2–4, Komponente 5 vertikal zwischen den beiden Mittelknoten. Keine unbeabsichtigte Verbindung um Block 5 herum und kein durchgehender Pfad ohne Komponente.
- Die Brücke erscheint bereits bei „die sogenannte Brückenschaltung“ vollständig einschließlich Block 5 und seiner beiden Verbindungen. Danach folgt separat „Mehrere mögliche Pfade“. Der Hinweis zur fehlenden direkten Serien-/Parallelreduktion erscheint nach der vollständigen Brücke.
- Keine Kollisionen, abgeschnittenen Inhalte oder verschobenen Verbinder in Fokuszuständen. Beschriftungen und Zustandsmarkierungen bleiben bei 960 × 540 lesbar.

Keine verbleibenden konkreten visuellen Fehler.

Abschlussnachtrag zur 1/0-Codierung: Das aktualisierte Endbild und `states-reviewed/slide_048/02_after_02_erstens_jede_komponente_kann_nur_zwei_z.png` wurden bei 960 × 540 nachgeprüft. „1 · Funktionsfähig“ und „0 · Ausgefallen“ sind vollständig, eindeutig zugeordnet und gut lesbar; keine Kollisionen oder zu engen Abstände. Der Nachtrag ist freigegeben.

## Szene 39 – Nachprüfung bestanden

Geprüft: aktualisiertes Endbild in 1920 × 1080 und 960 × 540 sowie relevante neue Zustände in `states-reviewed/slide_039`: erster Diagrammzustand, erste Produktformel mit Annahme und beide abschließenden Fokuszustände.

- „Für unabhängige Komponenten“ erscheint erst mit der ersten Produktformel. Vorher bleibt der Diagrammüberblick frei davon.
- Der Zusatz ist sichtbar, lesbar und kollisionsfrei. Beide Formeln und die Beispielwerte bleiben unverändert korrekt.
- „Hier unter dem kleinsten Einzelwert“ und „Hier über dem größten Einzelwert“ beziehen die Aussagen jetzt auf das gezeigte 90-%-Beispiel. Die längeren Zeilen passen auch im Fokuszustand.
- Die früheren Hinweise zu den Folienaussagen sind damit visuell umgesetzt. Der unveränderte Originalsprechertext wurde gemäß Auftrag beibehalten; dessen absolute Formulierung der Faustregel wurde in dieser Nachprüfung nicht redaktionell geändert.

Keine verbleibenden konkreten visuellen Fehler in der nachgeprüften Fassung.
