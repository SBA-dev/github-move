import { CleDeLaPhrase } from "./cle-de-la-phrase.ts";
import { estFrancais } from "./langue.ts";
import type { ReglageDePhrase } from "./reglage-de-phrase.ts";
import type { RepertoireDesSons } from "./repertoire-des-sons.ts";
import type { SonDePhrase } from "./son-de-phrase.ts";
import type { VoixDisponible } from "./voix-disponible.ts";

export type EtapeDeLecture =
  | { readonly type: "voixDeLApplication"; readonly son: SonDePhrase; readonly rythme: number }
  | { readonly type: "voixDeLAppareil"; readonly reglage: ReglageDePhrase }
  | { readonly type: "aucune"; readonly phrase: string };

export type PlanDeLecture = { readonly etapes: readonly EtapeDeLecture[] };

export type DemandeDePlanDeLecture = {
  readonly phrases: readonly ReglageDePhrase[];
  readonly langue: string;
  readonly repertoire: RepertoireDesSons;
  readonly voixDeLAppareil: VoixDisponible | undefined;
  readonly voixImposee: boolean;
};

export function planDeLecture(demande: DemandeDePlanDeLecture): PlanDeLecture {
  const sonsPermis = estFrancais(demande.langue) && !demande.voixImposee;
  return { etapes: demande.phrases.map((reglage) => etapeDe(reglage, demande, sonsPermis)) };
}

function etapeDe(reglage: ReglageDePhrase, demande: DemandeDePlanDeLecture, sonsPermis: boolean): EtapeDeLecture {
  const son = sonsPermis ? demande.repertoire.sonDe(CleDeLaPhrase.de(reglage.phrase)) : undefined;
  if (son) return { type: "voixDeLApplication", son, rythme: reglage.rythme };
  if (demande.voixDeLAppareil) return { type: "voixDeLAppareil", reglage };
  return { type: "aucune", phrase: reglage.phrase };
}
