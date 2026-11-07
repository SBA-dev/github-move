import type { QueteDuJour } from "./quete-du-jour.ts";
import { vocatif } from "./vocatif.ts";

export function propositionDeLaQueteDuJour(quete: QueteDuJour): string | undefined {
  switch (quete.genre) {
    case "revision":
      return `Ta quête du jour : réviser ${petitesErreurs(quete.nombreDeQuestionsDues)} des jours passés. On y va ?`;
    case "lecon":
      return `Ta quête du jour : la leçon « ${quete.titre} ». On y va ?`;
    case "accomplie":
      return "Ta quête du jour est accomplie.";
    case "aucune":
    case "sansQuete":
      return undefined;
  }
}

function petitesErreurs(nombre: number): string {
  return nombre > 1 ? `${nombre} petites erreurs` : `${nombre} petite erreur`;
}

function fete(prenom?: string): string {
  return `Quête du jour accomplie ! Bravo${vocatif(prenom)} !`;
}

export function feteDeLaQueteAccomplie(prenom: string): string {
  return fete(prenom);
}

export function feteDeLaQueteAccomplieSansPrenom(): string {
  return fete();
}

export function reponseAuRefusDeLaQuete(): string {
  return "D'accord, choisis ce qui te fait envie !";
}

export function phraseDeFinAvecLaQuete(phraseDeFin: string, prenom: string, queteAccomplie: boolean): string {
  return queteAccomplie ? `${phraseDeFin} ${feteDeLaQueteAccomplie(prenom)}` : phraseDeFin;
}

export function phraseDeFinAvecLaQueteSansPrenom(phraseDeFin: string, queteAccomplie: boolean): string {
  return queteAccomplie ? `${phraseDeFin} ${feteDeLaQueteAccomplieSansPrenom()}` : phraseDeFin;
}

export function paroleDeLaQueteALAccueil(quete: QueteDuJour, queteRefusee: boolean): string | undefined {
  return queteRefusee && quete.genre !== "accomplie" ? undefined : propositionDeLaQueteDuJour(quete);
}
