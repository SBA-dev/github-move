import { expect, type Locator, type Page } from "@playwright/test";
import { ouvrirUneSessionSansEmail } from "../support/connexion-sans-email.ts";
import type { Appareil, Famille } from "../support/famille.ts";
import { appelerUneFonctionDeFamille, lireEnRestLeNiveauDuProfil, ecrireEnRestUnProfil, lireEnRestLesProfilsVisibles, type ReponseDeLaFonction } from "../support/profils-api.ts";
import { rattacherUnParent } from "../support/supabase-test.ts";
import { Given, Then, When } from "./fixtures.ts";
import { cleDe, preparerProfil } from "./univers.steps.ts";

// Story #11 : profils enfants, « Qui joue ? » et rattachement des parents.
// Le parent agit par l'interface. Les préparations (« Paul est rattaché au profil enfant… ») passent par les Edge
// Functions de Famille avec le jeton du parent (session obtenue sans e-mail) : la RLS et les règles métier
// s'appliquent comme pour l'application. La clé service_role ne sert qu'au nettoyage (features/support).

export type ProfilCree = { readonly id: string; readonly prenom: string; readonly parent: string };

type Etat = {
  appareil: Appareil;
  readonly profils: ProfilCree[];
  readonly jetons: Map<string, string>;
  reponse: ReponseDeLaFonction | undefined;
};

const etats = new WeakMap<Famille, Etat>();

export function etat(famille: Famille): Etat {
  const connu = etats.get(famille);
  if (connu) return connu;
  const neuf: Etat = { appareil: "tablette", profils: [], jetons: new Map(), reponse: undefined };
  etats.set(famille, neuf);
  return neuf;
}

const PRENOMS_POUR_DIX = ["Ana", "Bao", "Cléo", "Dan", "Eva", "Fabio", "Gaia", "Hugo", "Ilan", "Jade"];
const DETAIL_PAR_DEFAUT = "Animaux de la forêt";
const NIVEAU_PAR_DEFAUT = "CE1";

