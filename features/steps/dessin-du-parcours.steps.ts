import { expect, type Locator, type Page } from "@playwright/test";
import { createBdd, type DataTable } from "playwright-bdd";
import { LECONS_DU_DESSIN } from "../support/bibliotheque-du-dessin-du-parcours.ts";
import { etat, type LeconBrute } from "./etapes-puis-exercices.steps.ts";
import { ETOILES_PAR_SEANCE, jouerLaSeanceCompleteAvecErreurs, noterUneSeanceJouee, ouvrirLeParcoursDeFrancais, preparerLesEtoiles, seancesJoueesDe, verifierUneLecon } from "./parcours.steps.ts";
import { rechargerAvecLeProfilReel } from "./profil-reel.ts";
import { choisirSonProfil } from "./profils-enfants.steps.ts";
import { Given, Then, test, When } from "./fixtures.ts";

// Story #99 : « Mon parcours » se dessine dans le paysage de l'univers, le personnage guide marche jusqu'à la nouvelle prochaine leçon.
// La bibliothèque de test (identifiants « e2e-99- », features/support/bibliotheque-du-dessin-du-parcours.ts) remplace celle de
// l'application dans le navigateur de Léa ; la progression et les séances se préparent comme dans #25.
// Le dessin est lu par les attributs que le front expose (`data-place`, `data-marche`…), jamais par une position en pixels.

const PERSONNAGES = "(Noisette|Coach Léo)";
const DELAI_DE_LA_MARCHE_MS = 10_000;

