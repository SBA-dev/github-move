# Journal de #163 : réponse fausse animée par le personnage guide

Branche de base : `main` (`2a69a87`). Branche : `feature/163-reponse-fausse-animee`.
Équipe lancée par le responsable des équipes (« graphe 163 »), session `session_015z4jmP18Ni5hQfiWStgeoX`.

## 2026-11-05

- 22:45 UTC : démarrage. Lecture de #163, du tableau de #64 et des annonces `[Responsable]`. Commentaire Avancement créé sur #163.
- 22:50 UTC : étape 1, délégation au `domain-modeler` (nouvelle réaction de Motivation, nouvelles règles : quand jouer la scène, durée, lien avec #97).
- 23:00 UTC : `domain-modeler` rendu (`fa1de18`) : Motivation, aucun agrégat, value objects `FaitsDeLaReponseFausse` et `SceneDeReponseFausse`, fonction pure `sceneDeReponseFausse`, 12 invariants, questions 163.1 à 163.12. Écarts relevés : les étincelles de Noisette ont quatre branches (mais dorées et cernées : retirées aussi) ; durées des maquettes de 2,9 à 4,7 s.
- 23:10 UTC : `po-acceptance` rendu (`4e38f6c`) : 8 règles, 37 scénarios (45 cas), questions 163.13 à 163.18. Muet selon 97.2 (coupe la parole, pas l'effet « réponse fausse »). Scénario de la tenue portée tagué `@depend-de-106`.
- 23:15 UTC : CADRAGE PRÊT publié sur #163. Attente des réponses du PO avant maquettes, planches et TDD.
- 23:20 UTC : réponse du PO « 163 reco tout » vérifiée sur #64 (annonce `[Responsable]` 6672057084). Décision 0042 réservée.
- 23:30 UTC : réponses du PO intégrées : modèle et décision 0042 (`domain-modeler`), scénarios avec la dictée (`po-acceptance`, 41 scénarios, 51 cas). Dictée : la scène se joue au mot corrigé (lettre en rouge), car la dictée ne juge qu'au mot complet (#19, #128).
- 23:45 UTC : maquette `docs/maquettes/reponse-fausse-coach-leo.html` et planche 163a (`docs/stories/163/captures/163a-coach-leo-*.png`) : 1,5 s mesurée, de face, ballon sur un petit poteau, image fixe sans bulle. Relue par l'orchestrateur au regard de la règle absolue : conforme.
- Push refusé par GitHub (« fatal error in commit_refs_rules ») de 23:25 à au moins 23:45, pour tout commit, même trivial.
- 23:55 UTC : planche 163a présentée au PO (163.19 à 163.21). Push rétabli (`ceed540`).
- 00:00 à 00:20 UTC : TDD du domaine de 163a, 3 cycles (`d897efa`→`87a5b5b`, `34fab84`→`ea7d8eb`, `b2dfcfd`→`c2fe32d`), comportements 1 à 16 verts (2925 tests). Tests 9 à 11 verts dès leur écriture (caractérisation du catalogue).
- Revue intermédiaire delta (`ceed540..c2fe32d`) : APPROUVÉ. Non bloquants corrigés : test du comportement 3 tautologique (`9c3de94`), renvois « à valider » de nos ajouts au glossaire et à la context map. Dernier commit relu : `c2fe32d`.
- 23:50 UTC : planche 163a validée (« 163a reco tout » : 163.19 à 163.21 A, annonce `[Responsable]` 6672618059). Critères mis à jour (43 scénarios, 53 cas).
- 23:55 UTC : 106h mergée (`11b32d4`), `main` intégrée (`e2192a8`), sans conflit ; 2935 tests unitaires et `tsc` verts. VERROU base demandé.
- 00:00 à 00:40 UTC : câblage de 163a (`9aab545` refactor du moteur commun et de Coach Léo, additif ; `a6b9a53` feat ; `794dae5` fix : l'image fixe dure aussi 1,5 s puis `reflechit`, conformément à 163.13). Review du câblage : APPROUVÉ (aucun bloquant) ; non bloquants corrigés (`d2ddb45`). Steps E2E écrits sans exécution (`b2a16e9`), en attente du verrou base (non-régression de nuit jusqu'à 01:45 UTC environ ; #163 première dans la file).
- 02:05 UTC : `main` `f4e1fb1` (#168) intégrée (`7b007c0`), sans conflit.
- 02:17 UTC : VERROU base accordé. Sonde : 3 × `admin/users` en 200, sous 1,3 s.
- 02:20 à 03:35 UTC : E2E sur `telephone`, 1 worker.
  - Run 1 (`@issue-163`, 163a) : 35/47, puis corrections de steps (`4d90d57` : vrais profils de Paul et Tom, test de départ, réseau coupé après le chargement, effet sonore unique sans fin de séance, scène attendue avant la bonne réponse, sondage serré des lettres fausses de la dictée, seuils de durée) ; 46/47.
  - KO restant : scénario « Je ne sais pas » irréalisable tel qu'écrit (#23 écarte les mauvais choix). Réécrit par `po-acceptance` avec le même sens (`b5a3422`), step ajouté (`b66ff0d`) : **47/47**.
  - Run 2 (non-régression touchée : `@issue-97`, `@issue-23`, `@livraison-106b`) : **100/100**.
  - Run 3 (`@issue-19`, `@issue-128`) : le step partagé de la dictée a changé (sondage serré, même sens).
  - Aucun bug applicatif.
- 03:40 à 04:15 UTC : `@depend-de-106` levé sur la tenue portée (`fcfd176`), step ajouté (`646012e`) : **48/48** sur `telephone`. Run 3 : `@issue-19` et `@issue-128` **119/119**. LIBÈRE base.
- 04:20 UTC : PR en brouillon (livraison 163a seulement ; #163 reste ouverte pour 163b à 163f).

## Mesures (livraison 163a)

| Mesure | Valeur |
|---|---|
| Durée, du lancement au PR | environ 5 h 30 (22:45 → 04:20 UTC) |
| Temps passé à attendre | PO : environ 30 min (cadrage, puis planche) ; merge de 106h : environ 30 min (TDD du domaine fait pendant ce temps) ; verrou base : environ 1 h 30 (non-régression de nuit) ; GitHub indisponible pour les push : 20 min |
| Cycles de review À CORRIGER | 0 (domaine APPROUVÉ, câblage APPROUVÉ ; non bloquants corrigés) |
| Cycles E2E KO | 2 sur le périmètre de la story (corrections de steps, puis un scénario réécrit) ; 0 bug applicatif |
| Intégrations de `main` | 2 (`11b32d4` 106h, `f4e1fb1` #168), sans conflit |
| Tokens et coût | relevés par le responsable |

## 2026-11-06 : livraison 163b (Lili)

- 07:05 UTC : 163a mergée (PR #171, `4dd80cf`). Annonce `[Responsable]` 6679278425 : la même équipe continue ; la branche est recréée depuis `main` `4dd80cf`, avec une nouvelle PR par livraison, et chaque planche passe au PO avant le câblage.
- 07:10 UTC : maquette et planche de Lili en préparation (163.5b : petit vacillement, pas de côté les deux pieds sous elle, révérence, pouce levé).
- 07:45 UTC : maquette `docs/maquettes/reponse-fausse-lili.html` et planche 163b (`docs/stories/163/captures/163b-lili-*.png`) : 1,5 s mesurée, Lili d'aplomb (inclinaison de 4° au plus), pas de côté les deux pieds sous elle, révérence, pouce levé, bulle « oups ! ». Une capture refaite (fond sombre incomplet, cause : fenêtre de capture trop basse). Relue par l'orchestrateur au regard de la règle absolue : conforme.
- 08:20 UTC : planche de Lili validée (« 163.b reco tout » : 163.22 oui, 163.23 « oups ! », annonce `[Responsable]` 6680441404).
- 08:20 à 08:40 UTC : TDD de 163b (`0407d40` test, `dd324db` feat : `danse` au catalogue) ; câblage (`903c638` refactor du dessin et du moteur de Lili par le préfixe, additif ; `04feb70` feat) ; steps E2E (`ed070c1`).
- Review de 163b : APPROUVÉ, aucun bloquant ; non bloquants corrigés (`3a786ee` : code mort, typage, constante nommée). Noté : en se relevant de la révérence, Lili monte d'environ 1,3 unité (courbe `E.rebond`), comme dans la maquette validée ; ce n'est pas une chute.
- 08:24 à 09:00 UTC : VERROU base. Sonde OK. E2E `telephone`, 1 worker : `@livraison-163a`, `@livraison-163b` et `@livraison-106b` **56/56** au premier passage ; après le refactor, `@livraison-163b` et `@livraison-106b` **8/8**. LIBÈRE base.

## Mesures (livraison 163b)

| Mesure | Valeur |
|---|---|
| Durée, du merge de 163a au PR prête | environ 2 h (07:05 → 09:05 UTC) |
| Temps passé à attendre | PO (planche) : environ 30 min ; verrou base : aucune attente |
| Cycles de review À CORRIGER | 0 |
| Cycles E2E KO | 0 |
| Intégrations de `main` | 0 (branche repartie de `main` `4dd80cf`) |
| Tokens et coût | relevés par le responsable |

## 2026-11-06 : livraison 163c (Noisette)

- 17:35 à 18:10 UTC : merge de 163b autorisé (« Merge 166 merge 163b OK »). Sous les verrous merge et base : `main` `e2ab03e` (#166) intégrée sans conflit, unitaires 2943, lint, format, `tsc` et build verts, rejeu E2E `@livraison-163a`, `@livraison-163b` et `@issue-166` **56/56** ; PR #172 mergée (`d8d67ca`), branche supprimée par GitHub. LIBÈRE base et merge.
- 18:15 UTC : branche recréée depuis `main` `d8d67ca`. Maquette `docs/maquettes/reponse-fausse-noisette.html` et planche 163c (`docs/stories/163/captures/163c-noisette-*.png`), préparées dans un worktree à part pendant l'attente du verrou merge : 1,5 s mesurée ; la noisette rebondit loin d'elle et roule à ses pieds, elle la ramasse en riant, les yeux grands ouverts, rien ne tourne autour d'elle ; bulle « hop ! ». Relue par l'orchestrateur au regard de la règle absolue : conforme.
- 18:50 UTC : maquette `docs/maquettes/reponse-fausse-lumi.html` et planche 163d (`docs/stories/163/captures/163d-lumi-*.png`), préparées dans un worktree à part : 1,5 s mesurée ; rond doux du poignet, « pschitt ! », bulles rondes pastel jamais dorées, fleur au bout de la baguette, Lumi de face, sans chute. Relue par l'orchestrateur au regard de la règle absolue : conforme. Publiée sur la branche de la PR #175 (documents seulement) pour que le PO puisse la valider.
- 19:20 UTC : maquette `docs/maquettes/reponse-fausse-agent-max.html` et planche 163e (`docs/stories/163/captures/163e-agent-max-*.png`), préparées dans un worktree à part pendant les E2E de 163c : 1,5 s mesurée ; la casquette glisse quand Max se penche, le chiot la rapporte en restant au sol, Max la remet en riant, pouce levé ; écusson de #158 ; bulle « oups ! ». Relue par l'orchestrateur au regard de la règle absolue : conforme. Publiée sur la branche de la PR #175 (documents seulement).
- 18:10 à 19:30 UTC : planche de Noisette validée (« 163c reco tout » : 163.24 oui, 163.25 « hop ! »). TDD de 163c (`80ea5d3` test, `ba575ee` feat : `animaux` au catalogue, clés inconnues ou absentes vers `animaux`). Refactor commun (`2007f16` : bulle écrite et assemblage des scènes, DOM de Léo et Lili identique avant et après). Câblage (`8ddec7a` refactor du dessin et du moteur de Noisette par le préfixe, additif ; `7c34009` feat). Steps E2E (`e543d36`).
- Review de 163c : APPROUVÉ, aucun bloquant ; non bloquants corrigés (`c85b22e` : `DEG` importé, `assembler-la-scene.ts` et `DessinDeLaScene`, `presence-du-decor.ts`, commentaire sur la main lue à `T_PRISE`).
- 18:26 à 19:35 UTC : VERROU base. Sonde OK. E2E `telephone`, 1 worker : `@livraison-163a`, `@livraison-163b`, `@livraison-163c`, `@livraison-106b` et `@livraison-106c` **64/64** ; après le refactor, `@livraison-163a`, `@livraison-163b` et `@livraison-163c` **50/50**. LIBÈRE base.
- Planches de Lumi (163d, validée : « 163.d reco tout ») et d'Agent Max (163e, présentée) préparées pendant ce temps, publiées avec les documents de la PR #175.

## Mesures (livraison 163c)

| Mesure | Valeur |
|---|---|
| Durée, du merge de 163b au PR prête | environ 1 h 45 (18:00 → 19:45 UTC) |
| Temps passé à attendre | PO (planche) : aucune attente (validée pendant la préparation) ; verrou base : aucune attente |
| Cycles de review À CORRIGER | 0 |
| Cycles E2E KO | 0 |
| Intégrations de `main` | 0 (branche repartie de `main` `d8d67ca`) |
| Tokens et coût | relevés par le responsable |
- 20:50 UTC : maquette `docs/maquettes/reponse-fausse-capitaine-sam.html` et planche 163f (`docs/stories/163/captures/163f-capitaine-sam-*.png`), scène nouvelle (163.4 A). Deux reprises demandées par l'orchestrateur au regard de la règle absolue (section 0 du skill illustration, « forme à double sens » : dans le doute, on ne dessine pas) : dans les deux premières versions, le jet partait de la lance tenue à hauteur de hanche, puis du ventre, vers le bas. Version retenue : lance tenue droite au-dessus de l'épaule, sommet de l'arc au-dessus du casque, gouttes séparées qui retombent à plus de 60 unités du corps. 1,5 s ; bulle « oups ! ». Conforme. Publiée sur la branche de la PR #175 (documents seulement).
- 19:40 UTC : merge de 163c autorisé (« Merge 163 c »). PR #175 mergée (`8873b6e`), sans rejeu (`main` inchangée), branche supprimée par GitHub. LIBÈRE merge. Planches d'Agent Max (163.28 oui, 163.29 « oups ! ») et de Capitaine Sam (163.30 oui, 163.31 B « plouf ! ») validées (« Reco tout 164.31 plouf », lu 163.31 par le responsable).

## 2026-11-06 : livraison 163d (Lumi)

- 19:45 UTC : branche recréée depuis `main` `8873b6e`. Planche de Lumi validée le 06/11 (« 163.d reco tout » : 163.26 oui, 163.27 « pschitt ! »).
- 19:45 à 20:40 UTC : TDD de 163d (`b1c8c6d` test, `ba0ecc8` feat : `princesse` au catalogue). Câblage (`94f5047` et `9823cae` refactor du dessin et du moteur de Lumi, additifs, avec l'expression `souffle` ; `664a67a` feat). Steps E2E (`c000d0a`).
- Review de 163d : APPROUVÉ, aucun bloquant ; non bloquants corrigés (`6bdca3a` : image fixe en un seul rendu, `SOL_X`/`SOL_Y`, `flottementDeLumi` exporté). Restent notés : le titre `refactor` de `94f5047` (il ajoute l'expression `souffle`, jamais employée par la célébration) ; sol et bulle des scènes à mettre en commun si 163e et 163f les répètent.
- 19:50 à 20:40 UTC : VERROU base. Sonde OK. E2E `telephone`, 1 worker : `@livraison-163a` à `@livraison-163d` et `@livraison-106d` **58/58** ; après le refactor, `@livraison-163d` et `@livraison-106d` **8/8**. LIBÈRE base.

## Mesures (livraison 163d)

| Mesure | Valeur |
|---|---|
| Durée, du merge de 163c au PR prête | environ 1 h (19:40 → 20:45 UTC) |
| Temps passé à attendre | PO : aucune attente (planche validée pendant 163c) ; verrou base : aucune attente |
| Cycles de review À CORRIGER | 0 |
| Cycles E2E KO | 0 |
| Intégrations de `main` | 0 (branche repartie de `main` `8873b6e`) |
| Tokens et coût | relevés par le responsable |
