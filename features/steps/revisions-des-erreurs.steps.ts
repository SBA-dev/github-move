import { type Browser, expect, type Page } from "@playwright/test";
import type { DataTable } from "playwright-bdd";
import {
  LECONS_DES_REVISIONS,
  normaliserPourLaCle,
  QUESTIONS_DE_REVISION,
  questionDeRevision,
  type QuestionDeRevisionDeTest,
  servirLaBibliothequeDesRevisions,
} from "../support/bibliotheque-des-revisions.ts";
import { deposerLaSession, ouvrirUneSessionSansEmail } from "../support/connexion-sans-email.ts";
import type { Famille } from "../support/famille.ts";
import {
  ecrireLaFileDeRevision,
  envoyerUneSeanceDeRevisionTerminee,
  lireLaFileEnRest,
  type QuestionRetenueEnBase,
} from "../support/revision-api.ts";
import { envoyerUneSeanceTerminee } from "../support/seances-api.ts";
import { partie } from "./etoiles-et-fin-de-seance.steps.ts";
import {
  BIBLIOTHEQUE,
  bulle,
  commencerLaSeanceComplete,
  etat as etatDeLaLecon,
  type LeconBrute,
  leconDeTitre,
  ouvrirLaPageDeLaLecon,
  recipient,
} from "./etapes-puis-exercices.steps.ts";
import {
  allerALaQuestion,
  avancerJusquAuxChoix,
  bulleDeChoix,
  etatDesChoix,
  textesDesChoixPossibles,
} from "./exercices-a-choix.steps.ts";
import { After, Given, Then, When } from "./fixtures.ts";
import { estSurUnProfilReel, jouerAvecLeProfilReel, rechargerAvecLeProfilReel } from "./profil-reel.ts";
import { choisirSonProfil, creerLeProfil, jetonDe, profilDe } from "./profils-enfants.steps.ts";
import { journal, normaliser, terminerLaLecture } from "./voix.steps.ts";

// Story #28 : révisions des erreurs.
// La bibliothèque de test (identifiants « e2e-28- ») remplace celle de l'application. Les questions retenues « déjà là » sont
// préparées en base (clé service_role réservée à cette préparation). L'enfant agit par l'interface. Le temps qui passe
// est celui de l'horloge du navigateur, avancée sans recharger l'application.

const DELAI_DE_LA_TRANSITION_MS = 15_000;
const DELAI_D_UN_APPEL_SERVEUR_MS = 20_000;

// --- Le temps

type Ligne = { readonly q: QuestionDeRevisionDeTest; readonly date: string; readonly intervalle: 1 | 3 | 7 };
type Etat28 = { readonly debut: Date; decalage: number; retenues: Ligne[]; posees: string[] };
const etats = new WeakMap<Page, Etat28>();

function etat28(page: Page): Etat28 {
  let e = etats.get(page);
  if (!e) {
    e = { debut: new Date(), decalage: 0, retenues: [], posees: [] };
    etats.set(page, e);
  }
  return e;
}

