# Feedback-Audit: RE2 Szene 12 – ABC-Piktogramme

## Lernprotokoll

- Szene: Viewer-Szene 12, technische Arbeitseinheit `slide_017`, Scene_ID `re2_ch2_abc_analysis`
- Nutzerbeobachtung: Die drei Bilder zu A-, B- und C-Teilen wirkten noch alt und sollten neu generiert werden.
- Reproduzierte Ursache: Der Neuaufbau verwendete weiterhin drei aus der Quellfolie extrahierte technische Schwarz-Weiß-Abbildungen. Dadurch war die Bildsprache gegenüber den bereits modernisierten Typografie-, Farb- und Animationselementen uneinheitlich.
- Lokale Korrektur: Die Quellbilder wurden durch drei neu generierte transparente PNG-Piktogramme ersetzt: ein belastetes Wälzlager für A-Teile, eine verschleißbeanspruchte Buchse für B-Teile und eine Normschraube für C-Teile. Inhalt, Positionen, Stichpunkte und Animationsreihenfolge blieben unverändert.
- Reichweite: `project_rule`
- Übertragbare Regel: Konkrete technische Objektanker in den RE-Modulen werden als einheitliche generierte PNG-Piktogramme im Profil `reltest-education-minimal-v1` ausgeführt; alte Scan- oder Screenshot-Optik wird nicht als Endzustand übernommen.
- Aktualisierte Schubladen: `components/image-library/generated-pictograms/re2-abc-classes/`, `components/pictogram-library/pictogram-registry.json`, `analysis/redesign-assets/RE2-scene-012-abc-pictograms/`, `analysis/rebuild-plans/RE2_scene_012_abc_pictogram_brief.md`, `tools/generate-re2-chapter2-full-slide-redesign.js`, `rebuild-proposals/svg/RE2/slide_017/`

## Gestaltung und Animation

- Alle drei Piktogramme sind flach, orthografisch, textfrei und ausschließlich in Corporate-Marineblau `#142452` ausgeführt.
- Die PNG-Master besitzen 1024 × 1024 px, echten Alphakanal und mindestens acht Prozent Sicherheitsrand.
- Die sichtbaren Labels `A-TEILE`, `B-TEILE` und `C-TEILE` tragen die Bedeutung redundant; die Bilder sind daher als dekorativ-redundante Lernanker eingebunden.
- Jedes Bild verbleibt in seiner bestehenden atomaren Animationsgruppe. Es wurden keine neuen Trigger oder dekorativen Bewegungen ergänzt.

## Verifikation

- Drei Asset-Briefs im Release-Modus validiert: jeweils 0 Fehler, 0 Warnungen.
- Piktogramm-PNG-Policy: 0 Fehler.
- 64-px-, 48-px- und 32-px-Vorschau sowie der 960 × 540-Szenenkontext visuell geprüft; 32 px ist für die konkreten Objektpiktogramme dokumentiert, aber keine Zielgröße.
- Statischer Endzustand und fünf Animationszustände erneut gerendert und visuell geprüft.
- Gezielte strenge SVG-, Design- und Layout-QA: 0 Fehler, 0 Designwarnungen und keine Layoutbefunde.
- Verbleibende globale Warnung: Das unveränderte Plot-Asset `slide_003/plots/bathtub_curve.svg` besitzt ein nicht folienförmiges ViewBox-Verhältnis und liegt außerhalb dieses Korrekturumfangs.