function echapper(texte: string): string {
  return texte.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

// --- Préparation par les Edge Functions, avec le jeton du parent

export async function jetonDe(famille: Famille, parent: string): Promise<string> {
  const jetons = etat(famille).jetons;
  const connu = jetons.get(parent);
  if (connu) return connu;
  const adresse = famille.normalisee(famille.adresseDe(parent));
  await famille.preparerUnParent(adresse);
  const { access_token: jeton } = await ouvrirUneSessionSansEmail(adresse);
  jetons.set(parent, jeton);
  return jeton;
}

export type Saisie = { prenom: string; niveau?: string; libelleUnivers?: string; reglages?: object };

export async function creerLeProfil(famille: Famille, parent: string, saisie: Saisie): Promise<ProfilCree> {
  const reponse = await appelerUneFonctionDeFamille("creer-profil-enfant", await jetonDe(famille, parent), {
    prenom: saisie.prenom,
    ...(saisie.niveau === undefined ? {} : { niveau: saisie.niveau }),
    ...(saisie.libelleUnivers === undefined ? {} : { univers: cleDe(saisie.libelleUnivers) }),
    ...(saisie.reglages === undefined ? {} : { reglages: saisie.reglages }),
  });
  expect(reponse.statut, `création du profil enfant « ${saisie.prenom} » : ${reponse.message ?? ""}`).toBe(200);
  const profil = { id: reponse.profil?.id ?? "", prenom: saisie.prenom, parent };
  etat(famille).profils.push(profil);
  return profil;
}

// Le profil existe avant que le parent ouvre Savanturier : si la tablette est déjà connectée, on la rouvre pour qu'elle le lise.
async function rouvrirLaTabletteConnectee(famille: Famille): Promise<void> {
  const page = await famille.page("tablette");
  if (page.url() !== "about:blank" && (await famille.session(page)) !== null) {
    await page.goto("/");
    await ouvrirQuiJoue(page);
  }
}

export async function assurerLeProfil(famille: Famille, parent: string, saisie: Saisie): Promise<ProfilCree> {
  const existant = etat(famille).profils.find((p) => p.parent === parent && p.prenom === saisie.prenom);
  if (existant) return existant;
  const cree = await creerLeProfil(famille, parent, saisie);
  await rouvrirLaTabletteConnectee(famille);
  return cree;
}

export function profilDe(famille: Famille, prenom: string): ProfilCree {
  const profil = etat(famille).profils.find((p) => p.prenom === prenom);
  if (!profil) throw new Error(`Profil enfant non préparé : ${prenom}`);
  return profil;
}

export async function modifierLeProfil(famille: Famille, prenom: string, changement: object): Promise<void> {
  const profil = profilDe(famille, prenom);
  const reponse = await appelerUneFonctionDeFamille("modifier-profil-enfant", await jetonDe(famille, profil.parent), {
    profil: profil.id,
    ...changement,
  });
  expect(reponse.statut, `modification du profil enfant « ${prenom} » : ${reponse.message ?? ""}`).toBe(200);
}

export async function connecterSiBesoin(famille: Famille, appareil: Appareil, parent: string): Promise<Page> {
  const page = await famille.page(appareil);
  if ((await famille.session(page)) === null) await famille.connecterSansEmail(appareil, parent);
  return page;
}

// --- Ce que le parent fait à l'écran

export async function pageCourante(famille: Famille): Promise<Page> {
  return famille.page(etat(famille).appareil);
}

/** La page où le parent travaille, ouverte sur l'espace parent (qu'une création de profil ou un test de départ proposé a pu fermer). */
export async function pageDansLEspaceParent(famille: Famille): Promise<Page> {
  const appareil = etat(famille).appareil;
  await famille.allerDansLEspaceParent(appareil);
  return famille.page(appareil);
}

export function formulaireDeCreation(page: Page): Locator {
  return page.getByRole("form", { name: "Ajouter un enfant" });
}

export async function attendreLeRetourDuFormulaire(page: Page): Promise<void> {
  // Story #27 : après une création, l'espace parent se ferme sur la proposition du test de départ (ou sur l'accueil de l'enfant
  // quand la bibliothèque n'est pas chargée).
  const retour = page.getByRole("status").filter({ hasText: /est (créé|enregistré)/ }).or(page.getByRole("alert"))
    .or(page.getByTestId("proposition-du-test-de-depart")).or(page.getByRole("region", { name: /^Accueil de / }));
  // Le retour attend la réponse de l'Edge Function (démarrage à froid possible) : on attend l'élément sans le délai court des assertions.
  await retour.first().waitFor();
}

export async function creerParLInterface(page: Page, prenom: string, niveau?: string, libelleUnivers?: string): Promise<void> {
  const formulaire = formulaireDeCreation(page);
  await formulaire.getByLabel("Prénom").fill(prenom);
  if (niveau !== undefined) await formulaire.getByLabel("Classe").selectOption({ label: niveau });
  if (libelleUnivers !== undefined) await formulaire.getByLabel("Univers").selectOption({ label: libelleUnivers });
  await formulaire.getByRole("button", { name: "Créer le profil" }).click();
  await attendreLeRetourDuFormulaire(page);
}

async function modifierParLInterface(page: Page, prenom: string, changement: { niveau?: string; nouveauPrenom?: string }) {
  await page.getByRole("button", { name: `Modifier le profil de ${prenom}` }).click();
  const formulaire = page.getByRole("form", { name: `Modifier ${prenom}` });
  if (changement.niveau !== undefined) await formulaire.getByLabel("Classe").selectOption({ label: changement.niveau });
  if (changement.nouveauPrenom !== undefined) await formulaire.getByLabel("Prénom").fill(changement.nouveauPrenom);
  await formulaire.getByRole("button", { name: "Enregistrer" }).click();
  await attendreLeRetourDuFormulaire(page);
}

function quiJoue(page: Page): Locator {
  return page.getByTestId("qui-joue");
}

/** « Qui joue ? » chargé : depuis l'espace parent on le quitte, sinon on ouvre Savanturier. */
export async function ouvrirQuiJoue(page: Page): Promise<Locator> {
  const quitter = page.getByRole("button", { name: "Quitter l'espace parent" });
  if (page.url() === "about:blank") await page.goto("/");
  // Story #27 : depuis le test de départ, on revient à « Qui joue ? » dans l'application, sans recharger la page (le test fait
  // pendant l'utilisation et le réseau coupé en dépendent).
  if (new URL(page.url()).pathname === "/test-de-depart") {
    await page.getByRole("banner").getByRole("button", { name: "Savanturier" }).click();
  }
  const dejaLa = await quiJoue(page).or(quitter).waitFor({ timeout: 5_000 }).then(() => true, () => false);
  if (!dejaLa) await page.goto("/");
  if (await quitter.isVisible()) await quitter.click();
  await expect(quiJoue(page)).toBeVisible();
  await expect(quiJoue(page).getByText("Chargement des profils")).toHaveCount(0);
  return quiJoue(page);
}

function profilsAChoisir(page: Page): Locator {
  return page.getByTestId("profil-a-choisir");
}

function profilAvecDetail(page: Page, prenom: string, detail: string): Locator {
  return page.getByRole("button", { name: new RegExp(`(^| )${echapper(prenom)} ${echapper(detail)}$`) });
}

export async function choisirSonProfil(page: Page, prenom: string): Promise<void> {
  await ouvrirQuiJoue(page);
  await profilsAChoisir(page).filter({ hasText: prenom }).first().click();
  await expect(page).toHaveURL(/\/jeu$/);
}

// --- Étant donné : profils rattachés

const NIVEAUX = "(CP|CE1|CE2|CM1|CM2)";
const UNIVERS_LIBELLE = "« ([^«»]+) »";

Given(
  /^(Paul|Claire) est rattachée? au profil enfant "(.*)" de niveau (\S+)$/,
  async ({ famille }, parent: string, prenom: string, niveau: string) => {
    await assurerLeProfil(famille, parent, { prenom, niveau });
  },
);

Given(/^(Paul|Marie) est rattachée? au profil enfant de (Léa|Tom)$/, async ({ famille }, parent: string, prenom: string) => {
  if (parent === "Paul") {
    await assurerLeProfil(famille, "Paul", { prenom, niveau: NIVEAU_PAR_DEFAUT });
    return;
  }
  const { id } = etat(famille).profils.find((p) => p.prenom === prenom) ??
    await assurerLeProfil(famille, "Paul", { prenom, niveau: NIVEAU_PAR_DEFAUT });
  const marie = await famille.preparerUnParent(famille.normalisee(famille.adresseDe(parent)));
  await rattacherUnParent(id, marie.id);
});

Given(/^Paul est rattaché à (\d+) profils enfants$/, async ({ famille }, nombre: string) => {
  for (const prenom of PRENOMS_POUR_DIX.slice(0, Number(nombre))) await creerLeProfil(famille, "Paul", { prenom });
});

// Le profil de Léa existe pour la famille de Paul ; la porte de test du profil préparé permet de la faire jouer
// sur l'accueil de l'enfant (scénarios de #5 et #6).
Given(/^Léa a un profil enfant de niveau (\S+)$/, async ({ famille, page, monde }, niveau: string) => {
  await assurerLeProfil(famille, "Paul", { prenom: "Léa", niveau });
  const profil = { prenom: "Léa", niveau, univers: cleDe(DETAIL_PAR_DEFAUT) };
  monde.profils.set("Léa", profil);
  await preparerProfil(page, profil);
});

Given(
  new RegExp(`^Paul a créé (?:ensuite )?le profil enfant "(.*)" de niveau ${NIVEAUX} dans l'univers ${UNIVERS_LIBELLE}$`),
  async ({ famille }, prenom: string, niveau: string, libelleUnivers: string) => {
    await creerLeProfil(famille, "Paul", { prenom, niveau, libelleUnivers });
    await connecterSiBesoin(famille, "tablette", "Paul");
  },
);

Given(/^Paul a créé les profils enfants "(.+)", "(.+)" et "(.+)"$/, async ({ famille }, a: string, b: string, c: string) => {
  for (const prenom of [a, b, c]) await creerLeProfil(famille, "Paul", { prenom });
  await connecterSiBesoin(famille, "tablette", "Paul");
});

Given(
  new RegExp(`^Paul a créé sur la tablette le profil enfant "(.*)" de niveau ${NIVEAUX} dans l'univers ${UNIVERS_LIBELLE}$`),
  async ({ famille }, prenom: string, niveau: string, libelleUnivers: string) => {
    await connecterSiBesoin(famille, "tablette", "Paul");
    await famille.allerDansLEspaceParent("tablette");
    await creerParLInterface(await famille.page("tablette"), prenom, niveau, libelleUnivers);
  },
);

Given(
  new RegExp(`^Paul a changé l'univers du profil enfant de (\\S+) en ${UNIVERS_LIBELLE}$`),
  async ({ famille, $tags }, prenom: string, libelleUnivers: string) => {
    await modifierLeProfil(famille, prenom, { univers: cleDe(libelleUnivers) });
    if ($tags.includes("@issue-102")) universChoisiParLeParent.set(famille, libelleUnivers);
    await connecterSiBesoin(famille, "tablette", "Paul");
  },
);

// Story #102 : « Qui joue ? » peut encore montrer la liste d'avant le changement ; l'enfant se choisit une fois le nouvel univers affiché.
const universChoisiParLeParent = new WeakMap<Famille, string>();

// Story #25 : le changement de niveau fait perdre le profil en cours (rechargement de la page). L'enfant se choisit de nouveau
// dans « Qui joue ? » une fois la liste à jour, pour que la séance suivante se joue avec son vrai profil et son nouveau niveau.
async function rechoisirLEnfantApresLeChangement(famille: Famille, page: Page, prenom: string): Promise<void> {
  const profil = profilDe(famille, prenom);
  const niveau = await lireEnRestLeNiveauDuProfil(await jetonDe(famille, profil.parent), profil.id);
  const quiJoue = await ouvrirQuiJoue(page);
  await expect(quiJoue.getByTestId("profil-a-choisir").filter({ hasText: prenom }).first()).toContainText(`${niveau} ·`);
  await choisirSonProfil(page, prenom);
}

Given(
  new RegExp(`^Paul a changé sur la tablette le niveau du profil enfant de (\\S+) en ${NIVEAUX}$`),
  async ({ famille, $tags }, prenom: string, niveau: string) => {
    await assurerLeProfil(famille, "Paul", { prenom, niveau: NIVEAU_PAR_DEFAUT });
    const page = await connecterSiBesoin(famille, "tablette", "Paul");
    await page.goto("/");
    await famille.allerDansLEspaceParent("tablette");
    await modifierParLInterface(page, prenom, { niveau });
    if ($tags.includes("@issue-25") || $tags.includes("@issue-26") || $tags.includes("@issue-29") || $tags.includes("@issue-30") || $tags.includes("@issue-99") || $tags.includes("@issue-101")) await rechoisirLEnfantApresLeChangement(famille, page, prenom);
  },
);

Given(/^Léa a choisi son profil enfant dans « Qui joue \? »$/, async ({ famille }) => {
  await assurerLeProfil(famille, "Paul", { prenom: "Léa", niveau: NIVEAU_PAR_DEFAUT });
  const page = await connecterSiBesoin(famille, "tablette", "Paul");
  await choisirSonProfil(page, "Léa");
});

Given(/^« Qui joue \? » est affiché sur la tablette$/, async ({ famille }) => {
  const page = await connecterSiBesoin(famille, "tablette", "Paul");
  await ouvrirQuiJoue(page);
});

// --- Quand : le parent

When(
  new RegExp(`^Paul crée le profil enfant "(.*)" de niveau ${NIVEAUX} dans l'univers ${UNIVERS_LIBELLE}$`),
  async ({ famille }, prenom: string, niveau: string, libelleUnivers: string) => {
    await creerParLInterface(await pageCourante(famille), prenom, niveau, libelleUnivers);
  },
);

When(/^Paul crée le profil enfant "(.*)" sans choisir de niveau ni d'univers$/, async ({ famille }, prenom: string) => {
  await creerParLInterface(await pageCourante(famille), prenom);
});

