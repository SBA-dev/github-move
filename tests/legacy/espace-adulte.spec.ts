import { expect, test } from "@playwright/test";
import { ouvrirApplicationActuelle } from "./ouvrir.ts";
import { preparerNavigateur, profilEnfant } from "./outils.ts";

async function lireQuestion(page: import("@playwright/test").Page) {
  const texte = await page.locator(".gate p").first().innerText();
  const [, a, b] = texte.match(/^Question pour un adulte : combien font (\d+) × (\d+) \?$/) ?? [];
  return { a: Number(a), b: Number(b) };
}

test("l'espace adulte s'ouvre sur une multiplication dont les deux nombres vont de 6 à 9", async ({ page }) => {
  const facteurs = new Set<number>();
  for (let graine = 1; graine <= 12; graine++) {
    const onglet = await page.context().newPage();
    await preparerNavigateur(onglet, { graine });
    await ouvrirApplicationActuelle(onglet);
    await onglet.getByRole("button", { name: "Espace adulte" }).click();
    const { a, b } = await lireQuestion(onglet);
    facteurs.add(a).add(b);
    await onglet.close();
  }
  expect([...facteurs].every((n) => n >= 6 && n <= 9)).toBe(true);
  expect(facteurs.size).toBeGreaterThan(1);
});

test("une mauvaise réponse affiche « Ce n'est pas la bonne réponse. » et reste sur la question", async ({ page }) => {
  await preparerNavigateur(page);
  await ouvrirApplicationActuelle(page);
  await page.getByRole("button", { name: "Espace adulte" }).click();
  const { a, b } = await lireQuestion(page);

  await page.locator("#gate-in").fill(String(a * b + 1));
  await page.getByRole("button", { name: "Entrer" }).click();

  await expect(page.getByText("Ce n'est pas la bonne réponse.")).toBeVisible();
  await expect(page.locator("#gate-in")).toBeVisible();
  await expect(page.locator(".tabs")).toHaveCount(0);
});

test("la bonne réponse ouvre l'espace adulte sur l'onglet Suivi, et chaque onglet s'ouvre", async ({ page }) => {
  await preparerNavigateur(page, { docs: profilEnfant("enfant_lea", { prenom: "Léa", niveau: "CE1" }) });
  await ouvrirApplicationActuelle(page);
  await page.getByRole("button", { name: "Espace adulte" }).click();
  const { a, b } = await lireQuestion(page);
  await page.locator("#gate-in").fill(String(a * b));
  await page.getByRole("button", { name: "Entrer" }).click();

  await expect(page.getByRole("heading", { level: 2, name: "Espace adulte" })).toBeVisible();
  const onglets = page.locator(".tabs .tab");
  await expect(onglets).toHaveText(["Suivi", "Devoirs et dictée", "Profils", "Créer une leçon", "Mes leçons", "Audio des chansons", "Voix"]);
  await expect(page.locator('.tab[aria-selected="true"]')).toHaveText("Suivi");
  await expect(page.getByRole("heading", { level: 3, name: "Léa · CE1" })).toBeVisible();

  const contenu: Record<string, string> = {
    "Devoirs et dictée": "Mots de la semaine",
    Profils: "Ajouter un enfant",
    "Créer une leçon": "Créer une leçon à partir d'un texte",
    "Mes leçons": "Aucune leçon créée pour l'instant.",
    "Audio des chansons": "Audio des poésies et chansons",
    Voix: "La voix des guides",
    Suivi: "Bilan des 7 derniers jours",
  };
  for (const [onglet, texte] of Object.entries(contenu)) {
    await page.locator(".tabs .tab", { hasText: onglet }).click();
    await expect(page.locator('.tab[aria-selected="true"]')).toHaveText(onglet);
    await expect(page.locator(".adult")).toContainText(texte);
  }
});
