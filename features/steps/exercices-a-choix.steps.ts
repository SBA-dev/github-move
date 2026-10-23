import { expect, type Page } from "@playwright/test";
import { Given, Then, When } from "./fixtures.ts";
import {
  BIBLIOTHEQUE,
  bulle,
  commencerLaSeanceComplete,
  commencerSeulementLExercice,
  entendu,
  etat,
  injecter,
  type LeconBrute,
  leconDeTest,
  leconDeTitre,
  ouvrirLaPageDeLaLecon,
  recipient,
  toutesLesParoles,
} from "./etapes-puis-exercices.steps.ts";
import { EXPRESSIONS_PAR_PERSONNAGE, FELICITATIONS_COMMUNES, listeDe } from "./univers.steps.ts";
import {
  journal,
  laisserPasserLeDelaiDeLecture,
  normaliser,
  reappliquerLAppareil,
  SAMANTHA,
  scenario,
  terminerLaLecture,
} from "./voix.steps.ts";

// Story #17 : exercices à choix (bulles, lecture, écoute).
// Les réponses se donnent comme un enfant : on touche la bulle. Le navigateur de test remplace la voix par une fausse
// synthèse vocale (voix.steps.ts) dont la lecture ne finit que quand le test le décide : « Noisette a fini de lire »
// se joue donc en terminant la lecture en cours, jamais en attendant un délai.

const QUESTION_PAR_DEFAUT_DE_L_ECOUTE = "Écoute bien ! Que veut dire ce mot ?";
const FILE_DU_TIRAGE = "__tirageDesChoix";

// --- Leçons : questions jouables

type Question = { enonce: string; reponse: string; choix: string[]; position: number; dire?: string };
type ExerciceBrut = Record<string, unknown>;

function questionsDe(exercice: ExerciceBrut, position: number): Question[] {
  if (exercice.type === "bulles" || exercice.type === "lecture") {
    const questions = exercice.questions as Array<{ question: string; choix: string[]; reponse: string }>;
    return questions.map((q) => ({ enonce: q.question, reponse: q.reponse, choix: q.choix, position }));
  }
  if (exercice.type === "ecoute") {
    const items = exercice.items as Array<{ dire: string; question?: string; choix: string[]; reponse: string }>;
    return items.map((i) => ({
      enonce: i.question ?? QUESTION_PAR_DEFAUT_DE_L_ECOUTE,
      reponse: i.reponse,
      choix: i.choix,
      position,
      dire: i.dire,
    }));
  }
  return [];
}

function questionsDeLaLecon(lecon: LeconBrute, position?: number): Question[] {
  return lecon.exercices.flatMap((exercice, rang) => (position === undefined || position === rang ? questionsDe(exercice, rang) : []));
}

function toutesLesLecons(page: Page): LeconBrute[] {
  return [...etat(page).injectees, ...BIBLIOTHEQUE];
}

function leconDeLExercice(page: Page, titre: string): LeconBrute {
  const lecon = toutesLesLecons(page).find((candidate) => candidate.exercices.some((e) => e.titre === titre));
  if (!lecon) throw new Error(`Aucune leçon n'a l'exercice « ${titre} »`);
  return lecon;
}

function leconDeLaQuestion(page: Page, enonce: string): LeconBrute {
  const lecon = toutesLesLecons(page).find((candidate) => questionsDeLaLecon(candidate).some((q) => q.enonce === enonce));
  if (!lecon) throw new Error(`Aucune leçon ne pose la question « ${enonce} »`);
  return lecon;
}

function positionDeLExercice(lecon: LeconBrute, titre: string): number {
  const position = lecon.exercices.findIndex((e) => e.titre === titre);
  if (position < 0) throw new Error(`La leçon « ${lecon.titre} » n'a pas d'exercice « ${titre} »`);
  return position;
}

function titreDeLExercice(lecon: LeconBrute, position: number): string {
  const titre = lecon.exercices[position]?.titre;
  if (typeof titre !== "string") throw new Error(`L'exercice n°${position} de « ${lecon.titre} » n'a pas de titre`);
  return titre;
}

function leconAChoix(identifiant: string, question: string, choix: string[], reponse: string): LeconBrute {
  return leconDeTest(identifiant, "Questions", [{ type: "bulles", titre: "Questions à choix", questions: [{ question, choix, reponse }] }]);
}

// --- État du scénario

type EtatDesChoix = {
  /** Démarrage différé : la séance commence au premier pas qui en a besoin (l'ordre des choix est alors connu). */
  demarrage: ((question: string | undefined) => Promise<void>) | undefined;
  exerciceUnique: number | undefined;
  ordre: string[] | undefined;
  reussiesAvant: number;
  paroles: number;
};

const etats = new WeakMap<Page, EtatDesChoix>();
const tiragesInstalles = new WeakSet<Page>();

function etatDesChoix(page: Page): EtatDesChoix {
  let courant = etats.get(page);
  if (!courant) {
    courant = { demarrage: undefined, exerciceUnique: undefined, ordre: undefined, reussiesAvant: 0, paroles: 0 };
    etats.set(page, courant);
  }
  return courant;
}

