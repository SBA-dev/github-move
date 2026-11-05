import { type CleDeTenue, PALIERS_DES_TENUES, type TenueDuPersonnageGuide } from "@domain/motivation";

/** La clé de la tenue que la scène dessine, au type que ses dessins attendent ; rien pour une tenue inconnue d'eux. */
export function cleDeTenueDeLaScene(tenue: TenueDuPersonnageGuide | undefined): CleDeTenue | undefined {
  return PALIERS_DES_TENUES.find((palier) => palier.tenue.cle === tenue?.cle)?.tenue.cle;
}
