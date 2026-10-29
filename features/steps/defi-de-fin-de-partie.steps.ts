import { type Browser, expect, type Locator, type Page } from "@playwright/test";
import { Jour } from "../../supabase/functions/_shared/apprentissage/domain/jour.ts";
import { defisDeLaMatiere } from "../../supabase/functions/_shared/apprentissage/domain/defis-de-la-matiere.ts";
import { parcoursDeLaMatiere } from "../../supabase/functions/_shared/apprentissage/domain/parcours.ts";
import { planDuDefi } from "../../supabase/functions/_shared/apprentissage/domain/plan-du-defi.ts";
import { Reponse, type ReponseDonnee, type ReponseEnNombre, type ReponseParChoix } from "../../supabase/functions/_shared/apprentissage/domain/reponse.ts";
import { SeanceDeDefi } from "../../supabase/functions/_shared/apprentissage/domain/seance-de-defi.ts";
import { tireurAuHasard } from "../../supabase/functions/_shared/apprentissage/domain/tireur.ts";
import { LeconsDuCatalogueJson } from "../../supabase/functions/_shared/apprentissage/infrastructure/lecons-du-catalogue-json.ts";
import { matiereDeCode, Niveau } from "../../supabase/functions/_shared/catalogue/domain/index.ts";
import { normaliserPourLaCle } from "../support/bibliotheque-des-revisions.ts";
import { deposerLaSession, ouvrirUneSessionSansEmail } from "../support/connexion-sans-email.ts";
import type { Famille } from "../support/famille.ts";
import { ecrireDesResultatsDeLecons } from "../support/supabase-test.ts";
import { BIBLIOTHEQUE, bulle, etat as etatDeLaLecon, type LeconBrute, toutesLesParoles } from "./etapes-puis-exercices.steps.ts";
import { attendreLaFinDeLaSeance, boutonContinuerApresLaReussite, partie } from "./etoiles-et-fin-de-seance.steps.ts";
import { avancerJusquAuxChoix, bulleDeChoix, etatDesChoix, textesDesChoixPossibles } from "./exercices-a-choix.steps.ts";
import { After, Before, Given, Then, When } from "./fixtures.ts";
import { preparerLesEtoiles } from "./parcours.steps.ts";
import { choisirLeaSur, estSurUnProfilReel, jouerAvecLeProfilReel } from "./profil-reel.ts";
import { choisirSonProfil, creerLeProfil, jetonDe, profilDe } from "./profils-enfants.steps.ts";
import { effetPuisParole, installerLesFauxDeLaStory97 } from "./retours-animes-et-sonores.steps.ts";
import { normaliser, terminerLaLecture } from "./voix.steps.ts";

// Story #100 : défi de fin de partie du parcours.
//
// La bibliothèque de test (identifiants « e2e-100- ») remplace celle de l'application dans le navigateur ; elle est servie comme
// celles de #28 et de #99. Le serveur, lui, ne connaît que la vraie bibliothèque : ce qu'il garderait d'un défi joué sur des leçons
// de test est préparé en base (clé service_role réservée à cette préparation), comme pour les étoiles. Un défi dont le scénario
// décrit le déroulé (sans erreur, en se trompant…) est joué par l'interface. Les envois « forgés » (défi incohérent, parent non
// rattaché) appellent la vraie fonction avec le jeton du parent et un défi construit par le domaine sur la vraie bibliothèque.

// --- La bibliothèque de test du défi

const SECTION_DE_TEST = "c2-francais-cp-identifier-les-mots-de-maniere-de-plus-en-plus-aisee";
const CITATION_DE_TEST = "Décoder et encoder de 25 à 30 CGP.";
const NOMBRE_DE_LECONS_DE_MATHS = 10;

type QuestionDeTest = { question: string; choix: string[]; reponse: string };

function leconDeTest(matiere: string, ordre: number, titre: string, exercices: Array<Record<string, unknown>>): LeconBrute {
  return {
    id: `e2e-100-${matiere}-ce1-${ordre}`,
    titre,
    matiere,
    niveau: "CE1",
    ordre,
    programme: { section: SECTION_DE_TEST, citation: CITATION_DE_TEST },
    lecon: [{ texte: `Voici la leçon « ${titre} ».`, exemples: [] }],
    exercices,
  };
}

function bullesDeTest(titre: string, questions: QuestionDeTest[]): Record<string, unknown> {
  return { type: "bulles", titre: `Bulles de « ${titre} »`, questions };
}

function additionsDe(n: number): QuestionDeTest[] {
  return [1, 2].map((k) => {
    const somme = n + k;
    return { question: `Combien font ${n} + ${k} ?`, choix: [String(somme), String(somme + 1), String(somme + 2)], reponse: String(somme) };
  });
}

const FLUENCE_DE_MATHS_2 = { type: "fluence", titre: "Calcul rapide", duree: 30, generateur: { op: "+", a: [1, 10], b: [1, 10] } };

const MATHS_DU_CE1: LeconBrute[] = Array.from({ length: NOMBRE_DE_LECONS_DE_MATHS }, (_, rang) => {
  const n = rang + 1;
  const titre = `Maths ${n}`;
  const exercices = [bullesDeTest(titre, additionsDe(n)), ...(n === 2 ? [FLUENCE_DE_MATHS_2] : [])];
  return leconDeTest("maths", n * 10, titre, exercices);
});

const SCIENCES_DU_CE1: LeconBrute[] = [
  leconDeTest("sciences", 10, "Les êtres vivants", [
    bullesDeTest("Les êtres vivants", [
      { question: "Qu'est-ce qui a besoin d'eau pour vivre ?", choix: ["une plante", "un caillou", "une chaise"], reponse: "une plante" },
      { question: "Quel animal vit dans l'eau ?", choix: ["un poisson", "un chat", "un lapin"], reponse: "un poisson" },
    ]),
  ]),
  leconDeTest("sciences", 20, "Les saisons", [
    bullesDeTest("Les saisons", [
      { question: "Quelle saison vient après l'hiver ?", choix: ["le printemps", "l'été", "l'automne"], reponse: "le printemps" },
      { question: "Quelle saison est la plus chaude ?", choix: ["l'été", "l'hiver", "le printemps"], reponse: "l'été" },
    ]),
  ]),
  leconDeTest("sciences", 30, "L'eau", [
    bullesDeTest("L'eau", [
      { question: "Que devient l'eau quand il gèle ?", choix: ["de la glace", "de la terre", "de l'herbe"], reponse: "de la glace" },
      { question: "Où trouve-t-on de l'eau ?", choix: ["dans la mer", "dans une brique", "dans un livre"], reponse: "dans la mer" },
    ]),
  ]),
];

