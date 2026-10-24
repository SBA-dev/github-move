import { expect, type Locator, type Page } from "@playwright/test";
import { Given, Then, When } from "./fixtures.ts";
import { bulle, etat, injecter, type LeconBrute, leconDeTest, leconDeTitre, toutesLesParoles } from "./etapes-puis-exercices.steps.ts";
import {
  allerALaQuestion,
  avancerJusquAuxChoix,
  demarrageDeLExercice,
  demarrer,
  etatDesChoix,
  finirLaParoleJusqua,
  leconDeLExercice,
  textesDesChoix,
} from "./exercices-a-choix.steps.ts";
import { reglagesPrevus } from "../support/reglages-prevus.ts";
import { journal, normaliser, terminerLaLecture } from "./voix.steps.ts";

// Story #19 : dictée et conjugaison.
// Léa joue comme une enfant : elle touche les touches du clavier de la dictée (ou tape au clavier d'un ordinateur) et
// les bulles de la conjugaison. Les intruses du clavier et les formes proposées sont tirées au hasard par l'application :
// quand un scénario a besoin d'une lettre ou d'une forme précise, on donne au tirage les nombres qui l'amènent
// (même mécanisme que les choix de #17 : voir exercices-a-choix.steps.ts).

const EXERCICE_DE_TEST = "Exercice";
const RYTHME_PLUS_LENT = 0.65;
const LETTRES_INTRUSES_POSSIBLES = [..."aeioulnrstcmpbdvé"];
const TOUCHES_PAR_MOT = 8;
const CARACTERES_DEJA_ECRITS = [..." '’-.,"];

// --- État du scénario

type EtatDeLaDictee = { mot: string | undefined; paroles: number; rythmeNormal: number | undefined };
const etats = new WeakMap<Page, EtatDeLaDictee>();

function etatDeLaDictee(page: Page): EtatDeLaDictee {
  let courant = etats.get(page);
  if (!courant) {
    courant = { mot: undefined, paroles: 0, rythmeNormal: undefined };
    etats.set(page, courant);
  }
  return courant;
}

// --- Leçons de test

export function leconDeDicteeDeTest(mot: string): LeconBrute {
  return leconDeTest(`test-dictee-${mot}`, `Leçon de test dictée ${mot}`, [
    { type: "dictee", titre: EXERCICE_DE_TEST, mots: [{ mot }] },
  ]);
}

export function leconDeConjugaisonDeTest(): LeconBrute {
  return leconDeTest("test-conjugaison", "Leçon de test conjugaison", [{
    type: "conjugaison",
    titre: EXERCICE_DE_TEST,
    verbe: "être",
    temps: "présent",
    formes: [{ pronom: "je", forme: "suis" }, { pronom: "tu", forme: "es" }, { pronom: "il", forme: "est" }],
  }]);
}

function motsDe(lecon: LeconBrute): string[] {
  return lecon.exercices.flatMap((exercice) =>
    exercice.type === "dictee" ? (exercice.mots as Array<{ mot: string }>).map(({ mot }) => mot) : []
  );
}

function leconDeDicteeDuMot(page: Page, mot: string): LeconBrute {
  const connue = [...etat(page).injectees].find((lecon) => motsDe(lecon).includes(mot));
  if (connue) return connue;
  const lecon = leconDeDicteeDeTest(mot);
  etat(page).injectees.push(lecon);
  return lecon;
}

// --- Tirage forgé : les nombres qui donnent l'ordre voulu à un mélange de Fisher-Yates (du dernier rang au deuxième)

function nombresPourObtenir(depart: readonly string[], voulu: readonly string[]): number[] {
  const tableau = [...depart];
  const nombres: number[] = [];
  for (let rang = tableau.length - 1; rang > 0; rang--) {
    const j = tableau.indexOf(voulu[rang] as string);
    [tableau[rang], tableau[j]] = [tableau[j] as string, tableau[rang] as string];
    nombres.push((j + 0.5) / (rang + 1));
  }
  return nombres;
}

