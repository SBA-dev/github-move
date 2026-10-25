const NOMBRE_DE_REPONSES_OBSERVEES = 50;
const NOMBRE_DE_REPONSES_MINIMUM = 6;
const TAUX_DE_REUSSITE_MINIMUM = 0.6;
const FACILITE_NORMALE = 1;
const FACILITE_RENFORCEE = 0.65;

type Resultats = { readonly reussites: number; readonly erreurs: number };

export class AdaptationDeLaDifficulte {
  private constructor(readonly facilite: number) {}

  /** `historique` : séances de la plus récente à la plus ancienne. */
  static depuis(historique: readonly Resultats[]): AdaptationDeLaDifficulte {
    const { reussites, reponses } = retenirLesDernieresReponses(historique);
    const tropDErreurs = reponses >= NOMBRE_DE_REPONSES_MINIMUM &&
      reussites / reponses < TAUX_DE_REUSSITE_MINIMUM;
    return new AdaptationDeLaDifficulte(
      tropDErreurs ? FACILITE_RENFORCEE : FACILITE_NORMALE,
    );
  }
}

function retenirLesDernieresReponses(historique: readonly Resultats[]) {
  let reussites = 0;
  let reponses = 0;
  for (const seance of historique) {
    const total = seance.reussites + seance.erreurs;
    const restant = NOMBRE_DE_REPONSES_OBSERVEES - reponses;
    if (total <= restant) {
      reussites += seance.reussites;
      reponses += total;
    } else {
      reussites += Math.round(seance.reussites * restant / total);
      reponses += restant;
    }
    if (reponses >= NOMBRE_DE_REPONSES_OBSERVEES) break;
  }
  return { reussites, reponses };
}
