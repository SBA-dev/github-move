import type { FormeDeSchema } from "../../catalogue/domain/index.ts";

export function descriptionDuSchema(forme: FormeDeSchema): string {
  switch (forme.genre) {
    case "partiesEtTout": {
      const [partie, autrePartie] = forme.parties;
      return `Le tout : ${lu(forme.tout)}. Une partie : ${lu(partie)}. L'autre partie : ${lu(autrePartie)}.`;
    }
    case "comparaison": {
      const [grand, petit] = forme.noms;
      return `${grand} : ${lu(forme.grand)}. ${petit} : ${lu(forme.petit)}. L'écart : ${lu(forme.ecart)}.`;
    }
    case "parts": {
      const parts = forme.nb === null ? "Nombre de parts : ?" : `${forme.nb} parts`;
      return `Le total : ${lu(forme.total)}. ${parts}. Chaque part : ${lu(forme.valeur)}.`;
    }
  }
}

function lu(valeur: number | null): string {
  return valeur === null ? "?" : String(valeur);
}
