import type { VoixDeLAppareil } from "../domain/voix-de-l-appareil.ts";
import type { VoixDisponible } from "../domain/voix-disponible.ts";

export function voixEnMemoire(voix: readonly VoixDisponible[]): VoixDeLAppareil {
  return { voixDisponibles: () => voix };
}
