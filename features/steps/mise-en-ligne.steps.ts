import { createBdd } from "playwright-bdd";
import { expect, type Locator, type Page } from "@playwright/test";
import { Given, test, Then, When } from "./fixtures.ts";
import { attendreLaFinDeLaSeance, boutonContinuerApresLaReussite, continuerApresLaReussite } from "./etoiles-et-fin-de-seance.steps.ts";
import { commencerLaSeanceComplete, etat as etatDeLaLecon, jouerLaSeanceComplete, leconCourante, leconDeTitre } from "./etapes-puis-exercices.steps.ts";
import { bulleDeChoix, questionsDeLaLecon } from "./exercices-a-choix.steps.ts";
import { assurerLeProfil, choisirSonProfil, ouvrirQuiJoue } from "./profils-enfants.steps.ts";
import { estSurUnProfilReel, jouerAvecLeProfilReel, ouvrirLaLeconDansLApplication } from "./profil-reel.ts";
import { attendreServiceWorkerActif, chargerUneFois, emulerNavigateur, tabletteAndroid, verifierPageControleeParServiceWorker } from "./pwa.steps.ts";
import { DENISE, installerLeFaux, normaliser, terminerLaLecture } from "./voix.steps.ts";

// Story #45 : mise en ligne. Les scénarios @production visent l'adresse de production (playwright.production.config.ts) :
// aucune préparation, aucun nettoyage, jamais de clé service_role. Leurs étapes n'utilisent donc jamais la fixture `famille`
// (son nettoyage de fin de scénario appelle l'API d'administration) : les étapes partagées avec les scénarios courants
// ont ici une variante taguée @production qui ne parle qu'à la page.

const { Before } = createBdd(test);

// --- Les requêtes du navigateur, enregistrées dès l'ouverture de la page

type RequeteVue = { readonly url: string; readonly ressource: string };

const requetesVues = new WeakMap<Page, RequeteVue[]>();

Before({ tags: "@issue-45" }, async ({ context, page }) => {
  const vues: RequeteVue[] = [];
  requetesVues.set(page, vues);
  context.on("request", (requete) => vues.push({ url: requete.url(), ressource: requete.resourceType() }));
});

function variable(nom: string): string {
  const valeur = process.env[nom];
  if (!valeur) throw new Error(`Variable d'environnement absente : ${nom}`);
  return valeur;
}

function origineDUnSite(adresse: string): string | undefined {
  const url = new URL(adresse);
  return ["http:", "https:", "ws:", "wss:"].includes(url.protocol) ? url.origin : undefined;
}

// « Savanturier » désigne deux origines : le front, et le projet Supabase visé par le build. Les adresses data: et blob:
// ne sont pas des sites.
function originesDeSavanturier(baseURL: string, enProduction: boolean): string[] {
  const supabase = enProduction ? variable("SUPABASE_PRODUCTION_URL") : (process.env.VITE_SUPABASE_URL || variable("SUPABASE_URL"));
  return [new URL(baseURL).origin, new URL(supabase).origin];
}

function sitesContactes(page: Page, baseURL: string, enProduction: boolean, filtre: (requete: RequeteVue) => boolean = () => true) {
  const vues = requetesVues.get(page) ?? [];
  const permises = originesDeSavanturier(baseURL, enProduction);
  const origines = vues.filter(filtre).flatMap((requete) => origineDUnSite(requete.url) ?? []);
  return { permises, contactees: [...new Set(origines)], etrangeres: [...new Set(origines.filter((origine) => !permises.includes(origine)))] };
}

// --- Étant donné / Quand : l'adresse de production

Given(/^Paul est le parent de test de la production$/, async () => {
  variable("PARENT_DE_TEST_PRODUCTION_EMAIL");
  variable("PARENT_DE_TEST_PRODUCTION_MOT_DE_PASSE");
});

// Un navigateur neuf n'a aucune session : à l'adresse de production, rien n'est préparé ni lu par le test.
Given(/^personne n'est connecté sur la tablette$/, { tags: "@production" }, async ({ context }) => {
  expect((await context.storageState()).origins).toEqual([]);
});

When(/^j'ouvre Savanturier à l'adresse de production$/, async ({ page }) => {
  await page.goto("/");
});

When(/^j'ouvre Savanturier à l'adresse de production sans connexion sécurisée$/, async ({ page, baseURL }) => {
  const adresse = new URL(baseURL ?? "");
  adresse.protocol = "http:";
  await page.goto(adresse.href);
});

