import { expect, type Locator, type Page } from "@playwright/test";
import type { Appareil, Famille } from "../support/famille.ts";
import { appelerUneFonctionDeFamille, type ReponseDeLaFonction } from "../support/profils-api.ts";
import { prenomsAvecReglagesPrevus, type ReglagesBruts, reglagesPrevus } from "../support/reglages-prevus.ts";
import { toutesLesParoles } from "./etapes-puis-exercices.steps.ts";
import { avancerJusquAuxChoix, finirLaParoleJusqua } from "./exercices-a-choix.steps.ts";
import { Given, type Monde, Then, When } from "./fixtures.ts";
import {
  attendreLeRetourDuFormulaire,
  choisirSonProfil,
  connecterSiBesoin,
  creerLeProfil,
  creerParLInterface,
  etat,
  formulaireDeCreation,
  modifierLeProfil,
  pageCourante,
  pageDansLEspaceParent,
  profilDe,
} from "./profils-enfants.steps.ts";
import { preparerProfil, listeDe } from "./univers.steps.ts";
import { journal, laisserPasserLeDelaiDeLecture, normaliser, scenario } from "./voix.steps.ts";

// Story #12 : réglages d'un profil enfant. Le parent règle par l'interface (formulaire « Modifier <prénom> »).
// Les préparations passent par les Edge Functions avec le jeton du parent (RLS appliquée). Tant qu'un scénario n'a
// pas besoin d'un vrai profil, les réglages prévus sont mis dans le profil préparé de la page de démonstration.

type Reglage = "mode dys" | "tout lire à voix haute" | "parcours libre" | "clavier des dictées" | "langue du parent";

const LIBELLES: Readonly<Record<Reglage, string>> = {
  "mode dys": "Mode dys",
  "tout lire à voix haute": "Tout lire à voix haute",
  "parcours libre": "Parcours libre",
  "clavier des dictées": "Clavier des dictées",
  "langue du parent": "Langue du parent",
};

const CLES: Readonly<Record<Reglage, keyof ReglagesBruts>> = {
  "mode dys": "modeDys",
  "tout lire à voix haute": "toutLireAVoixHaute",
  "parcours libre": "parcoursLibre",
  "clavier des dictées": "clavierDesDictees",
  "langue du parent": "langueDuParent",
};

const CLAVIERS: Readonly<Record<string, string>> = {
  "automatique": "automatique",
  "lettres du mot seulement": "lettresDuMot",
  "clavier complet": "clavierComplet",
};

const DEFAUTS: Readonly<Record<Reglage, string>> = {
  "mode dys": "non",
  "tout lire à voix haute": "non",
  "parcours libre": "non",
  "clavier des dictées": "automatique",
  "langue du parent": "aucune",
};

const REGLAGES_A_COCHER: readonly Reglage[] = ["mode dys", "tout lire à voix haute", "parcours libre"];
const NIVEAUX = "(CP|CE1|CE2|CM1|CM2)";

function reglageConnu(nom: string): Reglage {
  if (!(nom in LIBELLES)) throw new Error(`Réglage inconnu : ${nom}`);
  return nom as Reglage;
}

function valeurBrute(reglage: Reglage, valeur: string): boolean | string {
  if (REGLAGES_A_COCHER.includes(reglage)) return valeur === "oui";
  if (reglage === "clavier des dictées") return CLAVIERS[valeur] ?? valeur;
  return valeur;
}

function enReglagesBruts(reglage: Reglage, valeur: string): ReglagesBruts {
  return { [CLES[reglage]]: valeurBrute(reglage, valeur) };
}

// --- Le formulaire de réglages

function formulaireDeModification(page: Page, prenom: string): Locator {
  return page.getByRole("form", { name: `Modifier ${prenom}` });
}

async function ouvrirLesReglages(page: Page, prenom: string, delai?: number): Promise<Locator> {
  const formulaire = formulaireDeModification(page, prenom);
  if ((await formulaire.count()) === 0) {
    await page.getByRole("button", { name: `Modifier le profil de ${prenom}` }).click({ timeout: delai });
  }
  await expect(formulaire).toBeVisible();
  return formulaire;
}

