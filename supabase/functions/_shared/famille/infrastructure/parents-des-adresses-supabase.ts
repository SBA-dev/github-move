import type { SupabaseClient } from "@supabase/supabase-js";
import type { ParentsDesAdresses } from "../application/ports/parents-des-adresses.ts";
import type { AdresseEmail } from "../domain/adresse-email.ts";
import { ParentId } from "../domain/parent-id.ts";

export class ParentsDesAdressesSupabase implements ParentsDesAdresses {
  constructor(private readonly client: SupabaseClient) {}

  // Fonction SQL `parent_de_l_adresse` : l'API d'administration ne sait pas chercher par adresse.
  async parentDeLAdresse(adresse: AdresseEmail): Promise<ParentId | undefined> {
    const { data, error } = await this.client.rpc("parent_de_l_adresse", { p_adresse: adresse.valeur });
    if (error) throw new Error("Recherche du parent impossible.");
    return typeof data === "string" ? ParentId.de(data) : undefined;
  }
}
