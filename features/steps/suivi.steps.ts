import { expect, type Locator, type Page } from "@playwright/test";
import type { DataTable } from "playwright-bdd";
import type { Appareil, Famille } from "../support/famille.ts";
import { lireLaFileEnRest } from "../support/revision-api.ts";
import { lireEnRest } from "../support/seances-api.ts";
import {
  ecrireDesSeancesDeRevision,
  ecrireDesSeancesTerminees,
  ecrireLesErreursCorrigeesPourDeBon,
  ecrireUnTestDeDepartFaitLe,
  instantDuJour,
  type SeancePreparee,
} from "../support/suivi-api.ts";
import { BIBLIOTHEQUE } from "./etapes-puis-exercices.steps.ts";
import { partie } from "./etoiles-et-fin-de-seance.steps.ts";
import { Given, Then, When } from "./fixtures.ts";
import { profilDe } from "./profils-enfants.steps.ts";

// Story #34 : suivi et carte des compétences, dans l'espace parent.
// Les faits d'Apprentissage sont préparés avec la clé service_role (features/support/suivi-api.ts) ; le parent, lui, lit
// le suivi par l'interface, sous RLS.

const LECON_RETIREE = "e2e-34-lecon-retiree";
const BLOC_DE_LA_CARTE = "Carte des compétences";
const BLOC_DES_LECONS_JOUEES = "Toutes les leçons jouées";

const appareils = new WeakMap<Famille, Appareil>();

function appareilDuSuivi(famille: Famille): Appareil {
  return appareils.get(famille) ?? "tablette";
}

async function pageDuSuivi(famille: Famille): Promise<Page> {
  return famille.page(appareilDuSuivi(famille));
}

function suiviDe(page: Page): Locator {
  return page.getByTestId("suivi-de-l-espace-parent");
}

