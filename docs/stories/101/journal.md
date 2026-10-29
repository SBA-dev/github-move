# Journal de la story #101 : Quête du jour

Équipe lancée par le responsable des équipes (vague 1, issue de coordination #64).
Session : session_015z4jmMTUpiQCpeV3tPiLYu. Branche : `feature/101-quete-du-jour`, partie de `main` `439d4a2`.
Branche de base : `main`. Décision réservée : 0037.

## Étape 0 : préparation (2026-10-29 08:40 UTC)

- Issue #101 lue (aucun commentaire). Dépendances mergées : #99 (`c8b0ed3`), #96, #97, #98 (98a), #102 (`439d4a2`).
- Story voisine : #100 (défi de fin de chapitre), pas encore lancée. Coordination par #64 si fichiers communs.
- Constat à la lecture du glossaire : l'accueil de l'enfant a déjà une **Leçon du jour** (#29, Apprentissage), des **Tuiles du jour** (révision « À revoir », devoirs, test de départ) et un **Objectif du jour** (Motivation, 2 leçons). « mission du jour » y est un **synonyme interdit** de Leçon du jour et d'Objectif du jour. La « quête du jour » recouvre en grande partie ces concepts : à poser au PO (ne pas créer un doublon).

## Étape 1 : modèle de domaine (08:46 UTC)

- `domain-modeler` (`4a3a609`) : contexte Motivation. Option recommandée B : quête du jour **calculée, jamais enregistrée** (fonctions pures `queteDuJour`, `queteAccomplieParLaSeance` dans `motivation/domain/quete-du-jour.ts`), révision d'abord sinon la leçon du jour (inchangée). Aucun agrégat, aucune migration, aucune Edge Function : pas de verrou `base` si le PO suit B. Récompense : la fête seule. Termes `(à valider)` : Quête du jour, Quête accomplie. Questions #101.1 à #101.15 (capitale : #101.6, nature du concept).

## Étape 2 : critères d'acceptance (08:53 UTC)

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

## Étape 3 : TDD du domaine (14:18 → 14:40 UTC)

- Bloc 1, `quete-du-jour.ts` : B1 `8522e9b`, B2 `18b9049`, B3 `ef0e771`, B4 `012ca02`, B5 `1d7bcfa`, B6 `9274dd5`, B7 `ceb2ef8` + refactor `5f68c23`, B8 `43543b0` + refactor `fa61868`. Trou relevé par `implementer` après B6 (séance d'une classe d'avant avec `aucuneLeconPourTaClasse` → quête accomplie à tort) : couvert par le test B7.
- Formatage du test `3ec99e5` (fmt rouge après le RED de B8, corrigé par `test-writer`).
- Bloc 2, `paroles-de-la-quete.ts` et exports de `@domain/motivation` (ajouts en fin d'`index.ts`) : B9 `1aaaae2`, B10 `c71962a`.
- 10 comportements, 10 cycles, aucun désaccord. 2603 tests verts, lint et fmt propres, `tsc` sans erreur.
- Revue intermédiaire (mode delta `f6c982b..c71962a`) : **APPROUVÉ**, 5 non bloquants (étiquettes de commit, `petitesErreurs(0)` non protégé par le type, `LeconDuJourProposee` à nommer dans le modèle, export long d'`index.ts`). Dernier commit relu : `c71962a`.

## Câblage (14:45 → 14:47 UTC)

- `implementer` (`663fbe7` accueil, `68219ff` fin de séance et de révision) : front seulement, aucune migration. `useQuestionsDuesALAccueil` distingue désormais « inconnu » de « zéro ».
- Une composition de parole était restée dans le front sans test : ramenée dans le domaine par un cycle B11 (`4a8589c` red, `ccaef8b` green, `c9c0acf` refactor).

## Étape 4 : review (14:50 → 14:57 UTC)

- Cycle 1 : **À CORRIGER**, 4 bloquants : (1) la quête « d'après » attend l'envoi de la séance (phrase de fin retardée jusqu'à 5 s, fête perdue sur réseau lent) ; (2) après « Autre chose », la proposition est relue à voix haute en revenant sur l'accueil (contraire à 101.9) ; (3) fête non dite après une séance de fluence seule (101.19) ; (4) quête rendue après la pastille de série, séparée de la bulle (101.15, 101.17 : « dans la bulle »). Choix : on suit la réponse du PO (bloc collé à la bulle), pas d'escalade.
- (2) passe par un test du domaine (B12) ; (1), (3), (4) et les non bloquants 1 à 5 sont corrigés par `implementer`.

- Cycle 2 (delta `c9c0acf..e776884`) : **APPROUVÉ**. B12 en TDD (`a00d090` red, `6fc9385` green), corrections `0cd2b53` et `e776884`. Non bloquants laissés en dette : relectures en double, traduction `leconProposee` dans le front sans test, rangement de `AnnonceDeLaQueteAccomplie` et `useQueteAccomplieParLaSeance` dans `src/accueil/`, lecture des faits du jour « d'après » encore côté serveur (fête perdue au-delà de 5 s sur réseau très lent). Espace en trop dans `EcranDeFin.tsx:11`, à nettoyer après les E2E.

## Étape 5 : E2E (14:57 → 15:33 UTC)

- `e2e-tester` (`5813fee`) : steps de #101 ; ajouts du tag `@issue-101` dans des conditions existantes, sans changer leur sens. Environnement : délai de 30 s insuffisant contre `savanturier-dev` derrière le proxy (même un scénario de #29 dure 28,5 s) : runs avec `--timeout=120000` en ligne de commande ; navigateur `/opt/pw-browsers/chromium-1243/chrome-linux64/chrome` par config temporaire non commitée.
- Cycle 1 : **41/43** sur `telephone` (9,8 min). 2 KO, même cause : données de départ incohérentes avec #28 (séance « avec 1 étoile » jouée avec erreurs → questions dues le lendemain → la révision passe d'abord, comme le veut 101.1). Plus un scénario vert qui lisait la tablette au lieu du téléphone de Marie.
- `po-acceptance` (`5ca5aff`) : « avec 3 étoiles » dans les deux scénarios, étape « … sur le téléphone de Marie » ; intention inchangée (section « Corrections de données après E2E » d'`acceptance.md`).
- Cycle 2 : **43/43** sur `telephone` (`a375796`) : 39 au run complet, puis les 4 `@acces` relancés seuls (le serveur de dev local ne répondait plus en fin de run, `ERR_CONNECTION_REFUSED`). Étape « … sur le téléphone de Marie » ; pour les scénarios `@acces`, la séance de Léa jouée par l'interface est recopiée en base (clé service_role, steps seulement) car le serveur ne connaît pas les leçons de test. `@wip` retiré.
- Nettoyage de l'import d'`EcranDeFin.tsx` (`b60ab5e`). Relecture delta `e776884..b60ab5e` : **APPROUVÉ** (clé service_role confinée aux steps, données supprimées en cascade avec le profil, tags ajoutés sans changer le sens des steps des autres stories). Non bloquant : séance préparée datée de 10 h du jour.
- Non-régression avant la PR : seulement les scénarios de la story (décision du PO du 28/10). `main` n'a pas bougé depuis `439d4a2`.

Note : les heures des titres de ce journal ont été corrigées le 2026-10-29 à 15:40 d'après les dates des commits ; les premières notes portaient des heures estimées fausses.

## Mesures (docs/graphe/nombre-d-equipes.md)

| Mesure | Valeur |
|---|---|
| Durée totale (lancement → PR en brouillon) | 08:40 → 15:40 UTC, environ 7 h |
| dont attente de la validation du PO | 08:53 → 14:14, environ 5 h 20 |
| dont travail actif | environ 1 h 40 (cadrage 13 min, TDD 22 min, câblage et review 15 min, E2E 36 min) |
| Comportements TDD | 12 (B1 à B12), 12 cycles, 0 désaccord test-writer / implementer |
| Cycles de review | revue intermédiaire 1 (APPROUVÉ) ; review complète 2 (À CORRIGER puis APPROUVÉ) ; 1 relecture delta après E2E (APPROUVÉ) |
| Cycles E2E | 2 (41/43, puis 43/43) |
| Intégrations de `main` | 0 (`main` inchangé), 0 conflit |
| Verrous | aucun |
| Escalades | aucune |
