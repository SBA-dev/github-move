import type { Niveau } from "../../catalogue/domain/index.ts";
import type { NiveauDuProfil } from "../application/ports/niveau-du-profil.ts";

export class NiveauxDesProfilsEnMemoire implements NiveauDuProfil {
  private readonly niveaux: ReadonlyMap<string, Niveau>;

  constructor(...niveaux: readonly [profil: string, niveau: Niveau][]) {
    this.niveaux = new Map(niveaux);
  }

  de(profil: string): Promise<Niveau> {
    const niveau = this.niveaux.get(profil);
    return niveau ? Promise.resolve(niveau) : Promise.reject(new Error(`Profil inconnu : ${profil}`));
  }
}
