# Inventories

Hier liegen die technischen und semantischen Modul-Inventare vor der Sequenzplanung.

Neuer Standard:

```text
<module_id>_svg-text-map.json
<module_id>_source-svg-inventory.json
```

Das SVG-Text-Mapping folgt `analysis/svg-text-map.schema.json` und wird zuerst erstellt. Es verbindet SVG-, DOCX- und Markdown-Extraktionspfade samt Hashes und wortgetreuem Sprechertext.

Das nachgelagerte Inventar folgt `analysis/source-svg-inventory.schema.json` und erfasst pro Quell-SVG unter anderem Dateipfad, Hash, `viewBox`, sichtbaren Text, Strukturmerkmale, Referenzen, Text-Mapping, Zustandsdelta und vorlaeufige Sequenzrolle.

Bestehende Inventare mit PPTX/PDF/PNG-Zuordnungen bleiben als Legacy-Artefakte erhalten.