function echapper(texte: string): string {
  return texte.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function titresCites(liste: string): string[] {
  return [...liste.matchAll(/« ([^«»]+) »/g)].map((m) => m[1] as string);
}

function dessin(page: Page): Locator {
  return page.getByTestId("dessin-du-parcours");
}

function leconsDuDessin(page: Page): Locator {
  return dessin(page).getByTestId("lecon-du-parcours");
}

function guide(page: Page): Locator {
  return page.getByTestId("guide-du-dessin");
}

function leconDeLaPlace(page: Page, place: string | number): Locator {
  return leconsDuDessin(page).filter({ has: page.getByTestId("place-de-la-lecon").and(page.getByText(`Leçon ${place}`, { exact: true })) });
}

function boutonDeLaLecon(page: Page, titre: string): Locator {
  return dessin(page).getByRole("button", { name: new RegExp(`^${echapper(titre)} : `) });
}

// --- Espions installés avant toute navigation : sons, paroles, annonces et début et fin de la marche

type MarqueDeLaMarche = { sons: number; paroles: number };
type EspionsDuDessin = { sons: string[]; annonces: string[]; debut?: MarqueDeLaMarche; fin?: MarqueDeLaMarche };

function installerLesEspions(): void {
  const espions: EspionsDuDessin = { sons: [], annonces: [] };
  Reflect.set(window, "__espions99", espions);
  const joueDeBase = HTMLMediaElement.prototype.play;
  HTMLMediaElement.prototype.play = function () {
    espions.sons.push(this.currentSrc || this.src);
    return joueDeBase.call(this);
  };
  const paroles = () => {
    const faux = Reflect.get(window, "__faux") as { journal: Array<{ type: string }> } | undefined;
    return (faux?.journal ?? []).filter((entree) => entree.type === "speak").length;
  };
  let guideSuivi: Element | null = null;
  new MutationObserver(() => {
    const element = document.querySelector('[data-testid="guide-du-dessin"]');
    // Chaque ouverture de « Mon parcours » dessine un nouveau personnage guide : seule sa marche compte.
    if (element !== guideSuivi) {
      guideSuivi = element;
      espions.debut = undefined;
      espions.fin = undefined;
      espions.annonces = [];
    }
    const marche = element?.getAttribute("data-marche");
    const marque = () => ({ sons: espions.sons.length, paroles: paroles() });
    if (marche === "en-cours" && !espions.debut) espions.debut = marque();
    if (marche === "terminee" && espions.debut && !espions.fin) espions.fin = marque();
    const annonce = document.querySelector('[data-testid="annonce-de-la-marche"]')?.textContent?.trim() ?? "";
    if (annonce !== "" && espions.annonces[espions.annonces.length - 1] !== annonce) espions.annonces.push(annonce);
  }).observe(document, { subtree: true, childList: true, attributes: true, characterData: true });
}

async function lireLesEspions(page: Page): Promise<EspionsDuDessin> {
  return await page.evaluate(() => JSON.parse(JSON.stringify(Reflect.get(window, "__espions99") ?? { sons: [], annonces: [] })) as EspionsDuDessin);
}

// --- Étant donné

Given(/^la bibliothèque de test du dessin du parcours est servie$/, async ({ page }) => {
  etat(page).injectees.push(...(LECONS_DU_DESSIN as LeconBrute[]));
  await page.addInitScript(installerLesEspions);
});

Given(/^Léa a réussi les (\d+) premières leçons de maths du CE1$/, async ({ famille, page }, nombre: string) => {
  const lecons = LECONS_DU_DESSIN.filter((lecon) => lecon.matiere === "maths" && lecon.niveau === "CE1")
    .sort((a, b) => a.ordre - b.ordre)
    .slice(0, Number(nombre))
    .map((lecon) => ({ titre: lecon.titre, etoiles: 1 }));
  await preparerLesEtoiles(famille, page, "Léa", lecons);
});

async function terminerUneSeance(page: Page, titre: string, etoiles: string): Promise<void> {
  noterUneSeanceJouee(page, titre, Number(etoiles));
  await jouerLaSeanceCompleteAvecErreurs(page, titre, ETOILES_PAR_SEANCE[Number(etoiles)] ?? 0);
  await page.getByTestId("fin-de-seance").getByRole("button", { name: "Accueil", exact: true }).click();
}

Given(
  /^Léa a terminé une séance de la leçon « ([^«»]+) » avec (\d) étoiles?, sans avoir ouvert son parcours$/,
  async ({ page, $test }, titre: string, etoiles: string) => {
    $test.slow();
    await terminerUneSeance(page, titre, etoiles);
  },
);

async function revenirALAccueil(page: Page): Promise<void> {
  await page.goBack();
  await expect(page.getByRole("region", { name: /^Accueil de / })).toBeVisible();
}

async function attendreLaFinDeLaMarche(page: Page): Promise<void> {
  await expect(guide(page)).toHaveAttribute("data-marche", "terminee", { timeout: DELAI_DE_LA_MARCHE_MS });
}

Given(/^Léa a vu Noisette marcher jusqu'à la leçon (\d+), puis est revenue à son accueil$/, async ({ famille, page }, place: string) => {
  await ouvrirLeParcoursDeFrancais(famille, page);
  await expect(guide(page)).toHaveAttribute("data-marche-vers", String(place));
  await attendreLaFinDeLaMarche(page);
  await expect(guide(page)).toHaveAttribute("data-place", String(place));
  await revenirALAccueil(page);
});

// « Accueil » mène à l'accueil de l'enfant ; le bandeau « Savanturier » ramène à « Qui joue ? » sans recharger la page.
Given(
  /^Léa a terminé une séance de la leçon « ([^«»]+) » avec (\d) étoiles?, puis s'est choisie de nouveau dans « Qui joue \? »$/,
  async ({ page, $test }, titre: string, etoiles: string) => {
    $test.slow();
    await terminerUneSeance(page, titre, etoiles);
    await page.getByRole("banner").getByRole("button", { name: "Savanturier" }).click();
    await choisirSonProfil(page, "Léa");
  },
);

// Le serveur ne connaît pas les leçons de test : l'étoile d'une séance jouée avant la fermeture n'y est pas enregistrée
// par l'application. La préparation écrit ce que le serveur garderait d'une vraie leçon, avant que l'application ne rouvre.
Given(/^Léa a fermé puis rouvert l'application$/, async ({ famille, page }) => {
  await preparerLesEtoiles(famille, page, "Léa", seancesJoueesDe(page));
  await rechargerAvecLeProfilReel(page);
});

