import { type InstantsDesMots, type LecteurDeSonsDePhrases, type SonDePhrase, SonIllisible } from "@domain/voix";

function estUneAutorisationRefusee(erreur: unknown): boolean {
  return erreur instanceof DOMException && erreur.name === "NotAllowedError";
}

/** Annonce chaque mot à son instant. Renvoie la fonction qui arrête le suivi. */
function annoncerLesMots(
  audio: HTMLAudioElement,
  rythme: number,
  instantsDesMots: InstantsDesMots,
  onMot: (rang: number) => void,
): () => void {
  let prochainMot = 0;
  let image = 0;
  const suivre = () => {
    // `currentTime` est en temps du média ; les instants reçus sont déjà étirés par le rythme (temps réel de l'écoute).
    const tempsEcouleMs = (audio.currentTime * 1000) / rythme;
    while (prochainMot < instantsDesMots.debutsMs.length && instantsDesMots.debutsMs[prochainMot]! <= tempsEcouleMs) {
      onMot(prochainMot++);
    }
    image = requestAnimationFrame(suivre);
  };
  suivre();
  return () => cancelAnimationFrame(image);
}

export class LecteurDeSonsDePhrasesDuNavigateur implements LecteurDeSonsDePhrases {
  private readonly audio = new Audio();
  private terminerLaLectureEnCours: (() => void) | undefined;

  jouer(
    son: SonDePhrase,
    rythme: number,
    instantsDesMots?: InstantsDesMots,
    onMot?: (rang: number) => void,
  ): Promise<void> {
    this.arreter();
    const { audio } = this;
    return new Promise<void>((resolve, reject) => {
      const suivreLesMots = instantsDesMots && onMot
        ? annoncerLesMots(audio, rythme, instantsDesMots, onMot)
        : undefined;
      const nettoyer = () => {
        suivreLesMots?.();
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
