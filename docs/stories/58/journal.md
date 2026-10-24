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
- 23:00 UTC — E2E (e2e-tester), steps sur écrans réels : téléphone 520/523 (stories livrées + #58), PWA 32/32.
  Les 3 rouges attendus sont ceux de `58-retirer-la-page-de-demonstration.feature` (la page est encore servie en dev) :
  ils exigent le retrait. Le scénario #8 « Une nouvelle version s'applique au lancement suivant » est vert.
  « Un profil enfant préparé ne fait jouer personne » (PWA) passe déjà : la porte est fermée en production.
  Écarts notés : (1) la voix bloquée n'est signalée qu'une fois par vie de page, sur la page de la leçon, et le message
  disparaît à l'entrée en séance → les scénarios « voix bloquée » de #7 ouvrent la séance par son adresse (dette à
  signaler) ; (2) sans voix, la dernière bonne réponse mène tout de suite à la fin de séance → `repondre` et « la question
  … est réussie » acceptent aussi l'écran de fin.
- 23:10 UTC — Câblage (implementer) : `src/demonstration/` supprimé, profil préparé déplacé dans `src/famille/profils/` sous `import.meta.env.DEV`, écran `demonstration` retiré ; décision 0021 écrite (`f017d4b`, `230de39`). 34/34 scénarios `@issue-58` verts (téléphone), tsc, build, deno test (1323), lint, fmt verts ; `dist/` sans page ni porte de test. Revue complète lancée.
