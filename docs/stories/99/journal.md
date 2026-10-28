# Journal de la story #99 : « Mon parcours » devient une carte au trésor

Équipe lancée par le responsable des équipes (vague 1, issue de coordination #64).
Session : session_015z4jmMCs1SunLzMdgNivMt. Branche : `feature/99-parcours-carte-au-tresor`, partie de `main` `c477f3b`.
Branche de base : `main`. Décision réservée : 0036.

## Étape 0 : préparation (2026-10-28 19:20 UTC)

- Issue #99 lue (aucun commentaire). Dépendances mergées : #96 (`2896d8e`), #97 (`c477f3b`).
- Story voisine : #98 (`src/seance/exercices/`), on n'y touche pas. Périmètre : `src/parcours/`.
- Conflits de langage relevés dès la lecture de l'issue, à poser au PO (on ne tranche pas) :
  - « carte », « chemin » et « étape » : synonymes interdits de Parcours et de Place (glossaire, Décision n°34) ;
  - « verrouillée (cadenas) » : la leçon verrouillée est abandonnée depuis #25 (Décision n°33, réponse 25.1).

## Étape 1 : modèle de domaine (19:25 UTC)

- `domain-modeler` (`adff80f`) : Apprentissage pour les règles, Motivation pour le personnage guide (composants de #96 réutilisés). Une seule fonction pure nouvelle, `avanceeDansLeParcours(prochaineLeconConnue, parcours)` ; « prochaine leçon connue » gardée en mémoire dans `Application.tsx`, jamais enregistrée. Pas d'agrégat, de migration ni d'Edge Function. Termes à valider : Avancée dans le parcours, Prochaine leçon connue. Questions #99.1 à #99.15.

## Étape 2 : critères d'acceptance (19:40 UTC)

- `po-acceptance` (`b9381e6`) : `features/99-dessin-du-parcours.feature`, 5 règles, 24 scénarios (14 `@a-valider`). Aucun scénario existant modifié ; la capture `@visuel` `mon-parcours` de #96 changera de sens (#99.17). Questions #99.16 à #99.22.
- `CADRAGE PRÊT` publié sur #99. Attente de la validation du PO par le responsable : pas de TDD avant.

## Réponses du PO et reprise du cadrage (21:40 UTC)

- Réponses du PO publiées sur #99 (commentaire 6481296784), confirmées par le responsable (message de 21:38) : « 99'reco sauf 99.1 b 99.6 b », puis « Par section du programme ».
- `domain-modeler` (`428d26d`) : concept proposé « Partie du parcours » (fonctions pures `partiesDuParcours`, `partieAOuvrir`). Mesure sur `app/bibliotheque.json` : un découpage par section donne 245 parties de leçons consécutives, dont 93 % d'une seule leçon. Le choix du PO est donc à reconfirmer (#99.25) avant de revoir les scénarios.
- Conflit du coffre (99.12) avec la règle 98.6 de #98, signalé au PO (#99.31).
- `CADRAGE PRÊT` n°2 publié avec les questions #99.23 à #99.32. Les scénarios seront revus après la réponse à #99.25, qui décide de leur forme.

## Validation n°1 levée (21:54 UTC)

- Annonce [Responsable] sur #99 (commentaire 6481622839) : « 99# reco » pour #99.23 à #99.32. 99.25 C (un seul dessin par matière), 99.23 A (sous-titre « Ma carte au trésor »), 99.31 (fanion sur une colline fleurie à la place du coffre), « Partie du parcours » réservé pour #100.
- Report : `domain-modeler` (`c04a5a5`), `po-acceptance` (`d58c718`) : 5 règles, 25 scénarios, 0 `@a-valider`. Seuls changements : sous-titre (nouveau scénario, titre de R4 complété) et fanion. Pas de nouvelle présentation au PO, le TDD commence (consigne du responsable).

## Étape 3 : TDD (à partir de 22:05 UTC)

Bloc A — Apprentissage, `avanceeDansLeParcours` (`supabase/functions/_shared/apprentissage/domain/avancee-dans-le-parcours.ts`) :
- A1 sans prochaine leçon connue : aucune avancée (inv. 6)
- A2 prochaine leçon connue devenue réussie : avancée jusqu'à la nouvelle prochaine leçon (inv. 1, 4)
- A3 saut de plusieurs places (inv. 4)
- A4 prochaine leçon connue pas réussie, leçon plus loin réussie : aucune avancée (inv. 3, N8)
- A5 matière réussie : avancée jusqu'à la fin du parcours (inv. 5)
- A6 prochaine leçon connue qui n'est plus dans le parcours (classe changée) : aucune avancée (inv. 1)
- A7 jamais en arrière (leçon ajoutée avant) : aucune avancée (inv. 2)
- 22:10–22:45 UTC : bloc A vert en 5 cycles RED/GREEN (A1, A2, A4, A7 rouges puis verts ; A3/A5 et A6/A2 bis écrits verts, car la branche était déjà écrite pour que le type compile). 2531 tests unitaires verts. Dernier commit : `2726151`.
- Revue intermédiaire du bloc A (`mr-reviewer`, delta `24cfde3..2726151`) : **APPROUVÉ**. Non bloquants : `placeDe` renvoie un index (lire `place`), commentaire « API attendue » à retirer du test, test explicite « changement de classe » facultatif. Repris au câblage. Point de départ du delta suivant : `2726151`.

## Câblage, review, E2E (22:50 – 00:10 UTC)

- Câblage (`implementer`) : `3988707` (refactor domaine), `eb1f761` (front : dessin du parcours, personnage guide, marche, sous-titre « Ma carte au trésor », fanion, mémoire de la prochaine leçon connue dans `Application.tsx`), `8ac7083` (planche). tsc, build et unitaires verts.
- Planche publiée sur #99 (#99.33) ; validée par le PO (« #99. 33 ok », annonce [Responsable] 6482160144).
- Review complète (`mr-reviewer`, cycle 1) : **APPROUVÉ**, 8 non bloquants. Corrigés par `implementer` (`06d2604..b60f8f2` : « chemin » et « rang » retirés du code, `useCallback`, fusion du relevé tardif, `centreDeLaFin`, `placeDe`) et `test-writer` (`f4243dd`, commentaire de phase rouge). Le point 3 (fusion du relevé tardif) n'a pas de test : le front n'a pas de runner unitaire.
- E2E (`e2e-tester`, `d7248ab`) : steps dans `features/steps/dessin-du-parcours.steps.ts`, bibliothèque `e2e-99-` dans `features/support/`. Ajouts scopés `@issue-99` dans `parcours.steps.ts`, `etapes-puis-exercices.steps.ts` et `profils-enfants.steps.ts`, sans changer le sens pour les autres stories.
  - `telephone` : 26/26. `tablette` : 22/26, puis 4 timeouts relancés seuls avec `--workers=1`, OK.
  - Run final sur le dernier commit (`telephone`) : 25/26, puis 1 timeout relancé seul, OK : 26/26.
  - Un KO de donnée ponctuel au premier run (« Le son in » affiché « prochaine ») n'est pas revenu ; à surveiller.
- Capture de référence `mon-parcours` de #96 remplacée dans un commit dédié (`78c6315`, réponse 99.17), même cadre que 96.9 ; le cas `@visuel` passe.
- Environnement : le Chromium du conteneur (1243) ne correspond pas à celui attendu par Playwright 1.56.1 (1194). Runs faits avec une config temporaire `executablePath`, non commitée (pas de `playwright install`).
- Non-régression (décision du PO du 28/10) : seuls les scénarios `@issue-99`, plus le cas `@visuel` de #96 touché. La non-régression complète tourne la nuit.
