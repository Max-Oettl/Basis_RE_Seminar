# RE1 Formel-Systemmigration 2026-08-06

## Auftrag und Modus

- Umfang: alle eigenstaendigen Formelassets des Basis-Seminarmoduls RE1.
- Planungsmodus: `module_redesign`.
- Zielmodus der betroffenen Szenen: bestehendes `full_slide`-System, 1920x1080.
- Nutzerziel: durchgaengig hochwertiger, konsistenter Formelsatz als sichtbares Qualitaetssignal fuer das Basis-Seminar.

## Referenz-Lock

- Referenzfamilie: bestehende freigegebene RE1-Education-Vollfolien.
- Repraesentative Formel-/Datenreferenzen: `slide_033`, `slide_052`, `slide_055`.
- Beibehalten: Education-BrandFrame, Tabellen-/Kartenstruktur, semantische Farben, Sprechertext- und Animationsgruppen.
- Veraendern: ausschliesslich Formelrenderer, Formelasset-Geometrie, nominale Formelskalierung und technisch notwendige Formelplatzierung.
- Mastertrennung: sichtbarer Titel, Footer, Logo und Szenenkennung bleiben downstream.

## Inhaltsinventar

- `must_preserve`: jede Formel, Variable, Integralgrenze, Ableitung, Summe, Relation, Einheit und Ergebniszahl.
- `reframe`: alte live gerenderte SVG-Textformeln werden als zusammenhaengende Pfad-SVGs neu gesetzt.
- `visual_replace`: die native Schreibweise `Median = e^mu` in Szene 70 wird durch das vorhandene mathematische Medianasset ersetzt.
- `decorative_remove`: keine fachlichen Elemente; nur fontabhaengige Textglyphen und boxbezogene Verzerrung entfallen.
- `target_addition`: keine neue fachliche Aussage.

## Formelstrategie

- Eine zentrale RE1-Generierung liest die Formeln weiterhin aus den szenenlokalen Datendateien.
- STIX-Mathtext wird als Pfadgeometrie exportiert.
- Jedes Asset traegt `data-formula-fontsize`, `data-formula-fontset` und Formel-QA-Metadaten.
- Gleichrangige Formeln werden nach nominaler Grundschrift eingebettet; Boxbreite und Boxhoehe sind nur Obergrenzen.
- Dunkle Formelbaender verwenden weisse Pfade, helle Bereiche Marineblau.
- Der Generator prueft, dass jedes vorhandene RE1-Formelasset genau eine Generatorspezifikation besitzt.

## Animation

- Bestehende Entscheidung und semantische Formelgruppen bleiben unveraendert.
- Die Migration veraendert keine Triggerphrase, Schrittfolge oder Target-ID.

## QA-Schwerpunkte

- Keine `<text>`- oder `<tspan>`-Glyphen in Formelassets.
- Keine unterschiedliche Fettung oder Font-Fallbacks.
- Optisch gleiche Grundschrift innerhalb jeder Formelmatrix.
- Integralgrenzen, Bruchstriche, Exponenten, Indizes und Ableitungszeichen korrekt.
- Keine Formel wird durch ihre Zielbox gestreckt.
- Zielrender jeder betroffenen Szene bei 1920x1080 und im 960x540-Kontaktbogen.
- Content-Crosscheck, Manifestintegritaet, XML-, Design- und Layout-QA nach der letzten Generierung.

## Abschlussstatus

- Migration abgeschlossen: 39 Formelassets in 16 Szenen.
- Technisches Ergebnis: 0 Live-Texttreffer, 0 fehlende nominale Metadaten, 0 fehlende Formel-QA-Metadaten.
- Layout-QA der betroffenen Szenen: 0 Fehler.
- Finale Render und Audit: `analysis/rebuild-plans/RE1_formula_system_migration_audit_2026-08-06.md`.
