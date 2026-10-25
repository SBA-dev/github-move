import { toutesLesMatieres } from "@domain/catalogue";

export function libelleDeLaMatiere(code: string): string {
  return toutesLesMatieres().find((matiere) => matiere.code === code)?.libelle ?? code;
}
