import { expect, type Locator, type Page } from "@playwright/test";
import type { DataTable } from "playwright-bdd";
import { LECONS_DE_L_ACCUEIL } from "../support/bibliotheque-de-l-accueil.ts";
import { lecturesDuResultatEnCours, suivreLesLecturesDuResultat } from "../support/bibliotheque-du-test-de-depart.ts";
import { lireEnRest } from "../support/seances-api.ts";
import { partie } from "./etoiles-et-fin-de-seance.steps.ts";
import { commencerLaSeanceComplete, entendu, etat, type LeconBrute, leconDeTitre, ouvrirLaPageDeLaLecon } from "./etapes-puis-exercices.steps.ts";
import { avancerJusquAuxChoix, bulleDeChoix, questionsDeLaSeance } from "./exercices-a-choix.steps.ts";
import { Given, Then, When } from "./fixtures.ts";
import { choisirSonProfil, profilDe } from "./profils-enfants.steps.ts";
import { normaliser, terminerLaLecture } from "./voix.steps.ts";

// Story #29 : l'accueil de l'enfant (« Aujourd'hui »).
// La bibliothèque de test (identifiants « e2e-29- ») remplace celle de l'application dans le navigateur de Léa
// (features/support/bibliotheque-de-l-accueil.ts, servie par l'étape « Léa a un profil enfant préparé… »).
// La progression est préparée par les étapes de #25 et #27 ; les séances sont jouées par l'interface. Le serveur ne connaît pas
// les leçons de test : ce que l'accueil montre après une séance vient de la mémoire du navigateur, qui ne doit pas être rechargé.

const DELAI_DU_CALCUL_MS = 20_000;
const MOIS = ["janvier", "février", "mars", "avril", "mai", "juin", "juillet", "août", "septembre", "octobre", "novembre", "décembre"];

// --- Les écrans

const accueil = (page: Page) => page.getByRole("region", { name: /^Accueil de / });
const dock = (page: Page) => page.getByRole("navigation", { name: "Mes écrans", exact: true });
const tuilesDuJour = (page: Page) => accueil(page).getByTestId("tuile-du-jour");
const tuilesDeMatiere = (page: Page) => accueil(page).getByTestId("tuile-de-matiere");
const objectifDuJour = (page: Page) => accueil(page).getByTestId("objectif-du-jour");

const deuxImages = (page: Page) =>
  page.evaluate(() => new Promise<void>((fait) => requestAnimationFrame(() => requestAnimationFrame(() => fait()))));

/** Léa est sur son accueil : elle s'y choisit dans « Qui joue ? » (sans recharger la page) quand elle n'y est pas déjà. */
async function surLAccueilDeLea(page: Page): Promise<Locator> {
  if (!(await accueil(page).isVisible())) await choisirSonProfil(page, "Léa");
  await expect(accueil(page)).toBeVisible();
  return accueil(page);
}

/** Ce que l'accueil calcule est affiché une fois les lectures revenues : avant, une absence ne prouve rien. */
async function laisserLAccueilSeCalculer(page: Page): Promise<Locator> {
  const zone = await surLAccueilDeLea(page);
  await page.waitForLoadState("networkidle");
  await deuxImages(page);
  await expect.poll(() => lecturesDuResultatEnCours(page), { intervals: [50] }).toBe(0);
  await deuxImages(page);
  return zone;
}

async function mesurer(cible: Locator, nom: string): Promise<void> {
  const boite = await cible.boundingBox();
  expect(boite, `« ${nom} » visible`).not.toBeNull();
  expect(boite?.height ?? 0, `hauteur de « ${nom} »`).toBeGreaterThanOrEqual(44);
}

async function activer(page: Page, bouton: Locator, auClavier: boolean): Promise<void> {
  if (auClavier) {
    await bouton.focus();
    await page.keyboard.press("Enter");
  } else {
    await bouton.click();
  }
}

// --- Bibliothèque, date

Given(/^la bibliothèque de test de l'accueil est servie$/, async ({ page }) => {
  etat(page).injectees.push(...(LECONS_DE_L_ACCUEIL as LeconBrute[]));
  suivreLesLecturesDuResultat(page);
});

Given(/^nous sommes le (\d+)(?:er)? (\p{L}+) (\d{4})$/u, async ({ page }, jour: string, mois: string, annee: string) => {
  const rang = MOIS.indexOf(mois);
  if (rang < 0) throw new Error(`Mois inconnu : « ${mois} »`);
  await page.clock.setFixedTime(new Date(Number(annee), rang, Number(jour), 12, 0, 0));
});

