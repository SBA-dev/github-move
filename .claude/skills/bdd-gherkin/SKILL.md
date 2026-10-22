---
name: bdd-gherkin
description: Écrire des scénarios Gherkin de qualité en français (example mapping, style déclaratif, couverture des droits) et les exécuter avec playwright-bdd. À utiliser pour rédiger des critères d'acceptance ou écrire des step definitions E2E.
---

# BDD et Gherkin dans ce projet

## 1. Example mapping (avant d'écrire)

Pour chaque story, on dresse quatre listes :
- 🟨 **Story** : l'objectif
- 🟦 **Règles** métier : une carte par règle
- 🟩 **Exemples** : 2 à 4 par règle, concrets, avec de vraies valeurs
- 🟥 **Questions** : tout ce qui n'est pas sûr

S'il y a plus de 6 règles, la story est probablement trop grosse et doit être découpée.

## 2. Écrire de bons scénarios

### Déclaratif, pas impératif

❌ Impératif, couplé à l'interface :
```gherkin
Quand je saisis "jean@test.fr" dans le champ "#email"
Et je clique sur le bouton "Envoyer"
Et j'attends 2 secondes
Alors je vois la div ".alert-success"
```

✅ Déclaratif, dans le langage métier :
```gherkin
Quand j'invite "jean@test.fr" dans mon équipe
Alors "jean@test.fr" apparaît dans les invitations en attente
```

Dans Savanturier, l'enfant agit sur des exercices. On décrit **sa réponse**, pas le geste :

❌ `Quand Léa touche la bulle "7"` · ✅ `Quand Léa répond 7 à « 3 + 4 »`

### Règles

- **Given** (`Étant donné`) décrit le contexte, c'est-à-dire un état, pas une suite d'actions.
- **When** (`Quand`) contient **une seule** action métier.
- **Then** (`Alors`) décrit un résultat **observable par l'utilisateur**, jamais un état de la base.
- Un scénario contient 3 à 7 étapes et illustre **une** règle.
- Le titre du scénario énonce la règle ou l'exemple : *« Une invitation expire au bout de 7 jours »*.
- On utilise `Contexte` (Background) seulement pour un préambule court et commun à tous les scénarios.
- On utilise un `Plan du Scénario` avec des `Exemples` quand seules les données changent.
- On n'emploie que les termes de `docs/domain/glossaire.md`.

### Couverture minimale par règle

1. le cas nominal
2. les cas limites (bornes, vide, maximum)
3. les cas d'erreur, avec le message visible par l'utilisateur
4. les **droits d'accès** (`@acces`) : qui peut, et surtout qui **ne peut pas**, par exemple un autre utilisateur, un utilisateur d'un autre compte ou un visiteur anonyme. Ces scénarios vérifient la RLS.
   Dans Savanturier, le cas type est : un parent ne voit ni ne modifie jamais les profils, la progression ou les enregistrements des enfants d'une autre famille.

## 3. Modèle de fichier

`features/<n>-<slug>.feature`

> Exemple **générique** qui montre la forme attendue. Ses règles (équipe, invitation) ne sont pas celles de Savanturier : on n'en recopie jamais le contenu.

```gherkin
# language: fr
@issue-42 @wip
Fonctionnalité: Inviter un membre dans son équipe
  En tant qu'administrateur d'équipe
  Je veux inviter des personnes par e-mail
  Afin qu'elles rejoignent mon espace de travail

  Contexte:
    Étant donné que je suis connecté en tant qu'administrateur de l'équipe "Alpha"

  Règle: Une invitation ne peut être envoyée qu'à une adresse valide

    Scénario: Inviter une adresse valide
      Quand j'invite "jean@test.fr" dans mon équipe
      Alors "jean@test.fr" apparaît dans les invitations en attente

    Plan du Scénario: Refuser une adresse invalide
      Quand j'invite "<adresse>" dans mon équipe
      Alors je suis informé que l'adresse est invalide
      Exemples:
        | adresse     |
        | jean        |
        | @test.fr    |
        |             |

  Règle: Seul un administrateur peut inviter

    @acces
    Scénario: Un simple membre ne peut pas inviter
      Étant donné que je suis connecté en tant que membre de l'équipe "Alpha"
      Quand je tente d'inviter "paul@test.fr" dans mon équipe
      Alors l'invitation est refusée
```

