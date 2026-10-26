import { avecLesReglagesPrevus } from "../support/reglages-prevus.ts";
import { servirLaBibliothequeDeLAccueil, utiliseLaBibliothequeDeLAccueil } from "../support/bibliotheque-de-l-accueil.ts";
import { servirLaBibliothequeDesClassesDAvant } from "../support/bibliotheque-des-classes-d-avant.ts";
import { servirLaBibliothequeDuParcours } from "../support/bibliotheque-du-parcours.ts";
import { servirLaBibliothequeDuTestDeDepart } from "../support/bibliotheque-du-test-de-depart.ts";
import { readFileSync } from "node:fs";
import { expect, type Locator, type Page } from "@playwright/test";
import { Given, type ProfilPrepare, Then, When } from "./fixtures.ts";
import { assurerLeProfil } from "./profils-enfants.steps.ts";
import { cleDe } from "./univers.steps.ts";
import { estSurUnProfilReel, jouerAvecLeProfilReel, ouvrirLaLeconDansLApplication, rechargerAvecLeProfilReel } from "./profil-reel.ts";
import {
  attendreUneLecture,
  journal,
  laisserPasserLeDelaiDeLecture,
  normaliser,
  preparerLaPage,
  scenario,
  terminerLaLecture,
} from "./voix.steps.ts";

// Story #16 : page de la leçon et séance (étapes de leçon lues, puis exercices).
// Les leçons de la bibliothèque viennent de `app/bibliotheque.json`. Les leçons de test des scénarios sont ajoutées
// à la réponse de `/bibliotheque.json` par le navigateur du test (interception réseau) : la vraie bibliothèque reste intacte.

const CLE_PROFIL_PREPARE = "savanturier:profil-prepare";

type EtapeBrute = { texte: string; exemples: string[] };
export type LeconBrute = {
  id: string;
  titre: string;
  matiere: string;
  niveau: string;
  ordre: number;
  programme: { section: string; citation: string };
  lecon: EtapeBrute[];
  exercices: Array<Record<string, unknown>>;
  guide?: { titre: string; page: number; extrait: string };
};

type EtatDeLaLecon = {
  injectees: LeconBrute[];
  courante: LeconBrute | undefined;
};

export const BIBLIOTHEQUE: LeconBrute[] = JSON.parse(readFileSync("app/bibliotheque.json", "utf-8"));
const etats = new WeakMap<Page, EtatDeLaLecon>();

export function etat(page: Page): EtatDeLaLecon {
  let courant = etats.get(page);
  if (!courant) {
    courant = { injectees: [], courante: undefined };
    etats.set(page, courant);
  }
  return courant;
}

export function leconDeTitre(page: Page, titre: string): LeconBrute {
  const lecon = [...etat(page).injectees, ...BIBLIOTHEQUE].find((candidate) => candidate.titre === titre);
  if (!lecon) throw new Error(`Leçon inconnue : ${titre}`);
  return lecon;
}

export function leconCourante(page: Page): LeconBrute {
  const lecon = etat(page).courante;
  if (!lecon) throw new Error("Aucune leçon ouverte");
  return lecon;
}

const SECTION_DE_TEST = "c2-mathematiques-cp-les-quatre-operations";
const CITATION_DE_TEST = "Les quatre opérations sont mobilisées au CP lors de la résolution de problèmes qui fournit un cadre permettant de donner du sens aux opérations.";

export function leconDeTest(id: string, titre: string, exercices: Array<Record<string, unknown>>): LeconBrute {
  return {
    id,
    titre,
    matiere: "maths",
    niveau: "CP",
    ordre: 900,
    programme: { section: SECTION_DE_TEST, citation: CITATION_DE_TEST },
    lecon: [],
    exercices,
  };
}

function bullesDeTest(titre: string | undefined, questions: string[]): Record<string, unknown> {
  return {
    type: "bulles",
    ...(titre === undefined ? {} : { titre }),
    questions: questions.map((question) => ({ question, choix: ["1", "2", "3"], reponse: "3" })),
  };
}