const LECONS_DU_DEFI: readonly LeconBrute[] = [...SCIENCES_DU_CE1, ...MATHS_DU_CE1];

/** La page prend le pas sur le contexte ; la route du contexte sert les pages ouvertes à côté. */
async function servirLaBibliothequeDuDefi(page: Page): Promise<void> {
  const servir = (route: { fulfill(options: { json: unknown }): Promise<void> }) => route.fulfill({ json: LECONS_DU_DEFI });
  await page.context().route("**/bibliotheque.json", servir);
  await page.route("**/bibliotheque.json", servir);
}

function leconsDeTestDeLaMatiere(matiere: "maths" | "sciences", nombre: number) {
  return LECONS_DU_DEFI.filter((lecon) => lecon.matiere === matiere && lecon.niveau === "CE1")
    .sort((a, b) => a.ordre - b.ordre)
    .slice(0, nombre)
    .map((lecon) => ({ titre: lecon.titre, etoiles: 1 }));
}

function reponseDe(enonce: string): string {
  for (const lecon of LECONS_DU_DEFI) {
    for (const exercice of lecon.exercices) {
      const trouvee = ((exercice.questions ?? []) as QuestionDeTest[]).find((question) => question.question === enonce);
      if (trouvee) return trouvee.reponse;
    }
  }
  throw new Error(`Question inconnue de la bibliothèque de test du défi : « ${enonce} »`);
}

function leconDeLaQuestion(enonce: string): LeconBrute {
  const lecon = LECONS_DU_DEFI.find((candidate) =>
    candidate.exercices.some((exercice) => ((exercice.questions ?? []) as QuestionDeTest[]).some((question) => question.question === enonce))
  );
  if (!lecon) throw new Error(`Question inconnue de la bibliothèque de test du défi : « ${enonce} »`);
  return lecon;
}