function questionsDeLaSeance(page: Page): Question[] {
  const lecon = etat(page).courante;
  if (!lecon) throw new Error("Aucune leçon ouverte");
  return questionsDeLaLecon(lecon, etatDesChoix(page).exerciceUnique);
}

// Le mélange des choix tire ses nombres dans src/seance/hasard-navigateur.ts : on ne remplace pas le tirage, on lui
// donne des nombres. Seuls les appels qui viennent de ce module (lu dans la pile d'appels) les consomment.
async function installerLeTirage(page: Page) {
  if (tiragesInstalles.has(page)) return;
  tiragesInstalles.add(page);
  await page.addInitScript((cle) => {
    const reel = Math.random.bind(Math);
    Math.random = () => {
      const file = Reflect.get(window, cle) as number[] | undefined;
      if (file && file.length > 0 && new Error().stack?.includes("/seance/hasard-navigateur")) return file.shift() as number;
      return reel();
    };
  }, FILE_DU_TIRAGE);
}

/** Les nombres à donner au mélange (Fisher-Yates, du dernier rang au deuxième) pour obtenir l'ordre voulu. */
function nombresDuTirage(depart: readonly string[], voulu: readonly string[]): number[] {
  const chercher = (rang: number, tableau: string[], nombres: number[]): number[] | undefined => {
    if (rang === 0) return tableau.every((texte, i) => texte === voulu[i]) ? nombres : undefined;
    for (let j = 0; j <= rang; j++) {
      const copie = [...tableau];
      [copie[rang], copie[j]] = [copie[j] as string, copie[rang] as string];
      const trouve = chercher(rang - 1, copie, [...nombres, (j + 0.5) / (rang + 1)]);
      if (trouve) return trouve;
    }
    return undefined;
  };
  const nombres = chercher(depart.length - 1, [...depart], []);
  if (!nombres) throw new Error(`L'ordre ${voulu.join(", ")} est impossible à tirer`);
  return nombres;
}

async function lancer(page: Page, lecon: LeconBrute, titreDeLExercice?: string) {
  const choix = etatDesChoix(page);
  await reappliquerLAppareil(page);
  await installerLeTirage(page);
  await ouvrirLaPageDeLaLecon(page, lecon.titre);
  choix.exerciceUnique = titreDeLExercice === undefined ? undefined : positionDeLExercice(lecon, titreDeLExercice);
  if (choix.ordre) {
    const depart = [...new Set(questionsDeLaLecon(lecon)[0]?.choix ?? [])];
    await page.evaluate(([cle, nombres]) => Reflect.set(window, cle as string, nombres), [FILE_DU_TIRAGE, nombresDuTirage(depart, choix.ordre)]);
  }
  if (titreDeLExercice === undefined) await commencerLaSeanceComplete(page);
  else await commencerSeulementLExercice(page, titreDeLExercice);
}

async function demarrer(page: Page, question?: string) {
  const choix = etatDesChoix(page);
  const demarrage = choix.demarrage;
  if (demarrage) {
    choix.demarrage = undefined;
    await demarrage(question);
  } else if (etat(page).courante === undefined && question !== undefined) {
    const lecon = leconDeLaQuestion(page, question);
    await demarrageDeLExercice(page, lecon, undefined)(question);
  }
}

/** Sans exercice nommé, on joue seulement l'exercice qui pose la question (ou la séance complète sans question). */
function demarrageDeLExercice(page: Page, lecon: LeconBrute, titre: string | undefined) {
  return async (question: string | undefined) => {
    if (titre !== undefined) return await lancer(page, lecon, titre);
    if (question === undefined) return await lancer(page, lecon);
    const position = questionsDeLaLecon(lecon).find((q) => q.enonce === question)?.position;
    if (position === undefined) throw new Error(`La leçon « ${lecon.titre} » ne pose pas la question « ${question} »`);
    await lancer(page, lecon, titreDeLExercice(lecon, position));
  };
}

// --- Attendre que Noisette ait fini, sans jamais couper ce qu'on veut vérifier

export type Attendu =
  | { type: "question"; texte: string }
  | { type: "choix" }
  | { type: "parole"; nature: string }
  | { type: "exercice"; position: number }
  | { type: "texte-lu"; texte: string };

/**
 * Termine la lecture en cours tant que ce qu'on attend n'est pas là. La vérification et la fin de la lecture se font
 * dans le même appel au navigateur : on ne coupe jamais la parole qu'on attend.
 */
