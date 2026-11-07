import type { Hasard } from "@domain/motivation";

export const hasardDuNavigateur: Hasard = {
  entre0et1: () => Math.random(),
};

/** Un hasard qui garde ses tirages pour les rejouer : le texte affiché et le texte dit se composent avec les mêmes tirages. */
export function hasardRejouable(source: Hasard): { readonly tirage: Hasard; readonly rejouer: () => Hasard } {
  const tirages: number[] = [];
  return {
    tirage: {
      entre0et1: () => {
        const valeur = source.entre0et1();
        tirages.push(valeur);
        return valeur;
      },
    },
    rejouer: () => {
      let rang = 0;
      return { entre0et1: () => tirages[rang++] ?? source.entre0et1() };
    },
  };
}
