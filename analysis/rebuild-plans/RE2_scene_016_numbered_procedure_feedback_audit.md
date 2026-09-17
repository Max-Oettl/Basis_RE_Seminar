# Feedback-Audit: RE2 Szene 16 – nummerierte Vorgehensweise

## Lernprotokoll

- Szene: Viewer-Szene 16, technische Arbeitseinheit `slide_024`, Scene_ID `re2_ch3_fta_process_overview`
- Nutzerbeobachtung: Die vier Handlungen der Systemanalyse dürfen mit `1.`, `2.`, `3.` und `4.` gekennzeichnet werden, weil die alte Szene sie ausdrücklich als Vorgehensweise darstellt.
- Reproduzierte Ursache: Bei der vorherigen Überarbeitung wurden die vier Zeilen zwar top-down angeordnet und einzeln animiert, aber mit gleichartigen runden Bulletmarkern versehen. Dadurch war die fachlich belegte Reihenfolge schwächer erkennbar als in Quellfolie 26.
- Lokale Korrektur: Die Bulletmarker wurden durch die sichtbaren Nummern `1.` bis `4.` ersetzt. Nummer, Fachbegriff, Erläuterung, Stichpunkte und Szenenvorschau bleiben jeweils eine atomare Animationsgruppe.
- Reichweite: `project_rule`
- Übertragbare Regel: Nummerierung wird für echte zeitliche oder methodische Vorgehensweisen verwendet und bleibt bei quellbelegter Reihenfolge erhalten. Gleichrangige Aussagen ohne Reihenfolge werden weiterhin als Stichpunkte dargestellt.
- Aktualisierte Schubladen: `.agents/skills/redesign-reltest-slides/references/review-derived-design-rules.md`, `tools/generate-re2-chapter3-full-slide-redesign.js`, `rebuild-proposals/svg/RE2/slide_024/`, `analysis/reports/RE2_targeted_feedback_revision_2026-08-27.md`

## Verifikation

- Quellfolien 24 bis 27 und insbesondere der vollständige Vorgehenszustand aus Quellfolie 26 direkt mit dem neuen Endzustand verglichen.
- Sichtbarer Inhalt blieb unverändert; ergänzt wurde ausschließlich die quellbelegte Nummerierung der vier Vorgehensschritte.
- Statischer Endzustand und sieben Animationszustände erneut gerendert und visuell geprüft.
- Die bestehende Sprechertextreihenfolge und alle Triggerphrasen blieben unverändert.
- Animationsplan-Validator: 0 Fehler, 0 Warnungen.
- Gezielte strenge SVG-, Design- und Layout-QA: 0 Fehler, 0 Designwarnungen und keine Layoutbefunde.
- Verbleibende globale Warnung: Das unveränderte Plot-Asset `slide_003/plots/bathtub_curve.svg` besitzt ein nicht folienförmiges ViewBox-Verhältnis und liegt außerhalb dieses Korrekturumfangs.
