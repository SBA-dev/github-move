import { expect, type Locator, type Page } from "@playwright/test";
import { LECONS_DE_L_ACCUEIL } from "../support/bibliotheque-de-l-accueil.ts";
import { ecrireUneSeanceTermineePourLeProfil } from "../support/seances-preparees-api.ts";
import { laisserLAccueilSeCalculer, surLAccueilDeLea } from "./aujourd-hui.steps.ts";
import { bulle, entendu, etat, leconDeTitre } from "./etapes-puis-exercices.steps.ts";
import { Given, Then, When } from "./fixtures.ts";
import { ETOILES_PAR_SEANCE, jouerLaSeanceCompleteAvecErreurs, noterUneSeanceJouee } from "./parcours.steps.ts";
import { profilDe } from "./profils-enfants.steps.ts";
import { pageDeMarieOuCourante, preparerLeScenarioDeLaRevision } from "./revisions-des-erreurs.steps.ts";
import { leGuide } from "./univers.steps.ts";
import { normaliser, terminerLaLecture } from "./voix.steps.ts";

// Story #101 : la quête du jour, proposée sur l'accueil de l'enfant et fêtée à la fin de la séance qui l'accomplit.
// Les séances de Léa se jouent par l'interface (la bibliothèque de test de l'accueil, « e2e-29- », est servie par les étapes de #29) ;
// seules les séances « d'un autre enfant » sont préparées en base (clé service_role réservée à cette préparation, jamais pour Léa).

const DELAI_DU_CALCUL_MS = 20_000;
const FETE = "Quête du jour accomplie ! Bravo Léa !";

// --- Les écrans

const accueil = (page: Page) => page.getByRole("region", { name: /^Accueil de / });
const quete = (page: Page) => page.getByTestId("quete-du-jour");
const queteProposee = (page: Page) => page.locator('section[data-testid="quete-du-jour"][data-etat="proposee"]');
const propositionDeLaQuete = (page: Page) => quete(page).getByTestId("proposition-de-la-quete");
const annonceDeLaQuete = (page: Page) => page.getByTestId("annonce-de-la-quete-accomplie");
const annonceDuNouvelEpisode = (page: Page) => page.getByTestId("annonce-du-nouvel-episode");

const deuxImages = (page: Page) =>
  page.evaluate(() => new Promise<void>((fait) => requestAnimationFrame(() => requestAnimationFrame(() => fait()))));

/** L'accueil de Léa est là, et la quête (ou son absence) est connue : une absence ne prouve rien avant la fin des lectures. */
async function verifierQueRienNEstProposeALAccueil(page: Page): Promise<void> {
  await laisserLAccueilSeCalculer(page);
  for (let essai = 0; essai < 3; essai++) {
    await page.waitForLoadState("networkidle");
    await deuxImages(page);
    await expect(queteProposee(page)).toHaveCount(0);
    await expect(accueil(page).getByRole("button", { name: "Oui, on y va !", exact: true })).toHaveCount(0);
    await expect(accueil(page).getByRole("button", { name: "Autre chose", exact: true })).toHaveCount(0);
  }
}

// --- Étant donné : les séances

Given(
  /^Léa a terminé hier une séance de la leçon « ([^«»]+) » avec (\d) étoiles?$/,
  async ({ page, $test }, titre: string, etoiles: string) => {
    $test.slow();
    const maintenant = new Date();
    await page.clock.setFixedTime(new Date(maintenant.getFullYear(), maintenant.getMonth(), maintenant.getDate() - 1, 10, 0, 0));
    await jouerLaSeanceCompleteAvecErreurs(page, titre, ETOILES_PAR_SEANCE[Number(etoiles)] ?? 0);
    noterUneSeanceJouee(page, titre, Number(etoiles));
    await page.getByTestId("fin-de-seance").getByRole("button", { name: "Accueil", exact: true }).click();
    await page.clock.setFixedTime(maintenant);
    // Le nom de l'application ramène à « Qui joue ? » sans recharger : ce que l'appareil sait des séances est en mémoire.
    await page.getByRole("banner").getByRole("button", { name: "Savanturier" }).click();
    await expect(page.getByTestId("qui-joue")).toBeVisible();
  },
);

