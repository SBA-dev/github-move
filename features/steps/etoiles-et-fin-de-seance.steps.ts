import { expect, type Page } from "@playwright/test";
import type { Famille } from "../support/famille.ts";
import {
  envoyerUneSeanceTerminee,
  insertionDirecteDeSeance,
  lireEnRest,
  meilleuresEtoilesEnRest,
  type ReponseDeLEnregistrement,
} from "../support/seances-api.ts";
import { Given, Then, When } from "./fixtures.ts";
import {
  commencerLaSeanceComplete,
  commencerSeulementLExercice,
  entendu,
  etat,
  type LeconBrute,
  leconDeTitre,
  ouvrirLaPageDeLaLecon,
  bulle,
  injecter,
  recipient,
  toutesLesParoles,
} from "./etapes-puis-exercices.steps.ts";
import {
  avancerJusquAuxChoix,
  bulleDeChoix,
  etatDesChoix,
  leconDeLExercice,
  positionDeLExercice,
  questionsDeLaLecon,
  questionsDeLaSeance,
  questionsReussies,
  repondre,
  textesDesChoixPossibles,
} from "./exercices-a-choix.steps.ts";
import { choisirLeaSur, ouvrirLaLeconDansLApplication } from "./profil-reel.ts";
import { jetonDe, profilDe } from "./profils-enfants.steps.ts";
import { EXPRESSIONS_PAR_PERSONNAGE } from "./univers.steps.ts";
import { normaliser, terminerLaLecture } from "./voix.steps.ts";

// Story #24 : étoiles et fin de séance.
// Léa joue comme un enfant (elle touche les bulles). Les envois au serveur se font par l'application ; les envois
// « forgés » (séance incohérente, parent non rattaché) appellent la fonction avec le jeton du parent, jamais la clé service_role.
// Les exercices dont l'écran n'est pas encore livré échouent clairement (« Étape non implémentée »).

const TYPES_A_CHOIX = ["bulles", "lecture", "ecoute"];
const STORY_PAR_TYPE: Readonly<Record<string, number>> = {
  classer: 18,
  ordre: 18,
  trous: 18,
  dictee: 19,
  conjugaison: 19,
  calcul: 20,
  fluence: 20,
  addition: 20,
  boite: 21,
  barres: 21,
  memoriser: 22,
};
const DELAI_DE_LA_FONCTION_MS = 20_000; // démarrage à froid possible de l'Edge Function

function dependDe(numero: number, mecanique: string): never {
  throw new Error(`Étape non implémentée : dépend de la story #${numero} (${mecanique}).`);
}

// --- État du scénario

type Partie = {
  erreursEnTout: number;
  erreursParExercice: Map<number, number>;
  reponse: ReponseDeLEnregistrement | undefined;
  lignesLues: { statut: number; lignes: Record<string, unknown>[] } | undefined;
  insertionDirecte: number | undefined;
  appareil: "tablette" | "telephone";
};
const parties = new WeakMap<Famille, Partie>();

export function partie(famille: Famille): Partie {
  let courante = parties.get(famille);
  if (!courante) {
    courante = {
      erreursEnTout: 0,
      erreursParExercice: new Map(),
      reponse: undefined,
      lignesLues: undefined,
      insertionDirecte: undefined,
      appareil: "tablette",
    };
    parties.set(famille, courante);
  }
  return courante;
}

function leconOuverte(page: Page): LeconBrute {
  const lecon = etat(page).courante;
  if (!lecon) throw new Error("Aucune leçon ouverte");
  return lecon;
}

function exercicesJoues(page: Page): number[] {
  const lecon = leconOuverte(page);
  const unique = etatDesChoix(page).exerciceUnique;
  return unique === undefined ? lecon.exercices.map((_, position) => position) : [unique];
}

