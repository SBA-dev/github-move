import { expect, type Locator, type Page } from "@playwright/test";
import { createBdd } from "playwright-bdd";
import { Before, BeforeStep, test } from "./fixtures.ts";
import {
  clavier,
  donnerLeSignalDeDepart,
  fluence,
  lireLaCarte,
  ouvrirLaFluence,
  partie20,
  repondreAuNombre,
  resultatDeLaCarte,
  reussirDesCalculsDeFluence,
  taperLesChiffres,
} from "./calcul-fluence-addition.steps.ts";
import { direJeNeSaisPasAuClavier } from "./calcul-pour-les-autres-stories.steps.ts";
import { ecrire, estUneDictee, etatDeLaDictee, direJeNeSaisPasEnDictee } from "./dictee-et-conjugaison.steps.ts";
import { demarrer } from "./exercices-a-choix.steps.ts";
import { verifierModeDys } from "./reglages.steps.ts";
import { fichierDe, observer } from "./retours-animes-et-sonores.steps.ts";
import { cleDe } from "./univers.steps.ts";
import { attendreUneLecture, journal, laisserPasserLeDelaiDeLecture, terminerLaLecture } from "./voix.steps.ts";

// Story #128 : cases de la dictée qui s'allument, cristaux qui ont un éclat, marque du record de fluence.
// Les repères du DOM que ces étapes attendent sont décrits dans docs/stories/128/acceptance.md (« Précisions pour les étapes »).
//
// « L'une après l'autre », « un éclat bref » : un enregistreur de la page (MutationObserver, installé avant le chargement)
// note chaque apparition de data-illuminee sur une case et chaque apparition / disparition de data-eclat sur une touche.
// Les étapes lisent ce journal : elles ne mesurent jamais une durée.
// Aucune donnée n'est créée en base par ces étapes : les profils et les records viennent des étapes de #20 et de #98.

const { Given, When, Then } = createBdd(test, { tags: "@issue-128" });

const SELECTEUR_DES_CASES = '[data-testid="case-a-ecrire"]';

type SignatureDeLEclat = Record<string, string>;
type Illumination = { rang: number; total: number; lot: number; etat: string; effets: string[]; mouvement: boolean };
type Eclat = { touche: string; evenement: "debut" | "fin"; signature: SignatureDeLEclat; mouvement: boolean };
type Journal128 = { illuminations: Illumination[]; eclats: Eclat[] };

const marquesDesEclats = new WeakMap<Page, number>();

// --- L'enregistreur de la page

export function installerLEnregistreurDeLaStory128() {
  const journal = { illuminations: [], eclats: [], lot: 0, silence: false } as {
    illuminations: unknown[];
    eclats: unknown[];
    lot: number;
    silence: boolean;
  };
  Reflect.set(window, "__claviers128", journal);
  const effetsDepuisLaMarque = (): string[] => {
    const effets = Reflect.get(window, "__effets") as { entrees: Array<{ nom: string }>; marque: number } | undefined;
    return effets ? effets.entrees.slice(effets.marque).map((entree) => entree.nom) : [];
  };
  const bouge = (element: Element): boolean => {
    const style = getComputedStyle(element);
    return style.animationName !== "none" || (style.transform !== "none" && style.transform !== "matrix(1, 0, 0, 1, 0, 0)");
  };
  const signatureDe = (element: Element): Record<string, string> => {
    const style = getComputedStyle(element);
    return {
      animationName: style.animationName,
      animationDuration: style.animationDuration,
      animationIterationCount: style.animationIterationCount,
      animationTimingFunction: style.animationTimingFunction,
      transitionProperty: style.transitionProperty,
      transitionDuration: style.transitionDuration,
    };
  };
  const noterUneCase = (element: Element) => {
    if (element.getAttribute("data-illuminee") !== "true") return;
    const toutes = [...document.querySelectorAll('[data-testid="case-a-ecrire"]')];
    journal.illuminations.push({
      rang: toutes.indexOf(element),
      total: toutes.length,
      lot: journal.lot,
      etat: element.getAttribute("data-etat") ?? "",
      effets: effetsDepuisLaMarque(),
      mouvement: bouge(element),
    });
  };
  const noterUneTouche = (element: Element, evenement: "debut" | "fin") => {
    if (journal.silence) return;
    journal.eclats.push({ touche: (element.textContent ?? "").trim(), evenement, signature: signatureDe(element), mouvement: bouge(element) });
  };
  new MutationObserver((enregistrements) => {
    journal.lot += 1;
    for (const enregistrement of enregistrements) {
      const cible = enregistrement.target;
      if (enregistrement.type === "attributes" && cible instanceof Element) {
        if (enregistrement.attributeName === "data-illuminee" && cible.matches('[data-testid="case-a-ecrire"]')) noterUneCase(cible);
        if (enregistrement.attributeName === "data-eclat") {
          if (cible.getAttribute("data-eclat") === "true") noterUneTouche(cible, "debut");
          else if (enregistrement.oldValue === "true") noterUneTouche(cible, "fin");
        }
      }
      for (const ajoute of enregistrement.addedNodes) {
        if (!(ajoute instanceof Element)) continue;
        if (ajoute.matches('[data-testid="case-a-ecrire"]')) noterUneCase(ajoute);
        ajoute.querySelectorAll('[data-testid="case-a-ecrire"]').forEach(noterUneCase);
      }
    }
  }).observe(document, {
    subtree: true,
    childList: true,
    attributes: true,
    attributeOldValue: true,
    attributeFilter: ["data-illuminee", "data-eclat"],
  });
}

