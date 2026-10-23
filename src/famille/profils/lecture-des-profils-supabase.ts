import { clientSupabase } from "../../connexion/client-supabase.ts";
import { estUneLigneDeProfil, type LigneDeProfil } from "./ligne-de-profil.ts";

type LigneLue = {
  readonly id: unknown;
  readonly prenom: unknown;
  readonly niveau: unknown;
  readonly univers: unknown;
  readonly cree_le: unknown;
  readonly rattachements: unknown;
};

function parentsDe(rattachements: unknown): unknown[] {
  if (!Array.isArray(rattachements)) return [];
  return rattachements.map((rattachement: { parent?: unknown }) => rattachement.parent);
}

function enLigne(lue: LigneLue): LigneDeProfil {
  const ligne = { id: lue.id, prenom: lue.prenom, niveau: lue.niveau, univers: lue.univers, creeLe: lue.cree_le, parents: parentsDe(lue.rattachements) };
  if (!estUneLigneDeProfil(ligne)) throw new Error("Profil enfant illisible");
  return ligne;
}

/** Lecture directe sous RLS : le parent ne reçoit que les profils auxquels il est rattaché, dans l'ordre de création. */
export async function lireLesProfilsDuParent(): Promise<{ parent: string; lignes: LigneDeProfil[] }> {
  const client = clientSupabase();
  const { data: session } = await client.auth.getSession();
  const parent = session.session?.user.id;
  if (parent === undefined) throw new Error("Aucun parent connecté");
  const { data, error } = await client
    .from("profils_enfants")
    .select("id, prenom, niveau, univers, cree_le, rattachements(parent)")
    .order("cree_le", { ascending: true });
  if (error) throw error;
  return { parent, lignes: (data as LigneLue[]).map(enLigne) };
}

export function parentConnecte(): Promise<string | undefined> {
  return clientSupabase().auth.getSession().then(({ data }) => data.session?.user.id).catch(() => undefined);
}
