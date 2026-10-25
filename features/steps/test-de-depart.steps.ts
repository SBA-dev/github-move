import { type Browser, type BrowserContext, expect, type Page } from "@playwright/test";
import type { DataTable } from "playwright-bdd";
import {
  CHOIX_FAUX,
  enonceDeLaQuestion,
  LECONS_DU_TEST_DE_DEPART,
  lecturesDuResultatEnCours,
  REPONSE_JUSTE,
  refuserLaBibliotheque,
  servirLaBibliothequeDuTestDeDepart,
  suivreLesLecturesDuResultat,
  titreDeLaQuestion as titreDeLaQuestionDeTest,
} from "../support/bibliotheque-du-test-de-depart.ts";
import { QUESTIONS_DE_REVISION } from "../support/bibliotheque-des-revisions.ts";
import { deposerLaSession, ouvrirUneSessionSansEmail } from "../support/connexion-sans-email.ts";
import type { Famille } from "../support/famille.ts";
import { ecrireUnResultatDeLecon, ecrireUnResultatDeTestDeDepart } from "../support/supabase-test.ts";
import { envoyerUnTestDeDepartTermine, lireLeResultatDuTestEnRest } from "../support/test-de-depart-api.ts";
import { partie } from "./etoiles-et-fin-de-seance.steps.ts";
import { BIBLIOTHEQUE, bulle, entendu, etat as etatDeLaLecon, type LeconBrute, leconDeTitre, recipient, toutesLesParoles } from "./etapes-puis-exercices.steps.ts";
import {
  avancerJusquAuxChoix,
  bulleDeChoix,
  etatDesChoix,
  finirLaParoleJusqua,
  questionsReussies,
  textesDesChoix,
  textesDesChoixPossibles,
} from "./exercices-a-choix.steps.ts";
import { Given, After, Then, When } from "./fixtures.ts";
import { choisirSonProfil, jetonDe, profilDe } from "./profils-enfants.steps.ts";
import { normaliser, terminerLaLecture } from "./voix.steps.ts";

// Story #27 : test de départ.
// La bibliothèque de test (identifiants « e2e-27- ») remplace celle de l'application dans le navigateur ; la progression et le
// résultat du test de départ « déjà fait » sont préparés directement en base (clé service_role réservée à cette préparation).
// L'enfant, lui, agit toujours par l'interface : il touche les bulles, « Je ne sais pas », « Plus tard »…
// Le serveur ne connaît pas les leçons de test (il refuse l'envoi, 422) : le test fini reste en mémoire dans le navigateur,
// qui ne doit donc pas être rechargé entre le test de départ et ce qui en dépend. Les scénarios de la règle 9 appellent
// directement l'Edge Function sur une vraie leçon, avec le jeton du parent (jamais la clé service_role).

const DELAI_DE_LA_TRANSITION_MS = 15_000;

// --- Les écrans

const proposition = (page: Page) => page.getByTestId("proposition-du-test-de-depart");
const finDuTest = (page: Page) => page.getByTestId("fin-du-test-de-depart");
const accueilDeLEnfant = (page: Page) => page.getByRole("region", { name: /^Accueil de / });
// Le nom du bouton est le titre de la tuile, suivi (ou non) de sa proposition : seul le titre compte.
const boutonMonTestDeDepart = (page: Page) => page.getByRole("button", { name: /^Mon test de départ(?: |$)/ });
const boutonOui = (page: Page) => page.getByRole("button", { name: "Oui, on y va !", exact: true });
const boutonPlusTard = (page: Page) => page.getByRole("button", { name: "Plus tard", exact: true });
const jeNeSaisPas = (page: Page) => page.getByTestId("je-ne-sais-pas");

const deuxImages = (page: Page) =>
  page.evaluate(() => new Promise<void>((fait) => requestAnimationFrame(() => requestAnimationFrame(() => fait()))));

// --- État du scénario

type Partie = { posees: string[] };
const parties = new WeakMap<Page, Partie>();

function partieDe(page: Page): Partie {
  let courante = parties.get(page);
  if (!courante) {
    courante = { posees: [] };
    parties.set(page, courante);
  }
  return courante;
}

function noterLaQuestion(page: Page, titre: string): void {
  const posees = partieDe(page).posees;
  if (!posees.includes(titre)) posees.push(titre);
  etatDeLaLecon(page).courante = leconDeTitre(page, titre);
}

