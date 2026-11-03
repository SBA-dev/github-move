import type { EffetSonore } from "../../voix/domain/index.ts";
import type { MomentDeCelebration } from "./moment-de-celebration.ts";
import type { Hasard } from "./hasard.ts";
import { tirerDans } from "./paroles.ts";
import type { CleUnivers } from "./univers.ts";

export type VarianteDeLaCelebration = { readonly cle: string };

export type CriDeVictoire = string;

type CelebrationsDUnUnivers = {
  readonly variantes: readonly VarianteDeLaCelebration[];
  readonly cri: CriDeVictoire;
  readonly musique: EffetSonore;
};

export type CelebrationDeLUnivers = {
  readonly univers: CleUnivers;
  readonly moment: MomentDeCelebration;
  readonly variante: VarianteDeLaCelebration;
  readonly cri: CriDeVictoire;
  readonly musique: EffetSonore;
};

const CELEBRATIONS_DES_UNIVERS: Partial<Record<CleUnivers, CelebrationsDUnUnivers>> = {
  sports: {
    variantes: [{ cle: "glissade" }, { cle: "avion" }, { cle: "danse" }],
    cri: "BUT !",
    musique: "grandeVictoire",
  },
};

export function celebrationDe(
  moment: MomentDeCelebration,
  cle: CleUnivers,
  hasard: Hasard,
): CelebrationDeLUnivers | undefined {
  const celebrations = CELEBRATIONS_DES_UNIVERS[cle];
  if (!celebrations) return undefined;
  const { variantes, cri, musique } = celebrations;
  return { univers: cle, moment, variante: tirerDans(variantes, hasard), cri, musique };
}
