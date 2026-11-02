import { ParentNonRattache } from "../domain/erreurs.ts";
import { type FaitDeFileDeRevision, FileDeRevision } from "../domain/file-de-revision.ts";
import { revaliderLaSeanceDeRevision } from "../domain/revalider-la-seance-de-revision.ts";
import type { SeanceDeRevisionTerminee } from "../domain/seance-de-revision.ts";
import type { SeanceDeRevisionTermineeAEnregistrer } from "../domain/seance-de-revision-terminee-a-enregistrer.ts";
import { reessayerSurConflit } from "./reessayer-sur-conflit.ts";
import type { FilesDeRevision } from "./ports/files-de-revision.ts";
import type { LeconsDuCatalogue } from "./ports/lecons-du-catalogue.ts";
import type { NiveauDuProfil } from "./ports/niveau-du-profil.ts";
import type { RattachementsDuParent } from "./ports/rattachements-du-parent.ts";
import type { SeancesDeRevisionTerminees } from "./ports/seances-de-revision-terminees.ts";

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
    // Si la file a changé entre la lecture et l'écriture, on la relit et on y réapplique la séance.
    const { issue, valeur: faits } = await reessayerSurConflit(async () => {
      const lue = await this.files.de(seance.enfant);
      const file = lue?.file ?? FileDeRevision.vide(seance.enfant);
      const { fait, questionsIntrouvables } = revaliderLaSeanceDeRevision(seance, file, lecons, niveau);
      questionsIntrouvables.forEach((cle) => file.oublier(cle));
      file.enregistrerLaRevision(fait.resultats, fait.jour, fait.termineeLe);
      const issue = await this.seances.enregistrer(fait, { file, versionLue: lue?.version ?? 0 });
      return { issue, valeur: [fait, ...file.retirerFaits()] };
    }, "File de révision modifiée en continu : écriture abandonnée.");
    return issue === "enregistree" ? faits : [];
  }
}
