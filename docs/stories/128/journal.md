# Journal de la story #128 : claviers (dictée, calcul, fluence), tranche 98d

- Branche de base : `main` (`8757070`). Branche : `feature/128-claviers`.
- Équipe lancée par `/graphe` (responsable : session_016aXZVAP1dRD9CgMXRrkfWN), coordination sur #64.
- Session de l'équipe : session_015z4jmPJeZcnAf9RQ9eDXm9.

## 2026-11-02

- 23:00 UTC : démarrage. Lu #128 (règles 1 à 5, 6e règle « dessin par univers »), annonces [Responsable] de #64.
- Étape 1 : `domain-modeler` lancé (lecture pure dans `RecordDeFluence`, habillage par univers des cases, touches et marque).
- Étape 1 faite : `docs/stories/128/domain-model.md`. Lecture pure `RecordDeFluence.estDepassePar(score)`, règles R1 à R6, 36 dessins (6 univers), 12 questions ouvertes. Glossaire : 2 ajouts en fin de section Apprentissage. Point de fusion signalé : `src/seance/EcranDeSeance.tsx` (prop du record vers `ExerciceDeFluence`).
- Étape 2 : `po-acceptance` lancé.
- Étape 2 faite : `features/128-claviers.feature` (52 scénarios, 11 `@a-valider`), `docs/stories/128/acceptance.md`. Questions #128.13 et #128.14 ajoutées.
- CADRAGE PRÊT publié sur #128, en attente de la validation du PO (annonce [Responsable] sur #64).

## 2026-11-03

