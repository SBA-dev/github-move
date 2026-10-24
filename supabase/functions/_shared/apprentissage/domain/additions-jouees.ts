import type { ExerciceAddition, Niveau } from "../../catalogue/domain/index.ts";
import { AdditionPosee } from "./addition-posee.ts";
import type { EtapeCalculer } from "./etape-calculer.ts";
import { EtapePoser } from "./etape-poser.ts";
import { PasDeQuestionEnCours, ReponseIncompatible } from "./erreurs.ts";
import { ModeDeReponse } from "./mode-de-reponse.ts";
import type { AideDonnee } from "./question-jouee.ts";
import type { QuestionSuivie } from "./question-suivie.ts";
import type { Reponse, ResultatDeReponse } from "./reponse.ts";
import { enonceDUneAddition } from "./tirage-d-additions.ts";
import type { Tireur } from "./tireur.ts";
import { type AdditionEnJeu, type VueAddition, vueDeLAddition } from "./vue-d-addition.ts";

function questionsDeLAddition({ poser, calculer }: AdditionEnJeu): QuestionSuivie[] {
  return [...(poser?.questions ?? []), ...(calculer?.questions ?? [])];
}

export class AdditionsJouees {
  private derniereReponse: { addition: AdditionEnJeu; etape: EtapePoser | EtapeCalculer } | undefined;

  private constructor(
    private readonly additions: readonly AdditionEnJeu[],
    private readonly additionsTirees: readonly (readonly number[])[],
  ) {}

  static pour(exercice: ExerciceAddition, tireur: Tireur, niveau: Niveau): AdditionsJouees {
    const tirees = exercice.operations || !exercice.generateur ? [] : tireur.additions(exercice.generateur);
    const mode = ModeDeReponse.pour(niveau);
    const additions = (exercice.operations ?? tirees).map((nombres) => {
      const addition = AdditionPosee.depuis(nombres);
      return {
        addition,
        poser: exercice.etapes.includes("poser") ? addition.etapePoser() : undefined,
        calculer: exercice.etapes.includes("calculer") ? addition.etapeCalculer(mode, tireur) : undefined,
      };
    });
    return new AdditionsJouees(additions, tirees);
  }

  get questions(): readonly QuestionSuivie[] {
    return this.additions.flatMap(questionsDeLAddition);
  }

  get nombreReussies(): number {
    return this.questions.filter((question) => question.reussie).length;
  }

  /** Les additions que le générateur a tirées, une ligne « a + b » par addition. */
  tirages(): string[][] {
    return this.additionsTirees.length === 0 ? [] : [this.additionsTirees.map(enonceDUneAddition)];
  }

  /** Les choix tirés au fil du jeu, à chaque colonne calculée. */
  tiragesEnCoursDeJeu(): string[][] {
    return this.additions.flatMap(({ calculer }) => calculer?.tirages() ?? []);
  }

  enCours(): VueAddition | undefined {
    const addition = this.additions.find((candidate) => !terminee(candidate));
    return addition && vueDeLAddition(addition);
  }

  apresLaDerniereReponse(): VueAddition | undefined {
    return this.derniereReponse && vueDeLAddition(this.derniereReponse.addition);
  }

  aideApresLaDerniereErreur(): string | undefined {
    return this.derniereReponse?.etape.aideApresLaDerniereErreur();
  }

  repondre(reponse: Reponse): ResultatDeReponse {
    const { addition, etape } = this.etapeEnCours();
    this.derniereReponse = { addition, etape };
    if (etape instanceof EtapePoser) {
      if (reponse.genre !== "placement") throw new ReponseIncompatible(reponse.genre);
      return etape.placer(reponse);
    }
    if (reponse.genre === "placement") throw new ReponseIncompatible(reponse.genre);
    return etape.repondre(reponse);
  }

  direJeNeSaisPas(chiffre?: string): AideDonnee {
    const { etape } = this.etapeEnCours();
    return etape instanceof EtapePoser ? etape.direJeNeSaisPas(chiffre) : etape.questionEnCours.direJeNeSaisPas();
  }

  private etapeEnCours(): { addition: AdditionEnJeu; etape: EtapePoser | EtapeCalculer } {
    for (const addition of this.additions) {
      const etape = etapeNonTerminee(addition);
      if (etape) return { addition, etape };
    }
    throw new PasDeQuestionEnCours();
  }
}

function etapeNonTerminee({ poser, calculer }: AdditionEnJeu): EtapePoser | EtapeCalculer | undefined {
  if (poser && !poser.terminee) return poser;
  if (calculer && !calculer.terminee) return calculer;
  return undefined;
}

function terminee(addition: AdditionEnJeu): boolean {
  return etapeNonTerminee(addition) === undefined;
}
