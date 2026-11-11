import { expect, type Page } from "@playwright/test";
import { phrasesAvecCle } from "../../supabase/functions/_shared/voix/domain/cle-de-phrase.ts";
import { instantsDesMots } from "../../supabase/functions/_shared/voix/domain/instants-des-mots.ts";
import {
  avancerLeMp3A,
  declarerLesPhrases,
  DUREE_DU_MP3_DE_TEST_MS,
  messageDeVoixIndisponible,
  type Parole,
  paroles,
  preparerLeRepertoireDeTest,
  repertoireDeTest,
  retirerLesPhrases,
  texteDuMessageDeVoixIndisponible,
} from "../support/voix-enregistree.ts";
import { terminerLaLecture } from "../support/lecture-vocale.ts";
import { RYTHME_PLUS_LENT, etatDeLaDictee } from "./dictee-et-conjugaison.steps.ts";
import { leconAChoix, QUESTIONS_DE_TEST } from "./exercices-a-choix.steps.ts";
import { bulle, injecter, interceptertLaBibliotheque } from "./etapes-puis-exercices.steps.ts";
import { Given, Then } from "./fixtures.ts";
import {
  consigneAffichee,
  journal,
  messageDeVoixBloquee,
  normaliser,
  ouvrir,
  ouvrirLaPageDeLaLeconDeTest,
  preparerLaPage,
  scenario,
} from "./voix.steps.ts";

type Voix = "enregistree" | "appareil";

const VOIX: Readonly<Record<string, Voix>> = { "enregistrée": "enregistree", "de l'appareil": "appareil" };

/** Les phrases que la voix dit pour ce texte, telles que le domaine les découpe (la règle n'est écrite qu'à un endroit). */
function phrasesDit(texte: string): string[] {
  return phrasesAvecCle(texte).map((phrase) => phrase.texte);
}

function estDite(parole: Parole, phrase: string, voix: Voix): boolean {
  return parole.source === voix && !parole.bloquee && parole.texte === phrase;
}

async function ecouteLaPhrase(page: Page, phrase: string, voix: Voix): Promise<boolean> {
  return (await paroles(page)).some((parole) => estDite(parole, phrase, voix));
}

// --- Étant donné : le répertoire des phrases enregistrées

const ADDITION_DITE = /^Combien font (\d+) plus (\d+) \?$/;

Given(/^la phrase « ([^«»]+) » est une phrase enregistrée$/, async ({ page }, texte: string) => {
  // La question écrite avec des symboles est posée par une leçon de test : la phrase dite avec des mots en est la lecture.
  const [, a, b] = ADDITION_DITE.exec(texte) ?? [];
  if (a !== undefined && b !== undefined) await leconQuiPoseLaQuestion(page, `Combien font ${a} + ${b} ?`);
  declarerLesPhrases(await preparerLeRepertoireDeTest(page), texte);
});

Given(/^la phrase « ([^«»]+) » est une phrase enregistrée dont le MP3 ne peut pas être lu$/, async ({ page }, texte: string) => {
  declarerLesPhrases(await preparerLeRepertoireDeTest(page), texte, { illisible: true });
});

Given(/^la phrase « ([^«»]+) » n'est pas une phrase enregistrée$/, async ({ page }, texte: string) => {
  retirerLesPhrases(await preparerLeRepertoireDeTest(page), texte);
});

/** La dictée se joue dans la bibliothèque de l'application : la page est préparée (profil de Léa, faux navigateur) avant d'ouvrir la leçon. */
async function preparerLaLeconDeDictee(page: Page): Promise<void> {
  await preparerLaPage(page, scenario(page));
  await interceptertLaBibliotheque(page);
}

Given(/^le mot « ([^«»]+) » est une phrase enregistrée, à l'allure normale et à l'allure lente$/, async ({ page }, mot: string) => {
  await preparerLaLeconDeDictee(page);
  declarerLesPhrases(await preparerLeRepertoireDeTest(page), mot, { lente: true });
});

Given(/^le mot « ([^«»]+) » est une phrase enregistrée, à l'allure normale seulement$/, async ({ page }, mot: string) => {
  await preparerLaLeconDeDictee(page);
  declarerLesPhrases(await preparerLeRepertoireDeTest(page), mot);
});

Given(/^aucune phrase de la leçon de test n'est une phrase enregistrée$/, async ({ page }) => {
  await preparerLeRepertoireDeTest(page);
});

const ADDITION = /^Combien font (\d+) \+ (\d+) \?$/;

/** Une question de calcul tirée au hasard : une leçon de test la pose, avec ses choix, pour que la séance puisse la jouer. */
async function leconQuiPoseLaQuestion(page: Page, question: string): Promise<void> {
  const connue = QUESTIONS_DE_TEST[question];
  if (connue) return await injecter(page, leconAChoix("test-182-question-de-test", question, connue.choix, connue.reponse));
  const [, a, b] = ADDITION.exec(question) ?? [];
  if (a === undefined || b === undefined) throw new Error(`Question de test inconnue : ${question}`);
  const somme = Number(a) + Number(b);
  const choix = [somme - 10, somme, somme + 10, somme + 1].map(String);
  await injecter(page, leconAChoix(`test-182-${a}-plus-${b}`, question, choix, String(somme)));
}

