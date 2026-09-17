# Feedback-Audit – RE2 Szene 60 / FMEA-Formblatt

## Nutzerbeobachtung

Das bisher sichtbare FMEA-Blatt wirkte veraltet beziehungsweise zu niedrig aufgelöst.

## Ursache

In `slide_132.svg` war ein 1100×485-Pixel-PNG eingebettet und auf ungefähr 1672×500 Pixel vergrößert. Tabellenlinien und Beschriftungen wurden dadurch im Viewer und beim Export weich. Gleichzeitig war die klassische Ein-Zeilen-Matrix bei Präsentationsgröße unnötig dicht.

## Korrektur

- Das Rasterbild wurde vollständig durch SVG-native Tabellengeometrie und editierbaren Text ersetzt.
- Die Darstellung folgt der aktuellen AIAG-&-VDA-Logik mit sieben Schritten und Aufgabenpriorität (AP), ohne ein geschütztes Originalformular zu kopieren.
- Analyse und Optimierung/Neubewertung wurden in zwei zusammengehörige Tabellenbereiche geteilt. Dadurch bleiben alle fachlichen Felder sichtbar, ohne schmale, kollidierende Überschriften.
- Marineblau strukturiert Analyse und Metadaten; Signalgrün kennzeichnet ausschließlich Optimierung, Neubewertung und den aktiven siebten Schritt.
- Die bestehende Animationsgruppe `s136_form` sowie ihr Sprechertext-Trigger wurden unverändert beibehalten.

## Reichweite und übertragbare Regel

- Klassifikation: `module_pattern`.
- Übertragbare Regel: Technische Formblätter und Tabellen mit Text oder feinen Linien dürfen nicht über ihre native Rastergröße hochskaliert werden. Wenn die Struktur geometrisch rekonstruierbar ist, wird sie als semantisches SVG erzeugt; bei hoher Spaltendichte werden fachlich zusammengehörige Abschnitte in mehrere lesbare Tabellenbänder gegliedert.
- Zentraler Fix: `modernFmeaFormMarkup()` im RE2-Kapitel-4-Generator; zusätzlich erhalten funktionale Rechtecke nun semantische Rollenmarker für die strenge Design-QA.

## Aktualisierte Slots

- `tools/generate-re2-chapter4-full-slide-redesign.js`
- `rebuild-proposals/svg/RE2/slide_132/slide_132.svg`
- `rebuild-proposals/svg/RE2/slide_132/redesign-brief.md`
- `analysis/rebuild-plans/RE2_scene_060_fmea_form_vector_refresh_2026-08-30.md`

## Verifikation

- 1920×1080: `analysis/render-checks/RE2/fmea-form-vector-refresh-2026-08-30/slide_132.png`
- 960×540: `analysis/render-checks/RE2/fmea-form-vector-refresh-2026-08-30/slide_132_960x540.png`
- Quelle: `analysis/render-checks/RE2/fmea-form-vector-refresh-2026-08-30/source_136.png`
- Strenge SVG-, Design- und Layout-QA: 0 Fehler für den Zielzustand; keine Layoutbefunde in beiden Animationszuständen.
- Modulfremde Restwarnung: `slide_003/plots/bathtub_curve.svg` besitzt ein nicht foliennahes ViewBox-Verhältnis; diese unveränderte Datei liegt außerhalb des Nutzerbefunds.

## Ergebnis

`passed` — das FMEA-Blatt ist verlustfrei skalierbar, bei 960×540 lesbar und vollständig in die bestehende Szene und Animation integriert.
