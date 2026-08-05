# Storyboard Import Package Template

Dieser Ordner ist ein vollstaendiges, technisch gueltiges Beispiel fuer `storyboardImportPackage/v1`.

Beim Verwenden werden mindestens ersetzt:

- `moduleId`, `moduleTitle` und alle Storyboard-Kontextfelder,
- stabile `Scene_ID`-Werte,
- SVG-Dateinamen und fachlicher SVG-Inhalt,
- `Gesprochener Text`, Targets, Schritte und `sourceText`-Phrasen.

Ordnerstruktur, Schema-Versionen und Basename-Paarung bleiben erhalten. Das Beispiel kann direkt geprueft werden:

```powershell
node tools/svg-rebuild-qa.js --handoff-package templates/storyboard-import-package --strict-handoff --strict-design
```
