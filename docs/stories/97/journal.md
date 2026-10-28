# Journal de la story #97 : retours animés et sonores pendant la séance

Équipe lancée par le responsable des équipes (`/graphe`, vague 1), issue de coordination #64.
Branche : `feature/97-retours-animes-et-sonores`, partie de `main` `ea2cca3`. Branche de base : `main`.
Numéro de décision réservé : 0034.

## 2026-10-28

- 07:30 UTC : démarrage. #97 dépend de #96 (PR #124, revue approuvée, non mergée). **Démarrage anticipé : cadrage seulement** (domaine + scénarios), aucun code avant le merge de #96.
- Question 1 de l'issue (source et licence des sons) déjà réglée par le PO le 2026-10-25 : 8 fichiers dans `public/sons/`, provenance dans `docs/sons.md`.
- Alignement sur `feature/96-refonte-visuelle` : jetons (`src/univers/jetons.ts`), transitions (`src/transitions/`, 300 ms au plus, `transform` et `opacity`), boutons en relief muets (`src/boutons/ressort-des-boutons.ts`) ; « Retours de réponse et effets sonores, dont le son au toucher d'un bouton : #97 » (hors périmètre de #96).
- 07:45 UTC : étape 1, `domain-modeler` : Motivation choisit l'effet sonore (à côté de l'humeur dans `Reaction`), Voix le joue et applique le Muet ; aucun changement d'Apprentissage. Ajouts au glossaire (fin de la section Voix) et à la context map. Questions #97.2 à #97.14. Commit `e80111a`.
- 08:00 UTC : étape 2, `po-acceptance` : 7 règles, 47 scénarios (9 plans, 25 `@a-valider`). Questions #97.15 à #97.19. Aucun scénario existant ne change de sens. R4 (record) et R7 (bouton touché) peuvent partir dans de petites stories si la story doit maigrir.
- `CADRAGE PRÊT` publié sur #97 ; attente de la validation du PO par le responsable. Pas de TDD tant que #96 n'est pas mergée.
