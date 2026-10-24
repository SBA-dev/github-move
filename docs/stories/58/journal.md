# Journal de la story #58 — Retirer la page de démonstration

Équipe lancée par `/graphe` (vague 1, issue de coordination #64). Session `session_01UrFnZGZrth8J7SBSgrsTuB`.
Branche `feature/58-retirer-la-page-de-demonstration`, partie de `main` `c7cabc0`. Branche de base : `main`.

## 2026-10-24

- 21:35 UTC — Démarrage. Lecture de #58 et de #64. Aucun numéro de décision réservé (prochain libre : 0021).
- 21:40 UTC — Étape 1 (domain-modeler) **sautée** : la story ne crée ni concept ni règle métier. Elle retire un écran de test
  et déplace des scénarios existants vers des écrans réels (séance, « Qui joue ? »). La porte de test des E2E est un
  choix d'outillage, pas un concept du domaine : il sera tranché à la ⛔ n°1 (question #58.1) puis consigné en décision.
- 21:32 UTC — RELIS #64 : #27 (≈ 50 scénarios, vrai profil via `profil-reel.ts` pour `@issue-27`) et #65 (vrai profil pour
  `@issue-65`, et un scénario 65.15 joué avec le profil préparé **sans compte parent**) utilisent les steps « profil enfant
  préparé ». Contrainte de transition : garder ces steps, leur branchement `@issue-25/27/65`, et la clé
  `savanturier:profil-prepare` lisible en développement.
- 21:55 UTC — Étape 2 (po-acceptance) : 27 scénarios réécrits, 7 supprimés, 5 ajoutés (`@issue-58 @a-valider`), tableau de
  correspondance dans `acceptance.md`, questions #58.1 à #58.11. Point marquant : #58.8 (la consigne d'un exercice disparaît
  après sa lecture, et aussitôt sans voix). Cause du rouge de #8 : l'étape « Léa relance Savanturier » de `voix.steps.ts`
  ouvre `/demonstration`.
- CADRAGE PRÊT publié sur #58, APPRIS sur la transition de la porte de test. Attente de la ⛔ n°1.
- 21:44 UTC — RELIS #64 : décision **0021** réservée à #58 (porte de test), à écrire seulement après le OK du PO sur #58.1. Cadrage transmis au PO.
- 21:56 UTC — ⛔ n°1 levée : « OK #58 reco partout » (annonce [Responsable] du 21:56 sur #64). 58.8 hors story (le responsable ouvre la story de correction). Décision 0021 à écrire.
- Étape 3 (TDD) : aucun comportement unitaire. La story ne touche aucun code de `domain/` ; elle retire du front et des steps. Les scénarios E2E rouges de #58 et #8 (adresse /demonstration, profil préparé ignoré dans la version publiée) exigent le code : steps d'abord (e2e-tester), puis retrait (implementer).
