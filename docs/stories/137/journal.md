# Journal de la story #137 : Grand défi de la matière

Équipe lancée par le responsable des équipes (`/graphe`, vague 1), à la demande du PO (« graphe 137 »).

- Branche : `feature/137-grand-defi`, partie de `main` (`573659e`)
- Branche de base : `main`
- Issue de coordination : #64
- Dépendances mergées : #100 (`f8a4787`), #99, #26, #101, #106 (106a), #141

## 2026-11-04

- 20:45 UTC : démarrage. Lecture de l'issue #137, de la réponse du PO sur #100 (2.a) et des scénarios gardés pour
  #137 dans `docs/stories/100/acceptance.md` (anciens 3.2, 3.3, 6.1 à 6.3, lignes retirées de 5.4, 7.2 et 8.4).
- Étape 1 (domaine) : nécessaire. Le grand défi est un nouveau concept (défi de la matière, ouverture à la matière
  réussie, remplacement du défi de la dernière partie, tirage sur toute la matière).
- 21:00 UTC : modèle du domaine (`8fbd38e`). Nouvelle table additive `grands_defis_termines` nécessaire
  (`defis_termines.numero` est `check (numero >= 1)`) ; `terminer-le-defi` à étendre. Décision 0041 réservée par le
  responsable (tableau de #64).
- 21:10 UTC : critères (`e9a52e4`, `e8bd3e7`) : 6 règles, 15 scénarios, 17 cas par projet. Scénarios de #100 que le
  grand défi rend faux retirés (1.4 2e cas, 1.5, une ligne de 6.2). Questions #137.1 à #137.7.
- CADRAGE PRÊT publié sur #137 ; attente de la validation n°1 (annonce [Responsable] sur #64).
