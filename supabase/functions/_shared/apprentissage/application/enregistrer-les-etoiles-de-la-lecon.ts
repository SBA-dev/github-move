import { LeconIntrouvable } from "../domain/erreurs.ts";
import { type FaitDeResultat, ResultatDeLaLecon } from "../domain/resultat-de-la-lecon.ts";
import type { SeanceTerminee } from "../domain/seance.ts";
import type { LeconsDuCatalogue } from "./ports/lecons-du-catalogue.ts";
import type { ResultatsDesLecons } from "./ports/resultats-des-lecons.ts";

export class EnregistrerLesEtoilesDeLaLecon {
  constructor(
    private readonly lecons: LeconsDuCatalogue,
    private readonly resultats: ResultatsDesLecons,
  ) {}

  async executer(seance: SeanceTerminee): Promise<FaitDeResultat[]> {
    const lecon = await this.lecons.parId(seance.lecon);
    if (!lecon) throw new LeconIntrouvable(seance.lecon);
    const resultat = await this.resultats.de(seance.enfant, seance.lecon) ??
      ResultatDeLaLecon.commencer(seance.enfant, seance.lecon, lecon.competence ?? lecon.titre);
    resultat.enregistrerSeance(seance.etoiles);
    await this.resultats.enregistrer(resultat);
    return resultat.retirerFaits();
  }
}
