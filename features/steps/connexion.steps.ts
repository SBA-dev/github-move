import { expect } from "@playwright/test";
import type { Appareil, Famille } from "../support/famille.ts";
import { extraireLienEtCode } from "../support/supabase-test.ts";
import { Given, Then, When } from "./fixtures.ts";
import { preparerLaPageSiScenarioDeVoix } from "./voix.steps.ts";

// Story #5 : connexion du parent. Les e-mails de connexion sont lus dans la boîte de test de savanturier-dev
// (clé service_role, dans la fixture `famille` seulement). Le parent, lui, agit uniquement par l'interface.

const APPAREIL: Readonly<Record<string, Appareil>> = { "la tablette": "tablette", "le téléphone": "telephone" };

function appareilDe(libelle: string | undefined): Appareil {
  return libelle === undefined ? "tablette" : (APPAREIL[libelle] ?? "tablette");
}

// --- Étant donné : l'appareil et le parent

Given(/^(?:Paul n'est pas connecté|personne n'est connecté) sur la tablette$/, async ({ famille }) => {
  await famille.verifierNonConnecte("tablette");
});

Given(
  /^(\S+) a demandé un lien de connexion pour "(.*)" sur (la tablette|le téléphone)$/,
  async ({ famille }, _prenom: string, adresse: string, appareil: string) => {
    await famille.demanderUnLien(appareilDe(appareil), adresse);
  },
);

Given(
  /^(\S+) a demandé un nouveau lien de connexion pour "(.*)" sur la tablette$/,
  async ({ famille }, _prenom: string, adresse: string) => {
    await famille.demanderUnLien("tablette", adresse);
  },
);

Given(
  /^(\S+) a demandé un lien de connexion il y a (\d+) minutes(?: sur (la tablette))?$/,
  async ({ famille }, prenom: string, minutes: string, appareil?: string) => {
    await famille.demanderUnLien(appareilDe(appareil), famille.adresseDe(prenom));
    await famille.reculerLEnvoi(famille.adresseCourante ?? "", Number(minutes));
  },
);

Given(/^Paul s'est déjà connecté avec "(.*)"$/, async ({ famille }, adresse: string) => {
  await famille.preparerUnParent(adresse);
});

Given(/^aucun parent n'utilise l'adresse "(.*)"$/, async ({ famille }, adresse: string) => {
  await famille.verifierQuAucunParentNUtilise(adresse);
});

Given(/^l'adresse "(.*)" de Paul a été refusée$/, async ({ famille }, adresse: string) => {
  await famille.saisirEtEnvoyer("tablette", adresse);
  const page = await famille.page("tablette");
  await expect(page.getByRole("alert").filter({ hasText: "Cette adresse e-mail n'est pas valide" })).toBeVisible();
});

Given(/^Paul est connecté sur la tablette et sur le téléphone$/, async ({ famille }) => {
  await famille.connecterSansEmail("tablette", "Paul");
  await famille.connecterSansEmail("telephone", "Paul");
});

Given(/^Savanturier a été fermé sur la tablette$/, async ({ famille }) => {
  await (await famille.page("tablette")).goto("about:blank");
});

Given(/^Paul est (?:dans|entré dans) l'espace parent(?: sur la tablette)?$/, async ({ famille }) => {
  const tablette = await famille.page("tablette");
  await preparerLaPageSiScenarioDeVoix(tablette);
  if ((await famille.session(tablette)) === null) await famille.connecterSansEmail("tablette", "Paul");
  await famille.allerDansLEspaceParent("tablette");
});

Given(/^Paul s'est connecté avec le lien de connexion reçu, puis s'est déconnecté$/, async ({ famille }) => {
  await famille.connecter("tablette", "Paul");
  await famille.seDeconnecter("tablette");
  await famille.verifierNonConnecte("tablette");
});

Given(/^Paul s'est déconnecté de Savanturier sur la tablette$/, async ({ famille }) => {
  await famille.connecterSansEmail("tablette", "Paul");
  await famille.allerDansLEspaceParent("tablette");
  await famille.seDeconnecter("tablette");
  await famille.verifierNonConnecte("tablette");
});

Given(/^le lien de connexion de Paul a été refusé parce qu'il ne marche plus$/, async ({ famille }) => {
  await famille.demanderUnLien("tablette", famille.adresseDe("Paul"));
  await famille.reculerLEnvoi(famille.adresseCourante ?? "", 61);
  await famille.suivreLeLien("tablette", famille.adresseCourante ?? "");
  const page = await famille.page("tablette");
  await expect(page.getByRole("alert").filter({ hasText: "Ce lien de connexion ne marche plus" })).toBeVisible();
});

// --- Quand

