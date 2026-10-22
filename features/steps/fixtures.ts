import { test as base, createBdd } from "playwright-bdd";

// Les données de test (comptes, profils) viendront ici, préparées via l'API admin Supabase.
// La clé service_role ne sert qu'à ces préparations, jamais à simuler un utilisateur.
export const test = base;

export const { Given, When, Then } = createBdd(test);
