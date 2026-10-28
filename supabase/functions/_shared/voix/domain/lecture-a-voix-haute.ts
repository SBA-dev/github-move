import type { CaractereDeLaVoix } from "./caractere-de-la-voix.ts";
import { CARACTERE_LANGUE_ETRANGERE, choisirVoix, choisirVoixDeLangue, ChoixDeVoix } from "./choix-de-voix.ts";
import type { ChoixDeVoixDeLAppareil } from "./choix-de-voix-de-l-appareil.ts";
import { LectureImpossible, VoixBloquee } from "./erreurs.ts";
import type { EffetSonore } from "./effet-sonore.ts";
import type { Hasard } from "./hasard.ts";
import type { LecteurAVoixHaute } from "./lecteur-a-voix-haute.ts";
import type { LecteurDEffetsSonores } from "./lecteur-d-effets-sonores.ts";
import { phraseDEssai } from "./phrase-d-essai.ts";
import { reglerPhrases } from "./reglage-de-phrase.ts";
import { rangAffichePourChaqueMotPrononce } from "./mots-de-la-consigne.ts";
import { texteALire } from "./texte-a-lire.ts";
import type { VoixDeLAppareil } from "./voix-de-l-appareil.ts";
import type { VoixDisponible } from "./voix-disponible.ts";

const LANGUE_FRANCAISE = "fr-FR";
const RYTHME_NORMAL = 1;
const RYTHME_LENT = 0.65;

export type EtatDuSon = "son" | "muet";

export type DependancesDeLectureAVoixHaute = {
  readonly lecteur: LecteurAVoixHaute;
  readonly lecteurDEffetsSonores: LecteurDEffetsSonores;
  readonly voixDeLAppareil: VoixDeLAppareil;
  readonly choixDeVoix: ChoixDeVoixDeLAppareil;
  readonly hasard: Hasard;
  readonly caractereDuPersonnageGuide: () => CaractereDeLaVoix;
  readonly etatInitial: EtatDuSon;
  readonly onVoixBloquee: () => void;
  readonly onFinDeLaVoixBloquee: () => void;
};

export type ParoleEntendue = { readonly entendue: boolean };

const PAROLE_ENTENDUE: ParoleEntendue = { entendue: true };
const PAROLE_NON_ENTENDUE: ParoleEntendue = { entendue: false };

type OptionsDeLecture = {
  langue?: string;
  choix?: ChoixDeVoix;
  lent?: boolean;
  effetsAvant?: readonly EffetSonore[];
  onMot?: (rang: number) => void;
  onFin?: () => void;
};

function estFrancais(langue: string): boolean {
  return /^fr/i.test(langue);
}

function debutsDesMots(phrase: string): number[] {
  return [...phrase.matchAll(/\S+/g)].map((mot) => mot.index);
}

function rangDesMots(
  phrases: readonly string[],
  rangsAffiches: ReadonlyArray<number | undefined>,
  onMot: (rang: number) => void,
): (phrase: number, position: number) => void {
  const debuts = phrases.map(debutsDesMots);
  const motsAvant = debuts.map((_, i) => debuts.slice(0, i).reduce((total, d) => total + d.length, 0));
  return (phrase, position) => {
    const dansLaPhrase = (debuts[phrase] ?? []).filter((debut) => debut <= position).length - 1;
    const rang = rangsAffiches[(motsAvant[phrase] ?? 0) + Math.max(0, dansLaPhrase)];
    if (rang !== undefined) onMot(rang);
  };
}

export class LectureAVoixHaute {
  private etat: EtatDuSon;
  private voixSuspendue = false;
  private voixBloqueeSignalee = false;

  constructor(private readonly dependances: DependancesDeLectureAVoixHaute) {
    this.etat = dependances.etatInitial;
  }

  async lire(brut: string, options: OptionsDeLecture = {}): Promise<ParoleEntendue> {
    if (this.voixSuspendue) return PAROLE_NON_ENTENDUE;
    if (options.effetsAvant) await this.jouer(options.effetsAvant);
    if (this.etat === "muet") return PAROLE_NON_ENTENDUE;
    return await this.lireLeTexte(brut, options);
  }

  private async lireLeTexte(brut: string, options: OptionsDeLecture): Promise<ParoleEntendue> {
    const { lecteur, hasard } = this.dependances;
    lecteur.arreter();
    const texte = texteALire(brut);
    if (!texte) return PAROLE_NON_ENTENDUE;
    const langue = options.langue ?? LANGUE_FRANCAISE;
    const voix = this.voixPour(langue, options.choix ?? this.choixMemorise());
    const caractere = estFrancais(langue) ? this.dependances.caractereDuPersonnageGuide() : CARACTERE_LANGUE_ETRANGERE;
    try {
      await lecteur.lire({
        voix,
        langue,
        phrases: reglerPhrases(texte, caractere, voix, options.lent ? RYTHME_LENT : RYTHME_NORMAL, hasard),
        ...(options.onMot &&
          { onMot: rangDesMots(texte.phrases, rangAffichePourChaqueMotPrononce(brut), options.onMot) }),
      });
      this.signalerLaFinDeLaVoixBloquee();
      return PAROLE_ENTENDUE;
    } catch (erreur) {
      this.absorber(erreur);
      return PAROLE_NON_ENTENDUE;
    } finally {
      options.onFin?.();
    }
  }

  async jouer(effets: readonly EffetSonore[]): Promise<void> {
    for (const effet of effets) await this.dependances.lecteurDEffetsSonores.jouer(effet);
  }

  couperLaVoix(): void {
    this.dependances.lecteur.arreter();
  }

  suspendre(): void {
    this.voixSuspendue = true;
    this.couperLaVoix();
  }

  reprendre(): void {
    this.voixSuspendue = false;
  }

  passerEnMuet(): void {
    this.etat = "muet";
    this.couperLaVoix();
    this.signalerLaFinDeLaVoixBloquee();
  }

  async remettreLeSon(salutation: string): Promise<void> {
    this.etat = "son";
    await this.lire(salutation);
  }

  imposerUneVoix(nomDeLaVoix: string): void {
    this.dependances.choixDeVoix.memoriser(ChoixDeVoix.imposee(nomDeLaVoix));
  }

  revenirALaVoixAutomatique(): void {
    this.dependances.choixDeVoix.memoriser(ChoixDeVoix.automatique);
  }

  async essayerUneVoix(choix: ChoixDeVoix, nomDuPersonnageGuide: string): Promise<void> {
    if (this.etat === "muet") return;
    await this.lireLeTexte(phraseDEssai(nomDuPersonnageGuide), { choix });
  }

  private choixMemorise(): ChoixDeVoix {
    return this.dependances.choixDeVoix.lire();
  }

  private voixPour(langue: string, choix: ChoixDeVoix): VoixDisponible | undefined {
    const voix = this.dependances.voixDeLAppareil.voixDisponibles();
    return estFrancais(langue)
      ? choisirVoix(voix, this.dependances.caractereDuPersonnageGuide(), choix)
      : choisirVoixDeLangue(voix, langue);
  }

  private signalerLaFinDeLaVoixBloquee(): void {
    if (!this.voixBloqueeSignalee) return;
    this.voixBloqueeSignalee = false;
    this.dependances.onFinDeLaVoixBloquee();
  }

  private absorber(erreur: unknown): void {
    if (erreur instanceof LectureImpossible) return;
    if (!(erreur instanceof VoixBloquee)) throw erreur;
    if (this.voixBloqueeSignalee) return;
    this.voixBloqueeSignalee = true;
    this.dependances.onVoixBloquee();
  }
}
