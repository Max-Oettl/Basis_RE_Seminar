# Integration der Sprechertext-Pausenfunktion

Datum: 2026-07-31

## Beobachtung

Der Sprechertext- und Animationsworkflow hatte keine durchgaengig verbindliche
Behandlung maschinenlesbarer Pausenmarker. Dadurch konnten Marker in
Wortzaehlung oder Animationstrigger geraten, und im Viewer fehlten ein
kontrollierter Einfuege-, Bearbeitungs- und Validierungsweg.

## Ursache

Die Regeln waren zuvor nicht in einer gemeinsam verwendeten Domaenenlogik fuer
Viewer, Server, Animation und Handoff gebuendelt. UI, Validierung und
Animationszeitvorschau konnten deshalb unterschiedliche Annahmen treffen.

## Korrektur

- Zentrale Parser- und Validierungslogik fuer Presets und benutzerdefinierte
  Pausen bis maximal drei Sekunden.
- Einfuegen an der Cursorposition, Bearbeiten und Loeschen bestehender Marker
  sowie sichtbare, fokussierbare Pausen-Pills im Viewer.
- Serverseitige Blockade ungueltiger Marker mit strukturierten Fehlerdetails.
- Pausenmarker werden von Wortzaehlung und `sourceText`-Triggern ausgeschlossen.
- Nachfolgende Mock-Timeline-Zeitpunkte erhalten die bis dahin aufgelaufene
  Pausendauer.
- TTS-Uebersetzung bleibt eine explizite Export-/Produktionsgrenze.
- Regeln sind im Animationsskill, Workflow-Router, Manifest- und
  Handoff-Vertrag verankert.

## Einordnung

- `project_rule`: Pausenmarker bleiben verlustfrei im Sprechertext erhalten.
- `domain_rule`: Pausen sind Timing-Metadaten, keine gesprochenen Woerter und
  keine Animationstrigger.
- `qa_gap`: Viewer, Server, Animationsdomaene und Planvalidator benoetigten
  gemeinsame Regressionstests.

## Verifikation

- `node --test tools/basis-rebuild-viewer/*.test.js`: 47/47 bestanden.
- `node .agents/skills/animate-svg-from-narration/scripts/validate-animation-plan.test.js`:
  5/5 bestanden.
- Syntaxpruefung fuer Viewer-Server, Import-Paket-Builder und
  RE1-Handoff-Finalisierung bestanden.
- Gerenderter Browser-Test war in dieser Sitzung nicht moeglich, da die
  Browser-Verbindung keine verfuegbare Instanz gemeldet hat.
