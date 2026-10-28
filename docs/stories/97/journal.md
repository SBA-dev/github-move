# Journal de la story #97 : retours animés et sonores pendant la séance

Équipe lancée par le responsable des équipes (`/graphe`, vague 1), issue de coordination #64.
Branche : `feature/97-retours-animes-et-sonores`, partie de `main` `ea2cca3`. Branche de base : `main`.
Numéro de décision réservé : 0034.

## 2026-10-28

- 07:30 UTC : démarrage. #97 dépend de #96 (PR #124, revue approuvée, non mergée). **Démarrage anticipé : cadrage seulement** (domaine + scénarios), aucun code avant le merge de #96.
- Question 1 de l'issue (source et licence des sons) déjà réglée par le PO le 2026-10-25 : 8 fichiers dans `public/sons/`, provenance dans `docs/sons.md`.
- Alignement sur `feature/96-refonte-visuelle` : jetons (`src/univers/jetons.ts`), transitions (`src/transitions/`, 300 ms au plus, `transform` et `opacity`), boutons en relief muets (`src/boutons/ressort-des-boutons.ts`) ; « Retours de réponse et effets sonores, dont le son au toucher d'un bouton : #97 » (hors périmètre de #96).