function appliquer(depart: readonly string[], nombres: readonly number[]): string[] {
  const tableau = [...depart];
  nombres.forEach((nombre, position) => {
    const rang = tableau.length - 1 - position;
    const j = Math.floor(nombre * (rang + 1));
    [tableau[rang], tableau[j]] = [tableau[j] as string, tableau[rang] as string];
  });
  return tableau;
}

function lettresDuMot(mot: string): string[] {
  return [...mot].filter((caractere) => !CARACTERES_DEJA_ECRITS.includes(caractere)).map((lettre) => lettre.toLowerCase());
}

/** Les intruses du clavier « lettres du mot » : les lettres en plus voulues d'abord, puis les autres. */
function tirageDuClavier(mot: string, lettresEnPlus: readonly string[]): number[] {
  const lettres = lettresDuMot(mot);
  const possibles = LETTRES_INTRUSES_POSSIBLES.filter((lettre) => !lettres.includes(lettre));
  const nombreDIntruses = Math.min(3, Math.max(2, TOUCHES_PAR_MOT - lettres.length));
  const voulu = [...lettresEnPlus, ...possibles.filter((lettre) => !lettresEnPlus.includes(lettre))];
  const premier = nombresPourObtenir(possibles, voulu);
  const intruses = appliquer(possibles, premier).slice(0, nombreDIntruses);
  const touches = [...lettres, ...intruses];
  return [...premier, ...nombresPourObtenir(touches, [...touches].reverse())];
}

/** Pour chaque personne, la forme attendue et les deux premières autres formes du tableau (dans l'ordre du tableau). */
export function tirageDeLaConjugaison(exercice: Record<string, unknown>): number[] {
  const formes = (exercice.formes as Array<{ forme: string }>).map(({ forme }) => forme);
  const distracteurs = (exercice.distracteurs as string[] | undefined) ?? [];
  return formes.flatMap((forme) => {
    const candidats = [...new Set([...formes, ...distracteurs].filter((autre) => autre !== forme))];
    if (candidats.length <= 2) return nombresPourObtenir([forme, ...candidats], [forme, ...candidats]);
    const autres = nombresPourObtenir(candidats, candidats);
    return [...autres, ...nombresPourObtenir([forme, ...candidats.slice(0, 2)], [forme, ...candidats.slice(0, 2)])];
  });
}

// --- La dictée à l'écran

const dictee = (page: Page) => page.getByTestId("dictee");
const cases = (page: Page) => page.getByTestId("case-a-ecrire");
const touches = (page: Page) => page.getByTestId("touche");
const casesRemplies = (page: Page) => page.locator('[data-testid="case-a-ecrire"]:not([data-etat="vide"])');

export async function attendreLaDictee(page: Page) {
  await expect.poll(async () => {
    if (await dictee(page).isVisible()) return true;
    await terminerLaLecture(page);
    return false;
  }, { intervals: [100] }).toBe(true);
}

async function commencerLaDictee(page: Page) {
  await demarrer(page);
  await attendreLaDictee(page);
}

async function commencerLeMotDicte(page: Page, mot: string) {
  if (etatDesChoix(page).demarrage === undefined) {
    const lecon = leconDeDicteeDuMot(page, mot);
    etatDeLaDictee(page).mot = mot;
    etatDesChoix(page).demarrage = demarrageDeLExercice(page, lecon, EXERCICE_DE_TEST);
  }
  await commencerLaDictee(page);
}

function toucheLibre(page: Page, lettre: string): Locator {
  return page.locator(`[data-testid="touche"][data-lettre="${lettre}"]:not([aria-disabled="true"])`).first();
}

async function attendreQueLesLettresFaussesDisparaissent(page: Page) {
  await expect(page.locator('[data-testid="case-a-ecrire"][data-etat="fausse"]')).toHaveCount(0);
}

