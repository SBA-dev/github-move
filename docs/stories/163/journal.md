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
