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
