# Provenance

- Source : [zanwei/design-dna](https://github.com/zanwei/design-dna), commit `593e39b` (2026-08-28). Repris : `SKILL.md`, `references/`, `scripts/`. Non repris : README traduits, `docs/` (images de démonstration).
- Licence : MIT (`LICENSE`, © 2026 the design-dna authors).
- Modification : rappel de la règle absolue et priorité des règles du projet ajoutés en tête de `SKILL.md`. Aucune autre modification.
- Scripts : `scripts/measure-colors.mjs` et `scripts/verify.mjs` mesurent les couleurs d'une image en local, sans accès réseau. Ils ont besoin de la bibliothèque `sharp`, que le projet n'installe pas : à ajouter en dépendance de développement le jour où l'on s'en sert (#96), sinon le skill s'utilise sans la mesure.
- Ajouté à la demande du PO le 2026-10-26 (décision 0031). Pour mettre à jour : recopier depuis la source, garder le rappel en tête, noter le nouveau commit ici.
