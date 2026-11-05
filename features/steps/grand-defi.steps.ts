import { expect, type Locator, type Page } from "@playwright/test";
import { profilDe } from "./profils-enfants.steps.ts";
import { attendreLaFinDeLaSeance, partie } from "./etoiles-et-fin-de-seance.steps.ts";
import { Given, Then, When } from "./fixtures.ts";
import { preparerLesEtoiles } from "./parcours.steps.ts";
import {
  dessin,
  type Deroule,
  ecranDuDefi,
  entetesDuParent,
  entetesServiceRole,
  finDuDefi,
  jourLocal,
  jouerLeDefi,
  laLeconAvantLeRepere,
  leconDeLaQuestion,
  leconsDeTestDeLaMatiere,
  ouvrirLeParcoursDeMaths,
  pageDuParcours,
  partie100,
  repere,
  revenirAuParcours,
  variable,
} from "./defi-de-fin-de-partie.steps.ts";

// Story #137 : grand défi de la matière.
//
// Le grand défi passe par le même code que le défi d'une partie du parcours (#100) : ses étapes réutilisent celles de
// #100 (écran, fin du défi, effets sonores, révision) et la bibliothèque de test « e2e-100- ». Ici : le repère « Grand
// défi » (data-grand-defi="true", sans numéro), l'annonce de fin de séance, le tirage des 12 questions et la table
// `grands_defis_termines` (écrite en base par la clé service_role pour préparer un grand défi déjà relevé, comme #100
// pour `defis_termines` ; les lignes partent en cascade avec le profil enfant).

type Matiere = "maths" | "sciences";
const ONGLET_DE: Record<Matiere, string> = { maths: "Maths", sciences: "Sciences" };

const repereDuGrandDefi = (page: Page): Locator => repere(page).and(page.locator('[data-grand-defi="true"]'));
const reperesDUnePartie = (page: Page): Locator => repere(page).and(page.locator("[data-numero]"));

// --- Préparation en base

async function ecrireUnGrandDefiTermine(profil: string, matiere: Matiere): Promise<void> {
  const maintenant = new Date();
  const reponse = await fetch(`${variable("SUPABASE_URL")}/rest/v1/grands_defis_termines`, {
    method: "POST",
    headers: entetesServiceRole(),
    body: JSON.stringify({
      id: crypto.randomUUID(),
      profil,
      matiere,
      classe: "CE1",
      termine_le: maintenant.toISOString(),
      jour: jourLocal(maintenant),
    }),
  });
  if (!reponse.ok) throw new Error(`grands_defis_termines : ${reponse.status} ${await reponse.text()}`);
}

async function lignesDe(table: string, profil: string): Promise<unknown[]> {
  const reponse = await fetch(`${variable("SUPABASE_URL")}/rest/v1/${table}?select=id&profil=eq.${encodeURIComponent(profil)}`, {
    headers: entetesServiceRole(),
  });
  if (!reponse.ok) throw new Error(`${table} : ${reponse.status} ${await reponse.text()}`);
  return (await reponse.json()) as unknown[];
}

// --- Le grand défi, depuis « Mon parcours »

async function releverLeGrandDefi(page: Page, matiere: Matiere): Promise<void> {
  await ouvrirLeParcoursDeMaths(page, "Léa", ONGLET_DE[matiere]);
  await expect(repereDuGrandDefi(page)).toHaveCount(1, { timeout: 20_000 });
  await repereDuGrandDefi(page).getByRole("button", { name: "Relever le défi", exact: true }).click();
  await expect(ecranDuDefi(page)).toBeVisible();
}

/** Le grand défi est le dernier repère de la liste : juste après la dernière leçon, avant le fanion (fin du dessin). */
async function verifierLaPlaceAuFanion(page: Page, cible: Locator, place: string): Promise<void> {
  expect(await laLeconAvantLeRepere(cible), "leçon juste avant le repère").toBe(`Leçon ${place}`);
  const prochainDansLaListe = await cible.evaluate((element) => element.closest("li")?.nextElementSibling !== null);
  expect(prochainDansLaListe, "le repère est la dernière ligne de la liste des leçons").toBe(false);
  const fanionApresLaListe = await cible.evaluate((element) =>
    element.closest("ol")?.nextElementSibling?.getAttribute("data-testid") === "fin-du-dessin"
  );
  expect(fanionApresLaListe, "le fanion suit la liste des leçons").toBe(true);
  await expect(dessin(page).getByTestId("fin-du-dessin")).toHaveCount(1);
}

