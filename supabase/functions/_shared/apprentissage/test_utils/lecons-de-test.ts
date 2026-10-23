import { type Lecon, lireLecon } from "../../catalogue/domain/index.ts";

const programme = { section: "c2-test", citation: "Citation de test." };

const questionDeBulles = (question: string) => ({ question, choix: ["ou", "on", "an"], reponse: "ou" });

const bullesDeSons = {
  type: "bulles",
  titre: "Quel son entends-tu ?",
  questions: [
    "Dans le mot « poule », quel son entends-tu ?",
    "Dans le mot « mouton », quel son entends-tu à la fin ?",
    "Dans le mot « enfant », quel son entends-tu ?",
    "Dans le mot « bonbon », quel son entends-tu deux fois ?",
    "Dans le mot « soupe », quel son entends-tu ?",
    "Dans le mot « lampe », quel son entends-tu ?",
  ].map(questionDeBulles),
};

const classerLesMaisons = {
  type: "classer",
  titre: "Les maisons des sons",
  consigne: "Range chaque mot dans la maison de son son.",
  groupes: [{ id: "1", nom: "ou" }, { id: "2", nom: "on" }, { id: "3", nom: "an" }],
  items: [
    { texte: "loup", groupe: "1" },
    { texte: "roue", groupe: "1" },
    { texte: "chou", groupe: "1" },
    { texte: "pont", groupe: "2" },
    { texte: "lion", groupe: "2" },
    { texte: "savon", groupe: "2" },
    { texte: "banc", groupe: "3" },
    { texte: "vent", groupe: "3" },
    { texte: "dent", groupe: "3" },
  ],
};

export function leconSonsOuOnAn(): Lecon {
  return lireLecon({
    id: "fr-cp-sons-ou-on-an",
    matiere: "francais",
    niveau: "CP",
    titre: "Les sons ou, on, an",
    ordre: 5,
    programme,
    lecon: [
      {
        texte: "Certains sons s'écrivent avec deux lettres. O et U ensemble font le son « ou », comme dans loup.",
        exemples: [],
      },
      {
        texte: "O et N font le son « on », comme dans ballon. A et N font le son « an », comme dans maman.",
        exemples: [],
      },
      { texte: "Écoute bien chaque mot, et cherche le son que tu entends.", exemples: ["ou", "on", "an"] },
    ],
    exercices: [bullesDeSons, classerLesMaisons],
  });
}

export function leconCompterSansEtape(): Lecon {
  return lireLecon({
    id: "ma-cp-compter",
    matiere: "maths",
    niveau: "CP",
    titre: "Compter",
    ordre: 1,
    programme,
    lecon: [],
    exercices: [{ type: "bulles", questions: [questionDeBulles("Combien font 2 + 1 ?")] }],
  });
}

export function leconSansExercice(): Lecon {
  return lireLecon({
    id: "fr-cp-sans-exercice",
    matiere: "francais",
    niveau: "CP",
    titre: "Sans exercice",
    ordre: 1,
    programme,
    lecon: [{ texte: "Une étape.", exemples: [] }],
    exercices: [],
  });
}

function leconDeDeuxExercices(id: string, secondExercice: object): Lecon {
  return lireLecon({
    id,
    matiere: "maths",
    niveau: "CP",
    titre: "Deux exercices",
    ordre: 2,
    programme,
    lecon: [{ texte: "Une étape.", exemples: [] }],
    exercices: [
      {
        type: "bulles",
        titre: "Premier défi",
        questions: [questionDeBulles("Combien font 1 + 1 ?"), questionDeBulles("Combien font 2 + 2 ?")],
      },
      secondExercice,
    ],
  });
}

export function leconDeDeuxExercicesCourts(): Lecon {
  return leconDeDeuxExercices("ma-cp-deux-exercices", {
    type: "bulles",
    titre: "Second défi",
    questions: [questionDeBulles("Combien font 3 + 3 ?")],
  });
}

export function leconDeDeuxExercicesDontLeSecondSansTitre(): Lecon {
  return leconDeDeuxExercices("ma-cp-second-sans-titre", {
    type: "bulles",
    questions: [questionDeBulles("Combien font 3 + 3 ?")],
  });
}

function leconAvecUnExercice(id: string, exercice: object): Lecon {
  return lireLecon({
    id,
    matiere: "maths",
    niveau: "CP",
    titre: "Une leçon à choix",
    ordre: 1,
    programme,
    lecon: [],
    exercices: [exercice],
  });
}

export function leconDeCalcul(): Lecon {
  return leconAvecUnExercice("ma-cp-calcul", {
    type: "bulles",
    questions: [{ question: "Combien font 3 + 4 ?", choix: ["6", "7", "8", "9"], reponse: "7" }],
  });
}

export function leconDeLecture(): Lecon {
  return leconAvecUnExercice("fr-cp-lecture-petit-chat", {
    type: "lecture",
    texte: "Plume est un petit chat. Il dort sur le lit de Léa.",
    questions: [{
      question: "Où dort Plume ?",
      choix: ["sur le lit de Léa", "dans le jardin"],
      reponse: "sur le lit de Léa",
    }],
  });
}

export function leconDEcoute(): Lecon {
  return leconAvecUnExercice("an-cp-animaux", {
    type: "ecoute",
    items: [{ dire: "cat", choix: ["chat", "chien"], reponse: "chat" }],
  });
}

export function leconAvecDesChoixAccentues(): Lecon {
  return leconAvecUnExercice("fr-cp-a-ou-a-accent", {
    type: "bulles",
    questions: [{ question: "Il … un vélo.", choix: ["a", "à"], reponse: "a" }],
  });
}
