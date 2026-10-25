import { createClient, type SupabaseClient } from "@supabase/supabase-js";

/**
 * Client `service_role` : réservé aux fonctions d'inscription et de réinitialisation, dont l'appelant n'est pas
 * connecté. Il n'est jamais créé ailleurs, ni transmis au front.
 */
export function clientDAdministration(): SupabaseClient {
  return createClient(Deno.env.get("SUPABASE_URL") ?? "", Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "", {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}
