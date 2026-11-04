import { expect, type Locator, type Page } from "@playwright/test";
import { createBdd } from "playwright-bdd";
import { Before, BeforeStep, test } from "./fixtures.ts";
import { bulle, commencerSeulementLExercice, entendu, leconCourante } from "./etapes-puis-exercices.steps.ts";
import { demarrer, questionsReussies } from "./exercices-a-choix.steps.ts";
import {
  atteindreAuClavier,
  elementsDe,
  exerciceEnCours,
  jouerJusquAuxEtiquettes,
  poserEtAttendreLOrdre,
} from "./classer-ordre-trous.steps.ts";
import { centreDe, deplacerLeDoigt, leverLeDoigt, modifierLeProfilEtRechoisir, poserLeDoigt } from "./exercices-comme-des-jeux.steps.ts";
import { poesieJouee } from "./memoriser-une-poesie.steps.ts";
import { depuisLaMarque, fichierDe, noms, observer } from "./retours-animes-et-sonores.steps.ts";
import { verifierModeDys } from "./reglages.steps.ts";
import { estSurUnProfilReel, rechargerAvecLeProfilReel } from "./profil-reel.ts";
import { cleDe, EXPRESSIONS_PAR_PERSONNAGE, FELICITATIONS_COMMUNES, listeDe } from "./univers.steps.ts";
import { normaliser, reappliquerLAppareil, scenario, terminerLaLecture, terminerLaLectureSiCenEstPas, journal } from "./voix.steps.ts";

// Story #130 : le petit train de l'univers (tranche 98a-train). En ordre et dans l'ordre des vers de memoriser, les places
// deviennent les wagons d'un petit train. Les scénarios ne lisent jamais un tracé : tout se lit par des attributs.
//
// Contrat entre ces étapes et l'application :
//   - data-testid="petit-train" : contient la tête (data-testid="tete-du-train") et la liste « Ordre des étiquettes »
//     (data-testid="places") ; ne contient ni les étiquettes à poser ni « Je ne sais pas » ; ni rôle ni nom accessible.
//     data-univers = clé de l'univers ; data-etat = "au-repos" (toujours posé) | "avance" (le cran, 400 ms au plus).
//   - tête : aria-hidden="true", data-univers ; tout autre enfant direct de petit-train hors « places » est aria-hidden.
//   - data-testid="place" (inchangé, un wagon = une place remplie) : data-remplie="true" (inchangé) ; data-univers sur chaque
//     place ; data-etat sur une place remplie = "en-chemin" (l'étiquette rejoint le bout du train, rebond de #97 compris)
//     puis "accroche" puis "au-repos". Une place libre garde « place libre » (texte visuellement caché) et n'a pas de data-etat.
//   - rien dans le petit train ne porte data-brille ; avec les mouvements réduits, data-etat reste "au-repos" partout.
//   - un toucher sur la tête ou un wagon ne fait rien (la tête n'a pas pointer-events: none, elle reçoit le toucher).

const { Given, When, Then } = createBdd(test, { tags: "@issue-130" });

const ETATS_DE_MOUVEMENT = ["en-chemin", "accroche", "avance"];

// --- Les écrans

const train = (page: Page) => page.getByTestId("petit-train");
const tete = (page: Page) => page.getByTestId("tete-du-train");
const places = (page: Page) => page.getByTestId("place");
const wagons = (page: Page) => page.locator('[data-testid="place"][data-remplie="true"]');
const placesLibres = (page: Page) => page.locator('[data-testid="place"]:not([data-remplie="true"])');
const plateau = (page: Page) => page.getByTestId("etiquettes-a-placer");
const etiquetteAPlacer = (page: Page, texte: string) => plateau(page).getByRole("button", { name: texte, exact: true });

function exactement(texte: string): RegExp {
  return new RegExp(`^\\s*${texte.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\s*$`);
}

async function textesDesWagons(page: Page): Promise<string[]> {
  return (await wagons(page).allTextContents()).map(normaliser);
}

// --- Ce que le navigateur voit passer sur le petit train, noté dès le départ

type Passage = { genre: "wagon" | "train"; texte: string; rang: number; etat: string; sons: string[] };
type Boite = { x: number; y: number; largeur: number; hauteur: number };
type Positions = { tete: Boite | null; wagons: Boite[] };

export function installerLEnregistreurDuTrain() {
  type PassageLocal = { genre: "wagon" | "train"; texte: string; rang: number; etat: string; sons: string[] };
  const journalLocal: { passages: PassageLocal[]; marque: number } = { passages: [], marque: 0 };
  Reflect.set(window, "__train130", journalLocal);
  const sons = () => ((Reflect.get(window, "__effets") as { entrees: Array<{ nom: string }> } | undefined)?.entrees ?? []).map((entree) => entree.nom);
  const noter = (element: Element) => {
    const identifiant = element.getAttribute("data-testid");
    const etat = element.getAttribute("data-etat") ?? "";
    if (identifiant === "petit-train") journalLocal.passages.push({ genre: "train", texte: "", rang: -1, etat, sons: sons() });
    if (identifiant === "place" && element.getAttribute("data-remplie") === "true") {
      const rang = [...(element.parentElement?.querySelectorAll(':scope > [data-testid="place"]') ?? [])].indexOf(element);
      const texte = (element.textContent ?? "").replace(/\s+/g, " ").trim();
      journalLocal.passages.push({ genre: "wagon", texte, rang, etat, sons: sons() });
    }
  };
  const SELECTEUR = '[data-testid="place"],[data-testid="petit-train"]';
  new MutationObserver((enregistrements) => {
    for (const enregistrement of enregistrements) {
      if (enregistrement.type === "attributes" && enregistrement.target instanceof Element) noter(enregistrement.target);
      for (const ajoute of enregistrement.addedNodes) {
        if (!(ajoute instanceof Element)) continue;
        noter(ajoute);
        ajoute.querySelectorAll(SELECTEUR).forEach(noter);
      }
    }
  }).observe(document, { subtree: true, childList: true, attributes: true, attributeFilter: ["data-etat", "data-remplie"] });
}

