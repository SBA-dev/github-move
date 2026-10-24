import { LeconIntrouvable, ParentNonRattache } from "../domain/erreurs.ts";
import { type FaitDeResultat, ResultatDeLaLecon } from "../domain/resultat-de-la-lecon.ts";
import { revaliderLaSeance } from "../domain/revalider-la-seance.ts";
import type { SeanceTerminee } from "../domain/seance.ts";
import type { SeanceTermineeAEnregistrer } from "../domain/seance-terminee-a-enregistrer.ts";
import type { LeconsDuCatalogue } from "./ports/lecons-du-catalogue.ts";
import type { RattachementsDuParent } from "./ports/rattachements-du-parent.ts";
import type { ResultatsDesLecons } from "./ports/resultats-des-lecons.ts";
import type { SeancesTerminees } from "./ports/seances-terminees.ts";

const ESSAIS_AU_PLUS = 3;

export class TerminerLaSeance {
  constructor(
    private readonly rattachements: RattachementsDuParent,
    private readonly lecons: LeconsDuCatalogue,
    private readonly seances: SeancesTerminees,
    private readonly resultats: ResultatsDesLecons,
  ) {}

  async executer(
    { parent, seance }: { parent: string; seance: SeanceTermineeAEnregistrer },
  ): Promise<(SeanceTerminee | FaitDeResultat)[]> {
    if (!await this.rattachements.estRattache(parent, seance.enfant)) throw new ParentNonRattache();
    const lecon = await this.lecons.parId(seance.lecon);
    if (!lecon) throw new LeconIntrouvable(seance.lecon);

    const fait = revaliderLaSeance(lecon, seance);
    // Écriture optimiste : si une autre séance de la même leçon est passée entre la lecture et l'écriture,
    // on relit le résultat et on y fait avancer cette séance : aucune séance n'est perdue.
    for (let essai = 1; essai <= ESSAIS_AU_PLUS; essai++) {
      const resultat = await this.resultats.de(fait.enfant, fait.lecon) ??
        ResultatDeLaLecon.commencer(fait.enfant, fait.lecon, lecon.competence);
      const nombreDeSeancesLu = resultat.nombreDeSeances;
      resultat.enregistrerSeance(fait.etoiles);
      const issue = await this.seances.enregistrerAvecLeResultat(fait, resultat, nombreDeSeancesLu);
      if (issue === "dejaEnregistree") return [];
      if (issue === "enregistree") return [fait, ...resultat.retirerFaits()];
    }
    throw new Error("Résultat de la leçon modifié en continu : écriture abandonnée.");
  }
}