function echapper(texte: string): string {
  return texte.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

// --- État du scénario

type Partie100 = { posees: string[]; parolesAvantDeQuitter: number };
const parties = new WeakMap<Page, Partie100>();

function partie100(page: Page): Partie100 {
  let courante = parties.get(page);
  if (!courante) {
    courante = { posees: [], parolesAvantDeQuitter: 0 };
    parties.set(page, courante);
  }
  return courante;
}

/** La page où Léa lit son parcours : la tablette, sauf « sur le téléphone de Marie ». */
const pagesDuParcours = new WeakMap<Famille, Page>();
const contextesOuverts = new WeakMap<Famille, Array<{ close(): Promise<void> }>>();

function pageDuParcours(famille: Famille, page: Page): Page {
  return pagesDuParcours.get(famille) ?? page;
}

Before({ tags: "@issue-100" }, async ({ page, $testInfo }) => {
  // Le vrai profil de Léa, les défis joués jusqu'à leur fin (10 questions) et les écrans de fin passent par le serveur.
  $testInfo.setTimeout(90_000);
  await page.addInitScript(installerLesFauxDeLaStory97, { echec: false, retenir: [] });
});

After({ tags: "@issue-100" }, async ({ famille }) => {
  for (const contexte of contextesOuverts.get(famille) ?? []) await contexte.close();
});

// --- Préparation en base (clé service_role, réservée à cela)

function variable(nom: string): string {
  const valeur = process.env[nom];
  if (!valeur) throw new Error(`Variable d'environnement absente : ${nom}`);
  return valeur;
}

function entetesServiceRole(): Record<string, string> {
  const cle = variable("SUPABASE_SERVICE_ROLE_KEY");
  return { apikey: cle, Authorization: `Bearer ${cle}`, "Content-Type": "application/json" };
}

function entetesDuParent(jeton: string): Record<string, string> {
  return { apikey: variable("SUPABASE_ANON_KEY"), Authorization: `Bearer ${jeton}`, "Content-Type": "application/json" };
}

function jourLocal(date: Date): string {
  const deux = (n: number) => String(n).padStart(2, "0");
  return `${date.getFullYear()}-${deux(date.getMonth() + 1)}-${deux(date.getDate())}`;
}

/** Ce que le serveur garde d'un défi relevé : une ligne par défi terminé. Part en cascade avec le profil. */
async function ecrireUnDefiTermine(profil: string, numero: number): Promise<void> {
  const maintenant = new Date();
  const reponse = await fetch(`${variable("SUPABASE_URL")}/rest/v1/defis_termines`, {
    method: "POST",
    headers: entetesServiceRole(),
    body: JSON.stringify({
      id: crypto.randomUUID(),
      profil,
      matiere: "maths",
      classe: "CE1",
      numero,
      termine_le: maintenant.toISOString(),
      jour: jourLocal(maintenant),
    }),
  });
  if (!reponse.ok) throw new Error(`defis_termines : ${reponse.status} ${await reponse.text()}`);
}

async function nombreDeLeconsDeTestReussies(profil: string): Promise<number> {
  const reponse = await fetch(
    `${variable("SUPABASE_URL")}/rest/v1/resultats_des_lecons?select=lecon&profil=eq.${encodeURIComponent(profil)}&lecon=like.${encodeURIComponent("e2e-100-*")}`,
    { headers: entetesServiceRole() },
  );
  if (!reponse.ok) throw new Error(`resultats_des_lecons : ${reponse.status} ${await reponse.text()}`);
  return ((await reponse.json()) as unknown[]).length;
}

// --- Les défis forgés pour le serveur, construits par le domaine sur la vraie bibliothèque

type ManiereDeForger = "complet" | "derniere-fausse" | "question-etrangere";

function enReponseEnvoyee(reponse: ReponseDonnee): Record<string, unknown> {
  switch (reponse.genre) {
    case "choix":
      return { choix: reponse.texte };
    case "nombre":
      return { nombre: reponse.valeur };
    case "jeNeSaisPas":
      return { jeNeSaisPas: true };
    case "motEcrit":
      return { motEcrit: reponse.lettres };
    case "placement":
      return { placement: reponse.groupe === undefined ? { etiquette: reponse.etiquette } : { etiquette: reponse.etiquette, groupe: reponse.groupe } };
  }
}

function cleEtrangereAuDefi(): string {
  const lecon = BIBLIOTHEQUE.find((candidate) => candidate.id === "ma-ce1-doubles-moities");
  const bulles = lecon?.exercices.find((exercice) => exercice.type === "bulles") as { questions: QuestionDeTest[] } | undefined;
  const premiere = bulles?.questions[0];
  if (!premiere) throw new Error("Question de la partie suivante introuvable dans la vraie bibliothèque");
  return `b:${normaliserPourLaCle(premiere.question + premiere.reponse)}`;
}

/** Le défi 1 des maths du CE1 de la vraie bibliothèque, joué en entier par le domaine (« Je ne sais pas », puis la bonne réponse). */
async function forgerUnDefiTermine(enfant: string, maniere: ManiereDeForger): Promise<Record<string, unknown>> {
  const lecons = await new LeconsDuCatalogueJson(BIBLIOTHEQUE).toutes();
  const niveau = Niveau.de("CE1");
  const maths = matiereDeCode("maths");
  const parcours = parcoursDeLaMatiere({ lecons, niveau, meilleuresEtoiles: new Map() }, maths);
  const defi = defisDeLaMatiere(parcours, maths, niveau).find((candidat) => candidat.numero === 1);
  if (!defi) throw new Error("Le défi 1 des maths du CE1 n'existe pas dans la vraie bibliothèque");
  const hasard = { entre0et1: () => Math.random() };
  const seance = SeanceDeDefi.commencer({
    id: crypto.randomUUID(),
    enfant,
    defi,
    plan: planDuDefi(defi, lecons, hasard),
    lecons,
    tireurDe: () => tireurAuHasard(hasard),
    niveau,
  });
  const essayer = (reponse: ReponseParChoix | ReponseEnNombre) => {
    try {
      return seance.repondre(reponse);
    } catch {
      return "incompatible";
    }
  };
  while (!seance.estFinie()) {
    const { bonneReponse } = seance.direJeNeSaisPas();
    if (essayer(Reponse.choix(bonneReponse)) !== "juste" && essayer(Reponse.nombre(Number(bonneReponse))) !== "juste") {
      throw new Error(`Réponse « ${bonneReponse} » refusée par le domaine`);
    }
  }
  const maintenant = new Date(Date.now() - 2000);
  seance.terminer(maintenant, Jour.de(jourLocal(maintenant)));
  const envoi = seance.aEnregistrer();
  const questions = envoi.questions.map(({ valeur }) => valeur);
  const reponses = envoi.reponses.map((donnees) => donnees.map(enReponseEnvoyee));
  if (maniere === "question-etrangere") questions[0] = cleEtrangereAuDefi();
  if (maniere === "derniere-fausse") {
    const derniere = reponses[reponses.length - 1] ?? [];
    const juste = derniere[derniere.length - 1] ?? {};
    const tirage = envoi.tirages[envoi.tirages.length - 1] ?? [];
    const fausse = typeof juste.nombre === "number"
      ? { nombre: juste.nombre + 1 }
      : { choix: tirage.find((choix) => choix !== juste.choix) ?? "?" };
    derniere.splice(derniere.length - 1, 1, fausse);
  }
  return {
    id: envoi.id,
    enfant: envoi.enfant,
    defi: { matiere: envoi.defi.matiere.code, niveau: envoi.defi.niveau.valeur, numero: envoi.defi.numero },
    questions,
    tirages: envoi.tirages,
    reponses,
    termineeLe: envoi.termineeLe.toISOString(),
    jour: envoi.jour,
  };
}

async function envoyerUnDefi(jeton: string, corps: object): Promise<{ statut: number; message: string | undefined }> {
  const reponse = await fetch(`${variable("SUPABASE_URL")}/functions/v1/terminer-le-defi`, {
    method: "POST",
    headers: entetesDuParent(jeton),
    body: JSON.stringify(corps),
  });
  const lu = (await reponse.json().catch(() => ({}))) as { error?: { message?: string } };
  return { statut: reponse.status, message: lu.error?.message };
}

async function jetonDeClaire(famille: Famille): Promise<string> {
  const jeton = (await famille.session(await famille.page("telephone")))?.access_token;
  if (jeton === undefined) throw new Error("Claire n'est pas connectée sur le téléphone");
  return jeton;
}

// --- Le parcours de maths, le repère du défi

const dessin = (page: Page): Locator => page.getByTestId("dessin-du-parcours");
const repere = (page: Page): Locator => page.getByTestId("repere-du-defi");
const jeNeSaisPas = (page: Page): Locator => page.getByTestId("je-ne-sais-pas");
const ecranDuDefi = (page: Page): Locator => page.getByTestId("ecran-du-defi");
const finDuDefi = (page: Page): Locator => page.getByTestId("fin-du-defi");

async function ouvrirLeParcoursDeMaths(page: Page, enfant = "Léa"): Promise<void> {
  const titre = page.getByRole("heading", { level: 2, name: "Mon parcours", exact: true });
  if (!(await titre.isVisible())) {
    const bouton = page.getByRole("button", { name: "Mon parcours", exact: true });
    if (!(await bouton.isVisible())) await choisirSonProfil(page, enfant);
    await bouton.click();
    await expect(titre).toBeVisible();
  }
  await expect(page.getByText("Chargement du parcours")).toHaveCount(0, { timeout: 25_000 });
  const onglet = page.getByRole("tab", { name: "Maths", exact: true });
  if ((await onglet.getAttribute("aria-selected")) !== "true") await onglet.click();
  await expect(onglet).toHaveAttribute("aria-selected", "true");
  await expect(dessin(page).getByTestId("lecon-du-parcours").first()).toBeVisible();
}

async function releverLeDefi(page: Page): Promise<void> {
  await page.getByRole("button", { name: "Relever le défi", exact: true }).click();
  await expect(ecranDuDefi(page)).toBeVisible();
}

async function commencerLeDefi(page: Page): Promise<void> {
  await ouvrirLeParcoursDeMaths(page);
  await releverLeDefi(page);
}

async function laLeconAvantLeRepere(cible: Locator): Promise<string | null> {
  return await cible.evaluate((element) =>
    element.closest("li")?.previousElementSibling?.querySelector('[data-testid="place-de-la-lecon"]')?.textContent ?? null
  );
}

async function laLeconApresLeRepere(cible: Locator): Promise<string | null> {
  return await cible.evaluate((element) =>
    element.closest("li")?.nextElementSibling?.querySelector('[data-testid="place-de-la-lecon"]')?.textContent ?? null
  );
}

function repereDuDefi(page: Page, numero: string): Locator {
  return repere(page).and(page.locator(`[data-numero="${numero}"]`));
}

async function verifierLeRepere(page: Page, numero: string, genre: "aVenir" | "ouvert" | "releve", nom: string): Promise<Locator> {
  const cible = repereDuDefi(page, numero);
  await expect(cible).toHaveCount(1, { timeout: 20_000 });
  await expect(cible).toHaveAttribute("data-etat", genre);
  await expect(cible).toHaveAccessibleName(nom);
  return cible;
}

// --- Jouer un défi, comme un enfant

type Maniere = "juste" | "erreur" | "jeNeSaisPas";
type Deroule = (enonce: string) => Maniere;

const TOUT_JUSTE: Deroule = () => "juste";

async function enonceAffiche(page: Page): Promise<string | null> {
  const question = page.getByTestId("question");
  if ((await question.count()) === 0) return null;
  return normaliser((await question.first().textContent()) ?? "");
}

type Fin = { readonly fin: true } | { readonly fin: false; readonly enonce: string };

async function questionOuFin(page: Page, apres?: string): Promise<Fin> {
  let trouvee: Fin | undefined;
  await expect.poll(async () => {
    if (await finDuDefi(page).getByRole("button", { name: "Accueil", exact: true }).isVisible()) {
      trouvee = { fin: true };
      return true;
    }
    const enonce = await enonceAffiche(page);
    if (enonce !== null && enonce !== apres) {
      trouvee = { fin: false, enonce };
      return true;
    }
    if (await boutonContinuerApresLaReussite(page).isVisible()) await boutonContinuerApresLaReussite(page).click();
    await terminerLaLecture(page);
    return false;
  }, { intervals: [100], timeout: 20_000 }).toBe(true);
  if (trouvee === undefined) throw new Error("Ni question ni fin du défi");
  return trouvee;
}

async function mauvaiseReponse(page: Page, bonne: string): Promise<void> {
  const fausse = (await textesDesChoixPossibles(page)).find((texte) => texte !== bonne);
  if (fausse === undefined) throw new Error("Aucun mauvais choix possible");
  const touchee = bulleDeChoix(page, fausse);
  await touchee.click();
  await expect(touchee).toHaveAttribute("aria-disabled", "true");
}

async function repondreALaQuestion(page: Page, enonce: string, maniere: Maniere): Promise<void> {
  const bonne = reponseDe(enonce);
  await avancerJusquAuxChoix(page);
  if (maniere === "erreur") await mauvaiseReponse(page, bonne);
  if (maniere === "jeNeSaisPas") {
    await jeNeSaisPas(page).click();
    await expect(jeNeSaisPas(page)).toHaveCount(0);
  }
  await bulleDeChoix(page, bonne).click();
}

/** Joue le défi ouvert jusqu'à sa fin, ou jusqu'à la question `arret` (posée, pas encore répondue) ; rend l'ordre des questions posées. */
async function jouerLeDefi(page: Page, deroule: Deroule, arret?: { nombre?: number; question?: string }): Promise<void> {
  const posees = partie100(page).posees;
  posees.length = 0;
  let apres: string | undefined;
  for (let i = 0; i < 12; i++) {
    const courante = await questionOuFin(page, apres);
    if (courante.fin) return;
    posees.push(courante.enonce);
    if (arret?.question === courante.enonce || (arret?.nombre !== undefined && i === arret.nombre)) {
      etatDeLaLecon(page).courante = leconDeLaQuestion(courante.enonce);
      etatDesChoix(page).exerciceUnique = undefined;
      await avancerJusquAuxChoix(page);
      return;
    }
    await repondreALaQuestion(page, courante.enonce, deroule(courante.enonce));
    apres = courante.enonce;
  }
  throw new Error("Le défi ne se termine pas");
}

function derouleDe(texte: string): Deroule {
  if (texte === "sans erreur") return TOUT_JUSTE;
  if (texte === "en se trompant une fois à chaque question") return () => "erreur";
  const erreur = /^en se trompant à « ([^«»]+) »$/.exec(texte);
  if (erreur) return (question) => (question === erreur[1] ? "erreur" : "juste");
  const jns = /^en disant « Je ne sais pas » à « ([^«»]+) »$/.exec(texte);
  if (jns) return (question) => (question === jns[1] ? "jeNeSaisPas" : "juste");
  throw new Error(`Déroulé du défi inconnu : « ${texte} »`);
}

async function revenirAuParcours(page: Page): Promise<void> {
  await finDuDefi(page).getByRole("button", { name: "Mon parcours", exact: true }).click();
  await expect(dessin(page)).toBeVisible();
}

// --- Étant donné : le contexte

Given(/^la bibliothèque de test du défi est servie$/, async ({ famille, monde, page }) => {
  etatDeLaLecon(page).injectees.push(...LECONS_DU_DEFI);
  await servirLaBibliothequeDuDefi(page);
  if (!estSurUnProfilReel(page)) await jouerAvecLeProfilReel(famille, monde, page);
});

Given(/^Tom a un profil enfant préparé de niveau (\S+)$/, { tags: "@issue-100" }, async ({ famille }, niveau: string) => {
  await creerLeProfil(famille, "Paul", { prenom: "Tom", niveau, libelleUnivers: "Animaux de la forêt" });
});

// --- Étant donné : la progression

Given(/^Léa a réussi les (\d+) premières leçons de sciences du CE1$/, async ({ famille, page }, nombre: string) => {
  await preparerLesEtoiles(famille, page, "Léa", leconsDeTestDeLaMatiere("sciences", Number(nombre)));
});

Given(/^Tom a réussi les (\d+) premières leçons de maths du CE1$/, async ({ famille, page }, nombre: string) => {
  await preparerLesEtoiles(famille, page, "Tom", leconsDeTestDeLaMatiere("maths", Number(nombre)));
});

Given(
  /^Léa a réussi « Maths (\d+) », « Maths (\d+) », « Maths (\d+) » et « Maths (\d+) »$/,
  async ({ famille, page }, a: string, b: string, c: string, d: string) => {
    await preparerLesEtoiles(famille, page, "Léa", [a, b, c, d].map((n) => ({ titre: `Maths ${n}`, etoiles: 1 })));
  },
);

Given(/^Léa n'a pas encore relevé le défi 1$/, async ({ famille, page }) => {
  await expect(repereDuDefi(pageDuParcours(famille, page), "1")).toHaveCount(0);
});

