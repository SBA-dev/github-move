# Journal de la story #58 — Retirer la page de démonstration

Équipe lancée par `/graphe` (vague 1, issue de coordination #64). Session `session_01UrFnZGZrth8J7SBSgrsTuB`.
Branche `feature/58-retirer-la-page-de-demonstration`, partie de `main` `c7cabc0`. Branche de base : `main`.

## 2026-10-24

- 21:35 UTC — Démarrage. Lecture de #58 et de #64. Aucun numéro de décision réservé (prochain libre : 0021).
- 21:40 UTC — Étape 1 (domain-modeler) **sautée** : la story ne crée ni concept ni règle métier. Elle retire un écran de test
  et déplace des scénarios existants vers des écrans réels (séance, « Qui joue ? »). La porte de test des E2E est un
  choix d'outillage, pas un concept du domaine : il sera tranché à la ⛔ n°1 (question #58.1) puis consigné en décision.
- 21:32 UTC — RELIS #64 : #27 (≈ 50 scénarios, vrai profil via `profil-reel.ts` pour `@issue-27`) et #65 (vrai profil pour
  `@issue-65`, et un scénario 65.15 joué avec le profil préparé **sans compte parent**) utilisent les steps « profil enfant
  préparé ». Contrainte de transition : garder ces steps, leur branchement `@issue-25/27/65`, et la clé
  `savanturier:profil-prepare` lisible en développement.
- 21:55 UTC — Étape 2 (po-acceptance) : 27 scénarios réécrits, 7 supprimés, 5 ajoutés (`@issue-58 @a-valider`), tableau de
  correspondance dans `acceptance.md`, questions #58.1 à #58.11. Point marquant : #58.8 (la consigne d'un exercice disparaît
  après sa lecture, et aussitôt sans voix). Cause du rouge de #8 : l'étape « Léa relance Savanturier » de `voix.steps.ts`
  ouvre `/demonstration`.
- CADRAGE PRÊT publié sur #58, APPRIS sur la transition de la porte de test. Attente de la ⛔ n°1.
- 21:44 UTC — RELIS #64 : décision **0021** réservée à #58 (porte de test), à écrire seulement après le OK du PO sur #58.1. Cadrage transmis au PO.
- 21:56 UTC — ⛔ n°1 levée : « OK #58 reco partout » (annonce [Responsable] du 21:56 sur #64). 58.8 hors story (le responsable ouvre la story de correction). Décision 0021 à écrire.
- Étape 3 (TDD) : aucun comportement unitaire. La story ne touche aucun code de `domain/` ; elle retire du front et des steps. Les scénarios E2E rouges de #58 et #8 (adresse /demonstration, profil préparé ignoré dans la version publiée) exigent le code : steps d'abord (e2e-tester), puis retrait (implementer).
- 23:00 UTC — E2E (e2e-tester), steps sur écrans réels : téléphone 520/523 (stories livrées + #58), PWA 32/32.
  Les 3 rouges attendus sont ceux de `58-retirer-la-page-de-demonstration.feature` (la page est encore servie en dev) :
  ils exigent le retrait. Le scénario #8 « Une nouvelle version s'applique au lancement suivant » est vert.
  « Un profil enfant préparé ne fait jouer personne » (PWA) passe déjà : la porte est fermée en production.
  Écarts notés : (1) la voix bloquée n'est signalée qu'une fois par vie de page, sur la page de la leçon, et le message
  disparaît à l'entrée en séance → les scénarios « voix bloquée » de #7 ouvrent la séance par son adresse (dette à
  signaler) ; (2) sans voix, la dernière bonne réponse mène tout de suite à la fin de séance → `repondre` et « la question
  … est réussie » acceptent aussi l'écran de fin.
