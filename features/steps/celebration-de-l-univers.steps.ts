import { expect, type Locator, type Page } from "@playwright/test";
import { createBdd } from "playwright-bdd";
import { fixerLeTirageDeLaCelebration, installerLeHasardDeLaCelebration, type VarianteTiree } from "../support/hasard-fixe.ts";
import { commencerLeDefi, finDuDefi, jouerLeDefi, leconsDeTestDeLaMatiere, TOUT_JUSTE } from "./defi-de-fin-de-partie.steps.ts";
import { bulle } from "./etapes-puis-exercices.steps.ts";
import { Before, Given, test, Then, When } from "./fixtures.ts";
import { preparerLesEtoiles } from "./parcours.steps.ts";
import { estSurUnProfilReel, rechargerAvecLeProfilReel } from "./profil-reel.ts";
import {
  attendre,
  configurer,
  DELAI_DE_L_ATTENTE_MS,
  depuisLaMarque,
  EFFETS_DE_FIN,
  effetPuisParole,
  fichierDe,
  installerLesFauxDeLaStory97,
  laisserSeDerouler,
  libererLesEffets,
  noms,
  observer,
  verifierQueLEffetEstCoupe,
} from "./retours-animes-et-sonores.steps.ts";
import { normaliser, reappliquerLAppareil, scenario } from "./voix.steps.ts";

// Story #106 : la célébration de l'univers à la fin du premier défi relevé (livraison 106a, univers « Sports »).
//
// La scène de Coach Léo expose sa racine (`celebration-de-l-univers`) avec `data-univers`, `data-variante`, `data-mouvements` et
// `data-etat` ; le cri de victoire et les confettis de la scène ont leur identifiant. La musique de la célébration est l'effet
// sonore « grande victoire » en attendant le choix du PO (106.12) ; les effets sont suivis par le faux de #97. Le tirage de la
// variante reçoit une valeur par `features/support/hasard-fixe.ts`, comme celui du contrôle parental.

const MUSIQUE = "grande victoire";
const VARIANTES: Record<string, VarianteTiree> = {
  "la glissade à genoux": "glissade",
  "l'avion": "avion",
  "la danse avec clin d'œil": "danse",
};
const VARIANTES_POSSIBLES = /^(glissade|avion|danse)$/;
const TEXTE_DES_VARIANTES = "(la glissade à genoux|l'avion|la danse avec clin d'œil)";

Before({ tags: "@issue-106" }, async ({ page }) => {
  await page.addInitScript(installerLesFauxDeLaStory97, { echec: false, retenir: [] });
  await installerLeHasardDeLaCelebration(page);
});

const variantesVues = new WeakMap<Page, string>();

const scene = (page: Page): Locator => page.getByTestId("celebration-de-l-univers");

async function attendreLaScene(page: Page): Promise<Locator> {
  await expect(scene(page)).toHaveCount(1, { timeout: DELAI_DE_L_ATTENTE_MS });
  await expect(scene(page)).toHaveAttribute("data-univers", "sports");
  return scene(page);
}

/** Le cri est affiché quand le groupe qui le porte est opaque : le but est marqué. */
async function attendreLeCri(page: Page, cri: string): Promise<void> {
  const texte = scene(page).getByTestId("cri-de-victoire");
  await expect(texte).toHaveText(cri, { timeout: DELAI_DE_L_ATTENTE_MS });
  await expect.poll(
    async () => await texte.evaluate((element) => Number(getComputedStyle(element.parentElement ?? element).opacity)),
    { timeout: DELAI_DE_L_ATTENTE_MS, message: `« ${cri} » est affiché` },
  ).toBeGreaterThanOrEqual(0.99);
}

async function attendreLaFinDeLaScene(page: Page): Promise<void> {
  await expect(scene(page)).toHaveAttribute("data-etat", "terminee", { timeout: DELAI_DE_L_ATTENTE_MS });
}

async function attendreLaFinDuDefi(page: Page): Promise<void> {
  await expect(finDuDefi(page).getByRole("button", { name: "Accueil", exact: true })).toBeVisible({ timeout: DELAI_DE_L_ATTENTE_MS });
}

// --- Étant donné

Given(
  new RegExp(`^le hasard de la célébration de l'univers tire « ${TEXTE_DES_VARIANTES} »$`),
  async ({ page }, variante: string) => {
    await fixerLeTirageDeLaCelebration(page, VARIANTES[variante] as VarianteTiree);
  },
);

// Le Muet de l'appareil : le profil de Léa est déjà ouvert (Contexte), on recharge l'application pour que le réglage s'applique.
const { Given: GivenDe106 } = createBdd(test, { tags: "@issue-106" });

