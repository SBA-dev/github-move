import type { SupabaseClient } from "@supabase/supabase-js";
import type { PrenomsDesEnfantsRattaches } from "../application/ports/prenoms-des-enfants-rattaches.ts";
import type { ParentId } from "../domain/parent-id.ts";
import { Prenom } from "../domain/prenom.ts";

type LigneDePrenom = { profils_enfants: { prenom: string } | null };

/** Lit les prénoms seuls (minimisation), filtrés par le parent : l'appelant n'a pas de JWT, donc pas de RLS. */
export class PrenomsDesEnfantsRattachesSupabase implements PrenomsDesEnfantsRattaches {
  constructor(private readonly client: SupabaseClient) {}

  async duParent(parent: ParentId): Promise<Prenom[]> {
    const { data, error } = await this.client.from("rattachements").select("profils_enfants(prenom)")
      .eq("parent", parent.valeur).returns<LigneDePrenom[]>();
    if (error) throw new Error("Lecture des prénoms des enfants rattachés impossible.");
    return data.flatMap((ligne) => ligne.profils_enfants ? [Prenom.de(ligne.profils_enfants.prenom)] : []);
  }
}