async function lireUnReglage(formulaire: Locator, reglage: Reglage): Promise<string> {
  const champ = formulaire.getByLabel(LIBELLES[reglage], { exact: true });
  if (REGLAGES_A_COCHER.includes(reglage)) return (await champ.isChecked()) ? "oui" : "non";
  const valeur = await champ.inputValue();
  if (reglage !== "clavier des dictées") return valeur;
  return Object.entries(CLAVIERS).find(([, brute]) => brute === valeur)?.[0] ?? valeur;
}

async function regler(formulaire: Locator, reglage: Reglage, valeur: string) {
  const champ = formulaire.getByLabel(LIBELLES[reglage], { exact: true });
  if (REGLAGES_A_COCHER.includes(reglage)) await champ.setChecked(valeur === "oui");
  else await champ.selectOption(String(valeurBrute(reglage, valeur)));
}

/** La liste des profils est relue après chaque écriture : un formulaire ouvert trop tôt montre l'ancienne valeur, on le rouvre. */
async function verifierLesReglages(page: Page, prenom: string, attendus: Partial<Record<Reglage, string>>) {
  await expect(async () => {
    const formulaire = await ouvrirLesReglages(page, prenom, 3_000);
    try {
      for (const [reglage, valeur] of Object.entries(attendus)) {
        expect(await lireUnReglage(formulaire, reglageConnu(reglage)), `réglage « ${reglage} » de ${prenom}`).toBe(valeur);
      }
    } catch (ecart) {
      await formulaire.getByRole("button", { name: "Annuler" }).click();
      throw ecart;
    }
  }).toPass({ timeout: 15_000 });
}

function tousParDefautSauf(reglage?: Reglage): Partial<Record<Reglage, string>> {
  const attendus: Partial<Record<Reglage, string>> = { ...DEFAUTS };
  if (reglage) delete attendus[reglage];
  return attendus;
}

// --- Qui est où

type EtatDesReglages = { dernierReglage: Reglage | undefined; reponse: ReponseDeLaFonction | undefined };
const etats = new WeakMap<Famille, EtatDesReglages>();
function etatDesReglages(famille: Famille): EtatDesReglages {
  let courant = etats.get(famille);
  if (!courant) {
    courant = { dernierReglage: undefined, reponse: undefined };
    etats.set(famille, courant);
  }
  return courant;
}

const ecransDeLEnfant = new WeakMap<Page, Page>();
function ecranDeLEnfant(page: Page): Page {
  return ecransDeLEnfant.get(page) ?? page;
}

async function pageDuParent(famille: Famille, parent: string): Promise<Page> {
  if (parent === "Marie") return famille.page("telephone");
  return pageCourante(famille);
}

/** La page où ce parent est connecté (la tablette, sinon le téléphone où il se connecte), ouverte sur l'espace parent. */
async function pageDuParentDansLEspaceParent(famille: Famille, parent: string): Promise<{ page: Page; appareil: Appareil }> {
  const adresse = famille.normalisee(famille.adresseDe(parent));
  const tablette = await famille.page("tablette");
  const appareil: Appareil = (await famille.session(tablette))?.user.email === adresse || (await famille.session(tablette)) === null
    ? "tablette"
    : "telephone";
  const page = await famille.page(appareil);
  const session = await famille.session(page);
  if (session?.user.email !== adresse) await famille.connecterSansEmail(appareil, parent);
  await page.goto("/");
  await famille.allerDansLEspaceParent(appareil);
  return { page, appareil };
}

// --- Préparation

async function materialiser(famille: Famille, page: Page, prenom: string) {
  const reglages = reglagesPrevus(page, prenom);
  if (etat(famille).profils.some((p) => p.prenom === prenom)) {
    if (Object.keys(reglages).length > 0) await modifierLeProfil(famille, prenom, { reglages });
    return;
  }
  await creerLeProfil(famille, "Paul", { prenom, niveau: "CE1", reglages });
}

