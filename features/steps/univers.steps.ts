import { expect, type Locator, type Page } from "@playwright/test";
import { avecLesReglagesPrevus, reglagesPrevus } from "../support/reglages-prevus.ts";
import { Given, type Monde, type ProfilPrepare, Then, When } from "./fixtures.ts";

const CLE_PROFIL_PREPARE = "savanturier:profil-prepare";

const CLE_UNIVERS: Readonly<Record<string, string>> = {
  "Princesses et fées": "princesse",
  "Animaux de la forêt": "animaux",
  "Sports": "sports",
  "Police": "police",
  "Pompiers": "pompier",
  "Danse": "danse",
};

const UNIVERS_PAR_DEFAUT = "Animaux de la forêt";
const NIVEAU_PAR_DEFAUT = "CE1";

export function libelleDe(cle: string): string {
  const libelle = Object.keys(CLE_UNIVERS).find((candidat) => CLE_UNIVERS[candidat] === cle);
  if (libelle === undefined) throw new Error(`Univers sans libellé connu : ${cle}`);
  return libelle;
}

export function cleDe(libelle: string): string {
  const cle = CLE_UNIVERS[libelle];
  if (cle === undefined) throw new Error(`Univers sans clé connue : ${libelle}`);
  return cle;
}

export async function preparerProfil(page: Page, profil: ProfilPrepare) {
  await page.addInitScript(
    ([cle, valeur]) => localStorage.setItem(cle, valeur),
    [CLE_PROFIL_PREPARE, JSON.stringify(avecLesReglagesPrevus(page, profil))] as const,
  );
}

/** Des réglages prévus pour Léa sans profil préparé : Léa a alors le profil par défaut, avec ces réglages. */
async function assurerLeProfilDeLeaSiDesReglagesSontPrevus(page: Page, monde: Monde) {
  if (monde.profils.has("Léa") || Object.keys(reglagesPrevus(page, "Léa")).length === 0) return;
  const profil = { prenom: "Léa", niveau: NIVEAU_PAR_DEFAUT, univers: cleDe(UNIVERS_PAR_DEFAUT) };
  monde.profils.set("Léa", profil);
  await preparerProfil(page, profil);
}

async function attendreProfilCharge(page: Page, universAttendu: string) {
  await expect(page.getByTestId("enfant-en-cours")).toBeVisible();
  await expect(page.locator(".application")).toHaveAttribute("data-univers", universAttendu);
}

/** L'accueil de l'enfant, là où il arrive après « Qui joue ? » : le personnage guide le salue. */
async function ouvrirLAccueilDeLEnfant(page: Page, universAttendu: string) {
  await page.goto("/jeu");
  await attendreProfilCharge(page, universAttendu);
  await expect(page.getByRole("region", { name: /^Accueil de / })).toBeVisible();
}

/**
 * Le dessin d'un personnage guide, par son nom : accessible (role img) ou, depuis #96, caché des lecteurs d'écran sur les écrans
 * de l'enfant et repéré alors par `data-personnage-guide` sur l'élément `data-testid="personnage-guide"`.
 */
export function leGuide(page: Page, nom: string): Locator {
  return page.getByRole("img", { name: nom, exact: true }).or(page.locator(`[data-testid="personnage-guide"][data-personnage-guide="${nom}"]`)).first();
}

function guide(page: Page) {
  return page.getByTestId("personnage-guide").first();
}

// --- Étant donné : profils préparés

Given(
  /^(Léa|Tom) a un profil enfant préparé dans l'univers « (.+) »$/,
  async ({ page, monde }, prenom: string, univers: string) => {
    cleDe(univers);
    const profil = { prenom, niveau: NIVEAU_PAR_DEFAUT, univers: cleDe(univers) };
    monde.profils.set(prenom, profil);
    if (prenom === "Léa") await preparerProfil(page, profil);
  },
);

Given(/^Léa a un profil enfant préparé sans univers$/, async ({ page, monde }) => {
  const profil = { prenom: "Léa", niveau: NIVEAU_PAR_DEFAUT };
  monde.profils.set("Léa", profil);
  await preparerProfil(page, profil);
});

Given(/^Léa a un profil enfant préparé dont l'univers est inconnu$/, async ({ page, monde }) => {
  const profil = { prenom: "Léa", niveau: NIVEAU_PAR_DEFAUT, univers: "pirates" };
  monde.profils.set("Léa", profil);
  await preparerProfil(page, profil);
});

