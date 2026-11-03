# Journal de la story #131 : boîte à jetons et schéma en barres (98c-boîte et barres)

Équipe lancée par `/graphe` (« graphe 131 »), vague 1, issue de coordination #64.
Branche `feature/131-boite-et-barres`, partie de `main` (`227ec44`). Base : `main`.
Session : session_015z4jmMgq1HB7F2nTVR6x1n. Décision : aucune réservée (prochain libre 0040, à demander par DÉCISION).
Équipes voisines : #126 (bulles de choix, mode par choix de `calcul`), #128 (clavier de cristaux, habillé aussi dans la boîte et les barres).

## 2026-11-03

- 07:35 UTC : démarrage. Lecture de #131 (aucun commentaire), de #64 (annonces jusqu'au lancement de #131, À SAVOIR #128/#131), du cadrage de #98 (lignes `boite` et `barres`, pistes d'objets 98c) et du journal de #127.
- Étape 1 (domaine) : déléguée à `domain-modeler`, pour un modèle court propre à #131 (aucun nouveau contexte attendu : tout est cadré par #98 ; vérifier que les faits du domaine suffisent, en particulier pour l'invariant 98-6, la jauge ne donne jamais la valeur cherchée).
- 07:50 UTC : modèle de domaine écrit (`3c9ac16`). Apprentissage, affichage seulement ; aucun fait manquant. 13 invariants propres, questions #131.1 à #131.11. Révision : mêmes composants (à habiller). Test de départ : aucune boîte ni schéma. Risques : la barre « ? » est déjà proportionnelle à la réponse (principe du schéma, #21) : la jauge ne doit avoir aucune échelle (#131.10) ; jetons actuels dorés, comme des pièces ; étape de #21 qui lit `.boite::before`. Objets relus contre la règle absolue : rien à signaler.
- Étape 2 (critères) : déléguée à `po-acceptance`.
- 08:20 UTC : critères écrits par `po-acceptance` (`8c1aee8`) : `features/131-boite-et-barres-de-l-univers.feature`, `acceptance.md`. 5 règles, 49 scénarios (21 plans), 127 cas par projet ; 11 `@a-valider` (15 cas). Nouvelles questions #131.12 (écart cherché d'une comparaison) et #131.13 (nombre de parts cherché). Séance complète jouée (plan des étoiles) : `@issue-131` à ajouter aux délais longs à l'étape E2E. 47 étapes nouvelles, étapes de #21, #98, #127, #20/#65 à ouvrir à `@issue-131`.
- ⛔ Validation n°1 : `CADRAGE PRÊT` publié sur #131, en attente de l'annonce `[Responsable]`. Planches non commencées : elles dépendent de #131.1 et #131.2 (objets, forme du jeton).
- 08:00 UTC : `main` a bougé (#126 mergée, `d609058`, annonce [Responsable] 6598431074 sur #64). Intégration par merge (`ff291f6`), sans conflit ; `bddgen --tags @issue-131` passe (étapes manquantes attendues). Le mode par choix de la boîte et des barres porte déjà la bulle de l'univers (#126) : l'habillage de #131 ne concerne que la boîte, les jetons et la jauge.