Given(/^Léa a ouvert le parcours de français, où Noisette est déjà sur la leçon (\d+), sans marcher$/, async ({ famille, page }, place: string) => {
  await ouvrirLeParcoursDeFrancais(famille, page);
  await expect(guide(page)).toHaveAttribute("data-place", String(place));
  await expect(guide(page)).toHaveAttribute("data-marche", "aucune");
});

Given(/^Léa a ouvert le parcours de français, pendant que Noisette marche$/, async ({ famille, page }) => {
  await ouvrirLeParcoursDeFrancais(famille, page);
  await page.waitForFunction(
    () => document.querySelector('[data-testid="guide-du-dessin"]')?.getAttribute("data-marche") === "en-cours",
    undefined,
    { polling: "raf", timeout: DELAI_DE_LA_MARCHE_MS },
  );
});

// --- Alors : le dessin

Then(/^le dessin du parcours montre, dans l'ordre :$/, async ({ page }, tableau: DataTable) => {
  const lignes = tableau.hashes();
  const lecons = leconsDuDessin(page);
  await expect(lecons).toHaveCount(lignes.length);
  for (const [rang, ligne] of lignes.entries()) {
    await expect(lecons.nth(rang).getByTestId("place-de-la-lecon")).toHaveText(`Leçon ${String(ligne["place"])}`);
    await verifierUneLecon(dessin(page), rang, String(ligne["leçon"]), String(ligne["état"]));
  }
});

Then(/^le dessin du parcours montre, dans l'ordre, (« .+ »)$/, async ({ page }, liste: string) => {
  const titres = titresCites(liste);
  await expect(leconsDuDessin(page)).toHaveCount(titres.length);
  for (const [rang, titre] of titres.entries()) {
    await expect(leconsDuDessin(page).nth(rang)).toHaveAccessibleName(new RegExp(`^${echapper(titre)} : `));
  }
});

Then(/^le dessin du parcours montre « ([^«»]+) » réussie avec (\d) étoiles?$/, async ({ page }, titre: string, etoiles: string) => {
  const nombre = Number(etoiles);
  const bouton = boutonDeLaLecon(page, titre);
  await expect(bouton).toHaveCount(1);
  await expect(bouton).toHaveAttribute("data-etat", "reussie");
  await expect(bouton).toHaveAccessibleName(`${titre} : réussie, ${nombre} étoile${nombre > 1 ? "s" : ""} sur 3`);
});

async function brille(lecon: Locator): Promise<boolean> {
  return await lecon.evaluate((element) => {
    const eclat = getComputedStyle(element, "::after");
    return eclat.content !== "none" && Number.parseFloat(eclat.borderTopWidth) > 0 && eclat.borderTopStyle !== "none";
  });
}

Then(/^la leçon (\d+) « ([^«»]+) » brille, marquée « À toi ! »$/, async ({ page }, place: string, titre: string) => {
  const lecon = leconDeLaPlace(page, place);
  await expect(lecon).toHaveCount(1);
  await expect(lecon).toHaveAccessibleName(`${titre} : à toi !`);
  await expect(lecon.getByTestId("etat-de-la-lecon")).toHaveText("À toi !");
  expect(await brille(lecon), `la leçon ${place} brille`).toBe(true);
});

Then(/^aucune autre leçon du dessin du parcours ne brille$/, async ({ page }) => {
  const lecons = await leconsDuDessin(page).all();
  expect(lecons.length).toBeGreaterThan(1);
  const brillantes: string[] = [];
  for (const lecon of lecons) if (await brille(lecon)) brillantes.push((await lecon.getAttribute("data-etat")) ?? "");
  expect(brillantes, "les leçons qui brillent").toEqual(["prochaine"]);
});

Then(/^aucune leçon du dessin du parcours n'a de cadenas$/, async ({ page }) => {
  await expect(leconsDuDessin(page).first()).toBeVisible();
  await expect(dessin(page).locator('[data-testid*="cadenas" i], [aria-label*="cadenas" i], [aria-label*="verrouill" i]')).toHaveCount(0);
  for (const lecon of await leconsDuDessin(page).all()) {
    expect(await lecon.textContent()).not.toMatch(/🔒|🔐|cadenas|verrouill/i);
    await expect(lecon).toBeEnabled();
  }
});

