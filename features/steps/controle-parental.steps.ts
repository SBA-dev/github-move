import { expect, type Page } from "@playwright/test";
import { fixerLaProchaineQuestion } from "../support/hasard-fixe.ts";
import { Given, Then, When } from "./fixtures.ts";

// Story #10 : contrôle parental de l'espace parent. Le parent est connecté sans e-mail (voir
// features/support/connexion-sans-email.ts). La question est fixée en donnant ses facteurs au tirage du navigateur
// (features/support/hasard-fixe.ts). Le parent agit uniquement par l'interface.

const CLE_PROFIL_PREPARE = "savanturier:profil-prepare";
const QUESTION = /Question pour un adulte : combien font (\d) × (\d) \?/;

function question(page: Page) {
  return page.getByText(QUESTION);
}

function champDeLaReponse(page: Page) {
  return page.getByRole("textbox", { name: QUESTION });
}

function enteteEspaceParent(page: Page) {
  return page.getByRole("banner").getByRole("button", { name: "Espace parent", exact: true });
}

async function fixer(page: Page, facteurs: string) {
  const [, premier, second] = facteurs.match(/^(\d) × (\d)$/) ?? [];
  if (!premier || !second) throw new Error(`Question inattendue : ${facteurs}`);
  await fixerLaProchaineQuestion(page, Number(premier), Number(second));
}

async function repondre(page: Page, reponse: string) {
  await champDeLaReponse(page).fill(reponse);
  await page.getByRole("button", { name: "Entrer" }).click();
}

async function ouvrirLaQuestion(page: Page, facteurs: string) {
  await fixer(page, facteurs);
  await enteteEspaceParent(page).click();
  await expect(question(page)).toContainText(`combien font ${facteurs} ?`);
}

async function quitterLEspaceParent(page: Page) {
  await page.getByRole("button", { name: "Quitter l'espace parent" }).click();
}

// --- Étant donné

Given(/^le contrôle parental pose la question « (\d × \d) »$/, async ({ page }, facteurs: string) => {
  await ouvrirLaQuestion(page, facteurs);
});

Given(/^la prochaine question du contrôle parental tirée est « (\d × \d) »$/, async ({ page }, facteurs: string) => {
  await fixer(page, facteurs);
});

Given(/^Paul a répondu « (.*) » à la question « (\d × \d) » du contrôle parental$/, async ({ page }, reponse: string, facteurs: string) => {
  await ouvrirLaQuestion(page, facteurs);
  await repondre(page, reponse);
});

Given(
  /^Paul a répondu (\d+) fois de suite une mauvaise réponse à la question « (\d × \d) » du contrôle parental$/,
  async ({ page }, fois: string, facteurs: string) => {
    await ouvrirLaQuestion(page, facteurs);
    for (let essai = 0; essai < Number(fois); essai += 1) {
      await repondre(page, "54");
      await expect(page.getByRole("status").filter({ hasText: "Ce n'est pas la bonne réponse." })).toBeVisible();
    }
  },
);

Given(/^Paul est entré dans l'espace parent en répondant à « (\d × \d) », puis l'a quitté$/, async ({ page }, facteurs: string) => {
  await ouvrirLaQuestion(page, facteurs);
  const [, a, b] = facteurs.match(/^(\d) × (\d)$/) ?? [];
  await repondre(page, String(Number(a) * Number(b)));
  await expect(page.getByRole("heading", { name: "Espace parent" })).toBeVisible();
  await quitterLEspaceParent(page);
  await expect(page.getByRole("heading", { name: "Espace parent" })).toBeHidden();
});

// Le scénario suppose que Paul est ensuite dans l'espace parent (il le quitte au « Quand ») : il y entre ici, après que Léa a joué.
Given(/^Léa jouait avant que Paul entre dans l'espace parent$/, async ({ famille, page }) => {
  await page.addInitScript(
    ([cle, valeur]) => localStorage.setItem(cle, valeur),
    [CLE_PROFIL_PREPARE, JSON.stringify({ prenom: "Léa", niveau: "CE1", univers: "animaux" })] as const,
  );
  await page.goto("/jeu");
  await expect(page.getByTestId("enfant-en-cours")).toContainText("Léa");
  await famille.allerDansLEspaceParent("tablette");
});