// --- L'accueil de l'enfant et la proposition

async function surLAccueilDeLEnfant(page: Page): Promise<void> {
  if (!(await accueilDeLEnfant(page).isVisible())) await choisirSonProfil(page, "Léa");
  await expect(accueilDeLEnfant(page)).toBeVisible();
}

async function ouvrirLaProposition(page: Page): Promise<void> {
  await surLAccueilDeLEnfant(page);
  await boutonMonTestDeDepart(page).click();
  await expect(proposition(page)).toBeVisible();
}

async function accepterLaProposition(page: Page, auClavier = false): Promise<void> {
  await expect(boutonOui(page)).toBeVisible();
  if (auClavier) {
    await expect(boutonOui(page)).toBeFocused();
    await page.keyboard.press("Enter");
  } else {
    await boutonOui(page).click();
  }
}

/** L'accueil ne connaît « Mon test de départ » qu'une fois lus le résultat du test sur le serveur et la bibliothèque. */
async function attendreLaFinDesLecturesDuResultat(page: Page): Promise<void> {
  await deuxImages(page);
  await expect.poll(() => lecturesDuResultatEnCours(page), { intervals: [50] }).toBe(0);
  await deuxImages(page);
  await expect.poll(() => lecturesDuResultatEnCours(page), { intervals: [50] }).toBe(0);
}

async function verifierLeBoutonDeLAccueil(page: Page, propose: boolean): Promise<void> {
  await surLAccueilDeLEnfant(page);
  if (propose) {
    await expect(boutonMonTestDeDepart(page)).toBeVisible();
    return;
  }
  await attendreLaFinDesLecturesDuResultat(page);
  await expect(boutonMonTestDeDepart(page)).toHaveCount(0);
}

// --- Le téléphone de Paul (un autre appareil que celui de l'enfant)

const telephonesDePaul = new WeakMap<Famille, Page>();
const contextesOuverts = new WeakMap<Famille, BrowserContext>();

async function telephoneDePaul(famille: Famille, browser: Browser, baseURL: string | undefined): Promise<Page> {
  const connu = telephonesDePaul.get(famille);
  if (connu) return connu;
  const adresse = famille.normalisee(famille.adresseDe("Paul"));
  const telephone = await famille.page("telephone");
  const session = await famille.session(telephone);
  let cible = telephone;
  if (session === null) {
    await famille.connecterSansEmail("telephone", "Paul");
  } else if (session.user.email !== adresse) {
    const contexte = await browser.newContext({ baseURL: baseURL ?? "http://localhost:5173", viewport: { width: 360, height: 740 }, hasTouch: true });
    contextesOuverts.set(famille, contexte);
    cible = await contexte.newPage();
    suivreLesLecturesDuResultat(cible);
    await servirLaBibliothequeDuTestDeDepart(cible);
    await deposerLaSession(cible, await ouvrirUneSessionSansEmail(adresse));
  }
  suivreLesLecturesDuResultat(cible);
  await servirLaBibliothequeDuTestDeDepart(cible);
  etatDeLaLecon(cible).injectees.push(...(LECONS_DU_TEST_DE_DEPART as LeconBrute[]));
  telephonesDePaul.set(famille, cible);
  return cible;
}

After(async ({ famille }) => {
  await contextesOuverts.get(famille)?.close();
});

async function accueilDeLeaSurLeTelephoneDePaul(famille: Famille, browser: Browser, baseURL: string | undefined): Promise<Page> {
  const telephone = await telephoneDePaul(famille, browser, baseURL);
  await telephone.goto("/");
  await choisirSonProfil(telephone, "Léa");
  return telephone;
}

// --- Jouer le test de départ comme un enfant

// Story #29 : « Les sons de révision » (leçon de #28) est dans la bibliothèque de l'accueil ; ses questions ont leurs propres bonnes réponses.
const questionDeRevisionPosee = (enonce: string) => QUESTIONS_DE_REVISION.find((q) => q.enonce === enonce);
const titreDeLaQuestion = (enonce: string) => questionDeRevisionPosee(enonce)?.leconTitre ?? titreDeLaQuestionDeTest(enonce);