Then(
  /^sous le dessin du parcours, les blocs se suivent ainsi : « ([^«»]+) », puis « ([^«»]+) »$/,
  async ({ page }, premier: string, second: string) => {
    const region = (nom: string) => page.getByRole("region", { name: nom, exact: true });
    await expect(region(premier)).toBeVisible();
    await expect(region(second)).toBeVisible();
    const bas = await dessin(page).evaluate((element) => element.getBoundingClientRect().bottom);
    const haut = (nom: string) => region(nom).evaluate((element) => element.getBoundingClientRect().top);
    const hautDuPremier = await haut(premier);
    expect(hautDuPremier, `« ${premier} » est sous le dessin`).toBeGreaterThanOrEqual(bas - 1);
    expect(hautDuPremier, `« ${premier} » est au-dessus de « ${second} »`).toBeLessThan(await haut(second));
  },
);

// --- Alors : le personnage guide se tient

async function verifierLePersonnage(page: Page, personnage: string): Promise<void> {
  await expect(guide(page).getByTestId("personnage-guide")).toHaveAttribute("data-personnage-guide", personnage);
}

Then(
  new RegExp(`^${PERSONNAGES} se tient sur la leçon (\\d+) « ([^«»]+) »(, visible sans que Léa ait fait défiler l'écran)?$`),
  async ({ page }, personnage: string, place: string, titre: string, sansDefiler: string | undefined) => {
    await expect(guide(page)).toHaveAttribute("data-marche", /^(aucune|terminee)$/, { timeout: DELAI_DE_LA_MARCHE_MS });
    await expect(guide(page)).toHaveAttribute("data-place", String(place));
    await verifierLePersonnage(page, personnage);
    await expect(leconDeLaPlace(page, place)).toHaveAccessibleName(new RegExp(`^${echapper(titre)} : `));
    if (sansDefiler != null) {
      await expect(leconDeLaPlace(page, place)).toBeInViewport();
      await expect(guide(page)).toBeInViewport();
    }
  },
);

Then(new RegExp(`^${PERSONNAGES} n'apparaît qu'une seule fois sur l'écran$`), async ({ page }, personnage: string) => {
  await expect(page.getByTestId("personnage-guide")).toHaveCount(1);
  await expect(page.getByTestId("personnage-guide")).toHaveAttribute("data-personnage-guide", personnage);
});

Then(new RegExp(`^${PERSONNAGES} n'est pas à côté du titre « ([^«»]+) »$`), async ({ page }, _personnage: string, titre: string) => {
  const titreDeLEcran = page.getByRole("heading", { level: 2, name: titre, exact: true });
  await expect(titreDeLEcran).toBeVisible();
  const dessinsHorsDuDessin = await page.getByTestId("personnage-guide").evaluateAll(
    (elements) => elements.filter((element) => element.closest('[data-testid="dessin-du-parcours"]') === null).length,
  );
  expect(dessinsHorsDuDessin, "personnages guides hors du dessin du parcours").toBe(0);
  const dansLEnTete = await titreDeLEcran.evaluate((h2) => h2.parentElement?.querySelector(':scope > [data-testid="personnage-guide"]') !== null);
  expect(dansLEnTete, "personnage guide à côté du titre").toBe(false);
});

function couleurCalculee(element: Locator, valeur: "attribut" | "principale"): Promise<string> {
  return element.evaluate((cible, quelle) => {
    const sonde = document.createElement("span");
    sonde.style.color = quelle === "attribut" ? (cible.getAttribute("data-couleur") ?? "") : "var(--principale)";
    (cible.parentElement ?? document.body).appendChild(sonde);
    const couleur = getComputedStyle(sonde).color;
    sonde.remove();
    return couleur;
  }, valeur);
}