function verifierQueLesExercicesSeJouent(page: Page): void {
  const lecon = leconOuverte(page);
  for (const position of exercicesJoues(page)) {
    const type = String(lecon.exercices[position]?.type);
    if (!TYPES_A_CHOIX.includes(type)) {
      dependDe(STORY_PAR_TYPE[type] ?? 18, `exercice ${type} « ${String(lecon.exercices[position]?.titre)} » de « ${lecon.titre} »`);
    }
  }
}

// --- Jouer

function repartir(total: number, questions: number): number[] {
  const parQuestion = Array.from({ length: questions }, () => 0);
  for (let rang = 0; rang < total && questions > 0; rang++) parQuestion[rang % questions]! += 1;
  return parQuestion;
}

function erreursParQuestion(page: Page, partieEnCours: Partie): number[] {
  const questions = questionsDeLaSeance(page);
  const resultat = Array.from({ length: questions.length }, () => 0);
  for (const [position, nombre] of partieEnCours.erreursParExercice) {
    const rangs = questions.flatMap((q, rang) => (q.position === position ? [rang] : []));
    repartir(nombre, rangs.length).forEach((n, i) => (resultat[rangs[i] as number]! += n));
  }
  repartir(partieEnCours.erreursEnTout, questions.length).forEach((n, rang) => (resultat[rang]! += n));
  return resultat;
}

async function faireUneErreur(page: Page): Promise<void> {
  await avancerJusquAuxChoix(page);
  const bonne = questionsDeLaSeance(page)[await questionsReussies(page)]?.reponse;
  const fausse = (await textesDesChoixPossibles(page)).find((texte) => texte !== bonne);
  if (fausse === undefined) throw new Error("Aucun mauvais choix possible");
  await repondre(page, fausse);
}

export async function attendreLaFinDeLaSeance(page: Page): Promise<void> {
  const fin = page.getByTestId("fin-de-seance");
  await expect.poll(async () => {
    if (await fin.isVisible()) return true;
    await terminerLaLecture(page);
    return false;
  }, { intervals: [100] }).toBe(true);
}

async function jouerJusquALaFin(page: Page, partieEnCours: Partie): Promise<void> {
  verifierQueLesExercicesSeJouent(page);
  const questions = questionsDeLaSeance(page);
  const erreurs = erreursParQuestion(page, partieEnCours);
  for (const [rang, question] of questions.entries()) {
    for (let i = 0; i < (erreurs[rang] ?? 0); i++) await faireUneErreur(page);
    await avancerJusquAuxChoix(page);
    await bulleDeChoix(page, question.reponse).click();
    if (rang < questions.length - 1) await expect(recipient(page)).toHaveAttribute("data-questions-reussies", String(rang + 1));
  }
  await attendreLaFinDeLaSeance(page);
}

async function reposerLesErreurs(famille: Famille, page: Page): Promise<Partie> {
  const courante = partie(famille);
  courante.erreursEnTout = 0;
  courante.erreursParExercice.clear();
  etatDesChoix(page).exerciceUnique = undefined;
  return courante;
}

async function jouerUnExerciceSeul(famille: Famille, page: Page, lecon: LeconBrute, position: number, erreurs: number) {
  const courante = await reposerLesErreurs(famille, page);
  courante.erreursEnTout = erreurs;
  await ouvrirLaPageDeLaLecon(page, lecon.titre);
  etatDesChoix(page).exerciceUnique = position;
  verifierQueLesExercicesSeJouent(page);
  await commencerSeulementLExercice(page, String(lecon.exercices[position]?.titre));
  await jouerJusquALaFin(page, courante);
}

function premierExerciceAChoix(lecon: LeconBrute): number {
  const position = lecon.exercices.findIndex((e) => TYPES_A_CHOIX.includes(String(e.type)));
  if (position < 0) throw new Error(`La leçon « ${lecon.titre} » n'a aucun exercice à choix`);
  return position;
}

// --- Étant donné : les erreurs de la séance

Given(/^Léa a fait (\d+) erreurs?(?:\(s\))? pendant la séance$/, async ({ famille }, nombre: string) => {
  partie(famille).erreursEnTout = Number(nombre);
});

