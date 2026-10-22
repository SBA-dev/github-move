import { test as base, createBdd } from "playwright-bdd";

// Les données de test (comptes, profils) viendront ici, préparées via l'API admin Supabase.
// La clé service_role ne sert qu'à ces préparations, jamais à simuler un utilisateur.

export type ProfilPrepare = { prenom: string; niveau: string; univers?: string };

type Monde = {
  profils: Map<string, ProfilPrepare>;
  tablettes: Map<string, { paysage: string | null; couleur: string }>;
};

export const test = base.extend<{ monde: Monde }>({
  monde: async ({}, use) => {
    await use({ profils: new Map(), tablettes: new Map() });
  },
});

export const { Given, When, Then } = createBdd(test);