Before({ tags: "@issue-130" }, async ({ page }) => {
  await page.addInitScript(installerLEnregistreurDuTrain);
});

async function passagesDepuisLeGeste(page: Page): Promise<Passage[]> {
  return await page.evaluate(() => {
    const brut = Reflect.get(window, "__train130") as { passages: Passage[]; marque: number } | undefined;
    return brut === undefined ? [] : brut.passages.slice(brut.marque);
  });
}

async function positions(page: Page): Promise<Positions> {
  return await page.evaluate(() => {
    // Relevées depuis le coin du petit train : la parole du personnage guide au-dessus peut grandir sans que le train bouge.
    const origine = document.querySelector('[data-testid="petit-train"]')?.getBoundingClientRect();
    const boite = (element: Element): Boite => {
      const rect = element.getBoundingClientRect();
      return { x: rect.x - (origine?.x ?? 0), y: rect.y - (origine?.y ?? 0), largeur: rect.width, hauteur: rect.height };
    };
    const tete = document.querySelector('[data-testid="tete-du-train"]');
    return {
      tete: tete === null ? null : boite(tete),
      wagons: [...document.querySelectorAll('[data-testid="place"][data-remplie="true"]')].map(boite),
    };
  });
}

function memesBoites(a: Boite | null, b: Boite | null): boolean {
  if (a === null || b === null) return a === b;
  return [a.x - b.x, a.y - b.y, a.largeur - b.largeur, a.hauteur - b.hauteur].every((ecart) => Math.abs(ecart) <= 0.5);
}

const positionsAvant = new WeakMap<Page, Positions>();
const exerciceJoue = new WeakMap<Page, string>();

// Début du geste de l'enfant (le « Quand ») : ce que les « Alors » regardent commence ici.
BeforeStep({ tags: "@issue-130" }, async ({ page, $step }) => {
  const joue = /joue seulement l'exercice « ([^«»]+) »/.exec($step.title);
  if (joue?.[1] !== undefined) exerciceJoue.set(page, joue[1]);
  // Le titre n'a pas le mot-clé : on reconnaît les gestes de l'enfant (les « Quand » de ce .feature).
  if (!/^(Léa (pose|touche|dit|essaie|remet|termine)\b|Léa pose)/.test($step.title)) return;
  // Le geste commence quand les placements précédents ont fini de s'accrocher.
  if (await tete(page).count() > 0) await attendreLeRepos(page);
  await page.evaluate(() => {
    const brut = Reflect.get(window, "__train130") as { passages: unknown[]; marque: number } | undefined;
    if (brut) brut.marque = brut.passages.length;
  });
  if (await tete(page).count() > 0) positionsAvant.set(page, await positions(page));
  else positionsAvant.delete(page);
});

async function attendreLeRepos(page: Page): Promise<void> {
  await expect(train(page)).toHaveAttribute("data-etat", "au-repos");
  await expect(page.locator('[data-testid="place"][data-remplie="true"]:not([data-etat="au-repos"])')).toHaveCount(0);
}

// --- Étant donné

Given(/^Léa a posé les étiquettes de « ([^«»]+) » à « ([^«»]+) »$/, async ({ page }, premiere: string, derniere: string) => {
  await demarrer(page);
  const elements = elementsDe(await exerciceEnCours(page));
  const debut = elements.indexOf(premiere);
  const fin = elements.indexOf(derniere);
  expect(debut >= 0 && fin >= debut, `« ${premiere} » à « ${derniere} » dans ${elements.join(", ")}`).toBe(true);
  for (const element of elements.slice(debut, fin + 1)) await poserEtAttendreLOrdre(page, element);
});

Given(/^Léa a remis en place les (quatre|cinq) premiers vers$/, async ({ page }, nombre: string) => {
  const vers = poesieJouee(page).vers.slice(0, nombre === "quatre" ? 4 : 5);
  for (const [rang, unVers] of vers.entries()) {
    await etiquetteAPlacer(page, unVers).first().click();
    await expect(wagons(page)).toHaveCount(rang + 1);
    // Une enfant patiente : la relance du vers posé est dite en entier avant le suivant.
    await terminerLaLecture(page);
  }
});

Given(/^Léa a répondu faux (\d+) fois à la première question$/, async ({ page }, fois: string) => {
  await demarrer(page);
  const mauvaise = elementsDe(await exerciceEnCours(page))[1] ?? "";
  for (let i = 0; i < Number(fois); i++) {
    const paroles = (await journal(page)).speaks;
    await etiquetteAPlacer(page, mauvaise).first().click();
    await expect.poll(async () => (await journal(page)).speaks).toBeGreaterThan(paroles);
    await terminerLaLecture(page);
  }
});

