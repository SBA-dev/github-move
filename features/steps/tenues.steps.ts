import { expect, type Locator, type Page } from "@playwright/test";
import type { DataTable } from "playwright-bdd";
import { bulle } from "./etapes-puis-exercices.steps.ts";
import { ecranDe, ouvrirLEcran } from "./ecran-mes-medailles.steps.ts";
import { Before, Given, Then, When } from "./fixtures.ts";
import { choisirSonProfil, connecterSiBesoin } from "./profils-enfants.steps.ts";
import { verifierModeDys } from "./reglages.steps.ts";
import { cleDe, leGuide } from "./univers.steps.ts";

// Story #102 : les tenues du personnage guide, dans « Mes médailles », sur l'écran de fin et sur tous les écrans de l'enfant.
//
// L'enfant agit toujours par l'interface : il met ou retire une tenue en touchant (ou au clavier) les boutons de la
// section des tenues. Les étoiles sont préparées par les étapes de #32 (« Léa a gagné N étoiles en tout »).

const DELAI_D_UN_APPEL_SERVEUR_MS = 20_000;

// Chaque scénario crée un parent, un profil enfant et des étoiles sur le projet en ligne, puis joue ou ouvre plusieurs
// écrans : 20 à 30 s à lui seul, bien au-delà de 30 s quand trois scénarios tournent en parallèle (même précaution que #96 et #97).
Before({ tags: "@issue-102" }, async ({ $testInfo }) => {
  $testInfo.setTimeout(120_000);
});

const CLE_DE_LA_TENUE: Readonly<Record<string, string>> = {
  "une écharpe rayée": "echarpe-rayee",
  "un nœud papillon": "noeud-papillon",
  "un sac à dos d'explorateur": "sac-a-dos-d-explorateur",
  "des bottes de pluie": "bottes-de-pluie",
};

function cleDeLaTenue(libelle: string): string {
  const cle = CLE_DE_LA_TENUE[libelle];
  if (cle === undefined) throw new Error(`Tenue inconnue : « ${libelle} »`);
  return cle;
}

// --- La section des tenues

function sectionDesTenues(page: Page): Locator {
  return page.getByTestId("section-des-tenues");
}

function pastillesDesTenues(page: Page): Locator {
  return sectionDesTenues(page).getByTestId("pastille-de-tenue");
}

function boutonDeLaTenue(page: Page, libelle: string): Locator {
  return sectionDesTenues(page).getByRole("button", { name: libelle, exact: true });
}

Then(/^les tenues de Noisette montrent, dans l'ordre :$/, async ({ page }, tableau: DataTable) => {
  const ecran = ecranDe(page);
  const attendues = tableau.hashes().map((ligne) => String(ligne["tenue"]));
  await expect(pastillesDesTenues(ecran)).toHaveCount(attendues.length, { timeout: DELAI_D_UN_APPEL_SERVEUR_MS });
  for (const [rang, libelle] of attendues.entries()) {
    await expect(pastillesDesTenues(ecran).nth(rang).getByText(libelle, { exact: true })).toBeVisible();
  }
});

Then(/^les tenues de Noisette montrent toujours « ([^«»]+) »$/, async ({ page }, libelle: string) => {
  const ecran = ecranDe(page);
  await expect(boutonDeLaTenue(ecran, libelle)).toBeVisible({ timeout: DELAI_D_UN_APPEL_SERVEUR_MS });
});

Then(/^aucune section « Les tenues de Noisette » n'apparaît$/, async ({ page }) => {
  const ecran = ecranDe(page);
  // La bulle du personnage guide n'apparaît qu'une fois la lecture des sections terminée.
  await expect(ecran.getByTestId("parole")).toBeVisible({ timeout: DELAI_D_UN_APPEL_SERVEUR_MS });
  await expect(sectionDesTenues(ecran)).toHaveCount(0);
  await expect(ecran.getByRole("heading", { level: 2, name: "Les tenues de Noisette" })).toHaveCount(0);
});