async function reponseJusteAffichee(page: Page): Promise<string> {
  const enonce = await enonceAffiche(page);
  return (enonce === null ? undefined : questionDeRevisionPosee(enonce)?.reponse) ?? REPONSE_JUSTE;
}

type Maniere = "juste" | "jeNeSaisPas" | { readonly erreurs: number };
type QuestionCourante = { readonly fin: true } | { readonly fin: false; readonly titre: string; readonly enonce: string };

async function enonceAffiche(page: Page): Promise<string | null> {
  const question = page.getByTestId("question");
  if ((await question.count()) === 0) return null;
  return normaliser((await question.first().textContent()) ?? "");
}

/** La question posée, ou la fin du test. Termine les lectures du personnage guide tant que rien de nouveau n'est affiché. */
async function questionOuFin(page: Page, apres?: string): Promise<QuestionCourante> {
  let trouvee: QuestionCourante | undefined;
  await expect.poll(async () => {
    // La fin n'est prête qu'avec « Voir mon parcours » : le résultat est alors retenu dans le navigateur.
    if (await finDuTest(page).getByRole("button", { name: "Voir mon parcours", exact: true }).isVisible()) {
      trouvee = { fin: true };
      return true;
    }
    const enonce = await enonceAffiche(page);
    if (enonce !== null && enonce !== apres) {
      trouvee = { fin: false, titre: titreDeLaQuestion(enonce), enonce };
      return true;
    }
    await terminerLaLecture(page);
    return false;
  }, { intervals: [100], timeout: DELAI_DE_LA_TRANSITION_MS }).toBe(true);
  if (trouvee === undefined) throw new Error("Ni question ni fin du test de départ");
  if (!trouvee.fin) noterLaQuestion(page, trouvee.titre);
  return trouvee;
}

async function laQuestionPosee(page: Page, titre: string): Promise<string> {
  const courante = await questionOuFin(page);
  if (courante.fin) throw new Error(`Le test de départ est fini : la question de « ${titre} » n'est plus posée`);
  expect(courante.titre, "question posée").toBe(titre);
  return courante.enonce;
}

async function faireUneErreur(page: Page): Promise<void> {
  const juste = await reponseJusteAffichee(page);
  const possibles = (await textesDesChoixPossibles(page)).filter((texte) => texte !== juste);
  // Quand toutes les mauvaises bulles sont déjà grisées, l'enfant touche une bulle grisée : rien ne change.
  const cible = possibles[0] ?? (await textesDesChoix(page)).find((texte) => texte !== juste) ?? CHOIX_FAUX[0];
  const touchee = bulleDeChoix(page, cible);
  await touchee.click({ force: possibles.length === 0 });
  if (possibles.length > 0) await expect(touchee).toHaveAttribute("aria-disabled", "true");
}

async function direJeNeSaisPas(page: Page): Promise<void> {
  await jeNeSaisPas(page).click();
  await expect(jeNeSaisPas(page)).toHaveCount(0);
  await expect(page.getByTestId("bonne-reponse-annoncee")).not.toHaveText("");
}

async function donnerLaBonneReponse(page: Page, reussiesAvant: number): Promise<void> {
  await bulleDeChoix(page, await reponseJusteAffichee(page)).click();
  await expect(recipient(page)).toHaveAttribute("data-questions-reussies", String(reussiesAvant + 1));
}

async function repondreALaQuestion(page: Page, maniere: Maniere): Promise<void> {
  await avancerJusquAuxChoix(page);
  const reussiesAvant = await questionsReussies(page);
  etatDesChoix(page).reussiesAvant = reussiesAvant;
  if (maniere === "jeNeSaisPas") await direJeNeSaisPas(page);
  else if (maniere !== "juste") for (let i = 0; i < maniere.erreurs; i++) await faireUneErreur(page);
  await donnerLaBonneReponse(page, reussiesAvant);
}

type Parcours = { readonly manieres: ReadonlyMap<string, Maniere>; readonly avant?: string; readonly apres?: string };

/** Joue le test de départ jusqu'à la fin, ou jusqu'à la question voulue (avant de lui répondre, ou juste après). */
async function jouer(page: Page, parcours: Parcours): Promise<"fin" | "avant" | "apres"> {
  let apres: string | undefined;
  for (;;) {
    const courante = await questionOuFin(page, apres);
    if (courante.fin) return "fin";
    if (parcours.avant === courante.titre) return "avant";
    await repondreALaQuestion(page, parcours.manieres.get(courante.titre) ?? "juste");
    if (parcours.apres === courante.titre) {
      await questionOuFin(page, courante.enonce);
      return "apres";
    }
    apres = courante.enonce;
  }
}

