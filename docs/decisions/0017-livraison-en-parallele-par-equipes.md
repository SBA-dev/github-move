# 0017 : Livraison des stories en parallèle, une équipe par story, selon un graphe de dépendances

**Statut** : Acceptée · 2026-10-24 · précise 0006

## Contexte

Jusqu'ici les stories sont livrées une par une par `/feature` (décision 0006). Une story bloque la suivante même quand elles sont indépendantes (par exemple #19 dictée et #21 boîte et barres). Il reste une trentaine de stories : la livraison en série devient le goulot.

## Décision

- Les stories forment un **graphe orienté sans cycle** : `docs/graphe/stories.md` donne pour chaque story ses dépendances, son contexte et les ressources partagées qu'elle utilise. L'état de chaque story vit dans les labels `graphe:*` de son issue.
- **Une équipe par story** : une session de travail avec les 6 subagents, sur sa propre branche `feature/<n>-<slug>` partie de `main`. Elle suit `.claude/commands/equipe.md`, c'est-à-dire `/feature` plus les règles du travail en parallèle.
- Un **chef d'orchestre** (`/graphe`, `.claude/commands/graphe.md`) lance une équipe par story prête (au plus 3 en même temps), regroupe les validations, attribue les verrous et ordonne les merges.
- **Ressources partagées sous verrou** : `base` (migrations sur `savanturier-dev`, additives seulement), `email` (quota de 100 e-mails de connexion par heure), `merge` (un merge à la fois, après intégration de `main` et tout au vert).
- **Les deux arrêts humains restent**, regroupés : la validation des cadrages de plusieurs stories en un seul message, et l'autorisation de merge, par PR ou pour toute une vague. **L'équipe merge elle-même** une fois autorisée.
- Après chaque merge, les équipes en cours intègrent `main` (merge, pas de rebase).

## Options écartées

- **Continuer une story à la fois** : simple, mais la durée totale est la somme des stories au lieu du chemin critique.
- **Un subagent « chef d'équipe »** : un subagent ne peut pas lancer d'autres subagents ; l'équipe est donc une session à part entière (session cloud, ou worktree en local).
- **Merge sans autorisation humaine** : écarté pour l'instant (données d'enfants, beta à venir). L'autorisation « pour la vague » en réduit le coût.
- **État dans un fichier du dépôt** : chaque équipe le modifierait dans sa PR, avec des conflits à chaque merge. Les labels n'en créent pas.

## Conséquences

- `docs/feuille-de-route.md` et `docs/graphe/` ne sont modifiés que par le chef d'orchestre, en fin de vague.
- Le glossaire et la context map ne reçoivent que des ajouts pendant une vague.
- Les numéros de décision sont réservés par le chef d'orchestre pour éviter les doublons.
- Les données de test créées contre la base partagée portent un préfixe par story (`e2e-<n>-`).
- `/feature` reste utilisable pour une story seule.
