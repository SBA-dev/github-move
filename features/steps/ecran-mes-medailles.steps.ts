import { expect, type Locator, type Page } from "@playwright/test";
import type { DataTable } from "playwright-bdd";
import { inscrireUnRecordDeFluence } from "../support/calcul-api.ts";
import type { Famille } from "../support/famille.ts";
import { reglagesPrevus } from "../support/reglages-prevus.ts";
import { lireEnRestLeNiveauDuProfil } from "../support/profils-api.ts";
import { entendu, etat, injecter, type LeconBrute, leconDeTest, toutesLesParoles } from "./etapes-puis-exercices.steps.ts";
import { leconDeLExercice } from "./exercices-a-choix.steps.ts";
import { Given, type Monde, Then, When } from "./fixtures.ts";
import { choisirLeaSur, estSurUnProfilReel, jouerAvecLeProfilReel } from "./profil-reel.ts";
import { choisirSonProfil, jetonDe, modifierLeProfil, ouvrirQuiJoue, profilDe } from "./profils-enfants.steps.ts";
import { verifierModeDys } from "./reglages.steps.ts";
import { journal, normaliser, reappliquerLAppareil, scenario, terminerLaLecture } from "./voix.steps.ts";

// Story #65 : l'écran « Mes médailles ». L'enfant l'ouvre par le bouton de son accueil, comme « Mon parcours ».
//
// Les records sont posés comme ceux de #20 (écriture réservée à la préparation, sur un vrai profil enfant). Le profil
// de Léa est « préparé » sur l'appareil tant qu'aucun step n'exige un vrai profil (titre, retour, démonstration) ;
// dès qu'un record est posé, Léa joue avec son vrai profil (créé pour Paul, choisi dans « Qui joue ? »).
// Les réglages prévus (« tout lire à voix haute », mode dys) sont appliqués au vrai profil juste avant l'ouverture,
// puis Léa est de nouveau choisie : le navigateur n'est rechargé que si quelque chose a changé, jamais sans réseau.

const ECRAN = "Mes médailles";
const SECTION_DES_RECORDS = "Mes records de calcul rapide";
const DELAI_D_UN_APPEL_SERVEUR_MS = 20_000;

type Partie65 = { reglagesAppliques: string; ecranDeMarie: Page | undefined; muetApplique: boolean };
const parties = new WeakMap<Page, Partie65>();
function partie65(page: Page): Partie65 {
  let courante = parties.get(page);
  if (!courante) {
    courante = { reglagesAppliques: "{}", ecranDeMarie: undefined, muetApplique: false };
    parties.set(page, courante);
  }
  return courante;
}

export function ecranDe(page: Page): Page {
  return partie65(page).ecranDeMarie ?? page;
}

// --- Les leçons de test (identifiants « e2e-65- »)

function exerciceDeFluence(titre: string | undefined, signe: string, table: number): Record<string, unknown> {
  return {
    type: "fluence",
    ...(titre === undefined ? {} : { titre }),
    duree: 30,
    generateur: { op: signe, a: [1, 10], b: [table, table] },
  };
}

Given(
  /^une leçon de test « ([^«»]+) » a deux fluences, « ([^«»]+) » puis « ([^«»]+) »$/,
  async ({ page }, titre: string, premiere: string, seconde: string) => {
    await injecter(page, {
      ...leconDeTest("e2e-65-deux-calculs-rapides", titre, [exerciceDeFluence(premiere, "×", 2), exerciceDeFluence(seconde, "×", 5)]),
      niveau: "CE2",
      ordre: 901,
    });
  },
);

Given(
  /^une leçon de test « ([^«»]+) » a une fluence sans titre, de signe « ([^«»]+) »$/,
  async ({ page }, titre: string, signe: string) => {
    await injecter(page, { ...leconDeTest("e2e-65-multiplier-vite", titre, [exerciceDeFluence(undefined, signe, 6)]), niveau: "CE2", ordre: 902 });
  },
);

// --- Les records (profil réel de Léa ou de Tom)