GivenDe106(/^la tablette est en Muet$/, async ({ page }) => {
  scenario(page).muet = true;
  await reappliquerLAppareil(page);
  if (!estSurUnProfilReel(page)) return;
  await page.evaluate(() => localStorage.setItem("savanturier:son", "muet"));
  await rechargerAvecLeProfilReel(page);
});

Given(/^Léa voit la célébration de l'univers « Sports » à la fin du défi 1 de maths$/, async ({ famille, page }) => {
  await configurer(page, { retenir: EFFETS_DE_FIN });
  await preparerLesEtoiles(famille, page, "Léa", leconsDeTestDeLaMatiere("maths", 5));
  await commencerLeDefi(page);
  await jouerLeDefi(page, TOUT_JUSTE);
  const celebration = await attendreLaScene(page);
  variantesVues.set(page, (await celebration.getAttribute("data-variante")) ?? "");
  await attendre(page, (observation) =>
    depuisLaMarque(observation).some((effet) => effet.nom === fichierDe(MUSIQUE) && effet.fin === null && !effet.arrete)
  );
});

// --- Quand

When(/^Léa choisit « Mon parcours »$/, async ({ page }) => {
  await finDuDefi(page).getByRole("button", { name: "Mon parcours", exact: true }).click();
});

// --- Alors : la scène de Coach Léo

Then(
  /^Coach Léo joue la célébration de l'univers « Sports » : il marque un but, puis fait la glissade à genoux, l'avion ou la danse avec clin d'œil$/,
  async ({ page }) => {
    const celebration = await attendreLaScene(page);
    await expect(celebration).toHaveAttribute("data-variante", VARIANTES_POSSIBLES);
    await attendreLeCri(page, "BUT !");
    await attendreLaFinDeLaScene(page);
  },
);

Then(new RegExp(`^Coach Léo marque un but, puis fait ${TEXTE_DES_VARIANTES}$`), async ({ page }, variante: string) => {
  const celebration = await attendreLaScene(page);
  await expect(celebration).toHaveAttribute("data-variante", VARIANTES[variante] as VarianteTiree);
  await attendreLeCri(page, "BUT !");
  await attendreLaFinDeLaScene(page);
});

Then(/^Léa lit « BUT ! »$/, async ({ page }) => {
  await attendreLaScene(page);
  await attendreLeCri(page, "BUT !");
});

Then(/^Coach Léo ne joue pas la célébration de l'univers$/, async ({ page }) => {
  await attendreLaFinDuDefi(page);
  await expect(scene(page)).toHaveCount(0);
});

Then(/^aucune célébration de l'univers n'est jouée$/, async ({ page }) => {
  await attendreLaFinDuDefi(page);
  await expect(scene(page)).toHaveCount(0);
});

Then(/^Coach Léo continue la célébration de l'univers$/, async ({ page }) => {
  await expect(scene(page)).toHaveCount(1);
  await expect(scene(page)).toHaveAttribute("data-variante", variantesVues.get(page) ?? VARIANTES_POSSIBLES);
  await expect(finDuDefi(page)).toBeVisible();
});

Then(/^Léa voit l'image fixe de la célébration de l'univers « Sports », avec « BUT ! », sans mouvement$/, async ({ page }) => {
  const celebration = await attendreLaScene(page);
  await expect(celebration).toHaveAttribute("data-mouvements", "reduits");
  await expect(celebration).toHaveAttribute("data-etat", "terminee");
  await expect(celebration).toHaveAttribute("data-variante", VARIANTES_POSSIBLES);
  await attendreLeCri(page, "BUT !");
  await expect(page.getByTestId("confettis-de-la-celebration")).toHaveCount(0);
  const animationsEnCours = await celebration.evaluate(
    (element) => element.getAnimations({ subtree: true }).filter((animation) => animation.playState === "running").length,
  );
  expect(animationsEnCours, "animations en cours dans la scène").toBe(0);
});

// --- Alors : la célébration commune

Then(/^la célébration commune n'est pas jouée$/, async ({ page }) => {
  await attendreLaFinDuDefi(page);
  await laisserSeDerouler(page);
  await expect(page.getByTestId("confettis")).toHaveCount(0);
  const observation = await observer(page);
  expect(observation.vu.filter((vu) => vu.startsWith("confettis:")), "confettis de la célébration commune").toEqual([]);
  const jouees = noms(depuisLaMarque(observation));
  expect(jouees.filter((nom) => nom === fichierDe(MUSIQUE)), "la musique est entendue une seule fois").toHaveLength(1);
  expect(jouees, "l'effet sonore de la célébration commune ne s'y ajoute pas").not.toContain("seance-terminee");
});

// --- Alors : le petit personnage guide à côté de la bulle

const petitPersonnage = (page: Page): Locator => page.getByTestId("personnage-guide");

