import {
  type CodeDeMatiere,
  type Lecon,
  type Matiere,
  matiereDeCode,
  type Niveau,
  type SectionDuProgramme,
} from "../../catalogue/domain/index.ts";
import { MOTS_INDICES_PAR_FORME, motsSignificatifsDuTexte, sectionRetenue } from "./choix-de-la-section.ts";
import { citationDeLaSection } from "./citation-de-la-section.ts";
import { type FormeDuTexte, reconnaitreLaForme } from "./forme-du-texte.ts";
import { leconDuTexte } from "./generateurs-locaux.ts";
import { TexteDuParent } from "./texte-du-parent.ts";

export const ORDRE_DES_LECONS_PERSONNELLES = 900;

export type DemandeDeLeconPersonnelle = Readonly<{
  texte: string;
  niveau: Niveau;
  matiere?: Matiere;
}>;

export type LeconPreparee = Readonly<{
  lecon: Omit<Lecon, "id">;
  forme: FormeDuTexte;
  section: SectionDuProgramme;
  ecartes: string[];
}>;

export function preparerUneLeconPersonnelle(
  demande: DemandeDeLeconPersonnelle,
  sections: SectionDuProgramme[],
): LeconPreparee {
  const texte = TexteDuParent.de(demande.texte);
  const forme = reconnaitreLaForme(texte);
  const matiere = demande.matiere ?? matiereParDefaut(forme, demande.niveau, sections);
  const section = sectionRetenue(texte, forme, demande.niveau, matiere, sections);
  const { contenu, ecartes } = leconDuTexte(texte, forme);
  const motsCles = [...motsSignificatifsDuTexte(texte), ...MOTS_INDICES_PAR_FORME[forme]];
  return {
    lecon: {
      matiere,
      niveau: demande.niveau,
      titre: contenu.titre,
      ordre: ORDRE_DES_LECONS_PERSONNELLES,
      programme: { section: section.id, citation: citationDeLaSection(section, motsCles) },
      etapes: contenu.etapes,
      exercices: contenu.exercices,
    },
    forme,
    section,
    ecartes,
  };
}

function matiereParDefaut(forme: FormeDuTexte, niveau: Niveau, sections: SectionDuProgramme[]): Matiere {
  const parleDUnMetierEtEmcCouvreLeNiveau = forme === "texteSurUnMetier" &&
    sections.some((section) => section.matiere.code === "emc" && section.niveaux.includes(niveau.valeur));
  const code: CodeDeMatiere = parleDUnMetierEtEmcCouvreLeNiveau ? "emc" : "francais";
  return matiereDeCode(code);
}
