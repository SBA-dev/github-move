# Journal de la story #25 : Parcours par matière et verrous

Équipe lancée par le responsable (`/graphe`, vague 1, issue de coordination #64).
Branche de base : `main`. Branche de travail : `feature/25-parcours-par-matiere-et-verrous`.

## 2026-10-24

- 12:40 UTC : démarrage. Story voisine : #20 (ne pas toucher à ses agrégats). Aucune dépendance ouverte.
- 12:40 UTC : la table `resultats_des_lecons` (#24) porte `meilleures_etoiles` par profil et par leçon : a priori
  suffisante pour la progression, à confirmer par `domain-modeler`. Sans nouvelle migration, pas de verrou `base`.