export async function injecter(page: Page, lecon: LeconBrute) {
  etat(page).injectees.push(lecon);
  if (estSurUnProfilReel(page)) await rechargerAvecLeProfilReel(page);
}

// Story #31 : une leçon personnelle n'est jamais dans la bibliothèque (elle vient du serveur, pour son profil seulement).
const sansLeconsPersonnellesDansLaBibliotheque = new WeakSet<Page>();

export function neServirQueLaBibliothequeSansLeconsPersonnelles(page: Page): void {
  sansLeconsPersonnellesDansLaBibliotheque.add(page);
}

export async function interceptertLaBibliotheque(page: Page) {
  await page.route("**/bibliotheque.json", async (route) => {
    const reponse = await route.fetch();
    const bibliotheque: unknown[] = await reponse.json();
    const injectees = sansLeconsPersonnellesDansLaBibliotheque.has(page)
      ? etat(page).injectees.filter((lecon) => !lecon.id.startsWith("perso-"))
      : etat(page).injectees;
    await route.fulfill({ response: reponse, json: [...bibliotheque, ...injectees] });
  });
}

// --- Navigation

export function bulle(page: Page) {
  return page.getByTestId("parole");
}

export function recipient(page: Page) {
  return page.getByTestId("recipient");
}

export async function ouvrirLaPageDeLaLecon(page: Page, titre: string) {
  const lecon = leconDeTitre(page, titre);
  etat(page).courante = lecon;
  if (estSurUnProfilReel(page)) await ouvrirLaLeconDansLApplication(page, lecon.id);
  else await page.goto(`/lecon/${encodeURIComponent(lecon.id)}`);
  await expect(page.getByRole("heading", { level: 2, name: titre })).toBeVisible();
}

/**
 * La séance est ouverte par son adresse, sans passer par la page de la leçon. La voix bloquée n'est signalée qu'une seule
 * fois : la page de la leçon, qui parle la première, la signalerait avant la question.
 */
export async function ouvrirLaSeanceDirectement(page: Page, titre: string, position?: number) {
  const lecon = leconDeTitre(page, titre);
  etat(page).courante = lecon;
  await page.goto(`/lecon/${encodeURIComponent(lecon.id)}/seance${position === undefined ? "" : `/${position}`}`);
  await expect(recipient(page)).toBeVisible();
}

export async function commencerLaSeanceComplete(page: Page) {
  await page.getByRole("button", { name: "Leçon et tous les jeux", exact: true }).click();
  await expect(recipient(page)).toBeVisible();
}

export async function commencerSeulementLExercice(page: Page, titre: string) {
  await page.getByTestId("exercice-propose").filter({ hasText: titre }).click();
  await expect(recipient(page)).toBeVisible();
}

async function jouerLaSeanceComplete(page: Page, titre: string) {
  await ouvrirLaPageDeLaLecon(page, titre);
  await commencerLaSeanceComplete(page);
}

// La voix ne prononce pas les guillemets : l'enfant entend le texte sans eux.
export function entendu(texte: string): string {
  return normaliser(texte.replace(/«\s*/g, "").replace(/\s*»/g, ""));
}

function texteDeLEtape(lecon: LeconBrute, rang: number): string {
  const etape = lecon.lecon[rang];
  if (!etape) throw new Error(`La leçon « ${lecon.titre} » n'a pas d'étape de leçon n°${rang + 1}`);
  return etape.texte;
}

function texteLuDeLEtape(lecon: LeconBrute, rang: number): string {
  const etape = lecon.lecon[rang];
  if (!etape) throw new Error(`La leçon « ${lecon.titre} » n'a pas d'étape de leçon n°${rang + 1}`);
  return entendu(etape.exemples.length === 0 ? etape.texte : `${etape.texte} ${etape.exemples.join(". ")}`);
}

async function attendreQueLaBulleDise(page: Page, texte: string) {
  await expect(bulle(page)).toHaveText(normaliser(texte));
}

