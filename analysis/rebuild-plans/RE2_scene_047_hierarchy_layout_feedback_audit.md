# RE2 – Feedback-Audit Szene 47: Funktions- und Fehlerhierarchie

Stand: 27.08.2026

## Zuordnung

- Aktuelle Viewer-Szene: 47
- SVG-Arbeitseinheit: `slide_101`
- Scene-ID: `re2_ch4_failure_structure`
- Quellzustände: 101–103
- Vom Nutzer benannte Designreferenz: aktuelle Viewer-Szene 51, `slide_110`
- Hinweis zur Historie: Durch die nachträglich eingefügte Planungsszene 74 hat sich die frühere Viewer-Zählung ab diesem Punkt um eine Szene verschoben.

## Nutzerbeobachtung

Die Darstellung in Szene 47 war zu kleinteilig und nutzte die verfügbare Fläche nicht ausreichend. Funktions- und Fehlfunktionsfelder sowie die Verknüpfungen waren in der verkleinerten Ansicht schwerer zu erfassen. Szene 51 zeigt fachlich dieselbe Getriebehierarchie bereits in einer klareren und hochwertigeren Komposition.

## Reproduzierte Ursache

Szene 47 verwendete noch den älteren Renderer `gearFunctionHierarchy` mit zusätzlichen seitlichen Ebenenlabels, kleineren Baugruppenfeldern und engeren Bauteilspalten. Szene 51 verwendet dagegen den Renderer `gearboxFailureHierarchy`, der die drei Hierarchiestufen über Größe, Position und durchgehende Baumlinien ordnet und dadurch mehr Platz für die eigentlichen Fachtexte lässt.

## Lokale Korrektur

- Szene 47 verwendet nun technisch dieselbe Hierarchiekomponente wie Szene 51.
- Getriebe, Antrieb, Abtrieb und Gehäuse sowie alle sechs Bauteile besitzen größere und gleichmäßige Funktions- und Fehlfunktionsfelder.
- Die Baumlinien liegen hinter den Knoten und werden ohne Unterbrechungen oder optische Fragmente geführt.
- Die kompakte Sieben-Schritte-Übersicht bleibt als untergeordnete Orientierung erhalten; Schritt 4 ist signalgrün markiert.
- Der technische Inhalt des vorherigen Zielzustands bleibt vollständig erhalten: zwei Top-Funktionen mit Fehlfunktionen, drei Baugruppen mit Funktionen und Fehlfunktionen sowie sechs Bauteile mit den jeweils zugeordneten Funktionen und Fehlfunktionen.
- Szene 47 behält ihren eigenen Sprechertext. Die drei Knotenhierarchien erscheinen gemeinsam bei `Werfen wir dazu einen Blick auf`; die Verknüpfungen werden anschließend bei `Wenn wir die Fehlfunktionen miteinander verknüpfen` gezeichnet.

## Reichweite

`module_pattern`: Fachlich identische Getriebe-Hierarchien innerhalb von RE2 verwenden dieselbe zentrale Rendererkomponente. Unterschiede entstehen nur aus Sprechertexttriggern oder einem tatsächlich anderen fachlichen Zustand.

## Übertragbare Regel

Die bestehende Projektregel zur technischen Wiederverwendung einer ausdrücklich benannten Referenzszene greift bereits. Es wurde keine konkurrierende Zusatzregel angelegt.

## Aktualisierte Schubladen

- `tools/generate-re2-chapter4-full-slide-redesign.js`
- `rebuild-proposals/svg/RE2/slide_101/`
- `analysis/rebuild-plans/RE2_scene-plan.json`

## Verifikation

- Quellen 101–103, vorheriger Zielzustand und Referenzszene 51 visuell verglichen.
- Statischer Endzustand in 1920×1080 gerendert und auf verkleinerte Viewer-Lesbarkeit geprüft.
- Drei Animationszustände gerendert: kompakter Orientierungsrahmen, vollständige Knoten, Knoten mit Verknüpfungen.
- Sprechertexttrigger: 4 Schritte, 0 Fehler.
- Szenenplan: 69 Szenen, 165 Quellfolien, 0 Fehler, 0 Warnungen.
- Strenge Design- und Browser-Layout-QA für `slide_101`: 0 Fehler, 0 Designwarnungen und 0 Layoutbefunde.
- Verbleibender Modulhinweis betrifft ausschließlich den unveränderten 16:9-ViewBox-Hinweis in `slide_003/plots/bathtub_curve.svg`.
- Prüfrenders: `analysis/render-checks/RE2/scene-047-layout-feedback-2026-08-27/`
