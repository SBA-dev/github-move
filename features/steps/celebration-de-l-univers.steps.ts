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

type Univers = "sports" | "danse" | "animaux" | "princesse" | "police" | "pompier";

const MUSIQUE = "grande victoire";
// Le tirage de la variante est `floor(r * 3)` pour chacun des cinq univers : `hasard-fixe.ts` nomme les rangs 0, 1 et 2 « glissade »,
// « avion » et « danse ». Chaque libellé de variante est rangé ici sous son rang, quel que soit l'univers.
const RANG_DU_TIRAGE: Record<string, VarianteTiree> = {
  "la glissade à genoux": "glissade",
  "l'avion": "avion",
  "la danse avec clin d'œil": "danse",
  "le grand jeté": "glissade",
  "le ruban": "avion",
  "les petits sauts": "danse",
  "le jonglage": "glissade",
  "la noisette croquée": "avion",
  "les joues pleines": "danse",
  "l'arc-en-ciel": "glissade",
  "l'envol": "avion",
  "les chiffres et les lettres": "danse",
  "le chef d'orchestre": "glissade",
  "le tour en trottinette": "avion",
  "la danse de la victoire": "danse",
  "la cloche de la caserne": "glissade",
  "la pluie joyeuse": "danse",
};
// « l'arc-en-ciel » est aussi un libellé de Lumi (rang 0, `arc` en tête) : chez Capitaine Sam, `arc` est au rang 1 (cloche, arc, pluie).
const RANG_DE_L_ARC_EN_CIEL_DES_POMPIERS: VarianteTiree = "avion";
const TEXTE_DU_TIRAGE = `(${Object.keys(RANG_DU_TIRAGE).join("|")})`;

// Coach Léo (Sports) : libellé → valeur de `data-variante`.
const VARIANTES_DE_COACH_LEO: Record<string, string> = {
  "la glissade à genoux": "glissade",
  "l'avion": "avion",
  "la danse avec clin d'œil": "danse",
};
const VARIANTES_POSSIBLES = /^(glissade|avion|danse)$/;
const TEXTE_DES_VARIANTES_DE_COACH_LEO = "(la glissade à genoux|l'avion|la danse avec clin d'œil)";

// Lili (Danse) : libellé → valeur de `data-variante`.
const VARIANTES_DE_LILI: Record<string, string> = { "le grand jeté": "jete", "le ruban": "ruban", "les petits sauts": "sauts" };
const VARIANTES_POSSIBLES_DE_LILI = /^(jete|ruban|sauts)$/;
const TEXTE_DES_VARIANTES_DE_LILI = "(le grand jeté|le ruban|les petits sauts)";

// Noisette (Animaux de la forêt) : libellé → valeur de `data-variante`.
const VARIANTES_DE_NOISETTE: Record<string, string> = { "le jonglage": "jongle", "la noisette croquée": "mange", "les joues pleines": "joues" };
const VARIANTES_POSSIBLES_DE_NOISETTE = /^(jongle|mange|joues)$/;
const TEXTE_DES_VARIANTES_DE_NOISETTE = "(le jonglage|la noisette croquée|les joues pleines)";

// Lumi (Princesses et fées) : libellé → valeur de `data-variante`.
const VARIANTES_DE_LUMI: Record<string, string> = { "l'arc-en-ciel": "arc", "l'envol": "envol", "les chiffres et les lettres": "signes" };
const VARIANTES_POSSIBLES_DE_LUMI = /^(arc|envol|signes)$/;
const TEXTE_DES_VARIANTES_DE_LUMI = "(l'arc-en-ciel|l'envol|les chiffres et les lettres)";

// Agent Max (Police) : libellé → valeur de `data-variante`.
const VARIANTES_D_AGENT_MAX: Record<string, string> = {
  "le chef d'orchestre": "orchestre",
  "le tour en trottinette": "trottinette",
  "la danse de la victoire": "danse",
};
const VARIANTES_POSSIBLES_D_AGENT_MAX = /^(orchestre|trottinette|danse)$/;
const TEXTE_DES_VARIANTES_D_AGENT_MAX = "(le chef d'orchestre|le tour en trottinette|la danse de la victoire)";

// Capitaine Sam (Pompiers) : libellé → valeur de `data-variante`.
const VARIANTES_DE_CAPITAINE_SAM: Record<string, string> = {
  "la cloche de la caserne": "cloche",
  "l'arc-en-ciel": "arc",
  "la pluie joyeuse": "pluie",
};
const VARIANTES_POSSIBLES_DE_CAPITAINE_SAM = /^(cloche|arc|pluie)$/;
const TEXTE_DES_VARIANTES_DE_CAPITAINE_SAM = "(la cloche de la caserne|l'arc-en-ciel|la pluie joyeuse)";