When(/^Paul commence la création d'un profil enfant$/, async ({ famille }) => {
  await expect(formulaireDeCreation(await pageCourante(famille))).toBeVisible();
});

When(
  new RegExp(`^Paul change le niveau du profil enfant de (\\S+) en ${NIVEAUX}$`),
  async ({ famille }, prenom: string, niveau: string) => {
    await modifierParLInterface(await pageCourante(famille), prenom, { niveau });
  },
);

When(/^Paul change le prénom du profil enfant de (\S+) en "(.*)"$/, async ({ famille }, prenom: string, nouveau: string) => {
  await modifierParLInterface(await pageCourante(famille), prenom, { nouveauPrenom: nouveau });
});

When(/^Paul ouvre « Qui joue \? » sur le téléphone$/, async ({ famille }) => {
  etat(famille).appareil = "telephone";
  const page = await famille.page("telephone");
  await page.goto("/");
  await ouvrirQuiJoue(page);
});

When(
  new RegExp(`^Claire tente de changer le niveau du profil enfant de (\\S+) en ${NIVEAUX}$`),
  async ({ famille }, prenom: string, niveau: string) => {
    const page = await famille.page("tablette");
    const jeton = (await famille.session(page))?.access_token;
    expect(jeton, "Claire doit être connectée sur la tablette").toBeTruthy();
    etat(famille).reponse = await appelerUneFonctionDeFamille("modifier-profil-enfant", jeton, {
      profil: profilDe(famille, prenom).id,
      niveau,
    });
  },
);

