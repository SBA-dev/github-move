# Journal de la story #161 : dessin fixe de Capitaine Sam

Équipe lancée par le responsable des équipes (« graphe 161 »), 2026-11-05. Branche `feature/161-dessin-capitaine-sam`, partie de `main` `8f976fa`. Branche de base : `main`.

## Étape 0 : préparation (2026-11-05)
- Issue #161 lue : reco A de #106.43. Référence validée par le PO (#106.42) sur `feature/106f-celebration-pompiers`, lue sans la modifier : `docs/maquettes/capitaine-sam-pompiers.html`, `docs/stories/106/captures/106f-capitaine-sam-{clair,sombre,tetes}.png`.
- Modèle suivi : #158 (Agent Max), commits `d51253a` (scénario), `2c8a753` (step), `25913cd` (dessin).
- Fichiers touchés prévus : `src/univers/personnages/CapitaineSam.tsx`, `src/univers/PersonnageGuide.tsx` (`DESSINS_REDESSINES`), `features/96-refonte-visuelle.feature` (Plan « … a <son dessin> », même Plan que #158 : conflit attendu), `features/steps/refonte-visuelle.steps.ts`, et la référence devenue inutile `features/support/dessin-de-capitaine-sam.json`.

## Étape 1 : modèle de domaine
- Sautée : aucun concept, aucune règle ni aucun contexte nouveau. C'est un dessin d'affichage (`src/`), sans domaine (comme #158).

## Étape 2 : critères (2026-11-05)
- `po-acceptance` : une règle, un scénario touché (exemple Pompiers du Plan « … a <son dessin> » de #96), aucun nouveau scénario. `docs/stories/161/acceptance.md`. Questions 161.1 à 161.4.
- Esquisse (`implementer`, scratchpad, méthode du skill `illustration`) : trois humeurs, portées depuis la maquette 106f sur le corps et la pose d'Agent Max. Planche avant/après dans `docs/stories/161/captures/`, sources SVG dans `docs/stories/161/planches/`.
- CADRAGE PRÊT posté sur #161, avec la planche pour le PO (98.28). En attente de l'annonce du responsable.

## Étape 3 : TDD (2026-11-05)
- Réponse du PO « Merge 158 ok 161 reco tout » (annonce [Responsable] sur #161) : 161.1 à 161.4 A, planche validée.
- RED : step `e303d85` (`e2e-tester`) : signes de Capitaine Sam, imbrications, ancien step « avant la refonte », `signatureDuDessin` et `features/support/dessin-de-capitaine-sam.json` retirés.
- GREEN : `e490ad0` (`implementer`) : `CapitaineSam.tsx` porté depuis la planche validée (rendu identique octet pour octet aux PNG validés) ; `DESSINS_REDESSINES` retiré (il aurait contenu toutes les clés).
- Intégration de `main` `e0d533f` (#158) : `ab3fc1b`. Conflits sur le Plan de #96 et `SIGNES_DU_DESSIN_VALIDE` : les deux lignes gardées. tsc, build, deno (2883) verts.
- Verrou base accordé (tableau de #64, 12:01 UTC). Sonde admin/users : 1,24 s, 0,63 s, 0,46 s.

## Étape 4 : review (cycle 1)
- APPROUVÉ, 3 non bloquants : (1) `data-dessin="valide"` posé partout ne distingue plus rien ; la décision 0033 (Conséquences) prévoit de retirer ce repère et `DESSINS_REDESSINES` quand Capitaine Sam est redessiné → retrait de l'attribut et de ses deux assertions (`refonte-visuelle.steps.ts`, `tenues.steps.ts`), sans changer le sens des steps (les signes restent vérifiés) ; (2) mise en forme de `CapitaineSam.tsx` (un élément par ligne, constante `CHAUSSURE`) ; (3) `acceptance.md` à aligner sur le step (absents `etoile` et `etoile-doree`). Repris après le run E2E en cours.
- Retouches : `c07e0fb` (test : assertions `data-dessin` retirées des steps), `a7d9ad8` (acceptance), `8641900` (refactor : `data-dessin` retiré de `PersonnageGuide.tsx`), `eca9132` (refactor : mise en forme, constante `CHAUSSURE` ; JSX identique une fois la constante réinjectée).
- Review delta (cycle 2) : APPROUVÉ. Non bloquant : la décision 0033 (point 5) et l'index `docs/decisions/README.md` décrivent encore `data-dessin` ; le retrait étant prévu par 0033 elle-même, pas de nouvelle décision ; une ligne de la feuille de route (responsable) peut le signaler.

## Étape 5 : E2E (projet `telephone`, 1 worker, verrou base)
- Run 1 (`ab3fc1b`) : 120 lancés, 118 verts. KO : #96:709 et #96:718 (`@visuel`, captures de référence), préexistants sur `main`, écrans de Noisette, sans Capitaine Sam.
- Run 2 (`eca9132`, après les retouches) : 9/9 verts (Plan « … a <son dessin> » 6/6, #96:209, #102:323, #102:291).
- Scénarios de Capitaine Sam verts : #96 (Plan modifié et Pompiers), #102 (360 px habillé), #11, #33, #6.

## Mesures
- Durée : environ 1 h 15 (11:45 → 13:00 UTC), dont 37 min pour le run 1.
- Attente : validation PO environ 3 min ; verrou base accordé sans attente.
- Cycles : TDD 1 ; review 2 (APPROUVÉ, puis delta APPROUVÉ) ; E2E 2 runs, 0 KO lié à la story.
- Intégrations de `main` : 1 (`e0d533f`, #158), 2 conflits attendus (Plan de #96, `SIGNES_DU_DESSIN_VALIDE`), résolus en gardant les deux lignes.
