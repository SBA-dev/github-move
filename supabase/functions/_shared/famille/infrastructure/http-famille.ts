import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { NiveauInconnu } from "../../catalogue/domain/index.ts";
import { ParentNonRattache, PrenomObligatoire, ProfilEnfantIntrouvable, UniversInconnu } from "../domain/erreurs.ts";

const LONGUEUR_MAXIMALE_D_UN_TEXTE = 100;
const ORIGINES_PAR_DEFAUT = ["http://localhost:5173", "http://localhost:4173"];

export class EntreeInvalide extends Error {}
export class NonAuthentifie extends Error {}

export type SessionDuParent = { readonly client: SupabaseClient; readonly parent: string };

export function lireLeCorpsJson(texte: string): Record<string, unknown> {
  try {
    const corps: unknown = JSON.parse(texte);
    if (typeof corps === "object" && corps !== null && !Array.isArray(corps)) return corps as Record<string, unknown>;
  } catch {
    // Le message ci-dessous suffit : un corps illisible et un corps qui n'est pas un objet se traitent pareil.
  }
  throw new EntreeInvalide("La demande doit être un objet JSON.");
}

export function texteFacultatif(corps: Record<string, unknown>, cle: string): string | undefined {
  const valeur = corps[cle];
  if (valeur === undefined) return undefined;
  if (typeof valeur !== "string" || valeur.length > LONGUEUR_MAXIMALE_D_UN_TEXTE) {
    throw new EntreeInvalide(
      `Le champ « ${cle} » doit être un texte d'au plus ${LONGUEUR_MAXIMALE_D_UN_TEXTE} caractères.`,
    );
  }
  return valeur;
}

const FORMAT_UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export function uuidObligatoire(corps: Record<string, unknown>, cle: string): string {
  const valeur = texteObligatoire(corps, cle);
  if (!FORMAT_UUID.test(valeur)) throw new EntreeInvalide(`Le champ « ${cle} » doit être un identifiant valide.`);
  return valeur;
}

export function texteObligatoire(corps: Record<string, unknown>, cle: string): string {
  const valeur = texteFacultatif(corps, cle);
  if (valeur === undefined) throw new EntreeInvalide(`Le champ « ${cle} » est obligatoire.`);
  return valeur;
}

export function statutEtMessage(cause: unknown): { statut: number; message: string } {
  if (cause instanceof NonAuthentifie) return { statut: 401, message: "Connecte-toi pour continuer." };
  if (cause instanceof ParentNonRattache || cause instanceof ProfilEnfantIntrouvable) {
    return { statut: 404, message: new ProfilEnfantIntrouvable().message };
  }
  if (
    cause instanceof EntreeInvalide || cause instanceof PrenomObligatoire || cause instanceof NiveauInconnu ||
    cause instanceof UniversInconnu
  ) return { statut: 400, message: cause.message };
  return { statut: 500, message: "Le profil enfant n'a pas pu être enregistré." };
}

export function originesAutorisees(valeur: string | undefined): string[] {
  return valeur === undefined ? ORIGINES_PAR_DEFAUT : valeur.split(",").map((origine) => origine.trim());
}

export function entetes(origine: string | null, origines: readonly string[]): Headers {
  const resultat = new Headers({ "Content-Type": "application/json", "Vary": "Origin" });
  if (origine !== null && origines.includes(origine)) {
    resultat.set("Access-Control-Allow-Origin", origine);
    resultat.set("Access-Control-Allow-Headers", "authorization, x-client-info, apikey, content-type");
    resultat.set("Access-Control-Allow-Methods", "POST, OPTIONS");
  }
  return resultat;
}

function repondre(requete: Request, origines: readonly string[], statut: number, corps: unknown): Response {
  const headers = entetes(requete.headers.get("Origin"), origines);
  return new Response(statut === 204 ? null : JSON.stringify(corps), { status: statut, headers });
}

/** Ouvre la session du parent : le client porte son JWT, donc la RLS s'applique à toutes ses requêtes. */
export async function ouvrirLaSessionDuParent(requete: Request): Promise<SessionDuParent> {
  const autorisation = requete.headers.get("Authorization") ?? "";
  const jeton = autorisation.startsWith("Bearer ") ? autorisation.slice("Bearer ".length) : "";
  if (jeton === "") throw new NonAuthentifie();
  const client = createClient(Deno.env.get("SUPABASE_URL") ?? "", Deno.env.get("SUPABASE_ANON_KEY") ?? "", {
    global: { headers: { Authorization: autorisation } },
    auth: { persistSession: false },
  });
  const { data, error } = await client.auth.getUser(jeton);
  if (error || data.user === null) throw new NonAuthentifie();
  return { client, parent: data.user.id };
}

/** Gabarit commun aux fonctions d'écriture de Famille : méthode, session, corps, erreurs métier en codes HTTP. */
export async function traiterUneEcritureDeFamille(
  requete: Request,
  ecrire: (session: SessionDuParent, corps: Record<string, unknown>) => Promise<unknown>,
  origines: readonly string[],
): Promise<Response> {
  if (requete.method === "OPTIONS") return repondre(requete, origines, 204, null);
  if (requete.method !== "POST") {
    return repondre(requete, origines, 405, { error: { message: "Méthode non autorisée." } });
  }
  try {
    const session = await ouvrirLaSessionDuParent(requete);
    const corps = lireLeCorpsJson(await requete.text());
    return repondre(requete, origines, 200, await ecrire(session, corps));
  } catch (cause) {
    const { statut, message } = statutEtMessage(cause);
    if (statut === 500) {
      console.error("Écriture de Famille en échec :", cause instanceof Error ? cause.name : "erreur inconnue");
    }
    return repondre(requete, origines, statut, { error: { message } });
  }
}
