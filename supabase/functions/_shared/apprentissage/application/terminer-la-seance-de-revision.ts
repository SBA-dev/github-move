import { ParentNonRattache } from "../domain/erreurs.ts";
import { type FaitDeFileDeRevision, FileDeRevision } from "../domain/file-de-revision.ts";
import {
  questionsIntrouvablesDeLaSeanceDeRevision,
  revaliderLaSeanceDeRevision,
} from "../domain/revalider-la-seance-de-revision.ts";
import type { SeanceDeRevisionTerminee } from "../domain/seance-de-revision.ts";
import type { SeanceDeRevisionTermineeAEnregistrer } from "../domain/seance-de-revision-terminee-a-enregistrer.ts";
import type { FilesDeRevision } from "./ports/files-de-revision.ts";
import type { LeconsDuCatalogue } from "./ports/lecons-du-catalogue.ts";
import type { NiveauDuProfil } from "./ports/niveau-du-profil.ts";
import type { RattachementsDuParent } from "./ports/rattachements-du-parent.ts";
import type { SeancesDeRevisionTerminees } from "./ports/seances-de-revision-terminees.ts";

const ESSAIS_AU_PLUS = 3;

export class TerminerLaSeanceDeRevision {
  constructor(
    private readonly rattachements: RattachementsDuParent,
    private readonly lecons: LeconsDuCatalogue,
    private readonly niveaux: NiveauDuProfil,
    private readonly files: FilesDeRevision,
    private readonly seances: SeancesDeRevisionTerminees,
  ) {}

  async executer(
    { parent, seance }: { parent: string; seance: SeanceDeRevisionTermineeAEnregistrer },
  ): Promise<(SeanceDeRevisionTerminee | FaitDeFileDeRevision)[]> {
    if (!await this.rattachements.estRattache(parent, seance.enfant)) throw new ParentNonRattache();
    const lecons = await this.lecons.toutes();
    const niveau = await this.niveaux.de(seance.enfant);
    // Écriture optimiste : si la file a changé entre la lecture et l'écriture, on la relit et on y réapplique la séance.
    for (let essai = 1; essai <= ESSAIS_AU_PLUS; essai++) {
      const lue = await this.files.de(seance.enfant);
      const file = lue?.file ?? FileDeRevision.vide(seance.enfant);
      const fait = revaliderLaSeanceDeRevision(seance, file, lecons, niveau);
      questionsIntrouvablesDeLaSeanceDeRevision(seance, file, lecons, niveau).forEach((cle) => file.oublier(cle));
      file.enregistrerLaRevision(fait.resultats, fait.jour, fait.termineeLe);
      const issue = await this.seances.enregistrer(fait, { file, versionLue: lue?.version ?? 0 });
      if (issue === "dejaEnregistree") return [];
      if (issue === "enregistree") return [fait, ...file.retirerFaits()];
    }
    throw new Error("File de révision modifiée en continu : écriture abandonnée.");
  }
}