function iso(d: Date): string {
  const deux = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${deux(d.getMonth() + 1)}-${deux(d.getDate())}`;
}

function jourApres(base: Date, jours: number): Date {
  return new Date(base.getFullYear(), base.getMonth(), base.getDate() + jours, 10, 0, 0);
}

function decalageDe(texte: string): number {
  if (texte === "aujourd'hui") return 0;
  if (texte === "hier") return -1;
  if (texte === "demain") return 1;
  const passe = /^il y a (\d+) jours?$/.exec(texte);
  if (passe) return -Number(passe[1]);
  const futur = /^dans (\d+) jours?$/.exec(texte);
  if (futur) return Number(futur[1]);
  throw new Error(`Date de révision inconnue : « ${texte} »`);
}

function intervalleDe(texte: string | undefined): 1 | 3 | 7 {
  if (texte === undefined || texte === "") return 1;
  const n = Number(/^(\d+) jours?$/.exec(texte)?.[1]);
  if (n === 1 || n === 3 || n === 7) return n;
  throw new Error(`Intervalle de révision inconnu : « ${texte} »`);
}

async function avancerHorloge(page: Page, jours: number | "memeJour"): Promise<void> {
  const e = etat28(page);
  let cible: Date;
  if (jours === "memeJour") {
    const finDuJour = new Date(e.debut.getFullYear(), e.debut.getMonth(), e.debut.getDate() + 1).getTime() - 60_000;
    cible = new Date(Math.min(e.debut.getTime() + 3 * 3_600_000, finDuJour));
  } else {
    cible = jourApres(e.debut, jours);
    e.decalage = jours;
  }
  await page.clock.setFixedTime(cible);
}

// --- Suivi des lectures de la file (l'accueil ne propose rien avant la fin de ces lectures)

const lecturesEnCours = new WeakMap<Page, { n: number }>();

function suivreLaFile(page: Page): void {
  if (lecturesEnCours.has(page)) return;
  const suivi = { n: 0 };
  lecturesEnCours.set(page, suivi);
  const concerne = (url: string) => url.includes("/rest/v1/files_de_revision") || url.includes("/rest/v1/questions_retenues");
  page.on("request", (r) => {
    if (concerne(r.url())) suivi.n += 1;
  });
  const fini = (r: { url(): string }) => {
    if (concerne(r.url())) suivi.n = Math.max(0, suivi.n - 1);
  };
  page.on("requestfinished", fini);
  page.on("requestfailed", fini);
}

const deuxImages = (page: Page) =>
  page.evaluate(() => new Promise<void>((fait) => requestAnimationFrame(() => requestAnimationFrame(() => fait()))));

async function attendreLaFinDesLectures(page: Page): Promise<void> {
  for (let i = 0; i < 2; i++) {
    await deuxImages(page);
    await expect.poll(() => lecturesEnCours.get(page)?.n ?? 0, { intervals: [50] }).toBe(0);
  }
}

// --- Les écrans

const accueilDeLEnfant = (page: Page) => page.getByRole("region", { name: /^Accueil de / });
const boutonJeRevise = (page: Page) => page.getByRole("button", { name: "Je révise mes erreurs", exact: true });
const annonce = (page: Page) => page.getByTestId("annonce-de-la-revision");
const finDeLaRevision = (page: Page) => page.getByTestId("fin-de-la-revision");
const jeNeSaisPas = (page: Page) => page.getByTestId("je-ne-sais-pas");

async function allerDansLApplication(page: Page, chemin: string): Promise<void> {
  await page.evaluate((cible) => {
    history.pushState({ profondeur: 2, precedent: "/jeu" }, "", cible);
    dispatchEvent(new PopStateEvent("popstate"));
  }, chemin);
}

/** Retour à l'accueil de l'enfant sans recharger l'application (la copie de la file est en mémoire). */
async function revenirALAccueil(page: Page): Promise<void> {
  if (await accueilDeLEnfant(page).isVisible()) {
    await allerDansLApplication(page, "/medailles");
    await expect(accueilDeLEnfant(page)).toHaveCount(0);
  }
  await allerDansLApplication(page, "/jeu");
  await expect(accueilDeLEnfant(page)).toBeVisible();
}

async function verifierLaProposition(page: Page, propose: boolean, texte?: string): Promise<void> {
  if (!(await accueilDeLEnfant(page).isVisible())) await revenirALAccueil(page);
  if (propose) {
    await expect(boutonJeRevise(page)).toBeVisible({ timeout: DELAI_D_UN_APPEL_SERVEUR_MS });
    if (texte !== undefined) await expect(annonce(page)).toHaveText(texte);
    return;
  }
  await attendreLaFinDesLectures(page);
  await expect(boutonJeRevise(page)).toHaveCount(0);
  await expect(annonce(page)).toHaveCount(0);
}

// --- Préparation en base

function questionEnBase(l: Ligne, base: Date, rang: number): QuestionRetenueEnBase {
  const date = new Date(base.getFullYear(), base.getMonth(), base.getDate() + decalageDeJour(l.date, base));
  const derniere = new Date(date.getFullYear(), date.getMonth(), date.getDate() - l.intervalle, 9, rang, 0);
  return {
    cle: l.q.cle,
    leconDOrigine: l.q.leconId,
    position: l.q.position,
    type: l.q.type,
    intervalle: l.intervalle,
    dateDeRevision: l.date,
    derniereErreurLe: derniere.toISOString(),
  };
}

function decalageDeJour(jour: string, base: Date): number {
  const [a, m, j] = jour.split("-").map(Number) as [number, number, number];
  const depart = Date.UTC(base.getFullYear(), base.getMonth(), base.getDate());
  return Math.round((Date.UTC(a, m - 1, j) - depart) / 86_400_000);
}

async function preparerLesQuestions(
  famille: Famille,
  page: Page,
  prenom: string,
  lignes: readonly Ligne[],
): Promise<void> {
  const e = etat28(page);
  await ecrireLaFileDeRevision(profilDe(famille, prenom).id, lignes.map((l, rang) => questionEnBase(l, e.debut, rang)));
  if (prenom !== "Léa") return;
  e.retenues.push(...lignes);
  // La file du serveur n'est lue qu'une fois par profil : on recharge pour qu'elle soit lue avec ces questions.
  if (estSurUnProfilReel(page)) await rechargerAvecLeProfilReel(page);
}

function ligneDe(page: Page, enonce: string, relative: string, intervalle?: string): Ligne {
  return {
    q: questionDeRevision(enonce),
    date: iso(new Date(etat28(page).debut.getFullYear(), etat28(page).debut.getMonth(), etat28(page).debut.getDate() + decalageDe(relative))),
    intervalle: intervalleDe(intervalle),
  };
}

// --- Étant donné : la bibliothèque

Given(/^la bibliothèque de test des révisions est servie$/, async ({ famille, monde, page }) => {
  etatDeLaLecon(page).injectees.push(...(LECONS_DES_REVISIONS as LeconBrute[]));
  suivreLaFile(page);
  await servirLaBibliothequeDesRevisions(page);
  if (!estSurUnProfilReel(page)) await jouerAvecLeProfilReel(famille, monde, page);
});

Given(/^Tom a un profil enfant préparé de niveau (\S+)$/, { tags: "@issue-28" }, async ({ famille }, niveau: string) => {
  await creerLeProfil(famille, "Paul", { prenom: "Tom", niveau, libelleUnivers: "Animaux de la forêt" });
});

// --- Étant donné : questions retenues

Given(
  /^(Léa|Tom) a pour questions retenues de la leçon « ([^«»]+) » :$/,
  async ({ famille, page }, prenom: string, _lecon: string, tableau: DataTable) => {
    const lignes = tableau.hashes().map((ligne) =>
      ligneDe(page, String(ligne["question"]), String(ligne["date de révision"]), ligne["intervalle de révision"])
    );
    await preparerLesQuestions(famille, page, prenom, lignes);
  },
);

Given(/^Léa a (\d+) questions dues de la leçon « ([^«»]+) »$/, async ({ famille, page }, n: string, _lecon: string) => {
  const nombre = Number(n);
  const nombres = QUESTIONS_DE_REVISION.filter((q) => q.leconId === "e2e-28-maths-cp-20").slice(0, nombre);
  const lignes = nombres.map((q, i) => ligneDe(page, q.enonce, nombre - i === 1 ? "hier" : `il y a ${nombre - i} jours`));
  await preparerLesQuestions(famille, page, "Léa", lignes);
});

type QuestionReelle = { cle: string; choix: string[]; bonne: string; fausse: string; leconId: string };

function premiereQuestionReelle(exercice: string, titre: string): QuestionReelle {
  const lecon = BIBLIOTHEQUE.find((l) => l.titre === titre);
  const brut = lecon?.exercices.find((e) => e.titre === exercice) as { questions: Array<{ question: string; choix: string[]; reponse: string }> } | undefined;
  const q = brut?.questions[0];
  if (!lecon || !q) throw new Error(`Question réelle introuvable : ${exercice} / ${titre}`);
  return {
    cle: `b:${normaliserPourLaCle(q.question + q.reponse)}`,
    choix: [...new Set(q.choix)],
    bonne: q.reponse,
    fausse: q.choix.find((c) => c !== q.reponse) as string,
    leconId: lecon.id,
  };
}

let derniereReelle: QuestionReelle | undefined;
const reelles = new WeakMap<Famille, QuestionReelle>();

Given(
  /^Léa a pour question due la première question de l'exercice « ([^«»]+) » de la leçon « ([^«»]+) »$/,
  async ({ famille, page }, exercice: string, titre: string) => {
    const q = premiereQuestionReelle(exercice, titre);
    reelles.set(famille, q);
    derniereReelle = q;
    const e = etat28(page);
    const aujourdhui = iso(e.debut);
    await ecrireLaFileDeRevision(profilDe(famille, "Léa").id, [{
      cle: q.cle,
      leconDOrigine: q.leconId,
      position: 0,
      type: "bulles",
      intervalle: 1,
      dateDeRevision: aujourdhui,
      derniereErreurLe: new Date(e.debut.getFullYear(), e.debut.getMonth(), e.debut.getDate() - 1, 9).toISOString(),
    }]);
  },
);

Given(/^la file de révision de Léa ne peut pas être lue$/, async ({ page }) => {
  const refuser = (route: { abort(code: string): Promise<void> }) => route.abort("failed");
  await page.route("**/rest/v1/files_de_revision*", refuser);
  await page.route("**/rest/v1/questions_retenues*", refuser);
});

// --- Séance ordinaire jouée par l'interface

type Maniere = "juste" | "erreur" | "jeNeSaisPas";

async function mauvaiseReponse(page: Page, bonne: string): Promise<void> {
  const fausse = (await textesDesChoixPossibles(page)).find((t) => t !== bonne);
  if (fausse === undefined) throw new Error("Aucun mauvais choix possible");
  const touchee = bulleDeChoix(page, fausse);
  await touchee.click();
  await expect(touchee).toHaveAttribute("aria-disabled", "true");
}

async function repondreALaQuestion(page: Page, q: { reponse: string }, maniere: Maniere): Promise<void> {
  await avancerJusquAuxChoix(page);
  if (maniere === "erreur") await mauvaiseReponse(page, q.reponse);
  if (maniere === "jeNeSaisPas") {
    await jeNeSaisPas(page).click();
    await expect(jeNeSaisPas(page)).toHaveCount(0);
  }
  await bulleDeChoix(page, q.reponse).click();
}

async function jouerUneSeance(
  page: Page,
  titre: string,
  manieres: ReadonlyMap<string, Maniere>,
  quitterApres?: string,
): Promise<void> {
  const lecon = leconDeTitre(page, titre);
  etatDeLaLecon(page).courante = lecon;
  etatDesChoix(page).exerciceUnique = undefined;
  await ouvrirLaPageDeLaLecon(page, titre);
  await commencerLaSeanceComplete(page);
  const questions = (lecon.exercices[0] as { questions: Array<{ question: string; choix: string[]; reponse: string }> }).questions;
  for (const [rang, q] of questions.entries()) {
    if (quitterApres === q.question) {
      await avancerJusquAuxChoix(page);
      await mauvaiseReponse(page, q.reponse);
      await page.getByRole("button", { name: "Retour", exact: true }).click();
      await expect(recipient(page)).toHaveCount(0);
      return;
    }
    await repondreALaQuestion(page, q, manieres.get(q.question) ?? "juste");
    if (rang < questions.length - 1) await expect(recipient(page)).toHaveAttribute("data-questions-reussies", String(rang + 1));
  }
  await expect(page.getByTestId("fin-de-seance")).toBeVisible({ timeout: DELAI_DE_LA_TRANSITION_MS });
}

Given(/^Léa a terminé une séance de la leçon « ([^«»]+) », (.+)$/, async ({ page }, titre: string, maniere: string) => {
  const manieres = new Map<string, Maniere>();
  const erreur = /^en se trompant à « ([^«»]+) »$/.exec(maniere);
  const jns = /^en disant « Je ne sais pas » à « ([^«»]+) »$/.exec(maniere);
  if (erreur) manieres.set(erreur[1] as string, "erreur");
  else if (jns) manieres.set(jns[1] as string, "jeNeSaisPas");
  else if (maniere !== "sans erreur") throw new Error(`Manière inconnue : ${maniere}`);
  await jouerUneSeance(page, titre, manieres);
});

Given(
  /^Léa a quitté une séance de la leçon « ([^«»]+) » après s'être trompée à « ([^«»]+) »$/,
  async ({ page }, titre: string, question: string) => {
    await jouerUneSeance(page, titre, new Map(), question);
  },
);

// --- Le temps qui passe

When(/^Léa revient à son accueil (le lendemain|plus tard le même jour|\d+ jours plus tard)$/, async ({ page }, quand: string) => {
  await avancerHorloge(page, quand === "le lendemain" ? 1 : quand === "plus tard le même jour" ? "memeJour" : Number.parseInt(quand, 10));
  await revenirALAccueil(page);
});

// --- Test de départ (aucune question fausse n'est retenue)

Given(/^Léa a fait le test de départ, avec des questions fausses à (.+)$/, { tags: "@issue-28" }, async ({ page }, liste: string) => {
  const titres = [...liste.matchAll(/« ([^«»]+) »/g)].map((m) => m[1] as string);
  await expect(accueilDeLEnfant(page)).toBeVisible();
  await page.getByRole("button", { name: "Mon test de départ", exact: true }).click();
  await expect(page.getByTestId("proposition-du-test-de-depart")).toBeVisible();
  await page.getByRole("button", { name: "Oui, on y va !", exact: true }).click();
  const fin = page.getByTestId("fin-du-test-de-depart").getByRole("button", { name: "Voir mon parcours", exact: true });
  let apres: string | undefined;
  for (let i = 0; i < 12; i++) {
    let enonce: string | null = null;
    let termine = false;
    await expect.poll(async () => {
      if (await fin.isVisible()) return (termine = true);
      const texte = await enonceAffiche(page);
      if (texte !== null && texte !== apres) return (enonce = texte) !== null;
      await terminerLaLecture(page);
      return false;
    }, { intervals: [100], timeout: DELAI_DE_LA_TRANSITION_MS }).toBe(true);
    if (termine || enonce === null) return;
    const q = questionDeRevision(enonce);
    await repondreALaQuestion(page, { reponse: q.reponse }, titres.includes(q.leconTitre) ? "erreur" : "juste");
    apres = enonce;
  }
  throw new Error("Le test de départ ne se termine pas");
});

async function enonceAffiche(page: Page): Promise<string | null> {
  const question = page.getByTestId("question");
  if ((await question.count()) === 0) return null;
  return normaliser((await question.first().textContent()) ?? "");
}

// --- La séance de révision

type Plan = QuestionDeRevisionDeTest[];

function planDeLaRevision(page: Page): Plan {
  const e = etat28(page);
  const jour = iso(new Date(e.debut.getFullYear(), e.debut.getMonth(), e.debut.getDate() + e.decalage));
  return e.retenues
    .filter((l) => l.date <= jour)
    .sort((a, b) => a.date.localeCompare(b.date) || a.q.cle.localeCompare(b.q.cle))
    .slice(0, 10)
    .map((l) => l.q);
}

function preparerLeScenarioDeLaRevision(page: Page): void {
  const plan = planDeLaRevision(page);
  const premiere = plan[0];
  if (!premiere) return;
  const lecon = leconDeTitre(page, premiere.leconTitre);
  etatDeLaLecon(page).courante = {
    ...lecon,
    exercices: [{
      type: "bulles",
      titre: "Révision",
      questions: plan.map((q) => ({ question: q.enonce, choix: [...q.choix], reponse: q.reponse })),
    }],
  };
  etatDesChoix(page).exerciceUnique = undefined;
  etat28(page).posees = [];
}

async function commencerLaRevision(page: Page, auClavier = false): Promise<void> {
  if (!(await accueilDeLEnfant(page).isVisible())) await revenirALAccueil(page);
  await expect(boutonJeRevise(page)).toBeVisible({ timeout: DELAI_D_UN_APPEL_SERVEUR_MS });
  preparerLeScenarioDeLaRevision(page);
  if (auClavier) {
    for (let essai = 0; essai < 40; essai++) {
      if ((await boutonJeRevise(page).and(page.locator(":focus")).count()) > 0) break;
      await page.keyboard.press("Tab");
    }
    await expect(boutonJeRevise(page)).toBeFocused();
    await page.keyboard.press("Enter");
  } else {
    await boutonJeRevise(page).click();
  }
  await expect(page.getByRole("heading", { level: 2, name: "Je révise mes erreurs", exact: true })).toBeVisible();
}

type Fin = { readonly fin: true } | { readonly fin: false; readonly enonce: string };

async function questionOuFin(page: Page, apres?: string): Promise<Fin> {
  let trouvee: Fin | undefined;
  await expect.poll(async () => {
    if (await finDeLaRevision(page).getByRole("button", { name: "Accueil", exact: true }).isVisible()) {
      trouvee = { fin: true };
      return true;
    }
    const enonce = await enonceAffiche(page);
    if (enonce !== null && enonce !== apres) {
      trouvee = { fin: false, enonce };
      return true;
    }
    await terminerLaLecture(page);
    return false;
  }, { intervals: [100], timeout: DELAI_DE_LA_TRANSITION_MS }).toBe(true);
  if (trouvee === undefined) throw new Error("Ni question ni fin de la révision");
  if (!trouvee.fin && !etat28(page).posees.includes(trouvee.enonce)) etat28(page).posees.push(trouvee.enonce);
  return trouvee;
}

type Deroule = (enonce: string) => Maniere;

async function jouerLaRevision(page: Page, deroule: Deroule): Promise<void> {
  let apres: string | undefined;
  for (let i = 0; i < 12; i++) {
    const courante = await questionOuFin(page, apres);
    if (courante.fin) return;
    await repondreALaQuestion(page, questionDeRevision(courante.enonce), deroule(courante.enonce));
    apres = courante.enonce;
  }
  throw new Error("La séance de révision ne se termine pas");
}

const TOUT_JUSTE: Deroule = () => "juste";

function derouleDe(texte: string): Deroule {
  if (texte === "en répondant juste à toutes les questions") return TOUT_JUSTE;
  const erreur = /^en se trompant à « ([^«»]+) »$/.exec(texte);
  if (erreur) return (q) => (q === erreur[1] ? "erreur" : "juste");
  const jns = /^en disant « Je ne sais pas » à « ([^«»]+) »$/.exec(texte);
  if (jns) return (q) => (q === jns[1] ? "jeNeSaisPas" : "juste");
  if (texte === "juste à toutes les questions") return TOUT_JUSTE;
  const seule = /^juste seulement à « ([^«»]+) »$/.exec(texte);
  if (seule) return (q) => (q === seule[1] ? "juste" : "erreur");
  if (texte === "en se trompant à toutes les questions") return () => "erreur";
  throw new Error(`Déroulé de la révision inconnu : « ${texte} »`);
}

When(/^Léa commence la séance de révision(, au clavier seulement)?$/, async ({ page }, clavier: string | undefined) => {
  await commencerLaRevision(page, clavier != null);
});

Given(/^Léa a commencé la séance de révision$/, async ({ page }) => {
  await commencerLaRevision(page);
});

Given(/^Léa en est à la question « ([^«»]+) » de la séance de révision$/, async ({ page }, enonce: string) => {
  await commencerLaRevision(page);
  await allerALaQuestion(page, enonce, true);
});

Given(/^Léa a répondu juste à la question « ([^«»]+) » de la séance de révision$/, async ({ page }, enonce: string) => {
  await commencerLaRevision(page);
  const courante = await questionOuFin(page);
  if (courante.fin || courante.enonce !== enonce) throw new Error(`La question « ${enonce} » n'est pas la première posée`);
  await repondreALaQuestion(page, questionDeRevision(enonce), "juste");
  await questionOuFin(page, enonce);
});

