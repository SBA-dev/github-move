import { LeconPersonnelleIntrouvable } from "../domain/erreurs.ts";
import type { LeconPersonnelleSupprimee } from "../domain/lecon-personnelle.ts";
import type { LeconsPersonnelles } from "./ports/lecons-personnelles.ts";
import type { RattachementsDuParent } from "./ports/rattachements-du-parent.ts";

export type DemandeDeSuppression = {
  parent: string;
  lecon: string;
};

export class SupprimerUneLeconPersonnelle {
  constructor(
    private readonly rattachements: RattachementsDuParent,
    private readonly lecons: LeconsPersonnelles,
  ) {}

  async executer(demande: DemandeDeSuppression, maintenant: Date): Promise<LeconPersonnelleSupprimee> {
    const leconPersonnelle = await this.lecons.parId(demande.lecon);
    if (!leconPersonnelle || !await this.rattachements.estRattache(demande.parent, leconPersonnelle.profil)) {
      throw new LeconPersonnelleIntrouvable();
    }
    const evenement = leconPersonnelle.supprimer(maintenant);
    await this.lecons.supprimer(demande.lecon);
    return evenement;
  }
}
