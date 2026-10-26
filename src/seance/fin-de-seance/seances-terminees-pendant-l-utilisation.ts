import type { Jour } from "@domain/apprentissage";

/** Une séance terminée : sa leçon, sa date de fin, et le jour du calendrier de l'appareil où elle a été finie. */
export type SeanceTermineeConnue = { readonly lecon: string; readonly termineeLe: Date; readonly jour: Jour };

const terminees = new Map<string, readonly SeanceTermineeConnue[]>();
const identifiants = new Map<string, readonly string[]>();

/** Retient l'identifiant, la leçon, la date et le jour de fin d'une séance terminée dans ce navigateur, même si le serveur l'a refusée ou ne l'a pas reçue. */
export function retenirLaSeanceTerminee(profil: string, seance: SeanceTermineeConnue, identifiant: string): void {
  terminees.set(profil, [...seancesTermineesPendantLUtilisation(profil), seance]);
  identifiants.set(profil, [...identifiantsDesSeancesTermineesPendantLUtilisation(profil), identifiant]);
}

export function identifiantsDesSeancesTermineesPendantLUtilisation(profil: string): readonly string[] {
  return identifiants.get(profil) ?? [];
}

export function seancesTermineesPendantLUtilisation(profil: string): readonly SeanceTermineeConnue[] {
  return terminees.get(profil) ?? [];
}

export function derniereSeanceTermineePendantLUtilisation(profil: string): SeanceTermineeConnue | undefined {
  return seancesTermineesPendantLUtilisation(profil).reduce<SeanceTermineeConnue | undefined>(
    (recente, seance) => (recente && recente.termineeLe > seance.termineeLe ? recente : seance),
    undefined,
  );
}

export function oublierLesSeancesTerminees(): void {
  terminees.clear();
  identifiants.clear();
}
