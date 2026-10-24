import type { Operation } from "../../catalogue/domain/index.ts";

const ASTUCES_PAR_SIGNE: readonly (readonly [RegExp, string])[] = [
  [/\+/, "Pars du plus grand nombre, et avance du plus petit."],
  [/[−-]/, "Pars du plus petit et compte jusqu'au plus grand, ou recule."],
  [/×/, "Pense à la table, ou ajoute le même nombre plusieurs fois."],
  [
    /:/,
    "Cherche dans la table : combien de fois le second nombre tient-il dans le premier ?",
  ],
];

export function aideApresUneErreurDeCalcul(
  operation: Operation,
): string | undefined {
  return operation.aide ?? astuceDuPremierSigne(operation.q);
}

function astuceDuPremierSigne(question: string): string | undefined {
  for (const caractere of question) {
    const astuce = ASTUCES_PAR_SIGNE.find(([signe]) => signe.test(caractere));
    if (astuce) return astuce[1];
  }
  return undefined;
}