Then(/^l'accueil de Léa affiche la date « ([^«»]+) »$/, async ({ page }, date: string) => {
  const zone = await surLAccueilDeLea(page);
  await expect(zone.locator("time")).toHaveText(date);
});

Then(/^les lecteurs d'écran annoncent « ([^«»]+) »$/, { tags: "@issue-29" }, async ({ page }, annonce: string) => {
  const zone = await surLAccueilDeLea(page);
  if (/ sur \d+$/.test(annonce)) {
    // Le compteur d'une tuile de matière est la description de son bouton.
    const tuile = tuilesDeMatiere(page).filter({ has: page.getByText(annonce, { exact: true }) });
    await expect(tuile).toHaveCount(1, { timeout: DELAI_DU_CALCUL_MS });
    await expect(tuile).toHaveAccessibleDescription(annonce);
    return;
  }
  await expect(zone.locator("time")).toHaveText(annonce);
  await expect(zone.locator("time")).not.toHaveAttribute("aria-hidden", "true");
});

// --- Salutation

Then(/^Noisette dit « ([^«»]+) »$/, { tags: "@issue-29" }, async ({ page }, texte: string) => {
  const parole = page.getByTestId("parole");
  await expect(parole).toHaveAttribute("data-nature", "accueil");
  await expect(parole).toHaveText(texte);
});

async function lotsLus(page: Page): Promise<string[]> {
  return await page.evaluate(() => {
    const faux = Reflect.get(window, "__faux") as { journal: Array<{ type: string; lot: number; texte: string }> };
    const parLot = new Map<number, string[]>();
    for (const e of faux.journal) if (e.type === "speak") parLot.set(e.lot, [...(parLot.get(e.lot) ?? []), e.texte]);
    return [...parLot.values()].map((textes) => textes.join(" ").replace(/\s+/g, " ").trim());
  });
}

Then(/^Léa entend Noisette dire « ([^«»]+) » une seule fois$/, async ({ page }, texte: string) => {
  const attendu = normaliser(entendu(texte));
  const nombre = async () => (await lotsLus(page)).filter((lot) => lot === attendu).length;
  await expect.poll(async () => {
    if ((await nombre()) === 0) await terminerLaLecture(page);
    return await nombre();
  }, { intervals: [100], timeout: DELAI_DU_CALCUL_MS }).toBeGreaterThan(0);
  for (let essai = 0; essai < 3; essai++) {
    await terminerLaLecture(page);
    await deuxImages(page);
  }
  await laisserLAccueilSeCalculer(page);
  expect(await nombre(), `« ${texte} » dite une seule fois`).toBe(1);
});

// --- Retour sur l'accueil : la salutation n'est pas redite

const salutationsAvantLeRetour = new WeakMap<Page, number>();

async function nombreDeLectures(page: Page, texte: string): Promise<number> {
  const attendu = normaliser(entendu(texte));
  return (await lotsLus(page)).filter((lot) => lot === attendu).length;
}

// Le personnage guide a salué Léa à son arrivée : « ne pas entendre de nouveau » compare avec ce qui avait déjà été lu avant le retour.
When(/^Léa revient en arrière$/, { tags: "@issue-29" }, async ({ page }) => {
  salutationsAvantLeRetour.set(page, await nombreDeLectures(page, "Bonjour Léa !"));
  await page.goBack();
});

Then(/^Léa n'entend pas Noisette lire « ([^«»]+) »$/, { tags: "@issue-29" }, async ({ page }, texte: string) => {
  await laisserLAccueilSeCalculer(page);
  for (let essai = 0; essai < 3; essai++) {
    await terminerLaLecture(page);
    await deuxImages(page);
  }
  expect(await nombreDeLectures(page, texte), `« ${texte} » n'est pas redite au retour`).toBe(salutationsAvantLeRetour.get(page) ?? 0);
});

// --- Leçon du jour

Then(/^la leçon du jour de Léa est « ([^«»]+) », avec « ([^«»]+) »$/, async ({ page }, titre: string, annonce: string) => {
  const zone = await surLAccueilDeLea(page);
  await expect(zone.getByTestId("titre-de-la-lecon-du-jour")).toHaveText(titre, { timeout: DELAI_DU_CALCUL_MS });
  await expect(zone.getByTestId("matiere-de-la-lecon-du-jour")).toHaveText(annonce);
});

