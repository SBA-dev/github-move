import { expect, type Locator, type Page } from "@playwright/test";
import type { Famille } from "../support/famille.ts";
import {
  appelerLaReinitialisation,
  creerUnParentAvecMotDePasse,
  leJetonDeRenouvellementMarche,
  leMotDePasseOuvreUneConnexion,
  reculerLesEssais,
} from "../support/mot-de-passe.ts";
import { Given, Then, When } from "./fixtures.ts";
import { assurerLeProfil, etat as etatDesProfils } from "./profils-enfants.steps.ts";

// Story #72 : connexion du parent par adresse e-mail et mot de passe du parent, sans e-mail.
// Le parent agit par l'interface. Les préparations (parent inscrit, essais de réinitialisation ratés) passent par
// l'API d'administration (parent) ou par la fonction publique avec la seule clé anon (essais) ; l'antidatage des
// essais est le seul réglage direct de la base (features/support/mot-de-passe.ts).

type Ecran = "Se connecter" | "Créer ton compte" | "Mot de passe oublié";

type Etat = {
  ecranOuvert: Ecran;
  reculPrevu: { adresse: string; minutes: number } | undefined;
  reglesAvantEnvoi: boolean[] | undefined;
  reponsesDeLaReinitialisation: string[];
};

const etats = new WeakMap<Famille, Etat>();

function etat(famille: Famille): Etat {
  const connu = etats.get(famille);
  if (connu) return connu;
  const neuf: Etat = { ecranOuvert: "Se connecter", reculPrevu: undefined, reglesAvantEnvoi: undefined, reponsesDeLaReinitialisation: [] };
  etats.set(famille, neuf);
  return neuf;
}

const PRENOM_FAUX = "Zorglub";
const MOT_DE_PASSE_VALIDE = "Noisette#";
const TITRES_DES_ECRANS = /^(Se connecter|Créer ton compte|Mot de passe oublié)$/;

// --- Navigation entre les trois écrans de connexion

async function tablette(famille: Famille): Promise<Page> {
  const page = await famille.page("tablette");
  if (page.url() === "about:blank") await page.goto("/");
  return page;
}

async function ouvrirEcran(famille: Famille, ecran: Ecran): Promise<Page> {
  const page = await tablette(famille);
  const titre = page.getByRole("heading", { level: 2 }).filter({ hasText: TITRES_DES_ECRANS });
  await expect(titre).toBeVisible();
  if ((await titre.textContent()) !== ecran) {
    if ((await titre.textContent()) === "Créer ton compte") await page.getByRole("button", { name: "J'ai déjà un compte" }).click();
    if ((await titre.textContent()) === "Mot de passe oublié") await page.getByRole("button", { name: "Retour à la connexion" }).click();
    await expect(titre).toHaveText("Se connecter");
    if (ecran !== "Se connecter") await page.getByRole("button", { name: ecran, exact: true }).click();
  }
  await expect(titre).toHaveText(ecran);
  etat(famille).ecranOuvert = ecran;
  return page;
}

const champMotDePasse = (page: Page, libelle = "Mot de passe") => page.getByLabel(libelle, { exact: true });

async function attendreLeRetour(page: Page): Promise<void> {
  await page.getByRole("alert").or(page.getByRole("heading", { name: "Espace parent" })).first().waitFor();
}

async function lesReglesRespectees(page: Page): Promise<boolean[]> {
  return page.locator("li[data-regle]").evaluateAll((elements) => elements.map((e) => e.getAttribute("data-respectee") === "true"));
}

// --- Parents préparés

async function inscrireParPreparation(famille: Famille, adresse: string, motDePasse: string): Promise<void> {
  const normalisee = famille.normalisee(adresse);
  expect(await famille.parent(normalisee), `le parent ${normalisee} ne doit pas déjà exister`).toBeUndefined();
  await creerUnParentAvecMotDePasse(normalisee, motDePasse);
}

Given(/^(\S+) est inscrite? avec "(.*)" et le mot de passe du parent "(.*)"$/, async ({ famille }, _prenom: string, adresse: string, motDePasse: string) => {
  await inscrireParPreparation(famille, adresse, motDePasse);
});

