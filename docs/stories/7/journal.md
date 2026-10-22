# Journal : issue #7, Voix : lecture à voix haute par le personnage guide

- 15:49 · Issue créée à partir du comportement actuel de `app/` (lot 1). Branche de base : `main`. Branche de travail imposée par la session : `claude/stoic-faraday-0qy6ez`.
- 15:49 · Étape 1 : délégation à `domain-modeler` (règles du choix de la voix et du caractère du personnage guide).
- 15:57 · Étape 2 : critères d'acceptance écrits par `po-acceptance` (`features/7-*.feature`, `docs/stories/7/acceptance.md`). Syntaxe vérifiée par `npx bddgen` (étapes à écrire par `e2e-tester`).
- 15:57 · ⛔ Validation humaine n°1 demandée pour tout le lot 1 (décision de démarrage n°2).
- 16:09 · Validation n°1 : « OK » du PO pour les propositions du lot (détail dans `docs/stories/lot-1-decisions.md`). Modèle et scénarios mis à jour. Questions restantes non bloquantes, listées dans `acceptance.md`.
- 16:41 · Étape 3 : boucle TDD lancée (« ok » du PO). Comportements : caractère de la voix de chaque personnage guide ; nettoyage du texte ; découpage en phrases ; score et tri des voix françaises ; choix de la voix automatique ; voix d'une autre langue ; réglage des phrases.
- 16:41 · Arbitrage de l'orchestrateur (questions 3 et 5 du modèle) : `CaractereDeLaVoix` est publié par le sous-domaine générique Voix (amont) et importé par Motivation, plutôt que l'inverse : un sous-domaine générique ne dépend pas d'un contexte métier. Voix déclare sa propre interface `Hasard` (même forme que celle de Motivation) pour ne dépendre de rien.
- 16:43 · Cycle 1 (caractère de la voix) : red 6179c63, green 7d926c4, refactor ef57299. Au passage : les steps E2E de #6 cassaient `tsc` (corrigé, 6e3e0d4).
- 16:44 · Cycle 2 (texte à lire) : red bb50e94, green 6386326.
- 16:46 · Cycle 3 (score, tri, choix de la voix) : red 5f84443 et 9a90a19, correction de l'exemple de score (70 et non 110, erreur de consigne de l'orchestrateur) c712373, green 4d04893 et suivant. 62 tests.
