import type { SeancesDeRevisionTerminees } from "../application/ports/seances-de-revision-terminees.ts";
import type { FileDeRevisionALEcrire, IssueDeLEnregistrement } from "../application/ports/seances-terminees.ts";
import type { SeanceDeRevisionTerminee } from "../domain/seance-de-revision.ts";
import type { FilesDeRevisionEnMemoire } from "./files-de-revision-en-memoire.ts";

/** Enregistre la séance de révision et la file d'un seul geste : tout ou rien. */
export class SeancesDeRevisionTermineesEnMemoire implements SeancesDeRevisionTerminees {
  private readonly seances = new Map<string, SeanceDeRevisionTerminee>();
  private echecAuProchainAppel = false;

  constructor(private readonly files: FilesDeRevisionEnMemoire) {}

  echouerAuProchainAppel(): void {
    this.echecAuProchainAppel = true;
  }

  enregistrer(
    fait: SeanceDeRevisionTerminee,
    { file, versionLue }: FileDeRevisionALEcrire,
  ): Promise<IssueDeLEnregistrement> {
    if (this.echecAuProchainAppel) {
      this.echecAuProchainAppel = false;
      return Promise.reject(new Error("écriture impossible"));
    }
    if (this.seances.has(fait.id)) return Promise.resolve("dejaEnregistree");
    if (this.files.version(file.enfant) !== versionLue) return Promise.resolve("conflit");
    this.seances.set(fait.id, fait);
    this.files.ecrire(file);
    return Promise.resolve("enregistree");
  }

  toutes(): SeanceDeRevisionTerminee[] {
    return [...this.seances.values()];
  }
}
