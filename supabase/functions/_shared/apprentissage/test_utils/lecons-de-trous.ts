import { type Lecon, lireLecon } from "../../catalogue/domain/index.ts";

const programme = { section: "c2-test", citation: "Citation de test." };

function leconDeTrous(id: string, exercice: { texte: string; distracteurs?: string[] }): Lecon {
  return lireLecon({
    id,
    matiere: "francais",
    niveau: "CE1",
    titre: "Des trous",
    ordre: 1,
    programme,
    lecon: [],
    exercices: [{ type: "trous", consigne: "Complète chaque phrase.", ...exercice }],
  });
}

export function leconDeDeuxTrous(): Lecon {
  return leconDeTrous("fr-ce1-deux-trous", { texte: "Je [suis] ici. Tu [es] là.", distracteurs: ["sont"] });
}

export function leconDeTrousAvecBeaucoupDeCandidats(): Lecon {
  return leconDeTrous("fr-ce1-phrases-magiques", {
    texte: "Je [suis] dans le jardin. Tu [as] un ballon rouge. Nous [sommes] amis. Ils [ont] faim.",
    distracteurs: ["es", "sont", "est", "avons"],
  });
}

export function leconAOuAAccent(): Lecon {
  return leconDeTrous("fr-ce1-a-ou-a", { texte: "Lina [a] un chat. Elle va [à] Paris." });
}