Then(
  /^les sections de l'écran sont, dans l'ordre : la cabane, les tenues, l'histoire, puis les badges$/,
  async ({ page }) => {
    const sections = ecranDe(page).locator("section.mes-medailles").getByRole("region");
    await expect(sections).toHaveCount(4, { timeout: DELAI_D_UN_APPEL_SERVEUR_MS });
    const noms = [/^La cabane de Noisette/, /^Les tenues de Noisette/, /^L'histoire des Savanturiers/, /^Mes badges/];
    for (const [rang, nom] of noms.entries()) await expect(sections.nth(rang)).toHaveAccessibleName(nom);
  },
);

When(/^Léa demande à écouter les tenues$/, async ({ page }) => {
  await sectionDesTenues(page).getByRole("button", { name: "Écouter", exact: true }).click();
});

// --- Mettre, changer, retirer

async function mettreLaTenue(page: Page, libelle: string, moyen: "toucher" | "clavier"): Promise<void> {
  const ecran = ecranDe(page);
  const bouton = boutonDeLaTenue(ecran, libelle);
  await expect(bouton).toBeVisible({ timeout: DELAI_D_UN_APPEL_SERVEUR_MS });
  if (moyen === "clavier") {
    await bouton.focus();
    await page.keyboard.press("Enter");
  } else {
    await bouton.click();
  }
  await expect(bouton).toHaveAttribute("aria-pressed", "true");
}

When(/^Léa met « ([^«»]+) » à (?:Noisette|Coach Léo|Capitaine Sam)$/, async ({ page }, libelle: string) => {
  await mettreLaTenue(page, libelle, "toucher");
});

When(/^Léa met « ([^«»]+) » à Noisette, au clavier seulement$/, async ({ page }, libelle: string) => {
  await mettreLaTenue(page, libelle, "clavier");
});

/** L'enfant a mis la tenue dans « Mes médailles » avant la scène : il revient ensuite à son accueil. */
Given(/^Léa a mis « ([^«»]+) » à (?:Noisette|Coach Léo|Capitaine Sam)$/, async ({ famille, page }, libelle: string) => {
  await ouvrirLEcran(famille, page, "toucher");
  await mettreLaTenue(page, libelle, "toucher");
  await page.goBack();
  await expect(page.getByRole("region", { name: /^Accueil de / })).toBeVisible();
});

When(/^Tom choisit son profil enfant dans « Qui joue \? »$/, async ({ famille }) => {
  await choisirSonProfil(await connecterSiBesoin(famille, "tablette", "Paul"), "Tom");
});

When(/^Léa retire la tenue de Noisette$/, async ({ page }) => {
  const ecran = ecranDe(page);
  await ecran.getByTestId("retirer-la-tenue").click();
  await expect(sectionDesTenues(ecran).locator('[aria-pressed="true"]')).toHaveCount(0);
});

When(/^Léa choisit la pastille « (\d+ ★) »$/, { tags: "@issue-102" }, async ({ page }, libelle: string) => {
  await pastillesDesTenues(page).filter({ hasText: libelle }).first().click();
});

// --- Voir le personnage guide habillé (« Mes médailles » : le dessin y est annoncé)

function dessinAnnonce(page: Page, annonce: string): Locator {
  return ecranDe(page).getByRole("img", { name: annonce, exact: true });
}

Then(/^Léa voit Noisette avec « ([^«»]+) »$/, async ({ page }, libelle: string) => {
  const dessin = dessinAnnonce(page, `Noisette, avec ${libelle}`);
  await expect(dessin).toBeVisible({ timeout: DELAI_D_UN_APPEL_SERVEUR_MS });
  await expect(dessin).toHaveAttribute("data-tenue", cleDeLaTenue(libelle));
});

Then(/^Léa ne voit plus Noisette avec « ([^«»]+) »$/, async ({ page }, libelle: string) => {
  await expect(dessinAnnonce(page, `Noisette, avec ${libelle}`)).toHaveCount(0);
  await expect(ecranDe(page).locator(`[data-testid="personnage-guide"][data-tenue="${cleDeLaTenue(libelle)}"]`)).toHaveCount(0);
});

Then(/^Léa voit Noisette sans tenue$/, async ({ page }) => {
  const dessin = dessinAnnonce(page, "Noisette");
  await expect(dessin).toBeVisible({ timeout: DELAI_D_UN_APPEL_SERVEUR_MS });
  await expect(dessin).not.toHaveAttribute("data-tenue", /.+/);
});

/** Le libellé lu au lecteur d'écran : celui du dessin, de la section ou, pour une pastille non reçue, de son palier. */
Then(/^les lecteurs d'écran annoncent « ([^«»]+) »$/, { tags: "@issue-102" }, async ({ page }, annonce: string) => {
  const ecran = ecranDe(page);
  if (annonce.startsWith("Les tenues de Noisette, avec ")) {
    await expect(ecran.getByRole("region", { name: annonce, exact: true })).toBeVisible({ timeout: DELAI_D_UN_APPEL_SERVEUR_MS });
    return;
  }
  await expect(dessinAnnonce(page, annonce)).toBeVisible({ timeout: DELAI_D_UN_APPEL_SERVEUR_MS });
});