const TOUTES_JUSTES: ReadonlyMap<string, Maniere> = new Map();

function titresCites(liste: string): string[] {
  return [...liste.matchAll(/« ([^«»]+) »/g)].map((m) => m[1] as string);
}

function fausses(liste: string): Map<string, Maniere> {
  return new Map(titresCites(liste).map((titre) => [titre, { erreurs: 1 }]));
}

function maniereDeLaQuestion(texte: string): Maniere {
  if (texte.startsWith("du premier coup")) return "juste";
  if (texte.startsWith("après s'être trompée")) return { erreurs: 1 };
  if (texte.startsWith("après avoir dit")) return "jeNeSaisPas";
  throw new Error(`Manière de répondre inconnue : ${texte}`);
}

/** « en répondant juste à toutes les questions », « avec des questions fausses à … », « en répondant à la question de … ». */
function lireLeDeroule(texte: string): Map<string, Maniere> {
  if (texte === "en répondant juste à toutes les questions") return new Map();
  const faussesCitees = /^avec (?:des questions fausses|une question fausse) à (.+)$/.exec(texte);
  if (faussesCitees) return fausses(faussesCitees[1] as string);
  const unique = /^en répondant à la question de « ([^«»]+) » (.+), et juste aux autres$/.exec(texte);
  if (unique) return new Map([[unique[1] as string, maniereDeLaQuestion(unique[2] as string)]]);
  throw new Error(`Déroulé du test de départ inconnu : « ${texte} »`);
}

async function commencerLeTest(page: Page): Promise<void> {
  await ouvrirLaProposition(page);
  await accepterLaProposition(page);
  await questionOuFin(page);
}

async function faireLeTest(page: Page, manieres: ReadonlyMap<string, Maniere>): Promise<void> {
  await commencerLeTest(page);
  expect(await jouer(page, { manieres }), "le test de départ va jusqu'à sa fin").toBe("fin");
}

// --- Le parent propose de nouveau le test de départ

async function refaireLeTestDepuisLEspaceParent(famille: Famille, page: Page): Promise<void> {
  await famille.allerDansLEspaceParent("tablette");
  const profil = page.getByTestId("profil-enfant").filter({ hasText: "Léa" });
  await profil.getByRole("button", { name: "Refaire le test de départ de Léa" }).click();
  await expect(proposition(page)).toBeVisible();
}

// --- Étant donné : la bibliothèque

Given(/^la bibliothèque de test du test de départ est servie$/, async ({ page }) => {
  etatDeLaLecon(page).injectees.push(...(LECONS_DU_TEST_DE_DEPART as LeconBrute[]));
  suivreLesLecturesDuResultat(page);
  await servirLaBibliothequeDuTestDeDepart(page);
});

Given(/^la bibliothèque ne peut pas être chargée$/, async ({ page }) => {
  await refuserLaBibliotheque(page);
});

// --- Étant donné : la proposition et le test commencé

Given(/^la proposition du test de départ est affichée pour Léa$/, async ({ page }) => {
  await ouvrirLaProposition(page);
});

Given(/^Léa a commencé le test de départ$/, async ({ page }) => {
  await commencerLeTest(page);
});

Given(/^Léa en est à la question de « ([^«»]+) » du test de départ$/, async ({ page }, titre: string) => {
  await commencerLeTest(page);
  expect(await jouer(page, { manieres: TOUTES_JUSTES, avant: titre })).toBe("avant");
});

Given(
  /^Léa a répondu au test de départ jusqu'à « ([^«»]+) »(?:, avec (?:des questions fausses|une question fausse) à (.+))?$/,
  async ({ page }, titre: string, liste: string | null | undefined) => {
    await commencerLeTest(page);
    const manieres = liste == null ? TOUTES_JUSTES : fausses(liste);
    expect(await jouer(page, { manieres, apres: titre })).toBe("apres");
  },
);