Given(/^la question « ([^«»]+) » n'est pas une phrase enregistrée$/, async ({ page }, question: string) => {
  retirerLesPhrases(await preparerLeRepertoireDeTest(page), question);
  await leconQuiPoseLaQuestion(page, question);
});

// --- Étant donné : le message de voix indisponible

// Le répertoire est connu avant l'ouverture de la page : le message est vu quand la page de la leçon s'ouvre.
Given(/^Léa voit le message de voix indisponible$/, async ({ page }) => {
  (await preparerLeRepertoireDeTest(page)).messageDeVoixIndisponibleAVoirAvant = true;
});

Given(/^Léa a déjà vu le message de voix indisponible$/, async ({ page }) => {
  await preparerLeRepertoireDeTest(page);
  const etat = scenario(page);
  etat.ouvert = true;
  await ouvrirLaPageDeLaLeconDeTest(page, etat, etat.consigne.texte);
  await expect(messageDeVoixIndisponible(page)).toHaveCount(1);
});

// --- Étant donné : Noisette est en train de lire

Given(/^Noisette est en train de lire, avec la voix enregistrée, la consigne « (.+) »$/, async ({ page }, texte: string) => {
  declarerLesPhrases(await preparerLeRepertoireDeTest(page), texte);
  const etat = scenario(page);
  etat.consigne.texte = texte;
  etat.reecouteLaConsigneDOuverture = true;
  await ouvrir(page);
  const [premiere] = phrasesDit(texte);
  await expect.poll(async () => ecouteLaPhrase(page, premiere ?? texte, "enregistree")).toBe(true);
  expect((await journal(page)).actifs).toBeGreaterThan(0);
});

// --- Alors : qui dit quoi

Then(
  /^Léa entend (?:Noisette|Lumi|Coach Léo|Capitaine Sam) (?:lire|dire) « ([^«»]+) » avec la voix (enregistrée|de l'appareil)$/,
  async ({ page }, texte: string, voix: string) => {
    const choisie = VOIX[voix] as Voix;
    for (const phrase of phrasesDit(texte)) {
      await expect.poll(async () => ecouteLaPhrase(page, phrase, choisie), { message: `« ${phrase} » dite avec la voix ${voix}` }).toBe(true);
    }
  },
);

Then(
  /^Léa entend Noisette lire « ([^«»]+) » avec la voix enregistrée, puis « ([^«»]+) » avec la voix de l'appareil$/,
  async ({ page }, premiere: string, seconde: string) => {
    const [avant] = phrasesDit(premiere);
    const [apres] = phrasesDit(seconde);
    // Le faux navigateur ne termine une lecture que sur demande : on termine la voix enregistrée pour que la suite vienne.
    await expect.poll(async () => {
      const dites = await paroles(page);
      const rangAvant = dites.findIndex((parole) => estDite(parole, avant ?? premiere, "enregistree"));
      const rangApres = dites.findIndex((parole) => estDite(parole, apres ?? seconde, "appareil"));
      if (rangAvant >= 0 && rangApres > rangAvant) return true;
      await terminerLaLecture(page);
      return false;
    }, { intervals: [100] }).toBe(true);
  },
);

Then(/^Léa n'entend pas « ([^«»]+) » avec la voix enregistrée$/, async ({ page }, texte: string) => {
  for (const phrase of phrasesDit(texte)) expect(await ecouteLaPhrase(page, phrase, "enregistree")).toBe(false);
});

Then(/^Léa n'entend jamais la voix enregistrée dire « ([^«»]+) »$/, async ({ page }, texte: string) => {
  const dites = (await paroles(page)).filter((parole) => parole.source === "enregistree");
  expect(dites.filter((parole) => parole.texte.includes(texte))).toEqual([]);
});

// --- Alors : lecture lente

Then(
  /^Léa entend de nouveau Noisette dire « ([^«»]+) », plus lentement, avec la voix enregistrée$/,
  async ({ page }, mot: string) => {
    const memoire = etatDeLaDictee(page);
    const phrase = phrasesDit(mot)[0] ?? mot;
    const cle = phrasesAvecCle(mot)[0]?.cle ?? "";
    const lenteEnregistree = repertoireDeTest(page)?.phrases.get(cle)?.lente ?? false;
    const apresLaDemande = async () =>
      (await paroles(page)).slice(memoire.paroles).filter((parole) => estDite(parole, phrase, "enregistree"));
    await expect.poll(async () => (await apresLaDemande()).length).toBeGreaterThan(0);
    const [lecture] = await apresLaDemande();
    const rythmeNormal = memoire.rythmeNormal ?? 1;
    if (lenteEnregistree) {
      // Le MP3 lent est déjà ralenti : le lecteur ne le ralentit pas une seconde fois.
      expect(lecture?.adresse).toContain("-lente-");
      expect(lecture?.rythme).toBeCloseTo(1, 5);
    } else {
      expect(lecture?.adresse).not.toContain("-lente-");
      expect(lecture?.rythme).toBeCloseTo(rythmeNormal * RYTHME_PLUS_LENT, 5);
    }
  },
);