Given(/^Léa a un profil enfant préparé de niveau (\S+)$/, async ({ page, monde }, niveau: string) => {
  const profil = { prenom: "Léa", niveau, univers: cleDe(UNIVERS_PAR_DEFAUT) };
  monde.profils.set("Léa", profil);
  await preparerProfil(page, profil);
});

Given(/^aucun profil enfant n'est en cours sur l'appareil$/, async ({ page }) => {
  await page.addInitScript((cle) => localStorage.removeItem(cle), CLE_PROFIL_PREPARE);
});

// --- Étant donné : appareil

Given(/^l'écran de l'appareil mesure (\d+) px de large$/, async ({ page }, largeur: string) => {
  await page.setViewportSize({ width: Number(largeur), height: 1180 });
});

Given(/^l'appareil demande des mouvements réduits$/, async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
});

Given(/^Léa joue sur un ordinateur, au clavier$/, async ({ page, monde }) => {
  await page.setViewportSize({ width: 1280, height: 800 });
  // Story #96 : le profil déjà préparé (univers, niveau) est gardé.
  if (monde.profils.has("Léa")) return;
  const profil = { prenom: "Léa", niveau: NIVEAU_PAR_DEFAUT, univers: cleDe(UNIVERS_PAR_DEFAUT) };
  monde.profils.set("Léa", profil);
  await preparerProfil(page, profil);
});

// --- Étant donné : navigation

Given(/^Léa joue$/, async ({ page, monde }) => {
  await assurerLeProfilDeLeaSiDesReglagesSontPrevus(page, monde);
  const profil = monde.profils.get("Léa");
  await ouvrirLAccueilDeLEnfant(page, profil?.univers ?? cleDe(UNIVERS_PAR_DEFAUT));
});

// --- Quand

When(/^Léa commence à jouer$/, async ({ page, monde }) => {
  await assurerLeProfilDeLeaSiDesReglagesSontPrevus(page, monde);
  const profil = monde.profils.get("Léa");
  await ouvrirLAccueilDeLEnfant(page, cleDe(profil?.univers ? libelleOuCle(profil.univers) : UNIVERS_PAR_DEFAUT));
});

function libelleOuCle(cle: string): string {
  const libelle = Object.keys(CLE_UNIVERS).find((nom) => CLE_UNIVERS[nom] === cle);
  return libelle ?? UNIVERS_PAR_DEFAUT;
}

When(/^Léa et Tom commencent à jouer, chacun sur sa tablette$/, async ({ browser, monde }) => {
  for (const prenom of ["Léa", "Tom"]) {
    const profil = monde.profils.get(prenom);
    if (!profil?.univers) throw new Error(`Profil de ${prenom} non préparé`);
    const contexte = await browser.newContext({
      baseURL: "http://localhost:5173",
      viewport: { width: 820, height: 1180 },
    });
    const page = await contexte.newPage();
    await preparerProfil(page, profil);
    await ouvrirLAccueilDeLEnfant(page, profil.univers);
    const paysage = await page.getByTestId("paysage").getAttribute("data-univers");
    const couleur = await page.locator(".application").evaluate((el) =>
      getComputedStyle(el).getPropertyValue("--principale").trim()
    );
    monde.tablettes.set(prenom, { paysage, couleur });
    await contexte.close();
  }
});

When(/^Léa revient à l'accueil par le nom de l'application$/, async ({ page }) => {
  await page.getByRole("banner").getByRole("button", { name: "Savanturier" }).click();
  await expect(page).toHaveURL(/\/$/);
});

When(/^Léa parcourt l'en-tête au clavier$/, async ({ page, monde }) => {
  await assurerLeProfilDeLeaSiDesReglagesSontPrevus(page, monde);
  const profil = monde.profils.get("Léa");
  await ouvrirLAccueilDeLEnfant(page, profil?.univers ?? cleDe(UNIVERS_PAR_DEFAUT));
});

// --- Alors : paysage et personnage guide

Then(/^(?:elle|je) voi[st] ((?:(?! avec « ).)+) dans le paysage de l'univers « (.+) »$/, async ({ page }, nom: string, univers: string) => {
  await expect(page.getByTestId("paysage")).toHaveAttribute("data-univers", cleDe(univers));
  await expect(leGuide(page, nom)).toBeVisible();
});

