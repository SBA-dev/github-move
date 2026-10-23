import { LectureImpossible, VoixBloquee } from "../domain/erreurs.ts";
import type { LecteurAVoixHaute, LectureDemandee } from "../domain/lecteur-a-voix-haute.ts";

export class LecteurEnMemoire implements LecteurAVoixHaute {
  readonly lectures: LectureDemandee[] = [];
  readonly appels: Array<"arreter" | "lire"> = [];
  private echec: Error | undefined;
  private motsAnnonces: Array<{ phrase: number; position: number }> = [];

  prononcerLesMots(...annonces: Array<{ phrase: number; position: number }>): void {
    this.motsAnnonces = annonces;
  }

  bloquerLaVoix(): void {
    this.echec = new VoixBloquee();
  }

  retirerLaSyntheseVocale(): void {
    this.echec = new LectureImpossible();
  }

  lire(lecture: LectureDemandee): Promise<void> {
    this.appels.push("lire");
    this.lectures.push(lecture);
    for (const { phrase, position } of this.motsAnnonces) lecture.onMot?.(phrase, position);
    return this.echec ? Promise.reject(this.echec) : Promise.resolve();
  }

  arreter(): void {
    this.appels.push("arreter");
  }
}
