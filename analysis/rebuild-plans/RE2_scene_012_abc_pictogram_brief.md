# Piktogramm-Brief: RE2 Viewer-Szene 12 – ABC-Klassen

## Zuordnung und Modus

- Viewer-Szene: 12
- Scene_ID: `re2_ch2_abc_analysis`
- Technische Arbeitseinheit: `slide_017`
- Quellfolien: 17 und 18
- Ausgabemodus: `content_svg`, 1920 × 1080
- Nutzerauftrag: Die drei alt wirkenden technischen Beispielbilder werden durch neu generierte, einheitliche PNG-Piktogramme ersetzt.

## Asset-Entscheidung

| source_element | source_evidence | semantic_role | complexity | strategy | target_path | reason | blocking_question |
| --- | --- | --- | --- | --- | --- | --- | --- |
| technische Beispiele A-Teile | Quellfolie 18 und Nutzerfeedback | Objektanker für berechenbar belastete Teile | medium | `generated_png` | `components/image-library/generated-pictograms/re2-abc-classes/abc-a-bearing-load.png` | Das alte Scanbild wird durch ein klares Lager-mit-Last-Piktogramm ersetzt. | – |
| technische Beispiele B-Teile | Quellfolie 18 und Nutzerfeedback | Objektanker für Reibung und Verschleiß | medium | `generated_png` | `components/image-library/generated-pictograms/re2-abc-classes/abc-b-wear-bushing.png` | Das alte Scanbild wird durch ein eindeutig verschlissenes Gleitlager-Piktogramm ersetzt. | – |
| technische Beispiele C-Teile | Quellfolie 18 und Nutzerfeedback | Objektanker für ein einfaches Standardteil | medium | `generated_png` | `components/image-library/generated-pictograms/re2-abc-classes/abc-c-standard-fastener.png` | Das alte Scanbild wird durch ein reduziertes Standardbefestiger-Piktogramm ersetzt. | – |

## Semantik

### `abc_a_bearing_load`

- `semantic_role`: `concept-anchor`
- `primary_meaning`: Mechanisches A-Teil mit definierbarer statischer und dynamischer Belastung.
- `must_preserve_features`: Wälzlager, kurze Welle, zwei klar erkennbare Lastpfeile.
- `misreadings_to_avoid`: Kein Elektromotor, kein Zahnrad, keine Warnung.
- `visible_label_or_context`: `A-TEILE` und die drei vorhandenen Stichpunkte.
- `reuse_scope`: `module`

### `abc_b_wear_bushing`

- `semantic_role`: `concept-anchor`
- `primary_meaning`: Mechanisches B-Teil, dessen Reibung und Verschleiß über Versuche beurteilt werden.
- `must_preserve_features`: Gleitlager/Buchse, sichtbare Kontaktfläche, wenige Verschleißspuren.
- `misreadings_to_avoid`: Kein Wälzlager, kein Bruchereignis, keine abstrakte Warnmarke.
- `visible_label_or_context`: `B-TEILE` und die drei vorhandenen Stichpunkte.
- `reuse_scope`: `module`

### `abc_c_standard_fastener`

- `semantic_role`: `concept-anchor`
- `primary_meaning`: Einfaches, standardisiertes C-Teil als unkritisches Beispielteil.
- `must_preserve_features`: Schraubenkopf, klarer Schaft, reduziertes Gewinde.
- `misreadings_to_avoid`: Kein Werkzeug, keine Baugruppe, kein gebrochenes Teil.
- `visible_label_or_context`: `C-TEILE` und die drei vorhandenen Stichpunkte.
- `reuse_scope`: `module`

## Gemeinsame Darstellung

- Profil: `reltest-education-minimal-v1`
- Masterformat: quadratisches PNG, mindestens 1024 × 1024 px, echter Alphakanal
- Perspektive: frontal beziehungsweise orthografisch
- Farbe: einheitliches Corporate-Marineblau `#142452` auf transparentem Hintergrund
- Sicherheitsrand: mindestens 8 Prozent
- Keine Schrift, Zahl, Logos, Verläufe, Schatten, Texturen, 3D- oder Isometrieoptik
- Zielplatzierung: 154 × 154 px innerhalb der bestehenden Spalte; eindeutige Erkennbarkeit bei 48 px und im 960 × 540-Szenenrender

## Animation

- Entscheidung: Die vorhandene Animation bleibt unverändert.
- Jedes PNG bleibt Teil seiner bestehenden atomaren Gruppe `abc18_a`, `abc18_b` beziehungsweise `abc18_c`.
- Keine interne Animation der Piktogramme.

## QA-Nachweis

- [x] Alphakanal und 8-Prozent-Sicherheitsrand geprüft
- [x] 64-px-, 48-px- und 32-px-Vorschau geprüft; 32 px ist für diese konkreten Objektpiktogramme keine Zielgröße
- [x] 960 × 540-Szenenrender geprüft
- [x] Graustufen und mindestens 3:1 Kontrast geprüft
- [x] Registry aktualisiert
- [x] Statischer Endzustand und Animationszustände geprüft
