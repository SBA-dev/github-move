import type { Lecon } from "../../catalogue/domain/index.ts";
import type { LeconsDuCatalogue } from "../application/ports/lecons-du-catalogue.ts";
import type { LeconsPersonnellesDuProfil } from "../application/ports/lecons-personnelles-du-profil.ts";
import { LeconsDuCatalogueEtPersonnelles } from "./lecons-du-catalogue-et-personnelles.ts";

/** Pour la révision : l'ensemble des leçons est le catalogue plus les leçons personnelles du profil. */
export class LeconsDuCatalogueEtPersonnellesPourLaRevision implements LeconsDuCatalogue {
  private readonly parIdentifiant: LeconsDuCatalogueEtPersonnelles;

  constructor(
    private readonly catalogue: LeconsDuCatalogue,
    private readonly personnelles: LeconsPersonnellesDuProfil,
    private readonly profil: string,
  ) {
    this.parIdentifiant = new LeconsDuCatalogueEtPersonnelles(catalogue, personnelles, profil);
  }

  parId(id: string): Promise<Lecon | null> {
    return this.parIdentifiant.parId(id);
  }

  async toutes(): Promise<readonly Lecon[]> {
    return [...await this.catalogue.toutes(), ...await this.personnelles.toutes(this.profil)];
  }
}
