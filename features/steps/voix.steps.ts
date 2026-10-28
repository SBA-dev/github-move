import { type BrowserContext, expect, type Page } from "@playwright/test";
import type { Famille } from "../support/famille.ts";
import { avecLesReglagesPrevus } from "../support/reglages-prevus.ts";
import {
  bulle,
  commencerLaSeanceComplete,
  injecter,
  interceptertLaBibliotheque,
  leconDeTest,
  ouvrirLaPageDeLaLecon,
} from "./etapes-puis-exercices.steps.ts";
import { estSurUnProfilReel } from "./profil-reel.ts";
import { choisirSonProfil, modifierLeProfil } from "./profils-enfants.steps.ts";
import { allerALaQuestion, avancerJusquAuxChoix, bulleDeChoix, demarrer, textesDesChoix } from "./exercices-a-choix.steps.ts";
import { After, Given, Then, When } from "./fixtures.ts";

// --- Préparation du scénario (avant l'ouverture de la page)

export type VoixFausse = { readonly nom: string; readonly langue: string };
export type Scenario = {
  voix: VoixFausse[];
  univers: string | undefined;
  consigne: { texte: string };
  bloque: boolean;
  absent: boolean;
  muet: boolean;
  ouvert: boolean;
  prenom: string;
  sansProfil: boolean;
  voixImposee: string | undefined;
  /** #79 : Léa relit la consigne pendant que Noisette lit la question ; `lotsAvant` = lectures déjà faites à ce moment-là. */
  relitPendantLaQuestion: { relue: boolean; lotsAvant: number | undefined } | undefined;
  /** #7 : Léa réécoute la consigne d'ouverture pendant qu'elle est lue (« Réécouter », actif pendant la présentation, 79.12). */
  reecouteLaConsigneDOuverture: boolean;
};

const CLE_PROFIL_PREPARE = "savanturier:profil-prepare";
const CLE_SON = "savanturier:son";
const CLE_VOIX = "savanturier:voix";
const CLE_VOIX_AMORCEE = "savanturier:voix-amorcee-par-le-test";

export const DENISE: VoixFausse = { nom: "Denise", langue: "fr-FR" };
const HENRI: VoixFausse = { nom: "Henri", langue: "fr-FR" };
export const SAMANTHA: VoixFausse = { nom: "Samantha", langue: "en-US" };
const CONSIGNE_PAR_DEFAUT = "Écoute bien.";
export const HAUTEUR_DE_CAPITAINE_SAM = 0.95;
const HAUTEUR_ATTENDUE_SANS_VOIX_MASCULINE = 0.7;
const TOLERANCE_DE_HAUTEUR = 0.035;
// Le premier speak a lieu 60 ms après la demande : on laisse passer ce délai pour prouver qu'on n'entend rien.
const DELAI_POUR_PROUVER_LE_SILENCE_MS = 400;

const scenarios = new WeakMap<Page, Scenario>();

export function scenario(page: Page): Scenario {
  let etat = scenarios.get(page);
  if (!etat) {
    etat = {
      voix: [DENISE, HENRI],
      univers: undefined,
      consigne: { texte: CONSIGNE_PAR_DEFAUT },
      bloque: false,
      absent: false,
      muet: false,
      ouvert: false,
      prenom: "Léa",
      sansProfil: false,
      voixImposee: undefined,
      relitPendantLaQuestion: undefined,
      reecouteLaConsigneDOuverture: false,
    };
    scenarios.set(page, etat);
  }
  return etat;
}

// --- Faux speechSynthesis, installé avant le chargement de la page

type ConfigurationDuFaux = { voix: readonly VoixFausse[]; bloque: boolean; absent: boolean };

