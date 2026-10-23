# Journal : issue #16, Étapes lues puis exercices

- 07:40 · Issue créée (lot 3 de `docs/reecriture.md`), label `reecriture`.
- 11:10 · Branche de base : `main`. Modèle et scénarios préparés sur `feature/lot-3-modele-et-scenarios` (partie de `feature/15-choix-de-la-voix`, rien n'étant encore mergé dans `main`).
- 11:10 · Validation des scénarios par lot (décision de démarrage n°2).
- 11:45 · Étape 1 : modèle du domaine écrit par `domain-modeler` (`docs/stories/16/domain-model.md`). Story porteuse de la séance (plan, avancement) et de la leçon lue par le Catalogue. Ordre de livraison conseillé pour le lot : #16 → #17 → #23 → #24 → #18 → #19 → #20 → #21 → #22. Questions ouvertes à trancher à la validation du lot.
- 11:41 · Étape 2 : critères d'acceptance écrits par `po-acceptance` (`features/16-etapes-puis-exercices.feature`, `docs/stories/16/acceptance.md`) : 7 règles, 30 scénarios (35 cas), 8 `@a-valider`. Propositions du modèle appliquées comme hypothèse de travail. Syntaxe vérifiée (`npx bddgen` : seules des étapes manquantes). Numérotation unique des questions du lot (1 à 78, nouvelles à partir de 79) définie dans `docs/stories/16/acceptance.md`. ⛔ Validation du lot attendue.
- 12:10 · Validation n°1 du lot 3 : « OK pour tout » du PO (`docs/stories/lot-3-decisions.md`, décisions 0012 et 0013). Scénarios mis à jour par `po-acceptance` : 8 `@a-valider` retirés, comportement inchangé ; questions passées en « Décisions » dans `acceptance.md`. Syntaxe vérifiée.
- 12:12 · Modèle mis à jour par `domain-modeler` : questions passées en « Décisions du PO » (réponse = proposition), règles du modèle alignées sur ces décisions, renvois vers les décisions 0012 et 0013 ; termes du lot 3 validés au glossaire (conflits n°8 à n°14 tranchés, Décisions n°23 à n°30).
- 12:40 (2026-10-23) · Étape 3 lancée après le merge de la PR #51 (modèles et scénarios du lot 3). Branche `feature/16-etapes-puis-exercices`, partie de `main` à jour. Branche de base : `main`. Comportements, dans l'ordre :
  - cycle 1 (Catalogue) : types d'exercice et leurs libellés, matière, niveau, `lireLecon` (champs obligatoires, étapes, exercice de type inconnu écarté) ;
  - cycle 2 (Catalogue) : page de la leçon (titres des exercices, « niveau · matière », bloc adulte) ;
  - cycle 3 (Apprentissage) : choix de séance, plan de séance, avancement (questions par type) ;
  - cycle 4 (Apprentissage) : agrégat `Seance` (commencer, étapes de leçon, continuer, texte lu d'une étape, exercice en cours) ;
  - cycle 5 (Motivation) : paroles de séance.
  Puis câblage (front de la page de la leçon et de l'écran de séance).