Before({ tags: "@issue-128" }, async ({ page }) => {
  await page.addInitScript(installerLEnregistreurDeLaStory128);
});

// « Noisette ne dit rien » (#20) compare les paroles à celles comptées avant le geste de l'enfant : ici le geste est la bonne réponse
// qui dépasse le record, les paroles de l'accueil et du départ sont déjà dites.
BeforeStep({ tags: "@issue-128" }, async ({ page, $step }) => {
  if ($step.title.replace(/^(Étant donné que|Quand|Alors|Et que|Et|Mais) /, "") !== "Léa donne une bonne réponse") return;
  await laisserPasserLeDelaiDeLecture(page);
  partie20(page).paroles = (await journal(page)).speaks;
});

async function journal128(page: Page): Promise<Journal128> {
  const lu = await page.evaluate(() => {
    const brut = Reflect.get(window, "__claviers128") as { illuminations: unknown[]; eclats: unknown[] } | undefined;
    return JSON.stringify({ illuminations: brut?.illuminations ?? [], eclats: brut?.eclats ?? [] });
  });
  return JSON.parse(lu) as Journal128;
}

async function marquerLesEclats(page: Page): Promise<void> {
  marquesDesEclats.set(page, (await journal128(page)).eclats.length);
}

async function eclatsDepuisLaMarque(page: Page): Promise<Eclat[]> {
  return (await journal128(page)).eclats.slice(marquesDesEclats.get(page) ?? 0);
}

/** Deux images affichées : de quoi laisser un éclat commencer s'il devait commencer. */
async function laisserLEcranSeDessiner(page: Page): Promise<void> {
  await page.evaluate(() => new Promise<void>((fin) => requestAnimationFrame(() => requestAnimationFrame(() => fin()))));
}

// --- Les repères de la dictée

const cases = (page: Page) => page.locator(SELECTEUR_DES_CASES);
const caseNumero = (page: Page, numero: string) => cases(page).nth(Number(numero) - 1);

async function verifierQueLaCaseEstAllumee(page: Page, numero: string): Promise<void> {
  const une = caseNumero(page, numero);
  await expect(une).toHaveAttribute("data-allumee", "true");
  await expect(une).toHaveAttribute("data-etat", "ecrite");
  await expect(une).not.toHaveAttribute("data-brille", "true");
  await expect(une).not.toHaveAttribute("data-illuminee", "true");
}

async function verifierQueLaCaseEstVideEtEteinte(page: Page, numero: string): Promise<void> {
  const une = caseNumero(page, numero);
  await expect(une).toHaveAttribute("data-etat", "vide");
  await expect(une).not.toHaveAttribute("data-allumee", "true");
  await expect(une).not.toHaveAttribute("data-illuminee", "true");
}

Then(/^la case (\d+) est allumée$/, async ({ page }, numero: string) => {
  await verifierQueLaCaseEstAllumee(page, numero);
});

Then(/^les cases (\d+), (\d+) et (\d+) sont allumées$/, async ({ page }, premiere: string, deuxieme: string, troisieme: string) => {
  for (const numero of [premiere, deuxieme, troisieme]) await verifierQueLaCaseEstAllumee(page, numero);
});

Then(/^la case (\d+) reste vide et éteinte$/, async ({ page }, numero: string) => {
  await verifierQueLaCaseEstVideEtEteinte(page, numero);
});

Then(/^les cases (\d+), (\d+) et (\d+) restent vides et éteintes$/, async ({ page }, premiere: string, deuxieme: string, troisieme: string) => {
  for (const numero of [premiere, deuxieme, troisieme]) await verifierQueLaCaseEstVideEtEteinte(page, numero);
});

Then(/^aucune lettre n'est encore montrée en rouge$/, async ({ page }) => {
  await expect(cases(page).first()).toBeVisible();
  await expect(page.locator(`${SELECTEUR_DES_CASES}[data-etat="fausse"]`)).toHaveCount(0);
});

Then(/^aucune case ne brille comme une bonne réponse montrée$/, async ({ page }) => {
  await expect(cases(page).first()).toBeVisible();
  await expect(page.locator(`${SELECTEUR_DES_CASES}[data-brille="true"]`)).toHaveCount(0);
  await expect(page.locator(`${SELECTEUR_DES_CASES}[data-etat="montree"]`)).toHaveCount(0);
});

async function lesIlluminations(page: Page, nombre: number | undefined): Promise<Illumination[]> {
  let lues: Illumination[] = [];
  await expect.poll(async () => {
    lues = (await journal128(page)).illuminations;
    const attendu = nombre ?? lues[0]?.total ?? 0;
    return attendu > 0 && lues.length >= attendu;
  }, { intervals: [50], timeout: 20_000, message: "les cases du mot juste s'illuminent" }).toBe(true);
  return lues;
}