async function satisfaitOuTermine(page: Page, attendu: Attendu): Promise<boolean> {
  return await page.evaluate((a) => {
    const texteDe = (id: string) =>
      (document.querySelector(`[data-testid="${id}"]`)?.textContent ?? "").replace(/\s+/g, " ").trim();
    const nature = document.querySelector('[data-testid="parole"]')?.getAttribute("data-nature") ?? "";
    const faux = Reflect.get(window, "__faux") as {
      journal: Array<{ type: string; lot: number; texte: string }>;
      enonces: Array<{ enonce: { onend: (() => void) | null } }>;
      actifs: unknown[];
      lot: number;
    };
    let satisfait: boolean;
    if (a.type === "question") satisfait = texteDe("question") === a.texte;
    else if (a.type === "choix") {
      satisfait = document.querySelector('[data-testid="choix-de-la-question"]') !== null && nature !== "felicitation";
    } else if (a.type === "parole") satisfait = nature === a.nature;
    else if (a.type === "exercice") {
      const position = document.querySelector('[data-testid="exercice-en-cours"]')?.getAttribute("data-position");
      satisfait = position === String(a.position) && ["consigne", "question", "introduction"].includes(nature);
    } else {
      const dits = faux.journal.filter((e) => e.type === "speak" && e.lot === faux.lot).map((e) => e.texte);
      satisfait = dits.join(" ").replace(/\s+/g, " ").trim() === a.texte;
    }
    if (!satisfait) {
      const dernier = faux.enonces[faux.enonces.length - 1];
      faux.actifs = [];
      dernier?.enonce.onend?.();
    }
    return satisfait;
  }, attendu);
}

export async function finirLaParoleJusqua(page: Page, attendu: Attendu) {
  await expect.poll(() => satisfaitOuTermine(page, attendu), { intervals: [100] }).toBe(true);
}

function boutonContinuer(page: Page) {
  return page.getByRole("button", { name: "Continuer", exact: true });
}

/** Fait ce que ferait un enfant pour arriver aux choix de la question en cours : continuer, dire « J'ai écouté ». */
export async function avancerJusquAuxChoix(page: Page) {
  await expect.poll(async () => {
    if (await boutonContinuer(page).isVisible()) {
      await boutonContinuer(page).click();
      return false;
    }
    const jAiEcoute = page.getByTestId("j-ai-ecoute");
    if (await jAiEcoute.isVisible()) {
      await jAiEcoute.click();
      return false;
    }
    return await satisfaitOuTermine(page, { type: "choix" });
  }, { intervals: [100] }).toBe(true);
}

// --- Choix

function choixDeLaQuestion(page: Page) {
  return page.getByTestId("choix-de-la-question");
}

function bulleDeChoix(page: Page, texte: string) {
  return choixDeLaQuestion(page).getByRole("button", { name: texte, exact: true });
}

async function textesDesChoix(page: Page): Promise<string[]> {
  return (await page.getByTestId("choix").allTextContents()).map(normaliser);
}

async function textesDesChoixPossibles(page: Page): Promise<string[]> {
  const bulles = await page.getByTestId("choix").all();
  const possibles: string[] = [];
  for (const bulleDeChoixPossible of bulles) {
    if ((await bulleDeChoixPossible.getAttribute("aria-disabled")) !== "true") {
      possibles.push(normaliser((await bulleDeChoixPossible.textContent()) ?? ""));
    }
  }
  return possibles;
}

async function questionsReussies(page: Page): Promise<number> {
  return Number(await recipient(page).getAttribute("data-questions-reussies"));
}

async function repondre(page: Page, reponse: string, question?: string) {
  await demarrer(page, question);
  if (question === undefined) await avancerJusquAuxChoix(page);
  else await allerALaQuestion(page, question, true);
  const choix = etatDesChoix(page);
  choix.reussiesAvant = await questionsReussies(page);
  const avant = (await journal(page)).speaks;
  const touchee = bulleDeChoix(page, reponse);
  await touchee.click();
  await expect(touchee).toHaveAttribute("aria-disabled", "true");
  await expect.poll(async () => (await journal(page)).speaks).toBeGreaterThan(avant);
}

async function allerAuRang(page: Page, rang: number, avecChoix: boolean) {
  const questions = questionsDeLaSeance(page);
  for (let i = await questionsReussies(page); i < rang; i++) {
    await avancerJusquAuxChoix(page);
    await bulleDeChoix(page, (questions[i] as Question).reponse).click();
    await expect(recipient(page)).toHaveAttribute("data-questions-reussies", String(i + 1));
  }
  if (avecChoix) await avancerJusquAuxChoix(page);
  else await finirLaParoleJusqua(page, { type: "question", texte: (questions[rang] as Question).enonce });
}

/** Joue, comme un enfant, les questions qui précèdent, jusqu'à celle-ci. */
async function allerALaQuestion(page: Page, enonce: string, avecChoix: boolean) {
  await demarrer(page, enonce);
  const questions = questionsDeLaSeance(page);
  const deja = await questionsReussies(page);
  const cible = questions.findIndex((q, i) => i >= deja && q.enonce === enonce);
  if (cible < 0) {
    await finirLaParoleJusqua(page, { type: "question", texte: enonce });
    if (avecChoix) await avancerJusquAuxChoix(page);
    return;
  }
  await allerAuRang(page, cible, avecChoix);
}

// --- Étant donné : séance