Given(/^Léa n'a fait aucune erreur pendant la séance$/, async ({ famille }) => {
  partie(famille).erreursEnTout = 0;
});

Given(/^Léa a fait (\d+) erreurs à l'exercice « ([^«»]+) »$/, async ({ famille, page }, nombre: string, exercice: string) => {
  partie(famille).erreursParExercice.set(positionDeLExercice(leconOuverte(page), exercice), Number(nombre));
});

// --- Étant donné : séances déjà jouées (par l'interface, avec le vrai profil de Léa)

Given(/^Léa n'a encore jamais terminé de séance de la leçon « ([^«»]+) »$/, async ({ page }, titre: string) => {
  etat(page).courante = leconDeTitre(page, titre);
});

Given(/^Léa joue seulement l'exercice « ([^«»]+) »$/, async ({ famille, page }, exercice: string) => {
  const lecon = etat(page).courante ?? leconDeLExercice(page, exercice);
  const position = positionDeLExercice(lecon, exercice);
  const type = String(lecon.exercices[position]?.type);
  if (type === "fluence") {
    const { preparerLaFluence } = await import("./calcul-pour-les-autres-stories.steps.ts");
    return preparerLaFluence(page, exercice);
  }
  if (!TYPES_A_CHOIX.includes(type)) dependDe(STORY_PAR_TYPE[type] ?? 18, `exercice ${type} « ${exercice} »`);
  await reposerLesErreurs(famille, page);
  await ouvrirLaPageDeLaLecon(page, lecon.titre);
  etatDesChoix(page).exerciceUnique = position;
  await commencerSeulementLExercice(page, exercice);
});

const ERREURS_POUR_ETOILES: Readonly<Record<number, number>> = { 3: 0, 2: 1, 1: 4 };

async function attendreLEnregistrement(famille: Famille, lecon: LeconBrute, etoiles: number): Promise<void> {
  const profil = profilDe(famille, "Léa");
  const jeton = await jetonDe(famille, "Paul");
  await expect.poll(() => meilleuresEtoilesEnRest(jeton, profil.id, lecon.id), { timeout: DELAI_DE_LA_FONCTION_MS }).toBe(etoiles);
}

Given(
  /^Léa a (?:déjà )?gagné (\d) étoiles? à la leçon « ([^«»]+) »(?: avec (\d+) erreurs)?( sur la tablette)?(, sans réseau)?$/,
  async ({ famille, page }, etoiles: string, titre: string, erreurs: string | undefined, _sur: string | undefined, sansReseau: string | undefined) => {
    const lecon = leconDeTitre(page, titre);
    etat(page).courante = lecon;
    const nombre = erreurs == null ? (ERREURS_POUR_ETOILES[Number(etoiles)] ?? 0) : Number(erreurs);
    const position = premierExerciceAChoix(lecon);
    if (sansReseau == null) {
      await jouerUnExerciceSeul(famille, page, lecon, position, nombre);
      await attendreLEnregistrement(famille, lecon, Number(etoiles));
      return;
    }
    const courante = await reposerLesErreurs(famille, page);
    courante.erreursEnTout = nombre;
    await ouvrirLaPageDeLaLecon(page, lecon.titre);
    etatDesChoix(page).exerciceUnique = position;
    await commencerSeulementLExercice(page, String(lecon.exercices[position]?.titre));
    await page.context().setOffline(true);
    await jouerJusquALaFin(page, courante);
    await expect(page.getByTestId("sauvegarde")).toHaveText("Sauvegarde en ligne impossible : la progression est gardée sur cet appareil.");
  },
);

