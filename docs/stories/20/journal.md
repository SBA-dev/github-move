# Journal : issue #20, Calcul, fluence, addition posée

- 07:40 · Issue créée (lot 3 de `docs/reecriture.md`), label `reecriture`.
- 11:10 · Branche de base : `main`. Modèle et scénarios préparés sur `feature/lot-3-modele-et-scenarios` (partie de `feature/15-choix-de-la-voix`, rien n'étant encore mergé dans `main`).
- 11:10 · Validation des scénarios par lot (décision de démarrage n°2).
- 11:45 · Étape 1 : modèle du domaine écrit par `domain-modeler` (`docs/stories/20/domain-model.md`). Ordre de livraison conseillé pour le lot : #16 → #17 → #23 → #24 → #18 → #19 → #20 → #21 → #22. Questions ouvertes à trancher à la validation du lot.
- 11:41 · Étape 2 : critères d'acceptance écrits par `po-acceptance` (`features/20-calcul-fluence-addition-posee.feature`, `docs/stories/20/acceptance.md`) : 7 règles, 39 scénarios (43 cas), 9 `@a-valider`, 1 `@acces`. Propositions du modèle appliquées comme hypothèse de travail. Syntaxe vérifiée (`npx bddgen` : seules des étapes manquantes). Nouvelle question Q80 (aide d'un chiffre en double). Story la plus grosse du lot : découpage possible calcul / fluence / addition posée. ⛔ Validation du lot attendue.
- 12:10 · Validation n°1 du lot 3 : « OK pour tout » du PO (`docs/stories/lot-3-decisions.md`, décisions 0012 et 0013). Scénarios mis à jour par `po-acceptance` : 9 `@a-valider` retirés, comportement inchangé ; questions passées en « Décisions » dans `acceptance.md`. Syntaxe vérifiée.
- 12:12 · Modèle mis à jour par `domain-modeler` : questions passées en « Décisions du PO » (réponse = proposition), règles du modèle alignées sur ces décisions, renvois vers les décisions 0012 et 0013 ; termes du lot 3 validés au glossaire (conflits n°8 à n°14 tranchés, Décisions n°23 à n°30).

## Livraison (vague 1 du graphe, équipe #20)

- 2026-10-24 12:45 · Étape 0 : équipe lancée par le responsable (issue de coordination #64). Branche `feature/20-calcul-fluence-addition-posee`, partie de `main` (`abb606a`). Branche de base : `main`. Story voisine : #25 (ne pas toucher à ses agrégats ni à `resultats_des_lecons`).
- 2026-10-24 12:45 · Étapes 1 et 2 sautées : modèle et scénarios déjà écrits et validés au lot 3 (« OK pour tout », `docs/stories/lot-3-decisions.md`). `CADRAGE PRÊT` posté pour information.
- 2026-10-24 13:05 · Base verte : 774 tests unitaires. Découpage TDD (étape 3), dans l'ordre :
  - **Catalogue** : C1 lecture d'un calcul (`operations` ou générateur par défaut) · C2 générateur d'opérations (signe, intervalles, `combien`, `cible`, complément ≤ cible) · C3 fluence (`duree`, générateur) · C4 addition posée (`operations`, générateur, `etapes`, somme < 1 000).
  - **Apprentissage, calcul** : A1 tirage des opérations (+, −, ×, :, complément) · A2 adaptation de la difficulté (6 réponses, 60 %, 65 %, 50 dernières réponses) · A3 mode de réponse (choix au CP, clavier de cristaux ensuite) · A4 astuce de l'opération · A5 phrase et carte du calcul · A6 question de calcul (réponse par nombre, erreur à chaque essai, « Je ne sais pas » au clavier) · A7 calcul dans la séance (opérations fixes ou tirées, niveau de la leçon, facilité) et revalidation (tirage hors du générateur).
  - **Apprentissage, fluence** : A8 exercice chronométré (heure en paramètre, score, fin) · A9 record de fluence et phrases de fin · A10 fluence dans la séance (une question, aucune erreur, séance de fluence seule sans étoiles, scores dans `SeanceTerminee`, réponses fausses dans l'adaptation) et revalidation.
  - **Apprentissage, addition posée** : A11 colonnes (rang, couleur, 3 au plus) · A12 étape poser (chiffre dans la colonne de son rang, aides, chiffre en double, « Je ne sais pas ») · A13 étape calculer (somme, retenue, choix au CP, retenue oubliée, phrases) · A14 générateur avec retenue garantie · A15 avancement et addition posée dans la séance, revalidation.
  - **Cas d'usage** : P1 `TerminerLaSeance` garde le record de fluence et ne touche pas au résultat de la leçon pour une fluence seule · P2 historique de calcul pour l'adaptation.
  - **Câblage** : migration `records_de_fluence` (+ étoiles facultatives d'une séance de fluence seule), adaptateurs Supabase, Edge Function, écrans (clavier de cristaux, fluence, colonnes).