Given(/^Léa joue l'exercice « ([^«»]+) » de la leçon « ([^«»]+) »$/, async ({ page }, exercice: string, titreDeLaLecon: string) => {
  etatDesChoix(page).demarrage = demarrageDeLExercice(page, leconDeTitre(page, titreDeLaLecon), exercice);
});

Given(/^Léa joue la leçon « ([^«»]+) »$/, async ({ page }, titre: string) => {
  etatDesChoix(page).demarrage = demarrageDeLExercice(page, leconDeTitre(page, titre), undefined);
});

Given(/^Léa joue l'item « ([^«»]+) » de l'exercice « ([^«»]+) »$/, async ({ page }, mot: string, exercice: string) => {
  const lecon = leconDeLExercice(page, exercice);
  await demarrageDeLExercice(page, lecon, exercice)(undefined);
  const rang = questionsDeLaSeance(page).findIndex((q) => q.dire === mot);
  await allerAuRang(page, rang, true);
});

const QUESTIONS_DE_TEST: Readonly<Record<string, { choix: string[]; reponse: string }>> = {
  "Combien font 3 + 4 ?": { choix: ["6", "7", "8", "9"], reponse: "7" },
};

Given(/^Léa joue la question de test « (.+) »$/, async ({ page }, question: string) => {
  const donnees = QUESTIONS_DE_TEST[question];
  if (!donnees) throw new Error(`Question de test inconnue : ${question}`);
  const lecon = leconAChoix("test-question-a-choix", question, donnees.choix, donnees.reponse);
  await injecter(page, lecon);
  etatDesChoix(page).demarrage = demarrageDeLExercice(page, lecon, undefined);
});

Given(
  /^une question de test « (.+) » a les choix « ([^«»]+) », « ([^«»]+) » et « ([^«»]+) », de réponse « ([^«»]+) »$/,
  async ({ page }, question: string, a: string, b: string, c: string, reponse: string) => {
    const lecon = leconAChoix("test-choix-en-double", question, [a, b, c], reponse);
    await injecter(page, lecon);
    etatDesChoix(page).demarrage = demarrageDeLExercice(page, lecon, undefined);
  },
);

Given(
  /^une leçon de test a un exercice d'écoute dont l'item « ([^«»]+) » n'a pas de question$/,
  async ({ page }, mot: string) => {
    const lecon = leconDeTest("test-ecoute-sans-question", "Écoute", [{
      type: "ecoute",
      titre: "Écoute",
      langue: "en-GB",
      items: [{ dire: mot, choix: ["un chien", "un chat", "un oiseau"], reponse: "un chien" }],
    }]);
    await injecter(page, lecon);
    etatDesChoix(page).demarrage = demarrageDeLExercice(page, lecon, undefined);
  },
);

Given(
  /^une leçon de test « ([^«»]+) » a deux exercices bulles, le second sans titre$/,
  async ({ page }, titre: string) => {
    const questions = (prefixe: string) =>
      [1, 2].map((n) => ({ question: `Combien font ${prefixe} + ${n} ?`, choix: ["1", "2", "3"], reponse: "3" }));
    await injecter(page, {
      ...leconDeTest("test-deux-exercices", titre, [
        { type: "bulles", titre: "Les additions", questions: questions("1") },
        { type: "bulles", questions: questions("2") },
      ]),
    });
  },
);

Given(/^l'ordre des choix tiré au début de la séance est (.+)$/, async ({ page }, ordre: string) => {
  etatDesChoix(page).ordre = listeDe(ordre);
});

Given(/^les choix sont affichés dans l'ordre (.+)$/, async ({ page }, ordre: string) => {
  etatDesChoix(page).ordre = listeDe(ordre);
  await demarrer(page);
  await avancerJusquAuxChoix(page);
  expect(await textesDesChoix(page)).toEqual(listeDe(ordre));
});

Given(/^Noisette a fini de lire la question « (.+) »$/, async ({ page }, question: string) => {
  await allerALaQuestion(page, question, false);
  await avancerJusquAuxChoix(page);
});

Given(/^Léa en est à la question « (.+) »$/, async ({ page }, question: string) => {
  await allerALaQuestion(page, question, true);
});

Given(
  /^Léa en est à la dernière question de l'exercice « ([^«»]+) », « (.+) »$/,
  async ({ page }, exercice: string, question: string) => {
    const lecon = etat(page).courante;
    const position = lecon && positionDeLExercice(lecon, exercice);
    const questions = questionsDeLaSeance(page).filter((q) => q.position === position);
    expect(questions[questions.length - 1]?.enonce).toBe(question);
    await allerALaQuestion(page, question, true);
  },
);

Given(
  /^Léa en est à la dernière question du premier exercice de la séance complète de « (.+) »$/,
  async ({ page }, titre: string) => {
    const lecon = leconDeTitre(page, titre);
    await lancer(page, lecon);
    const premier = questionsDeLaSeance(page).filter((q) => q.position === 0);
    await allerAuRang(page, premier.length - 1, true);
  },
);