async function verifierLIlluminationUneAUne(page: Page, nombre: number | undefined): Promise<Illumination[]> {
  const lues = await lesIlluminations(page, nombre);
  const total = nombre ?? lues[0]?.total ?? 0;
  expect(lues.map((une) => une.rang), "ordre d'arrivée de l'illumination, de la première à la dernière case").toEqual(
    Array.from({ length: total }, (_, rang) => rang),
  );
  const lots = lues.map((une) => une.lot);
  expect(new Set(lots).size, "chaque case s'illumine dans un rendu à part").toBe(total);
  expect([...lots].sort((a, b) => a - b), "les rendus se suivent dans l'ordre").toEqual(lots);
  return lues;
}

Then(/^les (\d+) cases s'illuminent l'une après l'autre, de la première à la dernière$/, async ({ page }, nombre: string) => {
  await verifierLIlluminationUneAUne(page, Number(nombre));
});

Then(/^toutes les cases du mot s'illuminent l'une après l'autre, la case de la lettre montrée comprise$/, async ({ page }) => {
  const lues = await verifierLIlluminationUneAUne(page, undefined);
  expect(lues[0]?.rang, "la case de la lettre montrée, la première du mot, est la première à s'illuminer").toBe(0);
});

Then(/^les (\d+) cases s'illuminent toutes ensemble, sans cascade ni mouvement$/, async ({ page }, nombre: string) => {
  const lues = await lesIlluminations(page, Number(nombre));
  expect(new Set(lues.map((une) => une.lot)).size, "toutes les cases dans le même rendu").toBe(1);
  expect(lues.some((une) => une.mouvement), "aucune case ne bouge").toBe(false);
});

Then(/^l'effet sonore « ([^«»]+) » commence avant que la dernière case soit illuminée$/, async ({ page }, effet: string) => {
  const lues = await lesIlluminations(page, undefined);
  const derniere = lues[lues.length - 1];
  expect(derniere?.effets, "effets sonores déjà commencés quand la dernière case s'illumine").toContain(fichierDe(effet));
});

Then(/^les deux tirets ne s'illuminent pas$/, async ({ page }) => {
  await expect(page.getByTestId("caractere-deja-ecrit")).toHaveText(["-", "-"]);
  await expect(page.locator('[data-testid="caractere-deja-ecrit"][data-illuminee]')).toHaveCount(0);
  await expect(page.locator('[data-testid="caractere-deja-ecrit"][data-allumee]')).toHaveCount(0);
});

Then(/^aucune case ne s'illumine$/, async ({ page }) => {
  await expect(cases(page).first()).toBeVisible();
  await laisserLEcranSeDessiner(page);
  await expect(page.locator(`${SELECTEUR_DES_CASES}[data-illuminee]`)).toHaveCount(0);
  expect((await journal128(page)).illuminations).toEqual([]);
});

Then(/^cette case se voit comme une lettre montrée par le personnage guide, pas comme une case allumée$/, async ({ page }) => {
  const premiere = cases(page).first();
  await expect(premiere).toHaveAttribute("data-etat", "montree");
  await expect(premiere).not.toHaveAttribute("data-allumee", "true");
  await expect(premiere).not.toHaveAttribute("data-illuminee", "true");
});

// Après « Je ne sais pas », la lettre montrée est une aide posée dans la case : l'enfant l'écrit lui-même, puis écrit la suite.
When(/^Léa écrit la fin du mot$/, async ({ page }) => {
  const montree = page.locator(`${SELECTEUR_DES_CASES}[data-etat="montree"]`);
  // La lettre montrée apparaît quand le personnage guide a fini sa phrase : Léa attend de la voir avant d'écrire.
  await expect.poll(async () => {
    if ((await montree.count()) === 1) return true;
    await terminerLaLecture(page);
    return false;
  }, { intervals: [100] }).toBe(true);
  const [premiere = "", ...suite] = [...(etatDeLaDictee(page).mot ?? "")];
  await page.locator(`[data-testid="touche"][data-lettre="${premiere}"]:not([aria-disabled="true"])`).first().click();
  await expect(cases(page).first()).toHaveAttribute("data-etat", "ecrite");
  await ecrire(page, suite.join(""));
});

async function verifierQueLaCaseNeBougePas(page: Page, numero: string): Promise<void> {
  const style = await caseNumero(page, numero).evaluate((element) => {
    const calcule = getComputedStyle(element);
    return { animation: calcule.animationName, transform: calcule.transform, transition: calcule.transitionDuration };
  });
  expect(style.animation, "pas d'animation").toBe("none");
  expect(["none", "matrix(1, 0, 0, 1, 0, 0)"], "pas de déplacement ni de grossissement").toContain(style.transform);
  expect(style.transition.split(",").every((duree) => parseFloat(duree) === 0), "changement de couleur aussitôt").toBe(true);
}

Then(/^la case (\d+) est allumée, sans bouger$/, async ({ page }, numero: string) => {
  await verifierQueLaCaseEstAllumee(page, numero);
  await verifierQueLaCaseNeBougePas(page, numero);
});