export function installerLeFaux(config: ConfigurationDuFaux) {
  type Enonce = {
    text: string;
    lang: string;
    voice: { name: string; lang: string } | null;
    pitch: number;
    rate: number;
    volume: number;
    onboundary: ((evenement: { name: string; charIndex: number }) => void) | null;
    onend: (() => void) | null;
    onerror: ((evenement: { error: string }) => void) | null;
  };
  type Entree = {
    type: "speak" | "cancel";
    lot: number;
    texte: string;
    voix: string | null;
    voixLangue: string | null;
    langue: string;
    pitch: number;
    rate: number;
  };
  const faux = {
    journal: [] as Entree[],
    enonces: [] as Array<{ lot: number; enonce: Enonce }>,
    actifs: [] as Enonce[],
    lot: 0,
    lotOuvert: false,
    chevauchements: 0,
    bloque: config.bloque,
  };
  class EnonceDeTest implements Enonce {
    lang = "";
    voice: { name: string; lang: string } | null = null;
    pitch = 1;
    rate = 1;
    volume = 1;
    onboundary: Enonce["onboundary"] = null;
    onend: Enonce["onend"] = null;
    onerror: Enonce["onerror"] = null;
    constructor(public text: string) {}
  }
  const voix = config.voix.map(({ nom, langue }) => ({
    name: nom,
    lang: langue,
    default: false,
    localService: true,
    voiceURI: nom,
  }));
  const synthese = {
    onvoiceschanged: null,
    getVoices: () => voix,
    speak(enonce: Enonce) {
      if (enonce.text === " " && enonce.volume === 0) return;
      if (!faux.lotOuvert) {
        faux.lot += 1;
        faux.lotOuvert = true;
        if (faux.actifs.length > 0) faux.chevauchements += 1;
        setTimeout(() => {
          faux.lotOuvert = false;
        }, 0);
      }
      faux.actifs.push(enonce);
      faux.enonces.push({ lot: faux.lot, enonce });
      faux.journal.push({
        type: "speak",
        lot: faux.lot,
        texte: enonce.text,
        voix: enonce.voice?.name ?? null,
        voixLangue: enonce.voice?.lang ?? null,
        langue: enonce.lang,
        pitch: enonce.pitch,
        rate: enonce.rate,
      });
      if (faux.bloque) setTimeout(() => enonce.onerror?.({ error: "not-allowed" }), 0);
    },
    cancel() {
      faux.actifs = [];
      faux.journal.push({ type: "cancel", lot: faux.lot, texte: "", voix: null, voixLangue: null, langue: "", pitch: 0, rate: 0 });
    },
    resume() {},
    pause() {},
  };
  Reflect.set(window, "__faux", faux);
  Reflect.set(window, "SpeechSynthesisUtterance", EnonceDeTest);
  Object.defineProperty(window, "speechSynthesis", {
    configurable: true,
    value: config.absent ? undefined : synthese,
  });
}

type Lecture = {
  texte: string;
  enonces: Array<{ texte: string; voix: string | null; voixLangue: string | null; langue: string; pitch: number }>;
};

type JournalDuFaux = { lots: number; lecture: Lecture; speaks: number; chevauchements: number; coupeApresLaDerniereParole: boolean; actifs: number };

export async function journal(page: Page): Promise<JournalDuFaux> {
  return await page.evaluate(() => {
    const faux = Reflect.get(window, "__faux") as {
      journal: Array<{ type: string; lot: number; texte: string; voix: string | null; voixLangue: string | null; langue: string; pitch: number }>;
      actifs: unknown[];
      lot: number;
      chevauchements: number;
    };
    const paroles = faux.journal.filter((e) => e.type === "speak");
    const dernierLot = paroles.filter((e) => e.lot === faux.lot);
    const dernier = faux.journal[faux.journal.length - 1];
    return {
      lots: faux.lot,
      speaks: paroles.length,
      chevauchements: faux.chevauchements,
      actifs: faux.actifs.length,
      coupeApresLaDerniereParole: dernier?.type === "cancel",
      lecture: {
        texte: dernierLot.map((e) => e.texte).join(" ").replace(/\s+/g, " ").trim(),
        enonces: dernierLot.map((e) => ({
          texte: e.texte,
          voix: e.voix,
          voixLangue: e.voixLangue,
          langue: e.langue,
          pitch: e.pitch,
        })),
      },
    };
  });
}

export async function attendreUneLecture(page: Page) {
  await expect.poll(async () => (await journal(page)).speaks).toBeGreaterThan(0);
}

export async function laisserPasserLeDelaiDeLecture(page: Page) {
  await page.evaluate((delai) => new Promise<void>((fin) => setTimeout(fin, delai)), DELAI_POUR_PROUVER_LE_SILENCE_MS);
}

export async function terminerLaLecture(page: Page) {
  await page.evaluate(() => {
    const faux = Reflect.get(window, "__faux") as {
      enonces: Array<{ lot: number; enonce: { onend: (() => void) | null } }>;
      actifs: unknown[];
    };
    const dernier = faux.enonces[faux.enonces.length - 1];
    faux.actifs = [];
    dernier?.enonce.onend?.();
  });
}