Before({ tags: "@issue-106" }, async ({ page }) => {
  await page.addInitScript(installerLesFauxDeLaStory97, { echec: false, retenir: [] });
  await installerLeHasardDeLaCelebration(page);
});

const variantesVues = new WeakMap<Page, string>();

const scene = (page: Page): Locator => page.getByTestId("celebration-de-l-univers");

async function attendreLaScene(page: Page, univers: Univers = "sports"): Promise<Locator> {
  await expect(scene(page)).toHaveCount(1, { timeout: DELAI_DE_L_ATTENTE_MS });
  await expect(scene(page)).toHaveAttribute("data-univers", univers);
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
  new RegExp(`^le hasard de la célébration de l'univers tire « ${TEXTE_DU_TIRAGE} »$`),
  async ({ page }, variante: string) => {
    const universDuProfil = await page.locator(".application").getAttribute("data-univers");
    const rang = variante === "l'arc-en-ciel" && universDuProfil === "pompier"
      ? RANG_DE_L_ARC_EN_CIEL_DES_POMPIERS
      : RANG_DU_TIRAGE[variante] as VarianteTiree;
    await fixerLeTirageDeLaCelebration(page, rang);
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

Then(new RegExp(`^Coach Léo marque un but, puis fait ${TEXTE_DES_VARIANTES_DE_COACH_LEO}$`), async ({ page }, variante: string) => {
  const celebration = await attendreLaScene(page);
  await expect(celebration).toHaveAttribute("data-variante", VARIANTES_DE_COACH_LEO[variante] as string);
  await attendreLeCri(page, "BUT !");
  await attendreLaFinDeLaScene(page);
});

Then(/^Léa lit « BUT ! »$/, async ({ page }) => {
  await attendreLaScene(page);
  await attendreLeCri(page, "BUT !");
});

Then(
  /^Lili joue la célébration de l'univers « Danse » : elle entre en scène et fait une pirouette, puis le grand jeté, le ruban ou les petits sauts$/,
  async ({ page }) => {
    const celebration = await attendreLaScene(page, "danse");
    await expect(celebration).toHaveAttribute("data-variante", VARIANTES_POSSIBLES_DE_LILI);
    await attendreLeCri(page, "Bravo !");
    await attendreLaFinDeLaScene(page);
  },
);

Then(new RegExp(`^Lili entre en scène et fait une pirouette, puis ${TEXTE_DES_VARIANTES_DE_LILI}$`), async ({ page }, variante: string) => {
  const celebration = await attendreLaScene(page, "danse");
  await expect(celebration).toHaveAttribute("data-variante", VARIANTES_DE_LILI[variante] as string);
  await attendreLeCri(page, "Bravo !");
  await attendreLaFinDeLaScene(page);
});

Then(/^Léa lit « Bravo ! »$/, async ({ page }) => {
  await attendreLaScene(page, "danse");
  await attendreLeCri(page, "Bravo !");
});

Then(
  /^Noisette joue la célébration de l'univers « Animaux de la forêt » : elle attrape une noisette dorée, puis le jonglage, la noisette croquée ou les joues pleines$/,
  async ({ page }) => {
    const celebration = await attendreLaScene(page, "animaux");
    await expect(celebration).toHaveAttribute("data-variante", VARIANTES_POSSIBLES_DE_NOISETTE);
    await attendreLeCri(page, "Hourra !");
    await attendreLaFinDeLaScene(page);
  },
);

Then(new RegExp(`^Noisette attrape une noisette dorée, puis ${TEXTE_DES_VARIANTES_DE_NOISETTE}$`), async ({ page }, variante: string) => {
  const celebration = await attendreLaScene(page, "animaux");
  await expect(celebration).toHaveAttribute("data-variante", VARIANTES_DE_NOISETTE[variante] as string);
  await attendreLeCri(page, "Hourra !");
  await attendreLaFinDeLaScene(page);
});

Then(/^Léa lit « Hourra ! »$/, async ({ page }) => {
  await attendreLaScene(page, "animaux");
  await attendreLeCri(page, "Hourra !");
});

Then(
  /^Lumi joue la célébration de l'univers « Princesses et fées » : elle fait éclore une fleur magique d'un sort, puis l'arc-en-ciel, l'envol ou les chiffres et les lettres$/,
  async ({ page }) => {
    const celebration = await attendreLaScene(page, "princesse");
    await expect(celebration).toHaveAttribute("data-variante", VARIANTES_POSSIBLES_DE_LUMI);
    await attendreLaFleurMagique(page);
    await attendreLeCri(page, "Magique !");
    await attendreLaFinDeLaScene(page);
  },
);

Then(
  /^Agent Max joue la célébration de l'univers « Police » : il retrouve un chiot perdu, puis le chef d'orchestre, le tour en trottinette ou la danse de la victoire$/,
  async ({ page }) => {
    const celebration = await attendreLaScene(page, "police");
    await expect(celebration).toHaveAttribute("data-variante", VARIANTES_POSSIBLES_D_AGENT_MAX);
    await attendreLeCri(page, "Enquête résolue !");
    await attendreLaFinDeLaScene(page);
  },
);

Then(
  /^Capitaine Sam joue la célébration de l'univers « Pompiers » : il arrose le jardin de la caserne et les fleurs s'ouvrent, puis la cloche de la caserne, l'arc-en-ciel ou la pluie joyeuse$/,
  async ({ page }) => {
    const celebration = await attendreLaScene(page, "pompier");
    await expect(celebration).toHaveAttribute("data-variante", VARIANTES_POSSIBLES_DE_CAPITAINE_SAM);
    await attendreLeCri(page, "Mission accomplie !");
    await attendreLaFinDeLaScene(page);
  },
);

Then(
  new RegExp(`^Capitaine Sam arrose le jardin de la caserne et les fleurs s'ouvrent, puis ${TEXTE_DES_VARIANTES_DE_CAPITAINE_SAM}$`),
  async ({ page }, variante: string) => {
    const celebration = await attendreLaScene(page, "pompier");
    await expect(celebration).toHaveAttribute("data-variante", VARIANTES_DE_CAPITAINE_SAM[variante] as string);
    await attendreLeCri(page, "Mission accomplie !");
    await attendreLaFinDeLaScene(page);
  },
);

Then(/^Léa lit « Mission accomplie ! »$/, async ({ page }) => {
  await attendreLaScene(page, "pompier");
  await attendreLeCri(page, "Mission accomplie !");
});

Then(new RegExp(`^Lumi fait éclore une fleur magique d'un sort, puis ${TEXTE_DES_VARIANTES_DE_LUMI}$`), async ({ page }, variante: string) => {
  const celebration = await attendreLaScene(page, "princesse");
  await expect(celebration).toHaveAttribute("data-variante", VARIANTES_DE_LUMI[variante] as string);
  await attendreLaFleurMagique(page);
  await attendreLeCri(page, "Magique !");
  await attendreLaFinDeLaScene(page);
});

Then(/^Léa lit « Magique ! »$/, async ({ page }) => {
  await attendreLaScene(page, "princesse");
  await attendreLeCri(page, "Magique !");
});

/** La fleur éclot au tout début : son groupe (`princesse-fleur`) devient opaque et le reste jusqu'à la fin. */
async function attendreLaFleurMagique(page: Page): Promise<void> {
  const fleur = scene(page).locator("#princesse-fleur");
  await expect(fleur).toHaveCount(1);
  await expect.poll(
    async () => await fleur.evaluate((element) => Number(getComputedStyle(element).opacity)),
    { timeout: DELAI_DE_L_ATTENTE_MS, message: "la fleur magique a éclos" },
  ).toBeGreaterThanOrEqual(0.99);
}

Then(new RegExp(`^Agent Max retrouve un chiot perdu, puis ${TEXTE_DES_VARIANTES_D_AGENT_MAX}$`), async ({ page }, variante: string) => {
  const celebration = await attendreLaScene(page, "police");
  await expect(celebration).toHaveAttribute("data-variante", VARIANTES_D_AGENT_MAX[variante] as string);
  await attendreLeCri(page, "Enquête résolue !");
  await attendreLaFinDeLaScene(page);
});

Then(/^Léa lit « Enquête résolue ! »$/, async ({ page }) => {
  await attendreLaScene(page, "police");
  await attendreLeCri(page, "Enquête résolue !");
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
  await verifierLImageFixe(page, "sports", VARIANTES_POSSIBLES, "BUT !");
});

Then(/^Léa voit l'image fixe de la célébration de l'univers « Animaux de la forêt », avec « Hourra ! », sans mouvement$/, async ({ page }) => {
  await verifierLImageFixe(page, "animaux", VARIANTES_POSSIBLES_DE_NOISETTE, "Hourra !");
});

Then(/^Léa voit l'image fixe de la célébration de l'univers « Danse », avec « Bravo ! », sans mouvement$/, async ({ page }) => {
  await verifierLImageFixe(page, "danse", VARIANTES_POSSIBLES_DE_LILI, "Bravo !");
});

Then(/^Léa voit l'image fixe de la célébration de l'univers « Princesses et fées », avec « Magique ! », sans mouvement$/, async ({ page }) => {
  await verifierLImageFixe(page, "princesse", VARIANTES_POSSIBLES_DE_LUMI, "Magique !");
});

Then(/^Léa voit l'image fixe de la célébration de l'univers « Police », avec « Enquête résolue ! », sans mouvement$/, async ({ page }) => {
  await verifierLImageFixe(page, "police", VARIANTES_POSSIBLES_D_AGENT_MAX, "Enquête résolue !");
});

Then(/^Léa voit l'image fixe de la célébration de l'univers « Pompiers », avec « Mission accomplie ! », sans mouvement$/, async ({ page }) => {
  await verifierLImageFixe(page, "pompier", VARIANTES_POSSIBLES_DE_CAPITAINE_SAM, "Mission accomplie !");
});

async function verifierLImageFixe(page: Page, univers: Univers, variantes: RegExp, cri: string): Promise<void> {
  const celebration = await attendreLaScene(page, univers);
  await expect(celebration).toHaveAttribute("data-mouvements", "reduits");
  await expect(celebration).toHaveAttribute("data-etat", "terminee");
  await expect(celebration).toHaveAttribute("data-variante", variantes);
  await attendreLeCri(page, cri);
  await expect(page.getByTestId("confettis-de-la-celebration")).toHaveCount(0);
  const animationsEnCours = await celebration.evaluate(
    (element) => element.getAnimations({ subtree: true }).filter((animation) => animation.playState === "running").length,
  );
  expect(animationsEnCours, "animations en cours dans la scène").toBe(0);
}

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

Then(
  /^Lili n'apparaît qu'une fois, dans la célébration de l'univers, la bulle gardant ses paroles$/,
  async ({ page }) => {
    await attendreLaScene(page, "danse");
    await verifierQueLaBulleGardeSesParoles(page);
    await expect(petitPersonnage(page), "le petit personnage guide à côté de la bulle").toHaveCount(0);
  },
);

Then(
  /^Noisette n'apparaît qu'une fois, dans la célébration de l'univers, la bulle gardant ses paroles$/,
  async ({ page }) => {
    await attendreLaScene(page, "animaux");
    await verifierQueLaBulleGardeSesParoles(page);
    await expect(petitPersonnage(page), "le petit personnage guide à côté de la bulle").toHaveCount(0);
  },
);

Then(
  /^Lumi n'apparaît qu'une fois, dans la célébration de l'univers, la bulle gardant ses paroles$/,
  async ({ page }) => {
    await attendreLaScene(page, "princesse");
    await verifierQueLaBulleGardeSesParoles(page);
    await expect(petitPersonnage(page), "le petit personnage guide à côté de la bulle").toHaveCount(0);
  },
);

Then(
  /^Agent Max n'apparaît qu'une fois, dans la célébration de l'univers, la bulle gardant ses paroles$/,
  async ({ page }) => {
    await attendreLaScene(page, "police");
    await verifierQueLaBulleGardeSesParoles(page);
    await expect(petitPersonnage(page), "le petit personnage guide à côté de la bulle").toHaveCount(0);
  },
);

Then(
  /^Capitaine Sam n'apparaît qu'une fois, dans la célébration de l'univers, la bulle gardant ses paroles$/,
  async ({ page }) => {
    await attendreLaScene(page, "pompier");
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
    await expect(bulle(page)).toHaveText(`Bravo Léa ! Tu as relevé le défi ${numero} !`);
  },
);

Then(
  /^Léa entend la musique de la célébration de Lili, puis Lili dit « Bravo Léa ! Tu as relevé le défi (\d+) ! »$/,
  async ({ page }, numero: string) => {
    await effetPuisParole(page, [MUSIQUE], "felicitation", true);
    await expect(bulle(page)).toHaveText(`Bravo Léa ! Tu as relevé le défi ${numero} !`);
  },
);

Then(
  /^Léa entend la musique de la célébration de Noisette, puis Noisette dit « Bravo Léa ! Tu as relevé le défi (\d+) ! »$/,
  async ({ page }, numero: string) => {
    await effetPuisParole(page, [MUSIQUE], "felicitation", true);
    await expect(bulle(page)).toHaveText(`Bravo Léa ! Tu as relevé le défi ${numero} !`);
  },
);

Then(
  /^Léa entend la musique de la célébration de Lumi, puis Lumi dit « Bravo Léa ! Tu as relevé le défi (\d+) ! »$/,
  async ({ page }, numero: string) => {
    await effetPuisParole(page, [MUSIQUE], "felicitation", true);
    await expect(bulle(page)).toHaveText(`Bravo Léa ! Tu as relevé le défi ${numero} !`);
  },
);

Then(
  /^Léa entend la musique de la célébration d'Agent Max, puis Agent Max dit « Bravo Léa ! Tu as relevé le défi (\d+) ! »$/,
  async ({ page }, numero: string) => {
    await effetPuisParole(page, [MUSIQUE], "felicitation", true);
    await expect(bulle(page)).toHaveText(`Bravo Léa ! Tu as relevé le défi ${numero} !`);
  },
);

Then(
  /^Léa entend la musique de la célébration de Capitaine Sam, puis Capitaine Sam dit « Bravo Léa ! Tu as relevé le défi (\d+) ! »$/,
  async ({ page }, numero: string) => {
    await effetPuisParole(page, [MUSIQUE], "felicitation", true);
    await expect(bulle(page)).toHaveText(`Bravo Léa ! Tu as relevé le défi ${numero} !`);
  },
);

Then(
  /^Léa entend l'effet sonore « ([^«»]+) », puis (Coach Léo|Lumi|Agent Max|Capitaine Sam|Lili) dit « ([^«»]+) »$/,
  async ({ page }, effet: string, _personnage: string, texte: string) => {
    await effetPuisParole(page, [effet], "felicitation", true);
    await expect(bulle(page)).toHaveText(normaliser(texte));
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
  await verifierQueLaSceneEstMuettePourLesLecteursDEcran(page, "sports", "BUT !");
});

Then(/^les lecteurs d'écran n'annoncent ni « Bravo ! » ni le dessin de la célébration$/, async ({ page }) => {
  await verifierQueLaSceneEstMuettePourLesLecteursDEcran(page, "danse", "Bravo !");
});

Then(/^les lecteurs d'écran n'annoncent ni « Hourra ! » ni le dessin de la célébration$/, async ({ page }) => {
  await verifierQueLaSceneEstMuettePourLesLecteursDEcran(page, "animaux", "Hourra !");
});

Then(/^les lecteurs d'écran n'annoncent ni « Magique ! » ni le dessin de la célébration$/, async ({ page }) => {
  await verifierQueLaSceneEstMuettePourLesLecteursDEcran(page, "princesse", "Magique !");
});

Then(/^les lecteurs d'écran n'annoncent ni « Enquête résolue ! » ni le dessin de la célébration$/, async ({ page }) => {
  await verifierQueLaSceneEstMuettePourLesLecteursDEcran(page, "police", "Enquête résolue !");
});

Then(/^les lecteurs d'écran n'annoncent ni « Mission accomplie ! » ni le dessin de la célébration$/, async ({ page }) => {
  await verifierQueLaSceneEstMuettePourLesLecteursDEcran(page, "pompier", "Mission accomplie !");
});

/** Le cri est cherché tel quel : la bulle « Bravo Léa ! … » reste lisible. */
async function verifierQueLaSceneEstMuettePourLesLecteursDEcran(page: Page, univers: Univers, cri: string): Promise<void> {
  const celebration = await attendreLaScene(page, univers);
  await attendreLeCri(page, cri);
  await attendreLaFinDeLaScene(page);
  await expect(celebration).toHaveAttribute("aria-hidden", "true");
  await expect(celebration.locator("[aria-live], [role=status], [role=alert], [role=img], [aria-label]")).toHaveCount(0);
  const exposes = await page.evaluate((texte) =>
    [...document.querySelectorAll("body *")].filter((element) =>
      element.children.length === 0 && (element.textContent ?? "").trim() === texte && element.closest("[aria-hidden=true]") === null
    ).length, cri);
  expect(exposes, `éléments qui portent « ${cri} » sans être cachés aux lecteurs d'écran`).toBe(0);
  await expect(page.locator("[aria-live], [role=status], [role=alert]").filter({ hasText: new RegExp(`^${cri}$`) })).toHaveCount(0);
}

Then(
  /^(?:aucun confetti ni (?:pétale|feuille|étincelle du jardin|pétale de la caserne) ne tombe|ni les confettis de la célébration commune ni les confettis du commissariat ne tombent)$/,
  async ({ page }) => {
    await attendreLaFinDuDefi(page);
    await laisserSeDerouler(page);
    await expect(page.getByTestId("confettis-de-la-celebration")).toHaveCount(0);
    await expect(page.getByTestId("confettis")).toHaveCount(0);
    const observation = await observer(page);
    expect(observation.vu.filter((vu) => vu.startsWith("confettis:")), "confettis").toEqual([]);
  },
);
