# Journal de #146 — Parents de test réutilisés (quota MAU)

- Base : `main` (5574d75). Branche : `feature/146-parents-de-test-reutilises`. Décision réservée : 0040.
- 2026-11-03 ~19:30 UTC : démarrage. Étape 1 (domaine) sautée : outillage de test, aucun concept métier. Étape 2 : cadrage court (`cadrage.md`) au lieu de scénarios Gherkin, les critères étant ceux de l'issue.
- Sonde `admin/users?per_page=1` : 504 en 41 s. Le projet de dev est de nouveau lent.
- 19:37 UTC : réponse du PO (annonce [Responsable] sur #146 et #64) « 146 reco tout » : 146.1 A, 146.2 (E2E_EQUIPE, sinon n° de branche, sinon `local`), 146.3 (pas de purge), 146.4 (Deno.test du module pur). `graphe:dev`. Runs E2E suspendus pour toutes les équipes (POST admin/users en 504), #146 3e dans la file `base`.
- TDD, 3 cycles RED → GREEN (module pur `features/support/parents-de-test.ts`, 11 tests) :
  1. suffixe stable `<équipe>-<projet><index>` : `a53b307` → `0ad33c2` ;
  2. équipe tirée de `E2E_EQUIPE`, de la branche ou `local`, valeur refusée hors `[a-z0-9-]` : `8d23c15` → `84602ae` ;
  3. plafond (15 × 2 × 3 × 5 = 450, garde-fou < 500) : `a2e2e6f` → `69ed181`.
  Choix : un cycle par groupe de règles d'une même fonction (outillage, pas de domaine).
- Câblage délégué à `implementer` : fixtures, supabase-test (recherche filtrée + cache), famille (réutilisation, adresses « libres » `prenom.libre+<suffixe>` pour les scénarios « aucun parent n'utilise… », supprimées en fin de scénario), étape « est inscrit avec … mot de passe … ».
  Pourquoi une variante « libre » : sans elle, chaque inscription de #72/#73 supprimerait aussi le Paul réutilisé, recréé au scénario suivant (2 MAU au lieu d'1).
- 19:51 UTC : VERROU base accordé (le PO fait passer #146 en premier). Sonde 1,1 / 0,6 / 0,5 s. `SUPABASE_ACCESS_TOKEN` renouvelé : accepté pour le projet. Filtre `?filter=` de l'API d'administration vérifié (recherche sur une partie de l'adresse). 140 utilisateurs Auth avant tout run.
- 19:52 UTC : mise au point lancée sur `telephone` (`@issue-72|73|11|10`, 178 scénarios, 1 worker, `E2E_EQUIPE=146`), sur `b87f5d2`.
- Review cycle 1 : À CORRIGER. Bloquants : (1) `preparerUnParent` remettait un mot de passe aléatoire à chaque appel, y compris en plein scénario (#72 : 2 scénarios cassés) ; (2) aucun effacement au début du scénario des restes d'un scénario interrompu, alors que les suffixes sont désormais stables. Corrections déléguées à `implementer` dans un worktree isolé, pour ne pas changer le code pendant le run.
