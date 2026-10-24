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
