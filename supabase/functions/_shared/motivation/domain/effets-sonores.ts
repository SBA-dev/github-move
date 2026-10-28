import type { EffetSonore } from "../../voix/domain/index.ts";

export interface BonneReponse {
  readonly questionsReussiesAvant: number;
  readonly questionsReussiesApres: number;
  readonly exerciceComplete: boolean;
  readonly pendantLeChronoDUneFluence: boolean;
}

export function effetsSonoresApresUneBonneReponse(reponse: BonneReponse): readonly EffetSonore[] {
  const effetDeLaReponse: EffetSonore = reponse.exerciceComplete ? "texteComplet" : "reponseJuste";
  const pointGagne = reponse.questionsReussiesApres > reponse.questionsReussiesAvant;
  if (pointGagne && !reponse.pendantLeChronoDUneFluence) {
    return [effetDeLaReponse, "pointDuRecipient"];
  }
  return [effetDeLaReponse];
}
