# 0003 : Domaine partagé entre le serveur et le front

**Statut** : Acceptée · 2026-10-22

## Contexte

Un enfant doit pouvoir faire ses exercices sans réseau, par exemple en voiture. Or la règle « pas de logique métier dans React » imposerait un appel au serveur pour chaque correction.

## Décision

Le code de `supabase/functions/_shared/<contexte>/domain/` est du **TypeScript pur** : imports relatifs avec l'extension `.ts`, aucun import `jsr:`/`npm:`, aucune API Deno, DOM ou réseau. Le front l'importe via l'alias Vite `@domain/<contexte>`.
- Les résultats faits hors ligne sont stockés dans IndexedDB, puis synchronisés.
- Le serveur reste la source de vérité : le cas d'usage revalide chaque résultat à la synchronisation.

## Conséquences

- Une règle n'existe qu'à un seul endroit et n'est testée qu'une fois (`Deno.test`).
- Le front ne contient toujours aucune règle métier écrite à la main.
- L'heure, le hasard et les identifiants passent par des ports (`Horloge`, `Hasard`, `GenerateurId`).