Given(/^Léa a quitté une séance complète de cette leçon avant la dernière question$/, async ({ famille, page }) => {
  await reposerLesErreurs(famille, page);
  await ouvrirLaPageDeLaLecon(page, leconOuverte(page).titre);
  await commencerLaSeanceComplete(page);
  const questions = questionsDeLaSeance(page);
  for (const [rang, question] of questions.slice(0, 2).entries()) {
    await avancerJusquAuxChoix(page);
    await bulleDeChoix(page, question.reponse).click();
    await expect(recipient(page)).toHaveAttribute("data-questions-reussies", String(rang + 1));
  }
  await page.getByRole("button", { name: "Retour", exact: true }).click();
  await expect(recipient(page)).toHaveCount(0);
});

Given(/^Léa a terminé une séance de l'exercice « ([^«»]+) » seul$/, async ({ famille, page }, exercice: string) => {
  const lecon = leconDeLExercice(page, exercice);
  etat(page).courante = lecon;
  await jouerUnExerciceSeul(famille, page, lecon, positionDeLExercice(lecon, exercice), 0);
});

// --- Étant donné : #14 (non livrée)

Given(/^Paul a demandé la suppression du profil enfant de Léa$/, () => dependDe(14, "suppression du profil enfant"));

// --- Quand

When(/^Léa réussit la dernière question de la séance$/, async ({ famille, page }) => {
  await jouerJusquALaFin(page, partie(famille));
});

When(/^Léa rejoue$/, async ({ page }) => {
  await page.getByTestId("fin-de-seance").getByRole("button", { name: "Rejouer", exact: true }).click();
});

When(/^le temps de la fluence est écoulé$/, async ({ page }) => {
  const { ecoulerLaFluence } = await import("./calcul-pour-les-autres-stories.steps.ts");
  await ecoulerLaFluence(page);
});
When(/^Paul exporte les données du profil enfant de Léa$/, () => dependDe(14, "export du profil enfant"));
When(/^Paul confirme la suppression du profil enfant de Léa$/, () => dependDe(14, "suppression du profil enfant"));

When(/^le réseau revient sur la tablette$/, async ({ page }) => {
  await page.context().setOffline(false);
});

function jetonDeLaPage(session: { access_token: string } | null, parent: string): string {
  if (!session) throw new Error(`${parent} n'est pas connecté sur cet appareil`);
  return session.access_token;
}

function corpsForge(lecon: LeconBrute, enfant: string, reponsesFinales: "justes" | "derniere-fausse", erreurs = 0, exercice?: string) {
  const position = exercice === undefined ? premierExerciceAChoix(lecon) : positionDeLExercice(lecon, exercice);
  const questions = questionsDeLaLecon(lecon, position);
  const fautes = repartir(erreurs, questions.length);
  return {
    seance: crypto.randomUUID(),
    enfant,
    lecon: lecon.id,
    choix: { genre: "unExercice", position },
    tirages: questions.map((q) => [...new Set(q.choix)]),
    reponses: questions.map((q, rang) => {
      const fausse = q.choix.find((texte) => texte !== q.reponse) as string;
      if (reponsesFinales === "derniere-fausse" && rang === questions.length - 1) return [{ choix: fausse }];
      return [...Array.from({ length: fautes[rang] ?? 0 }, () => ({ choix: fausse })), { choix: q.reponse }];
    }),
    termineeLe: new Date().toISOString(),
  };
}

When(/^l'appareil envoie une séance terminée dont une question ne finit pas par la bonne réponse$/, async ({ famille, page }) => {
  const jeton = jetonDeLaPage(await famille.session(page), "Paul");
  partie(famille).reponse = await envoyerUneSeanceTerminee(jeton, corpsForge(leconOuverte(page), profilDe(famille, "Léa").id, "derniere-fausse"));
});

const SECTION_DE_TEST_FRANCAIS = "c2-francais-cp-identifier-les-mots-de-maniere-de-plus-en-plus-aisee";
const CITATION_DE_TEST_FRANCAIS = "Décoder et encoder de 25 à 30 CGP.";
const MOTS_DE_TEST = ["loup", "mouton", "ballon", "maman"];

