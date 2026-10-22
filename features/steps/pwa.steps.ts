import { devices, expect, type Page } from "@playwright/test";
import { Given, Then, When } from "./fixtures.ts";

const NOM_APPLICATION = "Savanturier";
const LECONS_MINIMUM = 265;
const LECON_AJOUTEE = "lecon-ajoutee-par-le-test";
const PREFIXE_CACHE = "savanturier-";

type Icone = { src: string; sizes: string; type?: string };
type Manifeste = {
  name?: string;
  short_name?: string;
  display?: string;
  start_url?: string;
  scope?: string;
  theme_color?: string;
  background_color?: string;
  icons?: Icone[];
};

// --- Appareils (l'émulation ne change que l'identité du navigateur : le moteur reste Chromium)

async function emulerNavigateur(page: Page, userAgent: string) {
  const session = await page.context().newCDPSession(page);
  await session.send("Emulation.setUserAgentOverride", { userAgent });
}

const tabletteAndroid = () => devices["Galaxy Tab S4"].userAgent;
// Depuis iPadOS 13, Safari se présente comme un Mac ; seul maxTouchPoints trahit l'écran tactile.
const USER_AGENT_SAFARI_IPAD =
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Safari/605.1.15";

async function emulerSafariIpad(page: Page) {
  await emulerNavigateur(page, USER_AGENT_SAFARI_IPAD);
  await page.addInitScript(() => Object.defineProperty(Navigator.prototype, "maxTouchPoints", { get: () => 5 }));
}

// --- Service worker

async function attendreServiceWorkerActif(page: Page) {
  await expect
    .poll(() =>
      page.evaluate(async () => {
        const inscription = await navigator.serviceWorker?.getRegistration();
        return inscription?.active?.state ?? "aucun service worker actif";
      }), { message: "un service worker doit être actif" })
    .toBe("activated");
}

async function verifierPageControleeParServiceWorker(page: Page) {
  await expect
    .poll(() => page.evaluate(() => navigator.serviceWorker?.controller?.state ?? "page non contrôlée"), {
      message: "le service worker doit contrôler la page",
    })
    .toBe("activated");
}

async function chargerUneFois(page: Page) {
  await page.goto("/");
  await expect(page.getByRole("heading", { level: 1, name: NOM_APPLICATION })).toBeVisible();
  await attendreServiceWorkerActif(page);
  await page.reload();
  await verifierPageControleeParServiceWorker(page);
}

// --- Manifeste

async function lireManifeste(page: Page): Promise<{ manifeste: Manifeste; url: string }> {
  const href = await page.evaluate(() => document.querySelector('link[rel="manifest"]')?.getAttribute("href") ?? null);
  expect(href, 'la page doit déclarer <link rel="manifest">').not.toBeNull();
  const url = new URL(href as string, page.url()).href;
  const reponse = await page.request.get(url);
  expect(reponse.ok(), `le manifeste ${url} doit se charger`).toBe(true);
  return { manifeste: (await reponse.json()) as Manifeste, url };
}

function icone(manifeste: Manifeste, taille: string): Icone | undefined {
  return manifeste.icons?.find((i) => i.sizes.split(" ").includes(taille));
}

