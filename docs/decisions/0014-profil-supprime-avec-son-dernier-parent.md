# 0014 : Un profil enfant est supprimé avec son dernier parent

**Statut** : Acceptée · 2026-10-23 (validée par le PO)

## Contexte

Un profil enfant a toujours un ou deux parents rattachés (invariant 1 de #11). Le rattachement d'un parent disparaît quand son compte est supprimé (suppression en cascade depuis `auth.users`). Sans règle, un profil dont le dernier parent disparaît resterait en base, sans personne pour le voir, l'exporter ni le supprimer : des données d'enfant sans responsable.

## Décision

1. La base refuse tout profil enfant sans parent : une contrainte différée vérifie, à la fin de chaque transaction, qu'un profil a un ou deux rattachements (migration `20261023160603_profil_toujours_avec_un_parent`). La création passe par une seule transaction (profil et premier rattachement, décision 0009 n°2).
2. Quand le **dernier** rattachement d'un profil disparaît, le profil est **supprimé avec lui**, et toutes ses données le seront en cascade. Si le profil a deux parents, le départ de l'un garde le profil pour l'autre.

## Options écartées

- **Refuser la suppression du compte tant qu'il reste des profils** : le parent devrait d'abord supprimer chaque profil ; une suppression de compte demandée par le parent (RGPD) pourrait être bloquée.
- **Garder le profil sans parent** : données d'enfant sans responsable, contraire à la minimisation.

## Conséquences

- La suppression du compte d'un parent seul est irréversible pour les profils de ses enfants. L'export des données d'un profil avant suppression arrive avec #14.
- Les fonctions d'aide des policies (`est_rattache_au_profil`, `profil_sans_parent`) sont dans un schéma `private`, non exposé par l'API.
- Le plafond de deux parents devra être vérifié aussi à l'ajout d'un rattachement, avec l'invitation du second parent (#13).