async function verifierLeGrandDefi(
  page: Page,
  genre: "aVenir" | "ouvert" | "releve",
  nom: string,
): Promise<Locator> {
  const cible = repereDuGrandDefi(page);
  await expect(cible).toHaveCount(1, { timeout: 20_000 });
  await expect(cible).not.toHaveAttribute("data-numero", /.*/);
  await expect(cible).toHaveAttribute("data-etat", genre);
  await expect(cible).toHaveAccessibleName(nom);
  return cible;
}

// --- Étant donné

Given(/^Léa n'a encore relevé aucun défi$/, async ({ famille }) => {
  const profil = profilDe(famille, "Léa").id;
  expect(await lignesDe("defis_termines", profil), "défis d'une partie du parcours relevés").toEqual([]);
  expect(await lignesDe("grands_defis_termines", profil), "grands défis relevés").toEqual([]);
});

Given(/^Léa a réussi toutes les leçons de maths du CE1, sauf « (Maths \d+) »$/, async ({ famille, page }, titre: string) => {
  const lecons = leconsDeTestDeLaMatiere("maths", 10).filter((lecon) => lecon.titre !== titre);
  await preparerLesEtoiles(famille, page, "Léa", lecons);
});

Given(/^Léa a commencé le grand défi des (maths|sciences)$/, async ({ page }, matiere: Matiere) => {
  await releverLeGrandDefi(page, matiere);
});

Given(/^Léa a relevé le grand défi des maths$/, async ({ famille }) => {
  await ecrireUnGrandDefiTermine(profilDe(famille, "Léa").id, "maths");
});

Given(/^Léa a relevé le grand défi des maths sur la tablette$/, async ({ famille }) => {
  await ecrireUnGrandDefiTermine(profilDe(famille, "Léa").id, "maths");
});

Given(/^Léa a relevé deux fois le grand défi des maths$/, async ({ famille }) => {
  await ecrireUnGrandDefiTermine(profilDe(famille, "Léa").id, "maths");
  await ecrireUnGrandDefiTermine(profilDe(famille, "Léa").id, "maths");
});

/** Joué dans le navigateur : la première question posée est ratée une fois, les autres sont justes. */
Given(/^Léa a relevé le grand défi des maths, en se trompant à sa première question$/, async ({ page }) => {
  await releverLeGrandDefi(page, "maths");
  let premiere = true;
  const deroule: Deroule = () => {
    const maniere = premiere ? "erreur" : "juste";
    premiere = false;
    return maniere;
  };
  await jouerLeDefi(page, deroule);
  await revenirAuParcours(page);
});

Given(/^Léa a choisi « Rejouer le défi » sur le repère « Grand défi » de maths$/, async ({ page }) => {
  await ouvrirLeParcoursDeMaths(page);
  const cible = await verifierLeGrandDefi(page, "releve", "Grand défi : relevé");
  await expect(cible.getByRole("button"), "le repère d'un défi relevé propose de le rejouer").toHaveCount(1);
  await cible.getByRole("button", { name: "Rejouer le défi", exact: true }).click();
  await expect(ecranDuDefi(page)).toBeVisible();
});

// --- Quand

When(/^Léa relève le grand défi des maths depuis son parcours$/, async ({ page }) => {
  await releverLeGrandDefi(page, "maths");
});

When(/^Claire demande les défis relevés du profil enfant de Léa$/, { tags: "@issue-137" }, async ({ famille }) => {
  const jeton = (await famille.session(await famille.page("telephone")))?.access_token;
  if (jeton === undefined) throw new Error("Claire n'est pas connectée sur le téléphone");
  const reponse = await fetch(
    `${variable("SUPABASE_URL")}/rest/v1/grands_defis_termines?select=*&profil=eq.${encodeURIComponent(profilDe(famille, "Léa").id)}`,
    { headers: entetesDuParent(jeton) },
  );
  partie(famille).lignesLues = { statut: reponse.status, lignes: reponse.ok ? ((await reponse.json()) as Record<string, unknown>[]) : [] };
});

