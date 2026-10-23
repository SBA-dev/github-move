import { type Lecon, lireLecon } from "../../catalogue/domain/index.ts";

type Brut = Record<string, unknown>;

const programme = { section: "c2-francais-cp-comprendre-un-texte", citation: "Il identifie des éléments." };

function question(texte: string, choix: ReadonlyArray<string>, reponse: string): Brut {
  return { question: texte, choix, reponse };
}

function uneLecon(surcharges: Brut): Lecon {
  return lireLecon({
    id: "lecon-de-test",
    matiere: "francais",
    niveau: "CP",
    titre: "Leçon de test",
    ordre: 1,
    programme,
    lecon: [],
    exercices: [],
    ...surcharges,
  });
}

/** Un exercice du format JSON, sans le contenu propre à son type. */
export function unExerciceBrut(type: string, contenu: Brut = {}): Brut {
  return { type, titre: `Exercice ${type}`, ...contenu };
}

/** Une leçon dont les exercices sont ceux donnés, sans étape de leçon. */
export function uneLeconAvecExercices(...exercices: ReadonlyArray<Brut>): Lecon {
  return uneLecon({ exercices });
}

/** Une leçon avec les étapes de leçon données (textes) et un exercice bulles d'une question. */
export function uneLeconAvecEtapes(...textes: ReadonlyArray<string>): Lecon {
  return uneLecon({
    lecon: textes.map((texte) => ({ texte, exemples: [] })),
    exercices: [unExerciceBrut("bulles", { questions: [question("2 + 1 ?", ["3", "4"], "3")] })],
  });
}

/** « Les sons ou, on, an » (fr-cp-sons-ou-on-an) : 3 étapes de leçon, 6 questions bulles, 9 étiquettes à classer. */
export function laLeconDesSons(): Lecon {
  const mots = ["loup", "roue", "chou", "pont", "lion", "savon", "banc", "vent", "dent"];
  return uneLecon({
    id: "fr-cp-sons-ou-on-an",
    titre: "Les sons ou, on, an",
    lecon: [
      { texte: "Certains sons s'écrivent avec deux lettres.", exemples: [] },
      { texte: "O et N font le son « on », comme dans ballon.", exemples: [] },
      { texte: "Écoute bien chaque mot.", exemples: ["ou", "on", "an"] },
    ],
    exercices: [
      {
        type: "bulles",
        titre: "Quel son entends-tu ?",
        questions: ["poule", "mouton", "enfant", "bonbon", "soupe", "lampe"].map((mot) =>
          question(`Dans le mot « ${mot} », quel son entends-tu ?`, ["ou", "on", "an"], "ou")
        ),
      },
      {
        type: "classer",
        titre: "Les maisons des sons",
        groupes: [{ id: "1", nom: "ou" }, { id: "2", nom: "on" }, { id: "3", nom: "an" }],
        items: mots.map((texte, i) => ({ texte, groupe: String(Math.floor(i / 3) + 1) })),
      },
    ],
  });
}

/** « Lecture : Le petit chat Plume » (fr-cp-lecture-petit-chat) : un exercice lecture de 4 questions. */
export function laLeconDeLecture(): Lecon {
  return uneLecon({
    id: "fr-cp-lecture-petit-chat",
    titre: "Lecture : Le petit chat Plume",
    lecon: [{ texte: "On va lire une petite histoire.", exemples: [] }],
    exercices: [{
      type: "lecture",
      titre: "Le petit chat Plume",
      texte: "Plume est un petit chat gris.",
      questions: [
        question("De quelle couleur est Plume ?", ["gris", "noir"], "gris"),
        question("Où dort Plume ?", ["sur le lit de Léa", "dans le jardin"], "sur le lit de Léa"),
        question("Que voit Plume un matin ?", ["une souris", "un oiseau"], "une souris"),
        question("Que donne Léa à Plume ?", ["du lait", "de l'eau"], "du lait"),
      ],
    }],
  });
}

/** « Chanson : Au clair de la lune » (fr-cp-chanson-clair-de-lune) : un exercice memoriser de 8 vers. */
export function laLeconDeLaChanson(): Lecon {
  return uneLecon({
    id: "fr-cp-chanson-clair-de-lune",
    titre: "Chanson : Au clair de la lune",
    exercices: [{
      type: "memoriser",
      titre: "Au clair de la lune",
      vers: [
        "Au clair de la lune,",
        "Mon ami Pierrot,",
        "Prête-moi ta plume",
        "Pour écrire un mot.",
        "Ma chandelle est morte,",
        "Je n'ai plus de feu.",
        "Ouvre-moi ta porte",
        "Pour l'amour de Dieu.",
      ],
    }],
  });
}
