# Journal : issue #17, Exercices à choix (bulles, lecture, écoute)

- 07:40 · Issue créée (lot 3 de `docs/reecriture.md`), label `reecriture`.
- 11:10 · Branche de base : `main`. Modèle et scénarios préparés sur `feature/lot-3-modele-et-scenarios` (partie de `feature/15-choix-de-la-voix`, rien n'étant encore mergé dans `main`).
- 11:10 · Validation des scénarios par lot (décision de démarrage n°2).
- 11:45 · Étape 1 : modèle du domaine écrit par `domain-modeler` (`docs/stories/17/domain-model.md`). Story porteuse de la question jouée, de la réponse et des choix proposés. Ordre de livraison conseillé pour le lot : #16 → #17 → #23 → #24 → #18 → #19 → #20 → #21 → #22. Questions ouvertes à trancher à la validation du lot.
- 11:41 · Étape 2 : critères d'acceptance écrits par `po-acceptance` (`features/17-exercices-a-choix.feature`, `docs/stories/17/acceptance.md`) : 7 règles, 25 scénarios (29 cas), 6 `@a-valider`. Propositions du modèle appliquées comme hypothèse de travail. Syntaxe vérifiée (`npx bddgen` : seules des étapes manquantes). ⛔ Validation du lot attendue.
- 12:10 · Validation n°1 du lot 3 : « OK pour tout » du PO (`docs/stories/lot-3-decisions.md`, décisions 0012 et 0013). Scénarios mis à jour par `po-acceptance` : 6 `@a-valider` retirés, comportement inchangé ; questions passées en « Décisions » dans `acceptance.md`. Syntaxe vérifiée.
- 12:12 · Modèle mis à jour par `domain-modeler` : questions passées en « Décisions du PO » (réponse = proposition), règles du modèle alignées sur ces décisions, renvois vers les décisions 0012 et 0013 ; termes du lot 3 validés au glossaire (conflits n°8 à n°14 tranchés, Décisions n°23 à n°30).
- 17:30 · Reprise de la story sur `claude/nice-mendel-cp9syg`, repartie de `main` à jour après le merge de #16 (PR #53). Branche de base : `main`. Modèle et scénarios déjà validés (lot 3) : étapes 1 et 2 sautées.
- 17:30 · Périmètre (même règle que #16) : les scénarios qui demandent le réglage « tout lire à voix haute » ou le mode dys (#12, pas encore livrés) seront tagués `@depend-de-12`. Les 7 scénarios `@depend-de-17` de #16 sont à rendre exécutables par cette story.
- 17:32 · Étape 3 : boucle TDD. Comportements :
  1. Catalogue : exercices à choix typés (`QuestionAChoix` : au moins deux choix après dédoublonnage, réponse parmi les choix, `aide?` ; bulles, lecture avec `texte`, écoute avec `langue` et `dire`).
  2. Apprentissage : `ChoixProposes` (dédoublonnage par texte exact, mélange par `Hasard`, choix écarté, réduction à deux).
  3. Apprentissage : `QuestionJouee` et `Seance.repondre` (juste, fausse, déjà écartée, erreurs, `QuestionDejaReussie`, choix tirés une fois au début de la séance).
  4. Apprentissage : `CleDeQuestion` et questions qui ont eu une erreur.
  5. Apprentissage : lecture des choix, explication de la réponse, phrases du déroulé (question par défaut de l'écoute, « Essaie une autre bulle. », « Écoute encore. », introduction de la lecture).