// --- Les lecteurs d'écran, dans la dictée

function libellesAnnonces(texte: string): string[] {
  return [...texte.matchAll(/« ([^«»]+) »/g)].map((trouve) => trouve[1] ?? "");
}

Then(/^les lecteurs d'écran annoncent (« [^«»]+ »(?:, « [^«»]+ »)* et « [^«»]+ »)$/, async ({ page }, annonces: string) => {
  const attendus = libellesAnnonces(annonces);
  await expect(cases(page)).toHaveCount(attendus.length);
  for (const [rang, attendu] of attendus.entries()) await expect(cases(page).nth(rang)).toHaveAttribute("aria-label", attendu);
});

Then(/^les lecteurs d'écran n'annoncent ni « allumée » ni « illuminée »$/, async ({ page }) => {
  const mot = page.getByRole("list", { name: "Mot à écrire" });
  const arbre = await mot.ariaSnapshot();
  expect(arbre, "ce que lisent les lecteurs d'écran").not.toMatch(/allum|illumin/i);
  for (const une of await cases(page).all()) {
    expect((await une.getAttribute("aria-label")) ?? "").not.toMatch(/allum|illumin/i);
    for (const dessin of await une.getByTestId("dessin-de-la-case").all()) await expect(dessin).toHaveAttribute("aria-hidden", "true");
  }
});

// --- Le dessin de l'univers : la clé de l'univers, sur chaque case, chaque touche de chiffre et la marque

Then(
  /^(les \d+ cases|les touches de chiffres du clavier de cristaux) ont le dessin de l'univers « ([^«»]+) »$/,
  async ({ page }, cible: string, univers: string) => {
    const cle = cleDe(univers);
    if (cible === "les touches de chiffres du clavier de cristaux") {
      const chiffres = clavier(page).getByTestId("cristal");
      await expect(chiffres).toHaveCount(10);
      for (const touche of await chiffres.all()) {
        await expect(touche).toHaveAttribute("data-univers", cle);
        await expect(touche.getByTestId("dessin-du-cristal")).toHaveAttribute("aria-hidden", "true");
      }
      return;
    }
    const nombre = Number(/\d+/.exec(cible)?.[0]);
    await expect(cases(page)).toHaveCount(nombre);
    for (const une of await cases(page).all()) {
      await expect(une).toHaveAttribute("data-univers", cle);
      await expect(une.getByTestId("dessin-de-la-case")).toHaveAttribute("aria-hidden", "true");
    }
  },
);

Then(/^la marque du record a le dessin de l'univers « ([^«»]+) »$/, async ({ page }, univers: string) => {
  const marque = marqueDuRecord(page);
  await expect(marque).toHaveAttribute("data-univers", cleDe(univers));
  await expect(marque.getByTestId("dessin-de-la-marque")).toHaveAttribute("aria-hidden", "true");
});

/** La lettre fausse a le même rouge dans tous les univers : le rouge d'une lettre fausse ne vient pas du dessin. */
Then(
  /^la lettre « ([^«»]+) » est montrée en rouge, de la même façon que dans l'univers « Animaux de la forêt »$/,
  async ({ page }, lettre: string) => {
    const fausses = page.locator(`${SELECTEUR_DES_CASES}[data-etat="fausse"]`);
    await expect(fausses).toHaveText([lettre]);
    const couleur = await fausses.first().evaluate((element) => getComputedStyle(element).color);
    const [rouge = 0, vert = 0, bleu = 0] = (couleur.match(/\d+/g) ?? []).map(Number);
    expect(rouge, `couleur ${couleur}`).toBeGreaterThan(150);
    expect(vert, `couleur ${couleur}`).toBeLessThan(60);
    expect(bleu, `couleur ${couleur}`).toBeLessThan(80);
    const univers = await fausses.first().getAttribute("data-univers");
    const reference = await couleurDeReference(fausses.first(), "color");
    expect(couleur, `rouge de la lettre fausse dans l'univers « ${univers} » comme dans « animaux »`).toBe(reference);
  },
);

/** La valeur calculée d'une propriété si tous les repères d'univers de la page étaient ceux d'« Animaux de la forêt ». */
async function couleurDeReference(element: Locator, propriete: "color"): Promise<string> {
  return await element.evaluate((cible, nom) => {
    const reperes = [...document.querySelectorAll("[data-univers]")].map((un) => [un, un.getAttribute("data-univers")] as const);
    for (const [un] of reperes) un.setAttribute("data-univers", "animaux");
    const valeur = getComputedStyle(cible).getPropertyValue(nom);
    for (const [un, avant] of reperes) if (avant !== null) un.setAttribute("data-univers", avant);
    return valeur;
  }, propriete);
}

Then(/^Léa voit en entier les 8 cases, dont 5 allumées$/, async ({ page }) => {
  await expect(cases(page)).toHaveCount(8);
  const largeur = page.viewportSize()?.width ?? 0;
  for (const une of await cases(page).all()) {
    await expect(une).toBeVisible();
    const boite = await une.boundingBox();
    expect(boite, "case visible").not.toBeNull();
    expect(boite?.x ?? -1, "la case commence dans l'écran").toBeGreaterThanOrEqual(0);
    expect((boite?.x ?? 0) + (boite?.width ?? 0), "la case finit dans l'écran").toBeLessThanOrEqual(largeur);
  }
  await expect(page.locator(`${SELECTEUR_DES_CASES}[data-allumee="true"]`)).toHaveCount(5);
});