Given(/^Léa a relevé le défi 1 de maths(?:, (.+))?$/, async ({ famille, page }, deroule: string | undefined) => {
  if (deroule == null) return await ecrireUnDefiTermine(profilDe(famille, "Léa").id, 1);
  await commencerLeDefi(page);
  await jouerLeDefi(page, derouleDe(deroule));
  await revenirAuParcours(page);
});

Given(/^Léa a relevé le défi 1 de maths sur la tablette$/, async ({ famille }) => {
  await ecrireUnDefiTermine(profilDe(famille, "Léa").id, 1);
});

Given(/^Léa a relevé deux fois le défi 1 de maths$/, async ({ famille }) => {
  await ecrireUnDefiTermine(profilDe(famille, "Léa").id, 1);
  await ecrireUnDefiTermine(profilDe(famille, "Léa").id, 1);
});

// --- Étant donné : un défi en cours

Given(/^Léa a commencé le défi 1 de maths$/, async ({ page }) => {
  await commencerLeDefi(page);
});

// Rejouer : le repère d'un défi relevé doit proposer de le relever de nouveau (100.9).
Given(/^Léa a commencé de nouveau le défi 1 de maths$/, async ({ page }) => {
  await ouvrirLeParcoursDeMaths(page);
  const cible = await verifierLeRepere(page, "1", "releve", "Défi 1 : relevé");
  await expect(cible.getByRole("button"), "le repère d'un défi relevé propose de le rejouer").toHaveCount(1);
  await releverLeDefi(page);
});

