# Journal de la story #32 : Cabane, des objets débloqués par paliers d'étoiles

Équipe lancée par le responsable des équipes (vague 1, issue de coordination #64).
Branche : `feature/32-cabane`, partie de `main` (`e466e25`). Branche de base : `main`.

## 2026-10-25

- 12:20 UTC : démarrage. Consigne du responsable : **cadrage seulement** (domaine, scénarios, questions au PO avec une reco chacune), puis `CADRAGE PRÊT`. Le TDD attend l'annonce `[Responsable] MAIN A BOUGÉ : #72 mergée`. Aucune E2E contre savanturier-dev avant cette annonce.
- Dépendances mergées : #24, #25, #27, #65. Stories voisines en cours : #28, #26, #72 (ne pas toucher leurs agrégats).
- 12:30 UTC : `domain-modeler` : modèle sans agrégat ni table, cabane recalculée à la lecture à partir des meilleures étoiles (`resultats_des_lecons`, lecture sous RLS déjà faite par #25). Ni migration ni Edge Function : le verrou `base` n'est pas nécessaire. Questions 32.1 à 32.20.
- 12:30 → 13:20 UTC : `po-acceptance` interrompu par la limite d'utilisation, sans rien écrire ; relancé après le redémarrage de la session.
- 13:45 UTC : `po-acceptance` : 6 règles, 28 scénarios (34 cas), 17 `@a-valider`, 3 `@acces`. `bddgen` : syntaxe OK, 13 étapes à définir. Nouvelles questions 32.21 à 32.24 (32.21 : mettre à jour 4 scénarios de #65 dans la même PR).
- CADRAGE PRÊT publié sur #32 ; attente de la validation du PO par une annonce `[Responsable]`.
- 13:35 UTC : remarque du responsable (décision 0021) : « profil de démonstration » n'existe plus. `po-acceptance` le remplace par « profil préparé, sans profil réel au serveur » (scénario de 32.14/32.22, questions 32.14, 32.21, 32.22) ; les étapes qui écrivent des étoiles en base supposent un profil réel (`profil-reel.ts`).
- 13:43 UTC : `[Responsable] VALIDÉ` sur #32 (« OK #32 reco partout ») ; `po-acceptance` consigne la validation, retire les 17 `@a-valider`, met à jour 5 scénarios de #65 (décision 32.21).
- 13:45 UTC : `[Responsable] MAIN A BOUGÉ : #72 mergée` (#64). Intégration de `main` `aaae2e6` : conflit sur `glossaire.md` (conflits n°6 et n°7 ajoutés des deux côtés) ; les deux ajouts gardés, ceux de #32 renumérotés n°8 et n°9. 1675 tests verts. Merges : désormais faits par le PO après `PRÊTE À MERGER`.
- TDD, bloc 1 (domaine de la cabane) : B1 paliers (`96d3f70` → `4050cee`), B2 total des étoiles (`5cdd2f1` → `ce32b68`), B3 état de la cabane (`4035c1c` → `f1b2226`, + `f20f6dc` formatage du test), B4 objet reçu par la séance (`27f465b` → `0c75388`). 1711 tests verts.
- Revue intermédiaire du bloc 1 (delta `782f411..0c75388`) : À CORRIGER, 2 bloquants (tests de bornes manquants pour `cabaneDe` et pour « leçon à 1 rejouée à 3 »), aucun bug. Correction en cours, plus 2 refactors non bloquants.
- Revue intermédiaire du bloc 1 après corrections : APPROUVÉ (dernier commit relu `bdf9fa6`). Non-bloquants restants : nom d'un test, test de l'invariant 10 peu parlant, `TotalDEtoilesInvalide` à ajouter au modèle.
- Bloc 2 (paroles, Mes médailles) : B5 `fe2b0c4` → `adffdce`, B6 `0f291a0` → `b3e483a`. Revue intermédiaire : À CORRIGER (1 bloquant : « rien à montrer » coupait aussi la lecture de l'écran avec « tout lire », brief de l'orchestrateur erroné), corrigé `5f31545` → `9cef9f4`, puis APPROUVÉ (dernier commit relu `9cef9f4`). 1755 tests verts.
