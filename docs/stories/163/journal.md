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
- 02:05 UTC : `main` `f4e1fb1` (#168) intégrée (`7b007c0`), sans conflit.
- 02:17 UTC : VERROU base accordé. Sonde : 3 × `admin/users` en 200, sous 1,3 s.
- 02:20 à 03:35 UTC : E2E sur `telephone`, 1 worker.
  - Run 1 (`@issue-163`, 163a) : 35/47, puis corrections de steps (`4d90d57` : vrais profils de Paul et Tom, test de départ, réseau coupé après le chargement, effet sonore unique sans fin de séance, scène attendue avant la bonne réponse, sondage serré des lettres fausses de la dictée, seuils de durée) ; 46/47.
  - KO restant : scénario « Je ne sais pas » irréalisable tel qu'écrit (#23 écarte les mauvais choix). Réécrit par `po-acceptance` avec le même sens (`b5a3422`), step ajouté (`b66ff0d`) : **47/47**.
  - Run 2 (non-régression touchée : `@issue-97`, `@issue-23`, `@livraison-106b`) : **100/100**.
  - Run 3 (`@issue-19`, `@issue-128`) : le step partagé de la dictée a changé (sondage serré, même sens).
  - Aucun bug applicatif.
- 03:40 à 04:15 UTC : `@depend-de-106` levé sur la tenue portée (`fcfd176`), step ajouté (`646012e`) : **48/48** sur `telephone`. Run 3 : `@issue-19` et `@issue-128` **119/119**. LIBÈRE base.
- 04:20 UTC : PR en brouillon (livraison 163a seulement ; #163 reste ouverte pour 163b à 163f).

## Mesures (livraison 163a)

| Mesure | Valeur |
|---|---|
| Durée, du lancement au PR | environ 5 h 30 (22:45 → 04:20 UTC) |
| Temps passé à attendre | PO : environ 30 min (cadrage, puis planche) ; merge de 106h : environ 30 min (TDD du domaine fait pendant ce temps) ; verrou base : environ 1 h 30 (non-régression de nuit) ; GitHub indisponible pour les push : 20 min |
| Cycles de review À CORRIGER | 0 (domaine APPROUVÉ, câblage APPROUVÉ ; non bloquants corrigés) |
| Cycles E2E KO | 2 sur le périmètre de la story (corrections de steps, puis un scénario réécrit) ; 0 bug applicatif |
| Intégrations de `main` | 2 (`11b32d4` 106h, `f4e1fb1` #168), sans conflit |
| Tokens et coût | relevés par le responsable |