Given(/^Léa a réussi la question « (.+) »$/, async ({ page }, question: string) => {
  await allerALaQuestion(page, question, true);
  const rang = await questionsReussies(page);
  await bulleDeChoix(page, (questionsDeLaSeance(page)[rang] as Question).reponse).click();
  await expect(recipient(page)).toHaveAttribute("data-questions-reussies", String(rang + 1));
});

Given(
  /^Léa a quitté la séance complète de la leçon « (.+) » après (\d+) questions réussies$/,
  async ({ page }, titre: string, nombre: string) => {
    await lancer(page, leconDeTitre(page, titre));
    await allerAuRang(page, Number(nombre), false);
    await page.getByRole("button", { name: "Retour", exact: true }).click();
    await expect(recipient(page)).toHaveCount(0);
  },
);

Given(/^Léa a répondu « ([^«»]+) »$/, async ({ page }, reponse: string) => {
  await repondre(page, reponse);
});

Given(/^Léa a répondu « ([^«»]+) » à la question « (.+) »$/, async ({ page }, reponse: string, question: string) => {
  await repondre(page, reponse, question);
});

// --- Étant donné : lecture

Given(/^Noisette a lu le texte de l'exercice « ([^«»]+) »$/, async ({ page }, exercice: string) => {
  const lecon = leconDeLExercice(page, exercice);
  await lancer(page, lecon, exercice);
  const texte = (lecon.exercices[positionDeLExercice(lecon, exercice)] as ExerciceBrut).texte as string;
  await finirLaParoleJusqua(page, { type: "texte-lu", texte: entendu(texte) });
  await terminerLaLecture(page);
});

// --- Quand

When(/^Léa demande à réécouter la question$/, async ({ page }) => {
  await page.getByRole("button", { name: "Réécouter", exact: true }).click();
});

When(/^Léa répond « ([^«»]+) »$/, async ({ page }, reponse: string) => {
  await repondre(page, reponse);
});

When(/^Léa répond « ([^«»]+) » à la question « (.+) »$/, async ({ page }, reponse: string, question: string) => {
  await repondre(page, reponse, question);
});

When(/^Léa donne la bonne réponse$/, async ({ page }) => {
  const rang = await questionsReussies(page);
  await repondre(page, (questionsDeLaSeance(page)[rang] as Question).reponse);
});

When(/^Léa répond de nouveau « ([^«»]+) »$/, async ({ page }, reponse: string) => {
  const choix = etatDesChoix(page);
  choix.paroles = (await journal(page)).speaks;
  choix.reussiesAvant = await questionsReussies(page);
  await bulleDeChoix(page, reponse).click({ force: true });
});

When(/^Léa répond « ([^«»]+) », au clavier seulement$/, async ({ page }, reponse: string) => {
  await demarrer(page);
  await avancerJusquAuxChoix(page);
  etatDesChoix(page).reussiesAvant = await questionsReussies(page);
  const focalise = () => page.evaluate(() => document.activeElement?.textContent?.replace(/\s+/g, " ").trim() ?? "");
  for (let essai = 0; essai < 10 && (await focalise()) !== reponse; essai++) await page.keyboard.press("Tab");
  expect(await focalise()).toBe(reponse);
  await page.keyboard.press("Enter");
  await expect(bulleDeChoix(page, reponse)).toHaveAttribute("aria-disabled", "true");
});

When(/^l'item « ([^«»]+) » commence$/, async ({ page }, mot: string) => {
  await demarrer(page);
  const rang = questionsDeLaSeance(page).findIndex((q) => q.dire === mot);
  expect(rang).toBeGreaterThanOrEqual(0);
  expect(await questionsReussies(page)).toBe(rang);
  await expect(page.getByTestId("ecoute")).toBeVisible();
  await expect(page.getByTestId("question")).toBeVisible();
});

When(/^Léa demande à écouter de nouveau$/, async ({ page }) => {
  await page.getByTestId("ecouter").click();
});

When(/^Léa commence l'exercice « ([^«»]+) » de la leçon « ([^«»]+) »$/, async ({ page }, exercice: string, titre: string) => {
  await lancer(page, leconDeTitre(page, titre), exercice);
});

When(/^Léa dit qu'elle a écouté$/, async ({ page }) => {
  await page.getByTestId("j-ai-ecoute").click();
});

// --- Alors : question et choix

Then(/^ensuite seulement, Léa voit les choix (.+)$/, async ({ page }, liste: string) => {
  await expect(choixDeLaQuestion(page)).toHaveCount(0);
  // Vérification technique : toucher la question pendant sa première lecture ne doit pas empêcher les choix d'apparaître.
  await page.getByTestId("question").click();
  await expect(choixDeLaQuestion(page)).toHaveCount(0);
  await avancerJusquAuxChoix(page);
  expect([...(await textesDesChoix(page))].sort()).toEqual([...listeDe(liste)].sort());
});

Then(/^Léa voit les choix dans l'ordre (.+)$/, async ({ page }, ordre: string) => {
  await avancerJusquAuxChoix(page);
  expect(await textesDesChoix(page)).toEqual(listeDe(ordre));
});

