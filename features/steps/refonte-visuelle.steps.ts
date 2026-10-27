import { expect, type Locator, type Page } from "@playwright/test";
import { readFileSync } from "node:fs";
import { PALETTES } from "../../src/univers/palettes.ts";
import {
  arreterLeSuivi,
  attendreQueLElementSeStabilise,
  bilanDesMouvementsDe,
  contrastesInsuffisants,
  type ContrasteInsuffisant,
  type Echantillon,
  elementsAvecCesCouleurs,
  famillesDe,
  nombreDEchantillons,
  rgbDe,
  suivreUnElement,
} from "../support/mesures-visuelles.ts";
import type { Famille } from "../support/famille.ts";
import { Given, type Monde, Then, When } from "./fixtures.ts";
import { arriverSurLEpisode } from "./histoire.steps.ts";
import { arriverSurLaRevision } from "./revisions-des-erreurs.steps.ts";
import { arriverSurLeTestDeDepart } from "./test-de-depart.steps.ts";
import { jouerJusquALaFinDeLaSeance } from "./etoiles-et-fin-de-seance.steps.ts";
import {
  commencerLaSeanceComplete,
  commencerSeulementLExercice,
  etat as etatDeLaLecon,
  leconDeTitre,
  ouvrirLaPageDeLaLecon,
} from "./etapes-puis-exercices.steps.ts";
import { avancerJusquAuxChoix, bulleDeChoix, etatDesChoix, positionDeLExercice } from "./exercices-a-choix.steps.ts";
import { ouvrirLeParcoursDeFrancais } from "./parcours.steps.ts";
import { estSurUnProfilReel } from "./profil-reel.ts";
import { assurerLeProfil, connecterSiBesoin, ouvrirQuiJoue } from "./profils-enfants.steps.ts";
import { verifierModeDys } from "./reglages.steps.ts";
import { cleDe, leGuide } from "./univers.steps.ts";

// Story #96 : refonte visuelle. Les mesures sont faites sur les styles calculés, la position et les images successives
// du navigateur (features/support/mesures-visuelles.ts et enregistreurs-visuels.ts) : aucune valeur de la maquette n'est
// recopiée ici, sauf les couleurs principales de chaque univers, lues dans src/univers/palettes.ts.

const LECON_DES_SONS = "Les sons ou, on, an";
const EXERCICE_DES_SONS = "Quel son entends-tu ?";

// --- Les écrans de l'enfant

type Ecran =
  | { genre: "accueil" | "parcours" | "toutes" | "medailles" | "test" | "fin-test" | "revision" | "fin-revision" }
  | { genre: "lecon" | "seance" | "fin-seance" | "episode"; titre: string }
  | { genre: "exercice"; titre: string; exercice: string };

