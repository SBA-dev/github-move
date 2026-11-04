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
