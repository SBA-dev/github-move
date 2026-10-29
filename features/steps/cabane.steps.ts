import { expect, type Locator, type Page } from "@playwright/test";
import type { DataTable } from "playwright-bdd";
import { ecrireDesResultatsDeLecons } from "../support/supabase-test.ts";
import { EXPRESSIONS_PAR_PERSONNAGE, FELICITATIONS_COMMUNES } from "./univers.steps.ts";
import { bulle, entendu, toutesLesParoles } from "./etapes-puis-exercices.steps.ts";
import { ecranDe } from "./ecran-mes-medailles.steps.ts";
import { Given, Then, When } from "./fixtures.ts";
import { profilDe } from "./profils-enfants.steps.ts";
import { verifierModeDys } from "./reglages.steps.ts";
import { normaliser, terminerLaLecture } from "./voix.steps.ts";

// Story #32 : la cabane de Noisette dans « Mes médailles » et sur l'écran de fin.
//
// Les étoiles sont préparées en base (clé service_role réservée à la préparation) sur des leçons de test « e2e-32- »
// absentes de la bibliothèque ; elles partent avec le profil enfant (suppression en cascade). L'enfant, lui, agit
// toujours par l'interface.

const TITRE_DE_LA_CABANE = "La cabane de Noisette";
const DELAI_D_UN_APPEL_SERVEUR_MS = 20_000;
const ETOILES_PAR_LECON = 3;

// --- Étant donné : les étoiles préparées

function repartirEnLecons(prefixe: string, total: number): Array<{ lecon: string; meilleuresEtoiles: number }> {
  const lecons: Array<{ lecon: string; meilleuresEtoiles: number }> = [];
  for (let reste = total, rang = 1; reste > 0; reste -= ETOILES_PAR_LECON, rang++) {
    lecons.push({ lecon: `${prefixe}-${rang}`, meilleuresEtoiles: Math.min(ETOILES_PAR_LECON, reste) });
  }
  return lecons;
}

Given(/^(Léa|Tom) a gagné (\d+) étoiles? en tout$/, async ({ famille }, prenom: string, total: string) => {
  const profil = profilDe(famille, prenom);
  await ecrireDesResultatsDeLecons(profil.id, repartirEnLecons(`e2e-32-${prenom.toLowerCase()}`, Number(total)));
});

Given(
  /^Léa a (\d+) étoiles? à une leçon « ([^«»]+) » qui n'est plus dans la bibliothèque$/,
  async ({ famille }, etoiles: string, _titre: string) => {
    await ecrireDesResultatsDeLecons(profilDe(famille, "Léa").id, [{ lecon: "e2e-32-anciens-sons", meilleuresEtoiles: Number(etoiles) }]);
  },
);

// --- La section

function sectionDeLaCabane(page: Page): Locator {
  return page.getByRole("region", { name: TITRE_DE_LA_CABANE, exact: true });
}

function pastillesDeLaCabane(page: Page): Locator {
  return page.getByTestId("pastille-de-la-cabane");
}

Then(/^les pastilles de la cabane montrent, dans l'ordre :$/, async ({ page }, tableau: DataTable) => {
  const attendues = tableau.hashes().map((ligne) => String(ligne["pastille"]));
  await expect(pastillesDeLaCabane(page)).toHaveCount(attendues.length, { timeout: DELAI_D_UN_APPEL_SERVEUR_MS });
  for (const [rang, libelle] of attendues.entries()) {
    await expect(pastillesDeLaCabane(page).nth(rang).getByText(libelle, { exact: true })).toBeVisible();
  }
});

Then(/^aucune section « La cabane de Noisette » n'apparaît$/, async ({ page }) => {
  // La bulle du personnage guide n'apparaît qu'une fois la lecture des sections terminée.
  await expect(page.getByTestId("parole")).toBeVisible({ timeout: DELAI_D_UN_APPEL_SERVEUR_MS });
  await expect(sectionDeLaCabane(page)).toHaveCount(0);
  await expect(page.getByRole("heading", { level: 2, name: TITRE_DE_LA_CABANE })).toHaveCount(0);
});

When(/^Léa demande à écouter la cabane$/, async ({ page }) => {
  await sectionDeLaCabane(page).getByRole("button", { name: "Écouter", exact: true }).click();
});

Then(/^Léa lit « ([^«»]+) »$/, { tags: "@issue-32 or @issue-31 or @issue-102" }, async ({ page }, message: string) => {
  await expect(ecranDe(page).getByText(message, { exact: true })).toBeVisible({ timeout: DELAI_D_UN_APPEL_SERVEUR_MS });
});

