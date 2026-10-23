import { FunctionsHttpError } from "@supabase/supabase-js";
import { clientSupabase } from "../../connexion/client-supabase.ts";
import type { ReglagesComplets } from "../../reglages/index.ts";

/** Une écriture refusée ou impossible, avec le message à montrer au parent (jamais punitif). */
export class EcritureDeProfilRefusee extends Error {}

export type DonneesDeProfil = {
  readonly prenom: string;
  readonly niveau: string;
  readonly univers: string;
  readonly reglages: ReglagesComplets;
};

const SANS_RESEAU = "Le profil n'a pas pu être enregistré : vérifie la connexion, puis réessaie.";
const INATTENDU = "Le profil n'a pas pu être enregistré. Réessaie dans un instant.";

async function messageDeLaReponse(reponse: Response): Promise<string> {
  try {
    const corps: { error?: { message?: unknown } } = await reponse.json();
    const message = corps.error?.message;
    return typeof message === "string" ? message : INATTENDU;
  } catch {
    return INATTENDU;
  }
}

async function appeler(fonction: string, corps: object): Promise<void> {
  const { error } = await clientSupabase().functions.invoke(fonction, { body: corps });
  if (error instanceof FunctionsHttpError) throw new EcritureDeProfilRefusee(await messageDeLaReponse(error.context));
  if (error) throw new EcritureDeProfilRefusee(SANS_RESEAU);
}

/** Toute écriture de Famille passe par une Edge Function, avec le JWT du parent (décision 0009). */
export const profilsEcritsParLesEdgeFunctions = {
  creer: (donnees: DonneesDeProfil) => appeler("creer-profil-enfant", donnees),
  modifier: (profil: string, donnees: DonneesDeProfil) => appeler("modifier-profil-enfant", { profil, ...donnees }),
};