Given(/^Léa a quitté le test de départ après la question de « ([^«»]+) »$/, async ({ page }, titre: string) => {
  await commencerLeTest(page);
  expect(await jouer(page, { manieres: TOUTES_JUSTES, apres: titre })).toBe("apres");
  await quitterLeTest(page);
});

Given(/^Léa a fait le test de départ, (.+)$/, async ({ page }, deroule: string) => {
  await faireLeTest(page, lireLeDeroule(deroule));
});

Given(/^Léa a refait le test de départ, (.+)$/, async ({ famille, page }, deroule: string) => {
  await refaireLeTestDepuisLEspaceParent(famille, page);
  await accepterLaProposition(page);
  await questionOuFin(page);
  expect(await jouer(page, { manieres: lireLeDeroule(deroule) }), "le test de départ va jusqu'à sa fin").toBe("fin");
});

Given(/^Paul a proposé de nouveau le test de départ à Léa depuis l'espace parent$/, async ({ famille, page }) => {
  await refaireLeTestDepuisLEspaceParent(famille, page);
});

// --- Étant donné : données préparées en base

Given(/^Léa a déjà fait le test de départ$/, async ({ famille }) => {
  await ecrireUnResultatDeTestDeDepart(profilDe(famille, "Léa").id, []);
});

Given(/^(Léa|Tom) a pour leçons réussies au test de départ :$/, async ({ famille, page }, prenom: string, tableau: DataTable) => {
  const lecons = tableau.hashes().map((ligne) => leconDeTitre(page, String(ligne["leçon"])).id);
  await ecrireUnResultatDeTestDeDepart(profilDe(famille, prenom).id, lecons);
});

// Le serveur donne 1 étoile à partir de 4 erreurs, et une question de la bibliothèque de test n'offre que 2 mauvaises bulles
// (« non », « peut-être ») : la séance de 1 étoile ne peut pas se jouer. Le résultat qu'elle aurait enregistré est préparé en base.
Given(
  /^Léa a terminé une séance de la leçon « ([^«»]+) » avec (\d) étoiles?$/,
  { tags: "@issue-27" },
  async ({ famille, page }, titre: string, etoiles: string) => {
    await ecrireUnResultatDeLecon(profilDe(famille, "Léa").id, leconDeTitre(page, titre).id, Number(etoiles));
  },
);

// --- Quand : la proposition

When(/^Léa ouvre « Mon test de départ » depuis son accueil$/, async ({ page }) => {
  await surLAccueilDeLEnfant(page);
  await boutonMonTestDeDepart(page).click();
});

When(/^Léa accepte la proposition du test de départ(, au clavier seulement)?$/, async ({ page }, clavier: string | undefined) => {
  await accepterLaProposition(page, clavier != null);
});

When(/^Léa remet le test de départ à plus tard$/, async ({ page }) => {
  await boutonPlusTard(page).click();
});

async function quitterLeTest(page: Page): Promise<void> {
  await page.getByRole("banner").getByRole("button", { name: "Retour", exact: true }).click();
  await expect(recipient(page)).toHaveCount(0);
  await expect(accueilDeLEnfant(page)).toBeVisible();
}

When(/^Léa quitte le test de départ$/, async ({ page }) => {
  await quitterLeTest(page);
});

// --- Quand : le déroulé

When(/^Léa répond juste à toutes les questions du test de départ$/, async ({ page }) => {
  expect(await jouer(page, { manieres: TOUTES_JUSTES }), "le test de départ va jusqu'à sa fin").toBe("fin");
});

When(/^Léa répond juste à la question de « ([^«»]+) »$/, async ({ page }, titre: string) => {
  const enonce = await laQuestionPosee(page, titre);
  await repondreALaQuestion(page, "juste");
  await questionOuFin(page, enonce);
});

When(
  /^Léa se trompe(?: (\d+) fois)? à la question de « ([^«»]+) »(, puis donne la bonne réponse)?$/,
  async ({ page }, fois: string | undefined, titre: string, puisLaBonne: string | undefined) => {
    const enonce = await laQuestionPosee(page, titre);
    await avancerJusquAuxChoix(page);
    const reussiesAvant = await questionsReussies(page);
    etatDesChoix(page).reussiesAvant = reussiesAvant;
    for (let i = 0; i < Number(fois ?? 1); i++) await faireUneErreur(page);
    if (puisLaBonne == null) return;
    await donnerLaBonneReponse(page, reussiesAvant);
    await questionOuFin(page, enonce);
  },
);