Then(/^Léa voit exactement deux choix, « ([^«»]+) » et « ([^«»]+) »$/, async ({ page }, premier: string, second: string) => {
  await avancerJusquAuxChoix(page);
  await expect(page.getByTestId("choix")).toHaveCount(2);
  expect([...(await textesDesChoix(page))].sort()).toEqual([premier, second].sort());
});

Then(
  /^ensuite seulement, la question « (.+) » s'affiche$/,
  async ({ page }, question: string) => {
    await expect(page.getByTestId("question")).not.toHaveText(question);
    await finirLaParoleJusqua(page, { type: "question", texte: question });
  },
);

Then(/^la question « (.+) » s'affiche$/, async ({ page }, question: string) => {
  await allerALaQuestion(page, question, false);
  await expect(page.getByTestId("exercice-en-cours")).toBeVisible();
});

Then(/^la question « .+ » est réussie$/, async ({ page }) => {
  await expect(recipient(page)).toHaveAttribute("data-questions-reussies", String(etatDesChoix(page).reussiesAvant + 1));
});

Then(/^la question « (.+) » reste posée$/, async ({ page }, question: string) => {
  await expect(page.getByTestId("question")).toHaveText(question);
  await expect(recipient(page)).toHaveAttribute("data-questions-reussies", String(etatDesChoix(page).reussiesAvant));
  await expect(choixDeLaQuestion(page)).toBeVisible();
});

async function verifierLesChoixPossibles(page: Page, attendus: string[]) {
  await expect.poll(async () => [...(await textesDesChoixPossibles(page))].sort()).toEqual([...attendus].sort());
}

Then(/^les choix (.+) restent possibles$/, async ({ page }, liste: string) => {
  await verifierLesChoixPossibles(page, listeDe(liste));
});

Then(/^seuls les choix (.+) restent possibles$/, async ({ page }, liste: string) => {
  await verifierLesChoixPossibles(page, listeDe(liste));
});

async function verifierQueLeChoixEstEcarte(page: Page, texte: string) {
  const ecarte = bulleDeChoix(page, texte);
  await expect(ecarte).toBeVisible();
  await expect(ecarte).toHaveAttribute("data-ecarte", "true");
  await expect(ecarte).toHaveAttribute("aria-disabled", "true");
  await expect.poll(async () => Number(await ecarte.evaluate((el) => getComputedStyle(el).opacity))).toBeLessThan(1);
}

Then(/^le choix « ([^«»]+) » reste visible, pâle, et ne réagit plus$/, async ({ page }, texte: string) => {
  await verifierQueLeChoixEstEcarte(page, texte);
  const paroles = (await journal(page)).speaks;
  const reussies = await questionsReussies(page);
  await bulleDeChoix(page, texte).click({ force: true });
  await laisserPasserLeDelaiDeLecture(page);
  expect((await journal(page)).speaks).toBe(paroles);
  expect(await questionsReussies(page)).toBe(reussies);
});

Then(/^les choix écartés « ([^«»]+) » et « ([^«»]+) » restent visibles, pâles$/, async ({ page }, premier: string, second: string) => {
  await verifierQueLeChoixEstEcarte(page, premier);
  await verifierQueLeChoixEstEcarte(page, second);
});

Then(/^Noisette ne dit rien de plus$/, async ({ page }) => {
  await laisserPasserLeDelaiDeLecture(page);
  expect((await journal(page)).speaks).toBe(etatDesChoix(page).paroles);
  expect(await questionsReussies(page)).toBe(etatDesChoix(page).reussiesAvant);
});

// --- Alors : paroles de Noisette

const FELICITATIONS_DE_NOISETTE = [...FELICITATIONS_COMMUNES, ...(EXPRESSIONS_PAR_PERSONNAGE["Noisette"] ?? [])];

Then(/^Noisette dit un encouragement$/, async ({ page }) => {
  await expect(bulle(page)).toHaveAttribute("data-nature", "encouragement");
  expect(normaliser((await bulle(page).textContent()) ?? "")).not.toBe("");
});

Then(/^Noisette dit une félicitation commune ou l'une de ses expressions, en entier$/, async ({ page }) => {
  await expect(bulle(page)).toHaveAttribute("data-nature", "felicitation");
  const texte = normaliser((await bulle(page).textContent()) ?? "");
  expect(FELICITATIONS_DE_NOISETTE).toContain(texte);
  const lecture = await journal(page);
  expect(lecture.lecture.texte).toBe(entendu(texte));
  expect(lecture.coupeApresLaDerniereParole).toBe(false);
  // Vérification technique : pendant la félicitation, toucher la question ne la coupe pas et ne lit pas la suivante.
  await page.getByTestId("question").click();
  const reecouter = page.getByRole("button", { name: "Réécouter", exact: true });
  await expect(reecouter).toHaveAttribute("aria-disabled", "true");
  await reecouter.click({ force: true });
  await laisserPasserLeDelaiDeLecture(page);
  await expect(bulle(page)).toHaveAttribute("data-nature", "felicitation");
  expect((await journal(page)).lecture.texte).toBe(entendu(texte));
  expect((await journal(page)).coupeApresLaDerniereParole).toBe(false);
});