When(/^j'ouvre Savanturier à l'adresse de production « (\/[^«»]*) »$/, async ({ page }, chemin: string) => {
  await page.goto(chemin);
});

Given(/^Paul ouvre Savanturier à l'adresse de production dans le navigateur de sa tablette Android$/, async ({ page }) => {
  await emulerNavigateur(page, tabletteAndroid());
  await page.goto("/");
});

Given(/^Savanturier a déjà été chargé une fois sur la tablette à l'adresse de production$/, async ({ page }) => {
  await chargerUneFois(page);
});

Then(/^la connexion avec Savanturier est sécurisée$/, async ({ page }) => {
  expect(new URL(page.url()).protocol).toBe("https:");
  const reponse = await page.reload();
  expect(await reponse?.securityDetails(), "le certificat de la connexion est lu").not.toBeNull();
});

// La synthèse vocale de l'appareil de test (un navigateur sans voix) est simulée : la séance n'attend pas une lecture qui ne finirait jamais.
async function simulerLaVoixDeLAppareil(page: Page): Promise<void> {
  await page.addInitScript(installerLeFaux, { voix: [DENISE, { nom: "Henri", langue: "fr-FR" }], bloque: false, absent: false });
}

// Comme un enfant qui ne se trompe jamais : les bulles de « Quel son entends-tu ? », puis les étiquettes de « Les maisons des sons ».
async function jouerLaSeanceCompleteSansErreur(page: Page): Promise<void> {
  const lecon = leconCourante(page);
  const questions = questionsDeLaLecon(lecon);
  const maisonDe = new Map<string, string>();
  for (const exercice of lecon.exercices) {
    if (exercice.type !== "classer") continue;
    const groupes = exercice.groupes as Array<{ id: string; nom: string }>;
    for (const item of exercice.items as Array<{ texte: string; groupe: string }>) {
      maisonDe.set(item.texte, groupes.find((g) => g.id === item.groupe)?.nom ?? "");
    }
  }
  const fin = page.getByTestId("fin-de-seance");
  const continuer = page.getByRole("button", { name: "Continuer", exact: true });
  const etiquettes = page.getByTestId("etiquettes-a-placer").getByTestId("etiquette");
  await expect.poll(async () => {
    if (await fin.isVisible()) return true;
    if (await boutonContinuerApresLaReussite(page).isVisible()) await continuerApresLaReussite(page);
    else if (await continuer.isVisible()) await continuer.click();
    else if (await page.getByTestId("choix-de-la-question").isVisible()) {
      const enonce = normaliser((await page.getByTestId("question").textContent()) ?? "");
      const question = questions.find((q) => q.enonce === enonce);
      if (question) await bulleDeChoix(page, question.reponse).click({ timeout: 2_000 }).catch(() => undefined);
    } else if ((await etiquettes.count()) > 0) {
      for (let restantes = await etiquettes.count(); restantes > 0; restantes--) {
        const mot = normaliser((await etiquettes.first().textContent()) ?? "");
        const nomDeLaMaison = maisonDe.get(mot);
        if (nomDeLaMaison === undefined) throw new Error(`Étiquette inconnue : ${mot}`);
        await etiquettes.first().click();
        await page.getByRole("button", { name: `Poser dans la maison « ${nomDeLaMaison} »`, exact: true }).click();
        await expect(etiquettes).toHaveCount(restantes - 1);
      }
    }
    await terminerLaLecture(page);
    return false;
  }, { intervals: [100], timeout: 60_000 }).toBe(true);
  await attendreLaFinDeLaSeance(page);
}

async function seConnecterEnProduction(page: Page): Promise<void> {
  await page.goto("/");
  await page.getByLabel("Adresse e-mail").fill(variable("PARENT_DE_TEST_PRODUCTION_EMAIL"));
  await page.getByLabel("Mot de passe", { exact: true }).fill(variable("PARENT_DE_TEST_PRODUCTION_MOT_DE_PASSE"));
  await page.getByRole("button", { name: "Se connecter", exact: true }).click();
}

When(/^Paul se connecte à l'adresse de production avec son adresse e-mail et son mot de passe du parent$/, async ({ page }) => {
  await seConnecterEnProduction(page);
});

Then(/^(?:il|elle) voit l'espace parent$/, { tags: "@production" }, async ({ page }) => {
  await expect(page.getByRole("heading", { name: "Espace parent" })).toBeVisible();
});