function lireLEcran(texte: string): Ecran {
  const dans = (modele: RegExp) => modele.exec(texte);
  if (texte === "son accueil") return { genre: "accueil" };
  if (texte === "« Mon parcours »") return { genre: "parcours" };
  if (texte === "« Toutes les leçons »") return { genre: "toutes" };
  if (texte === "« Mes médailles »") return { genre: "medailles" };
  if (texte === "le test de départ") return { genre: "test" };
  if (texte === "la fin du test de départ") return { genre: "fin-test" };
  if (texte === "la séance de révision") return { genre: "revision" };
  if (texte === "la fin de la séance de révision") return { genre: "fin-revision" };
  const lecon = dans(/^la page de la leçon « ([^«»]+) »$/);
  if (lecon?.[1]) return { genre: "lecon", titre: lecon[1] };
  const seance = dans(/^la séance de la leçon « ([^«»]+) »$/);
  if (seance?.[1]) return { genre: "seance", titre: seance[1] };
  const fin = dans(/^la fin de la séance de la leçon « ([^«»]+) »$/);
  if (fin?.[1]) return { genre: "fin-seance", titre: fin[1] };
  const episode = dans(/^l'épisode « ([^«»]+) »$/);
  if (episode?.[1]) return { genre: "episode", titre: episode[1] };
  const exercice = dans(/^l'exercice « ([^«»]+) » de la leçon « ([^«»]+) »$/);
  if (exercice?.[1] && exercice[2]) return { genre: "exercice", titre: exercice[2], exercice: exercice[1] };
  throw new Error(`Écran de l'enfant inconnu : « ${texte} »`);
}

function racineDe(page: Page, ecran: Ecran): Locator {
  switch (ecran.genre) {
    case "accueil":
      return page.getByRole("region", { name: /^Accueil de / });
    case "parcours":
      return page.getByRole("heading", { level: 2, name: "Mon parcours", exact: true });
    case "toutes":
      return page.getByRole("heading", { level: 2, name: "Toutes les leçons", exact: true });
    case "medailles":
      return page.getByRole("heading", { level: 1, name: "Mes médailles", exact: true });
    case "lecon":
      return page.getByRole("heading", { level: 2, name: ecran.titre, exact: true });
    case "seance":
    case "exercice":
      return page.getByTestId("recipient");
    case "fin-seance":
      return page.getByTestId("fin-de-seance");
    case "test":
      return page.getByTestId("proposition-du-test-de-depart");
    case "fin-test":
      return page.getByTestId("fin-du-test-de-depart");
    case "revision":
    case "fin-revision":
      return page.getByRole("heading", { level: 2, name: "Je révise mes erreurs", exact: true });
    case "episode":
      return page.getByTestId("ecran-de-l-episode");
  }
}

/** Dans l'application, sans recharger la page : le profil réel de Léa (identifiant, séances gardées) reste choisi. */
async function allerDansLApplication(page: Page, chemin: string): Promise<void> {
  if (!estSurUnProfilReel(page)) {
    await page.goto(chemin);
    return;
  }
  await page.evaluate((cible) => {
    history.pushState({ profondeur: 2, precedent: "/jeu" }, "", cible);
    dispatchEvent(new PopStateEvent("popstate"));
  }, chemin);
}

async function versUnEcranDuDock(page: Page, chemin: string, racine: Locator): Promise<void> {
  if (new URL(page.url()).pathname !== chemin) await allerDansLApplication(page, chemin);
  await expect(racine).toBeVisible();
}

async function arriverSur(famille: Famille, monde: Monde, page: Page, ecran: Ecran): Promise<void> {
  switch (ecran.genre) {
    case "accueil":
      await versUnEcranDuDock(page, "/jeu", racineDe(page, ecran));
      return;
    case "parcours":
      await versUnEcranDuDock(page, "/parcours", racineDe(page, ecran));
      await expect(page.getByText("Chargement du parcours")).toHaveCount(0);
      return;
    case "toutes":
      await versUnEcranDuDock(page, "/toutes-les-lecons", racineDe(page, ecran));
      return;
    case "medailles":
      await versUnEcranDuDock(page, "/medailles", racineDe(page, ecran));
      return;
    case "lecon":
      await ouvrirLaPageDeLaLecon(page, ecran.titre);
      return;
    case "seance":
      await ouvrirLaPageDeLaLecon(page, ecran.titre);
      await commencerLaSeanceComplete(page);
      return;
    case "exercice":
    case "fin-seance": {
      const exercice = ecran.genre === "exercice" ? ecran.exercice : EXERCICE_DES_SONS;
      await ouvrirLaPageDeLaLecon(page, ecran.titre);
      etatDesChoix(page).exerciceUnique = positionDeLExercice(leconDeTitre(page, ecran.titre), exercice);
      await commencerSeulementLExercice(page, exercice);
      if (ecran.genre === "exercice") await avancerJusquAuxChoix(page);
      else await jouerJusquALaFinDeLaSeance(famille, page);
      return;
    }
    case "test":
      await arriverSurLeTestDeDepart(page, false);
      return;
    case "fin-test":
      await arriverSurLeTestDeDepart(page, true);
      return;
    case "revision":
      await arriverSurLaRevision(famille, page, false);
      return;
    case "fin-revision":
      await arriverSurLaRevision(famille, page, true);
      return;
    case "episode":
      await arriverSurLEpisode(famille, monde, page, ecran.titre);
      return;
  }
}

const ECRANS_DE_L_ENFANT: readonly string[] = [
  "son accueil",
  "« Mon parcours »",
  "« Toutes les leçons »",
  "« Mes médailles »",
  `la page de la leçon « ${LECON_DES_SONS} »`,
  `la séance de la leçon « ${LECON_DES_SONS} »`,
  `la fin de la séance de la leçon « ${LECON_DES_SONS} »`,
  "le test de départ",
  "la fin du test de départ",
  "la séance de révision",
  "la fin de la séance de révision",
  "l'épisode « La carte froissée »",
];

When(/^Léa arrive sur (.+)$/, async ({ famille, monde, page }, texte: string) => {
  await arriverSur(famille, monde, page, lireLEcran(texte));
});

Given(/^Léa est sur (son accueil|« Mon parcours »)$/, async ({ famille, monde, page }, texte: string) => {
  await arriverSur(famille, monde, page, lireLEcran(texte));
});

Given(/^Léa a ouvert la leçon « ([^«»]+) » depuis son parcours$/, async ({ famille, page }, titre: string) => {
  await ouvrirLeParcoursDeFrancais(famille, page);
  etatDeLaLecon(page).courante = leconDeTitre(page, titre);
  await page.getByRole("button", { name: boutonDeLecon(titre) }).click();
  await expect(page.getByRole("heading", { level: 2, name: titre, exact: true })).toBeVisible();
});

When(/^Léa commence la séance de la leçon « ([^«»]+) »$/, async ({ page }, titre: string) => {
  etatDeLaLecon(page).courante = leconDeTitre(page, titre);
  await commencerLaSeanceComplete(page);
});

// --- Tour des écrans : contraste, polices demandées

const bilansDuTour = new WeakMap<Page, Array<{ ecran: string; insuffisants: ContrasteInsuffisant[] }>>();

When(/^Léa ouvre tour à tour chaque écran de l'enfant$/, async ({ famille, monde, page, $test }) => {
  $test.setTimeout(300_000);
  const bilans: Array<{ ecran: string; insuffisants: ContrasteInsuffisant[] }> = [];
  bilansDuTour.set(page, bilans);
  for (const texte of ECRANS_DE_L_ENFANT) {
    await arriverSur(famille, monde, page, lireLEcran(texte));
    let derniers: ContrasteInsuffisant[] = [];
    // Un écran qui arrive en fondu n'est lisible qu'une fois posé : on mesure jusqu'au repos.
    await expect.poll(async () => {
      derniers = await contrastesInsuffisants(page);
      return derniers.length;
    }, { timeout: 4_000 }).toBe(0).catch(() => undefined);
    bilans.push({ ecran: texte, insuffisants: derniers });
  }
});

Then(/^sur chacun, tout texte et chaque bouton ont un contraste d'au moins 4,5:1 avec leur fond$/, ({ page }) => {
  const bilans = bilansDuTour.get(page) ?? [];
  expect(bilans.length, "écrans parcourus").toBe(ECRANS_DE_L_ENFANT.length);
  const fautifs = bilans.filter((b) => b.insuffisants.length > 0).map((b) => `${b.ecran} : ${JSON.stringify(b.insuffisants.slice(0, 3))}`);
  expect(fautifs).toEqual([]);
});