Then(/^Léa voit les lettres écrites dans les cases en mode dys : .+$/, async ({ page }) => {
  const ecrites = page.locator(`${SELECTEUR_DES_CASES}[data-etat="ecrite"]`);
  await expect(ecrites).toHaveCount(2);
  await verifierModeDys(page, await ecrites.all(), true);
});

// --- « Je ne sais pas » : la dictée ou le clavier de cristaux

Given(/^(?:Léa|Tom) a dit « Je ne sais pas »$/, async ({ page }) => {
  await demarrer(page);
  if (await estUneDictee(page)) {
    await direJeNeSaisPasEnDictee(page);
    return;
  }
  await lireLaCarte(page);
  await direJeNeSaisPasAuClavier(page);
});

// --- Le clavier de cristaux : les touches et leur éclat

const touche = (page: Page, chiffre: string) => clavier(page).getByTestId("cristal").filter({ hasText: new RegExp(`^${chiffre}$`) });
const effacer = (page: Page) => clavier(page).getByTestId("effacer");
const valider = (page: Page) => clavier(page).getByTestId("valider");
const nombreTape = (page: Page) => page.getByTestId("nombre-tape");

When(/^(?:Tom|Léa) touche la touche « (\d) » du clavier de cristaux$/, async ({ page }, chiffre: string) => {
  const enFluence = await fluence(page).isVisible();
  if (!enFluence) await attendreUneLecture(page);
  await marquerLesEclats(page);
  // Le clavier peut être figé (aria-disabled) : un enfant touche quand même, et rien ne doit se passer.
  await touche(page, chiffre).click({ force: true });
});

// Le moteur convertit en nombre une capture `(\d+)` : les étapes en refont le texte des chiffres.
When(/^Tom tape « (\d+) » au clavier seulement$/, async ({ page }, capture: string | number) => {
  const nombre = String(capture);
  await expect(clavier(page)).toBeVisible();
  await marquerLesEclats(page);
  for (const chiffre of nombre) await page.keyboard.press(chiffre);
  await expect(nombreTape(page)).toHaveText(nombre);
});

Given(/^Tom a tapé « (\d+) »$/, async ({ page }, capture: string | number) => {
  const nombre = String(capture);
  await attendreUneLecture(page);
  await taperLesChiffres(page, nombre);
  await expect(nombreTape(page)).toHaveText(nombre);
  partie20(page).nombreTape = nombre;
});

When(/^Tom touche « Effacer »$/, async ({ page }) => {
  await marquerLesEclats(page);
  await effacer(page).click();
});

async function verifierUnEclatBref(page: Page, nom: string): Promise<Eclat[]> {
  let deLaTouche: Eclat[] = [];
  await expect.poll(async () => {
    deLaTouche = (await eclatsDepuisLaMarque(page)).filter((eclat) => eclat.touche === nom);
    return deLaTouche.map((eclat) => eclat.evenement);
  }, { intervals: [50], timeout: 20_000, message: `la touche « ${nom} » a un éclat, puis le perd` }).toEqual(["debut", "fin"]);
  return deLaTouche;
}

Then(/^la touche « (\d) » a un éclat bref, puis redevient comme les autres touches$/, async ({ page }, chiffre: string) => {
  await verifierUnEclatBref(page, chiffre);
  await expect(touche(page, chiffre)).not.toHaveAttribute("data-eclat", "true");
  await expect(page.locator('[data-testid="cristal"][data-eclat]')).toHaveCount(0);
});

Then(/^« Effacer » a un éclat bref, puis redevient comme avant$/, async ({ page }) => {
  await verifierUnEclatBref(page, "Effacer");
  await expect(effacer(page)).not.toHaveAttribute("data-eclat", "true");
});

Then(/^la touche « (\d) » ne brille pas comme une bonne réponse montrée$/, async ({ page }, chiffre: string) => {
  await expect(touche(page, chiffre)).not.toHaveAttribute("data-brille", "true");
  await expect(clavier(page).locator('[data-brille="true"]')).toHaveCount(0);
});

Then(/^seule la touche « (\d) » brille$/, async ({ page }, chiffre: string) => {
  const brillantes = clavier(page).getByTestId("cristal").and(page.locator('[data-brille="true"]'));
  await expect(brillantes).toHaveText([chiffre]);
  await expect(clavier(page).locator('[data-brille="true"]')).toHaveCount(1);
});

Then(/^« Valider » rebondit, sans éclat$/, async ({ page }) => {
  await expect.poll(async () => (await observer(page)).vu, { timeout: 20_000 }).toContain("retour:rebond:Valider");
  await expect(valider(page)).not.toHaveAttribute("data-eclat", "true");
  const deValider = (await journal128(page)).eclats.filter((eclat) => eclat.touche === "Valider");
  expect(deValider, "« Valider » n'a jamais d'éclat").toEqual([]);
});