Given(/^Tom a terminé aujourd'hui une séance de la leçon « ([^«»]+) » avec (\d) étoiles?$/, async ({ famille }, titre: string, etoiles: string) => {
  const lecon = LECONS_DE_L_ACCUEIL.find((l) => l.titre === titre);
  if (lecon === undefined) throw new Error(`Leçon de test introuvable : « ${titre} »`);
  await ecrireUneSeanceTermineePourLeProfil(profilDe(famille, "Tom").id, lecon.id, Number(etoiles));
});

// --- La proposition

Then(/^(Noisette|Coach Léo) propose la quête du jour « (.+) »$/, async ({ page }, personnage: string, parole: string) => {
  await surLAccueilDeLea(page);
  await expect(leGuide(page, personnage)).toBeVisible();
  await expect(quete(page)).toBeVisible({ timeout: DELAI_DU_CALCUL_MS });
  await expect(quete(page)).toHaveAttribute("data-etat", "proposee");
  await expect(propositionDeLaQuete(page)).toHaveText(parole);
  // La quête est dans un bloc sous la bulle, pas dans la bulle.
  await expect(accueil(page).getByTestId("parole").filter({ hasText: /quête/i })).toHaveCount(0);
});

Then(/^la quête du jour propose « Oui, on y va ! » et « Autre chose »$/, async ({ page }) => {
  await expect(quete(page).getByRole("button")).toHaveText(["Oui, on y va !", "Autre chose"]);
});

Then(/^la quête du jour de Léa propose la leçon « ([^«»]+) »$/, async ({ page }, titre: string) => {
  await surLAccueilDeLea(page);
  await expect(queteProposee(page)).toBeVisible({ timeout: DELAI_DU_CALCUL_MS });
  await expect(propositionDeLaQuete(page)).toHaveText(`Ta quête du jour : la leçon « ${titre} ». On y va ?`);
});

Then(/^la quête du jour de Léa propose la séance de révision$/, async ({ page }) => {
  await surLAccueilDeLea(page);
  await expect(queteProposee(page)).toBeVisible({ timeout: DELAI_DU_CALCUL_MS });
  await expect(propositionDeLaQuete(page)).toHaveText(/^Ta quête du jour : réviser \d+ petites? erreurs? des jours passés\. On y va \?$/);
});

Then(/^l'accueil de Léa ne propose (?:aucune|plus la) quête du jour$/, async ({ page }) => {
  await verifierQueRienNEstProposeALAccueil(page);
});

Then(/^l'accueil de Léa ne parle pas de la quête d'hier$/, async ({ page }) => {
  const zone = await laisserLAccueilSeCalculer(page);
  await expect(zone.getByTestId("titre-de-la-lecon-du-jour")).toBeVisible({ timeout: DELAI_DU_CALCUL_MS });
  const texte = await zone.evaluate((element) => {
    const copie = element.cloneNode(true) as HTMLElement;
    copie.querySelectorAll('[data-testid="quete-du-jour"]').forEach((proposition) => proposition.remove());
    return (copie.textContent ?? "").replace(/\s+/g, " ").trim();
  });
  expect(texte, "rien ne parle d'une quête, ni d'hier").not.toMatch(/qu[êe]te|\bhier\b|manqu|oubli|rat[ée]/i);
  expect(texte, "aucune parole de mission ou de défi").not.toMatch(/mission|défi/i);
});

// --- Choisir dans la quête

async function appuyer(page: Page, bouton: Locator, auClavier: boolean): Promise<void> {
  if (!auClavier) {
    await bouton.click();
    return;
  }
  for (let essai = 0; essai < 60; essai++) {
    if (await bouton.evaluate((element) => element === document.activeElement)) break;
    await page.keyboard.press("Tab");
  }
  await expect(bouton).toBeFocused();
  await page.keyboard.press("Enter");
}