When(
  /^Léa dit « Je ne sais pas » à la question de « ([^«»]+) »(, puis donne la bonne réponse)?$/,
  async ({ page }, titre: string, puisLaBonne: string | undefined) => {
    const enonce = await laQuestionPosee(page, titre);
    await avancerJusquAuxChoix(page);
    const reussiesAvant = await questionsReussies(page);
    etatDesChoix(page).reussiesAvant = reussiesAvant;
    await direJeNeSaisPas(page);
    if (puisLaBonne == null) return;
    await donnerLaBonneReponse(page, reussiesAvant);
    await questionOuFin(page, enonce);
  },
);

When(/^Léa choisit « Voir mon parcours »$/, async ({ page }) => {
  await finDuTest(page).getByRole("button", { name: "Voir mon parcours", exact: true }).click();
});

// --- Quand : le parent

When(/^Paul choisit « Refaire le test de départ » pour Léa$/, async ({ famille, page }) => {
  await refaireLeTestDepuisLEspaceParent(famille, page);
});

// --- Alors : la proposition

Then(/^la proposition du test de départ s'affiche pour (Léa|Tom)$/, async ({ page }, prenom: string) => {
  await expect(proposition(page)).toBeVisible();
  await expect(bulle(page)).toContainText(`Bonjour ${prenom} !`);
});

Then(/^Noisette dit, et l'écran affiche :$/, async ({ page }, texte: string) => {
  await expect(bulle(page)).toHaveText(normaliser(texte));
  const vocale = await page.evaluate(() => Reflect.get(window, "__faux") !== undefined);
  if (!vocale) return;
  const sansEspace = (t: string) => t.replace(/[\s,]+/g, "");
  await expect.poll(async () => sansEspace((await toutesLesParoles(page)).join("")).includes(sansEspace(entendu(texte)))).toBe(true);
});

Then(
  /^la proposition du test de départ propose « Oui, on y va ! » et « Plus tard »$/,
  async ({ page }) => {
    await expect(proposition(page).getByRole("button").filter({ hasNotText: "Réécouter" })).toHaveText(["Oui, on y va !", "Plus tard"]);
  },
);

// Tag @issue-27 : #28 et #29 ont leur propre étape de même texte (écran de la révision) ; un scénario qui porterait aussi leur tag serait ambigu.
Then(/^l'écran s'intitule « ([^«»]+) », avec « ([^«»]+) »$/, { tags: "@issue-27" }, async ({ page }, titre: string, sousTitre: string) => {
  await expect(page.getByRole("heading", { level: 2, name: titre, exact: true })).toBeVisible();
  await expect(page.getByTestId("sous-titre-du-test-de-depart")).toHaveText(sousTitre);
});

Then(/^« Oui, on y va ! » et « Plus tard » mesurent au moins 44 px de haut$/, async ({ page }) => {
  for (const [nom, bouton] of [["Oui, on y va !", boutonOui(page)], ["Plus tard", boutonPlusTard(page)]] as const) {
    const boite = await bouton.boundingBox();
    expect(boite, `bouton « ${nom} » visible`).not.toBeNull();
    expect(boite?.height ?? 0, `hauteur de « ${nom} »`).toBeGreaterThanOrEqual(44);
  }
});

// --- Alors : l'accueil de l'enfant

Then(
  /^l'accueil de Léa (propose|ne propose pas) « Mon test de départ »( sur le téléphone de Paul)?$/,
  async ({ famille, page, browser, baseURL }, verbe: string, telephone: string | undefined) => {
    const cible = telephone == null ? page : await accueilDeLeaSurLeTelephoneDePaul(famille, browser, baseURL);
    await verifierLeBoutonDeLAccueil(cible, verbe === "propose");
  },
);

// --- Alors : le déroulé

Then(/^la question de « ([^«»]+) » s'affiche$/, async ({ page }, titre: string) => {
  await finirLaParoleJusqua(page, { type: "question", texte: enonceDeLaQuestion(titre) });
  noterLaQuestion(page, titre);
});

