import { AuthApiError, FunctionsHttpError } from "@supabase/supabase-js";
import {
  AdresseDejaUtilisee,
  type AdresseEmail,
  AdresseOuMotDePasseIncorrect,
  type CodeDeConnexion,
  CodeDeConnexionInvalide,
  InformationsDeReinitialisationIncorrectes,
  ParentId,
  type Prenom,
  type ServiceDeConnexion,
  ServiceDeConnexionIndisponible,
  TropDEssaisDeReinitialisation,
} from "@domain/famille";
import { clientSupabase } from "./client-supabase.ts";

const STATUT_SERVICE_INDISPONIBLE = 503;
const STATUT_REFUS_DES_IDENTIFIANTS = 400;
const CODE_IDENTIFIANTS_REFUSES = "invalid_credentials";

function estUneReponseDeLaFonction(erreur: unknown, statut: number): boolean {
  return erreur instanceof FunctionsHttpError && erreur.context.status === statut;
}

function estUnRefusDesIdentifiants(erreur: unknown): boolean {
  return erreur instanceof AuthApiError && erreur.status === STATUT_REFUS_DES_IDENTIFIANTS &&
    erreur.code === CODE_IDENTIFIANTS_REFUSES;
}

export class EnvoiDuLienImpossible extends Error {
  constructor() {
    super("Le lien de connexion n'a pas pu être envoyé.");
    this.name = "EnvoiDuLienImpossible";
  }
}

export class ServiceDeConnexionSupabase implements ServiceDeConnexion {
  async inscrire(adresse: AdresseEmail, motDePasse: string): Promise<void> {
    const { error } = await clientSupabase().functions.invoke("inscrire-le-parent", {
      body: { adresse: adresse.valeur, motDePasse },
    });
    if (estUneReponseDeLaFonction(error, 409)) throw new AdresseDejaUtilisee();
    if (estUneReponseDeLaFonction(error, STATUT_SERVICE_INDISPONIBLE)) throw new ServiceDeConnexionIndisponible();
    if (error) throw error;
  }

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

  async ouvrirLaConnexionAvecLeMotDePasse(adresse: AdresseEmail, motDePasse: string): Promise<ParentId> {
    const { data, error } = await clientSupabase().auth.signInWithPassword({
      email: adresse.valeur,
      password: motDePasse,
    });
    if (estUnRefusDesIdentifiants(error)) throw new AdresseOuMotDePasseIncorrect();
    if (error || !data.user) throw new ServiceDeConnexionIndisponible();
    return ParentId.de(data.user.id);
  }

  async deconnecter(): Promise<void> {
    const { error } = await clientSupabase().auth.signOut({ scope: "local" });
    if (error) throw error;
  }

  async reinitialiserLeMotDePasse(adresse: AdresseEmail, prenom: Prenom, motDePasse: string): Promise<void> {
    const { error } = await clientSupabase().functions.invoke("reinitialiser-le-mot-de-passe", {
      body: { adresse: adresse.valeur, prenom: prenom.valeur, motDePasse },
    });
    if (estUneReponseDeLaFonction(error, 401)) throw new InformationsDeReinitialisationIncorrectes();
    if (estUneReponseDeLaFonction(error, 429)) throw new TropDEssaisDeReinitialisation();
    if (estUneReponseDeLaFonction(error, STATUT_SERVICE_INDISPONIBLE)) throw new ServiceDeConnexionIndisponible();
    if (error) throw error;
  }

  async fermerLesAutresConnexions(): Promise<void> {
    const { error } = await clientSupabase().auth.signOut({ scope: "others" });
    if (error) throw error;
  }
}
