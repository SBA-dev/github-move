import { AuthApiError, type SupabaseClient } from "@supabase/supabase-js";
import type { InscriptionsDesParents } from "../application/ports/inscriptions-des-parents.ts";
import type { AdresseEmail } from "../domain/adresse-email.ts";
import { AdresseDejaUtilisee, MotDePasseTropLong } from "../domain/erreurs.ts";
import { MotDePasseDuParent } from "../domain/mot-de-passe-du-parent.ts";
import { ParentId } from "../domain/parent-id.ts";

export class InscriptionsDesParentsSupabase implements InscriptionsDesParents {
  constructor(private readonly client: SupabaseClient) {}

  // L'adresse est créée déjà confirmée : Supabase Auth n'envoie aucun e-mail.
  async inscrire(adresse: AdresseEmail, motDePasse: string): Promise<ParentId> {
    const { data, error } = await this.client.auth.admin.createUser({
      email: adresse.valeur.toLowerCase(),
      password: motDePasse,
      email_confirm: true,
    });
    if (error instanceof AuthApiError && error.code === "email_exists") throw new AdresseDejaUtilisee();
    // Les règles du domaine sont déjà respectées : seule la limite de 72 octets de Supabase Auth peut encore refuser.
    if (error instanceof AuthApiError && error.code === "weak_password") {
      throw new MotDePasseTropLong(MotDePasseDuParent.LONGUEUR_MAXIMALE);
    }
    if (error || !data.user) throw new Error("Création du parent impossible.");
    return ParentId.de(data.user.id);
  }
}