Then(/^aucune police n'est demandée à un autre site que Savanturier$/, async ({ requetesVues, baseURL }) => {
  const origine = new URL(baseURL ?? "http://localhost:5173").origin;
  const etrangeres = requetesVues.polices.filter((p) => p.origine !== origine);
  expect(etrangeres, "polices demandées à un autre site").toEqual([]);
  expect(requetesVues.polices.length, "Baloo 2 et Andika sont servies par Savanturier").toBeGreaterThan(0);
});

// --- Couleur principale de l'univers

function couleursDe(libelleDeLUnivers: string): string[] {
  const palette = PALETTES[cleDe(libelleDeLUnivers) as keyof typeof PALETTES];
  return [rgbDe(palette.principale), rgbDe(palette.foncee)];
}

async function laCouleurSeVoit(page: Page, couleurs: string[], dans?: Locator): Promise<number> {
  return await elementsAvecCesCouleurs(page, couleurs, dans);
}

function boutonDeLecon(titre: string): RegExp {
  return new RegExp(`^${titre.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}(?:, [A-Z0-9]+)? : `);
}

function ledock(page: Page, nom: string): Locator {
  return page.getByRole("navigation").getByRole("button", { name: nom, exact: true });
}

Then(/^la couleur principale de l'univers « ([^«»]+) » se voit sur (.+)$/, async ({ page }, univers: string, element: string) => {
  const couleurs = couleursDe(univers);
  const surLEcran = async () => await laCouleurSeVoit(page, couleurs);
  if (element === "« Commencer » et le bouton « Accueil » du dock, marqué comme l'écran en cours") {
    const commencer = page.getByRole("button", { name: "Commencer", exact: true });
    await expect.poll(() => laCouleurSeVoit(page, couleurs, commencer), { message: "« Commencer »" }).toBeGreaterThan(0);
    const accueil = ledock(page, "Accueil");
    await expect(accueil).toHaveAttribute("aria-current", "page");
    await expect.poll(() => laCouleurSeVoit(page, couleurs, accueil), { message: "bouton « Accueil » du dock" }).toBeGreaterThan(0);
    return;
  }
  if (element === "la leçon marquée « À toi ! » et le bouton « Mon parcours » du dock") {
    const lecon = page.getByRole("button", { name: /À toi !/ }).first();
    await expect.poll(() => laCouleurSeVoit(page, couleurs, lecon), { message: "leçon marquée « À toi ! »" }).toBeGreaterThan(0);
    const parcours = ledock(page, "Mon parcours");
    await expect(parcours).toHaveAttribute("aria-current", "page");
    await expect.poll(() => laCouleurSeVoit(page, couleurs, parcours), { message: "bouton « Mon parcours » du dock" }).toBeGreaterThan(0);
    return;
  }
  lireLEcran(element);
  await expect.poll(surLEcran, { message: `couleur principale de « ${univers} » sur ${element}` }).toBeGreaterThan(0);
});

