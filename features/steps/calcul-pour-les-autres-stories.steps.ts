import { expect, type Page } from "@playwright/test";
import { Given, Then, When } from "./fixtures.ts";
import type { Monde } from "./fixtures.ts";
import { injecter, leconDeTest, type LeconBrute } from "./etapes-puis-exercices.steps.ts";
import { demarrer, etatDesChoix, questionsReussies } from "./exercices-a-choix.steps.ts";
import { attendreLaFinDeLaSeance } from "./etoiles-et-fin-de-seance.steps.ts";
import {
  allerAuCalcul,
  carteDuCalcul,
  clavier,
  colonne,
  donnerLeSignalDeDepart,
  enonceDeLaCarte,
  exerciceDeCalcul,
  figee,
  finDeSeance,
  fluence,
  forcerLeTirage,
  laisserPasserLeTemps,
  lireLaCarte,
  ouvrirLaFluence,
  partie20,
  preparerUnExercice,
  exerciceAGenerateur,
  repondreAuNombre,
  resultatDeLaCarte,
  reussirLeCalcul,
  taperLesChiffres,
  tirageDe,
  valider,
} from "./calcul-fluence-addition.steps.ts";
import { journal, terminerLaLecture } from "./voix.steps.ts";

// Stories #23 et #24 : ce que les scénarios des autres stories attendaient de la story #20 (calcul, fluence,
// addition posée). Ces steps ne sont pas réservés à @issue-20 : ils servent aux features de #23 et de #24.
// L'enfant joue comme à l'écran (cristaux, choix, chiffres et colonnes) ; les opérations sont résolues par le test.

const jeNeSaisPas = (page: Page) => page.getByTestId("je-ne-sais-pas");
const additionPosee = (page: Page) => page.getByTestId("addition-posee");

// --- Un calcul de test pour les plans de #23

const CALCUL_DE_TEST = { q: "12 − 5", r: 7 };

export async function commencerUnCalculDeTest(page: Page, monde: Monde, enfant: "Léa" | "Tom"): Promise<void> {
  partie20(page).acteur = enfant;
  preparerUnExercice(page, monde, exerciceDeCalcul([CALCUL_DE_TEST]), enfant === "Tom" ? "CE1" : "CP");
  await demarrer(page);
  await lireLaCarte(page);
}

export async function unCalculEstAffiche(page: Page): Promise<boolean> {
  return await carteDuCalcul(page).isVisible();
}

// --- Répondre et dire « Je ne sais pas » comme un enfant, en laissant Noisette finir de parler

async function attendreQueLaQuestionSoitLibre(page: Page): Promise<void> {
  await expect.poll(async () => {
    if (await finDeSeance(page).isVisible()) return true;
    if (!(await figee(page))) return true;
    await terminerLaLecture(page);
    return false;
  }, { intervals: [100], timeout: 20_000 }).toBe(true);
}

async function repondreEtLaisserDire(page: Page, nombre: number): Promise<void> {
  await attendreQueLaQuestionSoitLibre(page);
  const avant = (await journal(page)).speaks;
  await repondreAuNombre(page, nombre);
  await expect.poll(async () => (await journal(page)).speaks, { timeout: 20_000 }).toBeGreaterThan(avant);
}

async function repondreFaux(page: Page, lecon: LeconBrute | undefined): Promise<void> {
  const carte = await lireLaCarte(page);
  await repondreEtLaisserDire(page, resultatDeLaCarte(lecon, carte) + 1);
}

async function direJeNeSaisPasAuClavier(page: Page): Promise<void> {
  await attendreQueLaQuestionSoitLibre(page);
  const avant = (await journal(page)).speaks;
  await jeNeSaisPas(page).click();
  await expect(jeNeSaisPas(page)).toHaveCount(0);
  await expect.poll(async () => (await journal(page)).speaks, { timeout: 20_000 }).toBeGreaterThan(avant);
}

// --- Règle : une nouvelle chance sans limite, et la réponse dite au clavier de cristaux (#23)

