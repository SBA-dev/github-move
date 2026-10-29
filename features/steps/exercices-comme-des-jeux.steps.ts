import { type CDPSession, expect, type Locator, type Page, type Route } from "@playwright/test";
import { ecrireLaFileDeRevision } from "../support/revision-api.ts";
import { Before, Given, type ProfilPrepare, Then, When } from "./fixtures.ts";
import {
  bulle,
  etat as etatDeLaLecon,
  interceptertLaBibliotheque,
  type LeconBrute,
  leconDeTitre,
} from "./etapes-puis-exercices.steps.ts";
import { demarrer, positionDeLExercice } from "./exercices-a-choix.steps.ts";
import {
  atteindreAuClavier,
  direJeNeSaisPasSurDesEtiquettes,
  etiquettesVisees,
  exerciceEnCours,
  poserDansLaMaison,
  poserEtAttendre,
} from "./classer-ordre-trous.steps.ts";
import { verifierModeDys } from "./reglages.steps.ts";
import { installerLesFauxDeLaStory97 } from "./retours-animes-et-sonores.steps.ts";
import { jouerAvecLeProfilReel, rechargerAvecLeProfilReel } from "./profil-reel.ts";
import { choisirSonProfil, modifierLeProfil, profilDe } from "./profils-enfants.steps.ts";
import { accepterLaProposition, ouvrirLaProposition } from "./test-de-depart.steps.ts";
import { cleDe, leGuide, listeDe, preparerProfil } from "./univers.steps.ts";
import { normaliser, preparerLaPage, scenario, terminerLaLecture } from "./voix.steps.ts";
import { avancerJusquAuxChoix, textesDesChoix } from "./exercices-a-choix.steps.ts";
import { suivreLesLecturesDuResultat } from "../support/bibliotheque-du-test-de-depart.ts";

// Story #98, tranche 98a : des exercices qui ressemblent à des jeux (classer : glisser les étiquettes dans les maisons).
//
// Le contrat entre ces étapes et l'application est écrit dans le rapport de la phase rouge ; en bref, tout se lit par des
// attributs et des data-testid, jamais par un tracé ni par des coordonnées de dessin :
//   - data-testid="maison" (zone de toucher) : data-univers, data-ouverte, data-allumee, data-survolee, data-brille ;
//   - data-testid="porte" et data-testid="signal-brille" (dans la maison), data-testid="dessin-de-la-maison" (aria-hidden) ;
//   - data-testid="etiquette" : data-etat = "a-poser" | "suit-le-doigt" | "revient".
// Le glisser au doigt est un vrai geste tactile (CDP Input.dispatchTouchEvent : pointerdown/move/up de type touch), pas dragTo.

const SONS = "reponse-fausse";

// --- Ce que le navigateur voit passer (états des étiquettes et des maisons, effets sonores), noté dès le départ

type Passage =
  | { t: number; genre: "etiquette"; texte: string; etat: string }
  | { t: number; genre: "maison"; groupe: string; ouverte: string; allumee: string; survolee: string; brille: string }
  | { t: number; genre: "son"; nom: string };

type Journal98 = { passages: Passage[]; marque: number };

export function installerLEnregistreurDeLaStory98() {
  type Entree = { nom: string };
  type Effets = { entrees: Entree[] };
  const journal: Journal98Local = { passages: [], marque: 0 };
  type Journal98Local = { passages: Array<Record<string, string | number>>; marque: number };
  Reflect.set(window, "__jeu98", journal);
  const texteDe = (element: Element) => (element.textContent ?? "").replace(/\s+/g, " ").trim();
  const attribut = (element: Element, nom: string) => element.getAttribute(nom) ?? "";
  const noter = (element: Element) => {
    const identifiant = element.getAttribute("data-testid");
    if (identifiant === "etiquette") {
      journal.passages.push({ t: performance.now(), genre: "etiquette", texte: texteDe(element), etat: attribut(element, "data-etat") });
    }
    if (identifiant === "maison") {
      journal.passages.push({
        t: performance.now(),
        genre: "maison",
        groupe: attribut(element, "data-groupe"),
        ouverte: attribut(element, "data-ouverte"),
        allumee: attribut(element, "data-allumee"),
        survolee: attribut(element, "data-survolee"),
        brille: attribut(element, "data-brille"),
      });
    }
  };
  const SELECTEUR = '[data-testid="etiquette"],[data-testid="maison"]';
  new MutationObserver((enregistrements) => {
    for (const enregistrement of enregistrements) {
      if (enregistrement.type === "attributes" && enregistrement.target instanceof Element) noter(enregistrement.target);
      for (const ajoute of enregistrement.addedNodes) {
        if (!(ajoute instanceof Element)) continue;
        noter(ajoute);
        ajoute.querySelectorAll(SELECTEUR).forEach(noter);
      }
    }
  }).observe(document, {
    subtree: true,
    childList: true,
    attributes: true,
    attributeFilter: ["data-etat", "data-ouverte", "data-allumee", "data-survolee", "data-brille"],
  });
  // Les effets sonores sont journalisés par le faux de #97 (window.__effets) : on note l'instant où chacun apparaît.
  let vus = 0;
  const regarder = () => {
    const effets = Reflect.get(window, "__effets") as Effets | undefined;
    if (effets && effets.entrees.length > vus) {
      for (let rang = vus; rang < effets.entrees.length; rang++) {
        journal.passages.push({ t: performance.now(), genre: "son", nom: effets.entrees[rang]?.nom ?? "" });
      }
      vus = effets.entrees.length;
    }
    requestAnimationFrame(regarder);
  };
  requestAnimationFrame(regarder);
}

Before({ tags: "@issue-98" }, async ({ page, $testInfo }) => {
  // Le vrai profil de Léa, les séances jouées jusqu'à leur fin et les gestes tactiles passent par le serveur.
  $testInfo.setTimeout(120_000);
  await page.addInitScript(installerLesFauxDeLaStory97, { echec: false, retenir: [] });
  await page.addInitScript(installerLEnregistreurDeLaStory98);
});

