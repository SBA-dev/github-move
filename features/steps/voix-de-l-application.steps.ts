import { type Browser, expect, type Page } from "@playwright/test";
import {
  donnerLInstantDuMedia,
  installerLeFauxDesSons,
  observerLesSons,
  phrasesLues,
  servirLesSonsDeTest,
  sonsDe,
} from "../support/sons-de-phrases.ts";
import { BIBLIOTHEQUE, bulle } from "./etapes-puis-exercices.steps.ts";
import { After, Before, Given, Then } from "./fixtures.ts";
import { attendre, fichierDe, installerLesFauxDeLaStory97 } from "./retours-animes-et-sonores.steps.ts";
import {
  consigneAffichee,
  ecranDeLecture,
  laisserPasserLeDelaiDeLecture,
  messageDeVoixAbsente,
  messageDeVoixBloquee,
  normaliser,
  ouvrirLaPageDeLaLeconDeTestDuScenario,
  SAMANTHA,
  scenario,
  terminerLaLecture,
} from "./voix.steps.ts";

// Story #182 : la voix de l'application. Le navigateur de test sert un répertoire des sons de test (features/support/sons-de-phrases.ts),
// vide ou absent par défaut : les scénarios des autres stories ne changent pas. Un scénario déclare ses sons de phrases.
// Le répertoire de la production n'est servi qu'aux scénarios @pwa.

const VOIX_DE_L_APPLICATION = "voix de l'application";
const PERSONNAGES_GUIDES = "Noisette|Lumi|Coach Léo|Capitaine Sam|Agent Max|Lili";
const SCENARIO_OU_LES_SONS_RESTENT_EN_COURS = /est en train de lire|surligné à son tour/;
const PAS_DE_L_INSTANT_MS = 50;

// --- Préparation du navigateur de test

// Un second appareil (téléphone) ouvert par un scénario reçoit le même répertoire des sons de test.
const creationsDeContexte = new WeakMap<Browser, Browser["newContext"]>();

Before({ tags: "not @pwa and not @production" }, async ({ page, browser, $bddContext, $tags }) => {
  const sons = sonsDe(page);
  const etapes = $bddContext.bddTestData.steps.map((etape) => etape.textWithKeyword);
  // Les paroles fixes des personnages guides (salutation, présentation, essai de voix) sont dites par la voix de l'application
  // dès qu'un scénario le dit : le scénario n'a pas à déclarer ces sons-là.
  for (const etape of etapes) {
    for (const [, phrase] of etape.matchAll(/« ([^«»]+) » avec la voix de l'application/g)) sons.ajouter(phrase ?? "");
  }
  sons.retenu = etapes.some((etape) => SCENARIO_OU_LES_SONS_RESTENT_EN_COURS.test(etape));
  await servirLesSonsDeTest(page.context(), sons);
  const creer = browser.newContext.bind(browser);
  creationsDeContexte.set(browser, creer);
  browser.newContext = async (options) => {
    const contexte = await creer(options);
    await servirLesSonsDeTest(contexte, sons);
    return contexte;
  };
  if ($tags.includes("@issue-182")) {
    await page.context().addInitScript(installerLeFauxDesSons, { retenu: sons.retenu });
    await page.addInitScript(installerLesFauxDeLaStory97, { echec: false, retenir: [] });
  }
});

After({ tags: "not @pwa and not @production" }, async ({ browser }) => {
  const creer = creationsDeContexte.get(browser);
  if (creer) browser.newContext = creer;
});

// Le build de production sert le vrai répertoire des sons : la parole de Noisette y est lue par la voix de l'application,
// dans tous les scénarios @pwa. Le faux lecteur journalise ces sons, comme il journalise les paroles de la synthèse.
Before({ tags: "@pwa" }, async ({ page }) => {
  await page.context().addInitScript(installerLeFauxDesSons, { retenu: false });
});

Before({ tags: "@issue-182 and @pwa" }, async ({ page, baseURL }) => {
  // Le relais de test garde la coupure du scénario d'avant : le réseau revient avant chaque scénario.
  await fetch(`${baseURL}/__test/reinitialiser`, { method: "POST" });
  // Les effets sonores sont faux aussi : le son du bouton touché retient la parole suivante tant que l'effet n'est pas fini.
  await page.addInitScript(installerLesFauxDeLaStory97, { echec: false, retenir: [] });
});

// --- Étant donné : les sons de phrases

/** Déclarer des sons de phrases fait de ce scénario un scénario de voix : l'appareil et le profil de voix.steps.ts le préparent. */
function sonsDuScenario(page: Page) {
  scenario(page);
  return sonsDe(page);
}

Given(/^la phrase « ([^«»]+) » a un son de phrase$/, async ({ page }, phrase: string) => {
  sonsDuScenario(page).ajouter(phrase);
  sonsDuScenario(page).ajouterLesIndicationsDuGeste();
});

Given(/^la phrase « ([^«»]+) » n'a pas de son de phrase$/, async ({ page }, phrase: string) => {
  sonsDuScenario(page).retirer(phrase);
});

Given(/^la phrase « ([^«»]+) » a un son de phrase, mais pas la phrase « ([^«»]+) »$/, async ({ page }, avec: string, sans: string) => {
  sonsDuScenario(page).ajouter(avec);
  sonsDuScenario(page).ajouterLesIndicationsDuGeste();
  sonsDuScenario(page).retirer(sans);
});

Given(
  /^la phrase « ([^«»]+) » n'a pas de son de phrase, mais la phrase « ([^«»]+) » en a un$/,
  async ({ page }, sans: string, avec: string) => {
    sonsDuScenario(page).retirer(sans);
    sonsDuScenario(page).ajouter(avec);
    sonsDuScenario(page).ajouterLesIndicationsDuGeste();
  },
);

Given(/^aucune phrase de la séance n'a de son de phrase$/, async ({ page }) => {
  sonsDuScenario(page).viderLeRepertoire();
});

