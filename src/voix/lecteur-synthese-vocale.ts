import { type LecteurAVoixHaute, type LectureDemandee, LectureImpossible, VoixBloquee } from "@domain/voix";

const DELAI_AVANT_DE_PARLER_MS = 60;
const DUREE_MINIMALE_ESTIMEE_MS = 1200;
const DUREE_ESTIMEE_PAR_CARACTERE_MS = 70;
const MARGE_DE_SECURITE_MS = 2500;
const COEFFICIENT_DE_SECURITE = 1.6;
const ERREURS_D_ARRET_VOLONTAIRE = ["interrupted", "canceled"];

export function syntheseVocale(): SpeechSynthesis | undefined {
  return "speechSynthesis" in globalThis ? globalThis.speechSynthesis : undefined;
}

function delaiDeSecurite(lecture: LectureDemandee): number {
  const caracteres = lecture.phrases.reduce((total, { phrase }) => total + phrase.length, 0);
  const estimation = Math.max(DUREE_MINIMALE_ESTIMEE_MS, caracteres * DUREE_ESTIMEE_PAR_CARACTERE_MS);
  return estimation * COEFFICIENT_DE_SECURITE + MARGE_DE_SECURITE_MS;
}

export class LecteurSyntheseVocale implements LecteurAVoixHaute {
  private terminerLaLectureEnCours: (() => void) | undefined;

  lire(lecture: LectureDemandee): Promise<void> {
    const synthese = syntheseVocale();
    if (!synthese) return Promise.reject(new LectureImpossible());
    return new Promise((resolve, reject) => {
      const minuteries: Array<ReturnType<typeof setTimeout>> = [];
      let terminee = false;
      const terminer = (erreur?: VoixBloquee) => {
        if (terminee) return;
        terminee = true;
        minuteries.forEach(clearTimeout);
        if (this.terminerLaLectureEnCours === terminer) this.terminerLaLectureEnCours = undefined;
        if (erreur) reject(erreur);
        else resolve();
      };
      this.terminerLaLectureEnCours = terminer;
      minuteries.push(setTimeout(() => {
        this.annulerLaSynthese();
        terminer();
      }, delaiDeSecurite(lecture)));
      minuteries.push(setTimeout(() => {
        try {
          this.parler(synthese, lecture, terminer);
        } catch {
          this.annulerLaSynthese();
          terminer();
        }
      }, DELAI_AVANT_DE_PARLER_MS));
    });
  }

  arreter(): void {
    this.terminerLaLectureEnCours?.();
    this.annulerLaSynthese();
  }

  private annulerLaSynthese(): void {
    try {
      syntheseVocale()?.cancel();
    } catch {
      // Rien à arrêter : le navigateur ne lit pas.
    }
  }

  private parler(synthese: SpeechSynthesis, lecture: LectureDemandee, terminer: (erreur?: VoixBloquee) => void) {
    const voix = synthese.getVoices().find((v) => v.name === lecture.voix?.nom && v.lang === lecture.voix.langue);
    lecture.phrases.forEach(({ phrase, hauteur, rythme }, rang) => {
      const enonce = new SpeechSynthesisUtterance(phrase);
      enonce.lang = voix?.lang ?? lecture.langue;
      if (voix) enonce.voice = voix;
      enonce.pitch = hauteur;
      enonce.rate = rythme;
      enonce.volume = 1;
      enonce.onboundary = (evenement) => {
        if (evenement.name === undefined || evenement.name === "word") {
          lecture.onMot?.(rang, evenement.charIndex ?? 0);
        }
      };
      if (rang === lecture.phrases.length - 1) enonce.onend = () => terminer();
      enonce.onerror = (evenement) => {
        if (ERREURS_D_ARRET_VOLONTAIRE.includes(evenement.error)) return terminer();
        this.annulerLaSynthese();
        terminer(new VoixBloquee());
      };
      synthese.speak(enonce);
    });
    synthese.resume();
  }
}
