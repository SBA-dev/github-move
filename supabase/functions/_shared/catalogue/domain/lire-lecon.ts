import { LeconMalFormee, MatiereInconnue, NiveauInconnu } from "./erreurs.ts";
import type { EtapeDeLecon, Exercice, Lecon } from "./lecon.ts";
import { type Matiere, matiere } from "./matiere.ts";
import { type Niveau, niveau } from "./niveau.ts";
import { estUnTypeDExercice } from "./type-d-exercice.ts";

type Objet = Readonly<Record<string, unknown>>;

function enObjet(valeur: unknown, description: string): Objet {
  if (typeof valeur !== "object" || valeur === null || Array.isArray(valeur)) {
    throw new LeconMalFormee(`${description} doit être un objet`);
  }
  return valeur as Objet;
}

function enTexte(valeur: unknown, description: string): string {
  if (typeof valeur !== "string") throw new LeconMalFormee(`${description} doit être un texte`);
  return valeur;
}

function enListe(valeur: unknown, description: string): ReadonlyArray<unknown> {
  if (!Array.isArray(valeur)) throw new LeconMalFormee(`${description} doit être une liste`);
  return valeur;
}

function enNombre(valeur: unknown, description: string): number {
  if (typeof valeur !== "number") throw new LeconMalFormee(`${description} doit être un nombre`);
  return valeur;
}

function lireMatiere(valeur: unknown): Matiere {
  try {
    return matiere(valeur);
  } catch (erreur) {
    if (erreur instanceof MatiereInconnue) throw new LeconMalFormee("la matière est inconnue");
    throw erreur;
  }
}

function lireNiveau(valeur: unknown): Niveau {
  try {
    return niveau(valeur);
  } catch (erreur) {
    if (erreur instanceof NiveauInconnu) throw new LeconMalFormee("le niveau est inconnu");
    throw erreur;
  }
}

function textesFacultatifs(valeur: unknown, description: string): ReadonlyArray<string> {
  if (valeur === undefined) return [];
  return enListe(valeur, description).map((element) => enTexte(element, description));
}

function lireEtape(brute: unknown): EtapeDeLecon {
  const etape = enObjet(brute, "une étape de leçon");
  return {
    texte: enTexte(etape.texte, "le texte d'une étape de leçon"),
    exemples: textesFacultatifs(etape.exemples, "les exemples d'une étape de leçon"),
  };
}

function lireExercice(brut: unknown): Exercice | undefined {
  const contenu = enObjet(brut, "un exercice");
  if (!estUnTypeDExercice(contenu.type)) return undefined;
  return {
    type: contenu.type,
    titre: typeof contenu.titre === "string" ? contenu.titre : undefined,
    consigne: typeof contenu.consigne === "string" ? contenu.consigne : undefined,
    contenu,
  };
}

function lireExercices(bruts: ReadonlyArray<unknown>): ReadonlyArray<Exercice> {
  return bruts.map(lireExercice).filter((exercice) => exercice !== undefined);
}

export function lireLecon(brute: unknown): Lecon {
  const lecon = enObjet(brute, "la leçon");
  return {
    id: enTexte(lecon.id, "l'identifiant"),
    titre: enTexte(lecon.titre, "le titre"),
    matiere: lireMatiere(lecon.matiere),
    niveau: lireNiveau(lecon.niveau),
    ordre: enNombre(lecon.ordre, "l'ordre"),
    etapes: enListe(lecon.lecon, "les étapes de leçon").map(lireEtape),
    exercices: lireExercices(enListe(lecon.exercices, "les exercices")),
  };
}
