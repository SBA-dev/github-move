# Journal de la story #27 : Test de départ

Équipe lancée par le responsable des équipes (vague 1, issue de coordination #64).
Branche : `feature/27-test-de-depart`, partie de `main` 50f0a55. Branche de base : `main`.

## 2026-10-24

- 20:10 UTC : démarrage. Lu l'issue #27 (6 questions ouvertes), le tableau de #64 et les décisions de #25 (aucun verrou : réussie / prochaine / à découvrir).
- 20:10 UTC : étape 1, délégation au `domain-modeler` (nouveaux concepts : test de départ, question du test de départ, règle d'arrêt, leçon réussie au test de départ, « test de départ fait »).
- 20:35 UTC : `domain-modeler` terminé (d8f82c3) : `docs/stories/27/domain-model.md`, ajouts au glossaire et à la context map, 16 questions (27.1 à 27.16). Étape 2 : délégation au `po-acceptance`.
- 21:05 UTC : `po-acceptance` terminé (a80dc6d) : `features/27-test-de-depart.feature` (9 règles, 53 scénarios, 60 cas, 29 `@a-valider`, 5 `@acces`) et `docs/stories/27/acceptance.md`, questions 27.17 à 27.23.
- 21:08 UTC : CADRAGE PRÊT publié sur #27 (23 questions). ⛔ En attente de la réponse du PO par une annonce [Responsable] sur #64.
- 20:40 UTC : annonce MAIN A BOUGÉ (#22 mergée, `f07fc23`) : `main` intégrée par merge (61a50cd), sans conflit. Toujours en attente de la validation n°1 du PO.
- 20:42 UTC : À SAVOIR (#64) : #65 (Mes trophées) ajoutera elle aussi un bouton sur l'accueil de l'enfant. Bouton « Mon test de départ » à ajouter par ajout seulement ; la seconde à merger garde les deux.
- 20:45 UTC : ⛔ validation n°1 : OK du PO (« 27# reco OK », annonce [Responsable] https://github.com/SBA-dev/github-move/issues/64#issuecomment-6389314266), recos 27.1 à 27.23 retenues.
- 20:50 UTC : décisions reportées : modèle et glossaire (03e9ff9, `domain-modeler`), scénarios et acceptance de #27, #11, #12, #13 (4a55e70, `po-acceptance`). 27.19 : aucun texte de scénario de #11/#12/#13 ne change ; deux steps d'#11/#12 devront rentrer dans l'espace parent s'il n'est plus affiché, et `attendreLeRetourDuFormulaire` accepter la proposition du test de départ (travail de l'`e2e-tester`).
- 20:55 UTC : base unitaire verte après intégration de `main` (1220 tests). Étape 3 : TDD, blocs A (choix des questions), B (agrégat `TestDeDepart`), C (résultat et parcours), D (serveur).
- 21:40 UTC : bloc A (choix des questions) : 4 comportements verts (A1 réserve, A2 plan à pas réguliers, A3 tirage parmi les questions admissibles, A4 forme de la question). Un aller-retour implementer → test-writer (A4 : leçon de test mal formée, corrigée en d2165f1). Revue delta 22033e0..95ae803 : **À CORRIGER** (cycle 1) — conjugaison : doublon possible dans les choix ; invariant 3 testé pour la dictée seulement. Non bloquants retenus : addition en liste (compter ses opérations), « admissibles » au lieu de « candidates », branches défensives, extraction de la question d'un trou.
- 21:40 UTC : bloc B : B1-B2 verts (8d1c799, agrégat `TestDeDepart`, arrêt après 3 questions fausses de suite).
- 21:05–21:20 UTC : limite d'utilisation de l'API atteinte (reprise à 21:10) : deux agents interrompus puis repris.
- 21:25 UTC : bloc A, corrections du cycle 1 faites (54d394a, 77ce485, cd118f6). Bloc B : B3-B4 verts (2e954ec). Revue delta 95ae803..cd118f6 : **À CORRIGER** (cycle 1 du bloc B ; corrections du bloc A approuvées) — l'envoi `aEnregistrer` ne garde pas le tirage des opérations générées (calcul, addition) : le serveur ne pourrait pas rejouer. Non bloquants retenus : plan et question d'accord sur un exercice sans opérations ni générateur ; `TestDeDepartArrete` à aligner avec le modèle ; `LeconIntrouvable` à traiter à la revalidation (27.12 : leçon retirée ignorée).
- 21:35 UTC : bloc B : correction du tirage des opérations générées (54b9805, 799b7c7), revue : **APPROUVÉ**. Bloc C : C1-C3 (leçons réussies au test de départ, nouvellement réussies, agrégat `ResultatDuTestDeDepart`) et C4-C6 (parcours, leçon suivante, classe au-dessus) verts ; deux tests contestés par l'implementer et corrigés par le test-writer (77feaee). `npx tsc --noEmit` rouge (`noUncheckedIndexedAccess`, `findLastIndex`) : test 935afc4, fix 87e0da3, refactor 83d3f6a. Revue delta du bloc C : **APPROUVÉ** (non bloquants : texte du lecteur d'écran « réussie au test de départ » à corriger au câblage, `faitLe` qui ne doit pas reculer, lisibilité de `terminer`).
- 21:35 UTC : #64 demande si #27 utilise le « profil préparé » (#58 retire `src/demonstration/`) : APPRIS posté sur #27 (oui, vrai profil comme #25).
- 21:45 UTC : bloc D : D1 `revaliderLeTestDeDepart` (4027b87, eeb5a36 : tirages groupés par question pour ignorer une leçon retirée, 27.12 ; a088fb3).
- 21:55 UTC : bloc D : tests manquants de la revalidation et cas d'usage `TerminerLeTestDeDepart` (acf9d25, 46caaa0 ; 867e0da, 3634483, bd70b2e, f712d4f ; test après coup de `LeconsDuCatalogueJson.toutes()` 56a15f8). 1330 tests verts. Revue delta du bloc D lancée.
- 21:39 UTC (annonce) : **VERROU base accordé** à #27 (migration additive `resultats_des_tests_de_depart`, nouvelle Edge Function `terminer-le-test-de-depart`).