async function journal98(page: Page): Promise<{ passages: Passage[]; depuisLeGeste: Passage[] }> {
  const lu = await page.evaluate(() => {
    const brut = Reflect.get(window, "__jeu98") as Journal98 | undefined;
    return brut === undefined ? { passages: [], marque: 0 } : { passages: [...brut.passages], marque: brut.marque };
  });
  return { passages: lu.passages, depuisLeGeste: lu.passages.slice(lu.marque) };
}

/** Début d'un geste de l'enfant : ce que les étapes « Alors » regardent commence ici (les effets sonores de #97 aussi). */
async function marquerLeGeste(page: Page): Promise<void> {
  await page.evaluate(() => {
    const brut = Reflect.get(window, "__jeu98") as Journal98 | undefined;
    if (brut) brut.marque = brut.passages.length;
    const effets = Reflect.get(window, "__effets") as { entrees: unknown[]; marque: number; marqueParoles: number } | undefined;
    const faux = Reflect.get(window, "__faux") as { journal: unknown[] } | undefined;
    if (effets) {
      effets.marque = effets.entrees.length;
      effets.marqueParoles = faux?.journal.length ?? 0;
    }
  });
}

// --- Les écrans

const plateau = (page: Page) => page.getByTestId("etiquettes-a-placer");
const etiquetteAPlacer = (page: Page, texte: string) => plateau(page).getByRole("button", { name: texte, exact: true });
const maison = (page: Page, nom: string) => page.getByRole("group", { name: `Maison « ${nom} »`, exact: true });
const porteDeLaMaison = (page: Page, nom: string) => page.getByRole("button", { name: `Poser dans la maison « ${nom} »`, exact: true });
const maisons = (page: Page) => page.getByTestId("maison");