function echapper(texte: string): string {
  return texte.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function identifiantDeLaLecon(titre: string): string {
  const lecon = BIBLIOTHEQUE.find((candidate) => candidate.titre === titre);
  if (!lecon) throw new Error(`Leçon inconnue de la bibliothèque : ${titre}`);
  return lecon.id;
}

function etoilesDeLaTable(brut: string): SeancePreparee["etoiles"] {
  if (brut === "–") return undefined;
  const nombre = Number(brut);
  if (nombre !== 1 && nombre !== 2 && nombre !== 3) throw new Error(`Étoiles attendues : 1, 2, 3 ou « – » (reçu « ${brut} »)`);
  return nombre;
}

// --- Étant donné : faits préparés

Given(/^(Léa|Tom) a terminé ces séances :$/, async ({ famille }, prenom: string, tableau: DataTable) => {
  const seances = tableau.hashes().map((ligne): SeancePreparee => ({
    lecon: identifiantDeLaLecon(String(ligne["leçon"])),
    termineLe: instantDuJour(String(ligne["le"])),
    erreurs: Number(ligne["erreurs"]),
    etoiles: etoilesDeLaTable(String(ligne["étoiles"])),
  }));
  await ecrireDesSeancesTerminees(profilDe(famille, prenom).id, seances);
});

Given(
  /^Léa a fait le test de départ le (\d{2}\/\d{2}\/\d{4}), avec pour leçons réussies au test de départ :$/,
  async ({ famille }, jour: string, tableau: DataTable) => {
    const lecons = tableau.hashes().map((ligne) => identifiantDeLaLecon(String(ligne["leçon"])));
    await ecrireUnTestDeDepartFaitLe(profilDe(famille, "Léa").id, instantDuJour(jour), lecons);
  },
);

Given(
  /^Léa a terminé, le (\d{2}\/\d{2}\/\d{4}), une séance à 3 étoiles d'une leçon qui n'est plus dans la bibliothèque$/,
  async ({ famille }, jour: string) => {
    await ecrireDesSeancesTerminees(profilDe(famille, "Léa").id, [
      { lecon: LECON_RETIREE, termineLe: instantDuJour(jour), erreurs: 0, etoiles: 3 },
    ]);
  },
);

Given(/^Léa a terminé (\d+) séances de révision$/, async ({ famille }, nombre: string) => {
  await ecrireDesSeancesDeRevision(profilDe(famille, "Léa").id, Number(nombre));
});

Given(/^Léa a (\d+) erreurs corrigées pour de bon$/, async ({ famille }, nombre: string) => {
  await ecrireLesErreursCorrigeesPourDeBon(profilDe(famille, "Léa").id, Number(nombre));
});

// --- Quand : le parent ouvre le suivi

async function attendreLeSuivi(page: Page): Promise<void> {
  await expect(suiviDe(page)).toBeVisible();
  await expect(suiviDe(page).getByText("Chargement du suivi")).toHaveCount(0);
}

function boutonDuBloc(page: Page, bloc: string): Locator {
  return suiviDe(page).getByRole("button", { name: new RegExp(`^${echapper(bloc)}`) });
}

async function deplierLeBloc(page: Page, bloc: string, auClavier: boolean): Promise<void> {
  const bouton = boutonDuBloc(page, bloc);
  await expect(bouton).toBeVisible();
  if ((await bouton.getAttribute("aria-expanded")) === "true") return;
  if (auClavier) {
    await bouton.focus();
    await page.keyboard.press("Enter");
  } else {
    await bouton.click();
  }
  await expect(bouton).toHaveAttribute("aria-expanded", "true");
}

async function consulterLeSuivi(famille: Famille, parent: string): Promise<Page> {
  const appareil: Appareil = parent === "Claire" ? "telephone" : "tablette";
  appareils.set(famille, appareil);
  const page = await famille.page(appareil);
  // Les profils créés depuis la connexion ne sont lus qu'à l'ouverture de l'application : on la rouvre, sauf sans réseau.
  const dansLEspaceParent = await page.getByRole("heading", { name: "Espace parent" }).isVisible();
  if (!dansLEspaceParent && (await page.evaluate(() => navigator.onLine))) await page.goto("/");
  await famille.allerDansLEspaceParent(appareil);
  await attendreLeSuivi(page);
  return page;
}

When(/^Paul entre dans l'espace parent$/, async ({ famille }) => {
  appareils.set(famille, "tablette");
  await famille.allerDansLEspaceParent("tablette");
});

When(
  /^(Paul|Claire) consulte le suivi(, carte des compétences et leçons jouées dépliées)?$/,
  async ({ famille }, parent: string, deplie: string | undefined) => {
    const page = await consulterLeSuivi(famille, parent);
    if (deplie == null) return;
    await deplierLeBloc(page, BLOC_DE_LA_CARTE, false);
    await deplierLeBloc(page, BLOC_DES_LECONS_JOUEES, false);
  },
);

When(/^Paul choisit « ([^«»]+) » dans le suivi(, au clavier seulement)?$/, async ({ famille }, libelle: string, clavier: string | undefined) => {
  const page = await pageDuSuivi(famille);
  const bouton = suiviDe(page).getByTestId("choix-de-l-enfant-suivi").getByRole("button", { name: libelle, exact: true });
  if (clavier == null) {
    await bouton.click();
  } else {
    await bouton.focus();
    await page.keyboard.press("Enter");
  }
  await expect(bouton).toHaveAttribute("aria-pressed", "true");
});

When(/^Paul déplie la carte des compétences de Léa(, au clavier seulement)?$/, async ({ famille }, clavier: string | undefined) => {
  const page = await pageDuSuivi(famille);
  await deplierLeBloc(page, BLOC_DE_LA_CARTE, clavier != null);
  await expect(suiviDe(page).getByTestId("legende-de-la-carte")).toBeVisible();
});

// --- Quand : un parent non rattaché lit les faits d'un enfant

async function jetonDeClaire(famille: Famille): Promise<string> {
  const jeton = (await famille.session(await famille.page("telephone")))?.access_token;
  if (jeton === undefined) throw new Error("Claire n'est pas connectée sur le téléphone");
  return jeton;
}