Then(/^l'accueil de Léa ne propose aucune leçon du jour$/, async ({ page }) => {
  const zone = await laisserLAccueilSeCalculer(page);
  await expect(zone.getByTestId("lecon-du-jour")).toHaveCount(0);
  await expect(zone.getByRole("button", { name: "Commencer", exact: true })).toHaveCount(0);
});

async function commencerLaLeconDuJour(page: Page, auClavier: boolean): Promise<void> {
  const zone = await surLAccueilDeLea(page);
  const titre = await zone.getByTestId("titre-de-la-lecon-du-jour").textContent({ timeout: DELAI_DU_CALCUL_MS });
  etat(page).courante = leconDeTitre(page, titre ?? "");
  await activer(page, zone.getByRole("button", { name: "Commencer", exact: true }), auClavier);
}

When(/^Léa commence la leçon du jour(, au clavier seulement)?$/, async ({ page }, clavier: string | undefined) => {
  await commencerLaLeconDuJour(page, clavier != null);
});

Then(/^l'accueil de Léa affiche « ([^«»]+) »$/, async ({ page }, texte: string) => {
  const zone = await surLAccueilDeLea(page);
  await expect(zone.getByText(texte, { exact: true })).toBeVisible({ timeout: DELAI_DU_CALCUL_MS });
});

Then(/^l'accueil de Léa affiche (« [^«»]+ »(?:, « [^«»]+ »)* et « [^«»]+ »)$/, async ({ page }, liste: string) => {
  const zone = await surLAccueilDeLea(page);
  for (const [, texte] of liste.matchAll(/« ([^«»]+) »/g)) {
    await expect(zone.getByText(texte as string, { exact: true })).toBeVisible({ timeout: DELAI_DU_CALCUL_MS });
  }
});

Then(/^l'accueil de Léa n'affiche pas « ([^«»]+) »$/, async ({ page }, texte: string) => {
  const zone = await laisserLAccueilSeCalculer(page);
  await expect(zone.getByText(texte, { exact: true })).toHaveCount(0);
});

// --- Tuiles du jour

function tuileDuJour(page: Page, nom: string): Locator {
  return tuilesDuJour(page).filter({ hasText: nom });
}

Then(/^l'accueil de Léa propose la tuile « ([^«»]+) », avec « ([^«»]+) »$/, async ({ page }, nom: string, annonce: string) => {
  await surLAccueilDeLea(page);
  const tuile = tuileDuJour(page, nom);
  await expect(tuile).toHaveCount(1, { timeout: DELAI_DU_CALCUL_MS });
  await expect(tuile).toContainText(annonce);
});

Then(/^l'accueil de Léa ne propose pas la tuile « ([^«»]+) »$/, async ({ page }, nom: string) => {
  await laisserLAccueilSeCalculer(page);
  await expect(tuileDuJour(page, nom)).toHaveCount(0);
});

Then(/^l'accueil de Léa ne propose aucune tuile du jour$/, async ({ page }) => {
  await laisserLAccueilSeCalculer(page);
  await expect(tuilesDuJour(page)).toHaveCount(0);
});

When(/^Léa ouvre la tuile « ([^«»]+) » de son accueil$/, async ({ page }, nom: string) => {
  await surLAccueilDeLea(page);
  const tuile = tuileDuJour(page, nom);
  await expect(tuile).toHaveCount(1, { timeout: DELAI_DU_CALCUL_MS });
  await tuile.click();
});

Then(/^les tuiles du jour de l'accueil de Léa se suivent ainsi : « ([^«»]+) », puis « ([^«»]+) »$/, async ({ page }, premiere: string, seconde: string) => {
  await surLAccueilDeLea(page);
  await expect(tuilesDuJour(page)).toHaveCount(2, { timeout: DELAI_DU_CALCUL_MS });
  await expect(tuilesDuJour(page)).toContainText([premiere, seconde]);
});

// --- Objectif du jour

Then(/^l'objectif du jour de Léa indique « ([^«»]+) »(?: et « ([^«»]+) »)?$/, async ({ page }, premier: string, second: string | undefined) => {
  await surLAccueilDeLea(page);
  const objectif = objectifDuJour(page);
  await expect(objectif).toContainText(premier, { timeout: DELAI_DU_CALCUL_MS });
  if (second !== undefined) await expect(objectif).toContainText(second);
});

Then(/^les lecteurs d'écran annoncent l'objectif du jour « ([^«»]+) », sans lire la barre$/, async ({ page }, annonce: string) => {
  await surLAccueilDeLea(page);
  const objectif = objectifDuJour(page);
  await expect(objectif).toContainText(annonce, { timeout: DELAI_DU_CALCUL_MS });
  await expect(objectif.getByRole("progressbar")).toHaveCount(0);
  await expect(objectif.getByRole("img")).toHaveCount(0);
});

