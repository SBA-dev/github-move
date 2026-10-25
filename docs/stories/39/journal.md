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