Then(/^la question de « ([^«»]+) » reste posée$/, async ({ page }, titre: string) => {
  await expect(page.getByTestId("question")).toHaveText(enonceDeLaQuestion(titre));
  await expect(recipient(page)).toHaveAttribute("data-questions-reussies", String(etatDesChoix(page).reussiesAvant));
});

Then(
  /^Léa a eu, dans l'ordre, les questions des leçons :$/,
  async ({ page }, tableau: DataTable) => {
    const lignes = tableau.hashes();
    expect(partieDe(page).posees).toEqual(lignes.map((ligne) => String(ligne["leçon"])));
    const matieres: Readonly<Record<string, string>> = { "français": "francais", "maths": "maths" };
    for (const ligne of lignes) {
      const lecon = leconDeTitre(page, String(ligne["leçon"]));
      expect(lecon.matiere, `matière de « ${lecon.titre} »`).toBe(matieres[String(ligne["matière"])]);
      expect(lecon.niveau, `niveau de « ${lecon.titre} »`).toBe(String(ligne["niveau"]));
    }
  },
);

Then(
  /^aucune question de « ([^«»]+) »(?: ni de « ([^«»]+) »)?( n'est posée)?$/,
  async ({ page }, titre: string, autre: string | undefined, _nEstPosee: string | undefined) => {
    const jouees = partieDe(page).posees;
    for (const interdite of [titre, autre].filter((t): t is string => t != null)) {
      expect(jouees, `questions posées`).not.toContain(interdite);
      await expect(page.getByTestId("question").filter({ hasText: interdite })).toHaveCount(0);
    }
  },
);

// --- Alors : la fin du test de départ

Then(/^la fin du test de départ s'affiche$/, async ({ page }) => {
  await expect(finDuTest(page)).toBeVisible();
});

Then(/^la fin du test de départ propose seulement « Voir mon parcours »$/, async ({ page }) => {
  await expect(finDuTest(page)).toBeVisible();
  await expect(finDuTest(page).getByRole("button").filter({ hasNotText: "Réécouter" })).toHaveText(["Voir mon parcours"]);
});

Then(/^la fin du test de départ ne montre aucune étoile$/, async ({ page }) => {
  await expect(finDuTest(page)).toBeVisible();
  await expect(page.getByTestId("etoile")).toHaveCount(0);
  await expect(page.getByTestId("etoiles-gagnees")).toHaveCount(0);
  await expect(finDuTest(page)).not.toContainText(/★|étoile/i);
});

Then(/^le focus est sur « ([^«»]+) »$/, { tags: "@issue-27" }, async ({ page }, nom: string) => {
  await expect(finDuTest(page).getByRole("button", { name: nom, exact: true })).toBeFocused();
});

// --- Règle 9 : le serveur

type QuestionReelle = {
  readonly plan: { readonly leconId: string; readonly exercice: number; readonly rang: number };
  readonly choix: readonly string[];
  readonly bonne: string;
  readonly fausse: string;
};

function questionReelle(lecon: LeconBrute): QuestionReelle {
  const exercice = lecon.exercices.findIndex((e) => e.type === "bulles");
  const premiere = (lecon.exercices[exercice] as { questions: Array<{ choix: string[]; reponse: string }> }).questions[0];
  if (premiere === undefined) throw new Error(`La leçon « ${lecon.titre} » n'a aucune question à choix`);
  const fausse = premiere.choix.find((choix) => choix !== premiere.reponse);
  if (fausse === undefined) throw new Error(`La question de « ${lecon.titre} » n'a qu'un choix`);
  return { plan: { leconId: lecon.id, exercice, rang: 0 }, choix: premiere.choix, bonne: premiere.reponse, fausse };
}

function laLeconReelle(id: string): LeconBrute {
  const lecon = BIBLIOTHEQUE.find((candidate) => candidate.id === id);
  if (!lecon) throw new Error(`Leçon de la bibliothèque inconnue : ${id}`);
  return lecon;
}

type Reponses = ReadonlyArray<ReadonlyArray<{ choix: string }>>;

function corpsDuTest(enfant: string, questions: readonly QuestionReelle[], reponses: Reponses): object {
  return {
    test: crypto.randomUUID(),
    enfant,
    questions: questions.map(({ plan }) => plan),
    tirages: questions.map(({ choix }) => [[...choix]]),
    reponses,
    termineeLe: new Date().toISOString(),
  };
}

