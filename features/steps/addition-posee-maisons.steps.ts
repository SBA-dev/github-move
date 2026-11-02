import { expect, type Locator, type Page, type Route } from "@playwright/test";
import { createBdd } from "playwright-bdd";
import { ecrireLaFileDeRevision } from "../support/revision-api.ts";
import { suivreLesLecturesDuResultat } from "../support/bibliotheque-du-test-de-depart.ts";
import { Before, test } from "./fixtures.ts";
import { etat as etatDeLaLecon, type LeconBrute, leconDeTitre } from "./etapes-puis-exercices.steps.ts";
import { positionDeLExercice } from "./exercices-a-choix.steps.ts";
import {
  attendreLEtape,
  chiffresDeLAddition,
  choixDeLaQuestion,
  colonne,
  commencerLAdditionDeTest,
  exactement,
  finDeSeance,
  phraseDeLaColonne,
  poserLeNombre,
  poserUnChiffre,
  repondreAuNombre,
  sommeDeLaPhrase,
} from "./calcul-fluence-addition.steps.ts";
import { chiffresChoisis } from "./calcul-pour-les-autres-stories.steps.ts";
import {
  centreDe,
  deplacerLeDoigt,
  doigts,
  leverLeDoigt,
  modifierLeProfilEtRechoisir,
  montrerLeDepartEtLArrivee,
  poserLeDoigt,
} from "./exercices-comme-des-jeux.steps.ts";
import { installerLesFauxDeLaStory97 } from "./retours-animes-et-sonores.steps.ts";
import { atteindreAuClavier } from "./classer-ordre-trous.steps.ts";
import { verifierModeDys } from "./reglages.steps.ts";
import { rechargerAvecLeProfilReel } from "./profil-reel.ts";
import { profilDe } from "./profils-enfants.steps.ts";
import { accepterLaProposition, ouvrirLaProposition } from "./test-de-depart.steps.ts";
import { cleDe } from "./univers.steps.ts";
import { journal, terminerLaLecture } from "./voix.steps.ts";

// Story #127, tranche 98c-addition de #98 : les maisons de l'addition posée (glisser au doigt, maison allumée, retenue qui saute).
//
// CONTRAT D'ATTRIBUTS entre ces étapes et l'application (tout se lit par des attributs et des data-testid, jamais par un tracé) :
//   - colonne (data-testid="colonne", existant) : data-rang (unites | dizaines | centaines), data-couleur (bleue | rose | verte),
//     data-en-cours, data-brille="true" quand « Je ne sais pas » à l'étape poser la désigne, avec dans la colonne un élément
//     data-testid="signal-brille" (data-brille="true") comme dans 98a. La maison allumée ne porte jamais data-brille ;
//   - maison (data-testid="maison-de-la-colonne", la zone de toucher ET de lâcher, nom accessible « Poser dans la colonne des … ») :
//     data-univers, data-ouverte, data-allumee, data-survolee ; elle contient data-testid="dessin-de-la-maison" (aria-hidden) et
//     data-testid="porte" ; son texte visible est le nom de la colonne (pastille) ;
//   - chiffre à poser (data-testid="chiffre-a-poser") : data-etat = "a-poser" | "suit-le-doigt" | "revient" ;
//   - retenue (data-testid="retenue", role img, aria-label « Retenue 1 », texte = le chiffre) : data-univers, data-couleur
//     (neutre | rose | verte, la couleur de sa maison d'arrivée, jamais bleue pour une retenue qui monte vers les dizaines),
//     data-mouvement = "saute" | "aucun" (déjà "aucun" avec les mouvements réduits, #20), data-depart = rang de la colonne dont le
//     chiffre vient d'être écrit, data-saut = "en-cours" puis "fini" (absent quand data-mouvement="aucun") ; son dessin est
//     data-testid="dessin-de-la-retenue" (aria-hidden).
// Le glisser au doigt est un vrai geste tactile (CDP), celui de 98a. Le lâcher compte dans la zone de la maison, jamais ailleurs.

const { Given, When, Then } = createBdd(test, { tags: "@issue-127" });

const RANG = "(unités|dizaines|centaines)";
const RANGS: Readonly<Record<string, string>> = { unités: "unites", dizaines: "dizaines", centaines: "centaines" };
const GESTE = "(en le faisant glisser du doigt|en le touchant, puis en touchant la maison|au clavier seulement)";
const DELAI_MS = 20_000;
const PLUS_GRANDE_HAUTEUR_D_ECRAN = 740;

type Geste = "glisser" | "toucher" | "clavier";

function geste(texte: string): Geste {
  if (texte === "en le faisant glisser du doigt") return "glisser";
  return texte === "au clavier seulement" ? "clavier" : "toucher";
}

// --- Ce que le navigateur voit passer (chiffres, maisons, retenue, paroles, effets sonores), noté dès le départ

type Passage = {
  t: number;
  genre: "chiffre" | "maison" | "retenue" | "parole" | "son";
  texte?: string;
  etat?: string;
  rang?: string;
  ouverte?: string;
  allumee?: string;
  survolee?: string;
  brille?: string;
  depart?: string;
  saut?: string;
  mouvement?: string;
  nom?: string;
};

type Journal127 = { passages: Passage[]; marque: number };