async function prevoirUnReglage(
  famille: Famille,
  page: Page,
  monde: Monde,
  prenom: string,
  reglage: Reglage,
  valeur: string,
  surUnAppareil: boolean,
) {
  const brut = enReglagesBruts(reglage, valeur);
  Object.assign(reglagesPrevus(page, prenom), brut);
  if (etat(famille).profils.some((p) => p.prenom === prenom)) await modifierLeProfil(famille, prenom, { reglages: brut });
  else if (surUnAppareil) await materialiser(famille, page, prenom);
  else {
    const local = monde.profils.get(prenom);
    if (local && prenom === "Léa") await preparerProfil(page, local);
  }
}

Given(
  /^Paul a (?:ensuite )?réglé « ([^«»]+) » sur « ([^«»]+) » pour (Léa|Tom)( sur la tablette| sur le téléphone)?$/,
  async ({ famille, page, monde }, reglage: string, valeur: string, prenom: string, appareil?: string) => {
    await prevoirUnReglage(famille, page, monde, prenom, reglageConnu(reglage), valeur, typeof appareil === "string");
  },
);

Given(
  /^le réglage « ([^«»]+) » de (Léa|Tom) est sur « ([^«»]+) »$/,
  async ({ famille, page, monde }, reglage: string, prenom: string, valeur: string) => {
    await prevoirUnReglage(famille, page, monde, prenom, reglageConnu(reglage), valeur, false);
  },
);

Given(
  new RegExp(`^Paul a créé le profil enfant "(.*)" de niveau ${NIVEAUX} sans changer ses réglages$`),
  async ({ famille }, prenom: string, niveau: string) => {
    const page = await connecterSiBesoin(famille, "tablette", "Paul");
    await famille.allerDansLEspaceParent("tablette");
    await creerParLInterface(page, prenom, niveau);
  },
);

Given(/^(Paul|Marie) est dans l'espace parent sur le téléphone$/, async ({ famille }, parent: string) => {
  etat(famille).appareil = "telephone";
  await connecterSiBesoin(famille, "telephone", parent);
  await famille.allerDansLEspaceParent("telephone");
});

async function allerALaDemonstrationDansLApplication(page: Page) {
  if (new URL(page.url()).pathname !== "/demonstration") {
    await page.evaluate(() => {
      history.pushState({ profondeur: 2 }, "", "/demonstration");
      dispatchEvent(new PopStateEvent("popstate"));
    });
  }
  await expect(page.getByTestId("consigne")).toBeVisible();
}

async function jouerSurLaTablette(famille: Famille, page: Page, prenoms: string[]) {
  for (const prenom of prenoms) await materialiser(famille, page, prenom);
  const tablette = await connecterSiBesoin(famille, "tablette", "Paul");
  await choisirSonProfil(tablette, prenoms[0] ?? "Léa");
  ecransDeLEnfant.set(page, tablette);
  await allerALaDemonstrationDansLApplication(tablette);
}

Given(/^Léa a joué sur la tablette$/, async ({ famille, page }) => {
  await jouerSurLaTablette(famille, page, prenomsAvecReglagesPrevus(page));
});

Given(/^Léa joue sur la tablette sans le mode dys$/, async ({ famille, page, monde }) => {
  await prevoirUnReglage(famille, page, monde, "Léa", "mode dys", "non", false);
  await jouerSurLaTablette(famille, page, ["Léa"]);
});

Given(/^Léa est revenue sur « Qui joue \? » sur la tablette$/, async ({ famille, page }) => {
  const tablette = await connecterSiBesoin(famille, "tablette", "Paul");
  // L'appareil montre d'abord sa copie des profils, puis la liste relue : Léa choisit son profil une fois la liste à jour.
  const listeRelue = tablette.waitForResponse((reponse) =>
    reponse.url().includes("/rest/v1/profils_enfants") && reponse.request().method() === "GET"
  );
  await tablette.goto("/");
  await listeRelue;
  await tablette.evaluate(() => new Promise<void>((fin) => requestAnimationFrame(() => requestAnimationFrame(() => fin()))));
  await expect(tablette.getByTestId("qui-joue")).toBeVisible();
  ecransDeLEnfant.set(page, tablette);
});