// --- Dans le paysage de l'univers (tous les écrans de l'enfant)

Then(/^(?:elle|il) voit (.+) avec « ([^«»]+) » dans le paysage de l'univers « (.+) »$/, async ({ page }, nom: string, libelle: string, univers: string) => {
  await expect(page.getByTestId("paysage")).toHaveAttribute("data-univers", cleDe(univers));
  const guide = leGuide(page, nom);
  await expect(guide).toBeVisible({ timeout: DELAI_D_UN_APPEL_SERVEUR_MS });
  await expect(guide).toHaveAttribute("data-tenue", cleDeLaTenue(libelle));
});

Then(/^(?:elle|il) voit (.+) dans le paysage de l'univers « (.+) », sans tenue$/, async ({ page }, nom: string, univers: string) => {
  await expect(page.getByTestId("paysage")).toHaveAttribute("data-univers", cleDe(univers));
  const guide = leGuide(page, nom);
  await expect(guide).toBeVisible({ timeout: DELAI_D_UN_APPEL_SERVEUR_MS });
  await expect(guide).not.toHaveAttribute("data-tenue", /.+/);
});

Then(/^le profil enfant de Léa montre le dessin validé de Noisette, sans tenue$/, async ({ page }) => {
  const profil = page.getByTestId("profil-a-choisir").filter({ hasText: "Léa" }).first();
  const dessin = profil.locator('[data-testid="personnage-guide"]');
  await expect(dessin).toHaveAttribute("data-dessin", "valide");
  for (const signe of ["ecureuil-rond", "queue-en-panache"]) {
    await expect(dessin.locator(`[data-signe="${signe}"]`), `signe « ${signe} »`).not.toHaveCount(0);
  }
  await expect(dessin).not.toHaveAttribute("data-tenue", /.+/);
});

Then(/^les lecteurs d'écran n'annoncent ni le paysage ni le dessin de Noisette$/, async ({ page }) => {
  await expect(page.getByTestId("paysage")).toBeAttached();
  for (const dessin of [page.getByTestId("paysage"), page.getByTestId("personnage-guide")]) {
    const cache = await dessin.evaluate((el) => {
      for (let courant: Element | null = el; courant; courant = courant.parentElement) {
        if (courant.getAttribute("aria-hidden") === "true") return true;
      }
      return false;
    });
    expect(cache, "paysage et dessin cachés des lecteurs d'écran").toBe(true);
  }
  await expect(page.getByRole("img", { name: /^Noisette/ })).toHaveCount(0);
});

// --- L'écran de fin

function annonceDeLaTenue(page: Page): Locator {
  return page.getByTestId("annonce-de-la-tenue");
}

Then(
  /^la fin de la séance annonce pour (Noisette|Coach Léo) « ([^«»]+) »$/,
  async ({ page }, nom: string, texte: string) => {
    const annonce = annonceDeLaTenue(page);
    await expect(annonce).toBeVisible({ timeout: DELAI_D_UN_APPEL_SERVEUR_MS });
    await expect(annonce.getByText(`Pour ${nom}`, { exact: true })).toBeVisible();
    await expect(annonce.getByText(texte, { exact: true })).toBeVisible();
    await expect(annonce.getByTestId("personnage-guide-de-l-annonce")).toBeVisible();
  },
);

