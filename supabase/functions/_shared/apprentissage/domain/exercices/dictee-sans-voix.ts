import type { Exercice } from "../../../catalogue/domain/index.ts";
import type { QuestionDeDictee } from "../question-de-dictee.ts";
import { textesDitsPendantLaDictee } from "../textes-dits-pendant-la-dictee.ts";

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

export function etatDeLaVoixPourLaDictee(
  question: QuestionDeDictee,
  voix: {
    readonly son: "son" | "muet";
    readonly peutDire: (textes: readonly string[], allure: "normale" | "lente") => boolean;
  },
): EtatDeLaVoix {
  const textes = textesDitsPendantLaDictee(question);
  if (!voix.peutDire(textes.normale, "normale") || !voix.peutDire(textes.lente, "lente")) return "lectureImpossible";
  return voix.son === "muet" ? "muet" : "disponible";
}
