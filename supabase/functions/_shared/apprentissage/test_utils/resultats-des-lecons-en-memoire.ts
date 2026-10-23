import type { ResultatsDesLecons } from "../application/ports/resultats-des-lecons.ts";
import { ResultatDeLaLecon } from "../domain/resultat-de-la-lecon.ts";

export class ResultatsDesLeconsEnMemoire implements ResultatsDesLecons {
  private readonly resultats = new Map<string, ResultatDeLaLecon>();

  de(enfant: string, lecon: string): Promise<ResultatDeLaLecon | null> {
    return Promise.resolve(this.resultats.get(`${enfant}/${lecon}`) ?? null);
  }

  enregistrer(resultat: ResultatDeLaLecon): Promise<void> {
    this.resultats.set(`${resultat.enfant}/${resultat.lecon}`, resultat);
    return Promise.resolve();
  }
}
