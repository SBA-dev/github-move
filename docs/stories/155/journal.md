# #155 : journal

Correctifs des 3 KO nouveaux de la non-régression de nuit du 05/11 (`tablette`, `597a4a5`). Diagnostic : `cadrage.md`.

## Déroulé
- 07:25 UTC : lancement, branche partie de `main` `4742309`.
- Verrou `base` n° 1 (07:24 → 07:35) : reproduction sur `tablette` et `telephone` avec 1 worker. Parchemin poésie KO sur `tablette`, boîte KO sur les deux projets, dictée verte (6/6 au total).
- 07:40 : `CADRAGE PRÊT` avec la question #155.1 (retrait du gras du vers lu dans le parchemin).
- 09:52 : réponse du PO « 155.1 oui », cadrage validé.
- Intégrations de `main` : `dbbe378` (106c), puis `c744821` (106d), sans conflit.
- Corrections :
  - `fix(#155)` parchemin sans gras ;
  - `fix(#155)` largeur de la boîte ;
  - `test(#155)` step de félicitation atomique ;
  - `refactor(#155)` place de la règle CSS, suite à la review ;
  - `fix(#155)` marge des mots du vers lu.
- Review : APPROUVÉ au cycle 1, avec 1 point non bloquant appliqué. Delta `9f2e026` relu.
- Verrou `base` n° 2 (09:56 → 10:48), scénarios touchés avec 1 worker :
  - `telephone` 125/125 ;
  - `tablette` 124/125, avec `129:383` poésie encore KO, cause restante trouvée (marge des mots), corrigée par `9f2e026` ;
  - rejeu : `129:383` 6/6, puis la poésie de `@issue-129` à 34/34 sur `tablette` et à 34/34 sur `telephone`.

## Appris
- Le premier diagnostic du parchemin (le gras) était juste, mais incomplet : la mesure ligne par ligne (`h` des `.un-vers`) a montré
  que le vers lu restait plus large. Toujours rejouer sur le projet où le KO a été vu.
- `#131` et `#129` n'avaient tourné que sur `telephone` : les deux défauts ne se voyaient qu'à une autre largeur ou pendant un état
  transitoire (déroulé de la boîte).
- La course « lire le journal, puis terminer la lecture » existe encore dans d'autres steps (`boite-et-barres.steps.ts`,
  `cabane.steps.ts`, peut-être `102:155`) : à rendre atomiques si un KO instable y revient.

## Mesures
- Durée : 07:25 → environ 11:00 UTC, soit environ 3 h 35, dont environ 1 h 30 d'attente de la réponse du PO.
- Attente d'un verrou : environ 1 min, puis 0 min.
- Cycles de review : 1, plus 1 relecture de delta. Cycles d'E2E : 1 reproduction, plus 1 run avec 1 KO corrigé et rejoué.
- Intégrations de `main` : 2, sans conflit.
