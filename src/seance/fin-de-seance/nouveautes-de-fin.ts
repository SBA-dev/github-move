import type { Defi, GrandDefi } from "@domain/apprentissage";
import type { EffetSonore } from "@domain/voix";
import type { Badge, Episode, ObjetDeLaCabane, TenueDuPersonnageGuide } from "@domain/motivation";

/** Ce que la séance a fait gagner, annoncé en fin de séance. */
export type NouveautesDeFin = {
  readonly objet: ObjetDeLaCabane | undefined;
  readonly tenue: TenueDuPersonnageGuide | undefined;
  readonly episode: Episode | undefined;
  readonly badge: Badge | undefined;
  /** Le défi que la séance ouvre : le personnage guide le propose après sa phrase de fin. */
  readonly defiOuvert: Defi | GrandDefi | undefined;
  /** La séance rend la leçon acquise pour la première fois. */
  readonly leconAcquise: boolean;
  /** La séance accomplit la quête du jour : la fête est dite après la phrase de fin. */
  readonly queteAccomplie: boolean;
  /** La musique de la célébration de l'univers, qui remplace le son de la fin ; `undefined` avec la célébration commune. */
  readonly musiqueDeLaCelebration: EffetSonore | undefined;
};