async function ecrireUneLettre(page: Page, lettre: string, geste: "touche" | "clavier", derniere: boolean) {
  await attendreQueLesLettresFaussesDisparaissent(page);
  const avant = await casesRemplies(page).count();
  if (geste === "touche") await toucheLibre(page, lettre).click();
  else await page.keyboard.press(lettre);
  if (!derniere) await expect(casesRemplies(page)).toHaveCount(avant + 1);
}

/** Les lettres du texte : les espaces et tirets ne se tapent pas. */
function aTaper(texte: string): string[] {
  return lettresDuMot(texte);
}

function prevoirLeClavier(page: Page, texte: string) {
  const mot = etatDeLaDictee(page).mot;
  const choix = etatDesChoix(page);
  if (mot === undefined || choix.demarrage === undefined) return;
  const lettres = lettresDuMot(mot);
  const enPlus = [...new Set(aTaper(texte).filter((lettre) => !lettres.includes(lettre)))];
  const reglage = reglagesPrevus(page, "Léa").clavierDesDictees;
  if (enPlus.length > 0 && reglage !== "clavierComplet") choix.tirage = tirageDuClavier(mot, enPlus);
}

async function ecrire(page: Page, texte: string, geste: "touche" | "clavier" = "touche") {
  prevoirLeClavier(page, texte);
  await commencerLaDictee(page);
  const lettres = aTaper(texte);
  for (const [rang, lettre] of lettres.entries()) await ecrireUneLettre(page, lettre, geste, rang === lettres.length - 1);
}

// --- Étant donné

Given(/^Léa joue le mot dicté « ([^«»]+) » de l'exercice « ([^«»]+) »$/, async ({ page }, mot: string, exercice: string) => {
  const lecon = leconDeLExercice(page, exercice);
  const mots = motsDe(lecon);
  if (mots[0] !== mot) throw new Error(`Le mot « ${mot} » n'est pas le premier mot dicté de « ${exercice} » (${mots.join(", ")})`);
  etatDeLaDictee(page).mot = mot;
  etatDesChoix(page).demarrage = demarrageDeLExercice(page, lecon, exercice);
});

Given(/^une leçon de test a (?:un|un seul) exercice dictée du mot « ([^«»]+) »$/, async ({ page }, mot: string) => {
  const lecon = leconDeDicteeDeTest(mot);
  await injecter(page, lecon);
  etatDeLaDictee(page).mot = mot;
  etatDesChoix(page).demarrage = demarrageDeLExercice(page, lecon, EXERCICE_DE_TEST);
});

Given(/^Léa a écrit « ([^«»]+) »$/, async ({ page }, texte: string) => {
  await ecrire(page, texte);
});

// --- Quand

When(/^le mot dicté « ([^«»]+) » commence$/, async ({ page }, mot: string) => {
  etatDeLaDictee(page).mot = mot;
  await commencerLeMotDicte(page, mot);
});

When(/^Léa écrit « ([^«»]+) »$/, async ({ page }, texte: string) => {
  await ecrire(page, texte);
});

When(/^Léa écrit ensuite « ([^«»]+) »$/, async ({ page }, texte: string) => {
  await ecrire(page, texte);
});

When(/^Léa écrit la lettre « ([a-zà-ÿœ]) »$/, async ({ page }, lettre: string) => {
  await ecrire(page, lettre);
});

When(/^Léa tape « ([^«»]+) » au clavier seulement$/, async ({ page }, texte: string) => {
  await ecrire(page, texte, "clavier");
});

When(/^Léa efface la dernière lettre$/, async ({ page }) => {
  await commencerLaDictee(page);
  await page.getByTestId("effacer").click();
});

When(/^Léa demande à (réécouter le mot|écouter plus lentement)$/, async ({ page }, demande: string) => {
  await commencerLaDictee(page);
  const memoire = etatDeLaDictee(page);
  await expect.poll(async () => {
    const dites = await toutesLesParoles(page);
    if (dites.some((dit) => /^Écoute bien\.(\s|$)/.test(dit))) return true;
    await terminerLaLecture(page);
    return false;
  }, { intervals: [100] }).toBe(true);
  memoire.rythmeNormal = (await rythmesDites(page))[0];
  await terminerLaLecture(page);
  memoire.paroles = (await journal(page)).speaks;
  await page.getByTestId(demande === "réécouter le mot" ? "reecouter-le-mot" : "ecouter-plus-lentement").click();
});