function bullesDeTest(titre: string, consigne: string): Record<string, unknown> {
  return {
    type: "bulles",
    titre,
    questions: Array.from({ length: 5 }, () => ({ question: consigne, choix: MOTS_DE_TEST, reponse: MOTS_DE_TEST[0] })),
  };
}

function leconDeFrancais(id: string, titre: string, ordre: number, exercices: Array<Record<string, unknown>>): LeconBrute {
  return {
    id,
    titre,
    matiere: "francais",
    niveau: "CP",
    ordre,
    programme: { section: SECTION_DE_TEST_FRANCAIS, citation: CITATION_DE_TEST_FRANCAIS },
    lecon: [{ texte: "O et U ensemble font le son « ou », comme dans loup.", exemples: [] }],
    exercices,
  };
}

Given(/^les leçons de test « Les sons de test » et « La suite de test » sont dans la bibliothèque$/, async ({ page }) => {
  await injecter(page, leconDeFrancais("test-les-sons", "Les sons de test", 901, [
    bullesDeTest("Premières bulles", "Touche le mot qui a le son ou."),
    bullesDeTest("Dernières bulles", "Touche le mot qui a le son on."),
  ]));
  await injecter(page, leconDeFrancais("test-la-suite", "La suite de test", 903, [
    bullesDeTest("Bulles de la suite", "Touche le mot qui a le son an."),
  ]));
});

async function envoyerLaSeanceDeTest(famille: Famille, page: Page, exercice: string, titre: string, erreurs: number, supplement: object) {
  const lecon = leconDeTitre(page, titre);
  const corps = corpsForge(lecon, profilDe(famille, "Léa").id, "justes", erreurs, exercice);
  const jeton = await jetonDe(famille, "Paul");
  partie(famille).reponse = await envoyerUneSeanceTerminee(jeton, { ...corps, ...supplement });
}

When(
  /^l'appareil envoie une séance terminée de l'exercice « ([^«»]+) » de la leçon « ([^«»]+) » avec (\d+) erreurs, en annonçant (\d) étoiles?$/,
  async ({ famille, page }, exercice: string, titre: string, erreurs: string, etoiles: string) => {
    await envoyerLaSeanceDeTest(famille, page, exercice, titre, Number(erreurs), { etoiles: Number(etoiles) });
  },
);

When(
  /^l'appareil envoie une séance terminée de l'exercice « ([^«»]+) » de la leçon « ([^«»]+) » avec (\d+) erreurs, sans annoncer d'étoiles$/,
  async ({ famille, page }, exercice: string, titre: string, erreurs: string) => {
    await envoyerLaSeanceDeTest(famille, page, exercice, titre, Number(erreurs), {});
  },
);

Then(/^l'enregistrement est refusé$/, async ({ famille }) => {
  const reponse = partie(famille).reponse;
  expect(reponse?.statut, "refus de l'envoi qui annonce des étoiles").toBe(400);
  expect(reponse?.message, "le refus vient du champ « etoiles »").toContain("etoiles");
});

When(
  /^Claire envoie une séance terminée de la leçon « ([^«»]+) » pour le profil enfant de Léa$/,
  async ({ famille, page }, titre: string) => {
    const telephone = await famille.page("telephone");
    const jeton = jetonDeLaPage(await famille.session(telephone), "Claire");
    partie(famille).reponse = await envoyerUneSeanceTerminee(jeton, corpsForge(leconDeTitre(page, titre), profilDe(famille, "Léa").id, "justes"));
  },
);

When(/^Claire demande les étoiles du profil enfant de Léa$/, async ({ famille }) => {
  const telephone = await famille.page("telephone");
  const jeton = jetonDeLaPage(await famille.session(telephone), "Claire");
  const profil = profilDe(famille, "Léa").id;
  const resultats = await lireEnRest(jeton, "resultats_des_lecons", profil);
  const seances = await lireEnRest(jeton, "seances_terminees", profil);
  partie(famille).lignesLues = { statut: Math.max(resultats.statut, seances.statut), lignes: [...resultats.lignes, ...seances.lignes] };
});