// Le Muet de l'appareil : le profil de Léa est déjà ouvert (Contexte), on recharge l'application pour que le réglage s'applique.
Given(/^la tablette est en Muet$/, async ({ page }) => {
  scenario(page).muet = true;
  await reappliquerLAppareil(page);
  if (!estSurUnProfilReel(page)) return;
  await page.evaluate(() => localStorage.setItem("savanturier:son", "muet"));
  await rechargerAvecLeProfilReel(page);
});

// --- Quand

async function poserAuGeste(page: Page, etiquette: string, geste: string, nombreAvant: number) {
  const bouton = etiquetteAPlacer(page, etiquette).first();
  if (geste === "au clavier seulement") {
    await atteindreAuClavier(page, { testid: "etiquette", texte: etiquette });
    await page.keyboard.press("Enter");
  } else {
    await bouton.tap();
  }
  await expect(wagons(page)).toHaveCount(nombreAvant + 1);
}

When(/^Léa pose les étiquettes (.+) (du doigt|au clavier seulement)$/, async ({ page }, liste: string, geste: string) => {
  await demarrer(page);
  for (const [rang, etiquette] of listeDe(liste).entries()) await poserAuGeste(page, etiquette, geste, rang);
});

When(/^Léa remet les (\d+) vers dans l'ordre (du doigt|au clavier seulement)$/, async ({ page }, nombre: string, geste: string) => {
  const vers = poesieJouee(page).vers;
  expect(vers).toHaveLength(Number(nombre));
  for (const [rang, unVers] of vers.entries()) {
    if (rang < vers.length - 1) {
      await poserAuGeste(page, unVers, geste, rang);
      await terminerLaLecture(page);
    } else if (geste === "au clavier seulement") {
      await atteindreAuClavier(page, { testid: "etiquette", texte: unVers });
      await page.keyboard.press("Enter");
    } else await etiquetteAPlacer(page, unVers).first().tap();
  }
});

When(/^Léa pose le vers « ([^«»]+) »$/, async ({ page }, vers: string) => {
  await etiquetteAPlacer(page, vers).first().click();
});

When(/^Léa termine l'exercice sans autre erreur$/, async ({ page }) => {
  await demarrer(page);
  const elements = elementsDe(await exerciceEnCours(page));
  const dejaPosees = await wagons(page).count();
  for (const [rang, element] of elements.slice(dejaPosees).entries()) {
    if (dejaPosees + rang < elements.length - 1) await poserEtAttendreLOrdre(page, element);
    else await etiquetteAPlacer(page, element).first().click();
  }
});

When(/^Léa essaie de faire glisser du doigt l'étiquette « ([^«»]+) » jusqu'au petit train$/, async ({ page }, etiquette: string) => {
  await demarrer(page);
  const depart = await centreDe(page, etiquetteAPlacer(page, etiquette).first(), `l'étiquette « ${etiquette} »`);
  const arrivee = await centreDe(page, train(page), "le petit train");
  await poserLeDoigt(page, depart);
  await deplacerLeDoigt(page, arrivee);
  await leverLeDoigt(page);
});

async function toucherLaTete(page: Page): Promise<void> {
  await expect(tete(page)).toBeVisible();
  const boite = await tete(page).boundingBox();
  if (boite === null) throw new Error("La tête du petit train n'est pas à l'écran");
  await page.mouse.click(boite.x + boite.width / 2, boite.y + boite.height / 2);
}

When(/^Léa touche le petit train$/, async ({ page }) => {
  await toucherLaTete(page);
});

When(/^Léa touche le petit train pendant la félicitation$/, async ({ page }) => {
  await expect(bulle(page)).toHaveAttribute("data-nature", "felicitation");
  await toucherLaTete(page);
});

// --- Alors : le petit train au début, ses wagons

Then(/^Léa voit le petit train, sans aucun wagon, suivi de (\d+) places libres$/, async ({ page }, nombre: string) => {
  await jouerJusquAuxEtiquettes(page);
  await expect(train(page)).toBeVisible();
  await expect(tete(page)).toBeVisible();
  await expect(wagons(page)).toHaveCount(0);
  await expect(placesLibres(page)).toHaveCount(Number(nombre));
  for (const libre of await placesLibres(page).all()) await expect(libre).toHaveText("place libre");
  const teteAvantLesPlaces = await tete(page).evaluate((element) => {
    const premiere = document.querySelector('[data-testid="place"]');
    return premiere !== null && Boolean(element.compareDocumentPosition(premiere) & Node.DOCUMENT_POSITION_FOLLOWING);
  });
  expect(teteAvantLesPlaces, "la tête vient avant les places").toBe(true);
});

Then(/^le petit train n'a aucun wagon$/, async ({ page }) => {
  await expect(train(page)).toBeVisible();
  await expect(wagons(page)).toHaveCount(0);
});

async function verifierLesWagons(page: Page, attendus: string[]): Promise<void> {
  await expect(wagons(page)).toHaveCount(attendus.length);
  expect(await textesDesWagons(page)).toEqual(attendus);
}

Then(/^le petit train a (\d+) wagons, ((?:« [^«»]+ »(?:, | puis ))+« [^«»]+ »)$/, async ({ page }, nombre: string, liste: string) => {
  const attendus = listeDe(liste);
  expect(attendus).toHaveLength(Number(nombre));
  await verifierLesWagons(page, attendus);
});

Then(/^le petit train a (\d+) wagons, de « ([^«»]+) » à « ([^«»]+) »$/, async ({ page }, nombre: string, premier: string, dernier: string) => {
  const vers = poesieJouee(page).vers;
  const attendus = vers.slice(vers.indexOf(premier), vers.indexOf(dernier) + 1);
  expect(attendus).toHaveLength(Number(nombre));
  await verifierLesWagons(page, attendus);
});

