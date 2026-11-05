# Journal de la story #168 : dessin fixe de Lili

Équipe lancée par le responsable des équipes (« graphe 168 »), 2026-11-05 22:34 UTC. Branche `feature/168-dessin-lili`, partie de `main` `2a69a87`. Branche de base : `main`.

## Étape 0 : préparation (2026-11-05 22:40 UTC)
- Issue #168 lue : reco de #106.52. Référence validée par le PO (#106.51) sur `feature/106h-danses-de-victoire`, lue sans la modifier : commit `1f16045` (`src/univers/celebrations/danse/dessin-de-lili.ts`, `personnage.ts`, `poses.ts`), planches `docs/stories/106/captures/106h-lili-de-face-avant-apres-{clair,sombre}.png` et `106h-lili-fixe-tsx-meme-defaut-non-corrige.png`.
- Modèle suivi : #161 (Capitaine Sam), même Plan de #96.
- 106h touche aussi `src/univers/personnages/Lili.tsx` (l'ancrage des tenues passe dans `src/univers/celebrations/commun/tenues.ts`) : conflit attendu à l'intégration de `main` après son merge ; on garde l'ancrage partagé de 106h et notre dessin.
- Fichiers touchés prévus : `src/univers/personnages/Lili.tsx`, `features/96-refonte-visuelle.feature` (exemple Danse du Plan « … a <son dessin> »), `features/steps/refonte-visuelle.steps.ts` (`SIGNES_DU_DESSIN_VALIDE`), planches dans `docs/stories/168/`.

## Étape 1 : modèle de domaine
- Sautée : aucun concept, aucune règle ni aucun contexte nouveau. C'est un dessin d'affichage (`src/`), sans domaine (comme #158 et #161).

## Étape 2 : critères (2026-11-05 22:55 UTC)
- `po-acceptance` : une règle, un scénario touché (exemple Danse du Plan « … a <son dessin> » de #96), aucun nouveau scénario. `docs/stories/168/acceptance.md`, commits `ebd014c` (exemple) et `58884a0` (acceptance). Questions 168.1 à 168.5.
- Esquisse (`implementer`, scratchpad, méthode du skill `illustration`) : tracés de face de 106h (`1f16045`) portés sur la pose fixe, humeurs et ancrage des tenues inchangés. Planches dans `docs/stories/168/captures/`, SVG dans `docs/stories/168/planches/` (`e1696bb`). Relues par l'orchestrateur : frange lisse, plus de cornes, oreilles, nez, cil et cou conformes ; rien ne dépasse du crâne ; règle absolue respectée, aucune étoile.
- Écart noté : l'esquisse nomme le signe du tutu `tutu-en-cloche`, l'acceptance attend `festons` dans `tutu-rose` : on suivra l'acceptance au GREEN.
- Question ajoutée par l'orchestrateur : 168.6 (largeur du tutu, qui passe derrière les mains bras le long du corps).
- CADRAGE PRÊT posté sur #168. En attente de l'annonce du responsable.
