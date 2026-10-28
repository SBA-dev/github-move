# Journal de la story #96 : Refonte visuelle de l'application de l'enfant

Équipe lancée par le responsable des équipes (`/equipe 96`), vague 1, issue de coordination #64.

- Branche : `feature/96-refonte-visuelle`, partie de `main` `ea2cca3`. Base : `main`.
- Dépendances mergées : #45 (publication terminée), #105 (skills gamification, illustration, motion-design, design-dna ; sons dans `public/sons/` ; décisions 0026 à 0032).
- Stories en parallèle : aucune. Ressources prévues : aucune (front seul).
- Numéro de décision réservé : 0033.
- Scénarios déjà validés par le PO : non.
- Réponses du PO sur l'épopée #95 : commentaires du 2026-10-25 et du 2026-10-27 (direction artistique « aventure de jeu vidéo » sans reprendre personnages ni marque ; style de dessin de référence Coach Léo, `docs/maquettes/coach-leo-sports.html` ; tests visuels Playwright sur les écrans clés seulement, en 360 px et mouvements réduits ; fluidité mesurée sur Honor Magic).

## 2026-10-27

- 22:05 UTC : démarrage. Issue #96 lue (ouverte, label `graphe:cadrage`), #95 et #64 lues. Aucune annonce `[Responsable]` ne vise encore #96 hormis le tableau (« lancement en dev complet »).
- Étape 1 (domaine) : **sautée**. La story ne touche que `src/` (affichage) : ni règle métier, ni agrégat, ni contexte nouveaux (issue : « Sans règle métier nouvelle »). Les termes éventuellement manquants au glossaire seront signalés par `po-acceptance`.
- 22:08 UTC : message du responsable (`session_016aXZVAP1dRD9CgMXRrkfWN`, session inscrite au tableau de #64) : réponses du PO à 96.1–96.6, publiées sur #96 (commentaire 6454802102) : « 96.1 A 96.2 A 96.3 A 96.4 A 96.5 B 96.6 A ». Transmises à `po-acceptance`. La validation ⛔ n°1 des scénarios reste à recevoir par une annonce `[Responsable]` sur #64.
- 22:40 UTC : `po-acceptance` a rendu `features/96-refonte-visuelle.feature` (6 règles, 33 scénarios dont 11 plans, `bddgen` sans erreur de syntaxe) et `docs/stories/96/acceptance.md`. Questions restantes #96.7 à #96.15, avec recos. `CADRAGE PRÊT` publié sur #96 ; ⛔ attente de l'annonce `[Responsable]` sur #64.
- 22:45 UTC : ✅ validation n°1 levée par le responsable sur #64 (réponse du PO « 96 partout », vérifiée dans le transcript). #96 en `graphe:dev`.
- 22:55 UTC : `po-acceptance` applique 96.7–96.15 : 6 règles, 36 scénarios dont 14 plans, plus aucun `@a-valider`. Nouvelle question #96.16 (bulle de Noisette dans les écrans du parent sans profil, scénarios de #73).
- Bloc TDD 1 « Motivation, Agent Max » (3 comportements) :
  - B1 nom et titre : RED `ec92025` (échec vérifié), GREEN `72084c4`. Le changement a rendu rouge `paroles_test.ts` (phrase de présentation) : l'attente a été mise à jour par `test-writer` (`b781b7c`), verte d'emblée puisque la phrase vient du nom et du titre.
  - B2 voix masculine : RED `8571613` (échec vérifié), GREEN `cb7f9a8`. 2462 tests verts, lint, fmt, `tsc` OK.
- Revue intermédiaire du bloc 1 (delta `ec92025..cb7f9a8`) : **APPROUVÉ**, aucun bloquant. Non bloquants : le `feat` `72084c4` a laissé `paroles_test.ts` rouge jusqu'à `b781b7c` (à l'avenir, test-writer cherche avant le RED tous les tests qui dépendent d'une donnée renommée) ; `docs/stories/7/domain-model.md:36` et `docs/maquettes/README.md:80` citent encore Agente Mila ; apparence d'Agent Max à faire dans le bloc des dessins. Dernier commit relu : `cb7f9a8`.
- Glossaire (ajouts) : `c19d556`. Scénarios de #6 (Agent Max) : `d26e869`.
- 23:00–23:40 UTC : câblage (front seul, pas de verrou).
  - C1 jetons, palettes, polices : `819c25d`, `c8e47fc`. Animaux `principale` `#C03E29` (5,30:1 sur blanc ; 4,71:1 sur le fond). Texte des colonnes de l'addition en noir (blanc < 4,5:1), couleurs des colonnes inchangées. `--accent` renommé `--principale` : le step `univers.steps.ts:147` est à adapter (même sens).
  - C4 dessins fixes des personnages guides (worktree à part) : `ecef5f0`, `68d694f`, `17916ab`. Effet « lunettes » corrigé sur Léo, Max, Lili (écart volontaire avec la maquette) ; couche arrière du tutu de Lili retirée. Bundle JS +11 kB gzip. Planche montrée au PO dans la session.
  - C2 boutons à ressort et transitions : `901deb3`, `9573d48`. Mesures : glissement ≈ 225 ms, fondu ≈ 238 ms, rien avec mouvements réduits ni vers les écrans du parent. E2E #25 verts ; 16 KO `@wip` de #29 (voix), dont 2 reproduits sans C2.
  - C3 décor et écrans du parent : en cours. #96.16 (bulle de Noisette de #73) laissée telle quelle en attendant le PO.

## 2026-10-28

- Redémarrage du conteneur pendant C3 et l'écriture des steps : rien de perdu (commits locaux). C3 : `af870d9`, `1e01e85`. Steps (worktree) fusionnés : `60d7674`.
- E2E mise au point `@issue-96 or @issue-6`, `telephone` : 1er passage 119/138. Diagnostic `e2e-tester` : 10 bugs de step corrigés (`df796d3`, `b874e57`), 1 timeout ; 7 KO applicatifs corrigés par `implementer` (`9c77357` dessins validés et signes par partie, `8dca23d` touchers ignorés pendant l'arrivée d'un écran). Résultat : **136/138**.
- 2 KO restants : scénarios de #6 qui attendent le paysage sur « Se connecter » (contredit 96.13). ESCALADE #96.17 publiée (reco : appliquer 96.13). #96.16 toujours en attente.
- Contrôle de la règle absolue : l'objet à la ceinture d'Agent Max est la loupe de la maquette (manche brun, cercle doré, verre), pas une arme.
- Leçon d'outillage : lancer les longues exécutions E2E avec `setsid nohup` (un serveur Vite perdu en cours de route sinon).
- Review complète, cycle 1 : **À CORRIGER**, 1 bloquant (pastilles de matière de « Mes médailles » en dur et sous 4,5:1). RED `98a32cb`, correctif `1b8eeae` ; non bloquants : `313f6af`, `2e28f79`, `c386b95`, `36692c6`, décision 0033 `9447f54`, `deno.lock` `fbed264`.
- Paysage sur toute la hauteur `4280844` ; captures versionnées `features/captures/` (`17bbe4b`), `@visuel` hors `tablette` (`698e7f3`) ; hasard à graine fixe et attente des polices `0ba2f8f` ; 4 captures `e4a037f` (stables 2 × 4/4), montrées au PO, validation attendue.
- Review delta, cycle 2 : **À CORRIGER**, 1 bloquant nouveau : des titres sans voile posés sur le paysage (« Français · CP » de « Mon parcours », titre de classe de « Toutes les leçons ») sont sous 4,5:1, et la mesure du tour des contrastes ignorait le paysage. RED en cours (`e2e-tester`), puis correctif.
- Review delta cycle 3 : **APPROUVÉ** (`79e9b74..4448312`). Non bloquants traités : `3c37a23` (mesure : éléments masqués ignorés), `82c1c94` (classe `.etiquette-sur-le-decor` pour les états de chargement et vides), `4e164e9` (statut de 0033).
- Captures de référence régénérées (`d225ff0`, fenêtre seule, étiquettes) et montrées au PO ; validation attendue.
- PR #124 ouverte en brouillon.
- Non-régression complète lancée à 03:23 UTC (2 projets, 2 workers, 2586 cas) ; **arrêtée à 07:25 UTC à 2274/2586, 0 échec**, sur décision du PO relayée sur #64 (07:18 UTC) : avant la PR, seulement les scénarios `@issue-96` ; la non-régression complète se joue une fois avant la publication.
- #96.16 : **reco validée par le PO** (« 96.16 reco », relayée sur #96 07:26 UTC) : la bulle de Noisette reste dans l'Espace parent et « Qui joue ? » sans profil ; scénarios de #73 inchangés ; comportement déjà en place.
- #96.17 : réponse du PO à préciser (« pas écran sombre »), reposée par le responsable. Rien de codé en attendant.
- #96.17 : **A (reco)** du PO (« 96.17.A », relayée sur #96 07:28 UTC). Scénarios de #6 réécrits pour « Se connecter » sobre : `a52f6ff`.
- Scénarios `@issue-96` (+ 2 de #6), **2 projets** : un 1er run perdu (serveur Vite de la non-régression arrêtée resté vivant puis mort : 156 `ERR_CONNECTION_REFUSED`) ; relance sur serveur neuf : 210/214, 4 KO de step (capture du paysage pleine hauteur recousue par tuiles ; horloge de l'enregistreur des mouvements sous charge), corrigés en `29bf1d3` et `d96a2f8` ; les 4 relancés verts, 70/70 sur les scénarios de mouvement sous 3 workers. Aucun bug applicatif.
- PO, 28/10 (dans la session de l'équipe), mot pour mot « 1.ok 2.je le ferai plus tard » : captures de référence validées ; fluidité sur le Honor Magic (96.14) vérifiée plus tard par le PO (point restant). `@wip` retiré : `13d6779`.
- Review finale (delta `4448312..13d6779`) : **APPROUVÉ**, publiée sur la PR #124. Vérifications finales sur `13d6779` : 2462 tests unitaires, lint, fmt, `tsc`, build verts ; `main` toujours `ea2cca3` (aucune intégration nécessaire).

## Mesures

| Mesure | Valeur |
|---|---|
| Durée | 2026-10-27 22:01 UTC → 2026-10-28 ~09:20 UTC, soit ~11 h 20 (dont ~4 h de non-régression complète arrêtée sur décision du PO, et un redémarrage du conteneur) |
| Temps d'attente du PO | cadrage : 22:45 (questions 96.1–96.6 répondues avant le `CADRAGE PRÊT`, 96.7–96.15 ~30 min après) ; #96.16 ~8 h 30 ; #96.17 ~6 h 20 ; captures ~6 h. Le travail a continué pendant ces attentes (aucune n'était bloquante pour le TDD) |
| Cycles TDD | 1 bloc, 2 comportements (Agent Max : nom et titre, voix masculine) ; le reste est de l'affichage couvert par les E2E (RED par steps avant correctifs : `98a32cb`, `ca3b501`) |
| Cycles de review | bloc Agent Max : 1 (APPROUVÉ) ; review complète : 3 cycles (À CORRIGER, À CORRIGER, APPROUVÉ) + 1 delta final APPROUVÉ |
| Cycles E2E | mise au point : 3 (119/138 → 129/138 → 136/138 puis 138) ; story sur 2 projets : 2 (1 run perdu par un serveur Vite résiduel, puis 210/214 → 4 KO de step corrigés) |
| Non-régression complète | lancée une fois, arrêtée à 2274/2586 sans échec (décision du PO : seulement `@issue-96` avant la PR) |
| Intégrations de `main` | 0 (`main` inchangé à `ea2cca3`), aucun conflit |
| Verrous | aucun (front seul) |
| Escalades | 2 questions nouvelles (#96.16, #96.17), toutes deux réglées par le PO |
| Tokens | relevés par le responsable |
