import type { SupabaseClient } from "@supabase/supabase-js";
import { type Lecon, LeconMalFormee, lireLecon } from "../../catalogue/domain/index.ts";
import type { LeconsPersonnellesDuProfil } from "../application/ports/lecons-personnelles-du-profil.ts";

/** Lit les leçons personnelles d'un profil sous RLS : le client porte le JWT du parent. */
export class LeconsPersonnellesDuProfilSupabase implements LeconsPersonnellesDuProfil {
  constructor(private readonly client: SupabaseClient) {}

  async parId(id: string, profil: string): Promise<Lecon | null> {
    const { data, error } = await this.client.from("lecons_personnelles").select("lecon")
      .eq("id", id).eq("profil", profil).maybeSingle<{ lecon: unknown }>();
    if (error) throw new Error(`Lecture de la leçon personnelle impossible : ${error.code ?? "inconnu"}`);
    return data === null ? null : lecturePermissive(data.lecon);
  }
}

function lecturePermissive(brut: unknown): Lecon | null {
  try {
    return lireLecon(brut);
  } catch (erreur) {
    if (erreur instanceof LeconMalFormee) return null;
    throw erreur;
  }
}
