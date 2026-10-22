import { LectureImpossible, VoixBloquee } from "../domain/erreurs.ts";
import type { LectureDemandee, LecteurAVoixHaute } from "../domain/lecteur-a-voix-haute.ts";

export class LecteurEnMemoire implements LecteurAVoixHaute {
  readonly lectures: LectureDemandee[] = [];
  readonly appels: Array<"arreter" | "lire"> = [];
  private echec: Error | undefined;

  bloquerLaVoix(): void {
    this.echec = new VoixBloquee();
  }

  retirerLaSyntheseVocale(): void {
    this.echec = new LectureImpossible();
  }

  lire(lecture: LectureDemandee): Promise<void> {
    this.appels.push("lire");
    this.lectures.push(lecture);
    return this.echec ? Promise.reject(this.echec) : Promise.resolve();
  }

  arreter(): void {
    this.appels.push("arreter");
  }
}
