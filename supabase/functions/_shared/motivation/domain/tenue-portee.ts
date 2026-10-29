import { type EtatDesTenues, PALIERS_DES_TENUES } from "./tenues.ts";

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
  if (!PALIERS_DES_TENUES.some((palier) => palier.tenue.cle === cle)) throw new TenueInconnue(cle);
  if (!etatDesTenues.tenuesRecues.some((tenue) => tenue.cle === cle)) throw new TenueNonRecue(cle);
  return cle;
}