Given(/^Léa a fait la séance de révision, (.+)$/, async ({ page }, deroule: string) => {
  await commencerLaRevision(page);
  await jouerLaRevision(page, derouleDe(deroule));
});

When(/^Léa répond juste à toutes les questions de la séance de révision$/, async ({ page }) => {
  await jouerLaRevision(page, TOUT_JUSTE);
});

When(/^Léa répond à la séance de révision, (.+)$/, async ({ page }, deroule: string) => {
  await jouerLaRevision(page, derouleDe(deroule));
});

When(/^Léa quitte la séance de révision$/, async ({ page }) => {
  await page.getByRole("banner").getByRole("button", { name: "Retour", exact: true }).click();
  await expect(recipient(page)).toHaveCount(0);
  await expect(accueilDeLEnfant(page)).toBeVisible();
});

When(/^Léa choisit « Accueil » à la fin de la séance de révision$/, async ({ page }) => {
  await finDeLaRevision(page).getByRole("button", { name: "Accueil", exact: true }).click();
});

// --- Alors : accueil

Then(
  /^(le lendemain, )?l'accueil de Léa (propose|ne propose pas) (?:la|de) séance de révision(?:, avec « ([^«»]+) »)?(?:,? sur le téléphone de (Paul))?$/,
  async ({ famille, page, browser, baseURL }, lendemain: string | undefined, verbe: string, texte: string | undefined, telephone: string | undefined) => {
    const cible = telephone == null ? (partieDeMarie.get(famille) ?? page) : await accueilSurLeTelephone(famille, browser, baseURL, "Paul", lendemain != null);
    await verifierLaProposition(cible, verbe === "propose", texte);
  },
);