Then(/^le petit train a toujours (\d+) wagons?, ((?:« [^«»]+ »(?:, | puis ))*« [^«»]+ »)$/, async ({ page }, nombre: string, liste: string) => {
  const attendus = listeDe(liste);
  expect(attendus).toHaveLength(Number(nombre));
  await verifierLesWagons(page, attendus);
});

// --- Alors : l'accroche et le cran d'avance

const RANGS: Readonly<Record<string, number>> = { premier: 1, deuxième: 2 };

Then(/^le petit train avance d'un cran, avec « ([^«»]+) » dans le (premier|deuxième) wagon$/, async ({ page }, texte: string, rang: string) => {
  const place = RANGS[rang] ?? 1;
  await expect(places(page).nth(place - 1)).toHaveAttribute("data-remplie", "true");
  await expect(places(page).nth(place - 1)).toHaveText(texte);
  await expect.poll(async () => (await passagesDepuisLeGeste(page)).some((p) => p.genre === "train" && p.etat === "avance"), {
    message: "le petit train avance d'un cran",
  }).toBe(true);
  await expect.poll(async () => (await passagesDepuisLeGeste(page)).some((p) => p.genre === "wagon" && p.rang === place - 1 && p.etat === "accroche")).toBe(true);
});

Then(/^ensuite, la tête du petit train et le wagon « ([^«»]+) » sont à la même place qu'avant$/, async ({ page }, texte: string) => {
  await attendreLeRepos(page);
  const avant = positionsAvant.get(page);
  if (avant === undefined) throw new Error("La position du petit train avant le placement n'a pas été notée");
  const apres = await positions(page);
  const rang = (await textesDesWagons(page)).indexOf(texte);
  expect(rang, `le wagon « ${texte} » est accroché`).toBeGreaterThanOrEqual(0);
  expect(memesBoites(avant.tete, apres.tete), `la tête : ${JSON.stringify(avant.tete)} puis ${JSON.stringify(apres.tete)}`).toBe(true);
  expect(memesBoites(avant.wagons[rang] ?? null, apres.wagons[rang] ?? null), `le wagon « ${texte} »`).toBe(true);
});

Then(/^l'étiquette « ([^«»]+) » rejoint le bout du petit train, puis s'y accroche comme premier wagon$/, async ({ page }, texte: string) => {
  await expect.poll(async () => {
    const etats = (await passagesDepuisLeGeste(page)).filter((p) => p.genre === "wagon" && p.rang === 0 && p.texte === texte).map((p) => p.etat);
    const chemin = etats.indexOf("en-chemin");
    return chemin >= 0 && etats.indexOf("accroche", chemin) > chemin;
  }, { message: "l'étiquette rejoint le bout du petit train, puis s'accroche" }).toBe(true);
  await expect(places(page).first()).toHaveText(texte);
});

Then(/^l'étiquette « ([^«»]+) » n'est plus parmi les étiquettes à poser$/, async ({ page }, texte: string) => {
  await expect(wagons(page).first()).toBeVisible();
  await expect(etiquetteAPlacer(page, texte)).toHaveCount(0);
});

Then(/^l'effet sonore « réponse juste » commence avant que le wagon « ([^«»]+) » s'accroche$/, async ({ page }, texte: string) => {
  await expect.poll(async () => (await passagesDepuisLeGeste(page)).some((p) => p.genre === "wagon" && p.texte === texte && p.etat === "accroche")).toBe(true);
  const accroche = (await passagesDepuisLeGeste(page)).find((p) => p.genre === "wagon" && p.texte === texte && p.etat === "accroche");
  const sonsDejaJoues = accroche?.sons ?? [];
  const effets = noms(depuisLaMarque(await observer(page)));
  const rangDuSon = effets.indexOf(fichierDe("réponse juste"));
  expect(rangDuSon, "l'effet sonore « réponse juste » a été joué").toBeGreaterThanOrEqual(0);
  const depuisLaMarqueAvantLAccroche = sonsDejaJoues.length - (await observer(page)).marque;
  expect(rangDuSon, `l'effet sonore commence avant l'accroche (déjà joués : ${sonsDejaJoues.join(", ")})`).toBeLessThan(depuisLaMarqueAvantLAccroche);
});

Then(/^ensuite, plus rien ne bouge sur le petit train tant que Léa ne pose pas d'autre étiquette$/, async ({ page }) => {
  await attendreLeRepos(page);
  const bilan = await page.evaluate(async () => {
    const racine = document.querySelector('[data-testid="petit-train"]');
    if (racine === null) return null;
    let mutations = 0;
    const observateur = new MutationObserver((liste) => {
      mutations += liste.length;
    });
    observateur.observe(racine, { subtree: true, childList: true, attributes: true, characterData: true });
    const boites = () => [racine, ...racine.querySelectorAll("*")].map((element) => JSON.stringify(element.getBoundingClientRect()));
    const avant = boites();
    const enCours = () => racine.getAnimations({ subtree: true }).filter((animation) => animation.playState === "running").length;
    let animationsEnCours = enCours();
    for (let image = 0; image < 30; image++) {
      await new Promise<void>((fait) => requestAnimationFrame(() => fait()));
      animationsEnCours = Math.max(animationsEnCours, enCours());
    }
    observateur.disconnect();
    return { mutations, animationsEnCours, deplace: JSON.stringify(avant) !== JSON.stringify(boites()) };
  });
  expect(bilan, "le petit train est à l'écran").not.toBeNull();
  expect(bilan?.animationsEnCours, "animations en cours sur le petit train").toBe(0);
  expect(bilan?.mutations, "changements sur le petit train").toBe(0);
  expect(bilan?.deplace, "le petit train a bougé").toBe(false);
});