Given(/^Pilote joue la séance complète de la leçon « (.+) » à l'adresse de production$/, async ({ page }, titre: string) => {
  await simulerLaVoixDeLAppareil(page);
  await seConnecterEnProduction(page);
  await expect(page.getByRole("heading", { name: "Espace parent" })).toBeVisible();
  await choisirSonProfil(page, "Pilote");
  const lecon = leconDeTitre(page, titre);
  etatDeLaLecon(page).courante = lecon;
  await ouvrirLaLeconDansLApplication(page, lecon.id);
  await expect(page.getByRole("heading", { level: 2, name: titre })).toBeVisible();
  await commencerLaSeanceComplete(page);
});

// La séance complète dure par nature plus de 30 s (animation de chaque bonne réponse, Edge Function) : délai triplé pour ces scénarios seuls.
// La séance terminée s'envoie à l'Edge Function : Léa joue avec son vrai profil (le profil préparé n'existe que sur l'appareil).
Given(/^Léa joue la séance complète de la leçon « (.+) »$/, { tags: "@issue-45" }, async ({ famille, monde, page, $test }, titre: string) => {
  $test.slow();
  if (!estSurUnProfilReel(page)) await jouerAvecLeProfilReel(famille, monde, page);
  await jouerLaSeanceComplete(page, titre);
});

When(/^Pilote réussit la dernière question de la séance$/, async ({ page, $test }) => {
  $test.slow();
  await jouerLaSeanceCompleteSansErreur(page);
});

When(/^Léa réussit la dernière question de la séance$/, { tags: "@issue-45" }, async ({ page }) => {
  await jouerLaSeanceCompleteSansErreur(page);
});

// --- Aucun autre site que Savanturier

Then(/^le navigateur n'a contacté aucun autre site que Savanturier$/, async ({ page, baseURL, $tags }) => {
  const { permises, contactees, etrangeres } = sitesContactes(page, baseURL ?? "", $tags.includes("@production"));
  expect(contactees, "le navigateur a bien parlé à Savanturier (l'enregistrement des requêtes fonctionne)").toContain(permises[0]);
  expect(etrangeres, `seuls ${permises.join(" et ")} sont permis`).toEqual([]);
});

Then(/^aucune police n'a été chargée depuis un autre site que Savanturier$/, async ({ page, baseURL, $tags }) => {
  await page.evaluate(() => document.fonts.ready);
  const { permises, etrangeres } = sitesContactes(page, baseURL ?? "", $tags.includes("@production"), (requete) =>
    requete.ressource === "font" || /\.(woff2?|ttf|otf)(\?|$)/i.test(requete.url) || /fonts\.(googleapis|gstatic)\.com/.test(requete.url)
  );
  expect(etrangeres, `une police ne vient que de ${permises.join(" ou ")}`).toEqual([]);
});

// --- Accès aux profils en production

Then(/^je suis invité à me connecter avec mon adresse e-mail$/, { tags: "@production" }, async ({ page }) => {
  await expect(page.getByRole("heading", { name: "Se connecter" })).toBeVisible();
  await expect(page.getByLabel("Adresse e-mail")).toBeEditable();
  await expect(page.getByLabel("Mot de passe", { exact: true })).toBeEditable();
});

Then(/^aucun profil enfant n'est visible$/, async ({ page }) => {
  await expect(page.getByRole("heading", { name: "Se connecter" })).toBeVisible();
  await expect(page.getByTestId("qui-joue")).toHaveCount(0);
  await expect(page.getByTestId("profil-a-choisir")).toHaveCount(0);
  await expect(page.getByTestId("enfant-en-cours")).toHaveCount(0);
});

Then(/^« Qui joue \? » montre seulement le profil enfant « ([^«»]+) »$/, async ({ page }, prenom: string) => {
  await expect(page.getByRole("heading", { name: "Espace parent" })).toBeVisible();
  const quiJoue = await ouvrirQuiJoue(page);
  const profils = quiJoue.getByTestId("profil-a-choisir");
  await expect(profils).toHaveCount(1);
  await expect(profils.first()).toContainText(prenom);
});

Then(/^aucun profil enfant d'une autre famille n'est visible$/, async ({ page }) => {
  // Le parent de test n'a qu'un profil : tout autre profil visible viendrait d'une autre famille.
  await expect(page.getByTestId("profil-a-choisir")).toHaveCount(1);
  await expect(page.getByTestId("profil-a-choisir").first()).toContainText("Pilote");
});

