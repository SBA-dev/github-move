# Journal de la story #141 — Fin de séance : son de la quête, « Accueil », « bouton touché »

Branche de base : `main` (46ca728). Branche : `feature/141-fin-de-seance`. Équipe lancée par `/graphe` (« graphe 141 »).
Nature : correctifs `fix(#141)`. Décisions du PO : « son A, accueil A, issue oui » (02/11).

## 2026-11-04

- Étape 0 : issue, coordination #64 lues. Branche créée depuis `main`.
- Étape 1 (domaine) : **sautée**. Aucun nouveau concept ni règle : trois défauts d'une règle déjà validée (101.18 (a), 97.7, R7 de #97) et une destination de bouton décidée par le PO.
- Repérage « Accueil » : l'écran de fin de séance (`src/Application.tsx`, `onAccueil={() => aller("accueil")}`) mène à « Qui joue ? » ; la fin de révision, du test de départ et du défi mènent déjà à `revenirA("jeu")` (accueil de l'enfant).
