import type { DefisTermines } from "../application/ports/defis-termines.ts";
import type { FileDeRevisionALEcrire, IssueDeLEnregistrement } from "../application/ports/seances-terminees.ts";
import type { DefiReleve } from "../domain/defis-de-la-matiere.ts";
import type { DefiTermine } from "../domain/seance-de-defi.ts";
import type { FilesDeRevisionEnMemoire } from "./files-de-revision-en-memoire.ts";

/** Enregistre le défi terminé et la file d'un seul geste : tout ou rien. */
export class DefisTerminesEnMemoire implements DefisTermines {
  private readonly defis = new Map<string, DefiTermine>();

  constructor(private readonly files: FilesDeRevisionEnMemoire) {}

  releves(enfant: string): Promise<readonly DefiReleve[]> {
    return Promise.resolve(
      this.tous().filter((fait) => fait.enfant === enfant).map(({ defi }) => ({
        matiere: defi.matiere,
        niveau: defi.niveau,
        numero: defi.numero,
      })),
    );
  }

  enregistrer(fait: DefiTermine, { file, versionLue }: FileDeRevisionALEcrire): Promise<IssueDeLEnregistrement> {
    if (this.defis.has(fait.id)) return Promise.resolve("dejaEnregistree");
    if (this.files.version(file.enfant) !== versionLue) return Promise.resolve("conflit");
    this.defis.set(fait.id, fait);
    this.files.ecrire(file);
    return Promise.resolve("enregistree");
  }

  tous(): DefiTermine[] {
    return [...this.defis.values()];
  }
}
