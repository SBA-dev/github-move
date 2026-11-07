import { type LecteurDeSonsDePhrases, type SonDePhrase, SonIllisible } from "@domain/voix";

function estUneAutorisationRefusee(erreur: unknown): boolean {
  return erreur instanceof DOMException && erreur.name === "NotAllowedError";
}

export class LecteurDeSonsDePhrasesDuNavigateur implements LecteurDeSonsDePhrases {
  private readonly audio = new Audio();
  private terminerLaLectureEnCours: (() => void) | undefined;

  jouer(son: SonDePhrase, rythme: number): Promise<void> {
    this.arreter();
    const { audio } = this;
    return new Promise<void>((resolve, reject) => {
      const nettoyer = () => {
        audio.removeEventListener("ended", terminer);
        audio.removeEventListener("error", echouer);
        this.terminerLaLectureEnCours = undefined;
      };
      const terminer = () => {
        nettoyer();
        resolve();
      };
      const echouer = (erreur: unknown) => {
        nettoyer();
        reject(estUneAutorisationRefusee(erreur) ? erreur : new SonIllisible());
      };
      audio.addEventListener("ended", terminer);
      audio.addEventListener("error", echouer);
      this.terminerLaLectureEnCours = terminer;
      audio.src = son.fichier;
      audio.preservesPitch = true;
      audio.playbackRate = rythme;
      audio.play().catch(echouer);
    });
  }

  arreter(): void {
    this.audio.pause();
    this.terminerLaLectureEnCours?.();
  }
}
