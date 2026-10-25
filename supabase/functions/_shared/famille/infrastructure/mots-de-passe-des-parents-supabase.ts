import { AuthApiError, type SupabaseClient } from "@supabase/supabase-js";
import type { MotsDePasseDesParents } from "../application/ports/mots-de-passe-des-parents.ts";
import { MotDePasseTropLong } from "../domain/erreurs.ts";
import { MotDePasseDuParent } from "../domain/mot-de-passe-du-parent.ts";
import type { ParentId } from "../domain/parent-id.ts";

export class MotsDePasseDesParentsSupabase implements MotsDePasseDesParents {
  constructor(private readonly client: SupabaseClient) {}

  async changer(parent: ParentId, motDePasse: string): Promise<void> {
    const { error } = await this.client.auth.admin.updateUserById(parent.valeur, { password: motDePasse });
    // Les règles du domaine sont déjà respectées : seule la limite de 72 octets de Supabase Auth peut encore refuser.
    if (error instanceof AuthApiError && error.code === "weak_password") {
      throw new MotDePasseTropLong(MotDePasseDuParent.LONGUEUR_MAXIMALE);
    }
    if (error) throw new Error("Changement du mot de passe du parent impossible.");
  }
}