Mots-clés en français :
- `Fonctionnalité`, `Règle`, `Contexte`
- `Scénario`, `Plan du Scénario`, `Exemples`
- `Étant donné que`, `Quand`, `Alors`, `Et`, `Mais`

## 4. Exécution avec playwright-bdd

### Installation

```bash
npm i -D @playwright/test playwright-bdd
npx playwright install   # en local seulement
```

Dans un conteneur cloud, Chromium est déjà installé et Playwright le trouve via `PLAYWRIGHT_BROWSERS_PATH`. On n'y lance **jamais** `npx playwright install`.

### `playwright.config.ts`

```ts
import { defineConfig } from "@playwright/test";
import { defineBddConfig } from "playwright-bdd";

const testDir = defineBddConfig({
  features: "features/**/*.feature",
  steps: "features/steps/**/*.ts",
});

export default defineConfig({
  testDir,
  use: {
    baseURL: "http://localhost:5173",
    trace: "retain-on-failure",
    screenshot: "only-on-failure",
  },
  webServer: {
    command: "npm run dev",
    url: "http://localhost:5173",
    reuseExistingServer: true,
  },
});
```

### Fixtures et steps

```ts
// features/steps/fixtures.ts
import { test as base, createBdd } from "playwright-bdd";
import { createClient } from "@supabase/supabase-js";

// La clé service_role sert UNIQUEMENT à préparer les données de test, jamais à agir en tant qu'utilisateur.
const admin = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);

export const test = base.extend<{ jeu: JeuDeDonnees }>({
  jeu: async ({}, use) => {
    const jeu = new JeuDeDonnees(admin);
    await use(jeu);
    await jeu.nettoyer();
  },
});

export const { Given, When, Then } = createBdd(test);
```

```ts
// features/steps/equipe.steps.ts
import { expect } from "@playwright/test";
import { Given, When, Then } from "./fixtures";

Given("je suis connecté en tant qu'administrateur de l'équipe {string}", async ({ page, jeu }, equipe: string) => {
  const user = await jeu.administrateurDe(equipe);
  await jeu.seConnecter(page, user);
});

When("j'invite {string} dans mon équipe", async ({ page }, email: string) => {
  await page.getByRole("button", { name: "Inviter un membre" }).click();
  await page.getByLabel("Adresse e-mail").fill(email);
  await page.getByRole("button", { name: "Envoyer l'invitation" }).click();
});

Then("{string} apparaît dans les invitations en attente", async ({ page }, email: string) => {
  await expect(page.getByRole("list", { name: "Invitations en attente" }).getByText(email)).toBeVisible();
});
```

### Commandes

- `npx bddgen` génère les tests et **liste les étapes non implémentées**.
- `npx playwright test --grep @issue-42` lance les scénarios d'une story.
- `npx playwright show-trace test-results/<…>/trace.zip` aide à diagnostiquer un échec.

### Bonnes pratiques pour les steps

- Préférer les locators `getByRole` / `getByLabel` / `getByText`, puis `getByTestId`.
- Utiliser des assertions web-first (`expect(locator).toBeVisible()`), jamais `waitForTimeout`.
- **Réutiliser** une étape existante plutôt que d'en créer une variante. Une formulation = une étape.
- Chaque scénario crée ses données et ne dépend d'aucun autre.
- Les données de test sont fictives (prénoms inventés, adresses en `@exemple.test`), jamais celles d'un vrai enfant.
- Les scénarios qui touchent l'interface enfant tournent aussi en largeur téléphone (360 px) : ajoutez un projet Playwright mobile dans `playwright.config.ts`.
