import type {
  EtapeDeLecon,
  Exercice,
  ExerciceClasser,
  ExerciceConjugaison,
  ExerciceDictee,
  ExerciceMemoriser,
  ExerciceOrdre,
  ExerciceTrous,
} from "../../catalogue/domain/index.ts";
import { LeconImpossibleAPreparer } from "./erreurs.ts";
import type { FormeDuTexte } from "./forme-du-texte.ts";
import { groupeDuVerbe } from "./groupe-du-verbe.ts";
import { estUnMotDictable } from "./mot-dictable.ts";
import { presentDuPremierGroupe, verbeAConjuguer } from "./present-du-premier-groupe.ts";
import type { TexteDuParent } from "./texte-du-parent.ts";

const NOMBRE_DE_MOTS_DU_TITRE = 3;
const NOMBRE_MAXIMAL_DE_MOTS_DICTES = 10;
const NOMBRE_MAXIMAL_DE_VERBES_A_CLASSER = 12;
const NOMBRE_MAXIMAL_DE_VERS_A_MEMORISER = 16;
const NOMBRE_MAXIMAL_DE_LIGNES_DU_REPLI = 12;
const NOMBRE_MINIMAL_DE_LIGNES_DU_REPLI = 2;
const NOMBRE_DE_CARACTERES_DU_TITRE_DE_LECTURE = 40;
const NOMBRE_DE_PHRASES_UTILES = 5;
const NOMBRE_MINIMAL_DE_PHRASES_A_ORDONNER = 3;
const NOMBRE_DE_MOTS_CACHES = 4;
const NOMBRE_DE_DISTRACTEURS = 2;
const NOMBRE_MINIMAL_DE_LETTRES_D_UN_MOT_CACHE = 6;
const LONGUEUR_MAXIMALE_D_UNE_PHRASE_TROP_COURTE = 8;

const ETAPE_DES_LETTRES_MUETTES: EtapeDeLecon = {
  texte: "Pour écrire un mot, je le dis lentement et j'écoute chaque son. Attention aux lettres muettes !",
  exemples: [],
};

const ETAPE_DES_GROUPES_DU_VERBE: EtapeDeLecon = {
  texte:
    "Premier groupe : les verbes en e - r. Deuxième groupe : les verbes en i - r qui font i - s - s - o - n - s avec nous. Troisième groupe : tous les autres.",
  exemples: ["chanter", "finir", "prendre"],
};

const ETAPE_DE_LA_POESIE: EtapeDeLecon = {
  texte: "Pour apprendre un texte par cœur, on l'écoute vers par vers, puis on le redit sans regarder.",
  exemples: [],
};

