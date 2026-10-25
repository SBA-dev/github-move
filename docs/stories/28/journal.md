# Journal de la story #28 : Révisions des erreurs

Équipe lancée par le responsable des équipes (vague 1, issue de coordination #64), par enchaînement automatique décidé par le PO.
Branche : `feature/28-revisions-des-erreurs`, partie de `main` 89b5729. Branche de base : `main`.

## 2026-10-25

- 08:35 UTC : démarrage. Lu l'issue #28 (7 questions ouvertes) et l'issue de coordination #64 (dernière annonce : #27 mergée, verrou `merge` à #58). Étape 1, délégation au `domain-modeler` (nouveaux concepts : file de révision, boîte, date de révision, séance de révision, erreur corrigée pour de bon).
- 08:40 UTC : `domain-modeler` terminé (c810fdb) : `docs/stories/28/domain-model.md`, 13 termes ajoutés au glossaire, 3 relations à la context map, questions 28.1 à 28.21. Étape 2 : délégation au `po-acceptance`.
- 08:50 UTC : `po-acceptance` terminé (e00c476) : `features/28-revisions-des-erreurs.feature` (9 règles, 39 scénarios, 49 cas, 16 `@a-valider`, 5 `@acces`, 2 `@depend-de-14`) et `docs/stories/28/acceptance.md`, questions 28.22 à 28.28. CADRAGE PRÊT publié sur #28 (28 questions). ⛔ En attente de la réponse du PO par une annonce [Responsable] sur #64.
- 09:02 UTC : annonce MAIN A BOUGÉ (#58 mergée, `48c6496`) : `main` intégrée par merge (5fbbfdf), sans conflit. `@issue-58` à ajouter à la non-régression. Toujours en attente de la validation n°1 du PO.
- 10:06 UTC : ⛔ validation n°1 : **OK du PO** (« #28 reco OK », annonce [Responsable] https://github.com/SBA-dev/github-move/issues/64#issuecomment-6396299951), recos 28.1 à 28.28 retenues. Décisions reportées : modèle et glossaire (01c866a, `domain-modeler` ; ligne « Révision » du glossaire à réécrire plus tard, n° de décision 36 du glossaire à vérifier au merge avec #26), acceptance et scénarios sans `@a-valider` ni `@wip` (b0aab23, `po-acceptance`).
- 10:08 UTC : À SAVOIR (#64) : timeouts E2E en hausse sous 3 workers ; relancer les KO avec `--workers=1`, annoncer la non-régression complète par un `APPRIS`.
- 10:15 UTC : étape 3, TDD. Blocs : A (value objects `Jour`, `jourDe`, `IntervalleDeRevision`), B (agrégat `FileDeRevision`), C (origine et question de révision), D (agrégat `SeanceDeRevision`, paroles), E (serveur : revalidation, cas d'usage).
- 10:45 UTC : bloc A (value objects) : 3 comportements verts (A1 `Jour` 29b67d9/da0c86d, A2 `jourDe` fb1d93a/9325835, A3 `IntervalleDeRevision` 5ab8fff/ef08093). Revue delta 91e6f6f..ef08093 : **APPROUVÉ**. Non bloquants retenus : `Jour.plus` à refuser hors entier ; `jourDe` avec décalage `NaN` ou hors plage (à traiter avec la cohérence du jour côté serveur) ; `jours` typé `1 | 3 | 7` ; exports `index.ts` au câblage. Dernier commit relu : ef08093. Bloc B commencé (B1 `retenir` vert, 257396b/581f1e4).
- 10:20 UTC : MAIN A BOUGÉ (PR #82, décision 0022, `e466e25`) : intégrée après B4 (a69d69f, documentation seulement). Sous le verrou `merge`, plus de non-régression complète si `main` a bougé : seulement le périmètre de la story et des stories mergées depuis, sur `telephone`.
- 10:23 UTC : À SAVOIR : non-régression de #72 de 10:22 à ~11:20 UTC, ne pas lancer la nôtre avant.
- 10:25 UTC : **MERGE AUTORISÉ POUR LA VAGUE** (PO, « Oui », annonce https://github.com/SBA-dev/github-move/issues/64#issuecomment-6396476177) : après `PRÊTE À MERGER`, demander `VERROU merge` ; #28 est en tête de file (chemin critique).
- 10:25 UTC : bloc B : B1 retenir (257396b/581f1e4), B2 déjà retenue (ceb2815/d24563d), B3 limite 250 (3837ce0/2272726, test formaté a64e710), B4 dues et plan (31d484b/41f5218) verts ; B5 `enregistrerLaRevision` en RED (44f7985).
