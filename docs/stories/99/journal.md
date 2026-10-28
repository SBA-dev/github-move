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
