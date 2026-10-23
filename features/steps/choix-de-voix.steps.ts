import { expect, type Locator, type Page } from "@playwright/test";
import { Given, Then, When } from "./fixtures.ts";
import {
  entrerDansLEspaceParent,
  HAUTEUR_DE_CAPITAINE_SAM,
  journal,
  laisserPasserLeDelaiDeLecture,
  normaliser,
  ouvrirSurUnAutreAppareil,
  preparerLaPage,
  scenario,
  type VoixFausse,
} from "./voix.steps.ts";

const AUTOMATIQUE = "Automatique (recommandé)";
const GUIDES = "Noisette|Lumi|Coach Léo|Capitaine Sam";

function listeDe(texte: string): string[] {
  return [...texte.matchAll(/« ([^«»]+) »/g)].flatMap((m) => (m[1] === undefined ? [] : [m[1]]));
}

function radio(page: Page, nom: string): Locator {
  return page.getByRole("radio", { name: nom, exact: true });
}

function ligne(page: Page, nom: string): Locator {
  return page.getByTestId("voix").filter({ has: radio(page, nom) });
}

function voixFrancaise(voix: readonly VoixFausse[]): string {
  const francaise = voix.find((v) => v.langue.startsWith("fr"));
  if (!francaise) throw new Error("Aucune voix française préparée");
  return francaise.nom;
}

// --- Étant donné : appareil et voix imposée

Given(/^personne n'a imposé de voix sur la tablette$/, async ({ page }) => {
  scenario(page).voixImposee = undefined;
});

Given(/^Paul a imposé la voix française sur la tablette$/, async ({ page }) => {
  const etat = scenario(page);
  etat.voixImposee = voixFrancaise(etat.voix);
});

Given(/^Paul a imposé la voix « ([^«»]+) » sur la tablette$/, async ({ page }, nom: string) => {
  const etat = scenario(page);
  etat.voixImposee = nom;
  if (!etat.voix.some((v) => v.nom === nom)) etat.voix = [...etat.voix, { nom, langue: "fr-FR" }];
});

Given(
  /^Paul a imposé la voix « ([^«»]+) », qui n'est plus sur la tablette$/,
  async ({ page }, nom: string) => {
    const etat = scenario(page);
    etat.voixImposee = nom;
    etat.voix = etat.voix.filter((v) => v.nom !== nom);
  },
);

Given(
  /^la voix « ([^«»]+) » a disparu de la tablette, puis y a été de nouveau installée$/,
  async ({ page }, nom: string) => {
    const etat = scenario(page);
    if (!etat.voix.some((v) => v.nom === nom)) etat.voix = [...etat.voix, { nom, langue: "fr-FR" }];
  },
);

Given(
  /^Paul a imposé la voix « ([^«»]+) » sur la tablette, puis est revenu à la voix automatique$/,
  async ({ page }, nom: string) => {
    const etat = scenario(page);
    const autrePage = await page.context().newPage();
    await entrerDansLEspaceParent(autrePage, { ...etat, voixImposee: nom });
    await expect(radio(autrePage, nom)).toBeChecked();
    await radio(autrePage, AUTOMATIQUE).check();
    await expect(radio(autrePage, AUTOMATIQUE)).toBeChecked();
    expect(await autrePage.evaluate(() => localStorage.getItem("savanturier:voix"))).toBeNull();
    await autrePage.close();
  },
);

Given(/^la tablette et le téléphone ont les voix françaises « (.+) » et « (.+) »$/, async ({ page }, a: string, b: string) => {
  scenario(page).voix = [{ nom: a, langue: "fr-FR" }, { nom: b, langue: "fr-FR" }];
});

Given(
  /^l'appareil a les voix françaises « ([^«»]+) », « ([^«»]+) » et « ([^«»]+) »$/,
  async ({ page }, a: string, b: string, c: string) => {
    scenario(page).voix = [a, b, c].map((nom) => ({ nom, langue: "fr-FR" }));
  },
);

