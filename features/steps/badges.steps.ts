import { expect, type Locator, type Page } from "@playwright/test";
import type { DataTable } from "playwright-bdd";
import { bulle, entendu, etat } from "./etapes-puis-exercices.steps.ts";
import { ecranDe, lecturesParLot } from "./ecran-mes-medailles.steps.ts";
import { Given, Then, When } from "./fixtures.ts";
import { estSurUnProfilReel, rechargerAvecLeProfilReel } from "./profil-reel.ts";
import { verifierModeDys } from "./reglages.steps.ts";
import { normaliser, terminerLaLecture } from "./voix.steps.ts";

// Story #31 : un badge par leçon acquise, dans « Mes badges » de « Mes médailles » et à l'écran de fin.
//
// Les étoiles sont préparées par les étapes de #24, #25 et #32 (clé service_role réservée à la préparation, sur le vrai
// profil de Léa). Aucune donnée nouvelle n'est écrite en base : un badge n'est pas enregistré, il se déduit des meilleures
// étoiles. Seules les compétences des leçons de test (injectées dans la réponse de `/bibliotheque.json`) sont posées ici.

const TITRE_DE_LA_SECTION = "Mes badges";
const DELAI_D_UN_APPEL_SERVEUR_MS = 20_000;

// --- Étant donné : les compétences des leçons de test

async function donnerUneCompetence(page: Page, titre: string, competence: string): Promise<void> {
  const lecon = etat(page).injectees.find((candidate) => candidate.titre === titre);
  if (!lecon) throw new Error(`Leçon de test inconnue : ${titre}`);
  Object.assign(lecon, { competence });
  // L'accueil garde la bibliothèque pour toute la session : Léa la recharge pour y trouver la compétence.
  if (estSurUnProfilReel(page)) await rechargerAvecLeProfilReel(page);
}

Given(
  /^la leçon de test « ([^«»]+) » a pour compétence « ([^«»]+) »$/,
  async ({ page }, titre: string, competence: string) => {
    await donnerUneCompetence(page, titre, competence);
  },
);

Given(
  /^les leçons de test « ([^«»]+) » et « ([^«»]+) » ont pour compétence « ([^«»]+) »$/,
  async ({ page }, premiere: string, seconde: string, competence: string) => {
    await donnerUneCompetence(page, premiere, competence);
    await donnerUneCompetence(page, seconde, competence);
  },
);

// --- La section « Mes badges »

function sectionDesBadges(page: Page): Locator {
  return page.getByTestId("section-des-badges");
}

function pastillesDeBadge(page: Page): Locator {
  return page.getByTestId("pastille-de-badge");
}

function pastilleDe(page: Page, nom: string): Locator {
  return pastillesDeBadge(page).filter({ has: page.getByText(nom, { exact: true }) });
}

async function attendreLaSection(page: Page): Promise<void> {
  await expect(sectionDesBadges(page)).toBeVisible({ timeout: DELAI_D_UN_APPEL_SERVEUR_MS });
}

async function verifierLesBadges(page: Page, noms: readonly string[]): Promise<void> {
  const ecran = ecranDe(page);
  await attendreLaSection(ecran);
  await expect(pastillesDeBadge(ecran)).toHaveCount(noms.length, { timeout: DELAI_D_UN_APPEL_SERVEUR_MS });
  for (const [rang, nom] of noms.entries()) {
    await expect(pastillesDeBadge(ecran).nth(rang).getByText(nom, { exact: true })).toBeVisible();
  }
}

Then(/^les badges montrent seulement « ([^«»]+) »$/, async ({ page }, nom: string) => {
  await verifierLesBadges(page, [nom]);
});

Then(/^les badges montrent, dans l'ordre :$/, async ({ page }, tableau: DataTable) => {
  await verifierLesBadges(page, tableau.hashes().map((ligne) => String(ligne["badge"])));
});

Then(/^aucune pastille de badge n'apparaît$/, async ({ page }) => {
  const ecran = ecranDe(page);
  // La section est lue sur le serveur : on l'attend, sinon l'absence de pastille ne prouverait rien.
  await attendreLaSection(ecran);
  await expect(pastillesDeBadge(ecran)).toHaveCount(0);
});

Then(/^aucune section « Mes badges » n'apparaît$/, async ({ page }) => {
  const ecran = ecranDe(page);
  // La bulle du personnage guide n'apparaît qu'une fois la lecture des sections terminée.
  await expect(ecran.getByTestId("parole")).toBeVisible({ timeout: DELAI_D_UN_APPEL_SERVEUR_MS });
  await expect(sectionDesBadges(ecran)).toHaveCount(0);
  await expect(ecran.getByRole("heading", { level: 2, name: TITRE_DE_LA_SECTION })).toHaveCount(0);
});

const CODE_DE_MATIERE: Readonly<Record<string, { code: string; signe: string }>> = {
  "français": { code: "francais", signe: "Aa" },
  maths: { code: "maths", signe: "1+2" },
};

