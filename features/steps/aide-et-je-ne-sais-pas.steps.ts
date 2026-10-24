import { expect, type Page } from "@playwright/test";
import { Given, Then, When } from "./fixtures.ts";
import { bulle, injecter, leconDeTest, leconDeTitre } from "./etapes-puis-exercices.steps.ts";
import {
  allerALaQuestion,
  avancerJusquAuxChoix,
  bulleDeChoix,
  demarrageDeLExercice,
  demarrer,
  etatDesChoix,
  leconAChoix,
  questionsDeLaSeance,
  questionsReussies,
  repondre,
  textesDesChoix,
  textesDesChoixPossibles,
} from "./exercices-a-choix.steps.ts";
import { verifierModeDys } from "./reglages.steps.ts";
import { cleDe } from "./univers.steps.ts";
import { normaliser } from "./voix.steps.ts";
import type { ProfilPrepare } from "./fixtures.ts";

// Story #23 : aide après une erreur et « Je ne sais pas ».
// Les mécaniques livrées (choix : bulles, lecture, écoute) se jouent comme un enfant. Celles qui ne sont pas encore
// livrées échouent clairement (« Étape non implémentée ») et leurs scénarios portent @depend-de-<n>.

const LECON_DES_ANIMAUX = "Dictée : les animaux";

function dependDe(numero: number, mecanique: string) {
  return async () => {
    throw new Error(`Étape non implémentée : dépend de la story #${numero} (${mecanique}).`);
  };
}

const jeNeSaisPas = (page: Page) => page.getByTestId("je-ne-sais-pas");

// --- Profil de Tom (aucun scénario livré ne le fait jouer : ses exercices sont des calculs, story #20)

Given(
  /^Tom a un profil enfant préparé de niveau (\S+) dans l'univers « (.+) »$/,
  async ({ monde }, niveau: string, univers: string) => {
    const profil: ProfilPrepare = { prenom: "Tom", niveau, univers: cleDe(univers) };
    monde.profils.set("Tom", profil);
  },
);

// --- Étant donné : questions

Given(/^Léa en est à la question « (.+) » dont la réponse est « ([^«»]+) »$/, async ({ page }, question: string, reponse: string) => {
  const choix = etatDesChoix(page);
  if (!choix.demarrage) {
    choix.demarrage = demarrageDeLExercice(page, leconDeTitre(page, LECON_DES_ANIMAUX), undefined);
  }
  await allerALaQuestion(page, question, true);
  const courante = questionsDeLaSeance(page)[await questionsReussies(page)];
  expect(courante?.reponse).toBe(reponse);
});

async function direJeNeSaisPas(page: Page) {
  await avancerJusquAuxChoix(page);
  etatDesChoix(page).reussiesAvant = await questionsReussies(page);
  await jeNeSaisPas(page).click();
  await expect(jeNeSaisPas(page)).toHaveCount(0);
  await expect(page.getByTestId("bonne-reponse-annoncee")).not.toHaveText("");
}

Given(
  /^Léa a dit « Je ne sais pas » à la question « (.+) » dont la réponse est « ([^«»]+) »$/,
  async ({ page }, question: string, reponse: string) => {
    const choix = etatDesChoix(page);
    if (!choix.demarrage) {
      choix.demarrage = demarrageDeLExercice(page, leconDeTitre(page, LECON_DES_ANIMAUX), undefined);
    }
    await allerALaQuestion(page, question, true);
    expect(questionsDeLaSeance(page)[await questionsReussies(page)]?.reponse).toBe(reponse);
    await direJeNeSaisPas(page);
  },
);

Given(/^une question de test bulles « (.+) » n'a pas d'aide$/, async ({ page }, question: string) => {
  const lecon = leconAChoix("test-question-sans-aide", question, ["6", "7", "8", "9"], "7");
  await injecter(page, lecon);
  etatDesChoix(page).demarrage = demarrageDeLExercice(page, lecon, undefined);
});

Given(/^Léa joue une leçon de test d'une seule question à quatre choix$/, async ({ page }) => {
  const lecon = leconAChoix("test-une-question", "Combien font 3 + 4 ?", ["6", "7", "8", "9"], "7");
  await injecter(page, lecon);
  etatDesChoix(page).demarrage = demarrageDeLExercice(page, lecon, undefined);
});