When(
  new RegExp(`^quelqu'un tente de créer le profil enfant "(.*)" de niveau ${NIVEAUX} dans l'univers ${UNIVERS_LIBELLE}$`),
  async ({ famille }, prenom: string, niveau: string, libelleUnivers: string) => {
    etat(famille).reponse = await appelerUneFonctionDeFamille("creer-profil-enfant", undefined, {
      prenom,
      niveau,
      univers: cleDe(libelleUnivers),
    });
    await (await famille.page("tablette")).goto("/");
  },
);

// --- Quand : l'enfant

When(/^Léa choisit son profil enfant dans « Qui joue \? »$/, async ({ famille, $tags }) => {
  const page = await connecterSiBesoin(famille, "tablette", "Paul");
  const univers = universChoisiParLeParent.get(famille);
  if ($tags.includes("@issue-102") && univers !== undefined) {
    const liste = await ouvrirQuiJoue(page);
    await expect(liste.getByTestId("profil-a-choisir").filter({ hasText: "Léa" }).first()).toContainText(univers);
  }
  await choisirSonProfil(page, "Léa");
});

When(/^Léa demande à ajouter un enfant$/, async ({ famille }) => {
  await (await famille.page("tablette")).getByRole("button", { name: "+ Ajouter un enfant" }).click();
});