async function rythmesDites(page: Page): Promise<number[]> {
  return await page.evaluate(() => {
    const faux = Reflect.get(window, "__faux") as { journal: Array<{ type: string; rate: number }> };
    return faux.journal.filter((entree) => entree.type === "speak").map((entree) => entree.rate);
  });
}

// --- Alors : l'écran de la dictée

Then(/^Léa voit « ([^«»]+) » et (\d+) cases vides$/, async ({ page }, consigne: string, nombre: string) => {
  await attendreLaDictee(page);
  await expect(page.getByTestId("question")).toHaveText(consigne);
  await expect(cases(page)).toHaveCount(Number(nombre));
  await expect(page.locator('[data-testid="case-a-ecrire"][data-etat="vide"]')).toHaveCount(Number(nombre));
});

Then(/^« ([^«»]+) » n'est écrit nulle part à l'écran$/, async ({ page }, mot: string) => {
  await attendreLaDictee(page);
  const trouve = await page.evaluate((cherche) => {
    const sansClavier = document.body.cloneNode(true) as HTMLElement;
    sansClavier.querySelector('[data-testid="clavier-de-dictee"]')?.remove();
    const texte = (sansClavier.textContent ?? "").toLowerCase();
    const attributs = [...sansClavier.querySelectorAll("[aria-label], [title], [alt]")]
      .flatMap((element) => ["aria-label", "title", "alt"].map((nom) => element.getAttribute(nom) ?? ""))
      .join(" ")
      .toLowerCase();
    return `${texte} ${attributs}`.includes(cherche.toLowerCase());
  }, mot);
  expect(trouve, `« ${mot} » visible à l'écran`).toBe(false);
});

Then(/^Léa entend de nouveau Noisette dire « ([^«»]+) »(, plus lentement)?$/, async ({ page }, texte: string, lentement?: string) => {
  const memoire = etatDeLaDictee(page);
  await expect.poll(async () => (await journal(page)).speaks).toBeGreaterThan(memoire.paroles);
  await expect.poll(async () => (await journal(page)).lecture.texte).toBe(normaliser(texte));
  const normal = memoire.rythmeNormal;
  expect(normal).toBeDefined();
  const rythmes = (await rythmesDites(page)).slice(memoire.paroles);
  const attendu = (normal ?? 1) * (lentement ? RYTHME_PLUS_LENT : 1);
  expect(rythmes.length).toBeGreaterThan(0);
  for (const rythme of rythmes) expect(rythme).toBeCloseTo(attendu, 5);
});

Then(/^Léa voit le mot « ([^«»]+) » écrit$/, async ({ page }, mot: string) => {
  const lettres = lettresDuMot(mot);
  await expect(cases(page)).toHaveCount(lettres.length);
  for (const [rang, lettre] of lettres.entries()) {
    await expect(cases(page).nth(rang)).toHaveAttribute("data-etat", "ecrite");
    await expect(cases(page).nth(rang)).toHaveText(lettre);
  }
});

Then(/^Léa voit (\d+) cases à écrire et les deux tirets déjà écrits à leur place$/, async ({ page }, nombre: string) => {
  await attendreLaDictee(page);
  const mot = etatDeLaDictee(page).mot ?? "";
  await expect(cases(page)).toHaveCount(Number(nombre));
  await expect(page.getByTestId("caractere-deja-ecrit")).toHaveText(["-", "-"]);
  const attendu = [...mot].map((caractere) => (CARACTERES_DEJA_ECRITS.includes(caractere) ? "caractere-deja-ecrit" : "case-a-ecrire"));
  const observe = await page.getByTestId("mot-a-ecrire").locator("li").evaluateAll((elements) =>
    elements.map((element) => element.getAttribute("data-testid"))
  );
  expect(observe).toEqual(attendu);
});