export async function leaJoueAvecSonVraiProfil(famille: Famille, monde: Monde, page: Page): Promise<string> {
  if (!estSurUnProfilReel(page)) {
    if ((await famille.session(page)) === null) await famille.connecterSansEmail("tablette", "Paul");
    await jouerAvecLeProfilReel(famille, monde, page, "Léa");
  }
  return profilDe(famille, "Léa").id;
}

async function poserLesRecords(famille: Famille, monde: Monde, page: Page, records: Array<{ fluence: string; record: number }>) {
  const profil = await leaJoueAvecSonVraiProfil(famille, monde, page);
  for (const { fluence, record } of records) {
    await inscrireUnRecordDeFluence(profil, leconDeLExercice(page, fluence).id, fluence, record);
  }
}

Given(/^Léa a pour records de fluence :$/, async ({ famille, monde, page }, tableau: DataTable) => {
  await poserLesRecords(
    famille,
    monde,
    page,
    tableau.hashes().map((ligne) => ({ fluence: String(ligne["fluence"]), record: Number(ligne["record"]) })),
  );
});

Given(
  /^Léa a un record de ([0-9]+) à la fluence sans titre de la leçon « ([^«»]+) »$/,
  async ({ famille, monde, page }, record: string, titre: string) => {
    const profil = await leaJoueAvecSonVraiProfil(famille, monde, page);
    const lecon = leconDeTitreInjectee(page, titre);
    // Sans titre, la fluence se retrouve par le signe de son générateur (clé de l'exercice).
    const generateur = lecon.exercices[0]?.generateur as { op: string };
    await inscrireUnRecordDeFluence(profil, lecon.id, generateur.op, Number(record));
  },
);

function leconDeTitreInjectee(page: Page, titre: string): LeconBrute {
  const lecon = etat(page).injectees.find((candidate) => candidate.titre === titre);
  if (!lecon) throw new Error(`Leçon de test inconnue : ${titre}`);
  return lecon;
}

Given(
  /^Léa a un record de ([0-9]+) à une fluence « ([^«»]+) » qui n'est plus dans la bibliothèque$/,
  async ({ famille, monde, page }, record: string, titre: string) => {
    const profil = await leaJoueAvecSonVraiProfil(famille, monde, page);
    await inscrireUnRecordDeFluence(profil, "e2e-65-anciens-doubles", titre, Number(record));
  },
);

Given(/^Tom a un record de ([0-9]+) à la fluence « ([^«»]+) »$/, async ({ famille, page }, record: string, titre: string) => {
  await inscrireUnRecordDeFluence(profilDe(famille, "Tom").id, leconDeLExercice(page, titre).id, titre, Number(record));
});

Given(/^Léa joue avec le profil préparé, sans profil réel au serveur$/, async ({ page }) => {
  // Le profil préparé du Contexte est l'état par défaut : rien à préparer, et aucun profil réel ne doit exister.
  expect(estSurUnProfilReel(page), "aucun profil réel n'est créé pour Léa").toBe(false);
});

// --- Ouvrir l'écran depuis l'accueil

function accueil(page: Page): Locator {
  return page.getByRole("region", { name: /^Accueil de / });
}

function boutonDAcces(page: Page): Locator {
  // Story #29 : l'accès à l'écran est le bouton du dock.
  return page.getByRole("navigation", { name: "Mes écrans", exact: true }).getByRole("button", { name: ECRAN, exact: true });
}

function titreDeLEcran(page: Page): Locator {
  return page.getByRole("heading", { level: 1, name: ECRAN, exact: true });
}

// « Qui joue ? » montre d'abord la copie gardée sur l'appareil, puis la relit sur le serveur : après un changement de
// niveau, on attend que la liste ait rattrapé le niveau enregistré avant de choisir Léa.
async function choisirLeaDeNouveau(famille: Famille, page: Page): Promise<void> {
  const profil = profilDe(famille, "Léa");
  const niveau = await lireEnRestLeNiveauDuProfil(await jetonDe(famille, profil.parent), profil.id);
  const listeRelue = page.waitForResponse((reponse) => reponse.url().includes("/rest/v1/profils_enfants"));
  await page.goto("/");
  await listeRelue;
  const quiJoue = await ouvrirQuiJoue(page);
  await expect(quiJoue.getByTestId("profil-a-choisir").filter({ hasText: "Léa" }).first()).toContainText(`${niveau} ·`);
  await choisirSonProfil(page, "Léa");
}

