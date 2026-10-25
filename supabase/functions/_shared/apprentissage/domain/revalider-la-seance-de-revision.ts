import type { Lecon, Niveau } from "../../catalogue/domain/index.ts";
import { ReponseIncompatible } from "./erreurs.ts";
import type { FileDeRevision } from "./file-de-revision.ts";
import { Jour } from "./jour.ts";
import type { ReponseDonnee } from "./reponse.ts";
import { SeanceDeRevision, type SeanceDeRevisionTerminee } from "./seance-de-revision.ts";
import type { SeanceDeRevisionTermineeAEnregistrer } from "./seance-de-revision-terminee-a-enregistrer.ts";
import { tireurSelonLesTirages } from "./tireur.ts";

export function revaliderLaSeanceDeRevision(
  envoi: SeanceDeRevisionTermineeAEnregistrer,
  file: FileDeRevision,
  lecons: readonly Lecon[],
  niveau: Niveau,
): SeanceDeRevisionTerminee {
  const seance = SeanceDeRevision.commencer({
    id: envoi.id,
    enfant: envoi.enfant,
    plan: {
      questions: envoi.questions.flatMap((cle) =>
        file.questions.filter(({ identite }) => identite.valeur === cle.valeur)
      ),
    },
    lecons,
    tireur: tireurSelonLesTirages(envoi.tirages.values()),
    niveau,
  });
  envoi.reponses.flat().forEach((reponse) => rejouerLaReponse(seance, reponse));
  return seance.terminer(envoi.termineeLe, Jour.de(envoi.jour));
}

function rejouerLaReponse(seance: SeanceDeRevision, reponse: ReponseDonnee): void {
  if (reponse.genre === "jeNeSaisPas") seance.direJeNeSaisPas();
  else if (reponse.genre === "placement") throw new ReponseIncompatible(reponse.genre);
  else seance.repondre(reponse);
}