async function ouvrirLaLeconSur(famille: Famille, appareil: "tablette" | "telephone", parent: string, titre: string, page: Page) {
  const cible = await famille.page(appareil);
  if ((await famille.session(cible)) === null) await famille.connecterSansEmail(appareil, parent);
  if (cible !== page) await choisirLeaSur(cible);
  partie(famille).appareil = appareil;
  await ouvrirLaLeconDansLApplication(cible, leconDeTitre(page, titre).id);
  await expect(cible.getByRole("heading", { level: 2, name: titre })).toBeVisible();
}

When(/^Léa ouvre la page de la leçon « ([^«»]+) » sur le téléphone$/, async ({ famille, page }, titre: string) => {
  await ouvrirLaLeconSur(famille, "telephone", "Paul", titre, page);
});

When(/^Marie ouvre le profil enfant de Léa sur le téléphone$/, async ({ famille }) => {
  await famille.connecterSansEmail("telephone", "Marie");
  const telephone = await famille.page("telephone");
  await choisirLeaSur(telephone);
  partie(famille).appareil = "telephone";
});

// --- Alors : l'écran de fin

function fin(page: Page) {
  return page.getByTestId("fin-de-seance");
}

Then(/^la séance est terminée$/, async ({ page }) => {
  await attendreLaFinDeLaSeance(page);
});

Then(/^(?:Léa|Tom) gagne (\d) étoiles?$/, async ({ page }, etoiles: string) => {
  await attendreLaFinDeLaSeance(page);
  await expect(page.getByTestId("etoiles-gagnees")).toHaveText(texteDesEtoiles(Number(etoiles)));
  await expect(fin(page).locator('[data-testid="etoile"][data-allumee="true"]')).toHaveCount(Number(etoiles));
});

function texteDesEtoiles(nombre: number): string {
  return `${nombre} étoile${nombre > 1 ? "s" : ""} sur 3`;
}

Then(
  /^Léa voit (\d) étoiles?(?:\(s\))? allumées?(?:\(s\))? sur 3(?: pour cette séance)?$/,
  async ({ page }, etoiles: string) => {
    await attendreLaFinDeLaSeance(page);
    await expect(fin(page).getByTestId("etoile")).toHaveCount(3);
    await expect(fin(page).locator('[data-testid="etoile"][data-allumee="true"]')).toHaveCount(Number(etoiles));
  },
);

Then(/^l'écran indique en texte « (\d) étoiles?(?:\(s\))? sur 3 »$/, async ({ page }, etoiles: string) => {
  await expect(page.getByTestId("etoiles-gagnees")).toHaveText(texteDesEtoiles(Number(etoiles)));
});

Then(/^Léa voit ses étoiles$/, async ({ page }) => {
  await attendreLaFinDeLaSeance(page);
  await expect(page.getByTestId("etoiles-gagnees")).toHaveText(/^[123] étoiles? sur 3$/);
});

Then(/^elle voit le message « (.+) »$/, async ({ page }, message: string) => {
  await expect(page.getByTestId("sauvegarde")).toHaveText(message);
  await expect(page.getByTestId("sauvegarde")).toHaveAttribute("role", "status");
});

Then(/^Léa ne voit aucun message de plus$/, async ({ famille, page }) => {
  expect(partie(famille).reponse?.statut, "la fonction refuse la séance incohérente").toBe(422);
  await expect(page.getByRole("alert")).toHaveCount(0);
  await expect(page.getByTestId("sauvegarde")).toHaveCount(0);
});

