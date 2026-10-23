// Réglages que les scénarios prévoient pour un profil enfant (Léa, Tom) avant que le profil existe quelque part :
// ils sont appliqués au profil préparé sur l'appareil (page de démonstration) ou au profil créé dans Supabase,
// selon le chemin que prend le scénario.

import type { Page } from "@playwright/test";

export type ReglagesBruts = {
  modeDys?: boolean;
  toutLireAVoixHaute?: boolean;
  parcoursLibre?: boolean;
  clavierDesDictees?: string;
  langueDuParent?: string;
};

const prevus = new WeakMap<Page, Map<string, ReglagesBruts>>();

export function reglagesPrevus(page: Page, prenom: string): ReglagesBruts {
  let parPrenom = prevus.get(page);
  if (!parPrenom) {
    parPrenom = new Map();
    prevus.set(page, parPrenom);
  }
  let reglages = parPrenom.get(prenom);
  if (!reglages) {
    reglages = {};
    parPrenom.set(prenom, reglages);
  }
  return reglages;
}

export function prenomsAvecReglagesPrevus(page: Page): string[] {
  return [...(prevus.get(page)?.keys() ?? [])];
}

/** Le profil préparé de l'appareil, complété par les réglages prévus pour ce prénom. */
export function avecLesReglagesPrevus<T extends { prenom: string; reglages?: ReglagesBruts }>(page: Page, profil: T): T {
  const reglages = { ...profil.reglages, ...reglagesPrevus(page, profil.prenom) };
  return Object.keys(reglages).length === 0 ? profil : { ...profil, reglages };
}