function echapper(texte: string): string {
  return texte.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function etiquettePosee(page: Page, nomDeLaMaison: string, texte: string): Locator {
  return maison(page, nomDeLaMaison).getByTestId("etiquette-posee").filter({ hasText: new RegExp(`^\\s*${echapper(texte)}\\s*$`) });
}

async function nomsDesMaisons(page: Page): Promise<string[]> {
  const etiquettes = await maisons(page).evaluateAll((elements) => elements.map((element) => element.getAttribute("aria-label") ?? ""));
  return etiquettes.map((libelle) => /^Maison « (.+) »$/.exec(libelle)?.[1] ?? libelle);
}

// --- Le glisser au doigt : de vrais événements tactiles (CDP), jamais dragTo

type Doigt = { session: CDPSession; x: number; y: number };
const doigts = new WeakMap<Page, Doigt>();
const PAS_DU_GESTE = 6;

type Point = { x: number; y: number };

async function centreDe(page: Page, cible: Locator, description: string): Promise<Point> {
  await expect(cible.first(), description).toBeVisible();
  const boite = await cible.first().boundingBox();
  if (boite === null) throw new Error(`${description} : introuvable à l'écran`);
  const point = { x: boite.x + boite.width / 2, y: boite.y + boite.height / 2 };
  const ecran = page.viewportSize();
  if (ecran && (point.x < 0 || point.y < 0 || point.x > ecran.width || point.y > ecran.height)) {
    throw new Error(`${description} est hors de l'écran (${Math.round(point.x)}, ${Math.round(point.y)}) : les étiquettes et les maisons doivent tenir ensemble dans l'écran (décision 98.24)`);
  }
  return point;
}

/**
 * Avant un geste, la page est placée pour que le départ et l'arrivée soient à l'écran en même temps : c'est ce que promet la
 * décision 98.24 (les étiquettes et les maisons tiennent ensemble). Si les deux ne peuvent pas tenir à l'écran, c'est un défaut
 * de l'application et le geste échoue avec ce message, il ne défile pas pendant le glisser.
 */
async function montrerLeDepartEtLArrivee(page: Page, depart: Locator, arrivee: Locator, description: string): Promise<void> {
  await expect(depart.first()).toBeVisible();
  await expect(arrivee.first()).toBeVisible();
  const boiteDuDepart = await depart.first().boundingBox();
  const boiteDeLArrivee = await arrivee.first().boundingBox();
  const ecran = page.viewportSize();
  if (!boiteDuDepart || !boiteDeLArrivee || !ecran) throw new Error(`${description} : introuvable à l'écran`);
  const haut = Math.min(boiteDuDepart.y, boiteDeLArrivee.y);
  const bas = Math.max(boiteDuDepart.y + boiteDuDepart.height, boiteDeLArrivee.y + boiteDeLArrivee.height);
  if (bas - haut > ecran.height - 16) {
    throw new Error(`${description} : le départ et l'arrivée ne tiennent pas ensemble dans l'écran (${Math.round(bas - haut)} px pour ${ecran.height} px, décision 98.24)`);
  }
  if (haut < 8 || bas > ecran.height - 8) await page.evaluate((deplacement) => window.scrollBy(0, deplacement), haut - 8);
}

const imageSuivante = (page: Page) => page.evaluate(() => new Promise<void>((fait) => requestAnimationFrame(() => fait())));

async function poserLeDoigt(page: Page, depart: Point): Promise<void> {
  await marquerLeGeste(page);
  const session = await page.context().newCDPSession(page);
  doigts.set(page, { session, ...depart });
  await session.send("Input.dispatchTouchEvent", { type: "touchStart", touchPoints: [depart] });
  await imageSuivante(page);
}

async function deplacerLeDoigt(page: Page, arrivee: Point): Promise<void> {
  const doigt = doigts.get(page);
  if (!doigt) throw new Error("Aucun doigt posé sur l'écran");
  for (let pas = 1; pas <= PAS_DU_GESTE; pas++) {
    const point = {
      x: doigt.x + ((arrivee.x - doigt.x) * pas) / PAS_DU_GESTE,
      y: doigt.y + ((arrivee.y - doigt.y) * pas) / PAS_DU_GESTE,
    };
    await doigt.session.send("Input.dispatchTouchEvent", { type: "touchMove", touchPoints: [point] });
    await imageSuivante(page);
  }
  doigt.x = arrivee.x;
  doigt.y = arrivee.y;
}

async function leverLeDoigt(page: Page): Promise<void> {
  const doigt = doigts.get(page);
  if (!doigt) throw new Error("Aucun doigt posé sur l'écran");
  await doigt.session.send("Input.dispatchTouchEvent", { type: "touchEnd", touchPoints: [] });
  doigts.delete(page);
  await doigt.session.detach();
  await imageSuivante(page);
}

/** Un point de l'écran hors de toute maison, le plus près possible de `depuis` (mais à plus de 40 px). */
async function pointHorsDeToutesLesMaisons(page: Page, depuis: Point): Promise<Point> {
  const point = await page.evaluate((origine) => {
    const boites = [...document.querySelectorAll('[data-testid="maison"]')].map((element) => element.getBoundingClientRect());
    let meilleur: { x: number; y: number; distance: number } | undefined;
    for (let y = 8; y < window.innerHeight; y += 12) {
      for (let x = 8; x < window.innerWidth; x += 12) {
        const dedans = boites.some((boite) => x >= boite.left - 4 && x <= boite.right + 4 && y >= boite.top - 4 && y <= boite.bottom + 4);
        const distance = Math.hypot(x - origine.x, y - origine.y);
        if (!dedans && distance > 40 && (!meilleur || distance < meilleur.distance)) meilleur = { x, y, distance };
      }
    }
    return meilleur ? { x: meilleur.x, y: meilleur.y } : null;
  }, depuis);
  if (point === null) throw new Error("Aucun point de l'écran hors de toute maison");
  return point;
}

async function glisserDansLaMaison(page: Page, etiquette: string, nomDeLaMaison: string): Promise<void> {
  await montrerLeDepartEtLArrivee(page, etiquetteAPlacer(page, etiquette), maison(page, nomDeLaMaison), `« ${etiquette} » et la maison « ${nomDeLaMaison} »`);
  const depart = await centreDe(page, etiquetteAPlacer(page, etiquette), `l'étiquette « ${etiquette} »`);
  const arrivee = await centreDe(page, maison(page, nomDeLaMaison), `la maison « ${nomDeLaMaison} »`);
  await poserLeDoigt(page, depart);
  await deplacerLeDoigt(page, arrivee);
  await leverLeDoigt(page);
}

async function glisserHorsDeToutesLesMaisons(page: Page, etiquette: string): Promise<void> {
  const depart = await centreDe(page, etiquetteAPlacer(page, etiquette), `l'étiquette « ${etiquette} »`);
  const arrivee = await pointHorsDeToutesLesMaisons(page, depart);
  await poserLeDoigt(page, depart);
  await deplacerLeDoigt(page, arrivee);
  await leverLeDoigt(page);
}

// --- Attendre ce qu'un geste produit

async function nombreAPoser(page: Page): Promise<number> {
  return await page.getByTestId("etiquette").count();
}

function etatsDeLEtiquette(passages: readonly Passage[], texte: string): string[] {
  return passages.flatMap((passage) => passage.genre === "etiquette" && passage.texte === texte ? [passage.etat] : []);
}

/** L'étiquette est revenue (ou n'a jamais bougé) : elle est parmi les étiquettes à poser, à l'état « a-poser ». */
async function attendreQueLEtiquetteSoitALaPlace(page: Page, texte: string): Promise<void> {
  await expect(etiquetteAPlacer(page, texte)).toHaveCount(1);
  await expect(etiquetteAPlacer(page, texte)).toHaveAttribute("data-etat", "a-poser");
}

async function glisserEtAttendre(page: Page, etiquette: string, nomDeLaMaison: string, issue: "bien" | "mal"): Promise<void> {
  await demarrer(page);
  const avant = await nombreAPoser(page);
  await glisserDansLaMaison(page, etiquette, nomDeLaMaison);
  if (issue === "bien") await expect.poll(() => nombreAPoser(page)).toBe(avant - 1);
  else await attendreQueLEtiquetteSoitALaPlace(page, etiquette);
}

// --- Étant donné et Quand : le glisser au doigt

When(
  /^Léa pose chaque étiquette dans sa maison (en la faisant glisser du doigt|en la touchant, puis en touchant la maison|au clavier seulement)$/,
  async ({ page }, geste: string) => {
    await demarrer(page);
    const exercice = (await exerciceEnCours(page)) as {
      groupes: Array<{ id: string; nom: string }>;
      items: Array<{ texte: string; groupe: string }>;
    };
    for (const item of exercice.items) {
      const nom = exercice.groupes.find((groupe) => groupe.id === item.groupe)?.nom ?? "";
      const avant = await nombreAPoser(page);
      if (geste === "en la faisant glisser du doigt") await glisserDansLaMaison(page, item.texte, nom);
      else await poserDansLaMaison(page, item.texte, nom, geste === "au clavier seulement" ? "clavier" : "toucher");
      await expect.poll(() => nombreAPoser(page)).toBe(avant - 1);
    }
  },
);

Given(
  /^Léa a fait glisser du doigt (\d+) fois l'étiquette « ([^«»]+) » dans la maison « ([^«»]+) »$/,
  async ({ page }, fois: string, etiquette: string, nomDeLaMaison: string) => {
    for (let i = 0; i < Number(fois); i++) await glisserEtAttendre(page, etiquette, nomDeLaMaison, "mal");
  },
);

Given(
  /^Léa a ensuite fait glisser du doigt l'étiquette « ([^«»]+) » dans la maison « ([^«»]+) », puis dans la maison « ([^«»]+) »$/,
  async ({ page }, etiquette: string, mauvaise: string, bonne: string) => {
    await glisserEtAttendre(page, etiquette, mauvaise, "mal");
    await glisserEtAttendre(page, etiquette, bonne, "bien");
  },
);

Given(/^Léa a lâché (\d+) fois l'étiquette « ([^«»]+) » hors de toute maison$/, async ({ page }, fois: string, etiquette: string) => {
  await demarrer(page);
  const avant = await nombreAPoser(page);
  for (let i = 0; i < Number(fois); i++) {
    await glisserHorsDeToutesLesMaisons(page, etiquette);
    await attendreQueLEtiquetteSoitALaPlace(page, etiquette);
  }
  expect(await nombreAPoser(page)).toBe(avant);
});