Given(/^Paul est connecté sur un ordinateur, au clavier$/, async ({ famille, page }) => {
  await page.setViewportSize({ width: 1280, height: 800 });
  await famille.connecterSansEmail("tablette", "Paul");
});

// --- Quand

When(/^\S+ demande l'entrée de l'espace parent$/, async ({ page }) => {
  await enteteEspaceParent(page).click();
});

When(/^(\S+) répond « (.*) » au contrôle parental$/, async ({ page }, _prenom: string, reponse: string) => {
  await repondre(page, reponse);
});

When(/^(\S+) répond « (.*) » entouré d'espaces au contrôle parental$/, async ({ page }, _prenom: string, reponse: string) => {
  await repondre(page, `  ${reponse}  `);
});

When(/^(\S+) répond « (.*) » au contrôle parental, au clavier seulement$/, async ({ page }, _prenom: string, reponse: string) => {
  await expect(champDeLaReponse(page)).toBeFocused();
  await page.keyboard.type(reponse);
  await page.keyboard.press("Enter");
});

When(/^\S+ renonce à répondre au contrôle parental$/, async ({ page }) => {
  await page.getByRole("button", { name: "Renoncer" }).click();
});

When(/^Paul quitte l'espace parent$/, async ({ page }) => {
  await quitterLEspaceParent(page);
});

// --- Alors

Then(/^\S+ voit une question du contrôle parental$/, async ({ page }) => {
  await expect(question(page)).toBeVisible();
});

Then(/^\S+ voit une question du contrôle parental qui multiplie deux nombres entre 6 et 9$/, async ({ page }) => {
  await expect(question(page)).toBeVisible();
  const [, premier, second] = (await question(page).innerText()).match(QUESTION) ?? [];
  for (const facteur of [Number(premier), Number(second)]) {
    expect(facteur).toBeGreaterThanOrEqual(6);
    expect(facteur).toBeLessThanOrEqual(9);
  }
});

Then(/^Paul voit (?:de nouveau )?la question du contrôle parental « (\d × \d) »$/, async ({ page }, facteurs: string) => {
  await expect(question(page)).toContainText(`combien font ${facteurs} ?`);
});

Then(/^(?:il|elle) ne voit pas l'espace parent$/, async ({ page }) => {
  await expect(page.getByRole("heading", { name: "Espace parent" })).toBeHidden();
});

Then(/^la déconnexion n'est pas proposée à Léa$/, async ({ page }) => {
  await expect(page.getByRole("button", { name: "Se déconnecter" })).toHaveCount(0);
});

Then(/^Léa revient là où elle jouait$/, async ({ page }) => {
  await expect(page).toHaveURL(/\/jeu$/);
  await expect(page.getByTestId("enfant-en-cours")).toContainText("Léa");
  await expect(question(page)).toHaveCount(0);
});

Then(/^Paul est informé que ce n'est pas la bonne réponse$/, async ({ page }) => {
  await expect(page.getByRole("status").filter({ hasText: "Ce n'est pas la bonne réponse." })).toBeVisible();
});

Then(/^il peut répondre de nouveau au contrôle parental$/, async ({ page }) => {
  await expect(champDeLaReponse(page)).toBeEditable();
  await expect(page.getByRole("button", { name: "Entrer" })).toBeEnabled();
});

Then(/^aucune question du contrôle parental n'est posée$/, async ({ page }) => {
  await expect(question(page)).toHaveCount(0);
});

Then(/^(?:il|elle) voit l'espace parent, intitulé « Espace parent »$/, async ({ page }) => {
  await expect(page.getByRole("heading", { level: 2, name: "Espace parent", exact: true })).toBeVisible();
});

Then(/^la déconnexion lui est proposée$/, async ({ page }) => {
  await expect(page.getByRole("button", { name: "Se déconnecter" })).toBeVisible();
});

Then(/^la réponse au contrôle parental se saisit avec le pavé numérique de la tablette$/, async ({ page }) => {
  await expect(champDeLaReponse(page)).toHaveAttribute("inputmode", "numeric");
});
