import type { ProfilEnCours, ProfilEnCoursSurLAppareil } from "../domain/profil-en-cours-sur-l-appareil.ts";

export class ProfilEnCoursSurLAppareilEnMemoire implements ProfilEnCoursSurLAppareil {
  profilEnCours: ProfilEnCours | undefined;

  definir(profil: ProfilEnCours): void {
    this.profilEnCours = profil;
  }
}
