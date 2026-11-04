# Journal de la story #130 : le petit train de l'univers (98a-train)

Équipe lancée par `/graphe` (« graphe 130 dès qu'une place se libère »), vague 1, issue de coordination #64.
Branche `feature/130-petit-train`, partie de `main` (`8a16227`, merge de #131). Base : `main`.
Session : session_015z4jmP7V7FhEFUJUzB9Zaf. Décision : aucune réservée (prochain libre 0041, à demander par DÉCISION).
Équipes voisines : #129 (parchemin, `memoriser` : déroulement du texte ; #130 : ordre des vers) et #141 (fin de séance), toutes deux en cours de merge.

## 2026-11-04

- 11:20 UTC : démarrage. Lecture de #130 (aucun commentaire), de #64 (tableau du 04/11 11:12), du cadrage de #98 (pistes du petit train, 98.8, 98.21, 98.26, 98.28, 98.29, 98.31).
- Étape 1 (domaine) : déléguée à `domain-modeler`, modèle court propre à #130.
- 11:45 UTC : modèle de domaine écrit (`f948a9b`). Apprentissage, affichage seulement ; aucun fait manquant. 5 invariants propres, questions #130.1 à #130.9. ordre et memoriser jamais en révision, défi ni test de départ. Fichiers communs avec #129 : ExerciceDeMemorisation.tsx, styles.css, exercices-comme-des-jeux.steps.ts, classer-ordre-trous.steps.ts.
- Étape 2 (critères) : déléguée à `po-acceptance`.
- 12:05 UTC : critères écrits (`5253846`) : 43 scénarios (13 plans, 89 cas par projet), 6 `@a-valider` ; questions #130.10 à #130.13. Séances complètes l.138 et l.435 : délais longs à ajouter pour `@issue-130`.
- 12:08 UTC : CADRAGE PRÊT publié sur #130 ; attente de la validation du PO par le responsable.
- 11:30 UTC : intégration de `main` après le merge de #129 (`db200e2`), sans conflit. #129 ne touche que la carte de la poésie (parchemin) ; l'entraînement (ordre des vers) est inchangé : le cadrage tient.
- 11:32 UTC : intégration de `main` après le merge de #141 (`573659e`).
- 20:37 UTC : réponse du PO « 130 reco tout » (annonces [Responsable] 6641496239 sur #130 et 20:36 sur #64, vérifiées) : les 13 recos s'appliquent. Validation n°1 levée, `graphe:dev`. `main` déjà intégrée (`573659e`).
- En parallèle : `po-acceptance` reporte les réponses et retire les `@a-valider` ; `implementer`, en rôle d'illustrateur, prépare la planche `ordre-petit-train` (12 dessins, 5 colonnes) dans un worktree à part.
- Liste des comportements unitaires : **aucun**, comme 98a, #127 et #131. Le domaine ne change pas (place suivante, placement refusé, dernière étiquette, étiquette qui brille) ; le dessin est choisi par la clé d'univers. Le RED passe par les étapes E2E de `@issue-130`. Une règle qui apparaîtrait dans React pendant le câblage serait remontée au domaine.
- 21:00 UTC : `po-acceptance` : réponses reportées, `@a-valider` retirés (`b88a259`).
- 21:05 UTC : planche rendue par l'illustrateur (worktree, `90c69a6`). Relue par l'orchestrateur contre la règle absolue : l'écusson Police en disque à anneaux se lisait comme une **cible de tir** → renvoyé, remplacé par le blason de la boîte Police de #131 (`485c620`), relu à 1x et 0,5x : rien à signaler. Intégrée en `8d246fa`. 12 sources SVG, contrastes du texte 15,8 à 16,4:1. Choix P2 à P7 proposés au PO.
- En parallèle : `e2e-tester` écrit les étapes de `@issue-130` (RED), sans exécution (verrou `base` à demander).
- 21:20 UTC : `e2e-tester` : étapes de `@issue-130` écrites (`b66d5ff`), `bddgen` sans étape manquante, tsc vert, pas jouées. Contrat DOM en tête de `features/steps/petit-train.steps.ts`. Steps partagés : tags ouverts à `@issue-130` seulement.
- 21:25 UTC : `VERROU base` demandé ; #140 le détient, #130 suivante.
- 21:50 UTC : câblage par `implementer` : `efb6ab3` (petit train, 12 SVG, `src/seance/exercices/petit-train/`) et `2e67b05` (#130.5 : train complet retenu jusqu'à la fin de la félicitation, 1,5 s au plus, compatible avec les étapes de #22 et #126). tsc, build, deno test (2802), lint et fmt verts. Dette signalée : règle `.places` de `styles.css` devenue morte pour l'ordre.
- 22:00 UTC : review complète, **À CORRIGER (cycle 1)**. Bloquant : le plafond de 1,5 s de `useTrainCompletRetenu` contredit #130.5 = A et l'invariant 7 (fondé sur la parole, pas sur un minuteur). Il n'aurait servi qu'à faire passer les étapes de #22. Le plafond venait d'une consigne erronée de l'orchestrateur (97.23 ne s'applique pas : garder le train ne retient pas l'enfant). Correction : `implementer` retire le minuteur et le CSS mort (`.places`, l.417 et l.473) ; ensuite `e2e-tester` adapte le **corps** des étapes de #22 et #126 qui attendent les mots cachés (finir la lecture), sans changer leurs phrases (prévu par `acceptance.md`).
- 21:00 UTC : VERROU base accordé à #130 (annonce [Responsable] de 20:59 sur #64, tableau vérifié). Mise au point E2E lancée par `e2e-tester` (`telephone`, 1 worker).
- 21:41 UTC : planche validée par le PO (« planche 130 OK reco P1 à P7 », annonce [Responsable] 6642824855 sur #130, vérifiée), au commit `b6f2800`. Condition 98.31 remplie. Les dessins câblés sont ceux de la planche.
- 22:35 UTC : E2E de mise au point, `@issue-130` sur `telephone` : 76/89, puis 85/89 après la correction des étapes (`2a7d6a9`), en 20 min. 4 KO, tous applicatifs : tête qui se décale (l.76), félicitation du dernier vers absente (l.121, l.130), train bloqué en `avance` au dernier placement (l.277).
- 22:45 UTC : corrections d'`implementer` (le RED est l'E2E) : `77a5602` (`.exercice-en-cours` recentré dans `.ecran`), `f02031b` (fin du cran par un délai propre), `433089c` (course **préexistante sur `main`** dans `placer` de `useDeroulementDeSeance.ts` : la consigne des mots cachés passait par-dessus la félicitation du dernier vers ; seul le dernier placement appelle `apresUnPlacement`). Ce dernier touche tous les exercices à étiquettes : périmètre du run 2 élargi en conséquence.