/**
 * Termine la lecture en cours seulement si ce n'est pas `voulu`, et le décide dans la page, sans rendre la main entre la lecture
 * du journal et la fin : sinon, l'application peut passer à la lecture voulue entre les deux, et l'étape la terminerait à tort.
 * Rend vrai quand la lecture en cours est `voulu`.
 */
export async function terminerLaLectureSiCenEstPas(page: Page, voulu: string): Promise<boolean> {
  return await page.evaluate((texteVoulu) => {
    const faux = Reflect.get(window, "__faux") as {
      journal: Array<{ type: string; lot: number; texte: string }>;
      enonces: Array<{ lot: number; enonce: { onend: (() => void) | null } }>;
      actifs: unknown[];
      lot: number;
    };
    const lue = faux.journal
      .filter((e) => e.type === "speak" && e.lot === faux.lot)
      .map((e) => e.texte)
      .join(" ")
      .replace(/\s+/g, " ")
      .trim();
    if (lue === texteVoulu) return true;
    if (lue !== "") {
      faux.actifs = [];
      faux.enonces[faux.enonces.length - 1]?.enonce.onend?.();
    }
    return false;
  }, voulu);
}

// Les étapes de voix appliquées après la préparation de la page (voix de l'appareil, Muet) : le scénario #17 les règle
// après le Contexte, qui a déjà préparé la page. Cette préparation s'exécute après l'autre, donc la dernière gagne.
export async function reappliquerLAppareil(page: Page) {
  const etat = scenario(page);
  await page.addInitScript(installerLeFaux, { voix: etat.voix, bloque: etat.bloque, absent: etat.absent });
  await page.addInitScript(
    ([cleSon, muet]) => {
      if (muet === "oui") localStorage.setItem(cleSon, "muet");
    },
    [CLE_SON, etat.muet ? "oui" : "non"] as const,
  );
}

// --- Ouverture des écrans de test

const pagesPreparees = new WeakSet<Page>();
// Un second appareil (téléphone) ouvert pendant le scénario : c'est lui que Léa écoute alors.
const ecransDeLecture = new WeakMap<Page, Page>();

export function ecranDeLecture(page: Page): Page {
  return ecransDeLecture.get(page) ?? page;
}

export async function preparerLaPage(page: Page, etat: Scenario) {
  if (pagesPreparees.has(page)) return;
  pagesPreparees.add(page);
  await page.addInitScript(installerLeFaux, { voix: etat.voix, bloque: etat.bloque, absent: etat.absent });
  const profil = avecLesReglagesPrevus(page, { prenom: etat.prenom, niveau: "CE1", ...(etat.univers ? { univers: etat.univers } : {}) });
  await page.addInitScript(
    ([cleProfil, profilPrepare, cleSon, muet, sansProfil]) => {
      if (sansProfil === "oui") localStorage.removeItem(cleProfil);
      else localStorage.setItem(cleProfil, profilPrepare);
      if (muet === "oui") localStorage.setItem(cleSon, "muet");
    },
    [CLE_PROFIL_PREPARE, JSON.stringify(profil), CLE_SON, etat.muet ? "oui" : "non", etat.sansProfil ? "oui" : "non"] as const,
  );
  if (etat.voixImposee !== undefined) {
    await page.addInitScript(
      ([cleVoix, voixImposee, cleAmorcee]) => {
        if (sessionStorage.getItem(cleAmorcee)) return;
        sessionStorage.setItem(cleAmorcee, "oui");
        localStorage.setItem(cleVoix, voixImposee);
      },
      [CLE_VOIX, etat.voixImposee, CLE_VOIX_AMORCEE] as const,
    );
  }
}

const TITRE_DE_LA_LECON_DE_TEST = "Écoute";
const QUESTION_DE_LA_LECON_DE_TEST = "Combien font 1 + 2 ?";

/** Une leçon de test d'un exercice bulles : sa consigne est lue au début de l'exercice, puis la question est posée. */
function leconDeLaConsigne(consigne: string) {
  return leconDeTest("test-consigne", TITRE_DE_LA_LECON_DE_TEST, [{
    type: "bulles",
    titre: "Écoute",
    consigne,
    questions: [{ question: QUESTION_DE_LA_LECON_DE_TEST, choix: ["1", "2", "3"], reponse: "3" }],
  }]);
}

