# Journal : issue #20, Calcul, fluence, addition posée

- 07:40 · Issue créée (lot 3 de `docs/reecriture.md`), label `reecriture`.
- 11:10 · Branche de base : `main`. Modèle et scénarios préparés sur `feature/lot-3-modele-et-scenarios` (partie de `feature/15-choix-de-la-voix`, rien n'étant encore mergé dans `main`).
- 11:10 · Validation des scénarios par lot (décision de démarrage n°2).
- 11:45 · Étape 1 : modèle du domaine écrit par `domain-modeler` (`docs/stories/20/domain-model.md`). Ordre de livraison conseillé pour le lot : #16 → #17 → #23 → #24 → #18 → #19 → #20 → #21 → #22. Questions ouvertes à trancher à la validation du lot.
- 11:41 · Étape 2 : critères d'acceptance écrits par `po-acceptance` (`features/20-calcul-fluence-addition-posee.feature`, `docs/stories/20/acceptance.md`) : 7 règles, 39 scénarios (43 cas), 9 `@a-valider`, 1 `@acces`. Propositions du modèle appliquées comme hypothèse de travail. Syntaxe vérifiée (`npx bddgen` : seules des étapes manquantes). Nouvelle question Q80 (aide d'un chiffre en double). Story la plus grosse du lot : découpage possible calcul / fluence / addition posée. ⛔ Validation du lot attendue.
