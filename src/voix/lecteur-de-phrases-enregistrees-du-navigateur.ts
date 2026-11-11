import {
  adresseDuMp3,
  type LecteurDePhrasesEnregistrees,
  type MorceauDeLecture,
  type SuiviDUnMorceau,
  VoixBloquee,
} from "@domain/voix";

const INTERVALLE_DE_PROGRESSION_MS = 50;

export class LecteurDePhrasesEnregistreesDuNavigateur implements LecteurDePhrasesEnregistrees {
  private readonly audio = new Audio();
  private terminerLaLectureEnCours: (() => void) | undefined;

  jouer(morceau: MorceauDeLecture, suivi: SuiviDUnMorceau): Promise<void> {
    if (morceau.source !== "enregistree") return Promise.reject(new Error("Morceau sans phrase enregistrée"));
    this.arreter();
    const { audio } = this;
    return new Promise<void>((resolve, reject) => {
      let minuterie: ReturnType<typeof setInterval> | undefined;
      const vitesse = () => audio.playbackRate;
      const progresser = () => suivi.onProgression((audio.currentTime * 1000) / vitesse());
      const terminer = (erreur?: Error) => {
        clearInterval(minuterie);
        audio.removeEventListener("loadedmetadata", demarrer);
        audio.removeEventListener("ended", finir);
        audio.removeEventListener("error", echouer);
        if (this.terminerLaLectureEnCours === terminer) this.terminerLaLectureEnCours = undefined;
        if (erreur) reject(erreur);
        else resolve();
      };
      const finir = () => terminer();
      const echouer = () => terminer(new Error(`Phrase enregistrée illisible : ${audio.src}`));
      const demarrer = () => {
        suivi.onDebut((audio.duration * 1000) / vitesse());
        minuterie = setInterval(progresser, INTERVALLE_DE_PROGRESSION_MS);
      };
      this.terminerLaLectureEnCours = terminer;
      audio.addEventListener("loadedmetadata", demarrer);
      audio.addEventListener("ended", finir);
      audio.addEventListener("error", echouer);
      audio.src = adresseDuMp3(morceau.cle, morceau.empreinte, morceau.allure);
      audio.muted = false;
      audio.preservesPitch = true;
      // Le MP3 lent est déjà ralenti : le rythme ne s'applique qu'à la voix normale.
      audio.playbackRate = morceau.allure === "lente" ? 1 : morceau.rythme;
      audio.play().catch((erreur: unknown) => {
        if (erreur instanceof DOMException && erreur.name === "AbortError") return;
        terminer(
          erreur instanceof DOMException && erreur.name === "NotAllowedError"
            ? new VoixBloquee()
            : erreurDeLecture(erreur),
        );
      });
    });
  }

  /** À appeler pendant un toucher : iPhone et iPad n'autorisent la lecture d'un MP3 qu'après un premier démarrage. */
  amorcer(silence: string): void {
    const { audio } = this;
    if (this.terminerLaLectureEnCours) return;
    audio.muted = true;
    audio.src = silence;
    audio.play().then(() => {
      if (audio.src !== silence) return;
      audio.pause();
      audio.muted = false;
    }).catch(() => {
      if (audio.src === silence) audio.muted = false;
    });
  }

  arreter(): void {
    this.terminerLaLectureEnCours?.();
    this.audio.pause();
    if (this.audio.readyState > 0) this.audio.currentTime = 0;
  }
}

function erreurDeLecture(erreur: unknown): Error {
  return erreur instanceof Error ? erreur : new Error("Phrase enregistrée illisible");
}
