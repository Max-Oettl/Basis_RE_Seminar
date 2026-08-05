# Project Skill Boundary

Dieses Repo nutzt fuer projektspezifische Regeln primaer:

- `AGENT.md`
- `workflow/README.md`
- `workflow/00-router/context-loading-map.md`
- thematische Detaildateien unter `workflow/`

Formale Codex-Skills sollen hier erst entstehen, wenn eine wiederverwendbare Faehigkeit aus dem Projekt heraus geloest werden soll, z.B. ein allgemeiner Python-Plot-SVG-Skill oder ein SVG-Animation-Manifest-Skill.

## Aktuelle Entscheidung

Die allgemeinen Regeln fuer die Basis-Seminar-Folienuebersetzung bleiben in:

- `AGENT.md` fuer globale Prioritaeten,
- `agents/*.md` fuer Rollenpflichten,
- `workflow/` fuer konkrete Prozess- und Qualitaetsregeln,
- `templates/` fuer auszufuellende Planungsartefakte.

Ein formaler Skill existiert fuer die bewusst wiederverwendbare Redesign-Faehigkeit:

- `redesign-reltest-slides/`: Redesign einzelner Folien, Sequenzen oder Module im RelTest-Education-Design mit getrennten Modi fuer Vollfolien und Content-SVGs.
- `animate-svg-from-narration/`: Sprechertextgefuehrte SVG-Animationsdramaturgie mit bewusstem Initialzustand, semantischen Gruppen, Abhaengigkeitslogik, Effektwahl und zustandsbasierter QA.

Grund fuer diese Ausnahmen: Redesign und Animationsdramaturgie besitzen jeweils
einen eigenstaendigen Trigger, wiederverwendbare Entscheidungssysteme und klar
abgegrenzte Qualitaetsgates. Die allgemeine Quellenuebersetzung bleibt weiterhin
projektgebunden und wird nicht dupliziert.

- Projektregeln bleiben nah an Quellen, Szenenplaenen und bestehenden Artefakten.
- Codex kann per Workflow-Router nur die noetigen Detaildateien laden.
- Es entsteht keine zweite, schwer zu synchronisierende Regelwelt neben `AGENT.md`.