Then(/^Léa n'a pas à taper les tirets$/, async ({ page }) => {
  await expect(page.locator('[data-testid="touche"][data-lettre="-"]')).toHaveCount(0);
  await ecrire(page, etatDeLaDictee(page).mot ?? "");
  await expect(bulle(page)).toHaveAttribute("data-nature", "felicitation");
});

Then(/^la lettre « ([^«»]+) » est montrée en rouge$/, async ({ page }, lettre: string) => {
  const fausses = page.locator('[data-testid="case-a-ecrire"][data-etat="fausse"]');
  await expect(fausses).toHaveText([lettre]);
  const couleur = await fausses.first().evaluate((element) => getComputedStyle(element).color);
  const [rouge, vert, bleu] = (couleur.match(/\d+/g) ?? []).map(Number);
  expect(rouge, `couleur ${couleur}`).toBeGreaterThan(150);
  expect(vert, `couleur ${couleur}`).toBeLessThan(60);
  expect(bleu, `couleur ${couleur}`).toBeLessThan(80);
});

Then(
  /^Noisette dit un encouragement, suivi de « (.+) », puis redit « ([^«»]+) »$/,
  async ({ page }, complement: string, mot: string) => {
    await expect(bulle(page)).toHaveAttribute("data-nature", "encouragement");
    expect(normaliser((await bulle(page).textContent()) ?? "").endsWith(` ${complement}`)).toBe(true);
    await expect.poll(async () => {
      const dites = (await toutesLesParoles(page)).map(normaliser);
      const encouragementDit = dites.join(" ").includes(complement);
      if (encouragementDit && dites[dites.length - 1] === mot) return true;
      await terminerLaLecture(page);
      return false;
    }, { intervals: [100] }).toBe(true);
  },
);

Then(/^ensuite, il reste « ([^«»]+) » écrit et une case vide$/, async ({ page }, debut: string) => {
  const lettres = lettresDuMot(debut);
  await expect(page.locator('[data-testid="case-a-ecrire"][data-etat="vide"]')).toHaveCount(1);
  await expect(page.locator('[data-testid="case-a-ecrire"][data-etat="ecrite"]')).toHaveText(lettres);
  await expect(page.locator('[data-testid="case-a-ecrire"][data-etat="fausse"]')).toHaveCount(0);
});

// --- Alors : le clavier

Then(/^la dictée propose (les lettres du mot|le clavier complet)$/, async ({ page }, clavier: string) => {
  await attendreLaDictee(page);
  await expect(page.getByTestId("clavier-de-dictee")).toHaveAttribute(
    "data-genre",
    clavier === "le clavier complet" ? "clavierComplet" : "lettresDuMot",
  );
});

Then(
  /^Léa voit (\d+) touches : les lettres de « ([^«»]+) » et (\d+) lettres absentes du mot$/,
  async ({ page }, nombre: string, mot: string, intruses: string) => {
    await attendreLaDictee(page);
    await expect(touches(page)).toHaveCount(Number(nombre));
    const proposees = (await touches(page).evaluateAll((elements) => elements.map((element) => element.getAttribute("data-lettre") ?? "")));
    const reste = [...proposees];
    for (const lettre of lettresDuMot(mot)) {
      const rang = reste.indexOf(lettre);
      expect(rang, `la touche « ${lettre} » est proposée`).toBeGreaterThanOrEqual(0);
      reste.splice(rang, 1);
    }
    expect(reste).toHaveLength(Number(intruses));
    expect(new Set(reste).size, "intruses toutes différentes").toBe(reste.length);
    for (const lettre of reste) expect(lettresDuMot(mot)).not.toContain(lettre);
  },
);

Then(/^la touche « ([^«»]+) » est de nouveau proposée$/, async ({ page }, lettre: string) => {
  await expect(toucheLibre(page, lettre)).toBeVisible();
});