- 23:10 UTC — Câblage (implementer) : `src/demonstration/` supprimé, profil préparé déplacé dans `src/famille/profils/` sous `import.meta.env.DEV`, écran `demonstration` retiré ; décision 0021 écrite (`f017d4b`, `230de39`). 34/34 scénarios `@issue-58` verts (téléphone), tsc, build, deno test (1323), lint, fmt verts ; `dist/` sans page ni porte de test. Revue complète lancée.
- 23:20 UTC — Revue cycle 1 : À CORRIGER. Bloquants dans les steps : (1) le scénario #8 « profil préparé ne fait jouer personne » ne peut pas échouer (ouvre `/`) ; (2) « Léa n'entend rien » prend sa base trop tard (Muet, texte sans rien à dire). Non bloquants : steps assouplis à restreindre au cas sans voix, `estPageDeLEnfant` dupliquée, CSS `.reponses` morte, commentaires périmés, `networkidle`, « accueil de l'enfant » absent du glossaire.
- 23:06 UTC — RELIS #64 : #65 mergée (`main` = `2173dba`). À intégrer à la fin du cycle en cours (conflit attendu sur navigation.ts / Application.tsx : garder "medailles", retirer "demonstration" ; 65.15 doit rester vert).
- 23:20 UTC — `main` `2173dba` (#65) intégrée (`0112012`) : conflits navigation.ts / Application.tsx résolus ("medailles" gardé, "demonstration" retiré). tsc, build, deno test 1351 verts. Compatibilité avec #27 vérifiée par un merge local jetable : aucun step à corriger.
- 23:15 UTC — Corrections de revue (e2e-tester) : bloquants 1 et 2 corrigés, preuve d'échec pour chacun (porte ouverte en dev → #8 rouge ; lecture fautive injectée → 3 scénarios rouges). Téléphone 220/220 (#6, #7, #10, #12, #15, #17, #65, #58), PWA 32/32. Revue cycle 2 (delta).
- 23:25 UTC — Revue cycle 2 : APPROUVÉ. Après la revue : scénario #8 de la porte de test réécrit (« Léa ouvre Savanturier à l'adresse « /jeu » ») et « Léa commence à jouer » remise à l'identique (plus de détection de la version publiée). PWA 32/32, preuve d'échec en dev refaite, téléphone 113/113 (#6, #12, #65, #58). Commentaire périmé de #65 corrigé.
- 23:50 UTC — Non-régression complète (head `1cb2350`, `main` `2173dba`) : **673/674** sur tablette et téléphone, 3 workers,
  20,1 min. Le seul KO est le scénario `@wip` de #10 « Une nouvelle entrée pose une nouvelle question » (téléphone, tirage non
  fixé) : il passe 2/2 relancé seul avec `--workers=1`. PWA 32/32. Aucune régression liée à #58.
- PR #81 en brouillon, passée en « prête ». `PRÊTE À MERGER` publié.

## Mesures

| Mesure | Valeur |
|---|---|
| Durée | ≈ 3 h 15 (21:27 → 00:40 UTC), du lancement à `PRÊTE À MERGER` |
| Temps d'attente | ⛔ n°1 : 13 min (CADRAGE PRÊT 21:43 → OK du PO 21:56). Aucun verrou demandé |
| Cycles de review | 2 (cycle 1 À CORRIGER : 2 bloquants dans les steps ; cycle 2 APPROUVÉ en delta), puis un ajustement de steps après approbation |
| Cycles d'E2E | mise au point : 4 passages (steps initiaux, compatibilité #27, corrections de revue, retrait de la détection PWA) ; 2 non-régressions complètes (la première incomplète : 13 fichiers générés au lieu de 20) |
| Intégrations de `main` | 1 (`2173dba`, #65) : 2 conflits (`src/navigation.ts`, `src/Application.tsx`), résolus par `implementer` et relus par `mr-reviewer` |
| Vérification anticipée | merge local jetable avec `feature/27-test-de-depart` (2 conflits identiques, nos scénarios verts) |
| TDD | sans objet (aucun code de `domain/`), 1323 puis 1351 tests unitaires verts |
- 23:55 UTC — Vérification du responsable : la non-régression « 673/674 » n'avait généré que 13 fichiers (tags de mise au point) ; #18 à #22, #24 et #25 n'ont pas tourné. `PRÊTE À MERGER` suspendu, relance avec la liste complète (20 fichiers attendus).
- 00:35 UTC — Non-régression complète refaite (20 fichiers, 1118 cas) : 1116/1118 en 40,2 min, les 2 KO (#10, téléphone, tirage non fixé) passent 3/3 relancés seuls → 1118/1118. Écart avec les 1136 de #65 : −24 (7 scénarios supprimés, dont le plan à 6 exemples « titre et royaume », ×2 projets) +6 (3 scénarios de #58 ×2) = −18. PWA 32/32. `PRÊTE À MERGER` republié.
- 08:28 UTC (25/10) — RELIS #64 : merge de #58 autorisé par le PO (« merge #27 #58, 2 fois OK, OK #26 reco »). #27 merge d'abord (verrou à #27). Ensuite : intégrer `main` (conflits navigation.ts / Application.tsx : garder "test-de-depart" et "medailles", retirer "demonstration"), relecture du delta, une non-régression complète avec `@issue-27`, puis attendre « VERROU merge accordé à #58 ».
