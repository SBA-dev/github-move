import type { CalculEnCours } from "@domain/apprentissage";
import {
  direJeNeSaisPasAuClavierDeCristaux,
  type PersonnageGuide,
  reagirAJeNeSaisPas,
  reagirALaReponse,
} from "@domain/motivation";
import { hasardDuNavigateur } from "../../hasard-navigateur.ts";
import type { ParoleADire } from "../usePersonnageQuiParle.ts";

/** Après une erreur de calcul : un encouragement, puis l'aide de l'opération (ou de la colonne) quand il y en a une. */
export function encouragerApresUneErreurDeCalcul(personnageGuide: PersonnageGuide, aide: string | undefined): ParoleADire {
  const { humeur, parole } = reagirALaReponse(false, personnageGuide, hasardDuNavigateur);
  const texte = aide === undefined ? parole.texte : `${parole.texte} ${aide}`;
  return { texte, nature: "encouragement", humeur };
}

export function feliciterUnCalcul(personnageGuide: PersonnageGuide, suite?: string): ParoleADire {
  const { humeur, parole } = reagirALaReponse(true, personnageGuide, hasardDuNavigateur);
  const texte = suite === undefined ? parole.texte : `${suite} ${parole.texte}`;
  return { texte, nature: "felicitation", humeur };
}

/** « Je ne sais pas » : avec les choix, la bonne réponse brille ; au clavier de cristaux, le personnage guide la dit. */
export function aiderQuandOnNeSaitPas(calcul: CalculEnCours, aide: string | undefined, bonneReponse: string): ParoleADire {
  const { humeur, parole } = reagirAJeNeSaisPas(aide);
  const texte = calcul.mode.genre === "choix" ? parole : direJeNeSaisPasAuClavierDeCristaux(bonneReponse, aide);
  return { texte, nature: "aide", humeur };
}
