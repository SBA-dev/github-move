import type { FormeDeSchema, ProblemeEnBarres } from "../../../catalogue/domain/index.ts";

export function explicationDuSchema(): string {
  return "Regarde le schéma : le point d'interrogation, c'est ce qu'on cherche.";
}

export function aideDesBarres({ aide, forme }: ProblemeEnBarres): string {
  return aide ?? aideParDefaut(forme);
}

export function explicationDeLaReponseEnBarres({ ecriture, phrase, reponse }: ProblemeEnBarres): string {
  const calcul = `${ecriture}.`;
  return phrase === undefined ? calcul : `${calcul} ${phrase.replaceAll("{r}", String(reponse))}`;
}

function aideParDefaut(forme: FormeDeSchema): string {
  switch (forme.genre) {
    case "partiesEtTout":
      return "Regarde le schéma : cherches-tu le tout, ou une partie ?";
    case "comparaison":
      return "Regarde le schéma : cherches-tu la grande barre, la petite, ou l'écart entre les deux ?";
    case "parts":
      return "Regarde le schéma : cherches-tu le total, la valeur d'une part, ou le nombre de parts ?";
  }
}