Given(/^Léa a répondu juste à (\d+) questions du défi 1 de maths$/, async ({ page }, nombre: string) => {
  await commencerLeDefi(page);
  await jouerLeDefi(page, TOUT_JUSTE, { nombre: Number(nombre) });
});

Given(/^Léa en est à la question « ([^«»]+) » du défi 1 de maths$/, async ({ page }, question: string) => {
  await commencerLeDefi(page);
  await jouerLeDefi(page, TOUT_JUSTE, { question });
});

// --- Quand

When(/^Léa relève le défi 1 depuis son parcours$/, async ({ page }) => {
  await commencerLeDefi(page);
});

When(/^Tom choisit « Maths » dans son parcours$/, async ({ page }) => {
  // Léa jouait : Tom se choisit dans « Qui joue ? » avant d'ouvrir son parcours.
  await choisirSonProfil(page, "Tom");
  await ouvrirLeParcoursDeMaths(page, "Tom");
});

When(/^Léa répond juste à toutes les questions du défi$/, async ({ page }) => {
  await jouerLeDefi(page, TOUT_JUSTE);
});

When(/^Léa répond au défi, (sans erreur|en se trompant une fois à chaque question)$/, async ({ page }, deroule: string) => {
  await jouerLeDefi(page, derouleDe(deroule));
});

When(/^Léa quitte le défi$/, async ({ page }) => {
  partie100(page).parolesAvantDeQuitter = (await toutesLesParoles(page)).length;
  await page.getByTestId("quitter-le-defi").click();
  await expect(ecranDuDefi(page)).toHaveCount(0);
});

async function telephoneDeLParent(famille: Famille, browser: Browser, baseURL: string | undefined, parent: "Paul" | "Marie"): Promise<Page> {
  const telephone = await famille.page("telephone");
  const adresse = famille.normalisee(famille.adresseDe(parent));
  const session = await famille.session(telephone);
  let cible = telephone;
  if (session === null) {
    await famille.connecterSansEmail("telephone", parent);
  } else if (session.user.email !== adresse) {
    const contexte = await browser.newContext({ baseURL: baseURL ?? "http://localhost:5173", viewport: { width: 360, height: 740 }, hasTouch: true });
    contextesOuverts.set(famille, [...(contextesOuverts.get(famille) ?? []), contexte]);
    cible = await contexte.newPage();
    await deposerLaSession(cible, await ouvrirUneSessionSansEmail(adresse));
  }
  await servirLaBibliothequeDuDefi(cible);
  await choisirLeaSur(cible);
  return cible;
}

When(/^Léa ouvre le parcours de maths sur le téléphone de Marie$/, async ({ famille, browser, baseURL }) => {
  const telephone = await telephoneDeLParent(famille, browser, baseURL, "Marie");
  pagesDuParcours.set(famille, telephone);
  await ouvrirLeParcoursDeMaths(telephone);
});

When(/^l'appareil envoie pour Léa un défi 1 de maths terminé (.+)$/, async ({ famille }, cas: string) => {
  const profil = profilDe(famille, "Léa");
  const reussies = await nombreDeLeconsDeTestReussies(profil.id);
  // Le serveur ne connaît que la vraie bibliothèque : les leçons réussies sont posées sur les premières leçons de maths du CE1.
  const reelles = BIBLIOTHEQUE.filter((lecon) => lecon.matiere === "maths" && lecon.niveau === "CE1").sort((a, b) => a.ordre - b.ordre);
  await ecrireDesResultatsDeLecons(profil.id, reelles.slice(0, reussies).map((lecon) => ({ lecon: lecon.id, meilleuresEtoiles: 1 })));
  const maniere: ManiereDeForger = cas.startsWith("avec une question de") ? "question-etrangere"
    : cas.startsWith("dont une question ne finit pas") ? "derniere-fausse"
    : "complet";
  partie(famille).reponse = await envoyerUnDefi(await jetonDe(famille, "Paul"), await forgerUnDefiTermine(profil.id, maniere));
});

When(/^Claire demande les défis relevés du profil enfant de Léa$/, async ({ famille }) => {
  const reponse = await fetch(
    `${variable("SUPABASE_URL")}/rest/v1/defis_termines?select=*&profil=eq.${encodeURIComponent(profilDe(famille, "Léa").id)}`,
    { headers: entetesDuParent(await jetonDeClaire(famille)) },
  );
  partie(famille).lignesLues = { statut: reponse.status, lignes: reponse.ok ? ((await reponse.json()) as Record<string, unknown>[]) : [] };
});

When(/^Claire envoie un défi 1 de maths terminé pour le profil enfant de Léa$/, async ({ famille }) => {
  partie(famille).reponse = await envoyerUnDefi(await jetonDeClaire(famille), await forgerUnDefiTermine(profilDe(famille, "Léa").id, "complet"));
});

