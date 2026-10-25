# Journal : issue #29, Écran « Aujourd'hui » (accueil de l'enfant)

Équipe lancée par `/graphe` (session session_014Tk5o75ngb8dMADiGZ9mr4), branche `feature/29-aujourd-hui`, base `main`.

## 2026-10-25

- 17:03 Lancement. Branche créée depuis `feature/lot-29-30-modele-et-scenarios` (`8201960`).
- 17:04 Intégration de `main` (`8448f19`) : conflits d'ajouts dans `glossaire.md` et `context-map.md`, les deux côtés gardés.
- Étapes 1 et 2 sautées : modèle et scénarios faits au cadrage anticipé, validés par le PO (« OK #29 #30 reco partout », 29.25, 29.26). CADRAGE PRÊT pour information.
- #26 est mergée : les tags `@depend-de-26` de `features/29-aujourd-hui.feature` sont à lever. #28 ne l'est pas encore : l'objectif du jour (il utilise `Jour` de #28) et la tuile « À revoir » attendent son merge.

### Comportements TDD prévus

1. `leconDuJour` (Apprentissage) : inconnue, aucune leçon pour la classe, parcours fini, alternance français/maths puis autres matières.
2. `tuilesDeMatiere` (Apprentissage) : une par matière du parcours, compteur du parcours.
3. `tuilesDuJour` (Apprentissage) : « À revoir » si au moins une question due, test de départ s'il est à proposer, ordre fixe.
4. `leconSuivanteEnFinDeSeance` (Apprentissage, 29.8) : leçon suivante du parcours, sinon leçon du jour si elle n'est pas la leçon jouée.
5. `objectifDuJour` (Motivation, 29.2, 29.3) : après le merge de #28.
- 17:20 RED faits : leçon du jour (`d02e12d`), tuiles de matière (`7f8d6f3`), tuiles du jour (`b7b622c`), leçon suivante en fin de séance (`fa53c5f`). GREEN leçon du jour (`eb73b91`).
- 17:22 `po-acceptance` (`fbfc481`) : `@depend-de-26` retiré de #29 ; action 2 faite (scénarios de #24, #25 ×2, #26 ×2 réécrits avec la leçon du jour, tag `@issue-29` ajouté). Doutes notés, tranchés par l'orchestrateur sans changement métier : libellés des règles de #25 et #26 à compléter par « sinon la leçon du jour » (conséquence directe de 29.8) ; doublons #25/#29 gardés (l'action 2 laissait le choix) ; scénario #24 lié à la vraie bibliothèque (risque accepté, noté en dette) ; anciens commentaires N10/26.8/26.19 gardés comme historique sous les nouveaux.
