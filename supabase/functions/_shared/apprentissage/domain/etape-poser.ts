import { CleDeQuestion } from "./cle-de-question.ts";
import { QuestionAPlacer } from "./question-a-placer.ts";
import type { AideDonnee } from "./question-jouee.ts";
import type { Placement, ResultatDeReponse } from "./reponse.ts";
import { PasDeQuestionEnCours } from "./erreurs.ts";
import { type Couleur, type Rang, RANGS } from "./rangs-d-addition.ts";

type ChiffreAPoser = Readonly<{ nombre: number; question: QuestionAPlacer }>;

export class EtapePoser {
  private derniereAide: string | undefined;

  private constructor(private readonly chiffres: readonly ChiffreAPoser[]) {}

  static pour(nombres: readonly number[]): EtapePoser {
    return new EtapePoser(nombres.flatMap((nombre, indice) => questionsDuNombre(nombre, indice)));
  }

  get questions(): readonly QuestionAPlacer[] {
    return this.chiffres.map(({ question }) => question);
  }

  get terminee(): boolean {
    return this.questions.every((question) => question.reussie);
  }

  get erreurs(): number {
    return this.questions.reduce((total, question) => total + question.erreurs, 0);
  }

  get nombreCourant(): number {
    const courant = this.chiffres.find(({ question }) => !question.reussie);
    if (!courant) throw new PasDeQuestionEnCours();
    return courant.nombre;
  }

  chiffresAPoser(): string[] {
    return this.enCours().map(({ question }) => question.etiquette);
  }

  placer(placement: Placement): ResultatDeReponse {
    const question = this.questionVisee(placement.etiquette, placement.groupe);
    const estJuste = question.groupe === placement.groupe;
    question.enregistrer(placement, estJuste);
    this.derniereAide = estJuste ? undefined : question.aide;
    return estJuste ? "juste" : "fausse";
  }

  direJeNeSaisPas(chiffre?: string): AideDonnee {
    const question = this.questionVisee(chiffre);
    if (question.groupe === undefined) throw new PasDeQuestionEnCours();
    return question.direJeNeSaisPas(question.groupe);
  }

  aideApresLaDerniereErreur(): string | undefined {
    return this.derniereAide;
  }

  private enCours(): ChiffreAPoser[] {
    const nombre = this.nombreCourant;
    return this.chiffres.filter((chiffre) => chiffre.nombre === nombre && !chiffre.question.reussie);
  }

  private questionVisee(chiffre?: string, rangPose?: string): QuestionAPlacer {
    const candidates = this.enCours().map(({ question }) => question);
    const memeChiffre = candidates.filter((question) => chiffre === undefined || question.etiquette === chiffre);
    const question = memeChiffre.find((candidate) => candidate.groupe === rangPose) ?? memeChiffre[0];
    if (!question) throw new PasDeQuestionEnCours();
    return question;
  }
}

function questionsDuNombre(nombre: number, indice: number): ChiffreAPoser[] {
  const chiffres = String(nombre).split("");
  return chiffres.map((chiffre, position) => {
    const { rang, couleur } = RANGS[chiffres.length - 1 - position]!;
    const cle = CleDeQuestion.de("chiffre", `addition ${indice} ${nombre} ${rang}`);
    const aide = aideDuChiffre(nombre, chiffre, rang, couleur);
    return { nombre, question: new QuestionAPlacer(cle, "chiffre", chiffre, { groupe: rang, aide }) };
  });
}

function aideDuChiffre(nombre: number, chiffre: string, rang: Rang, couleur: Couleur): string {
  if (nombre < 10) {
    return `Le ${chiffre} est tout seul : c'est un chiffre des unités. Il va dans la maison ${couleur}, tout à droite.`;
  }
  return `Dans ${nombre}, le ${chiffre} est le chiffre des ${
    rang === "unites" ? "unités" : rang
  } : il va dans la maison ${couleur}.`;
}
