# 0016 : Les séances terminées ne sont écrites que par le serveur

**Statut** : Acceptée · 2026-10-24 (option choisie par le PO)

## Contexte

La décision 0013 réserve les écritures d'Apprentissage à l'Edge Function `terminer-la-seance`, qui revalide la séance en rejouant les réponses. Le premier câblage de #24 donnait pourtant aux parents connectés un droit d'insertion sur `seances_terminees`, `questions_des_seances` et `resultats_des_lecons`, sous des policies qui vérifiaient seulement le rattachement : un parent pouvait écrire directement des étoiles pour son enfant, sans revalidation. La règle de 0013 ne tenait que par convention.

## Décision

1. Les rôles `anon` et `authenticated` n'ont **aucun droit d'écriture** sur ces trois tables ; ils gardent la lecture sous RLS (parent rattaché). La fonction SQL d'enregistrement n'est pas exécutable par eux.
2. `terminer-la-seance` vérifie le rattachement avec le **JWT de l'appelant** (RLS), relit la leçon, revalide la séance, puis **écrit avec la clé `service_role`**, côté serveur uniquement (`Deno.env`, jamais dans le front).
3. C'est une exception explicite à la règle de `CLAUDE.md` « les Edge Functions créent le client Supabase avec le JWT de l'appelant », comme l'envoi des e-mails de connexion (#5) : la lecture et le contrôle d'accès restent sous RLS, seule l'écriture revalidée passe par la clé de service.

## Options écartées

- **Garder l'insertion directe pour la beta** : un parent pouvait s'inventer des étoiles ; la règle de 0013 n'était pas garantie par la base.
- **Fonction `security definer` appelée avec le JWT** : appelable directement par `/rpc`, donc sans revalidation.

## Conséquences

- Le client `service_role` n'est créé que dans `terminer-la-seance`, après la vérification du rattachement et la revalidation.
- Toute nouvelle écriture d'Apprentissage suit le même chemin.
