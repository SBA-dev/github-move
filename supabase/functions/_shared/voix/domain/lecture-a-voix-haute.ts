import type { CaractereDeLaVoix } from "./caractere-de-la-voix.ts";
import { CARACTERE_LANGUE_ETRANGERE, choisirVoix, choisirVoixDeLangue, ChoixDeVoix } from "./choix-de-voix.ts";
import type { ChoixDeVoixDeLAppareil } from "./choix-de-voix-de-l-appareil.ts";
import { LectureImpossible, VoixBloquee } from "./erreurs.ts";
import type { EffetSonore } from "./effet-sonore.ts";
import type { Hasard } from "./hasard.ts";
import type { LecteurAVoixHaute } from "./lecteur-a-voix-haute.ts";
import type { LecteurDEffetsSonores } from "./lecteur-d-effets-sonores.ts";
import type { InstantsDesMots } from "./instants-des-mots.ts";
import type { LecteurDeSonsDePhrases } from "./lecteur-de-sons-de-phrases.ts";
import type { SonDePhrase } from "./son-de-phrase.ts";
import { lireLePlan } from "./lecture-du-plan.ts";
import { planDeLecture } from "./plan-de-lecture.ts";
import { surlignage } from "./surlignage.ts";
import type { RepertoireDesSons } from "./repertoire-des-sons.ts";
import { estFrancais } from "./langue.ts";
import { phraseDEssai } from "./phrase-d-essai.ts";
import { reglerPhrases } from "./reglage-de-phrase.ts";
import { rangAffichePourChaqueMotPrononce } from "./mots-de-la-consigne.ts";
import { type TexteALire, texteALire } from "./texte-a-lire.ts";
import type { VoixDeLAppareil } from "./voix-de-l-appareil.ts";
import type { VoixDisponible } from "./voix-disponible.ts";

const LANGUE_FRANCAISE = "fr-FR";
const RYTHME_NORMAL = 1;
const RYTHME_LENT = 0.65;

export type EtatDuSon = "son" | "muet";

export type DependancesDeLectureAVoixHaute = {
  readonly lecteur: LecteurAVoixHaute;
  readonly lecteurDEffetsSonores: LecteurDEffetsSonores;
  readonly lecteurDeSonsDePhrases: LecteurDeSonsDePhrases;
  readonly repertoireDesSons: RepertoireDesSons;
  readonly voixDeLAppareil: VoixDeLAppareil;
  readonly choixDeVoix: ChoixDeVoixDeLAppareil;
  readonly hasard: Hasard;
  readonly caractereDuPersonnageGuide: () => CaractereDeLaVoix;
  readonly etatInitial: EtatDuSon;
  readonly onVoixBloquee: () => void;
  readonly onFinDeLaVoixBloquee: () => void;
  readonly onVoixAbsente: () => void;
  readonly onFinDeLaVoixAbsente: () => void;
};

export type ParoleEntendue = { readonly entendue: boolean };

const PAROLE_ENTENDUE: ParoleEntendue = { entendue: true };
const PAROLE_NON_ENTENDUE: ParoleEntendue = { entendue: false };

type OptionsDeLecture = {
  langue?: string;
  choix?: ChoixDeVoix;
  lent?: boolean;
  texteDit?: string;
  effetsAvant?: readonly EffetSonore[];
  onMot?: (rang: number) => void;
  onFin?: () => void;
};

export class LectureAVoixHaute {
  private etat: EtatDuSon;
  private voixSuspendue = false;
  private suiteDEffets = 0;
  private effetEnCours = false;
  private sonDuBouton: Promise<boolean> | undefined;
  private sonDuBoutonEnCours = false;
  private versionDuSonDuBouton = 0;
  private coupuresDeLaVoix = 0;
  private voixBloqueeSignalee = false;
  private voixAbsenteSignalee = false;
  private numeroDeLecture = 0;
  private sonDePhraseEnCours: number | undefined;
  private parolesEnCours = 0;