Given(
  /^la page de démonstration propose (?:les choix (.+)|le seul choix « ([^«»]+) »)$/,
  async ({ page }, liste?: string, seul?: string) => {
    scenario(page).consigne.choix = typeof seul === "string" ? [seul] : listeDe(liste ?? "");
  },
);

// --- Quand : le parent

When(/^Paul ouvre les réglages de (Léa|Tom)$/, async ({ famille }, prenom: string) => {
  await ouvrirLesReglages(await pageCourante(famille), prenom);
});

When(
  /^(Paul|Marie) règle « ([^«»]+) » sur « ([^«»]+) » pour (Léa|Tom)$/,
  async ({ famille }, parent: string, nom: string, valeur: string, prenom: string) => {
    const reglage = reglageConnu(nom);
    const page = await pageDuParent(famille, parent);
    const formulaire = await ouvrirLesReglages(page, prenom);
    await regler(formulaire, reglage, valeur);
    await formulaire.getByRole("button", { name: "Enregistrer" }).click();
    await attendreLeRetourDuFormulaire(page);
    await expect(page.getByRole("alert")).toHaveCount(0);
    etatDesReglages(famille).dernierReglage = reglage;
  },
);

When(
  new RegExp(`^Paul crée le profil enfant "(.*)" de niveau ${NIVEAUX} en réglant « ([^«»]+) » sur « ([^«»]+) »$`),
  async ({ famille }, prenom: string, niveau: string, nom: string, valeur: string) => {
    const reglage = reglageConnu(nom);
    await famille.allerDansLEspaceParent("tablette");
    const page = await famille.page("tablette");
    const formulaire = formulaireDeCreation(page);
    await formulaire.getByLabel("Prénom").fill(prenom);
    await formulaire.getByLabel("Classe").selectOption({ label: niveau });
    await regler(formulaire, reglage, valeur);
    await formulaire.getByRole("button", { name: "Créer le profil" }).click();
    await attendreLeRetourDuFormulaire(page);
    await expect(page.getByRole("alert")).toHaveCount(0);
    etatDesReglages(famille).dernierReglage = reglage;
  },
);

When(
  /^Claire tente de régler « ([^«»]+) » sur « ([^«»]+) » pour Léa$/,
  async ({ famille }, nom: string, valeur: string) => {
    const jeton = (await famille.session(await famille.page("tablette")))?.access_token;
    expect(jeton, "Claire doit être connectée sur la tablette").toBeTruthy();
    etatDesReglages(famille).reponse = await appelerUneFonctionDeFamille("modifier-profil-enfant", jeton, {
      profil: profilDe(famille, "Léa").id,
      reglages: enReglagesBruts(reglageConnu(nom), valeur),
    });
  },
);

When(
  /^un visiteur tente de régler « ([^«»]+) » sur « ([^«»]+) » pour Léa$/,
  async ({ famille }, nom: string, valeur: string) => {
    etatDesReglages(famille).reponse = await appelerUneFonctionDeFamille("modifier-profil-enfant", undefined, {
      profil: profilDe(famille, "Léa").id,
      reglages: enReglagesBruts(reglageConnu(nom), valeur),
    });
  },
);

// --- Quand : l'enfant

When(/^Tom choisit son profil enfant dans « Qui joue \? » sur la tablette$/, async ({ famille, page }) => {
  const tablette = await connecterSiBesoin(famille, "tablette", "Paul");
  await choisirSonProfil(tablette, "Tom");
  ecransDeLEnfant.set(page, tablette);
});

When(/^Léa commence à jouer sur le téléphone$/, async ({ famille, page }) => {
  await materialiser(famille, page, "Léa");
  const telephone = await connecterSiBesoin(famille, "telephone", "Paul");
  await choisirSonProfil(telephone, "Léa");
  ecransDeLEnfant.set(page, telephone);
});

