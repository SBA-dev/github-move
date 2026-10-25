import { expect, type Locator, type Page } from "@playwright/test";
import { createBdd } from "playwright-bdd";
import { inscrireUneSeanceDeCalcul, inscrireUnRecordDeFluence, lireLesRecordsEnRest } from "../support/calcul-api.ts";
import type { Famille } from "../support/famille.ts";
import { type Monde, test } from "./fixtures.ts";
import {
  bulle,
  etat,
  injecter,
  type LeconBrute,
  leconDeTest,
  leconDeTitre,
  ouvrirLaPageDeLaLecon,
  recipient,
  toutesLesParoles,
} from "./etapes-puis-exercices.steps.ts";
import { demarrer, etatDesChoix, leconDeLExercice, positionDeLExercice } from "./exercices-a-choix.steps.ts";
import { attendreLaFinDeLaSeance, partie } from "./etoiles-et-fin-de-seance.steps.ts";
import { estSurUnProfilReel, jouerAvecLeProfilReel } from "./profil-reel.ts";
import { assurerLeProfil, jetonDe, profilDe } from "./profils-enfants.steps.ts";
import { cleDe, EXPRESSIONS_PAR_PERSONNAGE, FELICITATIONS_COMMUNES, preparerProfil } from "./univers.steps.ts";
import { attendreUneLecture, journal, laisserPasserLeDelaiDeLecture, normaliser, terminerLaLecture } from "./voix.steps.ts";

// Story #20 : calcul (choix au CP, clavier de cristaux ensuite), fluence (contre la montre) et addition posée.
//
// Tous les steps de ce fichier sont réservés à @issue-20 (tags de createBdd) : quand un step de la story existe déjà
// ailleurs avec le même texte (une étape « dépend de la story #20 » de #23 ou #24), c'est celui-ci qui sert à #20, et
// les autres stories gardent le leur.
//
// L'enfant joue comme à l'écran : il touche un choix, tape sur les cristaux, touche un chiffre puis la maison de sa
// colonne. Les opérations sont lues sur l'écran et résolues par le test, jamais lues dans l'application.
// Fluence : la durée passe en figeant l'horloge du navigateur (page.clock.setFixedTime), jamais en attendant 45 s.
// Les leçons de test sont ajoutées à la réponse de /bibliotheque.json par le navigateur du test (voir #16).

const { Given, When, Then } = createBdd(test, { tags: "@issue-20 or @issue-65" });

type Acteur = "Léa" | "Tom" | "Nina";
type Exercice = Record<string, unknown>;

const SECONDE_EN_MS = 1000;
const DIX_MINUTES_EN_MS = 600_000;
const DELAI_D_UN_APPEL_SERVEUR_MS = 20_000;
const FILE_DU_TIRAGE_DU_CALCUL = "__tirageDuCalcul";
const ENCOURAGEMENTS_DE_NOISETTE = [
  "Oups, presque !",
  "Hmm, pas tout à fait…",
  "Pas grave, on réessaie !",
  "Ah, celle-là est piégeuse !",
  "Presque ! Regarde bien.",
];
const FELICITATIONS_DE_NOISETTE = [...FELICITATIONS_COMMUNES, ...(EXPRESSIONS_PAR_PERSONNAGE["Noisette"] ?? [])];
const RANGS: Readonly<Record<string, string>> = { unités: "unites", dizaines: "dizaines" };
const COULEURS_DE_FOND: Readonly<Record<string, string>> = { rose: "rgb(255, 220, 238)", bleue: "rgb(220, 236, 255)" };

// --- Ce que le scénario prépare, page par page

type Partie20 = {
  acteur: Acteur;
  exercicesDeTest: Exercice[];
  niveauDeTest: string | undefined;
  lecon: LeconBrute | undefined;
  titreExercice: string | undefined;
  tirage: number[] | undefined;
  nombreTape: string | undefined;
  paroles: number;
  maintenant: Date;
  fluence: string | undefined;
  accueilsDeFluenceDits: number;
  tomPrepare: boolean;
};

const parties = new WeakMap<Page, Partie20>();

export function partie20(page: Page): Partie20 {
  let courante = parties.get(page);
  if (!courante) {
    courante = {
      acteur: "Léa",
      exercicesDeTest: [],
      niveauDeTest: undefined,
      lecon: undefined,
      titreExercice: undefined,
      tirage: undefined,
      nombreTape: undefined,
      paroles: 0,
      maintenant: new Date(Date.now() - DIX_MINUTES_EN_MS),
      fluence: undefined,
      accueilsDeFluenceDits: 0,
      tomPrepare: false,
    };
    parties.set(page, courante);
  }
  return courante;
}

