import type { Allure } from "./allure.ts";
import { cleDePhrase } from "./cle-de-phrase.ts";
import type { LectureDemandee } from "./lecteur-a-voix-haute.ts";
import type { RepertoireDesPhrasesEnregistrees } from "./repertoire-des-phrases-enregistrees.ts";

export type MorceauDeLecture =
  | {
    readonly source: "enregistree";
    readonly phrase: string;
    readonly rang: number;
    readonly cle: string;
    readonly empreinte: string;
    readonly allure: Allure;
    readonly rythme: number;
  }
  | {
    readonly source: "voixDeLAppareil";
    readonly phrase: string;
    readonly rang: number;
    readonly rythme: number;
    readonly cle?: undefined;
    readonly empreinte?: undefined;
    readonly allure?: undefined;
  };

export function planDeLecture(
  lecture: LectureDemandee,
  repertoire: RepertoireDesPhrasesEnregistrees,
): MorceauDeLecture[] {
  const estFrancaise = lecture.langue.toLowerCase().startsWith("fr");
  return lecture.phrases.map(({ phrase, rythme }, rang): MorceauDeLecture => {
    const cle = cleDePhrase(phrase);
    const enregistrement = estFrancaise ? repertoire.phrases[cle] : undefined;
    if (!enregistrement) return { source: "voixDeLAppareil", phrase, rang, rythme };
    const lente = lecture.allure === "lente" ? enregistrement.lente : undefined;
    return {
      source: "enregistree",
      phrase,
      rang,
      cle,
      empreinte: lente ?? enregistrement.normale,
      allure: lente ? "lente" : "normale",
      rythme,
    };
  });
}