// --- Alors : le formulaire de réglages

Then(
  /^les réglages de (Léa|Tom) indiquent : mode dys (oui|non), tout lire à voix haute (oui|non), parcours libre (oui|non), clavier des dictées (.+), langue du parent (\S+)$/,
  async ({ famille }, prenom: string, dys: string, tout: string, libre: string, clavier: string, langue: string) => {
    await verifierLesReglages(await pageDansLEspaceParent(famille), prenom, {
      "mode dys": dys,
      "tout lire à voix haute": tout,
      "parcours libre": libre,
      "clavier des dictées": clavier,
      "langue du parent": langue,
    });
  },
);

Then(
  /^les réglages de (Léa|Tom) indiquent « ([^«»]+) » : « ([^«»]+) »$/,
  async ({ famille }, prenom: string, nom: string, valeur: string) => {
    await verifierLesReglages(await pageDansLEspaceParent(famille), prenom, { [reglageConnu(nom)]: valeur });
  },
);

Then(/^les autres réglages de Léa ont leurs valeurs par défaut$/, async ({ famille }) => {
  await verifierLesReglages(await pageDansLEspaceParent(famille), "Léa", tousParDefautSauf(etatDesReglages(famille).dernierReglage));
});

Then(
  /^Paul retrouve « ([^«»]+) » sur « ([^«»]+) » dans les réglages de Léa$/,
  async ({ famille }, nom: string, valeur: string) => {
    const { page } = await pageDuParentDansLEspaceParent(famille, "Paul");
    await verifierLesReglages(page, "Léa", { [reglageConnu(nom)]: valeur });
  },
);

Then(/^Paul retrouve les réglages de Léa inchangés$/, async ({ famille }) => {
  const { page } = await pageDuParentDansLEspaceParent(famille, "Paul");
  await verifierLesReglages(page, "Léa", tousParDefautSauf());
});

Then(
  /^Paul voit les réglages mode dys, tout lire à voix haute, parcours libre, clavier des dictées et langue du parent$/,
  async ({ famille }) => {
    const formulaire = await ouvrirLesReglages(await pageCourante(famille), "Léa");
    const reglages = formulaire.getByTestId("reglages");
    await expect(reglages.getByRole("checkbox")).toHaveCount(3);
    await expect(reglages.getByRole("combobox")).toHaveCount(2);
    for (const libelle of Object.values(LIBELLES)) await expect(reglages.getByLabel(libelle, { exact: true })).toBeVisible();
  },
);

Then(/^aucun réglage ne limite la durée de jeu$/, async ({ famille }) => {
  const formulaire = await ouvrirLesReglages(await pageCourante(famille), "Léa");
  const reglages = formulaire.getByTestId("reglages");
  await expect(reglages.getByText(/durée|temps|minutes?|heures?|limite|écran/i)).toHaveCount(0);
  await expect(reglages.getByRole("slider")).toHaveCount(0);
  await expect(reglages.getByRole("spinbutton")).toHaveCount(0);
});

Then(/^le clavier des dictées propose « ([^«»]+) », « ([^«»]+) » et « ([^«»]+) »$/, async ({ famille }, a: string, b: string, c: string) => {
  const formulaire = await ouvrirLesReglages(await pageCourante(famille), "Léa");
  const options = await formulaire.getByLabel("Clavier des dictées", { exact: true }).getByRole("option").allTextContents();
  expect(options.map((option) => option.toLowerCase())).toEqual([a, b, c]);
});

Then(/^la langue du parent propose « aucune » et les langues (.+)$/, async ({ famille }, langues: string) => {
  const formulaire = await ouvrirLesReglages(await pageCourante(famille), "Léa");
  const options = await formulaire.getByLabel("Langue du parent", { exact: true }).getByRole("option").allTextContents();
  const attendues = langues.split(", ");
  expect(attendues).toHaveLength(20);
  expect(options.map((option) => option.toLowerCase())).toEqual(["aucune", ...attendues]);
});

