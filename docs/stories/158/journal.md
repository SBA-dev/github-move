# Journal de la story #158 : écusson à la place des étoiles sur le dessin fixe d'Agent Max

Équipe lancée par `/graphe` (« graphe 158 », annonce [Responsable] 6656815687 sur #64).
Branche : `feature/158-ecusson-agent-max`, partie de `main` `e018bb6`. Branche de base : `main`.

## 2026-11-05

- 11:35 UTC : lancement. Issue #158 lue (reco A de #106.39, retenue par le PO : « 106e reco tout »).
- Étape 1 (domaine) **sautée** : aucun concept ni règle métier nouveau. Correctif de dessin dans `src/univers/personnages/AgentMax.tsx` ; la règle « pas d'étoile à cinq branches dans les dessins des personnages de récompense » existe déjà (106.34, 106.35).
- Écusson de référence : `ecusson()` de `src/univers/celebrations/police/dessin-de-max.ts` (PR #160, 106e), lui-même le blason de #130/#131. 106e est en cours de merge : on intègre `main` après pour reprendre le même tracé.