Given(
  /^une leçon de test de niveau (CP|CE1) a un exercice calcul « ([^«»]+) », de résultat ([0-9]+)(?:, d'aide « ([^«»]+) »)?$/,
  async ({ page, monde }, niveau: string, enonce: string, resultat: string, aide: string | undefined) => {
    if (niveau === "CE1") partie20(page).acteur = "Tom";
    const operation = { q: enonce, r: Number(resultat), ...(aide == null ? {} : { aide }) };
    preparerUnExercice(page, monde, exerciceDeCalcul([operation]), niveau);
  },
);

Given(/^Tom a répondu faux ([0-9]+) fois de suite à « ([^«»]+) »$/, async ({ page }, fois: string, enonce: string) => {
  partie20(page).acteur = "Tom";
  await demarrer(page);
  await allerAuCalcul(page, enonce);
  for (let essai = 0; essai < Number(fois); essai++) await repondreFaux(page, partie20(page).lecon);
});

When(/^Tom répond « ([^«»]+) » à « ([^«»]+) »$/, async ({ page }, reponse: string, enonce: string) => {
  partie20(page).acteur = "Tom";
  await demarrer(page);
  await allerAuCalcul(page, enonce);
  await attendreQueLaQuestionSoitLibre(page);
  etatDesChoix(page).reussiesAvant = await questionsReussies(page);
  await repondreAuNombre(page, reponse);
});

Given(/^Tom en est au calcul « ([^«»]+) »$/, async ({ page }, enonce: string) => {
  partie20(page).acteur = "Tom";
  await demarrer(page);
  await allerAuCalcul(page, enonce);
});

When(/^Tom dit « Je ne sais pas »$/, async ({ page }) => {
  await demarrer(page);
  await lireLaCarte(page);
  await direJeNeSaisPasAuClavier(page);
});

Then(/^le calcul « ([^«»]+) » reste posé jusqu'à ce que Tom tape ([0-9]+)$/, async ({ page }, enonce: string, nombre: string) => {
  expect(enonceDeLaCarte(await lireLaCarte(page))).toBe(enonce);
  expect(await questionsReussies(page)).toBe(0);
  await expect(clavier(page)).toBeVisible();
  const brillants = page.getByTestId("cristal").and(page.locator('[data-brille="true"]'));
  await expect(brillants).toHaveText([...nombre].sort());
  await attendreQueLaQuestionSoitLibre(page);
  await taperLesChiffres(page, nombre);
  await valider(page);
  await expect.poll(async () => (await finDeSeance(page).isVisible()) || (await questionsReussies(page)) === 1).toBe(true);
});

// --- Règle : « Je ne sais pas » compte une erreur, sauf si la question a déjà coûté une erreur (#23)

Given(/^Tom joue une leçon de test de niveau CE1 de deux calculs$/, async ({ page, monde }) => {
  partie20(page).acteur = "Tom";
  preparerUnExercice(page, monde, exerciceDeCalcul([CALCUL_DE_TEST, { q: "9 − 4", r: 5 }]), "CE1");
});

Given(
  /^au premier calcul, Tom a dit « Je ne sais pas », puis a tapé une mauvaise réponse, puis la bonne$/,
  async ({ page }) => {
    await demarrer(page);
    await lireLaCarte(page);
    await direJeNeSaisPasAuClavier(page);
    await repondreFaux(page, partie20(page).lecon);
    await reussirLeCalcul(page, partie20(page).lecon);
  },
);

Given(/^au second calcul, Tom a fait deux erreurs$/, async ({ page }) => {
  await repondreFaux(page, partie20(page).lecon);
  await repondreFaux(page, partie20(page).lecon);
});

When(/^Tom donne la bonne réponse au second calcul$/, async ({ page }) => {
  await reussirLeCalcul(page, partie20(page).lecon);
});

// --- « Je ne sais pas » sur une addition posée, à l'étape poser (#23)

const ADDITION_A_POSER = [23, 14];
const RANG_DES_CHIFFRES: Readonly<Record<string, "dizaines" | "unités">> = { "2": "dizaines", "1": "dizaines", "3": "unités", "4": "unités" };
const chiffresChoisis = new WeakMap<Page, string>();

Given(/^Léa joue un exercice addition à l'étape poser d'une leçon de test$/, async ({ page, monde }) => {
  preparerUnExercice(page, monde, { type: "addition", titre: "Addition de test", operations: [ADDITION_A_POSER], etapes: ["poser"] });
  await demarrer(page);
  await expect(additionPosee(page)).toHaveAttribute("data-etape", "poser", { timeout: 20_000 });
});

