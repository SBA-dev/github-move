// Le son et la voix ne démarrent que pendant un toucher (iPhone, iPad, Chrome) : au premier toucher,
// on déverrouille le contexte audio, une piste silencieuse en boucle et la synthèse vocale.
import { syntheseVocale } from "./lecteur-synthese-vocale.ts";

const EVENEMENTS_DE_TOUCHER = ["pointerdown", "touchend", "keydown", "click"] as const;
const FREQUENCE_HZ = 8000;
const ECHANTILLONS = 8000;
const SILENCE_8_BITS = 128;

function silenceEnWav(): string {
  const octets = new Uint8Array(44 + ECHANTILLONS);
  const vue = new DataView(octets.buffer);
  const ecrire = (position: number, texte: string) =>
    [...texte].forEach((lettre, i) => octets[position + i] = lettre.charCodeAt(0));
  ecrire(0, "RIFF");
  vue.setUint32(4, 36 + ECHANTILLONS, true);
  ecrire(8, "WAVEfmt ");
  vue.setUint32(16, 16, true);
  vue.setUint16(20, 1, true);
  vue.setUint16(22, 1, true);
  vue.setUint32(24, FREQUENCE_HZ, true);
  vue.setUint32(28, FREQUENCE_HZ, true);
  vue.setUint16(32, 1, true);
  vue.setUint16(34, 8, true);
  ecrire(36, "data");
  vue.setUint32(40, ECHANTILLONS, true);
  octets.fill(SILENCE_8_BITS, 44);
  return "data:audio/wav;base64," + btoa(String.fromCharCode(...octets));
}

function ignorerLEchec(action: () => unknown): void {
  try {
    const resultat = action();
    if (resultat instanceof Promise) resultat.catch(() => undefined);
  } catch {
    // Le déverrouillage est un plus : sans lui, la lecture tente quand même sa chance.
  }
}

export class DeverrouillageAudio {
  private contexte: AudioContext | undefined;
  private piste: HTMLAudioElement | undefined;
  private deverrouille = false;

  deverrouiller(): void {
    ignorerLEchec(() => {
      this.contexte ??= new AudioContext();
      if (this.contexte.state !== "running") return this.contexte.resume();
    });
    if (this.deverrouille) return;
    this.deverrouille = true;
    ignorerLEchec(() => this.demarrerLaPisteSilencieuse());
    ignorerLEchec(() => this.amorcerLeContexte());
    ignorerLEchec(() => this.amorcerLaSynthese());
  }

  relacher(): void {
    this.deverrouille = false;
    ignorerLEchec(() => this.piste?.pause());
  }

  private demarrerLaPisteSilencieuse() {
    if (!this.piste) {
      this.piste = new Audio(silenceEnWav());
      this.piste.loop = true;
      this.piste.setAttribute("playsinline", "");
    }
    return this.piste.play();
  }

  private amorcerLeContexte() {
    if (!this.contexte) return;
    const source = this.contexte.createBufferSource();
    source.buffer = this.contexte.createBuffer(1, 1, 22050);
    source.connect(this.contexte.destination);
    source.start(0);
  }

  private amorcerLaSynthese() {
    const synthese = syntheseVocale();
    if (!synthese) return;
    const enonce = new SpeechSynthesisUtterance(" ");
    enonce.volume = 0;
    synthese.speak(enonce);
  }
}

export function deverrouillerAuToucher(deverrouillage: DeverrouillageAudio): () => void {
  const surToucher = () => deverrouillage.deverrouiller();
  EVENEMENTS_DE_TOUCHER.forEach((nom) => document.addEventListener(nom, surToucher, true));
  return () => EVENEMENTS_DE_TOUCHER.forEach((nom) => document.removeEventListener(nom, surToucher, true));
}
