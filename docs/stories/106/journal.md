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
