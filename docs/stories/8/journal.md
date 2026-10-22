# Journal : issue #8, PWA installable

- 15:49 · Issue créée (lot 1). Branche de base : `main`. Branche de travail imposée par la session : `claude/stoic-faraday-0qy6ez`.
- 15:49 · Étape 1 sautée : story technique, sans nouveau concept ni règle métier.
- 15:57 · Étape 2 : critères d'acceptance écrits par `po-acceptance` (`features/8-*.feature`, `docs/stories/8/acceptance.md`). Syntaxe vérifiée par `npx bddgen` (étapes à écrire par `e2e-tester`).
- 15:57 · ⛔ Validation humaine n°1 demandée pour tout le lot 1 (décision de démarrage n°2).
- 16:09 · Validation n°1 : « OK » du PO pour les propositions du lot (détail dans `docs/stories/lot-1-decisions.md`). Modèle et scénarios mis à jour. Questions restantes non bloquantes, listées dans `acceptance.md`.
- 19:59 · Étape 3 lancée (« ok » du PO). Story technique sans règle métier : pas de test Deno. On travaille **de l'extérieur vers l'intérieur** : les step definitions E2E sont écrites d'abord et doivent échouer (rouge), puis l'implementer les fait passer.
- 19:59 · Arbitrages de l'orchestrateur : les scénarios de #8 tournent sur le **build de production** (`vite preview`), seul endroit où le service worker est actif ; la bibliothèque est servie au nouveau front à partir de `app/bibliotheque.json` (sans copie à la main) ; le scénario `@acces` « Sans réseau, aucune donnée de la famille… » dépend de la déconnexion (#5) : il sera branché avec #5.
- 20:06 · Rouge : step definitions 2de432e, 10 scénarios sur 14 rouges pour la bonne raison (pas de manifeste, pas de service worker, pas d'aide iPad), 4 verts (garde « pas d'invitation » et largeurs). Config dédiée `playwright.pwa.config.ts` (build + preview, relais de test pour simuler une nouvelle version). Contrat : manifeste, icônes PNG 192/512, `/sw.js` avec `const VERSION`, cache `savanturier-<VERSION>`, réseau d'abord pour la bibliothèque et les navigations, `skipWaiting` sans `clients.claim` ni rechargement.
- 20:10 · Vert : 5a0f964, 67815c5, 322639e. PWA 28/28, non-régression 140/140, 103 tests Deno. Dette signalée : iPad récents (user agent « Macintosh ») sans aide ; 67815c5 ne compile pas seul (l'import arrive au commit suivant). Étape 4 : review.