async function appliquerLesReglagesPrevus(famille: Famille, page: Page): Promise<boolean> {
  const prevus = JSON.stringify(reglagesPrevus(page, "Léa"));
  const etat = partie65(page);
  if (prevus === "{}" || prevus === etat.reglagesAppliques) return false;
  await modifierLeProfil(famille, "Léa", { reglages: reglagesPrevus(page, "Léa") });
  etat.reglagesAppliques = prevus;
  return true;
}

// Depuis l'écran de fin, « Accueil » mène à « Qui joue ? » : le profil préparé n'y est pas listé. On rejoint son accueil dans
// l'application, sans recharger la page (un rechargement perdrait les étoiles gagnées sur l'appareil).
async function revenirALAccueilDansLApplication(page: Page): Promise<void> {
  await page.evaluate(() => {
    history.pushState({ profondeur: 2, precedent: "/" }, "", "/jeu");
    dispatchEvent(new PopStateEvent("popstate"));
  });
}

async function atteindreLAccueilDeLea(famille: Famille, page: Page): Promise<void> {
  const etat = partie65(page);
  const muetAAppliquer = scenario(page).muet && !etat.muetApplique;
  if (!estSurUnProfilReel(page)) {
    await reappliquerLAppareil(page);
    etat.muetApplique = true;
    // Un écran déjà ouvert (retour à l'accueil après une séance) n'est pas rechargé : les étoiles gagnées y sont gardées en mémoire.
    if (!(await accueil(page).isVisible()) && page.url() !== "about:blank") await revenirALAccueilDansLApplication(page);
    const dejaLa = await accueil(page).waitFor({ timeout: 3_000 }).then(() => true, () => false);
    if (!dejaLa) await page.goto("/jeu");
    await expect(accueil(page)).toBeVisible();
    return;
  }
  const reglagesChanges = await appliquerLesReglagesPrevus(famille, page);
  const finDeSeance = page.getByTestId("fin-de-seance");
  if (!reglagesChanges && !muetAAppliquer) {
    if (await accueil(page).isVisible()) return;
    if (await finDeSeance.isVisible()) {
      await finDeSeance.getByRole("button", { name: "Accueil", exact: true }).click();
      // « Accueil » ramène à « Qui joue ? » sans recharger : Léa s'y choisit de nouveau, ses envois de séance suivent.
      await choisirSonProfil(page, "Léa");
      await expect(accueil(page)).toBeVisible();
      return;
    }
    // Story #32 : « Accueil » depuis l'écran de fin ramène à « Qui joue ? » : Léa s'y choisit de nouveau, sans recharger.
    if (new URL(page.url()).pathname === "/") {
      await choisirSonProfil(page, "Léa");
      await expect(accueil(page)).toBeVisible();
      return;
    }
  }
  await reappliquerLAppareil(page);
  etat.muetApplique = true;
  await choisirLeaDeNouveau(famille, page);
  await expect(accueil(page)).toBeVisible();
}

export async function ouvrirLEcran(famille: Famille, page: Page, moyen: "toucher" | "clavier"): Promise<void> {
  await atteindreLAccueilDeLea(famille, page);
  await ouvrirDepuisLAccueil(page, moyen);
}

async function ouvrirDepuisLAccueil(page: Page, moyen: "toucher" | "clavier"): Promise<void> {
  if (moyen === "clavier") {
    await boutonDAcces(page).focus();
    await page.keyboard.press("Enter");
  } else {
    await boutonDAcces(page).click();
  }
  await expect(titreDeLEcran(page)).toBeVisible();
}

When(/^Léa ouvre « Mes médailles » depuis son accueil$/, async ({ famille, page }) => {
  await ouvrirLEcran(famille, page, "toucher");
});

