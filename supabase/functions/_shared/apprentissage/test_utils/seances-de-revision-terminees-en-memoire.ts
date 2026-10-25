import type { FileDeRevision } from "../domain/file-de-revision.ts";
import type { SeanceDeRevisionTerminee } from "../domain/seance-de-revision.ts";
import type { FilesDeRevisionEnMemoire } from "./files-de-revision-en-memoire.ts";

type Issue = "enregistree" | "dejaEnregistree" | "conflit";

/** Enregistre la séance de révision et la file d'un seul geste : tout ou rien. */
export class SeancesDeRevisionTermineesEnMemoire {
  private readonly seances = new Map<string, SeanceDeRevisionTerminee>();
  private echecAuProchainAppel = false;

  constructor(private readonly files: FilesDeRevisionEnMemoire) {}

  echouerAuProchainAppel(): void {
    this.echecAuProchainAppel = true;
  }

  enregistrer(
    fait: SeanceDeRevisionTerminee,
    { file, versionLue }: { readonly file: FileDeRevision; readonly versionLue: number },
  ): Promise<Issue> {
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