// Le nombre de lectures une fois la consigne lue.
const lecturesApresLaConsigne = new WeakMap<Page, number>();

export function sansVoix(page: Page): boolean {
  const { absent, muet } = scenario(page);
  return absent || muet;
}

async function ouvrirLaPageDeLaLeconDeTest(page: Page, etat: Scenario, consigne: string) {
  await preparerLaPage(page, etat);
  await injecter(page, leconDeLaConsigne(consigne));
  await interceptertLaBibliotheque(page);
  await ouvrirLaPageDeLaLecon(page, TITRE_DE_LA_LECON_DE_TEST);
}

async function commencerLaSeanceDeTest(page: Page, etat: Scenario) {
  const avant = (await journal(page)).lots;
  await commencerLaSeanceComplete(page);
  if (!etat.absent && !etat.muet) await expect.poll(async () => (await journal(page)).lots).toBeGreaterThan(avant);
  lecturesApresLaConsigne.set(page, (await journal(page)).lots);
}

/** La séance d'un exercice bulles dont la consigne est celle du scénario : Léa l'entend et la voit affichée. */
export async function ouvrir(page: Page) {
  const etat = scenario(page);
  if (etat.ouvert) return;
  etat.ouvert = true;
  await ouvrirLaPageDeLaLeconDeTest(page, etat, etat.consigne.texte);
  await commencerLaSeanceDeTest(page, etat);
}

/** L'accueil de l'enfant, là où il arrive après « Qui joue ? ». */
async function ouvrirLAccueil(page: Page) {
  const etat = scenario(page);
  if (etat.ouvert) return;
  etat.ouvert = true;
  await preparerLaPage(page, etat);
  await page.goto("/jeu");
  await expect(page.getByRole("region", { name: /^Accueil de / })).toBeVisible();
}

export async function ouvrirSurUnAutreAppareil(page: Page, contexte: BrowserContext, etat: Scenario): Promise<Page> {
  const autre = await contexte.newPage();
  await ouvrirLaPageDeLaLeconDeTest(autre, etat, etat.consigne.texte);
  await commencerLaSeanceDeTest(autre, etat);
  ecransDeLecture.set(page, autre);
  return autre;
}

// Les scénarios de voix préparent l'appareil (voix, profil, voix imposée) avant la première ouverture de la page.
export async function preparerLaPageSiScenarioDeVoix(page: Page) {
  const etat = scenarios.get(page);
  if (etat) await preparerLaPage(page, etat);
}

// Le parent est connecté sans e-mail (connexion de préparation de #5), puis répond à la question du contrôle parental
// lue à l'écran (#10), comme un adulte.
export async function entrerDansLEspaceParent(page: Page, etat: Scenario, famille: Famille) {
  await preparerLaPage(page, etat);
  if ((await famille.session(page)) === null) await famille.connecterSansEmail("tablette", "Paul");
  await page.goto("/");
  await page.getByRole("banner").getByRole("button", { name: "Espace parent", exact: true }).click();
  const question = page.getByText(/Question pour un adulte/);
  const choix = page.getByTestId("choix-de-voix");
  await expect(question.or(choix)).toBeVisible();
  if (await question.isVisible()) {
    const facteurs = /(\d+)\s*×\s*(\d+)/.exec((await question.textContent()) ?? "");
    if (!facteurs) throw new Error("Question du contrôle parental inattendue");
    await page.getByRole("textbox", { name: /Question pour un adulte/ }).fill(String(Number(facteurs[1]) * Number(facteurs[2])));
    await page.getByRole("button", { name: "Entrer" }).click();
  }
  await expect(choix).toBeVisible();
}

After(async ({ page }) => {
  await ecransDeLecture.get(page)?.context().close();
});

function boutonSon(page: Page) {
  return page.getByRole("button", { name: "Son" });
}

export function normaliser(texte: string): string {
  return texte.replace(/\s+/g, " ").trim();
}

function messageDeVoixBloquee(page: Page) {
  return page.getByRole("status").filter({ hasText: "est bloquée par ce navigateur" });
}

// --- Étant donné : appareil

Given(/^l'appareil a une voix française féminine et une voix française masculine$/, async ({ page }) => {
  scenario(page).voix = [DENISE, HENRI];
});

Given(
  /^l'appareil a les voix françaises « ([^«»]+) » et « ([^«»]+) »$/,
  async ({ page }, premiere: string, seconde: string) => {
    scenario(page).voix = [{ nom: premiere, langue: "fr-FR" }, { nom: seconde, langue: "fr-FR" }];
  },
);

