# Journal de la story #106 : Une célébration propre à chaque univers

Branche de base : `main` (`47a6d34`). Branche : `feature/106-celebration-de-l-univers`.
Équipe lancée par `/graphe` (issue de coordination #64), session `session_015z4jmQ6ZKkiCVxF2NZvLUh`.

## 2026-11-02

- 20:30 UTC : démarrage anticipé. Cadrage seulement (domaine + scénarios). Aucun code avant le merge de #100 (PR #139) et la validation du cadrage par le PO.
- Contradiction relevée : l'issue dit « un toucher passe la célébration » ; 97.17 dit qu'un toucher ne fait rien pendant la célébration. Question au PO.
- 20:45 UTC : modèle de domaine (`domain-modeler`) : contexte Motivation, lecture pure dans `@domain/motivation`, aucune table ni migration. 23 questions (106.1 à 106.23).
- 21:00 UTC : scénarios (`po-acceptance`) : `features/106-celebration-de-l-univers.feature`, 17 scénarios pour 106a, 5 pour les livraisons suivantes (`@hors-106a`). 3 questions de plus (106.24 à 106.26). CADRAGE PRÊT publié sur #106.
- 21:20 UTC : proposition des musiques (106.12). Le réseau de la session refuse `kenney.nl` et `opengameart.org` : le pack complet « Music Jingles » (85 jingles CC0) n'est pas téléchargeable. Seule copie accessible : `S3M1TR4SH/asset-library` (4 jingles : `hit`, déjà « grande victoire » ; `pizzicato`, déjà « séance terminée » ; `nes`, 1,8 s ; `steel`, 1,6 s). Trop peu pour six musiques distinctes : demande d'ouverture d'un des deux hôtes.
- 21:05 UTC : #100 mergée (`f8a4787`, annonce [Responsable] sur #64). Reste une condition avant le code : la validation du cadrage par le PO. `main` sera intégrée après cette validation.
- 21:10 UTC : réponse du PO « 106 reco tout » (annonce [Responsable] sur #106 et #64). Validation levée, #106 en `graphe:dev`. On livre 106a (mécanisme, défi relevé, Sports), musique « grande victoire » en attendant le choix du PO (106.27 : accès réseau à ouvrir par le PO).
- 21:12 UTC : `main` intégrée (`f8a4787`, avec #100), sans conflit.

### TDD, bloc « Motivation, domaine de la célébration de l'univers »
- B1 moment de célébration : RED `989fec9`, GREEN `01aa7eb`.
- B2 célébration de l'univers Sports (cri, musique, variante au hasard) : RED `834478e`, GREEN `8a77a22` (`tirerDans` rendu générique dans le même commit, nécessaire à la compilation).
- B3 univers pas encore livré : test `f12d9d7`, vert d'emblée (le type `Partial` du catalogue impose déjà le cas) ; prouvé par mutation (entrée `danse` ajoutée → échec, puis annulée).
- `deno test` : 2771 verts.
- Revue delta du bloc (`989fec9..f12d9d7`) : APPROUVÉ, aucun bloquant. Non bloquant retenu pour le câblage : aucun `switch` sur `MomentDeCelebration` avec des branches que 106a ne déclenche pas. Dernier commit relu : `f12d9d7`.

### Câblage et review
- Câblage 106a : `088c27c` (scène de Coach Léo, moteur des maquettes isolé), `11ffa1d` (branchement dans la fin du défi). Durée ramenée à 3 s par variante.
- Review, cycle 1 : À CORRIGER. Un bloquant : un défi rejoué n'avait pas les confettis de la célébration commune (106.25, scénario R3), et le choix entre les deux célébrations se faisait dans React. Correction : le domaine rend la célébration de la fin (`celebrationDeLaFin`) ; RED `e31daf8`.
- Notés (non bloquants) : pas d'animation de sortie avec Motion (voulu : aucun écran sortant à attendre, `EcranQuiArrive.tsx`, écart de lettre avec 0039 §3) ; Coach Léo affiché deux fois (scène + bulle) : question au PO ; captures à refaire depuis l'écran réel (banc d'essai sans thème) ; avant 106b : clés de variante liées au domaine, scènes chargées à la demande (+39 kB pour Sports), identifiants SVG préfixés.
- Correction : GREEN `8668e66` (`celebrationDeLaFin`, la fin du défi l'appelle ; défi rejoué → confettis de la célébration commune), refactor `c628a78` (ids SVG préfixés `sports-`, deux `as` retirés).
- Review, cycle 2 : APPROUVÉ (aucun bloquant). Non bloquants : React choisit encore entre deux sons fournis par le domaine ; 1er test de `celebrationDeLaFin` calcule sa valeur attendue par `celebrationDe`.

### E2E (mise au point, `telephone`)
- Steps : `b478f00`. 1er run : 24/25 ; KO « le clavier n'est jamais bloqué » dû au texte du scénario (« Accueil » à la fin d'un défi mène à l'accueil de l'enfant depuis #100, pas à « Qui joue ? ») : phrase corrigée `7840e18`, `@wip` retiré.
- 2e run, HEAD `7840e18` : **25/25 verts** (5,3 min, 3 workers).
- Même contexte : `@issue-100` + `@issue-97` 98/99 ; le KO (#97, « Rejouer une leçon déjà acquise… », effet « découverte » après « séance terminée ») échoue aussi sur `main` `f8a4787` : préexistant, signalé (APPRIS).
- Navigateur : config locale non commitée (`executablePath` Chromium 1243), sans `playwright install`.
- PR #142 ouverte en brouillon. Review finale publiée sur la PR : APPROUVÉ, aucun bloquant (steps partagés : rien ne change de sens).

## Mesures

| Mesure | Valeur |
|---|---|
| Durée | 2026-11-02 20:30 UTC → 22:30 UTC, PRÊTE À MERGER (environ 2 h) |
| Attente | validation du cadrage par le PO : environ 35 min ; merge de #100 : levé pendant le cadrage |
| Cycles TDD | 4 comportements (B1, B2, B3 vert d'emblée prouvé par mutation, correction `celebrationDeLaFin`) |
| Review | 1 revue de bloc (APPROUVÉ), 2 cycles sur la branche (À CORRIGER puis APPROUVÉ), 1 review finale (APPROUVÉ) |
| E2E | 2 runs de mise au point sur `telephone` (24/25, puis 25/25) ; 1 run du même contexte (`@issue-100`, `@issue-97` : 98/99, KO préexistant sur `main`) |
| Intégrations de `main` | 1 (`f8a4787`), sans conflit |
| Escalades | 1 (accès réseau aux musiques, #106.27) |
| Verrous | aucun |
| Tokens | relevés par le responsable |

### Merge (verrou merge accordé le 2026-11-02 22:39 UTC)
- Autorisation du PO : « merge 106 OK, 106.28 cacher » (annonce [Responsable] sur #64).
- 106.28 : scénario `17e99ae`, steps rouges `ad08395` (R1 rouge pour la bonne raison, R3 vert), feat `2a69ea2` (`ParoleDuGuide` reçoit `sansPersonnage` pendant la célébration de l'univers).
- `main` inchangée depuis `f8a4787` : rien à intégrer.

---

# Livraison 106b : univers Danse (Lili)

Branche de base : `main` (`597a4a5`). Branche : `feature/106b-celebration-danse`.
Équipe lancée par `/graphe` (« graphe 106b », issue de coordination #64), session `session_015z4jmMYrXXzEe8XSDXSRrg`.

## 2026-11-04
- 23:25 UTC : démarrage. Cadrage de #106 déjà validé (« 106 reco tout », 106.28 « cacher ») ; maquette `lili-danse.html` validée par le PO le 2026-10-27. Musique : « grande victoire » (106.27 toujours fermé).
- 23:30 UTC : complément de modèle 106b (`domain-modeler`) et scénarios 106b (`po-acceptance`) lancés en parallèle. Dette de 106a à traiter : clés de variante liées au domaine, scènes chargées à la demande, ids SVG préfixés.
- 23:45 UTC : CADRAGE PRÊT publié pour information (aucune question nouvelle) : noms des variantes « le grand jeté », « le ruban », « les petits sauts » (106.26) ; pétales de la salle = 106.24.

### TDD, bloc « Motivation, célébration Danse et clés de variante »
- RED `5916536` (rouge de compilation : `VARIANTES_DES_UNIVERS` non exporté), GREEN `9d9304d` (entrée `danse`, `VARIANTES_DES_UNIVERS`, `UniversCelebre`, `VarianteDe<U>`, union discriminée), refactor `389e62f` (le front tire les clés Sports du domaine).
- `418a489` : le test « univers pas encore livré » de `celebrationDeLaFin` prend `animaux` (Danse est livré).
- `deno test` : 2808 verts ; `tsc` OK.
- Revue delta du bloc (`5916536..418a489`) : APPROUVÉ. Non bloquants : `418a489` aurait dû être dans le RED (précondition changée par Danse livré ; branche déjà poussée, pas de réécriture) ; type de `VARIANTES_DES_UNIVERS` trop large ; aucun garde-fou pour un univers oublié dans `celebrationDe`.
- Correction des non bloquants : RED `97eb6cf` (test de typage TS2322, garde-fou d'exhaustivité), GREEN `3e53fef` (type mappé), refactor `a0a9d87` (table `CELEBRANTS` : un univers oublié ne compile plus). `deno test` : 2810 verts.

### Câblage
- `6142e72` : code commun des scènes dans `src/univers/celebrations/commun/`, Sports chargé à la demande.
- `b1fbfb7` : scène Danse (Lili) chargée à la demande, ids `danse-`, pétales sur canvas, image fixe en mouvements réduits. Morceaux : principal 1 335 → 1 299 kB ; Sports 33,7 kB ; Danse 35,7 kB ; commun 5,5 kB ; tous précachés par le service worker.
- `1314434` : planches de Lili (`captures/106b-lili-clair.png`, `106b-lili-sombre.png`), relues contre la règle absolue par l'orchestrateur : rien à signaler. Présentées au PO (#106.29 validation, #106.30 zone de peau sous la chevelure en vue de dos, comme la maquette).
- Steps E2E `995ea86` (non lancés : verrou `base` demandé, 3e dans la file derrière #137 et #130).

### Review de la branche
- Cycle 1 (`68a2eab`) : À CORRIGER. Bloquant : premier `React.lazy` de l'application sans repli, un import de scène qui échoue (ancienne version après `skipWaiting`, hors ligne avant le précache) aurait laissé un écran blanc à la fin du défi (régression pour Sports). Non bloquants : saut de `vue` en fin de pirouette, lien générique univers/variante, tables de variantes des steps, `Object.hasOwn`, décalage de mise en page.
- Corrections : steps `6271ec7` ; `c4bc8a0` (repli `chargerSansEchec`, espace réservé de même ratio sans `data-testid`), `70cdb85` (`E.instantanee`), `77d48d5` (générique), `a179a94` (`Object.hasOwn`). Repli vérifié par un script Playwright non commité (import coupé : espace réservé, boutons présents, aucune erreur).
- Cycle 2 (`a179a94`) : APPROUVÉ. Non bloquants restants : repli de chargement sans test automatisé (pas de scénario : à proposer au PO), `a179a94` aurait pu être un `refactor`.

## 2026-11-05
- 00:23 UTC : réponse du PO (annonce [Responsable] sur #106) : « planche 106b OK, 106.30 corriger ». Planche `1314434` validée.
- 106.30 : `9edd375` (de dos, la chevelure recouvre l'arrière du crâne ; de face et de profil, dessin identique au bit près), captures `8101cb2` (`106b-lili-pirouette-de-dos.png`, `106b-lili-tetes-avant-apres.png`), relues par l'orchestrateur. Revue delta : APPROUVÉ (non bloquants : constantes du recouvrement à nommer, point de fermeture du tracé, ombre de nuque devenue invisible de dos).

### E2E (verrou `base` accordé le 2026-11-05 00:39 UTC)
- `main` intégrée avant le run (`af47f19`, avec #130) : merge `6f4c673`, sans conflit ; tsc, 2810 tests, build OK.
- Sonde `admin/users` : 3 réponses en moins de 0,6 s.
- Run 1, `@issue-106` hors `@hors-106a`, `telephone`, 1 worker : **30/31**. KO « Sans réseau, Coach Léo joue quand même la célébration » : vrai bug introduit par le chargement à la demande (l'`import()` du morceau échoue hors ligne, aucune scène).
- Correctif 1 `c9dc12b` (préchargement à l'ouverture du défi, promesse mémorisée) : revue APPROUVÉ ; rejeu ciblé 8/9, toujours KO (course : le réseau est coupé juste après l'ouverture du défi, avant la fin du chargement des modules).
- Correctif 2 `a4ced3d` (préchargement dès que l'univers du profil en cours est connu, `src/Application.tsx` ; une promesse en échec est oubliée pour retenter) : revue APPROUVÉ ; scénario vert.
- Run complet, HEAD `a4ced3d` : **31/31 verts** (10,6 min).

## Mesures (106b)

| Mesure | Valeur |
|---|---|
| Durée | 2026-11-04 23:25 UTC → 2026-11-05 01:15 UTC, PRÊTE À MERGER (environ 1 h 50) |
| Attente | validation de la planche par le PO : environ 50 min (sans bloquer : TDD, câblage et review avancés pendant ce temps) ; verrou `base` : environ 1 h 05 (file : #137, #130) |
| Cycles TDD | 3 comportements (catalogue Danse et clés publiées ; type mappé et exhaustivité ; un test de précondition corrigé) |
| Review | 1 revue de bloc (APPROUVÉ), 2 cycles sur la branche (À CORRIGER puis APPROUVÉ), 3 revues delta (106.30, `c9dc12b`, `a4ced3d` : APPROUVÉ), 1 review finale |
| E2E | 3 runs sur `telephone` (30/31, rejeu ciblé 8/9, 31/31) et 1 scénario seul (vert) |
| Intégrations de `main` | 1 (`af47f19`), sans conflit |
| Escalades | aucune nouvelle ; 106.27 (accès réseau aux musiques) toujours ouvert |
| Verrous | `base` (00:39 → 01:15 UTC) |
| Tokens | relevés par le responsable |

### Merge (autorisé par le PO : « merge 106b OK », annonce [Responsable] sur #64, 2026-11-05 07:07 UTC ; verrous `merge` et `base` accordés)
- `main` intégrée (`adb9329`, avec #137) : merge `a21481c`, un conflit d'imports dans `src/defis/EcranDeDefi.tsx` (noms de #137 + `prechargerLaSceneDe`), résolu par `implementer`. tsc, build, 2877 tests, lint, fmt, bddgen OK.
- Revue du delta d'intégration : APPROUVÉ. À signaler au PO : depuis #137, `FinDuDefi` sert aussi au grand défi, donc la célébration de l'univers se joue aussi au premier grand défi relevé (règle « premier relevé » inchangée ; pas de scénario de 106b).
- Sonde : 3 réponses en moins de 1,4 s. Rejeu `@issue-106` hors `@hors-106a`, `telephone`, 1 worker, HEAD `a21481c` : **31/31 verts** (décision 0022).
- Pas de CI sur la PR.
- Mesures mises à jour : intégrations de `main` 2 (`af47f19` sans conflit, `adb9329` avec 1 conflit d'imports) ; E2E 4 runs (dont le rejeu sous verrou `merge`) ; attente de l'autorisation de merge : environ 5 h 50 (nuit).

---

# Livraison 106c : univers Animaux de la forêt (Noisette)

Branche de base : `main` (`af47f19`). Branche : `feature/106c-celebration-animaux`.
Équipe lancée par `/graphe` (« graphe 106c », issue de coordination #64), session `session_015z4jmLxTprDR2qh6vJhusW`.
106b (Danse, PR #154) est en cours sur les mêmes fichiers : modèle, scénarios et planche d'abord ; catalogue et scènes câblés après le merge de 106b et l'intégration de `main`.

## 2026-11-05
- 00:50 UTC : démarrage. Cadrage de #106 déjà validé (« 106 reco tout », 106.28 « cacher ») ; maquette `noisette-animaux.html` validée par le PO le 2026-10-27. Musique : « grande victoire » (106.27 toujours fermé). Structure reprise de la branche de 106b (`VARIANTES_DES_UNIVERS`, union discriminée, `React.lazy`, `commun/`, ids préfixés).
- 00:55 UTC : complément de modèle 106c (`domain-modeler`) et scénarios 106c (`po-acceptance`) lancés en parallèle.
- 01:00 UTC : modèle 106c `fc0db0d` (entrée `animaux` dans les structures de 106b ; libellés « le jonglage », « la noisette croquée », « les joues pleines » d'après la maquette, 106.26 ; « les feuilles de la forêt » = 106.24 ; règle absolue détaillée pour la noisette croquée et les joues pleines ; README des maquettes « il » → « elle » à corriger dans 106c).
- 01:05 UTC : scénarios 106c `1f1f1a4` : Règle R9, 5 scénarios `@livraison-106c` (7 cas), sur le modèle de 106b. 12 étapes nouvelles (steps à écrire après le merge de 106b, qui pose `celebration-de-l-univers.steps.ts`).
- Question nouvelle 106.31 (tenue portée pendant la célébration) : ni la scène Sports ni la scène Danse ne dessinent la tenue de #102 ; reco : renvoyer à 106h pour tous les univers.
- TDD du domaine préparé dans un worktree local (106c + 106b, jamais poussé) : RED `b285360` vérifié (5 erreurs de typage, toutes sur `animaux`). Les commits seront repris sur la branche après le merge de 106b.
- GREEN `564b353` (worktree) : entrée `animaux` (clés, « Hourra ! », `grandeVictoire`, `CELEBRANTS`). `deno test` : 2812 verts.
- Câblage préparé dans le worktree : scène de Noisette `5ad4636` (`src/univers/celebrations/animaux/`, ids `animaux-`, chargée à la demande, 26,3 kB, précachée), `switch` exhaustif `b7fbe4f`, yeux grands ouverts en fin de noisette croquée `b69901d` (les paupières mi-closes de la maquette donnaient un air narquois). Bouches fermées, miettes réduites et sorties des mains (règle absolue).
- Planche (`106c-noisette-clair.png`, `-sombre.png`, `-moments.png`) relue par l'orchestrateur contre la règle absolue : rien à signaler. Planche et README (« elle ») repris sur la branche (`972bea8`, `e8a44ff`) : fichiers sans conflit avec 106b. Présentée au PO (validation #106.32).

### Revue intermédiaire du bloc (worktree, `2010ec8..ff5551d`)
- À CORRIGER, un bloquant : un lien `node_modules` (créé par l'orchestrateur pour le worktree) commité dans le GREEN, car `.gitignore` ne couvre que `node_modules/`. Corrigé : historique local refait sans le lien (`wip/106c-propre` : GREEN `ceed1d7`, scène `e52c78a`, `switch` `2866d64`, yeux `fde10a7`), contenu identique ; `/node_modules` ajouté au `.gitignore` (`chore`).
- Non bloquants traités : image fixe jamais sur un clignement, constantes nommées, tracé de la queue sans réécriture par regex. Notés pour après le merge de 106b : Sports et Danse passent sur `commun/expressions.ts` et `commun/tableaux.ts` (avant 106d) ; garde de type pour `PoseDeMain` dans `commun/mains.ts` ; `fix` des yeux à fusionner dans le câblage avant la PR ; modèle 106c à aligner sur la réponse à #106.31.
- 07:07 UTC : réponse du PO (annonce [Responsable] sur #64) : « 106c reco tout ». 106.31 renvoyée à 106h (pas de tenue dans la scène), 106.32 planche validée, 106.33 jonglage comme la maquette ; 106.35 (posée par 106d, « oui ») : aucune étoile à cinq branches chez Noisette, appliquée directement dans 106c (scène pas encore mergée). Docs `dd59642`.
- 07:24 UTC : 106b mergée (`4742309`, annonce [Responsable]). `main` intégrée (`9fedc68`) : conflits de documentation et de scénarios résolus en gardant 106b puis 106c ; ligne d'introduction qui commençait par un tag corrigée (`d664353`).
- Report des commits du worktree : RED `b7acc83`, GREEN `378fc97`, scène `f37c35d` (correctif des yeux fusionné), `switch` exhaustif `dae19ef`, table des chargeurs du préchargement `4520f6b` (conflit avec le préchargement de 106b résolu par `implementer`), `ce6aa73`, `35b168b`, `a0d9e98` (106.35). `deno test` : 2879 verts ; `tsc` et build OK.
- Steps E2E `c4cf357` (non lancés). VERROU base demandé, 2e derrière #155.
- Review de la branche : APPROUVÉ. Non bloquants traités : `cc6891e` (préchargement sans conversion de type), `3a70063` (commentaire du `.gitignore`), `8a78a5a` (forme d'acceptance). Hors 106c : le ruban de Lili dessine encore une étoile à cinq branches (`danse/effets.ts`), 106.35 à appliquer à Lili (signalé au responsable).

### E2E (mise au point, `telephone`, 1 worker, sous VERROU base)
- VERROU base accordé à 07:35 UTC (2e dans la file, derrière #155). Sonde : 3 appels `admin/users` en 200, de 0,4 à 1,1 s.
- HEAD `a34f9c7` : `@livraison-106c` **7/7 verts** (3,0 min) ; `@issue-106` hors 106c (Sports et Danse, qui partagent `SceneDeCelebration.tsx` et le préchargement) **30/30 verts** (10,4 min). Aucun KO, aucune relance. LIBÈRE base.
- Navigateur : contournement `pw/` du scratchpad (`chromium_headless_shell-1194` qui pointe vers la 1243), sans `playwright install`.
- PR #156 ouverte en brouillon.

## Mesures (106c)

| Mesure | Valeur |
|---|---|
| Durée | 2026-11-05 00:50 UTC → environ 08:00 UTC (PRÊTE À MERGER), dont environ 1 h 10 de travail le soir et 45 min le matin |
| Attente | réponse du PO (#106.31 à #106.33) et merge de 106b : la nuit, de 01:55 à 07:07 UTC, sans travail en attente (domaine, scène et planche déjà prêts dans le worktree) ; VERROU base : environ 7 min |
| Cycles TDD | 1 comportement (entrée `animaux`, RED puis GREEN) |
| Review | 1 revue intermédiaire (À CORRIGER : lien `node_modules`, puis corrigé), 1 review de la branche (APPROUVÉ), 1 review finale du delta (steps) |
| E2E | 2 runs sur `telephone` (7/7, puis 30/30), aucun KO |
| Intégrations de `main` | 1 (`4742309`, avec 106b et #137) : 4 conflits de documentation et de scénarios (attendus, sections au même endroit), 1 conflit de code (`SceneDeCelebration.tsx`, préchargement de 106b) |
| Escalades | 1 (planche de Noisette et #106.33) ; 1 question au cadrage (#106.31) |
| Verrous | base (07:35 → 07:52 UTC) |
| Méthode | domaine, scène et planche préparés dans un worktree local (106c + 106b, jamais poussé) pendant l'attente du merge de 106b, puis reportés par cherry-pick : aucun temps perdu, mais un risque de perte si le conteneur avait été repris |
| Tokens | relevés par le responsable |

## Livraison 106d : Princesses et fées (Lumi)

Branche : `feature/106d-celebration-princesses`, partie de `main` (`adb9329`, merge de #137). Base : `main`.
Équipe lancée par `/graphe` (« graphe 106d », issue de coordination #64), session `session_015z4jmPanvGhsMF1hUvUrLE`.
106b (Danse, PR #154) et 106c (Animaux) sont en cours sur les mêmes fichiers : modèle, scénarios et planche d'abord ; catalogue et scènes câblés après les merges de 106b puis 106c et l'intégration de `main`.

### 2026-11-05
- 02:00 UTC : démarrage. Commentaire Avancement créé sur #106. 106.31 (tenue portée) pas encore tranchée par le PO : 106d suivra sa réponse.
- 02:05 UTC : modèle de domaine (`domain-modeler`) lancé. Scène de Lumi portée dans un worktree local (`/home/user/wt-106d`, branche locale `wip/106d-scene`, depuis la tête de 106b `7d6b34e`, jamais poussée) pour produire la planche, comme 106c. `/node_modules` ajouté à `.git/info/exclude` (le lien du worktree ne doit pas être commité, leçon de 106c).
- Étoiles : la maquette dessine des étoiles dorées à cinq branches avec contour (`ETOILE(r)`), proches de l'Étoile de récompense. Scène préparée avec deux réglages (`etoile` de la maquette, `etincelle` à quatre branches) pour une planche comparative : question au PO #106.34.
- 02:20 UTC : modèle 106d (`a9993b5`) : entrée `princesse` (`arc`, `envol`, `signes`, « Magique ! », `grandeVictoire`), libellés « l'arc-en-ciel », « l'envol », « les chiffres et les lettres » (106.26), effets « les étincelles du jardin » (106.24). Questions nouvelles #106.34 (étoiles de la scène) et #106.35 (même règle pour Lili et Noisette). 106.31 suivie telle que le PO la tranchera.
- 02:35 UTC : scénarios 106d (`po-acceptance`) : règle R10, 5 scénarios `@livraison-106d` (7 cas), Gherkin valide (12 steps manquants, attendus avant les merges de 106b et 106c).
- 02:50 UTC : scène de Lumi portée dans le worktree (`wip/106d-scene`, jamais poussé) : entrée `princesse` du domaine `e4b07f8` (préparation, le TDD sera refait sur la branche), scène `b12a113` (`src/univers/celebrations/princesses/`, 33,75 kB, 11,75 kB gzip). Réglage `fleurs` par défaut (aucune étoile à cinq branches), `etoile` (maquette) gardé pour la comparaison. 2 tests de 106b cassent comme attendu (`princesse` supposée pas encore livrée). Ids SVG préfixés `princesse-` : `commun/dom.ts` (106b) construit le préfixe depuis la clé d'univers.
- Écarts voulus par rapport à la maquette : geste du sort en rond doux au lieu du recul puis « coup de baguette » (règle absolue : la baguette ne se lit jamais comme une arme) ; bras levés en fin de sort ; sourcils doux à la concentration (mine fâchée dans la maquette) ; en fin de « chiffres et lettres », les fleurs se rangent au-dessus de la tête (le visage restait caché sur l'image fixe).
- Planche relue par l'orchestrateur contre la règle absolue : rien à signaler. Publiée (`106d-lumi-clair.png`, `-sombre.png`, `-moments.png`, `-etoiles-comparaison.png`).
- 07:08 UTC : réponse du PO « 106d reco tout » (annonce [Responsable] https://github.com/SBA-dev/github-move/issues/106#issuecomment-6652002035) : 106.34 A (aucune étoile à cinq branches), 106.35 oui (correctif de l'étoile du ruban de Lili confié à 106d après le merge de 106b ; 106c retire ses étoiles), 106.36 planche validée écarts compris, préfixe `princesse-` accepté ; 106.31 (106c) : tenue portée renvoyée à 106h. Reportées dans le modèle et les critères. Attente : merges de 106b puis 106c.
- 07:25 UTC : 106b mergée (`4742309`, annonce du responsable). `main` intégrée : conflits dans le journal, la feature, les critères et le modèle, résolus en gardant les deux ajouts (106b puis 106d). `deno test` 2877 verts, `tsc` OK. Correctif 106.35 (étoile du ruban de Lili) lancé ; câblage de Lumi après le merge de 106c.
- 07:45 UTC : correctif 106.35 : l'étoile dorée du ruban de Lili devient une étincelle à quatre branches (`6ef5aa6`), capture avant/après (`314bc11`). Revue delta `ef86ea4..314bc11` : APPROUVÉ, aucun bloquant. Non bloquants : dégradé du halo à ranger dans le `<defs>` commun ; id `danse-etoile-ruban` à renommer plus tard ; à signaler au PO dans la PR : le trait rose du ruban trace encore une figure à cinq sommets (passager, absent de l'image fixe, conforme à la reco 106.35 qui garde le tracé). Dernier commit relu : `314bc11`.
- 08:25 UTC : 106c mergée (`dbbe378`). `main` intégrée (`e735f38`) : conflits de documentation et de scénarios résolus en gardant les deux ajouts (sections 106b, 106c, 106d ; R8, R9, R10 ; il ne reste que Police et Pompiers « pas encore livrés »). `deno test` 2879 verts, `tsc` OK. Rangement demandé par le responsable (signalé par 106c) lancé : Sports et Danse sur `commun/expressions.ts` et `commun/tableaux.ts`, sans changement de rendu. Câblage de Lumi ensuite.
- 08:40 UTC : rangement Sports et Danse sur `commun/` : `d63ddff`, `3649101` (rendu identique octet à octet sur les 6 états finaux).
- TDD bloc « Motivation, célébration Princesses et fées » : RED `850b61e` (5 erreurs de typage, toutes sur `princesse`), GREEN `b11c6f0` (entrée `princesse`, cas minimal compilable dans `SceneDeCelebration.tsx`). Le test « univers pas encore livré » de `celebration-de-la-fin_test.ts` supposait encore `princesse` : passé à `pompier` par `test-writer` (`3f51285`), comme `418a489` pour `animaux`. `deno test` 2881 verts.
- Câblage : scène de Lumi reprise du worktree, dessin validé inchangé (`aa6eb65`) : modules `commun/expressions.ts` et `commun/tableaux.ts`, réglage « étoile » supprimé (106.34 A), ids `princesse-`, chargée à la demande et précachée (32,65 kB). `tsc`, lint, fmt, build OK. Dette : `courbe` copiée dans trois scènes (candidate à `commun/courbes.ts`).
- 08:55 UTC : steps de Lumi `85e0855` (`bddgen` sans step manquant). VERROU base accordé à 106d (tableau de #64, 08:34 UTC) ; run `@issue-106` hors `@hors-106a`, `telephone`, 1 worker, lancé.
- Review de la branche (`origin/main...HEAD`) : APPROUVÉ, aucun bloquant. Non bloquants à traiter après le run (pour ne pas toucher `src/` pendant qu'il tourne) : extraire `courbe` dans `commun/` (3e copie) ; traînée de la baguette masquée sur l'image fixe ; noms `or` (rose) et `etoile-du-corsage` (étincelle) ; `ECHELLE_DE_BASE` exporté pour rien ; ligne vide double dans `danse/queue-de-cheval.ts`. Leçon TDD notée : le passage `princesse` → `pompier` du test « univers pas encore livré » aurait dû être dans le RED.
- 09:15 UTC : run E2E (`993b3ca`, `telephone`, 1 worker, `@issue-106` hors `@hors-106a`) : **43/43 verts**, 15,7 min. Sonde : 3 réponses `admin/users` en 0,4 à 1,3 s. LIBÈRE base.
- Non bloquants traités : `courbe` dans `commun/membres.ts` (`32eae1d`), traînée de Lumi masquée sur l'image fixe (`1c4b05b`), noms `rosePale` et `etincelle-du-corsage`, ids inutilisés retirés (`ca387f3`), commentaires remplacés par des fonctions nommées (`5d0a3a7`). Rendu identique au pixel (27 images : Danse, Animaux, Princesses, état final et deux instants). Revue delta `993b3ca..5d0a3a7` : APPROUVÉ, rejeu E2E non nécessaire (aucun step ne lit ce qui a changé). Non bloquant noté : la traînée masquée n'est exigée par aucun test.
- `main` inchangée depuis l'intégration (`dbbe378`).

## Mesures (106d)

| Mesure | Valeur |
|---|---|
| Durée | 2026-11-05 02:00 UTC → environ 09:20 UTC, PR prête (environ 7 h 20, dont environ 5 h d'attente) |
| Attente | réponses du PO 106.34 à 106.36 : environ 4 h 10 (02:50 → 07:08) ; merge de 106b : environ 15 min après les réponses ; merge de 106c : environ 50 min ; verrou `base` : environ 0 (accordé dans la minute) |
| Cycles TDD | 1 comportement (RED `850b61e`, GREEN `b11c6f0`) + ajustement du test « univers pas encore livré » |
| Review | 3 revues delta (ruban de Lili, non bloquants) et 1 revue de branche, toutes APPROUVÉ, aucun cycle À CORRIGER |
| E2E | 1 run sur `telephone` : 43/43 du premier coup |
| Intégrations de `main` | 2 (106b `4742309`, 106c `dbbe378`), conflits seulement dans la documentation et le `.feature` (garder les deux ajouts) |
| Escalades | 1 (planche de Lumi, #106.36) ; questions nouvelles 106.34, 106.35 |
| Verrous | `base` une fois (08:34 → 09:15 UTC) |
| Tokens | relevés par le responsable |

## 2026-11-05 (106e)

Livraison **106e** : univers Police (Agent Max). Branche `feature/106e-celebration-police`, partie de `main` (`dbbe378` : 106a, 106b, 106c mergées). Session `session_015z4jmME4gT4h3Qu6mRPUgM`. Branche de base : `main`.
106d (Princesses) est en cours sur les mêmes fichiers : modèle, scénarios et planche d'abord ; catalogue et scène câblés sur la branche après le merge de 106d et l'intégration de `main`.

- 08:20 UTC : démarrage. Cadrage de #106 déjà validé (« 106 reco tout », 106.28 « cacher », 106.31, 106.34 A / 106.35 oui). Musique « grande victoire » (106.27 fermé). Nom vérifié : « Agent Max » partout (`univers.ts`, glossaire, `AgentMax.tsx`) ; « Agente Mila » ne reste que dans le corps de l'issue (déjà noté dans le modèle) et dans le scénario de #96 qui vérifie son absence.
- Avancement publié sur #106 (commentaire 6653230991).
- 08:21 UTC : modèle 106e (`domain-modeler`) lancé. Worktree local `wip/106e` (base : `origin/feature/106d-celebration-princesses`, où Sports et Danse sont déjà sur `commun/`), jamais poussé, pour le domaine, la scène et la planche pendant l'attente du merge de 106d ; RED du catalogue Police lancé dedans.
- 08:24 UTC : modèle 106e `d19be47` : entrée `police` ; libellés « le chef d'orchestre », « le tour en trottinette », « la danse de la victoire » (106.26) ; « les confettis du commissariat » (106.24) ; trois étoiles à cinq branches dans la maquette (casquette, insigne, plateau de la trottinette) → écusson sans étoile et plateau uni (106.34 A) ; chiot relu : rien de triste. Questions nouvelles : 106.38 (durée de la maquette 8,5 à 10,2 s), 106.39 (étoiles du dessin fixe `AgentMax.tsx` de #96, hors #106).
- 08:25 UTC : scénarios 106e (`po-acceptance`) lancés.
- Worktree : RED `179a3fe` vérifié (4 erreurs de typage, toutes sur `police` ; l'univers « pas encore livré » du test de la fin devient `pompier`, pour ne pas croiser 106d). GREEN, scène et planche (`implementer`) lancés, durée selon la reco A de 106.38.
- 08:28 UTC : CADRAGE PRÊT publié (commentaire 6653348809), RELIS envoyé au responsable. Questions nouvelles : 106.38, 106.39.
- Worktree (`wip/106e`, jamais poussé) : GREEN `edf66ad` (entrée `police`, `CELEBRANTS`) ; refactor `64980ed` (confettis de scène dans `commun/`, rendu de Sports inchangé) ; scène `deacf54` (`src/univers/celebrations/police/`, ids `police-`, chargée à la demande, 46,6 kB, précachée) ; refactor `94febf0` (`commun/trait.ts`) ; planche `9de2011`. `deno test` : 2881 verts ; `tsc` et build OK. Durée selon la reco A de 106.38 : maquette resserrée à 4,75 à 5,2 s, accélération 1,6 à 1,7.
- 08:43 UTC : planche relue par l'orchestrateur contre la règle absolue (étincelles agrandies : quatre branches) : rien à signaler. Reportée sur la branche (`0e93603`). ESCALADE publiée (commentaire 6653634376, question 106.40, validation de la planche), RELIS envoyé.
- Revue intermédiaire (delta du worktree, `64dbaaa..9de2011`) lancée.
- 08:47 UTC : revue intermédiaire (delta du worktree `64dbaaa..9de2011`) : **APPROUVÉ**, aucun bloquant. Non bloquants : exports et champ `variante` inutiles dans `police/poses.ts` (corrigés, `ddc8123`) ; moteur de Max proche de celui de Léo (jambe, marche) à mettre dans `commun/` plus tard, comme pour Danse et Animaux ; steps à écrire ; correctif de `AgentMax.tsx` (106.39) avant la mise en ligne. Dernier commit relu : `9de2011`.
- 08:49 UTC : modèle et scénarios reportés dans le worktree ; steps E2E 106e écrits (`5830325`, worktree) : `bddgen` sans étape manquante, `tsc` vert, aucun scénario lancé (verrou `base` chez 106d). Une ligne de `parcours.steps.ts` : « Enquête résolue ! » ajouté au lookahead du step générique « Léa lit », comme le prévoit son commentaire.
- Attente : merge de 106d, réponses du PO (106.38 à 106.40).
- 09:52 UTC : réponse du PO (annonce [Responsable] sur #106, commentaire 6654943666, vérifiée) : « merge 106d OK, 106e reco tout, 106.37 garder, 155.1 oui ». 106.38 A (durée resserrée, déjà appliquée dans la scène), 106.39 A (correctif du dessin fixe = issue #158, hors de 106e), 106.40 planche validée (`0e93603`). Réponses reportées dans le modèle. Câblage dès le merge de 106d (PR #157, verrou `merge` chez 106d).
- 10:00 UTC : 106d mergée (`c744821`). `main` intégrée (`82ed727`) : conflits de documentation résolus en gardant les deux ajouts (modèle reconstruit : `main` + section 106e ; scénarios et acceptance par `po-acceptance` : 106d = R10, **106e = R11**, Plans « pas encore livré » et `@hors-106a` réduits à Pompiers).
- Report du worktree sur la branche : RED `0f58ca3` (conflit résolu par `test-writer`, `princesse` gardé ; échec vérifié, 4 erreurs sur `police`), GREEN `682594f`, refactors `97462ca` et `c32fe23`, scène `de591d5`, `f874f32`, plus `8523887` (la scène des Princesses utilise aussi `commun/trait.ts`) par `implementer` ; steps `7006ddc` (conflits avec les steps de Lumi résolus par `e2e-tester`). `deno test` : 2883 verts ; lint, format, `tsc`, build OK ; `bddgen` sans étape manquante.
- 10:10 UTC : review de la branche (`origin/main...0757ff4`) : **APPROUVÉ**, aucun bloquant. Non bloquants traités : `acceptance.md` aligné (106.38 à 106.40 tranchées, `1fa2f31`) ; steps : commentaire du tirage à jour et parole de fin attendue avec `toHaveText` pour les cinq univers. Gardé : la planche `106e-agent-max-ecusson.png` montre l'étoile de la maquette à côté de l'écusson, comme comparaison validée par le PO (jamais montrée à l'enfant).
- VERROU base demandé (commentaire 6655143697) ; en file derrière #155 (run d'environ 50 min depuis 09:57 UTC, annonce du responsable 6655151738).
- 10:48 UTC : VERROU base accordé (annonce [Responsable] 6656057787, tableau de #64 vérifié). Sonde OK (3 × 200, 0,46 à 0,71 s).
- E2E `telephone`, 1 worker, head `6a5b0c0` : `@livraison-106e` **7/7** (2,8 min) ; `@issue-106` hors 106e et `@hors-106a` **42/42** (Sports, Danse, Animaux, Princesses). Le premier lancement du second run a été cassé par l'environnement (serveur Vite arrêté par un `pkill` de l'`e2e-tester` pendant le run : `ERR_CONNECTION_REFUSED`) ; les 17 cas touchés rejoués seuls : verts (8,5 min). Aucun step modifié.
- 11:25 UTC : LIBÈRE base (commentaire 6656726855).

## Mesures (106e)

| Mesure | Valeur |
|---|---|
| Durée | 2026-11-05 08:20 UTC → environ 11:35 UTC (PRÊTE À MERGER) |
| Attente | réponses du PO (#106.38 à #106.40) et merge de 106d : 08:50 → 10:00 UTC, sans travail en attente (domaine, scène, planche et steps prêts dans le worktree) ; VERROU base : environ 45 min (derrière #155) |
| Cycles TDD | 1 comportement (entrée `police`, RED puis GREEN) |
| Review | 1 revue intermédiaire (worktree, APPROUVÉ), 1 review de la branche (APPROUVÉ) ; non bloquants traités |
| E2E | 2 runs sur `telephone` (7/7 ; 42/42 dont 17 rejoués après un incident d'environnement), aucun KO applicatif |
| Intégrations de `main` | 1 (`c744821`, avec 106d) : 4 fichiers de documentation et de scénarios en conflit (attendus ; règle 106e renumérotée R11), puis conflits de report dans `celebrations-des-univers.ts`, son test, `SceneDeCelebration.tsx` et les steps (gardés des deux côtés) |
| Escalades | 1 (planche d'Agent Max, #106.40) ; 2 questions au cadrage (#106.38, #106.39) |
| Verrous | base (10:48 → 11:25 UTC) |
| Méthode | comme 106c : worktree local basé sur la branche de 106d (où Sports et Danse étaient déjà sur `commun/`), reporté par cherry-pick après le merge. Leçon : le report a coûté 4 délégations de résolution de conflits (test, code, steps, scénarios) ; un `pkill -f "playwright test"` pendant un run tue aussi le serveur du run suivant |
| Tokens | relevés par le responsable |

## Livraison 106f : Pompiers (Capitaine Sam)

Équipe lancée le 2026-11-05 (« graphe 106f »), session `session_015z4jmNHAVw9mZYSfXRtpJx`, branche `feature/106f-celebration-pompiers` partie de `main` (`c744821`). Particularité : pas de maquette ; la maquette et la planche sont dessinées d'abord et validées par le PO avant le câblage. Le câblage attend le merge de 106e (mêmes fichiers).

- 10:15 UTC : démarrage, lecture du modèle, des maquettes (méthode d'Agent Max : corps et moteur de Coach Léo) et de la livraison 106e. Contournement Chromium (`pw/` dans le scratchpad) en place.
- Écart signalé : `src/univers/apparences.ts` (cité par le brief) n'existe pas ; le nom « Capitaine Sam, le pompier courageux » est le même dans `univers.ts`, `CapitaineSam.tsx` et `PersonnageGuide.tsx`. Capitaine Sam garde son dessin fixe d'avant la refonte (#96) : question 106.43.
- Modèle (section « Livraison 106f ») et 5 scénarios `@livraison-106f` écrits par l'orchestrateur, sur le gabarit de 106d (aucun concept nouveau : entrée de catalogue, libellés, pétales de la caserne, catalogue exhaustif). Questions 106.41 à 106.43.
- 11:15 UTC : maquette `docs/maquettes/capitaine-sam-pompiers.html` (dérivée d'Agent Max : corps et moteur de Coach Léo ; scènes de 5,2 à 5,3 s, cri vers 4,4 s) et planche `106f-capitaine-sam-{moments,clair,sombre,tetes}.png`. Relue par l'orchestrateur contre la règle absolue : ni flamme, ni fumée, ni sirène, ni étoile à cinq branches ; point soumis au PO : fronton rouge triangulaire de la caserne à 80 px. CADRAGE PRÊT.
- 11:24 UTC : réponse du PO « 106f reco tout » ([annonce du responsable](https://github.com/SBA-dev/github-move/issues/106#issuecomment-6656757030)) : 106.41 noms retenus, 106.42 maquette et planche validées, 106.43 A (dessin fixe : issue #161). Reportées dans le modèle et le README des maquettes. Attente : merge de 106e avant le câblage.
- 11:50 UTC : 106e mergée (PR #160, `8f976fa`). `main` intégrée : conflits de documentation et de scénarios résolus en gardant les deux ajouts (sections 106e puis 106f).
- TDD bloc « Motivation, célébration Pompiers » : RED `0c2727e` (4 erreurs de typage, toutes sur `pompier` ; test « univers pas encore livré » remplacé dans le RED, leçon de 106d appliquée), GREEN `bfb42aa`, refactor `641c06d` (catalogue exhaustif sur `CleUnivers`, `celebrationDe` rend toujours une célébration, `estUniversCelebre` supprimé). `deno test` 2891 verts.
- Câblage : `638f5ac` (`anglesVers`, `brasVers` dans `commun/atteindre.ts`), `2502f5a` (scène de Capitaine Sam, `src/univers/celebrations/pompiers/`, 45,28 kB, 14,92 kB gzip, chargée à la demande). Captures des états finaux relues par l'orchestrateur contre la planche validée et la règle absolue : conformes.
- 12:30 UTC : review de la branche (`origin/main...2502f5a`) : **APPROUVÉ**, aucun bloquant. Non bloquants traités : instants d'ouverture des fleurs en constantes, plus aucun rejeu avant la première image (`43b0acd`) ; durée renvoyée à `DUREE_DE_LA_CELEBRATION_S` (`016cd2f`) ; mèche et ombre de contact invisibles retirées (`2977175`) ; intention du catalogue exhaustif (`f531eaf`). Image fixe identique à l'octet, scène animée identique hors bruit de rastérisation. Renvoyé à 106h : jambes et tête de Sam proches de celles de la police, à mettre dans `commun/`.
- Steps E2E `dc6b90e` (`bddgen` sans step manquant ni ambigu). Revue delta `2502f5a..f531eaf` : **APPROUVÉ**. Non bloquants des steps traités (commentaire de `RANG_DU_TIRAGE`, univers lu seulement pour « l'arc-en-ciel »). Non bloquant noté : aucun test ne vérifie que les instants figés des fleurs suivent les poses.
- VERROU base demandé (commentaire 6657537384) ; en file derrière #161.
