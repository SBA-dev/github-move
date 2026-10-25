import { type Lecon, lireLecon } from "../../catalogue/domain/index.ts";

export const POSITION_DE_LA_LECON_EN_ACTION = 0;
export const POSITION_DE_POSER_COMME_UN_CHAMPION = 1;
export const POSITION_DU_CALCUL_AVEC_RETENUE = 2;

export function leconPoserUneAdditionEnColonnesAuCP(): Lecon {
  return lireLecon({
    id: "ma-cp-addition-posee",
    matiere: "maths",
    niveau: "CP",
    titre: "Poser une addition en colonnes",
    ordre: 57,
    programme: {
      section: "c2-mathematiques-cp-les-quatre-operations",
      citation:
        "L’élève sait poser une addition de deux ou trois nombres à un ou deux chiffres, en positionnant les unités sous les unités, les dizaines sous les dizaines, et en calculer le résultat. Par exemple, 45 + 37 ou 28 + 8 + 56.",
    },
    lecon: [
      {
        texte:
          "Dans un nombre à deux chiffres, le chiffre de droite compte les unités, et le chiffre de gauche compte les dizaines.",
        exemples: ["45 : 4 dizaines et 5 unités"],
      },
      {
        texte: "Pour poser une addition, on range les unités sous les unités et les dizaines sous les dizaines.",
        exemples: ["45 + 37 : le 5 et le 7 dans la maison des Unités"],
      },
      {
        texte:
          "On calcule toujours en commençant par les unités. Si on trouve 10 ou plus, on garde les unités et la dizaine monte en retenue.",
        exemples: ["5 + 7 = 12 : j'écris 2 et je retiens 1"],
      },
    ],
    exercices: [
      {
        type: "addition",
        titre: "La leçon en action : 45 + 37",
        operations: [[45, 37]],
        etapes: ["poser", "calculer"],
      },
      {
        type: "addition",
        titre: "Poser comme un champion",
        operations: [[28, 8, 56], [63, 9], [34, 52]],
        etapes: ["poser"],
      },
      {
        type: "addition",
        titre: "Calculer avec la retenue",
        generateur: { nombres: 2, min: 15, max: 59, retenue: true, combien: 3 },
        etapes: ["calculer"],
      },
    ],
  });
}
