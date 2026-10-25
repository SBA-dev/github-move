import type { SupabaseClient } from "@supabase/supabase-js";
import { Niveau } from "../../catalogue/domain/index.ts";
import { ProfilEnfantIntrouvable } from "../../famille/domain/erreurs.ts";
import type { NiveauDuProfil } from "../application/ports/niveau-du-profil.ts";

/** Lit le niveau du profil sous RLS : le client porte le JWT du parent. */
export class NiveauDuProfilSupabase implements NiveauDuProfil {
  constructor(private readonly client: SupabaseClient) {}

  async de(profil: string): Promise<Niveau> {
    const { data, error } = await this.client.from("profils_enfants").select("niveau")
      .eq("id", profil).maybeSingle<{ niveau: string }>();
    if (error) throw new Error(`Lecture du niveau du profil impossible : ${error.message}`);
    if (data === null) throw new ProfilEnfantIntrouvable();
    return Niveau.de(data.niveau);
  }
}