Given(/^Léa joue une leçon de test de deux questions à quatre choix$/, async ({ page }) => {
  const lecon = leconDeTest("test-deux-questions", "Questions", [{
    type: "bulles",
    titre: "Questions à choix",
    questions: [
      { question: "Combien font 3 + 4 ?", choix: ["6", "7", "8", "9"], reponse: "7" },
      { question: "Combien font 4 + 4 ?", choix: ["7", "8", "9", "10"], reponse: "8" },
    ],
  }]);
  await injecter(page, lecon);
  etatDesChoix(page).demarrage = demarrageDeLExercice(page, lecon, undefined);
});

// --- Étant donné : erreurs et « Je ne sais pas » en cours de séance

async function faireUneErreur(page: Page) {
  await demarrer(page);
  await avancerJusquAuxChoix(page);
  const bonne = questionsDeLaSeance(page)[await questionsReussies(page)]?.reponse;
  const fausse = (await textesDesChoixPossibles(page)).find((texte) => texte !== bonne);
  if (fausse === undefined) throw new Error("Aucun mauvais choix possible");
  await repondre(page, fausse);
}

async function donnerLaBonneReponse(page: Page) {
  await demarrer(page);
  await avancerJusquAuxChoix(page);
  const rang = await questionsReussies(page);
  await repondre(page, (questionsDeLaSeance(page)[rang] as { reponse: string }).reponse);
  await expect(page.getByTestId("recipient")).toHaveAttribute("data-questions-reussies", String(rang + 1));
}

Given(/^Léa a dit « Je ne sais pas » à cette question$/, async ({ page }) => {
  await demarrer(page);
  await direJeNeSaisPas(page);
});

Given(
  /^à la première question, Léa a fait deux erreurs, puis a dit « Je ne sais pas », puis a donné la bonne réponse$/,
  async ({ page }) => {
    await faireUneErreur(page);
    await faireUneErreur(page);
    await direJeNeSaisPas(page);
    await donnerLaBonneReponse(page);
  },
);

Given(/^à la deuxième question, Léa a fait une erreur$/, async ({ page }) => {
  await faireUneErreur(page);
});

// --- Quand

When(/^Léa dit « Je ne sais pas »$/, async ({ page }) => {
  await demarrer(page);
  await direJeNeSaisPas(page);
});

When(/^Léa dit « Je ne sais pas », au clavier seulement$/, async ({ page }) => {
  await demarrer(page);
  await avancerJusquAuxChoix(page);
  etatDesChoix(page).reussiesAvant = await questionsReussies(page);
  const focaliseLeBouton = () => page.evaluate(() => document.activeElement?.getAttribute("data-testid") === "je-ne-sais-pas");
  for (let essai = 0; essai < 30 && !(await focaliseLeBouton()); essai++) await page.keyboard.press("Tab");
  expect(await focaliseLeBouton()).toBe(true);
  await page.keyboard.press("Enter");
  await expect(jeNeSaisPas(page)).toHaveCount(0);
});

When(/^Léa répond « ([^«»]+) » à « (.+) »$/, async ({ page }, reponse: string, question: string) => {
  await repondre(page, reponse, question);
});

When(/^Léa donne la bonne réponse à la deuxième question$/, async ({ page }) => {
  await donnerLaBonneReponse(page);
});

// --- Plan : « Je ne sais pas » est proposé dans un exercice <type>

function leconDeTestDuType(type: string) {
  const question = "Quel animal est un chat ?";
  const choix = ["un chat", "un chien", "un oiseau"];
  const reponse = "un chat";
  const exercices: Record<string, Record<string, unknown>> = {
    bulles: { type: "bulles", titre: "Exercice", questions: [{ question, choix, reponse }] },
    lecture: { type: "lecture", titre: "Exercice", texte: "Plume est un petit chat gris.", questions: [{ question, choix, reponse }] },
    ecoute: { type: "ecoute", titre: "Exercice", langue: "en-GB", items: [{ dire: "cat", question, choix, reponse }] },
  };
  const exercice = exercices[type];
  return exercice === undefined ? undefined : leconDeTest(`test-je-ne-sais-pas-${type}`, `Leçon de test ${type}`, [exercice]);
}

