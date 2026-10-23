import { expect, type Page, test } from "@playwright/test";
import { ouvrirApplicationActuelle } from "./ouvrir.ts";
import {
  bibliotheque,
  type Docs,
  jouerJusquALaFin,
  leconParId,
  lireDocs,
  ouvrirLeconDepuisToutesLesLecons,
  preparerNavigateur,
  profilEnfant,
  reponsesDe,
} from "./outils.ts";

const JOUR = 864e5;
const lea = profilEnfant("enfant_lea", { prenom: "Léa", niveau: "CP" });
const debutDuJour = (page: Page, plus: number) =>
  page.evaluate((plus) => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    return d.getTime() + plus * 864e5;
  }, plus);

// Douze questions à choix de la bibliothèque, déjà en retard de révision (la plus ancienne en premier).
const questions = bibliotheque.flatMap((l) => l.exercices.filter((e) => e.type === "bulles").flatMap((e) => e.questions ?? [])).slice(0, 12);
// Même clé que l'application : « b: » suivi de la question et de la réponse normalisées.
const normaliser = (s: string) =>
  s.normalize("NFKD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/[’']/g, "'").replace(/\s+/g, " ").trim();
const cles = questions.map((q) => `b:${normaliser(q.question + q.reponse)}`);
const cle = (i: number) => cles[i - 1] ?? "";
function erreursEnRetard(n: number, box = 0): Docs {
  const items = Object.fromEntries(questions.slice(0, n).map((q, i) => [
    cle(i + 1),
    { ex: { type: "bulles", questions: [q] }, titre: "Une leçon", box, due: Date.now() - (n - i) * 60_000 - JOUR, fails: 1, vu: 0 },
  ]));
  return { revoir_enfant_lea: { kind: "revoir", enfant: "enfant_lea", items, acquis: 0 } };
}
const bonnesReponses = Object.fromEntries(questions.map((q) => [q.question, q.reponse]));

async function commencerLaRevision(page: Page, docs: Docs) {
  await preparerNavigateur(page, { docs: { ...lea, ...docs } });
  await ouvrirApplicationActuelle(page);
  await page.locator(".profile", { hasText: "Léa" }).click();
  await page.getByRole("button", { name: /À revoir/ }).click();
  await expect(page.getByRole("heading", { level: 2, name: "Je révise mes erreurs" })).toBeVisible();
}

test("une erreur dans une leçon programme sa révision pour le lendemain", async ({ page }) => {
  const lecon = leconParId("hg-cp-plan-ecole");
  const [premiere = ["", ""], ...autres] = Object.entries(reponsesDe(lecon));
  await preparerNavigateur(page, { docs: lea });
  await ouvrirApplicationActuelle(page);
  await ouvrirLeconDepuisToutesLesLecons(page, "Léa", lecon);
  await jouerJusquALaFin(page, { reponses: Object.fromEntries(autres) });

  const revoir = (await lireDocs(page)).revoir_enfant_lea as { items: Record<string, { ex: unknown; box: number; due: number; fails: number; titre: string }> };
  expect(Object.values(revoir.items)).toEqual([
    expect.objectContaining({ box: 0, fails: 1, titre: lecon.titre, due: await debutDuJour(page, 1), ex: { type: "bulles", questions: [expect.objectContaining({ question: premiere[0] })] } }),
  ]);
  await page.getByRole("button", { name: "Accueil" }).last().click();
  await expect(page.getByRole("button", { name: /À revoir/ })).toHaveCount(0);
});

test("une erreur dont la révision est arrivée apparaît sur l'accueil, dans « À revoir »", async ({ page }) => {
  await preparerNavigateur(page, { docs: { ...lea, ...erreursEnRetard(1) } });
  await ouvrirApplicationActuelle(page);
  await page.locator(".profile", { hasText: "Léa" }).click();

  await expect(page.getByRole("button", { name: /À revoir/ })).toContainText("1 petite erreur des jours passés");
});

test("la révision reprend au plus 10 questions, les plus anciennes d'abord", async ({ page }) => {
  await commencerLaRevision(page, erreursEnRetard(12));

  await expect(page.locator(".progress-dots i")).toHaveCount(10);
  await jouerJusquALaFin(page, { reponses: bonnesReponses });

  const { items } = (await lireDocs(page)).revoir_enfant_lea as { items: Record<string, { box: number; due: number }> };
  const dansTroisJours = await debutDuJour(page, 3);
  for (let i = 1; i <= 10; i++) expect(items[cle(i)]).toMatchObject({ box: 1, due: dansTroisJours });
  for (const i of [11, 12]) expect(items[cle(i)]).toMatchObject({ box: 0 });
});

test("une question réussie à sa troisième révision (après 1, 3 puis 7 jours) est acquise et sort des révisions", async ({ page }) => {
  await commencerLaRevision(page, erreursEnRetard(1, 2));
  await jouerJusquALaFin(page, { reponses: bonnesReponses });

  expect((await lireDocs(page)).revoir_enfant_lea).toMatchObject({ items: {}, acquis: 1 });
});

test("une question encore ratée en révision revient le lendemain", async ({ page }) => {
  await commencerLaRevision(page, erreursEnRetard(1));
  await jouerJusquALaFin(page);

  const { items } = (await lireDocs(page)).revoir_enfant_lea as { items: Record<string, { box: number; due: number; fails: number }> };
  expect(items[cle(1)]).toMatchObject({ box: 0, fails: 2, due: await debutDuJour(page, 1) });
});