async function continuer(page: Page) {
  await page.getByRole("button", { name: "Continuer", exact: true }).click();
}

async function lireLEtapeJusqueAuBout(page: Page, lecon: LeconBrute, rang: number) {
  await attendreQueLaBulleDise(page, texteDeLEtape(lecon, rang));
  await expect.poll(async () => (await journal(page)).lecture.texte).toBe(texteLuDeLEtape(lecon, rang));
  await terminerLaLecture(page);
}

async function continuerApresLesEtapes(page: Page, lecon: LeconBrute, nombre: number) {
  for (let rang = 0; rang < nombre; rang++) {
    await lireLEtapeJusqueAuBout(page, lecon, rang);
    await continuer(page);
  }
}

export async function toutesLesParoles(page: Page): Promise<string[]> {
  return await page.evaluate(() => {
    const faux = Reflect.get(window, "__faux") as { journal: Array<{ type: string; texte: string }> };
    return faux.journal.filter((entree) => entree.type === "speak").map((entree) => entree.texte);
  });
}

// --- Étant donné

Given(/^Léa a un profil enfant préparé de niveau (\S+) dans l'univers « (.+) »$/, async ({ page, monde, famille, $tags, $testInfo }, niveau: string, univers: string) => {
  const cle = cleDe(univers);
  const profil: ProfilPrepare = { prenom: "Léa", niveau, univers: cle };
  monde.profils.set("Léa", profil);
  // Story #34 : le suivi lit sous RLS les faits du vrai profil de Léa, créé pour Paul ; Léa ne joue pas.
  if ($tags.includes("@issue-34")) {
    await assurerLeProfil(famille, "Paul", { prenom: "Léa", niveau, libelleUnivers: univers });
    return;
  }
  const parametres = scenario(page);
  parametres.univers = cle;
  await preparerLaPage(page, parametres);
  await page.addInitScript(
    ([cleDuProfil, valeur]) => localStorage.setItem(cleDuProfil, valeur),
    [CLE_PROFIL_PREPARE, JSON.stringify(avecLesReglagesPrevus(page, profil))] as const,
  );
  await interceptertLaBibliotheque(page);
  if ($tags.includes("@issue-31")) neServirQueLaBibliothequeSansLeconsPersonnelles(page);
  // Story #24 : les séances terminées s'enregistrent pour un vrai profil ; Léa joue donc avec le même profil, créé pour Paul.
  // Story #25 : le parcours lit la progression du vrai profil, et la bibliothèque de test remplace celle de l'application.
  if ($tags.includes("@issue-25")) await servirLaBibliothequeDuParcours(page);
  // Story #27 : la bibliothèque de test du test de départ est servie de nouveau, après l'interception ci-dessus qui l'aurait masquée.
  if ($tags.includes("@issue-27")) await servirLaBibliothequeDuTestDeDepart(page);
  // Story #32 : la cabane lit les étoiles du serveur ; seul le scénario du profil préparé garde le profil sans identifiant.
  // Story #31 : les badges lisent les étoiles du serveur, comme la cabane (décision 0021, point 5).
  const cabaneSurLeServeur = ($tags.includes("@issue-32") || $tags.includes("@issue-31")) && !$testInfo.title.includes("sans profil réel au serveur");
  // Story #26 : la bibliothèque de test des leçons des classes d'avant est servie avant l'accueil, qui la charge dès son ouverture.
  if ($tags.includes("@issue-26")) await servirLaBibliothequeDesClassesDAvant(page);
  // Story #29 : la bibliothèque de test de l'accueil est servie de la même façon.
  // Les scénarios de #24, #25 et #26 réécrits par #29 gardent la bibliothèque de leur story.
  const accueilSeul = utiliseLaBibliothequeDeLAccueil($tags);
  if (accueilSeul) await servirLaBibliothequeDeLAccueil(page);
  // Story #30 : les jours de séance sont lus sous RLS pour le vrai profil de Léa.
  if ($tags.includes("@issue-24") || accueilSeul || $tags.includes("@issue-25") || $tags.includes("@issue-26") || $tags.includes("@issue-27") || $tags.includes("@issue-30") || cabaneSurLeServeur) {
    await jouerAvecLeProfilReel(famille, monde, page);
  }
});

