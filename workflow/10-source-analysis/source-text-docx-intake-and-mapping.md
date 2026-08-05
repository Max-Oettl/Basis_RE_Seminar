# Source Text DOCX Intake And SVG Mapping

Dieser Workflow ist fuer neue Basis-Seminar-Module die erste fachliche Intake-Stufe. Er wird abgeschlossen, bevor Quell-SVGs semantisch analysiert, zu Sequenzen gruppiert oder transformiert werden.

## Ziel

Die Word-Dokumente eines Moduls werden verlustfrei extrahiert und eindeutig den exportierten PowerPoint-SVGs zugeordnet. Das Ergebnis ist ein pruefbares, maschinenlesbares Mapping. Weder die DOCX-Dateien noch die Quell-SVGs werden veraendert.

## Kanonischer Eingang

```text
source-materials/basis-seminar/powerpoint-svg/
  RE1/
    SVG/
      <PowerPoint-Export>.svg
    Text/
      <Sprechertext>.docx
  RE2/
    SVG/
    Text/
  RE3/
    SVG/
    Text/
  RE4/
    SVG/
    Text/
  RE5/
    SVG/
    Text/
```

Die Modulordner `RE1` bis `RE5` sind die einzige Kursgliederung des neuen Inputs. Eine fruehere Aufteilung in mehrere PowerPoint-Dateien wird nicht rekonstruiert und nicht als versteckte Gruppierungsregel verwendet.

Fuer jeden PowerPoint-SVG-Export wird ein zugehoeriger Sprechertext erwartet. Empfohlen sind gleiche Dateistaemme, zum Beispiel `Folie 12.svg` und `Folie 12.docx`. Abweichende Namen sind zulaessig, wenn die Zuordnung eindeutig belegt werden kann.

## Pflichtartefakte

```text
analysis/source-text/<module_id>/extracted/<docx-stem>.md
analysis/inventories/<module_id>_svg-text-map.json
```

Das Mapping folgt `analysis/svg-text-map.schema.json`. Als Startpunkt dient `templates/svg-text-map-template.json`.

## Schritt 1: Dateiinventar Und Hashes

1. Modul-ID aus dem Ordnernamen bestimmen.
2. Nur `<module_id>/SVG/` als visuellen Eingang und `<module_id>/Text/` als Texteingang verwenden.
3. Alle `.svg`- und `.docx`-Dateien in natuerlicher Reihenfolge inventarisieren.
4. Fuer jede Eingangsdatei einen SHA-256-Hash speichern.
5. Andere Word-Formate wie `.doc` vor der Extraktion in `.docx` konvertieren oder als Blocker melden.
6. Interne DOCX-Metadaten wie `Modul Nummer`, `Modul Titel`, `Abschnitt Nummer` und `Abschnitt` extrahieren.
7. `Modul Nummer` gegen den Modulordner pruefen. Beispielsweise darf ein intern als Modul 2 gekennzeichnetes DOCX nicht in `RE1` freigegeben werden.
8. Doppelte Foliennummern, unklare Reihenfolgen und unerwartete Dateien dokumentieren.

Die Originaldateien bleiben unveraendert. Extraktionsergebnisse liegen ausschliesslich unter `analysis/`.

## Schritt 2: DOCX Verlustfrei Extrahieren

Fuer jedes Word-Dokument wird Markdown mit erhaltener Reihenfolge erzeugt. Bevorzugter Aufruf:

```text
pandoc --track-changes=all <source.docx> -o <analysis/source-text/.../extracted/source.md>
```

Zu erhalten sind mindestens:

- Absaetze in Dokumentreihenfolge,
- Ueberschriften,
- Listen,
- Tabelleninhalte in Zeilen- und Spaltenreihenfolge,
- Fussnoten und fachlich relevante Zusatzinformationen,
- sichtbare Aenderungsstaende, soweit sie im Dokument enthalten sind.

Es wird nichts zusammengefasst, sprachlich geglaettet oder umformuliert. Schlaegt die strukturierte Extraktion fehl oder ist das Ergebnis offensichtlich unvollstaendig, wird das DOCX nach dem DOCX-Analyseverfahren als OOXML geprueft. Eine manuell kopierte Kurzfassung ist kein Ersatz.

Wenn das Dokument ausschliesslich Sprechertext enthaelt, wird sein gesamter fachlicher Text als `spoken_text` uebernommen. Enthaelt es getrennte Bereiche, wird der ausdruecklich als Sprechertext gekennzeichnete Bereich wortgetreu als `spoken_text` gespeichert; andere fachliche Angaben werden unter `supplementary_information` dokumentiert. Eine unklare Bereichstrennung fuehrt zu `needs_review`, nicht zu einer stillen Auswahl.

## Schritt 3: SVG Und Text Zuordnen

Die Zuordnung wird in dieser Prioritaet versucht:

1. `explicit_mapping`: eine ausdrueckliche, vom Nutzer gelieferte Zuordnung.
2. `exact_basename`: exakt gleicher Dateistamm nach Entfernung der Erweiterung.
3. `normalized_basename`: gleicher Dateistamm nach Normalisierung von Gross-/Kleinschreibung, Leerzeichen, Bindestrichen, Unterstrichen und fuehrenden Nullen.
4. `unique_slide_number`: genau eine uebereinstimmende, eindeutig als Foliennummer markierte Zahl, etwa `Folie 12`, `Slide_012`, `Seite 12` oder `Page-12`.
5. `title_sequence_alignment`: eindeutige Zuordnung aus Abschnittstitel, fachlichem Inhalt und lueckenloser SVG-Sequenz.
6. `manual_confirmed`: fachlich oder vom Nutzer bestaetigte manuelle Zuordnung.

