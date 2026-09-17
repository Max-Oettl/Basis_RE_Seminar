# RE2 – Nutzergeführtes Modul-Redesign vom 24.08.2026

## Auftrag und Scope

Das bestehende Modul RE2 wird als modernes, zusammenhängendes E-Learning-Modul nachgeschärft. Die konkret beanstandeten Viewer-Szenen werden vollständig überarbeitet:

- Szene 4 / `slide_006`: Systemebenen und Systemgrenze neu inszenieren.
- Szene 5 / `slide_008`: P-Diagramm mit einer einheitlichen Familie generierter PNG-Piktogramme ergänzen.
- Szene 9 / `slide_013`: Wechselrichter-Systemgrenze und alle Pfeilverläufe fachlich und geometrisch korrigieren.
- Szene 10 / `slide_014`: Funktionsstruktur konsequent in Corporate-Marineblau führen.
- Szene 11 / `slide_017`: ABC-Tabelle in eine marineblaue Informationshierarchie überführen; A/B/C-Farben bleiben kleine semantische Marker.
- Szene 13 / `slide_023`: den übergeordneten Gegenstand der Aufteilung sichtbar machen und erst danach qualitative und quantitative FTA verzweigen.

Zusätzlich wird das vollständige RE2-Modul auf Farbrollen, Akzentdisziplin, Formensprache, Informationsdichte und Kapitelkohärenz geprüft.

## Quellen- und Referenz-Lock

- Fachliche Quelle: bestehende RE2-Quellfolien, Sprechertexte und `analysis/rebuild-plans/RE2_scene-plan.json`.
- Corporate Design: `brand/reltest-education-slide-design-tokens.json` und die vom Nutzer bereitgestellten Farbreferenzen.
- Freigegebene visuelle Referenzen aus RE1:
  - `rebuild-proposals/svg/RE1/slide_009/slide_009.svg`: klare Hierarchie und Funktionsbeziehungen.
  - `rebuild-proposals/svg/RE1/slide_013/slide_013.svg`: ruhiger narrativer Aufbau mit minimalistischen Bildankern.
  - `rebuild-proposals/svg/RE1/slide_022/slide_022.svg`: Kartenfamilie und sparsame semantische Akzente.
  - `rebuild-proposals/svg/RE1/slide_027/slide_027.svg`: technische Informationsdichte mit klarer Marineblau-Dominanz.

Die Referenzen werden nicht kopiert. Übernommen werden das ruhige Raster, die robuste Größenhierarchie, die Marineblau-Dominanz, ein einzelner Fokusakzent und die sprechertextgeführte Gruppenlogik.

## Verbindliche Farbrollen

- Marineblau `#142452`: primäre Strukturfarbe, große Funktionsflächen, Tabellenanker, Systemgrenzen, Hauptknoten.
- Navy-Tonstufen `#435075`, `#727C97`, `#D0D3DC`, `#E8E9EE`: gleichrangige Flächen, Ebenen und ruhige Differenzierung.
- Signalgrün `#00A653`: genau ein fachlicher Fokus oder positiver Zielzustand pro Szene.
- Stahlcyan `#0C84B4`: technische Energie- oder Datenflüsse, wenn diese Rolle fachlich erforderlich ist.
- Gold `#E9B400`: Warnung oder mittlere Kritikalität.
- Koralle `#EC6244`: Störung, Fehler, Risiko oder höchste Kritikalität.

Knallige Akzente bleiben klein und semantisch. Gleichrangige Karten rotieren nicht durch verschiedene Farbfamilien.

## Szenenentscheidungen

### Szene 4 – Systemebenen

- Ersatz der großen verschachtelten Rahmen durch vier gut lesbare, gestaffelte Ebenen.
- Jede Ebene erhält eine Nummer, einen knappen Inhalt und eine klare räumliche Tiefe.
- Der Analysefokus „Wechselrichter“ wird innerhalb der Subsystemebene verankert.
- Die Systemgrenze umfasst fachlich korrekt Subsystem- und Komponentenebene; Umwelt-Schnittstellen bleiben außerhalb.
- Animation: Umwelt → System → Subsystem → Komponente → Analysefokus/Systemgrenze.

### Szene 5 – P-Diagramm