// --- Alors : « Qui joue ? »

Then(
  /^le profil enfant de (.+) apparaît (?:toujours )?dans « Qui joue \? » avec « (.+) »$/,
  async ({ famille }, prenom: string, detail: string) => {
    const page = await pageCourante(famille);
    await ouvrirQuiJoue(page);
    await expect(profilAvecDetail(page, prenom, detail).first()).toBeVisible();
  },
);

Then(/^aucun profil enfant « (.+) » n'apparaît dans « Qui joue \? »$/, async ({ famille }, prenom: string) => {
  const page = await pageCourante(famille);
  await ouvrirQuiJoue(page);
  await expect(page.getByRole("button", { name: new RegExp(`(^| )${echapper(prenom)} (CP|CE1|CE2|CM1|CM2) · `) })).toHaveCount(0);
});

Then(/^aucun nouveau profil enfant n'apparaît dans « Qui joue \? »$/, async ({ famille }) => {
  const page = await pageCourante(famille);
  await ouvrirQuiJoue(page);
  await expect(profilsAChoisir(page)).toHaveCount(etat(famille).profils.length);
});

Then(
  new RegExp(
    `^« Qui joue \\? » montre deux profils enfants « (.+) », l'un en ${UNIVERS_LIBELLE}, l'autre en ${UNIVERS_LIBELLE}$`,
  ),
  async ({ famille }, prenom: string, premier: string, second: string) => {
    const page = await pageCourante(famille);
    await ouvrirQuiJoue(page);
    await expect(profilsAChoisir(page)).toHaveCount(2);
    await expect(profilsAChoisir(page).nth(0)).toHaveAccessibleName(new RegExp(`${echapper(prenom)} ${echapper(premier)}$`));
    await expect(profilsAChoisir(page).nth(1)).toHaveAccessibleName(new RegExp(`${echapper(prenom)} ${echapper(second)}$`));
  },
);

