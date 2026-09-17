# RE4 – Feedbackrevision 17.09.2026

## Auftrag und Referenz-Lock

Aktive Einheiten: 1, 5, 7, 13, 17, 21, 23, 25. Transparente Content-SVGs, 1920 × 1080. Referenzen: akzeptierte RE3-Szenen 15, 31 und 43, Archivo/Oxanium, marineblaue angeschnittene Beschriftungsflächen, sparsame grüne Funktionsakzente. Keine Masterelemente oder pauschalen Merksatzbalken. Szene 5 verwendet den tatsächlichen Renderer und die Plotassets aus RE3 Szene 15.

## Sequenz-Preflight und vollständiges Quelleninventar

Bestehende RE4-Sequenz und stabile IDs bleiben erhalten. Geprüftes SVG-Text-Mapping: 68 Quellen, ein Dokument, sieben gemeinsame Textgruppen, keine Fehler. Alle 30 Quellen der aktiven acht Szenen wurden einzeln gerendert und gesichtet: analysis/render-checks/RE4/feedback-2026-09-17/sources/.

| Szene | Quellzustände und Muss-Inhalte | Umsetzung |
|---|---|---|
| 1 | 1 Strukturbaum/Systemgrenze; 2 PKW-Funktion/Fehlfunktion; 3 Getriebe-Funktion/Fehlfunktion; 4 Zahnräder | Korrekte orthogonale Verbinder; Erklärungen außerhalb des Baums direkt an den jeweiligen Knoten. |
| 5 | 5 Zahnradversuch, Wöhlerdarstellung, Ausfallzeiten; 6 Stichprobe, Weibull, Grundgesamtheit, Vertrauensgrenzen | Einleitung zum Versuch, danach akzeptierte RE3-15-Komposition wiederverwenden. |
| 7 | 7 Baum; 8 Zahnräder ≈99%; 9 andere Komponenten ≈99%; 10 Getriebe 96,5%; 11 Motor/Fahrwerk 96,5%; 12 PKW 90% | Korrigierte Struktur, Bewertung von unten nach oben. Gerundete Quellbeispiele, keine exakte Multiplikationsrechnung. |
| 13 | 13 sechs Schritte; 14 Schritte 1–4 wie qualitative FTA; 15 Top-Ereignis/Ursachen; 16 vollständiger Baum | Ablauf neben vollständigem, stufenweise aufgebautem Fehlerbaum. |
| 17 | 17 Schritt 5; 18 Basisereignisse im Baum; 19 sechs Datenquellen/Zeitpunkt; 20 sechs Quellwerte | Gleiche Baumgeometrie, Werte an den Blättern, gebündelte Quellenzone. Materialfehler 0,1%, Verschleiß 1%. |
| 21 | 21 Schritt 6; 22 Baum mit symbolischen Basiswerten/Gesamtwert | Identische Geometrie; Bewertung von Basisereignissen über Gatter zum Top-Ereignis. Keine erfundene Ergebniszahl. |
| 23 | 23 Fehler-ODER ↔ Funktions-UND mit F/R; 24 Fehler-UND ↔ Funktions-ODER | Zwei eindeutig zugeordnete Zeilen und Gegenereignisse. |
| 25 | 25 Getriebe-Ausfall/zwei Ursachen; 26 invertiertes Gatter; 27 vollständiger Funktionsbaum; 28 beide Gatterpaare; 29 Serien-/Parallel-RBD; 30 boolesches Modell | Konkretes Getriebebeispiel und Funktionsbaum, danach beide Transferzeilen bis zum RBD. Positive Funktionsbeschriftungen ersetzen irrtümlich übernommene „defekt“-Labels der Quelle. |

## Topologievertrag

Getriebe defekt → ODER(keine Drehmomentübertragung, Leckage).
Keine Drehmomentübertragung → ODER(Eingangswelle defekt, Ausgangswelle defekt, Teile im Kraftfluss defekt, weitere Ursachen …).
Eingangswelle defekt → ODER(Bruch, Klemmt). Bruch → ODER(Ermüdung, Materialfehler).
Teile im Kraftfluss defekt → weitere Basisereignisse … .
Leckage → ODER(statische Dichtungen defekt, dynamische Dichtungen defekt).
Statische Dichtungen defekt → weitere Basisereignisse … .
Dynamische Dichtungen defekt → ODER(Verschleiß, thermische Alterung).
Quellwerte: Ermüdung ≈2%, Materialfehler ≈0,1%, Kraftfluss ≈1%, statische Dichtungen ≈0%, Verschleiß ≈1%, thermische Alterung ≈1%.

## Text, Assets und Produktion

Originaltexte bleiben unverändert. Gemeinsame Abschnitte 001 und 004 werden an Satzgrenzen verlustfrei auf die drei zugehörigen Szenen verteilt; der Generator prüft die wortgetreue Partition. Damit wiederholt nicht jede Szene die ganze Lektion. Quellenmapping und DOCX bleiben unangetastet.

Strukturbaum, FTA, Gatter und RBD sind native SVG-Beziehungsdiagramme ohne quantitative Achsen. Eine gemeinsame Knotendefinition verhindert Abweichungen. Echte Weibullplots stammen unverändert aus vorhandenen Python-Assets. Keine neuen Piktogramme erforderlich.

Verbinder erscheinen mit ihren Endpunkten, Highlights mit den gesprochenen Bezügen. Ansichtswechsel blenden Vorgänger aus. Statischer Pilot vor Manifest; anschließend Zwischenstände, Textvergleich, strenge Layout-/Designprüfung. Produktion/Korrektur Szene für Szene. Visuelle Zweitprüfung durch Reviewagent gemäß pptx-Skill.

## Nachweise

analysis/render-checks/RE4/feedback-2026-09-17/; abschließende Ergebnisse in review-summary.md.
