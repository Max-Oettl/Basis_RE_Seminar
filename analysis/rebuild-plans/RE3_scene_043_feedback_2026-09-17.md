# RE3 Szene 43 – MLS und MLE klar gegenüberstellen

## Auftrag und Referenz

Szene43 vollständig neu gestalten, Kürzel MLS/MLE deutlich größer als bisher.
Modus `content_svg`, Vergleich zweier Methoden, 1920×1080 transparent.
Referenz-Lock: RE2 slide_016/023/047 sowie die akzeptierte aktuelle RE3-CI mit
Marineblau, Oxanium-Auszeichnungen, Archivo-Text und ruhigen semantischen Akzenten.
Keine Masterelemente, kein Pfeil zwischen den Methoden, keine redundante Merkbox.

Originalquelle43 und bisheriges Ziel gerendert und einzeln geprüft unter
`analysis/render-checks/RE3/feedback-43-2026-09-17/{sources,before}`.
Abschnitt `section_015` vollständig gelesen; unverändertes Mapping mit
72 Zuordnungen, 0 Fehler/0 Warnungen. Scene_ID bleibt `re3_src_043`.

## Quellinventar und fachliche Übernahme

- MLS links, MLE rechts; ausgeschriebene Methodennamen neben großen Kürzeln.
- MLS: Datenpunkte, Gerade, vertikale Residuen, Beispiel r_i, Ziel Summe der
  quadrierten Abweichungen minimieren. Transformierte Achsen x(t)/y(F), Bezug
  auf das Weibull-Papier; Quellbeziehungen y(x(t_i)), y(F_i) und Residuum erhalten.
- MLE: log-Likelihoodfläche über T und b, Maximum und Projektion auf optimale
  Parameter. Neue Python-Grafik statt unscharfem Quell-Screenshot.
- MLS einfach/nachvollziehbar, im hier beschriebenen Verfahren vollständige Daten;
  MLE berücksichtigt vollständige/zensierte Daten, ist mathematisch komplexer.
- Beide Verfahren können mit Software angewendet werden. Vertiefung im genannten
  Experten-Seminar bleibt als späte Überleitung erhalten.
- Titel/Logo/Lautsprechersymbol dekorativ entfernen; grafische Inhalte nicht kürzen.

## Aufbau und Assetentscheidung vor Produktion

Zwei gleichgewichtige Spalten mit großen navy Begriffsflächen, Kürzel ca.80px,
Methodennamen ca.30px. Darunter kompakte, gleich hohe Diagrammbereiche, anschließend
je Ziel und zwei Eigenschaften. Softwarehinweis und Vertiefung sind unaufdringlich.

Registry geprüft: vorhandene Regressions-/Surface-Helfer reichen nicht für die
quellenspezifische Residuen- und Parameterprojektion. Neuer Python-Generator
`re3_method_comparison_plots.py` verwendet `reltest_plot_style`, bestehende
SVG-Normalisierung und semantische Gruppierung. Lokale Daten dokumentieren
illustrative Punkte, OLS-Parameter und ein berechnetes Weibull-Likelihoodmodell;
keine Behauptung echter Messdaten. Keine neuen Piktogramme oder Rasterassets.

## Animation vor Umsetzung geplant

`animated`; die Methodenköpfe bilden bei Einführung rechnerischer Verfahren den
ersten Vergleichsrahmen, ohne spätere Ergebnisse zu zeigen. Dann MLS: Achsen und
Punkte → Gerade → Residuen → Quadratsumme → Eignung. Anschließend MLE: Fläche →
Maximum/optimale Parameter → Ziel → Dateneignung → Komplexität. Software und
Vertiefung erst am Schluss. Exakte Originalphrasen, keine erfundenen Sekunden.
Alle Daten-/Linien-/Labelgruppen atomar; gerichtete Verbinder nur mit Endpunkten.

Statisches Pilotgate vor Manifest, danach Zustandsrenders, Content-Crosscheck,
strenge Layout-/Design-QA und unabhängige Zweitprüfung.

## Feedback-Lernen und Verifikation

`local_fix`: dominante MLS-/MLE-Kürzel. `module_pattern`: bei Methodengegenüberstellungen
die zwei Namen und Funktionsprinzipien auf gleichwertigen Spalten halten; die
Originalsprecherfolge bestimmt die Leserichtung.

## Abgeschlossene Prüfung

- Methodenkürzel 86px statt bisheriger kleiner Spaltenlabels; Reihenfolge wie Quelle:
  MLS links, MLE rechts. Diagramme jeweils 740×400px, Zielfunktionen separat.
- Statischer Pilot vor Animationsmanifest geprüft. Gefundene Kollisionen an x(t_i),
  x(t), T_opt und b_opt direkt im Python-Generator korrigiert; MLE-Projektionen
  enden an den tatsächlich beschrifteten sichtbaren Parameterachsen.
- Endbild individuell in 1920×1080 und 960×540 geprüft; alle 22 aktuellen
  Animationszustände geprüft. Unabhängige Zweitprüfung durch `visual_review`
  nach der Korrektur: keine verbleibenden Kollisionen, keine verfrühten Elemente
  oder verschwundenen Linien. Punkte → Gerade → Residuen; Fläche → Maximum.
- 17 semantische Ziele, 21 Originaltext-Schritte, 17 unterschiedliche Trigger.
  Zwischen Triggeranfängen liegen höchstens 26 gesprochene Wörter; erster Reveal
  nach den 12 Wörtern des Rückblicks. Der Player liefert währenddessen den Titel.
- Animationsplan: 0 Fehler, 1 dokumentierter Hinweis zum leeren Content-Start.
- Strenge Design-/Layout-QA: 0 Fehler; 35 Hinweise ausschließlich zu abweichenden
  Seitenverhältnissen eigenständiger Plotassets im Modul, davon vier in Szene43.
  Der Content-SVG selbst bleibt 1920×1080 und transparent.
- Content-Crosscheck: 53 Quellinhalte, 14 Zieltextteile, 0 Fehler, 3 Textabgleich-
  Hinweise manuell aufgelöst: Titel `MLS vs. MLE` ist Player-Master; `einfach
  anzuwenden` wird als `Einfach und nachvollziehbar` aus dem Sprechertext gezeigt;
  `keine Zensierungsinformationen` wird durch `Nur vollständige Daten` abgebildet.
  Keine unbelegten Zieltexte. Der automatische Rohstatus bleibt unverändert.
- OLS-Normalgleichungen numerisch geprüft; Weibull-Profilscore am Maximum nahe
  null und alle vier benachbarten Parameterwerte besitzen geringere Likelihood.
  Beide Modelle sind ausdrücklich illustrative Modelle, keine Seminar-Messdaten.
- Bestehende RE3-Content-Tests: 6/6 bestanden. Scene-Plan mit finalem Manifest
  abgeglichen. Original-SVG, Sprechertext und Quellzuordnung unverändert.

Nachweise: `analysis/render-checks/RE3/feedback-43-2026-09-17/` mit `after`,
`preview`, `states` und `qa-final`. Review betrifft diskrete Chromium-Zustände;
keine Audiowiedergabe oder kontinuierliche Videoausgabe behauptet.