const DEPENDANCES_PAR_TYPE: Readonly<Record<string, { numero: number; mecanique: string }>> = {
  trous: { numero: 18, mecanique: "texte à trous" },
  conjugaison: { numero: 19, mecanique: "conjugaison" },
  calcul: { numero: 20, mecanique: "calcul" },
  boite: { numero: 21, mecanique: "boîte" },
  barres: { numero: 21, mecanique: "barres" },
};

When(/^(Léa|Tom) commence un exercice (\S+) d'une leçon de test$/, async ({ page }, _enfant: string, type: string) => {
  const lecon = leconDeTestDuType(type);
  if (lecon === undefined) {
    const dependance = DEPENDANCES_PAR_TYPE[type];
    if (dependance === undefined) throw new Error(`Type d'exercice inconnu : ${type}`);
    return await dependDe(dependance.numero, dependance.mecanique)();
  }
  await injecter(page, lecon);
  await demarrageDeLExercice(page, lecon, "Exercice")(undefined);
});

Then(/^« Je ne sais pas » est proposé à (Léa|Tom)$/, async ({ page }, _enfant: string) => {
  await avancerJusquAuxChoix(page);
  await expect(jeNeSaisPas(page)).toBeVisible();
  await expect(page.getByRole("button", { name: "Je ne sais pas", exact: true })).toBeVisible();
});

// --- Plan : « Je ne sais pas » dans un exercice <type> : <ce qui est montré> (mécaniques à livrer)

