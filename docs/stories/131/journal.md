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
