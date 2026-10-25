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
- 18:50 UTC — Revue intermédiaire du bloc domaine (`5e35bea..f5622ea`) : **APPROUVÉ**, aucun bloquant. Non bloquants :
  (1) rendre `onFinDeLaVoixBloquee` obligatoire (test-writer complète `lecture-avec-choix-de-voix_test.ts`, puis
  implementer), à faire après le câblage ; (2) et (3) ajustements de tests ; (4) `useVoix.ts` modifié dans le commit
  de domaine (nécessaire au typecheck) ; (5) vérifié par l'orchestrateur : `LecteurSyntheseVocale` résout aussi une
  lecture interrompue par `arreter()`. Sans effet quand une parole plus récente l'interrompt (séquence périmée) ;
  cas limite restant : passage en Muet au milieu d'une félicitation, qui n'attend pas. Dette notée.
  Dernier commit relu : `f5622ea`.
- 19:00 UTC — Câblage React (implementer) : `c91e820` (message de voix bloquée), `f9d44b4` (attente avant l'écran
  suivant, factorisée dans `useQuestionFigee.ts`), `95f1a0a` (consigne affichée, « Relire la consigne », « Continuer »).
  `tsc` et build verts. Le câblage n'a pas de test unitaire (aucun hook React n'en a) : il est exigé par les E2E de #79.
- Non bloquant n°1 de la revue corrigé : `9c6ef69` (test) puis `d6fec70` (refactor), dépendance obligatoire.
- 19:05 UTC — RELIS #64 : `À SAVOIR` de #73 sur `voix.steps.ts` et `classer-ordre-trous.steps.ts`, relayé à
  l'e2e-tester (ajouts localisés seulement, `installerLeFaux` et le step « Léa voit « … » » non touchés).
- 19:30 UTC — E2E, mise au point (e2e-tester, cycle 1) : **228/228 verts** sur `telephone` (`@issue-79`, 7, 12, 16,
  17, 18, 24, 58), 12 min, `--workers=2`. Un premier lancement avait 17 KO, tous dans les steps (relire la consigne,
  fin de la voix bloquée dans le faux navigateur), aucun bug applicatif. Steps : `1d9674e`. Contournement Chromium
  (lien de la build 1194 vers la 1243, hors dépôt).
- 19:35 UTC — Périmètre 0023 lancé sur `telephone` (#10, #15, #19 à #23, #25 à #27, #65 ; #28 pas encore mergée),
  review finale lancée en parallèle.
