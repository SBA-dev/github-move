# 0012 : Lecture du format JSON des leçons dans le domaine du Catalogue

**Statut** : Acceptée · 2026-10-23

## Contexte

Le lot 3 joue les leçons de `app/bibliotheque.json` (format décrit dans `docs/format-lecons.md`). L'enfant doit pouvoir jouer hors ligne (décision 0003) : le front lit la bibliothèque gardée sur l'appareil (#8), sans appel au serveur. La skill DDD place d'ordinaire la traduction d'un format externe dans un mapper d'`infrastructure/`, que le front n'importe pas.

## Décision

1. La lecture et la validation du format JSON d'une leçon sont une **fonction pure du domaine du Catalogue** : `lireLecon(brut)` dans `supabase/functions/_shared/catalogue/domain/`, exportée par `@domain/catalogue`.
2. Elle produit `Lecon`, un value object en lecture seule (Published Language du Catalogue vers Apprentissage). Apprentissage ne lit jamais le JSON brut.
3. Les règles de validation propres à chaque type d'exercice vivent avec ce type (#17 à #22). Un type d'exercice inconnu est écarté : ni affiché, ni joué, ni compté.
4. Côté serveur, le même code sert derrière le port `LeconsDuCatalogue`.

## Options écartées

- **Mapper dans `infrastructure/`** : le front ne pourrait pas lire une leçon hors ligne sans réécrire la règle, ce qu'interdit la décision 0003.

## Conséquences

- Le format JSON des leçons devient du code métier testé (Deno.test) : tout changement du format met à jour `docs/format-lecons.md`, le pipeline et `lireLecon` dans la même story (règle de `CLAUDE.md`).
- Le dossier `catalogue/` est créé par la première story du lot 3 (#16).