Then(/^la touche « (\d) » n'a pas d'éclat$/, async ({ page }, chiffre: string) => {
  await laisserLEcranSeDessiner(page);
  await expect(touche(page, chiffre)).not.toHaveAttribute("data-eclat", "true");
  const deLaTouche = (await eclatsDepuisLaMarque(page)).filter((eclat) => eclat.touche === chiffre);
  expect(deLaTouche, `la touche « ${chiffre} » n'a pas eu d'éclat`).toEqual([]);
});

Then(/^aucune touche n'a d'éclat$/, async ({ page }) => {
  await laisserLEcranSeDessiner(page);
  await expect(page.locator("[data-eclat]")).toHaveCount(0);
  expect(await eclatsDepuisLaMarque(page), "aucun éclat depuis le geste de l'enfant").toEqual([]);
});

Then(/^la touche « (\d) » change brièvement de couleur, sans grandir ni bouger$/, async ({ page }, chiffre: string) => {
  const eclats = await verifierUnEclatBref(page, chiffre);
  expect(eclats.some((eclat) => eclat.mouvement), "l'éclat ne bouge pas : ni animation, ni déplacement, ni grossissement").toBe(false);
  const style = await touche(page, chiffre).evaluate((element) => getComputedStyle(element).transform);
  expect(["none", "matrix(1, 0, 0, 1, 0, 0)"]).toContain(style);
});

/** L'éclat enregistré dans l'univers du profil, comparé à celui que la même touche aurait dans « Animaux de la forêt ». */
Then(
  /^la touche « (\d) » a le même éclat bref que dans l'univers « Animaux de la forêt »$/,
  async ({ page }, chiffre: string) => {
    const eclats = await verifierUnEclatBref(page, chiffre);
    const obtenu = eclats[0]?.signature ?? {};
    const reference = await touche(page, chiffre).evaluate((cible) => {
      const journal = Reflect.get(window, "__claviers128") as { silence: boolean };
      const reperes = [...document.querySelectorAll("[data-univers]")].map((un) => [un, un.getAttribute("data-univers")] as const);
      journal.silence = true;
      for (const [un] of reperes) un.setAttribute("data-univers", "animaux");
      cible.setAttribute("data-eclat", "true");
      const style = getComputedStyle(cible);
      const signature = {
        animationName: style.animationName,
        animationDuration: style.animationDuration,
        animationIterationCount: style.animationIterationCount,
        animationTimingFunction: style.animationTimingFunction,
        transitionProperty: style.transitionProperty,
        transitionDuration: style.transitionDuration,
      };
      cible.removeAttribute("data-eclat");
      for (const [un, avant] of reperes) if (avant !== null) un.setAttribute("data-univers", avant);
      return signature;
    });
    // L'enregistreur reprend dans une autre tâche : les enregistrements de l'éclat forcé sont déjà passés.
    await page.evaluate(() => {
      const journal = Reflect.get(window, "__claviers128") as { silence: boolean };
      journal.silence = false;
    });
    expect(obtenu, "même éclat que dans l'univers « Animaux de la forêt »").toEqual(reference);
  },
);

Then(/^elle brille de la même façon que dans l'univers « Animaux de la forêt »$/, async ({ page }) => {
  const brillante = clavier(page).getByTestId("cristal").and(page.locator('[data-brille="true"]'));
  await expect(brillante).toHaveCount(1);
  const { dans, reference } = await brillante.evaluate((cible) => {
    const lire = (element: Element) => {
      const style = getComputedStyle(element);
      const sansCouleur = (valeur: string) => valeur.replace(/rgba?\([^)]*\)/g, "couleur");
      return {
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
    };
    const dansSonUnivers = lire(cible);
    const reperes = [...document.querySelectorAll("[data-univers]")].map((un) => [un, un.getAttribute("data-univers")] as const);
    for (const [un] of reperes) un.setAttribute("data-univers", "animaux");
    const dansAnimaux = lire(cible);
    for (const [un, avant] of reperes) if (avant !== null) un.setAttribute("data-univers", avant);
    return { dans: dansSonUnivers, reference: dansAnimaux };
  });
  expect(dans, "même façon de briller que dans l'univers « Animaux de la forêt »").toEqual(reference);
});

Then(/^les lecteurs d'écran annoncent toujours « Clavier de cristaux » et « Nombre tapé »$/, async ({ page }) => {
  await expect(page.getByRole("group", { name: "Clavier de cristaux", exact: true })).toHaveCount(1);
  await expect(nombreTape(page)).toHaveAttribute("aria-label", "Nombre tapé");
  for (const dessin of await clavier(page).getByTestId("dessin-du-cristal").all()) await expect(dessin).toHaveAttribute("aria-hidden", "true");
  const arbre = await clavier(page).ariaSnapshot();
  expect(arbre, "ce que lisent les lecteurs d'écran").not.toMatch(/univers|dessin|éclat|eclat/i);
});