Given(/^Léa a quitté la séance de la leçon « ([^«»]+) » avant la fin$/, async ({ page }, titre: string) => {
  await ouvrirLaPageDeLaLecon(page, titre);
  await commencerLaSeanceComplete(page);
  const premiere = questionsDeLaSeance(page)[0];
  if (premiere === undefined) throw new Error(`La leçon « ${titre} » n'a aucune question`);
  await avancerJusquAuxChoix(page);
  await bulleDeChoix(page, premiere.reponse).click();
  await page.getByRole("button", { name: "Retour", exact: true }).click();
  await expect(page.getByTestId("recipient")).toHaveCount(0);
});

// --- Tuiles de matière

function nomDeLaTuile(tuile: Locator): Locator {
  return tuile.locator(".nom-de-la-matiere");
}

Then(/^les tuiles de matière de l'accueil de Léa montrent, dans l'ordre :$/, async ({ page }, tableau: DataTable) => {
  await surLAccueilDeLea(page);
  const lignes = tableau.hashes();
  await expect(tuilesDeMatiere(page)).toHaveCount(lignes.length, { timeout: DELAI_DU_CALCUL_MS });
  for (const [rang, ligne] of lignes.entries()) {
    const tuile = tuilesDeMatiere(page).nth(rang);
    await expect(nomDeLaTuile(tuile)).toHaveText(String(ligne["matière"]));
    await expect(tuile.getByTestId("compteur-de-la-matiere")).toHaveText(String(ligne["compteur"]));
  }
});

Then(/^la tuile de matière « ([^«»]+) » de l'accueil de Léa indique « ([^«»]+) »$/, async ({ page }, matiere: string, compteur: string) => {
  await surLAccueilDeLea(page);
  const tuile = tuilesDeMatiere(page).filter({ has: page.locator(".nom-de-la-matiere").getByText(matiere, { exact: true }) });
  await expect(tuile).toHaveCount(1, { timeout: DELAI_DU_CALCUL_MS });
  await expect(tuile.getByTestId("compteur-de-la-matiere")).toHaveText(compteur);
});

Then(/^l'accueil de Léa ne montre aucune tuile de matière$/, async ({ page }) => {
  await laisserLAccueilSeCalculer(page);
  await expect(tuilesDeMatiere(page)).toHaveCount(0);
});

Then(/^l'accueil de Léa ne montre pas de tuile de matière « ([^«»]+) »$/, async ({ page }, matiere: string) => {
  await laisserLAccueilSeCalculer(page);
  await expect(tuilesDeMatiere(page).first()).toBeVisible({ timeout: DELAI_DU_CALCUL_MS });
  await expect(tuilesDeMatiere(page).filter({ has: page.locator(".nom-de-la-matiere").getByText(matiere, { exact: true }) })).toHaveCount(0);
});

When(/^Léa ouvre la tuile de matière « ([^«»]+) » de son accueil$/, async ({ page }, matiere: string) => {
  await surLAccueilDeLea(page);
  const tuile = tuilesDeMatiere(page).filter({ has: page.locator(".nom-de-la-matiere").getByText(matiere, { exact: true }) });
  await expect(tuile).toHaveCount(1, { timeout: DELAI_DU_CALCUL_MS });
  await tuile.click();
});

// --- Dock

function titresCites(liste: string): string[] {
  return [...liste.matchAll(/« ([^«»]+) »/g)].map((m) => m[1] as string);
}

Then(/^le dock propose (« .+ »)$/, async ({ page }, liste: string) => {
  await surLAccueilDeLea(page);
  await expect(dock(page).getByRole("button")).toHaveText(titresCites(liste));
});

Then(/^le bouton « ([^«»]+) » du dock est marqué comme l'écran en cours$/, async ({ page }, nom: string) => {
  await expect(dock(page).getByRole("button", { name: nom, exact: true })).toHaveAttribute("aria-current", "page");
  await expect(dock(page).locator('[aria-current="page"]')).toHaveCount(1);
});

When(/^Léa ouvre « ([^«»]+) » par le dock(, au clavier seulement)?$/, async ({ page }, nom: string, clavier: string | undefined) => {
  await surLAccueilDeLea(page).catch(() => undefined);
  await activer(page, dock(page).getByRole("button", { name: nom, exact: true }), clavier != null);
});