Then(/^elle se voit sur les titres de (?:son accueil|« Mon parcours »)$/, async ({ page, monde }) => {
  const univers = monde.profils.get("Léa")?.univers;
  if (univers === undefined) throw new Error("Aucun univers préparé pour Léa");
  const palette = PALETTES[univers as keyof typeof PALETTES];
  const couleurs = [rgbDe(palette.principale), rgbDe(palette.foncee)];
  const titres = page.getByRole("main").getByRole("heading");
  await expect(titres.first()).toBeVisible();
  await expect.poll(async () => {
    let total = 0;
    for (const titre of await titres.all()) total += await laCouleurSeVoit(page, couleurs, titre);
    return total;
  }, { message: "titres de l'écran dans la couleur principale" }).toBeGreaterThan(0);
});

Then(/^la couleur principale de l'univers « ([^«»]+) » ne s'y voit pas$/, async ({ page }, univers: string) => {
  expect(await laCouleurSeVoit(page, couleursDe(univers))).toBe(0);
});

Given(/^l'appareil est réglé en mode sombre$/, async ({ page }) => {
  await page.emulateMedia({ colorScheme: "dark" });
});

// --- Addition posée : couleurs des colonnes

Then(/^la colonne des unités est bleue, celle des dizaines rose et celle des centaines verte$/, async ({ page }) => {
  const COULEURS = { "unités": "bleue", "dizaines": "rose", "centaines": "verte" } as const;
  const FONDS = { bleue: "rgb(220, 236, 255)", rose: "rgb(255, 220, 238)", verte: "rgb(220, 245, 220)" } as const;
  for (const [rang, couleur] of Object.entries(COULEURS)) {
    const colonne = page.getByRole("group", { name: `Colonne des ${rang}`, exact: true });
    await expect(colonne, `colonne des ${rang}`).toHaveAttribute("data-couleur", couleur);
    await expect(colonne).toHaveCSS("background-color", FONDS[couleur]);
  }
});

// --- Polices

Then(/^les titres de (?:son accueil|l'espace parent) s'affichent en Baloo 2$/, async ({ page }) => {
  const familles = await famillesDe(page.getByRole("main").getByRole("heading"));
  expect(familles.length, "titres visibles").toBeGreaterThan(0);
  expect(familles.filter((f) => f.famille !== "Baloo 2"), "titres qui ne sont pas en Baloo 2").toEqual([]);
  expect((await page.evaluate(async () => (await document.fonts.load('700 1em "Baloo 2"', "a")).length)), "Baloo 2 chargée").toBeGreaterThan(0);
});

Then(/^le texte de (?:son accueil|l'espace parent) s'affiche en Andika$/, async ({ page }) => {
  const familles = await famillesDe(page.getByRole("main").locator("p"));
  expect(familles.length, "textes visibles").toBeGreaterThan(0);
  expect(familles.filter((f) => f.famille !== "Andika"), "textes qui ne sont pas en Andika").toEqual([]);
  expect((await page.evaluate(async () => (await document.fonts.load('1em "Andika"', "a")).length)), "Andika chargée").toBeGreaterThan(0);
});

Then(/^les titres, les boutons et le texte de son accueil s'affichent en Andika, lettres, mots et lignes espacés$/, async ({ page }) => {
  const principal = page.getByRole("main");
  await verifierModeDys(page, [principal.getByRole("heading"), principal.getByRole("button"), principal.locator("p")], true);
});

// --- Parent : ni paysage, ni personnage guide

Then(/^aucun paysage n'y apparaît$/, async ({ page }) => {
  await expect(page.getByTestId("paysage")).toHaveCount(0);
});

Then(/^aucun paysage ni aucun personnage guide n'y apparaît$/, async ({ page }) => {
  await expect(page.getByTestId("paysage")).toHaveCount(0);
  await expect(page.getByTestId("personnage-guide")).toHaveCount(0);
});

Then(/^Paul voit « Qui joue \? »$/, async ({ page }) => {
  await expect(page.getByTestId("qui-joue")).toBeVisible();
});

Then(/^Paul voit l'écran « Se connecter »$/, async ({ page }) => {
  await expect(page.getByRole("heading", { level: 2, name: "Se connecter", exact: true })).toBeVisible();
});

Then(/^Paul voit la question du contrôle parental$/, async ({ page }) => {
  await expect(page.getByText(/Question pour un adulte/)).toBeVisible();
});

Given(/^Paul est sur « Qui joue \? »$/, async ({ famille }) => {
  const page = await connecterSiBesoin(famille, "tablette", "Paul");
  await ouvrirQuiJoue(page);
});

When(/^Paul ouvre « Qui joue \? » sur la tablette$/, async ({ famille, monde }) => {
  const page = await connecterSiBesoin(famille, "tablette", "Paul");
  for (const [prenom, profil] of monde.profils) {
    const libelle = Object.keys(UNIVERS).find((nom) => UNIVERS[nom] === profil.univers);
    await assurerLeProfil(famille, "Paul", { prenom, niveau: profil.niveau, ...(libelle ? { libelleUnivers: libelle } : {}) });
  }
  await ouvrirQuiJoue(page);
});