Then(/^le petit train ne bouge pas$/, async ({ page }) => {
  await expect(train(page)).toHaveAttribute("data-etat", "au-repos");
  const mouvements = (await passagesDepuisLeGeste(page)).filter((p) => ETATS_DE_MOUVEMENT.includes(p.etat));
  expect(mouvements, "aucun wagon ne s'accroche, le train n'avance pas").toEqual([]);
  const avant = positionsAvant.get(page);
  if (avant === undefined) throw new Error("La position du petit train avant le placement n'a pas été notée");
  const apres = await positions(page);
  expect(apres.wagons.length, "aucun wagon de plus ni de moins").toBe(avant.wagons.length);
  expect(memesBoites(avant.tete, apres.tete), `la tête : ${JSON.stringify(avant.tete)} puis ${JSON.stringify(apres.tete)}`).toBe(true);
  for (const [rang, boite] of avant.wagons.entries()) expect(memesBoites(boite, apres.wagons[rang] ?? null), `le wagon ${rang + 1}`).toBe(true);
});

Then(/^Léa n'entend aucun autre effet sonore pendant que le petit train avance$/, async ({ page }) => {
  await expect.poll(async () => (await passagesDepuisLeGeste(page)).some((p) => p.genre === "train" && p.etat === "avance")).toBe(true);
  await attendreLeRepos(page);
  // Aucun fichier nouveau : seuls les retours de #97 d'une bonne réponse (l'effet et le point qui rejoint le récipient) ont joué.
  const permis = [fichierDe("réponse juste"), fichierDe("point du récipient"), fichierDe("bouton touché")];
  const autres = noms(depuisLaMarque(await observer(page))).filter((nom) => !permis.includes(nom));
  expect(autres, "effets sonores autres que ceux de #97 pour une bonne réponse").toEqual([]);
});

Then(/^Noisette dit une félicitation commune ou l'une de ses expressions, en entier$/, async ({ page }) => {
  await expect(bulle(page)).toHaveAttribute("data-nature", "felicitation");
  const texte = normaliser((await bulle(page).textContent()) ?? "");
  expect([...FELICITATIONS_COMMUNES, ...(EXPRESSIONS_PAR_PERSONNAGE["Noisette"] ?? [])]).toContain(texte);
  // La consigne finit d'abord (la fausse voix ne finit rien seule), puis la félicitation est dite en entier.
  await expect.poll(() => terminerLaLectureSiCenEstPas(page, entendu(texte)), { intervals: [100] }).toBe(true);
  expect((await journal(page)).coupeApresLaDerniereParole).toBe(false);
});

// --- Alors : l'ordre des vers

Then(/^le vers « ([^«»]+) » devient le premier wagon du petit train$/, async ({ page }, vers: string) => {
  await expect(places(page).first()).toHaveAttribute("data-remplie", "true");
  await expect(places(page).first()).toHaveText(vers);
});

Then(/^le vers se lit en entier dans son wagon$/, async ({ page }) => {
  await verifierQueLeTexteSeLitEnEntier(page, wagons(page));
});

Then(/^Léa voit le petit train de (\d+) wagons pendant que Noisette dit une félicitation$/, async ({ page }, nombre: string) => {
  await expect(bulle(page)).toHaveAttribute("data-nature", "felicitation");
  await expect(wagons(page)).toHaveCount(Number(nombre));
  await expect(tete(page)).toBeVisible();
  await expect(page.getByTestId("texte-a-trous")).toHaveCount(0);
});

Then(/^ensuite seulement, Léa voit les vers joints par « \/ », avec un trou dans chaque vers$/, async ({ page }) => {
  await expectJointsParLesTrous(page);
});

Then(/^Léa voit les vers joints par « \/ », avec un trou dans chaque vers$/, async ({ page }) => {
  await expectJointsParLesTrous(page);
});

// Le petit train reste à l'écran pendant la félicitation : l'entraînement des mots cachés n'apparaît qu'après sa fin.
async function expectJointsParLesTrous(page: Page): Promise<void> {
  const texteATrous = page.getByTestId("texte-a-trous");
  await expect.poll(async () => {
    if (await texteATrous.isVisible()) return true;
    await terminerLaLecture(page);
    return false;
  }, { intervals: [100], timeout: 20_000 }).toBe(true);
  const vers = poesieJouee(page).vers;
  await expect(page.getByTestId("trou")).toHaveCount(vers.length);
  await expect(texteATrous).toContainText(" / ");
}

// --- Alors : « Je ne sais pas » et ce qui brille

Then(/^l'étiquette « ([^«»]+) » brille parmi les étiquettes à poser$/, async ({ page }, texte: string) => {
  await verifierQueSeuleBrille(page, texte);
});

Then(/^le vers « ([^«»]+) » brille parmi les vers à poser$/, async ({ page }, vers: string) => {
  await verifierQueSeuleBrille(page, vers);
});

async function verifierQueSeuleBrille(page: Page, texte: string): Promise<void> {
  const brillantes = plateau(page).locator('[data-testid="etiquette"][data-brille="true"]');
  await expect(brillantes).toHaveCount(1);
  await expect(brillantes).toHaveText(exactement(texte));
}