Eine reine Dateireihenfolge darf nur als `sequence_fallback` vorgeschlagen werden. Sie bleibt `needs_review` und sperrt die nachgelagerte Produktion, bis sie bestaetigt wurde. Inhaltsaehnlichkeit darf einen Mapping-Vorschlag begruenden, ist aber nie alleiniger Beleg.

## Mapping-Invarianten

- Jede Quell-SVG besitzt genau einen zugeordneten Sprechertextabschnitt.
- Jeder Sprechertextabschnitt wird mindestens einer Quell-SVG zugeordnet oder als ungemappter Abschnitt gemeldet.
- Ein Sprechertextabschnitt darf mehrere direkt aufeinanderfolgende Quell-SVGs tragen, wenn diese nachweislich Aufbau-, Reveal-, Morph- oder Duplikatzustaende derselben gesprochenen Passage sind. Solche Zuordnungen erhalten dieselbe `shared_text_group` und duerfen nicht still ueber nicht benachbarte Folien verteilt werden.
- Dateistamm, Foliennummer und Modulzugehoerigkeit duerfen sich nicht widersprechen.
- `spoken_text` bleibt wortgetreu; nur technisch bedingte Leerraum-Normalisierung ist erlaubt.
- Jede Zuordnung speichert SVG-, DOCX- und Extraktionspfad sowie die zugehoerigen Hashes.
- Zusammengezogene Ziel-SVGs werden erst spaeter geplant. Das Intake-Mapping bleibt immer auf Ebene der einzelnen Ursprungs-SVGs.
- Fuer einen ausdruecklich vom Nutzer freigegebenen Testlauf duerfen noch nicht verwendete Dokumente als `deferred_documents` und ihre Abschnitte als `deferred_text_sections` markiert werden. Diese Eintraege sind Warnings, keine still verworfenen Inhalte. Sie duerfen keine vorhandene Quell-SVG ohne Sprechertext lassen und erzwingen einen erneuten Intake, sobald der aufgeschobene Input geliefert wird.

## Schritt 4: Mapping-QA

Vor dem Quell-SVG-Inventar muessen folgende Fragen beantwortet sein:

- Ist jede SVG genau einmal gemappt?
- Ist jedes Word-Dokument beziehungsweise jeder explizite Abschnitt verbraucht oder als nicht zuordenbarer Eingang gemeldet?
- Sind alle Dateien parsebar und ihre Hashes gespeichert?
- Gibt es doppelte oder widerspruechliche Foliennummern?
- Gibt es unmittelbar aufeinanderfolgende SHA-256-identische SVG-Zustaende oder wiederholte SVG-Sequenzen? Solche Treffer werden als moeglicher doppelter Export gesperrt und muessen fachlich bestaetigt werden. Auch ein einzelner direkt wiederholter Zustand wird zur Pruefung gemeldet, aber nicht automatisch entfernt; nicht benachbarte identische Navigations- oder Schrittzustaende sind allein kein Loeschgrund.
- Ist jede Zuordnung mit Methode und Konfidenz dokumentiert?
- Sind `spoken_text` und Zusatzinformationen ohne Paraphrase extrahiert?
- Gibt es keine offenen `blocked`- oder `needs_review`-Eintraege?

Reproduzierbare Standardbefehle:

```text
powershell -ExecutionPolicy Bypass -File tools/extract-docx-source-text.ps1 -InputDirectory source-materials/basis-seminar/powerpoint-svg/<module_id>/Text -OutputDirectory analysis/source-text/<module_id> -ModuleId <module_id>
node tools/build-svg-text-map.js --module <module_id> --svg-dir source-materials/basis-seminar/powerpoint-svg/<module_id>/SVG --extraction-index analysis/source-text/<module_id>/extraction-index.json --alignment-plan analysis/source-text/<module_id>/svg-text-alignment-plan.json --output analysis/inventories/<module_id>_svg-text-map.json
node tools/validate-svg-text-map.js analysis/inventories/<module_id>_svg-text-map.json
```

`--warn-unmapped` darf nur fuer einen Intake-Zwischenbericht verwendet werden. Die Freigabe zur semantischen SVG-Analyse erfordert den strikten Lauf ohne diese Option. Ausdruecklich freigegebene `deferred_*`-Eintraege bleiben auch im strikten Lauf Warnungen; echte `unmapped_*`-Eintraege bleiben Blocker.

## Abbruchbedingungen

Noch keine semantische SVG-Analyse, Sequenzplanung oder SVG-Produktion, wenn:

- ein Sprechertext fehlt,
- ein Word-Dokument intern einem anderen Modul zugeordnet ist als sein Ordner,
- ein DOCX nicht vollstaendig extrahiert werden kann,
- eine SVG mehreren Texten oder ein Text mehreren SVGs ungeklart zugeordnet ist,
- eine Zuordnung nur auf Dateireihenfolge beruht und nicht bestaetigt wurde,
- die Folienreihenfolge nicht eindeutig ist,
- sich ein Eingangs-Hash nach Erstellung des Mappings geaendert hat.

## Uebergabe

Nach erfolgreichem Mapping verweist das Quell-SVG-Inventar pro Folie auf den passenden Mapping-Eintrag und die extrahierte Markdown-Datei. Der `Source SVG Transformation Planner` arbeitet anschliessend mit Quell-SVG, wortgetreuem Sprechertext und Zusatzinformationen als gemeinsamem Analysepaket.
