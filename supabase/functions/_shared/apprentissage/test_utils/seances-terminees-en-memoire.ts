import type { ResultatDeLaLecon } from "../domain/resultat-de-la-lecon.ts";
import type { SeanceTerminee } from "../domain/seance.ts";
import type { FileDeRevisionALEcrire } from "../application/ports/seances-terminees.ts";
import type { FilesDeRevisionEnMemoire } from "./files-de-revision-en-memoire.ts";
import type { ResultatsDesLeconsEnMemoire } from "./resultats-des-lecons-en-memoire.ts";

type Issue = "enregistree" | "dejaEnregistree" | "conflit";

/** Enregistre la séance et le résultat de la leçon d'un seul geste : tout ou rien. */
export class SeancesTermineesEnMemoire {
  private readonly seances = new Map<string, SeanceTerminee>();
  private echecAuProchainAppel = false;

  constructor(
    private readonly resultats: ResultatsDesLeconsEnMemoire,
    private readonly files: FilesDeRevisionEnMemoire,
  ) {}

  echouerAuProchainAppel(): void {
    this.echecAuProchainAppel = true;
  }

  enregistrerAvecLeResultat(
    fait: SeanceTerminee,
    resultat: ResultatDeLaLecon,
    nombreDeSeancesLu: number,
    file?: FileDeRevisionALEcrire,
  ): Promise<Issue> {
    return Promise.resolve(this.enregistrerSansAttendre(fait, resultat, nombreDeSeancesLu, file));
  }

  /** Enregistre une séance qui ne touche pas au résultat de la leçon (fluence seule). */
  enregistrerSansResultat(fait: SeanceTerminee): Promise<"enregistree" | "dejaEnregistree"> {
    if (this.echecAuProchainAppel) {
      this.echecAuProchainAppel = false;
      return Promise.reject(new Error("écriture impossible"));
    }
    if (this.seances.has(fait.seance)) return Promise.resolve("dejaEnregistree");
    this.seances.set(fait.seance, fait);
    return Promise.resolve("enregistree");
  }

  private enregistrerSansAttendre(
    fait: SeanceTerminee,
    resultat: ResultatDeLaLecon,
    nombreDeSeancesLu: number,
    file?: FileDeRevisionALEcrire,
  ): Issue {
    if (this.echecAuProchainAppel) {
      this.echecAuProchainAppel = false;
      throw new Error("écriture impossible");
    }
    if (this.seances.has(fait.seance)) return "dejaEnregistree";
    if (this.resultats.nombreDeSeances(fait.enfant, fait.lecon) !== nombreDeSeancesLu) return "conflit";
    if (file && this.files.version(file.file.enfant) !== file.versionLue) return "conflit";
    this.seances.set(fait.seance, fait);
    this.resultats.ecrire(resultat);
    if (file) this.files.ecrire(file.file);
    return "enregistree";
  }

  toutes(): SeanceTerminee[] {
    return [...this.seances.values()];
  }
}