Then(/^toutes les cases sont vides$/, async ({ page }) => {
  await expect(page.locator('[data-testid="case-a-ecrire"]:not([data-etat="vide"])')).toHaveCount(0);
  expect(await cases(page).count()).toBeGreaterThan(0);
});

Then(
  /^le clavier complet propose les lettres de « ([^«»]+) », « ([^«»]+) », « ([^«»]+) », « ([^«»]+) » et « ([^«»]+) »$/,
  async ({ page }, a: string, b: string, c: string, d: string, e: string) => {
    await commencerLaDictee(page);
    await expect(page.getByTestId("clavier-de-dictee")).toHaveAttribute("data-genre", "clavierComplet");
    const attendues = [...a, ...b, ...c, ...d, ...e];
    const proposees = await touches(page).evaluateAll((elements) => elements.map((element) => element.getAttribute("data-lettre")));
    expect(proposees).toEqual(attendues);
  },
);

Then(/^chaque touche du clavier mesure au moins 44 px de haut et de large$/, async ({ page }) => {
  await attendreLaDictee(page);
  const toutes = [...(await touches(page).all()), page.getByTestId("effacer")];
  for (const touche of toutes) {
    const boite = await touche.boundingBox();
    const nom = (await touche.textContent()) ?? "";
    expect(boite, `touche « ${nom} » visible`).not.toBeNull();
    expect(boite?.width ?? 0, `largeur de « ${nom} »`).toBeGreaterThanOrEqual(44);
    expect(boite?.height ?? 0, `hauteur de « ${nom} »`).toBeGreaterThanOrEqual(44);
  }
});

// --- « Je ne sais pas » en dictée (#23)

Given(/^Léa joue un exercice dictee d'une leçon de test$/, async ({ page }) => {
  const lecon = leconDeDicteeDeTest("chat");
  await injecter(page, lecon);
  etatDeLaDictee(page).mot = "chat";
  etatDesChoix(page).demarrage = demarrageDeLExercice(page, lecon, EXERCICE_DE_TEST);
});

export async function estUneDictee(page: Page): Promise<boolean> {
  await expect(page.getByTestId("exercice-en-cours")).toBeVisible();
  return await dictee(page).isVisible();
}

export async function direJeNeSaisPasEnDictee(page: Page) {
  await page.getByTestId("je-ne-sais-pas").click();
  await expect(page.getByTestId("je-ne-sais-pas")).toHaveCount(0);
}

Then(/^la lettre juste suivante s'écrit dans sa case, sans montrer tout le mot$/, async ({ page }) => {
  const mot = lettresDuMot(etatDeLaDictee(page).mot ?? "");
  const montrees = page.locator('[data-testid="case-a-ecrire"][data-etat="montree"]');
  await expect(montrees).toHaveCount(1);
  await expect(montrees).toHaveText(mot[0] ?? "");
  await expect(cases(page).first()).toHaveAttribute("data-etat", "montree");
  await expect(page.locator('[data-testid="case-a-ecrire"][data-etat="vide"]')).toHaveCount(mot.length - 1);
});

export async function verifierQueLaDicteeAttendLaReponse(page: Page) {
  await expect(page.getByTestId("je-ne-sais-pas")).toHaveCount(0);
  await expect(page.locator('[data-testid="case-a-ecrire"][data-etat="ecrite"]')).toHaveCount(0);
  await expect(page.getByTestId("recipient")).toHaveAttribute("data-questions-reussies", "0");
  expect(await page.locator('[data-testid="case-a-ecrire"][data-etat="vide"]').count()).toBeGreaterThan(0);
}

// --- Conjugaison

const tableau = (page: Page) => page.getByTestId("tableau-de-conjugaison");
const lignes = (page: Page) => page.getByTestId("ligne-de-conjugaison");

