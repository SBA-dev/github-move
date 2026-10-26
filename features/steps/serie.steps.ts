import { expect, type Locator, type Page } from "@playwright/test";
import { decalagesDesJoursDits, ecrireDesSeancesDeRevisionPourLaSerie, ecrireDesSeancesTermineesPourLaSerie, jourPrepare, lireLesJoursDeSeanceEnRest } from "../support/serie-api.ts";
import { lireEnRest } from "../support/seances-api.ts";
import { entendu } from "./etapes-puis-exercices.steps.ts";
import { partie } from "./etoiles-et-fin-de-seance.steps.ts";
import { Given, Then, When } from "./fixtures.ts";
import { estSurUnProfilReel, rechargerAvecLeProfilReel } from "./profil-reel.ts";
import { choisirSonProfil, connecterSiBesoin, creerLeProfil, jetonDe, profilDe } from "./profils-enfants.steps.ts";
import { pageDeMarieOuCourante } from "./revisions-des-erreurs.steps.ts";
import { normaliser, terminerLaLecture } from "./voix.steps.ts";

// Story #30 : la série et la pastille de série de l'accueil de l'enfant.
//
// Les jours de séance sont préparés en base (clé service_role réservée à la préparation, features/support/serie-api.ts) pour le vrai
// profil de l'enfant ; les lignes partent avec le profil. Les séances d'aujourd'hui sont jouées par l'interface, avec les étapes
// de #24, #25, #27 et #28. Le jour de l'appareil est celui du calendrier du navigateur, qui commence à minuit.

const DELAI_D_UN_APPEL_SERVEUR_MS = 20_000;
const DELAI_DE_L_ENVOI_DIFFERE_MS = 30_000;

// --- Les écrans

const accueilDeLEnfant = (page: Page) => page.getByRole("region", { name: /^Accueil de / });
const pastilleDeSerie = (page: Page) => page.getByTestId("pastille-de-serie");
const flammeDeLaPastille = (page: Page) => pastilleDeSerie(page).locator(".flamme-de-la-serie");

const deuxImages = (page: Page) =>
  page.evaluate(() => new Promise<void>((fait) => requestAnimationFrame(() => requestAnimationFrame(() => fait()))));

async function allerDansLApplication(page: Page, chemin: string): Promise<void> {
  await page.evaluate((cible) => {
    history.pushState({ profondeur: 2, precedent: "/jeu" }, "", cible);
    dispatchEvent(new PopStateEvent("popstate"));
  }, chemin);
}

/**
 * Léa quitte son accueil puis y revient, sans recharger l'application, et attend que la pastille de série soit là : les jours de
 * séance que le serveur vient de recevoir sont alors lus (et gardés par l'application pour un passage sans réseau).
 */
async function repasserParLAccueil(page: Page): Promise<void> {
  if (!(await accueilDeLEnfant(page).isVisible())) return;
  await allerDansLApplication(page, "/medailles");
  await expect(accueilDeLEnfant(page)).toHaveCount(0);
  await allerDansLApplication(page, "/jeu");
  await expect(accueilDeLEnfant(page)).toBeVisible();
  await expect(pastilleDeSerie(page)).toBeVisible({ timeout: DELAI_D_UN_APPEL_SERVEUR_MS });
}

// --- Étant donné : les profils

Given(/^Tom a un profil enfant préparé de niveau (\S+)$/, { tags: "@issue-30" }, async ({ famille }, niveau: string) => {
  await creerLeProfil(famille, "Paul", { prenom: "Tom", niveau, libelleUnivers: "Animaux de la forêt" });
});

// --- Étant donné : les jours de séance

Given(/^(Léa|Tom) a terminé une séance chacun de ces jours : (.+)$/, async ({ famille, page }, prenom: string, jours: string) => {
  const preparees = decalagesDesJoursDits(jours).map((decalage) => jourPrepare(decalage));
  await ecrireDesSeancesTermineesPourLaSerie(profilDe(famille, prenom).id, preparees);
  if (prenom === "Léa" && estSurUnProfilReel(page)) await repasserParLAccueil(page);
});

Given(/^Léa a terminé une séance de révision chacun de ces jours : (.+)$/, async ({ famille, page }, jours: string) => {
  const preparees = decalagesDesJoursDits(jours).map((decalage) => jourPrepare(decalage));
  await ecrireDesSeancesDeRevisionPourLaSerie(profilDe(famille, "Léa").id, preparees);
  if (estSurUnProfilReel(page)) await repasserParLAccueil(page);
});

// Rien n'est préparé. L'accueil garde la bibliothèque pour toute la session : on le recharge pour qu'il reparte de zéro avec
// la bibliothèque servie par les étapes précédentes (test de départ, révisions).
Given(/^Léa n'a terminé aucune séance$/, async ({ page }) => {
  if (estSurUnProfilReel(page)) await rechargerAvecLeProfilReel(page);
});

// --- Quand : le temps et le réseau

