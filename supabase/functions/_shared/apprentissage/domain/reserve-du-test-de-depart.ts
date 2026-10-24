import { toutesLesMatieres } from "../../catalogue/domain/index.ts";
import type { Lecon, Niveau } from "../../catalogue/domain/index.ts";
import { ordreDesNiveaux } from "./ordre-des-lecons.ts";

const MATIERES_DU_TEST = ["francais", "maths"];

export function reserveDuTestDeDepart(lecons: readonly Lecon[], niveau: Niveau): Lecon[] {
  const codesDesMatieres = toutesLesMatieres().map(({ code }) => code);
  const rangDeLaMatiere = (lecon: Lecon) => codesDesMatieres.indexOf(lecon.matiere.code);
  return lecons
    .filter((lecon) => MATIERES_DU_TEST.includes(lecon.matiere.code) && !lecon.niveau.estAuDessusDe(niveau))
    .sort((a, b) =>
      ordreDesNiveaux(a, b) || a.ordre - b.ordre || rangDeLaMatiere(a) - rangDeLaMatiere(b) ||
      a.id.localeCompare(b.id)
    );
}