// --- La police Andika, vraiment chargée et utilisée

// Les faces Andika de la page : déclarées et à l'état « loaded », donc téléchargées (ou lues du cache) par le navigateur.
async function facesAndikaChargees(page: Page): Promise<number> {
  return page.evaluate(async () => {
    await document.fonts.ready;
    return [...document.fonts].filter((face) => face.family.replace(/["']/g, "") === "Andika" && face.status === "loaded").length;
  });
}

// La police réellement utilisée pour dessiner le texte de l'élément (protocole DevTools), pas seulement son nom dans le style.
async function policesDessinees(page: Page, element: Locator): Promise<Array<{ familyName: string; isCustomFont: boolean; glyphCount: number }>> {
  const marque = "data-sonde-police";
  await element.first().evaluate((el, nom) => el.setAttribute(nom, ""), marque);
  const session = await page.context().newCDPSession(page);
  try {
    await session.send("DOM.enable");
    await session.send("CSS.enable");
    const { root } = await session.send("DOM.getDocument", { depth: 0 });
    const { nodeId } = await session.send("DOM.querySelector", { nodeId: root.nodeId, selector: `[${marque}]` });
    const { fonts } = await session.send("CSS.getPlatformFontsForNode", { nodeId });
    return fonts;
  } finally {
    await element.first().evaluate((el, nom) => el.removeAttribute(nom), marque);
    await session.detach();
  }
}

async function verifierQueLeTexteEstEnAndika(page: Page, texte: Locator) {
  await expect(texte).toBeVisible();
  await expect(texte).not.toBeEmpty();
  await expect.poll(() => facesAndikaChargees(page), { message: "une face Andika est chargée" }).toBeGreaterThan(0);
  const famille = await texte.first().evaluate((el) => getComputedStyle(el).fontFamily);
  expect(famille.split(",")[0]?.replace(/["'\s]/g, ""), "Andika est la première police du style").toBe("Andika");
  const dessinees = await policesDessinees(page, texte);
  expect(dessinees.length, "le navigateur a dessiné le texte").toBeGreaterThan(0);
  const principale = [...dessinees].sort((a, b) => b.glyphCount - a.glyphCount)[0];
  expect(principale?.familyName, "la police dessinée est Andika, pas une police de remplacement").toContain("Andika");
  expect(principale?.isCustomFont, "Andika vient de Savanturier, pas des polices de l'appareil").toBe(true);
}

Then(/^le texte de l'étape de leçon est écrit dans la police Andika, et non dans une police de remplacement$/, async ({ page }) => {
  await verifierQueLeTexteEstEnAndika(page, page.getByTestId("parole"));
});

// --- @pwa : le mode dys sans réseau

// Le profil préparé de l'appareil n'existe pas dans le build de production (décision 0021) : Léa est un vrai profil de Paul,
// en mode dys, choisi dans « Qui joue ? » sur une tablette dont le service worker contrôle déjà la page.
Given(/^Léa a déjà joué en mode dys sur la tablette$/, async ({ famille, page }) => {
  await famille.connecterSansEmail("tablette", "Paul");
  await assurerLeProfil(famille, "Paul", { prenom: "Léa", niveau: "CP", libelleUnivers: "Animaux de la forêt", reglages: { modeDys: true } });
  await page.goto("/");
  await attendreServiceWorkerActif(page);
  await page.reload();
  await verifierPageControleeParServiceWorker(page);
  await choisirSonProfil(page, "Léa");
  const accueil = page.getByRole("region", { name: "Accueil de Léa" });
  await expect(accueil).toBeVisible();
  await expect.poll(() => facesAndikaChargees(page), { message: "Andika est chargée avant la coupure du réseau" }).toBeGreaterThan(0);
});

Then(/^le texte de l'accueil de l'enfant est écrit dans la police Andika, et non dans une police de remplacement$/, async ({ page }) => {
  // Après le rechargement, le profil en cours n'est pas gardé : Léa se choisit de nouveau dans « Qui joue ? », toujours sans réseau.
  const accueil = page.getByRole("region", { name: "Accueil de Léa" });
  if (!(await accueil.isVisible())) await choisirSonProfil(page, "Léa");
  await expect(accueil).toBeVisible();
  await verifierQueLeTexteEstEnAndika(page, accueil.getByTestId("parole"));
});
