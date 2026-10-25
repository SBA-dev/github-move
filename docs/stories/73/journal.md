# Journal : issue #73, Aucun son pendant la connexion du parent ni dans l'Espace parent

Branche de base : `main`. Branche : `feature/73-aucun-son-cote-parent`, partie du cadrage `feature/lot-45-73-79-modele-et-scenarios` (`8a7f81b`).

## 2026-10-25 (lancement vers 17:55 UTC ; étapes dans l'ordre)

- Lancement de l'équipe par le responsable (« graphe #73 »). Intégration de `main` (merge `88c7f71`, sans conflit).
- Étape 1 (domaine) et étape 2 (critères) : faites par la session de cadrage, validées par le PO (« #73 reco OK », `42e9d00`). Sautées ici.
- TDD, bloc domaine (Famille + Voix), 5 cycles :
  1. `estUnEcranDuParent` (Famille, tableau exhaustif) : `ad5be2a` RED, `6fea069` GREEN.
  2. `suspendre()` : `ab04584` RED, `3a2a126` GREEN.
  3. `reprendre()` (Son/Muet inchangé) : `6ffebc9` RED, `e9cbf20` GREEN.
  4. Essai de voix entendu voix suspendue, jamais en Muet : `44ce6ff` RED, `f19e8a5` GREEN (extraction de `lireLeTexte`).
  5. Remettre le son voix suspendue ne lit rien : test de protection, vert à l'écriture (`lire` ignore déjà la lecture voix suspendue).
  Cycles 1 et 2 menés en parallèle (fichiers disjoints, commits faits par l'orchestrateur).
- Revue intermédiaire du bloc domaine (`2ff377f..25639f9`) : **APPROUVÉ**, 5 non bloquants. Le n°3 (nommer `PublicDeLEcran`) est traité en `6963b35`. N°1 (`onFin` non appelé voix suspendue, comme en Muet) : sans effet, car la voix est reprise dans un `useLayoutEffect` avant les effets des écrans de l'enfant. N°2 (test d'idempotence) et n°4 (commit `f19e8a5` qui contient aussi l'extraction) : laissés tels quels.
- Câblage (`6a7af1f`) : `ecranAffiche` (switch exhaustif lieu → `Ecran`) et `useLayoutEffect` dans `Application.tsx` ; `suspendre`/`reprendre` dans `useVoix` ; « Qui joue ? » sans profil affiche l'invitation à créer le premier profil sans la lire (le composant qui la lisait est supprimé).
- En parallèle : `e2e-tester` (steps de #73, puis mise au point sur `telephone`, `--workers=2`) et `mr-reviewer` (revue complète).
- Revue complète (étape 4) : **APPROUVÉ** au 1er cycle, 5 non bloquants. Prévu après la mise au point E2E : n°2 (fusionner `Invitation` dans `InvitationAffichee`) et n°4 (ordre des paramètres de `ecranAffiche`). N°1 (annonce d'une zone live insérée déjà remplie) : même schéma que l'espace parent sur `main`, à proposer au PO en fin de vague. N°3 (dériver `estPageDeLEnfant` du domaine) : après le merge de #29, pour éviter les conflits. N°5 (message de voix bloquée qui reste affiché) : hors périmètre.
- E2E, mise au point (`6769bfa`, steps dans `features/steps/aucun-son-cote-parent.steps.ts`) : #73 31/31 ; périmètre (#73, #5, #7, #10, #11, #15, #16, #65, #72, socle) 316/316 sur `telephone`, `--workers=2`, 15 min. Aucun bug applicatif. Contournement Playwright (build Chromium 1243 au lieu de 1194) par un `PLAYWRIGHT_BROWSERS_PATH` dans le scratchpad, sans `playwright install`.
- Refactor des non bloquants 2 et 4 (`136b33b`). PR #91 ouverte en brouillon. Revue delta `606edf1..136b33b` : **APPROUVÉ** ; non bloquants 1 et 2 (steps plus stricts) confiés à l'`e2e-tester`.
- Relance courte après le refactor : #73 et #11 verts (67/67) ; 119 faux KO sur #16 et #72 (« Cannot find module .features-gen/… ») : la relecture avait relancé `bddgen --tags "@issue-73"` pendant le run. Leçon : un seul `bddgen` à la fois dans le dépôt pendant un run. Relance de #73, #16 et #72.
- 18:41 UTC — Relance après durcissement des steps (`7da50c8`) : #73 31/31, #16 35/35, #72 84/84 (150/150, 6,5 min). Sur le dernier commit : unitaires 1794/1794, lint, fmt, `tsc`, build verts. Pas de CI dans le dépôt. `main` n'a pas bougé depuis l'intégration (`88c7f71`).

## Mesures

| Mesure | Valeur |
|---|---|
| Durée, du lancement à `PRÊTE À MERGER` | ≈ 50 min (17:55 → 18:45 UTC) |
| Temps d'attente (PO, verrous, autres équipes) | 0 (cadrage déjà validé, aucune ressource partagée) |
| Cycles TDD | 5 (dont 1 test de protection vert à l'écriture), cycles 1 et 2 en parallèle |
| Cycles de review | revue intermédiaire du domaine (APPROUVÉ), revue complète (APPROUVÉ au 1er cycle), revue delta steps + refactor (APPROUVÉ) |
| Cycles d'E2E | 3 runs : périmètre 316/316 (≈ 23 min avec l'écriture des steps), relance courte invalidée par un `bddgen` concurrent (4,7 min perdues), relance 150/150 (6,5 min) |
| Part des E2E dans la durée | ≈ 35 min sur 50 |
| Intégrations de `main` | 1 (au démarrage), sans conflit |
| Verrous pris | aucun (verrou `merge` à venir) |
| Escalades | aucune |
