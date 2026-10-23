import type { SupabaseClient } from "@supabase/supabase-js";
import { Niveau } from "../../catalogue/domain/index.ts";
import type { ProfilsEnfants } from "../application/ports/profils-enfants.ts";
import { lireCleUnivers } from "../domain/cle-univers.ts";
import { ParentId } from "../domain/parent-id.ts";
import { Prenom } from "../domain/prenom.ts";
import { ProfilEnfant } from "../domain/profil-enfant.ts";
import { ProfilEnfantId } from "../domain/profil-enfant-id.ts";
import { Reglages } from "../domain/reglages.ts";

const COLONNES =
  "id, prenom, niveau, univers, cree_le, mode_dys, tout_lire_a_voix_haute, parcours_libre, clavier_des_dictees, langue_du_parent, rattachements(parent)";

export type LigneDeProfilEnfant = {
  id: string;
  prenom: string;
  niveau: string;
  univers: string;
  cree_le: string;
  mode_dys?: boolean;
  tout_lire_a_voix_haute?: boolean;
  parcours_libre?: boolean;
  clavier_des_dictees?: string;
  langue_du_parent?: string;
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
    Reglages.depuis({
      modeDys: ligne.mode_dys,
      toutLireAVoixHaute: ligne.tout_lire_a_voix_haute,
      parcoursLibre: ligne.parcours_libre,
      clavierDesDictees: ligne.clavier_des_dictees,
      langueDuParent: ligne.langue_du_parent,
    }),
  );
}

export function colonnesDesReglages(reglages: Reglages) {
  return {
    mode_dys: reglages.modeDys,
    tout_lire_a_voix_haute: reglages.toutLireAVoixHaute,
    parcours_libre: reglages.parcoursLibre,
    clavier_des_dictees: reglages.clavierDesDictees.valeur,
    langue_du_parent: reglages.langueDuParent.valeur,
  };
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

  // Le profil et son premier rattachement sont écrits par une fonction Postgres : une seule transaction.
  async ajouter(profil: ProfilEnfant): Promise<void> {
    const { error } = await this.client.rpc("creer_profil_enfant", {
      p_id: profil.id.valeur,
      p_parent: profil.rattaches[0].valeur,
      p_prenom: profil.prenom.valeur,
      p_niveau: profil.niveau.valeur,
      p_univers: profil.univers,
      p_cree_le: profil.creeLe.toISOString(),
      p_mode_dys: profil.reglages.modeDys,
      p_tout_lire_a_voix_haute: profil.reglages.toutLireAVoixHaute,
      p_parcours_libre: profil.reglages.parcoursLibre,
      p_clavier_des_dictees: profil.reglages.clavierDesDictees.valeur,
      p_langue_du_parent: profil.reglages.langueDuParent.valeur,
    });
    if (error) throw new Error(`Création du profil enfant impossible : ${error.message}`);
  }

  async enregistrer(profil: ProfilEnfant): Promise<void> {
    const { data, error } = await this.client.from("profils_enfants").update({
      ...modificationDepuisLeProfil(profil),
      ...colonnesDesReglages(profil.reglages),
    })
      .eq("id", profil.id.valeur).select("id");
    if (error) throw new Error(`Modification du profil enfant impossible : ${error.message}`);
    if (data.length === 0) throw new Error("Modification du profil enfant refusée : aucune ligne modifiée.");
  }
}
