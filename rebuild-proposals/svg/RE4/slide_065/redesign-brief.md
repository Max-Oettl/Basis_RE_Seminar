# Redesign-Brief — slide_065

- Strukturstatus: Kapitel und Lektion noch nicht zugeordnet; Nutzervorgabe ausstehend
- Quellfolien: 65
- Sprechertext: section_007 — Zuverlässigkeitsblockdiagramm – Separation
- Titel: Viele Komponenten senken die Systemzuverlässigkeit
- Takeaway: Bei einer Serienstruktur fällt die Systemzuverlässigkeit mit jeder zusätzlichen Komponente – besonders bei geringerer Einzelzuverlässigkeit.
- Archetyp: technical-plot
- Zielmodus: full_slide, 1920×1080
- Referenz-Lock: RE3 slide_002, slide_024, slide_043 und slide_070
- Farbdramaturgie: Navy-Tonalität für gleichrangige Inhalte; Grün und Koralle nur semantisch für Fokus, Funktion oder Ausfall
- Animation: statisch — kein belastbarer separater Sprechertextaufbau
- Quellenregel: PowerPoint-Sprechericons, gelbe Produktionsnotizen und Masterdekoration entfallen
- Assets: native SVG-Komposition
- Diagramm: technical; x = Anzahl der Komponenten n; y = Systemzuverlässigkeit R_S [%]; Modell R_S = R_B^n; szenenlokales SVG und Datensnapshot. Kontrollierter Node-Vektor-Fallback, da kein Python-Interpreter verfügbar ist