async function choisirDansLaQuete(page: Page, choix: string, auClavier: boolean): Promise<void> {
  await surLAccueilDeLea(page);
  await expect(queteProposee(page)).toBeVisible({ timeout: DELAI_DU_CALCUL_MS });
  const bouton = queteProposee(page).getByRole("button", { name: choix, exact: true });
  if (choix === "Oui, on y va !") {
    const proposition = (await propositionDeLaQuete(page).textContent()) ?? "";
    const titre = /la leçon « ([^«»]+) »/.exec(proposition)?.[1];
    if (titre !== undefined) etat(page).courante = leconDeTitre(page, titre);
    else preparerLeScenarioDeLaRevision(page);
  }
  await appuyer(page, bouton, auClavier);
}

When(/^Léa choisit « (Oui, on y va !|Autre chose) » à la quête du jour(, au clavier seulement)?$/, async ({ page }, choix: string, clavier: string | undefined) => {
  await choisirDansLaQuete(page, choix, clavier != null);
});

Given(/^Léa a choisi « (Oui, on y va !|Autre chose) » à la quête du jour$/, async ({ page }, choix: string) => {
  await choisirDansLaQuete(page, choix, false);
});

// --- Après « Autre chose »

async function lotsLus(page: Page): Promise<string[]> {
  return await page.evaluate(() => {
    const faux = Reflect.get(window, "__faux") as { journal: Array<{ type: string; lot: number; texte: string }> };
    const parLot = new Map<number, string[]>();
    for (const e of faux.journal) if (e.type === "speak") parLot.set(e.lot, [...(parLot.get(e.lot) ?? []), e.texte]);
    return [...parLot.values()].map((textes) => textes.join(" ").replace(/\s+/g, " ").trim());
  });
}

Then(/^Noisette dit « ([^«»]+) »$/, { tags: "@issue-101" }, async ({ page }, texte: string) => {
  const parole = page.getByTestId("parole");
  await expect(parole).toHaveAttribute("data-nature", "accueil");
  await expect(parole).toHaveText(texte);
  const voulu = normaliser(entendu(texte));
  await expect.poll(async () => {
    const lots = await lotsLus(page);
    if (lots.some((lot) => lot.includes(voulu))) return true;
    if (lots.length > 0) await terminerLaLecture(page);
    return false;
  }, { intervals: [100], timeout: DELAI_DU_CALCUL_MS, message: `« ${texte} » est dite à voix haute` }).toBe(true);
});

When(/^Léa revient en arrière$/, { tags: "@issue-101" }, async ({ page }) => {
  await page.goBack();
});

// --- La voix

Then(
  /^Noisette lit à voix haute, après la salutation, « ([^«»]+) »$/,
  async ({ page }, proposition: string) => {
    const salutation = normaliser(entendu("Bonjour Léa !"));
    const voulue = normaliser(entendu(proposition));
    let lue: string | undefined;
    await expect.poll(async () => {
      const lots = await lotsLus(page);
      lue = lots.find((lot) => lot.includes(voulue));
      if (lue === undefined && lots.length > 0) await terminerLaLecture(page);
      return lue !== undefined;
    }, { intervals: [100], timeout: DELAI_DU_CALCUL_MS, message: `« ${proposition} » est lue à voix haute` }).toBe(true);
    expect(lue?.startsWith(salutation), "la lecture commence par la salutation").toBe(true);
    expect(lue?.indexOf(voulue) ?? -1, "la proposition vient après la salutation").toBeGreaterThanOrEqual(salutation.length);
  },
);

// --- Accessibilité

Then(/^« Oui, on y va ! » et « Autre chose » mesurent au moins 44 px de haut$/, async ({ page }) => {
  await expect(queteProposee(page)).toBeVisible({ timeout: DELAI_DU_CALCUL_MS });
  for (const nom of ["Oui, on y va !", "Autre chose"]) {
    const boite = await queteProposee(page).getByRole("button", { name: nom, exact: true }).boundingBox();
    expect(boite, `« ${nom} » visible`).not.toBeNull();
    expect(boite?.height ?? 0, `hauteur de « ${nom} »`).toBeGreaterThanOrEqual(44);
  }
});

// --- La fin de la séance

