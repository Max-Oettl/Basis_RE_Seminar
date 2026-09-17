# RE3 – Übertragung der Kapitel- und Lektionsstruktur

Stand: 27.08.2026  
Ausgabemodus: `module_redesign` mit bestehenden `content_svg`-Zielszenen  
Reichweite: `module_pattern`

## Nutzerbeobachtung

Die Kapitel- und Lektionsgrenzen wurden anhand der alten RE3-SVG-Foliennummern geliefert und sollen auf den konsolidierten Neuaufbau von Modul 3 übertragen werden.

## Reproduzierte Ursache

Der bestehende RE3-Szenenplan enthielt für alle 48 Zielszenen noch `chapter: null`, `lesson: null` und `structure_status: deferred_by_user`. Der Viewer besaß deshalb keine RE3-Gliederung, obwohl jede Zielszene ihre alten `source_slides` bereits eindeutig referenziert.

## Übertragungsregel

Die Nutzerbereiche werden auf die alten Quell-SVG-Nummern angewendet. Eine konsolidierte Zielszene erbt die gemeinsame Zuordnung aller in `source_slides` enthaltenen Quellzustände. Keine Zielszene darf dabei eine Kapitel- oder Lektionsgrenze überschreiten.

| Kapitel | Lektion | Explizit genannte alte SVGs | Im Neuaufbau zugeordnete Quellzustände | Begründung für ergänzte Zustände |
|---:|---|---|---|---|
| 1 | 1 | 1–8 | 1–8 | direkte Übertragung |
| 1 | 2 | 9–14 | 9–14 | direkte Übertragung |
| 1 | 3 | 15–22 | 15–22 | direkte Übertragung |
| 1 | 4 | 23–30 | 23–30 | direkte Übertragung |
| 2 | 1 | 31–32 | 31–33 | SVG 33 ist der letzte Aufbauzustand derselben Sequenz 31–33 |
| 2 | 2 | 34–42 | 34–42 | direkte Übertragung |
| 3 | 1 | 43 | 43 | direkte Übertragung |
| 4 | Übung | nicht einzeln dargestellt | 44–57 | vollständige Übungsfolge einschließlich Lösungen und Abschlussübergang |
| 5 | 1 | 58–59 | 58–59 | nach Nutzerabgleich sind ausschließlich 3-Parameter-Weibull, Schwellenwert und Anwendungsvoraussetzungen Bestandteil der Lektion |
| 5 | 2 | 67 | 67 | nach Nutzerabgleich ist ausschließlich die Trennung mehrerer Ausfallmechanismen Bestandteil der Lektion |

## Neue Zielzuordnung

| Kapitel/Lektion | Konsolidierte Zielszenen (`work_unit`) |
|---|---|
| 1/1 | `slide_001`, `slide_002` |
| 1/2 | `slide_009`, `slide_011`, `slide_013`, `slide_014` |
| 1/3 | `slide_015`, `slide_017`, `slide_020` |
| 1/4 | `slide_023`, `slide_024`, `slide_027`, `slide_029` |
| 2/1 | `slide_031` |
| 2/2 | `slide_034`, `slide_035`, `slide_036`, `slide_038`, `slide_039`, `slide_042` |
| 3/1 | `slide_043` |
| 4/Übung | `slide_044` bis `slide_057` gemäß bestehender Arbeitsreihenfolge |
| 5/1 | `slide_058`, zusätzliche lesbare Zielszene `slide_059`, `slide_060` |
| 5/2 | `slide_067` |

## Lokale Korrektur

- zentrale Quellbereichszuordnung in `tools/re3-redesign-spec.js` ergänzt,
- RE3-Szenenplan und Quellenreferenzkarte auf Kapitel/Lektion umgestellt,
- RE3 im Viewer mit fünf Kapiteln und zehn Lektionen angelegt,
- Kapitel 4 als Lektion `Übung` benannt,
- Sequenzplan um die Zielzuordnung ergänzt,
- Regressionstest für 72 archivierte Quellzustände und 38 aktive Szenen hinzugefügt.
- Quellzustände 60–66 und 68–72 bleiben im Archiv erhalten, sind jedoch nicht mehr Teil der aktiven Kapitel-5-Sequenz.

## Übertragbare Regel

Kapitel- und Lektionsgrenzen aus alten SVG-Foliennummern werden über `source_slides` übertragen. Eine nachträgliche fachliche Inhaltsbestätigung hat Vorrang vor zuvor angenommenen Anschlusszuständen. Zusätzliche Ziel-SVGs dürfen entstehen, wenn der bestätigte Inhalt dadurch lesbar bleibt; sie erhalten eine explizite strukturelle Herkunft.

## Verifikation

- 72 von 72 alten SVG-Zuständen besitzen genau eine Viewerzuordnung.
- 38 von 38 aktiven Zielszenen besitzen genau eine Kapitel-/Lektionszuordnung.
- Keine konsolidierte Szene überschreitet eine Strukturgrenze.
- `node --check tools/re3-redesign-spec.js`: bestanden.
- `node --check tools/rebuild-re3-module-plan.js`: bestanden.
- Kapitel 5 enthält aktiv drei Szenen in Lektion 1 und eine Szene in Lektion 2.
- RE3-Struktur- und Inhaltsregression: 9 von 9 Tests bestanden.
- Direkte strenge Prüfung der vier geänderten Content-SVGs: 0 Designfehler, 0 Layoutfehler in 16 Animationszuständen.