When(/^Léa choisit la pastille « ([^«»]+) »$/, { tags: "@issue-32" }, async ({ page }, libelle: string) => {
  await pastillesDeLaCabane(page).filter({ hasText: libelle }).first().click();
});

/** Le dessin porte le libellé lu ; une pastille non atteinte affiche « 10 ★ » aux yeux et lit « 10 étoiles ». */
Then(/^les lecteurs d'écran annoncent « ([^«»]+) »$/, { tags: "@issue-32" }, async ({ page }, annonce: string) => {
  if (annonce.startsWith(`${TITRE_DE_LA_CABANE}, avec `)) {
    await expect(sectionDeLaCabane(ecranDe(page)).getByRole("img", { name: annonce, exact: true })).toBeVisible({
      timeout: DELAI_D_UN_APPEL_SERVEUR_MS,
    });
    return;
  }
  const palier = /^(\d+) étoiles$/.exec(annonce)?.[1];
  const ecran = ecranDe(page);
  const pastille = pastillesDeLaCabane(ecran).filter({ has: ecran.getByText(annonce, { exact: true }) });
  await expect(pastille).toHaveCount(1, { timeout: DELAI_D_UN_APPEL_SERVEUR_MS });
  await expect(pastille.locator('[aria-hidden="true"]')).toHaveText(`${palier} ★`);
});

Then(
  /^Léa voit la phrase et les pastilles de la cabane en mode dys : police Andika, lettres, mots et lignes espacés$/,
  async ({ page }) => {
    await expect(pastillesDeLaCabane(page).first()).toBeVisible({ timeout: DELAI_D_UN_APPEL_SERVEUR_MS });
    await verifierModeDys(page, [page.getByTestId("phrase-de-la-cabane"), pastillesDeLaCabane(page).first()], true);
  },
);

// --- L'écran de fin

function annonceDeFin(page: Page): Locator {
  return page.getByTestId("annonce-de-la-cabane");
}

Then(/^la fin de la séance annonce pour la cabane « ([^«»]+) »$/, async ({ page }, texte: string) => {
  const annonce = annonceDeFin(page);
  await expect(annonce).toBeVisible({ timeout: DELAI_D_UN_APPEL_SERVEUR_MS });
  await expect(annonce.getByText("Pour la cabane", { exact: true })).toBeVisible();
  await expect(annonce.getByText(texte, { exact: true })).toBeVisible();
});

Then(/^aucune annonce pour la cabane n'apparaît à la fin de la séance$/, async ({ page }) => {
  // Le personnage guide ne dit sa phrase de fin qu'une fois décidé s'il y a un objet reçu : on l'attend.
  await expect(bulle(page)).toHaveAttribute("data-nature", "felicitation", { timeout: DELAI_D_UN_APPEL_SERVEUR_MS });
  await expect(annonceDeFin(page)).toBeEmpty();
  await expect(annonceDeFin(page)).toBeHidden();
});

Then(/^l'annonce pour la cabane apparaît sans mouvement$/, async ({ page }) => {
  await expect(annonceDeFin(page)).toBeVisible({ timeout: DELAI_D_UN_APPEL_SERVEUR_MS });
  await expect(annonceDeFin(page)).toHaveCSS("animation-name", "none");
});

Then(/^Coach Léo dit une félicitation, suivie de « (.+) »$/, async ({ page }, explication: string) => {
  await expect(bulle(page)).toHaveAttribute("data-nature", "felicitation", { timeout: DELAI_D_UN_APPEL_SERVEUR_MS });
  const texte = normaliser((await bulle(page).textContent()) ?? "");
  expect(texte.endsWith(` ${explication}`), texte).toBe(true);
  const felicitations = [...FELICITATIONS_COMMUNES, ...(EXPRESSIONS_PAR_PERSONNAGE["Coach Léo"] ?? [])];
  expect(felicitations).toContain(texte.slice(0, texte.length - explication.length - 1));
  // La phrase est lue en plusieurs morceaux : on les laisse finir un à un.
  const sansEspace = (t: string) => t.replace(/[\s,]+/g, "");
  await expect.poll(async () => {
    const dites = (await toutesLesParoles(page)).join("");
    if (sansEspace(dites).includes(sansEspace(entendu(texte)))) return true;
    await terminerLaLecture(page);
    return false;
  }, { intervals: [100], timeout: DELAI_D_UN_APPEL_SERVEUR_MS }).toBe(true);
});