function demainADixHeures(): Date {
  const maintenant = new Date();
  return new Date(maintenant.getFullYear(), maintenant.getMonth(), maintenant.getDate() + 1, 10, 0, 0);
}

// Le lendemain pour tous les appareils de Paul ; le réseau de la tablette revient et la séance gardée part avec son jour d'hier.
When(/^le réseau revient sur la tablette le lendemain$/, async ({ famille, page }) => {
  const demain = demainADixHeures();
  const telephone = await connecterSiBesoin(famille, "telephone", "Paul");
  await telephone.clock.setFixedTime(demain);
  await page.clock.setFixedTime(demain);
  await page.context().setOffline(false);
  const jeton = await jetonDe(famille, "Paul");
  await expect.poll(async () => (await lireEnRest(jeton, "seances_terminees", profilDe(famille, "Léa").id)).lignes.length, {
    message: "la séance gardée sur la tablette est envoyée au retour du réseau",
    intervals: [500],
    timeout: DELAI_DE_L_ENVOI_DIFFERE_MS,
  }).toBeGreaterThan(0);
});

When(/^Claire demande les jours de séance du profil enfant de Léa$/, async ({ famille }) => {
  const telephone = await famille.page("telephone");
  const jeton = (await famille.session(telephone))?.access_token;
  if (jeton === undefined) throw new Error("Claire n'est pas connectée sur le téléphone");
  partie(famille).lignesLues = await lireLesJoursDeSeanceEnRest(jeton, profilDe(famille, "Léa").id);
});

// --- Alors : la pastille de série

async function verifierLaPastille(page: Page, texte: string): Promise<void> {
  const pastille = pastilleDeSerie(page);
  await expect(pastille).toBeVisible({ timeout: DELAI_D_UN_APPEL_SERVEUR_MS });
  await expect(pastille.getByText(texte, { exact: true })).toBeVisible();
}

// Sur le téléphone de Marie quand Léa s'y est choisie, sinon sur la page de la tablette.
Then(/^la pastille de série dit « ([^«»]+) »$/, async ({ famille, page }, texte: string) => {
  await verifierLaPastille(pageDeMarieOuCourante(famille, page), texte);
});

// Léa se choisit sur le téléphone de Paul, qui lit les jours envoyés par la tablette : on relit tant que l'envoi n'est pas là.
Then(/^la pastille de série dit « ([^«»]+) » sur le téléphone de Paul$/, async ({ famille }, texte: string) => {
  const telephone = await connecterSiBesoin(famille, "telephone", "Paul");
  await expect(async () => {
    await telephone.goto("/");
    await choisirSonProfil(telephone, "Léa");
    await expect(pastilleDeSerie(telephone).getByText(texte, { exact: true })).toBeVisible({ timeout: 5_000 });
  }).toPass({ timeout: DELAI_DE_L_ENVOI_DIFFERE_MS });
});

// L'absence ne prouve rien tant que l'accueil n'a pas fini de lire : on attend la fin des échanges et deux images, plusieurs fois.
Then(/^l'accueil de Léa n'affiche pas de pastille de série$/, async ({ page }) => {
  await expect(accueilDeLEnfant(page)).toBeVisible({ timeout: DELAI_D_UN_APPEL_SERVEUR_MS });
  for (let essai = 0; essai < 3; essai++) {
    await page.waitForLoadState("networkidle");
    await deuxImages(page);
    await expect(pastilleDeSerie(page)).toHaveCount(0);
  }
});

// --- Alors : accessibilité

type LectureDeLaPastille = { texte: string; cachee: boolean };

// Même texte que l'étape de #25 (bouton du parcours) : ici, c'est le texte de la pastille de série que lit un lecteur d'écran,
// sans ce qui est caché (la flamme).
Then(/^les lecteurs d'écran annoncent « ([^«»]+) »$/, { tags: "@issue-30" }, async ({ page }, annonce: string) => {
  const pastille = pastilleDeSerie(page);
  await expect(pastille).toBeVisible({ timeout: DELAI_D_UN_APPEL_SERVEUR_MS });
  const lue = await pastille.evaluate((element): LectureDeLaPastille => {
    const copie = element.cloneNode(true) as HTMLElement;
    copie.querySelectorAll('[aria-hidden="true"]').forEach((cache) => cache.remove());
    return {
      texte: (copie.textContent ?? "").replace(/\s+/g, " ").trim(),
      cachee: element.closest('[aria-hidden="true"]') !== null,
    };
  });
  expect(lue.cachee, "la pastille de série n'est pas cachée aux lecteurs d'écran").toBe(false);
  expect(lue.texte).toBe(normaliser(annonce));
});

Then(/^la flamme de la pastille de série est cachée aux lecteurs d'écran$/, async ({ page }) => {
  await expect(flammeDeLaPastille(page)).toHaveCount(1);
  await expect(flammeDeLaPastille(page)).toHaveAttribute("aria-hidden", "true");
});

