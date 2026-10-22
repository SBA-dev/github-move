import type { CaractereDeLaVoix } from "./caractere-de-la-voix.ts";
import { CARACTERE_LANGUE_ETRANGERE, choisirVoix, choisirVoixDeLangue } from "./choix-de-voix.ts";
import { LectureImpossible, VoixBloquee } from "./erreurs.ts";
import type { Hasard } from "./hasard.ts";
import type { LecteurAVoixHaute } from "./lecteur-a-voix-haute.ts";
import { reglerPhrases } from "./reglage-de-phrase.ts";
import { texteALire } from "./texte-a-lire.ts";
import type { VoixDeLAppareil } from "./voix-de-l-appareil.ts";
import type { VoixDisponible } from "./voix-disponible.ts";

const LANGUE_FRANCAISE = "fr-FR";
const RYTHME_NORMAL = 1;

export type EtatDuSon = "son" | "muet";

export type DependancesDeLectureAVoixHaute = {
  readonly lecteur: LecteurAVoixHaute;
  readonly voixDeLAppareil: VoixDeLAppareil;
  readonly hasard: Hasard;
  readonly caractereDuPersonnageGuide: () => CaractereDeLaVoix;
  readonly etatInitial: EtatDuSon;
  readonly onVoixBloquee: () => void;
};

function debutsDesMots(phrase: string): number[] {
  return [...phrase.matchAll(/\S+/g)].map((mot) => mot.index);
}

function rangDesMots(
  phrases: readonly string[],
  onMot: (rang: number) => void,
): (phrase: number, position: number) => void {
  const debuts = phrases.map(debutsDesMots);
  const motsAvant = debuts.map((_, i) => debuts.slice(0, i).reduce((total, d) => total + d.length, 0));
  return (phrase, position) => {
    const dansLaPhrase = debuts[phrase].filter((debut) => debut <= position).length - 1;
    onMot(motsAvant[phrase] + Math.max(0, dansLaPhrase));
  };
}

export class LectureAVoixHaute {
  private etat: EtatDuSon;
  private voixBloqueeSignalee = false;

  constructor(private readonly dependances: DependancesDeLectureAVoixHaute) {
    this.etat = dependances.etatInitial;
  }

  async lire(
    brut: string,
    options: { langue?: string; onMot?: (rang: number) => void; onFin?: () => void } = {},
  ): Promise<void> {
    if (this.etat === "muet") return;
    const texte = texteALire(brut);
    if (!texte) return;
    const { lecteur, hasard } = this.dependances;
    const langue = options.langue ?? LANGUE_FRANCAISE;
    const voix = this.voixPour(langue);
    const caractere = options.langue ? CARACTERE_LANGUE_ETRANGERE : this.dependances.caractereDuPersonnageGuide();
    lecteur.arreter();
    try {
      await lecteur.lire({
        voix,
        langue,
        phrases: reglerPhrases(texte, caractere, voix, RYTHME_NORMAL, hasard),
        ...(options.onMot && { onMot: rangDesMots(texte.phrases, options.onMot) }),
      });
    } catch (erreur) {
      this.absorber(erreur);
    } finally {
      options.onFin?.();
    }
  }

  couperLaVoix(): void {
    this.dependances.lecteur.arreter();
  }

  passerEnMuet(): void {
    this.etat = "muet";
    this.couperLaVoix();
  }

  async remettreLeSon(salutation: string): Promise<void> {
    this.etat = "son";
    await this.lire(salutation);
  }

  private voixPour(langue: string): VoixDisponible | undefined {
    const voix = this.dependances.voixDeLAppareil.voixDisponibles();
    return langue === LANGUE_FRANCAISE
      ? choisirVoix(voix, this.dependances.caractereDuPersonnageGuide())
      : choisirVoixDeLangue(voix, langue);
  }

  private absorber(erreur: unknown): void {
    if (erreur instanceof LectureImpossible) return;
    if (!(erreur instanceof VoixBloquee)) throw erreur;
    if (this.voixBloqueeSignalee) return;
    this.voixBloqueeSignalee = true;
    this.dependances.onVoixBloquee();
  }
}
