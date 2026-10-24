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

/** La description du schéma une fois la valeur cherchée trouvée : elle prend la place du « ? ». */
export function descriptionDuSchemaResolu(forme: FormeDeSchema, reponse: number): string {
  return descriptionDuSchema(avecLaValeurTrouvee(forme, reponse));
}

function avecLaValeurTrouvee(forme: FormeDeSchema, reponse: number): FormeDeSchema {
  const trouvee = (valeur: number | null) => valeur ?? reponse;
  switch (forme.genre) {
    case "partiesEtTout": {
      const [partie, autrePartie] = forme.parties;
      return { ...forme, parties: [trouvee(partie), trouvee(autrePartie)], tout: trouvee(forme.tout) };
    }
    case "comparaison":
      return { ...forme, grand: trouvee(forme.grand), petit: trouvee(forme.petit), ecart: trouvee(forme.ecart) };
    case "parts":
      return { ...forme, nb: trouvee(forme.nb), valeur: trouvee(forme.valeur), total: trouvee(forme.total) };
  }
}

function lu(valeur: number | null): string {
  return valeur === null ? "?" : String(valeur);
}
