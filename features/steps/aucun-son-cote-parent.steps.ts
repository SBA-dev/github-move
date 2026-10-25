import { createBdd } from "playwright-bdd";
import { expect, type Page } from "@playwright/test";
import { fixerLaProchaineQuestion } from "../support/hasard-fixe.ts";
import { allerALaQuestion } from "./exercices-a-choix.steps.ts";
import { test, Given, Then, When } from "./fixtures.ts";
import { etat as etatDesProfils, choisirSonProfil, connecterSiBesoin } from "./profils-enfants.steps.ts";
import { toutesLesParoles } from "./etapes-puis-exercices.steps.ts";
import { attendreUneLecture, DENISE, installerLeFaux, journal, laisserPasserLeDelaiDeLecture, normaliser, reappliquerLAppareil, scenario } from "./voix.steps.ts";

// Story #73 : aucune voix sur les écrans du parent. « Noisette dit » vérifie la bulle du personnage guide (ce qui
// reste affiché) ; « entend » et « n'entend aucune voix » vérifient la voix, par l'espion de la synthèse vocale
// de voix.steps.ts. Le parent est connecté sans e-mail (préparation), le reste passe par l'interface.

const { Before } = createBdd(test);

const QUESTION_DE_TEST = "Combien font 3 + 4 ?";

// L'espion de la synthèse vocale est installé avant le chargement de la première page, pour tous les écrans du parent
// (l'écran de connexion et « Qui joue ? » n'ouvrent aucune séance qui l'installerait). Les steps de voix qui préparent
// la page ensuite (voix de l'appareil, Muet) l'installent de nouveau : le dernier installé gagne.
Before({ tags: "@issue-73" }, async ({ page }) => {
  await page.addInitScript(installerLeFaux, {
    voix: [DENISE, { nom: "Henri", langue: "fr-FR" }],
    bloque: false,
    absent: false,
  });
});

function boutonSon(page: Page) {
  return page.getByRole("button", { name: "Son" });
}

function bulleDuPersonnageGuide(page: Page) {
  return page.getByTestId("parole");
}

function entreeDeLEspaceParent(page: Page) {
  return page.getByRole("banner").getByRole("button", { name: "Espace parent", exact: true });
}

function questionDuControleParental(page: Page) {
  return page.getByText(/Question pour un adulte : combien font \d × \d \?/);
}

// --- Étant donné

Given(/^Paul n'est rattaché à aucun profil enfant$/, async ({ famille, page }) => {
  expect(etatDesProfils(famille).profils.filter((p) => p.parent === "Paul")).toHaveLength(0);
  scenario(page).sansProfil = true;
});

Given(/^Noisette est en train de saluer Léa sur son accueil$/, async ({ famille, page }) => {
  await connecterSiBesoin(famille, "tablette", "Paul");
  await choisirSonProfil(page, "Léa");
  await attendreUneLecture(page);
  expect((await journal(page)).actifs).toBeGreaterThan(0);
});

Given(/^Paul est entré dans l'espace parent, puis l'a quitté$/, async ({ famille, page }) => {
  await connecterSiBesoin(famille, "tablette", "Paul");
  await famille.allerDansLEspaceParent("tablette");
  await page.getByRole("button", { name: "Quitter l'espace parent" }).click();
  await expect(page.getByRole("heading", { name: "Espace parent" })).toBeHidden();
});

Given(
  /^Léa a demandé l'entrée de l'espace parent, et le contrôle parental pose la question « (\d) × (\d) »$/,
  async ({ page }, premier: string, second: string) => {
    await fixerLaProchaineQuestion(page, Number(premier), Number(second));
    await entreeDeLEspaceParent(page).click();
    await expect(questionDuControleParental(page)).toContainText(`combien font ${premier} × ${second} ?`);
  },
);

Given(/^Léa a demandé l'entrée de l'espace parent, puis a renoncé à répondre au contrôle parental$/, async ({ page }) => {
  await allerALaQuestion(page, QUESTION_DE_TEST, false);
  await entreeDeLEspaceParent(page).click();
  await expect(questionDuControleParental(page)).toBeVisible();
  await page.getByRole("button", { name: "Renoncer" }).click();
  await expect(questionDuControleParental(page)).toHaveCount(0);
});

