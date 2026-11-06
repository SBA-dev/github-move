# Journal de #163 : réponse fausse animée par le personnage guide

Branche de base : `main` (`2a69a87`). Branche : `feature/163-reponse-fausse-animee`.
Équipe lancée par le responsable des équipes (« graphe 163 »), session `session_015z4jmP18Ni5hQfiWStgeoX`.

## 2026-11-05

- 22:45 UTC : démarrage. Lecture de #163, du tableau de #64 et des annonces `[Responsable]`. Commentaire Avancement créé sur #163.
- 22:50 UTC : étape 1, délégation au `domain-modeler` (nouvelle réaction de Motivation, nouvelles règles : quand jouer la scène, durée, lien avec #97).
- 23:00 UTC : `domain-modeler` rendu (`fa1de18`) : Motivation, aucun agrégat, value objects `FaitsDeLaReponseFausse` et `SceneDeReponseFausse`, fonction pure `sceneDeReponseFausse`, 12 invariants, questions 163.1 à 163.12. Écarts relevés : les étincelles de Noisette ont quatre branches (mais dorées et cernées : retirées aussi) ; durées des maquettes de 2,9 à 4,7 s.
- 23:10 UTC : `po-acceptance` rendu (`4e38f6c`) : 8 règles, 37 scénarios (45 cas), questions 163.13 à 163.18. Muet selon 97.2 (coupe la parole, pas l'effet « réponse fausse »). Scénario de la tenue portée tagué `@depend-de-106`.
- 23:15 UTC : CADRAGE PRÊT publié sur #163. Attente des réponses du PO avant maquettes, planches et TDD.
- 23:20 UTC : réponse du PO « 163 reco tout » vérifiée sur #64 (annonce `[Responsable]` 6672057084). Décision 0042 réservée.
- 23:30 UTC : réponses du PO intégrées : modèle et décision 0042 (`domain-modeler`), scénarios avec la dictée (`po-acceptance`, 41 scénarios, 51 cas). Dictée : la scène se joue au mot corrigé (lettre en rouge), car la dictée ne juge qu'au mot complet (#19, #128).
- 23:45 UTC : maquette `docs/maquettes/reponse-fausse-coach-leo.html` et planche 163a (`docs/stories/163/captures/163a-coach-leo-*.png`) : 1,5 s mesurée, de face, ballon sur un petit poteau, image fixe sans bulle. Relue par l'orchestrateur au regard de la règle absolue : conforme.
- Push refusé par GitHub (« fatal error in commit_refs_rules ») de 23:25 à au moins 23:45, pour tout commit, même trivial.
- 23:55 UTC : planche 163a présentée au PO (163.19 à 163.21). Push rétabli (`ceed540`).
- 00:00 à 00:20 UTC : TDD du domaine de 163a, 3 cycles (`d897efa`→`87a5b5b`, `34fab84`→`ea7d8eb`, `b2dfcfd`→`c2fe32d`), comportements 1 à 16 verts (2925 tests). Tests 9 à 11 verts dès leur écriture (caractérisation du catalogue).
- Revue intermédiaire delta (`ceed540..c2fe32d`) : APPROUVÉ. Non bloquants corrigés : test du comportement 3 tautologique (`9c3de94`), renvois « à valider » de nos ajouts au glossaire et à la context map. Dernier commit relu : `c2fe32d`.
- 23:50 UTC : planche 163a validée (« 163a reco tout » : 163.19 à 163.21 A, annonce `[Responsable]` 6672618059). Critères mis à jour (43 scénarios, 53 cas).
- 23:55 UTC : 106h mergée (`11b32d4`), `main` intégrée (`e2192a8`), sans conflit ; 2935 tests unitaires et `tsc` verts. VERROU base demandé.
- 00:00 à 00:40 UTC : câblage de 163a (`9aab545` refactor du moteur commun et de Coach Léo, additif ; `a6b9a53` feat ; `794dae5` fix : l'image fixe dure aussi 1,5 s puis `reflechit`, conformément à 163.13). Review du câblage : APPROUVÉ (aucun bloquant) ; non bloquants corrigés (`d2ddb45`). Steps E2E écrits sans exécution (`b2a16e9`), en attente du verrou base (non-régression de nuit jusqu'à 01:45 UTC environ ; #163 première dans la file).