Then(
  new RegExp(`^${PERSONNAGES} se tient à la fin du dessin du parcours, l'air content, près d'un fanion à la couleur de l'univers, sur une petite colline fleurie, sans étoile ni texte$`),
  async ({ page }, personnage: string) => {
    await expect(guide(page)).toHaveAttribute("data-marche", /^(aucune|terminee)$/, { timeout: DELAI_DE_LA_MARCHE_MS });
    await expect(guide(page)).toHaveAttribute("data-place", "fin");
    await verifierLePersonnage(page, personnage);
    await expect(guide(page).getByTestId("personnage-guide")).toHaveAttribute("data-humeur", "content");
    const fin = page.getByTestId("fin-du-dessin");
    await expect(fin.getByTestId("colline")).toBeVisible();
    await expect(fin.getByTestId("fleurs")).toBeVisible();
    const fanion = fin.getByTestId("fanion");
    await expect(fanion).toBeVisible();
    const couleurDuFanion = await couleurCalculee(fanion, "attribut");
    expect(couleurDuFanion, "couleur du fanion").not.toBe("");
    expect(couleurDuFanion, "le fanion a la couleur de l'univers").toBe(await couleurCalculee(fanion, "principale"));
    expect((await fin.textContent())?.trim(), "texte de la fin du dessin").toBe("");
    await expect(fin.locator("text")).toHaveCount(0);
    await expect(fin.getByTestId("etoile")).toHaveCount(0);
    await expect(fin.getByTestId("etoiles-dessinees")).toHaveCount(0);
  },
);

Then(/^aucune étoile, aucun badge ni aucun objet de la cabane n'est annoncé$/, async ({ page }) => {
  await expect(guide(page)).toHaveAttribute("data-place", "fin");
  for (const annonce of ["annonce-des-etoiles", "etoiles-gagnees", "annonce-de-nouveau-badge", "annonce-de-la-cabane", "annonce-du-nouvel-episode"]) {
    await expect(page.getByTestId(annonce), annonce).toHaveCount(0);
  }
  await expect(page.getByRole("alert")).toHaveCount(0);
});

// --- Alors : la marche

async function verifierLaMarche(page: Page, depuis: string, vers: string, par: string): Promise<void> {
  const g = guide(page);
  await expect(g).toHaveAttribute("data-marche", /^(en-cours|terminee)$/, { timeout: DELAI_DE_LA_MARCHE_MS });
  await expect(g).toHaveAttribute("data-marche-depuis", String(depuis));
  await expect(g).toHaveAttribute("data-marche-vers", String(vers));
  await expect(g).toHaveAttribute("data-marche-par", par);
  await attendreLaFinDeLaMarche(page);
}

Then(new RegExp(`^${PERSONNAGES} marche de la leçon (\\d+) à la leçon (\\d+)$`), async ({ page }, _p: string, depuis: string, vers: string) => {
  await verifierLaMarche(page, depuis, vers, "");
});

Then(
  new RegExp(`^${PERSONNAGES} marche de la leçon (\\d+) jusqu'à la leçon (\\d+) « ([^«»]+) », en passant par les leçons (\\d+) et (\\d+)$`),
  async ({ page }, _p: string, depuis: string, vers: string, _titre: string, premiere: string, seconde: string) => {
    await verifierLaMarche(page, depuis, vers, `${String(premiere)},${String(seconde)}`);
    await expect(guide(page)).toHaveAttribute("data-place", String(vers));
  },
);

Then(new RegExp(`^${PERSONNAGES} marche de la leçon (\\d+) jusqu'à la fin du dessin du parcours$`), async ({ page }, _p: string, depuis: string) => {
  const g = guide(page);
  await expect(g).toHaveAttribute("data-marche", /^(en-cours|terminee)$/, { timeout: DELAI_DE_LA_MARCHE_MS });
  await expect(g).toHaveAttribute("data-marche-depuis", String(depuis));
  await expect(g).toHaveAttribute("data-marche-vers", "fin");
  await attendreLaFinDeLaMarche(page);
});

