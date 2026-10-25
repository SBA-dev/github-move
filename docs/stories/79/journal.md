# Journal de la story #79 — La consigne d'un exercice reste visible pendant tout l'exercice

Équipe lancée par `/graphe` (vague 1, issue de coordination #64). Session `session_01XXugCz6tmZqvHsVrHhhMoP`.
Branche `feature/79-consigne-visible`, partie du cadrage validé `feature/lot-45-73-79-modele-et-scenarios` (`60a98ac`).
Branche de base : `main`. Aucun numéro de décision réservé (prochain libre : 0025). Aucune ressource partagée prévue.

## 2026-10-25

- 18:00 UTC — Démarrage. Lecture de #64 (décision 0023 : pas de non-régression complète par story ; mises au point
  E2E avec `--workers=2` tant que 5 équipes codent). Intégration de `main` (`5e35bea`) sans conflit, branche poussée.
- Scénarios validés par le PO au cadrage (27 scénarios, 33 cas) : `CADRAGE PRÊT` pour information seulement.
- 18:10 UTC — Étape 1 (domain-modeler) : lancée. Le cadrage signale un concept possible (durée d'affichage sans voix,
  attente de l'enfant après la dernière félicitation) qui doit vivre dans le domaine, pas dans React.
- 18:10 UTC — po-acceptance : réécriture du scénario de #7 « Le message de voix bloquée n'apparaît qu'une fois »
  (décision 79.5).
- Voisinage : le message de voix bloquée est affiché dans `src/Application.tsx` et alimenté par `src/voix/useVoix.ts`,
  fichiers que touche aussi #73. Ajouts simples ; `APPRIS` à publier sur #79 si on y touche.
- 18:20 UTC — Étape 1 faite (`659a23c`) : Voix (parole entendue, fin de la voix bloquée) et Apprentissage
  (`attenteAvantLEcranSuivant`, `consigneAffichee`). Questions #79.10 et #79.11 publiées en ESCALADE non bloquante,
  reco « oui » appliquée.
- 18:25 UTC — Scénario de #7 réécrit par po-acceptance (`a13db00`).
- TDD, cycle 1 (Voix) : RED `b77b628`, GREEN `07f68ac`. Écart : `onFinDeLaVoixBloquee` optionnelle, car
  `lecture-avec-choix-de-voix_test.ts` construit la lecture sans elle (soumis à la revue intermédiaire).
- TDD, cycle 2 (Apprentissage) : RED `bf5296c`, puis un aller-retour test-writer ⇄ implementer : la donnée du test
  « texte à trous » n'était pas une leçon valide (`fa93a6c`). GREEN `e3313d7`, mise en forme `f5622ea`.
  Tests unitaires : 1 809 verts.
- 18:40 UTC — Revue intermédiaire du bloc domaine et câblage React lancés en parallèle. `APPRIS` Voix publié pour #73.
