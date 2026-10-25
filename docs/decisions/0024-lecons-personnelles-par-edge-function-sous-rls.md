# 0024 : Leçons personnelles écrites par Edge Function avec le JWT du parent, sous RLS

**Statut** : Acceptée · 2026-10-25 (recommandation 39.16 retenue par le PO)

## Contexte

La story #39 crée le premier agrégat du contexte Accompagnement : la leçon personnelle, préparée par les générateurs locaux à partir du texte du parent, pour un profil enfant. L'aperçu se calcule dans le navigateur (domaine partagé, décision 0003). Le serveur reste la source de vérité : une leçon envoyée toute faite par le front ne doit pas être crue. Les séances, elles, ne sont écrites que par le serveur avec `service_role` (décision 0016) ; il fallait choisir pour les leçons personnelles.

## Décision

1. Les leçons personnelles sont écrites par **deux Edge Functions**, `creer-une-lecon-personnelle` et `supprimer-une-lecon-personnelle`, qui créent le client Supabase **avec le JWT du parent**. Le front ne fait que des lectures directes, sous RLS.
2. La **RLS** de la table `lecons_personnelles` (lecture, création, suppression par un parent rattaché au profil, `private.est_rattache_au_profil`) est la barrière d'accès ; aucun droit de modification. **Pas de `service_role`**.
3. La création reçoit le profil, le texte du parent, la classe et la matière, et **refait la préparation côté serveur** avec le même domaine (`@domain/accompagnement`) ; elle ne croit pas la leçon envoyée par le front. La leçon est revalidée (`lireLecon` et règles propres) avant l'enregistrement.
4. Le **texte du parent est conservé** avec la leçon (réponse 39.13) : même enregistrement, même RLS, supprimé avec la leçon et en cascade avec le profil ; export dans #14.
5. `terminer-la-seance` lit aussi les leçons `perso-…`, **avec le JWT de l'appelant**, pour revalider une séance ; il vérifie que le profil de la leçon est celui de la séance. Il n'écrit jamais dans cette table.

## Options écartées

- **Écriture par le serveur seul (`service_role`, comme 0016)** : empêcherait un parent d'insérer directement une leçon mal formée, mais ajoute une exception de plus à la règle de `CLAUDE.md` pour un dégât qui reste chez lui.
- **Enregistrer la leçon préparée par le front** : le serveur croirait un calcul fait sur l'appareil.

## Conséquences

- Un parent pourrait insérer directement, sous RLS, une leçon mal formée pour **son** enfant : les contraintes de la table (préfixe `perso-`, taille, identifiant cohérent, longueur du texte) la limitent, et les lecteurs l'écartent (`lireLecon`).
- L'enregistrement d'une leçon personnelle demande le réseau ; l'aperçu, non.
