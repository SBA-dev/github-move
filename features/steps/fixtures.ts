import { test as base, createBdd } from "playwright-bdd";
import { Famille } from "../support/famille.ts";
import { installerLesEnregistreurs, RequetesVues } from "../support/enregistreurs-visuels.ts";
import { LecturesDesResultats } from "../support/lectures-des-resultats.ts";
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

// Tiré une fois par processus worker : deux exécutions lancées en même temps (deux équipes, deux sessions) contre le
// même projet Supabase n'ont jamais le même suffixe, alors que le projet et l'index du worker se répètent d'une
// exécution à l'autre.
const JETON_DU_WORKER = crypto.randomUUID().slice(0, 8);

export const test = base.extend<{
  monde: Monde;
  pwa: Pwa;
  famille: Famille;
  lecturesDesResultats: LecturesDesResultats;
  requetesVues: RequetesVues;
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

  // Story #5 : parents de test et boîte des e-mails de connexion (projet Supabase de développement).
  // Suffixe d'adresse propre au projet, au worker et à l'exécution : deux scénarios exécutés en même temps ne se
  // disputent pas le même parent de test (le nettoyage de l'un supprimait le parent de l'autre en pleine connexion).
  famille: async ({ page, browser, baseURL }, use, testInfo) => {
    const suffixe = `${testInfo.project.name}${testInfo.parallelIndex}-${JETON_DU_WORKER}`;
    const famille = new Famille(suffixe, page, browser, baseURL ?? "http://localhost:5173");
    await use(famille);
    await famille.nettoyer();
  },

  // Story #24 : suit dès le départ les lectures de l'écran de fin (leçon suivante).
  lecturesDesResultats: [async ({ page }, use) => {
    await use(await LecturesDesResultats.suivre(page));
  }, { auto: true }],

  pwa: async ({ baseURL }, use) => {
    const commander = async (commande: string): Promise<Response> => {
      const reponse = await fetch(`${baseURL}/__test/${commande}`, { method: "POST" });
      if (!reponse.ok) throw new Error(`Relais de test PWA « ${commande} » : ${reponse.status} ${await reponse.text()}`);
      return reponse;
    };
    await commander("reinitialiser");
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
  },

  monde: async ({}, use) => {
    await use({ profils: new Map(), tablettes: new Map() });
  },
});

export const { Given, When, Then, After, Before } = createBdd(test);