Given(
  /^(\S+) a réinitialisé le mot de passe du parent de "(.*)" de "(.*)" en "(.*)"$/,
  async ({ famille }, prenom: string, adresse: string, ancien: string, nouveau: string) => {
    await inscrireParPreparation(famille, adresse, ancien);
    await assurerLeProfil(famille, prenom, { prenom: "Léa", niveau: "CE1" });
    expect(await appelerLaReinitialisation(famille.normalisee(adresse), "Léa", nouveau)).toBe(200);
  },
);

Given(/^(\S+) n'a aucun profil enfant$/, async ({ famille }, prenom: string) => {
  expect(etatDesProfils(famille).profils.filter((p) => p.parent === prenom)).toHaveLength(0);
});

// --- Essais de réinitialisation ratés (la fonction publique compte les vrais essais ; seul l'âge est réglé)

async function rater(famille: Famille, adresse: string, nombre: number): Promise<void> {
  for (let i = 0; i < nombre; i++) {
    expect(await appelerLaReinitialisation(famille.normalisee(adresse), PRENOM_FAUX, MOT_DE_PASSE_VALIDE), `essai raté n°${i + 1}`).toBe(i + 1 === 5 ? 429 : 401);
  }
}

Given(
  /^(\S+) a raté (\d+) essais? de réinitialisation pour "(.*)"(?:, (le dernier|tous) il y a (\d+) (minutes|heures))?$/,
  async ({ famille }, _prenom: string, nombre: string, adresse: string, portee?: string, age?: string, unite?: string) => {
    await rater(famille, adresse, Number(nombre));
    if (portee === undefined || age === undefined) return;
    const minutes = unite === "heures" ? Number(age) * 60 : Number(age);
    const normalisee = famille.normalisee(adresse);
    if (portee === "tous") await reculerLesEssais(normalisee, minutes);
    else etat(famille).reculPrevu = { adresse: normalisee, minutes };
  },
);

Given(
  /^(\S+) a raté (\d+) essais de réinitialisation, puis réinitialisé son mot de passe du parent, puis raté encore (\d+) essais de réinitialisation pour "(.*)"$/,
  async ({ famille }, _prenom: string, avant: string, apres: string, adresse: string) => {
    await rater(famille, adresse, Number(avant));
    expect(await appelerLaReinitialisation(famille.normalisee(adresse), "Léa", MOT_DE_PASSE_VALIDE)).toBe(200);
    await rater(famille, adresse, Number(apres));
  },
);

// Le dernier raté date de 61 minutes, l'essai pendant le blocage de 30 minutes : on recule de 31 minutes (le blocage dure
// encore), le vrai serveur refuse l'essai, puis on recule de 30 minutes de plus. Un blocage prolongé par cet essai se verrait.
Given(
  /^(\S+) a refait un essai de réinitialisation pour "(.*)" pendant le blocage, il y a (\d+) minutes$/,
  async ({ famille }, _prenom: string, adresse: string, minutesDEssai: string) => {
    const prevu = etat(famille).reculPrevu;
    if (!prevu) throw new Error("Aucun dernier raté antidaté : l'étape « a raté … le dernier il y a … » doit précéder.");
    const normalisee = famille.normalisee(adresse);
    await reculerLesEssais(normalisee, prevu.minutes - Number(minutesDEssai));
    expect(await appelerLaReinitialisation(normalisee, "Léa", MOT_DE_PASSE_VALIDE), "essai pendant le blocage").toBe(429);
    await reculerLesEssais(normalisee, Number(minutesDEssai));
    etat(famille).reculPrevu = undefined;
  },
);

Given(/^la réinitialisation pour "(.*)" a ensuite été refusée à (\S+) pour un prénom vide$/, async ({ famille }, adresse: string, _prenom: string) => {
  expect(await appelerLaReinitialisation(famille.normalisee(adresse), "", MOT_DE_PASSE_VALIDE)).toBe(422);
});

async function appliquerLeReculPrevu(famille: Famille): Promise<void> {
  const prevu = etat(famille).reculPrevu;
  if (!prevu) return;
  etat(famille).reculPrevu = undefined;
  await reculerLesEssais(prevu.adresse, prevu.minutes);
}

// --- Inscription

