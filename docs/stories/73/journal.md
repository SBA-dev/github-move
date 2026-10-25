# Journal : issue #73, Aucun son pendant la connexion du parent ni dans l'Espace parent

Branche de base : `main`. Branche : `feature/73-aucun-son-cote-parent`, partie du cadrage `feature/lot-45-73-79-modele-et-scenarios` (`8a7f81b`).

## 2026-10-25

- ~18:00 UTC — Lancement de l'équipe par le responsable (« graphe #73 »). Intégration de `main` (merge `88c7f71`, sans conflit).
- Étape 1 (domaine) et étape 2 (critères) : faites par la session de cadrage, validées par le PO (« #73 reco OK », `42e9d00`). Sautées ici.
- ~18:40 UTC — TDD, bloc domaine (Famille + Voix), 5 cycles :
  1. `estUnEcranDuParent` (Famille, tableau exhaustif) : `ad5be2a` RED, `6fea069` GREEN.
  2. `suspendre()` : `ab04584` RED, `3a2a126` GREEN.
  3. `reprendre()` (Son/Muet inchangé) : `6ffebc9` RED, `e9cbf20` GREEN.
  4. Essai de voix entendu voix suspendue, jamais en Muet : `44ce6ff` RED, `f19e8a5` GREEN (extraction de `lireLeTexte`).
  5. Remettre le son voix suspendue ne lit rien : test de protection, vert à l'écriture (`lire` ignore déjà la lecture voix suspendue).
  Cycles 1 et 2 menés en parallèle (fichiers disjoints, commits faits par l'orchestrateur).
