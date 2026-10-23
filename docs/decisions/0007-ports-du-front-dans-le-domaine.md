# 0007 : Ports utilisés par le front déclarés dans le domaine, et sous-domaine Voix

**Statut** : Acceptée · 2026-10-22

## Contexte

La décision 0003 fait passer l'heure, le hasard et les identifiants par des ports. Les règles du personnage guide (félicitations au hasard) et de la voix (choix de la voix, lecture phrase par phrase) tournent dans le navigateur, sans Edge Function. Le front doit donc connaître l'interface de ces ports, alors que les ports d'un cas d'usage vivent habituellement dans `application/`.

La voix (lecture à voix haute des consignes) n'appartient à aucun des cinq bounded contexts : Apprentissage, Motivation et Accompagnement s'en servent tous.

## Décision

- Les **interfaces** des ports dont une règle du domaine a besoin dans le navigateur (`Hasard`, `LecteurAVoixHaute`, `VoixDeLAppareil`) sont déclarées dans `domain/` et exportées par son `index.ts`. Ce sont des types TypeScript purs. Leurs adaptateurs (`speechSynthesis`, `Math.random`) vivent dans `src/` ou `infrastructure/`.
- Un **sous-domaine générique Voix** est créé : `supabase/functions/_shared/voix/`, importé par le front via `@domain/voix`. Le caractère de la voix de chaque personnage guide est fourni par Motivation.

## Options écartées

- Ports dans `application/` uniquement : le front devrait importer `application/`, ou réécrire l'interface.
- Voix dans Motivation : Apprentissage et Accompagnement en dépendraient pour lire une consigne.

## Conséquences

- Le domaine reste pur : il ne contient que des interfaces, jamais d'implémentation qui touche au navigateur.
- Les ports des cas d'usage côté serveur (repositories, clients externes) restent dans `application/`.