Then(new RegExp(`^${PERSONNAGES} s'y tient, l'air content$`), async ({ page }, personnage: string) => {
  await expect(guide(page)).toHaveAttribute("data-place", "fin");
  await verifierLePersonnage(page, personnage);
  await expect(guide(page).getByTestId("personnage-guide")).toHaveAttribute("data-humeur", "content");
  await expect(page.getByTestId("fin-du-dessin").getByTestId("fanion")).toBeVisible();
});

Then(
  new RegExp(`^${PERSONNAGES} est déjà sur la leçon (\\d+) « ([^«»]+) », sans marcher$`),
  async ({ page }, personnage: string, place: string, titre: string) => {
    await expect(guide(page)).toHaveAttribute("data-marche", "aucune");
    await expect(guide(page)).toHaveAttribute("data-place", String(place));
    await verifierLePersonnage(page, personnage);
    await expect(leconDeLaPlace(page, place)).toHaveAccessibleName(new RegExp(`^${echapper(titre)} : `));
  },
);

// --- Alors : lecteurs d'écran, clavier

Then(/^Léa voit le sous-titre « ([^«»]+) » sous le titre « ([^«»]+) »$/, async ({ page }, soustitre: string, titre: string) => {
  const sousTitre = page.getByTestId("sous-titre-du-parcours");
  await expect(sousTitre).toBeVisible();
  await expect(sousTitre).toHaveText(soustitre);
  expect(await sousTitre.evaluate((element) => element.tagName), "un vrai texte").toBe("P");
  const suitLeTitre = await page.getByRole("heading", { level: 2, name: titre, exact: true }).evaluate(
    (h2, sous) => h2.nextElementSibling === sous,
    await sousTitre.elementHandle(),
  );
  expect(suitLeTitre, "le sous-titre suit le titre").toBe(true);
});

Then(/^les lecteurs d'écran lisent « ([^«»]+) », puis « ([^«»]+) »$/, async ({ page }, titre: string, soustitre: string) => {
  const ecran = page.getByRole("region", { name: titre, exact: true });
  await expect(ecran).toBeVisible();
  await expect(ecran).toMatchAriaSnapshot(`
    - heading "${titre}" [level=2]
    - paragraph: ${soustitre}
  `);
});

Then(/^les lecteurs d'écran annoncent une liste ordonnée de (\d+) leçons$/, async ({ page }, nombre: string) => {
  const liste = dessin(page).getByRole("list");
  await expect(liste).toHaveCount(1);
  expect(await liste.evaluate((element) => element.tagName), "liste ordonnée").toBe("OL");
  await expect(liste.getByRole("listitem")).toHaveCount(Number(nombre));
});

Then(new RegExp(`^ils n'annoncent ni le dessin du parcours ni le dessin de ${PERSONNAGES}$`), async ({ page }, _personnage: string) => {
  await expect(leconsDuDessin(page).first()).toBeVisible();
  await expect(page.getByTestId("trace-du-parcours")).toHaveAttribute("aria-hidden", "true");
  for (const dessine of ["personnage-guide", "fin-du-dessin"]) {
    const cache = await page.getByTestId(dessine).evaluate((element) => element.closest('[aria-hidden="true"]') !== null);
    expect(cache, `« ${dessine} » est caché aux lecteurs d'écran`).toBe(true);
  }
  expect((await guide(page).textContent())?.trim(), "texte du dessin de Noisette").toBe("");
  await expect(dessin(page).getByRole("img")).toHaveCount(0);
});

const focusParcourus = new WeakMap<Page, Array<{ nom: string; visible: boolean }>>();

When(/^Léa passe d'une leçon du parcours à la suivante au clavier$/, async ({ page }) => {
  const total = await leconsDuDessin(page).count();
  const vus: Array<{ nom: string; visible: boolean }> = [];
  await leconsDuDessin(page).first().focus();
  for (let rang = 0; rang < total; rang++) {
    if (rang > 0) await page.keyboard.press("Tab");
    const nom = await page.evaluate(() => document.activeElement?.getAttribute("aria-label") ?? "");
    const enFocus = page.locator(":focus");
    await expect(enFocus).toHaveAttribute("data-testid", "lecon-du-parcours");
    const visible = await enFocus.evaluate((element) => {
      const boite = element.getBoundingClientRect();
      return boite.top >= 0 && boite.bottom <= innerHeight && boite.left >= 0 && boite.right <= innerWidth;
    });
    vus.push({ nom, visible });
  }
  focusParcourus.set(page, vus);
});