Given(/^le son de phrase de « ([^«»]+) » ne peut pas être joué$/, async ({ page }, phrase: string) => {
  sonsDuScenario(page).rendreIntrouvable(phrase);
});

Given(/^les félicitations de Noisette ont leur son de phrase$/, async ({ page }) => {
  sonsDuScenario(page).ajouterLesParolesCommunes();
});

Given(/^les phrases de la leçon « ([^«»]+) » ont leur son de phrase$/, async ({ page }, titre: string) => {
  const lecon = BIBLIOTHEQUE.find((candidate) => candidate.titre === titre);
  if (!lecon) throw new Error(`Leçon inconnue : ${titre}`);
  sonsDuScenario(page).ajouterLesSonsDeLaLecon(lecon.id);
});

Given(/^le mot dicté « ([^«»]+) » a un son de phrase$/, async ({ page }, mot: string) => {
  sonsDuScenario(page).ajouter(mot);
});

Given(/^la voix de l'application est disponible$/, async ({ page }) => {
  sonsDuScenario(page).servi = true;
});

// --- Étant donné : l'appareil et les messages

Given(/^l'appareil n'a qu'une voix anglaise$/, async ({ page }) => {
  scenario(page).voix = [SAMANTHA];
});

// La page de la leçon est la première à parler : c'est là que la voix absente est signalée, une seule fois.
Given(/^Léa a déjà vu le message de voix absente$/, async ({ page }) => {
  await ouvrirLaPageDeLaLeconDeTestDuScenario(page);
  await expect(messageDeVoixAbsente(page)).toHaveCount(1);
});

// --- Alors : ce que Léa entend

type ParoleDeLaSynthese = { index: number; texte: string; voix: string | null };

async function paroles(page: Page): Promise<ParoleDeLaSynthese[]> {
  return await page.evaluate(() => {
    const faux = Reflect.get(window, "__faux") as { journal: Array<{ type: string; texte: string; voix: string | null }> };
    return faux.journal.flatMap((entree, index) => entree.type === "speak" ? [{ index, texte: entree.texte, voix: entree.voix }] : []);
  });
}

function adressesDes(page: Page, texte: string): string[] {
  const sons = sonsDe(page);
  return phrasesLues(texte).map((cle) => {
    const adresse = sons.adresseDe(cle);
    if (adresse === undefined) throw new Error(`« ${cle} » n'a pas de son de phrase dans ce scénario`);
    return adresse;
  });
}

/** La synthèse vocale n'a lu aucune de ces phrases : c'est la voix de l'application qui les a dites. */
function lueParLaSynthese(dites: readonly ParoleDeLaSynthese[], texte: string): ParoleDeLaSynthese[] {
  const phrases = phrasesLues(texte);
  return dites.filter((dite) => phrases.some((phrase) => normaliser(dite.texte).includes(phrase)));
}

/** Les sons joués contiennent ces fichiers, dans cet ordre (d'autres sons peuvent s'intercaler). */
function dansLOrdre(joues: readonly string[], voulus: readonly string[]): boolean {
  let depuis = 0;
  for (const voulu of voulus) {
    const rang = joues.indexOf(voulu, depuis);
    if (rang < 0) return false;
    depuis = rang + 1;
  }
  return true;
}