function echapper(texte: string): string {
  return texte.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function exactement(texte: string): RegExp {
  return new RegExp(`^\\s*${echapper(texte)}\\s*$`);
}

// --- Les opérations, lues à l'écran et résolues par le test

const OPERATION = /^(\d+) ([+−×:]) (\d+)$/;

export function enonceDeLaCarte(carte: string): string {
  return normaliser(carte).replace(/ = \?$| \?$/, "");
}

export function calculer(enonce: string): number {
  const lue = OPERATION.exec(enonce);
  if (!lue) throw new Error(`Opération inconnue : « ${enonce} »`);
  const a = Number(lue[1]);
  const b = Number(lue[3]);
  switch (lue[2]) {
    case "+":
      return a + b;
    case "−":
      return a - b;
    case "×":
      return a * b;
    default:
      return a / b;
  }
}

export function resultatDeLaCarte(lecon: LeconBrute | undefined, carte: string): number {
  const enonce = enonceDeLaCarte(carte);
  for (const exercice of lecon?.exercices ?? []) {
    if (exercice.type !== "calcul") continue;
    const operations = (exercice.operations ?? []) as Array<{ q: string; r: number }>;
    const connue = operations.find((operation) => operation.q === enonce);
    if (connue) return connue.r;
  }
  return calculer(enonce);
}

function carteCorrespond(carte: string, enonce: string): boolean {
  return enonceDeLaCarte(carte) === enonce;
}

function sommeDeLaPhrase(phrase: string): number {
  const termes = /combien font (.+) \?/.exec(normaliser(phrase))?.[1];
  if (termes === undefined) throw new Error(`Phrase de colonne inattendue : « ${phrase} »`);
  return termes.split(" + ").reduce((total, terme) => total + Number(terme), 0);
}

// --- Les écrans

export const carteDuCalcul = (page: Page) => page.getByTestId("carte-du-calcul");
export const clavier = (page: Page) => page.getByTestId("clavier-de-cristaux");
const choixDeLaQuestion = (page: Page) => page.getByTestId("choix-de-la-question");
const nombreTape = (page: Page) => page.getByTestId("nombre-tape");
export const fluence = (page: Page) => page.getByTestId("fluence");
export const finDeSeance = (page: Page) => page.getByTestId("fin-de-seance");
const phraseDeLaColonne = (page: Page) => page.getByTestId("phrase-de-la-colonne");

export function colonne(page: Page, libelle: string): Locator {
  return page.getByRole("group", { name: `Colonne des ${libelle}`, exact: true });
}

export async function lireLaCarte(page: Page): Promise<string> {
  await expect(carteDuCalcul(page)).toBeVisible({ timeout: DELAI_D_UN_APPEL_SERVEUR_MS });
  return normaliser((await carteDuCalcul(page).textContent()) ?? "");
}

async function questionsReussies(page: Page): Promise<number> {
  return Number((await recipient(page).getAttribute("data-questions-reussies")) ?? "0");
}

async function choisirExactement(page: Page, titre: string): Promise<void> {
  const exercice = page.getByTestId("exercice-propose").filter({
    has: page.locator(".intitule").filter({ hasText: exactement(titre) }),
  });
  await exercice.click();
  await expect(recipient(page)).toBeVisible({ timeout: DELAI_D_UN_APPEL_SERVEUR_MS });
}

// --- Le tirage : on donne des nombres au hasard de l'application, on ne le remplace pas (voir #17)

export async function forcerLeTirage(page: Page, nombres: number[]): Promise<void> {
  await page.evaluate(([cle, valeurs]) => {
    const reel = Math.random.bind(Math);
    Reflect.set(window, cle as string, valeurs);
    Math.random = () => {
      const file = Reflect.get(window, cle as string) as number[] | undefined;
      if (file && file.length > 0 && new Error().stack?.includes("/seance/hasard-navigateur")) return file.shift() as number;
      return reel();
    };
  }, [FILE_DU_TIRAGE_DU_CALCUL, nombres]);
}

/** Le nombre de Math.random qui fait tirer `valeur` dans [min, max] par `min + floor(r × (max − min + 1))`. */
export function tirageDe(valeur: number, [min, max]: readonly [number, number]): number {
  return (valeur - min + 0.5) / (max - min + 1);
}

const AU_PLUS_HAUT = 0.999;

// --- Lancer un exercice de calcul d'une leçon de test

function niveauDeLaLecon(p: Partie20): string {
  return p.niveauDeTest ?? (p.acteur === "Tom" ? "CE1" : "CP");
}

async function preparerLActeur(page: Page, monde: Monde): Promise<void> {
  const p = partie20(page);
  if (p.acteur !== "Tom" || p.tomPrepare || estSurUnProfilReel(page)) return;
  p.tomPrepare = true;
  const prepare = monde.profils.get("Tom") ?? { prenom: "Tom", niveau: "CE1", univers: cleDe("Animaux de la forêt") };
  await preparerProfil(page, prepare);
}

export async function lancerLExerciceDeTest(page: Page, monde: Monde): Promise<void> {
  const p = partie20(page);
  if (!p.lecon) {
    p.lecon = { ...leconDeTest("e2e-20-calcul", "Leçon de test e2e-20", p.exercicesDeTest), niveau: niveauDeLaLecon(p) };
    await injecter(page, p.lecon);
  }
  await preparerLActeur(page, monde);
  await ouvrirLaPageDeLaLecon(page, p.lecon.titre);
  if (p.tirage) await forcerLeTirage(page, p.tirage);
  const titre = p.titreExercice ?? "";
  etatDesChoix(page).exerciceUnique = positionDeLExercice(p.lecon, titre);
  await choisirExactement(page, titre);
}

export function preparerUnExercice(page: Page, monde: Monde, exercice: Exercice, niveau?: string): void {
  const p = partie20(page);
  p.exercicesDeTest = [exercice];
  p.titreExercice = String(exercice.titre);
  p.niveauDeTest = niveau ?? p.niveauDeTest;
  etatDesChoix(page).demarrage = () => lancerLExerciceDeTest(page, monde);
}

export function exerciceDeCalcul(operations: Array<{ q: string; r: number; aide?: string }>): Exercice {
  return { type: "calcul", titre: "Calcul de test", operations };
}

export function exerciceAGenerateur(generateur: Record<string, unknown>): Exercice {
  return { type: "calcul", titre: "Calcul de test", generateur };
}

// --- Répondre comme un enfant

export async function taperLesChiffres(page: Page, chiffres: string, force = false): Promise<void> {
  for (const chiffre of chiffres) await clavier(page).getByRole("button", { name: chiffre, exact: true }).click({ force });
}

export async function valider(page: Page, force = false): Promise<void> {
  await clavier(page).getByRole("button", { name: "Valider", exact: true }).click({ force });
}

export async function repondreAuNombre(page: Page, nombre: number | string): Promise<void> {
  await expect(clavier(page).or(choixDeLaQuestion(page))).toBeVisible({ timeout: DELAI_D_UN_APPEL_SERVEUR_MS });
  if (await clavier(page).isVisible()) {
    await taperLesChiffres(page, String(nombre));
    await valider(page);
  } else {
    await choixDeLaQuestion(page).getByRole("button", { name: String(nombre), exact: true }).click();
  }
}

export async function figee(page: Page): Promise<boolean> {
  const touche = clavier(page).or(choixDeLaQuestion(page)).getByRole("button").first();
  return (await touche.getAttribute("aria-disabled")) === "true";
}

/** Laisse Noisette finir de féliciter, jusqu'à la suite : le prochain calcul prêt, ou la fin de la séance. */
export async function attendreLaSuiteApresUneReussite(page: Page, reussiesAvant: number): Promise<void> {
  await expect.poll(async () => {
    if (await finDeSeance(page).isVisible()) return true;
    if ((await questionsReussies(page)) > reussiesAvant && !(await figee(page))) return true;
    await terminerLaLecture(page);
    return false;
  }, { intervals: [100], timeout: DELAI_D_UN_APPEL_SERVEUR_MS }).toBe(true);
}

export async function reussirLeCalcul(page: Page, lecon: LeconBrute | undefined): Promise<string> {
  const carte = await lireLaCarte(page);
  const reussies = await questionsReussies(page);
  await repondreAuNombre(page, resultatDeLaCarte(lecon, carte));
  await attendreLaSuiteApresUneReussite(page, reussies);
  return carte;
}

export async function allerAuCalcul(page: Page, enonce: string): Promise<void> {
  const lecon = partie20(page).lecon ?? etat(page).courante;
  for (let essai = 0; essai < 30; essai++) {
    const carte = await lireLaCarte(page);
    if (carteCorrespond(carte, enonce)) return;
    await reussirLeCalcul(page, lecon);
  }
  throw new Error(`Le calcul « ${enonce} » n'est jamais venu`);
}

/** Joue tous les calculs de l'exercice (en répondant juste) et rend, dans l'ordre, ce que l'enfant a vu. */
async function jouerTousLesCalculs(page: Page): Promise<string[]> {
  const total = Number(await recipient(page).getAttribute("data-total"));
  const lecon = partie20(page).lecon;
  const cartes: string[] = [];
  for (let rang = 0; rang < total; rang++) cartes.push(await reussirLeCalcul(page, lecon));
  return cartes;
}

// --- Les paroles de Noisette, lues dans le journal de la voix

async function dites(page: Page): Promise<string> {
  return normaliser((await toutesLesParoles(page)).join(" "));
}

/** Attend que Noisette ait dit ce texte, en laissant finir ce qui précède mais jamais la parole attendue. */
async function attendreQueNoisetteDise(page: Page, dit: (tout: string) => boolean): Promise<void> {
  await expect.poll(async () => {
    if (dit(await dites(page))) return true;
    await terminerLaLecture(page);
    return false;
  }, { intervals: [100], timeout: DELAI_D_UN_APPEL_SERVEUR_MS }).toBe(true);
}

function compter(tout: string, motif: string): number {
  return tout.split(motif).length - 1;
}

// --- Parent connecté et profil réel (records et historique : tout passe par Supabase)

async function jouerEnProfilReel(famille: Famille, monde: Monde, page: Page, prenom: string): Promise<void> {
  if (estSurUnProfilReel(page)) return;
  if ((await famille.session(page)) === null) await famille.connecterSansEmail("tablette", "Paul");
  await jouerAvecLeProfilReel(famille, monde, page, prenom);
}

function profilPrepare(monde: Monde, prenom: string) {
  return monde.profils.get(prenom) ?? { prenom, niveau: "CP", univers: cleDe("Animaux de la forêt") };
}

// =====================================================================================================
// Règle 1 : choix au CP, clavier de cristaux à partir du CE1
// =====================================================================================================

Given(/^(?:Léa|Tom) joue seulement l'exercice « ([^«»]+) » de la leçon « ([^«»]+) »$/, async ({ page, monde }, exercice: string, titre: string) => {
  const p = partie20(page);
  p.lecon = leconDeTitre(page, titre);
  p.titreExercice = exercice;
  etatDesChoix(page).demarrage = () => lancerLExerciceDeTest(page, monde);
});

