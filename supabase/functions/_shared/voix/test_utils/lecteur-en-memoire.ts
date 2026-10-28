import { LectureImpossible, VoixBloquee } from "../domain/erreurs.ts";
import type { LecteurAVoixHaute, LectureDemandee } from "../domain/lecteur-a-voix-haute.ts";

export class LecteurEnMemoire implements LecteurAVoixHaute {
  readonly lectures: LectureDemandee[] = [];
  readonly appels: Array<"arreter" | "lire"> = [];
  private echec: Error | undefined;
  private finDeLaParole: (() => void) | undefined;
  private finAutomatique = true;
  private motsAnnonces: Array<{ phrase: number; position: number }> = [];

  constructor(private readonly journal: string[] = []) {}

  prononcerLesMots(...annonces: Array<{ phrase: number; position: number }>): void {
    this.motsAnnonces = annonces;
  }

  lireSansTerminerAutomatiquement(): void {
    this.finAutomatique = false;
  }

  terminerLaParole(): void {
    this.finDeLaParole?.();
    this.finDeLaParole = undefined;
  }

  bloquerLaVoix(): void {
    this.echec = new VoixBloquee();
  }

  debloquerLaVoix(): void {
    this.echec = undefined;
  }

  retirerLaSyntheseVocale(): void {
    this.echec = new LectureImpossible();
  }

  lire(lecture: LectureDemandee): Promise<void> {
    this.appels.push("lire");
    this.lectures.push(lecture);
    this.journal.push("parole");
    for (const { phrase, position } of this.motsAnnonces) lecture.onMot?.(phrase, position);
    if (this.echec) return Promise.reject(this.echec);
    if (this.finAutomatique) return Promise.resolve();
    return new Promise((resolve) => this.finDeLaParole = resolve);
  }

  arreter(): void {
    this.appels.push("arreter");
    if (!this.finDeLaParole) return;
    this.journal.push("arret-parole");
    this.finDeLaParole();
    this.finDeLaParole = undefined;
  }
}