Then(/^la flamme de la pastille de série ne bouge pas$/, async ({ page }) => {
  await expect(flammeDeLaPastille(page)).toHaveCount(1);
  await expect(flammeDeLaPastille(page)).toHaveCSS("animation-name", "none");
});

type Mesures = { gauche: number; droite: number; largeurDeLEcran: number; coupee: boolean; points: boolean };

async function mesurer(texte: Locator): Promise<Mesures> {
  return await texte.evaluate((element): Mesures => {
    const pastille = element.closest<HTMLElement>('[data-testid="pastille-de-serie"]') ?? element;
    const intervalle = document.createRange();
    intervalle.selectNodeContents(element);
    const ecrit = intervalle.getBoundingClientRect();
    const cadre = pastille.getBoundingClientRect();
    const coupe = (e: Element) => e.scrollWidth > e.clientWidth + 1 || e.scrollHeight > e.clientHeight + 1;
    return {
      gauche: Math.min(ecrit.left, cadre.left),
      droite: Math.max(ecrit.right, cadre.right),
      largeurDeLEcran: window.innerWidth,
      coupee: coupe(element) || coupe(pastille) || ecrit.right > cadre.right + 1 || ecrit.bottom > cadre.bottom + 1,
      points: getComputedStyle(element).textOverflow === "ellipsis" || getComputedStyle(pastille).textOverflow === "ellipsis",
    };
  });
}

Then(/^le texte « ([^«»]+) » de la pastille de série se lit en entier$/, async ({ page }, texte: string) => {
  const ecrit = pastilleDeSerie(page).getByText(texte, { exact: true });
  await expect(ecrit).toBeVisible({ timeout: DELAI_D_UN_APPEL_SERVEUR_MS });
  const mesures = await mesurer(ecrit);
  expect(mesures.gauche, "le texte ne dépasse pas à gauche").toBeGreaterThanOrEqual(0);
  expect(mesures.droite, "le texte ne dépasse pas à droite").toBeLessThanOrEqual(mesures.largeurDeLEcran);
  expect(mesures.coupee, "le texte n'est pas coupé").toBe(false);
  expect(mesures.points, "le texte n'est pas abrégé par des points de suspension").toBe(false);
});

// --- Alors : la voix

async function lecturesParLot(page: Page): Promise<string[]> {
  return await page.evaluate(() => {
    const faux = Reflect.get(window, "__faux") as { journal: Array<{ type: string; lot: number; texte: string }> };
    const parLot = new Map<number, string[]>();
    for (const e of faux.journal) if (e.type === "speak") parLot.set(e.lot, [...(parLot.get(e.lot) ?? []), e.texte]);
    return [...parLot.values()].map((textes) => textes.join(" ").replace(/\s+/g, " ").trim());
  });
}

// Avec « tout lire à voix haute », la salutation et la pastille sont dites en une seule lecture, après la lecture des jours de séance.
Then(/^Léa entend Noisette lire « ([^«»]+) »$/, { tags: "@issue-30" }, async ({ page }, texte: string) => {
  const voulu = normaliser(entendu(texte));
  await expect.poll(async () => {
    const lots = await lecturesParLot(page);
    if (lots.includes(voulu)) return true;
    if (lots.length > 0) await terminerLaLecture(page);
    return false;
  }, { intervals: [100], timeout: DELAI_D_UN_APPEL_SERVEUR_MS }).toBe(true);
});

Then(/^Léa entend la salutation une seule fois$/, async ({ page }) => {
  const salutation = normaliser(entendu("Bonjour Léa !"));
  const nombre = async () => (await lecturesParLot(page)).filter((lot) => lot.startsWith(salutation)).length;
  await expect.poll(async () => {
    if ((await nombre()) === 0) await terminerLaLecture(page);
    return await nombre();
  }, { intervals: [100], timeout: DELAI_D_UN_APPEL_SERVEUR_MS }).toBeGreaterThan(0);
  for (let essai = 0; essai < 3; essai++) {
    await terminerLaLecture(page);
    await deuxImages(page);
  }
  expect(await nombre(), "la salutation est dite une seule fois, pastille de série comprise").toBe(1);
});

// Sans « tout lire à voix haute », le personnage guide ne fait que saluer : on attend sa salutation, puis on vérifie qu'aucune
// lecture ne contient le texte de la pastille (même au milieu d'une autre phrase).
Then(/^Léa n'entend pas Noisette lire « ([^«»]+) »$/, { tags: "@issue-30" }, async ({ page }, texte: string) => {
  await expect(page.getByTestId("parole")).toHaveText("Bonjour Léa !", { timeout: DELAI_D_UN_APPEL_SERVEUR_MS });
  const interdit = normaliser(entendu(texte));
  for (let essai = 0; essai < 3; essai++) {
    await terminerLaLecture(page);
    await deuxImages(page);
    expect((await lecturesParLot(page)).filter((lot) => lot.includes(interdit)), `« ${texte} » n'est pas lu`).toEqual([]);
  }
});