When(/^Claire demande les séances terminées du profil enfant de Léa$/, async ({ famille }) => {
  partie(famille).lignesLues = await lireEnRest(await jetonDeClaire(famille), "seances_terminees", profilDe(famille, "Léa").id);
});

When(/^Claire demande les séances de révision terminées du profil enfant de Léa$/, async ({ famille }) => {
  partie(famille).lignesLues = await lireLaFileEnRest(await jetonDeClaire(famille), profilDe(famille, "Léa").id);
});

// --- Alors : l'espace parent et le choix de l'enfant

Then(/^la première partie de l'espace parent est « Suivi », avant « Profils »$/, async ({ famille }) => {
  const page = await famille.page("tablette");
  await expect(page.getByRole("heading", { level: 3, name: "Profils", exact: true })).toBeVisible();
  const titres = await page.getByRole("heading", { level: 3 }).allTextContents();
  expect(titres[0]).toBe("Suivi");
  expect(titres.indexOf("Profils")).toBeGreaterThan(0);
});

Then(/^l'enfant suivi est « ([^«»]+) »$/, async ({ famille }, libelle: string) => {
  const page = await pageDuSuivi(famille);
  await expect(suiviDe(page).getByTestId("enfant-suivi")).toHaveText(libelle);
  await expect(suiviDe(page).getByRole("button", { name: libelle, exact: true })).toHaveAttribute("aria-pressed", "true");
});

function libellesCites(texte: string): string[] {
  return [...texte.matchAll(/« ([^«»]+) »/g)].map((trouve) => trouve[1] ?? "");
}

Then(/^le suivi propose de choisir, dans l'ordre, (« .+ »)$/, async ({ famille }, cites: string) => {
  const page = await pageDuSuivi(famille);
  const boutons = suiviDe(page).getByTestId("choix-de-l-enfant-suivi").getByRole("button");
  await expect(boutons).toHaveText(libellesCites(cites));
});

Then(/^le suivi de Claire propose seulement « ([^«»]+) »$/, async ({ famille }, libelle: string) => {
  const page = await pageDuSuivi(famille);
  await expect(suiviDe(page).getByTestId("choix-de-l-enfant-suivi").getByRole("button")).toHaveText([libelle]);
  await expect(suiviDe(page).getByTestId("enfant-suivi")).toHaveText(libelle);
});

Then(/^aucun suivi de Léa n'apparaît$/, async ({ famille }) => {
  const page = await pageDuSuivi(famille);
  await attendreLeSuivi(page);
  await expect(suiviDe(page).getByTestId("enfant-suivi")).not.toContainText("Léa");
  await expect(suiviDe(page).getByTestId("chiffres-du-suivi")).toHaveCount(1);
  if (appareilDuSuivi(famille) === "telephone") {
    await expect(suiviDe(page).getByRole("button", { name: /Léa/ })).toHaveCount(0);
  }
});

// --- Alors : parties et blocs du suivi

Then(/^les parties du suivi de Léa se suivent ainsi : (.+)$/, async ({ famille }, liste: string) => {
  const page = await pageDuSuivi(famille);
  const [enfant, carte, lecons] = [...liste.matchAll(/« ([^«»]+) »/g)].map((trouve) => trouve[1] ?? "");
  const parties = suiviDe(page)
    .getByTestId("enfant-suivi")
    .or(suiviDe(page).getByTestId("chiffres-du-suivi"))
    .or(suiviDe(page).getByRole("button", { name: /^(Carte des compétences|Toutes les leçons jouées)/ }));
  await expect(parties).toHaveCount(4);
  const lues = await parties.evaluateAll((elements) =>
    elements.map((element) => element.getAttribute("data-testid") === "chiffres-du-suivi" ? "les chiffres du suivi" : (element.textContent ?? "").trim())
  );
  expect(lues).toEqual([enfant, "les chiffres du suivi", carte, lecons]);
});

