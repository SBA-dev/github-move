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