Given(/^Léa a rangé l'étiquette « ([^«»]+) » dans la maison « ([^«»]+) »$/, async ({ page }, etiquette: string, nomDeLaMaison: string) => {
  await poserEtAttendre(page, etiquette, nomDeLaMaison, "bien");
});

When(
  /^Léa fait glisser du doigt l'étiquette « ([^«»]+) » dans la maison « ([^«»]+) »$/,
  async ({ page }, etiquette: string, nomDeLaMaison: string) => {
    await demarrer(page);
    await glisserDansLaMaison(page, etiquette, nomDeLaMaison);
  },
);

When(/^Léa fait glisser du doigt l'étiquette « ([^«»]+) » et la lâche hors de toute maison$/, async ({ page }, etiquette: string) => {
  await demarrer(page);
  await glisserHorsDeToutesLesMaisons(page, etiquette);
});

When(
  /^Léa fait passer du doigt l'étiquette « ([^«»]+) » au-dessus de la maison « ([^«»]+) », sans la lâcher$/,
  async ({ page }, etiquette: string, nomDeLaMaison: string) => {
    await demarrer(page);
    const depart = await centreDe(page, etiquetteAPlacer(page, etiquette), `l'étiquette « ${etiquette} »`);
    const arrivee = await centreDe(page, maison(page, nomDeLaMaison), `la maison « ${nomDeLaMaison} »`);
    await poserLeDoigt(page, depart);
    await deplacerLeDoigt(page, arrivee);
  },
);

When(
  /^Léa essaie de faire glisser du doigt l'étiquette « ([^«»]+) » hors de la maison « ([^«»]+) »$/,
  async ({ page }, etiquette: string, nomDeLaMaison: string) => {
    const depart = await centreDe(page, etiquettePosee(page, nomDeLaMaison, etiquette), `l'étiquette rangée « ${etiquette} »`);
    const arrivee = await pointHorsDeToutesLesMaisons(page, depart);
    await poserLeDoigt(page, depart);
    await deplacerLeDoigt(page, arrivee);
    await leverLeDoigt(page);
  },
);

When(
  /^Léa essaie de faire glisser du doigt l'étiquette « ([^«»]+) » vers les places à remplir$/,
  async ({ page }, etiquette: string) => {
    await demarrer(page);
    const depart = await centreDe(page, etiquetteAPlacer(page, etiquette).first(), `l'étiquette « ${etiquette} »`);
    const arrivee = await centreDe(page, page.getByTestId("place").first(), "la première place");
    await poserLeDoigt(page, depart);
    await deplacerLeDoigt(page, arrivee);
    await leverLeDoigt(page);
  },
);

When(
  /^Léa pose l'étiquette « ([^«»]+) » dans la maison « ([^«»]+) » au clavier, en passant d'une maison à l'autre avec les flèches$/,
  async ({ page }, etiquette: string, nomDeLaMaison: string) => {
    await demarrer(page);
    const noms = await nomsDesMaisons(page);
    const rang = noms.indexOf(nomDeLaMaison);
    expect(rang, `la maison « ${nomDeLaMaison} » existe`).toBeGreaterThanOrEqual(0);
    await atteindreAuClavier(page, { testid: "etiquette", texte: etiquette });
    await page.keyboard.press("Enter");
    await atteindreAuClavier(page, { label: `Poser dans la maison « ${noms[0]} »` });
    // On va de maison en maison jusqu'à la dernière, puis on revient à la maison voulue : les flèches changent la maison au focus.
    for (let i = 1; i < noms.length; i++) {
      await page.keyboard.press("ArrowRight");
      await expect(porteDeLaMaison(page, noms[i] ?? "")).toBeFocused();
    }
    for (let i = noms.length - 2; i >= rang; i--) {
      await page.keyboard.press("ArrowLeft");
      await expect(porteDeLaMaison(page, noms[i] ?? "")).toBeFocused();
    }
    if (rang === noms.length - 1) await expect(porteDeLaMaison(page, nomDeLaMaison)).toBeFocused();
    await page.keyboard.press("Enter");
  },
);

// --- Alors : la fin du geste, les étiquettes

Then(/^l'étiquette « ([^«»]+) » suit le doigt de Léa$/, async ({ page }, etiquette: string) => {
  const suivie = page.getByTestId("etiquette").filter({ hasText: new RegExp(`^\\s*${echapper(etiquette)}\\s*$`) });
  await expect(suivie).toHaveAttribute("data-etat", "suit-le-doigt");
  const doigt = doigts.get(page);
  if (!doigt) throw new Error("Aucun doigt posé sur l'écran");
  const boite = await suivie.boundingBox();
  expect(boite, "l'étiquette est à l'écran").not.toBeNull();
  const marge = 12;
  expect(doigt.x, "le doigt est sur l'étiquette (horizontalement)").toBeGreaterThanOrEqual((boite?.x ?? 0) - marge);
  expect(doigt.x).toBeLessThanOrEqual((boite?.x ?? 0) + (boite?.width ?? 0) + marge);
  expect(doigt.y, "le doigt est sur l'étiquette (verticalement)").toBeGreaterThanOrEqual((boite?.y ?? 0) - marge);
  expect(doigt.y).toBeLessThanOrEqual((boite?.y ?? 0) + (boite?.height ?? 0) + marge);
});

