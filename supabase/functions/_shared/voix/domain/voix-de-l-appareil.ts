import type { VoixDisponible } from "./voix-disponible.ts";

export interface VoixDeLAppareil {
  voixDisponibles(): readonly VoixDisponible[];
}