async function attendreLesSons(page: Page, adresses: readonly string[]) {
  await expect.poll(async () => {
    const joues = (await observerLesSons(page)).entrees.map((entree) => entree.fichier);
    if (dansLOrdre(joues, adresses)) return true;
    await terminerLaLecture(page);
    return false;
  }, { intervals: [100] }).toBe(true);
}

export async function verifierQueLaVoixDeLApplicationLit(page: Page, texte: string) {
  await attendreLesSons(page, adressesDes(page, texte));
  await laisserPasserLeDelaiDeLecture(page);
  expect(lueParLaSynthese(await paroles(page), texte), `« ${texte} » n'est pas lue par la synthèse vocale`).toEqual([]);
}

Then(
  new RegExp(`^(?:Léa|Paul) entend (?:${PERSONNAGES_GUIDES}) (?:lire|dire) « ([^«»]+) » avec la ${VOIX_DE_L_APPLICATION}$`),
  async ({ page }, texte: string) => {
    await verifierQueLaVoixDeLApplicationLit(ecranDeLecture(page), texte);
  },
);

export async function verifierQueLaVoixDeLAppareilLit(page: Page, texte: string, voix: string | undefined) {
  await expect.poll(async () => {
    if (lueParLaSynthese(await paroles(page), texte).length > 0) return true;
    await terminerLaLecture(page);
    return false;
  }, { intervals: [100] }).toBe(true);
  const lectures = lueParLaSynthese(await paroles(page), texte);
  for (const lecture of lectures) if (voix !== undefined) expect(lecture.voix).toBe(voix);
  const adresses = phrasesLues(texte).flatMap((cle) => sonsDe(page).adresseDe(cle) ?? []);
  const joues = (await observerLesSons(page)).entrees.map((entree) => entree.fichier);
  for (const adresse of adresses) expect(joues, `le son de « ${texte} » n'est pas joué`).not.toContain(adresse);
}

Then(
  new RegExp(`^Léa entend (?:${PERSONNAGES_GUIDES}) (?:lire|dire) « ([^«»]+) » avec la voix « ([^«»]+) »$`),
  async ({ page }, texte: string, voix: string) => {
    await verifierQueLaVoixDeLAppareilLit(ecranDeLecture(page), texte, voix);
  },
);

Then(
  new RegExp(`^(?:Léa|Paul) entend (?:${PERSONNAGES_GUIDES}) (?:lire|dire) « (.+) » avec la voix de l'appareil$`),
  async ({ page }, texte: string) => {
    await verifierQueLaVoixDeLAppareilLit(ecranDeLecture(page), texte, undefined);
  },
);

Then(
  new RegExp(
    `^Léa entend (?:${PERSONNAGES_GUIDES}) lire « ([^«»]+) » avec la ${VOIX_DE_L_APPLICATION}, puis « ([^«»]+) » avec la voix « ([^«»]+) »$`,
  ),
  async ({ page }, premiere: string, seconde: string, voix: string) => {
    const [adresse] = adressesDes(page, premiere);
    await attendreLesSons(page, [adresse ?? ""]);
    await verifierQueLaVoixDeLAppareilLit(page, seconde, voix);
    const son = (await observerLesSons(page)).entrees.find((entree) => entree.fichier === adresse);
    const apres = lueParLaSynthese(await paroles(page), seconde)[0];
    expect(son?.fin, "la voix de l'application a fini de lire").not.toBeNull();
    expect(apres?.index ?? -1, "la voix de l'appareil lit après la voix de l'application").toBeGreaterThanOrEqual(son?.fin ?? Infinity);
    expect(lueParLaSynthese(await paroles(page), premiere), `« ${premiere} » n'est pas lue par la synthèse vocale`).toEqual([]);
  },
);

Then(
  /^Léa entend l'effet sonore « ([^«»]+) » avant que Noisette dise une félicitation avec la voix de l'application$/,
  async ({ page }, effet: string) => {
    const nom = fichierDe(effet);
    await attendre(page, async () => {
      const { effets, entrees } = await observerLesSons(page);
      const dernier = effets.filter((joue) => joue.nom === nom).at(-1);
      return dernier !== undefined && entrees.some((son) => son.sequence > dernier.sequence);
    });
    const { effets, entrees } = await observerLesSons(page);
    const effetJoue = effets.filter((joue) => joue.nom === nom).at(-1);
    const parole = entrees.find((son) => son.sequence > (effetJoue?.sequence ?? Infinity));
    expect(effetJoue?.sonEnCours, `l'effet « ${effet} » joue seul`).toBe(false);
    expect(parole?.effetEnCours, "la félicitation attend la fin de l'effet sonore").toBe(false);
    await expect(bulle(page)).toHaveAttribute("data-nature", "felicitation");
  },
);