Then(/^aucune annonce de nouvelle tenue n'apparaît à la fin de la séance$/, async ({ page }) => {
  // Le personnage guide ne dit sa phrase de fin qu'une fois décidé s'il y a une tenue reçue : on l'attend.
  await expect(bulle(page)).toHaveAttribute("data-nature", "felicitation", { timeout: DELAI_D_UN_APPEL_SERVEUR_MS });
  await expect(annonceDeLaTenue(page)).toBeEmpty();
  await expect(annonceDeLaTenue(page)).toBeHidden();
});

Then(
  /^la fin de la séance annonce, dans l'ordre, « ([^«»]+) » puis « ([^«»]+) »$/,
  async ({ page }, premiere: string, seconde: string) => {
    const cabane = page.getByTestId("annonce-de-la-cabane");
    const tenue = annonceDeLaTenue(page);
    await expect(tenue).toBeVisible({ timeout: DELAI_D_UN_APPEL_SERVEUR_MS });
    await expect(cabane.getByText(premiere, { exact: true })).toBeVisible();
    await expect(tenue.getByText(seconde, { exact: true })).toBeVisible();
    const tenueApresLaCabane = await cabane.evaluate(
      (premier, deuxieme) => Boolean(premier.compareDocumentPosition(deuxieme as Node) & Node.DOCUMENT_POSITION_FOLLOWING),
      await tenue.elementHandle(),
    );
    expect(tenueApresLaCabane, "l'annonce de la tenue vient juste après celle de la cabane").toBe(true);
  },
);

Then(/^l'annonce de la tenue reçue apparaît sans mouvement$/, async ({ page }) => {
  await expect(annonceDeLaTenue(page)).toBeVisible({ timeout: DELAI_D_UN_APPEL_SERVEUR_MS });
  await expect(annonceDeLaTenue(page)).toHaveCSS("animation-name", "none");
});

// --- Petit écran, mode dys, Espace parent

Then(/^chaque tenue à mettre et le choix de retirer la tenue mesurent au moins 44 px de haut$/, async ({ page }) => {
  const ecran = ecranDe(page);
  await expect(sectionDesTenues(ecran)).toBeVisible({ timeout: DELAI_D_UN_APPEL_SERVEUR_MS });
  const boutons = await ecran.getByTestId("tenue-a-mettre").all();
  expect(boutons.length).toBe(4);
  // Le choix de retirer n'existe que si une tenue est portée : on en met une, comme l'enfant, pour le mesurer.
  await boutons[0]?.click();
  for (const bouton of [...boutons, ecran.getByTestId("retirer-la-tenue")]) {
    await bouton.scrollIntoViewIfNeeded();
    const boite = await bouton.boundingBox();
    expect(boite, "bouton visible").not.toBeNull();
    expect(boite?.height ?? 0).toBeGreaterThanOrEqual(44);
  }
});

Then(
  /^Léa voit le titre, la phrase et les tenues de la section des tenues en mode dys : police Andika, lettres, mots et lignes espacés$/,
  async ({ page }) => {
    await expect(pastillesDesTenues(page).first()).toBeVisible({ timeout: DELAI_D_UN_APPEL_SERVEUR_MS });
    await verifierModeDys(
      page,
      [
        sectionDesTenues(page).getByRole("heading", { level: 2 }),
        page.getByTestId("phrase-des-tenues"),
        pastillesDesTenues(page).first(),
        page.getByTestId("tenue-a-mettre").first(),
      ],
      true,
    );
  },
);

Then(/^le mot « tenue » n'apparaît pas dans l'Espace parent$/, async ({ famille }) => {
  const page = await famille.page("tablette");
  await expect(page.getByRole("heading", { name: "Espace parent" }).first()).toBeVisible({ timeout: DELAI_D_UN_APPEL_SERVEUR_MS });
  await expect(page.locator("body")).not.toContainText(/tenue/i);
});
