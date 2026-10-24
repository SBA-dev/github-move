# Journal : issue #21, Boîte, barres

- 07:40 · Issue créée (lot 3 de `docs/reecriture.md`), label `reecriture`.
- 11:10 · Branche de base : `main`. Modèle et scénarios préparés sur `feature/lot-3-modele-et-scenarios` (partie de `feature/15-choix-de-la-voix`, rien n'étant encore mergé dans `main`).
- 11:10 · Validation des scénarios par lot (décision de démarrage n°2).
- 11:45 · Étape 1 : modèle du domaine écrit par `domain-modeler` (`docs/stories/21/domain-model.md`). Ordre de livraison conseillé pour le lot : #16 → #17 → #23 → #24 → #18 → #19 → #20 → #21 → #22. Questions ouvertes à trancher à la validation du lot.
- 11:41 · Étape 2 : critères d'acceptance écrits par `po-acceptance` (`features/21-boite-et-barres.feature`, `docs/stories/21/acceptance.md`) : 4 règles, 12 scénarios (31 cas), 4 `@a-valider`. Propositions du modèle appliquées comme hypothèse de travail. Syntaxe vérifiée (`npx bddgen` : seules des étapes manquantes). ⛔ Validation du lot attendue.
- 12:10 · Validation n°1 du lot 3 : « OK pour tout » du PO (`docs/stories/lot-3-decisions.md`, décisions 0012 et 0013). Scénarios mis à jour par `po-acceptance` : 4 `@a-valider` retirés, comportement inchangé ; questions passées en « Décisions » dans `acceptance.md`. Syntaxe vérifiée.
- 12:12 · Modèle mis à jour par `domain-modeler` : questions passées en « Décisions du PO » (réponse = proposition), règles du modèle alignées sur ces décisions, renvois vers les décisions 0012 et 0013 ; termes du lot 3 validés au glossaire (conflits n°8 à n°14 tranchés, Décisions n°23 à n°30).

## Livraison (équipe #21, vague 1, lancée par `/graphe`)

- 2026-10-24 17:45 UTC · Démarrage de l'équipe. Session `session_01V8ujt2iSDZBGQQA7x1Rs7Z`, branche `feature/21-boite-et-barres` partie de `main` (`6aedff7`). Branche de base : `main`.
- 17:45 · Étapes 1 et 2 sautées : modèle et scénarios déjà validés au lot 3 (« OK pour tout », `docs/stories/lot-3-decisions.md`), aucune question nouvelle. `CADRAGE PRÊT` pour information.
- 17:45 · Pas de migration (`par_type` est un `jsonb` libre). En revanche l'Edge Function `terminer-la-seance` de savanturier-dev devra être redéployée pour revalider les séances de boîte et de barres : verrou `base` demandé au moment du câblage.
- 17:49 · Relu #64 (RELIS) : la vague passe à 3 équipes avec #22 ; fichiers partagés d'Apprentissage par ajout seulement.
- 17:47 → 17:59 · Bloc **Catalogue** (TDD) : 6 cycles red → green.
  1. lecture d'une boîte (sens, réponse, écriture du calcul) ; 2. refus d'un item de boîte impossible ;
  3. barres « parties et tout » ; 4. comparaison ; 5. parts ; 6. refus d'un problème en barres impossible (19 cas).
  Deux commits d'adaptation des types des tests existants (`boite` puis `barres` ne sont plus des exercices génériques).
  L'erreur de lecture reste `LeconMalFormee` (seule erreur de lecture du Catalogue ; le modèle disait `ExerciceMalForme`).
  Bibliothèque entière relue par `lireLecon` : 265 leçons, 0 refus.
- 18:00 · Revue intermédiaire (delta `5a31eae..b84171d`) : À CORRIGER, 1 bloquant (règle « énoncé du problème requis » sans test) → tests de caractérisation (`4ba8059`). Non bloquants : typage des valeurs connues (refactor), modèle à aligner sur `LeconMalFormee`, « problème en barres » à ajouter au glossaire, `docs/format-lecons.md` à compléter (au câblage).
- 18:02 · Re-revue du delta `b84171d..b1fd7a1` : **APPROUVÉ**. Dernier commit relu : `b1fd7a1` (départ du delta suivant).
- 18:03 → 18:15 · Bloc **Apprentissage** (TDD), 8 cycles :
  7. mode de réponse : seuil « CP et 20 au plus » (`ModeDeReponse.pour(niveau, reponse?)`, sans réponse : comportement de #20 inchangé) ;
  8. paroles de la boîte (déroulé, aide, ouverture) ; 9. paroles des barres (explication du schéma, aide du problème ou de sa forme, explication de la réponse) ;
  10. description du schéma pour les lecteurs d'écran (nombre de parts cherché : « Nombre de parts : ?. » ; chaque segment finit par un point, y compris « Chaque part : ?. ») ;
  11. jouer une boîte dans la séance (`QuestionDeBoite` enveloppe une `QuestionDeCalcul`, type `boite`, clé `n:`) ; 12. boîte ouverte après la bonne réponse ;
  13. jouer un schéma en barres dans la séance (`QuestionDeProbleme`, type `barres`, clé `p:`). `implementer` a contesté 2 tests : la leçon de test donnait 20, réponse qui se donne par choix au CP (Q51). Fixture corrigée par `test-writer` (24), règle inchangée (1 aller-retour) ;
  14. revalidation par le serveur : déjà vraie (rejeu générique), tests gardés en caractérisation.
- 18:18 · VERROU base demandé (redéploiement de `terminer-la-seance`, sans migration), accordé par le responsable à 18:18. Règle : chaque déploiement contient tout ce qui est déjà déployé (merge local non commité, dans le scratchpad).
- 18:20 · Revue intermédiaire Apprentissage (delta `b1fd7a1..de65634`) : **APPROUVÉ**, 9 non bloquants. Traités en refactor : `instanceof` de la classe commune et `aideDeLaDerniereErreur` dans `exercice-joue.ts`, calcul de la boîte construit depuis `a`, `sens`, `b`, options de `avecLesChoix`, réponse facultative explicite dans `ModeDeReponse`, `QuestionDeProblemeEnBarres`. Notés pour plus tard (feuille de route, responsable) : retour polymorphe « après la réponse » porté par chaque `QuestionPosee` pour alléger `exercice-joue.ts`. Commit `1bebf30` : GREEN des barres et extraction de la classe commune mêlés (à éviter).
- 18:20 · Description du schéma : point final gardé (« Chaque part : ?. »), comme les deux autres textes de Q55 ; texte du nombre de parts cherché non couvert par Q55 → question #21.1 posée au responsable (non bloquante, reco codée).
- 18:20 · Clé de la boîte : `n:` comme le modèle (décision n°4) ; la garde « préfixes de clé distincts » ne liste pas `boite`, qui partage volontairement le préfixe du calcul. Au lot 4 (rejouer la boîte en révision, Q52), retrouver l'item par son calcul dans la leçon.
- 18:27 · `terminer-la-seance` redéployée sur savanturier-dev depuis `db3d1a7` (contient `main` `6aedff7`), `deno check` OK, `--use-api` (sans Docker). Verrou `base` rendu pour ne pas bloquer #22 ; redemandé si le domaine change encore.
- 18:30 · Glossaire et modèle mis à jour par `domain-modeler` (`b5d2735`) : `LeconMalFormee`, noms du code, 5 termes ajoutés en fin de section (problème en barres, parties et tout, comparaison, parts, phrase réponse).
- 18:40 · Câblage front par `implementer` (`03df4ac`) : `useQuestionIllustree` (boîte et barres), `BoiteAJetons`, `RangeesDeJetons`, `SchemaDuProbleme`, `SchemaEnBarres`, `dessin-du-schema` ; `feliciterPuisExpliquer` ; `docs/format-lecons.md` complété (`67ac9b7`). Pipeline : aucun changement nécessaire.
- 18:42 · Étape 4 (review complète, centrée sur le câblage) et étape 5 (steps E2E, mise au point sur `telephone`) lancées en parallèle.
- 18:50 · Review étape 4, cycle 1 : **À CORRIGER**, 2 bloquants front (« Réécouter » pendant le déroulé bloquait l'apparition de la réponse ; couvercle `.boite::before` animé malgré les mouvements réduits, la règle `*` ne couvrant pas les pseudo-éléments). Non bloquant pris en TDD (cycle 15) : description du schéma résolu avec la valeur trouvée (`06485ed` red, `53ca8f3`). Corrections `5cbcfce`, `2dcb945` (avec les petits refactors). Le front n'a pas de tests unitaires : les deux bugs sont vérifiés par l'E2E.
- 19:00 · Review étape 4, cycle 2 : **APPROUVÉ**. Restent à signaler dans la PR : « Réécouter » après la fin du déroulé rejoue toute la boîte (à confirmer avec le PO) ; pas de scénario pour « Réécouter pendant le déroulé » ; au lot 4, faire porter les étapes du déroulé par `BoiteEnCours`.
- 19:05 · Étape 5, mise au point E2E (`telephone`) par `e2e-tester` (`9aed309`, steps `features/steps/boite-et-barres.steps.ts`, levée de `@wip` et de `@depend-de-21`) : **253/254** (#21 30/31 ; #16 35/35, #17 29/29, #18 27/27, #19 29/29, #20 43/43, #23 30/30, #24 30/30). KO : « Après une erreur, l'aide du problème est lue » demande la réponse « 15 », jamais proposée (CP, réponse 3 → choix 3, 4, 2, 5, règle Q51). Scénario ambigu → **ESCALADE** au responsable, reco « 5 ». Le défaut de « Réécouter » et le couvercle animé ne sont plus observés après `2dcb945`.
