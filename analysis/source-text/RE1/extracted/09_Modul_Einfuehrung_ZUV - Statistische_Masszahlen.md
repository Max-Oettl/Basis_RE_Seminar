# Extracted Source Text

- module_id: RE1
- source_docx: source-materials/basis-seminar/powerpoint-svg/RE1/Text/09_Modul_Einfuehrung_ZUV - Statistische_Masszahlen.docx
- source_sha256: 376812e5b30323b67cc90076ca1cb9d2494a35a56fb74211f6969bf2f9d0982a
- extraction_method: deterministic_ooxml_table_parser
- modul_nummer: 1
- modul_titel: Einführung in die Zuverlässigkeit
- abschnitt_nummer: 9
- abschnitt: Statistische Maßzahlen

## Folie 1: Grundlegende Statistische Maßzahlen

- section_id: section_001
- source_local_slide_numbers: 1
- spoken_text_sha256: 6a13dd55e29508172718e73130afed43e4030999561b72f88b052dac567a2b82

### Gesprochener Text

In dieser Lektion betrachten wir verschiedene grundlegende statistische Maßzahlen.

Wir konzentrieren uns dabei zunächst auf die drei wichtigsten Lageparameter: den Mittelwert, den Median und den Modalwert.

Dabei werden wir sowohl ihre Vorteile als auch ihre Nachteile diskutieren und an einem Beispiel der Dichtefunktion sehen, wie sich diese Maßzahlen grafisch voneinander abgrenzen.

## Folie 2: Mittelwert

- section_id: section_002
- source_local_slide_numbers: 2
- spoken_text_sha256: fa9168ee82d8f778ba74fb2db63901a64efda4c88ac87ba0f5e111713ae8863c

### Gesprochener Text

Der empirische arithmetische Mittelwert, wird oft auch einfach nur als Mittelwert bezeichnet und kann aus den Ausfallzeiten von t eins bis t n berechnet werden.

Dabei wird einfach die Summe aller Ausfallzeiten durch die Anzahl der Ausfälle geteilt.

Der Mittelwert dient als Lageparameter und zeigt, wo sich ungefähr die Mitte der einzelnen Ausfallzeiten befindet.

Stellt euch hierzu die Ausfallzeiten als Massenpunkte vor:

Der Mittelwert entspricht dann genau dem Schwerpunkt dieser Punkte.

Es ist wichtig zu beachten, dass der Mittelwert sehr empfindlich auf Ausreißer reagiert.

Eine extrem kurze oder lange Ausfallzeit kann ihn erheblich beeinflussen.

## Folie 3: Median

- section_id: section_003
- source_local_slide_numbers: 3
- spoken_text_sha256: 5f902775a7ead687c749453ba89e8cedc2b5055d233a370791f10c1cebff6ec3

### Gesprochener Text

Der Median der Ausfallzeiten ist derjenige Wert, bei dem genau die Hälfte aller erfassten Ausfälle früher und die andere Hälfte später auftritt.

Er kann ganz einfach über die Ausfallwahrscheinlichkeit groß F von t ermittelt werden und entspricht dem Zeitpunkt, zu dem fünfzig Prozent der Bauteile ausgefallen sind.

Bei der Darstellung des Ausfallverhaltens durch die Dichtefunktion teilt der Median die Fläche unter dieser Kurve in zwei exakt gleiche Hälften.

Ein wesentlicher Vorteil des Medians im Vergleich zum arithmetischen Mittelwert ist seine Robustheit gegenüber Ausreißern.

Extrem kurze oder lange Ausfallzeiten haben keinen Einfluss auf seine Position.

## Folie 4: Modalwert

- section_id: section_004
- source_local_slide_numbers: 4
- spoken_text_sha256: a86f62f2af20ee32023e3f24aba87a6026001b483718993b49448161a7dd6968

### Gesprochener Text

Der Modalwert ist die Ausfallzeit, die in einer Verteilung am häufigsten vorkommt.

Er lässt sich am einfachsten ermitteln, indem man die erste Ableitung der Dichtefunktion auf Null setzt.

Damit entspricht der Modalwert dem Punkt, an dem die Dichtefunktion ihr Maximum erreicht.

## Folie 5: Mittelwert, Median und Modelwert bei einer rechtsschiefen Verteilung

- section_id: section_005
- source_local_slide_numbers: 5
- spoken_text_sha256: a0606abf9eea43c535ac866dd805c202eb1d2bd09e886972d31ac1f8ae757acd

### Gesprochener Text

Schauen wir uns nun die Lage der drei zuvor vorgestellten Parameter anhand der hier gezeigten rechtsschiefen Verteilung an.

Der Modalwert befindet sich am Maximum der Dichtefunktion.

Rechts davon liegt der Median, der die Dichtefunktion in zwei gleich große Flächen aufteilt.

Noch weiter rechts, in einem Bereich, der von Ausreißern beeinflusst wird, finden wir den Mittelwert.

Dies verdeutlicht, dass die Position des Mittelwertes von der spezifischen Verteilung abhängt und nur bai einer Normalverteilung genau fünfzig Prozent der Daten jeweils links und rechts von ihm liegen.

Da Ausfalldaten in der Regel nicht normalverteilt sind, erweist sich der Mittelwert oft als ungeeignetes Maß in der Zuverlässigkeitstechnik.

Deshalb bevorzugen wir den Median, der weniger anfällig für Ausreißer ist und eine zuverlässigere Einschätzung der Datenmitte und damit der wahrscheinlichsten Ausfallzeit bietet.

