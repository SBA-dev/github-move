import type { ExerciceClasser } from "../../catalogue/domain/index.ts";
import { CleDeQuestion } from "./cle-de-question.ts";
import { type Addition, enonceDUneAddition } from "./tirage-d-additions.ts";

/** Une seule formule de clé par type de question, partagée par la séance et par la révision. */

export function cleDUneQuestionALire(
  type: "bulles" | "lecture",
  { question, reponse }: Readonly<{ question: string; reponse: string }>,
): CleDeQuestion {
  return CleDeQuestion.de(type, question + reponse);
}

export function cleDeLEcoute({ dire }: Readonly<{ dire: string }>): CleDeQuestion {
  return CleDeQuestion.de("ecoute", dire);
}

export function cleDuTrou(enonce: string): CleDeQuestion {
  return CleDeQuestion.de("trous", enonce);
}

export function cleDeLaConjugaison(
  { verbe, temps }: Readonly<{ verbe: string; temps: string }>,
  pronom: string,
): string {
  return `${verbe} · ${temps} · ${pronom}`;
}

export function cleDuCalcul(enonce: string): CleDeQuestion {
  return CleDeQuestion.de("calcul", enonce);
}

export function cleDeLAddition(addition: Addition): CleDeQuestion {
  return cleDuCalcul(enonceDUneAddition(addition));
}

export function cleDesBarres({ enonce }: Readonly<{ enonce: string }>): CleDeQuestion {
  return CleDeQuestion.de("barres", enonce);
}

export function cleDeLaDictee({ mot }: Readonly<{ mot: string }>): CleDeQuestion {
  return CleDeQuestion.de("dictee", mot);
}

export function cleDuClasser(
  { groupes }: Pick<ExerciceClasser, "groupes">,
  { texte }: Readonly<{ texte: string }>,
): CleDeQuestion {
  return CleDeQuestion.de("classer", texte + groupes.map((groupe) => groupe.nom).join());
}
