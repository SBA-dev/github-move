import { execFileSync } from "node:child_process";
import { test as base, createBdd } from "playwright-bdd";
import { Famille } from "../support/famille.ts";
import { installerLesEnregistreurs, RequetesVues } from "../support/enregistreurs-visuels.ts";
import { LecturesDesResultats } from "../support/lectures-des-resultats.ts";
import { equipeDesTests, suffixeDesParentsDeTest } from "../support/parents-de-test.ts";
import type { ReglagesBruts } from "../support/reglages-prevus.ts";

// Les données de test (comptes, profils) viendront ici, préparées via l'API admin Supabase.
// La clé service_role ne sert qu'à ces préparations, jamais à simuler un utilisateur.

export type ProfilPrepare = { prenom: string; niveau: string; univers?: string; reglages?: ReglagesBruts };

export type Monde = {
  profils: Map<string, ProfilPrepare>;
  tablettes: Map<string, { paysage: string | null; couleur: string }>;
};

// Story #8 : pilotage du relais de test (features/support/serveur-pwa.mjs).
export type Pwa = {
  navigations: number;
  versionPubliee: string | null;
  publierVersion(): Promise<string>;
  publierLecon(): Promise<void>;
};

function brancheCourante(): string | undefined {
  try {
    return execFileSync("git", ["rev-parse", "--abbrev-ref", "HEAD"], { encoding: "utf8", stdio: ["ignore", "pipe", "ignore"] }).trim();
  } catch {
    return undefined;
  }
}

// Calculée une fois par processus worker (décision 0040) : les parents de test sont stables d'une exécution à l'autre.
const EQUIPE_DES_TESTS = equipeDesTests({ variable: process.env.E2E_EQUIPE, branche: brancheCourante() });

/** Les scénarios de la PWA (#8) tournent avec la configuration playwright.pwa.config.ts ; ceux des autres stories portent @pwa. */
function estPwa(etiquettes: readonly string[]): boolean {
  return etiquettes.includes("@pwa") || etiquettes.includes("@issue-8");
}

/** Story #182 : seuls ces scénarios lisent le vrai répertoire des voix (public/voix) ; les autres reçoivent un répertoire vide. */
function litLeVraiRepertoireDesVoix(etiquettes: readonly string[]): boolean {
  return ["@paroles-fixes-fabriquees", "@production"].some((etiquette) => etiquettes.includes(etiquette));
}

export const test = base.extend<{
  monde: Monde;
  pwa: Pwa;
  famille: Famille;
  lecturesDesResultats: LecturesDesResultats;
  requetesVues: RequetesVues;
  repertoireDesVoixVideParDefaut: undefined;
}>({
  // Story #96 : enregistreurs de mouvements (injectés avant toute navigation) et des requêtes de polices.
  requetesVues: [async ({ page, $tags, $testInfo }, use) => {
    if ($tags.includes("@issue-96")) {
      // Le vrai profil de Léa, ses réglages et les écrans joués jusqu'à leur fin passent par le serveur.
      $testInfo.setTimeout(120_000);
      await installerLesEnregistreurs(page);
    }
    await use(new RequetesVues(page));
  }, { auto: true }],

  // Story #182 : le répertoire des phrases enregistrées est vide par défaut. Les vraies paroles fixes (public/voix) seraient sinon lues
  // par le MP3 et non par la voix de l'appareil dont les autres scénarios observent le journal. Une page peut le remplacer
  // (preparerLeRepertoireDeTest, enregistrée après) ; seuls les scénarios @paroles-fixes-fabriquees et @production lisent le vrai.
  // Scénarios @pwa : le service worker cache l'interception de page, c'est donc le relais de test qui publie le répertoire vide.
  repertoireDesVoixVideParDefaut: [async ({ context, $tags }, use) => {
    const vraiRepertoire = litLeVraiRepertoireDesVoix($tags) || estPwa($tags);
    if (!vraiRepertoire) {
      await context.route("**/voix/repertoire.json", (route) => route.fulfill({ json: { voixEnregistree: "tom-1", phrases: {} } }));
    }
    await use(undefined);
  }, { auto: true }],

  // Story #5 : parents de test et boîte des e-mails de connexion (projet Supabase de développement).
  // Suffixe d'adresse stable, propre à l'équipe, au projet et au worker du projet (parallelIndex) : l'équipe isole les
  // équipes entre elles, le projet et le worker isolent les scénarios exécutés en même temps.
  famille: async ({ page, browser, baseURL }, use, testInfo) => {
    const suffixe = suffixeDesParentsDeTest({ equipe: EQUIPE_DES_TESTS, projet: testInfo.project.name, indexDuWorker: testInfo.parallelIndex });
    const famille = new Famille(suffixe, page, browser, baseURL ?? "http://localhost:5173");
    await famille.preparerLeDebut();
    await use(famille);
    await famille.nettoyer();
  },

  // Story #24 : suit dès le départ les lectures de l'écran de fin (leçon suivante).
  lecturesDesResultats: [async ({ page }, use) => {
    await use(await LecturesDesResultats.suivre(page));
  }, { auto: true }],

  // Auto pour les scénarios @pwa : le répertoire des voix est publié vide dès le départ (voir plus haut), sauf pour les scénarios qui lisent le vrai.
  pwa: [async ({ baseURL, $tags }, use) => {
    if (!estPwa($tags)) return await use(undefined as never);
    const commander = async (commande: string, corps?: string): Promise<Response> => {
      const reponse = await fetch(`${baseURL}/__test/${commande}`, { method: "POST", ...(corps === undefined ? {} : { body: corps }) });
      if (!reponse.ok) throw new Error(`Relais de test PWA « ${commande} » : ${reponse.status} ${await reponse.text()}`);
      return reponse;
    };
    await commander("reinitialiser");
    if (!litLeVraiRepertoireDesVoix($tags)) {
      await commander("publier-voix", "[]");
    }
    const pwa: Pwa = {
      navigations: 0,
      versionPubliee: null,
      publierVersion: async () => {
        const { version } = (await (await commander("publier-version")).json()) as { version: string };
        pwa.versionPubliee = version;
        return version;
      },
      publierLecon: async () => {
        await commander("publier-lecon");
      },
    };
    await use(pwa);
    await commander("reinitialiser");
  }, { auto: true }],

  monde: async ({}, use) => {
    await use({ profils: new Map(), tablettes: new Map() });
  },
});

export const { Given, When, Then, After, Before, BeforeStep } = createBdd(test);