  constructor(private readonly dependances: DependancesDeLectureAVoixHaute) {
    this.etat = dependances.etatInitial;
  }

  async lire(brut: string, options: OptionsDeLecture = {}): Promise<ParoleEntendue> {
    if (this.voixSuspendue) return PAROLE_NON_ENTENDUE;
    const coupuresALaDemande = this.coupuresDeLaVoix;
    if (this.sonDuBouton && !await this.sonDuBouton) return PAROLE_NON_ENTENDUE;
    if (coupuresALaDemande !== this.coupuresDeLaVoix) return PAROLE_NON_ENTENDUE;
    this.arreterLesEffets();
    if (options.effetsAvant) {
      this.arreterLesVoix();
      if (!await this.jouerLesEffets(options.effetsAvant)) return PAROLE_NON_ENTENDUE;
    }
    if (this.etat === "muet") return PAROLE_NON_ENTENDUE;
    return await this.lireLeTexte(brut, options);
  }

  private async lireLeTexte(brut: string, options: OptionsDeLecture): Promise<ParoleEntendue> {
    const { lecteur, hasard } = this.dependances;
    this.arreterLesVoix();
    const texte = texteALire(brut);
    if (!texte) return PAROLE_NON_ENTENDUE;
    const langue = options.langue ?? LANGUE_FRANCAISE;
    const choix = options.choix ?? this.choixMemorise();
    const voix = this.voixPour(langue, choix);
    const caractere = estFrancais(langue) ? this.dependances.caractereDuPersonnageGuide() : CARACTERE_LANGUE_ETRANGERE;
    const numeroDeLecture = this.numeroDeLecture;
    this.parolesEnCours++;
    try {
      const rythme = options.lent ? RYTHME_LENT : RYTHME_NORMAL;
      const lireAvecPlan = (aLire: TexteALire) => {
        const reglages = reglerPhrases(aLire, caractere, voix, rythme, hasard);
        const plan = planDeLecture({
          phrases: reglages,
          langue,
          repertoire: this.dependances.repertoireDesSons,
          voixDeLAppareil: voix,
          voixImposee: choix.type === "imposee",
        });
        return { reglages, plan };
      };
      const texteDit = options.texteDit === undefined ? undefined : texteALire(options.texteDit);
      const lectureDuTexteDit = texteDit && lireAvecPlan(texteDit);
      const ditParLesSons = lectureDuTexteDit !== undefined &&
        lectureDuTexteDit.plan.etapes.every((etape) => etape.type === "voixDeLApplication");
      const { reglages, plan } = ditParLesSons ? lectureDuTexteDit : lireAvecPlan(texte);
      const resultat = await lireLePlan({
        plan,
        reglages,
        langue,
        voixDeLAppareil: voix,
        lecteur,
        jouerUnSon: (son, rythme, instantsDesMots, onMot) =>
          this.jouerUnSonDePhrase(son, rythme, instantsDesMots, onMot),
        surligner: options.onMot && !ditParLesSons
          ? surlignage(texte.phrases, rangAffichePourChaqueMotPrononce(brut), options.onMot)
          : undefined,
        interrompue: () => this.numeroDeLecture !== numeroDeLecture,
      });
      if (resultat === "interrompue") return PAROLE_NON_ENTENDUE;
      this.signalerLaFinDeLaVoixBloquee();
      if (resultat === "phraseNonDite") {
        this.signalerLaVoixAbsente();
        return PAROLE_NON_ENTENDUE;
      }
      this.signalerLaFinDeLaVoixAbsente();
      return PAROLE_ENTENDUE;
    } catch (erreur) {
      this.absorber(erreur);
      return PAROLE_NON_ENTENDUE;
    } finally {
      this.parolesEnCours--;
      options.onFin?.();
    }
  }

  async jouer(effets: readonly EffetSonore[]): Promise<void> {
    this.arreterLesVoix();
    this.arreterLesEffets();
    await this.jouerLesEffets(effets);
  }

