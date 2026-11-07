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