export function installerLEnregistreurDeLaStory127() {
  type Effets = { entrees: Array<{ nom: string }> };
  type Faux = { journal: Array<{ type: string; texte: string }> };
  const journal: { passages: Array<Record<string, string | number>>; marque: number } = { passages: [], marque: 0 };
  Reflect.set(window, "__jeu127", journal);
  const attribut = (element: Element, nom: string) => element.getAttribute(nom) ?? "";
  const texteDe = (element: Element) => (element.textContent ?? "").replace(/\s+/g, " ").trim();
  const rangDe = (element: Element) => element.closest('[data-testid="colonne"]')?.getAttribute("data-rang") ?? "";
  const noter = (element: Element) => {
    const identifiant = element.getAttribute("data-testid");
    const t = performance.now();
    if (identifiant === "chiffre-a-poser") {
      journal.passages.push({ t, genre: "chiffre", texte: texteDe(element), etat: attribut(element, "data-etat") });
    }
    if (identifiant === "maison-de-la-colonne") {
      journal.passages.push({
        t,
        genre: "maison",
        rang: rangDe(element),
        ouverte: attribut(element, "data-ouverte"),
        allumee: attribut(element, "data-allumee"),
        survolee: attribut(element, "data-survolee"),
        brille: attribut(element, "data-brille"),
      });
    }
    if (identifiant === "retenue") {
      journal.passages.push({
        t,
        genre: "retenue",
        rang: rangDe(element),
        depart: attribut(element, "data-depart"),
        saut: attribut(element, "data-saut"),
        mouvement: attribut(element, "data-mouvement"),
      });
    }
  };
  const SELECTEUR = '[data-testid="chiffre-a-poser"],[data-testid="maison-de-la-colonne"],[data-testid="retenue"]';
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
    attributeFilter: ["data-etat", "data-ouverte", "data-allumee", "data-survolee", "data-brille", "data-saut", "data-mouvement"],
  });
  // Les effets sonores (faux de #97) et les paroles (faux de la voix) : on note l'instant où chacun apparaît dans son journal.
  let sons = 0;
  let paroles = 0;
  const regarder = () => {
    const effets = Reflect.get(window, "__effets") as Effets | undefined;
    if (effets && effets.entrees.length > sons) {
      for (let rang = sons; rang < effets.entrees.length; rang++) {
        journal.passages.push({ t: performance.now(), genre: "son", nom: effets.entrees[rang]?.nom ?? "" });
      }
      sons = effets.entrees.length;
    }
    const faux = Reflect.get(window, "__faux") as Faux | undefined;
    if (faux && faux.journal.length > paroles) {
      for (let rang = paroles; rang < faux.journal.length; rang++) {
        const entree = faux.journal[rang];
        if (entree?.type === "speak") journal.passages.push({ t: performance.now(), genre: "parole", texte: entree.texte });
      }
      paroles = faux.journal.length;
    }
    requestAnimationFrame(regarder);
  };
  requestAnimationFrame(regarder);
  // Début du geste de l'enfant : le dernier toucher d'un bouton (les gestes tactiles marquent eux-mêmes).
  document.addEventListener("click", (evenement) => {
    const cible = evenement.target;
    if (cible instanceof Element && cible.closest("button") !== null) journal.marque = journal.passages.length;
  }, true);
}

Before({ tags: "@issue-127" }, async ({ page, $testInfo }) => {
  // Le vrai profil de Léa, les séances jouées jusqu'à leur fin et les gestes tactiles passent par le serveur.
  $testInfo.setTimeout(Math.max($testInfo.timeout, 120_000));
  await page.addInitScript(installerLesFauxDeLaStory97, { echec: false, retenir: [] });
  await page.addInitScript(installerLEnregistreurDeLaStory127);
});

async function journal127(page: Page): Promise<{ passages: Passage[]; depuisLeGeste: Passage[] }> {
  const lu = await page.evaluate(() => {
    const brut = Reflect.get(window, "__jeu127") as Journal127 | undefined;
    return brut === undefined ? { passages: [], marque: 0 } : { passages: [...brut.passages], marque: brut.marque };
  });
  return { passages: lu.passages, depuisLeGeste: lu.passages.slice(lu.marque) };
}

async function marquerLeGesteTactile(page: Page): Promise<void> {
  await page.evaluate(() => {
    const brut = Reflect.get(window, "__jeu127") as Journal127 | undefined;
    if (brut) brut.marque = brut.passages.length;
  });
}

// --- Les écrans

const chiffresAPoser = (page: Page) => page.getByTestId("chiffres-a-poser").getByTestId("chiffre-a-poser");
const chiffreAPoser = (page: Page, chiffre: string) => chiffresAPoser(page).filter({ hasText: exactement(chiffre) }).first();
const toutLeChiffre = (page: Page, chiffre: string) => page.getByTestId("chiffre-a-poser").filter({ hasText: exactement(chiffre) });
const maisonDe = (page: Page, rang: string) => colonne(page, rang).getByTestId("maison-de-la-colonne");
const maisons = (page: Page) => page.getByTestId("maison-de-la-colonne");
const retenueDe = (page: Page, rang: string) => colonne(page, rang).getByTestId("retenue");
const chiffrePose = (page: Page, rang: string, chiffre: string) =>
  colonne(page, rang).getByTestId("chiffre-pose").filter({ hasText: exactement(chiffre) });

// --- Le glisser au doigt : le geste de 98a, du chiffre à la maison de la colonne

async function toucherEtDeplacer(page: Page, depart: Point, arrivee: Point, lever: boolean): Promise<void> {
  await marquerLeGesteTactile(page);
  await poserLeDoigt(page, depart);
  await deplacerLeDoigt(page, arrivee);
  if (lever) await leverLeDoigt(page);
}

type Point = { x: number; y: number };

