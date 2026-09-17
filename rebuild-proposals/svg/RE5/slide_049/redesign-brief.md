# Redesign-Brief · re5_src_049

- Modul: RE5
- Quellfolien: 49, 50
- Kapitel/Lektion: 3/1
- Ausgabemodus: full_slide im module_redesign
- Referenz-Lock: RE4::1, RE4::13, RE4::48, RE4::65
- Archetyp: degradation-plot
- Lernbotschaft: Messbare Degradationspfade liefern geschätzte Ausfallzeiten und daraus eine Lebensdauerverteilung.
- Titelbehandlung: kein sichtbarer globaler Titel; Downstream-System ergänzt Titel, Regel, Footer, Logo und Szenenkennung.
- Inhaltsäquivalenz: Begriffe, Zahlen, Formeln, Plotbeziehungen und fachliche Zustände der Quellen 49, 50 bleiben in der Zielkomposition erhalten.
- Spezialpfade: Plot=degradation_paths; Formeln=keine; neue Piktogramme=keine.
- Assetentscheidung: technische Achsdiagramme aus Python, nicht triviale Formeln als lokale pfadbasierte Formel-SVGs, übrige Beziehungen nativ im SVG.
- Animation: animated umgesetzt; semantische Gruppen=degradation_plot, eol_criterion, lifetime_estimates, lifetime_distribution, degradation_guardrail.
- QA: Quelle/Ziel/Referenz bei 1920×1080 und 960×540, beidseitiger Inhaltsabgleich, Textfit, Kontrast, Plot-/Formelgeometrie und Animationszustände.
