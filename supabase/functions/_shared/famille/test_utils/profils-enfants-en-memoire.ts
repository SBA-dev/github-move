import type { ProfilsEnfants } from "../application/ports/profils-enfants.ts";
import type { ParentId } from "../domain/parent-id.ts";
import type { ProfilEnfant } from "../domain/profil-enfant.ts";
import type { ProfilEnfantId } from "../domain/profil-enfant-id.ts";

export class ProfilsEnfantsEnMemoire implements ProfilsEnfants {
  private readonly profils = new Map<string, ProfilEnfant>();

  parId(id: ProfilEnfantId): Promise<ProfilEnfant | null> {
    return Promise.resolve(this.profils.get(id.valeur) ?? null);
  }

  duParent(parent: ParentId): Promise<ProfilEnfant[]> {
    const profils = [...this.profils.values()]
      .filter((profil) => profil.estRattacheA(parent))
      .sort((a, b) => a.creeLe.getTime() - b.creeLe.getTime());
    return Promise.resolve(profils);
  }

  enregistrer(profil: ProfilEnfant): Promise<void> {
    this.profils.set(profil.id.valeur, profil);
    return Promise.resolve();
  }
}
