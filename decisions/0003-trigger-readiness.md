# Decision 0003: Triggerbereite SVG-Struktur

## Status

Vorlaeufig akzeptiert

## Kontext

Die finale technische Umsetzung der Satz-Triggerpunkte ist noch offen. Trotzdem sollen SVGs von Anfang an so aufgebaut werden, dass spaetere Triggerintegration moeglich ist.

## Entscheidung

SVG-Elemente werden semantisch benannt und potenziell triggerbare Gruppen erhalten optionale Triggerattribute.

Trigger-IDs beschreiben den didaktischen Moment und die visuelle Aktion. Sie werden nicht aus dem exakten Sprechertext gebildet. Dadurch bleiben sie stabil, wenn der gesprochene Text spaeter leicht umformuliert wird.

Vorlaeufige Konvention:

```xml
<g id="step-02-example" data-trigger-id="reveal-example-concept" data-step="02">
  ...
</g>
```

Begleitende Triggerinformationen werden in `metadata/` oder `trigger-specs/` dokumentiert.

## Konsequenzen

- SVGs bleiben lesbar und wartbar.
- Die Triggerlogik kann spaeter an die tatsaechliche Video-Pipeline angepasst werden.
- Bei Bedarf koennen Attribute oder Metadaten maschinell ausgewertet werden.
- Eine spaetere KI kann Trigger ueber Intent, Textanker und Keywords robuster zuordnen als ueber exakte Satzgleichheit.