const UNIVERS: Readonly<Record<string, string>> = {
  "Princesses et fées": "princesse",
  "Animaux de la forêt": "animaux",
  "Sports": "sports",
  "Police": "police",
  "Pompiers": "pompier",
  "Danse": "danse",
};

// --- Dessins validés des personnages guides

const SIGNES_DU_DESSIN_VALIDE: Readonly<Record<string, { presents: string[]; absents: string[] }>> = {
  "Coach Léo": { presents: ["cheveux-courts", "maillot-bleu"], absents: ["casquette"] },
  "Lili": { presents: ["queue-de-cheval-haute", "justaucorps-violet", "tutu-rose"], absents: [] },
  "Noisette": { presents: ["ecureuil-rond", "queue-en-panache"], absents: [] },
  "Lumi": { presents: ["ailes", "tiare", "robe-rose-aux-genoux"], absents: [] },
  "Agent Max": { presents: ["casquette-de-police", "etoile-doree", "chemise-bleue", "pantalon"], absents: [] },
};

async function verifierLeDessinValide(dessin: Locator, nom: string): Promise<void> {
  const attendus = SIGNES_DU_DESSIN_VALIDE[nom];
  if (!attendus) throw new Error(`Dessin validé inconnu : ${nom}`);
  await expect(dessin).toHaveAttribute("data-dessin", "valide");
  for (const signe of attendus.presents) {
    await expect(dessin.locator(`[data-signe="${signe}"]`), `signe « ${signe} » de ${nom}`).not.toHaveCount(0);
  }
  for (const signe of attendus.absents) {
    await expect(dessin.locator(`[data-signe="${signe}"]`), `signe « ${signe} » ne doit pas être dessiné chez ${nom}`).toHaveCount(0);
  }
}

Then(/^(Coach Léo|Lili|Noisette|Lumi|Agent Max) a le dessin validé : .+$/, async ({ page }, nom: string) => {
  await verifierLeDessinValide(leGuide(page, nom), nom);
});

/** Le dessin de Capitaine Sam d'avant la refonte : sa géométrie (formes, tracés, couleurs) est celle de la référence. */
const REFERENCE_DE_CAPITAINE_SAM: string[] = JSON.parse(
  readFileSync("features/support/dessin-de-capitaine-sam.json", "utf-8"),
);

export async function signatureDuDessin(dessin: Locator): Promise<string[]> {
  return await dessin.evaluate((racine) => {
    const ignores = new Set(["id", "class", "style"]);
    const normaliser = (valeur: string) => valeur.replace(/url\(#[^)]*\)/g, "url(#)").replace(/#[^\s"')]*(?=\)|$)/g, (m) => m);
    const lignes: string[] = [];
    for (const el of Array.from(racine.querySelectorAll("svg, svg *"))) {
      const attributs = Array.from(el.attributes)
        .filter((a) => !ignores.has(a.name) && !a.name.startsWith("data-") && !a.name.startsWith("aria-"))
        .map((a) => `${a.name}=${normaliser(a.value)}`)
        .sort();
      lignes.push(`${el.tagName.toLowerCase()} ${attributs.join(" ")}`);
    }
    return lignes;
  });
}

Then(/^Capitaine Sam a son dessin d'avant la refonte$/, async ({ page }) => {
  const dessin = leGuide(page, "Capitaine Sam");
  await expect(dessin).toBeAttached();
  expect(await signatureDuDessin(dessin)).toEqual(REFERENCE_DE_CAPITAINE_SAM);
});

Then(/^le profil enfant de (Léa|Tom) montre le dessin validé (?:d'|de )(Agent Max|Coach Léo)$/, async ({ page }, prenom: string, nom: string) => {
  const profil = page.getByTestId("profil-a-choisir").filter({ hasText: prenom }).first();
  await verifierLeDessinValide(profil.locator('[data-testid="personnage-guide"]'), nom);
});

Then(/^le nom « Agente Mila » n'apparaît nulle part$/, async ({ page }) => {
  await expect(page.getByText("Agente Mila")).toHaveCount(0);
  await expect(page.locator('[aria-label*="Mila"], [alt*="Mila"], [title*="Mila"]')).toHaveCount(0);
});

Then(/^les lecteurs d'écran n'annoncent ni le paysage ni le dessin de (Lumi)$/, async ({ page }, nom: string) => {
  await expect(page.getByTestId("paysage")).toBeAttached();
  for (const dessin of [page.getByTestId("paysage"), page.getByTestId("personnage-guide")]) {
    const cache = await dessin.evaluate((el) => {
      for (let courant: Element | null = el; courant; courant = courant.parentElement) {
        if (courant.getAttribute("aria-hidden") === "true") return true;
      }
      return false;
    });
    expect(cache, "paysage et dessin cachés des lecteurs d'écran").toBe(true);
  }
  await expect(page.getByRole("img", { name: nom })).toHaveCount(0);
});