Given(/^l'appareil n'a qu'une voix française féminine$/, async ({ page }) => {
  scenario(page).voix = [DENISE];
});

Given(/^l'appareil a une voix française et une voix anglaise$/, async ({ page }) => {
  scenario(page).voix = [DENISE, SAMANTHA];
});

Given(/^Léa a choisi l'univers (animaux|princesse|sports|pompier|police|danse)$/, async ({ page, monde, famille, $tags }, univers: string) => {
  scenario(page).univers = univers;
  // Story #32 : le profil réel de Léa est déjà créé ; son univers change sur le serveur, puis Léa se choisit de nouveau.
  if (($tags.includes("@issue-32") || $tags.includes("@issue-33")) && estSurUnProfilReel(page)) {
    await modifierLeProfil(famille, "Léa", { univers });
    // « Qui joue ? » montre d'abord la copie gardée de l'ancien univers : on attend qu'il ait relu la liste sur le serveur.
    const listeRelue = page.waitForResponse((reponse) => reponse.url().includes("/rest/v1/profils_enfants"));
    await page.goto("/");
    await listeRelue;
    await choisirSonProfil(page, "Léa");
    await expect(page.getByTestId("paysage")).toHaveAttribute("data-univers", univers);
    return;
  }
  const profil = { prenom: "Léa", niveau: "CE1", univers };
  monde.profils.set("Léa", profil);
  await page.addInitScript(
    ([cle, valeur]) => localStorage.setItem(cle, valeur),
    [CLE_PROFIL_PREPARE, JSON.stringify(profil)] as const,
  );
});

Given(/^Léa n'a pas encore choisi d'univers$/, async ({ page }) => {
  scenario(page).univers = undefined;
});

Given(/^Savanturier n'a jamais été ouvert sur la tablette$/, async ({ page }) => {
  scenario(page).muet = false;
});

// Quand la page est déjà préparée (profil préparé du Contexte, #79), l'état de l'appareil choisi ensuite est réappliqué.
async function reappliquerSiLaPageEstPreparee(page: Page) {
  if (pagesPreparees.has(page)) await reappliquerLAppareil(page);
}

Given(/^la tablette est en Muet$/, async ({ page }) => {
  scenario(page).muet = true;
  await reappliquerSiLaPageEstPreparee(page);
});

Given(/^le navigateur bloque la voix$/, async ({ page }) => {
  scenario(page).bloque = true;
  await reappliquerSiLaPageEstPreparee(page);
});

Given(/^le navigateur ne sait pas lire à voix haute$/, async ({ page }) => {
  scenario(page).absent = true;
  await reappliquerSiLaPageEstPreparee(page);
});

Given(/^le navigateur ne bloque plus la voix$/, async ({ page }) => {
  await page.evaluate(() => {
    const faux = Reflect.get(window, "__faux") as { bloque: boolean };
    faux.bloque = false;
  });
});

Given(/^Noisette est en train de lire la consigne « (.+) »$/, async ({ page }, texte: string) => {
  scenario(page).consigne.texte = texte;
  scenario(page).reecouteLaConsigneDOuverture = true;
  await ouvrir(page);
  await attendreUneLecture(page);
  expect((await journal(page)).actifs).toBeGreaterThan(0);
});

Given(/^Léa a passé la tablette en Muet$/, async ({ page }) => {
  await ouvrirLAccueil(page);
  await boutonSon(page).click();
  await expect(boutonSon(page)).toHaveAttribute("data-son", "muet");
});

// La page de la leçon est la première à parler : c'est là que la voix bloquée est signalée, une seule fois.
Given(/^Léa a déjà vu le message de voix bloquée$/, async ({ page }) => {
  const etat = scenario(page);
  etat.ouvert = true;
  await ouvrirLaPageDeLaLeconDeTest(page, etat, etat.consigne.texte);
  await expect(messageDeVoixBloquee(page)).toHaveCount(1);
});

Given(/^la voix a été bloquée pendant la lecture de la question « (.+) »$/, async ({ page }, question: string) => {
  scenario(page).bloque = true;
  await reappliquerLAppareil(page);
  await allerALaQuestion(page, question, false);
  await expect(messageDeVoixBloquee(page)).toHaveCount(1);
});

// --- Quand