Then(/^le paysage et la couleur principale de Léa diffèrent de ceux de Tom$/, ({ monde }) => {
  const lea = monde.tablettes.get("Léa");
  const tom = monde.tablettes.get("Tom");
  expect(lea?.paysage).toBeTruthy();
  expect(lea?.paysage).not.toEqual(tom?.paysage);
  expect(lea?.couleur).toBeTruthy();
  expect(lea?.couleur).not.toEqual(tom?.couleur);
});

Then(/^aucun message d'erreur n'apparaît$/, async ({ page }) => {
  await expect(page.getByRole("alert")).toHaveCount(0);
  await expect(page.getByText(/undefined|NaN|introuvable/i)).toHaveCount(0);
});

// --- Alors : humeur

Then(/^(.+) est content$/, async ({ page }, nom: string) => {
  await expect(leGuide(page, nom)).toHaveAttribute("data-humeur", "content");
});

Then(/^(.+) applaudit en sautant$/, async ({ page }, nom: string) => {
  const personnage = leGuide(page, nom);
  await expect(personnage).toHaveAttribute("data-humeur", "applaudit");
  await expect(personnage).toHaveAttribute("data-geste", "saute");
});

Then(/^(.+) réfléchit en penchant la tête$/, async ({ page }, nom: string) => {
  const personnage = leGuide(page, nom);
  await expect(personnage).toHaveAttribute("data-humeur", "reflechit");
  await expect(personnage).toHaveAttribute("data-geste", "penche");
});

// --- Alors : paroles

export function listeDe(texte: string): string[] {
  return [...texte.matchAll(/« (.+?) »/g)].flatMap((m) => (m[1] === undefined ? [] : [m[1]]));
}

export const FELICITATIONS_COMMUNES = ["Bravo !", "Super !", "Ouah, bien joué !", "Exactement !", "Génial !", "Tu gères !", "Parfait !", "Oui, c'est ça !"];

export const EXPRESSIONS_PAR_PERSONNAGE: Readonly<Record<string, readonly string[]>> = {
  "Lumi": ["Abracadabra !", "Par ma baguette, bravo !", "Magique !"],
  "Noisette": ["Youpi !", "Hop hop hop, bravo !", "Trop fort, ça !"],
  "Coach Léo": ["Allez, on y va !", "Et c'est le but !", "Quelle équipe !"],
  "Agent Max": ["Enquête résolue !", "Bien vu, détective !", "Affaire classée !"],
  "Capitaine Sam": ["Mission accomplie !", "Pin-pon, bravo !", "Sauvetage réussi !"],
  "Lili": ["Et hop, une pirouette !", "En rythme, bravo !", "Quelle grâce !"],
};

Then(
  /^(?:.+) dit une félicitation commune ou l'une de ses expressions : (.+)$/,
  async ({ page }, expressions: string) => {
    const propres = listeDe(expressions);
    const parole = page.getByTestId("parole");
    await expect(parole).toHaveAttribute("data-nature", "felicitation");
    const texte = ((await parole.textContent()) ?? "").trim();
    expect([...FELICITATIONS_COMMUNES, ...propres]).toContain(texte);
  },
);

Then(/^jamais l'expression d'un autre personnage guide$/, async ({ page }) => {
  const texte = ((await page.getByTestId("parole").textContent()) ?? "").trim();
  const nom = (await guide(page).getAttribute("data-personnage-guide")) ?? "";
  const autres = Object.entries(EXPRESSIONS_PAR_PERSONNAGE).filter(([autre]) => autre !== nom).flatMap(([, liste]) => liste);
  expect(autres).not.toContain(texte);
});

// L'encouragement est suivi de l'aide par défaut de la question (#23) : on vérifie le début de ce que dit le personnage guide.
Then(/^(.+) dit un encouragement parmi (.+)$/, async ({ page }, _nom: string, encouragements: string) => {
  const parole = page.getByTestId("parole");
  await expect(parole).toHaveAttribute("data-nature", "encouragement");
  const texte = ((await parole.textContent()) ?? "").trim();
  expect(listeDe(encouragements).some((encouragement) => texte.startsWith(encouragement)), texte).toBe(true);
});

// --- Alors : en-tête

Then(/^l'en-tête affiche « (.+) »$/, async ({ page }, texte: string) => {
  await expect(page.getByTestId("enfant-en-cours")).toHaveText(texte);
});

Then(/^l'en-tête propose le choix Son\/Muet, l'accueil et l'espace parent$/, async ({ page }) => {
  const entete = page.getByRole("banner");
  await expect(entete.getByRole("button", { name: "Son" })).toBeVisible();
  await expect(entete.getByRole("button", { name: "Savanturier" })).toBeVisible();
  await expect(entete.getByRole("button", { name: "Espace parent" })).toBeVisible();
});

