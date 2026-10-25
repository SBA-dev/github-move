import type { EtapeDeLecon, Exercice, ExerciceDictee } from "../../catalogue/domain/index.ts";
import { estUnMotDictable } from "./mot-dictable.ts";
import type { TexteDuParent } from "./texte-du-parent.ts";

const NOMBRE_DE_MOTS_DU_TITRE = 3;
const NOMBRE_MAXIMAL_DE_MOTS_DICTES = 10;

const ETAPE_DES_LETTRES_MUETTES: EtapeDeLecon = {
  texte: "Pour écrire un mot, je le dis lentement et j'écoute chaque son. Attention aux lettres muettes !",
  exemples: [],
};

type ContenuDeLecon = Readonly<{
  titre: string;
  etapes: readonly EtapeDeLecon[];
  exercices: readonly Exercice[];
}>;

export function leconDeMots(texte: TexteDuParent): { contenu: ContenuDeLecon; ecartes: string[] } {
  const elements = texte.elements();
  const dictables = elements.filter(estUnMotDictable);
  return {
    contenu: {
      titre: titreDeLaDictee(dictables),
      etapes: [ETAPE_DES_LETTRES_MUETTES],
      exercices: [dictee(dictables.slice(0, NOMBRE_MAXIMAL_DE_MOTS_DICTES))],
    },
    ecartes: elements.filter((mot) => !estUnMotDictable(mot)),
  };
}

function titreDeLaDictee(mots: string[]): string {
  const suite = mots.length > NOMBRE_DE_MOTS_DU_TITRE ? "…" : "";
  return `Dictée : ${mots.slice(0, NOMBRE_DE_MOTS_DU_TITRE).join(", ")}${suite}`;
}

function dictee(mots: string[]): ExerciceDictee {
  return {
    type: "dictee",
    titre: "J'écris les mots",
    consigne: "Écoute bien et écris le mot que tu entends.",
    mots: mots.map((mot) => ({ mot })),
  };
}
