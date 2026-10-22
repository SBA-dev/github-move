# 0006 : Méthode TDD, BDD et DDD avec une équipe de subagents

**Statut** : Acceptée · 2026-10-22

## Contexte

Le projet passe d'un prototype à une application destinée à durer, qui manipule des données d'enfants.

## Décision

- Chaque user story est une issue GitHub. Elle est livrée par `/feature <n>` (`.claude/commands/feature.md`) : modèle de domaine, scénarios Gherkin, ⛔ validation humaine, boucle TDD, review, E2E, PR, ⛔ merge humain.
- Six subagents se partagent le travail (`.claude/agents/`), chacun avec un périmètre d'écriture strict.
- Les règles communes sont dans `CLAUDE.md`, les méthodes dans `.claude/skills/` (tdd, bdd-gherkin, ddd, craftsmanship).
- Le langage ubiquitaire est fixé dans `docs/domain/glossaire.md`, les contextes dans `docs/domain/context-map.md`.

## Conséquences

- Le contenu pédagogique (`scripts/lecons/`) n'est pas livré par `/feature` : ce sont des données, produites par la session principale.
- L'application actuelle (`app/`) ne reçoit plus que des corrections de bugs, chacune précédée d'un test de caractérisation.
