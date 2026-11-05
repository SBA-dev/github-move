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
