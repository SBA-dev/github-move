import type { Exercice, Lecon, TypeDExercice } from "../../catalogue/domain/index.ts";
import { ExerciceIntrouvable, NombreDeQuestionsInconnu } from "./erreurs.ts";
import type { PlanDeSeance } from "./plan-de-seance.ts";

type Contenu = Exercice["contenu"];

function longueurDe(contenu: Contenu, champ: string): number {
  const valeur = contenu[champ];
  return Array.isArray(valeur) ? valeur.length : 0;
}

function nombreDeTrous(contenu: Contenu): number {
  const texte = contenu.texte;
  return typeof texte === "string" ? (texte.match(/\[[^\]]+\]/g) ?? []).length : 0;
}

const questionsParType: Record<Exclude<TypeDExercice, "addition">, (contenu: Contenu) => number> = {
  bulles: (contenu) => longueurDe(contenu, "questions"),
  lecture: (contenu) => longueurDe(contenu, "questions"),
  ecoute: (contenu) => longueurDe(contenu, "items"),
  boite: (contenu) => longueurDe(contenu, "items"),
  barres: (contenu) => longueurDe(contenu, "items"),
  classer: (contenu) => longueurDe(contenu, "items"),
  ordre: (contenu) => longueurDe(contenu, "elements"),
  trous: nombreDeTrous,
  conjugaison: (contenu) => longueurDe(contenu, "formes"),
  dictee: (contenu) => longueurDe(contenu, "mots"),
  calcul: (contenu) => longueurDe(contenu, "operations"),
  fluence: () => 1,
  memoriser: (contenu) => longueurDe(contenu, "vers") * 2,
};

function nombreDeQuestions(exercice: Exercice): number {
  if (exercice.type === "addition") throw new NombreDeQuestionsInconnu(exercice.type);
  return questionsParType[exercice.type](exercice.contenu);
}

function exerciceA(lecon: Lecon, position: number): Exercice {
  const exercice = lecon.exercices[position];
  if (exercice === undefined) throw new ExerciceIntrouvable();
  return exercice;
}

export class Avancement {
  private constructor(readonly questionsReussies: number, readonly total: number) {}

  static initial(lecon: Lecon, plan: PlanDeSeance): Avancement {
    const total = plan.positionsDesExercices
      .map((position) => nombreDeQuestions(exerciceA(lecon, position)))
      .reduce((somme, questions) => somme + questions, 0);
    return new Avancement(0, total);
  }

  apresUneQuestionReussie(): Avancement {
    return new Avancement(Math.min(this.questionsReussies + 1, this.total), this.total);
  }

  estComplet(): boolean {
    return this.questionsReussies === this.total;
  }
}