// --- Alors : le repère du défi sur « Mon parcours »

Then(
  /^le dessin du parcours montre le repère « Défi (\d+) » à venir, après la leçon (\d+), avec « (Encore \d+ leçons? pour ouvrir le défi) »$/,
  async ({ famille, page }, numero: string, place: string, texte: string) => {
    const cible = pageDuParcours(famille, page);
    const reste = /\d+/.exec(texte)?.[0] ?? "";
    const leconsRestantes = `encore ${reste} leçon${Number(reste) > 1 ? "s" : ""} pour ouvrir le défi`;
    const repereDuDefi = await verifierLeRepere(cible, numero, "aVenir", `Défi ${numero} : à venir, ${leconsRestantes}`);
    await expect(repereDuDefi).toContainText(texte);
    expect(await laLeconAvantLeRepere(repereDuDefi), "leçon juste avant le repère").toBe(`Leçon ${place}`);
  },
);

Then(/^le repère « Défi (\d+) » n'a pas de cadenas et ne propose pas « Relever le défi »$/, async ({ famille, page }, numero: string) => {
  const cible = repereDuDefi(pageDuParcours(famille, page), numero);
  await expect(cible).toHaveAttribute("data-etat", "aVenir");
  await expect(cible.getByRole("button")).toHaveCount(0);
  await expect(cible).not.toContainText("Relever le défi");
  await expect(cible.locator('[data-testid*="cadenas" i], [aria-label*="cadenas" i], [aria-label*="verrouill" i]')).toHaveCount(0);
  expect(await cible.textContent()).not.toMatch(/🔒|🔐|cadenas|verrouill/i);
  expect(await cible.getAttribute("aria-disabled")).toBeNull();
});

Then(/^le dessin du parcours montre le repère « Défi (\d+) » ouvert, avec « Relever le défi »$/, async ({ famille, page }, numero: string) => {
  const cible = await verifierLeRepere(pageDuParcours(famille, page), numero, "ouvert", `Défi ${numero} : ouvert`);
  await expect(cible.getByRole("button", { name: "Relever le défi", exact: true })).toBeVisible();
});

Then(
  /^le dessin du parcours montre le repère « Défi (\d+) » ouvert, entre la leçon (\d+) et la leçon (\d+)$/,
  async ({ famille, page }, numero: string, avant: string, apres: string) => {
    const cible = await verifierLeRepere(pageDuParcours(famille, page), numero, "ouvert", `Défi ${numero} : ouvert`);
    expect(await laLeconAvantLeRepere(cible), "leçon juste avant le repère").toBe(`Leçon ${avant}`);
    expect(await laLeconApresLeRepere(cible), "leçon juste après le repère").toBe(`Leçon ${apres}`);
  },
);

Then(/^le dessin du parcours montre le repère « Défi (\d+) » relevé, avec « Défi relevé »$/, async ({ famille, page }, numero: string) => {
  const cible = await verifierLeRepere(pageDuParcours(famille, page), numero, "releve", `Défi ${numero} : relevé`);
  await expect(cible).toContainText("Défi relevé");
});

Then(/^le dessin du parcours montre un seul repère de défi, « Défi (\d+) », après la leçon (\d+)$/, async ({ famille, page }, numero: string, place: string) => {
  const cible = pageDuParcours(famille, page);
  await expect(dessin(cible).getByTestId("lecon-du-parcours").first()).toBeVisible();
  await expect(repere(cible)).toHaveCount(1);
  const unique = repereDuDefi(cible, numero);
  await expect(unique).toHaveCount(1);
  expect(await laLeconAvantLeRepere(unique), "leçon juste avant le repère").toBe(`Leçon ${place}`);
});

Then(/^le dessin du parcours montre aucun repère de défi$/, async ({ famille, page }) => {
  const cible = pageDuParcours(famille, page);
  await expect(dessin(cible).getByTestId("lecon-du-parcours").first()).toBeVisible();
  await expect(repere(cible)).toHaveCount(0);
});

Then(/^aucun repère de défi n'apparaît après la leçon « ([^«»]+) »$/, async ({ famille, page }, titre: string) => {
  const cible = pageDuParcours(famille, page);
  const lecon = dessin(cible).getByRole("button", { name: new RegExp(`^${echapper(titre)} : `) });
  await expect(lecon).toHaveCount(1);
  const unRepereSuit = await lecon.evaluate(
    (element) => element.closest("li")?.nextElementSibling?.querySelector('[data-testid="repere-du-defi"]') != null,
  );
  expect(unRepereSuit, `repère de défi juste après « ${titre} »`).toBe(false);
});

Then(/^le repère « Défi (\d+) » mesure au moins 44 px de haut$/, async ({ famille, page }, numero: string) => {
  const cible = repereDuDefi(pageDuParcours(famille, page), numero);
  await expect(cible).toBeVisible();
  const boite = await cible.boundingBox();
  expect(boite, "repère visible").not.toBeNull();
  expect(boite?.height ?? 0).toBeGreaterThanOrEqual(44);
});

Then(/^Noisette se tient sur la leçon (\d+) « ([^«»]+) », marquée « À toi ! »$/, async ({ famille, page }, place: string, titre: string) => {
  const cible = pageDuParcours(famille, page);
  const guide = cible.getByTestId("guide-du-dessin");
  await expect(guide).toHaveAttribute("data-marche", /^(aucune|terminee)$/, { timeout: 10_000 });
  await expect(guide).toHaveAttribute("data-place", String(place));
  await expect(guide.getByTestId("personnage-guide")).toHaveAttribute("data-personnage-guide", "Noisette");
  const lecon = dessin(cible).getByRole("button", { name: `${titre} : à toi !`, exact: true });
  await expect(lecon).toHaveCount(1);
  await expect(lecon.getByTestId("etat-de-la-lecon")).toHaveText("À toi !");
  await expect(lecon.getByTestId("place-de-la-lecon")).toHaveText(`Leçon ${place}`);
});

// --- Alors : les lecteurs d'écran

Then(/^les lecteurs d'écran annoncent, après « ([^«»]+) », la ligne « ([^«»]+) »$/, async ({ famille, page }, avant: string, ligne: string) => {
  const cible = pageDuParcours(famille, page);
  const lecon = dessin(cible).getByRole("button", { name: avant, exact: true });
  await expect(lecon).toHaveCount(1);
  expect(await dessin(cible).getByRole("list").evaluate((liste) => liste.tagName), "liste ordonnée").toBe("OL");
  const suivante = await lecon.evaluate(
    (element) => element.closest("li")?.nextElementSibling?.querySelector('[role="group"]')?.getAttribute("aria-label") ?? null,
  );
  expect(suivante, "ligne qui suit la leçon dans la liste").toBe(ligne);
  await expect(cible.getByRole("group", { name: ligne, exact: true })).toHaveCount(1);
});

