import { LeconMalFormee, NiveauInconnu } from "./erreurs.ts";
import { lireExercices } from "./exercice.ts";
import { type EtapeDeLecon, type Lecon, type PassageDuGuideFondamental, type ProgrammeCite } from "./lecon.ts";
import { enObjet, liste, listeDeTextes, nombreRequis, texteFacultatif, texteRequis } from "./lecture.ts";
import { estUneMatiere, matiereDeCode } from "./matiere.ts";
import { Niveau } from "./niveau.ts";

export function lireLecon(brut: unknown): Lecon {
  const lecon = enObjet(brut, "la leçon");
  if (!estUneMatiere(lecon.matiere)) throw new LeconMalFormee("la matière est inconnue");

  return Object.freeze({
    id: texteRequis(lecon.id, "l'identifiant"),
    matiere: matiereDeCode(lecon.matiere),
    niveau: lireNiveau(lecon.niveau),
    titre: texteRequis(lecon.titre, "le titre"),
    ordre: nombreRequis(lecon.ordre, "l'ordre"),
    programme: lireProgramme(lecon.programme),
    etapes: lireEtapes(lecon.lecon),
    exercices: lireExercices(liste(lecon.exercices, "les exercices")),
    competence: texteFacultatif(lecon.competence, "la compétence"),
    guide: lireGuide(lecon.guide),
  });
}

function lireNiveau(valeur: unknown): Niveau {
  try {
    return Niveau.de(texteRequis(valeur, "le niveau"));
  } catch (erreur) {
    if (erreur instanceof NiveauInconnu) throw new LeconMalFormee("le niveau est inconnu");
    throw erreur;
  }
}

function lireProgramme(brut: unknown): ProgrammeCite {
  const programme = enObjet(brut, "le programme");
  return Object.freeze({
    section: texteRequis(programme.section, "la section du programme"),
    citation: texteRequis(programme.citation, "la citation du programme"),
  });
}

function lireEtapes(brut: unknown): readonly EtapeDeLecon[] {
  if (brut === undefined) return Object.freeze([]);
  return Object.freeze(liste(brut, "les étapes de la leçon").map(lireEtape));
}

function lireEtape(brut: unknown): EtapeDeLecon {
  const etape = enObjet(brut, "une étape de leçon");
  return Object.freeze({
    texte: texteRequis(etape.texte, "le texte d'une étape de leçon"),
    exemples: listeDeTextes(etape.exemples, "les exemples d'une étape de leçon"),
  });
}

function lireGuide(brut: unknown): PassageDuGuideFondamental | undefined {
  if (brut === undefined) return undefined;
  const guide = enObjet(brut, "le passage du guide fondamental");
  return Object.freeze({
    titre: texteRequis(guide.titre, "le titre du guide fondamental"),
    page: nombreRequis(guide.page, "la page du guide fondamental"),
    extrait: texteRequis(guide.extrait, "l'extrait du guide fondamental"),
  });
}
