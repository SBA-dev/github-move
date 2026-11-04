# Journal de #140 : « Mes médailles », « Écouter » touché avant la fin du chargement est perdu

Branche de base : `main` (`573659e`). Branche : `feature/140-ecouter-mes-medailles`.
Lancée par le responsable des équipes (vague 1, issue de coordination #64, « Graphe 140 »).
Nature : correctif dans la stack cible (`fix(#140)`).

## 2026-11-04

- 20:50 UTC : démarrage. Lecture de l'issue, de `src/medailles/MesMedailles.tsx`, `src/seance/usePersonnageQuiParle.ts`,
  `supabase/functions/_shared/voix/domain/lecture-a-voix-haute.ts`, des attentes de `3d810cf` (#136) et `a6765f6` (#146).
- Cause : l'effet d'ouverture de `MesMedailles.tsx` dit l'accueil dès que les six chargements sont finis. Chaque section
  montre son bouton « Écouter » dès que sa propre donnée est chargée : une demande faite entre les deux est coupée par
  `dire({ nature: "accueil" })`, qui devient la dernière parole (`usePersonnageQuiParle`, `derniereLecture`).
- Étape 1 (domaine) : pas de `domain-modeler`. Pas de nouveau contexte ni d'agrégat ; une seule règle, dans Voix.
- 21:00 UTC : étape 2 (`po-acceptance`) : une règle et un scénario `@issue-140` à la fin de
  `features/65-ecran-mes-medailles.feature` (records, « tout lire » sur « non », l'histoire tarde à se charger).
  Un step nouveau. Question 140.1 (cas « tout lire » sur « oui »). Critères : `docs/stories/140/criteres.md`.
- 21:05 UTC : `CADRAGE PRÊT` sur #140, question 140.1 (« tout lire » sur « oui » : A abandon, recommandé ; B après la demande).
- 21:10 UTC : TDD, comportement 1/1 « l'accueil d'un écran ne passe pas devant une lecture demandée par l'enfant ».
  RED `eaf5405` (module introuvable, vérifié). GREEN `06b45ec` (`AccueilDeLEcran`, domaine Voix). `deno test` 2804/2804.
- 21:15 UTC : câblage `ae90d1c` (`MesMedailles.tsx`) : les 7 gestes « Écouter » notent la demande ; l'effet d'ouverture
  ne dit l'accueil que si `peutEtreDit()` ; la voix n'est plus coupée par le nettoyage de l'effet d'ouverture
  (une relance l'aurait coupée), mais par un effet de démontage seul. `tsc`, `build`, lint, fmt OK.
  Le câblage s'applique aussi à « tout lire » sur « oui » (choix A de 140.1) ; à reprendre si le PO choisit B.
- 21:20 UTC : `VERROU base` demandé. Steps E2E (`e2e-tester`, sans run) et revue delta (`mr-reviewer`) en parallèle.
  Navigateur : contournement `pw/` du scratchpad (`chromium_headless_shell-1194/chrome-linux` → fichiers de la 1243).
- 21:30 UTC : steps E2E (`e2e-tester`) : `6b3073f` (step nouveau : retient `GET /rest/v1/seances_terminees` jusqu'au
  geste de Léa, puis attend la section de l'histoire ; retrait de l'attente de `3d810cf`), `ae6ab80` (retrait des
  attentes de `a6765f6` dans badges, cabane, histoire, tenues). Textes des steps inchangés.
- 21:32 UTC : revue delta (`eaf5405^..ae90d1c`) **APPROUVÉE**, sans bloquant. Non bloquants appliqués : démontage sans
  ref (`8aebd5b`, motif de `FinDeLaRevision.tsx`) ; glossaire « Accueil de l'écran (à valider) » (`c60d13d`, ajout).
- 21:35 UTC : `VERROU base` accordé par le responsable. Sonde `admin/users` : 3 × 200 en < 1,5 s.
- 21:50 UTC : **rouge prouvé** : correctif retiré de la copie de travail (non commité), `@issue-140` sur `telephone`,
  1 worker, `--repeat-each=3` : **3/3 KO** sur « Léa entend Noisette lire « Mes records… », puis … » (la lecture
  demandée est coupée par l'accueil). Correctif restauré.
- 21:55 UTC : run vert lancé : `@issue-140` et les 6 scénarios « … à la demande » qui touchent « Écouter »
  (65:206 plan, 31:317, 32:251, 33:404, 102:253), sans les attentes, `telephone`, 1 worker, `--repeat-each=3`.
