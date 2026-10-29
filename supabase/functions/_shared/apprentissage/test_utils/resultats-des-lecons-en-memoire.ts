import type { NombreDEtoiles } from "../domain/etoiles.ts";
import { ResultatDeLaLecon } from "../domain/resultat-de-la-lecon.ts";

function copie(resultat: ResultatDeLaLecon): ResultatDeLaLecon {
  return ResultatDeLaLecon.reconstituer({
    enfant: resultat.enfant,
    lecon: resultat.lecon,
    competence: resultat.competence,
    meilleures: resultat.meilleures,
    dernieres: resultat.dernieres,
    nombreDeSeances: resultat.nombreDeSeances,
  });
}

/** Lecture seule côté cas d'usage : l'écriture passe par `SeancesTermineesEnMemoire`, avec la séance. */
export class ResultatsDesLeconsEnMemoire {
  private readonly resultats = new Map<string, ResultatDeLaLecon>();
  /** Nombre de lectures demandées au port, groupées ou à l'unité. */
  nombreDeLectures = 0;

  meilleuresEtoilesDe(enfant: string): Promise<Map<string, NombreDEtoiles>> {
    this.nombreDeLectures++;
    const meilleures = new Map<string, NombreDEtoiles>();
    for (const resultat of this.resultats.values()) {
      if (resultat.enfant === enfant && resultat.meilleures !== undefined) {
        meilleures.set(resultat.lecon, resultat.meilleures);
      }
    }
    return Promise.resolve(meilleures);
  }

  de(enfant: string, lecon: string): Promise<ResultatDeLaLecon | null> {
    this.nombreDeLectures++;
    const resultat = this.resultats.get(`${enfant}/${lecon}`);
    return Promise.resolve(resultat ? copie(resultat) : null);
  }

  /** Lecture synchrone : permet à l'écriture de la séance d'être atomique, comme la transaction qu'elle remplace. */
  nombreDeSeances(enfant: string, lecon: string): number {
    return this.resultats.get(`${enfant}/${lecon}`)?.nombreDeSeances ?? 0;
  }

  ecrire(resultat: ResultatDeLaLecon): void {
    this.resultats.set(`${resultat.enfant}/${resultat.lecon}`, copie(resultat));
  }
}
