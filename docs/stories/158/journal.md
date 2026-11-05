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
- 12:00 UTC : review APPROUVÉE (cycle 1), 0 bloquant.
- 12:05 UTC : 106e mergée (`8f976fa`). Intégration de `main` sans conflit (`0fc7f18`) ; tracé de l'écusson identique à `ecusson()` de `dessin-de-max.ts`, vérifié. 2883 tests unitaires verts, tsc OK. VERROU base accordé (annonce [Responsable] 6657224218).
- 12:10 UTC : sonde OK (3 × `admin/users`, 0,4 à 0,9 s). Run en position A lancé puis arrêté au bout d'une minute : le PO venait de retenir B (« 158 reco tout », annonce [Responsable] 6657246175), qui demandait un rejeu.
- 12:15 UTC : `implementer` : écusson de la chemise à `translate(-6 -25)` (`b283352`), planche finale (`b066326`). Review delta APPROUVÉE.
- 12:20 UTC : sonde OK, puis E2E sur `telephone` avec 1 worker : 7/7 verts en 1,5 min (les 6 exemples du Plan « … a <son dessin> » et « Dans « Qui joue ? », chaque profil enfant garde le dessin de son personnage guide »). LIBÈRE base. Pas de non-régression complète (règle du PO du 04/11 : elle tourne la nuit).

## Dette

- Le tracé de l'écusson existe en deux copies identiques : le composant `Ecusson` de `src/univers/personnages/AgentMax.tsx` et `ecusson()` de `src/univers/celebrations/police/dessin-de-max.ts`. Mise en commun non faite ici : elle toucherait la scène de 106e (hors périmètre) pendant que 106f travaille dans `celebrations/`. À faire dans un refactor ultérieur.
- Le step vérifie l'absence du signe `etoile-doree`, pas l'absence de toute forme d'étoile : la planche et la review en font la preuve.
- À 80 px, l'écusson de la chemise n'est plus qu'un point clair, et la manche rogne son bord gauche (choix #158.1 B du PO).

## Mesures

| Mesure | Valeur |
|---|---|
| Durée (lancement → PR prête) | environ 55 min (11:30 → 12:25 UTC) |
| Attente du verrou base | environ 15 min (derrière le rejeu de 106e) |
| Attente du PO (#158.1 et planche) | environ 15 min, en parallèle de l'attente du verrou |
| Cycles TDD | 1 (step rouge, puis écusson), plus 1 réglage visuel (#158.1 B) |
| Cycles de review | 2 revues, toutes deux APPROUVÉ (complète, puis delta) ; 0 À CORRIGER |
| Cycles E2E | 1 run complet (7/7) ; 1 run arrêté au bout d'1 min (position A abandonnée) |
| Intégrations de `main` | 1 (106e), 0 conflit |
| Escalades | 0 ; 1 question au PO (#158.1) |