async function sInscrire(famille: Famille, adresse: string, motDePasse: string, confirmation: string): Promise<void> {
  const page = await ouvrirEcran(famille, "Créer ton compte");
  await page.getByLabel("Adresse e-mail").fill(famille.adresse(adresse));
  await champMotDePasse(page).fill(motDePasse);
  await champMotDePasse(page, "Confirmation du mot de passe").fill(confirmation);
  etat(famille).reglesAvantEnvoi = await lesReglesRespectees(page);
  famille.adresseCourante = famille.normalisee(adresse);
  await page.getByRole("button", { name: "Créer ton compte", exact: true }).click();
  await attendreLeRetour(page);
}

When(
  /^(\S+) s'inscrit avec "(.*)", le mot de passe du parent "(.*)" et la confirmation "(.*)"$/,
  async ({ famille }, _prenom: string, adresse: string, motDePasse: string, confirmation: string) => {
    await sInscrire(famille, adresse, motDePasse, confirmation);
  },
);

When(
  /^(\S+) s'inscrit avec "(.*)" et un mot de passe du parent de (\d+) caractères qui respecte les 4 règles$/,
  async ({ famille }, _prenom: string, adresse: string, longueur: string) => {
    const motDePasse = `Aa%${"b".repeat(Number(longueur) - 3)}`;
    expect([...motDePasse]).toHaveLength(Number(longueur));
    await sInscrire(famille, adresse, motDePasse, motDePasse);
  },
);

const commencerLInscription = async ({ famille }: { famille: Famille }) => {
  await ouvrirEcran(famille, "Créer ton compte");
};
When(/^Paul commence son inscription$/, commencerLInscription);
Given(/^Paul a commencé son inscription$/, commencerLInscription);

const commencerLaReinitialisation = async ({ famille }: { famille: Famille }) => {
  await ouvrirEcran(famille, "Mot de passe oublié");
};
Given(/^Paul a commencé la réinitialisation de son mot de passe du parent$/, commencerLaReinitialisation);

Then(/^\S+ est informée? que les deux mots de passe ne sont pas pareils$/, async ({ famille }) => {
  const page = await tablette(famille);
  await expect(page.getByRole("alert").filter({ hasText: "Les deux mots de passe ne sont pas pareils." })).toBeVisible();
});

Then(/^il peut corriger la confirmation$/, async ({ famille }) => {
  const page = await tablette(famille);
  await expect(champMotDePasse(page, "Confirmation du mot de passe")).toBeEditable();
});

Then(/^il est informé que cette adresse e-mail est déjà utilisée$/, async ({ famille }) => {
  const page = await tablette(famille);
  await expect(page.getByRole("alert").filter({ hasText: "Cette adresse a déjà un compte." })).toBeVisible();
});

Then(/^on lui propose de se connecter$/, async ({ famille }) => {
  const page = await tablette(famille);
  await expect(page.getByRole("button", { name: "Se connecter", exact: true })).toBeVisible();
});

// --- Règles du mot de passe

function regle(page: Page, libelle: string): Locator {
  return page.locator("li[data-regle]").filter({ hasText: libelle });
}

async function verifierLaRegle(famille: Famille, libelle: string, etatAttendu: string): Promise<void> {
  const page = await tablette(famille);
  await expect(regle(page, libelle)).toHaveAttribute("data-respectee", etatAttendu === "au vert" ? "true" : "false");
}

Then(
  /^il voit les règles « 8 caractères », « une majuscule », « une minuscule » et « un caractère spécial », toutes à faire$/,
  async ({ famille }) => {
    const page = await tablette(famille);
    await expect(page.locator("li[data-regle]")).toHaveCount(4);
    for (const libelle of ["8 caractères", "une majuscule", "une minuscule", "un caractère spécial"]) {
      await verifierLaRegle(famille, libelle, "à faire");
    }
  },
);

Then(/^la règle « un caractère spécial » montre les caractères acceptés « (.+) »$/, async ({ famille }, caracteres: string) => {
  const page = await tablette(famille);
  await expect(regle(page, "un caractère spécial")).toContainText(caracteres);
});

When(/^(\S+) tape le (nouveau )?mot de passe du parent "(.*)"$/, async ({ famille }, _prenom: string, nouveau: string | undefined, saisie: string) => {
  const page = await tablette(famille);
  await champMotDePasse(page, nouveau ? "Nouveau mot de passe" : "Mot de passe").fill(saisie);
});

