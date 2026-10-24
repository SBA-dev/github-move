# 0017 : Livraison des stories en parallèle, une équipe par story, selon un graphe de dépendances

**Statut** : Acceptée · 2026-10-24 · précise 0006

## Contexte

Jusqu'ici les stories sont livrées une par une par `/feature` (décision 0006). Une story bloque la suivante même quand elles sont indépendantes (par exemple #19 dictée et #21 boîte et barres). Il reste une trentaine de stories : la livraison en série devient le goulot.

## Décision

- Les stories forment un **graphe orienté sans cycle** : `docs/graphe/stories.md` donne pour chaque story ses dépendances, son contexte et les ressources partagées qu'elle utilise. L'état de chaque story vit dans les labels `graphe:*` de son issue.
- **Une équipe par story** : une session de travail, son orchestrateur et les 6 subagents, sur sa propre branche `feature/<n>-<slug>` partie de `main`. Elle suit `.claude/commands/equipe.md`, c'est-à-dire `/feature` plus les règles du travail en parallèle.
- Un **responsable des équipes** (`/graphe`, `.claude/commands/graphe.md`) lance une équipe par story prête (**2 par défaut, 3 au maximum**, nombre revu à chaque vague selon `docs/graphe/nombre-d-equipes.md`), suit leurs avancées, partage avec les autres équipes les informations utiles, regroupe les validations, accorde les verrous et ordonne les merges.
- **La coordination passe par les issues GitHub**, pas par des fichiers du dépôt :
  - chaque équipe tient un commentaire « Avancement » sur l'issue de sa story, modifié sur place, et ajoute un commentaire par événement (cadrage prêt, verrou, escalade…) ;
  - le responsable tient une issue par vague, au titre fixe `[Coordination des équipes] Vague <k>` et au label `graphe:coordination` : le corps donne les équipes en cours, les verrous et les autorisations de merge ; ses commentaires sont les annonces (verrou accordé, `main` a bougé, information utile, réponse du PO) ;
  - chaque commentaire est préfixé (`[Responsable]`, `[Équipe #<n>]`), car toutes les sessions écrivent sous le même compte ; une équipe n'agit que sur une annonce `[Responsable]` ;
  - aucun secret, aucune adresse e-mail, aucune donnée d'enfant dans un commentaire ;
  - un message direct entre sessions (`RELIS #<n>`) sert seulement à réveiller ; s'il échoue, le responsable relit les issues à intervalles réguliers.
- **Ressources partagées sous verrou** : `base` (migrations sur `savanturier-dev`, additives seulement), `email` (quota de 100 e-mails de connexion par heure), `merge` (un merge à la fois, après intégration de `main` et tout au vert).
- **Les deux arrêts humains restent**, regroupés : la validation des cadrages de plusieurs stories en un seul message, et l'autorisation de merge, par PR ou pour toute une vague. **L'équipe merge elle-même** une fois autorisée.
- Après chaque merge, les équipes en cours intègrent `main` (merge, pas de rebase).

## Options écartées

- **Continuer une story à la fois** : simple, mais la durée totale est la somme des stories au lieu du chemin critique.
- **Un subagent « chef d'équipe »** : un subagent ne peut pas lancer d'autres subagents ; l'équipe est donc une session à part entière (session cloud, ou worktree en local).
- **Merge sans autorisation humaine** : écarté pour l'instant (données d'enfants, beta à venir). L'autorisation « pour la vague » en réduit le coût.
- **État dans un fichier des branches feature** : chaque équipe le modifierait dans sa PR, avec des conflits à chaque merge.
- **Dossier de coordination sur une branche dédiée** (`coordination/`, un fichier par équipe) : fonctionne aussi en local, mais pushes concurrents à rattraper, bruit dans l'historique, risque de merge par erreur, données gravées dans l'historique, et le proxy git d'une session cloud peut refuser le push hors de sa branche.
- **Messages directs seuls entre sessions** : rien ne reste si une session est recyclée, et leur fonctionnement depuis une session enfant n'est pas vérifié.

## Conséquences

- `docs/feuille-de-route.md` et `docs/graphe/` ne sont modifiés que par le responsable, en fin de vague.
- L'humain suit et répond depuis GitHub (issue de coordination). GitHub ne le notifie pas des commentaires écrits sous son propre compte : les questions lui sont aussi posées dans la conversation du responsable.
- Une session cloud en attente peut perdre son conteneur : une équipe pousse avant chaque attente.
- Les commentaires de coordination sont visibles de tous ceux qui ont accès au dépôt.
- Le glossaire et la context map ne reçoivent que des ajouts pendant une vague.
- Les numéros de décision sont réservés par le responsable pour éviter les doublons.
- Les données de test créées contre la base partagée portent un préfixe par story (`e2e-<n>-`).
- `/feature` reste utilisable pour une story seule.