Then(
  /^la pastille « ([^«»]+) » montre l'icône de la matière (\S+)$/,
  async ({ page }, nom: string, matiere: string) => {
    const attendue = CODE_DE_MATIERE[matiere];
    if (!attendue) throw new Error(`Matière inconnue : ${matiere}`);
    const ecran = ecranDe(page);
    await attendreLaSection(ecran);
    const pastille = pastilleDe(ecran, nom);
    await expect(pastille).toHaveCount(1, { timeout: DELAI_D_UN_APPEL_SERVEUR_MS });
    await expect(pastille).toHaveAttribute("data-matiere", attendue.code);
    // L'icône est décorative : masquée aux lecteurs d'écran, elle ne porte que le signe de la matière.
    await expect(pastille.locator('[aria-hidden="true"]')).toHaveText(attendue.signe);
  },
);

// --- Toucher une pastille, écouter la section

When(/^Léa choisit la pastille « ([^«»]+) »$/, { tags: "@issue-31" }, async ({ page }, nom: string) => {
  await attendreLaSection(ecranDe(page));
  await pastilleDe(ecranDe(page), nom).click();
});

When(/^Léa demande à écouter les badges$/, async ({ page }) => {
  const section = sectionDesBadges(ecranDe(page));
  await section.getByRole("button", { name: "Écouter", exact: true }).click();
});

async function entendue(page: Page, texte: string): Promise<boolean> {
  const attendu = normaliser(entendu(texte));
  const lots = await lecturesParLot(page);
  if (lots.includes(attendu)) return true;
  await terminerLaLecture(page);
  return false;
}

Then(/^Léa entend Noisette lire « ([^«»]+) »$/, { tags: "@issue-31" }, async ({ page }, texte: string) => {
  await expect.poll(() => entendue(page, texte), { intervals: [100], timeout: DELAI_D_UN_APPEL_SERVEUR_MS }).toBe(true);
});

Then(/^Léa entend Noisette dire « ([^«»]+) »$/, { tags: "@issue-31" }, async ({ page }, texte: string) => {
  await expect.poll(() => entendue(page, texte), { intervals: [100], timeout: DELAI_D_UN_APPEL_SERVEUR_MS }).toBe(true);
});

// --- Accessibilité

Then(/^les lecteurs d'écran annoncent « ([^«»]+) »$/, { tags: "@issue-31" }, async ({ page }, annonce: string) => {
  const section = sectionDesBadges(ecranDe(page));
  const role = annonce.startsWith(`${TITRE_DE_LA_SECTION}, avec `) ? "list" : "button";
  await expect(section.getByRole(role, { name: annonce, exact: true })).toHaveCount(1, { timeout: DELAI_D_UN_APPEL_SERVEUR_MS });
});

Then(
  /^Léa voit le titre et les pastilles des badges en mode dys : police Andika, lettres, mots et lignes espacés$/,
  async ({ page }) => {
    const section = sectionDesBadges(page);
    await expect(pastillesDeBadge(page).first()).toBeVisible({ timeout: DELAI_D_UN_APPEL_SERVEUR_MS });
    await verifierModeDys(page, [section.getByRole("heading", { level: 2, name: TITRE_DE_LA_SECTION }), pastillesDeBadge(page).first()], true);
  },
);

// --- L'écran de fin

function annonceDuBadge(page: Page): Locator {
  return page.getByTestId("annonce-de-nouveau-badge");
}

Then(/^la fin de la séance annonce un nouveau badge « ([^«»]+) »$/, async ({ page }, nom: string) => {
  const annonce = annonceDuBadge(page);
  await expect(annonce).toBeVisible({ timeout: DELAI_D_UN_APPEL_SERVEUR_MS });
  await expect(annonce.getByText("Nouveau badge", { exact: true })).toBeVisible();
  await expect(annonce.getByText(nom, { exact: true })).toBeVisible();
});

Then(/^aucune annonce de nouveau badge n'apparaît à la fin de la séance$/, async ({ page }) => {
  // Le personnage guide ne dit sa phrase de fin qu'une fois décidé s'il y a un badge gagné : on l'attend.
  await expect(bulle(page)).toHaveAttribute("data-nature", "felicitation", { timeout: DELAI_D_UN_APPEL_SERVEUR_MS });
  await expect(annonceDuBadge(page)).toBeEmpty();
  await expect(annonceDuBadge(page)).toBeHidden();
});

Then(/^l'annonce de nouveau badge apparaît sans mouvement$/, async ({ page }) => {
  await expect(annonceDuBadge(page)).toBeVisible({ timeout: DELAI_D_UN_APPEL_SERVEUR_MS });
  await expect(annonceDuBadge(page)).toHaveCSS("animation-name", "none");
});

Then(/^la fin de la séance montre, dans l'ordre, l'annonce pour la cabane puis l'annonce de nouveau badge$/, async ({ page }) => {
  const cabane = page.getByTestId("annonce-de-la-cabane");
  await expect(cabane).toBeVisible({ timeout: DELAI_D_UN_APPEL_SERVEUR_MS });
  await expect(annonceDuBadge(page)).toBeVisible({ timeout: DELAI_D_UN_APPEL_SERVEUR_MS });
  const [haute, basse] = [await cabane.boundingBox(), await annonceDuBadge(page).boundingBox()];
  expect(haute, "annonce pour la cabane visible").not.toBeNull();
  expect(basse, "annonce de nouveau badge visible").not.toBeNull();
  expect(haute?.y ?? 0, "la cabane est au-dessus du badge").toBeLessThan(basse?.y ?? 0);
});