Then(/^aucun bilan des 7 derniers jours n'est montré$/, async ({ famille }) => {
  const page = await pageDuSuivi(famille);
  await expect(suiviDe(page).getByText(/7 derniers jours/)).toHaveCount(0);
});

/** Appelée par l'étape « le bloc « … » est replié et s'intitule « … » » (déjà définie par la story #26) quand le scénario est celui du suivi. */
export async function verifierQueLeBlocDuSuiviEstReplie(famille: Famille, bloc: string, intitule: string): Promise<void> {
  const page = await pageDuSuivi(famille);
  const bouton = suiviDe(page).getByRole("button", { name: intitule, exact: true });
  await expect(bouton).toBeVisible();
  await expect(bouton).toContainText(bloc);
  await expect(bouton).toHaveAttribute("aria-expanded", "false");
  const contenu = await bouton.getAttribute("aria-controls");
  await expect(page.locator(`[id="${contenu}"]`)).toBeHidden();
}

// --- Alors : les chiffres

Then(/^le suivi de Léa indique :$/, async ({ famille }, tableau: DataTable) => {
  const page = await pageDuSuivi(famille);
  const attendu = tableau.hashes()[0] ?? {};
  await expect.poll(async () =>
    suiviDe(page).getByTestId("chiffre").evaluateAll((elements) =>
      Object.fromEntries(elements.map((element) => [
        (element.querySelector("dt")?.textContent ?? "").trim(),
        (element.querySelector("dd")?.textContent ?? "").trim(),
      ]))
    )
  ).toEqual(attendu);
});

// --- Alors : la carte des compétences

function carteDe(page: Page): Locator {
  return suiviDe(page).getByTestId("matiere-de-la-carte");
}

function ligneDeLaCarte(page: Page, intitule: string): Locator {
  return suiviDe(page).getByTestId("ligne-de-la-carte").filter({ hasText: new RegExp(`^${echapper(intitule)} : `) });
}

Then(/^les matières de la carte se suivent ainsi : (« .+ »)$/, async ({ famille }, liste: string) => {
  const page = await pageDuSuivi(famille);
  await expect(carteDe(page).getByRole("heading", { level: 5 })).toHaveText(libellesCites(liste));
});

Then(/^les domaines du français se suivent ainsi : (« .+ »)$/, async ({ famille }, liste: string) => {
  const page = await pageDuSuivi(famille);
  const francais = carteDe(page).filter({ has: page.getByRole("heading", { level: 5, name: "Français", exact: true }) });
  await expect(francais.getByRole("heading", { level: 6 })).toHaveText(libellesCites(liste));
});

Then(/^aucune matière « ([^«»]+) » n'apparaît dans la carte$/, async ({ famille }, matiere: string) => {
  const page = await pageDuSuivi(famille);
  await expect(carteDe(page)).not.toHaveCount(0);
  await expect(carteDe(page).getByRole("heading", { level: 5, name: matiere, exact: true })).toHaveCount(0);
});

Then(/^la ligne « ([^«»]+) » de la carte montre (?:les leçons|la leçon) (« .+ »)$/, async ({ famille }, intitule: string, liste: string) => {
  const page = await pageDuSuivi(famille);
  const titres = ligneDeLaCarte(page, intitule).getByRole("listitem");
  for (const titre of libellesCites(liste)) await expect(titres.filter({ hasText: titre })).not.toHaveCount(0);
});

Then(/^la ligne « ([^«»]+) » de la carte ne montre aucune leçon$/, async ({ famille }, intitule: string) => {
  const page = await pageDuSuivi(famille);
  await expect(ligneDeLaCarte(page, intitule)).toHaveCount(1);
  await expect(ligneDeLaCarte(page, intitule).getByRole("listitem")).toHaveCount(0);
});

