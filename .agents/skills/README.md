# Project Skill Boundary

Dieses Repo nutzt fuer projektspezifische Regeln primaer:

- `AGENT.md`
- `workflow/README.md`
- `workflow/00-router/context-loading-map.md`
- thematische Detaildateien unter `workflow/`

Formale Codex-Skills sollen hier erst entstehen, wenn eine wiederverwendbare Faehigkeit aus dem Projekt heraus geloest werden soll, z.B. ein allgemeiner Python-Plot-SVG-Skill oder ein SVG-Animation-Manifest-Skill.

## Aktuelle Entscheidung

Die Regeln fuer die Basis-Seminar-Folienuebersetzung werden nicht als separater Skill ausgelagert. Sie bleiben in:

- `AGENT.md` fuer globale Prioritaeten,
- `agents/*.md` fuer Rollenpflichten,
- `workflow/` fuer konkrete Prozess- und Qualitaetsregeln,
- `templates/` fuer auszufuellende Planungsartefakte.

Grund: Die aktuelle Arbeit optimiert die Uebersetzung vorhandener PowerPoint-Folien in Content-SVGs. Diese Regeln sind stark projekt-, quellen- und workflowgebunden. Ein formaler Skill wuerde erst Sinn ergeben, wenn daraus eine allgemeine, projektunabhaengige Faehigkeit entsteht, z.B. ein wiederverwendbarer Python-Plot-SVG-Skill.

- Projektregeln bleiben nah an Quellen, Szenenplaenen und bestehenden Artefakten.
- Codex kann per Workflow-Router nur die noetigen Detaildateien laden.
- Es entsteht keine zweite, schwer zu synchronisierende Regelwelt neben `AGENT.md`.
