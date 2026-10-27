import type { Badge, Episode, ObjetDeLaCabane } from "@domain/motivation";

/** Ce que la séance a fait gagner, annoncé en fin de séance. */
export type NouveautesDeFin = {
  readonly objet: ObjetDeLaCabane | undefined;
  readonly episode: Episode | undefined;
  readonly badge: Badge | undefined;
};
