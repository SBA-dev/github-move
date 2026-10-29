# Journal de la story #101 : Quête du jour

Équipe lancée par le responsable des équipes (vague 1, issue de coordination #64).
Session : session_015z4jmMTUpiQCpeV3tPiLYu. Branche : `feature/101-quete-du-jour`, partie de `main` `439d4a2`.
Branche de base : `main`. Décision réservée : 0037.

## Étape 0 : préparation (2026-10-29 08:50 UTC)

- Issue #101 lue (aucun commentaire). Dépendances mergées : #99 (`c8b0ed3`), #96, #97, #98 (98a), #102 (`439d4a2`).
- Story voisine : #100 (défi de fin de chapitre), pas encore lancée. Coordination par #64 si fichiers communs.
- Constat à la lecture du glossaire : l'accueil de l'enfant a déjà une **Leçon du jour** (#29, Apprentissage), des **Tuiles du jour** (révision « À revoir », devoirs, test de départ) et un **Objectif du jour** (Motivation, 2 leçons). « mission du jour » y est un **synonyme interdit** de Leçon du jour et d'Objectif du jour. La « quête du jour » recouvre en grande partie ces concepts : à poser au PO (ne pas créer un doublon).

## Étape 1 : modèle de domaine (09:00 UTC)

- `domain-modeler` (`4a3a609`) : contexte Motivation. Option recommandée B : quête du jour **calculée, jamais enregistrée** (fonctions pures `queteDuJour`, `queteAccomplieParLaSeance` dans `motivation/domain/quete-du-jour.ts`), révision d'abord sinon la leçon du jour (inchangée). Aucun agrégat, aucune migration, aucune Edge Function : pas de verrou `base` si le PO suit B. Récompense : la fête seule. Termes `(à valider)` : Quête du jour, Quête accomplie. Questions #101.1 à #101.15 (capitale : #101.6, nature du concept).

## Étape 2 : critères d'acceptance (09:15 UTC)

- `po-acceptance` (`dd40c2d`) : `features/101-quete-du-jour.feature`, 6 règles, 37 scénarios (42 cas), 33 `@a-valider`. Aucun scénario ni step existant modifié. Questions #101.16 à #101.22.
- `CADRAGE PRÊT` publié sur #101. Attente de la validation du PO par le responsable : pas de TDD avant.

## Validation du PO (14:14 UTC)

- Annonce `[Responsable]` sur #64 (commentaire 6499060322) : réponse du PO « 101 reco », toutes les recommandations retenues (#101.4 : le parent ne voit pas les quêtes ; #101.6 B : rien d'enregistré, donc aucune ressource partagée). #101 passe en `graphe:dev`.
- `po-acceptance` (`c657de6`, `b8ce80a`, `d21be58`) : réponses reportées, scénario de 101.21 (a) ajouté, plus aucun `@a-valider`. 6 règles, 38 scénarios, 43 cas. Termes Quête du jour et Quête accomplie validés au glossaire.
- Story voisine #100 lancée à 14:13 (session à part, décision 0038), aussi dans Motivation : surveiller les fichiers communs (`motivation/domain/index.ts`, fin de séance).

## Étape 3 : TDD

Liste des comportements :
- Bloc 1, `motivation/domain/quete-du-jour.ts` : B1 sans quête si une donnée est inconnue ; B2 révision si au moins une question due ; B3 sinon la leçon du jour ; B4 aucune (parcours fini) ou sans quête (aucune leçon pour ta classe) ; B5 accomplie par une séance de révision du jour ; B6 accomplie par une séance de leçon du jour (aussi quand elle finit le parcours) ; B7 une séance de leçon n'accomplit pas une quête de révision ; B8 `queteAccomplieParLaSeance`.
- Bloc 2, `paroles-de-la-quete.ts` et exports de `@domain/motivation`.

## Étape 3 : TDD du domaine (14:30 → 16:20 UTC)

- Bloc 1, `quete-du-jour.ts` : B1 `8522e9b`, B2 `18b9049`, B3 `ef0e771`, B4 `012ca02`, B5 `1d7bcfa`, B6 `9274dd5`, B7 `ceb2ef8` + refactor `5f68c23`, B8 `43543b0` + refactor `fa61868`. Trou relevé par `implementer` après B6 (séance d'une classe d'avant avec `aucuneLeconPourTaClasse` → quête accomplie à tort) : couvert par le test B7.
- Formatage du test `3ec99e5` (fmt rouge après le RED de B8, corrigé par `test-writer`).
- Bloc 2, `paroles-de-la-quete.ts` et exports de `@domain/motivation` (ajouts en fin d'`index.ts`) : B9 `1aaaae2`, B10 `c71962a`.
- 10 comportements, 10 cycles, aucun désaccord. 2603 tests verts, lint et fmt propres, `tsc` sans erreur.
- Revue intermédiaire (mode delta `f6c982b..c71962a`) : **APPROUVÉ**, 5 non bloquants (étiquettes de commit, `petitesErreurs(0)` non protégé par le type, `LeconDuJourProposee` à nommer dans le modèle, export long d'`index.ts`). Dernier commit relu : `c71962a`.

## Câblage (16:25 → 17:10 UTC)

- `implementer` (`663fbe7` accueil, `68219ff` fin de séance et de révision) : front seulement, aucune migration. `useQuestionsDuesALAccueil` distingue désormais « inconnu » de « zéro ».
- Une composition de parole était restée dans le front sans test : ramenée dans le domaine par un cycle B11 (`4a8589c` red, `ccaef8b` green, `c9c0acf` refactor).

## Étape 4 : review (17:15 UTC)

- Cycle 1 : **À CORRIGER**, 4 bloquants : (1) la quête « d'après » attend l'envoi de la séance (phrase de fin retardée jusqu'à 5 s, fête perdue sur réseau lent) ; (2) après « Autre chose », la proposition est relue à voix haute en revenant sur l'accueil (contraire à 101.9) ; (3) fête non dite après une séance de fluence seule (101.19) ; (4) quête rendue après la pastille de série, séparée de la bulle (101.15, 101.17 : « dans la bulle »). Choix : on suit la réponse du PO (bloc collé à la bulle), pas d'escalade.
- (2) passe par un test du domaine (B12) ; (1), (3), (4) et les non bloquants 1 à 5 sont corrigés par `implementer`.