async function glisserDansLaMaison(page: Page, chiffre: string, rang: string): Promise<void> {
  await montrerLeDepartEtLArrivee(page, chiffreAPoser(page, chiffre), maisonDe(page, rang), `« ${chiffre} » et la maison des ${rang}`);
  const depart = await centreDe(page, chiffreAPoser(page, chiffre), `le chiffre « ${chiffre} »`);
  const arrivee = await centreDe(page, maisonDe(page, rang), `la maison des ${rang}`);
  await toucherEtDeplacer(page, depart, arrivee, true);
}

/** Un point de l'écran hors de toute colonne et de tout bouton, le plus près possible de `depuis` (mais à plus de 40 px). */
async function pointHorsDeToutesLesMaisons(page: Page, depuis: Point): Promise<Point> {
  const point = await page.evaluate((origine) => {
    let meilleur: { x: number; y: number; distance: number } | undefined;
    for (let y = 8; y < window.innerHeight; y += 12) {
      for (let x = 8; x < window.innerWidth; x += 12) {
        const element = document.elementFromPoint(x, y);
        if (element === null || element.closest('button, [data-testid="colonne"], [data-testid="maison-de-la-colonne"]') !== null) continue;
        const distance = Math.hypot(x - origine.x, y - origine.y);
        if (distance > 40 && (!meilleur || distance < meilleur.distance)) meilleur = { x, y, distance };
      }
    }
    return meilleur ? { x: meilleur.x, y: meilleur.y } : null;
  }, depuis);
  if (point === null) throw new Error("Aucun point de l'écran hors de toute maison");
  return point;
}

async function glisserHorsDeToutesLesMaisons(page: Page, chiffre: string): Promise<void> {
  const depart = await centreDe(page, chiffreAPoser(page, chiffre), `le chiffre « ${chiffre} »`);
  await toucherEtDeplacer(page, depart, await pointHorsDeToutesLesMaisons(page, depart), true);
}

async function attendreQueLeChiffreSoitALaPlace(page: Page, chiffre: string): Promise<void> {
  await expect(toutLeChiffre(page, chiffre)).toHaveCount(1);
  await expect(toutLeChiffre(page, chiffre)).toHaveAttribute("data-etat", "a-poser");
}

async function nombreDeChiffresPoses(page: Page): Promise<number> {
  return await page.getByTestId("chiffre-pose").count();
}

async function poserAvecLeGeste(page: Page, chiffre: string, rang: string, maniere: Geste): Promise<void> {
  if (maniere === "toucher") return await poserUnChiffre(page, chiffre, rang);
  const poses = await nombreDeChiffresPoses(page);
  const paroles = (await journal(page)).speaks;
  if (maniere === "glisser") {
    await glisserDansLaMaison(page, chiffre, rang);
  } else {
    await atteindreAuClavier(page, { testid: "chiffre-a-poser", texte: chiffre });
    await page.keyboard.press("Enter");
    await atteindreAuClavier(page, { label: `Poser dans la colonne des ${rang}` });
    await page.keyboard.press("Enter");
  }
  await expect.poll(async () => (await nombreDeChiffresPoses(page)) > poses || (await journal(page)).speaks > paroles).toBe(true);
}

const LIBELLES_DES_RANGS = ["unités", "dizaines", "centaines"] as const;

async function poserLesChiffresDuNombre(page: Page, nombre: number, maniere: Geste): Promise<void> {
  const chiffres = String(nombre).split("");
  for (const [position, chiffre] of chiffres.entries()) {
    await poserAvecLeGeste(page, chiffre, LIBELLES_DES_RANGS[chiffres.length - 1 - position] ?? "unités", maniere);
  }
}

async function poserTousLesChiffres(page: Page, maniere: Geste): Promise<void> {
  for (const nombre of await chiffresDeLAddition(page)) {
    await expect(page.getByTestId("chiffres-a-poser")).toBeVisible();
    await poserLesChiffresDuNombre(page, nombre, maniere);
  }
}

async function laReponseEstPossible(page: Page): Promise<boolean> {
  if (await finDeSeance(page).isVisible()) return true;
  const touches = choixDeLaQuestion(page).or(page.getByTestId("clavier-de-cristaux")).getByRole("button");
  return (await touches.count()) > 0 && (await touches.first().getAttribute("aria-disabled")) !== "true";
}

async function calculerChaqueColonneSansErreur(page: Page): Promise<void> {
  for (let essai = 0; essai < 6; essai++) {
    await expect.poll(async () => {
      if (await finDeSeance(page).isVisible()) return true;
      if (await phraseDeLaColonne(page).isVisible()) return await laReponseEstPossible(page);
      await terminerLaLecture(page);
      return false;
    }, { intervals: [100], timeout: DELAI_MS }).toBe(true);
    if (await finDeSeance(page).isVisible()) return;
    const phrase = (await phraseDeLaColonne(page).textContent()) ?? "";
    await repondreAuNombre(page, sommeDeLaPhrase(phrase));
    await expect.poll(async () => {
      if (await finDeSeance(page).isVisible()) return true;
      if (await phraseDeLaColonne(page).isVisible() && ((await phraseDeLaColonne(page).textContent()) ?? "") !== phrase) return true;
      await terminerLaLecture(page);
      return false;
    }, { intervals: [100], timeout: DELAI_MS }).toBe(true);
  }
}

// --- Quand : une séance entière, au doigt, au toucher ou au clavier

When(
  new RegExp(`^Léa pose chaque chiffre dans sa maison ${GESTE}, puis calcule chaque colonne sans erreur$`),
  async ({ page }, texte: string) => {
    await commencerLAdditionDeTest(page);
    await attendreLEtape(page, "poser");
    await poserTousLesChiffres(page, geste(texte));
    await attendreLEtape(page, "calculer");
    await calculerChaqueColonneSansErreur(page);
  },
);