Then(/^« Effacer » et « Valider » ont le même aspect que dans l'univers « Animaux de la forêt »$/, async ({ page }) => {
  for (const bouton of [effacer(page), valider(page)]) {
    await expect(bouton).toBeVisible();
    await expect(bouton).not.toHaveAttribute("data-univers", /.+/);
    await expect(bouton.getByTestId("dessin-du-cristal")).toHaveCount(0);
    const dans = await bouton.evaluate((element) => {
      const style = getComputedStyle(element);
      return JSON.stringify({ couleur: style.color, fond: style.backgroundColor, bordure: style.borderTopColor, ombre: style.boxShadow });
    });
    const reference = await bouton.evaluate((element) => {
      const reperes = [...document.querySelectorAll("[data-univers]")].map((un) => [un, un.getAttribute("data-univers")] as const);
      for (const [un] of reperes) un.setAttribute("data-univers", "animaux");
      const style = getComputedStyle(element);
      const valeur = JSON.stringify({ couleur: style.color, fond: style.backgroundColor, bordure: style.borderTopColor, ombre: style.boxShadow });
      for (const [un, avant] of reperes) if (avant !== null) un.setAttribute("data-univers", avant);
      return valeur;
    });
    expect(dans, "même aspect que dans l'univers « Animaux de la forêt »").toBe(reference);
  }
});

Then(/^Léa voit « (\d+) » dans le nombre tapé$/, async ({ page }, nombre: string | number) => {
  await expect(nombreTape(page)).toHaveText(String(nombre));
});

// --- La fluence : la marque du record

const marqueDuRecord = (page: Page) => page.getByTestId("marque-du-record");

Given(/^Léa fait cette fluence, avec (\d+) calculs? réussis?$/, async ({ page }, reussis: string) => {
  await ouvrirLaFluence(page, partie20(page).fluence ?? "");
  await donnerLeSignalDeDepart(page);
  await reussirDesCalculsDeFluence(page, Number(reussis));
});

Given(/^le record de Léa ne peut pas être lu$/, async ({ page }) => {
  await page.route(/\/rest\/v1\/records_de_fluence/, (route) => route.abort("failed"));
});

Then(/^Léa voit la marque du record « ([^«»]+) »$/, async ({ page }, texte: string) => {
  await expect(marqueDuRecord(page)).toBeVisible();
  await expect(marqueDuRecord(page)).toHaveText(texte);
  await expect(marqueDuRecord(page)).toHaveAttribute("data-etat", "a-atteindre");
});

Then(/^Léa ne voit aucune marque du record$/, async ({ page }) => {
  await expect(fluence(page)).toHaveAttribute("data-etat", "en-cours");
  await expect(page.getByTestId("calculs-reussis")).toBeVisible();
  await expect(marqueDuRecord(page)).toHaveCount(0);
});

Then(/^Léa ne voit plus la marque du record$/, async ({ page }) => {
  await expect(fluence(page)).toHaveAttribute("data-etat", "finie");
  await expect(marqueDuRecord(page)).toHaveCount(0);
});

Then(/^Léa ne voit ni le mot « course », ni ligne d'arrivée, ni podium$/, async ({ page }) => {
  await expect(fluence(page)).toBeVisible();
  const texte = (await page.locator("body").innerText()).normalize("NFD").replace(/[̀-ͯ]/g, "");
  expect(texte, "texte de l'écran").not.toMatch(/course|arrivee|podium|classement|gagnant|champion/i);
  await expect(page.locator('[data-testid*="arrivee"], [data-testid*="podium"], [data-testid*="course"]')).toHaveCount(0);
});

Then(/^la marque du record est à côté du nombre de calculs réussis$/, async ({ page }) => {
  const marque = await marqueDuRecord(page).boundingBox();
  const score = await page.getByTestId("calculs-reussis").boundingBox();
  expect(marque, "marque visible").not.toBeNull();
  expect(score, "score visible").not.toBeNull();
  const m = marque as NonNullable<typeof marque>;
  const s = score as NonNullable<typeof score>;
  const memeLigne = m.y < s.y + s.height && s.y < m.y + m.height;
  expect(memeLigne, "la marque est sur la même ligne que le nombre de calculs réussis").toBe(true);
  const sansChevauchement = m.x + m.width <= s.x || s.x + s.width <= m.x;
  expect(sansChevauchement, "la marque est posée à côté du score, pas dessus").toBe(true);
});

Then(/^elle n'est pas posée sur la barre de temps$/, async ({ page }) => {
  await expect(page.getByTestId("barre-de-temps").getByTestId("marque-du-record")).toHaveCount(0);
  const marque = await marqueDuRecord(page).boundingBox();
  const barre = await page.getByTestId("barre-de-temps").boundingBox();
  expect(marque, "marque visible").not.toBeNull();
  expect(barre, "barre de temps visible").not.toBeNull();
  const m = marque as NonNullable<typeof marque>;
  const b = barre as NonNullable<typeof barre>;
  const separes = m.y + m.height <= b.y || b.y + b.height <= m.y || m.x + m.width <= b.x || b.x + b.width <= m.x;
  expect(separes, "la marque ne recouvre pas la barre de temps").toBe(true);
});

