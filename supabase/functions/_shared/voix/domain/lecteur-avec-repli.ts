import { VoixBloquee, VoixIndisponible } from "./erreurs.ts";
import { instantsDesMots } from "./instants-des-mots.ts";
import type { LecteurAVoixHaute, LectureDemandee } from "./lecteur-a-voix-haute.ts";
import type { LecteurDePhrasesEnregistrees, SuiviDUnMorceau } from "./lecteur-de-phrases-enregistrees.ts";
import { type MorceauDeLecture, planDeLecture } from "./plan-de-lecture.ts";
import type { RepertoireDesPhrasesEnregistrees } from "./repertoire-des-phrases-enregistrees.ts";

type Dependances = {
  readonly repertoire: RepertoireDesPhrasesEnregistrees;
  readonly lecteurDePhrasesEnregistrees: LecteurDePhrasesEnregistrees;
  readonly voixDeLAppareil: LecteurAVoixHaute;
  readonly aUneVoixFrancaise: () => boolean;
};

export class LecteurAvecRepli implements LecteurAVoixHaute {
  private arrete = false;

  constructor(private readonly dependances: Dependances) {}

  async lire(lecture: LectureDemandee): Promise<void> {
    this.arrete = false;
    try {
      await this.jouerLePlan(lecture);
    } catch (erreur) {
      const remplacement = lecture.texteEnregistreDeRemplacement;
      if (!(erreur instanceof VoixIndisponible) || remplacement === undefined) throw erreur;
      await this.jouerLePlan({
        ...lecture,
        phrases: lecture.phrases.slice(0, 1).map((reglage) => ({ ...reglage, phrase: remplacement })),
        texteEnregistreDeRemplacement: undefined,
      });
    }
  }

  arreter(): void {
    this.arrete = true;
    this.dependances.lecteurDePhrasesEnregistrees.arreter();
    this.dependances.voixDeLAppareil.arreter();
  }

  private async jouerLePlan(lecture: LectureDemandee): Promise<void> {
    const plan = planDeLecture(lecture, this.dependances.repertoire);
    if (plan.some((morceau) => morceau.source === "voixDeLAppareil")) {
      this.verifierQueLaVoixDeLAppareilPeutDireLaPhrase(lecture);
    }
    for (const morceau of plan) {
      if (this.arrete) return;
      await this.jouer(morceau, lecture);
    }
  }

  private verifierQueLaVoixDeLAppareilPeutDireLaPhrase(lecture: LectureDemandee): void {
    const estFrancaise = lecture.langue.toLowerCase().startsWith("fr");
    if (estFrancaise && !this.dependances.aUneVoixFrancaise()) throw new VoixIndisponible();
  }

  private async jouer(morceau: MorceauDeLecture, lecture: LectureDemandee): Promise<void> {
    if (morceau.source === "enregistree") {
      try {
        await this.dependances.lecteurDePhrasesEnregistrees.jouer(morceau, suiviDesMots(morceau, lecture));
        return;
      } catch (erreur) {
        if (erreur instanceof VoixBloquee) throw erreur;
      }
    }
    this.verifierQueLaVoixDeLAppareilPeutDireLaPhrase(lecture);
    await this.dependances.voixDeLAppareil.lire({
      ...lecture,
      phrases: lecture.phrases.filter((_, rang) => rang === morceau.rang),
      onMot: lecture.onMot && ((_, position) => lecture.onMot?.(morceau.rang, position)),
    });
  }
}

function suiviDesMots(morceau: MorceauDeLecture, lecture: LectureDemandee): SuiviDUnMorceau {
  let instants: ReturnType<typeof instantsDesMots> = [];
  let annonces = 0;
  return {
    onDebut: (dureeMs) => instants = instantsDesMots(morceau.phrase, dureeMs),
    onProgression: (ecouleMs) => {
      for (const { position, debutMs } of instants.slice(annonces)) {
        if (debutMs > ecouleMs) return;
        annonces++;
        lecture.onMot?.(morceau.rang, position);
      }
    },
  };
}
