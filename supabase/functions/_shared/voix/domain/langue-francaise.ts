import type { VoixDisponible } from "./voix-disponible.ts";

export function estUneLangueFrancaise(langue: string): boolean {
  return /^fr/i.test(langue);
}

export function aUneVoixFrancaise(voixDisponibles: readonly VoixDisponible[]): boolean {
  return voixDisponibles.some(({ langue }) => estUneLangueFrancaise(langue));
}
