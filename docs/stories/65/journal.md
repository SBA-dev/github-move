# Journal de la story #65 : écran de l'enfant qui réunit cabane, histoire, badges et records

Équipe lancée par le responsable des équipes (vague 1, issue de coordination #64).

- Branche de base : `main` (partie de `f07fc23`)
- Branche de travail : `feature/65-ecran-mes-trophees`
- Session : session_01T3PYy8iDLiAF3s9R4QKWxK

## 2026-10-24

- 20:45 UTC : démarrage. Issue #65 lue (5 questions ouvertes). Dépendances mergées : #20 (records de fluence), #25, #22, #19, #24, #6, #7. Non livrées : #29 (dock), #31, #32, #33.
- 20:50 : étape 1, `domain-modeler`. Contexte Motivation, vue calculée sans agrégat ; lecture seule des records de fluence (Apprentissage) et des titres (Catalogue). Ni migration ni Edge Function. 14 questions. Commit 38cc327.
- 21:05 : étape 2, `po-acceptance`. `features/65-ecran-mes-tresors.feature` (6 règles, 29 scénarios, 17 `@a-valider`, 4 `@acces`, 1 `@depend-de`) et `acceptance.md`. 17 questions. CADRAGE PRÊT, attente de la validation du PO.
- 20:55 : annonce du responsable (#64, https://github.com/SBA-dev/github-move/issues/64#issuecomment-6389424786) : PO « 65.1 mes médailles le reste ok avec les propositions ». 65.2 à 65.17 = reco ; 65.1 en attente d'arbitrage (« médaille » est un synonyme interdit de Badge). Consigne : nom de l'écran isolé dans une seule constante des paroles de `@domain/motivation`, scénarios qui le citent laissés `@a-valider`. Label `graphe:dev`, TDD lancé.
- 21:15 : critères révisés (`po-acceptance`) : 31 scénarios, 4 `@a-valider` (nom de l'écran), scénarios des questions 15 et 17 ajoutés.

### Comportements TDD (ordre prévu)

Bloc A, sections :
1. `sectionsAAfficher` : ordre fixe cabane, histoire, badges, records de fluence.

Bloc B, records de calcul rapide (`pastillesDesRecords`) :
2. aucun record → aucune pastille ; une pastille par record, libellé = titre de l'exercice, valeur = meilleur score lu.
3. fluence sans titre (clé = signe) → libellé = titre de la leçon.
4. leçon ou exercice absent de la bibliothèque → libellé = clé enregistrée.
5. ordre du parcours : niveau, `ordre` de la leçon, position de l'exercice ; records de tous les niveaux.

Bloc C, paroles de l'écran :
6. nom de l'écran : une seule constante (65.1 en attente).
7. accueil du personnage guide, et phrase « rien à montrer » qui le remplace (65.2, 65.7, 65.17).
8. phrase d'une pastille : « … : ton record est de 12 calculs » / « 1 calcul » (65.11).
9. paroles lues à l'ouverture, avec et sans « Tout lire » (65.12).

- 21:20 : comportement 1 vert (7dee127 RED, 06dc973 GREEN), 1223 tests.
- 20:56 : annonce du responsable (#64, https://github.com/SBA-dev/github-move/issues/64#issuecomment-6389432845) : 65.1 tranchée, « Mes médailles » (réponse du PO : « A »). « médaille » retiré des synonymes interdits de Badge (seule ligne existante modifiée du glossaire, sur décision du PO). Critères mis à jour par `po-acceptance` : 0 `@a-valider`, feature renommée `features/65-ecran-mes-medailles.feature`. Note : le `git mv` du renommage, indexé pendant que `test-writer` commitait, est parti dans le commit 3f3433d (test rouge des paroles) ; contenu inchangé, sans effet.
- 21:25 : comportements 2 à 5 verts (records de calcul rapide). Départage par identifiant écrit avant son test (dd632b1), test ajouté ensuite (08abbd4, vérifié en neutralisant la ligne).
- 21:30 : revue intermédiaire blocs A et B (`mr-reviewer`, `7dee127^..08abbd4`) : **APPROUVÉ**, 0 bloquant. Retenus : règle de clé d'une fluence (`titre ?? op`) à publier par le Catalogue et utilisée par Apprentissage et Motivation (n°2) ; ligne du tableau des relations de la context map (n°4). Gardés tels quels : tri proche de `parcours.ts` (Motivation n'importe pas Apprentissage), `recordsDeFluence` comme nom de section.
- 21:35 : comportements 6 à 8 verts (paroles : nom de l'écran, accueil du personnage guide, phrase d'une pastille). Nom d'un test corrigé (« trophées » interdit, be7cca8). 1239 tests.