// --- Alors : accès

Then(/^Claire ne voit aucun réglage de Léa$/, async ({ famille }) => {
  const page = await famille.page("tablette");
  await expect(page.getByTestId("profils-de-l-espace-parent")).toBeVisible();
  await expect(page.getByText("Chargement des profils")).toHaveCount(0);
  await expect(page.getByRole("button", { name: "Modifier le profil de Léa" })).toHaveCount(0);
  await expect(formulaireDeModification(page, "Léa")).toHaveCount(0);
  await expect(page.getByText("Léa")).toHaveCount(0);
});

Then(/^le changement est refusé comme pour un profil introuvable$/, async ({ famille }) => {
  const reponse = etatDesReglages(famille).reponse;
  expect(reponse?.statut).toBe(404);
  expect(reponse?.message).toBe("Ce profil enfant est introuvable.");
});

Then(/^le changement est refusé$/, async ({ famille }) => {
  expect(etatDesReglages(famille).reponse?.statut).toBe(401);
});

Then(/^les réglages ne sont pas proposés à Léa$/, async ({ page }) => {
  await expect(page.getByTestId("consigne")).toBeVisible();
  await expect(page.getByTestId("reglages")).toHaveCount(0);
  await expect(page.getByRole("form")).toHaveCount(0);
  await expect(page.getByRole("button", { name: /Modifier/ })).toHaveCount(0);
});

// --- Alors : mode dys

type StyleLu = { famille: string; lettres: string; mots: string; lignes: string; taille: string };

async function styleDe(element: Locator): Promise<StyleLu> {
  return element.first().evaluate((el) => {
    const s = getComputedStyle(el);
    return { famille: s.fontFamily, lettres: s.letterSpacing, mots: s.wordSpacing, lignes: s.lineHeight, taille: s.fontSize };
  });
}

function enEm(valeur: string, taille: string): number {
  return Number.parseFloat(valeur) / Number.parseFloat(taille);
}

// Les espaces entre lettres et entre mots (en em) sont fixés sur l'écran : les textes en héritent en longueur.
export async function verifierModeDys(page: Page, elements: Locator[], attendu: boolean) {
  const principal = page.getByRole("main");
  if (attendu) await expect(principal).toHaveAttribute("data-mode-dys", "true");
  else await expect(principal).not.toHaveAttribute("data-mode-dys", "true");
  const ecran = await styleDe(principal);
  if (attendu) {
    expect(enEm(ecran.lettres, ecran.taille)).toBeCloseTo(0.08, 2);
    expect(enEm(ecran.mots, ecran.taille)).toBeCloseTo(0.3, 2);
  }
  for (const element of elements) {
    await expect(element.first()).toBeVisible();
    const style = await styleDe(element);
    if (attendu) {
      expect(style.famille).toContain("Andika");
      expect(style.lettres).toBe(ecran.lettres);
      expect(style.mots).toBe(ecran.mots);
      expect(enEm(style.lignes, style.taille)).toBeCloseTo(1.9, 1);
    } else {
      expect(style.famille).not.toContain("Andika");
      expect(style.lettres).toBe("normal");
      expect(style.mots).toBe("0px");
    }
  }
  if (attendu) {
    const chargees = await page.evaluate(async () => (await document.fonts.load("1em Andika", "a")).length);
    expect(chargees, "la police Andika est chargée").toBeGreaterThan(0);
  }
}

Then(
  /^(Léa|Tom) voit la consigne de la page de démonstration (en mode dys|sans le mode dys)$/,
  async ({ page }, _prenom: string, mode: string) => {
    const ecran = ecranDeLEnfant(page);
    await allerALaDemonstrationDansLApplication(ecran);
    await verifierModeDys(ecran, [ecran.getByTestId("consigne")], mode === "en mode dys");
  },
);

