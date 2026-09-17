# Piktogramm-Brief – RE2 P-Diagramm

## Identität

- `pictogram_id`: `re2_p_diagram_family`
- `working_name`: P-Diagramm-Rollen
- `semantic_role`: `concept-anchor`
- `primary_meaning`: Die vier Richtungen eines P-Diagramms als Eingabe, Steuerung, Störung und Ziel/Ausgabe unterscheiden.
- `source_evidence`: Sprechertext und Quellfolie 8 von RE2.
- `reuse_scope`: `module`

## Kontext

- `visible_label_or_context`: Jedes Piktogramm steht direkt neben seiner ausgeschriebenen Rolle.
- `learner_without_prior_knowledge`: Die Richtung und der Gegenstand müssen in etwa einer Sekunde erkennbar sein.
- `misreadings_to_avoid`: Eingabe darf nicht wie Ausgabe wirken; Steuerung nicht wie Reparatur; Störung nicht wie allgemeine Gefahr; Ziel nicht wie bloße Dekoration.
- `must_preserve_features`: dominante Silhouette, klare Richtung, maximal zwei semantische Ebenen.
- `must_not_add`: Text, Zahlen, Logos, Wasserzeichen, Schatten, Verläufe, 3D, Fotorealismus, dünne Details.

## Asset-Entscheidung

- `complexity`: `medium`
- `strategy`: `generated_png`
- `strategy_reason`: Der Nutzer verlangt hochwertige, einheitliche PNG-Piktogramme statt aus SVG-Grundformen aufgebauter Icons.
- `target_path`: `components/image-library/generated-pictograms/re2-p-diagram/`

## Darstellung

- `display_role`: `regular`
- `source_size_px`: 1024 × 1024
- `viewer_50_percent_size_px`: 48–64 px
- `foreground_role`: Marineblau als Familienfarbe; Koralle nur für Störung, Grün nur für Zieltreffer.
- `background_role`: transparent auf heller Kartenfläche.
- `accessibility_mode`: `redundant-hidden`
- `aria_label_if_needed`: nicht erforderlich, da die sichtbare Rollenbezeichnung redundant ist.

## Animation

- `animation_decision`: `animated`
- `atomic_group_with`: jeweilige Rollenkarte und ihr lokaler Verbinder.
- `source_text_if_animated`: die erste explizite Nennung der jeweiligen Rolle im Sprechertext.
- `effect`: `show`

## Prompt-Lock

Gemeinsame Stilbasis für alle vier Einzelgenerierungen:

- echtes transparentes PNG, quadratischer 1024-px-Master, mindestens 8 % transparenter Rand;
- flache, frontale, orthografische Piktogramm-Grafik mit kräftiger, sofort lesbarer Silhouette;
- Marineblau `#142452` als Grundfarbe, höchstens ein dokumentierter Akzent;
- exakt ein zentriertes Motiv, keine Hintergrundplatte;
- keine Schrift, Zahlen, Logos, Wasserzeichen, Schatten, Verläufe, Texturen, 3D- oder fotorealistischen Elemente.

## QA-Nachweis

- [x] 64 px gerendert
- [x] 48 px gerendert
- [x] 32 px nicht erforderlich; Zielplatzierung liegt bei 112–124 px
- [x] 50-Prozent-Viewer geprüft
- [x] echter Folienkontext geprüft
- [x] Graustufen über die formredundante Bedeutung geprüft
- [x] mindestens 3:1 Kontrast
- [x] Semantik in etwa 1 Sekunde erfassbar
- [x] neben bestehender Piktogrammfamilie konsistent
- [x] Registry und Library aktualisiert
