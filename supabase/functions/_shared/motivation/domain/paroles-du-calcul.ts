import type { EffetSonore } from "../../voix/domain/index.ts";
import type { Hasard } from "./hasard.ts";
import type { Humeur } from "./humeur.ts";
import { direJeNeSaisPasAuClavierDeCristaux } from "./paroles.ts";
import type { PersonnageGuide } from "./personnage-guide.ts";
import { reagirAJeNeSaisPas, reagirALaReponse } from "./reaction.ts";

export type ParoleDeCalcul = {
  readonly texte: string;
  readonly nature: "encouragement" | "felicitation" | "aide";
  readonly humeur: Humeur;
  readonly effetsAvant?: readonly EffetSonore[];
};

function avecEffetsAvant(effetsAvant: readonly EffetSonore[] | undefined): Pick<ParoleDeCalcul, "effetsAvant"> {
  return effetsAvant ? { effetsAvant } : {};
}

/** Après une erreur de calcul : un encouragement, puis l'aide de l'opération (ou de la colonne) quand il y en a une. */
export function encouragerApresUneErreurDeCalcul(
  personnageGuide: PersonnageGuide,
  aide: string | undefined,
  hasard: Hasard,
): ParoleDeCalcul {
  const { humeur, parole, effetSonore } = reagirALaReponse(false, personnageGuide, hasard);
  const texte = aide === undefined ? parole.texte : `${parole.texte} ${aide}`;
  return { texte, nature: "encouragement", humeur, effetsAvant: [effetSonore] };
}

export function feliciterUnCalcul(
  personnageGuide: PersonnageGuide,
  hasard: Hasard,
  suite?: string,
  effetsAvant?: readonly EffetSonore[],
): ParoleDeCalcul {
  const { humeur, parole } = reagirALaReponse(true, personnageGuide, hasard);
  const texte = suite === undefined ? parole.texte : `${suite} ${parole.texte}`;
  return { texte, nature: "felicitation", humeur, ...avecEffetsAvant(effetsAvant) };
}

/** Une félicitation, puis l'explication de la réponse (le problème en barres). */
export function feliciterPuisExpliquer(
  personnageGuide: PersonnageGuide,
  explication: string,
  hasard: Hasard,
  effetsAvant?: readonly EffetSonore[],
): ParoleDeCalcul {
  const { humeur, parole } = reagirALaReponse(true, personnageGuide, hasard);
  return { texte: `${parole.texte} ${explication}`, nature: "felicitation", humeur, ...avecEffetsAvant(effetsAvant) };
}

/** « Je ne sais pas » : avec les choix, la bonne réponse brille ; au clavier de cristaux, le personnage guide la dit. */
export function aiderQuandOnNeSaitPas(
  calcul: { readonly mode: { readonly genre: "choix" | "clavierDeCristaux" } },
  aide: string | undefined,
  bonneReponse: string,
): ParoleDeCalcul {
  const { humeur, parole } = reagirAJeNeSaisPas(aide);
  const texte = calcul.mode.genre === "choix" ? parole : direJeNeSaisPasAuClavierDeCristaux(bonneReponse, aide);
  return { texte, nature: "aide", humeur };
}