function uneSeuleQuestionJuste(enfant: string, leconId: string): object {
  const question = questionReelle(laLeconReelle(leconId));
  return corpsDuTest(enfant, [question], [[{ choix: question.bonne }]]);
}

function corpsIncoherent(enfant: string, cas: string): object {
  if (cas === "dont une question vient d'une leçon de CE1") {
    const ce1 = BIBLIOTHEQUE.find((l) => l.matiere === "francais" && l.niveau === "CE1" && l.exercices.some((e) => e.type === "bulles"));
    if (!ce1) throw new Error("Aucune leçon de CE1 à choix");
    const question = questionReelle(ce1);
    return corpsDuTest(enfant, [question], [[{ choix: question.bonne }]]);
  }
  if (cas === "qui continue après 3 questions fausses de suite") {
    const questions = ["fr-cp-sons-ou-on-an", "fr-cp-syllabes", "fr-cp-dictee-animaux", "fr-cp-categories"].map((id) =>
      questionReelle(laLeconReelle(id))
    );
    const reponses: Reponses = questions.map((q, rang) => rang < 3 ? [{ choix: q.fausse }, { choix: q.bonne }] : [{ choix: q.bonne }]);
    return corpsDuTest(enfant, questions, reponses);
  }
  if (cas === "dont une question ne finit pas par la bonne réponse") {
    const question = questionReelle(laLeconReelle("fr-cp-sons-ou-on-an"));
    return corpsDuTest(enfant, [question], [[{ choix: question.fausse }]]);
  }
  throw new Error(`Test de départ incohérent inconnu : « ${cas} »`);
}

const LECON_REELLE_DE_CP = "Les sons ou, on, an";

When(/^l'appareil envoie pour Léa un test de départ terminé (.+)$/, async ({ famille }, cas: string) => {
  const enfant = profilDe(famille, "Léa").id;
  const jeton = await jetonDe(famille, "Paul");
  const coherent = /^d'une seule question, juste, de la leçon « ([^«»]+) »$/.exec(cas);
  if (coherent) {
    const lecon = BIBLIOTHEQUE.find((l) => l.titre === coherent[1]);
    if (!lecon || lecon.titre !== LECON_REELLE_DE_CP) throw new Error(`Leçon réelle inconnue : « ${coherent[1]} »`);
    const reponse = await envoyerUnTestDeDepartTermine(jeton, uneSeuleQuestionJuste(enfant, lecon.id));
    expect(reponse.statut, `envoi accepté : ${reponse.message ?? ""}`).toBe(200);
    expect(reponse.enregistre, "le serveur a enregistré le test").toBe(true);
    partie(famille).reponse = reponse;
    return;
  }
  partie(famille).reponse = await envoyerUnTestDeDepartTermine(jeton, corpsIncoherent(enfant, cas));
});

Then(/^l'enregistrement est refusé$/, { tags: "@issue-27" }, async ({ famille }) => {
  const reponse = partie(famille).reponse;
  expect(reponse?.statut, "refus d'un test de départ incohérent").toBe(422);
  expect(reponse?.message).toBe("Ce test de départ n'a pas pu être vérifié.");
});

When(/^Claire envoie un test de départ terminé pour le profil enfant de Léa$/, async ({ famille }) => {
  const telephone = await famille.page("telephone");
  const jeton = (await famille.session(telephone))?.access_token;
  if (jeton === undefined) throw new Error("Claire n'est pas connectée sur le téléphone");
  const enfant = profilDe(famille, "Léa").id;
  const lecon = BIBLIOTHEQUE.find((l) => l.titre === LECON_REELLE_DE_CP);
  if (!lecon) throw new Error(`Leçon réelle inconnue : « ${LECON_REELLE_DE_CP} »`);
  partie(famille).reponse = await envoyerUnTestDeDepartTermine(jeton, uneSeuleQuestionJuste(enfant, lecon.id));
});

When(/^Claire demande le résultat du test de départ du profil enfant de Léa$/, async ({ famille }) => {
  const telephone = await famille.page("telephone");
  const jeton = (await famille.session(telephone))?.access_token;
  if (jeton === undefined) throw new Error("Claire n'est pas connectée sur le téléphone");
  partie(famille).lignesLues = await lireLeResultatDuTestEnRest(jeton, profilDe(famille, "Léa").id);
});
