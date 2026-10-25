import type { Lecon } from "../../catalogue/domain/index.ts";
import type { LeconsPersonnellesDuProfil } from "../application/ports/lecons-personnelles-du-profil.ts";

export class LeconsPersonnellesDuProfilEnMemoire implements LeconsPersonnellesDuProfil {
  readonly identifiantsInterroges: string[] = [];
  private readonly lecons = new Map<string, Lecon>();

  ajouter(profil: string, lecon: Lecon): this {
    this.lecons.set(`${profil}/${lecon.id}`, lecon);
    return this;
  }

  parId(id: string, profil: string): Promise<Lecon | null> {
    this.identifiantsInterroges.push(id);
    return Promise.resolve(this.lecons.get(`${profil}/${id}`) ?? null);
  }
}