Then(/^les lecteurs d'écran n'annoncent aucune ligne de défi après « ([^«»]+) »$/, async ({ famille, page }, derniere: string) => {
  const cible = pageDuParcours(famille, page);
  const lecon = dessin(cible).getByRole("button", { name: derniere, exact: true });
  await expect(lecon).toHaveCount(1);
  const suivante = await lecon.evaluate((element) => element.closest("li")?.nextElementSibling !== null);
  expect(suivante, "ligne juste après la dernière leçon").toBe(false);
});

// --- Alors : la fin de la séance

Then(/^la fin de la séance annonce « Le défi (\d+) est ouvert ! »$/, { tags: "@issue-100" }, async ({ page }, numero: string) => {
  await attendreLaFinDeLaSeance(page);
  const annonce = page.getByTestId("annonce-du-defi-ouvert");
  await expect(annonce).toHaveText(`Le défi ${numero} est ouvert !`, { timeout: 20_000 });
  await expect(annonce).toHaveAttribute("role", "status");
});

Then(/^Noisette dit « ([^«»]+) »$/, { tags: "@issue-100" }, async ({ page }, texte: string) => {
  const voulu = normaliser(texte);
  await expect.poll(async () => {
    const dit = normaliser((await bulle(page).textContent().catch(() => null)) ?? "");
    if (dit === voulu || dit.endsWith(` ${voulu}`)) return true;
    // La phrase de fin d'une séance vient après les paroles qui la précèdent : on les laisse finir, jamais la consigne d'un début de défi.
    if ((await bulle(page).getAttribute("data-nature").catch(() => null)) !== "consigne") await terminerLaLecture(page);
    return false;
  }, { intervals: [100], timeout: 20_000, message: `Noisette dit « ${texte} »` }).toBe(true);
});

Then(/^la fin de la séance propose (« .+ ») et (« [^«»]+ »)$/, { tags: "@issue-100" }, async ({ page }, premier: string, second: string) => {
  const noms = [...premier.matchAll(/« ([^«»]+) »/g)].map((m) => m[1] as string);
  noms.push(second.slice(2, -2));
  const fin = page.getByTestId("fin-de-seance");
  for (const nom of noms) await expect(fin.getByRole("button", { name: nom, exact: true })).toHaveCount(1, { timeout: 20_000 });
});

Then(/^aucun défi ne commence sans que Léa le choisisse$/, async ({ page }) => {
  await expect(page.getByTestId("fin-de-seance")).toBeVisible();
  await expect(ecranDuDefi(page)).toHaveCount(0);
  expect(new URL(page.url()).pathname).not.toBe("/defi");
});

Then(/^aucune annonce de défi ouvert n'apparaît à la fin de la séance$/, async ({ page }) => {
  await attendreLaFinDeLaSeance(page);
  // Le personnage guide ne dit sa phrase de fin qu'une fois décidé s'il y a un défi à proposer : on l'attend.
  await expect(bulle(page)).toHaveAttribute("data-nature", "felicitation", { timeout: 20_000 });
  const fin = page.getByTestId("fin-de-seance");
  await expect(page.getByTestId("annonce-du-defi-ouvert")).toBeEmpty();
  await expect(fin.getByRole("button", { name: "Relever le défi", exact: true })).toHaveCount(0);
});

// --- Alors : pendant le défi

Then(/^l'écran s'intitule « ([^«»]+) », avec « ([^«»]+) »$/, { tags: "@issue-100" }, async ({ page }, titre: string, sousTitre: string) => {
  await expect(page.getByRole("heading", { level: 2, name: titre, exact: true })).toBeVisible();
  await expect(page.getByTestId("sous-titre-du-defi")).toHaveText(sousTitre);
});

Then(/^l'écran ne montre ni vie, ni temps qui passe, ni nombre d'erreurs$/, async ({ page }) => {
  await expect(ecranDuDefi(page)).toBeVisible();
  await expect(ecranDuDefi(page).locator('[data-testid*="vie" i], [data-testid*="chrono" i], [data-testid*="minuteur" i], [data-testid*="erreur" i], [role="timer"]')).toHaveCount(0);
  // Le texte de l'écran, sans la bulle du personnage guide (« Prends ton temps… »).
  const texte = await ecranDuDefi(page).evaluate((ecran) => {
    const copie = ecran.cloneNode(true) as HTMLElement;
    copie.querySelectorAll('[data-testid="parole"]').forEach((parole) => parole.remove());
    return copie.textContent ?? "";
  });
  expect(texte).not.toMatch(/\bvies?\b|♥|❤|erreurs?|chrono|minuteur|secondes?|\d+\s?s\b/i);
});

Then(
  /^Léa a eu 10 questions, 2 de chacune des leçons « Maths (\d+) » à « Maths (\d+) », sans suivre l'ordre des leçons$/,
  async ({ page }, premiere: string, derniere: string) => {
    const posees = partie100(page).posees;
    expect(posees, "questions posées").toHaveLength(10);
    const numeros = posees.map((enonce) => Number(/^Maths (\d+)$/.exec(leconDeLaQuestion(enonce).titre)?.[1]));
    for (let n = Number(premiere); n <= Number(derniere); n++) {
      expect(numeros.filter((numero) => numero === n), `questions de « Maths ${n} »`).toHaveLength(2);
    }
    const dansLOrdre = numeros.every((numero, rang) => rang === 0 || (numeros[rang - 1] as number) <= numero);
    expect(dansLOrdre, `ordre des leçons des questions : ${numeros.join(", ")}`).toBe(false);
  },
);

Then(/^aucune question des leçons « Maths (\d+) » à « Maths (\d+) »$/, async ({ page }, premiere: string, derniere: string) => {
  const posees = partie100(page).posees;
  expect(posees.length).toBeGreaterThan(0);
  for (const enonce of posees) {
    const numero = Number(/^Maths (\d+)$/.exec(leconDeLaQuestion(enonce).titre)?.[1]);
    expect(numero < Number(premiere) || numero > Number(derniere), `« ${enonce} » vient de « Maths ${numero} »`).toBe(true);
  }
});

