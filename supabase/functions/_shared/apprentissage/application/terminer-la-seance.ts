import { LeconIntrouvable, ParentNonRattache } from "../domain/erreurs.ts";
import type { FaitDeResultat } from "../domain/resultat-de-la-lecon.ts";
import { revaliderLaSeance } from "../domain/revalider-la-seance.ts";
import type { SeanceTerminee } from "../domain/seance.ts";
import type { SeanceTermineeAEnregistrer } from "../domain/seance-terminee-a-enregistrer.ts";
import type { EnregistrerLesEtoilesDeLaLecon } from "./enregistrer-les-etoiles-de-la-lecon.ts";
import type { LeconsDuCatalogue } from "./ports/lecons-du-catalogue.ts";
import type { RattachementsDuParent } from "./ports/rattachements-du-parent.ts";
import type { SeancesTerminees } from "./ports/seances-terminees.ts";

export class TerminerLaSeance {
  constructor(
    private readonly rattachements: RattachementsDuParent,
    private readonly lecons: LeconsDuCatalogue,
    private readonly seances: SeancesTerminees,
    private readonly enregistrerLesEtoiles: EnregistrerLesEtoilesDeLaLecon,
  ) {}

  async executer(
    { parent, seance }: { parent: string; seance: SeanceTermineeAEnregistrer },
  ): Promise<(SeanceTerminee | FaitDeResultat)[]> {
    if (!await this.rattachements.estRattache(parent, seance.enfant)) throw new ParentNonRattache();
    const lecon = await this.lecons.parId(seance.lecon);
    if (!lecon) throw new LeconIntrouvable(seance.lecon);

    const fait = revaliderLaSeance(lecon, seance);
    if (!await this.seances.enregistrer(fait)) return [];
    return [fait, ...await this.enregistrerLesEtoiles.executer(fait)];
  }
}
