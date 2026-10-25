# Journal de la story #39 : Leçons personnelles (générateurs locaux)

Équipe lancée par le responsable des équipes (vague 1, issue de coordination #64), session `session_01PpRVtKEEmxcZy3RwzMAG9K`.
Branche de base : `main` (`6be4dc6`). Branche : `feature/39-lecons-personnelles`.

## 2026-10-25

- 16:22 UTC : démarrage. Dépendances mergées : #25, #26, #19, #20, #22. #14 sortie de la beta (décision du PO, Q1.a) : l'export et la suppression des leçons personnelles avec le profil sont reportés dans #14.
- Règles de non-régression en vigueur (DÉCISION DU PO sur #64, « OK A B C D ») : avant `PRÊTE À MERGER`, périmètre de la story et des stories livrées du contexte et des fichiers partagés touchés, sur `telephone`.
- 16:29 UTC : `domain-modeler` : modèle de domaine (`f4dae0b`). Contexte Accompagnement, agrégat `LeconPersonnelle` (par profil enfant), table `lecons_personnelles` (RLS par rattachement, cascade avec le profil), questions #39.1 à #39.16.
- 16:35 UTC : `po-acceptance` : critères d'acceptance (`19d3d7d`). 6 règles, 29 scénarios (31 cas), 16 `@a-valider`, 6 `@acces` ; questions #39.17 à #39.21.
- CADRAGE PRÊT publié sur #39, avec DÉCISION (numéro demandé pour #39.16). En attente du OK du PO.
- 16:37 UTC : annonce `[Responsable]` sur #64 : décision **0024** réservée pour #39. Elle sera écrite après la réponse du PO à #39.16.
- 17:23 UTC : `main` (`7a80bae`, #32 mergée) intégrée, sans conflit. Toujours en attente du PO.
- 17:44 UTC : annonce `[Responsable]` **sur #39** (et non sur #64 ; vérifiée : même compte, préfixe `[Responsable]`, réponse du PO citée mot pour mot, suivie d'un message « RELIS #39 » de la session du responsable) : « 39. reco OK sauf 39.13 oui on conserve le texte » ; 39.12 confirmée (sans badge, choix « A »). Cadrage validé.
- `domain-modeler` (`2c1478d`) : modèle tranché, texte du parent conservé dans l'agrégat et la table, glossaire (décision n°38) et context map (ajouts), décision 0024.
- `po-acceptance` (`9553fc3`) : 6 règles, 31 scénarios (33 cas), 6 `@acces`, 0 `@a-valider`.
- 17:55 UTC : `VERROU base` demandé en avance (migration additive `lecons_personnelles`). TDD démarre.
- TDD bloc A (domaine Accompagnement) : 1 TexteDuParent RED `5e37ba7` → GREEN `be47d9a` ; 2 FormeDuTexte RED `ca4a948` → GREEN `63cf863` (raccourcis contraires au modèle) → RED `32f82d2` (règles exactes) → GREEN `c9d6b52` ; 3 GroupeDuVerbe RED `051863e` → GREEN `0285db6` ; 4 présent du 1er groupe et verbe à conjuguer RED `4541c1b` → GREEN `48eb143`.
- Revue delta bloc A (`cd8b755..48eb143`) : **À CORRIGER** (cycle 1) : message de `TexteTropLong`, h aspiré « hâter », verbes en é + consonnes + er (« je séche »), apostrophes sans test. Corrigé : RED `3cb5f71` → GREEN `65e2ef8`. Non bloquants retenus : verbe en minuscules (fait). Dernier commit relu : `48eb143`.
- Bloc B : 5 leçon d'une liste de mots RED `bcc90e0` → GREEN `7a15e7a` ; 6 leçon d'une liste de verbes RED `e78f810` → GREEN `61b0eb1`. 1875 tests verts.
- Bloc B (suite) : 7 poésie, texte, repli « Mon texte » RED `1d3f537` → GREEN `6ca5ff4` ; refactor `9ee05f2` (`tsc` du front) ; 8 section avec matière et extrait (Catalogue, ajout) RED `76932c7` → GREEN `cdeca8c` ; 9 choix de la section RED `ea8cce0` → GREEN `fda6a77` (bonus EMC du legacy abandonné : la section est toujours de la matière, #39.10) ; 10 citation RED `82cebdf` → GREEN `a24f7c1` ; 11 préparation et `leconEnBrut` RED `c14b991` → GREEN `c884b2a` (l'implementer a modifié l'extrait par défaut de `test_utils/sections-de-test.ts`, donnée de fixture seulement, accepté par le test-writer) ; 12 agrégat `LeconPersonnelle` et validation RED `dfc2fa2` → GREEN `057f574`. 1939 tests verts.
- Revue delta bloc B (`48eb143..057f574`) : **À CORRIGER** (cycle 1) : crochets du texte du parent dans « Les mots envolés », titre de dictée vide, deux erreurs sans test. Non bloquants retenus : sauts de ligne dans les titres et étiquettes, verbe conjugué parmi les 12 du classement, mot sans lettre, modèle aligné (`85a5bbf`), test renommé. Corrigé : RED `a855d3f` → GREEN `5c50014`. Non bloquant reporté : déplacer `leconEnBrut` dans le Catalogue (à voir en review finale).
- Bloc C/D : 13 `CreerUneLeconPersonnelle` RED `c934f5b` → GREEN `c04edc9` ; 14 `SupprimerUneLeconPersonnelle` RED `b28d252` → GREEN `75f1fe5` (parent d'une autre famille : `LeconPersonnelleIntrouvable`, rien n'est révélé) ; 15 « Pour toi » dans « Toutes les leçons » RED `1cfe144` → GREEN `969e74d` (ajouts seulement, #29 en parallèle) ; 16 `LeconsDuCatalogueEtPersonnelles` RED `628a4d1` → GREEN `179af7f`. 1967 tests verts.
- Revue delta bloc C/D (`057f574..179af7f`) : **À CORRIGER** (cycle 1) : matière choisie perdue à la création, « Pour toi » non compté dans le nombre de leçons. Corrigé : RED `a8e59e1` (avec `reconstituer` pour le repository) → GREEN `5db6bbf`, refactor `9009c45` (`GenerateurId` en port de l'application).
- 18:00-18:40 UTC : câblage serveur : migration `de70988`, `domain/index.ts` `4c9d27f`, infrastructure `606523b`, repository `d75bc3d`, Edge Functions `3228bc9`, `deno.json` `8ce6942`.
- 18:33 UTC : **VERROU base** accordé. Migration `20261025180000_lecons_personnelles.sql` appliquée à `savanturier-dev` (API de gestion) et inscrite dans `schema_migrations` ; RLS et droits vérifiés ; `creer-une-lecon-personnelle` et `supprimer-une-lecon-personnelle` déployées (401 sans JWT). 18:42 UTC : `LIBÈRE base`.
- Front : `f29ffa9` (« Pour toi », leçon personnelle jouable), `3286298` (« Créer une leçon », « Mes leçons »).
- 18:45 UTC : `MAIN A BOUGÉ : #28 mergée` ; `main` `be8f648` intégrée (`8510e88`), sans conflit, 2202 tests verts.
- `terminer-la-seance` : adaptateur `LeconsPersonnellesDuProfilSupabase` et câblage `f62880c`. Trou trouvé : les questions ratées d'une leçon personnelle étaient oubliées par la révision (#28) ; décision PO #39.12 (« compte pour les révisions ») : comportement 17 RED `fc1dfe8` → GREEN `52cf89e`, front `33cd0f3`.
- 18:47 UTC : **VERROU base** accordé ; 18:51 UTC : `terminer-la-seance` et `terminer-la-seance-de-revision` redéployées depuis `33cd0f3` (= `main` + #39), `LIBÈRE base`.
- Review finale et mise au point E2E (`telephone`, `--workers=2`) lancées.
