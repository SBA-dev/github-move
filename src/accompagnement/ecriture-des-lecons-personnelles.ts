import { FunctionsHttpError } from "@supabase/supabase-js";
import { clientSupabase } from "../connexion/client-supabase.ts";

/** Une écriture refusée ou impossible, avec le message à montrer au parent (jamais punitif). */
export class EcritureDeLeconRefusee extends Error {}

export const PAS_DE_RESEAU = "Pas de réseau : la leçon n'est pas enregistrée. Réessaie quand tu seras connecté.";
const INATTENDU = "La leçon n'a pas pu être enregistrée. Réessaie dans un instant.";

export type DemandeDEnregistrement = {
  readonly profil: string;
  readonly texte: string;
  readonly niveau: string;
  readonly matiere?: string;
};

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
  if (error instanceof FunctionsHttpError) throw new EcritureDeLeconRefusee(await messageDeLaReponse(error.context));
  if (error) throw new EcritureDeLeconRefusee(PAS_DE_RESEAU);
}

/** Toute écriture d'Accompagnement passe par une Edge Function, avec le JWT du parent (décision 0009). */
export const leconsPersonnellesEcritesParLesEdgeFunctions = {
  creer: (demande: DemandeDEnregistrement): Promise<void> => appeler("creer-une-lecon-personnelle", demande),
  supprimer: (lecon: string): Promise<void> => appeler("supprimer-une-lecon-personnelle", { lecon }),
};