Then(/^rien ne brille sur le petit train$/, async ({ page }) => {
  await expect(train(page)).toBeVisible();
  await expect(train(page)).not.toHaveAttribute("data-brille", "true");
  await expect(train(page).locator('[data-brille="true"]')).toHaveCount(0);
});

Then(/^plus aucune étiquette ne brille$/, async ({ page }) => {
  await expect(wagons(page).first()).toBeVisible();
  await expect(page.locator('[data-testid="etiquette"][data-brille="true"]')).toHaveCount(0);
});

Then(/^Léa doit encore donner elle-même la bonne réponse$/, async ({ page }) => {
  const exercice = await exerciceEnCours(page);
  expect(await questionsReussies(page)).toBe(0);
  const attendues = exercice.type === "memoriser" ? poesieJouee(page).vers.length : elementsDe(exercice).length;
  await expect(page.getByTestId("etiquette")).toHaveCount(attendues);
  await expect(wagons(page)).toHaveCount(0);
  await expect(page.getByTestId("je-ne-sais-pas")).toHaveCount(0);
});

/** Ce qui rend « bonne réponse montrée » reconnaissable, sans les couleurs (elles viennent de l'univers) ni les valeurs qui changent à chaque image. */
async function signalDeLEtiquette(page: Page): Promise<Record<string, string>> {
  const signal = plateau(page).locator('[data-testid="etiquette"][data-brille="true"]');
  await expect(signal).toHaveCount(1);
  return await signal.evaluate((element) => {
    const style = getComputedStyle(element);
    return {
      balise: element.tagName,
      animationName: style.animationName,
      animationDuration: style.animationDuration,
      animationIterationCount: style.animationIterationCount,
      animationTimingFunction: style.animationTimingFunction,
      outlineStyle: style.outlineStyle,
      outlineWidth: style.outlineWidth,
      borderStyle: style.borderStyle,
      borderWidth: style.borderWidth,
    };
  });
}

Then(/^elle brille de la même façon que dans l'univers « Animaux de la forêt »$/, async ({ page }) => {
  const dans = await signalDeLEtiquette(page);
  const titre = exerciceJoue.get(page);
  if (titre === undefined) throw new Error("Aucun exercice joué");
  await modifierLeProfilEtRechoisir(page, "animaux");
  await page.goto(`/lecon/${encodeURIComponent(leconCourante(page).id)}`);
  await commencerSeulementLExercice(page, titre);
  await jouerJusquAuxEtiquettes(page);
  await page.getByTestId("je-ne-sais-pas").click();
  expect(dans, "même façon de briller que dans l'univers « Animaux de la forêt »").toEqual(await signalDeLEtiquette(page));
});

// --- Alors : 360 px

Then(/^chaque wagon mesure au moins 44 px de haut et de large$/, async ({ page }) => {
  const tous = await wagons(page).all();
  expect(tous.length).toBeGreaterThan(0);
  for (const wagon of tous) {
    const boite = await wagon.boundingBox();
    const nom = (await wagon.textContent())?.trim();
    expect(boite, `wagon « ${nom} » visible`).not.toBeNull();
    expect(boite?.width ?? 0, `largeur du wagon « ${nom} »`).toBeGreaterThanOrEqual(44);
    expect(boite?.height ?? 0, `hauteur du wagon « ${nom} »`).toBeGreaterThanOrEqual(44);
  }
});

const MEME_LIGNE_PX = 8;

async function lignesDesWagons(page: Page): Promise<Array<{ texte: string; ligne: number; x: number }>> {
  const mesures = await wagons(page).evaluateAll((elements) =>
    elements.map((element) => {
      const rect = element.getBoundingClientRect();
      return { texte: (element.textContent ?? "").replace(/\s+/g, " ").trim(), haut: rect.top + window.scrollY, x: rect.left };
    })
  );
  const lignes: number[] = [];
  return mesures.map((mesure) => {
    let ligne = lignes.findIndex((haut) => Math.abs(haut - mesure.haut) <= MEME_LIGNE_PX);
    if (ligne < 0) ligne = lignes.push(mesure.haut) - 1;
    return { texte: mesure.texte, ligne, x: mesure.x };
  });
}

Then(/^le petit train passe à la ligne$/, async ({ page }) => {
  await expect(wagons(page).first()).toBeVisible();
  expect(new Set((await lignesDesWagons(page)).map((wagon) => wagon.ligne)).size, "lignes du petit train").toBeGreaterThanOrEqual(2);
});

Then(
  /^ses (\d+) wagons se lisent dans l'ordre, de « ([^«»]+) » à « ([^«»]+) », de gauche à droite puis ligne après ligne$/,
  async ({ page }, nombre: string, premier: string, dernier: string) => {
    await expect(wagons(page)).toHaveCount(Number(nombre));
    const wagonsVus = await lignesDesWagons(page);
    const elements = elementsDe(await exerciceEnCours(page));
    expect(wagonsVus.map((wagon) => wagon.texte)).toEqual(elements.slice(elements.indexOf(premier), elements.indexOf(dernier) + 1));
    const visuel = [...wagonsVus].sort((a, b) => a.ligne - b.ligne || a.x - b.x).map((wagon) => wagon.texte);
    expect(visuel, "ordre de lecture à l'écran (ligne après ligne, de gauche à droite)").toEqual(wagonsVus.map((wagon) => wagon.texte));
  },
);