const ETAPE_DE_LA_LECTURE: EtapeDeLecon = {
  texte: "Écoute bien le texte. Ensuite, retrouve les mots qui manquent et remets les phrases dans l'ordre.",
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
      titre: titreAvecLesPremiers("Dictée", dictables),
      etapes: [ETAPE_DES_LETTRES_MUETTES],
      exercices: dictables.length === 0 ? [] : [dictee(dictables.slice(0, NOMBRE_MAXIMAL_DE_MOTS_DICTES))],
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

export function leconDePoesie(texte: TexteDuParent): { contenu: ContenuDeLecon; ecartes: string[] } {
  const vers = texte.lignes();
  const [premierVers = ""] = vers;
  return {
    contenu: {
      titre: `Poésie : ${premierVers.replace(/[.,;:!?…]+$/, "")}`,
      etapes: [ETAPE_DE_LA_POESIE],
      exercices: [memoriser(vers.slice(0, NOMBRE_MAXIMAL_DE_VERS_A_MEMORISER))],
    },
    ecartes: [],
  };
}

export function leconDeTexte(texte: TexteDuParent): { contenu: ContenuDeLecon; ecartes: string[] } {
  const phrases = texte.phrases();
  return {
    contenu: {
      titre: titreDeLecture(texte.valeur),
      etapes: [ETAPE_DE_LA_LECTURE],
      exercices: [...motsEnvoles(phrases), ...dansLOrdre(phrases)],
    },
    ecartes: [],
  };
}

export function leconDuTexte(
  texte: TexteDuParent,
  forme: FormeDuTexte,
): { contenu: ContenuDeLecon; ecartes: string[] } {
  const lecon = leconSelon(texte, forme);
  if (lecon.contenu.exercices.length > 0) return lecon;
  const lignes = lignesDuRepli(texte, forme).slice(0, NOMBRE_MAXIMAL_DE_LIGNES_DU_REPLI);
  if (lignes.length < NOMBRE_MINIMAL_DE_LIGNES_DU_REPLI) throw new LeconImpossibleAPreparer();
  return { ...lecon, contenu: { ...lecon.contenu, exercices: [memoriser(lignes, "Mon texte")] } };
}

function leconSelon(texte: TexteDuParent, forme: FormeDuTexte) {
  switch (forme) {
    case "listeDeMots":
      return leconDeMots(texte);
    case "listeDeVerbes":
      return leconDeVerbes(texte);
    case "poesie":
      return leconDePoesie(texte);
    case "texteDocumentaire":
    case "texteSurUnMetier":
      return leconDeTexte(texte);
  }
}

function lignesDuRepli(texte: TexteDuParent, forme: FormeDuTexte): string[] {
  switch (forme) {
    case "listeDeMots":
    case "listeDeVerbes":
      return texte.elements();
    case "poesie":
      return texte.lignes();
    case "texteDocumentaire":
    case "texteSurUnMetier":
      return texte.phrases();
  }
}

function titreDeLecture(texte: string): string {
  const caracteres = Array.from(texte);
  const suite = caracteres.length > NOMBRE_DE_CARACTERES_DU_TITRE_DE_LECTURE ? "…" : "";
  return `Lecture : ${caracteres.slice(0, NOMBRE_DE_CARACTERES_DU_TITRE_DE_LECTURE).join("")}${suite}`;
}

function motsEnvoles(phrases: string[]): ExerciceTrous[] {
  const texte = phrases.slice(0, NOMBRE_DE_PHRASES_UTILES).join(" ");
  const motsLongs = [
    ...new Set(
      (texte.match(/\p{L}+/gu) ?? []).filter((mot) => mot.length >= NOMBRE_MINIMAL_DE_LETTRES_D_UN_MOT_CACHE),
    ),
  ];
  const caches = motsLongs.slice(0, NOMBRE_DE_MOTS_CACHES);
  if (caches.length < 2) return [];
  const distracteurs = motsLongs.slice(NOMBRE_DE_MOTS_CACHES, NOMBRE_DE_MOTS_CACHES + NOMBRE_DE_DISTRACTEURS);
  const enonce = texte.replace(/\p{L}+/gu, (mot) => caches.includes(mot) ? `[${mot}]` : mot);
  return [{
    type: "trous",
    titre: "Les mots envolés",
    consigne: "Retrouve les mots qui manquent.",
    ...segmenter(enonce),
    distracteurs,
  }];
}

function segmenter(enonce: string): Pick<ExerciceTrous, "segments" | "motsAttendus"> {
  const segments = enonce.split(/(\[[^\]]+\])/).filter((morceau) => morceau !== "").map((morceau) =>
    morceau.startsWith("[")
      ? { type: "trou" as const, motAttendu: morceau.slice(1, -1) }
      : { type: "texte" as const, texte: morceau }
  );
  const motsAttendus = segments.flatMap((segment) => segment.type === "trou" ? [segment.motAttendu] : []);
  return { segments, motsAttendus };
}

function dansLOrdre(phrases: string[]): ExerciceOrdre[] {
  const elements = phrases
    .filter((phrase) => phrase.length > LONGUEUR_MAXIMALE_D_UNE_PHRASE_TROP_COURTE)
    .slice(0, NOMBRE_DE_PHRASES_UTILES);
  if (elements.length < NOMBRE_MINIMAL_DE_PHRASES_A_ORDONNER) return [];
  return [{
    type: "ordre",
    titre: "Dans l'ordre",
    consigne: "Remets les phrases du texte dans l'ordre.",
    elements,
  }];
}

function memoriser(vers: string[], titre?: string): ExerciceMemoriser {
  return { type: "memoriser", titre, vers };
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
