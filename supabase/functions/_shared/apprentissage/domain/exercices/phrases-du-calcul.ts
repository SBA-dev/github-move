import type { Operation } from "../../../catalogue/domain/index.ts";

const POINTS_DE_SUSPENSION = "…";
const EST_UNE_OPERATION = /\d\s*[+−×:]\s*\d|…/;

const LECTURE_DES_SIGNES: readonly (readonly [RegExp, string])[] = [
  [/\s*\+\s*/, " plus "],
  [/\s*−\s*/, " moins "],
  [/\s*×\s*/, " fois "],
  [/ : /, " divisé par "],
  [/…/, "combien"],
];

function estUneOperation(question: string): boolean {
  return EST_UNE_OPERATION.test(question);
}

function estUnComplement(question: string): boolean {
  return question.includes(POINTS_DE_SUSPENSION);
}

export function phraseDuCalcul({ q }: Operation): string {
  if (!estUneOperation(q)) return `${q} : combien ?`;
  const lue = LECTURE_DES_SIGNES.reduce(
    (texte, [signe, lecture]) => texte.replace(signe, lecture),
    q,
  );
  return `Combien font ${lue} ?`;
}

export function carteDuCalcul(
  { q }: Operation,
  resultat?: number,
): string {
  const reussi = resultat !== undefined;
  if (!estUneOperation(q)) return reussi ? `${q} : ${resultat}` : `${q} ?`;
  if (estUnComplement(q)) {
    return reussi ? q.replace(POINTS_DE_SUSPENSION, String(resultat)) : q;
  }
  return `${q} = ${reussi ? resultat : "?"}`;
}