When(/^Léa ouvre « Mes médailles » depuis son accueil, au clavier seulement$/, async ({ famille, page }) => {
  await ouvrirLEcran(famille, page, "clavier");
});

Given(/^Léa a ouvert « Mes médailles » depuis son accueil$/, async ({ famille, page }) => {
  await ouvrirLEcran(famille, page, "toucher");
});

When(/^Léa ouvre « Mes médailles » sur le téléphone de Marie$/, async ({ famille, page }) => {
  const telephone = await famille.page("telephone");
  if ((await famille.session(telephone)) === null) await famille.connecterSansEmail("telephone", "Marie");
  await choisirLeaSur(telephone);
  partie65(page).ecranDeMarie = telephone;
  await ouvrirDepuisLAccueil(telephone, "toucher");
});

// --- Le titre, le retour

Then(/^le titre de l'écran est (?:toujours )?« Mes médailles »$/, async ({ page }) => {
  await expect(titreDeLEcran(ecranDe(page))).toBeVisible();
});

Then(/^le mot « trophée » n'apparaît ni sur l'accueil ni sur l'écran$/, async ({ page }) => {
  await expect(titreDeLEcran(page)).toBeVisible();
  await expect(page.locator("body")).not.toContainText(/troph/i);
  await page.goBack();
  await expect(accueil(page)).toBeVisible();
  await expect(page.locator("body")).not.toContainText(/troph/i);
});

// --- Les sections

function sectionsDeLEcran(page: Page): Locator {
  return page.locator("section.mes-medailles").getByRole("region");
}

function sectionDesRecords(page: Page): Locator {
  return page.getByRole("region", { name: SECTION_DES_RECORDS, exact: true });
}

function pastilles(page: Page): Locator {
  return page.getByTestId("pastille-de-record");
}

Then(/^« Mes records de calcul rapide » est la dernière section de l'écran$/, async ({ page }) => {
  await expect(sectionsDeLEcran(page).last()).toBeVisible({ timeout: DELAI_D_UN_APPEL_SERVEUR_MS });
  await expect(sectionsDeLEcran(page).last()).toHaveAccessibleName(SECTION_DES_RECORDS);
});

Then(/^aucune section n'annonce un contenu à venir$/, async ({ page }) => {
  await expect(sectionsDeLEcran(page).last()).toBeVisible({ timeout: DELAI_D_UN_APPEL_SERVEUR_MS });
  await expect(page.locator("section.mes-medailles")).not.toContainText(/à venir|bientôt|prochainement|plus tard/i);
});

Then(
  /^les sections de l'écran sont, dans l'ordre : la cabane, l'histoire, les badges, puis les records de calcul rapide$/,
  async ({ page }) => {
    const sections = sectionsDeLEcran(ecranDe(page));
    await expect(sections).toHaveCount(4, { timeout: DELAI_D_UN_APPEL_SERVEUR_MS });
    const noms = ["La cabane de Noisette", "L'histoire des Savanturiers", "Mes badges", SECTION_DES_RECORDS];
    for (const [rang, nom] of noms.entries()) await expect(sections.nth(rang)).toHaveAccessibleName(nom);
  },
);

Then(/^aucune section « Mes records de calcul rapide » n'apparaît$/, async ({ page }) => {
  const ecran = ecranDe(page);
  // La bulle du personnage guide n'apparaît qu'une fois la lecture des records terminée.
  await expect(ecran.getByTestId("parole")).toBeVisible({ timeout: DELAI_D_UN_APPEL_SERVEUR_MS });
  await expect(sectionDesRecords(ecran)).toHaveCount(0);
  await expect(ecran.getByRole("heading", { level: 2, name: SECTION_DES_RECORDS })).toHaveCount(0);
});

// --- Les pastilles

function phraseLue(libelle: string, record: number): string {
  return `${libelle} : ton record est de ${record} calcul${record > 1 ? "s" : ""}`;
}

