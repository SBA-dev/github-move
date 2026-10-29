import { feteDeLaQueteAccomplie } from "@domain/motivation";

/** La phrase de fin du personnage guide, suivie de la fête de la quête du jour quand la séance l'a accomplie. */
export function phraseDeFinAvecLaQuete(phraseDeFin: string, prenom: string, queteAccomplie: boolean | undefined): string {
  return queteAccomplie ? `${phraseDeFin} ${feteDeLaQueteAccomplie(prenom)}` : phraseDeFin;
}