When(/^(\S+) demande un lien de connexion pour "(.*)"$/, async ({ famille }, _prenom: string, adresse: string) => {
  await famille.saisirEtEnvoyer("tablette", adresse);
});

When(
  /^(\S+) suit le (?:nouveau )?lien de connexion reçu(?: sur (le téléphone))?$/,
  async ({ famille }, _prenom: string, appareil?: string) => {
    await famille.suivreLeLien(appareilDe(appareil), famille.adresseCourante ?? "");
  },
);

When(/^\S+ suit à nouveau ce lien de connexion$/, async ({ famille }) => {
  if (!famille.lienUtilise) throw new Error("Aucun lien de connexion n'a encore été utilisé.");
  await (await famille.page("tablette")).goto(famille.lienUtilise);
});

async function saisirLeCode(famille: Famille, code: string) {
  const page = await famille.page("tablette");
  await page.getByLabel("Code de connexion").fill(code);
  await page.getByRole("button", { name: "Me connecter avec le code" }).click();
}

When(/^\S+ saisit sur la tablette le code de connexion reçu$/, async ({ famille }) => {
  await saisirLeCode(famille, await famille.dernierCode(famille.adresseCourante ?? ""));
});

When(/^\S+ saisit sur la tablette un code de connexion qui n'est pas celui reçu$/, async ({ famille }) => {
  const recu = await famille.dernierCode(famille.adresseCourante ?? "");
  const autre = String((Number(recu) + 1) % 1_000_000).padStart(6, "0");
  await saisirLeCode(famille, autre);
});

When(/^(\S+) saisit sur la tablette le code de connexion "(.*)"$/, async ({ famille }, _prenom: string, code: string) => {
  await saisirLeCode(famille, code);
});

When(/^Paul se déconnecte(?: sur la tablette)?$/, async ({ famille }) => {
  await famille.seDeconnecter("tablette");
});

When(/^Claire ouvre l'espace parent$/, async ({ famille }) => {
  await famille.allerDansLEspaceParent("tablette");
});

// --- Alors : messages

async function alerte(famille: Famille, texte: string) {
  const page = await famille.page("tablette");
  await expect(page.getByRole("alert").filter({ hasText: texte })).toBeVisible();
}

Then(/^(\S+) est informée? qu'un lien de connexion a été envoyé à "(.*)"$/, async ({ famille }, _prenom: string, adresse: string) => {
  const page = await famille.page("tablette");
  await expect(page.getByRole("status").filter({ hasText: "Un lien de connexion a été envoyé à" })).toContainText(
    famille.normalisee(adresse),
    { ignoreCase: true },
  );
});

Then(/^"(.*)" reçoit un e-mail contenant un lien de connexion et un code de connexion de (\d+) chiffres$/, async ({ famille }, adresse: string, chiffres: string) => {
  const texte = (await famille.dernierEmail(famille.normalisee(adresse))).texte;
  const { lien, code } = extraireLienEtCode(texte);
  expect(lien, "lien de connexion dans l'e-mail").toBeTruthy();
  expect(code, "code de connexion dans l'e-mail").toMatch(new RegExp(`^\\d{${chiffres}}$`));
});

Then(/^\S+ est informée? que ce code de connexion ne marche plus$/, async ({ famille }) => {
  await alerte(famille, "Ce code de connexion ne marche plus");
});

Then(/^\S+ est informée? que ce lien de connexion ne marche plus$/, async ({ famille }) => {
  await alerte(famille, "Ce lien de connexion ne marche plus");
});

Then(/^(\S+) est informée? que le code de connexion doit avoir (\d+) chiffres$/, async ({ famille }, _prenom: string, chiffres: string) => {
  await alerte(famille, `Le code de connexion doit avoir ${chiffres} chiffres`);
});

Then(/^\S+ est informée? que l'adresse e-mail n'est pas valide$/, async ({ famille }) => {
  await alerte(famille, "Cette adresse e-mail n'est pas valide");
});

Then(/^aucun e-mail n'est envoyé$/, async ({ famille }) => {
  expect(famille.requetesDeLien, "demandes de lien envoyées à Supabase Auth").toHaveLength(0);
  expect(await famille.aucunEmailEnvoye(), "e-mails dans la boîte de test").toBe(0);
});

// --- Alors : état de la connexion

// Même texte en « Étant donné » (préparation) et en « Alors » (vérification) : playwright-bdd ne distingue pas les deux.
// Tant qu'aucun lien n'a été demandé dans le scénario, c'est une préparation : le parent se connecte, sans e-mail
// (session obtenue par l'API d'administration, voir features/support/connexion-sans-email.ts).
Then(/^(\S+) est connectée? sur (la tablette|le téléphone)$/, async ({ famille }, prenom: string, appareil: string) => {
  if (famille.adresseCourante === undefined) await famille.connecterSansEmail(appareilDe(appareil), prenom);
  else await famille.verifierConnecte(appareilDe(appareil));
});