const RYTHME_MAXIMUM_D_UNE_LECTURE_LENTE = 0.9;

Then(
  /^Léa entend de nouveau Noisette dire « ([^«»]+) », plus lentement, avec la voix de l'application$/,
  async ({ page }, texte: string) => {
    const [adresse] = adressesDes(page, texte);
    const joues = async () => (await observerLesSons(page)).entrees.filter((entree) => entree.fichier === adresse);
    await expect.poll(async () => {
      if ((await joues()).length >= 1) return true;
      await terminerLaLecture(page);
      return false;
    }, { intervals: [100] }).toBe(true);
    const lecture = (await joues()).at(-1);
    expect(lecture?.rythme, "le son est joué plus lentement").toBeLessThan(RYTHME_MAXIMUM_D_UNE_LECTURE_LENTE);
    expect(lecture?.hauteurGardee, "la hauteur de la voix est gardée").toBe(true);
    expect(lueParLaSynthese(await paroles(page), texte).filter((dite) => normaliser(dite.texte) === normaliser(texte))).toEqual([]);
  },
);

async function imagesAffichees(page: Page) {
  await page.evaluate(() =>
    new Promise<void>((fin) => requestAnimationFrame(() => requestAnimationFrame(() => requestAnimationFrame(() => fin()))))
  );
}

Then(
  /^chaque mot de la consigne est surligné à son tour, dans l'ordre, pendant que Noisette lit avec la voix de l'application$/,
  async ({ page }) => {
    const consigne = scenario(page).consigne.texte;
    const [cle] = phrasesLues(consigne);
    const dureeMs = sonsDe(page).sonDe(cle ?? "")?.dureeMs ?? 0;
    const mots = await consigneAffichee(page).locator("[data-mot]").allTextContents();
    expect(mots.length).toBeGreaterThan(0);
    await expect.poll(async () => (await observerLesSons(page)).actifs).toBe(1);
    const surlignes: number[] = [];
    for (let instantMs = 0; instantMs <= dureeMs; instantMs += PAS_DE_L_INSTANT_MS) {
      await donnerLInstantDuMedia(page, instantMs / 1000);
      await imagesAffichees(page);
      expect((await observerLesSons(page)).actifs, "la voix de l'application lit encore").toBe(1);
      const surligne = consigneAffichee(page).locator("[data-prononce='true']");
      expect(await surligne.count()).toBeLessThanOrEqual(1);
      const rang = await surligne.first().getAttribute("data-mot", { timeout: 200 }).catch(() => null);
      if (rang !== null) surlignes.push(Number(rang));
    }
    expect(surlignes, "les mots sont surlignés dans l'ordre").toEqual([...surlignes].sort((a, b) => a - b));
    expect([...new Set(surlignes)], "chaque mot est surligné au moins une fois").toEqual(mots.map((_, rang) => rang));
  },
);

// --- Alors : les messages de voix absente et de voix bloquée

Then(/^Léa voit un seul message de voix absente$/, async ({ page }) => {
  await expect(messageDeVoixAbsente(page)).toHaveCount(1);
  await expect(page.getByText("ne peut pas lire cette phrase sur cet appareil")).toHaveCount(1);
});

Then(/^Léa ne voit plus le message de voix absente$/, async ({ page }) => {
  await expect.poll(async () => {
    await terminerLaLecture(page);
    return await messageDeVoixAbsente(page).count();
  }, { intervals: [100] }).toBe(0);
});

Then(/^Léa ne voit pas le message de voix absente$/, async ({ page }) => {
  await laisserPasserLeDelaiDeLecture(page);
  await expect(messageDeVoixAbsente(page)).toHaveCount(0);
});

Then(/^Léa ne voit pas le message de voix bloquée$/, async ({ page }) => {
  await laisserPasserLeDelaiDeLecture(page);
  await expect(messageDeVoixBloquee(page)).toHaveCount(0);
});

Then(/^Léa ne voit ni le message de voix absente ni le message de voix bloquée$/, async ({ page }) => {
  await laisserPasserLeDelaiDeLecture(page);
  await expect(messageDeVoixAbsente(page)).toHaveCount(0);
  await expect(messageDeVoixBloquee(page)).toHaveCount(0);
});

// --- Alors : le texte affiché

Then(/^Léa voit que Noisette dit « ([^«»]+) »$/, async ({ page }, texte: string) => {
  await expect(page.getByTestId("parole")).toContainText(texte);
});
