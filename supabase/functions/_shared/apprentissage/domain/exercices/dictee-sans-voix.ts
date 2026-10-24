import type { Exercice } from "../../../catalogue/domain/index.ts";

export type EtatDeLaVoix = "muet" | "lectureImpossible" | "disponible";

export const LIBELLE_DU_BOUTON_ACTIVER_LE_SON = "Activer le son";

const MESSAGE_SON_COUPE = "Pour la dictée, j'ai besoin du son : active-le avec le bouton ci-dessous.";
const MESSAGE_SANS_VOIX =
  "Ce navigateur ne sait pas lire à voix haute : fais cette dictée avec un adulte, qui te dira les mots.";

export function messageDeLaDicteeSansVoix(etat: EtatDeLaVoix): string | undefined {
  switch (etat) {
    case "muet":
      return MESSAGE_SON_COUPE;
    case "lectureImpossible":
      return MESSAGE_SANS_VOIX;
    case "disponible":
      return undefined;
  }
}

export function exerciceDemandeLeSon(type: Exercice["type"]): boolean {
  return type === "dictee";
}