When(/^Léa termine l'exercice sans autre erreur$/, async ({ page }) => {
  await commencerLAdditionDeTest(page);
  await attendreLEtape(page, "poser");
  await poserTousLesChiffres(page, "toucher");
  await attendreLEtape(page, "calculer");
  await calculerChaqueColonneSansErreur(page);
});

// --- Étant donné et Quand : un chiffre, un geste

When(
  new RegExp(`^Léa pose le chiffre « (\\d) » de (\\d+) dans la maison des ${RANG} ${GESTE}$`),
  async ({ page }, chiffre: string, _nombre: string, rang: string, texte: string) => {
    await commencerLAdditionDeTest(page);
    await poserAvecLeGeste(page, chiffre, rang, geste(texte));
  },
);

When(
  new RegExp(`^Léa fait glisser du doigt le chiffre « (\\d) » de (\\d+) dans la maison des ${RANG}$`),
  async ({ page }, chiffre: string, _nombre: string, rang: string) => {
    await commencerLAdditionDeTest(page);
    await glisserDansLaMaison(page, chiffre, rang);
  },
);

Given(
  new RegExp(`^Léa a fait glisser du doigt (\\d+) fois le chiffre « (\\d) » de (\\d+) dans la maison des ${RANG}$`),
  async ({ page }, fois: string, chiffre: string, _nombre: string, rang: string) => {
    await commencerLAdditionDeTest(page);
    for (let i = 0; i < Number(fois); i++) {
      await glisserDansLaMaison(page, chiffre, rang);
      await attendreQueLeChiffreSoitALaPlace(page, chiffre);
    }
  },
);

When(/^Léa fait glisser du doigt le chiffre « (\d) » de (\d+) et le lâche hors de toute maison$/, async ({ page }, chiffre: string, _nombre: string) => {
  await commencerLAdditionDeTest(page);
  await glisserHorsDeToutesLesMaisons(page, chiffre);
});

Given(/^Léa a lâché (\d+) fois le chiffre « (\d) » de (\d+) hors de toute maison$/, async ({ page }, fois: string, chiffre: string, _nombre: string) => {
  await commencerLAdditionDeTest(page);
  const avant = await chiffresAPoser(page).count();
  for (let i = 0; i < Number(fois); i++) {
    await glisserHorsDeToutesLesMaisons(page, chiffre);
    await attendreQueLeChiffreSoitALaPlace(page, chiffre);
  }
  expect(await chiffresAPoser(page).count()).toBe(avant);
});

When(
  new RegExp(`^Léa fait passer du doigt le chiffre « (\\d) » de (\\d+) au-dessus de la maison des ${RANG}, sans le lâcher$`),
  async ({ page }, chiffre: string, _nombre: string, rang: string) => {
    await commencerLAdditionDeTest(page);
    const depart = await centreDe(page, chiffreAPoser(page, chiffre), `le chiffre « ${chiffre} »`);
    const arrivee = await centreDe(page, maisonDe(page, rang), `la maison des ${rang}`);
    await toucherEtDeplacer(page, depart, arrivee, false);
  },
);

When(
  new RegExp(`^Léa essaie de faire glisser du doigt le chiffre « (\\d) » hors de la maison des ${RANG}$`),
  async ({ page }, chiffre: string, rang: string) => {
    const depart = await centreDe(page, chiffrePose(page, rang, chiffre), `le chiffre posé « ${chiffre} »`);
    await toucherEtDeplacer(page, depart, await pointHorsDeToutesLesMaisons(page, depart), true);
  },
);

When(new RegExp(`^Léa touche la maison des ${RANG}$`), async ({ page }, rang: string) => {
  await maisonDe(page, rang).click();
});

When(/^Léa pose les chiffres de (\d+) dans leurs colonnes$/, async ({ page }, nombre: string) => {
  await poserLeNombre(page, Number(nombre));
});

// --- Alors : le chiffre

Then(/^le chiffre « (\d) » revient en glissant jusqu'à sa place parmi les chiffres à poser$/, async ({ page }, chiffre: string) => {
  await attendreQueLeChiffreSoitALaPlace(page, chiffre);
  const etats = etatsDuChiffre((await journal127(page)).depuisLeGeste, chiffre);
  expect(etats, `états vus de « ${chiffre} »`).toContain("suit-le-doigt");
  expect(etats, `états vus de « ${chiffre} »`).toContain("revient");
  expect(etats.lastIndexOf("a-poser"), "le chiffre est à sa place après son retour").toBeGreaterThan(etats.indexOf("revient"));
});

function etatsDuChiffre(passages: readonly Passage[], chiffre: string): string[] {
  return passages.flatMap((passage) => passage.genre === "chiffre" && passage.texte === chiffre ? [passage.etat ?? ""] : []);
}

Then(/^le chiffre « (\d) » réapparaît à sa place, sans glisser$/, async ({ page }, chiffre: string) => {
  await attendreQueLeChiffreSoitALaPlace(page, chiffre);
  expect(etatsDuChiffre((await journal127(page)).depuisLeGeste, chiffre), `états vus de « ${chiffre} »`).not.toContain("revient");
  await expect(toutLeChiffre(page, chiffre)).toHaveCSS("animation-name", "none");
  await expect(toutLeChiffre(page, chiffre)).toHaveCSS("transition-duration", "0s");
});