Then(/^la maison « ([^«»]+) » se signale comme toute maison survolée, sans dire si c'est la bonne$/, async ({ page }, nom: string) => {
  const survolee = maison(page, nom);
  await expect(survolee).toHaveAttribute("data-survolee", "true");
  await expect(survolee).not.toHaveAttribute("data-brille", "true");
  await expect(survolee).toHaveAttribute("data-ouverte", "false");
  await expect(survolee).toHaveAttribute("data-allumee", "false");
  await expect(page.locator('[data-testid="maison"][data-survolee="true"]')).toHaveCount(1);
});

Then(/^l'étiquette « ([^«»]+) » revient en glissant jusqu'à sa place parmi les étiquettes à poser$/, async ({ page }, etiquette: string) => {
  await attendreQueLEtiquetteSoitALaPlace(page, etiquette);
  const { depuisLeGeste } = await journal98(page);
  const etats = etatsDeLEtiquette(depuisLeGeste, etiquette);
  expect(etats, `états vus de « ${etiquette} »`).toContain("suit-le-doigt");
  expect(etats, `états vus de « ${etiquette} »`).toContain("revient");
  expect(etats.lastIndexOf("a-poser"), "l'étiquette est à sa place après son retour").toBeGreaterThan(etats.indexOf("revient"));
});

Then(/^l'étiquette « ([^«»]+) » réapparaît à sa place, sans glisser$/, async ({ page }, etiquette: string) => {
  await attendreQueLEtiquetteSoitALaPlace(page, etiquette);
  const { depuisLeGeste } = await journal98(page);
  expect(etatsDeLEtiquette(depuisLeGeste, etiquette), `états vus de « ${etiquette} »`).not.toContain("revient");
  const revenue = etiquetteAPlacer(page, etiquette);
  await expect(revenue).toHaveCSS("animation-name", "none");
  await expect(revenue).toHaveCSS("transition-duration", "0s");
});

Then(/^l'étiquette « ([^«»]+) » reste parmi les étiquettes à poser$/, async ({ page }, etiquette: string) => {
  await expect(etiquetteAPlacer(page, etiquette)).toHaveCount(1);
  // Elle ne s'est ni soulevée ni mise en mouvement : un ordre ne se glisse pas (décisions 98.8 et 98.22).
  await expect(etiquetteAPlacer(page, etiquette)).not.toHaveAttribute("data-etat", "suit-le-doigt");
  await expect(etiquetteAPlacer(page, etiquette)).not.toHaveAttribute("data-etat", "revient");
});

Then(/^aucune place n'est remplie$/, async ({ page }) => {
  await expect(page.getByTestId("place").first()).toBeVisible();
  await expect(page.locator('[data-testid="place"][data-remplie="true"]')).toHaveCount(0);
});

Then(
  /^l'effet sonore « réponse fausse » commence avant que l'étiquette « ([^«»]+) » soit revenue à sa place$/,
  async ({ page }, etiquette: string) => {
    await attendreQueLEtiquetteSoitALaPlace(page, etiquette);
    const { depuisLeGeste } = await journal98(page);
    const son = depuisLeGeste.find((passage) => passage.genre === "son" && passage.nom === SONS);
    expect(son, "l'effet sonore « réponse fausse » a été entendu").toBeDefined();
    const retour = depuisLeGeste.findIndex((passage) => passage.genre === "etiquette" && passage.texte === etiquette && passage.etat === "revient");
    expect(retour, `« ${etiquette} » est revenue en glissant`).toBeGreaterThanOrEqual(0);
    const arrivee = depuisLeGeste.slice(retour).find((passage) => passage.genre === "etiquette" && passage.texte === etiquette && passage.etat === "a-poser");
    expect(arrivee, `« ${etiquette} » est de nouveau à sa place`).toBeDefined();
    expect(son?.t ?? Infinity, "le son commence avant l'arrivée de l'étiquette").toBeLessThan(arrivee?.t ?? 0);
  },
);

// --- Alors : les maisons (porte, lumière, dessin de l'univers)

async function verifierLEtatDesMaisons(page: Page, noms: string[], attendu: { ouverte: boolean; allumee: boolean }) {
  for (const nom of noms) {
    await expect(maison(page, nom)).toHaveAttribute("data-ouverte", String(attendu.ouverte));
    await expect(maison(page, nom)).toHaveAttribute("data-allumee", String(attendu.allumee));
  }
}

Then(/^les maisons (.+) ont la porte fermée et sont éteintes$/, async ({ page }, liste: string) => {
  await verifierLEtatDesMaisons(page, listeDe(liste), { ouverte: false, allumee: false });
});

Then(/^la porte de la maison « ([^«»]+) » s'ouvre, puis la maison s'allume$/, async ({ page }, nom: string) => {
  await expect(maison(page, nom)).toHaveAttribute("data-ouverte", "true");
  await expect(maison(page, nom)).toHaveAttribute("data-allumee", "true");
  const groupe = (await maison(page, nom).getAttribute("data-groupe")) ?? "";
  const { depuisLeGeste } = await journal98(page);
  for (const passage of depuisLeGeste) {
    if (passage.genre === "maison" && passage.groupe === groupe && passage.allumee === "true") {
      expect(passage.ouverte, "la maison ne s'allume jamais porte fermée").toBe("true");
    }
  }
});

Then(/^la maison « ([^«»]+) » ne brille pas comme une bonne réponse montrée$/, async ({ page }, nom: string) => {
  await expect(maison(page, nom)).not.toHaveAttribute("data-brille", "true");
  await expect(maison(page, nom).getByTestId("signal-brille")).toHaveCount(0);
});

Then(/^la porte de la maison « ([^«»]+) » reste fermée$/, async ({ page }, nom: string) => {
  await expect(maison(page, nom)).toHaveAttribute("data-ouverte", "false");
  await expect(maison(page, nom)).toHaveAttribute("data-allumee", "false");
  const groupe = (await maison(page, nom).getAttribute("data-groupe")) ?? "";
  const { passages } = await journal98(page);
  expect(passages.filter((passage) => passage.genre === "maison" && passage.groupe === groupe && passage.ouverte === "true")).toEqual([]);
});

