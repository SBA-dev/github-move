import type { ResultatDeLaLecon } from "../domain/resultat-de-la-lecon.ts";
import type { SeanceTerminee } from "../domain/seance.ts";
import type { ResultatsDesLeconsEnMemoire } from "./resultats-des-lecons-en-memoire.ts";

type Issue = "enregistree" | "dejaEnregistree" | "conflit";

/** Enregistre la séance et le résultat de la leçon d'un seul geste : tout ou rien. */
export class SeancesTermineesEnMemoire {
  private readonly seances = new Map<string, SeanceTerminee>();
  private echecAuProchainAppel = false;

  constructor(private readonly resultats: ResultatsDesLeconsEnMemoire) {}

  echouerAuProchainAppel(): void {
    this.echecAuProchainAppel = true;
  }

  enregistrerAvecLeResultat(
    fait: SeanceTerminee,
    resultat: ResultatDeLaLecon,
    nombreDeSeancesLu: number,
  ): Promise<Issue> {
    return Promise.resolve(this.enregistrerSansAttendre(fait, resultat, nombreDeSeancesLu));
  }

  private enregistrerSansAttendre(
    fait: SeanceTerminee,
    resultat: ResultatDeLaLecon,
    nombreDeSeancesLu: number,
  ): Issue {
    if (this.echecAuProchainAppel) {
      this.echecAuProchainAppel = false;
      throw new Error("écriture impossible");
    }
    if (this.seances.has(fait.seance)) return "dejaEnregistree";
    if (this.resultats.nombreDeSeances(fait.enfant, fait.lecon) !== nombreDeSeancesLu) return "conflit";
    this.seances.set(fait.seance, fait);
    this.resultats.ecrire(resultat);
    return "enregistree";
  }

  toutes(): SeanceTerminee[] {
    return [...this.seances.values()];
  }
}
