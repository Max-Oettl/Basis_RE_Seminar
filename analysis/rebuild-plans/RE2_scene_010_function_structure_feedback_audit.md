# Feedback-Audit: RE2 Szene 10 – Funktionsstruktur

## Lernprotokoll

- Szene: Viewer-Szene 10, technische Arbeitseinheit `slide_014`, Scene_ID `re2_ch2_function_structure`
- Nutzerbeobachtung: Die bisherige Zielgrafik zeigte zwar Teilfunktionen des Wechselrichters, war aber der Ursprungsszene nicht ähnlich genug. Insbesondere fehlte oben die Hauptfunktion `DC-Strom → Umwandlung DC-Strom in AC-Strom → AC-Strom` und deren sichtbare Aufklappbeziehung zur detaillierten Struktur darunter.
- Reproduzierte Ursache: Der erste Neuaufbau übernahm fast ausschließlich den detaillierten Endzustand aus Quellfolie 16 und behandelte ihn als eigenständige lineare Prozesskette. Die in Quellfolien 15 und 16 durch zwei diagonale Linien dargestellte Übersicht-Detail-Hierarchie ging verloren. Zusätzlich wurden ein unbelegtes Systemgrenzen-Label und ein Merksatz ergänzt.
- Lokale Korrektur: Die Szene besitzt wieder eine obere Hauptfunktion, zwei Aufklapplinien, eine gestrichelte Detailbegrenzung sowie alle acht Teilfunktionen und ihre DC-/AC- beziehungsweise Signalbeziehungen. Unbelegte Zusätze wurden entfernt.
- Reichweite: `project_rule`
- Übertragbare Regel: Bei einer aufgeklappten Funktions-, System- oder Baugruppenstruktur sind Übersicht, Detailansicht und ihre verbindende Geometrie gemeinsam fachlicher Inhalt. Eine isolierte Detaildarstellung ist nicht gleichwertig.
- Aktualisierte Schubladen: `.agents/skills/redesign-reltest-slides/references/review-derived-design-rules.md`, `tools/generate-re2-chapter2-full-slide-redesign.js`, `analysis/rebuild-plans/RE2_scene_010_function_structure_redesign_brief.md`, `rebuild-proposals/svg/RE2/slide_014/`, `analysis/rebuild-plans/RE2_scene-plan.json`

## Verifikation

- Direkter Vergleich mit den drei Quellzuständen 14, 15 und 16 durchgeführt.
- Statischer Pilot vor der Animation gerendert und visuell freigegeben.
- Drei Animationszustände geprüft: leerer Content-Bereich, obere Hauptfunktion, vollständige aufgeklappte Detailstruktur.
- Animationsplan: 0 Fehler, 0 Warnungen.
- Strenge SVG-, Design- und Layout-QA: 0 Fehler. Die einzige modulweite Warnung betrifft weiterhin das unveränderte Plot-Asset aus `slide_003`.
- Content-Crosscheck: 0 Fehler. Lexikalische Warnungen betreffen entfernte Titel-/Zwischenzustandstexte aus Quellfolien 14 und 15 sowie in PowerPoint fragmentierte Detailbegriffe; die vollständige visuelle Übertragung wurde manuell gegen den Render geprüft.

## Folgekorrektur 2026-08-27: Aufklapplinien

- Szene(n): Viewer-Szene 10, technische Arbeitseinheit `slide_014`
- Nutzerbeobachtung: Die beiden diagonalen Aufklapplinien zwischen der oberen Funktion und der unteren Funktionsstruktur sollen durchgezogen sein.
- Reproduzierte Ursache: Die Linien waren im Generator mit `stroke-dasharray="7 6"` angelegt und wirkten dadurch wie ein zweiter Grenztyp statt wie eine klare Hierarchieverbindung.
- Lokale Korrektur: Nur bei den beiden diagonalen Linien wurde die Strichelung entfernt. Die gestrichelte Begrenzung der unteren Funktionsstruktur bleibt unverändert.
- Reichweite: `local_fix`
- Übertragbare Regel: Keine neue Projektregel; die Linienart wird hier bewusst nach ihrer lokalen semantischen Rolle unterschieden.
- Aktualisierte Schubladen: `tools/generate-re2-chapter2-full-slide-redesign.js`, `rebuild-proposals/svg/RE2/slide_014/`
- Verifikation: Statischer Endzustand und fünf Animationszustände erneut gerendert. Gezielte SVG-, Design- und Layout-QA: 0 Fehler; die einzige modulweite Warnung betrifft weiterhin ausschließlich das unveränderte Plot-Asset aus `slide_003`.