export async function additionAPoserAffichee(page: Page): Promise<boolean> {
  return await additionPosee(page).isVisible();
}

export async function direJeNeSaisPasSurUneAdditionAPoser(page: Page): Promise<void> {
  await expect(additionPosee(page)).toHaveAttribute("data-etape", "poser");
  const premier = page.getByTestId("chiffre-a-poser").first();
  chiffresChoisis.set(page, ((await premier.textContent()) ?? "").trim());
  await premier.click();
  await jeNeSaisPas(page).click();
  await expect(jeNeSaisPas(page)).toHaveCount(0);
}

Then(/^la bonne colonne du chiffre choisi brille$/, async ({ page }) => {
  const chiffre = chiffresChoisis.get(page) ?? "";
  const rang = RANG_DES_CHIFFRES[chiffre];
  expect(rang, `colonne du chiffre « ${chiffre} »`).toBeDefined();
  await expect(colonne(page, rang ?? "")).toHaveAttribute("data-brille", "true");
  await expect(page.getByTestId("colonne").and(page.locator('[data-brille="true"]'))).toHaveCount(1);
});

export async function verifierQueLAdditionResteAPoser(page: Page): Promise<void> {
  await expect(additionPosee(page)).toHaveAttribute("data-etape", "poser");
  expect(await questionsReussies(page)).toBe(0);
  await expect(page.getByTestId("chiffre-pose")).toHaveCount(0);
  await expect(page.getByTestId("chiffre-a-poser")).toHaveCount(String(ADDITION_A_POSER[0]).length);
  await expect(jeNeSaisPas(page)).toHaveCount(0);
}

// --- La fluence ne propose pas « Je ne sais pas » (#23) et ne donne pas d'étoiles (#24)

export function preparerLaFluence(page: Page, exercice: string): void {
  etatDesChoix(page).demarrage = () => ouvrirLaFluence(page, exercice);
}

When(/^Noisette dit « C'est parti ! »$/, async ({ page }) => {
  await demarrer(page);
  await donnerLeSignalDeDepart(page);
});

export async function ecoulerLaFluence(page: Page): Promise<void> {
  await demarrer(page);
  if ((await fluence(page).getAttribute("data-etat")) === "accueil") await donnerLeSignalDeDepart(page);
  await laisserPasserLeTemps(page);
}

// --- Rejouer tire de nouveaux calculs (#24)

Given(
  /^une leçon de test « Additions » a un exercice calcul dont le générateur tire des additions$/,
  async ({ page, monde }) => {
    const p = partie20(page);
    const intervalle = [1, 10];
    const exercice = exerciceAGenerateur({ op: "+", a: intervalle, b: intervalle, combien: 1 });
    p.lecon = { ...leconDeTest("e2e-24-additions", "Additions", [{ ...exercice }]), niveau: "CP" };
    await injecter(page, p.lecon);
    preparerUnExercice(page, monde, exercice, "CP");
  },
);

const INTERVALLE_DES_ADDITIONS = [1, 10] as const;

Given(
  /^Léa a terminé une séance de « Additions » dont le premier calcul était « ([^«»]+) »$/,
  async ({ page }, enonce: string) => {
    const [a, b] = enonce.split(" + ").map(Number);
    await forcerLeTirage(page, [tirageDe(a ?? 0, INTERVALLE_DES_ADDITIONS), tirageDe(b ?? 0, INTERVALLE_DES_ADDITIONS)]);
    await demarrer(page);
    const premier = await lireLaCarte(page);
    expect(enonceDeLaCarte(premier)).toBe(enonce);
    await reussirLeCalcul(page, partie20(page).lecon);
    await attendreLaFinDeLaSeance(page);
  },
);

Given(/^le prochain calcul tiré est « ([^«»]+) »$/, async ({ page }, enonce: string) => {
  const [a, b] = enonce.split(" + ").map(Number);
  await forcerLeTirage(page, [tirageDe(a ?? 0, INTERVALLE_DES_ADDITIONS), tirageDe(b ?? 0, INTERVALLE_DES_ADDITIONS)]);
});

Then(/^le premier calcul de la nouvelle séance est « ([^«»]+) »$/, async ({ page }, enonce: string) => {
  expect(enonceDeLaCarte(await lireLaCarte(page))).toBe(enonce);
});