Then(/^la proposition de la séance de révision mesure au moins 44 px de haut$/, async ({ page }) => {
  const boite = await boutonJeRevise(page).boundingBox();
  expect(boite, "bouton « Je révise mes erreurs » visible").not.toBeNull();
  expect(boite?.height ?? 0).toBeGreaterThanOrEqual(44);
});

// --- Alors : la séance

Then(/^l'écran s'intitule « ([^«»]+) », avec « ([^«»]+) »$/, { tags: "@issue-28" }, async ({ page }, titre: string, sousTitre: string) => {
  await expect(page.getByRole("heading", { level: 2, name: titre, exact: true })).toBeVisible();
  await expect(page.getByTestId("sous-titre-de-la-revision")).toHaveText(sousTitre);
});

Then(/^Noisette dit « ([^«»]+) »$/, { tags: "@issue-28" }, async ({ page }, texte: string) => {
  await expect(bulle(page)).toHaveText(normaliser(texte));
});

Then(/^Léa entend Noisette lire « ([^«»]+) »$/, { tags: "@issue-28" }, async ({ page }, texte: string) => {
  const voulu = normaliser(texte);
  await expect.poll(async () => {
    const lue = (await journal(page)).lecture.texte;
    if (lue === voulu) return true;
    if (lue !== "") await terminerLaLecture(page);
    return false;
  }, { intervals: [100], timeout: DELAI_D_UN_APPEL_SERVEUR_MS }).toBe(true);
});