Given(/^une leçon de test « (.+) » a un exercice calcul sans titre$/, async ({ page }, titre: string) => {
  await injecter(page, leconDeTest("test-calcul-sans-titre", titre, [{ type: "calcul" }]));
});

Given(
  /^une leçon de test « (.+) » n'a aucune étape de leçon et un exercice bulles qui pose « (.+) »$/,
  async ({ page }, titre: string, question: string) => {
    await injecter(page, leconDeTest("test-sans-etape", titre, [bullesDeTest("Compter", [question])]));
  },
);

Given(
  /^une leçon de test « (.+) » a un exercice bulles de (\d+) questions et un exercice d'un type inconnu « (.+) »$/,
  async ({ page }, titre: string, nombre: string, typeInconnu: string) => {
    const questions = Array.from({ length: Number(nombre) }, (_, rang) => `Combien font ${rang} + 1 ?`);
    await injecter(page, leconDeTest("test-type-inconnu", titre, [bullesDeTest("Additions", questions), { type: typeInconnu, titre: "Casse-tête" }]));
  },
);

Given(/^Léa est sur la page de la leçon « (.+) »$/, async ({ page }, titre: string) => {
  await ouvrirLaPageDeLaLecon(page, titre);
});

Given(/^Léa joue la séance complète de la leçon « (.+) »$/, async ({ page }, titre: string) => {
  await jouerLaSeanceComplete(page, titre);
});

Given(/^Noisette est en train de lire la première étape de leçon$/, async ({ page }) => {
  await attendreUneLecture(page);
  await expect.poll(async () => (await journal(page)).actifs).toBeGreaterThan(0);
});

Given(/^Noisette a lu la première étape de leçon$/, async ({ page }) => {
  await lireLEtapeJusqueAuBout(page, leconCourante(page), 0);
});

Given(/^Noisette a lu la dernière étape de leçon$/, async ({ page }) => {
  const lecon = leconCourante(page);
  await continuerApresLesEtapes(page, lecon, lecon.lecon.length - 1);
  await lireLEtapeJusqueAuBout(page, lecon, lecon.lecon.length - 1);
});

Given(/^Léa a continué après les deux premières étapes de leçon$/, async ({ page }) => {
  await continuerApresLesEtapes(page, leconCourante(page), 2);
});

// --- Quand

When(/^Léa ouvre la page de la leçon « (.+) »$/, async ({ page }, titre: string) => {
  await ouvrirLaPageDeLaLecon(page, titre);
});

When(/^Léa commence (?:la séance complète|seulement l'exercice « (.+) »)$/, async ({ page }, exercice: string | undefined) => {
  if (!exercice) await commencerLaSeanceComplete(page);
  else await commencerSeulementLExercice(page, exercice);
});

When(/^Léa choisit seulement l'exercice « (.+) »$/, async ({ page }, titre: string) => {
  await commencerSeulementLExercice(page, titre);
});

When(/^Léa continue$/, async ({ page }) => {
  await continuer(page);
});

// Quand Léa vient de commencer la séance (première étape à l'écran), elle continue jusqu'à la troisième étape.
When(/^la troisième étape de leçon s'affiche$/, async ({ page }) => {
  const lecon = leconCourante(page);
  const surLaPremiere = normaliser((await bulle(page).textContent()) ?? "") === normaliser(texteDeLEtape(lecon, 0));
  if (surLaPremiere) await continuerApresLesEtapes(page, lecon, 2);
  await attendreQueLaBulleDise(page, texteDeLEtape(lecon, 2));
});

When(/^Léa demande à réécouter$/, async ({ page }) => {
  await page.getByRole("button", { name: "Réécouter", exact: true }).click();
});