Then(/^la maison « ([^«»]+) » s'allume, sans que sa porte bouge$/, async ({ page }, nom: string) => {
  await expect(maison(page, nom)).toHaveAttribute("data-allumee", "true");
  const porte = maison(page, nom).getByTestId("porte");
  await expect(porte).toHaveCount(1);
  await expect(porte).toHaveCSS("animation-name", "none");
  await expect(porte).toHaveCSS("transition-duration", "0s");
});

Then(/^les maisons (.+) ont le dessin de l'univers « ([^«»]+) »$/, async ({ page }, liste: string, univers: string) => {
  const noms = listeDe(liste);
  await expect(maisons(page)).toHaveCount(noms.length);
  for (const nom of noms) await expect(maison(page, nom)).toHaveAttribute("data-univers", cleDe(univers));
  await expect(page.locator(`[data-testid="maison"]:not([data-univers="${cleDe(univers)}"])`)).toHaveCount(0);
});

Then(
  /^les lecteurs d'écran annoncent « Maison « ([^«»]+) » », « Maison « ([^«»]+) » » et « Maison « ([^«»]+) » »$/,
  async ({ page }, premiere: string, deuxieme: string, troisieme: string) => {
    const attendues = [premiere, deuxieme, troisieme].map((nom) => `Maison « ${nom} »`);
    await expect(maisons(page)).toHaveCount(attendues.length);
    expect(await maisons(page).evaluateAll((elements) => elements.map((element) => element.getAttribute("aria-label")))).toEqual(attendues);
    for (const annonce of attendues) await expect(page.getByRole("group", { name: annonce, exact: true })).toHaveCount(1);
  },
);

Then(/^les lecteurs d'écran n'annoncent ni porte, ni toit, ni lumière, ni l'univers du dessin$/, async ({ page }) => {
  const dessins = page.getByTestId("dessin-de-la-maison");
  await expect(dessins).toHaveCount(await maisons(page).count());
  for (const dessin of await dessins.all()) await expect(dessin).toHaveAttribute("aria-hidden", "true");
  for (const une of await maisons(page).all()) {
    const arbre = await une.ariaSnapshot();
    expect(arbre, "ce que lisent les lecteurs d'écran").not.toMatch(/porte|toit|lumi[eè]re|univers|dessin|image|img/i);
  }
});

// --- Alors : « Je ne sais pas »

Given(/^Léa a dit « Je ne sais pas »$/, async ({ page }) => {
  await demarrer(page);
  await direJeNeSaisPasSurDesEtiquettes(page);
});

Given(/^Léa a dit « Je ne sais pas » pour l'étiquette « ([^«»]+) »$/, async ({ page }, etiquette: string) => {
  await demarrer(page);
  // L'étiquette choisie (touchée) est celle que « Je ne sais pas » vise.
  await etiquetteAPlacer(page, etiquette).click();
  etiquettesVisees.set(page, etiquette);
  await page.getByTestId("je-ne-sais-pas").click();
  await expect(page.getByTestId("je-ne-sais-pas")).toHaveCount(0);
  await expect(page.locator('[data-testid="maison"][data-brille="true"]')).toHaveCount(1);
});

function etiquetteChoisie(page: Page): string {
  const choisie = etiquettesVisees.get(page);
  if (choisie === undefined) throw new Error("« Je ne sais pas » n'a visé aucune étiquette");
  return choisie;
}

const maisonQuiBrille = (page: Page) => page.locator('[data-testid="maison"][data-brille="true"]');

async function nomDeLaMaisonQuiBrille(page: Page): Promise<string> {
  await expect(maisonQuiBrille(page)).toHaveCount(1);
  const libelle = (await maisonQuiBrille(page).getAttribute("aria-label")) ?? "";
  return /^Maison « (.+) »$/.exec(libelle)?.[1] ?? libelle;
}

When(/^Léa fait glisser du doigt l'étiquette choisie dans la maison qui brille$/, async ({ page }) => {
  await glisserDansLaMaison(page, etiquetteChoisie(page), await nomDeLaMaisonQuiBrille(page));
});

Then(/^l'étiquette choisie reste dans cette maison$/, async ({ page }) => {
  const choisie = etiquetteChoisie(page);
  const posee = page.getByTestId("maison").getByTestId("etiquette-posee").filter({ hasText: new RegExp(`^\\s*${echapper(choisie)}\\s*$`) });
  await expect(posee).toHaveCount(1);
  await expect(etiquetteAPlacer(page, choisie)).toHaveCount(0);
});

Then(/^la maison ne brille plus : sa porte s'ouvre et elle s'allume$/, async ({ page }) => {
  const choisie = etiquetteChoisie(page);
  const rangee = page.locator('[data-testid="maison"]').filter({
    has: page.getByTestId("etiquette-posee").filter({ hasText: new RegExp(`^\\s*${echapper(choisie)}\\s*$`) }),
  });
  await expect(rangee).toHaveCount(1);
  await expect(rangee).not.toHaveAttribute("data-brille", "true");
  await expect(rangee).toHaveAttribute("data-ouverte", "true");
  await expect(rangee).toHaveAttribute("data-allumee", "true");
  await expect(maisonQuiBrille(page)).toHaveCount(0);
});

Then(/^aucune maison n'ouvre sa porte$/, async ({ page }) => {
  await expect(maisons(page).first()).toBeVisible();
  await expect(page.locator('[data-testid="maison"][data-ouverte="true"]')).toHaveCount(0);
});

Then(/^aucune maison ne s'allume$/, async ({ page }) => {
  await expect(maisons(page).first()).toBeVisible();
  await expect(page.locator('[data-testid="maison"][data-allumee="true"]')).toHaveCount(0);
});