// --- Alors : le repère « Grand défi » sur « Mon parcours »

Then(
  /^le dessin du parcours montre le repère « Grand défi » à venir, après la leçon (\d+), près du fanion, avec « (Encore \d+ leçons? pour ouvrir le défi) »$/,
  async ({ famille, page }, place: string, texte: string) => {
    const cible = pageDuParcours(famille, page);
    const reste = /\d+/.exec(texte)?.[0] ?? "";
    const restantes = `encore ${reste} leçon${Number(reste) > 1 ? "s" : ""} pour ouvrir le défi`;
    const repereDuDefi = await verifierLeGrandDefi(cible, "aVenir", `Grand défi : à venir, ${restantes}`);
    await expect(repereDuDefi).toContainText(texte);
    await verifierLaPlaceAuFanion(cible, repereDuDefi, place);
  },
);

Then(/^le repère « Grand défi » n'a pas de cadenas et ne propose pas « Relever le défi »$/, async ({ famille, page }) => {
  const cible = repereDuGrandDefi(pageDuParcours(famille, page));
  await expect(cible).toHaveAttribute("data-etat", "aVenir");
  await expect(cible.getByRole("button")).toHaveCount(0);
  await expect(cible).not.toContainText("Relever le défi");
  await expect(cible.locator('[data-testid*="cadenas" i], [aria-label*="cadenas" i], [aria-label*="verrouill" i]')).toHaveCount(0);
  expect(await cible.textContent()).not.toMatch(/🔒|🔐|cadenas|verrouill/i);
  expect(await cible.getAttribute("aria-disabled")).toBeNull();
});

Then(
  /^le dessin du parcours montre le repère « Grand défi » ouvert, après la leçon (\d+), près du fanion, avec « Relever le défi »$/,
  async ({ famille, page }, place: string) => {
    const cible = pageDuParcours(famille, page);
    const repereDuDefi = await verifierLeGrandDefi(cible, "ouvert", "Grand défi : ouvert");
    await expect(repereDuDefi.getByRole("button", { name: "Relever le défi", exact: true })).toBeVisible();
    await verifierLaPlaceAuFanion(cible, repereDuDefi, place);
  },
);

Then(
  /^le dessin du parcours montre, en plus, un seul défi d'une partie du parcours, « Défi (\d+) », après la leçon (\d+)$/,
  async ({ famille, page }, numero: string, place: string) => {
    const cible = pageDuParcours(famille, page);
    await expect(dessin(cible).getByTestId("lecon-du-parcours").first()).toBeVisible();
    await expect(reperesDUnePartie(cible)).toHaveCount(1);
    const unique = reperesDUnePartie(cible);
    await expect(unique).toHaveAttribute("data-numero", String(numero));
    expect(await laLeconAvantLeRepere(unique), "leçon juste avant le repère").toBe(`Leçon ${place}`);
  },
);

Then(/^le dessin du parcours montre, en plus, aucun défi d'une partie du parcours$/, async ({ famille, page }) => {
  const cible = pageDuParcours(famille, page);
  await expect(dessin(cible).getByTestId("lecon-du-parcours").first()).toBeVisible();
  await expect(repereDuGrandDefi(cible)).toHaveCount(1);
  await expect(reperesDUnePartie(cible)).toHaveCount(0);
});

Then(
  /^le dessin du parcours montre le repère « Grand défi » relevé, avec « Défi relevé » et « Rejouer le défi »$/,
  async ({ famille, page }) => {
    const cible = await verifierLeGrandDefi(pageDuParcours(famille, page), "releve", "Grand défi : relevé");
    await expect(cible).toContainText("Défi relevé");
    await expect(cible.getByRole("button", { name: "Rejouer le défi", exact: true })).toBeVisible();
  },
);

Then(/^le repère « Grand défi » mesure au moins 44 px de haut$/, async ({ famille, page }) => {
  const cible = repereDuGrandDefi(pageDuParcours(famille, page));
  await expect(cible).toBeVisible();
  const boite = await cible.boundingBox();
  expect(boite, "repère visible").not.toBeNull();
  expect(boite?.height ?? 0).toBeGreaterThanOrEqual(44);
});

// --- Alors : la fin de la séance