When(/^le calcul « ([^«»]+) » s'affiche(?: pour (Tom))?$/, async ({ page }, enonce: string, tom: string | undefined) => {
  if (tom) partie20(page).acteur = "Tom";
  await demarrer(page);
  await allerAuCalcul(page, enonce);
});

When(/^le calcul s'affiche$/, async ({ page }) => {
  await demarrer(page);
  await lireLaCarte(page);
});

Given(
  /^une leçon de test(?: de niveau (CP|CE1))? a un exercice calcul « ([^«»]+) », de résultat ([0-9]+)(?:, d'aide « ([^«»]+) »|, sans aide)?$/,
  async ({ page, monde }, niveau: string | undefined, enonce: string, resultat: string, aide: string | undefined) => {
    const operation = { q: enonce, r: Number(resultat), ...(aide == null ? {} : { aide }) };
    preparerUnExercice(page, monde, exerciceDeCalcul([operation]), niveau);
  },
);

Then(/^(?:Léa|Tom) voit « ([^«»]+ = \?) » et les choix « ([0-9]+) », « ([0-9]+) », « ([0-9]+) » et « ([0-9]+) »$/, async ({ page }, carte: string, a: string, b: string, c: string, d: string) => {
  const choix = [a, b, c, d];
  await expect(carteDuCalcul(page)).toHaveText(carte);
  await expect.poll(async () => (await page.getByTestId("choix").allTextContents()).map(normaliser).sort()).toEqual([...choix].sort());
});

Then(/^Léa voit exactement les choix « ([0-9]+) », « ([0-9]+) » et « ([0-9]+) »$/, async ({ page }, a: string, b: string, c: string) => {
  const choix = [a, b, c];
  await expect(page.getByTestId("choix")).toHaveCount(choix.length);
  expect((await page.getByTestId("choix").allTextContents()).map(normaliser).sort()).toEqual([...choix].sort());
});

Then(/^Tom voit le clavier de cristaux, avec les chiffres de 0 à 9, « Effacer » et « Valider »$/, async ({ page }) => {
  await expect(clavier(page)).toBeVisible();
  await expect(page.getByTestId("cristal")).toHaveText(["1", "2", "3", "4", "5", "6", "7", "8", "9", "0"]);
  await expect(clavier(page).getByRole("button", { name: "Effacer", exact: true })).toBeVisible();
  await expect(clavier(page).getByRole("button", { name: "Valider", exact: true })).toBeVisible();
});

Then(/^aucun choix n'est proposé$/, async ({ page }) => {
  await expect(choixDeLaQuestion(page)).toHaveCount(0);
  await expect(page.getByTestId("choix")).toHaveCount(0);
});

Given(
  /^Tom en est au calcul « ([^«»]+) » d'une leçon de test de niveau (CP|CE1)$/,
  async ({ page, monde }, enonce: string, niveau: string) => {
    partie20(page).acteur = "Tom";
    preparerUnExercice(page, monde, exerciceDeCalcul([{ q: enonce, r: calculer(enonce) }]), niveau);
    await demarrer(page);
    await allerAuCalcul(page, enonce);
  },
);

When(/^Tom répond « ([0-9]+) » au clavier de cristaux$/, async ({ page }, nombre: string) => {
  await attendreUneLecture(page);
  await taperLesChiffres(page, nombre);
  await expect(nombreTape(page)).toHaveText(nombre);
  partie20(page).nombreTape = nombre;
  await valider(page);
});

Then(/^le nombre « ([0-9]+) » s'efface$/, async ({ page }, nombre: string) => {
  expect(partie20(page).nombreTape).toBe(nombre);
  await expect(nombreTape(page)).toHaveText("");
});

Then(/^le calcul « ([^«»]+) » reste posé$/, async ({ page }, enonce: string) => {
  expect(enonceDeLaCarte(await lireLaCarte(page))).toBe(enonce);
  expect(await questionsReussies(page)).toBe(0);
  expect(await figee(page)).toBe(false);
});

