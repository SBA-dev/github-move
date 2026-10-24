# Journal : issue #18, Classer, ordre, trous

- 07:40 · Issue créée (lot 3 de `docs/reecriture.md`), label `reecriture`.
- 11:10 · Branche de base : `main`. Modèle et scénarios préparés sur `feature/lot-3-modele-et-scenarios` (partie de `feature/15-choix-de-la-voix`, rien n'étant encore mergé dans `main`).
- 11:10 · Validation des scénarios par lot (décision de démarrage n°2).
- 11:45 · Étape 1 : modèle du domaine écrit par `domain-modeler` (`docs/stories/18/domain-model.md`). Ordre de livraison conseillé pour le lot : #16 → #17 → #23 → #24 → #18 → #19 → #20 → #21 → #22. Questions ouvertes à trancher à la validation du lot.
- 11:41 · Étape 2 : critères d'acceptance écrits par `po-acceptance` (`features/18-classer-ordre-trous.feature`, `docs/stories/18/acceptance.md`) : 5 règles, 21 scénarios (27 cas), 5 `@a-valider`. Propositions du modèle appliquées comme hypothèse de travail. Syntaxe vérifiée (`npx bddgen` : seules des étapes manquantes). ⛔ Validation du lot attendue.
- 12:10 · Validation n°1 du lot 3 : « OK pour tout » du PO (`docs/stories/lot-3-decisions.md`, décisions 0012 et 0013). Scénarios mis à jour par `po-acceptance` : 5 `@a-valider` retirés, comportement inchangé ; questions passées en « Décisions » dans `acceptance.md`. Syntaxe vérifiée.
- 12:12 · Modèle mis à jour par `domain-modeler` : questions passées en « Décisions du PO » (réponse = proposition), règles du modèle alignées sur ces décisions, renvois vers les décisions 0012 et 0013 ; termes du lot 3 validés au glossaire (conflits n°8 à n°14 tranchés, Décisions n°23 à n°30).
- 2026-10-24 · Reprise de la story sur `claude/nice-mendel-cp9syg`, repartie de `main` à jour (#24 mergée, PR #59). Modèle et scénarios validés (lot 3). Leçon de #11, #12 et #24 appliquée : tout code d'infrastructure passe d'abord par un test rouge ; la non-régression complète est lancée avant la PR.
- Étape 3 : boucle TDD. Comportements :
  1. Catalogue : exercices `classer`, `ordre` et `trous` typés et validés (groupes, items, éléments, découpage du texte à trous en segments et trous, distracteurs, consignes par défaut).
  2. Apprentissage : `classer` (une question par étiquette, dans l'ordre choisi par l'enfant, `Placement(etiquette, groupe)`) et `ordre` (une question par position, éléments de même texte interchangeables), aides et paroles de ces types.
  3. Apprentissage : `trous` (une question par trou dans l'ordre du texte, choix proposés selon la décision n°9, mécanique des choix de #17, « Je ne sais pas » de #23), aides et paroles.
  Puis câblage front (poser en glissant, en touchant ou au clavier ; trou annoncé aux lecteurs d'écran), revalidation serveur des nouvelles réponses (#24), E2E et levée des `@depend-de-18`.
- 2026-10-24 09:14 · `@depend-de-18` retiré des scénarios de #16 (deux scénarios) et de #23 (deux blocs `Exemples`) ; `grep -rn depend-de-18 features/` ne renvoie plus rien. `@wip` conservé sur `features/18-classer-ordre-trous.feature` jusqu'aux E2E verts.
