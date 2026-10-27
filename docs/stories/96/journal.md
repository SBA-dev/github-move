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
