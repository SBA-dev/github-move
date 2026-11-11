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
    for (const morceau of this.planAJouer(lecture)) {
      if (this.arrete) return;
      await this.jouer(morceau, lecture);
    }
  }

  arreter(): void {
    this.arrete = true;
    this.dependances.lecteurDePhrasesEnregistrees.arreter();
    this.dependances.voixDeLAppareil.arreter();
  }

  private planAJouer(lecture: LectureDemandee): MorceauDeLecture[] {
    const { repertoire, aUneVoixFrancaise } = this.dependances;
    const plan = planDeLecture(lecture, repertoire);
    if (aUneVoixFrancaise() || !this.manqueUnEnregistrement(lecture, plan)) return plan;
    const remplacement = lecture.texteEnregistreDeRemplacement;
    if (remplacement === undefined) throw new VoixIndisponible();
    const planDeRemplacement = planDeLecture(
      { ...lecture, phrases: [{ phrase: remplacement, hauteur: 1, rythme: 1 }] },
      repertoire,
    );
    if (this.manqueUnEnregistrement(lecture, planDeRemplacement)) throw new VoixIndisponible();
    return planDeRemplacement;
  }

  private manqueUnEnregistrement(lecture: LectureDemandee, plan: MorceauDeLecture[]): boolean {
    const estFrancaise = lecture.langue.toLowerCase().startsWith("fr");
    return estFrancaise && plan.some((morceau) => morceau.source === "voixDeLAppareil");
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
