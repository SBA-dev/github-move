import { IntervalleDeRevisionInvalide } from "./erreurs.ts";

const INTERVALLES_EN_JOURS = [1, 3, 7];

export type ApresUneRevisionJuste =
  | { corrigeePourDeBon: false; intervalle: IntervalleDeRevision }
  | { corrigeePourDeBon: true };

export class IntervalleDeRevision {
  private constructor(readonly jours: number) {}

  static premier(): IntervalleDeRevision {
    return new IntervalleDeRevision(INTERVALLES_EN_JOURS[0]);
  }

  static de(jours: number): IntervalleDeRevision {
    if (!INTERVALLES_EN_JOURS.includes(jours)) throw new IntervalleDeRevisionInvalide(jours);
    return new IntervalleDeRevision(jours);
  }

  suivant(): ApresUneRevisionJuste {
    const jourSuivant = INTERVALLES_EN_JOURS[INTERVALLES_EN_JOURS.indexOf(this.jours) + 1];
    if (jourSuivant === undefined) return { corrigeePourDeBon: true };
    return { corrigeePourDeBon: false, intervalle: new IntervalleDeRevision(jourSuivant) };
  }
}
