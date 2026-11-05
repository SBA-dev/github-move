# Journal de la story #158 : écusson à la place des étoiles sur le dessin fixe d'Agent Max

Équipe lancée par `/graphe` (« graphe 158 », annonce [Responsable] 6656815687 sur #64).
Branche : `feature/158-ecusson-agent-max`, partie de `main` `e018bb6`. Branche de base : `main`.

## 2026-11-05

- 11:35 UTC : lancement. Issue #158 lue (reco A de #106.39, retenue par le PO : « 106e reco tout »).
- Étape 1 (domaine) **sautée** : aucun concept ni règle métier nouveau. Correctif de dessin dans `src/univers/personnages/AgentMax.tsx` ; la règle « pas d'étoile à cinq branches dans les dessins des personnages de récompense » existe déjà (106.34, 106.35).
- Écusson de référence : `ecusson()` de `src/univers/celebrations/police/dessin-de-max.ts` (PR #160, 106e), lui-même le blason de #130/#131. 106e est en cours de merge : on intègre `main` après pour reprendre le même tracé.
- 11:40 UTC : `po-acceptance` met à jour l'exemple Police du Plan de #96 (`d51253a`) et écrit `acceptance.md`. `e2e-tester` met à jour le step `SIGNES_DU_DESSIN_VALIDE` (`2c8a753`) : `ecusson` dans la casquette et dans la chemise, `etoile-doree` absent. Aucun run (verrou base pas encore accordé). CADRAGE PRÊT publié pour information.
- 11:50 UTC : `implementer` (GREEN) : composant local `Ecusson` dans `AgentMax.tsx`, tracé identique à `ecusson()` de 106e, échelles .2 (casquette) et .13 (chemise, `translate(-8 -25)` comme 106e) (`25913cd`) ; tsc, build, 2881 tests unitaires verts. Planche (`71916e5`).
- 11:55 UTC : relecture de la planche : l'écusson de la chemise est caché presque entièrement par le bras gauche. Variante B (`translate(-6 -25)`) rendue (`9d8226e`). Question #158.1 posée au PO (reco B). VERROU base demandé : en file derrière 106e. Review lancée.
