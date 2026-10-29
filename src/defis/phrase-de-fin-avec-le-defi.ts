import { type Defi } from "@domain/apprentissage";
import { inviterARelever } from "@domain/motivation";

/** Le personnage guide propose le défi ouvert après sa phrase de fin ; il ne le lance pas. */
export function phraseDeFinAvecLeDefi(phraseDeFin: string, prenom: string, defi: Defi | undefined): string {
  return defi ? `${phraseDeFin} ${inviterARelever({ prenom, numeroDuDefi: defi.numero })}` : phraseDeFin;
}