When(/^Tom valide sans avoir tapé de chiffre$/, async ({ page }) => {
  await attendreUneLecture(page);
  await laisserPasserLeDelaiDeLecture(page);
  partie20(page).paroles = (await journal(page)).speaks;
  await expect(nombreTape(page)).toHaveText("");
  await valider(page);
});

Then(/^Noisette ne dit rien$/, async ({ page }) => {
  await laisserPasserLeDelaiDeLecture(page);
  expect((await journal(page)).speaks).toBe(partie20(page).paroles);
  await expect(bulle(page)).not.toHaveAttribute("data-nature", "encouragement");
  await expect(bulle(page)).not.toHaveAttribute("data-nature", "felicitation");
});

When(/^Tom tape les chiffres ((?:\d, )*\d et \d)$/, async ({ page }, liste: string) => {
  await taperLesChiffres(page, (liste.match(/\d/g) ?? []).join(""));
});

Then(/^Tom voit « ([0-9]+) »$/, async ({ page }, nombre: string) => {
  await expect(nombreTape(page)).toHaveText(nombre);
});

// =====================================================================================================
// Règle 2 : les opérations tirées et la difficulté
// =====================================================================================================

Given(
  /^une leçon de test a un exercice calcul dont le générateur tire ([0-9]+) additions de deux nombres entre ([0-9]+) et ([0-9]+)$/,
  async ({ page, monde }, combien: string, min: string, max: string) => {
    const intervalle = [Number(min), Number(max)];
    preparerUnExercice(page, monde, exerciceAGenerateur({ op: "+", a: intervalle, b: intervalle, combien: Number(combien) }));
  },
);

Given(/^une leçon de test a un exercice calcul dont le générateur tire des soustractions$/, async ({ page, monde }) => {
  preparerUnExercice(page, monde, exerciceAGenerateur({ op: "-", a: [1, 10], b: [1, 10], combien: 1 }));
});

Given(/^les nombres tirés sont ([0-9]+) puis ([0-9]+)$/, async ({ page }, premier: string, second: string) => {
  partie20(page).tirage = [tirageDe(Number(premier), [1, 10]), tirageDe(Number(second), [1, 10])];
});

Given(/^une leçon de test a un exercice calcul sans opérations ni générateur$/, async ({ page, monde }) => {
  preparerUnExercice(page, monde, { type: "calcul", titre: "Calcul de test" });
});

// Le premier calcul tiré prend les plus grands nombres que l'intervalle réellement utilisé permet : si la difficulté
// s'adapte, ce plus grand nombre est 13 ; sinon c'est 20. Les autres calculs restent tirés au hasard.
Given(
  /^une leçon de test a un exercice calcul dont le générateur tire des additions de deux nombres entre ([0-9]+) et ([0-9]+)$/,
  async ({ page, monde }, min: string, max: string) => {
    const intervalle = [Number(min), Number(max)];
    preparerUnExercice(page, monde, exerciceAGenerateur({ op: "+", a: intervalle, b: intervalle, combien: 3 }));
    partie20(page).tirage = [AU_PLUS_HAUT, AU_PLUS_HAUT];
  },
);

When(/^Tom commence cet exercice$/, async ({ page }) => {
  partie20(page).acteur = "Tom";
  await demarrer(page);
  await lireLaCarte(page);
});

Then(/^Léa a ([0-9]+) calculs? à faire$/, async ({ page }, nombre: string) => {
  await expect(recipient(page)).toHaveAttribute("data-total", nombre);
});

function additionneDeuxNombres(carte: string): [number, number] {
  const lue = /^(\d+) \+ (\d+)$/.exec(enonceDeLaCarte(carte));
  if (!lue) throw new Error(`Addition attendue : « ${carte} »`);
  return [Number(lue[1]), Number(lue[2])];
}

Then(/^chaque calcul additionne deux nombres entre ([0-9]+) et ([0-9]+)$/, async ({ page }, min: string, max: string) => {
  const cartes = await jouerTousLesCalculs(page);
  expect(cartes.length).toBeGreaterThan(0);
  for (const carte of cartes) {
    for (const nombre of additionneDeuxNombres(carte)) {
      expect(nombre, `nombre de « ${carte} »`).toBeGreaterThanOrEqual(Number(min));
      expect(nombre, `nombre de « ${carte} »`).toBeLessThanOrEqual(Number(max));
    }
  }
  if (partie20(page).tirage) expect(additionneDeuxNombres(cartes[0] ?? ""), "plus grands nombres permis").toEqual([Number(max), Number(max)]);
});

Then(/^les nombres tirés peuvent aller jusqu'à ([0-9]+)$/, async ({ page }, max: string) => {
  const cartes = await jouerTousLesCalculs(page);
  for (const carte of cartes) {
    for (const nombre of additionneDeuxNombres(carte)) expect(nombre).toBeLessThanOrEqual(Number(max));
  }
  expect(additionneDeuxNombres(cartes[0] ?? ""), "plus grands nombres permis").toEqual([Number(max), Number(max)]);
});

Then(/^Léa voit « ([^«»]+ = \?) »$/, async ({ page }, carte: string) => {
  await expect(carteDuCalcul(page)).toHaveText(carte);
});

// --- L'historique de Tom : de vraies séances terminées dans Supabase, lues sous RLS par l'application

async function inscrireDansLHistoireDeTom(
  famille: Famille,
  monde: Monde,
  page: Page,
  seance: { reussites: number; erreurs: number; ilYaJours: number },
): Promise<void> {
  partie20(page).acteur = "Tom";
  await jouerEnProfilReel(famille, monde, page, "Tom");
  await inscrireUneSeanceDeCalcul(profilDe(famille, "Tom").id, seance);
}

Given(
  /^les 50 dernières réponses de calcul de Tom comptent ([0-9]+) réponses justes et ([0-9]+) fausses$/,
  async ({ famille, monde, page }, justes: string, fausses: string) => {
    await inscrireDansLHistoireDeTom(famille, monde, page, { reussites: Number(justes), erreurs: Number(fausses), ilYaJours: 1 });
  },
);

Given(/^Tom s'est souvent trompé en calcul autrefois$/, async ({ famille, monde, page }) => {
  await inscrireDansLHistoireDeTom(famille, monde, page, { reussites: 2, erreurs: 28, ilYaJours: 30 });
});

