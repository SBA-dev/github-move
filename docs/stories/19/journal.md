# Journal : issue #19, Dictée, conjugaison

- 07:40 · Issue créée (lot 3 de `docs/reecriture.md`), label `reecriture`.
- 11:10 · Branche de base : `main`. Modèle et scénarios préparés sur `feature/lot-3-modele-et-scenarios` (partie de `feature/15-choix-de-la-voix`, rien n'étant encore mergé dans `main`).
- 11:10 · Validation des scénarios par lot (décision de démarrage n°2).
- 11:45 · Étape 1 : modèle du domaine écrit par `domain-modeler` (`docs/stories/19/domain-model.md`). Ordre de livraison conseillé pour le lot : #16 → #17 → #23 → #24 → #18 → #19 → #20 → #21 → #22. Questions ouvertes à trancher à la validation du lot.
- 11:41 · Étape 2 : critères d'acceptance écrits par `po-acceptance` (`features/19-dictee-et-conjugaison.feature`, `docs/stories/19/acceptance.md`) : 6 règles, 20 scénarios (28 cas), 4 `@a-valider`. Propositions du modèle appliquées comme hypothèse de travail. Syntaxe vérifiée (`npx bddgen` : seules des étapes manquantes). ⛔ Validation du lot attendue.
- 12:10 · Validation n°1 du lot 3 : « OK pour tout » du PO (`docs/stories/lot-3-decisions.md`, décisions 0012 et 0013). Scénarios mis à jour par `po-acceptance` : 4 `@a-valider` retirés, comportement inchangé ; questions passées en « Décisions » dans `acceptance.md`. Syntaxe vérifiée.
- 12:12 · Modèle mis à jour par `domain-modeler` : questions passées en « Décisions du PO » (réponse = proposition), règles du modèle alignées sur ces décisions, renvois vers les décisions 0012 et 0013 ; termes du lot 3 validés au glossaire (conflits n°8 à n°14 tranchés, Décisions n°23 à n°30).
- 2026-10-24 · Reprise de la story sur `claude/nice-mendel-cp9syg`, repartie de `main` à jour (#18 mergée, PR #60). Modèle et scénarios validés (lot 3). Leçons de #18 appliquées : l'implémenteur s'arrête quand un code (sécurité, rejeu) n'est exigé par aucun test ; les paroles sont choisies par Motivation (`ParoleDue`) ; les tirages enregistrés (choix des formes, lettres du mot et intruses) sont validés strictement au rejeu ; infrastructure en RED d'abord ; non-régression complète avant la PR.
- Étape 3 : boucle TDD. Comportements :
  1. Catalogue : exercices `dictee` et `conjugaison` typés et validés.
  2. Apprentissage, dictée : mot à écrire (cases, caractères déjà écrits), clavier proposé (règle automatique, lettres du mot et intruses, clavier complet avec « œ »), correction automatique, lettres gardées, « Je ne sais pas » (#23), paroles, rejeu.
  3. Apprentissage, conjugaison : une question par personne, choix de la forme, aide, félicitation finale (Motivation), rejeu.
  Puis serveur (réponse « mot écrit » dans le corps de la séance, RED d'abord), front (cases, touches, Effacer, réécouter, plus lentement, tableau de conjugaison, Muet / sans voix), E2E et levée des `@depend-de-19`.
- 2026-10-24 11:25 · Correction par `po-acceptance` : « arc-en-ciel » a 9 cases à écrire (a r c e n c i e l), pas 8, dans le scénario des caractères déjà écrits et dans les données de test de `acceptance.md`. Aucun autre changement.