Then(/^aucun calcul en temps limité$/, async ({ page }) => {
  const posees = partie100(page).posees;
  expect(posees.length).toBeGreaterThan(0);
  for (const enonce of posees) expect(enonce, "question du défi").toMatch(/^Combien font \d+ \+ \d+ \?$/);
  await expect(page.locator('[data-testid*="fluence" i], [data-testid*="chrono" i], [role="timer"]')).toHaveCount(0);
});

Then(/^Noisette ne dit aucun reproche$/, async ({ page }) => {
  const nouvelles = (await toutesLesParoles(page)).slice(partie100(page).parolesAvantDeQuitter);
  for (const parole of nouvelles) expect(parole).not.toMatch(/dommage|perdu|raté|abandon|pas fini|pas terminé|échou|mauvais|nul/i);
  await expect(page.getByRole("alert")).toHaveCount(0);
  await expect(dessin(page)).toBeVisible();
});

Then(/^Léa voit le dessin du parcours de maths$/, async ({ page }) => {
  await expect(page.getByRole("heading", { level: 2, name: "Mon parcours", exact: true })).toBeVisible();
  await expect(dessin(page)).toBeVisible();
  await expect(page.getByRole("tab", { name: "Maths", exact: true })).toHaveAttribute("aria-selected", "true");
});

// --- Alors : la fin du défi

Then(/^la fin du défi annonce « Défi relevé ! »(, sans mouvement)?$/, async ({ page }, sansMouvement: string | undefined) => {
  const annonce = page.getByTestId("annonce-du-defi-releve");
  await expect(annonce).toHaveText("Défi relevé !", { timeout: 20_000 });
  await expect(annonce).toHaveAttribute("role", "status");
  if (sansMouvement != null) await expect(annonce).toHaveCSS("animation-name", "none");
});

Then(/^la fin du défi n'annonce pas « Défi relevé ! »$/, async ({ page }) => {
  await expect(finDuDefi(page).getByRole("button", { name: "Accueil", exact: true })).toBeVisible();
  await expect(page.getByTestId("annonce-du-defi-releve")).toBeEmpty();
  await expect(finDuDefi(page)).not.toContainText("Défi relevé");
});

Then(/^la fin du défi ne montre aucune étoile$/, async ({ page }) => {
  await expect(finDuDefi(page).getByRole("button", { name: "Accueil", exact: true })).toBeVisible();
  await expect(page.getByTestId("etoile")).toHaveCount(0);
  await expect(page.getByTestId("etoiles-gagnees")).toHaveCount(0);
  await expect(finDuDefi(page)).not.toContainText(/★|étoile/i);
});

Then(
  /^aucune annonce pour la cabane, de nouvelle tenue, de nouveau badge ni de nouvel épisode n'apparaît à la fin du défi$/,
  async ({ page }) => {
    await expect(finDuDefi(page).getByRole("button", { name: "Accueil", exact: true })).toBeVisible();
    for (const annonce of ["annonce-de-la-cabane", "annonce-de-la-tenue", "annonce-de-nouveau-badge", "annonce-du-nouvel-episode"]) {
      await expect(page.getByTestId(annonce).filter({ hasText: /\S/ }), annonce).toHaveCount(0);
    }
    await expect(page.getByRole("alert")).toHaveCount(0);
  },
);

Then(/^la fin du défi ne propose pas « ([^«»]+) »$/, async ({ page }, bouton: string) => {
  await expect(finDuDefi(page).getByRole("button", { name: "Accueil", exact: true })).toBeVisible();
  await expect(finDuDefi(page).getByRole("button", { name: bouton, exact: true })).toHaveCount(0);
});

Then(/^la fin du défi propose « Mon parcours » et « Accueil »$/, async ({ page }) => {
  await expect(finDuDefi(page).getByRole("button").filter({ hasNotText: "Réécouter" })).toHaveText(["Mon parcours", "Accueil"]);
});

Then(/^Léa entend l'effet sonore « ([^«»]+) », puis Noisette dit « ([^«»]+) »$/, async ({ page }, effet: string, texte: string) => {
  await effetPuisParole(page, [effet], "felicitation", true);
  expect(normaliser((await bulle(page).textContent()) ?? "")).toBe(normaliser(texte));
});

Then(/^elle voit le message « (.+) »$/, { tags: "@issue-100" }, async ({ page }, message: string) => {
  // Sans réseau, l'envoi échoue après un délai : le message n'arrive pas tout de suite.
  await expect(page.getByTestId("sauvegarde")).toHaveText(message, { timeout: 25_000 });
  await expect(page.getByTestId("sauvegarde")).toHaveAttribute("role", "status");
});

// --- Alors : « Mes médailles »

Then(/^la section « Mes défis relevés » montre « ([^«»]+) » une seule fois$/, async ({ page }, ligne: string) => {
  const section = page.getByRole("region", { name: "Mes défis relevés", exact: true });
  await expect(section).toBeVisible({ timeout: 20_000 });
  await expect(section.getByTestId("ligne-de-defi-releve")).toHaveCount(1);
  await expect(section.getByTestId("ligne-de-defi-releve")).toHaveText(ligne);
});

Then(/^« Mes défis relevés » est la dernière section de « Mes médailles »$/, async ({ page }) => {
  const sections = page.locator("section.mes-medailles").getByRole("region");
  await expect(sections.last()).toBeVisible({ timeout: 20_000 });
  await expect(sections.last()).toHaveAccessibleName("Mes défis relevés");
});

// --- Alors : le serveur

Then(/^l'enregistrement est refusé$/, { tags: "@issue-100" }, async ({ famille }) => {
  const reponse = partie(famille).reponse;
  expect(reponse?.statut, "refus d'un défi incohérent").toBe(422);
  expect(reponse?.message).toBe("Ce défi n'a pas pu être vérifié.");
});

Then(/^sur le téléphone de (Paul), le repère « Défi (\d+) » de Léa n'est pas relevé$/, async ({ famille, browser, baseURL }, parent: "Paul", numero: string) => {
  const telephone = await telephoneDeLParent(famille, browser, baseURL, parent);
  await ouvrirLeParcoursDeMaths(telephone);
  const cible = repereDuDefi(telephone, numero);
  await expect(cible).toHaveCount(1, { timeout: 20_000 });
  await expect(cible).not.toHaveAttribute("data-etat", "releve");
});
