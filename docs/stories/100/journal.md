# Journal de la story #100 « Défi de fin de chapitre »

Équipe lancée par le responsable des équipes (vague 1, coordination #64).
Branche : `feature/100-defi-de-fin-de-chapitre`, partie de `main` (`439d4a2`). Base : `main`.
Session : session_015z4jmMahATJuud1H1cNRHz. Décision réservée : 0038.

## 2026-10-29

- 14:20 UTC : démarrage. Lecture de l'issue #100 (réponse du PO du 25/10 : défi de fin de chapitre **et** défi de fin de matière) et des annonces [Responsable] de #64 (lancement « 100 A », #101 en `graphe:dev`).
- Étape 1 : la story introduit des concepts nouveaux (chapitre / partie du parcours, défi) → `domain-modeler`.
- 14:30 → 14:36 UTC : `domain-modeler` (`dedeaf1`). Le « chapitre » de l'issue est la **Partie du parcours** (99.24). Défi de la partie et grand défi de la matière, contexte Apprentissage (comme la séance de révision), Motivation lit sans écrire. Table `defis_termines` (verrou `base` requis), décision 0038 après validation. Questions #100.1 à #100.20.
- 14:37 → 14:55 UTC : `po-acceptance` (`6e5da4e`). 9 règles, 32 scénarios (37 cas), selon les recos. Questions #100.21 à #100.28. Note : 9 règles > 6 conseillées par `bdd-gherkin` ; le grand défi (R6) pourrait devenir une story à part.
- `CADRAGE PRÊT` publié sur #100 ; ⛔ attente de la validation du PO par une annonce [Responsable].
- 20:14 UTC : annonce [Responsable] 6507280845 sur #64 : ✅ validation n°1 levée. Relevé du PO : commentaire 6507264741 de #100. Écarts aux recos : R6 (grand défi) → story #137 ; 100.10 oui (question ratée → révision) ; 1.b (pas de défi pour la dernière partie ni pour une matière d'une seule partie).
- 20:20 → 20:27 UTC : `domain-modeler` (`317534c`) : modèle « cadrage validé », glossaire (ajouts + « Nouveau défi » → « Nouveau jeu », 100.4), context map, décision 0038. Rappel : option A = blocs de 5, un dernier bloc de 1 ou 2 leçons rattaché au précédent (texte présenté au PO).
- 20:28 → 20:45 UTC : `po-acceptance` (`84e7288`) : 8 règles, 28 scénarios, 37 cas. 100.22, `DefiInconnu`, `AucuneQuestionPourLeDefi` et « Nouveau jeu » couverts en tests unitaires.
- Étape 3 : liste ordonnée des comportements (13) reprise du modèle : partiesDuParcours, defisDeLaMatiere, etatDuDefi, defiOuvertParLaSeance, questionsPosablesDuDefi, planDuDefi, SeanceDeDefi, aEnregistrer, revaliderLeDefi, TerminerLeDefi, « Nouveau jeu », paroles du défi, defiReleveParLaSeance + « Mes défis relevés ». Blocs de revue : (A) Apprentissage calculs purs 1-6, (B) Apprentissage séance + revalidation + cas d'usage 7-10, (C) Motivation 11-13.
- 20:27 UTC : annonce du responsable : VERROU base accordé à #100 (migration `defis_termines`).
- Bloc A (Apprentissage, calculs purs), cycles TDD :
  1. `partiesDuParcours` : RED `c27c38f`, GREEN `2dc54ed`.
  2. `defisDeLaMatiere` : RED `241c096`. L'implementer conteste une assertion (comparaison de `Matiere` à une chaîne) ; arbitrage : `Defi.matiere` reste une `Matiere`, comme partout dans le domaine ; test corrigé `9f02296`, GREEN `1f94280`.
  3. `etatDuDefi` : RED `53aad6a`, GREEN `8eecba8` (doute : règle « leçon réussie » relue sur `Parcours` plutôt que via `estReussie`).
  4. `defiOuvertParLaSeance` : API fixée par l'orchestrateur sur le motif de `leconAcquiseParLaSeance` ; RED `e27296e`, GREEN `611edcf`.
  5-6. `questionsPosablesDuDefi`, `planDuDefi` : RED `903a4d7`, GREEN `86abc42` (refactor de `posables` et `melanger`). Deux branches écrites sans test (addition → calcul, dictée) : tests ajoutés `0bf7e46`, prouvés en cassant le code.
- Revue delta du bloc A (`174542c..0bf7e46`) lancée.
- Revue delta bloc A, cycle 1 : À CORRIGER, 1 bloquant (une même clé posée deux fois : boîte et calcul « 3 + 3 »). RED `fb3534a`, fix `47438ef`, refactors des non-bloquants `87a5548`, `4b65598`, `484a855`, `b30c7ec` ; modèle aligné sur le code `62a9d27`.
- Revue delta bloc A, cycle 2 (`0bf7e46..b30c7ec`) : **APPROUVÉ**. Dernier commit relu : `b30c7ec`. Non-bloquant gardé pour un refactor : le `Set` modifié dans un `filter` de `plan-du-defi.ts`.
- Bloc B (Apprentissage : séance de défi, revalidation, cas d'usage), cycles TDD :
  7. `SeanceDeDefi` : RED `0d6ad4b` ; l'implementer conteste un test (la même mauvaise réponse 3 fois donne `dejaEcartee`, mécanique commune des séances) ; arbitrage : le défi suit les règles d'une séance, test corrigé `fe3c707` ; GREEN `13528de`, refactor `97d23a1` (boucle `QuestionsEnCours` partagée avec la révision).
  8-9. `aEnregistrer`, `revaliderLeDefi` : RED `5fb66b1`, `10362ab` ; GREEN `e3b7f10`, `7af6cdb`. Trou signalé par l'implementer (réponse en trop reportée sur la question suivante) : RED `83cf4a8`, fix `66e1654` (`DefiIncoherent`, contrôles du rejeu partagés avec la révision).
  10. `TerminerLeDefi` : RED `8c9ea46`, GREEN `66afff2`, refactor `b31a964` (`reessayerSurConflit`).
- Revue delta bloc B, cycle 1 (`b30c7ec..b31a964`) : À CORRIGER, 1 bloquant de sécurité (classe du défi prise dans l'envoi de l'appareil). RED `998b29c`, fix `a36eac8`, fix `4dc0747` (`DefiDejaTermine` après la fin), refactor `809f94a`. Non-bloquant « question écartée en silence » : aucun test constructible, pas de code défensif ajouté.
- Bloc C (Motivation) : 11. « Nouveau jeu » RED `f97cf96`, GREEN `43a7e8f` (le scénario 16:122 et le step `exercices-a-choix.steps.ts:768` citent encore « Nouveau défi » : à mettre à jour à l'étape E2E, décision 100.4) ; 12. paroles du défi RED `47d5025`, GREEN `2d821d6` ; 13. défi relevé et « Mes défis relevés » RED `1217aa2`, GREEN `796b0df`, refactor `f663167` (libellé court des matières dans le catalogue, lu par `src/parcours`).
- Revue delta bloc B, cycle 2 (`2d821d6..809f94a`) : À CORRIGER, la garde de classe comparait deux `Niveau` par référence (tout défi refusé au câblage). RED `200a2b0`, fix `c9d0f06`.
- Revue delta bloc B cycle 3 + bloc C (`200a2b0..c9d0f06`, `f97cf96..f663167`) : **APPROUVÉ** pour les deux. Dernier commit relu : `c9d0f06`. Modèle aligné `81d56f7`. Non-bloquants gardés : test propre de `libelleCourtDe`, titre et lecture à voix haute de « Mes défis relevés » à faire dans le domaine au câblage, précision de la context map (Motivation conformiste sur `DefiReleve`).
- TDD : 13/13 comportements verts, 2713 tests.