Given(/^ses 50 dernières réponses de calcul comptent ([0-9]+) réponses justes$/, async ({ famille, monde, page }, justes: string) => {
  await inscrireDansLHistoireDeTom(famille, monde, page, { reussites: Number(justes), erreurs: 50 - Number(justes), ilYaJours: 1 });
});

Given(/^Tom n'a donné que ([0-9]+) réponses de calcul, toutes fausses$/, async ({ famille, monde, page }, nombre: string) => {
  await inscrireDansLHistoireDeTom(famille, monde, page, { reussites: 0, erreurs: Number(nombre), ilYaJours: 1 });
});

// =====================================================================================================
// Règle 3 : l'aide après une erreur de calcul
// =====================================================================================================

Given(/^Léa en est au calcul « ([^«»]+) »$/, async ({ page }, enonce: string) => {
  await demarrer(page);
  await allerAuCalcul(page, enonce);
});

When(/^(Léa|Tom) répond « ([^«»]+) » à « ([^«»]+) »$/, async ({ page }, acteur: string, reponse: string, question: string) => {
  partie20(page).acteur = acteur as Acteur;
  await demarrer(page);
  await allerAuCalcul(page, question);
  const avant = (await journal(page)).speaks;
  await repondreAuNombre(page, reponse);
  await expect.poll(async () => (await journal(page)).speaks).toBeGreaterThan(avant);
});

Then(/^Noisette dit seulement un encouragement$/, async ({ page }) => {
  await expect(bulle(page)).toHaveAttribute("data-nature", "encouragement");
  expect(ENCOURAGEMENTS_DE_NOISETTE).toContain(normaliser((await bulle(page).textContent()) ?? ""));
});

// =====================================================================================================
// Règle 4 : la fluence
// =====================================================================================================

function dureeDeLaFluence(page: Page): number {
  const lecon = leconDeLExercice(page, partie20(page).fluence ?? "");
  const exercice = lecon.exercices.find((candidat) => candidat.titre === partie20(page).fluence);
  return Number(exercice?.duree ?? 60);
}

export async function ouvrirLaFluence(page: Page, titre: string): Promise<void> {
  const p = partie20(page);
  p.fluence = titre;
  const lecon = leconDeLExercice(page, titre);
  p.lecon = lecon;
  await ouvrirLaPageDeLaLecon(page, lecon.titre);
  etatDesChoix(page).exerciceUnique = positionDeLExercice(lecon, titre);
  await choisirExactement(page, titre);
  await expect(fluence(page)).toHaveAttribute("data-etat", "accueil");
}

const ACCUEIL_DE_LA_FLUENCE = "Calcul rapide ! Tu as ";

/** Le signal de départ : l'enfant touche « C'est parti ! » une fois l'accueil dit. Le temps est figé à cet instant. */
export async function donnerLeSignalDeDepart(page: Page): Promise<void> {
  const p = partie20(page);
  p.accueilsDeFluenceDits += 1;
  const attendus = p.accueilsDeFluenceDits;
  await attendreQueNoisetteDise(page, (tout) => compter(tout, ACCUEIL_DE_LA_FLUENCE) >= attendus);
  await page.clock.setFixedTime(p.maintenant);
  await page.getByTestId("c-est-parti").click();
  await expect(fluence(page)).toHaveAttribute("data-etat", "en-cours");
  await attendreQueNoisetteDise(page, (tout) => tout.includes("C'est parti !"));
}

async function score(page: Page): Promise<number> {
  return Number(await page.getByTestId("calculs-reussis").getAttribute("data-score"));
}

async function reussirUnCalculDeFluence(page: Page): Promise<void> {
  const avant = await score(page);
  const carte = await lireLaCarte(page);
  await repondreAuNombre(page, resultatDeLaCarte(partie20(page).lecon, carte));
  await expect(page.getByTestId("calculs-reussis")).toHaveAttribute("data-score", String(avant + 1));
}

async function reussirDesCalculsDeFluence(page: Page, nombre: number): Promise<void> {
  for (let rang = 0; rang < nombre; rang++) await reussirUnCalculDeFluence(page);
}

/** La durée passe d'un coup : l'horloge du navigateur avance au-delà de la durée de la fluence. */
export async function laisserPasserLeTemps(page: Page): Promise<void> {
  const p = partie20(page);
  p.maintenant = new Date(p.maintenant.getTime() + (dureeDeLaFluence(page) + 1) * SECONDE_EN_MS);
  await page.clock.setFixedTime(p.maintenant);
  await expect(fluence(page)).toHaveAttribute("data-etat", "finie");
}

Given(/^Léa a choisi seulement l'exercice « ([^«»]+) »$/, async ({ page }, titre: string) => {
  await ouvrirLaFluenceDeLaPage(page, titre);
});

async function ouvrirLaFluenceDeLaPage(page: Page, titre: string): Promise<void> {
  const p = partie20(page);
  p.fluence = titre;
  p.lecon = etat(page).courante ?? leconDeLExercice(page, titre);
  etatDesChoix(page).exerciceUnique = positionDeLExercice(p.lecon, titre);
  await choisirExactement(page, titre);
  await expect(fluence(page)).toHaveAttribute("data-etat", "accueil");
}

When(/^Noisette dit « C'est parti ! »$/, async ({ page }) => {
  await donnerLeSignalDeDepart(page);
});

Then(/^Léa voit le temps qui reste, ([0-9]+) secondes, et ([0-9]+) calculs? réussis?$/, async ({ page }, secondes: string, reussis: string) => {
  await expect(page.getByTestId("temps-restant")).toHaveText(`${secondes} secondes`);
  await expect(page.getByTestId("calculs-reussis")).toHaveAttribute("data-score", reussis);
});

Then(/^chaque bonne réponse ajoute 1 calcul réussi$/, async ({ page }) => {
  await reussirDesCalculsDeFluence(page, 3);
});

Given(/^Léa fait la fluence « ([^«»]+) »(?:, avec ([0-9]+) calculs? réussis?)?$/, async ({ page }, titre: string, reussis: string | undefined) => {
  await ouvrirLaFluence(page, titre);
  await donnerLeSignalDeDepart(page);
  await reussirDesCalculsDeFluence(page, Number(reussis ?? 0));
});

When(/^Léa donne une réponse fausse$/, async ({ page }) => {
  const carte = await lireLaCarte(page);
  partie20(page).paroles = (await journal(page)).speaks;
  await repondreAuNombre(page, resultatDeLaCarte(partie20(page).lecon, carte) + 1);
});

Then(/^la réponse s'efface$/, async ({ page }) => {
  await expect(nombreTape(page)).toHaveText("");
});

