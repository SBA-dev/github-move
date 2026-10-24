import type { SupabaseClient } from "@supabase/supabase-js";
import type { CodeDeNiveau } from "../../catalogue/domain/index.ts";
import type { ProfilsDeSeance } from "../application/ports/profils-de-seance.ts";
import type { ReglageDuClavier } from "../domain/clavier-propose.ts";
import type { ProfilDeSeance } from "../domain/profil-de-seance.ts";

const NIVEAUX: readonly CodeDeNiveau[] = ["CP", "CE1", "CE2", "CM1", "CM2"];
const REGLAGES_DU_CLAVIER: readonly ReglageDuClavier[] = ["automatique", "lettresDuMot", "clavierComplet"];

type LigneDeProfil = Readonly<{ niveau: string; clavier_des_dictees: string }>;

function parmi<T extends string>(valeurs: readonly T[], valeur: string, colonne: string): T {
  const trouvee = valeurs.find((candidate) => candidate === valeur);
  if (trouvee === undefined) throw new Error(`Valeur inconnue en base pour « ${colonne} » : ${valeur}`);
  return trouvee;
}

export function profilDeSeanceDepuisLaLigne(ligne: LigneDeProfil): ProfilDeSeance {
  return {
    clavierDesDictees: parmi(REGLAGES_DU_CLAVIER, ligne.clavier_des_dictees, "clavier_des_dictees"),
    niveau: parmi(NIVEAUX, ligne.niveau, "niveau"),
  };
}

/** Lit le profil sous RLS : le parent ne lit que les enfants auxquels il est rattaché. */
export class ProfilsDeSeanceSupabase implements ProfilsDeSeance {
  constructor(private readonly client: SupabaseClient) {}

  async profilDe(enfant: string): Promise<ProfilDeSeance> {
    const { data, error } = await this.client.from("profils_enfants").select("niveau, clavier_des_dictees")
      .eq("id", enfant).single();
    if (error) throw new Error(`Lecture du profil impossible : ${error.message}`);
    return profilDeSeanceDepuisLaLigne(data);
  }
}