Then(/^aucune maison ne bouge$/, async ({ page }) => {
  await expect(maisonQuiBrille(page)).toHaveCount(1);
  for (const element of [maisonQuiBrille(page), maisonQuiBrille(page).getByTestId("signal-brille"), ...(await maisons(page).getByTestId("porte").all())]) {
    await expect(element.first()).toHaveCSS("animation-name", "none");
    await expect(element.first()).toHaveCSS("transition-duration", "0s");
  }
});

/** Les styles du signal « bonne réponse montrée », sans les couleurs (elles viennent de l'univers). */
async function styleDuSignal(page: Page): Promise<Record<string, string>> {
  const signal = maisonQuiBrille(page).getByTestId("signal-brille");
  await expect(signal, "le signal « bonne réponse montrée » est un élément de la maison").toHaveCount(1);
  await expect(signal).toHaveAttribute("data-brille", "true");
  return await signal.evaluate((element) => {
    const style = getComputedStyle(element);
    const sansCouleur = (valeur: string) => valeur.replace(/rgba?\([^)]*\)/g, "couleur");
    return {
      balise: element.tagName,
      animationName: style.animationName,
      animationDuration: style.animationDuration,
      animationIterationCount: style.animationIterationCount,
      animationTimingFunction: style.animationTimingFunction,
      boxShadow: sansCouleur(style.boxShadow),
      outlineWidth: style.outlineWidth,
      outlineStyle: style.outlineStyle,
      filter: sansCouleur(style.filter),
      opacity: style.opacity,
      transform: style.transform,
    };
  });
}

Then(/^elle brille de la même façon que dans l'univers « Animaux de la forêt »$/, async ({ page }) => {
  const dans = await styleDuSignal(page);
  const choisie = etiquetteChoisie(page);
  // Même exercice, même étiquette, dans l'univers Animaux de la forêt : on recharge avec ce profil-là et on refait « Je ne sais pas ».
  const lecon = etatDeLaLecon(page).courante;
  if (lecon === undefined) throw new Error("Aucune leçon en cours");
  await modifierLeProfilEtRechoisir(page, "animaux");
  await etiquetteAPlacer(page, choisie).click();
  await page.getByTestId("je-ne-sais-pas").click();
  const reference = await styleDuSignal(page);
  expect(dans, "même façon de briller que dans l'univers « Animaux de la forêt »").toEqual(reference);
});

// --- Le Contexte du .feature : Léa joue avec son vrai profil (créé pour Paul), et Paul est connecté sur la tablette

Given(
  /^Léa a un profil enfant préparé de niveau (\S+) dans l'univers « (.+) »$/,
  { tags: "@issue-98" },
  async ({ page, monde, famille }, niveau: string, univers: string) => {
    // Ce .feature ne dit pas que Paul est connecté : le vrai profil de Léa, les séances terminées et les étoiles en ont besoin.
    await famille.connecterSansEmail("tablette", "Paul");
    famillesParPage.set(page, famille);
    const cle = cleDe(univers);
    const profil: ProfilPrepare = { prenom: "Léa", niveau, univers: cle };
    monde.profils.set("Léa", profil);
    const parametres = scenario(page);
    parametres.univers = cle;
    await preparerLaPage(page, parametres);
    await preparerProfil(page, profil);
    await interceptertLaBibliotheque(page);
    await jouerAvecLeProfilReel(famille, monde, page);
  },
);

// --- Étant donné : l'univers de Léa et ses variantes (profil réel, niveau CP gardé)

type FamilleDeTest = Parameters<typeof modifierLeProfil>[0];
const famillesParPage = new WeakMap<Page, FamilleDeTest>();

async function modifierLeProfilEtRechoisir(page: Page, univers: string): Promise<void> {
  const famille = famillesParPage.get(page);
  if (!famille) throw new Error("Famille de test inconnue");
  await modifierLeProfil(famille, "Léa", { univers });
  const lecon = etatDeLaLecon(page).courante;
  const liste = page.waitForResponse((reponse) => reponse.url().includes("/rest/v1/profils_enfants"));
  await page.goto("/");
  await liste;
  await choisirSonProfil(page, "Léa");
  await expect(page.getByTestId("paysage")).toHaveAttribute("data-univers", univers);
  if (lecon) {
    await page.goto(`/lecon/${encodeURIComponent(lecon.id)}`);
    await page.getByTestId("exercice-propose").first().click();
    await expect(page.getByTestId("recipient")).toBeVisible();
  }
}

Given(
  /^Léa a choisi l'univers (animaux|princesse|sports|pompier|police|danse)$/,
  { tags: "@issue-98" },
  async ({ page, monde, famille }, univers: string) => {
    famillesParPage.set(page, famille);
    scenario(page).univers = univers;
    // Léa garde son niveau (CP) : seul l'univers de son profil change, sur le serveur, puis elle se choisit de nouveau.
    await modifierLeProfil(famille, "Léa", { univers });
    const prepare = monde.profils.get("Léa");
    monde.profils.set("Léa", { prenom: "Léa", niveau: prepare?.niveau ?? "CP", univers });
    const listeRelue = page.waitForResponse((reponse) => reponse.url().includes("/rest/v1/profils_enfants"));
    await page.goto("/");
    await listeRelue;
    await choisirSonProfil(page, "Léa");
    await expect(page.getByTestId("paysage")).toHaveAttribute("data-univers", univers);
  },
);

async function arriverAvecUnProfilPrepare(page: Page, profil: { prenom: string; niveau: string; univers?: string }): Promise<void> {
  await preparerProfil(page, profil);
  await page.goto("/jeu");
  await expect(page.getByTestId("enfant-en-cours")).toBeVisible();
  // Sans univers connu, l'application habille Léa de l'univers « Animaux de la forêt » (#6).
  await expect(page.locator(".application")).toHaveAttribute("data-univers", "animaux");
}

Given(/^Léa a un profil enfant préparé sans univers$/, { tags: "@issue-98" }, async ({ page, monde }) => {
  const profil = { prenom: "Léa", niveau: "CP" };
  monde.profils.set("Léa", profil);
  await arriverAvecUnProfilPrepare(page, profil);
});

