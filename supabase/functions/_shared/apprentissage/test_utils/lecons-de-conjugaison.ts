import { type Lecon, lireLecon } from "../../catalogue/domain/index.ts";

const programme = { section: "c2-test", citation: "Citation de test." };

type Personne = { pronom: string; forme: string };

function leconDeConjugaison(
  id: string,
  exercice: { verbe: string; temps: string; formes: Personne[]; distracteurs?: string[] },
): Lecon {
  return lireLecon({
    id,
    matiere: "francais",
    niveau: "CP",
    titre: "Conjuguer",
    ordre: 1,
    programme,
    lecon: [],
    exercices: [{ type: "conjugaison", ...exercice }],
  });
}

export function leconDeConjugaisonDuVerbeEtre(): Lecon {
  return leconDeConjugaison("fr-cp-etre-avoir", {
    verbe: "être",
    temps: "présent",
    formes: [
      { pronom: "je", forme: "suis" },
      { pronom: "tu", forme: "es" },
      { pronom: "il", forme: "est" },
      { pronom: "nous", forme: "sommes" },
      { pronom: "vous", forme: "êtes" },
      { pronom: "ils", forme: "sont" },
    ],
  });
}

export function leconDeConjugaisonAvecBeaucoupDeCandidats(): Lecon {
  return leconDeConjugaison("fr-cp-etre-avoir-distracteurs", {
    verbe: "être",
    temps: "présent",
    formes: [
      { pronom: "je", forme: "suis" },
      { pronom: "tu", forme: "es" },
      { pronom: "il", forme: "est" },
      { pronom: "nous", forme: "sommes" },
    ],
    distracteurs: ["étais", "serai", "sois"],
  });
}

export function leconDeConjugaisonAvecUneFormeRepetee(): Lecon {
  return leconDeConjugaison("fr-cp-chanter", {
    verbe: "chanter",
    temps: "présent",
    formes: [
      { pronom: "je", forme: "chante" },
      { pronom: "tu", forme: "chantes" },
      { pronom: "il", forme: "chante" },
    ],
  });
}