Given(/^la tablette est en Son$/, async ({ page }) => {
  scenario(page).muet = false;
});

Given(/^l'écran « Se connecter » est affiché sur la tablette$/, async ({ page }) => {
  await reappliquerLAppareil(page);
  await page.goto("/");
  await expect(page.getByRole("heading", { level: 2, name: "Se connecter" })).toBeVisible();
});

Given(/^la question du contrôle parental est affiché sur la tablette$/, async ({ famille, page }) => {
  await reappliquerLAppareil(page);
  await connecterSiBesoin(famille, "tablette", "Paul");
  await fixerLaProchaineQuestion(page, 7, 8);
  await entreeDeLEspaceParent(page).click();
  await expect(questionDuControleParental(page)).toBeVisible();
});

Given(/^l'espace parent est affiché sur la tablette$/, async ({ famille, page }) => {
  await reappliquerLAppareil(page);
  await connecterSiBesoin(famille, "tablette", "Paul");
  await famille.allerDansLEspaceParent("tablette");
});

// --- Quand

When(/^Léa demande à changer d'enfant$/, async ({ page }) => {
  await page.getByRole("button", { name: "Changer d'enfant", exact: true }).click();
});

When(/^Paul passe en Muet$/, async ({ page }) => {
  await boutonSon(page).click();
  await expect(boutonSon(page)).toHaveAttribute("data-son", "muet");
});

// La tablette était annoncée en Muet : si l'écran affiché par un step existant (« Qui joue ? ») ne l'a pas appliqué,
// Paul la passe en Muet comme un adulte, puis remet le son.
When(/^Paul remet le son$/, async ({ page }) => {
  if (scenario(page).muet && (await boutonSon(page).getAttribute("data-son")) === "son") await boutonSon(page).click();
  await expect(boutonSon(page)).toHaveAttribute("data-son", "muet");
  await boutonSon(page).click();
});

// --- Alors : la voix

Then(/^(?:Paul|Léa) n'entend aucune voix$/, async ({ page }) => {
  await laisserPasserLeDelaiDeLecture(page);
  const { speaks, actifs, coupeApresLaDerniereParole } = await journal(page);
  // Une lecture déjà en cours (consigne, salutation) a été coupée : plus rien ne parle et rien n'a repris depuis.
  if (scenario(page).ouvert) {
    expect(actifs).toBe(0);
    expect(coupeApresLaDerniereParole || speaks === 0).toBe(true);
    return;
  }
  expect(speaks).toBe(0);
});

Then(/^Léa entend Noisette lui proposer le test de départ$/, async ({ page }) => {
  const proposition = normaliser((await bulleDuPersonnageGuide(page).textContent()) ?? "");
  expect(proposition).toContain("Bonjour Léa !");
  const sansPonctuation = (texte: string) => texte.replace(/[\s,«»]+/g, "");
  await expect.poll(async () => sansPonctuation((await toutesLesParoles(page)).join(" ")).includes(sansPonctuation(proposition))).toBe(true);
});

// --- Alors : la bulle (ce qui reste affiché ; « Noisette dit » est un step existant de #16)

Then(/^l'invitation à créer le premier profil est annoncée au lecteur d'écran$/, async ({ page }) => {
  await expect(bulleDuPersonnageGuide(page)).toHaveAttribute("aria-live", "polite");
  await expect(bulleDuPersonnageGuide(page)).toContainText("crée le profil de l'enfant qui va jouer");
});

// --- Alors : écrans et choix Son/Muet

Then(/^Léa voit « Qui joue \? »$/, async ({ page }) => {
  await expect(page.getByTestId("qui-joue")).toBeVisible();
});

Then(/^le choix Son\/Muet montre (Son|Muet)$/, async ({ page }, choix: string) => {
  await expect(boutonSon(page)).toHaveAttribute("data-son", choix === "Son" ? "son" : "muet");
});

Then(/^la tablette est toujours en Son$/, async ({ page }) => {
  await expect(boutonSon(page)).toHaveAttribute("aria-pressed", "true");
  await expect(boutonSon(page)).toHaveAttribute("data-son", "son");
  expect(await page.evaluate(() => localStorage.getItem("savanturier:son"))).not.toBe("muet");
});
