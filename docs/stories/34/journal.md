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