Then(/^ils annoncent le titre de l'écran et les leçons du parcours$/, async ({ page }) => {
  await expect(page.getByRole("heading", { level: 2, name: "Mon parcours", exact: true })).toBeVisible();
  await expect(page.getByTestId("lecon-du-parcours").first()).toBeVisible();
  await expect(page.getByRole("button", { name: boutonDeLecon(LECON_DES_SONS) })).toBeVisible();
});

Then(/^la consigne et tous les choix de la question restent visibles en entier$/, async ({ page }) => {
  await avancerJusquAuxChoix(page);
  const largeur = page.viewportSize()?.width ?? 360;
  const hauteur = page.viewportSize()?.height ?? 740;
  const consigne = page.getByTestId("question").first();
  const guide = page.getByTestId("personnage-guide").first();
  const choix = await page.getByTestId("choix").all();
  expect(choix.length, "choix de la question").toBeGreaterThan(0);
  const boiteDuGuide = await guide.boundingBox();
  for (const element of [consigne, ...choix]) {
    await element.scrollIntoViewIfNeeded();
    const boite = await element.boundingBox();
    expect(boite, "élément affiché").not.toBeNull();
    if (!boite) continue;
    expect(boite.x).toBeGreaterThanOrEqual(0);
    expect(boite.x + boite.width).toBeLessThanOrEqual(largeur + 0.5);
    expect(boite.height).toBeGreaterThan(0);
    expect(boite.y + boite.height).toBeLessThanOrEqual(hauteur + 4_000);
    // Le dessin du personnage guide ne recouvre jamais la consigne ni un choix.
    if (boiteDuGuide) {
      const recouvre = boite.x < boiteDuGuide.x + boiteDuGuide.width && boiteDuGuide.x < boite.x + boite.width &&
        boite.y < boiteDuGuide.y + boiteDuGuide.height && boiteDuGuide.y < boite.y + boite.height;
      const alors = await page.evaluate(([x, y]) => {
        const dessus = document.elementFromPoint(x as number, y as number);
        return dessus?.closest('[data-testid="personnage-guide"]') !== null;
      }, [boite.x + boite.width / 2, boite.y + boite.height / 2] as const);
      expect(recouvre && alors, "le personnage guide cache un élément").toBe(false);
    }
  }
  await expect(consigne).toBeVisible();
});

Then(/^Léa peut encore répondre à « ([^«»]+) »$/, async ({ page }, question: string) => {
  await expect(page.getByTestId("question").filter({ hasText: question }).first()).toBeVisible();
  await avancerJusquAuxChoix(page);
  const bonne = bulleDeChoix(page, "7");
  await expect(bonne).toBeVisible();
  await expect(bonne).not.toHaveAttribute("aria-disabled", "true");
});

// --- Boutons qui s'enfoncent

type Geste = "toucher" | "clavier" | "glisser-dehors";
const gestes = new WeakMap<Page, Echantillon[]>();

function cibleDuBouton(page: Page, texte: string): Locator {
  if (texte === "« Commencer »") return page.getByRole("button", { name: "Commencer", exact: true });
  const dock = /^le bouton « ([^«»]+) » du dock$/.exec(texte);
  if (dock?.[1]) return ledock(page, dock[1]);
  const lecon = /^la leçon « ([^«»]+) »$/.exec(texte);
  if (lecon?.[1]) return page.getByRole("button", { name: boutonDeLecon(lecon[1]) });
  const choix = /^le choix « ([^«»]+) »$/.exec(texte);
  if (choix?.[1]) return bulleDeChoix(page, choix[1]);
  if (texte === "le profil enfant de Léa dans l'espace parent") {
    return page.getByTestId("profil-enfant").filter({ hasText: "Léa" }).getByRole("button").first();
  }
  if (texte === "le profil enfant de Léa dans « Qui joue ? »") return page.getByTestId("profil-a-choisir").filter({ hasText: "Léa" }).first();
  throw new Error(`Bouton inconnu : ${texte}`);
}

async function appuyer(page: Page, bouton: Locator, geste: Geste): Promise<void> {
  await expect(bouton).toBeVisible();
  const poignee = await bouton.elementHandle();
  if (!poignee) throw new Error("Bouton introuvable");
  await suivreUnElement(page, poignee);
  let compte = 0;
  const attendre = async () => {
    await attendreQueLElementSeStabilise(page, compte);
    compte = await nombreDEchantillons(page);
  };
  compte = await nombreDEchantillons(page);
  const boite = await bouton.boundingBox();
  if (!boite) throw new Error("Bouton sans boîte");
  if (geste === "clavier") {
    await bouton.focus();
    await page.keyboard.down("Space");
    await attendre();
    await page.keyboard.up("Space");
    await attendre();
  } else {
    await page.mouse.move(boite.x + boite.width / 2, boite.y + boite.height / 2);
    await page.mouse.down();
    await attendre();
    if (geste === "glisser-dehors") {
      await page.mouse.move(2, 2, { steps: 6 });
      await attendre();
    }
    await page.mouse.up();
    await attendre();
  }
  gestes.set(page, await arreterLeSuivi(page));
}

