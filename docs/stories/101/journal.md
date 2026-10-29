# Journal de la story #101 : Quête du jour

Équipe lancée par le responsable des équipes (vague 1, issue de coordination #64).
Session : session_015z4jmMTUpiQCpeV3tPiLYu. Branche : `feature/101-quete-du-jour`, partie de `main` `439d4a2`.
Branche de base : `main`. Décision réservée : 0037.

## Étape 0 : préparation (2026-10-29 08:50 UTC)

- Issue #101 lue (aucun commentaire). Dépendances mergées : #99 (`c8b0ed3`), #96, #97, #98 (98a), #102 (`439d4a2`).
- Story voisine : #100 (défi de fin de chapitre), pas encore lancée. Coordination par #64 si fichiers communs.
- Constat à la lecture du glossaire : l'accueil de l'enfant a déjà une **Leçon du jour** (#29, Apprentissage), des **Tuiles du jour** (révision « À revoir », devoirs, test de départ) et un **Objectif du jour** (Motivation, 2 leçons). « mission du jour » y est un **synonyme interdit** de Leçon du jour et d'Objectif du jour. La « quête du jour » recouvre en grande partie ces concepts : à poser au PO (ne pas créer un doublon).

## Étape 1 : modèle de domaine (09:00 UTC)

- `domain-modeler` (`4a3a609`) : contexte Motivation. Option recommandée B : quête du jour **calculée, jamais enregistrée** (fonctions pures `queteDuJour`, `queteAccomplieParLaSeance` dans `motivation/domain/quete-du-jour.ts`), révision d'abord sinon la leçon du jour (inchangée). Aucun agrégat, aucune migration, aucune Edge Function : pas de verrou `base` si le PO suit B. Récompense : la fête seule. Termes `(à valider)` : Quête du jour, Quête accomplie. Questions #101.1 à #101.15 (capitale : #101.6, nature du concept).

## Étape 2 : critères d'acceptance (09:15 UTC)

- `po-acceptance` (`dd40c2d`) : `features/101-quete-du-jour.feature`, 6 règles, 37 scénarios (42 cas), 33 `@a-valider`. Aucun scénario ni step existant modifié. Questions #101.16 à #101.22.
- `CADRAGE PRÊT` publié sur #101. Attente de la validation du PO par le responsable : pas de TDD avant.
