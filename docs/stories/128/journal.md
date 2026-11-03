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
- 12:00 UTC : corrections des non bloquants (`a1c6384` fix CSS, `82d0cea` refactor) et précisions du contrat (`2252f68`). Revue delta `e3c2410..HEAD` : APPROUVÉ, aucun bloquant. Non bloquants : survol qui efface le fond jaune du cristal qui brille (à corriger après le run E2E en cours), `throw` au chargement de la table des dessins, phrase « Léa écrit la fin du mot » à reformuler avec le PO, `page.evaluate` du tirage (risque faible d'instabilité).
- 12:00 UTC : Supabase de dev de nouveau sain ; run complet `@issue-128` sur `telephone` lancé (`e2e-tester`).
- 12:40 UTC : run complet `@issue-128` tué après 18 min, 0/90 : 504 intermittents de `GET /auth/v1/admin/users` dès le Given (environnement, pas la story). ESCALADE publiée sur #128 (6603109032), question #128.15 (reco : attendre, relancer avec `E2E_WORKERS=1`). Correction CSS du survol du cristal qui brille lancée (`implementer`).
- 12:19 UTC : réponse du PO à #128.15 (annonce [Responsable] 6603612076) : « 128.15 A ». Attendre 3 appels `admin/users` < 3 s de suite, puis relancer `@issue-128` avec `E2E_WORKERS=1`. `features/support/supabase-test.ts` ne change pas. Correction du survol du cristal poussée (`4289879`).
- 12:21 UTC : sonde (000 en 30 s, 200 en 19 s, 200 en 1 s) : encore lent, surveillance toutes les 2 min.
- 12:51 à 13:11 UTC : run `@issue-128` à un worker (#128.15 A), lancé sur sonde saine. 504 de Supabase dès 12:53 ; 9 joués (4 verts, 5 rouges, tous sur les appels admin de Supabase avant le front), 81 non joués ; run arrêté, sonde en timeout à 13:10-13:11. Nouvelle ESCALADE avec horaires (6604778352), question #128.16 (reco : attendre 15 min de stabilité mesurée).
- 17:52 UTC : Supabase de dev sain depuis 17:35 (annonce [Responsable] sur #64). VERROU base accordé à #128 (tableau de #64 à jour ; file : #129 puis #131) pour le run complet à un worker. `main` déjà intégré (`d609058`). Sonde SAIN (1,1 s, 0,9 s, 0,6 s). Run complet `@issue-128` et 12 captures lancés (`e2e-tester`).
- 18:21 UTC : run complet `@issue-128` (`telephone`, 1 worker) : **90/90 verts** en 27,9 min, aucun 504. Rejeu ×3 du scénario « L'illumination du mot juste ne retarde pas l'effet sonore » : 3/3. `@wip` retiré (`cb7036f`). 12 captures (`cfcaafc`), relues par l'orchestrateur (2 ouvertes) : conformes. LIBÈRE base publié (6612118311).
- Le projet `tablette` n'a pas été joué pour `@issue-128` (décision du PO du 28/10 : avant la PR, seulement les scénarios de la story ; les runs passent un par un sous verrou `base`). Signalé au responsable dans PRÊTE À MERGER.

## Bilan

- Cycles TDD : 1 comportement du domaine (`RecordDeFluence.estDepassePar`, 9 exemples), RED `ce34c1b` → GREEN `fe69fed`. Le reste est du câblage, exigé par les 90 scénarios E2E (RED par les étapes `ab8a3f9`).
- Revues : delta du domaine APPROUVÉ ; review complète APPROUVÉE (cycle 1, 0 bloquant) ; delta après corrections APPROUVÉ. Non bloquants traités : police de la fluence à 360 px, fond jaune du cristal qui brille (y compris au survol), refactors de `CasesDeLaDictee`, table des dessins, commentaire `dangerouslySetInnerHTML`.
- Escalades : #128.15 et #128.16 (Supabase de dev en 504, environnement).
- Verrous : `base` de 17:51 à 18:22 UTC (file de runs E2E, aucune migration).
- Intégrations de `main` : 2 (#127 sans conflit ; #126 avec conflit de tags dans `exercices-comme-des-jeux.steps.ts`, les deux ajouts gardés).

## Dette notée

- Record d'un autre exercice affiché un instant si « C'est parti ! » est touché avant la fin de la lecture du record (`useFluence.ts`, `setRecord(undefined)` au début de `presenter`) ; défaut déjà présent pour `terminer`.
- `dessins-des-claviers.ts` : un SVG mal formé fait tomber le module des claviers au chargement (pas détecté au build).
- Phrase du scénario « Léa écrit la fin du mot » (`128-claviers.feature`) : l'étape tape aussi la lettre montrée ; à reformuler avec le PO.
- `installerLeTirage` (`page.evaluate`) : risque faible d'instabilité pendant une navigation.
- Contournement Chromium (dossier `pw/` du scratchpad) à documenter (APPRIS repris par le responsable).
- Non-régression des voisins (#19, #20, #21, #65, #97, #98, #126, #127) non jouée avant la PR (décision du PO du 28/10) : elle passe par la tâche de nuit.

## Mesures

| Mesure | Valeur |
|---|---|
| Durée (lancement → PRÊTE À MERGER) | 2026-11-02 22:51 → 2026-11-03 18:30 UTC, soit environ 19 h 40, dont environ 8 h 30 d'attente de l'environnement (Supabase de dev) et 6 h 20 d'attente du PO dans la nuit |
| Temps d'attente du PO | validation n°1 : 7 h 33 (23:06 → 06:39, nuit) ; planches : 20 min (06:51 → 07:11) ; #128.15 : 40 min ; #128.16 : environ 4 h 30 (jusqu'au retour de Supabase, 17:51) |
| Cycles de review | 3 : delta domaine, complète (cycle 1), delta après corrections ; tous APPROUVÉS |
| Cycles TDD | 1 comportement du domaine ; câblage en 3 blocs + 2 fix, puis 2 fix et 1 refactor de review |
| Cycles E2E | 5 runs : câblage (~70/90), mise au point (67/90 puis 63/64 avant la dégradation), run à 3 workers tué (0/90, 504), run à 1 worker tué (4 verts / 5 rouges, 504), run final 90/90 |
| Intégrations de `main` | 2 : #127 (sans conflit) ; #126 (1 conflit de tags, les deux gardés) |
| Escalades | 2 (#128.15, #128.16 : environnement) |
| Verrous | `base` 31 min (file des runs E2E) |
| Dessins | 36 SVG, 3 planches, validées au premier passage (« planches 128 OK ») ; 12 captures |
| Incidents | Supabase de dev en 504 de 09:00 à 17:30 UTC ; contournement Chromium à refaire (liens symboliques insuffisants) ; passation du responsable en cours de story |
| Tokens | relevés par le responsable |

## Fin

- 18:35 UTC : PR #145 ouverte en brouillon, review finale publiée (APPROUVÉ, 6612243566). `main` inchangé (`d609058`). PR passée en « prête », `PRÊTE À MERGER` publié. Plus aucun push sauf intégration de `main` sous verrou `merge`.