Then(
  new RegExp(`^« Qui joue \\? » montre (\\d+) profils enfants, dont celui d'(.+) avec ${UNIVERS_LIBELLE}$`),
  async ({ famille }, nombre: string, prenom: string, detail: string) => {
    const page = await pageCourante(famille);
    await ouvrirQuiJoue(page);
    await expect(profilsAChoisir(page)).toHaveCount(Number(nombre));
    await expect(profilAvecDetail(page, prenom, detail).first()).toBeVisible();
  },
);

Then(
  new RegExp(
    `^« Qui joue \\? » montre, dans l'ordre, (.+) avec « (.+) » et ${UNIVERS_LIBELLE}, puis (.+) avec « (.+) » et ${UNIVERS_LIBELLE}$`,
  ),
  async ({ page }, guide1: string, prenom1: string, detail1: string, guide2: string, prenom2: string, detail2: string) => {
    await expect(profilsAChoisir(page)).toHaveCount(2);
    await expect(profilsAChoisir(page).nth(0)).toHaveAccessibleName(`${guide1} ${prenom1} ${detail1}`);
    await expect(profilsAChoisir(page).nth(1)).toHaveAccessibleName(`${guide2} ${prenom2} ${detail2}`);
  },
);

Then(/^propose ensuite d'ajouter un enfant$/, async ({ page }) => {
  const ajouter = page.getByRole("button", { name: "+ Ajouter un enfant" });
  await expect(ajouter).toBeVisible();
  const dernier = await profilsAChoisir(page).last().boundingBox();
  const bouton = await ajouter.boundingBox();
  expect(bouton?.y ?? 0).toBeGreaterThan((dernier?.y ?? 0) + (dernier?.height ?? 0) - 1);
});

Then(/^je vois « Qui joue \? » avec le profil enfant de Léa$/, async ({ page }) => {
  await expect(quiJoue(page)).toBeVisible();
  await expect(profilsAChoisir(page).filter({ hasText: "Léa" })).toHaveCount(1);
});

Then(/^il voit « Qui joue \? »$/, async ({ famille }) => {
  await expect(quiJoue(await famille.page("tablette"))).toBeVisible();
});

Then(/^« Qui joue \? » montre seulement le profil enfant de (.+)$/, async ({ page }, prenom: string) => {
  await expect(profilsAChoisir(page)).toHaveCount(1);
  await expect(profilsAChoisir(page).filter({ hasText: prenom })).toHaveCount(1);
});

