import type { GenerateurId } from "../domain/generateur-id.ts";

export function generateurIdFixe(...identifiants: string[]): GenerateurId {
  let prochain = 0;
  return {
    suivant() {
      const identifiant = identifiants[prochain];
      if (identifiant === undefined) {
        throw new Error("Plus aucun identifiant fixé");
      }
      prochain += 1;
      return identifiant;
    },
  };
}
