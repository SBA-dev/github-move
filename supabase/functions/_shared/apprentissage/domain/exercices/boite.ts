import type { ItemDeBoite } from "../../../catalogue/domain/index.ts";

const QUESTION_DE_LA_BOITE =
  "La boîte est fermée. Combien y a-t-il de jetons dedans ? Réfléchis dans ta tête, avec tes doigts, ou en dessinant.";

export function deroulementDeLaBoite({ a, sens, b }: ItemDeBoite): readonly string[] {
  const suite = sens === "ajout" ? `Et j'en mets encore ${b}.` : `Maintenant, j'en retire ${b}.`;
  return [`Je mets ${jetons(a)} dans la boîte.`, suite, QUESTION_DE_LA_BOITE];
}

export function aideDeLaBoite({ a, sens, b }: ItemDeBoite): string {
  if (sens === "retrait") return `Pars de ${a} et recule de ${b}.`;
  return `Mets ${Math.max(a, b)} dans ta tête, et avance de ${Math.min(a, b)}.`;
}

export function ouvertureDeLaBoite({ reponse, ecriture }: ItemDeBoite): string {
  return `On ouvre la boîte pour vérifier… ${jetons(reponse)} ! ${ecriture}.`;
}

function jetons(nombre: number): string {
  return `${nombre} ${nombre < 2 ? "jeton" : "jetons"}`;
}