Then(/^jamais celui de (.+)$/, async ({ page }, prenom: string) => {
  await expect(profilsAChoisir(page).filter({ hasText: prenom })).toHaveCount(0);
});

Then(/^chaque profil enfant de « Qui joue \? » mesure au moins 44 px de haut et de large$/, async ({ page }) => {
  await expect(profilsAChoisir(page)).toHaveCount(3);
  for (const profil of await profilsAChoisir(page).all()) {
    const boite = await profil.boundingBox();
    expect(boite?.height).toBeGreaterThanOrEqual(44);
    expect(boite?.width).toBeGreaterThanOrEqual(44);
  }
});

// --- Alors : l'enfant joue

Then(/^(Lumi|Coach Léo|Agent Max|Capitaine Sam|Lili) dit « (Bonjour [^«»]+) »$/, async ({ page }, _nom: string, texte: string) => {
  const parole = page.getByTestId("parole");
  await expect(parole).toHaveAttribute("data-nature", "accueil");
  await expect(parole).toHaveText(texte);
});

Then(/^la modification du profil enfant n'est pas proposée à Léa$/, async ({ page }) => {
  await expect(page.getByRole("button", { name: "Changer d'enfant" })).toBeVisible();
  await expect(page.getByRole("button", { name: /Modifier/ })).toHaveCount(0);
  await expect(page.getByRole("form")).toHaveCount(0);
});

Then(/^Léa ne peut pas créer de profil enfant sans y répondre juste$/, async ({ page }) => {
  const [, a, b] = (await page.getByText(/Question pour un adulte : combien font \d × \d \?/).innerText()).match(/(\d) × (\d)/) ?? [];
  const fausse = String(Number(a) * Number(b) + 1);
  await page.getByRole("textbox").fill(fausse);
  await page.getByRole("button", { name: "Entrer" }).click();
  await expect(page.getByText(/Question pour un adulte/)).toBeVisible();
  await expect(formulaireDeCreation(page)).toHaveCount(0);
  await expect(page.getByRole("heading", { name: "Espace parent" })).toHaveCount(0);
});

// --- Alors : le formulaire et l'espace parent

Then(/^on lui demande le prénom, la classe et l'univers de l'enfant$/, async ({ famille }) => {
  const formulaire = formulaireDeCreation(await pageCourante(famille));
  await expect(formulaire.getByLabel("Prénom")).toBeVisible();
  await expect(formulaire.getByLabel("Classe")).toBeVisible();
  await expect(formulaire.getByLabel("Univers")).toBeVisible();
});

Then(/^jamais d'adresse e-mail, de mot de passe ni de date de naissance$/, async ({ famille }) => {
  const formulaire = formulaireDeCreation(await pageCourante(famille));
  const reglages = formulaire.getByTestId("reglages");
  const total = async (role: "textbox" | "combobox") => formulaire.getByRole(role).count();
  const dansReglages = async (role: "textbox" | "combobox") => reglages.getByRole(role).count();
  expect((await total("textbox")) - (await dansReglages("textbox"))).toBe(1);
  expect((await total("combobox")) - (await dansReglages("combobox"))).toBe(2);
  await expect(formulaire.getByLabel(/e-?mail|mot de passe|naissance/i)).toHaveCount(0);
  await expect(formulaire.locator("input[type=email], input[type=password], input[type=date]")).toHaveCount(0);
});

Then(/^Paul est informé que le prénom de l'enfant est obligatoire$/, async ({ famille }) => {
  const page = await pageCourante(famille);
  await expect(page.getByRole("alert").filter({ hasText: "Écris le prénom de l'enfant." })).toBeVisible();
});

Then(/^Paul voit le profil enfant de (.+) dans l'espace parent$/, async ({ famille }, prenom: string) => {
  const page = await pageDansLEspaceParent(famille);
  await expect(page.getByTestId("profil-enfant").filter({ hasText: prenom })).toHaveCount(1);
  await verifierQueLaBaseRefuseLesEcrituresIncorrectes(famille, page, prenom);
});

