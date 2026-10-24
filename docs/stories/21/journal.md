# Journal : issue #21, Boîte, barres

- 07:40 · Issue créée (lot 3 de `docs/reecriture.md`), label `reecriture`.
- 11:10 · Branche de base : `main`. Modèle et scénarios préparés sur `feature/lot-3-modele-et-scenarios` (partie de `feature/15-choix-de-la-voix`, rien n'étant encore mergé dans `main`).
- 11:10 · Validation des scénarios par lot (décision de démarrage n°2).
- 11:45 · Étape 1 : modèle du domaine écrit par `domain-modeler` (`docs/stories/21/domain-model.md`). Ordre de livraison conseillé pour le lot : #16 → #17 → #23 → #24 → #18 → #19 → #20 → #21 → #22. Questions ouvertes à trancher à la validation du lot.
- 11:41 · Étape 2 : critères d'acceptance écrits par `po-acceptance` (`features/21-boite-et-barres.feature`, `docs/stories/21/acceptance.md`) : 4 règles, 12 scénarios (31 cas), 4 `@a-valider`. Propositions du modèle appliquées comme hypothèse de travail. Syntaxe vérifiée (`npx bddgen` : seules des étapes manquantes). ⛔ Validation du lot attendue.
- 12:10 · Validation n°1 du lot 3 : « OK pour tout » du PO (`docs/stories/lot-3-decisions.md`, décisions 0012 et 0013). Scénarios mis à jour par `po-acceptance` : 4 `@a-valider` retirés, comportement inchangé ; questions passées en « Décisions » dans `acceptance.md`. Syntaxe vérifiée.
- 12:12 · Modèle mis à jour par `domain-modeler` : questions passées en « Décisions du PO » (réponse = proposition), règles du modèle alignées sur ces décisions, renvois vers les décisions 0012 et 0013 ; termes du lot 3 validés au glossaire (conflits n°8 à n°14 tranchés, Décisions n°23 à n°30).

## Livraison (équipe #21, vague 1, lancée par `/graphe`)

- 2026-10-24 17:50 UTC · Démarrage de l'équipe. Session `session_01V8ujt2iSDZBGQQA7x1Rs7Z`, branche `feature/21-boite-et-barres` partie de `main` (`6aedff7`). Branche de base : `main`.
- 17:50 · Étapes 1 et 2 sautées : modèle et scénarios déjà validés au lot 3 (« OK pour tout », `docs/stories/lot-3-decisions.md`), aucune question nouvelle. `CADRAGE PRÊT` pour information.
- 17:50 · Pas de migration (`par_type` est un `jsonb` libre). En revanche l'Edge Function `terminer-la-seance` de savanturier-dev devra être redéployée pour revalider les séances de boîte et de barres : verrou `base` demandé au moment du câblage.
- 17:55 · Relu #64 (RELIS) : la vague passe à 3 équipes avec #22 ; fichiers partagés d'Apprentissage par ajout seulement.
- 17:55 → 18:40 · Bloc **Catalogue** (TDD) : 6 cycles red → green.
  1. lecture d'une boîte (sens, réponse, écriture du calcul) ; 2. refus d'un item de boîte impossible ;
  3. barres « parties et tout » ; 4. comparaison ; 5. parts ; 6. refus d'un problème en barres impossible (19 cas).
  Deux commits d'adaptation des types des tests existants (`boite` puis `barres` ne sont plus des exercices génériques).
  L'erreur de lecture reste `LeconMalFormee` (seule erreur de lecture du Catalogue ; le modèle disait `ExerciceMalForme`).
  Bibliothèque entière relue par `lireLecon` : 265 leçons, 0 refus.
- 18:42 · Revue intermédiaire (delta `5a31eae..b84171d`) : À CORRIGER, 1 bloquant (règle « énoncé du problème requis » sans test) → tests de caractérisation (`4ba8059`). Non bloquants : typage des valeurs connues (refactor), modèle à aligner sur `LeconMalFormee`, « problème en barres » à ajouter au glossaire, `docs/format-lecons.md` à compléter (au câblage).
