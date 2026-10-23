# 0010 : Tests qui touchent la base exécutés contre le projet de développement en ligne

**Statut** : Acceptée · 2026-10-23

## Contexte

Les stories du lot 2 et la connexion du parent (#5) ont besoin d'une vraie base Supabase : migrations, RLS, Auth, Edge Functions. Le conteneur cloud n'a pas de démon Docker, donc pas de `supabase start`. Un projet de développement existe : `savanturier-dev`, région `eu-west-1` (Irlande).

Le réseau du conteneur cloud passe par un proxy HTTPS. Une fois `cxptcwkegwhdmhqjxttv.supabase.co` et `aws-0-eu-west-1.pooler.supabase.com` autorisés, l'API du projet (REST, Auth, Edge Functions) et l'API de gestion (`api.supabase.com`) répondent. En revanche, la connexion Postgres directe (ports 5432 et 6543) reste fermée : `supabase db push` et `supabase migration list` ne peuvent pas se connecter depuis le conteneur.

## Décision

1. Les tests qui touchent la base (E2E des stories, tests SQL) s'exécutent **contre le projet en ligne `savanturier-dev`**, pas contre un Supabase local.
2. Depuis le conteneur cloud, les migrations s'appliquent par **l'API de gestion de Supabase** (HTTPS), avec `SUPABASE_ACCESS_TOKEN`. En local, ou dans un environnement qui ouvre Postgres, on utilise `supabase db push`.
3. Le projet de développement ne contient que des **données de test** : jamais de données d'un vrai enfant.
4. La clé `service_role` sert uniquement aux tests (préparation et nettoyage des données). Elle n'apparaît jamais dans le front.

## Options écartées

- **Supabase local avec Docker** : indisponible dans le conteneur cloud. Les sessions cloud ne pourraient plus lancer les scénarios qui touchent la base.

## Conséquences

- Les tests partagent une même base : chaque scénario crée ses propres données (parent, profils) et les nettoie, sans dépendre de l'ordre d'exécution.
- Appliquer une migration par l'API de gestion modifie une ressource partagée : dans le conteneur cloud, cela demande une permission explicite de l'outil.
- Le projet est en `eu-west-1` (Irlande), pas à Francfort comme l'indique `CLAUDE.md`. C'est bien dans l'UE. Il reste au PO à choisir : garder l'Irlande et corriger la doc, ou recréer le projet à Francfort avant le premier vrai utilisateur.
