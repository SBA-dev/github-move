import type { Lecon, SectionDuProgramme } from "../../catalogue/domain/index.ts";
import type { LeconPreparee } from "./preparer-une-lecon-personnelle.ts";
import type { TexteDuParent } from "./texte-du-parent.ts";
import { validerLaLeconPersonnelle } from "./valider-la-lecon-personnelle.ts";

const PREFIXE_DE_L_IDENTIFIANT = "perso-";

export type LeconPersonnelleCreee = Readonly<{
  type: "LeconPersonnelleCreee";
  lecon: string;
  profil: string;
  matiere: string;
  niveau: string;
  creeeLe: Date;
}>;

export type LeconPersonnelleSupprimee = Readonly<{
  type: "LeconPersonnelleSupprimee";
  lecon: string;
  profil: string;
  supprimeeLe: Date;
}>;

export type CreationDeLeconPersonnelle = Readonly<{
  id: string;
  profil: string;
  texte: TexteDuParent;
  preparee: LeconPreparee;
  sections: SectionDuProgramme[];
  maintenant: Date;
}>;

export class LeconPersonnelle {
  private constructor(
    readonly lecon: Lecon,
    readonly profil: string,
    readonly texte: TexteDuParent,
    readonly creeeLe: Date,
  ) {}

  static creer(
    { id, profil, texte, preparee, sections, maintenant }: CreationDeLeconPersonnelle,
  ): { leconPersonnelle: LeconPersonnelle; evenement: LeconPersonnelleCreee } {
    const lecon = validerLaLeconPersonnelle(preparee, PREFIXE_DE_L_IDENTIFIANT + id, sections);
    return {
      leconPersonnelle: new LeconPersonnelle(lecon, profil, texte, maintenant),
      evenement: {
        type: "LeconPersonnelleCreee",
        lecon: lecon.id,
        profil,
        matiere: lecon.matiere.code,
        niveau: lecon.niveau.valeur,
        creeeLe: maintenant,
      },
    };
  }

  supprimer(maintenant: Date): LeconPersonnelleSupprimee {
    return { type: "LeconPersonnelleSupprimee", lecon: this.lecon.id, profil: this.profil, supprimeeLe: maintenant };
  }
}