Then(/^le focus va, dans l'ordre, sur (« .+ »)$/, async ({ page }, liste: string) => {
  const attendus = titresCites(liste);
  const vus = focusParcourus.get(page) ?? [];
  expect(vus.length, "leçons parcourues au clavier").toBe(attendus.length);
  for (const [rang, titre] of attendus.entries()) expect(vus[rang]?.nom).toMatch(new RegExp(`^${echapper(titre)} : `));
});

Then(/^chaque leçon qui a le focus est visible à l'écran$/, async ({ page }) => {
  for (const { nom, visible } of focusParcourus.get(page) ?? []) expect(visible, `« ${nom} » visible quand elle a le focus`).toBe(true);
});

// --- Alors : annonce, sons

// Même texte que l'étape de fin de séance (#97), réservée ici à #99 : l'annonce est celle de la marche.
const { Then: ThenDeLaStory99 } = createBdd(test, { tags: "@issue-99" });

ThenDeLaStory99(/^les lecteurs d'écran annoncent une seule fois « ([^«»]+) »$/, async ({ page }, annonce: string) => {
  await attendreLaFinDeLaMarche(page);
  const annonceDeLaMarche = page.getByTestId("annonce-de-la-marche");
  await expect(annonceDeLaMarche).toHaveText(annonce);
  await expect(annonceDeLaMarche).toHaveAttribute("aria-live", "polite");
  await expect(page.locator("[aria-live]").filter({ hasText: annonce })).toHaveCount(1);
  expect((await lireLesEspions(page)).annonces).toEqual([annonce]);
});

Then(/^Léa n'entend ni effet sonore ni parole pendant que Noisette marche$/, async ({ page }) => {
  await attendreLaFinDeLaMarche(page);
  await expect.poll(async () => (await lireLesEspions(page)).fin !== undefined).toBe(true);
  const { debut, fin, sons } = await lireLesEspions(page);
  expect(debut, "début de la marche vu").toBeDefined();
  expect(fin?.sons, `effets sonores pendant la marche : ${sons.slice(debut?.sons ?? 0, fin?.sons).join(", ")}`).toBe(debut?.sons);
  expect(fin?.paroles, "paroles pendant la marche").toBe(debut?.paroles);
});

// --- Alors : 360 px

Then(/^« ([^«»]+) », « ([^«»]+) » et « ([^«»]+) » restent visibles en entier$/, async ({ page }, repere: string, titre: string, etatDeLaLecon: string) => {
  const place = repere.replace(/^Leçon /, "");
  const lecon = leconDeLaPlace(page, place);
  await expect(lecon).toHaveCount(1);
  await expect(guide(page)).toHaveAttribute("data-marche", /^(aucune|terminee)$/, { timeout: DELAI_DE_LA_MARCHE_MS });
  const textes = [
    lecon.getByTestId("place-de-la-lecon").getByText(repere, { exact: true }),
    lecon.getByText(titre, { exact: true }),
    lecon.getByTestId("etat-de-la-lecon").getByText(etatDeLaLecon, { exact: true }),
  ];
  await lecon.scrollIntoViewIfNeeded();
  const boiteDuGuide = await guide(page).getByTestId("personnage-guide").boundingBox();
  for (const texte of textes) {
    await expect(texte).toBeInViewport({ ratio: 1 });
    const boite = await texte.boundingBox();
    expect(boite, "texte affiché").not.toBeNull();
    if (!boite || !boiteDuGuide) continue;
    const recouvre = boite.x < boiteDuGuide.x + boiteDuGuide.width && boiteDuGuide.x < boite.x + boite.width &&
      boite.y < boiteDuGuide.y + boiteDuGuide.height && boiteDuGuide.y < boite.y + boite.height;
    expect(recouvre, `le personnage guide cache « ${(await texte.textContent()) ?? ""} »`).toBe(false);
  }
});
