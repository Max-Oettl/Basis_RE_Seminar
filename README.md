# Basis Seminar SVG Transformation

Dieses Repo transformiert bestehende Folien des Basis-Seminars `Reliability Engineer` in strukturierte, animierbare Content-SVGs.

## Aktiver Eingang

Der neue Eingang besteht aus den fuenf Modulen `RE1` bis `RE5`. Jedes Modul liefert die aus PowerPoint exportierten Folien-SVGs und den zugehoerigen Sprechertext als Word-Dokumente:

```text
source-materials/basis-seminar/powerpoint-svg/RE1/SVG/*.svg
source-materials/basis-seminar/powerpoint-svg/RE1/Text/*.docx
```

Dasselbe Schema gilt fuer `RE2` bis `RE5`. PPTX-, PDF-, PNG- und separate Narration-Ablagen sind fuer neue Module kein paralleler Eingang. Die fruehere Gliederung nach mehreren PowerPoint-Dateien wird nicht wiederhergestellt.

## Fuehrender Workflow

1. Word-Dokumente vollstaendig extrahieren und jede Textquelle eindeutig einer einzelnen Quell-SVG zuordnen.
2. Das SVG-Text-Mapping pruefen; offene oder mehrdeutige Zuordnungen stoppen die weitere Bearbeitung.
3. Alle Quell-SVGs eines Moduls inventarisieren und technisch pruefen.
4. Jede Quell-SVG zusammen mit ihrem gemappten Sprechertext einzeln analysieren, danach zusammengehoerige Zustandsfolgen erkennen.
5. Im Modul-Sequenzplan festhalten, welche Ursprungsfolien einzeln bleiben und welche zu einem animierten Ziel-SVG zusammengefuehrt werden.
6. Fuer jede Zielarbeitseinheit stabile `Scene_ID`, Sprechertextzuordnung, Quellreferenzen, Layer, Animationen, Spezialassets und QA-Schwerpunkte planen.
7. Quell-SVG-Geometrie und -Inhalte in die vereinbarte Zielstruktur transformieren. Ein erneuter Nachbau aus Raster- oder PowerPoint-Quellen findet nicht statt.
8. Arbeitseinheit fuer Arbeitseinheit Crosscheck, technisches SVG-QA und Korrekturschleife ausfuehren.
9. Nach Freigabe aller Szenen ein `storyboardImportPackage/v1` erzeugen und als Ganzes streng validieren.

Die Quell-SVGs sind unveraenderliche Eingangsartefakte. Ergebnisse liegen unter:

```text
rebuild-proposals/svg/<module_id>/slide_###/
```

## Struktur Und Uebergabe

Die verbindliche Zielstruktur steht in `workflow/40-svg-production/target-svg-structure-contract.md`. Finale Moduluebergaben liegen unter:

```text
delivery-packages/storyboard-import/<external-module-id>/
```

Der Paket-, Storyboard-, SVG- und Animationsvertrag steht in `workflow/70-integration/storyboard-import-package-handoff.md`.

## Workflow-Ebenen

- `AGENT.md`: verpflichtender Router und harte Regeln.
- `workflow/00-router/`: Kontextauswahl und Migration.
- `workflow/10-source-analysis/`: Quell-SVG-Intake, Inventar und Transformationsvertrag.
- `workflow/20-scene-planning/`: Modul-Sequenzplan, Zusammenfuehrungen und Layerplanung.
- `workflow/30-visual-decision/`: Behandlung von Spezialelementen und Assets.
- `workflow/31-python-plots/`: technische Diagramme und Python-Plots.
- `workflow/32-formulas/`: Formeldarstellung.
- `workflow/33-timelines/`: Timelines und Ausfall-Zeitachsen.
- `workflow/40-svg-production/`: SVG-Strukturtransformation und Produktion.
- `workflow/50-animation/`: Animationsmanifest und Trigger.
- `workflow/60-quality/`: Crosscheck und technische Freigabe.
- `workflow/70-integration/`: finales Storyboard-Importpaket und Downstream-Grenzen.

Alte Dateien direkt unter `workflow/` und die bisherigen Mehrquellen-Vertraege bleiben aus Kompatibilitaetsgruenden erhalten. Der aktive Router verweist nur noch auf die kanonischen SVG-Input-Workflows.

## Wichtige Dateien

- `source-materials/basis-seminar/powerpoint-svg/README.md`: Ablage- und Benennungsregeln.
- `workflow/10-source-analysis/source-text-docx-intake-and-mapping.md`: verlustfreie DOCX-Extraktion und SVG-Text-Mapping.
- `analysis/svg-text-map.schema.json`: maschinenlesbarer Mappingvertrag.
- `workflow/10-source-analysis/source-svg-intake-workflow.md`: Modulaufnahme und Quell-SVG-Analyse.
- `workflow/10-source-analysis/source-svg-transformation-contract.md`: maschinenlesbare Planungsfelder.
- `workflow/20-scene-planning/preflight-sequence-planning.md`: Zusammenfuehrungs- und Animationsplanung.
- `workflow/40-svg-production/target-svg-structure-contract.md`: zentraler Zielstrukturvertrag.
- `workflow/40-svg-production/svg-rebuild-production-runbook.md`: arbeitseinheitsweise Transformation.
- `workflow/60-quality/content-transfer-crosscheck.md`: Quell-SVG-gegen-Ziel-SVG-Abgleich.
- `workflow/70-integration/storyboard-import-package-handoff.md`: finale Paketstruktur, SVG- und Animationsvertrag.
- `templates/storyboard-import-package/`: gueltige Startvorlagen fuer die Lieferung.
- `tools/svg-rebuild-qa.js --handoff-package ...`: zentraler finaler Paketcheck.
- `tools/basis-rebuild-viewer/`: Viewer fuer Quell-SVG, Ziel-SVG, Animation und Review.

## Viewer

Unter Windows:

```text
start-basis-rebuild-viewer.cmd
```

Standardadresse:

```text
http://127.0.0.1:4174
```

Ist der konfigurierte Port beim Start bereits belegt, beendet das Startskript
den dort lauschenden Prozess, wartet auf die Freigabe und startet danach den
Viewer. Ein abweichender Port kann als erstes Argument uebergeben werden, zum
Beispiel `start-basis-rebuild-viewer.cmd 4180`, oder ueber
`BASIS_REBUILD_VIEWER_PORT` gesetzt werden.

Der Viewer erkennt Quell-SVGs rekursiv unter `powerpoint-svg/<module_id>/SVG/`. Fuer bestehende Altmodule kann er voruebergehend auf vorhandene PNG-Referenzen zurueckfallen.
