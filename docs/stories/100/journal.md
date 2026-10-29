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
- Domaine, non-bloquants de la revue du bloc C : test propre de `libelleCourtDe` `6683b9a` ; titre et lecture à voix haute de « Mes défis relevés » RED `011727d`, GREEN `cd3b314`.
- Câblage serveur :
  - migration `20261029100000_defis_termines.sql` (`cafad8e`). Revue : À CORRIGER (`security definer` à aligner sur #28 et la décision 0016 ; leçons du défi absentes de la table). Fix `eb90be2` (`security invoker`) ; choix de l'orchestrateur : on ne garde pas les leçons, par minimisation (doc `7bdee5f`, décision 0038 amendée).
  - adaptateur `DefisTerminesSupabase` et parseur `lireLeDefiTermine` : RED `b8a6d5a`, GREEN `8ae2a5a` ; Edge Function `terminer-le-defi` `2af7355` ; erreurs du défi en 422 et lecture groupée des étoiles : RED `dccfb40`, GREEN `ae5f885`.
  - Migration appliquée à `savanturier-dev` et `terminer-le-defi` déployée (verrou base) ; `LIBÈRE base` publié, comme le demandait l'annonce du responsable.
- Export du profil (#14) pas encore livré (`@wip`) : le scénario 8.6 attendra #14 (`@depend-de-14`), contrat d'export noté dans la migration comme #28.
- Câblage front : partie 1 (`4e2fc29`, `394e8a6`, `5aab74f` : lecture des défis relevés, repère sur « Mon parcours », annonce en fin de séance) ; partie 2 (`fd1ba6b` refactor partagé avec la révision, `94616e9` séance et fin du défi, envoi différé, `f064407` « Mes défis relevés ») ; écran `defi` dans le domaine Famille (RED `54ad3ca`, GREEN `e298948`).
- Scénarios ajustés (`8457ab2`) : 8.6 `@depend-de-14` ; `features/16-…:122` « Nouveau jeu » (décision 100.4).
- Étape 4, review finale, cycle 1 : À CORRIGER, bloquant : un défi relevé pouvait être perdu (envoyé avant la séance qui l'ouvre → 422 traité comme définitif). Corrections : RED `9409c82`, `91f6377` (`phraseDeFinAvecLeDefi` et `nomDuDefi` dans le domaine, lecture des défis relevés sous RLS, confettis à la première fois seulement), fix `574ef6f` (le défi attend les séances et tests de départ dont il dépend, et reste gardé sinon). `terminer-le-defi` redéployée (verrou base 22:15, rendu).
- Review finale, cycle 2 (`e298948..574ef6f`) : **APPROUVÉ**.
- Dettes consignées : magasins IndexedDB « gardés sur l'appareil » copiés (4e copie) ; défis gardés non relus après rechargement hors ligne (un défi relevé hors ligne s'affiche « ouvert » après relance, jusqu'à la synchronisation) ; un défi attend aussi les séances gardées des autres enfants du parent ; le correctif `574ef6f` n'a pas de test (pas de tests unitaires du front ; cas à couvrir en E2E) ; mapping ligne → `DefiReleve` écrit deux fois (front et adaptateur).
- Étape 5 (E2E, `telephone`, périmètre `@issue-100` + scénario modifié de #16) lancée.
- Étape 5, E2E sur `telephone`, périmètre de la story (décisions du PO du 28/10) : run 1, 34/36 (KO 4.1 sous-titre « Mathématiques » ; KO 5.3 aucun bouton pour rejouer un défi relevé). Corrections `5c77409` : `libelleCourtDe` ; le repère relevé garde « ✓ Défi relevé » et propose aussi « Relever le défi » (arbitrage de l'orchestrateur : texte déjà validé, 100.9 rejouable ; libellé à confirmer par le PO). Revue delta (steps `aaa3265` + `5c77409`) : APPROUVÉ.
- Redémarrage du conteneur pendant la relance ; relancée depuis la branche distante (rien de perdu).
- Run 2 : **tous les scénarios `@issue-100` verts** (8.6 `@depend-de-14` exclu) et le scénario modifié de #16 vert. Un KO de #16 hors périmètre (« L'avancement est complet quand la dernière question est réussie », délai de 30 s dans `classer-ordre-trous.steps.ts`), déjà diagnostiqué comme lenteur le 29/10 (#64, 6502873086) et corrigé par #136 ; le code de #100 ne touche pas cet écran. Step allégé `83941e0`, `@wip` retiré `a308a4f`.

## Mesures

| Mesure | Valeur |
|---|---|
| Durée, du lancement au merge | lancement 2026-10-29 14:13 UTC ; PR prête le 2026-10-30 (merge : à compléter) |
| Temps passé à attendre | PO : environ 5 h 45 (CADRAGE PRÊT 14:30 → validation 20:14) ; verrou `base` : 0 (accordé en 7 min, puis immédiatement au redéploiement) ; `main` : aucune attente |
| Tokens et coût | relevés par le responsable |
| Cycles TDD | 13 comportements (24 commits RED/GREEN), plus 9 cycles de correction issus des revues |
| Cycles de review À CORRIGER | revue delta A : 1 ; B : 2 (sécurité : classe prise dans l'envoi, puis comparaison par référence) ; C : 0 ; migration : 1 ; review finale : 1 (défi relevé perdu) ; delta E2E : 0 |
| Cycles E2E KO | 1 (2 bugs applicatifs : 4.1, 5.3) ; 1 KO hors périmètre (#16, lenteur connue) |
| Intégrations de `main` | 0 (`main` immobile à `439d4a2`), aucun conflit ; conflits prévus avec #101 dans 3 fichiers de fin de séance (voir la PR) |
| Régression sur `main` après le merge | à compléter |
