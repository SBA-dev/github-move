import type { EffetSonore } from "../../voix/domain/index.ts";
import type { MomentDeCelebration } from "./moment-de-celebration.ts";
import type { Hasard } from "./hasard.ts";
import { tirerDans } from "./paroles.ts";
import type { CleUnivers } from "./univers.ts";

const CLES_DE_VARIANTE = {
  sports: ["glissade", "avion", "danse"],
  danse: ["jete", "ruban", "sauts"],
} as const;

export type UniversCelebre = keyof typeof CLES_DE_VARIANTE;

export type VarianteDe<U extends UniversCelebre> = (typeof CLES_DE_VARIANTE)[U][number];

export const VARIANTES_DES_UNIVERS: { readonly [U in UniversCelebre]: readonly VarianteDe<U>[] } = CLES_DE_VARIANTE;

export type CriDeVictoire = string;

type CelebrationDe<U extends UniversCelebre> = {
  readonly univers: U;
  readonly moment: MomentDeCelebration;
  readonly variante: { readonly cle: VarianteDe<U> };
  readonly cri: CriDeVictoire;
  readonly musique: EffetSonore;
};

export type CelebrationDeLUnivers = { [U in UniversCelebre]: CelebrationDe<U> }[UniversCelebre];

const CRIS_ET_MUSIQUES: Record<UniversCelebre, { readonly cri: CriDeVictoire; readonly musique: EffetSonore }> = {
  sports: { cri: "BUT !", musique: "grandeVictoire" },
  danse: { cri: "Bravo !", musique: "grandeVictoire" },
};

function celebrer<U extends UniversCelebre>(univers: U, moment: MomentDeCelebration, hasard: Hasard): CelebrationDe<U> {
  const cle: VarianteDe<U> = tirerDans(CLES_DE_VARIANTE[univers], hasard);
  return { univers, moment, variante: { cle }, ...CRIS_ET_MUSIQUES[univers] };
}

const CELEBRANTS: {
  readonly [U in UniversCelebre]: (moment: MomentDeCelebration, hasard: Hasard) => CelebrationDe<U>;
} = {
  sports: (moment, hasard) => celebrer("sports", moment, hasard),
  danse: (moment, hasard) => celebrer("danse", moment, hasard),
};

function estUniversCelebre(cle: CleUnivers): cle is UniversCelebre {
  return Object.hasOwn(CELEBRANTS, cle);
}

export function celebrationDe(
  moment: MomentDeCelebration,
  cle: CleUnivers,
  hasard: Hasard,
): CelebrationDeLUnivers | undefined {
  return estUniversCelebre(cle) ? CELEBRANTS[cle](moment, hasard) : undefined;
}