// Garde-fous de la base, vérifiés avec le jeton du parent (la RLS s'applique) : on tente d'écrire en REST ce que
// l'application ne permet pas. Si la base acceptait quand même, le profil créé serait supprimé avec son parent de test.
async function verifierQueLaBaseRefuseLesEcrituresIncorrectes(famille: Famille, page: Page, prenom: string) {
  const jeton = (await famille.session(page))?.access_token;
  expect(jeton, "Paul doit être connecté").toBeTruthy();
  const sansRattachement = await ecrireEnRestUnProfil(jeton, {
    methode: "POST",
    corps: { id: crypto.randomUUID(), prenom: "Orpheline", niveau: "CP", univers: "animaux" },
  });
  expect(sansRattachement.statut, "insert REST d'un profil sans rattachement").toBeGreaterThanOrEqual(400);
  const visibles = await lireEnRestLesProfilsVisibles(jeton ?? "");
  const profil = visibles.find((p) => p.prenom === prenom)?.id;
  expect(profil, `profil « ${prenom} » visible de Paul en REST`).toBeTruthy();
  const avecEspace = await ecrireEnRestUnProfil(jeton, { methode: "PATCH", profil, corps: { prenom: ` ${prenom}` } });
  expect(avecEspace.statut, "prénom avec espace au début, écrit en REST").toBeGreaterThanOrEqual(400);
  const avecEspaceALaFin = await ecrireEnRestUnProfil(jeton, { methode: "PATCH", profil, corps: { prenom: `${prenom} ` } });
  expect(avecEspaceALaFin.statut, "prénom avec espace à la fin, écrit en REST").toBeGreaterThanOrEqual(400);
}

Then(/^il voit les profils enfants de sa famille dans l'espace parent$/, async ({ famille }) => {
  const page = await famille.page("tablette");
  const profils = etat(famille).profils.filter((p) => p.parent === "Paul");
  expect(profils.length).toBeGreaterThan(0);
  await expect(page.getByTestId("profil-enfant")).toHaveCount(profils.length);
  for (const { prenom } of profils) await expect(page.getByTestId("profil-enfant").filter({ hasText: prenom })).toHaveCount(1);
});

Then(/^Claire ne voit pas le profil enfant de (.+)$/, async ({ famille }, prenom: string) => {
  const page = await famille.page("tablette");
  await expect(page.getByTestId("profils-de-l-espace-parent")).toBeVisible();
  await expect(page.getByText("Chargement des profils")).toHaveCount(0);
  await expect(page.getByTestId("profil-enfant").filter({ hasText: prenom })).toHaveCount(0);
});

// --- Alors : accès refusé

Then(/^Claire est informée que ce profil enfant est introuvable$/, async ({ famille }) => {
  const reponse = etat(famille).reponse;
  expect(reponse?.statut).toBe(404);
  expect(reponse?.message).toBe("Ce profil enfant est introuvable.");
});

Then(/^Paul voit toujours le profil enfant de (.+) avec « (.+) »$/, async ({ famille }, prenom: string, detail: string) => {
  etat(famille).appareil = "telephone";
  const page = await connecterSiBesoin(famille, "telephone", "Paul");
  await page.goto("/");
  await ouvrirQuiJoue(page);
  await expect(profilAvecDetail(page, prenom, detail).first()).toBeVisible();
});

Then(/^la création est refusée$/, async ({ famille }) => {
  const reponse = etat(famille).reponse;
  expect(reponse?.statut).toBe(401);
  expect(reponse?.profil).toBeUndefined();
  const direct = await ecrireEnRestUnProfil(undefined, {
    methode: "POST",
    corps: { id: crypto.randomUUID(), prenom: "Anonyme", niveau: "CP", univers: "animaux" },
  });
  expect(direct.statut, "insert REST sans connexion").toBeGreaterThanOrEqual(400);
});
