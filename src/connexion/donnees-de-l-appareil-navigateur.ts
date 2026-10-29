import type { DonneesDeLAppareil } from "@domain/famille";
import { oublierLesDefisReleves } from "../defis/defis-releves-sur-l-appareil.ts";
import { ProfilsGardesSurLAppareil } from "../famille/profils/profils-gardes-sur-l-appareil.ts";
import { oublierLesFilesDeRevision } from "../revision/copie-de-la-file-sur-l-appareil.ts";
import { SeancesDeRevisionGardeesSurLAppareil } from "../revision/seances-de-revision-gardees-sur-l-appareil.ts";
import { SeancesGardeesSurLAppareil } from "../seance/fin-de-seance/seances-gardees-sur-l-appareil.ts";
import { oublierLesTenuesPortees } from "../tenue/index.ts";
import { TestsDeDepartGardesSurLAppareil } from "../test-de-depart/tests-de-depart-gardes-sur-l-appareil.ts";

// Ce que la déconnexion efface de l'appareil, en plus de la session que Supabase retire lui-même :
// la liste « Qui joue ? » du parent (story #11) les séances terminées pas encore enregistrées (story #24)
// les tests de départ terminés pas encore enregistrés (story #27),
// les séances de révision terminées pas encore enregistrées et la copie de la file de révision (story #28),
// les défis relevés connus de l'appareil (story #100),
// la tenue portée par le personnage guide de chaque enfant (story #102).
export class DonneesDeLAppareilNavigateur implements DonneesDeLAppareil {
  effacer(): Promise<void> {
    oublierLesFilesDeRevision();
    oublierLesDefisReleves();
    oublierLesTenuesPortees();
    return Promise.all([
      new ProfilsGardesSurLAppareil().effacer(),
      new SeancesGardeesSurLAppareil().effacer(),
      new TestsDeDepartGardesSurLAppareil().effacer(),
      new SeancesDeRevisionGardeesSurLAppareil().effacer(),
    ]).then(() => undefined);
  }
}
