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

export class LectureAVoixHaute {
  private etat: EtatDuSon;
  private voixBloqueeSignalee = false;

  constructor(private readonly dependances: DependancesDeLectureAVoixHaute) {
    this.etat = dependances.etatInitial;
  }

  async lire(brut: string, options: { langue?: string } = {}): Promise<void> {
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
      });
    } catch (erreur) {
      this.absorber(erreur);
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