Then(/^Noisette dit l'une de ses expressions, suivie de « (.+) »$/, async ({ page }, suite: string) => {
  await expect(bulle(page)).toHaveAttribute("data-nature", "felicitation");
  const texte = normaliser((await bulle(page).textContent()) ?? "");
  expect(texte.endsWith(` ${suite}`), texte).toBe(true);
  expect(EXPRESSIONS_PAR_PERSONNAGE["Noisette"]).toContain(texte.slice(0, texte.length - suite.length - 1));
  const sansEspace = (t: string) => t.replace(/[\s,]+/g, "");
  await expect.poll(async () => {
    if (sansEspace((await toutesLesParoles(page)).join("")).includes(sansEspace(entendu(texte)))) return true;
    await terminerLaLecture(page);
    return false;
  }, { intervals: [100] }).toBe(true);
});

Then(/^la fin de la séance propose (« .+ ») et (« [^«»]+ »)$/, async ({ page }, debut: string, dernier: string) => {
  const noms = [...debut.matchAll(/« ([^«»]+) »/g)].map((m) => m[1]);
  noms.push(dernier.slice(2, -2));
  await expect(fin(page).getByRole("button")).toHaveText(noms as string[]);
});

Then(/^aucune leçon suivante n'est proposée$/, async ({ page }) => {
  await page.evaluate(() => new Promise((fait) => requestAnimationFrame(() => requestAnimationFrame(fait))));
  await expect(fin(page).getByRole("button", { name: "Leçon suivante", exact: true })).toHaveCount(0);
  await expect(page.getByTestId("ensuite")).toHaveCount(0);
});

Then(/^le focus est sur « ([^«»]+) »$/, async ({ page }, nom: string) => {
  await expect(fin(page).getByRole("button", { name: nom, exact: true })).toBeFocused();
});

Then(/^la fin de la séance annonce « (.+) »$/, async ({ page }, annonce: string) => {
  await expect(page.getByTestId("ensuite")).toHaveText(annonce);
});

Then(/^la leçon suivante ouvre la page de la leçon « ([^«»]+) »$/, async ({ page }, titre: string) => {
  await fin(page).getByRole("button", { name: "Leçon suivante", exact: true }).click();
  await expect(page.getByRole("heading", { level: 2, name: titre })).toBeVisible();
  etat(page).courante = leconDeTitre(page, titre);
});

