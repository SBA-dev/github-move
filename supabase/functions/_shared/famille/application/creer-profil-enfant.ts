import { Niveau } from "../../catalogue/domain/index.ts";
import { lireCleUnivers } from "../domain/cle-univers.ts";
import type { GenerateurId } from "../domain/generateur-id.ts";
import { ParentId } from "../domain/parent-id.ts";
import { Prenom } from "../domain/prenom.ts";
import { type FaitDuProfilEnfant, ProfilEnfant } from "../domain/profil-enfant.ts";
import { ProfilEnfantId } from "../domain/profil-enfant-id.ts";
import { Reglages, type ReglagesBruts } from "../domain/reglages.ts";
import type { ProfilsEnfants } from "./ports/profils-enfants.ts";

export type DemandeDeCreation = {
  parent: string;
  prenom: string;
  niveau?: string;
  univers?: string;
  reglages?: ReglagesBruts;
};

export class CreerProfilEnfant {
  constructor(
    private readonly profils: ProfilsEnfants,
    private readonly generateurId: GenerateurId,
  ) {}

  async executer(demande: DemandeDeCreation, maintenant: Date): Promise<FaitDuProfilEnfant[]> {
    const profil = ProfilEnfant.creer(
      ProfilEnfantId.de(this.generateurId.nouveau()),
      ParentId.de(demande.parent),
      Prenom.de(demande.prenom),
      Niveau.de(demande.niveau ?? "CP"),
      lireCleUnivers(demande.univers ?? "animaux"),
      maintenant,
      Reglages.depuis(demande.reglages ?? {}),
    );
    await this.profils.ajouter(profil);
    return profil.retirerFaits();
  }
}