- 00:36 UTC : RELIS #64. Cadrage présenté au PO (validation n°1, 23:06 UTC), pas encore de réponse. À SAVOIR de #127 noté : `EcranDeSeance.tsx`, `useDeroulementDeSeance.ts` et `styles.css` (bloc `@media (max-width: 480px)` avec `.addition-posee`) bougeront à l'intégration de `main` ; vérifier le clavier de cristaux dans l'addition à 360 px après le merge de #127.
- 06:40 UTC : validation n°1 levée (annonce [Responsable] sur #64 et #128) : « 128 reco tout ». Toutes les recos #128.1 à #128.14 retenues. Merge de #127 autorisé : intégrer `main` après son merge.
- Report des réponses (`po-acceptance`) et RED de `RecordDeFluence.estDepassePar` (`test-writer`) lancés en parallèle.
- 06:42 UTC : TDD, comportement 1/1 du domaine vert : `RecordDeFluence.estDepassePar` (RED `ce34c1b`, GREEN `fe69fed`, `proposer` la réutilise). 2787 tests verts.
- 06:45 UTC : intégration de `main` après le merge de #127 (`227ec44`), sans conflit (`55b2247`). Tests unitaires et `tsc` verts. Le clavier dans l'addition à 360 px sera vérifié après le câblage du clavier.
- 06:50 UTC : planches de dessins (`implementer` en illustrateur) et revue delta du bloc domaine (`mr-reviewer`, `ce34c1b..fe69fed`) lancées en parallèle.
- 06:55 UTC : revue delta du bloc domaine (`ce34c1b..fe69fed`) : APPROUVÉ, aucun bloquant. Non bloquants notés : identifiant `dépasse` accentué dans le test (à renommer en `depasse` au prochain passage de `test-writer`), garde redondante assumée dans `proposer`, refactor dans le commit `feat`. Dernier commit relu : `fe69fed`.
- 06:56 UTC : `e2e-tester` écrit les étapes de `@issue-128` (sans exécution) et le contrat des repères DOM pour le câblage.
- 07:00 UTC : planches rendues (`03d4c2a`, 36 SVG, 3 planches), relues par l'orchestrateur contre la règle absolue : rien à signaler. `PLANCHES PRÊTES` publié sur #128 (6597369156), 6 choix à confirmer (P1 à P6).
- 07:10 UTC : étapes E2E écrites (`ab8a3f9`) et contrat des repères DOM dans `acceptance.md`. `bddgen` vert pour `@issue-98`, `@issue-127` et `@issue-128`. Deux steps de #98 exclus pour #127 et #128 (`not @issue-127 and not @issue-128`), leur sens ne change pas pour #98.
- 07:12 UTC : câblage du front lancé (`implementer`).
- 07:11 UTC : planches validées par le PO (annonce [Responsable] 6597661184 sur #128, « planches 128 OK »), choix P1 à P6 compris. Condition 98.31 remplie.
- 07:17 UTC : changement de session du responsable annoncé par `session_015z4jmPB9NToEBmXDvNpaLi`. Cohérent avec la PASSATION [Responsable] de #64 (6597703898), mais le corps de #64 nomme encore l'ancienne session : RELIS envoyés aux deux sessions jusqu'à la mise à jour du corps.
- 08:00 UTC : câblage du front fait (`9c692ed` cases de la dictée, `51d7c3e` clavier de cristaux, `cbc87cf` marque du record, correctifs `b4054a8` et `f585007`). `tsc`, build, 2787 tests unitaires, lint et format verts. Addition de #127 à 360 px : 24 scénarios « 360 px » de `@issue-127` verts. E2E `@issue-128` sur `telephone` : environ 70/90, rouges attribués aux étapes.
- 08:05 UTC : intégration de `main` après le merge de #126 (`d609058`). Conflit sur les tags de 4 étapes partagées de `exercices-comme-des-jeux.steps.ts` : les deux ajouts gardés (`@issue-98 or @issue-126 or @issue-127 or @issue-128`). `bddgen` vert pour #98, #126, #127, #128 ; tests, `tsc` et build verts (`e3c2410`).
- 08:10 UTC : mise au point E2E (`e2e-tester`) et review complète (`mr-reviewer`) lancées en parallèle.
- 08:40 UTC : review complète, cycle 1 : APPROUVÉ, aucun bloquant. Non bloquants retenus pour un passage de l'`implementer` après la mise au point E2E (pas de changement du front pendant un run) :
  - (1) police `.8rem` de `.tableau-de-fluence` à ≤ 480 px même sans record : recul de lisibilité pour #20 → garder `1rem`, faire passer le temps sur sa propre ligne ;
  - (2) `.cristal[data-univers]` efface le fond jaune du halo de « Je ne sais pas » : écart avec la planche validée → rétablir le fond ;
  - (5) `CasesDeLaDictee.tsx` : commentaire inexact, `return setIlluminees(0)` ; (6) table des dessins précalculée au chargement ; (7) commentaire sur `dangerouslySetInnerHTML` (SVG statique du dépôt seulement).
  - (3) touche qui brille et touchée : accepté, phrase du contrat ajustée.
  - (4) record d'un autre exercice affiché un instant si « C'est parti ! » est touché avant la fin de la lecture du record (défaut déjà présent pour `terminer`) : noté en dette dans la PR, non couvert par un test.
- 11:00 UTC : mise au point E2E, cycle 1 (`2419745`) : diagnostics vérifiés un par un, tous dus aux étapes, aucun bug du front. Le mode dys venait de l'étape de réglage, pas du front. Run initial 67/90 ; après corrections, 63/64 sur les premiers scénarios du run complet, puis tout en timeout : projet Supabase de dev lent (504 sur `/auth/v1/admin/users`). Pas de total fiable : run complet à relancer quand le projet est sain. Scénario « L'illumination du mot juste ne retarde pas l'effet sonore » à rejouer seul (rouge une fois).
- `bddgen` vert pour #19, #20, #21, #65, #97, #98, #126, #127, #128 après les élargissements d'étapes partagées.
- APPRIS publié sur #128 (Supabase lent, contournement Chromium, étapes partagées élargies). RELIS envoyé à la nouvelle session du responsable.
- Corrections des non bloquants de la review (`implementer`) et précisions du contrat (`po-acceptance`) lancées.