Then(/^Léa voit « ([^«»]+) » et le tableau des pronoms$/, async ({ page }, verbeEtTemps: string) => {
  await expect(page.getByTestId("verbe-et-temps")).toHaveText(verbeEtTemps);
  await expect(tableau(page)).toBeVisible();
  const lecon = leconDeTitre(page, "Être et avoir au présent");
  const formes = (lecon.exercices.find((e) => e.type === "conjugaison") as { formes: Array<{ pronom: string }> }).formes;
  await expect(lignes(page)).toHaveCount(formes.length);
  for (const [rang, { pronom }] of formes.entries()) {
    await expect(lignes(page).nth(rang)).toHaveText(`${pronom}${pronom.endsWith("'") ? "" : " "}…`);
    await expect(lignes(page).nth(rang)).toHaveAttribute("data-etat", rang === 0 ? "en-cours" : "vide");
  }
});

Then(/^« ([^«»]+) » propose « ([^«»]+) » et deux autres formes, toutes différentes$/, async ({ page }, question: string, forme: string) => {
  await avancerJusquAuxChoix(page);
  await expect(page.getByTestId("question")).toHaveText(question);
  const choix = await textesDesChoix(page);
  expect(choix).toHaveLength(3);
  expect(new Set(choix).size, "formes toutes différentes").toBe(3);
  expect(choix).toContain(forme);
});

Then(/^Léa voit « ([^«»]+) » dans le tableau$/, async ({ page }, ligne: string) => {
  const ecrite = page.locator('[data-testid="ligne-de-conjugaison"][data-etat="ecrite"]');
  await expect(ecrite.filter({ hasText: new RegExp(`^${ligne}$`) })).toHaveCount(1);
});

Then(/^Noisette applaudit en sautant, sans dire de félicitation$/, async ({ page }) => {
  const personnage = page.getByRole("img", { name: "Noisette", exact: true });
  await expect(personnage).toHaveAttribute("data-humeur", "applaudit");
  await expect(personnage).toHaveAttribute("data-geste", "saute");
  expect(await bulle(page).getAttribute("data-nature")).not.toBe("felicitation");
});

Then(/^« ([^«»]+) » est demandé$/, async ({ page }, question: string) => {
  await finirLaParoleJusqua(page, { type: "question", texte: question });
});

Given(/^Léa en est à « ([^«»]+) »$/, async ({ page }, question: string) => {
  await allerALaQuestion(page, question, true);
});

/** Les paroles de la première lecture de l'exercice, jointes (la page de la leçon a déjà dit son accueil). */
async function premiereLectureDeLExercice(page: Page): Promise<string> {
  await attendreLaDictee(page);
  await expect.poll(async () => (await lecturesDuJournal(page)).length).toBeGreaterThan(0);
  const lectures = await lecturesDuJournal(page);
  const apresLAccueil = lectures.filter((lecture) => !/^Coucou /.test(lecture));
  return apresLAccueil[0] ?? "";
}

async function lecturesDuJournal(page: Page): Promise<string[]> {
  const textes = await page.evaluate(() => {
    const faux = Reflect.get(window, "__faux") as { journal: Array<{ type: string; lot: number; texte: string }> };
    const parLot = new Map<number, string[]>();
    for (const e of faux.journal) if (e.type === "speak") parLot.set(e.lot, [...(parLot.get(e.lot) ?? []), e.texte]);
    return [...parLot.values()].map((paroles) => paroles.join(" "));
  });
  return textes.map(normaliser);
}

Then(/^la première chose que Léa entend Noisette dire est « ([^«»]+) »$/, async ({ page }, texte: string) => {
  expect(await premiereLectureDeLExercice(page)).toBe(normaliser(texte));
});

Then(/^Léa n'entend pas Noisette lire la consigne « ([^«»]+) »$/, async ({ page }, consigne: string) => {
  const paroles = (await toutesLesParoles(page)).map(normaliser);
  expect(paroles).not.toContain(normaliser(consigne));
  expect(paroles.join(" ")).not.toContain(normaliser(consigne));
});
