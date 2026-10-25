import { type Jour, jourDe } from "@domain/apprentissage";

/** Le jour du calendrier de l'appareil à cet instant : c'est lui qui date les erreurs à revoir et les questions dues. */
export function jourDuNavigateur(maintenant: Date): Jour {
  return jourDe(maintenant, maintenant.getTimezoneOffset());
}