Then(/^Léa a eu, dans l'ordre, les questions :$/, async ({ page }, tableau: DataTable) => {
  expect(etat28(page).posees).toEqual(tableau.hashes().map((l) => String(l["question"])));
});

Then(/^ni « ([^«»]+) » ni « ([^«»]+) »$/, async ({ page }, a: string, b: string) => {
  expect(etat28(page).posees).not.toContain(a);
  expect(etat28(page).posees).not.toContain(b);
});

// --- Alors : la fin

Then(/^la fin de la séance de révision propose seulement « Accueil »$/, async ({ page }) => {
  await expect(finDeLaRevision(page)).toBeVisible({ timeout: DELAI_DE_LA_TRANSITION_MS });
  await expect(finDeLaRevision(page).getByRole("button").filter({ hasNotText: "Réécouter" })).toHaveText(["Accueil"]);
});

Then(/^la fin de la séance de révision ne montre aucune étoile$/, async ({ page }) => {
  await expect(finDeLaRevision(page)).toBeVisible();
  await expect(page.getByTestId("etoile")).toHaveCount(0);
  await expect(page.getByTestId("etoiles-gagnees")).toHaveCount(0);
  await expect(finDeLaRevision(page)).not.toContainText(/★|étoile/i);
});

Then(/^le focus est sur « ([^«»]+) »$/, { tags: "@issue-28" }, async ({ page }, nom: string) => {
  await expect(finDeLaRevision(page).getByRole("button", { name: nom, exact: true })).toBeFocused();
});

