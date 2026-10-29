import { type EtatDesTenues, tenueDesPaliers, type TenueDuPersonnageGuide } from "./tenues.ts";

export type TenuePortee = string | undefined;

export class TenueInconnue extends Error {
  constructor(readonly cle: string) {
    super(`« ${cle} » n'est pas une tenue du personnage guide.`);
    this.name = "TenueInconnue";
  }
}

export class TenueNonRecue extends Error {
  constructor(readonly cle: string) {
    super(`La tenue « ${cle} » n'est pas encore reçue : il faut gagner plus d'étoiles.`);
    this.name = "TenueNonRecue";
  }
}

export function porterUneTenue(etatDesTenues: EtatDesTenues, cle: string): string {
  if (tenueDesPaliers(cle) === undefined) throw new TenueInconnue(cle);
  if (!etatDesTenues.tenuesRecues.some((tenue) => tenue.cle === cle)) throw new TenueNonRecue(cle);
  return cle;
}

export function retirerLaTenue(): TenuePortee {
  return undefined;
}

export function tenueAMontrer(
  tenuePortee: TenuePortee,
  etatDesTenues?: EtatDesTenues,
): TenueDuPersonnageGuide | undefined {
  const tenue = tenueDesPaliers(tenuePortee);
  if (tenue === undefined) return undefined;
  if (etatDesTenues && !etatDesTenues.tenuesRecues.some((recue) => recue.cle === tenue.cle)) return undefined;
  return tenue;
}
