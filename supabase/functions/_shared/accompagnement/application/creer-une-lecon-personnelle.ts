import type { Matiere, Niveau } from "../../catalogue/domain/index.ts";
import { ParentNonRattache } from "../domain/erreurs.ts";
import type { GenerateurId } from "./ports/generateur-id.ts";
import { LeconPersonnelle, type LeconPersonnelleCreee } from "../domain/lecon-personnelle.ts";
import { preparerUneLeconPersonnelle } from "../domain/preparer-une-lecon-personnelle.ts";
import { TexteDuParent } from "../domain/texte-du-parent.ts";
import type { LeconsPersonnelles } from "./ports/lecons-personnelles.ts";
import type { RattachementsDuParent } from "./ports/rattachements-du-parent.ts";
import type { SectionsDuProgramme } from "./ports/sections-du-programme.ts";

export type DemandeDeCreation = {
  parent: string;
  profil: string;
  texte: string;
  niveau: Niveau;
  matiere?: Matiere;
};

export class CreerUneLeconPersonnelle {
  constructor(
    private readonly rattachements: RattachementsDuParent,
    private readonly sectionsDuProgramme: SectionsDuProgramme,
    private readonly lecons: LeconsPersonnelles,
    private readonly generateurId: GenerateurId,
  ) {}

  async executer(
    demande: DemandeDeCreation,
    maintenant: Date,
  ): Promise<{ leconPersonnelle: LeconPersonnelle; evenement: LeconPersonnelleCreee }> {
    if (!await this.rattachements.estRattache(demande.parent, demande.profil)) throw new ParentNonRattache();
    const sections = await this.sectionsDuProgramme.toutes();
    const preparee = preparerUneLeconPersonnelle({
      texte: demande.texte,
      niveau: demande.niveau,
      matiere: demande.matiere,
    }, sections);
    const creation = LeconPersonnelle.creer({
      id: this.generateurId.nouveau(),
      profil: demande.profil,
      texte: TexteDuParent.de(demande.texte),
      preparee,
      sections,
      maintenant,
    });
    await this.lecons.enregistrer(creation.leconPersonnelle);
    return creation;
  }
}
