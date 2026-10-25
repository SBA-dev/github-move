# Journal : issue #34, Suivi et carte des compétences

Équipe lancée par le responsable des équipes (`/graphe`, vague 1). Session : session_019CLjHWzkUXnfjnfsa34aDg.
Branche : `feature/34-suivi`, partie du cadrage `feature/lot-34-38-modele-et-scenarios` (`b3fa60c`). Branche de base : `main`.

## 2026-10-25

- 18:46 UTC : démarrage. Intégration de `main` (`be8f648`, avec #28) par merge (`75fc98a`). Conflits sur `docs/domain/glossaire.md` et `docs/domain/context-map.md` : les deux ajouts sont gardés. Les conflits du glossaire de #34/#38 (anciens n°8 à n°10) deviennent n°10 à n°12, car #32 a pris les n°8 et n°9 ; références mises à jour dans `docs/stories/34/domain-model.md` (pas dans les docs de #38, laissées telles quelles).
- Étapes 1 et 2 (domaine, critères) : faites au cadrage, validées par le PO (34.4, 34.8, 34.11, 34.29 et recos). CADRAGE PRÊT pour information.
- 19:00–20:00 UTC : TDD du domaine, 6 comportements, tous verts (2036 tests) :
  1. `SectionDuProgramme.matiere` (Catalogue, additif) : `9aec437` → `a34386a` ;
  2. `enfantSuivi` : `25d511a` → `b387444` ;
  3. `chiffresDuSuivi` : `e9dd2f3` → `4917599` (export additif de `SEUIL_DE_LECON_REUSSIE` d'Apprentissage, 34.19) ;
  4. `carteDesCompetences` : `43533c5` → `b3eef91` (export additif de `SEUIL_DE_LECON_ACQUISE`) ;
  5. `leconsJouees` : `74907b5` → `b4cc2be` ; le test avait une matière invalide (`mathematiques`), signalé par `implementer`, corrigé par `test-writer` (`0b86c4b`) ;
  6. `suiviDeLEnfant` : `bcaafdb` → `e524277` ; le test d'immutabilité ne pouvait pas passer (`structuredClone` perd les classes), signalé par `implementer`, corrigé par `test-writer` (`7533d64`) ; le filtre des leçons inconnues, en doublon et exigé par aucun test, est retiré de l'assemblage.
- Écart avec le modèle : pas de port `LectureDuSuivi` ni de fake dans `_shared/accompagnement/application/` : le front ne passe pas par la couche application (seul `@domain/*` est aliasé) et lit sous RLS par un adaptateur de `src/suivi/`, comme `src/medailles/lecture-des-records-supabase.ts` (#65). `SuiviIndisponible` devient un état d'affichage du front.
- APPRIS posté sur #34 pour #39 (`accompagnement/domain/index.ts`).
- 20:10 UTC : revue intermédiaire (delta `0ee1264..e524277`) : **APPROUVÉ**, aucun bloquant. Dernier commit relu : `e524277`. Non bloquants : (1) `SectionDuProgramme.matiere` typée `string` ; (2) `SeanceLue.etoiles` lu par aucun calcul ; (3) leçon réussie au test de départ sans `testDeDepartFaitLe` absente du tableau, état représentable ; (4) deux corrections de fixtures après coup ; (5) phrase du modèle sur le filtre de `suiviDeLEnfant` ; (6) style d'imports.
- Câblage : `b25659b` (lecture sous RLS, sections du programme), `a22a955` (section « Suivi » de l'espace parent). Le suivi est une **section** de l'écran `espace-parent`, déjà classé « parent » par #73 : rien à ajouter à `PUBLIC_DE_L_ECRAN`.
- `79b5c4e` (`po-acceptance`) : tags `@wip` et `@depend-de-28` retirés (#28 mergée).
- Review complète (étape 4) : **APPROUVÉ**, cycle 1, aucun bloquant. Non bloquants retenus pour correction avec les retours E2E : ordre I7 (message « Pas encore de leçon jouée. » avant la zone à part, pas de bloc vide) ; échec silencieux de la bibliothèque ou de l'index (afficher l'indisponibilité). Gardés en dette : plafond de 1000 lignes de PostgREST sur `seances_terminees` (vue agrégée `security_invoker` en story technique) ; couplage de l'adaptateur avec `src/seance/fin-de-seance/`.
- `main` a bougé (#73, `26116ae`) pendant la mise au point E2E : intégration après la mise au point (décision 0020).
- Mise au point E2E (`e2e-tester`, `a0c299a`) : **49/49** sur `telephone`, `--workers=2`, cycle 1, sans bug applicatif. Quatre steps existants étendus sous condition `@issue-34` (sens inchangé pour les autres stories). Contournement Chromium (lien 1194 → 1243) recréé dans le conteneur.
- `defb71b` (`implementer`) : non bloquants appliqués (ordre I7, indisponibilité si bibliothèque ou index vide, `useId`, clé React).
- `04817bc` : intégration de `main` `26116ae` (#73), sans conflit ; 2044 tests unitaires, lint, fmt, `tsc`, build verts.
- Revue delta (`defb71b`, `a0c299a`, `04817bc`) : **APPROUVÉ**.
- PR #94 ouverte en brouillon.
- 19:50 UTC : périmètre de non-régression (décision 0023) sur `telephone`, `--workers=2` : `@issue-34` + #11, #12, #24, #25, #27, #28, #72, #73 + #16, #18, #26 (528 cas).
- 20:40 UTC : périmètre (528 cas, 51 min) : **527/528**. KO : #24 « Le second parent rattaché voit les étoiles de Léa » (« Chargement des profils » encore affiché après 5 s sur « Qui joue ? », pas dans le suivi) : relancé seul.
- `main` a bougé (#39, `906c749`) pendant le périmètre ; intégration préparée dans un worktree séparé pour ne pas interrompre le run (décision 0020) : merge `aee360a` (conflits : glossaire et context map, deux ajouts gardés ; `accompagnement/domain/index.ts`, deux blocs d'exports ; `SectionDuProgramme` pris de #39, `matiere: Matiere` et `extrait`, test « section sans matière » de #34 gardé en plus ; `carte-des-competences.ts` regroupe par `matiere.code` ; doublon `chargerLesSectionsDuProgramme`, version de #39 gardée ; `styles.css`, deux blocs), puis `b654124` (`test-writer` : `extrait` dans la fabrique de sections). 2255 tests verts. Revue du delta : **APPROUVÉ**. Le non bloquant n°1 de la revue du domaine (matière typée) est réglé par #39.
- Pieds de commit `Co-Authored-By` : ligne d'attribution standard, présente sur plus de 800 commits de `main` ; aucun historique réécrit.
- Après l'intégration : `@issue-34` + `@issue-39` (stories mergées depuis le périmètre, décision 0022) et la relance du cas #24, sur `telephone`, `--workers=2`.
- 20:45 UTC : `@issue-34` + `@issue-39` + relance du cas #24 : **83/83** sur `telephone`. Tout est vert sur `b654124` (2255 tests unitaires, lint, fmt, `tsc`, build ; la PR #94 n'a pas de CI configurée). PR passée en « prête ». PRÊTE À MERGER.

## Mesures

| Mesure | Valeur |
|---|---|
| Durée, du lancement à PRÊTE À MERGER | 18:45 → 20:47 UTC, environ 2 h (merge à venir) |
| Temps passé à attendre | PO : 0 (scénarios déjà validés) ; verrous : 0 jusqu'ici ; `main` : 0 (intégrations préparées pendant les runs) |
| Tokens et coût | relevés par le responsable |
| Cycles TDD | 6 comportements, 6 cycles ; 2 tests corrigés après coup (fixtures) |
| Cycles de review À CORRIGER | 0 (domaine APPROUVÉ, complète APPROUVÉ, 2 deltas APPROUVÉ) |
| Cycles E2E KO | 0 bug ; 1 KO de charge sur 528 (#24), passé à la relance seule |
| Intégrations de `main` | 3 : `be8f648` (#28, conflits docs), `26116ae` (#73, sans conflit), `906c749` (#39, conflits docs et code d'Accompagnement et du Catalogue) |
| Régression sur `main` après le merge | à suivre |
| Runs E2E | mise au point 49 (4,6 min) ; périmètre 528 (51 min) ; complément 83 (7,8 min) |