When(
  /^Léa touche (« Commencer »|le bouton « [^«»]+ » du dock|la leçon « [^«»]+ »)$/,
  async ({ page }, texte: string) => {
    await appuyer(page, cibleDuBouton(page, texte), "toucher");
  },
);

When(/^Paul touche (le profil enfant de Léa dans .+)$/, async ({ page }, texte: string) => {
  await appuyer(page, cibleDuBouton(page, texte), "toucher");
});

When(/^Léa valide « Commencer » au clavier$/, async ({ page }) => {
  await appuyer(page, cibleDuBouton(page, "« Commencer »"), "clavier");
});

When(/^Léa pose le doigt sur « Commencer » puis le fait glisser hors du bouton avant de le lever$/, async ({ page }) => {
  await appuyer(page, cibleDuBouton(page, "« Commencer »"), "glisser-dehors");
});

function echantillonsDe(page: Page): Echantillon[] {
  const liste = gestes.get(page);
  if (!liste || liste.length === 0) throw new Error("Aucun geste observé");
  return liste;
}

function transformNormalisee(t: string): string {
  return t === "none" ? "matrix(1, 0, 0, 1, 0, 0)" : t;
}

function ecartDe(repos: Echantillon, e: Echantillon): number {
  return Math.max(Math.abs(e.haut - repos.haut), Math.abs(e.gauche - repos.gauche));
}

function aBouge(repos: Echantillon, e: Echantillon): boolean {
  return e.present && (ecartDe(repos, e) >= 1 || transformNormalisee(e.transform) !== transformNormalisee(repos.transform));
}

function estRevenu(repos: Echantillon, e: Echantillon | undefined): boolean {
  if (!e) return false;
  // Une page qui a changé d'écran a emporté le bouton : il n'est plus enfoncé.
  if (!e.present) return true;
  return ecartDe(repos, e) < 0.5 && transformNormalisee(e.transform) === transformNormalisee(repos.transform);
}

Then(/^.+ s'enfonce puis revient à sa place$/, ({ page }) => {
  const [repos, ...suite] = echantillonsDe(page) as [Echantillon, ...Echantillon[]];
  expect(suite.some((e) => aBouge(repos, e)), "le bouton s'enfonce (position ou transformation)").toBe(true);
  expect(estRevenu(repos, suite[suite.length - 1]), "le bouton revient à sa place").toBe(true);
});

Then(/^« Commencer » revient à sa place$/, ({ page }) => {
  const [repos, ...suite] = echantillonsDe(page) as [Echantillon, ...Echantillon[]];
  expect(estRevenu(repos, suite[suite.length - 1]), "le bouton revient à sa place").toBe(true);
});

Then(/^« Commencer » change de couleur$/, ({ page }) => {
  const [repos, ...suite] = echantillonsDe(page) as [Echantillon, ...Echantillon[]];
  expect(suite.some((e) => e.present && e.fond !== repos.fond), "la couleur de fond change").toBe(true);
});

Then(/^« Commencer » ne bouge pas$/, ({ page }) => {
  const [repos, ...suite] = echantillonsDe(page) as [Echantillon, ...Echantillon[]];
  expect(suite.filter((e) => aBouge(repos, e)), "images où le bouton a bougé").toEqual([]);
});

Then(/^il ne rebondit pas$/, ({ page }) => {
  const [repos, ...suite] = echantillonsDe(page) as [Echantillon, ...Echantillon[]];
  const ecarts = suite.filter((e) => e.present).map((e) => e.haut - repos.haut);
  const pic = ecarts.reduce((meilleur, e, i) => (Math.abs(e) > Math.abs(ecarts[meilleur] ?? 0) ? i : meilleur), 0);
  const sens = Math.sign(ecarts[pic] ?? 0);
  const apres = ecarts.slice(pic);
  // Après le point le plus bas, le bouton remonte sans jamais dépasser sa place ni redescendre.
  for (let i = 1; i < apres.length; i++) {
    expect((apres[i] ?? 0) * sens, "le bouton dépasse sa place de départ").toBeGreaterThanOrEqual(-0.5);
    expect(Math.abs(apres[i] ?? 0), "le bouton rebondit").toBeLessThanOrEqual(Math.abs(apres[i - 1] ?? 0) + 0.5);
  }
});

