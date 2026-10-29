import type { Lecon } from "../../catalogue/domain/index.ts";
import { ParentNonRattache } from "../domain/erreurs.ts";
import type { DefiTermineAEnregistrer } from "../domain/defi-termine-a-enregistrer.ts";
import { Etoiles } from "../domain/etoiles.ts";
import { FileDeRevision } from "../domain/file-de-revision.ts";
import type { EntreesDuParcours } from "../domain/parcours.ts";
import { revaliderLeDefi } from "../domain/revalider-le-defi.ts";
import type { DefiTermine } from "../domain/seance-de-defi.ts";
import { reessayerSurConflit } from "./reessayer-sur-conflit.ts";
import type { DefisTermines } from "./ports/defis-termines.ts";
import type { FilesDeRevision } from "./ports/files-de-revision.ts";
import type { LeconsDuCatalogue } from "./ports/lecons-du-catalogue.ts";
import type { NiveauDuProfil } from "./ports/niveau-du-profil.ts";
import type { RattachementsDuParent } from "./ports/rattachements-du-parent.ts";
import type { ResultatsDesLecons } from "./ports/resultats-des-lecons.ts";
import type { ResultatsDesTestsDeDepart } from "./ports/resultats-des-tests-de-depart.ts";

export class TerminerLeDefi {
  constructor(
    private readonly rattachements: RattachementsDuParent,
    private readonly lecons: LeconsDuCatalogue,
    private readonly niveaux: NiveauDuProfil,
    private readonly resultats: ResultatsDesLecons,
    private readonly testsDeDepart: ResultatsDesTestsDeDepart,
    private readonly files: FilesDeRevision,
    private readonly defis: DefisTermines,
  ) {}

  async executer(
    { parent, defi }: { parent: string; defi: DefiTermineAEnregistrer },
  ): Promise<DefiTermine[]> {
    if (!await this.rattachements.estRattache(parent, defi.enfant)) throw new ParentNonRattache();
    const entrees = await this.entreesDuParcours(defi.enfant);
    const releves = await this.defis.releves(defi.enfant);
    const fait = revaliderLeDefi(defi, entrees, releves);
    const issue = await reessayerSurConflit(async () => {
      const lue = await this.files.de(defi.enfant);
      const file = lue?.file ?? FileDeRevision.vide(defi.enfant);
      file.retenir(fait.questionsRatees, fait.jour, fait.termineeLe);
      return this.defis.enregistrer(fait, { file, versionLue: lue?.version ?? 0 });
    }, "File de révision modifiée en continu : écriture abandonnée.");
    return issue === "enregistree" ? [fait] : [];
  }

  private async entreesDuParcours(enfant: string): Promise<EntreesDuParcours> {
    const lecons = await this.lecons.toutes();
    const niveau = await this.niveaux.de(enfant);
    const testDeDepart = await this.testsDeDepart.de(enfant);
    return {
      lecons,
      niveau,
      meilleuresEtoiles: await this.meilleuresEtoiles(enfant, lecons),
      leconsReussiesAuTestDeDepart: testDeDepart?.leconsReussies,
    };
  }

  private async meilleuresEtoiles(enfant: string, lecons: readonly Lecon[]): Promise<Map<string, Etoiles>> {
    const meilleures = new Map<string, Etoiles>();
    for (const { id } of lecons) {
      const nombre = (await this.resultats.de(enfant, id))?.meilleures;
      if (nombre !== undefined) meilleures.set(id, Etoiles.de(nombre));
    }
    return meilleures;
  }
}