async function verifierLaPastille(pastille: Locator, libelle: string, record: number): Promise<void> {
  await expect(pastille.getByText(libelle, { exact: true })).toBeVisible();
  await expect(pastille.getByText(String(record), { exact: true })).toBeVisible();
  await expect(pastille.getByText(phraseLue(libelle, record), { exact: true })).toHaveCount(1);
}

Then(
  /^les records de calcul rapide montrent seulement « ([^«»]+) », ([0-9]+)$/,
  async ({ page }, libelle: string, record: string) => {
    const ecran = ecranDe(page);
    await expect(sectionDesRecords(ecran).getByRole("heading", { level: 2, name: SECTION_DES_RECORDS })).toBeVisible({
      timeout: DELAI_D_UN_APPEL_SERVEUR_MS,
    });
    await expect(pastilles(ecran)).toHaveCount(1);
    await verifierLaPastille(pastilles(ecran).first(), libelle, Number(record));
  },
);

Then(/^les records de calcul rapide montrent, dans l'ordre :$/, async ({ page }, tableau: DataTable) => {
  const ecran = ecranDe(page);
  const attendues = tableau.hashes().map((ligne) => ({ libelle: String(ligne["pastille"]), record: Number(ligne["record"]) }));
  await expect(pastilles(ecran)).toHaveCount(attendues.length, { timeout: DELAI_D_UN_APPEL_SERVEUR_MS });
  for (const [rang, { libelle, record }] of attendues.entries()) {
    await verifierLaPastille(pastilles(ecran).nth(rang), libelle, record);
  }
});

Then(/^le titre de la leçon « ([^«»]+) » n'y apparaît pas$/, async ({ page }, titre: string) => {
  const ecran = ecranDe(page);
  await expect(sectionDesRecords(ecran)).toBeVisible();
  await expect(sectionDesRecords(ecran).getByText(titre)).toHaveCount(0);
});

When(/^Léa choisit la pastille « ([^«»]+) »$/, async ({ page }, libelle: string) => {
  await pastilles(page).filter({ hasText: libelle }).first().click();
});

// --- La voix

async function paroles(page: Page): Promise<string[]> {
  return (await toutesLesParoles(page)).map(normaliser);
}

// Une lecture peut se découper en plusieurs énoncés (après « : ») : ce que l'enfant entend, c'est un lot.
export async function lecturesParLot(page: Page): Promise<string[]> {
  return await page.evaluate(() => {
    const faux = Reflect.get(window, "__faux") as { journal: Array<{ type: string; lot: number; texte: string }> };
    const parLot = new Map<number, string[]>();
    for (const e of faux.journal) if (e.type === "speak") parLot.set(e.lot, [...(parLot.get(e.lot) ?? []), e.texte]);
    return [...parLot.values()].map((textes) => textes.join(" ").replace(/\s+/g, " ").trim());
  });
}

Then(/^Léa entend Noisette lire, dans l'ordre :$/, async ({ page }, tableau: DataTable) => {
  const attendues = tableau.hashes().map((ligne) => normaliser(entendu(String(ligne["texte"]))));
  await expect.poll(async () => {
    const lots = await lecturesParLot(page);
    const lues = lots.slice(Math.max(0, lots.indexOf(attendues[0] ?? "")), lots.indexOf(attendues[0] ?? "") + attendues.length);
    if (lues.join("|") !== attendues.join("|")) await terminerLaLecture(page);
    return lues;
  }, { intervals: [100], timeout: DELAI_D_UN_APPEL_SERVEUR_MS }).toEqual(attendues);
});

Then(/^Léa entend Noisette lire « ([^«»]+) », puis « ([^«»]+) »$/, { tags: "@issue-65 or @issue-32 or @issue-31 or @issue-33 or @issue-102" }, async ({ page }, premier: string, second: string) => {
  const [premiere, seconde] = [normaliser(entendu(premier)), normaliser(entendu(second))];
  await expect.poll(async () => {
    const lots = await lecturesParLot(page);
    const rang = lots.indexOf(premiere);
    if (rang >= 0 && lots.indexOf(seconde) > rang) return true;
    if (rang >= 0) await terminerLaLecture(page);
    return false;
  }, { intervals: [100], timeout: DELAI_D_UN_APPEL_SERVEUR_MS }).toBe(true);
});

