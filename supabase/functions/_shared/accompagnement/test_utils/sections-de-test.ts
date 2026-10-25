import { type CodeDeMatiere, type SectionDuProgramme, toutesLesMatieres } from "../../catalogue/domain/index.ts";

type Modele = Partial<Omit<SectionDuProgramme, "matiere">> & { matiere?: CodeDeMatiere };

export function sectionDeTest(modele: Modele = {}): SectionDuProgramme {
  const { matiere = "francais", ...reste } = modele;
  return {
    id: "section-de-test",
    source: { texte: "Programme de test", bo: "BO de test" },
    domaine: "Domaine de test",
    section: "Section de test",
    niveaux: ["CE1"],
    extrait: "Extrait de test.",
    ...reste,
    matiere: toutesLesMatieres().find((m) => m.code === matiere)!,
  };
}