When(/^Léa quitte la séance$/, async ({ page }) => {
  await page.getByRole("button", { name: "Retour", exact: true }).click();
});

When(/^Léa commence de nouveau la séance complète$/, async ({ page }) => {
  await commencerLaSeanceComplete(page);
});

async function atteindreAuClavier(page: Page, nom: string): Promise<Locator> {
  const cible = page.getByRole("button", { name: nom, exact: true }).and(page.locator(":focus"));
  for (let essai = 0; essai < 40; essai++) {
    if ((await cible.count()) > 0) return cible;
    await page.keyboard.press("Tab");
  }
  throw new Error(`Le bouton « ${nom} » n'est pas atteint au clavier`);
}

When(/^Léa commence la séance complète et continue jusqu'au premier exercice, au clavier seulement$/, async ({ page }) => {
  await atteindreAuClavier(page, "Leçon et tous les jeux");
  await page.keyboard.press("Enter");
  await expect(recipient(page)).toBeVisible();
  for (let etape = 0; etape < leconCourante(page).lecon.length; etape++) {
    await atteindreAuClavier(page, "Continuer");
    await attendreQueLaBulleDise(page, texteDeLEtape(leconCourante(page), etape));
    await page.keyboard.press("Enter");
  }
});

// --- Alors : page de la leçon

Then(/^elle voit le titre « (.+) » et « (.+) »$/, async ({ page }, titre: string, niveauEtMatiere: string) => {
  await expect(page.getByRole("heading", { level: 2, name: titre })).toBeVisible();
  await expect(page.getByTestId("niveau-et-matiere")).toHaveText(niveauEtMatiere);
});

Then(/^la séance complète lui est proposée par « (.+) »$/, async ({ page }, libelle: string) => {
  await expect(page.getByRole("button", { name: libelle, exact: true })).toBeVisible();
});

Then(
  /^sous « (.+) », elle voit les exercices « (.+) » et « (.+) »$/,
  async ({ page }, invitation: string, premier: string, second: string) => {
    await expect(page.getByText(invitation, { exact: true })).toBeVisible();
    const exercices = page.getByTestId("exercice-propose");
    await expect(exercices).toHaveCount(2);
    await expect(exercices.nth(0)).toContainText(premier);
    await expect(exercices.nth(1)).toContainText(second);
  },
);

Then(/^l'exercice « (.+) » est proposé avec le libellé « (.+) »$/, async ({ page }, titre: string, libelle: string) => {
  const exercice = page.getByTestId("exercice-propose").filter({ hasText: titre });
  await expect(exercice).toHaveCount(1);
  await expect(exercice.locator(".libelle-du-type")).toHaveText(libelle);
  await expect(exercice.locator(".intitule")).toHaveText(titre);
});

Then(/^un exercice est proposé sous le libellé « (.+) »$/, async ({ page }, libelle: string) => {
  const exercices = page.getByTestId("exercice-propose");
  await expect(exercices).toHaveCount(1);
  await expect(exercices.locator(".libelle-du-type")).toHaveText(libelle);
  await expect(exercices.locator(".intitule")).toHaveCount(0);
});

Then(/^Noisette dit « (?!C'est parti)([^«»]+) »$/, async ({ page }, texte: string) => {
  await attendreQueLaBulleDise(page, texte);
});

Then(/^Noisette dit l'une des phrases « (.+) », « (.+) » ou « (.+) »$/, async ({ page }, a: string, b: string, c: string) => {
  const attendues = [a, b, c].map(normaliser);
  await expect.poll(async () => normaliser((await bulle(page).textContent()) ?? "")).toEqual(expect.stringMatching(new RegExp(`^(${attendues.map(echapper).join("|")})$`)));
  await expect(bulle(page)).toHaveAttribute("data-nature", "invitation");
});