Then(/^Léa n'entend pas Noisette lire « ([^«»]+) »$/, async ({ page }, texte: string) => {
  for (let essai = 0; essai < 3; essai++) {
    await terminerLaLecture(page);
    await page.evaluate(() => new Promise<void>((fin) => setTimeout(fin, 200)));
  }
  expect(await lecturesParLot(page)).not.toContain(normaliser(entendu(texte)));
});

When(/^Léa demande à écouter les records de calcul rapide$/, async ({ page }) => {
  // L'écran lit son accueil dès que tout est chargé, et cette lecture coupe celle que l'enfant vient de demander si elle
  // démarre après son geste : on touche « Écouter » une fois l'accueil lancé (la bulle du personnage guide est affichée).
  await expect(page.getByTestId("parole")).toBeVisible({ timeout: DELAI_D_UN_APPEL_SERVEUR_MS });
  await sectionDesRecords(page).getByRole("button", { name: "Écouter", exact: true }).click();
});

// --- Accessibilité

// Même texte qu'un step de #25 (bouton du parcours) : ici, la pastille est un élément de liste nommé.
Then(/^les lecteurs d'écran annoncent « ([^«»]+) »$/, { tags: "@issue-65" }, async ({ page }, annonce: string) => {
  const pastille = pastilles(page).filter({ has: page.getByText(annonce, { exact: true }) });
  await expect(pastille).toHaveCount(1);
  // Le texte lu est dans un élément visuellement caché ; le libellé et la valeur affichés sont masqués aux lecteurs d'écran.
  await expect(pastille.locator('[aria-hidden="true"]')).toHaveCount(2);
});

async function hauteurDe(element: Locator, nom: string): Promise<number> {
  const boite = await element.boundingBox();
  expect(boite, `« ${nom} » visible`).not.toBeNull();
  return boite?.height ?? 0;
}

Then(
  /^le bouton d'accès à l'écran, « Retour » et chaque bouton « Écouter » mesurent au moins 44 px de haut$/,
  async ({ page }) => {
    // La bulle du personnage guide n'apparaît qu'une fois les lectures de l'écran terminées.
    await expect(page.getByTestId("parole")).toBeVisible({ timeout: DELAI_D_UN_APPEL_SERVEUR_MS });
    expect(await hauteurDe(page.getByRole("button", { name: "Retour", exact: true }), "Retour")).toBeGreaterThanOrEqual(44);
    const boutons = await page.getByRole("button", { name: "Écouter", exact: true }).all();
    expect(boutons.length).toBeGreaterThan(0);
    for (const bouton of boutons) expect(await hauteurDe(bouton, "Écouter")).toBeGreaterThanOrEqual(44);
    await page.goBack();
    await expect(accueil(page)).toBeVisible();
    expect(await hauteurDe(boutonDAcces(page), ECRAN)).toBeGreaterThanOrEqual(44);
  },
);

Then(
  /^Léa voit le titre de l'écran et les pastilles de record en mode dys : police Andika, lettres, mots et lignes espacés$/,
  async ({ page }) => {
    await expect(pastilles(page).first()).toBeVisible({ timeout: DELAI_D_UN_APPEL_SERVEUR_MS });
    await verifierModeDys(page, [titreDeLEcran(page), pastilles(page).first()], true);
  },
);

Then(/^les pastilles de record apparaissent sans mouvement$/, async ({ page }) => {
  await expect(pastilles(page).first()).toBeVisible({ timeout: DELAI_D_UN_APPEL_SERVEUR_MS });
  for (const pastille of await pastilles(page).all()) await expect(pastille).toHaveCSS("animation-name", "none");
});

Given(/^Noisette est en train de lire « ([^«»]+) »$/, async ({ page }, texte: string) => {
  await expect.poll(async () => (await paroles(page)).includes(normaliser(entendu(texte)))).toBe(true);
  expect((await journal(page)).actifs).toBeGreaterThan(0);
});
