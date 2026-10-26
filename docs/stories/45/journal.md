# Journal : issue #45, Mise en ligne de Savanturier (45a, beta)

Équipe lancée par `/graphe` (vague 1), session `session_01WcPFH47e6wiF4owyQPrnFY`. Branche de base : `main`. Branche : `feature/45-mise-en-ligne`, partie de `main` `953f527`.
Décision réservée : 0025 (hébergement de la beta).

## 2026-10-26

- 15:31 UTC : démarrage. Dépendances toutes mergées (dont #8 et #73). Cadrage validé le 2026-10-25 ; 45.31 = B et 45.32 = reco (commentaire `[Responsable]` du 26/10, 15:30 UTC).
- Étape 1 sautée : story d'infrastructure, aucun agrégat (cadrage validé, `domain-model.md`).
- Étape 2 réduite : consigner 45.31 et 45.32 dans `acceptance.md`, lever `@depend-de-73` après vérification (`po-acceptance`).
- Pas d'E2E lourd sur `savanturier-dev` avant le résultat de la non-régression de `main` `953f527` (#33).
- Constat : Andika est déjà chargée par `@fontsource/andika` (`src/main.tsx`, depuis #12) et ses `woff2` passent dans `/assets/`, donc dans la coquille du service worker. C2 se réduit à le prouver par les scénarios de la règle 4.
- Environnement : contournement Playwright posé hors du dépôt (lien `chromium_headless_shell-1194` → 1243, `chrome-linux`, `headless_shell`).

### Choix techniques de l'orchestrateur

- Vérifications scriptées (V1 à V12) et configuration d'Auth de production : **Python** (bibliothèque standard seulement) sous `scripts/exploitation/`, tests pytest dans `scripts/tests/`. Ce n'est pas du code métier ; Python et pytest sont déjà la pile de `scripts/`. Fonctions pures testées, appels HTTP derrière une petite interface remplacée par un faux dans les tests.
- Pages légales : écrans du parent au sens de #73 (`estUnEcranDuParent`, contexte Famille) ; identité de l'éditeur et adresse de contact lues dans l'environnement du build (jamais dans le dépôt), valeurs fictives en développement, et le build de production refusé par V1 s'il contient encore ces valeurs fictives.
- 15:45 UTC : critères (`c65d639`) : 45.31 et 45.32 consignées ; `@depend-de-73` levé. La dernière étape du scénario du personnage guide devient « Mais Paul n'entend aucune voix » (step existant de #73, même sens ; aucun step « le personnage guide ne lit rien de lui-même » n'existait). À brancher : le `Before({ tags: "@issue-73" })` de `aucun-son-cote-parent.steps.ts` doit aussi couvrir ce scénario.
- 15:46 UTC : poussé (`c65d639`). Bloc A (Famille) : cycle 1 « les pages légales sont des écrans du parent ».
