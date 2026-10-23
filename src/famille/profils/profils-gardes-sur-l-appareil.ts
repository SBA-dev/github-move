import type { DonneesDeLAppareil } from "@domain/famille";
import { estUneLigneDeProfil, type LigneDeProfil } from "./ligne-de-profil.ts";

const BASE = "savanturier-appareil";
const MAGASIN = "profils-du-parent";
const CLE = "liste";

type Garde = { readonly parent: string; readonly lignes: readonly LigneDeProfil[] };

function estUneGarde(valeur: unknown): valeur is Garde {
  if (typeof valeur !== "object" || valeur === null) return false;
  const { parent, lignes } = valeur as Record<string, unknown>;
  return typeof parent === "string" && Array.isArray(lignes) && lignes.every(estUneLigneDeProfil);
}

function ouvrir(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const demande = indexedDB.open(BASE, 1);
    demande.onupgradeneeded = () => demande.result.createObjectStore(MAGASIN);
    demande.onsuccess = () => resolve(demande.result);
    demande.onerror = () => reject(demande.error);
  });
}

async function dansLeMagasin<T>(mode: IDBTransactionMode, operation: (magasin: IDBObjectStore) => IDBRequest<T>): Promise<T> {
  const base = await ouvrir();
  try {
    return await new Promise<T>((resolve, reject) => {
      const transaction = base.transaction(MAGASIN, mode);
      const demande = operation(transaction.objectStore(MAGASIN));
      transaction.oncomplete = () => resolve(demande.result);
      transaction.onerror = () => reject(transaction.error);
      transaction.onabort = () => reject(transaction.error);
    });
  } finally {
    base.close();
  }
}

/**
 * La liste « Qui joue ? » du parent connecté, gardée sur l'appareil pour choisir son profil sans réseau.
 * Effacée à la déconnexion. Un stockage indisponible (navigation privée) ne bloque jamais l'application.
 */
export class ProfilsGardesSurLAppareil implements DonneesDeLAppareil {
  async lire(parent: string): Promise<readonly LigneDeProfil[] | undefined> {
    try {
      const garde = await dansLeMagasin("readonly", (magasin) => magasin.get(CLE));
      return estUneGarde(garde) && garde.parent === parent ? garde.lignes : undefined;
    } catch {
      return undefined;
    }
  }

  async garder(parent: string, lignes: readonly LigneDeProfil[]): Promise<void> {
    try {
      await dansLeMagasin("readwrite", (magasin) => magasin.put({ parent, lignes }, CLE));
    } catch {
      // Sans stockage, « Qui joue ? » demandera simplement le réseau.
    }
  }

  async effacer(): Promise<void> {
    try {
      await dansLeMagasin("readwrite", (magasin) => magasin.clear());
    } catch {
      // Rien à effacer si le stockage est indisponible.
    }
  }
}