Then(/^la ligne « ([^«»]+) » de la carte est « ([^«»]+) »$/, async ({ famille }, intitule: string, etat: string) => {
  const page = await pageDuSuivi(famille);
  await expect(suiviDe(page).getByTestId("ligne-de-la-carte").filter({ hasText: new RegExp(`^${echapper(intitule)} : ${echapper(etat)}`) }))
    .toHaveCount(1);
});

Then(/^la carte des compétences de Léa montre, entre autres :$/, async ({ famille }, tableau: DataTable) => {
  const page = await pageDuSuivi(famille);
  for (const ligne of tableau.hashes()) {
    const intitule = String(ligne["section"]);
    const etat = String(ligne["état"]);
    await expect(
      suiviDe(page).getByTestId("ligne-de-la-carte").filter({ hasText: new RegExp(`^${echapper(intitule)} : ${echapper(etat)}`) }),
      `« ${intitule} » : ${etat}`,
    ).toHaveCount(1);
  }
});

Then(/^la légende de la carte indique (« .+ »)$/, async ({ famille }, liste: string) => {
  const page = await pageDuSuivi(famille);
  const legende = suiviDe(page).getByTestId("legende-de-la-carte").getByRole("listitem");
  for (const indication of libellesCites(liste)) await expect(legende.filter({ hasText: indication })).toHaveCount(1);
});

Then(/^les nombres de la légende font ensemble le nombre de lignes de la carte$/, async ({ famille }) => {
  const page = await pageDuSuivi(famille);
  const textes = await suiviDe(page).getByTestId("legende-de-la-carte").getByRole("listitem").allTextContents();
  const somme = textes.reduce((total, texte) => total + Number(/\((\d+)\)/.exec(texte)?.[1] ?? Number.NaN), 0);
  expect(textes).toHaveLength(4);
  const lignes = await suiviDe(page).getByTestId("ligne-de-la-carte").count();
  expect(lignes).toBeGreaterThan(0);
  expect(somme).toBe(lignes);
});

// --- Alors : lecteurs d'écran

Then(/^l'état de chaque ligne de la carte est écrit en toutes lettres, pas seulement par une couleur$/, async ({ famille }) => {
  const page = await pageDuSuivi(famille);
  const lignes = suiviDe(page).getByTestId("ligne-de-la-carte");
  expect(await lignes.count()).toBeGreaterThan(0);
  const textes = await lignes.evaluateAll((elements) =>
    elements.map((element) =>
      [...element.childNodes].filter((noeud) => noeud.nodeType === 3 || (noeud as Element).tagName === "SPAN").map((noeud) => noeud.textContent).join("")
    )
  );
  for (const texte of textes) expect(texte).toMatch(/ : (acquise|en cours|à faire|pas encore de leçon)$/);
});

/** Appelée par l'étape « les lecteurs d'écran annoncent « … » » (déjà définie par la story #25) quand le scénario est celui du suivi. */
export async function verifierQueLaLigneDeLaCarteEstAnnoncee(famille: Famille, annonce: string): Promise<void> {
  const page = await pageDuSuivi(famille);
  const coupure = annonce.lastIndexOf(" : ");
  const intitule = annonce.slice(0, coupure);
  const etat = annonce.slice(coupure + 3);
  await expect(
    suiviDe(page).getByRole("listitem").filter({ hasText: new RegExp(`^${echapper(intitule)} : ${echapper(etat)}`) }),
  ).toHaveCount(1);
}

Then(/^les lecteurs d'écran lisent « ([^«»]+) » pour les étoiles de « ([^«»]+) »$/, async ({ famille }, lecture: string, titre: string) => {
  const page = await pageDuSuivi(famille);
  await deplierLeBloc(page, BLOC_DES_LECONS_JOUEES, false);
  const lecon = suiviDe(page).getByTestId("lecon-jouee").filter({ hasText: titre });
  await expect(lecon.getByRole("img", { name: lecture, exact: true })).toBeVisible();
});

// --- Alors : leçons jouées

const COLONNES: Readonly<Record<string, string>> = {
  "leçon": "lecon",
  "matière": "matiere",
  "mention": "mention",
  "étoiles": "etoiles",
  "erreurs (dernière fois)": "erreurs",
  "dernière séance": "derniere-seance",
};