When(/^la consigne « (.+) » s'affiche$/, async ({ page }, texte: string) => {
  scenario(page).consigne.texte = texte;
  await ouvrir(page);
});

When(/^la consigne suivante s'affiche$/, async ({ page }) => {
  const etat = scenario(page);
  const avant = (await journal(page)).speaks;
  await commencerLaSeanceDeTest(page, etat);
  await expect.poll(async () => (await journal(page)).speaks).toBeGreaterThan(avant);
  await laisserPasserLeDelaiDeLecture(page);
});

When(/^Léa demande à réécouter la consigne$/, async ({ page }) => {
  await demarrer(page);
  const etat = scenario(page);
  const relire = page.getByRole("button", { name: "Relire la consigne", exact: true });
  if (etat.relitPendantLaQuestion) {
    await attendreUneLecture(page);
    await terminerLaLecture(page);
    // Le StrictMode du mode développement peut lire la consigne en deux lots : on attend la lecture de la question.
    await expect.poll(async () => (await journal(page)).lecture.texte).toContain("Combien font");
    // 79.12 : pendant la présentation de l'exercice, relire la consigne est inactif.
    await expect(relire).toHaveAttribute("aria-disabled", "true");
    // La présentation finie (les choix apparaissent), il devient actif.
    await avancerJusquAuxChoix(page);
    await expect(relire).not.toHaveAttribute("aria-disabled", "true");
    etat.relitPendantLaQuestion.relue = true;
    etat.relitPendantLaQuestion.lotsAvant = (await journal(page)).lots;
  }
  // #7 : la consigne d'ouverture est réécoutée pendant sa lecture, avec « Réécouter » (« Relire la consigne » y est inactif).
  const bouton = etat.reecouteLaConsigneDOuverture
    ? page.getByRole("button", { name: "Réécouter", exact: true })
    : relire;
  await bouton.click();
});

When(/^Léa quitte l'écran de la consigne$/, async ({ page }) => {
  await page.getByRole("banner").getByRole("button", { name: "Savanturier" }).click();
  await expect(page).toHaveURL(/\/$/);
});

When(/^Léa passe en Muet$/, async ({ page }) => {
  await boutonSon(page).click();
  await expect(boutonSon(page)).toHaveAttribute("data-son", "muet");
});

When(/^Léa remet le son$/, async ({ page }) => {
  await ouvrirLAccueil(page);
  await expect(boutonSon(page)).toHaveAttribute("data-son", "muet");
  await boutonSon(page).click();
  await expect(boutonSon(page)).toHaveAttribute("data-son", "son");
});

// Une page déjà ouverte (l'accueil, la séance, la version publiée) est rechargée. Sans page ouverte, Léa lance d'abord
// Savanturier sur la séance du scénario. Dans les deux cas, on attend l'application, jamais une consigne.
When(/^Léa relance Savanturier$/, async ({ page }) => {
  if (page.url() === "about:blank") await ouvrir(page);
  await page.reload();
  await expect(page.getByRole("banner")).toBeVisible();
});

// --- Alors : ce que Léa entend

Then(
  /^Léa entend (?:Noisette|Lumi|Coach Léo|Capitaine Sam) (?:lire|dire) « ([^«»]+) »$/,
  async ({ page }, texte: string) => {
    await expect.poll(async () => await texteLuAvantLaLectureDesChoix(page)).toBe(normaliser(texte));
  },
);

/** Les textes lus, un par lecture. */
async function textesLus(page: Page): Promise<string[]> {
  return await page.evaluate(() => {
    const faux = Reflect.get(window, "__faux") as { journal: Array<{ type: string; lot: number; texte: string }> };
    const parLot = new Map<number, string[]>();
    for (const e of faux.journal) if (e.type === "speak") parLot.set(e.lot, [...(parLot.get(e.lot) ?? []), e.texte]);
    return [...parLot.values()].map((textes) => textes.join(" ").replace(/\s+/g, " ").trim());
  });
}

// Avec « tout lire à voix haute », les choix sont lus juste après la question : la question est alors la lecture d'avant.
async function texteLuAvantLaLectureDesChoix(page: Page): Promise<string> {
  const textes = await textesLus(page);
  const derniere = textes[textes.length - 1] ?? "";
  return /^Est-ce /.test(derniere) ? (textes[textes.length - 2] ?? derniere) : derniere;
}