Then(/^la règle « (.+) » est (au vert|à faire)$/, async ({ famille }, libelle: string, etatAttendu: string) => {
  await verifierLaRegle(famille, libelle, etatAttendu);
});

Then(/^les règles « (.+) » et « (.+) » sont à faire$/, async ({ famille }, premiere: string, seconde: string) => {
  await verifierLaRegle(famille, premiere, "à faire");
  await verifierLaRegle(famille, seconde, "à faire");
});

Then(/^les 4 règles du mot de passe sont au vert$/, async ({ famille }) => {
  const page = await tablette(famille);
  const apres = await lesReglesRespectees(page);
  const regles = apres.length > 0 ? apres : (etat(famille).reglesAvantEnvoi ?? []);
  expect(regles).toEqual([true, true, true, true]);
});

Then(/^\S+ est informée? qu'il manque (.+)$/, async ({ famille }, manque: string) => {
  const libelles = [...manque.matchAll(/« ([^«»]+) »/g)].map((m) => m[1]);
  const page = await tablette(famille);
  await expect(page.getByRole("alert").filter({ hasText: "Il manque" })).toHaveText(`Il manque : ${libelles.join(", ")}.`);
});

Then(/^\S+ est informée? que le mot de passe du parent ne doit pas dépasser 64 caractères$/, async ({ famille }) => {
  const page = await tablette(famille);
  await expect(page.getByRole("alert").filter({ hasText: "64 caractères au plus." })).toBeVisible();
});

Then(/^\S+ est informée? que le mot de passe du parent est obligatoire$/, async ({ famille }) => {
  const page = await tablette(famille);
  await expect(page.getByRole("alert").filter({ hasText: "Écris ton mot de passe." })).toBeVisible();
});

Then(/^\S+ est informée? que le prénom est obligatoire$/, async ({ famille }) => {
  const page = await tablette(famille);
  await expect(page.getByRole("alert").filter({ hasText: "Écris le prénom de l'enfant." })).toBeVisible();
});

Then(/^\S+ est informée? « ([^«»]+) »$/, async ({ famille }, message: string) => {
  const page = await tablette(famille);
  await expect(page.getByRole("alert").filter({ hasText: message })).toBeVisible();
});

// --- Connexion

async function seConnecter(famille: Famille, adresse: string, motDePasse: string): Promise<void> {
  const page = await ouvrirEcran(famille, "Se connecter");
  await page.getByLabel("Adresse e-mail").fill(famille.adresse(adresse));
  await champMotDePasse(page).fill(motDePasse);
  famille.adresseCourante = famille.normalisee(adresse);
  await page.getByRole("button", { name: "Se connecter", exact: true }).click();
  await attendreLeRetour(page);
}

When(/^(\S+) se connecte avec "(.*)" et le mot de passe du parent "(.*)"$/, async ({ famille }, _prenom: string, adresse: string, motDePasse: string) => {
  await seConnecter(famille, adresse, motDePasse);
});

Given(/^Paul s'est trompé de mot de passe du parent sur la tablette$/, async ({ famille }) => {
  const page = await ouvrirEcran(famille, "Se connecter");
  await page.getByLabel("Adresse e-mail").fill(famille.adresse(famille.adresseDe("Paul")));
  await champMotDePasse(page).fill("Mauvais#1");
  await page.getByRole("button", { name: "Se connecter", exact: true }).click();
  await expect(page.getByRole("alert").filter({ hasText: "Adresse e-mail ou mot de passe incorrect" })).toBeVisible();
});

When(
  /^(\S+) se connecte au clavier seulement avec "(.*)" et le mot de passe du parent "(.*)"$/,
  async ({ famille }, _prenom: string, adresse: string, motDePasse: string) => {
    const page = await ouvrirEcran(famille, "Se connecter");
    const adresseSaisie = page.getByLabel("Adresse e-mail");
    for (let essai = 0; essai < 20 && !(await adresseSaisie.evaluate((el) => el === document.activeElement)); essai++) {
      await page.keyboard.press("Tab");
    }
    await expect(adresseSaisie).toBeFocused();
    await page.keyboard.type(famille.adresse(adresse));
    await page.keyboard.press("Tab");
    await expect(champMotDePasse(page)).toBeFocused();
    await page.keyboard.type(motDePasse);
    await page.keyboard.press("Tab");
    await page.keyboard.press("Tab");
    await expect(page.getByRole("button", { name: "Se connecter", exact: true })).toBeFocused();
    famille.adresseCourante = famille.normalisee(adresse);
    await page.keyboard.press("Enter");
    await attendreLeRetour(page);
  },
);