Then(/^le chiffre « (\d) » suit le doigt de Léa$/, async ({ page }, chiffre: string) => {
  const suivi = toutLeChiffre(page, chiffre);
  await expect(suivi).toHaveAttribute("data-etat", "suit-le-doigt");
  const doigt = doigts.get(page);
  if (!doigt) throw new Error("Aucun doigt posé sur l'écran");
  const boite = await suivi.boundingBox();
  expect(boite, "le chiffre est à l'écran").not.toBeNull();
  const marge = 12;
  expect(doigt.x, "le doigt est sur le chiffre (horizontalement)").toBeGreaterThanOrEqual((boite?.x ?? 0) - marge);
  expect(doigt.x).toBeLessThanOrEqual((boite?.x ?? 0) + (boite?.width ?? 0) + marge);
  expect(doigt.y, "le doigt est sur le chiffre (verticalement)").toBeGreaterThanOrEqual((boite?.y ?? 0) - marge);
  expect(doigt.y).toBeLessThanOrEqual((boite?.y ?? 0) + (boite?.height ?? 0) + marge);
});

Then(/^l'effet sonore « réponse fausse » commence avant que le chiffre « (\d) » soit revenu à sa place$/, async ({ page }, chiffre: string) => {
  await attendreQueLeChiffreSoitALaPlace(page, chiffre);
  const { depuisLeGeste } = await journal127(page);
  const son = depuisLeGeste.find((passage) => passage.genre === "son" && passage.nom === "reponse-fausse");
  expect(son, "l'effet sonore « réponse fausse » a été entendu").toBeDefined();
  const retour = depuisLeGeste.findIndex((passage) => passage.genre === "chiffre" && passage.texte === chiffre && passage.etat === "revient");
  expect(retour, `« ${chiffre} » est revenu en glissant`).toBeGreaterThanOrEqual(0);
  const arrivee = depuisLeGeste.slice(retour).find((passage) => passage.genre === "chiffre" && passage.texte === chiffre && passage.etat === "a-poser");
  expect(arrivee, `« ${chiffre} » est de nouveau à sa place`).toBeDefined();
  expect(son?.t ?? Infinity, "le son commence avant l'arrivée du chiffre").toBeLessThan(arrivee?.t ?? 0);
});

/** « Il reste » compte les chiffres de l'addition entière qui ne sont pas encore posés (l'écran n'en montre qu'un nombre à la fois). */
Then(/^il reste (\d+) chiffres à poser$/, async ({ page }, nombre: string) => {
  await expect(page.getByTestId("chiffres-a-poser")).toBeVisible();
  const total = (await chiffresDeLAddition(page)).reduce((somme, terme) => somme + String(terme).length, 0);
  expect(total - (await nombreDeChiffresPoses(page))).toBe(Number(nombre));
});

Then(/^Léa ne voit aucune maison ni aucun chiffre à faire glisser$/, async ({ page }) => {
  await expect(page.getByTestId("carte-du-calcul")).toBeVisible();
  for (const identifiant of ["addition-posee", "colonne", "maison-de-la-colonne", "chiffre-a-poser", "chiffres-a-poser", "maison", "etiquette"]) {
    await expect(page.getByTestId(identifiant), identifiant).toHaveCount(0);
  }
});

// --- Alors : les maisons (survol, porte, lumière)

Then(new RegExp(`^la maison des ${RANG} se signale comme toute maison survolée, sans dire si c'est la bonne$`), async ({ page }, rang: string) => {
  const survolee = maisonDe(page, rang);
  await expect(survolee).toHaveAttribute("data-survolee", "true");
  await expect(survolee).not.toHaveAttribute("data-brille", "true");
  await expect(survolee).toHaveAttribute("data-ouverte", "false");
  await expect(survolee).toHaveAttribute("data-allumee", "false");
  await expect(page.locator('[data-testid="maison-de-la-colonne"][data-survolee="true"]')).toHaveCount(1);
});

Then(new RegExp(`^la maison des ${RANG} s'allume$`), async ({ page }, rang: string) => {
  await expect(maisonDe(page, rang)).toHaveAttribute("data-allumee", "true");
});

Then(new RegExp(`^la maison des ${RANG} reste éteinte$`), async ({ page }, rang: string) => {
  await expect(maisonDe(page, rang)).toHaveAttribute("data-allumee", "false");
});

Then(new RegExp(`^la maison des ${RANG} s'allume, sans que sa porte bouge$`), async ({ page }, rang: string) => {
  await expect(maisonDe(page, rang)).toHaveAttribute("data-allumee", "true");
  const porte = maisonDe(page, rang).getByTestId("porte");
  await expect(porte).toHaveCount(1);
  await expect(porte).toHaveCSS("animation-name", "none");
  await expect(porte).toHaveCSS("transition-duration", "0s");
});

Then(new RegExp(`^la maison des ${RANG} ne brille pas comme une bonne réponse montrée$`), async ({ page }, rang: string) => {
  await expect(maisonDe(page, rang)).not.toHaveAttribute("data-brille", "true");
  await expect(colonne(page, rang)).not.toHaveAttribute("data-brille", "true");
  await expect(colonne(page, rang).getByTestId("signal-brille")).toHaveCount(0);
});

Then(new RegExp(`^la porte de la maison des ${RANG} s'ouvre$`), async ({ page }, rang: string) => {
  await expect(maisonDe(page, rang)).toHaveAttribute("data-ouverte", "true");
});

Then(new RegExp(`^la porte de la maison des ${RANG} reste fermée$`), async ({ page }, rang: string) => {
  await expect(maisonDe(page, rang)).toHaveAttribute("data-ouverte", "false");
  await expect(maisonDe(page, rang)).toHaveAttribute("data-allumee", "false");
  const { passages } = await journal127(page);
  expect(passages.filter((passage) => passage.genre === "maison" && passage.rang === RANGS[rang] && passage.ouverte === "true")).toEqual([]);
});

