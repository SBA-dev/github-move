import { expect, test } from "@playwright/test";
import { ouvrirApplicationActuelle } from "./ouvrir.ts";
import { leconParId, lireDocs, preparerNavigateur, profilEnfant, progression } from "./outils.ts";

const deuxEnfants = {
  ...profilEnfant("enfant_lea", { prenom: "Léa", niveau: "CE1", univers: "sports", cree: 1 }),
  ...profilEnfant("enfant_tom", { prenom: "Tom", niveau: "CP", univers: "animaux", cree: 2 }),
};

async function entrerDansLEspaceAdulte(page: import("@playwright/test").Page) {
  await page.getByRole("button", { name: "Espace adulte" }).click();
  const question = await page.locator(".gate p").first().innerText();
  const [, a, b] = question.match(/(\d+) × (\d+)/) ?? [];
  await page.locator("#gate-in").fill(String(Number(a) * Number(b)));
  await page.getByRole("button", { name: "Entrer" }).click();
}

test("au premier lancement, Noisette accueille et propose de créer le profil de l'enfant", async ({ page }) => {
  await preparerNavigateur(page);
  await ouvrirApplicationActuelle(page);

  await expect(page.locator(".welcome svg.lumi")).toBeVisible();
  await expect(page.locator(".welcome")).toContainText("Bonjour ! Pour commencer, crée le profil de l'enfant qui va jouer.");
  await expect(page.locator("#f-niveau option")).toHaveText(["CP", "CE1", "CE2", "CM1", "CM2"]);
  await expect(page.locator("#f-univers")).toHaveValue("animaux");
  await expect(page.locator("#f-univers option")).toHaveText(["Princesses et fées", "Animaux de la forêt", "Sports", "Police", "Pompiers", "Danse"]);
  await expect(page.getByRole("button", { name: "C'est parti !" })).toBeVisible();
});

test("créer un profil enregistre le prénom, la classe et l'univers, puis propose le test de départ", async ({ page }) => {
  await preparerNavigateur(page);
  await ouvrirApplicationActuelle(page);

  await page.locator("#f-prenom").fill("Léa");
  await page.locator("#f-niveau").selectOption("CE1");
  await page.locator("#f-univers").selectOption("sports");
  await page.getByRole("button", { name: "C'est parti !" }).click();

  await expect(page.getByText("Bonjour Léa ! Veux-tu faire un petit jeu de questions ?")).toBeVisible();
  await expect(page.getByRole("button", { name: "Oui, on y va !" })).toBeVisible();
  await page.getByRole("button", { name: "Plus tard" }).click();
  await expect(page.getByRole("heading", { level: 1, name: "Bonjour Léa !" })).toBeVisible();
  await expect(page.locator("#who")).toHaveText("Léa · CE1");

  const enfants = Object.values(await lireDocs(page)).filter((d) => d.kind === "enfant");
  expect(enfants).toEqual([expect.objectContaining({ prenom: "Léa", niveau: "CE1", univers: "sports" })]);
});

test("« Qui joue aujourd'hui ? » montre chaque enfant avec sa classe et son univers, dans l'ordre de création", async ({ page }) => {
  await preparerNavigateur(page, { docs: deuxEnfants });
  await ouvrirApplicationActuelle(page);

  await expect(page.getByRole("heading", { name: "Qui joue aujourd'hui ?" })).toBeVisible();
  await expect(page.locator(".profile b")).toHaveText(["Léa", "Tom", "+"]);
  await expect(page.locator(".profile small")).toHaveText(["CE1 · Sports", "CP · Animaux de la forêt", "Ajouter un enfant"]);

  await page.locator(".profile", { hasText: "Tom" }).click();
  await expect(page.getByRole("heading", { level: 1, name: "Bonjour Tom !" })).toBeVisible();
});

test("un prénom fait seulement d'espaces est ignoré : aucun profil n'est créé", async ({ page }) => {
  await preparerNavigateur(page);
  await ouvrirApplicationActuelle(page);

  await page.locator("#f-prenom").fill("    ");
  await page.getByRole("button", { name: "C'est parti !" }).click();

  await expect(page.locator("#f-prenom")).toBeVisible();
  expect(await lireDocs(page)).toEqual({});
});

test("le prénom est coupé à 20 caractères", async ({ page }) => {
  await preparerNavigateur(page);
  await ouvrirApplicationActuelle(page);

  await page.locator("#f-prenom").fill("Marie-Charlotte-Eugénie");
  await page.getByRole("button", { name: "C'est parti !" }).click();

  await expect(page.getByText("Bonjour Marie-Charlotte-Eugé ! Veux-tu faire")).toBeVisible();
  const enfant = Object.values(await lireDocs(page)).find((d) => d.kind === "enfant");
  expect(enfant?.prenom).toBe("Marie-Charlotte-Eugé");
});

test("modifier un profil dans l'espace adulte garde son identifiant et sa date de création", async ({ page }) => {
  await preparerNavigateur(page, { docs: deuxEnfants });
  await ouvrirApplicationActuelle(page);
  await entrerDansLEspaceAdulte(page);
  await page.getByRole("button", { name: "Profils" }).click();

  const fiche = page.locator(".parch").filter({ has: page.getByRole("button", { name: "Supprimer ce profil" }) }).first();
  await expect(fiche.locator("#f-prenom")).toHaveValue("Léa");
  await fiche.locator("#f-prenom").fill("Léana");
  await fiche.locator("#f-niveau").selectOption("CE2");
  await fiche.getByRole("button", { name: "Enregistrer" }).click();

  await expect(page.locator(".parch #f-prenom").first()).toHaveValue("Léana");
  const docs = await lireDocs(page);
  expect(docs.enfant_lea).toMatchObject({ prenom: "Léana", niveau: "CE2", univers: "sports", cree: 1 });
});

test("supprimer un profil demande une confirmation, puis efface l'enfant et toute sa progression", async ({ page }) => {
  const docs = {
    ...deuxEnfants,
    ...progression("enfant_lea", leconParId("fr-cp-syllabes")),
    ...progression("enfant_tom", leconParId("fr-cp-syllabes")),
  };
  await preparerNavigateur(page, { docs });
  await ouvrirApplicationActuelle(page);
  await entrerDansLEspaceAdulte(page);
  await page.getByRole("button", { name: "Profils" }).click();

  await page.getByRole("button", { name: "Supprimer ce profil" }).first().click();
  expect(Object.keys(await lireDocs(page))).toContain("enfant_lea");
  await page.getByRole("button", { name: "Confirmer : supprimer Léa et sa progression" }).click();

  await expect(page.locator(".parch #f-prenom").first()).toHaveValue("Tom");
  expect(Object.keys(await lireDocs(page)).sort()).toEqual(["enfant_tom", "progres_enfant_tom_fr-cp-syllabes"]);
});