Then(/^Léa voit (?:toujours )?([0-9]+) calculs? réussis?$/, async ({ page }, reussis: string) => {
  await expect(page.getByTestId("calculs-reussis")).toHaveAttribute("data-score", reussis);
  await expect(page.getByTestId("calculs-reussis")).toHaveText(`${reussis} calcul${Number(reussis) > 1 ? "s" : ""} réussi${Number(reussis) > 1 ? "s" : ""}`);
});

Then(/^Noisette ne dit aucun encouragement$/, async ({ page }) => {
  await laisserPasserLeDelaiDeLecture(page);
  expect((await journal(page)).speaks).toBe(partie20(page).paroles);
  await expect(bulle(page)).not.toHaveAttribute("data-nature", "encouragement");
});

Given(/^le temps de la fluence est écoulé$/, async ({ page }) => {
  await laisserPasserLeTemps(page);
});

When(/^Léa donne une bonne réponse$/, async ({ page }) => {
  const carte = await lireLaCarte(page);
  const nombre = String(resultatDeLaCarte(partie20(page).lecon, carte));
  await taperLesChiffres(page, nombre, true);
  await valider(page, true);
});

// --- Les records : de vrais profils enfants, des records écrits par l'Edge Function ou préparés, lus sous RLS

Given(
  /^Léa (?:n'a pas encore de record|a un record de ([0-9]+)) à la fluence « ([^«»]+) »(, gagné sur la tablette)?$/,
  async ({ famille, monde, page }, record: string | undefined, titre: string, surLaTablette: string | undefined) => {
    const lecon = leconDeLExercice(page, titre);
    let profil: string;
    if (surLaTablette) {
      const cree = await assurerLeProfil(famille, "Paul", { prenom: "Léa", niveau: profilPrepare(monde, "Léa").niveau });
      profil = cree.id;
    } else {
      await jouerEnProfilReel(famille, monde, page, "Léa");
      profil = profilDe(famille, "Léa").id;
    }
    partie20(page).fluence = titre;
    if (record != null) await inscrireUnRecordDeFluence(profil, lecon.id, titre, Number(record));
  },
);

Given(/^Léa fait cette fluence$/, async ({ page }) => {
  await ouvrirLaFluence(page, partie20(page).fluence ?? "");
  await donnerLeSignalDeDepart(page);
});

When(/^le temps de la fluence est écoulé avec ([0-9]+) calculs? réussis?$/, async ({ page }, reussis: string) => {
  await reussirDesCalculsDeFluence(page, Number(reussis));
  await laisserPasserLeTemps(page);
});

Given(/^Léa a fini cette fluence avec ([0-9]+) calculs? réussis?$/, async ({ page }, reussis: string) => {
  await ouvrirLaFluence(page, partie20(page).fluence ?? "");
  await donnerLeSignalDeDepart(page);
  await reussirDesCalculsDeFluence(page, Number(reussis));
  await laisserPasserLeTemps(page);
  await attendreLaFinDeLaSeance(page);
});

When(/^Léa fait de nouveau cette fluence et la finit avec ([0-9]+) calculs? réussis?$/, async ({ page }, reussis: string) => {
  await finDeSeance(page).getByRole("button", { name: "Rejouer", exact: true }).click();
  await expect(fluence(page)).toHaveAttribute("data-etat", "accueil");
  await donnerLeSignalDeDepart(page);
  await reussirDesCalculsDeFluence(page, Number(reussis));
  await laisserPasserLeTemps(page);
});

function calculs(nombre: number): string {
  return `${nombre} calcul${nombre > 1 ? "s" : ""}`;
}

Then(/^Noisette dit « (?!C'est parti)([^«»]+) »$/, async ({ page }, texte: string) => {
  await attendreQueNoisetteDise(page, (tout) => tout.includes(normaliser(texte)));
});

Then(/^Noisette dit « ([^«»]+) », puis annonce son (premier|nouveau) record, ([0-9]+)$/, async ({ page }, score: string, genre: string, record: string) => {
  await attendreQueNoisetteDise(page, (tout) => tout.includes(`${normaliser(score)} Ton premier record`) || tout.includes(`${normaliser(score)} Nouveau record`));
  const tout = await dites(page);
  expect(tout).toContain(genre === "premier" ? `Ton premier record : ${calculs(Number(record))}` : `Nouveau record ! ${calculs(Number(record))}`);
});

Then(/^Noisette annonce son (premier|nouveau) record, ([0-9]+)$/, async ({ page }, genre: string, record: string) => {
  const phrase = genre === "premier" ? `Ton premier record : ${calculs(Number(record))}` : `Nouveau record ! ${calculs(Number(record))}`;
  await attendreQueNoisetteDise(page, (tout) => tout.includes(phrase));
});

Then(/^Noisette dit « ([^«»]+) », puis « ([^«»]+) »$/, async ({ page }, score: string, suite: string) => {
  await attendreQueNoisetteDise(page, (tout) => tout.includes(`${normaliser(score)} ${normaliser(suite)}`));
});

When(/^Claire demande les records du profil enfant de Léa$/, async ({ famille }) => {
  const telephone = await famille.page("telephone");
  const session = await famille.session(telephone);
  if (!session) throw new Error("Claire n'est pas connectée sur le téléphone");
  const profil = profilDe(famille, "Léa").id;
  // Témoin : le parent rattaché, lui, retrouve bien le record (sinon un résultat vide ne prouverait rien de la RLS).
  const duParentRattache = await lireLesRecordsEnRest(await jetonDe(famille, "Paul"), profil);
  expect(duParentRattache.lignes, "records vus par Paul").toHaveLength(1);
  partie(famille).lignesLues = await lireLesRecordsEnRest(session.access_token, profil);
});

Then(/^les lecteurs d'écran peuvent lire le temps qui reste et le nombre de calculs réussis$/, async ({ page }) => {
  const annonce = page.getByTestId("annonce-de-fluence");
  await expect(annonce).toHaveAttribute("role", "status");
  await expect(annonce).toHaveAttribute("aria-live", "polite");
  await expect(annonce).toHaveText(/^Il reste (plus de \d+|moins de \d+) secondes\. 1 calcul réussi\.$/);
  await expect(page.getByTestId("calculs-reussis")).toHaveText("1 calcul réussi");
});

When(/^Léa réussit un calcul$/, async ({ page }) => {
  await reussirUnCalculDeFluence(page);
});

// =====================================================================================================
// Règle 5 : l'addition posée
// =====================================================================================================

