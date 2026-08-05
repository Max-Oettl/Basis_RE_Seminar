# Viewer Notes

Hier speichert der Basis Rebuild Viewer Review-Notizen als konkrete Änderungsaufträge zur aktuellen Ziel-SVG. Sie können Inhalt, Gestaltung, Visualisierung, Animation oder den Abgleich mit einer Quell-SVG betreffen.

Wird eine nichtleere Notiz mit dem Status `offen` gespeichert, wechselt der Status automatisch auf `Korrektur`. Damit ist eindeutig, dass die Notiz noch eingearbeitet werden muss.

Die Dateien werden automatisch erzeugt:

```text
analysis/viewer-notes/RE1_slide_001.json
```

Folienweise Content-Transfer-Crosschecks werden separat gespeichert:

```text
analysis/viewer-notes/crosschecks/RE1_slide_001.json
```

Die Zuordnung einer neuen SVG-Arbeitseinheit zu einer oder mehreren alten Referenzfolien kommt aus `analysis/rebuild-plans/<module_id>_source-reference-map.json`. Zusatzfolien bleiben ohne Altfolienreferenz.

Die manuell gepflegte Trainingsgliederung liegt zentral unter:

```text
analysis/viewer-notes/training-structure.json
```

Sie ordnet Szenen innerhalb eines Moduls stabil zu Kapiteln und Lektionen zu. Nicht zugeordnete Szenen bleiben im Viewer in einem eigenen Bereich sichtbar. Das Ein- und Ausklappen der Struktur wird nur lokal im Browser gespeichert und veraendert die gemeinsame Trainingsgliederung nicht.