Given(/^l'appareil a aussi la voix anglaise « ([^«»]+) »$/, async ({ page }, nom: string) => {
  const etat = scenario(page);
  etat.voix = [...etat.voix, { nom, langue: "en-US" }];
});

Given(/^l'appareil n'a aucune voix française$/, async ({ page }) => {
  scenario(page).voix = [{ nom: "Samantha", langue: "en-US" }];
});

// --- Étant donné : qui jouait

Given(/^personne ne jouait sur la tablette$/, async ({ page }) => {
  scenario(page).sansProfil = true;
});

Given(/^(Léa|Tom) jouait dans l'univers (animaux|princesse|sports|pompier)$/, async ({ page }, prenom: string, univers: string) => {
  const etat = scenario(page);
  etat.prenom = prenom;
  etat.univers = univers;
});

Given(/^Léa jouait sans avoir choisi d'univers$/, async ({ page }) => {
  const etat = scenario(page);
  etat.prenom = "Léa";
  etat.univers = undefined;
});

Given(/^Léa et Tom ont chacun un profil enfant sur la tablette$/, async ({ page }) => {
  scenario(page).prenom = "Léa";
});

Given(/^Tom a choisi l'univers (sports)$/, async ({ page }, univers: string) => {
  const etat = scenario(page);
  etat.prenom = "Tom";
  etat.univers = univers;
});

// La connexion du parent (#5) n'est pas encore branchée : seul le contrôle parental protège l'espace parent.
// Scénario exclu de l'exécution tant que la déconnexion (#5) n'est pas branchée.
Given(/^Paul s'est déconnecté puis reconnecté sur la tablette$/, () => {
  throw new Error("Dépend de la story #5 : la déconnexion du parent n'est pas encore branchée.");
});

Given(/^Paul est connecté sur la tablette(?: et sur le téléphone)?$/, () => {});

// --- Étant donné : l'espace parent

Given(/^Paul est (?:dans|entré dans) l'espace parent$/, async ({ page }) => {
  await entrerDansLEspaceParent(page, scenario(page));
});

// --- Quand

When(/^Paul ouvre le choix de voix$/, async ({ page }) => {
  await expect(page.getByTestId("choix-de-voix")).toBeVisible();
});

When(/^Paul écoute la voix « ([^«»]+) »$/, async ({ page }, nom: string) => {
  await page.getByRole("button", { name: `Écouter la voix ${nom}`, exact: true }).click();
});

When(/^Paul impose la voix « ([^«»]+) »$/, async ({ page }, nom: string) => {
  await radio(page, nom).check();
});

When(/^la consigne « (.+) » s'affiche sur le téléphone$/, async ({ page, browser }, texte: string) => {
  const etat = scenario(page);
  etat.consigne.texte = texte;
  const contexte = await browser.newContext({
    baseURL: "http://localhost:5173",
    viewport: page.viewportSize() ?? { width: 360, height: 740 },
  });
  await ouvrirSurUnAutreAppareil(page, contexte, { ...etat, voixImposee: undefined });
});

When(/^la consigne « (.+) » s'affiche pour Tom$/, async ({ page }, texte: string) => {
  const etat = scenario(page);
  etat.consigne.texte = texte;
  await preparerLaPage(page, etat);
  await page.goto("/demonstration");
  await expect(page.getByTestId("consigne")).toBeVisible();
});

When(/^Léa demande l'entrée de l'espace parent$/, async ({ page }) => {
  await page.getByRole("banner").getByRole("button", { name: "Espace parent" }).click();
});

// --- Alors : liste des voix

Then(/^Paul voit, dans cet ordre, (.+)$/, async ({ page }, liste: string) => {
  await expect(page.getByTestId("voix").locator("label")).toHaveText(listeDe(liste));
});

Then(/^Paul ne voit pas la voix « ([^«»]+) »$/, async ({ page }, nom: string) => {
  await expect(radio(page, nom)).toHaveCount(0);
});