Then(/^Léa voit la consigne « ([^«»]+) » en mode dys : .+$/, async ({ page }, texte: string) => {
  await expect(page.getByTestId("consigne")).toHaveText(normaliser(texte));
  await verifierModeDys(page, [page.getByTestId("consigne")], true);
});

Then(/^la consigne ne s'affiche pas en mode dys$/, async ({ page }) => {
  await verifierModeDys(page, [page.getByTestId("consigne")], false);
});

Then(/^la félicitation de Noisette s'affiche en mode dys$/, async ({ page }) => {
  await expect(page.getByTestId("parole")).toHaveAttribute("data-nature", "felicitation");
  await verifierModeDys(page, [page.getByTestId("parole")], true);
});

const COULEURS_DES_SYLLABES = ["rgb(29, 78, 216)", "rgb(180, 35, 24)"];

Then(
  /^Léa voit « ([^«»]+) » en deux syllabes de couleurs alternées, « ([^«»]+) » puis « ([^«»]+) »$/,
  async ({ page }, mot: string, premiere: string, seconde: string) => {
    const enSyllabes = page.getByTestId("consigne").getByTestId("mot-en-syllabes");
    await expect(enSyllabes).toHaveCount(1);
    await expect(enSyllabes).toHaveText(mot);
    const syllabes = enSyllabes.getByText(/./);
    await expect(syllabes).toHaveText([premiere, seconde]);
    for (const [rang, couleur] of COULEURS_DES_SYLLABES.entries()) {
      await expect(syllabes.nth(rang)).toHaveAttribute("data-parite", String(rang));
      await expect(syllabes.nth(rang)).toHaveCSS("color", couleur);
    }
  },
);

Then(/^« ([^«»]+) », « ([^«»]+) » et « ([^«»]+) » restent d'une seule couleur$/, async ({ page }, a: string, b: string, c: string) => {
  const consigne = page.getByTestId("consigne");
  const couleurDuTexte = await consigne.evaluate((el) => getComputedStyle(el).color);
  expect(COULEURS_DES_SYLLABES).not.toContain(couleurDuTexte);
  for (const mot of [a, b, c]) {
    const unMot = consigne.locator("[data-mot]").filter({ hasText: new RegExp(`^${mot}$`) });
    await expect(unMot).toHaveCount(1);
    await expect(unMot.getByTestId("mot-en-syllabes")).toHaveCount(0);
    await expect(unMot).toHaveCSS("color", couleurDuTexte);
  }
});

Then(/^Léa voit la question et les choix en mode dys : .+$/, async ({ page }) => {
  await avancerJusquAuxChoix(page);
  const choix = page.getByTestId("choix");
  await expect(choix.first()).toBeVisible();
  await verifierModeDys(page, [page.getByTestId("question"), ...(await choix.all())], true);
});

Then(/^Léa voit le texte de l'étape de leçon dans la bulle de Noisette en mode dys : .+$/, async ({ page }) => {
  await verifierModeDys(page, [page.getByTestId("parole")], true);
});

Then(/^Léa voit les exemples « ([^«»]+) », « ([^«»]+) » et « ([^«»]+) » en mode dys$/, async ({ page }, a: string, b: string, c: string) => {
  const exemples = page.getByTestId("exemple");
  await expect(exemples).toHaveText([a, b, c]);
  await verifierModeDys(page, await exemples.all(), true);
});

// --- Alors : « tout lire à voix haute »

Then(/^Léa entend ensuite Noisette dire « ([^«»]+) »$/, async ({ page }, texte: string) => {
  await finirLaParoleJusqua(page, { type: "texte-lu", texte: normaliser(texte) });
});

async function verifierQueLesChoixNeSontPasLus(page: Page) {
  await laisserPasserLeDelaiDeLecture(page);
  expect((await journal(page)).lecture.texte).not.toMatch(/Est-ce/);
  expect((await toutesLesParoles(page)).join(" ")).not.toMatch(/Est-ce/);
}

Then(/^Léa n'entend (?:pas les choix|aucun choix proposé)$/, async ({ page }) => {
  await verifierQueLesChoixNeSontPasLus(page);
});
