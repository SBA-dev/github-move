import type {
  EtapeDeLecon,
  Exercice,
  ExerciceClasser,
  ExerciceConjugaison,
  ExerciceDictee,
} from "../../catalogue/domain/index.ts";
import { groupeDuVerbe } from "./groupe-du-verbe.ts";
import { estUnMotDictable } from "./mot-dictable.ts";
import { presentDuPremierGroupe, verbeAConjuguer } from "./present-du-premier-groupe.ts";
import type { TexteDuParent } from "./texte-du-parent.ts";

const NOMBRE_DE_MOTS_DU_TITRE = 3;
const NOMBRE_MAXIMAL_DE_MOTS_DICTES = 10;
const NOMBRE_MAXIMAL_DE_VERBES_A_CLASSER = 12;

const ETAPE_DES_LETTRES_MUETTES: EtapeDeLecon = {
  texte: "Pour écrire un mot, je le dis lentement et j'écoute chaque son. Attention aux lettres muettes !",
  exemples: [],
};

const ETAPE_DES_GROUPES_DU_VERBE: EtapeDeLecon = {
  texte:
    "Premier groupe : les verbes en e - r. Deuxième groupe : les verbes en i - r qui font i - s - s - o - n - s avec nous. Troisième groupe : tous les autres.",
  exemples: ["chanter", "finir", "prendre"],
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
      titre: titreAvecLesPremiers("Dictée", dictables),
      etapes: [ETAPE_DES_LETTRES_MUETTES],
      exercices: [dictee(dictables.slice(0, NOMBRE_MAXIMAL_DE_MOTS_DICTES))],
    },
    ecartes: elements.filter((mot) => !estUnMotDictable(mot)),
  };
}

export function leconDeVerbes(texte: TexteDuParent): { contenu: ContenuDeLecon; ecartes: string[] } {
  const verbes = texte.elements().map((verbe) => verbe.toLowerCase());
  return {
    contenu: {
      titre: titreAvecLesPremiers("Les verbes", verbes),
      etapes: [ETAPE_DES_GROUPES_DU_VERBE],
      exercices: [classement(verbes.slice(0, NOMBRE_MAXIMAL_DE_VERBES_A_CLASSER)), ...conjugaisonDe(verbes)],
    },
    ecartes: [],
  };
}

function titreAvecLesPremiers(debut: string, elements: string[]): string {
  const suite = elements.length > NOMBRE_DE_MOTS_DU_TITRE ? "…" : "";
  return `${debut} : ${elements.slice(0, NOMBRE_DE_MOTS_DU_TITRE).join(", ")}${suite}`;
}

function classement(verbes: string[]): ExerciceClasser {
  return {
    type: "classer",
    titre: "Chaque verbe dans sa maison",
    consigne: "Range chaque verbe dans la maison de son groupe.",
    groupes: [
      { id: "1", nom: "1er groupe" },
      { id: "2", nom: "2e groupe" },
      { id: "3", nom: "3e groupe" },
    ],
    items: verbes.map((verbe) => ({ texte: verbe, groupe: groupeDuVerbe(verbe) })),
  };
}

function conjugaisonDe(verbes: string[]): ExerciceConjugaison[] {
  const verbe = verbeAConjuguer(verbes);
  if (verbe === undefined) return [];
  return [{
    type: "conjugaison",
    titre: `Le verbe ${verbe}`,
    consigne: `Conjuguons le verbe ${verbe} au présent. Choisis la bonne forme pour chaque personne.`,
    verbe,
    temps: "présent",
    formes: presentDuPremierGroupe(verbe),
    distracteurs: [],
  }];
}

function dictee(mots: string[]): ExerciceDictee {
  return {
    type: "dictee",
    titre: "J'écris les mots",
    consigne: "Écoute bien et écris le mot que tu entends.",
    mots: mots.map((mot) => ({ mot })),
  };
}