Then(/^Noisette dit une félicitation, suivie de « (.+) »$/, async ({ page }, explication: string) => {
  await expect(bulle(page)).toHaveAttribute("data-nature", "felicitation");
  const texte = normaliser((await bulle(page).textContent()) ?? "");
  expect(texte.endsWith(` ${explication}`), texte).toBe(true);
  expect(FELICITATIONS_DE_NOISETTE).toContain(texte.slice(0, texte.length - explication.length - 1));
  // La phrase est lue en plusieurs morceaux (voix du personnage guide, mot anglais, fin) : on les laisse finir un à un.
  const sansEspace = (t: string) => t.replace(/[\s,]+/g, "");
  await expect.poll(async () => {
    const dites = (await toutesLesParoles(page)).join("");
    if (sansEspace(dites).includes(sansEspace(entendu(texte)))) return true;
    await terminerLaLecture(page);
    return false;
  }, { intervals: [100] }).toBe(true);
});

Then(
  /^Léa entend en entier un encouragement de Noisette, suivi de « (.+) »$/,
  async ({ page }, complement: string) => {
    await expect(bulle(page)).toHaveAttribute("data-nature", "encouragement");
    const texte = normaliser((await bulle(page).textContent()) ?? "");
    expect(texte.endsWith(` ${complement}`)).toBe(true);
    await expect.poll(async () => (await journal(page)).lecture.texte).toBe(entendu(texte));
    expect((await journal(page)).coupeApresLaDerniereParole).toBe(false);
  },
);

Then(
  /^Noisette dit « ([^«»]+) », « ([^«»]+) » ou « ([^«»]+) »$/,
  async ({ page }, a: string, b: string, c: string) => {
    await finirLaParoleJusqua(page, { type: "parole", nature: "annonce" });
    expect([a, b, c].map(normaliser)).toContain(normaliser((await bulle(page).textContent()) ?? ""));
  },
);

// --- Alors : exercices

function positionDeLExerciceDeLaSeance(page: Page, titre: string): number {
  const lecon = etat(page).courante;
  if (!lecon) throw new Error("Aucune leçon ouverte");
  return positionDeLExercice(lecon, titre);
}

Then(/^l'exercice « ([^«»]+) » commence$/, async ({ page }, titre: string) => {
  await finirLaParoleJusqua(page, { type: "exercice", position: positionDeLExerciceDeLaSeance(page, titre) });
});

Then(/^l'exercice « ([^«»]+) » n'a pas commencé$/, async ({ page }, titre: string) => {
  await laisserPasserLeDelaiDeLecture(page);
  await expect(page.getByTestId("exercice-en-cours")).not.toHaveAttribute("data-position", String(positionDeLExerciceDeLaSeance(page, titre)));
});

Then(/^le second exercice commence$/, async ({ page }) => {
  await finirLaParoleJusqua(page, { type: "exercice", position: 1 });
});

Then(/^Noisette n'annonce aucun nouveau défi$/, async ({ page }) => {
  await laisserPasserLeDelaiDeLecture(page);
  expect(await bulle(page).getAttribute("data-nature")).not.toBe("annonce");
  for (const parole of await toutesLesParoles(page)) expect(parole).not.toMatch(/Nouveau défi|Jeu suivant|Place au jeu/);
});

Then(/^les lecteurs d'écran annoncent « ([^«»]+) », sans couper Noisette$/, async ({ page }, annonce: string) => {
  const annonceDAvancement = page.getByTestId("annonce-d-avancement");
  await expect(annonceDAvancement).toHaveText(annonce);
  await expect(annonceDAvancement).toHaveAttribute("role", "status");
  await expect(annonceDAvancement).not.toHaveAttribute("aria-live", "assertive");
  await expect(bulle(page)).toHaveAttribute("aria-live", "polite");
  expect((await journal(page)).coupeApresLaDerniereParole).toBe(false);
});

// --- Lecture

Then(/^Léa entend en entier Noisette dire « ([^«»]+) »$/, async ({ page }, texte: string) => {
  await expect.poll(async () => (await journal(page)).lecture.texte).toBe(normaliser(texte));
  expect((await journal(page)).coupeApresLaDerniereParole).toBe(false);
  await terminerLaLecture(page);
});

Then(/^ensuite Noisette lit le texte « (.+) »$/, async ({ page }, texte: string) => {
  const debut = entendu(texte.replace(/\s*…\s*$/, ""));
  await expect.poll(async () => (await journal(page)).lecture.texte.startsWith(debut)).toBe(true);
});