Given(
  /^(Nina) a un profil enfant préparé de niveau (\S+) dans l'univers « (.+) »$/,
  async ({ page, monde }, prenom: string, niveau: string, univers: string) => {
    const profil = { prenom, niveau, univers: cleDe(univers) };
    monde.profils.set(prenom, profil);
    partie20(page).acteur = "Nina";
    await preparerProfil(page, profil);
  },
);

async function ouvrirLExercice(page: Page, titre: string): Promise<void> {
  const lecon = leconDeLExercice(page, titre);
  partie20(page).lecon = lecon;
  await ouvrirLaPageDeLaLecon(page, lecon.titre);
  etatDesChoix(page).exerciceUnique = positionDeLExercice(lecon, titre);
  await choisirExactement(page, titre);
}

When(
  /^Nina commence l'exercice « ([^«»]+) » de la leçon « ([^«»]+) »$/,
  async ({ page }, exercice: string, _titreDeLaLecon: string) => {
    await ouvrirLExercice(page, exercice);
  },
);

Then(
  /^Nina voit la colonne des dizaines en rose, à gauche, et la colonne des unités en bleu, à droite$/,
  async ({ page }) => {
    const dizaines = colonne(page, "dizaines");
    const unites = colonne(page, "unités");
    await expect(dizaines).toHaveAttribute("data-couleur", "rose");
    await expect(unites).toHaveAttribute("data-couleur", "bleue");
    await expect(dizaines).toHaveCSS("background-color", COULEURS_DE_FOND["rose"] ?? "");
    await expect(unites).toHaveCSS("background-color", COULEURS_DE_FOND["bleue"] ?? "");
    const [boiteDizaines, boiteUnites] = [await dizaines.boundingBox(), await unites.boundingBox()];
    expect(boiteDizaines && boiteUnites && boiteDizaines.x + boiteDizaines.width <= boiteUnites.x).toBe(true);
  },
);

async function attendreLEtape(page: Page, etape: "poser" | "calculer"): Promise<void> {
  await expect(page.getByTestId("addition-posee")).toHaveAttribute("data-etape", etape, { timeout: DELAI_D_UN_APPEL_SERVEUR_MS });
}

async function chiffresDeLAddition(page: Page): Promise<number[]> {
  const operation = normaliser((await page.getByTestId("operation-posee").textContent()) ?? "");
  return operation.split(" + ").map(Number);
}

async function nombreDeChiffresPoses(page: Page): Promise<number> {
  return await page.getByTestId("chiffre-pose").count();
}

async function poserUnChiffre(page: Page, chiffre: string, libelleDuRang: string): Promise<void> {
  const poses = await nombreDeChiffresPoses(page);
  const paroles = (await journal(page)).speaks;
  await page.getByTestId("chiffre-a-poser").filter({ hasText: exactement(chiffre) }).first().click();
  await colonne(page, libelleDuRang).getByTestId("maison-de-la-colonne").click();
  await expect.poll(async () => (await nombreDeChiffresPoses(page)) > poses || (await journal(page)).speaks > paroles).toBe(true);
}

const LIBELLES_DES_RANGS = ["unités", "dizaines", "centaines"] as const;

async function poserLeNombre(page: Page, nombre: number): Promise<void> {
  const chiffres = String(nombre).split("");
  for (const [position, chiffre] of chiffres.entries()) {
    const libelle = LIBELLES_DES_RANGS[chiffres.length - 1 - position] ?? "unités";
    await poserUnChiffre(page, chiffre, libelle);
  }
}

async function poserTousLesNombres(page: Page): Promise<void> {
  for (const nombre of await chiffresDeLAddition(page)) {
    await expect(page.getByTestId("chiffres-a-poser")).toBeVisible();
    await poserLeNombre(page, nombre);
  }
}

Given(/^Léa joue l'exercice « ([^«»]+) » à l'étape (poser|calculer)$/, async ({ page }, exercice: string, etape: string) => {
  await ouvrirLExercice(page, exercice);
  await attendreLEtape(page, "poser");
  if (etape === "calculer") {
    await poserTousLesNombres(page);
    await attendreLEtape(page, "calculer");
  }
});

Given(/^une leçon de test a une addition posée « ([^«»]+) » à l'étape (poser|calculer)$/, async ({ page, monde }, addition: string, etape: string) => {
  const nombres = addition.split(" + ").map(Number);
  preparerUnExercice(page, monde, { type: "addition", titre: "Addition de test", operations: [nombres], etapes: [etape] });
});

async function commencerLAdditionDeTest(page: Page): Promise<void> {
  await demarrer(page);
  await expect(page.getByTestId("addition-posee")).toBeVisible({ timeout: DELAI_D_UN_APPEL_SERVEUR_MS });
}

Given(/^Léa a posé le nombre ([0-9]+)$/, async ({ page }, nombre: string) => {
  await commencerLAdditionDeTest(page);
  await poserLeNombre(page, Number(nombre));
});

When(
  /^Léa (?:a posé|pose) le (?:premier |second )?(?:chiffre )?« (\d) » (?:de|du nombre) ([0-9]+) dans la colonne des (unités|dizaines)$/,
  async ({ page }, chiffre: string, _nombre: string, rang: string) => {
    await commencerLAdditionDeTest(page);
    await poserUnChiffre(page, chiffre, rang);
  },
);

Then(/^le chiffre « (\d) » reste dans la colonne des (unités|dizaines)$/, async ({ page }, chiffre: string, rang: string) => {
  await expect(colonne(page, rang).getByTestId("chiffre-pose").filter({ hasText: exactement(chiffre) })).toHaveCount(1);
});

Then(/^le chiffre « (\d) » revient parmi les chiffres à poser$/, async ({ page }, chiffre: string) => {
  await expect(page.getByTestId("chiffres-a-poser").getByTestId("chiffre-a-poser").filter({ hasText: exactement(chiffre) })).toHaveCount(1);
  await expect(page.getByTestId("chiffre-pose")).toHaveCount(0);
});

// --- L'étape calculer

async function colonneEnCours(page: Page): Promise<string> {
  const rang = await page.getByTestId("colonne").evaluateAll((colonnes) =>
    colonnes.find((c) => c.getAttribute("data-en-cours") === "true")?.getAttribute("data-rang") ?? ""
  );
  return rang;
}

async function verifierLaColonneEnCours(page: Page, libelle: string): Promise<void> {
  await expect(phraseDeLaColonne(page)).toBeVisible({ timeout: DELAI_D_UN_APPEL_SERVEUR_MS });
  expect(await colonneEnCours(page)).toBe(RANGS[libelle]);
}