Then(/^il peut réessayer de se connecter$/, async ({ famille }) => {
  const page = await tablette(famille);
  await expect(page.getByLabel("Adresse e-mail")).toBeEditable();
  await expect(champMotDePasse(page)).toBeEditable();
  await expect(page.getByRole("button", { name: "Se connecter", exact: true })).toBeEnabled();
});

Then(/^« Mot de passe oublié » lui est proposé sous le message$/, async ({ famille }) => {
  const page = await tablette(famille);
  const message = page.getByRole("alert").filter({ hasText: "Adresse e-mail ou mot de passe incorrect" });
  const bouton = page.getByRole("button", { name: "Mot de passe oublié" });
  await expect(bouton).toHaveCount(1);
  await expect(bouton).toBeVisible();
  const [boiteDuMessage, boiteDuBouton] = [await message.boundingBox(), await bouton.boundingBox()];
  expect(boiteDuBouton?.y ?? 0, "le bouton est sous le message").toBeGreaterThanOrEqual((boiteDuMessage?.y ?? 0) + (boiteDuMessage?.height ?? 0));
});

// --- Écran de connexion sans lien ni code

Then(/^« Créer ton compte » et « Mot de passe oublié » me sont proposés$/, async ({ famille }) => {
  const page = await tablette(famille);
  await expect(page.getByRole("button", { name: "Créer ton compte", exact: true })).toBeVisible();
  await expect(page.getByRole("button", { name: "Mot de passe oublié", exact: true })).toBeVisible();
});

Then(/^« Recevoir un lien de connexion » n'est pas proposé$/, async ({ famille }) => {
  const page = await tablette(famille);
  await expect(page.getByRole("heading", { name: "Se connecter" })).toBeVisible();
  await expect(page.getByText("Recevoir un lien de connexion")).toHaveCount(0);
});

Then(/^la saisie d'un code de connexion n'est pas proposée$/, async ({ famille }) => {
  const page = await tablette(famille);
  await expect(page.getByLabel("Code de connexion")).toHaveCount(0);
  await expect(page.getByRole("button", { name: "Me connecter avec le code" })).toHaveCount(0);
});

// --- Réinitialisation

When(
  /^(\S+) réinitialise le mot de passe du parent de "(.*)" avec le prénom "(.*)", le nouveau mot de passe du parent "(.*)" et la confirmation "(.*)"$/,
  async ({ famille }, _prenom: string, adresse: string, prenom: string, motDePasse: string, confirmation: string) => {
    await appliquerLeReculPrevu(famille);
    const page = await ouvrirEcran(famille, "Mot de passe oublié");
    page.on("response", async (reponse) => {
      if (!reponse.url().includes("reinitialiser-le-mot-de-passe")) return;
      etat(famille).reponsesDeLaReinitialisation.push(await reponse.text().catch(() => ""));
    });
    await page.getByLabel("Adresse e-mail").fill(famille.adresse(adresse));
    await page.getByLabel("Prénom d'un de tes enfants").fill(prenom);
    await champMotDePasse(page, "Nouveau mot de passe").fill(motDePasse);
    await champMotDePasse(page, "Confirmation du nouveau mot de passe").fill(confirmation);
    famille.adresseCourante = famille.normalisee(adresse);
    await page.getByRole("button", { name: "Choisir ce mot de passe" }).click();
    await attendreLeRetour(page);
  },
);

Then(/^le prénom « (.+) » n'apparaît nulle part$/, async ({ famille }, prenom: string) => {
  const page = await tablette(famille);
  await expect(page.getByRole("alert")).toBeVisible();
  expect(await page.evaluate(() => document.body.innerText), "texte de la page").not.toContain(prenom);
  expect(etat(famille).reponsesDeLaReinitialisation.join(" "), "réponse du serveur").not.toContain(prenom);
});

