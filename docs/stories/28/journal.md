# Journal de la story #28 : Révisions des erreurs

Équipe lancée par le responsable des équipes (vague 1, issue de coordination #64), par enchaînement automatique décidé par le PO.
Branche : `feature/28-revisions-des-erreurs`, partie de `main` 89b5729. Branche de base : `main`.

## 2026-10-25

- 08:35 UTC : démarrage. Lu l'issue #28 (7 questions ouvertes) et l'issue de coordination #64 (dernière annonce : #27 mergée, verrou `merge` à #58). Étape 1, délégation au `domain-modeler` (nouveaux concepts : file de révision, boîte, date de révision, séance de révision, erreur corrigée pour de bon).
- 08:40 UTC : `domain-modeler` terminé (c810fdb) : `docs/stories/28/domain-model.md`, 13 termes ajoutés au glossaire, 3 relations à la context map, questions 28.1 à 28.21. Étape 2 : délégation au `po-acceptance`.
- 08:50 UTC : `po-acceptance` terminé (e00c476) : `features/28-revisions-des-erreurs.feature` (9 règles, 39 scénarios, 49 cas, 16 `@a-valider`, 5 `@acces`, 2 `@depend-de-14`) et `docs/stories/28/acceptance.md`, questions 28.22 à 28.28. CADRAGE PRÊT publié sur #28 (28 questions). ⛔ En attente de la réponse du PO par une annonce [Responsable] sur #64.
- 09:02 UTC : annonce MAIN A BOUGÉ (#58 mergée, `48c6496`) : `main` intégrée par merge (5fbbfdf), sans conflit. `@issue-58` à ajouter à la non-régression. Toujours en attente de la validation n°1 du PO.
