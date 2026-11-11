import type { LectureEmpechee } from "./useVoix.ts";

export function messageDeLectureEmpechee({ nomDuPersonnageGuide, cause }: LectureEmpechee): string {
  if (cause === "voixIndisponible") {
    return `${nomDuPersonnageGuide} ne peut pas lire cette phrase sur cet appareil. Lis-la avec un adulte, ou touche « Réécouter » plus tard.`;
  }
  return `La voix de ${nomDuPersonnageGuide} est bloquée par ce navigateur. Touche « Réécouter » pour réessayer, ou lis avec un adulte.`;
}