// --- Téléphones des parents

const telephones = new WeakMap<Famille, Map<string, Page>>();
const contextes = new WeakMap<Famille, Array<{ close(): Promise<void> }>>();

async function telephoneDe(famille: Famille, browser: Browser, baseURL: string | undefined, parent: "Paul" | "Marie"): Promise<Page> {
  const memo = telephones.get(famille) ?? new Map<string, Page>();
  telephones.set(famille, memo);
  const connu = memo.get(parent);
  if (connu) return connu;
  const adresse = famille.normalisee(famille.adresseDe(parent));
  const telephone = await famille.page("telephone");
  const session = await famille.session(telephone);
  let cible = telephone;
  if (session === null) {
    await famille.connecterSansEmail("telephone", parent);
  } else if (session.user.email !== adresse) {
    const contexte = await browser.newContext({ baseURL: baseURL ?? "http://localhost:5173", viewport: { width: 360, height: 740 }, hasTouch: true });
    contextes.set(famille, [...(contextes.get(famille) ?? []), contexte]);
    cible = await contexte.newPage();
    suivreLaFile(cible);
    await deposerLaSession(cible, await ouvrirUneSessionSansEmail(adresse));
  }
  suivreLaFile(cible);
  memo.set(parent, cible);
  return cible;
}

