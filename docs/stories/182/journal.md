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
