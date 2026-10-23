import type { ProfilEnCoursSurLAppareil } from "./profil-en-cours-sur-l-appareil.ts";
import type { ProfilEnfant } from "./profil-enfant.ts";

export class ChoisirQuiJoue {
  constructor(private readonly appareil: ProfilEnCoursSurLAppareil) {}

  executer(profil: ProfilEnfant): void {
    this.appareil.definir({
      id: profil.id.valeur,
      prenom: profil.prenom.valeur,
      niveau: profil.niveau.valeur,
      univers: profil.univers,
    });
  }
}
