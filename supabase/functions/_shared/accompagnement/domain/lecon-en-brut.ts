import type { EtapeDeLecon, Exercice, Lecon } from "../../catalogue/domain/index.ts";

export function leconEnBrut(lecon: Omit<Lecon, "id">, id: string): unknown {
  return {
    id,
    matiere: lecon.matiere.code,
    niveau: lecon.niveau.valeur,
    titre: lecon.titre,
    ordre: lecon.ordre,
    programme: { section: lecon.programme.section, citation: lecon.programme.citation },
    lecon: lecon.etapes.map(etapeEnBrut),
    exercices: lecon.exercices.map(exerciceEnBrut),
  };
}

function etapeEnBrut(etape: EtapeDeLecon): unknown {
  return { texte: etape.texte, exemples: [...etape.exemples] };
}

function exerciceEnBrut(exercice: Exercice): unknown {
  const communs = { type: exercice.type, titre: exercice.titre, consigne: exercice.consigne };
  switch (exercice.type) {
    case "dictee":
      return { ...communs, mots: exercice.mots.map((mot) => ({ ...mot })) };
    case "classer":
      return {
        ...communs,
        groupes: exercice.groupes.map((groupe) => ({ ...groupe })),
        items: exercice.items.map((item) => ({ ...item })),
      };
    case "conjugaison":
      return {
        ...communs,
        verbe: exercice.verbe,
        temps: exercice.temps,
        formes: exercice.formes.map((forme) => ({ ...forme })),
        distracteurs: [...exercice.distracteurs],
      };
    case "memoriser":
      return { ...communs, auteur: exercice.auteur, vers: [...exercice.vers] };
    case "trous":
      return {
        ...communs,
        texte: exercice.segments.map((segment) => segment.type === "trou" ? `[${segment.motAttendu}]` : segment.texte)
          .join(""),
        distracteurs: [...exercice.distracteurs],
      };
    case "ordre":
      return { ...communs, elements: [...exercice.elements] };
    default:
      throw new Error(`Le type d'exercice « ${exercice.type} » n'est pas pris en charge dans une leçon personnelle.`);
  }
}
