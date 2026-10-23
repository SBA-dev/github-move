import { LeconMalFormee } from "./erreurs.ts";
import {
  type EtapeDeLecon,
  type Lecon,
  type NiveauDeLecon,
  NIVEAUX,
  type PassageDuGuideFondamental,
  type ProgrammeCite,
} from "./lecon.ts";
import { estUneMatiere, matiereDeCode } from "./matiere.ts";

type Objet = Record<string, unknown>;

export function lireLecon(brut: unknown): Lecon {
  const lecon = enObjet(brut, "la leçon");
  if (!Array.isArray(lecon.exercices)) throw new LeconMalFormee("les exercices ne sont pas une liste");
  if (!estUneMatiere(lecon.matiere)) throw new LeconMalFormee("la matière est inconnue");

  return Object.freeze({
    id: texteRequis(lecon.id, "l'identifiant"),
    matiere: matiereDeCode(lecon.matiere),
    niveau: lireNiveau(lecon.niveau),
    titre: texteRequis(lecon.titre, "le titre"),
    ordre: lecon.ordre as number,
    programme: lireProgramme(lecon.programme),
    etapes: lireEtapes(lecon.lecon),
    competence: lecon.competence as string | undefined,
    guide: lireGuide(lecon.guide),
  });
}

function enObjet(valeur: unknown, quoi: string): Objet {
  if (typeof valeur !== "object" || valeur === null || Array.isArray(valeur)) {
    throw new LeconMalFormee(`${quoi} n'est pas un objet`);
  }
  return valeur as Objet;
}

function texteRequis(valeur: unknown, quoi: string): string {
  if (typeof valeur !== "string" || valeur === "") throw new LeconMalFormee(`${quoi} manque`);
  return valeur;
}

function lireNiveau(valeur: unknown): NiveauDeLecon {
  if (!NIVEAUX.includes(valeur as NiveauDeLecon)) throw new LeconMalFormee("le niveau est inconnu");
  return valeur as NiveauDeLecon;
}

function lireProgramme(brut: unknown): ProgrammeCite {
  const programme = enObjet(brut, "le programme");
  return Object.freeze({
    section: programme.section as string,
    citation: programme.citation as string,
  });
}

function lireEtapes(brut: unknown): readonly EtapeDeLecon[] {
  if (!Array.isArray(brut)) return Object.freeze([]);
  return Object.freeze(brut.map((etape) =>
    Object.freeze({
      texte: etape.texte as string,
      exemples: Object.freeze([...(etape.exemples as string[])]),
    })
  ));
}

function lireGuide(brut: unknown): PassageDuGuideFondamental | undefined {
  if (brut === undefined) return undefined;
  const guide = enObjet(brut, "le passage du guide fondamental");
  return Object.freeze({
    titre: guide.titre as string,
    page: guide.page as number,
    extrait: guide.extrait as string,
  });
}
