import type { DonneesDeLAppareil } from "@domain/famille";
import { ProfilsGardesSurLAppareil } from "../famille/profils/profils-gardes-sur-l-appareil.ts";
import { SeancesGardeesSurLAppareil } from "../seance/fin-de-seance/seances-gardees-sur-l-appareil.ts";

// Ce que la déconnexion efface de l'appareil, en plus de la session que Supabase retire lui-même :
// la liste « Qui joue ? » du parent (story #11) et les séances terminées pas encore enregistrées (story #24).
export class DonneesDeLAppareilNavigateur implements DonneesDeLAppareil {
  effacer(): Promise<void> {
    return Promise.all([new ProfilsGardesSurLAppareil().effacer(), new SeancesGardeesSurLAppareil().effacer()]).then(() => undefined);
  }
}