function echapper(texte: string): string {
  return texte.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

async function ouvrirLePassagePourLesAdultes(page: Page) {
  const passage = page.getByTestId("pour-les-adultes");
  if ((await passage.getAttribute("open")) === null) await passage.locator("summary").click();
  await expect(passage).toHaveAttribute("open", "");
  return passage;
}

Then(
  /^le passage « (.+) » donne la citation du programme officiel et la source de sa section$/,
  async ({ page }, titreDuPassage: string) => {
    const passage = await ouvrirLePassagePourLesAdultes(page);
    await expect(passage.locator("summary")).toHaveText(titreDuPassage);
    await expect(page.getByTestId("citation-du-programme")).toHaveText(leconCourante(page).programme.citation);
    await expect(page.getByTestId("source-du-programme")).not.toBeEmpty();
  },
);

Then(/^il donne « (.+) » avec le passage cité$/, async ({ page }, titre: string) => {
  const passageDuGuide = page.getByTestId("guide-fondamental");
  const guideDeLaLecon = leconCourante(page).guide;
  if (!guideDeLaLecon) throw new Error("La leçon n'a pas de guide fondamental");
  await expect(passageDuGuide.getByRole("heading", { name: titre, exact: true })).toBeVisible();
  await expect(passageDuGuide.locator("blockquote")).toHaveText(guideDeLaLecon.extrait);
});

Then(/^il indique « (.+) »$/, async ({ page }, reference: string) => {
  await expect(page.getByTestId("guide-fondamental").getByText(reference, { exact: true })).toBeVisible();
});

Then(/^jamais « (.+) » seul$/, async ({ page }, titre: string) => {
  const titres = await page.getByRole("heading").allTextContents();
  expect(titres).not.toContain(titre);
  await expect(page.getByText(new RegExp(`${echapper(titre)}(?! fondamental)`))).toHaveCount(0);
});

Then(/^le passage pour les adultes donne la citation du programme officiel$/, async ({ page }) => {
  await ouvrirLePassagePourLesAdultes(page);
  await expect(page.getByTestId("citation-du-programme")).toHaveText(leconCourante(page).programme.citation);
});

Then(/^il ne cite aucun guide fondamental$/, async ({ page }) => {
  await expect(page.getByTestId("guide-fondamental")).toHaveCount(0);
});

// --- Alors : ce que Léa entend (textes avec des guillemets français à l'intérieur)

Then(/^Léa entend Noisette lire « (?!.*», puis )(.*[«»].*) »$/, async ({ page }, texte: string) => {
  await expect.poll(async () => (await journal(page)).lecture.texte).toBe(entendu(texte));
});

Then(/^Léa entend de nouveau Noisette lire « (?!.*», puis )(.*[«»].*) »$/, async ({ page }, texte: string) => {
  await expect.poll(async () => (await journal(page)).lots).toBeGreaterThanOrEqual(2);
  await expect.poll(async () => (await journal(page)).lecture.texte).toBe(entendu(texte));
});

Then(/^Léa entend Noisette lire la première étape de leçon$/, async ({ page }) => {
  await expect.poll(async () => (await journal(page)).lecture.texte).toBe(texteLuDeLEtape(leconCourante(page), 0));
});

Then(
  /^Léa entend Noisette lire « (.+) », puis les exemples « (.+) », « (.+) » et « (.+) »$/,
  async ({ page }, texte: string, premier: string, second: string, troisieme: string) => {
    await expect.poll(async () => (await journal(page)).lecture.texte).toBe(entendu(`${texte} ${premier}. ${second}. ${troisieme}`));
  },
);

Then(/^Léa n'entend aucune étape de leçon$/, async ({ page }) => {
  await attendreUneLecture(page);
  await laisserPasserLeDelaiDeLecture(page);
  const etapes = leconCourante(page).lecon.map((etape) => normaliser(etape.texte));
  for (const parole of await toutesLesParoles(page)) {
    for (const etape of etapes) expect(normaliser(parole)).not.toContain(etape);
  }
});

