# RE1/RE2 Downstream-Chrome-Audit

## 2026-07-31 – Masterelemente aus realen Ziel-SVGs entfernt

- **Szenen:** 77 RE1-Zielszenen und 160 RE2-Zielszenen
- **Nutzerbeobachtung:** Sichtbare Überschriften, `Professional Reliability Training | Reliability Engineer` und Kennzeichnungen wie `RE1 · Szene 06` dürfen nicht nur im Export fehlen, sondern müssen auch aus den realen bearbeitbaren SVGs entfernt werden.
- **Reproduzierte Ursache:** Die Full-Slide-Generatoren erzeugten die komplette Masterzone direkt im SVG. Der Export entfernte sie zwar nachträglich, eine erneute Generierung hätte sie im Arbeitsstand jedoch wiederhergestellt.
- **Lokale Korrektur:** 235 betroffene Ziel-SVGs wurden bereinigt; zwei RE2-SVGs waren bereits masterfrei. Die Generatoren für RE1 sowie RE2 Kapitel 2, 3 und 4 erzeugen die Elemente nicht mehr.
- **Reichweite:** `project_rule` und `qa_gap`
- **Übertragbare Regel:** Das Downstream-Repository besitzt sichtbaren Folientitel, Titelakzent, Titel-/Footertrenner, Trainingsfooter, Logo und Modul-/Szenenkennung. Seminar-SVGs enthalten nur Brandhintergrund, Fachinhalt, zugänglichen `<title>` und Titelmetadaten.
- **Aktualisierte Schubladen:** `AGENT.md`, Redesign-Skill, Slide-Redesign-Workflow, Chapter Quality Contract, Target-SVG-Vertrag, Handoff-Vertrag, Quality Gate und Brand-Tokens.
- **Deterministische Absicherung:** `tools/svg-downstream-chrome.js`, `tools/strip-module-slide-chrome.js` und die Regel `downstream-master-element` in der Strict-Design-QA.
- **Generator-Forward-Test:** RE1 Szene 6 sowie RE2 Szenen 4, 20 und 63 neu erzeugt; keine Masterelemente wurden wieder eingefügt.
- **Verifikation:** 237/237 Ziel-SVGs geprüft, 0 verbleibende Masterelemente. RE1-Handoff- und Layoutcheck: 0 Fehler. RE2 technischer, Design- und Layoutcheck: 0 Fehler.
