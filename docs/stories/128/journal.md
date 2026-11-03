# Journal de la story #128 : claviers (dictée, calcul, fluence), tranche 98d

- Branche de base : `main` (`8757070`). Branche : `feature/128-claviers`.
- Équipe lancée par `/graphe` (responsable : session_016aXZVAP1dRD9CgMXRrkfWN), coordination sur #64.
- Session de l'équipe : session_015z4jmPJeZcnAf9RQ9eDXm9.

## 2026-11-02

- 23:00 UTC : démarrage. Lu #128 (règles 1 à 5, 6e règle « dessin par univers »), annonces [Responsable] de #64.
- Étape 1 : `domain-modeler` lancé (lecture pure dans `RecordDeFluence`, habillage par univers des cases, touches et marque).
- Étape 1 faite : `docs/stories/128/domain-model.md`. Lecture pure `RecordDeFluence.estDepassePar(score)`, règles R1 à R6, 36 dessins (6 univers), 12 questions ouvertes. Glossaire : 2 ajouts en fin de section Apprentissage. Point de fusion signalé : `src/seance/EcranDeSeance.tsx` (prop du record vers `ExerciceDeFluence`).
- Étape 2 : `po-acceptance` lancé.
- Étape 2 faite : `features/128-claviers.feature` (52 scénarios, 11 `@a-valider`), `docs/stories/128/acceptance.md`. Questions #128.13 et #128.14 ajoutées.
- CADRAGE PRÊT publié sur #128, en attente de la validation du PO (annonce [Responsable] sur #64).

## 2026-11-03

- 00:36 UTC : RELIS #64. Cadrage présenté au PO (validation n°1, 23:06 UTC), pas encore de réponse. À SAVOIR de #127 noté : `EcranDeSeance.tsx`, `useDeroulementDeSeance.ts` et `styles.css` (bloc `@media (max-width: 480px)` avec `.addition-posee`) bougeront à l'intégration de `main` ; vérifier le clavier de cristaux dans l'addition à 360 px après le merge de #127.
- 06:40 UTC : validation n°1 levée (annonce [Responsable] sur #64 et #128) : « 128 reco tout ». Toutes les recos #128.1 à #128.14 retenues. Merge de #127 autorisé : intégrer `main` après son merge.
- Report des réponses (`po-acceptance`) et RED de `RecordDeFluence.estDepassePar` (`test-writer`) lancés en parallèle.
- 06:42 UTC : TDD, comportement 1/1 du domaine vert : `RecordDeFluence.estDepassePar` (RED `ce34c1b`, GREEN `fe69fed`, `proposer` la réutilise). 2787 tests verts.
- 06:45 UTC : intégration de `main` après le merge de #127 (`227ec44`), sans conflit (`55b2247`). Tests unitaires et `tsc` verts. Le clavier dans l'addition à 360 px sera vérifié après le câblage du clavier.
- 06:50 UTC : planches de dessins (`implementer` en illustrateur) et revue delta du bloc domaine (`mr-reviewer`, `ce34c1b..fe69fed`) lancées en parallèle.
- 06:55 UTC : revue delta du bloc domaine (`ce34c1b..fe69fed`) : APPROUVÉ, aucun bloquant. Non bloquants notés : identifiant `dépasse` accentué dans le test (à renommer en `depasse` au prochain passage de `test-writer`), garde redondante assumée dans `proposer`, refactor dans le commit `feat`. Dernier commit relu : `fe69fed`.
- 06:56 UTC : `e2e-tester` écrit les étapes de `@issue-128` (sans exécution) et le contrat des repères DOM pour le câblage.