Then(
  /^l'écran « ([^«»]+) » s'affiche, avec le bouton « ([^«»]+) » du dock marqué comme l'écran en cours$/,
  async ({ page }, ecran: string, bouton: string) => {
    await expect(page.getByRole("heading", { name: ecran, exact: true })).toBeVisible({ timeout: DELAI_DU_CALCUL_MS });
    await expect(dock(page).getByRole("button", { name: bouton, exact: true })).toHaveAttribute("aria-current", "page");
  },
);

Then(/^aucun dock n'est montré$/, async ({ page }) => {
  await expect(dock(page)).toHaveCount(0);
});

When(/^Léa choisit « Changer d'enfant » sur son accueil$/, async ({ page }) => {
  const zone = await surLAccueilDeLea(page);
  await zone.getByRole("button", { name: "Changer d'enfant", exact: true }).click();
});

Then(/^« Qui joue \? » s'affiche$/, async ({ page }) => {
  await expect(page.getByTestId("qui-joue")).toBeVisible();
});

// --- Accessibilité

Then(/^« Commencer », chaque tuile de l'accueil et chaque bouton du dock mesurent au moins 44 px de haut$/, async ({ page }) => {
  const zone = await laisserLAccueilSeCalculer(page);
  await mesurer(zone.getByRole("button", { name: "Commencer", exact: true }), "Commencer");
  const cibles = [...(await tuilesDuJour(page).all()), ...(await tuilesDeMatiere(page).all()), ...(await dock(page).getByRole("button").all())];
  expect(cibles.length).toBeGreaterThan(4);
  for (const cible of cibles) await mesurer(cible, (await cible.textContent()) ?? "");
});

Then(/^l'accueil de Léa s'affiche sans mouvement$/, async ({ page }) => {
  const zone = await laisserLAccueilSeCalculer(page);
  await expect(zone.getByTestId("titre-de-la-lecon-du-jour")).toBeVisible({ timeout: DELAI_DU_CALCUL_MS });
  const enCours = await page.evaluate(() =>
    document.getAnimations().filter((animation) => animation.playState === "running").map((animation) => animation.id || animation.constructor.name)
  );
  expect(enCours, "animations en cours sur l'accueil").toEqual([]);
});

// --- Droits

When(/^Claire demande les séances terminées du profil enfant de Léa$/, async ({ famille }) => {
  const telephone = await famille.page("telephone");
  const jeton = (await famille.session(telephone))?.access_token;
  if (jeton === undefined) throw new Error("Claire n'est pas connectée sur le téléphone");
  const lues = await lireEnRest(jeton, "seances_terminees", profilDe(famille, "Léa").id);
  partie(famille).lignesLues = { statut: lues.statut, lignes: [...lues.lignes] };
});

// --- Fin de séance

Given(/^Léa a réussi la dernière question de la séance$/, async ({ famille, page }) => {
  const { jouerJusquALaFinDeLaSeance } = await import("./etoiles-et-fin-de-seance.steps.ts");
  await jouerJusquALaFinDeLaSeance(famille, page);
});

Then(/^la fin de la séance ne propose pas « ([^«»]+) »$/, async ({ page }, nom: string) => {
  const fin = page.getByTestId("fin-de-seance");
  await expect(fin.getByRole("button", { name: "Accueil", exact: true })).toBeVisible();
  await laisserLesLecturesDeLaFin(page);
  await expect(fin.getByRole("button", { name: nom, exact: true })).toHaveCount(0);
});

async function laisserLesLecturesDeLaFin(page: Page): Promise<void> {
  await page.waitForLoadState("networkidle");
  await deuxImages(page);
}

When(/^Léa choisit « Toutes les leçons » à la fin de la séance$/, async ({ page }) => {
  await page.getByTestId("fin-de-seance").getByRole("button", { name: "Toutes les leçons", exact: true }).click();
});

Given(/^Léa a choisi « Toutes les leçons » à la fin de la séance de la leçon « ([^«»]+) »$/, async ({ famille, page }, titre: string) => {
  const { jouerJusquALaFinDeLaSeance } = await import("./etoiles-et-fin-de-seance.steps.ts");
  await ouvrirLaPageDeLaLecon(page, titre);
  await commencerLaSeanceComplete(page);
  await jouerJusquALaFinDeLaSeance(famille, page);
  const bouton = page.getByTestId("fin-de-seance").getByRole("button", { name: "Toutes les leçons", exact: true });
  await expect(bouton).toBeVisible({ timeout: DELAI_DU_CALCUL_MS });
  await bouton.click();
});
