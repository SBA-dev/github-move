import { DefiAVenir, DefiInconnu, DefiNonFini, PlanDuDefiIncoherent, QuestionHorsDuDefi } from "./erreurs.ts";
import type { DefiTermineAEnregistrer } from "./defi-termine-a-enregistrer.ts";
import { type Defi, type DefiReleve, defisDeLaMatiere, etatDuDefi } from "./defis-de-la-matiere.ts";
import { rejouerLaReponse } from "./rejouer-la-reponse.ts";
import { jourDeLAppareil } from "./jour-de-l-appareil.ts";
import { type EntreesDuParcours, parcoursDeLaMatiere } from "./parcours.ts";
import { estUnPlanPossible, type QuestionDuDefi, questionsPosablesDuDefi } from "./plan-du-defi.ts";
import { type DefiTermine, SeanceDeDefi } from "./seance-de-defi.ts";
import { tireurDeLaQuestionEnvoyee } from "./tireur.ts";

export function revaliderLeDefi(
  envoi: DefiTermineAEnregistrer,
  entrees: EntreesDuParcours,
  defisReleves: readonly DefiReleve[],
): DefiTermine {
  const { matiere, niveau, numero } = envoi.defi;
  const parcours = parcoursDeLaMatiere(entrees, matiere);
  const defi = defisDeLaMatiere(parcours, matiere, niveau).find((candidat) => candidat.numero === numero);
  if (!defi) throw new DefiInconnu();
  if (etatDuDefi(defi, parcours, defisReleves).genre === "aVenir") throw new DefiAVenir();

  const posables = questionsPosablesDuDefi(defi, entrees.lecons);
  const questions = envoi.questions.map((cle) => {
    const posable = posables.find(({ identite }) => identite.valeur === cle.valeur);
    if (!posable) throw new QuestionHorsDuDefi();
    return posable;
  });
  if (!estUnPlanPossible(defi, entrees.lecons, envoi.questions)) throw new PlanDuDefiIncoherent();

  return rejouer(envoi, entrees, questions, defi);
}

function rejouer(
  envoi: DefiTermineAEnregistrer,
  entrees: EntreesDuParcours,
  questions: readonly QuestionDuDefi[],
  defi: Defi,
): DefiTermine {
  const jour = jourDeLAppareil(envoi.jour, envoi.termineeLe);
  const seance = SeanceDeDefi.commencer({
    id: envoi.id,
    enfant: envoi.enfant,
    defi,
    plan: { questions },
    lecons: entrees.lecons,
    tireurDe: (identite) => tireurDeLaQuestionEnvoyee(envoi, identite),
    niveau: entrees.niveau,
  });
  questions.forEach((_, rang) => {
    for (const reponse of envoi.reponses[rang] ?? []) rejouerLaReponse(seance, reponse);
  });
  if (!seance.estFinie()) throw new DefiNonFini();
  return seance.terminer(envoi.termineeLe, jour);
}
