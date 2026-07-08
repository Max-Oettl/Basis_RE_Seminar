# Sprechertext- und Voiceover-Regeln

Diese Regeln gelten fuer finale Sprechertexte in Storyboard-JSON-Dateien.

Ziel ist eine natuerliche, stabile und gut verstaendliche Vertonung mit KI-Stimmen. Fachbegriffe und bevorzugte Benennungen stehen zusaetzlich in projektbezogenen Glossaren, zum Beispiel `source-materials/life-data-expert/glossary.md`.

## Grundregeln

- Sprechertexte werden auf Deutsch erstellt.
- Sprechertexte verwenden die Du-Form.
- Der Stil ist praxisnah, locker, fachlich praezise und gut sprechbar.
- Texte klingen wie ein kompetenter Trainer, nicht wie ein juristisches Dokument oder Marketingtext.
- Formeln werden im Sprechertext verbal eingeordnet; laengere mathematische Details werden visuell gezeigt.

## Schreibweise

- Deutsche Umlaute werden normal geschrieben, sofern keine konkrete TTS-Ausnahme dokumentiert ist.
- Lange oder schwer sprechbare Komposita duerfen mit Bindestrich getrennt werden.
- Abkuerzungen werden nur verwendet, wenn sie gesprochen natuerlich klingen.
- Zahlen werden so geschrieben, wie sie gesprochen werden sollen.

Verbindliche Schreibweisen:

| Ausdruck | Verwenden |
| --- | --- |
| E-Learning | ja |
| Life Data Expert | ja |
| Reliability Engineer | ja |
| Experten-Training | bevorzugt, wenn die Aussprache sonst holpert |

## Pausenmarker

Pausen werden direkt im Sprechertext gepflegt.

Erlaubt:

```text
{{pause:short}}
{{pause:medium}}
{{pause:long}}
{{pause:1.2s}}
{{pause:1200ms}}
```

Empfehlung:

- `short`: kleine Pause innerhalb eines Gedankens
- `medium`: normaler Uebergang zwischen Aussagen oder Erklaerschritten
- `long`: deutlicher Themenwechsel oder Moment zum Verarbeiten
- konkrete Sekunden- oder Millisekundenwerte nur bewusst und sparsam

Nicht erlaubt:

- unklare Marker wie `{{pause:brief}}`
- Null-Pausen
- Pausen ueber drei Sekunden ohne ausdrueckliche Begruendung

## Trigger-Regel

Pausenmarker sind keine gesprochenen Woerter.

Animationstrigger duerfen deshalb nicht auf Pausenmarker zeigen. Wenn ein Trigger rund um eine Pause gesetzt wird, muss `sourceText` beziehungsweise `narration_cue` echte gesprochene Woerter vor oder nach der Pause verwenden.

## Pruefung vor Abschluss

Vor dem Finalisieren eines Sprechertexts prueft Codex:

- Sind Pausenmarker sparsam und sinnvoll gesetzt?
- Gibt es TTS-kritische Begriffe?
- Sind Abkuerzungen ausgesprochen verstaendlich?
- Sind Formeln und Zahlen bewusst formuliert?
- Sind alle Trigger-Cues echte gesprochene Textstellen?
- Sind Annahmen und offene Fragen getrennt vom Sprechertext dokumentiert?