async function verifierQueLeTexteSeLitEnEntier(page: Page, cibles: Locator): Promise<void> {
  await expect(cibles.first()).toBeVisible();
  await attendreLeRepos(page);
  const coupes = await cibles.evaluateAll((elements) =>
    elements.flatMap((element) => {
      const boite = element.getBoundingClientRect();
      const noeuds = document.createTreeWalker(element, NodeFilter.SHOW_TEXT);
      const problemes: string[] = [];
      if (element.scrollWidth > element.clientWidth + 1) problemes.push("défile en largeur");
      if (element.scrollHeight > element.clientHeight + 1) problemes.push("défile en hauteur");
      for (let noeud = noeuds.nextNode(); noeud !== null; noeud = noeuds.nextNode()) {
        if ((noeud.textContent ?? "").trim() === "") continue;
        const parent = noeud.parentElement;
        if (parent !== null && getComputedStyle(parent).textOverflow === "ellipsis") problemes.push("points de suspension");
        const plage = document.createRange();
        plage.selectNodeContents(noeud);
        for (const rect of plage.getClientRects()) {
          if (rect.left < boite.left - 1 || rect.right > boite.right + 1 || rect.top < boite.top - 1 || rect.bottom > boite.bottom + 1) {
            problemes.push(`texte hors du wagon (texte ${Math.round(rect.left)}-${Math.round(rect.right)} / ${Math.round(rect.top)}-${Math.round(rect.bottom)}, wagon ${Math.round(boite.left)}-${Math.round(boite.right)} / ${Math.round(boite.top)}-${Math.round(boite.bottom)})`);
            break;
          }
        }
      }
      return problemes.length === 0 ? [] : [`« ${(element.textContent ?? "").trim()} » : ${problemes.join(", ")}`];
    })
  );
  expect(coupes, "texte coupé ou masqué").toEqual([]);
}

Then(/^chaque vers posé se lit en entier, dans un wagon sur toute la largeur du petit train$/, async ({ page }) => {
  const vers = poesieJouee(page).vers;
  const posees = await textesDesWagons(page);
  expect(posees.length).toBeGreaterThan(0);
  expect(posees).toEqual(vers.slice(0, posees.length));
  await verifierQueLeTexteSeLitEnEntier(page, wagons(page));
  const liste = await page.getByTestId("places").boundingBox();
  expect(liste, "la liste des places est à l'écran").not.toBeNull();
  for (const wagon of await wagons(page).all()) {
    const boite = await wagon.boundingBox();
    expect(Math.abs((boite?.width ?? 0) - (liste?.width ?? 0)), `largeur du wagon « ${(await wagon.textContent())?.trim()} » et de la liste`).toBeLessThanOrEqual(2);
  }
});

Then(/^le petit train, les étiquettes à poser et « Je ne sais pas » se voient sans faire défiler l'écran de côté$/, async ({ page }) => {
  const largeur = page.viewportSize()?.width ?? 0;
  for (const [nom, cible] of [["le petit train", train(page)], ["les étiquettes à poser", plateau(page)], ["« Je ne sais pas »", page.getByTestId("je-ne-sais-pas")]] as const) {
    await expect(cible, nom).toBeVisible();
    const boite = await cible.boundingBox();
    expect(boite?.x ?? -1, `${nom} : bord gauche`).toBeGreaterThanOrEqual(0);
    expect((boite?.x ?? 0) + (boite?.width ?? 0), `${nom} : bord droit`).toBeLessThanOrEqual(largeur);
  }
});

// --- Alors : mouvements réduits

async function verifierQueRienNeRoule(page: Page): Promise<void> {
  await expect(train(page)).toHaveAttribute("data-etat", "au-repos");
  const elements = [train(page), tete(page), ...(await wagons(page).all())];
  for (const element of elements) {
    await expect(element).toHaveCSS("animation-name", "none");
    await expect(element).toHaveCSS("transition-duration", "0s");
  }
  const animations = await train(page).evaluate((racine) => racine.getAnimations({ subtree: true }).length);
  expect(animations, "animations sur le petit train").toBe(0);
  const mouvements = (await passagesDepuisLeGeste(page)).filter((p) => ETATS_DE_MOUVEMENT.includes(p.etat));
  expect(mouvements, "le petit train ne roule pas, le wagon est là d'un coup").toEqual([]);
}

Then(/^« ([^«»]+) » apparaît dans le premier wagon, sans que le petit train roule$/, async ({ page }, texte: string) => {
  await expect(places(page).first()).toHaveAttribute("data-remplie", "true");
  await expect(places(page).first()).toHaveText(texte);
  await verifierQueRienNeRoule(page);
});

Then(/^ni l'étiquette « ([^«»]+) » ni le petit train ne bougent$/, async ({ page }, texte: string) => {
  const brillante = plateau(page).locator('[data-testid="etiquette"][data-brille="true"]').filter({ hasText: exactement(texte) });
  await expect(brillante).toHaveCount(1);
  await expect(brillante).toHaveCSS("animation-name", "none");
  await expect(brillante).toHaveCSS("transition-duration", "0s");
  expect(await brillante.evaluate((element) => element.getAnimations().length), "animations sur l'étiquette").toBe(0);
  await expect(train(page)).toBeVisible();
  for (const element of [train(page), tete(page)]) {
    await expect(element).toHaveCSS("animation-name", "none");
    await expect(element).toHaveCSS("transition-duration", "0s");
  }
  expect(await train(page).evaluate((racine) => racine.getAnimations({ subtree: true }).length), "animations sur le petit train").toBe(0);
});

// --- Alors : contraste, mode dys, lecteurs d'écran