function finDe(page: Page, revision: boolean): Locator {
  return page.getByTestId(revision ? "fin-de-la-revision" : "fin-de-seance");
}

Then(/^la fin de la séance( de révision)? annonce la quête du jour accomplie, avec « ([^«»]+) »$/, async ({ page }, revision: string | undefined, texte: string) => {
  const annonce = finDe(page, revision != null).getByTestId("annonce-de-la-quete-accomplie");
  await expect(annonce).toBeVisible({ timeout: DELAI_DU_CALCUL_MS });
  await expect(annonce).toHaveAttribute("role", "status");
  await expect(annonce.getByText(texte, { exact: true })).toBeVisible();
  // La fête est ajoutée à la phrase de fin du personnage guide.
  await expect(bulle(page)).toContainText(texte, { timeout: DELAI_DU_CALCUL_MS });
});

Then(/^la fin de la séance annonce la quête du jour accomplie après l'annonce du nouvel épisode$/, async ({ page }) => {
  await expect(annonceDuNouvelEpisode(page)).toBeVisible({ timeout: DELAI_DU_CALCUL_MS });
  await expect(annonceDeLaQuete(page).getByText(FETE, { exact: true })).toBeVisible({ timeout: DELAI_DU_CALCUL_MS });
  const suit = await page.evaluate(() => {
    const episode = document.querySelector('[data-testid="annonce-du-nouvel-episode"]');
    const fete = document.querySelector('[data-testid="annonce-de-la-quete-accomplie"]');
    return episode !== null && fete !== null && Boolean(episode.compareDocumentPosition(fete) & Node.DOCUMENT_POSITION_FOLLOWING);
  });
  expect(suit, "la quête accomplie suit l'annonce du nouvel épisode dans la page").toBe(true);
  const [haute, basse] = [await annonceDuNouvelEpisode(page).boundingBox(), await annonceDeLaQuete(page).boundingBox()];
  expect(haute?.y ?? 0, "l'épisode est au-dessus de la quête").toBeLessThan(basse?.y ?? 0);
});

Then(/^aucune annonce de quête du jour accomplie n'apparaît à la fin de la séance$/, async ({ page }) => {
  // Le personnage guide ne dit sa phrase de fin qu'une fois décidé s'il y a une quête accomplie : on l'attend.
  await expect(bulle(page)).toHaveAttribute("data-nature", "felicitation", { timeout: DELAI_DU_CALCUL_MS });
  await expect(annonceDeLaQuete(page)).toBeEmpty();
  await expect(annonceDeLaQuete(page)).toBeHidden();
});

Then(/^l'annonce de la quête du jour accomplie apparaît sans mouvement$/, async ({ page }) => {
  await expect(annonceDeLaQuete(page)).toBeVisible({ timeout: DELAI_DU_CALCUL_MS });
  await expect(annonceDeLaQuete(page)).toHaveCSS("animation-name", "none");
});

// --- L'Espace parent

Then(/^le mot « quête » n'apparaît pas dans l'Espace parent$/, async ({ famille }) => {
  const page = await famille.page("tablette");
  await expect(page.getByRole("heading", { name: "Espace parent" }).first()).toBeVisible({ timeout: DELAI_DU_CALCUL_MS });
  await expect(page.locator("body")).not.toContainText(/qu[êe]te/i);
});

// --- Accepter la révision proposée

Then(/^l'écran s'intitule « ([^«»]+) », avec « ([^«»]+) »$/, { tags: "@issue-101" }, async ({ page }, titre: string, sousTitre: string) => {
  await expect(page.getByRole("heading", { level: 2, name: titre, exact: true })).toBeVisible();
  await expect(page.getByTestId("sous-titre-de-la-revision")).toHaveText(sousTitre);
});

// --- Le téléphone du second parent

Then(/^l'accueil de Léa affiche « ([^«»]+) » sur le téléphone de Marie$/, async ({ famille, page }, texte: string) => {
  const telephone = pageDeMarieOuCourante(famille, page);
  const zone = await surLAccueilDeLea(telephone);
  await expect(zone.getByText(texte, { exact: true })).toBeVisible({ timeout: DELAI_DU_CALCUL_MS });
});
