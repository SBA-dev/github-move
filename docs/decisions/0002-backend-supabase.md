# 0002 : Backend Supabase

**Statut** : Acceptée · 2026-10-22

## Contexte

Le backend doit gérer les comptes parents, les profils enfants, la progression, les fichiers (enregistrements de lecture, photos de devoirs) et relayer les appels à l'IA. La logique serveur est légère : l'essentiel des règles tourne aussi dans le navigateur (voir 0003).

## Options étudiées

- **Supabase** : Postgres, Auth, Storage et Edge Functions (Deno/TypeScript), avec la sécurité par Row Level Security.
- **Java (Spring Boot)** : solide et facile à recruter, mais l'authentification, le stockage, l'hébergement et la sécurité seraient à construire et à maintenir.
- **Firebase** : comparable à Supabase, mais sans base SQL. Les rapports de progression y sont plus difficiles à écrire.

## Décision

**Supabase**, hébergé dans l'UE. La logique métier est écrite en TypeScript dans les Edge Functions (architecture hexagonale, voir `CLAUDE.md`).

## Conséquences

- On démarre en quelques jours, sans serveur à administrer.
- Les données restent du SQL standard. Un service Java pourra s'ajouter plus tard si une logique serveur lourde apparaît (licences pour les écoles, exports), sans migration de données.
- Il faut installer Deno et la CLI Supabase dans l'environnement de développement.