- Das System bleibt der ruhige zentrale Anker.
- Eingangsgrößen, Steuergrößen, Störgrößen und Zielgrößen werden über vier gleichartige Satellitenkarten geführt.
- Jede Rolle erhält ein generiertes, transparentes PNG-Piktogramm im Profil `reltest-education-minimal-v1`.
- Piktogramme bestehen nicht aus SVG-Grundformen, besitzen keinen Text und bleiben auch bei 50-%-Viewergröße erkennbar.
- Koralle wird ausschließlich für die Störgröße verwendet; alle übrigen Rollen bleiben in der Marineblau-Familie.

### Szene 9 – Wechselrichter-Blockschaltbild

- Die Systemgrenze umfasst alle internen Baugruppen einschließlich Kommunikationseinheit und Schnittstellen.
- Energiepfad, Regel-/Steuerpfad, Hilfsenergie und Kommunikation erhalten getrennte orthogonale Spuren.
- Kommunikationsschnittstellen werden über eine Sammelschiene statt über ein Pfeilbündel angebunden.
- Umwelteinflüsse enden an der Systemgrenze; nur fachlich definierte Stoff-, Energie- und Informationsflüsse durchqueren sie.
- Animation: Systemgrenze → Hilfsenergie → Hauptenergiepfad → Kommunikation → Regelung → Umwelteinflüsse.

### Szene 10 – Funktionsstruktur

- Hauptfunktion und Teilfunktionen verwenden Marineblau `#142452` statt Tiefnavy.
- Signalleitungen bleiben schlank und werden nach Energie- und Informationsfluss unterschieden.
- Die sichtbare Aufspannung von Hauptfunktion zur Detailstruktur bleibt erhalten.

### Szene 11 – ABC-Ergebnis

- Marineblau bildet Tabellenkopf, Bauteilanker und Schlussfolgerungsband.
- Zeilenflächen nutzen ruhige Navy-Tonstufen.
- A/B/C bleiben kleine, redundant beschriftete Statusmarker in Koralle/Gold/Grün.
- Dadurch bleibt die Tabelle markentypisch, ohne die Risikosemantik zu verlieren.

### Szene 13 – Arten der FTA

- Ein übergeordneter Knoten „Fehlerbaumanalyse (FTA)“ wird sichtbar eingeführt.
- Von ihm verzweigen zwei klare Pfeile zu qualitativer und quantitativer Analyse.
- Beide gleichrangigen Karten bleiben in einer Marineblau-Tonfamilie; nur die im Modul vertiefte qualitative FTA erhält einen schmalen grünen Fokusmarker.
- Animation: Oberbegriff → qualitative FTA → quantitative FTA → Modulfokus.

## Piktogramm-Familie Szene 5

- Master: 1024 × 1024 px, transparenter Hintergrund, mindestens 8 % Sicherheitsrand.
- Stil: flach, frontal/orthografisch, kräftige eindeutige Silhouette, keine Schatten, Verläufe, Texturen, Schrift, Logos oder fotorealistischen Elemente.
- Grundfarbe: Marineblau `#142452`; maximal ein semantischer Akzent.
- Vier Bedeutungen: Eingabe/Stellgröße, Steuer-/Kontrollgröße, Störgröße, Ziel-/Ausgabegröße.
- Prüfung: technische PNG-/Alpha-Prüfung, 48-px-Lesbarkeit, 960×540-Szenenprüfung und Eintrag in die Piktogramm-Registry.

## Abnahmekriterien

- Alle sechs Szenen bestehen strenge SVG-, Layout-, Branding- und Animationsprüfungen.
- Sprechertext-Trigger sind wortgetreu und die Endzustände vollständig.
- Keine Pfeilspitze kollidiert mit Text oder Knoten; Verbinder erscheinen nicht vor ihren Endpunkten.
- Die Systemgrenze in Szene 9 ist fachlich korrekt.
- Szene 13 zeigt eindeutig, dass die Fehlerbaumanalyse in zwei Arten aufgeteilt wird.
- Das Modul-Audit weist Marineblau als durchgängige Strukturfarbe nach und meldet Szenen mit mehr als einer gesättigten Akzentfamilie außerhalb fachlicher Diagrammrollen.
