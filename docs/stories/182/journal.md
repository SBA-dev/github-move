# Journal de la story #182 : la voix de l'application en MP3 pré-générés (Piper, voix « tom »)

Story seule, lancée par `/feature 182` le 2026-11-07. Base : `main` (`5d690d3`). Branche de travail imposée par la session cloud : `claude/festive-volta-qa12yl` (partie de `main` à jour).

## Avant la story (2026-11-07, matin)

- Constat du PO sur Honor Magic (Chrome, Android) : effets sonores (MP3) audibles, aucune lecture à voix haute. Espace parent › Voix : « Aucune voix française trouvée sur cet appareil ». Message côté enfant : « La voix de Coach Léo est bloquée par ce navigateur » (trompeur : toute erreur de `speechSynthesis` hors `interrupted`/`canceled` donne `VoixBloquee`, `src/voix/lecteur-synthese-vocale.ts`).
- PO : « les utilisateur ne vont pas faire toutes ses actions pour avoir la voix. il faut trouver une autre solution ». Décision 0004 (MP3 neuronaux, repli navigateur) rappelée.
- PO : outil gratuit plutôt qu'Azure → Piper. Accès réseau ajouté à l'environnement : `huggingface.co`, `cdn-lfs.hf.co`, `cdn-lfs-us-1.hf.co`, `us.aws.cdn.hf.co`.
- Écoutes : `upmc` Jessica (« tu vas y arriver » mal prononcé, liaison en [s] ; quatre variantes refusées : « non ca prononce mal ») ; puis A `siwis`, B `tom`, C `upmc` Pierre. PO : « b, tom ».
- Voix retenue : `fr_FR-tom-medium` (Piper 1.x, 44,1 kHz, 1 locuteur). Licence AGPLv3 (https://git.bksp.space/Tjiho/French-tts-model-piper). Seuls les MP3 produits sont livrés, jamais le modèle.
- Volume estimé : ~4 700 textes distincts, ~126 000 caractères dans `app/bibliotheque.json`.
- Défaut annexe repéré, non traité ici : `deverrouillage-audio.ts` déverrouille au `pointerdown`, qui n'est pas une activation utilisateur pour un toucher sur Android (spec HTML : `pointerup`/`touchend`).

## Étape 0 (2026-11-07)

- Issue #182 lue (créée le jour même, sans commentaire).
- Base `main` notée pour `mr-reviewer`. Journal poussé (`0ff4d11`).

## Étape 1 (2026-11-07)

- `domain-modeler` : modèle `docs/stories/182/domain-model.md`, glossaire et context map (ajouts), commit `fa7c098`. Sous-domaine Voix, sans agrégat ni migration ; ports `RepertoireDesSons` et `LecteurDeSonsDePhrases`, calcul pur `planDeLecture`, erreurs `VoixAbsente` et `SonIllisible`. 24 questions ouvertes (182.1 à 182.24).

## Étape 2 (2026-11-07)

- `po-acceptance` : `features/182-voix-de-l-application.feature` (8 règles, 35 scénarios, `@issue-182 @wip`) et `docs/stories/182/acceptance.md`, commit `0515454`. `bddgen --tags "@issue-182"` parse sans erreur (étapes à créer). Nouvelles questions 182.25 à 182.28. 182.24 (déverrouillage Android) : vérification manuelle seulement.

## ⛔ Validation n°1 (2026-11-07)

- Présentée au PO : modèle, règles, scénarios, questions 182.1 à 182.28 avec recommandations. En attente de sa réponse.
- PO, 2026-11-07, mot pour mot : « Ok », en réponse à « Répondez « reco tout » ou corrigez par numéro ». Toutes les recommandations 182.1 à 182.28 sont retenues (182.26 : libellé « voix de l'application »). Validation n°1 accordée.

## Étape 3 : TDD, bloc A (Voix, domaine) — 2026-11-07

- Décisions du PO reportées : critères `cfa09b98` + exemple de #15 retiré `1e9875b3` (po-acceptance) ; modèle et décision 0043 `1e25d166` (domain-modeler) ; glossaire en cours.
- Comportements du bloc A : A1 clé de la phrase, A2 instants des mots, A3 plan de lecture, A4 lire un son de phrase, A5 repli `SonIllisible`, A6 `VoixAbsente`, A7 `VoixBloquee` du lecteur de sons, A8 arrêts, A9 lecture lente et `onMot`, A10 voix imposée et essai de voix.
- A1 : RED `9fa2fa2a` (échec vérifié : module absent), GREEN `60598f7b`, suite Deno verte (2955). Forme décomposée de « Écoute » vérifiée présente dans le test (signalement de l'implementer levé).
- A2 : RED `511cd2b6` (échec vérifié). GREEN en cours, en parallèle du RED de A3.
- A2 : GREEN `a016b17f`. A3 : RED `b9749b1d` (vérifié), GREEN `5dfa9fd1` (`estFrancais` extrait dans `langue.ts`). A4 : RED `66cd7bfa` (vérifié ; 4 fichiers de test existants reçoivent les 2 nouvelles dépendances neutres, sans changer d'assertion), GREEN `273f1ab7` (2969 tests Deno verts). `tsc` cassé par les dépendances requises : câblage des deux adaptateurs du navigateur demandé tout de suite (pas de faux dans le front).
- Dette notée par l'implementer de A4 : `voixImposee: false` en dur (A10), `onMot` des lectures mixtes (A9), erreurs du lecteur de sons (A5, A7).

## Étape 3 : TDD, bloc C (pipeline) — 2026-11-07, en parallèle du bloc A

- C2 table de prononciation : RED `6f4ab376` (vérifié), GREEN `50e2b68c` (pytest 1591 verts). C3 fabrication : RED en cours.
- A5 : RED `51fdfd24`, GREEN `4723d3af` (repli `SonIllisible` ; adaptateur navigateur traduit `error`/échec de `play()` en `SonIllisible`, garde `NotAllowedError` pour A7). Câblage des adaptateurs du navigateur `a7aeb2f8` (`tsc` et build verts). A6 : RED `98d93f87` (vérifié), GREEN en cours avec le message de voix absente à l'écran (182.16, rôle d'information, 182.25).
- C3 : RED `203c6d9b`, GREEN `341269c5`. C4 : RED `b06afe39`, GREEN `1d74aaca` (pytest 1614). C1 : RED `b34a4dd4` (vérifié), GREEN en cours.
- C1, constat du test-writer : la lecture des choix (« Est-ce a, b, ou c ? », mode « tout lire à voix haute ») est fabriquée à la volée avec un ordre tiré au hasard : elle relève de 182.1 A (repli sur la voix de l'appareil), pas de question nouvelle au PO. Restent à inventorier dans un comportement suivant : texte de la leçon de lecture, mots de la dictée, vers de `memoriser`, aides, `ordre` et `trous`.
- C1 : GREEN `97a77b34`. Inventaire réel : 265 leçons, 2276 phrases uniques, 72 739 caractères. Mesure Piper « tom » : ~4 s d'audio par seconde de calcul → ~75 min d'audio, ~18 min de fabrication, ~18 Mo à 32 kbit/s.
- A6, arbitrage : le GREEN cassait 11 tests de `effets-sonores_test.ts`, dont la fabrique tournait sans voix française (montage incident, devenu le cas « voix absente » avec 182.15). Correction du montage par le test-writer (`b080f64f`, `voixEnMemoire([DENISE])`, aucune assertion changée), puis GREEN `fc2f1569` et câblage du message de voix absente `5a9b31a7` (même `role="status"` que la voix bloquée). Suite Deno 2976 verte, lint, fmt, tsc, build OK.
- A7 : les deux tests passaient dès l'écriture (comportement issu d'A4/A5) : gardés comme caractérisation de R4, `4bd305a9`.
- A8 (arrêts) : RED en cours. Câblage du pipeline (adaptateur Piper, commande, licence, docs) et fabrication réelle lancés en parallèle.
- A8 : RED `79c55c16` (+ caractérisation `7a23a2f9`), GREEN `ce031444` (point unique `arreterLesVoix`). A10 : RED `6bf67557`, GREEN `9dc3bfc2`. A9 : RED `4bd55781`, GREEN `e1cb5341` + adaptateur `12dcd84c` ; l'implementer a contesté un test (position 4 au lieu de 8 pour « toi ») : contestation vérifiée, test corrigé par son auteur `145756da`. Bloc A terminé : 2990 tests Deno verts, fmt, tsc OK.
- Revue intermédiaire delta (blocs A et C, `5d690d3..145756da`) lancée. Bloc B commencé (B1 texte dit sans prénom, RED en cours).
- Revue intermédiaire delta (blocs A et C) : **À CORRIGER**, 3 bloquants : (1) l'adaptateur rejette `NotAllowedError` brut au lieu de `VoixBloquee` (le message de voix bloquée n'apparaîtrait jamais) ; (2) après un arrêt, la boucle de `lireLeTexte` passe au groupe suivant (régression sur les consignes de deux phrases, lectures entremêlées) ; (3) `jouer(effets)` et `effetsAvant` n'arrêtent pas le son de phrase. Non bloquants retenus : délai de sécurité et `webkitPreservesPitch` dans l'adaptateur, un élément par message, constantes partagées du pipeline, extraction de l'exécution du plan hors de `lecture-a-voix-haute.ts`. Cycle 1 de correction : (1) à l'implementer seul (adaptateur, couvert par E2E), (2) et (3) par test-writer puis implementer.
- Cycle 1 de correction : (1) `d9c78529` (adaptateur : `NotAllowedError` → `VoixBloquee`, délai de sécurité, `webkitPreservesPitch` ; un élément par message) ; (2)(3) RED `bcca2ba3` (6 tests), GREEN `f9964309` (numéro de lecture, `arreterLesVoix` partout, extraction `lecture-du-plan.ts` et `surlignage.ts`). Revue delta cycle 2 lancée.
- Pipeline : `89235f01` (adaptateur Piper, commande, licence, `docs/voix.md`, `CLAUDE.md`) et `b6fdc6d8` (2271 sons, 92 min, 21,5 Mo, contrôles sans problème). 5 « phrases » de ponctuation seule (`?.`, `!.`, `.`, `?`, `:`) filtrées en Python : correction à la source demandée (A11, `texteALire`).
- Bloc B : B1 RED `42c3578a`, GREEN `662b7f20` (fonctions `…SansPrenom`, vocatif unique) ; B2 RED `941e42a5`, GREEN en cours.
- Extrait de six sons réels envoyé au PO pour écoute.
- A11 : RED `534fdd4a` (exemples réels : « Comment lire « Oh non ! » ? », « … = 3 + 3 + 2 »…), GREEN `7686d687` (ponctuation isolée rattachée à la phrase voisine). C1b : RED `9ecc8b4b`, GREEN `49f70d0c` (inventaire réel : 2362 phrases, 75 177 caractères, 429 paroles communes). B2 : quête accomplie annoncée par l'implementer sans être écrite : RED `4a9a1b7d` (libellé « caractérisation » erroné : il était rouge), GREEN `a437e22e`. A12 (texte dit, tout ou rien) : RED `7894d127`, GREEN en cours ; surlignage quand la voix dit le texte dit : non décidé, à présenter au PO.
- Revue delta cycle 2 : les 3 bloquants du cycle 1 sont levés ; **nouveau bloquant** : après un arrêt, un son qui échoue en retard (`AbortError` puis délai de sécurité → `SonIllisible`) se replie sur la voix de l'appareil (lecture après l'arrêt, même en Muet) ; cause double : `nettoyer()` de l'adaptateur efface la fonction de fin d'un son plus récent, et `lireLePlan` se replie sans vérifier l'interruption. Cycle 2 de correction : RED en cours, puis implementer (domaine + adaptateur). Au 3e « À CORRIGER », escalade au PO.
- Cycle 2 de correction : RED `c019665f`, fix `fae029d8` (domaine : pas de repli si la lecture est interrompue ; adaptateur : drapeau `reglee`, fin propre, délai reporté si onglet caché ou média en pause), refactor `25122690`. A12 : GREEN `9d729400`.
- **Revue delta cycle 3 : APPROUVÉ** (bloquant levé, A11 et A12 conformes ; tests rouges rejoués sur leurs commits). Non bloquants notés pour la suite : repli d'un son du texte dit sur la voix de l'appareil sans le prénom (mode dégradé, à acter) ; surlignage coupé quand le texte dit est lu par les sons (question au PO) ; plafond de reports du délai de sécurité ; regex en double dans `texte-a-lire.ts` ; A11 change des clés → refabriquer les sons et documenter la règle dans le modèle ; double tirage de `reglerPhrases`.
- Câblage front et service worker en cours (`08a928ff` hors ligne, `1b8d5035` mise en réserve, `455040f7` texte dit). B3 : RED `05464799` (paroles du calcul et du test de départ vers Motivation ; la révision n'a pas de texte propre), GREEN après le câblage.
- Câblage front et service worker (implementer) : `08a928ff` (cache des sons à part, réserve 20 Mo), `1b8d5035` (mise en réserve : leçon au lancement, leçon suivante en fin de séance, paroles communes au premier chargement), `455040f7` (texte dit dans les écrans, `hasardRejouable` pour la fin de séance), `eb92a1bf` (écran Voix, 182.26), `11b0d649` (déverrouillage : rien tant que `navigator.userActivation.isActive` est faux, 182.24). Amorçage du lecteur de sons `498a6768` + `dbf964ee` (le commit feat seul ne compile pas : `amorcer()` est tombé dans le refactor ; historique non réécrit). E2E non lancés : Playwright 1.56 attend Chromium 1194, le conteneur a 1243.
- Bloc B : B3 RED `05464799`, GREEN `19813968` + `758d37ec` (paroles du calcul et du test de départ dans Motivation, fichiers de `src/` supprimés) ; B4 RED `b96b84af`, GREEN `451d4f6a` + `123f7872`. Domaine : 3048 tests verts.
- Scénarios : #15 accordé à 182.26 (`31abf433`). Arbitrage : les E2E servent par défaut un répertoire des sons vide ; les scénarios de #7, #15, #96 qui décrivent la voix de l'appareil précisent que la phrase n'a pas de son de phrase (en cours, po-acceptance).
- Nouvelle fabrication des sons (paroles communes, clés changées par A11) et page d'écoute (C5) en cours.
- Scénarios : #7, #15, #96 précisent « la phrase … n'a pas de son de phrase » et « la voix de l'application est disponible » (`81e6fce9`).
- C5 page d'écoute : RED `d141bc96`, GREEN `acc17ac7` (`ecoute/` ignoré par git). Refabrication des sons `ea4c8f2d` (2377 phrases, 114 fabriqués, 8 orphelins supprimés, 95,5 min, 22,4 Mo, contrôles OK) ; filtre des phrases muettes retiré `83878a8a`.
- Fin de l'étape 3 : deno 3048, inventaire 8, pytest 1630, lint, fmt, tsc, build OK.

## Étape 4 et 5 (2026-11-07)

- Revue finale lancée (base `main`, blocs A/C déjà approuvés en cycle 3 ; Motivation, pipeline, câblage et scénarios relus en entier).
- E2E, mise au point sur `telephone`, lancée en parallèle (steps seulement ; répertoire des sons vide par défaut ; contournement Chromium 1194/1243 dans le conteneur, sans toucher au dépôt).
- **Revue finale, cycle 1 : À CORRIGER**, 1 bloquant : la fin de séance compose son texte dit dans `useDeroulementDeSeance.ts` avec `hasardRejouable`, sans test ; correction attendue : Motivation rend `{ texte, texteDit }` d'un seul tirage. RED en cours. Non bloquants confiés : docs (0043 sans vérification d'empreinte, context map, modèle, feuille de route) au domain-modeler ; service worker (registre hors chemin public, évictions), attente de `serviceWorker.ready`, ligne `CLAUDE.md` de la fabrication à l'implementer du câblage. Notés sans action : mention de `ChoixDeLaVoix` à déplacer dans `voixProposees` (petite règle dans React), `89235f01` (test écrit par l'implementer dans le même commit), poids de l'historique.
- Correction du bloquant : RED `facda7cd`, fix `4b010c31` (`parolesDeFinDeSeanceAvecTexteDit`, un seul tirage), refactor `58d47169` (`hasardRejouable` supprimé). Non bloquants : `1fa8979e`, `464cda68`, `8b8c7bbc`.
- **Revue finale, cycle 2 : APPROUVÉ.** Non bloquants restants : fin de fluence seule encore assemblée dans React (deux fonctions du domaine, sans tirage), paramètres redondants de l'appel de fin de séance, `serviceWorker.ready` jamais résolu sans service worker (appelants non bloquants).
- E2E mise au point (`telephone`) : steps `46f6f394`, `927b104a`, `@wip` retiré `171a23b1`. #182 : 36/36 OK (33 + 3 `@pwa` sur le build de production). Périmètre : #7, #15, #73, #79, #97 : 184 OK ; #96, #19, #29, #27, #28, #100, #20, #11 : 424 OK, 2 KO. Contournement Chromium 1194 → 1243 dans `/opt/pw-browsers` (conteneur seulement). Répertoire des sons non servi par défaut (`features/support/sons-de-phrases.ts`).
- KO à traiter : #8 (ancien cache encore présent après 5 s, régression probable du service worker de #182 : correction demandée, avec l'ajout des `@pwa` de #182 à `playwright.pwa.config.ts`) ; #29 « tout lire à voix haute, salutation dite une seule fois » intermittent dans les lots mélangés (OK seul 8 fois, OK dans le lot #29 complet), cause non trouvée ; #96 `@visuel` « fin-de-la-seance » KO **aussi sur `origin/main`** (capture de référence périmée, décision du PO, hors #182).
- Pendant les E2E : `be911cb4` (`@pwa` de #182 dans la config PWA) ; `e132e0e5` (régression #8 : la mise en réserve des 447 sons des paroles communes relisait et réécrivait le registre à chaque son, coût quadratique qui retardait l'activation d'une nouvelle version) ; revue delta : À CORRIGER (lot non dédoublonné, budget surcompté) → `98deea01` (dédoublonnage, tranches de 50) et pipeline `b433c02c`/`4816e79b`/`002635a5` (listes de leçons sans doublon ; paroles communes : 106 entrées) → **revue delta cycle 2 : APPROUVÉ**. Dédoublonnage du service worker sans test dédié (défense en profondeur ; la source est verrouillée par pytest). Commentaire de `public/sw.js` l. 147 à mettre à jour (tranches).
- Relais de test : `ae921c49` (réseau rétabli après chaque scénario `@pwa` de #182). Une suite PWA a tourné en même temps que la non-régression (ports et relais partagés) : la suite PWA sera rejouée seule.
- E2E : suite PWA complète seule sur `5193ee21` : **42/42** (21 tablette, 21 telephone). Non-régression complète tentée : 4593 tests, ~11 h estimées ; arrêtée (149 tests, aucun KO). Arbitrage : décision 0023 (pas de non-régression complète par story, elle tourne sur `main`) → périmètre touché par la story sur `telephone`, sur HEAD, par lots.