Then(/^l'en-tête affiche le prénom de Léa, le choix Son\/Muet, l'accueil et l'espace parent$/, async ({ page }) => {
  const entete = page.getByRole("banner");
  await expect(entete.getByTestId("enfant-en-cours")).toContainText("Léa");
  await expect(entete.getByRole("button", { name: "Son" })).toBeVisible();
  await expect(entete.getByRole("button", { name: "Savanturier" })).toBeVisible();
  await expect(entete.getByRole("button", { name: "Espace parent" })).toBeVisible();
});

Then(/^l'en-tête n'affiche aucun prénom ni aucun niveau$/, async ({ page }) => {
  await expect(page.getByTestId("enfant-en-cours")).toHaveCount(0);
});

Then(/^l'en-tête ne propose pas de retour$/, async ({ page }) => {
  await expect(page.getByRole("banner").getByRole("button", { name: "Retour" })).toHaveCount(0);
});

Then(/^l'en-tête propose l'« Espace parent »$/, async ({ page }) => {
  await expect(page.getByRole("banner").getByRole("button", { name: "Espace parent", exact: true })).toBeVisible();
});

Then(/^jamais un « Espace adulte »$/, async ({ page }) => {
  await expect(page.getByText("Espace adulte")).toHaveCount(0);
});

Then(/^chaque commande de l'en-tête mesure au moins 44 px de haut et de large$/, async ({ page }) => {
  const commandes = await page.getByRole("banner").getByRole("button").all();
  expect(commandes.length).toBeGreaterThan(0);
  for (const commande of commandes) {
    const boite = await commande.boundingBox();
    expect(boite?.height).toBeGreaterThanOrEqual(44);
    expect(boite?.width).toBeGreaterThanOrEqual(44);
  }
});

Then(/^elle atteint tour à tour l'accueil, le choix Son\/Muet et l'espace parent$/, async ({ page }) => {
  const entete = page.getByRole("banner");
  for (const nom of ["Savanturier", "Son", "Espace parent"]) {
    await page.keyboard.press("Tab");
    await expect(entete.getByRole("button", { name: nom })).toBeFocused();
  }
});

// --- Alors : mouvements réduits

Then(/^le visage de (.+) montre qu'il (applaudit|réfléchit)$/, async ({ page }, nom: string, action: string) => {
  const humeur = action === "applaudit" ? "applaudit" : "reflechit";
  const visage = leGuide(page, nom).getByTestId("visage");
  await expect(visage).toHaveAttribute("data-humeur", humeur);
});

Then(/^(.+) ne saute pas$/, async ({ page }, nom: string) => {
  await expect(leGuide(page, nom)).toHaveAttribute("data-geste", "aucun");
});

Then(/^(.+) ne penche pas la tête$/, async ({ page }, nom: string) => {
  await expect(leGuide(page, nom)).toHaveAttribute("data-geste", "aucun");
});

/** Le paysage couvre toute la page et son dessin colle au haut de l'écran : on photographie ce que l'écran en montre, car une photo de toute la hauteur est recousue par tuiles et varie d'un point de couleur. */
async function imagesDeLaZone(page: Page, zone: Locator): Promise<Buffer> {
  const boite = await zone.boundingBox();
  const ecran = page.viewportSize();
  if (!boite || !ecran) throw new Error("Zone ou écran introuvable");
  const haut = Math.max(boite.y, 0);
  const bas = Math.min(boite.y + boite.height, ecran.height);
  return page.screenshot({ animations: "allow", clip: { x: Math.max(boite.x, 0), y: haut, width: Math.min(boite.width, ecran.width), height: bas - haut } });
}

Then(/^rien ne bouge dans le paysage ni chez (.+)$/, async ({ page }, nom: string) => {
  const zones = [page.getByTestId("paysage"), leGuide(page, nom)];
  const avant = await Promise.all(zones.map((zone) => imagesDeLaZone(page, zone)));
  const delai = await page.evaluate(() => new Promise<number>((r) => requestAnimationFrame(() => setTimeout(() => r(0), 600))));
  expect(delai).toBe(0);
  const apres = await Promise.all(zones.map((zone) => imagesDeLaZone(page, zone)));
  avant.forEach((image, i) => expect(apres[i]?.equals(image)).toBe(true));
});