Then(/^Léa entend de nouveau Noisette lire « ([^«»]+) »$/, async ({ page }, texte: string) => {
  const lotsAvant = scenario(page).relitPendantLaQuestion?.lotsAvant;
  await expect.poll(async () => (await journal(page)).lots).toBe(lotsAvant === undefined ? 2 : lotsAvant + 1);
  expect((await journal(page)).lecture.texte).toBe(normaliser(texte));
});

Then(
  /^Léa entend Noisette lire « (.+) », puis un court silence, puis « (.+) »$/,
  async ({ page }, avant: string, apres: string) => {
    await expect.poll(async () => (await journal(page)).lecture.texte).toContain(avant);
    const { texte } = (await journal(page)).lecture;
    const motif = new RegExp(`^${avant}\\s*\\.\\.\\.\\s*${apres.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}$`);
    expect(texte).toMatch(motif);
  },
);

Then(/^Léa n'entend jamais lire les soulignés$/, async ({ page }) => {
  const { lecture } = await journal(page);
  expect(lecture.texte).not.toContain("_");
});

Then(/^Léa n'entend rien$/, async ({ page }) => {
  await laisserPasserLeDelaiDeLecture(page);
  if (sansVoix(page)) {
    expect((await journal(page)).speaks).toBe(0);
    return;
  }
  // Avec la voix, la page a déjà salué Léa dans une première lecture : rien d'autre n'est dit, et surtout pas les soulignés.
  const lectures = await textesLus(page);
  expect(lectures.length).toBeLessThanOrEqual(1);
  expect(lectures.join(" ")).not.toContain("_");
});

Then(/^Léa n'entend plus Noisette$/, async ({ page }) => {
  await expect.poll(async () => {
    const { actifs, coupeApresLaDerniereParole } = await journal(page);
    return actifs === 0 && coupeApresLaDerniereParole;
  }).toBe(true);
});

Then(/^la lecture reprend depuis le début de la consigne$/, async ({ page }) => {
  await expect.poll(async () => (await journal(page)).lots).toBe((lecturesApresLaConsigne.get(page) ?? 1) + 1);
  const { lecture } = await journal(page);
  expect(lecture.texte).toBe(normaliser(scenario(page).consigne.texte));
  // La reprise va jusqu'au bout : la consigne relue terminée, l'exercice s'ouvre sur sa question et ses choix.
  await terminerLaLecture(page);
  await expect(bulle(page)).toContainText(QUESTION_DE_LA_LECON_DE_TEST);
  await avancerJusquAuxChoix(page);
  for (const choix of ["1", "2", "3"]) await expect(bulleDeChoix(page, choix)).toBeVisible();
});

Then(/^Léa n'entend jamais deux lectures en même temps$/, async ({ page }) => {
  const { chevauchements, lots } = await journal(page);
  expect(lots).toBeGreaterThanOrEqual(2);
  expect(chevauchements).toBe(0);
});

// --- Alors : voix et caractère

const VOIX_ATTENDUE: Readonly<Record<string, string>> = { "féminine": DENISE.nom, "masculine": HENRI.nom };

Then(
  /^Léa entend (?:Noisette|Lumi|Coach Léo|Agent Max|Capitaine Sam|Lili) lire la consigne avec une voix (féminine|masculine)$/,
  async ({ page }, sexe: string) => {
    await attendreUneLecture(page);
    const { lecture } = await journal(page);
    expect(lecture.texte).toBe(normaliser(scenario(page).consigne.texte));
    for (const enonce of lecture.enonces) expect(enonce.voix).toBe(VOIX_ATTENDUE[sexe]);
  },
);

Then(
  /^(Léa|Tom) entend (?:Noisette|Lumi|Coach Léo|Capitaine Sam) lire la consigne avec la voix « ([^«»]+) »(, en plus grave)?$/,
  async ({ page }, _enfant: string, nom: string, plusGrave: string | undefined) => {
    const ecran = ecranDeLecture(page);
    await attendreUneLecture(ecran);
    const { lecture } = await journal(ecran);
    expect(lecture.enonces.length).toBeGreaterThan(0);
    for (const enonce of lecture.enonces) {
      expect(enonce.voix).toBe(nom);
      if (plusGrave) expect(enonce.pitch).toBeLessThan(HAUTEUR_DE_CAPITAINE_SAM);
    }
  },
);