Then(/^la marque du record est (à atteindre|dépassée)$/, async ({ page }, etat: string) => {
  await expect(marqueDuRecord(page)).toHaveAttribute("data-etat", etat === "dépassée" ? "depassee" : "a-atteindre");
});

Then(/^la marque du record montre toujours « ([^«»]+) »$/, async ({ page }, texte: string) => {
  await expect(marqueDuRecord(page)).toHaveText(texte);
});

Then(/^elle ne brille pas comme une bonne réponse montrée$/, async ({ page }) => {
  await expect(marqueDuRecord(page)).not.toHaveAttribute("data-brille", "true");
  await expect(marqueDuRecord(page).locator('[data-brille="true"]')).toHaveCount(0);
  await expect(page.locator('[data-brille="true"]')).toHaveCount(0);
});

Then(/^elle n'a pas le rouge d'une lettre fausse$/, async ({ page }) => {
  const couleurs = await marqueDuRecord(page).evaluate((element) => {
    const lire = (cible: Element) => {
      const style = getComputedStyle(cible);
      return [style.color, style.backgroundColor, style.borderTopColor];
    };
    return [...lire(element), ...[...element.querySelectorAll("*")].flatMap(lire)];
  });
  for (const couleur of couleurs) {
    const [rouge = 0, vert = 0, bleu = 0, alpha = 1] = (couleur.match(/[\d.]+/g) ?? []).map(Number);
    const estLeRougeDUneLettreFausse = alpha > 0.3 && rouge > 150 && vert < 60 && bleu < 80;
    expect(estLeRougeDUneLettreFausse, `couleur ${couleur}`).toBe(false);
  }
});

Then(/^la marque du record ne bouge pas$/, async ({ page }) => {
  const style = await marqueDuRecord(page).evaluate((element) => {
    const calcule = getComputedStyle(element);
    return { animation: calcule.animationName, transform: calcule.transform, transition: calcule.transitionDuration };
  });
  expect(style.animation, "pas d'animation").toBe("none");
  expect(["none", "matrix(1, 0, 0, 1, 0, 0)"], "pas de déplacement").toContain(style.transform);
  expect(style.transition.split(",").every((duree) => parseFloat(duree) === 0), "changement de couleur aussitôt").toBe(true);
});

Then(/^le temps qui reste continue de passer, et Léa peut encore répondre$/, async ({ page }) => {
  const p = partie20(page);
  const avant = await page.getByTestId("temps-restant").textContent();
  const score = Number(await page.getByTestId("calculs-reussis").getAttribute("data-score"));
  p.maintenant = new Date(p.maintenant.getTime() + 5000);
  await page.clock.setFixedTime(p.maintenant);
  await expect.poll(async () => await page.getByTestId("temps-restant").textContent(), { timeout: 20_000 }).not.toBe(avant);
  await expect(fluence(page)).toHaveAttribute("data-etat", "en-cours");
  const carte = await lireLaCarte(page);
  await repondreAuNombre(page, resultatDeLaCarte(p.lecon, carte));
  await expect(page.getByTestId("calculs-reussis")).toHaveAttribute("data-score", String(score + 1));
});

Then(/^les lecteurs d'écran n'annoncent ni la marque du record ni son changement de couleur$/, async ({ page }) => {
  const annonce = page.getByTestId("annonce-de-fluence");
  await expect(annonce).not.toHaveText(/record|dépass/i);
  const cachee = await marqueDuRecord(page).evaluate((element) => element.closest('[aria-hidden="true"]') !== null);
  expect(cachee, "la marque est cachée aux lecteurs d'écran").toBe(true);
  await expect(page.getByRole("status").filter({ hasText: /record/i })).toHaveCount(0);
});

Then(
  /^Léa voit en entier la marque du record « ([^«»]+) », le temps qui reste et (\d+) calculs? réussis?$/,
  async ({ page }, texte: string, reussis: string | number) => {
    const largeur = page.viewportSize()?.width ?? 0;
    await expect(marqueDuRecord(page)).toHaveText(texte);
    await expect(page.getByTestId("temps-restant")).toBeVisible();
    await expect(page.getByTestId("calculs-reussis")).toHaveAttribute("data-score", String(reussis));
    for (const element of [marqueDuRecord(page), page.getByTestId("temps-restant"), page.getByTestId("calculs-reussis")]) {
      await expect(element).toBeVisible();
      const boite = await element.boundingBox();
      expect(boite, "élément visible").not.toBeNull();
      expect(boite?.x ?? -1).toBeGreaterThanOrEqual(0);
      expect((boite?.x ?? 0) + (boite?.width ?? 0), "l'élément finit dans l'écran").toBeLessThanOrEqual(largeur);
    }
    const debordement = await marqueDuRecord(page).evaluate((element) => element.scrollWidth - element.clientWidth);
    expect(debordement, "le texte de la marque n'est pas coupé").toBeLessThanOrEqual(0);
  },
);

Then(/^Léa voit les chiffres des touches et la marque du record en mode dys : .+$/, async ({ page }) => {
  await expect(marqueDuRecord(page)).toBeVisible();
  const chiffres = await clavier(page).getByTestId("cristal").all();
  await verifierModeDys(page, [...chiffres, marqueDuRecord(page)], true);
});
