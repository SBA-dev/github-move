# Journal de la story #137 : Grand défi de la matière

Équipe lancée par le responsable des équipes (`/graphe`, vague 1), à la demande du PO (« graphe 137 »).

- Branche : `feature/137-grand-defi`, partie de `main` (`573659e`)
- Branche de base : `main`
- Issue de coordination : #64
- Dépendances mergées : #100 (`f8a4787`), #99, #26, #101, #106 (106a), #141

## 2026-11-04

- 20:45 UTC : démarrage. Lecture de l'issue #137, de la réponse du PO sur #100 (2.a) et des scénarios gardés pour
  #137 dans `docs/stories/100/acceptance.md` (anciens 3.2, 3.3, 6.1 à 6.3, lignes retirées de 5.4, 7.2 et 8.4).
- Étape 1 (domaine) : nécessaire. Le grand défi est un nouveau concept (défi de la matière, ouverture à la matière
  réussie, remplacement du défi de la dernière partie, tirage sur toute la matière).
- 21:00 UTC : modèle du domaine (`8fbd38e`). Nouvelle table additive `grands_defis_termines` nécessaire
  (`defis_termines.numero` est `check (numero >= 1)`) ; `terminer-le-defi` à étendre. Décision 0041 réservée par le
  responsable (tableau de #64).
- 21:10 UTC : critères (`e9a52e4`, `e8bd3e7`) : 6 règles, 15 scénarios, 17 cas par projet. Scénarios de #100 que le
  grand défi rend faux retirés (1.4 2e cas, 1.5, une ligne de 6.2). Questions #137.1 à #137.7.
- CADRAGE PRÊT publié sur #137 ; attente de la validation n°1 (annonce [Responsable] sur #64).

## Étape 3 : TDD

- Bloc 1 (comportements 1 à 4, `grandDefiDeLaMatiere`) : RED `ccb9e77`..`ca819c3`, GREEN `5f5e2bc`. 4 = caractérisation (tests de #100).
- Blocs 2 et 3 (5 à 14, état et plan à 12 questions) : RED `7cd4ca6`..`b356544`, GREEN `1927c86`. 13 = caractérisation.
- Blocs 4 à 6 (15 à 24, ouverture par la séance, séance de défi, revalidation, formes de la matière) : RED
  `ca25a1b`..`7dda31e`, GREEN `d33a63f`, `443e122`. Le test de #100 « terminer la dernière partie n'ouvre aucun défi »
  est remplacé par le comportement 15. Les tests du comportement 16 passaient avant le GREEN : ajoutés ensuite comme
  non-régression.
  - Provisoire jusqu'au câblage : `useDefiOuvertParLaSeance` (front) ignore le grand défi, l'adaptateur Supabase et
    `enCorpsDuDefi` refusent explicitement un grand défi.
- Revue intermédiaire (delta `48c0ed8..443e122`, Apprentissage + Catalogue) : **APPROUVÉ**, sans bloquant. Point de
  départ du prochain delta : `443e122`. Non bloquants repris au refactor du bloc Motivation : marque explicite
  `grandDefi: true` sur `GrandDefi`, suppression de `numeroDuDefi`, `APRES_DE` → `AVEC_DE`.
- **Dette à solder au câblage** (sinon bloquant à la revue finale) :
  - `apprentissage/infrastructure/defis-termines-supabase.ts` : `throw` sur un grand défi → écriture dans
    `grands_defis_termines` (0041), avec tests ;
  - `src/defis/corps-du-defi.ts` : refus du grand défi → contrat du corps étendu, avec `corps-du-defi-termine.ts` ;
  - `src/defis/useDefiOuvertParLaSeance.ts` : grand défi filtré → annonce du grand défi (scénarios 2.1, 2.2) ;
  - `src/defis/FinDuDefi.tsx` : `setNumero(releve.numero ?? 0)` (valeur magique) → la sorte du défi ;
  - `src/defis/defis-releves-sur-l-appareil.ts` : clé `…/grand` sans test.
- Bloc Motivation (25 à 33) : RED `be2b3e1`..`78210bd`. 34 retiré : déjà couvert par les tests de
  `moment-de-celebration` (le moment ne dépend pas de la sorte du défi).
- Blocs application et infrastructure (35 à 43) : RED `3032416`..`831b8d8` (marque `grandDefi: true` sur `GrandDefi`
  demandée par la revue), 36 et 38 à 41 en caractérisation (`171925f`, `6c4b728`). GREEN Motivation `db9940e`,
  refactors `180c539`, `71c9163` ; GREEN infrastructure `5418d20`, refactor `b6688c5`. 2857 tests verts.
- Revue intermédiaire (delta `443e122..b6688c5`) : **APPROUVÉ**, sans bloquant. À faire avant la revue finale :
  revenir à l'union exclusive pour `DefiReleve` (affaiblie en `numero?`/`grandDefi?` pour deux fixtures de test) et lire
  la sorte par un seul marqueur ; `src/defis/lecture-des-defis-releves-supabase.ts` doit lire aussi
  `grands_defis_termines` (ajouté à la dette du câblage).
- Verrou `base` demandé (22:05) ; #130 le détient, #137 est la suivante.

## Câblage et revue

- Câblage (`10a6c53`..`d20d30c`) : migration `20261104090000_grands_defis_termines.sql` écrite, non appliquée (verrou
  `base` attendu) ; front (lecture des deux tables, repère, séance, fin de séance). Dette du câblage soldée, sauf la
  clé `…/grand` (pas de tests unitaires front dans le dépôt ; couverte par le scénario 4.5).
- Dernier cycle TDD : `e5d15e0` (red) → `e00a85d` (`phraseDeFinAvecLeGrandDefi`, React ne compose plus la parole) →
  `7ce25ae` (union exclusive `DefiReleve`, un seul marqueur). Fixtures retypées avant (`bca402f`).
- Revue de l'étape 4 (`origin/main...7ce25ae`) : **APPROUVÉ**, sans bloquant. Non bloquants 1, 2 et 5 (aiguillage
  « grand défi ou défi n » dans React, prédicat de type, `defisDuParcours`) repris par un cycle TDD pendant l'attente
  du verrou `base`. À rappeler dans la PR : appliquer la migration avant d'envoyer le front.
- Cycle de reprise des non bloquants (aiguillage dans le domaine) : RED `c7bd609`..`5edfe20`, GREEN `a6db162`,
  refactors `e2c0480`, `47cf431`. Revue delta : **APPROUVÉ**. Non bloquants laissés en dette : nom `nomDuDefiOuvert`
  (sert aussi aux défis relevés), index de Motivation qui exporte encore les fonctions détaillées.
- 23:25 UTC : intégration de `main` (`597a4a5`, #140) sans conflit : 2871 tests, lint, fmt, tsc, build, bddgen verts.

## Étape 5 : E2E

- 22:54 UTC : VERROU `base` accordé à #137 (annonce du responsable, tableau de #64). Sonde `admin/users` : 1,10 s,
  0,50 s, 0,51 s. Registre de `savanturier-dev` : 14 migrations, seule `20261104090000_grands_defis_termines` en attente.
  Appliquée par l'API de gestion (`scripts/exploitation/migrations.py` sur le projet de dev). `terminer-le-defi`
  redéployée sur le projet de dev.
- E2E mise au point, `telephone`, 1 worker : `@issue-137` + `@issue-100` 44/50 au premier run (6 KO, tous dus aux
  steps : bouton « Relever le défi » en double, `data-numero` comparé à un nombre, boucle d'un tour trop courte), puis
  **50/50** en 13,2 min (`5f8ea24`, retrait de `@wip`).
- Écrans touchés (« Mon parcours », fin de séance) : `@issue-26` + `@issue-99` 81/82. Le KO vient du step de #99
  « liste ordonnée de N leçons », qui comptait le repère du grand défi (voulu par R6 et 100.14) : il ne compte plus que
  les leçons (`d8f8d07`, sens inchangé). `@issue-99` 26/26.
- 00:05 UTC : `LIBÈRE base` (annonce du responsable : libérer après les E2E). PR #153 ouverte en brouillon.

## Mesures

| Mesure | Valeur |
|---|---|
| Durée, du lancement au merge | lancement 20:38 UTC le 04/11 ; PR prête vers 00:15 UTC le 05/11 (≈ 3 h 40) ; merge : en attente d'autorisation |
| Temps passé à attendre | PO : 16 min (CADRAGE PRÊT 20:52 → réponse 21:08) ; verrou `base` : ≈ 50 min (demandé 22:05, accordé 22:54 ; le câblage, la revue, les steps et une reprise des non bloquants ont avancé pendant ce temps) ; `main` : aucune attente |
| Tokens et coût | relevés par le responsable |
| Cycles de review À CORRIGER | 0 (2 revues intermédiaires, revue de l'étape 4, 1 delta : toutes APPROUVÉES) |
| Cycles E2E KO | 2 (6 KO de steps au 1er run de #137/#100 ; 1 KO de step dans #99), aucun bug applicatif |
| Intégrations de `main` | 1 (`597a4a5`, #140), sans conflit |
| Régression découverte sur `main` après le merge | — |
| Cycles TDD | 8 rouges/verts (blocs 1, 2-3, 4-6, Motivation, infrastructure, phrase de fin, union, aiguillage), 2871 tests verts |
| Escalades | 0 |
| Verrous pris | `base` (22:54 → 00:05) |