After(async ({ famille }) => {
  for (const contexte of contextes.get(famille) ?? []) await contexte.close();
});

async function accueilSurLeTelephone(
  famille: Famille,
  browser: Browser,
  baseURL: string | undefined,
  parent: "Paul" | "Marie",
  lendemain: boolean,
): Promise<Page> {
  const telephone = await telephoneDe(famille, browser, baseURL, parent);
  if (lendemain) await avancerHorloge(telephone, 1);
  await telephone.goto("/");
  await choisirSonProfil(telephone, "Léa");
  return telephone;
}

When(/^Léa choisit son profil enfant sur le téléphone de Marie$/, async ({ famille, browser, baseURL }) => {
  const telephone = await telephoneDe(famille, browser, baseURL, "Marie");
  await telephone.goto("/");
  await choisirSonProfil(telephone, "Léa");
  partieDeMarie.set(famille, telephone);
});

const partieDeMarie = new WeakMap<Famille, Page>();

// --- Serveur

function corpsDeSeanceOrdinaire(enfant: string, q: QuestionReelle, jour: string): object {
  return {
    seance: crypto.randomUUID(),
    enfant,
    lecon: q.leconId,
    choix: { genre: "unExercice", position: 0 },
    tirages: [q.choix],
    reponses: [[{ choix: q.fausse }, { choix: q.bonne }]],
    termineeLe: new Date().toISOString(),
    jour,
  };
}

