import { clientSupabase } from "../connexion/client-supabase.ts";
import { reseauDisponible } from "../reseau/reseau-disponible.ts";
import { estUnIdentifiantDeProfil } from "../seance/fin-de-seance/corps-de-la-seance.ts";

/** Lecture sous RLS du résultat du test de départ. `undefined` : aucun test fait, ou lecture impossible (sans réseau). */
export async function lireLeResultatDuTestDeDepart(profil: string): Promise<ReadonlySet<string> | undefined> {
  if (!estUnIdentifiantDeProfil(profil) || !reseauDisponible()) return undefined;
  try {
    const { data, error } = await clientSupabase()
      .from("resultats_des_tests_de_depart")
      .select("lecons_reussies")
      .eq("profil", profil)
      .maybeSingle();
    if (error || data === null) return undefined;
    const lecons: unknown = (data as { lecons_reussies?: unknown }).lecons_reussies;
    return new Set(Array.isArray(lecons) ? lecons.filter((lecon): lecon is string => typeof lecon === "string") : []);
  } catch {
    return undefined;
  }
}
