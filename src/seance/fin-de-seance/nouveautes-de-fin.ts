import type { Badge, Episode, ObjetDeLaCabane, TenueDuPersonnageGuide } from "@domain/motivation";

/** Ce que la séance a fait gagner, annoncé en fin de séance. */
export type NouveautesDeFin = {
  readonly objet: ObjetDeLaCabane | undefined;
  readonly tenue: TenueDuPersonnageGuide | undefined;
  readonly episode: Episode | undefined;
  readonly badge: Badge | undefined;
  /** La séance rend la leçon acquise pour la première fois. */
  readonly leconAcquise: boolean;
};
