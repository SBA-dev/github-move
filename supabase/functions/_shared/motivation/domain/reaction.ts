import type { Hasard } from "./hasard.ts";
import { type Humeur, humeurApresReponse } from "./humeur.ts";
import { direJeNeSaisPasAvecLesChoix, direJeNeSaisPasEnDictee, encourager, feliciter } from "./paroles.ts";
import type { PersonnageGuide } from "./personnage-guide.ts";

export type Parole = {
  readonly nature: "felicitation" | "encouragement";
  readonly texte: string;
};

export type Reaction = { readonly humeur: Humeur; readonly parole: Parole };

export function reagirALaReponse(
  juste: boolean,
  personnageGuide: PersonnageGuide,
  hasard: Hasard,
): Reaction {
  const parole: Parole = juste
    ? { nature: "felicitation", texte: feliciter(personnageGuide, hasard).texte }
    : { nature: "encouragement", texte: encourager(hasard).texte };
  return { humeur: humeurApresReponse(juste), parole };
}

export type ReactionAJeNeSaisPas = { readonly humeur: Humeur; readonly parole: string };

export function reagirAJeNeSaisPas(aide: string | undefined): ReactionAJeNeSaisPas {
  return { humeur: "reflechit", parole: direJeNeSaisPasAvecLesChoix(aide) };
}

export function reagirAJeNeSaisPasEnDictee(maniere: "briller" | "ecrire"): ReactionAJeNeSaisPas {
  return { humeur: "reflechit", parole: direJeNeSaisPasEnDictee(maniere) };
}
