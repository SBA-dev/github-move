export type LeconBrute = Record<string, unknown>;

export function uneQuestionBrute(): Record<string, unknown> {
  return {
    question: "Dans le mot « poule », quel son entends-tu ?",
    choix: ["ou", "on", "an"],
    reponse: "ou",
  };
}

export function unExerciceBrut(type = "bulles", surcharges: Record<string, unknown> = {}): Record<string, unknown> {
  return { type, titre: "Quel son entends-tu ?", questions: [uneQuestionBrute()], ...surcharges };
}

/** Une leçon du format JSON (docs/format-lecons.md), valide, avec trois étapes de leçon et deux exercices. */
export function uneLeconBrute(surcharges: LeconBrute = {}): LeconBrute {
  return {
    id: "fr-cp-sons-ou-on-an",
    matiere: "francais",
    niveau: "CP",
    titre: "Les sons ou, on, an",
    ordre: 5,
    programme: {
      section: "c2-francais-cp-identifier-les-mots-de-maniere-de-plus-en-plus-aisee",
      citation: "Décoder et encoder de 25 à 30 CGP.",
    },
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
    exercices: [
      unExerciceBrut("bulles"),
      unExerciceBrut("ordre", {
        titre: "Remets les sons dans l'ordre",
        consigne: "Touche les sons dans l'ordre.",
        elements: ["ou", "on", "an"],
      }),
    ],
    competence: "Je reconnais les sons ou, on, an",
    ...surcharges,
  };
}

export function uneLeconBruteSans(champ: string): LeconBrute {
  const brute = uneLeconBrute();
  delete brute[champ];
  return brute;
}
