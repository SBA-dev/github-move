import { clientSupabase } from "../../connexion/client-supabase.ts";
import { reseauDisponible } from "../../reseau/reseau-disponible.ts";
import { estUnIdentifiantDeProfil } from "./corps-de-la-seance.ts";
import { attendreLesEnvoisEnCours } from "./sauvegarde-de-la-seance.ts";

type LigneAvecIdentifiant = { readonly id?: unknown };
type TableDeSeances = "seances_terminees" | "seances_de_revision_terminees";

/** Un identifiant qui n'est pas celui d'un profil réel (profil préparé, de démonstration) n'a aucune séance au serveur : lecture vide, pas en échec. */
async function lireLesIdentifiants(table: TableDeSeances, profil: string): Promise<readonly string[] | undefined> {
  if (!estUnIdentifiantDeProfil(profil)) return [];
  if (!reseauDisponible()) return undefined;
  try {
    await attendreLesEnvoisEnCours();
    const { data, error } = await clientSupabase().from(table).select("id").eq("profil", profil);
    if (error || data === null) return undefined;
    return (data as readonly LigneAvecIdentifiant[]).flatMap(({ id }) => (typeof id === "string" ? [id] : []));
  } catch {
    return undefined;
  }
}

/** Lecture sous RLS des identifiants des séances terminées du profil. `undefined` : lecture impossible. */
export function lireLesIdentifiantsDesSeancesTerminees(profil: string): Promise<readonly string[] | undefined> {
  return lireLesIdentifiants("seances_terminees", profil);
}

/** Lecture sous RLS des identifiants des séances de révision terminées du profil. `undefined` : lecture impossible. */
export function lireLesIdentifiantsDesSeancesDeRevisionTerminees(profil: string): Promise<readonly string[] | undefined> {
  return lireLesIdentifiants("seances_de_revision_terminees", profil);
}
