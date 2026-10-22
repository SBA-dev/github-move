export type Humeur = "content" | "reflechit" | "applaudit";

export const HUMEUR_PAR_DEFAUT: Humeur = "content";

export function humeurApresReponse(juste: boolean): Humeur {
  return juste ? "applaudit" : "reflechit";
}