async function verifierManifesteInstallable(page: Page) {
  const { manifeste, url } = await lireManifeste(page);
  expect(manifeste.name).toBe(NOM_APPLICATION);
  expect(manifeste.short_name).toBe(NOM_APPLICATION);
  expect(manifeste.display).toBe("standalone");
  expect(manifeste.theme_color).toMatch(/^#[0-9a-f]{3,8}$/i);
  expect(manifeste.background_color).toMatch(/^#[0-9a-f]{3,8}$/i);
  const demarrage = new URL(manifeste.start_url ?? "", url);
  const portee = new URL(manifeste.scope ?? "", url);
  expect(demarrage.origin).toBe(new URL(page.url()).origin);
  expect(demarrage.pathname.startsWith(portee.pathname), "start_url dans le scope").toBe(true);
  for (const taille of ["192x192", "512x512"]) {
    const trouvee = icone(manifeste, taille);
    expect(trouvee, `une icône ${taille} est déclarée`).toBeDefined();
    const reponse = await page.request.get(new URL(trouvee?.src ?? "", url).href);
    expect(reponse.ok(), `l'icône ${taille} se charge`).toBe(true);
    expect(reponse.headers()["content-type"]).toBe("image/png");
  }
}

async function verifierInstallable(page: Page) {
  await verifierManifesteInstallable(page);
  await attendreServiceWorkerActif(page);
  await page.reload();
  await verifierPageControleeParServiceWorker(page);
}

// --- Aide iPad / iPhone

const aideAjoutEcranAccueil = (page: Page) => page.getByRole("region", { name: /écran d['’]accueil/i });

async function bibliotheque(page: Page) {
  return page.evaluate(async () => {
    const reponse = await fetch("/bibliotheque.json");
    const lecons = (await reponse.json()) as { id: string }[];
    return { ok: reponse.ok, identifiants: lecons.map((l) => l.id) };
  });
}

// --- Étant donné

Given("Paul ouvre Savanturier dans le navigateur de sa tablette Android", async ({ page }) => {
  await emulerNavigateur(page, tabletteAndroid());
  await page.goto("/");
});

Given("Paul ouvre Savanturier dans Safari sur son iPad", async ({ page }) => {
  await emulerSafariIpad(page);
  await page.goto("/");
});

Given("Paul a installé Savanturier sur sa tablette", async ({ page }) => {
  await emulerNavigateur(page, tabletteAndroid());
  await page.goto("/");
  await verifierInstallable(page);
});

Given("Paul a installé Savanturier sur un téléphone de {int} px de large", async ({ page }, largeur: number) => {
  await page.setViewportSize({ width: largeur, height: 740 });
  await page.goto("/");
  await verifierInstallable(page);
});

Given("Paul a ajouté Savanturier à l'écran d'accueil de son iPad", async ({ page }) => {
  await emulerSafariIpad(page);
  // Safari expose navigator.standalone === true quand l'application est ouverte depuis l'écran d'accueil.
  await page.addInitScript(() => Object.defineProperty(navigator, "standalone", { value: true }));
  await page.goto("/");
  await verifierManifesteInstallable(page);
});

Given("Savanturier a déjà été chargé une fois sur la tablette", async ({ page }) => {
  await chargerUneFois(page);
});

Given("le réseau est coupé", async ({ context }) => {
  await context.setOffline(true);
});

Given("Léa est en train d'utiliser Savanturier", async ({ page, pwa }) => {
  await chargerUneFois(page);
  await page.evaluate(() => Object.assign(window, { marqueurEnCours: "en cours" }));
  page.on("framenavigated", (cadre) => {
    if (cadre === page.mainFrame()) pwa.navigations += 1;
  });
});

Given("une nouvelle version de Savanturier a été publiée depuis", async ({ pwa }) => {
  await pwa.publierVersion();
});

Given("la bibliothèque a reçu une nouvelle leçon depuis", async ({ pwa }) => {
  await pwa.publierLecon();
});

// --- Quand

When("Savanturier a fini de se charger", async ({ page }) => {
  await expect(page.getByRole("heading", { level: 1, name: NOM_APPLICATION })).toBeVisible();
  await page.waitForLoadState("networkidle");
});

When("Léa ouvre Savanturier depuis l'écran d'accueil de la tablette", async ({ page }) => {
  await page.goto("/");
});

When("Léa ouvre Savanturier depuis l'écran d'accueil du téléphone", async ({ page }) => {
  await page.goto("/");
});

When("Léa ouvre Savanturier depuis l'écran d'accueil de l'iPad", async ({ page }) => {
  await page.goto("/");
});

When("une nouvelle version de Savanturier est publiée", async ({ page, pwa }) => {
  const version = await pwa.publierVersion();
  await page.evaluate(async () => {
    const inscription = await navigator.serviceWorker.getRegistration();
    await inscription?.update();
  });
  await expect
    .poll(() => page.evaluate(() => caches.keys()), { message: "la nouvelle version doit être téléchargée" })
    .toContain(`${PREFIXE_CACHE}${version}`);
});

// « Léa relance Savanturier » (sans réseau coupé) est défini dans voix.steps.ts : un rechargement de la page.
When(/^Léa relance Savanturier avec le réseau$/, async ({ page }) => {
  await page.reload();
});

// --- Alors

Then("le navigateur propose d'installer « Savanturier »", async ({ page }) => {
  await verifierInstallable(page);
});

Then("l'application installée porte le nom et l'icône de Savanturier", async ({ page }) => {
  const { manifeste, url } = await lireManifeste(page);
  expect(manifeste.name).toBe(NOM_APPLICATION);
  expect(manifeste.short_name).toBe(NOM_APPLICATION);
  for (const taille of ["192x192", "512x512"]) {
    const source = new URL(icone(manifeste, taille)?.src ?? "", url).href;
    const largeurNaturelle = await page.evaluate(
      (src) =>
        new Promise<number>((resolve) => {
          const image = new Image();
          image.onload = () => resolve(image.naturalWidth);
          image.onerror = () => resolve(0);
          image.src = src;
        }),
      source,
    );
    expect(largeurNaturelle, `l'icône ${taille} est une image lisible`).toBe(Number(taille.split("x")[0]));
  }
});

// Chromium n'accepte pas d'émuler `display-mode: standalone` (CDP) : on vérifie le manifeste,
// qui est ce que le navigateur lit pour ouvrir l'application sans sa barre.
Then("Savanturier s'affiche en plein écran, sans la barre du navigateur", async ({ page }) => {
  const { manifeste } = await lireManifeste(page);
  expect(manifeste.display).toBe("standalone");
});

Then("elle voit le nom de l'application", async ({ page }) => {
  await expect(page.getByRole("heading", { level: 1, name: NOM_APPLICATION })).toBeVisible();
});

Then("aucune invitation à installer n'apparaît dans l'application", async ({ page }) => {
  await expect(page.getByRole("heading", { level: 1, name: NOM_APPLICATION })).toBeVisible();
  await expect(page.getByRole("button", { name: /installer/i })).toHaveCount(0);
  await expect(page.getByRole("link", { name: /installer/i })).toHaveCount(0);
  await expect(aideAjoutEcranAccueil(page)).toHaveCount(0);
});

Then("Paul voit comment ajouter Savanturier à l'écran d'accueil de son iPad", async ({ page }) => {
  const aide = aideAjoutEcranAccueil(page);
  await expect(aide).toBeVisible();
  await expect(aide).toContainText("Partager");
  await expect(aide).toContainText(/Sur l['’]écran d['’]accueil/);
  const debordement = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
  expect(debordement, "la page tient dans la largeur de l'écran").toBeLessThanOrEqual(0);
});

Then("aucune aide pour ajouter Savanturier à l'écran d'accueil n'apparaît", async ({ page }) => {
  await expect(page.getByRole("heading", { level: 1, name: NOM_APPLICATION })).toBeVisible();
  await expect(aideAjoutEcranAccueil(page)).toHaveCount(0);
  await expect(page.getByText(/écran d['’]accueil/i)).toHaveCount(0);
});

Then("aucun message d'erreur du navigateur n'apparaît", async ({ page }) => {
  await expect(page).toHaveTitle(NOM_APPLICATION);
});

Then("les leçons de la bibliothèque sont disponibles", async ({ page }) => {
  const { ok, identifiants } = await bibliotheque(page);
  expect(ok).toBe(true);
  expect(identifiants.length).toBeGreaterThanOrEqual(LECONS_MINIMUM);
});

Then("Léa reste là où elle en était, sans que l'écran se recharge", async ({ page, pwa }) => {
  await expect.poll(() => page.evaluate(() => (window as unknown as { marqueurEnCours?: string }).marqueurEnCours)).toBe("en cours");
  expect(pwa.navigations).toBe(0);
});

Then("elle utilise la nouvelle version de Savanturier", async ({ page, pwa }) => {
  const nouvelle = pwa.versionPubliee;
  expect(nouvelle).not.toBeNull();
  await expect
    .poll(() => page.evaluate(() => caches.keys()), {
      message: "seul le cache de la nouvelle version doit rester (l'ancienne est active puis supprimée)",
    })
    .toEqual([`${PREFIXE_CACHE}${nouvelle}`]);
});

Then("la nouvelle leçon fait partie de la bibliothèque disponible", async ({ page }) => {
  const { identifiants } = await bibliotheque(page);
  expect(identifiants).toContain(LECON_AJOUTEE);
});