Then(/^le choix « ([^«»]+) » est revenu à sa place$/, async ({ page }, choix: string) => {
  const bouton = bulleDeChoix(page, choix);
  await expect.poll(async () => {
    const t = await bouton.evaluate((el) => getComputedStyle(el).transform);
    return transformNormalisee(t);
  }, { message: "le choix touché revient à sa place" }).toBe("matrix(1, 0, 0, 1, 0, 0)");
});

// --- Transitions entre écrans

async function racineDeLEcran(page: Page, texte: string) {
  const racine = racineDe(page, lireLEcran(texte));
  await expect(racine.first()).toBeVisible();
  const poignee = await racine.first().elementHandle();
  if (!poignee) throw new Error(`Écran introuvable : ${texte}`);
  return poignee;
}

const UNE_IMAGE_DE_TOLERANCE_MS = 34;

Then(/^(.+) arrive (en glissant dans l'autre sens|en glissant|en fondu)$/, async ({ page }, texte: string, transition: string) => {
  const racine = await racineDeLEcran(page, texte);
  let bilan = await bilanDesMouvementsDe(page, racine);
  await expect.poll(async () => {
    bilan = await bilanDesMouvementsDe(page, racine);
    return bilan.termine && bilan.recents.length > 0;
  }, { message: `${texte} : un mouvement d'arrivée est enregistré` }).toBe(true);
  const glissements = bilan.recents.filter((e) => e.txMax >= 8);
  for (const e of bilan.recents) {
    expect((e.fin ?? Infinity) - e.debut, "durée du mouvement en ms").toBeLessThanOrEqual(300 + UNE_IMAGE_DE_TOLERANCE_MS);
  }
  if (transition === "en fondu") {
    expect(glissements, "un fondu ne glisse pas").toEqual([]);
    expect(bilan.recents.some((e) => e.opaciteMin < 0.95), "l'écran apparaît en fondu").toBe(true);
    return;
  }
  expect(glissements.length, "l'écran glisse sur le côté").toBeGreaterThan(0);
  const depart = glissements[0]?.txDepart ?? 0;
  if (transition === "en glissant") expect(depart, "l'écran arrive de la droite quand on avance").toBeGreaterThan(0);
  else expect(depart, "l'écran arrive de la gauche quand on revient").toBeLessThan(0);
});

Then(/^(la page de la leçon|« Mes médailles ») s'affiche sans aucun mouvement$/, async ({ page }, texte: string) => {
  const racine = texte === "« Mes médailles »"
    ? await racineDeLEcran(page, texte)
    : await (async () => {
      const poignee = await page.getByRole("heading", { level: 2, name: LECON_DES_SONS, exact: true }).elementHandle();
      if (!poignee) throw new Error("Page de la leçon introuvable");
      return poignee;
    })();
  const bilan = await bilanDesMouvementsDe(page, racine);
  expect(bilan.tous, "mouvements enregistrés avec les mouvements réduits").toEqual([]);
});

When(/^Léa touche deux fois de suite la leçon « ([^«»]+) » pendant la transition$/, async ({ page }, titre: string) => {
  etatDeLaLecon(page).courante = leconDeTitre(page, titre);
  await page.getByRole("button", { name: boutonDeLecon(titre) }).dblclick();
});

Then(/^revenir en arrière une seule fois la ramène sur « Mon parcours »$/, async ({ page }) => {
  await page.goBack();
  await expect(page.getByRole("heading", { level: 2, name: "Mon parcours", exact: true })).toBeVisible();
  await expect(page).toHaveURL(/\/parcours$/);
});

Then(
  /^(l'espace parent|« Qui joue \? »|la question du contrôle parental) s'affiche sans glisser ni rebondir$/,
  async ({ page }, texte: string) => {
    const racine = texte === "l'espace parent"
      ? page.getByRole("heading", { level: 2, name: "Espace parent", exact: true })
      : texte === "« Qui joue ? »"
      ? page.getByTestId("qui-joue")
      : page.getByText(/Question pour un adulte/);
    await expect(racine.first()).toBeVisible();
    const poignee = await racine.first().elementHandle();
    if (!poignee) throw new Error(`Écran du parent introuvable : ${texte}`);
    let bilan = await bilanDesMouvementsDe(page, poignee);
    await expect.poll(async () => {
      bilan = await bilanDesMouvementsDe(page, poignee);
      return bilan.termine;
    }).toBe(true);
    expect(bilan.tous, "l'écran du parent ne glisse ni ne rebondit").toEqual([]);
  },
);

// --- Captures de référence (@visuel) : les captures elles-mêmes seront prises quand l'interface sera finie

Then(/^(.+) ressemble à sa capture de référence « ([^«»]+) »$/, async ({ page }, texte: string, capture: string) => {
  await expect(racineDe(page, lireLEcran(texte)).first()).toBeVisible();
  await expect(page).toHaveScreenshot(`${capture}.png`, { fullPage: true, animations: "disabled", maxDiffPixelRatio: 0.01 });
});
