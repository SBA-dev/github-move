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
- ~18:50 UTC — Revue intermédiaire du bloc domaine (`2ff377f..25639f9`) : **APPROUVÉ**, 5 non bloquants. Le n°3 (nommer `PublicDeLEcran`) est traité en `6963b35`. N°1 (`onFin` non appelé voix suspendue, comme en Muet) : sans effet, car la voix est reprise dans un `useLayoutEffect` avant les effets des écrans de l'enfant. N°2 (test d'idempotence) et n°4 (commit `f19e8a5` qui contient aussi l'extraction) : laissés tels quels.
- ~18:55 UTC — Câblage (`6a7af1f`) : `ecranAffiche` (switch exhaustif lieu → `Ecran`) et `useLayoutEffect` dans `Application.tsx` ; `suspendre`/`reprendre` dans `useVoix` ; « Qui joue ? » sans profil affiche l'invitation à créer le premier profil sans la lire (le composant qui la lisait est supprimé).
- ~19:00 UTC — En parallèle : `e2e-tester` (steps de #73, puis mise au point sur `telephone`, `--workers=2`) et `mr-reviewer` (revue complète).
- ~19:10 UTC — Revue complète (étape 4) : **APPROUVÉ** au 1er cycle, 5 non bloquants. Prévu après la mise au point E2E : n°2 (fusionner `Invitation` dans `InvitationAffichee`) et n°4 (ordre des paramètres de `ecranAffiche`). N°1 (annonce d'une zone live insérée déjà remplie) : même schéma que l'espace parent sur `main`, à proposer au PO en fin de vague. N°3 (dériver `estPageDeLEnfant` du domaine) : après le merge de #29, pour éviter les conflits. N°5 (message de voix bloquée qui reste affiché) : hors périmètre.
