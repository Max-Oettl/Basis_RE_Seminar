# Unabhängige visuelle QA – RE4 Szenen 31, 33 und 39

Datum: 17.09.2026. Prüfung durch den separaten Review-Agenten. Keine Produktionsdateien geändert und keinen Browser-Render gestartet.

## Prüfumfang

- Statische Endbilder `after/slide_031.png`, `slide_033.png`, `slide_039.png` in voller Auflösung und bei 960 × 540.
- Alle 16 Zustände von Szene 31, alle 17 Zustände von Szene 33 und alle 22 Zustände von Szene 39 in voller Auflösung; zusätzlich reduzierte Ansichten für Abstände und Lesbarkeit.
- Abgleich mit den lokalen Quellbildern 31/32, 33/34 und 39–42 sowie den jeweiligen Narrationsplänen.
- Szene 31: Nachprüfung von `states-reviewed/slide_031/11_highlight_rbd_ends_8.png`. Die übrigen 15 PNGs sind per SHA-256 identisch zu den bereits geprüften Zuständen.

## Ergebnisse

### Szene 31 – bestanden nach Korrektur

RBD-Begriff, Komponentenblöcke, Verbindungen, zwei Zustände und Eingang/Ausgang sind eindeutig und bei 960 × 540 lesbar. Keine Textkollisionen, abgeschnittenen Inhalte oder fachlich verfrühten Ergebnisse.

Der zuerst geprüfte Fokuszustand skalierte die Verbindungslinien gegenüber den feststehenden Blöcken; dadurch entstanden sichtbare Lücken im gerade erläuterten durchgängigen Pfad. Die Nachprüfung bestätigt die Korrektur: Jetzt werden nur die Labels Eingang/Ausgang fokussiert. Die Linien behalten ihre korrekten Anschlüsse.

### Szene 33 – visuell bestanden

Serie und Parallelstruktur bleiben klar getrennt. Die Reihenfolge Parallelstruktur neutral → ein Ausfall → nur ein funktionsfähiger Pfad → alle ausgefallen stimmt mit den Sprecherphrasen überein. Die untere Serienansicht und die getrennten Merksätze bleiben erhalten. Keine falschen Nebenpfade, überlagerten Diagrammzustände, Textkollisionen oder vorgezogenen Ausfallaussagen. Ausfallmarkierungen und Funktionszustände bleiben auch bei 960 × 540 erkennbar.

### Szene 39 – visuell bestanden; fachliche Präzisierung empfohlen

Produktzeichen, Indizes, Komplementbildung und Rechenbeispiele sind sauber gesetzt und den Diagrammen richtig zugeordnet. 0,9³ = 0,729 = 72,9 % und 1 − (1 − 0,9)³ = 0,999 = 99,9 % stimmen. Alle 22 Zustände sind kollisionsfrei und folgen der Erklärung. Formeln und Merksätze sind bei 960 × 540 lesbar.

Zwei bereits aus Quelle und Sprechertext übernommene Vereinfachungen wurden an die Umsetzung gemeldet:

1. Die Produktformeln setzen unabhängige Komponentenausfälle voraus. Diese Annahme sollte kurz benannt werden.
2. Striktes „unter dem kleinsten“ bzw. „über dem größten Einzelwert“ gilt bei mindestens zwei Komponenten und 0 < R_i < 1. Allgemein sind ≤ bzw. ≥ korrekt.

Dies sind keine neu eingeführten Grafik- oder Rechenfehler. Eine mögliche Präzisierung ist in diesem Bericht noch nicht nachgeprüft.
