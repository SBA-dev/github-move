# Journal : issue #5, Connexion du parent par lien magique

- 15:49 · Issue créée à partir du comportement actuel de `app/` (lot 1 de `docs/reecriture.md`). Branche de base : `main`. Branche de travail imposée par la session : `claude/stoic-faraday-0qy6ez`.
- 15:49 · Validation des scénarios par lot (décision de démarrage n°2) : les scénarios des issues #5 à #8 sont présentés ensemble.
- 15:49 · Première vérification Supabase (`npx supabase link`) impossible : les secrets `SUPABASE_*` ne sont pas présents dans cette session.
- 15:49 · Étape 1 : délégation à `domain-modeler` (nouveaux concepts : compte du parent, connexion).
- 15:57 · Étape 2 : critères d'acceptance écrits par `po-acceptance` (`features/5-*.feature`, `docs/stories/5/acceptance.md`). Syntaxe vérifiée par `npx bddgen` (étapes à écrire par `e2e-tester`).
- 15:57 · ⛔ Validation humaine n°1 demandée pour tout le lot 1 (décision de démarrage n°2).
- 16:09 · Validation n°1 : « OK » du PO pour les propositions du lot (détail dans `docs/stories/lot-1-decisions.md`). Modèle et scénarios mis à jour. Questions restantes non bloquantes, listées dans `acceptance.md`.
- 20:28 · Validation n°1 : « OK » du PO (lot 1). Branche `feature/5-connexion-du-parent`, partie de `claude/stoic-faraday-0qy6ez` (PR du lot 1 pas encore mergée, accord du PO pour continuer sans attendre). Elle sera remise sur `main` après le merge.
- 20:28 · Environnement : seul `SUPABASE_DB_PASSWORD` est présent (ni `SUPABASE_URL`, ni `SUPABASE_ANON_KEY`, ni `SUPABASE_ACCESS_TOKEN`), et pas de démon Docker. On fait le domaine et les cas d'usage (TDD, fakes) ; l'adaptateur Supabase Auth, le front et les E2E attendent les secrets.
- 20:28 · Arbitrage (décision 0008, même règle) : le port `ServiceDeConnexion` et les cas d'usage, qui tournent dans le navigateur et ne dépendent que de ports du domaine, vont dans `famille/domain/` (importable par `@domain/famille`) plutôt que dans `application/`. Code de connexion : exactement 6 chiffres, espaces refusés tant que la question ouverte n°2 n'est pas tranchée.
- 20:28 · Étape 3 : boucle TDD. Comportements : AdresseEmail ; CodeDeConnexion ; demander un lien de connexion ; ouvrir la connexion avec le code ; se déconnecter.
