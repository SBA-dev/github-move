import { test as base, createBdd } from "playwright-bdd";
import { Famille } from "../support/famille.ts";

// Les données de test (comptes, profils) viendront ici, préparées via l'API admin Supabase.
// La clé service_role ne sert qu'à ces préparations, jamais à simuler un utilisateur.

export type ProfilPrepare = { prenom: string; niveau: string; univers?: string };

type Monde = {
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

export const test = base.extend<{ monde: Monde; pwa: Pwa; famille: Famille }>({
  // Story #5 : parents de test et boîte des e-mails de connexion (projet Supabase de développement).
  // Suffixe d'adresse propre au projet ET au worker : deux fichiers .feature exécutés en parallèle ne se disputent
  // pas le même parent de test (le nettoyage de l'un supprimait le parent de l'autre en pleine connexion).
  famille: async ({ page, browser, baseURL }, use, testInfo) => {
    const famille = new Famille(`${testInfo.project.name}${testInfo.parallelIndex}`, page, browser, baseURL ?? "http://localhost:5173");
    await use(famille);
    await famille.nettoyer();
  },

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

export const { Given, When, Then, After } = createBdd(test);
