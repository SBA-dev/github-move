import type { CleDeQuestion } from "./cle-de-question.ts";
import type { TypeDExerciceAChoix } from "./exercices/phrases-des-exercices-a-choix.ts";
import type { ReponseDonnee } from "./reponse.ts";

export type TypeDeQuestion = TypeDExerciceAChoix | "classer" | "ordre" | "calcul" | "fluence";

export interface QuestionSuivie {
  readonly cle: CleDeQuestion;
  readonly type: TypeDeQuestion;
  readonly erreurs: number;
  readonly reussie: boolean;
  readonly bonneReponseMontree: boolean;
  reponses(): ReponseDonnee[];
}