When(
  /^l'appareil envoie pour Léa une séance terminée de l'exercice « ([^«»]+) » de la leçon « ([^«»]+) », avec une erreur à sa première question$/,
  async ({ famille, page }, exercice: string, titre: string) => {
    const lecon = BIBLIOTHEQUE.find((l) => l.titre === titre);
    const brut = lecon?.exercices.find((e) => e.titre === exercice) as { questions: Array<{ question: string; choix: string[]; reponse: string }> };
    const jeton = await jetonDe(famille, "Paul");
    const q = premiereQuestionReelle(exercice, titre);
    const questions = brut.questions;
    const corps = {
      ...corpsDeSeanceOrdinaire(profilDe(famille, "Léa").id, q, iso(etat28(page).debut)),
      tirages: questions.map((x) => [...new Set(x.choix)]),
      reponses: questions.map((x, rang) => (rang === 0 ? [{ choix: q.fausse }, { choix: q.bonne }] : [{ choix: x.reponse }])),
    };
    const reponse = await envoyerUneSeanceTerminee(jeton, corps);
    partie(famille).reponse = reponse;
    expect(reponse.statut, `envoi accepté : ${reponse.message ?? ""}`).toBe(200);
  },
);

function corpsDeRevision(enfant: string, q: QuestionReelle, jour: string, cas?: string): object {
  const base = { id: crypto.randomUUID(), enfant, termineeLe: new Date().toISOString(), jour };
  if (cas === "dont la question ne finit pas par la bonne réponse") {
    return { ...base, questions: [q.cle], tirages: [q.choix], reponses: [[{ choix: q.fausse }]] };
  }
  if (cas === "qui pose deux fois cette question") {
    return { ...base, questions: [q.cle, q.cle], tirages: [q.choix, q.choix], reponses: [[{ choix: q.bonne }], [{ choix: q.bonne }]] };
  }
  return { ...base, questions: [q.cle], tirages: [q.choix], reponses: [[{ choix: q.bonne }]] };
}

function questionReelleDe(famille: Famille): QuestionReelle {
  const q = reelles.get(famille) ?? derniereReelle;
  if (!q) throw new Error("Aucune question due réelle préparée");
  return q;
}

When(/^l'appareil envoie pour Léa une séance de révision terminée, juste à cette question$/, async ({ famille, page }) => {
  const jeton = await jetonDe(famille, "Paul");
  const reponse = await envoyerUneSeanceDeRevisionTerminee(
    jeton,
    corpsDeRevision(profilDe(famille, "Léa").id, questionReelleDe(famille), iso(etat28(page).debut)),
  );
  expect(reponse.statut, `envoi accepté : ${reponse.message ?? ""}`).toBe(200);
});

When(/^l'appareil envoie pour Léa une séance de révision terminée (dont .+|qui .+)$/, async ({ famille, page }, cas: string) => {
  const jeton = await jetonDe(famille, "Paul");
  partie(famille).reponse = await envoyerUneSeanceDeRevisionTerminee(
    jeton,
    corpsDeRevision(profilDe(famille, "Léa").id, questionReelleDe(famille), iso(etat28(page).debut), cas),
  );
});

Then(/^l'enregistrement est refusé$/, { tags: "@issue-28" }, async ({ famille }) => {
  const reponse = partie(famille).reponse;
  expect(reponse?.statut, "refus d'une séance de révision incohérente").toBe(422);
  expect(reponse?.message).toBe("Cette séance de révision n'a pas pu être vérifiée.");
});

async function jetonDeClaire(famille: Famille): Promise<string> {
  const telephone = await famille.page("telephone");
  const jeton = (await famille.session(telephone))?.access_token;
  if (jeton === undefined) throw new Error("Claire n'est pas connectée sur le téléphone");
  return jeton;
}

When(/^Claire demande la file de révision du profil enfant de Léa$/, async ({ famille }) => {
  partie(famille).lignesLues = await lireLaFileEnRest(await jetonDeClaire(famille), profilDe(famille, "Léa").id);
});

When(/^Claire envoie une séance de révision terminée pour le profil enfant de Léa$/, async ({ famille, page }) => {
  partie(famille).reponse = await envoyerUneSeanceDeRevisionTerminee(
    await jetonDeClaire(famille),
    corpsDeRevision(profilDe(famille, "Léa").id, questionReelleDe(famille), iso(etat28(page).debut)),
  );
});

// --- Données du profil (#14, non livrée)

function dependDe14(mecanique: string): never {
  throw new Error(`Étape non implémentée : dépend de la story #14 (${mecanique}).`);
}

Then(/^plus aucune question retenue ni aucune séance de révision de Léa n'est gardée par Savanturier$/, () => dependDe14("suppression du profil enfant"));