Then(/^chaque mot du texte est surligné au moment où Noisette le prononce$/, async ({ page }) => {
  const texte = page.getByTestId("texte-de-lecture");
  const mots = await texte.locator("[data-mot]").allTextContents();
  expect(mots.length).toBeGreaterThan(0);
  for (const [rang, mot] of mots.entries()) {
    await page.evaluate((rangDuMot) => {
      const faux = Reflect.get(window, "__faux") as {
        enonces: Array<{ lot: number; enonce: { text: string; onboundary: ((e: { name: string; charIndex: number }) => void) | null } }>;
        lot: number;
      };
      let motsAvant = 0;
      for (const { lot, enonce } of faux.enonces) {
        if (lot !== faux.lot) continue;
        const debuts = [...enonce.text.matchAll(/\S+/g)].map((m) => m.index);
        if (rangDuMot < motsAvant + debuts.length) {
          enonce.onboundary?.({ name: "word", charIndex: debuts[rangDuMot - motsAvant] ?? 0 });
          return;
        }
        motsAvant += debuts.length;
      }
    }, rang);
    const surligne = texte.locator("[data-prononce='true']");
    await expect(surligne).toHaveCount(1);
    await expect(surligne).toHaveText(mot);
    await expect(surligne).toHaveAttribute("aria-current", "true");
  }
});

Then(
  /^la question « (.+) » s'affiche avec les choix (.+)$/,
  async ({ page }, question: string, liste: string) => {
    await finirLaParoleJusqua(page, { type: "question", texte: question });
    await avancerJusquAuxChoix(page);
    expect([...(await textesDesChoix(page))].sort()).toEqual([...listeDe(liste)].sort());
  },
);

Then(
  /^Léa voit toujours le texte « (.+) » au-dessus de la question « (.+) »$/,
  async ({ page }, texte: string, question: string) => {
    await finirLaParoleJusqua(page, { type: "question", texte: question });
    const lecture = page.getByTestId("texte-de-lecture");
    await expect(lecture).toBeVisible();
    expect(normaliser((await lecture.locator("p").textContent()) ?? "").startsWith(texte.replace(/\s*…\s*$/, ""))).toBe(true);
    const boiteDuTexte = await lecture.boundingBox();
    const boiteDeLaQuestion = await page.getByTestId("question").boundingBox();
    expect(boiteDuTexte && boiteDeLaQuestion && boiteDuTexte.y + boiteDuTexte.height <= boiteDeLaQuestion.y).toBe(true);
  },
);

// --- Écoute

Then(/^Léa entend ensuite « ([^«»]+) » lu avec la voix anglaise$/, async ({ page }, mot: string) => {
  await finirLaParoleJusqua(page, { type: "texte-lu", texte: normaliser(mot) });
  await verifierLaVoixAnglaise(page);
  // Vérification technique : « Écouter » touché pendant la première lecture ne doit pas empêcher les choix d'apparaître.
  await page.getByTestId("ecouter").click();
  await avancerJusquAuxChoix(page);
});

Then(/^Léa entend de nouveau « ([^«»]+) » lu avec la voix anglaise$/, async ({ page }, mot: string) => {
  await expect.poll(async () => (await journal(page)).lecture.texte).toBe(normaliser(mot));
  await verifierLaVoixAnglaise(page);
});

// Si l'appareil a une voix anglaise, c'est elle qui lit le mot ; sinon le mot est demandé en anglais et le navigateur choisit.
async function verifierLaVoixAnglaise(page: Page) {
  const { lecture } = await journal(page);
  expect(lecture.enonces.length).toBeGreaterThan(0);
  const voixAnglaiseDisponible = scenario(page).voix.some((voix) => /^en/i.test(voix.langue));
  for (const enonce of lecture.enonces) {
    expect(enonce.voixLangue ?? enonce.langue).toMatch(/^en/i);
    if (voixAnglaiseDisponible) expect(enonce.voix).toBe(SAMANTHA.nom);
  }
}

Then(/^« ([^«»]+) » n'est jamais écrit à l'écran$/, async ({ page }, mot: string) => {
  expect(await page.content()).not.toContain(mot);
});

Then(/^le son peut être activé par « ([^«»]+) »$/, async ({ page }, libelle: string) => {
  await page.getByRole("button", { name: libelle, exact: true }).click();
  await expect(page.getByRole("banner").getByRole("button", { name: "Son" })).toHaveAttribute("data-son", "son");
  await expect(page.getByTestId("ecoute-sans-son")).toHaveCount(0);
});

// --- Alors : petit écran

Then(/^chaque choix mesure au moins 44 px de haut et de large$/, async ({ page }) => {
  await avancerJusquAuxChoix(page);
  expect(await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth)).toBeLessThanOrEqual(0);
  const choix = await page.getByTestId("choix").all();
  expect(choix.length).toBeGreaterThan(0);
  for (const bulleDeChoixMesuree of choix) {
    const boite = await bulleDeChoixMesuree.boundingBox();
    const nom = await bulleDeChoixMesuree.textContent();
    expect(boite, `choix « ${nom} » visible`).not.toBeNull();
    expect(boite?.width ?? 0, `largeur de « ${nom} »`).toBeGreaterThanOrEqual(44);
    expect(boite?.height ?? 0, `hauteur de « ${nom} »`).toBeGreaterThanOrEqual(44);
  }
});