const DEPENDANCES_DU_MONTRE: ReadonlyArray<readonly [RegExp, number, string]> = [
  [/^Léa joue un exercice classer d'une leçon de test$/, 18, "classer"],
  [/^Léa joue un exercice ordre d'une leçon de test$/, 18, "ordre"],
  [/^Léa joue un exercice addition à l'étape poser d'une leçon de test$/, 20, "addition posée"],
  [/^Léa joue un exercice dictee d'une leçon de test$/, 19, "dictée"],
  [/^la bonne maison de l'étiquette choisie brille$/, 18, "classer"],
  [/^l'étiquette qui vient ensuite brille$/, 18, "ordre"],
  [/^la bonne colonne du chiffre choisi brille$/, 20, "addition posée"],
  [/^la lettre juste suivante s'écrit dans sa case, sans montrer tout le mot$/, 19, "dictée"],
  [/^Léa doit encore donner elle-même la bonne réponse$/, 18, "classer, ordre, addition posée, dictée"],
];
for (const [motif, numero, mecanique] of DEPENDANCES_DU_MONTRE) {
  Given(motif, dependDe(numero, mecanique));
}

// --- Alors : bulles, choix, annonce

Then(/^Noisette dit un encouragement, suivi de « (.+) »$/, async ({ page }, complement: string) => {
  await expect(bulle(page)).toHaveAttribute("data-nature", "encouragement");
  const texte = normaliser((await bulle(page).textContent()) ?? "");
  expect(texte.endsWith(` ${complement}`), texte).toBe(true);
  expect(texte.length).toBeGreaterThan(complement.length + 1);
});

Then(/^seul le choix « ([^«»]+) » reste, et il brille$/, async ({ page }, reponse: string) => {
  await avancerJusquAuxChoix(page);
  await expect.poll(async () => await textesDesChoixPossibles(page)).toEqual([reponse]);
  await expect(bulleDeChoix(page, reponse)).toHaveAttribute("data-brille", "true");
  await expect(page.locator('[data-testid="choix"][data-brille="true"]')).toHaveCount(1);
});

Then(/^les lecteurs d'écran annoncent que la bonne réponse est « ([^«»]+) »$/, async ({ page }, reponse: string) => {
  const annonce = page.getByTestId("bonne-reponse-annoncee");
  await expect(annonce).toHaveAttribute("role", "status");
  await expect(annonce).toHaveText(`La bonne réponse est « ${reponse} ».`);
});

Then(/^le choix « ([^«»]+) » est mis en avant sans bouger$/, async ({ page }, reponse: string) => {
  const choix = bulleDeChoix(page, reponse);
  await expect(choix).toHaveAttribute("data-brille", "true");
  await expect(choix).toHaveCSS("animation-name", "none");
  await expect(choix).toHaveCSS("transition-duration", "0s");
  await expect(choix).toHaveCSS("transform", "none");
  const ombre = await choix.evaluate((element) => getComputedStyle(element).boxShadow);
  expect(ombre).not.toBe("none");
});

Then(/^« Je ne sais pas » n'est plus proposé à Léa pour cette question$/, async ({ page }) => {
  await expect(jeNeSaisPas(page)).toHaveCount(0);
  await expect(page.getByRole("button", { name: "Je ne sais pas", exact: true })).toHaveCount(0);
});

Then(/^« Je ne sais pas » est de nouveau proposé à Léa$/, async ({ page }) => {
  await expect(page.getByTestId("recipient")).toHaveAttribute("data-questions-reussies", String(etatDesChoix(page).reussiesAvant + 1));
  await avancerJusquAuxChoix(page);
  await expect(jeNeSaisPas(page)).toBeVisible();
});

Then(/^« Je ne sais pas » n'est pas proposé à Léa$/, async ({ page }) => {
  await expect(jeNeSaisPas(page)).toHaveCount(0);
  await expect(page.getByRole("button", { name: "Je ne sais pas", exact: true })).toHaveCount(0);
});

Then(/^la question suivante s'affiche$/, async ({ page }) => {
  const rang = etatDesChoix(page).reussiesAvant + 1;
  await expect(page.getByTestId("recipient")).toHaveAttribute("data-questions-reussies", String(rang));
  await avancerJusquAuxChoix(page);
  const suivante = questionsDeLaSeance(page)[rang];
  expect(suivante).toBeDefined();
  expect([...(await textesDesChoix(page))].sort()).toEqual([...(suivante?.choix ?? [])].sort());
});

// --- Alors : petit écran, mode dys

Then(/^« Je ne sais pas » mesure au moins 44 px de haut$/, async ({ page }) => {
  await avancerJusquAuxChoix(page);
  const boite = await jeNeSaisPas(page).boundingBox();
  expect(boite).not.toBeNull();
  expect(boite?.height ?? 0).toBeGreaterThanOrEqual(44);
});

Then(/^Léa voit « ([^«»]+) » dans la bulle de Noisette en mode dys$/, async ({ page }, texte: string) => {
  await expect(bulle(page)).toContainText(texte);
  await verifierModeDys(page, [bulle(page)], true);
});

// --- Calcul au clavier de cristaux : story #20

Given(/^une leçon de test de niveau CE1 a un exercice calcul « (?:.+) », de résultat (?:\d+)(?:, d'aide « .+ »)?$/, dependDe(20, "calcul au clavier de cristaux"));
Given(/^Tom a répondu faux (?:\d+) fois de suite à « (?:.+) »$/, dependDe(20, "calcul au clavier de cristaux"));
When(/^Tom répond « (?:[^«»]+) » à « (?:.+) »$/, dependDe(20, "calcul au clavier de cristaux"));
Given(/^Tom en est au calcul « (?:.+) »$/, dependDe(20, "calcul au clavier de cristaux"));
When(/^Tom dit « Je ne sais pas »$/, dependDe(20, "calcul au clavier de cristaux"));
Then(/^le calcul « (?:.+) » reste posé jusqu'à ce que Tom tape (?:\d+)$/, dependDe(20, "calcul au clavier de cristaux"));
Given(/^Tom joue une leçon de test de niveau CE1 de deux calculs$/, dependDe(20, "calcul au clavier de cristaux"));
Given(
  /^au premier calcul, Tom a dit « Je ne sais pas », puis a tapé une mauvaise réponse, puis la bonne$/,
  dependDe(20, "calcul au clavier de cristaux"),
);
Given(/^au second calcul, Tom a fait deux erreurs$/, dependDe(20, "calcul au clavier de cristaux"));
When(/^Tom donne la bonne réponse au second calcul$/, dependDe(20, "calcul au clavier de cristaux"));