async function verifierQueLaBulleGardeSesParoles(page: Page): Promise<void> {
  await expect(bulle(page)).toBeVisible({ timeout: DELAI_DE_L_ATTENTE_MS });
  await expect(bulle(page)).not.toHaveText("");
  await expect(finDuDefi(page).getByRole("button", { name: "Réécouter", exact: true })).toBeVisible();
}

Then(
  /^Coach Léo n'apparaît qu'une fois, dans la célébration de l'univers, la bulle gardant ses paroles$/,
  async ({ page }) => {
    await attendreLaScene(page);
    await verifierQueLaBulleGardeSesParoles(page);
    await expect(petitPersonnage(page), "le petit personnage guide à côté de la bulle").toHaveCount(0);
  },
);

Then(/^Coach Léo apparaît à côté de la bulle de ses paroles$/, async ({ page }) => {
  await attendreLaFinDuDefi(page);
  await verifierQueLaBulleGardeSesParoles(page);
  await expect(petitPersonnage(page)).toHaveCount(1);
  await expect(petitPersonnage(page)).toHaveAttribute("data-personnage-guide", "Coach Léo");
  await expect(petitPersonnage(page)).toBeVisible();
});

// --- Alors : la musique

Then(/^Léa entend la musique de la célébration de Coach Léo$/, async ({ page }) => {
  await expect.poll(async () => noms(depuisLaMarque(await observer(page))), { timeout: DELAI_DE_L_ATTENTE_MS }).toContain(fichierDe(MUSIQUE));
});

Then(
  /^Léa entend la musique de la célébration de Coach Léo, puis Coach Léo dit « Bravo Léa ! Tu as relevé le défi (\d+) ! »$/,
  async ({ page }, numero: string) => {
    await effetPuisParole(page, [MUSIQUE], "felicitation", true);
    expect(normaliser((await bulle(page).textContent()) ?? "")).toBe(`Bravo Léa ! Tu as relevé le défi ${numero} !`);
  },
);

Then(
  /^Léa entend l'effet sonore « ([^«»]+) », puis (Coach Léo|Lumi|Agent Max|Capitaine Sam|Lili) dit « ([^«»]+) »$/,
  async ({ page }, effet: string, _personnage: string, texte: string) => {
    await effetPuisParole(page, [effet], "felicitation", true);
    expect(normaliser((await bulle(page).textContent()) ?? "")).toBe(normaliser(texte));
  },
);

Then(/^Léa entend la musique de la célébration de Coach Léo jusqu'au bout$/, async ({ page }) => {
  await libererLesEffets(page);
  const jouees = (await observer(page)).entrees.filter((entree) => entree.nom === fichierDe(MUSIQUE));
  expect(jouees.length).toBeGreaterThan(0);
  for (const entree of jouees) expect(entree.arrete, "la musique n'est pas coupée").toBe(false);
});

Then(/^Léa n'entend plus la musique de la célébration de Coach Léo$/, async ({ page }) => {
  await verifierQueLEffetEstCoupe(page, [fichierDe(MUSIQUE)]);
});

// --- Alors : boutons et lecteurs d'écran

Then(/^« Mon parcours » et « Accueil » mesurent au moins 44 px de haut$/, async ({ page }) => {
  for (const nom of ["Mon parcours", "Accueil"]) {
    const bouton = finDuDefi(page).getByRole("button", { name: nom, exact: true });
    await expect(bouton).toBeVisible({ timeout: DELAI_DE_L_ATTENTE_MS });
    const boite = await bouton.boundingBox();
    expect(boite?.height ?? 0, `hauteur de « ${nom} »`).toBeGreaterThanOrEqual(44);
  }
});

Then(/^les lecteurs d'écran n'annoncent ni « BUT ! » ni le dessin de la célébration$/, async ({ page }) => {
  const celebration = await attendreLaScene(page);
  await attendreLeCri(page, "BUT !");
  await attendreLaFinDeLaScene(page);
  await expect(celebration).toHaveAttribute("aria-hidden", "true");
  await expect(celebration.locator("[aria-live], [role=status], [role=alert], [role=img], [aria-label]")).toHaveCount(0);
  const cri = await page.evaluate(() => {
    const exposes = [...document.querySelectorAll("body *")].filter((element) =>
      element.children.length === 0 && (element.textContent ?? "").includes("BUT !") && element.closest("[aria-hidden=true]") === null
    );
    return exposes.length;
  });
  expect(cri, "éléments qui portent « BUT ! » sans être cachés aux lecteurs d'écran").toBe(0);
  await expect(page.locator("[aria-live], [role=status], [role=alert]").filter({ hasText: "BUT !" })).toHaveCount(0);
});