Then(/^Léa entend Capitaine Sam lire la consigne avec cette voix, en plus grave$/, async ({ page }) => {
  await attendreUneLecture(page);
  const { lecture } = await journal(page);
  for (const enonce of lecture.enonces) {
    expect(enonce.voix).toBe(DENISE.nom);
    expect(enonce.pitch).toBeLessThan(HAUTEUR_DE_CAPITAINE_SAM);
    expect(Math.abs(enonce.pitch - HAUTEUR_ATTENDUE_SANS_VOIX_MASCULINE)).toBeLessThanOrEqual(TOLERANCE_DE_HAUTEUR);
  }
});

Then(/^Léa entend Noisette lire la consigne$/, async ({ page }) => {
  await attendreUneLecture(page);
  const { lecture } = await journal(page);
  expect(lecture.texte).toBe(normaliser(scenario(page).consigne.texte));
  for (const enonce of lecture.enonces) expect(enonce.voix).toBe(DENISE.nom);
});

// --- Alors : affichage

/** La consigne affichée, à sa place à elle au-dessus de l'exercice (#79), en dehors de la bulle du personnage guide. */
export function consigneAffichee(page: Page) {
  return page.getByTestId("consigne");
}

Then(/^Léa voit la consigne « (.+) »$/, async ({ page }, texte: string) => {
  await expect(consigneAffichee(page)).toHaveText(normaliser(texte));
});

Then(/^Léa voit la question « (?!.*», avec les choix)(.+) »$/, async ({ page }, question: string) => {
  await expect(page.getByTestId("question")).toHaveText(normaliser(question));
  if (scenario(page).relitPendantLaQuestion?.relue) {
    // La question reste posée : on termine les lectures en cours, et les choix doivent venir.
    await avancerJusquAuxChoix(page);
    await expect(page.getByTestId("question")).toHaveText(normaliser(question));
    expect([...(await textesDesChoix(page))].sort()).toEqual(["1", "2", "3"]);
  }
});

Then(/^Léa voit le message « (.+) »$/, async ({ page }, message: string) => {
  const statut = page.getByRole("status").filter({ hasText: message });
  const messageDeLEcoute = page.getByTestId("ecoute-sans-son").filter({ hasText: message });
  await expect(statut.or(messageDeLEcoute)).toHaveCount(1);
});

Then(/^Léa voit un seul message de voix bloquée$/, async ({ page }) => {
  await expect(messageDeVoixBloquee(page)).toHaveCount(1);
  await expect(page.getByText("est bloquée par ce navigateur")).toHaveCount(1);
});

// Le faux navigateur ne termine une lecture que sur demande : la lecture réussie de la voix revenue se termine ici.
Then(/^Léa ne voit plus le message de voix bloquée$/, async ({ page }) => {
  await expect.poll(async () => {
    await terminerLaLecture(page);
    return await messageDeVoixBloquee(page).count();
  }, { intervals: [100] }).toBe(0);
});

Then(/^le message de voix bloquée n'apparaît pas de nouveau$/, async ({ page }) => {
  await expect(messageDeVoixBloquee(page)).toHaveCount(0);
});

// --- Alors : surlignage

Then(/^chaque mot de la consigne est surligné au moment où Noisette le prononce$/, async ({ page }) => {
  await attendreUneLecture(page);
  const mots = await consigneAffichee(page).locator("[data-mot]").allTextContents();
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
    const surligne = consigneAffichee(page).locator("[data-prononce='true']");
    await expect(surligne).toHaveCount(1);
    await expect(surligne).toHaveText(mot);
    await expect(surligne).toHaveAttribute("data-mot", String(rang));
  }
});

Then(/^plus aucun mot n'est surligné quand la lecture est finie$/, async ({ page }) => {
  await terminerLaLecture(page);
  await expect(consigneAffichee(page).locator("[data-prononce='true']")).toHaveCount(0);
});

// --- Alors : Son / Muet

Then(/^le son est activé$/, async ({ page }) => {
  await expect(boutonSon(page)).toHaveAttribute("aria-pressed", "true");
  await expect(boutonSon(page)).toHaveAttribute("data-son", "son");
});

Then(/^la tablette est toujours en Muet$/, async ({ page }) => {
  await expect(boutonSon(page)).toHaveAttribute("aria-pressed", "false");
  await expect(boutonSon(page)).toHaveAttribute("data-son", "muet");
  expect(await page.evaluate((cle) => localStorage.getItem(cle), CLE_SON)).toBe("muet");
});
