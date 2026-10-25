import { type Lecon, lireLecon } from "@domain/catalogue";
import { clientSupabase } from "../connexion/client-supabase.ts";
import { estUnIdentifiantDeProfil } from "../seance/fin-de-seance/corps-de-la-seance.ts";

const TABLE = "lecons_personnelles";
const COLONNES = "id, profil, texte_du_parent, lecon, cree_le";

export type LeconPersonnelleLue = {
  readonly lecon: Lecon;
  readonly profil: string;
  readonly texteDuParent: string;
  readonly creeeLe: string;
};

type Ligne = {
  readonly profil: string;
  readonly texte_du_parent: string;
  readonly lecon: unknown;
  readonly cree_le: string;
};

/** Une leçon illisible est ignorée : elle ne fait pas perdre les autres. */
function enLeconsLues(lignes: readonly Ligne[]): LeconPersonnelleLue[] {
  return lignes.flatMap((ligne) => {
    try {
      return [{ lecon: lireLecon(ligne.lecon), profil: ligne.profil, texteDuParent: ligne.texte_du_parent, creeeLe: ligne.cree_le }];
    } catch {
      return [];
    }
  });
}

/** Lecture sous RLS des leçons personnelles de tous les enfants du parent connecté, la plus récente d'abord. Lève si la lecture échoue. */
export async function lireLesLeconsPersonnellesDuParent(): Promise<LeconPersonnelleLue[]> {
  const { data, error } = await clientSupabase().from(TABLE).select(COLONNES).order("cree_le", { ascending: false });
  if (error) throw error;
  return enLeconsLues(data as Ligne[]);
}

/** Les leçons personnelles du profil, la plus récente d'abord. Vide pour un profil qui n'est pas réel ou si la lecture échoue (sans réseau). */
export async function lireLesLeconsPersonnellesDuProfil(profil: string): Promise<readonly Lecon[]> {
  if (!estUnIdentifiantDeProfil(profil)) return [];
  try {
    const { data, error } = await clientSupabase().from(TABLE).select(COLONNES).eq("profil", profil)
      .order("cree_le", { ascending: false });
    if (error) return [];
    return enLeconsLues(data as Ligne[]).map(({ lecon }) => lecon);
  } catch {
    return [];
  }
}

/** Une leçon personnelle du profil, ou `undefined` si elle n'existe pas pour lui ou si la lecture échoue. */
export async function lireUneLeconPersonnelleDuProfil(profil: string, identifiant: string): Promise<Lecon | undefined> {
  if (!estUnIdentifiantDeProfil(profil)) return undefined;
  try {
    const { data, error } = await clientSupabase().from(TABLE).select(COLONNES).eq("profil", profil).eq("id", identifiant)
      .maybeSingle();
    if (error || data === null) return undefined;
    return enLeconsLues([data as Ligne])[0]?.lecon;
  } catch {
    return undefined;
  }
}
