# Journal de la story #102 : Le personnage guide évolue avec les étoiles

Équipe lancée par le responsable des équipes (`/graphe`, vague 1, issue de coordination #64).
Branche de base : `main` (départ `c8b0ed3`). Branche : `feature/102-personnage-guide-evolue`.
Décision réservée : 0036.

## 2026-10-28

- 23:45 UTC : démarrage. Issue lue, annonces `[Responsable]` de #64 lues. Dépendances mergées : #96, #97, #99.
- Étape 1 (domaine) : nécessaire, la story introduit un concept absent du glossaire (tenue ou évolution du personnage guide). Délégation à `domain-modeler`.
- 00:05 UTC (29/10) : modèle de domaine rendu (`domain-model.md`). Contexte Motivation, tenues reçues recalculées depuis le total des étoiles (comme la cabane, sans la modifier), tenue portée seule donnée gardée. Questions #102.1 à #102.20. Délégation à `po-acceptance`.
- 00:25 UTC : critères rendus par `po-acceptance` : 6 règles, 39 scénarios (48 cas), tranche minimale #102.17. Questions #102.21 à #102.27 ajoutées. CADRAGE PRÊT publié sur #102, attente de la validation du PO par le responsable.

## 2026-10-29

- 00:02 UTC : ✅ validation n°1 levée par le responsable sur #64 (réponse du PO : « #102 reco tout »). Aucune ressource partagée. Danses confiées à #106.
- 00:15 UTC : réponses reportées dans `domain-model.md` (invariant 3 revu pour #102.24 B), `acceptance.md`, `.feature` ; termes ajoutés au glossaire et note à la context map.

### Liste des comportements (TDD)

Bloc A, tenues reçues (`tenues.ts`) :
1. `PALIERS_DES_TENUES` : 5, 12, 23, 37, croissants, écart ≥ 3, clés uniques, aucune clé de la cabane.
2. `tenuesDe(total)` : tenues reçues, prochain palier, toutes reçues, total invalide.
3. `tenueRecueParLaSeance` : tenue reçue par la séance (calcul du total après la séance partagé avec la cabane).

Bloc B, tenue portée (`tenue-portee.ts`) :
4. `porterUneTenue` : tenue reçue acceptée, `TenueInconnue`, `TenueNonRecue`.
5. `retirerLaTenue`.
6. `tenueAMontrer` : clé inconnue, étoiles lues, étoiles non lues (#102.24 B).

Bloc C, paroles, sons, sections :
7. `paroles-des-tenues.ts` : annonce, titre de l'encart, description accessible, titre et phrase de la section.
8. `effetsSonoresDeLaFin` : tenue reçue, « decouverte » une seule fois.
9. `sectionsDeLEcran` : section `tenues` après la cabane, absente sans tenue reçue.

### Cycles TDD

- 1/9 paliers des tenues : `f91c991` (red) → `bb7ef3c`.
- 2/9 `tenuesDe` : `320a960` (red) → `7600a76`, refactor `0f9f1ca` (vérification du total partagée avec la cabane).
- 3/9 `tenueRecueParLaSeance` : `6e5ac73` (red) → `85dfd26`, refactor `de8dce6` (`totauxAvantEtApresLaSeance` partagé, cabane inchangée).
- Revue intermédiaire bloc A (`86cb9f8..de8dce6`) : APPROUVÉ. Non bloquants à reprendre au refactor : sortir le total des étoiles de `cabane.ts` dans un module à part ; `verifierTotalDEtoiles` en garde ; exemple 36 → 37.
- 4/9 `porterUneTenue` : `d5743e9` (red) → `0f63f84` ; format du test `bb56ca8`.
- 5/9 `retirerLaTenue` : `73525d4` (red) → `4e5b19e`.
- Revue intermédiaire bloc B (`de8dce6..70ab7fc`) : APPROUVÉ. Non bloquants repris au refactor `cf67318`.
- 6/9 `tenueAMontrer` : `40ff18d` (red) → `0af9657`, refactors `ffe6530` (total des étoiles sorti de `cabane.ts`, non bloquant du bloc A) et `70ab7fc` (recherche d'une tenue par sa clé).
- 7/9 paroles des tenues : `fa13a62` (red) → `70412f4`.
- 8/9 « decouverte » pour une tenue reçue : `8bd0482` (red) → `1d8aee5` (`tenueRecue: false` provisoire à la fin de séance, définitif en révision et au test de départ).
- 9/9 section des tenues : `66b9983` (red) → `760ef1a`, refactor `cf67318` (`estRecue`, `porterUneTenue` rend `TenuePortee`, `verifierTotalDEtoiles` en garde, exports de l'index).
- 2586 tests unitaires verts, lint, fmt et `tsc` propres.
- Câblage : les dessins des tenues sont nouveaux (skill `illustration`, étape 6) : planche montrée au PO (⛔ intermédiaire `PLANCHES PRÊTES`), comme #98.
- Revue intermédiaire bloc C (`70ab7fc..cf67318`) : APPROUVÉ. Non bloquant n°2 (libellé de la section composé en React) → comportement 10.
- 10 libellé accessible de la section : `9ac49c9` (red) → `e7b4e4f`.
- Câblage 1, dessins des 4 tenues pour les 6 personnages guides : `d41c314`, planches `docs/stories/102/planches/`. `PLANCHES PRÊTES` publié (questions #102.28, #102.29), en attente du PO.
- Câblage 2 : mémoire de la tenue portée (`b7f4203`), tenue sur les écrans (`8659967`), annonce à l'écran de fin (`0cc8b66`), section de « Mes médailles » (`1d56e4a`).
- Deux règles écrites dans React faute de domaine, rendues au domaine : 11 « tout lire » lit les tenues (`e106df5` → `773b250`), 12 pastilles des tenues (`42fec92` → `4a331da`), refactor du front `9e0070c`.
- Non fait, sans appelant : effacement de la tenue portée avec un profil supprimé depuis l'appareil (le front n'a pas cette suppression).
- 2590 tests unitaires verts, `tsc` et build propres. Étape 4 : review complète ; étape 5 : steps E2E en parallèle.
- Review complète, cycle 1 : APPROUVÉ. Non bloquants retenus pour un lot après l'E2E : encart de fin (dessin décoratif), libellé accessible de « Mes médailles » hors ligne, bouton « Retirer la tenue » seulement si une tenue est portée, dessins typés sur les clés du domaine, règle dys simplifiée, modèle mis à jour sur l'effacement avec un profil supprimé.
- E2E (`telephone`, `@issue-102`) : 47/48 au premier run. KO « mouvements réduits » : les nuages du paysage (#96) continuent de dériver quand la préférence arrive après le premier rendu. Correctifs `aa0b439`, puis `915701b` (une `key` remonte les animations infinies). Lot des non bloquants de la review : `8c396f3`, `f4de377`, `1fef2f6`, `b06ce00`, `d9d364d`.
- Review delta, cycle 2 : À CORRIGER. Le bouton « Retirer la tenue » caché sans tenue portée cassait un scénario et contredisait le modèle (consigne de l'orchestrateur, erronée) → `705b7f7`. Garde `Object.hasOwn` → `9df0873`.
- Erreur de l'orchestrateur : `df24eda`, présenté comme l'annulation d'une adaptation de step, l'a en fait ajoutée (le commit annulé n'était pas dans l'historique). Relevée par la review du cycle 3, que l'on rend à `e2e-tester`.
- Note (non bloquant) : la `key` de la respiration de `PersonnageGuide` remonte tout le dessin quand la préférence change. Aucun état local ni animation d'entrée ne doit être placé sous ce nœud.
