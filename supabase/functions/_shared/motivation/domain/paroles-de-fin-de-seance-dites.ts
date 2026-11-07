import type { Defi, GrandDefi } from "../../apprentissage/domain/index.ts";
import type { Hasard } from "./hasard.ts";
import { phraseDeFinAvecLaQuete, phraseDeFinAvecLaQueteSansPrenom } from "./paroles-de-la-quete.ts";
import { finDeSeanceApres, tirerLaFelicitationDeFinDeSeance } from "./paroles-de-seance.ts";
import { phraseDeFinAvecLesNouveautes } from "./paroles-des-badges.ts";
import { phraseDeFinAvecLeDefiOuvert, phraseDeFinAvecLeDefiOuvertSansPrenom } from "./paroles-du-defi.ts";
import type { PersonnageGuide } from "./personnage-guide.ts";

type NouveautesDeLaPhraseDeFin = Parameters<typeof phraseDeFinAvecLesNouveautes>[1];

export type FinDeSeanceDite = { readonly texte: string; readonly texteDit: string };

/** La fin de séance affichée avec le prénom et la même dite sans le prénom, avec une seule félicitation tirée. */
export function parolesDeFinDeSeanceAvecTexteDit(
  { etoiles, prenom, personnageGuide, hasard, nouveautes = {}, queteAccomplie = false, defiOuvert }: {
    etoiles: number;
    prenom: string;
    personnageGuide: PersonnageGuide;
    hasard: Hasard;
    nouveautes?: NouveautesDeLaPhraseDeFin;
    queteAccomplie?: boolean;
    defiOuvert?: Defi | GrandDefi;
  },
): FinDeSeanceDite {
  const felicitation = tirerLaFelicitationDeFinDeSeance(etoiles, personnageGuide, hasard);
  const avecNouveautes = (parole: string) => phraseDeFinAvecLesNouveautes(parole, nouveautes);
  const texte = phraseDeFinAvecLeDefiOuvert(
    phraseDeFinAvecLaQuete(avecNouveautes(finDeSeanceApres(etoiles, felicitation, prenom)), prenom, queteAccomplie),
    prenom,
    defiOuvert,
  );
  const texteDit = phraseDeFinAvecLeDefiOuvertSansPrenom(
    phraseDeFinAvecLaQueteSansPrenom(avecNouveautes(finDeSeanceApres(etoiles, felicitation)), queteAccomplie),
    defiOuvert,
  );
  return { texte, texteDit };
}
