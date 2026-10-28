import type { Seance } from "@domain/apprentissage";
import { effetsSonoresApresUneBonneReponse } from "@domain/motivation";

/** Les effets sonores d'une bonne réponse de séance : le point gagné se lit par les questions réussies avant et après. */
export function effetsApresUneBonneReponse(seance: Seance, questionsReussiesAvant: number) {
  return effetsSonoresApresUneBonneReponse({
    questionsReussiesAvant,
    questionsReussiesApres: seance.avancement().questionsReussies,
    exerciceComplete: seance.exerciceCompleteParLaDerniereReponse(),
    pendantLeChronoDUneFluence: false,
  });
}
