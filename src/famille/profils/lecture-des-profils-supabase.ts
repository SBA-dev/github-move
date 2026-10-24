import { clientSupabase } from "../../connexion/client-supabase.ts";
import { estUneLigneDeProfil, type LigneDeProfil } from "./ligne-de-profil.ts";

type LigneLue = {
  readonly id: unknown;
  readonly prenom: unknown;
  readonly niveau: unknown;
  readonly univers: unknown;
  readonly cree_le: unknown;
  readonly rattachements: unknown;
  readonly mode_dys: unknown;
  readonly tout_lire_a_voix_haute: unknown;
  readonly parcours_libre: unknown;
  readonly clavier_des_dictees: unknown;
  readonly langue_du_parent: unknown;
};

function parentsDe(rattachements: unknown): unknown[] {
  if (!Array.isArray(rattachements)) return [];
  return rattachements.map((rattachement: { parent?: unknown }) => rattachement.parent);
}

function enLigne(lue: LigneLue): LigneDeProfil[] {
  const ligne = {
    id: lue.id,
    prenom: lue.prenom,
    niveau: lue.niveau,
    univers: lue.univers,
    creeLe: lue.cree_le,
    parents: parentsDe(lue.rattachements),
    reglages: {
      modeDys: lue.mode_dys,
      toutLireAVoixHaute: lue.tout_lire_a_voix_haute,
      parcoursLibre: lue.parcours_libre,
      clavierDesDictees: lue.clavier_des_dictees,
      langueDuParent: lue.langue_du_parent,
    },
  };
  return estUneLigneDeProfil(ligne) ? [ligne] : [];
}

/** Lecture directe sous RLS : le parent ne reçoit que les profils auxquels il est rattaché, dans l'ordre de création. */
export async function lireLesProfilsDuParent(): Promise<{ parent: string; lignes: LigneDeProfil[] }> {
  const client = clientSupabase();
  const { data: session } = await client.auth.getSession();
  const parent = session.session?.user.id;
  if (parent === undefined) throw new Error("Aucun parent connecté");
  const { data, error } = await client
    .from("profils_enfants")
    .select(
      "id, prenom, niveau, univers, cree_le, mode_dys, tout_lire_a_voix_haute, parcours_libre, clavier_des_dictees, langue_du_parent, rattachements(parent)",
    )
    .order("cree_le", { ascending: true });
  if (error) throw error;
  return { parent, lignes: (data as LigneLue[]).flatMap(enLigne) };
}

export function parentConnecte(): Promise<string | undefined> {
  return clientSupabase().auth.getSession().then(({ data }) => data.session?.user.id).catch(() => undefined);
}

/** Le niveau actuel du profil, tel que le serveur le connaît : un parent a pu le changer depuis un autre appareil. */
export async function lireLeNiveauDuProfil(profil: string): Promise<string | undefined> {
  const { data, error } = await clientSupabase().from("profils_enfants").select("niveau").eq("id", profil).maybeSingle();
  if (error) throw error;
  return typeof data?.niveau === "string" ? data.niveau : undefined;
}