Then(/^le texte de chaque wagon se détache de son wagon avec un contraste d'au moins 4,5:1$/, async ({ page }) => {
  await expect(wagons(page).first()).toBeVisible();
  const bilans = await wagons(page).evaluateAll((elements) => {
    type Couleur = [number, number, number];
    const lire = (valeur: string): { couleur: Couleur; alpha: number } => {
      const m = /rgba?\(([^)]+)\)/.exec(valeur);
      const [r = 0, g = 0, b = 0, a = 1] = (m?.[1] ?? "0,0,0,0").split(/[ ,/]+/).filter(Boolean).map(Number);
      return { couleur: [r, g, b], alpha: a };
    };
    const luminance = ([r, g, b]: Couleur) => {
      const [lr = 0, lg = 0, lb = 0] = [r, g, b].map((c) => {
        const s = c / 255;
        return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
      });
      return 0.2126 * lr + 0.7152 * lg + 0.0722 * lb;
    };
    const fondDe = (depart: Element): { couleur: Couleur; uni: boolean } => {
      const chaine: Element[] = [];
      for (let element: Element | null = depart; element !== null; element = element.parentElement) chaine.push(element);
      let couleur: Couleur = [255, 255, 255];
      let uni = true;
      for (const element of chaine.reverse()) {
        const style = getComputedStyle(element);
        const { couleur: fond, alpha } = lire(style.backgroundColor);
        couleur = couleur.map((c, i) => Math.round(c * (1 - alpha) + (fond[i] ?? 0) * alpha)) as Couleur;
        if (element.contains(depart) && style.backgroundImage !== "none") uni = false;
      }
      return { couleur, uni };
    };
    return elements.flatMap((wagon) => {
      const noeuds = document.createTreeWalker(wagon, NodeFilter.SHOW_TEXT);
      const rapports: string[] = [];
      for (let noeud = noeuds.nextNode(); noeud !== null; noeud = noeuds.nextNode()) {
        if ((noeud.textContent ?? "").trim() === "") continue;
        const plage = document.createRange();
        plage.selectNodeContents(noeud);
        const rect = plage.getBoundingClientRect();
        const dessous = document.elementFromPoint(rect.left + rect.width / 2, rect.top + rect.height / 2) ?? wagon;
        const fond = fondDe(dessous);
        const texte = lire(getComputedStyle(noeud.parentElement ?? wagon).color).couleur;
        const [clair, sombre] = [luminance(texte), luminance(fond.couleur)].sort((a, b) => b - a);
        const rapport = ((clair ?? 0) + 0.05) / ((sombre ?? 0) + 0.05);
        if (rapport < 4.5 || !fond.uni) rapports.push(`« ${(noeud.textContent ?? "").trim()} » : ${rapport.toFixed(2)}:1${fond.uni ? "" : " (fond non uni)"}`);
      }
      return rapports;
    });
  });
  expect(bilans, "texte des wagons sous 4,5:1").toEqual([]);
});

Then(/^Léa voit les étiquettes à poser et le texte des wagons en mode dys : .+$/, async ({ page }) => {
  await expect(wagons(page).first()).toBeVisible();
  await verifierModeDys(page, [...(await page.getByTestId("etiquette").all()), ...(await wagons(page).all())], true);
});

Then(/^Léa voit les vers posés en mode dys : .+$/, async ({ page }) => {
  await expect(wagons(page).first()).toBeVisible();
  await verifierModeDys(page, await wagons(page).all(), true);
});

Then(
  /^les lecteurs d'écran lisent la liste « ([^«»]+) » : « ([^«»]+) », puis (\d+) fois « ([^«»]+) »$/,
  async ({ page }, nomDeLaListe: string, premiere: string, fois: string, libre: string) => {
    const liste = page.getByRole("list", { name: nomDeLaListe, exact: true });
    await expect(liste).toHaveCount(1);
    const elements = liste.getByRole("listitem");
    const attendus = [premiere, ...Array<string>(Number(fois)).fill(libre)];
    await expect(elements).toHaveCount(attendus.length);
    expect((await elements.allTextContents()).map(normaliser)).toEqual(attendus);
  },
);

Then(/^les lecteurs d'écran n'annoncent ni la tête du petit train, ni ses roues, ni son décor, ni l'univers du dessin$/, async ({ page }) => {
  await expect(tete(page)).toHaveAttribute("aria-hidden", "true");
  const autres = await train(page).evaluate((racine) =>
    [...racine.children].filter((enfant) => enfant.getAttribute("data-testid") !== "places").map((enfant) => enfant.getAttribute("aria-hidden"))
  );
  for (const cache of autres) expect(cache, "chaque élément du petit train hors de la liste est caché aux lecteurs d'écran").toBe("true");
  const arbre = await train(page).ariaSnapshot();
  expect(arbre, "ce que lisent les lecteurs d'écran").not.toMatch(/train|tête|roue|décor|locomotive|wagon|univers|dessin|image|img/i);
});

// --- Alors : le dessin de l'univers

Then(/^la tête du petit train et ses wagons ont le dessin de l'univers « ([^«»]+) »$/, async ({ page }, univers: string) => {
  const cle = cleDe(univers);
  await expect(tete(page)).toBeVisible();
  await expect(tete(page)).toHaveAttribute("data-univers", cle);
  await expect(train(page)).toHaveAttribute("data-univers", cle);
  await expect(wagons(page).first()).toBeVisible();
  for (const wagon of await wagons(page).all()) await expect(wagon).toHaveAttribute("data-univers", cle);
});