Then(/^le mot de passe du parent "(.*)" de Paul marche toujours$/, async ({ famille }, motDePasse: string) => {
  expect(await leMotDePasseOuvreUneConnexion(famille.normalisee(famille.adresseDe("Paul")), motDePasse)).toBe(true);
});

Then(/^\S+ n'est plus connectée? sur le téléphone$/, async ({ famille }) => {
  const page = await famille.page("telephone");
  const jeton = await page.evaluate(() => {
    const cle = Object.keys(localStorage).find((k) => /^sb-.+-auth-token$/.test(k));
    const brut = cle ? localStorage.getItem(cle) : null;
    return brut ? (JSON.parse(brut) as { refresh_token: string }).refresh_token : null;
  });
  expect(jeton, "le téléphone avait une connexion ouverte").toBeTruthy();
  await expect.poll(() => leJetonDeRenouvellementMarche(jeton ?? ""), { message: "connexion du téléphone refusée par le serveur" }).toBe(false);
});

Then(/^(?:il|elle) voit le profil enfant de (.+) dans l'espace parent$/, async ({ famille }, prenom: string) => {
  const page = await tablette(famille);
  await expect(page.getByTestId("profil-enfant").filter({ hasText: prenom })).toHaveCount(1);
});

// --- Accessibilité

When(/^j'ouvre l'écran « (Se connecter|Créer ton compte|Mot de passe oublié) »$/, async ({ famille }, ecran: Ecran) => {
  await ouvrirEcran(famille, ecran);
});

Then(/^chaque champ et chaque bouton mesure au moins 44 px de haut$/, async ({ famille }) => {
  const page = await tablette(famille);
  const commandes = page.getByRole("region", { name: etat(famille).ecranOuvert, exact: true }).locator("input, button");
  const hauteurs = await commandes.evaluateAll((elements) =>
    elements.map((e) => ({ commande: e.getAttribute("id") ?? e.textContent ?? "", hauteur: e.getBoundingClientRect().height }))
  );
  expect(hauteurs.length).toBeGreaterThan(0);
  expect(hauteurs.filter(({ hauteur }) => hauteur < 44), "commandes de moins de 44 px de haut").toEqual([]);
});

When(/^Paul tape le mot de passe du parent "(.*)" pour se connecter$/, async ({ famille }, saisie: string) => {
  const page = await ouvrirEcran(famille, "Se connecter");
  await champMotDePasse(page).fill(saisie);
});

Given(/^Paul a tapé le mot de passe du parent "(.*)" pour se connecter$/, async ({ famille }, saisie: string) => {
  const page = await ouvrirEcran(famille, "Se connecter");
  await champMotDePasse(page).fill(saisie);
});

Then(/^le mot de passe du parent saisi est masqué$/, async ({ famille }) => {
  const page = await tablette(famille);
  await expect(champMotDePasse(page)).toHaveAttribute("type", "password");
});

Then(/^« Afficher le mot de passe » est proposé$/, async ({ famille }) => {
  const page = await tablette(famille);
  const bouton = page.getByRole("button", { name: "Afficher le mot de passe" });
  await expect(bouton).toBeVisible();
  await expect(bouton).toHaveAttribute("aria-pressed", "false");
});

When(/^Paul demande à afficher le mot de passe$/, async ({ famille }) => {
  const page = await tablette(famille);
  await page.getByRole("button", { name: "Afficher le mot de passe" }).click();
});

Then(/^il voit « (.+) » en clair$/, async ({ famille }, saisie: string) => {
  const page = await tablette(famille);
  await expect(champMotDePasse(page)).toHaveAttribute("type", "text");
  await expect(champMotDePasse(page)).toHaveValue(saisie);
});

Then(/^la règle « (.+) » est marquée d'une coche et d'un texte qui la dit respectée$/, async ({ famille }, libelle: string) => {
  const page = await tablette(famille);
  await expect(regle(page, libelle)).toContainText("✓");
  await expect(regle(page, libelle)).toContainText("au vert");
});

Then(/^le lecteur d'écran annonce que la règle « (.+) » est respectée$/, async ({ famille }, libelle: string) => {
  const page = await tablette(famille);
  const annonce = page.getByTestId("annonce-des-regles");
  await expect(annonce).toHaveAttribute("aria-live", "polite");
  await expect(annonce).toContainText(`${libelle} : au vert`);
});