// --- Alors : surlignage

Then(
  /^les mots de la consigne sont surlignés l'un après l'autre, dans l'ordre, pendant que Noisette la lit avec la voix enregistrée$/,
  async ({ page }) => {
    const [phrase] = phrasesDit(scenario(page).consigne.texte);
    expect(phrase).toBeDefined();
    await expect.poll(async () => ecouteLaPhrase(page, phrase ?? "", "enregistree")).toBe(true);
    const lecture = (await paroles(page)).find((parole) => estDite(parole, phrase ?? "", "enregistree"));
    const rythme = lecture?.rythme ?? 1;
    // Comme le lecteur : le temps écoulé de la phrase est celui du MP3 divisé par la vitesse de lecture.
    const instants = instantsDesMots(phrase ?? "", DUREE_DU_MP3_DE_TEST_MS / rythme);
    const mots = await consigneAffichee(page).locator("[data-mot]").allTextContents();
    expect(instants.length).toBeGreaterThan(1);
    expect(mots.length).toBe(instants.length);
    for (const [rang, mot] of mots.entries()) {
      await avancerLeMp3A(page, (((instants[rang]?.debutMs ?? 0) + 1) * rythme) / 1000);
      const surligne = consigneAffichee(page).locator("[data-prononce='true']");
      await expect(surligne).toHaveCount(1);
      await expect(surligne).toHaveText(mot);
      await expect(surligne).toHaveAttribute("data-mot", String(rang));
    }
  },
);

// --- Alors : les messages

Then(/^Léa voit un seul message de voix indisponible$/, async ({ page }) => {
  await expect(messageDeVoixIndisponible(page)).toHaveCount(1);
  await expect(texteDuMessageDeVoixIndisponible(page)).toHaveCount(1);
});

Then(/^Léa ne voit aucun message de voix bloquée$/, async ({ page }) => {
  await expect(messageDeVoixBloquee(page)).toHaveCount(0);
});

// Le faux navigateur ne termine une lecture que sur demande : la lecture réussie se termine ici, comme pour la voix bloquée.
Then(/^Léa ne voit plus le message de voix indisponible$/, async ({ page }) => {
  await terminerLaLecture(page);
  await expect.poll(async () => await messageDeVoixIndisponible(page).count(), { intervals: [10] }).toBe(0);
});

Then(/^Léa ne voit pas le message « (.+) »$/, async ({ page }, message: string) => {
  await expect(page.getByRole("status").filter({ hasText: message })).toHaveCount(0);
  await expect(page.getByTestId("ecoute-sans-son").filter({ hasText: message })).toHaveCount(0);
});

Then(/^Léa voit « ([^«»]+) » dans la bulle de Noisette$/, async ({ page }, texte: string) => {
  await expect(bulle(page)).toContainText(normaliser(texte));
});

// --- Alors : l'espace parent

const TITRE_DE_LA_VOIX_DES_PERSONNAGES = "La voix des personnages guides";

function sectionDuChoixDeVoix(page: Page) {
  return page.getByTestId("choix-de-voix");
}

async function ordonnee(element: ReturnType<Page["locator"]>): Promise<number> {
  const boite = await element.boundingBox();
  expect(boite, "élément visible à l'écran").not.toBeNull();
  return boite?.y ?? 0;
}

Then(/^Paul voit d'abord la voix de Savanturier, sans choix à faire$/, async ({ page }) => {
  const section = sectionDuChoixDeVoix(page);
  const titreDeSavanturier = section.getByTestId("voix-de-savanturier");
  const titreDesPersonnages = section.getByRole("heading", { name: TITRE_DE_LA_VOIX_DES_PERSONNAGES, exact: true });
  await expect(titreDeSavanturier).toHaveText("La voix de Savanturier");
  await expect(section.getByText("rien à choisir")).toBeVisible();
  expect(await ordonnee(titreDeSavanturier)).toBeLessThan(await ordonnee(titreDesPersonnages));
  // Aucun choix (bouton radio) n'est proposé avant le titre suivant.
  const premierChoix = section.getByRole("radio").first();
  if (await premierChoix.count() > 0) {
    expect(await ordonnee(premierChoix)).toBeGreaterThan(await ordonnee(titreDesPersonnages));
  }
});

Then(/^Paul voit ensuite le choix de la voix de l'appareil « ([^«»]+) »$/, async ({ page }, precision: string) => {
  const section = sectionDuChoixDeVoix(page);
  const titreDeSavanturier = section.getByTestId("voix-de-savanturier");
  const explication = section.getByText(precision);
  await expect(explication).toBeVisible();
  await expect(section.getByRole("radiogroup")).toBeVisible();
  expect(await ordonnee(explication)).toBeGreaterThan(await ordonnee(titreDeSavanturier));
});

Then(/^Paul ne voit pas le message « (.+) »$/, async ({ page }, message: string) => {
  await expect(page.getByText(message, { exact: true })).toHaveCount(0);
});