function rangsDe(liste: string): string[] {
  return [...liste.matchAll(/unités|dizaines|centaines/g)].map(([rang]) => rang);
}

Then(/^les maisons (des .+) sont allumées$/, async ({ page }, liste: string) => {
  for (const rang of rangsDe(liste)) await expect(maisonDe(page, rang)).toHaveAttribute("data-allumee", "true");
});

// Plus large que celle de 98a : elle compte aussi les maisons de colonne, qui doivent toutes dire « éteinte ».
Then(/^aucune maison ne s'allume$/, async ({ page }) => {
  await expect(page.locator('[data-testid="maison"],[data-testid="maison-de-la-colonne"]').first()).toBeVisible();
  await expect(page.locator('[data-testid="maison"][data-allumee="true"],[data-testid="maison-de-la-colonne"][data-allumee="true"]')).toHaveCount(0);
  await expect(page.locator('[data-testid="maison-de-la-colonne"]:not([data-allumee="false"])')).toHaveCount(0);
});

Then(/^Léa voit toujours (\d+) maisons$/, async ({ page }, nombre: string) => {
  await expect(maisons(page)).toHaveCount(Number(nombre));
});

Then(new RegExp(`^Léa voit « (\\d+) » écrit sous la colonne des ${RANG}$`), async ({ page }, ecrit: string, rang: string) => {
  await expect(colonne(page, rang).getByTestId("chiffre-ecrit")).toHaveText(ecrit);
});

// --- Alors : la retenue qui saute

function sautDeLaRetenue(passages: readonly Passage[], depart: string, arrivee: string): Passage | undefined {
  return passages.find((p) => p.genre === "retenue" && p.saut === "en-cours" && p.rang === RANGS[arrivee] && p.depart === RANGS[depart]);
}

Then(
  new RegExp(`^la retenue « (\\d) » saute de la maison des ${RANG} jusqu'en haut de la maison des ${RANG}$`),
  async ({ page }, retenue: string, depart: string, arrivee: string) => {
    const marque = retenueDe(page, arrivee);
    await expect(marque).toHaveText(retenue);
    await expect(marque).toHaveAttribute("data-depart", RANGS[depart] ?? "");
    await expect(marque).toHaveAttribute("data-mouvement", "saute");
    await expect.poll(async () => sautDeLaRetenue((await journal127(page)).depuisLeGeste, depart, arrivee) !== undefined, { timeout: DELAI_MS }).toBe(true);
    await expect(marque).toHaveAttribute("data-saut", "fini");
  },
);

Then(/^l'effet sonore « réponse juste » commence avant que la retenue « (\d) » ait fini de sauter$/, async ({ page }, _retenue: string) => {
  await expect.poll(async () => {
    const { depuisLeGeste } = await journal127(page);
    return depuisLeGeste.some((p) => p.genre === "retenue" && p.saut === "fini") && depuisLeGeste.some((p) => p.genre === "son" && p.nom === "reponse-juste");
  }, { timeout: DELAI_MS }).toBe(true);
  const { depuisLeGeste } = await journal127(page);
  const son = depuisLeGeste.find((p) => p.genre === "son" && p.nom === "reponse-juste");
  const fin = depuisLeGeste.find((p) => p.genre === "retenue" && p.saut === "fini");
  expect(son?.t ?? Infinity, "le son commence avant la fin du saut").toBeLessThan(fin?.t ?? 0);
});

Then(/^le saut commence avant que Noisette dise « ([^«»]+) »$/, async ({ page }, extrait: string) => {
  await expect.poll(async () => {
    const { depuisLeGeste } = await journal127(page);
    return depuisLeGeste.some((p) => p.genre === "parole" && (p.texte ?? "").includes(extrait));
  }, { timeout: DELAI_MS }).toBe(true);
  const { depuisLeGeste } = await journal127(page);
  const saut = depuisLeGeste.find((p) => p.genre === "retenue" && p.saut === "en-cours");
  const parole = depuisLeGeste.find((p) => p.genre === "parole" && (p.texte ?? "").includes(extrait));
  expect(saut, "la retenue a sauté").toBeDefined();
  expect(saut?.t ?? Infinity, "le saut commence avant la parole").toBeLessThanOrEqual(parole?.t ?? 0);
});

Then(/^aucune retenue ne saute$/, async ({ page }) => {
  await expect(page.getByTestId("colonne").first()).toBeVisible();
  await expect(page.locator('[data-testid="retenue"][data-saut="en-cours"]')).toHaveCount(0);
  expect((await journal127(page)).depuisLeGeste.filter((p) => p.genre === "retenue" && p.saut === "en-cours")).toEqual([]);
});

Then(new RegExp(`^aucune retenue n'apparaît en haut de la maison des ${RANG}$`), async ({ page }, rang: string) => {
  await expect(colonne(page, rang)).toBeVisible();
  await expect(retenueDe(page, rang)).toHaveCount(0);
});

// --- Alors : couleurs et dessin de l'univers

Then(
  /^Léa voit, de gauche à droite, la maison des centaines en vert, la maison des dizaines en rose et la maison des unités en bleu$/,
  async ({ page }) => {
    const attendues = [["centaines", "verte"], ["dizaines", "rose"], ["unités", "bleue"]] as const;
    let xPrecedent = -Infinity;
    for (const [rang, couleur] of attendues) {
      await expect(colonne(page, rang)).toHaveAttribute("data-couleur", couleur);
      const boite = await maisonDe(page, rang).boundingBox();
      expect(boite, `la maison des ${rang} est à l'écran`).not.toBeNull();
      expect(boite?.x ?? -Infinity, `la maison des ${rang} est à droite de la précédente`).toBeGreaterThan(xPrecedent);
      xPrecedent = boite?.x ?? Infinity;
    }
  },
);

