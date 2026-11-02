import type { LeconId, Parcours } from "./parcours.ts";

export type PartieDuParcours = Readonly<{ numero: number; lecons: readonly LeconId[] }>;

const TAILLE_D_UNE_PARTIE = 5;
const TAILLE_MINIMALE_D_UNE_DERNIERE_PARTIE = 3;

export function partiesDuParcours(parcours: Parcours): PartieDuParcours[] {
  const lecons = parcours.lecons.map(({ lecon }) => lecon);
  const parties: PartieDuParcours[] = [];
  let debut = 0;
  while (debut < lecons.length) {
    const reste = lecons.length - (debut + TAILLE_D_UNE_PARTIE);
    const fin = reste < TAILLE_MINIMALE_D_UNE_DERNIERE_PARTIE ? lecons.length : debut + TAILLE_D_UNE_PARTIE;
    parties.push({ numero: parties.length + 1, lecons: lecons.slice(debut, fin) });
    debut = fin;
  }
  return parties;
}
