import { Jour } from "@domain/apprentissage";
import { jourDuNavigateur } from "./jour-du-navigateur.ts";

/** Le jour enregistré avec la séance ; à défaut (séance sans jour), le jour de l'appareil à sa date de fin. */
export function jourDeLaSeance(jourEnregistre: unknown, termineeLe: Date): Jour {
  if (typeof jourEnregistre === "string") {
    try {
      return Jour.de(jourEnregistre);
    } catch {
      return jourDuNavigateur(termineeLe);
    }
  }
  return jourDuNavigateur(termineeLe);
}
