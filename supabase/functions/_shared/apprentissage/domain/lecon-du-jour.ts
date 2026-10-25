import type { CodeDeMatiere, Matiere, Niveau } from "../../catalogue/domain/index.ts";
import { matieresDuParcours, parcoursDeLaMatiere } from "./parcours.ts";
import type { EntreesDuParcours, LeconId } from "./parcours.ts";

export type EntreesDuJour = Readonly<{
  parcours: EntreesDuParcours | undefined;
  matiereDeLaDerniereSeance?: CodeDeMatiere;
}>;

export type LeconDuJour =
  | { genre: "inconnue" }
  | { genre: "aucuneLeconPourTaClasse" }
  | { genre: "parcoursFini" }
  | { genre: "aJouer"; lecon: LeconId; matiere: Matiere; niveau: Niveau; titre: string };

type MatiereAJouer = Readonly<{ matiere: Matiere; lecon: LeconId; titre: string }>;

export function leconDuJour(entrees: EntreesDuJour): LeconDuJour {
  const { parcours } = entrees;
  if (!parcours) return { genre: "inconnue" };
  const matieres = matieresDuParcours(parcours);
  if (matieres.length === 0) return { genre: "aucuneLeconPourTaClasse" };
  const choisie = matieresAJouer(parcours, matieres)
    .sort(parOrdreDeLAlternance(entrees.matiereDeLaDerniereSeance))[0];
  if (!choisie) return { genre: "parcoursFini" };
  return { genre: "aJouer", ...choisie, niveau: parcours.niveau };
}

function matieresAJouer(parcours: EntreesDuParcours, matieres: Matiere[]): MatiereAJouer[] {
  return matieres.flatMap((matiere) => {
    const prochaine = parcoursDeLaMatiere(parcours, matiere).lecons.find((lecon) => lecon.etat.genre === "prochaine");
    return prochaine ? [{ matiere, lecon: prochaine.lecon, titre: prochaine.titre }] : [];
  });
}

function parOrdreDeLAlternance(derniere: CodeDeMatiere | undefined) {
  const prioritaires: CodeDeMatiere[] = derniere === "francais" ? ["maths", "francais"] : ["francais", "maths"];
  const rang = (a: MatiereAJouer) => {
    const index = prioritaires.indexOf(a.matiere.code);
    return index === -1 ? prioritaires.length : index;
  };
  return (a: MatiereAJouer, b: MatiereAJouer) => rang(a) - rang(b);
}