Then(new RegExp(`^la retenue « (\\d) » en haut de la maison des ${RANG} n'est ni bleue ni verte$`), async ({ page }, retenue: string, rang: string) => {
  const marque = retenueDe(page, rang);
  await expect(marque).toHaveText(retenue);
  const couleur = await marque.getAttribute("data-couleur");
  expect(couleur, "la retenue dit sa couleur").not.toBeNull();
  expect(["bleue", "verte"]).not.toContain(couleur);
});

// Plus large que celle de 98a : les maisons d'une addition se nomment par leur colonne.
Then(/^les maisons (des .+) ont le dessin de l'univers « ([^«»]+) »$/, async ({ page }, liste: string, univers: string) => {
  const rangs = rangsDe(liste);
  for (const rang of rangs) await expect(maisonDe(page, rang)).toHaveAttribute("data-univers", cleDe(univers));
  await expect(page.locator(`[data-testid="maison-de-la-colonne"]:not([data-univers="${cleDe(univers)}"])`)).toHaveCount(0);
});

Then(/^la retenue « (\d) » a le dessin de l'univers « ([^«»]+) »$/, async ({ page }, retenue: string, univers: string) => {
  const marque = page.getByTestId("retenue").filter({ hasText: exactement(retenue) });
  await expect(marque).toHaveCount(1);
  await expect(marque).toHaveAttribute("data-univers", cleDe(univers));
});

// --- Alors : « Je ne sais pas » à l'étape poser, la colonne brille de la même façon dans tous les univers

async function styleDuSignalDeLaColonne(page: Page): Promise<Record<string, string>> {
  const brillante = page.locator('[data-testid="colonne"][data-brille="true"]');
  await expect(brillante).toHaveCount(1);
  const signal = brillante.getByTestId("signal-brille");
  await expect(signal, "le signal « bonne réponse montrée » est un élément de la colonne").toHaveCount(1);
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
  const dans = await styleDuSignalDeLaColonne(page);
  const choisi = chiffresChoisis.get(page);
  if (choisi === undefined) throw new Error("« Je ne sais pas » n'a visé aucun chiffre");
  if (etatDeLaLecon(page).courante === undefined) throw new Error("Aucune leçon en cours");
  await modifierLeProfilEtRechoisir(page, "animaux");
  await expect(page.getByTestId("addition-posee")).toHaveAttribute("data-etape", "poser", { timeout: DELAI_MS });
  await chiffreAPoser(page, choisi).click();
  await page.getByTestId("je-ne-sais-pas").click();
  const reference = await styleDuSignalDeLaColonne(page);
  expect(dans, "même façon de briller que dans l'univers « Animaux de la forêt »").toEqual(reference);
});

// --- Alors : 360 px, cibles de 44 px, mode dys, lecteurs d'écran

Then(/^chaque maison et chaque chiffre à poser mesurent au moins 44 px de haut et de large$/, async ({ page }) => {
  await expect(maisons(page)).toHaveCount(3);
  const cibles = [...(await maisons(page).all()), ...(await chiffresAPoser(page).all())];
  expect(cibles.length).toBeGreaterThan(3);
  for (const cible of cibles) {
    const boite = await cible.boundingBox();
    const nom = ((await cible.textContent()) ?? "").trim();
    expect(boite, `« ${nom} » est à l'écran`).not.toBeNull();
    expect(boite?.width ?? 0, `largeur de « ${nom} »`).toBeGreaterThanOrEqual(44);
    expect(boite?.height ?? 0, `hauteur de « ${nom} »`).toBeGreaterThanOrEqual(44);
  }
});

Then(/^les trois maisons, les chiffres à poser et « Je ne sais pas » se voient sans faire défiler l'écran$/, async ({ page }) => {
  await expect(maisons(page)).toHaveCount(3);
  const largeur = page.viewportSize()?.width ?? 360;
  const elements: Locator[] = [...(await maisons(page).all()), ...(await chiffresAPoser(page).all()), page.getByTestId("je-ne-sais-pas")];
  for (const element of elements) {
    await expect(element).toBeVisible();
    const boite = await element.boundingBox();
    const nom = ((await element.textContent()) ?? "").trim();
    expect(boite, `« ${nom} » est à l'écran`).not.toBeNull();
    expect((boite?.y ?? -1) + (boite?.height ?? 0), `bas de « ${nom} » dans une fenêtre de ${PLUS_GRANDE_HAUTEUR_D_ECRAN} px`).toBeLessThanOrEqual(PLUS_GRANDE_HAUTEUR_D_ECRAN);
    expect(boite?.y ?? -1, `haut de « ${nom} »`).toBeGreaterThanOrEqual(0);
    expect((boite?.x ?? 0) + (boite?.width ?? 0), `droite de « ${nom} »`).toBeLessThanOrEqual(largeur);
  }
  expect(await page.evaluate(() => window.scrollY), "la page n'a pas défilé").toBe(0);
});

Then(/^Léa voit les chiffres à poser et le nom de chaque maison en mode dys : .+$/, async ({ page }) => {
  await expect(page.getByTestId("addition-posee")).toBeVisible({ timeout: DELAI_MS });
  await expect(maisons(page)).toHaveCount(2);
  await verifierModeDys(page, [...(await chiffresAPoser(page).all()), ...(await maisons(page).all())], true);
});

