import { Niveau } from "../../catalogue/domain/index.ts";
import { lireCleUnivers } from "../domain/cle-univers.ts";
import { ProfilEnfantIntrouvable } from "../domain/erreurs.ts";
import { ParentId } from "../domain/parent-id.ts";
import { Prenom } from "../domain/prenom.ts";
import type { FaitDuProfilEnfant, ModificationDuProfilEnfant } from "../domain/profil-enfant.ts";
import { ProfilEnfantId } from "../domain/profil-enfant-id.ts";
import type { ProfilsEnfants } from "./ports/profils-enfants.ts";

export type DemandeDeModification = {
  parent: string;
  profil: string;
  prenom?: string;
  niveau?: string;
  univers?: string;
};

export class ModifierProfilEnfant {
  constructor(private readonly profils: ProfilsEnfants) {}

  async executer(demande: DemandeDeModification): Promise<FaitDuProfilEnfant[]> {
    const profil = await this.profils.parId(ProfilEnfantId.de(demande.profil));
    if (profil === null) throw new ProfilEnfantIntrouvable();
    profil.modifier(ParentId.de(demande.parent), lireModification(demande));
    await this.profils.enregistrer(profil);
    return profil.retirerFaits();
  }
}

function lireModification(demande: DemandeDeModification): ModificationDuProfilEnfant {
  return {
    prenom: demande.prenom === undefined ? undefined : Prenom.de(demande.prenom),
    niveau: demande.niveau === undefined ? undefined : Niveau.de(demande.niveau),
    univers: demande.univers === undefined ? undefined : lireCleUnivers(demande.univers),
  };
}
