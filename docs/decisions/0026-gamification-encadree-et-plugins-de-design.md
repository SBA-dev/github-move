# 0026 : Gamification encadrée par un skill, plugins de design et de pédagogie

**Statut** : Acceptée · 2026-10-25 (demande du PO : une application plus ludique, « plus gaming »)

## Contexte

Le PO trouve l'interface et les leçons trop peu ludiques et trop peu animées. Il veut que Savanturier devienne une vraie gamification de l'apprentissage. Le projet a déjà des mécaniques de jeu (étoiles, parcours, personnage guide, univers) et en prévoit d'autres dans le contexte Motivation (#65, #32, #31, #30, #33). Mais aucune règle commune ne dit encore comment rendre un écran ludique, ni jusqu'où aller avec des enfants de 6 à 11 ans. Il n'existe pas non plus de skill Claude dédié à la gamification.

## Décision

1. Un skill du projet, **`.claude/skills/gamification/`**, fixe la boucle de jeu d'une séance, le catalogue des retours animés et sonores, l'accessibilité des animations, les garde-fous éthiques (pas de loot box, pas de FOMO, pas de série qui punit, pas de classement entre enfants…) et une checklist par rôle. `po-acceptance`, `implementer` et `mr-reviewer` le lisent.
2. Trois plugins sont déclarés dans `.claude/settings.json`, avec leur marketplace GitHub à une version fixée :
   - `frontend-design` (Anthropic, `anthropics/claude-plugins-official`) : conception d'écrans travaillés et animés ;
   - `design` (Anthropic, `anthropics/knowledge-work-plugins`) : critique de design, textes d'interface, revue d'accessibilité ;
   - `education-agent-skills` (Gareth Manning, `GarethManning/education-agent-skills`, CC BY-SA 4.0) : sciences de l'apprentissage (flow, aides graduées, pratique espacée, charge cognitive).
3. Les plugins **conseillent**. `CLAUDE.md`, le glossaire, les décisions et le skill `gamification` **décident** en cas de conflit.

## Conséquences

- Les idées de mécaniques nouvelles (carte au trésor, défi de fin de chapitre, quête du jour…) restent des pistes : chacune passe par une story, la validation du PO et un ajout au glossaire avant d'apparaître dans le code.
- `education-agent-skills` ajoute 165 skills, dont les descriptions occupent de la place dans le contexte de chaque session. S'il gêne, on le désactive dans `.claude/settings.json` sans toucher au reste.
- Le plugin `design` déclare des connecteurs MCP (Figma, Slack, Notion…) qui demandent une authentification. Ils sont inutiles au projet et restent non connectés.
- Le plugin communautaire est figé sur une étiquette (`v3.1.0`). Une mise à jour se fait par un commit qui change cette étiquette, après relecture de ses changements.
