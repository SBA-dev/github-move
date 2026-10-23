import type { SupabaseClient } from "@supabase/supabase-js";
import { Niveau } from "../../catalogue/domain/index.ts";
import type { ProfilsEnfants } from "../application/ports/profils-enfants.ts";
import { lireCleUnivers } from "../domain/cle-univers.ts";
import { ParentId } from "../domain/parent-id.ts";
import { Prenom } from "../domain/prenom.ts";
import { ProfilEnfant } from "../domain/profil-enfant.ts";
import { ProfilEnfantId } from "../domain/profil-enfant-id.ts";

const COLONNES = "id, prenom, niveau, univers, cree_le, rattachements(parent)";

export type LigneDeProfilEnfant = {
  id: string;
  prenom: string;
  niveau: string;
  univers: string;
  cree_le: string;
  rattachements: { parent: string }[];
};

export function profilDepuisLaLigne(ligne: LigneDeProfilEnfant): ProfilEnfant {
  return ProfilEnfant.reconstituer(
    ProfilEnfantId.de(ligne.id),
    Prenom.de(ligne.prenom),
    Niveau.de(ligne.niveau),
    lireCleUnivers(ligne.univers),
    new Date(ligne.cree_le),
    ligne.rattachements.map((rattachement) => ParentId.de(rattachement.parent)),
  );
}

export function modificationDepuisLeProfil(profil: ProfilEnfant) {
  return { prenom: profil.prenom.valeur, niveau: profil.niveau.valeur, univers: profil.univers };
}

export class ProfilsEnfantsSupabase implements ProfilsEnfants {
  constructor(private readonly client: SupabaseClient) {}

  async parId(id: ProfilEnfantId): Promise<ProfilEnfant | null> {
    const { data, error } = await this.client.from("profils_enfants").select(COLONNES).eq("id", id.valeur)
      .maybeSingle<LigneDeProfilEnfant>();
    if (error) throw new Error(`Lecture du profil enfant impossible : ${error.message}`);
    return data === null ? null : profilDepuisLaLigne(data);
  }

  async duParent(parent: ParentId): Promise<ProfilEnfant[]> {
    const { data, error } = await this.client.from("profils_enfants").select(COLONNES).order("cree_le")
      .returns<LigneDeProfilEnfant[]>();
    if (error) throw new Error(`Lecture des profils enfants impossible : ${error.message}`);
    return data.map(profilDepuisLaLigne).filter((profil) => profil.estRattacheA(parent));
  }

  async enregistrer(profil: ProfilEnfant): Promise<void> {
    if ((await this.parId(profil.id)) === null) return await this.creer(profil);
    await this.modifier(profil);
  }

  // Le profil et son premier rattachement sont écrits par une fonction Postgres : une seule transaction.
  private async creer(profil: ProfilEnfant): Promise<void> {
    const { error } = await this.client.rpc("creer_profil_enfant", {
      p_id: profil.id.valeur,
      p_parent: profil.rattaches[0].valeur,
      p_prenom: profil.prenom.valeur,
      p_niveau: profil.niveau.valeur,
      p_univers: profil.univers,
      p_cree_le: profil.creeLe.toISOString(),
    });
    if (error) throw new Error(`Création du profil enfant impossible : ${error.message}`);
  }

  private async modifier(profil: ProfilEnfant): Promise<void> {
    const { data, error } = await this.client.from("profils_enfants").update(modificationDepuisLeProfil(profil))
      .eq("id", profil.id.valeur).select("id");
    if (error) throw new Error(`Modification du profil enfant impossible : ${error.message}`);
    if (data.length === 0) throw new Error("Modification du profil enfant refusée : aucune ligne modifiée.");
  }
}