Then(/^(\S+) est toujours connectée? sur (la tablette|le téléphone)$/, async ({ famille }, _prenom: string, appareil: string) => {
  await famille.verifierConnecte(appareilDe(appareil));
});

Then(/^\S+ n'est plus connectée? sur la tablette$/, async ({ famille }) => {
  const page = await famille.page("tablette");
  await expect.poll(async () => await famille.session(page)).toBeNull();
  await famille.verifierNonConnecte("tablette");
});

Then(/^(?:il|elle) n'est pas connectée?$/, async ({ famille }) => {
  await famille.verifierNonConnecte("tablette");
});

Then(/^(?:il|elle) voit l'espace parent(, sans aucun profil enfant)?$/, async ({ famille }, sansProfil?: string) => {
  const page = await famille.page("tablette");
  await expect(page.getByRole("heading", { name: "Espace parent" })).toBeVisible();
  if (sansProfil) await expect(page.getByTestId("enfant-en-cours")).toHaveCount(0);
});

Then(/^il est reconnu comme le parent "(.*)"$/, async ({ famille }, adresse: string) => {
  const attendu = famille.normalisee(adresse);
  const session = await famille.session(await famille.page("tablette"));
  expect(session?.user.email).toBe(attendu);
  expect((await famille.parent(attendu))?.id, "même parent que celui préparé").toBe(session?.user.id);
});

Then(/^il peut saisir à nouveau le code de connexion$/, async ({ famille }) => {
  const page = await famille.page("tablette");
  await expect(page.getByLabel("Code de connexion")).toBeEditable();
  await expect(page.getByRole("button", { name: "Me connecter avec le code" })).toBeEnabled();
});

Then(/^il peut demander un nouveau lien de connexion$/, async ({ famille }) => {
  const page = await famille.page("tablette");
  await expect(page.getByRole("button", { name: /^(Recevoir un lien de connexion|Demander un nouveau lien)$/ })).toBeEnabled();
});

// --- Alors : ce que voit quelqu'un qui ouvre Savanturier sans connexion

// Depuis #72, l'écran de connexion demande l'adresse e-mail et le mot de passe du parent (plus de lien de connexion).
async function verifierQueLEcranDeConnexionEstPropose(famille: Famille): Promise<void> {
  const page = await famille.page("tablette");
  await expect(page.getByRole("heading", { name: "Se connecter" })).toBeVisible();
  await expect(page.getByLabel("Adresse e-mail")).toBeEditable();
  await expect(page.getByLabel("Mot de passe", { exact: true })).toBeEditable();
  await expect(page.getByRole("button", { name: "Se connecter", exact: true })).toBeEnabled();
}

Then(/^je suis invité à me connecter avec mon adresse e-mail(?: et mon mot de passe du parent)?$/, async ({ famille }) => {
  await verifierQueLEcranDeConnexionEstPropose(famille);
});

Then(/^personne n'a d'adresse e-mail à ressaisir$/, async ({ famille }) => {
  const page = await famille.page("tablette");
  await expect(page.getByLabel("Adresse e-mail")).toHaveCount(0);
});

// Aucun profil enfant n'existe encore dans l'application (profils : story #11) : on vérifie que rien ne s'affiche
// de la famille une fois l'écran de connexion à l'écran. À renforcer avec #11.
async function verifierQuAucuneDonneeDeFamilleNEstVisible(famille: Famille) {
  const page = await famille.page("tablette");
  await expect(page.getByRole("heading", { name: "Se connecter" })).toBeVisible();
  await expect(page.getByTestId("enfant-en-cours")).toHaveCount(0);
  await expect(page.getByRole("heading", { name: "Espace parent" })).toBeHidden();
}

Then(/^je ne vois aucun profil enfant$/, async ({ famille }) => {
  await verifierQuAucuneDonneeDeFamilleNEstVisible(famille);
});

// Visiteur non connecté : écran de connexion. Parent resté connecté (Savanturier rouvert) : l'accueil, espace parent refermé.
Then(/^je ne vois pas l'espace parent$/, async ({ famille }) => {
  const page = await famille.page("tablette");
  if ((await famille.session(page)) === null) return await verifierQuAucuneDonneeDeFamilleNEstVisible(famille);
  await expect(page.getByText("Réviser le programme du CP au CM2")).toBeVisible();
  await expect(page.getByRole("heading", { name: "Espace parent" })).toBeHidden();
});

Then(/^aucun profil enfant de la famille de Paul n'est visible$/, async ({ famille }) => {
  await verifierQuAucuneDonneeDeFamilleNEstVisible(famille);
});
