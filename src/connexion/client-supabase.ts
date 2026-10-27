import { createClient, FunctionRegion, type SupabaseClient } from "@supabase/supabase-js";

let client: SupabaseClient | undefined;

export function connexionConfiguree(): boolean {
  return Boolean(import.meta.env.VITE_SUPABASE_URL && import.meta.env.VITE_SUPABASE_ANON_KEY);
}

// Flux « implicit » : le lien de connexion s'ouvre sur n'importe quel appareil ou application de messagerie
// (le flux PKCE exige le même navigateur que la demande). Clé anon uniquement : jamais de service_role côté front.
export function clientSupabase(): SupabaseClient {
  client ??= createClient(import.meta.env.VITE_SUPABASE_URL, import.meta.env.VITE_SUPABASE_ANON_KEY, {
    auth: { flowType: "implicit", persistSession: true, autoRefreshToken: true, detectSessionInUrl: true },
  });
  return client;
}

/** Toute Edge Function s'exécute en Irlande (eu-west-1), comme la base : aucune donnée d'enfant ne transite hors de l'Union européenne. */
export function appelerUneFonction(nom: string, corps: object) {
  return clientSupabase().functions.invoke(nom, { body: corps, region: FunctionRegion.EuWest1 });
}
