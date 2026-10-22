# Journal : issue #6, Design, univers et personnage guide

- 15:49 · Issue créée à partir du comportement actuel de `app/` (lot 1). Branche de base : `main`. Branche de travail imposée par la session : `claude/stoic-faraday-0qy6ez`.
- 15:49 · Étape 1 : délégation à `domain-modeler` (univers et personnage guide déjà au glossaire ; humeurs du personnage guide à modéliser).
- 15:57 · Étape 2 : critères d'acceptance écrits par `po-acceptance` (`features/6-*.feature`, `docs/stories/6/acceptance.md`). Syntaxe vérifiée par `npx bddgen` (étapes à écrire par `e2e-tester`).
- 15:57 · ⛔ Validation humaine n°1 demandée pour tout le lot 1 (décision de démarrage n°2).
- 16:09 · Validation n°1 : « OK » du PO pour les propositions du lot (détail dans `docs/stories/lot-1-decisions.md`). Modèle et scénarios mis à jour. Questions restantes non bloquantes, listées dans `acceptance.md`.
- 16:21 · Étape 3 : boucle TDD lancée (« ok » du PO). Comportements : catalogue des univers ; clé inconnue → animaux ; humeurs ; feliciter ; encourager et présentations. Le caractère de la voix est laissé à #7.
- 16:23 · Cycle 1 (catalogue des univers) : red b9e06a5, green 05b136c. Outillage : import map `@std/assert` versionnée dans `deno.json` (le lint refusait l'import `jsr:` sans version).
- 16:24 · Cycle 2 (univers par défaut) : red 4ad448d, green 5a705b5, refactor 1d2dd0a.
- 16:25 · Cycle 3 (humeurs) : red 2de642d, green 43a6f6e (pas de refactor nécessaire).
- 16:26 · Cycle 4 (félicitations) : red 118ea56, green 56e5739. Écart au modèle : `expressions` en `readonly string[]` (évite un import circulaire). Un `throw` non exigé par un test pour un tirage hors [0,1[ : à signaler à la review.
- 16:27 · Cycle 5 (encouragements, présentations) : red 84bbbf1, green 8964eab. 34 tests verts. Domaine de #6 terminé.
- 16:30 · Étape 3 (câblage) : délégué à `implementer`. Choix de l'orchestrateur, en application des décisions 1 et 2 : page `/demonstration` disponible seulement en dev ou avec `VITE_PAGE_DEMONSTRATION=1`, profil préparé lu dans `localStorage` (`savanturier:profil-prepare`), retiré au lot 2 ou 3.
- 16:30 · Câblage : daa1a95, d13dfcd. tsc, build, 34 tests Deno et socle E2E verts. Étape 4 : review.
- 16:34 · Review 1 : À CORRIGER (1 bloquant : `throw` sans test). Cycle red 6250d6a / green 57f4fdc (`TirageHorsIntervalle`). Non bloquants traités : `reagirALaReponse` dans le domaine (red 75ca5b5 / green cd0d178), refactor f84feb9 (page de démonstration hors du bundle de production, plus d'`overflow-x: clip`, plus de `as`, navigation vers l'écran courant ignorée). Relance de la review sur le delta.
- 16:35 · Review 2 : APPROUVÉ. Non bloquants laissés : NaN non refusé par `tirage` (Math.random ne renvoie jamais NaN), `as string` dans `tirerDans` (catalogue testé), booléen de `reagirALaReponse` (à revoir au lot 3). Étape 5 : E2E.