  toucherUnBouton(): void {
    if (this.parolesEnCours > 0) return;
    this.dependances.lecteur.arreter();
    this.arreterLesEffets();
    this.arreterLeSonDuBouton();
    const sonDuBouton = this.jouerLeSonDuBouton().finally(() => {
      if (this.sonDuBouton === sonDuBouton) this.sonDuBouton = undefined;
    });
    this.sonDuBouton = sonDuBouton;
  }

  private async jouerLeSonDuBouton(): Promise<boolean> {
    if (this.voixSuspendue) return false;
    const version = this.versionDuSonDuBouton;
    this.sonDuBoutonEnCours = true;
    await this.jouerSansEchec("boutonTouche");
    if (version !== this.versionDuSonDuBouton) return false;
    this.sonDuBoutonEnCours = false;
    return true;
  }

  private arreterLeSonDuBouton(): void {
    this.versionDuSonDuBouton++;
    if (!this.sonDuBoutonEnCours) return;
    this.sonDuBoutonEnCours = false;
    this.dependances.lecteurDEffetsSonores.arreter();
  }

  private async jouerLesEffets(effets: readonly EffetSonore[]): Promise<boolean> {
    if (this.voixSuspendue) return false;
    const suite = this.suiteDEffets;
    for (const effet of effets) {
      if (suite !== this.suiteDEffets) return false;
      this.effetEnCours = true;
      await this.jouerSansEchec(effet);
      if (suite === this.suiteDEffets) this.effetEnCours = false;
    }
    return suite === this.suiteDEffets;
  }

  private async jouerSansEchec(effet: EffetSonore): Promise<void> {
    try {
      await this.dependances.lecteurDEffetsSonores.jouer(effet);
    } catch {
      return;
    }
  }

  private arreterLesEffets(): void {
    this.suiteDEffets++;
    if (!this.effetEnCours) return;
    this.effetEnCours = false;
    this.dependances.lecteurDEffetsSonores.arreter();
  }

  couperLaVoix(): void {
    this.coupuresDeLaVoix++;
    this.arreterLesVoix();
    this.arreterLesEffets();
  }

  suspendre(): void {
    this.voixSuspendue = true;
    this.couperLaVoix();
    this.arreterLeSonDuBouton();
  }

  reprendre(): void {
    this.voixSuspendue = false;
  }

  passerEnMuet(): void {
    this.etat = "muet";
    this.arreterLesVoix();
    this.signalerLaFinDeLaVoixBloquee();
    this.signalerLaFinDeLaVoixAbsente();
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

  private async jouerUnSonDePhrase(
    son: SonDePhrase,
    rythme: number,
    instantsDesMots?: InstantsDesMots,
    onMot?: (rang: number) => void,
  ): Promise<void> {
    const numero = this.numeroDeLecture;
    this.sonDePhraseEnCours = numero;
    try {
      await this.dependances.lecteurDeSonsDePhrases.jouer(son, rythme, instantsDesMots, onMot);
    } finally {
      if (this.sonDePhraseEnCours === numero) this.sonDePhraseEnCours = undefined;
    }
  }

  private arreterLesVoix(): void {
    this.numeroDeLecture++;
    this.dependances.lecteur.arreter();
    if (this.sonDePhraseEnCours === undefined) return;
    this.sonDePhraseEnCours = undefined;
    this.dependances.lecteurDeSonsDePhrases.arreter();
  }

  private signalerLaVoixAbsente(): void {
    if (this.voixAbsenteSignalee) return;
    this.voixAbsenteSignalee = true;
    this.dependances.onVoixAbsente();
  }

  private signalerLaFinDeLaVoixAbsente(): void {
    if (!this.voixAbsenteSignalee) return;
    this.voixAbsenteSignalee = false;
    this.dependances.onFinDeLaVoixAbsente();
  }

  private absorber(erreur: unknown): void {
    if (erreur instanceof LectureImpossible) return;
    if (!(erreur instanceof VoixBloquee)) throw erreur;
    if (this.voixBloqueeSignalee) return;
    this.voixBloqueeSignalee = true;
    this.dependances.onVoixBloquee();
  }
}
