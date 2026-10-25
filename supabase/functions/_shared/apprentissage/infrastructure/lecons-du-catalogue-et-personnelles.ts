import type { Lecon } from "../../catalogue/domain/index.ts";
import type { LeconsDuCatalogue } from "../application/ports/lecons-du-catalogue.ts";
import type { LeconsPersonnellesDuProfil } from "../application/ports/lecons-personnelles-du-profil.ts";

const PREFIXE_DES_LECONS_PERSONNELLES = "perso-";

export class LeconsDuCatalogueEtPersonnelles implements LeconsDuCatalogue {
  constructor(
    private readonly catalogue: LeconsDuCatalogue,
    private readonly personnelles: LeconsPersonnellesDuProfil,
    private readonly profil: string,
  ) {}

  async parId(id: string): Promise<Lecon | null> {
    const lecon = await this.catalogue.parId(id);
    if (lecon || !id.startsWith(PREFIXE_DES_LECONS_PERSONNELLES)) return lecon;
    return this.personnelles.parId(id, this.profil);
  }

  toutes(): Promise<readonly Lecon[]> {
    return this.catalogue.toutes();
  }
}
