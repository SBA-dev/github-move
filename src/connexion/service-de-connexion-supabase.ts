import { AuthApiError } from "@supabase/supabase-js";
import { type AdresseEmail, type CodeDeConnexion, CodeDeConnexionInvalide, ParentId, type ServiceDeConnexion } from "@domain/famille";
import { clientSupabase } from "./client-supabase.ts";

export class EnvoiDuLienImpossible extends Error {
  constructor() {
    super("Le lien de connexion n'a pas pu être envoyé.");
    this.name = "EnvoiDuLienImpossible";
  }
}

export class ServiceDeConnexionSupabase implements ServiceDeConnexion {
  async envoyerLienEtCodeDeConnexion(adresse: AdresseEmail): Promise<void> {
    const { error } = await clientSupabase().auth.signInWithOtp({
      email: adresse.valeur,
      options: { shouldCreateUser: true, emailRedirectTo: location.origin },
    });
    if (error) throw new EnvoiDuLienImpossible();
  }

  async ouvrirLaConnexionAvecLeCode(adresse: AdresseEmail, code: CodeDeConnexion): Promise<ParentId> {
    const { data, error } = await clientSupabase().auth.verifyOtp({
      email: adresse.valeur,
      token: code.valeur,
      type: "email",
    });
    if (error instanceof AuthApiError && error.status < 500) throw new CodeDeConnexionInvalide();
    if (error || !data.user) throw error ?? new CodeDeConnexionInvalide();
    return ParentId.de(data.user.id);
  }

  async deconnecter(): Promise<void> {
    const { error } = await clientSupabase().auth.signOut({ scope: "local" });
    if (error) throw error;
  }
}