Given(/^Léa a un profil enfant préparé dont l'univers est inconnu$/, { tags: "@issue-98" }, async ({ page, monde }) => {
  const profil = { prenom: "Léa", niveau: "CP", univers: "pirates" };
  monde.profils.set("Léa", profil);
  await arriverAvecUnProfilPrepare(page, profil);
});

// --- Mode dys

Then(/^Léa voit les étiquettes et le nom de chaque maison en mode dys : .+$/, async ({ page }) => {
  await demarrer(page);
  await expect(page.getByTestId("etiquette").first()).toBeVisible();
  const noms = await page.getByRole("button", { name: /^Poser dans la maison/ }).all();
  await verifierModeDys(page, [...(await page.getByTestId("etiquette").all()), ...noms], true);
});

// --- Séance de révision et test de départ : une question de classer reste une question à choix (98.18)

function lePremierExerciceDeClasser(page: Page, titreDeLaLecon: string, titreDeLExercice: string) {
  const lecon = leconDeTitre(page, titreDeLaLecon);
  const position = positionDeLExercice(lecon, titreDeLExercice);
  return { lecon, position, exercice: lecon.exercices[position] as { groupes: Array<{ id: string; nom: string }>; items: Array<{ texte: string; groupe: string }> } };
}

function aujourdhui(): { jour: string; hier: Date } {
  const maintenant = new Date();
  const deux = (n: number) => String(n).padStart(2, "0");
  return {
    jour: `${maintenant.getFullYear()}-${deux(maintenant.getMonth() + 1)}-${deux(maintenant.getDate())}`,
    hier: new Date(maintenant.getFullYear(), maintenant.getMonth(), maintenant.getDate() - 1, 9),
  };
}

const LECON_DES_SONS = "Les sons ou, on, an";

Given(
  /^Léa a pour question retenue l'étiquette « ([^«»]+) » de l'exercice « ([^«»]+) », due aujourd'hui$/,
  async ({ famille, page }, etiquette: string, titreDeLExercice: string) => {
    const { lecon, position, exercice } = lePremierExerciceDeClasser(page, LECON_DES_SONS, titreDeLExercice);
    // La clé de la question est celle du domaine (cleDuClasser) : l'étiquette suivie des noms des maisons, normalisée.
    const brute = etiquette + exercice.groupes.map((groupe) => groupe.nom).join();
    const cle = `k:${brute.normalize("NFD").replace(/\p{M}/gu, "").toLowerCase().replace(/\s+/g, " ").trim()}`;
    const { jour, hier } = aujourdhui();
    await ecrireLaFileDeRevision(profilDe(famille, "Léa").id, [{
      cle,
      leconDOrigine: lecon.id,
      position,
      type: "classer",
      intervalle: 1,
      dateDeRevision: jour,
      derniereErreurLe: hier.toISOString(),
    }]);
    // La file du serveur n'est lue qu'une fois par profil : on recharge pour qu'elle soit lue avec cette question.
    await rechargerAvecLeProfilReel(page);
  },
);

const ID_DE_LA_LECON_DU_TEST_DE_DEPART = "e2e-98-test-de-depart";

Given(
  /^le test de départ de Léa pose la question de l'étiquette « ([^«»]+) » de l'exercice « ([^«»]+) »$/,
  async ({ page }, etiquette: string, titreDeLExercice: string) => {
    const { lecon, exercice } = lePremierExerciceDeClasser(page, LECON_DES_SONS, titreDeLExercice);
    // Une seule leçon, un seul exercice classer, une seule étiquette : le test de départ ne peut poser que cette question.
    const deTest: LeconBrute = {
      ...lecon,
      id: ID_DE_LA_LECON_DU_TEST_DE_DEPART,
      exercices: [{ ...exercice, items: exercice.items.filter((item) => item.texte === etiquette) }],
    };
    etatDeLaLecon(page).injectees.push(deTest);
    suivreLesLecturesDuResultat(page);
    const servir = (route: Route) => route.fulfill({ json: [deTest] });
    await page.context().route("**/bibliotheque.json", servir);
    await page.route("**/bibliotheque.json", servir);
    await rechargerAvecLeProfilReel(page);
  },
);

When(/^Léa arrive à cette question du test de départ$/, async ({ page }) => {
  await ouvrirLaProposition(page);
  await accepterLaProposition(page);
  await expect.poll(async () => {
    if (await page.getByTestId("question").count() > 0) return true;
    await terminerLaLecture(page);
    return false;
  }, { intervals: [100], timeout: 15_000 }).toBe(true);
});

Then(
  /^Léa voit la question « (.+) », avec les choix (.+)$/,
  async ({ page }, question: string, choix: string) => {
    await expect(page.getByTestId("question")).toHaveText(normaliser(question));
    await avancerJusquAuxChoix(page);
    expect([...(await textesDesChoix(page))].sort()).toEqual(listeDe(choix).sort());
  },
);

Then(/^Léa ne voit aucune étiquette à faire glisser$/, async ({ page }) => {
  await expect(page.getByTestId("question")).toBeVisible();
  await expect(page.getByTestId("etiquettes")).toHaveCount(0);
  await expect(page.getByTestId("etiquette")).toHaveCount(0);
  await expect(page.getByTestId("maison")).toHaveCount(0);
});

// --- Le personnage guide des autres univers : même aide, autre voix (98.2)

Then(
  /^(Coach Léo|Agent Max|Capitaine Sam|Lumi|Lili) dit un encouragement, suivi de « (.+) »$/,
  async ({ page }, personnage: string, complement: string) => {
    await expect(bulle(page)).toHaveAttribute("data-nature", "encouragement");
    const texte = normaliser((await bulle(page).textContent()) ?? "");
    expect(texte.endsWith(` ${complement}`), texte).toBe(true);
    expect(texte.length).toBeGreaterThan(complement.length + 1);
    await expect(leGuide(page, personnage)).toBeVisible();
  },
);
