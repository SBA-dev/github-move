import { expect, type Page, test } from "@playwright/test";
import { ouvrirApplicationActuelle } from "./ouvrir.ts";
import {
  type Docs,
  jouerJusquALaFin,
  leconParId,
  lireDocs,
  ouvrirLeconDepuisToutesLesLecons,
  preparerNavigateur,
  profilEnfant,
  progression,
  reponsesDe,
} from "./outils.ts";

// « Se repérer autour de l'école » (CP) : une leçon de quatre questions à choix.
// Chaque « Je ne sais pas » compte une erreur.
const quatreQuestions = leconParId("hg-cp-plan-ecole");
const lea = profilEnfant("enfant_lea", { prenom: "Léa", niveau: "CP" });

async function jouerAvecErreurs(page: Page, erreurs: number, docs: Docs = lea) {
  await preparerNavigateur(page, { docs });
  await ouvrirApplicationActuelle(page);
  await ouvrirLeconDepuisToutesLesLecons(page, "Léa", quatreQuestions);
  const reponses = Object.entries(reponsesDe(quatreQuestions)).slice(erreurs);
  await jouerJusquALaFin(page, { reponses: Object.fromEntries(reponses) });
}

const etoilesAllumees = (page: Page) => page.locator(".medal .big-stars svg.on");

for (const [erreurs, etoiles] of [[0, 3], [1, 2], [3, 2], [4, 1]] as const) {
  test(`une leçon finie avec ${erreurs} erreur${erreurs > 1 ? "s" : ""} rapporte ${etoiles} étoile${etoiles > 1 ? "s" : ""}`, async ({ page }) => {
    await jouerAvecErreurs(page, erreurs);

    await expect(etoilesAllumees(page)).toHaveCount(etoiles);
    const docs = await lireDocs(page);
    expect(docs[`progres_enfant_lea_${quatreQuestions.id}`]).toMatchObject({ etoiles, dernieresEtoiles: etoiles, erreurs, essais: 1 });
  });
}

test("rejouer moins bien garde le meilleur nombre d'étoiles, et retient le dernier résultat à part", async ({ page }) => {
  await jouerAvecErreurs(page, 4, { ...lea, ...progression("enfant_lea", quatreQuestions, { etoiles: 3, essais: 1 }) });

  await expect(etoilesAllumees(page)).toHaveCount(1);
  const docs = await lireDocs(page);
  expect(docs[`progres_enfant_lea_${quatreQuestions.id}`]).toMatchObject({ etoiles: 3, dernieresEtoiles: 1, erreurs: 4, essais: 2 });
});

async function ouvrirParcours(page: Page, docs: Docs) {
  await preparerNavigateur(page, { docs });
  await ouvrirApplicationActuelle(page);
  await page.locator(".profile", { hasText: "Léa" }).click();
  await page.getByRole("button", { name: "Mon parcours" }).click();
}
const etape = (page: Page, titre: string) => page.locator(".path .step", { has: page.locator(`.t:text-is(${JSON.stringify(titre)})`) });

test("dans le parcours, la leçon suivante de sa classe reste verrouillée tant que la précédente n'est pas réussie", async ({ page }) => {
  await ouvrirParcours(page, lea);

  await expect(page.locator('.subj-tab[aria-selected="true"]')).toHaveText(/Français/);
  await expect(etape(page, "Les sons ou, on, an").locator(".stat")).toHaveText("À toi !");
  await expect(etape(page, "Les syllabes")).toBeDisabled();
  await expect(etape(page, "Les syllabes").locator(".stat")).toHaveText("Plus tard");
});

test("une leçon réussie (1 étoile) ouvre la suivante du parcours", async ({ page }) => {
  await ouvrirParcours(page, { ...lea, ...progression("enfant_lea", leconParId("fr-cp-sons-ou-on-an"), { etoiles: 1 }) });

  await expect(etape(page, "Les sons ou, on, an").locator(".stat")).toHaveText("★");
  await expect(etape(page, "Les syllabes")).toBeEnabled();
  await expect(etape(page, "Les syllabes").locator(".stat")).toHaveText("À toi !");
  await expect(etape(page, "Dictée : les animaux")).toBeDisabled();
});

test("en parcours libre, aucune leçon n'est verrouillée", async ({ page }) => {
  await ouvrirParcours(page, profilEnfant("enfant_lea", { prenom: "Léa", niveau: "CP", libre: true }));

  await expect(etape(page, "Les sons ou, on, an").locator(".stat")).toHaveText("À toi !");
  await expect(page.locator(".path .step.locked")).toHaveCount(0);
  await expect(etape(page, "Les syllabes").locator(".stat")).toHaveText("À découvrir");
});

test("les leçons des classes d'avant restent ouvertes, en révision", async ({ page }) => {
  await ouvrirParcours(page, profilEnfant("enfant_lea", { prenom: "Léa", niveau: "CE1" }));

  const revisions = page.locator("details.revisions");
  await expect(revisions.locator("summary")).toHaveText("Revoir les classes d'avant (21 leçons)");
  await revisions.locator("summary").click();
  await expect(revisions.locator(".step.locked")).toHaveCount(0);
  await expect(revisions.locator(".step .num").first()).toHaveText("CP");
});

test("« Toutes les leçons » ouvre aussi une leçon encore verrouillée dans le parcours", async ({ page }) => {
  await ouvrirParcours(page, lea);
  await page.getByRole("tab", { name: "Histoire-géo" }).click();
  await expect(etape(page, quatreQuestions.titre)).toBeDisabled();

  await page.getByRole("button", { name: "Toutes les leçons" }).click();
  await page.locator(`.grid-lessons .lesson:has(.t:text-is(${JSON.stringify(quatreQuestions.titre)}))`).click();

  await expect(page.getByRole("button", { name: "Leçon et tous les jeux" })).toBeVisible();
});

test("l'écran de fin propose la leçon suivante du parcours de la même matière", async ({ page }) => {
  const premiere = leconParId("fr-cp-sons-ou-on-an");
  await preparerNavigateur(page, { docs: lea });
  await ouvrirApplicationActuelle(page);
  await ouvrirLeconDepuisToutesLesLecons(page, "Léa", premiere);
  await jouerJusquALaFin(page, { reponses: reponsesDe(premiere) });

  await expect(page.getByRole("button", { name: "Leçon suivante ›" })).toHaveAttribute("title", "Les syllabes");
  await expect(page.locator(".medal")).toContainText("Ensuite : Les syllabes");
});

test("après une leçon jouée hors de l'ordre, « Leçon suivante » propose la prochaine leçon conseillée, d'une autre matière", async ({ page }) => {
  await jouerAvecErreurs(page, 0);

  await expect(page.getByRole("button", { name: "Leçon suivante ›" })).toHaveAttribute("title", "Les sons ou, on, an");
});