async function calculerLaColonneEnCours(page: Page): Promise<void> {
  await expect(phraseDeLaColonne(page)).toBeVisible({ timeout: DELAI_D_UN_APPEL_SERVEUR_MS });
  const phrase = (await phraseDeLaColonne(page).textContent()) ?? "";
  const reussies = await questionsReussies(page);
  await repondreAuNombre(page, sommeDeLaPhrase(phrase));
  await expect.poll(async () => await questionsReussies(page)).toBeGreaterThan(reussies);
}

Given(/^Léa a calculé la colonne des (unités|dizaines)$/, async ({ page }, libelle: string) => {
  await commencerLAdditionDeTest(page);
  await attendreLEtape(page, "calculer");
  await verifierLaColonneEnCours(page, libelle);
  await calculerLaColonneEnCours(page);
});

When(
  /^Léa répond « ([0-9]+) » pour la colonne des (unités|dizaines)$/,
  async ({ page }, nombre: string, libelle: string) => {
    await verifierLaColonneEnCours(page, libelle);
    const reussies = await questionsReussies(page);
    const paroles = (await journal(page)).speaks;
    await repondreAuNombre(page, nombre);
    await expect.poll(async () => (await questionsReussies(page)) > reussies || (await journal(page)).speaks > paroles).toBe(true);
  },
);

When(/^la colonne des (unités|dizaines) est à calculer$/, async ({ page }, libelle: string) => {
  await attendreLEtape(page, "calculer");
  await verifierLaColonneEnCours(page, libelle);
});

Then(/^Léa voit les choix « ([0-9]+) », « ([0-9]+) », « ([0-9]+) » et « ([0-9]+) »$/, async ({ page }, a: string, b: string, c: string, d: string) => {
  const choix = [a, b, c, d];
  await expect(page.getByTestId("choix")).toHaveCount(choix.length);
  expect((await page.getByTestId("choix").allTextContents()).map(normaliser).sort()).toEqual([...choix].sort());
});

Then(
  /^Léa voit « ([0-9]+) » écrit sous la colonne des (unités|dizaines), et la retenue « ([0-9]+) » en haut de la colonne des (unités|dizaines)$/,
  async ({ page }, ecrit: string, rangEcrit: string, retenue: string, rangRetenue: string) => {
    await expect(colonne(page, rangEcrit).getByTestId("chiffre-ecrit")).toHaveText(ecrit);
    await expect(colonne(page, rangRetenue).getByTestId("retenue")).toHaveText(retenue);
  },
);

Then(/^la retenue « ([0-9]+) » apparaît en haut de la colonne des (unités|dizaines), sans mouvement$/, async ({ page }, retenue: string, rang: string) => {
  const marque = colonne(page, rang).getByTestId("retenue");
  await expect(marque).toHaveText(retenue);
  await expect(marque).toHaveAttribute("data-mouvement", "aucun");
  await expect(marque).toHaveCSS("animation-name", "none");
  await expect(marque).toHaveCSS("transform", "none");
});

Then(/^Léa voit le résultat « ([0-9]+) »$/, async ({ page }, resultat: string) => {
  await expect(page.getByTestId("resultat")).toHaveText(resultat);
});

Then(/^Noisette dit « ([^«»]+) », suivi d'une félicitation$/, async ({ page }, debut: string) => {
  await expect(bulle(page)).toHaveAttribute("data-nature", "felicitation");
  const texte = normaliser((await bulle(page).textContent()) ?? "");
  expect(texte.startsWith(`${debut} `), texte).toBe(true);
  expect(FELICITATIONS_DE_NOISETTE).toContain(texte.slice(debut.length + 1));
});

Then(/^Noisette dit un encouragement, suivi d'une phrase qui commence par « ([^«»]+) »$/, async ({ page }, debut: string) => {
  await expect(bulle(page)).toHaveAttribute("data-nature", "encouragement");
  const texte = normaliser((await bulle(page).textContent()) ?? "");
  const rang = texte.indexOf(debut);
  expect(rang, texte).toBeGreaterThan(0);
  expect(texte.slice(0, rang).trim()).not.toBe("");
});

Then(/^chacune des ([0-9]+) additions a une retenue dans la colonne des unités$/, async ({ page }, nombre: string) => {
  for (let rang = 0; rang < Number(nombre); rang++) {
    await attendreLEtape(page, "calculer");
    await verifierLaColonneEnCours(page, "unités");
    const unites = (await chiffresDeLAddition(page)).reduce((total, terme) => total + (terme % 10), 0);
    expect(unites, `unités de l'addition n°${rang + 1}`).toBeGreaterThanOrEqual(10);
    const reussiesAvant = await questionsReussies(page);
    do {
      await calculerLaColonneEnCours(page);
    } while ((await colonneEnCours(page)) !== "");
    await expect.poll(async () => {
      if (await finDeSeance(page).isVisible()) return true;
      if ((await colonneEnCours(page)) === "unites" && (await questionsReussies(page)) > reussiesAvant) return true;
      await terminerLaLecture(page);
      return false;
    }, { intervals: [100], timeout: DELAI_D_UN_APPEL_SERVEUR_MS }).toBe(true);
  }
});

// =====================================================================================================
// Règle 6 : au doigt, au clavier, petit écran
// =====================================================================================================

Then(/^chaque touche du clavier de cristaux mesure au moins 44 px de haut et de large$/, async ({ page }) => {
  const touches = await clavier(page).getByRole("button").all();
  expect(touches).toHaveLength(12);
  for (const touche of touches) {
    const boite = await touche.boundingBox();
    const nom = await touche.textContent();
    expect(boite, `touche « ${nom} » visible`).not.toBeNull();
    expect(boite?.width ?? 0, `largeur de « ${nom} »`).toBeGreaterThanOrEqual(44);
    expect(boite?.height ?? 0, `hauteur de « ${nom} »`).toBeGreaterThanOrEqual(44);
  }
});

Given(/^Tom joue sur un ordinateur, au clavier$/, async ({ page }) => {
  partie20(page).acteur = "Tom";
  await page.setViewportSize({ width: 1280, height: 800 });
});

When(/^Tom tape « ([0-9]+) » et valide, au clavier seulement$/, async ({ page }, nombre: string) => {
  await expect(clavier(page)).toBeVisible();
  for (const chiffre of nombre) await page.keyboard.press(chiffre);
  await expect(nombreTape(page)).toHaveText(nombre);
  await page.keyboard.press("Enter");
});

Then(/^le calcul « [^«»]+ » est réussi$/, async ({ page }) => {
  await expect.poll(async () => (await finDeSeance(page).isVisible()) || (await questionsReussies(page)) === 1).toBe(true);
});
