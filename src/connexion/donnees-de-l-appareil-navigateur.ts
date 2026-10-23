import type { DonneesDeLAppareil } from "@domain/famille";

// Aucune donnée de famille n'est encore gardée sur l'appareil en dehors de la connexion elle-même,
// que Supabase efface à la déconnexion. Les profils enfants hors ligne (IndexedDB) viendront avec la story #10.
export class DonneesDeLAppareilNavigateur implements DonneesDeLAppareil {
  effacer(): Promise<void> {
    return Promise.resolve();
  }
}