Then(/^Paul voit le titre « ([^«»]+) »$/, async ({ page }, titre: string) => {
  await expect(page.getByRole("heading", { name: titre, exact: true })).toBeVisible();
});

Then(/^Paul ne voit pas le titre « ([^«»]+) »$/, async ({ page }, titre: string) => {
  await expect(page.getByRole("heading", { name: titre, exact: true })).toHaveCount(0);
});

Then(/^« ([^«»]+) » porte la mention « ([^«»]+) »$/, async ({ page }, nom: string, mention: string) => {
  await expect(ligne(page, nom).getByTestId("mention-de-voix")).toHaveText(mention);
});

Then(/^la voix « ([^«»]+) » porte la mention « ([^«»]+) »$/, async ({ page }, nom: string, mention: string) => {
  await expect(ligne(page, nom).getByTestId("mention-de-voix")).toHaveText(mention);
});

Then(/^la voix « ([^«»]+) » ne porte aucune mention$/, async ({ page }, nom: string) => {
  await expect(ligne(page, nom)).toHaveCount(1);
  await expect(ligne(page, nom).getByTestId("mention-de-voix")).toHaveCount(0);
});

// --- Alors : voix choisie

Then(/^« ([^«»]+) » est (?:toujours )?choisi$/, async ({ page }, nom: string) => {
  await expect(radio(page, nom)).toBeChecked();
});

Then(/^la voix « ([^«»]+) » est choisie$/, async ({ page }, nom: string) => {
  await expect(radio(page, nom)).toBeChecked();
});

Then(/^« ([^«»]+) » n'est plus choisi$/, async ({ page }, nom: string) => {
  await expect(radio(page, nom)).not.toBeChecked();
});

// --- Alors : messages et conseils

Then(/^Paul voit le message « (.+) »$/, async ({ page }, message: string) => {
  await expect(page.getByText(message, { exact: true })).toBeVisible();
});

Then(/^seule « ([^«»]+) » est proposée$/, async ({ page }, nom: string) => {
  await expect(page.getByRole("radio")).toHaveCount(1);
  await expect(radio(page, nom)).toHaveCount(1);
});

Then(
  /^Paul trouve des conseils pour des voix plus naturelles sur iPad ou iPhone, sur tablette Android et sur ordinateur$/,
  async ({ page }) => {
    const section = page.getByTestId("choix-de-voix");
    for (const appareil of ["iPad / iPhone", "Tablette Android", "Ordinateur"]) {
      await expect(section.getByText(appareil, { exact: true })).toBeVisible();
    }
  },
);

// --- Alors : essai de voix

Then(
  new RegExp(`^Paul entend (${GUIDES}) dire « ([^«»]+) »(?: avec la voix « ([^«»]+) »)?(, en plus grave)?$`),
  async ({ page }, _guide: string, texte: string, voix: string | undefined, plusGrave: string | undefined) => {
    await expect.poll(async () => (await journal(page)).lecture.texte).toBe(normaliser(texte));
    const { lecture } = await journal(page);
    for (const enonce of lecture.enonces) {
      if (voix) expect(enonce.voix).toBe(voix);
      if (plusGrave) expect(enonce.pitch).toBeLessThan(HAUTEUR_DE_CAPITAINE_SAM);
    }
  },
);

Then(/^Paul n'entend rien$/, async ({ page }) => {
  await laisserPasserLeDelaiDeLecture(page);
  expect((await journal(page)).speaks).toBe(0);
});

// --- Alors : accès

Then(/^le choix de voix n'est pas proposé à Léa$/, async ({ page }) => {
  await expect(page.getByTestId("choix-de-voix")).toHaveCount(0);
});

Then(/^Léa voit une question du contrôle parental$/, async ({ page }) => {
  await expect(page.getByText(/Question pour un adulte/)).toBeVisible();
});
