---
name: tdd
description: Règles du Test-Driven Development (red/green/refactor) appliquées au projet (Deno.test, Edge Functions Supabase, fakes in-memory). À utiliser pour écrire un test unitaire, écrire du code de production ou vérifier la discipline TDD en review.
---

# TDD dans ce projet

## Le cycle

1. **RED** : écrire **un** test qui échoue, pour la bonne raison : une assertion, ou un module ou symbole pas encore créé.
2. **GREEN** : écrire le code **le plus simple** qui le fait passer. Les techniques *Fake it* (renvoyer une constante) et *Obvious implementation* sont permises.
3. **REFACTOR** : avec tous les tests au vert, améliorer le code **et** les tests, sans ajouter de comportement.

On recommence ensuite avec le comportement suivant. La triangulation se fait par un deuxième exemple qui force la généralisation.

## Les 3 lois

1. Pas de code de production sans un test qui échoue.
2. Pas plus de test qu'il n'en faut pour échouer.
3. Pas plus de code de production qu'il n'en faut pour passer le test.

## Dans quel ordre écrire les tests (ZOMBIES)

**Z**ero → **O**ne → **M**any → **B**oundaries → **I**nterface → **E**xceptions → **S**imple scenarios.

Exemple générique pour un panier (les exemples de ce skill montrent la forme, pas des règles de Savanturier) :
1. un panier vide a un total de 0
2. un article
3. plusieurs articles
4. une quantité au maximum autorisé
5. un article refusé

## Niveaux de test

| Niveau | Quoi | Dépendances | Proportion |
|---|---|---|---|
| Domaine | value objects, entités, agrégats, invariants | aucune | la majorité |
| Cas d'usage | orchestration, appels aux ports, événements émis | fakes in-memory des ports | moyen |
| Acceptance / E2E | scénarios Gherkin (BDD), RLS, câblage | vraie stack locale | un par scénario |

Les policies RLS et le câblage (handler, repository Supabase) sont couverts par les scénarios E2E, notamment ceux tagués `@acces`.

Cas particuliers du projet :
- **Front React** : il ne contient pas de règle métier, donc pas de test unitaire de composant. Ce qu'il affiche est couvert par les scénarios E2E. Une règle dont le front a besoin hors ligne est testée **dans `domain/`**, puis importée.
- **Pipeline de contenu** (`scripts/`, Python) : même cycle red/green/refactor avec pytest. Les tests sont dans `scripts/tests/test_<module>.py` et se lancent avec `python3 -m pytest scripts/tests`. Les leçons elles-mêmes sont des données : elles sont validées par le build (citations vérifiées mot pour mot) et par un test de schéma de `app/bibliotheque.json`.
- **Legacy (`app/`)** : pas de TDD rétroactif. Avant de corriger un bug, on écrit un **test de caractérisation** Playwright qui le reproduit, dans `tests/legacy/`, lancé avec `npx playwright test -c playwright.legacy.config.ts`.

## Conventions Deno

- Le fichier de test s'appelle `xxx_test.ts` et se place à côté de `xxx.ts`.
- On lance un fichier avec `deno test chemin/xxx_test.ts` et toute la suite avec `deno test --permit-no-files supabase/functions/`.
- Le nom du test est une **phrase métier** au présent, en français.
- Le test importe `@std/assert` (import map de `deno.json`). Le code testé (`domain/`) n'importe que des chemins relatifs avec l'extension `.ts`, pour rester chargeable par Vite.

```ts
import { assertEquals, assertThrows } from "@std/assert";
import { Quantite } from "./quantite.ts";
import { QuantiteInvalide } from "./erreurs.ts";

Deno.test("une quantité doit être strictement positive", () => {
  assertThrows(() => Quantite.de(0), QuantiteInvalide);
});

Deno.test("deux quantités de même valeur sont égales", () => {
  assertEquals(Quantite.de(3).equals(Quantite.de(3)), true);
});
```

### Cas d'usage avec fake in-memory

```ts
// _shared/commande/test_utils/in-memory-commande-repository.ts
import type { CommandeRepository } from "../application/ports.ts";
import type { Commande, CommandeId } from "../domain/commande.ts";

export class InMemoryCommandeRepository implements CommandeRepository {
  private readonly stock = new Map<string, Commande>();
  async parId(id: CommandeId) { return this.stock.get(id.valeur) ?? null; }
  async enregistrer(c: Commande) { this.stock.set(c.id.valeur, c); }
}
```

```ts
Deno.test("valider une commande émet l'événement CommandeValidee", async () => {
  // Arrange
  const repo = new InMemoryCommandeRepository();
  const commande = uneCommande().avecUneLigne().construire();
  await repo.enregistrer(commande);
  // Act
  const evenements = await new ValiderCommande(repo).executer({ commandeId: commande.id.valeur });
  // Assert
  assertEquals(evenements.map((e) => e.type), ["CommandeValidee"]);
});
```

Les **builders** de test (`uneCommande()…construire()`) vont dans `test_utils/` pour garder des tests courts et lisibles.

## Traçabilité dans Git

Chaque comportement produit cette séquence de commits :

```
test(#42): une commande validée ne peut plus recevoir de ligne (red)
feat(#42): une commande validée ne peut plus recevoir de ligne
refactor(#42): extraction du value object StatutCommande      ← si utile
```

Le reviewer vérifie cet ordre. Un `feat` sans `test … (red)` avant lui est **bloquant**.

## Anti-patterns (refusés en review)

- Tester l'implémentation (méthodes privées, ordre d'appels internes) au lieu du comportement.
- Un test qui passe dès sa première exécution.
- Modifier l'assertion d'un test pour le faire passer.
- Utiliser des mocks du domaine, ou une librairie de mock. On utilise des fakes, et seulement pour les ports.
- Accéder au réseau, à Supabase, à `Deno.env` ou à l'horloge réelle dans un test unitaire. L'horloge s'injecte via un port `Horloge`, le hasard (tirage d'exercices, ordre des bulles) via un port `Hasard`, les identifiants via `GenerateurId`.
- Écrire un test fourre-tout avec 10 assertions sur des sujets différents.
- Utiliser `Deno.test.ignore` / `only` dans un commit.
