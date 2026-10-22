# 0009 : Écritures du contexte Famille par Edge Functions, invitation et suppression

**Statut** : Acceptée · 2026-10-22

## Contexte

Le lot 2 crée les premières tables : profils enfants, rattachements, invitations. Plusieurs règles portent sur plusieurs lignes à la fois (un profil a toujours un ou deux parents ; accepter une invitation rattache un parent et consomme l'invitation). Le parent invité n'est rattaché à rien avant d'accepter : la RLS ne lui montre pas l'invitation. La suppression d'un profil doit effacer toutes ses données, dans tous les contextes (RGPD).

## Décision

1. **Toute écriture du contexte Famille passe par une Edge Function**, qui valide l'entrée, appelle le cas d'usage du domaine et crée le client Supabase avec le JWT de l'appelant (la RLS s'applique). Le front ne fait que des lectures directes, sous RLS.
2. **Création d'un profil et de son premier rattachement en une seule transaction**, pour qu'aucun profil n'existe sans parent.
3. **Acceptation d'une invitation** par une fonction Postgres `security definer` à périmètre minimal, appelée avec le JWT du parent invité : elle vérifie l'empreinte du jeton, la validité, la limite de deux parents, puis rattache et consomme l'invitation en une fois. Jamais de clé `service_role` dans le front ; pas de `service_role` non plus pour ce cas.
3 bis. **Lecture d'une invitation avant de l'accepter** : une fonction Postgres `security definer` du même type, appelée avec le JWT du parent invité **connecté**, renvoie seulement le prénom de l'enfant et l'état de l'invitation (valable, expirée, déjà utilisée, annulée), à partir de l'empreinte du jeton. Elle ne renvoie rien d'autre (ni niveau, ni réglages, ni adresse e-mail du parent qui invite). Avant la connexion, rien n'est lu (décision n°2 du lot 2).
4. **Suppression** : suppression en cascade en base pour les tables du profil, plus un port d'effacement par contexte (`DonneesPersonnellesDuProfil`) pour ce qui n'est pas en base (Storage, caches). Chaque story qui ajoute une donnée de l'enfant l'ajoute à la suppression et à l'export.
5. La **clé d'univers** et le **niveau** sont des value objects publiés par leurs contextes (Motivation, Catalogue pédagogique) et importés par Famille, comme `CaractereDeLaVoix` (décision 0008).

## Options écartées

- Écritures directes du front sous RLS seulement : les règles sur plusieurs lignes ne tiendraient que par des policies, contraire à « pas de logique métier dans les seules policies RLS ».
- `service_role` dans l'Edge Function d'acceptation : plus simple, mais contourne la RLS pour tout le reste de la requête.

## Conséquences

- Les tests E2E du lot 2 ont besoin d'un Supabase local (Docker) ou du projet de développement.
- La fonction Postgres d'acceptation est testée par des tests de base (scénarios E2E et tests SQL), en plus du domaine.
