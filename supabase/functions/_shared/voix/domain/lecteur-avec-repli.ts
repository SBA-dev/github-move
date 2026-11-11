import { phrasesAvecCle } from "./cle-de-phrase.ts";
import { VoixBloquee, VoixIndisponible } from "./erreurs.ts";
import { instantsDesMots } from "./instants-des-mots.ts";
import { estUneLangueFrancaise } from "./langue-francaise.ts";
import type { LecteurAVoixHaute, LectureDemandee } from "./lecteur-a-voix-haute.ts";
import type { LecteurDePhrasesEnregistrees, SuiviDUnMorceau } from "./lecteur-de-phrases-enregistrees.ts";
import { type MorceauDeLecture, planDeLecture, suitesDeMemeSource } from "./plan-de-lecture.ts";
import type { RepertoireDesPhrasesEnregistrees } from "./repertoire-des-phrases-enregistrees.ts";

type Dependances = {
  readonly repertoire: RepertoireDesPhrasesEnregistrees;
  readonly lecteurDePhrasesEnregistrees: LecteurDePhrasesEnregistrees;
  readonly voixDeLAppareil: LecteurAVoixHaute;
  readonly aUneVoixFrancaise: () => boolean;
};

export class LecteurAvecRepli implements LecteurAVoixHaute {
  private generation = 0;

  constructor(private readonly dependances: Dependances) {}

  async lire(lecture: LectureDemandee): Promise<void> {
    const generation = ++this.generation;
    try {
      await this.jouerLePlan(lecture, generation);
    } catch (erreur) {
      const remplacement = lecture.texteEnregistreDeRemplacement;
      if (!(erreur instanceof VoixIndisponible) || remplacement === undefined) throw erreur;
      if (!this.estToujoursEnCours(generation)) return;
      await this.jouerLePlan({
        ...lecture,
        phrases: phrasesDeRemplacement(lecture, remplacement),
        texteEnregistreDeRemplacement: undefined,
      }, generation);
    }
  }

  arreter(): void {
    this.generation++;
    this.dependances.lecteurDePhrasesEnregistrees.arreter();
    this.dependances.voixDeLAppareil.arreter();
  }

  private estToujoursEnCours(generation: number): boolean {
    return generation === this.generation;
  }

  private async jouerLePlan(lecture: LectureDemandee, generation: number): Promise<void> {
    const plan = planDeLecture(lecture, this.dependances.repertoire);
    if (plan.some((morceau) => morceau.source === "voixDeLAppareil")) {
      this.verifierQueLaVoixDeLAppareilPeutDireLaPhrase(lecture);
    }
    for (const suite of suitesDeMemeSource(plan)) {
      if (!this.estToujoursEnCours(generation)) return;
      if (suite[0]?.source === "voixDeLAppareil") {
        await this.direAvecLaVoixDeLAppareil(suite.map(({ rang }) => rang), lecture, generation);
        continue;
      }
      for (const morceau of suite) {
        if (!this.estToujoursEnCours(generation)) return;
        await this.jouerEnregistree(morceau, lecture, generation);
      }
    }
  }

  private verifierQueLaVoixDeLAppareilPeutDireLaPhrase(lecture: LectureDemandee): void {
    const estFrancaise = estUneLangueFrancaise(lecture.langue);
    if (estFrancaise && !this.dependances.aUneVoixFrancaise()) throw new VoixIndisponible();
  }

  private async jouerEnregistree(
    morceau: MorceauDeLecture,
    lecture: LectureDemandee,
    generation: number,
  ): Promise<void> {
    try {
      await this.dependances.lecteurDePhrasesEnregistrees.jouer(morceau, suiviDesMots(morceau, lecture));
    } catch (erreur) {
      if (erreur instanceof VoixBloquee) throw erreur;
      await this.direAvecLaVoixDeLAppareil([morceau.rang], lecture, generation);
    }
  }

  private async direAvecLaVoixDeLAppareil(
    rangs: readonly number[],
    lecture: LectureDemandee,
    generation: number,
  ): Promise<void> {
    if (rangs.length === 0 || !this.estToujoursEnCours(generation)) return;
    this.verifierQueLaVoixDeLAppareilPeutDireLaPhrase(lecture);
    await this.dependances.voixDeLAppareil.lire({
      ...lecture,
      phrases: lecture.phrases.filter((_, rang) => rangs.includes(rang)),
      onMot: lecture.onMot && ((phrase, position) => lecture.onMot?.(rangs[phrase] ?? phrase, position)),
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

function phrasesDeRemplacement(lecture: LectureDemandee, remplacement: string): LectureDemandee["phrases"] {
  const [premiere] = lecture.phrases;
  if (!premiere) return [];
  return phrasesAvecCle(remplacement).map(({ texte }) => ({ ...premiere, phrase: texte }));
}
