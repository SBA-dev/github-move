import type { QueteDuJour } from "./quete-du-jour.ts";

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
