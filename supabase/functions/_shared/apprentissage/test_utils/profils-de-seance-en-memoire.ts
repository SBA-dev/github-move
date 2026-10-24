import type { ProfilsDeSeance } from "../application/ports/profils-de-seance.ts";
import type { ProfilDeSeance } from "../domain/profil-de-seance.ts";

export class ProfilsDeSeanceEnMemoire implements ProfilsDeSeance {
  private readonly profils: ReadonlyMap<string, ProfilDeSeance>;

  constructor(...profils: readonly [enfant: string, profil: ProfilDeSeance][]) {
    this.profils = new Map(profils);
  }

  profilDe(enfant: string): Promise<ProfilDeSeance> {
    const profil = this.profils.get(enfant);
    return profil ? Promise.resolve(profil) : Promise.reject(new Error(`Profil introuvable : ${enfant}`));
  }
}