Then(/^la fin de la séance annonce « (Le grand défi des [^«»]+ est ouvert !) »$/, { tags: "@issue-137" }, async ({ page }, texte: string) => {
  await attendreLaFinDeLaSeance(page);
  const annonce = page.getByTestId("annonce-du-defi-ouvert");
  await expect(annonce).toHaveText(texte, { timeout: 20_000 });
  await expect(annonce).toHaveAttribute("role", "status");
});

Then(/^la fin de la séance n'annonce pas « (Le défi \d+ est ouvert !) »$/, { tags: "@issue-137" }, async ({ page }, texte: string) => {
  await attendreLaFinDeLaSeance(page);
  await expect(page.getByTestId("annonce-du-defi-ouvert")).not.toContainText(texte);
  await expect(page.getByTestId("fin-de-seance")).not.toContainText(texte);
});

Then(/^la fin de la séance propose « Relever le défi »$/, async ({ page }) => {
  const fin = page.getByTestId("fin-de-seance");
  await expect(fin.getByRole("button", { name: "Relever le défi", exact: true })).toHaveCount(1, { timeout: 20_000 });
});

// --- Alors : les questions du grand défi

Then(
  /^Léa a eu 12 questions, au moins une et au plus 2 de chacune des leçons « Maths (\d+) » à « Maths (\d+) », sans suivre l'ordre des leçons$/,
  async ({ page }, premiere: string, derniere: string) => {
    const posees = partie100(page).posees;
    expect(posees, "questions posées").toHaveLength(12);
    const numeros = posees.map((enonce) => Number(/^Maths (\d+)$/.exec(leconDeLaQuestion(enonce).titre)?.[1]));
    for (let n = Number(premiere); n <= Number(derniere); n++) {
      const nombre = numeros.filter((numero) => numero === n).length;
      expect(nombre, `questions de « Maths ${n} »`).toBeGreaterThanOrEqual(1);
      expect(nombre, `questions de « Maths ${n} »`).toBeLessThanOrEqual(2);
    }
    const dansLOrdre = numeros.every((numero, rang) => rang === 0 || (numeros[rang - 1] as number) <= numero);
    expect(dansLOrdre, `ordre des leçons des questions : ${numeros.join(", ")}`).toBe(false);
  },
);

Then(
  /^Léa a eu 6 questions, les 2 de chacune des leçons « ([^«»]+) », « ([^«»]+) » et « ([^«»]+) »$/,
  async ({ page }, a: string, b: string, c: string) => {
    const posees = partie100(page).posees;
    expect(posees, "questions posées").toHaveLength(6);
    const titres = posees.map((enonce) => leconDeLaQuestion(enonce).titre);
    for (const titre of [a, b, c]) expect(titres.filter((candidat) => candidat === titre), `questions de « ${titre} »`).toHaveLength(2);
  },
);

Then(/^aucune question n'a été posée deux fois$/, async ({ page }) => {
  const posees = partie100(page).posees;
  expect(posees.length).toBeGreaterThan(0);
  expect(new Set(posees).size, `questions posées : ${posees.join(" | ")}`).toBe(posees.length);
});

// --- Alors : la fin du grand défi

Then(/^la fin du défi annonce « Grand défi relevé ! »$/, async ({ page }) => {
  const annonce = page.getByTestId("annonce-du-defi-releve");
  await expect(annonce).toHaveText("Grand défi relevé !", { timeout: 20_000 });
  await expect(annonce).toHaveAttribute("role", "status");
});

Then(/^la fin du défi n'annonce pas « Grand défi relevé ! »$/, async ({ page }) => {
  await expect(finDuDefi(page).getByRole("button", { name: "Accueil", exact: true })).toBeVisible();
  await expect(page.getByTestId("annonce-du-defi-releve")).toBeEmpty();
  await expect(finDuDefi(page)).not.toContainText("Grand défi relevé");
});

// --- Alors : « Mes médailles »

Then(
  /^la section « Mes défis relevés » montre, dans cet ordre, « ([^«»]+) » et « ([^«»]+) », chacun une seule fois$/,
  async ({ page }, premiere: string, seconde: string) => {
    const section = page.getByRole("region", { name: "Mes défis relevés", exact: true });
    await expect(section).toBeVisible({ timeout: 20_000 });
    await expect(section.getByTestId("ligne-de-defi-releve")).toHaveText([premiere, seconde]);
  },
);
