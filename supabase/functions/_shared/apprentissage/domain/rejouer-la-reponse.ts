import { ReponseIncompatible } from "./erreurs.ts";
import type { AideDonnee } from "./question-jouee.ts";
import type { MotEcrit, ReponseDonnee, ReponseEnNombre, ReponseParChoix } from "./reponse.ts";

type SeanceDeQuestions = {
  repondre(reponse: ReponseParChoix | ReponseEnNombre | MotEcrit): unknown;
  direJeNeSaisPas(): AideDonnee;
};

export function rejouerLaReponse(seance: SeanceDeQuestions, reponse: ReponseDonnee): void {
  if (reponse.genre === "jeNeSaisPas") seance.direJeNeSaisPas();
  else if (reponse.genre === "placement") throw new ReponseIncompatible(reponse.genre);
  else seance.repondre(reponse);
}