Then(/^Noisette n'annonce pas « (.+) » comme un nouveau défi$/, async ({ page }, titre: string) => {
  await attendreUneLecture(page);
  await laisserPasserLeDelaiDeLecture(page);
  expect(await bulle(page).getAttribute("data-nature")).not.toBe("annonce");
  for (const parole of await toutesLesParoles(page)) expect(parole).not.toContain(titre);
  await expect(bulle(page)).not.toContainText(titre);
});

// --- Alors : affichage de la séance

Then(/^Léa peut continuer quand elle est prête$/, async ({ page }) => {
  await expect(page.getByRole("button", { name: "Continuer", exact: true })).toBeVisible();
});

Then(/^aucun exercice n'a encore commencé$/, async ({ page }) => {
  await expect(page.getByTestId("exercice-en-cours")).toHaveCount(0);
  await expect(page.getByTestId("question")).toHaveCount(0);
});

Then(/^Léa voit les exemples « (.+) », « (.+) » et « (.+) »$/, async ({ page }, premier: string, second: string, troisieme: string) => {
  await expect(page.getByTestId("exemple")).toHaveText([premier, second, troisieme]);
});

Then(
  /^l'avancement de la séance montre (?:toujours )?(\d+) questions? réussies? sur (\d+)$/,
  async ({ page }, reussies: string, total: string) => {
    await expect(recipient(page)).toHaveAttribute("data-questions-reussies", String(reussies));
    await expect(recipient(page)).toHaveAttribute("data-total", String(total));
  },
);

Then(/^un seul exercice lui est proposé$/, async ({ page }) => {
  await expect(page.getByTestId("exercice-propose")).toHaveCount(1);
});

Then(/^la séance complète de « (.+) » compte (\d+) questions$/, async ({ page }, _titre: string, total: string) => {
  await commencerLaSeanceComplete(page);
  await expect(recipient(page)).toHaveAttribute("data-total", String(total));
});

// « Retour » ne laisse pas la page de la leçon deux fois dans l'historique. Vérifié sur un second onglet, pour ne pas
// perdre le journal de la voix de l'onglet de Léa (revenir en arrière recharge la page).
async function verifierQueRetourNeDupliquePasLHistorique(page: Page, titre: string) {
  const adresse = page.url();
  const autre = await page.context().newPage();
  try {
    await autre.goto(adresse);
    await autre.getByRole("button", { name: "Leçon et tous les jeux", exact: true }).click();
    await autre.getByRole("button", { name: "Retour", exact: true }).click();
    await expect(autre.getByRole("heading", { level: 2, name: titre })).toBeVisible();
    await expect(autre).toHaveURL(adresse);
    await autre.goBack();
    await expect(autre).not.toHaveURL(adresse);
  } finally {
    await autre.close();
  }
}

Then(/^Léa voit la page de la leçon « (.+) »$/, async ({ page }, titre: string) => {
  await expect(page.getByRole("heading", { level: 2, name: titre })).toBeVisible();
  await expect(page).toHaveURL(new RegExp(`/lecon/${echapper(encodeURIComponent(leconCourante(page).id))}$`));
  await expect(page.getByRole("button", { name: "Leçon et tous les jeux", exact: true })).toBeVisible();
  await expect(recipient(page)).toHaveCount(0);
  await verifierQueRetourNeDupliquePasLHistorique(page, titre);
});

Then(/^chaque commande de la séance mesure au moins 44 px de haut et de large$/, async ({ page }) => {
  const seance = page.getByRole("region").filter({ has: recipient(page) });
  const commandes = await seance.getByRole("button").all();
  expect(commandes.length).toBeGreaterThan(0);
  for (const commande of commandes) {
    const boite = await commande.boundingBox();
    const nom = await commande.textContent();
    expect(boite, `commande « ${nom} » visible`).not.toBeNull();
    expect(boite?.width ?? 0, `largeur de « ${nom} »`).toBeGreaterThanOrEqual(44);
    expect(boite?.height ?? 0, `hauteur de « ${nom} »`).toBeGreaterThanOrEqual(44);
  }
});
