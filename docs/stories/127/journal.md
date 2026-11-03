# Journal de la story #127 : maisons de l'addition posée (98c-addition)

Équipe lancée par `/graphe` (« Graphe 127 »), vague 1, issue de coordination #64.
Branche `feature/127-addition`, partie de `main` (`f8a4787`). Base : `main`.
Session : session_015z4jmQ9o3CKmJiuvCfr2me. Décision : prochain numéro libre 0040, si besoin.
Équipes voisines : #106 (fin de séance, Motivation), #126 (bulles de choix).

## 2026-11-02

- 21:15 UTC : démarrage. Lecture de #127 (aucun commentaire), de #64 (annonces jusqu'au lancement de #127, « À SAVOIR » du 28/10 23:40), du cadrage de #98.
- Étape 1 (domaine) : déléguée à `domain-modeler`, pour un modèle court propre à #127 (pas de nouveau contexte attendu : tout est cadré par #98).
- 21:40 UTC : modèle de domaine écrit (`domain-model.md`). Apprentissage, affichage seulement ; aucun fait du domaine manquant. 10 invariants propres, questions #127.1 à #127.7. Maisons seulement en séance (révision et test de départ : calcul en ligne).
- Étape 2 (critères) : déléguée à `po-acceptance`.
- 22:05 UTC : critères écrits (`features/127-maisons-de-l-addition.feature`, `acceptance.md`) : 6 règles, 45 scénarios (63 exemples), 4 `@a-valider`. Nouvelles questions #127.8 à #127.11. Séance complète dans 4 scénarios : `@issue-127` à ajouter à `delais.steps.ts` à l'étape E2E.
- ⛔ Validation n°1 : `CADRAGE PRÊT` publié sur #127, en attente de l'annonce `[Responsable]`.
- 21:38 UTC : ⛔ validation n°1 levée (annonce [Responsable] 6589102464 sur #64, réponse du PO « 126 reco tout, 127 reco tout », vérifiée sur #64). #127 passe en `graphe:dev`.
- 21:45 UTC : `po-acceptance` reporte les réponses (`acceptance.md`, `domain-model.md`) et retire les 4 `@a-valider`. 6 règles, 45 scénarios, 63 exemples.
- 21:45 UTC : liste des comportements unitaires : **aucun**, comme pour 98a. Le domaine ne change pas : maison allumée (`chiffreEcrit`), porte ouverte (`chiffresPoses`), saut de la retenue (comparaison avant / après déjà fournie par le domaine, départ = colonne dont le chiffre vient d'être écrit), dessin choisi par la clé d'univers. Le RED passe par les étapes E2E de `@issue-127`. Une règle qui apparaîtrait dans React pendant le câblage serait remontée au domaine par un cycle TDD.
- 21:45 UTC : en parallèle, `e2e-tester` écrit les étapes de `@issue-127` (RED) et `implementer`, en rôle d'illustrateur, prépare les planches (maison aux couleurs des colonnes, retenue) dans un worktree à part.
- 22:00 UTC : planches rendues par l'illustrateur (worktree, `ebbbe9c`, intégré en `0a63525`) : `addition-maison` (6 univers × 3 colonnes × 3 états, 75 px, pastille) et `addition-retenue` (6 objets × 3 couleurs d'arrivée). 72 sources SVG, 24 contrôles. Relues par l'orchestrateur contre la règle absolue : rien à signaler. `PLANCHES PRÊTES` publié sur #127 (6589329965), avec 4 choix à confirmer (piste de Sports teintée, toit rouge de Pompiers sur la colonne rose, porte prune de Danse, retenue de 56 px).
- Notes de l'illustrateur pour le câblage : régénérer les dessins TSX des maisons avec la façade colorée par `--colonne-*` ; le fond de `.maison-de-la-colonne` passe à `--colonne-*-fond` (sinon la façade se fond dans le fond) ; prévoir la place de la retenue en haut de la colonne.
- 22:30 UTC (environ) : redémarrage du conteneur pendant l'écriture des étapes E2E. Le travail était resté sur le disque : commité en l'état (`740c192`, en cours), puis `e2e-tester` relancé pour finir le RED.
- 22:21 UTC : planches validées par le PO (annonce [Responsable] 6589935963 sur #127, « maison OK, retenue OK »), choix de l'illustrateur compris. Condition 98.31 remplie. À SAVOIR de #64 (6589893888) : scénario de #97 KO sur `main` (effet « découverte » de #101), préexistant, hors de notre périmètre (#141).
- 22:50 UTC : RED rendu par `e2e-tester` (`28cde64`, `c4835ba`) : `@issue-127` 15/56 verts, 41 rouges, tous par fonctionnalité absente (glisser au doigt, attributs de la maison, signal, saut de la retenue, mise en page 360 × 740) ; `@issue-20` entièrement vert. Contrat d'attributs en tête de `features/steps/addition-posee-maisons.steps.ts`.
- Étapes partagées : élargissements de tags (`@issue-127`) et de regex (`centaines`), `export` de fonctions, `@issue-127` dans les délais longs. **Un point à faire relire** : l'étape de #20 « Léa répond « N » pour la colonne des X » commence l'exercice de test s'il n'est pas encore affiché. Jugé compatible (le cas échouait avant, `@issue-20` reste vert), à confirmer par `mr-reviewer` ; sinon escalade.
- Câblage délégué à `implementer`.

## 2026-11-03

- 00:40 UTC : câblage par `implementer` (`208b235` maisons, glisser au doigt, retenue qui saute ; `fe372e1` addition tenue dans 360 × 740 ; `acdc176` invite non redite après un chiffre posé). Domaine inchangé ; départ du saut lu par comparaison avant / après. E2E `telephone` : `@issue-20`, `@issue-23`, `@issue-65`, `@issue-98` verts ; 3 rouges de `@issue-127` attribués aux étapes ; 3 rouges de `@issue-24` (« Trop fort, ça ! ») à vérifier sur `main`.
- Composant partagé modifié : `groupe-sous-le-doigt.ts` (ajout de `maisonSousLePoint`), une ligne dans `EcranDeSeance.tsx` et `useDeroulementDeSeance.ts`, compaction CSS limitée à `:has(.addition-posee)`. `APPRIS` publié sur #127 (6592191077), responsable prévenu pour relais sur #64.
- Point d'attention : la compaction réordonne visuellement l'en-tête (`order`), à juger par la review (accessibilité).
- Étape 4 : review complète par `mr-reviewer`, en parallèle de `e2e-tester` (3 étapes à corriger, vérification de `@issue-24` sur `main`).
- 01:00 UTC : review cycle 1 : **APPROUVÉ**, aucun bloquant. Réponses : compaction acceptable (ordre du focus inchangé, WCAG 2.4.3 et 1.3.2 respectés, commentaire à corriger) ; ajout à l'étape de #20 compatible ; `acdc176` est de l'enchaînement de la voix, pas une règle. Il était exigé par les 3 scénarios « Noisette applaudit en sautant » de `@issue-127` (poser au doigt, au toucher, au clavier), rouges avant ce commit et verts après. Non bloquants retenus pour après l'intégration de `main` : commentaires de `styles.css` (compaction) et de `useGlisserUneEtiquette.ts:13`, mise en forme de `ExerciceDAdditionPosee.tsx:164`, coupure de « centaines » en mode dys à 360 px à vérifier sur les captures, compteur « 3 / 10 » masqué et personnage guide à 40 px à montrer au PO dans les captures. Dette notée : formes de maison en double (TSX de 98a et SVG de #127), `saut-de-la-retenue.ts` couvert par l'E2E seulement.
- `main` a bougé : #106 (106a) mergée (`8757070`). Intégration prévue à la fin du run E2E en cours (conflit attendu dans `delais.steps.ts` ; vérifier la compaction avec le masquage du petit personnage guide de #106).
- 02:00 UTC : mise au point E2E par `e2e-tester` (`9ebe2c0`, `b6fce6e`) : `@issue-127` entièrement vert sur `telephone`, `@issue-20`, `@issue-23`, `@issue-65` et `@issue-98` verts (un rouge de charge rejoué vert). `@issue-24` : lignes 70, 81 et 89 (« Trop fort, ça ! ») rouges **aussi sur `main`** (`8757070`, étapes de `main`) : préexistant, hors de #127. `@wip` retiré.
- 02:05 UTC : intégration de `main` (#106 106a, merge `2b638c1`). Un conflit, `features/steps/delais.steps.ts` (liste des délais longs) : les deux tags gardés (`@issue-127` et `@issue-106`). tsc, build OK ; `deno test` 2778/2778.
- 02:10 UTC : `implementer` reprend les non bloquants de la review, vérifie la compaction avec le masquage du petit personnage guide de #106, et fait les 7 captures (6 univers et mode dys à 360 px).
- 02:50 UTC : non bloquants faits par `implementer` (`b8ad840` commentaires et ref stabilisé, `cf1bf43` « Centaines » ne se coupe plus en mode dys, `99ee2af` 7 captures). Aucune interaction avec #106 (le petit personnage guide est retiré par `ParoleDuGuide` à la fin du défi, écran sans `.addition-posee`). E2E `@issue-127`, `@issue-20`, `@issue-106` (hors `@hors-106a`, sans étapes) : 160/161, le rouge (délai de 5 s, révision) vert au rejeu seul. Incident : ces 3 commits portent un mauvais identifiant de session dans le pied de message (celui de #106) ; historique déjà poussé, non réécrit (merge seulement sur une branche poussée).
- Défaut vu à la relecture des captures par l'orchestrateur : l'objet de la retenue chevauche le haut du chiffre des dizaines (animaux, princesse, police, pompier). Correction confiée à `implementer`, puis captures refaites.
- À montrer au PO avec la PR : compteur « 3 / 10 » masqué et personnage guide à 40 px sur téléphone ; en mode dys à 360 × 740, « Je ne sais pas » demande un défilement vertical (consigne sur 4 lignes), sans défilement horizontal.
- 03:30 UTC : retenue corrigée par `implementer` (`8db8329`) : place réservée en haut de chaque colonne, 44 px sur téléphone (56 px n'y tenait pas, PO d'accord jusqu'à 44 px), 56 px au-delà. Captures refaites, page en haut (`5b96f1e`) : la retenue ne touche plus aucun chiffre dans les 6 univers ni en mode dys. E2E `@issue-127` + `@issue-20` : 136/136 sur `telephone`, sans rejeu. À l'étape calculer, page en haut, les bulles de choix sont sous la ligne de flottaison (le focus fait défiler jusqu'à elles) ; seule l'étape poser est exigée sans défilement.
- Revue du delta (`acdc176..HEAD`) confiée à `mr-reviewer`.
- 03:45 UTC : PR #143 ouverte en brouillon, captures jointes. `REVUE` publié sur #127 (6593937877). Review finale publiée sur la PR par `mr-reviewer` (6593940151) : APPROUVÉ.
- 04:10 UTC : `@issue-127` + `@issue-20` sur `tablette` : 136/136, sans rejeu (le glisser au doigt marche au toucher). `main` n'a pas bougé depuis l'intégration (`8757070`). PR passée en « prête », `PRÊTE À MERGER` publié. Attente de l'autorisation de merge du PO par une annonce `[Responsable]`.
- 06:40 UTC : merge autorisé par le PO (annonce [Responsable] 6597204667 sur #64, « merge 127 on »), VERROU merge accordé à #127 (tableau de #64 vérifié). `main` n'a pas bougé (`8757070`). Sur la tête : `deno test` 2778/2778, lint, format, tsc et build OK ; E2E du dernier code (`8db8329`, `f9f7479`) : 136/136 sur `telephone` et sur `tablette`, aucun code changé depuis (journal seulement). Review APPROUVÉ. Merge de la PR #143 par l'équipe.

## Mesures

| Mesure | Valeur |
|---|---|
| Durée (lancement → PRÊTE À MERGER) | 2026-11-02 21:15 → 2026-11-03 04:10 UTC, soit environ 7 h |
| Temps d'attente du PO | validation n°1 : 12 min (21:26 → 21:38) ; planches : environ 20 min (22:00 → 22:21). Aucune attente n'a bloqué le travail |
| Cycles de review | 2 : cycle 1 complet APPROUVÉ (aucun bloquant), delta APPROUVÉ |
| Cycles TDD | 0 comportement du domaine (comme 98a). RED par l'E2E : 41 rouges sur 56 scénarios, puis 3 commits de câblage, 3 corrections d'étapes, 1 refactor, 2 fix (coupure dys, retenue qui chevauchait le chiffre, vu sur les captures) |
| Cycles E2E | 6 runs : RED (`telephone`) ; câblage (`telephone`, périmètre élargi) ; mise au point avec `@issue-24` sur `main` ; après l'intégration de `main` avec `@issue-106` ; après le correctif de la retenue (136/136) ; `tablette` (136/136) |
| Intégrations de `main` | 1 : #106 106a (1 conflit, `delais.steps.ts`, les deux tags gardés) |
| Escalades | 0 |
| Verrous | aucun (front seul) |
| Dessins | 72 sources (54 maisons recolorées, 18 retenues), 2 planches, validées au premier passage ; 7 captures |
| Incidents | redémarrage du conteneur pendant l'écriture des étapes (travail resté sur le disque, commité puis repris) ; 3 commits au `Claude-Session` faux (non réécrits) ; `@issue-24` (3 scénarios) rouge aussi sur `main` |
| Tokens | relevés par le responsable |