Then(/^Léa voit son score de fluence, sans étoiles$/, async ({ page }) => {
  await attendreLaFinDeLaSeance(page);
  await expect(page.getByTestId("score-de-fluence")).toHaveCount(1);
  await expect(page.getByTestId("etoiles-gagnees")).toHaveCount(0);
  await expect(page.getByTestId("etoile")).toHaveCount(0);
});
Then(/^le fichier téléchargé contient .*$/, () => dependDe(14, "export du profil enfant"));
Then(/^les meilleures étoiles de Léa pour cette leçon$/, () => dependDe(14, "export du profil enfant"));
Then(/^aucune des réponses données par Léa$/, () => dependDe(14, "export du profil enfant"));
Then(/^plus aucune séance terminée ni aucune étoile de Léa n'est gardée par Savanturier$/, () => dependDe(14, "suppression du profil enfant"));

// --- Alors : mouvements réduits, petit écran

Then(/^Léa voit ses étoiles sans étincelles ni mouvement$/, async ({ page }) => {
  await attendreLaFinDeLaSeance(page);
  await expect(page.getByTestId("etoiles-dessinees")).toBeVisible();
  await expect(page.getByTestId("etincelles")).toHaveCount(0);
});

Then(/^« Leçon suivante », « Accueil » et « Rejouer » mesurent au moins 44 px de haut$/, async ({ page }) => {
  for (const nom of ["Leçon suivante", "Accueil", "Rejouer"]) {
    const boite = await fin(page).getByRole("button", { name: nom, exact: true }).boundingBox();
    expect(boite, `bouton « ${nom} » visible`).not.toBeNull();
    expect(boite?.height ?? 0, `hauteur de « ${nom} »`).toBeGreaterThanOrEqual(44);
  }
});

// --- Alors : meilleures étoiles sur la page de la leçon

async function lireLaPageDeLaLecon(page: Page, leconId: string): Promise<void> {
  const lecture = page.waitForResponse((reponse) => reponse.url().includes("/rest/v1/resultats_des_lecons"), { timeout: DELAI_DE_LA_FONCTION_MS });
  await ouvrirLaLeconDansLApplication(page, leconId);
  await lecture;
  await page.evaluate(() => new Promise((fait) => requestAnimationFrame(() => requestAnimationFrame(fait))));
}

async function pageDe(famille: Famille, page: Page, surLeTelephone: boolean): Promise<Page> {
  return surLeTelephone ? await famille.page("telephone") : page;
}

async function verifierLesEtoilesDeLaLecon(cible: Page, leconId: string, etoiles: number | undefined) {
  await lireLaPageDeLaLecon(cible, leconId);
  const meilleures = cible.getByTestId("meilleures-etoiles");
  if (etoiles === undefined) {
    await expect(meilleures).toHaveCount(0);
    return;
  }
  await expect(meilleures).toHaveAttribute("data-etoiles", String(etoiles), { timeout: DELAI_DE_LA_FONCTION_MS });
  await expect(meilleures).toContainText(`Tes meilleures étoiles : ${etoiles} sur 3`);
}

Then(
  /^la page de la leçon « ([^«»]+) » (?:montre (?:toujours )?(\d) étoiles?|ne montre aucune étoile) pour Léa( sur le téléphone de Paul| sur la tablette)?$/,
  async ({ famille, page }, titre: string, etoiles: string | undefined, appareil: string | undefined) => {
    const leconId = leconDeTitre(page, titre).id;
    if (appareil?.includes("téléphone")) await ouvrirLaLeconSur(famille, "telephone", "Paul", titre, page);
    const cible = await pageDe(famille, page, appareil?.includes("téléphone") === true);
    if (appareil?.includes("téléphone")) {
      await expect(cible.getByRole("heading", { level: 2, name: titre })).toBeVisible();
    }
    await verifierLesEtoilesDeLaLecon(cible, leconId, etoiles == null ? undefined : Number(etoiles));
  },
);

Then(/^la page de la leçon montre (?:toujours )?(\d) étoiles? pour Léa$/, async ({ famille, page }, etoiles: string) => {
  const cible = await pageDe(famille, page, partie(famille).appareil === "telephone");
  await verifierLesEtoilesDeLaLecon(cible, leconOuverte(page).id, Number(etoiles));
});

Then(/^Marie voit que Léa a (\d) étoiles? à la leçon « ([^«»]+) »$/, async ({ famille, page }, etoiles: string, titre: string) => {
  const telephone = await famille.page("telephone");
  await verifierLesEtoilesDeLaLecon(telephone, leconDeTitre(page, titre).id, Number(etoiles));
  const jeton = jetonDeLaPage(await famille.session(telephone), "Marie");
  const refus = await insertionDirecteDeSeance(jeton, profilDe(famille, "Léa").id, leconDeTitre(page, titre).id);
  expect(refus, "insertion REST directe d'une séance par un parent rattaché").toBeGreaterThanOrEqual(400);
});

Then(/^l'enregistrement est refusé comme pour un profil introuvable$/, async ({ famille }) => {
  const reponse = partie(famille).reponse;
  expect(reponse?.statut).toBe(404);
  expect(reponse?.message).toBe("Ce profil enfant est introuvable.");
  const telephone = await famille.page("telephone");
  const refus = await insertionDirecteDeSeance(jetonDeLaPage(await famille.session(telephone), "Claire"), profilDe(famille, "Léa").id, "fr-cp-sons-ou-on-an");
  expect(refus, "insertion REST directe d'une séance par un parent non rattaché").toBeGreaterThanOrEqual(400);
});

Then(/^Claire ne reçoit aucune donnée de Léa$/, async ({ famille }) => {
  const lues = partie(famille).lignesLues;
  expect(lues?.statut).toBe(200);
  expect(lues?.lignes).toEqual([]);
});
