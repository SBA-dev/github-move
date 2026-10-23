import type { DonneesDeLAppareil } from "@domain/famille";
import { ProfilsGardesSurLAppareil } from "../famille/profils/profils-gardes-sur-l-appareil.ts";

// Ce que la déconnexion efface de l'appareil, en plus de la session que Supabase retire lui-même :
// la liste « Qui joue ? » du parent (story #11).
export class DonneesDeLAppareilNavigateur implements DonneesDeLAppareil {
  effacer(): Promise<void> {
    return new ProfilsGardesSurLAppareil().effacer();
  }
}