Then(/^Léa voit la retenue « (\d) » en mode dys : police Andika$/, async ({ page }, retenue: string) => {
  const marque = page.getByTestId("retenue").filter({ hasText: exactement(retenue) });
  await expect(marque).toHaveCount(1);
  const lue = await marque.evaluate((element) => ({
    famille: getComputedStyle(element).fontFamily,
    dansUnTrace: element.closest("svg") !== null || element.namespaceURI !== "http://www.w3.org/1999/xhtml",
  }));
  expect(lue.dansUnTrace, "le chiffre de la retenue est un texte, pas un tracé").toBe(false);
  expect(lue.famille).toContain("Andika");
});

Then(/^les lecteurs d'écran annoncent « Colonne des dizaines », « Colonne des unités » et « Retenue 1 »$/, async ({ page }) => {
  await expect(page.getByRole("group", { name: "Colonne des dizaines", exact: true })).toHaveCount(1);
  await expect(page.getByRole("group", { name: "Colonne des unités", exact: true })).toHaveCount(1);
  await expect(page.getByRole("img", { name: "Retenue 1", exact: true })).toHaveCount(1);
});

Then(/^les lecteurs d'écran n'annoncent ni porte, ni toit, ni lumière, ni l'univers du dessin$/, async ({ page }) => {
  for (const identifiant of ["dessin-de-la-maison", "dessin-de-la-retenue"]) {
    const dessins = page.getByTestId(identifiant);
    expect(await dessins.count(), identifiant).toBeGreaterThan(0);
    for (const dessin of await dessins.all()) await expect(dessin).toHaveAttribute("aria-hidden", "true");
  }
  for (const une of await page.getByTestId("colonne").all()) {
    const arbre = (await une.ariaSnapshot()).split("\n").filter((ligne) => !/^\s*- img "Retenue \d+"/.test(ligne)).join("\n");
    expect(arbre, "ce que lisent les lecteurs d'écran").not.toMatch(/porte|toit|lumi[eè]re|univers|dessin|image|img/i);
  }
});

// --- Séance de révision et test de départ : une addition reste un calcul en ligne

const ID_DE_LA_LECON_DU_TEST_DE_DEPART = "e2e-127-test-de-depart";
const TITRE_DE_LA_LECON = "Poser une addition en colonnes";

function additionDeLExercice(page: Page, titreDeLExercice: string): { lecon: LeconBrute; position: number; exercice: Record<string, unknown> } {
  const lecon = leconDeTitre(page, TITRE_DE_LA_LECON);
  const position = positionDeLExercice(lecon, titreDeLExercice);
  return { lecon, position, exercice: lecon.exercices[position] as Record<string, unknown> };
}

function aujourdhui(): { jour: string; hier: Date } {
  const maintenant = new Date();
  const deux = (n: number) => String(n).padStart(2, "0");
  return {
    jour: `${maintenant.getFullYear()}-${deux(maintenant.getMonth() + 1)}-${deux(maintenant.getDate())}`,
    hier: new Date(maintenant.getFullYear(), maintenant.getMonth(), maintenant.getDate() - 1, 9),
  };
}

Given(
  /^Léa a pour question retenue l'addition « ([^«»]+) » de l'exercice « ([^«»]+) », due aujourd'hui$/,
  async ({ famille, page }, addition: string, titreDeLExercice: string) => {
    const { lecon, position } = additionDeLExercice(page, titreDeLExercice);
    // La clé de la question est celle du domaine (cleDeLAddition) : « n: » et l'énoncé, normalisé.
    const cle = `n:${addition.normalize("NFD").replace(/\p{M}/gu, "").toLowerCase().replace(/\s+/g, " ").trim()}`;
    const { jour, hier } = aujourdhui();
    await ecrireLaFileDeRevision(profilDe(famille, "Léa").id, [{
      cle,
      leconDOrigine: lecon.id,
      position,
      type: "calcul",
      intervalle: 1,
      dateDeRevision: jour,
      derniereErreurLe: hier.toISOString(),
    }]);
    // La file du serveur n'est lue qu'une fois par profil : on recharge pour qu'elle soit lue avec cette question.
    await rechargerAvecLeProfilReel(page);
  },
);

Given(/^le test de départ de Léa pose la question de l'addition « ([^«»]+) »$/, async ({ page }, addition: string) => {
  const nombres = addition.split(" + ").map(Number);
  const { lecon, exercice } = additionDeLExercice(page, `La leçon en action : ${addition}`);
  // Une seule leçon, un seul exercice, une seule addition : le test de départ ne peut poser que cette question.
  const deTest: LeconBrute = {
    ...lecon,
    id: ID_DE_LA_LECON_DU_TEST_DE_DEPART,
    exercices: [{ ...exercice, operations: [nombres] }],
  };
  etatDeLaLecon(page).injectees.push(deTest);
  suivreLesLecturesDuResultat(page);
  const servir = (route: Route) => route.fulfill({ json: [deTest] });
  await page.context().route("**/bibliotheque.json", servir);
  await page.route("**/bibliotheque.json", servir);
  await rechargerAvecLeProfilReel(page);
});

// Plus large que celle de 98a : une addition du test de départ s'affiche en calcul en ligne, pas en question à choix.
When(/^Léa arrive à cette question du test de départ$/, async ({ page }) => {
  await ouvrirLaProposition(page);
  await accepterLaProposition(page);
  await expect.poll(async () => {
    if ((await page.getByTestId("question").count()) > 0 || (await page.getByTestId("carte-du-calcul").count()) > 0) return true;
    await terminerLaLecture(page);
    return false;
  }, { intervals: [100], timeout: 15_000 }).toBe(true);
});