async function lireLesLeconsJouees(liste: Locator, colonnes: readonly string[]): Promise<Record<string, string>[]> {
  const attributs = colonnes.map((colonne) => COLONNES[colonne] ?? colonne);
  return liste.getByTestId("lecon-jouee").evaluateAll(
    (elements, noms) =>
      elements.map((element) =>
        Object.fromEntries(noms.map((nom) => [nom, (element.querySelector(`[data-colonne="${nom}"]`)?.textContent ?? "").trim()]))
      ),
    attributs,
  );
}

async function verifierLesLeconsJouees(famille: Famille, testid: string, tableau: DataTable): Promise<void> {
  const page = await pageDuSuivi(famille);
  await deplierLeBloc(page, BLOC_DES_LECONS_JOUEES, false);
  const colonnes = tableau.raw()[0] ?? [];
  const attendu = tableau.hashes().map((ligne) =>
    Object.fromEntries(colonnes.map((colonne) => [COLONNES[colonne] ?? colonne, String(ligne[colonne]).trim()]))
  );
  const liste = suiviDe(page).getByTestId(testid);
  await expect(liste).toBeVisible();
  await expect.poll(() => lireLesLeconsJouees(liste, colonnes)).toEqual(attendu);
}

Then(/^les leçons jouées de Léa montrent, dans l'ordre :$/, async ({ famille }, tableau: DataTable) => {
  await verifierLesLeconsJouees(famille, "lecons-jouees", tableau);
});

Then(/^les leçons jouées des autres classes de Léa montrent, à part et dans l'ordre :$/, async ({ famille }, tableau: DataTable) => {
  await verifierLesLeconsJouees(famille, "lecons-jouees-d-autres-classes", tableau);
});

Then(/^les leçons jouées de Léa indiquent « ([^«»]+) »$/, async ({ famille }, message: string) => {
  const page = await pageDuSuivi(famille);
  await expect(suiviDe(page).getByTestId("aucune-lecon-jouee")).toHaveText(message);
  await expect(suiviDe(page).getByTestId("lecons-jouees")).toHaveCount(0);
});

Then(/^aucune leçon jouée d'une autre classe n'est montrée$/, async ({ famille }) => {
  const page = await pageDuSuivi(famille);
  await expect(suiviDe(page).getByTestId("chiffres-du-suivi")).toBeVisible();
  await expect(suiviDe(page).getByTestId("lecons-jouees-d-autres-classes")).toHaveCount(0);
});

Then(/^la leçon qui n'est plus dans la bibliothèque n'apparaît pas dans les leçons jouées de Léa$/, async ({ famille }) => {
  const page = await pageDuSuivi(famille);
  await deplierLeBloc(page, BLOC_DES_LECONS_JOUEES, false);
  await expect(suiviDe(page).getByTestId("lecons-jouees")).toBeVisible();
  const lecons = suiviDe(page).getByTestId("lecon-jouee");
  await expect(lecons).toHaveCount(1);
  await expect(lecons.first()).toContainText("Le pluriel des noms");
  await expect(suiviDe(page).getByText(LECON_RETIREE)).toHaveCount(0);
});

// --- Alors : petit écran

Then(/^le choix de l'enfant et le bouton de chaque bloc du suivi mesurent au moins 44 px de haut$/, async ({ famille }) => {
  const page = await pageDuSuivi(famille);
  const boutons = [
    ...(await suiviDe(page).getByTestId("choix-de-l-enfant-suivi").getByRole("button").all()),
    boutonDuBloc(page, BLOC_DE_LA_CARTE),
    boutonDuBloc(page, BLOC_DES_LECONS_JOUEES),
  ];
  for (const bouton of boutons) {
    const boite = await bouton.boundingBox();
    expect(boite?.height ?? 0, await bouton.innerText()).toBeGreaterThanOrEqual(44);
  }
});
