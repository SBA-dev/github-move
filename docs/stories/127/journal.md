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
