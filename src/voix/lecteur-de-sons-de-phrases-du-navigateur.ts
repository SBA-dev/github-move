import {
  type InstantsDesMots,
  type LecteurDeSonsDePhrases,
  type SonDePhrase,
  SonIllisible,
  VoixBloquee,
} from "@domain/voix";

const COEFFICIENT_DE_SECURITE = 1.6;
const MARGE_DE_SECURITE_MS = 2500;

type ElementAudioSafari = HTMLAudioElement & { webkitPreservesPitch?: boolean };

/** Un MP3 bloqué sur le réseau sans `error` ni `ended` ne doit pas retenir la parole. */
function delaiDeSecuriteMs(son: SonDePhrase, rythme: number): number {
  return (son.dureeMs / rythme) * COEFFICIENT_DE_SECURITE + MARGE_DE_SECURITE_MS;
}

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
  private readonly audio: ElementAudioSafari = new Audio();
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
      let reglee = false;
      let garde: ReturnType<typeof setTimeout>;
      const armerLaGarde = () => {
        garde = setTimeout(() => {
          // Un média mis en pause par le navigateur (onglet masqué) n'est pas un son bloqué : on attend encore.
          if (document.hidden || audio.paused) return armerLaGarde();
          audio.pause();
          echouer(new SonIllisible());
        }, delaiDeSecuriteMs(son, rythme));
      };
      armerLaGarde();
      const nettoyer = () => {
        reglee = true;
        clearTimeout(garde);
        suivreLesMots?.();
        audio.removeEventListener("ended", terminer);
        audio.removeEventListener("error", echouer);
        if (this.terminerLaLectureEnCours === terminer) this.terminerLaLectureEnCours = undefined;
      };
      const terminer = () => {
        if (reglee) return;
        nettoyer();
        resolve();
      };
      const echouer = (erreur: unknown) => {
        if (reglee) return;
        nettoyer();
        reject(estUneAutorisationRefusee(erreur) ? new VoixBloquee() : new SonIllisible());
      };
      audio.addEventListener("ended", terminer);
      audio.addEventListener("error", echouer);
      this.terminerLaLectureEnCours = terminer;
      audio.src = son.fichier;
      audio.preservesPitch = true;
      audio.webkitPreservesPitch = true;
      audio.playbackRate = rythme;
      audio.play().catch(echouer);
    });
  }

  arreter(): void {
    this.audio.pause();
    this.terminerLaLectureEnCours?.();
  }
}
